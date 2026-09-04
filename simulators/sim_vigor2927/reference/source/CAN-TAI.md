# Danh sách file cần tải thủ công từ thiết bị thật

Nguồn phân tích: `devices/vigor2927/reference/source/index.html`
(bản view-source của `http://192.168.1.1/`, đã gỡ lớp syntax-highlight của Chrome)

Cách tải: mở từng đường dẫn trong trình duyệt đã đăng nhập thiết bị,
`Ctrl+U` (view-source) rồi `Ctrl+S` lưu vào thư mục này.
KHÔNG dùng SingleFile hay tiện ích mở rộng — sẽ làm hỏng mã nguồn.

---

## Đợt 1 — tải ngay

1. http://192.168.1.1/menu.htm
2. http://192.168.1.1/js/gettext.min.js?094907
3. http://192.168.1.1/header.htm
4. http://192.168.1.1/l_m.htm
5. http://192.168.1.1/act_sta.htm
6. http://192.168.1.1/empty.htm

**Ưu tiên số 1 là `menu.htm`** — cây menu nằm ở đó, không nằm trong `index.html`.

## Đợt 2 — sau khi có menu.htm

Mở mã nguồn `menu.htm`, liệt kê mọi `<script src>` và `<link href>` trong đó,
rồi tải tiếp. Chưa có `menu.htm` thì chưa biết đợt 2 gồm những file nào.

---

## Ghi chú: những gì index.html tham chiếu

`index.html` là frameset thuần. Toàn bộ tài nguyên nó tham chiếu:

| Loại | Đường dẫn gốc | Tải tại |
|------|---------------|---------|
| .js | `/js/gettext.min.js?094907` | http://192.168.1.1/js/gettext.min.js?094907 |
| .css | *(không có)* | — |

Các frame con (đều là HTML, không phải js/css):

| Frame | src |
|-------|-----|
| `header` | http://192.168.1.1/header.htm |
| `fimage` | http://192.168.1.1/l_m.htm |
| `menu` | http://192.168.1.1/menu.htm |
| `act_sta` | http://192.168.1.1/act_sta.htm |
| `main` | http://192.168.1.1/cgi-bin/cgidashboard.cgi?sFormAuthStr=...&fid=1 |
| `sender` | http://192.168.1.1/empty.htm |
| `ctrl` | http://192.168.1.1/empty.htm |

Endpoint CGI xuất hiện trong chuỗi JavaScript của `index.html`
(thuộc phần cần ghi HAR theo nguyên tắc 2.4, không phải file để tải):

- `/cgi-bin/cgidashboard.cgi?sFormAuthStr=<token>&fid=1`
- `/cgi-bin/func.cgi?sFormAuthStr=<token>&fid=`
- `/cgi-bin/user_login.cgi?sFormAuthStr=<token>`
- `/cgi-bin/v2x00.cgi?sFormAuthStr=<token>`
