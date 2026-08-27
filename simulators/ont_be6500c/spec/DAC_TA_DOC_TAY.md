# Đặc tả đọc tay từ mã gốc — ONT-BE6500C (GĐ 3)

> Nguồn duy nhất: `reference/source/assets_goc/*.js`.
> Phần này là những gì **script không tự rút được** — logic ẩn/hiện, thứ tự
> tùy chọn, quy tắc biến đổi dữ liệu, văn bản hộp thoại.
> Phần rút tự động nằm ở `spec/pages/*.json` và `spec/api_methods.json`.

Ngày: 2026-08-12

---

## 0. Bản đồ route → chunk (bảng định tuyến `f0e` trong bundle lõi)

Mỗi route là một chunk JS riêng, nạp lười. Muốn đọc trang nào thì mở đúng
chunk đó — xem `spec/route_chunk.json`.

**21 route.** `home/wizard` có chunk thật (`index-BC-_5TxF.js`) nhưng không
dựng được vì vào trang là thiết bị đăng xuất (xem `ISSUES.md`).

---

## 1. Ba lớp giao tiếp — đã gỡ xong nghi vấn

Bundle chứa **cả hai** cài đặt REST và RPC cho cùng một nghiệp vụ; cờ build
quyết định dùng cái nào. Trên bản firmware này:

| Bí danh | Biểu thức | Cờ | Chọn |
|---|---|---|---|
| `use` | `sse ? lse : ase` | `sse=false` | `ase` — REST |
| `B_` | `bA ? wA : _A` | `bA=false` | `_A` — REST |
| `Ble` | `Mle ? Fle : Nle` | `Mle=false` | `Nle` — REST |

**Hệ quả:** dữ liệu đi qua `/api/v1/data/*` — đúng như GĐ2 đã dựng.
`/oui-rpc` vẫn cần cho: đăng nhập, cây menu, **và toàn bộ `system/upgrade`**.

Chi tiết tầng HTTP (header, timeout 10 s, bảng mã lỗi) ở `spec/toan_cuc.json`.

---

## 2. Lời gọi ở mức khung ứng dụng — chạy trên MỌI trang

| Hàm | Resource | Lặp lại |
|---|---|---|
| `getSystemInfo` | `GET api/v1/data/system/info` | không |
| `getSsidConfiguration` | `GET api/v1/data/ssids` | không |
| `getInstances` | `GET api/v1/data/devices` | **30 giây** + khi cửa sổ được focus |
| `getMenu` | RPC `oui.ui / menu` | không |
| `getWizardSettings` | `GET api/v1/data/wizard` | không (gọi ở 2 chỗ) |

Giả lập phải phục vụ được 5 lời gọi này ở **mọi** trang, không riêng trang nào.

---

## 3. Gỡ nghi vấn `sidebarWidth = 220`

Quét toàn bộ bundle: chuỗi `sidebarWidth` xuất hiện **đúng 2 lần** — một lần
đặt giá trị ban đầu (`Hde = JSON.parse("220")`), một lần trong `partialize`
để lưu xuống localStorage. **Không thành phần bố cục nào đọc nó.**

Bố cục thật dùng hai hằng số cứng: `Xu = 52` (thu gọn), `GA = 160` (mở rộng).

→ `sidebarWidth: 220` là **cấu hình chết**, tàn dư thiết kế cũ. Nghi vấn ghi
ở `ISSUES.md` 2026-08-11 mục 5 nay đã đóng.

Hằng số bố cục khác: icon menu 20px, đầu trang máy tính 56px, đầu trang điện
thoại 64px.

---

## 4. Điểm gãy màn hình — sửa lại con số đã ghi

Breakpoint là **mặc định MUI**, ứng dụng không ghi đè:
`xs:0, sm:600, md:900, lg:1200, xl:1536`.

**Việc chuyển sang giao diện điện thoại xảy ra ở `down("md")` — tức dưới
900px, KHÔNG phải 600px.** Bản chụp bằng chứng ở 502px nên vẫn đúng, nhưng
nếu kiểm thử ở 700px thì **vẫn là** giao diện điện thoại. Ghi chú cũ
"điểm gãy 600px" dễ gây hiểu nhầm khi làm GĐ5.

Khi < 900px:

- thanh bên **không render** (không phải ẩn bằng CSS)
- hiện `Drawer anchor="top"`, `height: 100%`, chuyển cảnh 300 ms → phủ kín
- đầu trang 56px → 64px
- nội dung: `marginLeft: 0`, `width: 100vw`

Ngoài ra hầu hết trang có khung `width:70%; maxWidth:980; minWidth:600` ở máy
tính, chuyển thành `width:100%; minWidth:0` ở điện thoại — và **đoạn văn mô
tả đầu trang bị `display:none` ở điện thoại** (upnp, dmz, wifi/advanced...).
Ở điện thoại mới hiện `PageHeading` (tiêu đề trang), máy tính thì không.

---

## 5. Chín resource là mã chết

Có định nghĩa trong bundle nhưng **tìm thấy đúng 1 lần** (chính là định
nghĩa) → giao diện không bao giờ gọi tới:

```
access/http/connections      access/ssh/connections
alg                          eapProfiles
publicLan                    publicLan/routing/reservedHosts
publicLan/staticNat/policies system/logServer
system/logs
```

Giả lập không cần nghiệp vụ cho chúng; vẫn giữ nguyên phản hồi đã chụp khi
GET trực tiếp.

`devices` **không** thuộc nhóm này — nó được gọi ở mức khung, lặp 30 giây.

---

## 6. `wifi/general` — Wi-Fi Network Configuration

**Tab:** sinh từ `getEasyMeshConfiguration().ssidTypesConfigurations`, lọc
`uiConfigurable === true`, nhãn `${TYPE.toUpperCase()} NETWORK`.

Dữ liệu thật của thiết bị: Primary ✔, Guest ✔, SmartHome ✔, **Backhaul ✘**
(`uiConfigurable: false`).
→ **3 tab: `PRIMARY NETWORK`, `GUEST NETWORK`, `SMARTHOME NETWORK`.**
Đây là lời giải cho câu hỏi "xử lý cặp Backhaul MLO thế nào": giao diện
**không hiện** nó. Không cần dựng gì thêm.

Tiêu đề trang: `Wi-Fi Network Configuration`

### Cấu trúc form mỗi tab

1. Công tắc `useSeparateNetwork`, nhãn **"Use separate network"**
   (`labelPlacement: start`, rộng 100%, `marginBottom: 4`)
2. Nếu **bật**: một khối accordion cho **mỗi** radio.
   Nếu **tắt**: chỉ **một** khối, lấy theo radio **5G**.
3. Mỗi accordion:
   - Đầu mục: số tần (`2.4` / `5` / `6`) + chữ `GHz`.
     Khi gập lại hiện Chip `Enabled` / `Disabled`.
   - `networks.N.enabled` — công tắc, nhãn **"Enable"**
   - `networks.N.name` — text, nhãn **"Wi-Fi Network Name"**, `maxLength 32`
     - helper: `Up to 32 characters: letters, numbers, dots (.), underscores (_), or hyphens (-).`
     - khi trùng tên với SSID loại khác → hiện thêm dòng đỏ
       `All these SSIDs should not use the same value.`
   - `networks.N.securityMode` — select, nhãn **"Security Mode"**
   - `networks.N.passphrase` — password, nhãn **"Password"**, `maxLength 63`
     — **ẩn hoàn toàn khi `securityMode === None`**
   - `networks.N.broadcastEnabled` — công tắc,
     nhãn **"Enable network broadcast"**
   - Cả 4 trường dưới đều `disabled` khi `enabled` tắt.
   - Trước ô Password có `<input type="text" name="username"
     value="wifi-key-non-login-configuration" style="display:none">` —
     mẹo chặn trình duyệt tự điền. **Phải giữ**, nó có trong DOM thật.

### Danh sách tùy chọn Security Mode

Lấy từ `ssid.securityModesSupported`, **sắp xếp khác nhau tùy chế độ**:

- tách mạng: `a.localeCompare(b)` (tăng dần)
- gộp mạng: `b.localeCompare(a)` (giảm dần)

Khi **gộp mạng** thì chèn thêm mục giả `WPA23T`:
`unshift` (lên đầu) nếu là tab SmartHome, `push` (xuống cuối) nếu không.

Nhãn hiển thị (gộp mạng — nhiều dòng ghép, không phải chuỗi phẳng):

| Giá trị | Hiển thị khi gộp |
|---|---|
| `WPA3-Personal-Transition` | `[Default] WPA2/3 (2.4GHz, 5GHz)` + `WPA3 (6GHz)` nếu có 6G |
| `WPA23T` | `[Default nếu SmartHome] WPA2 (2.4GHz) WPA2/3 (5GHz)` + `WPA3 (6GHz)` nếu có 6G |
| `WPA2-Personal` | `WPA2 (2.4GHz & 5GHz)` + `WPA3 (6GHz)` nếu có 6G |

Chip `Default` gắn vào `WPA3-Personal-Transition` khi **không phải** SmartHome,
gắn vào `WPA23T` khi **là** SmartHome.

Khi **tách mạng**, `WPA3-Personal-Transition` hiển thị là `WPA2/WPA3 Personal`,
các giá trị khác hiển thị nguyên văn.

### Suy diễn WPA23T lúc nạp

Khi **gộp mạng** và 2.4G là `WPA2-Personal` và 5G là
`WPA3-Personal-Transition` → form hiển thị 5G thành `WPA23T`.

### Đổi tên khi bật/tắt "Use separate network"

Bảng hậu tố: `{"2.4G": " 2.4G", "5G": " 5G", "6G": " 6G"}` — **có dấu cách
đầu**.

- Bật tách: thêm hậu tố vào tên; nếu vượt 32 ký tự thì cắt bớt phần gốc.
- Tắt tách: cắt đuôi nếu tên kết thúc bằng **`-2.4G`** (4 ký tự) /
  **`-5G`** / **`-6G`** (3 ký tự).

> ⚠ **Lệch trong chính firmware:** lúc thêm dùng dấu **cách** (`" 2.4G"`)
> nhưng lúc cắt lại kiểm tra dấu **gạch ngang** (`"-2.4G"`). Bật rồi tắt
> **không** trả về tên gốc. Đây là lỗi của hãng — theo nguyên tắc "giống
> thật là trên hết", giả lập **giữ nguyên**, không sửa.

Khi tắt tách, 5G còn bị đặt lại `securityMode` = `WPA23T` nếu là SmartHome,
ngược lại `WPA3-Personal-Transition`.

### Lưu

Hai lời gọi **tuần tự**:

1. `PATCH api/v1/data/ssids` — mảng, mỗi phần tử
   `{id, enabled, name, securityMode, passphrase, broadcastEnabled}`
   - Khi **gộp**: mọi radio lấy giá trị từ `networks[0]`; riêng
     `securityMode` nếu là `WPA23T` thì tách ra —
     2.4G → `WPA2-Personal`, radio khác → `WPA3-Personal-Transition`;
     nếu radio không hỗ trợ chế độ đó thì rơi về
     `securityModesSupported[0]`.
2. `PATCH api/v1/data/easyMesh` —
   `{enabled: true, ssidTypesConfigurations: [{type, separatedSsid}]}`

Lỗi → snackbar `Failed to save changes. Please try again later.`

### Hộp thoại

| Khi nào | Tiêu đề | Nội dung | Nút xác nhận |
|---|---|---|---|
| Trước khi lưu | `Before we continue...` | `To apply changes, Wi-Fi will restart and Wi-Fi-connected devices will briefly lose connection for a few seconds.` | `Continue` |
| Đổi tab khi form bẩn | `You have unsaved changes.` | `Are you sure you want to discard them?` | `Discard` |

---

## 7. `wifi/advanced` — Advanced Settings

**2 tab:** `Radios` (mặc định) và `Other`.

### Tab Radios

Một accordion mỗi radio, đầu mục = số tần + `GHz`.

- `radios.N.dfsEnabled` — công tắc **"Allow DFS channels"**,
  **chỉ hiện với băng 5G** (`H = ["5G"]`)
- `radios.N.bandwidth` — select **"Bandwidth(MHz)"**
  - tùy chọn từ `bandwidthSupported`; nếu có `Auto` thì đẩy `Auto` lên đầu
  - nhãn = giá trị đã bỏ chữ `MHz` (vd `80MHz` → `80`)
  - `160MHz` bị **disable** khi băng 5G và DFS đang tắt
  - helper khi DFS bật và có `bandwidthInUse`:
    `Currently on <X>.\nWhen DFS is enabled, the actual bandwidth and channel may differ from the configured settings.`
    (xuống dòng thật, CSS `white-space: pre-wrap`)
- `radios.N.channel` — select **"Channel"**
  - luôn có mục đầu `{value: 0, label: "Auto"}`
  - phần còn lại = giao của `possibleChannels` với bảng kênh cứng theo
    (băng, bandwidth), sắp tăng dần
  - riêng 2.4G: kênh **1, 6, 11** lên trước, các kênh còn lại hiện với hậu
    tố `" (not recommended)"`
  - helper khi (autoChannel hoặc DFS) và có `channelInUse`:
    `Currently on channel <X>.`
  - chiều cao menu tối đa = `7 × 36 + 16` px

Bảng kênh cứng (`Ne`) trích nguyên trong `spec/pages/wifi__advanced.json`.

Hai hiệu ứng phụ tự động:
- nếu băng 5G, DFS tắt, bandwidth đang là `160MHz` → ép về `Auto`
- `autoChannelEnabled` được đặt = `(channel === 0)`

Khối văn bản hướng dẫn đầu trang (ẩn ở điện thoại) + khối `REMINDER` màu
cảnh báo — nguyên văn trong `spec/pages/wifi__advanced.json`.

Lưu: `PATCH api/v1/data/radios`, mỗi phần tử
`{id, bandwidth, autoChannelEnabled, channel: (auto ? 0 : channel)}`,
thêm `dfsEnabled` **chỉ khi** băng là 5G.
Lỗi → `Changes saving failed, please try again.`
Hộp thoại xác nhận trước khi lưu giống mục 6.

### Tab Other — MLO

- Tiêu đề `MLO (Multi-Link Operation)`, đoạn mô tả (ẩn ở điện thoại)
- `mloEnabled` — công tắc **"Enable MLO"**, **tự lưu ngay khi đổi**
  (không có nút Save)
- Bên dưới liệt kê mạng khả dụng: các SSID **5G đang bật**, thuộc loại có
  `!separatedSsid && uiConfigurable && mloEnabled`
  - có mạng → `Available Networks:` rồi liệt kê tên
  - không có → `No available network found.` +
    `You may go to General Settings to set each network to identical name to apply MLO.`
- Lưu: `PATCH api/v1/data/easyMesh` với
  `{enabled, ssidTypesConfigurations: [{type, mloEnabled}] cho mọi loại uiConfigurable}`
- Thành công → `Enabled MLO successfully.` / `Disable MLO successfully.`

> ⚠ Chuỗi gốc là **"Disable"** chứ không phải "Disabled" — sai ngữ pháp
> trong firmware. Giữ nguyên. (Lỗi y hệt cũng có ở trang UPnP.)

---

## 8. `advanced/upnp` — UPnP

Trang đơn giản nhất: **một** công tắc `enabled`, nhãn **"Enable UPnP"**,
**tự lưu ngay khi đổi**, không có nút Save.

- `GET/PATCH api/v1/data/upnp`
- Thành công → `Enabled UPnP successfully.` / `Disable UPnP successfully.`
- Lỗi → `An error has occurred. Please try again.`
- Đoạn mô tả UPnP dài (ẩn ở điện thoại) — nguyên văn trong spec JSON.
- Ở điện thoại hiện thêm `PageHeading` = `UPnP`.

---

## 9. `advanced/dmz` — DMZ

- `enabled` — công tắc **"Enable DMZ"**
- `ipAddress` — **autocomplete** (không phải text), nhãn **"Device / IP"**,
  `disabled` khi `enabled` tắt, `disableClearable`, `forcePopupIcon`
  - danh sách chọn dựng từ **hook `useDevices`** (đọc kho
    `instance-store`, lọc bỏ `type === "Router"` và chỉ lấy
    `status === "Up"`), mỗi mục:
    `{key: id, value: ip4Address, label: "<hostname hoặc 'Unknown'> (<ip>)"}`
- Kiểm tra: khi bật thì `ipAddress` bắt buộc là IPv4 —
  lỗi `Please input a valid IPv4 address.`
- Nạp: `GET api/v1/data/dmz/configurations` rồi **lấy phần tử có
  `ipVersion === 4`**
- Lưu: `PATCH` với `[{enabled, ipAddress, id}]` — **mảng một phần tử**
- Lỗi → `An error has occurred. Please try again.`
- Nút Save/Cancel; Cancel đặt lại về bản ghi vừa nạp.

---

## 10. `system/user` — Change Password

- Hiện `Username` (đọc từ `session-store.username`), chỉ đọc
- `password` — **"New Password"**, placeholder `at least 8 characters`
- `confirmPassword` — **"Confirm New Password"**, placeholder
  `Confirm New Password`
- Không khớp → `Passwords do not match.`
- **Không dùng REST.** Đi qua RPC:
  - đọc: `getPassword` → `module: "user", action: "get_users"`
  - ghi: `setPassword` → `module: "user", action: "change"`,
    payload `{id, acl, password}` (tìm user theo `username` trong danh sách)
- **Đổi mật khẩu xong là ĐĂNG XUẤT ngay** (`signOut()`).
- Lỗi → `Changes saving failed, please try again.`
- Ở điện thoại hiện `PageHeading` = `Change Password`; ở máy tính có
  `<Divider>` giữa phần Username và form.

---

## 11. `network/diagnostics` — Diagnostics

- `method` — select **"Method"**, 5 tùy chọn **đúng thứ tự này**:

  | value | hiển thị |
  |---|---|
  | `PingIPv4` | `IPv4 Ping` |
  | `PingIPv6` | `IPv6 Ping` |
  | `TracerouteIPv4` | `IPv4 Trace Route` |
  | `TracerouteIPv6` | `IPv6 Trace Route` |
  | `DNSLookup` | `DNS Lookup` |

- `target` — text, nhãn **"Domain Name / IP Address"**
- Kiểm tra theo method:
  - IPv4 → IPv4 **hoặc** tên miền, lỗi
    `Test target must be either an IPv4 address or a domain name.`
  - IPv6 → IPv6 **hoặc** tên miền, lỗi
    `Test target must be either an IPv6 address or a domain name.`
  - DNSLookup → **chỉ** tên miền, lỗi `Test target must be a domain name.`
- Nút **"Diagnose"** (LoadingButton, `size` = large ở điện thoại /
  medium ở máy tính)
- Gửi: `POST api/v1/data/diagnostic` với thân **đã ánh xạ lại**:

  ```
  PingIPv4       -> {action:"Ping",       ipVersion:4, target}
  PingIPv6       -> {action:"Ping",       ipVersion:6, target}
  TracerouteIPv4 -> {action:"Traceroute", ipVersion:4, target}
  TracerouteIPv6 -> {action:"Traceroute", ipVersion:6, target}
  DNSLookup      -> {action:"DNS Lookup", ipVersion:4, target}
  ```

  Trường `method` **không** được gửi đi.
- Kết quả: `result.status === "Failed" && result.error` → hiện `error`,
  ngược lại hiện `output`. Ô kết quả là textarea chỉ đọc, font `code`.
  - nhãn ô = `Result`; nếu kết quả rỗng thì nhãn đổi thành
    `No diagnostic results available for display.`
- Lỗi mạng → `An error has occurred. Please try again.`

---

## 12. `security/firewall` — 16 công tắc

Toàn bộ là công tắc, `GET/PATCH api/v1/data/firewall`:

```
spiEnabled                          SPI Firewall
icmpPing.wanEnabled                 Respond to Pings from WAN
dosDefense.enabled                  DoS Defense
dosDefense.tcpFlood.enabled         SYN Flood Defense
dosDefense.udpFlood.enabled         UDP Flood Defense
dosDefense.icmpFlood.enabled        ICMP Flood Defense
dosDefense.portScan.enabled         Port Scan Detection
dosDefense.tcpFlagScan.enabled      Block TCP Flag Scan
dosDefense.land.enabled             Block Land
dosDefense.smurf.enabled            Block Smurf DDoS
dosDefense.pingOfDeath.enabled      Block Ping of Death
dosDefense.traceRoute.enabled       Block Trace Route
dosDefense.icmpFragment.enabled     Block ICMP Fragment
dosDefense.synFragment.enabled      Block SYN Fragment
dosDefense.fraggleAttack.enabled    Block Fraggle Attack
dosDefense.unknownProtocol.enabled  Block Unknown Protocol
```

---

## 13. `advanced/ddns` — Dynamic DNS

- `customDDnsEnabled` — công tắc **"Enable"**
- `dynamicServer` — select **"Dynamic Server"**, 3 tùy chọn:
  `dyndns → DynDNS`, `noip → No-IP`, `changeip → ChangeIP`
- `username` — **"Username"**
- `password` — **"Password"**
- `hostname` — **"Domain Name"**
- `GET api/v1/data/ddns` (trạng thái) +
  `GET/PATCH api/v1/data/ddns/configurations` (cấu hình)

---

## 14. `system/general` — System Settings

- `hostname` — **"Router Hostname"**
- `localTimeZone` — select **"Timezone"** (danh sách từ chunk
  `timezone-DtTaowKW.js`)
- `GET api/v1/data/system/info`, ghi bằng
  **`PATCH api/v1/data/system`** (không phải `system/info` — resource đọc và
  ghi **khác nhau**, đúng như `config_store` của AP đã xử lý)
- `GET/PATCH api/v1/data/time`

---

## 15. `advanced/tcpdump` — TCPDump

- `maxPacketsNumber` — **"Max Packet Number (1-2000)"**
- `GET api/v1/data/interfaces/configurations` (chọn giao diện)
- `GET api/v1/data/tcpdump/interfaces/{id}` (kết quả)
- `POST api/v1/data/tcpdump/interfaces/{id}/action` (bắt đầu/dừng)

---

## 16. `network/portforward` — Port Forwarding

Bảng luật + hộp thoại thêm/sửa:

- `enabled` — **"Enable"**
- `name` — **"Name"**
- `protocol` — select: `All → TCP + UDP`, `TCP → TCP`, `UDP → UDP`
- `destination.ipAddress` — **"Device / IP"** (autocomplete như DMZ)
- Đủ 4 method trên `api/v1/data/portForwarding/policies`

---

## 17. `advanced/lan` — LAN

Trang lớn nhất sau overview/wizard. Các trường đã xác định:

```
ipv4Settings.ipAddress              IP Address
ipv4Settings.mask                   Subnet Mask
ipv4Settings.dhcp.enabled           Enable DHCP Server
ipv4Settings.dhcp.startAddress      Start IP Address
ipv4Settings.dhcp.endAddress        End IP Address
ipv4Settings.dhcp.leaseTime.days    Day(s)
ipv4Settings.dhcp.leaseTime.hours   Hour(s)
ipv6Settings.enabled                Enable LAN IPv6
ipv6Settings.mode                   Mode          (Stateful / Stateless)
ipv6Settings.pdMode.prefix          Custom Delegated IPv6-Prefix
ipv6Settings.ula.prefix             ULA IPv6-Prefix
ipv6Settings.dhcp.enabled           Enable DHCP Server
ipv6Settings.dhcp.startSuffix       Start IP Suffix
ipv6Settings.dhcp.endSuffix         End IP Suffix
data.{i}.macAddress                 Device / MAC     (bảng Reserved IP)
data.{i}.ipAddress                  Reserved IP      (bảng Reserved IP)
```

API: `interfaces/configurations`, `dhcp/servers`, `dhcp/reservedHosts`
(đủ 4 method).

**Còn phải đọc tay:** điều kiện ẩn/hiện giữa IPv6 mode, quy tắc kiểm tra dải
DHCP, hành vi bảng Reserved IP khi rỗng.

---

## 18. `advanced/wan` — WAN

```
ipv4Settings.protocol               Connection Type
ipv4Settings.pppoe.username         PPP Username
ipv4Settings.pppoe.password         PPP Password
ipv4Settings.ipAddress              IPv4 Static IP
ipv4Settings.mask                   IPv4 Subnet Mask
ipv4Settings.gateway                IPv4 Gateway Address
ipv6Settings.protocol               Connection Type
ipv6Settings.ipAddress              IPv6 WAN Address
ipv6Settings.gateway                IPv6 Gateway Address
ipv6Settings.prefix                 Custom Delegated IPv6-Prefix
{x}.dns.dnsServers.primary          Primary DNS
{x}.dns.dnsServers.secondary        Secondary DNS (Optional)
vlan.enabled                        Enable VLAN
vlan.id                             VLAN ID
enabled                             Enable backup Internet
```

Hộp thoại xác nhận riêng của trang này — **khác** trang Wi-Fi:

> `Before we continue...` /
> `To apply changes, your connected devices will briefly lose connection for a few seconds.`

API: `interfaces/configurations` (GET+PATCH), `ethernetPorts` (GET),
`pon/status` (GET).

**Còn phải đọc tay:** cây ẩn/hiện theo `protocol` (DHCP / Static / PPPoE),
nhánh PON.

---

## 19. `system/upgrade` — KHÔNG dùng REST một lần nào

Phát hiện quan trọng: quét `/api/v1/data/` ra **0 kết quả** cho trang này.
Toàn bộ đi qua hai kênh khác.

**Đường dẫn cố định:**

```
/oui-upload            POST, FormData {sid, path, file}
/oui-download          GET,  ?sid=<sid>&path=<path>
/tmp/firmware.bin      đích tải firmware lên
/tmp/backup.tar.gz     đích tạo bản sao lưu
/tmp/settings.tar.gz   đích tải bản khôi phục lên
```

**Các lệnh RPC (`/oui-rpc`):**

| Việc | module | action | payload |
|---|---|---|---|
| Kiểm tra firmware | `ubus` (call) | `object:"system", method:"validate_firmware_image"` | `{path:"/tmp/firmware.bin"}` |
| Nâng cấp | `system` | `sysupgrade` | (từ form) |
| Khôi phục mặc định | `system` | `reset` | — |
| Liệt kê bản sao lưu | `system` | `list_backup` | `{path:"/tmp/settings.tar.gz"}` |
| Khôi phục sao lưu | `system` | `restore_backup` | `{path:"/tmp/settings.tar.gz"}` |
| Tạo sao lưu | `system` | `create_backup` | `{path:"/tmp/backup.tar.gz"}` |

Tải firmware lên trả `{md5, size}`; sau đó gọi `validate_firmware_image` lấy
`{valid}`. Danh sách file sao lưu tách bằng ký tự xuống dòng; rỗng thì ném
`No backup files were found`.

**Chưa dựng được:** không có bằng chứng DOM cho các trạng thái tiến trình
(đang tải lên, đang nâng cấp) vì chụp được thì phải nâng cấp firmware thật.

---

## 20. `status/devices` — route CHẾT, thiết bị thật trả 404

**Kết luận dứt điểm** (câu hỏi bỏ ngỏ ở bản trước nay đã trả lời):

Bộ gác route trong bundle lõi:

```js
return ["/", undefined, ...availablePaths].includes(location.pathname)
     ? <Outlet/>
     : <404 Page not found/>
```

`availablePaths` dựng từ **cây menu** (`menu-store`, nạp qua RPC
`oui.ui/menu`). `status/devices` **không có trong cây menu** → không có
trong `availablePaths` → **404**.

Đối chiếu bằng chứng: `reference/source/status__devices.html` và
`m_status__devices.html` đều chỉ chứa đúng chữ `Actiontec / 404 Page not
found`. Đây là **trang duy nhất** trong 21 route bị 404 — không phải lỗi
chụp.

**Mảng dữ liệu mẫu cứng là mã chết, không bao giờ render.** Chunk
`index-CDBqBPYE.js` có sẵn hai bản ghi giả
(`WEB6000Q / A0:78:17:64:8B:F7 / 192.168.31.178 / AP-AX3000C-C9B9`) truyền
thẳng vào `DevicesContent`. Chú ý IP `192.168.31.x` không thuộc mạng LAN
của thiết bị này (`192.168.1.x`) — đúng là dữ liệu demo lúc phát triển bị
lọt vào bản phát hành. Vì route bị 404 nên **người dùng không bao giờ thấy**.

**Bản giả lập đang làm ĐÚNG:** `src/www/status__devices.html` hiện trang
404, khớp thiết bị thật. Không cần sửa, không được "dựng cho có nội dung".

Hook `useDevices` (đọc `instance-store`, bỏ `type === "Router"`, chỉ giữ
`status === "Up"`) vẫn được dùng thật — nhưng ở **trang khác**
(`advanced/dmz`, `network/portforward` lấy danh sách thiết bị cho ô chọn).

---

## 21. `advanced/routing` — Static Routing

**2 tab:** `IPv4`, `IPv6`. Toàn bộ form nằm trong **hộp thoại**, nên script
không rút được trường nào từ thân trang.

Bảng (`Rule List`):

| Cột | IPv4 | IPv6 |
|---|---|---|
| 1 | `Destination IP` | `Destination IP` |
| 2 | `Mask` | `Prefix Length` |
| 3 | `Gateway IP` | `Gateway IP` |
| 4 | `Interface` | `Interface` |

- Nút `Add New`; khi bảng có dòng thì hiện dòng nhắc kèm icon:
  `The order in this table does not represent the actual routing path of the rules.`
- Bảng rỗng → `No routing rule is configured.`
- Nhãn phân trang: `Page <n+1>`, khi chọn nhiều dòng → `<n> selected`
- Mặc định 10 dòng/trang; điện thoại dùng kiểu `scroll`, chiều cao 500px
- Mô tả đầu trang **khác nhau giữa 2 tab** (ẩn ở điện thoại):
  - IPv4: `Static routing allow you to manually set up fixed paths for data to travel between` + `hops` (in đậm) + `, and these paths don't change unless you update them.`
  - IPv6: `Static routing allow you to manually set up fixed paths for data to travel between devices, and these paths don't change unless you update them.`

### Hộp thoại Add/Edit

Tiêu đề `Add New` hoặc `Edit`. Ở điện thoại: `fullScreen`, có nút quay lại
góc trái trên.

- `data.{i}.interfaceId` — nhãn `Interface`.
  Tùy chọn từ `interfaces/configurations`, lọc theo có `ipv4Settings`
  (tab IPv4) hoặc `ipv6Settings` (tab IPv6); nhãn = `usage`, giá trị = `id`.
  Mặc định = mục có nhãn `Internet`, không có thì `wan` (IPv4) / `wan6` (IPv6).
  Máy tính dùng **RadioGroup nằm ngang**, điện thoại dùng **Select**.
- `data.{i}.target` — nhãn `Destination IP`
- `data.{i}.mask` — nhãn `Mask` (**chỉ tab IPv4**), là **combobox** với 4 gợi
  ý cứng: `255.255.255.0`, `255.255.0.0`, `255.0.0.0`, `255.255.240.0`
- `data.{i}.gateway` — nhãn `Gateway IP`

**Thông báo lỗi — nguyên văn:**

```
Destination IP cannot be empty.
Mask cannot be empty.
Gateway IP cannot be empty.
Invalid IP address.
Invalid mask.Please ensure the input is a valid format (e.g., 255.255.255.0) and within the correct range for your network.
This destination IP already exists.
Invalid input. Example: 2001:0db8:85a3::8a2e:0370:7334/64
Destination IP/Prefix Length cannot be empty.
Invalid input. Prefix length must be an integer between 1 and 128.
```

> ⚠ Chuỗi `Invalid mask.Please ensure...` **thiếu dấu cách** sau dấu chấm.
> Lỗi của hãng, giữ nguyên.

### Hộp thoại xác nhận

| Khi nào | Tiêu đề | Nội dung | Nút |
|---|---|---|---|
| Xoá | `Are you sure to delete the selected item(s)?` | `This action cannot be undone.` | `Delete` |
| Đóng khi form bẩn | `You have unsaved changes.` | `Are you sure you want to discard them?` | `Discard` |

Lưu: có `id` → `PATCH`, không có → `POST`; thêm `ipVersion: 4|6` vào mỗi
bản ghi. Bỏ qua bản ghi rỗng hoàn toàn. Lỗi →
`Changes saving failed, please try again.`

---

## 22. `home/topology` — vẽ bằng d3, không phải form

- Nguồn dữ liệu: kho `instance-store` (`instances`) + `getRadios`.
  **Không** gọi `getInternetStatus` trực tiếp trong chunk này.
- Vẽ cây SVG bằng **d3** (`zoom`, `select`), `scaleExtent [0.25, 1]`,
  chuyển cảnh zoom 200 ms, tự căn giữa theo `#right-layout`, có
  `ResizeObserver` để vẽ lại khi đổi kích thước.
- Công tắc `Show Connection Details` (nhãn kiểu `subtitle3`) — bật thì mỗi
  nút hiện thêm chi tiết kết nối.
- Rỗng → `No data to display`
- Chuỗi khác: `COLLAPSE`, `Link Rate`, `Unnamed device`,
  `Connected to Internet via Ethernet`, `Disconnected`, `Connected`,
  `Router`, `Wireless`, `Ethernet`, `Down`, `Mbps`

> Trang này **không thể dựng lại trung thực bằng HTML tĩnh** — nó là đồ thị
> d3 tương tác (kéo, zoom). Bản giả lập hiện dùng ảnh chụp tĩnh. Muốn đạt
> mức 4 phải chép cả logic d3. **Ghi nhận là hạn chế đã biết**, quyết định
> để GĐ6.

---

## 23. `home/overview` — bố cục thật (đọc từ bản chụp + mã gốc)

**Tab trong trang:** khối Internet có 2 tab `WAN` / `LAN`;
khối Devices có 3 tab `Total(n)` / `Wireless(n)` / `Wired(n)`.
→ tổng 5 biến thể tab, khớp 5 file `home__overview__t0..t4.html`.

Thứ tự các khối và trường (nguyên văn nhãn):

1. **Gateway** — `Hostname`, `Model`, `Serial Number`, `Firmware Version`,
   `Uptime`, `Memory Usage`, `CPU Usage`
2. **Internet** (`Disconnected` / `Connected`) — tab `WAN`:
   `Physical Type`, `MAC Address`, `IP Address`, `DNS`, `Gateway Address`,
   `IPv6 Connection Type`, `IPv6 Address`, `Connection Status`,
   `Connection Type`
3. **Nhánh PON** (AP không có): `Link Status`, `Transceiver Temperature`,
   `Transmitted Optical Power`, `Received Optical Power`, `Bias Current`,
   `Supply Power Voltage`, `Tx Packets`, `Rx Packets`
   - `Link Status` hiện `O1  Initial` (mã + diễn giải)
   - `Received Optical Power` khi ngoài dải hiện nguyên câu
     `The optical signal is out of range.` chứ **không** hiện số
4. **Wi-Fi** — phụ đề
   `Wireless settings for Primary, Guest networks and more`, rồi tên SSID,
   chip `2.4G` `5G`, chip chế độ bảo mật, mật khẩu che `********`
5. **Speed Test** — `Download` / `Upload` với `Mbps`, nút `START SPEED TEST`
6. **Devices** — `Extenders` (rỗng → `No extenders found.`) và `Clients`,
   mỗi client hiện `MAC`, `IPv4`, `Connected to`, kiểu kết nối, `UL`, `DL`

API trang này gọi: `internetConnection`, `interfaces`,
`interfaces/configurations`, `ethernetPorts`, `pon/status`, `radios`,
`ssids` (GET+PATCH), `easyMesh`, `system/status`, `speedTest` (POST),
`speedTest/records/{id}`.

---

## 24. `advanced/lan` — LAN

**2 tab:** `General`, `Reserved IP`.

Tab General, các mục theo thứ tự:
`IPv4` → `IPv4 Basics` → `DHCP Server` (kèm khối `REMINDER`) →
`Lease time` → `IPv6` → `IPv6 Basics` → `PD Mode` → `ULA` (`Enable ULA`).

Tab Reserved IP: bảng + nút `ADD` / `Add New`, có công tắc
`Auto Reservation`.

Trường đã xác định — xem bảng ở `spec/pages/advanced__lan.json`.
IPv6 `Mode` có 2 giá trị: `Stateful`, `Stateless`.

**Còn thiếu:** cây ẩn/hiện đầy đủ theo `ipv6Settings.mode`, quy tắc kiểm
tra dải DHCP nằm trong `startAddress`/`endAddress`.

---

## 25. `advanced/wan` — WAN Settings

Các mục: `Basics` → `Physical Port` → `MTU Size` → `IPv4 Connection Type` →
`IPv6 Connection Type` → `DNS` → `VLAN`.

Trang này có tab `Internet Basics` / `IPv4 & IPv6`, trong đó lại có
`IPv4` / `IPv6`.

Hộp thoại xác nhận **riêng, khác trang Wi-Fi**:

> `Before we continue...` /
> `To apply changes, your connected devices will briefly lose connection for a few seconds.`

**Còn thiếu:** cây ẩn/hiện theo `protocol` (DHCP / Static / PPPoE).

---

## 26. `network/speedtest` — Speed Test

Chunk 352 KB vì gói kèm thư viện biểu đồ. Phần nghiệp vụ:

- Nút `START SPEED TEST`, ba số đo `Latency` (ms), `Download`, `Upload`
  (`Mbps`), chưa đo thì hiện `−−`
- `Change server` / `Change Server` — đổi máy chủ đo
- `Result History` — bảng lịch sử, có nút `Export CSV`
- API: `speedTest` (POST), `speedTest/records/{id}` (GET),
  `speedTest/servers` (GET — **thiết bị thật trả 503**, giả lập giữ nguyên 503)

**Còn thiếu:** vùng kết quả sau khi chạy thật (chưa có bằng chứng DOM —
xem mục "4 mục bị chặn" trong `STATUS.md`).

---

## 27. `home/wizard` — chỉ đọc để hiểu, KHÔNG dựng

Vào route này là thiết bị thật thu hồi token và đăng xuất (3/3 lần).
Hai lần chụp đều ra trang login. **Không có bằng chứng nội dung.**

Đọc mã: chunk `index-BC-_5TxF.js`, 1121 chuỗi, 16 lời gọi API — nhiều nhất
trong 21 trang. Gọi cả `system/services/actions` và `system/services/cache`
mà **không trang nào khác gọi**.

Theo luật 2.1: thiếu bằng chứng thì dừng. Trang này **không nằm trong
`__PAGES`** và không có trong sidebar. Giữ nguyên như vậy.

---

## 28. `help` — trang tĩnh

Một mục accordion duy nhất: `How to pair with other extenders?`
Nội dung là 2 thẻ hướng dẫn (chunk `index-Bd0hIkuR.js`):

- `Method 1: Connect via Cable` —
  `Connect the router's LAN port to the extender's Ethernet port with an Ethernet cable.`
  + ảnh `method-wired-DzUfKWYV.svg` (rộng 126)
- `Method 2: Connect Wirelessly` —
  `Press the pairing button on the router, and within 5 seconds, press the pairing button on the extender.`
  + ảnh **khác nhau theo màn hình**:
  máy tính `method-wireless-SFgnKcCR.svg` (rộng 237),
  **điện thoại `method-wireless-mobile-C8XZ1LCT.svg` (rộng 215)**

> ⚠ Quan trọng cho GĐ5: đây là **một trong số ít chỗ dùng ảnh khác nhau
> giữa máy tính và điện thoại**, không phải chỉ đổi CSS. Bản giả lập hiện
> chỉ chép `method-wireless-mobile` — phải kiểm lại khi làm giao diện điện
> thoại.

Khung trang rộng cố định 720px ở máy tính, `width: unset` ở điện thoại.
Ở điện thoại hiện thêm `PageHeading` = `Help` (kiểu `h5`).

---

## 29. Hai lỗ hổng bằng chứng phát hiện ở GĐ 3

### 29.1. `security__firewall.html` (bản máy tính) bị CHỤP NHẦM

Nội dung file thực ra là trang **Speed Test** (`Network / Speed Test Result
History...`), không phải Firewall. Bản chụp bị lấy trước khi SPA kịp chuyển
route.

**Hậu quả:** GĐ2 đã dựng `src/www/security__firewall.html` từ file sai —
bản giả lập hiện **hiện trang Speed Test khi bấm menu Firewall**. Đây là lỗi
nặng vì dạy học viên sai.

- Bản **điện thoại** (`m_security__firewall.html`) thì **đúng** — có đủ
  `Firewall Settings`, `SPI Firewall`, `Respond to Pings from WAN`...
- Đã đối chiếu **toàn bộ** 53 bản chụp máy tính + 34 bản điện thoại bằng
  cách so breadcrumb với route mong đợi: **chỉ đúng 1 file sai này**.
- `emotion.css` hiện tại **đã đủ cả 56 lớp** mà trang Firewall thật dùng
  (đo trực tiếp trên thiết bị) → chỉ cần chụp lại **HTML**, không cần
  chụp lại CSSOM.
- Đã xác nhận trên thiết bị thật: `#/security/firewall` mở được bình
  thường, `GET /api/v1/data/firewall` trả 200.

**Đang chờ:** anh Huynn chạy `chay_collector.bat` để chụp lại.

### 29.2. Công cụ kiểm chứng của GĐ2 không bắt được lỗi này

GĐ2 kiểm 293 đường dẫn HTTP — tất cả trả 200, nên báo "sạch". Nhưng nó chỉ
kiểm **file có tồn tại không**, không kiểm **nội dung có đúng trang không**.

**Đã bổ sung phép kiểm mới:** so breadcrumb (`Actiontec <Nhóm> / <Trang>`)
trong mỗi bản chụp với route mong đợi. Phải đưa phép kiểm này vào bộ verify
của GĐ6.

Đây lại đúng bài học đã ghi ở `MEMORY.md`: công cụ verify tự viết dễ tạo
cảm giác an toàn giả.
