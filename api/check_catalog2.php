<?php
$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
load_app_environment($root);
$pdo = create_database_connection();
$stmt = $pdo->query("SELECT c.lab_id, c.lab_name, c.device_id, d.device_name FROM lab_catalog c LEFT JOIN device_catalog d ON c.device_id = d.device_id WHERE c.lab_id = 'LAB_AX3000CV2_01' OR c.lab_id = 'LAB_AC1000F_01'");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
