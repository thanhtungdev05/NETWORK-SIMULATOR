#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Nap trang GOC tu reference/source/ va thay gia tri mac dinh bang gia tri
lay tu config_store. GIU NGUYEN toan bo phan con lai.

NGUYEN TAC (CLAUDE.md 2.2) — chi duoc thay GIA TRI, tuyet doi khong dung toi:
  - cau truc DOM va thu tu phan tu
  - thuoc tinh name / id cua moi input, select, checkbox
  - ten ham JavaScript va ten bien toan cuc
  - the <script>, noi dung CSS/JS goc
  - duong dan, query string

Cach thay:
  1. Bien JS nhung trong trang:  var aryLanDhcp = [...]  ->  thay ve phai
  2. Thuoc tinh cua the input:   value="..." / checked / option selected

Trang nao chua co trong config.json thi tra NGUYEN BAN goc — khong bien doi.
"""
import json, os, re

BASE = os.path.dirname(os.path.abspath(__file__))
SOURCE = os.path.normpath(os.path.join(BASE, "..", "reference", "source"))

import vg_config_store as config_store


# ------------------------------------------------------------ tien ich

def _js(v):
    """Doi gia tri Python sang literal JS."""
    if isinstance(v, bool):
        return "1" if v else "0"
    if isinstance(v, (int, float)):
        return str(v)
    if isinstance(v, (list, dict)):
        return json.dumps(v, separators=(",", ""))
    return json.dumps(str(v), ensure_ascii=False)


def _can_bang(s, i):
    mo = s[i]
    dong = "]" if mo == "[" else "}"
    d = 0
    while i < len(s):
        c = s[i]
        if c in "\"'":
            q, i = c, i + 1
            while i < len(s) and s[i] != q:
                i += 2 if s[i] == "\\" else 1
        elif c == mo:
            d += 1
        elif c == dong:
            d -= 1
            if d == 0:
                return i + 1
        i += 1
    return -1


# ------------------------------------------------------------ thay gia tri

def _toan_cuc(s):
    """Tap vi tri cac khai bao `var` o PHAM VI TOAN CUC (ngoai moi ham).

    VI SAO CAN (loi tu gay 26/7/2026): trang tr069.htm co HAI ham khai bao
    CUNG TEN bien cuc bo:
        function initWAN(){ var aryslt=["iPriWANProf","iSecWANProf"]; ... }
        function initVPN(){ var aryslt=["iPriVPNProf","iSecVPNProf"]; ... }
    Ban truoc thay MOI cho `var aryslt` bang mot gia tri duy nhat trong kho
    -> initVPN nhoi danh sach VPN vao o WAN, o VPN rong. Bien trong ham la
    bien CUC BO, khong phai NVRAM — tuyet doi khong duoc dung toi.

    VI SAO CAN quet ca <textarea id="*init" style="display:none">: mot so
    trang (menu.htm, header.htm, dashboard.htm, stringobj.htm...) KHONG khai
    bao bien NVRAM truc tiep trong <script>, ma giau trong mot the <textarea>
    an, roi dung JS doc `.value` cua no de tao <script> that va nhoi vao
    <head> luc chay (phat hien 2026-08-08 khi lam String Object). Neu chi
    quet <script> se bo sot TOAN BO cac bien nay — 12 trang, co trang toi
    90 bien (menu.htm) — khong bao gio thay duoc gia tri moi tu kho cau hinh,
    vi pham nguyen tac 2.5 ngay ca khi kho da co gia tri dung.
    """
    ok = set()
    khoi = (list(re.finditer(r'<script\b[^>]*>(.*?)</script>', s, re.S | re.I)) +
            list(re.finditer(r'<textarea\s+id=["\']?\w*init["\']?[^>]*>(.*?)</textarea>', s, re.S | re.I)))
    for msc in khoi:
        than, goc = msc.group(1), msc.start(1)
        d, i, n = 0, 0, len(than)
        while i < n:
            c = than[i]
            if c in '"\'':
                q, i = c, i + 1
                while i < n and than[i] != q:
                    i += 2 if than[i] == '\\' else 1
            elif c == '/' and i + 1 < n and than[i + 1] == '/':
                i = than.find('\n', i)
                if i < 0:
                    break
            elif c == '/' and i + 1 < n and than[i + 1] == '*':
                i = than.find('*/', i)
                if i < 0:
                    break
                i += 1
            elif c == '{':
                d += 1
            elif c == '}':
                d -= 1
            elif d == 0 and than.startswith('var', i) and (i == 0 or not than[i - 1].isalnum()):
                ok.add(goc + i)
            i += 1
    return ok


def _quet_khai_bao(s, i):
    """Tu vi tri NGAY SAU 'var ', tach tung khai bao `ten = gia_tri` cach nhau
    boi dau phay trong CUNG mot cau lenh var, dung khi het chuoi (gap ';' hoac
    ky tu la o do sau 0). Tra ve [(ten, i_dau_gtri, i_cuoi_gtri), ...].

    VI SAO CAN (phat hien 2026-08-08 khi lam String Object): JS nen/minify gop
    NHIEU bien vao MOT `var`:  var a=1,  b=[2,3],  c="x";
    Ban cu chi doc duoc bien DAU TIEN (a), am tham bo qua b, c. Anh huong
    menu.htm (~90 bien), header.htm, dashboard.htm, stringobj.htm... — xem
    them giai thich o _toan_cuc().
    """
    ra, n = [], len(s)
    while i < n:
        while i < n and s[i] in ' \t\r\n':
            i += 1
        m = re.match(r'\w+', s[i:])
        if not m:
            break
        ten = m.group(0)
        i += m.end()
        while i < n and s[i] in ' \t\r\n':
            i += 1
        if i >= n or s[i] != '=':
            break
        i += 1
        while i < n and s[i] in ' \t\r\n':
            i += 1
        if i >= n:
            break
        if s[i] in '[{':
            j = _can_bang(s, i)
            if j < 0:
                break
        else:
            m2 = re.match(r'''(-?\d+(?:\.\d+)?|"[^"]*"|'[^']*'|true|false|null)''', s[i:])
            if not m2:
                break
            j = i + m2.end()
        ra.append((ten, i, j))
        i = j
        while i < n and s[i] in ' \t\r\n':
            i += 1
        if i < n and s[i] == ',':
            i += 1
            continue
        break
    return ra


def _thay_bien(s, vars_):
    """Thay ve phai cua `var TEN = ...` bang gia tri trong kho. Giu nguyen ten bien.

    CHI thay khai bao o pham vi TOAN CUC — xem giai thich o _toan_cuc().
    Xu ly ca khai bao gop nhieu bien — xem _quet_khai_bao().
    """
    if not vars_:
        return s, 0
    tc = _toan_cuc(s)
    ra, i, n = [], 0, 0
    for m in re.finditer(r'\bvar\s+', s):
        if m.start() not in tc:
            continue
        for ten, j, k in _quet_khai_bao(s, m.end()):
            if ten not in vars_:
                continue
            # Chi thay khi gia tri THUC SU khac ban goc. Bang nhau thi giu nguyen
            # tung ky tu (ke ca kieu dau nhay) — nguyen tac 2.2.
            goc_txt = s[j:k]
            try:
                if json.loads(goc_txt.replace("'", '"')) == vars_[ten]:
                    continue
            except Exception:
                pass
            ra.append(s[i:j])
            ra.append(_js(vars_[ten]))
            i = k
            n += 1
    ra.append(s[i:])
    return "".join(ra), n


def _vung_script(s):
    """Khoang (dau, cuoi) cua moi khoi <script>...</script>.

    VI SAO CAN: trang DrayTek dung JS dung bang, va trong JS co CHUOI chua the
    input, vi du trong mnatop.htm (NAT >> Open Ports):
        aryOpen[i] ? '<input type=checkbox value=1 name=enOpenPt"+i+" checked>'
                   : '<input type=checkbox value=1 name=enOpenPt"+i+">'
    Day KHONG phai the HTML that — day la MA NGUON JAVASCRIPT. Neu coi la the
    HTML roi sua vao, ta dang SUA CODE JS cua thiet bi, vi pham nguyen tac 2.2,
    va hau qua thay ngay tren man hinh: ca 40 o Open Ports deu bi tick.
    """
    return [(m.start(), m.end()) for m in
            re.finditer(r'<script\b[^>]*>.*?</script>', s, re.I | re.S)]


def _trong_script(vung, i):
    return any(d <= i < c for d, c in vung)


def _thay_input(s, inputs):
    """Thay value / checked / option selected. Giu nguyen name, id, thu tu thuoc tinh."""
    if not inputs:
        return s, 0
    dem = [0]
    vung = _vung_script(s)

    def _inp(m):
        if _trong_script(vung, m.start()):     # the nam trong chuoi JS — khong dung toi
            return m.group(0)
        a = m.group(1)
        nm = re.search(r'\bname\s*=\s*["\']?([\w\[\].-]+)', a, re.I)
        if not nm or nm.group(1) not in inputs:
            return m.group(0)
        ten = nm.group(1)
        gt = inputs[ten]
        ty = (re.search(r'\btype\s*=\s*["\']?(\w+)', a, re.I) or [None, "text"])[1].lower()
        if ty in ("button", "submit", "reset", "image", "file"):
            return m.group(0)
        if ty == "radio":
            # RADIO khac CHECKBOX: nhieu the cung `name`, moi the mot `value`.
            # Phai tick the co value BANG gia tri trong kho, khong duoc tick
            # theo bool — lam vay se tick ca nhom (vd iWebAuth=1 ma van tick value=0).
            v = re.search(r'\bvalue\s*=\s*["\']?([^"\'>\s]*)', a, re.I)
            a2 = re.sub(r'\s+checked(?:\s*=\s*["\']?\w*["\']?)?', "", a, flags=re.I)
            if v is not None and str(v.group(1)) == str(gt):
                a2 = a2.rstrip() + " checked"
            dem[0] += 1
            return "<input" + a2 + ">"
        if ty == "checkbox":
            co = bool(gt) and str(gt) not in ("0", "", "False")
            a2 = re.sub(r'\s+checked(?:\s*=\s*["\']?\w*["\']?)?', "", a, flags=re.I)
            if co:
                a2 = a2.rstrip() + " checked"
            dem[0] += 1
            return "<input" + a2 + ">"
        if "{{" in a:                       # o Angular — de nguyen cho JS xu ly
            return m.group(0)
        if re.search(r'\bvalue\s*=', a, re.I):
            a2 = re.sub(r'(\bvalue\s*=\s*")[^"]*(")', lambda x: x.group(1) + str(gt) + x.group(2), a, flags=re.I)
        else:
            a2 = a.rstrip() + f' value="{gt}"'
        dem[0] += 1
        return "<input" + a2 + ">"

    s = re.sub(r"<input\b([^>]*)>", _inp, s, flags=re.I)
    vung = _vung_script(s)          # tinh lai: chuoi da doi do lan thay tren

    def _sel(m):
        if _trong_script(vung, m.start()):     # <select> trong chuoi JS — bo qua
            return m.group(0)
        head, than = m.group(1), m.group(2)
        nm = re.search(r'\bname\s*=\s*["\']?([\w\[\].-]+)', head, re.I)
        if not nm or nm.group(1) not in inputs:
            return m.group(0)
        gt = str(inputs[nm.group(1)])

        def _opt(o):
            at = o.group(1)
            at = re.sub(r'\s+selected(?:\s*=\s*["\']?\w*["\']?)?', "", at, flags=re.I)
            v = re.search(r'\bvalue\s*=\s*["\']?([^"\'>\s]*)', at, re.I)
            if v and v.group(1) == gt:
                at = at.rstrip() + " selected"
            return "<option" + at + ">"

        than = re.sub(r"<option\b([^>]*)>", _opt, than, flags=re.I)
        dem[0] += 1
        return "<select" + head + ">" + than + "</select>"

    s = re.sub(r"<select\b([^>]*)>(.*?)</select>", _sel, s, flags=re.I | re.S)
    return s, dem[0]


# ------------------------------------------------------------ API

def co_trang(duong_dan_goc):
    """Trang goc co ton tai trong reference/source/ khong."""
    return os.path.exists(os.path.join(SOURCE, duong_dan_goc))


def render(duong_dan_goc):
    """Tra (noi_dung_bytes, thong_ke) hoac (None, None) neu khong co trang goc."""
    p = os.path.join(SOURCE, duong_dan_goc)
    if not os.path.exists(p):
        return None, None
    with open(p, "rb") as f:
        raw = f.read()
    try:
        s = raw.decode("utf-8")
        enc = "utf-8"
    except UnicodeDecodeError:
        s = raw.decode("latin-1")
        enc = "latin-1"

    cfg = config_store.trang(duong_dan_goc)
    s2, n_var = _thay_bien(s, cfg.get("vars", {}))
    s2, n_inp = _thay_input(s2, cfg.get("inputs", {}))
    return s2.encode(enc, "replace"), {"bien": n_var, "input": n_inp,
                                       "goc_bytes": len(raw), "ra_bytes": len(s2)}


if __name__ == "__main__":
    import sys
    dd = sys.argv[1] if len(sys.argv) > 1 else "doc/enet1.htm"
    d, tk = render(dd)
    if d is None:
        print("khong co trang goc:", dd)
    else:
        print(dd, "->", tk)
