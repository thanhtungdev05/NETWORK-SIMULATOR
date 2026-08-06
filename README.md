# 🚀 Hệ Thống Giả Lập Thiết Bị Mạng FPT (FPT Network Device Simulator)

Hệ thống giả lập giao diện quản trị web (Web Admin Interface) đa thiết bị dành cho các dòng Modem/Router/Mesh Wi-Fi mạng FPT Telecom. Dự án được thiết kế chuyên biệt cho công tác **đào tạo, thực hành, kiểm tra tay nghề kỹ thuật và thử nghiệm kịch bản cấu hình**.

---

## 🌟 1. Tính Năng Nổi Bật (Key Features)

- 🌐 **Master Dispatcher duy nhất (Port 8080)**: Gom toàn bộ 6 thiết bị giả lập cùng Portal chạy chung trên **duy nhất 1 cổng 8080** mà không cần bật nhiều cửa sổ terminal hay mở nhiều cổng khác nhau.
- 💡 **Hệ thống Đề Bài & Hướng Dẫn Từng Bước (Step-by-Step Guide Popups Engine)**:
  - Tự động hiển thị các **Bong bóng hướng dẫn đỏ (Red Tooltips)** gắn chính xác vào từng trường nhập liệu, nút bấm trên giao diện thiết bị giả lập.
  - Cho phép người học vừa xem yêu cầu đề bài vừa thực hành từng bước trực quan.
- 🎯 **Đề Bài Cấu Hình Chi Tiết Chuẩn FPT**: Cung cấp đầy đủ thông số mẫu chuẩn cho từng bài tập (PPPoE Username/Password, SSID, WPA Key, IP Pool, Subnet Mask, DNS FPT/Google, Port Forwarding, Band Steering, Mesh Wi-Fi,...).
- 🔄 **Cơ Chế Chống Cache Trình Duyệt Tự Động (Auto Cache-Busting)**: Tích hợp `Cache-Control: no-cache` trên Server và tự động đánh phiên bản mã nguồn (`?v=N`), đảm bảo giao diện và kịch bản luôn cập nhật ngay khi sửa đổi.

---

## 📱 2. Danh Sách Thiết Bị & Bài Học Giả Lập

Dự án hỗ trợ **6 dòng thiết bị mạng FPT Telecom** với danh sách các bài học thực hành được chuẩn hóa:

### 1️⃣ ONT AC1000F (`DEVICE_AC1000F`) — 10 Bài Học
- **Bài 1**: Cấu hình kết nối Internet bằng giao thức PPPoE
- **Bài 2**: Cấu hình mạng Wi-Fi (Band Steering)
- **Bài 3**: Cấu hình IP LAN & DHCP Server
- **Bài 4**: Cấu hình Mở Port (Port Forwarding)
- **Bài 5**: Cấu hình DNS Server (DNS FPT & Google)
- **Bài 6**: Cấu hình Remote Web Access
- **Bài 7**: Cấu hình Backup / Restore hệ thống
- **Bài 8**: Cấu hình WiFi Timer (Lên lịch bật/tắt Wi-Fi)
- **Bài 9**: Cấu hình Reboot Timer (Lên lịch khởi động lại)
- **Bài 10**: Cấu hình Chặn Web (URL Filter)

### 2️⃣ ONT AX3000C (`DEVICE_AX3000C`) — 5 Bài Học
- **Bài 1**: Bài 1-Cấu hình PPPoE
- **Bài 2**: Bài 2-Cấu hình WiFi (SSID & WPA Key)
- **Bài 3**: Bài 3-Cấu hình đổi IP LAN & DHCP Pool
- **Bài 4**: Bài 4-Cấu hình DNS (FPT DNS & Google DNS)
- **Bài 5**: Bài 5-Cấu hình NAT Port (Port Forwarding)

### 3️⃣ ONT AX3000GZ (`DEVICE_AX3000GZ`) — 9 Bài Học
- **Bài 1**: Bài 1: Cấu hình ONT (PPPoE Connection)
- **Bài 2**: Bài 2: Cấu hình WiFi
- **Bài 3**: Bài 3: Tính năng BandSteering (RSSI Threshold)
- **Bài 4**: Bài 4: Cấu hình Mesh WiFi (Roaming Limit 2.4G/5G)
- **Bài 5**: Bài 5: Cấu hình IGMP (IPTV Service)
- **Bài 6**: Bài 6: Cấu hình DDNS (Dynamic DNS No-IP)
- **Bài 7**: Bài 7: Cấu hình SNTP (Time Synchronization)
- **Bài 8**: Bài 8: Cấu hình Port Forwarding
- **Bài 9**: Bài 9: Cấu hình Chặn MAC (MAC Filter Blacklist)

### 4️⃣ ONT AX3000HV2 (`DEVICE_AX3000HV2`) — 6 Bài Học
- **Bài 1**: Bài 1: Cấu hình PPPoE
- **Bài 2**: Bài 2: Cấu hình Wi-Fi Host (Mạng chính)
- **Bài 3**: Bài 3: Cấu hình Wi-Fi Guest (Mạng khách)
- **Bài 4**: Bài 4: Cấu hình Wi-Fi IoT (Mạng IoT)
- **Bài 5**: Bài 5: Cấu hình LAN Based (IP LAN & DHCP)
- **Bài 6**: Bài 6: Cấu hình DHCP Reservation (Gán IP cố định)

### 5️⃣ Internet Hub AX3000S (`DEVICE_AX3000S`) — 7 Bài Học
- **Bài 1**: Bài 1-Cấu hình PPPoE
- **Bài 2**: Bài 2-Cấu hình WIFI
- **Bài 3**: Bài 3-Cấu hình WIFI IOT
- **Bài 4**: Bài 4-Cấu hình DNS
- **Bài 5**: Bài 5-Cấu hình địa chỉ IP LAN (Pool Count & Lease Time)
- **Bài 6**: Bài 6-Cấu hình Port Forwarding (NAT FPT)
- **Bài 7**: Bài 7-Cấu hình Mesh wifi (Controller Mode)

### 6️⃣ Wi-Fi 7 BE15000 (`DEVICE_BE15000`) — Các Bài Học Quản Trị
- Quản lý LAN IPv4 & DHCP Server
- Trạng thái mạng cục bộ (Local Network Status)
- Chẩn đoán mạng (Ping / Traceroute Diagnostics)
- Quản lý tài khoản & Đổi mật khẩu
- Bảng ARP (ARP Table Mapping)
- Cấu hình Wi-Fi Nâng cao & System Logs

---

## 📋 3. Yêu Cầu Hệ Thống (Prerequisites)

- **Python 3.x** (Khuyên dùng Python 3.8 trở lên)
- **Hệ điều hành**: Windows, macOS, hoặc Linux.
- 💡 **Lưu ý**: Dự án sử dụng hoàn toàn các thư viện chuẩn (Standard Library) của Python (`http.server`, `urllib`, `threading`, `os`, `sys`), **không cần cài đặt thêm bất kỳ thư viện bên thứ 3 nào** (`pip install`).

---

## 📥 4. Hướng Dẫn Clone & Cấu Trúc Thư Mục

### 🔹 Clone Repository:
```bash
git clone <URL_REPOSITORY_CUA_BAN>
cd giailapthietbi
```

### 📁 Cấu trúc thư mục chính:
```
giailapthietbi/
├── CHAY-TAT-CA.bat          # File script khởi chạy nhanh 1-Click trên Windows
├── run_all.py               # Master Dispatcher Server (Cổng 8080)
├── index.html               # Giao diện chính Portal người dùng
├── styles.css               # Địn style CSS cho Portal
├── app.js                   # Logic điều khiển Portal & nạp bài học
├── guide-overlay.js         # Engine hiển thị bong bóng hướng dẫn đỏ (Red Tooltips)
├── data.js / devices/       # Quản lý module dữ liệu đề bài 6 thiết bị
│   ├── ac1000f/data.js
│   ├── ax3000c/data.js
│   ├── ax3000gz/data.js
│   ├── ax3000hv2/data.js
│   ├── ax3000s/data.js
│   └── be15000/data.js
├── step_by_step/            # Module định nghĩa từng bước hướng dẫn cho từng bài học
└── sim_*/                   # Mã nguồn giả lập backend & giao diện web CGI/ASP/LuCI từng thiết bị
```

---

## ⚡ 5. Hướng Dẫn Khởi Chạy (Quick Start)

Bạn có thể khởi chạy toàn bộ hệ thống bằng **1 trong 2 cách** sau:

### 🔹 Cách 1: Chạy bằng File Batch (Khuyên dùng trên Windows)
Nhấp kép vào file `CHAY-TAT-CA.bat` hoặc chạy trong **CMD**:

```cmd
.\CHAY-TAT-CA.bat
```

> **Mô tả**: Script sẽ tự động khởi chạy Master Server trên cổng `8080` và tự động mở trình duyệt web tại địa chỉ `http://localhost:8080`.

---

### 🔹 Cách 2: Chạy bằng Lệnh Python (Đa nền tảng Windows / macOS / Linux)
Chạy lệnh Python trực tiếp từ thư mục dự án:

```bash
python run_all.py
```

---

## 🌐 6. Địa Chỉ Truy Cập (Port & URL)

Hệ thống chạy tập trung trên cổng duy nhất:

| Dịch Vụ / Thiết Bị | Địa Chỉ Truy Cập | Cổng (Port) |
|---|---|---|
| **Portal Giả Lập Mạng FPT (Master)** | `http://localhost:8080` | `8080` |

*Khi người dùng chọn thiết bị trên Portal (như AC1000F, AX3000C,...), Master Dispatcher sẽ tự động điều hướng request mà không cần mở lại cổng.*

---

## 💡 7. Mẹo Xóa Cache Trình Duyệt Khi Sửa Code

Nếu bạn thực hiện chỉnh sửa nội dung bài học hoặc giao diện nhưng chưa thấy thay đổi trên web:
- Nhấn phím **`Ctrl + F5`** (hoặc **`Ctrl + Shift + R`**) trên trình duyệt để buộc tải lại dữ liệu mới nhất.

---

## 🛑 8. Hướng Dẫn Dừng Hệ Thống

- **Windows**: Đóng cửa sổ Command Prompt (`CMD`) đang chạy.
- **Terminal**: Nhấn `Ctrl + C` tại cửa sổ Terminal đang chạy script Python để dừng dịch vụ.

