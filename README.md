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

> **Mô tả**: Lệnh này sẽ tự động khởi chạy Master Server duy nhất và tự động mở trình duyệt truy cập địa chỉ `http://localhost:8080`. Không còn hiện tượng bật nhiều cửa sổ CMD rác như trước.

---

### 🔹 Cách 2: Chạy bằng Python (Khuyên dùng - Đa nền tảng Windows / macOS / Linux)
Chạy lệnh Python trực tiếp từ thư mục gốc dự án:

```bash
python run_all.py
```

> **Mô tả**: Script Python sẽ khởi tạo Master Dispatcher để gánh toàn bộ hệ thống trên duy nhất 1 cổng, tự động mở trình duyệt tại `http://localhost:8080`.

---

## 🌐 3. Cổng Dịch Vụ (Ports)

Hệ thống đã được tối ưu hóa theo kiến trúc Master Dispatcher, vì vậy **toàn bộ Portal và các Thiết bị giả lập đều chạy chung trên 1 cổng duy nhất**.

| STT | Dịch Vụ / Thiết Bị | Địa Chỉ Truy Cập | Cổng (Port) |
|---|---|---|---|
| 1 | **Toàn bộ hệ thống** | `http://localhost:8080` | `8080` |

*Lưu ý: Các thiết bị như AC1000F, AX3000C... sẽ được truy cập thông qua các đường dẫn con (Ví dụ: `http://localhost:8080/sim_ac1000f/`) thay vì mở thêm cổng riêng.*

---

## 🛑 4. Hướng Dẫn Dừng Hệ Thống

- **Windows**: Đóng cửa sổ Command Prompt (`CMD`) duy nhất đang chạy.
- **Terminal**: Nhấn `Ctrl + C` tại cửa sổ Terminal đang chạy script để dừng dịch vụ.

---

## 📝 Ghi Chú
- Giữ nguyên cửa sổ terminal/CMD duy nhất đó trong suốt quá trình sử dụng và thực hành.
- Nếu gặp lỗi cổng bị chiếm dụng (Address already in use), hãy đảm bảo không có ứng dụng nào khác đang sử dụng cổng `8080`.
