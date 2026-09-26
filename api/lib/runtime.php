<?php
declare(strict_types=1);

function load_app_environment(string $root): void
{
    $autoload = $root . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
    if (is_file($autoload)) {
        require_once $autoload;
    }

    if (class_exists(Dotenv\Dotenv::class) && is_file($root . DIRECTORY_SEPARATOR . '.env')) {
        Dotenv\Dotenv::createImmutable($root)->safeLoad();
    }
}

function env_value(string $key, ?string $default = null): ?string
{
    $value = $_ENV[$key] ?? $_SERVER[$key] ?? getenv($key);
    if ($value === false || $value === '') {
        return $default;
    }
    return (string)$value;
}

function env_bool(string $key, bool $default = false): bool
{
    $value = env_value($key);
    if ($value === null) {
        return $default;
    }

    $parsed = filter_var($value, FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
    return $parsed ?? $default;
}

function env_int(string $key, int $default, int $minimum, int $maximum): int
{
    $value = filter_var(env_value($key), FILTER_VALIDATE_INT);
    if ($value === false) {
        return $default;
    }
    return max($minimum, min($maximum, (int)$value));
}

/**
 * Tự động phát hiện địa chỉ IPv4 LAN cục bộ (Wi-Fi / Ethernet)
 * Giúp thiết bị di động (điện thoại iPhone/Android) cùng mạng Wi-Fi truy cập được thay vì localhost
 */
function get_network_lan_ip(): ?string
{
    static $cachedLanIp = null;
    if ($cachedLanIp !== null) {
        return $cachedLanIp;
    }

    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        $output = @shell_exec('ipconfig');
        if ($output && preg_match_all('/IPv4 Address[ .]*:[ ]*([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/i', $output, $matches)) {
            foreach ($matches[1] as $ip) {
                if ($ip !== '127.0.0.1' && !str_starts_with($ip, '169.254.')) {
                    $cachedLanIp = $ip;
                    return $ip;
                }
            }
        }
    } else {
        $output = @shell_exec('hostname -I 2>/dev/null') ?: @shell_exec('ip route get 1 2>/dev/null');
        if ($output && preg_match('/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/', $output, $m)) {
            if ($m[1] !== '127.0.0.1') {
                $cachedLanIp = $m[1];
                return $m[1];
            }
        }
    }
    return null;
}

/**
 * Phân giải URL gốc của ứng dụng (ưu tiên Host thực tế hoặc LAN IP để thiết bị ngoài / mobile mở được link)
 */
function resolve_app_base_url(): string
{
    // 1. Nếu request đến qua Host thực tế (khác localhost / 127.0.0.1)
    $httpHost = $_SERVER['HTTP_X_FORWARDED_HOST'] ?? $_SERVER['HTTP_HOST'] ?? null;
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https' ? 'https' : 'http';

    if ($httpHost) {
        $hostOnly = strtolower(explode(':', $httpHost)[0]);
        if ($hostOnly !== 'localhost' && $hostOnly !== '127.0.0.1' && $hostOnly !== '::1') {
            return "{$scheme}://{$httpHost}";
        }
    }

    // 2. Kiểm tra APP_BASE_URL trong môi trường
    $envBase = env_value('APP_BASE_URL', '');
    if ($envBase !== '') {
        $parsed = parse_url($envBase);
        $envHost = strtolower($parsed['host'] ?? '');
        if ($envHost !== '' && $envHost !== 'localhost' && $envHost !== '127.0.0.1') {
            return rtrim($envBase, '/');
        }
    }

    // 3. Nếu cấu hình là localhost, tự động thay thế bằng LAN IP thực tế để điện thoại truy cập được
    $lanIp = get_network_lan_ip();
    if ($lanIp) {
        $port = 8080;
        if ($envBase !== '' && !empty(parse_url($envBase, PHP_URL_PORT))) {
            $port = (int)parse_url($envBase, PHP_URL_PORT);
        } elseif ($httpHost && str_contains($httpHost, ':')) {
            $port = (int)explode(':', $httpHost)[1];
        }
        return "http://{$lanIp}:{$port}";
    }

    return $envBase !== '' ? rtrim($envBase, '/') : 'http://127.0.0.1:8080';
}

function normalize_app_timezone(?string $timezone): string
{
    $timezone = trim((string)$timezone);
    if ($timezone === '') {
        $timezone = 'Asia/Ho_Chi_Minh';
    }

    if (!in_array($timezone, timezone_identifiers_list(), true)) {
        throw new RuntimeException('APP_TIMEZONE must be a valid IANA timezone identifier.');
    }

    return $timezone;
}

function api_resource_requires_session(string $resource): bool
{
    return in_array($resource, ['auth', 'iam', 'users', 'roles', 'login_logs', 'tracking', 'dashboard', 'roster', 'classes', 'learning', 'reports', 'ai', 'labs'], true);
}

function normalize_neon_options(string $host, ?string $options): ?string
{
    if (!str_contains($host, '.neon.tech')) {
        return $options;
    }

    $hostLabel = explode('.', $host)[0] ?? '';
    if ($hostLabel === '' || !str_starts_with($hostLabel, 'ep-')) {
        return $options;
    }

    if (!$options) {
        return 'endpoint=' . $hostLabel;
    }

    if (preg_match('/(?:^|\s)endpoint=([^\s]+)/', $options, $matches)) {
        $current = $matches[1] ?? '';
        if ($current !== $hostLabel) {
            return preg_replace('/endpoint=[^\s]+/', 'endpoint=' . $hostLabel, $options, 1);
        }
        return $options;
    }

    return trim($options . ' endpoint=' . $hostLabel);
}

function create_database_connection(): PDO
{
    $databaseUrl = env_value('DATABASE_URL');
    if ($databaseUrl) {
        $parts = parse_url($databaseUrl);
        if (!$parts || empty($parts['host']) || empty($parts['path'])) {
            throw new RuntimeException('DATABASE_URL is invalid.');
        }

        $host = (string)$parts['host'];
        $port = (string)($parts['port'] ?? 5432);
        $dbname = rawurldecode(ltrim((string)$parts['path'], '/'));
        $user = rawurldecode((string)($parts['user'] ?? ''));
        $password = rawurldecode((string)($parts['pass'] ?? ''));
        $query = [];
        parse_str((string)($parts['query'] ?? ''), $query);
        $sslmode = env_value('PGSSLMODE', (string)($query['sslmode'] ?? 'prefer'));
        $connectTimeout = env_value('PGCONNECT_TIMEOUT', isset($query['connect_timeout']) ? (string)$query['connect_timeout'] : null);
        $options = env_value('PGOPTIONS', isset($query['options']) ? (string)$query['options'] : null);
    } else {
        $host = env_value('PGHOST', '127.0.0.1');
        $port = env_value('PGPORT', '5432');
        $dbname = env_value('PGDATABASE');
        $user = env_value('PGUSER');
        $password = env_value('PGPASSWORD', '');
        $sslmode = env_value('PGSSLMODE', 'prefer');
        $connectTimeout = env_value('PGCONNECT_TIMEOUT');
        $options = env_value('PGOPTIONS');

        if (!$dbname || !$user) {
            throw new RuntimeException('PostgreSQL config is missing. Set DATABASE_URL or PG* variables.');
        }
    }

    $options = normalize_neon_options((string)$host, $options ?? null);
    $dsn = sprintf('pgsql:host=%s;port=%s;dbname=%s;sslmode=%s', $host, $port, $dbname, $sslmode);
    if ($connectTimeout) {
        $dsn .= ';connect_timeout=' . $connectTimeout;
    }
    if ($options) {
        $dsn .= ';options=' . $options;
    }

    try {
        $pdo = new PDO($dsn, (string)$user, (string)$password, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => env_bool('DB_EMULATE_PREPARES', true),
            PDO::ATTR_STRINGIFY_FETCHES => false,
        ]);
    } catch (PDOException $pdoException) {
        // Fallback sang PostgreSQL Local nếu máy chủ từ xa lỗi hoặc hết quota
        if ($host !== '127.0.0.1' && $host !== 'localhost') {
            try {
                $localDsn = 'pgsql:host=127.0.0.1;port=5432;dbname=ftc_local;sslmode=disable';
                $pdo = new PDO($localDsn, 'postgres', '', [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => true,
                    PDO::ATTR_STRINGIFY_FETCHES => false,
                ]);
            } catch (Throwable) {
                throw $pdoException;
            }
        } else {
            throw $pdoException;
        }
    }

    $timezoneStatement = $pdo->prepare("SELECT set_config('TimeZone', :timezone, false)");
    $timezoneStatement->execute([
        'timezone' => normalize_app_timezone(env_value('APP_TIMEZONE')),
    ]);

    return $pdo;
}
