#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Go lop boc view-source cua Chrome de lay lai ma GOC.

Khi luu bang Ctrl+U roi Ctrl+S, Chrome khong luu ma goc ma luu trang
"view-source" cua chinh no: moi dong bi boc trong <td class="line-content">,
cac ky tu < > & bi doi thanh entity. File phinh to gap 4-5 lan.

Script nay dao nguoc dung quy trinh do: lay lai tung dong theo thu tu,
giai entity, ghep lai thanh file goc.

Chay:
    python go_boc_viewsource.py <file-bi-boc> <file-ket-qua>
"""
import html
import os
import re
import sys


def go_boc(noi_dung):
    """Tra ve (ma_goc, so_dong). Nem ValueError neu khong phai view-source."""
    if 'class="line-content"' not in noi_dung:
        raise ValueError("File nay khong phai trang view-source (khong thay line-content)")

    # moi dong nam trong <td class="line-content"> ... </td>
    o = re.findall(r'<td class="line-content">(.*?)</td>', noi_dung, re.S)
    if not o:
        raise ValueError("Khong tach duoc dong nao")

    dong = []
    for raw in o:
        # bo cac the to mau cu phap ma Chrome them vao
        s = re.sub(r'<span[^>]*>', '', raw)
        s = s.replace('</span>', '')
        s = re.sub(r'<a\b[^>]*>', '', s)
        s = s.replace('</a>', '')
        s = re.sub(r'<br\s*/?>', '', s)
        dong.append(html.unescape(s))

    return "\n".join(dong), len(dong)


def main():
    if len(sys.argv) < 3:
        print("Vi du:")
        print(r"  python go_boc_viewsource.py reference\source\login-page.html reference\source\login-page.html")
        return 1

    nguon, dich = sys.argv[1], sys.argv[2]
    if not os.path.exists(nguon):
        print("Khong thay file:", nguon)
        return 1

    with open(nguon, "r", encoding="utf-8", errors="replace") as f:
        raw = f.read()

    try:
        goc, so_dong = go_boc(raw)
    except ValueError as e:
        print("DUNG:", e)
        return 1

    # giu ban bi boc lai de doi chieu, phong khi go sai
    if nguon == dich:
        luu_tam = nguon + ".viewsource-goc"
        if not os.path.exists(luu_tam):
            os.rename(nguon, luu_tam)
            print("Da doi ten ban bi boc thanh:", os.path.basename(luu_tam))

    with open(dich, "w", encoding="utf-8", newline="") as f:
        f.write(goc)

    print("Truoc khi go : %8d bytes" % len(raw.encode("utf-8")))
    print("Sau khi go   : %8d bytes / %d dong" % (len(goc.encode("utf-8")), so_dong))
    print("Ty le        : %.1f lan" % (len(raw) / max(1, len(goc))))

    # tu kiem: ma goc phai chua cac dau hieu cua trang dang nhap
    dau_hieu = ["sha256", "Frm_Password", "login_token", "login_entry", "_sessionTOKEN"]
    thieu = [d for d in dau_hieu if d not in goc]
    con_boc = 'class="line-content"' in goc or "&lt;" in goc
    print("Dau hieu thieu:", thieu if thieu else "khong")
    print("Con dau vet view-source:", "CO - GO CHUA SACH" if con_boc else "khong")
    return 0 if (not thieu and not con_boc) else 1


if __name__ == "__main__":
    sys.exit(main())
