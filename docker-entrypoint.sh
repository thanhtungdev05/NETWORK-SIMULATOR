#!/bin/sh
set -e

cd /app

PORTAL_PORT="${PORTAL_PORT:-8000}"

echo "Starting FTC Virtual Devices servers..."

python3 -m http.server "$PORTAL_PORT" &
(cd /app/sim_ac1000f  && python3 server2.py 8081) &
(cd /app/sim_ax3000c  && python3 server.py 8090) &
(cd /app/sim_ax3000hv2 && python3 server2.py 8092) &
(cd /app/sim_ax3000gz  && python3 server.py 8094) &
(cd /app/sim_be15000  && python3 server.py 8096) &
(cd /app/sim_ax3000s  && python3 server.py 8098) &

echo "============================================================="
echo "  Portal:          http://localhost:${PORTAL_PORT}"
echo "  AC1000F:         http://localhost:8081"
echo "  AX3000C:         http://localhost:8090"
echo "  AX3000Hv2:       http://localhost:8092"
echo "  AX3000GZ:        http://localhost:8094"
echo "  BE15000:         http://localhost:8096"
echo "  AX3000S:         http://localhost:8098"
echo "============================================================="

trap 'echo "Stopping servers..."; kill 0 2>/dev/null' EXIT INT TERM
wait
