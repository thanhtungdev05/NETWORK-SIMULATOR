# Bộ giả lập giao diện DrayTek Vigor2927 (chạy trong trình duyệt)

Thiết bị: **DrayTek Vigor2927** (router doanh nghiệp, giao diện web HTTPS tại 192.168.1.1).

## Cách chạy
- **Windows:** nháy đúp `Chay-server.bat`

Rồi mở **http://localhost:8080/** → trang đăng nhập → nhập tài khoản + mật khẩu **bất kỳ** (chỉ cần không rỗng cả hai) → **Login** → vào giao diện chính.

Cần đã cài Python 3.

## Cách hoạt động
Bản này **crawl trực tiếp từ thiết bị thật** (đăng nhập rồi thu thập), khớp 100% thiết bị.

- **Trang đăng nhập** là ứng dụng Vue (weblogin.htm) giống hệt thiết bị. Điều kiện đăng nhập được giữ đúng bản gốc: mật khẩu phải khác rỗng; bản giả lập bổ sung yêu cầu user cũng khác rỗng, rồi chuyển vào giao diện chính.
- **Sau đăng nhập** là frameset cổ điển của DrayTek: `index.htm` gồm header (trên), menu (trái), thanh trạng thái, và khung nội dung chính.
- **Nội dung** nằm ở các URL `/cgi-bin/*.cgi?fid=N...`. Server phục vụ đúng các URL đó; nó **bỏ qua tham số phiên `sFormAuthStr`** rồi tra về đúng trang đã crawl, nên điều hướng menu chạy tự nhiên.
- Các form Apply/Save chỉ mô phỏng, **không ghi cấu hình thật**.

## Phạm vi đã crawl
- **523 trang cấu hình**: toàn bộ menu (258) + trang phụ mở qua nút/dropdown/tab (208) + trang chi tiết/dialog mở bằng form-POST (57).
- **63 tài nguyên** (JS/CSS/ảnh/sprite thiết bị) + 5 frame + frameset + trang login.
- **Dashboard + 41 trang trạng thái/giám sát** được chụp ở trạng thái đã hiển thị đầy đủ từ thiết bị thật (uptime, LAN/WAN, CPU/Mem, bảng ARP/DHCP/Routing…), vì các trang này nạp dữ liệu bằng AJAX.
- Chỉ crawl **đọc**: đã loại bỏ mọi URL có tác dụng phụ (logout, reboot, xóa, clear, reset, apply...).
- Các trang rỗng/nhỏ (PoE, LTE, OSPF...) là **rỗng ngay trên thiết bị thật** (tính năng tắt/không có phần cứng) → giả lập rỗng cũng khớp.

## Kiểm chứng
- 523/523 trang phục vụ thành công, không lỗi, không nút bấm chết.
- Điều hướng đầy đủ: menu → trang, bấm dòng bảng → trang chi tiết (ví dụ WAN1–WAN6), Cancel quay lại.
- Trên điện thoại: Vigor2927 không có thiết kế riêng cho di động (khung cố định), bản giả lập dùng đúng bộ file thật nên hiển thị y hệt.

## Cấu trúc
```
sim_vigor2927/
├─ Chay-server.bat      ← chạy máy chủ (cổng 8080)
├─ server.py            ← máy chủ (phục vụ www/)
├─ www/                 ← GỐC WEB: bản crawl thật
│  ├─ weblogin.htm      ← trang đăng nhập (Vue)
│  ├─ index.htm         ← frameset chính
│  ├─ header.htm menu.htm act_sta.htm l_m.htm empty.htm
│  ├─ _pages/           ← 466 trang .cgi đã crawl
│  ├─ _routes.json      ← bảng định tuyến URL→trang
│  └─ js/ css/ images/  ← tài nguyên thật
├─ collector.py / chay_collector.bat   ← công cụ crawl cũ (đã tích hợp vào server.py)
└─ captures_new/        ← nơi crawl MỚI ghi vào (tạm, chờ duyệt)

Dữ liệu thô đã crawl và duyệt nằm ở `../reference/` (CHỈ ĐỌC, xem CLAUDE.md 2.3):
- `../reference/html/`  ← 730 trang thô
- `../reference/raw/`   ← 220 file json/txt/css/b64 kèm theo
```

## Ghi chú
- Giao diện khớp thiết bị thật cả bố cục, nội dung, dữ liệu, điều hướng và đăng nhập.
- Trên điện thoại: frameset DrayTek hiển thị giống hệt thiết bị thật (cùng bộ file, không có code responsive riêng).
- Muốn crawl lại: chạy `chay_collector.bat`, mở thiết bị thật đã đăng nhập, rồi thu thập.
