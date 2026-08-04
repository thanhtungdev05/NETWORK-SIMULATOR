<?php
declare(strict_types=1);

const TRAINING_TRACKING_SCHEMA_VERSION = '1.0';
const TRAINING_TRACKING_START_ACTION = 'training.attempt.start';
const TRAINING_TRACKING_FINISH_ACTION = 'training.attempt.finish';
const TRAINING_TRACKING_EVENT_FIELDS = [
    'eventId',
    'attemptId',
    'employeeCode',
    'labId',
    'deviceModel',
    'action',
    'status',
    'metadata',
    'eventTime',
    'schemaVersion',
];
const TRAINING_TRACKING_EVENT_STATUSES = [
    'started',
    'in_progress',
    'success',
    'passed',
    'failed',
    'error',
    'reset',
    'completed',
    'abandoned',
];

final class TrainingTrackingValidationException extends InvalidArgumentException
{
}

final class TrainingTrackingHttpException extends RuntimeException
{
    public function __construct(
        public readonly int $statusCode,
        public readonly string $errorCode,
        string $message
    ) {
        parent::__construct($message);
    }
}

function training_tracking_is_logical_path(array $segments): bool
{
    $path = implode('/', array_slice($segments, 1));
    return in_array($path, ['attempts/start', 'events', 'attempts/finish', 'dashboard'], true);
}

function training_tracking_text_length(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value) : strlen($value);
}

function training_tracking_required_text(
    array $input,
    string $field,
    int $maximumLength,
    ?string $pattern = null
): string {
    if (!array_key_exists($field, $input) || !is_string($input[$field])) {
        throw new TrainingTrackingValidationException("$field must be a string.");
    }

    $value = trim($input[$field]);
    if ($value === '') {
        throw new TrainingTrackingValidationException("$field is required.");
    }
    if (training_tracking_text_length($value) > $maximumLength) {
        throw new TrainingTrackingValidationException("$field exceeds $maximumLength characters.");
    }
    if ($pattern !== null && preg_match($pattern, $value) !== 1) {
        throw new TrainingTrackingValidationException("$field has an invalid format.");
    }
    return $value;
}

function training_tracking_uuid(array $input, string $field): string
{
    $value = training_tracking_required_text(
        $input,
        $field,
        36,
        '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i'
    );
    return strtolower($value);
}

function training_tracking_sensitive_metadata_key(string $key): bool
{
    $normalized = strtolower((string)preg_replace('/[^a-z0-9]+/i', '', $key));
    if ($normalized === '') {
        return false;
    }

    foreach ([
        'password',
        'passwd',
        'passphrase',
        'pwd',
        'presharedkey',
        'privatekey',
        'wifikey',
        'wifipass',
        'psk',
        'secret',
        'token',
        'cookie',
        'authorization',
        'credential',
        'sessionid',
        'pppoeusername',
        'pppoeuser',
        'pppoeaccount',
        'pppoepassword',
        'pppoepass',
    ] as $sensitiveFragment) {
        if (str_contains($normalized, $sensitiveFragment)) {
            return true;
        }
    }
    return false;
}

function training_tracking_object_declares_sensitive_field(array $value): bool
{
    if (array_is_list($value)) {
        return false;
    }

    foreach (['field', 'fieldName', 'name', 'key', 'type'] as $descriptor) {
        if (!isset($value[$descriptor]) || !is_scalar($value[$descriptor])) {
            continue;
        }
        if (training_tracking_sensitive_metadata_key((string)$value[$descriptor])) {
            return true;
        }
    }
    return false;
}

function training_tracking_sanitize_metadata_string(string $value): string
{
    $value = (string)preg_replace(
        '/\b(password|passwd|passphrase|pwd|psk|secret|token|cookie|authorization|pppoe(?:user(?:name)?|account|pass(?:word)?))\s*[:=]\s*[^\s,;]+/i',
        '$1=[REDACTED]',
        $value
    );
    return (string)preg_replace('/\bBearer\s+[A-Za-z0-9._~+\/-]+=*/i', 'Bearer [REDACTED]', $value);
}

function training_tracking_sanitize_metadata_node(mixed $value, int $depth, int &$nodeCount): mixed
{
    if ($depth > 6) {
        throw new TrainingTrackingValidationException('metadata exceeds the maximum nesting depth.');
    }
    $nodeCount++;
    if ($nodeCount > 300) {
        throw new TrainingTrackingValidationException('metadata contains too many values.');
    }

    if (is_array($value)) {
        if (count($value) > 100) {
            throw new TrainingTrackingValidationException('metadata contains too many entries.');
        }
        if (training_tracking_object_declares_sensitive_field($value)) {
            return [];
        }

        $safe = [];
        foreach ($value as $key => $child) {
            if (!is_int($key)) {
                if (training_tracking_text_length((string)$key) > 64) {
                    throw new TrainingTrackingValidationException('metadata contains a key longer than 64 characters.');
                }
                if (training_tracking_sensitive_metadata_key((string)$key)) {
                    continue;
                }
            }
            $safe[$key] = training_tracking_sanitize_metadata_node($child, $depth + 1, $nodeCount);
        }
        return $safe;
    }

    if (is_string($value)) {
        if (training_tracking_text_length($value) > 2000) {
            throw new TrainingTrackingValidationException('metadata contains a string longer than 2000 characters.');
        }
        return training_tracking_sanitize_metadata_string($value);
    }
    if ($value === null || is_bool($value) || is_int($value)) {
        return $value;
    }
    if (is_float($value) && is_finite($value)) {
        return $value;
    }
    throw new TrainingTrackingValidationException('metadata contains an unsupported value.');
}

function training_tracking_sanitize_metadata(array $metadata): array
{
    if ($metadata !== [] && array_is_list($metadata)) {
        throw new TrainingTrackingValidationException('metadata must be a JSON object.');
    }

    $nodeCount = 0;
    $safe = training_tracking_sanitize_metadata_node($metadata, 0, $nodeCount);
    if (!is_array($safe)) {
        throw new TrainingTrackingValidationException('metadata must be a JSON object.');
    }

    $encoded = json_encode($safe, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($encoded === false || strlen($encoded) > 16384) {
        throw new TrainingTrackingValidationException('metadata exceeds 16 KiB after sanitization.');
    }
    return $safe;
}

function training_tracking_normalize_event_time(array $input): string
{
    $value = training_tracking_required_text($input, 'eventTime', 40);
    if (preg_match(
        '/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,6})?(Z|[+-](\d{2}):(\d{2}))$/',
        $value,
        $parts
    ) !== 1) {
        throw new TrainingTrackingValidationException('eventTime must be an ISO-8601 timestamp with a timezone.');
    }
    $year = (int)$parts[1];
    $month = (int)$parts[2];
    $day = (int)$parts[3];
    $hour = (int)$parts[4];
    $minute = (int)$parts[5];
    $second = (int)$parts[6];
    $timezoneHour = isset($parts[8]) ? (int)$parts[8] : 0;
    $timezoneMinute = isset($parts[9]) ? (int)$parts[9] : 0;
    if (
        !checkdate($month, $day, $year)
        || $hour > 23
        || $minute > 59
        || $second > 59
        || $timezoneHour > 14
        || $timezoneMinute > 59
        || ($timezoneHour === 14 && $timezoneMinute !== 0)
    ) {
        throw new TrainingTrackingValidationException('eventTime is invalid.');
    }

    try {
        $timestamp = new DateTimeImmutable($value);
    } catch (Throwable) {
        throw new TrainingTrackingValidationException('eventTime is invalid.');
    }
    return $timestamp->format('Y-m-d\TH:i:s.uP');
}

function training_tracking_validate_event(array $input): array
{
    $missing = array_values(array_diff(TRAINING_TRACKING_EVENT_FIELDS, array_keys($input)));
    if ($missing) {
        throw new TrainingTrackingValidationException('Missing event fields: ' . implode(', ', $missing) . '.');
    }
    $unknown = array_values(array_diff(array_keys($input), TRAINING_TRACKING_EVENT_FIELDS));
    if ($unknown) {
        throw new TrainingTrackingValidationException('Unknown event fields: ' . implode(', ', $unknown) . '.');
    }
    if (!is_array($input['metadata'])) {
        throw new TrainingTrackingValidationException('metadata must be a JSON object.');
    }

    $status = training_tracking_required_text($input, 'status', 24, '/^[a-z][a-z0-9_-]*$/');
    if (!in_array($status, TRAINING_TRACKING_EVENT_STATUSES, true)) {
        throw new TrainingTrackingValidationException('status is not supported.');
    }

    $schemaVersion = training_tracking_required_text($input, 'schemaVersion', 16);
    if ($schemaVersion !== TRAINING_TRACKING_SCHEMA_VERSION) {
        throw new TrainingTrackingValidationException('schemaVersion is not supported.');
    }

    return [
        'eventId' => training_tracking_uuid($input, 'eventId'),
        'attemptId' => training_tracking_uuid($input, 'attemptId'),
        'employeeCode' => strtoupper(training_tracking_required_text(
            $input,
            'employeeCode',
            64,
            '/^[A-Za-z0-9][A-Za-z0-9._-]{0,63}$/'
        )),
        'labId' => training_tracking_required_text(
            $input,
            'labId',
            128,
            '/^[A-Za-z0-9][A-Za-z0-9._:-]{0,127}$/'
        ),
        'deviceModel' => training_tracking_required_text(
            $input,
            'deviceModel',
            128,
            '/^[A-Za-z0-9][A-Za-z0-9._ ()\/-]{0,127}$/'
        ),
        'action' => training_tracking_required_text(
            $input,
            'action',
            128,
            '/^[a-z][a-z0-9_-]*\.[a-z][a-z0-9_-]*\.[a-z][a-z0-9_-]*$/'
        ),
        'status' => $status,
        'metadata' => training_tracking_sanitize_metadata($input['metadata']),
        'eventTime' => training_tracking_normalize_event_time($input),
        'schemaVersion' => $schemaVersion,
    ];
}

function training_tracking_validate_event_for_route(array $event, string $route): void
{
    if ($route === 'start') {
        if ($event['action'] !== TRAINING_TRACKING_START_ACTION) {
            throw new TrainingTrackingValidationException('Start events must use training.attempt.start.');
        }
        if (!in_array($event['status'], ['started', 'in_progress', 'success'], true)) {
            throw new TrainingTrackingValidationException('Start event status must be started, in_progress, or success.');
        }
        return;
    }
    if ($route === 'finish') {
        if ($event['action'] !== TRAINING_TRACKING_FINISH_ACTION) {
            throw new TrainingTrackingValidationException('Finish events must use training.attempt.finish.');
        }
        if (!in_array($event['status'], ['completed', 'success', 'failed', 'abandoned'], true)) {
            throw new TrainingTrackingValidationException('Finish event status is invalid.');
        }
        return;
    }
    if ($route === 'event' && in_array(
        $event['action'],
        [TRAINING_TRACKING_START_ACTION, TRAINING_TRACKING_FINISH_ACTION],
        true
    )) {
        throw new TrainingTrackingValidationException('Lifecycle events must use the start or finish endpoint.');
    }
}

function training_tracking_canonicalize(mixed $value): mixed
{
    if (!is_array($value)) {
        return $value;
    }
    if (!array_is_list($value)) {
        ksort($value, SORT_STRING);
    }
    foreach ($value as $key => $child) {
        $value[$key] = training_tracking_canonicalize($child);
    }
    return $value;
}

function training_tracking_payload_hash(array $event): string
{
    $canonical = training_tracking_canonicalize($event);
    $json = json_encode(
        $canonical,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRESERVE_ZERO_FRACTION
    );
    if ($json === false) {
        throw new TrainingTrackingValidationException('The event cannot be encoded as JSON.');
    }
    return hash('sha256', $json);
}

function training_tracking_encode_json_object(array $value): string
{
    $json = json_encode(
        $value === [] ? new stdClass() : $value,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );
    if ($json === false) {
        throw new TrainingTrackingValidationException('A metadata object cannot be encoded as JSON.');
    }
    return $json;
}

function training_tracking_metadata_from_database(mixed $value): array
{
    if (is_array($value)) {
        return $value;
    }
    if (!is_string($value) || $value === '') {
        return [];
    }
    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : [];
}

function training_tracking_atom(?string $value): ?string
{
    if ($value === null || $value === '') {
        return null;
    }
    return (new DateTimeImmutable($value))->format(DateTimeInterface::ATOM);
}

function training_tracking_event_response(array $row): array
{
    return [
        'eventId' => (string)$row['event_id'],
        'attemptId' => (string)$row['attempt_id'],
        'employeeCode' => (string)$row['employee_code'],
        'labId' => (string)$row['lab_id'],
        'deviceModel' => (string)$row['device_model'],
        'action' => (string)$row['action'],
        'status' => (string)$row['status'],
        'metadata' => training_tracking_metadata_from_database($row['metadata'] ?? null),
        'eventTime' => training_tracking_atom((string)$row['event_time']),
        'schemaVersion' => (string)$row['schema_version'],
        'receivedAt' => training_tracking_atom((string)$row['received_at']),
    ];
}

function training_tracking_attempt_response(array $row): array
{
    return [
        'attemptId' => (string)$row['attempt_id'],
        'employeeCode' => (string)$row['employee_code'],
        'labId' => (string)$row['lab_id'],
        'deviceModel' => (string)$row['device_model'],
        'status' => (string)$row['status'],
        'startedAt' => training_tracking_atom((string)$row['started_at']),
        'finishedAt' => training_tracking_atom($row['finished_at'] ?? null),
        'schemaVersion' => (string)$row['schema_version'],
    ];
}

function training_tracking_result_response(array $row): array
{
    return [
        'attemptId' => (string)$row['attempt_id'],
        'outcome' => (string)$row['outcome'],
        'score' => $row['score'] === null ? null : (float)$row['score'],
        'durationSeconds' => (int)$row['duration_seconds'],
        'passedCheckpoints' => (int)$row['passed_checkpoints'],
        'failedCheckpoints' => (int)$row['failed_checkpoints'],
        'errorCount' => (int)$row['error_count'],
        'totalActions' => (int)$row['total_actions'],
        'firstTry' => filter_var($row['first_try'], FILTER_VALIDATE_BOOLEAN),
        'summary' => training_tracking_metadata_from_database($row['summary'] ?? null),
        'completedAt' => training_tracking_atom((string)$row['completed_at']),
    ];
}

function training_tracking_with_transaction(PDO $pdo, callable $callback): mixed
{
    if ($pdo->inTransaction()) {
        throw new LogicException('Training tracking operations require their own transaction.');
    }
    $pdo->beginTransaction();
    try {
        $result = $callback();
        $pdo->commit();
        return $result;
    } catch (Throwable $exception) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $exception;
    }
}

function training_tracking_fetch_attempt(PDO $pdo, string $attemptId, bool $forUpdate = false): ?array
{
    $sql = 'SELECT attempt_id, employee_code, lab_id, device_model, status, started_at, finished_at,
                   start_event_id, finish_event_id, schema_version, created_at, updated_at
            FROM training_attempts WHERE attempt_id = :attempt_id';
    if ($forUpdate) {
        $sql .= ' FOR UPDATE';
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['attempt_id' => $attemptId]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function training_tracking_fetch_event(PDO $pdo, string $eventId): ?array
{
    $stmt = $pdo->prepare(
        'SELECT event_id, attempt_id, employee_code, lab_id, device_model, action, status, metadata,
                event_time, schema_version, payload_hash, received_at
         FROM training_events WHERE event_id = :event_id'
    );
    $stmt->execute(['event_id' => $eventId]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function training_tracking_fetch_result(PDO $pdo, string $attemptId): ?array
{
    $stmt = $pdo->prepare(
        'SELECT attempt_id, outcome, score, duration_seconds, passed_checkpoints, failed_checkpoints,
                error_count, total_actions, first_try, summary, completed_at, created_at, updated_at
         FROM training_results WHERE attempt_id = :attempt_id'
    );
    $stmt->execute(['attempt_id' => $attemptId]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function training_tracking_assert_event_collision_matches(array $row, array $event): void
{
    if (!hash_equals((string)$row['payload_hash'], training_tracking_payload_hash($event))) {
        throw new TrainingTrackingHttpException(
            409,
            'tracking/event-id-conflict',
            'eventId is already associated with a different payload.'
        );
    }
}

function training_tracking_assert_attempt_matches(array $attempt, array $event): void
{
    foreach ([
        'employee_code' => 'employeeCode',
        'lab_id' => 'labId',
        'device_model' => 'deviceModel',
        'schema_version' => 'schemaVersion',
    ] as $column => $field) {
        if ((string)$attempt[$column] !== (string)$event[$field]) {
            throw new TrainingTrackingHttpException(
                409,
                'tracking/attempt-conflict',
                "$field does not match the existing attempt."
            );
        }
    }
}

function training_tracking_assert_event_not_before_attempt(array $attempt, array $event): void
{
    $startedAt = new DateTimeImmutable((string)$attempt['started_at']);
    $eventTime = new DateTimeImmutable((string)$event['eventTime']);
    if ($eventTime < $startedAt) {
        throw new TrainingTrackingHttpException(
            409,
            'tracking/event-order-conflict',
            'eventTime cannot be earlier than the attempt start time.'
        );
    }
}

function training_tracking_insert_event(PDO $pdo, array $event): array
{
    $metadata = training_tracking_encode_json_object($event['metadata']);
    $stmt = $pdo->prepare(
        'INSERT INTO training_events
         (event_id, attempt_id, employee_code, lab_id, device_model, action, status, metadata,
          event_time, schema_version, payload_hash, received_at)
         VALUES
         (:event_id, :attempt_id, :employee_code, :lab_id, :device_model, :action, :status,
          CAST(:metadata AS JSONB), :event_time, :schema_version, :payload_hash, NOW())
         ON CONFLICT (event_id) DO NOTHING
         RETURNING event_id, attempt_id, employee_code, lab_id, device_model, action, status, metadata,
                   event_time, schema_version, payload_hash, received_at'
    );
    $stmt->execute([
        'event_id' => $event['eventId'],
        'attempt_id' => $event['attemptId'],
        'employee_code' => $event['employeeCode'],
        'lab_id' => $event['labId'],
        'device_model' => $event['deviceModel'],
        'action' => $event['action'],
        'status' => $event['status'],
        'metadata' => $metadata,
        'event_time' => $event['eventTime'],
        'schema_version' => $event['schemaVersion'],
        'payload_hash' => training_tracking_payload_hash($event),
    ]);
    $row = $stmt->fetch();
    if ($row) {
        return ['row' => $row, 'duplicate' => false];
    }

    $existing = training_tracking_fetch_event($pdo, $event['eventId']);
    if (!$existing) {
        throw new RuntimeException('Unable to read an event after an idempotent insert conflict.');
    }
    training_tracking_assert_event_collision_matches($existing, $event);
    return ['row' => $existing, 'duplicate' => true];
}

function training_tracking_start_attempt(PDO $pdo, array $event): array
{
    training_tracking_validate_event_for_route($event, 'start');
    return training_tracking_with_transaction($pdo, function () use ($pdo, $event): array {
        $stmt = $pdo->prepare(
            'INSERT INTO training_attempts
             (attempt_id, employee_code, lab_id, device_model, status, started_at, start_event_id,
              schema_version, created_at, updated_at)
             VALUES
             (:attempt_id, :employee_code, :lab_id, :device_model, \'in_progress\', :started_at,
              :start_event_id, :schema_version, NOW(), NOW())
             ON CONFLICT (attempt_id) DO NOTHING
             RETURNING attempt_id, employee_code, lab_id, device_model, status, started_at, finished_at,
                       start_event_id, finish_event_id, schema_version, created_at, updated_at'
        );
        $stmt->execute([
            'attempt_id' => $event['attemptId'],
            'employee_code' => $event['employeeCode'],
            'lab_id' => $event['labId'],
            'device_model' => $event['deviceModel'],
            'started_at' => $event['eventTime'],
            'start_event_id' => $event['eventId'],
            'schema_version' => $event['schemaVersion'],
        ]);
        $attempt = $stmt->fetch();
        if (!$attempt) {
            $attempt = training_tracking_fetch_attempt($pdo, $event['attemptId'], true);
            if (!$attempt) {
                throw new RuntimeException('Unable to read an attempt after an idempotent insert conflict.');
            }
            training_tracking_assert_attempt_matches($attempt, $event);
            if ((string)$attempt['start_event_id'] !== $event['eventId']) {
                throw new TrainingTrackingHttpException(
                    409,
                    'tracking/attempt-conflict',
                    'attemptId is already associated with a different start event.'
                );
            }
            if (new DateTimeImmutable((string)$attempt['started_at']) != new DateTimeImmutable($event['eventTime'])) {
                throw new TrainingTrackingHttpException(
                    409,
                    'tracking/attempt-conflict',
                    'eventTime does not match the existing attempt start time.'
                );
            }
        }

        $insertedEvent = training_tracking_insert_event($pdo, $event);
        return [
            'attempt' => $attempt,
            'event' => $insertedEvent['row'],
            'duplicate' => $insertedEvent['duplicate'],
        ];
    });
}

function training_tracking_record_event(PDO $pdo, array $event): array
{
    training_tracking_validate_event_for_route($event, 'event');
    return training_tracking_with_transaction($pdo, function () use ($pdo, $event): array {
        $existing = training_tracking_fetch_event($pdo, $event['eventId']);
        if ($existing) {
            training_tracking_assert_event_collision_matches($existing, $event);
            $attempt = training_tracking_fetch_attempt($pdo, $event['attemptId']);
            if (!$attempt) {
                throw new RuntimeException('The stored event references a missing attempt.');
            }
            return ['attempt' => $attempt, 'event' => $existing, 'duplicate' => true];
        }

        $attempt = training_tracking_fetch_attempt($pdo, $event['attemptId'], true);
        if (!$attempt) {
            throw new TrainingTrackingHttpException(404, 'tracking/attempt-not-found', 'attemptId was not found.');
        }
        training_tracking_assert_attempt_matches($attempt, $event);
        if ((string)$attempt['status'] !== 'in_progress') {
            throw new TrainingTrackingHttpException(
                409,
                'tracking/attempt-closed',
                'The attempt no longer accepts events.'
            );
        }
        training_tracking_assert_event_not_before_attempt($attempt, $event);

        $insertedEvent = training_tracking_insert_event($pdo, $event);
        return [
            'attempt' => $attempt,
            'event' => $insertedEvent['row'],
            'duplicate' => $insertedEvent['duplicate'],
        ];
    });
}

function training_tracking_finish_values(array $event): array
{
    $metadata = $event['metadata'];
    $outcome = $metadata['outcome'] ?? null;
    if ($outcome !== null && !is_string($outcome)) {
        throw new TrainingTrackingValidationException('metadata.outcome must be text.');
    }
    $outcome = strtolower(trim((string)$outcome));
    if ($outcome === '') {
        $outcome = match ($event['status']) {
            'failed' => 'failed',
            'abandoned' => 'abandoned',
            default => 'passed',
        };
    }
    if (!in_array($outcome, ['passed', 'failed', 'abandoned'], true)) {
        throw new TrainingTrackingValidationException('metadata.outcome is not supported.');
    }

    $score = $metadata['score'] ?? null;
    if ($score !== null && !is_int($score) && !is_float($score)) {
        throw new TrainingTrackingValidationException('metadata.score must be a number.');
    }
    if ($score !== null && ($score < 0 || $score > 100)) {
        throw new TrainingTrackingValidationException('metadata.score must be between 0 and 100.');
    }

    $summary = $metadata['summary'] ?? [];
    if (!is_array($summary) || ($summary !== [] && array_is_list($summary))) {
        throw new TrainingTrackingValidationException('metadata.summary must be a JSON object.');
    }
    return ['outcome' => $outcome, 'score' => $score, 'summary' => $summary];
}

function training_tracking_finish_attempt(PDO $pdo, array $event): array
{
    training_tracking_validate_event_for_route($event, 'finish');
    $finishValues = training_tracking_finish_values($event);

    return training_tracking_with_transaction($pdo, function () use ($pdo, $event, $finishValues): array {
        $existing = training_tracking_fetch_event($pdo, $event['eventId']);
        if ($existing) {
            training_tracking_assert_event_collision_matches($existing, $event);
            $attempt = training_tracking_fetch_attempt($pdo, $event['attemptId']);
            $result = training_tracking_fetch_result($pdo, $event['attemptId']);
            if (!$attempt || !$result) {
                throw new RuntimeException('The idempotent finish event has incomplete persisted state.');
            }
            return ['attempt' => $attempt, 'event' => $existing, 'result' => $result, 'duplicate' => true];
        }

        $attempt = training_tracking_fetch_attempt($pdo, $event['attemptId'], true);
        if (!$attempt) {
            throw new TrainingTrackingHttpException(404, 'tracking/attempt-not-found', 'attemptId was not found.');
        }
        training_tracking_assert_attempt_matches($attempt, $event);
        if ((string)$attempt['status'] !== 'in_progress') {
            $existingAfterLock = training_tracking_fetch_event($pdo, $event['eventId']);
            if ($existingAfterLock) {
                training_tracking_assert_event_collision_matches($existingAfterLock, $event);
                $result = training_tracking_fetch_result($pdo, $event['attemptId']);
                if (!$result) {
                    throw new RuntimeException('The idempotent finish event has no result.');
                }
                return [
                    'attempt' => $attempt,
                    'event' => $existingAfterLock,
                    'result' => $result,
                    'duplicate' => true,
                ];
            }
            throw new TrainingTrackingHttpException(
                409,
                'tracking/attempt-closed',
                'The attempt has already been finished.'
            );
        }
        training_tracking_assert_event_not_before_attempt($attempt, $event);

        $insertedEvent = training_tracking_insert_event($pdo, $event);
        $attemptStatus = match ($finishValues['outcome']) {
            'failed' => 'failed',
            'abandoned' => 'abandoned',
            default => 'completed',
        };
        $stmt = $pdo->prepare(
            'UPDATE training_attempts
             SET status = :status, finished_at = :finished_at, finish_event_id = :finish_event_id,
                 updated_at = NOW()
             WHERE attempt_id = :attempt_id
             RETURNING attempt_id, employee_code, lab_id, device_model, status, started_at, finished_at,
                       start_event_id, finish_event_id, schema_version, created_at, updated_at'
        );
        $stmt->execute([
            'status' => $attemptStatus,
            'finished_at' => $event['eventTime'],
            'finish_event_id' => $event['eventId'],
            'attempt_id' => $event['attemptId'],
        ]);
        $attempt = $stmt->fetch();

        $counterStmt = $pdo->prepare(
            'SELECT
                COUNT(*) FILTER (WHERE status = \'passed\') AS passed_checkpoints,
                COUNT(*) FILTER (WHERE status = \'failed\') AS failed_checkpoints,
                COUNT(*) FILTER (WHERE status = \'error\' OR action LIKE \'%.error\') AS error_count,
                COUNT(*) AS total_actions
             FROM training_events
             WHERE attempt_id = :attempt_id
               AND action NOT IN (:start_action, :finish_action)'
        );
        $counterStmt->execute([
            'attempt_id' => $event['attemptId'],
            'start_action' => TRAINING_TRACKING_START_ACTION,
            'finish_action' => TRAINING_TRACKING_FINISH_ACTION,
        ]);
        $counters = $counterStmt->fetch() ?: [];
        $passed = (int)($counters['passed_checkpoints'] ?? 0);
        $failed = (int)($counters['failed_checkpoints'] ?? 0);
        $errors = (int)($counters['error_count'] ?? 0);
        $totalActions = (int)($counters['total_actions'] ?? 0);
        $firstTry = $finishValues['outcome'] === 'passed' && $failed === 0;
        $startedAt = new DateTimeImmutable((string)$attempt['started_at']);
        $finishedAt = new DateTimeImmutable((string)$attempt['finished_at']);
        $duration = max(0, $finishedAt->getTimestamp() - $startedAt->getTimestamp());
        $summary = training_tracking_encode_json_object($finishValues['summary']);

        $resultStmt = $pdo->prepare(
            'INSERT INTO training_results
             (attempt_id, outcome, score, duration_seconds, passed_checkpoints, failed_checkpoints,
              error_count, total_actions, first_try, summary, completed_at, created_at, updated_at)
             VALUES
             (:attempt_id, :outcome, :score, :duration_seconds, :passed_checkpoints, :failed_checkpoints,
              :error_count, :total_actions, :first_try, CAST(:summary AS JSONB), :completed_at, NOW(), NOW())
             ON CONFLICT (attempt_id) DO UPDATE SET
                outcome = EXCLUDED.outcome,
                score = EXCLUDED.score,
                duration_seconds = EXCLUDED.duration_seconds,
                passed_checkpoints = EXCLUDED.passed_checkpoints,
                failed_checkpoints = EXCLUDED.failed_checkpoints,
                error_count = EXCLUDED.error_count,
                total_actions = EXCLUDED.total_actions,
                first_try = EXCLUDED.first_try,
                summary = EXCLUDED.summary,
                completed_at = EXCLUDED.completed_at,
                updated_at = NOW()
             RETURNING attempt_id, outcome, score, duration_seconds, passed_checkpoints, failed_checkpoints,
                       error_count, total_actions, first_try, summary, completed_at, created_at, updated_at'
        );
        $resultStmt->execute([
            'attempt_id' => $event['attemptId'],
            'outcome' => $finishValues['outcome'],
            'score' => $finishValues['score'],
            'duration_seconds' => $duration,
            'passed_checkpoints' => $passed,
            'failed_checkpoints' => $failed,
            'error_count' => $errors,
            'total_actions' => $totalActions,
            'first_try' => $firstTry ? 'true' : 'false',
            'summary' => $summary,
            'completed_at' => $event['eventTime'],
        ]);
        $result = $resultStmt->fetch();

        return [
            'attempt' => $attempt,
            'event' => $insertedEvent['row'],
            'result' => $result,
            'duplicate' => $insertedEvent['duplicate'],
        ];
    });
}

function training_tracking_validate_dashboard_cursor(array $cursor): array
{
    if ($cursor === []) {
        return [];
    }
    if (
        count($cursor) !== 2
        || !array_key_exists('started_at', $cursor)
        || !array_key_exists('attempt_id', $cursor)
        || !is_string($cursor['started_at'])
        || !is_string($cursor['attempt_id'])
        || preg_match(
            '/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
            $cursor['attempt_id']
        ) !== 1
    ) {
        throw new TrainingTrackingHttpException(400, 'bad-cursor', 'The dashboard cursor is invalid.');
    }

    try {
        $startedAt = new DateTimeImmutable($cursor['started_at']);
    } catch (Throwable) {
        throw new TrainingTrackingHttpException(400, 'bad-cursor', 'The dashboard cursor is invalid.');
    }
    return [
        'started_at' => $startedAt->format('Y-m-d\TH:i:s.uP'),
        'attempt_id' => strtolower($cursor['attempt_id']),
    ];
}

function training_tracking_dashboard_data(PDO $pdo, int $limit = 500, array $cursor = []): array
{
    $limit = max(1, min(500, $limit));
    $cursor = training_tracking_validate_dashboard_cursor($cursor);
    $sql = 'SELECT a.attempt_id, a.employee_code, a.lab_id, a.device_model, a.status, a.started_at,
                a.finished_at, a.start_event_id, a.finish_event_id, a.schema_version,
                r.outcome, r.score, r.duration_seconds, r.first_try,
                start_event.metadata AS start_metadata,
                latest_event.action AS last_action,
                latest_event.status AS last_action_status
         FROM training_attempts a
         LEFT JOIN training_results r ON r.attempt_id = a.attempt_id
         LEFT JOIN training_events start_event ON start_event.event_id = a.start_event_id
         LEFT JOIN LATERAL (
             SELECT e.action, e.status
             FROM training_events e
             WHERE e.attempt_id = a.attempt_id
               AND e.action NOT IN (\'training.attempt.start\', \'training.attempt.finish\')
             ORDER BY e.event_time DESC, e.received_at DESC, e.event_id DESC
             LIMIT 1
         ) latest_event ON TRUE';
    $params = [];
    if ($cursor !== []) {
        $sql .= ' WHERE (
            a.started_at < :cursor_started_at
            OR (a.started_at = :cursor_started_at AND a.attempt_id < CAST(:cursor_attempt_id AS UUID))
        )';
        $params = [
            'cursor_started_at' => $cursor['started_at'],
            'cursor_attempt_id' => $cursor['attempt_id'],
        ];
    }
    $sql .= ' ORDER BY a.started_at DESC, a.attempt_id DESC LIMIT ' . ($limit + 1);
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();
    $hasMore = count($rows) > $limit;
    if ($hasMore) {
        $rows = array_slice($rows, 0, $limit);
    }
    $lastRow = $rows ? $rows[array_key_last($rows)] : null;
    $sessions = [];
    foreach ($rows as $row) {
        $startMetadata = training_tracking_metadata_from_database($row['start_metadata'] ?? null);
        $duration = $row['duration_seconds'];
        if ($duration === null) {
            $end = !empty($row['finished_at'])
                ? new DateTimeImmutable((string)$row['finished_at'])
                : new DateTimeImmutable();
            $duration = max(0, $end->getTimestamp() - (new DateTimeImmutable((string)$row['started_at']))->getTimestamp());
        }
        $sessions[] = [
            'session_id' => (string)$row['attempt_id'],
            'attempt_id' => (string)$row['attempt_id'],
            'technician_id' => (string)$row['employee_code'],
            'employee_code' => (string)$row['employee_code'],
            'full_name' => (string)$row['employee_code'],
            'lab_id' => (string)$row['lab_id'],
            'lab_name' => (string)$row['lab_id'],
            'device_id' => (string)$row['device_model'],
            'device_name' => (string)$row['device_model'],
            'device_model' => (string)$row['device_model'],
            'started_at' => training_tracking_atom((string)$row['started_at']),
            'finished_at' => training_tracking_atom($row['finished_at'] ?? null),
            'duration_sec' => (int)$duration,
            'mode' => is_string($startMetadata['mode'] ?? null) ? $startMetadata['mode'] : 'Thực hành',
            'status' => (string)$row['status'],
            'completed_first_try' => filter_var($row['first_try'] ?? false, FILTER_VALIDATE_BOOLEAN),
            'last_action' => $row['last_action'] ?? TRAINING_TRACKING_START_ACTION,
            'last_action_status' => $row['last_action_status'] ?? 'started',
            'outcome' => $row['outcome'] ?? null,
            'score' => $row['score'] === null ? null : (float)$row['score'],
            'schema_version' => (string)$row['schema_version'],
        ];
    }

    $devices = $pdo->query(
        'SELECT DISTINCT device_model AS device_id, device_model AS model, device_model AS device_name
         FROM training_attempts ORDER BY device_model'
    )->fetchAll();
    $labs = $pdo->query(
        'SELECT DISTINCT ON (lab_id) lab_id, device_model AS device_id, lab_id AS lab_name
         FROM training_attempts ORDER BY lab_id, started_at DESC'
    )->fetchAll();

    $nextCursor = $hasMore && $lastRow
        ? encode_cursor([
            'started_at' => (string)$lastRow['started_at'],
            'attempt_id' => (string)$lastRow['attempt_id'],
        ])
        : null;

    return [
        'data' => [
            'realtime_sessions' => $sessions,
            'sessions' => $sessions,
            'devices' => $devices,
            'labs' => $labs,
        ],
        'pagination' => [
            'limit' => $limit,
            'hasMore' => $hasMore,
            'nextCursor' => $nextCursor,
        ],
    ];
}

function training_tracking_require_json_content_type(): void
{
    $contentType = strtolower(trim((string)($_SERVER['CONTENT_TYPE'] ?? $_SERVER['HTTP_CONTENT_TYPE'] ?? '')));
    if (!preg_match('#^application/json(?:\s*;|$)#', $contentType)) {
        throw new TrainingTrackingHttpException(
            415,
            'tracking/unsupported-media-type',
            'Content-Type must be application/json.'
        );
    }
}

function training_tracking_assert_authenticated_employee(array $event): void
{
    $current = require_user();
    $employeeCode = trim((string)($current['employee_id'] ?? ''));
    if ($employeeCode === '') {
        throw new TrainingTrackingHttpException(
            422,
            'tracking/employee-code-missing',
            'The authenticated profile has no employee code.'
        );
    }
    if (strtoupper($employeeCode) !== $event['employeeCode']) {
        throw new TrainingTrackingHttpException(
            403,
            'tracking/employee-code-mismatch',
            'employeeCode does not match the authenticated user.'
        );
    }
}

function handle_training_tracking(array $segments, string $method): void
{
    $path = implode('/', array_slice($segments, 1));
    try {
        if ($path === 'dashboard') {
            if ($method !== 'GET') {
                throw new TrainingTrackingHttpException(405, 'method-not-allowed', 'Dashboard only supports GET.');
            }
            require_admin();
            $limit = query_limit(500, 500);
            $cursor = decode_cursor(isset($_GET['cursor']) ? (string)$_GET['cursor'] : null);
            respond(training_tracking_dashboard_data(db(), $limit, $cursor));
        }

        if (!in_array($path, ['attempts/start', 'events', 'attempts/finish'], true)) {
            throw new TrainingTrackingHttpException(404, 'not-found', 'Training tracking endpoint not found.');
        }
        if ($method !== 'POST') {
            throw new TrainingTrackingHttpException(405, 'method-not-allowed', 'Training tracking ingestion only supports POST.');
        }

        training_tracking_require_json_content_type();
        $event = training_tracking_validate_event(json_body());
        training_tracking_assert_authenticated_employee($event);

        if ($path === 'attempts/start') {
            $result = training_tracking_start_attempt(db(), $event);
            respond([
                'attempt' => training_tracking_attempt_response($result['attempt']),
                'event' => training_tracking_event_response($result['event']),
                'duplicate' => $result['duplicate'],
            ], $result['duplicate'] ? 200 : 201);
        }
        if ($path === 'events') {
            $result = training_tracking_record_event(db(), $event);
            respond([
                'attempt' => training_tracking_attempt_response($result['attempt']),
                'event' => training_tracking_event_response($result['event']),
                'duplicate' => $result['duplicate'],
            ], $result['duplicate'] ? 200 : 201);
        }

        $result = training_tracking_finish_attempt(db(), $event);
        respond([
            'attempt' => training_tracking_attempt_response($result['attempt']),
            'event' => training_tracking_event_response($result['event']),
            'result' => training_tracking_result_response($result['result']),
            'duplicate' => $result['duplicate'],
        ], $result['duplicate'] ? 200 : 201);
    } catch (TrainingTrackingValidationException $exception) {
        fail(422, 'tracking/invalid-event', $exception->getMessage());
    } catch (TrainingTrackingHttpException $exception) {
        fail($exception->statusCode, $exception->errorCode, $exception->getMessage());
    }
}
