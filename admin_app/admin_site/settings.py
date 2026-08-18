"""
Django settings cho FTC Admin Panel.
Kết nối vào cùng Neon DB với PHP API (managed=False cho mọi model).
Chỉ dùng nội bộ - /admin/* được proxy bởi run_all.py dispatcher.
"""
import os
import sys
import dj_database_url

# BASE_DIR = thư mục admin_app/ (cha của admin_site/)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# Đảm bảo Python tìm được module admin_portal
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)


# ===========================================================
# Core Security
# ===========================================================
SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'ftc-dev-secret-key-change-in-production-please'
)
DEBUG = os.environ.get('DJANGO_DEBUG', '0') == '1'

ALLOWED_HOSTS = ['*']
CSRF_TRUSTED_ORIGINS = [
    'https://*.onrender.com',
    'http://localhost:8080',
    'http://127.0.0.1:8080',
    'http://localhost:8083',
    'http://127.0.0.1:8083',
]

USE_X_FORWARDED_HOST = True
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
SESSION_COOKIE_PATH = '/'


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
    DATABASES = {
        'default': dj_database_url.parse(
            _db_url,
            conn_max_age=60,
            ssl_require=True,
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
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
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
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ===========================================================
# Session (dùng bảng Django sessions - KHÔNG dùng chung với PHP)
# ===========================================================
SESSION_COOKIE_NAME = 'ftc_admin_session'
SESSION_COOKIE_AGE = 3600
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
