<?php
declare(strict_types=1);

/**
 * api/lib/gamification.php
 * Duolingo-style Streak System, Speedrun Leaderboard, Daily Check-in & Instructor Reward Store
 * for UTH Network Simulator
 */

function gamification_ensure_user_streak(PDO $pdo, string $userId): array
{
    $stmt = $pdo->prepare('SELECT * FROM user_streaks WHERE user_id = :uid');
    $stmt->execute([':uid' => $userId]);
    $streak = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$streak) {
        $ins = $pdo->prepare('
            INSERT INTO user_streaks (user_id, current_streak, longest_streak, streak_freeze_count, total_points, created_at, updated_at)
            VALUES (:uid, 0, 0, 1, 50, NOW(), NOW())
            RETURNING *
        ');
        $ins->execute([':uid' => $userId]);
        $streak = $ins->fetch(PDO::FETCH_ASSOC);
    }

    return $streak;
}

/**
 * Record user daily activity (check-in, login, practice) and update Duolingo-style streak
 */
function gamification_record_activity(PDO $pdo, string $userId, string $type = 'daily_checkin', array $meta = []): array
{
    $streakRow = gamification_ensure_user_streak($pdo, $userId);

    $todayStr = (new DateTimeImmutable('now', new DateTimeZone('Asia/Ho_Chi_Minh')))->format('Y-m-d');
    $lastDateStr = $streakRow['last_activity_date'];

    $pointsToAward = match ($type) {
        'daily_checkin' => 15,
        'login' => 10,
        'practice_passed' => 25,
        'practice_attempt' => 10,
        'speed_record' => 50,
        default => 10,
    };

    // Check if this specific activity was already logged today
    $chkStmt = $pdo->prepare('
        SELECT activity_id, points_earned FROM user_daily_activity 
        WHERE user_id = :uid AND activity_date = :adate AND activity_type = :atype
    ');
    $chkStmt->execute([
        ':uid' => $userId,
        ':adate' => $todayStr,
        ':atype' => $type
    ]);
    $existing = $chkStmt->fetch(PDO::FETCH_ASSOC);

    $isDuplicateActivity = ($existing !== false);
    if ($isDuplicateActivity && in_array($type, ['daily_checkin', 'login'], true)) {
        // Already claimed daily check-in points today
        $pointsToAward = 0;
    }

    // Calculate streak update
    $currentStreak = (int)$streakRow['current_streak'];
    $longestStreak = (int)$streakRow['longest_streak'];
    $freezes = (int)$streakRow['streak_freeze_count'];
    $milestoneBonus = 0;
    $milestoneMessage = null;

    if ($lastDateStr === null) {
        // First activity ever
        $currentStreak = 1;
        $longestStreak = 1;
        $milestoneBonus = 20;
        $milestoneMessage = 'Chào mừng bạn bắt đầu chuỗi ngày học tập đầu tiên! (+20 NetCoins 🪙)';
    } elseif ($lastDateStr === $todayStr) {
        // Already active today, streak remains intact
    } else {
        $todayDt = new DateTimeImmutable($todayStr);
        $lastDt = new DateTimeImmutable($lastDateStr);
        $diffDays = (int)$lastDt->diff($todayDt)->format('%a');

        if ($diffDays === 1) {
            // Consecutive day! Increment streak
            $currentStreak++;
            if ($currentStreak > $longestStreak) {
                $longestStreak = $currentStreak;
            }

            // Streak milestone bonuses
            if ($currentStreak === 3) {
                $milestoneBonus = 50;
                $milestoneMessage = '🔥 Xuất sắc! Chuỗi 3 ngày liên tục (+50 NetCoins 🪙)';
            } elseif ($currentStreak === 7) {
                $milestoneBonus = 150;
                $milestoneMessage = '🎉 Đỉnh cao! Chuỗi 7 ngày rực lửa (+150 NetCoins 🪙 + Huy hiệu Chuyên Cần)';
            } elseif ($currentStreak === 14) {
                $milestoneBonus = 300;
                $milestoneMessage = '⭐ Tuyệt đỉnh! Chuỗi 14 ngày bền bỉ (+300 NetCoins 🪙)';
            } elseif ($currentStreak === 30) {
                $milestoneBonus = 600;
                $milestoneMessage = '👑 Huyền thoại KTV! Chuỗi 30 ngày kỷ lục (+600 NetCoins 🪙)';
            }
        } elseif ($diffDays === 2 && $freezes > 0) {
            // Used streak freeze protection!
            $freezes--;
            $currentStreak++;
            if ($currentStreak > $longestStreak) {
                $longestStreak = $currentStreak;
            }
            $milestoneMessage = '🛡️ Lá chắn bảo vệ chuỗi đã kích hoạt để giữ ngọn lửa của bạn!';
        } else {
            // Streak broken, reset to 1
            $currentStreak = 1;
        }
    }

    $totalEarned = $pointsToAward + $milestoneBonus;

    // Record activity in DB if not already logged
    if (!$isDuplicateActivity) {
        $insAct = $pdo->prepare('
            INSERT INTO user_daily_activity (user_id, activity_date, activity_type, points_earned, metadata, created_at)
            VALUES (:uid, :adate, :atype, :pts, :meta, NOW())
            ON CONFLICT (user_id, activity_date, activity_type) DO UPDATE SET
                points_earned = user_daily_activity.points_earned + EXCLUDED.points_earned,
                created_at = NOW()
        ');
        $insAct->execute([
            ':uid' => $userId,
            ':adate' => $todayStr,
            ':atype' => $type,
            ':pts' => $totalEarned,
            ':meta' => json_encode($meta, JSON_UNESCAPED_UNICODE)
        ]);
    }

    // Update user_streaks
    $updStreak = $pdo->prepare('
        UPDATE user_streaks SET
            current_streak = :cs,
            longest_streak = :ls,
            last_activity_date = :adate,
            streak_freeze_count = :frz,
            total_points = total_points + :pts,
            updated_at = NOW()
        WHERE user_id = :uid
        RETURNING *
    ');
    $updStreak->execute([
        ':cs' => $currentStreak,
        ':ls' => $longestStreak,
        ':adate' => $todayStr,
        ':frz' => $freezes,
        ':pts' => $totalEarned,
        ':uid' => $userId
    ]);
    $updatedRow = $updStreak->fetch(PDO::FETCH_ASSOC);

    return [
        'success' => true,
        'current_streak' => $currentStreak,
        'longest_streak' => $longestStreak,
        'total_points' => (int)($updatedRow['total_points'] ?? 0),
        'points_earned' => $totalEarned,
        'milestone_message' => $milestoneMessage,
        'is_new_activity' => !$isDuplicateActivity,
    ];
}

/**
 * Check if completed session qualifies as a speedrun record (Fastest 100/100 score)
 */
function gamification_check_speed_record(PDO $pdo, int $sessionId): ?array
{
    $sessStmt = $pdo->prepare('
        SELECT t.id, t.user_id, t.lab_id, t.lab_name, t.device, t.duration_sec, t.score, t.status, t.is_passed,
               u.display_name, u.email
        FROM timer_sessions t
        JOIN users u ON u.user_id = t.user_id
        WHERE t.id = :sid
    ');
    $sessStmt->execute([':sid' => $sessionId]);
    $sess = $sessStmt->fetch(PDO::FETCH_ASSOC);

    if (!$sess) {
        return null;
    }

    $score = (float)($sess['score'] ?? 0.0);
    $duration = (int)($sess['duration_sec'] ?? 0);
    $userId = (string)$sess['user_id'];
    $labId = (string)$sess['lab_id'];

    // Only 100% scores with positive duration qualify for speedrun records
    if ($score < 100.0 || $duration <= 0 || empty($labId)) {
        return null;
    }

    // Check existing record for this user and lab
    $chkStmt = $pdo->prepare('SELECT * FROM lab_speed_records WHERE lab_id = :lid AND user_id = :uid');
    $chkStmt->execute([':lid' => $labId, ':uid' => $userId]);
    $existing = $chkStmt->fetch(PDO::FETCH_ASSOC);

    $isNewRecord = false;
    if (!$existing) {
        $isNewRecord = true;
        $ins = $pdo->prepare('
            INSERT INTO lab_speed_records (lab_id, user_id, session_id, duration_sec, score, achieved_at)
            VALUES (:lid, :uid, :sid, :dur, 100.0, NOW())
        ');
        $ins->execute([':lid' => $labId, ':uid' => $userId, ':sid' => $sessionId, ':dur' => $duration]);
    } elseif ($duration < (int)$existing['duration_sec']) {
        $isNewRecord = true;
        $upd = $pdo->prepare('
            UPDATE lab_speed_records 
            SET session_id = :sid, duration_sec = :dur, achieved_at = NOW()
            WHERE lab_id = :lid AND user_id = :uid
        ');
        $upd->execute([':sid' => $sessionId, ':dur' => $duration, ':lid' => $labId, ':uid' => $userId]);
    }

    if (!$isNewRecord) {
        return null;
    }

    // Calculate rank of this speed record for the lab
    $rankStmt = $pdo->prepare('
        SELECT COUNT(*) + 1 AS rank
        FROM lab_speed_records
        WHERE lab_id = :lid AND duration_sec < :dur
    ');
    $rankStmt->execute([':lid' => $labId, ':dur' => $duration]);
    $rank = (int)$rankStmt->fetchColumn();

    $bonusPoints = match ($rank) {
        1 => 100,
        2, 3 => 60,
        default => 30,
    };

    $badgeTitle = match ($rank) {
        1 => '🏆 Kỷ Lục Tốc Độ Số 1 Toàn Hệ Thống!',
        2, 3 => "⚡ Top {$rank} Bàn Tay Vàng Cấu Hình Nhanh!",
        default => '🌟 Kỷ Lục Tốc Độ Cá Nhân Mới!',
    };

    // Award bonus points via gamification activity
    gamification_record_activity($pdo, $userId, 'speed_record', [
        'lab_id' => $labId,
        'duration_sec' => $duration,
        'rank' => $rank,
        'bonus_points' => $bonusPoints,
    ]);

    return [
        'lab_id' => $labId,
        'lab_name' => $sess['lab_name'],
        'duration_sec' => $duration,
        'formatted_duration' => sprintf('%02d:%02d', intdiv($duration, 60), $duration % 60),
        'rank' => $rank,
        'bonus_points' => $bonusPoints,
        'badge_title' => $badgeTitle,
    ];
}

/**
 * Get comprehensive student gamification status (Streak, Duolingo Messages, Week Calendar, Points)
 */
function gamification_get_student_status(PDO $pdo, string $userId): array
{
    $streak = gamification_ensure_user_streak($pdo, $userId);

    $tz = new DateTimeZone('Asia/Ho_Chi_Minh');
    $today = new DateTimeImmutable('now', $tz);
    $todayStr = $today->format('Y-m-d');

    // Week Calendar (Monday to Sunday)
    // Find Monday of current week
    $dayOfWeek = (int)$today->format('N'); // 1 (Mon) to 7 (Sun)
    $monday = $today->modify('-' . ($dayOfWeek - 1) . ' days');

    $weekDays = [];
    $weekDates = [];
    for ($i = 0; $i < 7; $i++) {
        $curDate = $monday->modify("+{$i} days");
        $dStr = $curDate->format('Y-m-d');
        $weekDates[] = $dStr;
        $dayLabels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
        $weekDays[] = [
            'date' => $dStr,
            'label' => $dayLabels[$i],
            'day_label' => $dayLabels[$i],
            'day_name' => $dayLabels[$i],
            'day_number' => (int)$curDate->format('j'),
            'is_today' => ($dStr === $todayStr),
            'is_future' => ($curDate > $today),
            'has_activity' => false,
        ];
    }

    // Query activities for this week
    $actStmt = $pdo->prepare('
        SELECT DISTINCT activity_date 
        FROM user_daily_activity 
        WHERE user_id = :uid AND activity_date BETWEEN :start AND :end
    ');
    $actStmt->execute([
        ':uid' => $userId,
        ':start' => $weekDates[0],
        ':end' => $weekDates[6]
    ]);
    $activeDates = $actStmt->fetchAll(PDO::FETCH_COLUMN);
    $activeDateSet = array_flip($activeDates);

    $todayCompleted = false;
    foreach ($weekDays as &$wd) {
        if (isset($activeDateSet[$wd['date']])) {
            $wd['has_activity'] = true;
            if ($wd['is_today']) {
                $todayCompleted = true;
            }
        }
    }
    unset($wd);

    $currentStreak = (int)$streak['current_streak'];
    $longestStreak = (int)$streak['longest_streak'];
    $totalPoints = (int)$streak['total_points'];

    // Duolingo-style Motivational Message
    $duoMessage = '';
    if ($todayCompleted) {
        $duoMessage = "🎉 **Rực rỡ!** Bạn đã hoàn thành nhiệm vụ và bảo vệ chuỗi **{$currentStreak} ngày** thành công. Nghỉ ngơi và trở lại vào ngày mai nhé!";
    } elseif ($currentStreak > 0) {
        $target = $currentStreak + 1;
        $duoMessage = "🔥 **Đừng để dập tắt ngọn lửa!** Hãy hoàn thành ít nhất 1 bài lab hôm nay để nối dài chuỗi ngày thứ **{$target}** và nhận xu thưởng!";
    } else {
        $duoMessage = "🌱 **Khởi động chuỗi học tập!** Hoàn thành bài thực hành đầu tiên hôm nay để thắp sáng ngọn lửa và nhận 25 NetCoins đầu tiên!";
    }

    // Milestones check
    $nextMilestone = 3;
    if ($currentStreak >= 3 && $currentStreak < 7) {
        $nextMilestone = 7;
    } elseif ($currentStreak >= 7 && $currentStreak < 14) {
        $nextMilestone = 14;
    } elseif ($currentStreak >= 14 && $currentStreak < 30) {
        $nextMilestone = 30;
    } elseif ($currentStreak >= 30) {
        $nextMilestone = 60;
    }
    $daysToMilestone = max(0, $nextMilestone - $currentStreak);

    // Speed records count
    $speedStmt = $pdo->prepare('SELECT COUNT(*) FROM lab_speed_records WHERE user_id = :uid');
    $speedStmt->execute([':uid' => $userId]);
    $speedRecordsCount = (int)$speedStmt->fetchColumn();

    // User's recent redemptions
    $redempStmt = $pdo->prepare('
        SELECT r.redemption_id, r.item_id, r.points_spent, r.status, r.requested_at, r.fulfilled_at,
               i.title AS item_title, i.icon AS item_icon, i.category AS item_category
        FROM reward_redemptions r
        JOIN reward_items i ON i.item_id = r.item_id
        WHERE r.user_id = :uid
        ORDER BY r.requested_at DESC
        LIMIT 5
    ');
    $redempStmt->execute([':uid' => $userId]);
    $recentRedemptions = $redempStmt->fetchAll(PDO::FETCH_ASSOC);

    return [
        'user_id' => $userId,
        'current_streak' => $currentStreak,
        'longest_streak' => $longestStreak,
        'total_points' => $totalPoints,
        'streak_freeze_count' => (int)$streak['streak_freeze_count'],
        'today_completed' => $todayCompleted,
        'duo_message' => $duoMessage,
        'next_milestone' => $nextMilestone,
        'days_to_milestone' => $daysToMilestone,
        'week_calendar' => $weekDays,
        'speed_records_count' => $speedRecordsCount,
        'recent_redemptions' => $recentRedemptions,
    ];
}

/**
 * Get active reward items catalog
 */
function gamification_get_rewards_catalog(PDO $pdo): array
{
    $stmt = $pdo->query('
        SELECT item_id, title, description, category, points_cost, icon, stock, is_active
        FROM reward_items
        WHERE is_active = TRUE
        ORDER BY sort_order ASC, points_cost ASC
    ');
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}

/**
 * Redeem a gift using accumulated NetCoins
 */
function gamification_redeem_gift(PDO $pdo, string $userId, string $itemId): array
{
    $itemStmt = $pdo->prepare('SELECT * FROM reward_items WHERE item_id = :iid AND is_active = TRUE');
    $itemStmt->execute([':iid' => $itemId]);
    $item = $itemStmt->fetch(PDO::FETCH_ASSOC);

    if (!$item) {
        throw new InvalidArgumentException('Món quà này không tồn tại hoặc đã ngừng áp dụng.');
    }

    if ((int)$item['stock'] === 0) {
        throw new RuntimeException('Món quà này tạm thời đã hết lượt đổi.');
    }

    $cost = (int)$item['points_cost'];

    // Check user points
    $streak = gamification_ensure_user_streak($pdo, $userId);
    $currentPoints = (int)$streak['total_points'];

    if ($currentPoints < $cost) {
        throw new RuntimeException("Bạn không đủ NetCoins để đổi món quà này (Hiện có: {$currentPoints} xu, Cần: {$cost} xu).");
    }

    $pdo->beginTransaction();
    try {
        // Deduct points
        $upd = $pdo->prepare('
            UPDATE user_streaks 
            SET total_points = total_points - :cost, updated_at = NOW()
            WHERE user_id = :uid AND total_points >= :cost
        ');
        $upd->execute([':cost' => $cost, ':uid' => $userId]);

        // Insert redemption request
        $ins = $pdo->prepare('
            INSERT INTO reward_redemptions (redemption_id, user_id, item_id, points_spent, status, requested_at)
            VALUES (gen_random_uuid(), :uid, :iid, :pts, \'pending\', NOW())
            RETURNING redemption_id, requested_at, status
        ');
        $ins->execute([
            ':uid' => $userId,
            ':iid' => $itemId,
            ':pts' => $cost
        ]);
        $redemption = $ins->fetch(PDO::FETCH_ASSOC);

        // Decrement stock if limited
        if ((int)$item['stock'] > 0) {
            $pdo->prepare('UPDATE reward_items SET stock = stock - 1 WHERE item_id = :iid')->execute([':iid' => $itemId]);
        }

        $pdo->commit();

        return [
            'success' => true,
            'redemption_id' => $redemption['redemption_id'],
            'item_title' => $item['title'],
            'points_spent' => $cost,
            'remaining_points' => $currentPoints - $cost,
            'message' => "Đổi quà thành công! Yêu cầu '{$item['title']}' đã được chuyển đến Giảng viên để xét duyệt và trao tặng.",
        ];
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}

/**
 * Get instructor overview of gamification (Pending gift redemptions, Top streaks, Speed champions)
 */
function gamification_get_instructor_overview(PDO $pdo, ?string $classId = null): array
{
    // 1. Pending Redemptions awaiting instructor action
    $pendingStmt = $pdo->query('
        SELECT * FROM v_pending_reward_redemptions 
        WHERE status = \'pending\'
        ORDER BY requested_at ASC
        LIMIT 50
    ');
    $pendingList = $pendingStmt->fetchAll(PDO::FETCH_ASSOC);

    // 2. Recent Fulfilled Redemptions
    $fulfilledStmt = $pdo->query('
        SELECT * FROM v_pending_reward_redemptions 
        WHERE status IN (\'fulfilled\', \'approved\')
        ORDER BY fulfilled_at DESC NULLS LAST, requested_at DESC
        LIMIT 20
    ');
    $fulfilledList = $fulfilledStmt->fetchAll(PDO::FETCH_ASSOC);

    // 3. Top Streaks Leaderboard
    $topStreaksStmt = $pdo->query('
        SELECT user_id, display_name, email, employee_id, class_code, current_streak, longest_streak, total_points, last_activity_date
        FROM v_streak_leaderboard
        LIMIT 10
    ');
    $topStreaks = $topStreaksStmt->fetchAll(PDO::FETCH_ASSOC);

    // 4. Speedrun Champions
    $speedStmt = $pdo->query('
        SELECT r.lab_id, COALESCE(l.lab_name, r.lab_id) AS lab_name, 
               u.display_name, u.email, COALESCE(u.class_code, \'Lớp chung\') AS class_code,
               r.duration_sec, r.score, r.achieved_at
        FROM lab_speed_records r
        JOIN users u ON u.user_id = r.user_id
        LEFT JOIN lab_catalog l ON l.lab_id = r.lab_id
        ORDER BY r.duration_sec ASC
        LIMIT 10
    ');
    $speedChampions = $speedStmt->fetchAll(PDO::FETCH_ASSOC);

    // Summary counters
    $totalPending = count($pendingList);
    $totalFulfilledCount = (int)$pdo->query("SELECT COUNT(*) FROM reward_redemptions WHERE status = 'fulfilled'")->fetchColumn();
    $activeStreaksCount = (int)$pdo->query("SELECT COUNT(*) FROM user_streaks WHERE current_streak >= 3")->fetchColumn();

    return [
        'stats' => [
            'pending_redemptions_count' => $totalPending,
            'total_fulfilled_count' => $totalFulfilledCount,
            'active_streaks_above_3' => $activeStreaksCount,
        ],
        'pending_redemptions' => $pendingList,
        'recent_fulfilled' => $fulfilledList,
        'top_streaks' => $topStreaks,
        'speed_champions' => $speedChampions,
    ];
}

/**
 * Instructor approves or fulfills gift redemption
 */
function gamification_fulfill_redemption(
    PDO $pdo,
    string $redemptionId,
    string $instructorUserId,
    string $status = 'fulfilled',
    ?string $notes = null
): array {
    $chk = $pdo->prepare('SELECT * FROM reward_redemptions WHERE redemption_id = :rid');
    $chk->execute([':rid' => $redemptionId]);
    $redemption = $chk->fetch(PDO::FETCH_ASSOC);

    if (!$redemption) {
        throw new InvalidArgumentException('Yêu cầu đổi quà không tồn tại.');
    }

    $pdo->beginTransaction();
    try {
        if ($status === 'rejected') {
            // Restore spent points back to student
            $refund = (int)$redemption['points_spent'];
            $pdo->prepare('
                UPDATE user_streaks 
                SET total_points = total_points + :pts, updated_at = NOW() 
                WHERE user_id = :uid
            ')->execute([':pts' => $refund, ':uid' => $redemption['user_id']]);
        }

        $upd = $pdo->prepare('
            UPDATE reward_redemptions 
            SET status = :st, instructor_notes = :nt, approved_by = :inst, fulfilled_at = NOW()
            WHERE redemption_id = :rid
        ');
        $upd->execute([
            ':st' => $status,
            ':nt' => $notes ?? ($status === 'fulfilled' ? 'Giảng viên đã trao quà / ghi nhận thành tích.' : 'Từ chối đổi quà.'),
            ':inst' => $instructorUserId,
            ':rid' => $redemptionId
        ]);

        $pdo->commit();

        return [
            'success' => true,
            'redemption_id' => $redemptionId,
            'status' => $status,
            'message' => $status === 'fulfilled' ? 'Đã xác nhận trao quà thành công cho học viên.' : 'Đã từ chối và hoàn lại xu cho học viên.',
        ];
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) {
            $pdo->rollBack();
        }
        throw $e;
    }
}
