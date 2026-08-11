
# Hướng dẫn chạy dashboard giám sát KTV

## 1. Khởi chạy

Dashboard được tích hợp vào hệ thống giả lập và truy cập qua URL `/dashboard/` (do `run_all.py` mount). Chạy toàn hệ thống từ thư mục gốc:

```bash
python run_all.py
```

## 2. Truy cập

Mở trình duyệt và truy cập:

- Dashboard: [http://localhost:8080/dashboard/](http://localhost:8080/dashboard/)
- Cần đăng nhập trước (phân quyền `require_user`) tại cổng hệ thống.

## 3. Nguồn dữ liệu

Dashboard lấy dữ liệu thực từ API `GET /api/index.php/dashboard/all`, nguồn là bảng Neon `timer_sessions`. Không dùng mock data.

