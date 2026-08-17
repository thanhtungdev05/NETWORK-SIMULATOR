# Bảng chụp HAR bổ sung — Vigor2927

Lập ngày 2026-08-02. Đây là **toàn bộ** chỗ còn thiếu bằng chứng, gộp một lần
để anh Huynn chụp trong ít lượt nhất.

Sau khi chụp xong, đưa file `.har` vào `reference/har/` rồi chạy:

```
python tools/extract_har.py devices/vigor2927
python tools/verify_page.py devices/vigor2927 --tat-ca
```

---

## Cách ghi HAR (làm giống nhau cho mọi đợt)

1. Mở Chrome, vào `https://192.168.1.1`, đăng nhập.
2. F12 → tab **Network** → bật **Preserve log** (quan trọng, vì DrayTek hay chuyển trang).
3. Thao tác theo bảng bên dưới.
4. Chuột phải trong danh sách request → **Save all as HAR with content**.
   Phải là bản **with content**, bản thường không có nội dung response.
5. Đặt tên theo đợt: `Buoi_5_form_apply.har`, `Buoi_6_export.har`, ...

---

## MỨC RỦI RO — đọc trước khi bấm

Nhiều endpoint dưới đây chỉ xuất hiện khi bấm **Apply / OK**, tức là **ghi thật vào
thiết bị**. Nguyên tắc an toàn:

- **KHÔNG đổi giá trị nào** trước khi bấm Apply. Mở trang, bấm luôn — thiết bị vẫn
  ghi lại đúng giá trị đang có, response vẫn đúng hợp đồng, mà cấu hình không đổi.
- Ba mục dưới đây tôi **khuyên bỏ qua**, rủi ro cao hơn giá trị thu được:

| Endpoint | Trang | Vì sao rủi ro |
|---|---|---|
| `chglog.cgi` | System Maintenance >> Administrator Password | đổi/ghi lại mật khẩu quản trị — sai một bước là mất quyền vào thiết bị |
| `chgbas2.cgi` | System Maintenance >> User Password | tương tự, mật khẩu người dùng |
| `gCertRst.cgi` | Certificate Backup (Restore) | ghi đè toàn bộ chứng chỉ đang có |

Nếu bỏ qua, ba trang này vẫn dùng tốt để dạy học, chỉ là nút Apply chưa có hợp đồng
response. Tôi sẽ ghi rõ trong `ISSUES.md` là **cố ý bỏ**, không phải sót.

---

## ĐỢT A — nút Apply/OK trên trang (3 mục an toàn)

Mở trang, **không sửa gì**, bấm nút OK/Apply.

| # | Trang | Menu | Endpoint |
|---|---|---|---|
| A1 | Management | System Maintenance >> Management | `/cgi-bin/acontrol.cgi` |
| A2 | SNMP | System Maintenance >> SNMP | `/cgi-bin/snmp.cgi` |
| A3 | Filter Setup | Firewall >> Filter Setup | `/cgi-bin/ipfset.cgi` |

---

## ĐỢT B — xuất / nhập file cấu hình (8 mục) — ĐÃ BỎ QUA (2026-08-08)

**Anh Huynn quyết định bỏ tính năng Backup/Restore firmware/file cấu hình.**
Cả 8 mục dưới đây thuộc loại này nên KHÔNG cần chụp nữa. Giữ lại bảng để tham
khảo nếu sau này đổi ý.

**SỬA NGÀY 2026-08-08 — bảng cũ ghi SAI tên nút.** Đã kiểm lại `reference/source/`:
tên nút thật trên thiết bị là **"Backup"** (tải cấu hình xuống — chỉ đọc, an toàn
tuyệt đối) và **"Restore"** (tải file lên). KHÔNG có nút tên "Export"/"Import" trên
các trang này — đó là tên tôi đoán sai, không phải tên thật.

- Nút **Backup**: bấm là tải file `.bak` về ngay, không cần chọn gì. Ghi được request an toàn.
- Nút **Restore**: bấm mở hộp chọn file. Chọn BẤT KỲ file nào trên máy (không cần đúng định
  dạng) rồi bấm nút Restore/OK trong khung đó — ghi được request multipart. Nếu thiết bị báo lỗi
  "file không hợp lệ" sau đó thì KỆ, không bấm gì thêm — request đã gửi đi là đủ, không cần
  thành công. Không tick "Enable" hay đổi giá trị nào trước khi bấm.

| # | Trang | Menu | Endpoint | Nút bấm |
|---|---|---|---|---|
| B1 | Port Redirection | NAT >> Port Redirection | `/port_redirection<ngày>.bak` | **Backup** |
| B2 | Open Ports | NAT >> Open Ports | `/open_port<ngày>.bak` | **Backup** |
| B3 | Static Route | Routing >> Static Route | `/v4_staticroute<ngày>.bak` | **Backup** |
| B4 | Bind IP to MAC | LAN >> Bind IP to MAC | `/upload_ipbind.cgi` | **Restore** (chọn file bất kỳ) |
| B5 | LAN to LAN | VPN and Remote Access >> LAN to LAN | `/lan2lanupload.cgi` | **Restore** |
| B6 | Remote Dial-in User | VPN and Remote Access >> Remote Dial-in User | `/dialinupload.cgi` | **Restore** |
| B7 | Hotspot Profile Setup | Hotspot Web Portal >> Profile Setup | `/upload_hotspot.cgi` | **Backup** |
| B8 | Objects Backup/Restore | Objects Setting >> Objects Backup/Restore | `/cgi-bin/ipobj.cgi` | chọn "Select All" rồi bấm nút **Backup** dưới bảng |

---

## ĐỢT C — dữ liệu sống qua AJAX (22 endpoint)

**Chỉ cần MỞ trang rồi đợi 5–10 giây**, không bấm gì. Các endpoint này trang tự gọi
để lấy dữ liệu. Đây là đợt dễ nhất và thu được nhiều nhất.

Mở lần lượt các trang sau, mỗi trang đợi 5–10 giây:

| # | Menu | Endpoint trang tự gọi |
|---|---|---|
| C1 | Online Status >> Physical Connection | `online1.cgi`, `online2.cgi`, `goinet.cgi` |
| C2 | USB Application >> File Explorer | `usbwebget.cgi`, `usbwebset.cgi`, `folderdelstop.cgi` |
| C3 | Dashboard | `/cgi/set.cgi`, `/cgi/get.cgi`, `login.cgi` |
| C4 | External Devices | `/cgi/get.cgi`, `login.cgi` |
| C5 | AP >> AP Maintenance | `/cgi/set.cgi` |
| C6 | AP >> Status | ảnh `/images/lock.png` (xem đợt E) |
| C7 | AP >> Event Log | `apmaplog.cgi` |
| C8 | Switch >> Status, Switch >> Profile | `swmgetstasusmac.cgi`, `/cgi/get.cgi` |
| C9 | System Maintenance >> Management | `wloginauth.cgi` |
| C10 | Applications >> RADIUS/TACACS+ | `radiuslog.cgi` |
| C11 | VPN and Remote Access >> VPN Matcher Setup | `cloudvpnstuntest.cgi` |
| C12 | VPN >> VPN Management / CPE Management / Log & Alert | `cvm.cgi` |
| C13 | Diagnostics >> Route Policy Diagnosis | `diagrestore2.cgi` |
| C14 | Hotspot Web Portal >> PIN Generator | `hsusbstatus.cgi` |
| C15 | Hardware Acceleration | `bridgefull.cgi` |
| C16 | System Maintenance >> Panel Control | `ledwakeup.cgi` — cần **bật/tắt một nút LED** |
| C17 | System Maintenance >> SysLog / Mail Alert | `syslogIPupdate.cgi` — cần bấm Apply |
| C18 | VPN and Remote Access >> Connection Management | `vpnstatus.cgi` |

---

## ĐỢT D — trang con và hộp thoại (12 mục)

Bấm nút trong trang để mở trang con. Chỉ **mở rồi đóng**, không lưu gì.

| # | Trang cha | Nút bấm | Trang con |
|---|---|---|---|
| D1 | System Maintenance >> Self-Signed Certificate | Regenerate | `XSelfG.HTM` |
| D2 | Applications >> Schedule | (link trong trang) | `schedule.sht` |
| D3 | Certificate >> Local Certificate | View | `V2X00.cgi?fid=221&certidx=N` |
| D4 | Certificate >> Local Certificate | Import | `XLoCaImport.htm` |
| D5 | Certificate >> Local Certificate | (dialog) | `XLoCfMn.htm` |
| D6 | Certificate >> Trusted CA | View | `V2X00.cgi?fid=334&certidx=N` |
| D7 | Certificate >> Trusted CA | Root View | `V2X00.cgi?fid=333&certidx=N` |
| D8 | Certificate >> Trusted CA | Import | `XCaImport.htm` |
| D9 | Certificate >> Trusted CA | Root Download | `XCaCfExport.htm` |
| D10 | Certificate >> Trusted CA | (dialog) | `XCaCfMn.HTM` |

---

## ĐỢT E — hai file ảnh còn thiếu (2 mục)

Không cần HAR. Mở thẳng hai URL này trong Chrome rồi **lưu ảnh về**, gửi tôi:

```
https://192.168.1.1/images/lock.png
https://192.168.1.1/images/nunknown.gif
```

Hai ảnh này thiết bị có nhưng chưa lần nào lọt vào HAR:
`lock.png` dùng ở AP >> Status, `nunknown.gif` dùng ở USB File Explorer.

---

## Tổng kết

| Đợt | Số mục | Rủi ro | Ưu tiên |
|---|---|---|---|
| C — AJAX (chỉ mở trang) | 22 | không | **làm trước** |
| E — hai file ảnh | 2 | không | **làm trước** |
| B — Backup/Restore | 8 | — | **ĐÃ BỎ (2026-08-08)**, không làm |
| D — trang con/hộp thoại | 10 | thấp | làm sau |
| A — nút Apply | 3 | trung bình | làm sau, không sửa giá trị |
| (bỏ qua) 3 mục mật khẩu / restore chứng chỉ | 3 | **cao** | không làm |

Làm xong đợt C + E là giải quyết được **phần lớn** trong 22 điểm lệch T4 hiện tại.
