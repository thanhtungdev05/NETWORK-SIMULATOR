#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sinh www/binding_data.js tu spec/binding.json.

Tach lam hai file de mot ben la DAC TA (nguoi doc, co dan nguon) con mot
ben la DU LIEU cho trinh duyet. Sua bang noi thi sua spec/binding.json roi
chay lai script nay -- dung sua tay file .js.

Kem theo bang method hop le (tu spec/api_methods.json) de trang biet
resource nao cho ghi: resource chi-doc thi KHONG BAO GIO hien thanh Save,
dung nhu thiet bi that.
"""
import json
import os

GOC = os.path.dirname(os.path.abspath(__file__))
SPEC = os.path.join(GOC, "..", "spec")
OUT = os.path.join(GOC, "www", "binding_data.js")


KHOA_NGUON = ("resource", "resource_ghi", "dang", "loc", "gui_kem_id",
              "them_khi_ghi")


def chuan_hoa(trang):
    """Dua CA HAI cach viet ve MOT dang duy nhat de ben JS chi phai xu ly
    mot truong hop:

        trang -> {
          nguon:  {<ten_nguon>: {resource, resource_ghi?, dang, ...}},
          truong: {<ten_truong>: {nguon, duong_dan, theo_nhan?, hien_thi?}},
          ...
        }

    Cach viet gon (mot resource) duoc goi la nguon ten 'chinh'.
    """
    ket = {}
    for ten, t in trang.items():
        t = {k: v for k, v in t.items() if not k.startswith("_")}
        moi = {k: v for k, v in t.items()
               if k not in KHOA_NGUON and k != "nguon" and k != "truong"}

        if "nguon" in t:
            nguon = {k: {kk: vv for kk, vv in v.items()
                         if not kk.startswith("_")}
                     for k, v in t["nguon"].items()}
            mac_dinh = None
        else:
            nguon = {"chinh": {k: t[k] for k in KHOA_NGUON if k in t}}
            mac_dinh = "chinh"

        truong = {}
        for tt, v in t["truong"].items():
            if isinstance(v, str):
                mt = {"duong_dan": v}
            else:
                mt = {k: vv for k, vv in v.items() if not k.startswith("_")}
            if "nguon" not in mt:
                if mac_dinh is None:
                    raise SystemExit(
                        f"LOI: trang {ten} truong '{tt}' thieu khoa 'nguon' "
                        f"(trang nay khai nhieu nguon nen bat buoc phai ghi)")
                mt["nguon"] = mac_dinh
            truong[tt] = mt

        moi["nguon"] = nguon
        moi["truong"] = truong
        ket[ten] = moi
    return ket


def main():
    with open(os.path.join(SPEC, "binding.json"), encoding="utf-8") as f:
        binding = json.load(f)
    with open(os.path.join(SPEC, "api_methods.json"), encoding="utf-8") as f:
        api = json.load(f)["resources"]

    methods = {k[len("api/v1/data/"):]: sorted(v) for k, v in api.items()}
    trang = chuan_hoa(binding["trang"])

    # kiem tra cheo: resource nao khai trong binding cung phai co trong
    # api_methods, va phai that su cho PATCH
    for ten, t in trang.items():
        for ten_nguon, ng in t["nguon"].items():
            r_ghi = ng.get("resource_ghi", ng["resource"])
            if r_ghi not in methods:
                raise SystemExit(
                    f"LOI: trang {ten} nguon '{ten_nguon}' ghi vao '{r_ghi}' "
                    f"nhung resource nay khong co trong spec/api_methods.json")
            if "PATCH" not in methods[r_ghi]:
                raise SystemExit(
                    f"LOI: trang {ten} nguon '{ten_nguon}' ghi vao '{r_ghi}' "
                    f"nhung ma goc noi resource nay chi ho tro {methods[r_ghi]}")
        for ten_truong, mt in t["truong"].items():
            if mt["nguon"] not in t["nguon"]:
                raise SystemExit(
                    f"LOI: trang {ten} truong '{ten_truong}' tro toi nguon "
                    f"'{mt['nguon']}' khong duoc khai bao")

    noi_dung = (
        "/* SINH TU DONG tu spec/binding.json boi src/tao_binding_data.py.\n"
        "   DUNG SUA TAY FILE NAY -- sua spec/binding.json roi chay lai script.\n"
        "   Moi dong trong spec/binding.json deu co truong _nguon chi ro trich\n"
        "   o dau ra (ma goc hoac ban chup that). */\n"
        "window.__BINDING = " + json.dumps(trang, ensure_ascii=False, indent=1)
        + ";\n"
        "window.__METHODS = " + json.dumps(methods, ensure_ascii=False, indent=1)
        + ";\n"
    )
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(noi_dung)

    print(f"Ghi {OUT}")
    print(f"  {len(trang)} trang da noi: {', '.join(sorted(trang))}")
    print(f"  {len(methods)} resource kem method hop le")
    chua = binding["_chua_noi"]
    print(f"  chua noi: {len(chua['de'])} de + {len(chua['kho'])} kho "
          f"+ {len(chua['khong_noi'])} khong can noi")


if __name__ == "__main__":
    main()
