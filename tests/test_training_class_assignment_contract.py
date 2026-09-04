import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class TrainingClassAssignmentContractTests(unittest.TestCase):
    def test_migration_allows_multiple_classes_and_uses_sequence(self):
        sql = (ROOT / "api" / "migrations" / "033_training_class_assignment_management.sql").read_text(encoding="utf-8")
        self.assertIn("CREATE SEQUENCE IF NOT EXISTS training_class_code_seq", sql)
        self.assertIn("DROP INDEX IF EXISTS idx_class_enrollments_one_current_class", sql)
        self.assertRegex(sql, r"ON class_enrollments \(class_id, user_id\)")

    def test_migration_restores_tables_removed_by_cleanup_025(self):
        cleanup = (ROOT / "api" / "migrations" / "025_cleanup_obsolete_lms_tables.sql").read_text(encoding="utf-8")
        migration = (ROOT / "api" / "migrations" / "033_training_class_assignment_management.sql").read_text(encoding="utf-8")
        removed_tables = re.findall(r"DROP TABLE IF EXISTS ([a-z_]+)", cleanup)
        required = {
            "curricula",
            "curriculum_labs",
            "training_classes",
            "class_enrollments",
            "lab_assignments",
        }
        self.assertTrue(required.issubset(set(removed_tables)))
        for table in required:
            with self.subTest(table=table):
                self.assertIn(f"CREATE TABLE IF NOT EXISTS {table}", migration)
        self.assertLess(
            migration.index("CREATE TABLE IF NOT EXISTS training_classes"),
            migration.index("FROM training_classes;"),
        )

    def test_class_routes_require_admin_and_learning_requires_user(self):
        api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        class_handler = re.search(r"function handle_training_classes\(.*?\n}\n\nfunction handle_learning", api, re.S)
        self.assertIsNotNone(class_handler)
        self.assertIn("require_admin()", class_handler.group(0))
        learning_handler = re.search(r"function handle_learning\(.*?\n}", api, re.S)
        self.assertIsNotNone(learning_handler)
        self.assertIn("require_user()", learning_handler.group(0))

    def test_tracking_accepts_active_catalog_labs_without_assignment(self):
        tracking = (ROOT / "api" / "lib" / "tracking_handler.php").read_text(encoding="utf-8")
        self.assertNotIn("training_class_user_has_lab", tracking)
        self.assertNotIn("tracking/not-assigned", tracking)
        self.assertGreaterEqual(tracking.count("lab.is_active = TRUE"), 2)
        self.assertGreaterEqual(tracking.count("device.is_active = TRUE"), 2)
        self.assertIn("if ((string)$existingTimer['status'] === 'in_progress')", tracking)
        self.assertRegex(tracking, re.compile(r"UPDATE timer_sessions.*?status = :status", re.S))

    def test_dashboard_includes_every_active_ktv_role(self):
        api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        report = (ROOT / "api" / "lib" / "dashboard_report.php").read_text(encoding="utf-8")
        timer_scope = re.search(r"\$timerSql = 'WITH eligible_dashboard_ktv AS \(.*?\$timerParams", api, re.S)
        technician_scope = re.search(r"SELECT directory\.\*,.*?->fetchAll\(\);", api, re.S)
        self.assertIsNotNone(timer_scope)
        self.assertIsNotNone(technician_scope)
        for scope in (timer_scope.group(0), technician_scope.group(0), report):
            self.assertNotIn("job_title =", scope)
            self.assertNotIn("employee_source LIKE", scope)
        self.assertIn("FROM v_ktv_directory", report)
        self.assertIn("WHERE is_terminated = FALSE", report)

    def test_result_modal_waits_for_tracking_save(self):
        portal = (ROOT / "app.js").read_text(encoding="utf-8")
        self.assertIn("if (trackingSaveInFlight) return;", portal)
        self.assertRegex(
            portal,
            re.compile(
                r"const savePromise = sendTrackingTimer.*?Promise\.resolve\(savePromise\)\.finally.*?showGradingModal",
                re.S,
            ),
        )

    def test_reports_only_include_submitted_sessions(self):
        api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        report = (ROOT / "api" / "lib" / "dashboard_report.php").read_text(encoding="utf-8")
        library = (ROOT / "api" / "lib" / "training_classes.php").read_text(encoding="utf-8")
        personal_html = (ROOT / "personal-dashboard.html").read_text(encoding="utf-8")
        personal_js = (ROOT / "assets" / "personal-dashboard.js").read_text(encoding="utf-8")

        self.assertIn("timer.status IN (\\'completed\\', \\'failed\\')", api)
        self.assertIn("timer.status IN ('completed', 'failed')", report)
        self.assertIn("s.status IN ('completed', 'failed')", library)
        self.assertNotIn('option value="in_progress"', personal_html)
        self.assertNotIn('option value="abandoned"', personal_html)
        self.assertIn("s.status === 'completed' || s.status === 'failed'", personal_js)
        self.assertNotIn("<th>Trạng thái</th>", personal_html)
        self.assertIn('option value="ungraded"', personal_html)
        self.assertIn("Chưa có kết quả", personal_js)

    def test_learning_catalog_is_full_active_catalog_for_every_user(self):
        library = (ROOT / "api" / "lib" / "training_classes.php").read_text(encoding="utf-8")
        catalog = re.search(
            r"function training_class_learning_catalog\(.*?\n}\n\nfunction training_class_import_header",
            library,
            re.S,
        )
        self.assertIsNotNone(catalog)
        self.assertIn("FROM device_catalog device", catalog.group(0))
        self.assertIn("JOIN lab_catalog lab", catalog.group(0))
        self.assertIn("device.is_active = TRUE AND lab.is_active = TRUE", catalog.group(0))
        self.assertNotIn("class_enrollments", catalog.group(0))
        self.assertNotIn("lab_assignments", catalog.group(0))

    def test_portal_uses_server_active_catalog(self):
        portal = (ROOT / "app.js").read_text(encoding="utf-8")
        self.assertIn("/api/index.php/learning/catalog", portal)
        self.assertIn("_catalogDeviceIds", portal)
        self.assertIn("_catalogLabIds", portal)
        self.assertNotIn("_allowedDeviceIds", portal)
        self.assertNotIn("_allowedLabIds", portal)

    def test_class_member_import_is_previewed_inside_create_tab(self):
        html = (ROOT / "dashboard-authen" / "index.html").read_text(encoding="utf-8")
        javascript = (ROOT / "dashboard-authen" / "js" / "app.js").read_text(encoding="utf-8")
        api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        library = (ROOT / "api" / "lib" / "training_classes.php").read_text(encoding="utf-8")
        self.assertNotIn('data-class-tab="import"', html)
        self.assertNotIn('id="classImportPanel"', html)
        self.assertIn('id="classMemberFileBtn"', html)
        self.assertNotIn('id="classMemberFileBtn" disabled', html)
        self.assertIn('Đặt tên cho lớp mới (Ví dụ: BDG01, HNI01, ...)', html)
        self.assertIn('id="classConfigModal"', html)
        self.assertIn('id="classKtvSearchInput"', html)
        self.assertIn('id="classKtvSearchDropdown"', html)
        self.assertIn('id="classOpenConfigModalBtn"', html)
        self.assertIn('id="classCreateBtn"', html)
        self.assertIn("/classes/members/preview", javascript)
        self.assertIn("memberImports", javascript)
        self.assertIn("openClassConfigModal", javascript)
        self.assertIn("handle_training_class_member_preview", api)
        self.assertIn("parse_training_class_members_xlsx", library)
        self.assertIn("'action'=>'create'", library)
        self.assertIn("'action'=>'existing'", library)
        self.assertIn("'class-member-import'", library)
        self.assertRegex(library, re.compile(r"INSERT INTO users \(.*?'KTV'", re.S))

    def test_local_bypass_actor_does_not_break_foreign_keys(self):
        library = (ROOT / "api" / "lib" / "training_classes.php").read_text(encoding="utf-8")
        self.assertIn("function training_class_actor_user_id", library)
        self.assertIn("'created_by' => training_class_actor_user_id($pdo, $actor)", library)

    def test_personal_dashboard_endpoint_and_portal_integration(self):
        api = (ROOT / "api" / "index.php").read_text(encoding="utf-8")
        library = (ROOT / "api" / "lib" / "training_classes.php").read_text(encoding="utf-8")
        portal = (ROOT / "portal.html").read_text(encoding="utf-8")
        dashboard_html = (ROOT / "personal-dashboard.html").read_text(encoding="utf-8")
        dashboard_js = (ROOT / "assets" / "personal-dashboard.js").read_text(encoding="utf-8")

        self.assertIn("training_class_personal_dashboard_payload", api)
        self.assertIn("personal-dashboard", api)
        self.assertIn("function training_class_personal_dashboard_payload", library)
        self.assertIn('id="btn-personal-dashboard"', portal)
        self.assertIn('href="/personal-dashboard.html"', portal)
        self.assertIn('id="btn-goto-practice"', dashboard_html)
        self.assertIn("/api/index.php/learning/personal-dashboard", dashboard_js)


if __name__ == "__main__":
    unittest.main()
