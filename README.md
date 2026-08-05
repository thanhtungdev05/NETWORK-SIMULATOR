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

> **Mô tả**: Lệnh này sẽ tự động bật 7 cửa sổ CMD tương ứng với 7 server dịch vụ và tự động mở trình duyệt truy cập địa chỉ `http://127.0.0.1:8080`.

---

### 🔹 Cách 2: Chạy bằng Python (Khuyên dùng - Đa nền tảng Windows / macOS / Linux)
Chạy lệnh Python trực tiếp từ thư mục gốc dự án:

```bash
python run_all.py
```

> **Mô tả**: Script Python sẽ khởi tạo tất cả các server giả lập trên từng cổng tương ứng và tự động mở trình duyệt tại `http://localhost:8080`.

---

## 🌐 3. Danh Sách Các Server & Cổng Dịch Vụ (Ports)

Khi hệ thống khởi chạy, các dịch vụ sẽ hoạt động tại các địa chỉ sau:

| STT | Dịch Vụ / Thiết Bị | Địa Chỉ Truy Cập | Cổng (Port) |
|---|---|---|---|
| 1 | **Portal Trung Tâm / Đăng nhập** | `http://localhost:8080` | `8080` |
| 2 | **Server AC1000F** | `http://localhost:8081` | `8081` |
| 3 | **Server AX3000C** | `http://localhost:8090` | `8090` |
| 4 | **Server AX3000Hv2** | `http://localhost:8092` | `8092` |
| 5 | **Server AX3000GZ** | `http://localhost:8094` | `8094` |
| 6 | **Server BE15000** | `http://localhost:8096` | `8096` |
| 7 | **Server AX3000S** | `http://localhost:8098` | `8098` |

---

## 🛑 4. Hướng Dẫn Dừng Hệ Thống

- **Windows (mở nhiều cửa sổ)**: Đóng tất cả các cửa sổ Command Prompt (`CMD`) được tạo ra khi chạy script.
- **Terminal**: Nhấn `Ctrl + C` tại cửa sổ Terminal đang chạy script để dừng dịch vụ.

---

## 📝 Ghi Chú
- Giữ nguyên các cửa sổ terminal/CMD trong suốt quá trình sử dụng và thực hành.
- Nếu gặp lỗi cổng bị chiếm dụng (Address already in use), hãy đảm bảo không có ứng dụng nào khác đang sử dụng các cổng `8080`, `8081`, `8090`, `8092`, `8094`, `8096`, `8098`.
