# 🚀 Hệ Thống Giả Lập Thiết Bị Mạng FPT (FPT Network Device Simulator)

Hệ thống giả lập giao diện quản trị web (Web Admin Interface) đa thiết bị dành cho các dòng Modem/Router/Mesh Wi-Fi mạng FPT Telecom. Dự án được thiết kế chuyên biệt cho công tác **đào tạo, thực hành, kiểm tra tay nghề kỹ thuật và thử nghiệm kịch bản cấu hình**.

---

## 🌟 1. Tính Năng Nổi Bật (Key Features)

- 🌐 **Master Dispatcher Duy Nhất (Port 8080)**:
  - Gom toàn bộ **7 thiết bị giả lập** cùng Portal chính chạy chung trên **duy nhất 1 cổng 8080**.
  - Không cần bật nhiều cửa sổ terminal hay mở nhiều cổng khác nhau (`8081-8098`).
  - Hệ thống tự động điều hướng request (`/sim_ac1000f`, `/sim_ax3000c`, `/sim_ax3000gz`, `/sim_ax3000hv2`, `/sim_ax3000s`, `/sim_be12000`, `/sim_be15000`).

- 💡 **Hệ Thống Bong Bóng Hướng Dẫn Từng Bước (Interactive Tooltips Engine)**:
  - Tự động hiển thị **Bong bóng hướng dẫn màu đỏ (Red Tooltips)** gắn chính xác vào từng trường nhập liệu, nút bấm, menu trên giao diện thiết bị giả lập.
  - Cho phép người học vừa xem yêu cầu đề bài vừa thao tác từng bước trực quan, minh họa chính xác các bước thực hành.

- 🎯 **Đề Bài Cấu Hình Chi Tiết Chuẩn FPT**:
  - Cung cấp đầy đủ các thông số mẫu chuẩn cho từng bài tập: Tài khoản PPPoE, SSID/WPA Key Wi-Fi, IP LAN & DHCP Pool, DNS FPT/Google, Mở Port (Port Forwarding), Band Steering, MLO (Wi-Fi 7), Wi-Fi Guest/IoT, URL Filter,...

- 🏗️ **Cấu Trúc Mô-đun Hóa Dữ Liệu Thiết Bị (`devices/`)**:
  - Tách rời dữ liệu đề bài, kịch bản chấm bài và tooltips của từng thiết bị vào thư mục riêng (`devices/<device_id>/`).
  - Nạp động qua `devices/index.js`, giúp việc nâng cấp, bổ sung thiết bị mới hoặc chỉnh sửa bài học trở nên dễ dàng và không ảnh hưởng đến toàn bộ hệ thống.

- 🔄 **Cơ Chế Chống Cache Trình Duyệt Tự Động (Auto Cache-Busting)**:
  - Tích hợp `Cache-Control: no-cache, no-store, must-revalidate` trên Master Server và tự động đánh phiên bản mã nguồn (`?v=timestamp`), đảm bảo giao diện và kịch bản luôn cập nhật ngay khi sửa đổi code.

---

## 📱 2. Danh Sách Thiết Bị & Bài Học Giả Lập

Hệ thống hỗ trợ **7 dòng thiết bị mạng FPT Telecom** với tổng cộng **54 bài học thực hành**:

### 1️⃣ ONT AC1000F (`DEVICE_AC1000F`) — 10 Bài Học
- **Bài 1**: Cấu hình PPPoE (Kết nối WAN Internet)
- **Bài 2**: Cấu hình mạng Wi-Fi (Band Steering - SSID & WPA Key)
- **Bài 3**: Cấu hình IP LAN & DHCP Server
- **Bài 4**: Cấu hình Mở Port (Port Forwarding Virtual Server)
- **Bài 5**: Cấu hình DNS Server (DNS FPT & Google)
- **Bài 6**: Cấu hình Remote Web Access (Quản lý từ xa)
- **Bài 7**: Cấu hình Backup / Restore hệ thống
- **Bài 8**: Cấu hình WiFi Timer (Lên lịch bật/tắt Wi-Fi)
- **Bài 9**: Cấu hình Reboot Timer (Lên lịch khởi động lại)
- **Bài 10**: Cấu hình Chặn Web (URL Filter Host)

### 2️⃣ ONT AX3000C (`DEVICE_AX3000C`) — 5 Bài Học
- **Bài 1**: Cấu hình PPPoE (Username & Password)
- **Bài 2**: Cấu hình WiFi (SSID & WPA Key)
- **Bài 3**: Cấu hình đổi IP LAN & DHCP Pool
- **Bài 4**: Cấu hình DNS (FPT DNS & Google DNS)
- **Bài 5**: Cấu hình NAT Port (Port Forwarding)

### 3️⃣ ONT AX3000GZ (`DEVICE_AX3000GZ`) — 9 Bài Học
- **Bài 1**: Cấu hình ONT (PPPoE WAN Connection)
- **Bài 2**: Cấu hình WiFi 2.4GHz & 5GHz
- **Bài 3**: Tính năng BandSteering (RSSI Threshold)
- **Bài 4**: Cấu hình Mesh WiFi (Roaming Limit 2.4G/5G)
- **Bài 5**: Cấu hình IGMP (IPTV Service Snooping/Proxy)
- **Bài 6**: Cấu hình DDNS (Dynamic DNS No-IP)
- **Bài 7**: Cấu hình SNTP (Time Synchronization)
- **Bài 8**: Cấu hình Port Forwarding
- **Bài 9**: Cấu hình Chặn MAC (MAC Filter Blacklist)

### 4️⃣ ONT AX3000HV2 (`DEVICE_AX3000HV2`) — 6 Bài Học
- **Bài 1**: Cấu hình PPPoE
- **Bài 2**: Cấu hình Wi-Fi Host (Mạng chính)
- **Bài 3**: Cấu hình Wi-Fi Guest (Mạng khách)
- **Bài 4**: Cấu hình Wi-Fi IoT (Mạng IoT)
- **Bài 5**: Cấu hình LAN Based (IP LAN & DHCP)
- **Bài 6**: Cấu hình DHCP Reservation (Gán IP cố định)

### 5️⃣ Internet Hub AX3000S (`DEVICE_AX3000S`) — 7 Bài Học
- **Bài 1**: Cấu hình PPPoE
- **Bài 2**: Cấu hình WIFI
- **Bài 3**: Cấu hình WIFI IOT
- **Bài 4**: Cấu hình DNS Server
- **Bài 5**: Cấu hình địa chỉ IP LAN (Pool Count & Lease Time)
- **Bài 6**: Cấu hình Port Forwarding (NAT FPT)
- **Bài 7**: Cấu hình Mesh wifi (Controller Mode)

### 6️⃣ Wi-Fi 7 BE12000 (`DEVICE_BE12000`) — 7 Bài Học *(Mới thêm)*
- **Bài 1**: Quản lý LAN IPv4 (IP Address, Subnet Mask & DHCP Server)
- **Bài 2**: Cấu hình Wi-Fi MLO (Multi-Link Operation - Wi-Fi 7)
- **Bài 3**: Trạng thái WAN Ethernet (Kiểm tra IP WAN, Gateway, DNS, Uptime)
- **Bài 4**: Chẩn đoán mạng (Network Diagnostics - Ping & Traceroute)
- **Bài 5**: Quản lý Tài Khoản & Mật Khẩu Admin
- **Bài 6**: Cấu hình SNTP Đồng Bộ Thời Gian
- **Bài 7**: Khởi Động Lại & Khôi Phục Cài Đặt Gốc (Reboot & Factory Reset)

### 7️⃣ Wi-Fi 7 BE15000 (`DEVICE_BE15000`) — 10 Bài Học
- **Bài 1**: Quản lý LAN IPv4 & DHCP Server
- **Bài 2**: Trạng thái mạng cục bộ (Local Network Status)
- **Bài 3**: Chẩn đoán mạng (Ping / Traceroute Diagnostics)
- **Bài 4**: Quản lý tài khoản & Đổi mật khẩu
- **Bài 5**: Bảng ARP (ARP Table Mapping)
- **Bài 6**: Bảng MAC (MAC Address Table)
- **Bài 7**: Nâng cấp Firmware
- **Bài 8**: Quản lý Log hệ thống (Log Management)
- **Bài 9**: Khởi động lại & Khôi phục cài đặt gốc
- **Bài 10**: Cấu hình SNTP Đồng Bộ Thời Gian

---

## 📋 3. Yêu Cầu Hệ Thống (Prerequisites)

- **Python 3.x** (Khuyên dùng Python 3.8 trở lên).
- **Hệ điều hành**: Windows, macOS, hoặc Linux.
- 💡 **Lưu ý**: Dự án sử dụng hoàn toàn các thư viện chuẩn (Standard Library) của Python (`http.server`, `urllib`, `threading`, `os`, `sys`), **không cần cài đặt thêm bất kỳ thư viện bên thứ 3 nào** (`pip install`).

---

## 📥 4. Hướng Dẫn Clone & Cấu Trúc Thư Mục

### 🔹 Clone Repository:
```bash
git clone <URL_REPOSITORY_CUA_BAN>
cd giailapthietbi
```

### 📁 Cấu trúc thư mục dự án:
```
giailapthietbi/
├── CHAY-TAT-CA.bat          # File script khởi chạy nhanh 1-Click trên Windows
├── run_all.py               # Master Dispatcher Server (Cổng 8080)
├── index.html               # Giao diện chính Portal người dùng
├── styles.css               # Định dạng giao diện Portal
├── app.js                   # Logic điều khiển Portal & nạp kịch bản bài học
├── data.js                  # Alias & Wrapper giữ tương thích cho Portal
├── devices/                 # Thư mục quản lý mô-đun dữ liệu 7 thiết bị
│   ├── index.js             # Loader hợp nhất dữ liệu thiết bị
│   ├── ac1000f/             # Dữ liệu & Tooltips ONT AC1000F
│   ├── ax3000c/             # Dữ liệu & Tooltips ONT AX3000C
│   ├── ax3000gz/            # Dữ liệu & Tooltips ONT AX3000GZ
│   ├── ax3000hv2/           # Dữ liệu & Tooltips ONT AX3000HV2
│   ├── ax3000s/             # Dữ liệu & Tooltips AX3000S
│   ├── be12000/             # Dữ liệu & Tooltips Wi-Fi 7 BE12000
│   └── be15000/             # Dữ liệu & Tooltips Wi-Fi 7 BE15000
└── sim_*/                   # Mã nguồn giả lập backend & web CGI/ASP/LuCI từng thiết bị
    ├── sim_ac1000f/
    ├── sim_ax3000c/
    ├── sim_ax3000gz/
    ├── sim_ax3000hv2/
    ├── sim_ax3000s/
    ├── sim_be12000/
    └── sim_be15000/
```

---

## ⚡ 5. Hướng Dẫn Khởi Chạy (Quick Start)

Bạn có thể khởi chạy toàn bộ hệ thống bằng **1 trong 2 cách** sau:

### 🔹 Cách 1: Chạy bằng File Batch (Khuyên dùng trên Windows)
Nhấp kép vào file `CHAY-TAT-CA.bat` hoặc chạy trong **Command Prompt (CMD)**:

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

*Khi người dùng chọn thiết bị trên Portal (AC1000F, AX3000C, AX3000GZ, AX3000HV2, AX3000S, BE12000, BE15000), Master Dispatcher sẽ tự động điều hướng request mà không cần mở lại cổng.*

---

## 💡 7. Mẹo Xóa Cache Trình Duyệt Khi Sửa Code

Nếu bạn thực hiện chỉnh sửa nội dung bài học hoặc giao diện nhưng chưa thấy thay đổi trên web:
- Nhấn phím **`Ctrl + F5`** (hoặc **`Ctrl + Shift + R`**) trên trình duyệt để buộc tải lại dữ liệu mới nhất.

---

## 🛑 8. Hướng Dẫn Dừng Hệ Thống

- **Windows**: Đóng cửa sổ Command Prompt (`CMD`) đang chạy.
- **Terminal**: Nhấn `Ctrl + C` tại cửa sổ Terminal đang chạy script Python để dừng dịch vụ.
