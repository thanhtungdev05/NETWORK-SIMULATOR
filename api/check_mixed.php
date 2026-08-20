<?php
$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
load_app_environment($root);
$pdo = create_database_connection();
$stmt = $pdo->query("SELECT device, lab_id, started_at FROM timer_sessions WHERE lab_id LIKE '%AX%' ORDER BY started_at DESC LIMIT 10");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
