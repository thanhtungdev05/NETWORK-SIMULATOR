#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Them submenu Home (Overview/Topology/Ethernet Status) vao sidebar cua cac
trang thuoc nhom Home, lay NGUYEN VAN tu reference/source/home_menu_mo.html
(ban chup that luc nhom Home dang mo, 2026-08-10).

Chi chen dung khoi <div class="MuiCollapse-root...">...</div> da xac nhan
la markup that -- khong sua, khong bia gi them.

Luu y: khoi nay chup luc dang o trang Overview nen "Overview" duoc danh dau
Mui-selected. Cac trang home__topology.html / home__lanstatus.html sau khi
chen se VAN hien Overview la muc dang chon (chua dung 100% cho rieng may
trang do) -- ghi ro vao ISSUES.md, KHONG tu sua lai vi chua co bang chung
rieng cho 2 trang nay.
"""
import re

REF = '../reference/source'
WWW = 'www'

TARGET_FILES = [
    'home__overview.html', 'home__overview__t0.html', 'home__overview__t1.html',
    'home__overview__t2.html', 'home__overview__t3.html', 'home__overview__t4.html',
    'home__topology.html', 'home__lanstatus.html', 'index.html',
]


def tim_khoi_can_bang(s, i_mo):
    m = re.match(r'<div\b[^>]*>', s[i_mo:])
    pos = i_mo + m.end()
    depth = 1
    for mm in re.finditer(r'<div\b[^>]*>|</div>', s[pos:]):
        depth += 1 if not mm.group(0).startswith('</div') else -1
        if depth == 0:
            return pos + mm.end()
    raise RuntimeError('khong tim thay the dong')


def main():
    src = open(f'{REF}/home_menu_mo.html', encoding='utf-8').read()
    i = src.find('>Home</h6>')
    assert i > 0
    j0 = src.find('<div class="MuiCollapse-root', i)
    j1 = tim_khoi_can_bang(src, j0)
    khoi_home = src[j0:j1]
    print('do dai khoi Home trich duoc:', len(khoi_home))
    assert 'Overview' in khoi_home and 'Topology' in khoi_home and 'Ethernet Status' in khoi_home

    for f in TARGET_FILES:
        path = f'{WWW}/{f}'
        s = open(path, encoding='utf-8').read()
        m = re.search(r'>Home</h6></div>', s)
        if not m:
            print(f'{f}: KHONG TIM THAY diem chen, bo qua')
            continue
        if 'MuiCollapse-root' in s[m.end():m.end() + 40]:
            print(f'{f}: da co Collapse ngay sau Home, khong dung vao')
            continue
        moi = s[:m.end()] + khoi_home + s[m.end():]
        with open(path, 'w', encoding='utf-8') as fh:
            fh.write(moi)
        print(f'{f}: DA CHEN submenu Home ({len(khoi_home)} ky tu)')


if __name__ == '__main__':
    main()
