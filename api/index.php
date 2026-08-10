<?php
declare(strict_types=1);

use Stevenmaguire\OAuth2\Client\Provider\Keycloak;

$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
require_once __DIR__ . '/lib/PostgresSessionHandler.php';
require_once __DIR__ . '/lib/iam_identity.php';
require_once __DIR__ . '/lib/tracking_handler.php';
require_once __DIR__ . '/lib/training_tracking_handler.php';
load_app_environment($root);

$GLOBALS['request_id'] = bin2hex(random_bytes(8));

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Request-ID: ' . $GLOBALS['request_id']);
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Tracking-Key');
header('Access-Control-Max-Age: 86400');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'OPTIONS') {
    respond([], 204);
}
$path = $_SERVER['PATH_INFO'] ?? '';
if ($path === '') {
    $requestPath = parse_url($_SERVER['REQUEST_URI'] ?? '', PHP_URL_PATH) ?: '';
    $script = $_SERVER['SCRIPT_NAME'] ?? '';
    if ($script && str_starts_with($requestPath, $script)) {
        $path = substr($requestPath, strlen($script));
    }
}
$segments = array_values(array_filter(explode('/', $path), fn($part) => $part !== ''));
$resource = $segments[0] ?? '';

function json_body(): array
{
    $maximumBytes = env_int('API_MAX_BODY_BYTES', 65536, 1024, 1048576);
    $contentLength = filter_var($_SERVER['CONTENT_LENGTH'] ?? null, FILTER_VALIDATE_INT);
    if ($contentLength !== false && $contentLength > $maximumBytes) {
        fail(413, 'payload-too-large', 'Request body exceeds the allowed size.');
    }

    $stream = fopen('php://input', 'rb');
    $raw = $stream ? stream_get_contents($stream, $maximumBytes + 1) : false;
    if (is_resource($stream)) {
        fclose($stream);
    }
    if (is_string($raw) && strlen($raw) > $maximumBytes) {
        fail(413, 'payload-too-large', 'Request body exceeds the allowed size.');
    }
    if ($raw === false || trim($raw) === '') {
        return [];
    }
    $decoded = json_decode($raw, true);
    if (!is_array($decoded)) {
        fail(400, 'bad-request', 'Invalid JSON body.');
    }
    return $decoded;
}

function respond(array $payload = [], int $status = 200): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function fail(int $status, string $code, string $message): void
{
    respond([
        'error' => [
            'code' => $code,
            'message' => $message,
            'requestId' => $GLOBALS['request_id'] ?? null,
        ],
    ], $status);
}

function report_exception(Throwable $exception, string $context): void
{
    error_log(json_encode([
        'level' => 'error',
        'context' => $context,
        'request_id' => $GLOBALS['request_id'] ?? null,
        'exception' => get_class($exception),
        'message' => $exception->getMessage(),
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
}

function db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    try {
        $pdo = create_database_connection();
    } catch (Throwable $exception) {
        report_exception($exception, 'database-connect');
        fail(500, 'db-connect-error', 'Unable to connect to the database.');
    }

    return $pdo;
}

function is_https_request(): bool
{
    if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
        return true;
    }

    $forwardedProto = strtolower(trim(explode(',', (string)($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? ''))[0]));
    return $forwardedProto === 'https';
}

function is_local_request(): bool
{
    $host = strtolower((string)($_SERVER['HTTP_HOST'] ?? ''));
    $host = explode(':', $host)[0] ?? $host;

    return in_array($host, ['localhost', '127.0.0.1', '::1'], true);
}

function dev_bypass_enabled(): bool
{
    return is_local_request() || env_bool('AUTH_BYPASS_DEV', false);
}

function request_origin(): string
{
    $scheme = is_https_request() ? 'https' : 'http';
    return $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
}

function base64url_encode(string $value): string
{
    return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
}

function should_use_secure_session_cookie(): bool
{
    return env_bool('SESSION_COOKIE_SECURE', is_https_request()) && is_https_request();
}

function initialize_session(string $root): void
{
    $ttlSeconds = env_int('SESSION_TTL_SECONDS', 3600, 300, 86400);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.gc_maxlifetime', (string)$ttlSeconds);
    session_name(env_value('SESSION_COOKIE_NAME', 'ftc_session'));

    $driver = strtolower(is_local_request()
        ? env_value('SESSION_DRIVER_LOCAL', 'files')
        : env_value('SESSION_DRIVER', 'files'));
    if ($driver === 'database') {
        session_set_save_handler(new PostgresSessionHandler(fn(): PDO => db(), $ttlSeconds), true);
    } elseif ($driver === 'files') {
        $sessionPath = env_value('SESSION_SAVE_PATH', $root . DIRECTORY_SEPARATOR . 'scratch' . DIRECTORY_SEPARATOR . 'sessions');
        if (!is_dir((string)$sessionPath) && !@mkdir((string)$sessionPath, 0775, true) && !is_dir((string)$sessionPath)) {
            fail(500, 'session-config-error', 'Unable to initialize the session store.');
        }
        if (!is_writable((string)$sessionPath)) {
            fail(500, 'session-config-error', 'The session store is not writable.');
        }
        session_save_path((string)$sessionPath);
    } else {
        fail(500, 'session-config-error', 'Unsupported session driver.');
    }

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'httponly' => true,
        'samesite' => 'Lax',
        'secure' => should_use_secure_session_cookie(),
    ]);
    session_start();
}

function is_root_iam_callback(string $resource, string $method): bool
{
    return $resource === ''
        && $method === 'GET'
        && (isset($_GET['code']) || isset($_GET['error']) || isset($_GET['state']));
}

$requiresSession = api_resource_requires_session($resource) || $resource === 'dev' || is_root_iam_callback($resource, $method);

if ($requiresSession) {
    try {
        initialize_session($root);
    } catch (Throwable $exception) {
        report_exception($exception, 'session-start');
        fail(500, 'session-error', 'Unable to initialize the application session.');
    }
}

function mock_bypass_user(): array
{
    return [
        'user_id' => '00000000-0000-0000-0000-000000000001',
        'email' => 'dev-bypass@ftc.local',
        'role' => 'admin',
        'display_name' => 'KTV Admin (Bypass Mode)',
        'employee_id' => 'TECH_ADMIN',
        'profile_status' => 'enriched',
        'iam_subject' => 'dev-bypass-admin',
        'last_login_at' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
        'created_at' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
        'updated_at' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
    ];
}

function is_dev_bypass_session(): bool
{
    return dev_bypass_enabled() && (($_SESSION['iam_subject'] ?? null) === 'dev-bypass-admin');
}

function current_email(): ?string
{
    return $_SESSION['user_email'] ?? null;
}

function current_user_id(): ?string
{
    return $_SESSION['user_id'] ?? null;
}

function require_user(): array
{
    if (is_dev_bypass_session()) {
        return mock_bypass_user();
    }

    $userId = current_user_id();
    $email = current_email();
    if (!$userId && !$email) {
        if (dev_bypass_enabled()) {
            return mock_bypass_user();
        }
        fail(401, 'auth/unauthenticated', 'You must sign in first.');
    }

    $user = $userId ? find_user_by_id($userId) : find_user((string)$email);
    if (!$user) {
        if (dev_bypass_enabled()) {
            return mock_bypass_user();
        }
        unset($_SESSION['user_id'], $_SESSION['user_email'], $_SESSION['iam_subject']);
        fail(401, 'auth/unauthenticated', 'Session user no longer exists.');
    }
    return $user;
}

function require_admin(): array
{
    if (is_dev_bypass_session()) {
        return mock_bypass_user();
    }

    $user = require_user();
    if (($user['role'] ?? 'user') !== 'admin') {
        if (dev_bypass_enabled()) {
            return mock_bypass_user();
        }
        fail(403, 'permission-denied', 'Admin permission is required.');
    }
    return $user;
}

function normalize_email(string $email): string
{
    return strtolower(trim($email));
}

const USER_COLUMNS = 'user_id, email, employee_id, display_name, role, profile_status, iam_subject, last_login_at, iam_profile, created_at, updated_at';
const ACTIVITY_LOG_COLUMNS = 'id, created_at, event_type, user_id, technician_employee_id, technician_name, technician_email, email, user_email, action_title, title, lab_name, group_name, lab_url, device_name, device, severity, level, description, desc_text, client_ip, user_agent, payload';
const LOGIN_LOG_COLUMNS = 'id, created_at, event_type, user_id, employee_id, display_name, email, role, iam_subject, ip_address, user_agent, session_id_hash';

function find_user(string $email): ?array
{
    $stmt = db()->prepare('SELECT ' . USER_COLUMNS . ' FROM users WHERE email = :email');
    $stmt->execute(['email' => normalize_email($email)]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function find_user_by_id(string $userId): ?array
{
    $stmt = db()->prepare('SELECT ' . USER_COLUMNS . ' FROM users WHERE user_id = :user_id');
    $stmt->execute(['user_id' => $userId]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function user_response(?array $row): ?array
{
    if (!$row) {
        return null;
    }
    return [
        'id' => $row['user_id'],
        'userId' => $row['user_id'],
        'user_id' => $row['user_id'],
        'email' => $row['email'],
        'role' => $row['role'] ?? 'user',
        'profileStatus' => $row['profile_status'] ?? 'provisional',
        'profile_status' => $row['profile_status'] ?? 'provisional',
        'employeeId' => $row['employee_id'] ?? null,
        'employee_id' => $row['employee_id'] ?? null,
        'iamSubject' => $row['iam_subject'] ?? null,
        'iam_subject' => $row['iam_subject'] ?? null,
        'displayName' => $row['display_name'] ?? null,
        'display_name' => $row['display_name'] ?? null,
        'lastLoginAt' => $row['last_login_at'] ?? null,
        'last_login_at' => $row['last_login_at'] ?? null,
        'createdAt' => $row['created_at'] ?? null,
        'updatedAt' => $row['updated_at'] ?? null,
    ];
}

function log_response(array $row): array
{
    $payload = [];
    if (!empty($row['payload'])) {
        $decoded = json_decode((string)$row['payload'], true);
        if (is_array($decoded)) {
            $payload = $decoded;
        }
    }

    return array_merge($payload, [
        'id' => (string)$row['id'],
        'userId' => $row['user_id'] ?? null,
        'user_id' => $row['user_id'] ?? null,
        'actionTitle' => $row['action_title'] ?? null,
        'title' => $row['title'] ?? null,
        'labName' => $row['lab_name'] ?? null,
        'groupName' => $row['group_name'] ?? null,
        'labUrl' => $row['lab_url'] ?? null,
        'deviceName' => $row['device_name'] ?? null,
        'device' => $row['device'] ?? null,
        'eventType' => $row['event_type'] ?? 'lab_completed',
        'event_type' => $row['event_type'] ?? 'lab_completed',
        'technicianEmail' => $row['technician_email'] ?? $row['email'] ?? null,
        'technician_email' => $row['technician_email'] ?? $row['email'] ?? null,
        'technicianEmployeeId' => $row['technician_employee_id'] ?? null,
        'technician_employee_id' => $row['technician_employee_id'] ?? null,
        'technicianName' => $row['technician_name'] ?? null,
        'technician_name' => $row['technician_name'] ?? null,
        'clientIp' => $row['client_ip'] ?? null,
        'client_ip' => $row['client_ip'] ?? null,
        'userAgent' => $row['user_agent'] ?? null,
        'user_agent' => $row['user_agent'] ?? null,
        'severity' => $row['severity'] ?? 'LOW',
        'level' => $row['level'] ?? 'LOW',
        'description' => $row['description'] ?? null,
        'desc' => $row['desc_text'] ?? null,
        'email' => $row['email'] ?? null,
        'user' => $row['user_email'] ?? null,
        'createdAt' => $row['created_at'] ?? null,
        'timestamp' => $row['created_at'] ?? null,
    ]);
}

function login_log_response(array $row): array
{
    return [
        'id' => (string)$row['id'],
        'userId' => $row['user_id'] ?? null,
        'user_id' => $row['user_id'] ?? null,
        'eventType' => $row['event_type'] ?? 'iam_callback_success',
        'event_type' => $row['event_type'] ?? 'iam_callback_success',
        'email' => $row['email'] ?? null,
        'employeeId' => $row['employee_id'] ?? null,
        'employee_id' => $row['employee_id'] ?? null,
        'displayName' => $row['display_name'] ?? null,
        'display_name' => $row['display_name'] ?? null,
        'iamSubject' => $row['iam_subject'] ?? null,
        'iam_subject' => $row['iam_subject'] ?? null,
        'role' => $row['role'] ?? null,
        'ipAddress' => $row['ip_address'] ?? null,
        'ip_address' => $row['ip_address'] ?? null,
        'userAgent' => $row['user_agent'] ?? null,
        'user_agent' => $row['user_agent'] ?? null,
        'sessionIdHash' => $row['session_id_hash'] ?? null,
        'session_id_hash' => $row['session_id_hash'] ?? null,
        'createdAt' => $row['created_at'] ?? null,
        'timestamp' => $row['created_at'] ?? null,
    ];
}

function app_url(string $path): string
{
    $base = rtrim(env_value('APP_BASE_URL', ''), '/');
    if (!$base) {
        $scheme = is_https_request() ? 'https' : 'http';
        $base = $scheme . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
    }
    return $base . $path;
}

function redirect_to(string $url): void
{
    header('Location: ' . $url, true, 302);
    exit;
}

function csv_env(string $key): array
{
    $value = env_value($key, '');
    if (!$value) {
        return [];
    }
    return array_values(array_filter(array_map(
        fn($item) => trim((string)$item),
        explode(',', $value)
    ), fn($item) => $item !== ''));
}

function iam_provider(): Keycloak
{
    if (!class_exists(Keycloak::class)) {
        fail(500, 'iam/package-missing', 'IAM package is missing. Run composer install.');
    }

    $authServerUrl = rtrim(env_value('IAM_AUTH_SERVER_URL', ''), '/');
    $realm = env_value('IAM_REALM');
    $clientId = env_value('IAM_CLIENT_ID');
    $clientSecret = env_value('IAM_CLIENT_SECRET');
    $redirectUri = env_value('IAM_REDIRECT_URI', app_url('/'));

    if (!$authServerUrl || !$realm || !$clientId || !$clientSecret || !$redirectUri) {
        fail(500, 'iam-config-error', 'IAM config is missing. Set IAM_AUTH_SERVER_URL, IAM_REALM, IAM_CLIENT_ID, IAM_CLIENT_SECRET and IAM_REDIRECT_URI.');
    }

    return new Keycloak([
        'authServerUrl' => $authServerUrl,
        'realm' => $realm,
        'clientId' => $clientId,
        'clientSecret' => $clientSecret,
        'redirectUri' => $redirectUri,
        'timeout' => (float)env_value('IAM_HTTP_TIMEOUT', '15'),
    ]);
}

function iam_identity(array $profile): array
{
    try {
        return iam_identity_from_profile(
            $profile,
            env_value('IAM_FALLBACK_EMAIL_DOMAIN', 'iam.local')
        );
    } catch (InvalidArgumentException $exception) {
        report_exception($exception, 'iam-profile-validation');
        fail(400, 'iam/invalid-profile', 'IAM profile is missing required identity claims.');
    }
}

function default_iam_role(string $email, ?string $employeeId): string
{
    $adminEmails = array_map('normalize_email', csv_env('IAM_ADMIN_EMAILS'));
    $adminEmployeeIds = array_map(fn($item) => strtoupper($item), csv_env('IAM_ADMIN_EMPLOYEE_IDS'));

    if (in_array(normalize_email($email), $adminEmails, true)) {
        return 'admin';
    }

    if ($employeeId && in_array(strtoupper($employeeId), $adminEmployeeIds, true)) {
        return 'admin';
    }

    return 'user';
}

function find_iam_user(string $email, ?string $employeeId, string $subject): ?array
{
    $clauses = ['email = :email', 'iam_subject = :iam_subject'];
    $params = ['email' => normalize_email($email), 'iam_subject' => $subject];

    if ($employeeId) {
        $clauses[] = 'employee_id = :employee_id';
        $params['employee_id'] = $employeeId;
    }

    $stmt = db()->prepare('SELECT ' . USER_COLUMNS . ' FROM users WHERE ' . implode(' OR ', $clauses) . ' ORDER BY created_at ASC LIMIT 2');
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    if (count($rows) > 1 && $rows[0]['user_id'] !== $rows[1]['user_id']) {
        throw new RuntimeException('IAM identity matches multiple users and requires manual review.');
    }

    return $rows[0] ?? null;
}

function upsert_iam_user(array $profile): array
{
    $identity = iam_identity($profile);
    $existing = find_iam_user($identity['email'], $identity['employee_id'], $identity['subject']);
    $profileJson = json_encode($profile, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($profileJson === false) {
        $profileJson = '{}';
    }

    if ($existing) {
        $role = $existing['role'] === 'admin'
            ? 'admin'
            : default_iam_role($identity['email'], $identity['employee_id']);

        $stmt = db()->prepare(
            'UPDATE users
             SET email = :email,
                 role = :role,
                 employee_id = COALESCE(:employee_id, employee_id),
                 iam_subject = :iam_subject,
                 display_name = :display_name,
                 iam_profile = :iam_profile,
                 last_login_at = NOW(),
                 updated_at = NOW()
             WHERE user_id = :user_id
             RETURNING ' . USER_COLUMNS
        );
        $stmt->execute([
            'user_id' => $existing['user_id'],
            'email' => $identity['email'],
            'role' => $role,
            'employee_id' => $identity['employee_id'],
            'iam_subject' => $identity['subject'],
            'display_name' => $identity['display_name'],
            'iam_profile' => $profileJson,
        ]);
        return $stmt->fetch();
    }

    $stmt = db()->prepare(
        'INSERT INTO users
         (email, role, profile_status, employee_id, iam_subject, display_name, iam_profile, last_login_at, created_at, updated_at)
         VALUES
         (:email, :role, :profile_status, :employee_id, :iam_subject, :display_name, :iam_profile, NOW(), NOW(), NOW())
         RETURNING ' . USER_COLUMNS
    );
    $stmt->execute([
        'email' => $identity['email'],
        'role' => default_iam_role($identity['email'], $identity['employee_id']),
        'profile_status' => 'provisional',
        'employee_id' => $identity['employee_id'],
        'iam_subject' => $identity['subject'],
        'display_name' => $identity['display_name'],
        'iam_profile' => $profileJson,
    ]);
    return $stmt->fetch();
}

function iam_post_login_url(array $user): string
{
    return app_url('/portal.html');
}

function request_ip(): ?string
{
    $forwarded = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? '';
    if ($forwarded) {
        $first = trim(explode(',', $forwarded)[0]);
        if ($first !== '') {
            return $first;
        }
    }
    return $_SERVER['REMOTE_ADDR'] ?? null;
}

function request_user_agent(): ?string
{
    $agent = trim((string)($_SERVER['HTTP_USER_AGENT'] ?? ''));
    return $agent !== '' ? $agent : null;
}

function session_id_hash(): ?string
{
    $id = session_id();
    return $id !== '' ? hash('sha256', $id) : null;
}

function record_login_log(array $user, string $eventType = 'iam_callback_success'): void
{
    $stmt = db()->prepare(
        'INSERT INTO login_logs
         (event_type, user_id, email, employee_id, display_name, iam_subject, role, ip_address, user_agent, session_id_hash, created_at)
         VALUES
         (:event_type, :user_id, :email, :employee_id, :display_name, :iam_subject, :role, :ip_address, :user_agent, :session_id_hash, NOW())'
    );
    $stmt->execute([
        'event_type' => $eventType,
        'user_id' => $user['user_id'] ?? null,
        'email' => $user['email'] ?? null,
        'employee_id' => $user['employee_id'] ?? null,
        'display_name' => $user['display_name'] ?? null,
        'iam_subject' => $user['iam_subject'] ?? null,
        'role' => $user['role'] ?? 'user',
        'ip_address' => request_ip(),
        'user_agent' => request_user_agent(),
        'session_id_hash' => session_id_hash(),
    ]);
}

function handle_auth(array $segments, string $method): void
{
    $action = $segments[1] ?? '';

    if ($action === 'session' && $method === 'GET') {
        $user = null;
        if (is_dev_bypass_session()) {
            $user = mock_bypass_user();
        } elseif (current_user_id()) {
            $user = find_user_by_id((string)current_user_id());
        } elseif (current_email()) {
            $user = find_user((string)current_email());
        }
        if (!$user && dev_bypass_enabled()) {
            $user = mock_bypass_user();
        }
        respond(['user' => user_response($user)]);
    }

    if ($action === 'logout' && $method === 'POST') {
        $user = null;
        if (is_dev_bypass_session()) {
            $user = null;
        } elseif (current_user_id()) {
            $user = find_user_by_id((string)current_user_id());
        } elseif (current_email()) {
            $user = find_user((string)current_email());
        }
        if ($user) {
            record_login_log($user, 'logout');
        }
        $_SESSION = [];
        if (ini_get('session.use_cookies')) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
        }
        session_destroy();
        respond(['ok' => true]);
    }

    if (in_array($action, ['register', 'login', 'send-verification', 'verify', 'password-reset', 'reset-password'], true)) {
        fail(410, 'auth/iam-only', 'Password registration/login is disabled. Use IAM/Azure login.');
    }

    fail(404, 'not-found', 'Auth endpoint not found.');
}

function handle_iam(array $segments, string $method): void
{
    $action = $segments[1] ?? '';

    if ($action === 'login' && $method === 'GET') {
        $provider = iam_provider();
        $scope = preg_split('/\s+/', trim(env_value('IAM_SCOPE', 'openid profile email'))) ?: ['openid', 'profile', 'email'];
        $authOptions = ['scope' => $scope];
        if (is_local_request() && (string)($_GET['local'] ?? '') === '1') {
            $authOptions['state'] = 'ftc-local-dev.' . base64url_encode(request_origin()) . '.' . bin2hex(random_bytes(16));
        }
        $authUrl = $provider->getAuthorizationUrl($authOptions);
        $_SESSION['oauth2state'] = $provider->getState();
        redirect_to($authUrl);
    }

    if ($action === 'callback' && $method === 'GET') {
        process_iam_callback();
    }

    fail(404, 'not-found', 'IAM endpoint not found.');
}

function process_iam_callback(): void
{
    if (!empty($_GET['error'])) {
        $message = (string)($_GET['error_description'] ?? $_GET['error']);
        fail(401, 'iam/login-failed', $message);
    }

    $state = (string)($_GET['state'] ?? '');
    if ($state === '' || empty($_SESSION['oauth2state']) || $state !== $_SESSION['oauth2state']) {
        unset($_SESSION['oauth2state']);
        fail(400, 'iam/invalid-state', 'Invalid IAM state. Please start login again.');
    }
    unset($_SESSION['oauth2state']);

    $code = (string)($_GET['code'] ?? '');
    if ($code === '') {
        fail(400, 'iam/missing-code', 'IAM callback is missing authorization code.');
    }

    $provider = iam_provider();
    $token = $provider->getAccessToken('authorization_code', ['code' => $code]);
    $owner = $provider->getResourceOwner($token);
    $profile = $owner->toArray();
    $user = upsert_iam_user($profile);

    session_regenerate_id(true);
    $_SESSION['user_id'] = $user['user_id'];
    $_SESSION['user_email'] = $user['email'];
    $_SESSION['iam_subject'] = $user['iam_subject'] ?? null;
    record_login_log($user);
    redirect_to(iam_post_login_url($user));
}

function query_limit(int $default = 100, int $maximum = 500): int
{
    $value = filter_var($_GET['limit'] ?? null, FILTER_VALIDATE_INT);
    if ($value === false || $value === null) {
        return $default;
    }
    return max(1, min($maximum, (int)$value));
}

function encode_cursor(array $payload): string
{
    $json = json_encode($payload, JSON_UNESCAPED_SLASHES);
    return rtrim(strtr(base64_encode((string)$json), '+/', '-_'), '=');
}

function decode_cursor(?string $cursor): array
{
    if (!$cursor) {
        return [];
    }
    if (strlen($cursor) > 2048) {
        fail(400, 'bad-cursor', 'The pagination cursor is invalid.');
    }

    $normalized = strtr($cursor, '-_', '+/');
    $padding = strlen($normalized) % 4;
    if ($padding > 0) {
        $normalized .= str_repeat('=', 4 - $padding);
    }
    $decoded = base64_decode($normalized, true);
    $payload = $decoded === false ? null : json_decode($decoded, true);
    if (!is_array($payload)) {
        fail(400, 'bad-cursor', 'The pagination cursor is invalid.');
    }
    return $payload;
}

function normalized_timestamp(mixed $value, string $label): ?string
{
    if ($value === null || $value === '') {
        return null;
    }
    if (!is_scalar($value)) {
        fail(400, 'bad-filter', "The $label timestamp is invalid.");
    }

    $text = trim((string)$value);
    if ($text === '') {
        return null;
    }
    try {
        return (new DateTimeImmutable($text))->format(DateTimeInterface::ATOM);
    } catch (Throwable) {
        fail(400, 'bad-filter', "The $label timestamp is invalid.");
    }
}

function query_timestamp(string $name): ?string
{
    return normalized_timestamp($_GET[$name] ?? null, $name);
}

function pagination_response(array $items, int $limit, bool $hasMore, ?string $nextCursor): array
{
    return [
        'items' => $items,
        'pagination' => [
            'limit' => $limit,
            'hasMore' => $hasMore,
            'nextCursor' => $nextCursor,
        ],
    ];
}

function optional_text(array $input, string $key, int $maximumLength = 500): ?string
{
    if (!array_key_exists($key, $input) || $input[$key] === null) {
        return null;
    }
    if (!is_scalar($input[$key])) {
        fail(400, 'bad-request', "$key must be text.");
    }
    $value = trim((string)$input[$key]);
    $length = function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
    if ($length > $maximumLength) {
        fail(400, 'bad-request', "$key exceeds the maximum length.");
    }
    return $value === '' ? null : $value;
}

function redact_sensitive_payload(mixed $value, ?string $key = null): mixed
{
    if ($key && preg_match('/password|passwd|secret|token|credential|pppoe|wifi[_-]?key|pre[_-]?shared/i', $key)) {
        return '[REDACTED]';
    }
    if (!is_array($value)) {
        return $value;
    }

    $redacted = [];
    foreach ($value as $childKey => $childValue) {
        $redacted[$childKey] = redact_sensitive_payload($childValue, (string)$childKey);
    }
    return $redacted;
}

function handle_users(array $segments, string $method): void
{
    $current = require_user();
    $email = isset($segments[1]) ? normalize_email(rawurldecode($segments[1])) : null;

    if (!$email && $method === 'GET') {
        require_admin();
        $limit = query_limit();
        $cursor = decode_cursor(isset($_GET['cursor']) ? (string)$_GET['cursor'] : null);
        $where = [];
        $params = [];

        $search = trim((string)($_GET['q'] ?? ''));
        if ($search !== '') {
            $where[] = '(email ILIKE :search OR display_name ILIKE :search OR employee_id ILIKE :search)';
            $params['search'] = '%' . $search . '%';
        }

        $role = trim((string)($_GET['role'] ?? ''));
        if ($role !== '') {
            if (!in_array($role, ['user', 'admin'], true)) {
                fail(400, 'bad-filter', 'Invalid role filter.');
            }
            $where[] = 'role = :role';
            $params['role'] = $role;
        }

        $profileStatus = trim((string)($_GET['profile_status'] ?? ''));
        if ($profileStatus !== '') {
            if (!in_array($profileStatus, ['provisional', 'enriched', 'unmatched', 'conflict'], true)) {
                fail(400, 'bad-filter', 'Invalid profile status filter.');
            }
            $where[] = 'profile_status = :profile_status';
            $params['profile_status'] = $profileStatus;
        }

        if (array_key_exists('created_at', $cursor) || array_key_exists('email', $cursor)) {
            $cursorCreatedAt = normalized_timestamp($cursor['created_at'] ?? null, 'cursor created_at');
            $cursorEmail = is_scalar($cursor['email'] ?? null)
                ? normalize_email((string)$cursor['email'])
                : '';
            if (!$cursorCreatedAt || !filter_var($cursorEmail, FILTER_VALIDATE_EMAIL) || strlen($cursorEmail) > 320) {
                fail(400, 'bad-cursor', 'The users cursor is invalid.');
            }
            $where[] = '(created_at < :cursor_created_at OR (created_at = :cursor_created_at AND email < :cursor_email))';
            $params['cursor_created_at'] = $cursorCreatedAt;
            $params['cursor_email'] = $cursorEmail;
        }

        $sql = 'SELECT ' . USER_COLUMNS . ' FROM users';
        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY created_at DESC, email DESC LIMIT ' . ($limit + 1);
        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        $hasMore = count($rows) > $limit;
        if ($hasMore) {
            $rows = array_slice($rows, 0, $limit);
        }
        $last = $rows ? $rows[array_key_last($rows)] : null;
        $nextCursor = $hasMore && $last ? encode_cursor(['created_at' => $last['created_at'], 'email' => $last['email']]) : null;
        respond(pagination_response(array_map('user_response', $rows), $limit, $hasMore, $nextCursor));
    }

    if ($email && $method === 'GET') {
        if (($current['role'] ?? 'user') !== 'admin' && $current['email'] !== $email) {
            fail(403, 'permission-denied', 'You can only read your own user profile.');
        }
        $user = find_user($email);
        if (!$user) {
            fail(404, 'not-found', 'User not found.');
        }
        respond(['item' => user_response($user)]);
    }

    if ($email && in_array($method, ['PUT', 'PATCH'], true)) {
        $actor = require_admin();
        $input = json_body();
        $newRole = (string)($input['role'] ?? '');
        if (!in_array($newRole, ['user', 'admin'], true)) {
            fail(400, 'bad-request', 'Role must be user or admin.');
        }

        $pdo = db();
        $pdo->beginTransaction();
        try {
            $adminIds = $pdo
                ->query("SELECT user_id FROM users WHERE role = 'admin' ORDER BY user_id FOR UPDATE")
                ->fetchAll(PDO::FETCH_COLUMN);
            if (!in_array($actor['user_id'], $adminIds, true)) {
                $pdo->rollBack();
                fail(403, 'permission-denied', 'Admin permission is required.');
            }

            $targetStatement = $pdo->prepare('SELECT ' . USER_COLUMNS . ' FROM users WHERE email = :email FOR UPDATE');
            $targetStatement->execute(['email' => $email]);
            $target = $targetStatement->fetch();
            if (!$target) {
                $pdo->rollBack();
                fail(404, 'not-found', 'User not found.');
            }
            if ($newRole === $target['role']) {
                $pdo->commit();
                respond(['item' => user_response($target)]);
            }
            if ($target['role'] === 'admin' && $newRole === 'user' && count($adminIds) <= 1) {
                $pdo->rollBack();
                fail(409, 'last-admin', 'The last administrator cannot be demoted.');
            }

            $stmt = $pdo->prepare('UPDATE users SET role = :role, updated_at = NOW() WHERE user_id = :user_id RETURNING ' . USER_COLUMNS);
            $stmt->execute(['user_id' => $target['user_id'], 'role' => $newRole]);
            $updated = $stmt->fetch();

            $audit = $pdo->prepare(
                'INSERT INTO user_role_audit_logs
                 (actor_user_id, target_user_id, old_role, new_role, ip_address, user_agent)
                 VALUES (:actor_user_id, :target_user_id, :old_role, :new_role, :ip_address, :user_agent)'
            );
            $audit->execute([
                'actor_user_id' => $actor['user_id'],
                'target_user_id' => $target['user_id'],
                'old_role' => $target['role'],
                'new_role' => $newRole,
                'ip_address' => request_ip(),
                'user_agent' => request_user_agent(),
            ]);
            $pdo->commit();
            respond(['item' => user_response($updated)]);
        } catch (Throwable $exception) {
            if ($pdo->inTransaction()) {
                $pdo->rollBack();
            }
            throw $exception;
        }
    }

    fail(404, 'not-found', 'Users endpoint not found.');
}

function handle_activity_logs(array $segments, string $method): void
{
    if ($method === 'GET') {
        require_admin();
        $limit = query_limit();
        $cursor = decode_cursor(isset($_GET['cursor']) ? (string)$_GET['cursor'] : null);
        $where = [];
        $params = [];

        if (isset($cursor['id'])) {
            $cursorId = filter_var($cursor['id'], FILTER_VALIDATE_INT);
            if ($cursorId === false) {
                fail(400, 'bad-cursor', 'The activity cursor is invalid.');
            }
            $where[] = 'id < :cursor_id';
            $params['cursor_id'] = $cursorId;
        }

        $from = query_timestamp('from');
        $to = query_timestamp('to');
        if ($from) {
            $where[] = 'created_at >= :from_time';
            $params['from_time'] = $from;
        }
        if ($to) {
            $where[] = 'created_at <= :to_time';
            $params['to_time'] = $to;
        }

        foreach (['email' => 'technician_email', 'employee_id' => 'technician_employee_id', 'device' => 'device', 'event_type' => 'event_type'] as $queryKey => $column) {
            $value = trim((string)($_GET[$queryKey] ?? ''));
            if ($value !== '') {
                $where[] = $column . ' = :' . $queryKey;
                $params[$queryKey] = $value;
            }
        }

        $sql = 'SELECT ' . ACTIVITY_LOG_COLUMNS . ' FROM activity_logs';
        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY id DESC LIMIT ' . ($limit + 1);
        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        $hasMore = count($rows) > $limit;
        if ($hasMore) {
            $rows = array_slice($rows, 0, $limit);
        }
        $last = $rows ? $rows[array_key_last($rows)] : null;
        $nextCursor = $hasMore && $last ? encode_cursor(['id' => (int)$last['id']]) : null;
        respond(pagination_response(array_map('log_response', $rows), $limit, $hasMore, $nextCursor));
    }

    if ($method === 'POST') {
        $current = require_user();
        $input = json_body();
        $eventType = optional_text($input, 'eventType', 64) ?? 'lab_completed';
        if ($eventType !== 'lab_completed') {
            fail(400, 'unsupported-event', 'Only lab_completed is supported by the current event contract.');
        }

        $email = normalize_email((string)$current['email']);
        $safePayload = redact_sensitive_payload($input);
        unset(
            $safePayload['email'],
            $safePayload['user'],
            $safePayload['employeeId'],
            $safePayload['employee_id'],
            $safePayload['technicianEmail'],
            $safePayload['technicianEmployeeId']
        );

        // In development bypass mode, avoid writing activity logs to DB to prevent FK errors
        if (dev_bypass_enabled()) {
            $now = (new DateTimeImmutable())->format(DateTimeInterface::ATOM);
            $fake = [
                'id' => 0,
                'created_at' => $now,
                'event_type' => $eventType,
                'user_id' => $current['user_id'] ?? null,
                'action_title' => optional_text($input, 'actionTitle'),
                'title' => optional_text($input, 'title'),
                'lab_name' => optional_text($input, 'labName'),
                'group_name' => optional_text($input, 'groupName'),
                'lab_url' => optional_text($input, 'labUrl', 2000),
                'device_name' => optional_text($input, 'deviceName'),
                'device' => optional_text($input, 'device') ?? optional_text($input, 'deviceName'),
                'severity' => optional_text($input, 'severity', 32) ?? 'LOW',
                'level' => optional_text($input, 'level', 32) ?? 'LOW',
                'description' => optional_text($input, 'description', 2000),
                'desc_text' => optional_text($input, 'desc', 2000) ?? optional_text($input, 'description', 2000),
                'email' => $email,
                'user_email' => $email,
                'technician_email' => $email,
                'technician_employee_id' => $current['employee_id'] ?? null,
                'technician_name' => $current['display_name'] ?? null,
                'client_ip' => request_ip(),
                'user_agent' => request_user_agent(),
                'payload' => json_encode($safePayload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
            ];
            respond(['item' => log_response($fake)], 201);
        }

        $stmt = db()->prepare(
            'INSERT INTO activity_logs
             (event_type, user_id, action_title, title, lab_name, group_name, lab_url, device_name, device, severity, level, description, desc_text, email, user_email, technician_email, technician_employee_id, technician_name, client_ip, user_agent, payload, created_at)
             VALUES
             (:event_type, :user_id, :action_title, :title, :lab_name, :group_name, :lab_url, :device_name, :device, :severity, :level, :description, :desc_text, :email, :user_email, :technician_email, :technician_employee_id, :technician_name, :client_ip, :user_agent, :payload, NOW())
             RETURNING ' . ACTIVITY_LOG_COLUMNS
        );
        $stmt->execute([
            'event_type' => $eventType,
            'user_id' => $current['user_id'],
            'action_title' => optional_text($input, 'actionTitle'),
            'title' => optional_text($input, 'title'),
            'lab_name' => optional_text($input, 'labName'),
            'group_name' => optional_text($input, 'groupName'),
            'lab_url' => optional_text($input, 'labUrl', 2000),
            'device_name' => optional_text($input, 'deviceName'),
            'device' => optional_text($input, 'device') ?? optional_text($input, 'deviceName'),
            'severity' => optional_text($input, 'severity', 32) ?? 'LOW',
            'level' => optional_text($input, 'level', 32) ?? 'LOW',
            'description' => optional_text($input, 'description', 2000),
            'desc_text' => optional_text($input, 'desc', 2000) ?? optional_text($input, 'description', 2000),
            'email' => $email,
            'user_email' => $email,
            'technician_email' => $email,
            'technician_employee_id' => $current['employee_id'] ?? null,
            'technician_name' => $current['display_name'] ?? null,
            'client_ip' => request_ip(),
            'user_agent' => request_user_agent(),
            'payload' => json_encode($safePayload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
        ]);
        respond(['item' => log_response($stmt->fetch())], 201);
    }

    fail(404, 'not-found', 'Activity logs endpoint not found.');
}

function handle_login_logs(array $segments, string $method): void
{
    if ($method === 'GET') {
        require_admin();
        $limit = query_limit();
        $cursor = decode_cursor(isset($_GET['cursor']) ? (string)$_GET['cursor'] : null);
        $where = [];
        $params = [];

        if (isset($cursor['id'])) {
            $cursorId = filter_var($cursor['id'], FILTER_VALIDATE_INT);
            if ($cursorId === false) {
                fail(400, 'bad-cursor', 'The login cursor is invalid.');
            }
            $where[] = 'id < :cursor_id';
            $params['cursor_id'] = $cursorId;
        }
        $from = query_timestamp('from');
        $to = query_timestamp('to');
        if ($from) {
            $where[] = 'created_at >= :from_time';
            $params['from_time'] = $from;
        }
        if ($to) {
            $where[] = 'created_at <= :to_time';
            $params['to_time'] = $to;
        }
        foreach (['email' => 'email', 'employee_id' => 'employee_id', 'event_type' => 'event_type'] as $queryKey => $column) {
            $value = trim((string)($_GET[$queryKey] ?? ''));
            if ($value !== '') {
                $where[] = $column . ' = :' . $queryKey;
                $params[$queryKey] = $value;
            }
        }

        $sql = 'SELECT ' . LOGIN_LOG_COLUMNS . ' FROM login_logs';
        if ($where) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY id DESC LIMIT ' . ($limit + 1);
        $stmt = db()->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();
        $hasMore = count($rows) > $limit;
        if ($hasMore) {
            $rows = array_slice($rows, 0, $limit);
        }
        $last = $rows ? $rows[array_key_last($rows)] : null;
        $nextCursor = $hasMore && $last ? encode_cursor(['id' => (int)$last['id']]) : null;
        respond(pagination_response(array_map('login_log_response', $rows), $limit, $hasMore, $nextCursor));
    }

    fail(404, 'not-found', 'Login logs endpoint not found.');
}

function handle_health(string $method): void
{
    if ($method !== 'GET') {
        fail(405, 'method-not-allowed', 'Health endpoint only supports GET.');
    }

    $pdo = db();
    $pdo->query('SELECT 1');
    $migrationTable = $pdo->query("SELECT to_regclass('public.schema_migrations')")->fetchColumn();
    $latestMigration = null;
    if ($migrationTable) {
        $latestMigration = $pdo->query('SELECT version FROM schema_migrations ORDER BY version DESC LIMIT 1')->fetchColumn() ?: null;
    }

    $version = env_value('RENDER_GIT_COMMIT', env_value('APP_VERSION', 'development'));
    respond([
        'ok' => true,
        'service' => 'postgres-api',
        'version' => $version ? substr($version, 0, 12) : 'development',
        'latestMigration' => $latestMigration,
    ]);
}

function handle_dev(array $segments, string $method): void
{
    $action = $segments[1] ?? '';
    if ($action === 'bypass' && $method === 'GET') {
        if (!dev_bypass_enabled()) {
            fail(404, 'not-found', 'Dev endpoint not available.');
        }

        $user = mock_bypass_user();
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['iam_subject'] = $user['iam_subject'] ?? null;

        if ((string)($_GET['format'] ?? '') === 'json') {
            respond([
                'ok' => true,
                'bypass' => true,
                'user' => user_response($user),
            ]);
        }

        $next = (string)($_GET['next'] ?? '/portal.html');
        $isLocalAbsolute = (bool)preg_match('#^https?://(?:localhost|127\.0\.0\.1|\[::1\])(?::\d+)?/.*$#i', $next);
        if ($next === '' || (!$isLocalAbsolute && (!str_starts_with($next, '/') || str_starts_with($next, '//')))) {
            $next = '/portal.html';
        }
        redirect_to($next);
    }
    if ($action === 'bypass' && $method === 'POST') {
        if (!dev_bypass_enabled()) {
            fail(404, 'not-found', 'Dev endpoint not available.');
        }

        $user = mock_bypass_user();
        session_regenerate_id(true);
        $_SESSION['user_id'] = $user['user_id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['iam_subject'] = $user['iam_subject'] ?? null;

        respond([
            'ok' => true,
            'bypass' => true,
            'user' => user_response($user),
        ]);
    }
    fail(404, 'not-found', 'Dev endpoint not found.');
}

function handle_dashboard(array $segments, string $method): void
{
    if ($method !== 'GET') {
        fail(405, 'method-not-allowed', 'Dashboard endpoint only supports GET.');
    }

    require_user();

    $action = $segments[1] ?? '';
    if ($action !== 'all') {
        fail(404, 'not-found', 'Dashboard endpoint not found.');
    }

    $rows = db()
        ->query(
            'SELECT
                id AS session_id,
                technician_id,
                name AS full_name,
                email,
                COALESCE(started_at, finished_at) AS started_at,
                COALESCE(duration_sec, 0) AS duration_sec,
                mode,
                device AS device_name,
                lab_id,
                lab_name,
                finished_at
             FROM timer_sessions
             ORDER BY COALESCE(started_at, finished_at) DESC'
        )
        ->fetchAll();

    $sessions = [];
    $deviceMap = [];
    $labMap = [];
    try {
        $catalogRows = db()
            ->query(
                'SELECT d.device_id, d.model, d.device_name, l.lab_id, l.lab_name
                 FROM device_catalog d
                 LEFT JOIN lab_catalog l ON l.device_id = d.device_id
                 ORDER BY d.device_name, l.lab_name'
            )
            ->fetchAll();
        foreach ($catalogRows as $row) {
            $deviceName = (string)($row['device_name'] ?? '');
            if ($deviceName !== '' && !isset($deviceMap[$deviceName])) {
                $deviceMap[$deviceName] = [
                    'device_id' => (string)($row['device_id'] ?? ('DEV_' . count($deviceMap))),
                    'model' => (string)($row['model'] ?? ''),
                    'device_name' => $deviceName,
                ];
            }
            $labId = (string)($row['lab_id'] ?? '');
            if ($labId !== '' && !isset($labMap[$labId])) {
                $labMap[$labId] = [
                    'lab_id' => $labId,
                    'lab_name' => (string)($row['lab_name'] ?? $labId),
                    'device_id' => (string)($row['device_id'] ?? ''),
                ];
            }
        }
    } catch (Throwable $ignored) {
        // Bang danh muc chua duoc tao (chua chay migration 008) -> chi dung du lieu tu sessions.
    }

    foreach ($rows as $row) {
        $sessions[] = [
            'session_id' => (string)$row['session_id'],
            'technician_id' => (string)($row['technician_id'] ?? ''),
            'full_name' => (string)($row['full_name'] ?? ''),
            'email' => (string)($row['email'] ?? ''),
            'started_at' => $row['started_at'] ? (new DateTimeImmutable($row['started_at']))->format(DateTimeInterface::ATOM) : null,
            'duration_sec' => (int)$row['duration_sec'],
            'mode' => (string)($row['mode'] ?? 'Thực hành'),
            'device_name' => (string)($row['device_name'] ?? ''),
            'lab_id' => (string)($row['lab_id'] ?? ''),
            'lab_name' => (string)($row['lab_name'] ?? ''),
            'status' => 'completed',
            'completed_first_try' => true,
        ];

        $device = (string)($row['device_name'] ?? '');
        if ($device !== '' && !isset($deviceMap[$device])) {
            $deviceMap[$device] = [
                'device_id' => 'DEV_' . count($deviceMap),
                'model' => $device,
                'device_name' => $device,
            ];
        }

        $labKey = (string)($row['lab_id'] ?? '');
        $labName = (string)($row['lab_name'] ?? $labKey);
        if ($labKey !== '' && !isset($labMap[$labKey])) {
            $labMap[$labKey] = [
                'lab_id' => $labKey,
                'lab_name' => $labName,
                'device_id' => $deviceMap[$device]['device_id'] ?? 'DEV_' . count($deviceMap),
            ];
        }
    }

    respond(['data' => [
        'sessions' => $sessions,
        'devices' => array_values($deviceMap),
        'labs' => array_values($labMap),
    ]]);
}

try {
    if ($resource === 'auth') {
        handle_auth($segments, $method);
    } elseif ($resource === 'iam') {
        handle_iam($segments, $method);
    } elseif ($resource === 'users') {
        handle_users($segments, $method);
    } elseif ($resource === 'activity_logs') {
        handle_activity_logs($segments, $method);
    } elseif ($resource === 'login_logs') {
        handle_login_logs($segments, $method);
    } elseif ($resource === 'tracking') {
        if (training_tracking_is_logical_path($segments)) {
            handle_training_tracking($segments, $method);
        } else {
            handle_tracking($segments, $method);
        }
    } elseif ($resource === 'dev') {
        handle_dev($segments, $method);
    } elseif ($resource === 'dashboard') {
        handle_dashboard($segments, $method);
    } elseif ($resource === 'health') {
        handle_health($method);
    } elseif (is_root_iam_callback($resource, $method)) {
        process_iam_callback();
    } elseif ($resource === '') {
        respond([
            'ok' => true,
            'service' => 'postgres-api',
            'version' => substr((string)env_value('RENDER_GIT_COMMIT', env_value('APP_VERSION', 'development')), 0, 12),
        ]);
    }
    fail(404, 'not-found', 'Endpoint not found.');
} catch (Throwable $exception) {
    report_exception($exception, 'request');
    fail(500, 'server-error', 'An internal server error occurred.');
}

