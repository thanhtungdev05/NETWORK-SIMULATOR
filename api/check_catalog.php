<?php
$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
load_app_environment($root);
$pdo = create_database_connection();
$stmt = $pdo->query("SELECT lab_id, lab_name FROM lab_catalog WHERE lab_id LIKE '%AX3000CV2%'");
print_r($stmt->fetchAll(PDO::FETCH_ASSOC));
