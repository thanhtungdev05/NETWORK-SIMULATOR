# -*- coding: utf-8 -*-
"""Tach ECharts + cau hinh dong ho toc do ra tu CHUNK GOC cua thiet bi.

Vi sao phai lam the nay
-----------------------
Trang network/speedtest cua thiet bi that ve dong ho toc do bang thu vien
ECharts, ve len <canvas>. Ban chup tinh GD1 chi bat duoc cai canvas RONG
(noi dung canvas la anh ve luc chay, khong serialize duoc), nen tu GD1 den
GD6 bo gia lap phai ve tam mot cung gradient bang CSS -- khong giong that.

Khong tai duoc ECharts tu ben ngoai (registry npm bi chan trong moi truong
lam viec). Nhung KHONG CAN tai: chunk goc cua chinh route speedtest
(reference/source/assets_goc/index-DN0khghO.js, 352 KB) da bundle san CA
ECharts LAN ZRender LAN cau hinh dong ho ben trong. Dung lai chinh no la
cach TRUNG THUC NHAT -- dong ho do chinh ma cua thiet bi ve, khong phai ta
ve lai theo mo ta.

Chunk do la ES module, khong chay thang duoc vi:
  - dau file co 8 cau lenh `import ... from "./index-CW0UhNxy.js"` (React,
    MUI, emotion) -- ta khong co (va khong can) nhung file do
  - cuoi file co `export{...}`

Script nay chuyen no thanh script thuong, KHONG SUA MOT KY TU NAO trong
than chunk:
  1. cat bo cac cau lenh import o dau
  2. cat bo `export{...}` o cuoi
  3. khai bao lai 42 ten bi mat (do bo import) = mot Proxy tro. Phan
     ECharts trong chunk KHONG dung den chung; chi phan React/MUI o cuoi
     chunk dung, ma phan do ta khong bao gio goi toi. Proxy tro nhan moi
     loi goi / truy cap thuoc tinh / new de cac cau lenh cap cao nhat
     (vd `nt("div")(...)` = styled) khong nem loi luc nap.
  4. bay ra dung 4 thu qua window:
       __EC_INIT     = S1  -- echarts.init
       __EC_GET      = mc  -- getInstanceByDom
       __GAUGE_OPT   = ko  -- cau hinh series dong ho (NGUYEN VAN)
       __GAUGE_TICKS = _t  -- mang vach so (NGUYEN VAN)

Chay lai:  python3 src/tach_echarts_goc.py
Dau ra:    src/www/vendor/echarts_goc.js
"""

import os
import re
import sys

O_DAY = os.path.dirname(os.path.abspath(__file__))
GOC = os.path.join(O_DAY, 'www', 'reference_khong_co_o_day')  # chi de doc chu thich
NGUON = os.path.normpath(os.path.join(
    O_DAY, '..', 'reference', 'source', 'assets_goc', 'index-DN0khghO.js'))
DICH = os.path.join(O_DAY, 'www', 'vendor', 'echarts_goc.js')

PREAMBLE_DAU = '''/* ==========================================================================
   echarts_goc.js -- KHONG PHAI thu vien tai tu ben ngoai.

   Day la CHINH chunk goc cua thiet bi:
       reference/source/assets_goc/index-DN0khghO.js
   (chunk cua route network/speedtest, da bundle san ECharts + ZRender),
   duoc chuyen tu ES module sang script thuong bang src/tach_echarts_goc.py.
   THAN CHUNK KHONG BI SUA MOT KY TU NAO -- chi cat import o dau, cat
   export o cuoi, va khai bao lai cac ten bi mat bang mot Proxy tro.

   Nho vay dong ho toc do o network/speedtest do CHINH MA CUA THIET BI ve,
   khong phai ta ve lai theo mo ta.  Sinh lai: python3 src/tach_echarts_goc.py
   ========================================================================== */
(function () {
  'use strict';
  var tro = new Proxy(function () {}, {
    get: function (t, k) {
      if (k === Symbol.toPrimitive) return function () { return ''; };
      return tro;
    },
    apply: function () { return tro; },
    construct: function () { return tro; }
  });
'''

POSTAMBLE = '''
  /* Bay ra dung 4 thu can, khong hon. Ten bien la ten SAU KHI minify cua
     chinh chunk goc (khong doi ten): S1 = echarts.init, mc =
     getInstanceByDom, ko = cau hinh series dong ho, _t = mang vach so. */
  window.__EC_INIT = S1;
  window.__EC_GET = mc;
  window.__GAUGE_OPT = ko;
  window.__GAUGE_TICKS = _t;
})();
'''


def tach():
    if not os.path.exists(NGUON):
        sys.exit('KHONG THAY chunk goc: ' + NGUON)
    src = open(NGUON, encoding='utf-8').read()

    # --- 1. cat cac cau lenh import o dau file
    # CHU Y: chunk co HAI dang import, phai bat ca hai (lan dau chi bat dang
    # thu nhat nen sot 8 cau, trinh duyet bao "Cannot use import statement
    # outside a module"):
    #   a) co binding : import{q as _r,...}from"./index-CW0UhNxy.js";
    #   b) chi tac dung phu (khong co 'from'):  import"./FormHeading-....js";
    # Ca hai deu ket thuc bang  ";  -> quet den dau '";' dau tien la du.
    imports = []
    pos = 0
    while src.startswith('import', pos):
        ket = src.find('";', pos)
        if ket < 0:
            break
        ket += 2
        imports.append(src[pos:ket])
        pos = ket
    body = src[pos:]

    # --- 2. lay danh sach ten duoc binding vao (phan sau 'as' neu co)
    ten = set()
    for imp in imports:
        trong = re.search(r'import\{(.*?)\}from', imp, re.S)
        if trong:
            for phan in trong.group(1).split(','):
                phan = phan.strip()
                ten.add(phan.split(' as ')[-1].strip() if ' as ' in phan else phan)
        else:
            m2 = re.search(r'import\{?(\w+)\}?from', imp)
            if m2:
                ten.add(m2.group(1))
    ten = sorted(n for n in ten if n)

    # --- 3. cat export o cuoi
    m = re.search(r'export\{[^}]*\};?\s*$', body)
    if m:
        body = body[:m.start()]

    ra = (PREAMBLE_DAU
          + '  var ' + ', '.join(n + ' = tro' for n in ten) + ';\n'
          + body + POSTAMBLE)

    os.makedirs(os.path.dirname(DICH), exist_ok=True)
    open(DICH, 'w', encoding='utf-8').write(ra)

    print('nguon      :', NGUON)
    print('cau lenh import da cat :', len(imports))
    print('ten da khai bao lai    :', len(ten))
    print('dich       :', DICH)
    print('kich thuoc :', len(ra), 'byte')


if __name__ == '__main__':
    tach()
