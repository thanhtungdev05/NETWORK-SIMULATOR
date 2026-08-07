# Ghi chú các lượt chụp hành vi GHI (Apply / Save)

> Không có ghi chú này thì file HAR rất khó đọc: nhìn thấy tham số gửi đi
> nhưng không biết nó ứng với ô nào trên màn hình.
> Mỗi lần bấm Apply mà có chụp HAR thì thêm một mục vào đây.

---

## Mẫu

```markdown
### <tên-file>.har
- Trang: <Menu cấp 1> › <Menu cấp 2> › <tab cấp 3 nếu có>
- viewTag: <ví dụ sntp>
- Nút đã bấm: <nhãn nút trên màn hình>
- Trường đã đổi: <nhãn hiện trên màn hình>
- Giá trị CŨ: <...>
- Giá trị MỚI: <...>
- Kết quả trên màn hình: <thành công / báo lỗi gì>
- Đã trả lại giá trị cũ chưa: <rồi / chưa>
- Ngày chụp: YYYY-MM-DD
```

---

### sntp-apply.har

- Trang: Internet › SNTP
- viewTag: `sntp`
- Nút đã bấm: `Apply` (nút xanh, góc dưới bên phải khung SNTP)
- Trường đã đổi: `Poll Interval` (nhãn trên màn hình), đơn vị giây
- Giá trị CŨ: `86400`
- Giá trị MỚI: `43200`
- Kết quả trên màn hình: thành công — trình duyệt tải `succ_m.png`, ô hiển thị `43200`
- Đã trả lại giá trị cũ chưa: rồi (bấm Apply lần hai với `86400`)
- Ngày chụp: 2026-08-03

**Bốn trường KHÔNG đổi** (ghi lại để đối chiếu tham số nào giữ nguyên):

| Trường | Giá trị |
|---|---|
| Time Zone | (GMT+07:00) Bangkok, Hanoi |
| Primary NTP Server | `vn.pool.ntp.org` |
| Secondary NTP Server | `asia.pool.ntp.org` |
| DSCP | (trống) |

**Trường ẩn:** trang hiện 5 ô, nhưng mã gốc `views/sntp.html` có 11 tên trường.
Sáu trường không hiện: `NtpServer3`, `NtpServer4`, `NtpServer5`, `Enable`,
`DaylightSavingsUsed`, `SntpBindWanName`. Cần đối chiếu HAR xem chúng có được
gửi kèm khi Apply hay không.

**Response GHI thành công** (quan trọng — đây là mẫu bằng chứng ĐẦU TIÊN
cho định dạng response GHI, dùng làm mặc định cho `xml_ghi_thanhcong()`
từ 2026-08-05 bản 20, sau khi phát hiện định dạng rút gọn suy ra từ
EnergyMode ở bản 19 là SAI cho đa số trang):

```
<ajax_response_xml_root><IF_ERRORPARAM>SUCC</IF_ERRORPARAM>
<IF_ERRORTYPE>SUCC</IF_ERRORTYPE><IF_ERRORSTR>SUCC</IF_ERRORSTR>
<IF_ERRORID>0</IF_ERRORID><_InstID>IGD</_InstID>
<OBJ_SNTP_ID><Instance>...(đầy đủ mọi ParaName/ParaValue, giống hệt GET)...
</Instance></OBJ_SNTP_ID></ajax_response_xml_root>
```

Không có `<INSTIDENTITY>`. Về cơ bản = response GET bình thường + 1 thẻ
`<_InstID>` chèn ngay sau khối `IF_ERROR*`.

**2026-08-05 (bản 20)**: đã phát lại ĐÚNG kịch bản này trên sim (không
đụng thiết bị thật, vì bằng chứng thật đã có sẵn) — đổi 86400→43200 rồi
→86400, cả hai Apply đều thành công khi có token sống hợp lệ, response
sim khớp cấu trúc/thứ tự thẻ 100% với bằng chứng thật (đã kiểm bằng test
đơn vị, so từng thẻ). **SNTP lên mức 4.**

**Phát hiện phụ**: bấm Apply lần 2 NGAY sau lần 1 (không tải lại trang)
trên sim bị `SessionTimeout` vì `session.doi_token()` xoay token sau mỗi
lần ghi mà client không tự đồng bộ. HAR này chỉ có 1 request POST nên
KHÔNG xác nhận được thiết bị thật có xoay token sau mỗi lần ghi hay
không — xem `spec/missing-evidence.md` bản 20, mục cần điều tra thêm.

---

### EnergyMode-apply.that.post.json

- Trang: Management & Diagnosis › Energy Conservation › Energy Mode
- viewTag: `EnergyMode`
- Nút đã bấm: `Apply` (`Btn_apply_EnergyConf`)
- Trường đã đổi: KHÔNG trường nào (Apply với giá trị giữ nguyên, theo
  phương pháp an toàn đã thống nhất)
- Giá trị: `PowerEnable=1`, `PowerMode=0` (không đổi)
- Request: `POST /?_type=menuData&_tag=energy_config_lua.lua`,
  `IF_ACTION=Apply&_InstID=IGD&PowerEnable=1&PowerMode=0&Btn_apply_EnergyConf=&Btn_cancel_EnergyConf=&_sessionTOKEN=...`
- Response: HTTP 200, XML rút gọn (228 byte) —
  `<ajax_response_xml_root><INSTIDENTITY>IGD</INSTIDENTITY><IF_ERRORID>0</IF_ERRORID><IF_ERRORTYPE>SUCC</IF_ERRORTYPE><IF_ERRORSTR>SUCC</IF_ERRORSTR><IF_ERRORPARAM>SUCC</IF_ERRORPARAM><_InstID>IGD</_InstID></ajax_response_xml_root>`
  — KHÁC với response GET (không phải dữ liệu đầy đủ của đối tượng).
- Kết quả trên màn hình: thành công, không có lỗi hiển thị.
- Đã trả lại giá trị cũ chưa: không cần (giá trị không đổi).
- Ngày chụp: 2026-08-05.
- **Bằng chứng này dẫn tới việc phát hiện + sửa 3 lỗi kiến trúc dùng chung
  cho toàn bộ 75 trang** (token session tĩnh ở `index.html` và ở từng
  `views/*.html`, định dạng response GHI sai) — xem chi tiết
  `spec/missing-evidence.md` bản 19.
- Đã xác minh trên sim SAU KHI sửa: bấm Apply thật trên UI (không phải
  gọi API tay) → có POST thật, HTTP 200, không bị điều hướng/reload.

---

### LoopbackDetectBasic-apply.that.post.json — bằng chứng LỖI (FAIL), không phải thành công

- Trang: Management & Diagnosis › Diagnosis › Loopback Detection (tab Basic)
- viewTag: `networkDiag` (con: `loopbackDetect`)
- Nút đã bấm: `Apply` (`Btn_apply_LoopbackDetectBasic`)
- Trường đã đổi: KHÔNG chủ ý đổi trường nào — mục tiêu là Apply giữ
  nguyên giá trị, nhưng KHÔNG THÀNH CÔNG như dự kiến, xem bên dưới.
- Request thực tế đã gửi:
  `IF_ACTION=Apply&_InstID=&Ethertype=NaN&DMac=ff:ff:ff:ff:ff:ff&V_Ethertype=&Sendinterval=&RenewTime=&CheckInterval=&_sessionTOKEN=...`
  — chú ý `Ethertype=NaN` và `V_Ethertype`/`Sendinterval`/`RenewTime`/
  `CheckInterval`/`_InstID` đều RỖNG, dù trên màn hình các ô này đang
  hiện giá trị thật (`880a`/`250`/`300`/`15`). Đã thử kích hoạt lại bằng
  jQuery `.trigger('focus'/'keyup'/'change'/'blur')` trên các ô trước khi
  bấm Apply — KHÔNG khắc phục được, kết quả giống hệt lần đầu (2 lần thử,
  cùng response). Nghi ngờ trang dùng một cơ chế thu thập giá trị/tính
  `Ethertype` từ `V_Ethertype` KHÔNG phản ứng với sự kiện JS giả lập
  (`.trigger`) mà cần thao tác bàn phím thật — CHƯA xác minh được nguyên
  nhân chính xác, cần điều tra thêm ở phiên sau nếu muốn trang này lên
  mức 4.
- Response: HTTP 200, XML LỖI —
  `<ajax_response_xml_root><INSTIDENTITY></INSTIDENTITY><IF_ERRORID>197</IF_ERRORID><IF_ERRORTYPE>-1</IF_ERRORTYPE><IF_ERRORSTR>FAIL</IF_ERRORSTR><IF_ERRORPARAM>Ethertype</IF_ERRORPARAM></ajax_response_xml_root>`
  — **bằng chứng MỚI, lần đầu có định dạng response LỖI thật cho response
  GHI** (khác hẳn định dạng thành công của EnergyMode, và khác định dạng
  lỗi `SessionTimeout` của response GET). Ghi lại `IF_ERRORID`/
  `IF_ERRORTYPE`/`IF_ERRORPARAM` là các trường CHỈ xuất hiện ở lỗi validate
  tham số, không phải lỗi phiên.
- Kết quả trên màn hình: không kiểm tra kỹ (đang tập trung capture qua
  JS), nhưng response FAIL nghĩa là **thiết bị TỪ CHỐI ghi — không có gì
  thay đổi trên cấu hình thật**, an toàn.
- Đã trả lại giá trị cũ chưa: không cần, không có gì bị ghi.
- Ngày chụp: 2026-08-05.
- **CHƯA lên mức 4 cho trang này** — cần capture lại một Apply THÀNH CÔNG
  (không lỗi) trước khi coi là đủ bằng chứng mức 4. Xem
  `spec/missing-evidence.md` bản 19 (mục bổ sung LoopbackDetectBasic).

---

### MirroManag-apply.that.post.json — bằng chứng LỖI (instance sai), không phải thành công

- Trang: Management & Diagnosis › Diagnosis › Mirror Configuration
- viewTag: `mirror`
- Nút đã bấm: nhầm `Btn_apply_MirroManag` (không hậu tố — nút của
  template "thêm mới", KHÔNG phải nút của instance đang cấu hình
  `Btn_apply_MirroManag:0`). Trang có 2 nút cùng class `Btn_apply` —
  cần phân biệt kỹ trước khi bấm ở các trang khác cùng dạng.
- Request đã gửi: `IF_ACTION=Apply&_InstID=-1&MirrorEnable=1&MirrorSrc=IGD.WANALL&MirrorDest=&...`
- Response: HTTP 200, LỖI —
  `<ajax_response_xml_root><INSTIDENTITY></INSTIDENTITY><IF_ERRORID>-261</IF_ERRORID><IF_ERRORTYPE>-1</IF_ERRORTYPE><IF_ERRORSTR>FAIL</IF_ERRORSTR><IF_ERRORPARAM>SUCC</IF_ERRORPARAM><_InstID></_InstID></ajax_response_xml_root>`
  — mã lỗi khác với lỗi validate của loopbackDetect (`IF_ERRORID=-261` ở
  đây vs `197` ở đó) — có thể `-261` là mã riêng cho "_InstID không hợp
  lệ". Ghi lại làm tư liệu tham khảo mã lỗi, KHÔNG phải bằng chứng cho
  hành vi Apply bình thường.
- Kết quả: KHÔNG có gì bị ghi (instance -1 không tồn tại). An toàn.
- Lần bấm đúng nút `Btn_apply_MirroManag:0` sau đó: bị chặn HOÀN TOÀN ở
  phía client (jQuery-validate) do `MirrorDest` là select bắt buộc đang
  rỗng — không có request nào được gửi đi, không có gì để chụp.
- Ngày chụp: 2026-08-05.
- **CHƯA lên mức 4 cho `mirror`**. Xem `spec/missing-evidence.md` bản 19
  (mục bổ sung mirror + nhận định chung sau 3 lần thử).

---

### PortBinding-apply.that.post.json

- Trang: Internet › Port Binding
- viewTag: `portBinding`
- Nút đã bấm: `Btn_apply_PORTBindConf:0` (nút của instance thật, KHÔNG
  phải `Btn_apply_PORTBindConf` không hậu tố — bài học từ `mirror`)
- Trường đã đổi: KHÔNG (Apply giữ nguyên: `WANViewName=DEV.IP.IF3`,
  `LANViewName=` rỗng, các checkbox `Enable_N` đều tắt)
- Response: HTTP 200, XML — **mẫu định dạng THỨ BA** (khác cả EnergyMode
  và SNTP):
  `<ajax_response_xml_root><INSTIDENTITY></INSTIDENTITY><IF_ERRORID>0</IF_ERRORID><IF_ERRORTYPE>SUCC</IF_ERRORTYPE><IF_ERRORSTR>SUCC</IF_ERRORSTR><IF_ERRORPARAM>SUCC</IF_ERRORPARAM></ajax_response_xml_root>`
  — có `<INSTIDENTITY>` nhưng RỖNG (request không gửi `_InstID`), KHÔNG
  có `<_InstID>`, không có dữ liệu đối tượng.
- Kết quả: thành công, không lỗi.
- Ngày chụp: 2026-08-05.
- Đã thêm dạng `"xac_nhan_trong"` vào `xml_ghi_thanhcong()`, đặt
  `ghiDangKieu` cho `portbinding_lua.lua` trong `factory.json`. Đã phát
  lại thành công trên sim (POST 200, không reload). **Port Binding lên
  mức 4.** Xem `spec/missing-evidence.md` bản 21.

---

### RIP-apply.that.post.json và MulticastMode-apply.that.post.json

- RIP (Internet › Dynamic Routing, `Btn_apply_RIP`, giá trị không đổi,
  `RipEnabled=0`): request có tham số `encode` (RipAuthKey mã hoá, CHƯA
  CÓ khoá giải mã — cùng loại vấn đề đã ghi nhận ở DHCPBasicCfg). Sim bỏ
  qua an toàn (tham số lạ, không ghi). Response dạng `xac_nhan_trong`.
- Multicast Mode (Internet › Multicast › Multicast Mode,
  `Btn_apply_MulticastMode`, giá trị không đổi): form chỉ 1 select, response
  cũng dạng `xac_nhan_trong`.
- Cả hai: thành công, không lỗi, đã phát lại đúng trên sim (POST 200,
  không reload). **Cả hai lên mức 4.** Ngày chụp: 2026-08-05. Xem
  `spec/missing-evidence.md` bản 22.

---

### IGMP-apply.that.post.json và MLD-apply.that.post.json

- IGMP (Internet › Multicast › IGMP, `multicast_igmpwan_lua.lua`,
  `_InstID=DEV.IGMPWan1`, `WanCID=DEV.IP.IF3` không đổi): response dạng
  `rut_gon`, NHƯNG thứ tự thẻ header khác EnergyMode
  (`ID,PARAM,TYPE,STR` thay vì `ID,TYPE,STR,PARAM`) —
  `<ajax_response_xml_root><INSTIDENTITY>DEV.IGMPWan1</INSTIDENTITY><IF_ERRORID>0</IF_ERRORID><IF_ERRORPARAM>SUCC</IF_ERRORPARAM><IF_ERRORTYPE>SUCC</IF_ERRORTYPE><IF_ERRORSTR>SUCC</IF_ERRORSTR><_InstID>DEV.IGMPWan1</_InstID></ajax_response_xml_root>`.
  Đã hỏi anh Huynn và xác nhận: thứ tự thẻ không quan trọng (client parse
  theo tên thẻ) — coi là cùng dạng `rut_gon`. Xem
  `spec/missing-evidence.md` bản 23.
- MLD (Internet › Multicast › MLD, `multicast_mldwan_lua.lua`,
  `_InstID=DEV.MLDWan1`): cùng dạng `rut_gon` như IGMP.
- Cả hai: thành công, không đổi giá trị. **Cả hai lên mức 4.** Ngày
  chụp: 2026-08-05.

---

### MulticastBasic-apply.that.post.json

- Trang: Internet › Multicast › Basic
- viewTag: `multicastbasic`, dataTag `igmp_lua.lua`
- Trường đã đổi: KHÔNG (`Agtime=360`, giá trị mặc định, không đổi)
- Response: dạng `xac_nhan_trong` (mẫu thứ 4 của dạng này, sau Port
  Binding/RIP/Multicast Mode) — củng cố nhận định dạng này phổ biến cho
  dataTag scalar không theo instance.
- Kết quả: thành công. **Lên mức 4.** Ngày chụp: 2026-08-05.

---

### IgmpWLANCONF-apply.that.post.json — dataTag KIỂU JSON đầu tiên có Apply

- Trang: Internet › Multicast › Multicast on Wi-Fi
- viewTag: `IgmpWLANCONF`, dataTag `multicast_model.lua` (lưu trong
  `jsonDataTags`, không phải `dataTags` như mọi trang khác)
- Nút đã bấm: `Btn_apply_IGMPWlanConf`
- Request: `IF_ACTION=Apply&_InstID=&Enable=1&Btn_apply_IGMPWlanConf=&Btn_cancel_IGMPWlanConf=&_sessionTOKEN=...`
  tới `/?_type=menuData&_tag=multicast_model.lua`. Trường `Enable=1`
  không đổi so với giá trị hiện tại.
- Response: `Content-Type: application/json; charset=utf-8`, **KHÔNG
  phải XML**, không bọc `<ajax_response_xml_root>`, không echo dữ liệu
  đối tượng (khác `json_cho()` dùng cho GET):
  `{"IF_ERRORPARAM":"SUCC","IF_ERRORTYPE":"SUCC","IF_ERRORSTR":"SUCC","IF_ERRORID":0}`
- Phát hiện quan trọng: đường ghi cũ (`dispatch.menu_data_ghi()`) không
  có nhánh nào xử lý dataTag kiểu JSON — đã thêm
  `doi_tuong_json_cua()`/`ghi_json()`/`json_ghi_thanhcong()` trong
  `config_store.py` và nhánh rẽ trong `dispatch.py`. Xem
  `spec/missing-evidence.md` bản 23 để biết chi tiết đầy đủ.
- Kết quả trên màn hình: thành công, không lỗi.
- Ngày chụp: 2026-08-05.
- Đã xác minh trên sim (server chạy trong sandbox, state riêng): response
  khớp byte với bằng chứng thật, và thử đổi thật `Enable: 1→0→1` xác nhận
  giá trị được lưu đúng vào `jsonDataTags` (không phải no-op). **Lên mức
  4.**

---

### PortLocate-apply.that.post.json

- Trang: Internet › Port Locating
- viewTag: `portlocate`, dataTag `Internet_PortLocate_lua.lua`
- Nút đã bấm: `Btn_apply_PortLocate:0` (trang cũng có nút template
  `Btn_apply_PortLocate` không hậu tố, ẩn — bài học từ `mirror`/`portBinding`)
- Trường đã đổi: KHÔNG (giữ nguyên `DhcpEnable=0`, `PppoeEnable=0`,
  `DHCPv6Enable=0`, `PortLocateFormat` giữ nguyên chuỗi hiện có)
- Response: dạng `xac_nhan_trong`, NHƯNG `INSTIDENTITY` CÓ GIÁ TRỊ
  (`IGD`, echo `_InstID=IGD` đã gửi) — khác các mẫu trước của dạng này
  (Port Binding/RIP/Multicast Mode/Multicast Basic đều gửi `_InstID`
  rỗng nên `INSTIDENTITY` rỗng). Xác nhận công thức "echo `_InstID` gửi
  lên, có hay không có giá trị" là ĐÚNG cho cả 2 trường hợp — không phải
  1 dạng mới, chỉ là biến thể giá trị của `xac_nhan_trong`.
- Kết quả: thành công. **Lên mức 4.** Ngày chụp: 2026-08-05.

---

### PonLoid-apply.that.post.json — đã sanitize thông tin đăng nhập PON thật

- Trang: Internet › PON Information › LOID
- viewTag: `ponLoid`, dataTag `poninfo_loid_lua.lua`
- Nút đã bấm: `Btn_apply` (chỉ 1 nút, không có template trùng tên)
- Trường đã đổi: KHÔNG chủ ý đổi (giữ nguyên LOID/Password hiện có qua
  UI), NHƯNG `PonLoid`, `LoidPasswd` (đã mã hoá client-side, 24 ký tự,
  khác độ dài 6 ký tự hiển thị trên UI) và `encode` (ciphertext lớn) là
  DỮ LIỆU ĐĂNG NHẬP PON THẬT CỦA THUÊ BAO — nhạy cảm hơn cả mật khẩu
  WLAN đã sanitize trước đây (đây là thông tin xác thực với ISP). Đã
  THAY BẰNG GIÁ TRỊ GIẢ trước khi lưu vào bằng chứng vĩnh viễn, giữ
  nguyên cấu trúc/thứ tự tham số. Xem `spec/missing-evidence.md`.
- Response: dạng `xac_nhan_trong` (`INSTIDENTITY=IGD` echo, giống
  PortLocate). Kết quả: thành công.
- Lần thử ĐẦU TIÊN: ngay sau response SUCCESS, phiên bị đăng xuất. Nghi
  ban đầu là hành vi bảo mật thật của thiết bị. ĐÃ KIỂM TRA LẠI: đăng
  nhập lại, thử thêm 3 lần Apply liên tiếp trên 1 lần tải trang — CẢ 3
  LẦN đều SUCCESS, phiên không bị đăng xuất. Kết luận: giả thuyết "Apply
  LOID buộc đăng xuất" BỊ BÁC BỎ — lần đăng xuất đầu chỉ là token cũ/
  stale, không phải hành vi của dataTag này. Xem `spec/missing-evidence.md`.
- **Lên mức 4** (định dạng response đã xác nhận ổn định qua 4 lần Apply
  thành công liên tiếp — 1 lần đầu + 3 lần kiểm tra lại).
- Ngày chụp: 2026-08-05.

---

### PonSn-apply.that.post.json — đã sanitize thông tin đăng nhập PON thật

- Trang: Internet › PON Information › SN
- viewTag: `ponSn`, dataTag `poninfo_sn_lua.lua`
- Nút đã bấm: `Btn_apply` (chỉ 1 nút)
- Trường trên UI: `SN` (readonly, chỉ hiển thị), `Register ID` và
  `Password` (2 lựa chọn radio LOẠI TRỪ NHAU, mặc định KHÔNG chọn cái
  nào). Đã bấm Apply mà KHÔNG chọn radio nào (không có "giá trị hiện tại"
  nào để giữ nguyên, vì đây là form chọn 1-trong-2 phương thức xác thực,
  không phải form hiển thị cấu hình đã lưu).
- Trường đã đổi: KHÔNG chủ ý, nhưng `Sn` (serial thật của thiết bị,
  giống bằng chứng DOM `ponSn.that.980-1134.json` đã sanitize trước đó),
  `Ridpw`/`Pwd` (client-side encode, 24 ký tự) và `encode` (ciphertext
  684 ký tự) là DỮ LIỆU ĐĂNG NHẬP PON THẬT — đã sanitize như `PonLoid`
  trước khi lưu.
- Response: dạng `xac_nhan_trong` (`INSTIDENTITY=IGD`, giống PortLocate/
  PonLoid). Kết quả: thành công, phiên KHÔNG bị đăng xuất (đã kiểm tra
  bằng screenshot ngay sau Apply).
- **Lên mức 4.** Ngày chụp: 2026-08-05.

---

### Firewall-apply.that.post.json, FilterCriteria-apply.that.post.json, ALG-apply.that.post.json

- Firewall (`firewall_config_lua.lua`, `Enable=1`, `Level=Middle` không
  đổi): dạng `rut_gon` (INSTIDENTITY=IGD + thẻ `_InstID`). **Lên mức 4.**
- Filter Criteria (`firewall_filterglobal_lua.lua`, không đổi): dạng
  `xac_nhan_trong` nhưng **INSTIDENTITY LUÔN RỖNG dù có gửi `_InstID=IGD`**
  — phản bác giả thuyết "luôn echo" đặt ra từ PortLocate/PonLoid/PonSn.
  Thêm trường con `instidentity: "rong"` cho dataTag này trong
  `config_store.py`/`factory.json`. Nút Apply DÙNG CHUNG id
  `Btn_apply_FirewallConf` với trang Firewall — đã xác nhận đây là cấu
  trúc HTML THẬT (verify qua `_tag` request thực tế khác nhau giữa 2
  trang), không phải lỗi capture, giữ nguyên không "sửa". **Lên mức 4.**
- ALG (`firewall_alg_lua.lua`, tất cả 6 lựa chọn On, không đổi): dạng
  `rut_gon`. **Lên mức 4.**
- Local Service Control, Port Forwarding, Port Trigger: danh sách rỗng
  (`_InstID=-1`, form đang ở trạng thái "thêm mới"), không có instance
  thật để giữ nguyên — KHÔNG thử Apply (giống `parentCtrl`). Vẫn mức 3.
- DMZ: thử Apply (giữ nguyên, `DMZ=Off`) bị CHẶN CLIENT-SIDE
  ("This field is required." cho LAN Host dù DMZ đang Off) — không gửi
  request nào, an toàn. Vẫn mức 3.
- Ngày chụp: 2026-08-05.

---

### EthWanConfig-apply.that.post.json — Apply trên WAN đang sống (Always On), đã xin phép trước

- Trang: Internet › WAN › WAN, instance `internet_tr069`
- viewTag: `ethWanConfig`, dataTag `wan_internet_lua.lua`
- Đây là kết nối Internet ĐANG SỬ DỤNG (PPPoE, Always On) — đã hỏi và được
  anh Huynn xác nhận trước khi bấm Apply do rủi ro gián đoạn mạng.
- Nút: `Btn_apply_internet:0`. Giữ nguyên toàn bộ giá trị.
- Lần thử ĐẦU TIÊN lỗi `-1452` (token cũ, xem missing-evidence.md) — không
  ghi gì. Tải lại `/`, thử lại THÀNH CÔNG.
- Response: dạng `rut_gon` NHƯNG có thêm các thẻ lạ sau `_InstID`:
  `<wantype>pppoe</wantype>` (lặp lại 2 lần), `<Status>2</Status>`,
  `<encode>UserName,Password</encode>` (đây là danh sách TÊN trường được mã
  hoá, không phải ciphertext — khác nghĩa với tham số `encode` trong
  request). Đã thêm `dataTags[tag]["theThemSauRutGon"]` để chèn nguyên văn
  các thẻ này.
- `UserName`/`Password` trong request là thông tin đăng nhập PPPoE FPT THẬT
  (mã hoá client-side) — đã sanitize trước khi lưu, cùng mức cẩn trọng như
  PonLoid/PonSn.
- Kết quả trên màn hình: thành công, kết nối Internet không bị gián đoạn
  (đã kiểm tra lại UI ngay sau đó, không có gì bất thường).
- **Lên mức 4.** Ngày chụp: 2026-08-05.

---

### Wan3gConfig-apply.that.post.json

- Trang: Internet › WAN › 3G/4G › 3G/4G Working Mode
- viewTag: `Wan3gConfig`, dataTag `wwan_backup_lua.lua`
- Không có dongle 3G/4G cắm thật (an toàn tuyệt đối, không ảnh hưởng WAN
  chính). Apply giữ nguyên (`Enable=1`, `DelayUpTime=30`, `DelayDownTime=0`).
- Lần đầu lỗi `-1452` (token cũ do vừa Apply thành công ở trang WAN trước
  đó) — tải lại `/`, thử lại thành công.
- Response: dạng `xac_nhan_trong`, echo `INSTIDENTITY=IGD`.
- **Lên mức 4.** Ngày chụp: 2026-08-05.
- DSLite (`tunnel4in6Config`): danh sách rỗng (form "New Item", chưa có kết
  nối DSLite nào) — không thử Apply. Vẫn mức 3.
- L2TP (`l2tpConfig`): có 1 instance thật (`l2tp_internet`) nhưng bị CHẶN
  CLIENT-SIDE ("This field is required." cho `L2TP Server` và `Username`,
  cả 2 đang rỗng trên UI thật) — không gửi request nào. Vẫn mức 3.

---

### WlanBasicOnOff-apply.that.post.json, WlanBasicAdvanced2G-apply.that.post.json

- Trang: Local Network › WLAN › WLAN Basic
- **WLAN On/Off Configuration** (`wlan_wlanbasiconoff_lua.lua`): Apply
  giữ nguyên (2.4/5GHz On, 6GHz Off). Response dạng `xac_nhan_trong`
  nhưng `INSTIDENTITY` = `DEV.WIFI.RD3` (echo `_InstID_2`, KHÔNG phải
  `_InstID` top-level `IGD`) — xem missing-evidence.md.
- **WLAN Global Configuration › 2.4GHz** (`wlan_wlanbasicadconf_lua.lua`):
  Apply giữ nguyên. Response dạng MỚI `day_du_gioi_han` — chỉ echo
  `OBJ_WLANMLO_ID` (không phải object của chính dataTag) — xem
  missing-evidence.md.
- Cả 2 lần thử ĐẦU đều lỗi `-1452` (token cũ) — tải lại `/`, thử lại
  thành công.
- **`wlanBasic` lên mức 4** (2 dataTag đã test, còn 5GHz/6GHz/SSID
  Configuration trên cùng trang chưa test riêng). Ngày chụp: 2026-08-05.

## wlan_macfilteraclpolicy_lua.lua (WLAN Advanced > Access Control-Mode Configuration)
- Dang: `xac_nhan_trong`, `instidentity: "tu_truong:_InstID_11"`.
- Da bam Apply that (khong doi gia tri), 12 SSID, tat ca No Filter.
- INSTIDENTITY tra ve = `_InstID_11` (SSID12, truong index CUOI), top-level `_InstID` gui rong.
- Access Control-Rule Configuration: danh sach RONG (New Item), bo qua, con muc 3.

## wlan_wps_lua.lua (WPS > 2.4GHz)
- Dang GHI THU 6 MOI: `day_du_co_instidentity`. `instidentity: "tu_truong:SSID_InstID"`.
- Header: `<INSTIDENTITY>` dau tien, KHONG co `<_InstID>`, nhung CO du lieu object day du.
- OBJ_WPS_ID: object co kien truc rieng — phat 3 khoi `<OBJ_WPS_ID>` rieng biet (khong
  phai 1 khoi voi 3 Instance long nhau). Da them co gio `bocRiengTungInstance` trong
  `state["objects"]["OBJ_WPS_ID"]` va sua `config_store._sinh_khoi_obj()` ho tro dang nay.
- Apply CHI echo 1 instance OBJ_WPS_ID khop INSTIDENTITY (khac GET tra ca 3).
- Da phat lai dung byte-for-byte GET + POST tren sim.

## wlan_BandSteering_lua.lua (WLAN Band Steering)
- Dang: xac_nhan_trong, instidentity mac dinh (echo _InstID). Khong doi gia tri (Off).

## wlan_mlo_model.lua (MLO, dataTag JSON)
- Dung duong ghi JSON co san. Response chi 4 truong loi. Khong doi gia tri (Off).

## Localnet_NetSphere_Mode_lua.lua (Mesh Wi-Fi)
- Dang: xac_nhan_trong, instidentity mac dinh (echo _InstID=MULTIAPDOMAIN1). Off.

## wlan_wlansssidconf_lua.lua (WLAN SSID Configuration, SSID1 2.4GHz)
- Dang: xac_nhan_trong, instidentity: tu_truong:_InstID_PSK.
- SANITIZE: KeyPassphrase/WEPKey00-03 la mat khau WiFi that - da thay placeholder.
- Truong 'encode': ciphertext base64 dai, chua ro khoa giai ma - khong sinh lai.

## Localnet_LanMgrIpv4_DHCPBasicCfg_lua.lua (LAN IPv4 > DHCP Server)
- Dang: day_du_co_instidentity, CHI echo OBJ_Br0AndDhcpsHosCfg_ID (doiTuongGhiRieng).
- Response THAT co <encode>...</encode> nhung sim CO CHU Y KHONG sinh (an toan,
  giong quyet dinh da lap cho GET). 5 truong ma hoa (IPAddr/MinAddress/MaxAddress/
  DNSServer1/2) van muc 3, cac truong khac muc 4.

## Localnet_LanDevDHCPSource_lua.lua (LAN IPv4 > DHCP Port Control)
- Dang: xac_nhan_trong, instidentity: tu_truong:_InstID_11.

## addr6_lanaddr_lua.lua (LAN IPv6 > LAN Address Management)
- Dang: xac_nhan_trong, instidentity mac dinh (echo _InstID).

## dhcp6s_dhcpserver_lua.lua (LAN IPv6 > DHCPv6 Server)
- Dang GHI THU 7 MOI: day_du_co_instidentity_va_instid (INSTIDENTITY + _InstID +
  du lieu day du, chi echo OBJ_DHCP6S_ID). instidentity: tu_truong:_InstID_DNS.

## ra_raservice_lua.lua (LAN IPv6 > RA Service)
- Dang: day_du (mac dinh).

## radhcp6s_portctrl_lua.lua (LAN IPv6 > Port Control)
- dataTag MOI, chua tung mo hinh hoa. Da them OBJ_IPV6BANPORT_ID (12 instance) tu
  bang chung GET that. Dang GHI: xac_nhan_trong, instidentity: tu_truong:_InstID_11.

## Localnet_ftp_lua.lua (Local Network > FTP)
- Dang: xac_nhan_trong, instidentity mac dinh (echo _InstID=IGD.FTPUSER0).
- SANITIZE: Password/encode la mat khau FTP that (ma hoa client-side) - da thay
  placeholder. Response GHI khong echo du lieu nen khong bi anh huong boi van
  de <encode> (khac DHCPBasicCfg/SSID Config).

## upnp_upnp_lua.lua (Local Network > UPnP)
- Dang: rut_gon (mau 2, giong EnergyMode) - header ID,TYPE,STR,PARAM + the
  _InstID, khong echo du lieu object. Port Mapping la danh sach chi doc.

## bpdu_lua.lua (Local Network > BPDU)
- Dang: xac_nhan_trong, instidentity mac dinh (echo _InstID=IGD).

## dms_dms_lua.lua (Local Network > DMS/DLNA)
- Dang: xac_nhan_trong, instidentity mac dinh (echo _InstID=IGD).

## Samba_lua.lua (Local Network > Samba Service)
- Dang: xac_nhan_trong, instidentity: rong (LUON RONG, du co _InstID top-level
  VA _InstID_0 — khac pattern "echo truong index cuoi" cua cac dataTag
  nhieu-instance khac). Bang chung that DAU TIEN cho gia tri "rong".
- SANITIZE: PassWord_0/PassWord/encode la mat khau Samba that - da thay
  placeholder.

## dns_localdns_lua.lua (Local Network > DNS — Domain Name + DNS server)
- Dang: xac_nhan_trong, instidentity mac dinh (echo _InstID=IGD).
- Mot dataTag, 2 form con gui rieng: "Domain Name" (truong DomainName) va
  "DNS" (SerIPAddress1/2 + SerIPv6Address1/2). Ca hai da xac nhan Apply that.
- Host Name (danh sach rieng, cung trang) la danh sach rong (New Item),
  khong test duoc — muc 3 rieng phan do, ca route dns giu "mot_phan".

## usb_usbfunccfg_lua.lua (Local Network > USB)
- Dang: xac_nhan_trong, instidentity mac dinh (echo _InstID=IGD).

## voip_voipbasic_lua.lua (VoIP > VoIP Services)
- Dang: xac_nhan_trong, instidentity: tu_truong:_InstIDVP.
- SANITIZE: AuthPassword/encode (rong, ma hoa client-side).

## Voip_SipIf_lua.lua (VoIP > Network Interface)
- Dang: rut_gon (mau 2).

## voip_sipadvanced_lua.lua (VoIP > Advanced > VP1)
- Dang: xac_nhan_trong, instidentity mac dinh.

## voip_voiceproc_lua.lua (VoIP > Advanced > Echo Cancellation)
- Dang: rut_gon (mau 2).

## voip_voipsip_lua.lua (VoIP > SIP Protocol > VP1)
- Dang: xac_nhan_trong, instidentity: tu_truong:_InstIDBEARINFO.

## Voip_sipdigitmap_lua.lua (VoIP > Digital Map)
- Dang: xac_nhan_trong, instidentity mac dinh.

## voip_sipmedia_lua.lua (VoIP > Media)
- Dang: xac_nhan_trong, instidentity: tu_truong:_InstID_G722 (truong DAU
  TIEN trong danh sach _InstID_<codec>, khac mau "echo truong cuoi").

## voip_sipslc_lua.lua (VoIP > SLIC configuration)
- Dang: rut_gon (mau 2).

## voip_cid_sip_lua.lua (VoIP > Caller ID)
- Dang: xac_nhan_trong, instidentity: tu_truong:_InstID_CIDSIP.

## voip_fax_lua.lua (VoIP > FAX)
- Dang: xac_nhan_trong, instidentity mac dinh.

## Voip_Voip_QoS_lua.lua (VoIP > QoS > QOS of Signal)
- Dang: xac_nhan_trong, instidentity mac dinh.

## Voip_Voip_QoS_Media_lua.lua (VoIP > QoS > QOS of Media)
- Dang: xac_nhan_trong, instidentity mac dinh.

## log_syslogmgr2_lua.lua (Management & Diagnosis > Log Management)
- Dang MOI: day_du_co_instidentity, KHONG co truong _InstID nao trong request
  (INSTIDENTITY luon rong tu nhien). Object OBJ_LOG_ID CHI echo 1 truong
  (logStr) o dang <ParaName>/<ParaValue> — dung truongGhiRieng moi trong
  config_store.py de gioi han truong rieng cho Apply (khac paraOrder GET).

## loopback_basic_lua.lua (Management & Diagnosis > Diagnosis > Loopback Detection > Basic Configuration)
- Dang: xac_nhan_trong, instidentity mac dinh.

## loopback_enable_lua.lua (Management & Diagnosis > Diagnosis > Loopback Detection > Switch Control)
- Dang: xac_nhan_trong, instidentity: tu_truong:_InstID_3 (echo truong index cuoi trong 4 bo LAN).

## (BO QUA CO CHU DINH — xem missing-evidence.md)
- rebootAndReset, firmwareUpgr, usrCfgMgr, accountMgr, Ethconfig: hanh dong
  nguy hiem tren thiet bi that dang hoat dong, khong bam theo quyet dinh anh
  Huynn.
- IPv6SwitchMgr: client-side chan resubmit gia tri khong doi, can doi that
  moi kich hoat duoc Apply — bo qua de an toan.
- networkDiag: cong cu PING/TRACEROUTE chu dong, khong ghi config store.
- mirror: Destination rong, Apply bi chan client-side (truong bat buoc).

## Ra soat 2026-08-05 — golden-replay 56 file bang chung Apply (sau chien dich)

Chay lai TOAN BO 56 file *-apply.that.post.json qua sim (dang nhap that,
so sanh theo tap hop the+gia tri, khong phan biet thu tu the anh em —
xem chinh sach trong config_store.py docstring ve IGMP/rut_gon). Ket qua:
OK 51/56 (49 khop byte-for-byte, 2 chi khac thu tu the — IgmpWLANCONF,
WlanMLO, van la OK), 5 mismatch.

**2 loi that phat hien va sua trong lan ra soat nay:**
- `rip_lua.lua`: thieu `instidentity: "rong"` — da them (bang chung:
  RIP-apply.that.post.json, INSTIDENTITY rong du gui _InstID=IGD).
- `wlan_wps_lua.lua`: nhanh `bocRiengTungInstance` trong config_store.py
  echo CA HAI instance trung `_InstID` (dung cho GET) nhung Apply that
  (WPS-WlanWps5G-apply.that.post.json) chi echo 1 — da sua cat `[:1]`,
  CHI anh huong nhanh Apply/GHI.

**3 mismatch con lai — da xac minh KHONG phai loi** (chi tiet xem
STATUS.md muc "RA SOAT TOAN BO"): LanMgrIpv4-DHCPBasicCfg (encode khong
tai tao — chinh sach cu), LoopbackDetectBasic + MirroManag x2 (bang chung
CU chup canh loi/FAIL, khong dung lam doi chieu voi Apply thanh cong),
LanMgrIpv6-PortControl (file bang chung thieu truong reqBody — lo hong
cua phep doi chieu, khong phai loi cau hinh).
