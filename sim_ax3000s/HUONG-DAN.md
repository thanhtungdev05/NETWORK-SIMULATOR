# Bộ giả lập FPT Mesh Router AX3000S (chạy trong trình duyệt)

Bản demo mốc đầu tiên: khung giao diện thật + đăng nhập + trang **Device Info** hoạt động với backend ảo.

## Cách chạy (bắt buộc qua máy chủ HTTP, không mở trực tiếp file)

Trình duyệt chặn việc nạp trang con và điều hướng khi mở bằng `file://`, nên phải chạy qua một máy chủ tĩnh (rất đơn giản):

**Windows:** nháy đúp `Chay-server.bat`
**Mac/Linux:** chạy `bash chay-server.sh`

Sau đó mở trình duyệt vào: **http://localhost:8080**
(Cần đã cài Python 3. Kiểm tra: mở CMD gõ `python --version`.)

Đăng nhập: **admin / admin** (bản giả lập chấp nhận mọi mật khẩu).

## Cấu trúc

```
sim_ax3000s/
├─ Chay-server.bat / chay-server.sh   ← chạy máy chủ
├─ www/                               ← gốc web (máy chủ phục vụ thư mục này)
│  ├─ index.html   → login.html → app.html
│  ├─ app.html     ← khung chính (header + menu 3 cấp + vùng nội dung)
│  ├─ menu.js      ← cây menu + phiên (sinh tự động từ firmware)
│  ├─ sim/
│  │  ├─ backend.js   ← BACKEND ẢO: trạng thái thiết bị + bộ định tuyến ubus
│  │  └─ net-mock.js  ← chặn /ubus, /cgi-bin/* và trả lời bằng backend ảo
│  └─ luci-static/    ← TOÀN BỘ giao diện gốc trích từ firmware (không sửa)
```

## Cơ chế

Giao diện gốc (LuCI tùy biến FPT) được giữ **nguyên bản**. Thiết bị thật gọi backend qua
JSON-RPC ubus tại `/ubus` và vài lệnh `/cgi-bin/*`. Bản giả lập chặn đúng các lời gọi đó
(`net-mock.js`) và trả dữ liệu từ **trạng thái thiết bị ảo** trong `backend.js`.
Nhờ vậy học viên thấy y hệt giao diện thật, thao tác thật, nhưng không cần phần cứng.

Muốn tạo tình huống bài tập khác (đổi IP LAN, SSID, số client, trạng thái WAN...),
chỉ cần sửa các biến `DEV / WAN / LAN / RADIOS / CLIENTS` ở đầu `backend.js`.

## Đã chạy ở mốc này
- Đăng nhập, khung menu đầy đủ (Status / Network / WLAN / Services / Security / System / Advanced...).
- Trang **Device Info**: thông tin thiết bị, trạng thái Internet, số thiết bị, biểu đồ CPU/RAM, EasyDiagnose.

## Chưa làm (các mốc sau)
- Các trang WAN, LAN, WiFi 2.4/5G (đang tới).
- Firewall / Port Forward / DMZ, DHCP, Mesh, QoS, chẩn đoán (ping/traceroute)...
- Các trang menu chưa mô phỏng khi bấm vào sẽ trống — đây là phần sẽ bổ sung dần.

## Nếu mở lên bị lỗi
Mở **F12 → Console**, chụp lại thông báo lỗi gửi cho tôi. Backend ảo có ghi log
(`[ubus] chưa mô phỏng: ...`) cho biết trang đang cần lời gọi nào để tôi bổ sung.
