FROM composer:2 AS composer

FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        unzip \
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

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/docker-entrypoint.sh"]
