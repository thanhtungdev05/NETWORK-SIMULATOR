<?php
$root = dirname(__DIR__);
require_once __DIR__ . '/lib/runtime.php';
load_app_environment($root);
$pdo = create_database_connection();
$sql = file_get_contents(__DIR__ . '/migrations/014_update_old_sessions_ax3000gz.sql');
$pdo->exec($sql);
echo "Updated AX3000GZ old sessions.\n";
