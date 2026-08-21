<?php
$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
load_app_environment($root);
$pdo = create_database_connection();
$stmt = $pdo->query("SELECT device, lab_id, started_at FROM timer_sessions ORDER BY started_at DESC");
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo "Total rows: " . count($rows) . "\n";
print_r($rows);
