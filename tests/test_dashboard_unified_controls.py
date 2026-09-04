import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class DashboardUnifiedControlsContractTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.html = (ROOT / "dashboard-authen" / "index.html").read_text(encoding="utf-8")
        cls.css = (ROOT / "dashboard-authen" / "css" / "styles.css").read_text(encoding="utf-8")
        cls.javascript = (ROOT / "dashboard-authen" / "js" / "app.js").read_text(encoding="utf-8")

    def test_all_dashboard_tables_receive_non_wrapping_scroll_behavior(self):
        self.assertIn("function enhanceDashboardTables", self.javascript)
        self.assertIn("table.classList.add('unified-data-table')", self.javascript)
        self.assertIn("wrapper.className = 'unified-table-scroll'", self.javascript)
        self.assertIn("table-layout: auto !important", self.css)
        self.assertIn("white-space: nowrap !important", self.css)
        self.assertIn("overflow-x: auto", self.css)

    def test_checkbox_and_native_selects_do_not_use_browser_default_style(self):
        self.assertIn('input[type="checkbox"] {', self.css)
        self.assertIn("appearance: none", self.css)
        self.assertIn('input[type="checkbox"]:checked', self.css)
        self.assertIn("background: #e43f86", self.css)
        self.assertIn("select:not(.searchable-select-source)", self.css)

    def test_long_filter_selects_use_searchable_scrolling_popovers(self):
        for select_id in (
            "instructorClassSelect",
            "instructorDeviceSelect",
            "classMatrixClassSelect",
            "classMatrixDeviceSelect",
        ):
            self.assertIn(f"'{select_id}'", self.javascript)
        self.assertIn("function enhanceSearchableFilterSelect", self.javascript)
        self.assertIn('placeholder="Tìm giá trị..."', self.javascript)
        self.assertIn(".searchable-select-options", self.css)
        self.assertIn("max-height: 248px", self.css)
        self.assertIn("overflow-y: auto", self.css)

    def test_device_filters_are_searchable_checkbox_multiselects(self):
        self.assertIn("const multiSelectFilterIds = new Set", self.javascript)
        self.assertIn("'instructorDeviceSelect'", self.javascript)
        self.assertIn("'classMatrixDeviceSelect'", self.javascript)
        self.assertIn('aria-multiselectable="true"', self.javascript)
        self.assertIn('type="checkbox"', self.javascript)
        self.assertIn("searchable-select-apply", self.javascript)
        self.assertIn("searchable-select-clear", self.javascript)
        self.assertIn("searchable-select-check-option", self.css)

    def test_apply_popovers_stage_checkbox_changes_before_rendering(self):
        self.assertIn("function snapshotHeaderFilterDraft", self.javascript)
        self.assertIn("function restoreHeaderFilterDraft", self.javascript)
        self.assertIn("wrapper._headerFilterDirty = true", self.javascript)
        self.assertIn("event.stopImmediatePropagation()", self.javascript)
        self.assertIn("dropdown._committingFilterDraft = true", self.javascript)
        self.assertIn("discardDraft: false", self.javascript)

    def test_region_usage_line_chart_uses_completed_devices_per_headcount(self):
        for element_id in (
            "regionUsageChart",
            "regionUsageYear",
            "regionUsageInsights",
            "regionUsageLegend",
            "regionUsageTooltip",
        ):
            self.assertIn(f'id="{element_id}"', self.html)
        self.assertIn("function getRegionUsageSeries", self.javascript)
        self.assertIn("function isCompletedDeviceUsageSession", self.javascript)
        self.assertIn("sessions.filter(isCompletedDeviceUsageSession)", self.javascript)
        self.assertIn("Hoàn thành - Chưa chấm", self.javascript)
        self.assertIn("completedDevicesByRegionMonth", self.javascript)
        self.assertIn("completedDevices / headcount", self.javascript)
        self.assertIn("renderRegionUsageChart();", self.javascript)
        self.assertIn(".region-usage-line", self.css)
        self.assertIn(".region-usage-tooltip", self.css)

        overview_start = self.html.index('id="overview"')
        kpi_grid = self.html.index('class="kpi-grid"', overview_start)
        region_chart = self.html.index('id="regionUsageChart"', overview_start)
        monthly_trend = self.html.index('id="overviewMonthlyTrend"', overview_start)
        analytics_start = self.html.index('id="analytics"', overview_start)
        self.assertLess(kpi_grid, region_chart)
        self.assertLess(region_chart, monthly_trend)
        self.assertLess(monthly_trend, analytics_start)
        self.assertEqual(self.html.count('id="regionUsageChart"'), 1)

    def test_asset_version_prevents_stale_control_styles(self):
        self.assertEqual(self.html.count("20260904-region-usage-v2"), 2)


if __name__ == "__main__":
    unittest.main()
