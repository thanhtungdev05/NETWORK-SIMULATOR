<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This command can only be run from the CLI.\n");
    exit(1);
}

$root = dirname(__DIR__);
$autoload = $root . DIRECTORY_SEPARATOR . 'vendor' . DIRECTORY_SEPARATOR . 'autoload.php';
if (!is_file($autoload)) {
    fwrite(STDERR, "Composer dependencies are missing.\n");
    exit(1);
}
require_once $autoload;

use Firebase\JWT\JWT;

function firestore_inspect_usage(): void
{
    echo <<<TEXT
Usage:
  php api/inspect_firestore.php --credentials=/path/service-account.json \\
      --collection=activity_logs [--document=DOCUMENT_ID] [--limit=100] \\
      [--profile-fields=actionTitle,device,severity]
  php api/inspect_firestore.php --credentials=/path/service-account.json \\
      --list-collections

The command is read-only. It prints field names and Firestore value types, not
document values or credential secrets.
TEXT;
}

/** @return never */
function firestore_inspect_fail(string $message): void
{
    fwrite(STDERR, $message . PHP_EOL);
    exit(1);
}

/** @return array<string, mixed> */
function firestore_inspect_json_request(
    string $method,
    string $url,
    array $headers = [],
    ?string $body = null
): array {
    $handle = curl_init($url);
    if ($handle === false) {
        throw new RuntimeException('Unable to initialize HTTP request.');
    }

    $requestHeaders = array_merge(['Accept: application/json'], $headers);
    curl_setopt_array($handle, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_FOLLOWLOCATION => false,
        CURLOPT_CONNECTTIMEOUT => 15,
        CURLOPT_TIMEOUT => 60,
        CURLOPT_HTTPHEADER => $requestHeaders,
    ]);
    if ($body !== null) {
        curl_setopt($handle, CURLOPT_POSTFIELDS, $body);
    }

    $response = curl_exec($handle);
    $status = (int)curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
    $error = curl_error($handle);
    curl_close($handle);

    if (!is_string($response)) {
        throw new RuntimeException('Firestore request failed: ' . ($error ?: 'unknown network error'));
    }

    $decoded = json_decode($response, true);
    if (!is_array($decoded)) {
        throw new RuntimeException("Firestore returned HTTP $status with a non-JSON response.");
    }
    if ($status < 200 || $status >= 300) {
        $message = $decoded['error']['message'] ?? $decoded['error_description'] ?? "HTTP $status";
        throw new RuntimeException('Firestore request failed: ' . (string)$message);
    }

    return $decoded;
}

/** @param array<string, mixed> $credential */
function firestore_inspect_access_token(array $credential): string
{
    $clientEmail = $credential['client_email'] ?? null;
    $privateKey = $credential['private_key'] ?? null;
    $tokenUri = $credential['token_uri'] ?? 'https://oauth2.googleapis.com/token';
    if (!is_string($clientEmail) || !is_string($privateKey) || !is_string($tokenUri)) {
        throw new RuntimeException('Service-account credential is missing required fields.');
    }

    $now = time();
    $assertion = JWT::encode([
        'iss' => $clientEmail,
        'sub' => $clientEmail,
        'aud' => $tokenUri,
        'iat' => $now,
        'exp' => $now + 3600,
        'scope' => 'https://www.googleapis.com/auth/datastore',
    ], $privateKey, 'RS256');

    $response = firestore_inspect_json_request(
        'POST',
        $tokenUri,
        ['Content-Type: application/x-www-form-urlencoded'],
        http_build_query([
            'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
            'assertion' => $assertion,
        ], '', '&', PHP_QUERY_RFC3986)
    );
    $token = $response['access_token'] ?? null;
    if (!is_string($token) || $token === '') {
        throw new RuntimeException('OAuth token response did not contain an access token.');
    }
    return $token;
}

function firestore_inspect_value_type(array $value): string
{
    foreach ([
        'nullValue' => 'null',
        'booleanValue' => 'boolean',
        'integerValue' => 'integer',
        'doubleValue' => 'double',
        'timestampValue' => 'timestamp',
        'stringValue' => 'string',
        'bytesValue' => 'bytes',
        'referenceValue' => 'reference',
        'geoPointValue' => 'geo_point',
        'arrayValue' => 'array',
        'mapValue' => 'map',
    ] as $key => $type) {
        if (array_key_exists($key, $value)) {
            return $type;
        }
    }
    return 'unknown';
}

function firestore_inspect_scalar_value(array $value): string|int|float|bool|null
{
    if (array_key_exists('nullValue', $value)) {
        return null;
    }
    if (array_key_exists('booleanValue', $value)) {
        return (bool)$value['booleanValue'];
    }
    if (array_key_exists('integerValue', $value)) {
        return (int)$value['integerValue'];
    }
    if (array_key_exists('doubleValue', $value)) {
        return (float)$value['doubleValue'];
    }
    if (array_key_exists('timestampValue', $value)) {
        return (string)$value['timestampValue'];
    }
    if (array_key_exists('stringValue', $value)) {
        return (string)$value['stringValue'];
    }
    return null;
}

/**
 * @param array<string, mixed> $fields
 * @param array<string, array<string, true>> $schema
 */
function firestore_inspect_collect_schema(array $fields, array &$schema, string $prefix = ''): void
{
    foreach ($fields as $fieldName => $value) {
        if (!is_array($value)) {
            continue;
        }
        $path = $prefix === '' ? (string)$fieldName : $prefix . '.' . $fieldName;
        $type = firestore_inspect_value_type($value);
        $schema[$path][$type] = true;

        if ($type === 'map') {
            $nested = $value['mapValue']['fields'] ?? [];
            if (is_array($nested)) {
                firestore_inspect_collect_schema($nested, $schema, $path);
            }
        }
        if ($type === 'array') {
            foreach (($value['arrayValue']['values'] ?? []) as $item) {
                if (!is_array($item)) {
                    continue;
                }
                $itemType = firestore_inspect_value_type($item);
                $schema[$path . '[]'][$itemType] = true;
                if ($itemType === 'map') {
                    $nested = $item['mapValue']['fields'] ?? [];
                    if (is_array($nested)) {
                        firestore_inspect_collect_schema($nested, $schema, $path . '[]');
                    }
                }
            }
        }
    }
}

function firestore_inspect_encode_path(string $path): string
{
    return implode('/', array_map('rawurlencode', explode('/', trim($path, '/'))));
}

$options = getopt('', [
    'credentials:',
    'collection::',
    'document::',
    'limit::',
    'profile-fields::',
    'list-collections',
    'help',
]);
if (isset($options['help'])) {
    firestore_inspect_usage();
    exit(0);
}

$credentialPath = (string)($options['credentials'] ?? '');
$collection = trim((string)($options['collection'] ?? ''), '/');
$document = trim((string)($options['document'] ?? ''), '/');
$limit = max(1, min(1000, (int)($options['limit'] ?? 100)));
$listCollections = isset($options['list-collections']);
$profileFields = array_values(array_filter(array_map(
    'trim',
    explode(',', (string)($options['profile-fields'] ?? ''))
)));
$allowedProfileFields = [
    'actionTitle', 'className', 'device', 'deviceName', 'labName', 'level', 'role',
    'severity', 'targetLabs', 'title',
];
foreach ($profileFields as $profileField) {
    if (!in_array($profileField, $allowedProfileFields, true)) {
        firestore_inspect_fail('Profile field is not on the non-sensitive allowlist: ' . $profileField);
    }
}

if ($credentialPath === '' || (!$listCollections && $collection === '')) {
    firestore_inspect_usage();
    exit(1);
}
if (!is_file($credentialPath)) {
    firestore_inspect_fail('Credential file was not found.');
}
if (!$listCollections && !preg_match('/^[A-Za-z0-9_.~\/-]+$/D', $collection)) {
    firestore_inspect_fail('Collection path contains unsupported characters.');
}
if ($document !== '' && !preg_match('/^[A-Za-z0-9_.~\/-]+$/D', $document)) {
    firestore_inspect_fail('Document path contains unsupported characters.');
}

try {
    $credential = json_decode((string)file_get_contents($credentialPath), true, 512, JSON_THROW_ON_ERROR);
    if (!is_array($credential)) {
        throw new RuntimeException('Credential JSON must contain an object.');
    }
    $projectId = $credential['project_id'] ?? null;
    $clientEmail = $credential['client_email'] ?? null;
    if (!is_string($projectId) || $projectId === '' || !is_string($clientEmail)) {
        throw new RuntimeException('Credential does not identify a Firebase project and service account.');
    }

    $token = firestore_inspect_access_token($credential);
    $baseUrl = 'https://firestore.googleapis.com/v1/projects/' . rawurlencode($projectId)
        . '/databases/(default)/documents/';
    $headers = ['Authorization: Bearer ' . $token];

    if ($listCollections) {
        $response = firestore_inspect_json_request(
            'POST',
            rtrim($baseUrl, '/') . ':listCollectionIds',
            array_merge($headers, ['Content-Type: application/json']),
            json_encode(['pageSize' => 1000], JSON_THROW_ON_ERROR)
        );
        $collectionIds = array_values(array_filter(
            $response['collectionIds'] ?? [],
            static fn(mixed $item): bool => is_string($item) && $item !== ''
        ));
        sort($collectionIds, SORT_NATURAL | SORT_FLAG_CASE);
        echo 'project_id=' . $projectId . PHP_EOL;
        echo 'service_account=' . $clientEmail . PHP_EOL;
        echo 'database=(default)' . PHP_EOL;
        echo 'top_level_collections=' . count($collectionIds) . PHP_EOL;
        foreach ($collectionIds as $collectionId) {
            echo '  ' . $collectionId . PHP_EOL;
        }
        exit(0);
    }

    $documents = [];

    if ($document !== '') {
        $documents[] = firestore_inspect_json_request(
            'GET',
            $baseUrl . firestore_inspect_encode_path($collection . '/' . $document),
            $headers
        );
    } else {
        $pageToken = null;
        while (count($documents) < $limit) {
            $pageSize = min(300, $limit - count($documents));
            $query = ['pageSize' => $pageSize];
            if ($pageToken !== null) {
                $query['pageToken'] = $pageToken;
            }
            $response = firestore_inspect_json_request(
                'GET',
                $baseUrl . firestore_inspect_encode_path($collection) . '?' . http_build_query($query),
                $headers
            );
            foreach (($response['documents'] ?? []) as $item) {
                if (is_array($item)) {
                    $documents[] = $item;
                }
            }
            $pageToken = $response['nextPageToken'] ?? null;
            if (!is_string($pageToken) || $pageToken === '') {
                break;
            }
        }
    }

    $schema = [];
    foreach ($documents as $item) {
        $fields = $item['fields'] ?? [];
        if (is_array($fields)) {
            firestore_inspect_collect_schema($fields, $schema);
        }
    }
    ksort($schema, SORT_NATURAL | SORT_FLAG_CASE);

    echo 'project_id=' . $projectId . PHP_EOL;
    echo 'service_account=' . $clientEmail . PHP_EOL;
    echo 'database=(default)' . PHP_EOL;
    echo 'collection=' . $collection . PHP_EOL;
    echo 'documents_inspected=' . count($documents) . PHP_EOL;
    echo "schema:\n";
    foreach ($schema as $fieldPath => $types) {
        $typeNames = array_keys($types);
        sort($typeNames);
        echo '  ' . $fieldPath . '=' . implode('|', $typeNames) . PHP_EOL;
    }

    if ($profileFields) {
        echo "profiles:\n";
        foreach ($profileFields as $profileField) {
            $counts = [];
            foreach ($documents as $item) {
                $value = $item['fields'][$profileField] ?? null;
                if (!is_array($value)) {
                    continue;
                }
                $values = array_key_exists('arrayValue', $value)
                    ? ($value['arrayValue']['values'] ?? [])
                    : [$value];
                foreach ($values as $profileValue) {
                    if (!is_array($profileValue)) {
                        continue;
                    }
                    $scalar = firestore_inspect_scalar_value($profileValue);
                    if ($scalar === null) {
                        continue;
                    }
                    $label = is_bool($scalar) ? ($scalar ? 'true' : 'false') : (string)$scalar;
                    $label = preg_replace('/[\r\n\t]+/', ' ', $label) ?? $label;
                    if (filter_var($label, FILTER_VALIDATE_EMAIL)) {
                        $label = '[email-redacted]';
                    }
                    if (strlen($label) > 120) {
                        $label = substr($label, 0, 117) . '...';
                    }
                    $counts[$label] = ($counts[$label] ?? 0) + 1;
                }
            }
            arsort($counts);
            echo '  ' . $profileField . ':' . PHP_EOL;
            foreach (array_slice($counts, 0, 30, true) as $label => $count) {
                echo '    ' . $label . '=' . $count . PHP_EOL;
            }
        }
    }
} catch (Throwable $exception) {
    firestore_inspect_fail($exception->getMessage());
}
