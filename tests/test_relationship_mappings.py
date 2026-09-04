import os
import sys
import unittest
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[1]
ADMIN_APP_ROOT = PROJECT_ROOT / 'admin_app'
if str(ADMIN_APP_ROOT) not in sys.path:
    sys.path.insert(0, str(ADMIN_APP_ROOT))

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'admin_site.settings')

import django

django.setup()

from django.db import models

from admin_portal.admin import FtcUserAdmin, TimerSessionAdmin
from admin_portal.models import (
    DeviceCatalog,
    FtcUser,
    LabCatalog,
    LoginLog,
    Region,
    Role,
    RosterImportLog,
    TimerSession,
)


class AdminRelationshipMappingTests(unittest.TestCase):
    def assert_foreign_key(
        self,
        model,
        field_name,
        related_model,
        *,
        column,
        target_field,
        on_delete,
        related_name,
    ):
        field = model._meta.get_field(field_name)
        self.assertIsInstance(field, models.ForeignKey)
        self.assertIs(field.related_model, related_model)
        self.assertEqual(field.column, column)
        self.assertEqual(field.target_field.name, target_field)
        self.assertIs(field.remote_field.on_delete, on_delete)
        self.assertEqual(field.remote_field.related_name, related_name)

    def test_all_business_foreign_keys_are_mapped(self):
        cases = [
            (
                LabCatalog,
                'device',
                DeviceCatalog,
                'device_id',
                'device_id',
                models.CASCADE,
                'labs',
            ),
            (
                FtcUser,
                'role',
                Role,
                'role',
                'role_code',
                models.PROTECT,
                'users',
            ),
            (
                FtcUser,
                'region',
                Region,
                'region_id',
                'region_id',
                models.PROTECT,
                'users',
            ),
            (
                TimerSession,
                'user',
                FtcUser,
                'user_id',
                'user_id',
                models.SET_NULL,
                'timer_sessions',
            ),
            (
                TimerSession,
                'device',
                DeviceCatalog,
                'device_id',
                'device_id',
                models.SET_NULL,
                'timer_sessions',
            ),
            (
                LoginLog,
                'user',
                FtcUser,
                'user_id',
                'user_id',
                models.SET_NULL,
                'login_logs',
            ),
            (
                RosterImportLog,
                'imported_by',
                FtcUser,
                'imported_by',
                'user_id',
                models.SET_NULL,
                'roster_imports',
            ),
        ]

        for (
            model,
            field_name,
            related_model,
            column,
            target_field,
            on_delete,
            related_name,
        ) in cases:
            with self.subTest(model=model.__name__, field=field_name):
                self.assert_foreign_key(
                    model,
                    field_name,
                    related_model,
                    column=column,
                    target_field=target_field,
                    on_delete=on_delete,
                    related_name=related_name,
                )

    def test_snapshot_columns_are_not_misrepresented_as_foreign_keys(self):
        lab_id = TimerSession._meta.get_field('lab_id')
        device_snapshot = TimerSession._meta.get_field('device_name_snapshot')
        login_role = LoginLog._meta.get_field('role')

        self.assertIsInstance(lab_id, models.CharField)
        self.assertNotIsInstance(lab_id, models.ForeignKey)
        self.assertEqual(device_snapshot.column, 'device')
        self.assertNotIsInstance(device_snapshot, models.ForeignKey)
        self.assertNotIsInstance(login_role, models.ForeignKey)

    def test_foreign_key_ids_accept_existing_database_keys_without_queries(self):
        user = FtcUser(
            email='relationship-regression@example.com',
            role_id='DEV',
            region_id=None,
        )
        session = TimerSession(user_id=user.user_id, device_id='DEV_AX3000S')

        self.assertEqual(user.role_id, 'DEV')
        self.assertEqual(session.user_id, user.user_id)
        self.assertEqual(session.device_id, 'DEV_AX3000S')

    def test_admin_preloads_relations_used_in_lists(self):
        self.assertEqual(FtcUserAdmin.list_select_related, ['role', 'region'])
        self.assertEqual(TimerSessionAdmin.list_select_related, ['user', 'device'])


class DashboardAssignmentSourceTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.api_source = (PROJECT_ROOT / 'api' / 'index.php').read_text(encoding='utf-8')

    def test_dashboard_uses_explicit_assignment_read_model(self):
        self.assertIn('FROM v_lab_assignment_progress progress', self.api_source)
        self.assertIn('progress.assignment_status AS status', self.api_source)
        self.assertNotIn('CROSS JOIN lab_catalog lab', self.api_source)


if __name__ == '__main__':
    unittest.main()
