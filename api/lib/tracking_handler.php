<?php
declare(strict_types=1);

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

function tracking_timer_response(array $timer): array
{
    return [
        'session_id' => (string)($timer['session_id'] ?? ''),
        'technician_id' => (string)($timer['technician_id'] ?? ''),
        'name' => (string)($timer['name'] ?? ''),
        'email' => (string)($timer['email'] ?? ''),
        'finished_at' => $timer['finished_at'] ? (new DateTimeImmutable($timer['finished_at']))->format(DateTimeInterface::ATOM) : null,
        'duration_sec' => (int)($timer['duration_sec'] ?? 0),
        'mode' => (string)($timer['mode'] ?? 'Thực hành'),
        'device' => (string)($timer['device'] ?? ''),
        'device_model' => (string)($timer['device_model'] ?? ($timer['device'] ?? '')),
        'lab_id' => (string)($timer['lab_id'] ?? ''),
        'lab_name' => (string)($timer['lab_name'] ?? ($timer['lab_id'] ?? '')),
        'status' => (string)($timer['status'] ?? 'completed'),
        'completed_first_try' => $timer['completed_first_try'] ?? null,
        'is_passed' => isset($timer['is_passed']) ? (bool)$timer['is_passed'] : null,
        'score' => isset($timer['score']) ? (float)$timer['score'] : null,
        'grading_details' => $timer['grading_details'] ?? null,
        'saved' => (bool)($timer['saved'] ?? false),
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

    verify_tracking_api_key();

    // POST /tracking/timer
    if ($sub === 'timer' && $method === 'POST') {
        $input = json_body();

        $technicianId = optional_text($input, 'technician_id', 50) ?? optional_text($input, 'technicianId', 50);
        $email = optional_text($input, 'email', 100) ?? optional_text($input, 'mail', 100);
        $name = optional_text($input, 'name', 100) ?? optional_text($input, 'full_name', 100) ?? optional_text($input, 'fullName', 100);
        $labId = optional_text($input, 'lab_id', 50) ?? optional_text($input, 'labId', 50) ?? optional_text($input, 'lab', 50);
        $mode = optional_text($input, 'mode', 30) ?? 'Thực hành';
        $device = optional_text($input, 'device', 100) ?? optional_text($input, 'device_model', 100) ?? optional_text($input, 'deviceModel', 100);
        $status = optional_text($input, 'status', 30) ?? 'completed';

        if (!in_array($mode, ['Thực hành', 'Hướng dẫn'], true)) {
            fail(400, 'bad-request', "mode must be 'Thực hành' or 'Hướng dẫn'.");
        }
        if (!in_array($status, ['completed', 'failed', 'abandoned'], true)) {
            fail(400, 'bad-request', "status must be 'completed', 'failed' or 'abandoned'.");
        }

        $completedFirstTry = null;
        $firstTryKey = array_key_exists('completed_first_try', $input)
            ? 'completed_first_try'
            : (array_key_exists('completedFirstTry', $input) ? 'completedFirstTry' : null);
        if ($firstTryKey !== null && $input[$firstTryKey] !== null && $input[$firstTryKey] !== '') {
            if (!is_bool($input[$firstTryKey])) {
                fail(400, 'bad-request', 'completed_first_try must be a JSON boolean.');
            }
            $completedFirstTry = $input[$firstTryKey];
        }
        if ($status !== 'completed' && $completedFirstTry !== null) {
            fail(400, 'bad-request', 'completed_first_try is only valid for completed sessions.');
        }
        if ($mode === 'Hướng dẫn') {
            $completedFirstTry = null;
        }

        $durationSec = $input['duration_sec'] ?? $input['durationSec'] ?? $input['duration'] ?? null;
        if ($durationSec !== null) {
            $durationSec = filter_var($durationSec, FILTER_VALIDATE_INT);
            if ($durationSec === false || $durationSec < 0) {
                fail(400, 'bad-request', 'duration_sec must be a non-negative integer.');
            }
        }

        // Chấm điểm (Grading fields)
        $isPassed = null;
        if (isset($input['is_passed'])) {
            $isPassed = filter_var($input['is_passed'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        } elseif (isset($input['passed'])) {
            $isPassed = filter_var($input['passed'], FILTER_VALIDATE_BOOLEAN, FILTER_NULL_ON_FAILURE);
        }

        $score = null;
        if (isset($input['score'])) {
            $scoreVal = filter_var($input['score'], FILTER_VALIDATE_FLOAT);
            if ($scoreVal !== false) {
                $score = max(0.0, min(100.0, (float)$scoreVal));
            }
        }

        $gradingDetails = $input['grading_details'] ?? $input['details'] ?? null;
        $gradingDetailsJson = is_array($gradingDetails) ? json_encode($gradingDetails, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : null;

        $finishedAt = normalized_timestamp(
            $input['finished_at'] ?? $input['finishedAt'] ?? $input['end_time'] ?? null,
            'finished_at'
        ) ?? (new DateTimeImmutable())->format(DateTimeInterface::ATOM);
        $startedAt = normalized_timestamp($input['started_at'] ?? $input['startedAt'] ?? null, 'started_at');

        $timer = [
            'session_id' => 'TMR_' . date('YmdHis') . '_' . bin2hex(random_bytes(3)),
            'technician_id' => $technicianId ?? '',
            'name' => $name ?? '',
            'email' => $email ?? '',
            'finished_at' => $finishedAt,
            'duration_sec' => $durationSec ?? 0,
            'mode' => $mode,
            'device' => $device ?? '',
            'device_model' => $device ?? '',
            'lab_id' => $labId ?? '',
            'lab_name' => $labId ?? '',
            'status' => $status,
            'completed_first_try' => $completedFirstTry,
            'is_passed' => $isPassed,
            'score' => $score,
            'grading_details' => $gradingDetails,
            'saved' => false,
        ];

        // Rule tinh thoi gian: neu khong gui duration_sec thi tinh = finished_at - started_at
        if ($timer['duration_sec'] === 0 && $startedAt) {
            $timer['duration_sec'] = max(0, (new DateTimeImmutable($finishedAt))->getTimestamp() - (new DateTimeImmutable($startedAt))->getTimestamp());
        }

        $pdo = db();
        $resolvedUserId = null;
        if ($timer['technician_id'] !== '' || $timer['email'] !== '') {
            $resolve = $pdo->prepare(
                <<<'SQL'
                WITH input AS (
                    SELECT NULLIF(:technician_id, '')::text AS technician_id,
                           NULLIF(:email, '')::text AS email
                )
                SELECT roster.user_id,
                       roster.employee_id,
                       roster.email,
                       roster.display_name,
                       input.technician_id IS NOT NULL
                           AND roster.employee_id = input.technician_id AS employee_match,
                       input.email IS NOT NULL
                           AND LOWER(roster.email) = LOWER(input.email) AS email_match
                  FROM users roster
                  CROSS JOIN input
                 WHERE roster.employee_id = input.technician_id
                    OR LOWER(roster.email) = LOWER(input.email)
                SQL
            );
            $resolve->execute([
                'technician_id' => $timer['technician_id'],
                'email' => $timer['email'],
            ]);
            $resolvedRows = $resolve->fetchAll();
            $employeeUserIds = [];
            $emailUserIds = [];
            $usersById = [];
            foreach ($resolvedRows as $resolvedRow) {
                $candidateId = (string)$resolvedRow['user_id'];
                $usersById[$candidateId] = $resolvedRow;
                if (database_boolean($resolvedRow['employee_match'] ?? false)) {
                    $employeeUserIds[$candidateId] = true;
                }
                if (database_boolean($resolvedRow['email_match'] ?? false)) {
                    $emailUserIds[$candidateId] = true;
                }
            }
            if (count($employeeUserIds) > 1 || count($emailUserIds) > 1) {
                fail(409, 'tracking/identity-ambiguous', 'The supplied tracking identity matches multiple users.');
            }
            $employeeUserId = array_key_first($employeeUserIds);
            $emailUserId = array_key_first($emailUserIds);
            if ($employeeUserId && $emailUserId && $employeeUserId !== $emailUserId) {
                fail(409, 'tracking/identity-conflict', 'technician_id and email belong to different users.');
            }
            $resolvedUserId = $employeeUserId ?: $emailUserId;
            if ($resolvedUserId && isset($usersById[$resolvedUserId])) {
                $canonicalUser = $usersById[$resolvedUserId];
                $timer['technician_id'] = (string)($canonicalUser['employee_id'] ?: $timer['technician_id']);
                $timer['email'] = (string)($canonicalUser['email'] ?: $timer['email']);
                $timer['name'] = (string)($canonicalUser['display_name'] ?: $timer['name']);
            }
        }

        try {
            $insert = $pdo->prepare(
                <<<'SQL'
                INSERT INTO timer_sessions (user_id, technician_id, name, email, started_at, finished_at, duration_sec, mode, device, lab_id, lab_name, status, completed_first_try, last_action, is_passed, score, grading_details)
                VALUES (:user_id, :technician_id, :name, :email, :started_at, :finished_at, :duration_sec, :mode, :device, :lab_id, :lab_name, :status, :completed_first_try, :last_action, :is_passed, :score, :grading_details)
                RETURNING id
                SQL
            );
            $insert->execute([
                'user_id' => $resolvedUserId,
                'technician_id' => $timer['technician_id'],
                'name' => $timer['name'],
                'email' => $timer['email'],
                'started_at' => $startedAt,
                'finished_at' => $finishedAt,
                'duration_sec' => $timer['duration_sec'],
                'mode' => $mode,
                'device' => $timer['device'],
                'lab_id' => $timer['lab_id'],
                'lab_name' => $timer['lab_name'],
                'status' => $timer['status'],
                'completed_first_try' => $timer['completed_first_try'],
                'last_action' => $timer['status'] === 'completed'
                    ? 'Save & Apply cấu hình cuối'
                    : ($timer['status'] === 'failed' ? 'Nộp cấu hình nhưng chưa đạt yêu cầu' : 'Rời phiên trước khi hoàn thành'),
                'is_passed' => $timer['is_passed'] !== null ? ($timer['is_passed'] ? 1 : 0) : null,
                'score' => $timer['score'],
                'grading_details' => $gradingDetailsJson,
            ]);
            $savedRow = $insert->fetch();
            $timer['session_id'] = $savedRow ? (string)$savedRow['id'] : $timer['session_id'];
            $timer['saved'] = true;
        } catch (Throwable $exception) {
            report_exception($exception, 'tracking-timer-save');
            fail(500, 'tracking/save-failed', 'Unable to save the timer session.');
        }

        respond(['item' => tracking_timer_response($timer)]);
    }

    fail(404, 'not-found', 'Tracking endpoint not found.');
}
