import re, time
with open('portal.html', 'r', encoding='utf-8') as f:
    html = f.read()

t = str(int(time.time()))
# Thay thế tất cả .js" hoặc .js?v=..." thành .js?v=timestamp"
html = re.sub(r'\.js(\?v=[0-9]+)?\"', '.js?v=' + t + '"', html)

with open('portal.html', 'w', encoding='utf-8') as f:
    f.write(html)
print("Cache busted")
