<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This command can only be run from the CLI.\n");
    exit(1);
}

$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
require_once __DIR__ . '/lib/employee_workbook.php';

load_app_environment($root);
date_default_timezone_set(normalize_app_timezone(env_value('APP_TIMEZONE')));

function seed_usage(): void
{
    echo <<<TEXT
Usage:
  php api/seed_dashboard_ktv.php --file=/path/NhanVien.xlsx [options]

Options:
  --count=200                 Number of KTV (must be divisible by 10).
  --batch=dashboard-ktv-20260813
                              Stable batch name used for idempotency.
  --anchor-date=2026-08-13   Latest generated completion date.
  --dry-run                   Parse and plan without writing to DB.
  --replace-batch             Replace timer sessions in this exact batch.
  --help                      Show this help.

The command imports only active employees with job title "CB Kỹ thuật TKBT",
selects an equal number from each of the 10 dashboard regions, and generates
10-20 mixed Hướng dẫn/Thực hành sessions per KTV. It also creates balanced
demo classes of 10 KTV while preserving the workbook class as source metadata.
TEXT;
}

$options = getopt('', ['file:', 'count::', 'batch::', 'anchor-date::', 'dry-run', 'replace-batch', 'help']);
if (isset($options['help'])) {
    seed_usage();
    exit(0);
}

$file = isset($options['file']) ? (string)$options['file'] : '';
$count = isset($options['count']) ? (int)$options['count'] : 200;
$batch = trim((string)($options['batch'] ?? 'dashboard-ktv-20260813'));
$anchorText = trim((string)($options['anchor-date'] ?? date('Y-m-d')));
$dryRun = isset($options['dry-run']);
$replaceBatch = isset($options['replace-batch']);

if ($file === '' || $batch === '') {
    seed_usage();
    exit(1);
}
if (!preg_match('/^[A-Za-z0-9._-]{1,100}$/', $batch)) {
    throw new InvalidArgumentException('Batch may contain only letters, digits, dot, underscore and dash.');
}
$anchor = DateTimeImmutable::createFromFormat('!Y-m-d', $anchorText, new DateTimeZone(normalize_app_timezone(env_value('APP_TIMEZONE'))));
if (!$anchor || $anchor->format('Y-m-d') !== $anchorText) {
    throw new InvalidArgumentException('anchor-date must use YYYY-MM-DD.');
}
$anchor = $anchor->setTime(18, 0, 0);

$employees = read_employee_workbook($file);
$selected = select_employee_roster($employees, $count, $batch);
$classPlan = plan_employee_training_classes($selected, $batch, $anchor);
$regionCounts = array_count_values(array_column($selected, 'dashboard_region'));
$classCounts = array_count_values(array_column($classPlan['enrollments'], 'class_code'));
ksort($regionCounts);
ksort($classCounts);

echo 'Workbook rows: ' . count($employees) . PHP_EOL;
echo 'Selected KTV: ' . count($selected) . PHP_EOL;
echo 'Regions: ' . json_encode($regionCounts, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . PHP_EOL;
echo 'Demo classes: ' . count($classPlan['classes']) . ' (' . min($classCounts) . '-' . max($classCounts) . ' KTV/class)' . PHP_EOL;

if ($dryRun) {
    $previewLabs = [];
    for ($index = 1; $index <= 54; $index++) {
        $previewLabs[] = [
            'lab_id' => sprintf('PREVIEW_LAB_%02d', $index),
            'lab_name' => 'Preview lab ' . $index,
            'device_name' => 'Preview device ' . (1 + (($index - 1) % 7)),
        ];
    }
    $planned = plan_employee_lab_sessions($selected, $previewLabs, $batch, $anchor);
    $perEmployee = array_count_values(array_column($planned, 'employee_id'));
    $modes = array_count_values(array_column($planned, 'mode'));
    $statuses = array_count_values(array_column($planned, 'status'));
    echo 'Planned sessions: ' . count($planned) . PHP_EOL;
    echo 'Sessions/KTV: ' . min($perEmployee) . '-' . max($perEmployee) . PHP_EOL;
    echo 'Modes: ' . json_encode($modes, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    echo 'Statuses: ' . json_encode($statuses, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    echo "Dry run complete; the database was not changed.\n";
    exit(0);
}

$pdo = create_database_connection();
$migrationStatement = $pdo->prepare('SELECT checksum FROM schema_migrations WHERE version = :version');
foreach (['012_employee_roster_dashboard', '013_training_classes_and_session_outcomes'] as $migrationVersion) {
    $migrationFile = __DIR__ . '/migrations/' . $migrationVersion . '.sql';
    $migrationSql = (string)file_get_contents($migrationFile);
    $expectedMigrationChecksum = hash('sha256', str_replace(["\r\n", "\r"], "\n", $migrationSql));
    $migrationStatement->execute(['version' => $migrationVersion]);
    $storedMigrationChecksum = $migrationStatement->fetchColumn();
    if (!is_string($storedMigrationChecksum) || !hash_equals($expectedMigrationChecksum, $storedMigrationChecksum)) {
        throw new RuntimeException("Migration $migrationVersion.sql is missing or its checksum does not match.");
    }
}

$labs = $pdo->query(
    'SELECT l.lab_id, l.lab_name, d.device_name
       FROM lab_catalog l
       JOIN device_catalog d ON d.device_id = l.device_id
      ORDER BY l.lab_id'
)->fetchAll();
$planned = plan_employee_lab_sessions($selected, $labs, $batch, $anchor);

$pdo->beginTransaction();
try {
    $lock = $pdo->prepare("SELECT pg_advisory_xact_lock(hashtext(:lock_name))");
    $lock->execute(['lock_name' => 'ftc_dashboard_seed:' . $batch]);

    if ($replaceBatch) {
        $deleteEnrollments = $pdo->prepare(
            'DELETE FROM class_enrollments
              WHERE seed_batch = :batch
                AND is_mock = TRUE'
        );
        $deleteEnrollments->execute(['batch' => $batch]);
        $deleteClasses = $pdo->prepare(
            'DELETE FROM training_classes
              WHERE seed_batch = :batch
                AND is_mock = TRUE'
        );
        $deleteClasses->execute(['batch' => $batch]);
        $clearRoster = $pdo->prepare(
            'UPDATE users
                SET employee_seed_batch = NULL,
                    updated_at = NOW()
              WHERE employee_seed_batch = :batch'
        );
        $clearRoster->execute(['batch' => $batch]);
        $delete = $pdo->prepare('DELETE FROM timer_sessions WHERE seed_batch = :batch AND is_mock = TRUE');
        $delete->execute(['batch' => $batch]);
    }

    $find = $pdo->prepare(
        'SELECT user_id, email, employee_id, role
           FROM users
          WHERE employee_id = :employee_id OR LOWER(email) = :email
          FOR UPDATE'
    );
    $insertUser = $pdo->prepare(
        <<<'SQL'
        INSERT INTO users (
            email, display_name, role, iam_profile,
            employee_id, job_title, training_start_date, training_end_date,
            class_code, is_terminated, termination_date, termination_reason,
            unit_code, unit_name, region_code, branch_code, dashboard_region,
            employee_source, employee_seed_batch, employee_synced_at,
            created_at, updated_at
         ) VALUES (
            :email, :display_name, 'user', '{}'::jsonb,
            :employee_id, :job_title, :training_start_date, :training_end_date,
            :class_code, :is_terminated, :termination_date, :termination_reason,
            :unit_code, :unit_name, :region_code, :branch_code, :dashboard_region,
            :employee_source, :employee_seed_batch, NOW(), NOW(), NOW()
         ) RETURNING user_id
        SQL
    );
    $updateUser = $pdo->prepare(
        'UPDATE users
            SET email = :email,
                display_name = :display_name,
                employee_id = :employee_id,
                job_title = :job_title,
                training_start_date = :training_start_date,
                training_end_date = :training_end_date,
                class_code = :class_code,
                is_terminated = :is_terminated,
                termination_date = :termination_date,
                termination_reason = :termination_reason,
                unit_code = :unit_code,
                unit_name = :unit_name,
                region_code = :region_code,
                branch_code = :branch_code,
                dashboard_region = :dashboard_region,
                employee_source = :employee_source,
                employee_seed_batch = :employee_seed_batch,
                employee_synced_at = NOW(),
                updated_at = NOW()
          WHERE user_id = :user_id'
    );

    $userIds = [];
    foreach ($selected as $employee) {
        $find->execute(['employee_id' => $employee['employee_id'], 'email' => $employee['email']]);
        $matches = $find->fetchAll();
        $matchedUserIds = array_values(array_unique(array_column($matches, 'user_id')));
        if (count($matchedUserIds) > 1) {
            throw new RuntimeException("Employee {$employee['employee_id']} matches different DB users by ID and email.");
        }
        $parameters = [
            'email' => $employee['email'],
            'display_name' => $employee['display_name'],
            'employee_id' => $employee['employee_id'],
            'job_title' => $employee['job_title'],
            'training_start_date' => $employee['training_start_date'],
            'training_end_date' => $employee['training_end_date'],
            'class_code' => $employee['class_code'],
            'is_terminated' => $employee['is_terminated'] ? 'true' : 'false',
            'termination_date' => $employee['termination_date'],
            'termination_reason' => $employee['termination_reason'],
            'unit_code' => $employee['unit_code'],
            'unit_name' => $employee['unit_name'],
            'region_code' => $employee['region_code'],
            'branch_code' => $employee['branch_code'],
            'dashboard_region' => $employee['dashboard_region'],
            'employee_source' => basename($file),
            'employee_seed_batch' => $batch,
        ];
        if ($matchedUserIds) {
            $parameters['user_id'] = $matchedUserIds[0];
            $updateUser->execute($parameters);
            $userId = $matchedUserIds[0];
        } else {
            $insertUser->execute($parameters);
            $userId = (string)$insertUser->fetchColumn();
        }
        $userIds[$employee['employee_id']] = $userId;
    }

    $upsertClass = $pdo->prepare(
        <<<'SQL'
        INSERT INTO training_classes (
            class_code, class_name, region_name, start_date, end_date,
            capacity, status, is_mock, seed_batch, created_at, updated_at
        ) VALUES (
            :class_code, :class_name, :region_name, :start_date, :end_date,
            :capacity, :status, TRUE, :seed_batch, NOW(), NOW()
        )
        ON CONFLICT (class_code) DO UPDATE SET
            class_name = EXCLUDED.class_name,
            region_name = EXCLUDED.region_name,
            start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date,
            capacity = EXCLUDED.capacity,
            status = EXCLUDED.status,
            updated_at = NOW()
        WHERE training_classes.is_mock = TRUE
          AND training_classes.seed_batch = EXCLUDED.seed_batch
        RETURNING class_id
        SQL
    );
    $classIds = [];
    foreach ($classPlan['classes'] as $class) {
        $upsertClass->execute($class);
        $classId = $upsertClass->fetchColumn();
        if (!is_string($classId) || $classId === '') {
            throw new RuntimeException("Class code {$class['class_code']} is already owned by another data source.");
        }
        $classIds[$class['class_code']] = $classId;
    }

    $findCurrentEnrollment = $pdo->prepare(
        'SELECT enrollment_id, seed_batch, is_mock
           FROM class_enrollments
          WHERE user_id = :user_id
            AND status = \'active\'
            AND valid_to IS NULL
          FOR UPDATE'
    );
    $insertEnrollment = $pdo->prepare(
        'INSERT INTO class_enrollments (
            class_id, user_id, source_class_code, status, valid_from,
            is_mock, seed_batch, created_at, updated_at
         ) VALUES (
            :class_id, :user_id, :source_class_code, \'active\', :valid_from,
            TRUE, :seed_batch, NOW(), NOW()
         )'
    );
    $updateEnrollment = $pdo->prepare(
        'UPDATE class_enrollments
            SET class_id = :class_id,
                source_class_code = :source_class_code,
                valid_from = :valid_from,
                valid_to = NULL,
                status = \'active\',
                updated_at = NOW()
          WHERE enrollment_id = :enrollment_id'
    );
    foreach ($classPlan['enrollments'] as $enrollment) {
        $userId = $userIds[$enrollment['employee_id']];
        $findCurrentEnrollment->execute(['user_id' => $userId]);
        $currentEnrollment = $findCurrentEnrollment->fetch();
        $parameters = [
            'class_id' => $classIds[$enrollment['class_code']],
            'user_id' => $userId,
            'source_class_code' => $enrollment['source_class_code'],
            'valid_from' => $enrollment['valid_from'],
            'seed_batch' => $batch,
        ];
        if ($currentEnrollment) {
            if (
                !filter_var($currentEnrollment['is_mock'] ?? false, FILTER_VALIDATE_BOOLEAN)
                || (string)($currentEnrollment['seed_batch'] ?? '') !== $batch
            ) {
                throw new RuntimeException("Employee {$enrollment['employee_id']} already has an active non-batch class enrollment.");
            }
            $parameters['enrollment_id'] = $currentEnrollment['enrollment_id'];
            unset($parameters['user_id'], $parameters['seed_batch']);
            $updateEnrollment->execute($parameters);
        } else {
            $insertEnrollment->execute($parameters);
        }
    }

    $insertSession = $pdo->prepare(
        <<<'SQL'
        INSERT INTO timer_sessions (
            user_id, technician_id, name, email, started_at, finished_at,
            duration_sec, mode, device, lab_id, lab_name, status,
            completed_first_try, last_action, is_mock, seed_batch, seed_key, created_at
        )
        SELECT seeded.user_id,
               seeded.technician_id,
               seeded.name,
               seeded.email,
               seeded.started_at,
               seeded.finished_at,
               seeded.duration_sec,
               seeded.mode,
               seeded.device,
               seeded.lab_id,
               seeded.lab_name,
               seeded.status,
               seeded.completed_first_try,
               seeded.last_action,
               TRUE,
               seeded.seed_batch,
               seeded.seed_key,
               seeded.created_at
          FROM jsonb_to_recordset(CAST(:session_rows AS jsonb)) AS seeded(
              user_id UUID,
              technician_id VARCHAR(50),
              name VARCHAR(100),
              email VARCHAR(100),
              started_at TIMESTAMPTZ,
              finished_at TIMESTAMPTZ,
              duration_sec INT,
              mode VARCHAR(30),
              device VARCHAR(100),
              lab_id VARCHAR(50),
              lab_name VARCHAR(150),
              status VARCHAR(30),
              completed_first_try BOOLEAN,
              last_action TEXT,
              seed_batch VARCHAR(100),
              seed_key VARCHAR(200),
              created_at TIMESTAMPTZ
          )
        ON CONFLICT (seed_key) WHERE seed_key IS NOT NULL DO UPDATE SET
            user_id = EXCLUDED.user_id,
            technician_id = EXCLUDED.technician_id,
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            started_at = EXCLUDED.started_at,
            finished_at = EXCLUDED.finished_at,
            duration_sec = EXCLUDED.duration_sec,
            mode = EXCLUDED.mode,
            device = EXCLUDED.device,
            lab_id = EXCLUDED.lab_id,
            lab_name = EXCLUDED.lab_name,
            status = EXCLUDED.status,
            completed_first_try = EXCLUDED.completed_first_try,
            last_action = EXCLUDED.last_action,
            is_mock = TRUE,
            seed_batch = EXCLUDED.seed_batch,
            created_at = EXCLUDED.created_at
        SQL
    );
    foreach (array_chunk($planned, 500) as $sessionChunk) {
        $sessionRows = array_map(static function (array $session) use ($userIds): array {
            return [
                'user_id' => $userIds[$session['employee_id']],
                'technician_id' => $session['employee_id'],
                'name' => $session['name'],
                'email' => $session['email'],
                'started_at' => $session['started_at'],
                'finished_at' => $session['finished_at'],
                'created_at' => $session['finished_at'] ?? $session['started_at'],
                'duration_sec' => $session['duration_sec'],
                'mode' => $session['mode'],
                'device' => $session['device'],
                'lab_id' => $session['lab_id'],
                'lab_name' => $session['lab_name'],
                'status' => $session['status'],
                'completed_first_try' => $session['completed_first_try'],
                'last_action' => $session['last_action'],
                'seed_batch' => $session['seed_batch'],
                'seed_key' => $session['seed_key'],
            ];
        }, $sessionChunk);
        $sessionJson = json_encode(
            $sessionRows,
            JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR
        );
        $insertSession->execute(['session_rows' => $sessionJson]);
    }

    $verify = $pdo->prepare(
        'SELECT u.employee_id,
                COUNT(t.id) AS session_count,
                COUNT(DISTINCT t.lab_id) AS lab_count,
                COUNT(*) FILTER (WHERE t.mode = \'Hướng dẫn\') AS guide_count,
                COUNT(*) FILTER (WHERE t.mode = \'Thực hành\') AS practice_count
           FROM timer_sessions t
           JOIN users u ON u.user_id = t.user_id
          WHERE t.seed_batch = :session_batch
            AND t.is_mock = TRUE
          GROUP BY u.employee_id
          ORDER BY u.employee_id'
    );
    $verify->execute(['session_batch' => $batch]);
    $verification = $verify->fetchAll();
    if (count($verification) !== $count) {
        throw new RuntimeException('Seed verification failed: expected ' . $count . ' KTV, got ' . count($verification) . '.');
    }
    foreach ($verification as $row) {
        $sessionCount = (int)$row['session_count'];
        if (
            $sessionCount < 10
            || $sessionCount > 20
            || (int)$row['lab_count'] !== $sessionCount
            || (int)$row['guide_count'] < 1
            || (int)$row['practice_count'] < 1
        ) {
            throw new RuntimeException('Seed verification failed for employee ' . $row['employee_id'] . '.');
        }
    }

    $classVerification = $pdo->prepare(
        'SELECT training.class_code, COUNT(enrollment.user_id) AS employee_count
           FROM training_classes training
           JOIN class_enrollments enrollment ON enrollment.class_id = training.class_id
          WHERE training.seed_batch = :class_batch
            AND training.is_mock = TRUE
            AND enrollment.seed_batch = :enrollment_batch
            AND enrollment.is_mock = TRUE
            AND enrollment.status = \'active\'
            AND enrollment.valid_to IS NULL
          GROUP BY training.class_code
          ORDER BY training.class_code'
    );
    $classVerification->execute([
        'class_batch' => $batch,
        'enrollment_batch' => $batch,
    ]);
    $verifiedClasses = $classVerification->fetchAll();
    if (count($verifiedClasses) !== count($classPlan['classes'])) {
        throw new RuntimeException('Seed verification failed: demo class count does not match the plan.');
    }
    foreach ($verifiedClasses as $classRow) {
        $expectedClassSize = (int)($classCounts[$classRow['class_code']] ?? 0);
        if ((int)$classRow['employee_count'] !== $expectedClassSize) {
            throw new RuntimeException("Seed verification failed: class {$classRow['class_code']} size does not match the plan.");
        }
    }

    $pdo->commit();
    $perEmployee = array_map('intval', array_column($verification, 'session_count'));
    $modes = array_count_values(array_column($planned, 'mode'));
    $statuses = array_count_values(array_column($planned, 'status'));
    echo 'Seeded users: ' . count($verification) . PHP_EOL;
    echo 'Seeded classes: ' . count($verifiedClasses) . ' (' . min($classCounts) . '-' . max($classCounts) . ' KTV/class)' . PHP_EOL;
    echo 'Seeded sessions: ' . count($planned) . PHP_EOL;
    echo 'Sessions/KTV: ' . min($perEmployee) . '-' . max($perEmployee) . PHP_EOL;
    echo 'Modes: ' . json_encode($modes, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    echo 'Statuses: ' . json_encode($statuses, JSON_UNESCAPED_UNICODE) . PHP_EOL;
    echo "Seed completed successfully.\n";
} catch (Throwable $exception) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $exception;
}
