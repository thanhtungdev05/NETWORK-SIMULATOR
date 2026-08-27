#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Doi chieu GIA LAP voi HOP DONG GHI da do tren THIET BI THAT.

Chay cung mot kich ban (A/B/C trong reference/source/hop_dong_ghi_that.json)
len gia lap, roi so tung phan hoi voi so lieu da do that.

So nhung gi:
  - ma HTTP
  - do dai than (0 byte hay khong -- day la cho de sai nhat)
  - hinh dang than (POST phai tra {"ids":[...]})
  - hieu ung len kho: doc lai co dung khong
  - lan truyen: ghi o resource nay thi resource kia doi theo (muc 4 CLAUDE.md)

Chay:  python kiem_hop_dong_ghi.py [port]     (mac dinh tu bat server 8095)
"""
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request

GOC = os.path.dirname(os.path.abspath(__file__))
HOP_DONG = os.path.join(GOC, "..", "reference", "source",
                        "hop_dong_ghi_that.json")
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8095
CS = f"http://127.0.0.1:{PORT}"

loi = []
so_kiem = 0


def goi(method, duong_dan, than=None):
    url = CS + duong_dan
    data = json.dumps(than).encode() if than is not None else None
    req = urllib.request.Request(url, data=data, method=method)
    req.add_header("Accept", "application/json")
    if data:
        req.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(req) as r:
            raw = r.read()
            return r.status, raw
    except urllib.error.HTTPError as e:
        return e.code, e.read()


def ktra(nhan, thuc, mong):
    global so_kiem
    so_kiem += 1
    if thuc != mong:
        loi.append(f"{nhan}: mong {mong!r}, thuc te {thuc!r}")
        print(f"  SAI  {nhan}: mong {mong!r}, thuc te {thuc!r}")
    else:
        print(f"  OK   {nhan}")


def json_hoac(raw):
    try:
        return json.loads(raw) if raw else None
    except json.JSONDecodeError:
        return raw.decode("utf-8", "replace")


def main():
    with open(HOP_DONG, encoding="utf-8") as f:
        json.load(f)          # doc de bao dam file ton tai va hop le

    # --- dat lai kho ve seed truoc khi kiem, de chay lai duoc nhieu lan ---
    sys.path.insert(0, GOC)
    import config_store
    config_store.dat_lai_factory()

    srv = subprocess.Popen([sys.executable, os.path.join(GOC, "server.py"),
                            str(PORT)],
                           stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    time.sleep(2)
    try:
        print("=== A. Resource dang OBJECT (upnp) ===")
        st, raw = goi("GET", "/api/v1/data/upnp")
        ktra("A1 GET ma", st, 200)
        goc = json_hoac(raw)
        ktra("A1 gia tri goc khop seed that", goc, {"enabled": True})

        st, raw = goi("PATCH", "/api/v1/data/upnp", {"enabled": False})
        ktra("A2 PATCH ma", st, 200)
        ktra("A2 PATCH than PHAI RONG (0 byte)", len(raw), 0)

        st, raw = goi("GET", "/api/v1/data/upnp")
        ktra("A3 doc lai thay da doi", json_hoac(raw), {"enabled": False})

        goi("PATCH", "/api/v1/data/upnp", {"enabled": True})
        st, raw = goi("GET", "/api/v1/data/upnp")
        ktra("A5 doc lai sau khi tra ve", json_hoac(raw), {"enabled": True})

        print("\n=== B. Resource dang MANG co id (portForwarding/policies) ===")
        U = "/api/v1/data/portForwarding/policies"
        st, raw = goi("GET", U)
        ktra("B1 gia tri goc la mang rong", json_hoac(raw), [])

        st, raw = goi("POST", U, [{
            "enabled": True, "name": "TEST-XOA-NGAY", "protocol": "TCP",
            "source": {"portRange": "55551"},
            "destination": {"portRange": "55551", "ipAddress": "192.168.1.109"},
        }])
        ktra("B2 POST ma", st, 200)
        than = json_hoac(raw)
        ktra("B2 POST tra dung khoa 'ids'",
             isinstance(than, dict) and list(than) == ["ids"], True)
        ktra("B2 POST tra dung 1 id",
             isinstance(than, dict) and len(than.get("ids", [])) == 1, True)
        moi_id = than["ids"][0]
        ktra("B2 id dung dinh dang thiet bi ('cfg'+so)",
             moi_id.startswith("cfg") and moi_id[3:].isdigit(), True)

        st, raw = goi("GET", U)
        ds = json_hoac(raw)
        ktra("B3 danh sach co dung 1 dong", len(ds), 1)
        b = ds[0]
        ktra("B3 giu nguyen ten client gui", b.get("name"), "TEST-XOA-NGAY")
        ktra("B3 THIET BI tu dien source.interfaceId",
             b.get("source", {}).get("interfaceId"), "wan")
        ktra("B3 THIET BI tu dien destination.interfaceId",
             b.get("destination", {}).get("interfaceId"), "lan")
        ktra("B3 giu nguyen portRange client gui",
             b.get("source", {}).get("portRange"), "55551")

        st, raw = goi("PATCH", U, [{
            "id": moi_id, "enabled": False, "name": "TEST-XOA-NGAY-2",
            "protocol": "UDP",
            "source": {"portRange": "55552", "interfaceId": "wan"},
            "destination": {"portRange": "55552", "ipAddress": "192.168.1.109",
                            "interfaceId": "lan"},
        }])
        ktra("B4 PATCH ma", st, 200)
        ktra("B4 PATCH than PHAI RONG (0 byte)", len(raw), 0)

        st, raw = goi("GET", U)
        ds = json_hoac(raw)
        ktra("B5 van dung 1 dong (sua chu khong them)", len(ds), 1)
        ktra("B5 ten da doi", ds[0].get("name"), "TEST-XOA-NGAY-2")
        ktra("B5 protocol da doi", ds[0].get("protocol"), "UDP")

        st, raw = goi("DELETE", U, {"ids": [moi_id]})
        ktra("B6 DELETE ma", st, 200)
        ktra("B6 DELETE than PHAI RONG (0 byte)", len(raw), 0)

        st, raw = goi("GET", U)
        ktra("B7 da xoa sach", json_hoac(raw), [])

        print("\n=== C. Doc va ghi o HAI resource khac nhau ===")
        st, raw = goi("GET", "/api/v1/data/system/info")
        host_goc = json_hoac(raw).get("hostname")
        ktra("C1 hostname goc khop thiet bi that", host_goc, "ONT-BE6500C-C150")

        st, raw = goi("PATCH", "/api/v1/data/system",
                      {"hostname": host_goc + "X"})
        ktra("C2 PATCH 'system' ma", st, 200)
        ktra("C2 PATCH than PHAI RONG", len(raw), 0)

        st, raw = goi("GET", "/api/v1/data/system/info")
        ktra("C3 LAN TRUYEN: ghi 'system' lam 'system/info' doi theo",
             json_hoac(raw).get("hostname"), host_goc + "X")

        goi("PATCH", "/api/v1/data/system", {"hostname": host_goc})
        st, raw = goi("GET", "/api/v1/data/system/info")
        ktra("C5 tra lai duoc", json_hoac(raw).get("hostname"), host_goc)

        print("\n=== B2. Mang khong co id trong than PATCH -> theo id, "
              "khong dung ca mang ===")
        # Trang DMZ chi gui MOT phan tu (ipVersion 4) kem id. Phan tu IPv6
        # phai GIU NGUYEN. Day la phep kiem quan trong nhat cua merge-theo-id:
        # neu cai dat sai thanh 'thay ca mang' thi ban ghi v6 se bien mat.
        U2 = "/api/v1/data/dmz/configurations"
        st, raw = goi("GET", U2)
        goc_dmz = json_hoac(raw)
        ktra("B2.1 seed co dung 2 ban ghi (v4 va v6)", len(goc_dmz), 2)
        v6_goc = [x for x in goc_dmz if x.get("ipVersion") == 6][0]

        goi("PATCH", U2, [{"id": "dmz_v4", "enabled": True,
                           "ipAddress": "192.168.1.109"}])
        st, raw = goi("GET", U2)
        sau = json_hoac(raw)
        v4 = [x for x in sau if x.get("ipVersion") == 4][0]
        v6 = [x for x in sau if x.get("ipVersion") == 6][0]
        ktra("B2.2 van du 2 ban ghi", len(sau), 2)
        ktra("B2.3 ban ghi v4 da doi", v4.get("ipAddress"), "192.168.1.109")
        ktra("B2.4 ban ghi v4 giu nguyen id", v4.get("id"), "dmz_v4")
        ktra("B2.5 ban ghi v6 KHONG bi dung toi", v6, v6_goc)

        print("\n=== B3. Trang DDNS: ten truong FORM khac ten khoa DU LIEU ===")
        # Ma goc: customDDnsEnabled<-enabled, dynamicServer<-serviceProvider.
        # Truong khong co tren form (interfaceId, ipVersion) PHAI giu nguyen.
        U3 = "/api/v1/data/ddns/configurations"
        st, raw = goi("GET", U3)
        ddns_goc = json_hoac(raw)[0]
        ktra("B3.1 seed dung nhu thiet bi that",
             [ddns_goc.get("enabled"), ddns_goc.get("serviceProvider")],
             [False, "noip"])

        goi("PATCH", U3, [{"id": ddns_goc["id"], "enabled": True,
                           "serviceProvider": "noip",
                           "username": "your_username",
                           "password": "your_password",
                           "hostname": "thu.ddns.org"}])
        st, raw = goi("GET", U3)
        sau3 = json_hoac(raw)[0]
        ktra("B3.2 ghi dung khoa du lieu", sau3.get("hostname"), "thu.ddns.org")
        ktra("B3.3 giu id", sau3.get("id"), "myddns_ipv4")
        ktra("B3.4 giu truong khong co tren form (interfaceId)",
             sau3.get("interfaceId"), "wan")
        ktra("B3.5 giu truong khong co tren form (ipVersion)",
             sau3.get("ipVersion"), 4)

        print("\n=== C2. Mot trang ghi vao HAI resource song song ===")
        # Ma goc System Settings: Promise.all([setSystemInfo, setTime]).
        st, raw = goi("GET", "/api/v1/data/time")
        tg = json_hoac(raw)
        ktra("C2.1 time co du servers", len(tg.get("servers", [])), 2)
        goi("PATCH", "/api/v1/data/system", {"hostname": "MAY-THU"})
        goi("PATCH", "/api/v1/data/time",
            {"enabled": True, "localTimeZone": "UTC+7"})
        st, raw = goi("GET", "/api/v1/data/system/info")
        ktra("C2.2 system/info doi theo", json_hoac(raw).get("hostname"),
             "MAY-THU")
        st, raw = goi("GET", "/api/v1/data/time")
        t2 = json_hoac(raw)
        ktra("C2.3 time doi theo", t2.get("localTimeZone"), "UTC+7")
        ktra("C2.4 time GIU nguyen servers (khong bi PATCH xoa)",
             t2.get("servers"), tg.get("servers"))

        print("\n=== F. Wi-Fi General: hai PATCH tuan tu, gop LONG NHAU ===")
        # Trang Wi-Fi luu bang cach PATCH 'easyMesh' voi
        # ssidTypesConfigurations chi chua DUNG MOT loai. Neu gop sai thanh
        # 'thay ca mang' thi ba loai kia bien mat va cac khoa khac cua chinh
        # loai do cung mat -> lan sau mo trang khong con tab nao.
        # DA BAT DUOC DUNG LOI NAY khi kiem bang mat 2026-08-13.
        st, raw = goi("GET", "/api/v1/data/easyMesh")
        em0 = json_hoac(raw)
        ktra("F1 seed co du 4 loai SSID",
             len(em0["ssidTypesConfigurations"]), 4)

        goi("PATCH", "/api/v1/data/easyMesh",
            {"enabled": True,
             "ssidTypesConfigurations": [{"type": "Primary",
                                          "separatedSsid": True}]})
        st, raw = goi("GET", "/api/v1/data/easyMesh")
        em1 = json_hoac(raw)
        ktra("F2 VAN du 4 loai (khong bi thay ca mang)",
             len(em1["ssidTypesConfigurations"]), 4)
        pri = [x for x in em1["ssidTypesConfigurations"]
               if x["type"] == "Primary"][0]
        ktra("F3 Primary da doi separatedSsid", pri["separatedSsid"], True)
        ktra("F4 Primary GIU cac khoa khong nhac toi (uiConfigurable)",
             pri.get("uiConfigurable"), True)
        ktra("F5 Primary GIU mloEnabled", "mloEnabled" in pri, True)
        bh = [x for x in em1["ssidTypesConfigurations"]
              if x["type"] == "Backhaul"][0]
        ktra("F6 Backhaul khong bi dung toi",
             [bh.get("uiConfigurable"), bh.get("isBackhaul")], [False, True])

        # Che do GOP: mot bo gia tri ap cho CA HAI ban ghi cua loai do.
        st, raw = goi("GET", "/api/v1/data/ssids")
        ss0 = json_hoac(raw)
        pri_ids = [x["id"] for x in ss0 if x["type"] == "Primary"]
        ktra("F7 loai Primary co dung 2 ban ghi", len(pri_ids), 2)
        goi("PATCH", "/api/v1/data/ssids",
            [{"id": i, "enabled": True, "name": "TEN-GOP",
              "securityMode": "WPA3-Personal-Transition",
              "passphrase": "12345678", "broadcastEnabled": True}
             for i in pri_ids])
        st, raw = goi("GET", "/api/v1/data/ssids")
        ss1 = json_hoac(raw)
        ktra("F8 van du 8 SSID", len(ss1), 8)
        ktra("F9 ca hai ban ghi Primary deu doi ten",
             [x["name"] for x in ss1 if x["type"] == "Primary"],
             ["TEN-GOP", "TEN-GOP"])
        ktra("F10 cac loai khac giu nguyen ten",
             [x["name"] for x in ss1 if x["type"] == "Guest"],
             [x["name"] for x in ss0 if x["type"] == "Guest"])
        ktra("F11 SSID giu truong khong gui len (radio)",
             [x.get("radio") for x in ss1 if x["type"] == "Primary"],
             ["2.4G", "5G"])

        print("\n=== G. Wi-Fi Advanced: quy tac dan xuat cua radios ===")
        st, raw = goi("GET", "/api/v1/data/radios")
        rs0 = json_hoac(raw)
        ktra("G1 seed: ca hai radio dang tu chon kenh",
             [r["autoChannelEnabled"] for r in rs0], [True, True])
        ktra("G2 chi radio 5G moi co dfsEnabled",
             ["dfsEnabled" in r for r in rs0], [False, True])

        # Ma goc: chon kenh khac 0 -> autoChannelEnabled = false;
        #         dfsEnabled CHI gui khi band la 5G.
        goi("PATCH", "/api/v1/data/radios",
            [{"id": "wifi0", "bandwidth": "40MHz",
              "autoChannelEnabled": False, "channel": 6}])
        st, raw = goi("GET", "/api/v1/data/radios")
        rs1 = json_hoac(raw)
        r0 = [r for r in rs1 if r["id"] == "wifi0"][0]
        r1 = [r for r in rs1 if r["id"] == "wifi1"][0]
        ktra("G3 radio 2.4G doi bandwidth", r0["bandwidth"], "40MHz")
        ktra("G4 radio 2.4G doi kenh va tat tu dong",
             [r0["channel"], r0["autoChannelEnabled"]], [6, False])
        ktra("G5 radio 2.4G KHONG bi them dfsEnabled",
             "dfsEnabled" in r0, False)
        ktra("G6 radio 5G khong bi dung toi", r1["autoChannelEnabled"], True)
        ktra("G7 giu truong khong gui len (possibleChannels)",
             isinstance(r0.get("possibleChannels"), list), True)

        print("\n=== H. Wi-Fi Advanced tab Other: MLO ===")
        goi("PATCH", "/api/v1/data/easyMesh",
            {"enabled": True,
             "ssidTypesConfigurations": [
                 {"type": t, "mloEnabled": True}
                 for t in ("Primary", "Guest", "SmartHome")]})
        st, raw = goi("GET", "/api/v1/data/easyMesh")
        em2 = json_hoac(raw)
        ktra("H1 van du 4 loai", len(em2["ssidTypesConfigurations"]), 4)
        ktra("H2 3 loai hien tren giao dien deu bat MLO",
             [x["mloEnabled"] for x in em2["ssidTypesConfigurations"]
              if x["uiConfigurable"]], [True, True, True])
        bh2 = [x for x in em2["ssidTypesConfigurations"]
               if x["type"] == "Backhaul"][0]
        ktra("H3 Backhaul (khong hien tren giao dien) khong bi doi",
             bh2["mloEnabled"], True)

        print("\n=== I. Static Routing: id rieng dinh dang, ipVersion "
              "CLIENT tu them ===")
        # Doc ma goc index-CZBnlfHf.js: POST/PATCH deu gui [{...form,
        # ipVersion}] -- ipVersion la truong DUY NHAT ma CLIENT tu them
        # (khac voi portForwarding, noi THIET BI tu dien). id sinh dang
        # 'S_route_'+8 hex (do that tren thiet bi, khac voi 'cfg'+so cua
        # portForwarding). Xem hop_dong_ghi_bang.json.
        U4 = "/api/v1/data/staticRouting/policies"
        st, raw = goi("GET", U4)
        ktra("I1 gia tri goc la mang rong", json_hoac(raw), [])

        st, raw = goi("POST", U4, [{
            "interfaceId": "wan", "target": "203.0.113.0",
            "mask": "255.255.255.0", "gateway": "192.168.1.254",
            "ipVersion": 4,
        }])
        ktra("I2 POST ma", st, 200)
        than_i = json_hoac(raw)
        ktra("I2 POST tra dung khoa 'ids'",
             isinstance(than_i, dict) and list(than_i) == ["ids"], True)
        id_v4 = than_i["ids"][0]
        ktra("I2 id dung dinh dang thiet bi ('S_route_'+8 hex)",
             id_v4.startswith("S_route_") and len(id_v4) == len("S_route_") + 8,
             True)

        st, raw = goi("POST", U4, [{
            "interfaceId": "wan6", "target": "2001:db8::1/64",
            "gateway": "fe80::1", "ipVersion": 6,
        }])
        id_v6 = json_hoac(raw)["ids"][0]

        st, raw = goi("GET", U4)
        ds4 = json_hoac(raw)
        ktra("I3 co dung 2 ban ghi (v4+v6 cung resource)", len(ds4), 2)
        rv4 = [x for x in ds4 if x["id"] == id_v4][0]
        rv6 = [x for x in ds4 if x["id"] == id_v6][0]
        ktra("I3 ban ghi v4 giu ipVersion CLIENT gui", rv4.get("ipVersion"), 4)
        ktra("I3 ban ghi v4 co mask", rv4.get("mask"), "255.255.255.0")
        ktra("I3 ban ghi v6 giu ipVersion CLIENT gui", rv6.get("ipVersion"), 6)
        ktra("I3 ban ghi v6 KHONG co mask (IPv6 khong dung Mask)",
             "mask" in rv6, False)
        ktra("I3 ban ghi v6 giu nguyen target dang CIDR",
             rv6.get("target"), "2001:db8::1/64")

        st, raw = goi("PATCH", U4, [{
            "id": id_v4, "interfaceId": "wan", "target": "203.0.113.0",
            "mask": "255.255.0.0", "gateway": "192.168.1.254", "ipVersion": 4,
        }])
        ktra("I4 PATCH ma", st, 200)
        ktra("I4 PATCH than PHAI RONG", len(raw), 0)
        st, raw = goi("GET", U4)
        ds4b = json_hoac(raw)
        ktra("I4 van du 2 ban ghi (sua chu khong them)", len(ds4b), 2)
        ktra("I4 mask da doi",
             next(x for x in ds4b if x["id"] == id_v4)["mask"], "255.255.0.0")
        ktra("I5 ban ghi v6 KHONG bi dung toi luc sua v4",
             next(x for x in ds4b if x["id"] == id_v6), rv6)

        st, raw = goi("DELETE", U4, {"ids": [id_v4, id_v6]})
        ktra("I6 DELETE ca hai ma", st, 200)
        ktra("I6 DELETE than PHAI RONG", len(raw), 0)
        st, raw = goi("GET", U4)
        ktra("I7 da xoa sach", json_hoac(raw), [])

        print("\n=== J. Advanced LAN: interfaces/configurations + "
              "dhcp/servers (gop long nhau) + dhcp/reservedHosts ===")
        # GD4 phan 3 (2026-08-13). interfaces/configurations va dhcp/servers
        # la object long nhau (khong phai bang co id rieng tung dong) --
        # PATCH mot phan phai GIU NGUYEN cac truong khac (vd 'mask', 'devices',
        # 'autoReserved') dung nguyen tac gop_sau() cua config_store.
        UJ_IF = "/api/v1/data/interfaces/configurations"
        UJ_DH = "/api/v1/data/dhcp/servers"
        UJ_RH = "/api/v1/data/dhcp/reservedHosts"

        st, raw = goi("PATCH", UJ_IF, [{
            "id": "lan", "ipv4Settings": {"ipAddress": "192.168.9.9"},
            "ipv6Settings": {"enabled": True, "protocol": "dhcpv6",
                              "prefix": "", "slaacEnabled": False, "ulaPrefix": ""}
        }])
        ktra("J1 PATCH interfaces/configurations ma", st, 200)
        ktra("J1 PATCH than PHAI RONG", len(raw), 0)
        st, raw = goi("GET", UJ_IF)
        lan_if = next(x for x in json_hoac(raw) if x["id"] == "lan")
        ktra("J1 ipAddress da doi", lan_if["ipv4Settings"]["ipAddress"], "192.168.9.9")
        ktra("J1 mask KHONG bi mat (gop long nhau dung)",
             lan_if["ipv4Settings"]["mask"], "255.255.255.0")
        ktra("J1 devices KHONG bi mat", lan_if.get("devices"), ["eth1"])

        st, raw = goi("PATCH", UJ_DH, [{
            "id": "lan", "ipv4Settings": {
                "enabled": True, "autoDnsEnabled": True, "dnsServers": [],
                "startAddress": "192.168.9.10", "endAddress": "192.168.9.200",
                "leaseTime": 3600}
        }])
        ktra("J2 PATCH dhcp/servers ma", st, 200)
        st, raw = goi("GET", UJ_DH)
        lan_dh = next(x for x in json_hoac(raw) if x["id"] == "lan")
        ktra("J2 startAddress da doi", lan_dh["ipv4Settings"]["startAddress"],
             "192.168.9.10")
        ktra("J2 autoReserved KHONG bi mat (truong khac nhanh 'enabled' cung cap)",
             "autoReserved" in lan_dh["ipv4Settings"], True)

        # Auto Reservation: PATCH mot minh truong nested sau, cac truong
        # nhanh khac (limit) phai giu nguyen -- day la diem de gay loi nhat
        # neu code JS lo gui ca object autoReserved thay vi merge.
        goi("PATCH", UJ_DH, [{"id": "lan",
                               "ipv4Settings": {"autoReserved": {"enabled": False}}}])
        st, raw = goi("GET", UJ_DH)
        lan_dh2 = next(x for x in json_hoac(raw) if x["id"] == "lan")
        ktra("J3 autoReserved.enabled doi rieng, 'limit' KHONG mat",
             lan_dh2["ipv4Settings"]["autoReserved"], {"enabled": False, "limit": 50})

        st, raw = goi("POST", UJ_RH, [{
            "serverId": "lan", "macAddress": "aa:bb:cc:dd:ee:ff",
            "ipAddress": "192.168.9.50"}])
        ktra("J4 POST reservedHosts ma", st, 200)
        than_j = json_hoac(raw)
        ktra("J4 POST tra dung khoa 'ids'",
             isinstance(than_j, dict) and list(than_j) == ["ids"], True)
        id_rh = than_j["ids"][0]
        ktra("J4 id dung dinh dang thiet bi ('cfg'+6 hex, KHAC voi "
             "portForwarding 'cfg'+6 SO THAP PHAN)",
             id_rh.startswith("cfg") and len(id_rh) == 9
             and all(c in "0123456789abcdef" for c in id_rh[3:]), True)

        st, raw = goi("PATCH", UJ_RH, [{"id": id_rh, "ipAddress": "192.168.9.51"}])
        ktra("J5 PATCH reservedHosts ma", st, 200)
        ktra("J5 PATCH than PHAI RONG", len(raw), 0)
        st, raw = goi("GET", UJ_RH)
        rh = next(x for x in json_hoac(raw) if x["id"] == id_rh)
        ktra("J5 ipAddress da sua", rh["ipAddress"], "192.168.9.51")
        ktra("J5 macAddress KHONG mat", rh["macAddress"], "aa:bb:cc:dd:ee:ff")

        st, raw = goi("DELETE", UJ_RH, {"ids": [id_rh]})
        ktra("J6 DELETE reservedHosts ma", st, 200)
        ktra("J6 DELETE than PHAI RONG", len(raw), 0)
        st, raw = goi("GET", UJ_RH)
        ds_rh = json_hoac(raw)
        ktra("J6 ban ghi vua tao da mat", id_rh not in [x["id"] for x in ds_rh], True)
        ktra("J6 ban ghi mau seed (cfg08fe63) KHONG bi dung toi",
             "cfg08fe63" in [x["id"] for x in ds_rh], True)

        print("\n=== K. Advanced WAN: MOT lan PATCH ghi CA HAI ban ghi "
              "(wan + wan6) ===")
        # GD4 phan 4 (2026-08-13). Doc tay index-D_2ztGgf.js ham He():
        # ne=s.map(...) roi v(ne) -> gui MOT MANG gom ca hai ban ghi trong
        # MOT lan PATCH. Truong nao khong thuoc giao thuc dang chon thi
        # bi XOA RONG (khong giu lai gia tri cu).
        UK = "/api/v1/data/interfaces/configurations"

        def lay(idw):
            _, raw_ = goi("GET", UK)
            return next(x for x in json_hoac(raw_) if x["id"] == idw)

        # K1: doi sang PPPoE -- ipAddress/mask/gateway phai bi xoa rong
        st, raw = goi("PATCH", UK, [
            {"id": "wan", "name": "wan", "usage": "Internet", "enabled": True,
             "mtu": 1500, "devices": ["pon"],
             "vlan": {"enabled": False, "autoDetectionEnabled": False, "id": 0},
             "ipv4Settings": {"protocol": "pppoe", "mask": "", "ipAddress": "",
                               "gateway": "",
                               "pppoe": {"username": "u@fpt", "password": "p"}},
             "autoDnsEnabled": False, "dnsServers": ["8.8.8.8", ""]},
            {"id": "wan6", "name": "wan6", "usage": "Internet", "enabled": True,
             "mtu": 1500, "devices": ["@wan"],
             "vlan": {"enabled": False, "autoDetectionEnabled": False, "id": 0},
             "ipv6Settings": {"enabled": True, "protocol": "dhcpv6", "prefix": "",
                               "ipAddress": "", "gateway": "", "slaacEnabled": True},
             "autoDnsEnabled": False,
             "dnsServers": ["2001:4860:4860::8888", "2001:4860:4860::8844"]},
        ])
        ktra("K1 PATCH ca hai ban ghi trong MOT lan -> ma", st, 200)
        ktra("K1 PATCH than PHAI RONG", len(raw), 0)
        w = lay("wan")
        ktra("K1 protocol da doi", w["ipv4Settings"]["protocol"], "pppoe")
        ktra("K1 pppoe da ghi", w["ipv4Settings"]["pppoe"]["username"], "u@fpt")
        ktra("K1 ipAddress bi xoa rong (dung ma goc)",
             w["ipv4Settings"]["ipAddress"], "")
        ktra("K1 mask bi xoa rong", w["ipv4Settings"]["mask"], "")
        w6 = lay("wan6")
        ktra("K1 wan6 giu slaacEnabled", w6["ipv6Settings"]["slaacEnabled"], True)
        ktra("K1 wan6 giu ulaPrefix (truong khong gui len)",
             "ulaPrefix" in w6["ipv6Settings"], True)

        # K2: chi bat IPv4 -> wan6 phai tat ca hai muc enabled
        st, raw = goi("PATCH", UK, [
            {"id": "wan", "name": "wan", "usage": "Internet", "enabled": True,
             "mtu": 1500, "devices": ["pon"],
             "vlan": {"enabled": False, "autoDetectionEnabled": False, "id": 0},
             "ipv4Settings": {"protocol": "pppoe", "mask": "", "ipAddress": "",
                               "gateway": "",
                               "pppoe": {"username": "u@fpt", "password": "p"}},
             "autoDnsEnabled": False, "dnsServers": ["8.8.8.8", ""]},
            {"id": "wan6", "enabled": False,
             "ipv6Settings": {"enabled": False}, "mtu": 1500,
             "vlan": {"enabled": False, "autoDetectionEnabled": False, "id": 0}},
        ])
        ktra("K2 ma", st, 200)
        w6b = lay("wan6")
        ktra("K2 wan6.enabled = False", w6b["enabled"], False)
        ktra("K2 wan6.ipv6Settings.enabled = False",
             w6b["ipv6Settings"]["enabled"], False)
        ktra("K2 wan (IPv4) VAN bat", lay("wan")["enabled"], True)

        # K3: VLAN thu cong -- id giu nguyen so da gui
        st, raw = goi("PATCH", UK, [
            {"id": "wan", "vlan": {"enabled": True, "autoDetectionEnabled": False,
                                    "id": 100}},
        ])
        ktra("K3 VLAN id ghi duoc", lay("wan")["vlan"]["id"], 100)
        ktra("K3 VLAN enabled ghi duoc", lay("wan")["vlan"]["enabled"], True)

        print("\n=== L. Security Firewall: DoS Defense (Enable All + "
              "rate/burst) ===")
        # Nguon: doc tay ma goc reference/source/assets_goc/index-eel5T8aZ.js
        # (chunk cua chinh trang nay). Ham z() cua "Enable All" dat DUNG 13
        # truong '.enabled' va KHONG dung toi rate/burst -- xem
        # src/www/firewall_binding.js phan chu thich dau file.
        CON_DOS = ["tcpFlood", "udpFlood", "icmpFlood", "portScan",
                   "tcpFlagScan", "land", "smurf", "pingOfDeath",
                   "traceRoute", "icmpFragment", "synFragment",
                   "fraggleAttack", "unknownProtocol"]

        def fw():
            return json_hoac(goi("GET", "/api/v1/data/firewall")[1])

        goc_fw = fw()
        ktra("L0 seed co du 13 nhanh con cua dosDefense",
             all(k in goc_fw["dosDefense"] for k in CON_DOS), True)
        ktra("L0 seed khop thiet bi that: tcpFlood 25/50",
             (goc_fw["dosDefense"]["tcpFlood"]["rate"],
              goc_fw["dosDefense"]["tcpFlood"]["burst"]), (25, 50))
        ktra("L0 seed khop thiet bi that: udpFlood tat, 0/0",
             (goc_fw["dosDefense"]["udpFlood"]["enabled"],
              goc_fw["dosDefense"]["udpFlood"]["rate"]), (False, 0))

        # L1: "Enable All" bat -> than PATCH mang DUNG 13 truong .enabled.
        than_bat = {"dosDefense": {k: {"enabled": True} for k in CON_DOS}}
        st, raw = goi("PATCH", "/api/v1/data/firewall", than_bat)
        ktra("L1 PATCH 13 cong tac cung luc -> ma", st, 200)
        ktra("L1 PATCH than PHAI RONG", raw, b"")
        d = fw()["dosDefense"]
        ktra("L1 ca 13 cong tac da bat",
             all(d[k]["enabled"] for k in CON_DOS), True)
        ktra("L1 rate/burst tcpFlood KHONG bi dung toi (25/50)",
             (d["tcpFlood"]["rate"], d["tcpFlood"]["burst"]), (25, 50))
        ktra("L1 rate/burst udpFlood KHONG bi tu dien gia tri (van 0/0)",
             (d["udpFlood"]["rate"], d["udpFlood"]["burst"]), (0, 0))
        ktra("L1 nhanh ngoai dosDefense KHONG bi mat (spiEnabled)",
             fw()["spiEnabled"], True)
        ktra("L1 icmpPing KHONG bi mat", fw()["icmpPing"]["wanEnabled"], True)

        # L2: rate/burst ghi doc lap voi cong tac.
        goi("PATCH", "/api/v1/data/firewall",
            {"dosDefense": {"udpFlood": {"rate": 30, "burst": 60}}})
        d = fw()["dosDefense"]
        ktra("L2 rate/burst udpFlood ghi duoc",
             (d["udpFlood"]["rate"], d["udpFlood"]["burst"]), (30, 60))
        ktra("L2 udpFlood.enabled KHONG bi mat khi chi ghi rate/burst",
             d["udpFlood"]["enabled"], True)
        ktra("L2 nhom khac KHONG bi dung toi",
             (d["icmpFlood"]["rate"], d["icmpFlood"]["burst"]), (100, 100))

        # L3: "Enable All" tat -> 13 cong tac tat, rate/burst ve rong.
        # Ma goc: 4 useEffect xoa rate/burst ve "" khi cong tac tat, nen
        # than gui len mang chuoi rong -- kho phai nhan duoc (khong ep kieu).
        than_tat = {"dosDefense": {k: {"enabled": False} for k in CON_DOS}}
        for n in ["tcpFlood", "udpFlood", "icmpFlood", "portScan"]:
            than_tat["dosDefense"][n]["rate"] = ""
            than_tat["dosDefense"][n]["burst"] = ""
        st, raw = goi("PATCH", "/api/v1/data/firewall", than_tat)
        ktra("L3 PATCH tat het -> ma", st, 200)
        d = fw()["dosDefense"]
        ktra("L3 ca 13 cong tac da tat",
             any(d[k]["enabled"] for k in CON_DOS), False)
        ktra("L3 rate/burst nhan duoc chuoi rong (khong ep ve 0)",
             (d["tcpFlood"]["rate"], d["tcpFlood"]["burst"]), ("", ""))

        # L4: SPI tat -> ma goc ep dosDefense.enabled=False cung luc.
        goi("PATCH", "/api/v1/data/firewall",
            {"spiEnabled": False, "dosDefense": {"enabled": False}})
        f = fw()
        ktra("L4 spiEnabled tat", f["spiEnabled"], False)
        ktra("L4 dosDefense.enabled tat theo", f["dosDefense"]["enabled"],
             False)

        # tra ve nguyen trang de cac phep kiem sau khong bi anh huong
        goi("PATCH", "/api/v1/data/firewall", goc_fw)
        ktra("L5 da hoan tac ve dung seed", fw(), goc_fw)

        print("\n=== M. Guest Wi-Fi bat -> firmware TU bat Guest LAN interface ===")
        # Nguon: reference/har/advanced__lan_guest_bat.har -- PATCH ssids +
        # PATCH easyMesh luc 03:12:07, den 03:12:20 thi interfaces/
        # configurations id='guest' DA co enabled=true, ma trong ca file
        # KHONG co request ghi nao toi resource do. Xem config_store.
        # _dong_bo_noi_bo() de biet gioi han cua bang chung.

        def guest_iface():
            ds = json_hoac(goi("GET", "/api/v1/data/interfaces/configurations")[1])
            return [x for x in ds if x.get("usage") == "Guest"][0]

        def id_ssid_guest():
            ds = json_hoac(goi("GET", "/api/v1/data/ssids")[1])
            return [x["id"] for x in ds if x.get("type") == "Guest"]

        def khac_guest():
            """Trang thai enabled cua cac interface KHONG phai Guest.
            Chup lai truoc/sau de chung minh ham dong bo noi bo chi dung
            toi ban ghi Guest. KHONG cung hoa gia tri: muc K o tren da tat
            wan6, nen trang thai o day phu thuoc thu tu chay."""
            ds = json_hoac(goi("GET", "/api/v1/data/interfaces/configurations")[1])
            return {x["id"]: x["enabled"] for x in ds if x.get("usage") != "Guest"}

        ktra("M0 trang thai dau: Guest LAN interface TAT",
             guest_iface()["enabled"], False)
        khac_truoc = khac_guest()

        # M1: chi bat SSID Guest, CHUA tach mang -> van phai TAT
        # (dieu kien CHAT: phai co ca separatedSsid -- xem chu thich)
        goi("PATCH", "/api/v1/data/ssids",
            [{"id": i, "enabled": True} for i in id_ssid_guest()])
        ktra("M1 bat SSID Guest nhung chua tach mang -> van TAT",
             guest_iface()["enabled"], False)

        # M2: tach mang -> DU dieu kien, firmware tu bat
        goi("PATCH", "/api/v1/data/easyMesh",
            {"ssidTypesConfigurations": [{"type": "Guest", "separatedSsid": True}]})
        ktra("M2 them tach mang -> Guest LAN interface TU BAT",
             guest_iface()["enabled"], True)
        ktra("M2 khong dung toi cac truong khac cua ban ghi guest",
             (guest_iface()["ipv4Settings"]["ipAddress"],
              guest_iface()["usage"]), ("192.168.5.1", "Guest"))
        ktra("M2 cac interface khac KHONG bi anh huong (so truoc/sau)",
             khac_guest(), khac_truoc)

        # M3: chieu nguoc (DOI XUNG -- suy ra, chua do; xem ISSUES.md)
        goi("PATCH", "/api/v1/data/ssids",
            [{"id": i, "enabled": False} for i in id_ssid_guest()])
        ktra("M3 tat SSID Guest -> Guest LAN interface tat theo (doi xung)",
             guest_iface()["enabled"], False)

        # M4: tra ve nguyen trang
        goi("PATCH", "/api/v1/data/easyMesh",
            {"ssidTypesConfigurations": [{"type": "Guest", "separatedSsid": False}]})
        ktra("M4 da hoan tac: Guest LAN interface TAT", guest_iface()["enabled"], False)
        ktra("M4 da hoan tac: SSID Guest TAT",
             any(x.get("enabled") for x in
                 json_hoac(goi("GET", "/api/v1/data/ssids")[1])
                 if x.get("type") == "Guest"), False)

        print("\n=== D. Method sai phai bi tu choi dung ===")
        st, raw = goi("PATCH", "/api/v1/data/system/info", {})
        ktra("D1 PATCH resource chi-doc -> 405", st, 405)
        st, raw = goi("POST", "/api/v1/data/firewall", {})
        ktra("D2 POST resource chi GET/PATCH -> 405", st, 405)
        st, raw = goi("PATCH", "/api/v1/data/khong_co_that", {})
        ktra("D3 resource khong ton tai -> 404", st, 404)

        print("\n=== E. Lan truyen giua cac trang (nguyen tac 2.5) ===")
        st, raw = goi("GET", "/api/v1/data/ssids")
        ssids = json_hoac(raw)
        id0 = ssids[0]["id"]
        ten_cu = ssids[0]["name"]
        goi("PATCH", "/api/v1/data/ssids", [{"id": id0, "name": "DOI-THU"}])
        st, raw = goi("GET", "/api/v1/data/ssids")
        ds2 = json_hoac(raw)
        ktra("E1 sua 1 SSID theo id, so luong KHONG doi",
             len(ds2), len(ssids))
        ktra("E1 dung SSID do da doi ten",
             next(x["name"] for x in ds2 if x["id"] == id0), "DOI-THU")
        ktra("E1 cac SSID khac giu nguyen",
             all(x["name"] == y["name"] for x, y in zip(ssids[1:], ds2[1:])),
             True)
        goi("PATCH", "/api/v1/data/ssids", [{"id": id0, "name": ten_cu}])

    finally:
        srv.terminate()
        srv.wait(timeout=5)
        config_store.dat_lai_factory()

    print()
    print("=" * 62)
    if loi:
        print(f"KET LUAN: {len(loi)}/{so_kiem} phep kiem SAI")
        for x in loi:
            print("  -", x)
        sys.exit(1)
    print(f"KET LUAN: {so_kiem}/{so_kiem} phep kiem DAT -- gia lap khop hop "
          f"dong do tren thiet bi that.")


if __name__ == "__main__":
    main()
