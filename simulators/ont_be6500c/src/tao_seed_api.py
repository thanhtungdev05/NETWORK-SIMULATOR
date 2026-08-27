#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sinh spec/seed_api.json cho ONT-BE6500C tu ban thu API THAT.

Nguon: reference/source/api_v1_data_full.json -- GET truc tiep 39 endpoint
/api/v1/data/* tren thiet bi that 192.168.1.1 ngay 2026-08-11 (danh sach
endpoint trich tu bundle goc index-CW0UhNxy.js, xem CLAUDE.md muc 2). Chi
GET, khong sua gi tren thiet bi.

Xu ly:
  1. Cat 'system/logs' (15314 dong that) xuong 200 dong gan nhat -- de kho
     cau hinh khong phinh to vo ich. Ghi ro so dong da cat vao _ghi_chu.
  2. 4 endpoint tra "<HTTP 0>" (ket noi bi dong, khong co than phan hoi):
     diagnostic, speedTest, system, system/services/actions -- day la HANH
     VI THAT cua endpoint chi-ghi khi goi GET, khong phai loi thu thap.
     Chuyen thanh None ro rang thay vi giu chuoi tam "<HTTP 0>".
  KHONG sua gi khac. Moi resource con lai giu NGUYEN VAN.
"""
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
NGUON = os.path.join(BASE, '..', 'reference', 'source', 'api_v1_data_full.json')
DICH = os.path.join(BASE, '..', 'spec', 'seed_api.json')

GIOI_HAN_LOG = 200

# Endpoint GET tra ve rong/dong ket noi tren thiet bi that (status=0,
# type=basic, than rong) -- day la resource CHI-GHI (POST/PATCH), khong
# ho tro doc. Ghi ro trong _khong_lay_duoc thay vi bia du lieu.
_HTTP_0 = {'diagnostic', 'speedTest', 'system', 'system/services/actions'}


def main():
    with open(NGUON, encoding='utf-8') as f:
        goc = json.load(f)
    d = dict(goc['du_lieu'])

    ghi_chu = {}
    if isinstance(d.get('system/logs'), list) and len(d['system/logs']) > GIOI_HAN_LOG:
        so_dong_goc = len(d['system/logs'])
        d['system/logs'] = d['system/logs'][:GIOI_HAN_LOG]
        ghi_chu['system/logs'] = (
            f'ban that co {so_dong_goc} dong, chi giu {GIOI_HAN_LOG} dong dau '
            f'(dong moi nhat truoc) de file khong qua lon')

    khong_lay_duoc = {
        'speedTest/servers': 'thiet bi that tra 503 -- day la hanh vi THAT (giong AP)',
        'tcpdump/interfaces': 'thiet bi that tra 404 cho GET -- co the chi ho tro phuong thuc khac, can doi chieu o GD3',
    }
    for k in _HTTP_0:
        v = d.get(k)
        if isinstance(v, str) and v.startswith('<HTTP 0>'):
            d[k] = None
            khong_lay_duoc[k] = ('GET tra status=0, than rong (ket noi bi dong) -- '
                                  'nghi la resource CHI-GHI, can xac nhan o GD3')

    ra = {
        '_nguon': ('reference/source/api_v1_data_full.json -- GET truc tiep 39 endpoint '
                   '/api/v1/data/* tren ONT-BE6500C that 192.168.1.1 ngay 2026-08-11'),
        '_ghi_chu': ghi_chu,
        '_khong_lay_duoc': khong_lay_duoc,
        'du_lieu': d,
    }
    with open(DICH, 'w', encoding='utf-8') as f:
        json.dump(ra, f, ensure_ascii=False, indent=1)

    print(f'Da ghi {DICH}')
    print(f'  {len(d)} resource, {os.path.getsize(DICH)} byte')
    for k in sorted(d):
        v = d[k]
        if isinstance(v, list):
            mo_ta = f'mang {len(v)}'
        elif isinstance(v, dict):
            mo_ta = f'object {len(v)} khoa'
        elif v is None:
            mo_ta = 'None (xem _khong_lay_duoc)'
        else:
            mo_ta = type(v).__name__
        print(f'    {k:<32} {mo_ta}')


if __name__ == '__main__':
    main()
