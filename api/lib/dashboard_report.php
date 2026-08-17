<?php
declare(strict_types=1);

/**
 * Parse and validate an inclusive YYYY-MM-DD report boundary.
 *
 * @throws InvalidArgumentException when the value is missing or malformed.
 */
function dashboard_report_date(mixed $value, string $field): DateTimeImmutable
{
    if (!is_string($value) || !preg_match('/^\d{4}-\d{2}-\d{2}$/D', $value)) {
        throw new InvalidArgumentException("$field must use YYYY-MM-DD.");
    }

    $date = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
    $errors = DateTimeImmutable::getLastErrors();
    if (
        !$date
        || ($errors !== false && (($errors['warning_count'] ?? 0) > 0 || ($errors['error_count'] ?? 0) > 0))
        || $date->format('Y-m-d') !== $value
    ) {
        throw new InvalidArgumentException("$field must be a valid calendar date using YYYY-MM-DD.");
    }

    return $date;
}

function dashboard_report_rate(int $numerator, int $denominator): ?float
{
    return $denominator > 0 ? round(100 * $numerator / $denominator, 1) : null;
}

function dashboard_report_cohort_condition(string $cohort, string $progressAlias, string $periodAlias): string
{
    return match ($cohort) {
        'due_in_period' => "(
            ($periodAlias.is_lifetime AND $progressAlias.due_at IS NOT NULL AND $progressAlias.due_at < $periodAlias.period_end)
            OR
            (NOT $periodAlias.is_lifetime
                AND $progressAlias.due_at >= $periodAlias.period_start
                AND $progressAlias.due_at < $periodAlias.period_end)
        )",
        'assigned_in_period' => "(
            ($periodAlias.is_lifetime AND $progressAlias.assigned_at < $periodAlias.period_end)
            OR
            (NOT $periodAlias.is_lifetime
                AND $progressAlias.assigned_at >= $periodAlias.period_start
                AND $progressAlias.assigned_at < $periodAlias.period_end)
        )",
        'assigned_as_of_period_end' => "$progressAlias.assigned_at < $periodAlias.period_end",
        default => throw new InvalidArgumentException('cohort must be due_in_period, assigned_in_period or assigned_as_of_period_end.'),
    };
}

/**
 * @param array<int, array{key:string, from:string, to:string, is_lifetime:bool}> $periods
 * @return array{sql:string, params:array<string, mixed>}
 */
function dashboard_report_period_values(array $periods): array
{
    $rows = [];
    $params = [];
    foreach ($periods as $index => $period) {
        $keyParameter = "period_key_$index";
        $fromParameter = "period_from_$index";
        $toParameter = "period_to_$index";
        $rows[] = sprintf(
            '(:%s, CAST(:%s AS date)::timestamptz, (CAST(:%s AS date) + 1)::timestamptz, %s)',
            $keyParameter,
            $fromParameter,
            $toParameter,
            $period['is_lifetime'] ? 'TRUE' : 'FALSE'
        );
        $params[$keyParameter] = $period['key'];
        $params[$fromParameter] = $period['from'];
        $params[$toParameter] = $period['to'];
    }

    return [
        'sql' => implode(",\n", $rows),
        'params' => $params,
    ];
}

/** @return array<string, int|float|null|string> */
function dashboard_report_normalize_metric(array $row, string $cohort): array
{
    $assigned = (int)($row['assigned_count'] ?? 0);
    $passed = (int)($row['passed_count'] ?? 0);
    $firstTryEvaluable = (int)($row['first_try_evaluable_count'] ?? 0);
    $firstTryPass = (int)($row['first_try_pass_count'] ?? 0);

    return [
        'cohort_basis' => $cohort,
        'assigned_count' => $assigned,
        'assigned_technicians' => (int)($row['assigned_technicians'] ?? 0),
        'passed_count' => $passed,
        'completion_rate' => dashboard_report_rate($passed, $assigned),
        'first_try_evaluable_count' => $firstTryEvaluable,
        'first_try_pass_count' => $firstTryPass,
        'first_try_unknown_count' => (int)($row['first_try_unknown_count'] ?? 0),
        'first_try_rate' => dashboard_report_rate($firstTryPass, $firstTryEvaluable),
        'practice_attempts' => (int)($row['practice_attempts'] ?? 0),
        'participating_technicians' => (int)($row['participating_technicians'] ?? 0),
        'avg_duration_sec' => (int)($row['avg_duration_sec'] ?? 0),
        'inferred_assignment_count' => (int)($row['inferred_assignment_count'] ?? 0),
    ];
}

/** @return array<string, int|float|null|string> */
function dashboard_report_matrix_metric(int $assigned, int $passed, int $attempted, int $attempts): array
{
    $state = 'not_assigned';
    if ($assigned > 0 && $passed === 0) {
        $state = 'assigned_none_passed';
    } elseif ($assigned > 0 && $passed < $assigned) {
        $state = 'partial';
    } elseif ($assigned > 0) {
        $state = 'complete';
    }

    return [
        'assigned_count' => $assigned,
        'passed_count' => $passed,
        'attempted_count' => $attempted,
        'attempt_count' => $attempts,
        'completion_rate' => dashboard_report_rate($passed, $assigned),
        'state' => $state,
    ];
}

/**
 * Build the normalized assignment-based response consumed by GET
 * /dashboard/report. Query date parameters are inclusive calendar dates.
 *
 * Supported query keys: from, to, compare_from, compare_to, cohort and year.
 *
 * @throws InvalidArgumentException for invalid report parameters.
 */
function build_dashboard_report(PDO $pdo, array $query): array
{
    $today = new DateTimeImmutable('today');
    $defaultFrom = $today->modify('first day of this month');
    $defaultTo = $today->modify('last day of this month');

    $from = dashboard_report_date($query['from'] ?? $defaultFrom->format('Y-m-d'), 'from');
    $to = dashboard_report_date($query['to'] ?? $defaultTo->format('Y-m-d'), 'to');
    if ($from > $to) {
        throw new InvalidArgumentException('from must be on or before to.');
    }

    $hasCompareFrom = array_key_exists('compare_from', $query) && $query['compare_from'] !== '';
    $hasCompareTo = array_key_exists('compare_to', $query) && $query['compare_to'] !== '';
    if ($hasCompareFrom !== $hasCompareTo) {
        throw new InvalidArgumentException('compare_from and compare_to must be supplied together.');
    }
    if ($hasCompareFrom) {
        $compareFrom = dashboard_report_date($query['compare_from'], 'compare_from');
        $compareTo = dashboard_report_date($query['compare_to'], 'compare_to');
    } else {
        $inclusiveDays = (int)$from->diff($to)->format('%a');
        $compareTo = $from->modify('-1 day');
        $compareFrom = $compareTo->modify("-$inclusiveDays days");
    }
    if ($compareFrom > $compareTo) {
        throw new InvalidArgumentException('compare_from must be on or before compare_to.');
    }

    $cohortValue = $query['cohort'] ?? 'due_in_period';
    if (!is_string($cohortValue)) {
        throw new InvalidArgumentException('cohort must be a string.');
    }
    $cohort = trim($cohortValue);
    $allowedCohorts = ['due_in_period', 'assigned_in_period', 'assigned_as_of_period_end'];
    if (!in_array($cohort, $allowedCohorts, true)) {
        throw new InvalidArgumentException('cohort must be due_in_period, assigned_in_period or assigned_as_of_period_end.');
    }

    $yearValue = $query['year'] ?? $from->format('Y');
    if (is_int($yearValue)) {
        $reportYear = $yearValue;
    } elseif (is_string($yearValue) && preg_match('/^\d{4}$/D', $yearValue)) {
        $reportYear = (int)$yearValue;
    } else {
        throw new InvalidArgumentException('year must use YYYY.');
    }
    if ($reportYear < 2000 || $reportYear > 2100) {
        throw new InvalidArgumentException('year must be between 2000 and 2100.');
    }

    $periods = [
        [
            'key' => 'current',
            'from' => $from->format('Y-m-d'),
            'to' => $to->format('Y-m-d'),
            'is_lifetime' => false,
        ],
        [
            'key' => 'previous',
            'from' => $compareFrom->format('Y-m-d'),
            'to' => $compareTo->format('Y-m-d'),
            'is_lifetime' => false,
        ],
        [
            'key' => 'lifetime',
            'from' => '1900-01-01',
            'to' => $to->format('Y-m-d'),
            'is_lifetime' => true,
        ],
    ];
    for ($month = 1; $month <= 12; $month++) {
        $monthStart = new DateTimeImmutable(sprintf('%04d-%02d-01', $reportYear, $month));
        $periods[] = [
            'key' => $monthStart->format('Y-m'),
            'from' => $monthStart->format('Y-m-d'),
            'to' => $monthStart->modify('last day of this month')->format('Y-m-d'),
            'is_lifetime' => false,
        ];
    }

    $periodValues = dashboard_report_period_values($periods);
    $cohortCondition = dashboard_report_cohort_condition($cohort, 'progress', 'period');
    $metricSql = <<<SQL
        WITH periods(period_key, period_start, period_end, is_lifetime) AS (
            VALUES {$periodValues['sql']}
        ), eligible AS (
            SELECT period.period_key,
                   period.period_start,
                   period.period_end,
                   progress.*
              FROM periods period
              JOIN v_lab_assignment_progress progress
                ON $cohortCondition
              JOIN curriculum_labs curriculum_lab
                ON curriculum_lab.curriculum_lab_id = progress.curriculum_lab_id
               AND curriculum_lab.required_mode IN ('practice', 'both')
             WHERE progress.assignment_status <> 'waived'
        ), attempt_stats AS (
            SELECT eligible.period_key,
                   eligible.assignment_id,
                   COUNT(attempt.attempt_id) AS attempt_count,
                   COUNT(attempt.duration_seconds) AS duration_count,
                   COALESCE(SUM(attempt.duration_seconds), 0) AS duration_sum
              FROM eligible
              JOIN lab_attempts attempt
                ON attempt.assignment_id = eligible.assignment_id
               AND attempt.mode = 'practice'
               AND attempt.started_at >= eligible.period_start
               AND attempt.started_at < eligible.period_end
             GROUP BY eligible.period_key, eligible.assignment_id
        )
        SELECT period.period_key,
               COUNT(eligible.assignment_id) AS assigned_count,
               COUNT(DISTINCT eligible.employee_code) AS assigned_technicians,
               COUNT(eligible.assignment_id) FILTER (
                   WHERE eligible.completed_at IS NOT NULL
                     AND eligible.completed_at < period.period_end
               ) AS passed_count,
               COUNT(eligible.assignment_id) FILTER (
                   WHERE eligible.completed_at IS NOT NULL
                     AND eligible.completed_at < period.period_end
                     AND eligible.first_try_success IS NOT NULL
               ) AS first_try_evaluable_count,
               COUNT(eligible.assignment_id) FILTER (
                   WHERE eligible.completed_at IS NOT NULL
                     AND eligible.completed_at < period.period_end
                     AND eligible.first_try_success IS TRUE
               ) AS first_try_pass_count,
               COUNT(eligible.assignment_id) FILTER (
                   WHERE eligible.completed_at IS NOT NULL
                     AND eligible.completed_at < period.period_end
                     AND eligible.first_try_success IS NULL
               ) AS first_try_unknown_count,
               COALESCE(SUM(attempt_stats.attempt_count), 0) AS practice_attempts,
               COUNT(DISTINCT eligible.employee_code) FILTER (
                   WHERE COALESCE(attempt_stats.attempt_count, 0) > 0
               ) AS participating_technicians,
               COALESCE(
                   ROUND(
                       SUM(attempt_stats.duration_sum)::numeric
                       / NULLIF(SUM(attempt_stats.duration_count), 0)
                   ),
                   0
               ) AS avg_duration_sec,
               COUNT(eligible.assignment_id) FILTER (WHERE eligible.is_inferred) AS inferred_assignment_count
          FROM periods period
          LEFT JOIN eligible ON eligible.period_key = period.period_key
          LEFT JOIN attempt_stats
            ON attempt_stats.period_key = eligible.period_key
           AND attempt_stats.assignment_id = eligible.assignment_id
         GROUP BY period.period_key
        SQL;
    $metricStatement = $pdo->prepare($metricSql);
    $metricStatement->execute($periodValues['params']);
    $metricRows = [];
    foreach ($metricStatement->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $metricRows[(string)$row['period_key']] = dashboard_report_normalize_metric($row, $cohort);
    }

    $emptyMetric = dashboard_report_normalize_metric([], $cohort);
    $currentMetric = $metricRows['current'] ?? $emptyMetric;
    $previousMetric = $metricRows['previous'] ?? $emptyMetric;
    $lifetimeMetric = $metricRows['lifetime'] ?? $emptyMetric;
    $monthly = [];
    for ($month = 1; $month <= 12; $month++) {
        $monthKey = sprintf('%04d-%02d', $reportYear, $month);
        $monthly[] = ['month' => $monthKey] + ($metricRows[$monthKey] ?? $emptyMetric);
    }

    $catalogStatement = $pdo->query(
        <<<'SQL'
        SELECT device.device_id,
               device.model,
               device.device_name,
               device.sort_order AS device_sort_order,
               lab.lab_id,
               lab.lab_name,
               lab.sort_order AS lab_sort_order
          FROM device_catalog device
          JOIN lab_catalog lab ON lab.device_id = device.device_id
         WHERE device.is_active = TRUE
           AND lab.is_active = TRUE
         ORDER BY device.sort_order, device.device_name, device.device_id,
                  lab.sort_order, lab.lab_name, lab.lab_id
        SQL
    );
    $deviceGroups = [];
    $deviceGroupIndexes = [];
    $labIds = [];
    foreach ($catalogStatement->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $deviceId = (string)$row['device_id'];
        if (!array_key_exists($deviceId, $deviceGroupIndexes)) {
            $deviceGroupIndexes[$deviceId] = count($deviceGroups);
            $deviceGroups[] = [
                'device' => [
                    'device_id' => $deviceId,
                    'model' => (string)($row['model'] ?? ''),
                    'name' => (string)$row['device_name'],
                    'device_name' => (string)$row['device_name'],
                ],
                'labs' => [],
            ];
        }
        $labId = (string)$row['lab_id'];
        $labIds[$labId] = true;
        $deviceGroups[$deviceGroupIndexes[$deviceId]]['labs'][] = [
            'lab_id' => $labId,
            'name' => (string)$row['lab_name'],
            'lab_name' => (string)$row['lab_name'],
        ];
    }
    $orderedLabIds = array_keys($labIds);

    $matrixPeriodValues = dashboard_report_period_values([[
        'key' => 'matrix',
        'from' => $from->format('Y-m-d'),
        'to' => $to->format('Y-m-d'),
        'is_lifetime' => false,
    ]]);
    $matrixCohortCondition = dashboard_report_cohort_condition($cohort, 'progress', 'period');
    $matrixSql = <<<SQL
        WITH periods(period_key, period_start, period_end, is_lifetime) AS (
            VALUES {$matrixPeriodValues['sql']}
        ), eligible AS (
            SELECT period.period_start,
                   period.period_end,
                   progress.*,
                   COALESCE(progress.employee_code::text, 'assignment:' || progress.assignment_id::text) AS subject_key,
                   progress.completed_at IS NOT NULL
                       AND progress.completed_at < period.period_end AS passed_before_end
              FROM periods period
              JOIN v_lab_assignment_progress progress
                ON $matrixCohortCondition
              JOIN curriculum_labs curriculum_lab
                ON curriculum_lab.curriculum_lab_id = progress.curriculum_lab_id
               AND curriculum_lab.required_mode IN ('practice', 'both')
             WHERE progress.assignment_status <> 'waived'
        ), assignment_attempts AS (
            SELECT eligible.assignment_id,
                   COUNT(attempt.attempt_id) AS attempt_count
              FROM eligible
              LEFT JOIN lab_attempts attempt
                ON attempt.assignment_id = eligible.assignment_id
               AND attempt.mode = 'practice'
               AND attempt.started_at >= eligible.period_start
               AND attempt.started_at < eligible.period_end
             GROUP BY eligible.assignment_id
        ), region_subject_lab AS (
            SELECT eligible.region_id,
                   eligible.region_code,
                   eligible.region_name,
                   eligible.dashboard_group,
                   eligible.device_id,
                   eligible.lab_id,
                   eligible.subject_key,
                   BOOL_OR(eligible.passed_before_end) AS passed,
                   SUM(COALESCE(assignment_attempts.attempt_count, 0)) AS attempt_count
              FROM eligible
              LEFT JOIN assignment_attempts
                ON assignment_attempts.assignment_id = eligible.assignment_id
             GROUP BY eligible.region_id,
                      eligible.region_code,
                      eligible.region_name,
                      eligible.dashboard_group,
                      eligible.device_id,
                      eligible.lab_id,
                      eligible.subject_key
        ), system_subject_lab AS (
            SELECT device_id,
                   lab_id,
                   subject_key,
                   BOOL_OR(passed) AS passed,
                   SUM(attempt_count) AS attempt_count
              FROM region_subject_lab
             GROUP BY device_id, lab_id, subject_key
        ), region_cells AS (
            SELECT 'region'::text AS scope,
                   region_id,
                   region_code,
                   region_name,
                   dashboard_group,
                   device_id,
                   lab_id,
                   COUNT(*) AS assigned_count,
                   COUNT(*) FILTER (WHERE passed) AS passed_count,
                   COUNT(*) FILTER (WHERE attempt_count > 0) AS attempted_count,
                   SUM(attempt_count) AS attempt_count
              FROM region_subject_lab
             GROUP BY region_id, region_code, region_name, dashboard_group, device_id, lab_id
        ), system_cells AS (
            SELECT 'grand'::text AS scope,
                   NULL::uuid AS region_id,
                   NULL::text AS region_code,
                   NULL::text AS region_name,
                   NULL::text AS dashboard_group,
                   device_id,
                   lab_id,
                   COUNT(*) AS assigned_count,
                   COUNT(*) FILTER (WHERE passed) AS passed_count,
                   COUNT(*) FILTER (WHERE attempt_count > 0) AS attempted_count,
                   SUM(attempt_count) AS attempt_count
              FROM system_subject_lab
             GROUP BY device_id, lab_id
        )
        SELECT * FROM region_cells
        UNION ALL
        SELECT * FROM system_cells
        ORDER BY scope DESC, region_name NULLS LAST, region_code NULLS LAST, device_id, lab_id
        SQL;
    $matrixStatement = $pdo->prepare($matrixSql);
    $matrixStatement->execute($matrixPeriodValues['params']);

    $regions = [];
    $grandCells = [];
    foreach ($matrixStatement->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $labId = (string)$row['lab_id'];
        if (($row['scope'] ?? '') === 'grand') {
            $grandCells[$labId] = dashboard_report_matrix_metric(
                (int)$row['assigned_count'],
                (int)$row['passed_count'],
                (int)$row['attempted_count'],
                (int)$row['attempt_count']
            );
            continue;
        }

        $regionId = $row['region_id'] !== null ? (string)$row['region_id'] : '';
        $regionKey = $regionId !== ''
            ? $regionId
            : 'unassigned:' . (string)($row['region_code'] ?? $row['region_name'] ?? 'unknown');
        if (!isset($regions[$regionKey])) {
            $regions[$regionKey] = [
                'region' => [
                    'region_id' => $regionId !== '' ? $regionId : null,
                    'code' => (string)($row['region_code'] ?? 'UNASSIGNED'),
                    'region_code' => (string)($row['region_code'] ?? 'UNASSIGNED'),
                    'name' => (string)($row['region_name'] ?? 'Chưa xác định'),
                    'region_name' => (string)($row['region_name'] ?? 'Chưa xác định'),
                    'dashboard_group' => $row['dashboard_group'] ?? null,
                ],
                'cells' => [],
            ];
        }
        $regions[$regionKey]['cells'][$labId] = dashboard_report_matrix_metric(
            (int)$row['assigned_count'],
            (int)$row['passed_count'],
            (int)$row['attempted_count'],
            (int)$row['attempt_count']
        );
    }

    $emptyCell = dashboard_report_matrix_metric(0, 0, 0, 0);
    $sumMetrics = static function (array $cells): array {
        $assigned = 0;
        $passed = 0;
        $attempted = 0;
        $attempts = 0;
        foreach ($cells as $cell) {
            $assigned += (int)($cell['assigned_count'] ?? 0);
            $passed += (int)($cell['passed_count'] ?? 0);
            $attempted += (int)($cell['attempted_count'] ?? 0);
            $attempts += (int)($cell['attempt_count'] ?? 0);
        }
        return dashboard_report_matrix_metric($assigned, $passed, $attempted, $attempts);
    };

    foreach ($regions as &$region) {
        foreach ($orderedLabIds as $labId) {
            if (!isset($region['cells'][$labId])) {
                $region['cells'][$labId] = $emptyCell;
            }
        }
        $region['total'] = $sumMetrics($region['cells']);
    }
    unset($region);
    uasort($regions, static function (array $left, array $right): int {
        $leftRegion = $left['region'];
        $rightRegion = $right['region'];
        return strnatcasecmp(
            (string)($leftRegion['name'] ?? $leftRegion['code'] ?? ''),
            (string)($rightRegion['name'] ?? $rightRegion['code'] ?? '')
        );
    });
    foreach ($orderedLabIds as $labId) {
        if (!isset($grandCells[$labId])) {
            $grandCells[$labId] = $emptyCell;
        }
    }
    $grandTotal = $sumMetrics($grandCells);

    $version = $pdo->query(
        <<<'SQL'
        SELECT CONCAT(
                   TO_CHAR(
                       GREATEST(
                           COALESCE((SELECT MAX(updated_at) FROM lab_assignments), 'epoch'::timestamptz),
                           COALESCE((SELECT MAX(updated_at) FROM lab_attempts), 'epoch'::timestamptz),
                           COALESCE((SELECT MAX(updated_at) FROM training_classes), 'epoch'::timestamptz),
                           COALESCE((SELECT MAX(updated_at) FROM device_catalog), 'epoch'::timestamptz),
                           COALESCE((SELECT MAX(updated_at) FROM lab_catalog), 'epoch'::timestamptz)
                       ),
                       'YYYYMMDDHH24MISS.US'
                   ),
                   ':', (SELECT COUNT(*) FROM lab_assignments),
                   ':', (SELECT COUNT(*) FROM lab_attempts)
           ) AS data_version
        SQL
    )->fetchColumn();

    $formatPeriodLabel = static fn(DateTimeImmutable $start, DateTimeImmutable $end): string =>
        $start->format('d/m/Y') . ' - ' . $end->format('d/m/Y');

    return [
        'schema_version' => '2.0',
        'mode' => 'practice',
        'cohort_basis' => $cohort,
        'meta' => [
            'schema_version' => '2.0',
            'data_version' => is_string($version) ? $version : '',
            'mode' => 'practice',
            'cohort_basis' => $cohort,
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
                'label' => $formatPeriodLabel($from, $to),
            ],
            'comparison_period' => [
                'from' => $compareFrom->format('Y-m-d'),
                'to' => $compareTo->format('Y-m-d'),
                'label' => $formatPeriodLabel($compareFrom, $compareTo),
            ],
            'report_year' => $reportYear,
            'date_boundaries' => 'inclusive',
        ],
        'summary' => [
            'current' => $currentMetric,
            'previous' => $previousMetric,
            'lifetime' => $lifetimeMetric,
        ],
        'monthly' => $monthly,
        'matrix' => [
            'cohort_basis' => $cohort,
            'device_groups' => $deviceGroups,
            'rows' => array_values($regions),
            'grand_total' => [
                'cells' => $grandCells,
                'total' => $grandTotal,
            ],
        ],
    ];
}
