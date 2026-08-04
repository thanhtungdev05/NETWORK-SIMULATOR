#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Boc dinh nghia hop thoai (modal) tu MA NGUON view cua thiet bi.

Vi sao can ban nay: ban truoc dung mot regex quet ca file nen dinh vao mo hinh
"moi .option deu la mot truong cua cung mot bang". Sai o hai cho lon:

 1) MA CHET. view__localnetwork__routes.js co:
        for (var family=4; family<=6; family+=2) { ... Static Routes ... }
        for (var family=4; family<=0; family+=2) { ... IP Rules ... }
    Vong thu hai khong bao gio chay (4<=0) - ZTE tat tinh nang IP Rules bang
    cach do. Regex cu nuot ca 13 truong chet -> modal 17 truong thay vi 4.

 2) THIEU NGU CANH. Tieu de modal la tieu de cua form.Map (vd 'Routing'),
    khong phai tieu de section ('Static IPv4 Routes'); moi truong con co
    mo ta, placeholder, danh sach chon, co bat buoc, va thuoc mot tab.

Ban nay doc theo cau truc: Map -> section -> tab/option, mo vong lap that,
va bo qua vong lap khong co lan lap nao.
"""
import json, os, re, sys

BASE = os.path.dirname(os.path.abspath(__file__))
CAP = os.path.join(BASE, "captures")
WWW = os.path.join(BASE, "www")


# ---------- tien ich doc chuoi JS ----------
def _(m):
    """lay noi dung _('...') hoac '...'"""
    if m is None:
        return None
    return m.replace("\\'", "'").replace('\\"', '"')


CHUOI = r"_\('((?:[^'\\]|\\.)*)'\)|'((?:[^'\\]|\\.)*)'"


def chuoi_dau(s):
    m = re.search(CHUOI, s)
    if not m:
        return None
    return _(m.group(1) if m.group(1) is not None else m.group(2))


# ---------- xu ly vong lap ----------
VONG = re.compile(
    r"for\s*\(\s*var\s+(\w+)\s*=\s*(-?\d+)\s*;\s*\1\s*(<=|<|>=|>)\s*(-?\d+)\s*;\s*\1\s*\+=\s*(-?\d+)\s*\)\s*\{"
)


def khoi_ngoac(s, i):
    """i tro toi '{' -> tra ve (noi_dung, vi_tri_sau_dau_dong).
       Bo qua ngoac nam trong chuoi hoac regex literal don gian."""
    sau = 1
    j = i + 1
    while j < len(s) and sau:
        c = s[j]
        if c in "'\"":
            q = c
            j += 1
            while j < len(s) and s[j] != q:
                if s[j] == "\\":
                    j += 1
                j += 1
        elif c == "{":
            sau += 1
        elif c == "}":
            sau -= 1
        j += 1
    return s[i + 1:j - 1], j


def mo_vong(src):
    """Thay moi vong lap bang than vong da lap that su.
       Vong khong co lan lap nao (vd 4<=0) bien mat hoan toan."""
    while True:
        m = VONG.search(src)
        if not m:
            return src
        bien, dau, dk, cuoi, buoc = m.group(1), int(m.group(2)), m.group(3), int(m.group(4)), int(m.group(5))
        than, het = khoi_ngoac(src, m.end() - 1)
        gia = []
        v, an_toan = dau, 0
        while an_toan < 64:
            ok = (v <= cuoi) if dk == "<=" else (v < cuoi) if dk == "<" else \
                 (v >= cuoi) if dk == ">=" else (v > cuoi)
            if not ok:
                break
            gia.append(v)
            v += buoc
            an_toan += 1
        ra = "".join(thay_bien(than, bien, g) for g in gia)
        src = src[:m.start()] + ra + src[het:]


TAM = re.compile(r"(\w+)\s*==\s*(-?\d+)\s*\?")


def thay_bien(than, bien, gt):
    """Giai cac bieu thuc dieu kien 'family==6?A:B' theo gia tri thuc."""
    out, i = than, 0
    while True:
        m = TAM.search(out, i)
        if not m:
            return out
        if m.group(1) != bien:
            i = m.end()
            continue
        dung = (int(m.group(2)) == gt)
        a, j = nhanh(out, m.end())          # nhanh 'then'
        if j >= len(out) or out[j] != ":":
            i = m.end()
            continue
        b, k = nhanh(out, j + 1)            # nhanh 'else'
        out = out[:m.start()] + (a if dung else b) + out[k:]
        i = m.start()


def nhanh(s, i):
    """Doc mot nhanh cua toan tu ba ngoi, dung o ':' hoac ';' cung cap."""
    sau = 0
    j = i
    while j < len(s):
        c = s[j]
        if c in "'\"":
            q = c
            j += 1
            while j < len(s) and s[j] != q:
                if s[j] == "\\":
                    j += 1
                j += 1
        elif c in "([{":
            sau += 1
        elif c in ")]}":
            if sau == 0:
                break
            sau -= 1
        elif sau == 0 and c == "?":
            # ba ngoi long nhau: bo qua den ':' tuong ung
            _a, j2 = nhanh(s, j + 1)
            _b, j3 = nhanh(s, j2 + 1)
            j = j3
            continue
        elif sau == 0 and c in ":;,":
            break
        j += 1
    return s[i:j].strip(), j


# ---------- boc dinh nghia ----------
CAU = re.compile(
    # ZTE dung ca form.Map lan form.JSONMap (du lieu tu ubus) - phai bat ca hai,
    # neu khong tieu de hop thoai se rong va bi thay bang ten section ky thuat
    # nhu 'InstID', 'name'.
    r"(?P<map>new\s+form\.\w*Map\s*\()"
    r"|(?P<sec>\w+\s*=\s*\w+\.section\s*\(\s*form\.(?P<sk>\w+))"
    r"|(?P<tab>\w+\.tab\s*\(\s*'(?P<tid>[^']+)'\s*,\s*_\('(?P<tname>[^']*)'\))"
    r"|(?P<opt>\w+\s*=\s*\w+\.(?P<loai>taboption|option)\s*\()"
    r"|(?P<val>\w+\.value\s*\()"
    r"|(?P<ph>\w+\.placeholder\s*=)"
    r"|(?P<rm>\w+\.rmempty\s*=\s*(?P<rmv>true|false))"
    r"|(?P<df>\w+\.default\s*=)"
    r"|(?P<mo>\w+\.modalonly\s*=\s*(?P<mov>true|false))"
    r"|(?P<ro>\w+\.readonly\s*=\s*(?P<rov>true|false))"
)

# Cac widget khong bao gio hien trong hop thoai
AN = {"HiddenValue"}


def tach_tham_so(s, i):
    """i tro sau '(' -> danh sach tham so cap cao nhat."""
    sau, j, ds, dau = 0, i, [], i
    while j < len(s):
        c = s[j]
        if c in "'\"":
            q = c
            j += 1
            while j < len(s) and s[j] != q:
                if s[j] == "\\":
                    j += 1
                j += 1
        elif c in "([{":
            sau += 1
        elif c in ")]}":
            if sau == 0:
                ds.append(s[dau:j])
                return ds, j + 1
            sau -= 1
        elif c == "," and sau == 0:
            ds.append(s[dau:j])
            dau = j + 1
        j += 1
    return ds, j


def boc(src):
    src = mo_vong(src)
    tieude_map = None
    secs, sec, truong = [], None, None
    tabs = {}
    for m in CAU.finditer(src):
        if m.group("map"):
            ts, _e = tach_tham_so(src, m.end())
            tieude_map = chuoi_dau(ts[1]) if len(ts) > 1 else None
        elif m.group("sec"):
            ts, _e = tach_tham_so(src, src.index("(", m.end() - len(m.group("sk"))) + 1)
            ten = chuoi_dau(ts[-1]) if ts else None
            sec = {"kieu": m.group("sk"), "muc": ten, "tabs": [], "truong": []}
            secs.append(sec)
            truong = None
        elif m.group("tab") and sec is not None:
            sec["tabs"].append({"id": m.group("tid"), "ten": m.group("tname")})
        elif m.group("opt"):
            ts, _e = tach_tham_so(src, m.end())
            if m.group("loai") == "taboption":
                tab = chuoi_dau(ts[0]); ts = ts[1:]
            else:
                tab = None
            kieu = ts[0].strip().replace("form.", "") if ts else ""
            ten = chuoi_dau(ts[1]) if len(ts) > 1 else None
            nhan = chuoi_dau(ts[2]) if len(ts) > 2 else None
            mota = None
            if len(ts) > 3:
                mota = re.sub(r"<br\s*/?>", " ", " ".join(
                    _(x.group(1) if x.group(1) is not None else x.group(2))
                    for x in re.finditer(CHUOI, ts[3]))).strip()
            truong = {"tab": tab, "kieu": kieu, "ten": ten, "nhan": nhan,
                      "mota": mota or None, "chon": [], "goiy": None,
                      "batbuoc": False, "chiModal": None}
            if sec is None:
                sec = {"kieu": "?", "muc": None, "tabs": [], "truong": []}
                secs.append(sec)
            sec["truong"].append(truong)
        elif m.group("val") and truong is not None:
            ts, _e = tach_tham_so(src, m.end())
            # Tham so co the la SO khong nhay: o.value(100,'100%') -> lay nguyen.
            # Nhung neu la TEN BIEN (vd o.value(channel,channel) trong vong lap
            # duyet danh sach kenh tinh luc chay) thi bo qua - khong the biet
            # gia tri that tu ma nguon, them vao se ra muc rac 'channel'.
            def gt(x):
                c = chuoi_dau(x)
                if c is not None:
                    return c
                x = x.strip()
                return x if re.fullmatch(r"-?\d+(\.\d+)?", x) else None
            v = gt(ts[0]) if ts else ""
            n = gt(ts[1]) if len(ts) > 1 else v
            if v is None:
                continue
            truong["chon"].append({"v": v if v is not None else "", "n": n if n is not None else (v or "")})
        elif m.group("ph") and truong is not None:
            gt, _j = nhanh(src, m.end())
            truong["goiy"] = chuoi_dau(gt) or (gt.strip() if re.fullmatch(r"-?\d+", gt.strip()) else None)
        elif m.group("mo") and truong is not None:
            truong["chiModal"] = (m.group("mov") == "true")
        elif m.group("ro") and truong is not None:
            # o.readonly=true -> thiet bi hien o mo/khoa, khong sua duoc
            truong["khoa"] = (m.group("rov") == "true")
        elif m.group("rm") and truong is not None:
            truong["batbuoc"] = (m.group("rmv") == "false")
        elif m.group("df") and truong is not None:
            gt, _j = nhanh(src, m.end())
            c = chuoi_dau(gt)
            if c is not None:
                truong["macdinh"] = c
    return tieude_map, secs


def main():
    # ban do trang -> module view, lay tu menu.json cua thiet bi
    menu = json.load(open(os.path.join(WWW, "menu.json"), encoding="utf-8"))

    def duyet(node, duong, ra):
        for ten, con in (node.get("children") or {}).items():
            d = duong + "/" + ten
            act = (con.get("action") or {}) if isinstance(con, dict) else {}
            p = act.get("path")
            # 'path' co the la mot chuoi HOAC mot danh sach nhieu module view
            # (vd /admin/internet/security = ['internet/firewall','internet/antidos'])
            if p:
                ra.setdefault(d, []).extend([p] if isinstance(p, str) else list(p))
            duyet(con, d, ra)
        return ra

    goc = menu.get("children") and menu or {"children": menu}
    bando = duyet(goc, "", {})

    co_trang = set(os.listdir(os.path.join(WWW, "pages")))

    ket = {}
    for duong, views in sorted(bando.items()):
        # bo cac muc menu khong co trong ban gia lap (trang goc OpenWrt nhu
        # /admin/network/wireless - thiet bi khong dung, khong ai mo duoc)
        if duong.strip("/").replace("/", "__") + ".html" not in co_trang:
            continue
        ds = []
        for v in views:
            f = os.path.join(CAP, "view__" + v.replace("/", "__") + ".js")
            if not os.path.exists(f):
                continue
            src = open(f, encoding="utf-8", errors="replace").read()
            tieude, secs = boc(src)
            for s in secs:
                if s["kieu"] not in ("GridSection", "TableSection"):
                    continue                      # chi section co nut Add moi mo modal
                # Loc ra dung nhung gi thuc su hien trong hop thoai:
                #  - HiddenValue: khong bao gio hien
                #  - modalonly=false: la cot cua bang, khong phai o trong hop thoai
                #  - khong co nhan: cot ky thuat
                tr = [x for x in s["truong"]
                      if x["kieu"] not in AN and x["chiModal"] is not False and x["nhan"]]
                if not tr:
                    continue
                dungtab = [t for t in s["tabs"] if any(x["tab"] == t["id"] for x in tr)]
                ds.append({
                    "tieuDe": tieude or s["muc"],
                    "muc": s["muc"],
                    "tabs": dungtab,
                    "truong": tr,
                })
        if ds:
            ket[duong.strip("/").replace("/", "__")] = ds

    out = os.path.join(WWW, "modal-defs.json")
    json.dump(ket, open(out, "w", encoding="utf-8"), ensure_ascii=False, indent=1)
    print("Da ghi", out)
    for k, v in ket.items():
        print(" ", k)
        for d in v:
            print("     %-24s tieude=%-22s tabs=%-22s %d truong: %s"
                  % (d["muc"], d["tieuDe"], [t["ten"] for t in d["tabs"]],
                     len(d["truong"]), ", ".join(x["nhan"] or "?" for x in d["truong"])))


if __name__ == "__main__":
    main()
