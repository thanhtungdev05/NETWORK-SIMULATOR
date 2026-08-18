# 🚀 Hệ Thống Giả Lập Thiết Bị Mạng FPT (FTC Virtual Devices)

Hệ thống giả lập giao diện quản trị web (Web Admin Interface) dành cho các dòng thiết bị modem/router mạng FPT Telecom. Dự án phục vụ mục đích thực hành, đào tạo, demo, quản trị nhân sự và tự động chấm điểm kỹ năng cấu hình thiết bị của Kỹ thuật viên (KTV).

---

## 📋 Yêu Cầu Hệ Thống (Prerequisites)

Bạn có thể chọn **1 trong 2 cách** để chạy dự án:

### Cách 1: Chạy bằng Docker (Khuyên dùng)
- **Docker** & **Docker Compose** (Cài qua [Docker Desktop](https://www.docker.com/products/docker-desktop/)).
- Không cần cài đặt riêng Python hay PHP — Docker sẽ tự động đóng gói và cấu hình môi trường hoàn chỉnh.

### Cách 2: Chạy trực tiếp trên máy (Native)
- **Python 3.10+**
- **PHP-CLI 8.1+** (hỗ trợ `php-pgsql`, `php-mbstring`, `php-curl`).
- Cài đặt thư viện Python: `pip install -r requirements.txt`

---

## 📥 1. Clone Dự Án & Cấu Hình

1. **Clone repository về máy:**
   ```bash
   git clone <URL_REPOSITORY_CUA_BAN>
   cd tracking
   ```

2. **Cấu hình biến môi trường:**
   Tạo file `.env` từ file mẫu `.env.example`:
   ```bash
   cp .env.example .env
   ```
   Sau đó cập nhật thông tin trong file `.env`:
   ```env
   # Kết nối PostgreSQL (Neon Database)
   DATABASE_URL=postgresql://<user>:<password>@<host>/<database>?sslmode=require
   
   # Cấu hình Django Admin Panel
   DJANGO_SETTINGS_MODULE=admin_site.settings
   DJANGO_SECRET_KEY=your-secret-key-here
   DJANGO_DEBUG=1
   DJANGO_SUPERUSER_USERNAME=admin
   DJANGO_SUPERUSER_EMAIL=admin@example.com
   DJANGO_SUPERUSER_PASSWORD=YourPasswordHere!
   ```

---

## ⚡ 2. Hướng Dẫn Khởi Chạy Local (Quick Start)

### 🔹 Cách 1: Khởi chạy bằng Docker Compose (Khuyên dùng)
Mở Terminal / PowerShell tại thư mục dự án và chạy:

```bash
docker compose up --build
```

> **Cơ chế hoạt động**:
> - Tự động build môi trường Linux chứa Python 3.12, PHP-CLI, Composer và Django.
> - Tự động chạy migrations PostgreSQL (Neon) cho cả PHP và Django.
> - Tự động tạo tài khoản Superuser Admin (nếu chưa có).
> - Khởi động Master Dispatcher và ánh xạ **cổng duy nhất `8080`** ra máy tính của bạn.

---

### 🔹 Cách 2: Khởi chạy trực tiếp (Native Python)
Nếu không dùng Docker, bạn có thể chạy trực tiếp bằng lệnh:

```bash
# 1. Cài đặt dependencies (chỉ cần chạy lần đầu)
pip install -r requirements.txt

# 2. Khởi chạy Master Dispatcher
python run_all.py
```

> **Cơ chế hoạt động**: `run_all.py` tự động đọc file `.env`, tự bật PHP API (nội bộ 8082), tự bật Django Admin (nội bộ 8083) và gom toàn bộ điều hướng về **cổng duy nhất `8080`**.

---

## 🌐 3. Cấu Trúc Điều Hướng (Single-Port 8080)

Toàn bộ hệ thống đều được truy cập qua **1 cổng duy nhất `8080`**:

| Dịch vụ | Đường dẫn truy cập | Mô tả |
| :--- | :--- | :--- |
| 🏠 **Portal Trung Tâm** | `http://localhost:8080/` | Trang chủ chọn thiết bị và chế độ thực hành |
| 📊 **Dashboard Đào Tạo** | `http://localhost:8080/dashboard/` | Báo cáo tiến độ, KPI, ma trận kết quả KTV |
| ⚙️ **Trang Quản Trị Admin** | `http://localhost:8080/admin/` | Quản lý KTV, Lớp học, Bài Lab, Timer Sessions, Xuất CSV |
| 🔌 **PHP REST API** | `http://localhost:8080/api/` | API chấm điểm, tracking, IAM auth |
| 📡 **7 Thiết bị Giả lập** | `http://localhost:8080/sim_<model>/` | Giao diện cấu hình AC1000F, AX3000C, AX3000GZ, AX3000HV2, AX3000S, BE12000, BE15000 |

### 🔐 Thông Tin Đăng Nhập Trang Admin
- **URL**: `http://localhost:8080/admin/`
- **Tài khoản**: Cấu hình tại biến `DJANGO_SUPERUSER_USERNAME` (mặc định: `admin`)
- **Mật khẩu**: Cấu hình tại biến `DJANGO_SUPERUSER_PASSWORD` trong file `.env`


---

## 🛠 4. Các Tính Năng Đào Tạo Cốt Lõi

1. **Hai Chế Độ Đào Tạo:**
   - **💡 Chế độ Hướng dẫn (Guide Mode):** Có bong bóng chỉ dẫn từng bước (Tooltips). KTV được phép cấu hình sai, sửa lại và chỉ ghi nhận kết quả khi đạt 100%.
   - **⚡ Chế độ Thực hành (Practice Mode):** Ẩn toàn bộ hướng dẫn, chấm điểm khắt khe. Nếu cấu hình sai sẽ yêu cầu làm lại từ đầu và reset modem về mặc định.

2. **Chấm Điểm Tự Động Thông Minh (Smart Auto-Grading):**
   - Đọc trực tiếp dữ liệu từ DOM của iframe thiết bị giả lập và so khớp với bộ tiêu chí chấm điểm chuẩn FPT Telecom.
   - Hỗ trợ lưu cache đa trang (Wi-Fi 2.4G, Wi-Fi 5G, WAN, LAN) để tổng hợp điểm số chính xác khi bấm nộp bài.

3. **Telemetry & Anti-Fraud:**
   - Tự động ghi nhận thời gian thực hiện (giây), địa chỉ IP, User Agent, loại phiên và chi tiết từng bước cấu hình đúng/sai.

---

## 🛑 5. Dừng Hệ Thống

- **Với Docker Compose**: Nhấn `Ctrl + C` hoặc chạy lệnh `docker compose down`.
- **Với Python Native**: Nhấn `Ctrl + C` tại cửa sổ Terminal đang chạy `run_all.py`.
