# -*- coding: utf-8 -*-
import os

base = r'c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\Gialapthietbi\devices\ac1000hi\tooltips'
for f in os.listdir(base):
    if not f.endswith('.js'): continue
    p = os.path.join(base, f)
    with open(p, 'r', encoding='utf-8') as file:
        c = file.read()
        
    c = c.replace("urlIncludes", "page")
    c = c.replace("hideOnUrlIncludes", "hideOnPage")
    
    with open(p, 'w', encoding='utf-8') as file:
        file.write(c)

print('Done fixing tooltips back to page/hideOnPage')
