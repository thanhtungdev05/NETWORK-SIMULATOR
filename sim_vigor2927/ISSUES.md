## [2026-08-08] String Object >> Add/Edit — thiếu bằng chứng gốc, 404 trên bản giả lập

Anh Huynn chụp ảnh: bấm "Add" ở String Object trên thiết bị thật mở popup
`/doc/strobjadd.htm`. Trên bản giả lập bấm Add → 404 `Not found:
/doc/strobjadd.htm`.

**Kiểm tra**: `doc/stringobj.htm` (đã dựng, đạt mức 4, T1-T5 khớp 100%) gọi
`window.open("strobjadd.htm", ...)` cho nút Add và `window.open("strobjedit.htm", ...)`
cho bấm số thứ tự (Edit). Cả 2 file này **chưa từng xuất hiện trong bất kỳ
`reference/har/*.har` nào** — chỉ là chuỗi text nằm trong mã JS của
`stringobj.htm`, không phải request thật đã chụp được. `T4`/`T5` của
`verify_page.py` không bắt được loại thiếu này vì đây là `window.open()` mở
cửa sổ mới, không phải `<img>/<script src>` hay điều hướng qua `fid.value=N`.

Đây là 2 trang con đúng nguyên tắc 2.1 — **không được đoán cấu trúc form,
DỪNG và chờ HAR**.

**Cần anh Huynn chụp HAR** (F12 → Network → Preserve log, KHÔNG F5):
1. Vào LAN → mở Firefox/Chrome DevTools tab Network, bật "Preserve log".
2. Điều hướng tới Objects Setting >> String Object (nếu đã ở trang này rồi thì
   khỏi cần bấm lại).
3. Bấm nút **Add** → popup hiện ra → điền một chuỗi bất kỳ (vd "test123") vào ô
   String → bấm **OK** (nếu ngại ghi dữ liệu thật lên thiết bị, bấm Cancel
   cũng được — miễn có capture cửa sổ `strobjadd.htm` hiện ra).
4. Đóng popup nếu còn mở.
5. Bấm vào số thứ tự **1** trong bảng String Object (mở popup Edit
   `strobjedit.htm`) → bấm Cancel để đóng, không cần sửa gì.
6. Export HAR (chuột phải trong Network → Save all as HAR with content), đặt
   tên `Buoi_10_strobj.har`, lưu vào `reference/har/`.

**Đã chụp và dựng xong** (`Buoi_10a_strobjadd.har`, `Buoi_10b_strobjedit.har`):
`doc/strobjadd.htm`, `doc/strobjedit.htm` trích vào `reference/source/`, thêm
vào `da_dung.json` (178 trang). Curl xác nhận cả 2 trả 200 (trước đó 404).
`verify_page.py`: cả 2 trang T1-T5 khớp hoàn toàn.

**Nút Add: đã ghi được thật (2026-08-08, đợt 2)**. Anh Huynn chụp thêm
`Buoi_11_strobjadd_ok.har` (dùng `self.close = function(){}` trong Console để
popup không tự đóng mất DevTools) — bắt được request thật:
`GET /cgi-bin/striobj.cgi?sAct=1&sString=...&domaincomm=0&iPRIdx=-1&sltperpage=10&webchange=1`
→ 200 `application/json` → body `[1]`.

Lúc trích bằng chứng này phát hiện thêm **2 lỗi công cụ hệ thống**:

1. `doc/stringobj.htm` khai báo bảng 5 dòng qua `var stringvalue = [...]`
   nằm trong `<textarea id="stringobjinit" style="display:none">` rồi dùng JS
   đọc `.value` nhồi vào `<script>` thật lúc chạy — `init_config.py` và
   `render.py` trước đây CHỈ quét trong the `<script>`, bỏ sót toàn bộ biến
   khai báo kiểu này. Có **12 trang** dùng cách này: `menu.htm`, `header.htm`,
   `act_sta.htm`, `doc/dashboard.htm`, `doc/chglog.sht`, `doc/ipf.sht`,
   `doc/ipfbas.sht`, `doc/ipfedr.sht`, `doc/ipfeds.sht`, `doc/stringobj.htm`,
   `doc/strobjadd.htm`, `doc/strobjedit.htm`.
2. Khi một `var` gộp NHIỀU biến bằng dấu phẩy (`var a=1, b=2, c=[3,4];` — kiểu
   JS nén thấy ở các trang trên), công cụ chỉ đọc được biến ĐẦU TIÊN (`a`),
   âm thầm bỏ qua `b`, `c`. `menu.htm` một mình gộp tới ~90 biến kiểu này
   (tuy dùng `const` chứ không phải `var`, xem mục "còn thiếu" bên dưới).

Đã sửa `_toan_cuc()`/`toan_cuc()` (quét thêm `<textarea id="*init">`) và thêm
hàm `_quet_khai_bao()`/`quet_khai_bao()` tách đúng từng biến trong chuỗi
`var`, áp dụng cho cả `render.py` (thay giá trị) và `init_config.py` (trích
giá trị ban đầu) — khớp nhau, đúng nguyên tắc "sửa 1 lỗi thì rà hết chỗ tương
tự". Regenerate `config.json`: 149 trang, 1211 biến JS (tăng đáng kể so với
trước). `verify_page.py --tat-ca`: vẫn **123/152, không hồi quy**.

Thêm xử lý ghi riêng trong `server.py` (`_ghi_qua_ajax_get`) cho đúng dạng
request này (GET trả JSON, không phải POST 302 như đa số `.cgi` khác): tìm ô
trống đầu tiên trong `stringvalue`, ghi `sString` vào, lưu qua `config_store`,
trả `[1]` — khớp bằng chứng thật. Test tay: Add "Test123" → mảng cập nhật
đúng ô 1 (giống thiết bị thật), F5 lại trang vẫn còn (đạt mức 4).

**Còn thiếu**:
- `sAct=3` (Edit-Save) và `sAct=4` (Clear) — request format đã biết chắc từ
  mã JS thật, nhưng CHƯA có bằng chứng response thật (`Buoi_11_strobjedit_ok.har`
  chụp nhầm cửa sổ, không bắt được request của popup Edit). Bấm OK ở popup
  Edit hiện vẫn ra 404. Không bịa response — độ ưu tiên thấp, xếp cùng 29 mục
  T5 còn lại.
- `menu.htm`/`header.htm`/`dashboard.htm`... gộp biến bằng `const` (không
  phải `var`) — `_quet_khai_bao()` hiện CHƯA áp dụng cho `const` (cố ý, vì
  các biến đó là cờ tính năng phần cứng cố định của máy, không phải NVRAM
  người dùng sửa qua UI nào — chưa có bằng chứng cần ghi). Nếu sau này có
  trang nào thật sự CẦN đổi một cờ `const` này qua config_store thì mở rộng
  thêm, không làm trước khi có nhu cầu thật.

**Trạng thái**: nút Add đã ghi thật, đạt mức 4. Edit/Clear còn chờ bằng chứng.

## [2026-08-08] QoS (Bandwidth Management >> Quality of Service) — 5/6 điểm T5 xong

`doc/qosgen1.htm` thiếu 6 hợp đồng điều hướng (fid=1,3,4,6,9,11). Lần đầu
hướng dẫn anh Huynn SAI (đoán theo tên hàm JS thay vì nhìn trang thật — anh
báo "nhìn không đúng"). Dò lại bằng cách tìm chính xác onclick/href gắn với
từng `fid` trong `reference/source/doc/qosgen1.htm`:

- fid=1 → bấm link **WAN1/WAN2/WAN5/WAN6** (bảng Software QoS General Setup)
- fid=4 → nút **Add** (bảng Class Rule)
- fid=6 → link **"User Defined Service Type"** (trong Note dưới Class Rule)
- fid=9 → link **"Set to Factory Default"** (góc trên phải Hardware QoS)
- fid=11 → **icon điện thoại xanh** cạnh VoIP Prioritization
- fid=3 (`gotoQosClsRule`) → CHỈ được gọi từ 1 bảng có `style=display:none`
  cứng trong HTML, không có JS nào bật lại — **code chết, không tới được qua
  giao diện thật**. Giống lớp lỗi đã gặp ở `schedule.sht` (không trùng file,
  cùng bản chất).

Anh Huynn chụp `Buoi_12_qos.har` theo hướng dẫn đã sửa. Trích được cả 5
điểm + 4 trang đích mới: `doc/qosgen.htm`, `doc/QosClsRule.htm`,
`doc/qossrv1.htm`, `doc/qvoipstat.htm` — thêm vào `da_dung.json` (182 trang).
Curl xác nhận cả 4 trả 200. `verify_page.py doc/qosgen1.htm`: chỉ còn đúng
fid=3 (code chết, không tính lỗi). `verify_page.py --tat-ca`: 123/152 (giữ
nguyên — các trang con QoS không nằm trong 152 trang menu chính).

**Trạng thái**: xong 5/6, fid=3 đóng vĩnh viễn vì không tới được qua UI thật.

## [2026-08-08] Switch — Group xong, Profile/Status/Alert-Log còn chờ

Nhóm "Switch" thiếu 6 điểm T5 trên 4 trang (Profile, Status, Group, Alert and
Log). Kiểm tra dữ liệu thật trước khi hướng dẫn (rút kinh nghiệm QoS):
`prftbl=[]` (Profile), `newlist=[]` (thiết bị mới qua LLDP, cả Profile lẫn
Status) — **2 trang này hiện KHÔNG có nút Add/Edit/Delete nào hiện ra**, vì
UI chỉ hiện khi có dữ liệu. `grptbl` có sẵn 10 dòng (0-9, dòng 0="Default") —
Group bấm được ngay.

Anh Huynn chụp `Buoi_13_switch.har`: bắt được **Group** (fid=3 xem chi tiết,
fid=4 lưu) — cả 2 đều mới, thêm trang đích `doc/swmgrp.htm`. `verify_page.py
doc/swmgrp1.htm`: khớp hoàn toàn (T1-T5), tổng --tat-ca 123→**124/152**.

**Còn thiếu**:
- ~~fid=31 (Alert and Log, nút OK)~~ — **xong** (`Buoi_14_swmaltlog.har`).
  `verify_page.py doc/swmaltlog1.htm`: khớp hoàn toàn. --tat-ca: 124→**125/152**.
## [2026-08-08] WAN Budget / DNS Cache Table / BGP — 3/8 điểm xong

Chụp `Buoi_15_wanbudget_bgp_dns.har`. Kết quả:
- `doc/dnstbl.htm` (DNS Cache Table): **xong hoàn toàn** — fid=2331 (OK),
  fid=2332 (Clear). verify T1-T5 khớp.
- `doc/wanbudget.htm`: xong fid=117 (Set to Factory Default). Còn thiếu
  fid=112 (`onClear(i)` — nút Clear cạnh từng dòng WAN, chưa bấm).
- `doc/bgp.sht`: cả 2 điểm (fid=4062 OK, fid=4063 Delete) **chưa bắt được**
  dù đã hướng dẫn — trang chỉ load 2 lần (fid=4060), không thấy POST nào.
  Có thể do đang chưa cấu hình BGP nên các nút này chưa phản ứng, hoặc anh
  chưa bấm tới. Cần kiểm tra lại.

`verify_page.py --tat-ca`: 125→**126/152**.

## [2026-08-08] WAN Budget — thiếu khung chi tiết từng WAN (bấm "WAN1")

Anh Huynn chụp 2 ảnh: bấm chữ "WAN1" trong bảng WAN Budget (Index) mở khung
cài Quota chi tiết, bản giả lập không phản ứng. Nguyên nhân: link "WAN1" gọi
`gotoWanBudgetDt(idx)` → POST `fid=107&iInetWanIdx=N&showdetail=1` — một tổ
hợp tham số MỚI của `fid=107` (khác với GET `fid=107&showdetail=0` tải trang
chính đã có từ trước) mà `verify_page.py`/T5 không phát hiện được vì T5 chỉ
so khớp theo `fid`, không xét thêm `iInetWanIdx`/`showdetail` đi kèm — lỗ
hổng của chính công cụ kiểm tra, không phải do quên chụp.

Chụp `Buoi_19_wanbudget_detail.har` (cả 4 WAN: 1,2,5,6), trích trang mới
`doc/wanbudgetdt.htm`, thêm `da_dung.json` (188 trang). Test tay xác nhận cả
4 `iInetWanIdx` đều route đúng, trả 302 → `/doc/wanbudgetdt.htm`.

**Ghi chú công cụ**: `verify_page.py`'s T5 hiện chỉ bắt lỗ hổng dạng "thiếu
hợp đồng cho 1 giá trị fid", CHƯA bắt được lỗ hổng dạng "cùng fid nhưng thiếu
tổ hợp tham số đi kèm khác nhau". Nếu gặp lại lớp lỗi này ở trang khác, cần
mở rộng T5 để so khớp theo TOÀN BỘ tổ hợp tham số điều hướng, không chỉ fid.

## [2026-08-08] Rà toàn bộ 19 trang còn lệch — phân loại dứt điểm

`fwdiagnose.htm` fid=2441: anh Huynn thử với IP LAN thật, thiết bị báo popup
"No WAN is enable or no cable plug in." — xác nhận tính năng này cần WAN thật
đang cắm dây, không giả được. Xếp cùng nhóm "cần điều kiện phần cứng thật".

Nhân đó rà lại **toàn bộ 19 trang còn lệch** trong `verify_page.py --tat-ca`,
phân loại dứt điểm từng trang:

**Nhóm A — đã quyết định bỏ qua từ trước (Backup/Restore, USB, ISDN)**:
`chgbas2.htm` (form đổi User Password — MỚI phát hiện, xếp vào diện KHÔNG
LÀM vì đụng tới đổi mật khẩu thật, rủi ro), `chglog.sht` (tương tự, đổi mật
khẩu Admin), `dialini1.htm`, `ipbmac.htm`, `ipnatp1.htm`, `ipstatrt.sht`,
`lan2lan1.htm`, `mnatop.htm` (đều là nút Backup/Restore tải/nạp file cấu
hình — đúng quyết định bỏ qua ngày trước), `online1.sht` (3 điểm — nút Dial
ISDN/Drop B1/B2, thiết bị này không có phần cứng ISDN, đã đóng ở mục C1),
`usbweb.htm` (2 điểm — USB File Explorer, "No Disk Connected" là đúng, đã
đóng ở mục C2).

**Nhóm B — dead code, không tới được qua UI thật**: `schedu1.htm` (hàm
`ccl()` không nơi nào gọi — đã ghi nhận là báo động giả lần trước),
`qosgen1.htm` fid=3 (`gotoQosClsRule` trong bảng `display:none` vĩnh viễn).

**Nhóm C — cần trạng thái/phần cứng thật hiện không có, không ép tạo**:
`fwdiagnose.htm` (cần WAN cắm dây thật), `lanwired802.htm` (cần cấu hình
RADIUS/Local 802.1X thật), `policyrt1.htm` (cần rule Policy Route định dạng
cũ để "Upgrade All" hiện ra), `swmgprf1.htm` + `swmstatus.htm` (4 điểm — cần
thiết bị mới qua LLDP hoặc tạo Switch Profile test), `wanbudget.htm` (cần
WAN bị khóa do vượt hạn mức Budget).

**Kết luận**: đã rà hết 19/19 trang còn lệch, không còn trang nào là "quên
chưa làm" — toàn bộ đều đã có lý do xác đáng để không tiếp tục (rủi ro đổi
mật khẩu thật, phần cứng không hỗ trợ, hoặc cần trạng thái thiết bị hiện
không có). Với dữ liệu và cấu hình hiện tại của thiết bị thật, dự án Vigor2927
đã đạt mức trần thực tế — 133/152 trang đối chiếu tự động, phần còn lại
không thể làm thêm mà không phải: (a) đổi mật khẩu/cấu hình thật rủi ro, hoặc
(b) thay đổi phần cứng (cắm WAN, thêm thiết bị LLDP, tạo lịch sử Policy Route
cũ).

## [2026-08-08] Backlog còn lại (đã đóng — xem mục phân loại ở trên)

- fid=112 (WAN Budget, nút Clear từng dòng): chỉ hiện khi WAN đó đã bật
  Budget VÀ đã bị khóa do vượt hạn mức — trạng thái đặc biệt, thiết bị hiện
  không rơi vào tình huống này. Không ép tạo — để tự nhiên.
- ~~fid=4062, fid=4063 (BGP, OK/Delete)~~ — **xong** (`Buoi_16_bgp.har`).
  Lý do trước đó không bắt được: `onClkOk()` chặn submit nếu "Local AS
  Number" trống (alert "illegal"), và Delete nằm ở tab "Static Network"
  (chưa bấm qua). `verify_page.py doc/bgp.sht`: khớp hoàn toàn. --tat-ca:
  126→**127/152**.
## [2026-08-08] WAN General Setup / Internet Access / LAN General Setup — xong

Chụp `Buoi_17_wan_lan.har`. Xong 3/4:
- `doc/mwangen1.htm` (WAN >> General Setup): fid=102 (link WAN1) → trang mới
  `doc/mwangen.htm`.
- `doc/mwaninet1.htm` (WAN >> Internet Access): fid=109 (nút "DHCP Client
  Option") → trang mới `doc/wanDHCPOpt.htm`.
- `doc/enet1.htm` (LAN >> General Setup): fid=2117 (nút "Details Page") →
  trang mới `doc/ENET.SHT`.

Cả 3 trang mới thêm vào `da_dung.json` (186 trang), curl 200. `verify_page.py
--tat-ca`: 127→**130/152**.

Còn thiếu: `doc/lanwired802.htm` (LAN >> Wired 802.1X, fid=2889, nút OK) —
trang tải được nhưng chưa bắt được POST khi bấm OK, có thể do validation
chặn tương tự BGP hoặc anh chưa bấm đúng nút. Cần kiểm tra lại.

## [2026-08-08] Đợt 6 trang lẻ: Port Redirection, Hotspot Profile, Bonjour, Wake on LAN, Authentication Info, Diagnose — 5/6 xong

Chụp `Buoi_18_batch.har`. Xong hoàn toàn 5/6:
- `doc/ipnatp1.htm` (NAT >> Port Redirection): fid=6 (Clear selected).
- `doc/hsportal1.htm` (Hotspot Web Portal >> Profile Setup): fid=1 (bấm index
  1) → trang mới `doc/hsportal21.htm`.
- `doc/bonjour.htm` (Applications >> Bonjour): fid=2218 (OK).
- `doc/wakeonlan.htm` (Applications >> Wake on LAN/WAN): fid=311 (OK).
- `doc/authlist.htm` (Diagnostics >> Authentication Information): fid=12
  (Clear).

`da_dung.json` 187 trang. `verify_page.py --tat-ca`: 130→**133/152**.

**Còn thiếu**: `doc/fwdiagnose.htm` (Firewall >> Diagnose) fid=2441 (nút
"<< Back" sau khi Analyze) — anh bấm Analyze (bắt được fid=2439, phụ, không
tính) nhưng nút Back chưa bấm hoặc chưa xuất hiện. Ghi chú kinh nghiệm:
hướng dẫn menu phải nêu RÕ đường dẫn đầy đủ (menu cha > menu con), không chỉ
tên trang — nhiều mục nằm trong submenu chưa mở rộng (Bonjour/Wake on LAN
nằm trong "Applications", Diagnose nằm trong "Firewall") khiến anh không tìm
thấy.

- fid=7, fid=8, fid=16 (Profile) và fid=24 (Status) — cần thiết bị mới được
  switch phát hiện qua LLDP, hoặc chủ động tạo 1 profile switch test. Thiết
  bị hiện chưa có điều kiện này. Chờ anh Huynn quyết định có muốn tạo dữ liệu
  test hay để tự nhiên.

## [2026-08-08] Menu "Objects Setting" thừa 2 mục IPv6 — trang khung dùng bản cũ, không phải reference/source

Anh Huynn chụp 2 ảnh so sánh: thiết bị thật không có "IPv6 Object"/"IPv6 Group"
trong Objects Setting, bản giả lập lại có.

**Gốc lỗi**: 5 trang khung (`menu.htm`, `l_m.htm`, `header.htm`, `act_sta.htm`,
`empty.htm` — tập `FRAME_PAGES` trong `server.py`) chưa từng được thêm vào
`da_dung.json`, nên `server.py` luôn phát bản CŨ trong `src/www/` thay vì bản
thật trong `reference/source/`. Bản cũ trong `www/menu.htm` có
`bDrayIpv6 = parseInt('1')` và `ipv6_off = 0` — sai; bản thật trong
`reference/source/menu.htm` có `bDrayIpv6 = parseInt('0')` và `ipv6_off = 1` —
đúng với thiết bị thật hiện tại.

Biến `bDrayIpv6` không chỉ gác 2 mục IPv6 Object/Group mà còn gác thêm 1 mục ở
nhánh WAN và 2 mục ở nhánh Diagnostics (điều kiện kép `bDrayIpv6&&1!=ipv6_off`)
— cùng một gốc lỗi, sửa một lần hết cả 5 chỗ.

So `diff` toàn bộ `src/www/menu.htm` với `reference/source/menu.htm`: chỉ khác
2 biến trên và token phiên `sFormAuthStr` (vốn đã khác nhau ở mọi trang trong dự
án, không phải lỗi). `header.htm` chỉ khác token `authStr`. `l_m.htm` có khác
thật (điều kiện `if('0'=="1")` sai thành `if('1'=="1")` đúng — cùng gốc
`ipv6_off`). `act_sta.htm`, `empty.htm` giống hệt.

**Sửa**: thêm cả 5 trang khung vào `da_dung.json` (176 trang). Không trang nào
trong 5 trang này có mục trong `config_store` — `render.py` phát nguyên bản
`reference/source/` không sửa gì, đúng nguyên tắc 2.2.

**Kiểm chứng**: `curl localhost:8091/menu.htm` sau khi phục vụ qua render —
`bDrayIpv6 = parseInt('0')`, `ipv6_off = 1` — khớp bằng chứng gốc. Truy vết
biểu thức `bDrayIpv6&&(...)` là kiểu comma-expression short-circuit — khi
`bDrayIpv6=0` các lệnh `insDoc` bên trong (thêm IPv6 Object/Group vào cây menu)
không chạy, dù chuỗi "IPv6 Object" vẫn còn trong mã nguồn JS (không phải lỗi —
xuất hiện y hệt trên bản thật).

`verify_page.py --tat-ca`: 123/152, không hồi quy so với trước khi sửa.

**Trạng thái**: đã xong.

## [2026-08-08] Xử lý Buoi_6_A_B_D.har — LỖI CỦA TÔI trong CHUP-HAR-BO-SUNG.md, cần chụp lại 9 mục

Anh Huynn chụp xong báo: nhiều trang không thấy nút "Import"/"Export" như tôi hướng
dẫn, chỉ thấy nút OK nên đã bấm OK thay. Kiểm tra lại `reference/source/` thì đúng —
**tôi ghi sai tên nút trong bảng hướng dẫn**. Tên nút thật trên các trang Port
Redirection / Open Ports / Static Route / Bind IP to MAC / LAN to LAN / Remote
Dial-in User / Hotspot Profile Setup là **"Backup"** (tải cấu hình xuống) và
**"Restore"** (tải file lên), không phải "Export"/"Import". Đã sửa lại
`CHUP-HAR-BO-SUNG.md` cho đúng tên nút thật.

### Kết quả chạy verify sau khi trích Buoi_6_A_B_D.har
`python tools/extract_har.py` → 67 file cập nhật, cgi-map 208→213 endpoint (5 hợp
đồng mới: `acontrol.cgi`, `snmp.cgi`, `ipnat.cgi→ipnatp.htm`,
`V2X00.cgi fid=1211→XLoCfGen.HTM`, `V2X00.cgi fid=1214→XCARootG.HTM`).
`python tools/verify_page.py --tat-ca` → **139/152** (tăng từ 136/152).

### Đợt D (trang con Certificate) — THÀNH CÔNG, không cần chụp lại
7 trang con đã lọt vào HAR và là trang hoàn toàn mới trong `reference/source/`:
`XSelfG.HTM` (D1), `XLoCfGen.HTM`, `XLoCfMn.htm` (D5), `XLoCfIm1.htm` (D4 — tên
thật khác tên tôi đoán `XLoCaImport.htm`), `XCaCfMn.HTM` (D10), `XCaCfIm.htm`
(D8 — tên thật khác tên tôi đoán `XCaImport.htm`), `XCARootG.HTM` (D7/D9 — tên
thật khác tên tôi đoán `XCaCfExport.htm`). Đã đóng D1, D4, D5, D7, D8, D9, D10.

### Đợt A — 2/3 xong
- A1 Management (`acontrol.cgi`) — CÓ, xong.
- A2 SNMP (`snmp.cgi`) — CÓ, xong.
- A3 Filter Setup (`ipfset.cgi`) — **CHƯA**. HAR chỉ có GET mở trang `ipf.cgi`,
  không có POST `ipfset.cgi`. Trang có form `action="/cgi-bin/ipfset.cgi"
  method="post"` bình thường — cần mở Firewall >> Filter Setup, không sửa gì,
  cuộn xuống cuối bấm nút **OK**.

### Đợt B — CHÍNH THỨC BỎ QUA theo yêu cầu anh Huynn (2026-08-08)
Anh Huynn quyết định: tính năng Backup/Restore firmware hay file cấu hình thì bỏ
qua. Cả 8 mục dưới đây đều là backup/restore file cấu hình → xếp vào nhóm "cố ý
bỏ", giống nhóm Wizard/Reboot/Firmware đã bỏ trước đó (xem STATUS.md).

| # | Trang | Endpoint | Lý do thuộc nhóm bỏ |
|---|---|---|---|
| B1 | NAT >> Port Redirection | `/port_redirection<ngày>.bak` | Backup file cấu hình |
| B2 | NAT >> Open Ports | `/open_port<ngày>.bak` | Backup file cấu hình |
| B3 | Routing >> Static Route | `/v4_staticroute<ngày>.bak` | Backup file cấu hình |
| B4 | LAN >> Bind IP to MAC | `/upload_ipbind.cgi` | Restore file cấu hình |
| B5 | VPN >> LAN to LAN | `/lan2lanupload.cgi` | Restore file cấu hình |
| B6 | VPN >> Remote Dial-in User | `/dialinupload.cgi` | Restore file cấu hình |
| B7 | Hotspot Web Portal >> Profile Setup | `/upload_hotspot.cgi` | Backup/Restore file cấu hình |
| B8 | Objects Setting >> Objects Backup/Restore | `/cgi-bin/ipobj.cgi` | Backup/Restore file cấu hình |

Cấu trúc HTML tĩnh của 8 trang này đã đúng (T1-T3 đạt qua reference/source). Chỉ
riêng hành vi khi bấm nút Backup/Restore là chưa có hợp đồng — cố ý không làm,
không phải sót. Nút vẫn hiển thị trên bản giả lập, chỉ chưa có response thật khi bấm.

### Đợt D còn thiếu 2 mục (không khẩn, có thể bỏ)
- D2 Schedule (link mở 1 dòng lịch cụ thể — trang schedu1.htm chỉ mới có lại nội
  dung danh sách, chưa có click vào 1 dòng để xem trang con).
- D3/D6 Local/Trusted CA "View" một chứng chỉ cụ thể (`fid=221`/`fid=334`) —
  chưa có chứng chỉ nào trong danh sách để bấm View trên thiết bị thật hiện tại
  (hoặc có nhưng chưa bấm). Không khẩn, hoãn.

### Lưu ý an toàn — Bind IP to MAC có thể đã đổi cấu hình thật
Trong HAR thấy 2 lần POST tới `ipbmac.htm` với `sIpBndMacEnable` đổi từ `0`
sang `1` (`webchange=1`) — có vẻ khi bấm OK ở trang LAN >> Bind IP to MAC, ô
"Enable" đã bị tick lên. Nhờ anh Huynn kiểm tra lại trên thiết bị thật xem tính
năng Bind IP to MAC có đang bật ngoài ý muốn không, tắt lại nếu cần.

### Còn tồn từ trước (không liên quan Buoi_6): 3 mục vẫn thiếu
- C1 Online Status >> Physical Connection: `online1.cgi`, `online2.cgi`, `goinet.cgi` — chưa có trong HAR nào.
- C2 USB Application >> File Explorer: `usbwebget.cgi`, `usbwebset.cgi` — chưa có.
- Trạng thái: đang chờ anh Huynn chụp lại đợt A3 + B (8 mục) + tùy chọn C1/C2.

## [2026-08-08] Tự chụp trực tiếp qua Chrome (thiết bị thật) — 3 phát hiện quan trọng, 1 sự cố

Dùng Claude in Chrome nối sẵn tới 192.168.1.1 (đã đăng nhập từ trước) để tự đo,
không cần anh Huynn thao tác. Kết quả:

**A3 Filter Setup — bảng cũ ghi SAI CẢ endpoint.** Nút "OK" tôi tưởng nằm ngay
trên trang Filter Setup và gọi thẳng `ipfset.cgi` (POST) — SAI. Thực tế Filter
Setup là trang DANH SÁCH 12 link "1." → "12." (mỗi số là 1 Filter Set), bấm số
nào thì GET `/cgi-bin/ipfset.cgi?ipfset=N` (302 → trang con `/doc/ipfeds.sht`
"Edit Filter Set"), trang con NÀY mới có nút OK thật, bấm OK thì POST
`/cgi-bin/ipfeds.cgi` (302 → lại `/doc/ipfeds.sht`). Tôi đã bấm số "1." rồi OK
(không đổi giá trị nào) và xác nhận qua network log: `POST ipfeds.cgi -> 200`.
**Còn thiếu:** nội dung file `reference/source/doc/ipfeds.sht` — cố lấy qua
JS nhưng kênh trả chữ của công cụ trình duyệt giới hạn ~1000 ký tự/lần, trang
này 16KB nên không lấy trọn được. Cần 1 file HAR nhỏ (2 cú bấm: Filter Setup →
bấm "1." → bấm OK, không đổi gì) — nay đã biết chính xác đường đi nên rất
nhanh.

**D2 Schedule — XONG (2026-08-08).** Đo lại lần 2 phát hiện lần đo đầu SAI:
bảng Schedule KHÔNG rỗng, luôn có sẵn 15 dòng trống (Index 1-15) — bằng
chứng gốc `reference/source` xác nhận biến `aryAllDate` luôn có đúng 15 phần
tử mặc định. Anh Huynn chụp `Buoi_8_schedule.har`: bấm số "1" → trang con
thật là `doc/scheduls.sht` (có "s" cuối, KHÁC tên tôi đoán ban đầu
`schedule.sht`) → đã trích vào `reference/source/`, thêm hợp đồng
`GET v2x00.cgi?fid=3&b0=1 -> scheduls.sht` vào `cgi-map.json`, nối vào
`config_store` và `da_dung.json`.

**Phát hiện thêm 1 báo động giả (mẫu thứ 5) khi đối chiếu:** `verify_page.py`
vẫn báo thiếu tài nguyên `schedule.sht` (không có "s"). Đọc lại
`reference/source/doc/schedu1.htm`: chuỗi này nằm trong hàm
`function ccl(){document.location.href="schedule.sht";}` — hàm này xuất
hiện ĐÚNG 1 LẦN trong toàn file (xác nhận qua `grep -c`), không có
`onclick=ccl()` hay bất kỳ nút nào gọi tới. Tức là mã JS CHẾT (dead code),
không phần tử nào trên trang thật gọi tới, không bao giờ chạy được. Không
phải chỗ thiếu bằng chứng — đóng vĩnh viễn. `verify_page.py` chưa phát hiện
được mẫu này (hàm định nghĩa nhưng không ai gọi) — cân nhắc bổ sung sau nếu
gặp lại ở trang khác.

**C1 Online Status >> Physical Connection — ĐÓNG HẲN, không phải thiếu bằng
chứng.** Đọc lại `reference/source/doc/online1.sht`: `online1.cgi`,
`online2.cgi`, `goinet.cgi` không phải endpoint AJAX tự gọi như bảng cũ đoán,
mà là 3 link ẩn "Dial ISDN / Drop B1 / Drop B2" nằm trong khối
`class="BTHide" style="display:none"` — điều khiển cổng ISDN. Vigor2927
KHÔNG có cổng ISDN nên khối này không bao giờ hiện, 3 link không bao giờ được
bấm trên thiết bị thật. Không phải chỗ thiếu — đóng vĩnh viễn, gỡ khỏi danh
sách việc cần làm.

**C2 USB Application >> File Explorer — ĐÓNG, theo quyết định anh Huynn
(2026-08-08).** Cổng USB của router không dùng tới trong thực tế. Trang hiện
tại đã ĐÚNG với thiết bị thật: "USB Disk Connection Status: No Disk
Connected" (đã xác nhận qua Chrome). Anh Huynn quyết định: **chỉ cần giao
diện đúng như vậy là đủ, không cần giả lập phần xử lý** (liệt kê/xoá/đổi
tên/tải file — `usbwebget.cgi`/`usbwebset.cgi`). Không cần chụp thêm, không
cần cắm USB. Coi như đã đạt mức 4 cho trạng thái "không có đĩa" — nếu sau
này có nhu cầu mô phỏng lúc CÓ đĩa cắm thì làm lại từ đầu, cần HAR mới.

**A3 Filter Setup — XONG (2026-08-08), verify tăng 139→140.** Anh Huynn chụp
`Buoi_7_filter.har`, trích được cả 3 file: `doc/ipf.sht`, `doc/ipfeds.sht`
(Edit Filter Set), và bonus `doc/ipfedr.sht` (Edit Filter Rule — sâu hơn dự
kiến, không có trong bảng gốc). 3 endpoint mới vào `cgi-map.json`: GET
`ipfset.cgi?ipfset=N`, POST `ipfeds.cgi`, POST `ipfedr.cgi`.

**Sửa lỗi hệ thống phát hiện khi nối A3 vào — SWEEP đã tìm thêm 15 trang con
cùng lỗi.** Khi nối `doc/ipfeds.sht` vào kho, phát hiện `init_config.py` CHỈ
quét trang có node riêng trong `menu-tree.json` — mọi "trang con" chỉ tới
được qua link động (bấm số Set, bấm View chứng chỉ...) đều bị bỏ sót, không
vào `config.json`, và **quan trọng hơn**: không có trong `da_dung.json` nên
`server.py._serve_cgi()` không áp dụng đúng hợp đồng 302 — request rơi về
nhánh dự phòng `www/_pages/` cũ, không đọc kho cấu hình. Tức là dù có bằng
chứng, các trang con này VẪN CHƯA đạt mức 4 thật sự.

Sửa `tools/init_config.py`: thêm vòng quét bổ sung — mọi `trang_dich` trong
`cgi-map.json` (status 302, đường dẫn `doc/`) mà không có node riêng trong
menu-tree đều được đưa vào kho. Chạy lại, quét ra tổng cộng **16 trang con**
cần thêm vào `da_dung.json` (không chỉ 2 trang Filter Setup vừa chụp, mà cả
9 trang Certificate/D-series đã chụp ở Buoi_6 nhưng bị sót từ trước, cộng 5
trang khác đã có bằng chứng lâu nay nhưng chưa từng lên mức 4:
`8021x.htm`, `DDNS.htm`, `ipnatp.htm`, `loginset.htm`, `openvpn.htm`,
`reboot.sht`, `reboot1.sht`). Đã thêm đủ 16 trang vào `da_dung.json`.

Test tay: khởi server, gọi `GET /cgi-bin/ipfset.cgi?ipfset=1` → trả đúng
`302 Location: /doc/ipfeds.sht`, tải `/doc/ipfeds.sht` → có nội dung "Edit
Filter Set" thật. Xác nhận mức 4 hoạt động cho trang con.
Đã thử lấy nội dung `doc/ipfeds.sht` (16KB) qua kênh JS của trình duyệt nhưng
kênh này giới hạn cứng khoảng 500 ký tự mỗi lần trả chữ về — không đủ cho 1
trang 16KB dù đã thử nhiều cách (chia nhỏ, gắn vào DOM rồi đọc qua công cụ
đọc trang khác). Đường đi ĐÃ CHẮC CHẮN đúng (xác nhận qua network log thật):
mở Firewall >> Filter Setup → bấm số **"1."** → trang con "Edit Filter Set"
hiện ra → bấm **OK** (không đổi giá trị nào) → lưu HAR "with content" đặt tên
`Buoi_7_filter.har` → tôi trích nốt là xong, khép lại toàn bộ 22 điểm T4 ban đầu
(trừ 10 mục cố ý bỏ và D2/C2 đang chờ quyết định).

## [2026-08-08] LỖI THẬT NẶNG — lỗi định tuyến POST dùng chung .cgi đa năng, do anh Huynn phát hiện

Anh Huynn tự kiểm tra thủ công: LAN >> General Setup, bấm nút **"DHCP Server
Option"**. Thiết bị thật chuyển sang trang "DHCP Server Customized Status".
Bản giả lập: **không có phản ứng gì**.

### Nguyên nhân gốc — không chỉ 1 trang, mà là lỗi hệ thống

Nhiều trang DrayTek dùng CHUNG một `.cgi` đa năng (`v2x00.cgi`, `wan.cgi`,
`qos.cgi`, `cgiswm.cgi`, `fwuser.cgi`...) để xử lý POST, phân biệt trang đích
bằng GIÁ TRỊ của trường ẩn `fid` gán qua JavaScript
(`f.fid.value=2324;f.submit();`) — không qua `href`/`src`/`action` tĩnh.

`tools/extract_har.py` (trước sửa) khi ghi hợp đồng cho POST chỉ lưu TÊN các
tham số gửi lên (`tham_so_post`), KHÔNG lưu GIÁ TRỊ của `fid`. Hậu quả:
`server.py.tim_trang_goc()` so khớp bằng tập tham số — mọi bản ghi POST tới
CÙNG một `.cgi` đều có tập tham số RỖNG như nhau (vì fid nằm ở body, không ở
URL) nên khớp **BẤT KỲ** request POST nào, và do lỗi so sánh `len(rpr) >
tot_n` không bao giờ vượt qua sau lần khớp đầu, **bản ghi ĐẦU TIÊN trong file
luôn thắng — bất kể fid thật là gì**. Với `fid=2324` (DHCP Server Option,
chưa từng có bằng chứng), server chọn nhầm bản ghi của `doc/enet1.htm`
(chính trang đang đứng) → redirect về CHÍNH NÓ → nhìn như "không phản ứng gì".

**Đây không chỉ là lỗi hiển thị — mọi POST tới các `.cgi` đa năng có khả năng
bị điều hướng SAI sang trang KHÁC HẲN nếu fid đó không trùng bản ghi ĐẦU
TIÊN**, im lặng không báo lỗi. May mắn phần lớn các trang đã kiểm bằng tay
trước đây đều KHÔNG bấm Apply thật (theo đúng nguyên tắc an toàn), nên lỗi
này chưa lộ ra trong toàn bộ đợt đối chiếu 149 trang trước đó.

### Đã sửa — 2 file

1. **`tools/extract_har.py`**: thêm `THAM_SO_DIEU_HUONG` (fid, iAct, sAct,
   iPageIdx, iProfileIdx, opmode, iInetWanIdx...). Với POST không có query
   trên URL, nhúng GIÁ TRỊ thật của các tham số này (nếu có trong body) vào
   `url_chuan`, y hệt cách GET đã làm — để hai bên dùng chung một cơ chế so
   khớp.
2. **`devices/vigor2927/src/server.py`**: `url_sang_goc()` giờ lưu thêm
   METHOD của từng bản ghi; `tim_trang_goc(method, path, params)` nhận thêm
   tham số `method` và LỌC đúng method trước khi so khớp tham số — không còn
   trộn lẫn bản ghi GET và POST của cùng một endpoint. Cập nhật `_serve_cgi`,
   `do_GET`, `do_POST` truyền đúng method.

Chạy lại `extract_har.py`, test tay xác nhận:
- `fid=2324` (chưa có bằng chứng) → nay trả **200 rỗng, không còn redirect
  sai** — thất bại TRUNG THỰC thay vì lặng lẽ sai.
- `fid=2116` (LAN General Setup tự Apply) → `302 Location: /doc/enet1.htm` ĐÚNG.
- `fid=126` (Bind IP to MAC) → `302 Location: /doc/ipbmac.htm` ĐÚNG.

`verify_page.py --tat-ca` sau sửa: vẫn 140/152 (không hồi quy — lỗi này T4
không bắt được, xem mục T5 dưới đây).

### Thêm phép kiểm T5 vào verify_page.py — bắt được lỗi CÙNG LOẠI trên diện rộng

Theo đúng nguyên tắc "lỗi cùng kiểu này còn ở trang nào khác không", đã thêm
`dieu_huong_fid()` — quét MỌI điểm `bien.fid.value=N` trong trang gốc, đối
chiếu với `cgi-map.json`. Kết quả quét toàn bộ 152 trang:

**34 trang có ít nhất 1 hợp đồng điều hướng còn thiếu (T5), tổng cộng 51
điểm.** Sau khi thêm T5, verify tụt xuống **118/152** — KHÔNG PHẢI hồi quy
chức năng, mà là lộ ra bằng chứng còn thiếu vốn đã tồn tại từ trước, chỉ là
trước đây không công cụ nào phát hiện được (và server còn định tuyến sai âm
thầm, che giấu luôn cả triệu chứng).

Danh sách 34 trang (ưu tiên thấp — không phải trang menu chính, là các nút
điều hướng phụ; KHÔNG cần chụp gấp, để dành làm dần theo từng đợt):
`authlist.htm`, `bgp.sht`, `bonjour.htm`, `dnstbl.htm`, `enet1.htm` (gồm
đúng nút DHCP Server Option anh vừa báo), `fwdiagnose.htm`, `hsportal1.htm`,
`ipnatp1.htm`, `lanmirr.htm`, `lanwired802.htm`, `mnatptrg1.htm`,
`mwangen1.htm`, `mwaninet1.htm`, `policyrt1.htm`, `ptknock.htm`,
`qosgen1.htm` (7 điểm — nhiều nhất), `radiususer1.htm`, `swmaltlog1.htm`,
`swmgprf1.htm`, `swmgrp1.htm`, `swmstatus.htm`, `trffgraph1.htm`,
`wakeonlan.htm`, `wanbudget.htm` (4 điểm), `XCARootG.HTM`, `XLoCfGen.HTM`,
`XSelfG.HTM`.

### DHCP Server Option — XONG (2026-08-08)

Tự bấm thử qua Chrome trên thiết bị thật, xác nhận đúng trang đích
`doc/DHCPOpt.htm` (khớp ảnh anh gửi). Anh Huynn chụp `Buoi_9_dhcpopt.har`
(lần đầu hướng dẫn sai — bảo bấm F5 làm mất trạng thái trang, đã sửa hướng
dẫn và chụp lại đúng). Trích được `doc/DHCPOpt.htm`, thêm hợp đồng
`POST v2x00.cgi?fid=2324 -> doc/DHCPOpt.htm`, nối `config_store` +
`da_dung.json`. Test tay xác nhận: POST fid=2324 → `302 Location:
/doc/DHCPOpt.htm`, nội dung đúng "DHCP Server Customized Status".

### Sửa thêm 1 lỗi trong chính T5 vừa thêm — so khớp bị lệch dấu `/`

Khi kiểm tra lại, thấy T5 vẫn báo thiếu cả `fid=2116` (nút OK của chính
enet1.htm) dù hợp đồng ĐÃ CÓ trong cgi-map.json. Nguyên nhân: `endpoint`
trong cgi-map.json luôn có dấu `/` đầu (`/cgi-bin/v2x00.cgi`), còn `action`
lấy từ thẻ `<form>` trong trang qua `dieu_huong_fid()` bị bỏ dấu `/` đầu khi
chuẩn hoá — hai bên không bao giờ khớp được, T5 tự báo sai hàng loạt. Đã sửa
chuẩn hoá nhất quán (bỏ `/` đầu ở CẢ HAI phía). Sau sửa: 34 trang/51 điểm
→ **29 trang, verify 118→123/152** — nhiều điểm trong 51 điểm trước là báo
động giả do chính lỗi này, không phải thiếu bằng chứng thật.

**Trạng thái: DHCP Server Option đã xong. Còn 29 trang có điểm T5 thật sự
thiếu bằng chứng — chờ anh Huynn quyết định thứ tự ưu tiên chụp bổ sung,
không gấp.**

## [2026-07-25] Tái cấu trúc thư mục
- Ghi chú: di chuyển sim_vigor2927 → devices/vigor2927/src. Không xóa được thư mục sim_vigor2927 rỗng do quyền sandbox — cần anh Huynn xóa thủ công nếu muốn dọn sạch.
- Trạng thái: không chặn tiến độ

## [2026-07-25] Chuyển captures/ về reference/
- Đã chuyển: 730 file .html → reference/html/ ; 220 file json/txt/css/b64 → reference/raw/
- Đã sửa chỗ ghi crawl: server.py (POST /save) và collector.py nay ghi vào src/captures_new/, không ghi vào reference/ (giữ đúng nguyên tắc 2.3)
- Cần anh Huynn xóa thủ công (sandbox không có quyền xóa):
  - devices/vigor2927/src/captures/ (thư mục rỗng còn sót)
  - devices/vigor2927/src/captures_new/zz_test.txt (file thử endpoint /save)
- Còn thiếu: reference/js/ và reference/screenshots/ đang rỗng
- Trạng thái: đang chờ

## [2026-07-25] THIẾU BẰNG CHỨNG GỐC — chặn toàn bộ tiến độ
- Phát hiện: 730 file HTML đã thu KHÔNG phải mã nguồn gốc. Chúng là ảnh chụp DOM sau khi
  JavaScript đã chạy, và bị tiện ích trình duyệt chèn thêm code (chrome-extension://,
  data-yd-*, class ng-scope). Đã mất `<!DOCTYPE html>`, thẻ `<title>`, khối `var webcfg={...}`
  và toàn bộ khối `gWebCfg*`.
- Đã xử lý: đổi tên reference/html/ → reference/rendered/ để không ai nhầm là mã nguồn.
  Tạo reference/source/ (mã nguồn gốc) và reference/har/. Xem reference/README.md.
- Thiếu 1: reference/source/ đang RỖNG. Không có mã nguồn gốc thì không có căn cứ cấu trúc
  (nguyên tắc 2.2) — không được lấy tên input, cây DOM, tên hàm JS từ rendered/.
- Thiếu 2: reference/har/ đang RỖNG. Không có hợp đồng response cho bất kỳ endpoint nào
  (nguyên tắc 2.4).
- Hệ quả: CHƯA DỰNG ĐƯỢC spec/menu-tree.json, vì cây menu nằm trong khối `gWebCfg*` mà bản
  rendered đã mất. Không thể suy ra từ rendered/, và suy đoán là vi phạm nguyên tắc 2.1.
- Cần: anh Huynn lấy mã nguồn gốc từ thiết bị (View Source / tải trực tiếp, KHÔNG qua
  SingleFile hay extension), và ghi HAR khi thao tác thật trên thiết bị.
- Trạng thái: ĐÃ GIẢI QUYẾT MỘT PHẦN ngày 2026-07-25 — xem mục dưới.

## [2026-07-25] Đã trích bằng chứng gốc từ phan1.har
- Kiểm chứng trước khi trích: 200 entry, 135 có `response.content.text` (67.5%), rỗng 32.5% —
  dưới ngưỡng 50% nên tiếp tục. Số rỗng chủ yếu là 404 (25) và 302 redirect (22), tức không có
  body thật, KHÔNG phải bị lược nội dung.
- Đã trích 45 file vào reference/source/: 22 .htm, 8 .js, 7 .png, 3 .cgi, 2 .css, 2 .sht, 1 .gif.
  Kèm reference/source/_HAR-INDEX.json ghi URL gốc, method, status, mimeType của từng file.
- Bỏ qua: 64 response rỗng, 2 request fonts.googleapis.com. Không có request chrome-extension
  hay metadata.js/injectScript.js/sidebar.js trong file HAR này.
- ĐÃ CÓ menu.htm, là mã gốc sạch: có `<!DOCTYPE>`, `<title>`, không có chrome-extension/ng-scope.
  Chứa đầy đủ cây menu qua insFld/insDoc (48 nhóm, 275 mục con, 271 link MainFunction).
  Nạp /js/tree.min.js?094907 và /css/tmp_m.min.css?094907 — cả hai đã có trong source/.
- Còn thiếu 1: chỉ 2/169 mục con có nội dung trang thật (Quick Start Wizard, Hotspot Profile Setup).
  19/21 nhóm menu chưa có body trang nào. Nguyên nhân: đa số .cgi trong HAR trả 302 redirect.
- Còn thiếu 2: cần HAR các đợt tiếp theo, mỗi đợt bấm qua một nhóm menu để lấy body trang thật.
  Ưu tiên theo thứ tự menu: WAN, LAN, NAT, Firewall, Applications, System Maintenance.
- Còn thiếu 3: reference/js/ và reference/screenshots/ vẫn rỗng.
- Ghi chú: src/ hiện vẫn là bản cũ dựng từ rendered/ (DOM sau JS). Chưa đối chiếu với source/,
  chưa sửa gì trong src/ (đúng yêu cầu).
- Trạng thái: ĐÃ XONG ngày 2026-07-26 — xem mục dưới.

## [2026-07-26] Đã đủ bằng chứng gốc — 153/153 mục hiển thị
- 6 file HAR (phan1, thunghiem, Buoi_1..4), 1557 entry. reference/source/ có 263 file.
- spec/cgi-map.json: 208 endpoint, 207 có trang đích.
- Mọi mục menu hiển thị trên thiết bị đều có mã nguồn gốc. KHÔNG còn thiếu gì.

## [2026-07-26] LỖI TỰ GÂY — dựng cây menu bằng regex, sai 4 lần liên tiếp
- Bối cảnh: `tools/build_menu_tree.py` bản đầu phân tích JS của menu.htm bằng regex + ngăn xếp
  đếm ngoặc, để suy ra mục nào hiển thị. JS của DrayTek là bản tối giản, quá nhiều dạng cú pháp.
- Bốn lần sai, mỗi lần một dạng khác:
  1. Khi khớp token `gFld(`/`gLnk(` thì nhảy qua luôn dấu `(` → lệch độ sâu ngoặc → mất điều
     kiện bao ngoài → 20+ nhóm bị đánh "hiện" sai.
  2. Không xử lý ternary có ngoặc `COND ? ( ... ) : ...` → USB Modem, ISDN sai.
  3. Không xử lý ternary KHÔNG ngoặc `COND ? A : B`.
  4. Không xử lý short-circuit `COND || ( ... )`.
  Ngoài ra còn một lỗi URL: `menu.htm` có URL nối chuỗi `"...="+bg.authStr+"&fid=2016..."`,
  regex cắt ở dấu nháy giữa chuỗi làm mất phần `fid` (3 mục: Configuration Backup, Webhook,
  Configuration Export).
- CÁCH SỬA TRIỆT ĐỂ (đã áp dụng): KHÔNG phân tích cú pháp nữa mà **THỰC THI thật** đoạn JS
  dựng cây bằng Node, với môi trường giả lập (stub gFld/gLnk/insFld/insDoc, `bg` = frame cha
  chứa các cờ SHOW_*, `top.gettext` = hàm đồng nhất). Thiết bị dựng cây thế nào thì thu đúng thế ấy.
  Kết quả: mọi node trong menu-tree.json đều THỰC SỰ hiển thị, không cần trường `hien_thi` nữa.
- Sai lệch phát hiện khi đối chiếu bản regex với bản thực thi:
  - 11 mục bị đánh "hiện" nhầm (trước đó tôi mới biết 5): AP Map, Traffic Graph (fid=2098),
    LAN DNS, Local 802.1X General Setup, RADIUS, VLAN / Rate Control, Online Status (fid=168),
    Modem Code Upgrade, Password Encryption, USB Disk Status, Multi-PVC/VLAN.
  - 2 mục bị đánh "ẩn" nhầm — tức bằng chứng đang thiếu mà không biết: LAN >> Link Aggregation
    (fid=2901), Routing >> Load-Balance/Route Policy (fid=2087). May mắn cả hai đã vô tình
    chụp được trong các đợt HAR nên không phải chụp lại.
- BÀI HỌC: với JS tối giản, đừng suy luận bằng regex — hãy chạy nó. Áp dụng cho mọi thiết bị sau.
- Trạng thái: đã xử lý xong

## [2026-07-26] Nền móng mức 4 — đã dựng
- Đã có: config.json (NVRAM), config_store.py, render.py, da_dung.json, tools/init_config.py,
  tools/verify_page.py. server.py phục vụ hai tầng (trang mới theo đường dẫn gốc / trang cũ _pages).
- Kiểm chứng mức 4 chạy đúng: POST `iActSubnum=3` vào /cgi-bin/v2x00.cgi (có `webchange`) →
  ghi config_store → lan sang 3 trang (doc/enet1.htm, doc/ipstatrt.sht, doc/cvmSetup.htm) →
  302 sang /doc/enet1.htm → trang render lại hiện `iActSubnum = 3`.
- verify_page.py --tat-ca: 152/152 trang khớp hoàn toàn với bản gốc.
- CẦN ANH HUYNN XOÁ THỦ CÔNG (sandbox không có quyền xoá):
  35 file rỗng 0B trong devices/vigor2927/src/www/_pages/ (yêu cầu nói 28, đếm thực tế là 35).
  Lệnh: trong PowerShell, tại thư mục src\www\_pages, chạy
      Get-ChildItem -File | Where-Object {$_.Length -eq 0} | Remove-Item
- Chưa xoá 117 route thuộc nhóm ẩn — đúng yêu cầu, chúng sẽ tự hết tác dụng khi _pages/ được thay hết.
- Trạng thái: nền móng xong, chưa dựng trang nội dung nào

## [2026-07-26] THIẾU BẰNG CHỨNG — trang con của nhóm Certificate Management
Dựng xong 5 trang chính, nhưng các nút trong trang mở tiếp những trang chưa có trong reference/source/.
Cần anh Huynn bấm từng nút rồi ghi HAR.

| Trang cha | Nút / hàm | URL nó gọi | Trạng thái |
|---|---|---|---|
| Local Certificate (`XLoCf1.HTM`) | View (`x509view`) | `/cgi-bin/V2X00.cgi?fid=221&certidx=<N>` | THIẾU |
| Local Certificate | Import (`x509import`) | `/doc/XLoCaImport.htm` | THIẾU |
| Local Certificate | (dialog quản lý) | `/doc/XLoCfMn.htm` (biến `myUrl`) | THIẾU |
| Trusted CA (`XCaCf.HTM`) | View (`x509view`) | `/cgi-bin/V2X00.cgi?fid=334&certidx=<N>` | THIẾU |
| Trusted CA | Root View (`x509RootView`) | `/cgi-bin/V2X00.cgi?fid=333&certidx=<N>` | THIẾU |
| Trusted CA | Import (`X509import`) | `/doc/XCaImport.htm` | THIẾU |
| Trusted CA | Root Download (`x509RootDownload`) | `/doc/XCaCfExport.htm` | THIẾU |
| Trusted CA | (dialog quản lý) | `/doc/XCaCfMn.HTM` (biến `myUrl`) | THIẾU |
| Self-Signed (`XSelfV.HTM`) | Regenerate | `XSelfG.HTM` | THIẾU |
| Local Certificate | Generate (`x509request`) | `/cgi-bin/V2X00.cgi?fid=331&certidx=<N>` | THIẾU |

- Ghi chú: `fid=221 / 331 / 333 / 334` đều dùng `V2X00.cgi` CHỮ HOA và có tham số `certidx`.
- Các trang chính vẫn hoạt động đầy đủ; chỉ khi bấm các nút trên mới ra trang trống.
- Trạng thái: đang chờ chụp bổ sung

## [2026-07-26] LỖI TỰ GÂY — lan truyền config mù quáng suýt phá điều hướng
- Bản đầu `config_store.dat()` lan giá trị sang MỌI trang có cùng tên khoá.
- Phát hiện khi dựng Certificate Management: biến `myUrl` có ở 4 trang nhưng mỗi trang một giá trị
  khác hẳn (`/doc/XLoCfMn.htm`, `/doc/XCaCfMn.HTM`, `/cgi-bin/snmp.cgi?...`,
  `/diagnose_example_input_file.csv`). Đây là biến ĐIỀU HƯỚNG cục bộ, không phải NVRAM.
  Lan truyền sẽ ghi đè và làm hỏng nút của trang khác.
- Đã sửa: chỉ lan truyền khi trang đích có cùng tên VÀ **cùng giá trị cũ**. Tên dùng chung thật
  (`sPresetModel`='2927' ở 19 trang, `sLTEmodulename`='LTE' ở 29 trang) đều cùng giá trị cũ nên
  vẫn lan đúng; `myUrl` khác giá trị nên không lan.
- Kiểm chứng: `dat('doc/status.htm','sPresetModel',...)` lan sang 18 trang;
  `dat('doc/XLoCf1.HTM','myUrl',...)` lan sang 0 trang.
- Cũng sửa `ghi_post()` nhận thêm `trang_goc` để chỉ ghi các tên THUỘC trang đích của POST.
- Trạng thái: đã xử lý xong

## [2026-07-26] LỖI NGHIÊM TRỌNG — công cụ verify báo "khớp" trong khi thực tế lệch
- Anh Huynn so tay 3/5 trang Certificate Management với thiết bị thật và tìm ra lỗi mà
  verify_page.py hoàn toàn không thấy. Đây là lỗi nguy hiểm nhất từ đầu dự án: công cụ
  kiểm chứng cho cảm giác an toàn giả.
- NGUYÊN NHÂN: bản verify cũ chỉ so VĂN BẢN TĨNH giữa bản render và bản gốc. Nhưng render.py
  chỉ thay giá trị, không làm mất gì — nên hai bên luôn giống nhau. "0 lệch" là đúng nhưng
  vô nghĩa: nó đo sai thứ.
- BA LỖI THẬT và nguyên nhân gốc:
  1. Thiếu cột CA + khối "Storage for Certificate" + hàng dữ liệu (XLoCf1.HTM, XCaCf.HTM):
     bảng do JS dựng (`innerHTML=`), dữ liệu từ `<script src="/cgi-bin/certificatedata.cgi">`
     (chứa aryajaxlocca/aryajaxrootca/aryajaxtrustca và memoryUsage=4 = "Storage Usage 4%").
     Server phục vụ script này bằng bản cũ `_pages/p2_063.html` — bản đó BỊ CHÈN
     `<!DOCTYPE html>` ở dòng 1 → LỖI CÚ PHÁP JS ngay ký tự đầu → mọi biến dữ liệu undefined
     → bảng rỗng. Content-Type cũng sai (text/html thay vì application/x-javascript).
  2. "Not found: /cgi-bin/XgCert.HTM" — KHÔNG phải lỗi hoa/thường. XBakRest.htm có
     `<FRAME src=XgCert.HTM>` là ĐƯỜNG DẪN TƯƠNG ĐỐI. Thiết bị thật trả 302 → URL cuối là
     /doc/XBakRest.htm → tương đối = /doc/XgCert.HTM. Server tôi trả thẳng 200 tại /cgi-bin/...
     → tương đối = /cgi-bin/XgCert.HTM → 404. Tôi đã VI PHẠM nguyên tắc 2.4 (cgi-map ghi rõ
     status=302 mà tôi trả 200).
- ĐÃ SỬA: (a) .cgi dữ liệu luôn phục vụ từ bản gốc + Content-Type application/x-javascript;
  (b) .cgi trang trả đúng 302 theo cgi-map.json → đường dẫn tương đối tự đúng.
- MỨC ĐỘ LAN RỘNG (trên 152 trang): 46 trang dựng bảng bằng JS; 7 trang nạp script .cgi dữ liệu
  (certificatedata/usbweb/websyslog — websyslog.cgi cũng bị chèn DOCTYPE); 104 trang dùng
  `<textarea id="...init">` chứa dữ liệu SSI; 15 trang .sht; 17 trang có đường dẫn tương đối.
- verify_page.py NÂNG CẤP 4 tầng: T1 cấu trúc tĩnh — T2 bảng & khối (số cột, tiêu đề cột,
  số hàng, section, nút trong/ngoài bảng) — T3 CHẠY THẬT JS bằng Node (nạp cả <textarea> SSI,
  file .js và .cgi dữ liệu) — T4 tài nguyên trang gọi tới (phân biệt hoa/thường, cảnh báo
  đường dẫn tương đối).
- CON SỐ THẬT: 59/152 khớp hoàn toàn, 93 còn lệch (173 điểm). Phân bố: T1=0, T2=0, T3=0, T4=173
  → cấu trúc và hành vi JS đều đúng, toàn bộ lệch là trang con/tài nguyên CHƯA CÓ BẰNG CHỨNG.
- VIỆC KẾ TIẾP: xuất danh sách 173 tài nguyên thiếu thành bảng chụp HAR bổ sung.
- Trạng thái: đã sửa 3 lỗi, CHƯA COMMIT (chờ anh Huynn xác nhận)

## [2026-07-26] Dựng nhóm User Management (4 trang) — đạt mức 4
- 4 trang: usergenset.htm (fid=0), userprof1.htm (fid=1), usergrp1.htm (fid=2), userstatus.htm (fid=3).
  Cả 4 đều POST tới /cgi-bin/fwuser.cgi. verify 4 tầng: 4/4 DẠT (T1=T2=T3=T4=0).
- Kiểm chứng mức 4 qua HTTP: GET .cgi → 302 → /doc/...; POST iWebAuth=1&sPolicyType=2 (có webchange)
  → ghi config_store 3 giá trị → 302 → GET lại thấy giá trị mới. Đổi ngược về 0 cũng đúng.

## [2026-07-26] LỖI TỰ GÂY — render.py xử lý RADIO như CHECKBOX
- Phát hiện khi kiểm chứng mức 4 nhóm User Management: config ghi đúng `iWebAuth=1` nhưng trang
  render lại tick `<input name=iWebAuth type=radio value=0 checked>` — tick nhầm nút.
- Nguyên nhân: `_thay_input()` gộp radio chung nhánh với checkbox, quyết định `checked` theo
  bool của giá trị. Nhưng RADIO có NHIỀU thẻ cùng `name`, mỗi thẻ một `value`; phải tick thẻ
  có `value` BẰNG giá trị trong kho. Xử lý theo bool sẽ tick sai nút (hoặc tick cả nhóm).
- Lỗi thứ hai cùng gốc: `tools/init_config.py` cũng lưu radio thành 0/1 như checkbox, trong khi
  giá trị đúng phải là `value` của thẻ đang `checked`.
- Đã sửa cả hai. Kiểm chứng: POST iWebAuth=1 → tick value=1; POST iWebAuth=0 → tick value=0.
- MỨC ĐỘ LAN RỘNG: **33/152 trang có radio, tổng 129 thẻ**. Nặng nhất: ipbandw.htm (20 thẻ/9 nhóm),
  tr069.htm (12/4), lanmirr.htm (8/2), ftpgenset.htm (6/3), ipfbas.sht (6/3).
  Toàn bộ đã được sinh lại đúng khi chạy lại init_config.py.

## [2026-07-26] LỖI TỰ GÂY — verify T4 báo nhầm "thiếu tài nguyên"
- T4 coi `form action=/cgi-bin/fwuser.cgi` là tài nguyên tĩnh và báo THIẾU, trong khi server
  phục vụ endpoint đó qua cgi-map.json (trả 302). Đây lại là kiểu báo động giả — đúng thứ
  mà bản verify trước đã mắc theo chiều ngược lại.
- Đã sửa: T4 tra spec/cgi-map.json trước, endpoint có trong đó thì coi là phục vụ được;
  đồng thời bỏ chuỗi rác do regex bắt nhầm trong JS nối dòng.
- Kết quả: con số lệch từ 93 trang/173 điểm xuống **39 trang/62 điểm**. Toàn bộ vẫn ở T4
  (trang con/tài nguyên chưa chụp HAR), T1=T2=T3=0.
- Trạng thái: đã xử lý xong

## [2026-07-26] KIỂM CHỨNG TRỰC TIẾP với thiết bị thật qua Chrome — 3 trang KHỚP
Anh Huynn cho phép dùng Chrome trên máy anh để mở thiết bị thật (192.168.1.1, phiên đã đăng
nhập sẵn nên KHÔNG cần nhập mật khẩu). Đối chiếu từng pixel với bản giả lập ở localhost:8080.

| Trang | Kết quả |
|---|---|
| Certificate Management >> Local Certificate | KHỚP HOÀN TOÀN — 5 cột (có CA), GENERATE/IMPORT nằm TRONG bảng, khối Storage Usage 4%, Note 4 mục, REFRESH |
| User Management >> General Setup | KHỚP — Rule-Based tick, HTTPS tick, checkbox Display IP không tick, Landing page giống |
| User Management >> User Online Status | KHỚP — bảng 1 dòng admin/192.168.1.179, Unlimited×3, Block/Logout/Delete, Total Number: 1 |

Ba lỗi anh Huynh báo trước đó đã được xác nhận SỬA XONG trên thiết bị thật.

### BÀI HỌC LỚN — phải kiểm TRONG FRAMESET, không mở trang trực tiếp
- Lần đầu tôi mở thẳng `localhost:8080/doc/usergenset.htm` và thấy hàng loạt "lỗi": không radio
  nào được tick, khối "Notice for User-Based mode" hiện thừa, mất radio HTTPS/HTTP.
- TẤT CẢ đều là LỖI GIẢ. Nguyên nhân: trang gốc có
      function initParameter(){ ... idx[0].checked=1; onChgfrMode(0); }
  mà `onChgfrMode` gọi `bg.hideElmtByClass(...)`, với `bg = parent`. Mở trực tiếp thì
  `parent` chính là nó → không có hàm đó → JS chết giữa chừng → trạng thái form không được đặt.
- Mở qua `index.htm` rồi bấm menu (đúng như người dùng thật) thì KHỚP HOÀN TOÀN.
- => QUY TẮC: luôn kiểm chứng trong frameset, đúng đường đi của người dùng. Ghi vào quy trình.

### PHÁT HIỆN — giá trị form KHÔNG nằm trong thuộc tính HTML
- Trong `usergenset.htm` gốc, KHÔNG radio nào có `checked`. Trạng thái tick do JS đặt lúc chạy
  từ biến SSI: `user_mgt_flag='0'` → `sPolicyType[0].checked=1` (Rule-Based),
  `user_mgt_flag2='0'` → `iWebAuth[0].checked=1` (HTTPS), `user_displayip=0` → checkbox không tick.
- Nghĩa là `init_config.py` lấy giá trị từ thuộc tính là CHƯA ĐỦ với loại trang này; giá trị thật
  nằm ở biến SSI. Hiện chưa gây sai (vì render giữ nguyên JS, JS tự đặt đúng), nhưng cần nhớ khi
  muốn ĐỔI giá trị qua config_store cho các trang kiểu này.

### CÒN LỆCH (nhỏ, thuộc khung ngoài — chưa dựng)
1. Dropdown góc trên trái: thật hiện `Off`, giả lập hiện `Auto Logout`.
   `l_m.htm` dùng SSI: `('' == " checked" && bg.SHOW_SYS_ADMIN)` quyết định hiện nhóm option nào.
   Bản source chụp lúc cấu hình khác nên ra nhánh ngược.
2. Trạng thái góc dưới trái: thật `Status: Ready`, giả lập có lúc `Status: Settings Unsaved`
   (frame `act_sta.htm`). Xuất hiện sau khi POST thử — cần xem lại cách act_sta phản ánh trạng thái.
- Cả hai thuộc `l_m.htm` / `act_sta.htm`, chưa nằm trong `da_dung.json`. Xử lý khi dựng khung.

### LƯU Ý VẬN HÀNH
- Sau mỗi lần POST thử nghiệm phải chạy lại `python tools/init_config.py devices/vigor2927`
  để trả `config.json` về giá trị gốc. Lần này config còn sót `sPolicyType=2`, `sltDisplayIP=1`
  từ lần test, suýt bị hiểu nhầm thành lỗi dựng trang.
- Trạng thái: đã kiểm chứng xong 3 trang

## [2026-07-26] Dựng nhóm CSM (4 trang) + CÔNG CỤ ĐỐI CHIẾU THIẾT BỊ THẬT
- 4 trang CSM: appeprof1.htm, cf1.HTM, wcf1.htm, dnsfilter.htm. verify_page.py: 4/4 DẠT.
- Sửa thêm một báo động giả của verify T4: biểu thức Angular trong thuộc tính
  (`href="{{ sWCF_Status_key_exp ? ... }}"`) bị coi là đường dẫn tài nguyên thiếu. Đã bỏ qua
  mọi giá trị chứa `{{`.

### CÔNG CỤ MỚI: tools/quet_van_tay.js
- Chạy trong Chrome (qua Claude in Chrome). Mở CẢ HAI bên trong frameset, đợi JS chạy xong,
  rồi băm DOM đã render thành 3 chữ ký:
    hb = cấu trúc bảng (tiêu đề cột | số hàng | nút trong bảng)
    hi = tên:kiểu:giá trị của mọi input — RADIO ghi cả `value` lẫn trạng thái tick
    hv = toàn bộ văn bản hiển thị
- Bỏ `sFormAuthStr` khi băm (token phiên, hai bên khác nhau là đúng).
- KẾT QUẢ nhóm CSM: **4/4 trang trùng khít cả hb, hi, hv** với thiết bị thật.
  Đây là kiểm chứng mạnh nhất từ đầu dự án — mạnh hơn verify_page.py vì bắt được lỗi RUNTIME.
- Cách điều hướng: KHÔNG đọc token (bị chặn, và không cần) mà cho trang TỰ BẤM MENU của nó
  (`frames['menu'].document` → tìm `<a>` theo nhãn → `.click()`). Token do chính trang lo.
- Hạn chế đã biết: tên mục trùng nhau giữa các nhóm (vd "General Setup" có ở nhiều nhóm) thì
  phải chọn link theo `href` chứa `fid` — đã có sẵn hàm `__quetTheoUrl()`.
- Trạng thái: đã xong, dùng lại được cho mọi nhóm sau và mọi thiết bị sau

## [2026-07-26] BẬT TOÀN BỘ 153 trang + quét vân tay 20 trang rủi ro cao
- Đã bật toàn bộ 153 trang có bản gốc vào `da_dung.json` (trước: 14). Lý do: `_pages/` cũ vốn là
  DOM nhiễm extension — giữ nó lâu hơn là giữ cái sai lâu hơn. Có công cụ vân tay rồi thì bật hết
  rồi soi ngược an toàn hơn là dựng nhỏ giọt.
- `verify_page.py --tat-ca`: **120/152 đạt** (trước 113). 40 điểm lệch còn lại đều ở T4
  (trang con/tài nguyên chưa có bằng chứng), T1=T2=T3=0.
- Chọn **20 trang rủi ro cao nhất** để đối chiếu thiết bị thật, chấm điểm theo: số thẻ radio ×3
  (vừa sửa lỗi radio), số `innerHTML=` ×2 (bảng do JS dựng), có `<script src=*.cgi>` +10, số select.

### KẾT QUẢ: 19/20 trang KHỚP, 1 trang LỆCH THẬT
- Khớp hoàn toàn (hb+hi): Bandwidth Limit, IPsec General Setup, Administrator Password (0/69 input
  khác), Management, Diagnose, File Explorer, LAN Port Mirror, SysLog/Mail Alert, Panel Control,
  VPN Matcher Setup, USB General Settings, Users Information, Bind IP to MAC, RADIUS/TACACS+,
  VPN TRUNK Management, High Availability, Sessions Limit, Route Policy Diagnosis, PPP General Setup.

### LỆCH THẬT — System Maintenance >> TR-069 (doc/tr069.htm)
| Select | Thiết bị thật | Bản giả lập |
|---|---|---|
| `iPriWANProf` | 4 option: WAN1, WAN2, WAN5 | 64 option "VPN 1..64"  ← SAI |
| `iPriVPNProf` | 64 option: VPN 1..64 | 0 option (rỗng)  ← SAI |
| `iSecWANProf` / `iSecVPNProf` | y hệt cặp trên | cùng kiểu sai |
- 44/48 input còn lại của trang KHỚP. Chỉ 4 select này lệch.
- Đã loại trừ: mọi biến đầu vào GIỐNG HỆT nhau ở hai bên — `iBwanNumber='6'`,
  `aryL2LPro.length=64`, `notSupportWAN=[2,3]`, `bWless=0`, `bNewWLWAN=1`, `SHOW_DIG_WAN2=8`,
  và `bg.getIdxbyName(f,'iPriWANProf')=9`, `('iPriVPNProf')=11` — đúng ở CẢ HAI.
  `getIdxbyName` trong `src/www/index.htm` và `reference/source/index.htm` cũng giống hệt.
- Thực nghiệm: gọi tay `initWAN()` → ô WAN đúng ("WAN1"); gọi tiếp `initVPN()` → ô WAN bị GHI ĐÈ
  thành "VPN 1.???" còn ô VPN vẫn rỗng. Tức `initVPN` viết nhầm vào chỉ số của WAN.
- Nghi vấn còn lại (CHƯA kết luận): `initWAN`/`initVPN` dùng biến `i`, `idx`, `j` KHÔNG khai báo
  `var` → biến toàn cục, dễ bị ghi đè nếu thứ tự/thời điểm gọi khác nhau. Cần đo thứ tự gọi thật
  ở hai bên trước khi sửa. TUYỆT ĐỐI không sửa mò (nguyên tắc 2.1).
- Trạng thái: ĐANG ĐIỀU TRA — chưa sửa, chưa gỡ trang khỏi da_dung.json

### BẪY VẬN HÀNH khi quét hàng loạt
- Quét >10 trang trong một lần gọi javascript_tool làm **treo renderer Chrome** (CDP timeout 45s),
  phải đóng tab tạo tab mới. Chia lô **≤5 trang**, chờ 1400-1600ms mỗi trang.
- Trường dữ liệu SỐNG (year/month/day/hour/minute/second) khác nhau là ĐÚNG — phải loại khỏi
  phép băm, cùng với `sFormAuthStr`.

## [2026-07-26] TÌM RA VÀ SỬA XONG lỗi TR-069 — render.py thay nhầm BIẾN CỤC BỘ
### Nguyên nhân gốc
`doc/tr069.htm` có HAI hàm khai báo CÙNG TÊN biến cục bộ:
```js
function initWAN(){ var aryslt=["iPriWANProf","iSecWANProf"]; ... }
function initVPN(){ var aryslt=["iPriVPNProf","iSecVPNProf"]; ... }
```
`render.py` coi `aryslt` là biến NVRAM, lấy giá trị lần khai báo đầu (của initWAN) rồi
**thay vào MỌI chỗ khai báo `var aryslt`** — kể cả trong initVPN. Kết quả: initVPN nhồi
danh sách VPN vào ô WAN, ô VPN rỗng.

Diff chứng minh:
```
GỐC:    function initVPN(){var aryslt=["iPriVPNProf","iSecVPNProf"];
RENDER: function initVPN(){var aryslt=["iPriWANProf","iSecWANProf"];
```

### Cách sửa
Thêm `_toan_cuc()` vào `render.py` và `toan_cuc()` vào `tools/init_config.py`: quét từng khối
`<script>`, đếm độ sâu ngoặc nhọn (bỏ qua chuỗi và chú thích), **chỉ nhận khai báo `var` ở
độ sâu 0** — tức phạm vi toàn cục. Biến khai báo trong hàm là biến CỤC BỘ, không phải NVRAM.

Hệ quả: số biến trong config.json giảm 1240 → **458** (loại hết biến cục bộ). Đúng bản chất.

### Kiểm chứng sau sửa
- `iPriWANProf`: 4 option "WAN1" — KHỚP thật. `iPriVPNProf`: 64 option "VPN 1..64" — KHỚP thật.
- Băm TỪNG input: TR-069 54/54 khớp, Administrator Password 69/69 khớp.

### BÀI HỌC (áp dụng cho mọi thiết bị sau)
Chỉ biến JS ở PHẠM VI TOÀN CỤC mới là NVRAM. Biến trong hàm trùng tên nhau là chuyện thường
trong mã tối giản — thay bừa sẽ phá logic trang mà file tĩnh nhìn vẫn "đúng".

## [2026-07-26] QUY TẮC ĐO khi đối chiếu thiết bị thật (rút ra từ sai lầm)
1. **Mở trong frameset**, không mở trang lẻ (`bg = parent` cần tiện ích ở index.htm).
2. **Quy trình đo phải GIỐNG HỆT hai bên**, kể cả đường đi (về Dashboard rồi vào trang).
   Tôi từng thấy hash khác nhau chỉ vì đường đi khác, dù nội dung giống hệt.
3. **Đo hai lần cùng một bên** để tự phát hiện trường dữ liệu sống. Đã tìm được `sKnockTotp`
   (mã TOTP trên trang Management) — đổi mỗi lần tải. Loại khỏi so sánh cùng `sFormAuthStr`
   và nhóm `year/month/day/hour/minute/second`.
4. **Hash lệch chưa chắc là lỗi** — phải băm TỪNG input rồi so theo vị trí mới kết luận được.
5. Quét >10 trang một lần gọi javascript_tool làm **treo renderer Chrome** (CDP timeout 45s).
   Chia lô ≤5 trang, chờ 1400-1600ms mỗi trang.

## [2026-07-26] Trạng thái: 153/153 trang đạt mức 4
- Toàn bộ trang menu hiển thị phục vụ theo đúng đường dẫn gốc, dữ liệu từ config_store.
- verify_page.py: 120/152 đạt; 40 điểm lệch còn lại TOÀN BỘ ở T4 (trang con/tài nguyên chưa có
  bằng chứng), T1=T2=T3=0.
- 27 trang đã đối chiếu trực tiếp thiết bị thật, tất cả KHỚP.
- Việc còn lại: (a) chụp HAR bổ sung cho các trang con/dialog còn thiếu; (b) soi tiếp các trang
  chưa đối chiếu trực tiếp; (c) xử lý 2 khác biệt ở khung ngoài (`l_m.htm` dropdown Auto Logout,
  `act_sta.htm` trạng thái Ready/Settings Unsaved).

## [2026-07-26] Khung frameset + HỒI QUY Dashboard (tôi tự gây, đã sửa)
### Kiểm hai khác biệt khung ngoài — CẢ HAI ĐỀU KHÔNG PHẢI LỖI
1. Dropdown góc trên trái (`l_m.htm`): thật hiện `Off` (value=0), giả lập hiện `Auto Logout`
   (value=300). Danh sách option GIỐNG HỆT nhau; chỉ khác GIÁ TRỊ ĐANG CHỌN.
   Bản gốc có `f.sTimeout.value='300'` — đó là giá trị SSI **tại thời điểm chụp HAR**.
   Anh Huynn đã đổi thiết bị sang Off sau đó. => Khác biệt DỮ LIỆU, không phải lỗi dựng.
2. `act_sta.htm`: giả lập hiện `Status: Ready` — GIỐNG thật. "Settings Unsaved" hôm trước là
   do tôi POST thử (webchange=1), và đó là hành vi ĐÚNG của thiết bị.

### Phát hiện: `www/index.htm` bị nhiễm tiện ích trình duyệt
- `www/index.htm` 94016B, có `ng-scope`(1), `data-yd-`(2), `plasmo-csui`(2) — phình 25KB so với
  bản gốc 68805B. Đây là FRAMESET nền của mọi trang.
- Đã thử đưa khung (index/header/menu/l_m/act_sta/empty) vào `da_dung.json` để phục vụ bản gốc.

### HỒI QUY tôi gây ra và cách xử lý
- Sau khi đổi, bảng **"IPv4 LAN Information" trên Dashboard bị TRỐNG**.
- Lùi `index.htm` KHÔNG khôi phục → chứng tỏ nguyên nhân khác. Truy tiếp thì thấy:
  **`/dashbctl.cgi` trả 0 byte.** Đây là nguồn dữ liệu sống của Dashboard (JSON chứa
  `sSystime`, `wanidx`, `iflanstatus`, `sysres`...), nạp qua `$http.get`.
- Nguyên nhân: khi bật toàn bộ 153 trang, `doc/dashboard.htm` chuyển từ bản ĐÓNG BĂNG cũ
  (`_pages/dash_frozen.html`, đã có sẵn dữ liệu) sang bản GỐC (template + AJAX). Nhưng
  `dashbctl.cgi` KHÔNG nằm trong danh sách phục vụ nên trả rỗng → bảng trống.
- ĐÃ SỬA: `CGI_DU_LIEU` trong server.py đổi từ set sang dict {đường dẫn: Content-Type} và
  thêm `/dashbctl.cgi` → `application/json` (đúng Content-Type thật trong HAR).
  Kiểm chứng: `dashbctl.cgi` nay trả 200, `application/json`, 4136B (thật: 4135B).
- Đã lùi khung frameset khỏi `da_dung.json` để tách bạch — sẽ thử lại sau khi Dashboard ổn.

### BÀI HỌC
Quyết định "bật toàn bộ 153 trang" của tôi ĐÃ gây hồi quy mà `verify_page.py` không thấy
(nó không chạy AJAX). Trang dùng dữ liệu sống qua AJAX phải kiểm rằng **mọi endpoint dữ liệu
đều được phục vụ** trước khi chuyển từ bản đóng băng sang bản gốc.
Danh sách trang có AJAX: 31 trang — cần rà từng cái theo cách này.

### CẦN ANH HUYNN
Khởi động lại `Chay-server.bat` — bản sửa nằm trong mã `server.py`, server đang chạy vẫn là
bản cũ nên Dashboard còn trống. (`da_dung.json` và `config.json` thì tự nạp lại theo mtime,
không cần restart; chỉ khi sửa mã .py mới cần.)

## [2026-07-26] Hoàn tất phần endpoint dữ liệu — dùng HỢP ĐỒNG thay danh sách cứng
### Đã sửa hồi quy Dashboard
Sau khi anh Huynn khởi động lại server: bảng **IPv4 LAN Information hiển thị đầy đủ**
LAN1–LAN8, DMZ PORT, IP Routed Subnet. Xác nhận trên trình duyệt.

### Rà toàn bộ endpoint dữ liệu mà JS gọi lúc chạy
Quét 22 trang có `$http.get` / `XMLHttpRequest` → tìm được 22 endpoint. Trong đó:
- **6 endpoint ĐÃ CÓ bằng chứng nhưng chưa được phục vụ**: dashbctl.cgi, cgi-bin/arp.cgi,
  cgi-bin/hotspot.cgi, check_swm_enable.cgi, hsportaluser.cgi, qosclsrule.cgi
- **17 endpoint CHƯA CÓ bằng chứng** (cần chụp HAR bổ sung): /cgi/set.cgi, /cgi/get.cgi,
  wloginauth.cgi, swmgetstasusmac.cgi, radiuslog.cgi, apmaplog.cgi, cloudvpnstuntest.cgi,
  cgi-bin/cvm.cgi, diagrestore2.cgi, login.cgi, hsusbstatus.cgi, bridgefull.cgi,
  upload_ipobject.cgi, ledwakeup.cgi, syslogIPupdate.cgi, folderdelstop.cgi, vpnstatus.cgi

### SUÝT TẠO LỖI MỚI — và cách tránh
Tôi định thêm danh sách cứng `CGI_DU_LIEU = {duong_dan: content_type}`. Nhưng phát hiện kịp:
**cùng một .cgi vừa trả TRANG vừa trả DỮ LIỆU, phân biệt bằng THAM SỐ chứ không bằng đường dẫn**:
```
/cgi-bin/arp.cgi           -> 302 -> doc/iparptbl.sht    (TRANG)
/cgi-bin/arp.cgi?fid=1     -> 200 application/json       (DỮ LIỆU)
/cgi-bin/hotspot.cgi?fid=0 -> 302 -> doc/hsportal1.htm   (TRANG)
/cgi-bin/hotspot.cgi POST  -> 200 application/json       (DỮ LIỆU)
```
Nếu dùng danh sách cứng theo đường dẫn thì MỌI request tới `arp.cgi`/`hotspot.cgi` đều trả JSON
→ phá trang ARP Cache Table và cả 4 trang Hotspot.

### Cách làm ĐÚNG (đã áp dụng)
1. `tools/extract_har.py` ghi thêm trường **`content_type`** vào `spec/cgi-map.json`, lấy đúng
   từ header response trong HAR. Content-Type là một phần của HỢP ĐỒNG (nguyên tắc 2.4).
2. `server.py` bỏ danh sách cứng, quyết định theo hợp đồng:
   `status == 200` và trang đích không nằm trong `doc/` ⇒ DỮ LIỆU, trả với Content-Type ghi trong
   hợp đồng. Ngược lại ⇒ TRANG, trả 302 như cũ.
3. Kiểm chứng: 9 endpoint dữ liệu đều đúng Content-Type và kích thước khớp HAR;
   `arp.cgi` không tham số vẫn 302 sang `/doc/iparptbl.sht`; các trang thường vẫn 302 bình thường.

### Còn tồn
`hsportaluser.cgi?act=0` trả 0B — hợp đồng ghi URL đầy đủ `?act=0&order=0&desc=0&type=...`,
gọi thiếu tham số nên không khớp. Chưa ảnh hưởng trang nào đang dùng.


## [2026-08-02] LỖI TỰ GÂY — verify_page.py báo động giả lần thứ ba
Bản T4 báo 40 điểm lệch. Rà từng điểm thì **13/35 tài nguyên là không có thật**:

### Nguyên nhân 1 — bắt nhầm mảnh JS trong thuộc tính sự kiện (8 điểm)
T4 quét `src=` / `href=` / `action=` bên trong thẻ HTML. Nhưng thuộc tính sự kiện
cũng nằm trong thẻ, và bên trong nó là JavaScript:
```html
<input onclick="document.forms[0].action=myUrl;}function xoa(){...}">
```
Regex bắt được `myUrl;}function` rồi báo "thiếu tài nguyên". Tương tự:
`url;`, `url;fup.submit();}function`, `savefile;filedoc.download=...`,
`+getDevImg(aryAPDevice[i][1])+`, `myUrl;}`.
Đã sửa: loại ứng viên chứa ký tự cú pháp JS `; { } ( ) + = < >` hoặc khoảng trắng.

### Nguyên nhân 2 — tên biến JS trần (1 điểm)
`document.location.href=e>0?"..."` cho ra ứng viên `e`.
Đã sửa: đường dẫn thật phải có `/` hoặc `.`; tên trần thì bỏ.

### Nguyên nhân 3 — chỉ tra reference/source, quên src/www (4 điểm)
`favicon.ico`, `arrd.gif`, `open.png`, `led-gray.gif` **có** trong `src/www/images/`
và server phục vụ được, nhưng T4 chỉ tra `reference/source/` nên báo thiếu.
Đã sửa: T4 nay xét đủ ba đường server có thể phục vụ —
cgi-map.json / reference/source/ / src/www/.

### Nguyên nhân 4 — cùng đường dẫn khác query bị đếm hai lần (2 điểm)
`online1.cgi?sFormAuthStr=<!--#echo var` và `online1.cgi?sFormAuthStr=Jdv...`
là một endpoint. Đã sửa: khử trùng theo đường dẫn, không theo URL đầy đủ.

**Kết quả: 120/152 → 135/152. 22 điểm còn lại là thiếu bằng chứng THẬT.**

### BÀI HỌC (lần thứ ba cùng một kiểu)
Công cụ kiểm tra mà báo sai thì tệ hơn không có, vì nó làm mất niềm tin vào cả
những cảnh báo đúng. Ba lần đều cùng một gốc: **coi mọi chuỗi trông giống đường dẫn
là đường dẫn**. Từ nay mỗi lần verify báo lỗi mới, việc đầu tiên là **mở file gốc
đọc tận mắt đoạn đó**, chưa sửa vội.

## [2026-08-02] Danh sách chụp HAR bổ sung — đã lập
`CHUP-HAR-BO-SUNG.md`: 5 đợt, kèm mức rủi ro.
- Đợt C (22 endpoint AJAX) và E (2 file ảnh): chỉ mở trang / tải ảnh, **không rủi ro**
- Đợt B (8), D (10): thấp
- Đợt A (3): trung bình — mở trang bấm Apply mà KHÔNG sửa giá trị nào
- **Khuyên BỎ 3 mục**: `chglog.cgi` (mật khẩu quản trị), `chgbas2.cgi` (mật khẩu
  người dùng), `gCertRst.cgi` (ghi đè chứng chỉ). Rủi ro cao hơn giá trị thu được.
  Ghi rõ đây là CỐ Ý BỎ, không phải sót.
- Trạng thái: đang chờ anh Huynn chụp


## [2026-08-02] LỖI NẶNG — sửa nhầm vào MÃ JAVASCRIPT của thiết bị (vi phạm 2.2)
Phát hiện khi đối chiếu trực tiếp với thiết bị thật, KHÔNG phải do verify_page.py.

### Hiện tượng
`NAT >> Open Ports`: thiết bị thật **không tick ô nào**, bản giả lập **tick cả 40 ô**
`enOpenPt0..39`. Văn bản hiển thị giống hệt nhau nên nhìn lướt không thấy.
Tương tự ở `NAT >> ALG` (ô `titleen`) và `Hardware Acceleration`.

### Nguyên nhân gốc — hai lỗi chồng nhau

**Lỗi 1: chữ `checked` nằm trong thuộc tính sự kiện.**
```html
<input name=titleen onclick=chkall(this.checked) type=checkbox>
```
Ô này KHÔNG được tick. Nhưng `\bchecked\b` khớp phần `this.checked` bên trong
JavaScript → `init_config.py` ghi `titleen=1` → `render.py` thêm thuộc tính
`checked` thật → giả lập tick sẵn một ô mà thiết bị thật không tick.
Ảnh hưởng: 8 thẻ trên 4 trang (ipbmac, mnatalg, objbackup, tr069).

**Lỗi 2 (nặng hơn): thẻ input nằm trong CHUỖI JAVASCRIPT bị coi là HTML.**
`mnatop.htm` dựng bảng bằng JS:
```js
aryOpen[i] ? '<input type=checkbox value=1 name=enOpenPt"+i+" checked>'
           : '<input type=checkbox value=1 name=enOpenPt"+i+">'
```
Đây là **mã nguồn JavaScript**, không phải thẻ HTML. Công cụ quét cả file nên:
- `init_config.py` lấy được "input" tên `enOpenPt` (cắt ở dấu nháy) đang `checked`
  → ghi khoá GIẢ `enOpenPt=1` vào config
- `render.py` thấy khoá đó, thay vào **chính đoạn JS**, thêm `checked` vào nhánh
  đáng lẽ không tick → cả 40 ô đều tick

Đây là **sửa code của thiết bị**, vi phạm trực tiếp nguyên tắc 2.2.
Quy mô: **151 thẻ trên 41 trang**, sinh ra **45 khoá giả** trong `config.json`
(rõ nhất: `statusidx = '+j+'` — một mảnh nối chuỗi JS được lưu làm giá trị cấu hình).

### Đã sửa
- `init_config.py`: thêm `bo_su_kien()` (bỏ thuộc tính `on*` trước khi tìm `checked`)
  và `bo_script()` (xoá nội dung `<script>` trước khi quét thẻ).
  Kết quả: 645 → 600 input, loại đúng 45 khoá giả, 6 checkbox về đúng trạng thái.
- `render.py`: thêm `_vung_script()` / `_trong_script()` — bỏ qua mọi thẻ
  input/select nằm trong `<script>`. Tính lại vùng sau bước thay input vì chuỗi đã đổi.
- `verify_page.py`: thêm phép kiểm **T2b — MÃ JAVASCRIPT PHẢI GIỮ NGUYÊN**:
  so danh sách thẻ input/select bên trong `<script>` giữa bản gốc và bản dựng,
  khác một ký tự là báo. Đã thử nghiệm bằng cách cố ý tiêm lại lỗi cũ: bắt được.

### BÀI HỌC
`verify_page.py` báo 135/152 **cả trước lẫn sau** khi sửa — nó hoàn toàn mù với lỗi này,
vì chỉ so TÊN input chứ không so trạng thái tick, và không phân biệt HTML với chuỗi JS.
**Chỉ có đối chiếu trực tiếp thiết bị thật mới tìm ra.**
Đây là lần thứ hai thiết bị thật bắt được lỗi mà công cụ tự viết không thấy
(lần một: anh Huynn tự tay phát hiện thiếu cột CA).
Kết luận: **đối chiếu thiết bị thật là phép kiểm chính, verify_page.py chỉ là phép sàng.**


## [2026-08-02] Trích Buoi_5_ajax.har (đợt C + E)
Anh Huynn chụp 18/18 trang đợt C + 2 ảnh đợt E. Kết quả:

- **272 file mới ghi vào reference/source/** (nhiều file trong đó vốn đã có từ
  các đợt HAR trước — extract_har.py chỉ ghi đè khi nội dung KHÁC, nên số này
  gồm cả cập nhật nội dung mới lẫn bổ sung thật)
- **cgi-map.json**: KHÔNG tăng endpoint duy nhất nào — các endpoint AJAX thật sự
  gọi (`cgiapm.cgi`, `cgiapp.cgi`, `cgidashboard.cgi`, `cgiswm.cgi`, `panelctl.cgi`,
  `usbweb.cgi`, `ipnat.cgi`, `v2x00.cgi`) đã có sẵn hợp đồng từ trước
- **verify_page.py --tat-ca: vẫn 136/152** — không đổi so với trước khi có HAR này

### Vì sao verify không nhích, nhưng dữ liệu vẫn có ích
Đợt C nhắm vào **17 endpoint tôi đoán tên qua quét chuỗi JS** (`set.cgi`, `get.cgi`,
`swmgetstasusmac.cgi`, `radiuslog.cgi`...). Sau khi có HAR thật, phát hiện: **hầu hết
tên đó KHÔNG PHẢI tên endpoint thật** — chúng là mảnh chuỗi trong JS tối giản (nối
chuỗi runtime), không phải URL cố định. Tên endpoint THẬT khác hẳn: `cgiapm.cgi`,
`cgidashboard.cgi`, `cgiswm.cgi`, v.v. — và các tên này **đã có hợp đồng từ trước**
qua cơ chế 302 chuẩn của DrayTek, nên không có gì mới cần thêm vào server.py.

`verify_page.py` T4 chỉ quét thuộc tính `src/href/action` trong HTML tĩnh — các lời
gọi AJAX kiểu `$http.get(...)` không hiện ở đó, nên T4 không đo được nhóm này dù có
hay thiếu bằng chứng. Giá trị thật của đợt C là kiểm chứng NGẦM: xác nhận server
đã phục vụ đúng các endpoint AJAX thật sự được dùng, không phải các tên tôi đoán sai.

### Sửa danh sách 17 endpoint trong CHUP-HAR-BO-SUNG.md
Danh sách đó dựa trên đoán tên qua quét JS, ĐÃ SAI phần lớn. Không cần chụp thêm
cho nhóm này nữa — coi như đã đóng.

### Còn lại đúng 16 điểm T4 (không đổi): thuộc đợt A/B/D — nút Apply/Export/Import/
trang con — CHƯA có ai bấm nút nào trong các đợt chụp trước. Vẫn cần chụp riêng.


## [2026-08-08] Đối chiếu thiết bị thật đợt lớn — 95 trang, xác nhận sạch
Quét 91 trang (18 lô x 5, phương pháp click qua frameset thật, chờ JS chạy xong) + 4 trang bổ sung
(VPN Management, Log & Alert, Notification Object, SMS/Mail Alert Service) = 95 trang.

**Kết quả: 95/95 khớp**, sau khi loại 5 trường hợp báo động giả (xem STATUS.md mục tương ứng):
ng-checked đo tĩnh sai, iProfileIdx là biến điều hướng tạm, stime là đồng hồ sống, OpenVPN/
Self-Signed Certificate có frame con lồng bên trong, Webhook có thứ tự tham số link khác thường.

Không phát hiện lỗi thật nào trong đợt này (khác đợt trước — 3 trang NAT/HW Accel có lỗi thật).

### Sự cố kỹ thuật gặp phải khi đo (ghi lại để phiên sau không lặp lại)
- **Batch 20 mục bị timeout ở tầng công cụ (45s)**, nhưng vòng lặp JS vẫn chạy NGẦM trong trang,
  gây xung đột dữ liệu với batch chạy sau đó (kết quả trang X bị ghi đè bởi trang Y do timing đua
  nhau). Phải RELOAD lại tab (`navigate` về index.htm) để dọn sạch mọi vòng lặp đang treo trước khi
  đo tiếp. **Quy tắc: batch ≤5 mục, không bao giờ thử batch >10 dù trước đó có vẻ ổn.**
- Regex khớp link theo `fid=N` phải neo `(?!\d)` để tránh khớp nhầm số có tiền tố giống nhau
  (vd `fid=2` khớp nhầm cả `fid=2560`).
- Không phải mọi link đều có `fid` ngay sau dấu `?` — thứ tự tham số trên `menu.htm` không đồng nhất
  giữa các mục (vd Webhook có `sFormAuthStr` trước `fid`). Regex khớp link nên tìm `fid=N` ở BẤT KỲ
  đâu trong chuỗi, không neo vào vị trí ngay sau `?`.

## [2026-08-08] Rà toàn bộ tìm lỗi cùng lớp với WAN Budget "WAN1" (T5 mù tổ hợp tham số)

Bối cảnh: vụ WAN Budget "WAN1" cho thấy `verify_page.py` T5 chỉ kiểm theo `fid`,
không kiểm các tham số điều hướng KHÁC đi kèm cùng `fid` đó trong cùng hàm JS
(vd `iInetWanIdx`, `showdetail`). Đã viết `tools/quet_to_hop_fid.py` (công cụ
rà một lần, KHÔNG gắn vào verify_page.py) quét toàn bộ 194 file
`reference/source/*.htm|*.sht`, tìm hàm JS nào gán `f.fid.value=N` kèm gán
thêm tham số điều hướng khác trước `f.submit()`, đối chiếu `spec/cgi-map.json`.

**Lượt quét đầu** ra 4 kết quả nhưng có 2 báo động giả do công cụ còn thô:
- `hsportal1.htm` hàm `gotoDetailSet` (fid=1, thiếu `sAct`) — sai vì `sAct`
  được gán CHUỖI RỖNG (`f.sAct.value=""`), mà `extract_har.py` không nhúng
  tham số giá trị rỗng vào `url_chuan` nên không cần bằng chứng riêng.
- `policyrt1.htm` hàm `gotoPage` (fid=2087, thiếu `iAct`) — sai vì cách khớp
  route thật (`tim_trang_goc` trong `server.py`) khớp kiểu TẬP CON: bản ghi
  đã chụp cho fid=2087 (`iPRToPage`) vẫn khớp dù request thật có thêm
  `iAct=0` đi kèm, không phải lỗi định tuyến.

Đã sửa `quet_to_hop_fid.py`: bỏ qua tham số gán chuỗi rỗng, và chỉ báo THIẾU
khi (endpoint, fid) đó CHƯA CÓ bất kỳ bản ghi nào (mô phỏng đúng kiểu khớp
tập con của server thật). **Quét lại còn đúng 2 kết quả:**

- `policyrt1.htm` hàm `onClkBtnUpdate`, fid=4045, thiếu `iAct` — đây chính là
  nút "Upgrade All" đã ghi ở mục Group C phía trên (cần rule Policy Route
  định dạng cũ mới hiện ra), KHÔNG PHẢI phát hiện mới.
- `wanbudget.htm` hàm `initParameter`, fid=112, thiếu `iInetWanIdx` — đây
  chính là nút "Clear" từng dòng WAN đã ghi ở dòng 132/201 phía trên (chỉ
  hiện khi WAN đó đã khóa budget), KHÔNG PHẢI phát hiện mới.

**Kết luận: không phát hiện lỗi mới nào của lớp này.** Cả 2 kết quả trùng
khớp hoàn toàn với các mục đã hoãn (Group C) từ trước.

**Giới hạn của lượt rà này**: chỉ quét được 194 trang đã crawl vào
`reference/source/` — thiết bị thật có nhiều trang hơn con số này (menu-tree
liệt kê tổng cộng nhiều hơn), nên lượt rà KHÔNG bao phủ được lỗi tiềm ẩn ở
những trang chưa từng crawl. Không thể loại trừ khả năng còn tồn tại lớp lỗi
này ở phần chưa crawl.
