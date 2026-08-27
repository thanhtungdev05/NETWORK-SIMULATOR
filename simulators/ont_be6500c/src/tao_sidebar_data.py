#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sinh src/www/sidebar_data.js cho ONT-BE6500C tu ban chup 2 trang thai THAT.

Nguon: reference/source/sidebar_2_trang_thai.json -- chup truc tiep tren
thiet bi that 192.168.1.1 ngay 2026-08-12 bang cach doc __reactProps$ cua
.css-1hiau50 va goi onMouseEnter/onMouseLeave, luu lai innerHTML cua
.css-1nmx4e2 o CA HAI trang thai, cho 20/21 route (home/wizard KHONG co
sidebar -- xem CLAUDE.md muc 0, day la hanh vi that, khong phai thieu).

window.__SB_GON : ban THU GON, gom nhom theo NHOM MENU (trong 1 nhom cac
    trang giong het nhau vi thu gon khong hien submenu/nhan chu -- da xac
    nhan bang so sanh chuoi, 20 route -> chi 7 gia tri khac nhau).
window.__SB_MO  : ban MO RONG, theo TUNG TRANG (khac nhau o Mui-selected).

CHU Y DAC BIET: 'status__devices' khong nam trong menu-store (khong phai
mot muc menu that), nhung ban GON cua no o thiet bi that GIONG HET nhom
'home' (da doi chieu tung ky tu). Vi vay o day gan status__devices vao
nhom 'home'. Day la QUAN SAT THUC TE, khong phai suy luan.
"""
import json
import os
from collections import OrderedDict

BASE = os.path.dirname(os.path.abspath(__file__))
NGUON = os.path.join(BASE, '..', 'reference', 'source', 'sidebar_2_trang_thai.json')
DICH = os.path.join(BASE, 'www', 'sidebar_data.js')

# route -> nhom menu. Dac biet: status/devices gan vao 'home' (xem docstring).
_NHOM_DAC_BIET = {'status__devices': 'home'}


def nhom_cua(route):
    if route in _NHOM_DAC_BIET:
        return _NHOM_DAC_BIET[route]
    if route == 'help':
        return 'help'
    return route.split('__')[0]


def main():
    with open(NGUON, encoding='utf-8') as f:
        d = json.load(f)
    gon_theo_route = d['gon']
    mo_theo_route = d['mo']

    # GON: gom nhom, kiem tra cac trang cung nhom THAT SU giong nhau
    gon_theo_nhom = OrderedDict()
    for route, markup in gon_theo_route.items():
        nhom = nhom_cua(route)
        if nhom in gon_theo_nhom and gon_theo_nhom[nhom] != markup:
            raise SystemExit(
                f'LOI: nhom "{nhom}" co markup GON khac nhau giua cac route '
                f'-- gia dinh gom-nhom SAI, can xem lai. Route dang xet: {route}')
        gon_theo_nhom[nhom] = markup

    with open(DICH, 'w', encoding='utf-8') as f:
        f.write(
            "/* Markup sidebar THAT cua ONT-BE6500C, chup truc tiep tu thiet bi\n"
            "   192.168.1.1 ngay 2026-08-12 (xem reference/source/sidebar_2_trang_thai.json\n"
            "   va CLAUDE.md muc 0). KHONG SUA TAY file nay -- sinh tu dong bang\n"
            "   src/tao_sidebar_data.py.\n"
            "   __SB_GON : ban thu gon, theo NHOM MENU (7 nhom, da xac nhan cac trang\n"
            "              cung nhom giong het nhau).\n"
            "   __SB_MO  : ban mo rong, theo TUNG TRANG (20 route, home/wizard KHONG CO\n"
            "              sidebar nen khong co trong bang nay -- xem ISSUES.md). */\n")
        f.write("window.__SB_GON=" + json.dumps(gon_theo_nhom, ensure_ascii=False) + ";\n")
        f.write("window.__SB_MO=" + json.dumps(mo_theo_route, ensure_ascii=False) + ";\n")

    print(f'Da ghi {DICH}')
    print(f'  __SB_GON: {len(gon_theo_nhom)} nhom -> {sorted(gon_theo_nhom)}')
    print(f'  __SB_MO : {len(mo_theo_route)} trang')
    print(f'  kich thuoc file: {os.path.getsize(DICH)} byte')


if __name__ == '__main__':
    main()
