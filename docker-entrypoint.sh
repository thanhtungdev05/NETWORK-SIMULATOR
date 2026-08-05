#!/bin/sh
set -e

cd /app

PORT="${PORT:-${PORTAL_PORT:-8000}}"

echo "Starting FTC Virtual Devices servers (web/API on port ${PORT})..."

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

# 2. Web server: Apache + PHP (portal, API, device static pages)
printf 'Listen %s\n' "$PORT" > /etc/apache2/ports.conf
sed "s/{{PORT}}/${PORT}/g" /etc/apache2/sites-available/ftc.conf > /etc/apache2/sites-enabled/000-ftc.conf
apache2ctl -DFOREGROUND &

# 3. Device simulator servers
(cd /app/sim_ac1000f  && python3 server2.py 8081) &
(cd /app/sim_ax3000c  && python3 server.py 8090) &
(cd /app/sim_ax3000hv2 && python3 server2.py 8092) &
(cd /app/sim_ax3000gz  && python3 server.py 8094) &
(cd /app/sim_be15000  && python3 server.py 8096) &
(cd /app/sim_ax3000s  && python3 server.py 8098) &

echo "============================================================="
echo "  Portal:          http://localhost:${PORT}"
echo "  API:             http://localhost:${PORT}/api/index.php"
echo "  AC1000F:         http://localhost:8081"
echo "  AX3000C:         http://localhost:8090"
echo "  AX3000Hv2:       http://localhost:8092"
echo "  AX3000GZ:        http://localhost:8094"
echo "  BE15000:         http://localhost:8096"
echo "  AX3000S:         http://localhost:8098"
echo "============================================================="

trap 'echo "Stopping servers..."; kill 0 2>/dev/null' EXIT INT TERM
wait
