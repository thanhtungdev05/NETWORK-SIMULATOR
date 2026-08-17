<?php
declare(strict_types=1);

const EMPLOYEE_WORKBOOK_HEADERS = [
    'maNV',
    'hoTen',
    'email',
    'chucVu',
    'thoiGianFrom',
    'thoiGianTo',
    'ghiChuXepLop',
    'daNghiViec',
    'ngayNghi',
    'lyDoNghiViec',
    'maDonVi',
    'tenDonVi',
    'tenVung',
    'tenChiNhanh',
];

const EMPLOYEE_DASHBOARD_REGIONS = [
    'PNCDNB' => 'DNB',
    'PNCHCM' => 'HCM',
    'PNCTDDT' => 'TDDT - PNC',
    'PNCTNB' => 'TNB',
    'PNCTNMT' => 'TNMT - PNC',
    'TINDBB' => 'DBB',
    'TINHNI' => 'HNI',
    'TINTBB' => 'TBB',
    'TINTDDT' => 'TDDT - TIN',
    'TINTNMT' => 'TNMT - TIN',
];

const EMPLOYEE_DEMO_CLASS_REGION_CODES = [
    'DNB' => 'DNB',
    'HCM' => 'HCM',
    'TDDT - PNC' => 'TDDT-PNC',
    'TNB' => 'TNB',
    'TNMT - PNC' => 'TNMT-PNC',
    'DBB' => 'DBB',
    'HNI' => 'HNI',
    'TBB' => 'TBB',
    'TDDT - TIN' => 'TDDT-TIN',
    'TNMT - TIN' => 'TNMT-TIN',
];

function employee_workbook_column_index(string $reference): int
{
    if (!preg_match('/^([A-Z]+)/i', $reference, $matches)) {
        throw new RuntimeException('Invalid XLSX cell reference: ' . $reference);
    }
    $index = 0;
    foreach (str_split(strtoupper($matches[1])) as $character) {
        $index = ($index * 26) + (ord($character) - 64);
    }
    return $index - 1;
}

function employee_workbook_relationships(ZipArchive $zip, string $path): array
{
    $contents = $zip->getFromName($path);
    if ($contents === false) {
        throw new RuntimeException("XLSX relationship file is missing: $path");
    }
    $xml = simplexml_load_string($contents);
    if (!$xml) {
        throw new RuntimeException("Unable to parse XLSX relationship file: $path");
    }
    $map = [];
    foreach ($xml->Relationship as $relationship) {
        $attributes = $relationship->attributes();
        $map[(string)$attributes['Id']] = (string)$attributes['Target'];
    }
    return $map;
}

function employee_workbook_shared_strings(ZipArchive $zip): array
{
    $contents = $zip->getFromName('xl/sharedStrings.xml');
    if ($contents === false) {
        return [];
    }
    $reader = new XMLReader();
    if (!$reader->XML($contents, null, LIBXML_NONET | LIBXML_COMPACT)) {
        throw new RuntimeException('Unable to parse XLSX shared strings.');
    }
    $strings = [];
    while ($reader->read()) {
        if ($reader->nodeType !== XMLReader::ELEMENT || $reader->localName !== 'si') {
            continue;
        }
        $node = $reader->expand();
        if (!$node) {
            continue;
        }
        $text = '';
        foreach ($node->getElementsByTagName('t') as $part) {
            $text .= $part->textContent;
        }
        $strings[] = $text;
    }
    $reader->close();
    return $strings;
}

function employee_workbook_first_sheet_path(ZipArchive $zip): string
{
    $workbookXml = $zip->getFromName('xl/workbook.xml');
    if ($workbookXml === false) {
        throw new RuntimeException('The XLSX workbook descriptor is missing.');
    }
    $workbook = simplexml_load_string($workbookXml);
    if (!$workbook) {
        throw new RuntimeException('Unable to parse the XLSX workbook descriptor.');
    }
    $namespaces = $workbook->getNamespaces(true);
    $relationshipsNamespace = $namespaces['r'] ?? 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';
    $sheets = $workbook->sheets->sheet ?? [];
    if (count($sheets) < 1) {
        throw new RuntimeException('The XLSX workbook does not contain a worksheet.');
    }
    $attributes = $sheets[0]->attributes($relationshipsNamespace);
    $relationshipId = (string)$attributes['id'];
    $relationships = employee_workbook_relationships($zip, 'xl/_rels/workbook.xml.rels');
    $target = $relationships[$relationshipId] ?? null;
    if (!$target) {
        throw new RuntimeException('Unable to resolve the first XLSX worksheet.');
    }
    $target = str_replace('\\', '/', $target);
    if (str_starts_with($target, '/')) {
        return ltrim($target, '/');
    }
    while (str_starts_with($target, '../')) {
        $target = substr($target, 3);
    }
    return str_starts_with($target, 'xl/') ? $target : 'xl/' . $target;
}

function employee_workbook_uses_1904_dates(ZipArchive $zip): bool
{
    $contents = $zip->getFromName('xl/workbook.xml');
    if ($contents === false) {
        throw new RuntimeException('The XLSX workbook descriptor is missing.');
    }
    $workbook = simplexml_load_string($contents);
    if (!$workbook) {
        throw new RuntimeException('Unable to parse the XLSX workbook descriptor.');
    }
    $value = strtolower(trim((string)($workbook->workbookPr['date1904'] ?? '0')));
    return in_array($value, ['1', 'true'], true);
}

function employee_workbook_cell_value(DOMElement $cell, array $sharedStrings): string
{
    $type = $cell->getAttribute('t');
    if ($type === 'inlineStr') {
        $value = '';
        foreach ($cell->getElementsByTagName('t') as $part) {
            $value .= $part->textContent;
        }
        return $value;
    }
    $valueNodes = $cell->getElementsByTagName('v');
    $raw = $valueNodes->length ? $valueNodes->item(0)->textContent : '';
    if ($type === 's') {
        return $sharedStrings[(int)$raw] ?? '';
    }
    if ($type === 'b') {
        return $raw === '1' ? 'TRUE' : 'FALSE';
    }
    return $raw;
}

function employee_excel_date(mixed $value, bool $uses1904Dates = false): ?string
{
    if ($value === null || $value === '') {
        return null;
    }
    if (is_numeric($value)) {
        $serial = (float)$value;
        if ($serial <= 0) {
            return null;
        }
        $days = (int)floor($serial);
        $epoch = $uses1904Dates ? '1904-01-01' : '1899-12-30';
        $date = (new DateTimeImmutable($epoch, new DateTimeZone('UTC')))->modify("+$days days");
        return $date->format('Y-m-d');
    }
    $text = trim((string)$value);
    if ($text === '') {
        return null;
    }
    $formats = [
        ['!Y-m-d', 'Y-m-d'],
        ['!d/m/Y', 'd/m/Y'],
        ['!Y-m-d H:i:s', 'Y-m-d H:i:s'],
    ];
    foreach ($formats as [$format, $comparisonFormat]) {
        $date = DateTimeImmutable::createFromFormat($format, $text, new DateTimeZone('UTC'));
        $errors = DateTimeImmutable::getLastErrors();
        $valid = $errors === false || ($errors['warning_count'] === 0 && $errors['error_count'] === 0);
        if ($date && $valid && $date->format($comparisonFormat) === $text) {
            return $date->format('Y-m-d');
        }
    }
    throw new RuntimeException('Invalid employee date value: ' . $text);
}

function employee_boolean(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }
    $normalized = strtolower(trim((string)$value));
    if (in_array($normalized, ['1', 'true', 'yes', 'y', 'có', 'co'], true)) {
        return true;
    }
    if (in_array($normalized, ['0', 'false', 'no', 'n', 'không', 'khong'], true)) {
        return false;
    }
    throw new RuntimeException('Invalid employee boolean value: ' . (string)$value);
}

function employee_nullable_text(mixed $value): ?string
{
    $text = trim((string)$value);
    return $text === '' ? null : $text;
}

function employee_normalize_workbook_row(array $row, int $rowNumber, bool $uses1904Dates = false): array
{
    $employeeId = trim((string)($row['maNV'] ?? ''));
    $email = strtolower(trim((string)($row['email'] ?? '')));
    $displayName = trim((string)($row['hoTen'] ?? ''));
    $sourceRegion = strtoupper(trim((string)($row['tenVung'] ?? '')));
    if (!preg_match('/^\d{8}$/', $employeeId)) {
        throw new RuntimeException("Row $rowNumber has an invalid maNV; expected exactly 8 digits.");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException("Row $rowNumber has an invalid email.");
    }
    if ($displayName === '') {
        throw new RuntimeException("Row $rowNumber has an empty hoTen.");
    }
    if (!isset(EMPLOYEE_DASHBOARD_REGIONS[$sourceRegion])) {
        throw new RuntimeException("Row $rowNumber has an unsupported tenVung: $sourceRegion");
    }
    return [
        'employee_id' => $employeeId,
        'display_name' => $displayName,
        'email' => $email,
        'job_title' => employee_nullable_text($row['chucVu'] ?? null),
        'training_start_date' => employee_excel_date($row['thoiGianFrom'] ?? null, $uses1904Dates),
        'training_end_date' => employee_excel_date($row['thoiGianTo'] ?? null, $uses1904Dates),
        'class_code' => employee_nullable_text($row['ghiChuXepLop'] ?? null),
        'is_terminated' => employee_boolean($row['daNghiViec'] ?? false),
        'termination_date' => employee_excel_date($row['ngayNghi'] ?? null, $uses1904Dates),
        'termination_reason' => employee_nullable_text($row['lyDoNghiViec'] ?? null),
        'unit_code' => employee_nullable_text($row['maDonVi'] ?? null),
        'unit_name' => employee_nullable_text($row['tenDonVi'] ?? null),
        'region_code' => $sourceRegion,
        'branch_code' => employee_nullable_text($row['tenChiNhanh'] ?? null),
        'dashboard_region' => EMPLOYEE_DASHBOARD_REGIONS[$sourceRegion],
        'source_row' => $rowNumber,
    ];
}

function read_employee_workbook(string $path): array
{
    if (!is_file($path)) {
        throw new RuntimeException('Employee workbook not found: ' . $path);
    }
    $zip = new ZipArchive();
    if ($zip->open($path) !== true) {
        throw new RuntimeException('Unable to open employee workbook: ' . $path);
    }
    try {
        $sharedStrings = employee_workbook_shared_strings($zip);
        $uses1904Dates = employee_workbook_uses_1904_dates($zip);
        $sheetPath = employee_workbook_first_sheet_path($zip);
        $sheetXml = $zip->getFromName($sheetPath);
        if ($sheetXml === false) {
            throw new RuntimeException('The first XLSX worksheet is missing: ' . $sheetPath);
        }
        $reader = new XMLReader();
        if (!$reader->XML($sheetXml, null, LIBXML_NONET | LIBXML_COMPACT)) {
            throw new RuntimeException('Unable to parse the employee worksheet.');
        }
        $headers = [];
        $records = [];
        while ($reader->read()) {
            if ($reader->nodeType !== XMLReader::ELEMENT || $reader->localName !== 'row') {
                continue;
            }
            $rowNumber = (int)($reader->getAttribute('r') ?: 0);
            $node = $reader->expand();
            if (!$node) {
                continue;
            }
            $values = [];
            foreach ($node->getElementsByTagName('c') as $cell) {
                if (!$cell instanceof DOMElement) {
                    continue;
                }
                $index = employee_workbook_column_index($cell->getAttribute('r'));
                $values[$index] = employee_workbook_cell_value($cell, $sharedStrings);
            }
            if ($rowNumber === 1) {
                ksort($values);
                $headers = array_values($values);
                if ($headers !== EMPLOYEE_WORKBOOK_HEADERS) {
                    throw new RuntimeException('Unexpected employee workbook headers: ' . implode(', ', $headers));
                }
                continue;
            }
            if (!$headers || !$values) {
                continue;
            }
            $row = [];
            foreach ($headers as $index => $header) {
                $row[$header] = $values[$index] ?? '';
            }
            $records[] = employee_normalize_workbook_row($row, $rowNumber, $uses1904Dates);
        }
        $reader->close();
        return $records;
    } finally {
        $zip->close();
    }
}

function employee_hash_int(string $value): int
{
    return (int)hexdec(substr(hash('sha256', $value), 0, 7));
}

function select_employee_roster(array $employees, int $count, string $batch): array
{
    $regions = array_values(EMPLOYEE_DASHBOARD_REGIONS);
    if ($count < count($regions) || $count % count($regions) !== 0) {
        throw new InvalidArgumentException('The seed count must be a positive multiple of ' . count($regions) . ' for balanced dashboard coverage.');
    }
    $eligible = [];
    $seenEmployees = [];
    $seenEmails = [];
    foreach ($employees as $employee) {
        if (($employee['is_terminated'] ?? true) || ($employee['job_title'] ?? '') !== 'CB Kỹ thuật TKBT') {
            continue;
        }
        if (
            !empty($employee['training_start_date'])
            && !empty($employee['training_end_date'])
            && $employee['training_start_date'] > $employee['training_end_date']
        ) {
            throw new RuntimeException('Active employee ' . $employee['employee_id'] . ' has training_start_date after training_end_date.');
        }
        if (isset($seenEmployees[$employee['employee_id']]) || isset($seenEmails[$employee['email']])) {
            throw new RuntimeException('The employee workbook contains duplicate employee IDs or emails.');
        }
        $seenEmployees[$employee['employee_id']] = true;
        $seenEmails[$employee['email']] = true;
        $eligible[$employee['dashboard_region']][] = $employee;
    }
    $perRegion = intdiv($count, count($regions));
    $selected = [];
    foreach ($regions as $region) {
        $pool = $eligible[$region] ?? [];
        usort($pool, static fn(array $left, array $right): int =>
            strcmp(hash('sha256', "$batch|{$left['employee_id']}"), hash('sha256', "$batch|{$right['employee_id']}"))
        );
        if (count($pool) < $perRegion) {
            throw new RuntimeException("Region $region has only " . count($pool) . " eligible KTV; $perRegion required.");
        }
        array_push($selected, ...array_slice($pool, 0, $perRegion));
    }
    usort($selected, static fn(array $left, array $right): int => strcmp($left['employee_id'], $right['employee_id']));
    return $selected;
}

function plan_employee_training_classes(
    array $employees,
    string $batch,
    DateTimeImmutable $anchor,
    int $classSize = 10
): array {
    if ($classSize < 1 || $classSize > 100) {
        throw new InvalidArgumentException('classSize must be between 1 and 100.');
    }

    $byRegion = [];
    foreach ($employees as $employee) {
        $region = (string)($employee['dashboard_region'] ?? '');
        if (!isset(EMPLOYEE_DEMO_CLASS_REGION_CODES[$region])) {
            throw new RuntimeException("Cannot create a demo class for unknown dashboard region: $region");
        }
        $byRegion[$region][] = $employee;
    }

    $classes = [];
    $enrollments = [];
    $cohortCode = $anchor->format('ym');
    $startDate = $anchor->modify('first day of -2 months')->format('Y-m-d');
    $endDate = $anchor->modify('last day of +1 month')->format('Y-m-d');

    foreach (array_values(EMPLOYEE_DASHBOARD_REGIONS) as $region) {
        $regionEmployees = $byRegion[$region] ?? [];
        if (!$regionEmployees) {
            continue;
        }
        usort($regionEmployees, static function (array $left, array $right): int {
            $leftKey = implode('|', [
                $left['unit_code'] ?? '',
                $left['class_code'] ?? '',
                $left['employee_id'] ?? '',
            ]);
            $rightKey = implode('|', [
                $right['unit_code'] ?? '',
                $right['class_code'] ?? '',
                $right['employee_id'] ?? '',
            ]);
            return strcmp($leftKey, $rightKey);
        });

        $classCount = (int)ceil(count($regionEmployees) / $classSize);
        if ($classCount > 26) {
            throw new RuntimeException("Region $region requires more than 26 demo classes.");
        }
        $regionCode = EMPLOYEE_DEMO_CLASS_REGION_CODES[$region];
        for ($classIndex = 0; $classIndex < $classCount; $classIndex++) {
            $suffix = chr(ord('A') + $classIndex);
            $classCode = "SIM-$cohortCode-$regionCode-$suffix";
            $classes[$classCode] = [
                'class_code' => $classCode,
                'class_name' => "Lớp giả lập $region - $suffix",
                'region_name' => $region,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'capacity' => $classSize,
                'status' => 'active',
                'seed_batch' => $batch,
            ];
        }

        // The source list is grouped by unit/source class. Round-robin keeps
        // both demo classes balanced instead of placing one source group in a
        // single class.
        foreach ($regionEmployees as $index => $employee) {
            $suffix = chr(ord('A') + ($index % $classCount));
            $classCode = "SIM-$cohortCode-$regionCode-$suffix";
            $enrollments[] = [
                'class_code' => $classCode,
                'employee_id' => $employee['employee_id'],
                'source_class_code' => $employee['class_code'] ?: null,
                'valid_from' => $startDate,
                'seed_batch' => $batch,
            ];
        }
    }

    return [
        'classes' => array_values($classes),
        'enrollments' => $enrollments,
    ];
}

function plan_employee_session_outcome(
    string $seed,
    DateTimeImmutable $occurredAt,
    string $mode
): array {
    $month = (int)$occurredAt->format('n');
    $completionTarget = match ($month) {
        6 => 76,
        7 => 82,
        8 => 88,
        default => 80,
    };
    $firstTryTarget = match ($month) {
        6 => 68,
        7 => 74,
        8 => 80,
        default => 72,
    };

    // Guided sessions describe following the walkthrough, not assessment.
    // They remain useful activity data but do not carry a first-try outcome.
    if ($mode === 'Hướng dẫn') {
        $guideRoll = employee_hash_int($seed . '|guide-status') % 100;
        if ($guideRoll < 92) {
            return ['status' => 'completed', 'completed_first_try' => null];
        }
        return [
            'status' => $guideRoll < 97 ? 'in_progress' : 'abandoned',
            'completed_first_try' => null,
        ];
    }

    $statusRoll = employee_hash_int($seed . '|status') % 100;
    if ($statusRoll < $completionTarget) {
        return [
            'status' => 'completed',
            'completed_first_try' => employee_hash_int($seed . '|first') % 100 < $firstTryTarget,
        ];
    }
    if ($statusRoll < $completionTarget + 7) {
        return ['status' => 'failed', 'completed_first_try' => null];
    }
    if ($statusRoll < $completionTarget + 13) {
        return ['status' => 'in_progress', 'completed_first_try' => null];
    }
    return ['status' => 'abandoned', 'completed_first_try' => null];
}

function plan_employee_lab_sessions(array $employees, array $labs, string $batch, DateTimeImmutable $anchor): array
{
    if (count($labs) < 20) {
        throw new RuntimeException('The lab catalog must contain at least 20 labs before seeding.');
    }
    $sessions = [];
    foreach ($employees as $employeeIndex => $employee) {
        $employeeId = $employee['employee_id'];
        $rankedLabs = $labs;
        usort($rankedLabs, static fn(array $left, array $right): int =>
            strcmp(
                hash('sha256', "$batch|$employeeId|{$left['lab_id']}"),
                hash('sha256', "$batch|$employeeId|{$right['lab_id']}")
            )
        );
        $sessionCount = 10 + (employee_hash_int("$batch|$employeeId|count") % 11);
        foreach (array_slice($rankedLabs, 0, $sessionCount) as $ordinal => $lab) {
            $seed = "$batch|$employeeId|$ordinal";
            $daysBack = employee_hash_int($seed . '|day') % 59;
            $hour = 8 + (employee_hash_int($seed . '|hour') % 10);
            $minute = employee_hash_int($seed . '|minute') % 60;
            $duration = 180 + (employee_hash_int($seed . '|duration') % 1621);
            $finishedAt = $anchor
                ->setTime($hour, $minute, 0)
                ->modify("-$daysBack days");
            $startedAt = $finishedAt->modify("-$duration seconds");
            $mode = $ordinal % 4 === 0 ? 'Hướng dẫn' : 'Thực hành';
            $outcome = plan_employee_session_outcome($seed, $finishedAt, $mode);
            $isInProgress = $outcome['status'] === 'in_progress';
            $lastAction = match ($outcome['status']) {
                'completed' => $mode === 'Hướng dẫn'
                    ? 'Hoàn thành luồng hướng dẫn'
                    : 'Save & Apply cấu hình cuối',
                'failed' => 'Nộp cấu hình nhưng chưa đạt yêu cầu',
                'in_progress' => 'Đang thực hiện cấu hình',
                default => 'Rời phiên trước khi hoàn thành',
            };
            $sessions[] = [
                'seed_key' => "$batch:$employeeId:" . ($ordinal + 1),
                'seed_batch' => $batch,
                'employee_id' => $employeeId,
                'email' => $employee['email'],
                'name' => $employee['display_name'],
                'started_at' => $startedAt->format(DateTimeInterface::ATOM),
                'finished_at' => $isInProgress ? null : $finishedAt->format(DateTimeInterface::ATOM),
                'duration_sec' => $duration,
                'mode' => $mode,
                'device' => $lab['device_name'],
                'lab_id' => $lab['lab_id'],
                'lab_name' => $lab['lab_name'],
                'status' => $outcome['status'],
                'completed_first_try' => $outcome['completed_first_try'],
                'last_action' => $lastAction,
            ];
        }
    }
    return $sessions;
}
