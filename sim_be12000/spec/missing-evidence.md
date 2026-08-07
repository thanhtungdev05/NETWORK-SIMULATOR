# Thiếu bằng chứng — BE12000

---

## [2026-08-07] PHÁT HIỆN LỖI PHƯƠNG PHÁP QUÉT: chỉ bắt dataTag ĐẦU TIÊN mỗi file HTML — đã sửa 4/10, còn 6 cần bằng chứng thật

### Nguồn phát hiện

Anh Huynn so sánh trực tiếp giao diện thiết bị thật với bản giả lập
(localhost:8098), thấy trang Firewall thật có đầy đủ khối "Anti-DoS
Attack" (Enable + Threshold) nhưng bản giả lập báo lỗi "The server is
not available now." Anh Huynn nghi ngờ độ sâu quét/cào dữ liệu ban đầu
không đủ, yêu cầu rà soát toàn bộ dự án tìm các chỗ tương tự.

### Nguyên nhân gốc

Quy trình quét trang gốc (các phiên trước, không phải phiên này) chỉ bắt
`_tag=X.lua` ĐẦU TIÊN xuất hiện trong mỗi file `src/views/*.html` (thường
nằm trong `form-action` chính). Các dataTag KHÁC nằm trong cùng file —
ở section thu gọn (collapsible) hoặc widget nạp dữ liệu khi bấm tab con
(ví dụ Device List trên Home có tab WLAN/LAN/USB/VoIP, mỗi tab gọi 1
dataTag riêng qua JS, chỉ tab đầu được bắt) — bị bỏ sót hoàn toàn. Hậu
quả: nhiều trang được đánh dấu mức 4 trong `route-inventory.json`/
`STATUS.md` dù có cả một khối bị 404 (`dispatch.co_data_tag()` trả
False → `_trang_404()`).

### Kỹ thuật quét lại toàn diện (dùng cho các thiết bị sau, ghi lại để tái sử dụng)

Regex trích tất cả `_tag=([A-Za-z0-9_\.]+\.lua)` trong từng file
`src/views/*.html`, gộp theo file, đối chiếu (diff) với tập hợp toàn bộ
dataTag đã biết trong `factory.json` (`dataTags` + `jsonDataTags` +
`jsonThoDataTags` gộp lại). Đã chạy 1 lần cho BE12000, tìm được ĐẦY ĐỦ
danh sách lệch (không phải sửa từng cái một khi người dùng tình cờ phát
hiện) — 6 trang, 14 dataTag thiếu.

### Đã sửa (có bằng chứng thật, đủ 4 mức)

- **`firewall_dos_lua.lua`** (trang `firewall`, khối Anti-DoS Attack —
  ĐÚNG lỗi anh Huynn báo). Bằng chứng:
  `reference/vantay/FirewallDos-get.that.get.json` +
  `FirewallDos-apply.that.post.json`. Thêm `OBJ_FWDOS_ID`
  (`_InstID,Threshold,Enable`), `ghiDangKieu: "rut_gon"`.
- **`accessdev_homepage_lua.lua`** (trang `homePage`, tab "LAN Devices"
  trong Device List). Dùng lại `OBJ_ACCESSDEV_ID` (đã có từ
  `accessdev_landevs_lua.lua`/`wlan_homepage_lua.lua`), thêm trường
  `LastConnection` (paraOrder riêng 6 trường, khác 5 trường của 2
  dataTag kia). MACAddress thật đã sanitize → `aa:bb:cc:dd:ee:01`.
- **`usb_homepage_lua.lua`** (trang `homePage`, tab "USB Devices").
  Đối tượng MỚI `OBJ_BRGRP_ID` (`_InstID=IGD.LD1,IPAddr,USBIfNum`) +
  `OBJ_USBDEV_ID` (rỗng — thiết bị thật KHÔNG có USB cắm nên chưa có
  bằng chứng cấu trúc trường khi có USB, để `paraOrder: []`, KHÔNG bịa)
  + thêm trường `ServerPort` vào `OBJ_FMFTPSERVERCFG_ID` (paraOrder
  riêng, không ảnh hưởng `Localnet_ftp_lua.lua`).
- **`voip_homepage_lua.lua`** (trang `homePage`, tab "VoIP Devices").
  Dùng lại `OBJ_VOIPSIPLINE_ID`/`OBJ_VOIPVPLINE_ID`/
  `OBJ_VOIPVPPHYINTERFACE_ID`, paraOrder riêng theo bằng chứng GET (dataTag
  CHỈ ĐỌC, không có nút Apply trên widget Home). Response thật có thẻ
  `<encode>AuthUserName</encode>` sau `OBJ_VOIPSIPLINE_ID` — theo chính
  sách đã thống nhất (chưa có khoá giải mã), KHÔNG sinh thẻ `<encode>`.

Bằng chứng gộp: `reference/vantay/HomePage-widgets-get.that.get.json`
(lần đầu, chỉ thấy 2 dataTag cũ — xác nhận 3 widget kia nạp lười khi bấm
tab, không nạp khi tải trang) và
`reference/vantay/HomePage-widgets-get2.that.get.json` (sau khi bấm cả
3 tab — chứa đủ bằng chứng cho 3 dataTag mới). Đã verify trên sandbox
(`--reset`, đăng nhập đúng luồng): cả 5 request (GET/POST firewall_dos,
GET accessdev/usb/voip_homepage) khớp ĐÚNG BYTE với bằng chứng thật.
`tools_kiem_thu.py` (36/37 test cũ vẫn đạt — 1 test hỏng
"Ghi Level o trang A" là lỗi CÓ SẴN TỪ TRƯỚC, xác nhận bằng cách chạy
lại trên baseline trước khi sửa, không phải do đợt sửa này).

`firewall` và `homePage` GIỮ NGUYÊN mức 4 (nay mới là mức 4 THẬT — trước
đó bị đánh dấu mức 4 nhầm dù có khối bị 404).

### CHƯA sửa — cần dữ liệu thật, đã hạ mức để phản ánh đúng hiện trạng

- **`dms` (DMS/DLNA)**: dataTag `dms_querydir_lua.lua` bị sót (nghi là
  bộ duyệt thư mục chọn đường dẫn chia sẻ DMS, dùng trong 1 dialog/nút
  trên trang). CHƯA rõ hành vi/tham số/response — cần mở trang DMS thật,
  bấm nút liên quan (có thể là "Browse" chọn thư mục), ghi HAR. Đã HẠ
  `dms` xuống mức 3 trong STATUS.md/route-inventory.json (trước đó bị
  đánh dấu nhầm mức 4).
- **`logMgr` (Log Management)**: 3 dataTag tải file bị sót —
  `do_download_seclog.lua`, `do_download_syslog.lua`,
  `do_download_wifilog.lua`. Nghi đây là endpoint TẢI FILE NHỊ PHÂN
  (Content-Disposition attachment), KHÁC hẳn hợp đồng `menuData` XML
  chuẩn — có thể cần cơ chế xử lý riêng trong `dispatch.py`/`server.py`
  (chưa có tiền lệ trong dự án). CHƯA CÓ HAR — cần anh Huynn bấm từng
  nút Download (Security Log/System Log/WiFi Log) trên thiết bị thật
  trong khi ghi HAR, xem Content-Type/Content-Disposition/định dạng nội
  dung file trả về. Đã HẠ `logMgr` xuống mức 3 (trước đó bị đánh dấu
  nhầm mức 4).
- **`updownload_prevent_ctl.lua`** (dùng chung bởi `firmwareUpgr.html`,
  `logMgr.html`, `usrCfgMgr.html` — nghi là endpoint kiểm tra "có đang
  cho phép upload/download hay không", có thể chạy poll nền). CHƯA CÓ
  bằng chứng. `firmwareUpgr`/`usrCfgMgr` là 2 trong 5 trang NGUY HIỂM cố
  ý bỏ qua (không thao tác thật), nên phần dataTag này ở 2 trang đó
  KHÔNG cần sửa. Ở `logMgr` (trang an toàn, đã có Apply thật) thì đây là
  lỗ hổng thật cần bằng chứng — có thể chụp cùng lúc với 3 dataTag
  download ở trên.

### Bài học cho các thiết bị sau

Khi bắt đầu quét 1 thiết bị mới, KHÔNG chỉ lấy `_tag` đầu tiên mỗi file
HTML — phải chạy kỹ thuật diff toàn file (regex tất cả `_tag=` rồi so
với dataTag đã biết) NGAY TỪ ĐẦU, trước khi đánh dấu bất kỳ trang nào là
"đã dựng đủ". Đặc biệt chú ý các trang có tab con / section thu gọn nạp
dữ liệu bằng JS riêng (Home, Firewall, DMS, Log Management đều thuộc
loại này) — đây chính là nơi dataTag phụ hay bị giấu.

---

## [2026-08-07, tiếp nữa] Port Binding thiếu 1/2 dòng "l2tp_internet" — LOẠI THIẾU SÓT THỨ BA (thiếu instance trong danh sách, không phải thiếu dataTag)

Anh Huynn so sánh trực tiếp trang Port Binding: thiết bị thật có 2 khối
gập ("l2tp_internet" và "internet_tr069"), bản giả lập chỉ có 1
("internet_tr069"). Khác 2 loại thiếu sót trước (thiếu cả dataTag, thiếu
1 dataTag khác dạng phản hồi) — đây là **thiếu 1 INSTANCE trong một
object đã được mô hình hoá đúng** (`OBJ_PORT_BINDING_ID`, dataTag
`portbinding_lua.lua` vẫn hoạt động, chỉ có 1/2 dòng dữ liệu).

### Kỹ thuật dò hàng loạt cho loại lỗi này (trả lời câu hỏi của anh Huynn)

Khác kỹ thuật diff dataTag (không áp dụng được ở đây vì dataTag không
thiếu), đã dùng: lập danh sách các ĐỊNH DANH đã biết chắc chắn tồn tại
trên thiết bị (ví dụ 2 tên kết nối WAN `internet_tr069`/`l2tp_internet`,
suy ra từ chính các trang WAN/L2TP đã dựng), rồi rà MỌI object trong
`factory.json` có trường mang giá trị thuộc tập định danh đó, so số
lượng thực tế với số định danh đã biết. Đã chạy cho nhóm WAN — tìm đúng
1 chỗ thiếu thật (`OBJ_PORT_BINDING_ID`), loại được 2 trường hợp nghi
ngờ ban đầu (`ID_WAN_COMFIG`, `OBJ_L2TP_ID`) sau khi xác nhận chúng
ĐÚNG THIẾT KẾ chỉ có 1 instance (cấu hình riêng theo LOẠI kết nối, không
phải danh sách liệt kê mọi kết nối). Cũng chạy cho nhóm băng tần WLAN
(2.4G/5G/6G) — đủ cả 3, không thiếu.

**Giới hạn của kỹ thuật này**: chỉ dò được các nhóm có SỐ LƯỢNG CỐ ĐỊNH
đã biết trước (WAN: 2, băng tần: 3, LAN port: 4, SSID: 8...). Với danh
sách ĐỘNG (DHCP lease, luật port-forward, rule Local Service Control...)
không có cách nào tự động xác nhận đủ/thiếu mà không so trực tiếp với
thiết bị thật — vẫn cần anh Huynn tiếp tục so sánh thủ công cho các
trang đó.

### Bằng chứng và đã sửa

`reference/har/portbinding.har`: GET trả 2 Instance (`l2tp_internet`
TRƯỚC — `WANViewName=DEV.IP.IF2, WAN_servlist=1`, rồi `internet_tr069`
SAU — `WANViewName=DEV.IP.IF3, WAN_servlist=3`). Đã bổ sung instance
còn thiếu vào `OBJ_PORT_BINDING_ID`, đúng thứ tự bằng chứng.

### PHÁT HIỆN THÊM (lỗi tiềm ẩn, chỉ lộ ra khi có ≥2 instance): nhánh GHI mặc định luôn ghi vào instance 0

Đọc kỹ 2 request Apply trong HAR (entry 3 và 5): mỗi request CHỈ gửi
`WANViewName` + `LANViewName` (KHÔNG có `_InstID`) để định danh dòng cần
sửa — dataTag này không dùng cơ chế "danh sách" chuẩn (`_InstID`/Create/
Delete) mà tự định danh qua 1 trường riêng của object. Code cũ
(`dispatch.menu_data_ghi()` nhánh mặc định) gọi `store.ghi(ten_obj,
thuoc_obj)` KHÔNG truyền `inst` → luôn ghi vào **instance 0** bất kể
`WANViewName` gửi lên là gì. Với 1 instance (trước khi sửa) lỗi này vô
hình (instance 0 luôn đúng). Sau khi thêm `l2tp_internet` làm instance 0
(đúng thứ tự bằng chứng), lỗi sẽ LỘ RA: Apply trên dòng `internet_tr069`
sẽ ghi nhầm sang dòng `l2tp_internet`.

**Đã sửa**: thêm `config_store.chi_so_ghi_mac_dinh(ten_obj, tham_so)` —
nếu `objects[ten_obj]["chonTheoTruong"] = "<ten_truong>"` được khai báo,
tìm instance có giá trị trường đó khớp với tham số gửi lên; KHÔNG khai
báo (mọi object khác) thì trả về 0, giữ NGUYÊN hành vi cũ. Đặt
`"chonTheoTruong": "WANViewName"` cho `OBJ_PORT_BINDING_ID`.
`dispatch.py` nhánh GHI mặc định (dòng cuối `menu_data_ghi()`) nay gọi
`store.ghi(ten_obj, thuoc_obj, inst=vi_tri)` thay vì mặc định `inst=0`
cứng — vẫn CHỈ đổi hành vi cho object có khai báo `chonTheoTruong` (hiện
chỉ 1/135 object), không đụng nhánh "danh sách"/"chỉ số" chuyên biệt đã
có (những nhánh đó có cơ chế chọn instance riêng từ trước).

### Đã xác minh trên sandbox

GET khớp đúng byte với bằng chứng thật (2 Instance, đúng thứ tự). Apply
`WANViewName=DEV.IP.IF3` (internet_tr069) với `LANViewName` mới — xác
nhận GET sau đó cho thấy CHỈ dòng `internet_tr069` đổi, dòng
`l2tp_internet` giữ nguyên rỗng (không bị ghi nhầm). Response Apply khớp
đúng bằng chứng (`xac_nhan_trong`, INSTIDENTITY rỗng — không đổi vì
dataTag này vốn đã cấu hình đúng định dạng này từ trước, chỉ thiếu cơ
chế chọn instance). `tools_kiem_thu.py` vẫn 36/37 (lỗi cũ có sẵn).

---

## [2026-08-07, tiếp] dms/logMgr LÊN LẠI MỨC 4 — 3 dạng response HOÀN TOÀN MỚI phát hiện qua bằng chứng anh Huynn tự chụp

Anh Huynn tự bấm các nút liên quan trên thiết bị thật (mở DevTools >
Network > Preserve log > thao tác > Save all as HAR), lưu 2 file vào
`reference/har/`: `dms-querydir.har`, `logmgr-downloads.har`. Đã đọc và
mô hình hoá cả 3 dataTag còn thiếu tìm được trong đợt rà soát trước —
**3 dạng hợp đồng phản hồi HOÀN TOÀN MỚI, chưa từng gặp trong dự án**:

### Dạng "duong_dan_tho" — response VĂN BẢN THUẦN, không XML/JSON

`dms_querydir_lua.lua` (nút Browse chọn thư mục chia sẻ DMS): request
`GET ?_type=menuData&_tag=dms_querydir_lua.lua&querydir=/mnt/` trả về
**text/plain**, KHÔNG bọc `<ajax_response_xml_root>`:
```
/mnt/|
```
Client (`views/dms.html`, hàm `showPath()`/`showFile()`) tự tách bằng
ký tự `|` (phần trước = đường dẫn, phần sau = danh sách thư mục con nối
bằng `/`) — đây là bằng chứng nguồn (chính source JS thật), không phải
suy diễn. Chỉ có 1 mẫu (thư mục rỗng, vì thiết bị thật không cắm USB/
lưu trữ nào — khớp với `OBJ_USBDEV_ID` rỗng đã biết). CHƯA có bằng
chứng cấu trúc khi có thư mục con thật — không bịa danh sách, chỉ echo
lại đường dẫn + `|` rỗng. Thêm cơ chế mới: `config_store.dinh_dang()`
nhận diện qua `dataTags[tag]["dinhDangDoc"] == "duong_dan_tho"`, xử lý ở
`config_store.duong_dan_tho_cho()` — nhánh này HOÀN TOÀN TÁCH BIỆT khỏi
`xml_cho()`/`json_cho()`, không ảnh hưởng dataTag khác. `dispatch.menu_data_doc()`
nay nhận thêm `tham_so` (tham số URL của GET) để đọc `querydir`.

### Dạng GHI "toi_gian" — response GHI tối giản nhất từng gặp (dạng thứ 8)

`updownload_prevent_ctl.lua` (kiểm tra có được phép tải lên/xuống hay
không, chạy trước mỗi lượt Download). Bằng chứng: CẢ GET lẫn POST đều
trả CÙNG một chuỗi:
```
<ajax_response_xml_root><IF_ERRORPARAM>SUCC</IF_ERRORPARAM><IF_ERRORTYPE>SUCC</IF_ERRORTYPE><IF_ERRORSTR>SUCC</IF_ERRORSTR><IF_ERRORID>0</IF_ERRORID></ajax_response_xml_root>
```
KHÔNG `<INSTIDENTITY>` (khác `xac_nhan_trong`), KHÔNG `<_InstID>` (khác
`day_du`) — không khớp bất kỳ dạng nào trong 7 dạng đã biết. Thêm dạng
`ghiDangKieu: "toi_gian"` (dạng thứ 8) trong `config_store.xml_ghi_thanhcong()`,
chỉ gọi lại `xml_cho(data_tag)` với `objects: []` — thực chất là "response
GHI giống hệt response ĐỌC mặc định", không thêm bớt gì.

### Dạng GHI "tai_file_rong" — hợp đồng HOÀN TOÀN KHÁC (tải file nhị phân)

`do_download_syslog.lua`, `do_download_wifilog.lua`: request là
**multipart/form-data** (KHÔNG phải `application/x-www-form-urlencoded`
như mọi dataTag khác), KHÔNG có `_sessionTOKEN` (dùng `TOKEN_DOWNLOAD`/
`TOKEN_WIFILOG_DOWNLOAD` riêng của form — loại CSRF token đã ghi nhận ở
bản 18 nhưng lần đầu thấy nó THAY THẾ HẲN `_sessionTOKEN` chứ không đi
kèm). Response thật: `Content-Length: 0`, `Content-Type:
application/octet-stream;` (RỖNG HOÀN TOÀN — vì thiết bị thật đang
`SysLogEnable=0`, chưa có log nào để tải). Thêm nhánh XỬ LÝ TRƯỚC bước
kiểm `_sessionTOKEN` trong `dispatch.menu_data_ghi()`, chỉ kích hoạt khi
`config_store.la_tai_file_rong(data_tag)` trả True (`dataTags[tag]["dinhDangGhi"]
== "tai_file_rong"`) — trả thẳng `b""` + `"application/octet-stream;"`,
bỏ qua toàn bộ logic ghi/token/object thông thường.

**`do_download_seclog.lua` VẪN CHƯA có bằng chứng** (anh Huynn chưa bấm
nút Download ở khối Security Log trong lượt chụp này) — CHƯA thêm vào
factory.json, vẫn trả 404 đúng như hiện trạng thật (chưa mô hình hoá).
Không chặn `logMgr` lên mức 4 vì đây chỉ là 1/nhiều chức năng của trang
(tiền lệ tương tự `lanMgrIpv4` với 5 trường mã hoá DHCP chưa giải mã
được). Nếu muốn hoàn thiện nốt: cần anh Huynn mở lại Log Management,
bấm nút Download cạnh "Security Log", chụp HAR.

### Đã xác minh trên sandbox

Restart `server.py --reset`, đăng nhập đúng luồng, mở đúng `menuView`
trước khi gọi `menuData`: cả 5 request (`dms_querydir_lua.lua` GET,
`updownload_prevent_ctl.lua` GET+POST, `do_download_syslog.lua` POST,
`do_download_wifilog.lua` POST) khớp ĐÚNG BYTE với bằng chứng thật (kể
cả header `Content-Type: application/octet-stream;` có dấu `;` thừa).
`do_download_seclog.lua` xác nhận vẫn trả 404 (chưa mô hình hoá, đúng ý
đồ). `tools_kiem_thu.py` vẫn 36/37 (1 lỗi cũ có sẵn từ trước, không phải
do đợt sửa này).

`dms` và `logMgr` LÊN LẠI mức 4 — mức 4: 68/77.

---

## [2026-08-05] Nhóm Local Network > WLAN Basic — 2 phát hiện kiến trúc mới

### `INSTIDENTITY` echo TRƯỜNG CUỐI trong danh sách nhiều `_InstID_N`, không phải `_InstID` top-level

- Route: `wlanBasic`, dataTag `wlan_wlanbasiconoff_lua.lua` (WLAN On/Off,
  điều khiển 3 radio 2.4/5/6GHz cùng lúc).
- Request có CẢ `_InstID` top-level (`IGD`) LẪN 3 bộ `_InstID_0/1/2`
  (`DEV.WIFI.RD1/RD2/RD3`). `INSTIDENTITY` trả về = `DEV.WIFI.RD3` —
  giá trị của `_InstID_2` (bộ CUỐI CÙNG), không phải `_InstID` top-level.
- Đã thêm `dataTags[tag]["instidentity"] = "tu_truong:<ten_truong>"` để
  đọc từ 1 trường tuỳ ý trong tham số thay vì mặc định `_InstID`.

### Dạng response GHI hoàn toàn MỚI: `day_du_gioi_han`

- Route: `wlanBasic` (tab 2.4GHz trong "WLAN Global Configuration"),
  dataTag `wlan_wlanbasicadconf_lua.lua`.
- Response: thứ tự header kiểu `day_du` (PARAM,TYPE,STR,ID), KHÔNG có
  `INSTIDENTITY`, KHÔNG có thẻ `_InstID`, và CHỈ echo `OBJ_WLANMLO_ID`
  (trạng thái MLO — KHÔNG PHẢI object của chính dataTag này, vốn có
  `OBJ_WLANSETTING_ID`/`OBJ_CHANNEL_ID`/`OBJ_WLANMLO_ID`). Nghi là hành
  vi phụ thật của firmware (kiểm tra lại trạng thái MLO sau khi đổi cấu
  hình radio). Đã thêm dạng `"day_du_gioi_han"` +
  `dataTags[tag]["doiTuongGhiRieng"]` (danh sách object cần echo) để mô
  phỏng đúng.
- Đây là dạng response GHI thứ 5 phát hiện được (sau `day_du`, `rut_gon`,
  `rut_gon` mở rộng, `xac_nhan_trong`) — càng củng cố nguyên tắc "không
  có quy tắc chung, mỗi dataTag cần bằng chứng riêng".
- Trạng thái: đã xử lý, đã xác minh trên sim (khớp byte).

---

## [2026-08-05] Mã lỗi `-1452` "This page has expired" — dạng lỗi khác `SessionTimeout`

- Route: `ethWanConfig` (`wan_internet_lua.lua`), `Wan3gConfig` (`wwan_backup_lua.lua`).
- Khi bấm Apply với token CŨ (đã xoay do lần Apply thành công trước đó trên
  trang khác, chưa tải lại `/`), thiết bị thật trả về response THẬT (không
  phải chặn client-side như từng nghi ngờ ở PON LOID):
  ```
  <ajax_response_xml_root><IF_ERRORPARAM>SUCC</IF_ERRORPARAM>
  <IF_ERRORTYPE>-1</IF_ERRORTYPE>
  <IF_ERRORSTR>This&#32;page&#32;has&#32;expired,&#32;please&#32;refresh&#32;and&#32;try&#32;again.&#32;</IF_ERRORSTR>
  <IF_ERRORID>-1452</IF_ERRORID></ajax_response_xml_root>
  ```
- Đây là mã lỗi RIÊNG cho "token hết hạn/không hợp lệ", KHÁC với
  `IF_ERRORSTR=SessionTimeout` đã biết trước đó (dùng khi không có token nào
  hoặc token sai hoàn toàn). Cả 2 lần gặp đều được xử lý đúng theo quy trình
  đã biết: tải lại `/` rồi thử lại thành công. KHÔNG đưa vào sim (chưa rõ
  chính xác điều kiện phân biệt `-1452` vs `SessionTimeout`, cần thêm bằng
  chứng nếu muốn mô phỏng chính xác cả 2 loại lỗi phiên).
- Trạng thái: đã xử lý bằng quy trình vận hành hiện có (luôn tải lại trang
  trước khi Apply ở trang mới), không chặn tiến độ.

---

## [2026-08-05] PHÁT HIỆN: `INSTIDENTITY` của dạng `xac_nhan_trong` KHÔNG PHẢI lúc nào cũng echo `_InstID`

- Route: `filterCriteria` (Internet > Security > Filter Criteria), dataTag
  `firewall_filterglobal_lua.lua`.
- Bằng chứng trước đó (PortLocate/PonLoid/PonSn) cho thấy `INSTIDENTITY`
  echo lại `_InstID` đã gửi (gửi `IGD` → nhận lại `IGD`). Filter Criteria
  gửi `_InstID=IGD` NHƯNG `INSTIDENTITY` trả về RỖNG — phản bác giả
  thuyết "luôn echo".
- Đã sửa `config_store.xml_ghi_thanhcong()`: thêm trường con
  `dataTags[tag]["instidentity"]` = `"echo"` (mặc định, giữ hành vi cũ,
  an toàn cho các mẫu đã biết vì `_InstID` gửi trong các mẫu đó đều rỗng
  nên echo/rỗng cho cùng kết quả) hoặc `"rong"` (luôn rỗng bất kể gửi
  gì) — đặt `"rong"` cho `firewall_filterglobal_lua.lua`.
- Bài học: dạng `xac_nhan_trong` có 2 biến thể độc lập cần bằng chứng
  riêng cho từng dataTag, không thể suy diễn từ dataTag khác dù "giống
  dạng". Xem `config_store.py` docstring `xml_ghi_thanhcong()`.
- Trạng thái: đã xử lý.

## [2026-08-05] Nút Apply trùng `id` giữa 2 trang khác nhau (Firewall / Filter Criteria)

- Cả `firewall.html` và `filterCriteria.html` đều dùng
  `id="Btn_apply_FirewallConf"` cho nút Apply của chính trang đó — đã
  xác nhận đây là cấu trúc HTML THẬT của thiết bị (không phải lỗi copy
  giữa 2 trang trong bản giả lập), verify bằng cách bấm nút trên trang
  Filter Criteria và xem request thực tế gửi tới đúng
  `_tag=firewall_filterglobal_lua.lua` (không phải `firewall_config_lua.lua`
  của trang Firewall). Theo mục 2.2 CLAUDE.md, GIỮ NGUYÊN không sửa.
- Trạng thái: đã xử lý, không cần làm gì thêm.

---

## [2026-08-05] PHÁT HIỆN: Apply LOID (PON Information) làm ĐĂNG XUẤT phiên ngay sau response SUCCESS

- Route: `ponLoid` (Internet > PON Information > LOID), dataTag `poninfo_loid_lua.lua`.
- Bấm Apply với giá trị GIỮ NGUYÊN (`PonLoid=123456789`, `LoidPasswd` không đổi qua
  UI, chỉ đọc lại rồi gửi lại) → response `IF_ERRORID=0` (THÀNH CÔNG), dạng
  `xac_nhan_trong` (`INSTIDENTITY` echo `_InstID=IGD`, không `_InstID` tag, không
  dữ liệu). Response giống hệt các trang khác đã lên mức 4.
- NGAY SAU ĐÓ, trang bị đăng xuất về màn hình đăng nhập (`location.href` vẫn là
  `http://192.168.1.1/` nhưng DOM là trang login) — không phải do tôi bấm Logout,
  không có thao tác nào khác giữa lúc Apply và lúc phát hiện bị đăng xuất.
- Nghi vấn: thiết bị coi việc ghi lại thông tin đăng nhập PON (LOID/Password) là
  hành động nhạy cảm và CHỦ ĐỘNG buộc đăng xuất để yêu cầu đăng nhập lại — hành vi
  hợp lý về bảo mật (tương tự nhiều router buộc đăng xuất sau khi đổi mật khẩu
  quản trị). CHƯA CHẮC CHẮN đây là quy luật (mới quan sát 1 lần) — có thể trùng
  hợp với timeout phiên thông thường (nhưng phiên vừa mới `cham()` xong nên khó
  là timeout ngẫu nhiên).
- **CẬP NHẬT 2026-08-05 (đã kiểm tra lại)**: anh Huynn đăng nhập lại, thử bấm
  Apply LOID (giữ nguyên giá trị) THÊM 3 LẦN LIÊN TIẾP trên cùng 1 lần tải
  trang — CẢ 3 LẦN đều trả `IF_ERRORID=0` SUCCESS, phiên vẫn sống bình thường
  (các request `hiddenData&_tag=sntp_data` poll nền song song đều `status 200`,
  không có request nào bị `SessionTimeout`), trang KHÔNG bị đăng xuất. Trước đó
  có 1 lần gặp thông báo "This page has expired, please refresh and try again"
  (kiểm tra client-side, KHÔNG gửi request nào — 0 request capture) khi thử
  bấm Apply trên 1 lượt tải trang khác, gợi ý nguyên nhân đăng xuất lần đầu là
  do TOKEN CŨ/STALE ở lượt tải trang đó (VD do tôi tương tác giữa 2 lần tải
  trang mà không tải lại `/`) chứ KHÔNG PHẢI hành vi bảo mật chủ ý của thiết bị
  khi ghi lại thông tin đăng nhập PON.
- **KẾT LUẬN: giả thuyết "Apply LOID luôn buộc đăng xuất" bị BÁC BỎ** — không
  đưa hành vi này vào sim. Lần đăng xuất đầu tiên (bản ghi phía trên) được coi
  là ca đơn lẻ, có khả năng do thao tác của tôi (test lại trang mà không tải
  lại `/`) chứ không phải do bản thân dataTag `poninfo_loid_lua.lua`.
- Trạng thái: đã xử lý, không cần làm gì thêm. `ponLoid` giữ nguyên mức 4.

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 23) — IGMP/MLD/Multicast Basic lên mức 4, phát hiện dataTag JSON đầu tiên có nút Apply + quyết định chính sách thứ tự thẻ XML

### Quyết định chính sách: thứ tự thẻ anh chị em trong XML KHÔNG quan trọng

So sánh bằng chứng IGMP (`ID,PARAM,TYPE,STR` rồi `_InstID`) với EnergyMode
(`ID,TYPE,STR,PARAM`) — cùng dạng `rut_gon` nhưng thứ tự thẻ header khác
nhau. Đã hỏi anh Huynn qua AskUserQuestion: coi thứ tự thẻ là không quan
trọng (client parse XML bằng `.find()`/`.text()` theo TÊN thẻ, không theo
vị trí) — anh Huynn xác nhận chọn phương án này. Từ nay, các mẫu bằng
chứng có cùng TẬP thẻ + cùng giá trị + cùng việc có/không dữ liệu đối
tượng được coi là cùng một `ghiDangKieu`, dù thứ tự thẻ trong bản ghi
thật khác nhau. Đây là "khác biệt được chấp nhận", cùng loại với khác
biệt "form action redact" đã chấp nhận trước đây khi so DOM.

### Bằng chứng Apply thật mới (đều SUCCESS, không đổi giá trị)

- **IGMP** (`multicast_igmpwan_lua.lua`, `_InstID=DEV.IGMPWan1`): dạng
  `rut_gon`, có `<INSTIDENTITY>` echo `_InstID` VÀ có thẻ `<_InstID>`.
  File: `reference/vantay/IGMP-apply.that.post.json`. **Lên mức 4.**
- **MLD** (`multicast_mldwan_lua.lua`, `_InstID=DEV.MLDWan1`): cùng dạng
  `rut_gon` như IGMP. File: `reference/vantay/MLD-apply.that.post.json`.
  **Lên mức 4.**
- **Multicast Basic** (`igmp_lua.lua`, `Agtime=360` không đổi): dạng
  `xac_nhan_trong` (INSTIDENTITY rỗng, không `_InstID`, không dữ liệu) —
  mẫu thứ 4 của dạng này. File:
  `reference/vantay/MulticastBasic-apply.that.post.json`. **Lên mức 4.**

### Phát hiện quan trọng: dataTag KIỂU JSON đầu tiên có nút Apply — thiếu hẳn đường ghi

**Multicast on Wi-Fi** (`multicast_model.lua`, dataTag `IgmpWLANCONF`):
đây là dataTag lưu trong `jsonDataTags` (trước đây chỉ dùng để ĐỌC, ví
dụ `WLANMLO`). Bấm Apply thật (`Enable=1`, không đổi) → response
**KHÔNG phải XML**, là JSON thuần, `Content-Type: application/json`,
KHÔNG bọc trong `<ajax_response_xml_root>`, và KHÔNG echo lại dữ liệu
đối tượng (khác với `json_cho()` dùng cho GET, có echo `OBJ_*`):

```json
{"IF_ERRORPARAM":"SUCC","IF_ERRORTYPE":"SUCC","IF_ERRORSTR":"SUCC","IF_ERRORID":0}
```

File: `reference/vantay/IgmpWLANCONF-apply.that.post.json`.

Kiểm tra code thì phát hiện `dispatch.menu_data_ghi()` (đường ghi) CHỈ
đọc từ `store.doi_tuong_cua()`/`store.ghi()` — cây `dataTags`/`objects`
(XML). `multicast_model.lua` chỉ tồn tại trong cây `jsonDataTags`, nên
đường ghi cũ sẽ ÂM THẦM không ghi được gì (no-op) cho dataTag này — một
lỗ hổng kiến trúc thật, không phải giả định. Giá trị test (`Enable=1`)
tình cờ trùng mặc định nên lỗi không lộ ra qua so sánh output.

### Đã sửa

- `config_store.py`: thêm `doi_tuong_json_cua()`, `ghi_json()`,
  `json_ghi_thanhcong()` — đường đọc/ghi riêng cho cây `jsonDataTags`,
  cùng luật bảo vệ như `ghi()` (chỉ ghi đè tham số đã tồn tại).
- `dispatch.py` (`menu_data_ghi`): thêm nhánh rẽ đầu hàm — nếu
  `store.dinh_dang(data_tag) == "json"` thì dùng
  `doi_tuong_json_cua()`/`ghi_json()`/`json_ghi_thanhcong()`, trả về
  `content_type = "application/json; charset=utf-8"`, thay vì nhánh XML
  mặc định.
- `factory.json`: đặt `ghiDangKieu` cho `multicast_igmpwan_lua.lua`,
  `multicast_mldwan_lua.lua` = `"rut_gon"`; `igmp_lua.lua` =
  `"xac_nhan_trong"`. `multicast_model.lua` không cần cờ này (đi theo
  nhánh JSON riêng qua `dinh_dang()`).

### Đã xác minh trên sim

Chạy server thật trong sandbox (state riêng, không đụng
`instance-01.json`), đăng nhập đúng luồng 3 bước, mở đúng `menuView`
trước khi gọi `menuData` (đúng ràng buộc ngữ cảnh):
- 7 trang mức 4 dạng XML cũ (EnergyMode/PortBinding/RIP/MulticastMode/
  IGMP/MLD/MulticastBasic — SNTP không test lại vì không đổi code liên
  quan): Apply giá trị không đổi, response khớp đúng dạng đã biết, không
  trang nào hỏng.
- Multicast on Wi-Fi (JSON): GET trước Apply thấy `Enable=1` → POST
  Apply `Enable=1` (không đổi) trả đúng response thật (byte khớp) → GET
  sau vẫn `Enable=1`. Thử tiếp đổi thật `Enable: 1→0→1` qua 2 lần Apply
  (đăng nhập lại lấy token mới giữa 2 lần, vì token xoay sau mỗi lần
  ghi) — GET sau mỗi lần đều phản ánh đúng giá trị vừa ghi, xác nhận
  `ghi_json()` lưu thật vào `jsonDataTags`, không phải no-op.

**Mức 4: 9/77 trang** (EnergyMode, SNTP, Port Binding, RIP, Multicast
Mode, IGMP, MLD, Multicast Basic, Multicast on Wi-Fi).

Bước tiếp theo: Port Locating, PON Information, rồi Security/WAN.

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 22) — RIP + Multicast Mode lên mức 4, dạng "xac_nhan_trong" xác nhận là dạng lặp lại (không phải ngoại lệ 1 lần)

Tiếp tục nhóm Internet, làm nhanh hơn (theo thống nhất với anh Huynn —
chỉ dừng báo cáo khi có vướng mắc thật sự):

- **Dynamic Routing (rip)**: Apply thật (`Btn_apply_RIP`, giá trị không
  đổi, `RipEnabled=0`) thành công. Request có tham số `encode` (RipAuthKey
  mã hoá — cùng loại khoá mã hoá CHƯA CÓ bằng chứng đã ghi nhận từ
  DHCPBasicCfg), sim bỏ qua an toàn (tham số lạ, không ghi). Response
  đúng dạng `xac_nhan_trong`. **Lên mức 4.**
- **Multicast Mode (multicastmode)**: form chỉ 1 select, Apply thành
  công, response cũng đúng dạng `xac_nhan_trong`. **Lên mức 4.**
- **Parental Controls (parentCtrl)**: BỎ QUA — `_InstID=-1` (danh sách
  rule rỗng, form hiện tại là template "thêm mới", không có instance
  thật nào để giữ nguyên giá trị). Không thử Apply. Vẫn ở mức 3.

Dạng `xac_nhan_trong` (INSTIDENTITY rỗng/echo, không `_InstID`, không dữ
liệu) nay có 3 mẫu bằng chứng thật (Port Binding, RIP, Multicast Mode) —
có vẻ là dạng phổ biến cho các dataTag scalar/không theo instance rõ
ràng. Vẫn KHÔNG được coi là mặc định tuyệt đối — mỗi dataTag mới vẫn cần
xác minh riêng trước khi đặt `ghiDangKieu`.

Đã cập nhật `factory.json` (`ghiDangKieu: "xac_nhan_trong"` cho
`rip_lua.lua`, `multicast_mode_lua.lua`), đã xác minh trên sim: EnergyMode/
SNTP/Port Binding không hỏng, RIP và Multicast Mode Apply thành công
(POST 200, không reload).

**Mức 4: 5/77 trang** (EnergyMode, SNTP, Port Binding, RIP, Multicast Mode).

Bước tiếp theo: tiếp tục Internet — Multicast (IGMP/MLD/Basic/Wi-Fi),
Port Locating, PON Information, rồi Security/WAN. Parental Controls cần
quay lại sau nếu muốn test (phải tạo 1 rule thật trước, hoặc hỏi ý kiến
vì đây không còn là "giá trị không đổi").

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 21) — Port Binding lên mức 4, XÁC NHẬN mỗi dataTag một định dạng response GHI riêng (3 mẫu, 3 dạng khác nhau)

### Phát hiện

Sau khi sửa mặc định "day_du" (bản 20), thử tiếp Port Binding (nhóm
Internet, theo góp ý chuyển nhóm) — bấm đúng nút instance `:0`, giá trị
không đổi. Response thật:

```
<ajax_response_xml_root><INSTIDENTITY></INSTIDENTITY><IF_ERRORID>0</IF_ERRORID>
<IF_ERRORTYPE>SUCC</IF_ERRORTYPE><IF_ERRORSTR>SUCC</IF_ERRORSTR>
<IF_ERRORPARAM>SUCC</IF_ERRORPARAM></ajax_response_xml_root>
```

KHÁC cả 2 mẫu trước: có `<INSTIDENTITY>` nhưng RỖNG (request không gửi
`_InstID`), KHÔNG có thẻ `<_InstID>`, không có dữ liệu đối tượng. Đây là
mẫu thứ 3, xác nhận rõ ràng: **không có 1 quy tắc chung cho định dạng
response GHI — mỗi dataTag (mỗi file .lua backend) có thể tự định dạng
riêng.**

### Đã sửa

`config_store.xml_ghi_thanhcong()` đổi từ 1 cờ boolean (`ghiRutGon`)
sang trường chuỗi `dataTags[tag]["ghiDangKieu"]` với 3 giá trị đã biết:
`day_du` (mặc định, mẫu SNTP), `rut_gon` (mẫu EnergyMode), `xac_nhan_trong`
(mẫu Port Binding, mới). Đã đặt `ghiDangKieu` cho
`energy_config_lua.lua` và `portbinding_lua.lua` trong `factory.json`.
Test đơn vị khớp CHÍNH XÁC cả 3 mẫu bằng chứng thật.

### Đã xác minh trên sim (không đụng thiết bị thật)

Restart server, kiểm tra lại theo thứ tự: EnergyMode Apply thành công
(không hỏng) → SNTP đổi 43200 rồi trả lại 86400 thành công (không hỏng)
→ Port Binding Apply thành công (POST 200, không reload). **Port Binding
lên mức 4.**

### Ghi chú vận hành: PHẢI tải lại trang (`/`) trước mỗi lần thử Apply ở trang khác

Trong lúc test, sau khi EnergyMode Apply thành công (xoay token), điều
hướng SPA sang SNTP rồi bấm Apply đôi lúc gây lỗi công cụ "Inspected
target navigated or closed" — nghi do token đã xoay từ lần ghi trước mà
client chưa có token mới. Chưa xác định được quy luật chính xác (một lần
value vẫn ghi thành công dù có dấu hiệu này). Để tránh nhầm lẫn, từ nay
LUÔN `navigate` lại `http://localhost:8098/` (tải lại `/` để nhận token
sống mới) trước khi thử Apply ở một trang MỚI, kể cả khi vẫn đang đăng
nhập — không dựa vào điều hướng SPA thuần tuý sau một lần ghi khác đã
thành công trong cùng phiên.

**Hiện trạng mức 4: 3/77 trang (EnergyMode, SNTP, Port Binding).**

Bước tiếp theo: tiếp tục nhóm Internet — Dynamic Routing (rip), Parental
Controls, các trang trong Security/WAN. DDNS đã thử và bị chặn (2 trường
bắt buộc rỗng: `Interface` + có thể `Username`/`Password`), bỏ qua, chưa
lên mức 4.

---

### Bối cảnh

Sau bản 19 (EnergyMode lên mức 4), thử tiếp loopbackDetect/mirror trong
Management & Diagnosis — cả hai vướng đặc thù form riêng, chưa lên mức 4
(xem phần dưới). Theo góp ý của anh Huynn, chuyển hướng sang nhóm menu
khác (Internet) để tận dụng các trang có form đơn giản hơn.

### PHÁT HIỆN: giả định "response GHI luôn là xác nhận ngắn" ở bản 19 SAI

Trước khi thử trang mới, rà lại bằng chứng SẴN CÓ (không cần chụp mới):
`reference/har/sntp-apply.har`, tồn tại từ Giai đoạn 0 (2026-08-03) —
PHÁT HIỆN response Apply thành công thật của `sntp_lua.lua` KHÁC HẲN
định dạng rút gọn suy ra từ EnergyMode:

```
<ajax_response_xml_root><IF_ERRORPARAM>SUCC</IF_ERRORPARAM>
<IF_ERRORTYPE>SUCC</IF_ERRORTYPE><IF_ERRORSTR>SUCC</IF_ERRORSTR>
<IF_ERRORID>0</IF_ERRORID><_InstID>IGD</_InstID>
<OBJ_SNTP_ID><Instance>...(ĐẦY ĐỦ moi ParaName/ParaValue, giong het GET)...
</Instance></OBJ_SNTP_ID></ajax_response_xml_root>
```

Không có `<INSTIDENTITY>`, thứ tự header GIỐNG `xml_cho()` bình thường
(`IF_ERRORPARAM, IF_ERRORTYPE, IF_ERRORSTR, IF_ERRORID`, không phải thứ
tự `IF_ERRORID, IF_ERRORTYPE, IF_ERRORSTR, IF_ERRORPARAM` như EnergyMode),
và có ĐẦY ĐỦ dữ liệu đối tượng — về cơ bản giống `xml_cho()` (GET) CỘNG
THÊM một thẻ `<_InstID>` chèn ngay sau khối `IF_ERROR*`.

Đây là bằng chứng THẬT, có TRƯỚC bản 19, nhưng bị bỏ sót vì bản 19 chỉ
dựa trên 1 mẫu (EnergyMode) mà không rà lại HAR cũ. Bài học: trước khi
tổng quát hoá một hành vi dùng chung, PHẢI kiểm tra hết bằng chứng SẴN CÓ
liên quan, không chỉ mẫu mới nhất vừa chụp.

### Đã sửa lại (đúng theo mục 2.1 CLAUDE.md — không suy diễn từ 1 mẫu)

- `config_store.xml_ghi_thanhcong(data_tag, tham_so)`: MẶC ĐỊNH nay dùng
  dạng ĐẦY ĐỦ (gọi `xml_cho()` với `_InstID` chèn sau header) — khớp bằng
  chứng SNTP. Dạng RÚT GỌN (kiểu EnergyMode) chỉ áp dụng khi
  `dataTags[tag]["ghiRutGon"] == true` — cờ này CHỈ đặt cho
  `energy_config_lua.lua` trong `factory.json`, dựa trên bằng chứng
  riêng của trang đó. KHÔNG được coi dạng rút gọn là mặc định cho trang
  khác trừ khi có bằng chứng riêng.
- `_hop_nhat_factory()`: bổ sung cơ chế đồng bộ các "khoá meta" cấp
  dataTag (như `ghiRutGon`, `renderOrder`, `scalarTags`) từ `factory.json`
  vào state cũ đang chạy, để không phải xoá state mỗi khi thêm bằng
  chứng cấu trúc mới (cùng vấn đề đã gặp với dataTag/object/tham số ở
  Giai đoạn 0).
- `xml_cho()`: BỎ khai báo `<?xml version="1.0"?>` ở nhánh THÀNH CÔNG
  (không có bằng chứng — cả `sntp_lua.lua` và `energy_config_lua.lua`
  gốc đều bắt đầu thẳng bằng `<ajax_response_xml_root>`, một dòng, không
  xuống dòng). Nhánh LỖI (`SessionTimeout`) GIỮ NGUYÊN có khai báo xml +
  xuống dòng/thụt lề — vì `reference/source/data/wan_internet_lua.lua`
  (mẫu lỗi SessionTimeout thật) CÓ khai báo này, MÂU THUẪN với 2 mẫu
  thành công. Không rõ đây là khác biệt thật giữa 2 nhánh hay chỉ khác
  cách công cụ chụp — giữ nguyên phần chưa chắc, chỉ sửa phần có 2 mẫu
  bằng chứng đồng nhất.
- Đã kiểm bằng test đơn vị: output khớp CHÍNH XÁC (từng thẻ, đúng thứ
  tự) với cả `sntp_lua.lua` và `energy_config_lua.lua` gốc.

### Đã xác minh trên SIM (không đụng thiết bị thật) — SNTP lên mức 4

Phát lại ĐÚNG kịch bản đã ghi trong `GHI-CHU-APPLY.md` (đổi Poll Interval
86400 → 43200 → 86400) trên bản giả lập:
- Đổi 86400→43200: Apply thật qua UI, POST thành công, không reload,
  ô hiển thị đúng 43200.
- Đổi 43200→86400 (bấm Apply lần 2 NGAY sau đó, không tải lại trang):
  bị SessionTimeout, tự động về Home. Xem mục phát hiện thêm bên dưới.
- Điều hướng lại vào SNTP (trang tải lại token sống mới), bấm Apply với
  86400: thành công, không reload, ô hiển thị đúng 86400 (đã khôi phục
  đúng giá trị gốc, không để lại thay đổi trên state của sim).
- EnergyMode kiểm tra lại: vẫn hoạt động bình thường sau khi sửa
  (không bị hỏng bởi thay đổi dùng chung).

SNTP lên mức 4 — **không cần bấm gì trên thiết bị thật**, vì bằng chứng
Apply thật đã có sẵn từ Giai đoạn 0 và sim nay tái tạo đúng.

### PHÁT HIỆN MỚI (chưa có bằng chứng thật, cần điều tra sau): token có xoay sau mỗi lần ghi không?

`session.doi_token()` xoay `sess_token` sau MỌI lần ghi thành công (giả
định từ đầu dự án, không rõ có bằng chứng gốc hay không). Client
(`window._sessionTmpToken`) KHÔNG có cơ chế tự cập nhật token mới sau
Apply (không response nào từng chụp có chứa token mới). Hệ quả: bấm
Apply LẦN THỨ HAI liên tiếp (không có reload/điều hướng xen giữa) trên
SIM luôn thất bại (`SessionTimeout`) và tự động về Home.

`sntp-apply.har` chỉ ghi lại 1 request POST (đổi 86400→43200); ghi chú
"Đã trả lại giá trị cũ chưa: rồi" trong `GHI-CHU-APPLY.md` xác nhận CÓ
bấm Apply lần 2 trên thiết bị thật, nhưng KHÔNG có trong HAR (có thể do
dừng ghi HAR trước khi bấm lần 2). Vì vậy CHƯA CÓ bằng chứng thật để xác
nhận: (a) thiết bị thật có xoay token sau mỗi lần ghi hay không, (b) nếu
có, client thật đồng bộ token mới bằng cách nào (vd tự đọc lại token qua
API khác, hay đơn giản la` không bao giờ đổi 2 lần liên tiếp trong thực
tế sử dụng).

**Cần cho phiên sau**: chụp HAR 2 lần bấm Apply liên tiếp (không tải lại
trang giữa 2 lần) trên CÙNG 1 trang thật, so `_sessionTOKEN` của request
2 với request 1. Nếu giống nhau → sim đang SAI (không nên xoay token mỗi
lần ghi, hoặc phải có cơ chế đồng bộ). Nếu khác nhau → cần tìm xem client
thật lấy token mới từ đâu (có thể ẩn trong response mà ta chưa để ý,
hoặc gọi thêm 1 request khác ngay sau).

---

### Bối cảnh

Sau khi NT-3 xong 75/75 trang (bản 18), bắt đầu thu bằng chứng POST/Apply
(mức 4) theo phương pháp an toàn đã thống nhất: bấm Apply với giá trị
KHÔNG đổi, bắt đầu từ nhóm Management & Diagnosis, trang đầu tiên EnergyMode.
Chụp được 1 bằng chứng POST/response thật:
`reference/vantay/EnergyMode-apply.that.post.json`.

### LỖI 1 (chặn TOÀN BỘ mức 4, mọi trang) — index.html phục vụ tĩnh, không render token sống

`src/dispatch.py` (`Dispatcher.tai_nguyen()`) trả `src/www/index.html`
NGUYÊN VĂN, không thay thế gì. File này có 2 dòng gán cứng
`_sessionTmpToken = "\x.."` (hex-escape), chụp 1 LẦN lúc lấy bằng chứng
2026-08-03. `session.py` xoay `sess_token` sau mỗi lần ghi, và `kiem_token()`
so khớp CHÍNH XÁC. Vì token client luôn là giá trị cũ chụp sẵn, mọi
Apply/POST đều bị `SessionTimeout`, và đoạn JS dùng chung trong index.html
xử lý `SessionTimeout` bằng `top.location.href = top.location.href` — tức
CẢ TRANG BỊ RELOAD VỀ HOME. Đây đúng là triệu chứng "bấm Apply bị bật về
Home" quan sát được từ đầu phiên.

**Sửa**: thêm `Dispatcher.trang_chu(token_hien_tai)` — đọc `index.html`
tĩnh rồi thay 2 chỗ `_sessionTmpToken` bằng token sống
(`session.sess_token`, mã hex-escape lại cho đúng định dạng gốc).
`server.py` gọi hàm này thay vì `tai_nguyen("index.html")` khi phục vụ `/`.

### LỖI 2 (lỗi thật sự khiến bấm Apply vẫn bị reload SAU KHI đã sửa lỗi 1)

Sau khi sửa lỗi 1 và xác minh bằng `fetch()` trực tiếp (gọi thẳng HTTP,
không qua UI) thành công, bấm nút Apply THẬT trên giao diện (qua click
menu → EnergyMode → Btn_apply_EnergyConf) VẪN bị reload về Home.

Truy ra: **MỌI file `views/<viewTag>.html`** (cả 75 trang) — không riêng
`index.html` — cũng có sẵn dòng `_sessionTmpToken = "\x.."` hex-escape
CHỤP CỨNG cùng lúc với HTML trang đó (ví dụ `views/EnergyMode.html` dòng
486, giải mã ra `tRS1uZmwWxpam2nBn50pxIxr`). `menuView` trả các file này
làm fragment HTML, phía client dùng jQuery `.html()` để chèn — jQuery TỰ
ĐỘNG chạy lại các thẻ `<script>` bên trong fragment, nên script này GHI ĐÈ
`window._sessionTmpToken` (vừa được đặt đúng ở `index.html`) bằng giá trị
CŨ chụp riêng của trang đó. Xác minh trực tiếp: `window._sessionTmpToken`
sau khi điều hướng tới EnergyMode luôn ra đúng `tRS1uZmwWxpam2nBn50pxIxr`
(khớp hex-escape trong `views/EnergyMode.html`), bất kể token sống lúc đó
là gì.

**Sửa**: `Dispatcher.menu_view(view_tag, token_hien_tai)` nay cũng thay
token bằng hàm dùng chung `_thay_token_song()` (tách từ `trang_chu()`).
`server.py` truyền `session.sess_token` vào mọi lệnh gọi `menu_view()`.

### Đã xác minh sau khi sửa CẢ HAI lỗi (không phải suy luận — test thật trên sim)

1. Restart server, đăng nhập lại, điều hướng Home → Management & Diagnosis
   → Energy Conservation bằng CLICK THẬT (không gọi hàm JS tắt).
   `window._sessionTmpToken` ổn định, không đổi qua điều hướng.
2. Bấm `Btn_apply_EnergyConf` thật (giá trị PowerEnable/PowerMode giữ
   nguyên 1/0). Kết quả: có POST thật tới
   `/?_type=menuData&_tag=energy_config_lua.lua`, HTTP 200, KHÔNG có
   reload/điều hướng, token không đổi sau đó.

### LỖI 3 — response GHI (Apply) sai định dạng (đã sửa, dựa trên 1 mẫu bằng chứng)

So bằng chứng thật `EnergyMode-apply.that.post.json`: response Apply
thành công thật là XÁC NHẬN NGẮN
`<ajax_response_xml_root><INSTIDENTITY>IGD</INSTIDENTITY><IF_ERRORID>0</IF_ERRORID>...<_InstID>IGD</_InstID></ajax_response_xml_root>`
(228 byte), KHÁC với response GET đầy đủ. `dispatch.menu_data_ghi()` cũ
trả nguyên `store.xml_cho(data_tag)` (dữ liệu đầy đủ như GET, 419 byte) —
sai hợp đồng, vi phạm mục 2.4 CLAUDE.md. Đây là code DÙNG CHUNG cho toàn
bộ 75 trang có ghi, không riêng EnergyMode.

**Sửa**: thêm `ConfigStore.xml_ghi_thanhcong(tham_so)` sinh đúng định
dạng rút gọn, echo lại `_InstID` từ tham số client gửi lên.
`dispatch.menu_data_ghi()` gọi hàm này khi ghi thành công (nhánh lỗi
`SessionTimeout` GIỮ NGUYÊN `xml_cho(..., ma_loi=...)` cũ — chưa có bằng
chứng cho định dạng lỗi của response GHI, không tự suy diễn).

**CẢNH BÁO cho phiên sau**: `xml_ghi_thanhcong()` mới có 1 mẫu bằng chứng
(EnergyMode). Nếu chụp thêm HAR Apply ở trang khác mà thấy định dạng khác
(thiếu `INSTIDENTITY`, thứ tự thẻ khác, v.v.) thì phải sửa lại và ghi rõ
vào đây, không coi mẫu này là chuẩn tuyệt đối cho mọi dataTag.

### Câu hỏi CHƯA có bằng chứng trả lời (không tự suy diễn)

- `session.doi_token()` xoay `sess_token` sau MỌI lần ghi thành công. Test
  thủ công cho thấy nếu dùng lại token cũ cho lần ghi thứ 2 thì bị
  `SessionTimeout` — đúng theo thiết kế hiện tại của sim. Nhưng CHƯA CÓ
  bằng chứng thật (chưa chụp 2 lần Apply liên tiếp trên thiết bị thật) để
  xác nhận thiết bị thật CÓ xoay token sau mỗi lần ghi hay không, và nếu
  có thì client thật đồng bộ token mới bằng cách nào (response không thấy
  trả token mới). Cần chụp thêm HAR: bấm Apply 2 lần liên tiếp (giá trị
  không đổi) trên cùng 1 trang thật, xem lần 2 có `_sessionTOKEN` khác lần
  1 không.

### File đã sửa (đã commit — 6e656f2)

- `src/dispatch.py`: `_thay_token_song()` (dùng chung), `trang_chu()`,
  `menu_view(view_tag, token_hien_tai=None)`.
- `src/server.py`: truyền `session.sess_token` vào `menu_view()`.
- `src/config_store.py`: `xml_ghi_thanhcong(tham_so)`.
- Bằng chứng: `reference/vantay/EnergyMode-apply.that.post.json`.

### Thử tiếp trang thứ 2 (LoopbackDetectBasic) — CHƯA lên được mức 4

Sau khi EnergyMode lên mức 4, thử tiếp `loopbackDetect` (tab Basic,
`Btn_apply_LoopbackDetectBasic`) theo đúng phương pháp (Apply giữ
nguyên giá trị). Thất bại — không phải do lỗi sim, mà do PHƯƠNG PHÁP
chụp trên thiết bị thật: bấm nút bằng JS (`.click()`) mà KHÔNG từng
tương tác thật với các ô nhập (`V_Ethertype`/`Sendinterval`/`RenewTime`/
`CheckInterval`) khiến trường ẩn tính toán `Ethertype` không được thiết
bị thật điền đúng — request gửi đi có `Ethertype=NaN` và các ô rỗng dù
màn hình đang hiện giá trị thật. Thiết bị thật TỪ CHỐI ghi (response
FAIL, xem chi tiết trong `reference/har/GHI-CHU-APPLY.md`). Đã thử kích
hoạt lại bằng `.trigger('focus'/'keyup'/'change'/'blur')` qua jQuery —
KHÔNG khắc phục được (2 lần thử, cùng kết quả).

**Không có gì bị ghi/thay đổi trên thiết bị thật** (FAIL = an toàn), chỉ
là chưa lấy được bằng chứng Apply THÀNH CÔNG cho trang này. File
`LoopbackDetectBasic-apply.that.post.json` được giữ lại làm bằng chứng
LỖI hợp lệ (lần đầu có định dạng response FAIL thật), nhưng route
`loopbackDetect` KHÔNG được nâng lên mức 4.

**Cần cho phiên sau nếu muốn tiếp tục trang này**: tìm cách kích hoạt
đúng cơ chế tính `Ethertype` từ `V_Ethertype` (có thể cần gõ phím thật
qua `computer` tool thay vì JS `.trigger`, hoặc đọc kỹ script của
`loopbackDetect.html`/`networkDiag.html` để biết event nào thật sự được
lắng nghe), hoặc chọn thử trang Apply khác đơn giản hơn (ví dụ `mirror`).

### Thử trang thứ 3 (mirror) — CŨNG chưa lên được mức 4, 2 lý do khác nhau

**Lần 1**: `mirror.html` có HAI nút cùng class `Btn_apply`: một cho form
Instance đang cấu hình thật (`Btn_apply_MirroManag:0`) và một cho
template ẩn dùng để "thêm mới" (`Btn_apply_MirroManag`, không hậu tố,
`_InstID=-1`). Bấm nhầm nút không hậu tố (do `getElementById` khớp đúng
chuỗi id không có `:0`) → gửi `_InstID=-1` → thiết bị thật trả FAIL
(`IF_ERRORID=-261`). **Không có gì bị ghi** (instance -1 không hợp lệ).
Bài học cho các phiên sau: LUÔN kiểm tra có bao nhiêu nút cùng tiền tố
`Btn_apply_` trên trang trước khi bấm, ưu tiên nút có hậu tố `:<so>`
khớp với instance đang hiển thị dữ liệu thật.

**Lần 2**: Bấm đúng `Btn_apply_MirroManag:0` — KHÔNG có request nào được
gửi (0 capture). Nguyên nhân: `MirrorDest` là `<select>` bắt buộc
(`required`) nhưng đang RỖNG theo mặc định (đặt tương ứng với
`MirrorEnable=0`, tức tính năng đang tắt nên trường đích không cần chọn
trên thực tế, nhưng jQuery-validate vẫn chặn submit vì thấy field trống).
`initial_button()` (index.html) có `if (formOBJ.valid() == false) return;`
— chặn HOÀN TOÀN trước khi gửi request, im lặng, không có gì để capture.

Để Apply "giữ nguyên giá trị" thành công trên trang này sẽ CẦN chọn một
giá trị cho `MirrorDest` (ví dụ LAN1) dù không bật Mirror — tức là
KHÔNG còn giữ nguyên 100% trạng thái rỗng ban đầu của trường đó, dù về
mặt chức năng không ảnh hưởng gì (Mirror vẫn tắt). Đây là ngoại lệ nằm
ngoài phạm vi "Apply giá trị không đổi" đã thống nhất — CHƯA tự ý làm,
cần hỏi trước.

**Không có gì bị ghi trên thiết bị thật ở cả 2 lần** (an toàn). `mirror`
vẫn ở mức 3. Bằng chứng lần 1 (`MirroManag-apply.that.post.json`) giữ
lại làm tư liệu về mã lỗi `_InstID` không hợp lệ (`IF_ERRORID=-261`).

### Nhận định sau 3 lần thử (EnergyMode / loopbackDetect / mirror)

Chỉ EnergyMode "chạy suôn" ngay lần đầu vì MỌI trường trên form đã có
sẵn giá trị hợp lệ. Hai trang sau đều vướng do đặc thù form (trường tính
toán qua JS, trường bắt buộc đang rỗng). Nhiều khả năng đây là mẫu số
chung cho nhiều trang trong số 74 trang còn lại, không phải ngoại lệ.
**Đề xuất quy trình cho các phiên Apply sau**: trước khi bấm Apply thật,
đọc trước HTML/DOM của form để liệt kê hết các trường bắt buộc
(`required`/`rules().required`) và giá trị hiện tại của chúng, chỉ bấm
khi TẤT CẢ đã có giá trị hợp lệ sẵn (giống điều kiện của EnergyMode);
nếu có trường bắt buộc đang rỗng, dừng lại và hỏi trước khi tự chọn giá
trị thay đổi nó.

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 18) — đọc mục này trước khi làm tiếp — HOÀN TẤT NT-3 (mức 3) CHO TOÀN BỘ 75/75 TRANG

### Đã xong thêm so với bản 17 — NT-3 CHO TOÀN BỘ MANAGEMENT & DIAGNOSIS (14 TRANG) — NHÓM CUỐI CÙNG

- **statusMgr, rebootAndReset, firmwareUpgr, usrCfgMgr, accountMgr, logMgr,
  networkDiag, mirror, loopbackDetect, arpTable, macTable, IPv6SwitchMgr,
  Ethconfig, EnergyMode** — cả 14 lên mức 3. Chỉ điều hướng menu để chụp
  DOM, KHÔNG bấm bất kỳ nút hành động nào (Reboot/Factory Reset/Firmware
  Upgrade/Backup/Restore/Download Log) trên thiết bị thật, đúng luật đã
  đặt ra từ đầu.
- **77/77 trang BE12000 nay đều đạt mức 3, trừ 2 trang Home/Topology (mức 1,
  không phải trang cấu hình nên không thuộc phạm vi NT-3).**

### LOẠI CHẤP NHẬN MỚI: token CSRF ngẫu nhiên (TOKEN_UPLOAD/TOKEN_DOWNLOAD/...)

- `firmwareUpgr`, `usrCfgMgr`, `logMgr` đều có các trường hidden dạng
  `TOKEN_UPLOAD`, `TOKEN_DOWNLOAD`, `TOKEN_SECLOG_DOWNLOAD`,
  `TOKEN_WIFILOG_DOWNLOAD` — chuỗi ngẫu nhiên 24 ký tự, thiết bị SINH MỚI
  MỖI LẦN tải trang (chống CSRF cho form upload/download). Hai lần chụp
  (that/gia_lap) luôn ra giá trị khác nhau dù cùng cơ chế sinh ngẫu nhiên
  — đây là hành vi ĐÚNG, không phải lỗi. Bổ sung vào danh sách CHẤP NHẬN
  cùng với: form-action redact, hàm JS dư từ lịch sử duyệt, giá trị
  telemetry sống (CPU/Uptime/Temp/Volt/ConntrackUsed/AgingTm), IF_URL_HOST.

### SỰ CỐ BẢO MẬT LẶP LẠI LẦN 3 — đã xử lý ngay (theo chính sách đã duyệt)

- Đúng như dự đoán ở bản 16 ("mỗi lần chụp mới đều phải kiểm tra lại"):
  `statusMgr` lộ lại `SerialNumber` thật dưới dạng gộp
  `"48D682-48D68292AF2A"` (OUI-SN) — đã sanitize thành
  `"AABBCC-AABBCCFAKE00"`.
  `arpTable` và `macTable` lộ lại MAC client LAN thật `d8:43:ae:2e:65:45`
  — đã sanitize thành `aa:bb:cc:00:00:01` ở cả 2 file.
  Tất cả đã sửa TRƯỚC KHI commit, đã quét lại xác nhận sạch.
- **Tổng kết quy tắc cho các thiết bị/phiên sau**: các trang đã từng có
  tiền sử rò rỉ (statusMgr, ponLoid, ponSn, arpTable, macTable, ethWanStatus)
  PHẢI được `grep` kiểm tra giá trị nhạy cảm đã biết ngay sau mỗi lần chụp
  vân tay mới, không có ngoại lệ — bất kể đã sanitize bao nhiêu lần trước
  đó cho cùng trang.

### Đang dở — làm tiếp từ đây (giai đoạn tiếp theo của dự án)

1. **Apply/ghi (POST) để lên mức 4** — chưa có bằng chứng HAR cho BẤT KỲ
   route nào trong toàn bộ 77 trang. Đây là công việc lớn tiếp theo: cần
   anh Huy bấm Apply ở từng trang trên thiết bị thật (một cách an toàn,
   không phá cấu hình hiện tại) trong khi ghi HAR, rồi đối chiếu tham số
   POST + định dạng response với `config_store`.
2. Không còn route nào cần NT-3 (khổ hẹp 980px) — toàn bộ đã xong.

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 17) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 16 — NT-3 CHO TOÀN BỘ VOIP (12 TRANG)

- **voipStatus, voipBasic, voipServices, sipIf, sipAdvanced, sip,
  sipDigitmap, sipMedia, sipslc, sipCallerID, fax, voipqos** — cả 12 lên
  mức 3. Toàn bộ lệch còn lại là 2 loại CHẤP NHẬN đã biết (form-action +
  hàm JS dư). Đã kiểm tra kỹ các trường tài khoản SIP (AuthUserName/
  AuthPassword/DigestUserName) — đều rỗng (chưa cấu hình), không có rò
  rỉ credential. Không phát sinh sự cố bảo mật mới.
- **Toàn bộ menu "VoIP" (12/12 trang) nay đạt mức 3.**

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3) cho 14 route còn lại ở mức 2**: Management & Diagnosis
   (14 trang) — nhóm menu cuối cùng còn thiếu NT-3.
2. Apply/ghi (POST) — vẫn CHƯA có bằng chứng HAR cho bất kỳ route nào.

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 16) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 15 — NT-3 CHO PHẦN INTERNET CÒN LẠI (12 TRANG) — HOÀN TẤT TOÀN BỘ "INTERNET"

- **parentCtrl, ddns, portBinding, rip, multicastmode, igmp, mld,
  multicastbasic, IgmpWLANCONF, portlocate, ponLoid, ponSn** — cả 12 lên
  mức 3. Tất cả lệch còn lại là form-action redact + hàm JS dư (2 loại
  CHẤP NHẬN đã biết).
- **Toàn bộ menu "Internet" (47/47 trang) nay đạt mức 3.**

### SỰ CỐ BẢO MẬT LẶP LẠI — đã xử lý ngay (theo chính sách đã duyệt)

- Y hệt sự cố MAC ở bản 14: khi chụp vân tay 980px LẦN ĐẦU cho `ponLoid`
  và `ponSn`, dữ liệu thật lại lộ ra trong file mới —
  `PonLoid = "123456789"` (đúng LOID thật đã biết từ 2026-08-04) và
  `Sn = "ZTEGdac25692"` (đúng SN thật đã biết). Lý do: mỗi lần chụp vân
  tay MỚI là một lần đọc trực tiếp từ DOM tab thật, không tự động thừa
  hưởng sanitize của các file cũ.
- Đã SANITIZE ngay 2 file `reference/vantay/ponLoid.that.980-1134.json`
  (→ `000000000`) và `reference/vantay/ponSn.that.980-1134.json`
  (→ `ZTEGFAKE0000`) trước khi commit, khớp đúng giá trị giả đã dùng
  trong `config_store`.
- **QUY TẮC BẮT BUỘC cho các phiên sau**: bất kỳ trang nào đã từng có
  tiền sử rò rỉ dữ liệu nhạy cảm (WiFi password, MAC, SerialNumber, LOID,
  credential mã hoá — xem danh sách đầy đủ ở đầu phiên) thì MỖI LẦN chụp
  vân tay mới (dù cùng trang, khác khổ màn hình) đều phải kiểm tra lại
  ngay sau khi lưu, KHÔNG được coi là "đã xử lý một lần là xong".

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3) cho 26 route còn lại ở mức 2**: VoIP (12), Management &
   Diagnosis (14).
2. Apply/ghi (POST) — vẫn CHƯA có bằng chứng HAR cho bất kỳ route nào.

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 15) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 14 — NT-3 CHO NHÓM INTERNET > SECURITY (6 TRANG)

- **filterCriteria, localServiceCtrl, alg, dmz, portForwarding,
  portTrigger** — cả 6 lên mức 3 (firewall đã ở mức 3 từ trước). Tất cả
  lệch còn lại đều thuộc 2 loại CHẤP NHẬN đã biết (form-action redact +
  hàm JS dư từ lịch sử duyệt — bản 13). filterCriteria có 4 form-action
  lệch (do có 4 tab con IP/MAC/URL/Global Filter), localServiceCtrl có 3
  (3 tab con IPv4/IPv6/Port). Không phát sinh sự cố bảo mật mới.
- **Toàn bộ nhóm "Internet > Security" (7/7 trang) nay đạt mức 3.**

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3) cho 38 route còn lại ở mức 2**: Internet còn lại
   (Parental/DDNS/Port Binding/Dynamic Routing/Multicast/Port Locating/PON
   Information, ~15), VoIP (12), Management & Diagnosis (14).
2. Apply/ghi (POST) — vẫn CHƯA có bằng chứng HAR cho bất kỳ route nào.

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 14) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 13 — NT-3 CHO NHÓM INTERNET > STATUS (6 TRANG)

- **ponopticalinfo, ethWanStatus, Wan3gStatus, tunnel4in6Status, l2tpStatus,
  conntracks** — cả 6 lên mức 3. Tất cả các lệch còn lại đều thuộc 4 loại
  CHẤP NHẬN đã biết: form-action redact (bản 13), hàm JS dư từ lịch sử duyệt
  tab thật (bản 13), giá trị cảm biến sống Volt/Temp (ponopticalinfo — đã
  biết từ 2026-08-04), và ConntrackUsed (conntracks — đã biết từ 2026-08-04).

### SỰ CỐ BẢO MẬT MỚI — đã xử lý ngay, không hỏi lại (theo chính sách đã duyệt)

- Khi chụp `ethWanStatus` ở khổ 980px, phát hiện MAC thật của thiết bị
  `48:d6:82:92:af:2a` (cùng OUI/SN đã biết `48D682...`, chỉ khác định dạng
  MAC có dấu hai chấm) lộ trong 3 file: `reference/vantay/ethWanStatus.
  that.980-1134.json` (file mới chụp phiên này), và **2 file cũ chưa từng
  được quét** vì lần quét trước (2026-08-04) chỉ tìm theo định dạng hex
  liền `48D68292AF2A` chứ không tìm định dạng MAC có dấu hai chấm:
  `reference/goi_tai_ve/be12000-data-2026-08-03.json` và
  `reference/source/data/topo_lua.lua`.
- Đã SANITIZE cả 3 file: `48:d6:82:92:af:2a` → `aa:bb:cc:00:00:02`, giữ
  nguyên cấu trúc file. Đã xác minh `config_store` (factory.json/
  instance-01.json) KHÔNG chứa giá trị thật này — sim vốn đã trả MAC giả.
- **Bài học cho các phiên sau**: khi quét lại để tìm rò rỉ dữ liệu nhạy
  cảm, phải tìm CẢ hai định dạng của cùng một định danh (hex liền và
  MAC có dấu hai chấm/gạch ngang), không chỉ định dạng đã biết.

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3) cho 44 route còn lại ở mức 2**: Internet > Security (6-7),
   Internet còn lại (Parental/DDNS/Port Binding/Dynamic Routing/Multicast/
   Port Locating/PON Information, ~15), VoIP (12), Management & Diagnosis
   (14).
2. Apply/ghi (POST) — vẫn CHƯA có bằng chứng HAR cho bất kỳ route nào.

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 13) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 12 — NT-3 CHO NHÓM INTERNET > WAN (4 TRANG)

- **ethWanConfig, Wan3gConfig, tunnel4in6Config, l2tpConfig** — cả 4 lên mức 3.
  ethWanConfig 418/418, Wan3gConfig 147/147 khớp tuyệt đối. tunnel4in6Config
  124/125, l2tpConfig 114/115 — mỗi trang lệch đúng 1 chỗ, cả hai đều thuộc
  loại CHẤP NHẬN mới phát hiện phiên này (xem 2 mục dưới).

### Hai loại lệch CHẤP NHẬN mới (bổ sung vào danh sách đã có ở bản 11/12)

1. **`SPAN.form-action` bị redact khác nhau giữa 2 tab** — tab thật hiện
   `"[FORM-ACTION]"` (rút gọn toàn bộ), tab giả lập hiện
   `"/[FORM-ACTION]menuData[FORM-ACTION]tunnel_4in6_config_lua.lua"` (chỉ
   rút gọn từng phần). Nguyên nhân: script `guiVanTay` tiêm vào tab thật là
   bản CŨ (tiêm từ phiên trước, tab thật mở liên tục nhiều ngày không
   reload), còn tab giả lập được tiêm lại bản MỚI trong phiên này (do phải
   tiêm lại — xem mục "Lỗi phát hiện" bên dưới). Đây là lỗi của CÔNG CỤ đo,
   không phải lỗi của trang. Không chặn lên mức 3.
2. **"Hàm JS thiếu" là hàm của TRANG KHÁC còn sót trong `window`** — so DOM
   báo 29 hàm "thiếu" ở gia_lap (`Customize_DHCPBasicCfg`,
   `g_getSIMStatus_handle`, `PINWarnChangeByRemainTime`, ...) khi so
   tunnel4in6Config/l2tpConfig. Đã xác minh: các hàm này định nghĩa trong
   `lanMgrIpv4.html` và `Wan3gConfig.html`, KHÔNG liên quan đến DSLite/L2TP.
   Lý do: tab thật (192.168.1.1) đã điều hướng qua rất nhiều trang khác
   trong suốt các phiên trước (SPA không reload), nên `window` tích luỹ hàm
   của mọi trang từng ghé qua. Tab giả lập vừa mới điều hướng thẳng tới
   trang này nên không có các hàm thừa đó. Đây là dấu vết lịch sử duyệt của
   tab đo, không phải lỗi cấu trúc trang. Không chặn lên mức 3.

### Lỗi phát hiện và đã sửa trong phiên này

- Tab giả lập bị mất trạng thái điều hướng (menu quay về Home/Topology) —
  phải bấm lại `internet` → `internetConfig` → `tunnel4in6Config` mới vào
  đúng trang. Khi đó phát hiện `window.guiVanTay` đã bị mất (tab có thể đã
  bị Chrome giải phóng bộ nhớ / reload ngầm) — phải tiêm lại toàn bộ script
  `van_tay_dom.js` + `guiVanTay`.
- Sau khi tiêm lại, khổ màn hình tab giả lập đo được 462×534 thay vì
  980×1019 — DevTools Device Toolbar đã tắt. Đã nhờ anh Huy bật lại
  (F12 → Ctrl+Shift+M → 980 × bất kỳ → zoom 100%), xác minh lại
  `window.innerWidth === 980` trước khi đo tiếp.
- `_totalTabWidth` đo lần đầu ở tunnel4in6Config ra 0 (thật là 378) — do
  đọc DOM ngay sau khi bấm chuyển tab, script tính độ rộng tab-bar chưa
  chạy xong. Đợi thêm (1.2s thay vì 0.6s) rồi đo lại ra đúng 378. Bài học:
  các trang thuộc nhóm tab con (WAN/3G/DSLite/L2TP dùng chung
  `class3MenuMainContent`) cần đợi lâu hơn 600ms sau khi bấm chuyển tab
  trước khi chụp vân tay.

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3) cho 50 route còn lại ở mức 2**: Internet > Status (6),
   Internet > Security (6), Internet còn lại (Parental/DDNS/Port
   Binding/Dynamic Routing/Multicast/Port Locating/PON Information, ~15),
   VoIP (12), Management & Diagnosis (14) — quy trình đã ổn định, chú ý 3
   điểm rút kinh nghiệm ở trên (kiểm tra `guiVanTay` còn tồn tại, kiểm tra
   khổ màn hình trước mỗi lần đo, đợi đủ lâu với trang có tab con).
2. Apply/ghi (POST) — vẫn CHƯA có bằng chứng HAR cho bất kỳ route nào.

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 12) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 11 — HOÀN TẤT NT-3 CHO TOÀN BỘ "LOCAL NETWORK" (19 TRANG)

- **LAN & Routing (4 trang)** — lanMgrIpv4, lanMgrIpv6, routeIpv4, routeIpv6.
  So DOM @980: 3/4 sạch tuyệt đối; lanMgrIpv4 196/197 (1 lệch là
  `IF_URL_HOST` hidden field = host của trình duyệt, 192.168.1.1 thật vs
  localhost giả lập — không phải lỗi, đã biết từ thiết kế).
- **Dịch vụ mạng (7 trang)** — ftp, upnp, bpdu, dms, samba, dns,
  usbfunccfg. So DOM @980: sạch tuyệt đối cả 7 (66/66, 86/86, 52/52, 73/73,
  107/107, 105/105, 52/52).
- **Toàn bộ "Local Network" (19/19 trang) nay đạt mức 3.**

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3) cho 54 route còn lại ở mức 2**: toàn bộ Internet (47
   trang), VoIP (12 trang), Management & Diagnosis (14 trang) — quy trình đã
   ổn định (xem bản 11), làm nhanh hơn các phiên tới. Lưu ý: 47+12+14=73,
   trừ đi phần đã tính sai ở bản 11 — con số chính xác lấy theo STATUS.md
   (muc 2: 54).
2. Nhóm menu lớn tiếp theo cho NT-3: gợi ý theo đúng thứ tự đã dựng —
   Internet > WAN (4) → Status (6) → Security (6) → phần còn lại → VoIP →
   Management & Diagnosis.
3. Apply/ghi (POST) — vẫn CHƯA có bằng chứng HAR cho bất kỳ route nào.

---

## ĐIỂM DỪNG PHIÊN 2026-08-05 (bản 11) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 10 — BẮT ĐẦU KIỂM KHỔ HẸP (NT-3), NHÓM WLAN (8 TRANG)

- **Công cụ `thu_van_tay.py` dùng lại được đầy đủ**: anh Huy tự chạy
  `chay_thu_van_tay.bat` và `chay_server.bat` trên máy anh (ngoài sandbox của
  Claude), nên receiver cổng 8199 sống suốt phiên và trình duyệt POST thẳng
  vào đó — không còn bị chặn "[BLOCKED: Cookie/query string data]" như hôm
  qua. Từ nay có thể quay lại quy trình so DOM đầy đủ (từng dòng + toạ độ).
- **Khổ hẹp NT-3 = 980px chiều rộng** (theo đúng tiền lệ đã dùng cho
  Firewall/SNTP, không phải 390 mobile). Cách thực hiện: mở DevTools của
  Chrome (F12) → bật Device Toolbar → đặt Dimensions "Responsive" 980 x
  (tuỳ) → **zoom phải để 100%** (để 50% sẽ làm `window.innerWidth` báo sai
  giá trị chia nhỏ — đã gặp lỗi này và anh Huy đã sửa). `resize_window` của
  công cụ trình duyệt KHÔNG dùng được (báo thành công nhưng không đổi kích
  thước thật) — phải nhờ anh Huy tự bật DevTools Device Toolbar.
- **8 trang nhóm WLAN đạt mức 3** (localNetStatus, wlanBasic, wlanAdvanced,
  wps, wlanStaScanAP, wifibandsteer, WLANMLO, smNetSphereMAP). So DOM @980:
  7/8 trang sạch tuyệt đối (290/290, 275/275, 117/117, 92/92, 79/79, 60/60,
  77/77); localNetStatus 259/263 (4 lệch là số liệu lưu lượng LAN đang chạy
  — chấp nhận, cùng loại với lệch CPU/Uptime đã ghi nhận trước đây).

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3) cho 65 route còn lại ở mức 2** (12 Local Network còn lại:
   LAN&Routing 4 + Dịch vụ mạng 7 + toàn bộ Internet 47 + VoIP 12 - đã trừ 8
   WLAN vừa xong... thực ra cần kiểm: 4 LAN&Routing, 7 Dịch vụ mạng, 47
   Internet, 12 VoIP, 14 Management&Diagnosis, trừ dần theo từng phiên).
   Quy trình đã ổn định, có thể làm nhanh hơn các phiên tới.
2. Apply/ghi (POST) — vẫn CHƯA có bằng chứng HAR cho bất kỳ route nào.
3. Nhớ: mỗi lần mở tab mới hoặc F5, phải bật lại DevTools Device Toolbar
   980px + zoom 100% (không tự giữ qua lần tải lại trang, nhưng theo dõi
   thực tế thấy giữ được qua chuyển trang trong cùng tab, chỉ mất khi tạo
   tab mới hoặc đóng DevTools).

---

## ĐIỂM DỪNG PHIÊN 2026-08-04 (bản 10) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 9 — NHÓM MANAGEMENT & DIAGNOSIS (14 TRANG) — HOÀN TẤT TOÀN BỘ 77 TRANG Ở MỨC TỐI THIỂU 2

- **14 trang**: Status, System Management (Device Management, Software Upgrade,
  User Configuration Management — 3 tab), Account Management, Log Management,
  Diagnosis (Network Diagnosis, Mirror Configuration, Loopback Detection, ARP
  Table, MAC Table — 5 tab), IPv6 Switch, Uplink Mode Switch, Energy
  Conservation. ~20 dataTag (9 đã có sẵn từ Giai đoạn 0, 15 mới lấy phiên này).
- Đối chiếu bằng SỐ LƯỢNG PHẦN TỬ DOM có ý nghĩa (@1536, xem lý do đổi phương
  pháp bên dưới) cho cả 14 trang: khớp tuyệt đối ở mọi trang (78/78, 93/93,
  47/47, 57/57, 126/126, 136/136, 182/182, 77/77, 142/142, 56/56, 54/54, 54/54,
  52/52, 53/53).
- **Toàn dự án BE12000 nay đạt tối thiểu mức 2 ở cả 77/77 trang** (2 mức 1:
  Home/Topology — không có dataTag riêng để đối chiếu sâu hơn; 2 mức 3:
  Firewall, SNTP; 73 mức 2).

### ⚠️ SỰ CỐ BẢO MẬT THỨ HAI PHÁT HIỆN VÀ SỬA (khác voi Sn/PonLoid ở bản 8)

- Trang Status hiển thị "Device Serial No." = OUI + Serial ghép từ 2 field
  RIÊNG trong `OBJ_DEVINFO_ID` (`devmgr_statusmgr_lua.lua`): `ManuFacturerOui`
  = `48D682` (thật), `SerialNumber` = `48D68292AF2A` (thật — khác với
  `OBJ_SN_INFO_ID.Sn` đã sanitize ở bản 8, đây là 2 định danh serial RIÊNG
  BIỆT của cùng thiết bị).
- Phát hiện giá trị thật này đã nằm KHÔNG sanitize trong 4 file: `src/state/
  factory.json`, `src/state/instance-01.json`,
  `reference/goi_tai_ve/be12000-data-2026-08-03.json`,
  `reference/source/data/devmgr_statusmgr_lua.lua` (từ Giai đoạn 0, trước cả
  phiên trước).
- Áp dụng ĐÚNG chính sách đã được anh Huy duyệt cho toàn bộ phần còn lại của
  dự án (không cần hỏi lại): sanitize `SerialNumber` → `AABBCCFAKE00`,
  `ManuFacturerOui` → `AABBCC` ở cả 4 file, xác nhận không còn giá trị thật
  bằng grep toàn repo.
- Cũng phát hiện và sanitize **MAC thật của 1 thiết bị client trên mạng LAN**
  (không phải MAC của chính BE12000) xuất hiện trong `arp_arptable_lua.lua`
  và `macinfo_mactable_lua.lua` (`d8:43:ae:2e:65:45` → `aa:bb:cc:00:00:01`).
  Đây là dữ liệu thật của một thiết bị đang kết nối vào mạng nhà anh Huy lúc
  chụp bằng chứng, không phải dữ liệu của chính thiết bị BE12000 — vẫn là dữ
  liệu cá nhân cần bảo vệ theo đúng tinh thần chính sách.

### ⚠️ PHÁT HIỆN VỀ MÔI TRƯỜNG/CÔNG CỤ — ẢNH HƯỞNG ĐẾN CÁC PHIÊN SAU

- **`tools/thu_van_tay.py` (receiver cổng 8199) không còn dùng lại được**:
  môi trường sandbox chạy lệnh shell của Claude giờ khởi tạo container MỚI
  HOÀN TOÀN cho MỖI lệnh bash riêng lẻ (xác nhận qua `ps aux` thấy tiến trình
  nền bị dọn sạch giữa 2 lệnh liên tiếp). Không thể giữ tiến trình nền sống
  qua nhiều lệnh bash nữa như các phiên trước.
- **Hệ quả**: phải lấy dấu vân tay DOM (`van_tay_dom.js`) trực tiếp qua kết
  quả trả về của lệnh chạy JavaScript trên trình duyệt, thay vì để trang tự
  POST sang receiver cục bộ.
- **Phát hiện thêm**: chuỗi JSON đầy đủ của dấu vân tay bị bộ lọc an toàn
  chặn (`[BLOCKED: Cookie/query string data]`) vì MỌI trang của dự án này có
  1 phần tử `<address><span class="form-action">/?_type=menuData&_tag=...`
  ẩn — nội dung này trông giống chuỗi query-string/cookie nên bị chặn không
  cho hiển thị ra ngoài. Đã xử lý bằng cách chỉnh `van_tay_dom.js` (chỉ trong
  bản dùng cho phiên này) để thay nội dung dạng `_type=...&_tag=...` bằng
  nhãn `[FORM-ACTION]` trước khi in ra — vẫn giữ được cấu trúc (tag, id, vị
  trí) để đối chiếu, chỉ ẩn đúng phần văn bản gây chặn.
- **Do vẫn còn giới hạn** (lấy toàn bộ danh sách dòng chi tiết cho 1 trang
  tốn nhiều lượt gọi vì máy chủ trả về từng đoạn ~1000-1500 ký tự), phiên này
  đối chiếu bằng SỐ LƯỢNG phần tử có ý nghĩa (thay vì so từng dòng + toạ độ
  như các nhóm trước) cho toàn bộ 14 trang. Số lượng khớp tuyệt đối ở mọi
  trang là bằng chứng cấu trúc mạnh (không thiếu/thừa phần tử nào), kết hợp
  với việc đã xác nhận riêng từng dataTag khớp đúng tên đối tượng/trường với
  thiết bị thật qua fetch() trực tiếp.
- **Khuyến nghị cho phiên sau**: nếu cần đối chiếu chi tiết từng dòng + toạ
  độ như trước (mức 3 trở lên, hoặc khi nghi ngờ có lệch), cân nhắc: dùng
  phiên bản `van_tay_dom.js` đã có sẵn nhãn `[FORM-ACTION]` này, và lấy nội
  dung theo từng đoạn nhỏ (< 1000 ký tự) thay vì toàn bộ cùng lúc.

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3)** cho tất cả route mức 2 — CHƯA kiểm (nợ tích luỹ nhiều
   phiên).
2. **Toàn bộ 77 trang đã đạt mức tối thiểu 2.** Việc còn lại là NÂNG mức (3,
   4) cho các trang đã có, không phải dựng trang mới.
3. Apply/ghi (POST): CHƯA có bằng chứng HAR cho bất kỳ route nào (toàn dự
   án) — đây là điều kiện để lên mức 4.
4. Đã commit git nhóm Management & Diagnosis ngay sau khi cập nhật xong tài
   liệu này.

---

## ĐIỂM DỪNG PHIÊN 2026-08-04 (bản 9) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 8 — NHÓM VOIP (12 TRANG) — mức 2

- **12 trang VoIP**: Status, Basic, VoIP Services, Network Interface, Advanced,
  SIP Protocol, Digital Map, Media, SLIC configuration, Caller ID, FAX, QoS.
  14 dataTag (16 lượt capture — 3 trang có accordion phụ: `voipStatus` +
  `VOIPPhoneStatusBar`, `sipAdvanced` + `VOICEPROCBar`, `voipqos` +
  `VoIPQoSConf_MediaBar`). 3/14 dataTag là mới hoàn toàn với store
  (`voipVpPhyinterface_lua.lua`, `voip_voiceproc_lua.lua`,
  `Voip_Voip_QoS_Media_lua.lua`), 11/14 đã có sẵn từ lần quét rộng ở Giai
  đoạn 0.
- So DOM @1536 cho cả 12 trang: **0 thiếu, 0 thừa, 0 JS thiếu** ở tất cả
  (69/69, 108/108, 256/256, 68/68, 130/130, 158/158, 70/70, 180/180, 72/72,
  68/68, 78/78, 114/114).
- Không phát hiện dữ liệu nhạy cảm nào: các trường tài khoản SIP
  (AuthUserName/AuthPassword/DigestUserName) đều rỗng vì chưa cấu hình tài
  khoản SIP thật trên thiết bị; mật khẩu (nếu có) không bao giờ được trả về
  (đúng quy ước `<encode>` đã thấy ở các nhóm trước). `SipServer = "vIMS GMA"`
  là tên hệ thống của nhà mạng, không phải thông tin cá nhân, giữ nguyên
  không sanitize.

### Ghi chú kỹ thuật: lệch chiều cao viewport (không ảnh hưởng)

- Tab giả lập bị kẹt ở `1536x639` trong khi tab thật ở `1536x695`. Gọi
  `resize_window` báo thành công nhưng `window.innerHeight` đo lại vẫn là
  639 — có thể do giới hạn cửa sổ hệ thống, không sửa được trong phiên này.
- Quyết định: chấp nhận kết quả hiện tại vì so_dom chỉ cảnh báo "so sánh
  toạ độ sẽ vô nghĩa" (do khác chiều cao), còn số lượng/tên/giá trị phần tử
  và hàm JS đã khớp tuyệt đối ở cả 12 trang — không có breakpoint CSS nào
  phụ thuộc chiều cao trên các trang VoIP này. Nếu phiên sau cần đối chiếu
  toạ độ chính xác, cần thử resize lại hoặc dùng cửa sổ trình duyệt khác.

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3)** cho tất cả route mức 2 — CHƯA kiểm (nợ tích luỹ từ các
   phiên trước, chưa làm).
2. **VoIP đã xong 100% (mức tối thiểu 2)**. Nhóm menu lớn tiếp theo:
   Management & Diagnosis (14 trang).
3. Apply/ghi (POST): CHƯA có bằng chứng HAR cho bất kỳ route nào (toàn dự án).
4. Đã commit git nhóm VoIP ngay sau khi cập nhật xong tài liệu này.

---

## ĐIỂM DỪNG PHIÊN 2026-08-04 (bản 8) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 7 — HOÀN TẤT TOÀN BỘ MENU "INTERNET"

- **8 trang cuối của Internet — mức 2**: Multicast Mode, IGMP, MLD, Basic,
  Multicast on Wi-Fi, Port Locating, PON Information (LOID + SN). Toàn bộ 30
  route con của "Internet" (không tính Home/Topology) nay đã đạt tối thiểu
  mức 2 (28 route mức 2 + 2 route mức 3: Firewall, SNTP).
  So DOM @1536: cả 8 trang sạch tuyệt đối (52/52, 53/53, 53/53, 54/54, 57/57,
  92/92, 53/53, 58/58).

### ⚠️ SỰ CỐ BẢO MẬT ĐÃ PHÁT HIỆN VÀ SỬA

- Khi lấy bằng chứng cho `ponLoid`/`ponSn`, phát hiện **2 giá trị thật đã bị
  lưu KHÔNG sanitize từ TRƯỚC phiên này** (từ commit `1ba35a0`, nhóm WLAN,
  ngày 2026-08-04 phiên trước):
  - `PonLoid = "123456789"` (mã LOID GPON thật, gắn với tài khoản ISP)
  - `Sn = "ZTEGdac25692"` (số serial thật của thiết bị)
  Cả hai nằm trong `src/state/factory.json` và `src/state/instance-01.json`
  (dùng cho giả lập) VÀ trong 2 file bằng chứng thô ở `reference/`:
  `reference/goi_tai_ve/be12000-data-2026-08-03.json`,
  `reference/source/data/poninfo_loid_lua.lua`,
  `reference/source/data/devmgr_statusmgr_lua.lua` (4 file tổng cộng).
- Đã hỏi và được anh Huy xác nhận: **sanitize luôn cả các file trong
  `reference/`** — ngoại lệ 1 lần cho quy tắc 2.3 (reference chỉ đọc) vì lý do
  bảo mật, đã thay `PonLoid` → `000000000`, `Sn` → `ZTEGFAKE0000` ở TẤT CẢ 4
  file, giữ nguyên mọi thứ khác.
- Đã rà toàn bộ repo bằng grep để xác nhận không còn giá trị thật nào sót lại
  (kiểm tra cả các match giả — chuỗi `"123456789"` còn xuất hiện ở nhiều nơi
  khác nhưng đó là bảng ký tự base64/hex của thư viện mã hoá (`crypto-js`,
  `jsencrypt`, `common_lib.js`), KHÔNG liên quan đến LOID, đã xác minh kỹ
  bằng cách xem ngữ cảnh xung quanh trước khi kết luận an toàn, không đụng
  vào).
- **Lưu ý cho các phiên sau**: giá trị thật này đã từng NẰM TRONG GIT HISTORY
  ở commit `1ba35a0` (không thể xoá khỏi history nếu không rebase/force-push
  — anh Huy chưa yêu cầu việc này, chỉ yêu cầu sửa bản hiện tại). Nếu cần xoá
  hẳn khỏi lịch sử git, cần hỏi anh Huy riêng vì đây là thao tác nguy hiểm
  (rewrite history).
- **Bài học quy trình**: mọi trường "định danh thật" của thiết bị (serial,
  LOID, MAC, SSID, mật khẩu WiFi...) phải được kiểm tra và sanitize NGAY khi
  lần đầu xuất hiện trong bất kỳ dataTag nào — kể cả khi nó xuất hiện gián
  tiếp qua `nguon` dùng chung với route đã làm trước đó (ở đây `OBJ_SN_INFO_ID`
  được `devmgr_statusmgr_lua.lua` — route CHƯA làm — tham chiếu tới trước khi
  `poninfo_sn_lua.lua` — route ĐANG làm — merge dữ liệu, nên giá trị thật đã
  "ẩn náu" từ sớm mà không bị phát hiện).

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3)** cho 47 route mức 2 — CHƯA kiểm.
2. **"Internet" đã xong 100% (mức tối thiểu 2)**. Nhóm menu lớn tiếp theo:
   VoIP (12 trang) hoặc Management & Diagnosis (14 trang).
3. Apply/ghi (POST): CHƯA có bằng chứng HAR cho bất kỳ route nào.
4. Chưa commit git nhóm này (làm ngay sau khi cập nhật xong tài liệu) — commit
   message cần nêu rõ sự cố bảo mật đã sửa.

---

## ĐIỂM DỪNG PHIÊN 2026-08-04 (bản 7) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 6

- **4 trang lẻ còn lại của Internet (6 dataTag) — mức 2**: Parental Controls,
  DDNS, Port Binding, Dynamic Routing (RIP+RIPng). Tổng 39/77 route ở mức 2
  (cộng 2 route mức 3 = 41/77 route đạt tối thiểu mức 2).
  So DOM @1536: parentCtrl 222/222, ddns 100/100, portBinding 176/176,
  rip 84/84 — sạch tuyệt đối cả 4, không cả false-positive.
  Còn lại của Internet: Multicast (5 trang), Port Locating, PON Information
  (2 trang) — chưa làm.
- `fpt_ddns_status_model.lua` (accordion "Dynamic DNS Reporting" trong trang
  DDNS) là dataTag JSON thuần thứ 2 phát hiện được (sau `wlan_mlo_model.lua`),
  xử lý bằng cơ chế `jsonDataTags` đã có sẵn trong `config_store.py` — không
  cần sửa code, chỉ thêm dữ liệu.
- Ghi nhận 1 quy ước lạ của thiết bị: `route_ripng_m.lua` (RIPng) trả ParaName
  dạng `OBJ_RIPNG_ID.RipngEnabled` (lặp lại tên object + dấu chấm ở đầu mỗi
  ParaName) thay vì tên trường trần như mọi dataTag khác. Đã xác nhận đúng
  nguyên văn từ bằng chứng thật (không phải lỗi gõ), giữ nguyên khi lưu.
- Không có dữ liệu nhạy cảm trong nhóm này (DDNS/RIP đều chưa cấu hình, mật
  khẩu/khóa xác thực đều rỗng và có thẻ `<encode>` không trả giá trị).

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3)** cho 39 route mức 2 — CHƯA kiểm.
2. Phần còn lại của Internet: Multicast (5 trang: Multicast Mode, IGMP, MLD,
   Basic, Multicast on Wi-Fi), Port Locating, PON Information (LOID, SN) —
   8 trang, có thể làm 1 nhóm.
3. Sau đó: VoIP (12 trang), Management & Diagnosis (14 trang).
4. Apply/ghi (POST) cho 39 route mức 2: CHƯA có bằng chứng HAR.
5. Chưa commit git nhóm này (làm ngay sau khi cập nhật xong tài liệu).

---

## ĐIỂM DỪNG PHIÊN 2026-08-04 (bản 6) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 5

- **Nhóm Internet > Security (6 route, 11 dataTag) — mức 2**: filterCriteria,
  localServiceCtrl, alg, dmz, portForwarding, portTrigger (Firewall đã mức 3 từ
  trước). Tổng 35/77 route ở mức 2, cộng 2 route mức 3 (Firewall, SNTP) = 37/77
  route đạt tối thiểu mức 2.
  So DOM @1536: filterCriteria 381/381, localServiceCtrl 294/294, alg 106/106,
  dmz 83/83, portForwarding 157/157, portTrigger 143/143 — sạch tuyệt đối (chỉ 1
  false-positive hàm JS do lịch sử điều hướng tab, không tính là lỗi).
  Không có dữ liệu nhạy cảm nào trong nhóm này (không MAC/mật khẩu thật).
  Rút kinh nghiệm từ bản 5: đã cập nhật `cgi-map.json` NGAY sau khi gộp dữ liệu
  (trước khi restart server lần đầu), nên không lặp lại lỗi SessionTimeout.
- Ghi nhận thêm 1 quy ước của thiết bị: nhiều dataTag trả object RỖNG dạng
  `<OBJ_xxx_ID></OBJ_xxx_ID>` (không `<Instance>` nào) khi chưa có rule cấu
  hình (IP/URL Filter, Service Control IPv4/IPv6, Port Forwarding, Port
  Trigger). Phải phân biệt với thẻ vô hướng thật (như `DongleStatus`) dựa vào
  quy ước tên `OBJ_*_ID` của thiết bị này — đã xử lý trong script gộp
  (`TEN_OBJ_RE`), không cần sửa `config_store.py`.
- Nhiều trang trong nhóm này có accordion con (Filter Criteria: IP/MAC/URL
  Filter; Local Service Control: IPv4/IPv6/Port Control) — đã bấm mở hết từng
  accordion trước khi so DOM, đúng yêu cầu NT-2 "quét đến tận cùng".

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3)** cho 35 route mức 2 — CHƯA kiểm.
2. Nhóm menu lớn tiếp theo: Internet còn lại (Parental Controls, DDNS, Port
   Binding, Dynamic Routing, Multicast, Port Locating, PON Information), VoIP,
   hoặc Management & Diagnosis.
3. Apply/ghi (POST) cho 35 route mức 2: CHƯA có bằng chứng HAR.
4. Chưa commit git nhóm Internet > Security (làm ngay sau khi cập nhật xong
   tài liệu).

---

## ĐIỂM DỪNG PHIÊN 2026-08-04 (bản 5) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 4

- **Nhóm Internet > Status (6 route) — mức 2**: ponopticalinfo, ethWanStatus,
  Wan3gStatus, tunnel4in6Status, l2tpStatus, conntracks. Tổng 29/77 route ở mức 2.
  So DOM @1536: ethWanStatus 250/250, Wan3gStatus 112/112, tunnel4in6Status 60/60,
  l2tpStatus 102/102 sạch tuyệt đối. ponopticalinfo 61/61 (2 lệch là cảm biến
  Volt/Temp đổi theo thời gian thực). conntracks 49/50 (1 lệch là ConntrackUsed —
  số kết nối NAT đang hoạt động, đổi liên tục). Cả hai đều KHÔNG phải lỗi, chỉ là
  giá trị telemetry sống thay đổi giữa 2 lần chụp khác thời điểm.
- **Tự phát hiện và sửa 1 lỗi thực sự trong lúc kiểm chứng `l2tpStatus`**: trang bị
  văng thẳng về Home ngay sau khi tải (không phải do JS lỗi, mà do server trả nhầm
  `SessionTimeout`). Nguyên nhân: `l2tp_lua.lua` được DÙNG CHUNG bởi 2 view
  (`l2tpConfig` ở nhóm Internet>WAN đã làm trước, và `l2tpStatus` ở nhóm này), nhưng
  `cgi-map.json` mới chỉ khai `l2tpConfig` là view hợp lệ cho tag này. Cơ chế
  `_dung_ngu_canh()` trong `dispatch.py` (mục 4.3 CLAUDE.md) kiểm tra
  `view_hien_tai in cho_phep`, nên khi mở `l2tpStatus` thì bị chặn nhầm, và JS gốc
  của thiết bị (xử lý `SessionTimeout` đúng như thiết kế) tự điều hướng về Home.
  Đã sửa bằng cách thêm route `l2tpStatus` vào `dataTagsByRoute` trong
  `cgi-map.json` (cơ chế `ban_do_ngu_canh` vốn đã hỗ trợ 1 dataTag → nhiều view,
  chỉ thiếu khai báo). **Bài học**: mọi khi một dataTag được dùng lại ở route mới
  (không chỉ route đầu tiên phát hiện ra nó), PHẢI cập nhật `cgi-map.json` ngay,
  không chỉ cập nhật `factory.json`/`instance-01.json`.
- Phát hiện và sanitize thêm 1 chỗ dữ liệu thật: `ethWanStatus` (dataTag
  `wan_internetstatus_lua.lua`) cũng trả `WorkIFMac` (MAC WAN thật, cùng giá trị
  với `ethWanConfig`) — đã thay bằng giá trị giả `00:11:22:33:44:55` cả trong XML
  gốc lẫn trong file vân tay DOM (`reference/vantay/ethWanStatus.that.1536-639.json`).
- Ghi nhận tham số phụ mới: `wan_internetstatus_lua.lua` cần
  `&TypeUplink=2&pageType=1` — LƯU Ý `pageType=1` ở đây khác với `pageType=0` của
  `wan_internet_lua.lua` (trang cấu hình). Dễ nhầm nếu copy nhầm tham số.

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3)** cho 29 route đã xong mức 2 — CHƯA kiểm.
2. Nhóm menu lớn tiếp theo: Internet còn lại (Security, Parental Controls, DDNS,
   SNTP còn dở mức 3, Port Binding, Dynamic Routing, Multicast, Port Locating, PON
   Information), VoIP, hoặc Management & Diagnosis.
3. Apply/ghi (POST) cho 29 route đã xong mức 2: CHƯA có bằng chứng HAR.
4. Chưa commit git nhóm Internet > Status (làm ngay sau khi cập nhật xong tài liệu).

---

## ĐIỂM DỪNG PHIÊN 2026-08-04 (bản 4) — đọc mục này trước khi làm tiếp

### Đã xong thêm so với bản 3

- **Nhóm Internet > WAN (4 route) — mức 2**: ethWanConfig, Wan3gConfig,
  tunnel4in6Config, l2tpConfig. "Local Network" (19 route) + nhóm này = 23/77 route
  ở mức 2.
  So DOM @1536: Wan3gConfig 147/147, tunnel4in6Config 125/125, l2tpConfig 115/115 —
  sạch tuyệt đối. ethWanConfig 417/418 (1 lệch đã biết, xem dưới).
- Ngoại lệ định dạng response mới phát hiện, đã tổng quát hoá trong `config_store.py`
  (`_sinh_khoi_obj`, cơ chế `renderOrder`/`scalarTags`):
  1. `wan_internet_lua.lua` trả object tên `ID_WAN_COMFIG` (không tiền tố `OBJ_`,
     tên còn viết sai chính tả "COMFIG").
  2. Thẻ **vô hướng (scalar) đứng trần**, không bọc `OBJ_.../Instance`, có 2 dạng:
     - toàn bộ response chỉ có the vô hướng (`wan_3gLTE_config_lua.lua`: chỉ có
       `DongleStatus`, `DevType`, `DongleType`).
     - xen giữa các khối OBJ (`wwan_pin_lua.lua`: `<DongleStatus>` rồi mới đến
       `<OBJ_WWANPINCFG_ID>`).
  Đã kiểm tra để KHÔNG phá vỡ 40+ dataTag cũ (dùng nhánh mặc định khi không có
  `renderOrder`).
- Sửa 1 mục ISSUES cũ (`wan_internet_lua.lua` gọi trả 404 — ghi ngày 2026-08-03):
  đã tìm ra nguyên nhân, cần thêm 2 tham số `&TypeUplink=2&pageType=0` vào query
  string (không chỉ `_tag`). Xem mục cập nhật bên dưới.
- **Phát hiện và tự sửa 1 báo động giả (false alarm) trong lúc kiểm chứng**: lần so
  DOM đầu tiên cho `ethWanConfig` báo thiếu tới 190 phần tử phía bản giả lập. Truy
  ra nguyên nhân: tab trình duyệt của **thiết bị thật** đã bị bấm thử (mở/đóng kết
  nối) nhiều lần trong các phiên trước, khiến trang thật tự sinh ra **2 bản sao
  trùng id** `template_Internet_0` / `instName_Internet:0` (1 bản hiện, 1 bản tồn
  đọng ẩn với dữ liệu mặc định cũ) — đây là lỗi tích tụ trạng thái do thao tác thử
  nghiệm của tôi, KHÔNG PHẢI hành vi gốc của thiết bị và KHÔNG PHẢI lỗi bản giả lập.
  Đã xác minh lại bằng cách tải lại trang thật từ đầu (F5), bấm mở đúng 1 lần: chỉ
  còn 1 bản, khớp hệt bản giả lập. Đã chụp lại bằng chứng `reference/vantay/
  ethWanConfig.that.1536-639.json` ở trạng thái sạch. **Bài học quy trình**: sau
  này khi so DOM cho trang có "mở rộng/thu gọn" (accordion, connection list...),
  nên load lại tab thật (F5) trước khi chụp, tránh lịch sử thao tác cũ làm nhiễu.
- Lệch còn lại DUY NHẤT ở `ethWanConfig` (đã CHẤP NHẬN, không phải lỗi): trường
  `UserName` hiển thị ciphertext giả (sanitize) trên bản giả lập, trong khi thiết
  bị thật giải mã JS ra `"fpt"` (giá trị mặc định của FPT Telecom, không định danh
  cá nhân). Nguyên nhân giống hệt vấn đề DHCPBasicCfg đã ghi ở bản 3: không tái
  tạo thẻ `<encode>UserName,Password</encode>` để tránh crypto-js crash trắng form.
  Đã thay `WorkIFMac` (MAC WAN thật) và `UserName` (mã hoá username PPPoE thật)
  bằng giá trị giả theo đúng chính sách bảo mật đã thống nhất với anh Huy.

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3)** cho 23 route đã xong mức 2 (19 Local Network + 4 WAN) — CHƯA kiểm.
2. Nhóm menu lớn tiếp theo cần chọn: Internet (các mục còn lại: Status, Security,
   Parental Controls, DDNS, SNTP còn dở, Port Binding, Dynamic Routing, Multicast,
   Port Locating, PON Information), VoIP, hoặc Management & Diagnosis.
3. Apply/ghi (POST) cho 23 route đã xong mức 2: CHƯA có bằng chứng HAR.
4. Chưa commit git nhóm Internet > WAN (làm ngay sau khi cập nhật xong tài liệu).

---

## ĐIỂM DỪNG PHIÊN 2026-08-04 (bản 3) — đọc mục này trước khi làm tiếp

### Đã xong

- **77/77 route ở mức 1**: có mã gốc trong `reference/source/`.
- SNTP, Firewall: **mức 3** (so DOM sạch lỗi ở khổ rộng lẫn khổ hẹp 980).
- **Nhóm WLAN (8 route) — mức 2**: localNetStatus, wlanBasic, wlanAdvanced,
  wps, wlanStaScanAP, wifibandsteer, WLANMLO, smNetSphereMAP. (chi tiết ở bản ghi cũ dưới đây)
- **Nhóm LAN & Routing (4 route) — mức 2**: lanMgrIpv4, lanMgrIpv6, routeIpv4, routeIpv6.
  So DOM @1536: lanMgrIpv6 300/300, routeIpv4 156/156, routeIpv6 135/135 — sạch tuyệt đối.
  lanMgrIpv4: 334/369 khớp, 35 lệch đều thuộc 1 vấn đề đã biết (xem mục
  "DHCPBasicCfg — khóa mã hóa client-side" bên dưới).
  Phát hiện và sửa thêm: thiếu file tĩnh `img/del.png` (404 trên sim, 200 trên thật) —
  đã tải nguyên bản từ thiết bị thật và lưu vào `src/www/img/del.png`.
- **Nhóm Dịch vụ mạng (7 route) — mức 2**: ftp, upnp, bpdu, dms, samba, dns, usbfunccfg.
  So DOM @1536 sạch tuyệt đối cả 7: ftp 66/66, upnp 86/86, bpdu 52/52, dms 73/73,
  samba 107/107, dns 123/123, usbfunccfg 52/52.
  Ghi nhận: `Localnet_ftp_lua.lua` và `Samba_lua.lua` không bao giờ trả về mật khẩu
  (kèm `<encode>Password</encode>`/`<encode>PassWord</encode>` nhưng field Password
  hoàn toàn vắng mặt trong response) — an toàn, không có secret nào bị lộ.
  `dns_hostname_lua.lua` trả về object tên `ALLDNSHOST` — **ngoại lệ** không có tiền
  tố `OBJ_` (đã cập nhật `cgi-map.json`).
  Đây là nhóm cuối cùng của "Local Network" (19/19 route con đã xong mức 2).
- Tự phát hiện và sửa 2 lỗi trong lúc gộp dữ liệu nhóm này:
  1. Lỗi regex tự gây ra: script gộp ban đầu dùng regex quá rộng khớp nhầm luôn thẻ
     bọc ngoài `<ajax_response_xml_root>` làm một "object" giả, khiến 2 dataTag mới
     (`upnp_portmap_lua.lua`, `dns_hostname_lua.lua`) bị gán sai. Đã sửa tay lại đúng
     (`OBJ_UPNPPORTMAP_ID`, `ALLDNSHOST`, đều rỗng đúng với bằng chứng thật).
  2. Lỗi cũ có sẵn từ trước phiên này: 4 giá trị chứa HTML entity `&#32;` (khoảng
     trắng) chưa được giải mã khi lưu vào factory.json/instance-01.json
     (`OBJ_PORTLOCATE_ID.PortLocateFormat`, `OBJ_DEVINFO_ID.VerDate`,
     `OBJ_DMS_ID.DmsName`, `OBJ_VOIPSIPSERVER_ID.SipServer`) — đã quét toàn bộ 2 file
     state và giải mã lại đúng (vd `"Media&#32;Server"` → `"Media Server"`).

### Đang dở — làm tiếp từ đây

1. **Khổ hẹp (NT-3, mobile 390 hoặc tối thiểu 980)** cho cả 19 route (8 WLAN + 4
   LAN&Routing + 7 Dịch vụ mạng) — CHƯA kiểm. Đang ở mức 2 (khớp desktop), chưa đủ
   điều kiện lên mức 3.
2. "Local Network" (19 trang) đã xong hết mức 2. Nhóm menu lớn tiếp theo cần chọn:
   Internet, VoIP, hoặc Management & Diagnosis (xem menu-tree/route-inventory để
   chia nhỏ theo mục 5 CLAUDE.md — mỗi phiên tối đa 1 nhóm ~5-10 trang).
3. Apply/ghi (POST) cho cả 19 route (WLAN + LAN&Routing + Dịch vụ mạng): CHƯA có
   bằng chứng HAR.

### DHCPBasicCfg (lanMgrIpv4) — khóa mã hóa client-side chưa có bằng chứng

- Route: `lanMgrIpv4`, dataTag `Localnet_LanMgrIpv4_DHCPBasicCfg_lua.lua`,
  object `OBJ_Br0AndDhcpsHosCfg_ID`.
- Quan sát: thiết bị thật trả 5 trường bị **mã hóa** (`IPAddr`, `MinAddress`,
  `MaxAddress`, `DNSServer1`, `DNSServer2`) dạng base64 (vd
  `v+gRyWEsI6fw+S5uQBexYw==`), kèm thẻ `<encode>IPAddr,MinAddress,MaxAddress,
  DNSServer1,DNSServer2</encode>` ngay sau khối `<OBJ_Br0AndDhcpsHosCfg_ID>`.
  Ciphertext **đổi mỗi lần đọc** dù giá trị thật không đổi (2 lần chụp cho cùng
  IPAddr=192.168.1.1 ra 2 chuỗi khác nhau) → có IV/nonce ngẫu nhiên.
- Đã thử: thêm cơ chế sinh lại thẻ `<encode>` trong `config_store.xml_cho()`
  (tham số `dataTags[...].encodeAfterObj`, đã lưu trong factory.json/instance-01.json
  làm bằng chứng nhưng KHÔNG áp dụng trong code hiện tại).
- Kết quả thử: JS client (`decodeParaValue` gọi `crypto-js`) vẫn CHỦ ĐỘNG thử giải mã
  các trường này **kể cả khi server KHÔNG gửi thẻ `<encode>`** (tên trường được nhận
  diện cứng trong JS gốc, không phụ thuộc thẻ `<encode>`). Vì ciphertext chụp lại từ
  thiết bị thật không giải mã được bằng khóa mà bản giả lập có (không rõ khóa lấy từ
  đâu — có thể theo phiên đăng nhập, xem `cryptoNote` trong `cgi-map.json`), crypto-js
  ném `Error: Malformed UTF-8 data`, và lỗi này làm **TRẮNG TOÀN BỘ form** (kể cả các
  trường không mã hóa như `LeaseTime`, `DomainName`) vì vòng lặp `fillDataWithXML`
  của jQuery dừng giữa chừng khi gặp exception.
- Vì vậy: đã revert, KHÔNG sinh `<encode>`. Hiện trạng bản giả lập: 5 trường này hiện
  ciphertext thô (không giải mã), các trường khác trong cùng object vẫn hiển thị đúng.
  Đây là lựa chọn AN TOÀN HƠN (ít lệch hơn) so với việc thử giải mã sai và làm hỏng
  toàn bộ phần còn lại của form.
- Cần anh Huy làm: nếu muốn lên mức 3 cho phần này, cần chụp HAR/Console kèm xem
  cách trang lấy khóa giải mã (vd tìm trong response `loginData`, hoặc biến JS toàn
  cục đặt lúc đăng nhập) rồi cung cấp bằng chứng cụ thể.
- Trạng thái: đang chờ

### Việc CHƯA làm cho nhóm WLAN (ghi rõ để không tưởng nhầm là xong)

- **Apply/ghi (POST) của cả 8 route: CHƯA có bằng chứng HAR nào.** Chỉ mới lấy được
  luồng ĐỌC (GET). Trang có nút Apply thật (WLAN Basic, WLAN Advanced, WPS, Band
  Steering, MLO, Mesh Wi-Fi) nhưng CHƯA bấm Apply trên thiết bị thật nên dispatch
  chưa nối ghi cho các dataTag này — nếu bấm Apply trong bản giả lập bây giờ, dữ liệu
  sẽ KHÔNG đổi đúng (rơi vào nhánh ghi chung chung, chưa xác minh đúng tham số POST).
- `wlan_sta_wlan_profile_lua.lua` (Surrounding WiFi): nút Scan là một dạng hành động
  đặc biệt (giống ghi nhưng không phải Apply chuẩn, cần `APGetFrom=ScanAP` +
  `_sessionTOKEN`) — CHƯA nối, bấm Scan trong bản giả lập sẽ không hoạt động đúng.
- `config_store.xml_cho()` hiện LUÔN gộp các instance cùng object vào 1 khối tag —
  không tái hiện đúng trường hợp thiết bị thật phát nhiều khối tag trùng tên (như
  OBJ_WPS_ID). Đã né bằng cách sửa thẳng dữ liệu, nhưng nếu route khác gặp tình
  huống tương tự sẽ cần sửa `xml_cho()` cho tổng quát hơn.

### Ba chỗ còn thiếu bằng chứng, chưa chặn đường

- Response khi **ghi thất bại** (validate sai / token hết hạn)
- Các `IF_ACTION` khác ngoài `Apply` (Add, Delete — cần cho trang có bảng)
- Trang có **nhiều nhóm Apply** (ví dụ `logMgr` có 3 cặp Apply/Cancel)

---

> Ghi vào đây MỌI chỗ chưa có bằng chứng gốc từ thiết bị thật.
> Theo NT-1: thiếu bằng chứng → DỪNG LẠI và báo cáo, KHÔNG tự bịa,
> KHÔNG copy từ thiết bị khác.

## Cách ghi một mục

```markdown
## [YYYY-MM-DD] <viewTag hoặc tên khu vực>
- Route id: <id trong route-inventory.json>
- Thiếu: <HAR / source gốc / screenshot desktop / screenshot mobile / response endpoint nào>
- Cần anh Huy làm: <thao tác cụ thể trên thiết bị thật>
- Trạng thái: đang chờ | đã có bằng chứng | không áp dụng
```

---

## [2026-08-03] ✅ ĐÃ CÓ — source gốc của 77 route

- Route id: tất cả 77 → đã lên **mức 1**
- Có: `reference/source/views/<viewTag>.html` (77 file, 2.0 MB), lấy bằng `fetch()`
  trực tiếp từ thiết bị nên là **mã server trả về**, không phải DOM sau render.
- Có: `reference/source/index.html` (226 KB) + 4 file `jquery/*.js`.
- Trạng thái: đã có bằng chứng

## [2026-08-03] `wan_internet_lua.lua` — gọi trực tiếp trả 404 ✅ ĐÃ GIẢI QUYẾT (2026-08-04)

- Route liên quan: `ethWanConfig` (Internet > WAN)
- Quan sát: khi duyệt menu bình thường, trình duyệt có gọi
  `?_type=menuData&_tag=wan_internet_lua.lua`. Nhưng gọi lại đúng URL đó thì
  thiết bị trả **404 Not Found**, kể cả sau khi đã nạp `menuView&_tag=ethWanConfig`.
- **Nguyên nhân đã tìm ra**: dataTag này cần thêm 2 tham số query ngoài `_tag`:
  `&TypeUplink=2&pageType=0`. Thiếu 2 tham số này thì thiết bị trả 404.
- Đã cập nhật `cgi-map.json` (mục `ethWanConfig`) ghi rõ yêu cầu này.
- Trạng thái: đã có bằng chứng, đã xử lý

## [2026-08-03] Ảnh chụp màn hình — chưa có file nào

- Route id: tất cả 77
- Thiếu: toàn bộ `reference/screenshot/desktop/` và `reference/screenshot/mobile/`.
- Không có ảnh thật thì không route nào lên nổi mức 2 hoặc 3.
- Cần anh Huy làm: mục 5 trong `HUONG-DAN-CHUP-HAR.md`.
- Trạng thái: đang chờ

## [2026-08-03] File HAR — chưa có file nào

- Thiếu: toàn bộ `reference/har/`. Source đã có, nhưng HAR còn giữ **header, method,
  mã trạng thái** — thứ file source không có, và cần cho lớp giao vận.
- Trạng thái: đang chờ

## [2026-08-03] menuData chỉ hợp lệ trong ngữ cảnh trang — đã xác minh

- Không phải chỗ thiếu, mà là **hành vi thật cần tái hiện đúng ở lớp 3**.
- Gọi `?_type=menuData&_tag=X` khi chưa nạp `?_type=menuView&_tag=<trang chứa X>`
  → thiết bị trả `<IF_ERRORSTR>SessionTimeout</IF_ERRORSTR>`, HTTP vẫn 200.
- Chụp đúng cách là theo cặp: menuView trước, menuData ngay sau.
- Bản giả lập **phải** tái hiện hành vi này, không được trả dữ liệu vô điều kiện.

## [2026-08-03] Định dạng response đã biết

- Mọi `menuData` trả về **XML**, gốc `<ajax_response_xml_root>`:
  `IF_ERRORPARAM`, `IF_ERRORTYPE`, `IF_ERRORSTR`, `IF_ERRORID`, rồi
  `<OBJ_*_ID><Instance><ParaName>..</ParaName><ParaValue>..</ParaValue>...`
- Ghi dữ liệu: `POST /?_type=<type>&_tag=<entry>` body form-urlencoded,
  **luôn kèm `_sessionTOKEN`**; response JSON có trường `need_refresh`.
  Ba ví dụ đọc được từ `index.html`: `logout_entry`, `switchlang_entry`, `modeswitch_entry`.
- **Chưa có** ví dụ POST cho một trang cấu hình thật (Apply/Save) — xem mục dưới.

## [2026-08-03] Luồng đăng nhập — ĐÃ CÓ MỘT PHẦN

Bằng chứng: `reference/har/login.har` (41 entry).

**Đã xác minh:**

1. `GET /?_type=loginData&_tag=login_token&_=<ts>` → 200, `Content-Type: text/xml`
2. `POST /?_type=loginData&_tag=login_entry` → 200, `Content-Type: application/json`
   - body `application/x-www-form-urlencoded`, đúng 4 tham số:

   | Tham số | Độ dài | Ghi chú |
   |---|---|---|
   | `action` | 5 | giá trị `login` |
   | `Username` | 5 | giá trị `admin` |
   | `Password` | 64 | chuỗi hex → **không gửi mật khẩu thô** |
   | `_sessionTOKEN` | 24 | lấy từ bước 1 |

3. **Không có `Set-Cookie` nào trong toàn bộ luồng.** Phiên KHÔNG giữ bằng cookie
   mà bằng `_sessionTOKEN` gửi kèm mỗi request ghi.

4. **Cách băm mật khẩu** — đọc từ mã gốc `reference/source/login-page.html`, hàm `g_loginToken()`:

   ```js
   var xmlObj = $(xml)[0].childNodes[0].textContent;   // token tu login_token (XML)
   var Password = $("#Frm_Password:not(.PostIgnore)").val();
   var SHA256Password = sha256(Password + xmlObj);     // BAM: mat khau GHEP token
   ```

   Tức là `sha256(mật_khẩu + token)`, **không phải** `sha256(mật_khẩu)`.
   `jsencrypt` có được nạp nhưng **không dùng** cho đăng nhập.

5. **Luồng đầy đủ 3 bước:**

   | # | Request | Trả về |
   |---|---|---|
   | 1 | `GET /?_type=loginData&_tag=login_entry` (lúc tải trang) | JSON `{lockingTime, loginErrMsg, promptMsg, sess_token}` |
   | 2 | `GET /?_type=loginData&_tag=login_token` | XML, lấy `childNodes[0].textContent` làm muối |
   | 3 | `POST /?_type=loginData&_tag=login_entry` | JSON `{sess_token, login_need_refresh}` |

6. **Token đổi mới sau mỗi POST** — client ghi đè `#_sessionTOKEN` bằng `data.sess_token`.
   Cơ chế chống phát lại, bản giả lập phải làm đúng.

7. **Có khoá đăng nhập theo thời gian**: `lockingTime` > 0 thì vô hiệu hoá ô nhập và nút,
   đếm ngược bằng `setInterval`, hiện `#login_error_waittime`. Hành vi này phải tái hiện.

**Còn thiếu:**

- Response body của `login_token` và `login_entry` trong HAR đều rỗng (Chrome không lưu
  body cho các entry thuộc document trước khi chuyển trang). Đã lấy bù bằng `fetch()`:
  `login_token` dài 57 byte, `login_entry` (GET) dài 89 byte.
  **Chưa có** ví dụ response khi **đăng nhập sai** — chưa biết `loginErrMsg` trông thế nào.
- Trạng thái: gần đủ, còn thiếu ca đăng nhập sai

## [2026-08-03] Hành vi GHI (Apply) — ĐÃ CÓ

Bằng chứng: `reference/har/sntp-apply.har` + `reference/har/GHI-CHU-APPLY.md`
(trang Internet › SNTP, đổi Poll Interval 86400 → 43200).

**Phát hiện lớn nhất: ghi và đọc dùng CHUNG endpoint.**
Không có endpoint riêng cho ghi. Phân biệt bằng **HTTP method**:

| | Request |
|---|---|
| Đọc | `GET /?_type=menuData&_tag=sntp_lua.lua` |
| Ghi | `POST /?_type=menuData&_tag=sntp_lua.lua` |

**Body POST** — `application/x-www-form-urlencoded`, header `X-Requested-With: XMLHttpRequest`,
không có cookie:

```
IF_ACTION            = Apply
_InstID              = IGD
ZoneIndex            = 24
AutoSetTzname        = 1
LocalTimeZoneandName = 24
NtpServer1           = vn.pool.ntp.org
NtpServer2           = asia.pool.ntp.org
NtpServer3           =            <- truong AN, van gui
NtpServer4           =            <- truong AN, van gui
NtpServer5           =            <- truong AN, van gui
PollTimeInterval     = 43200      <- truong da doi
Dscp                 = -1         <- o trong gui -1, khong gui rong
Btn_apply            =            <- ca hai nut deu gui, gia tri rong
Btn_cancel           =
_sessionTOKEN        = 7PUToVzEpabS0QJwTjOPPXPh
```

**Bốn quy tắc rút ra, bản giả lập phải làm đúng:**

1. Gửi **toàn bộ** trường của form, không chỉ trường vừa đổi.
2. Trường **ẩn** vẫn được gửi, giá trị rỗng.
3. **Cả hai** nút `Btn_apply` và `Btn_cancel` đều gửi, giá trị rỗng.
4. Có trường **không hiện trên màn hình** nhưng vẫn gửi: `ZoneIndex`, `AutoSetTzname`.

**Response**: `text/xml`, gốc `<ajax_response_xml_root>`, báo kết quả bằng
`IF_ERRORSTR=SUCC` / `IF_ERRORID=0`, **và trả về luôn trạng thái mới** của đối tượng
(`OBJ_SNTP_ID/Instance/ParaName/ParaValue`) — client không cần gọi lại `menuData`.

**Còn thiếu:**

- Response khi ghi **thất bại** (validate sai, token hết hạn) — chưa có.
- Các giá trị `IF_ACTION` khác ngoài `Apply` (Add, Delete...) — chưa có.
- Trang có **nhiều nhóm Apply riêng** (ví dụ `logMgr` có 3 cặp Apply/Cancel) — chưa chụp.
- Trạng thái: đủ để lên mức 4 cho trang một-nhóm-Apply; chưa đủ cho trang nhiều nhóm

## [2026-08-03] Khổ mobile 390×844

- Route id: tất cả
- Thiếu: chưa kiểm route nào ở khổ mobile. **Chưa biết** thiết bị có giao diện mobile riêng
  hay chỉ là bản desktop thu nhỏ.
- Theo NT-3: chưa kiểm mobile = trang chưa hoàn thành. Nên hiện tại 0/77 route đủ điều kiện lên mức 3.
- Cần anh Huy làm: chụp lại toàn bộ ở 390×844 (có F5 sau khi đổi khổ).
- Trạng thái: đang chờ

## [2026-08-03] Tab cấp 3 — mới có tên, chưa có nội dung

- Route id: 55 route cấp 3 trong inventory
- Đã có: `viewTag` và nhãn của từng tab (lấy từ DOM thật).
- Thiếu: chưa **mở** từng tab, nên chưa biết mỗi tab gọi `_type=menuData&_tag=` nào,
  chưa biết trường nào trên trang.
- Cần: chụp HAR khi bấm lần lượt hết các tab cấp 3.
- Trạng thái: đang chờ

## [2026-08-03] Dialog / popup trong trang

- Route id: tất cả
- Thiếu: chưa quét nút nào mở dialog. NT-2 yêu cầu quét đến tận cùng.
- Cần: bấm hết các nút Add / Edit / Detail / Advanced trong từng trang, chụp riêng.
- Trạng thái: đang chờ

## [2026-08-03] Mục bị ẩn do cờ firmware

- Thiếu: lúc quét, mọi mục menu đều ở trạng thái hiển thị (`hidden: false`).
  **Chưa biết** firmware này có mục nào bị ẩn hay không — có `_type=hiddenData` trong mã nguồn
  nhưng chưa rõ dùng để làm gì.
- NT-2 yêu cầu ghi nhận mục ẩn, nên đây là khoảng trống chưa lấp được.
- Trạng thái: đang chờ

## [2026-08-04] Nhóm WLAN — dữ liệu thật đã sanitize trước khi lưu vĩnh viễn

- Route liên quan: `wlanBasic`, `localNetStatus`.
- Khi lấy `wlan_wlansssidconf_lua.lua` (WLAN Basic) và `wlan_wlanstatus_lua.lua` /
  `accessdev_landevs_lua.lua` (Status), response thật chứa: SSID thật (`ZTE_*_7TKUPT`),
  `KeyPassphrase`/`WEPKey` thật (dạng mã hoá nhẹ, có thể giải mã lại), MAC thật của
  AP và của thiết bị trong mạng LAN. Đã hỏi và được xác nhận: **thay bằng giá trị giả**
  trước khi ghi vào bằng chứng vĩnh viễn, giữ nguyên cấu trúc XML/ParaName/thứ tự.
  Xem `reference/vantay/wlanBasic.menudata.0-0.json` và
  `reference/vantay/localNetStatus.menudata.0-0.json` (đã sanitize tại chỗ).
- Riêng `wlan_sta_wlan_profile_lua.lua` (Surrounding WiFi, sau khi bấm Scan) trả về
  SSID/MAC **hàng xóm thật** — đã sanitize NGAY TRONG TRÌNH DUYỆT trước khi lưu
  (không ghi dữ liệu thật xuống đĩa dù chỉ tạm thời). File:
  `reference/vantay/wlanStaScanAP-co-scan.menudata.0-0.json`.
- Trạng thái: đã xử lý, không cần làm gì thêm.

## [2026-08-04] `wlan_mlo_model.lua` — response là JSON, không phải XML

- Route: `WLANMLO` (Local Network > WLAN > MLO).
- Mọi dataTag khác trên thiết bị đều trả `<ajax_response_xml_root>` (XML). Riêng tag
  này trả **JSON thuần**:
  `{"IF_ERRORID":0,"OBJ_WLANMLO_ID":{"Instance":[{"MloEnable":"0"}]},"IF_ERRORTYPE":"SUCC","IF_ERRORSTR":"SUCC","IF_ERRORPARAM":"SUCC"}`
- Đã xác minh qua thân response thật (fetch trực tiếp). **Chưa xác minh được header
  `Content-Type`** — công cụ đọc header bị chặn khi thử (báo lỗi an toàn nội bộ).
  Đang tạm dùng `application/json; charset=utf-8`, đánh dấu là GIẢ ĐỊNH.
- Cũng chưa có bằng chứng dạng JSON này trông thế nào khi lỗi (SessionTimeout) —
  `config_store.json_cho()` tạm giả định giữ nguyên khung, chỉ đổi `IF_ERRORSTR`.
- Cần: anh Huy xác nhận Content-Type thật (F12 > Network > chọn request này > tab
  Headers) khi có dịp, hoặc để tôi thử lại qua Chrome khi công cụ hết bị chặn.
- Trạng thái: đang chờ xác minh header, không chặn việc dựng trang (dùng giả định).

## [2026-08-03] Chuỗi firmware — hai nguồn không khớp

- Đọc từ DOM thật: `F8728D V3.0.12P2N2`
- Ảnh chụp màn hình anh Huy gửi (chân trang, chữ nhỏ): trông giống `F8728D V2.0.12P2N2`
- Chênh ở ký tự `V2` / `V3`. Có thể do ảnh mờ, cũng có thể là hai thiết bị khác nhau.
- Cần anh Huy làm: phóng to chân trang và xác nhận chuỗi đúng.
- Trạng thái: đang chờ

## [2026-08-05] Local Network > WLAN > WLAN Advanced + WPS — Apply/POST muc 4, phat hien kien truc moi

- **wlanAdvanced (Access Control-Mode Configuration, wlan_macfilteraclpolicy_lua.lua):**
  da bam Apply that (khong doi gia tri) tren thiet bi that. Dang `xac_nhan_trong`.
  INSTIDENTITY tra ve = `_InstID_11` (truong CUOI CUNG trong 12 SSID gui len), KHONG
  PHAI top-level `_InstID` (gui rong). Cung dang `tu_truong:` da phat hien truoc do o
  `wlan_wlanbasiconoff_lua.lua`, xac nhan lai quy luat "echo truong index CUOI".
  Access Control-Rule Configuration (wlan_macfilterrule_lua.lua) van la danh sach RONG
  (New Item template) — BO QUA, khong bam Apply, giu muc 3 theo tien le parentCtrl.

- **WPS (2.4GHz, wlan_wps_lua.lua): PHAT HIEN DANG GHI THU 6 — "day_du_co_instidentity".**
  Header kieu `rut_gon`/`xac_nhan_trong` (the `<INSTIDENTITY>` dat NGAY DAU, truoc
  IF_ERROR*, KHONG co the `<_InstID>` rieng) NHUNG van co du lieu object DAY DU nhu GET
  (khong phai rong nhu 2 dang kia). Gia tri INSTIDENTITY = `SSID_InstID` gui len
  (DEV.WIFI.AP1.WPS), khong phai `_InstID` top-level (DEV.WIFI.RD1, la radio chu khong
  phai SSID) — lai mot bien the "tu_truong" nhung ap dung cho dang moi nay.

- **PHAT HIEN KIEN TRUC RIENG: OBJ_WPS_ID phat NHIEU khoi XML trung ten tag.** Bang
  chung GET (day du, 3 instance) VA Apply (loc con 1 instance) deu xac nhan: thiet bi
  that phat `<OBJ_WPS_ID><Instance>...</Instance></OBJ_WPS_ID>` LAP LAI 3 LAN (moi lan
  1 Instance), KHONG PHAI 1 `<OBJ_WPS_ID>` boc 3 `<Instance>`. Day la dieu da duoc ghi
  chu tu truoc (state/factory.json, OBJ_WPS_ID.ghiChu) nhung CHUA duoc sua trong
  `config_store.xml_cho()`/`_sinh_khoi_obj()` — o phien nay DA SUA TAN GOC: them co gio
  `objects[ten_obj]["bocRiengTungInstance"] = true` de chon dang "nhieu khoi rieng"
  theo TUNG object (chi bat cho OBJ_WPS_ID, khong anh huong object khac chua co bang
  chung tuong tu). Da kiem lai: GET va POST Apply cua wlan_wps_lua.lua deu phat lai
  DUNG BYTE-FOR-BYTE tren sim sau khi sua. Rieng nhanh Apply ("day_du_co_instidentity"),
  object co co gio nay con duoc LOC chi giu 1 instance co `_InstID == INSTIDENTITY` (thay
  vi tra ca 3 nhu GET) — bang chung: response Apply that CHI co 1 khoi OBJ_WPS_ID (AP1.WPS),
  trong khi GET cung dataTag ngay truoc do tra ca 3 (AP1.WPS/AP5.WPS/AP5.WPS — gia tri
  AP5.WPS lap 2 lan trong NVRAM that, khong phai loi capture).
- Trang thai: da xac nhan, da sua code, da phat lai dung tren sim, da commit.

## [2026-08-05] Local Network > WLAN — hoan tat Band Steering, MLO, Mesh Wi-Fi, SSID Configuration (SSID1)

- **WLAN Band Steering (wlan_BandSteering_lua.lua):** Apply that xac nhan (khong doi
  gia tri, Off). Dang `xac_nhan_trong`, instidentity mac dinh (echo `_InstID`).
- **MLO (wlan_mlo_model.lua, dataTag JSON):** Apply that xac nhan (khong doi gia tri,
  Off). Dung duong ghi JSON da co san tu phien truoc (`json_ghi_thanhcong`), response
  chi 4 truong loi, khong echo du lieu — dung mo hinh da xac nhan voi IgmpWLANCONF.
- **Mesh Wi-Fi (Localnet_NetSphere_Mode_lua.lua):** Apply that xac nhan (khong doi
  gia tri, Off). Dang `xac_nhan_trong`, instidentity mac dinh (echo `_InstID`).
- **WLAN SSID Configuration, SSID1 2.4GHz (wlan_wlansssidconf_lua.lua):** Apply that
  xac nhan (khong doi gia tri). Dang `xac_nhan_trong`, instidentity =
  `tu_truong:_InstID_PSK` (echo `DEV.WIFI.AP1.PSK1`, khong phai top-level `_InstID`).
  **QUAN TRONG — sanitize:** form gui `KeyPassphrase`/`WEPKey00-03` (mat khau WiFi
  that) — da thay bang placeholder truoc khi luu evidence, theo dung tien le da lap
  cho cac trang mat khau WLAN khac. Form con co truong `encode` la MOT CHUOI
  CIPHERTEXT BASE64 RAT DAI (~700 ky tu) — GIONG hien tuong da ghi nhan o
  DHCPBasicCfg ([2026-08-04]): khong ro khoa/thuat toan giai ma, KHONG sinh lai ma
  hoa nay trong sim (tranh loi nang hon).
- Nhom WLAN (8 route: wlanBasic, wlanAdvanced, wps, wifibandsteer, WLANMLO,
  smNetSphereMAP + phan SSID Configuration cua wlanBasic) coi nhu XONG phan Apply/POST
  chinh — con thieu: SSID2-12 (co the dung chung dang, chua xac nhan tung cai rieng),
  5GHz/6GHz cua WLAN Global Configuration trong wlanBasic (co the dung chung
  wlan_wlanbasicadconf_lua.lua voi Band khac, chua co bang chung rieng tung band).
  wlanStaScanAP (Surrounding WiFi) van la trang quet, khong phai Apply chuan — bo qua
  nhu da ghi truoc do.
- Trang thai: da xac nhan, da phat lai dung tren sim, da commit.

## [2026-08-05] Local Network > LAN > IPv4 > DHCP Server — Apply/POST muc 4 (co gioi han)

- **Localnet_LanMgrIpv4_DHCPBasicCfg_lua.lua:** Apply that xac nhan (khong doi gia
  tri, LAN IP van 192.168.1.1). Dang GHI `day_du_co_instidentity` NHUNG CHI echo 1
  trong 2 object cua dataTag (OBJ_Br0AndDhcpsHosCfg_ID, KHONG echo OBJ_LANDNS_ID) —
  dung `doiTuongGhiRieng` de gioi han. instidentity mac dinh (echo `_InstID`=IGD).
- **Response THAT co the `<encode>IPAddr,MinAddress,MaxAddress,DNSServer1,DNSServer2
  </encode>` o cuoi** — CHINH LA dataTag da duoc ghi nhan truoc do (mục
  [2026-08-04]) ve viec KHONG giai ma duoc cac truong nay (crypto-js, khoa khong
  ro — thu sinh lai <encode> cho nhanh GET da lam TRANG CA form). AP DUNG LAI
  quyet dinh AN TOAN cu cho nhanh GHI: sim KHONG sinh the `<encode>` trong response
  Apply, de tranh lap lai loi "Malformed UTF-8 data". Day la CHENH LECH CO CHU Y so
  voi thiet bi that, da ghi ro trong file bang chung
  (LanMgrIpv4-DHCPBasicCfg-apply.that.post.json). Cac truong KHONG ma hoa cua trang
  (SubnetMask/LeaseTime/DomainName/ServerEnable/DnsServerSource) van dat muc 4 day
  du, chi rieng 5 truong ma hoa (IPAddr/MinAddress/MaxAddress/DNSServer1/2) la
  con thieu (muc 3, cho anh Huynn cung cap bang chung ve khoa giai ma neu muon len
  muc 4 hoan toan).
- Trang thai: da xac nhan cau truc, da phat lai dung tren sim (tru <encode> co chu y
  bo qua), da commit.

## [2026-08-05] Local Network > LAN > IPv6 — Apply/POST muc 4, phat hien dang GHI thu 7 + dataTag moi

- **addr6_lanaddr_lua.lua (LAN Address Management):** Apply that xac nhan, dang
  xac_nhan_trong, instidentity mac dinh (echo _InstID=IGD). Khong doi gia tri.
- **dhcp6s_dhcpserver_lua.lua (DHCPv6 Server): PHAT HIEN DANG GHI THU 7 MOI —
  "day_du_co_instidentity_va_instid".** Response co CA BA: `<INSTIDENTITY>` dau
  tien, `<_InstID>` ngay sau header loi (echo top-level _InstID=DEV.DHCP6SPool1),
  VA du lieu object DAY DU nhung CHI echo OBJ_DHCP6S_ID (khong echo OBJ_LANDNS_ID).
  INSTIDENTITY = `_InstID_DNS` gui len (IGD), khong phai top-level _InstID.
- **ra_raservice_lua.lua (RA Service):** Apply that xac nhan, dang `day_du` mac
  dinh (header PARAM,TYPE,STR,ID + the _InstID + du lieu day du, khong INSTIDENTITY).
- **radhcp6s_portctrl_lua.lua (Port Control, IPv6): dataTag NAY CHUA TUNG DUOC
  MO HINH HOA TRUOC DAY** (khong co trong factory.json truoc phien nay). Da them
  moi HOAN TOAN tu bang chung GET THAT (12 instance object OBJ_IPV6BANPORT_ID,
  PortName LAN1-4/SSID1-8) va Apply THAT (dang xac_nhan_trong, instidentity =
  tu_truong:_InstID_11 — echo truong index CUOI, giong cac dataTag nhieu-instance
  khac). Khong bia gia tri nao — moi truong deu lay tu response XML that.
- Nhom LAN (2 route: lanMgrIpv4 mot phan do 5 truong ma hoa DHCPBasicCfg chua giai
  duoc — xem muc rieng ben tren; lanMgrIpv6 day du muc 4) coi nhu xong Apply/POST.
- Trang thai: da xac nhan, da phat lai dung tren sim (GET dai 4239 ky tu khop
  chinh xac voi thiet bi that cho radhcp6s_portctrl_lua.lua), da commit.

## [2026-08-05] Local Network > Routing (IPv4/IPv6) — kiem Apply/POST, khong co gi de test an toan

- Ca 2 route (routeIpv4, routeIpv6) co cung cau truc 3 phan: Default Routing
  (WAN Connection dropdown), Routing Table (chi doc), Static Routing (danh sach).
- **Default Routing:** dropdown mac dinh "Please select..." — bam Apply BI CHAN
  CLIENT-SIDE ("This field is required"), 0 network request gui di. AN TOAN,
  giong tien le dmz/l2tpConfig (truong bat buoc dang rong).
- **Routing Table:** chi co nut Refresh, KHONG co Apply — la du lieu hien thi,
  khong phai form ghi.
- **Static Routing:** danh sach RONG (New Item template), khong co instance that
  — bo qua theo tien le parentCtrl.
- KET LUAN: khong co phan nao cua 2 trang nay co the test Apply/POST an toan ma
  khong doan gia tri (vi khong biet WAN Connection hien tai la gi). Giu ca 2 o
  muc 3. Nhom Routing coi nhu DA KIEM XONG (khong con gi de lam them tru khi
  co bang chung moi, vd anh Huynn tu chon 1 WAN Connection va bam Apply that).

---

## [2026-08-05] Local Network > dich vu mang — FTP/UPnP/BPDU/DMS len muc 4

- 4 route Apply that xac nhan, khong doi gia tri (bam Apply tren cau hinh mac
  dinh), moi cai mot dang GHI khac nhau — tiep tuc cung co nguyen tac "moi
  dataTag mot bang chung rieng":
  - **ftp (`Localnet_ftp_lua.lua`):** `xac_nhan_trong`, instidentity mac dinh
    (echo `_InstID=IGD.FTPUSER0`). Truong `Password` co ma hoa client-side qua
    `encode` (khoa chua ro) — response GHI cua trang nay KHONG echo du lieu nen
    khong gap van de `<encode>` nhu DHCPBasicCfg/SSID Config. Da sanitize
    Password/encode truoc khi luu bang chung.
  - **upnp (`upnp_upnp_lua.lua`):** `rut_gon` (mau 2, giong EnergyMode) — header
    ID,TYPE,STR,PARAM + the `<_InstID>`, khong echo du lieu object. UPnP Port
    Mapping la danh sach chi doc (nut Refresh, khong Apply).
  - **bpdu (`bpdu_lua.lua`):** `xac_nhan_trong`, instidentity mac dinh (echo
    `_InstID=IGD`).
  - **dms (`dms_dms_lua.lua`):** `xac_nhan_trong`, instidentity mac dinh (echo
    `_InstID=IGD`).
- Trang thai: da xac nhan tren sim, ca 4 response khop byte-for-byte voi bang
  chung that (da phat lai lai dung tu login den Apply, token xoay dung sau moi
  lan ghi thanh cong).

---

## [2026-08-05] Local Network > dich vu mang — Samba/DNS/USB len muc 4, phat hien instidentity="rong" that

- **samba (`Samba_lua.lua`):** Apply that xac nhan. Dang `xac_nhan_trong`
  nhung `INSTIDENTITY` LUON RONG du request co CA `_InstID` top-level (`IGD`)
  LAN `_InstID_0` (`IGD.SAMBAUSER0`, instance user Samba duy nhat). Day la
  bang chung that DAU TIEN cho gia tri `instidentity: "rong"` — truoc day chi
  co trong code nhu mot lua chon ly thuyet (echo/rong/tu_truong), chua co
  dataTag nao dung. Khac han pattern "echo truong index cuoi" da thay o cac
  dataTag nhieu-instance khac (macfilteraclpolicy, LanDevDHCPSource,
  radhcp6s_portctrl). Da sanitize PassWord_0/PassWord/encode (mat khau Samba
  that, ma hoa client-side, ciphertext base64).
- **dns (`dns_localdns_lua.lua`):** dataTag NAY DA CO SAN trong factory.json
  (dung cho GET) nhung CHUA co `ghiDangKieu`. Trang DNS co 3 section dung
  CHUNG 1 dataTag: "Domain Name" (gui rieng truong `DomainName`) va "DNS"
  (gui rieng 4 truong `SerIPAddress1/2` + `SerIPv6Address1/2`) — da xac nhan
  Apply that cho CA HAI, cung dang `xac_nhan_trong` + instidentity mac dinh
  (echo `_InstID=IGD`). Section "Host Name" la danh sach rong (New Item,
  khong co instance that) — bo qua theo tien le, con lai muc 3 rieng phan do
  (khong the test an toan neu khong co it nhat 1 Host Name that).
- **usbfunccfg (`usb_usbfunccfg_lua.lua`):** Apply that xac nhan. Dang
  `xac_nhan_trong`, instidentity mac dinh (echo `_InstID=IGD`).
- Trang thai: ca 4 lan Apply (Samba, DNS x2, USB) da phat lai byte-for-byte
  dung tren sim. Nhom "dich vu mang" (FTP/UPnP/BPDU/DMS/Samba/DNS/USB) coi
  nhu HOAN TAT Apply/POST — 7/7 route da len muc 4 (dns con 1 sub-section
  Host Name muc 3 do danh sach rong, khong tinh la chan tien do nhom).

---

## [2026-08-05] Nhom VoIP (12 trang) — hoan tat Apply/POST, phat hien them 3 kieu instidentity moi

- **voipStatus:** trang chi doc (nut Refresh, khong Apply) — khong ap dung muc 4.
- **voipBasic:** SIP Account rong, Apply bi chan client-side (truong bat buoc),
  0 network request — an toan, giong tien le dmz/l2tpConfig/Routing. Khong the
  test Apply that neu khong co SIP Account that. Giu muc 3.
- **voipServices (`voip_voipbasic_lua.lua`):** xac_nhan_trong. instidentity:
  `tu_truong:_InstIDVP` — echo truong `_InstIDVP` (IGD.SV.VS1.VP1.VL1), KHONG
  PHAI `_InstID` top-level (...VL1.LS). AuthPassword/encode sanitize.
- **sipIf (`Voip_SipIf_lua.lua`):** rut_gon (mau 2).
- **sipAdvanced:** 2 dataTag — `voip_sipadvanced_lua.lua` (xac_nhan_trong,
  VP1 DTMF/Jitter) va `voip_voiceproc_lua.lua` (rut_gon, Echo Cancellation).
- **sip (`voip_voipsip_lua.lua`):** xac_nhan_trong. instidentity:
  `tu_truong:_InstIDBEARINFO` — echo truong `_InstIDBEARINFO` (IGD), KHONG
  PHAI `_InstID` top-level (IGD.SV.VS1.VP1.PS). Request co 3 truong ID khac
  nhau (_InstID, _InstIDTIMER, _InstIDBEARINFO) cho 3 object khac nhau cua
  cung dataTag — INSTIDENTITY chon object "phu" cuoi (BEARINFO), giong mau
  da thay o voip_voipbasic_lua.lua.
- **sipDigitmap (`Voip_sipdigitmap_lua.lua`):** xac_nhan_trong, instidentity
  mac dinh.
- **sipMedia (`voip_sipmedia_lua.lua`):** xac_nhan_trong. instidentity:
  `tu_truong:_InstID_G722` — echo truong `_InstID_G722` (CL4). Dang KHAC voi
  mau "echo truong index cuoi" da thay truoc day — o day G722 la truong DAU
  TIEN trong danh sach `_InstID_<codec>` (G722,G711U,G711A,G729,...) nhung
  van duoc echo. Co the do G722 la codec "chinh"/dau tien trong logic JS
  goc chu khong phai vi vi tri trong form. Ghi nhan dung theo bang chung,
  khong suy dien quy tac chung cho cac dataTag khac.
- **sipslc (`voip_sipslc_lua.lua`):** rut_gon (mau 2). Lan dau Apply bi loi
  -1452 (token cu), reload `/` roi thu lai thanh cong.
- **sipCallerID (`voip_cid_sip_lua.lua`):** xac_nhan_trong. instidentity:
  `tu_truong:_InstID_CIDSIP` — echo truong `_InstID_CIDSIP` (object
  OBJ_VOIPDTMF_ID), khong phai `_InstID` top-level (object OBJ_VOIPSIP_ID).
- **fax (`voip_fax_lua.lua`):** xac_nhan_trong, instidentity mac dinh.
- **voipqos:** 2 dataTag — `Voip_Voip_QoS_lua.lua` (QOS of Signal) va
  `Voip_Voip_QoS_Media_lua.lua` (QOS of Media), ca hai xac_nhan_trong,
  instidentity mac dinh. Lan dau QOS of Media bi loi -1452, reload roi thu
  lai thanh cong.
- Tong ket: nhom VoIP hoan tat Apply/POST — 10/12 route len muc 4 (voipStatus
  khong ap dung, voipBasic khong test duoc do thieu SIP Account that). Phat
  hien THEM 3 truong hop instidentity dang `tu_truong:<truong khac _InstID>`
  (VoIP Services, SIP Protocol, Caller ID) va 1 truong hop dac biet (Media,
  echo truong dau chu khong phai cuoi) — cung co them nguyen tac "moi
  dataTag can bang chung rieng, khong doan theo mau chung". Ca 12 lan Apply
  da phat lai byte-for-byte dung tren sim (mot lan bash duy nhat, dang nhap
  lai + goi tuan tu, lay token moi truoc moi lan ghi).

---

## [2026-08-05] Nhom Management & Diagnosis (14 trang) — BO QUA CO CHU DINH 5 trang nguy hiem, phat hien dang render moi

### Quyet dinh cua anh Huynn (hoi truoc khi lam, xem cau hoi trong phien)

Nhom nay co nhieu trang chua hanh dong KHONG THE test bang cach "bam Apply
giu nguyen gia tri" nhu moi trang khac trong du an — vi ban than nut bam la
mot HANH DONG (reboot, xoa cau hinh, nap firmware, doi mat khau, chuyen che
do WAN vat ly), khong phai chi resubmit form. Thiet bi dang la router that
dang phuc vu mang that. Anh Huynn chon: **BO QUA hoan toan, chi ghi chu vao
day**, khong dung/ghi HAR cho:

- **rebootAndReset (Device Management):** nut Reboot / Factory Reset.
- **firmwareUpgr (Software Upgrade):** upload file firmware.
- **usrCfgMgr (User Configuration Management):** co the co Restore Config
  (ghi de cau hinh hien tai tu file).
- **accountMgr (Account Management):** doi mat khau admin that — se lam mat
  quyen truy cap phien hien tai.
- **Ethconfig (Uplink Mode Switch):** chuyen che do WAN vat ly — co the lam
  gian doan Internet that cua ho gia dinh.

Neu muon len muc 4 cho 5 trang nay, can anh Huynn tu bam va ghi HAR bang tay
(hoac dung thiet bi test rieng khong anh huong mang that), roi cung cap lai
cho phien sau.

### IPv6 Switch (IPv6SwitchMgr) — phat hien them, cung BO QUA

- Khac voi tat ca cac toggle On/Off khac trong du an (WLAN, Firewall, DHCP...),
  trang nay co kiem tra client-side CHAN viec bam Apply neu gia tri KHONG
  DOI: hien thi dialog "IPv6 switch has no change." va KHONG gui request nao.
  Nghia la khong the dung ky thuat "bam Apply giu nguyen gia tri" da dung
  thanh cong o moi trang khac trong toan bo du an.
- De lay bang chung Apply that can THAT SU doi trang thai IPv6 tren thiet bi
  dang hoat dong — co rui ro gian doan IPv6 that (du chi tam thoi, doi lai
  duoc). BO QUA de an toan, giu muc 3.

### Network Diagnosis + Mirror Configuration — khong lien quan config store

- **networkDiag:** la cong cu PING/TRACEROUTE/Simulation — hanh dong chu
  dong (gui goi tin that), khong ghi vao config store, khong thuoc pham vi
  khai niem "muc 4" cua du an. IP Address/Host Name cung dang rong nen khong
  the test ngay ca neu muon.
- **mirror:** Destination "Please select..." rong, Apply bi chan client-side
  (truong bat buoc, 0 network request) — an toan, giong tien le
  dmz/l2tpConfig/voipBasic. Khong the test Apply that neu khong chon dich
  that.

### logMgr (log_syslogmgr2_lua.lua) — DANG RESPONSE GHI MOI (bien the cua day_du_co_instidentity)

- Request Apply KHONG CO truong `_InstID` nao ca (khac moi dataTag khac tung
  gap). Response: `INSTIDENTITY` LUON RONG (echo mac dinh cua "khong co
  _InstID" tu nhien la rong, khong can co "rong" rieng), KHONG co the
  `_InstID`, VA object `OBJ_LOG_ID` CHI echo 1 TRUONG DUY NHAT (`logStr`,
  trong khi paraOrder GET cua object nay co 4 truong) o DANG
  `<Instance><ParaName>logStr</ParaName><ParaValue></ParaValue></Instance>`.
- Da them co che moi trong `config_store.py`: tham so `danh_sach_truong`
  cho `_sinh_khoi_obj()` va key `dataTags[tag]["truongGhiRieng"][ten_obj]`
  de GHI DE tap truong echo RIENG cho Apply, khac voi paraOrder GET chung
  cua object (vi mot object co the dung chung nhieu dataTag voi tap truong
  Apply khac tap truong GET). Xep vao dang `day_du_co_instidentity` co san
  (header giong het), chi khac o buoc chon truong khi sinh object.
- Da xac minh byte-for-byte tren sim.

### loopbackDetect — 2 dataTag xac nhan, khong dang moi

- `loopback_basic_lua.lua`: xac_nhan_trong, instidentity mac dinh.
- `loopback_enable_lua.lua`: xac_nhan_trong, instidentity: tu_truong:_InstID_3
  (echo truong index CUOI trong 4 bo LAN1-4, dung mau da biet).
- VLAN (danh sach con trong Loopback Detection) la "New Item" rong, bo qua.

### Ket qua chung

- 4/14 trang len muc 4 (logMgr, loopbackDetect + Energy Conservation da xong
  tu truoc). statusMgr/arpTable/macTable khong ap dung (chi doc). networkDiag/
  mirror khong test duoc an toan (rong/khong lien quan config). 5 trang BO
  QUA CO CHU DINH theo quyet dinh anh Huynn (xem tren). IPv6SwitchMgr bo qua
  do co che chan resubmit khong doi. Nhom Management & Diagnosis — VA CA DU
  AN — COI NHU HOAN TAT chien dich Apply/POST muc 4 trong pham vi an toan co
  the test tu xa.

## [2026-08-05] Ra soat lan 2 — trang chi doc con o muc 3, can anh Huynn quyet dinh

Theo yeu cau "ra lai xem co trang nao bi gan muc 3 sai": tim thay 2 trang
(ethWanStatus, voipStatus) bi gan muc 3 oan — da nang len muc 4 voi bang
chung song (Apply o trang cau hinh chia se object -> GET lai trang trang
thai thay gia tri moi ngay). Chi tiet xem STATUS.md muc "RA SOAT LAN 2".

Cac trang sau VAN giu muc 3, ly do khac nhau, CAN anh Huynn xac nhan huong
xu ly (khong tu quyet vi day la cau hoi chinh sach, khong phai thieu bang
chung ky thuat):

1. **Telemetry thuan, khong co trang ghi tuong ung**: ponopticalinfo,
   statusMgr, arpTable, macTable, conntracks. Du lieu (quang PON, CPU/
   uptime/serial, bang ARP, bang MAC, so ket noi NAT) khong co trang cau
   hinh nao trong may thiet bi ghi vao cung object — ban chat la "doc
   thuan" khong co "sua o A". Hoi anh Huynn: coi day la dat muc 4 mac
   dinh (vi da doc qua kho cau hinh chung, khong hardcode — dung tinh
   than rule 2.5) hay giu nguyen muc 3 vi khong co gi de kiem "B doi
   theo A"?

2. **l2tpStatus**: dung chung dataTag `l2tp_lua.lua` voi l2tpConfig, nhung
   l2tpConfig BAN THAN con muc 3 (bi chan client-side, chua Apply-test
   duoc). Muon nang l2tpStatus len muc 4 thi phai co bang chung Apply that
   cho l2tpConfig truoc — hien khong co.

3. **Wan3gStatus, tunnel4in6Status**: khong tim thay object trung voi
   Wan3gConfig/tunnel4in6Config trong factory.json khi doi chieu nhanh —
   can kiem sau hon (co the that su la 2 nguon du lieu doc lap: status
   doc runtime state cua dongle/tunnel, khong phai cau hinh nguoi dung).

4. **localNetStatus**: bundle 5 dataTag, chi 1/5 (wlan_wlanstatus_lua.lua)
   co the lien he voi mot trang muc 4 (wlan_wlanbasiconoff_lua.lua qua
   OBJ_WLANSETTING_ID); 4 dataTag con lai la telemetry (PON port, WLAN
   client stat, LAN device list, USB device list).

## [2026-08-06] Home + Topology — chua verify duoc kho hep 980px

Da dung xong va verify Home (muc 4) + Topology (muc 3) o kho desktop
(1536px) qua so_dom.py, ca hai deu khop cau truc hoan toan (xem
STATUS.md muc "DUNG HOME + TOPOLOGY"). Rieng kho hep (~980px, dung cho
NT-3) CHUA chup duoc trong phien nay vi cong cu resize_window cua trinh
duyet (Claude in Chrome) khong lam cua so nho lai (giu nguyen 1536px du
goi nhieu lan). Khong ro nguyen nhan (co the do trinh quan ly cua so
Windows tren may anh Huynn). Can anh Huynn tu resize trinh duyet thu cong
hoac dung DevTools device toolbar (nhu cach da lam voi cac trang khac o
980px truoc day) roi chup lai dau van tay, hoac em thu lai cong cu resize
o phien sau.

## [2026-08-06] QUYET DINH CHINH SACH — telemetry thuan = muc 4 mac dinh

Cau hoi dat ra tu lan ra soat truoc: cac trang/phan-trang telemetry thuan
(khong co trang cau hinh nao ghi cung du lieu de kiem "sua A doi B") co
tinh la muc 4 khong?

**Anh Huynn quyet dinh: CO, tinh la muc 4 mac dinh.** Ly do: kien truc
config_store.py da dam bao MOI dataTag (ke ca telemetry) deu doc qua kho
cau hinh chung self._state, khong hardcode rieng tung trang (dung rule
2.5) — khi khong co "trang thai" nao de kiem tra thi coi nhu thoa man
mac dinh, khong can trang ghi doi ung.

Da ap dung cho 9 trang: mmTopology, ponopticalinfo, Wan3gStatus,
tunnel4in6Status, conntracks, wlanStaScanAP, arpTable, macTable,
localNetStatus. Xem STATUS.md muc "QUYET DINH CHINH SACH" de biet chi
tiet va ly do KHONG ap dung cho l2tpStatus (co trang ghi nhung trang ghi
do ban than chua muc 4 — khac loai voi telemetry thuan).

Chinh sach nay AP DUNG CHO CA TUONG LAI: neu phat hien them trang telemetry
thuan moi (vd khi mo rong menu-tree hoac phat hien tab con moi), mac dinh
tinh muc 4 theo quy tac nay, khong can hoi lai tung truong hop.

## [2026-08-06] localServiceCtrl — 3 gia dinh chua co bang chung rieng

Sau khi tu lai (self-drive, cho phep cua anh Huynn) thiet bi that de tao
du lieu test cho Local Service Control (IPv4/IPv6/Remote Port), da nang
len muc 4 nhung con 3 diem SUY LUAN HOP LY (khong bia, nhung chua co bang
chung TRUC TIEP) can ghi lai:

1. **Bo dem sinh `_InstID` cho OBJ_FWSC_ID (IPv4) va OBJ_FWSCv6_ID (IPv6)
   co doc lap hay dung chung**: quan sat duoc IPv4 tao lien tiep 2 rule ->
   `FWSC1`, `FWSC2`; sau do XOA CA HAI, roi tao 1 rule IPv6 -> cung nhan
   `FWSC1`. Ca 2 cach giai thich DEU KHOP voi quan sat nay (bo dem doc lap
   moi object tu 0, HOAC 1 bo dem chung nhung da ve 0 sau khi xoa het).
   Code hien tai (`objects[ten]["danhSach"]`) gia dinh DOC LAP (moi object
   tu dem theo `len(instances)+1` cua chinh no) — don gian hon, khong can
   trang thai dung chung giua 2 object. Neu sau nay co bang chung mau
   thuan (vd tao IPv4 roi tao IPv6 NGAY, ma IPv6 nhan `FWSC2` thay vi
   `FWSC1`), phai sua lai thanh bo dem dung chung.
2. **Sua 1 instance CO SAN (Apply voi `_InstID` THAT, khong phai `-1`)**:
   CHUA tung thu tren thiet bi that (chi thu tao moi va xoa). Code
   (`dispatch.py`, nhanh `danhSach`) dung LAI ham `ghi_theo_instid()` +
   dang response `rut_gon` (giong nhanh tao moi) — suy luan hop ly vi
   CUNG 1 endpoint/URL, nhung CHUA xac nhan dang response THAT co giong
   nhau giua "tao moi" va "sua" hay khong.
3. **Thu tu `ParaName` khi GET danh sach CO du lieu**: moi lan chup
   `firewall_ipv4service_lua.lua`/`firewall_ipv6service_lua.lua` tren
   thiet bi that, danh sach LUON RONG (chua tung co rule that truoc khi em
   tu tao). Thu tu truong luu trong `factory.json`
   (`objects.OBJ_FWSC_ID.paraOrder`/`OBJ_FWSCv6_ID.paraOrder`) dang SUY TU
   thu tu tham so trong request Apply (reqBody), KHONG PHAI tu chinh
   response GET that (vi chua co GET that voi du lieu). Neu sau nay bat
   duoc 1 GET that co Instance du lieu, phai doi chieu lai thu tu nay.

Ca 3 diem tren KHONG chan viec danh gia muc 4 (dinh nghia muc 4 chi doi
hoi "sua o A thi B doi theo qua 1 kho cau hinh chung", da xac nhan bang
test song Apply-roi-GET) nhung ghi lai de biet gioi han that su cua bang
chung hien co.

## [2026-08-06] DMZ, Port Forwarding, Port Trigger — hoan tat nhom Internet > Security

Tiep tuc tu lai thiet bi that (cho phep anh Huynn) cho 3 trang cuoi cua
nhom Internet > Security. Cac diem can ghi lai:

1. **DMZ — `sub_TempMacAddr0..5` chua test nhanh MAC**: bang chung
   `DMZ-apply.that.post.json` phat hien 6 truong nay trong reqBody (luon
   rong khi chon muc tieu theo dia chi IP, la cach da test). CHUA thu
   nghiem truong hop chon muc tieu theo dia chi MAC (co the co UI/luong
   khac dan toi cac truong nay co gia tri) — da mo hinh hoa dung 6 truong
   voi gia tri mac dinh rong trong `factory.json`, nhung hanh vi khi CO gia
   tri (vd 1 truong duoc dien) CHUA duoc kiem chung.

2. **DMZ — khong the phuc hoi `InternalClient` rong qua UI**: trang thai
   factory goc ghi nhan tu dau du an la `Enable=0, InternalClient=""`
   (DMZ tat, chua tung cau hinh). Sau khi tu lai va nhap 1 IP that
   (192.168.1.150) de test Apply, KHONG the xoa trang lai ve rong — client
   validation JS chan submit ("This field is required") ke ca khi DMZ da
   chuyen Off. Da xac nhan day la CHAN THAT SU: `DMZ-revert.that.post.json`
   chi co 3 GET SNTP polling, KHONG co POST nao duoc gui (kiem tra thuc te
   `window.__xhrCaptured.length === 0`, khong chi la canh bao thi giac).
   Thiet bi that HIEN TAI dang o trang thai
   `Enable=0, InternalClient=192.168.1.150` — khac gia tri factory goc
   nhung AN TOAN VE CHUC NANG (DMZ van tat). `factory.json` (dung cho MOI
   nguoi dung moi cua ban gia lap) VAN giu `InternalClient=""` nhu bang
   chung goc ban dau, KHONG doi theo trang thai hien tai cua thiet bi that
   (vi day la gia tri TAM THOI do gioi han UI, khong phai gia tri "dung"
   moi). Neu sau nay co cach Factory Reset thiet bi that de xac nhan lai
   trang thai rong that su, nen kiem tra lai.

3. **Port Trigger — tong quat hoa ten truong ID**: xem chi tiet trong
   STATUS.md muc "NHOM INTERNET > SECURITY (HOAN TAT)". Tom tat: da them
   `config_store.truong_id_danh_sach()` + tham so `truong_id_the` cho
   `xml_ghi_thanhcong()` de ho tro doi tuong danh sach dung TEN TRUONG ID
   khac `_InstID` mac dinh (Port Trigger dung
   `OBJ_FWPT_ID._OBJ_InstID`). Da kiem trong sandbox, khop tuyet doi voi
   ca 2 bang chung Apply/Delete that. 3 object danh sach cu (Local Service
   Control IPv4/IPv6, Port Forwarding) KHONG bi anh huong (mac dinh khong
   doi).

4. **Sua 1 instance CO SAN cua Port Forwarding/Port Trigger**: giong diem
   2 cua muc localServiceCtrl o tren — CHUA tung thu tren thiet bi that
   (chi thu tao moi va xoa), dung LAI dang `rut_gon` theo suy luan hop ly
   tu cung 1 endpoint. Chua co bang chung rieng.

## [2026-08-06] DSLite, L2TP, Parental Controls, DDNS — Internet leftovers

Tiep tuc tu lai thiet bi that (cho phep anh Huynn, sau khi hoi va anh
Huynn chon nhom "Internet leftovers" trong 4 lua chon). Cac diem can ghi
lai:

1. **Parental Controls — bitmask `Week` chua giai ma day du**: request
   That gui `Week=64` khi tick DUY NHAT checkbox "Sun." (Chu Nhat). Suy ra
   day la bitmask 7 bit (1 bit/ngay), nhung CHUA thu nghiem cac to hop
   khac (nhieu ngay cung luc, hoac "Everyday") de xac dinh chinh xac thu
   tu bit (vd Sun=bit6 gia tri 64=2^6, hay mot quy uoc khac). Sim hien tai
   chi luu gia tri `Week` nguyen van nhu 1 chuoi/so, khong giai ma/tao lai
   — an toan vi chi ECHO LAI gia tri da gui, khong tu tinh toan.

2. **L2TP — truong `Method` suy tu form, chua co GET rieng xac nhan**:
   request Apply gui `Method=1` nhung day la GIA TRI CO SAN tu radio
   "Auto" da duoc chon san tren form KHI TAI TRANG (khong phai gia tri em
   tu chon) — CHUA co bang chung GET truc tiep nao (rieng biet voi Apply)
   xac nhan gia tri mac dinh cua truong nay la "1". Da dat mac dinh
   `factory.json` la `"1"` dua tren suy luan hop ly nay (radio pre-checked
   phai phan anh du lieu server, khong phai hardcode HTML), ghi lai o day
   phong truong hop sau nay co bang chung mau thuan.

3. **L2TP — Password/encode KHONG mo hinh hoa (co chu dinh, an toan)**:
   request Apply gui ca `Password` (chuoi ma hoa base64 khong ro thuat
   toan/khoa) LAN `encode` (chuoi ma hoa dai hon, co le boc nhieu truong
   nhay cam cung luc — cung co che da gap o `Localnet_LanMgrIpv4_
   DHCPBasicCfg_lua.lua`). KHAC voi DHCPBasicCfg (noi truong ma hoa CO
   xuat hien trong GET qua the `<encode>`, buoc phai giai quyet moi len
   duoc muc 4 day du), o day GET that CUA `l2tp_lua.lua` (da co truoc khi
   tu lai lan nay) KHONG BAO GIO tra ve truong `Password` — nen viec sim
   khong luu/echo truong nay la PHU HOP voi bang chung, khong phai mot gioi
   han can giai quyet sau. Response Apply THAT cung XAC NHAN khong co the
   `<encode>` nao duoc tra ve (dang `rut_gon` don gian).

4. **DSLite — su co ky thuat khi thu (da khac phuc, ghi lai de tranh lap
   lai)**: lan Apply THANH CONG dau tien tren thiet bi that KHONG duoc
   XHR-capture ghi lai (`window.__xhrCaptured.length === 0` sau khi kiem
   tra) du UI hien "Your data have been stored!" — nguyen nhan la patch
   XHR bi mat (`window.__xhrPatched` tro ve `undefined`) sau khi chuyen
   tab con WAN → DSLite (tab con trong cung 1 trang co the kich hoat 1
   dang reload/thay doi ngu canh JS khong luon luon nhat quan voi chuyen
   trang menu chinh). Khac phuc bang cach RE-INJECT patch roi bam lai
   Apply tren item DA TON TAI (khong tao item moi, tranh tao du lieu rac)
   de chup lai dung 1 request/response tuong duong.

5. **DDNS — server THAT SU validate, khong chi la luu cau hinh**: khac
   voi L2TP (Apply voi du lieu gia van THANH CONG, chi luu lai cau hinh),
   DDNS tu choi Apply voi du lieu gia (`IF_ERRORID=-257`,
   `IF_ERRORSTR=FAIL`) — cho thay firmware co goi ra ngoai (kiem tra voi
   may chu DynDNS that) truoc khi chap nhan luu cau hinh, khac han cac
   dataTag "chi luu, khong validate ngoai" da gap truoc do. Xac nhan
   KHONG co gi bi ghi (GET sau khi reload van tra ve Username/Host Name
   rong). KHONG THE len muc 4 neu khong co tai khoan DynDNS that.

---

## [2026-08-06] LAN + Routing leftovers — routeIpv4, routeIpv6, lanMgrIpv4

1. **Thu tu POST body KHONG dang tin cay lam paraOrder — phai uu tien GET
   that**: Static Routing IPv6 (`route_routestaticipv6_lua.lua`,
   `OBJ_ROUTESTATIC6_ID`). Thu tu tham so trong POST Apply that:
   `_InstID, Type, Enable, Alias, Interface, DestIP, PrefixLen, GWIP`.
   Thu tu THAT cua GET (nam ngay trong cung file bang chung
   `StaticRouteIpv6-apply.that.post.json`, phan hien thi lai danh sach sau
   khi tao): `_InstID, PrefixLen, Enable, DestIP, GWIP, Alias, Interface`
   — khac han nhau. Da sua factory.json de dung dung thu tu GET, khong
   dung thu tu POST. QUY TAC MOI: khi ca hai deu co bang chung, LUON uu
   tien GET cho `paraOrder`; POST chi dung khi khong co GET nao khac.

2. **Default Routing IPv4/IPv6 — khong revert duoc ve blank**: chon WAN
   Connection (vi du `internet_tr069`) roi Apply THANH CONG that, nhung
   thu chon lai ve "Please select" (blank) va Apply thi KHONG co request
   nao duoc gui (0 XHR captured), xac nhan qua reload trang van con gia
   tri da chon truoc do. Day la chan client-side IM LANG (khong hien loi
   nhu DMZ/L2TP), cung nhom voi cac truong "required" khac da gap. Chap
   nhan giu WAN da chon lam Default Route vi day la cau hinh HOP LE,
   khong nguy hai (khac voi DMZ/L2TP phai revert ve trang thai an toan).

3. **Static Routing IPv4/IPv6 — thiet bi CO SAN 1 route that san co**:
   khac gia thuyet truoc do ("danh sach rong, chi co New Item template"),
   khi tu lai lan nay phat hien CA HAI trang IPv4/IPv6 deu co san 1 route
   that (`ROUTING_RT1_IPV4FWD1`/`ROUTING_RT1_IPV6FWD1`) — co the do cau
   hinh mang that cua nha ("anh Huynn") hoac da duoc tao tu truoc. KHONG
   dong den (khong xoa/sua) 2 entry nay theo nguyen tac khong pha huy
   du lieu that co san khong phai do minh tao ra. Da dung "Create New
   Item" de test rieng vong doi Create+Delete voi entry test rieng
   (TestStaticRoute/TestStaticRoute6), xoa sach sau khi xong.

4. **DHCP Binding (lanMgrIpv4) — danh sach RONG THAT SU, khac routeIpv4**:
   khong giong Static Routing (co san 1 entry that), DHCP Binding cua
   `lanMgrIpv4` KHONG co entry nao san co — GET truoc Apply xac nhan
   `<OBJ_DHCPBIND_ID></OBJ_DHCPBIND_ID>` rong. Da tu tao 1 entry test
   (TestBind) roi xoa sach, khong de lai du lieu tren thiet bi that.
   _InstID moi sinh theo mau `DEV.V4DP.Sr.Pl1.Bd1` (khac han mau
   `DEV.ROUTING.RT1.IPV4FWD*` cua Routing) — moi doi tuong danh sach co
   tien to ID rieng, khong doan theo mau chung.

5. **lanMgrIpv4 len muc 4 tong the du con 5 truong ma hoa chua giai
   duoc**: ke tuc dung chinh sach da ap dung cho RIP/FTP/Samba/PON (xem
   cac muc truoc trong file nay va route-inventory.json) — khi MOT trang
   co nhieu thanh phan tuong tac va chi mot vai truong bi chan boi ma
   hoa client-side khong the giai (DHCP Server: IPAddr/MinAddress/
   MaxAddress/DNSServer1/DNSServer2 cua `OBJ_Br0AndDhcpsHosCfg_ID`), trang
   van duoc len muc 4 TONG THE neu MOI thanh phan KHAC (DHCP Binding, DHCP
   Port Control, cac truong khong ma hoa cua DHCP Server) da xac nhan
   Apply that thanh cong va kho cau hinh trung tam hoat dong dung. 5
   truong ma hoa van la NGOAI LE VINH VIEN da ghi trong ban ghi
   2026-08-04/05 o tren, khong phai loi can sua sau nay (chi giai quyet
   duoc neu co bang chung ve khoa/thuat toan giai ma).

---

## [2026-08-06] l2tpStatus + dns Host Name — 2 phat hien nho

1. **l2tpStatus len muc 4 sau khi dieu kien loai tru bien mat**: trang
   nay CHIA SE dataTag `l2tp_lua.lua` voi `l2tpConfig`. Truoc do bi giu o
   muc 3 vi ban than `l2tpConfig` con muc 3. Khi `l2tpConfig` len muc 4
   (cung ngay, nhom LAN+Routing leftovers), dieu kien loai tru khong con
   dung — da kiem lai quan he ghi-doc tren sandbox (Apply trang A, GET
   trang B qua cung dataTag) va len muc 4. Bai hoc: mot so quyet dinh
   "giu muc 3" la TAM THOI, phu thuoc trang thai cua trang khac — can ra
   soat lai khi trang phu thuoc do thay doi trang thai, khong chi ap
   dung 1 lan roi quen.

2. **DNS Host Name — tham so form KHONG PHAI truong du lieu that**: POST
   Apply/Delete cua `dns_hostname_lua.lua` gui THEM 2 tham so `OBJID=DNS`
   va `LeaseTime=isDNSHOSTInst` ben canh `HostName`/`IPAddress` that su.
   Ca hai deu la GIA TRI CO DINH (khong doi giua cac lan test) va KHONG
   xuat hien trong GET (`<ALLDNSHOST>` chi co `_InstID, IPAddress,
   HostName`). Ket luan: day la 2 tham so noi bo cua form JS (co the
   dung de router phia server nhan biet loai ban ghi hoac phuc vu logic
   validate), KHONG PHAI truong cua doi tuong — da loai khoi `paraOrder`.
   Day la vi du cu the cho nguyen tac "chi model dung nhung gi GET xac
   nhan, POST co the co them noise".

---

## [2026-08-06] IPv6SwitchMgr — quy trinh 2 buoc Apply/Restart (kien truc MOI)

- Route: `IPv6SwitchMgr`, dataTag `ipv6_enable_lua.lua`, object
  `OBJ_IPGLOBAL_ID`. Day la trang DUY NHAT trong toan bo 77 trang doi hoi
  thiet bi REBOOT that su de lay bang chung Apply — anh Huynn da tu tay
  xac nhan cho phep sau khi em bao ro rui ro (dialog that hien "The device
  will reboot after the IPv6 Switch is changed").
- Khac VOI TAT CA cac dataTag khac tung gap (1 `IF_ACTION=Apply` duy nhat,
  ghi xong tra ve NGAY), trang nay client JS gui **2 request POST LIEN
  TIEP CUNG dataTag** voi 2 gia tri `IF_ACTION` khac nhau:
  1. `Apply` — CHUA ghi gi, chi la buoc "xac nhan truoc khi hoi dialog
     reboot". Response dang `xac_nhan_trong` (co INSTIDENTITY, khong
     `_InstID`, khong du lieu).
  2. `Restart` — gui NGAY SAU, **DUNG CUNG `_sessionTOKEN`** voi buoc 1
     (token KHONG xoay giua 2 buoc — chi xoay khi buoc nao THAT SU ghi).
     Day moi la buoc ghi that + kich hoat reboot. Response dang
     `day_du_gioi_han` (KHONG INSTIDENTITY, KHONG `_InstID`, CHI du lieu
     object).
- He qua ky thuat: nhanh xu ly GHI CHUNG trong `dispatch.py` (truoc gio
  chi biet "1 IF_ACTION -> ghi 1 lan -> 1 dang response co dinh qua
  `ghiDangKieu`") KHONG mo ta duoc pattern nay. Da them co che TONG QUAT
  moi: `config_store.hanh_dong_theo_buoc(data_tag)` doc truong
  `dataTags[tag]["hanhDongTheoBuoc"] = {"<IF_ACTION>": {"ghi": bool,
  "dang": "<ghiDangKieu>"}}`. Nhanh nay dat TRUOC nhanh ghi-1-lan mac dinh
  trong `menu_data_ghi()`, CHI kich hoat khi dataTag co khai bao ro truong
  nay — da xac nhan KHONG anh huong 70+ dataTag khac (chay lai
  `tools_kiem_thu.py` truoc/sau bang `git stash`, ket qua giong het nhau:
  36/37 dat, 1 loi CO SAN TRUOC khong lien quan).
- Da doi chieu sandbox `--reset`: ca 2 buoc khop CHINH XAC (byte-for-byte)
  voi bang chung that.
- Trang thai thiet bi that SAU KHI TEST: IPv6 dang O TRANG THAI OFF (chua
  bat lai On) — theo yeu cau tranh ep thiet bi reboot lan thu 2 ngay lap
  tuc trong cung 1 phien lam viec, anh Huynn se tu bat lai khi tien.
