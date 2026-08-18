#!/bin/sh
set -e

cd /app

PORT="${PORT:-${PORTAL_PORT:-8080}}"
API_PORT="${API_PORT:-8081}"
DJANGO_PORT="${DJANGO_PORT:-8083}"

echo "Starting FTC Virtual Devices (dispatcher on ${PORT}, API on ${API_PORT}, Admin on ${DJANGO_PORT})..."

# 1. Database migrations PHP (idempotent; only if a database is configured)
if [ -n "$DATABASE_URL" ] || [ -n "$PGHOST" ]; then
    echo "Running PHP database migrations..."
    attempt=1
    while [ "$attempt" -le 5 ]; do
        if php api/migrate.php; then
            break
        fi
        if [ "$attempt" -eq 5 ]; then
            echo "ERROR: PHP migrations failed after 5 attempts; refusing to start."
            exit 1
        fi
        echo "Migration attempt $attempt failed; retrying in 5s..."
        attempt=$((attempt + 1))
        sleep 5
    done

    echo "Running Django Admin migrations (auth, sessions, contenttypes only)..."
    DJANGO_SETTINGS_MODULE=admin_site.settings \
        python admin_app/manage.py migrate --run-syncdb 2>&1 | \
        grep -v "No migrations to apply\|Running migrations\|OK" || true

    echo "Creating Django superuser (if DJANGO_SUPERUSER_PASSWORD is set)..."
    DJANGO_SETTINGS_MODULE=admin_site.settings \
        python admin_app/create_superuser.py || true
else
    echo "No database configured (DATABASE_URL/PG*); skipping migrations."
fi

# 2. PHP API server (built-in, PATH_INFO routing: /api/index.php/<resource>).
#    Chi lang nghe noi bo 127.0.0.1 — dispatcher proxy /api/* ra single-port 8080.
php -S 127.0.0.1:${API_PORT} -t /app > /dev/null 2>&1 &

# 3. Django Admin server — lang nghe noi bo 127.0.0.1:DJANGO_PORT
DJANGO_SETTINGS_MODULE=admin_site.settings \
    python admin_app/manage.py runserver 127.0.0.1:${DJANGO_PORT} \
    --noreload > /tmp/django_admin.log 2>&1 &

echo "Django Admin running on 127.0.0.1:${DJANGO_PORT} (proxied as /admin/)"

# 4. Master Dispatcher: portal + all device simulators + proxy /api/* + /admin/*
START_PHP=0 API_PORT=${API_PORT} DJANGO_PORT=${DJANGO_PORT} python3 run_all.py &

echo "============================================================="
echo "  Portal + Devices + API + Admin: http://localhost:${PORT}  (single-port)"
echo "  Admin panel: http://localhost:${PORT}/admin/"
echo "============================================================="

trap 'echo "Stopping servers..."; kill 0 2>/dev/null' EXIT INT TERM
wait

