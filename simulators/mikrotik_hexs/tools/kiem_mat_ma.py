#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
KIEM TANG MAT MA /jsproxy
==========================
X25519 doi chieu VECTOR CHUAN RFC 7748 (khong tu che ky vong), RC4-drop768,
va tinh doi xung cua ham dan xuat khoa.

LUU Y ve pham vi: bo kiem nay chung minh cac KHOI mat ma dung. No KHONG
chung minh toan bo bat tay chay duoc voi thiet bi that — phep do do se dien
ra o GD3: chinh trinh duyet that se noi vao may chu gia lap, sai khoa thi
WebFig khong chay duoc, khong the "chay nham ma van dung".
"""
import os
import sys

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "src"))
import mat_ma  # noqa: E402

so_kiem = 0
loi = []


def kiem(dk, mo_ta, chi_tiet=""):
    global so_kiem
    so_kiem += 1
    if dk:
        print(f"  OK   {mo_ta}")
    else:
        print(f"  SAI  {mo_ta}" + (f"  [{chi_tiet}]" if chi_tiet else ""))
        loi.append(mo_ta)


def main():
    print("=" * 66)
    print("  KIEM TANG MAT MA — MikroTik hEX S /jsproxy")
    print("=" * 66)

    print("\n--- A. X25519 doi chieu vector chuan RFC 7748 ---")
    bo = [
        ("a546e36bf0527c9d3b16154b82465edd62144c0ac1fc5a18506a2244ba449ac4",
         "e6db6867583030db3594c1a424b15f7c726624ec26b3353b10a903a6d0ab1c4c",
         "c3da55379de9c6908e94ea4df28d084f32eccf03491c71f754b4075577a28552"),
        ("4b66e9d4d1b4673c5ad22691957d6af5c11b6421e0ea01d42ca4169e7918ba0d",
         "e5210f12786811d3f4b7959d0538ae2c31dbe7106fc03c3efc4cd549c715a493",
         "95cbde9476e8907d7aade45cb4b873f88b595a68799fa152e6f8f7647aac7957"),
    ]
    for n, (k, u, mong) in enumerate(bo, 1):
        ra = mat_ma.x25519_chuan(bytes.fromhex(k), bytes.fromhex(u)).hex()
        kiem(ra == mong, f"A{n} vector nhan vo huong RFC 7748", ra)

    a = bytes.fromhex("77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a")
    A = "8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a"
    b = bytes.fromhex("5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb")
    B = "de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f"
    K = "4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742"
    kiem(mat_ma.x25519_chuan(a, bytes.fromhex("09"+"00"*31)).hex() == A,
         "A3 khoa cong tu khoa rieng a")
    kiem(mat_ma.x25519_chuan(b, bytes.fromhex("09"+"00"*31)).hex() == B,
         "A4 khoa cong tu khoa rieng b")
    kiem(mat_ma.x25519_chuan(a, bytes.fromhex(B)).hex() == K
         and mat_ma.x25519_chuan(b, bytes.fromhex(A)).hex() == K,
         "A5 bi mat chung hai ben trung nhau (RFC 7748 muc 6.1)")

    print("\n--- B. RC4-drop768 ---")
    r = mat_ma.RC4(b"Key")
    dau = bytes(r.gen() for _ in range(4))
    # RC4 CHUAN voi khoa "Key" bat dau bang eb 9f 77 81 — phai KHAC vi co drop768
    kiem(dau[:2] != bytes([0xEB, 0x9F]),
         "B1 co vong lam nong 768 buoc (khac RC4 thuong)", dau.hex())
    r2 = mat_ma.RC4(b"Key")
    kiem(bytes(r2.gen() for _ in range(4)) == dau, "B2 cung khoa cho cung dong khoa")
    r3 = mat_ma.RC4(b"Key2")
    kiem(bytes(r3.gen() for _ in range(4)) != dau, "B3 khoa khac cho dong khoa khac")
    r4, r5 = mat_ma.RC4(b"abc"), mat_ma.RC4(b"abc")
    tho = b"xin chao thiet bi"
    kiem(r5.xor(r4.xor(tho)) == tho, "B4 XOR hai lan tra ve ban goc")

    print("\n--- C. Dan xuat khoa (ham makeKey) ---")
    m = bytes(range(32))
    kh_tx = mat_ma.dan_xuat_khoa(m, True, False)
    kh_rx = mat_ma.dan_xuat_khoa(m, False, False)
    mc_rx = mat_ma.dan_xuat_khoa(m, False, True)
    mc_tx = mat_ma.dan_xuat_khoa(m, True, True)
    kiem(kh_tx == mc_rx, "C1 khoa GUI cua trinh duyet == khoa NHAN cua may chu")
    kiem(kh_rx == mc_tx, "C2 khoa NHAN cua trinh duyet == khoa GUI cua may chu")
    kiem(kh_tx != kh_rx, "C3 hai chieu dung khoa KHAC nhau")
    kiem(len(kh_tx) == 16, "C4 khoa dai 16 byte (sha1 cat 16 dau)")

    print("\n--- D. Dong goi / mo goi tron vong ---")
    priv_a, priv_b = bytes(range(1, 33)), bytes(range(33, 65))
    pub_a, pub_b = mat_ma.khoa_cong(priv_a), mat_ma.khoa_cong(priv_b)
    # "may chu" = phia b ; gia lap phia trinh duyet bang cach doi vai
    chu = mat_ma.PhienMayChu(7, priv_b, pub_a)
    khach_master = mat_ma.bi_mat_chung(priv_a, pub_b)
    khach_tx = mat_ma.RC4(mat_ma.dan_xuat_khoa(khach_master, True, False))
    noi_dung = b"M2" + b"\x01\x00\xff\x88\x01\x00\x07\x00\x00\x00"
    goi = (b"\x00\x00\x00\x07" + b"\x00\x00\x00\x01"
           + khach_tx.xor(noi_dung + mat_ma.DEM))
    _, _, ra = chu.giai_goi(goi)
    kiem(ra == noi_dung, "D1 may chu giai dung goi do trinh duyet ma hoa")

    print("\n--- E. Thu tu byte kieu MikroTik (doi chieu TRINH DUYET THAT) ---")
    # PHEP DO NAY DA BAT DUOC LOI THAT — DUNG XOA.
    # So doi chieu lay bang cach chay THANG trong trinh duyet cua thiet bi:
    #     Session.curve_u2a(curve25519(Session.curve_a2u(priv)))
    # Truoc do em bo qua viec curve_a2u DAO THU TU BYTE. May chu va may khach
    # thu deu sai giong nhau nen bo kiem van bao dat, nhung trinh duyet that
    # thi khong giai ma noi. Nhom A (vector RFC) KHONG bat duoc loi nay vi no
    # kiem ham chuan, con loi nam o LOP BOC.
    priv_t = bytes(range(1, 33))
    pk2_t = bytes(range(33, 65))
    kiem(mat_ma.khoa_cong(priv_t).hex()
         == "61c4b49ca099f7710d2d10b31db57468c65da0f7b8e621e1e2aefff60096790d",
         "E1 khoa cong khop so trinh duyet tinh ra", mat_ma.khoa_cong(priv_t).hex())
    pub2_t = mat_ma.khoa_cong(pk2_t)
    kiem(pub2_t.hex()
         == "5892ad818741efce76b5f0e1a52c2c53975e5f53c826a167504c657d5f599bd3",
         "E2 khoa cong thu hai khop", pub2_t.hex())
    kiem(mat_ma.bi_mat_chung(priv_t, pub2_t).hex()
         == "6c0580b91ef4ad94fd8a1b4726853a2e99b482d6c5287400b197ba9066c11c08",
         "E3 bi mat chung khop so trinh duyet tinh ra")

    print("\n" + "=" * 66)
    if loi:
        print(f"  KET LUAN: CHUA DAT — {len(loi)}/{so_kiem} phep kiem sai.")
        return 1
    print(f"  KET LUAN: {so_kiem}/{so_kiem} phep kiem DAT.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
