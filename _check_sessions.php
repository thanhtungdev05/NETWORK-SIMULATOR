<?php
require_once __DIR__ . '/api/lib/runtime.php';
load_app_environment(__DIR__);
$pdo = create_database_connection();

echo "=== Distinct device names in timer_sessions ===" . PHP_EOL;
$rows = $pdo->query("SELECT device_id, device, COUNT(*) as cnt FROM timer_sessions GROUP BY device_id, device ORDER BY device_id")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) echo $r['device_id'] . ' | ' . $r['device'] . ' | sessions=' . $r['cnt'] . PHP_EOL;

echo PHP_EOL . "=== Sessions with NULL or empty device ===" . PHP_EOL;
$rows = $pdo->query("SELECT COUNT(*) FROM timer_sessions WHERE device IS NULL OR BTRIM(device) = ''")->fetchAll(PDO::FETCH_ASSOC);
echo $rows[0][0] . PHP_EOL;

echo PHP_EOL . "=== device_catalog for comparison ===" . PHP_EOL;
$rows = $pdo->query("SELECT device_id, device_name FROM device_catalog WHERE is_active = TRUE ORDER BY sort_order")->fetchAll(PDO::FETCH_ASSOC);
foreach ($rows as $r) echo $r['device_id'] . ' | ' . $r['device_name'] . PHP_EOL;
