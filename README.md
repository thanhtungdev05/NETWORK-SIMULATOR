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

Bạn có thể khởi chạy toàn bộ hệ thống bằng **1 trong 2 cách** sau:

### 🔹 Cách 1: Chạy bằng File Batch (Dành riêng cho Windows)
Mở **Command Prompt (CMD)** hoặc **PowerShell** tại thư mục dự án và chạy:

```cmd
.\CHAY-TAT-CA.bat
```

> **Mô tả**: Lệnh này tự động bật **Master Dispatcher** chạy toàn bộ hệ thống trên **1 cổng duy nhất `8080`** và tự động mở trình duyệt truy cập `http://localhost:8080`.

### 🔹 Cách 2: Chạy bằng Python (Khuyên dùng - Đa nền tảng Windows / macOS / Linux)
Chạy lệnh Python trực tiếp từ thư mục gốc dự án:

```bash
python run_all.py
```

> **Mô tả**: Master Dispatcher gộp Portal, toàn bộ thiết bị giả lập và proxy API PHP (`/api/*`) sang **1 cổng duy nhất `8080`**.

---

## 🛠 3. Các Tính Năng Đào Tạo Cốt Lõi

Dự án không chỉ mô phỏng thiết bị mà còn tích hợp bộ công cụ Đào tạo và Chấm điểm tự động:

### A. Danh sách các dòng thiết bị giả lập (Simulators)
Dự án đã giả lập thành công Web Admin Interface của 10 dòng thiết bị mạng thực tế phổ biến của FPT Telecom:
1. **AC1000F** (`/sim_ac1000f`)
2. **AC1000HI** (`/sim_ac1000HI`)
3. **AX3000C** (`/sim_ax3000c`)
4. **AX3000GZ** (`/sim_ax3000gz`)
5. **AX3000Hv2** (`/sim_ax3000hv2`)
6. **AX3000S** (`/sim_ax3000s`)
7. **BE12000** (`/sim_be12000`)
8. **BE15000** (`/sim_be15000`)
9. **BE6500C** (`/sim_ONT_be6500c`)
10. **Vigor2927** (`/sim_vigor2927`)

### B. Hai Chế Độ Hoạt Động (Dual Modes)
1. **💡 Chế độ Hướng dẫn (Guide Mode)**
   - **Mục đích:** Học tập và rèn luyện.
   - **Tính năng:**
     - Hiển thị bong bóng hướng dẫn (Tooltips) chỉ dẫn từng bước thao tác thực tế. Tooltips tự động đồng bộ theo từng trang con của thiết bị (ví dụ: chuyển trang WLAN, SNTP, Mesh, Port Forwarding...).
     - KTV được phép cấu hình sai. Khi ấn **Nộp Bài**, hệ thống sẽ hiện bảng báo lỗi, cho phép đóng bảng điểm để **quay lại giao diện cũ sửa lỗi** và nộp lại.
     - **Chỉ ghi nhận Tracking (Log) khi đạt 100%**: Tránh ghi nhận dữ liệu không hoàn chỉnh của học viên.

2. **⚡ Chế độ Thực hành (Practice Mode)**
   - **Mục đích:** Kiểm tra, thi thật.
   - **Tính năng:**
     - Ẩn toàn bộ hướng dẫn, ép KTV tự nhớ các thông số cấu hình chuẩn FPT.
     - **Khắt khe:** Nếu chấm điểm bị sai dù chỉ 1 tiêu chí, hệ thống khóa màn hình, yêu cầu "Quay lại làm từ đầu" và **reset toàn bộ thiết bị** (mất toàn bộ cấu hình đã lưu).
     - Gửi Tracking dữ liệu lập tức (bất kể Đạt hay Chưa đạt) ngay khi nhấn Nộp Bài để nạp vào Data Dashboard.

### C. Chấm Điểm Tự Động Thông Minh (Smart Auto-Grading)
- **Lấy dữ liệu trực tiếp từ Iframe giả lập:** Dùng DOM query để đọc dữ liệu KTV đã nhập, so khớp với bộ quy tắc chuẩn (`rules`).
- **Luật chấm điểm động linh hoạt:** Hỗ trợ chấm điểm phức tạp như kiểm tra giá trị bất kỳ trong danh sách (vd: NTP Server được chọn ứng cử viên thuộc `vn.pool.ntp.org` hoặc `asia.pool.ntp.org` bằng định dạng `any_of`).
- **Lưu bộ nhớ tạm (Cache đa trang):** Khắc phục nhược điểm KTV phải chuyển trang khi cấu hình (VD: Cấu hình Wi-Fi 2.4G xong, nhấn *Save*, rồi chuyển sang Wi-Fi 5G, nhấn *Save*).
  - Hệ thống tự động bắt tín hiệu *Save* từ bên trong iframe (`window.parent.onSimulatorSave`).
  - Lấy điểm từng phần lưu vào `CACHE` cục bộ (`_AC1000F_BAI2_CACHE`).
  - Gộp chung toàn bộ khi nhấn "Nộp Bài" ở ngoài Portal chính.

### D. Ngăn Chặn Tải Lại Trang (Anti-Reload Script)
Thiết bị thực tế thường khởi động lại hoặc load lại trang khi bấm Save. Trong giả lập:
- Tích hợp bộ script Python (vd: `fix_saves.py`) tự động quét mã nguồn `.asp` của các giả lập.
- Chèn Javascript ngăn lệnh submit, hiển thị thông báo giả lập `✔ Saved successfully!` và gửi tín hiệu báo cáo cho Portal ở lớp vỏ ngoài.

### E. Hệ thống Tracking API & Logging
- Tích hợp sẵn endpoint `/api/index.php/tracking/timer`.
- Ghi nhận: ID KTV, Tên Bài Học, Điểm số, Tổng thời gian hoàn thành (tính bằng giây) và danh sách các lỗi cấu hình.
- 100% không bị gửi đúp dữ liệu nhờ màng lọc logic thông minh tại nút "Nộp Bài".

---

## 📊 4. Dashboard Giám Sát KTV (Training Management Dashboard)

Dự án cung cấp một Dashboard quản trị hoàn chỉnh dành cho Admin/Giảng viên để theo dõi, thống kê tiến độ học tập và kết quả của các KTV.

- **Đường dẫn truy cập:** `http://localhost:8080/dashboard/` (được mount tự động từ thư mục `dashboard-authen`).
- **Bảo mật & Phân quyền**: Yêu cầu đăng nhập trước thông qua hệ thống IAM FPT (hoặc Dev Bypass mode trên localhost) và bắt buộc tài khoản có quyền `admin`.
- **Chức năng chính:**
  - Thống kê tổng số học viên (KTV), tổng số lượt làm bài (Sessions), tỉ lệ đạt (Pass Rate), tỉ lệ đạt lần đầu (First-pass Rate).
  - So sánh hiệu suất học tập giữa các lớp (Class Code), các khu vực/vùng miền (Dashboard Region).
  - Phân tích chi tiết biểu đồ tiến độ qua các tháng, danh sách chi tiết các lượt làm bài, trạng thái đạt/chưa đạt kèm thời gian và bài thực hành cụ thể.
  - Tra cứu kết quả phân công bài tập (Assignments) và tiến trình hoàn thành của từng nhân viên.

---

## 💾 5. Cơ Sở Dữ Liệu & Migrations

Hệ thống sử dụng cơ sở dữ liệu quan hệ **PostgreSQL** (mặc định kết nối Neon Cloud qua biến môi trường `DATABASE_URL` trong file `.env`).

### Quản lý Schema qua Migrations
Mọi thay đổi cấu trúc bảng, view hay dữ liệu mẫu đều được quản lý thông qua các file di trú phiên bản đặt trong thư mục `api/migrations/`.
Các lệnh CLI hữu ích để quản lý cơ sở dữ liệu:
* **Kiểm tra trạng thái di trú:**
  ```bash
  php api/migrate.php --status
  ```
* **Chạy di trú (Cập nhật Schema):**
  ```bash
  php api/migrate.php
  ```
* **Khởi tạo dữ liệu KTV & Sessions mẫu (Seed):**
  ```bash
  php api/seed_dashboard_ktv.php
  ```
* **Xác minh tính đúng đắn của dữ liệu mẫu:**
  ```bash
  php api/verify_dashboard_seed.php
  ```

---

## 🌐 6. Cấu Trúc Cổng Dịch Vụ (Single-Port)

| Thành phần | Địa chỉ (Routing qua Master Dispatcher) |
|---|---|
| **Portal Trung Tâm & Bài Học** | `http://localhost:8080/` |
| **API Backend (PHP)** | `http://localhost:8080/api/index.php` |
| **Dashboard Quản trị** | `http://localhost:8080/dashboard/` |
| **Giả lập AC1000F** | `http://localhost:8080/sim_ac1000f/...` |
| **Các giả lập khác** | `http://localhost:8080/sim_ax3000c/...` |

---

## 🆕 7. Cập Nhật Cấu Trúc & Logic Mới Nhất (Dành Cho Developer)

Để giúp các lập trình viên tiếp quản dự án dễ dàng nắm bắt, dưới đây là các thay đổi quan trọng về luồng logic và UI/UX đã được triển khai gần đây:

### A. Chuẩn Hóa Tên Danh Mục Thiết Bị
- Tên thiết bị trên Dropdown Menu đã được cấu trúc lại với các tiền tố rõ ràng để KTV dễ phân biệt chủng loại:
  - **Dòng ONT:** `ONT AC1000F`, `ONT AC1000HI`, `ONT AX3000CV2`, `ONT AX3000GZ`, `ONT AX3000HV2`, `ONT BE12000`, `ONT BE15000`, `ONT BE6500C`
  - **Dòng Khác:** `Internet Hub AX3000S`, `Router MikroTik`, `DrayTek Vigor2927`
- Thứ tự (Order) hiển thị trên giao diện đã được sắp xếp đồng bộ thành một khối logic chuẩn (ONT -> Hub -> Router) quản lý tập trung trong file `data.js`.

### B. Auto-Baseline Tracker (Tối ưu thiết bị SPA)
- Thay vì lấy Baseline toàn bộ DOM ngay lúc load (gây lỗi với các thiết bị dạng SPA sinh form trễ do AJAX như AX3000S), hệ thống đổi sang **Interaction-Based Baseline**.
- Hàm `captureBeforeEdit` sẽ lưu lại giá trị mặc định của ô nhập liệu *ngay khoảnh khắc KTV chạm vào ô đó* (`mousedown` / `focusin`).
- Đảm bảo cơ chế chấm lỗi "Cấu hình sai trường ngoài yêu cầu" (`unexpected_change`) chính xác tuyệt đối mà không bị xung đột với lifecycle của giả lập.

### C. Giam Kẹp Logic "Nộp Bài" & "Xem Lỗi Sai"
- **Bắt buộc Save:** Các nút chức năng đánh giá (Nộp bài / Xem lỗi sai) mặc định bị vô hiệu hóa (disabled, ẩn xám). Chúng chỉ kích hoạt khi KTV đã thực sự bấm nút **Save/Apply** trên giao diện của thiết bị giả lập.
- **Reset trạng thái lập tức:** Bất kỳ thao tác gõ phím (`input`) hay thay đổi tùy chọn (`change`) nào cũng sẽ lập tức thu hồi trạng thái "Đã Save". Sự kiện được bắt ở cấp cao nhất (Capture phase `true`) để tránh tình trạng Javascript của Emulator ẩn event.
- **UX Layout:** Nút "Xem lỗi sai" và "Nộp bài" được gom về cạnh nhau phía góc phải màn hình, đẩy đồng hồ đếm ngược sang trái giúp KTV thao tác thuận tay hơn.

### D. Multi-Error Reporting (Bảng Báo Lỗi Chi Tiết)
- Trong chế độ Hướng dẫn (Guide Mode), thay vì hiển thị tooltip sơ sài, KTV nhấn "Xem lỗi sai" sẽ thấy Modal liệt kê toàn bộ các tiêu chí cấu hình sai dưới dạng Bảng.
- Hệ thống hỗ trợ lấy định danh Text thân thiện (`getLabelForElement`) và dịch ngược option của thẻ Select thay vì hiển thị value thô báo lỗi cho KTV.
- Thời gian làm bài trên bảng lỗi được lấy Realtime đúng theo đồng hồ đếm ngược.

---

## 🛑 8. Hướng Dẫn Dừng Hệ Thống

- **Windows (CMD/PowerShell)**: Đóng cửa sổ CMD đang chạy (hoặc nhấn `Ctrl + C`).
- **Terminal (macOS/Linux)**: Nhấn `Ctrl + C` tại cửa sổ Terminal đang chạy script để dừng toàn bộ dịch vụ Python và PHP nội bộ.

---

## 📝 9. Ghi Chú

- Giữ nguyên cửa sổ terminal/CMD trong suốt quá trình thực hành.
- Nếu bạn có thay đổi cấu trúc thiết bị và luồng lưu file, hãy chạy lại lệnh vá file của Python để giả lập hoạt động đúng với Portal.
- Đảm bảo cổng `8080` không bị chiếm dụng trước khi bật file Batch/Python.
