#!/usr/bin/env bash
# ============================================================
#  Chạy bộ giả lập AX3000S bằng máy chủ (Port 8098)
# ============================================================
cd "$(dirname "$0")" || exit 1
echo
echo "  Đang chạy máy chủ giả lập AX3000S..."
echo "  Mở trình duyệt và vào:  http://localhost:8098"
echo "  (Nhấn Ctrl+C để dừng)"
echo
python3 server.py 8098
