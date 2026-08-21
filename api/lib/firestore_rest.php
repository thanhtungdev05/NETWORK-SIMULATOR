<?php
declare(strict_types=1);

use Firebase\JWT\JWT;

final class FirestoreRestReader
{
    /** @var array<string, mixed> */
    private array $credential;
    private ?string $accessToken = null;

    /** @param array<string, mixed> $credential */
    private function __construct(array $credential)
    {
        foreach (['project_id', 'client_email', 'private_key'] as $field) {
            if (!isset($credential[$field]) || !is_string($credential[$field]) || $credential[$field] === '') {
                throw new InvalidArgumentException("Service-account credential is missing $field.");
            }
        }
        $this->credential = $credential;
    }

    public static function fromCredentialFile(string $path): self
    {
        if (!is_file($path)) {
            throw new InvalidArgumentException('Firestore credential file was not found.');
        }
        $decoded = json_decode((string)file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
        if (!is_array($decoded)) {
            throw new InvalidArgumentException('Firestore credential JSON must contain an object.');
        }
        return new self($decoded);
    }

    public function projectId(): string
    {
        return (string)$this->credential['project_id'];
    }

    public function serviceAccountEmail(): string
    {
        return (string)$this->credential['client_email'];
    }

    /**
     * @return array<int, array<string, mixed>>
     */
    public function listDocuments(string $collectionPath, ?int $limit = null): array
    {
        $collectionPath = trim($collectionPath, '/');
        if ($collectionPath === '') {
            throw new InvalidArgumentException('Firestore collection path is required.');
        }
        if ($limit !== null && $limit < 1) {
            return [];
        }

        $documents = [];
        $pageToken = null;
        do {
            $remaining = $limit === null ? 300 : max(0, $limit - count($documents));
            if ($limit !== null && $remaining === 0) {
                break;
            }
            $query = ['pageSize' => min(300, $remaining ?: 300)];
            if ($pageToken !== null) {
                $query['pageToken'] = $pageToken;
            }
            $response = $this->request(
                'GET',
                $this->documentsUrl($collectionPath) . '?' . http_build_query($query)
            );
            foreach (($response['documents'] ?? []) as $document) {
                if (is_array($document)) {
                    $documents[] = $this->decodeDocument($document);
                }
            }
            $pageToken = isset($response['nextPageToken']) && is_string($response['nextPageToken'])
                ? $response['nextPageToken']
                : null;
        } while ($pageToken !== null && $pageToken !== '');

        return $documents;
    }

    /** @return array<int, string> */
    public function listTopLevelCollections(): array
    {
        $response = $this->request(
            'POST',
            rtrim($this->documentsUrl(''), '/') . ':listCollectionIds',
            json_encode(['pageSize' => 1000], JSON_THROW_ON_ERROR)
        );
        $collections = array_values(array_filter(
            $response['collectionIds'] ?? [],
            static fn(mixed $value): bool => is_string($value) && $value !== ''
        ));
        sort($collections, SORT_NATURAL | SORT_FLAG_CASE);
        return $collections;
    }

    private function documentsUrl(string $path): string
    {
        $base = 'https://firestore.googleapis.com/v1/projects/' . rawurlencode($this->projectId())
            . '/databases/(default)/documents/';
        if ($path === '') {
            return $base;
        }
        return $base . implode('/', array_map('rawurlencode', explode('/', trim($path, '/'))));
    }

    /** @return array<string, mixed> */
    private function decodeDocument(array $document): array
    {
        $name = (string)($document['name'] ?? '');
        $decoded = [
            '_id' => $name !== '' ? basename($name) : '',
            '_name' => $name,
            '_create_time' => $document['createTime'] ?? null,
            '_update_time' => $document['updateTime'] ?? null,
        ];
        foreach (($document['fields'] ?? []) as $field => $value) {
            if (is_array($value)) {
                $decoded[(string)$field] = $this->decodeValue($value);
            }
        }
        return $decoded;
    }

    private function decodeValue(array $value): mixed
    {
        if (array_key_exists('nullValue', $value)) return null;
        if (array_key_exists('booleanValue', $value)) return (bool)$value['booleanValue'];
        if (array_key_exists('integerValue', $value)) return (int)$value['integerValue'];
        if (array_key_exists('doubleValue', $value)) return (float)$value['doubleValue'];
        if (array_key_exists('timestampValue', $value)) return (string)$value['timestampValue'];
        if (array_key_exists('stringValue', $value)) return (string)$value['stringValue'];
        if (array_key_exists('bytesValue', $value)) return (string)$value['bytesValue'];
        if (array_key_exists('referenceValue', $value)) return (string)$value['referenceValue'];
        if (array_key_exists('geoPointValue', $value)) return $value['geoPointValue'];
        if (array_key_exists('arrayValue', $value)) {
            $items = [];
            foreach (($value['arrayValue']['values'] ?? []) as $item) {
                if (is_array($item)) {
                    $items[] = $this->decodeValue($item);
                }
            }
            return $items;
        }
        if (array_key_exists('mapValue', $value)) {
            $items = [];
            foreach (($value['mapValue']['fields'] ?? []) as $field => $item) {
                if (is_array($item)) {
                    $items[(string)$field] = $this->decodeValue($item);
                }
            }
            return $items;
        }
        return null;
    }

    private function token(): string
    {
        if ($this->accessToken !== null) {
            return $this->accessToken;
        }

        $tokenUri = isset($this->credential['token_uri']) && is_string($this->credential['token_uri'])
            ? $this->credential['token_uri']
            : 'https://oauth2.googleapis.com/token';
        $clientEmail = (string)$this->credential['client_email'];
        $now = time();
        $assertion = JWT::encode([
            'iss' => $clientEmail,
            'sub' => $clientEmail,
            'aud' => $tokenUri,
            'iat' => $now,
            'exp' => $now + 3600,
            'scope' => 'https://www.googleapis.com/auth/datastore',
        ], (string)$this->credential['private_key'], 'RS256');

        $response = $this->requestWithoutToken(
            'POST',
            $tokenUri,
            http_build_query([
                'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                'assertion' => $assertion,
            ], '', '&', PHP_QUERY_RFC3986),
            ['Content-Type: application/x-www-form-urlencoded']
        );
        $token = $response['access_token'] ?? null;
        if (!is_string($token) || $token === '') {
            throw new RuntimeException('OAuth token response did not contain an access token.');
        }
        $this->accessToken = $token;
        return $token;
    }

    /** @return array<string, mixed> */
    private function request(string $method, string $url, ?string $body = null): array
    {
        $headers = ['Authorization: Bearer ' . $this->token()];
        if ($body !== null) {
            $headers[] = 'Content-Type: application/json';
        }
        return $this->requestWithoutToken($method, $url, $body, $headers);
    }

    /** @return array<string, mixed> */
    private function requestWithoutToken(
        string $method,
        string $url,
        ?string $body,
        array $headers
    ): array {
        $lastMessage = 'unknown network error';
        for ($attempt = 1; $attempt <= 3; $attempt++) {
            $handle = curl_init($url);
            if ($handle === false) {
                throw new RuntimeException('Unable to initialize Firestore HTTP request.');
            }
            curl_setopt_array($handle, [
                CURLOPT_CUSTOMREQUEST => $method,
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_FOLLOWLOCATION => false,
                CURLOPT_CONNECTTIMEOUT => 15,
                CURLOPT_TIMEOUT => 60,
                CURLOPT_HTTPHEADER => array_merge(['Accept: application/json'], $headers),
            ]);
            if ($body !== null) {
                curl_setopt($handle, CURLOPT_POSTFIELDS, $body);
            }
            $response = curl_exec($handle);
            $status = (int)curl_getinfo($handle, CURLINFO_RESPONSE_CODE);
            $lastMessage = curl_error($handle) ?: "HTTP $status";
            curl_close($handle);

            if (is_string($response)) {
                $decoded = json_decode($response, true);
                if (is_array($decoded) && $status >= 200 && $status < 300) {
                    return $decoded;
                }
                if (is_array($decoded)) {
                    $lastMessage = (string)($decoded['error']['message'] ?? $decoded['error_description'] ?? $lastMessage);
                }
            }
            if (!in_array($status, [429, 500, 502, 503, 504], true) || $attempt === 3) {
                break;
            }
            sleep($attempt);
        }
        throw new RuntimeException('Firestore request failed: ' . $lastMessage);
    }
}
