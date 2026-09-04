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

    def test_asset_version_prevents_stale_control_styles(self):
        self.assertEqual(self.html.count("20260904-unified-controls-v3"), 2)


if __name__ == "__main__":
    unittest.main()
