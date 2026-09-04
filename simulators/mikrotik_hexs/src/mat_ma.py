#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
TANG MAT MA CUA /jsproxy — MikroTik RouterOS WebFig
====================================================

TAT CA rut tu ma goc reference/webfig/master-min-*.js va curve255-*.js,
KHONG doan. Vi tri trong ma goc ghi kem tung ham.

LUONG BAT TAY (ham makeInitialRequest + keyExchange trong master-min.js):

  1. Trinh duyet sinh khoa rieng 32 byte ngau nhien.
  2. POST /jsproxy  <- 8 byte 0 + khoa cong 32 byte   (KHONG ma hoa)
  3. May chu tra   -> [id u32 BE][4 byte][khoa cong may chu 32 byte]  (KHONG ma hoa)
  4. Hai ben tinh masterKey = X25519(khoa rieng, khoa cong doi phuong)
  5. Dan xuat 2 khoa RC4 rieng cho 2 chieu (xem dan_xuat_khoa)
  6. Tu day MOI goi deu ma hoa RC4, CA HAI CHIEU.

KHUNG GOI SAU KHI CO KHOA (ham encryptUint8Array):
    [id u32 BE][seq u32 BE][RC4(noi dung)][RC4(8 dau cach)]
  Vung dem la DUNG 8 dau cach (this.padding = 8 space trong ma goc).
  Ben nhan giai ma roi KIEM 8 byte cuoi phai bang 0x20 — dung lam phep
  kiem tinh dung dan cua khoa.
  seq tang them (do_dai_noi_dung + 8) sau moi goi.
"""
import hashlib
import struct

# --------------------------------------------------------------------------
# RC4 — ban sao 1-1 cua class RC4 trong master-min.js (~offset 4264)
# Diem KHAC RC4 chuan: sau khi nap khoa co vong lam nong 768 buoc.
# --------------------------------------------------------------------------

class RC4:
    def __init__(self, khoa):
        S = list(range(256))
        j = 0
        for i in range(256):
            j = (j + khoa[i % len(khoa)] + S[i]) & 255
            S[i], S[j] = S[j], S[i]
        self.S, self.i, self.j = S, 0, 0
        for _ in range(768):          # <- RC4-drop768, KHONG phai RC4 thuong
            self.gen()

    def gen(self):
        S = self.S
        self.i = (self.i + 1) & 255
        self.j = (self.j + S[self.i]) & 255
        S[self.i], S[self.j] = S[self.j], S[self.i]
        return S[(S[self.i] + S[self.j]) & 255]

    def xor(self, du_lieu):
        """Tuong duong cryptUint8Array — XOR thuan, khong co xu ly gi them."""
        return bytes(b ^ self.gen() for b in du_lieu)


# --------------------------------------------------------------------------
# X25519 — curve255.js clamp dung chuan:
#   f[0] &= 0xFFF8 ; f[15] = (f[15] & 0x7FFF) | 0x4000 ; c[15] &= 0x7FFF
# (tuong duong k[0]&=248 ; k[31]&=127 ; k[31]|=64)
# --------------------------------------------------------------------------

_P = 2 ** 255 - 19
_A24 = 121665


def _nhan_thang(k_bytes, u_bytes):
    k = bytearray(k_bytes)
    k[0] &= 248
    k[31] &= 127
    k[31] |= 64
    k = int.from_bytes(k, "little")
    u = int.from_bytes(u_bytes, "little") & ((1 << 255) - 1)

    x1, x2, z2, x3, z3, swap = u, 1, 0, u, 1, 0
    for t in range(254, -1, -1):
        kt = (k >> t) & 1
        swap ^= kt
        if swap:
            x2, x3 = x3, x2
            z2, z3 = z3, z2
        swap = kt
        a = (x2 + z2) % _P
        aa = a * a % _P
        b = (x2 - z2) % _P
        bb = b * b % _P
        e = (aa - bb) % _P
        c = (x3 + z3) % _P
        d = (x3 - z3) % _P
        da = d * a % _P
        cb = c * b % _P
        x3 = (da + cb) % _P
        x3 = x3 * x3 % _P
        z3 = (da - cb) % _P
        z3 = z3 * z3 % _P * x1 % _P
        x2 = aa * bb % _P
        z2 = e * (aa + _A24 * e) % _P
    if swap:
        x2, x3 = x3, x2
        z2, z3 = z3, z2
    return ((x2 * pow(z2, _P - 2, _P)) % _P).to_bytes(32, "little")


_NEN = (9).to_bytes(32, "little")


# --------------------------------------------------------------------------
# LOP BOC MIKROTIK — THU TU BYTE NGUOC VOI X25519 CHUAN
#
# Doc tan mat trong curve255.js:
#     static curve_a2u(a){ for(i=0..31) r[i>>1] |= a[31-i] << (i&1)*8; }
#     static curve_u2a(a){ for(i=0..31) r[31-i] = (a[i>>1] >> ((i&1)*8)) & 0xff; }
# Tuc byte a[31] la byte THAP NHAT -> mang byte cua MikroTik la BIG-ENDIAN,
# nguoc voi X25519 chuan (little-endian). Chi can DAO mang 32 byte o hai dau.
#
# DAY TUNG LA LOI THAT (2026-08-24): luc dau em bo qua cho nay, may chu va
# may khach thu cua em cung sai giong nhau nen bo kiem van 31/31 — nhung
# TRINH DUYET THAT thi khong giai ma noi ("8 byte dem cuoi khong phai dau
# cach"). Da doi chieu bang cach hoi thang trinh duyet:
#     priv = [1..32] -> pub = 61c4b49c...0096790d
# va ban Python nay tra ve dung nhu vay. Xem tools/kiem_mat_ma.py nhom E.
# --------------------------------------------------------------------------

def khoa_cong(khoa_rieng):
    """Khoa cong tu khoa rieng, THU TU BYTE KIEU MIKROTIK."""
    return _nhan_thang(bytes(khoa_rieng)[::-1], _NEN)[::-1]


def bi_mat_chung(khoa_rieng, khoa_cong_doi_phuong):
    """Bi mat chung, ca vao lan ra deu THU TU BYTE KIEU MIKROTIK."""
    return _nhan_thang(bytes(khoa_rieng)[::-1],
                       bytes(khoa_cong_doi_phuong)[::-1])[::-1]


def x25519_chuan(k, u):
    """X25519 THEO CHUAN (little-endian) — de doi chieu vector RFC 7748."""
    return _nhan_thang(k, u)


# --------------------------------------------------------------------------
# Dan xuat khoa RC4 — ham makeKey trong master-min.js
#   v = masterKey + [0]*40 + magic + [0xf2]*40 ;  khoa = sha1(v)[:16]
# Hai chuoi magic COPY NGUYEN VAN tu ma goc, khong duoc go lai bang tay.
# --------------------------------------------------------------------------

MAGIC2 = (b"On the client side, this is the send key; "
          b"on the server side, it is the receive key.")
MAGIC3 = (b"On the client side, this is the receive key; "
          b"on the server side, it is the send key.")


def dan_xuat_khoa(master, la_gui, la_may_chu):
    """
    Doi ung makeKey(masterKey, isSend, isServer).
    isSend == isServer -> magic3, nguoc lai -> magic2.

    Voi BAN GIA LAP (dong vai may chu):
      khoa NHAN  = dan_xuat_khoa(master, False, True)   -> magic2
      khoa GUI   = dan_xuat_khoa(master, True,  True)   -> magic3
    Khop voi trinh duyet:
      txEnc = makeKey(master, True,  False) -> magic2
      rxEnc = makeKey(master, False, False) -> magic3
    """
    magic = MAGIC3 if (bool(la_gui) == bool(la_may_chu)) else MAGIC2
    v = bytes(master) + b"\x00" * 40 + magic + b"\xf2" * 40
    return hashlib.sha1(v).digest()[:16]


# --------------------------------------------------------------------------
# Phien — dong vai MAY CHU
# --------------------------------------------------------------------------

DEM = b" " * 8          # this.padding trong ma goc: dung 8 dau cach


class PhienMayChu:
    def __init__(self, ma_phien, khoa_rieng, khoa_cong_khach):
        import threading
        # RC4 la mat ma DONG — phai giai ma theo DUNG THU TU trinh duyet da
        # ma hoa, KHONG phai thu tu goi den. Trinh duyet gui nhieu yeu cau
        # song song tren nhieu ket noi nen thu tu den co the dao. Do chinh la
        # ly do giao thuc co truong `seq`: ben nhan phai xep lai theo seq.
        # Chinh ma goc cung lam vay (decryptUint8Array: neu seq != rxseq thi
        # cho vao hang doi).
        self.dieu_kien = threading.Condition()
        self.khoa_gui = threading.Lock()
        self.ma_phien = ma_phien
        master = bi_mat_chung(khoa_rieng, khoa_cong_khach)
        self.rx = RC4(dan_xuat_khoa(master, False, True))   # nhan tu trinh duyet
        self.tx = RC4(dan_xuat_khoa(master, True, True))    # gui ve trinh duyet
        self.rxseq = 1
        self.txseq = 1
        # Dem trang cho cac duong dan tra loi nhieu trang (xem _nap_du_lieu
        # trong server.py). Giu theo PHIEN vi co duong dan tra ve con tro
        # giong nhau o moi trang.
        self.trang = {}
        # Cac duong dan phien nay da `subscribe` (lenh 0xfe0012) — chi nhung
        # duong dan nay moi duoc nhan goi DAY khi co ai do ghi.
        self.dang_ky = set()
        # Hang cho goi DAY, kenh cho dai lay ra
        self.hang_day = []
        self.truy_van = {}      # id phien truy van -> {duong_dan, i}
        self.tv_id_ke_tiep = 0
        self.dieu_kien_day = threading.Condition()

    def them_goi_day(self, the):
        with self.dieu_kien_day:
            self.hang_day.append(the)
            self.dieu_kien_day.notify_all()

    def lay_goi_day(self, cho_toi_da, so_hieu):
        """
        Cho toi `cho_toi_da` giay. Co goi thi tra ngay (kem so hieu cua yeu
        cau kenh cho dai dang treo), khong co thi tra None.
        """
        with self.dieu_kien_day:
            if not self.dieu_kien_day.wait_for(lambda: bool(self.hang_day),
                                               cho_toi_da):
                return None
            the = self.hang_day.pop(0)
        return the + [(0xFF0003, 0x09, 2), (0xFF0006, 0x08, so_hieu)]

    def giai_goi(self, goi, cho_toi_da=30):
        """
        Giai 1 goi tu trinh duyet -> tra ve noi dung M2 tho (da bo dem).

        CHO DEN LUOT theo `seq` truoc khi dung dong khoa RC4. Neu goi den
        som hon luot cua no thi doi; goi dung luot se danh thuc cac goi sau.
        Khong lam vay thi hai yeu cau gui gan nhau se giai ma sai va hong
        ca phien (trieu chung: '8 byte dem cuoi khong phai dau cach').
        """
        if len(goi) < 16:
            raise ValueError(f"goi qua ngan: {len(goi)}")
        ma, seq = struct.unpack(">II", goi[:8])

        with self.dieu_kien:
            if not self.dieu_kien.wait_for(lambda: self.rxseq == seq, cho_toi_da):
                raise ValueError(
                    f"cho luot qua lau: goi co seq={seq} nhung dang doi "
                    f"seq={self.rxseq}")
            ro = self.rx.xor(goi[8:])
            if ro[-8:] != DEM:
                raise ValueError("8 byte dem cuoi khong phai dau cach — sai khoa")
            self.rxseq += len(goi) - 8
            self.dieu_kien.notify_all()
        return ma, seq, ro[:-8]

    def dung_goi(self, noi_dung):
        """Dong goi noi dung M2 de gui ve trinh duyet."""
        dau = struct.pack(">II", self.ma_phien, self.txseq)
        than = self.tx.xor(bytes(noi_dung) + DEM)
        self.txseq += len(noi_dung) + 8
        return dau + than
