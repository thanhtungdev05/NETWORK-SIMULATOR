<?php
declare(strict_types=1);

const KTV_ROSTER_IMPORT_SOURCE = 'ktv_roster_import';

const KTV_ROSTER_REQUIRED_HEADERS = [
    'Empl ID' => 'employee_id',
    'Name' => 'display_name',
    'Email' => 'email',
    'Job Title (VN)' => 'job_title',
    'Branch' => 'branch',
    'Parent Department' => 'parent_department',
    'Child Department 1' => 'child_department_1',
    'Child Department 2' => 'child_department_2',
    'Ghi chú xếp lớp' => 'class_code',
];

const KTV_ROSTER_DASHBOARD_REGIONS = [
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

function ktv_roster_column_index(string $reference): int
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

function ktv_roster_relationships(ZipArchive $zip, string $path): array
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

function ktv_roster_shared_strings(ZipArchive $zip): array
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

function ktv_roster_first_sheet_path(ZipArchive $zip): string
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
    $relationships = ktv_roster_relationships($zip, 'xl/_rels/workbook.xml.rels');
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

function ktv_roster_uses_1904_dates(ZipArchive $zip): bool
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

function ktv_roster_cell_value(DOMElement $cell, array $sharedStrings): string
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

function ktv_roster_nullable_text(mixed $value, int $maximumLength = 500): ?string
{
    $text = trim((string)$value);
    if ($text === '') {
        return null;
    }
    $length = function_exists('mb_strlen') ? mb_strlen($text) : strlen($text);
    if ($length > $maximumLength) {
        throw new RuntimeException('Text value exceeds the maximum length.');
    }
    return $text;
}

function ktv_roster_excel_date(mixed $value, bool $uses1904Dates = false): ?string
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
        return (new DateTimeImmutable($epoch, new DateTimeZone('UTC')))
            ->modify("+$days days")
            ->format('Y-m-d');
    }

    $text = trim((string)$value);
    if ($text === '') {
        return null;
    }
    $formats = [
        ['!Y-m-d', 'Y-m-d'],
        ['!d/m/Y', 'd/m/Y'],
        ['!d-m-Y', 'd-m-Y'],
        ['!d/m/y', 'd/m/y'],
        ['!d-m-y', 'd-m-y'],
        ['!Y-m-d H:i:s', 'Y-m-d H:i:s'],
        ['!d/m/Y H:i:s', 'd/m/Y H:i:s'],
    ];
    foreach ($formats as [$format, $comparisonFormat]) {
        $date = DateTimeImmutable::createFromFormat($format, $text, new DateTimeZone('UTC'));
        $errors = DateTimeImmutable::getLastErrors();
        $valid = $errors === false || ($errors['warning_count'] === 0 && $errors['error_count'] === 0);
        if ($date && $valid && $date->format($comparisonFormat) === $text) {
            return $date->format('Y-m-d');
        }
    }

    throw new RuntimeException('Invalid date value: ' . $text);
}

function ktv_roster_normalize_row(array $row, int $rowNumber, bool $uses1904Dates = false): array
{
    $employeeId = trim((string)($row['employee_id'] ?? ''));
    $email = strtolower(trim((string)($row['email'] ?? '')));
    $displayName = trim((string)($row['display_name'] ?? ''));
    $sourceRegion = strtoupper(trim((string)($row['parent_department'] ?? '')));

    if (!preg_match('/^\d{8}$/', $employeeId)) {
        throw new RuntimeException("Row $rowNumber has invalid Empl ID; expected exactly 8 digits.");
    }
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new RuntimeException("Row $rowNumber has invalid Email.");
    }
    if ($displayName === '') {
        throw new RuntimeException("Row $rowNumber has empty Name.");
    }
    if (!isset(KTV_ROSTER_DASHBOARD_REGIONS[$sourceRegion])) {
        throw new RuntimeException("Row $rowNumber has unsupported Parent Department: $sourceRegion.");
    }

    $childDepartment2 = ktv_roster_nullable_text($row['child_department_2'] ?? null, 100);
    $childDepartment1 = ktv_roster_nullable_text($row['child_department_1'] ?? null, 100);
    $unitCode = $childDepartment2 ?: $childDepartment1;

    return [
        'employee_id' => $employeeId,
        'display_name' => $displayName,
        'email' => $email,
        'job_title' => ktv_roster_nullable_text($row['job_title'] ?? null),
        'branch' => ktv_roster_nullable_text($row['branch'] ?? null, 100),
        'parent_department' => $sourceRegion,
        'child_department_1' => $childDepartment1,
        'child_department_2' => $childDepartment2,
        'class_code' => ktv_roster_nullable_text($row['class_code'] ?? null, 50),
        'unit_code' => $unitCode,
        'unit_name' => $unitCode,
        'region_code' => $sourceRegion,
        'dashboard_region' => KTV_ROSTER_DASHBOARD_REGIONS[$sourceRegion],
        'source_row' => $rowNumber,
    ];
}

function parse_ktv_roster_xlsx(string $path): array
{
    if (!is_file($path)) {
        throw new RuntimeException('KTV roster workbook not found: ' . $path);
    }
    if (!class_exists(ZipArchive::class)) {
        throw new RuntimeException('PHP ZipArchive extension is required to read XLSX files.');
    }

    $zip = new ZipArchive();
    if ($zip->open($path) !== true) {
        throw new RuntimeException('Unable to open KTV roster workbook: ' . $path);
    }

    try {
        $sharedStrings = ktv_roster_shared_strings($zip);
        $uses1904Dates = ktv_roster_uses_1904_dates($zip);
        $sheetPath = ktv_roster_first_sheet_path($zip);
        $sheetXml = $zip->getFromName($sheetPath);
        if ($sheetXml === false) {
            throw new RuntimeException('The first XLSX worksheet is missing: ' . $sheetPath);
        }

        $reader = new XMLReader();
        if (!$reader->XML($sheetXml, null, LIBXML_NONET | LIBXML_COMPACT)) {
            throw new RuntimeException('Unable to parse the KTV roster worksheet.');
        }

        $headerFieldsByIndex = [];
        $headers = [];
        $rows = [];
        $errors = [];
        $seenEmployeeIds = [];
        $seenEmails = [];
        $totalRows = 0;

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
                $index = ktv_roster_column_index($cell->getAttribute('r'));
                $values[$index] = ktv_roster_cell_value($cell, $sharedStrings);
            }

            if ($rowNumber === 1) {
                foreach ($values as $index => $value) {
                    $header = trim((string)$value);
                    $headers[$index] = $header;
                    if (isset(KTV_ROSTER_REQUIRED_HEADERS[$header])) {
                        $headerFieldsByIndex[$index] = KTV_ROSTER_REQUIRED_HEADERS[$header];
                    }
                }
                $missing = [];
                foreach (KTV_ROSTER_REQUIRED_HEADERS as $header => $field) {
                    if (!in_array($field, $headerFieldsByIndex, true)) {
                        $missing[] = $header;
                    }
                }
                if ($missing) {
                    $errors[] = [
                        'row' => 1,
                        'message' => 'Missing required headers: ' . implode(', ', $missing),
                    ];
                    break;
                }
                continue;
            }

            if (!$headerFieldsByIndex || !$values) {
                continue;
            }
            $hasValue = false;
            foreach ($values as $value) {
                if (trim((string)$value) !== '') {
                    $hasValue = true;
                    break;
                }
            }
            if (!$hasValue) {
                continue;
            }
            $totalRows++;

            $raw = [];
            foreach ($headerFieldsByIndex as $index => $field) {
                $raw[$field] = $values[$index] ?? '';
            }

            try {
                $normalized = ktv_roster_normalize_row($raw, $rowNumber, $uses1904Dates);
                if (isset($seenEmployeeIds[$normalized['employee_id']])) {
                    throw new RuntimeException("Row $rowNumber duplicates Empl ID {$normalized['employee_id']}.");
                }
                if (isset($seenEmails[$normalized['email']])) {
                    throw new RuntimeException("Row $rowNumber duplicates Email {$normalized['email']}.");
                }
                $seenEmployeeIds[$normalized['employee_id']] = true;
                $seenEmails[$normalized['email']] = true;
                $rows[] = $normalized;
            } catch (Throwable $exception) {
                $errors[] = [
                    'row' => $rowNumber,
                    'message' => $exception->getMessage(),
                ];
            }
        }
        $reader->close();

        return [
            'headers' => array_values($headers),
            'rows' => $rows,
            'errors' => $errors,
            'totalRows' => $totalRows,
        ];
    } finally {
        $zip->close();
    }
}

function ktv_roster_database_boolean(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }
    if (is_int($value)) {
        return $value === 1;
    }
    return in_array(strtolower(trim((string)$value)), ['1', 't', 'true', 'yes', 'y', 'on'], true);
}

function ktv_roster_compact_change(array $row): array
{
    return [
        'employee_id' => $row['employee_id'] ?? null,
        'display_name' => $row['display_name'] ?? null,
        'email' => $row['email'] ?? null,
        'region' => $row['dashboard_region'] ?? null,
        'branch' => $row['branch'] ?? null,
        'class_code' => $row['class_code'] ?? null,
        'source_row' => $row['source_row'] ?? null,
    ];
}

function ktv_roster_resolve_region(PDO $pdo, array $row, bool $dryRun = false): ?string
{
    $regionCode = (string)$row['region_code'];
    $dashboardRegion = (string)$row['dashboard_region'];
    $branchName = $row['branch'] ?: null;

    if ($dryRun) {
        $stmt = $pdo->prepare(
            'SELECT region_id
               FROM regions
              WHERE region_code = :rc_code
                 OR BTRIM(COALESCE(dashboard_group, \'\')) = BTRIM(:dg_name)
                 OR BTRIM(region_name) = BTRIM(:rg_name)
              ORDER BY CASE WHEN region_code = :rc_code2 THEN 0 ELSE 1 END,
                       region_code
              LIMIT 1'
        );
        $stmt->execute([
            'rc_code' => $regionCode,
            'dg_name' => $dashboardRegion,
            'rg_name' => $dashboardRegion,
            'rc_code2' => $regionCode,
        ]);
        $regionId = $stmt->fetchColumn();
        return is_string($regionId) && $regionId !== '' ? $regionId : null;
    }

    $stmt = $pdo->prepare(
        <<<'SQL'
        INSERT INTO regions (
            region_code, region_name, dashboard_group, branch_name,
            is_active, created_at, updated_at
        ) VALUES (
            :region_code, :region_name, :dashboard_group, :branch_name,
            TRUE, NOW(), NOW()
        )
        ON CONFLICT (region_code) DO UPDATE SET
            region_name = EXCLUDED.region_name,
            dashboard_group = COALESCE(EXCLUDED.dashboard_group, regions.dashboard_group),
            branch_name = COALESCE(EXCLUDED.branch_name, regions.branch_name),
            is_active = TRUE,
            updated_at = NOW()
        RETURNING region_id
        SQL
    );
    $stmt->execute([
        'region_code' => $regionCode,
        'region_name' => $dashboardRegion,
        'dashboard_group' => $dashboardRegion,
        'branch_name' => $branchName,
    ]);
    $regionId = $stmt->fetchColumn();
    return is_string($regionId) && $regionId !== '' ? $regionId : null;
}

function ktv_roster_find_matching_user(PDO $pdo, array $row, bool $forUpdate): array
{
    $sql = 'SELECT user_id, email, employee_id, display_name, is_terminated, employee_source
              FROM users
             WHERE employee_id = :employee_id
                OR LOWER(email) = LOWER(:email)';
    if ($forUpdate) {
        $sql .= ' FOR UPDATE';
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        'employee_id' => $row['employee_id'],
        'email' => $row['email'],
    ]);
    return $stmt->fetchAll();
}

function sync_ktv_roster(PDO $pdo, array $rows, string $batch, bool $dryRun = false): array
{
    $result = [
        'batch_id' => $batch,
        'dryRun' => $dryRun,
        'dry_run' => $dryRun,
        'totalRows' => count($rows),
        'total_rows' => count($rows),
        'inserted' => 0,
        'updated' => 0,
        'terminated' => 0,
        'reactivated' => 0,
        'errors' => [],
        'changes' => [
            'inserted' => [],
            'updated' => [],
            'terminated' => [],
            'reactivated' => [],
        ],
    ];

    $activeEmployeeIds = [];
    $activeEmails = [];

    $insertUser = null;
    $updateUser = null;
    if (!$dryRun) {
        $insertUser = $pdo->prepare(
            <<<'SQL'
            INSERT INTO users (
                email, display_name, role, iam_profile,
                employee_id, job_title,
                class_code, is_terminated, termination_date, termination_reason,
                unit_code, unit_name, region_code, dashboard_region, region_id,
                employee_source, employee_seed_batch, employee_synced_at,
                created_at, updated_at
            ) VALUES (
                :email, :display_name, 'KTV', '{}'::jsonb,
                :employee_id, :job_title,
                :class_code, FALSE, NULL, NULL,
                :unit_code, :unit_name, :region_code, :dashboard_region, :region_id,
                :employee_source, :employee_seed_batch, NOW(),
                NOW(), NOW()
            )
            SQL
        );
        $updateUser = $pdo->prepare(
            <<<'SQL'
            UPDATE users
               SET email = :email,
                   display_name = :display_name,
                   employee_id = :employee_id,
                   job_title = :job_title,
                   class_code = :class_code,
                   is_terminated = FALSE,
                   termination_date = NULL,
                   termination_reason = NULL,
                   unit_code = :unit_code,
                   unit_name = :unit_name,
                   region_code = :region_code,
                   dashboard_region = :dashboard_region,
                   region_id = :region_id,
                   employee_source = :employee_source,
                   employee_seed_batch = :employee_seed_batch,
                   employee_synced_at = NOW(),
                   updated_at = NOW()
             WHERE user_id = :user_id
            SQL
        );
    }

    foreach ($rows as $row) {
        $activeEmployeeIds[$row['employee_id']] = true;
        $activeEmails[strtolower((string)$row['email'])] = true;

        try {
            $regionId = ktv_roster_resolve_region($pdo, $row, $dryRun);
            $matches = ktv_roster_find_matching_user($pdo, $row, !$dryRun);
            $userIds = array_values(array_unique(array_map(static fn(array $match): string => (string)$match['user_id'], $matches)));
            if (count($userIds) > 1) {
                $result['errors'][] = [
                    'row' => $row['source_row'] ?? null,
                    'employee_id' => $row['employee_id'],
                    'email' => $row['email'],
                    'message' => 'Empl ID and Email are currently assigned to different users.',
                ];
                continue;
            }

            $existing = $matches[0] ?? null;
            if ($existing && !empty($existing['employee_id']) && (string)$existing['employee_id'] !== (string)$row['employee_id']) {
                $result['errors'][] = [
                    'row' => $row['source_row'] ?? null,
                    'employee_id' => $row['employee_id'],
                    'email' => $row['email'],
                    'message' => 'Email already belongs to another Empl ID: ' . $existing['employee_id'],
                ];
                continue;
            }

            $parameters = [
                'email' => $row['email'],
                'display_name' => $row['display_name'],
                'employee_id' => $row['employee_id'],
                'job_title' => $row['job_title'],
                'class_code' => $row['class_code'],
                'unit_code' => $row['unit_code'],
                'unit_name' => $row['unit_name'],
                'region_code' => $row['region_code'],
                'dashboard_region' => $row['dashboard_region'],
                'region_id' => $regionId,
                'employee_source' => KTV_ROSTER_IMPORT_SOURCE,
                'employee_seed_batch' => $batch,
            ];

            if (!$existing) {
                $result['inserted']++;
                $result['changes']['inserted'][] = ktv_roster_compact_change($row);
                if (!$dryRun && $insertUser) {
                    $insertUser->execute($parameters);
                }
                continue;
            }

            $wasTerminated = ktv_roster_database_boolean($existing['is_terminated'] ?? false);
            if ($wasTerminated) {
                $result['reactivated']++;
                $result['changes']['reactivated'][] = ktv_roster_compact_change($row);
            } else {
                $result['updated']++;
                $result['changes']['updated'][] = ktv_roster_compact_change($row);
            }
            if (!$dryRun && $updateUser) {
                $parameters['user_id'] = $existing['user_id'];
                $updateUser->execute($parameters);
            }
        } catch (Throwable $exception) {
            $result['errors'][] = [
                'row' => $row['source_row'] ?? null,
                'employee_id' => $row['employee_id'] ?? null,
                'email' => $row['email'] ?? null,
                'message' => $exception->getMessage(),
            ];
        }
    }

    $sql = 'SELECT user_id, employee_id, email, display_name, dashboard_region, class_code
              FROM users
             WHERE employee_source = :employee_source
               AND is_terminated = FALSE';
    if (!$dryRun) {
        $sql .= ' FOR UPDATE';
    }
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['employee_source' => KTV_ROSTER_IMPORT_SOURCE]);
    $managedRows = $stmt->fetchAll();

    $terminateUser = null;
    $terminationDate = (new DateTimeImmutable('now', new DateTimeZone(normalize_app_timezone(env_value('APP_TIMEZONE')))))->format('Y-m-d');
    $terminationReason = 'Không có trong danh sách import ngày ' . $terminationDate;
    if (!$dryRun) {
        $terminateUser = $pdo->prepare(
            'UPDATE users
                SET is_terminated = TRUE,
                    termination_date = :termination_date,
                    termination_reason = :termination_reason,
                    employee_seed_batch = :employee_seed_batch,
                    employee_synced_at = NOW(),
                    updated_at = NOW()
              WHERE user_id = :user_id'
        );
    }

    foreach ($managedRows as $managed) {
        $employeeId = (string)($managed['employee_id'] ?? '');
        $email = strtolower((string)($managed['email'] ?? ''));
        if (($employeeId !== '' && isset($activeEmployeeIds[$employeeId])) || ($email !== '' && isset($activeEmails[$email]))) {
            continue;
        }
        $result['terminated']++;
        $result['changes']['terminated'][] = [
            'employee_id' => $employeeId,
            'display_name' => $managed['display_name'] ?? null,
            'email' => $managed['email'] ?? null,
            'region' => $managed['dashboard_region'] ?? null,
            'class_code' => $managed['class_code'] ?? null,
        ];
        if (!$dryRun && $terminateUser) {
            $terminateUser->execute([
                'termination_date' => $terminationDate,
                'termination_reason' => $terminationReason,
                'employee_seed_batch' => $batch,
                'user_id' => $managed['user_id'],
            ]);
        }
    }

    $result['error_count'] = count($result['errors']);
    $result['errorCount'] = count($result['errors']);
    return $result;
}

function ktv_roster_existing_imported_by(PDO $pdo, ?string $userId): ?string
{
    if (!$userId) {
        return null;
    }
    $stmt = $pdo->prepare('SELECT user_id FROM users WHERE user_id = :user_id');
    $stmt->execute(['user_id' => $userId]);
    $found = $stmt->fetchColumn();
    return is_string($found) && $found !== '' ? $found : null;
}

function ktv_roster_log_import(PDO $pdo, array $result, ?string $importedBy, ?string $fileName): void
{
    $stmt = $pdo->prepare(
        <<<'SQL'
        INSERT INTO roster_import_log (
            batch_id, imported_by, file_name, total_rows,
            inserted, updated, terminated, reactivated,
            error_count, error_details, imported_at
        ) VALUES (
            :batch_id, :imported_by, :file_name, :total_rows,
            :inserted, :updated, :terminated, :reactivated,
            :error_count, CAST(:error_details AS jsonb), NOW()
        )
        ON CONFLICT (batch_id) DO UPDATE SET
            imported_by = EXCLUDED.imported_by,
            file_name = EXCLUDED.file_name,
            total_rows = EXCLUDED.total_rows,
            inserted = EXCLUDED.inserted,
            updated = EXCLUDED.updated,
            terminated = EXCLUDED.terminated,
            reactivated = EXCLUDED.reactivated,
            error_count = EXCLUDED.error_count,
            error_details = EXCLUDED.error_details,
            imported_at = NOW()
        SQL
    );
    $stmt->execute([
        'batch_id' => $result['batch_id'],
        'imported_by' => $importedBy,
        'file_name' => $fileName,
        'total_rows' => $result['total_rows'] ?? $result['totalRows'] ?? 0,
        'inserted' => $result['inserted'] ?? 0,
        'updated' => $result['updated'] ?? 0,
        'terminated' => $result['terminated'] ?? 0,
        'reactivated' => $result['reactivated'] ?? 0,
        'error_count' => $result['error_count'] ?? 0,
        'error_details' => json_encode($result['errors'] ?? [], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES),
    ]);
}
