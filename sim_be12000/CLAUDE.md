# CLAUDE.md — Giả lập thiết bị BE12000

> Đặt tại: `devices/be12000/CLAUDE.md`
> Cập nhật: 2026-08-03 — viết lại sau khi khảo sát trực tiếp thiết bị thật.
> Đọc TOÀN BỘ file này trước khi làm bất cứ việc gì trong thư mục `devices/be12000/`.

---

## 0. MỤC ĐÍCH — đọc kỹ, vì nó quyết định mọi thứ phía sau

Sản phẩm là **giao diện web cấu hình BE12000 chạy trên trình duyệt**, giống thiết bị thật
đến mức nhân viên mới thao tác trên bản giả lập rồi ra hiện trường không phải học lại.

Nhưng đích cuối không dừng ở dạy học. Bản này là **nền móng để ảo hóa thiết bị** —
gắn giao diện vào một tiến trình xử lý đóng vai firmware, để sau này cắm được vào
sơ đồ mạng ảo kiểu **GNS3 / EVE-NG**: nhiều thiết bị ảo chạy song song, mỗi cái có
cấu hình riêng, lưu lại được, khôi phục được.

Hai hệ quả trực tiếp:

1. **Trung thực về cấu trúc quan trọng hơn trung thực về hình ảnh.** Trông giống mà sai
   đường dẫn, sai tham số, sai tên biến thì vô dụng cho giai đoạn ảo hóa — sẽ phải làm lại.
2. **Trạng thái phải là thật.** Bấm Apply ở trang này thì trang khác phải đổi theo, và
   trạng thái đó phải nằm ngoài mã nguồn, trong một file lưu được. Không có kho trạng thái
   thì đây chỉ là ảnh chụp, không phải thiết bị ảo.

---

## 1. BA NGUYÊN TẮC TỐI THƯỢNG

### NT-1: KHÔNG TỰ SUY LUẬN

Mọi trang, mọi trường, mọi nhãn, mọi giá trị mặc định **phải truy được về một file bằng chứng**
trong `reference/`.

- Chưa có bằng chứng → **DỪNG, ghi vào `spec/missing-evidence.md`, hỏi anh Huy.**
- **TUYỆT ĐỐI KHÔNG** bịa nội dung, không "đoán cho hợp lý".
- **TUYỆT ĐỐI KHÔNG** lấy từ thiết bị khác trong dự án. Kể cả `sim_be15000` (ZTE H6701Q V3) —
  tuy **cùng họ giao diện** với BE12000 và trùng nhiều tên tag (`localNetStatus`, `wlanAdvanced`,
  `wps`, `accountMgr`...), nó vẫn là **firmware khác**. Cùng họ giao diện không có nghĩa
  cùng danh sách trường, cùng option, cùng giá trị mặc định. Copy sang là vi phạm NT-1.
- Câu tự kiểm trước mỗi trang: *"Tôi đang nhìn vào file bằng chứng nào?"*
  Không trả lời được bằng một tên file cụ thể → không được dựng.

### NT-2: QUÉT ĐẾN TẬN CÙNG

- Mọi mục menu cấp 1, cấp 2, **mọi tab cấp 3**, mọi dialog/popup mở bằng nút bấm.
- Mọi trạng thái của trang: rỗng / có dữ liệu / lỗi / đang tải.
- Mục bị ẩn do cờ firmware → vẫn **ghi nhận vào `route-inventory.json`** với `hidden: true`,
  không im lặng bỏ qua.

### NT-3: GIỐNG THẬT Ở MỌI KHỔ MÀN HÌNH

Người dùng vào thiết bị bằng máy tính hay điện thoại đều phải thấy giống thật.

- Thiết bị thật **có giao diện thu gọn riêng** — đã xác minh 2026-08-03: khi cửa sổ hẹp,
  thanh menu ngang biến mất, dồn vào **nút hamburger ☰** ở góc trên bên phải
  (phần tử `.more-menu-icon`, `#menu-container`, `#menu-close`, `#menu-results`).
  Phải tái hiện đúng, **không** tự viết CSS "responsive cho đẹp".

- **Kiểm quanh ĐIỂM NGẮT THẬT, không phải hai con số tự chọn.**
  Quét `@media` trong mã gốc ngày 2026-08-03 tìm được đúng ba điểm ngắt:

  | Điểm ngắt | Số lần xuất hiện |
  |---|---|
  | `max-width: 960px` | 2 |
  | `max-width: 1020px` | 3 |
  | `max-width: 1100px` | 2 |

  Chọn hai con số cố định (kiểu 1920 và 390) sẽ **bỏ lọt** cả ba ngưỡng này.

- **Bộ khổ chuẩn phải kiểm** — 7 khổ, sát hai bên mỗi điểm ngắt:

  | Khổ | Vì sao |
  |---|---|
  | 1400 | rộng, trên mọi điểm ngắt |
  | 1101 | ngay **trên** ngưỡng 1100 |
  | 1100 | ngay **tại** ngưỡng 1100 |
  | 1021 | ngay **trên** ngưỡng 1020 |
  | 1020 | ngay **tại** ngưỡng 1020 |
  | 961 / 960 | hai bên ngưỡng 960 |
  | 390 | điện thoại |

- Điều kiện bắt buộc khi so: **hai bên cùng chiều rộng**. Chiều cao chênh không sao
  (đã kiểm: 695 với 639 vẫn cho 0 lệch toạ độ, vì bố cục không phụ thuộc chiều cao).

- Con số **1920 không bắt buộc**. Máy kiểm hiện tại có màn hình logic 1536×864
  (DPR 1.25) nên không đạt 1920 CSS pixel bằng cửa sổ thường. Điều quyết định tính
  đúng đắn là hai bên cùng điều kiện và phủ hết điểm ngắt, không phải con số cụ thể.

- Route chưa kiểm đủ bộ khổ = route **chưa hoàn thành**.
- **Cách kiểm là so DOM bằng script, không so ảnh bằng mắt** — xem mục 4.1.

---

## 2. KIẾN TRÚC THIẾT BỊ THẬT — đã xác minh trực tiếp

Khảo sát tại `http://192.168.1.1` ngày 2026-08-03 (duyệt menu, ghi lại URL thật trình duyệt gọi).

- **Phần cứng:** ZTE **F8728D**. Chuỗi firmware đọc từ DOM: `F8728D V3.0.12P2N2`.
  *(Còn một điểm chưa khớp với ảnh chụp — xem `missing-evidence.md`.)*
- **Chân trang:** `©2008-2025 ZTE Corporation. All rights reserved`

### 2.1. Không có file trang riêng

Đây là điểm khác căn bản so với router kiểu cũ. **Không tồn tại** `wan_general.htm`,
`lan_general.asp` hay bất cứ file trang nào. Mọi thứ đi qua một URL duy nhất: `/`.

| Việc | Request thật |
|------|--------------|
| Mở một trang | `GET /?_type=menuView&_tag=<viewTag>&Menu3Location=<n>&_=<ts>` |
| Nạp dữ liệu | `GET /?_type=menuData&_tag=<dataTag>&_=<ts>` |
| Đăng nhập | `_type=loginData` — **chưa có bằng chứng chi tiết** |
| (chưa rõ) | `_type=hiddenData` — thấy trong mã nguồn, chưa rõ công dụng |

`_=<ts>` là timestamp chống cache do jQuery tự thêm, không phải tham số của thiết bị.

### 2.2. Danh tính của một trang là `_tag`, không phải tên file

`wlanBasic`, `portForwarding`, `ponopticalinfo`... Giá trị `_tag` cũng chính là **`id` của
phần tử menu cấp 3** trên DOM (`<p id="wlanBasic" class="AEleMenu3">`). Đây là định danh
duy nhất của route trong toàn dự án: tên file view, tên file ảnh, `id` trong inventory
đều dùng nó.

### 2.3. Khung trang và thư viện

- Trang gốc `/` nặng ~258 KB, chứa toàn bộ khung: header, `#mainNavigator`, `#class2Menu`,
  `#class3Menu`, `#page_content`, các lớp dialog dùng chung (`#blackMask`, `#confirmLayer`...).
- Thư viện phía trình duyệt, **giữ nguyên đường dẫn**:
  - `/jquery/jquery.min.js` (87 KB)
  - `/jquery/crypto-js.min.js` (47 KB)
  - `/jquery/jsencrypt.min.js` (55 KB)
  - `/jquery/common_lib.js` (102 KB) — **chỉ là jQuery Validation Plugin v1.20.1**,
    không phải mã của ZTE. Đừng nhầm tên file với vai trò.
- **Toàn bộ logic điều hướng nằm inline trong `/`** (231 KB, 279 hàm), không nằm ở file rời.
  Các hàm cốt lõi: `dataTransfer()` (bọc `$.ajax`), `AjaxPageGet()`,
  `AjaxQuery_ClassMenuClick()`, `openLink()`, `MenuShow()`.
- Có `crypto-js` + `jsencrypt` → **nghi ngờ** mật khẩu được mã hoá phía trình duyệt.
  CHƯA XÁC MINH. Không được viết code dựa trên giả định này cho tới khi có `login.har`.

### 2.3b. Hợp đồng response — đã xác minh

**Đọc** (`_type=menuData`) trả về **XML**:

```xml
<ajax_response_xml_root>
  <IF_ERRORPARAM>SUCC</IF_ERRORPARAM><IF_ERRORTYPE>SUCC</IF_ERRORTYPE>
  <IF_ERRORSTR>SUCC</IF_ERRORSTR><IF_ERRORID>0</IF_ERRORID>
  <OBJ_ENERGYMODE_ID><Instance>
    <ParaName>PowerMode</ParaName><ParaValue>0</ParaValue>
  </Instance></OBJ_ENERGYMODE_ID>
</ajax_response_xml_root>
```

**Ngữ cảnh trang là bắt buộc.** Gọi `menuData` khi chưa nạp `menuView` của trang chứa nó
→ thiết bị trả `<IF_ERRORSTR>SessionTimeout</IF_ERRORSTR>`, HTTP vẫn 200.
Bản giả lập **phải tái hiện đúng hành vi này**, không được trả dữ liệu vô điều kiện.

**Ghi dùng CHUNG endpoint với đọc** — đã xác minh bằng `reference/har/sntp-apply.har`.
Không có endpoint riêng cho ghi, phân biệt bằng **HTTP method**:

| | Request |
|---|---|
| Đọc | `GET /?_type=menuData&_tag=sntp_lua.lua` |
| Ghi | `POST /?_type=menuData&_tag=sntp_lua.lua` |

Body POST là `application/x-www-form-urlencoded`, header `X-Requested-With: XMLHttpRequest`,
không cookie. Bắt buộc có `IF_ACTION` (giá trị `Apply`), `_InstID` (giá trị `IGD`),
và `_sessionTOKEN`.

Bốn quy tắc gửi trường, **bản giả lập phải làm đúng**:

1. Gửi **toàn bộ** trường của form, không chỉ trường vừa đổi.
2. Trường **ẩn** vẫn gửi, giá trị rỗng.
3. **Cả hai** nút `Btn_apply` và `Btn_cancel` đều gửi, giá trị rỗng.
4. Có trường không hiện trên màn hình nhưng vẫn gửi (`ZoneIndex`, `AutoSetTzname`);
   ô số để trống thì gửi `-1`, không gửi rỗng.

Response ghi là **XML** (không phải JSON như luồng đăng nhập): gốc `<ajax_response_xml_root>`,
thành công khi `IF_ERRORSTR=SUCC` và `IF_ERRORID=0`, **và trả về luôn trạng thái mới**
của đối tượng — client không gọi lại `menuData` sau khi ghi.

Riêng ba entry của khung trang thì response là **JSON** có `need_refresh`:
`logout_entry`, `switchlang_entry`, `modeswitch_entry`.

### 2.4. Cây menu — đã quét xong

6 nhóm cấp 1 → 44 mục cấp 2 → **77 route**. Chi tiết đầy đủ ở `spec/menu-tree.json`.

| Nhóm cấp 1 | id | Số route |
|---|---|---|
| Home | `homePage` | 1 |
| Topology | `mmTopology` | 1 |
| Internet | `internet` | 30 |
| Local Network | `localnet` | 19 |
| VoIP | `voip` | 12 |
| Management & Diagnosis | `mgrAndDiag` | 14 |

---

## 3. KIẾN TRÚC BẢN GIẢ LẬP

### 3.1. Bốn lớp

Chia lớp để lớp trên đổi không kéo theo lớp dưới. Đây là điều kiện để sau này thay
lớp trạng thái bằng firmware thật mà không phải đụng vào giao diện.

| Lớp | Vai trò | Nguyên tắc |
|-----|---------|-----------|
| **1. Trình bày** | HTML/CSS/JS **gốc** của thiết bị | Lấy nguyên, không viết lại, không strip |
| **2. Giao vận** | Phân luồng `_type` / `_tag` tại `/` | URL, tham số, header, mã trạng thái **y hệt thật** |
| **3. Dữ liệu** | Sinh response cho từng `_tag` | Đúng định dạng ghi trong HAR, không tự chế |
| **4. Trạng thái** | `config_store` — đóng vai **NVRAM** | Nguồn sự thật duy nhất, lưu ra file |

Lớp 4 chính là chỗ sau này nối vào tiến trình firmware. Vì vậy **cấm hardcode giá trị
trong lớp 1, 2, 3**. Trang lấy giá trị nào cũng phải đi qua `config_store`.

### 3.2. Ngăn xếp kỹ thuật — đã chốt

- **Python thư viện chuẩn** (`http.server`), không framework, không phụ thuộc ngoài.
  Đây là chuẩn chung của dự án: cả 7 sim hiện có đều dùng Python stdlib.
  Không phụ thuộc ngoài = đóng gói thành image cho GNS3/EVE về sau dễ.
- **Tự chứa trong `devices/be12000/`.** Không tách lõi ra `shared/` khi mới có một thiết bị
  ZTE làm bằng chứng — trừu tượng sớm dễ trừu tượng sai. Khi có thiết bị ZTE thứ hai
  mới xét việc tách.
- **Không đụng 7 sim cũ.** Chúng đang phục vụ dạy học ở mức ảnh chụp tĩnh; để nguyên.
  BE12000 là bản mức 4 đầu tiên, làm khuôn cho về sau.
- **Cổng mặc định `8098`.** Các cổng 8080, 8090–8096, 3000, 2437 đã có thiết bị khác dùng.

### 3.3. Sẵn sàng cho đa thực thể

Không xây bộ quản lý topology bây giờ, nhưng **không được chặn đường** tới đó:

- **Cấm biến toàn cục giữ cấu hình.** Mọi trạng thái nằm trong đối tượng `ConfigStore`
  được truyền vào, không phải module-level dict.
- Server nhận tham số dòng lệnh: `python server.py --port 8098 --state <đường-dẫn-file>`.
  Hai thực thể = hai tiến trình, hai file state, không giẫm chân nhau.
- Toàn bộ trạng thái phải **tuần tự hoá được ra JSON** — để snapshot / khôi phục,
  đúng như GNS3 lưu trạng thái node.

### 3.4. Bố cục `src/`

```
devices/be12000/src/
├── server.py            # điểm vào duy nhất; phân luồng theo _type
├── dispatch.py          # bảng tra: _tag -> hàm xử lý (view / data)
├── config_store.py      # NVRAM ảo: đọc/ghi, validate, lưu ra JSON
├── session.py           # đăng nhập, phiên, auto logout (theo bằng chứng)
├── state/
│   └── factory.json     # cấu hình xuất xưởng — mọi giá trị đều có nguồn từ reference/
├── www/                 # tài nguyên GỐC, giữ nguyên tên và đường dẫn
│   ├── index.html       # trang khung 258 KB lấy từ thiết bị
│   ├── jquery/          # 4 file .js gốc, KHÔNG strip, KHÔNG thay
│   └── img/
└── views/
    └── <viewTag>.html   # mảnh HTML trả cho ?_type=menuView&_tag=<viewTag>
```

### 3.5. Quy tắc đặt tên

- File view: **`views/<viewTag>.html`** — `views/wlanBasic.html`, `views/portForwarding.html`.
- Ảnh bằng chứng: **`<viewTag>.png`**, dialog thì `<viewTag>__dialog_<tên_nút>.png`.
- Tài nguyên trong `www/`: **giữ nguyên đường dẫn thật** (`www/jquery/common_lib.js`,
  không đổi thành `www/js/common.js`).
- **CẤM** kiểu `page_001.html`, `_routes.json`, hay tên do mình nghĩ ra. Tên phải tự nói
  nó là trang gì và phải khớp với thiết bị thật.

### 3.6. Ranh giới được phép sửa

- **Được thêm** code mới (lớp 2, 3, 4).
- **Không được** đổi tên hay xoá code gốc của lớp 1: tên hàm JS, biến toàn cục, thuộc tính
  `name`/`id` của input, thứ tự phần tử DOM, tên file CSS/JS.
- Buộc phải sửa thì ghi rõ lý do vào `spec/missing-evidence.md` trước khi sửa.
- `reference/` là **bằng chứng gốc, chỉ đọc**. Không sửa, không xoá, không "dọn dẹp".

---

## 4. THANG 5 MỨC

Mỗi route trong `spec/route-inventory.json` mang một mức:

| Mức | Ý nghĩa | Điều kiện |
|-----|---------|-----------|
| 0 | Đã biết tồn tại, chưa có bằng chứng | có trong `menu-tree.json` |
| 1 | Đã có HAR/source gốc | có file trong `reference/` |
| 2 | Đã dựng, khớp ở khổ rộng | so DOM sạch lỗi ở khổ ≥1101 |
| 3 | Khớp cả bộ khổ NT-3 | so DOM sạch lỗi ở đủ 7 khổ, gồm 390 |
| 4 | Đã đấu `config_store` — Apply có tác dụng thật | sửa trang A, trang B đổi theo |

**Mục tiêu: 100% route đạt mức 4.** Không báo "xong" khi còn route dưới mức 4.

Hiện trạng 2026-08-03: **77/77 route ở mức 1** (đã có source gốc).

### 4.1. Cách nghiệm thu mức 2 và 3 — SO DOM, KHÔNG SO ẢNH

Chốt ngày 2026-08-03. Lý do: so ảnh bằng mắt bỏ sót đúng những thứ quan trọng nhất
cho mục tiêu ảo hoá — sai một thuộc tính `name`, thiếu một `<input type="hidden">`,
lệch thứ tự phần tử thì nhìn ảnh không thấy.

Công cụ: `tools/so_dom.py` (chưa viết) mở song song thiết bị thật và bản giả lập,
đối chiếu và báo cáo từng khác biệt:

| Hạng mục | So cái gì |
|---|---|
| Cấu trúc | cây DOM, thứ tự phần tử, số lượng nút |
| Thuộc tính | `name`, `id`, `type`, `value`, `class` của mọi input/select/checkbox |
| Ẩn/hiện | phần tử nào `display:none` — phải ẩn đúng những cái thật ẩn |
| Hình học | `getBoundingClientRect()` của các khối chính, dung sai **≤ 2px** |
| Kiểu dáng | `getComputedStyle` các thuộc tính nhìn thấy được |
| Hàm JS | tên hàm và biến toàn cục phải còn nguyên |

Chạy ở **cả hai khổ** 1920×1080 và 390×844. Báo cáo sạch lỗi ở khổ nào thì route
lên mức tương ứng.

**Ảnh chụp** vẫn giữ, nhưng chỉ khoảng **10 trang tiêu biểu** làm đối chứng cho mắt người,
không cần đủ 154 tấm.

### 4.2. Phép kiểm CSS trùng mã băm — thay cho việc đo từng khổ

Đo DOM ở đủ 7 khổ đòi hỏi đổi kích thước cửa sổ, mà Chrome **chặn cả**
`chrome.windows.update` lẫn `window.resizeTo()` với tab thường (đã thử 2026-08-04,
lệnh báo thành công nhưng `outerWidth` không đổi).

Thay thế bằng lập luận chặt hơn: **cùng HTML + cùng CSS ⇒ cùng bố cục ở mọi khổ.**
Bố cục theo khổ do `@media` quyết định; nếu CSS giống nhau từng ký tự thì không thể
khác nhau ở bất kỳ khổ nào.

Cách kiểm — chạy ở cả hai bên rồi so chuỗi kết quả:

```js
function bam(s){let h1=5381,h2=52711;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);
  h1=(h1*33^c)|0;h2=(h2*31^c)|0;}
  return ((h1>>>0).toString(16).padStart(8,'0'))+((h2>>>0).toString(16).padStart(8,'0'));}
const st=[...document.querySelectorAll('style')];
bam(st[0].textContent)+' / '+bam(st[1].textContent)
```

Kết quả 2026-08-04, trang SNTP: **`56eadeea2fb79aac / ce675057f6ec6d35` — trùng khớp.**
Hai khối style gốc dài đúng 20836 và 24084 ký tự ở cả hai bên.

**Lưu ý khi đọc kết quả:** thẻ `<style>` thứ ba là do **tiện ích trình duyệt chèn**,
không phải của thiết bị — bên thật 64 ký tự (tiện ích dịch), bên giả lập 348 ký tự
(`#claude-agent-animation-styles`). Chỉ so hai khối đầu, đừng so tổng.

Phép kiểm này **không thay thế hoàn toàn** việc đo khổ hẹp: cần ít nhất **một** phép đo
DOM thật ở khổ hẹp để xác nhận menu hamburger hoạt động đúng.

**Cách đặt khổ hẹp — đã kiểm nghiệm 2026-08-04:** kéo tay cửa sổ **không được**
(Chrome có kích thước tối thiểu). Cách dùng được là nhờ người dùng bật
**DevTools → Device Toolbar** (`F12` rồi `Ctrl+Shift+M`), chọn **Responsive**
và gõ tay chiều rộng. Chỉ cần **chiều rộng** hai bên khớp nhau, chiều cao chênh không sao.

### 4.3. Hai bẫy khi đọc báo cáo so DOM

**Bẫy 1 — tàn dư trạng thái.** `#scrollLeftBtn` và `#scrollRightBtn` (nút cuộn của menu
cấp 3) mang class do JS gán, và class đó **còn sót lại giữa các lần điều hướng**.
Tab đã duyệt nhiều trang sẽ có class khác tab vừa mở, dù cùng khổ và cùng trang.
Cả hai đều `display:none` nên không ảnh hưởng hiển thị.
→ Gặp lệch ở hai phần tử này thì kiểm chứng bằng **một trang khác cùng khổ** trước khi
kết luận là lỗi dựng. Ngày 2026-08-04 chính chỗ này suýt bị báo nhầm thành lỗi.

**Bẫy 2 — mã băm thời gian thiếu giây.** Đồng hồ hiện ở hai định dạng:
`1970-01-01T00:29` trên thanh tiêu đề và chân trang, `1970-01-01T00:29:57` trong ô dữ liệu.
Regex lọc trường động phải để **giây là tuỳ chọn**, nếu không sẽ bỏ sót
`#_DevCurrTime` và `#_DevCurrTime_footer` rồi báo nhầm thành 4 chỗ lệch.

---

## 5. QUY TRÌNH 6 GIAI ĐOẠN

| GĐ | Việc | Model | Đầu ra | Trạng thái |
|----|------|-------|--------|-----------|
| 0 | Dựng khung, chốt kiến trúc | Opus 5 | thư mục + file này | ✅ xong |
| 1 | Thu thập HAR + source | Sonnet 5 | `reference/` đầy | ⏳ **đang chờ anh Huy** |
| 2 | Giải mã kiến trúc, lập đặc tả | Opus 5 | `spec/*.json` đầy đủ | ⏸ chặn bởi GĐ 1 |
| 3 | Dựng 3 trang mẫu + lõi server | Opus 5 | khuôn mẫu chạy được | ⏸ |
| 4 | Nhân bản theo lô 10–15 trang | Sonnet 5 | phần lớn `views/` | ⏸ |
| 5 | Thiết kế `config_store` | Opus 5 | `config-schema.json` | ⏸ |
| 5b | Đấu nối từng trang vào store | Sonnet 5 | mức 4 | ⏸ |
| 6 | Nghiệm thu 2 khổ màn hình | Sonnet 5 | báo cáo | ⏸ |

**Quy tắc leo thang model:** Sonnet sai **cùng một chỗ ≥ 2 lần** → dừng, chuyển sang Opus 5.
Đó là dấu hiệu việc chưa đủ rõ ràng, không phải model yếu.

**Phạm vi một phiên:** tối đa **một nhóm menu**. Nếu anh Huy lỡ ra lệnh "làm cả thiết bị",
đề xuất chia nhỏ và hỏi lại chứ đừng nhận.

### Điều kiện ra khỏi GĐ 1

Mọi route trong `menu-tree.json` có ≥1 bằng chứng hợp lệ (không phải `302`), **và**
đã có `login.har`, **và** đã có ít nhất một HAR ghi lại hành vi Apply/Save.
Thiếu cái cuối thì không route nào lên nổi mức 4.

---

## 6. TỰ KIỂM TRƯỚC KHI BÁO "XONG" MỘT TRANG

- [ ] Đã đọc file bằng chứng gốc — **nêu được tên file cụ thể**?
- [ ] Không có trường/nhãn/giá trị nào do mình nghĩ ra?
- [ ] URL, tham số, method, mã trạng thái **y hệt** HAR?
- [ ] Đã chạy `so_dom.py` ở khổ 1920 và **báo cáo sạch lỗi**?
- [ ] Đã chạy `so_dom.py` ở khổ 390 và **báo cáo sạch lỗi**?
- [ ] Mọi tab, nút, dialog trong trang đã xử lý hoặc đã ghi nhận?
- [ ] Trang đọc/ghi **qua `config_store`**, không hardcode giá trị nào?
- [ ] Đã cập nhật mức trong `route-inventory.json`?

Còn ô chưa tick → trang **chưa xong**.

---

## 7. NHỮNG LỖI ĐÃ TRẢ GIÁ — KHÔNG LẶP LẠI

Quan sát từ các thiết bị đã làm trong dự án. Ghi ra để tránh, không phải để chê.

1. ❌ **Lưu DOM sau render thay vì HTML gốc** → phải dựng lại toàn bộ.
   → Luôn lấy từ `reference/source/` hoặc từ response trong HAR.

1b. ❌ **Ctrl+U rồi Ctrl+S cũng KHÔNG cho ra mã gốc.** Chrome lưu chính trang
   *view-source* của nó: mỗi dòng bị bọc trong `<td class="line-content">`, ký tự
   `< > &` thành entity, file phình gấp ~4.7 lần (813 KB thay vì 172 KB).
   → Nhận biết: mở file thấy `class="line-content"` hoặc `&lt;`.
   → Chữa: chạy `python go_boc_viewsource.py <file> <file>`, rồi đối chiếu số byte
   với `content.size` của entry tương ứng trong HAR. Khớp mới là đúng.
2. ❌ **Strip `common_lib.js` rồi trả file rỗng** → mất sạch logic điều hướng gốc,
   phải viết lại bằng JS tự chế, mức trung thực cấu trúc về 0.
   → Giữ nguyên file JS gốc.
3. ❌ **Đổi đường dẫn thật cho tiện** (`/?_type=menuView&_tag=x` → `/page/x`)
   → mức trung thực giao tiếp về 0, không nối được vào firmware sau này.
   → Giữ nguyên URL và tham số thật, kể cả khi trông xấu.
4. ❌ **Đặt tên `page_NNN.html`** → không tra cứu được. → Dùng `viewTag`.
5. ❌ **Dựng hết trang tĩnh rồi mới nghĩ tới `config_store`** → mức 4 = 0%.
   → Thiết kế store từ sớm, đấu nối song song theo từng lô.
6. ❌ **Chụp HAR khi phiên đã hết hạn** → `302` hàng loạt. → Đăng nhập lại trước mỗi đợt.
7. ❌ **Dò lỗi thủ công sau khi đã dựng xong tất cả** → kiệt sức.
   → Kiểm ngay từng lô 10–15 trang.

8. ❌ **Trả `SessionTimeout` cho tag không có trong kho → trang reload vô hạn.**
   Mắc ngày 2026-08-03, lần chạy thử đầu tiên.
   `index.html` vị trí 118020 có đoạn:

   ```js
   else if ( ErrorString == "SessionTimeout" ) { top.location.href = top.location.href; return 1; }
   ```

   Hễ **bất kỳ** response nào mang `SessionTimeout` là client **reload cả trang**.
   Trang chủ lại poll `hiddenData&_tag=sntp_data` liên tục để chạy đồng hồ.
   Server chưa có `sntp_data` → trả `SessionTimeout` → reload → poll → reload.
   → **Luật:** chỉ trả `SessionTimeout` khi phiên thật sự hỏng hoặc sai ngữ cảnh trang.
   Tag không tồn tại thì trả **404** như thiết bị thật.

8b. ❌ **Áp quy tắc ngữ cảnh trang quá chặt → cũng gây reload vô hạn.**
   Đây mới là thủ phạm chính của lần chạy hỏng 2026-08-03.
   Bằng chứng `login-day-du.har`, thứ tự thật sau khi đăng nhập:

   ```
   POST login_entry
   GET  /
   GET  /?_type=menuData&_tag=firewall_homepage_lua.lua
   GET  /?_type=menuData&_tag=wlan_homepage_lua.lua&InstNum=5
   GET  /?_type=hiddenData&_tag=sntp_data
   ```

   **Không có `menuView` nào** trước hai `menuData` đó, vì `/` **chính là** trang chủ.
   Server đòi phải có `menuView` trước → trả `SessionTimeout` → client reload → lặp.
   → Khi phục vụ `/` cho phiên đã đăng nhập, phải đặt ngữ cảnh `view_hien_tai = "homePage"`.

8c. ❌ **Phép thử giả — kiểm `"SessionTimeout" in html`.**
   Chuỗi đó nằm sẵn trong `index.html` (hàm `hasError`, vị trí 118020) nên phép thử
   luôn dương tính, báo lỗi ở chỗ không có lỗi. Mất một vòng dò tìm vô ích.
   → Chỉ kiểm trong thẻ: `<IF_ERRORSTR>SessionTimeout</IF_ERRORSTR>`.
   → Bài học rộng hơn: **phép thử báo "đạt" chưa chắc đã chứng minh được gì.**
   Trong phiên này đã có hai phép thử giả — cái này, và phép thử liên trang dùng
   `sntp_data` (trường không tồn tại nên luôn `None`). Mỗi phép thử phải tự hỏi:
   *nếu code sai thì phép thử này có đỏ không?*

8d. ❌ **Lấy `/` khi phiên đang mở trang khác → nhận nhầm trang khung.**
   Đây là nguyên nhân THẬT của lần chạy hỏng 2026-08-03, mất ba vòng chẩn đoán mới ra.
   Thiết bị trả về `/` gồm **khung + nội dung trang mà phiên đang mở**.
   Lúc lấy mã gốc, phiên đang ở Energy Conservation nên `index.html` thu được là
   khung + trang EnergyMode — không hề có `firewall_homepage_lua.lua`.
   Hệ quả: thanh `<h1 class="collapBarWithDataTrans" id="EnergyConfBar">` liên tục
   gọi `energy_config_lua.lua` vì `<input id="DataHasBeenGot" value="0">` không bao giờ
   thành `1` → một cặp AJAX **mỗi 85 ms**, trang treo, spinner quay mãi.
   → Trang khung đúng phải lấy từ **entry `/` ngay sau POST đăng nhập** trong
   `reference/har/login-day-du.har` (258550 byte, có `firewall_homepage_lua.lua`
   và `wlan_homepage_lua.lua`).
   → Bản sai giữ lại làm bằng chứng: `reference/source/index-khung-EnergyMode.html`.
   → **Luật chung: mọi thứ lấy bằng `fetch()` đều phụ thuộc trạng thái phiên lúc lấy.**
   Phải kiểm nội dung có đúng trạng thái mong muốn không, đừng tin vào kích thước file.

8e. Cách chẩn đoán đã hiệu quả, dùng lại lần sau:
   đọc `read_network_requests` lọc theo `_type=` → nhìn **chu kỳ lặp** và **mã trạng thái**.
   Ở đây mọi response đều 200 SUCC, chứng tỏ lỗi không nằm ở server mà ở nội dung HTML.
   Nếu chỉ nhìn "có lỗi HTTP không" thì sẽ đi sai hướng.

9. ❌ **Nhầm giá trị động thành giá trị cấu hình.**
   `OBJ_SNTP_ID.CurrentLocalTime` khác nhau giữa hai lần chụp
   (`02:37:57` và `02:09:16`) — đó là đồng hồ, không phải cấu hình.
   Lưu cứng vào `config_store` thì đồng hồ đứng yên, lộ ngay là bản giả lập.
   → Khai báo trong `TRUONG_DONG` của `config_store.py`, sinh lại mỗi lần đọc.
   Thiết bị thật chưa đồng bộ NTP nên đếm từ `1970-01-01` theo uptime — tái hiện đúng vậy.

---

## 8. CÁCH BÁO CÁO

- Trả lời bằng **tiếng Việt**, ngắn gọn, đi thẳng vào việc. Không tán dương, không lặp lại đề bài.
- Thiếu bằng chứng thì **nói ngay và nói rõ thiếu file nào** — đừng làm tiếp rồi mới báo.
- Anh Huy chỉ ra một lỗi → tự hỏi *"lỗi cùng kiểu còn ở trang nào khác không?"*,
  rà toàn bộ rồi sửa một lượt.
- Yêu cầu nào mâu thuẫn với file này thì **nói ra**, đừng âm thầm làm theo.
- Kết thúc phiên: cập nhật `spec/route-inventory.json` và `spec/missing-evidence.md`.

---

## 9. CẤU TRÚC THƯ MỤC

```
devices/be12000/
├── CLAUDE.md                  # file này
├── HUONG-DAN-CHUP-HAR.md      # hướng dẫn thu thập bằng chứng cho anh Huy
├── reference/                 # BẰNG CHỨNG GỐC — CHỈ ĐỌC
│   ├── har/                   # *.har, xuất bằng "Save all as HAR with content"
│   ├── source/                # index.html + jquery/*.js GỐC (không phải DOM sau render)
│   └── screenshot/
│       ├── desktop/           # <viewTag>.png @1920
│       └── mobile/            # <viewTag>.png @390
├── spec/
│   ├── menu-tree.json         # cây menu đầy đủ (đã xong)
│   ├── route-inventory.json   # danh sách chủ đạo 77 route + mức (đã xong)
│   ├── cgi-map.json           # sơ đồ endpoint + tham số
│   ├── config-schema.json     # schema config_store (GĐ 5)
│   └── missing-evidence.md    # chỗ còn thiếu bằng chứng
└── src/                       # bản giả lập (mục 3.4)
```

---

## 10. TỪ ĐIỂN

- **viewTag** — giá trị `_tag` trong `?_type=menuView`, là định danh duy nhất của một route.
- **dataTag** — giá trị `_tag` trong `?_type=menuData`, dạng `*_lua.lua`, là nguồn dữ liệu.
- **reference / bằng chứng gốc** — bản chụp thật từ thiết bị, chỉ đọc.
- **config store** — kho cấu hình trung tâm, đóng vai NVRAM của thiết bị.
- **mức 0–4** — thang trạng thái ở mục 4.
- **thực thể (instance)** — một thiết bị ảo đang chạy: một tiến trình + một file state.

---

## 11. NHẬT KÝ QUYẾT ĐỊNH

| Ngày | Quyết định | Lý do |
|------|-----------|-------|
| 2026-08-03 | Định danh route bằng `viewTag`, bỏ quy tắc "tên file `.htm`" | Thiết bị thật không có file trang riêng |
| 2026-08-03 | Python stdlib, không framework | Đồng bộ 7 sim hiện có; không phụ thuộc ngoài, dễ đóng gói image |
| 2026-08-03 | Lõi tự chứa trong `be12000/`, chưa tách `shared/` | Mới có một thiết bị ZTE làm bằng chứng, trừu tượng sớm dễ sai |
| 2026-08-03 | Không đụng 7 sim cũ | Đang phục vụ dạy học tốt ở mức ảnh chụp tĩnh |
| 2026-08-03 | Không tái sử dụng gì từ `sim_be15000` | Cùng họ giao diện nhưng khác firmware — NT-1 |
| 2026-08-03 | Cổng mặc định 8098 | Tránh trùng 8080, 8090–8096, 3000, 2437 |
| 2026-08-03 | Cấm biến toàn cục giữ cấu hình; state truyền qua tham số | Điều kiện để chạy đa thực thể kiểu GNS3 sau này |
| 2026-08-03 | Nghiệm thu mức 2/3 bằng **so DOM tự động**, bỏ so ảnh 154 tấm | Mắt người bỏ sót sai `name`, thiếu input ẩn, lệch thứ tự — đúng thứ quan trọng nhất cho ảo hoá |
| 2026-08-03 | Ảnh chụp giảm còn ~10 trang tiêu biểu | Chỉ để đối chứng cho mắt người, không phải căn cứ nghiệm thu |
| 2026-08-03 | Ghi và đọc dùng chung endpoint, phân biệt bằng HTTP method | Xác minh từ `sntp-apply.har` |
| 2026-08-03 | Bỏ cặp số 1920/390, thay bằng **bộ 7 khổ quanh 3 điểm ngắt thật** (960, 1020, 1100) | Hai con số tự chọn bỏ lọt cả ba ngưỡng; điểm ngắt lấy từ `@media` trong mã gốc |
| 2026-08-03 | Điều kiện so: hai bên cùng **chiều rộng**, chiều cao chênh không sao | Đã kiểm 695 với 639 vẫn cho 0 lệch toạ độ |
