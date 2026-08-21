<?php
$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
load_app_environment($root);
$pdo = create_database_connection();
$pdo->exec("DELETE FROM timer_sessions WHERE lab_id = 'ac1-bai1'");
echo "Deleted ac1-bai1 sessions.\n";
