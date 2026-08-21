<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This command can only be run from the CLI.\n");
    exit(1);
}

$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';

load_app_environment($root);
date_default_timezone_set(normalize_app_timezone(env_value('APP_TIMEZONE')));

function cleanup_usage(): void
{
    echo <<<TEXT
Usage:
  php api/cleanup_dashboard_mock.php [--execute]

Options:
  --execute  Delete all rows explicitly marked as mock and mock-only roster users.
             Without this option the command only prints a dry-run inventory.
  --help     Show this help.

The cleanup preserves catalogs, regions, curricula, administrators and any user
that has a real login, a non-mock session or a non-mock class enrollment.
TEXT;
}

/** @return int */
function cleanup_scalar(PDO $pdo, string $sql): int
{
    return (int)$pdo->query($sql)->fetchColumn();
}

/** @return array<string, int> */
function cleanup_inventory(PDO $pdo): array
{
    return [
        'users_total' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM users'),
        'dashboard_roster_users' => cleanup_scalar(
            $pdo,
            "SELECT COUNT(*)
               FROM users
              WHERE employee_id IS NOT NULL
                AND (job_title = 'CB Kỹ thuật TKBT' OR employee_source IS NOT NULL)"
        ),
        'timer_sessions_total' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM timer_sessions'),
        'timer_sessions_mock' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM timer_sessions WHERE is_mock = TRUE'),
        'training_classes_total' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM training_classes'),
        'training_classes_mock' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM training_classes WHERE is_mock = TRUE'),
        'class_enrollments_total' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM class_enrollments'),
        'class_enrollments_mock' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM class_enrollments WHERE is_mock = TRUE'),
        'lab_assignments_total' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM lab_assignments'),
        'lab_attempts_total' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM lab_attempts'),
        'device_catalog' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM device_catalog'),
        'lab_catalog' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM lab_catalog'),
        'regions' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM regions'),
        'curricula' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM curricula'),
    ];
}

/** @param array<string, int> $inventory */
function cleanup_print_inventory(string $title, array $inventory): void
{
    echo $title . PHP_EOL;
    foreach ($inventory as $key => $value) {
        echo '  ' . $key . '=' . $value . PHP_EOL;
    }
}

/** @return array<string, int> */
function cleanup_selection(PDO $pdo): array
{
    return [
        'mock_batches' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM cleanup_mock_batches'),
        'timer_sessions' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM cleanup_mock_sessions'),
        'class_enrollments' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM cleanup_mock_enrollments'),
        'training_classes' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM cleanup_mock_classes'),
        'lab_assignments' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM cleanup_mock_assignments'),
        'lab_attempts' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM cleanup_mock_attempts'),
        'roster_user_candidates' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM cleanup_mock_user_candidates'),
        'roster_users_deletable' => cleanup_scalar($pdo, 'SELECT COUNT(*) FROM cleanup_mock_users_deletable'),
        'roster_users_preserved' => cleanup_scalar(
            $pdo,
            'SELECT COUNT(*)
               FROM cleanup_mock_user_candidates candidate
              WHERE NOT EXISTS (
                    SELECT 1
                      FROM cleanup_mock_users_deletable deletable
                     WHERE deletable.user_id = candidate.user_id
              )'
        ),
    ];
}

function cleanup_prepare_selection(PDO $pdo): void
{
    $pdo->exec(
        <<<'SQL'
        CREATE TEMP TABLE cleanup_mock_batches (
            batch_key TEXT PRIMARY KEY
        ) ON COMMIT DROP
        SQL
    );
    $pdo->exec(
        <<<'SQL'
        INSERT INTO cleanup_mock_batches (batch_key)
        SELECT DISTINCT batch_key
          FROM (
                SELECT NULLIF(BTRIM(seed_batch), '') AS batch_key
                  FROM timer_sessions
                 WHERE is_mock = TRUE
                UNION
                SELECT NULLIF(BTRIM(seed_batch), '') AS batch_key
                  FROM class_enrollments
                 WHERE is_mock = TRUE
                UNION
                SELECT NULLIF(BTRIM(seed_batch), '') AS batch_key
                  FROM training_classes
                 WHERE is_mock = TRUE
          ) batches
         WHERE batch_key IS NOT NULL
        SQL
    );

    $pdo->exec(
        <<<'SQL'
        CREATE TEMP TABLE cleanup_mock_sessions ON COMMIT DROP AS
        SELECT id
          FROM timer_sessions
         WHERE is_mock = TRUE
        SQL
    );
    $pdo->exec('CREATE UNIQUE INDEX ON cleanup_mock_sessions (id)');

    $pdo->exec(
        <<<'SQL'
        CREATE TEMP TABLE cleanup_mock_classes ON COMMIT DROP AS
        SELECT class_id
          FROM training_classes
         WHERE is_mock = TRUE
        SQL
    );
    $pdo->exec('CREATE UNIQUE INDEX ON cleanup_mock_classes (class_id)');

    $pdo->exec(
        <<<'SQL'
        CREATE TEMP TABLE cleanup_mock_enrollments ON COMMIT DROP AS
        SELECT DISTINCT enrollment.enrollment_id
          FROM class_enrollments enrollment
          LEFT JOIN cleanup_mock_classes training
            ON training.class_id = enrollment.class_id
         WHERE enrollment.is_mock = TRUE
            OR training.class_id IS NOT NULL
        SQL
    );
    $pdo->exec('CREATE UNIQUE INDEX ON cleanup_mock_enrollments (enrollment_id)');

    $pdo->exec(
        <<<'SQL'
        CREATE TEMP TABLE cleanup_mock_assignments ON COMMIT DROP AS
        SELECT DISTINCT assignment.assignment_id
          FROM lab_assignments assignment
          LEFT JOIN cleanup_mock_enrollments enrollment
            ON enrollment.enrollment_id = assignment.enrollment_id
          LEFT JOIN cleanup_mock_classes training
            ON training.class_id = assignment.class_id_snapshot
         WHERE enrollment.enrollment_id IS NOT NULL
            OR training.class_id IS NOT NULL
        SQL
    );
    $pdo->exec('CREATE UNIQUE INDEX ON cleanup_mock_assignments (assignment_id)');

    $pdo->exec(
        <<<'SQL'
        CREATE TEMP TABLE cleanup_mock_attempts ON COMMIT DROP AS
        SELECT attempt.attempt_id
          FROM lab_attempts attempt
          JOIN cleanup_mock_assignments assignment
            ON assignment.assignment_id = attempt.assignment_id
        SQL
    );
    $pdo->exec('CREATE UNIQUE INDEX ON cleanup_mock_attempts (attempt_id)');

    $pdo->exec(
        <<<'SQL'
        CREATE TEMP TABLE cleanup_mock_user_candidates ON COMMIT DROP AS
        SELECT roster.user_id
          FROM users roster
          JOIN cleanup_mock_batches batch
            ON batch.batch_key = NULLIF(BTRIM(roster.employee_seed_batch), '')
        UNION
        SELECT enrollment.user_id
          FROM class_enrollments enrollment
          JOIN cleanup_mock_enrollments mock_enrollment
            ON mock_enrollment.enrollment_id = enrollment.enrollment_id
        UNION
        SELECT timer.user_id
          FROM timer_sessions timer
          JOIN cleanup_mock_sessions mock_session
            ON mock_session.id = timer.id
         WHERE timer.user_id IS NOT NULL
        SQL
    );
    $pdo->exec('CREATE UNIQUE INDEX ON cleanup_mock_user_candidates (user_id)');

    $pdo->exec(
        <<<'SQL'
        CREATE TEMP TABLE cleanup_mock_users_deletable ON COMMIT DROP AS
        SELECT candidate.user_id
          FROM cleanup_mock_user_candidates candidate
         JOIN users roster ON roster.user_id = candidate.user_id
         WHERE roster.role <> 'admin'
           AND roster.last_login_at IS NULL
           AND NOT EXISTS (
                SELECT 1
                  FROM timer_sessions timer
                 WHERE timer.user_id = candidate.user_id
                   AND timer.is_mock = FALSE
           )
           AND NOT EXISTS (
                SELECT 1
                  FROM class_enrollments enrollment
                 WHERE enrollment.user_id = candidate.user_id
                   AND NOT EXISTS (
                        SELECT 1
                          FROM cleanup_mock_enrollments mock_enrollment
                         WHERE mock_enrollment.enrollment_id = enrollment.enrollment_id
                   )
           )
        SQL
    );
    $pdo->exec('CREATE UNIQUE INDEX ON cleanup_mock_users_deletable (user_id)');
}

/** @return array<string, int> */
function cleanup_execute(PDO $pdo): array
{
    $deleted = [];

    $deleted['lab_attempts'] = $pdo->exec(
        'DELETE FROM lab_attempts attempt
          USING cleanup_mock_attempts mock
          WHERE mock.attempt_id = attempt.attempt_id'
    );
    $deleted['lab_assignments'] = $pdo->exec(
        'DELETE FROM lab_assignments assignment
          USING cleanup_mock_assignments mock
          WHERE mock.assignment_id = assignment.assignment_id'
    );
    $deleted['class_enrollments'] = $pdo->exec(
        'DELETE FROM class_enrollments enrollment
          USING cleanup_mock_enrollments mock
          WHERE mock.enrollment_id = enrollment.enrollment_id'
    );
    $deleted['training_classes'] = $pdo->exec(
        'DELETE FROM training_classes training
          USING cleanup_mock_classes mock
          WHERE mock.class_id = training.class_id'
    );
    $deleted['timer_sessions'] = $pdo->exec(
        'DELETE FROM timer_sessions timer
          USING cleanup_mock_sessions mock
          WHERE mock.id = timer.id'
    );

    $deleted['roster_users'] = $pdo->exec(
        'DELETE FROM users roster
          USING cleanup_mock_users_deletable mock
          WHERE mock.user_id = roster.user_id'
    );
    $deleted['preserved_user_batch_tags_cleared'] = $pdo->exec(
        <<<'SQL'
        UPDATE users roster
           SET employee_seed_batch = NULL,
               updated_at = NOW()
          FROM cleanup_mock_user_candidates candidate
         WHERE candidate.user_id = roster.user_id
           AND roster.employee_seed_batch IS NOT NULL
        SQL
    );

    return array_map('intval', $deleted);
}

$options = getopt('', ['execute', 'help']);
if (isset($options['help'])) {
    cleanup_usage();
    exit(0);
}
$execute = isset($options['execute']);

$pdo = create_database_connection();
$pdo->beginTransaction();
try {
    $pdo->query("SELECT pg_advisory_xact_lock(hashtext('ftc_dashboard_mock_cleanup'))");
    cleanup_prepare_selection($pdo);

    cleanup_print_inventory('Before cleanup:', cleanup_inventory($pdo));
    cleanup_print_inventory('Selected mock data:', cleanup_selection($pdo));

    $batches = $pdo->query(
        'SELECT batch_key FROM cleanup_mock_batches ORDER BY batch_key'
    )->fetchAll(PDO::FETCH_COLUMN);
    echo '  batch_keys=' . (
        $batches
            ? implode(',', array_map('strval', $batches))
            : '(none)'
    ) . PHP_EOL;

    if (!$execute) {
        $pdo->rollBack();
        echo "Dry run complete; the database was not changed.\n";
        exit(0);
    }

    $deleted = cleanup_execute($pdo);
    cleanup_print_inventory('Deleted or updated:', $deleted);

    $remainingMockRows = cleanup_scalar(
        $pdo,
        'SELECT
             (SELECT COUNT(*) FROM timer_sessions WHERE is_mock = TRUE)
           + (SELECT COUNT(*) FROM class_enrollments WHERE is_mock = TRUE)
           + (SELECT COUNT(*) FROM training_classes WHERE is_mock = TRUE)'
    );
    if ($remainingMockRows !== 0) {
        throw new RuntimeException("Cleanup verification failed: $remainingMockRows explicitly marked mock rows remain.");
    }

    cleanup_print_inventory('After cleanup:', cleanup_inventory($pdo));
    $pdo->commit();
    echo "Cleanup committed successfully.\n";
} catch (Throwable $exception) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    fwrite(STDERR, 'Cleanup rolled back: ' . $exception->getMessage() . PHP_EOL);
    exit(1);
}
