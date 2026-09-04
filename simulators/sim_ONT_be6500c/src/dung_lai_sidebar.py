#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Dung lai sidebar cho ban gia lap BE6500C cho DUNG voi thiet bi that.

BOI CANH (2026-08-10, do truc tiep tren thiet bi that qua Chrome):
  - Sidebar that MAC DINH THU GON (52px, chi icon, KHONG co nhan chu,
    KHONG co submenu).
  - Re chuot vao -> React goi onMouseEnter tren chinh phan tu .css-1hiau50,
    them class "isExpand" (CSS co san: .css-1hiau50.isExpand{width:160px}),
    DONG THOI render them nhan chu + submenu cua DUNG nhom dang active.
  - Re chuot ra -> onMouseLeave, bo class, go bo nhan chu + submenu.
  - Nut hamburger (data-testid="MenuIcon") o #right-layout co
    display:none tren desktop -> KHONG PHAI nut thu gon sidebar
    (do la nut cho giao dien mobile). Ban gia lap truoc day gan click
    vao nut nay de thu gon -> HANH VI BIA, da bo.

Ban gia lap la HTML tinh nen khong the "render lai" nhu React. Cach lam:
luu san CA HAI ban markup that (thu gon + mo rong) roi hoan doi khi
mouseenter/mouseleave -> DOM ket qua trung khop voi thiet bi that o ca hai
trang thai (dat muc 2 that su, khong phai gia lap bang CSS an/hien).

Bang chung dung o day (deu chup truc tiep tu 192.168.1.1):
  reference/source/sidebar_gon_<nhom>.html  - 6 nhom, ban THU GON
  reference/source/sbgon_help.html          - trang Help, ban THU GON
  reference/source/sb_<ten-trang>.html      - 25 route, ban MO RONG
    (moi route co Mui-selected rieng dung o muc con dang xem)
"""
import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(BASE, '..', 'reference', 'source')
WWW = os.path.join(BASE, 'www')

NHOM_THEO_TIEN_TO = {
    'home': 'home', 'wifi': 'wifi', 'network': 'network',
    'security': 'security', 'system': 'system', 'advanced': 'advanced',
}


def doc(p):
    with open(p, encoding='utf-8') as f:
        return f.read()


def tim_khoi_can_bang(s, i):
    """i = chi so ky tu '<' cua the <div ...> mo. Tra ve chi so KET THUC
    (sau '</div>' dong tuong ung), dem long nhau."""
    j = s.index('>', i) + 1
    sau = 1
    for m in re.finditer(r'<div\b|</div>', s[j:]):
        sau += 1 if m.group().startswith('<div') else -1
        if sau == 0:
            return j + m.end()
    raise ValueError('khong tim duoc the dong can bang')


def khoi_sidebar(s):
    """Tra ve (dau, cuoi) cua khoi <div ... css-1hiau50>...</div>."""
    m = re.search(r'<div class="[^"]*css-1hiau50"', s)
    if not m:
        return None
    return m.start(), tim_khoi_can_bang(s, m.start())


def nhom_cua(ten_trang):
    goc = re.sub(r'__t\d+$', '', ten_trang)
    tien_to = goc.split('__')[0]
    return NHOM_THEO_TIEN_TO.get(tien_to)


def main():
    # ---- 1. Gom ban MO RONG that cua tung route
    mo_rong = {}
    for f in sorted(os.listdir(REF)):
        m = re.fullmatch(r'sb_(.+)\.html', f)
        if m:
            mo_rong[m.group(1)] = doc(os.path.join(REF, f)).strip()

    # ---- 2. Gom ban THU GON that theo nhom (+ help)
    thu_gon = {}
    for g in NHOM_THEO_TIEN_TO:
        p = os.path.join(REF, f'sidebar_gon_{g}.html')
        if os.path.exists(p):
            thu_gon[g] = doc(p).strip()
    p_help = os.path.join(REF, 'sbgon_help.html')
    if os.path.exists(p_help):
        thu_gon['help'] = doc(p_help).strip()

    print(f'Bang chung: {len(mo_rong)} ban mo rong, {len(thu_gon)} ban thu gon')

    # ---- 3. Sinh sidebar_data.js (nap boi moi trang)
    js = (
        '/* Markup sidebar THAT, chup truc tiep tu thiet bi 192.168.1.1\n'
        '   ngay 2026-08-10 (xem src/dung_lai_sidebar.py de biet cach lay).\n'
        '   KHONG SUA TAY file nay -- sinh tu dong tu reference/source/.\n'
        '   __SB_GON  : ban thu gon, theo NHOM (trong 1 nhom moi trang giong nhau\n'
        '               vi thu gon khong hien submenu) -- da kiem chung bang diff.\n'
        '   __SB_MO   : ban mo rong, theo TUNG TRANG (khac nhau o Mui-selected). */\n'
        'window.__SB_GON=' + json.dumps(thu_gon, ensure_ascii=False) + ';\n'
        'window.__SB_MO=' + json.dumps(mo_rong, ensure_ascii=False) + ';\n'
    )
    with open(os.path.join(WWW, 'sidebar_data.js'), 'w', encoding='utf-8') as f:
        f.write(js)
    print(f'Da ghi sidebar_data.js ({len(js)} byte)')

    # ---- 4. Thay sidebar trong tung trang bang ban THU GON dung nhom
    doi, bo_qua = [], []
    for f in sorted(os.listdir(WWW)):
        if not f.endswith('.html'):
            continue
        ten = f[:-5]
        goc = re.sub(r'__t\d+$', '', ten)
        if ten == 'index':
            goc, g = 'home__overview', 'home'
        elif goc == 'help':
            g = 'help'
        else:
            g = nhom_cua(ten)
        if not g or g not in thu_gon:
            bo_qua.append((f, 'khong xac dinh duoc nhom'))
            continue

        s = doc(os.path.join(WWW, f))
        vt = khoi_sidebar(s)
        if not vt:
            bo_qua.append((f, 'khong tim thay khoi sidebar'))
            continue
        d, c = vt
        if s[d:c].strip() == thu_gon[g]:
            continue  # da dung roi
        moi = s[:d] + thu_gon[g] + s[c:]
        # nap sidebar_data.js truoc nav.js
        if 'sidebar_data.js' not in moi:
            moi = moi.replace('<script src="/nav.js"></script>',
                              '<script src="/sidebar_data.js"></script>'
                              '<script src="/nav.js"></script>', 1)
        with open(os.path.join(WWW, f), 'w', encoding='utf-8') as fh:
            fh.write(moi)
        doi.append((f, g, goc))

    print(f'\nDa thay sidebar (ve ban THU GON that): {len(doi)} trang')
    if bo_qua:
        print(f'Bo qua {len(bo_qua)} trang:')
        for f, ly_do in bo_qua:
            print(f'  - {f}: {ly_do}')

    thieu = sorted({goc for _, _, goc in doi if goc not in mo_rong})
    if thieu:
        print('\nCANH BAO - chua co ban MO RONG cho:', thieu)


if __name__ == '__main__':
    main()
