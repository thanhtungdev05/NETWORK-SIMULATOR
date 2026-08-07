# 🚀 Hệ Thống Giả Lập Thiết Bị Mạng FPT (FPT Network Device Simulator)

Hệ thống giả lập giao diện quản trị web (Web Admin Interface) dành cho các dòng thiết bị modem/router mạng FPT Telecom. Dự án phục vụ mục đích thực hành, đào tạo, demo và kiểm thử giao diện thiết bị.

---

## 📋 Yêu Cầu Hệ Thống (Prerequisites)

- **Python 3.x** (Khuyên dùng Python 3.8 trở lên)
- **Hệ điều hành**: Windows, macOS, hoặc Linux.
- 💡 **Lưu ý**: Dự án sử dụng hoàn toàn các thư viện chuẩn (Standard Library) của Python, **không cần cài đặt thêm bất kỳ thư viện bên thứ 3 nào** (`pip install`).

---

## 📥 1. Hướng Dẫn Clone Project

Mở Terminal / Command Prompt / Git Bash và chạy lệnh:

```bash
git clone <URL_REPOSITORY_CUAR_BAN>
cd giailapthietbi
```

---

## ⚡ 2. Hướng Dẫn Khởi Chạy (Quick Start)

Bạn có thể khởi chạy toàn bộ hệ thống bằng **1 trong 2 cách** sau:

### 🔹 Cách 1: Chạy bằng File Batch (Dành riêng cho Windows)
Mở **Command Prompt (CMD)** hoặc **PowerShell** tại thư mục dự án và chạy:

```cmd
.\CHAY-TAT-CA.bat
```

> **Mô tả**: Lệnh này tự động bật **Master Dispatcher** chạy toàn bộ hệ thống trên **1 cổng duy nhất `8080`** và tự động mở trình duyệt truy cập `http://localhost:8080`.

---

### 🔹 Cách 2: Chạy bằng Python (Khuyên dùng - Đa nền tảng Windows / macOS / Linux)
Chạy lệnh Python trực tiếp từ thư mục gốc dự án:

```bash
python run_all.py
```

> **Mô tả**: Master Dispatcher gộp Portal + toàn bộ thiết bị giả lập + proxy `/api/*` sang PHP nội bộ trên **1 cổng duy nhất `8080`**, tự động mở trình duyệt tại `http://localhost:8080`.

---

## 🌐 3. Cổng Dịch Vụ (Single-Port)

Toàn bộ hệ thống hoạt động trên **1 cổng duy nhất `8080`**:

| Thành phần | Địa chỉ |
|---|---|
| **Portal Trung Tâm / Đăng nhập / Hướng dẫn (tooltips)** | `http://localhost:8080` |
| **API PHP (IAM, tracking)** | `http://localhost:8080/api/index.php` |

Các thiết bị giả lập: **AC1000F, AX3000C, AX3000Hv2, AX3000GZ, BE15000, AX3000S, BE12000** — truy cập từ Portal Trung Tâm.

---

## 🛑 4. Hướng Dẫn Dừng Hệ Thống

- **Windows**: Đóng cửa sổ CMD đang chạy (hoặc nhấn `Ctrl + C`).
- **Terminal**: Nhấn `Ctrl + C` tại cửa sổ Terminal đang chạy script để dừng toàn bộ dịch vụ (kèm theo PHP nội bộ).

---

## 📝 Ghi Chú
- Giữ nguyên cửa sổ terminal/CMD trong suốt quá trình sử dụng và thực hành.
- Nếu gặp lỗi cổng bị chiếm dụng (Address already in use), hãy đảm bảo không có ứng dụng nào khác đang sử dụng cổng `8080`.
