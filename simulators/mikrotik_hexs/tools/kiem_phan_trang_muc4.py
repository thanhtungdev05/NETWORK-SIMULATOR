import json, os, subprocess, sys, time, urllib.request
import os as _os
_GOC = _os.path.dirname(_os.path.dirname(_os.path.abspath(__file__)))
sys.path.insert(0, os.path.join(_GOC, "src"))
import m2, mat_ma
CONG = 8095
CS = f"http://127.0.0.1:{CONG}"
TEP_KHO = os.path.join(_GOC, "src", "cau_hinh.json")
T1 = 0x0000F1
TARGETS = [((3,4),"Log"), ((17,),"History"), ((123,2),"File List Backup")]

def dang(dp, than):
    rq = urllib.request.Request(CS + dp, data=than, method="POST")
    with urllib.request.urlopen(rq, timeout=15) as r:
        return r.read()

if os.path.exists(TEP_KHO): os.remove(TEP_KHO)
srv = subprocess.Popen([sys.executable, os.path.join(_GOC,"src","server.py"), str(CONG)],
                        stdout=subprocess.DEVNULL, stderr=subprocess.STDOUT)
try:
    for _ in range(60):
        time.sleep(0.25)
        try:
            urllib.request.urlopen(CS+"/", timeout=2); break
        except Exception: continue
    priv = os.urandom(32)
    tl = dang("/jsproxy", b"\x00"*8 + mat_ma.khoa_cong(priv))
    ma = int.from_bytes(tl[:4],"big")
    master = mat_ma.bi_mat_chung(priv, tl[8:40])
    tx = mat_ma.RC4(mat_ma.dan_xuat_khoa(master, True, False))
    rx = mat_ma.RC4(mat_ma.dan_xuat_khoa(master, False, False))
    seq=[1]
    def goi(the_ds, cho=10):
        nd = m2.dung_than(the_ds, magic=True)
        than = tx.xor(nd + mat_ma.DEM)
        b = ma.to_bytes(4,"big")+seq[0].to_bytes(4,"big")+than
        seq[0]+=len(than)
        tl_ = dang("/jsproxy", b)
        ro_ = rx.xor(tl_[8:])
        if ro_[-8:] != b" "*8: raise RuntimeError("dem sai")
        return {a:c for a,b2,c in m2.giai_ma_than(ro_[:-8])["the"]}
    sh=[7000]
    def s():
        sh[0]+=1; return sh[0]

    def doc_het_trang(dd, gioi_han_trang=20):
        """Doc tat ca cac trang cua bang, tra ve list dict cac dong."""
        tat_ca = []
        con_tro = None
        for _ in range(gioi_han_trang):
            the = [(0xFF0001,0x88,list(dd)),(0xFF0007,0x08,0xFE0004),
                   (0xFE000C,0x08,5),(0xFF0006,0x08,s())]
            if con_tro is not None:
                the.append((0xFE0003, 0x08, con_tro))
            r = goi(the)
            ds = r.get(0xFE0002) or []
            for m in ds:
                tat_ca.append({a:c for a,b,c in m.get("the",[])})
            con_tro = r.get(0xFE0003)
            if con_tro is None:
                break
        return tat_ca, con_tro is not None

    for dd, ten in TARGETS:
        nhan = f"PT-{'-'.join(map(str,dd))}".encode()
        try:
            r1 = goi([(0xFF0001,0x88,list(dd)),(0xFF0007,0x08,0xFE0005),
                      (T1,0x21,nhan),(0xFF0006,0x08,s())])
            ma_dong = r1.get(0xFE0001)
            rows, con_lai = doc_het_trang(dd)
            found = any(r.get(0xFE0001)==ma_dong and r.get(T1)==nhan for r in rows)
            print(dd, ten, f"them id={ma_dong} tong doc lai {len(rows)} dong, con trang du?={con_lai}, thay dong moi={found}")
            if found:
                goi([(0xFF0001,0x88,list(dd)),(0xFF0007,0x08,0xFE0006),
                     (0xFE0001, 0x09 if ma_dong<256 else 0x08, ma_dong),(0xFF0006,0x08,s())])
                rows2, _ = doc_het_trang(dd)
                still = any(r.get(0xFE0001)==ma_dong for r in rows2)
                print("   sau xoa con khong?", still, f"(tong {len(rows2)} dong)")
        except Exception as e:
            print(dd, ten, "LOI:", type(e).__name__, e)
finally:
    srv.terminate()
    try: srv.wait(timeout=5)
    except Exception: srv.kill()
    if os.path.exists(TEP_KHO): os.remove(TEP_KHO)
