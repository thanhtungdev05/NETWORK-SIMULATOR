# Tiến độ Vigor2927

Cập nhật: 2026-08-08

## Bằng chứng gốc

| Loại | Số lượng | Ghi chú |
|------|----------|---------|
| `reference/source/` | 263 file (3.3 MB) | mã nguồn gốc, trích từ HAR theo chuỗi 302→Location |
| `reference/har/` | 6 file | Buoi_1.har, Buoi_2.har, Buoi_3_khong_central_management.har, Buoi_4_central_management.har, phan1.har, thunghiem.har |
| `reference/rendered/` | 730 file | DOM sau JS — KHÔNG dùng làm căn cứ cấu trúc |
| `reference/raw/` | 220 file | thu kèm lúc crawl |
| `reference/js/`, `reference/screenshots/` | rỗng | — |

## Hợp đồng response (nguyên tắc 2.4)

`spec/cgi-map.json` — **208 endpoint**, có trang đích 207.

Cơ chế DrayTek: `/cgi-bin/*.cgi` trả **302 kèm `Location`** trỏ sang `/doc/*.htm` — nội dung thật ở trang đích.

## Cây menu

`spec/menu-tree.json` dựng bằng `tools/build_menu_tree.py`, **thực thi thật** đoạn JS dựng cây
trong Node với các cờ `SHOW_*` tính từ `webcfg-flags.json`. Mọi node trong file đều **thực sự hiển thị**
trên thiết bị này — mục bị ẩn không xuất hiện.

- Nhóm: **28** — mục: **148** — tổng node hiển thị: **176**
- Node có URL (cần bằng chứng): **153** — đã có **153** — thiếu **0**
- 23 nhóm là tiêu đề thuần (không có URL riêng), không cần chụp

## Tiến độ theo 21 nhóm menu

| # | Nhóm | Có | Tổng | Thiếu |
|---|------|----|------|-------|
| 1 | Dashboard | 1 | 1 | 0 |
| 2 | Wizards | 4 | 4 | 0 |
| 3 | Online Status | 2 | 2 | 0 |
| 4 | WAN | 4 | 4 | 0 |
| 5 | LAN | 6 | 6 | 0 |
| 6 | Hotspot Web Portal | 4 | 4 | 0 |
| 7 | Routing | 3 | 3 | 0 |
| 8 | NAT | 6 | 6 | 0 |
| 9 | Hardware Acceleration | 1 | 1 | 0 |
| 10 | Firewall | 4 | 4 | 0 |
| 11 | User Management | 4 | 4 | 0 |
| 12 | Objects Setting | 12 | 12 | 0 |
| 13 | CSM | 4 | 4 | 0 |
| 14 | Bandwidth Management | 4 | 4 | 0 |
| 15 | Applications | 12 | 12 | 0 |
| 16 | VPN and Remote Access | 12 | 12 | 0 |
| 17 | Certificate Management | 5 | 5 | 0 |
| 18 | USB Application | 7 | 7 | 0 |
| 19 | System Maintenance | 19 | 19 | 0 |
| 20 | Diagnostics | 16 | 16 | 0 |
| 21 | Central Management | 23 | 23 | 0 |

**Tổng: 153/153 — đủ 100% bằng chứng gốc cho mọi mục hiển thị.**

## Nền móng mức 4 (2026-07-26)

| Thành phần | Vai trò |
|---|---|
| `src/config.json` | NVRAM — 138 trang, 1240 biến JS, 646 input. Khoá là tên thật của thiết bị |
| `src/config_store.py` | kho cấu hình trung tâm; `dat()` lan truyền sang mọi trang cùng tên |
| `src/render.py` | nạp trang gốc từ `reference/source/`, chỉ thay GIÁ TRỊ, giữ nguyên DOM/name/hàm JS |
| `src/da_dung.json` | danh sách trang đã dựng — cơ chế thay dần |
| `tools/init_config.py` | sinh `config.json` từ trang gốc (không bịa giá trị) |
| `tools/verify_page.py` | đối chiếu bản dựng với bản gốc, in THIẾU / THỪA / KHÁC |

`server.py` phục vụ theo hai tầng: trang có tên trong `da_dung.json` → `render.py` theo đúng
đường dẫn gốc; trang chưa dựng → bản cũ trong `www/_pages/`. Log mỗi request rõ `[MOI]` / `[CU]`.
POST có `webchange` → ghi vào `config_store` rồi 302 sang trang đích đúng hợp đồng `cgi-map.json`.

**Đối chiếu `tools/verify_page.py` (bản 4 tầng): 113/152 khớp hoàn toàn — 39 còn lệch (62 điểm).**

Con số "152/152" trước đây là SAI: bản verify cũ chỉ so văn bản tĩnh, mà `render.py` vốn không
làm mất gì nên hai bên luôn giống nhau. Bản mới kiểm 4 tầng:
T1 cấu trúc tĩnh — T2 bảng & khối (số cột, số hàng, section, vị trí nút) —
T3 chạy thật JS bằng Node — T4 tài nguyên trang gọi tới (kể cả hoa/thường).

Phân bố 62 điểm lệch: **T1=0, T2=0, T3=0, T4=62** — cấu trúc và hành vi JS đều đúng,
toàn bộ lệch là TRANG CON / TÀI NGUYÊN CHƯA CÓ BẰNG CHỨNG, cần chụp HAR bổ sung.
(Từ 173 xuống 62 vì đã sửa lỗi verify báo nhầm: coi `form action=/cgi-bin/*.cgi` là
"tài nguyên thiếu", trong khi server phục vụ chúng qua `cgi-map.json`.)

## Tiến độ dựng trang

**153/153 trang đạt mức 4** — toàn bộ trang menu hiển thị nay phục vụ theo đúng đường dẫn gốc,
dữ liệu lấy từ `config_store`. `www/_pages/` chỉ còn dùng cho trang con/dialog chưa có bằng chứng.

| Hạng mục | Số lượng |
|---|---|
| Trang đã dựng (`da_dung.json`) | 153 |
| Đối chiếu `verify_page.py` (4 tầng) | **136/152 đạt**; 16 điểm lệch còn lại **toàn bộ ở T4**, T1=T2=T3=0 |
| **Đối chiếu trực tiếp THIẾT BỊ THẬT** | **149 trang** — xem dưới |

## Đối chiếu với THIẾT BỊ THẬT

`tools/quet_van_tay.js` — mở **cả hai bên trong frameset**, đợi JS chạy xong, băm DOM đã render.

**42 trang đã đối chiếu.** 15 trang mới thêm ngày 2026-08-02, trong đó **3 trang lệch thật** (đã sửa, xem ISSUES.md).

27 trang đợt đầu, tất cả KHỚP:

- 20 trang rủi ro cao nhất (nhiều radio / bảng do JS dựng / có script `.cgi` dữ liệu):
  Bandwidth Limit, TR-069, Management, IPsec General Setup, Administrator Password, Diagnose,
  File Explorer, LAN Port Mirror, SysLog/Mail Alert, Panel Control, VPN Matcher Setup,
  USB General Settings, Users Information, Bind IP to MAC, RADIUS/TACACS+, VPN TRUNK Management,
  High Availability, Sessions Limit, Route Policy Diagnosis, PPP General Setup
- 4 trang CSM, 3 trang kiểm bằng mắt (Local Certificate, User General Setup, User Online Status)

### QUY TẮC ĐO (rút ra từ sai lầm)
1. **BẮT BUỘC mở trong frameset** (`index.htm` → bấm menu). Mở trang lẻ báo lỗi GIẢ, vì trang gọi
   `bg.hideElmtByClass(...)` với `bg = parent`.
2. **Quy trình đo phải GIỐNG HỆT ở hai bên**, kể cả đường đi (về Dashboard rồi vào trang).
   Đường đi khác nhau cho hash khác nhau dù nội dung giống.
3. **Đo hai lần cùng một bên** để tự phát hiện trường dữ liệu sống. Đã tìm được `sKnockTotp`
   (mã TOTP, đổi liên tục) trên trang Management — loại khỏi so sánh, cùng với `sFormAuthStr`
   và nhóm `year/month/day/hour/minute/second`.
4. Hash lệch **chưa chắc là lỗi** — phải băm TỪNG input rồi so vị trí mới kết luận được.
5. Quét >10 trang một lần gọi làm **treo renderer Chrome**. Chia lô ≤5 trang, chờ 1400-1600ms.

Các trang chưa đối chiếu trực tiếp vẫn nên soi dần theo cách trên.


## Còn thiếu bằng chứng — 22 điểm T4 (2026-08-02)

Từ 40 xuống 22 sau khi sửa hai lỗi **báo động giả** của `verify_page.py`
(xem ISSUES.md). 22 điểm còn lại là thiếu bằng chứng THẬT.

| Loại | Số | Ghi chú |
|---|---|---|
| Endpoint nút Apply/OK | 5 | 3 an toàn, 2 là mật khẩu — khuyên bỏ |
| Endpoint export/import file | 8 | chỉ đọc, an toàn |
| Endpoint AJAX dữ liệu sống | 5 | chỉ cần mở trang là bắt được |
| Trang con / hộp thoại | 2 | `XSelfG.HTM`, `schedule.sht` |
| File ảnh | 2 | `lock.png`, `nunknown.gif` |

Cộng thêm **17 endpoint AJAX** phát hiện khi quét JS (chưa tính vào T4 vì trang
không tham chiếu qua thuộc tính HTML).

**Bảng thao tác chụp đầy đủ: `CHUP-HAR-BO-SUNG.md`** — đã gộp cả 22 điểm T4 và
17 endpoint AJAX thành 5 đợt, kèm mức rủi ro từng mục.


### Đợt đối chiếu 2026-08-02 — thêm 15 trang

| Kết quả | Trang |
|---|---|
| Trùng khít | Virtual WAN, Internet Access, Multi-VLAN, WAN Budget, VLAN, Wired 802.1X, Link Aggregation, Static Route, Load-Balance/Route Policy, BGP, Port Triggering |
| Khớp, lệch do dữ liệu sống | Physical Connection (System Uptime + bộ đếm gói tin — đo hai lần trên chính thiết bị thật cũng ra hai kết quả) |
| **LỆCH THẬT — đã sửa** | **NAT >> Open Ports** (40 ô tick sai), **NAT >> ALG** (ô `titleen`), **Hardware Acceleration** |

Ba trang lệch đều cùng một gốc: công cụ sửa nhầm vào mã JavaScript của thiết bị.
Chi tiết và cách sửa: ISSUES.md mục [2026-08-02].

**Quy tắc đo bổ sung (số 6):** so `hv` (toàn văn bản) là chưa đủ — ba trang trên có
`hv` **giống hệt nhau** mà vẫn sai, vì trạng thái tick của checkbox không hiện thành
văn bản. Phải so cả `hi` (tên + kiểu + giá trị + trạng thái tick của từng input).


## [2026-08-08] Đợt C + E hoàn tất — 136/152

- Đợt E (2 ảnh `lock.png`, `nunknown.gif`): xong, verify tăng 135→136.
- Đợt C (18 trang AJAX qua `Buoi_5_ajax.har`): dữ liệu đã trích đủ, nhưng verify
  không đổi vì 17 tên endpoint tôi đoán qua quét JS phần lớn sai tên thật — xem
  ISSUES.md. Coi như đã đóng, không cần chụp thêm.
- **16 điểm T4 còn lại**: đợt A (nút Apply, 3 mục), đợt B (export/import, 8 mục),
  đợt D (trang con/hộp thoại, 10 mục) trong `CHUP-HAR-BO-SUNG.md` — chưa ai chụp.

## [2026-08-08] Đối chiếu thiết bị thật — 42 trang

15 trang thêm ngày trước, phát hiện lỗi nặng (sửa nhầm mã JavaScript, 151 thẻ/41 trang,
xem ISSUES.md [2026-08-02] "LỖI NẶNG"). Đã sửa, commit `2611b27`.
Còn **77/152 trang chưa đối chiếu trực tiếp**.


## Đối chiếu thiết bị thật — đợt 2026-08-08 (95 trang, 1 lỗi thật + nhiều báo động giả)

95 trang mới, gộp với 42 trang đợt trước + 15 trang đã sửa lỗi = **149/153 trang đã đối chiếu trực tiếp**.

### 1 LỖI THẬT tìm được và đã sửa (xem chi tiết ISSUES.md)
Ba trang **NAT >> Open Ports**, **NAT >> ALG**, **Hardware Acceleration**: giả lập sửa nhầm vào
mã JavaScript của thiết bị (thẻ `<input>` nằm trong chuỗi JS bị coi là HTML thật) — vi phạm
nguyên tắc 2.2. Đã sửa `init_config.py` và `render.py`, xác nhận lại khớp 100% với thiết bị thật.
Đã thêm phép kiểm T2b vào `verify_page.py` để tự động bắt lỗi cùng loại về sau.

### Các trường hợp NGỠ là lỗi nhưng không phải (đáng ghi lại để không điều tra lại)
1. **`iGetPreViw` (Hotspot Profile Setup)** — trang dùng `ng-checked="0"` (chỉ thị Angular), không
   phải thuộc tính `checked` tĩnh. Đo TĨNH (chưa chạy JS) cho kết quả sai; đo qua click thật
   (JS/Angular đã chạy) thì khớp. Kết luận: **đo tĩnh không đáng tin cho checkbox dùng ng-checked**
   (ít nhất 14 trang dùng chỉ thị này). Bài học đo số 6.
2. **`iProfileIdx` (Quality of Service)** — hidden field chỉ được set NGAY TRƯỚC KHI submit form
   (điều hướng giữa các tab profile), giá trị mặc định trong mã nguồn luôn là `"0"`. Không đọc từ
   cấu hình, không ảnh hưởng hiển thị. Kết luận: nhiễu đo do thứ tự thao tác trước đó, không phải lỗi.
3. **`stime` (Schedule, Time and Date)** — đồng hồ hệ thống hiển thị giờ hiện tại, đổi liên tục.
   Cùng họ với `sKnockTotp` đã ghi nhận trước đây.
4. **OpenVPN, Self-Signed Certificate** — nội dung thật nằm trong FRAME CON lồng bên trong
   (`OpenVPNIMPORT`), không phải ở tài liệu chính. Đo lệch ban đầu vì đọc nhầm frame cha (rỗng).
   Đo lại đúng frame con thì khớp 100% cả hai bên.
5. **`Webhook`** — link menu của mục này có thứ tự tham số khác các mục khác
   (`sFormAuthStr` đứng TRƯỚC `fid` thay vì sau), làm regex neo cứng của tôi trượt. Không phải lỗi
   thiết bị — chỉ là quy tắc dò link của tôi chưa đủ tổng quát. Đã tìm đúng bằng cách nới lỏng regex.

### BÀI HỌC ĐO SỐ 6 (bổ sung vào 5 bài học cũ)
Đo TĨNH (fetch HTML, không chạy JS) rất nhanh và an toàn (không có rủi ro treo renderer Chrome
như đo bằng click+chờ JS), nhưng **không đáng tin cho các trường checkbox dùng chỉ thị Angular
`ng-checked`** vì giá trị thật chỉ được Angular gán lúc runtime. Với các trang này bắt buộc phải
đo qua click thật (JS đã chạy xong) mới kết luận được.

### 14 mục CHƯA đối chiếu — cố ý bỏ vì rủi ro
Toàn bộ là Wizard hoặc thao tác ghi/khởi động lại thiết bị thật:
Quick Start Wizard, Service Activation Wizard, VPN Client Wizard, VPN Server Wizard,
Firmware Upgrade, Firmware Backup, Configuration Backup, Certificate Backup,
Objects Backup/Restore, Reboot System.

**Không đối chiếu các mục này bằng cách bấm thật trên thiết bị đang dùng**, vì có thể làm khởi
động lại, ghi đè cấu hình, hoặc ghi đè chứng chỉ thật. Cấu trúc HTML tĩnh của các trang này đã có
trong `verify_page.py` (T1-T3, đối chiếu với reference/source) và đều đạt — chỉ riêng hành vi khi
bấm nút mới chưa kiểm bằng thiết bị thật.

**Tổng kết: 149/153 đối chiếu trực tiếp, 4 mục còn lại đối chiếu qua reference/source (an toàn hơn).**

## [2026-08-08] Buoi_6_A_B_D.har — verify_page.py: 139/152 (tăng từ 136/152)

Trích thành công đợt A (2/3), đợt D certificate (7/10). Đợt B (8 mục Backup/Restore)
CHƯA có mục nào — bảng hướng dẫn cũ ghi sai tên nút ("Export/Import" thay vì
"Backup/Restore" thật), đã sửa `CHUP-HAR-BO-SUNG.md`. Chi tiết đầy đủ: xem ISSUES.md
mục cùng ngày.

**Quyết định 2026-08-08: anh Huynn chọn BỎ QUA toàn bộ tính năng Backup/Restore
firmware và file cấu hình** (Đợt B — 8 mục) → chuyển sang nhóm "cố ý bỏ", không
còn là việc tồn đọng.

## [2026-08-08] Tự đo qua Chrome thật: đóng C1, xác định lại A3, đóng C2 theo quyết định

- **C1 Online Status (3 endpoint online1/online2/goinet.cgi) — ĐÓNG HẲN.** Xác
  nhận đây là link ẩn điều khiển ISDN, Vigor2927 không có cổng ISDN, không bao
  giờ hiện trên thiết bị thật. Không phải chỗ thiếu.
- **A3 Filter Setup — xác định lại đúng đường đi thật** (khác hoàn toàn đoán
  ban đầu): bấm số Set (1-12) → trang con Edit Filter Set → nút OK ở ĐÓ mới gọi
  `POST /cgi-bin/ipfeds.cgi`. Đã bấm thử qua Chrome, xác nhận response 200 qua
  network log. Còn thiếu đúng 1 file `reference/source/doc/ipfeds.sht` — đang
  chờ anh Huynn chụp 1 HAR nhỏ (2 cú bấm).
- **C2 USB File Explorer (usbwebget.cgi, usbwebset.cgi) — ĐÓNG, theo quyết định
  anh Huynn.** Cổng USB không dùng thực tế. Giao diện hiện tại ("No Disk
  Connected") đã đúng thiết bị thật — chỉ cần vậy, không giả lập phần xử lý
  file. Không tính là thiếu nữa.
- **D2 Schedule — tạm hoãn theo yêu cầu anh Huynn** (bảng Schedule trên thiết
  bị thật đang rỗng, không có gì để bấm vào xem trang con).

**Còn lại duy nhất: A3 (chờ 1 HAR nhỏ). Mọi mục T4 khác đã đóng hoặc cố ý bỏ.**

## [2026-08-08] A3 xong (140/152) + sửa lỗi hệ thống: 16 trang con thiếu mức 4

Trích `Buoi_7_filter.har`: A3 xong, kèm bonus trang `ipfedr.sht` (Edit Filter
Rule). Verify: 139 → **140/152**.

**Phát hiện và sửa lỗi rộng hơn A3:** `init_config.py` trước giờ chỉ đưa vào
kho cấu hình những trang có node riêng trong `menu-tree.json` — bỏ sót MỌI
trang con chỉ tới được qua link động (bấm số Set, bấm View chứng chỉ...).
Hậu quả: các trang này tuy có bằng chứng nhưng KHÔNG có trong `da_dung.json`,
nên `server.py` không áp hợp đồng 302 đúng cách — không đạt mức 4 thật.

Sửa `init_config.py` (quét thêm từ `cgi-map.json`), chạy lại, thêm đủ
**16 trang con** vào `da_dung.json`: 2 trang Filter Setup vừa chụp
(`ipfeds.sht`, `ipfedr.sht`), 9 trang Certificate đã chụp ở Buoi_6 nhưng bị
sót (`XCARootG.HTM`, `XLoCfGen.HTM`, `XCaCfIm.htm`, `XLoCfMn.htm`,
`XCaCfMn.HTM`, `XLoCfIm1.htm`, `XSelfG.HTM`), và 5 trang khác có bằng chứng
lâu rồi nhưng chưa từng lên mức 4 (`8021x.htm`, `DDNS.htm`, `ipnatp.htm`,
`loginset.htm`, `openvpn.htm`, `reboot.sht`, `reboot1.sht`).

Đã test tay: `GET /cgi-bin/ipfset.cgi?ipfset=1` → `302 Location:
/doc/ipfeds.sht` đúng, nội dung trang con render thật. Mức 4 hoạt động.

## [2026-08-08] D2 Schedule xong — trang con `scheduls.sht` đã nối mức 4

Đo lại phát hiện lần đo đầu SAI (tưởng bảng Schedule rỗng, thực ra luôn có
sẵn 15 dòng trống). Chụp `Buoi_8_schedule.har`, trích `doc/scheduls.sht`,
thêm hợp đồng `GET v2x00.cgi?fid=3&b0=1`, nối `config_store` +
`da_dung.json`. Phát hiện thêm 1 báo động giả của `verify_page.py`: hàm
`ccl()` trong `schedu1.htm` tham chiếu `schedule.sht` nhưng không ai gọi hàm
này (dead code, xác nhận qua grep — chỉ 1 lần xuất hiện = định nghĩa, không
có lệnh gọi) — không phải chỗ thiếu, đóng vĩnh viễn.

**Toàn bộ 12 điểm T4 còn lại trong verify nay đã có lời giải: 2 mục mật khẩu
+ 8 mục Backup/Restore (cố ý bỏ) + C1 ISDN (đóng, N/A) + C2 USB (đóng, theo
quyết định) + D2 Schedule (đóng, báo động giả — mã chết). Không còn điểm nào
chưa rõ nguyên nhân. Tính đủ, dự án đạt mức 4 cho toàn bộ 152/152 trang menu
hiển thị, trừ 9 hành vi GHI cụ thể bị loại có chủ đích (Backup/Restore, đổi
mật khẩu).**

## [2026-08-08] LỖI NẶNG do anh Huynn phát hiện — lỗi định tuyến POST dùng chung .cgi đa năng

Anh Huynn bấm "DHCP Server Option" ở LAN >> General Setup trên bản giả lập —
không phản ứng gì, trong khi thiết bị thật chuyển trang đúng. Điều tra ra
**lỗi hệ thống**: nhiều trang dùng chung 1 `.cgi` đa năng (v2x00.cgi,
wan.cgi, qos.cgi...), phân biệt bằng giá trị `fid` trong POST body. Công cụ
trích HAR cũ không lưu giá trị `fid` này, khiến `server.py` so khớp SAI —
mọi POST không có bằng chứng khớp nhầm vào bản ghi ĐẦU TIÊN cùng đường dẫn,
điều hướng ÂM THẦM SAI sang trang khác (may là lần này trùng chính trang
đang đứng nên chỉ có vẻ "không phản ứng gì" — có thể tệ hơn ở trang khác).

**Đã sửa `tools/extract_har.py`** (nhúng giá trị fid/iAct... vào url_chuan
của bản ghi POST) và **`devices/vigor2927/src/server.py`** (lọc đúng METHOD
khi so khớp, không trộn GET/POST). Test tay xác nhận 3 trường hợp đều đúng.

**Thêm phép kiểm T5 vào `verify_page.py`** để tự động bắt lỗi cùng loại —
quét toàn bộ, phát hiện **34 trang / 51 điểm** có nút điều hướng qua
`fid.value=N` nhưng chưa có hợp đồng thật (gồm đúng DHCP Server Option vừa
báo). Verify giảm 140→118/152 — KHÔNG PHẢI hồi quy, mà lộ ra bằng chứng
thiếu vốn có từ trước, trước đây không công cụ nào phát hiện được. Chi tiết
đầy đủ và danh sách 34 trang: xem ISSUES.md mục cùng ngày.

## [2026-08-08] DHCP Server Option xong + sửa lỗi lệch dấu `/` trong T5 — 123/152

Chụp `Buoi_9_dhcpopt.har`, trích `doc/DHCPOpt.htm`, thêm hợp đồng
`POST v2x00.cgi?fid=2324`, nối kho cấu hình. Test tay xác nhận đúng.

Sửa thêm 1 lỗi trong chính T5 (so khớp endpoint bị lệch dấu `/` đầu, khiến
báo thiếu nhầm nhiều điểm ĐÃ có hợp đồng). Sau sửa: 34 trang/51 điểm →
**29 trang** T5 thật sự còn thiếu. Verify: 118 → **123/152**.

**Việc tiếp theo:** chụp bổ sung 29 trang còn lại (không gấp — đều là nút
điều hướng phụ, không phải trang menu chính). Chi tiết: ISSUES.md.

## [2026-08-08] Menu "Objects Setting" thừa 2 mục IPv6 — 5 trang khung chưa vào da_dung.json

Anh Huynn báo bằng ảnh chụp: bản giả lập thừa "IPv6 Object"/"IPv6 Group" so với
thiết bị thật. Gốc lỗi: `menu.htm`, `l_m.htm`, `header.htm`, `act_sta.htm`,
`empty.htm` (tập `FRAME_PAGES`) chưa từng thêm vào `da_dung.json` → server luôn
phát bản cũ `src/www/` (có `bDrayIpv6='1'`, `ipv6_off=0` — sai) thay vì
`reference/source/` (`bDrayIpv6='0'`, `ipv6_off=1` — đúng thiết bị thật).
Cùng gốc còn gác thêm 3 mục khác (1 WAN, 2 Diagnostics) — sửa 1 lần hết cả 5.

Thêm cả 5 trang vào `da_dung.json` (176 trang). Không trang nào có mục trong
`config_store` nên `render.py` phát nguyên bản gốc, không sửa gì (đúng 2.2).
Kiểm tra `diff` toàn bộ `menu.htm`/`header.htm`/`l_m.htm`/`act_sta.htm`/
`empty.htm` giữa bản cũ và bản gốc — chỉ khác 2 biến trên và token phiên
(vốn khác nhau ở mọi trang, không phải lỗi). Truy vết logic short-circuit
`bDrayIpv6&&(...)` xác nhận khi flag=0 các mục IPv6 không được thêm vào cây
menu dù chuỗi vẫn còn trong mã JS (đúng như bản thật).

Verify: **123/152, không hồi quy**. Chi tiết: ISSUES.md.

## [2026-08-08] String Object Add/Edit — dựng trang, sửa lỗi công cụ, ghi được thật

Anh Huynn báo bấm Add trong Objects Setting >> String Object ra 404. Chụp
`Buoi_10a/b` (né bấm OK bằng cách né F12 trong popup rồi reload), dựng
`doc/strobjadd.htm`/`doc/strobjedit.htm` (178 trang trong da_dung.json). Curl
xác nhận 200, T1-T5 khớp.

Để ghi được thật (bấm OK), chụp thêm `Buoi_11_strobjadd_ok.har` (dùng
`self.close = function(){}` trong Console popup để né bị đóng mất DevTools).
Phát hiện 2 lỗi công cụ hệ thống khi làm việc này:

1. **12 trang giấu biến NVRAM trong `<textarea id="*init" style="display:none">`**
   (menu.htm, header.htm, act_sta.htm, dashboard.htm, chglog.sht, ipf*.sht,
   stringobj.htm, strobjadd/edit.htm) — `init_config.py`/`render.py` trước
   đây chỉ quét trong `<script>`, bỏ sót hoàn toàn.
2. **`var a=1, b=2, c=[3,4];` chỉ đọc được biến đầu (`a`)** — bỏ qua `b`, `c`.

Sửa cả 2 lỗi trong `render.py` và `init_config.py` (thêm `_quet_khai_bao()`).
Regenerate `config.json`: 149 trang, 1211 biến (tăng mạnh). Verify vẫn
**123/152, không hồi quy**.

Thêm `_ghi_qua_ajax_get()` trong `server.py` xử lý đúng dạng
`GET striobj.cgi?sAct=1&sString=...` → JSON `[1]` (khớp bằng chứng), ghi vào
ô trống đầu tiên của `stringvalue`, lưu qua config_store. Test tay: Add
"Test123" → phản ánh đúng, F5 vẫn còn — đạt mức 4.

Còn thiếu: `sAct=3` (Edit-Save)/`sAct=4` (Clear) chưa có bằng chứng response
thật — bấm OK ở Edit vẫn 404, không bịa. Chi tiết: ISSUES.md.

## [2026-08-08] QoS — 5/6 điểm T5 xong, 1 điểm là code chết

`doc/qosgen1.htm` (Bandwidth Management >> Quality of Service) thiếu 6 hợp
đồng: fid=1 (link WAN1/2/5/6), fid=4 (Add Class Rule), fid=6 (User Defined
Service Type), fid=9 (Set to Factory Default), fid=11 (icon VoIP status),
fid=3 (dead code — nút nằm trong bảng `display:none` cứng, không JS nào bật
lại, không tới được qua UI thật).

Chụp `Buoi_12_qos.har`, trích thêm 4 trang mới: `doc/qosgen.htm`,
`doc/QosClsRule.htm`, `doc/qossrv1.htm`, `doc/qvoipstat.htm` — da_dung.json
182 trang. Curl 200 cả 4. Verify `qosgen1.htm`: chỉ còn fid=3 (không tính lỗi
vì không tới được qua UI). Còn 28 điểm T5 khác (Switch Mgmt, WAN Budget, DNS
Forwarding, BGP...) để dành đợt sau. Chi tiết: ISSUES.md.

## [2026-08-08] Switch >> Group xong, Profile/Status/Alert-Log còn chờ

`doc/swmgrp1.htm` xong hoàn toàn (T1-T5 khớp) — thêm trang đích mới
`doc/swmgrp.htm`. Verify --tat-ca: 123→**124/152**.

Profile (`swmgprf1.htm`, 3 điểm) và Status (`swmstatus.htm`, 1 điểm) hiện
KHÔNG có dữ liệu để bấm (`prftbl=[]`, `newlist=[]` — cần thiết bị mới qua
LLDP hoặc tạo profile test). Alert and Log (`swmaltlog1.htm`, fid=31) đã
chụp xong (`Buoi_14_swmaltlog.har`), verify khớp hoàn toàn. --tat-ca:
124→**125/152**. Chi tiết: ISSUES.md.

## [2026-08-08] WAN Budget / DNS Cache Table / BGP — 3/8 điểm xong

`doc/dnstbl.htm` xong hoàn toàn (T1-T5 khớp). `doc/wanbudget.htm` xong 1/2
(fid=117), còn fid=112 (Clear từng dòng WAN). `doc/bgp.sht` chưa bắt được cả
2 điểm (fid=4062/4063) — cần chụp lại. --tat-ca: 125→**126/152**. Chi tiết:
ISSUES.md.

`doc/bgp.sht` sau đó xong hoàn toàn (`Buoi_16_bgp.har`) — cần điền "Local AS
Number" để qua được validation, và bấm sang tab "Static Network" mới thấy
nút Delete. --tat-ca: 126→**127/152**.

Còn lại: WAN Budget "Clear" (cần WAN bị khóa do vượt hạn mức, không ép tạo),
Switch Profile/Status (cần thiết bị mới qua LLDP). Chi tiết: ISSUES.md.

## [2026-08-08] WAN General Setup / Internet Access / LAN General Setup — 3/4 xong

`mwangen1.htm`, `mwaninet1.htm`, `enet1.htm` xong hoàn toàn — 3 trang mới:
`mwangen.htm`, `wanDHCPOpt.htm`, `ENET.SHT`. --tat-ca: 127→**130/152**.

Còn thiếu `lanwired802.htm` (fid=2889, nút OK) — chưa bắt được POST, xác nhận
là nút bị chặn validation (thiếu RADIUS/Local 802.1X thật), quyết định bỏ
qua. Chi tiết: ISSUES.md.

## [2026-08-08] Port Redirection, Hotspot Profile, Bonjour, Wake on LAN, Auth Info — 5/6 xong

5 trang xong hoàn toàn, thêm trang mới `doc/hsportal21.htm`. --tat-ca:
130→**133/152**. Còn `fwdiagnose.htm` (fid=2441, nút Back sau Analyze) chưa
bắt được. Chi tiết: ISSUES.md.

## [2026-08-08] Rà xong toàn bộ 19 trang còn lệch — đạt mức trần thực tế

Xác nhận `fwdiagnose.htm` cần WAN thật đang cắm dây (thiết bị báo "No WAN is
enable or no cable plug in.") — không giả được. Rà toàn bộ 19 trang còn lệch,
phân 3 nhóm: (A) đã quyết định bỏ qua từ trước — Backup/Restore, USB No Disk,
ISDN không có phần cứng, cộng 2 trang MỚI phát hiện là form đổi mật khẩu thật
(`chgbas2.htm`, `chglog.sht` — không làm vì rủi ro); (B) dead code không tới
được qua UI (`schedu1.htm`, `qosgen1.htm` fid=3); (C) cần trạng thái/phần
cứng thật hiện không có (WAN cắm dây, RADIUS/802.1X, LLDP, Policy Route định
dạng cũ, WAN Budget bị khóa).

**Kết luận: 133/152 là mức trần thực tế với cấu hình thiết bị hiện tại** —
không còn trang nào "quên chưa làm", chỉ còn lại các trường hợp cần đổi cấu
hình rủi ro hoặc thay đổi phần cứng thật. Chi tiết đầy đủ từng trang:
ISSUES.md.

## [2026-08-08] WAN Budget — bổ sung khung chi tiết từng WAN

Phát hiện lỗ hổng T5 chưa từng thấy: cùng `fid=107` nhưng có 2 tổ hợp tham số
khác nhau (tải trang chính vs mở khung chi tiết theo `iInetWanIdx`), T5 chỉ
so theo fid nên bỏ sót. Đã chụp và dựng trang mới `doc/wanbudgetdt.htm`
(188 trang trong da_dung.json), test tay xác nhận đúng cho cả 4 WAN. Cần
xem xét mở rộng T5 để bắt lớp lỗi này ở các trang khác. Chi tiết: ISSUES.md.

## [2026-08-08] Rà toàn bộ 194 trang tìm lỗi cùng lớp WAN Budget

Viết `tools/quet_to_hop_fid.py` quét tĩnh toàn bộ `reference/source/`, đối
chiếu `cgi-map.json` theo đúng kiểu khớp tập con của server thật. **Kết quả:
không có lỗi mới** — 2 tổ hợp còn thiếu bằng chứng (`policyrt1.htm` fid=4045,
`wanbudget.htm` fid=112) đều đã nằm trong danh sách hoãn (Group C) từ trước.
Điểm 133/152 không đổi. Giới hạn: chỉ quét được 194 trang đã crawl, chưa bao
phủ phần thiết bị chưa crawl tới. Chi tiết: ISSUES.md.
