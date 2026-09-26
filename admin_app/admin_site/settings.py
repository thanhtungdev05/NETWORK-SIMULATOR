"""
Django settings cho FTC Admin Panel.
Kết nối vào cùng Neon DB với PHP API (managed=False cho mọi model).
Chỉ dùng nội bộ - /admin/* được proxy bởi run_all.py dispatcher.
"""
import os
import sys
from urllib.parse import urlparse
import dj_database_url

# BASE_DIR = thư mục admin_app/ (cha của admin_site/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Đảm bảo Python tìm được module admin_portal
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)


# ===========================================================
# Core Security
# ===========================================================
import secrets

SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY', '').strip()
if not SECRET_KEY or SECRET_KEY == 'ftc-dev-secret-key-change-in-production-please':
    SECRET_KEY = 'grad-secret-' + secrets.token_urlsafe(32)
APP_ENV = os.environ.get('APP_ENV', 'development').strip().lower()
APP_BASE_URL = os.environ.get('APP_BASE_URL', '').strip()
IS_RENDER = os.environ.get('RENDER', '').strip().lower() == 'true'
IS_PRODUCTION = APP_ENV == 'production' or IS_RENDER
DEBUG = os.environ.get('DJANGO_DEBUG', '0') == '1' and not IS_PRODUCTION

RENDER_EXTERNAL_URL = os.environ.get('RENDER_EXTERNAL_URL', '').strip()
RENDER_EXTERNAL_HOSTNAME = os.environ.get('RENDER_EXTERNAL_HOSTNAME', '').strip()

_configured_hosts = [
    host.strip()
    for host in os.environ.get('DJANGO_ALLOWED_HOSTS', '').split(',')
    if host.strip()
]
_app_url = urlparse(APP_BASE_URL) if APP_BASE_URL else (urlparse(RENDER_EXTERNAL_URL) if RENDER_EXTERNAL_URL else None)
_app_host = _app_url.hostname if _app_url else RENDER_EXTERNAL_HOSTNAME

ALLOWED_HOSTS = list(dict.fromkeys(_configured_hosts + [
    host for host in [_app_host, '.onrender.com', 'localhost', '127.0.0.1', '[::1]'] if host
]))

_configured_csrf_origins = [
    origin.strip().rstrip('/')
    for origin in os.environ.get('DJANGO_CSRF_TRUSTED_ORIGINS', '').split(',')
    if origin.strip()
]
_app_origin = f'{_app_url.scheme}://{_app_url.netloc}' if _app_url and _app_url.scheme and _app_url.netloc else None
CSRF_TRUSTED_ORIGINS = list(dict.fromkeys(_configured_csrf_origins + [origin for origin in [
    _app_origin,
    'https://*.onrender.com',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:8083',
    'http://127.0.0.1:8083',
] if origin]))

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_PATH = '/'
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SECURE = IS_PRODUCTION
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = IS_PRODUCTION
SECURE_SSL_REDIRECT = IS_PRODUCTION
SECURE_HSTS_SECONDS = 31536000 if IS_PRODUCTION else 0
SECURE_HSTS_INCLUDE_SUBDOMAINS = IS_PRODUCTION
SECURE_HSTS_PRELOAD = IS_PRODUCTION
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'
X_FRAME_OPTIONS = 'DENY'


# ===========================================================
# Apps
# ===========================================================
INSTALLED_APPS = [
    'admin_portal',              # app cụ thể dự án này
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'whitenoise.runserver_nostatic',
    'django.contrib.staticfiles',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'admin_site.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates')],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'admin_site.wsgi.application'

# ===========================================================
# Database — kết nối vào Neon PostgreSQL dùng chung với PHP
# ===========================================================
_db_url = os.environ.get('DATABASE_URL', '')
if _db_url:
    _is_local = '127.0.0.1' in _db_url or 'localhost' in _db_url or 'sslmode=disable' in _db_url
    DATABASES = {
        'default': dj_database_url.parse(
            _db_url,
            conn_max_age=60,
            conn_health_checks=True,
            ssl_require=not _is_local,
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.postgresql',
            'NAME': os.environ.get('PGDATABASE', 'neondb'),
            'USER': os.environ.get('PGUSER', 'postgres'),
            'PASSWORD': os.environ.get('PGPASSWORD', ''),
            'HOST': os.environ.get('PGHOST', 'localhost'),
            'PORT': os.environ.get('PGPORT', '5432'),
        }
    }

# ===========================================================
# Auth
# ===========================================================
AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

# ===========================================================
# Internationalization
# ===========================================================
LANGUAGE_CODE = 'vi'
TIME_ZONE = 'Asia/Ho_Chi_Minh'
USE_I18N = True
USE_TZ = True

# ===========================================================
# Static files (phục vụ bởi Whitenoise)
# ===========================================================
STATIC_URL = '/admin-static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage'},
}

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ===========================================================
# Session (dùng bảng Django sessions - KHÔNG dùng chung với PHP)
# ===========================================================
SESSION_COOKIE_NAME = 'ftc_admin_session'
SESSION_COOKIE_AGE = 3600
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
