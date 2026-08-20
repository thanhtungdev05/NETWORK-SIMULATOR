<?php
$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
load_app_environment($root);
$pdo = create_database_connection();
$stmt = $pdo->prepare("SELECT email, technician_id, device, lab_id, started_at FROM timer_sessions WHERE email = 'dev-bypass@ftc.local' OR technician_id = 'dev-bypass@ftc.local' ORDER BY started_at DESC");
$stmt->execute();
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
