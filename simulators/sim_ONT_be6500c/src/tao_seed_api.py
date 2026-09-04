#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Sinh spec/seed_api.json tu ban thu API THAT.

Nguon: reference/source/api_v1_data_full.json -- thu ngay 2026-08-10 bang
cach goi truc tiep 28 endpoint /api/v1/data/* tren thiet bi that
192.168.1.1 (danh sach endpoint lay tu Network log cua chinh app khi duyet
het 25 route). Chi GET, khong sua gi tren thiet bi.

Xu ly duy nhat: cat bot 'system/logs' (17866 dong, 2.1 MB) xuong 200 dong
gan nhat -- de kho cau hinh khong phinh to vo ich. Ghi ro so dong da cat
vao _ghi_chu. MOI resource khac giu NGUYEN VAN.
"""
import json
import os

BASE = os.path.dirname(os.path.abspath(__file__))
NGUON = os.path.join(BASE, '..', 'reference', 'source', 'api_v1_data_full.json')
DICH = os.path.join(BASE, '..', 'spec', 'seed_api.json')

GIOI_HAN_LOG = 200


def main():
    with open(NGUON, encoding='utf-8') as f:
        d = json.load(f)

    ghi_chu = {}
    if isinstance(d.get('system/logs'), list) and len(d['system/logs']) > GIOI_HAN_LOG:
        goc = len(d['system/logs'])
        d['system/logs'] = d['system/logs'][:GIOI_HAN_LOG]
        ghi_chu['system/logs'] = (
            f'ban that co {goc} dong, chi giu {GIOI_HAN_LOG} dong dau '
            f'(dong moi nhat truoc) de file khong qua lon')

    ra = {
        '_nguon': ('reference/source/api_v1_data_full.json -- GET truc tiep 28 endpoint '
                   '/api/v1/data/* tren thiet bi that 192.168.1.1 ngay 2026-08-10'),
        '_ghi_chu': ghi_chu,
        '_khong_lay_duoc': {
            'speedTest/servers': 'thiet bi that tra 503 -- day la hanh vi THAT, khong phai loi thu thap',
            'pon/status': 'thiet bi that tra 501 -- AP-BE6500C khong co giao dien PON, day la hanh vi THAT'
        },
        'du_lieu': d,
    }
    with open(DICH, 'w', encoding='utf-8') as f:
        json.dump(ra, f, ensure_ascii=False, indent=1)

    print(f'Da ghi {DICH}')
    print(f'  {len(d)} resource, {os.path.getsize(DICH)} byte')
    for k in sorted(d):
        v = d[k]
        mo_ta = f'mang {len(v)}' if isinstance(v, list) else (
            f'object {len(v)} khoa' if isinstance(v, dict) else type(v).__name__)
        print(f'    {k:<32} {mo_ta}')


if __name__ == '__main__':
    main()
