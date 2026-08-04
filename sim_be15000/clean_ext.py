import os
import re
from bs4 import BeautifulSoup

dirs = [
    r"c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\giailapthietbi\sim_be15000\www\pages",
    r"c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\giailapthietbi\sim_be15000\captures",
    r"c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\giailapthietbi\sim_be15000\www"
]

count = 0
for d in dirs:
    if not os.path.exists(d):
        continue
    files = [os.path.join(d, f) for f in os.listdir(d) if f.endswith('.html')]
    for filepath in files:
        with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
            html = f.read()
        
        soup = BeautifulSoup(html, 'html.parser')
        modified = False
        
        # Collect elements to remove
        to_remove = []
        for tag_name in ['plasmo-csui', 'yd-sidebar']:
            to_remove.extend(soup.find_all(tag_name))

        for el in soup.find_all(True):
            if not getattr(el, 'attrs', None):
                continue
            el_id = str(el.get('id', '') or '')
            el_class_raw = el.get('class', [])
            el_class = ' '.join(el_class_raw) if isinstance(el_class_raw, list) else str(el_class_raw or '')
            
            if any(k in el_id.lower() or k in el_class.lower() for k in ['claude', 'glasp']):
                to_remove.append(el)
        
        for el in to_remove:
            try:
                el.decompose()
                modified = True
            except Exception:
                pass
        
        if modified:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(str(soup))
            count += 1
            print(f"Cleaned {os.path.basename(filepath)}")

print(f"Total cleaned with BeautifulSoup: {count} files.")
