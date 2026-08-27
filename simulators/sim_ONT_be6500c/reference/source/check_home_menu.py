import re
s = open('home_menu_mo.html', encoding='utf-8').read()
i = s.find('css-1nmx4e2')
j = s.find('id="right-layout"')
print('i,j=', i, j)
seg = s[i:j]
heads = list(re.finditer(r'<h6[^>]*>([^<]+)</h6>', seg))
print('so h6 tim thay:', len(heads))
for k, m in enumerate(heads):
    end = heads[k+1].start() if k+1 < len(heads) else len(seg)
    block = seg[m.end():end]
    has_collapse = 'MuiCollapse-root' in block
    items = re.findall(r'role="menuitem"[^>]*><p[^>]*>([^<]+)</p>', block)
    print(' ', m.group(1), '| co Collapse:', has_collapse, '| items:', items)
