# Tien do BE12000 (ZTE F8728D)

Cap nhat: 2026-08-07 (68/77 dat muc 4. PHAT HIEN LOI QUET: ban quet trang goc chi bat form-action/dataTag DAU TIEN cua moi file HTML, bo sot dataTag o phan collapsible/tab-trigger — anh Huynn phat hien qua so sanh Anti-DoS Attack tren trang Firewall. Da ra soat toan bo 77 trang, sua 7/8 dataTag thieu tim duoc: firewall_dos_lua.lua, accessdev_homepage_lua.lua, usb_homepage_lua.lua, voip_homepage_lua.lua (dot 1), dms_querydir_lua.lua, updownload_prevent_ctl.lua, do_download_syslog.lua, do_download_wifilog.lua (dot 2, anh Huynn tu chup HAR tren thiet bi that) — Firewall/Home/dms/logMgr deu LEN LAI muc 4 (nay moi la muc 4 THAT). Con thieu do_download_seclog.lua (chua bam nut Download Security Log tren thiet bi that), khong chan muc 4 cua logMgr. Con 9 trang chua muc 4: 5 nguy hiem co chu dinh (rebootAndReset, firmwareUpgr, usrCfgMgr, accountMgr, Ethconfig) + ddns/voipBasic/mirror/networkDiag (cho du lieu that/tam dung theo yeu cau). LUU Y: thiet bi that hien dang O TRANG THAI IPv6 OFF, cho anh Huynn tu bat lai)

| # | Trang | Duong dan (_tag) | Co reference | Da dung | Da verify | Dat muc |
|---|-------|-------------------|---------------|---------|-----------|---------|
| 1 | Home | homePage | co | co | co (1536, DOM khop, cross-page song; 2026-08-07 bo sung 3 dataTag tab-trigger bi sot: accessdev_homepage_lua.lua/usb_homepage_lua.lua/voip_homepage_lua.lua — truoc do tab LAN/USB/VoIP Devices tra 404) | 4 |
| 2 | Topology | mmTopology | co | co | co (1536, DOM 315/315 khop tuyet doi, muc4 theo chinh sach telemetry) | 4 |
| 3 | Internet > Status > PON Inform | ponopticalinfo | co | co | co (desktop+980, muc4 theo chinh sach telemetry) | 4 |
| 4 | Internet > Status > WAN | ethWanStatus | co | co | co (desktop+980+cross-page song) | 4 |
| 5 | Internet > Status > 3G/4G | Wan3gStatus | co | co | co (desktop+980, muc4 theo chinh sach telemetry) | 4 |
| 6 | Internet > Status > DSLite | tunnel4in6Status | co | co | co (desktop+980, muc4 theo chinh sach telemetry) | 4 |
| 7 | Internet > Status > L2TP | l2tpStatus | co | co | co (desktop+980, muc4 qua quan he cheo voi l2tpConfig, 2026-08-06) | 4 |
| 8 | Internet > Status > NAT entries/conntracks | conntracks | co | co | co (desktop+980, muc4 theo chinh sach telemetry) | 4 |
| 9 | Internet > WAN > WAN | ethWanConfig | co | co | co (desktop+980+Apply that) | 4 |
| 10 | Internet > WAN > 3G/4G | Wan3gConfig | co | co | co (desktop+980+Apply that) | 4 |
| 11 | Internet > WAN > DSLite | tunnel4in6Config | co | co | co (desktop+980+Apply/Delete that, 2026-08-06) | 4 |
| 12 | Internet > WAN > L2TP | l2tpConfig | co | co | co (desktop+980+Apply that, 2026-08-06) | 4 |
| 13 | Internet > Security > Firewall | firewall | co | co | co (desktop+mobile+Apply that; 2026-08-07 bo sung firewall_dos_lua.lua/OBJ_FWDOS_ID bi sot khi quet trang — phan "Anti-DoS Attack" truoc do tra 404, anh Huynn phat hien) | 4 |
| 14 | Internet > Security > Filter Criteria | filterCriteria | co | co | co (desktop+980+Apply that) | 4 |
| 15 | Internet > Security > Local Service Control | localServiceCtrl | co | co | co (desktop+980+Apply/Delete that, 2026-08-06) | 4 |
| 16 | Internet > Security > ALG | alg | co | co | co (desktop+980+Apply that) | 4 |
| 17 | Internet > Security > DMZ | dmz | co | co | co (desktop+980+Apply that, 2026-08-06) | 4 |
| 18 | Internet > Security > Port Forwarding | portForwarding | co | co | co (desktop+980+Apply/Delete that, 2026-08-06) | 4 |
| 19 | Internet > Security > Port Trigger | portTrigger | co | co | co (desktop+980+Apply/Delete that, 2026-08-06) | 4 |
| 20 | Internet > Parental Controls | parentCtrl | co | co | co (desktop+980+Apply/Delete that, 2026-08-06) | 4 |
| 21 | Internet > DDNS | ddns | co | co | co (desktop+980, da thu Apply that 2026-08-06, server tu choi -257) | 3 |
| 22 | Internet > SNTP | sntp | co | co | co (desktop+mobile+Apply that) | 4 |
| 23 | Internet > Port Binding | portBinding | co | co | co (desktop+980+Apply that; 2026-08-07: anh Huynn phat hien THIEU 1/2 dong "l2tp_internet" - bo sung + sua loi ghi nham dong khi co nhieu WAN, xem missing-evidence.md) | 4 |
| 24 | Internet > Dynamic Routing | rip | co | co | co (desktop+980+Apply that) | 4 |
| 25 | Internet > Multicast > Multicast Mode | multicastmode | co | co | co (desktop+980+Apply that) | 4 |
| 26 | Internet > Multicast > IGMP | igmp | co | co | co (desktop+980+Apply that) | 4 |
| 27 | Internet > Multicast > MLD | mld | co | co | co (desktop+980+Apply that) | 4 |
| 28 | Internet > Multicast > Basic | multicastbasic | co | co | co (desktop+980+Apply that) | 4 |
| 29 | Internet > Multicast > Multicast on Wi-Fi | IgmpWLANCONF | co | co | co (desktop+980+Apply that+sim) | 4 |
| 30 | Internet > Port Locating | portlocate | co | co | co (desktop+980+Apply that) | 4 |
| 31 | Internet > PON Information > LOID | ponLoid | co | co | co (desktop+980+Apply that) | 4 |
| 32 | Internet > PON Information > SN | ponSn | co | co | co (desktop+980+Apply that) | 4 |
| 33 | Local Network > Status | localNetStatus | co | co | co (desktop+980, muc4: 1/5 qua quan he WLAN + 4/5 theo chinh sach telemetry) | 4 |
| 34 | Local Network > WLAN > WLAN Basic | wlanBasic | co | co | co (desktop+980+Apply that) | 4 |
| 35 | Local Network > WLAN > WLAN Advanced | wlanAdvanced | co | co | co (desktop+980+Apply that) | 4 |
| 36 | Local Network > WLAN > WPS | wps | co | co | co (desktop+980+Apply that) | 4 |
| 37 | Local Network > WLAN > Surrounding WiFi | wlanStaScanAP | co | co | co (desktop+980, muc4 theo chinh sach telemetry) | 4 |
| 38 | Local Network > WLAN > WLAN Band Steering | wifibandsteer | co | co | co (desktop+980+Apply that) | 4 |
| 39 | Local Network > WLAN > MLO | WLANMLO | co | co | co (desktop+980+Apply that) | 4 |
| 40 | Local Network > WLAN > Mesh Wi-Fi | smNetSphereMAP | co | co | co (desktop+980+Apply that) | 4 |
| 41 | Local Network > LAN > IPv4 | lanMgrIpv4 | co | co | co (desktop+980+Apply/Delete that, 2026-08-06: DHCP Binding+Port Control) | 4 (5 truong ma hoa DHCP Server la ngoai le da biet, khong chan len muc 4) |
| 42 | Local Network > LAN > IPv6 | lanMgrIpv6 | co | co | co (desktop+980+Apply that) | 4 |
| 43 | Local Network > Routing > IPv4 | routeIpv4 | co | co | co (desktop+980+Apply/Delete that, 2026-08-06) | 4 |
| 44 | Local Network > Routing > IPv6 | routeIpv6 | co | co | co (desktop+980+Apply/Delete that, 2026-08-06) | 4 |
| 45 | Local Network > FTP | ftp | co | co | co (desktop+980+apply) | 4 |
| 46 | Local Network > UPnP | upnp | co | co | co (desktop+980+apply) | 4 |
| 47 | Local Network > BPDU | bpdu | co | co | co (desktop+980+apply) | 4 |
| 48 | Local Network > DMS/DLNA | dms | co | co | co (2026-08-07: anh Huynn chup HAR dms-querydir.har, bo sung dms_querydir_lua.lua, khop dung byte tren sandbox) | 4 |
| 49 | Local Network > Samba Service | samba | co | co | co (desktop+980+apply) | 4 |
| 50 | Local Network > DNS | dns | co | co | co (desktop+980+Apply/Delete that, 2026-08-06: Host Name) | 4 |
| 51 | Local Network > USB | usbfunccfg | co | co | co (desktop+980+apply) | 4 |
| 52 | VoIP > Status | voipStatus | co | co | co (desktop+980+cross-page song) | 4 |
| 53 | VoIP > Basic | voipBasic | co | co | co (desktop+980, SIP Account rong bi chan) | 3 |
| 54 | VoIP > VoIP Services | voipServices | co | co | co (desktop+980+apply) | 4 |
| 55 | VoIP > Network Interface | sipIf | co | co | co (desktop+980+apply) | 4 |
| 56 | VoIP > Advanced | sipAdvanced | co | co | co (desktop+980+apply) | 4 |
| 57 | VoIP > SIP Protocol | sip | co | co | co (desktop+980+apply) | 4 |
| 58 | VoIP > Digital Map | sipDigitmap | co | co | co (desktop+980+apply) | 4 |
| 59 | VoIP > Media | sipMedia | co | co | co (desktop+980+apply) | 4 |
| 60 | VoIP > SLIC configuration | sipslc | co | co | co (desktop+980+apply) | 4 |
| 61 | VoIP > Caller ID | sipCallerID | co | co | co (desktop+980+apply) | 4 |
| 62 | VoIP > FAX | fax | co | co | co (desktop+980+apply) | 4 |
| 63 | VoIP > QoS | voipqos | co | co | co (desktop+980+apply) | 4 |
| 64 | Management & Diagnosis > Status | statusMgr | co | co | co (desktop+980+cross-page song) | 4 |
| 65 | Management & Diagnosis > System Management > Device Management | rebootAndReset | co | co | co (desktop+980, BO QUA co chu dinh - Reboot/Reset) | 3 |
| 66 | Management & Diagnosis > System Management > Software Upgrade | firmwareUpgr | co | co | co (desktop+980, BO QUA co chu dinh - upload firmware) | 3 |
| 67 | Management & Diagnosis > System Management > User Configuration Management | usrCfgMgr | co | co | co (desktop+980, BO QUA co chu dinh - restore config) | 3 |
| 68 | Management & Diagnosis > Account Management | accountMgr | co | co | co (desktop+980, BO QUA co chu dinh - doi mat khau) | 3 |
| 69 | Management & Diagnosis > Log Management | logMgr | co | co | co (2026-08-07: anh Huynn chup HAR logmgr-downloads.har, bo sung updownload_prevent_ctl.lua + do_download_syslog.lua/do_download_wifilog.lua, khop dung byte tren sandbox) | 4 (do_download_seclog.lua rieng VAN CHUA co bang chung — khong chan muc 4 vi Security Log Download chi 1/nhieu chuc nang cua trang, xem missing-evidence.md) |
| 70 | Management & Diagnosis > Diagnosis > Network Diagnosis | networkDiag | co | co | co (desktop+980, cong cu chu dong khong lien quan config) | 3 |
| 71 | Management & Diagnosis > Diagnosis > Mirror Configuration | mirror | co | co | co (desktop+980, Destination rong bi chan) | 3 |
| 72 | Management & Diagnosis > Diagnosis > Loopback Detection | loopbackDetect | co | co | co (desktop+980+apply) | 4 |
| 73 | Management & Diagnosis > Diagnosis > ARP Table | arpTable | co | co | co (desktop+980, muc4 theo chinh sach telemetry) | 4 |
| 74 | Management & Diagnosis > Diagnosis > MAC Table | macTable | co | co | co (desktop+980, muc4 theo chinh sach telemetry) | 4 |
| 75 | Management & Diagnosis > IPv6 Switch | IPv6SwitchMgr | co | co | co (desktop+980+Apply that CO REBOOT thiet bi, 2026-08-06, anh Huynn tu xac nhan) | 4 |
| 76 | Management & Diagnosis > Uplink Mode Switch | Ethconfig | co | co | co (desktop+980, BO QUA co chu dinh - chuyen WAN vat ly) | 3 |
| 77 | Management & Diagnosis > Energy Conservation > Energy Mode | EnergyMode | co | co | co (desktop+980+Apply that) | 4 |

Tong: 77 trang - reference 77 - da dung 77 - dat muc 4: 68, muc 3: 9, muc 1: 0 (xem muc NHOM TELEMETRY/CHINH SACH, NHOM INTERNET > SECURITY (HOAN TAT), INTERNET LEFTOVERS va muc 2026-08-07 (VA LO HONG QUET) cuoi file)

Phan bo theo muc: muc 1: 0, muc 2: 0, muc 3: 9, muc 4: 68

NT-3 (kho hep 980px) da hoan tat cho toan bo 75/75 trang co the dieu huong toi
(2 trang con lai o muc 1 la Home/Topology, khong thuoc pham vi NT-3 vi khong
phai trang cau hinh dang bang/form).

**Dang thu bang chung Apply/POST (muc 4), trang-theo-trang.** Da len muc 4:
EnergyMode, SNTP, Port Binding, RIP, Multicast Mode, IGMP, MLD, Multicast
Basic, Multicast on Wi-Fi, Port Locating, PON LOID, PON SN, Firewall,
Filter Criteria, ALG, ethWanConfig, Wan3gConfig, wlanBasic, wlanAdvanced,
wps, wifibandsteer, WLANMLO, smNetSphereMAP, lanMgrIpv6. **Nhom Internet
VA nhom Local Network > WLAN (8 route) coi nhu xong toan bo phan
Apply/POST chinh. lanMgrIpv6 (LAN > IPv6) cung xong day du; lanMgrIpv4
con thieu 5 truong ma hoa (DHCPBasicCfg) — xem chi tiet o duoi. Routing
(IPv4/IPv6) DA KIEM XONG nhung khong co gi de test an toan (Default
Routing bi chan client-side, Routing Table chi doc, Static Routing rong)
— giu muc 3. Buoc tiep la dich vu mang.** Trong qua trinh nay da tim ra
va sua 7 lop loi/bien the kien truc dung chung cho TOAN BO du an (khong
phai lam lai cho tung trang):
1. Token session tinh (index.html + tung views/*.html) chan MOI Apply/POST
   tren MOI trang — da sua (missing-evidence.md ban 19).
2. Dinh dang response GHI KHONG co quy tac chung — moi dataTag co the tu
   dinh dang rieng, chon qua `dataTags[tag]["ghiDangKieu"]` du lieu (3
   dang XML da biet: `day_du`, `rut_gon`, `xac_nhan_trong`). Rieng dang
   `xac_nhan_trong` co truong con `instidentity` = `"echo"` (mac dinh)
   hoac `"rong"` (luon rong bat ke gui gi) — KHONG co quy tac chung, moi
   dataTag can bang chung rieng (missing-evidence.md ban 20-23). Thu tu
   the header trong cung 1 dang KHONG quan trong (da xac nhan voi anh
   Huynn, ban 23).
3. dataTag KIEU JSON (luu trong `jsonDataTags`, vi du `multicast_model.lua`)
   truoc day KHONG co duong ghi (Apply se am tham khong ghi duoc gi) — da
   them `doi_tuong_json_cua()`/`ghi_json()`/`json_ghi_thanhcong()` +
   nhanh re trong `dispatch.py` (missing-evidence.md ban 23).
4. Dang `rut_gon` co bien the MO RONG (`wan_internet_lua.lua`) voi cac the
   khong chuan sau `_InstID` (`wantype`, `Status`, `encode`-hint) — them
   truong con `theThemSauRutGon` de chen nguyen van, chi dat khi co bang
   chung rieng.
5. `INSTIDENTITY` cua dang `xac_nhan_trong` co the echo 1 truong KHAC
   `_InstID` top-level (vd `_InstID_2` trong form nhieu radio) — them
   `instidentity = "tu_truong:<ten_truong>"`. Va phat hien dang response
   GHI thu 5 hoan toan moi: `day_du_gioi_han` (header kieu day_du nhung
   CHI echo 1 danh sach object CHI DINH qua `doiTuongGhiRieng`, co the
   khac object cua chinh dataTag — vd `wlan_wlanbasicadconf_lua.lua` echo
   `OBJ_WLANMLO_ID`).
6. Dang response GHI thu 6: `day_du_co_instidentity` (header kieu
   rut_gon/xac_nhan_trong — INSTIDENTITY dau, KHONG `_InstID` — nhung CO
   du lieu object DAY DU nhu GET; `wlan_wps_lua.lua`). Nhan tien phat hien
   va SUA TAN GOC mot loai kien truc XML rieng: mot so object (vd
   `OBJ_WPS_ID`) phat NHIEU khoi `<OBJ_X_ID>` XML rieng biet trung ten tag
   (moi khoi 1 Instance) THAY VI 1 khoi boc nhieu Instance — them co gio
   `objects[ten]["bocRiengTungInstance"]` trong state, sua
   `config_store._sinh_khoi_obj()` ho tro ca 2 dang. Voi nhanh Apply, object
   co co gio nay con duoc LOC chi echo 1 instance khop INSTIDENTITY (khac
   GET tra du tat ca).
7. Dang response GHI thu 7: `day_du_co_instidentity_va_instid` (CO CA
   `<INSTIDENTITY>` + `<_InstID>` + du lieu object day du cung luc;
   `dhcp6s_dhcpserver_lua.lua`). Cung phat hien 1 dataTag CHUA TUNG duoc
   mo hinh hoa (`radhcp6s_portctrl_lua.lua`, LAN > IPv6 > Port Control) —
   da them moi hoan toan tu bang chung GET+POST that (khong bia). Va xac
   nhan lai: response Apply THAT cua trang co truong ma hoa
   (`Localnet_LanMgrIpv4_DHCPBasicCfg_lua.lua`) CO the `<encode>` giong GET
   — ap dung lai quyet dinh AN TOAN da lap truoc do (khong sinh the do
   trong sim de tranh loi "Malformed UTF-8 data"), nen 5 truong ma hoa cua
   trang nay van o muc 3.

Cac trang da thu nhung CHUA len duoc muc 4 (khong co gi bi ghi tren thiet
bi that, an toan): loopbackDetect (truong tinh toan JS khong kich hoat
dung), mirror (truong bat buoc dang rong). ddns da thu Apply THAT
(2026-08-06) nhung bi SERVER TU CHOI (IF_ERRORID=-257, can tai khoan
DynDNS that). localServiceCtrl, DMZ, Port Forwarding, Port Trigger, DSLite
(tunnel4in6Config), L2TP (l2tpConfig), Parental Controls (parentCtrl) DA
LEN MUC 4 (2026-08-06) qua tu lai thiet bi that — xem muc "NHOM INTERNET >
SECURITY (HOAN TAT)" va "INTERNET LEFTOVERS" cuoi file. Chi tiet tung
truong hop: missing-evidence.md.

Ma loi `-1452` "This page has expired" — dang loi RIENG cho token
cu/khong hop le, khac `SessionTimeout`. Gap 2 lan (ethWanConfig,
Wan3gConfig) khi Apply lien tiep 2 trang ma khong tai lai `/` — xu ly
dung theo quy trinh da biet (tai lai roi thu lai). Xem missing-evidence.md.

Phat hien phu chua co bang chung that: sess_token xoay sau moi lan ghi,
client khong tu dong bo — LUON tai lai trang truoc khi thu Apply o mot
trang MOI. Xem missing-evidence.md ban 21.

Da kiem tra lai nghi van "Apply LOID lam dang xuat phien": dang nhap
lai, thu them 3 lan Apply lien tiep deu SUCCESS, phien khong bi dang
xuat. BAC BO gia thuyet nay — lan dau chi la token cu/stale, khong phai
hanh vi that cua dataTag. Xem missing-evidence.md.

Nhom dich vu mang (FTP/UPnP/BPDU/DMS/Samba/DNS/USB) DA HOAN TAT Apply/POST.
FTP/UPnP/BPDU/DMS/Samba/USB len muc 4; DNS con "mot phan" (section Host Name
la danh sach rong, khong test duoc). Phat hien moi: instidentity="rong" that
lan dau (Samba_lua.lua) — INSTIDENTITY luon rong bat ke co _InstID/_InstID_0
hay khong.

Nhom VoIP (12 trang) DA HOAN TAT Apply/POST — 10/12 len muc 4. voipStatus
khong ap dung (chi doc). voipBasic khong test duoc (SIP Account rong bi
chan client-side, an toan). Phat hien them 3 truong hop instidentity dang
tu_truong:<truong khac _InstID> (voipServices/_InstIDVP, sip/_InstIDBEARINFO,
sipCallerID/_InstID_CIDSIP) va 1 truong hop dac biet o sipMedia (echo truong
DAU trong danh sach _InstID_<codec>, khac mau "echo truong cuoi" da thay o
noi khac). Khong co dang response GHI hoan toan moi.

Nhom Management & Diagnosis (14 trang) DA HOAN TAT — CHIEN DICH APPLY/POST
MUC 4 COI NHU KET THUC trong pham vi co the test an toan tu xa. logMgr va
loopbackDetect len muc 4. 5 trang BO QUA CO CHU DINH theo quyet dinh anh
Huynn (hoi truoc khi lam) vi hanh dong nguy hiem tren thiet bi that dang
hoat dong: rebootAndReset (Reboot/Factory Reset), firmwareUpgr (upload
firmware), usrCfgMgr (restore config), accountMgr (doi mat khau admin),
Ethconfig (chuyen che do WAN vat ly). IPv6SwitchMgr bo qua rieng vi client
chan resubmit gia tri khong doi (can doi that moi kich hoat duoc). statusMgr/
arpTable/macTable khong ap dung (chi doc). networkDiag/mirror khong test
duoc an toan (cong cu chu dong / truong bat buoc rong). Phat hien dang
response GHI moi: log_syslogmgr2_lua.lua dung "day_du_co_instidentity" voi
co che moi "truongGhiRieng" (gioi han truong echo rieng cho Apply, khac
paraOrder GET) — da them vao config_store.py.

TONG KET CHIEN DICH: 42/77 trang dat muc 4 (dinh chinh so dem — xem muc RA SOAT
TOAN BO cuoi file). So con lai o muc 3 gom: cac
truong ma hoa chua giai duoc (lanMgrIpv4 DHCP), danh sach rong khong co
instance that (nhieu trang), truong bat buoc rong bi chan client-side an
toan (Routing, voipBasic, mirror), va 5+1 trang nguy hiem/dac biet bo qua
co chu dinh trong nhom Management & Diagnosis. Neu muon nang them, can anh
Huynn cung cap them du lieu that (VD: bam Apply LAN that o Routing, cau
hinh SIP that o VoIP Basic, hoac tu ghi HAR cho 5 trang nguy hiem tren may
test rieng). (Con thieu, khong chan duong: SSID2-12 va
5GHz/6GHz cua WLAN Global Configuration trong wlanBasic — du kien dung
chung dataTag/dang da biet; 5 truong ma hoa cua lanMgrIpv4 DHCP Server —
cho anh Huynn cung cap bang chung khoa giai ma neu muon len muc 4 hoan
toan. Routing (IPv4/IPv6) DA KIEM XONG — khong co gi Apply-test an toan
duoc, ca 2 giu muc 3, xem missing-evidence.md.)

## RA SOAT TOAN BO 77 TRANG (2026-08-05, sau khi chien dich xong)

Theo yeu cau anh Huynn "Ra lai toan bo 77 trang bang verify_page.py". Ghi
chu: tools/verify_page.py o goc repo LA CUA THIET BI KHAC (vigor2927,
dung render.py + menu-tree.json schema "nodes") — chay thu bi loi
KeyError: 'nodes', KHONG tuong thich voi kien truc be12000
(server.py/dispatch.py/config_store.py). Da bao anh Huynn va chuyen sang
bo doi chieu rieng cho be12000 gom 2 buoc:

1. **Quet GET toan bo dataTag**: goi GET cho ca 121 dataTag trong
   factory.json tren sim that (dang nhap dung quy trinh admin/admin —
   day la tai khoan MAC DINH cua BAN GIA LAP, khong phai thiet bi that).
   Ket qua: 121/121 tra ve dung dinh dang (JSON hoac XML), khong loi.

2. **Quet lai Apply/POST bang "golden replay"**: doi chieu TOAN BO 56 file
   bang chung *-apply.that.post.json trong reference/vantay/ — gui lai
   dung reqBody da ghi trong bang chung, dang nhap that (khong bo qua
   buoc dang nhap nhu lan quet dau — lan dau bi bao loi "SessionTimeout"
   hang loat vi thieu buoc POST login_entry that su). So sanh theo
   TAP HOP the+gia tri (khong phan biet thu tu the anh em — dung chinh
   sach da xac nhan voi anh Huynn ngay 2026-08-05 ve thu tu the header
   khong anh huong toi client vi jQuery tim theo ten the).

   Ket qua lan cuoi: OK-exact 49, OK-tagset 2 (IgmpWLANCONF, WlanMLO —
   chi khac khoang trang JSON, khong phai loi), MISMATCH 5, ERROR 0.

   **2 loi THAT phat hien va da sua:**
   - `rip_lua.lua` (Dynamic Routing): thieu `"instidentity": "rong"`
     trong factory.json — bang chung RIP-apply.that.post.json cho thay
     INSTIDENTITY luon rong du co gui _InstID=IGD. Da them.
   - `wlan_wps_lua.lua` (WPS 5GHz): config_store.py ham `_sinh_khoi_obj`
     nhanh `bocRiengTungInstance` truoc day echo CA HAI instance trung
     `_InstID` (dung cho GET, NVRAM co 2 ban ghi DEV.WIFI.AP5.WPS trung
     nhau that), nhung bang chung Apply that (WPS-WlanWps5G-apply.that
     .post.json) cho thay Apply CHI echo 1 instance. Da sua thanh cat
     `[:1]` — CHI cho nhanh Apply/GHI, KHONG doi hanh vi GET.

   **3 "mismatch" con lai KHONG phai loi** (da xac minh tung cai):
   - `LanMgrIpv4-DHCPBasicCfg-apply...json`: sai khac o gia tri ma hoa
     placeholder (`<encode>` khong duoc tai tao that — chinh sach da co
     tu truoc, khong doan ma hoa that).
   - `LoopbackDetectBasic-apply...json` va `MirroManag-apply...json`
     (x2): la file bang chung CU tu phien truoc, chup lai mot LAN THAT
     BAI/loi phien (IF_ERRORID am, FAIL) — khong dung lam "bang chung
     dung" de doi chieu voi mot lan Apply THANH CONG. Khong sua gi.
   - `LanMgrIpv6-PortControl-apply...json`: file bang chung nay KHONG co
     truong `reqBody` (chi co `getRespBodySample` + `respBody`), nen phep
     doi chieu tu dong gui request RONG — day la lo hong cua CACH DOI
     CHIEU, khong phai loi cau hinh. Cau hinh hien tai
     (`instidentity: tu_truong:_InstID_11`) dung theo dung ghiChu ghi
     ngay trong chinh file bang chung do.

3. **Tong hop route-inventory.json**: 77 trang — muc 1: 2 (Home,
   Topology — trang tinh, chua co evidence GET dong), muc 3: 33, muc 4:
   42. (Con so "43/77" ghi truoc day trong file nay la DEM NHAM — da
   dinh chinh lai thanh 42 sau khi doi chieu truc tiep voi
   route-inventory.json.)

Sua 2 loi that (RIP, WPS-5G) khong doi muc (ca 2 da muc 4 tu truoc, chi la
sua cho dung byte), da commit rieng.

## RA SOAT LAN 2 (2026-08-05) — theo yeu cau anh Huynn "ra lai xem co trang
## nao bi gan muc 3 sai"

Kiem tra: cac trang CHI DOC (khong co nut Apply) co dang bi gan "muc 3" oan
khong, du kien truc DA dam bao doc/ghi qua MOT kho cau hinh duy nhat (rule
2.5). Ly luan: neu trang trang thai B doc CUNG mot object voi mot trang cau
hinh A DA duoc xac nhan muc 4 (Apply that dung), thi VE MAT KIEN TRUC, sua o
A chac chan phan anh sang B (ca hai deu doc/ghi qua self._state dung chung
trong config_store.py). Khong dung ly luan suong — kiem tra tung cap object
qua factory.json, roi lam TEST SONG tren sim de xac nhan truoc khi doi muc.

**2 trang xac nhan va nang len muc 4** (co bang chung song, khong doan):
- `ethWanStatus` (wan_internetstatus_lua.lua) chia se object
  `ID_WAN_COMFIG` voi `ethWanConfig` (wan_internet_lua.lua, da muc 4). Test:
  Apply `WANCName=TEST_CROSSPAGE_MARKER_123` tren ethWanConfig -> GET lai
  ethWanStatus thay gia tri moi ngay lap tuc. Dat dung dinh nghia muc 4
  ("sua o trang A thi trang B doi theo").
- `voipStatus` (voipRegStatus_lua.lua) chia se object `OBJ_VOIPSIPLINE_ID`/
  `OBJ_VOIPVPLINE_ID` voi `voipServices` (voip_voipbasic_lua.lua, da muc 4).
  Test: Apply `AuthUserName=TESTVOIP_MARKER_9` tren voipServices -> GET lai
  voipStatus thay gia tri moi ngay lap tuc. Dat muc 4.

**Cac trang con lai KHONG nang muc, vi khong co bang chung tuong tu** (can
anh Huynn quyet dinh neu muon xu ly tiep, xem chi tiet duoi day thay vi
doan):
- `ponopticalinfo`, `statusMgr`, `arpTable`, `macTable`,
  `firewall_conntrack (conntracks)`: telemetry/trang thai phan cung thuan
  (quang PON, CPU/uptime, bang ARP/MAC, so ket noi NAT) — KHONG co trang
  cau hinh nao trong ban gia lap ghi vao cung object, nen khong co "trang A"
  de kiem "sua A doi B". Kien truc van dam bao doc qua kho cau hinh chung
  (khong hardcode), nhung ban than khai niem "trang thai" trong dinh nghia
  muc 4 (CLAUDE.md muc 1) kho ap dung ro rang cho du lieu thuan telemetry
  nay — can anh Huynn xac nhan co tinh la "muc 4 mac dinh" hay giu muc 3.
- `l2tpStatus` dung CHUNG dataTag `l2tp_lua.lua` voi `l2tpConfig`, nhung
  ban than l2tpConfig con o muc 3 ("bi chan client-side", CHUA duoc Apply-
  test that su) nen khong the dan chieu "A da xac nhan muc 4" — can bang
  chung Apply that cho l2tpConfig truoc.
- `Wan3gStatus` (wwan_mobile_status_lua.lua/wan_3g_status_lua.lua) va
  `tunnel4in6Status`: KHONG tim thay object trung voi Wan3gConfig/
  tunnel4in6Config trong factory.json — co the 2 nhom du lieu nay tach
  biet that su (status doc tu dongle/tunnel runtime state, khong phai
  cau hinh nguoi dung sua duoc), can kiem lai rieng neu muon ket luan.
- `localNetStatus` la bundle 5 dataTag; chi 1/5 (`wlan_wlanstatus_lua.lua`)
  co object trung voi mot trang da muc 4 (`wlan_wlanbasiconoff_lua.lua`,
  object `OBJ_WLANSETTING_ID`), 4 dataTag con lai (PON port status, WLAN
  client stat, LAN device list, USB device list) la telemetry thuan —
  khong nang muc ca trang vi phan lon du lieu khong co "trang A" tuong ung.

Da cap nhat route-inventory.json (level ethWanStatus/voipStatus = 4, kem
ghi chu bang chung song) va bang STATUS.md. Tong sau ra soat lan 2:
**44/77 dat muc 4** (muc 1: 2, muc 3: 31, muc 4: 44).

## DUNG HOME + TOPOLOGY (2026-08-06)

Anh Huynn khoi dong chay_server.bat + chay_thu_van_tay.bat, yeu cau tiep
tuc BE12000. Hai trang con lai o muc 1 (Home, Topology) THUC RA da duoc
"dung" tu phien truoc (src/views/*.html, factory.json co san
OBJ_FWLEVEL_ID/OBJ_ACCESSDEV_ID/OBJ_WLANRADIO_ID voi du lieu nguon that)
nhung chua tung chay doi chieu DOM — muc "1" trong bang la loi ghi so tu
truoc, khong phai chua lam gi.

Da dung Claude in Chrome (co ket noi trinh duyet that tren may anh Huynn)
chup dau van tay DOM tools/van_tay_dom.js tren CA thiet bi that
(192.168.1.1) va ban gia lap (localhost:8098), chay tools/so_dom.py doi
chieu:

- **homePage**: 76/76 phan tu khop. 5 phan tu "thua" + 1 lech toa do CHI
  la hang WLAN Device List dang co du lieu mau (factory.json) trong khi
  thiet bi that hien khong co thiet bi nao ket noi — du lieu song, khac
  thoi diem chup, cung tien le CPU/uptime/conntrack da ghi truoc do.
  Xac nhan **muc 4** bang test song: Apply Level=Low tren
  firewall_config_lua.lua (da muc 4 tu truoc) -> GET lai
  firewall_homepage_lua.lua (dung tren Home) phan anh ngay Level moi (2
  dataTag dung chung object OBJ_FWLEVEL_ID). Da khoi phuc Level=Middle
  sau test.
- **mmTopology**: LAN DAU chay so_dom phat hien 29 truong hidden (so
  thiet bi LAN/2.4G/5G/6G o 7 vi tri master/slave) bi RONG thay vi "0"
  nhu thiet bi that — nguyen nhan: factory.json's topo_lua.lua truoc day
  HOAN TOAN RONG (`objects: []`), khien trang JS (ham dealAD()) khong
  nhan duoc `data.ad.MGET_INST_NUM` dung dinh dang nen khong chay duoc
  vong lap gan gia tri "0" mac dinh. Da sua bang 1 co che MOI:
  - `config_store.py`: them nhanh `"json_tho"` (dinh_dang) + ham
    `json_tho_cho()` — JSON THO, KHONG boc trong khuon
    `{IF_ERRORID,...}` cua `json_cho()` (khac WLANMLO), vi bang chung
    that (`reference/source/data/topo_lua.lua`) cho thay dinh dang rieng
    `{"slave":[],"master":{...9 truong...},"ad":{"MGET_INST_NUM":0}}`.
  - `factory.json`: them khoa moi `jsonThoDataTags.topo_lua.lua` voi
    NGUYEN VAN noi dung that (MacAddr da sanitize san thanh
    `aa:bb:cc:00:00:02`, trung placeholder da dung cho ethWanStatus).
  - `dispatch.py`: them nhanh goi `json_tho_cho()` trong `menu_data_doc`.
  - Phat hien PHU (loi thoi diem thu 2): `_hop_nhat_factory()` — co che
    tu dong bo sung dataTag/object moi tu factory.json vao
    state/instance-01.json khi khoi dong server — CHUA biet nhanh
    `jsonThoDataTags` moi them, nen lan restart dau KHONG nhan duoc thay
    doi. Da sua them nhanh dong bo `jsonThoDataTags` trong
    `_hop_nhat_factory()`, restart lan 2 moi dung.
  - Sau sua: so_dom **315/315 KHOP TUYET DOI** (0 thieu/thua/lech toa do).
  - **KHONG nang len muc 4**: topo_lua.lua la du lieu nhan dang mesh
    (instID/MacAddr/AssocTime), khong co trang cau hinh nao ghi vao cung
    du lieu de kiem "sua A doi B" — cung nhom voi arpTable/macTable/
    statusMgr da neu o lan ra soat truoc, giu **muc 3**, cho anh Huynn
    quyet dinh chinh sach neu muon xu ly tiep.

Chua verify duoc kho hep (~980px) cho ca 2 trang: cong cu `resize_window`
cua trinh duyet khong tac dung trong phien nay (cua so giu nguyen 1536px
du goi resize nhieu lan) — ghi vao missing-evidence.md, khong chan viec
danh gia muc 3/4 (da co bang chung o kho desktop).

Tong sau khi dung xong Home + Topology: **45/77 dat muc 4, 32 muc 3, 0
muc 1** — khong con trang nao o muc 1 trong toan bo 77 trang.
Da commit: sua config_store.py/dispatch.py (nhanh json_tho + dong bo
_hop_nhat_factory), factory.json (jsonThoDataTags.topo_lua.lua),
route-inventory.json, STATUS.md.

## NHOM TELEMETRY/CHINH SACH (2026-08-06)

Anh Huynn yeu cau lam het 27 trang muc 3 con lai (tru 5 trang nguy hiem
van giu quyet dinh bo qua co chu dinh nhu cu). Chon bat dau tu nhom
telemetry/chinh sach (11 trang, khong can anh Huynn thao tac tren thiet
bi). Da ra soat CO HE THONG doi tuong (object) dung chung giua 11 trang
nay va TOAN BO cac trang da muc 4, phat hien them 1 truong hop moi (ngoai
ethWanStatus/voipStatus da xac nhan truoc):

- **statusMgr** chia se object `OBJ_SN_INFO_ID` voi `poninfo_sn_lua.lua`
  (PON Information > SN, da muc 4). Test song: Apply Sn=TESTSN9988 tren
  trang SN -> GET lai statusMgr phan anh ngay OBJ_SN_INFO_ID.Sn moi (luu
  y: KHONG phai truong "Device Serial No." hien thi tren man hinh — do la
  OBJ_DEVINFO_ID rieng — nhung du lieu OBJ_SN_INFO_ID van chia se qua kho
  cau hinh chung, dung dinh nghia muc 4). Da khoi phuc Sn=ZTEGFAKE0000 sau
  test. **Nang len muc 4.**

10 trang con lai trong nhom KHONG tim thay quan he ghi-doc voi trang nao
da muc 4 (hoac co nhung trang ghi cung du lieu ban than cung dang o muc 3,
khong dung lam bang chung duoc):
- **Khong co trang ghi tuong ung nao (telemetry thuan)**: mmTopology,
  ponopticalinfo, Wan3gStatus, tunnel4in6Status, conntracks, wlanStaScanAP,
  arpTable, macTable.
- **l2tpStatus**: dung CHUNG dataTag voi l2tpConfig, nhung l2tpConfig ban
  than con muc 3 (chua Apply-test duoc) nen khong dung lam bang chung.
- **localNetStatus**: bundle 5 dataTag, CHI 1/5 (wlan_wlanstatus_lua.lua,
  qua OBJ_WLANAP_ID/OBJ_WLANSETTING_ID) co quan he voi nhieu trang WLAN da
  muc 4 — nhung 4/5 con lai (PON port status, WLAN client stat, LAN device
  list, USB device list) la telemetry thuan, khong co trang ghi tuong ung.
  Chua nang muc ca trang vi chi dung mot phan du lieu co the kiem duoc.

**Cau hoi chinh sach can anh Huynn quyet dinh** (khong the tu quyet vi day
la lua chon dinh nghia, khong phai thieu bang chung ky thuat): voi cac
trang/phan-trang telemetry thuan khong co "trang A" nao ghi vao de kiem
"sua A doi B" — coi la DA DAT muc 4 mac dinh (vi kien truc da dam bao doc
qua kho cau hinh chung, khong hardcode — dung tinh than rule 2.5), hay GIU
NGUYEN muc 3 vi khong co gi de kiem tra "trang thai" theo dung nghia?

Da cap nhat: statusMgr len muc 4 trong route-inventory.json + STATUS.md.
Tong sau buoc nay: **46/77 muc 4, 31 muc 3**.

### QUYET DINH CHINH SACH (2026-08-06, xac nhan voi anh Huynn)

Anh Huynn chon: **trang/phan-trang telemetry thuan (khong co trang cau
hinh nao ghi cung du lieu) duoc TINH LA MUC 4 mac dinh.** Ap dung ngay
cho 9 trang: mmTopology, ponopticalinfo, Wan3gStatus, tunnel4in6Status,
conntracks, wlanStaScanAP, arpTable, macTable, localNetStatus (4/5 dataTag
telemetry + 1/5 qua quan he WLAN da xac nhan kien truc). Da cap nhat
route-inventory.json + bang STATUS.md o tren.

**KHONG ap dung** cho l2tpStatus — khac voi nhom telemetry thuan, trang
nay CO trang ghi tuong ung (l2tpConfig) nhung ban than l2tpConfig con o
muc 3 (chua Apply-test duoc, bi chan client-side). Day la truong hop
"cho du lieu that", khong phai "khong co gi de kiem" — giu muc 3 cho den
khi l2tpConfig len duoc muc 4.

Tong sau khi ap dung chinh sach: **55/77 muc 4, 22 muc 3**.

Con 22 trang muc 3, chia 3 nhom:
- 5 trang nguy hiem BO QUA CO CHU DINH (giu quyet dinh cu, anh Huynn da
  xac nhan lai): rebootAndReset, firmwareUpgr, usrCfgMgr, accountMgr,
  Ethconfig.
- 1 trang tuong tu bi chan client-side khong lien quan config (IPv6
  SwitchMgr — resubmit gia tri khong doi bi JS chan), 2 trang cong cu
  chu dong khong ap dung kieu Apply nay (networkDiag, mirror).
- 14 trang can anh Huynn tu tay tao du lieu that tren thiet bi (danh sach
  rong hoac truong bat buoc rong bi chan client-side) de em ghi HAR Apply:
  tunnel4in6Config, l2tpConfig, l2tpStatus (an theo l2tpConfig),
  localServiceCtrl, dmz, portForwarding, portTrigger, parentCtrl, ddns,
  lanMgrIpv4 (con truong ma hoa), routeIpv4, routeIpv6, dns (mot phan),
  voipBasic.

## NHOM INTERNET > SECURITY (TIEP) — Local Service Control (2026-08-06)

Anh Huynn cho phep em TU LAI (self-drive) trinh duyet tren thiet bi that
de tao du lieu test cho 10/14 trang "can du lieu that" (khong phai 5 trang
nguy hiem), tu revert lai sau moi lan test; rieng DDNS/VoIP Basic dung gia
tri gia vi khong co tai khoan that. Bat dau voi nhom Internet > Security:
Local Service Control (4 trang trong phien nay, gom ca IPv4/IPv6/Remote
Port cua 1 route `localServiceCtrl`).

**Bang chung moi thu duoc (tu XHR-capture tren 192.168.1.1, luu
reference/vantay/):**
- `LocalServiceCtrl-apply.that.post.json` / `-delete.that.post.json`:
  Service Control IPv4 (`firewall_ipv4service_lua.lua`, object
  `OBJ_FWSC_ID`) — bam "Create New Item", gui `_InstID=-1`, thiet bi that
  TU SINH `_InstID` dang `IGD.FWSc.FWSC<n>` (vd `FWSC1` khi danh sach
  rong). Xoa gui `_InstID` that + `IF_ACTION=Delete`.
- `LocalServiceCtrl-twoinst.that.post.json`: tao 2 rule lien tiep (khong
  xoa rule 1) -> rule 2 nhan `FWSC2`, xac nhan `n` = so instance HIEN CO +
  1 (KHONG phai bo dem doc lap ton tai qua cac lan xoa — chua kiem chung
  truong hop xoa roi tao lai). Phat hien them: gui rong `ServiceList` (vd
  khong tick Service Type nao) bi thiet bi that TU CHOI voi
  `IF_ERRORID=-257`/`"Current operation is invalid, please check
  configuration parameters."` — validate that, khong phai loi giai lap.
- `LocalServiceCtrlV6-apply2.that.post.json` / `-delete.that.post.json`:
  Service Control IPv6 (`firewall_ipv6service_lua.lua`, object
  `OBJ_FWSCv6_ID`) — CUNG tien to `IGD.FWSc.FWSC` (chua ro co dung chung
  bo dem voi IPv4 hay khong, xem missing-evidence.md).
- `RemoteServicePortCtrl-apply2.that.post.json`: Remote Service Port
  Control IPv4 (`firewall_portservice_lua.lua`, object
  `OBJ_FW_SERVPORT_ID`) — KHONG phai kieu them/xoa item, ma la 1 form GUI
  CA 5 dong co san TRONG 1 POST duy nhat (`_InstNum=5`,
  `_InstID_0.._InstID_4`, `ServPort_0..ServPort_4`). Response
  `INSTIDENTITY` = gia tri `_InstID_4` (dong CUOI), khong phai truong
  `_InstID` top-level (luon rong trong request nay).

**Kien truc moi trong config_store.py/dispatch.py** (dung chung duoc cho
Port Forwarding/Port Trigger sau nay, cung nhom Internet > Security):
- `objects[ten]["danhSach"] = {"tienToId": "..."}`: danh dau object KIEU
  DANH SACH co the THEM (`_InstID=-1` -> tu sinh ID)/XOA (`IF_ACTION=
  Delete`) tung item rieng. Ham moi: `tao_instance_moi()`, `xoa_instance()`,
  `ghi_theo_instid()`, `chi_so_theo_instid()`.
- `objects[ten]["danhSachChiSo"] = true`: danh dau object KIEU CHI SO — 1
  POST duy nhat sua NHIEU instance co san qua hau to `_<n>` (khac voi
  danhSach o tren la KHONG co them/xoa, chi sua).
- `config_store.xml_ghi_thanhcong()` them tham so `ghi_de_dang` (dung dang
  CHI DINH thay vi doc tu `dataTags[tag]["ghiDangKieu"]` tinh) — can thiet
  vi 1 dataTag danh sach co THE dang response KHAC nhau tuy `IF_ACTION`
  (Apply tra `rut_gon`, Delete tra dang MOI `xoa_gon` — header KHONG co
  `INSTIDENTITY`/du lieu, chi co `<_InstID></_InstID>` rong).
- `_hop_nhat_factory()`: them nhanh bo sung KHOA META tuy y cho muc
  "objects" (truoc day chi bo sung duoc "paraOrder"/"instances") — cung ly
  do voi "loi da mac 2026-08-03" da sua cho "dataTags", nay ap dung tiep
  cho "objects" vi `danhSach`/`danhSachChiSo` la khoa MOI can lan truyen
  vao state cu cua nguoi dung.

**Da kiem trong sandbox** (server rieng, state copy tu factory.json, KHONG
dung thiet bi that): replay dung 100% cac request That da capture (login
that + Apply/Delete) — response sinh ra tu code moi KHOP TUYET DOI (byte-
for-byte) voi ca 6 file bang chung, GET sau do phan anh dung du lieu da
ghi (dung dinh nghia muc 4, rule 2.5). Da kiem tra rieng co che
`_hop_nhat_factory()` tren 1 ban sao `instance-01.json` cu (mo phong nguoi
dung khoi dong lai server) — cac khoa moi (`danhSach`, `danhSachChiSo`,
`ghiDangKieu`, `instidentity`, `paraOrder`) deu duoc bo sung dung, khong
mat du lieu nguoi dung cu.

**Da revert thiet bi that** ve dung trang thai ban dau sau tat ca cac lan
test (xoa het rule test IPv4/IPv6, tra 5 port Remote Service ve dung mac
dinh 80/21/22/23/443) — xac nhan lai bang screenshot + reload trang.

**GIA DINH CHUA CO BANG CHUNG RIENG (ghi missing-evidence.md):**
1. Bo dem sinh `_InstID` cho object IPv4 (`OBJ_FWSC_ID`) va IPv6
   (`OBJ_FWSCv6_ID`) co DOC LAP voi nhau hay dung CHUNG 1 khong gian ID —
   code hien tai gia dinh DOC LAP (moi object tu dem instance cua chinh
   no).
2. Sua 1 instance CO SAN trong danh sach (Apply voi `_InstID` THAT, khong
   phai `-1`) — CHUA co bang chung rieng (chi co bang chung tao moi va
   xoa), dang tam dung "rut_gon" theo suy luan hop ly tu cung 1 endpoint.
3. Thu tu `ParaName` that khi GET mot danh sach CO du lieu — thiet bi that
   LUON tra danh sach rong luc chup (chua tung co rule that), nen thu tu
   truong hien dang SUY TU request Apply (reqBody), CHUA xac nhan duoc tu
   chinh response GET that.

`localServiceCtrl` len **muc 4**. Tong: **56/77 dat muc 4, 21 muc 3**.

## NHOM INTERNET > SECURITY (HOAN TAT) — DMZ, Port Forwarding, Port Trigger (2026-08-06)

Tiep tuc tu lai (self-drive) thiet bi that theo cho phep anh Huynn ("lam
tiep di em"), hoan tat 3 trang con lai cua nhom Internet > Security: DMZ,
Port Forwarding, Port Trigger.

**DMZ (`firewall_dmz_lua.lua`, object `OBJ_FWDMZ_ID`)** — bang chung
`DMZ-apply.that.post.json`, `DMZ-disable2.that.post.json`. Object nay
KHONG phai kieu danh sach — CHI CO 1 instance co dinh
(`_InstID=IGD.FWDMZ.FWDMZ1` luon co san trong request, khong bao gio
`-1`), dung dung nhanh `ghi()` don gian co san. Apply that phat hien them
6 truong CHUA tung mo hinh hoa: `sub_TempMacAddr0..5` (dung khi chon muc
tieu theo dia chi MAC thay vi IP — chua co bang chung test nhanh nay, gia
tri luon rong khi chon theo IP). Response dang `rut_gon`.

GIOI HAN phat hien khi revert: bam xoa trang "LAN Host" ve rong (dung
trang thai factory goc) bi CHAN CLIENT-SIDE ("This field is required")
du DMZ da chuyen Off — xac nhan bang cach kiem tra
`window.__xhrCaptured.length === 0` (khong co request nao duoc gui, khong
phai chi la canh bao thi giac). Khong the phuc hoi dung `InternalClient`
rong qua UI ma khong Factory Reset (ngoai pham vi). Da revert ve trang
thai AN TOAN VE CHUC NANG: `Enable=0` (tat DMZ that su) nhung giu lai
`InternalClient=192.168.1.150` thay vi rong nguyen ban — ghi trong
missing-evidence.md.

**Port Forwarding (`firewall_portforwarding_lua.lua`, object
`OBJ_FWPM_ID`)** — bang chung `PortForwarding-apply.that.post.json` (tao
moi, `_InstID=-1` -> server tu sinh `DEV.NAT.PtMapping1`),
`PortForwarding-delete.that.post.json` (xoa, dang `xoa_gon` giong Local
Service Control). Doi tuong KIEU DANH SACH chuan, dung dung co che
`danhSach` da co san (`tienToId: "DEV.NAT.PtMapping"`, ten truong ID mac
dinh `_InstID`) — KHONG can sua code, chi bo sung du lieu factory.json.

**Port Trigger (`firewall_porttrigger_m.lua`, object `OBJ_FWPT_ID`)** —
bang chung `PortTrigger-apply.that.post.json` (tao moi, tu sinh
`IGD.FWPT1`), `PortTrigger-delete.that.post.json` (xoa). PHAT HIEN KIEN
TRUC MOI: doi tuong nay CUNG la danh sach nhung dung TEN TRUONG ID KHAC
MAC DINH — TAT CA truong (ke ca ID) mang tien to day du ten doi tuong
(`OBJ_FWPT_ID.Enable`, `OBJ_FWPT_ID._OBJ_InstID`, v.v. — khong phai
`_InstID` don gian), giong het dang da gap truoc do o `OBJ_RIPNG_ID`
(route_ripng_m.lua). Response Apply/Delete cung echo ID qua the
`<OBJ_FWPT_ID._OBJ_InstID>` (rong khi Delete), KHONG phai `<_InstID>`.

**Tong quat hoa co che `danhSach` de xu ly ten truong ID tuy chinh**
(config_store.py/dispatch.py):
- `config_store.truong_id_danh_sach(ten_obj)`: doc `danhSach.truongId`
  (mac dinh `"_InstID"` neu khong khai bao) — dung trong
  `chi_so_theo_instid()`, `tao_instance_moi()` thay vi hardcode `_InstID`.
- `xml_ghi_thanhcong()` them tham so `truong_id_the` (ten THE XML dung de
  echo ID, mac dinh `_InstID`) — nhanh `rut_gon`/`xoa_gon`/`day_du` deu
  dung tham so nay thay vi hardcode `<_InstID>`.
- `dispatch.menu_data_ghi()`: doc `truong_id = store.truong_id_danh_sach(
  ten_obj)` mot lan, dung xuyen suot thay cho `tham_so.get("_InstID", "")`
  hardcode; loai `truong_id` ra khoi `thuoc_obj` truoc khi ghi (tranh
  `_InstID` gia tri `-1` bi ghi de len ID vua tu sinh).
- factory.json: `OBJ_FWPT_ID.danhSach = {"tienToId": "IGD.FWPT",
  "truongId": "OBJ_FWPT_ID._OBJ_InstID"}`. 3 object danh sach con lai
  (`OBJ_FWSC_ID`, `OBJ_FWSCv6_ID`, `OBJ_FWPM_ID`) KHONG khai bao `truongId`
  -> tu dong dung mac dinh `_InstID`, khong doi hanh vi cu.

**Da kiem trong sandbox** (server rieng, state moi tu factory.json --reset,
KHONG dung thiet bi that): replay dung 100% 5 request That da capture
(DMZ apply, PortForwarding apply+delete, PortTrigger apply+delete) —
response sinh ra KHOP TUYET DOI ve tap the+gia tri voi bang chung that
(chi khac thu tu the header giua cac lan, CHAP NHAN theo chinh sach da xac
nhan voi anh Huynn ban 23 — XML la cay co ten, khong phai vi tri).

**Da revert thiet bi that**: Port Forwarding va Port Trigger xac nhan
Delete thanh cong, danh sach rong tro lai (xac nhan bang screenshot). DMZ
o trang thai an toan chuc nang nhung khac gia tri IP so voi factory goc
(xem gioi han o tren).

DMZ, Port Forwarding, Port Trigger len **muc 4**. Nhom Internet > Security
(Firewall, Filter Criteria, Local Service Control, ALG, DMZ, Port
Forwarding, Port Trigger — 7 route) **HOAN TAT toan bo muc 4**. Tong:
**59/77 dat muc 4, 18 muc 3**.

## INTERNET LEFTOVERS — DSLite, L2TP, Parental Controls, DDNS (2026-08-06)

Theo yeu cau anh Huynn "tiep tuc het tat ca cac nhom con lai" — vi 18 trang
muc 3 con lai KHONG phai 1 nhom menu gon (rai rac, gom 5 trang nguy hiem co
chu dinh bo qua + vai trang gan nhu be tac), da hoi lai va anh Huynn chon
bat dau voi 4 trang "Internet leftovers": DSLite (tunnel4in6Config), L2TP
(l2tpConfig), Parental Controls (parentCtrl), DDNS (ddns).

**Parental Controls (`firewall_parentctrl_lua.lua`, object
`OBJ_PARENT_CONTROL_ID`)** — bang chung `ParentCtrl-apply.that.post.json`
(tao moi, `_InstID=-1` → `DEV.PCUser1`), `ParentCtrl-delete.that.post.json`
(xoa, dang `xoa_gon`). Doi tuong KIEU DANH SACH chuan, dung dung co che
`danhSach` co san — KHONG can sua code. Truong `Week` la bitmask (gui `64`
khi tick rieng "Sun") — CHUA giai ma day du cho cac to hop nhieu ngay/
Everyday, ghi missing-evidence.md.

**DSLite (`tunnel_4in6_config_lua.lua`, object `OBJ_TUNNEL46_ID`)** — bang
chung `DSLite-apply.that.post.json` (tao moi, `_InstID=-1` →
`DEV.DSLITE.IFSETTING1`), `DSLite-delete.that.post.json` (xoa). Doi tuong
nay TRUOC DAY hoan toan chua duoc mo hinh hoa (`objects: []` trong
factory.json) — ten object `OBJ_TUNNEL46_ID` lay tu
`reference/source/views/tunnel4in6Config.html` (bien JS `OBJID =
["OBJ_TUNNEL46_ID"]`), KHONG bia. Cung dung dung co che `danhSach` co san.
**Su co ky thuat khi thu**: patch XHR-capture bi mat sau khi chuyen tab
WAN→DSLite (lan dau count=0 du Apply thanh cong that su) — phat hien va
sua bang cach re-inject patch roi bam lai Apply tren item DA TON TAI de
chup lai dung request/response.

**L2TP (`l2tp_lua.lua`, object `OBJ_L2TP_ID`)** — bang chung
`L2TP-apply-attempt.that.post.json` (Apply voi du lieu gia THANH CONG,
khac han DDNS — object nay CHI CO 1 instance co dinh `DEV.L2TP.TUNNEL1`,
khong phai danh sach, dung nhanh `ghi()` don gian giong `OBJ_FWDMZ_ID`),
`L2TP-disable.that.post.json` (revert ve `Enable=0`). Phat hien them
truong `Method` (WAN Connection Auto/Manual) chua tung mo hinh hoa — them
vao voi gia tri quan sat `"1"` (suy tu radio da chon san Auto, CHUA co GET
rieng xac nhan gia tri mac dinh — ghi missing-evidence.md). Request THAT
con gui `Password` (ma hoa qua co che `encode` khong ro khoa giai, giong
van de da biet o DHCPBasicCfg) nhung **KHONG mo hinh hoa truong nay** —
khac voi DHCPBasicCfg, o day AN TOAN vi GET that CUNG KHONG BAO GIO tra ve
Password (khong co trong paraOrder GET da xac nhan tu truoc), nen bo qua
truong nay la PHU HOP bang chung chu khong phai gioi han. Response Apply
xac nhan dang `rut_gon`, KHONG co the `<encode>` (khac GET cua
DHCPBasicCfg — khong vuong van de giai ma tren duong ghi).

Da GET lai `l2tp_lua.lua` sau Apply trong sandbox rieng, xac nhan gia tri
moi (`L2tpServer1`, `UserName`) duoc luu dung qua kho cau hinh trung tam —
dinh nghia muc 4 (CLAUDE.md 2.5) thoa man day du.

**DDNS (`ddns_lua.lua`)** — DA THU nhung KHONG len duoc muc 4. Client-side
validation chan Apply khi Username/Host Name rong (giong DMZ). Dien du
lieu gia (Username=testuser, Host Name=test.dyndns.org, DDNS van Off) thi
client cho qua nhung **SERVER TU CHOI**: `IF_ERRORID=-257`,
`IF_ERRORSTR=FAIL` (xem `DDNS-apply-rejected.that.post.json`) — khac han
L2TP, DDNS co ve THAT SU validate voi may chu DynDNS that (khong chi luu
cau hinh don thuan) nen khong the thanh cong voi du lieu gia. Xac nhan
KHONG co gi bi ghi tren thiet bi that (reload lai, Username/Host Name tro
ve rong). Can tai khoan DynDNS that tu anh Huynn moi thu tiep duoc.

**Da revert thiet bi that**: Parental Controls va DSLite xac nhan xoa
thanh cong, danh sach rong tro lai (screenshot). L2TP o trang thai an toan
chuc nang (`Enable=0`) nhung Server/Username khac gia tri factory goc
(cung gioi han "khong xoa duoc ve rong qua UI" nhu DMZ — validation
client-side). DDNS hoan toan khong doi (Apply that bi tu choi, khong co gi
duoc ghi).

**Da kiem trong sandbox**: replay 5 request that (ParentCtrl apply+delete,
DSLite apply+delete, L2TP apply) — response KHOP TUYET DOI voi bang chung
that (ca tap the+gia tri LAN thu tu the header, khac voi cac lan truoc chi
khop tap hop — o day trung khop hoan toan). Rieng L2TP con kiem them GET
sau Apply de xac nhan state propagation qua kho cau hinh trung tam.

DSLite, L2TP, Parental Controls len **muc 4**. DDNS van **muc 3** (chan
boi validate server that, can du lieu that). Tong: **63/77 dat muc 4, 14
muc 3**.

## NHOM LAN + ROUTING LEFTOVERS (2026-08-06)

Tiep tuc tu lai thiet bi that (anh Huynn cho phep chon nhom tiep theo tuy
y): routeIpv4, routeIpv6, lanMgrIpv4 — nhom con lai cua LAN + Routing.

**Default Routing IPv4 (`route_routedefault_lua.lua`, `IGD` co dinh)** —
bang chung `RouteIpv4-default-apply.that.post.json`: chon WAN
Connection=`internet_tr069` (`DEV.IP.IF3`), Apply THANH CONG, dang
`rut_gon`. Thu revert ve blank ("Please select") KHONG gui duoc request
nao (chan client-side im lang, giong nhom truoc) — chap nhan giu WAN da
chon vi day la cau hinh HOP LE, khong nguy hai.

**Static Routing IPv4/IPv6 (`route_routestaticipv4_lua.lua` /
`route_routestaticipv6_lua.lua`, `OBJ_ROUTESTATIC_ID`/`OBJ_ROUTESTATIC6_ID`)**
— phat hien CA HAI trang deu CO SAN 1 route that
(`ROUTING_RT1_IPV4FWD1`/`ROUTING_RT1_IPV6FWD1`, khac gia thuyet cu "danh
sach rong"). KHONG dong den 2 entry co san. Dung "Create New Item" de tu
rieng: `StaticRouteIpv4-apply/delete.that.post.json` (TestStaticRoute →
`DEV.ROUTING.RT1.IPV4FWD2`, xoa sach), `StaticRouteIpv6-apply/
delete.that.post.json` (TestStaticRoute6 → `DEV.ROUTING.RT1.IPV6FWD2`, xoa
sach). Dang Apply `rut_gon`, Delete `xoa_gon`. paraOrder lay tu GET that
(`StaticRouteIpv4-get.that.get.json` rieng; IPv6 lay tu GET nhung trong
`StaticRouteIpv6-apply.that.post.json`) — **phat hien quan trong**: thu tu
POST body cua IPv6 (`Type,Enable,Alias,Interface,DestIP,PrefixLen,GWIP`)
KHAC thu tu GET that (`PrefixLen,Enable,DestIP,GWIP,Alias,Interface`) — da
uu tien GET, ghi lai thanh quy tac chung trong missing-evidence.md.

**Default Routing IPv6 (`route_routedefaultipv6_lua.lua`)** — bang chung
`RouteIpv6-default-apply.that.post.json`, giong het IPv4 (WAN
`internet_tr069`, dang `rut_gon`).

routeIpv4, routeIpv6 len **muc 4**.

**DHCP Binding (lanMgrIpv4, `Localnet_LanMgrIpv4_DHCPStaticRule_lua.lua`,
`OBJ_DHCPBIND_ID`)** — khac Static Routing, danh sach nay RONG THAT SU
(GET truoc Apply xac nhan `<OBJ_DHCPBIND_ID></OBJ_DHCPBIND_ID>`). Tu tao
`TestBind` (MAC `AA:BB:CC:DD:EE:01`, IP `192.168.1.50`) → `_InstID` moi
`DEV.V4DP.Sr.Pl1.Bd1` (bang chung `DHCPBinding-apply.that.post.json`),
Delete xac nhan `xoa_gon` (`DHCPBinding-delete.that.post.json`), da xoa
sach tren thiet bi that. **DHCP Port Control** da co bang chung Apply tu
truoc (`LanMgrIpv4-DHCPPortControl-apply.that.post.json`, 2026-08-05) —
xac nhan lai va tinh vao lan len muc nay.

lanMgrIpv4 len **muc 4 TOAN TRANG** theo chinh sach da ap dung cho
RIP/FTP/Samba/PON: 5 truong ma hoa client-side cua DHCP Server
(`OBJ_Br0AndDhcpsHosCfg_ID`: IPAddr/MinAddress/MaxAddress/DNSServer1/
DNSServer2) van la NGOAI LE VINH VIEN da biet (khong co khoa giai ma), moi
thanh phan KHAC cua trang da xac nhan Apply that day du.

**Da kiem trong sandbox --reset**: replay 5 request (Default Routing IPv4
apply, Static Route IPv4 create+delete, Default Routing IPv6 apply, Static
Route IPv6 create+delete, DHCP Binding create+delete) — noi dung khop voi
bang chung that (thu tu the header khac nhau van duoc chap nhan theo chinh
sach da xac nhan 2026-08-05).

Tong: **66/77 dat muc 4, 11 muc 3**.

## l2tpStatus len muc 4 (2026-08-06, tiep theo ngay)

Dieu kien loai tru truoc day cho `l2tpStatus` ("l2tpConfig ban than con muc
3") KHONG CON DUNG vi `l2tpConfig` da len muc 4 trong nhom LAN+Routing
leftovers o tren, cung ngay. `l2tpStatus` dung CHUNG dataTag `l2tp_lua.lua`
voi `l2tpConfig` (kien truc da xac nhan tu 2026-08-04). Da kiem lai tren
sandbox `--reset` theo dung mau da dung cho statusMgr/OBJ_SN_INFO_ID: Apply
`L2tpServer1=TESTSERVER99` tren trang A (l2tpConfig) → GET lai qua trang B
(l2tpStatus, cung dataTag) → phan anh dung gia tri moi ngay lap tuc → xac
nhan kho cau hinh trung tam hoat dong dung (CLAUDE.md 2.5). Da revert lai
trong sandbox rieng, khong dung du lieu that. **Len muc 4.**

Tong: **67/77 dat muc 4, 10 muc 3**.

## dns (Host Name) len muc 4 (2026-08-06, sau khi anh Huynn dang nhap lai)

Host Name (`dns_hostname_lua.lua`, `ALLDNSHOST`) la danh sach RONG THAT SU
(GET truoc Apply xac nhan `<ALLDNSHOST></ALLDNSHOST>`), khac voi 2 section
con lai cua trang (Domain Name, DNS server — da muc 4 tu 2026-08-05). Tu
tao `testhost.lan`/`192.168.1.60` → `_InstID` moi `IGD.DNSHL1` (mau ID
rieng, khac han `DEV.*` cua cac doi tuong khac), Apply dang `rut_gon`,
Delete dang `xoa_gon`. **Phat hien nho**: POST Apply/Delete co THEM 2 tham
so `OBJID=DNS` va `LeaseTime=isDNSHOSTInst` — day la HANG SO cua form
(khong doi, khong xuat hien trong GET), KHONG PHAI truong du lieu that su
cua doi tuong — da loai khoi `paraOrder` (chi lay 3 truong that: `_InstID,
IPAddress, HostName`, theo dung thu tu GET). Da xoa lai item test tren
thiet bi that. Da kiem tren sandbox `--reset`: ca 3 luong (create, GET sau
tao, delete) khop bang chung that.

`dns` len **muc 4 TOAN TRANG**.

Tong: **68/77 dat muc 4, 9 muc 3**.

## IPv6SwitchMgr len muc 4 (2026-08-06, anh Huynn tu xac nhan cho phep reboot thiet bi that)

Truoc do BO QUA co chu dinh vi Apply that doi hoi thiet bi phai THAT SU
reboot (khong chi "gian doan IPv6 tam thoi" nhu du doan ban dau — khi bam
Apply, thiet bi hien canh bao ro: **"The device will reboot after the
IPv6 Switch is changed. Are you sure to go ahead?"**). Da bao lai rui ro
that cho anh Huynn TRUOC KHI bam OK; anh Huynn xac nhan van muon test.

Da doi IPv6 Status tu On sang Off, bam Apply, bam OK xac nhan reboot —
thiet bi REBOOT that su (lan dau bi loi token cu "-1452", da tai lai trang
va lam lai thanh cong lan 2).

**Phat hien kien truc MOI (chua tung gap trong du an)**: trang nay dung
QUY TRINH 2 BUOC voi 2 gia tri `IF_ACTION` khac nhau cho CUNG 1 dataTag
(`ipv6_enable_lua.lua`):
1. `IF_ACTION=Apply` — CHUA ghi gi vao NVRAM, chi la buoc xac nhan truoc
   khi hoi reboot. Response dang `xac_nhan_trong` (INSTIDENTITY echo
   `_InstID=IGD`, khong `_InstID`, khong du lieu object).
2. `IF_ACTION=Restart` — gui NGAY SAU buoc 1, **CUNG `_sessionTOKEN`**
   (token KHONG xoay giua 2 buoc — chi xoay khi THAT SU ghi). Day moi la
   buoc ghi that `IPv6EnableSet` va kich hoat reboot. Response dang
   `day_du_gioi_han` (header PARAM,TYPE,STR,ID, KHONG INSTIDENTITY,
   KHONG `_InstID`, CHI du lieu `OBJ_IPGLOBAL_ID`).

Da them co che TONG QUAT `config_store.hanh_dong_theo_buoc()` +
`dataTags[tag]["hanhDongTheoBuoc"]` trong `dispatch.py` (nhanh moi, dat
TRUOC nhanh ghi 1-lan mac dinh, CHI kich hoat khi dataTag khai bao ro
truong nay — khong anh huong 70+ dataTag khac). Da chay lai
`tools_kiem_thu.py` (36/37 dat, 1 loi CHAP NHAN da xac nhan la loi CO SAN
TRUOC thay doi nay, khong lien quan — da doi chieu bang `git stash`) de
dam bao khong pha vo hanh vi cu.

Da doi chieu sandbox `--reset`: ca 2 buoc khop CHINH XAC (byte-for-byte)
voi bang chung that.

**Thiet bi that hien dang O TRANG THAI OFF** (chua doi lai On) — theo yeu
cau tranh ep reboot lan 2 ngay lap tuc, anh Huynn se tu bat lai khi tien.

`IPv6SwitchMgr` len **muc 4**.

Tong: **68/77 dat muc 4, 9 muc 3** (da doi chieu lai bang script dem truc tiep tu route-inventory.json de tranh sai so cong don thu cong).
