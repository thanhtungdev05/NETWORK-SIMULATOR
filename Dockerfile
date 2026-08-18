FROM composer:2 AS composer

FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        unzip \
        dos2unix \
        php-cli \
        php-curl \
        php-mbstring \
        php-xml \
        php-zip \
        php-intl \
        php-pgsql \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer /usr/bin/composer /usr/local/bin/composer

COPY . /app

RUN composer install --no-dev --no-interaction --prefer-dist --no-progress --no-ansi

# Cài Django dependencies cho Admin Panel
RUN pip install --no-cache-dir -r admin_app/requirements-admin.txt

# Collect static files cho Django Admin (CSS/JS)
RUN DJANGO_SETTINGS_MODULE=admin_site.settings \
    DJANGO_SECRET_KEY=build-time-placeholder \
    DATABASE_URL=postgresql://x:x@localhost/x \
    python admin_app/manage.py collectstatic --noinput --no-color 2>/dev/null || true

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN dos2unix /docker-entrypoint.sh && chmod +x /docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]

