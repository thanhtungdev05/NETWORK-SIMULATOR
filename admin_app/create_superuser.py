"""
Script tao Django superuser cho FTC Admin Panel.
Doc thong tin tu bien moi truong:
  DJANGO_SUPERUSER_USERNAME (mac dinh: admin)
  DJANGO_SUPERUSER_EMAIL    (mac dinh: admin@ftc.local)
  DJANGO_SUPERUSER_PASSWORD (bat buoc)
Chay sau khi django migrate trong docker-entrypoint.sh.
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'admin_site.settings')

# Them admin_app vao sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

django.setup()

from django.contrib.auth import get_user_model

User = get_user_model()

username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@ftc.local')
password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', '')

if not password:
    print('[admin] DJANGO_SUPERUSER_PASSWORD chua duoc dat -- bo qua tao superuser.')
    sys.exit(0)

if User.objects.filter(username=username).exists():
    print(f'[admin] Superuser "{username}" da ton tai -- bo qua.')
    sys.exit(0)

User.objects.create_superuser(username=username, email=email, password=password)
print(f'[admin] OK - Da tao superuser: {username} ({email})')
