<?php
declare(strict_types=1);

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
 * Natural Language Q&A Chatbot for Management Dashboard
 * Analyzes questions and crafts data-backed, actionable insights.
 */
function ai_chat_query(PDO $pdo, string $question, ?string $classIdentifier = null, ?array $actor = null): array
{
    $q = mb_strtolower(trim($question));
    $classId = ai_resolve_class_id($pdo, $classIdentifier);
    $report = ai_get_diagnostic_report($pdo, $classIdentifier);

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

    // Intent 6: Specific Student Lookup
    $stopWords = [
        'sinh', 'viên', 'học', 'tiến', 'độ', 'bài', 'làm', 'của', 'bạn', 'thầy', 'cô', 
        'xem', 'tình', 'hình', 'như', 'thế', 'nào', 'ra', 'sao', 'cho', 'tôi', 'biết', 
        'với', 'trong', 'lớp', 'các', 'những', 'em', 'tra', 'cứu', 'thông', 'tin', 'kết', 'quả'
    ];
    $rawTokens = preg_split('/[\s,\?\.!\(\)\[\]]+/u', $q);
    $meaningfulTokens = array_values(array_filter($rawTokens, fn($w) => mb_strlen($w) >= 2 && !in_array($w, $stopWords, true)));

    $foundUser = null;
    $accountTokens = array_filter($meaningfulTokens, fn($t) => preg_match('/\d/', $t) || str_contains($t, '@'));
    $hasPersonIndicator = str_contains($q, 'sinh viên') || str_contains($q, 'học viên') || str_contains($q, 'ktv') || str_contains($q, 'bạn ') || str_contains($q, 'em ') || str_contains($q, 'hồ sơ') || str_contains($q, 'tra cứu') || !empty($accountTokens);

    if ($hasPersonIndicator && !empty($meaningfulTokens)) {
        // Priority 1: Exact / strong account ID matches (contains digits or @)
        if (!empty($accountTokens)) {
            $accStmt = $pdo->prepare('
                SELECT u.user_id, u.email, u.display_name, u.employee_id, tc.class_code, tc.class_name
                FROM users u
                LEFT JOIN class_enrollments ce ON ce.user_id = u.user_id AND ce.status = \'active\'
                LEFT JOIN training_classes tc ON tc.class_id = ce.class_id
                WHERE LOWER(u.email) LIKE :term OR LOWER(COALESCE(u.employee_id, \'\')) LIKE :term
                LIMIT 1
            ');
            foreach ($accountTokens as $accTok) {
                $accStmt->execute(['term' => '%' . $accTok . '%']);
                $u = $accStmt->fetch();
                if ($u) {
                    $foundUser = $u;
                    break;
                }
            }
        }

        // Priority 2: Multi-token similarity scoring across candidate users
        if (!$foundUser) {
            $candStmt = $pdo->query('
                SELECT u.user_id, u.email, u.display_name, u.employee_id, tc.class_code, tc.class_name
                FROM users u
                LEFT JOIN class_enrollments ce ON ce.user_id = u.user_id AND ce.status = \'active\'
                LEFT JOIN training_classes tc ON tc.class_id = ce.class_id
                WHERE u.is_terminated = FALSE
            ');
            $candidates = $candStmt->fetchAll();

            $bestScore = 0;
            $bestCandidate = null;
            foreach ($candidates as $cand) {
                $nameText = mb_strtolower((string)($cand['display_name'] ?? ''));
                $emailText = mb_strtolower((string)($cand['email'] ?? ''));
                $empText = mb_strtolower((string)($cand['employee_id'] ?? ''));
                $fullText = "{$nameText} {$emailText} {$empText}";

                $score = 0;
                foreach ($meaningfulTokens as $tok) {
                    if (str_contains($nameText, $tok)) {
                        $score += 5;
                    } elseif (str_contains($fullText, $tok)) {
                        $score += 2;
                    }
                }
                if ($score > $bestScore) {
                    $bestScore = $score;
                    $bestCandidate = $cand;
                }
            }
            if ($bestScore >= 5) {
                $foundUser = $bestCandidate;
            }
        }
    }

    if ($foundUser) {
        $uId = (string)$foundUser['user_id'];
        $uEmail = (string)$foundUser['email'];
        $uName = (string)($foundUser['display_name'] ?? $uEmail);
        $uClass = (string)($foundUser['class_code'] ?? 'Chưa xếp lớp');

        // Get student assignment progress
        $progStmt = $pdo->prepare('
            SELECT 
                COUNT(*) AS total_labs,
                SUM(CASE WHEN assignment_status = \'passed\' THEN 1 ELSE 0 END) AS passed_labs,
                ROUND(100.0 * SUM(CASE WHEN assignment_status = \'passed\' THEN 1 ELSE 0 END) / NULLIF(COUNT(*), 0), 1) AS pct
            FROM v_lab_assignment_progress
            WHERE user_id = :uid
        ');
        $progStmt->execute(['uid' => $uId]);
        $prog = $progStmt->fetch() ?: ['total_labs' => 0, 'passed_labs' => 0, 'pct' => 0];

        // Get completed sessions
        $sessStmt = $pdo->prepare('
            SELECT 
                COUNT(*) AS session_count,
                ROUND(AVG(score), 1) AS avg_score,
                ROUND(SUM(duration_sec) / 60.0, 1) AS total_min
            FROM timer_sessions
            WHERE (user_id = :uid OR LOWER(email) = LOWER(:email))
              AND status IN (\'completed\', \'failed\')
        ');
        $sessStmt->execute(['uid' => $uId, 'email' => $uEmail]);
        $sess = $sessStmt->fetch() ?: ['session_count' => 0, 'avg_score' => 0, 'total_min' => 0];

        // Get passed lab details
        $passedLabsStmt = $pdo->prepare('
            SELECT device_name, lab_name, completed_at
            FROM v_lab_assignment_progress
            WHERE user_id = :uid AND assignment_status = \'passed\'
            ORDER BY completed_at DESC
        ');
        $passedLabsStmt->execute(['uid' => $uId]);
        $passedLabs = $passedLabsStmt->fetchAll();

        $progPct = $prog['pct'] !== null ? $prog['pct'] : 0;
        $answer = "### 👤 Hồ Sơ Học Tập: **{$uName}**\n\n";
        $answer .= "- **Email:** `{$uEmail}` | **Mã SV/KTV:** " . ($foundUser['employee_id'] ?? 'N/A') . "\n";
        $answer .= "- **Lớp sinh hoạt:** **{$uClass}** (" . ($foundUser['class_name'] ?? '') . ")\n";
        $answer .= "- **Tiến độ hoàn thành:** **{$prog['passed_labs']} / {$prog['total_labs']} bài** (**{$progPct}%**)\n";
        $answer .= "- **Điểm trung bình:** **" . ($sess['avg_score'] ?? '—') . " / 100**\n";
        $answer .= "- **Tổng thời gian luyện tập:** **" . ($sess['total_min'] ?? 0) . " phút** qua **" . ($sess['session_count'] ?? 0) . " phiên**\n\n";

        if (!empty($passedLabs)) {
            $answer .= "#### Các bài lab đã hoàn thành đạt chuẩn:\n";
            foreach (array_slice($passedLabs, 0, 5) as $pl) {
                $answer .= "✅ **{$pl['device_name']}**: {$pl['lab_name']}\n";
            }
        } else {
            $answer .= "⚠️ *Học viên chưa hoàn thành đạt bài lab nào được giao.*\n";
        }

        return [
            'question' => $question,
            'answer' => $answer,
            'intent' => 'student_lookup',
            'suggested_questions' => [
                'Tiến độ lớp CNTT-K22 như thế nào?',
                'Những bài lab nào hay bị sai nhất?',
                'Lỗi cấu hình nào phổ biến?',
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
    $answer .= "- *'Tra cứu học viên Tùng Đặng Thanh (tungdt5101)?'*\n";

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

