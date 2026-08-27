#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Kiem doan script CHUYEN LAYOUT (may tinh <-> dien thoai) cua GD5.

Doan script nay nam trong <head> cua MOI trang da dung (do dung_trang.py
nhung vao). No quyet dinh: dang o ban nao, co phai chuyen khong, chuyen
sang file nao. Sai o day thi nguoi dung bi nhay trang lung tung hoac roi
vao 404 -- ma loi kieu do rat kho thay bang mat.

Cach kiem: TRICH doan script that ra tu trang da dung (khong chep lai --
chep lai thi kiem nham ban sao), roi chay no trong Node voi mot
'location' + 'matchMedia' gia lap, doi chieu ket qua voi mong doi.

Chay:  python kiem_chuyen_layout.py
"""
import json
import os
import re
import subprocess
import sys
import tempfile

BASE = os.path.dirname(os.path.abspath(__file__))
WWW = os.path.join(BASE, 'www')
TRANG_MAU = 'home__overview.html'

# (dia chi dang mo, cua so co HEP khong, ket qua mong doi, mo ta)
TINH_HUONG = [
    ('home__overview.html', True, 'm_home__overview.html',
     'may tinh + cua so hep -> sang ban dien thoai'),
    ('m_home__overview.html', False, 'home__overview.html',
     'dien thoai + cua so rong -> ve ban may tinh'),
    ('home__overview__t2.html', True, 'm_home__overview.html',
     'bien the tab + hep -> lui ve route goc (dien thoai KHONG co tab)'),
    ('m_home__overview.html?dt=1', False, 'm_home__overview.html?dt=1',
     'ep dt=1 tren cua so rong -> GIU ban dien thoai'),
    ('home__overview.html?dt=1', False, 'm_home__overview.html?dt=1',
     'ep dt=1 tu ban may tinh -> sang ban dien thoai'),
    ('m_home__overview.html?dt=0', True, 'home__overview.html?dt=0',
     'ep dt=0 tren cua so hep -> ve ban may tinh'),
    ('advanced__wan.html', True, 'm_advanced__wan.html',
     'WAN + hep -> sang ban dien thoai'),
    ('m_advanced__wan.html', True, 'm_advanced__wan.html',
     'dang dung ban roi -> KHONG duoc chuyen'),
    ('m_advanced__wan.html?dt=1', False, 'm_advanced__wan.html?dt=1',
     'ep dt=1: giu nguyen ke ca khi cua so rong'),
]


def trich_script():
    p = os.path.join(WWW, TRANG_MAU)
    if not os.path.exists(p):
        sys.exit(f'Chua dung trang. Chay dung_trang.py truoc. (thieu {p})')
    with open(p, encoding='utf-8') as f:
        c = f.read()
    m = re.search(r'<script>\((function\(\)\{var CO=.*?\})\)\(\);</script>', c, re.S)
    if not m:
        sys.exit('Khong tim thay doan script chuyen layout trong ' + TRANG_MAU)
    return m.group(1)


def main():
    than = trich_script()
    js = [
        'function chay(url, hep){',
        '  let cur = url; let so = 0;',
        '  global.location = {',
        '    get pathname(){ return "/" + cur.split("?")[0]; },',
        '    get search(){ const i = cur.indexOf("?"); return i < 0 ? "" : cur.slice(i); },',
        '    get hash(){ return ""; },',
        '    replace(u){ cur = u.replace(/^\\//, ""); so++; }',
        '  };',
        '  global.window = { matchMedia: () => ({ matches: hep,'
        ' addEventListener(){}, addListener(){} }) };',
        '  global.URLSearchParams = URLSearchParams;',
        '  (' + than + ')();',
        '  return cur;',
        '}',
        'const CA = ' + json.dumps(TINH_HUONG, ensure_ascii=False) + ';',
        'let loi = 0;',
        'for (const [url, hep, mong, mota] of CA) {',
        '  const thuc = chay(url, hep);',
        '  const dat = thuc === mong;',
        '  if (!dat) loi++;',
        '  console.log((dat ? "  OK   " : "  SAI  ") + mota);',
        '  if (!dat) console.log("         mong: " + mong + "\\n         thuc: " + thuc);',
        '}',
        'console.log("");',
        'console.log(loi ? ("KET LUAN: " + loi + "/" + CA.length + " tinh huong SAI")',
        '  : ("KET LUAN: " + CA.length + "/" + CA.length + " tinh huong DAT"));',
        'process.exit(loi ? 1 : 0);',
    ]
    with tempfile.NamedTemporaryFile('w', suffix='.js', delete=False,
                                     encoding='utf-8') as f:
        f.write('\n'.join(js))
        tam = f.name
    try:
        print('--- Kiem doan script chuyen layout (trich tu '
              + TRANG_MAU + ') ---')
        r = subprocess.run(['node', tam])
        sys.exit(r.returncode)
    finally:
        os.unlink(tam)


if __name__ == '__main__':
    main()
