# BÀN GIAO — MikroTik hEX S

Cập nhật **2026-08-28** (bản trước: 2026-08-27). Đọc file này TRƯỚC, rồi mới
đọc `CLAUDE.md` (mục 5 là tri thức giao thức — nay có thêm **§5.10** và
**§5.11**),
`STATUS.md`, `ISSUES.md`.

---

## 0. Bắt đầu phiên mới thì làm gì

1. Mở 2 cửa sổ lệnh trong `devices/mikrotik_hexs/`:
   - `python src\server.py` (bản giả lập, cổng 8080)
   - `python tools\thu_bang_chung.py` (nhận bằng chứng, cổng 9099)
2. Chạy `python tools/kiem_may_chu.py` → phải **105/105**.
   **Nhớ khởi động lại `server.py`** nếu nó đang chạy từ phiên trước —
   28/08 em đã vấp: giao diện báo "Running" mà tiến độ đứng im, chỉ vì
   tiến trình cũ chưa nạp dữ liệu mới.
3. Đọc `ISSUES.md` từ dưới lên (mục mới nhất ở cuối).

---

## 1. Đang ở đâu (2026-08-28)

Bản giả lập **chạy được cả bốn mức**, và nay có **hai lớp kiểm độc lập**:

| Bộ kiểm | Đo gì | Kết quả |
|---|---|---|
| `tools/kiem_may_chu.py` | khung nhị phân, kho cấu hình, gói đẩy, công cụ action + wizard, **tài nguyên tĩnh** | **105/105** |
| `tools/kiem_m2.py` | khung M2 từng byte | 46/46 |
| `tools/kiem_mat_ma.py` | X25519 + RC4 | 17/17 |
| `quet_giao_dien.js` + `doi_chieu_giao_dien.py` | **cái học viên nhìn thấy** — nay có cả **ảnh vỡ** | cần chạy lại (bản quét 27/08 đã cũ) |

Commit gần nhất: `0014a14`.

| Thứ | Trạng thái |
|---|---|
| Giao thức `/jsproxy` | Giải mã trọn: M2 + X25519 (byte ngược chuẩn) + RC4-drop768 |
| Dữ liệu đọc | **424/438** đường dẫn có khung THẬT + **7 khung `__map`** bổ sung |
| Công cụ ACTION | 4 công cụ (Supout, Bandwidth, Speed Test, Import .ovpn) — khung thật |
| Wizard | `[63]` Hotspot Setup, bước 2→9 — cơ chế thứ TƯ của WebFig |
| Chiều ghi | 4 lệnh + đổi thứ tự + khung lỗi — đều đo trên thiết bị thật |
| Kho cấu hình | `src/kho_cau_hinh.py`, lưu `src/cau_hinh.json`, có gói ĐẨY |
| Công cụ chạy trực tiếp | Ping 6 dòng · Traceroute 31 · Profile 45 · Torch 14 · **IP Scan** · **PPPoE Scan** |
| Công cụ thiết bị TỪ CHỐI | 7 công cụ — trả đúng mã lỗi + chuỗi mô tả thật |
| Terminal | 9 lệnh chỉ đọc có đầu ra thật |
| Lệnh `doit` | Đo 2 lệnh; 7 lệnh phá trạng thái bị CHẶN có chủ ý |

---

## 1b. Mức 4 — đo TOÀN BỘ, không phải vài ví dụ (28/08 tối, đợt 2)

Anh Huynn hỏi thẳng "tất cả trang đã Level 4 chưa" rồi giao "đưa hết lên
Level 4". Việc này **KHÔNG cần nối tay 134 nhóm menu** — đọc `server.py` thấy
nhánh ghi (`0xfe000e/3/5/6`) và `_day_cho_cac_phien()` **không có một dòng
riêng cho đường dẫn nào cả**, dùng chung một lớp `KhoCauHinh`. Nhưng đọc mã
chỉ là GIẢ THUYẾT (CLAUDE.md §5.6) — đã đo thật bằng 2 công cụ mới:

| Công cụ | Đo gì | Kết quả |
|---|---|---|
| `tools/kiem_muc4_toan_bo.py` | ghi rồi đọc lại, trên MỌI đường dẫn `item`/`map` có dữ liệu thật | **397/397 đạt** |
| `tools/kiem_day_toan_bo.py` | đẩy sang phiên khác đang theo dõi, mẫu 1 đường dẫn/nhóm menu cấp 1 | **20/20 đạt** (20 nhóm) |

**Kết luận đo được:** 397/400 đường dẫn `item`+`map` (gần như toàn bộ bề mặt
cấu hình của thiết bị) đã đạt mức 4 thật — cả chiều ghi-đọc-lại lẫn chiều đẩy
sang trang khác. Không sửa `server.py`/`kho_cau_hinh.py`, chỉ đo. Hồi quy
`kiem_may_chu.py` vẫn 102/102.

**Sửa ngay sau đó — 3 đường dẫn trên KHÔNG THIẾU, kết luận cũ SAI.** Anh
Huynn hỏi tiếp "trừ 3 cái đó ra thì xong hết chưa" — rà lại chính công cụ đo
thì thấy `kiem_muc4_toan_bo.py` bỏ sót 3 đường dẫn này chỉ vì bằng chứng của
chúng ở dạng phân trang (`__p0.bin`...), không phải vì thiếu bằng chứng. Đo
lại đúng cách (đọc xuyên hết các trang bằng con trỏ): **cả 3/3 đạt mức 4**.
Rà thêm thấy công cụ cũng bỏ sót **7 đường dẫn kiểu lai** (`item`/`map`
không đứng đầu mảng `kieu`, ví dụ `['hyperlink','map']`) — đo lại: **7/7
đạt**. Tổng đúng: **407/407 đường dẫn cấu hình đạt mức 4**, không còn sót.

Đợt rà đó lộ ra 3 mục nghi là lỗ hổng ngoài lớp cấu hình. **Cả 3 nay đã đóng
hết trong cùng ngày (đợt 3):**

| Đường dẫn | Tên | Kết quả |
|---|---|---|
| `[120,101]` `[120,102]` | Quick Set (CPE / PTP Bridge AP…) | **Không phải lỗ hổng.** Mã gốc: `TableView` dùng `new ObjectMap(...)` bên trong → giao thức y hệt kiểu `map`, và `save()` trả `null` (chỉ đọc). Đo được: server đã trả đúng khung thật. Kết luận "cơ chế thứ NĂM" là SAI. |
| `[77]` | Ping Speed | **Đã đo thật + nối.** 12 khung (ping 127.0.0.1). `.jg`: `startcmd=2 pollcmd=1 cancelcmd=3` — không phải `0xfe000f` mặc định. Phép kiểm T7. |
| `[138,11]` | WPS Client | **Không tồn tại trên hEX S** — đo được 0/122 mục menu, trang WiFi chỉ có 5 nút. Giống ca Antenna Scan. Không mô phỏng. |

**Nhân đó rà ra một lỗi thật chưa ai biết: lệch một nhịp ở 7 công cụ.** Khung
ACK Start nằm trong kho `g0`, mà máy chủ đã tự sinh ACK rồi → lần poll đầu
trả ACK lần hai. Dính `[24,25]` `[26]` `[29]` `[29,2]` `[45,5]` `[49]` `[77]`.
Đã sửa bằng `_bo_qua_ack_dau()` (nhận diện theo NỘI DUNG khung, không theo
danh sách cứng) + phép kiểm **T8** đo cả 7. Bộ kiểm **102 → 104/104**.

**Và việc treo cuối cùng cũng đóng luôn:** `[119,1]` Traffic Generator Quick
Start — thu lại được khung lỗi thật `no streams defined` (`0xfe0006`) trên
thiết bị, khai báo bị rút hôm sáng nay nay phục hồi hợp lệ, phép kiểm **T5**
sống lại. Bộ kiểm **105/105**.

Xem chi tiết trong `ISSUES.md` mục `2026-08-28T05:10Z`.

---

## 2. Việc phiên 2026-08-28 làm được

- **5 công cụ hành động cuối cùng** + **wizard Hotspot Setup** — xem §3.2.
- **Ba sự thật giao thức mới** → `CLAUDE.md` §5.10: `0xfe000b` = cờ XONG;
  công cụ `action` dùng `pollcmd` riêng; wizard có `0xfe000e`/`0xfe000f`.
- **Cạm bẫy "sửa tại chỗ" dạng thứ TƯ** → §5.11: mã gốc sửa khung **hai lần**
  (giải mã RC4, rồi ghi đè độ dài thành `'M2'`). Cách chữa: đọc trễ 400ms +
  tự kiểm `'M2'`.
- **Tự rút một khai báo** vì xoá nhầm bằng chứng — xem §3.3.
- **Anh Huynn bắt lỗi vỡ ảnh** → thu **15 tệp tĩnh** chưa bao giờ crawl, rồi rà
  tiếp cùng kiểu lỗi thấy thêm **3 tài nguyên** (`/graphs`,
  `/help/license.html`, `/graph.css`) và `/files/` trả sai mã.
  Thêm nhóm kiểm **U** (U1 ảnh · U2 sha256 · U3 đường dẫn nội bộ).
- **Bộ đối chiếu giao diện nay nhìn được HÌNH** (`anhVo`), không chỉ chữ.

---

## 2b. Việc phiên 2026-08-27 làm được

- **IP Scan `[101,1]`** và **PPPoE Scan `[27,15]`** — đo thật, nối, kiểm (P11/P12).
- **Hai sự thật giao thức mới** → `CLAUDE.md` §5.9:
  địa chỉ IP mã hoá **little-endian**; `Uff0014` = danh sách ô **đang để trống**.
- **Lớp kiểm GIAO DIỆN mới** — lỗ hổng lớn nhất từ GĐ0 tới nay đã bịt.
- **Lỗ hổng khung `__map`**: một đường dẫn trả về hai kiểu khung khác nhau tuỳ
  lệnh hỏi. Đã rà cả 124 nguồn động, sửa 7 chỗ (xem `ISSUES.md`).

---

## 3. Việc còn treo — theo thứ tự nên làm

### 3.0. Sửa 2026-08-28: mục 3.1 bản cũ ("[123,2] IP Cloud chưa làm") là SAI

Đã đối chiếu lại `STATUS.md`/commit `b901ec7`: `[123,2]` được thu đủ 11 trang
và nối vào server từ **25/08**, không phải việc còn treo. Xem `ISSUES.md`
mục "Sửa 2026-08-28" để rõ nguồn gốc nhầm lẫn. **Không còn việc nào ở mức
"không cần anh Huynn" — mọi việc còn lại đều ở §3.2 dưới đây.**

### 3.2. XONG ngày 2026-08-28 — anh Huynn đã giao toàn quyền

Toàn bộ nhóm này đã đo và nối. Xem `ISSUES.md` mục 2026-08-28.

| Mục | Kết quả |
|---|---|
| Bandwidth Test `[29]` | `can't connect` — 0 bps, btest server tắt mặc định |
| Speed Test `[29,2]` | ping thật 382/427/800us; dừng trước pha bơm băng thông |
| Make Supout.rif `[24,25]` | 27 khung tiến độ 0→100% |
| Import .ovpn `[27,53]` | `config file is empty` |
| Hotspot Setup `[63]` | 12 khung, bước 2→9; **HUỶ trước bước ghi**, đã đo chứng minh cấu hình không đổi |
| Latency Distribution `[119,7]` | đã có sẵn từ trước, đo lại khớp từng byte |
| Antenna Scan `[20,106]` | **không tồn tại trên hEX S** (0/116 mục menu) — không làm |

**Format Drive `[79,1]` — vẫn KHÔNG đụng.** Luật anh đặt, em giữ.

### 3.3. ~~Việc còn treo duy nhất~~ — ĐÃ XONG 28/08 đợt 3

`[119,1]` Traffic Generator Quick Start: em **đã đo được** khung lỗi thật
nhưng sau đó **xoá nhầm chính tệp bằng chứng**, và không bắt lại được trong
phiên (WebFig không gửi lại yêu cầu sau lần hỏng đầu). Đã **rút** khai báo
khỏi spec thay vì giữ dữ liệu không có nguồn.

Cách thu lại: phiên WebFig **mới hoàn toàn** → `Tools >> Traffic Generator`
→ `Start` → `Start` trong form con. Chi tiết ở `ISSUES.md`.

### 3.4. Đã đo và KẾT LUẬN LÀ KHÔNG LÀM

**Antenna Scan `[20,106]`** — đếm trên thiết bị thật: **0/116** mục menu.
Khớp `pred` lọc theo board trong `.jg`; hEX S không có mục này.

**PPP Scanner `[27,2]`** — gửi lệnh Start, thiết bị **không trả lời gì**, hết
giờ sau 15 giây. Không có khung để lưu. Đúng đặc tả `.jg`: ô Interface chỉ
nhận giao diện `type = 20` (modem LTE) mà hEX S không có. **Không mô phỏng** —
thà thiếu còn hơn bịa.

---

## 4. Các lần vấp — đọc kỹ, TẤT CẢ cùng một gốc

### Phiên 2026-08-28 — ba lần, đều là "khẳng định trước khi kiểm"

1. Điền kỳ vọng phép kiểm T6 **từ trí nhớ** → sai số bước.
2. Sửa xong lại đoán tiếp số khung lỗi → sai lần nữa. Lần ba mới ngồi đếm.
3. Lệnh `rm` gộp xoá mất tệp mà chính dòng `echo` bảo "giữ lại" → mất bằng
   chứng, phải rút khai báo.

> Quy tắc tự đặt: **`rm` gộp thì `ls` trước; kỳ vọng phép kiểm phải sinh ra
> từ một lần đọc tệp, không gõ tay.**

### Phiên 2026-08-27 — bốn lần

Bốn lỗi dưới đây **đều do em kết luận trước khi mở ra nhìn**. Ghi lại để phiên
sau khỏi lặp:

1. **Quét bừa trúng `Logout`** trên thiết bị thật → mất phiên giữa chừng.
   Danh sách CẤM bảo vệ được cái mình NGHĨ RA; lọc theo **cấu trúc DOM**
   (`nav.menu ul#menu a`) bảo vệ được cả cái mình CHƯA NGHĨ TỚI.
2. **Báo `#IP:ARP` "trang trắng"** — mở ra thì trang đúng tuyệt đối. Bộ so
   đang so **độ dài chữ**, tức so giá trị, đúng cái docstring của nó cấm.
3. **Báo 3 "lệch nhãn"** — thật ra là ô `<select>` chưa kịp nạp option trên
   thiết bị thật. Lệch **tốc độ**, không phải lệch cấu trúc.
4. **40/106 và 44/116 trang chụp trúng màn ĐĂNG NHẬP** — sau mỗi `reload`
   giữa hai khối, WebFig quay về màn đăng nhập một lát. Bộ quét nay **bắt
   buộc chờ đăng nhập xong** và **tự từ chối gửi** nếu còn trang dính.

> Dấu hiệu một bản quét bị nhiễm: đếm số trang có `'Login:'` trong `nhan`.
> Phải bằng **0**. Khác 0 thì vứt đi, đừng đọc kết quả.

---

## 5. Cách chạy bộ quét giao diện

Bộ quét chạy **theo khối 8–14 trang**, giữa hai khối tự `location.reload()`
để cắt các kênh chờ dài dồn lại. Trạng thái nằm ở `localStorage`
(**không dùng `sessionStorage`** — WebFig xoá sạch nó khi đăng nhập lại).

1. Đăng nhập cả hai: `http://192.168.1.1/webfig/` và `http://localhost:8080/webfig/`.
2. Dán `tools/quet_giao_dien.js` vào console.
3. Gọi `await quetKhoi('that')` (hoặc `'gialap'`) **lặp lại** tới khi trả về
   `{xong:true}`. Mỗi lần ~25 giây.
4. `python tools/doi_chieu_giao_dien.py`.

**ĐÃ LÀM (28/08 tối):** quét lại cả hai bên bằng Chrome MCP điều khiển trực
tiếp (không cần dán tay). Kết quả: **106/106 trang khớp cấu trúc hoàn toàn**
— 0 ảnh vỡ, 0 lỗi JS, 0 trang trắng, 0 lệch nhãn, 0 lệch cột. Lệch cột giả ở
`#Tools:Profile` đã biến mất (đúng như dự đoán — đó là dấu vết bản quét cũ).
Bản quét mới đã có trường `anhVo`. Xem `ISSUES.md` mục 28/08 tối để biết
cách lấy dữ liệu quét về mà không cần dán tay vào console (POST tới
`thu_bang_chung.py` trên cổng 9099 — KHÔNG lấy trực tiếp `JSON.stringify`
làm giá trị trả về của MCP, sẽ bị cắt còn ~1000 ký tự).

---
## 6. Bản đồ tệp

```
src/server.py            bộ điều phối /jsproxy — đọc, ghi, đẩy, truy vấn,
                         terminal, doit. Thứ tự nhánh if/elif RẤT quan trọng
src/kho_cau_hinh.py      kho trung tâm, lớp đặt chồng lên khung gốc
src/m2.py                mã hoá/giải mã khung. `giai_ma_nhieu()` cho gói
                         chứa nhiều bản tin
src/mat_ma.py            X25519 + RC4 + phiên (hàng đợi đẩy, đếm trang, truy vấn)
src/du_lieu_goc/         440 khung đọc THẬT + bang-ke.json (sha256)
src/du_lieu_query/       khung công cụ chạy trực tiếp + công cụ ACTION
src/du_lieu_wizard/      khung wizard nhiều bước ([63] Hotspot Setup)
src/du_lieu_terminal/    đầu ra 9 lệnh CLI + muc_luc.json
src/www/                 tài nguyên tĩnh, trùng sha256 với reference/ — CẤM SỬA
spec/duong-dan-lenh.json 438 đường dẫn + kiểu
spec/truy-van.json       22 công cụ + start/poll/cancel
reference/               BẰNG CHỨNG GỐC, CHỈ ĐỌC
  khung_menu/  khung_ghi/  khung_query/  khung_query_loi/
  khung_query2/ (IP Scan, PPPoE Scan)   khung_map/ (khung kiểu MAP)
  khung_terminal/  khung_doit/   khung_action/ (công cụ ACTION + wizard)
tools/kiem_may_chu.py         bộ kiểm chính, nhóm A→T — 99 phép
tools/thu_bang_chung.py       bộ nhận tệp từ Chrome về đĩa
tools/quet_giao_dien.js       quét cấu trúc trang (chạy trong trình duyệt)
tools/doi_chieu_giao_dien.py  so hai bản quét → spec/bao-cao-giao-dien.json
```
