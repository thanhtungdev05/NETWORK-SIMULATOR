#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
DOI CHIEU GIAO DIEN — thiet bi THAT vs ban GIA LAP
===================================================

Doc hai tep do `tools/quet_giao_dien.js` sinh ra:

    reference/khung_menu/QUET_that.json
    reference/khung_menu/QUET_gialap.json

VI SAO CAN CONG CU NAY
----------------------
`kiem_may_chu.py` chi chung minh may chu tra ve khung nhi phan dung. No khong
biet hoc vien NHIN THAY gi. Mot trang van co the hien ra trang trang trong khi
khung hoan toan dung — vi du sai `.jg`, thieu tai nguyen tinh, hay SPA nem loi.
CLAUDE.md muc 5.6 goi day la "phep do ket qua cuoi".

SO CAI GI — va CO Y KHONG SO CAI GI
-----------------------------------
SO (lech la LOI):
  - nhan  : nhan cua tung o nhap
  - cot   : tieu de cot cua bang
  - loi   : loi JavaScript khi mo trang
  - anh vo: the <img> khong tai duoc tren ban gia lap  <- THEM 2026-08-28
  - trang trang: `daiChu` qua nho trong khi ben kia binh thuong

KHONG SO (lech la BINH THUONG, khong phai loi):
  - gia tri tung o: thiet bi that doi tung giay (Tx/Rx, uptime, ARP), con kho
    khung goc thu ngay 2026-08-24.
  - `soDong`: so dong bang cung troi theo thoi gian. Chi IN RA de tham khao,
    va chi canh bao khi mot ben CO dong con ben kia bang KHONG.

Neu tron hai loai nay lai thi bao cao se day bao dong gia, va nguy hiem hon:
se de bi sua ban gia lap cho khop thiet bi HOM NAY thay vi khop BANG CHUNG.
Do la vi pham CLAUDE.md muc 2.1.
"""
import json
import os
import re
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
GOC = os.path.dirname(_HERE)
THU_MUC = os.path.join(GOC, "reference", "khung_menu")

XANH, DO, VANG, TAT = "\033[92m", "\033[91m", "\033[93m", "\033[0m"


_SO = re.compile(r"\d[\d:.\-/ dhms]*")


def bo_gia_tri(cot):
    """
    Thay moi cum SO trong chuoi cot bang '#'.

    VI SAO: bo trich lay hang <tr> DAU TIEN lam tieu de cot. Voi bang thi do
    dung la tieu de. Nhung vai trang hien thi mot cap "nhan | gia tri" cung
    bang <tr>, vi du `#System:Resources`:

        that   : ['Uptime|3d 04:38:23']
        gia lap: ['Uptime|00:43:25']

    Do la GIA TRI SONG, khong phai lech cau truc — bo cong cu nay noi ro tu
    dau la KHONG so gia tri. Sau khi thay so bang '#' thi ca hai deu thanh
    'Uptime|#' va khong con bao dong gia.

    Chi thay CHU SO, khong dung toi chu — nen 'cpu0 cpu1 cpu2 cpu3' vs
    'all total' (lech that o #Tools:Profile) VAN bi bat.
    """
    return [_SO.sub("#", c) for c in cot]


def nap(ten):
    p = os.path.join(THU_MUC, ten)
    if not os.path.exists(p):
        sys.exit(f"Thieu {p} — chay tools/quet_giao_dien.js truoc.")
    return json.load(open(p, encoding="utf-8"))


def main():
    that = nap("QUET_that.json")
    gia = nap("QUET_gialap.json")
    t, g = that["trang"], gia["trang"]

    # Muc bi CAM chan o mot ben thi khong phai "thieu" — loai ra truoc khi so.
    bo = set(that.get("boQua", [])) | set(gia.get("boQua", []))
    chung = [h for h in g if h in t and h not in bo]
    chi_gia = [h for h in g if h not in t and h not in bo]
    chi_that = [h for h in t if h not in g and h not in bo]

    print("=" * 66)
    print("  DOI CHIEU GIAO DIEN — hEX S that vs gia lap")
    print(f"  that : {that['khi']}  ({len(t)} trang, bo qua {len(that['boQua'])})")
    print(f"  gialap: {gia['khi']}  ({len(g)} trang)")
    print("=" * 66)

    if chi_gia:
        print(f"{VANG}  Chi co o gia lap (thuong la muc trong danh sach CAM): "
              f"{len(chi_gia)}{TAT}")
    if chi_that:
        print(f"{DO}  Chi co o thiet bi that — SIDEBAR GIA LAP THIEU MUC: "
              f"{chi_that}{TAT}")

    lech_nhan, lech_cot, co_loi, trang_trang, bang_lech = [], [], [], [], []
    anh_vo = []

    for h in chung:
        a, b = t[h], g[h]
        if a["nhan"] != b["nhan"]:
            lech_nhan.append((h, a["nhan"], b["nhan"]))
        if bo_gia_tri(a["cot"]) != bo_gia_tri(b["cot"]):
            lech_cot.append((h, a["cot"], b["cot"]))
        if b["loi"]:
            co_loi.append((h, b["loi"]))
        # "Trang trang" = KHONG co gi de nhin: khong o nhap, khong bang, va
        # rat it chu. TUYET DOI KHONG so do dai chu giua hai ben.
        #
        # BAI HOC 2026-08-27: ban dau em viet
        #     if a["daiChu"] > 200 and b["daiChu"] < a["daiChu"] * 0.35
        # va no bao #IP:ARP la "trang gan nhu TRANG" (231 vs 9338 ky tu).
        # Mo tan mat thi trang ARP gia lap dung tuyet doi — du cot, du dong,
        # dung MAC, dung Host Name, dung Status. Lech chi vi hom nay thiet bi
        # that co nhieu muc ARP hon hom thu khung (2026-08-24).
        #
        # Tuc chinh cong cu nay da vi pham dieu ghi trong docstring cua no:
        # "KHONG so gia tri". So do dai chu CHINH LA so gia tri, chi la so
        # mot cach gian tiep. Neu tin no thi em da di "sua" mot trang dang
        # chay dung — va sua theo trang thai thiet bi HOM NAY, tuc bia.
        if b["daiChu"] < 400 and not b["cot"] and not b["nhan"] \
                and (a["cot"] or a["nhan"]):
            trang_trang.append((h, f"that co {len(a['cot'])} bang/"
                                   f"{len(a['nhan'])} o", "gia lap: khong co gi"))
        # bang: mot ben co dong, ben kia khong co dong nao
        if (a["soDong"] > 0) != (b["soDong"] > 0):
            bang_lech.append((h, a["soDong"], b["soDong"]))
        # ANH VO tren ban gia lap — LOI NANG.
        #
        # Them 2026-08-28. Truoc do bo nay chi so NHAN va TIEU DE COT, nen
        # khi 13 tep .svg bi thieu (down.svg, up.svg...) no van bao "0 lech":
        # anh vo khong lam doi mot ky tu nao. Anh Huynn nhin anh chup la thay
        # ngay, con bo kiem thi mu.
        #
        # KHONG so `soAnh` hai ben: so anh co the khac chinh dang vi so dong
        # bang khac nhau (moi dong co the mang icon). Chi tinh anh THUC SU
        # KHONG TAI DUOC tren ban gia lap — do la su that tuyet doi, khong
        # phu thuoc trang thai song cua thiet bi.
        if b.get("anhVo"):
            anh_vo.append((h, f"that: {a.get('anhVo') or 'khong vo'}",
                           f"gia lap VO: {b['anhVo']}"))

    def in_nhom(ten, ds, nang=True, in_chi_tiet=3):
        mau = DO if (ds and nang) else (VANG if ds else XANH)
        dau = "SAI " if (ds and nang) else ("XEM " if ds else "DAT ")
        print(f"{mau}  {dau}{ten}: {len(ds)}{TAT}")
        for m in ds[:in_chi_tiet]:
            print(f"        {m[0]}")
            if len(m) == 3:
                print(f"          that  : {str(m[1])[:150]}")
                print(f"          gialap: {str(m[2])[:150]}")
        if len(ds) > in_chi_tiet:
            print(f"        ... con {len(ds) - in_chi_tiet} muc, xem bao cao JSON")

    print()
    in_nhom("ANH VO tren ban gia lap", anh_vo)
    in_nhom("Loi JavaScript tren ban gia lap", co_loi)
    in_nhom("Trang gan nhu TRANG tren ban gia lap", trang_trang)
    in_nhom("Lech nhan o nhap", lech_nhan)
    in_nhom("Lech tieu de cot bang", lech_cot)
    in_nhom("Bang: mot ben co dong, ben kia rong", bang_lech, nang=False)

    bao = {
        "chi_that": chi_that, "chi_gia": chi_gia,
        "loi_js": co_loi, "trang_trang": trang_trang,
        "anh_vo": anh_vo,
        "lech_nhan": lech_nhan, "lech_cot": lech_cot,
        "bang_lech": bang_lech,
    }
    p = os.path.join(GOC, "spec", "bao-cao-giao-dien.json")
    json.dump(bao, open(p, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print(f"\n  Bao cao day du: {os.path.relpath(p, GOC)}")

    nang = (len(chi_that) + len(co_loi) + len(trang_trang)
            + len(lech_nhan) + len(lech_cot) + len(anh_vo))
    print("=" * 66)
    if nang == 0:
        print(f"{XANH}  KET LUAN: {len(chung)} trang khop CAU TRUC hoan toan.{TAT}")
    else:
        print(f"{DO}  KET LUAN: {nang} muc lech can xu ly.{TAT}")
    return 0 if nang == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
