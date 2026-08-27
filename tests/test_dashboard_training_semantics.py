from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[1]
APP = (ROOT / "dashboard-authen" / "js" / "app.js").read_text(encoding="utf-8")
HTML = (ROOT / "dashboard-authen" / "index.html").read_text(encoding="utf-8")
API = (ROOT / "api" / "index.php").read_text(encoding="utf-8")


class DashboardTrainingSemanticsTests(unittest.TestCase):
    def test_verified_pass_is_not_inferred_from_completed_status(self):
        self.assertIn("practiceSessions.findIndex(item => item.isPassed === true)", APP)
        self.assertNotIn(
            "findIndex(s => s.status === 'Hoàn thành' || s.status === 'completed' || s.is_passed === true)",
            APP,
        )
        self.assertIn("HT L${completionNo || '?'}", APP)
        self.assertIn("Chưa chấm", HTML)

    def test_attempt_number_is_ranked_on_lifetime_history(self):
        self.assertIn("AS practice_attempt_no", API)
        self.assertIn("ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW", API)
        self.assertIn("source_timer.id", API)
        cte_position = API.index("WITH numbered_timer AS")
        date_filter_position = API.index("$dateFrom =", cte_position)
        self.assertLess(cte_position, date_filter_position)
        self.assertIn("firstAttemptNo === 1 && firstAttempt?.isPassed === true", APP)

    def test_region_numerator_and_denominator_use_dashboard_region(self):
        mapping_start = APP.index("function mapApiSessions")
        mapping_end = APP.index("function buildDeviceCatalog", mapping_start)
        mapping = APP[mapping_start:mapping_end]
        self.assertLess(mapping.index("technician?.dashboardRegion"), mapping.index("technician?.regionName"))
        self.assertIn("item.dashboardRegion = canonicalDashboardRegion", APP)
        self.assertIn("function resolveDashboardRegionLeaf", APP)
        self.assertIn("item.dashboard_group || item.dashboardGroup", APP)
        self.assertNotIn("Tổng vùng · ${row.regionKeys.length} đơn vị con", APP)

    def test_region_drilldown_keeps_parent_row_stable(self):
        self.assertIn('data-report-region-child="${escapeHTML(row.parent)}"', APP)
        self.assertIn("childRow.hidden = !willExpand", APP)
        self.assertIn("không phân bổ suy đoán sang TIN/PNC", APP)

    def test_dashboard_explains_data_quality_without_reading_guide(self):
        self.assertNotIn("Cách đọc số liệu", HTML)
        self.assertNotIn("dashboard-reading-guide", HTML)
        self.assertIn("chưa phải dữ liệu phân công đào tạo theo kỳ", APP)
        self.assertIn("Mở chi tiết chi nhánh", HTML)


if __name__ == "__main__":
    unittest.main()
