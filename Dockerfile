FROM python:3.12-slim

ENV PYTHONUNBUFFERED=1 \
    DEBIAN_FRONTEND=noninteractive \
    COMPOSER_ALLOW_SUPERUSER=1

WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        apache2 \
        curl \
        unzip \
        php-cli \
        php-curl \
        php-mbstring \
        php-xml \
        php-zip \
        php-intl \
        php-pgsql \
        libapache2-mod-php \
    && rm -rf /var/lib/apt/lists/*

COPY . /app

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && composer install --no-dev --no-interaction --prefer-dist --no-progress --no-ansi

RUN a2enmod rewrite \
    && for module in /etc/apache2/mods-available/php*.load; do a2enmod "$(basename "$module" .load)"; done \
    && a2dissite 000-default.conf >/dev/null 2>&1 || true

COPY deploy/ftc-apache.conf /etc/apache2/sites-available/ftc.conf

COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

EXPOSE 8080 8081 8090 8092 8094 8096 8098

ENTRYPOINT ["/docker-entrypoint.sh"]
