#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sinh spec/binding.json -- bang noi "o nhap tren trang" <-> "duong dan trong
JSON cua API".

CACH SUY RA (co bang chung, khong doan):
  1. reference/source/map_trang_api.json -- do tren thiet bi that: moi route
     goi nhung endpoint nao (nap tung trang trong iframe rieng roi doc
     performance.getEntriesByType('resource')).
  2. reference/source/o_nhap_that.json -- gia tri THAT cua tung o nhap tren
     tung trang, doc truc tiep tu DOM thiet bi that.
  3. spec/seed_api.json -- noi dung THAT cua tung endpoint.
  Ghep 3 nguon: mot o duoc coi la NOI DUOC khi tim thay duong dan JSON vua
  TRUNG TEN (duoi duong dan == ten o) vua TRUNG GIA TRI. Neu co nhieu ung
  vien -> danh dau MO HO va KHONG noi (ghi vao phan _mo_ho de xu ly rieng).

4 endpoint moi trang deu goi (devices, ssids, system/info, wizard) bi loai
khoi viec chon resource cua trang -- chung la du lieu khung/sidebar chung,
khong phai du lieu rieng cua trang.
"""
import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))
REF = os.path.join(BASE, '..', 'reference', 'source')
SPEC = os.path.join(BASE, '..', 'spec')

CHUNG = {'devices', 'ssids', 'system/info', 'wizard'}


def duyet(o, tien=''):
    if isinstance(o, dict):
        for k, v in o.items():
            yield from duyet(v, f'{tien}.{k}' if tien else k)
    elif isinstance(o, list):
        for i, v in enumerate(o):
            yield from duyet(v, f'{tien}[{i}]')
    else:
        yield tien, o


def nhu_chuoi(v):
    if isinstance(v, bool):
        return 'true' if v else 'false'
    return str(v)


def main():
    seed = json.load(open(os.path.join(SPEC, 'seed_api.json'), encoding='utf-8'))['du_lieu']
    mp = json.load(open(os.path.join(REF, 'map_trang_api.json'), encoding='utf-8'))
    onhap = json.load(open(os.path.join(REF, 'o_nhap_that.json'), encoding='utf-8'))

    binding, mo_ho, khong = {}, {}, {}

    for trang in sorted(onhap):
        res = [r for r in mp.get(trang, []) if r not in CHUNG and r in seed]
        ung = []
        for r in res:
            ung += [(r, p, v) for p, v in duyet(seed[r])]

        b, mh, kh = {}, {}, []
        for o in onhap[trang]:
            if 'LOI' in o or not o.get('name'):
                continue
            ten = o['name']
            gt = o['checked'] if o['type'] in ('checkbox', 'radio') else o['value']
            # duoi duong dan phai trung ten o (bo chi so mang cua chinh o do)
            ten_sach = re.sub(r'^\w+\.\d+\.', '', ten)
            khop = [(r, p) for r, p, v in ung
                    if re.sub(r'\[\d+\]', '', p).endswith(ten_sach)
                    and nhu_chuoi(v) == nhu_chuoi(gt)]
            khop = sorted(set(khop))
            if len(khop) == 1:
                b[ten] = {'resource': khop[0][0], 'duong_dan': khop[0][1]}
            elif len(khop) > 1:
                mh[ten] = [f'{r}:{p}' for r, p in khop]
            else:
                kh.append(ten)

        if b:
            binding[trang] = b
        if mh:
            mo_ho[trang] = mh
        if kh:
            khong[trang] = kh

    ra = {
        '_nguon': ('suy ra tu 3 nguon do truc tiep tren thiet bi that 2026-08-10: '
                   'map_trang_api.json + o_nhap_that.json + seed_api.json'),
        '_quy_tac': ('chi noi khi tim duoc DUY NHAT 1 duong dan JSON vua trung ten o '
                     'vua trung gia tri that; nhieu ung vien -> de vao _mo_ho, khong noi'),
        '_mo_ho': mo_ho,
        '_khong_tim_thay': khong,
        'binding': binding,
    }
    with open(os.path.join(SPEC, 'binding.json'), 'w', encoding='utf-8') as f:
        json.dump(ra, f, ensure_ascii=False, indent=1)

    tong_noi = sum(len(v) for v in binding.values())
    tong_mh = sum(len(v) for v in mo_ho.values())
    tong_kh = sum(len(v) for v in khong.values())
    print(f'Da ghi {SPEC}/binding.json')
    print(f'  noi duoc chac chan : {tong_noi} o  ({len(binding)} trang)')
    print(f'  mo ho (khong noi)  : {tong_mh} o')
    print(f'  khong tim thay     : {tong_kh} o')
    print()
    for t in sorted(binding):
        print(f'  {t:<28} {len(binding[t])} o')
    if mo_ho:
        print('\n  MO HO -- can bang chung them:')
        for t, d in mo_ho.items():
            for k, v in d.items():
                print(f'    {t}.{k} -> {v}')
    if khong:
        print('\n  KHONG TIM THAY duong dan:')
        for t, l in khong.items():
            print(f'    {t}: {l}')


if __name__ == '__main__':
    main()
