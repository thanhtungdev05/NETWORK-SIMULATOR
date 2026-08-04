<?php
declare(strict_types=1);

// Virtual finish attempt data for local testing (do not use in production)
$TRACKING_VIRTUAL_FINISH = [
    'session_id' => 'VIRTUAL_SES_1',
    'technician_id' => 'DEV_TECH_001',
    'lab_id' => 'LAB_VIRTUAL_ONT_AX3000HV2',
    'started_at' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
    'finished_at' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
    'duration_sec' => 42,
    'mode' => 'Thực hành',
    'status' => 'Hoàn thành',
    'completed_first_try' => true,
    'last_action' => 'SAVE_CLICK_VIRTUAL',
];

function verify_tracking_api_key(): void
{
    $expectedKey = env_value('TRACKING_API_KEY');
    if (!$expectedKey) {
        return;
    }
    $providedKey = $_SERVER['HTTP_X_TRACKING_KEY'] ?? null;
    if (!$providedKey && isset($_SERVER['HTTP_AUTHORIZATION'])) {
        if (preg_match('/Bearer\s+(.*)$/i', $_SERVER['HTTP_AUTHORIZATION'], $matches)) {
            $providedKey = trim($matches[1]);
        }
    }
    if (!$providedKey || !hash_equals($expectedKey, $providedKey)) {
        fail(401, 'unauthorized', 'Invalid or missing API key in X-Tracking-Key header.');
    }
}

function session_response(array $row): array
{
    return [
        'session_id' => (string)$row['session_id'],
        'technician_id' => (string)$row['technician_id'],
        'lab_id' => (string)$row['lab_id'],
        'started_at' => $row['started_at'] ? (new DateTimeImmutable($row['started_at']))->format(DateTimeInterface::ATOM) : null,
        'finished_at' => !empty($row['finished_at']) ? (new DateTimeImmutable($row['finished_at']))->format(DateTimeInterface::ATOM) : null,
        'duration_sec' => (int)($row['duration_sec'] ?? 0),
        'mode' => (string)($row['mode'] ?? 'Thực hành'),
        'status' => (string)($row['status'] ?? 'Đang làm'),
        'completed_first_try' => filter_var($row['completed_first_try'] ?? true, FILTER_VALIDATE_BOOLEAN),
        'last_action' => $row['last_action'] ?? null,
    ];
}

function handle_tracking(array $segments, string $method): void
{
    // Allow a lightweight unauthenticated health check before enforcing API key
    $sub = $segments[1] ?? '';

    if ($sub === 'health' && $method === 'GET') {
        respond([
            'status' => 'ok',
            'service' => 'tracking',
            'time' => (new DateTimeImmutable())->format(DateTimeInterface::ATOM),
        ]);
    }

    // Removed legacy finishAttempt route; use POST /tracking/sessions/{session_id}/finish below.

    verify_tracking_api_key();

    // GET /tracking/data -> Export 3NF dump matching DATABASE_SCHEMA.md
    if ($sub === 'data' && $method === 'GET') {
        $pdo = db();
        $regions = $pdo->query('SELECT region_id, region_name FROM regions ORDER BY region_id')->fetchAll();
        $technicians = $pdo->query('SELECT technician_id, email, full_name, region_id FROM technicians ORDER BY technician_id')->fetchAll();
        $devices = $pdo->query('SELECT device_id, model, device_name FROM devices ORDER BY device_id')->fetchAll();
        $labs = $pdo->query('SELECT lab_id, device_id, lab_name FROM labs ORDER BY lab_id')->fetchAll();
        $sessionRows = $pdo->query('SELECT session_id, technician_id, lab_id, started_at, duration_sec, mode, status, completed_first_try, last_action FROM sessions ORDER BY started_at DESC')->fetchAll();

        $sessions = array_map(function($row) {
            return [
                'session_id' => (string)$row['session_id'],
                'technician_id' => (string)$row['technician_id'],
                'lab_id' => (string)$row['lab_id'],
                'started_at' => (new DateTimeImmutable($row['started_at']))->format(DateTimeInterface::ATOM),
                'duration_sec' => (int)($row['duration_sec'] ?? 0),
                'mode' => (string)$row['mode'],
                'status' => (string)$row['status'],
                'completed_first_try' => filter_var($row['completed_first_try'], FILTER_VALIDATE_BOOLEAN),
                'last_action' => $row['last_action'] ?? null,
            ];
        }, $sessionRows);

        respond([
            'regions' => $regions,
            'technicians' => $technicians,
            'devices' => $devices,
            'labs' => $labs,
            'sessions' => $sessions,
        ]);
    }

    if ($sub === 'sessions') {
        $sessionId = $segments[2] ?? '';
        $action = $segments[3] ?? '';

        // POST /tracking/sessions/start
        if ($sessionId === 'start' && $method === 'POST') {
            $input = json_body();
            $technicianId = optional_text($input, 'technician_id', 50) ?? optional_text($input, 'technicianId', 50);
            $labId = optional_text($input, 'lab_id', 50) ?? optional_text($input, 'labId', 50);
            $mode = optional_text($input, 'mode', 30) ?? 'Thực hành';
            $customSessionId = optional_text($input, 'session_id', 50) ?? optional_text($input, 'sessionId', 50);

            if (!$technicianId || !$labId) {
                fail(400, 'bad-request', 'technician_id and lab_id are required.');
            }
            if (!in_array($mode, ['Thực hành', 'Hướng dẫn'], true)) {
                fail(400, 'bad-request', "mode must be 'Thực hành' or 'Hướng dẫn'.");
            }

            $pdo = db();
            // Verify technician exists
            $techCheck = $pdo->prepare('SELECT technician_id FROM technicians WHERE technician_id = :id');
            $techCheck->execute(['id' => $technicianId]);
            if (!$techCheck->fetch()) {
                fail(404, 'not-found', "Technician '$technicianId' does not exist.");
            }

            // Verify lab exists
            $labCheck = $pdo->prepare('SELECT lab_id FROM labs WHERE lab_id = :id');
            $labCheck->execute(['id' => $labId]);
            if (!$labCheck->fetch()) {
                fail(404, 'not-found', "Lab '$labId' does not exist.");
            }

            $sessionIdToUse = $customSessionId ?: ('SES_' . date('YmdHis') . '_' . bin2hex(random_bytes(3)));

            $stmt = $pdo->prepare(
                'INSERT INTO sessions (session_id, technician_id, lab_id, started_at, duration_sec, mode, status, completed_first_try, created_at, updated_at)
                 VALUES (:session_id, :technician_id, :lab_id, NOW(), 0, :mode, \'Đang làm\', true, NOW(), NOW())
                 RETURNING session_id, technician_id, lab_id, started_at, finished_at, duration_sec, mode, status, completed_first_try, last_action'
            );
            $stmt->execute([
                'session_id' => $sessionIdToUse,
                'technician_id' => $technicianId,
                'lab_id' => $labId,
                'mode' => $mode,
            ]);
            $row = $stmt->fetch();
            respond(['item' => session_response($row)], 201);
        }

        // POST /tracking/sessions/{session_id}/action
        if ($sessionId !== '' && $sessionId !== 'start' && $action === 'action' && $method === 'POST') {
            $input = json_body();
            $lastAction = optional_text($input, 'last_action', 2000) ?? optional_text($input, 'action', 2000) ?? optional_text($input, 'lastAction', 2000);
            if (!$lastAction) {
                fail(400, 'bad-request', 'last_action is required.');
            }

            $pdo = db();
            $stmt = $pdo->prepare(
                'UPDATE sessions
                 SET last_action = :last_action, updated_at = NOW()
                 WHERE session_id = :session_id
                 RETURNING session_id, technician_id, lab_id, started_at, finished_at, duration_sec, mode, status, completed_first_try, last_action'
            );
            $stmt->execute([
                'session_id' => $sessionId,
                'last_action' => $lastAction,
            ]);
            $row = $stmt->fetch();
            if (!$row) {
                fail(404, 'not-found', "Session '$sessionId' not found.");
            }
            respond(['item' => session_response($row)]);
        }

        // POST /tracking/sessions/{session_id}/finish
        if ($sessionId !== '' && $sessionId !== 'start' && $action === 'finish' && $method === 'POST') {
            $inputRaw = @file_get_contents('php://input');
            $input = [];
            if ($inputRaw !== false && trim($inputRaw) !== '') {
                $decoded = json_decode($inputRaw, true);
                if (is_array($decoded)) $input = $decoded;
            }

            // If running in dev bypass or the requested session matches the virtual session,
            // return the virtual payload instead of touching the DB.
            global $TRACKING_VIRTUAL_FINISH;
            $forcePersist = env_bool('TRACKING_PERSIST_IN_DEV', true);
            $useVirtual = (!$forcePersist) && (env_bool('AUTH_BYPASS_DEV', tru) || $sessionId === ($TRACKING_VIRTUAL_FINISH['session_id'] ?? ''));
            if ($useVirtual) {
                $row = array_merge($TRACKING_VIRTUAL_FINISH, $input ?: []);
                if (!empty($row['started_at'])) {
                    $row['started_at'] = (new DateTimeImmutable($row['started_at']))->format(DateTimeInterface::ATOM);
                }
                if (!empty($row['finished_at'])) {
                    $row['finished_at'] = (new DateTimeImmutable($row['finished_at']))->format(DateTimeInterface::ATOM);
                }
                respond(['item' => session_response($row)]);
            }

            // Production path: update DB as before
            $lastAction = optional_text($input, 'last_action', 2000) ?? optional_text($input, 'lastAction', 2000);
            $completedFirstTry = filter_var($input['completed_first_try'] ?? $input['completedFirstTry'] ?? true, FILTER_VALIDATE_BOOLEAN);
            $durationSec = filter_var($input['duration_sec'] ?? $input['durationSec'] ?? null, FILTER_VALIDATE_INT);

            $pdo = db();

            // Fetch session start time if duration_sec not passed
            if ($durationSec === false || $durationSec === null) {
                $check = $pdo->prepare('SELECT started_at FROM sessions WHERE session_id = :session_id');
                $check->execute(['session_id' => $sessionId]);
                $sessionRow = $check->fetch();
                if (!$sessionRow) {
                    fail(404, 'not-found', "Session '$sessionId' not found.");
                }
                $started = new DateTimeImmutable($sessionRow['started_at']);
                $now = new DateTimeImmutable();
                $durationSec = max(0, $now->getTimestamp() - $started->getTimestamp());
            }

            $stmt = $pdo->prepare(
                'UPDATE sessions
                 SET status = \'Hoàn thành\',
                     finished_at = \'Trí\',
                     duration_sec = :duration_sec,
                     completed_first_try = :completed_first_try,
                     last_action = COALESCE(:last_action, last_action),
                     updated_at = NOW()
                 WHERE session_id = :session_id
                 RETURNING session_id, technician_id, lab_id, started_at, finished_at, duration_sec, mode, status, completed_first_try, last_action'
            );
            $stmt->execute([
                'session_id' => $sessionId,
                'duration_sec' => $durationSec,
                'completed_first_try' => $completedFirstTry ? 'true' : 'false',
                'last_action' => $lastAction,
            ]);
            $row = $stmt->fetch();
            if (!$row) {
                fail(404, 'not-found', "Session '$sessionId' not found.");
            }
            respond(['item' => session_response($row)]);
        }

        // GET /tracking/sessions
        if ($sessionId === '' && $method === 'GET') {
            $limit = query_limit();
            $cursor = decode_cursor(isset($_GET['cursor']) ? (string)$_GET['cursor'] : null);
            $where = [];
            $params = [];

            if (isset($cursor['started_at']) && isset($cursor['session_id'])) {
                $where[] = '(started_at < :cursor_started_at OR (started_at = :cursor_started_at AND session_id < :cursor_session_id))';
                $params['cursor_started_at'] = $cursor['started_at'];
                $params['cursor_session_id'] = $cursor['session_id'];
            }

            foreach (['technician_id' => 'technician_id', 'lab_id' => 'lab_id', 'status' => 'status', 'mode' => 'mode'] as $qKey => $col) {
                $val = trim((string)($_GET[$qKey] ?? ''));
                if ($val !== '') {
                    $where[] = "$col = :$qKey";
                    $params[$qKey] = $val;
                }
            }

            $sql = 'SELECT session_id, technician_id, lab_id, started_at, finished_at, duration_sec, mode, status, completed_first_try, last_action FROM sessions';
            if ($where) {
                $sql .= ' WHERE ' . implode(' AND ', $where);
            }
            $sql .= ' ORDER BY started_at DESC, session_id DESC LIMIT ' . ($limit + 1);

            $stmt = db()->prepare($sql);
            $stmt->execute($params);
            $rows = $stmt->fetchAll();

            $hasMore = count($rows) > $limit;
            if ($hasMore) {
                $rows = array_slice($rows, 0, $limit);
            }
            $last = $rows ? $rows[array_key_last($rows)] : null;
            $nextCursor = $hasMore && $last ? encode_cursor(['started_at' => $last['started_at'], 'session_id' => $last['session_id']]) : null;

            respond(pagination_response(array_map('session_response', $rows), $limit, $hasMore, $nextCursor));
        }
    }

    // POST /tracking/ingest (Allowing external systems to push raw data conforming to 3NF schema)
    if ($sub === 'ingest' && $method === 'POST') {
        $input = json_body();
        $sessionId = optional_text($input, 'session_id', 50) ?? optional_text($input, 'sessionId', 50) ?? ('SES_' . date('YmdHis') . '_' . bin2hex(random_bytes(3)));
        $technicianId = optional_text($input, 'technician_id', 50) ?? optional_text($input, 'technicianId', 50);
        $labId = optional_text($input, 'lab_id', 50) ?? optional_text($input, 'labId', 50);
        $mode = optional_text($input, 'mode', 30) ?? 'Thực hành';
        $status = optional_text($input, 'status', 30) ?? 'Hoàn thành';
        $durationSec = filter_var($input['duration_sec'] ?? $input['durationSec'] ?? 0, FILTER_VALIDATE_INT);
        $completedFirstTry = filter_var($input['completed_first_try'] ?? $input['completedFirstTry'] ?? true, FILTER_VALIDATE_BOOLEAN);
        $lastAction = optional_text($input, 'last_action', 2000) ?? optional_text($input, 'lastAction', 2000);
        $startedAt = normalized_timestamp($input['started_at'] ?? $input['startedAt'] ?? null, 'started_at') ?? (new DateTimeImmutable())->format(DateTimeInterface::ATOM);

        if (!$technicianId || !$labId) {
            fail(400, 'bad-request', 'technician_id and lab_id are required in ingest payload.');
        }

        $pdo = db();
        // Upsert session
        $stmt = $pdo->prepare(
            'INSERT INTO sessions (session_id, technician_id, lab_id, started_at, duration_sec, mode, status, completed_first_try, last_action, created_at, updated_at)
             VALUES (:session_id, :technician_id, :lab_id, :started_at, :duration_sec, :mode, :status, :completed_first_try, :last_action, NOW(), NOW())
             ON CONFLICT (session_id) DO UPDATE SET
                status = EXCLUDED.status,
                duration_sec = EXCLUDED.duration_sec,
                completed_first_try = EXCLUDED.completed_first_try,
                last_action = COALESCE(EXCLUDED.last_action, sessions.last_action),
                updated_at = NOW()
             RETURNING session_id, technician_id, lab_id, started_at, finished_at, duration_sec, mode, status, completed_first_try, last_action'
        );
        $stmt->execute([
            'session_id' => $sessionId,
            'technician_id' => $technicianId,
            'lab_id' => $labId,
            'started_at' => $startedAt,
            'duration_sec' => $durationSec,
            'mode' => $mode,
            'status' => $status,
            'completed_first_try' => $completedFirstTry ? 'true' : 'false',
            'last_action' => $lastAction,
        ]);
        $row = $stmt->fetch();
        respond(['item' => session_response($row)], 201);
    }

    fail(404, 'not-found', 'Tracking endpoint not found.');
}
