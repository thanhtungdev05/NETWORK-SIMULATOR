#!/usr/bin/env bash
# ============================================================
#  Chạy bộ giả lập AX3000S bằng máy chủ tĩnh (Python)
# ============================================================
cd "$(dirname "$0")/www" || exit 1
echo
echo "  Đang chạy máy chủ giả lập AX3000S..."
echo "  Mở trình duyệt và vào:  http://localhost:8080"
echo "  (Nhấn Ctrl+C để dừng)"
echo
python3 -m http.server 8080
