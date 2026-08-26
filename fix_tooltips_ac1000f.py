# -*- coding: utf-8 -*-
import os

base = r'c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\Gialapthietbi\devices\ac1000f\tooltips'
for f in os.listdir(base):
    if not f.endswith('.js'): continue
    p = os.path.join(base, f)
    with open(p, 'r', encoding='utf-8') as file:
        c = file.read()
        
    c = c.replace("page: 'home_wireless.asp',", "page: 'home_wireless.asp',\n    hideOnPage: 'home_wireless_5g.asp',")
    
    with open(p, 'w', encoding='utf-8') as file:
        file.write(c)

print('Done fixing AC1000F tooltips')
