#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
GIAI MA / DUNG KHUNG TIN M2 — MikroTik RouterOS WebFig (/jsproxy)
=================================================================

CACH RUT RA (KHONG DOAN):
  Doc 92 cap khung tin THAT thu tu thiet bi (reference/har/). Dat gia thuyet
  ve cau truc, roi BAT BUOC bo giai ma phai tieu thu VUA DUNG het byte —
  neu con du hoac thieu la gia thuyet sai. Xem tools/kiem_m2.py.

CAU TRUC DA CHOT — 46/46 khung that giai ma VA dung nguoc KHOP TUNG BYTE:

  Goi tin HTTP = [id: u32 BE][seq: u32 BE][than]

  Than co 2 dang:
    a) Bat dau bang magic 'M2' (0x4d 0x32) — khung day du, chay den het goi
    b) Bat dau bang [do_dai: u16 BE] — CHU Y: do dai TINH CA 2 byte cua chinh no
    Sau phan noi dung co the con vung dem toan dau cach (0x20).

  Moi the TLV:
    [ten: u24 LE][kieu: u8][gia tri]

  BANG KIEU — quy luat: bit 0 cua kieu = "do dai/so luong ghi bang 1 byte",
  bit 7 = "mang cua kieu goc". Da xac nhan bang phep do:

    0x00  bool sai             0 byte
    0x01  bool dung            0 byte
    0x08  u32                  4 byte
    0x09  u8                   1 byte
    0x10  u64                  8 byte
    0x20  chuoi                [do_dai: u16 LE][bytes]
    0x21  chuoi                [do_dai: u8][bytes]        <- pho bien nhat
    0x30  mang byte            [do_dai: u16 LE][bytes]
    0x31  mang byte            [do_dai: u8][bytes]        <- dia chi MAC
    0x28  khung long nhau      [do_dai: u16 LE][khung M2]
    0x29  khung long nhau      [do_dai: u8][khung M2]
    0x88  mang u32             [so_luong: u16 LE] x u32 LE
    0x90  mang u64             [so_luong: u16 LE] x 8 byte
    0xa8  mang khung long nhau [so_luong: u16 LE] x ([do_dai: u16 LE][khung M2])

  Ten the nam trong khong gian 0xff00xx la the he thong (id phien, so hieu
  lenh, ma loi...). Cac the khac la du lieu nghiep vu, tra bang .jg.

BA LAN SUYT SAI — ghi lai de doi sau khong lap lai:
  1. Doan 0x00 la u32 (4 byte) -> that ra la bool 0 byte. Lech 1 byte o khung lon.
  2. Doan 0x21 doc do dai 2 byte -> that ra 1 byte. Van "giai duoc" 24 khung
     vi nuot nham roi tinh co khop lai; chi lo ra khi nhin GIA TRI giai duoc
     (b'\\x00\\x00!\\rdhcp-pool-lan' — ro rang con lan sang the sau).
  3. Truong do dai khung dang (b) khong tinh chinh no -> vuot 2 byte nhung
     vung dem 0x20 che mat, bo kiem van bao dat; chi DUNG NGUOC roi so byte
     moi phat hien.
  => Bai hoc: "tieu thu het byte" KHONG DU. Phai (a) nhin gia tri co nghia
     khong, va (b) dung nguoc so tung byte. Xem tools/kiem_m2.py.
"""
import struct

MAGIC = b"M2"
DEM = 0x20  # byte dem cuoi khung la dau cach


class LoiM2(Exception):
    pass


# --------------------------------------------------------------------------
# GIAI MA
# --------------------------------------------------------------------------

def tach_goi(du_lieu):
    """Tach goi HTTP thanh (id, seq, than)."""
    if len(du_lieu) < 8:
        raise LoiM2(f"goi qua ngan: {len(du_lieu)} byte")
    ma_phien, so_thu_tu = struct.unpack(">II", du_lieu[:8])
    return ma_phien, so_thu_tu, du_lieu[8:]


def _doc_the(b, i):
    """Doc 1 the tai vi tri i. Tra ve (ten, kieu, gia_tri, vi_tri_moi)."""
    if i + 4 > len(b):
        raise LoiM2(f"thieu byte cho dau the tai {i}")
    ten = b[i] | (b[i + 1] << 8) | (b[i + 2] << 16)
    kieu = b[i + 3]
    i += 4

    if kieu in (0x00, 0x01):
        # Bool — KHONG mang byte nao. 0x00 = sai, 0x01 = dung.
        # Xac nhan bang phep do: chuoi the "65 00 00 01 / 68 00 00 01 /
        # 69 00 00 01" cach deu 4 byte. Luc dau em doan 0x00 la u32 (4 byte
        # gia tri) -> lech 1 byte o cac khung lon; bo kiem bat ngay.
        return ten, kieu, (kieu == 0x01), i

    if kieu == 0x08:
        if i + 4 > len(b):
            raise LoiM2(f"thieu byte u32 tai {i}")
        return ten, kieu, struct.unpack("<I", b[i:i + 4])[0], i + 4

    if kieu == 0x09:
        if i + 1 > len(b):
            raise LoiM2(f"thieu byte u8 tai {i}")
        return ten, kieu, b[i], i + 1

    if kieu == 0x10:
        # u64 — cac bo dem rx/tx byte cua giao dien. Xac nhan bang phep do:
        # day the 0x010103/0x010102/0x010101... moi the cach nhau dung 12 byte
        # (4 dau + 8 gia tri).
        if i + 8 > len(b):
            raise LoiM2(f"thieu byte u64 tai {i}")
        return ten, kieu, struct.unpack("<Q", b[i:i + 8])[0], i + 8

    if kieu == 0x21:
        # CHUOI, do dai 1 BYTE. Xac nhan bang phep do: "21 0d dhcp-pool-lan"
        # (0x0d = 13 = dung so ky tu) va "21 03 LAN".
        # CANH BAO: luc dau em doan do dai 2 byte -> van "giai duoc" 24 khung
        # vi nuot nham byte roi tinh co khop lai. Day dung la kieu bao dong
        # gia da ghi trong bo nho du an — phai nhin gia tri giai ra co nghia
        # khong, chu khong chi xem co chay het byte khong.
        n = b[i]; i += 1
        return ten, kieu, b[i:i + n], i + n

    if kieu == 0x31:
        # MANG BYTE tho, do dai 1 BYTE (giong 0x21). Xac nhan bang phep do:
        # "31 06 d4 01 c3 24 92 cf" = MAC d4:01:c3:24:92:cf — D4:01:C3 dung la
        # dai OUI cua MikroTik. Doc 2 byte do dai thi MAC lech mat 1 byte va
        # the ke tiep khong con thang hang.
        n = b[i]; i += 1
        return ten, kieu, b[i:i + n], i + n

    if kieu == 0x18:
        return ten, kieu, b[i:i + 16], i + 16          # dia chi IPv6

    # --- CAC DANG MANG (bit 0x80) ---
    # Rut tu msg2buffer trong ma goc: dang mang LUON dung 2 byte cho so luong
    # VA cho do dai tung phan tu — KHONG co bien the ngan nhu dang don.
    if kieu == 0x80:                                    # mang bool
        sl = struct.unpack("<H", b[i:i + 2])[0]; i += 2
        return ten, kieu, list(b[i:i + sl]), i + sl

    if kieu == 0x88:                                    # mang u32
        sl = struct.unpack("<H", b[i:i + 2])[0]; i += 2
        ds = list(struct.unpack("<%dI" % sl, b[i:i + 4 * sl])); i += 4 * sl
        return ten, kieu, ds, i

    if kieu == 0x90:                                    # mang u64
        sl = struct.unpack("<H", b[i:i + 2])[0]; i += 2
        ds = [b[i + 8 * k:i + 8 * (k + 1)] for k in range(sl)]; i += 8 * sl
        return ten, kieu, ds, i

    if kieu == 0x98:                                    # mang dia chi IPv6
        sl = struct.unpack("<H", b[i:i + 2])[0]; i += 2
        ds = [b[i + 16 * k:i + 16 * (k + 1)] for k in range(sl)]; i += 16 * sl
        return ten, kieu, ds, i

    if kieu in (0xA0, 0xB0):                            # mang chuoi / mang byte
        sl = struct.unpack("<H", b[i:i + 2])[0]; i += 2
        ds = []
        for _ in range(sl):
            n = struct.unpack("<H", b[i:i + 2])[0]; i += 2
            ds.append(b[i:i + n]); i += n
        return ten, kieu, ds, i

    # Cac kieu "do dai 2 byte" — doi ung voi ban 1 byte o tren.
    # Quy luat rut ra: bit 0 cua kieu = "do dai ghi bang 1 byte".
    #   0x20/0x21 chuoi | 0x30/0x31 mang byte | 0x28/0x29 khung long nhau
    if kieu == 0x20:
        n = struct.unpack("<H", b[i:i + 2])[0]; i += 2
        return ten, kieu, b[i:i + n], i + n

    if kieu == 0x30:
        n = struct.unpack("<H", b[i:i + 2])[0]; i += 2
        return ten, kieu, b[i:i + n], i + n

    if kieu == 0x29:
        # Khung long nhau DON, do dai 1 byte. Xac nhan bang phep do:
        # "fe 00 1d | 29 | 26 | 4d 32 ..." — 0x26 = 38 byte, ngay sau la magic M2.
        n = b[i]; i += 1
        return ten, kieu, giai_ma_than(b[i:i + n]), i + n

    if kieu == 0x28:
        n = struct.unpack("<H", b[i:i + 2])[0]; i += 2
        return ten, kieu, giai_ma_than(b[i:i + n]), i + n

    if kieu == 0xA8:
        sl = struct.unpack("<H", b[i:i + 2])[0]; i += 2
        ds = []
        for _ in range(sl):
            n = struct.unpack("<H", b[i:i + 2])[0]; i += 2
            ds.append(giai_ma_than(b[i:i + n])); i += n
        return ten, kieu, ds, i

    raise LoiM2(f"kieu la 0x{kieu:02x} tai {i - 4} (ten 0x{ten:06x})")


def giai_ma_than(b):
    """
    Giai ma than khung (da bo header 8 byte). Tra ve dict:
      {"the": [ (ten, kieu, gia_tri), ... ], "dem": so_byte_dem }
    """
    i = 0
    co_magic = b[:2] == MAGIC
    if co_magic:
        i = 2
        het = len(b)
    else:
        # LUU Y: truong do dai TINH CA CHINH NO (2 byte). Vi du that: noi dung
        # 33 byte -> truong ghi 35. Truoc do em tinh "het = 2 + do_dai" nen
        # vuot 2 byte, nhung vung dem toan 0x20 che mat, bo kiem van bao dat —
        # chi den khi DUNG NGUOC va so byte moi lo ra.
        do_dai = struct.unpack(">H", b[:2])[0]
        i = 2
        het = do_dai
        if het > len(b):
            raise LoiM2(f"do dai {do_dai} vuot qua {len(b)} byte co san")

    the = []
    while i < het:
        # gap vung dem thi dung
        if b[i] == DEM and all(x == DEM for x in b[i:het]):
            break
        ten, kieu, gt, i = _doc_the(b, i)
        the.append((ten, kieu, gt))

    return {"the": the, "dem": len(b) - i, "magic": co_magic}


def giai_ma(du_lieu):
    ma_phien, so_thu_tu, than = tach_goi(du_lieu)
    kq = giai_ma_than(than)
    kq["ma_phien"] = ma_phien
    kq["so_thu_tu"] = so_thu_tu
    return kq


# --------------------------------------------------------------------------
# DUNG KHUNG (chieu may chu -> trinh duyet)
# --------------------------------------------------------------------------

def _dung_the(ten, kieu, gt):
    """Doi ung 1-1 voi _doc_the. Moi thay doi o day PHAI sua ca 2 phia."""
    dau = bytes([ten & 0xFF, (ten >> 8) & 0xFF, (ten >> 16) & 0xFF, kieu])

    if kieu in (0x00, 0x01):
        return dau                                    # bool — khong co gia tri
    if kieu == 0x08:
        return dau + struct.pack("<I", gt)
    if kieu == 0x09:
        return dau + bytes([gt])
    if kieu == 0x10:
        return dau + struct.pack("<Q", gt)
    if kieu in (0x21, 0x31):                          # do dai 1 byte
        if isinstance(gt, str):
            gt = gt.encode()
        return dau + bytes([len(gt)]) + gt
    if kieu in (0x20, 0x30):                          # do dai 2 byte
        if isinstance(gt, str):
            gt = gt.encode()
        return dau + struct.pack("<H", len(gt)) + gt
    if kieu == 0x29:                                  # khung long nhau, do dai 1 byte
        th = dung_than(gt, magic=True)
        return dau + bytes([len(th)]) + th
    if kieu == 0x28:                                  # khung long nhau, do dai 2 byte
        th = dung_than(gt, magic=True)
        return dau + struct.pack("<H", len(th)) + th
    if kieu == 0x18:
        return dau + bytes(gt)
    if kieu == 0x80:
        return dau + struct.pack("<H", len(gt)) + bytes(gt)
    if kieu == 0x88:
        return dau + struct.pack("<H", len(gt)) + b"".join(struct.pack("<I", x) for x in gt)
    if kieu in (0x90, 0x98):
        return dau + struct.pack("<H", len(gt)) + b"".join(gt)
    if kieu in (0xA0, 0xB0):                          # mang chuoi / mang byte
        ra = dau + struct.pack("<H", len(gt))
        for s in gt:
            if isinstance(s, str):
                s = s.encode()
            ra += struct.pack("<H", len(s)) + s
        return ra
    if kieu == 0xA8:
        ra = dau + struct.pack("<H", len(gt))
        for con in gt:
            th = dung_than(con, magic=True)
            ra += struct.pack("<H", len(th)) + th
        return ra
    raise LoiM2(f"chua ho tro dung kieu 0x{kieu:02x}")


def dung_than(the, magic=True):
    """`the` la danh sach (ten, kieu, gia_tri) hoac dict tu giai_ma_than()."""
    if isinstance(the, dict):
        magic = the.get("magic", magic)
        the = the["the"]
    noi_dung = b"".join(_dung_the(t, k, g) for t, k, g in the)
    # Truong do dai TINH CA 2 byte cua chinh no — xem chu thich o giai_ma_than().
    return (MAGIC if magic else struct.pack(">H", len(noi_dung) + 2)) + noi_dung


def dung_goi(ma_phien, so_thu_tu, the, magic=True, dem=0):
    than = dung_than(the, magic=magic)
    return struct.pack(">II", ma_phien, so_thu_tu) + than + bytes([DEM]) * dem


def giai_ma_nhieu(du_lieu):
    """
    Giai MOT goi co the chua NHIEU ban tin — dung cho kenh cho dai.

    VI SAO CAN (2026-08-25, cai bay 'sua tai cho' LAN THU BA):
    Mot goi tra ve tu kenh cho dai co the chua vai ban tin lien tiep. Ham
    `giai_ma()` chi doc ban tin DAU. Em da dung no de rut dau ra Terminal va
    mat dung dong ket qua `name: FPT` — echo va dau nhac thi con, ket qua thi
    bay hoi. Bo kiem bat duoc vi no doi chieu NOI DUNG chu khong dem byte.

    Trong khung DA BAT tu trinh duyet, `buffer2msgs` cua ma goc da GHI DE 2
    byte do dai cua TUNG ban tin thanh 'M2'. Nen o day khong the doc do dai
    nua — phai lan theo dau 'M2' o RANH GIOI the.
    """
    ma_phien, so_thu_tu, b = tach_goi(du_lieu)
    cac, the, i = [], [], 0
    while i < len(b):
        if b[i] == DEM and all(x == DEM for x in b[i:]):
            break                       # den vung dem cuoi goi
        if b[i:i + 2] == MAGIC:
            if the:
                cac.append(the)
            the, i = [], i + 2
            continue
        ten, kieu, gt, i = _doc_the(b, i)
        the.append((ten, kieu, gt))
    if the:
        cac.append(the)
    return {"ban_tin": cac, "ma_phien": ma_phien, "so_thu_tu": so_thu_tu}
