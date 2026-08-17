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

        if (!in_array($mode, ['Thực hành', 'Hướng dẫn'], true)) {
            fail(400, 'bad-request', "mode must be 'Thực hành' or 'Hướng dẫn'.");
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
            'is_passed' => $isPassed,
            'score' => $score,
            'grading_details' => $gradingDetails,
            'saved' => false,
        ];

        // Rule tinh thoi gian: neu khong gui duration_sec thi tinh = finished_at - started_at
        if ($timer['duration_sec'] === 0 && $startedAt) {
            $timer['duration_sec'] = max(0, (new DateTimeImmutable($finishedAt))->getTimestamp() - (new DateTimeImmutable($startedAt))->getTimestamp());
        }

        try {
            $pdo = create_database_connection();
            $insert = $pdo->prepare(
                'INSERT INTO timer_sessions (technician_id, name, email, started_at, finished_at, duration_sec, mode, device, lab_id, lab_name, is_passed, score, grading_details)
                 VALUES (:technician_id, :name, :email, :started_at, :finished_at, :duration_sec, :mode, :device, :lab_id, :lab_name, :is_passed, :score, :grading_details)
                 RETURNING id'
            );
            $insert->execute([
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
                'is_passed' => $timer['is_passed'] !== null ? ($timer['is_passed'] ? 1 : 0) : null,
                'score' => $timer['score'],
                'grading_details' => $gradingDetailsJson,
            ]);
            $savedRow = $insert->fetch();
            $timer['session_id'] = $savedRow ? (string)$savedRow['id'] : $timer['session_id'];
            $timer['saved'] = true;
        } catch (Throwable) {
            // Fallback neu bang chua co cot moi hoac DB offline trong dev
            try {
                if (isset($pdo) && $pdo instanceof PDO) {
                    $insertFallback = $pdo->prepare(
                        'INSERT INTO timer_sessions (technician_id, name, email, started_at, finished_at, duration_sec, mode, device, lab_id, lab_name)
                         VALUES (:technician_id, :name, :email, :started_at, :finished_at, :duration_sec, :mode, :device, :lab_id, :lab_name)
                         RETURNING id'
                    );
                    $insertFallback->execute([
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
                    ]);
                    $savedRow = $insertFallback->fetch();
                    $timer['session_id'] = $savedRow ? (string)$savedRow['id'] : $timer['session_id'];
                    $timer['saved'] = true;
                } else {
                    $timer['saved'] = false;
                }
            } catch (Throwable) {
                $timer['saved'] = false;
            }
        }

        respond(['item' => tracking_timer_response($timer)]);
    }

    fail(404, 'not-found', 'Tracking endpoint not found.');
}
