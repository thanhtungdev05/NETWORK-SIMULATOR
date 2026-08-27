#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sua lai sidebar cua BE6500C: chi duoc mo DUNG 1 nhom (theo trang dang xem),
dong cac nhom con lai -- giong hanh vi accordion cua thiet bi that.

Cach lam: KHONG bia noi dung. Chi xoa (khong them) cac khoi <div Collapse>
da bi "dinh" mo sai luc thu thap (dung/sai da xac nhan qua nhieu file mau).
Rieng nhom Home hien khong co file nao chup dung luc no mo -> KHONG dung
tay vao, giu nguyen (thieu, cho chup bo sung).
"""
import os, re, sys

WWW = 'www'

GROUP_OF_PREFIX = {
    'home': 'Home', 'wifi': 'Wi-Fi', 'network': 'Network',
    'security': 'Security', 'system': 'System', 'advanced': 'Advanced',
}
KNOWN_GROUPS = ['Home', 'Wi-Fi', 'Network', 'Security', 'System', 'Advanced']


def tim_khoi_can_bang(s, i_mo):
    """i_mo la vi tri ky tu '<' cua the mo <div ...>. Tra ve vi tri NGAY SAU '>' cua the
    </div> dong khoi nay (can bang dung/sai the con)."""
    m = re.match(r'<div\b[^>]*>', s[i_mo:])
    assert m, 'khong phai the div mo o vi tri nay'
    pos = i_mo + m.end()
    depth = 1
    for mm in re.finditer(r'<div\b[^>]*>|</div>', s[pos:]):
        if mm.group(0).startswith('</div'):
            depth -= 1
        else:
            depth += 1
        if depth == 0:
            return pos + mm.end()
    raise RuntimeError('khong tim thay the dong tuong ung')


def sua_1_file(path, target_group):
    s = open(path, encoding='utf-8').read()
    i0 = s.find('css-1nmx4e2')
    i1 = s.find('id="right-layout"')
    if i0 < 0 or i1 < 0:
        return None, 'khong tim thay khung sidebar'

    thay_doi = []  # list (start, end, replacement)
    for m in re.finditer(r'<h6[^>]*>([^<]+)</h6>', s):
        if m.start() < i0 or m.start() > i1:
            continue
        label = m.group(1)
        if label not in KNOWN_GROUPS:
            continue
        # tim div bao ngoai <div class="MuiBox-root css-0"> gan nhat truoc h6 nay
        khoi_mo = s.rfind('<div class="MuiBox-root css-0">', 0, m.start())
        if khoi_mo < 0:
            continue
        khoi_dong = tim_khoi_can_bang(s, khoi_mo)
        khoi = s[khoi_mo:khoi_dong]

        co_collapse = 'MuiCollapse-root' in khoi
        if label == target_group:
            continue  # dung nhom dang xem -> khong dung vao (co thi giu, thieu thi de sau)
        if co_collapse:
            # xoa DUNG khoi Collapse (con nam trong khoi nay), giu lai phan icon+h6
            j0 = khoi.find('<div class="MuiCollapse-root')
            j1 = tim_khoi_can_bang(khoi, j0)
            khoi_moi = khoi[:j0] + khoi[j1:]
            thay_doi.append((khoi_mo, khoi_dong, khoi_moi))

    if not thay_doi:
        return s, 'khong co gi de sua (co the da dung hoac thieu du lieu nhom hien tai)'

    # ap dung thay doi tu CUOI ve DAU de khong lech offset
    thay_doi.sort(key=lambda t: -t[0])
    ra = s
    for a, b, rep in thay_doi:
        ra = ra[:a] + rep + ra[b:]
    return ra, f'da dong {len(thay_doi)} nhom sai'


def main():
    ket = []
    for f in sorted(os.listdir(WWW)):
        if not f.endswith('.html'):
            continue
        base = f[:-5]
        base_noTab = re.sub(r'__t\d+$', '', base)
        prefix = base_noTab.split('__')[0]
        target = GROUP_OF_PREFIX.get(prefix)
        if not target:
            ket.append((f, 'BO QUA - khong xac dinh duoc nhom (vd status__devices)'))
            continue
        path = os.path.join(WWW, f)
        moi, ghi_chu = sua_1_file(path, target)
        if moi is None:
            ket.append((f, 'LOI: ' + ghi_chu))
            continue
        if moi != open(path, encoding='utf-8').read():
            with open(path, 'w', encoding='utf-8') as fh:
                fh.write(moi)
            ket.append((f, f'DA SUA ({target}): ' + ghi_chu))
        else:
            ket.append((f, f'khong doi ({target}): ' + ghi_chu))

    for f, gc in ket:
        print(f'{f:35} {gc}')


if __name__ == '__main__':
    main()
