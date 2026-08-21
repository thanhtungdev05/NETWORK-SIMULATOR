<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This command can only be run from the CLI.\n");
    exit(1);
}

$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
require_once __DIR__ . '/lib/dashboard_report.php';

load_app_environment($root);
date_default_timezone_set(normalize_app_timezone(env_value('APP_TIMEZONE')));

/** @return int */
function firestore_verify_scalar(PDO $pdo, string $sql, array $params): int
{
    $statement = $pdo->prepare($sql);
    $statement->execute($params);
    return (int)$statement->fetchColumn();
}

$options = getopt('', ['batch::', 'help']);
if (isset($options['help'])) {
    echo "Usage: php api/verify_firestore_import.php [--batch=firestore-PROJECT_ID]\n";
    exit(0);
}
$batch = trim((string)($options['batch'] ?? 'firestore-lab-monitor-pro-3e18b'));
if (!preg_match('/^[A-Za-z0-9._-]{1,100}$/D', $batch)) {
    fwrite(STDERR, "Invalid batch.\n");
    exit(1);
}

try {
    $pdo = create_database_connection();
    $params = ['batch' => $batch];
    $prefix = str_starts_with($batch, 'firestore-')
        ? substr($batch, strlen('firestore-'))
        : $batch;
    $attemptPrefix = 'firestore:' . $prefix . ':activity_logs:%';

    $checks = [
        'users' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM users WHERE employee_seed_batch = :batch',
            $params
        ),
        'classes' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM training_classes WHERE seed_batch = :batch AND is_mock = FALSE',
            $params
        ),
        'enrollments' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM class_enrollments WHERE seed_batch = :batch AND is_mock = FALSE',
            $params
        ),
        'assignments' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*)
               FROM lab_assignments assignment
               JOIN class_enrollments enrollment ON enrollment.enrollment_id = assignment.enrollment_id
              WHERE enrollment.seed_batch = :batch',
            $params
        ),
        'timer_sessions' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM timer_sessions WHERE seed_batch = :batch AND is_mock = FALSE',
            $params
        ),
        'distinct_timer_keys' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(DISTINCT seed_key) FROM timer_sessions WHERE seed_batch = :batch AND is_mock = FALSE',
            $params
        ),
        'linked_timer_sessions' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM timer_sessions WHERE seed_batch = :batch AND user_id IS NOT NULL',
            $params
        ),
        'lab_attempts' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM lab_attempts WHERE source_event_key LIKE :prefix',
            ['prefix' => $attemptPrefix]
        ),
        'distinct_attempt_keys' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(DISTINCT source_event_key) FROM lab_attempts WHERE source_event_key LIKE :prefix',
            ['prefix' => $attemptPrefix]
        ),
        'orphan_attempts' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*)
               FROM lab_attempts attempt
               LEFT JOIN lab_assignments assignment ON assignment.assignment_id = attempt.assignment_id
              WHERE attempt.source_event_key LIKE :prefix
                AND assignment.assignment_id IS NULL',
            ['prefix' => $attemptPrefix]
        ),
        'first_try_claimed' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*)
               FROM lab_attempts
              WHERE source_event_key LIKE :prefix
                AND sequence_complete = TRUE',
            ['prefix' => $attemptPrefix]
        ),
        'practice_attempts' => firestore_verify_scalar(
            $pdo,
            "SELECT COUNT(*) FROM lab_attempts WHERE source_event_key LIKE :prefix AND mode = 'practice'",
            ['prefix' => $attemptPrefix]
        ),
        'guide_attempts' => firestore_verify_scalar(
            $pdo,
            "SELECT COUNT(*) FROM lab_attempts WHERE source_event_key LIKE :prefix AND mode = 'guide'",
            ['prefix' => $attemptPrefix]
        ),
        'graded_attempts' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM lab_attempts WHERE source_event_key LIKE :prefix AND outcome IS NOT NULL',
            ['prefix' => $attemptPrefix]
        ),
        'zero_durations' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM timer_sessions WHERE seed_batch = :batch AND duration_sec = 0',
            $params
        ),
        'unknown_durations' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM timer_sessions WHERE seed_batch = :batch AND duration_sec IS NULL',
            $params
        ),
        'completed_assignments' => firestore_verify_scalar(
            $pdo,
            "SELECT COUNT(*)
               FROM lab_assignments assignment
               JOIN class_enrollments enrollment ON enrollment.enrollment_id = assignment.enrollment_id
              WHERE enrollment.seed_batch = :batch AND assignment.status = 'completed'",
            $params
        ),
        'passed_assignments' => firestore_verify_scalar(
            $pdo,
            "SELECT COUNT(*)
               FROM lab_assignments assignment
               JOIN class_enrollments enrollment ON enrollment.enrollment_id = assignment.enrollment_id
              WHERE enrollment.seed_batch = :batch AND assignment.status = 'passed'",
            $params
        ),
        'timer_mode_mismatches' => firestore_verify_scalar(
            $pdo,
            "SELECT COUNT(*) FROM timer_sessions
              WHERE seed_batch = :batch
                AND NOT (
                    (session_type = 'practice' AND mode = 'Thực hành')
                    OR (session_type = 'guide' AND mode = 'Hướng dẫn')
                )",
            $params
        ),
        'unvalidated_constraints' => firestore_verify_scalar(
            $pdo,
            "SELECT COUNT(*)
               FROM pg_constraint constraint_row
               JOIN pg_namespace namespace_row ON namespace_row.oid = constraint_row.connamespace
              WHERE namespace_row.nspname = 'public'
                AND constraint_row.convalidated = FALSE",
            []
        ),
        'missing_assignment_due_dates' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*)
               FROM lab_assignments assignment
               JOIN class_enrollments enrollment ON enrollment.enrollment_id = assignment.enrollment_id
              WHERE enrollment.seed_batch = :batch AND assignment.due_at IS NULL',
            $params
        ),
        'missing_assignment_regions' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*)
               FROM lab_assignments assignment
               JOIN class_enrollments enrollment ON enrollment.enrollment_id = assignment.enrollment_id
              WHERE enrollment.seed_batch = :batch AND assignment.region_id_snapshot IS NULL',
            $params
        ),
        'missing_class_capacities' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM training_classes WHERE seed_batch = :batch AND capacity IS NULL',
            $params
        ),
        'mock_timer_sessions' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM timer_sessions WHERE is_mock = TRUE',
            []
        ),
        'mock_classes' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM training_classes WHERE is_mock = TRUE',
            []
        ),
        'mock_enrollments' => firestore_verify_scalar(
            $pdo,
            'SELECT COUNT(*) FROM class_enrollments WHERE is_mock = TRUE',
            []
        ),
    ];
    foreach ($checks as $key => $value) echo "$key=$value" . PHP_EOL;

    $rangeStatement = $pdo->prepare(
        'SELECT MIN(started_at)::date AS min_date, MAX(finished_at)::date AS max_date
           FROM timer_sessions
          WHERE seed_batch = :batch'
    );
    $rangeStatement->execute($params);
    $range = $rangeStatement->fetch() ?: [];
    $minDate = (string)($range['min_date'] ?? '');
    $maxDate = (string)($range['max_date'] ?? '');
    echo 'min_date=' . $minDate . PHP_EOL;
    echo 'max_date=' . $maxDate . PHP_EOL;

    if ($minDate === '' || $maxDate === '') {
        throw new RuntimeException('Imported sessions do not have a valid date range.');
    }
    $reportStartedAt = microtime(true);
    $report = build_dashboard_report($pdo, [
        'from' => $minDate,
        'to' => $maxDate,
        'compare_from' => $minDate,
        'compare_to' => $maxDate,
        'cohort' => 'assigned_as_of_period_end',
        'year' => substr($maxDate, 0, 4),
    ]);
    $reportExecutionMs = (int)round((microtime(true) - $reportStartedAt) * 1000);
    $reportJson = json_encode($report, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    echo 'report.execution_ms=' . $reportExecutionMs . PHP_EOL;
    echo 'report.payload_bytes=' . strlen($reportJson) . PHP_EOL;
    echo 'report.matrix_devices=' . count($report['matrix']['device_groups'] ?? []) . PHP_EOL;
    echo 'report.matrix_labs=' . array_sum(array_map(
        static fn(array $group): int => count($group['labs'] ?? []),
        $report['matrix']['device_groups'] ?? []
    )) . PHP_EOL;
    $metric = $report['summary']['current'] ?? [];
    foreach ([
        'assigned_count',
        'assigned_technicians',
        'completed_count',
        'graded_count',
        'passed_count',
        'first_try_evaluable_count',
        'practice_attempts',
        'guide_attempts',
        'participating_technicians',
    ] as $key) {
        echo 'report.' . $key . '=' . (int)($metric[$key] ?? 0) . PHP_EOL;
    }

    $failures = [];
    if ($checks['users'] <= 0) $failures[] = 'no Firestore users were imported';
    if ($checks['classes'] <= 0) $failures[] = 'no classes were imported';
    if ($checks['assignments'] <= 0) $failures[] = 'no lab assignments were imported';
    if ($checks['timer_sessions'] <= 0) $failures[] = 'no timer sessions were imported';
    if ($checks['timer_sessions'] !== $checks['distinct_timer_keys']) $failures[] = 'timer seed keys are not unique';
    if ($checks['timer_sessions'] !== $checks['linked_timer_sessions']) $failures[] = 'some timer sessions are not linked to users';
    if ($checks['lab_attempts'] !== $checks['distinct_attempt_keys']) $failures[] = 'attempt source keys are not unique';
    if ($checks['orphan_attempts'] !== 0) $failures[] = 'orphan attempts exist';
    if ($checks['first_try_claimed'] !== 0) $failures[] = 'first-try success was inferred without evidence';
    if ($checks['practice_attempts'] <= 0) $failures[] = 'practice activity was not classified';
    if ($checks['guide_attempts'] <= 0) $failures[] = 'guided activity was not classified';
    if ($checks['graded_attempts'] !== 0) $failures[] = 'legacy completion was incorrectly treated as a grade';
    if ($checks['zero_durations'] !== 0) $failures[] = 'zero duration was not converted to unknown';
    if ($checks['unknown_durations'] <= 0) $failures[] = 'missing duration was not preserved';
    if ($checks['completed_assignments'] <= 0) $failures[] = 'ungraded completion status was not stored';
    if ($checks['passed_assignments'] !== 0) $failures[] = 'legacy activity promoted assignments to passed';
    if ($checks['timer_mode_mismatches'] !== 0) $failures[] = 'timer mode and session type disagree';
    if ($checks['unvalidated_constraints'] !== 0) $failures[] = 'database still has unvalidated constraints';
    if ($checks['mock_timer_sessions'] !== 0) $failures[] = 'mock timer sessions remain';
    if ($checks['mock_classes'] !== 0) $failures[] = 'mock training classes remain';
    if ($checks['mock_enrollments'] !== 0) $failures[] = 'mock enrollments remain';
    if ((int)($metric['assigned_technicians'] ?? 0) <= 0) $failures[] = 'report did not count email-only users';
    if ((int)($metric['practice_attempts'] ?? 0) <= 0) $failures[] = 'report did not include Firestore attempts';
    if ((int)($metric['guide_attempts'] ?? 0) <= 0) $failures[] = 'report did not expose guided activity';
    if ((int)($metric['completed_count'] ?? 0) <= 0) $failures[] = 'report did not count ungraded completions';
    if ((int)($metric['graded_count'] ?? 0) !== 0) $failures[] = 'report manufactured graded assignments';
    if ((int)($metric['passed_count'] ?? 0) !== 0) $failures[] = 'report manufactured passed assignments';
    if (($metric['pass_rate'] ?? null) !== null) $failures[] = 'pass rate should be unavailable without grades';

    if ($failures) {
        foreach ($failures as $failure) fwrite(STDERR, 'FAILED: ' . $failure . PHP_EOL);
        exit(1);
    }
    echo "Verification passed.\n";
} catch (Throwable $exception) {
    fwrite(STDERR, $exception->getMessage() . PHP_EOL);
    exit(1);
}
