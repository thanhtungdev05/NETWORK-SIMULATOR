# Hướng dẫn chụp bằng chứng BE12000 (Giai đoạn 1)

> Người thực hiện: anh Huy (cần thiết bị BE12000 thật)
> Trình duyệt: **Google Chrome** trên máy tính
> Địa chỉ thiết bị: **http://192.168.1.1**
> Thiết bị: ZTE **F8728D**, chuỗi firmware đọc được: `F8728D V3.0.12P2N2`
>
> **Nguyên tắc số 1:** thà thiếu còn hơn sai. Bước nào không làm được thì ghi vào
> `spec/missing-evidence.md`, đừng bỏ qua im lặng.

---

## 0. Kiến trúc thiết bị — đọc trước, quyết định cách chụp

Đã kiểm trực tiếp ngày 2026-08-03. BE12000 **không giống** router kiểu cũ:

- **Không có file `.htm` riêng cho từng trang.** Mọi thứ đi qua một URL duy nhất là `/`.
- Mở một trang = `GET /?_type=menuView&_tag=<tên_trang>&Menu3Location=<n>`
  → trả về **mảnh HTML** của trang đó.
- Nạp dữ liệu = `GET /?_type=menuData&_tag=<tên_nguồn>.lua`
- Còn hai loại nữa đã thấy trong mã nguồn: `_type=loginData`, `_type=hiddenData`.
- Thư viện phía trình duyệt: `/jquery/jquery.min.js`, `/jquery/crypto-js.min.js`,
  `/jquery/jsencrypt.min.js`, `/jquery/common_lib.js`.

**Hệ quả quan trọng:** thao tác "chuột phải → Save as" từng trang **không dùng được** ở đây.
Bằng chứng gốc của từng trang nằm trong **response của các request `_type=menuView`** — tức là
**file HAR chính là nguồn bằng chứng chủ đạo**, không phải file HTML rời.
Vì vậy bước "xuất HAR **with content**" ở mục 3 là bước sống còn, không được làm tắt.

---

## 1. Chuẩn bị (làm một lần)

1. Nối máy tính vào LAN của BE12000. Không VPN, không proxy — sẽ làm bẩn HAR.
2. Mở Chrome, dùng **cửa sổ ẩn danh** (Ctrl+Shift+N) hoặc profile Chrome riêng, tắt hết extension.
3. Tạo sẵn 4 thư mục tạm: `har/`, `source/`, `shot-desktop/`, `shot-mobile/`.
4. Mở `http://192.168.1.1`, xác nhận vào được.

---

## 2. Chụp luồng ĐĂNG NHẬP (làm đầu tiên, quan trọng nhất)

Hiện chưa có bằng chứng nào về luồng này.

1. Nếu đang đăng nhập → bấm **Logout**.
2. F12 → tab **Network** → tick **Preserve log** và **Disable cache** → bấm Clear 🚫.
3. Đăng nhập bằng tài khoản admin.
4. Xuất HAR ngay → **`login.har`**.
5. Nhìn vào request `_type=loginData` và trả lời 3 câu (ghi vào ghi chú, gửi kèm):
   - tham số gửi đi tên là gì?
   - mật khẩu gửi dạng thô hay đã mã hoá? (thiết bị có nạp `crypto-js` và `jsencrypt`
     → **nghi ngờ** có mã hoá phía trình duyệt, cần xác minh chứ không được kết luận sẵn)
   - sau đăng nhập, phiên được giữ bằng cookie tên gì, hay bằng token đặt ở đâu?

> ⚠️ **Auto Logout.** Mỗi đợt chụp không quá ~10 phút. Hết một khu vực thì xuất HAR,
> đăng nhập lại, rồi mới sang khu vực kế. HAR toàn `302` = phiên đã chết, phải chụp lại.

---

## 3. Thiết lập DevTools + cách xuất HAR

Tab **Network**:

| Mục | Trạng thái | Vì sao |
|-----|-----------|--------|
| **Preserve log** | ✅ BẬT | giữ request khi trang đổi nội dung |
| **Disable cache** | ✅ BẬT | ép tải lại JS/CSS gốc |
| Filter | để **trống**, chọn **All** | lọc là mất bằng chứng |
| Throttling | No throttling | |

Xuất HAR:

1. Chuột phải vào danh sách request → **Save all as HAR with content**.
   ❗ Phải là bản **with content**. Bản thường không kèm response — mà response
   chính là HTML của trang. Thiếu content = file HAR vô dụng với dự án này.
2. Lưu vào `har/`, tên theo khu vực, chữ thường không dấu: `internet.har`, `localnet.har`...
3. **Kiểm ngay tại chỗ:**
   - Có `302` không? → phiên hỏng, đăng nhập lại, chụp lại.
   - Có thấy các dòng `?_type=menuView&_tag=...` của đúng những trang vừa bấm không?
   - Toàn `304 Not Modified` → chưa bật Disable cache, làm lại.

---

## 4. Lấy source gốc (phần không nằm trong HAR)

HAR đã chứa HTML của từng trang. Ngoài ra cần lấy rời 5 file khung:

1. DevTools → tab **Sources** → mở cây `192.168.1.1`.
2. Lưu các file sau vào `source/`, **giữ nguyên đường dẫn**:
   - trang gốc `/` (khoảng 258 KB) → lưu thành `source/index.html`
   - `source/jquery/jquery.min.js`
   - `source/jquery/crypto-js.min.js`
   - `source/jquery/jsencrypt.min.js`
   - `source/jquery/common_lib.js`  ← **file quan trọng nhất**, chứa toàn bộ logic điều hướng
3. Cách khác cho trang gốc: mở `view-source:http://192.168.1.1/` → Ctrl+A → Ctrl+C → dán vào file.

**KHÔNG dùng:** ❌ Ctrl+S / *Save page as* ❌ extension SingleFile ❌ copy từ tab **Elements**.
Ba cách đó cho ra **DOM sau khi JS đã chạy**, không phải mã gốc — đúng lỗi đã mắc ở dự án trước.

---

## 5. Chụp ảnh màn hình 2 khổ

### 5.1. Desktop 1920×1080

1. DevTools → Ctrl+Shift+M (**Device Toolbar**) → **Responsive** → gõ tay `1920` × `1080`.
2. Ctrl+Shift+P → gõ `screenshot` → **Capture full size screenshot**.
3. Lưu `shot-desktop/<viewTag>.png` — **tên file là `viewTag`**, ví dụ `wlanBasic.png`,
   `portForwarding.png`. Danh sách viewTag đầy đủ có trong `spec/route-inventory.json`.

### 5.2. Mobile 390×844

1. Device Toolbar → **iPhone 12 Pro** (đúng 390×844) hoặc gõ tay `390` × `844`.
2. **F5 sau khi đổi khổ** — bắt buộc. Giao diện có thể khác hẳn tuỳ kích thước / User-Agent.
3. Ghi nhận: có giao diện mobile riêng (hamburger, layout khác) hay chỉ là desktop thu nhỏ?
   Đây là câu hỏi còn để ngỏ trong `missing-evidence.md`, rất cần câu trả lời.
4. Chụp full size → `shot-mobile/<viewTag>.png`, cùng tên với ảnh desktop.
5. Nếu ở khổ mobile trang gọi thêm request khác → xuất HAR riêng `<khu-vuc>-mobile.har`.

---

## 6. Quy trình chụp MỘT khu vực

Ví dụ khu vực **Internet**:

1. Đăng nhập lại (dù đang thấy vẫn đăng nhập — cho chắc).
2. Network → Preserve log ✅ → Disable cache ✅ → Clear 🚫.
3. Bấm menu cấp 1 **Internet**.
4. Bấm **hết** menu cấp 2 (Status, WAN, Security, ...).
5. Trong mỗi mục cấp 2, bấm **hết** tab cấp 3 (dải tab ngang phía trên).
   Ví dụ Internet > Security có 7 tab: Firewall, Filter Criteria, Local Service Control,
   ALG, DMZ, Port Forwarding, Port Trigger. Bấm thiếu một tab là thiếu một route.
6. Bấm **hết** nút mở dialog/popup (Add, Edit, Detail...). Mỗi dialog chụp ảnh riêng,
   đặt tên `<viewTag>__dialog_<tên_nút>.png`.
7. **Không bấm Apply/Save** ở lượt này — lượt này chỉ đọc.
8. Xuất HAR → `har/internet.har`. Kiểm `302` như mục 3.
9. Chụp ảnh desktop rồi mobile cho từng tab (mục 5).

### Lượt 2 — chụp hành vi GHI (làm sau, trên thiết bị lab)

Không có bước này thì **không route nào lên được mức 4**.

1. Đăng nhập lại, Clear log.
2. Vào một trang, đổi **đúng một giá trị**, bấm **Apply/Save**.
3. Xuất HAR → `har/internet-apply.har`.
4. Ghi rõ: trang nào, trường nào, từ giá trị gì sang giá trị gì. Thiếu ghi chú này thì HAR khó đọc.
5. Trả lại giá trị cũ.

⚠️ Làm trên thiết bị lab, **không** làm trên thiết bị đang phục vụ khách.

---

## 7. Danh sách khu vực cần chụp

Cây menu đã quét xong ngày 2026-08-03 trực tiếp trên thiết bị thật:
**6 nhóm cấp 1 → 45 mục cấp 2 → tổng 77 route**. Chi tiết ở `spec/menu-tree.json`.

| # | Khu vực (menu cấp 1) | Số route | File HAR | HAR | Ảnh desktop | Ảnh mobile |
|---|----------------------|----------|----------|-----|-------------|------------|
| 0 | (đăng nhập)          | —        | `login.har`     | ☐ | — | — |
| 1 | Home                 | 1        | `home.har`      | ☐ | ☐ | ☐ |
| 2 | Topology             | 1        | `topology.har`  | ☐ | ☐ | ☐ |
| 3 | Internet             | 30       | `internet.har`  | ☐ | ☐ | ☐ |
| 4 | Local Network        | 19       | `localnet.har`  | ☐ | ☐ | ☐ |
| 5 | VoIP                 | 12       | `voip.har`      | ☐ | ☐ | ☐ |
| 6 | Management & Diagnosis | 14     | `mgmt.har`      | ☐ | ☐ | ☐ |
| 7 | (source gốc, mục 4)  | —        | —               | ☐ | — | — |

Ba khu vực có nhiều tab cấp 3 nhất, chụp kỹ:

- **Internet > Status** — 6 tab: PON Inform, WAN, 3G/4G, DSLite, L2TP, NAT entries/conntracks
- **Internet > Security** — 7 tab: Firewall, Filter Criteria, Local Service Control, ALG, DMZ, Port Forwarding, Port Trigger
- **Local Network > WLAN** — 7 tab: WLAN Basic, WLAN Advanced, WPS, Surrounding WiFi, WLAN Band Steering, MLO, Mesh Wi-Fi

Gợi ý thứ tự: bắt đầu bằng **Local Network** (WLAN + LAN là phần nhân viên mới dùng nhiều nhất),
rồi **Internet**, rồi phần còn lại.

---

## 8. Tự kiểm sau mỗi khu vực

- [ ] HAR xuất bằng **Save all as HAR with content**?
- [ ] Trong HAR **không** có loạt `302`?
- [ ] Đã bấm hết mục cấp 2, hết **tab cấp 3**, hết dialog?
- [ ] Số dòng `_type=menuView` trong HAR ≥ số route của khu vực đó (bảng mục 7)?
- [ ] Có ảnh **desktop 1920** cho mọi route?
- [ ] Có ảnh **mobile 390** cho mọi route, và đã **F5 sau khi đổi khổ**?
- [ ] Tên file ảnh đúng bằng `viewTag`, không dấu, không khoảng trắng?
- [ ] Chỗ nào không chụp được đã ghi vào `spec/missing-evidence.md`?

Còn ô chưa tick → khu vực đó **chưa xong**.

---

## 9. Chép file về dự án

```
devices/be12000/reference/
├── har/                  ← login.har, internet.har, internet-apply.har, ...
├── source/               ← index.html + jquery/*.js (mục 4)
└── screenshot/
    ├── desktop/          ← <viewTag>.png @1920
    └── mobile/           ← <viewTag>.png @390
```

Quy ước đặt tên:

- HAR: theo **khu vực** — `internet.har`, `internet-apply.har`, `internet-mobile.har`
- source: theo **đúng đường dẫn trên thiết bị** — `index.html`, `jquery/common_lib.js`
- ảnh: theo **viewTag** — `wlanBasic.png`, `wlanBasic__dialog_add.png`

Chép xong thì báo, kèm 3 câu trả lời ở mục 2. Tôi sẽ nâng các route lên mức 1 và bắt đầu Giai đoạn 2.

---

## 10. Những điều TUYỆT ĐỐI KHÔNG làm

- ❌ Không sửa, đổi tên, "dọn dẹp" file trong `reference/` — đó là bằng chứng gốc.
- ❌ Không chỉnh sửa file HAR bằng tay.
- ❌ Không xuất HAR bản thường (thiếu content) — với thiết bị này là mất sạch HTML trang.
- ❌ Không gộp mọi khu vực vào một HAR khổng lồ.
- ❌ Không thay ảnh thiết bị thật bằng ảnh bản giả lập.
- ❌ Không dùng bằng chứng của thiết bị khác, kể cả khi trông "giống hệt".
