<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    fwrite(STDERR, "This command can only be run from the CLI.\n");
    exit(1);
}

$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
require_once $root . '/vendor/autoload.php';
require_once __DIR__ . '/lib/firestore_rest.php';

load_app_environment($root);
date_default_timezone_set(normalize_app_timezone(env_value('APP_TIMEZONE')));

function firestore_import_usage(): void
{
    echo <<<TEXT
Usage:
  php api/import_firestore_dashboard.php --credentials=/path/service-account.json [options]

Options:
  --batch=firestore-PROJECT_ID  Stable idempotency key (maximum 100 characters).
  --execute                     Commit the import. Default is a read-only dry run.
  --help                        Show this help.

The importer reads users, classes, assignments and activity_logs from the
Firestore (default) database. Missing employee and region fields remain NULL.
TEXT;
}

/** @return never */
function firestore_import_fail(string $message): void
{
    fwrite(STDERR, $message . PHP_EOL);
    exit(1);
}

function firestore_import_text(mixed $value, int $maximum = 0): ?string
{
    if (!is_scalar($value)) return null;
    $text = trim((string)$value);
    if ($text === '') return null;
    if ($maximum > 0) {
        $text = function_exists('mb_substr')
            ? mb_substr($text, 0, $maximum, 'UTF-8')
            : substr($text, 0, $maximum);
    }
    return $text;
}

function firestore_import_email(mixed $value): ?string
{
    $email = strtolower(trim((string)$value));
    return filter_var($email, FILTER_VALIDATE_EMAIL) ? $email : null;
}

function firestore_import_datetime(mixed $value): ?DateTimeImmutable
{
    if (is_int($value) || is_float($value) || (is_string($value) && preg_match('/^\d{10,16}$/D', $value))) {
        $numeric = (float)$value;
        if ($numeric > 100000000000.0) $numeric /= 1000.0;
        if ($numeric > 1000000000.0 && $numeric < 5000000000.0) {
            return (new DateTimeImmutable('@' . (string)(int)$numeric))
                ->setTimezone(new DateTimeZone(normalize_app_timezone(env_value('APP_TIMEZONE'))));
        }
    }
    $text = firestore_import_text($value);
    if ($text === null) return null;
    try {
        return new DateTimeImmutable($text);
    } catch (Throwable) {
        return null;
    }
}

function firestore_import_timestamp(?DateTimeImmutable $value): ?string
{
    return $value?->format(DateTimeInterface::ATOM);
}

function firestore_import_normalize(string $value): string
{
    $value = str_replace(['đ', 'Đ'], ['d', 'D'], $value);
    if (function_exists('mb_strtolower')) {
        $value = mb_strtolower($value, 'UTF-8');
    } else {
        $value = strtolower($value);
    }
    $ascii = @iconv('UTF-8', 'ASCII//TRANSLIT//IGNORE', $value);
    if (is_string($ascii) && $ascii !== '') $value = $ascii;
    $value = strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/', ' ', $value) ?? $value;
    return trim(preg_replace('/\s+/', ' ', $value) ?? $value);
}

function firestore_import_lab_number(string $value): ?int
{
    $normalized = firestore_import_normalize($value);
    return preg_match('/(?:^| )bai\s*(\d{1,2})(?: |$)/', $normalized, $matches)
        ? (int)$matches[1]
        : null;
}

function firestore_import_task_key(string $value): string
{
    $value = firestore_import_normalize($value);
    $value = preg_replace('/(?:^| )bai\s*\d{1,2}(?: |$)/', ' ', $value) ?? $value;
    $value = preg_replace('/(?:^| )cau hinh(?: |$)/', ' ', $value) ?? $value;
    $value = preg_replace('/\s+/', ' ', $value) ?? $value;
    return trim($value);
}

function firestore_import_activity_mode(?string $description): string
{
    $source = trim($description ?? '');
    $lower = function_exists('mb_strtolower')
        ? mb_strtolower($source, 'UTF-8')
        : strtolower($source);
    if (str_starts_with($lower, 'hoàn thành lab có hướng dẫn')) return 'guide';

    $normalized = firestore_import_normalize($description ?? '');
    return preg_match('/^hoan\s+thanh\s+lab\s+co\s+huong\s+dan\b/', $normalized) === 1
        ? 'guide'
        : 'practice';
}

function firestore_import_hash_id(string $prefix, string $value, int $length = 16): string
{
    return $prefix . strtoupper(substr(hash('sha256', $value), 0, $length));
}

function firestore_import_source_key(string $projectId, string $collection, string $documentId): string
{
    $key = "firestore:$projectId:$collection:$documentId";
    return strlen($key) <= 190
        ? $key
        : "firestore:$projectId:$collection:" . hash('sha256', $documentId);
}

/** @return array<int, string> */
function firestore_import_string_array(mixed $value): array
{
    if (!is_array($value)) return [];
    $items = [];
    foreach ($value as $item) {
        $text = firestore_import_text($item);
        if ($text !== null) $items[$text] = true;
    }
    return array_keys($items);
}

final class FirestoreCatalogPlanner
{
    /** @var array<string, array<string, mixed>> */
    private array $devices = [];
    /** @var array<string, array<string, mixed>> */
    private array $labs = [];
    /** @var array<string, array<int, string>> */
    private array $labIdsByDevice = [];
    /** @var array<string, array<string, int>> */
    private array $observedLabsByTitle = [];
    /** @var array<string, true> */
    private array $newDeviceIds = [];
    /** @var array<string, true> */
    private array $newLabIds = [];

    public function __construct(PDO $pdo, private readonly string $projectId)
    {
        foreach ($pdo->query(
            'SELECT device_id, model, device_name, sort_order FROM device_catalog ORDER BY sort_order, device_id'
        )->fetchAll() as $row) {
            $id = (string)$row['device_id'];
            $this->devices[$id] = $row + ['is_new' => false];
        }
        foreach ($pdo->query(
            'SELECT lab_id, device_id, lab_name, sort_order FROM lab_catalog ORDER BY device_id, sort_order, lab_id'
        )->fetchAll() as $row) {
            $id = (string)$row['lab_id'];
            $deviceId = (string)$row['device_id'];
            $this->labs[$id] = $row + ['is_new' => false];
            $this->labIdsByDevice[$deviceId][] = $id;
        }
    }

    public function resolveObserved(string $deviceName, string $labName): array
    {
        $deviceId = $this->resolveDevice($deviceName);
        $labId = $this->resolveLab($deviceId, $labName);
        $titleKey = firestore_import_normalize($labName);
        $this->observedLabsByTitle[$titleKey][$labId] =
            ($this->observedLabsByTitle[$titleKey][$labId] ?? 0) + 1;
        return [$deviceId, $labId];
    }

    /** @return array<int, string> */
    public function resolveTarget(string $labName): array
    {
        $titleKey = firestore_import_normalize($labName);
        $observed = $this->observedLabsByTitle[$titleKey] ?? [];
        if ($observed) {
            arsort($observed);
            return [(string)array_key_first($observed)];
        }
        $matches = [];
        foreach ($this->labs as $labId => $lab) {
            if (firestore_import_normalize((string)$lab['lab_name']) === $titleKey) {
                $matches[] = $labId;
            }
        }
        $matches = array_values(array_unique($matches));
        if ($matches) {
            sort($matches);
            return [$matches[0]];
        }

        $targetTask = firestore_import_task_key($labName);
        $bestScore = 0.0;
        $best = [];
        foreach ($this->labs as $labId => $lab) {
            $candidate = firestore_import_task_key((string)$lab['lab_name']);
            if ($candidate === '' || $targetTask === '') continue;
            similar_text($targetTask, $candidate, $score);
            if ($score > $bestScore + 0.1) {
                $bestScore = $score;
                $best = [$labId];
            } elseif (abs($score - $bestScore) <= 0.1) {
                $best[] = $labId;
            }
        }
        if ($bestScore >= 92.0) {
            sort($best);
            return [$best[0]];
        }

        $deviceId = $this->resolveDevice('Thiết bị chưa xác định');
        return [$this->resolveLab($deviceId, $labName)];
    }

    /** @return array<string, array<string, mixed>> */
    public function newDevices(): array
    {
        return array_intersect_key($this->devices, $this->newDeviceIds);
    }

    /** @return array<string, array<string, mixed>> */
    public function newLabs(): array
    {
        return array_intersect_key($this->labs, $this->newLabIds);
    }

    /** @return array<string, array<string, mixed>> */
    public function allLabs(): array
    {
        return $this->labs;
    }

    private function resolveDevice(string $deviceName): string
    {
        $normalized = preg_replace(
            '/[^A-Z0-9]+/',
            '',
            strtoupper(firestore_import_normalize($deviceName))
        ) ?? '';
        $tokens = [
            'AC1000HI' => 'AC1000HI',
            'AC1000F' => 'AC1000F',
            'AX3000CV2' => 'AX3000CV2',
            'AX3000HV2' => 'AX3000HV2',
            'AX3000GZ' => 'AX3000GZ',
            'AX3000S' => 'AX3000S',
            'BE12000Z' => 'BE12000',
            'BE12000' => 'BE12000',
            'BE15000' => 'BE15000',
            'VIGOR2927' => 'VIGOR2927',
        ];
        $modelToken = null;
        foreach ($tokens as $needle => $token) {
            if (str_contains($normalized, $needle)) {
                $modelToken = $token;
                break;
            }
        }
        if ($modelToken === null && preg_match('/[A-Z]{2,}[0-9][A-Z0-9]*/', $normalized, $matches)) {
            $modelToken = $matches[0];
        }
        foreach ($this->devices as $deviceId => $device) {
            // Firestore-generated catalog rows must not influence how a different
            // source label is resolved on a later import.
            if (str_starts_with($deviceId, 'FS_DEV_')) continue;
            $model = preg_replace('/[^A-Z0-9]+/', '', strtoupper((string)($device['model'] ?? ''))) ?? '';
            $name = preg_replace(
                '/[^A-Z0-9]+/',
                '',
                strtoupper(firestore_import_normalize((string)$device['device_name']))
            ) ?? '';
            if (($modelToken !== null && ($model === $modelToken || str_contains($name, $modelToken)))
                || ($modelToken === null && $name === $normalized)) {
                return $deviceId;
            }
        }

        // Equivalent labels that contain the same model (for example
        // "ONT AC1000HI" and "AC1000HI") share one stable generated device.
        $deviceKey = $modelToken !== null
            ? strtolower($modelToken)
            : (firestore_import_normalize($deviceName) ?: 'unknown');
        $generatedDeviceId = firestore_import_hash_id('FS_DEV_', $this->projectId . '|' . $deviceKey, 14);
        if (isset($this->devices[$generatedDeviceId])) {
            return $generatedDeviceId;
        }

        $deviceId = $generatedDeviceId;
        if (!isset($this->devices[$deviceId])) {
            $this->devices[$deviceId] = [
                'device_id' => $deviceId,
                'model' => firestore_import_text($modelToken ?? $deviceName, 100),
                'device_name' => firestore_import_text($deviceName, 100) ?? 'Thiết bị chưa xác định',
                'sort_order' => 1000 + count($this->newDeviceIds),
                'is_new' => true,
            ];
            $this->newDeviceIds[$deviceId] = true;
        }
        return $deviceId;
    }

    private function resolveLab(string $deviceId, string $labName): string
    {
        $titleKey = firestore_import_normalize($labName);
        $generatedLabId = firestore_import_hash_id(
            'FS_LAB_',
            $this->projectId . '|' . $deviceId . '|' . ($titleKey ?: $labName),
            16
        );
        if (isset($this->labs[$generatedLabId])) {
            return $generatedLabId;
        }

        $number = firestore_import_lab_number($labName);
        // Exclude importer-created aliases from fuzzy/number matching. Otherwise
        // the first import can create an alias that changes a later import's map.
        $candidateIds = array_values(array_filter(
            $this->labIdsByDevice[$deviceId] ?? [],
            static fn(string $labId): bool => !str_starts_with($labId, 'FS_LAB_')
        ));
        foreach ($candidateIds as $labId) {
            if (firestore_import_normalize((string)$this->labs[$labId]['lab_name']) === $titleKey) {
                return $labId;
            }
        }
        if ($number !== null) {
            foreach ($candidateIds as $labId) {
                if (firestore_import_lab_number((string)$this->labs[$labId]['lab_name']) === $number
                    || preg_match('/_' . sprintf('%02d', $number) . '$/D', $labId)) {
                    return $labId;
                }
            }
        }

        $task = firestore_import_task_key($labName);
        $bestId = null;
        $bestScore = 0.0;
        foreach ($candidateIds as $labId) {
            similar_text($task, firestore_import_task_key((string)$this->labs[$labId]['lab_name']), $score);
            if ($score > $bestScore) {
                $bestScore = $score;
                $bestId = $labId;
            }
        }
        if ($bestId !== null && $bestScore >= 78.0) return $bestId;

        $labId = $generatedLabId;
        if (!isset($this->labs[$labId])) {
            $this->labs[$labId] = [
                'lab_id' => $labId,
                'device_id' => $deviceId,
                'lab_name' => firestore_import_text($labName, 150) ?? 'Bài lab chưa xác định',
                'sort_order' => $number ?? (1000 + count($this->newLabIds)),
                'is_new' => true,
            ];
            $this->labIdsByDevice[$deviceId][] = $labId;
            $this->newLabIds[$labId] = true;
        }
        return $labId;
    }
}

/** @return array<string, mixed> */
function firestore_import_build_plan(
    PDO $pdo,
    FirestoreRestReader $reader,
    string $batch
): array {
    $projectId = $reader->projectId();
    $firestoreUsers = $reader->listDocuments('users');
    $firestoreClasses = $reader->listDocuments('classes');
    $firestoreAssignments = $reader->listDocuments('assignments');
    $firestoreActivities = $reader->listDocuments('activity_logs');

    $planner = new FirestoreCatalogPlanner($pdo, $projectId);
    $users = [];
    $invalidUserEmails = 0;
    foreach ($firestoreUsers as $document) {
        $email = firestore_import_email($document['email'] ?? null);
        if ($email === null) {
            $invalidUserEmails++;
            continue;
        }
        $role = strtolower((string)($document['role'] ?? 'user')) === 'admin' ? 'admin' : 'user';
        $users[$email] = [
            'email' => $email,
            'display_name' => null,
            'role' => $role,
            'created_at' => firestore_import_timestamp(
                firestore_import_datetime($document['createdAt'] ?? $document['_create_time'] ?? null)
            ),
            'source_id' => (string)$document['_id'],
            'name_updated_at' => null,
        ];
    }

    $activities = [];
    $invalidActivityEmails = 0;
    foreach ($firestoreActivities as $document) {
        $email = firestore_import_email($document['email'] ?? null);
        if ($email === null) $invalidActivityEmails++;
        $name = firestore_import_text($document['user'] ?? null, 100);
        $deviceName = firestore_import_text($document['deviceName'] ?? $document['device'] ?? null, 100)
            ?? 'Thiết bị chưa xác định';
        $labName = firestore_import_text(
            $document['actionTitle'] ?? $document['title'] ?? null,
            150
        ) ?? 'Bài lab chưa xác định';
        [$deviceId, $labId] = $planner->resolveObserved($deviceName, $labName);

        $description = firestore_import_text(
            $document['description'] ?? $document['desc'] ?? $labName,
            1000
        );
        $activityMode = firestore_import_activity_mode($description);
        $durationWasProvided = array_key_exists('durationSeconds', $document);
        $rawDuration = $document['durationSeconds'] ?? null;
        $duration = is_numeric($rawDuration) && (int)$rawDuration > 0
            ? (int)$rawDuration
            : null;
        $started = firestore_import_datetime($document['startTime'] ?? null);
        $finished = firestore_import_datetime($document['endTime'] ?? null);
        $eventTime = firestore_import_datetime(
            $document['timestamp'] ?? $document['createdAt'] ?? $document['_create_time'] ?? null
        ) ?? new DateTimeImmutable('now');
        $finished ??= $eventTime;
        if ($started === null) {
            $started = $duration > 0 ? $finished->modify("-$duration seconds") : $finished;
        }
        if ($finished < $started) {
            $finished = $duration > 0 ? $started->modify("+$duration seconds") : $started;
        }
        if ($duration === null && !$durationWasProvided) {
            $elapsed = $finished->getTimestamp() - $started->getTimestamp();
            $duration = $elapsed > 0 ? $elapsed : null;
        }
        $sourceKey = firestore_import_source_key($projectId, 'activity_logs', (string)$document['_id']);
        $activity = [
            'source_key' => $sourceKey,
            'source_id' => (string)$document['_id'],
            'email' => $email,
            'name' => $name,
            'device_id' => $deviceId,
            'device_name' => $deviceName,
            'lab_id' => $labId,
            'lab_name' => $labName,
            'started_at' => firestore_import_timestamp($started),
            'finished_at' => firestore_import_timestamp($finished),
            'duration_sec' => $duration,
            'mode' => $activityMode,
            'error_count' => max(0, (int)($document['errorCount'] ?? 0)),
            'last_action' => $description,
            'class_code' => null,
        ];
        $activities[] = $activity;

        if ($email !== null) {
            if (!isset($users[$email])) {
                $users[$email] = [
                    'email' => $email,
                    'display_name' => $name,
                    'role' => 'user',
                    'created_at' => $activity['started_at'],
                    'source_id' => null,
                    'name_updated_at' => $activity['finished_at'],
                ];
            } elseif ($name !== null && ($users[$email]['name_updated_at'] ?? '') <= $activity['finished_at']) {
                $users[$email]['display_name'] = $name;
                $users[$email]['name_updated_at'] = $activity['finished_at'];
            }
        }
    }

    foreach ($firestoreAssignments as $document) {
        $deviceName = firestore_import_text($document['device'] ?? null, 100);
        $labName = firestore_import_text($document['labName'] ?? null, 150);
        if ($deviceName !== null && $labName !== null) {
            $planner->resolveObserved($deviceName, $labName);
        }
    }

    $classes = [];
    $membershipsByEmail = [];
    $invalidStudentEmails = 0;
    foreach ($firestoreClasses as $document) {
        $documentId = (string)$document['_id'];
        $classCode = firestore_import_hash_id('FS_', $projectId . '|classes|' . $documentId, 16);
        $className = firestore_import_text($document['className'] ?? null, 500) ?? $classCode;
        $created = firestore_import_datetime($document['createdAt'] ?? $document['_create_time'] ?? null)
            ?? new DateTimeImmutable('today');
        $students = [];
        foreach (firestore_import_string_array($document['students'] ?? []) as $candidate) {
            $email = firestore_import_email($candidate);
            if ($email === null) {
                $invalidStudentEmails++;
                continue;
            }
            $students[$email] = true;
            if (!isset($users[$email])) {
                $users[$email] = [
                    'email' => $email,
                    'display_name' => null,
                    'role' => 'user',
                    'created_at' => firestore_import_timestamp($created),
                    'source_id' => null,
                    'name_updated_at' => null,
                ];
            }
        }
        $targetLabIds = [];
        foreach (firestore_import_string_array($document['targetLabs'] ?? []) as $targetLab) {
            foreach ($planner->resolveTarget($targetLab) as $labId) {
                $targetLabIds[$labId] = true;
            }
        }
        $classes[$classCode] = [
            'class_code' => $classCode,
            'class_name' => $className,
            'created_at' => firestore_import_timestamp($created),
            'start_date' => $created->format('Y-m-d'),
            'capacity' => is_numeric($document['capacity'] ?? null)
                && (int)$document['capacity'] > 0
                ? (int)$document['capacity']
                : null,
            'created_by_email' => firestore_import_email($document['createdBy'] ?? null),
            'students' => array_keys($students),
            'target_lab_ids' => array_keys($targetLabIds),
            'is_fallback' => false,
        ];
        foreach (array_keys($students) as $email) {
            $membershipsByEmail[$email][$classCode] = true;
        }
    }

    $fallbackEmails = [];
    foreach ($activities as $activity) {
        $email = $activity['email'];
        if ($email !== null && empty($membershipsByEmail[$email])) {
            $fallbackEmails[$email] = true;
        }
    }
    if ($fallbackEmails) {
        $earliest = null;
        foreach ($activities as $activity) {
            if ($activity['email'] !== null && isset($fallbackEmails[$activity['email']])) {
                $date = firestore_import_datetime($activity['started_at']);
                if ($date !== null && ($earliest === null || $date < $earliest)) $earliest = $date;
            }
        }
        $earliest ??= new DateTimeImmutable('today');
        $fallbackCode = 'FS_UNASSIGNED';
        $classes[$fallbackCode] = [
            'class_code' => $fallbackCode,
            'class_name' => 'Firestore - Chưa xếp lớp',
            'created_at' => firestore_import_timestamp($earliest),
            'start_date' => $earliest->format('Y-m-d'),
            'capacity' => null,
            'created_by_email' => null,
            'students' => array_keys($fallbackEmails),
            'target_lab_ids' => [],
            'is_fallback' => true,
        ];
        foreach (array_keys($fallbackEmails) as $email) {
            $membershipsByEmail[$email][$fallbackCode] = true;
        }
    }

    $memberships = [];
    foreach ($membershipsByEmail as $email => $classSet) {
        $classCodes = array_keys($classSet);
        usort($classCodes, static function (string $left, string $right) use ($classes): int {
            $dateCompare = strcmp((string)$classes[$left]['start_date'], (string)$classes[$right]['start_date']);
            return $dateCompare !== 0 ? $dateCompare : strcmp($left, $right);
        });
        $lastIndex = count($classCodes) - 1;
        foreach ($classCodes as $index => $classCode) {
            $next = $classCodes[$index + 1] ?? null;
            $memberships[] = [
                'email' => $email,
                'class_code' => $classCode,
                'status' => $index === $lastIndex ? 'active' : 'completed',
                'valid_from' => $classes[$classCode]['start_date'],
                'valid_to' => $next !== null ? $classes[$next]['start_date'] : null,
            ];
        }
    }

    $membershipLookup = [];
    foreach ($memberships as $membership) {
        $membershipLookup[$membership['email']][] = $membership;
    }
    foreach ($membershipLookup as &$emailMemberships) {
        usort($emailMemberships, static fn(array $a, array $b): int => strcmp($a['valid_from'], $b['valid_from']));
    }
    unset($emailMemberships);

    foreach ($activities as &$activity) {
        $emailMemberships = $activity['email'] !== null ? ($membershipLookup[$activity['email']] ?? []) : [];
        $activityDate = substr((string)$activity['started_at'], 0, 10);
        $selected = null;
        foreach ($emailMemberships as $membership) {
            if ($membership['valid_from'] <= $activityDate) $selected = $membership;
        }
        $selected ??= $emailMemberships ? end($emailMemberships) : null;
        $activity['class_code'] = $selected['class_code'] ?? null;
    }
    unset($activity);

    $assignmentPlans = [];
    foreach ($memberships as $membership) {
        $class = $classes[$membership['class_code']];
        foreach ($class['target_lab_ids'] as $labId) {
            $key = $membership['email'] . '|' . $membership['class_code'] . '|' . $labId;
            $assignmentPlans[$key] = [
                'email' => $membership['email'],
                'class_code' => $membership['class_code'],
                'lab_id' => $labId,
                'assigned_at' => $class['created_at'],
                'status' => 'assigned',
                'completed_at' => null,
                'assignment_source' => 'class_curriculum',
                'is_inferred' => false,
            ];
        }
    }
    foreach ($activities as $activity) {
        if ($activity['email'] === null || $activity['class_code'] === null) continue;
        $key = $activity['email'] . '|' . $activity['class_code'] . '|' . $activity['lab_id'];
        if (!isset($assignmentPlans[$key])) {
            $assignmentPlans[$key] = [
                'email' => $activity['email'],
                'class_code' => $activity['class_code'],
                'lab_id' => $activity['lab_id'],
                'assigned_at' => $activity['started_at'],
                'status' => $activity['mode'] === 'practice' ? 'completed' : 'in_progress',
                'completed_at' => $activity['mode'] === 'practice' ? $activity['finished_at'] : null,
                'assignment_source' => 'legacy_observed',
                'is_inferred' => true,
            ];
        } else {
            if ($activity['mode'] === 'practice') {
                $assignmentPlans[$key]['status'] = 'completed';
                $currentCompleted = $assignmentPlans[$key]['completed_at'];
                if ($currentCompleted === null || $activity['finished_at'] < $currentCompleted) {
                    $assignmentPlans[$key]['completed_at'] = $activity['finished_at'];
                }
            } elseif ($assignmentPlans[$key]['status'] === 'assigned') {
                $assignmentPlans[$key]['status'] = 'in_progress';
            }
            if ($activity['started_at'] < $assignmentPlans[$key]['assigned_at']) {
                $assignmentPlans[$key]['assigned_at'] = $activity['started_at'];
            }
        }
    }

    $sourceEmails = array_fill_keys(array_keys($users), true);
    $nonImportConflicts = 0;
    foreach ($pdo->query(
        "SELECT LOWER(users.email) AS email
           FROM class_enrollments enrollment
           JOIN users ON users.user_id = enrollment.user_id
          WHERE enrollment.status = 'active'
            AND enrollment.valid_to IS NULL
            AND COALESCE(enrollment.seed_batch, '') <> " . $pdo->quote($batch)
    )->fetchAll(PDO::FETCH_COLUMN) as $email) {
        if (isset($sourceEmails[(string)$email])) $nonImportConflicts++;
    }

    return [
        'project_id' => $projectId,
        'batch' => $batch,
        'firestore_counts' => [
            'users' => count($firestoreUsers),
            'classes' => count($firestoreClasses),
            'assignments' => count($firestoreAssignments),
            'activity_logs' => count($firestoreActivities),
        ],
        'users' => $users,
        'classes' => $classes,
        'memberships' => $memberships,
        'assignments' => array_values($assignmentPlans),
        'activities' => $activities,
        'new_devices' => $planner->newDevices(),
        'new_labs' => $planner->newLabs(),
        'all_labs' => $planner->allLabs(),
        'warnings' => [
            'invalid_user_emails' => $invalidUserEmails,
            'invalid_student_emails' => $invalidStudentEmails,
            'activity_logs_without_valid_email' => $invalidActivityEmails,
            'non_import_active_enrollment_conflicts' => $nonImportConflicts,
            'unassigned_firestore_assignments' => count($firestoreAssignments),
        ],
    ];
}

/** @param array<string, mixed> $plan */
function firestore_import_print_plan(array $plan): void
{
    echo 'project_id=' . $plan['project_id'] . PHP_EOL;
    echo 'batch=' . $plan['batch'] . PHP_EOL;
    foreach ($plan['firestore_counts'] as $key => $value) {
        echo "firestore.$key=$value" . PHP_EOL;
    }
    echo 'planned.users=' . count($plan['users']) . PHP_EOL;
    echo 'planned.classes=' . count($plan['classes']) . PHP_EOL;
    echo 'planned.memberships=' . count($plan['memberships']) . PHP_EOL;
    echo 'planned.lab_assignments=' . count($plan['assignments']) . PHP_EOL;
    echo 'planned.timer_sessions=' . count($plan['activities']) . PHP_EOL;
    $activityModes = array_count_values(array_column($plan['activities'], 'mode'));
    echo 'planned.practice_activities=' . (int)($activityModes['practice'] ?? 0) . PHP_EOL;
    echo 'planned.guide_activities=' . (int)($activityModes['guide'] ?? 0) . PHP_EOL;
    echo 'planned.unknown_durations=' . count(array_filter(
        $plan['activities'],
        static fn(array $activity): bool => $activity['duration_sec'] === null
    )) . PHP_EOL;
    $assignmentStatuses = array_count_values(array_column($plan['assignments'], 'status'));
    echo 'planned.completed_assignments=' . (int)($assignmentStatuses['completed'] ?? 0) . PHP_EOL;
    echo 'planned.passed_assignments=' . (int)($assignmentStatuses['passed'] ?? 0) . PHP_EOL;
    echo 'planned.new_devices=' . count($plan['new_devices']) . PHP_EOL;
    echo 'planned.new_labs=' . count($plan['new_labs']) . PHP_EOL;
    foreach ($plan['warnings'] as $key => $value) {
        echo "warning.$key=$value" . PHP_EOL;
    }
    foreach ($plan['new_devices'] as $device) {
        echo 'new_device[' . $device['device_id'] . ']=' . $device['device_name'] . PHP_EOL;
    }
    foreach ($plan['new_labs'] as $lab) {
        echo 'new_lab[' . $lab['lab_id'] . ']=' . $lab['device_id'] . ' | ' . $lab['lab_name'] . PHP_EOL;
    }
}

/** @param array<string, mixed> $plan @return array<string, int> */
function firestore_import_execute(PDO $pdo, array $plan): array
{
    $batch = (string)$plan['batch'];
    $projectId = (string)$plan['project_id'];
    $attemptPrefix = "firestore:$projectId:activity_logs:";
    $counts = [];

    $upsertUser = $pdo->prepare(
        <<<'SQL'
        INSERT INTO users (
            email, display_name, role, iam_profile, employee_source,
            employee_seed_batch, employee_synced_at, created_at, updated_at
        ) VALUES (
            :email, :display_name, :role, CAST(:iam_profile AS jsonb), :employee_source,
            :employee_seed_batch, NOW(), COALESCE(CAST(:created_at AS timestamptz), NOW()), NOW()
        )
        ON CONFLICT (email) DO UPDATE SET
            display_name = COALESCE(NULLIF(EXCLUDED.display_name, ''), users.display_name),
            role = CASE WHEN users.role = 'admin' OR EXCLUDED.role = 'admin' THEN 'admin' ELSE 'user' END,
            employee_source = COALESCE(users.employee_source, EXCLUDED.employee_source),
            employee_seed_batch = EXCLUDED.employee_seed_batch,
            employee_synced_at = NOW(),
            updated_at = NOW()
        SQL
    );
    foreach ($plan['users'] as $user) {
        $upsertUser->execute([
            'email' => $user['email'],
            'display_name' => $user['display_name'],
            'role' => $user['role'],
            'iam_profile' => json_encode([
                'source' => 'firestore',
                'project_id' => $projectId,
                'document_id' => $user['source_id'],
            ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
            'employee_source' => 'firestore:users',
            'employee_seed_batch' => $batch,
            'created_at' => $user['created_at'],
        ]);
    }
    $counts['users_upserted'] = count($plan['users']);

    $userIds = [];
    foreach ($pdo->query('SELECT user_id, LOWER(email) AS email FROM users')->fetchAll() as $row) {
        $userIds[(string)$row['email']] = (string)$row['user_id'];
    }

    $insertDevice = $pdo->prepare(
        'INSERT INTO device_catalog (device_id, model, device_name, sort_order, is_active, created_at, updated_at)
         VALUES (:device_id, :model, :device_name, :sort_order, TRUE, NOW(), NOW())
         ON CONFLICT (device_id) DO UPDATE SET
            model = EXCLUDED.model, device_name = EXCLUDED.device_name,
            is_active = TRUE, updated_at = NOW()'
    );
    foreach ($plan['new_devices'] as $device) {
        $insertDevice->execute([
            'device_id' => $device['device_id'],
            'model' => $device['model'],
            'device_name' => $device['device_name'],
            'sort_order' => $device['sort_order'],
        ]);
    }
    $counts['devices_inserted'] = count($plan['new_devices']);

    $insertLab = $pdo->prepare(
        'INSERT INTO lab_catalog (lab_id, device_id, lab_name, sort_order, is_active, created_at, updated_at)
         VALUES (:lab_id, :device_id, :lab_name, :sort_order, TRUE, NOW(), NOW())
         ON CONFLICT (lab_id) DO UPDATE SET
            lab_name = EXCLUDED.lab_name, is_active = TRUE, updated_at = NOW()'
    );
    foreach ($plan['new_labs'] as $lab) {
        $insertLab->execute([
            'lab_id' => $lab['lab_id'],
            'device_id' => $lab['device_id'],
            'lab_name' => $lab['lab_name'],
            'sort_order' => $lab['sort_order'],
        ]);
    }
    $counts['labs_inserted'] = count($plan['new_labs']);

    $curriculumId = $pdo->query(
        "SELECT curriculum_id
           FROM curricula
          WHERE status = 'active'
          ORDER BY is_default DESC, created_at
          LIMIT 1"
    )->fetchColumn();
    if (!is_string($curriculumId) || $curriculumId === '') {
        throw new RuntimeException('No active curriculum is available for the Firestore import.');
    }
    $attachLab = $pdo->prepare(
        'INSERT INTO curriculum_labs (
            curriculum_id, lab_id, required_mode, is_required, sort_order,
            passing_score, created_at, updated_at
         ) VALUES (
            :curriculum_id, :lab_id, \'practice\', TRUE, :sort_order,
            NULL, NOW(), NOW()
         )
         ON CONFLICT (curriculum_id, lab_id, required_mode) DO UPDATE SET
            is_required = TRUE, updated_at = NOW()'
    );
    $usedLabIds = [];
    foreach ($plan['assignments'] as $assignment) $usedLabIds[$assignment['lab_id']] = true;
    foreach ($plan['activities'] as $activity) $usedLabIds[$activity['lab_id']] = true;
    $activateLab = $pdo->prepare(
        'UPDATE lab_catalog SET is_active = TRUE, updated_at = NOW() WHERE lab_id = :lab_id'
    );
    foreach (array_keys($usedLabIds) as $labId) {
        $activateLab->execute(['lab_id' => $labId]);
        $attachLab->execute([
            'curriculum_id' => $curriculumId,
            'lab_id' => $labId,
            'sort_order' => (int)($plan['all_labs'][$labId]['sort_order'] ?? 0),
        ]);
    }
    $counts['curriculum_labs_upserted'] = count($usedLabIds);

    $deactivateUnusedLabs = $pdo->prepare(
        <<<'SQL'
        WITH used AS (
            SELECT jsonb_array_elements_text(CAST(:lab_ids AS jsonb)) AS lab_id
        )
        UPDATE lab_catalog lab
           SET is_active = FALSE,
               updated_at = NOW()
         WHERE lab.lab_id LIKE 'FS_LAB_%'
           AND lab.is_active = TRUE
           AND NOT EXISTS (SELECT 1 FROM used WHERE used.lab_id = lab.lab_id)
        SQL
    );
    $deactivateUnusedLabs->execute([
        'lab_ids' => json_encode(array_keys($usedLabIds), JSON_THROW_ON_ERROR),
    ]);
    $counts['unused_firestore_labs_deactivated'] = $deactivateUnusedLabs->rowCount();

    $refreshGeneratedDevices = $pdo->prepare(
        <<<'SQL'
        UPDATE device_catalog device
           SET is_active = EXISTS (
                   SELECT 1
                     FROM lab_catalog lab
                    WHERE lab.device_id = device.device_id
                      AND lab.is_active = TRUE
               ),
               updated_at = NOW()
         WHERE device.device_id LIKE 'FS_DEV_%'
        SQL
    );
    $refreshGeneratedDevices->execute();

    $upsertClass = $pdo->prepare(
        <<<'SQL'
        INSERT INTO training_classes (
            class_code, class_name, region_name, start_date, end_date, capacity,
            status, instructor_user_id, is_mock, seed_batch, curriculum_id,
            created_at, updated_at
        ) VALUES (
            :class_code, :class_name, 'Chưa phân vùng', :start_date, NULL, :capacity,
            'active', :instructor_user_id, FALSE, :seed_batch, :curriculum_id,
            CAST(:created_at AS timestamptz), NOW()
        )
        ON CONFLICT (class_code) DO UPDATE SET
            class_name = EXCLUDED.class_name,
            capacity = EXCLUDED.capacity,
            status = 'active',
            instructor_user_id = COALESCE(EXCLUDED.instructor_user_id, training_classes.instructor_user_id),
            curriculum_id = EXCLUDED.curriculum_id,
            is_mock = FALSE,
            seed_batch = EXCLUDED.seed_batch,
            updated_at = NOW()
        RETURNING class_id
        SQL
    );
    $classIds = [];
    foreach ($plan['classes'] as $class) {
        $upsertClass->execute([
            'class_code' => $class['class_code'],
            'class_name' => $class['class_name'],
            'start_date' => $class['start_date'],
            'capacity' => $class['capacity'],
            'instructor_user_id' => $class['created_by_email'] !== null
                ? ($userIds[$class['created_by_email']] ?? null)
                : null,
            'seed_batch' => $batch,
            'curriculum_id' => $curriculumId,
            'created_at' => $class['created_at'],
        ]);
        $classIds[$class['class_code']] = (string)$upsertClass->fetchColumn();
    }
    $counts['classes_upserted'] = count($classIds);

    if ((int)$plan['warnings']['non_import_active_enrollment_conflicts'] > 0) {
        throw new RuntimeException('Some Firestore users already have active non-Firestore enrollments.');
    }
    $closeOwnEnrollments = $pdo->prepare(
        "UPDATE class_enrollments
            SET status = 'completed',
                valid_to = COALESCE(valid_to, CURRENT_DATE),
                updated_at = NOW()
          WHERE seed_batch = :batch
            AND status = 'active'
            AND valid_to IS NULL"
    );
    $closeOwnEnrollments->execute(['batch' => $batch]);

    $upsertEnrollment = $pdo->prepare(
        <<<'SQL'
        INSERT INTO class_enrollments (
            class_id, user_id, source_class_code, status, valid_from, valid_to,
            is_mock, seed_batch, created_at, updated_at
        ) VALUES (
            :class_id, :user_id, :source_class_code, :status, :valid_from, :valid_to,
            FALSE, :seed_batch, NOW(), NOW()
        )
        ON CONFLICT (class_id, user_id, valid_from) DO UPDATE SET
            source_class_code = EXCLUDED.source_class_code,
            status = EXCLUDED.status,
            valid_to = EXCLUDED.valid_to,
            is_mock = FALSE,
            seed_batch = EXCLUDED.seed_batch,
            updated_at = NOW()
        RETURNING enrollment_id
        SQL
    );
    $enrollmentIds = [];
    foreach ($plan['memberships'] as $membership) {
        $userId = $userIds[$membership['email']] ?? null;
        $classId = $classIds[$membership['class_code']] ?? null;
        if ($userId === null || $classId === null) continue;
        $upsertEnrollment->execute([
            'class_id' => $classId,
            'user_id' => $userId,
            'source_class_code' => firestore_import_text(
                $plan['classes'][$membership['class_code']]['class_name'] ?? $membership['class_code'],
                50
            ),
            'status' => $membership['status'],
            'valid_from' => $membership['valid_from'],
            'valid_to' => $membership['valid_to'],
            'seed_batch' => $batch,
        ]);
        $enrollmentIds[$membership['email'] . '|' . $membership['class_code']] = (int)$upsertEnrollment->fetchColumn();
    }
    $counts['enrollments_upserted'] = count($enrollmentIds);

    $curriculumLabIds = [];
    $curriculumLabStmt = $pdo->prepare(
        'SELECT curriculum_lab_id, lab_id FROM curriculum_labs WHERE curriculum_id = :curriculum_id'
    );
    $curriculumLabStmt->execute(['curriculum_id' => $curriculumId]);
    foreach ($curriculumLabStmt->fetchAll() as $row) {
        $curriculumLabIds[(string)$row['lab_id']] = (string)$row['curriculum_lab_id'];
    }

    // Replace the portion owned by this Firestore batch. This removes obsolete
    // assignment contexts when source membership or catalog mapping changes and
    // makes a repeated import converge to the exact same state.
    $deleteAttempts = $pdo->prepare('DELETE FROM lab_attempts WHERE source_event_key LIKE :prefix');
    $deleteAttempts->execute(['prefix' => $attemptPrefix . '%']);
    $counts['old_firestore_attempts_deleted'] = $deleteAttempts->rowCount();

    $deleteAssignments = $pdo->prepare(
        <<<'SQL'
        DELETE FROM lab_assignments assignment
         USING class_enrollments enrollment
         WHERE assignment.enrollment_id = enrollment.enrollment_id
           AND enrollment.seed_batch = :batch
           AND assignment.assignment_source IN ('class_curriculum', 'legacy_observed')
           AND NOT EXISTS (
                SELECT 1
                  FROM lab_attempts remaining_attempt
                 WHERE remaining_attempt.assignment_id = assignment.assignment_id
           )
        SQL
    );
    $deleteAssignments->execute(['batch' => $batch]);
    $counts['old_firestore_assignments_deleted'] = $deleteAssignments->rowCount();

    $assignmentRows = [];
    foreach ($plan['assignments'] as $assignment) {
        $enrollmentId = $enrollmentIds[$assignment['email'] . '|' . $assignment['class_code']] ?? null;
        $curriculumLabId = $curriculumLabIds[$assignment['lab_id']] ?? null;
        $classId = $classIds[$assignment['class_code']] ?? null;
        if ($enrollmentId === null || $curriculumLabId === null || $classId === null) continue;
        $assignmentRows[] = [
            'enrollment_id' => $enrollmentId,
            'curriculum_lab_id' => $curriculumLabId,
            'assigned_at' => $assignment['assigned_at'],
            'status' => $assignment['status'],
            'first_pass_attempt_no' => null,
            'completed_at' => $assignment['completed_at'],
            'class_id_snapshot' => $classId,
            'assignment_source' => $assignment['assignment_source'],
            'is_inferred' => $assignment['is_inferred'],
        ];
    }
    $assignmentIdByContext = [];
    $upsertAssignmentsSql = <<<'SQL'
        INSERT INTO lab_assignments (
            enrollment_id, curriculum_lab_id, assigned_at, due_at, status,
            first_pass_attempt_no, first_try_evidence, completed_at,
            region_id_snapshot, class_id_snapshot, assignment_source,
            is_inferred, created_at, updated_at
        )
        SELECT imported.enrollment_id,
               imported.curriculum_lab_id,
               imported.assigned_at,
               NULL,
               imported.status,
               imported.first_pass_attempt_no,
               'unknown',
               imported.completed_at,
               NULL,
               imported.class_id_snapshot,
               imported.assignment_source,
               imported.is_inferred,
               NOW(),
               NOW()
          FROM jsonb_to_recordset(CAST(:rows AS jsonb)) AS imported(
               enrollment_id BIGINT,
               curriculum_lab_id UUID,
               assigned_at TIMESTAMPTZ,
               status VARCHAR(20),
               first_pass_attempt_no INTEGER,
               completed_at TIMESTAMPTZ,
               class_id_snapshot UUID,
               assignment_source VARCHAR(30),
               is_inferred BOOLEAN
          )
        ON CONFLICT (enrollment_id, curriculum_lab_id) DO UPDATE SET
            assigned_at = LEAST(lab_assignments.assigned_at, EXCLUDED.assigned_at),
            status = CASE
                WHEN lab_assignments.status = 'passed' THEN 'passed'
                WHEN lab_assignments.status = 'completed' OR EXCLUDED.status = 'completed' THEN 'completed'
                WHEN lab_assignments.status = 'in_progress' OR EXCLUDED.status = 'in_progress' THEN 'in_progress'
                ELSE EXCLUDED.status
            END,
            first_pass_attempt_no = CASE
                WHEN lab_assignments.status = 'passed' THEN lab_assignments.first_pass_attempt_no
                ELSE NULL
            END,
            completed_at = CASE
                WHEN lab_assignments.completed_at IS NULL THEN EXCLUDED.completed_at
                WHEN EXCLUDED.completed_at IS NULL THEN lab_assignments.completed_at
                ELSE LEAST(lab_assignments.completed_at, EXCLUDED.completed_at)
            END,
            first_try_evidence = 'unknown',
            updated_at = NOW()
        RETURNING assignment_id, enrollment_id, curriculum_lab_id
        SQL;
    $upsertAssignments = $pdo->prepare($upsertAssignmentsSql);
    foreach (array_chunk($assignmentRows, 500) as $chunk) {
        $upsertAssignments->execute([
            'rows' => json_encode($chunk, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
        ]);
        foreach ($upsertAssignments->fetchAll() as $row) {
            $assignmentIdByContext[(int)$row['enrollment_id'] . '|' . $row['curriculum_lab_id']] = (string)$row['assignment_id'];
        }
    }
    $counts['lab_assignments_upserted'] = count($assignmentRows);

    $timerRows = [];
    foreach ($plan['activities'] as $activity) {
        $timerRows[] = [
            'user_id' => $activity['email'] !== null ? ($userIds[$activity['email']] ?? null) : null,
            'name' => firestore_import_text($activity['name'], 100),
            'email' => firestore_import_text($activity['email'], 100),
            'started_at' => $activity['started_at'],
            'finished_at' => $activity['finished_at'],
            'duration_sec' => $activity['duration_sec'],
            'device' => firestore_import_text($activity['device_name'], 100),
            'device_id' => $activity['device_id'],
            'lab_id' => $activity['lab_id'],
            'lab_name' => firestore_import_text($activity['lab_name'], 150),
            'activity_mode' => $activity['mode'],
            'last_action' => $activity['last_action'],
            'seed_batch' => $batch,
            'seed_key' => $activity['source_key'],
        ];
    }
    $upsertTimers = $pdo->prepare(
        <<<'SQL'
        INSERT INTO timer_sessions (
            user_id, technician_id, name, email, started_at, finished_at,
            duration_sec, mode, device, device_id, lab_id, lab_name,
            session_type, status, completed_first_try, last_action,
            is_passed, is_mock, seed_batch, seed_key, created_at
        )
        SELECT imported.user_id, NULL, imported.name, imported.email,
               imported.started_at, imported.finished_at, imported.duration_sec,
               CASE WHEN imported.activity_mode = 'guide' THEN 'Hướng dẫn' ELSE 'Thực hành' END,
               imported.device, imported.device_id,
               imported.lab_id, imported.lab_name, imported.activity_mode, 'completed',
               NULL, imported.last_action, NULL, FALSE,
               imported.seed_batch, imported.seed_key,
               imported.finished_at
          FROM jsonb_to_recordset(CAST(:rows AS jsonb)) AS imported(
               user_id UUID, name VARCHAR(100), email VARCHAR(100),
               started_at TIMESTAMPTZ, finished_at TIMESTAMPTZ,
               duration_sec INTEGER, device VARCHAR(100), device_id VARCHAR(50),
               lab_id VARCHAR(50), lab_name VARCHAR(150), activity_mode VARCHAR(20), last_action TEXT,
               seed_batch VARCHAR(100), seed_key VARCHAR(200)
          )
        ON CONFLICT (seed_key) WHERE seed_key IS NOT NULL DO UPDATE SET
            user_id = EXCLUDED.user_id,
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            started_at = EXCLUDED.started_at,
            finished_at = EXCLUDED.finished_at,
            duration_sec = EXCLUDED.duration_sec,
            device = EXCLUDED.device,
            device_id = EXCLUDED.device_id,
            lab_id = EXCLUDED.lab_id,
            lab_name = EXCLUDED.lab_name,
            mode = EXCLUDED.mode,
            session_type = EXCLUDED.session_type,
            status = 'completed',
            completed_first_try = NULL,
            last_action = EXCLUDED.last_action,
            is_passed = NULL,
            is_mock = FALSE,
            seed_batch = EXCLUDED.seed_batch,
            created_at = EXCLUDED.created_at
        SQL
    );
    foreach (array_chunk($timerRows, 500) as $chunk) {
        $upsertTimers->execute([
            'rows' => json_encode($chunk, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
        ]);
    }
    $counts['timer_sessions_upserted'] = count($timerRows);

    $timerIds = [];
    $timerStmt = $pdo->prepare('SELECT id, seed_key FROM timer_sessions WHERE seed_batch = :batch');
    $timerStmt->execute(['batch' => $batch]);
    foreach ($timerStmt->fetchAll() as $row) $timerIds[(string)$row['seed_key']] = (int)$row['id'];

    $maxAttemptByAssignment = [];
    foreach ($pdo->query(
        'SELECT assignment_id, COALESCE(MAX(attempt_no), 0) AS max_no FROM lab_attempts GROUP BY assignment_id'
    )->fetchAll() as $row) {
        $maxAttemptByAssignment[(string)$row['assignment_id']] = (int)$row['max_no'];
    }
    $activities = $plan['activities'];
    usort($activities, static function (array $left, array $right): int {
        $leftKey = ($left['email'] ?? '') . '|' . ($left['class_code'] ?? '') . '|' . $left['lab_id']
            . '|' . $left['started_at'] . '|' . $left['source_key'];
        $rightKey = ($right['email'] ?? '') . '|' . ($right['class_code'] ?? '') . '|' . $right['lab_id']
            . '|' . $right['started_at'] . '|' . $right['source_key'];
        return strcmp($leftKey, $rightKey);
    });
    $attemptRows = [];
    $nextAttemptByAssignment = $maxAttemptByAssignment;
    foreach ($activities as $activity) {
        if ($activity['email'] === null || $activity['class_code'] === null) continue;
        $enrollmentId = $enrollmentIds[$activity['email'] . '|' . $activity['class_code']] ?? null;
        $curriculumLabId = $curriculumLabIds[$activity['lab_id']] ?? null;
        if ($enrollmentId === null || $curriculumLabId === null) continue;
        $assignmentId = $assignmentIdByContext[$enrollmentId . '|' . $curriculumLabId] ?? null;
        if ($assignmentId === null) continue;
        $attemptNo = ($nextAttemptByAssignment[$assignmentId] ?? 0) + 1;
        $nextAttemptByAssignment[$assignmentId] = $attemptNo;
        $attemptRows[] = [
            'assignment_id' => $assignmentId,
            'attempt_no' => $attemptNo,
            'started_at' => $activity['started_at'],
            'finished_at' => $activity['finished_at'],
            'duration_seconds' => $activity['duration_sec'],
            'activity_mode' => $activity['mode'],
            'error_count' => $activity['error_count'],
            'last_action' => $activity['last_action'],
            'source_event_key' => $activity['source_key'],
            'source_timer_session_id' => $timerIds[$activity['source_key']] ?? null,
            'metadata' => [
                'source' => 'firestore',
                'project_id' => $projectId,
                'collection' => 'activity_logs',
                'document_id' => $activity['source_id'],
                'completion_without_grade' => true,
            ],
        ];
    }
    $insertAttempts = $pdo->prepare(
        <<<'SQL'
        INSERT INTO lab_attempts (
            assignment_id, mode, attempt_no, status, outcome,
            started_at, finished_at, duration_seconds, score, error_count,
            last_action, source_event_key, source_timer_session_id,
            sequence_complete, metadata, created_at, updated_at
        )
        SELECT imported.assignment_id, imported.activity_mode, imported.attempt_no,
               'completed', NULL, imported.started_at, imported.finished_at,
               imported.duration_seconds, NULL, imported.error_count,
               imported.last_action, imported.source_event_key,
               imported.source_timer_session_id, FALSE, imported.metadata,
               NOW(), NOW()
          FROM jsonb_to_recordset(CAST(:rows AS jsonb)) AS imported(
               assignment_id UUID, attempt_no INTEGER, activity_mode VARCHAR(20),
               started_at TIMESTAMPTZ, finished_at TIMESTAMPTZ,
               duration_seconds INTEGER, error_count INTEGER,
               last_action TEXT, source_event_key VARCHAR(240),
               source_timer_session_id BIGINT, metadata JSONB
          )
        SQL
    );
    foreach (array_chunk($attemptRows, 500) as $chunk) {
        $insertAttempts->execute([
            'rows' => json_encode($chunk, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR),
        ]);
    }
    $counts['lab_attempts_inserted'] = count($attemptRows);

    $pdo->exec(
        <<<'SQL'
        UPDATE lab_assignments assignment
           SET status = CASE WHEN assignment.status = 'passed' THEN 'passed' ELSE 'completed' END,
               completed_at = CASE
                   WHEN assignment.completed_at IS NULL THEN aggregate.completed_at
                   ELSE LEAST(assignment.completed_at, aggregate.completed_at)
               END,
               first_try_evidence = 'unknown',
               updated_at = NOW()
          FROM (
                SELECT attempt.assignment_id,
                       MIN(attempt.finished_at) AS completed_at
                  FROM lab_attempts attempt
                 WHERE attempt.mode = 'practice'
                   AND attempt.status = 'completed'
                 GROUP BY attempt.assignment_id
          ) aggregate
         WHERE aggregate.assignment_id = assignment.assignment_id
           AND aggregate.completed_at IS NOT NULL
        SQL
    );

    // Completion becomes a pass only when a grading source explicitly says so.
    $pdo->exec(
        <<<'SQL'
        UPDATE lab_assignments assignment
           SET status = 'passed',
               completed_at = COALESCE(assignment.completed_at, aggregate.passed_at),
               passed_at = aggregate.passed_at,
               first_pass_attempt_no = aggregate.first_pass_attempt_no,
               first_try_evidence = CASE
                   WHEN aggregate.sequence_complete THEN 'derived_complete'
                   ELSE 'unknown'
               END,
               updated_at = NOW()
          FROM (
                SELECT attempt.assignment_id,
                       MIN(attempt.finished_at) AS passed_at,
                       MIN(attempt.attempt_no) AS first_pass_attempt_no,
                       BOOL_AND(attempt.sequence_complete) AS sequence_complete
                  FROM lab_attempts attempt
                 WHERE attempt.mode = 'practice'
                   AND attempt.outcome = 'passed'
                 GROUP BY attempt.assignment_id
          ) aggregate
         WHERE aggregate.assignment_id = assignment.assignment_id
        SQL
    );

    return $counts;
}

$options = getopt('', ['credentials:', 'batch::', 'execute', 'help']);
if (isset($options['help'])) {
    firestore_import_usage();
    exit(0);
}
$credentialPath = (string)($options['credentials'] ?? '');
if ($credentialPath === '') {
    firestore_import_usage();
    exit(1);
}
$execute = isset($options['execute']);

try {
    $reader = FirestoreRestReader::fromCredentialFile($credentialPath);
    $batch = trim((string)($options['batch'] ?? ('firestore-' . $reader->projectId())));
    if (!preg_match('/^[A-Za-z0-9._-]{1,100}$/D', $batch)) {
        throw new InvalidArgumentException('Batch may contain only letters, digits, dot, underscore and dash.');
    }
    $pdo = create_database_connection();
    $plan = firestore_import_build_plan($pdo, $reader, $batch);
    firestore_import_print_plan($plan);
    if (!$execute) {
        echo "Dry run complete; Firestore and PostgreSQL were not changed.\n";
        exit(0);
    }

    $pdo->beginTransaction();
    try {
        $lock = $pdo->prepare("SELECT pg_advisory_xact_lock(hashtext(:lock_name))");
        $lock->execute(['lock_name' => 'ftc_firestore_import:' . $reader->projectId()]);
        $counts = firestore_import_execute($pdo, $plan);
        foreach ($counts as $key => $value) echo "imported.$key=$value" . PHP_EOL;
        $pdo->commit();
        echo "Firestore import committed successfully.\n";
    } catch (Throwable $exception) {
        if ($pdo->inTransaction()) $pdo->rollBack();
        throw $exception;
    }
} catch (Throwable $exception) {
    firestore_import_fail($exception->getMessage());
}
