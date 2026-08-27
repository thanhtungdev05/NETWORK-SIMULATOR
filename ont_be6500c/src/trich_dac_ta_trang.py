#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""GD3 -- Trich dac ta TUNG TRANG tu ma goc.

Moi route co MOT chunk JS rieng (Vite lazy import). Bang route->chunk lay
truc tiep tu bang dinh tuyen trong bundle loi, khong doan.

Voi moi trang, script rut:
  - chunk JS goc + danh sach chunk phu thuoc
  - cac ham API duoc goi  -> quy ra resource + HTTP method
  - cac truong form: name, label, kieu component
  - defaultValues (gia tri mac dinh)
  - moi chuoi hien thi (nhan, thong bao, mo ta)

Ket qua ghi vao spec/pages/<route>.json. KHONG suy dien: chi ghi thu doc
duoc that; cho nao khong chac thi de trong va ghi vao _can_doc_tay.
"""
import json
import os
import re

GOC = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(GOC, "..", "reference", "source", "assets_goc")
BUNDLE = os.path.join(ASSETS, "index-CW0UhNxy.js")
SPEC = os.path.join(GOC, "..", "spec")
OUT_DIR = os.path.join(SPEC, "pages")


# ---------------------------------------------------------------- ban do
def doc_bang_route(data):
    """Bang dinh tuyen: [{path:"home/overview",lazy:...import("./xxx.js")...}]"""
    ket = {}
    for m in re.finditer(
            r'\{\s*path\s*:\s*"([^"]+)"\s*,\s*lazy\s*:.*?import\("\./([^"]+)"\)'
            r'\s*,\s*__vite__mapDeps\(\[([0-9,\s]*)\]\)', data):
        ket[m.group(1)] = {
            "chunk": m.group(2),
            "deps_index": [int(x) for x in m.group(3).split(",") if x.strip()],
        }
    return ket


def doc_map_deps(data):
    """__vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=[...]))) -- bang
    tra ten file theo chi so."""
    m = re.search(r'__vite__mapDeps\s*=\s*\(.*?m\.f\s*=\s*\[([^\]]*)\]', data,
                  re.S)
    if not m:
        return []
    return re.findall(r'"([^"]+)"', m.group(1))


def doc_bang_export(data):
    """export{Zs as $,lve as A,...} -> {bi_danh_xuat: ten_that}"""
    i = data.rfind("export{")
    if i < 0:
        return {}
    doan = data[i + len("export{"):data.index("}", i)]
    ket = {}
    for cap in doan.split(","):
        p = cap.strip().split(" as ")
        if len(p) == 2:
            ket[p[1].strip()] = p[0].strip()
    return ket


def doc_import_chunk(text, bang_export):
    """import{K as r,s as c} from "./index-CW0UhNxy.js" -> {r: 'Ms', c: 'W'}
    Chi xu ly import tu bundle loi (cho nao co bang export)."""
    ket = {}
    for m in re.finditer(r'import\s*\{([^}]*)\}\s*from\s*"\./([^"]+)"', text):
        than, tu_file = m.group(1), m.group(2)
        for cap in than.split(","):
            p = cap.strip().split(" as ")
            if len(p) == 2:
                bi_danh, that = p[1].strip(), p[0].strip()
            elif len(p) == 1 and p[0].strip():
                bi_danh = that = p[0].strip()
            else:
                continue
            if tu_file.startswith("index-CW0UhNxy"):
                ket[bi_danh] = bang_export.get(that, that)
            else:
                ket[bi_danh] = f"{tu_file}:{that}"
    return ket


# ------------------------------------------------------------ trich xuat
def doc_ham_rpc(data):
    """Cac ham API di qua kenh /oui-rpc (dt({module,action})) chu khong qua
    REST. Bat theo mau <ten>:async(...)=> ... dt({module:"..",action:".."})
    trong PHAM VI than ham do (dung dau '}' can bang de khong lan sang ham
    ke tiep -- bai hoc tu ban dau quet cua so co dinh 600 ky tu bi lan)."""
    ket = {}
    for m in re.finditer(r'([A-Za-z_$][\w$]*)\s*:\s*async\s*(?:\([^)]*\)|[\w$]+)'
                         r'\s*=>\s*\{', data):
        ten = m.group(1)
        i = m.end() - 1
        sau = 0
        j = i
        while j < len(data) and j < i + 4000:
            if data[j] == "{":
                sau += 1
            elif data[j] == "}":
                sau -= 1
                if sau == 0:
                    break
            j += 1
        than = data[i:j + 1]
        mm = re.search(r'dt\(\{module:"([^"]+)",action:"([^"]+)"', than)
        if mm:
            ket.setdefault(ten, set()).add((mm.group(1), mm.group(2)))
    return {k: sorted(v) for k, v in ket.items()}


def doc_doi_tuong_api(data):
    """Tim MOI identifier duoc gan mot object literal ma than co chua loi
    goi HTTP/RPC (`Ae({resource:`, `dt({module:`, `Ea({method:`). Do la cac
    "doi tuong API". Tra ve {ten_doi_tuong: set(ten_ham)}.

    Can thiet vi KHONG the chi so ten ham: ban dau quet moi `.getTime` va
    bat nham `new Date().getTime()` trong thu vien bieu do cua trang
    speedtest -> ket luan sai la trang do goi `api/v1/data/time`. Phai buoc
    ham thuoc dung mot doi tuong API, truy qua bi danh import."""
    ket = {}
    for m in re.finditer(r'(?<![\w$.])([A-Za-z_$][\w$]*)\s*=\s*\{'
                         r'[A-Za-z_$][\w$]*\s*:\s*async', data):
        ten = m.group(1)
        i = data.index("{", m.start(0) + len(ten))
        sau = 0
        j = i
        while j < len(data):
            if data[j] == "{":
                sau += 1
            elif data[j] == "}":
                sau -= 1
                if sau == 0:
                    break
            j += 1
        than = data[i:j + 1]
        if not any(k in than for k in ("Ae({resource:", "dt({module:",
                                       "Ea({method:")):
            continue
        keys = re.findall(r'(?:^|[,{])([A-Za-z_$][\w$]*)\s*:\s*(?:async|\()',
                          than)
        ket[ten] = set(keys)

    # Cac phep chon luc build: use=sse?lse:ase (sse=false -> ase).
    # Bi danh phai duoc coi la CHINH doi tuong duoc chon.
    for m in re.finditer(r'(?<![\w$.])([A-Za-z_$][\w$]*)\s*=\s*'
                         r'([A-Za-z_$][\w$]*)\s*\?\s*([A-Za-z_$][\w$]*)'
                         r'\s*:\s*([A-Za-z_$][\w$]*)', data):
        bi_danh, co, a, b = m.groups()
        if a in ket or b in ket:
            # co la hang build-time JSON.parse("true"/"false")
            hang = re.search(r'(?<![\w$.])' + re.escape(co) +
                             r'\s*=\s*JSON\.parse\("(true|false)"\)', data)
            chon = None
            if hang:
                chon = a if hang.group(1) == "true" else b
            ket[bi_danh] = set(ket.get(chon, set())) | set(ket.get(a, set())) \
                | set(ket.get(b, set()))
            ket[bi_danh + "\0chon"] = chon
    return ket


def trich_goi_api(nguon, bang_export, doi_tuong_api, ham_to_resource, ham_rpc):
    """Voi tung file nguon, giai bi danh import cua chinh file do, roi chi
    bat `<biDanh>.<ham>` khi <biDanh> tro toi mot doi tuong API va <ham> la
    khoa THAT su co trong doi tuong do.

    `nguon` la dict {ten_file: noi_dung} -- gom chunk cua trang VA cac chunk
    phu thuoc (nhieu trang uy quyen toan bo noi dung cho chunk dung chung,
    vd status/devices -> DevicesContent-*.js)."""
    ket = {}
    for ten_file, text in nguon.items():
        alias = doc_import_chunk(text, bang_export)
        bi_danh_api = {b: t for b, t in alias.items() if t in doi_tuong_api}
        if not bi_danh_api:
            continue
        mau = re.compile(r'(?<![\w$.])(' + "|".join(
            re.escape(b) for b in sorted(bi_danh_api, key=len, reverse=True)
        ) + r')\.([A-Za-z_$][\w$]*)')
        for m in mau.finditer(text):
            doi_tuong = bi_danh_api[m.group(1)]
            ham = m.group(2)
            if ham not in doi_tuong_api[doi_tuong]:
                continue          # thuoc tinh khac, khong phai ham API
            if ham not in ket:
                muc = {"ham_goc": ham,
                       "doi_tuong_goc": doi_tuong,
                       "tim_thay_o": []}
                if ham in ham_to_resource:
                    muc.update(ham_to_resource[ham])
                    muc["kenh"] = "REST"
                elif ham in ham_rpc:
                    muc["kenh"] = "RPC /oui-rpc"
                    muc["rpc"] = [{"module": a, "action": b}
                                  for a, b in ham_rpc[ham]]
                else:
                    muc["kenh"] = "_chua_xac_dinh -- doc tay"
                ket[ham] = muc
            if ten_file not in ket[ham]["tim_thay_o"]:
                ket[ham]["tim_thay_o"].append(ten_file)
    return [ket[k] for k in sorted(ket)]


def trich_goi_khac(nguon):
    """Cac kenh giao tiep KHONG di qua /api/v1/data/*: RPC dinh nghia ngay
    trong chunk ({module:"..",action:".."}), va cac duong dan tuyet doi
    khac (/oui-upload, /oui-download...).

    Phat hien nay quan trong: vd trang system/upgrade khong dung REST mot
    lan nao -- toan bo di qua /oui-upload + /oui-rpc. Neu chi quet
    /api/v1/data/ thi se ket luan nham la 'trang khong goi API'."""
    rpc = {}
    duong_dan = {}
    for ten_file, text in nguon.items():
        for m in re.finditer(
                r'module\s*:\s*"([^"]+)"\s*,\s*action\s*:\s*"([^"]+)"', text):
            rpc.setdefault((m.group(1), m.group(2)), set()).add(ten_file)
        for m in re.finditer(
                r'object\s*:\s*"([^"]+)"\s*,\s*method\s*:\s*"([^"]+)"', text):
            rpc.setdefault(("ubus:" + m.group(1), m.group(2)), set()).add(ten_file)
        for m in re.finditer(r'"(/(?:oui|api|tmp)[A-Za-z0-9_./-]*)"', text):
            duong_dan.setdefault(m.group(1), set()).add(ten_file)
    return {
        "rpc": [{"module": a, "action": b, "tim_thay_o": sorted(v)}
                for (a, b), v in sorted(rpc.items())],
        "duong_dan_tuyet_doi": [{"duong_dan": k, "tim_thay_o": sorted(v)}
                                for k, v in sorted(duong_dan.items())],
    }


def trich_truong_form(text):
    """Bat {name:"x",label:"y"} va {name:"x",...,label:"y"} trong JSX props.
    Chi lay khi CO ca name lan label trong cung mot cap ngoac nhon nong."""
    ket = []
    for m in re.finditer(r'\{([^{}]*\bname\s*:\s*"[^"]+"[^{}]*)\}', text):
        than = m.group(1)
        tn = re.search(r'\bname\s*:\s*"([^"]+)"', than)
        if not tn:
            continue
        nhan = re.search(r'\blabel\s*:\s*"([^"]*)"', than)
        muc = {"name": tn.group(1)}
        if nhan:
            muc["label"] = nhan.group(1)
        for khoa in ("placeholder", "type", "helperText", "unit"):
            k = re.search(r'\b' + khoa + r'\s*:\s*"([^"]*)"', than)
            if k:
                muc[khoa] = k.group(1)
        if re.search(r'\bdisabled\s*:\s*!0', than):
            muc["disabled"] = True
        if re.search(r'\brequired\s*:\s*!0', than):
            muc["required"] = True
        if muc not in ket:
            ket.append(muc)
    return ket


def trich_chuoi(text):
    """Moi chuoi ky tu do dai >=2 co chua khoang trang hoac chu hoa dau --
    tuc la ung vien nhan/thong bao hien thi cho nguoi dung. Loai bo chuoi
    ky thuat (ten file, css, ma mau...)."""
    bo = set()
    for m in re.finditer(r'"((?:[^"\\]|\\.){2,})"', text):
        s = m.group(1)
        if len(s) > 300:
            continue
        if re.match(r'^[a-z0-9_$.\-/]+$', s):          # ten ky thuat
            continue
        if s.startswith(("./", "http", "#", "@", "M ", "0 0 ")):
            continue
        if re.match(r'^[\d\s.,%pxemrhs()-]+$', s):     # gia tri css
            continue
        bo.add(s)
    return sorted(bo)


def trich_mac_dinh(text):
    """Tim object truyen vao defaultValues -- thuong la mot hang gan truoc
    do. Tra ve doan ma tho de nguoi doc tu doi chieu (KHONG tu dien giai
    thanh JSON vi co the chua bieu thuc)."""
    ket = []
    for m in re.finditer(r'defaultValues\s*:\s*([A-Za-z_$][\w$]*)', text):
        ten = m.group(1)
        d = re.search(r'(?<![\w$])' + re.escape(ten) + r'\s*=\s*(\{)', text)
        if d:
            i = d.start(1)
            sau = 0
            for j in range(i, min(len(text), i + 4000)):
                if text[j] == "{":
                    sau += 1
                elif text[j] == "}":
                    sau -= 1
                    if sau == 0:
                        ket.append({"bien": ten, "ma": text[i:j + 1]})
                        break
    for m in re.finditer(r'defaultValues\s*:\s*(\{)', text):
        i = m.start(1)
        sau = 0
        for j in range(i, min(len(text), i + 4000)):
            if text[j] == "{":
                sau += 1
            elif text[j] == "}":
                sau -= 1
                if sau == 0:
                    ket.append({"bien": "(noi tuyen)", "ma": text[i:j + 1]})
                    break
    return ket


def trich_schema_yup(text, alias_map):
    """Tim bi danh cua yup ('Ms') roi bat cac cum <yup>.object({...})."""
    bi_danh = [b for b, t in alias_map.items() if t == "Ms"]
    ket = []
    for b in bi_danh:
        for m in re.finditer(r'(?<![\w$.])' + re.escape(b) + r'\.object\(', text):
            i = text.index("(", m.start())
            sau = 0
            for j in range(i, min(len(text), i + 6000)):
                if text[j] == "(":
                    sau += 1
                elif text[j] == ")":
                    sau -= 1
                    if sau == 0:
                        ma = text[i + 1:j]
                        if ma not in [k["ma"] for k in ket]:
                            ket.append({"ma": ma})
                        break
    return ket


# ------------------------------------------------------------------ main
def main():
    with open(BUNDLE, encoding="utf-8") as f:
        loi = f.read()

    routes = doc_bang_route(loi)
    deps = doc_map_deps(loi)
    bang_export = doc_bang_export(loi)

    with open(os.path.join(SPEC, "api_methods.json"), encoding="utf-8") as f:
        api = json.load(f)["resources"]
    ham_to_resource = {}
    for res, methods in api.items():
        for method, hams in methods.items():
            for h in hams:
                # mot ten ham chi ung voi mot (resource, method) trong bundle
                ham_to_resource[h] = {"resource": res, "method": method}
    ham_rpc = doc_ham_rpc(loi)
    doi_tuong_api = {k: v for k, v in doc_doi_tuong_api(loi).items()
                     if not k.endswith("\0chon")}

    print(f"Bang dinh tuyen: {len(routes)} route")
    print(f"Bang file phu thuoc: {len(deps)} muc")
    print(f"Bang export bundle loi: {len(bang_export)} ky hieu")
    print(f"Ham API REST: {len(ham_to_resource)} -- ham qua RPC: {len(ham_rpc)}")
    print(f"Doi tuong API: {', '.join(sorted(doi_tuong_api))}\n")

    os.makedirs(OUT_DIR, exist_ok=True)
    tong_ket = {}

    for route in sorted(routes):
        info = routes[route]
        p = os.path.join(ASSETS, info["chunk"])
        if not os.path.exists(p):
            print(f"{route:24s} THIEU CHUNK {info['chunk']}")
            continue
        with open(p, encoding="utf-8") as f:
            text = f.read()

        alias_map = doc_import_chunk(text, bang_export)

        # Gom chunk cua trang + moi chunk phu thuoc (tru bundle loi, vi
        # bundle loi chua DINH NGHIA ham API nen se bat nham toan bo).
        phu_thuoc = [deps[i] for i in info["deps_index"] if i < len(deps)]
        nguon = {info["chunk"]: text}
        for d in phu_thuoc:
            ten = os.path.basename(d)
            if ten.startswith("index-CW0UhNxy") or not ten.endswith(".js"):
                continue
            pd = os.path.join(ASSETS, ten)
            if os.path.exists(pd) and ten not in nguon:
                with open(pd, encoding="utf-8") as f:
                    nguon[ten] = f.read()

        spec = {
            "_route": route,
            "_duong_dan_trinh_duyet": f"#/{route}",
            "_nguon": {
                "chunk": info["chunk"],
                "kich_thuoc_byte": len(text),
                "chunk_phu_thuoc": phu_thuoc,
                "bundle_loi": "index-CW0UhNxy.js",
                "_da_quet": sorted(nguon),
            },
            "_cach_trich": "src/trich_dac_ta_trang.py (doc ma goc, khong doan)",
            "goi_api": trich_goi_api(nguon, bang_export, doi_tuong_api,
                                     ham_to_resource, ham_rpc),
            "goi_khac": trich_goi_khac(nguon),
            "truong_form": trich_truong_form(text),
            "gia_tri_mac_dinh": trich_mac_dinh(text),
            "schema_kiem_tra": trich_schema_yup(text, alias_map),
            "chuoi_hien_thi": trich_chuoi(text),
            "_can_doc_tay": [],
        }

        # danh dau cho can nguoi doc: chunk lon, hoac co goi api chua ro
        if len(text) > 30000:
            spec["_can_doc_tay"].append(
                f"chunk {len(text)} byte -- qua lon de trich tu dong het, "
                "phai doc tay phan logic hien/an va bang bieu")
        if any("_chua_biet_resource" in g for g in spec["goi_api"]):
            spec["_can_doc_tay"].append(
                "co ham API khong quy duoc ve resource -- doc tay")
        if not spec["goi_api"] and not spec["goi_khac"]["rpc"]:
            spec["_can_doc_tay"].append(
                "khong tim thay loi goi API/RPC nao -- co the la trang tinh, "
                "hoac doc du lieu tu kho Zustand thay vi goi truc tiep. "
                "PHAI doc tay xac nhan, khong duoc mac dinh la trang tinh")

        ten = route.replace("/", "__") + ".json"
        with open(os.path.join(OUT_DIR, ten), "w", encoding="utf-8") as f:
            json.dump(spec, f, ensure_ascii=False, indent=2)

        tong_ket[route] = {
            "chunk": info["chunk"],
            "byte": len(text),
            "so_api": len(spec["goi_api"]),
            "so_rpc": len(spec["goi_khac"]["rpc"]),
            "so_truong": len(spec["truong_form"]),
            "so_chuoi": len(spec["chuoi_hien_thi"]),
            "can_doc_tay": len(spec["_can_doc_tay"]),
        }
        print(f"{route:24s} {info['chunk']:26s} "
              f"api={len(spec['goi_api']):2d} rpc={len(spec['goi_khac']['rpc']):2d} "
              f"truong={len(spec['truong_form']):2d} "
              f"chuoi={len(spec['chuoi_hien_thi']):4d} "
              f"{'DOC TAY' if spec['_can_doc_tay'] else ''}")

    with open(os.path.join(SPEC, "route_chunk.json"), "w", encoding="utf-8") as f:
        json.dump({
            "_nguon": "bang dinh tuyen f0e trong index-CW0UhNxy.js",
            "_ngay": "2026-08-12",
            "_tong_route": len(routes),
            "routes": {r: routes[r]["chunk"] for r in sorted(routes)},
            "tong_ket": tong_ket,
        }, f, ensure_ascii=False, indent=2)
    print(f"\nGhi {len(tong_ket)} file spec vao {OUT_DIR}")


if __name__ == "__main__":
    main()
