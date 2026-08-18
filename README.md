# 🚀 Hệ Thống Giả Lập Thiết Bị Mạng FPT (FPT Network Device Simulator)

Hệ thống giả lập giao diện quản trị web (Web Admin Interface) dành cho các dòng thiết bị modem/router mạng FPT Telecom. Dự án phục vụ mục đích thực hành, đào tạo, demo và tự động chấm điểm kỹ năng cấu hình thiết bị của Kỹ thuật viên (KTV).

---

## 📋 Yêu Cầu Hệ Thống (Prerequisites)

- **Python 3.x** (Khuyên dùng Python 3.8 trở lên)
- **Hệ điều hành**: Windows, macOS, hoặc Linux.
- 💡 **Lưu ý**: Dự án sử dụng hoàn toàn các thư viện chuẩn (Standard Library) của Python, **không cần cài đặt thêm bất kỳ thư viện bên thứ 3 nào** (`pip install`).
- Môi trường chạy PHP nội bộ (đã được tích hợp sẵn qua script khởi động).

---

## 📥 1. Hướng Dẫn Clone Project

Mở Terminal / Command Prompt / Git Bash và chạy lệnh:

```bash
git clone <URL_REPOSITORY_CUAR_BAN>
cd giailapthietbi
```

---

## ⚡ 2. Hướng Dẫn Khởi Chạy (Quick Start)

### 🔹 Cách 1: Chạy bằng Docker Compose (Khuyên dùng - Chuẩn Production / Đa nền tảng)
Mở Terminal / PowerShell tại thư mục dự án và chạy:

```bash
docker compose up --build
```

> **Mô tả**: Docker sẽ tự động build image, nạp biến môi trường `.env`, chạy migrations PostgreSQL (Neon), tự tạo tài khoản Django Superuser, và khởi chạy toàn bộ hệ thống trên **1 cổng duy nhất `8080`**:
> - **Portal & Giả lập**: `http://localhost:8080`
> - **Dashboard**: `http://localhost:8080/dashboard/`
> - **Admin Quản trị**: `http://localhost:8080/admin/`

### 🔹 Cách 2: Chạy trực tiếp bằng Python
```bash
python run_all.py
```

---

## 🛠 3. Các Tính Năng Đào Tạo Cốt Lõi

Dự án không chỉ mô phỏng thiết bị mà còn tích hợp bộ công cụ Đào tạo và Chấm điểm tự động:

### A. Hai Chế Độ Hoạt Động (Dual Modes)
1. **💡 Chế độ Hướng dẫn (Guide Mode)**
   - **Mục đích:** Học tập và rèn luyện.
   - **Tính năng:**
     - Hiển thị bong bóng hướng dẫn (Tooltips) chỉ dẫn từng bước thao tác. Hỗ trợ hiển thị độc lập theo từng trang con (vd: trang 2.4G và 5G).
     - KTV được phép cấu hình sai. Khi ấn **Nộp Bài**, hệ thống sẽ hiện bảng báo lỗi, cho phép đóng bảng điểm để **quay lại giao diện cũ sửa lỗi** và nộp lại.
     - **Chỉ ghi nhận Tracking (Log) khi đạt 100%**: Tránh xả rác cơ sở dữ liệu với các lần làm thử/sai của học viên.

2. **⚡ Chế độ Thực hành (Practice Mode)**
   - **Mục đích:** Kiểm tra, thi thật.
   - **Tính năng:**
     - Ẩn toàn bộ hướng dẫn, ép KTV tự nhớ các thông số cấu hình chuẩn FPT.
     - **Khắt khe:** Nếu chấm điểm bị sai dù chỉ 1 tiêu chí, hệ thống khóa màn hình, yêu cầu "Quay lại làm từ đầu" và **reset toàn bộ thiết bị** (mất toàn bộ cấu hình).
     - Gửi Tracking dữ liệu lập tức (bất kể Đạt hay Chưa đạt) ngay khi nhấn Nộp Bài để nạp vào Data Dashboard.

### B. Chấm Điểm Tự Động Thông Minh (Smart Auto-Grading)
- **Lấy dữ liệu trực tiếp từ Iframe giả lập:** Dùng DOM query để đọc dữ liệu KTV đã nhập, so khớp với bộ quy tắc chuẩn (`rules`).
- **Lưu bộ nhớ tạm (Cache đa trang):** Khắc phục nhược điểm KTV phải chuyển trang khi cấu hình (VD: Cấu hình Wi-Fi 2.4G xong, nhấn *Save*, rồi chuyển sang Wi-Fi 5G, nhấn *Save*).
  - Hệ thống tự động bắt tín hiệu *Save* từ bên trong iframe (`window.parent.onSimulatorSave`).
  - Lấy điểm từng phần lưu vào `CACHE` cục bộ (`_AC1000F_BAI2_CACHE`).
  - Gộp chung toàn bộ khi nhấn "Nộp Bài" ở ngoài Portal chính.

### C. Ngăn Chặn Tải Lại Trang (Anti-Reload Script)
Thiết bị thực tế thường khởi động lại hoặc load lại trang khi bấm Save. Trong giả lập:
- Tích hợp bộ script Python (vd: `fix_saves.py`) tự động quét mã nguồn `.asp` của các giả lập.
- Chèn Javascript ngăn lệnh submit, hiển thị thông báo giả lập `✔ Saved successfully!` và gửi tín hiệu báo cáo cho Portal ở lớp vỏ ngoài.

### D. Hệ thống Tracking API & Logging
- Tích hợp sẵn endpoint `/api/index.php/tracking/timer`.
- Ghi nhận: ID KTV, Tên Bài Học, Điểm số, Tổng thời gian hoàn thành (tính bằng giây) và danh sách các lỗi cấu hình.
- 100% không bị gửi đúp dữ liệu nhờ màng lọc logic thông minh tại nút "Nộp Bài".

---

## 🌐 4. Cấu Trúc Cổng Dịch Vụ (Single-Port)

| Thành phần | Địa chỉ (Routing qua Master Dispatcher) |
|---|---|
| **Portal Trung Tâm & Bài Học** | `http://localhost:8080/` |
| **API Tracking (PHP)** | `http://localhost:8080/api/index.php` |
| **Iframe Giả lập AC1000F** | `http://localhost:8080/sim_ac1000f/...` |
| **Các giả lập khác** | `http://localhost:8080/sim_ax3000c/...` |

---

## 🛑 5. Hướng Dẫn Dừng Hệ Thống

- **Windows (CMD/PowerShell)**: Đóng cửa sổ CMD đang chạy (hoặc nhấn `Ctrl + C`).
- **Terminal (macOS/Linux)**: Nhấn `Ctrl + C` tại cửa sổ Terminal đang chạy script để dừng toàn bộ dịch vụ Python và PHP nội bộ.

---

## 📝 Ghi Chú
- Giữ nguyên cửa sổ terminal/CMD trong suốt quá trình thực hành.
- Nếu bạn có thay đổi cấu trúc thiết bị và luồng lưu file, hãy chạy lại lệnh vá file của Python để giả lập hoạt động đúng với Portal.
- Đảm bảo cổng `8080` không bị chiếm dụng trước khi bật file Batch/Python.
