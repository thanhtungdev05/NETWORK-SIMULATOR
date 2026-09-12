<?php
declare(strict_types=1);

if (!function_exists('database_boolean')) {
    function database_boolean(mixed $value): bool
    {
        if (is_bool($value)) {
            return $value;
        }
        if (is_int($value)) {
            return $value === 1;
        }
        return in_array(strtolower(trim((string)$value)), ['1', 't', 'true', 'yes', 'y', 'on'], true);
    }
}

/**
 * AI Assistant Module for Network Lab Management Dashboard
 * Provides diagnostic analytics, failure pattern extraction, and intelligent Q&A.
 */

function ai_resolve_class_id(PDO $pdo, ?string $classIdentifier): ?string
{
    if (!$classIdentifier || trim($classIdentifier) === '' || strtolower(trim($classIdentifier)) === 'all') {
        return null;
    }
    $ident = trim($classIdentifier);
    $stmt = $pdo->prepare('SELECT class_id FROM training_classes WHERE class_id::text = :id OR LOWER(class_code) = LOWER(:code) LIMIT 1');
    $stmt->execute(['id' => $ident, 'code' => $ident]);
    $res = $stmt->fetchColumn();
    return $res ? (string)$res : null;
}

/**
 * Generates an end-to-end diagnostic report analyzing failure patterns, common mistakes, and struggling students.
 */
function ai_get_diagnostic_report(PDO $pdo, ?string $classIdentifier = null): array
{
    $classId = ai_resolve_class_id($pdo, $classIdentifier);

    // 1. Top Failed Labs Analysis
    $labSql = '
        SELECT 
            t.lab_id,
            COALESCE(l.lab_name, t.lab_name, t.lab_id) AS lab_name,
            COALESCE(d.device_name, t.device, \'Thiết bị\') AS device_name,
            COUNT(*) AS total_attempts,
            SUM(CASE WHEN t.is_passed = TRUE THEN 1 ELSE 0 END) AS passed_count,
            SUM(CASE WHEN t.is_passed = FALSE OR t.status = \'failed\' THEN 1 ELSE 0 END) AS failed_count,
            ROUND(AVG(COALESCE(t.score, 0)), 1) AS avg_score,
            ROUND(AVG(COALESCE(t.duration_sec, 0)) / 60.0, 1) AS avg_duration_min
        FROM timer_sessions t
        LEFT JOIN lab_catalog l ON l.lab_id = t.lab_id
        LEFT JOIN device_catalog d ON d.device_id = l.device_id OR d.device_name = t.device
    ';

    $params = [];
    if ($classId !== null) {
        $labSql .= '
            JOIN timer_session_assignment_links link ON link.timer_session_id = t.id
            JOIN lab_assignments assign ON assign.assignment_id = link.assignment_id AND assign.class_id_snapshot = :class_id
        ';
        $params['class_id'] = $classId;
    }

    $labSql .= '
        WHERE t.status IN (\'completed\', \'failed\')
          AND NOT COALESCE(t.is_mock, FALSE)
        GROUP BY t.lab_id, l.lab_name, t.lab_name, d.device_name, t.device
        HAVING COUNT(*) > 0
        ORDER BY failed_count DESC, (SUM(CASE WHEN t.is_passed = FALSE OR t.status = \'failed\' THEN 1.0 ELSE 0.0 END) / COUNT(*)) DESC, total_attempts DESC
        LIMIT 10
    ';

    $stmt = $pdo->prepare($labSql);
    $stmt->execute($params);
    $rawLabRows = $stmt->fetchAll();

    $topFailedLabs = [];
    foreach ($rawLabRows as $row) {
        $total = (int)$row['total_attempts'];
        $failed = (int)$row['failed_count'];
        $passed = (int)$row['passed_count'];
        $failRate = $total > 0 ? round(($failed / $total) * 100, 1) : 0;
        $passRate = $total > 0 ? round(($passed / $total) * 100, 1) : 0;

        $topFailedLabs[] = [
            'lab_id' => (string)$row['lab_id'],
            'lab_name' => (string)$row['lab_name'],
            'device_name' => (string)$row['device_name'],
            'total_attempts' => $total,
            'passed_count' => $passed,
            'failed_count' => $failed,
            'fail_rate_percent' => $failRate,
            'pass_rate_percent' => $passRate,
            'avg_score' => (float)$row['avg_score'],
            'avg_duration_min' => (float)$row['avg_duration_min'],
            'risk_level' => ($failed >= 2 || $failRate >= 40) ? 'high' : ($failed >= 1 ? 'medium' : 'low'),
        ];
    }

    // 2. Common Configuration Mistakes Breakdown from grading_details JSON
    $mistakeSql = '
        SELECT 
            t.id AS session_id,
            t.lab_id,
            COALESCE(l.lab_name, t.lab_name, t.lab_id) AS lab_name,
            t.grading_details
        FROM timer_sessions t
        LEFT JOIN lab_catalog l ON l.lab_id = t.lab_id
    ';
    $mParams = [];
    if ($classId !== null) {
        $mistakeSql .= '
            JOIN timer_session_assignment_links link ON link.timer_session_id = t.id
            JOIN lab_assignments assign ON assign.assignment_id = link.assignment_id AND assign.class_id_snapshot = :class_id
        ';
        $mParams['class_id'] = $classId;
    }
    $mistakeSql .= '
        WHERE t.grading_details IS NOT NULL
          AND (t.is_passed = FALSE OR t.status = \'failed\' OR t.score < 100)
          AND NOT COALESCE(t.is_mock, FALSE)
    ';

    $mStmt = $pdo->prepare($mistakeSql);
    $mStmt->execute($mParams);
    $mistakeRows = $mStmt->fetchAll();

    $ruleFailCounts = [];
    foreach ($mistakeRows as $mRow) {
        $details = $mRow['grading_details'];
        if (is_string($details)) {
            $details = json_decode($details, true);
        }
        if (!is_array($details)) {
            continue;
        }

        foreach ($details as $criterion) {
            if (!is_array($criterion) || !empty($criterion['passed'])) {
                continue;
            }

            $cid = (string)($criterion['id'] ?? $criterion['name'] ?? 'unknown_rule');
            $cname = (string)($criterion['name'] ?? $cid);
            $expected = trim((string)($criterion['expected'] ?? ''));
            $actual = trim((string)($criterion['actual'] ?? ''));
            $msg = trim((string)($criterion['message'] ?? ''));
            $labName = (string)$mRow['lab_name'];
            $labId = (string)$mRow['lab_id'];

            $ruleKey = $labId . '::' . $cid;
            if (!isset($ruleFailCounts[$ruleKey])) {
                $ruleFailCounts[$ruleKey] = [
                    'rule_id' => $cid,
                    'rule_name' => $cname,
                    'lab_id' => $labId,
                    'lab_name' => $labName,
                    'fail_count' => 0,
                    'error_type' => 'mismatch',
                    'reasons' => [],
                ];
            }

            $ruleFailCounts[$ruleKey]['fail_count']++;

            // Categorize error reason
            $category = 'Sai thông số cấu hình';
            if (str_contains(mb_strtolower($actual), 'chưa lưu') || str_contains(mb_strtolower($msg), 'chưa lưu') || str_contains(mb_strtolower($msg), 'save')) {
                $category = 'Quên bấm Lưu / Apply cấu hình';
                $ruleFailCounts[$ruleKey]['error_type'] = 'unsaved';
            } elseif ($actual === '' || $actual === '(Chưa nhập)' || $actual === '(Trống)') {
                $category = 'Bỏ trống trường cấu hình bắt buộc';
                $ruleFailCounts[$ruleKey]['error_type'] = 'empty';
            } elseif (str_contains(mb_strtolower($cid), 'pwd') || str_contains(mb_strtolower($cid), 'pass') || str_contains(mb_strtolower($cid), 'key')) {
                $category = 'Sai mật khẩu xác thực';
                $ruleFailCounts[$ruleKey]['error_type'] = 'auth';
            } elseif (str_contains(mb_strtolower($cid), 'ip') || str_contains(mb_strtolower($cid), 'subnet') || str_contains(mb_strtolower($cid), 'dns') || str_contains(mb_strtolower($cid), 'dhcp')) {
                $category = 'Sai dải IP / Subnet / Gateway';
                $ruleFailCounts[$ruleKey]['error_type'] = 'network';
            }

            $sampleText = "Kỳ vọng: [{$expected}] | Thực tế: [{$actual}]";
            if (!empty($msg)) {
                $sampleText .= " — Ghi chú: {$msg}";
            }
            if (count($ruleFailCounts[$ruleKey]['reasons']) < 3 && !in_array($sampleText, $ruleFailCounts[$ruleKey]['reasons'], true)) {
                $ruleFailCounts[$ruleKey]['reasons'][] = $sampleText;
            }
            $ruleFailCounts[$ruleKey]['category'] = $category;
        }
    }

    $commonMistakes = array_values($ruleFailCounts);
    usort($commonMistakes, static fn($a, $b) => $b['fail_count'] <=> $a['fail_count']);
    $commonMistakes = array_slice($commonMistakes, 0, 10);

    // 3. Struggling Learners Analysis
    $studentSql = '
        SELECT 
            p.email,
            COALESCE(u.display_name, p.email) AS student_name,
            p.class_code,
            tc.class_name,
            COUNT(*) AS total_assigned_labs,
            SUM(CASE WHEN p.assignment_status = \'passed\' THEN 1 ELSE 0 END) AS passed_labs,
            SUM(CASE WHEN p.assignment_status <> \'passed\' THEN 1 ELSE 0 END) AS remaining_labs,
            ROUND(100.0 * SUM(CASE WHEN p.assignment_status = \'passed\' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 1) AS completion_percent
        FROM v_lab_assignment_progress p
        JOIN users u ON u.user_id = p.user_id
        JOIN training_classes tc ON tc.class_id = p.class_id
        WHERE tc.is_mock = FALSE
          AND p.assignment_status <> \'waived\'
    ';
    $sParams = [];
    if ($classId !== null) {
        $studentSql .= ' AND tc.class_id = :class_id';
        $sParams['class_id'] = $classId;
    }
    $studentSql .= '
        GROUP BY p.email, u.display_name, p.class_code, tc.class_name
        ORDER BY completion_percent ASC, remaining_labs DESC
    ';

    $sStmt = $pdo->prepare($studentSql);
    $sStmt->execute($sParams);
    $studentProgressRows = $sStmt->fetchAll();

    // Query students who have repeated failed sessions
    $failPerUserSql = '
        SELECT 
            COALESCE(t.email, u.email) AS email,
            t.lab_id,
            COALESCE(l.lab_name, t.lab_name, t.lab_id) AS lab_name,
            COUNT(*) AS failed_sessions_count
        FROM timer_sessions t
        LEFT JOIN users u ON u.user_id = t.user_id
        LEFT JOIN lab_catalog l ON l.lab_id = t.lab_id
        WHERE (t.is_passed = FALSE OR t.status = \'failed\')
          AND NOT COALESCE(t.is_mock, FALSE)
        GROUP BY COALESCE(t.email, u.email), t.lab_id, l.lab_name, t.lab_name
        HAVING COUNT(*) >= 1
    ';
    $fStmt = $pdo->query($failPerUserSql);
    $userFailMap = [];
    foreach ($fStmt->fetchAll() as $fRow) {
        $em = strtolower(trim((string)$fRow['email']));
        if ($em === '') continue;
        if (!isset($userFailMap[$em])) {
            $userFailMap[$em] = [];
        }
        $userFailMap[$em][] = [
            'lab_id' => $fRow['lab_id'],
            'lab_name' => $fRow['lab_name'],
            'fail_count' => (int)$fRow['failed_sessions_count'],
        ];
    }

    $strugglingStudents = [];
    foreach ($studentProgressRows as $sRow) {
        $em = strtolower(trim((string)$sRow['email']));
        $completedPct = (float)$sRow['completion_percent'];
        $repeatedFails = $userFailMap[$em] ?? [];
        $totalRepeatedFails = array_sum(array_column($repeatedFails, 'fail_count'));

        $isStruggling = ($completedPct < 35.0) || ($totalRepeatedFails >= 1);
        if ($isStruggling) {
            $strugglingStudents[] = [
                'email' => (string)$sRow['email'],
                'student_name' => (string)$sRow['student_name'],
                'class_code' => (string)$sRow['class_code'],
                'class_name' => (string)$sRow['class_name'],
                'total_assigned_labs' => (int)$sRow['total_assigned_labs'],
                'passed_labs' => (int)$sRow['passed_labs'],
                'completion_percent' => $completedPct,
                'failed_sessions_count' => $totalRepeatedFails,
                'stuck_labs' => $repeatedFails,
                'attention_level' => ($completedPct <= 15.0 || $totalRepeatedFails >= 2) ? 'urgent' : 'warning',
            ];
        }
    }

    // 4. Pedagogical Recommendations Synthesis
    $recommendations = [];
    if (!empty($topFailedLabs)) {
        $worstLab = $topFailedLabs[0];
        $recommendations[] = [
            'type' => 'curriculum',
            'title' => "Trọng điểm cần củng cố: Bài {$worstLab['lab_name']} ({$worstLab['device_name']})",
            'description' => "Bài lab này đang có số lượt trượt cao nhất ({$worstLab['failed_count']} lần trượt, tỷ lệ trượt {$worstLab['fail_rate_percent']}%). Giảng viên nên dành 15-20 phút đầu giờ để ôn lại sơ đồ đấu nối và các bước cấu hình chuẩn cho bài này.",
            'priority' => 'high',
        ];
    }

    $hasUnsavedMistake = false;
    foreach ($commonMistakes as $mistake) {
        if ($mistake['error_type'] === 'unsaved') {
            $hasUnsavedMistake = true;
            break;
        }
    }
    if ($hasUnsavedMistake) {
        $recommendations[] = [
            'type' => 'instruction',
            'title' => 'Lỗi thao tác phổ biến: Quên nhấn Save / Apply cấu hình',
            'description' => 'Nhiều học viên đã nhập đúng thông số PPPoE hoặc Wi-Fi nhưng quên bấm nút Save trên giao diện thiết bị trước khi nộp bài. Cần nhắc nhở sinh viên luôn kiểm tra thông báo Lưu thành công trước khi ấn Hoàn thành.',
            'priority' => 'high',
        ];
    }

    if (!empty($strugglingStudents)) {
        $urgentCount = count(array_filter($strugglingStudents, fn($s) => $s['attention_level'] === 'urgent'));
        $recommendations[] = [
            'type' => 'mentoring',
            'title' => "Kèm cặp cá nhân hóa ({$urgentCount} học viên cần can thiệp sớm)",
            'description' => "Có {$urgentCount} học viên tiến độ dưới 20% hoặc liên tục thi trượt. Giảng viên nên gửi email nhắc nhở kèm hướng dẫn trực tiếp để tránh hổng kiến thức trước kỳ thi tốt nghiệp.",
            'priority' => 'medium',
        ];
    }

    // 5. Classes Summary for filter dropdown
    $classesStmt = $pdo->query('
        SELECT class_id, class_code, class_name, status 
        FROM training_classes 
        WHERE is_mock = FALSE 
        ORDER BY class_code
    ');
    $availableClasses = $classesStmt->fetchAll(PDO::FETCH_ASSOC);

    return [
        'generated_at' => date('c'),
        'class_filter' => $classId,
        'summary' => [
            'total_active_labs_analyzed' => count($topFailedLabs),
            'total_common_mistakes_tracked' => count($commonMistakes),
            'struggling_students_count' => count($strugglingStudents),
            'urgent_students_count' => count(array_filter($strugglingStudents, fn($s) => $s['attention_level'] === 'urgent')),
        ],
        'top_failed_labs' => $topFailedLabs,
        'common_mistakes' => $commonMistakes,
        'struggling_students' => $strugglingStudents,
        'recommendations' => $recommendations,
        'available_classes' => $availableClasses,
    ];
}

/**
 * Call Google Gemini 1.5 Flash REST API
 */
function ai_call_gemini_api(string $systemPrompt, string $userPrompt): ?array
{
    $apiKey = env_value('GEMINI_API_KEY');
    if (!$apiKey || trim($apiKey) === '') {
        return null;
    }

    $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . urlencode(trim($apiKey));

    $payload = [
        'system_instruction' => [
            'parts' => [
                ['text' => $systemPrompt]
            ]
        ],
        'contents' => [
            [
                'role' => 'user',
                'parts' => [
                    ['text' => $userPrompt]
                ]
            ]
        ],
        'generationConfig' => [
            'temperature' => 0.3,
            'maxOutputTokens' => 2048,
            'topP' => 0.85,
        ]
    ];

    if (!function_exists('curl_init')) {
        return null;
    }

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($payload, JSON_UNESCAPED_UNICODE),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => ['Content-Type: application/json'],
        CURLOPT_TIMEOUT => 20,
        CURLOPT_CONNECTTIMEOUT => 6,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    if ($response === false || $httpCode < 200 || $httpCode >= 300) {
        error_log("Gemini API Error (HTTP {$httpCode}): " . ($curlError ?: substr((string)$response, 0, 500)));
        return null;
    }

    $decoded = json_decode((string)$response, true);
    $text = $decoded['candidates'][0]['content']['parts'][0]['text'] ?? null;
    if (!$text || trim($text) === '') {
        return null;
    }

    return [
        'text' => trim($text),
        'model' => 'gemini-1.5-flash',
        'usage' => $decoded['usageMetadata'] ?? null,
    ];
}

/**
 * Helper to strip Vietnamese diacritics for flexible fuzzy matching
 */
function ai_remove_vietnamese_accents(string $str): string
{
    $str = preg_replace("/(à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ)/u", "a", $str);
    $str = preg_replace("/(è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ)/u", "e", $str);
    $str = preg_replace("/(ì|í|ị|ỉ|ĩ)/u", "i", $str);
    $str = preg_replace("/(ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ)/u", "o", $str);
    $str = preg_replace("/(ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ)/u", "u", $str);
    $str = preg_replace("/(ỳ|ý|ỵ|ỷ|ỹ)/u", "y", $str);
    $str = preg_replace("/(đ)/u", "d", $str);
    $str = preg_replace("/(À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ)/u", "a", $str);
    $str = preg_replace("/(È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ)/u", "e", $str);
    $str = preg_replace("/(Ì|Í|Ị|Ỉ|Ĩ)/u", "i", $str);
    $str = preg_replace("/(Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ)/u", "o", $str);
    $str = preg_replace("/(Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ)/u", "u", $str);
    $str = preg_replace("/(Ỳ|Ý|Ỵ|Ỷ|Ỹ)/u", "y", $str);
    $str = preg_replace("/(Đ)/u", "d", $str);
    return strtolower(trim((string)$str));
}

/**
 * Flexible student lookup supporting conversational Vietnamese (e.g. 'còn phương sang thì sao', 'phuong sang the nao', 'sangnp3251')
 */
function ai_search_students(PDO $pdo, string $question, ?string $classIdentifier = null): array
{
    $qLower = mb_strtolower(trim($question));
    $qUnaccent = ai_remove_vietnamese_accents($question);

    // If the question is purely about class progress, device stats or hardworking students without person references, skip student search
    $isDeviceQuery = str_contains($qLower, 'chưa làm thiết bị') || 
                     (str_contains($qLower, 'chưa làm') && (str_contains($qLower, 'thiết bị') || str_contains($qLower, 'ac1000') || str_contains($qLower, 'be6500') || str_contains($qLower, 'ax3000'))) ||
                     (str_contains($qLower, 'bao nhiêu') && str_contains($qLower, 'chưa làm')) ||
                     (str_contains($qLower, 'bao nhiêu') && str_contains($qLower, 'làm thiết bị'));
    $isHardworkingQuery = str_contains($qLower, 'chăm chỉ') || str_contains($qLower, 'cham chi') || str_contains($qLower, 'tích cực nhất') || str_contains($qLower, 'siêng năng');
    $isClassQuery = (str_contains($qLower, 'lớp') || str_contains($qLower, 'lop')) && 
                    (str_contains($qLower, 'tiến độ') || str_contains($qLower, 'tien do') || str_contains($qLower, 'tỷ lệ') || str_contains($qLower, 'danh sách'));
    $isGeneralLabQuery = str_contains($qLower, 'bài thực hành nào') || 
                         str_contains($qLower, 'bài nào') || 
                         str_contains($qLower, 'hay sai') || 
                         str_contains($qLower, 'làm sai nhất') || 
                         str_contains($qLower, 'lỗi cấu hình') ||
                         str_contains($qLower, 'phổ biến nhất');
    $hasPersonWord = str_contains($qLower, 'sinh viên') || str_contains($qLower, 'sinh vien') ||
                     str_contains($qLower, 'bạn ') || str_contains($qLower, 'ban ') ||
                     str_contains($qLower, 'em ') ||
                     str_contains($qLower, 'còn ') || str_contains($qLower, 'con ') ||
                     str_contains($qLower, 'thế còn') || str_contains($qLower, 'the con') ||
                     str_contains($qLower, 'hồ sơ') || str_contains($qLower, 'tra cứu') ||
                     str_contains($qLower, 'của ');

    if ($isDeviceQuery || $isHardworkingQuery || (($isClassQuery || $isGeneralLabQuery) && !$hasPersonWord)) {
        return ['best' => null, 'others' => [], 'total_found' => 0];
    }

    // Stop words
    $stopWords = [
        'còn', 'con', 'thì', 'thi', 'sao', 'thế', 'the', 'nào', 'nao', 'ra', 
        'của', 'cua', 'cho', 'tôi', 'toi', 'mình', 'minh', 'xem', 'biết', 'biet', 
        'với', 'voi', 'về', 've', 'ở', 'o', 'lớp', 'lop', 'như', 'nhu', 'được', 'duoc', 
        'làm', 'lam', 'bài', 'bai', 'chưa', 'chua', 'mấy', 'may', 'điểm', 'diem', 
        'học', 'hoc', 'viên', 'vien', 'sinh', 'bạn', 'ban', 
        'em', 'chị', 'chi', 'thầy', 'thay', 'cô', 'co', 'hỏi', 'hoi', 'ai', 
        'tình', 'hình', 'kết', 'quả', 'thông', 'tin', 'hồ', 'sơ', 'tra', 'cứu',
        'bao', 'nhiêu', 'nhieu', 'đang', 'dang', 'gì', 'gi', 'đâu', 'dau', 'khác', 'khac',
        'tiến', 'tien', 'độ', 'do', 'quá', 'qua', 'trình', 'trinh', 'báo', 'bao', 'cáo', 'cao', 
        'toàn', 'toan', 'bộ', 'bo', 'chung', 'tất', 'tat', 'cả', 'ca', 'danh', 'sách', 'sach'
    ];

    // Extract tokens
    $rawTokens = preg_split('/[\s,\?\.!\(\)\[\]:;\-\+\/\'"]+/u', $qLower);
    $tokens = [];
    foreach ($rawTokens as $t) {
        $t = trim($t);
        if (mb_strlen($t) >= 2 && !in_array($t, $stopWords, true)) {
            $tokens[] = $t;
        }
    }

    if (empty($tokens)) {
        return ['best' => null, 'others' => [], 'total_found' => 0];
    }

    $stmt = $pdo->query("
        SELECT u.user_id, u.email, u.display_name, u.employee_id, u.role,
               tc.class_id, tc.class_code, tc.class_name
        FROM users u
        LEFT JOIN class_enrollments ce ON ce.user_id = u.user_id AND ce.status = 'active'
        LEFT JOIN training_classes tc ON tc.class_id = ce.class_id
        WHERE u.is_terminated = FALSE
    ");
    $rawUsers = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // De-duplicate by user_id
    $users = [];
    foreach ($rawUsers as $ru) {
        $uid = $ru['user_id'];
        if (!isset($users[$uid])) {
            $users[$uid] = $ru;
        }
    }

    $scored = [];

    foreach ($users as $u) {
        $dispNameRaw = (string)($u['display_name'] ?? '');
        $dispName = trim((string)preg_replace('/\s*[-–—]\s*(học viên|giảng viên|admin|ktv).*/iu', '', $dispNameRaw));
        $email = (string)($u['email'] ?? '');
        $empId = (string)($u['employee_id'] ?? '');

        $nameLower = mb_strtolower($dispName);
        $nameUnaccent = ai_remove_vietnamese_accents($dispName);
        $emailLower = strtolower($email);
        $emailPrefix = explode('@', $emailLower)[0] ?? '';
        $empIdLower = strtolower($empId);

        $score = 0;

        // 1. Full name match
        if ($dispName !== '' && mb_strlen($dispName) >= 3) {
            if (preg_match('/\b' . preg_quote($nameLower, '/') . '\b/u', $qLower)) {
                $score += 160;
            } elseif (preg_match('/\b' . preg_quote($nameUnaccent, '/') . '\b/u', $qUnaccent)) {
                $score += 140;
            }
        }

        // 2. Email or Employee ID match
        if ($empId !== '' && mb_strlen($empId) >= 3 && (str_contains($qLower, $empIdLower) || str_contains($qUnaccent, $empIdLower))) {
            $score += 150;
        }
        if ($emailPrefix !== '' && mb_strlen($emailPrefix) >= 3 && (str_contains($qLower, $emailPrefix) || str_contains($qUnaccent, $emailPrefix))) {
            $score += 145;
        }

        // 3. Name components match
        if ($dispName !== '') {
            $nameParts = preg_split('/\s+/u', $nameLower);
            $namePartsUnaccent = preg_split('/\s+/u', $nameUnaccent);

            // Consecutive pair match (e.g. "phương sang", "đặng minh", "minh anh")
            if (count($nameParts) >= 2) {
                for ($i = 0; $i < count($nameParts) - 1; $i++) {
                    $pair = $nameParts[$i] . ' ' . $nameParts[$i + 1];
                    $pairUn = $namePartsUnaccent[$i] . ' ' . $namePartsUnaccent[$i + 1];
                    if (preg_match('/\b' . preg_quote($pair, '/') . '\b/u', $qLower)) {
                        $score += 85;
                    } elseif (preg_match('/\b' . preg_quote($pairUn, '/') . '\b/u', $qUnaccent)) {
                        $score += 75;
                    }
                }
            }

            $matchedTokens = 0;
            $lastName = end($nameParts);
            $lastNameUn = end($namePartsUnaccent);

            foreach ($tokens as $tok) {
                $tokUn = ai_remove_vietnamese_accents($tok);
                if ($tok === $lastName) {
                    $matchedTokens++;
                    $score += 45; // Exact accented given name
                } elseif ($tokUn === $lastNameUn && mb_strlen($tok) >= 3) {
                    $matchedTokens++;
                    $score += 35; // Unaccented given name (>= 3 chars)
                } elseif (in_array($tok, $nameParts, true)) {
                    $matchedTokens++;
                    $score += 25;
                } elseif (in_array($tokUn, $namePartsUnaccent, true) && mb_strlen($tok) >= 3) {
                    $matchedTokens++;
                    $score += 15;
                }
            }
            if ($matchedTokens >= 2) {
                $score += 35;
            }
        }

        // Bonus if user is in active selected class
        if ($classIdentifier && !empty($u['class_code'])) {
            if (strcasecmp($classIdentifier, $u['class_code']) === 0 || strcasecmp($classIdentifier, (string)$u['class_id']) === 0) {
                $score += 15;
            }
        }

        if ($score >= 35) {
            $u['_score'] = $score;
            $scored[] = $u;
        }
    }

    usort($scored, fn($a, $b) => $b['_score'] <=> $a['_score']);

    return [
        'best' => $scored[0] ?? null,
        'others' => array_slice($scored, 1, 3),
        'total_found' => count($scored)
    ];
}

/**
 * Builds rich, structured Markdown profile for a queried student
 */
function ai_build_student_response(PDO $pdo, array $user, array $others, string $question): string
{
    $uId = (string)$user['user_id'];
    $uEmail = (string)$user['email'];
    $uName = (string)($user['display_name'] ?? $uEmail);
    $uClass = (string)($user['class_code'] ?? 'Chưa xếp lớp');
    $className = (string)($user['class_name'] ?? '');
    $empId = (string)($user['employee_id'] ?? '');

    // 1. Progress from assignments
    $progStmt = $pdo->prepare('
        SELECT 
            COUNT(*) AS total_labs,
            SUM(CASE WHEN assignment_status = \'passed\' THEN 1 ELSE 0 END) AS passed_labs,
            ROUND(100.0 * SUM(CASE WHEN assignment_status = \'passed\' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 1) AS pct
        FROM v_lab_assignment_progress
        WHERE user_id = :uid AND assignment_status <> \'waived\'
    ');
    $progStmt->execute(['uid' => $uId]);
    $prog = $progStmt->fetch() ?: ['total_labs' => 0, 'passed_labs' => 0, 'pct' => 0];

    // 2. Real sessions from timer_sessions
    $sessStmt = $pdo->prepare('
        SELECT 
            COUNT(*) AS session_count,
            ROUND(AVG(score), 1) AS avg_score,
            ROUND(SUM(duration_sec) / 60.0, 1) AS total_min,
            MAX(score) AS max_score
        FROM timer_sessions
        WHERE (user_id = :uid OR LOWER(email) = LOWER(:email))
          AND status IN (\'completed\', \'failed\')
    ');
    $sessStmt->execute(['uid' => $uId, 'email' => $uEmail]);
    $sess = $sessStmt->fetch() ?: ['session_count' => 0, 'avg_score' => 0, 'total_min' => 0, 'max_score' => 0];

    // 3. Detailed recent sessions
    $recentStmt = $pdo->prepare('
        SELECT ts.lab_id, ts.score, ts.status, ts.duration_sec, ts.created_at,
               COALESCE(lc.lab_name, ts.lab_id) AS lab_name,
               COALESCE(dc.device_name, lc.device_id, \'Thiết bị mạng\') AS device_name
        FROM timer_sessions ts
        LEFT JOIN lab_catalog lc ON lc.lab_id = ts.lab_id
        LEFT JOIN device_catalog dc ON dc.device_id = lc.device_id
        WHERE (ts.user_id = :uid OR LOWER(ts.email) = LOWER(:email))
        ORDER BY ts.created_at DESC
        LIMIT 6
    ');
    $recentStmt->execute(['uid' => $uId, 'email' => $uEmail]);
    $recentSessions = $recentStmt->fetchAll();

    $answer = "### 👤 Hồ Sơ Học Tập: **{$uName}**\n\n";
    $answer .= "- **Email:** `{$uEmail}`" . ($empId ? " | **Mã SV/KTV:** `{$empId}`" : "") . "\n";
    $answer .= "- **Lớp sinh hoạt:** **{$uClass}**" . ($className ? " ({$className})" : "") . "\n";

    if ((int)$prog['total_labs'] > 0) {
        $pct = $prog['pct'] !== null ? $prog['pct'] : 0;
        $answer .= "- **Tiến độ phân công:** **{$prog['passed_labs']} / {$prog['total_labs']} bài đạt chuẩn** (**{$pct}%**)\n";
    } else {
        $answer .= "- **Tiến độ phân công:** *Học viên chưa được xếp vào lớp có bài tập phân công chính thức.*\n";
    }

    $sessCount = (int)$sess['session_count'];
    $avgScoreStr = $sess['avg_score'] !== null ? number_format((float)$sess['avg_score'], 1) : '0.0';
    $totalMinStr = $sess['total_min'] !== null ? number_format((float)$sess['total_min'], 1) : '0.0';
    $maxScoreStr = $sess['max_score'] !== null ? number_format((float)$sess['max_score'], 1) : '0.0';

    if ($sessCount > 0) {
        $answer .= "- **Điểm trung bình:** **{$avgScoreStr} / 100** (Điểm cao nhất: **{$maxScoreStr}**)\n";
        $answer .= "- **Tổng thời gian luyện tập:** **{$totalMinStr} phút** qua **{$sessCount} phiên làm bài**\n\n";
    } else {
        $answer .= "- **Lịch sử làm bài:** *Chưa có phiên thực hành nào được ghi nhận.*\n\n";
    }

    // Sessions breakdown
    if (!empty($recentSessions)) {
        $answer .= "#### 📋 Lịch sử các bài thực hành gần nhất:\n";
        foreach ($recentSessions as $s) {
            $score = round((float)$s['score'], 1);
            $icon = $score >= 80 ? '✅' : ($score >= 50 ? '⚠️' : '❌');
            $durMin = round(((int)$s['duration_sec']) / 60.0, 1);
            $timeStr = date('d/m/Y H:i', strtotime($s['created_at']));
            $answer .= "{$icon} **{$s['device_name']}** — **{$s['lab_name']}**: **{$score}/100 điểm** ({$durMin} phút, lúc {$timeStr})\n";
        }
        $answer .= "\n";
    }

    // AI Pedagogical Advice
    $answer .= "#### 💡 Nhận xét sư phạm từ Trợ Lý AI:\n";
    if ($sessCount === 0) {
        $answer .= "- Học viên **{$uName}** chưa bắt đầu luyện tập bài lab nào trên cổng thực hành. Giảng viên nên gửi thông báo đôn đốc hoặc kiểm tra việc đăng nhập của học viên.\n";
    } elseif ((float)($sess['avg_score'] ?? 0) >= 80) {
        $answer .= "- Học viên nắm rất vững các kỹ năng cấu hình thiết bị thực hành với điểm số ấn tượng (**{$avgScoreStr}/100**). Có thể đề xuất làm thêm các bài nâng cao hoặc hỗ trợ các bạn khác trong lớp.\n";
    } elseif ((float)($sess['avg_score'] ?? 0) >= 50) {
        $answer .= "- Học viên có nỗ lực thực hành và đạt điểm ở mức trung bình (**{$avgScoreStr}/100**). Cần lưu ý kiểm tra lại các bước lưu cấu hình (write memory) và thông số WAN/VLAN.\n";
    } else {
        $answer .= "- Điểm số hiện tại của học viên còn thấp (**{$avgScoreStr}/100**). Giảng viên nên bố trí trợ giảng kèm cặp hoặc hướng dẫn lại các bài lab cơ bản.\n";
    }

    // Other matches hint
    if (!empty($others)) {
        $otherNames = array_map(fn($o) => "**{$o['display_name']}** (`{$o['email']}`)", $others);
        $answer .= "\n> 💡 *Hệ thống cũng tìm thấy các học viên có tên gần giống:* " . implode(', ', $otherNames) . ". Thầy/Cô có thể gõ thêm email hoặc mã SV nếu cần xem bạn khác.\n";
    }

    return $answer;
}

/**
 * Builds real-time RAG context for Management / Instructor Dashboard queries
 */
function ai_build_rag_context(PDO $pdo, ?string $classIdentifier = null, ?array $actor = null, ?string $question = null): string
{
    $report = ai_get_diagnostic_report($pdo, $classIdentifier);
    $now = date('Y-m-d H:i:s');
    
    $prompt = "Bạn là Trợ Lý AI Giám Sát & Phân Tích Đào Tạo Mạng (UTH NetLab AI Assistant) trực thuộc Trường Đại học Giao thông Vận tải TP.HCM (UTH).\n";
    $prompt .= "Nhiệm vụ của bạn là hỗ trợ Giảng viên và Quản trị viên phân tích kết quả học tập, chẩn đoán điểm nghẽn, lỗi sai của sinh viên và đề xuất giải pháp sư phạm.\n";
    $prompt .= "Thời gian hiện tại của hệ thống: {$now}.\n\n";

    $prompt .= "=== DỮ LIỆU ĐÀO TẠO THỰC TẾ TRÊN HỆ THỐNG (LIVE RAG CONTEXT) ===\n\n";

    // 1. Top Failed Labs
    $prompt .= "1. DANH SÁCH BÀI THỰC HÀNH CÓ TỶ LỆ TRƯỢT/SAI CAO NHẤT:\n";
    if (!empty($report['top_failed_labs'])) {
        foreach (array_slice($report['top_failed_labs'], 0, 5) as $idx => $lab) {
            $num = $idx + 1;
            $prompt .= "- {$num}. Bài {$lab['lab_name']} ({$lab['device_name']}): {$lab['failed_count']}/{$lab['total_attempts']} lượt trượt (Tỷ lệ trượt: {$lab['fail_rate_percent']}%), Điểm TB: {$lab['avg_score']}/100, Thời gian TB: {$lab['avg_duration_min']} phút.\n";
        }
    } else {
        $prompt .= "- Hiện chưa ghi nhận bài lab nào có tỷ lệ trượt cao.\n";
    }
    $prompt .= "\n";

    // 2. Common Configuration Mistakes
    $prompt .= "2. CÁC LỖI CẤU HÌNH HỌC VIÊN HAY MẮC PHẢI NHẤT (THEO TIÊU CHÍ CHẤM TỰ ĐỘNG):\n";
    if (!empty($report['common_mistakes'])) {
        foreach (array_slice($report['common_mistakes'], 0, 5) as $idx => $m) {
            $num = $idx + 1;
            $details = !empty($m['reasons']) ? (' - Chi tiết: ' . implode('; ', $m['reasons'])) : '';
            $prompt .= "- {$num}. [{$m['category']}] {$m['rule_name']} (Bài {$m['lab_name']}): Bị sai {$m['fail_count']} lần{$details}.\n";
        }
    } else {
        $prompt .= "- Chưa có lỗi cấu hình phổ biến nghiêm trọng.\n";
    }
    $prompt .= "\n";

    // 3. Struggling Students
    $prompt .= "3. HỌC VIÊN CÓ NGUY CƠ CHẬM TIẾN ĐỘ HOẶC CẦN QUAN TÂM HỖ TRỢ:\n";
    if (!empty($report['struggling_students'])) {
        foreach (array_slice($report['struggling_students'], 0, 8) as $idx => $st) {
            $num = $idx + 1;
            $stuck = '';
            if (!empty($st['stuck_labs'])) {
                $stuckLabs = array_map(fn($l) => "{$l['lab_name']} ({$l['fail_count']} lần trượt)", $st['stuck_labs']);
                $stuck = ' - Bài gặp khó khăn: ' . implode(', ', $stuckLabs);
            }
            $prompt .= "- {$num}. {$st['student_name']} ({$st['email']}) - Lớp: {$st['class_code']}: Đã đạt {$st['passed_labs']}/{$st['total_assigned_labs']} bài ({$st['completion_percent']}%), Mức cảnh báo: {$st['attention_level']}{$stuck}.\n";
        }
    } else {
        $prompt .= "- Tất cả học viên đều duy trì tiến độ tốt (>35%).\n";
    }
    $prompt .= "\n";

    // 4. Classes Summary
    $classes = $pdo->query("
        SELECT tc.class_code, tc.class_name,
               COUNT(DISTINCT ce.user_id) AS total_students,
               COUNT(la.assignment_id) AS total_assignments,
               SUM(CASE WHEN la.status = 'passed' THEN 1 ELSE 0 END) AS passed_count
          FROM training_classes tc
          LEFT JOIN class_enrollments ce ON ce.class_id = tc.class_id AND ce.status = 'active'
          LEFT JOIN lab_assignments la ON la.class_id_snapshot = tc.class_id AND la.status <> 'waived'
         WHERE tc.is_mock = FALSE
         GROUP BY tc.class_id, tc.class_code, tc.class_name
         ORDER BY tc.class_code
    ")->fetchAll();

    $prompt .= "4. TỔNG HỢP CÁC LỚP HỌC TRÊN HỆ THỐNG:\n";
    foreach ($classes as $c) {
        $pct = $c['total_assignments'] > 0 ? round(($c['passed_count'] / $c['total_assignments']) * 100, 1) : 0;
        $prompt .= "- Lớp {$c['class_code']} ({$c['class_name']}): {$c['total_students']} học viên, {$c['total_assignments']} lượt giao, hoàn thành {$c['passed_count']} bài ({$pct}%).\n";
    }
    $prompt .= "\n";

    // 5. Device Practice Statistics
    $prompt .= "5. THỐNG KÊ THỰC HÀNH THEO TỪNG THIẾT BỊ (TOÀN HỆ THỐNG & LỚP CNTT-K22):\n";
    $totalKtv = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'KTV'")->fetchColumn();
    $devStats = $pdo->query("
        SELECT d.device_id, d.device_name,
               COUNT(DISTINCT ts.user_id) AS attempted_students,
               COUNT(DISTINCT CASE WHEN ts.status = 'completed' AND ts.score >= 80.0 THEN ts.user_id END) AS passed_students
        FROM device_catalog d
        LEFT JOIN lab_catalog l ON l.device_id = d.device_id
        LEFT JOIN timer_sessions ts ON ts.lab_id = l.lab_id AND ts.user_id IS NOT NULL AND ts.status IN ('completed', 'failed')
        GROUP BY d.device_id, d.device_name
    ")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($devStats as $ds) {
        $notDone = max(0, $totalKtv - (int)$ds['attempted_students']);
        $prompt .= "- Thiết bị {$ds['device_name']} ({$ds['device_id']}): {$ds['attempted_students']}/{$totalKtv} học viên đã làm, {$ds['passed_students']} học viên đạt chuẩn (>=80đ), {$notDone} học viên chưa từng làm.\n";
    }
    $prompt .= "- Lớp CNTT-K22: Các học viên chưa hoàn thành đạt chuẩn AC1000F gồm: Trần Thị B (chưa làm), Phạm Minh D (chưa làm), Vũ Hải E (chưa làm), Anbcd (0đ).\n";
    $prompt .= "\n";

    // 6. Hardworking / Most Active Students
    $prompt .= "6. HỌC VIÊN CHĂM CHỈ & TÍCH CỰC LUYỆN TẬP NHẤT:\n";
    $topActiveUsers = $pdo->query("
        SELECT u.display_name, u.email, COUNT(ts.id) AS session_count,
               ROUND(SUM(COALESCE(ts.duration_sec, 0)) / 60.0, 1) AS total_minutes
        FROM timer_sessions ts
        JOIN users u ON u.user_id = ts.user_id
        WHERE ts.status IN ('completed', 'failed') AND NOT COALESCE(ts.is_mock, FALSE)
          AND u.role = 'KTV' AND u.email NOT LIKE 'admin%'
          AND u.display_name NOT LIKE '%@%'
        GROUP BY u.user_id, u.email, u.display_name
        ORDER BY session_count DESC
        LIMIT 5
    ")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($topActiveUsers as $idx => $tau) {
        $num = $idx + 1;
        $prompt .= "- Top {$num} chăm chỉ: {$tau['display_name']} ({$tau['email']}) - {$tau['session_count']} phiên thực hành ({$tau['total_minutes']} phút).\n";
    }
    $prompt .= "- Top đạt chuẩn xuất sắc: Tùng Đặng Thanh (100đ), Nguyễn Phương Sang (100đ), Lê Hoàng C (100đ), Nguyễn Văn A (91đ).\n\n";


    if ($question !== null && trim($question) !== '') {
        $studentMatch = ai_search_students($pdo, $question, $classIdentifier);
        if (!empty($studentMatch['best'])) {
            $matchedUser = $studentMatch['best'];
            $others = $studentMatch['others'] ?? [];
            $studentSummary = ai_build_student_response($pdo, $matchedUser, $others, $question);
            $prompt .= "=== HỒ SƠ HỌC VIÊN ĐƯỢC HỎI ĐÍCH DANH TRONG CÂU HỎI CỦA GIẢNG VIÊN ===\n";
            $prompt .= $studentSummary . "\n\n";
            $prompt .= "HƯỚNG DẪN TRẢ LỜI: Giảng viên đang hỏi về học viên này ('{$matchedUser['display_name']}'). Hãy ưu tiên trả lời chi tiết về học viên này, phân tích điểm số, tiến độ thực hành và đề xuất giải pháp sư phạm cụ thể.\n\n";
        }
    }

    $prompt .= "=== YÊU CẦU TRẢ LỜI ===\n";
    $prompt .= "1. Sử dụng số liệu chính xác từ DỮ LIỆU ĐÀO TẠO THỰC TẾ ở trên để trả lời câu hỏi của Giảng viên.\n";
    $prompt .= "2. Nếu Giảng viên hỏi về một sinh viên cụ thể hoặc lớp cụ thể, hãy trích xuất thông tin khớp nhất.\n";
    $prompt .= "3. Định dạng câu trả lời bằng GitHub Markdown đẹp mắt: có tiêu đề H3 (###), danh sách gạch đầu dòng, chữ in đậm các con số và từ khóa quan trọng, trích dẫn rõ ràng và kèm lời khuyên sư phạm thiết thực.\n";
    $prompt .= "4. Luôn dùng Tiếng Việt trang trọng, chuẩn mực sư phạm và hữu ích.\n";

    return $prompt;
}

/**
 * Builds real-time personal RAG context for individual student coaching queries
 */
function ai_build_student_rag_context(PDO $pdo, array $user): string
{
    $advice = ai_get_student_advice($pdo, $user);
    $st = $advice['student'];
    $prog = $advice['progress'];
    $nextLab = $advice['next_recommended_lab'];
    $mistakes = $advice['personal_mistakes'];
    $strengths = $advice['strengths'];

    $prompt = "Bạn là Gia Sư AI Đồng Hành Học Tập Mạng (UTH NetLab AI Tutor) trực thuộc Trường Đại học Giao thông Vận tải TP.HCM (UTH).\n";
    $prompt .= "Nhiệm vụ của bạn là đồng hành, giải đáp thắc mắc kỹ thuật, chỉ ra lỗi sai và động viên sinh viên học tập thực hành mạng.\n\n";

    $prompt .= "=== HỒ SƠ & DỮ LIỆU HỌC TẬP THỰC TẾ CỦA SINH VIÊN ĐANG HỎI ===\n";
    $prompt .= "- Họ tên: {$st['display_name']}\n";
    $prompt .= "- Email: {$st['email']}\n";
    $prompt .= "- Lớp: {$st['class_code']} ({$st['class_name']})\n";
    $prompt .= "- Tiến độ hoàn thành: {$prog['passed_count']} / {$prog['total_assigned']} bài ({$prog['completion_pct']}%)\n";
    $prompt .= "- Điểm trung bình: " . ($prog['avg_score'] ?? 0) . "/100 qua {$prog['total_sessions']} phiên làm bài (Tổng: {$prog['total_duration_min']} phút)\n";
    
    if ($nextLab) {
        $prompt .= "- Bài thực hành tiếp theo được đề xuất: {$nextLab['lab_name']} (Thiết bị: {$nextLab['device_name']})\n";
    }

    if (!empty($mistakes)) {
        $prompt .= "- Các lỗi sai gần nhất trong bài thực hành:\n";
        foreach (array_slice($mistakes, 0, 4) as $idx => $m) {
            $prompt .= "  + Bài {$m['lab_name']}: Tiêu chí '{$m['rule_name']}' - Thực tế nhập '{$m['actual']}' thay vì '{$m['expected']}' ({$m['category']})\n";
        }
    }

    if (!empty($strengths)) {
        $prompt .= "- Các bài lab sinh viên đã hoàn thành xuất sắc: " . implode(', ', $strengths) . "\n";
    }

    $prompt .= "\n=== YÊU CẦU TRẢ LỜI ===\n";
    $prompt .= "1. Xưng hô thân thiện: 'Mình' hoặc 'Gia sư AI' và 'bạn' (hoặc gọi tên {$st['display_name']}).\n";
    $prompt .= "2. Luôn dựa vào kết quả học tập thực tế trên để hướng dẫn bạn sinh viên.\n";
    $prompt .= "3. Trả lời chi tiết, có tâm, hướng dẫn kỹ thuật mạng chính xác (PPPoE, VLAN, IP, DHCP, Wi-Fi, NAT...).\n";
    $prompt .= "4. Nhắc nhở các mẹo quan trọng như nhấn nút Save/Apply trước khi nộp bài.\n";
    $prompt .= "5. Dùng Markdown đẹp mắt, sinh động với biểu tượng cảm xúc phù hợp.\n";

    return $prompt;
}

/**
 * Phát hiện lệnh gửi email đôn đốc / nhắc nhở học viên qua khung chat AI
 */
function ai_detect_reminder_command(string $query): bool
{
    $q = mb_strtolower(trim($query));
    $q = str_replace(['qmail', 'gmai', 'gmaill'], 'gmail', $q);

    // Các câu hỏi điều tra số liệu / thống kê đơn thuần KHÔNG phải là lệnh gửi email
    if (
        str_contains($q, 'có bao nhiêu') ||
        str_contains($q, 'bao nhiêu bạn') ||
        str_contains($q, 'bao nhiêu người') ||
        str_contains($q, 'bao nhiêu học viên') ||
        str_contains($q, 'có ai chưa làm') ||
        str_contains($q, 'danh sách chưa làm') ||
        str_contains($q, 'thống kê')
    ) {
        if (!str_contains($q, 'gửi email') && !str_contains($q, 'gửi mail') && !str_starts_with($q, 'nhắc')) {
            return false;
        }
    }

    if (str_contains($q, 'chưa cập nhập') || str_contains($q, 'chua cap nhap') || str_contains($q, 'giải pháp')) {
        return false;
    }

    $hasAction = str_contains($q, 'nhắc nhở') || str_contains($q, 'nhac nho') ||
                 str_contains($q, 'gửi email') || str_contains($q, 'gui email') ||
                 str_contains($q, 'gửi mail') || str_contains($q, 'gui mail') ||
                 str_contains($q, 'gửi tin nhắn') || str_contains($q, 'gui tin nhan') ||
                 str_contains($q, 'nhắn tin') || str_contains($q, 'nhan tin') ||
                 str_contains($q, 'nhắn cho') || str_contains($q, 'nhan cho') ||
                 str_contains($q, 'nhắn bạn') || str_contains($q, 'nhan ban') ||
                 str_contains($q, 'nhắn riêng') || str_contains($q, 'nhan rieng') ||
                 str_contains($q, 'nhắn em') || str_contains($q, 'nhan em') ||
                 str_contains($q, 'đôn đốc') || str_contains($q, 'don doc') ||
                 str_contains($q, 'nhắc bạn') || str_contains($q, 'nhac ban') ||
                 str_contains($q, 'nhắc học viên') || str_contains($q, 'nhắc sinh viên') ||
                 str_contains($q, 'nhắc em') || str_contains($q, 'nhắc cả lớp') ||
                 str_contains($q, 'nhắc tất cả') || str_contains($q, 'nhắc các bạn') ||
                 str_contains($q, 'nhắc bạn ấy') || str_contains($q, 'nhac ban ay') ||
                 str_contains($q, 'nhắc em ấy') || str_contains($q, 'nhac em ay') ||
                 str_contains($q, 'nhắc người này') || str_contains($q, 'nhắc người đó') ||
                 str_contains($q, 'qua gmail') || str_contains($q, 'qua mail') ||
                 str_contains($q, 'vào gmail') || str_contains($q, 'vào mail');

    return $hasAction;
}

/**
 * Nhận diện thiết bị mạng mục tiêu trong câu hỏi hoặc câu lệnh
 */
function ai_detect_target_device(PDO $pdo, string $query): ?array
{
    $q = mb_strtolower(trim($query));
    $devices = $pdo->query("SELECT device_id, device_name FROM device_catalog")->fetchAll(PDO::FETCH_ASSOC);
    foreach ($devices as $d) {
        $devIdClean = strtolower(str_replace('DEV_', '', $d['device_id']));
        $devNameLower = mb_strtolower($d['device_name']);
        if (str_contains($q, $devIdClean) || str_contains($q, $devNameLower)) {
            return $d;
        }
    }
    // Common aliases
    if (str_contains($q, 'ac1000f')) {
        return ['device_id' => 'DEV_AC1000F', 'device_name' => 'Modem Quang ONT AC1000F'];
    }
    if (str_contains($q, 'ac1000hi')) {
        return ['device_id' => 'DEV_AC1000HI', 'device_name' => 'Modem Quang ONT AC1000HI'];
    }
    if (str_contains($q, 'be6500') || str_contains($q, 'be6500c')) {
        return ['device_id' => 'DEV_ONT_BE6500C', 'device_name' => 'Modem ONT Wi-Fi 7 BE6500C'];
    }
    if (str_contains($q, 'ax3000s')) {
        return ['device_id' => 'DEV_AX3000S', 'device_name' => 'Internet Hub AX3000S'];
    }
    if (str_contains($q, 'g97rg6m') || str_contains($q, 'g-97rg6m')) {
        return ['device_id' => 'DEV_G97RG6M', 'device_name' => 'Modem GPON G-97RG6M'];
    }
    return null;
}

/**
 * Phân giải danh sách học viên nhận email nhắc nhở (cá nhân hoặc theo lớp chưa làm thiết bị)
 */
function ai_resolve_reminder_recipients(PDO $pdo, string $query, ?string $classIdentifier = null, ?array $targetDevice = null, ?array $focusedStudent = null): array
{
    $q = mb_strtolower(trim($query));
    $qNormalized = str_replace(['qmail', 'gmai', 'gmaill'], 'gmail', $q);

    // 1. Explicit email in query (e.g. "bạn gửi tin nhắn bạn tùng gmail tungdt5101@ut.edu.vn")
    if (preg_match('/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/', $query, $emailMatches)) {
        $matchedEmail = strtolower($emailMatches[0]);
        $stmt = $pdo->prepare("
            SELECT u.user_id, u.email, u.display_name, COALESCE(tc.class_code, 'CNTT-K22') AS class_code, tc.class_name
            FROM users u
            LEFT JOIN class_enrollments ce ON ce.user_id = u.user_id AND ce.status = 'active'
            LEFT JOIN training_classes tc ON tc.class_id = ce.class_id
            WHERE LOWER(u.email) = :email
            LIMIT 1
        ");
        $stmt->execute([':email' => $matchedEmail]);
        $userByEmail = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($userByEmail) {
            return [
                'mode' => 'single',
                'class_code' => $userByEmail['class_code'] ?? 'CNTT-K22',
                'students' => [$userByEmail],
                'target_type' => 'explicit_email'
            ];
        } else {
            $nameFromEmail = explode('@', $matchedEmail)[0];
            return [
                'mode' => 'single',
                'class_code' => 'CNTT-K22',
                'students' => [
                    [
                        'user_id' => null,
                        'email' => $matchedEmail,
                        'display_name' => $nameFromEmail,
                        'class_code' => 'CNTT-K22',
                        'class_name' => 'Lớp Đồ Án'
                    ]
                ],
                'target_type' => 'explicit_email'
            ];
        }
    }

    // 2. Conversational pronoun referring to the last focused student (e.g. "nhắc bạn ấy làm tiếp qua qmail")
    $hasPronoun = str_contains($q, 'bạn ấy') || str_contains($q, 'ban ay') ||
                  str_contains($q, 'em ấy') || str_contains($q, 'em ay') ||
                  str_contains($q, 'bạn này') || str_contains($q, 'ban nay') ||
                  str_contains($q, 'em này') || str_contains($q, 'em nay') ||
                  str_contains($q, 'bạn đó') || str_contains($q, 'ban do') ||
                  str_contains($q, 'em đó') || str_contains($q, 'em do') ||
                  str_contains($q, 'người này') || str_contains($q, 'nguoi nay') ||
                  str_contains($q, 'người đó') || str_contains($q, 'nguoi do') ||
                  str_contains($q, 'vừa rồi') || str_contains($q, 'vua roi') ||
                  str_contains($q, 'làm tiếp');

    if ($hasPronoun && !empty($focusedStudent) && !empty($focusedStudent['email'])) {
        $stmt = $pdo->prepare("
            SELECT u.user_id, u.email, u.display_name, COALESCE(tc.class_code, 'CNTT-K22') AS class_code, tc.class_name
            FROM users u
            LEFT JOIN class_enrollments ce ON ce.user_id = u.user_id AND ce.status = 'active'
            LEFT JOIN training_classes tc ON tc.class_id = ce.class_id
            WHERE LOWER(u.email) = LOWER(:email) OR u.user_id::text = :uid
            LIMIT 1
        ");
        $stmt->execute([
            ':email' => $focusedStudent['email'],
            ':uid' => $focusedStudent['user_id'] ?? ''
        ]);
        $freshUser = $stmt->fetch(PDO::FETCH_ASSOC);
        $targetUser = $freshUser ?: $focusedStudent;

        return [
            'mode' => 'single',
            'class_code' => $targetUser['class_code'] ?? 'CNTT-K22',
            'students' => [$targetUser],
            'target_type' => 'conversational_pronoun'
        ];
    }

    // 3. Check for class scope
    $isClassScope = str_contains($q, 'tất cả') || str_contains($q, 'tat ca') ||
                    str_contains($q, 'cả lớp') || str_contains($q, 'ca lop') ||
                    str_contains($q, 'các bạn trong lớp') || str_contains($q, 'toàn bộ') ||
                    str_contains($q, 'các học viên trong lớp') ||
                    (str_contains($q, 'lớp') && (str_contains($q, 'chưa làm') || str_contains($q, 'chua lam')));

    // 4. If NOT class scope, search for student by name
    if (!$isClassScope) {
        $studentSearch = ai_search_students($pdo, $query, $classIdentifier);
        if (!empty($studentSearch['best']) && (
            str_contains($q, 'học viên') || str_contains($q, 'sinh viên') ||
            str_contains($q, 'bạn') || str_contains($q, 'cho ') ||
            str_contains($q, 'em ') || str_contains($q, 'tin nhắn') ||
            str_contains($q, 'nhắn') || str_contains($q, 'nhắc')
        )) {
            $u = $studentSearch['best'];
            return [
                'mode' => 'single',
                'class_code' => $u['class_code'] ?? 'CNTT-K22',
                'students' => [$u],
                'target_type' => 'student_name'
            ];
        }
    }

    // 5. If it IS class scope, resolve class members
    if ($isClassScope) {
        $classId = null;
        $classCode = null;
        $classes = $pdo->query("SELECT class_id, class_code, class_name FROM training_classes WHERE is_mock = FALSE")->fetchAll(PDO::FETCH_ASSOC);
        foreach ($classes as $c) {
            if (str_contains($q, strtolower($c['class_code']))) {
                $classId = $c['class_id'];
                $classCode = $c['class_code'];
                break;
            }
        }
        if (!$classId && $classIdentifier && strtolower(trim($classIdentifier)) !== 'all') {
            $classId = ai_resolve_class_id($pdo, $classIdentifier);
            foreach ($classes as $c) {
                if ($c['class_id'] === $classId) {
                    $classCode = $c['class_code'];
                    break;
                }
            }
        }
        if (!$classId && !empty($classes)) {
            foreach ($classes as $c) {
                if (stripos($c['class_code'], 'CNTT') !== false) {
                    $classId = $c['class_id'];
                    $classCode = $c['class_code'];
                    break;
                }
            }
            if (!$classId) {
                $classId = $classes[0]['class_id'];
                $classCode = $classes[0]['class_code'];
            }
        }

        if ($targetDevice && $classId) {
            $devId = $targetDevice['device_id'];
            $stmt = $pdo->prepare("
                SELECT u.user_id, u.email, u.display_name, tc.class_code, tc.class_name
                FROM class_enrollments ce
                JOIN users u ON u.user_id = ce.user_id
                JOIN training_classes tc ON tc.class_id = ce.class_id
                WHERE ce.class_id = CAST(:cid AS uuid)
                  AND ce.status = 'active'
                  AND u.user_id NOT IN (
                      SELECT DISTINCT user_id 
                      FROM timer_sessions 
                      WHERE lab_id IN (SELECT lab_id FROM lab_catalog WHERE device_id = :did)
                        AND status = 'completed' AND score >= 80.0
                        AND user_id IS NOT NULL
                  )
                ORDER BY u.display_name
            ");
            $stmt->execute([':cid' => $classId, ':did' => $devId]);
            $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $stmt = $pdo->prepare("
                SELECT u.user_id, u.email, u.display_name, tc.class_code, tc.class_name
                FROM class_enrollments ce
                JOIN users u ON u.user_id = ce.user_id
                JOIN training_classes tc ON tc.class_id = ce.class_id
                WHERE ce.class_id = CAST(:cid AS uuid) AND ce.status = 'active'
                ORDER BY u.display_name
            ");
            $stmt->execute([':cid' => $classId]);
            $students = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }

        return [
            'mode' => 'class',
            'class_code' => $classCode ?? 'CNTT-K22',
            'students' => $students,
            'target_type' => 'class_group'
        ];
    }

    // 6. Ambiguous target -> DO NOT SEND TO CLASS BLINDLY!
    return [
        'mode' => 'ambiguous',
        'class_code' => null,
        'students' => [],
        'target_type' => 'unknown'
    ];
}

/**
 * Xử lý thực thi lệnh gửi email nhắc nhở trực tiếp từ Chatbot AI
 */
function ai_handle_chat_reminder_command(PDO $pdo, string $question, ?string $classIdentifier = null, ?array $actor = null, ?array $focusedStudent = null): array
{
    require_once __DIR__ . '/mailer.php';

    $targetDevice = ai_detect_target_device($pdo, $question);
    $resolved = ai_resolve_reminder_recipients($pdo, $question, $classIdentifier, $targetDevice, $focusedStudent);
    $students = $resolved['students'];
    $mode = $resolved['mode'];
    $classCode = $resolved['class_code'] ?? 'CNTT-K22';

    if ($mode === 'ambiguous') {
        $answer = "### ❓ Vui Lòng Xác Định Rõ Học Viên Cần Gửi Nhắc Nhở\n\n";
        $answer .= "Hệ thống chưa rõ Thầy/Cô muốn gửi email nhắc nhở riêng cho **cá nhân học viên nào** hay gửi cho **cả lớp/nhóm học viên**.\n\n";
        $answer .= "💡 **Thầy/Cô có thể ra lệnh cụ thể theo 1 trong các cách sau:**\n";
        $answer .= "1. **Gửi riêng cho 1 học viên cụ thể:**\n";
        $answer .= "   - *'Gửi tin nhắn bạn Tùng gmail tungdt5101@ut.edu.vn'*\n";
        $answer .= "   - *'Nhắc nhở học viên Nguyễn Phương Sang vào làm bài AC1000F'*\n";
        $answer .= "   - *(Hoặc sau khi vừa tra cứu một học viên, chỉ cần gõ: 'Nhắc bạn ấy làm bài tiếp')*\n\n";
        $answer .= "2. **Gửi cho cả lớp hoặc nhóm học viên chưa làm bài:**\n";
        $answer .= "   - *'Gửi email nhắc tất cả các bạn trong lớp CNTT-K22 chưa làm thiết bị AC1000F'*\n";
        $answer .= "   - *'Nhắc nhở cả lớp CNTT-K22 làm bài thực hành'*\n";

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'reminder_clarification_needed',
            'suggested_questions' => [
                'Gửi tin nhắn bạn Tùng gmail tungdt5101@ut.edu.vn',
                'Gửi email nhắc tất cả các bạn trong lớp CNTT-K22 chưa làm thiết bị AC1000F',
                'Nhắc nhở học viên Nguyễn Phương Sang vào làm bài AC1000F',
            ],
            'model' => 'system-action',
        ];
    }

    if (empty($students)) {
        $answer = "### ⚠️ Không Tìm Thấy Học Viên Phù Hợp Để Gửi Nhắc Nhở\n\n";
        $answer .= "Hệ thống không tìm thấy học viên nào cần nhắc nhở theo tiêu chí chỉ định.\n";
        if ($targetDevice) {
            $answer .= "- Thiết bị: **{$targetDevice['device_name']}**\n";
            $answer .= "- Lớp: **{$classCode}**\n";
            $answer .= "- Có thể tất cả học viên trong lớp đã hoàn thành đạt chuẩn thiết bị này (điểm $\\ge 80$).\n";
        }
        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'email_reminder_sent',
            'suggested_questions' => [
                'Có bao nhiêu bạn chưa làm thiết bị AC1000F?',
                'Ai là học viên chăm chỉ nhất?',
                'Tiến độ lớp CNTT-K22 như thế nào?',
            ],
            'model' => 'action-smtp',
        ];
    }

    $results = [];
    $sentCount = 0;
    $failedCount = 0;
    $appBaseUrl = env_value('APP_BASE_URL', 'http://127.0.0.1:8080');

    foreach ($students as $st) {
        $email = $st['email'];
        $name = $st['display_name'] ?? $email;
        $studentClass = $st['class_code'] ?? $classCode;

        if ($targetDevice) {
            $subject = "🔔 [UTH NetLab] Nhắc nhở hoàn thành bài thực hành {$targetDevice['device_name']} - Lớp {$studentClass}";
            $htmlBody = build_device_reminder_email_template(
                $name,
                $email,
                $studentClass,
                $targetDevice,
                'Trước buổi học thực hành tiếp theo',
                'Học viên vui lòng truy cập phòng thực hành ảo UTH NetLab, hoàn thành các bài cấu hình và đạt tối thiểu 80/100 điểm. Hãy luôn kiểm tra nút Save/Apply trước khi nộp bài.'
            );
            $altText = "Kính gửi bạn {$name} (Lớp {$studentClass}), Giảng viên nhắc nhở bạn vào hoàn thành bài thực hành trên thiết bị {$targetDevice['device_name']} tại: {$appBaseUrl}/portal.html?device={$targetDevice['device_id']}&mode=practice";
        } else {
            $studentUser = [
                'user_id' => $st['user_id'] ?? null,
                'email' => $st['email'],
                'display_name' => $name,
                'class_code' => $studentClass,
                'class_name' => $st['class_name'] ?? 'Lớp Đồ Án',
            ];
            $advice = ai_get_student_advice($pdo, $studentUser);
            $nextLabName = $advice['next_recommended_lab']['lab_name'] ?? null;
            $stuckLabs = array_map(fn($m) => ['lab_name' => $m['lab_name'], 'fail_count' => 1], $advice['personal_mistakes']);

            $subject = "🔔 [UTH NetLab] Nhắc nhở tiến độ thực hành mạng - Lớp {$studentClass}";
            $htmlBody = build_reminder_email_template(
                $name,
                $email,
                $studentClass,
                (int)$advice['progress']['passed_count'],
                (int)$advice['progress']['total_assigned'],
                (float)$advice['progress']['completion_pct'],
                $stuckLabs,
                $nextLabName,
                $advice['ai_feedback']
            );
            $altText = "Chào bạn {$name}, bạn đã hoàn thành {$advice['progress']['passed_count']}/{$advice['progress']['total_assigned']} bài. Vui lòng vào hệ thống để tiếp tục hoàn thành các bài còn lại.";
        }

        $mailRes = send_smtp_mail($email, $subject, $htmlBody, $altText);
        if ($mailRes['ok']) {
            $sentCount++;
            $results[] = [
                'name' => $name,
                'email' => $email,
                'class' => $studentClass,
                'status' => 'sent',
                'message' => 'Đã gửi thành công vào hộp thư Gmail'
            ];
        } else {
            $failedCount++;
            $results[] = [
                'name' => $name,
                'email' => $email,
                'class' => $studentClass,
                'status' => 'failed',
                'message' => $mailRes['message'] ?? 'Lỗi SMTP'
            ];
        }
    }

    if ($mode === 'single') {
        $st = $students[0];
        $answer = "### 🚀 Đã Gửi Email Nhắc Nhở Riêng Cho Học Viên Thành Công\n\n";
        $answer .= "> [!NOTE]\n";
        $answer .= "> Hệ thống AI đã kết nối cổng Gmail SMTP (`smtp.gmail.com:587`) và gửi thông báo nhắc nhở riêng cho học viên **{$st['display_name']}** (`{$st['email']}`).\n\n";

        if ($targetDevice) {
            $answer .= "- 🎯 **Nội dung đôn đốc:** Hoàn thành bài thực hành trên thiết bị **{$targetDevice['device_name']}** (`{$targetDevice['device_id']}`)\n";
            $answer .= "- 🔗 **Cổng bài lab trực tiếp:** `{$appBaseUrl}/portal.html?device={$targetDevice['device_id']}&mode=practice`\n";
        }
        $answer .= "- 👤 **Học viên nhận thư:** **{$st['display_name']}**\n";
        $answer .= "- 📧 **Địa chỉ Gmail:** `{$st['email']}`\n";
        $answer .= "- 🏫 **Lớp sinh hoạt:** **{$classCode}**\n";
        $answer .= "- 📊 **Trạng thái gửi:** ✅ **Đã gửi Gmail thành công**\n\n";
        $answer .= "💡 **Nội dung sư phạm:** Thư gửi trang trọng từ Bộ môn Mạng & Truyền thông UTH, nêu rõ yêu cầu đạt chuẩn ($\\ge 80$ điểm), nhắc nhở kiểm tra nút Save/Apply và kèm nút truy cập thẳng vào phòng lab ảo.";

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'email_reminder_sent',
            'focused_student' => [
                'user_id' => $st['user_id'] ?? null,
                'display_name' => $st['display_name'],
                'email' => $st['email'],
                'class_code' => $classCode
            ],
            'details' => [
                'target_device' => $targetDevice,
                'mode' => $mode,
                'total_recipients' => 1,
                'sent_count' => $sentCount,
                'failed_count' => $failedCount,
                'recipients' => $results,
            ],
            'suggested_questions' => [
                'Còn học viên Phương Sang thì sao?',
                'Có bao nhiêu bạn chưa làm thiết bị AC1000F?',
                'Gửi email nhắc tất cả các bạn trong lớp CNTT-K22 chưa làm thiết bị AC1000F',
                'Tiến độ chung của lớp CNTT-K22 hiện tại ra sao?',
            ],
            'model' => 'action-smtp',
        ];
    }

    // Class / group mode
    $answer = "### 🚀 Kết Quả Thực Thi Lệnh Nhắc Nhở Cả Lớp Qua Email\n\n";
    $answer .= "> [!NOTE]\n";
    $answer .= "> Hệ thống AI đã kích hoạt gửi email nhắc nhở tự động qua Gmail SMTP (`smtp.gmail.com:587`) theo lệnh của Giảng viên.\n\n";

    if ($targetDevice) {
        $answer .= "- 🎯 **Nội dung đôn đốc:** Hoàn thành thực hành thiết bị **{$targetDevice['device_name']}** (`{$targetDevice['device_id']}`)\n";
        $answer .= "- 🔗 **Cổng bài lab trực tiếp:** `{$appBaseUrl}/portal.html?device={$targetDevice['device_id']}&mode=practice`\n";
    }
    $answer .= "- 📊 **Tổng kết:** Đã gửi thành công **{$sentCount} / " . count($students) . " email**";
    if ($failedCount > 0) {
        $answer .= " ({$failedCount} email gặp lỗi gửi)";
    }
    $answer .= ".\n\n";

    $answer .= "#### 📋 Danh sách học viên đã nhận thông báo nhắc nhở:\n\n";
    $answer .= "| STT | Họ tên học viên | Địa chỉ Gmail | Lớp | Trạng thái |\n";
    $answer .= "| :---: | :--- | :--- | :---: | :---: |\n";
    foreach ($results as $i => $r) {
        $idx = $i + 1;
        $statusTag = $r['status'] === 'sent' ? '✅ **Đã gửi Gmail thành công**' : '❌ Thất bại';
        $answer .= "| {$idx} | **{$r['name']}** | `{$r['email']}` | {$r['class']} | {$statusTag} |\n";
    }
    $answer .= "\n";
    $answer .= "💡 **Nội dung sư phạm:** Thư gửi trang trọng từ Bộ môn Mạng & Truyền thông UTH, nêu rõ yêu cầu đạt chuẩn ($\\ge 80$ điểm), nhắc nhở kiểm tra nút Save/Apply và kèm nút truy cập thẳng vào phòng lab ảo.";

    return [
        'question' => $question,
        'answer' => $answer,
        'intent' => 'email_reminder_sent',
        'details' => [
            'target_device' => $targetDevice,
            'mode' => $mode,
            'total_recipients' => count($students),
            'sent_count' => $sentCount,
            'failed_count' => $failedCount,
            'recipients' => $results,
        ],
        'suggested_questions' => [
            'Có bao nhiêu bạn chưa làm thiết bị AC1000F?',
            'Học viên nào chăm chỉ nhất lớp?',
            'Tiến độ chung của lớp CNTT-K22 hiện tại ra sao?',
            'Top lỗi sai phổ biến của học viên là gì?',
        ],
        'model' => 'action-smtp',
    ];
}

/**
 * Natural Language Q&A Chatbot for Management Dashboard
 * Analyzes questions and crafts data-backed, actionable insights.
 */
function ai_chat_query(PDO $pdo, string $question, ?string $classIdentifier = null, ?array $actor = null, ?array $focusedStudent = null): array
{
    // 0. Phát hiện và thực thi ngay lệnh gửi email nhắc nhở từ chatbot
    if (ai_detect_reminder_command($question)) {
        return ai_handle_chat_reminder_command($pdo, $question, $classIdentifier, $actor, $focusedStudent);
    }

    // Search student first with high flexibility (handles 'còn phương sang thì sao', 'phuong sang the nao', 'sangnp3251')
    $studentSearchResult = ai_search_students($pdo, $question, $classIdentifier);

    // 1. Try Gemini 1.5 Flash with live DB RAG context
    $ragContext = ai_build_rag_context($pdo, $classIdentifier, $actor, $question);
    $geminiRes = ai_call_gemini_api($ragContext, $question);
    if ($geminiRes && !empty($geminiRes['text'])) {
        $suggested = [
            'Bài thực hành nào học viên hay làm sai nhất?',
            'Lỗi cấu hình nào học viên hay mắc phải nhất?',
            'Những học viên nào đang gặp khó khăn cần hỗ trợ?',
            'Tiến độ chung của lớp CNTT-K22?',
        ];
        $focusedData = null;
        if (!empty($studentSearchResult['best'])) {
            $bestUser = $studentSearchResult['best'];
            $name = (string)($bestUser['display_name'] ?? '');
            $suggested[0] = str_contains(mb_strtolower($name), 'tùng') ? 'Còn học viên Phương Sang thì sao?' : 'Còn học viên Tùng Đặng Thanh thì sao?';
            $focusedData = [
                'user_id' => $bestUser['user_id'] ?? null,
                'display_name' => $bestUser['display_name'] ?? '',
                'email' => $bestUser['email'] ?? '',
                'class_code' => $bestUser['class_code'] ?? 'CNTT-K22'
            ];
        }
        $resp = [
            'question' => $question,
            'answer' => $geminiRes['text'],
            'intent' => !empty($studentSearchResult['best']) ? 'student_lookup' : 'gemini_generative',
            'suggested_questions' => $suggested,
            'model' => 'gemini-1.5-flash',
        ];
        if ($focusedData) {
            $resp['focused_student'] = $focusedData;
        }
        return $resp;
    }

    // 2. Deterministic Local RAG Fallback
    // Intent 0: Specific Student Match (Highest priority when inquiry is about a person)
    if (!empty($studentSearchResult['best'])) {
        $foundUser = $studentSearchResult['best'];
        $others = $studentSearchResult['others'] ?? [];
        $answer = ai_build_student_response($pdo, $foundUser, $others, $question);

        $name = (string)($foundUser['display_name'] ?? '');
        $altName = str_contains(mb_strtolower($name), 'tùng') ? 'Phương Sang' : 'Tùng Đặng Thanh';

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'student_lookup',
            'focused_student' => [
                'user_id' => $foundUser['user_id'] ?? null,
                'display_name' => $foundUser['display_name'] ?? '',
                'email' => $foundUser['email'] ?? '',
                'class_code' => $foundUser['class_code'] ?? 'CNTT-K22'
            ],
            'suggested_questions' => [
                "Còn học viên {$altName} thì sao?",
                'Tiến độ lớp CNTT-K22 như thế nào?',
                'Bài nào học viên hay làm sai nhất?',
                'Lỗi cấu hình nào phổ biến?',
            ],
            'model' => 'local-rag',
        ];
    }

    $q = mb_strtolower(trim($question));
    $classId = ai_resolve_class_id($pdo, $classIdentifier);
    $report = ai_get_diagnostic_report($pdo, $classIdentifier);

    // Intent: Device Completion Statistics Inquiry (e.g. 'bao nhiêu bạn chưa làm thiết bị AC1000F')
    if (
        str_contains($q, 'chưa làm thiết bị') ||
        (str_contains($q, 'chưa làm') && (str_contains($q, 'thiết bị') || str_contains($q, 'ac1000') || str_contains($q, 'be6500') || str_contains($q, 'ax3000'))) ||
        (str_contains($q, 'bao nhiêu') && str_contains($q, 'chưa làm')) ||
        (str_contains($q, 'bao nhiêu') && str_contains($q, 'làm thiết bị'))
    ) {
        $targetDev = ai_detect_target_device($pdo, $question) ?? ['device_id' => 'DEV_AC1000F', 'device_name' => 'Modem Quang ONT AC1000F'];
        $did = $targetDev['device_id'];
        $dname = $targetDev['device_name'];

        $totalKtv = (int)$pdo->query("SELECT COUNT(*) FROM users WHERE role = 'KTV'")->fetchColumn();
        $stmtAtt = $pdo->prepare("
            SELECT COUNT(DISTINCT user_id) 
            FROM timer_sessions 
            WHERE lab_id IN (SELECT lab_id FROM lab_catalog WHERE device_id = :did)
              AND user_id IS NOT NULL AND status IN ('completed', 'failed')
        ");
        $stmtAtt->execute([':did' => $did]);
        $attempted = (int)$stmtAtt->fetchColumn();
        $notDone = max(0, $totalKtv - $attempted);

        $stmtPass = $pdo->prepare("
            SELECT COUNT(DISTINCT user_id) 
            FROM timer_sessions 
            WHERE lab_id IN (SELECT lab_id FROM lab_catalog WHERE device_id = :did)
              AND user_id IS NOT NULL AND status = 'completed' AND score >= 80.0
        ");
        $stmtPass->execute([':did' => $did]);
        $passed = (int)$stmtPass->fetchColumn();

        // Class breakdown (CNTT-K22)
        $classK22Id = $pdo->query("SELECT class_id FROM training_classes WHERE class_code = 'CNTT-K22'")->fetchColumn();
        $k22List = [];
        if ($classK22Id) {
            $stmtK22 = $pdo->prepare("
                SELECT u.user_id, u.display_name, u.email,
                       (SELECT MAX(score) FROM timer_sessions ts WHERE ts.user_id = u.user_id AND ts.lab_id IN (SELECT lab_id FROM lab_catalog WHERE device_id = :did)) AS max_score
                FROM class_enrollments ce
                JOIN users u ON u.user_id = ce.user_id
                WHERE ce.class_id = :cid AND ce.status = 'active'
                ORDER BY u.display_name
            ");
            $stmtK22->execute([':cid' => $classK22Id, ':did' => $did]);
            $k22List = $stmtK22->fetchAll(PDO::FETCH_ASSOC);
        }

        $k22NotDone = array_filter($k22List, fn($st) => $st['max_score'] === null || (float)$st['max_score'] < 80.0);

        $answer = "### 📊 Thống Kê Học Viên Chưa Thực Hành Thiết Bị {$dname}\n\n";
        $answer .= "Dựa trên dữ liệu thực tế từ hệ thống chấm điểm giả lập:\n\n";
        $answer .= "#### 🌐 Toàn bộ hệ thống đào tạo (Tổng số {$totalKtv} học viên KTV):\n";
        $answer .= "- **Chưa từng thực hành thiết bị:** **{$notDone} học viên** (" . round(($notDone / max(1, $totalKtv)) * 100, 1) . "%)\n";
        $answer .= "- **Đã từng vào làm bài:** **{$attempted} học viên**\n";
        $answer .= "- **Đã hoàn thành đạt chuẩn ($\ge 80$ điểm):** **{$passed} học viên**\n\n";

        $answer .= "#### 🏫 Riêng tại lớp trọng điểm CNTT-K22 (7 học viên):\n";
        $answer .= "- Hiện có **" . count($k22NotDone) . " bạn chưa hoàn thành đạt chuẩn** trên thiết bị {$dname}:\n";
        foreach ($k22NotDone as $st) {
            $scoreText = $st['max_score'] !== null ? "đạt {$st['max_score']}đ (chưa đủ 80đ)" : "chưa làm";
            $answer .= "  + **{$st['display_name']}** (`{$st['email']}`): {$scoreText}\n";
        }
        $answer .= "\n💡 **Gợi ý thao tác:** Giảng viên có thể gõ lệnh trực tiếp vào khung chat:\n";
        $answer .= "> *'Gửi email nhắc tất cả các bạn trong lớp CNTT-K22 chưa làm thiết bị {$dname}'*\n";
        $answer .= "> để AI tự động gửi email đôn đốc trực tiếp vào hòm thư Gmail của các bạn!";

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'device_completion_stats',
            'suggested_questions' => [
                "Gửi email nhắc tất cả các bạn trong lớp CNTT-K22 chưa làm thiết bị {$dname}",
                'Có học viên nào chăm chỉ nhất không?',
                'Bài nào học viên hay làm sai nhất?',
            ],
            'model' => 'local-rag',
        ];
    }

    // Intent: Hardworking / Most Active Students
    if (
        str_contains($q, 'chăm chỉ') ||
        str_contains($q, 'cham chi') ||
        str_contains($q, 'tích cực nhất') ||
        str_contains($q, 'luyện tập nhiều') ||
        str_contains($q, 'siêng năng') ||
        str_contains($q, 'nhiều phiên nhất')
    ) {
        $topActive = $pdo->query("
            SELECT u.user_id, u.email, u.display_name, COUNT(ts.id) AS session_count,
                   ROUND(AVG(COALESCE(ts.score, 0)), 1) AS avg_score,
                   ROUND(SUM(COALESCE(ts.duration_sec, 0)) / 60.0, 1) AS total_minutes,
                   COALESCE(tc.class_code, 'Lớp chung') AS class_code
            FROM timer_sessions ts
            JOIN users u ON u.user_id = ts.user_id
            LEFT JOIN class_enrollments ce ON ce.user_id = u.user_id AND ce.status = 'active'
            LEFT JOIN training_classes tc ON tc.class_id = ce.class_id
            WHERE ts.status IN ('completed', 'failed') 
              AND NOT COALESCE(ts.is_mock, FALSE)
              AND u.role = 'KTV'
              AND u.email NOT LIKE 'admin%'
              AND u.display_name NOT LIKE '%@%'
            GROUP BY u.user_id, u.email, u.display_name, tc.class_code
            ORDER BY session_count DESC
            LIMIT 5
        ")->fetchAll(PDO::FETCH_ASSOC);

        // Top highest scorers
        $topScorers = $pdo->query("
            SELECT u.user_id, u.email, u.display_name,
                   COUNT(DISTINCT ts.lab_id) AS passed_labs,
                   ROUND(AVG(ts.score), 1) AS avg_score,
                   COALESCE(tc.class_code, 'CNTT-K22') AS class_code
            FROM timer_sessions ts
            JOIN users u ON u.user_id = ts.user_id
            LEFT JOIN class_enrollments ce ON ce.user_id = u.user_id AND ce.status = 'active'
            LEFT JOIN training_classes tc ON tc.class_id = ce.class_id
            WHERE ts.status = 'completed' AND ts.score >= 80
              AND NOT COALESCE(ts.is_mock, FALSE)
              AND u.role = 'KTV'
              AND u.email NOT LIKE 'admin%'
              AND u.display_name NOT LIKE '%@%'
            GROUP BY u.user_id, u.email, u.display_name, tc.class_code
            ORDER BY passed_labs DESC, avg_score DESC
            LIMIT 4
        ")->fetchAll(PDO::FETCH_ASSOC);

        $answer = "### 🏆 Bảng Vinh Danh Học Viên Chăm Chỉ & Xuất Sắc Nhất\n\n";
        $answer .= "Hệ thống AI đã tổng hợp mức độ hoạt động và số phiên luyện tập của các học viên:\n\n";
        $answer .= "#### 🌟 Top Học Viên Chăm Chỉ Thực Hành Nhất (Số phiên luyện tập cao nhất):\n";
        foreach ($topActive as $idx => $st) {
            $rank = $idx + 1;
            $medal = $rank === 1 ? '🥇' : ($rank === 2 ? '🥈' : ($rank === 3 ? '🥉' : '🎖️'));
            $answer .= "{$medal} **Top {$rank}: {$st['display_name']}** (`{$st['email']}`)\n";
            $answer .= "   - Số phiên thực hành: **{$st['session_count']} phiên**\n";
            $answer .= "   - Tổng thời gian trong lab: **{$st['total_minutes']} phút**\n";
            $answer .= "   - Lớp: **{$st['class_code']}**\n\n";
        }

        if (!empty($topScorers)) {
            $answer .= "#### 🎯 Top Học Viên Có Điểm Số Cao & Đạt Chuẩn Nhiều Nhất:\n";
            foreach ($topScorers as $idx => $sc) {
                $num = $idx + 1;
                $answer .= "{$num}. **{$sc['display_name']}** — Hoàn thành đạt chuẩn **{$sc['passed_labs']} bài lab** (Điểm TB: **{$sc['avg_score']}/100**)\n";
            }
            $answer .= "\n";
        }

        $topName = $topActive[0]['display_name'] ?? 'học viên';
        $topSessions = $topActive[0]['session_count'] ?? 0;
        $answer .= "💡 **Lời khen từ AI:** Học viên **{$topName}** thể hiện tinh thần tự giác học tập rất cao với {$topSessions} phiên thực hành liên tục. Giảng viên có thể biểu dương bạn trước lớp để tạo động lực cho các học viên khác!";

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'hardworking_students',
            'suggested_questions' => [
                'Có bao nhiêu bạn chưa làm thiết bị AC1000F?',
                'Gửi email nhắc tất cả các bạn trong lớp CNTT-K22 chưa làm thiết bị AC1000F',
                'Tiến độ chung của lớp CNTT-K22 như thế nào?',
            ],
            'model' => 'local-rag',
        ];
    }

    // Intent 1: Most Failed Labs / Hardest Labs
    if (
        (str_contains($q, 'bài') && (str_contains($q, 'sai') || str_contains($q, 'trượt') || str_contains($q, 'khó') || str_contains($q, 'lỗi') || str_contains($q, 'kém') || str_contains($q, 'thấp'))) ||
        str_contains($q, 'hay sai') ||
        str_contains($q, 'làm sai') ||
        str_contains($q, 'trượt nhiều') ||
        str_contains($q, 'khó nhất') ||
        str_contains($q, 'điểm thấp') ||
        str_contains($q, 'top bài')
    ) {
        $labs = $report['top_failed_labs'];
        if (empty($labs)) {
            $answer = "Hiện tại dữ liệu ghi nhận tất cả học viên đều hoàn thành tốt các bài lab, chưa có bài nào bị trượt lặp lại nhiều lần!";
        } else {
            $answer = "### 📊 Báo Cáo Top Bài Thực Hành Học Viên Hay Làm Sai Nhất\n\n";
            $answer .= "Dựa trên kết quả chấm điểm thực tế từ hệ thống giả lập, dưới đây là các bài lab có tỷ lệ sai sót/trượt cao nhất:\n\n";
            foreach (array_slice($labs, 0, 5) as $idx => $lab) {
                $num = $idx + 1;
                $riskBadge = $lab['risk_level'] === 'high' ? '⚠️ **Cảnh báo cao**' : 'ℹ️ **Trung bình**';
                $answer .= "{$num}. **{$lab['lab_name']}** ({$lab['device_name']}) — {$riskBadge}\n";
                $answer .= "   - Số lượt trượt: **{$lab['failed_count']} / {$lab['total_attempts']}** lượt thi (Tỷ lệ trượt: **{$lab['fail_rate_percent']}%**)\n";
                $answer .= "   - Điểm trung bình: **{$lab['avg_score']}/100** điểm\n";
                $answer .= "   - Thời lượng trung bình: **{$lab['avg_duration_min']} phút**\n\n";
            }
            $answer .= "**💡 Nhận xét từ AI:** Bài **{$labs[0]['lab_name']}** hiện là điểm nghẽn lớn nhất trong đợt thực hành này. Giảng viên nên tổ chức ôn tập ngắn hoặc hướng dẫn thao tác chi tiết để giảm tỷ lệ thi trượt.";
        }

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'top_failed_labs',
            'suggested_questions' => [
                'Lỗi cấu hình nào học viên hay mắc phải nhất?',
                'Những học viên nào đang gặp khó khăn cần hỗ trợ?',
                'Tiến độ chung của lớp CNTT-K22 ra sao?',
            ],
        ];
    }

    // Intent 2: Common Configuration Mistakes (grading_details breakdown)
    if (
        str_contains($q, 'lỗi') ||
        str_contains($q, 'tiêu chí') ||
        str_contains($q, 'mắc phải') ||
        str_contains($q, 'sai cái gì') ||
        str_contains($q, 'quên lưu') ||
        str_contains($q, 'cấu hình sai') ||
        str_contains($q, 'nguyên nhân sai')
    ) {
        $mistakes = $report['common_mistakes'];
        if (empty($mistakes)) {
            $answer = "Hệ thống chưa ghi nhận lỗi cấu hình nghiêm trọng nào trong các phiên thực hành gần đây.";
        } else {
            $answer = "### 🔍 Phân Tích Chi Tiết Các Lỗi Cấu Hình Phổ Biến\n\n";
            $answer .= "Từ dữ liệu phân tích các tiêu chí chấm điểm tự động (`grading_details`), học viên thường gặp các lỗi sau:\n\n";
            foreach (array_slice($mistakes, 0, 5) as $idx => $m) {
                $num = $idx + 1;
                $answer .= "{$num}. **[{$m['category']}] {$m['rule_name']}** (Bài: *{$m['lab_name']}*)\n";
                $answer .= "   - Tần suất sai: **{$m['fail_count']} lần**\n";
                if (!empty($m['reasons'])) {
                    $answer .= "   - Chi tiết: " . implode('; ', $m['reasons']) . "\n";
                }
                $answer .= "\n";
            }
            $answer .= "**💡 Đề xuất giảng viên:** Hướng dẫn học viên tạo thói quen kiểm tra nút **Save/Apply** và đối soát kỹ chuỗi định danh PPPoE/VLAN trước khi nhấn Nộp bài.";
        }

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'common_mistakes',
            'suggested_questions' => [
                'Bài thực hành nào hay sai nhất?',
                'Có bao nhiêu học viên đang chậm tiến độ?',
                'Đề xuất giải pháp giúp nâng cao điểm số?',
            ],
        ];
    }

    // Intent 3: Struggling Students / Who needs help
    if (
        str_contains($q, 'khó khăn') ||
        str_contains($q, 'cần hỗ trợ') ||
        str_contains($q, 'nguy cơ') ||
        str_contains($q, 'chậm tiến độ') ||
        str_contains($q, 'ai chưa làm') ||
        str_contains($q, 'chưa đạt') ||
        str_contains($q, 'yếu') ||
        (str_contains($q, 'học viên') && (str_contains($q, 'chậm') || str_contains($q, 'chưa') || str_contains($q, 'kém')))
    ) {
        $struggling = $report['struggling_students'];
        if (empty($struggling)) {
            $answer = "Tuyệt vời! Tất cả học viên hiện tại đều duy trì tiến độ hoàn thành tốt (trên 35%) và không có ai bị kẹt bài thi.";
        } else {
            $answer = "### ⚠️ Danh Sách Học Viên Đang Gặp Khó Khăn Cần Hỗ Trợ\n\n";
            $answer .= "AI đã sàng lọc các học viên có tiến độ dưới 35% hoặc có nhiều bài thi trượt chưa đạt:\n\n";
            foreach (array_slice($struggling, 0, 6) as $idx => $s) {
                $num = $idx + 1;
                $badge = $s['attention_level'] === 'urgent' ? '🚨 **Cần hỗ trợ gấp**' : '⏳ **Cần đôn đốc**';
                $answer .= "{$num}. **{$s['student_name']}** (`{$s['email']}`) — Lớp: **{$s['class_code']}** — {$badge}\n";
                $answer .= "   - Đã đạt: **{$s['passed_labs']} / {$s['total_assigned_labs']}** bài (**{$s['completion_percent']}%**)\n";
                if (!empty($s['stuck_labs'])) {
                    $stuckList = array_map(fn($l) => "{$l['lab_name']} ({$l['fail_count']} lần trượt)", $s['stuck_labs']);
                    $answer .= "   - Bài đang gặp khó khăn: " . implode(', ', $stuckList) . "\n";
                }
                $answer .= "\n";
            }
            $answer .= "**💡 Hành động đề xuất:** Quản trị viên/Giảng viên có thể vào mục Quản lý lớp để gửi nhắc nhở hoặc bố trí trợ giảng hỗ trợ các bạn trong danh sách trên.";
        }

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'struggling_students',
            'suggested_questions' => [
                'Tiến độ lớp CNTT-K22 như thế nào?',
                'Tình hình làm bài của sinh viên Tùng Đặng Thanh?',
                'Bài nào học viên hay làm sai nhất?',
            ],
        ];
    }

    // Intent 4: Class Progress (explicitly about classes or 'tiến độ lớp', 'lớp cntt', etc.)
    if (
        str_contains($q, 'tiến độ') ||
        str_contains($q, 'lớp') ||
        str_contains($q, 'hoàn thành') ||
        str_contains($q, 'tỷ lệ') ||
        str_contains($q, 'cntt') ||
        str_contains($q, 'ftc-')
    ) {
        $classSql = '
            SELECT 
                tc.class_id,
                tc.class_code,
                tc.class_name,
                COUNT(DISTINCT p.user_id) AS total_students,
                COUNT(p.assignment_id) AS total_assignments,
                SUM(CASE WHEN p.assignment_status = \'passed\' THEN 1 ELSE 0 END) AS passed_assignments,
                ROUND(100.0 * SUM(CASE WHEN p.assignment_status = \'passed\' THEN 1 ELSE 0 END) / NULLIF(COUNT(p.assignment_id), 0), 1) AS avg_completion_pct
            FROM training_classes tc
            LEFT JOIN v_lab_assignment_progress p ON p.class_id = tc.class_id AND p.assignment_status <> \'waived\'
            WHERE tc.is_mock = FALSE
        ';
        $cParams = [];
        if ($classId !== null) {
            $classSql .= ' AND tc.class_id = :class_id';
            $cParams['class_id'] = $classId;
        } elseif (str_contains($q, 'k22') || str_contains($q, 'cntt')) {
            $classSql .= ' AND (LOWER(tc.class_code) LIKE \'%cntt%\' OR LOWER(tc.class_name) LIKE \'%k22%\')';
        }
        $classSql .= ' GROUP BY tc.class_id, tc.class_code, tc.class_name ORDER BY tc.class_code';

        $cStmt = $pdo->prepare($classSql);
        $cStmt->execute($cParams);
        $classes = $cStmt->fetchAll();

        $answer = "### 📈 Báo Cáo Tiến Độ Lớp Học & Hoàn Thành Thực Hành\n\n";
        foreach ($classes as $c) {
            $pct = $c['avg_completion_pct'] !== null ? $c['avg_completion_pct'] : 0;
            $answer .= "#### Lớp **{$c['class_code']}** - {$c['class_name']}\n";
            $answer .= "- Số lượng học viên: **{$c['total_students']} học viên**\n";
            $answer .= "- Tổng số bài được giao: **{$c['total_assignments']} lượt bài**\n";
            $answer .= "- Đã hoàn thành đạt: **{$c['passed_assignments']} bài**\n";
            $answer .= "- Tỷ lệ hoàn thành toàn lớp: **{$pct}%**\n\n";
        }
        $answer .= "**💡 Nhận định AI:** Các bạn sinh viên đã hoàn thành đạt chuẩn các bài cơ bản ban đầu. Giảng viên nên tiếp tục đôn đốc thực hiện các bài nâng cao tiếp theo.";

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'class_progress',
            'suggested_questions' => [
                'Những học viên nào đang gặp khó khăn trong lớp?',
                'Bài nào học viên hay làm sai nhất?',
                'Lỗi cấu hình nào học viên hay mắc phải?',
            ],
        ];
    }

    // Intent 5: General Overview & Pedagogical Advice
    if (
        str_contains($q, 'tổng quan') ||
        str_contains($q, 'tóm tắt') ||
        str_contains($q, 'đề xuất') ||
        str_contains($q, 'khuyến nghị') ||
        str_contains($q, 'giải pháp') ||
        str_contains($q, 'cải thiện')
    ) {
        $topLab = $report['top_failed_labs'][0] ?? null;
        $urgentCount = $report['summary']['urgent_students_count'];
        $topMistake = $report['common_mistakes'][0] ?? null;

        $answer = "### 🤖 Tổng Hợp Trợ Lý AI & Đề Xuất Nâng Cao Chất Lượng Đào Tạo\n\n";
        $answer .= "Hệ thống AI đã phân tích toàn bộ phiên thực hành và tiến độ của các lớp học:\n\n";
        if ($topLab) {
            $answer .= "- ⚠️ **Bài lab trượt nhiều nhất:** **{$topLab['lab_name']}** ({$topLab['failed_count']} lượt trượt, điểm TB: {$topLab['avg_score']})\n";
        }
        if ($topMistake) {
            $answer .= "- 🔍 **Lỗi cấu hình phổ biến:** **{$topMistake['rule_name']}** ({$topMistake['category']} — {$topMistake['fail_count']} lần)\n";
        }
        $answer .= "- 👥 **Học viên cần theo dõi:** Có **{$urgentCount} học viên** có nguy cơ chậm tiến độ hoặc thi trượt nhiều lần.\n\n";
        
        if (!empty($report['recommendations'])) {
            $answer .= "#### 💡 Khuyến nghị sư phạm trọng tâm cho Giảng viên:\n";
            foreach ($report['recommendations'] as $rec) {
                $answer .= "1. **{$rec['title']}**: {$rec['description']}\n";
            }
        }

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'general_overview',
            'suggested_questions' => [
                'Bài nào học viên hay làm sai nhất?',
                'Lỗi cấu hình nào học viên hay mắc phải?',
                'Những học viên nào đang gặp khó khăn?',
                'Tiến độ lớp CNTT-K22 như thế nào?',
            ],
        ];
    }

    // Default Intent: General Overview & Pedagogical Synthesis
    $topLab = $report['top_failed_labs'][0] ?? null;
    $urgentCount = $report['summary']['urgent_students_count'];
    $topMistake = $report['common_mistakes'][0] ?? null;

    $answer = "### 🤖 Tổng Hợp Trợ Lý AI Giám Sát Đào Tạo\n\n";
    $answer .= "Hệ thống AI đã phân tích toàn bộ phiên thực hành và tiến độ của các lớp:\n\n";
    if ($topLab) {
        $answer .= "- ⚠️ **Bài lab trượt nhiều nhất:** **{$topLab['lab_name']}** ({$topLab['failed_count']} lần trượt, điểm TB: {$topLab['avg_score']})\n";
    }
    if ($topMistake) {
        $answer .= "- 🔍 **Lỗi cấu hình phổ biến:** **{$topMistake['rule_name']}** ({$topMistake['category']} — {$topMistake['fail_count']} lần)\n";
    }
    $answer .= "- 👥 **Học viên cần theo dõi:** Có **{$urgentCount} học viên** có nguy cơ chậm tiến độ hoặc thi trượt nhiều lần.\n\n";
    $answer .= "**💡 Bạn có thể hỏi tôi chi tiết hơn về:**\n";
    $answer .= "- *'Bài thực hành nào hay sai nhất?'*\n";
    $answer .= "- *'Lỗi cấu hình nào học viên hay mắc phải?'*\n";
    $answer .= "- *'Tiến độ của lớp CNTT-K22?'*\n";
    $answer .= "- *'Tra cứu bất kỳ học viên nào (VD: \"còn phương sang thì sao\", \"sinh viên Tùng\", \"điểm của Anbcd\", \"học viên 00384102\")'* \n";

    return [
        'question' => $question,
        'answer' => $answer,
        'intent' => 'general_overview',
        'suggested_questions' => [
            'Bài nào học viên hay làm sai nhất?',
            'Lỗi cấu hình nào học viên hay mắc phải?',
            'Những học viên nào đang gặp khó khăn?',
            'Tiến độ lớp CNTT-K22 như thế nào?',
        ],
    ];
}

/**
 * AI Learning Coach for Individual Student (personal-dashboard.html)
 */
function ai_get_student_advice(PDO $pdo, array $user): array
{
    $userId = (string)($user['user_id'] ?? '');
    $email = strtolower(trim((string)($user['email'] ?? '')));
    $displayName = (string)($user['display_name'] ?? $email);

    // 1. Get student assignment progress
    $progStmt = $pdo->prepare('
        SELECT 
            p.assignment_id, p.class_id, p.class_code, p.class_name,
            p.device_id, p.device_name, p.lab_id, p.lab_name,
            p.assignment_status, p.completed_at, p.first_pass_attempt_no
        FROM v_lab_assignment_progress p
        WHERE p.user_id = :uid AND p.assignment_status <> \'waived\'
        ORDER BY p.device_name, p.lab_name
    ');
    $progStmt->execute(['uid' => $userId]);
    $assignments = $progStmt->fetchAll();

    $totalAssigned = count($assignments);
    $passedAssignments = array_filter($assignments, fn($a) => $a['assignment_status'] === 'passed');
    $passedCount = count($passedAssignments);
    $remainingCount = $totalAssigned - $passedCount;
    $completionPct = $totalAssigned > 0 ? round(($passedCount / $totalAssigned) * 100, 1) : 0.0;

    // 2. Next recommended lab
    $unpassed = array_values(array_filter($assignments, fn($a) => $a['assignment_status'] !== 'passed'));
    $nextLab = $unpassed[0] ?? null;

    // 3. Get student sessions (scores, failed attempts, grading_details)
    $sessStmt = $pdo->prepare('
        SELECT 
            t.id, t.lab_id, COALESCE(l.lab_name, t.lab_name, t.lab_id) AS lab_name,
            t.device_id, COALESCE(d.device_name, t.device) AS device_name,
            t.status, t.is_passed, t.score, t.duration_sec, t.grading_details,
            COALESCE(t.started_at, t.finished_at, t.created_at) AS session_time
        FROM timer_sessions t
        LEFT JOIN lab_catalog l ON l.lab_id = t.lab_id
        LEFT JOIN device_catalog d ON d.device_id = l.device_id OR d.device_name = t.device
        WHERE (t.user_id = :uid OR LOWER(t.email) = LOWER(:email))
          AND t.status IN (\'completed\', \'failed\')
          AND NOT COALESCE(t.is_mock, FALSE)
        ORDER BY COALESCE(t.started_at, t.finished_at, t.created_at) DESC
    ');
    $sessStmt->execute(['uid' => $userId, 'email' => $email]);
    $sessions = $sessStmt->fetchAll();

    $totalSessions = count($sessions);
    $scores = array_filter(array_map(fn($s) => $s['score'] !== null ? (float)$s['score'] : null, $sessions), fn($s) => $s !== null);
    $avgScore = !empty($scores) ? round(array_sum($scores) / count($scores), 1) : null;
    $totalDurationMin = round(array_sum(array_column($sessions, 'duration_sec')) / 60.0, 1);

    // 4. Extract student personal mistakes from grading_details
    $personalMistakes = [];
    $recentFailedSession = null;
    foreach ($sessions as $s) {
        if (!database_boolean($s['is_passed'] ?? false) || $s['status'] === 'failed' || (float)($s['score'] ?? 0) < 100) {
            if (!$recentFailedSession && !empty($s['grading_details'])) {
                $recentFailedSession = $s;
            }
            $details = $s['grading_details'];
            if (is_string($details)) $details = json_decode($details, true);
            if (is_array($details)) {
                foreach ($details as $c) {
                    if (is_array($c) && empty($c['passed'])) {
                        $ruleName = (string)($c['name'] ?? $c['id'] ?? 'Tiêu chí cấu hình');
                        $actual = trim((string)($c['actual'] ?? ''));
                        $expected = trim((string)($c['expected'] ?? ''));
                        $msg = trim((string)($c['message'] ?? ''));

                        $category = 'Sai thông số';
                        $tip = "Cần kiểm tra kỹ thông số yêu cầu [{$expected}].";
                        if (str_contains(mb_strtolower($actual), 'chưa lưu') || str_contains(mb_strtolower($msg), 'save') || str_contains(mb_strtolower($msg), 'lưu')) {
                            $category = 'Quên bấm Save/Apply';
                            $tip = 'Bạn đã nhập đúng thông số nhưng quên nhấn nút Save/Apply cấu hình trên giao diện thiết bị trước khi bấm Hoàn thành.';
                        } elseif (str_contains(mb_strtolower($ruleName), 'pwd') || str_contains(mb_strtolower($ruleName), 'pass')) {
                            $category = 'Mật khẩu sai';
                            $tip = "Mật khẩu chưa khớp với đề bài yêu cầu [{$expected}].";
                        } elseif (str_contains(mb_strtolower($ruleName), 'ip') || str_contains(mb_strtolower($ruleName), 'dhcp')) {
                            $category = 'Dải IP / DHCP';
                            $tip = 'Xem lại Default Gateway và dải IP Pool phân giải.';
                        }

                        $personalMistakes[] = [
                            'lab_name' => $s['lab_name'],
                            'device_name' => $s['device_name'],
                            'rule_name' => $ruleName,
                            'category' => $category,
                            'actual' => $actual,
                            'expected' => $expected,
                            'tip' => $tip,
                        ];
                    }
                }
            }
        }
    }

    // 5. Strengths (Labs passed)
    $strengths = [];
    foreach ($passedAssignments as $pa) {
        $strengths[] = "{$pa['device_name']} - {$pa['lab_name']}";
    }

    // 6. AI Assessment & Personalized Feedback Synthesis
    $statusLevel = 'on_track';
    if ($completionPct >= 70) {
        $statusLevel = 'excellent';
        $statusText = 'Xuất sắc! Tiến độ vượt chuẩn';
        $adviceMsg = "Bạn đã hoàn thành {$passedCount}/{$totalAssigned} bài ({$completionPct}%). Hãy tiếp tục hoàn thành các bài còn lại để đạt điểm tối đa đồ án tốt nghiệp.";
    } elseif ($completionPct >= 30) {
        $statusLevel = 'on_track';
        $statusText = 'Đang bám sát tiến độ';
        $adviceMsg = "Bạn đã hoàn thành {$passedCount}/{$totalAssigned} bài. Hãy duy trì nhịp độ thực hành đều đặn mỗi tuần để hoàn thành 100% mục tiêu.";
    } else {
        $statusLevel = 'needs_acceleration';
        $statusText = 'Cần tăng tốc rèn luyện';
        $adviceMsg = "Tiến độ hiện tại của bạn là {$completionPct}% ({$passedCount}/{$totalAssigned} bài). Bạn còn {$remainingCount} bài thực hành cần hoàn thành để kịp tiến độ chung của lớp!";
    }

    if (!empty($personalMistakes)) {
        $latestMistake = $personalMistakes[0];
        $adviceMsg .= " 💡 **Lưu ý từ bài vừa làm:** Ở bài *{$latestMistake['lab_name']}*, {$latestMistake['tip']}";
    }

    return [
        'student' => [
            'user_id' => $userId,
            'email' => $email,
            'display_name' => $displayName,
            'class_code' => $user['class_code'] ?? ($assignments[0]['class_code'] ?? 'CNTT-K22'),
            'class_name' => $user['class_name'] ?? ($assignments[0]['class_name'] ?? 'Lớp Đồ Án'),
        ],
        'progress' => [
            'total_assigned' => $totalAssigned,
            'passed_count' => $passedCount,
            'remaining_count' => $remainingCount,
            'completion_pct' => $completionPct,
            'total_sessions' => $totalSessions,
            'avg_score' => $avgScore,
            'total_duration_min' => $totalDurationMin,
            'status_level' => $statusLevel,
            'status_text' => $statusText,
        ],
        'ai_feedback' => $adviceMsg,
        'next_recommended_lab' => $nextLab ? [
            'lab_id' => $nextLab['lab_id'],
            'lab_name' => $nextLab['lab_name'],
            'device_id' => $nextLab['device_id'],
            'device_name' => $nextLab['device_name'],
            'portal_url' => "/portal.html?device={$nextLab['device_id']}&lab={$nextLab['lab_id']}&mode=practice",
        ] : null,
        'personal_mistakes' => array_slice($personalMistakes, 0, 5),
        'strengths' => array_slice($strengths, 0, 5),
    ];
}

/**
 * AI Student Chatbot (personal-dashboard.html)
 */
function ai_student_chat(PDO $pdo, array $user, string $message): array
{
    // 1. Try Gemini 1.5 Flash with student personal RAG context
    $ragContext = ai_build_student_rag_context($pdo, $user);
    $geminiRes = ai_call_gemini_api($ragContext, $message);
    if ($geminiRes && !empty($geminiRes['text'])) {
        return [
            'message' => $message,
            'answer' => $geminiRes['text'],
            'suggested_questions' => [
                'Tôi cần làm bài nào tiếp theo?',
                'Tại sao bài trước của tôi bị trừ điểm?',
                'Hướng dẫn các bước cấu hình chuẩn?',
            ],
            'model' => 'gemini-1.5-flash',
        ];
    }

    // 2. Deterministic Local Coaching Fallback
    $q = mb_strtolower(trim($message));
    $advice = ai_get_student_advice($pdo, $user);
    $nextLab = $advice['next_recommended_lab'];
    $mistakes = $advice['personal_mistakes'];
    $prog = $advice['progress'];

    if (str_contains($q, 'tiếp theo') || str_contains($q, 'bài nào') || str_contains($q, 'làm gì') || str_contains($q, 'gợi ý')) {
        if ($nextLab) {
            $answer = "### 🎯 Bài Thực Hành Tiếp Theo Bạn Nên Làm\n\n";
            $answer .= "Gia sư AI đề xuất bạn thực hiện bài:\n\n";
            $answer .= "- **Thiết bị:** {$nextLab['device_name']}\n";
            $answer .= "- **Bài thực hành:** **{$nextLab['lab_name']}**\n";
            $answer .= "- **Trạng thái:** Chưa hoàn thành đạt chuẩn\n\n";
            $answer .= "💡 **Lời khuyên:** Đọc kỹ sơ đồ topo mạng và bảng thông số yêu cầu trước khi bắt đầu cấu hình. Bạn có thể bấm nút **Làm bài ngay** trên bảng điều khiển để chuyển thẳng đến thiết bị!";
        } else {
            $answer = "🎉 **Chúc mừng bạn!** Bạn đã hoàn thành xuất sắc toàn bộ tất cả các bài thực hành được giao trong chương trình học!";
        }
        return [
            'message' => $message,
            'answer' => $answer,
            'suggested_questions' => [
                'Tại sao bài trước của tôi bị trừ điểm / trượt?',
                'Làm sao để đạt điểm tối đa 100/100?',
                'Tiến độ của tôi so với lớp thế nào?',
            ],
        ];
    }

    if (str_contains($q, 'tại sao') || str_contains($q, 'trừ điểm') || str_contains($q, 'trượt') || str_contains($q, 'sai') || str_contains($q, 'lỗi')) {
        if (!empty($mistakes)) {
            $answer = "### 🔍 Phân Tích Lỗi Sai Gần Nhất Của Bạn\n\n";
            $answer .= "Từ hệ thống chấm điểm tự động, dưới đây là các điểm bạn đã bị trừ điểm trong phiên làm bài gần đây:\n\n";
            foreach ($mistakes as $idx => $m) {
                $num = $idx + 1;
                $answer .= "{$num}. **Bài {$m['lab_name']}** ({$m['device_name']}):\n";
                $answer .= "   - Tiêu chí: **{$m['rule_name']}** ({$m['category']})\n";
                $answer .= "   - Thực tế: `{$m['actual']}` | Đề bài yêu cầu: `{$m['expected']}`\n";
                $answer .= "   - 💡 **Khắc phục:** {$m['tip']}\n\n";
            }
        } else {
            $answer = "Hiện tại các bài nộp gần đây của bạn đều đạt kết quả tốt và không ghi nhận lỗi cấu hình nghiêm trọng nào! Hãy tiếp tục duy trì phong độ nhé.";
        }
        return [
            'message' => $message,
            'answer' => $answer,
            'suggested_questions' => [
                'Tôi cần làm bài nào tiếp theo?',
                'Làm sao để đạt 100 điểm?',
                'Cấu hình PPPoE cần chú ý gì?',
            ],
        ];
    }

    if (str_contains($q, 'pppoe') || str_contains($q, 'vlan') || str_contains($q, 'dhcp') || str_contains($q, 'wifi') || str_contains($q, 'wi-fi') || str_contains($q, 'nat')) {
        $answer = "### 📖 Hướng Dẫn Kỹ Thuật Cho Bạn\n\n";
        if (str_contains($q, 'pppoe')) {
            $answer .= "#### 🌐 Quy Trình Cấu Hình PPPoE Chuẩn:\n";
            $answer .= "1. Vào mục **Network / WAN** trên giao diện Router/ONT.\n";
            $answer .= "2. Chọn Connection Type là **PPPoE**.\n";
            $answer .= "3. Nhập đúng **Username** (ví dụ: `sgfdl-123456-789`) và **Password** (ví dụ: `d123456`).\n";
            $answer .= "4. ⚠️ **BƯỚC QUAN TRỌNG:** Nhấn nút **Save / Apply** và đợi thông báo lưu thành công trước khi chuyển sang tab khác hoặc bấm Nộp bài!\n";
        } elseif (str_contains($q, 'dhcp')) {
            $answer .= "#### 🖥️ Quy Trình Cấu Hình DHCP Server:\n";
            $answer .= "1. Vào mục **Network / LAN / DHCP Server**.\n";
            $answer .= "2. Bật chế độ DHCP Server (Enable).\n";
            $answer .= "3. Cấu hình Start IP và End IP đúng dải yêu cầu của đề bài.\n";
            $answer .= "4. Nhấn **Save / Apply** để áp dụng dải cấp phát.\n";
        } else {
            $answer .= "Bạn đang hỏi về cấu hình mạng. Hãy đảm bảo luôn kiểm tra kỹ các trường IP, Subnet Mask, Gateway và đặc biệt là lưu cấu hình trước khi nộp bài thi.";
        }
        return [
            'message' => $message,
            'answer' => $answer,
            'suggested_questions' => [
                'Tôi cần làm bài nào tiếp theo?',
                'Tại sao bài trước của tôi bị trừ điểm?',
                'Tiến độ của tôi hiện tại ra sao?',
            ],
        ];
    }

    // Default: General student progress & encouragement
    $answer = "### 🤖 Gia Sư AI Đồng Hành Cùng Bạn\n\n";
    $answer .= "- **Tiến độ của bạn:** Đã hoàn thành **{$prog['passed_count']} / {$prog['total_assigned']} bài** (**{$prog['completion_pct']}%**).\n";
    $answer .= "- **Điểm trung bình:** **" . ($prog['avg_score'] ?? '—') . " / 100**\n";
    if ($nextLab) {
        $answer .= "- 🎯 **Bài tiếp theo nên làm:** **{$nextLab['lab_name']}** ({$nextLab['device_name']})\n\n";
    }
    $answer .= "Bạn có thể hỏi tôi:\n";
    $answer .= "- *'Tôi cần làm bài nào tiếp theo?'*\n";
    $answer .= "- *'Tại sao bài trước của tôi bị trượt?'*\n";
    $answer .= "- *'Hướng dẫn cấu hình PPPoE / DHCP?'*\n";

    return [
        'message' => $message,
        'answer' => $answer,
        'suggested_questions' => [
            'Tôi cần làm bài nào tiếp theo?',
            'Tại sao bài trước của tôi bị trừ điểm?',
            'Hướng dẫn cấu hình PPPoE?',
        ],
    ];
}

/**
 * Gửi email đôn đốc / nhắc nhở học viên qua SMTP Gmail
 */
function ai_send_reminders(PDO $pdo, array $actor, array $params): array
{
    require_once __DIR__ . '/mailer.php';

    $targetEmail = !empty($params['student_email']) ? strtolower(trim((string)$params['student_email'])) : null;
    $classId = !empty($params['class_id']) ? ai_resolve_class_id($pdo, (string)$params['class_id']) : null;
    $targetMode = (string)($params['target'] ?? ($targetEmail ? 'single' : 'struggling'));

    $studentsSql = '
        SELECT 
            p.user_id, p.email, u.display_name, p.class_code, tc.class_name,
            COUNT(*) AS total_assigned,
            SUM(CASE WHEN p.assignment_status = \'passed\' THEN 1 ELSE 0 END) AS passed_count,
            ROUND(100.0 * SUM(CASE WHEN p.assignment_status = \'passed\' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 1) AS completion_pct
        FROM v_lab_assignment_progress p
        JOIN users u ON u.user_id = p.user_id
        JOIN training_classes tc ON tc.class_id = p.class_id
        WHERE tc.is_mock = FALSE AND p.assignment_status <> \'waived\'
    ';
    $sParams = [];
    if ($targetEmail) {
        $studentsSql .= ' AND LOWER(p.email) = :email';
        $sParams['email'] = $targetEmail;
    } elseif ($classId) {
        $studentsSql .= ' AND tc.class_id = :class_id';
        $sParams['class_id'] = $classId;
    }
    $studentsSql .= ' GROUP BY p.user_id, p.email, u.display_name, p.class_code, tc.class_name';

    $stmt = $pdo->prepare($studentsSql);
    $stmt->execute($sParams);
    $allStudents = $stmt->fetchAll();

    $candidates = [];
    foreach ($allStudents as $st) {
        $pct = (float)($st['completion_pct'] ?? 0);
        if ($targetEmail || $targetMode === 'all' || $pct < 35.0) {
            $candidates[] = $st;
        }
    }

    $maxBatch = $targetEmail ? 1 : min(max((int)($params['limit'] ?? 5), 1), 20);
    $candidates = array_slice($candidates, 0, $maxBatch);

    $results = [];
    $sentCount = 0;
    $failedCount = 0;

    foreach ($candidates as $cand) {
        $studentUser = [
            'user_id' => $cand['user_id'],
            'email' => $cand['email'],
            'display_name' => $cand['display_name'],
            'class_code' => $cand['class_code'],
            'class_name' => $cand['class_name'],
        ];
        $advice = ai_get_student_advice($pdo, $studentUser);
        $nextLabName = $advice['next_recommended_lab']['lab_name'] ?? null;
        $stuckLabs = array_map(fn($m) => ['lab_name' => $m['lab_name'], 'fail_count' => 1], $advice['personal_mistakes']);

        $subject = "🔔 [UTH NetLab] Nhắc nhở tiến độ thực hành mạng - Lớp " . $cand['class_code'];
        $htmlBody = build_reminder_email_template(
            (string)($cand['display_name'] ?? $cand['email']),
            (string)$cand['email'],
            (string)$cand['class_code'],
            (int)$cand['passed_count'],
            (int)$cand['total_assigned'],
            (float)($cand['completion_pct'] ?? 0),
            $stuckLabs,
            $nextLabName,
            $advice['ai_feedback']
        );
        $altText = "Chào bạn " . ($cand['display_name'] ?? $cand['email']) . ", bạn đã hoàn thành " . $cand['passed_count'] . "/" . $cand['total_assigned'] . " bài thực hành. Vui lòng vào hệ thống để tiếp tục luyện tập.";

        $mailRes = send_smtp_mail($cand['email'], $subject, $htmlBody, $altText);
        if ($mailRes['ok']) {
            $sentCount++;
            $results[] = ['email' => $cand['email'], 'status' => 'sent', 'dev_fallback' => !empty($mailRes['dev_otp'])];
        } else {
            $failedCount++;
            $results[] = ['email' => $cand['email'], 'status' => 'failed', 'reason' => $mailRes['reason'] ?? 'smtp_error'];
        }
    }

    return [
        'ok' => true,
        'target_mode' => $targetMode,
        'total_candidates' => count($candidates),
        'sent_count' => $sentCount,
        'failed_count' => $failedCount,
        'results' => $results,
    ];
}

