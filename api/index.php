<?php
declare(strict_types=1);

use Stevenmaguire\OAuth2\Client\Provider\Keycloak;

$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
require_once __DIR__ . '/lib/PostgresSessionHandler.php';
require_once __DIR__ . '/lib/iam_identity.php';
require_once __DIR__ . '/lib/tracking_handler.php';
require_once __DIR__ . '/lib/dashboard_report.php';
require_once __DIR__ . '/lib/ktv_roster_import.php';
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

function database_boolean(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }
    if (is_int($value)) {
        return $value === 1;
    }
    return in_array(strtolower(trim((string)$value)), ['1', 't', 'true', 'yes', 'y', 'on'], true);
}

function database_nullable_boolean(mixed $value): ?bool
{
    return $value === null ? null : database_boolean($value);
}

const USER_COLUMNS = 'user_id, email, display_name, role, last_login_at, iam_profile,
    employee_id, job_title, training_start_date, training_end_date, class_code,
    is_terminated, termination_date, termination_reason, unit_code, unit_name,
    region_code, dashboard_region, region_id, employee_source,
    employee_seed_batch, employee_synced_at, created_at, updated_at';
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

function find_user_by_employee_id(string $employeeId): ?array
{
    $stmt = db()->prepare('SELECT ' . USER_COLUMNS . ' FROM users WHERE employee_id = :employee_id');
    $stmt->execute(['employee_id' => trim($employeeId)]);
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
        'displayName' => $row['display_name'] ?? null,
        'display_name' => $row['display_name'] ?? null,
        'employeeId' => $row['employee_id'] ?? null,
        'employee_id' => $row['employee_id'] ?? null,
        'jobTitle' => $row['job_title'] ?? null,
        'job_title' => $row['job_title'] ?? null,
        'trainingStartDate' => $row['training_start_date'] ?? null,
        'training_start_date' => $row['training_start_date'] ?? null,
        'trainingEndDate' => $row['training_end_date'] ?? null,
        'training_end_date' => $row['training_end_date'] ?? null,
        'classCode' => $row['class_code'] ?? null,
        'class_code' => $row['class_code'] ?? null,
        'sourceClassCode' => $row['source_class_code'] ?? ($row['class_code'] ?? null),
        'source_class_code' => $row['source_class_code'] ?? ($row['class_code'] ?? null),
        'isTerminated' => database_boolean($row['is_terminated'] ?? false),
        'is_terminated' => database_boolean($row['is_terminated'] ?? false),
        'terminationDate' => $row['termination_date'] ?? null,
        'termination_date' => $row['termination_date'] ?? null,
        'terminationReason' => $row['termination_reason'] ?? null,
        'termination_reason' => $row['termination_reason'] ?? null,
        'unitCode' => $row['unit_code'] ?? null,
        'unit_code' => $row['unit_code'] ?? null,
        'unitName' => $row['unit_name'] ?? null,
        'unit_name' => $row['unit_name'] ?? null,
        'regionCode' => $row['region_code'] ?? null,
        'region_code' => $row['region_code'] ?? null,
        'branchCode' => $row['branch_code'] ?? null,
        'branch_code' => $row['branch_code'] ?? null,
        'dashboardRegion' => $row['dashboard_region'] ?? null,
        'dashboard_region' => $row['dashboard_region'] ?? null,
        'regionId' => $row['region_id'] ?? null,
        'region_id' => $row['region_id'] ?? null,
        'lastLoginAt' => $row['last_login_at'] ?? null,
        'last_login_at' => $row['last_login_at'] ?? null,
        'createdAt' => $row['created_at'] ?? null,
        'updatedAt' => $row['updated_at'] ?? null,
    ];
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

function upsert_iam_user(array $profile): array
{
    $identity = iam_identity($profile);
    if ($identity['employee_id'] !== null && strlen($identity['employee_id']) > 20) {
        fail(400, 'iam/invalid-profile', 'IAM employee_id exceeds the supported length.');
    }

    $emailUser = find_user($identity['email']);
    $employeeUser = $identity['employee_id']
        ? find_user_by_employee_id($identity['employee_id'])
        : null;
    if ($emailUser && $employeeUser && $emailUser['user_id'] !== $employeeUser['user_id']) {
        fail(409, 'iam/identity-conflict', 'IAM email and employee_id belong to different users.');
    }
    if (
        $emailUser
        && $identity['employee_id'] !== null
        && !empty($emailUser['employee_id'])
        && $emailUser['employee_id'] !== $identity['employee_id']
    ) {
        fail(409, 'iam/identity-conflict', 'IAM employee_id does not match the employee assigned to this email.');
    }
    $existing = $emailUser ?: $employeeUser;
    $profileJson = json_encode($profile, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($profileJson === false) {
        $profileJson = '{}';
    }

    if ($existing) {
        $role = $existing['role'] === 'admin' ? 'admin' : 'user';

        $stmt = db()->prepare(
            'UPDATE users
             SET email = :email,
                 role = :role,
                 display_name = CASE
                     WHEN employee_source IS NOT NULL THEN COALESCE(display_name, :roster_display_name)
                     ELSE COALESCE(:iam_display_name, display_name)
                 END,
                 employee_id = COALESCE(employee_id, :employee_id),
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
            'roster_display_name' => $identity['display_name'],
            'iam_display_name' => $identity['display_name'],
            'employee_id' => $identity['employee_id'],
            'iam_profile' => $profileJson,
        ]);
        return $stmt->fetch();
    }

    $stmt = db()->prepare(
        'INSERT INTO users
         (email, role, display_name, employee_id, iam_profile, last_login_at, created_at, updated_at)
         VALUES
         (:email, :role, :display_name, :employee_id, :iam_profile, NOW(), NOW(), NOW())
         RETURNING ' . USER_COLUMNS
    );
    $stmt->execute([
        'email' => $identity['email'],
        'role' => 'user',
        'display_name' => $identity['display_name'],
        'employee_id' => $identity['employee_id'],
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
            $where[] = '(email ILIKE :search_email
                OR display_name ILIKE :search_name
                OR employee_id ILIKE :search_employee
                OR class_code ILIKE :search_class)';
            $searchPattern = '%' . $search . '%';
            $params['search_email'] = $searchPattern;
            $params['search_name'] = $searchPattern;
            $params['search_employee'] = $searchPattern;
            $params['search_class'] = $searchPattern;
        }

        $role = trim((string)($_GET['role'] ?? ''));
        if ($role !== '') {
            if (!in_array($role, ['user', 'admin'], true)) {
                fail(400, 'bad-filter', 'Invalid role filter.');
            }
            $where[] = 'role = :role';
            $params['role'] = $role;
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

function roster_batch_id(): string
{
    $timezone = new DateTimeZone(normalize_app_timezone(env_value('APP_TIMEZONE')));
    return 'ktv-roster-' . (new DateTimeImmutable('now', $timezone))->format('Ymd-His') . '-' . bin2hex(random_bytes(4));
}

function roster_uploaded_file(): array
{
    $file = $_FILES['file'] ?? $_FILES['workbook'] ?? null;
    if (!is_array($file)) {
        fail(400, 'bad-request', 'Missing roster import file.');
    }
    $error = (int)($file['error'] ?? UPLOAD_ERR_NO_FILE);
    if ($error !== UPLOAD_ERR_OK) {
        $message = match ($error) {
            UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'Uploaded file is too large.',
            UPLOAD_ERR_PARTIAL => 'Uploaded file was only partially uploaded.',
            UPLOAD_ERR_NO_FILE => 'Missing roster import file.',
            default => 'Unable to receive uploaded file.',
        };
        fail(400, 'upload-error', $message);
    }
    $maximumBytes = env_int('ROSTER_IMPORT_MAX_BYTES', 5 * 1024 * 1024, 1024, 20 * 1024 * 1024);
    if ((int)($file['size'] ?? 0) > $maximumBytes) {
        fail(413, 'payload-too-large', 'Roster import file exceeds the allowed size.');
    }
    $name = (string)($file['name'] ?? '');
    if (!preg_match('/\.xlsx$/i', $name)) {
        fail(400, 'bad-request', 'Roster import file must be an .xlsx workbook.');
    }
    $path = (string)($file['tmp_name'] ?? '');
    if ($path === '' || !is_uploaded_file($path)) {
        fail(400, 'upload-error', 'Uploaded roster file is not available.');
    }
    return [
        'path' => $path,
        'name' => $name,
        'size' => (int)($file['size'] ?? 0),
    ];
}

function roster_parse_bool_query(string $key): bool
{
    $value = $_GET[$key] ?? $_POST[$key] ?? null;
    if ($value === null) {
        return false;
    }
    return in_array(strtolower(trim((string)$value)), ['1', 'true', 'yes', 'y', 'on'], true);
}

function roster_item_response(array $row): array
{
    $item = user_response($row) ?? [];
    $item['employeeSource'] = $row['employee_source'] ?? null;
    $item['employee_source'] = $row['employee_source'] ?? null;
    $item['employeeSeedBatch'] = $row['employee_seed_batch'] ?? null;
    $item['employee_seed_batch'] = $row['employee_seed_batch'] ?? null;
    $item['employeeSyncedAt'] = $row['employee_synced_at'] ?? null;
    $item['employee_synced_at'] = $row['employee_synced_at'] ?? null;
    $item['branchName'] = $row['roster_branch_name'] ?? $row['branch_name'] ?? null;
    $item['branch_name'] = $row['roster_branch_name'] ?? $row['branch_name'] ?? null;
    return $item;
}

function roster_base_where(array &$params, bool $includeFilters = true): array
{
    $where = [
        'users.employee_id IS NOT NULL',
        "(users.job_title = 'CB Kỹ thuật TKBT' OR users.employee_source IS NOT NULL)",
    ];

    if (!$includeFilters) {
        return $where;
    }

    $status = strtolower(trim((string)($_GET['status'] ?? 'active')));
    if ($status !== '' && $status !== 'all') {
        if (!in_array($status, ['active', 'terminated'], true)) {
            fail(400, 'bad-filter', 'Invalid roster status filter.');
        }
        $where[] = $status === 'terminated'
            ? 'users.is_terminated = TRUE'
            : 'users.is_terminated = FALSE';
    }

    $search = trim((string)($_GET['search'] ?? ''));
    if ($search !== '') {
        $searchPattern = '%' . $search . '%';
        $where[] = '(
            users.employee_id ILIKE :search_eid
            OR users.email ILIKE :search_email
            OR users.display_name ILIKE :search_name
            OR users.class_code ILIKE :search_class
            OR users.unit_code ILIKE :search_unit
            OR users.unit_name ILIKE :search_unitname
        )';
        $params['search_eid'] = $searchPattern;
        $params['search_email'] = $searchPattern;
        $params['search_name'] = $searchPattern;
        $params['search_class'] = $searchPattern;
        $params['search_unit'] = $searchPattern;
        $params['search_unitname'] = $searchPattern;
    }

    $region = trim((string)($_GET['region'] ?? ''));
    if ($region !== '') {
        $where[] = '(
            users.region_id::text = :region_id_text
            OR users.region_code = :region_code
            OR users.dashboard_region = :region_name
        )';
        $params['region_id_text'] = $region;
        $params['region_code'] = $region;
        $params['region_name'] = $region;
    }

    return $where;
}

function roster_stats(PDO $pdo): array
{
    $params = [];
    $where = roster_base_where($params, false);
    $whereSql = implode(' AND ', $where);
    $summary = $pdo
        ->query(
            "SELECT
                COUNT(*) AS total,
                COUNT(*) FILTER (WHERE is_terminated = FALSE) AS active,
                COUNT(*) FILTER (WHERE is_terminated = TRUE) AS terminated
               FROM users
              WHERE $whereSql"
        )
        ->fetch() ?: ['total' => 0, 'active' => 0, 'terminated' => 0];

    $regionRows = $pdo
        ->query(
            "SELECT COALESCE(NULLIF(dashboard_region, ''), NULLIF(region_code, ''), 'Chưa phân vùng') AS region,
                    COUNT(*) AS total,
                    COUNT(*) FILTER (WHERE is_terminated = FALSE) AS active,
                    COUNT(*) FILTER (WHERE is_terminated = TRUE) AS terminated
               FROM users
              WHERE $whereSql
              GROUP BY COALESCE(NULLIF(dashboard_region, ''), NULLIF(region_code, ''), 'Chưa phân vùng')
              ORDER BY region"
        )
        ->fetchAll();

    return [
        'total' => (int)($summary['total'] ?? 0),
        'active' => (int)($summary['active'] ?? 0),
        'terminated' => (int)($summary['terminated'] ?? 0),
        'byRegion' => array_map(static fn(array $row): array => [
            'region' => (string)$row['region'],
            'total' => (int)$row['total'],
            'active' => (int)$row['active'],
            'terminated' => (int)$row['terminated'],
        ], $regionRows),
        'by_region' => array_map(static fn(array $row): array => [
            'region' => (string)$row['region'],
            'total' => (int)$row['total'],
            'active' => (int)$row['active'],
            'terminated' => (int)$row['terminated'],
        ], $regionRows),
    ];
}

function handle_roster_import(array $actor): void
{
    $file = roster_uploaded_file();
    $dryRun = roster_parse_bool_query('dry_run') || roster_parse_bool_query('dryRun');
    $batch = trim((string)($_POST['batch_id'] ?? $_POST['batchId'] ?? $_GET['batch_id'] ?? ''));
    if ($batch === '') {
        $batch = roster_batch_id();
    }
    if (!preg_match('/^[A-Za-z0-9._:-]{1,100}$/', $batch)) {
        fail(400, 'bad-request', 'Invalid roster batch id.');
    }

    try {
        $parsed = parse_ktv_roster_xlsx($file['path']);
    } catch (Throwable $exception) {
        fail(400, 'bad-workbook', $exception->getMessage());
    }

    $pdo = db();
    $parseErrors = $parsed['errors'] ?? [];
    if ($dryRun) {
        $preview = sync_ktv_roster($pdo, $parsed['rows'] ?? [], $batch, true);
        $preview['errors'] = array_merge($parseErrors, $preview['errors'] ?? []);
        $preview['error_count'] = count($preview['errors']);
        $preview['errorCount'] = count($preview['errors']);
        $preview['canImport'] = $preview['error_count'] === 0 && count($parsed['rows'] ?? []) > 0;
        $preview['can_import'] = $preview['canImport'];
        $preview['headers'] = $parsed['headers'] ?? [];
        $preview['fileName'] = $file['name'];
        $preview['file_name'] = $file['name'];
        respond(['data' => $preview]);
    }

    if ($parseErrors) {
        respond([
            'error' => [
                'code' => 'bad-workbook',
                'message' => 'Roster workbook contains invalid rows.',
                'requestId' => $GLOBALS['request_id'] ?? null,
                'details' => $parseErrors,
            ],
        ], 400);
    }

    $preflight = sync_ktv_roster($pdo, $parsed['rows'] ?? [], $batch, true);
    if (($preflight['error_count'] ?? 0) > 0) {
        respond([
            'error' => [
                'code' => 'roster-conflict',
                'message' => 'Roster import has conflicts. Please review preview errors before importing.',
                'requestId' => $GLOBALS['request_id'] ?? null,
                'details' => $preflight['errors'],
            ],
        ], 409);
    }

    $pdo->beginTransaction();
    try {
        $result = sync_ktv_roster($pdo, $parsed['rows'] ?? [], $batch, false);
        if (($result['error_count'] ?? 0) > 0) {
            $pdo->rollBack();
            respond([
                'error' => [
                    'code' => 'roster-conflict',
                    'message' => 'Roster import encountered conflicts and was rolled back.',
                    'requestId' => $GLOBALS['request_id'] ?? null,
                    'details' => $result['errors'],
                ],
            ], 409);
        }
        $importedBy = ktv_roster_existing_imported_by($pdo, $actor['user_id'] ?? null);
        ktv_roster_log_import($pdo, $result, $importedBy, $file['name']);
        $pdo->commit();
        respond(['data' => $result]);
    } catch (Throwable $exception) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $exception;
    }
}

function handle_roster_list(): void
{
    $pdo = db();
    $limit = query_limit(50, 500);
    $page = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT);
    $page = $page === false || $page === null ? 1 : max(1, (int)$page);
    $offset = ($page - 1) * $limit;

    $params = [];
    $where = roster_base_where($params, true);
    $whereSql = implode(' AND ', $where);

    $countStmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE $whereSql");
    $countStmt->execute($params);
    $total = (int)$countStmt->fetchColumn();

    $sql = "SELECT users.*, regions.branch_name AS roster_branch_name
              FROM users
              LEFT JOIN regions ON regions.region_id = users.region_id
             WHERE $whereSql
             ORDER BY users.is_terminated ASC,
                      users.dashboard_region NULLS LAST,
                      users.class_code NULLS LAST,
                      users.display_name NULLS LAST,
                      users.email
             LIMIT :limit OFFSET :offset";
    $stmt = $pdo->prepare($sql);
    foreach ($params as $key => $value) {
        $stmt->bindValue(':' . $key, $value);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $rows = $stmt->fetchAll();

    respond(['data' => [
        'items' => array_map('roster_item_response', $rows),
        'total' => $total,
        'page' => $page,
        'limit' => $limit,
        'stats' => roster_stats($pdo),
    ]]);
}

function handle_roster_history(): void
{
    $limit = query_limit(50, 200);
    $page = filter_var($_GET['page'] ?? 1, FILTER_VALIDATE_INT);
    $page = $page === false || $page === null ? 1 : max(1, (int)$page);
    $offset = ($page - 1) * $limit;
    $pdo = db();

    $countStmt = $pdo->query('SELECT COUNT(*) FROM roster_import_log');
    $total = (int)$countStmt->fetchColumn();

    $stmt = $pdo->prepare(
        'SELECT log.*, users.email AS imported_by_email, users.display_name AS imported_by_name
           FROM roster_import_log log
           LEFT JOIN users ON users.user_id = log.imported_by
          ORDER BY log.imported_at DESC
          LIMIT :limit OFFSET :offset'
    );
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $items = array_map(static function (array $row): array {
        $errors = json_decode((string)($row['error_details'] ?? '[]'), true);
        return [
            'id' => (int)$row['id'],
            'batchId' => $row['batch_id'],
            'batch_id' => $row['batch_id'],
            'fileName' => $row['file_name'],
            'file_name' => $row['file_name'],
            'importedBy' => $row['imported_by'],
            'imported_by' => $row['imported_by'],
            'importedByName' => $row['imported_by_name'],
            'importedByEmail' => $row['imported_by_email'],
            'totalRows' => (int)$row['total_rows'],
            'total_rows' => (int)$row['total_rows'],
            'inserted' => (int)$row['inserted'],
            'updated' => (int)$row['updated'],
            'terminated' => (int)$row['terminated'],
            'reactivated' => (int)$row['reactivated'],
            'errorCount' => (int)$row['error_count'],
            'error_count' => (int)$row['error_count'],
            'errors' => is_array($errors) ? $errors : [],
            'importedAt' => $row['imported_at'],
            'imported_at' => $row['imported_at'],
        ];
    }, $stmt->fetchAll());
    respond(['data' => ['items' => $items, 'total' => $total, 'page' => $page, 'limit' => $limit]]);
}

function sanitize_csv_cell(mixed $value): string
{
    $text = (string)($value ?? '');
    if ($text !== '' && in_array($text[0], ['=', '+', '-', '@', "\t", "\r"], true)) {
        $text = "\t" . $text;
    }
    return $text;
}

function roster_optional_date_input(array $input, string $key): ?string
{
    if (!array_key_exists($key, $input) || $input[$key] === null || trim((string)$input[$key]) === '') {
        return null;
    }
    $value = trim((string)$input[$key]);
    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value, new DateTimeZone('UTC'));
    $errors = DateTimeImmutable::getLastErrors();
    $valid = $errors === false || ($errors['warning_count'] === 0 && $errors['error_count'] === 0);
    if (!$date || !$valid || $date->format('Y-m-d') !== $value) {
        fail(400, 'bad-request', "$key must be a YYYY-MM-DD date.");
    }
    return $value;
}

function handle_roster_update(string $employeeId): void
{
    if (!preg_match('/^\d{8}$/', $employeeId)) {
        fail(400, 'bad-request', 'Invalid employee id.');
    }
    $input = json_body();
    $pdo = db();

    $stmt = $pdo->prepare('SELECT * FROM users WHERE employee_id = :employee_id FOR UPDATE');
    $pdo->beginTransaction();
    try {
        $stmt->execute(['employee_id' => $employeeId]);
        $existing = $stmt->fetch();
        if (!$existing) {
            $pdo->rollBack();
            fail(404, 'not-found', 'KTV not found.');
        }

        $email = array_key_exists('email', $input) ? normalize_email((string)$input['email']) : (string)$existing['email'];
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $pdo->rollBack();
            fail(400, 'bad-request', 'Invalid email.');
        }
        if ($email !== (string)$existing['email']) {
            $emailCheck = $pdo->prepare('SELECT user_id FROM users WHERE LOWER(email) = LOWER(:email) AND user_id != :uid');
            $emailCheck->execute(['email' => $email, 'uid' => $existing['user_id']]);
            if ($emailCheck->fetch()) {
                $pdo->rollBack();
                fail(409, 'duplicate-email', 'Email is already in use by another user.');
            }
        }
        $displayName = optional_text($input, 'displayName', 200)
            ?? optional_text($input, 'display_name', 200)
            ?? (string)$existing['display_name'];
        if (trim($displayName) === '') {
            $pdo->rollBack();
            fail(400, 'bad-request', 'Display name is required.');
        }

        $regionCode = optional_text($input, 'regionCode', 80)
            ?? optional_text($input, 'region_code', 80)
            ?? ($existing['region_code'] ?? null);
        $dashboardRegion = optional_text($input, 'dashboardRegion', 100)
            ?? optional_text($input, 'dashboard_region', 100)
            ?? ($existing['dashboard_region'] ?? null);
        $regionId = $existing['region_id'] ?? null;
        if ($regionCode && $dashboardRegion) {
            $regionId = ktv_roster_resolve_region($pdo, [
                'region_code' => strtoupper($regionCode),
                'dashboard_region' => $dashboardRegion,
                'branch' => null,
            ], false);
        }

        $isTerminated = array_key_exists('isTerminated', $input)
            ? (bool)$input['isTerminated']
            : (array_key_exists('is_terminated', $input) ? (bool)$input['is_terminated'] : database_boolean($existing['is_terminated'] ?? false));
        $terminationDate = roster_optional_date_input($input, 'terminationDate')
            ?? roster_optional_date_input($input, 'termination_date')
            ?? ($isTerminated ? ($existing['termination_date'] ?? (new DateTimeImmutable())->format('Y-m-d')) : null);
        $terminationReason = optional_text($input, 'terminationReason', 500)
            ?? optional_text($input, 'termination_reason', 500)
            ?? ($isTerminated ? ($existing['termination_reason'] ?? 'Cập nhật từ dashboard') : null);
        if (!$isTerminated) {
            $terminationDate = null;
            $terminationReason = null;
        }

        $update = $pdo->prepare(
            'UPDATE users
                SET email = :email,
                    display_name = :display_name,
                    job_title = :job_title,
                    training_start_date = :training_start_date,
                    training_end_date = :training_end_date,
                    class_code = :class_code,
                    is_terminated = :is_terminated,
                    termination_date = :termination_date,
                    termination_reason = :termination_reason,
                    unit_code = :unit_code,
                    unit_name = :unit_name,
                    region_code = :region_code,
                    dashboard_region = :dashboard_region,
                    region_id = :region_id,
                    employee_source = COALESCE(employee_source, :employee_source),
                    employee_synced_at = NOW(),
                    updated_at = NOW()
              WHERE employee_id = :employee_id
              RETURNING *'
        );
        $update->execute([
            'email' => $email,
            'display_name' => $displayName,
            'job_title' => optional_text($input, 'jobTitle', 200)
                ?? optional_text($input, 'job_title', 200)
                ?? ($existing['job_title'] ?? null),
            'training_start_date' => roster_optional_date_input($input, 'trainingStartDate')
                ?? roster_optional_date_input($input, 'training_start_date')
                ?? ($existing['training_start_date'] ?? null),
            'training_end_date' => roster_optional_date_input($input, 'trainingEndDate')
                ?? roster_optional_date_input($input, 'training_end_date')
                ?? ($existing['training_end_date'] ?? null),
            'class_code' => optional_text($input, 'classCode', 50)
                ?? optional_text($input, 'class_code', 50)
                ?? ($existing['class_code'] ?? null),
            'is_terminated' => $isTerminated,
            'termination_date' => $terminationDate,
            'termination_reason' => $terminationReason,
            'unit_code' => optional_text($input, 'unitCode', 100)
                ?? optional_text($input, 'unit_code', 100)
                ?? ($existing['unit_code'] ?? null),
            'unit_name' => optional_text($input, 'unitName', 200)
                ?? optional_text($input, 'unit_name', 200)
                ?? ($existing['unit_name'] ?? null),
            'region_code' => $regionCode ? strtoupper($regionCode) : null,
            'dashboard_region' => $dashboardRegion,
            'region_id' => $regionId,
            'employee_source' => KTV_ROSTER_IMPORT_SOURCE,
            'employee_id' => $employeeId,
        ]);
        $updated = $update->fetch();
        $pdo->commit();
        respond(['item' => roster_item_response($updated)]);
    } catch (Throwable $exception) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $exception;
    }
}

function handle_roster_export(): void
{
    $pdo = db();
    $params = [];
    $where = roster_base_where($params, true);
    $whereSql = implode(' AND ', $where);
    $stmt = $pdo->prepare(
        "SELECT users.*, regions.branch_name AS roster_branch_name
           FROM users
           LEFT JOIN regions ON regions.region_id = users.region_id
          WHERE $whereSql
          ORDER BY users.dashboard_region NULLS LAST, users.display_name NULLS LAST, users.email"
    );
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $timezone = new DateTimeZone(normalize_app_timezone(env_value('APP_TIMEZONE')));
    $dateStamp = (new DateTimeImmutable('now', $timezone))->format('Ymd-His');
    header('Content-Type: text/csv; charset=utf-8', true);
    header('Content-Disposition: attachment; filename="ktv_roster_' . $dateStamp . '.csv"');
    echo "\xEF\xBB\xBF";
    $out = fopen('php://output', 'wb');
    fputcsv($out, [
        'employee_id',
        'display_name',
        'email',
        'job_title',
        'branch',
        'region_code',
        'dashboard_region',
        'unit_code',
        'unit_name',
        'class_code',
        'training_start_date',
        'training_end_date',
        'is_terminated',
        'termination_date',
        'termination_reason',
        'employee_source',
        'employee_seed_batch',
        'employee_synced_at',
    ]);
    foreach ($rows as $row) {
        fputcsv($out, array_map('sanitize_csv_cell', [
            $row['employee_id'] ?? '',
            $row['display_name'] ?? '',
            $row['email'] ?? '',
            $row['job_title'] ?? '',
            $row['roster_branch_name'] ?? '',
            $row['region_code'] ?? '',
            $row['dashboard_region'] ?? '',
            $row['unit_code'] ?? '',
            $row['unit_name'] ?? '',
            $row['class_code'] ?? '',
            $row['training_start_date'] ?? '',
            $row['training_end_date'] ?? '',
            database_boolean($row['is_terminated'] ?? false) ? 'TRUE' : 'FALSE',
            $row['termination_date'] ?? '',
            $row['termination_reason'] ?? '',
            $row['employee_source'] ?? '',
            $row['employee_seed_batch'] ?? '',
            $row['employee_synced_at'] ?? '',
        ]));
    }
    fclose($out);
    exit;
}

function handle_roster(array $segments, string $method): void
{
    $actor = require_admin();
    $action = $segments[1] ?? '';

    if ($action === 'import' && $method === 'POST') {
        handle_roster_import($actor);
    } elseif ($action === 'list' && $method === 'GET') {
        handle_roster_list();
    } elseif ($action === 'history' && $method === 'GET') {
        handle_roster_history();
    } elseif ($action === 'export' && $method === 'GET') {
        handle_roster_export();
    } elseif ($action !== '' && $method === 'PATCH') {
        handle_roster_update(rawurldecode($action));
    }

    fail(404, 'not-found', 'Roster endpoint not found.');
}

function handle_dashboard(array $segments, string $method): void
{
    if ($method !== 'GET') {
        fail(405, 'method-not-allowed', 'Dashboard endpoint only supports GET.');
    }

    require_admin();

    $action = $segments[1] ?? '';

    if ($action === 'report') {
        $pdo = db();
        try {
            $report = build_dashboard_report($pdo, $_GET);
            respond(['data' => $report]);
        } catch (InvalidArgumentException $exception) {
            fail(400, 'bad-request', $exception->getMessage());
        }
    }

    if ($action !== 'all') {
        fail(404, 'not-found', 'Dashboard endpoint not found.');
    }

    $pdo = db();
    $rows = $pdo
        ->query(
            <<<'SQL'
            SELECT
                timer.id AS session_id,
                COALESCE(timer.user_id, roster.user_id) AS user_id,
                COALESCE(roster.employee_id, timer.technician_id) AS technician_id,
                COALESCE(roster.display_name, timer.name) AS full_name,
                COALESCE(roster.email, timer.email) AS email,
                roster.class_code,
                roster.job_title,
                roster.unit_code,
                roster.unit_name,
                roster.region_code,
                roster.dashboard_region AS region_name,
                roster.is_terminated,
                COALESCE(timer.started_at, timer.finished_at) AS started_at,
                COALESCE(timer.duration_sec, 0) AS duration_sec,
                timer.mode,
                timer.device AS device_name,
                timer.lab_id,
                timer.lab_name,
                timer.finished_at,
                timer.is_passed,
                timer.score,
                timer.status,
                timer.completed_first_try,
                timer.last_action,
                timer.is_mock,
                timer.seed_batch
             FROM timer_sessions timer
             LEFT JOIN LATERAL (
                 SELECT candidate.*
                   FROM users candidate
                  WHERE candidate.user_id = timer.user_id
                     OR (
                          timer.user_id IS NULL
                          AND (
                              candidate.employee_id = NULLIF(BTRIM(timer.technician_id), '')
                              OR LOWER(candidate.email) = LOWER(NULLIF(BTRIM(timer.email), ''))
                          )
                     )
                  ORDER BY CASE
                      WHEN candidate.user_id = timer.user_id THEN 0
                      WHEN candidate.employee_id = NULLIF(BTRIM(timer.technician_id), '') THEN 1
                      ELSE 2
                  END
                  LIMIT 1
             ) roster ON TRUE
             ORDER BY COALESCE(timer.started_at, timer.finished_at) DESC
            SQL
        )
        ->fetchAll();

    $technicianRows = $pdo
        ->query(
            'SELECT ' . USER_COLUMNS . '
               FROM users
              WHERE employee_id IS NOT NULL
                AND is_terminated = FALSE
                AND job_title = \'CB Kỹ thuật TKBT\'
              ORDER BY class_code NULLS LAST, display_name NULLS LAST, email'
        )
        ->fetchAll();

    $currentClassRows = $pdo
        ->query(
            <<<'SQL'
            SELECT user_id, class_code, class_name, region_name
              FROM v_current_training_class
             ORDER BY user_id
            SQL
        )
        ->fetchAll();
    $currentClasses = [];
    foreach ($currentClassRows as $classRow) {
        $currentClasses[(string)$classRow['user_id']] = $classRow;
    }
    foreach ($technicianRows as &$technicianRow) {
        $technicianRow['source_class_code'] = $technicianRow['class_code'] ?? null;
        $currentClass = $currentClasses[(string)$technicianRow['user_id']] ?? null;
        if ($currentClass) {
            $technicianRow['class_code'] = $currentClass['class_code'];
        }
    }
    unset($technicianRow);

    $sessions = [];
    $deviceMap = [];
    $labMap = [];
    try {
        $catalogRows = $pdo
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
        $currentClass = isset($row['user_id'])
            ? ($currentClasses[(string)$row['user_id']] ?? null)
            : null;
        $sessions[] = [
            'session_id' => (string)$row['session_id'],
            'user_id' => isset($row['user_id']) && $row['user_id'] !== ''
                ? (string)$row['user_id']
                : null,
            'technician_id' => (string)($row['technician_id'] ?? ''),
            'full_name' => (string)($row['full_name'] ?? ''),
            'email' => (string)($row['email'] ?? ''),
            'region_name' => (string)($row['region_name'] ?? ''),
            'class_code' => (string)($currentClass['class_code'] ?? ($row['class_code'] ?? '')),
            'source_class_code' => (string)($row['class_code'] ?? ''),
            'job_title' => (string)($row['job_title'] ?? ''),
            'unit_code' => (string)($row['unit_code'] ?? ''),
            'unit_name' => (string)($row['unit_name'] ?? ''),
            'region_code' => (string)($row['region_code'] ?? ''),
            'branch_code' => (string)($row['branch_code'] ?? ''),
            'is_terminated' => database_boolean($row['is_terminated'] ?? false),
            'started_at' => $row['started_at'] ? (new DateTimeImmutable($row['started_at']))->format(DateTimeInterface::ATOM) : null,
            'finished_at' => $row['finished_at'] ? (new DateTimeImmutable($row['finished_at']))->format(DateTimeInterface::ATOM) : null,
            'duration_sec' => (int)$row['duration_sec'],
            'mode' => (string)($row['mode'] ?? 'Thực hành'),
            'device_name' => (string)($row['device_name'] ?? ''),
            'lab_id' => (string)($row['lab_id'] ?? ''),
            'lab_name' => (string)($row['lab_name'] ?? ''),
            'is_passed' => isset($row['is_passed']) ? (bool)$row['is_passed'] : null,
            'score' => isset($row['score']) ? (float)$row['score'] : null,
            'status' => (string)($row['status'] ?? ((isset($row['is_passed']) && $row['is_passed'] === false) ? 'failed' : 'completed')),
            'completed_first_try' => database_nullable_boolean($row['completed_first_try'] ?? null),
            'last_action' => (string)($row['last_action'] ?? ''),
            'is_mock' => database_boolean($row['is_mock'] ?? false),
            'seed_batch' => (string)($row['seed_batch'] ?? ''),
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

    $assignments = [];
    try {
        $assignmentRows = $pdo
            ->query(
                <<<'SQL'
                SELECT
                    p.assignment_id,
                    p.employee_code AS employee_id,
                    p.full_name,
                    p.email,
                    p.class_id,
                    p.class_code,
                    p.region_id,
                    p.region_name,
                    p.device_id,
                    p.device_name,
                    p.lab_id,
                    p.lab_name,
                    p.assigned_at,
                    p.due_at,
                    p.assignment_status AS status,
                    p.completed_at,
                    p.first_pass_attempt_no,
                    CASE WHEN p.first_try_success IS NOT NULL THEN TRUE ELSE FALSE END AS first_try_evaluated,
                    p.practice_attempt_count AS attempt_count,
                    0 AS avg_duration_sec
                  FROM v_lab_assignment_progress p
                 WHERE p.assignment_status <> 'waived'
                 ORDER BY p.assigned_at DESC
                SQL
            )
            ->fetchAll();
        foreach ($assignmentRows as $row) {
            $assignments[] = [
                'assignment_id' => (string)$row['assignment_id'],
                'employee_id' => (string)($row['employee_id'] ?? ''),
                'display_name' => (string)($row['display_name'] ?? ''),
                'email' => (string)($row['email'] ?? ''),
                'class_id' => (string)$row['class_id'],
                'class_code' => (string)$row['class_code'],
                'region_id' => (string)($row['region_id'] ?? ''),
                'region_name' => (string)($row['region_name'] ?? ''),
                'device_id' => (string)$row['device_id'],
                'device_name' => (string)$row['device_name'],
                'lab_id' => (string)$row['lab_id'],
                'lab_name' => (string)$row['lab_name'],
                'assigned_at' => $row['assigned_at'] ? (new DateTimeImmutable($row['assigned_at']))->format(DateTimeInterface::ATOM) : null,
                'due_at' => $row['due_at'] ? (new DateTimeImmutable($row['due_at']))->format(DateTimeInterface::ATOM) : null,
                'status' => (string)$row['status'],
                'completed_at' => $row['completed_at'] ? (new DateTimeImmutable($row['completed_at']))->format(DateTimeInterface::ATOM) : null,
                'first_pass_attempt_no' => $row['first_pass_attempt_no'] !== null ? (int)$row['first_pass_attempt_no'] : null,
                'first_try_evaluated' => (bool)($row['first_try_evaluated'] ?? false),
                'attempt_count' => (int)($row['attempt_count'] ?? 0),
                'avg_duration_sec' => (int)($row['avg_duration_sec'] ?? 0),
            ];
        }
    } catch (Throwable $ignored) {
    }

    respond(['data' => [
        'sessions' => $sessions,
        'devices' => array_values($deviceMap),
        'labs' => array_values($labMap),
        'technicians' => array_map('user_response', $technicianRows),
        'assignments' => $assignments,
    ]]);
}

try {
    if ($resource === 'auth') {
        handle_auth($segments, $method);
    } elseif ($resource === 'iam') {
        handle_iam($segments, $method);
    } elseif ($resource === 'users') {
        handle_users($segments, $method);
    } elseif ($resource === 'login_logs') {
        handle_login_logs($segments, $method);
    } elseif ($resource === 'tracking') {
        handle_tracking($segments, $method);
    } elseif ($resource === 'dev') {
        handle_dev($segments, $method);
    } elseif ($resource === 'roster') {
        handle_roster($segments, $method);
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

