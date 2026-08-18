"""
FTC Admin Portal — Django App.
"""
from django.apps import AppConfig


class AdminPortalConfig(AppConfig):
    name = 'admin_portal'
    verbose_name = 'FTC Admin Portal'
    default_auto_field = 'django.db.models.UUIDField'
