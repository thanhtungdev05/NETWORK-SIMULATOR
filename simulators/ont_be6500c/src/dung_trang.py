#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dung src/www/<route>.html tu ban chup THAT trong reference/source/.

Lam 3 viec, KHONG bia them noi dung:
  1. Cat dung phan <div id="root">...</div> tu ban chup goc (bo phan rac
     do tien ich mo rong Chrome chen vao luc chup: plasmo-csui, yd-sidebar,
     glasp-extension, style id="_goober" -- day KHONG PHAI cua thiet bi).
  2. Boc lai trong khung HTML sach: <head> chi giu meta/title/favicon/link
     toi emotion.css (CSSOM that, xem tao_emotion_css.py), bo <script
     src="/assets/index-....js"> vi ban gia lap khong chay bundle That.
  3. Chen script dieu huong (window.__MAP/__GROUP/__PAGES + nav.js) va cac
     script chung (sidebar_data.js, interact.js).

Danh sach 20 route va nhan hien tren sidebar lay tu
reference/source/localstorage_stores.json (menu-store that), KHONG tu
suy doan.
"""
import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))
NGUON = os.path.join(BASE, '..', 'reference', 'source')
DICH = os.path.join(BASE, 'www')

# Route THAT co bang chung desktop day du -- KHONG gom home/wizard (khong
# co noi dung that, xem CLAUDE.md muc 0 va ISSUES.md 2026-08-12).
ROUTES = [
    'home__overview', 'home__topology', 'status__devices',
    'wifi__general', 'wifi__advanced',
    'advanced__wan', 'advanced__lan', 'advanced__ddns', 'advanced__routing',
    'advanced__dmz', 'advanced__upnp', 'advanced__tcpdump',
    'network__portforward', 'network__speedtest', 'network__diagnostics',
    'security__firewall',
    'system__general', 'system__upgrade', 'system__user',
    'help',
]

# Bien the tab -- CHI cac trang thuc su co nhieu tab (do tren thiet bi that,
# xem ISSUES.md 2026-08-11/12).
TAB = {
    'home__overview': 5, 'wifi__general': 3, 'wifi__advanced': 2,
    # advanced__lan: 3 tab tren thiet bi that (General/Guest LAN/Reserved
    # IP), nhung tab Guest LAN CHI hien khi interfaces/configurations ban
    # ghi usage=Guest co enabled=true (do that 2026-08-18, xem
    # reference/source/advanced__lan__t2.html + reference/har/
    # advanced__lan_guest_bat.har -- anh Huynn bat Wi-Fi Guest Network
    # roi chup lai). Ban chup __t0/__t1 CU van chi thay 2 tab (guest tat
    # luc chup) -- KHONG sua lai 2 ban chup do, vi do la dung trang thai
    # that luc do. lan_binding.js tu chen/xoa nut tab thu 3 luc chay theo
    # du lieu song, xem ISSUES.md.
    'advanced__lan': 3, 'advanced__routing': 2, 'system__general': 2,
    'system__upgrade': 3,
}

# Nhan hien tren sidebar -> ten trang, trich tu localStorage["menu-store"]
# THAT (reference/source/localstorage_stores.json). "Advanced" bi trung ten
# giua nhom cha /advanced va muc con wifi/advanced -- phan biet bang co icon
# hay khong (nhu thiet bi that: muc CO icon la nhom cha).
MAP = {
    "Overview": "home__overview", "Topology": "home__topology",
    "WAN": "advanced__wan", "LAN": "advanced__lan",
    "Dynamic DNS": "advanced__ddns", "Static Routing": "advanced__routing",
    "DMZ": "advanced__dmz", "UPnP": "advanced__upnp", "TCPDump": "advanced__tcpdump",
    "Port Forwarding": "network__portforward", "Speed Test": "network__speedtest",
    "Diagnostics": "network__diagnostics", "Firewall": "security__firewall",
    "System Settings": "system__general", "Update & Restore": "system__upgrade",
    "User": "system__user", "General": "wifi__general", "Help": "help",
}
GROUP = {
    "Home": "home__overview", "Wi-Fi": "wifi__general",
    "Network": "network__portforward", "Security": "security__firewall",
    "System": "system__general", "Advanced": "advanced__wan",
}

# Script dung chung, nap theo thu tu -- GD2 moi co phan khung (sidebar +
# nav + interact). Script rieng tung trang (binding du lieu that) se them
# o GD4 sau khi co dac ta tu GD3.
# Thu tu QUAN TRONG: binding_data.js phai nap TRUOC api_binding.js (no doc
# window.__BINDING), va api_binding.js phai nap SAU interact.js (interact
# dung lai hanh vi cong tac MUI; api_binding goi window.__simSync() cua no
# de dong bo giao dien sau khi nap gia tri tu kho).
SCRIPT_CHUNG = ['sidebar_data.js', 'dialog_data.js', 'nav.js', 'interact.js',
                'binding_data.js', 'api_binding.js',
                # Trang Wi-Fi General co logic rieng, khong dien ta duoc bang
                # bang noi chung (loc theo loai SSID, che do gop, hai PATCH
                # tuan tu). No tu kiem ten trang nen nap o moi trang cung
                # khong sao.
                'wifi_general_binding.js', 'wifi_advanced_binding.js',
                # Trang dang BANG (them/sua/xoa nhieu ban ghi) -- Port
                # Forwarding, Static Routing, Reserved IP (advanced__lan__t1).
                # Tu kiem ten trang nen nap o moi trang cung khong sao.
                'bang_binding.js',
                # Trang Advanced > LAN (tab General) -- doi hinh dang du
                # lieu + ghi hai resource, khong dien ta duoc bang chung.
                'lan_binding.js',
                # Trang Advanced > WAN -- mot lan PATCH ghi CA HAI ban ghi
                # (wan + wan6), ipVersion suy ra tu enabled cua hai ban ghi.
                'wan_binding.js',
                # Trang System > User -- kenh RIENG /oui-rpc, khac facade
                # REST cua moi trang khac (them 2026-08-18, xem file va
                # ISSUES.md). Tu kiem ten trang nen nap o moi trang cung
                # khong sao -- GIONG HET quy uoc cua cac binding khac o day.
                'system_user_binding.js',
                # Trang Security > Firewall -- quy tac lien dong giua cac o
                # ma bang noi khong dien ta duoc: "Enable All" lan truyen 2
                # chieu xuong 13 cong tac con, tat cong tac thi xoa rong
                # rate/burst, SPI tat thi khoa DoS Defense (them 2026-08-18,
                # doc tay ma goc index-eel5T8aZ.js -- xem dau file).
                'firewall_binding.js',
                # GD5 -- khung dien thoai: ngan keo (menu) va thanh tren.
                # Tu kiem ten trang, chi lam viec tren cac trang m_*.
                'ngan_keo_data.js', 'khung_dien_thoai.js']

# ---------------------------------------------------------------- GD 5
# Diem gay giua giao dien MAY TINH va DIEN THOAI: 900px.
# DO TU MA GOC, khong doan: index-CW0UhNxy.js, component khung n8():
#     o = el(n.breakpoints.down("md"))     -> md = max-width 899.95px
#     !o && <thanh ben>        (may tinh)
#      o && <Drawer anchor="top">  (dien thoai)
# Xac nhan cheo: tieu de trang ("WAN Settings") chi render khi
# breakpoints.down("md") -- va no CHI co trong ban chup m_advanced__wan.html,
# khong co trong ban may tinh.
# (STATUS.md truoc day ghi nham la 600px -- da sua.)
DIEM_GAY_DIEN_THOAI = '(max-width: 899.95px)'

# Tien to file ban dien thoai. Ban chup goc dung cung tien to nay.
TIEN_TO_DT = 'm_'


KHUON_MAU = os.path.join(BASE, 'khuon_mau')

# wifi__general tab Primary (t0) va Guest (t1): ban chup goc CHI co 1 hop
# mang (che do GOP, "networks.1.*"). Tren thiet bi that, cong tac "Use
# separate network" doi client-side sang 2 hop rieng (2.4GHz/5GHz) --
# KHONG doi route/tai trang, chi React re-render. Kien truc "file tinh
# moi tab" cua du an khong tu tao/xoa hop duoc.
#
# Da do truc tiep 2026-08-18 (Chrome MCP, khong Save): cau truc 1 hop luc
# tach O PRIMARY GIONG HET cau truc hop cua SmartHome (tab __t2, DA co san
# 2 hop vi duoc chup luc dang tach that). Trich XAC MINH bang taCay() qua
# javascript_tool -- cung lop css-x4cyn9/css-1hvx68w/css-u7qq7e..., cung
# ten networks.0.*/networks.1.*. => Dung LAI khuon mau tu __t2.html (da co
# trong reference/, KHONG sua file do) lam nguon cho 2 hop TACH cua
# Primary/Guest, thay vi chup rieng (cong cu javascript_tool chan chuoi
# HTML dai -- xem ISSUES.md). Trich bang thuat toan dem do sau
# (cat_khoi_div, cung kieu cat_root() o day), da xoa gia tri mat khau that
# truoc khi luu vao src/khuon_mau/ -- xem do_xoa_mat_khau trong
# reference/source/do_security_mode_wifi_tach_day_du.json (khong, xem
# ISSUES.md muc "wifi__general Primary/Guest tach hop").
_KHUON_MAU_TACH = None


def _doc_khuon_mau_tach():
    global _KHUON_MAU_TACH
    if _KHUON_MAU_TACH is not None:
        return _KHUON_MAU_TACH
    with open(os.path.join(KHUON_MAU, 'wifi_box_24ghz.html'), encoding='utf-8') as f:
        box24 = f.read()
    with open(os.path.join(KHUON_MAU, 'wifi_box_5ghz.html'), encoding='utf-8') as f:
        box5 = f.read()
    _KHUON_MAU_TACH = (box24, box5)
    return _KHUON_MAU_TACH


def _chen_khuon_mau_wifi_tach(ten, root_html):
    """Chen 2 khuon mau hop TACH (an, display:none) vao cuoi #root cho
    wifi__general tab Primary (t0) va Guest (t1) -- KHONG dung cho
    SmartHome (t2, da co san 2 hop that trong ban chup) hay cac trang
    khac. wifi_general_binding.js se hien/an dung theo du lieu API that
    (khong tu doan)."""
    # 'wifi__general' (KHONG hau to __tN) la route MAC DINH cua Primary --
    # nguon giong het __t0.html (48822 byte, cung noi dung) nhung la 2
    # FILE DICH rieng (route khac nhau tra ve file khac nhau). Phai chen
    # ca hai, khong chi __t0.
    if ten not in ('wifi__general', 'wifi__general__t0', 'wifi__general__t1'):
        return root_html
    box24, box5 = _doc_khuon_mau_tach()
    chen = (
        '<div id="khuon-mau-wifi-tach" style="display:none" '
        'aria-hidden="true">'
        '<div id="khuon-mau-wifi-24ghz">' + box24 + '</div>'
        '<div id="khuon-mau-wifi-5ghz">' + box5 + '</div>'
        '</div>'
    )
    if not root_html.endswith('</div>'):
        raise ValueError('root_html khong ket thuc bang </div> -- cau truc bat thuong')
    return root_html[:-len('</div>')] + chen + '</div>'


def cat_root(html):
    """Cat chinh xac <div id="root">...</div> bang dem do sau, bo qua rac
    tien ich Chrome truoc/sau no."""
    i = html.find('<div id="root">')
    if i < 0:
        raise ValueError('khong tim thay <div id="root"> trong ban chup')
    j = i
    do_sau = 0
    trong_the = re.compile(r'<(/?)div\b[^>]*>')
    for m in trong_the.finditer(html, i):
        if m.group(1):  # </div>
            do_sau -= 1
            if do_sau == 0:
                j = m.end()
                break
        else:
            do_sau += 1
    return html[i:j]


def _script_chuyen_layout(co_ban_dt):
    """Doan script chuyen giua ban may tinh va ban dien thoai.

    Vi sao phai chuyen bang cach TAI TRANG KHAC chu khong doi tai cho:
    ban chup dien thoai co MARKUP KHAC HAN (khong co thanh ben, trang
    Overview mat ca 5 the tab), khong phai chi khac CSS -- nen khong the
    dung media query. Doi markup tai cho thi phai khoi dong lai ca 6
    module noi du lieu, ma cac module do dang danh dau "da gan" ngay tren
    #root -> de sinh dung loai loi da can phai nhieu lan. Tai trang moi
    thi moi script chay lai sach se.

    Dat trong <head> va chay NGAY (khong doi DOMContentLoaded) de doi
    truoc khi trinh duyet ve xong -- tranh nhap nhay.
    """
    # Danh sach route CO ban dien thoai -- de biet truoc, khong bao gio
    # chuyen sang mot file khong ton tai (tranh 404).
    # Vi du that: trang Overview tren dien thoai KHONG CO tab (da doi
    # chieu ban chup: 0 phan tu role="tab"), nen 5 bien the
    # home__overview__t0..t4 khong co ban dien thoai. Khi dang o mot bien
    # the tab ma thu nho cua so, phai lui ve route goc (home__overview).
    ds = json.dumps(sorted(co_ban_dt))
    return (
        '<script>(function(){'
        'var CO=' + ds + ';'
        'var P=' + json.dumps(TIEN_TO_DT) + ';'
        'var mq=window.matchMedia(' + json.dumps(DIEM_GAY_DIEN_THOAI) + ');'
        # EP CHE DO bang tham so URL: ?dt=1 ep ban dien thoai, ?dt=0 ep ban
        # may tinh. Dung khi cua so khong thu nho duoc (dang bung toi da),
        # va tien khi day hoc tren may chieu: mo thang ban dien thoai ma
        # khong phai keo cua so. Tham so duoc GIU khi chuyen trang.
        'var ep=(new URLSearchParams(location.search)).get("dt");'
        'function xet(){'
        'var DT=(ep==="1")?true:((ep==="0")?false:mq.matches);'
        'var f=(location.pathname.split("/").pop()||"").replace(".html","");'
        'if(!f)return;'
        'var laDT=f.indexOf(P)===0;'
        'var route=laDT?f.slice(P.length):f;'
        'if(DT===laDT)return;'
        'var dich;'
        'if(DT){'
        # sang dien thoai: neu bien the tab khong co ban dien thoai thi
        # lui ve route goc (bo duoi __tN)
        'var r=(CO.indexOf(route)>=0)?route:route.replace(/__t\\d+$/,"");'
        'if(CO.indexOf(r)<0)return;'
        'dich=P+r;'
        '}else{dich=route;}'
        'if(dich===f)return;'
        'location.replace(dich+".html"+location.search+location.hash);'
        '}'
        'xet();'
        # Doi kich thuoc cua so khi dang mo trang thi cung phai chuyen --
        # tren thiet bi that React ve lai ngay, o day thi tai trang tuong ung.
        'if(mq.addEventListener)mq.addEventListener("change",xet);'
        'else if(mq.addListener)mq.addListener(xet);'
        '})();</script>\n'
    )


def sinh_trang(ten, root_html, la_dien_thoai=False, co_ban_dt=()):
    map_json = json.dumps(MAP, ensure_ascii=False)
    group_json = json.dumps(GROUP, ensure_ascii=False)
    pages_json = json.dumps(sorted(_TOAN_BO_TEN), ensure_ascii=False)
    pages_dt_json = json.dumps(sorted(co_ban_dt), ensure_ascii=False)
    scripts = ''.join(f'<script src="/{s}"></script>' for s in SCRIPT_CHUNG)
    return (
        '<!doctype html><html lang="en"><head><meta charset="UTF-8">\n'
        '<meta name="viewport" content="width=device-width, initial-scale=1.0">\n'
        '<title>Actiontec</title>\n'
        '<link rel="icon" type="image/svg+xml" href="/custom/icon.svg">\n'
        '<link rel="stylesheet" href="/emotion.css">\n'
        '<style>#root [class*=css-]{}</style>\n'
        + _script_chuyen_layout(co_ban_dt) +
        '</head><body>\n\n    ' + root_html + '\n'
        f'<script>window.__MAP={map_json};window.__GROUP={group_json};'
        f'window.__PAGES={pages_json};window.__PAGES_DT={pages_dt_json};'
        f'window.__LA_DIEN_THOAI={"true" if la_dien_thoai else "false"};</script>\n'
        f'{scripts}\n</body></html>'
    )


def main():
    global _TOAN_BO_TEN
    os.makedirs(DICH, exist_ok=True)

    # danh sach toan bo ten trang (ke ca bien the tab) -- dung cho __PAGES
    _TOAN_BO_TEN = set(ROUTES)
    for goc, so_tab in TAB.items():
        for i in range(so_tab):
            _TOAN_BO_TEN.add(f'{goc}__t{i}')

    # --- luot 1: xem route nao CO ban chup dien thoai (phai biet TRUOC vi
    #     danh sach nay duoc nhung vao script chuyen layout cua MOI trang)
    co_ban_dt = []
    for goc in ROUTES:
        for ten in [goc] + [f'{goc}__t{i}' for i in range(TAB.get(goc, 0))]:
            if os.path.exists(os.path.join(NGUON, f'{TIEN_TO_DT}{ten}.html')):
                co_ban_dt.append(ten)

    da_ghi = []
    da_ghi_dt = []
    for goc in ROUTES:
        ten_file_list = [goc] + [f'{goc}__t{i}' for i in range(TAB.get(goc, 0))]
        for ten in ten_file_list:
            # --- ban may tinh
            nguon_p = os.path.join(NGUON, f'{ten}.html')
            if os.path.exists(nguon_p):
                with open(nguon_p, encoding='utf-8') as f:
                    raw = f.read()
                root_html = _chen_khuon_mau_wifi_tach(ten, cat_root(raw))
                trang = sinh_trang(ten, root_html, la_dien_thoai=False,
                                   co_ban_dt=co_ban_dt)
                with open(os.path.join(DICH, f'{ten}.html'), 'w', encoding='utf-8') as f:
                    f.write(trang)
                da_ghi.append(ten)
            else:
                print(f'  [THIEU] {ten}.html -- khong co trong reference/source/')

            # --- ban dien thoai (GD5). Ban chup nao khong co thi BO QUA,
            #     khong bia: trang do se khong co ban dien thoai va script
            #     chuyen layout se khong tim thay file -> may chu tra 404.
            #     Danh sach thieu in ra cuoi de theo doi.
            nguon_dt = os.path.join(NGUON, f'{TIEN_TO_DT}{ten}.html')
            if os.path.exists(nguon_dt):
                with open(nguon_dt, encoding='utf-8') as f:
                    raw_dt = f.read()
                trang_dt = sinh_trang(ten, cat_root(raw_dt), la_dien_thoai=True,
                                      co_ban_dt=co_ban_dt)
                with open(os.path.join(DICH, f'{TIEN_TO_DT}{ten}.html'), 'w',
                          encoding='utf-8') as f:
                    f.write(trang_dt)
                da_ghi_dt.append(ten)

    print(f'\nDa dung {len(da_ghi)} trang MAY TINH va {len(da_ghi_dt)} trang '
          f'DIEN THOAI vao {DICH}')
    thieu = _TOAN_BO_TEN - set(da_ghi)
    if thieu:
        print(f'CANH BAO: {len(thieu)} trang co trong danh sach nhung KHONG dung duoc: {sorted(thieu)}')
    thieu_dt = _TOAN_BO_TEN - set(da_ghi_dt)
    if thieu_dt:
        print(f'CHUA CO BAN DIEN THOAI ({len(thieu_dt)}): {sorted(thieu_dt)}')


if __name__ == '__main__':
    main()
