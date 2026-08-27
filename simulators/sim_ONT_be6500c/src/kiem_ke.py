#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Kiem ke tien do muc 4 cua tung trang -- DO chu khong uoc luong.

Voi moi file HTML trong src/www:
  - dem so o nhap (input/select/textarea co thuoc tinh name)
  - xem trang do da nap script noi du lieu nao
  - doi chieu voi cac bang noi (binding, nhan, display) de biet bao nhieu o
    da duoc noi vao kho cau hinh
  - phan biet DOC (nap gia tri tu kho) va GHI (co duong PATCH)

Chay: python src/kiem_ke.py
"""
import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))
WWW = os.path.join(BASE, 'www')
SPEC = os.path.join(BASE, '..', 'spec')


def doc_json(p, mac_dinh=None):
    p = os.path.join(SPEC, p)
    if not os.path.exists(p):
        return mac_dinh if mac_dinh is not None else {}
    with open(p, encoding='utf-8') as f:
        return json.load(f)


def goc_cua(ten):
    g = re.sub(r'__t\d+$', '', ten)
    return 'home__overview' if g == 'index' else g


# 4 resource moi trang deu goi (du lieu khung/sidebar), khong tinh la
# "du lieu rieng cua trang"
CHUNG = {'devices', 'ssids', 'system/info', 'wizard'}


def khong_co_du_lieu(goc, mp, seed):
    """Moi resource RIENG cua trang deu rong tren thiet bi that?

    Dung de phan biet 'chua lam' voi 'khong co gi de lam'. Vd trang
    Topology / Port Forwarding / Static Routing: API tra mang rong nen
    thiet bi that cung chi hien bang trong -- ban chup tinh da dung.
    """
    res = [r for r in mp.get(goc, []) if r not in CHUNG]
    if not res:
        return True                      # khong goi API rieng nao
    for r in res:
        v = seed.get(r)
        if isinstance(v, list) and len(v) == 0:
            continue
        if v in (None, {}, ''):
            continue
        return False                     # co it nhat 1 resource co du lieu
    return True


def main():
    binding = doc_json('binding.json').get('binding', {})
    for trang, muc in doc_json('binding_thu_cong.json').items():
        if trang.startswith('_'):
            continue
        binding.setdefault(trang, {}).update(
            {k: v for k, v in muc.items() if not k.startswith('_')})
    nhan = {k: v for k, v in doc_json('nhan_binding.json').items()
            if not k.startswith('_')}
    disp = doc_json('display_binding.json')
    display = dict(disp.get('binding', {}))
    for t, v in disp.get('_tuong_duong', {}).items():
        display.setdefault(t, {}).update(v)

    # Trang co JS chuyen dung: doc VA ghi vao kho
    CO_GHI = {
        'wifi__general': 'wifi_api.js',
        'system__wifitimer': 'timer_binding.js',
        'system__reboottimer': 'timer_binding.js',
    }
    # Trang co JS chuyen dung chi DOC
    CO_GHI['network__portforward'] = 'portforward_binding.js + POST/DELETE'
    CO_GHI['advanced__routing'] = 'routing_binding.js + POST/DELETE'
    CO_GHI['advanced__lan__t1'] = 'reserved_binding.js + POST/DELETE'
    # 3 trang HANH DONG: khong co API GET de nap, nhung nut da goi dung
    # endpoint + dung body nhu thiet bi that (hanh_dong_binding.js)
    CO_GHI['network__diagnostics'] = 'hanh_dong_binding.js (POST diagnostic)'
    CO_GHI['advanced__tcpdump'] = 'hanh_dong_binding.js (POST tcpdump)'
    CO_GHI['system__user'] = 'hanh_dong_binding.js (kiem tra 2 o khop, khong luu mat khau)'
    CO_GHI['system__techsupportinfo'] = 'techsupport_binding.js (POST logpull + poll 2s)'
    CHI_DOC_JS = {
        'home__overview': 'overview_binding.js + nhan_binding.js',
        'home__lanstatus': 'lanstatus_binding.js',
        'system__systemlog': 'systemlog_binding.js',
    }

    mp = json.load(open(os.path.join(BASE, '..', 'reference', 'source',
                                     'map_trang_api.json'), encoding='utf-8'))
    seed = doc_json('seed_api.json').get('du_lieu', {})
    methods = doc_json('api_methods.json')

    hang = []
    for f in sorted(os.listdir(WWW)):
        if not f.endswith('.html'):
            continue
        ten = f[:-5]
        goc = goc_cua(ten)
        s = open(os.path.join(WWW, f), encoding='utf-8').read()
        o_nhap = set(re.findall(
            r'<(?:input|select|textarea)\b[^>]*\bname="([^"]+)"', s))

        b = dict(binding.get(goc, {}))
        b.update(binding.get(ten, {}))
        o_noi = len(o_nhap & set(b))
        # o co the GHI: resource (hoac resource_ghi) cho PATCH theo ma goc
        o_ghi = 0
        for t in (o_nhap & set(b)):
            r = b[t].get('resource_ghi') or b[t]['resource']
            if 'PATCH' in methods.get('api/v1/data/' + r, ['PATCH']):
                o_ghi += 1

        vung = len(nhan.get(goc, {})) + len(display.get(goc, {}))

        if ten in CO_GHI or goc in CO_GHI:
            muc, ghi_chu = 4, 'doc+ghi (' + CO_GHI.get(ten, CO_GHI.get(goc, '')) + ')'
        elif goc in CHI_DOC_JS:
            muc, ghi_chu = 3, 'chi doc (' + CHI_DOC_JS[goc] + ')'
        elif o_ghi:
            muc, ghi_chu = 4, f'doc+ghi (api_binding, {o_ghi}/{o_noi} o ghi duoc)'
        elif o_noi:
            muc, ghi_chu = 3, 'chi doc (resource chi doc)'
        elif not o_nhap and khong_co_du_lieu(goc, mp, seed):
            # Trang khong co o nhap NAO va moi resource rieng cua no deu
            # rong tren thiet bi that -> ban chup tinh da la trang thai DUNG,
            # khong con gi de noi. Vd Topology hien "No data to display".
            muc, ghi_chu = 4, 'dung san (thiet bi that khong co du lieu)'
        else:
            muc, ghi_chu = 2, 'chua noi'

        hang.append((ten, len(o_nhap), o_noi, vung, muc, ghi_chu))

    print(f'{"Trang":<30}{"O nhap":>7}{"Da noi":>7}{"Vung":>6}{"Muc":>5}  Ghi chu')
    print('-' * 92)
    for t, tong, noi, v, muc, gc in hang:
        print(f'{t:<30}{tong:>7}{noi:>7}{v:>6}{muc:>5}  {gc}')

    tong_o = sum(h[1] for h in hang)
    tong_noi = sum(h[2] for h in hang)
    tong_vung = sum(h[3] for h in hang)
    theo_muc = {}
    for h in hang:
        theo_muc[h[4]] = theo_muc.get(h[4], 0) + 1

    print('-' * 92)
    print(f'Tong: {len(hang)} trang | o nhap {tong_noi}/{tong_o} '
          f'({100*tong_noi//max(tong_o,1)}%) | vung hien thi da noi: {tong_vung}')
    for m in sorted(theo_muc, reverse=True):
        print(f'  muc {m}: {theo_muc[m]} trang')

    # Diem muc 4 co trong so: trang doc+ghi = 1.0, chi doc = 0.5, chua noi = 0
    diem = sum(1.0 if h[4] == 4 else (0.5 if h[4] == 3 else 0) for h in hang)
    con_lai = [h[0] for h in hang if h[4] == 2]
    print(f'\nTien do muc 4 (trang doc+ghi = 1, chi doc = 0.5): '
          f'{diem:.1f}/{len(hang)} = {100*diem/len(hang):.0f}%')
    if con_lai:
        print(f'\nCon {len(con_lai)} trang thuc su chua lam:')
        for t in con_lai:
            print('   -', t)


if __name__ == '__main__':
    main()
