<?php
declare(strict_types=1);

/**
 * Database-backed dashboard reporting for the simplified production schema.
 * The active roster and active catalog define the denominator; timer_sessions
 * supplies attempts and outcomes. No browser-maintained business catalog is used.
 */

function dashboard_report_parse_date(?string $value, DateTimeImmutable $fallback): DateTimeImmutable
{
    $value = trim((string)$value);
    if ($value === '') {
        return $fallback;
    }
    $parsed = DateTimeImmutable::createFromFormat('!Y-m-d', $value);
    $errors = DateTimeImmutable::getLastErrors();
    if (!$parsed || ($errors !== false && ($errors['warning_count'] > 0 || $errors['error_count'] > 0))) {
        throw new InvalidArgumentException('Invalid dashboard report date. Expected YYYY-MM-DD.');
    }
    return $parsed;
}

function dashboard_report_common_cte(): string
{
    return <<<'SQL'
WITH eligible AS (
    SELECT DISTINCT
           COALESCE(user_id::text, NULLIF(LOWER(email), ''), NULLIF(employee_id, '')) AS person_id,
           user_id,
           employee_id,
           email,
           COALESCE(NULLIF(region_name, ''), NULLIF(region_code, ''), NULLIF(dashboard_region, ''), 'UNASSIGNED') AS region_name,
           COALESCE(NULLIF(region_code, ''), 'UNASSIGNED') AS region_code,
           region_id,
           dashboard_group,
           branch_name
      FROM v_ktv_directory
     WHERE is_terminated = FALSE
),
eligible_identities AS (
    SELECT person_id, 'user:' || user_id::text AS identity_key FROM eligible WHERE user_id IS NOT NULL
    UNION
    SELECT person_id, 'email:' || LOWER(email) FROM eligible WHERE NULLIF(email, '') IS NOT NULL
    UNION
    SELECT person_id, 'employee:' || employee_id FROM eligible WHERE NULLIF(employee_id, '') IS NOT NULL
),
active_labs AS (
    SELECT lab.lab_id,
           lab.lab_name,
           lab.sort_order AS lab_sort_order,
           device.device_id,
           device.device_name,
           device.sort_order AS device_sort_order
      FROM lab_catalog lab
      JOIN device_catalog device ON device.device_id = lab.device_id
     WHERE lab.is_active = TRUE
       AND device.is_active = TRUE
),
resolved_sessions AS (
    SELECT timer.id,
           identity.person_id,
           lab.lab_id,
           lab.device_id,
           COALESCE(timer.started_at, timer.finished_at, timer.created_at) AS occurred_at,
           timer.mode,
           timer.status,
           timer.is_passed,
           timer.completed_first_try,
           timer.practice_attempt_no,
           timer.duration_sec
      FROM timer_sessions timer
      JOIN active_labs lab ON lab.lab_id = timer.lab_id
      JOIN eligible_identities identity
        ON identity.identity_key = CASE
            WHEN timer.user_id IS NOT NULL THEN 'user:' || timer.user_id::text
            WHEN NULLIF(timer.email, '') IS NOT NULL THEN 'email:' || LOWER(timer.email)
            ELSE 'employee:' || COALESCE(timer.technician_id, '')
        END
     WHERE NOT COALESCE(timer.is_mock, FALSE)
),
numbered_sessions AS (
    SELECT session.*
      FROM resolved_sessions session
)
SQL;
}

function dashboard_report_metric(PDO $pdo, ?string $from, ?string $to): array
{
    $where = [];
    $params = [];
    if ($from !== null) {
        $where[] = 'occurred_at >= CAST(:from_date AS date)';
        $params['from_date'] = $from;
    }
    if ($to !== null) {
        $where[] = "occurred_at < CAST(:to_date AS date) + INTERVAL '1 day'";
        $params['to_date'] = $to;
    }
    $predicate = $where ? 'WHERE ' . implode(' AND ', $where) : '';
    $progressWhere = '';
    if ($to !== null) {
        $progressWhere = "WHERE occurred_at < CAST(:progress_to_date AS date) + INTERVAL '1 day'";
        $params['progress_to_date'] = $to;
    }

    $sql = dashboard_report_common_cte() . ",\n" . <<<SQL
activity_scoped AS (
    SELECT * FROM numbered_sessions $predicate
),
progress_scoped AS (
    SELECT * FROM numbered_sessions $progressWhere
),
pair_outcomes AS (
    SELECT person_id,
           lab_id,
           MIN(practice_attempt_no) FILTER (
                WHERE mode IN ('Thực hành', 'practice')
                  AND is_passed IS TRUE
           ) AS first_pass_attempt_no
      FROM progress_scoped
     GROUP BY person_id, lab_id
)
SELECT (SELECT COUNT(*) FROM eligible) * (SELECT COUNT(*) FROM active_labs) AS assigned_count,
       COUNT(*) FILTER (WHERE activity_scoped.mode IN ('Thực hành', 'practice')) AS practice_attempts,
       COUNT(*) FILTER (WHERE activity_scoped.mode IN ('Hướng dẫn', 'guide')) AS guide_attempts,
       COUNT(DISTINCT activity_scoped.person_id) AS participating_technicians,
       COUNT(*) FILTER (
           WHERE activity_scoped.mode IN ('Thực hành', 'practice')
             AND activity_scoped.status IN ('completed', 'Hoàn thành')
       ) AS activity_completed_count,
       COUNT(*) FILTER (
           WHERE activity_scoped.mode IN ('Thực hành', 'practice')
             AND activity_scoped.status IN ('completed', 'Hoàn thành')
             AND activity_scoped.is_passed IS NULL
       ) AS ungraded_completed_count,
       (SELECT COUNT(*) FROM pair_outcomes WHERE first_pass_attempt_no IS NOT NULL) AS completed_count,
       COUNT(*) FILTER (
            WHERE activity_scoped.mode IN ('Thực hành', 'practice') AND activity_scoped.is_passed IS NOT NULL
       ) AS graded_count,
       ROUND(100.0 * (SELECT COUNT(*) FROM pair_outcomes WHERE first_pass_attempt_no IS NOT NULL)
           / NULLIF((SELECT COUNT(*) FROM eligible) * (SELECT COUNT(*) FROM active_labs), 0), 2) AS completion_rate,
       ROUND(100.0 * COUNT(*) FILTER (
            WHERE activity_scoped.mode IN ('Thực hành', 'practice') AND activity_scoped.is_passed IS TRUE
       ) / NULLIF(COUNT(*) FILTER (
            WHERE activity_scoped.mode IN ('Thực hành', 'practice') AND activity_scoped.is_passed IS NOT NULL
       ), 0), 2) AS pass_rate,
       ROUND(100.0 * (SELECT COUNT(*) FROM pair_outcomes WHERE first_pass_attempt_no = 1)
           / NULLIF((SELECT COUNT(*) FROM pair_outcomes WHERE first_pass_attempt_no IS NOT NULL), 0), 2) AS first_try_rate,
       ROUND(AVG(activity_scoped.duration_sec) FILTER (
            WHERE activity_scoped.mode IN ('Thực hành', 'practice') AND activity_scoped.duration_sec > 0
       )) AS avg_duration_sec,
       COUNT(*) FILTER (
            WHERE activity_scoped.mode IN ('Thực hành', 'practice') AND activity_scoped.duration_sec > 0
       ) AS duration_known_count,
       ROUND(100.0 * COUNT(*) FILTER (
            WHERE activity_scoped.mode IN ('Thực hành', 'practice') AND activity_scoped.duration_sec > 0
       ) / NULLIF(COUNT(*) FILTER (
            WHERE activity_scoped.mode IN ('Thực hành', 'practice')
        ), 0), 2) AS duration_coverage_rate
  FROM activity_scoped
SQL;
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetch() ?: [];
}

function dashboard_report_monthly(PDO $pdo, int $year): array
{
    $sql = dashboard_report_common_cte() . ",\n" . <<<'SQL'
months AS (
    SELECT generate_series(CAST(:year_start AS date), CAST(:year_start AS date) + INTERVAL '11 months', INTERVAL '1 month')::date AS month
),
scoped AS (
    SELECT numbered.*,
           DATE_TRUNC('month', occurred_at)::date AS month
      FROM numbered_sessions numbered
     WHERE occurred_at >= CAST(:year_start AS date)
       AND occurred_at < CAST(:year_start AS date) + INTERVAL '1 year'
),
attempt_metrics AS (
    SELECT month,
           COUNT(*) FILTER (WHERE mode IN ('Thực hành', 'practice')) AS practice_attempts,
           COUNT(*) FILTER (WHERE mode IN ('Hướng dẫn', 'guide')) AS guide_attempts,
           COUNT(DISTINCT person_id) AS participating_technicians,
           COUNT(*) FILTER (WHERE mode IN ('Thực hành', 'practice') AND is_passed IS NOT NULL) AS graded_count,
           COUNT(*) FILTER (WHERE mode IN ('Thực hành', 'practice') AND is_passed IS TRUE) AS passed_count,
           ROUND(AVG(duration_sec) FILTER (WHERE mode IN ('Thực hành', 'practice') AND duration_sec > 0)) AS avg_duration_sec,
           COUNT(*) FILTER (WHERE mode IN ('Thực hành', 'practice') AND duration_sec > 0) AS duration_known_count
      FROM scoped
     GROUP BY month
),
first_passes AS (
    SELECT person_id,
           lab_id,
           MIN(practice_attempt_no) FILTER (
               WHERE mode IN ('Thực hành', 'practice') AND is_passed IS TRUE
           ) AS first_pass_attempt_no,
           MIN(occurred_at) FILTER (
               WHERE mode IN ('Thực hành', 'practice') AND is_passed IS TRUE
           ) AS first_passed_at
      FROM numbered_sessions
     GROUP BY person_id, lab_id
),
pair_metrics AS (
    SELECT months.month,
           COUNT(first_passes.first_pass_attempt_no) AS completed_count,
           COUNT(*) FILTER (WHERE first_passes.first_pass_attempt_no = 1) AS first_try_count
      FROM months
      LEFT JOIN first_passes
        ON first_passes.first_passed_at < months.month + INTERVAL '1 month'
     GROUP BY months.month
)
SELECT TO_CHAR(months.month, 'YYYY-MM') AS month,
       COALESCE(attempt.practice_attempts, 0) AS practice_attempts,
       COALESCE(attempt.guide_attempts, 0) AS guide_attempts,
       COALESCE(attempt.participating_technicians, 0) AS participating_technicians,
       COALESCE(pair.completed_count, 0) AS completed_count,
       COALESCE(attempt.graded_count, 0) AS graded_count,
       ROUND(100.0 * COALESCE(pair.completed_count, 0)
           / NULLIF((SELECT COUNT(*) FROM eligible) * (SELECT COUNT(*) FROM active_labs), 0), 2) AS completion_rate,
       ROUND(100.0 * COALESCE(attempt.passed_count, 0) / NULLIF(attempt.graded_count, 0), 2) AS pass_rate,
       ROUND(100.0 * COALESCE(pair.first_try_count, 0) / NULLIF(pair.completed_count, 0), 2) AS first_try_rate,
       attempt.avg_duration_sec,
       COALESCE(attempt.duration_known_count, 0) AS duration_known_count,
       ((months.month + INTERVAL '1 month') > DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month') AS is_future
  FROM months
  LEFT JOIN attempt_metrics attempt ON attempt.month = months.month
  LEFT JOIN pair_metrics pair ON pair.month = months.month
 ORDER BY months.month
SQL;
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['year_start' => sprintf('%04d-01-01', $year)]);
    return $stmt->fetchAll();
}

function dashboard_report_matrix(PDO $pdo, string $from, string $to): array
{
    $sql = dashboard_report_common_cte() . ",\n" . <<<'SQL'
scoped AS (
    SELECT *
      FROM numbered_sessions
     WHERE occurred_at >= CAST(:from_date AS date)
       AND occurred_at < CAST(:to_date AS date) + INTERVAL '1 day'
),
matrix AS (
    SELECT eligible.region_id,
           eligible.region_code,
           eligible.region_name,
           eligible.dashboard_group,
           eligible.branch_name,
           lab.device_id,
           lab.device_name,
           lab.device_sort_order,
           lab.lab_id,
           lab.lab_name,
           lab.lab_sort_order,
           COUNT(DISTINCT eligible.person_id) AS assigned_count,
           COUNT(DISTINCT eligible.person_id) FILTER (
               WHERE scoped.mode IN ('Thực hành', 'practice')
           ) AS attempted_count,
            COUNT(DISTINCT eligible.person_id) FILTER (
                WHERE scoped.mode IN ('Thực hành', 'practice')
                  AND scoped.is_passed IS TRUE
            ) AS completed_count,
           COUNT(scoped.id) FILTER (WHERE scoped.mode IN ('Thực hành', 'practice')) AS attempt_count
      FROM eligible
     CROSS JOIN active_labs lab
      LEFT JOIN scoped
        ON scoped.person_id = eligible.person_id
       AND scoped.lab_id = lab.lab_id
     GROUP BY eligible.region_id,
              eligible.region_code,
              eligible.region_name,
              eligible.dashboard_group,
              eligible.branch_name,
              lab.device_id,
              lab.device_name,
              lab.device_sort_order,
              lab.lab_id,
              lab.lab_name,
              lab.lab_sort_order
)
SELECT *,
       ROUND(100.0 * completed_count / NULLIF(assigned_count, 0), 2) AS completion_rate
  FROM matrix
 ORDER BY COALESCE(dashboard_group, region_name), region_name,
          device_sort_order, lab_sort_order, lab_id
SQL;
    $stmt = $pdo->prepare($sql);
    $stmt->execute(['from_date' => $from, 'to_date' => $to]);
    $rows = $stmt->fetchAll();

    $catalogRows = $pdo->query(
        'SELECT device.device_id, device.device_name, device.sort_order AS device_sort_order,
                lab.lab_id, lab.lab_name, lab.sort_order AS lab_sort_order
           FROM device_catalog device
           JOIN lab_catalog lab ON lab.device_id = device.device_id
          WHERE device.is_active = TRUE AND lab.is_active = TRUE
          ORDER BY device.sort_order, device.device_id, lab.sort_order, lab.lab_id'
    )->fetchAll();
    $groups = [];
    foreach ($catalogRows as $row) {
        $deviceId = (string)$row['device_id'];
        if (!isset($groups[$deviceId])) {
            $groups[$deviceId] = [
                'device' => ['device_id' => $deviceId, 'name' => (string)$row['device_name']],
                'labs' => [],
            ];
        }
        $groups[$deviceId]['labs'][] = [
            'lab_id' => (string)$row['lab_id'],
            'name' => (string)$row['lab_name'],
        ];
    }

    $regionRows = [];
    $grandCells = [];
    $grandTotal = ['assigned_count' => 0, 'attempted_count' => 0, 'completed_count' => 0, 'attempt_count' => 0];
    foreach ($rows as $row) {
        $regionKey = (string)($row['region_id'] ?? '') . '|' . (string)$row['region_name'];
        if (!isset($regionRows[$regionKey])) {
            $regionRows[$regionKey] = [
                'region' => [
                    'region_id' => $row['region_id'] ?? null,
                    'code' => (string)$row['region_code'],
                    'name' => (string)$row['region_name'],
                    'dashboard_group' => $row['dashboard_group'] ?? null,
                    'branch_name' => $row['branch_name'] ?? null,
                ],
                'cells' => [],
                'total' => ['assigned_count' => 0, 'attempted_count' => 0, 'completed_count' => 0, 'attempt_count' => 0],
            ];
        }
        $cell = [
            'assigned_count' => (int)$row['assigned_count'],
            'attempted_count' => (int)$row['attempted_count'],
            'completed_count' => (int)$row['completed_count'],
            'attempt_count' => (int)$row['attempt_count'],
            'completion_rate' => $row['completion_rate'] === null ? null : (float)$row['completion_rate'],
        ];
        $labId = (string)$row['lab_id'];
        $regionRows[$regionKey]['cells'][$labId] = $cell;
        foreach (['assigned_count', 'attempted_count', 'completed_count', 'attempt_count'] as $metric) {
            $regionRows[$regionKey]['total'][$metric] += $cell[$metric];
            $grandTotal[$metric] += $cell[$metric];
            $grandCells[$labId][$metric] = ($grandCells[$labId][$metric] ?? 0) + $cell[$metric];
        }
    }
    foreach ($regionRows as &$regionRow) {
        $assigned = $regionRow['total']['assigned_count'];
        $regionRow['total']['completion_rate'] = $assigned
            ? round(100 * $regionRow['total']['completed_count'] / $assigned, 2)
            : null;
    }
    unset($regionRow);
    foreach ($grandCells as &$cell) {
        $cell['completion_rate'] = $cell['assigned_count']
            ? round(100 * $cell['completed_count'] / $cell['assigned_count'], 2)
            : null;
    }
    unset($cell);
    $grandTotal['completion_rate'] = $grandTotal['assigned_count']
        ? round(100 * $grandTotal['completed_count'] / $grandTotal['assigned_count'], 2)
        : null;

    return [
        'device_groups' => array_values($groups),
        'rows' => array_values($regionRows),
        'grand_total' => ['cells' => $grandCells, 'total' => $grandTotal],
    ];
}

function dashboard_report_payload(PDO $pdo, array $query): array
{
    $today = new DateTimeImmutable('today');
    $defaultStart = $today->modify('first day of this month');
    $defaultEnd = $today->modify('last day of this month');
    $from = dashboard_report_parse_date($query['from'] ?? null, $defaultStart);
    $to = dashboard_report_parse_date($query['to'] ?? null, $defaultEnd);
    if ($to < $from) {
        throw new InvalidArgumentException('Dashboard report end date must not be before start date.');
    }
    $previousEndDefault = $from->modify('-1 day');
    $periodLength = (int)$from->diff($to)->format('%a');
    $previousStartDefault = $previousEndDefault->modify('-' . $periodLength . ' days');
    $compareFrom = dashboard_report_parse_date($query['compare_from'] ?? null, $previousStartDefault);
    $compareTo = dashboard_report_parse_date($query['compare_to'] ?? null, $previousEndDefault);

    $current = dashboard_report_metric($pdo, $from->format('Y-m-d'), $to->format('Y-m-d'));
    $previous = dashboard_report_metric($pdo, $compareFrom->format('Y-m-d'), $compareTo->format('Y-m-d'));
    $lifetime = dashboard_report_metric($pdo, null, null);
    $monthly = dashboard_report_monthly($pdo, (int)$from->format('Y'));
    $matrix = dashboard_report_matrix($pdo, $from->format('Y-m-d'), $to->format('Y-m-d'));

    return [
        'meta' => [
            'source' => 'database',
            'cohort' => 'current_active_ktv_catalog',
            'period' => [
                'from' => $from->format('Y-m-d'),
                'to' => $to->format('Y-m-d'),
                'label' => $from->format('d/m/Y') . ' – ' . $to->format('d/m/Y'),
            ],
            'generated_at' => (new DateTimeImmutable())->format(DATE_ATOM),
        ],
        'summary' => ['current' => $current, 'previous' => $previous, 'lifetime' => $lifetime],
        'monthly' => $monthly,
        'matrix' => $matrix,
    ];
}
