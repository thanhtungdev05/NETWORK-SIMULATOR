'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const api = fs.readFileSync(path.join(root, 'api/index.php'), 'utf8');
const report = fs.readFileSync(path.join(root, 'api/lib/dashboard_report.php'), 'utf8');
const dashboard = fs.readFileSync(path.join(root, 'dashboard-authen/js/app.js'), 'utf8');
const migration = fs.readFileSync(
  path.join(root, 'api/migrations/030_enforce_approved_dashboard_catalog.sql'),
  'utf8'
);
const regionMigration = fs.readFileSync(
  path.join(root, 'api/migrations/031_normalize_region_dashboard_groups.sql'),
  'utf8'
);

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

assert.match(dashboard, /let BASE_REGION_CATALOG = \[\];/);
assert.match(dashboard, /fetchAndBuildRegionCatalog\(\)/);
assert.match(dashboard, /group\.toLocaleLowerCase\('vi'\) !== label\.toLocaleLowerCase\('vi'\)/);
assert.match(dashboard, /function getCanonicalLabList\(\)/);
assert.match(dashboard, /practiceAttemptNo/);
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

console.log('Dashboard database-source audit passed.');
