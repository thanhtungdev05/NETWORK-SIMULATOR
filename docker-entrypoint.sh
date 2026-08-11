#!/bin/sh
set -e

cd /app

PORT="${PORT:-${PORTAL_PORT:-8080}}"
API_PORT="${API_PORT:-8081}"

echo "Starting FTC Virtual Devices (dispatcher on ${PORT}, API on ${API_PORT})..."

# 1. Database migrations (idempotent; only if a database is configured)
if [ -n "$DATABASE_URL" ] || [ -n "$PGHOST" ]; then
    echo "Running database migrations..."
    attempt=1
    while [ "$attempt" -le 5 ]; do
        if php api/migrate.php; then
            break
        fi
        if [ "$attempt" -eq 5 ]; then
            echo "WARNING: migrations failed after 5 attempts; continuing anyway."
            break
        fi
        echo "Migration attempt $attempt failed; retrying in 5s..."
        attempt=$((attempt + 1))
        sleep 5
    done
else
    echo "No database configured (DATABASE_URL/PG*); skipping migrations."
fi

# 2. PHP API server (built-in, PATH_INFO routing: /api/index.php/<resource>).
#    Chi lang nghe noi bo 127.0.0.1 — dispatcher proxy /api/* ra single-port 8080.
php -S 127.0.0.1:${API_PORT} -t /app > /dev/null 2>&1 &

# 3. Master Dispatcher: portal + all device simulators + proxy /api/* tren 1 cong
START_PHP=0 API_PORT=${API_PORT} python3 run_all.py &

echo "============================================================="
echo "  Portal + Devices + API: http://localhost:${PORT}  (single-port)"
echo "============================================================="

trap 'echo "Stopping servers..."; kill 0 2>/dev/null' EXIT INT TERM
wait
