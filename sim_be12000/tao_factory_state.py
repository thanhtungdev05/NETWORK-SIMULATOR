#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Sinh src/state/factory.json tu 47 file XML that trong reference/source/data/.

MOI gia tri trong factory.json deu truy duoc ve mot file bang chung cu the.
Khong co gia tri nao do nguoi viet nghi ra (NT-1).

Chay:
    python tao_factory_state.py
"""
import json
import os
import re

BASE = os.path.dirname(os.path.abspath(__file__))
DATA = os.path.join(BASE, "reference", "source", "data")
DICH = os.path.join(BASE, "src", "state", "factory.json")

RE_OBJ = re.compile(r"<(OBJ_[A-Z0-9_]+_ID)>(.*?)</\1>", re.S)
RE_INST = re.compile(r"<Instance>(.*?)</Instance>", re.S)
RE_PARA = re.compile(r"<ParaName>(.*?)</ParaName>\s*<ParaValue>(.*?)</ParaValue>", re.S)


def doc_mot_file(duong_dan):
    """Tra ve {ten_obj: {'instances': [...], 'paraOrder': [...]}}"""
    with open(duong_dan, "r", encoding="utf-8", errors="replace") as f:
        xml = f.read()

    if "SessionTimeout" in xml:
        return None, "SessionTimeout - bang chung hong"
    if "404" in xml[:200] and "<ajax_response_xml_root" not in xml:
        return None, "404 - khong lay duoc"

    ket_qua = {}
    for ten_obj, than in RE_OBJ.findall(xml):
        instances = []
        thu_tu = []
        for inst_xml in RE_INST.findall(than):
            cap = RE_PARA.findall(inst_xml)
            inst = {}
            for ten, gia_tri in cap:
                inst[ten] = gia_tri
                if ten not in thu_tu:
                    thu_tu.append(ten)
            instances.append(inst)
        ket_qua[ten_obj] = {"instances": instances, "paraOrder": thu_tu}
    return ket_qua, None


def main():
    state = {
        "device": "BE12000",
        "hardwareModel": "ZTE F8728D",
        "firmwareString": "F8728D V3.0.12P2N2",
        "generatedAt": "2026-08-03",
        "nguon": "Sinh tu reference/source/data/*.lua - XML that do thiet bi tra ve",
        "dataTags": {},
        "objects": {},
    }
    hong = []
    xung_dot = []

    for ten_file in sorted(os.listdir(DATA)):
        duong_dan = os.path.join(DATA, ten_file)
        if not os.path.isfile(duong_dan):
            continue
        objs, loi = doc_mot_file(duong_dan)
        if loi:
            hong.append("%s: %s" % (ten_file, loi))
            continue

        # Moi dataTag chi tra ve MOT TAP CON tham so cua doi tuong.
        # Vi du OBJ_FWLEVEL_ID: firewall_config tra [_InstID, Enable, Level],
        # con firewall_homepage tra [_InstID, Level, AntiAttack].
        # Phai ghi lai tap truong cua tung dataTag de response khong tra thua.
        state["dataTags"][ten_file] = {
            "objects": sorted(objs.keys()),
            "paraOrder": {ten: noi_dung["paraOrder"] for ten, noi_dung in objs.items()},
        }

        for ten_obj, noi_dung in objs.items():
            if ten_obj not in state["objects"]:
                state["objects"][ten_obj] = {
                    "instances": [dict(i) for i in noi_dung["instances"]],
                    "paraOrder": list(noi_dung["paraOrder"]),
                    "nguon": [ten_file],
                }
                continue

            # hop nhat: bo sung tham so moi, bao loi neu CUNG ten ma KHAC gia tri
            cu = state["objects"][ten_obj]
            cu["nguon"].append(ten_file)
            for chi_so, inst_moi in enumerate(noi_dung["instances"]):
                if chi_so >= len(cu["instances"]):
                    cu["instances"].append(dict(inst_moi))
                    continue
                inst_cu = cu["instances"][chi_so]
                for ten_para, gia_tri in inst_moi.items():
                    if ten_para in inst_cu and inst_cu[ten_para] != gia_tri:
                        xung_dot.append(
                            "%s / Instance[%d] / %s: '%s' (%s) != '%s' (%s)"
                            % (ten_obj, chi_so, ten_para, inst_cu[ten_para],
                               ",".join(cu["nguon"][:-1]), gia_tri, ten_file)
                        )
                    else:
                        inst_cu[ten_para] = gia_tri
            for ten_para in noi_dung["paraOrder"]:
                if ten_para not in cu["paraOrder"]:
                    cu["paraOrder"].append(ten_para)

    os.makedirs(os.path.dirname(DICH), exist_ok=True)
    with open(DICH, "w", encoding="utf-8") as f:
        json.dump(state, f, ensure_ascii=False, indent=2)

    so_inst = sum(len(o["instances"]) for o in state["objects"].values())
    so_para = sum(len(i) for o in state["objects"].values() for i in o["instances"])
    print("Da sinh:", DICH)
    print("  dataTag doc duoc :", len(state["dataTags"]))
    print("  loai doi tuong   :", len(state["objects"]))
    print("  so instance      :", so_inst)
    print("  so tham so       :", so_para)
    if hong:
        print("\nFile hong, KHONG dua vao state (%d):" % len(hong))
        for h in hong:
            print("  -", h)
    if xung_dot:
        print("\nXung dot gia tri (%d) - can kiem tra:" % len(xung_dot))
        for x in xung_dot:
            print("  -", x)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
