# Bộ giả lập giao diện AC1000F (chạy trong trình duyệt)

Thiết bị: **AC1000F — FPT Internet Hub** (ONT GPON, HGU, firmware VT5.5.10302NA, web server Boa, giao diện ASP frameset).

## Cách chạy
- **Windows:** nháy đúp `Chay-server.bat`

Rồi mở trình duyệt vào **http://localhost:8080** → trang đăng nhập (`login.asp`) → nhập tài khoản + mật khẩu bất kỳ (không rỗng) → bấm **Login** → vào giao diện chính (frameset: header trên, menu trái, nội dung phải).

Cần đã cài Python 3.

## Cách hoạt động
Bản này **crawl trực tiếp từ thiết bị thật** (192.168.1.1), không dựng từ firmware nữa — nên khớp 100% thiết bị.
- `server2.py` phục vụ đúng các URL `.asp`/`.cgi` thật ở dạng `text/html`.
- Giữ nguyên JavaScript gốc của thiết bị → điều hướng frameset và hiển thị dữ liệu chạy tự nhiên.
- Các form POST (Apply/Save) chỉ báo thành công, không ghi cấu hình thật.

## Cấu trúc
```
sim_ac1000f/
├─ Chay-server.bat        ← chạy máy chủ (gọi server2.py)
├─ server2.py             ← máy chủ (phục vụ www2/, cổng 8080)
├─ www2/                  ← GỐC WEB: bản crawl thật
│  ├─ cgi-bin/*.asp *.cgi ← 46 trang thật (status, wan, wireless, nat, qos, firewall...)
│  └─ *.css *.js *.png    ← tài nguyên thật
├─ collector.py / chay_collector.bat   ← công cụ crawl (dùng khi cần crawl lại)
└─ captures/              ← dữ liệu thô đã crawl (nguồn để dựng lại www2/)
```

## Ghi chú
- Giao diện khớp thiết bị thật cả nội dung, dữ liệu, điều hướng và đăng nhập.
- AC1000F không có thiết kế mobile riêng (frameset rộng cố định) → trên điện thoại hiển thị giống hệt thiết bị thật.
- Muốn crawl lại: chạy `chay_collector.bat`, mở thiết bị thật đã đăng nhập, rồi thu thập.
