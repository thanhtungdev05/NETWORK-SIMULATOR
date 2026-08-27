'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const api = fs.readFileSync(path.join(root, 'api/index.php'), 'utf8');
const report = fs.readFileSync(path.join(root, 'api/lib/dashboard_report.php'), 'utf8');
const dashboard = fs.readFileSync(path.join(root, 'dashboard-authen/js/app.js'), 'utf8');
const dashboardStyles = fs.readFileSync(path.join(root, 'dashboard-authen/css/dashboard-professional.css'), 'utf8');
const migration = fs.readFileSync(
  path.join(root, 'api/migrations/030_enforce_approved_dashboard_catalog.sql'),
  'utf8'
);
const regionMigration = fs.readFileSync(
  path.join(root, 'api/migrations/031_normalize_region_dashboard_groups.sql'),
  'utf8'
);
const attemptMigration = fs.readFileSync(
  path.join(root, 'api/migrations/032_persist_practice_attempt_numbers.sql'),
  'utf8'
);
const trackingHandler = fs.readFileSync(path.join(root, 'api/lib/tracking_handler.php'), 'utf8');

assert.match(api, /JOIN lab_catalog active_lab[\s\S]*active_lab\.is_active = TRUE/);
assert.match(api, /JOIN device_catalog active_device[\s\S]*active_device\.is_active = TRUE/);
assert.match(api, /JOIN eligible_dashboard_identities dashboard_identity/);
assert.match(api, /AND NOT COALESCE\(timer\.is_mock, FALSE\)/);
assert.doesNotMatch(api, /if \(\$device !== '' && !isset\(\$deviceMap\[\$device\]\)\)/);
assert.match(api, /dashboard_report_payload\(db\(\), \$_GET\)/);
assert.doesNotMatch(api, /if \(\$action === 'report'\) \{\s*respond\(\['data' => null\]\)/);

assert.match(report, /'source' => 'database'/);
assert.match(report, /CROSS JOIN active_labs/);
assert.match(report, /practice_attempt_no/);
assert.match(report, /device\.is_active = TRUE AND lab\.is_active = TRUE/);
assert.doesNotMatch(report, /is_passed IS TRUE OR\s*\(is_passed IS NULL/);
assert.match(report, /progress_scoped AS/);
assert.match(report, /first_passed_at < months\.month \+ INTERVAL '1 month'/);

assert.match(dashboard, /let BASE_REGION_CATALOG = \[\];/);
assert.match(dashboard, /fetchAndBuildRegionCatalog\(\)/);
assert.match(dashboard, /group\.toLocaleLowerCase\('vi'\) !== label\.toLocaleLowerCase\('vi'\)/);
assert.match(dashboard, /function getCanonicalLabList\(\)/);
assert.match(dashboard, /practiceAttemptNo/);
assert.match(dashboard, /function resetLearnerDetailFilters\(\)/);
assert.match(dashboard, /state\.selectedLearner !== nextLearner\) resetLearnerDetailFilters\(\)/);
assert.match(dashboard, /Đang hiển thị \$\{pageData\.totalRows\}\/\$\{totalHistoryRows\} phiên theo bộ lọc/);
assert.match(dashboard, /phiên hoạt động trong toàn bộ lịch sử/);
assert.match(dashboardStyles, /body\.detail-open \.sidebar[\s\S]*position: fixed;[\s\S]*inset: 0 auto 0 0;[\s\S]*height: auto;[\s\S]*max-height: none;/);
assert.doesNotMatch(dashboard, /ftc-instructor-classes-v1/);
assert.doesNotMatch(dashboard, /region\.branch_name \? `\$\{region\.branch_name\} · \$\{regionName\}`/);
assert.doesNotMatch(dashboard, /deviceCatalog\.length \|\| 5/);
assert.doesNotMatch(dashboard, /\|\| 17/);

assert.match(migration, /SET is_active = device_id IN/);
for (const hiddenId of ['DEV_BE12000', 'DEV_BE15000', 'DEV_VIGOR2927']) {
  assert.equal(migration.includes(`('${hiddenId}'`), false, `${hiddenId} must not be in the active allowlist`);
}
assert.match(migration, /UPDATE lab_catalog[\s\S]*SET is_active = FALSE/);
assert.equal((migration.match(/'LAB_(?:AC1000F|AX3000CV2|AX3000GZ|AX3000HV2|AX3000S|AC1000HI)_0[1-6]'/g) || []).length, 36);
assert.match(regionMigration, /'TDDT - PNC', 'TDDT - TIN'[\s\S]*THEN 'TDDT'/);
assert.match(regionMigration, /'TNMT - PNC', 'TNMT - TIN'[\s\S]*THEN 'TNMT'/);

assert.match(attemptMigration, /ADD COLUMN IF NOT EXISTS practice_attempt_no INTEGER/);
assert.match(attemptMigration, /ROW_NUMBER\(\) OVER/);
assert.match(attemptMigration, /CREATE UNIQUE INDEX IF NOT EXISTS idx_timer_sessions_identity_lab_attempt/);
assert.match(trackingHandler, /tracking\/timer\/start reserves an immutable practice attempt number/);
assert.match(trackingHandler, /pg_advisory_xact_lock/);
assert.match(trackingHandler, /practice_attempt_no/);
assert.match(dashboard, /item\?\.mode === 'Thực hành'[\s\S]*item\?\.isPassed === true/);
assert.match(dashboard, /Hoàn thành - Chưa chấm/);

console.log('Dashboard database-source audit passed.');
