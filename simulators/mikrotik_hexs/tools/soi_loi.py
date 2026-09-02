#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Soi diem loi cua bo giai ma M2: in vet the ngay truoc + byte tho quanh do."""
import sys, os, struct
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src'))
import m2
HAR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'reference', 'har')

def vet_khung(b, nhan):
    het = len(b) if b[:2] == m2.MAGIC else 2 + struct.unpack(">H", b[:2])[0]
    j, vet = 2, []
    while j < het:
        if b[j] == m2.DEM and all(x == m2.DEM for x in b[j:het]):
            return True, None
        try:
            ten, kieu, gt, j2 = m2._doc_the(b, j)
        except Exception as e:
            print(f"--- {nhan}: LOI tai {j} — {e}")
            for off, tn, ki, dai, raw in vet[-6:]:
                print(f"    off={off:5d} ten=0x{tn:06x} kieu=0x{ki:02x} dai={dai:4d}  {raw}")
            for o in range(max(0, j - 24), min(len(b), j + 40), 16):
                ch = b[o:o+16]
                dau = '>>' if o <= j < o+16 else '  '
                print(f'   {dau}{o:05d}  {ch.hex(" "):<48} {"".join(chr(c) if 32<=c<127 else "." for c in ch)}')
            return False, j
        if kieu == 0xA8:
            sl = struct.unpack("<H", b[j+4:j+6])[0]; p = j + 6
            for k in range(sl):
                n = struct.unpack("<H", b[p:p+2])[0]; p += 2
                ok, _ = vet_khung(b[p:p+n], f"{nhan} > con#{k}")
                p += n
                if not ok: return False, None
        vet.append((j, ten, kieu, j2-j, b[j:j+min(j2-j, 14)].hex(' ')))
        j = j2
    return True, None

for t in (sys.argv[1:] or ['000-resp.bin']):
    d = open(os.path.join(HAR, t), 'rb').read()
    _, _, than = m2.tach_goi(d)
    ok, _ = vet_khung(than, t)
    if ok: print(f"{t}: OK")
