<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This command can only be run from the CLI.\n");
    exit(1);
}

$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
load_app_environment($root);

$options = getopt('', ['batch::', 'expected-users::', 'help']);
if (isset($options['help'])) {
    echo "Usage: php api/verify_dashboard_seed.php [--batch=dashboard-ktv-20260813] [--expected-users=200]\n";
    exit(0);
}

$batch = trim((string)($options['batch'] ?? 'dashboard-ktv-20260813'));
$expectedUsers = (int)($options['expected-users'] ?? 200);
if ($batch === '' || $expectedUsers < 1) {
    throw new InvalidArgumentException('batch and expected-users must be valid.');
}
if ($expectedUsers % 10 !== 0) {
    throw new InvalidArgumentException('expected-users must be divisible by the 10 dashboard regions.');
}
$employeesPerRegion = intdiv($expectedUsers, 10);
$classesPerRegion = (int)ceil($employeesPerRegion / 10);
$expectedClassCount = $classesPerRegion * 10;
$expectedClassMin = intdiv($employeesPerRegion, $classesPerRegion);
$expectedClassMax = (int)ceil($employeesPerRegion / $classesPerRegion);

$pdo = create_database_connection();
$migrationStatement = $pdo->prepare('SELECT checksum FROM schema_migrations WHERE version = :version');
$migrationChecksumMatches = true;
foreach (['012_employee_roster_dashboard', '013_training_classes_and_session_outcomes'] as $migrationVersion) {
    $migrationFile = __DIR__ . '/migrations/' . $migrationVersion . '.sql';
    $migrationSql = (string)file_get_contents($migrationFile);
    $migrationChecksum = hash('sha256', str_replace(["\r\n", "\r"], "\n", $migrationSql));
    $migrationStatement->execute(['version' => $migrationVersion]);
    $storedMigrationChecksum = (string)$migrationStatement->fetchColumn();
    $matches = $storedMigrationChecksum !== '' && hash_equals($migrationChecksum, $storedMigrationChecksum);
    $migrationChecksumMatches = $migrationChecksumMatches && $matches;
    echo "migration[$migrationVersion].checksum_local=$migrationChecksum" . PHP_EOL;
    echo "migration[$migrationVersion].checksum_db=$storedMigrationChecksum" . PHP_EOL;
    echo "migration[$migrationVersion].checksum_match=" . ($matches ? 'yes' : 'no') . PHP_EOL;
}
$scalar = static function (string $sql) use ($pdo, $batch): int {
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['batch' => $batch]);
    return (int)$stmt->fetchColumn();
};

$checks = [
    'users' => $scalar(
        'SELECT COUNT(DISTINCT timer.user_id)
           FROM timer_sessions timer
           JOIN users roster ON roster.user_id = timer.user_id
          WHERE timer.seed_batch = :batch AND timer.is_mock = TRUE'
    ),
    'tagged_users' => $scalar('SELECT COUNT(*) FROM users WHERE employee_seed_batch = :batch'),
    'sessions' => $scalar('SELECT COUNT(*) FROM timer_sessions WHERE seed_batch = :batch AND is_mock = TRUE'),
    'regions' => $scalar(
        'SELECT COUNT(DISTINCT roster.dashboard_region)
           FROM timer_sessions timer
           JOIN users roster ON roster.user_id = timer.user_id
          WHERE timer.seed_batch = :batch AND timer.is_mock = TRUE'
    ),
    'source_classes' => $scalar(
        'SELECT COUNT(DISTINCT roster.class_code)
           FROM timer_sessions timer
           JOIN users roster ON roster.user_id = timer.user_id
          WHERE timer.seed_batch = :batch AND timer.is_mock = TRUE'
    ),
    'unique_lower_emails' => $scalar(
        'SELECT COUNT(DISTINCT LOWER(roster.email))
           FROM timer_sessions timer
           JOIN users roster ON roster.user_id = timer.user_id
          WHERE timer.seed_batch = :batch AND timer.is_mock = TRUE'
    ),
    'orphan_users' => $scalar(
        'SELECT COUNT(*)
           FROM timer_sessions timer
           LEFT JOIN users roster ON roster.user_id = timer.user_id
          WHERE timer.seed_batch = :batch
            AND timer.is_mock = TRUE
            AND (timer.user_id IS NULL OR roster.user_id IS NULL)'
    ),
    'orphan_labs' => $scalar(
        'SELECT COUNT(*)
           FROM timer_sessions timer
           LEFT JOIN lab_catalog lab ON lab.lab_id = timer.lab_id
          WHERE timer.seed_batch = :batch
            AND timer.is_mock = TRUE
            AND lab.lab_id IS NULL'
    ),
    'duplicate_lab_users' => $scalar(
        'SELECT COUNT(*)
           FROM (
               SELECT user_id
                 FROM timer_sessions
                WHERE seed_batch = :batch AND is_mock = TRUE
                GROUP BY user_id
               HAVING COUNT(*) <> COUNT(DISTINCT lab_id)
           ) duplicated'
    ),
    'invalid_modes' => $scalar(
        "SELECT COUNT(*)
           FROM timer_sessions
          WHERE seed_batch = :batch
            AND is_mock = TRUE
            AND mode NOT IN ('Hướng dẫn', 'Thực hành')"
    ),
    'demo_classes' => $scalar(
        'SELECT COUNT(*)
           FROM training_classes
          WHERE seed_batch = :batch AND is_mock = TRUE'
    ),
    'active_class_enrollments' => $scalar(
        'SELECT COUNT(*)
           FROM class_enrollments
          WHERE seed_batch = :batch
            AND is_mock = TRUE
            AND status = \'active\'
            AND valid_to IS NULL'
    ),
    'invalid_first_try' => $scalar(
        'SELECT COUNT(*)
           FROM timer_sessions
          WHERE seed_batch = :batch
            AND is_mock = TRUE
            AND status <> \'completed\'
            AND completed_first_try IS NOT NULL'
    ),
    'practice_sessions' => $scalar(
        'SELECT COUNT(*) FROM timer_sessions
          WHERE seed_batch = :batch AND is_mock = TRUE AND mode = \'Thực hành\''
    ),
    'practice_completed' => $scalar(
        'SELECT COUNT(*) FROM timer_sessions
          WHERE seed_batch = :batch AND is_mock = TRUE
            AND mode = \'Thực hành\' AND status = \'completed\''
    ),
    'practice_first_try' => $scalar(
        'SELECT COUNT(*) FROM timer_sessions
          WHERE seed_batch = :batch AND is_mock = TRUE
            AND mode = \'Thực hành\' AND status = \'completed\'
            AND completed_first_try = TRUE'
    ),
    'intermediate_region_lab_cells' => $scalar(
        'SELECT COUNT(*)
           FROM (
               SELECT roster.dashboard_region, timer.lab_id
                 FROM timer_sessions timer
                 JOIN users roster ON roster.user_id = timer.user_id
                WHERE timer.seed_batch = :batch
                  AND timer.is_mock = TRUE
                  AND timer.mode = \'Thực hành\'
                GROUP BY roster.dashboard_region, timer.lab_id
               HAVING COUNT(*) FILTER (WHERE timer.status = \'completed\') > 0
                  AND COUNT(*) FILTER (WHERE timer.status = \'completed\') < COUNT(*)
           ) cells'
    ),
];

$rangeStatement = $pdo->prepare(
    'SELECT MIN(session_count) AS min_sessions,
            MAX(session_count) AS max_sessions,
            MIN(mode_count) AS min_modes,
            MAX(mode_count) AS max_modes
       FROM (
           SELECT user_id, COUNT(*) AS session_count, COUNT(DISTINCT mode) AS mode_count
             FROM timer_sessions
            WHERE seed_batch = :batch AND is_mock = TRUE
            GROUP BY user_id
       ) seeded'
);
$rangeStatement->execute(['batch' => $batch]);
$ranges = $rangeStatement->fetch() ?: [];

$classRangeStatement = $pdo->prepare(
    'SELECT MIN(employee_count) AS min_employees,
            MAX(employee_count) AS max_employees,
            SUM(employee_count) AS total_employees
       FROM (
           SELECT enrollment.class_id, COUNT(*) AS employee_count
             FROM class_enrollments enrollment
            WHERE enrollment.seed_batch = :batch
              AND enrollment.is_mock = TRUE
              AND enrollment.status = \'active\'
              AND enrollment.valid_to IS NULL
            GROUP BY enrollment.class_id
       ) classes'
);
$classRangeStatement->execute(['batch' => $batch]);
$classRanges = $classRangeStatement->fetch() ?: [];

$regionStatement = $pdo->prepare(
    'SELECT roster.dashboard_region, COUNT(DISTINCT roster.user_id) AS employee_count
       FROM timer_sessions timer
       JOIN users roster ON roster.user_id = timer.user_id
      WHERE timer.seed_batch = :batch AND timer.is_mock = TRUE
      GROUP BY roster.dashboard_region
      ORDER BY roster.dashboard_region'
);
$regionStatement->execute(['batch' => $batch]);
$regionRows = $regionStatement->fetchAll();

$modeStatement = $pdo->prepare(
    'SELECT mode, COUNT(*) AS session_count
       FROM timer_sessions
      WHERE seed_batch = :batch AND is_mock = TRUE
      GROUP BY mode
      ORDER BY mode'
);
$modeStatement->execute(['batch' => $batch]);
$modeRows = $modeStatement->fetchAll();

$monthlyStatement = $pdo->prepare(
    'SELECT TO_CHAR(COALESCE(finished_at, started_at), \'YYYY-MM\') AS month,
            COUNT(*) AS practice_sessions,
            COUNT(*) FILTER (WHERE status = \'completed\') AS completed,
            COUNT(*) FILTER (WHERE status = \'completed\' AND completed_first_try = TRUE) AS first_try
       FROM timer_sessions
      WHERE seed_batch = :batch
        AND is_mock = TRUE
        AND mode = \'Thực hành\'
      GROUP BY TO_CHAR(COALESCE(finished_at, started_at), \'YYYY-MM\')
      ORDER BY month'
);
$monthlyStatement->execute(['batch' => $batch]);
$monthlyRows = $monthlyStatement->fetchAll();

foreach ($checks as $name => $value) {
    echo "$name=$value" . PHP_EOL;
}
echo 'sessions_per_ktv=' . ($ranges['min_sessions'] ?? 0) . '-' . ($ranges['max_sessions'] ?? 0) . PHP_EOL;
echo 'modes_per_ktv=' . ($ranges['min_modes'] ?? 0) . '-' . ($ranges['max_modes'] ?? 0) . PHP_EOL;
echo 'ktv_per_demo_class=' . ($classRanges['min_employees'] ?? 0) . '-' . ($classRanges['max_employees'] ?? 0) . PHP_EOL;
foreach ($regionRows as $row) {
    echo 'region[' . $row['dashboard_region'] . ']=' . $row['employee_count'] . PHP_EOL;
}
foreach ($modeRows as $row) {
    echo 'mode[' . $row['mode'] . ']=' . $row['session_count'] . PHP_EOL;
}
foreach ($monthlyRows as $row) {
    $monthlyCompleted = (int)$row['completed'];
    $monthlySessions = (int)$row['practice_sessions'];
    $completionRate = $monthlySessions ? round($monthlyCompleted * 100 / $monthlySessions, 1) : 0;
    $firstTryRate = $monthlyCompleted ? round((int)$row['first_try'] * 100 / $monthlyCompleted, 1) : 0;
    echo 'month[' . $row['month'] . '].completion=' . $completionRate . '%' . PHP_EOL;
    echo 'month[' . $row['month'] . '].first_try=' . $firstTryRate . '%' . PHP_EOL;
}

$failures = [];
if (!$migrationChecksumMatches) $failures[] = 'migration checksums must match the applied database migrations';
if ($checks['users'] !== $expectedUsers) $failures[] = "users must equal $expectedUsers";
if ($checks['unique_lower_emails'] !== $expectedUsers) $failures[] = 'emails must be unique after lowercase normalization';
if ($checks['regions'] !== 10) $failures[] = 'the seed must cover all 10 dashboard regions';
if ($checks['orphan_users'] !== 0) $failures[] = 'sessions must reference users';
if ($checks['orphan_labs'] !== 0) $failures[] = 'sessions must reference catalog labs';
if ($checks['duplicate_lab_users'] !== 0) $failures[] = 'each KTV must receive distinct labs';
if ($checks['invalid_modes'] !== 0) $failures[] = 'sessions must use only Hướng dẫn and Thực hành modes';
if ($checks['demo_classes'] !== $expectedClassCount) $failures[] = "the test cohort must contain $expectedClassCount demo classes";
if ($checks['active_class_enrollments'] !== $expectedUsers) $failures[] = 'each KTV must have one active demo class enrollment';
if (
    (int)($classRanges['min_employees'] ?? 0) !== $expectedClassMin
    || (int)($classRanges['max_employees'] ?? 0) !== $expectedClassMax
) {
    $failures[] = "demo class size must be balanced in the $expectedClassMin-$expectedClassMax range";
}
if ($checks['invalid_first_try'] !== 0) $failures[] = 'only completed sessions may carry first-try evidence';
if ($checks['practice_sessions'] === 0 || $checks['practice_completed'] <= 0 || $checks['practice_completed'] >= $checks['practice_sessions']) {
    $failures[] = 'practice mock data must contain both completed and incomplete outcomes';
}
if ($checks['practice_first_try'] <= 0 || $checks['practice_first_try'] >= $checks['practice_completed']) {
    $failures[] = 'practice mock data must contain both first-try and retry completions';
}
if ($checks['intermediate_region_lab_cells'] <= 0) $failures[] = 'the region/lab seed must contain intermediate completion cells';
if ((int)($ranges['min_sessions'] ?? 0) < 10 || (int)($ranges['max_sessions'] ?? 0) > 20) {
    $failures[] = 'every KTV must have 10-20 sessions';
}
if ((int)($ranges['min_modes'] ?? 0) !== 2 || (int)($ranges['max_modes'] ?? 0) !== 2) {
    $failures[] = 'every KTV must have both modes';
}
if (count($regionRows) !== 10 || array_filter($regionRows, static fn(array $row): bool => (int)$row['employee_count'] !== intdiv($expectedUsers, 10))) {
    $failures[] = 'KTV must be distributed evenly across regions';
}

if ($failures) {
    foreach ($failures as $failure) {
        fwrite(STDERR, '[failed] ' . $failure . PHP_EOL);
    }
    exit(1);
}

echo "Verification passed.\n";
