# -*- coding: utf-8 -*-
import os

BASE = r'c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\Gialapthietbi'

configs = [
    {
        'file': os.path.join(BASE, 'devices', 'ac1000hi', 'lessons', 'bai5.js'),
        'marker': "practiceUrl: '/sim_ac1000HI/cgi-bin/index.asp?page=home_lan.asp',",
        'storage_keys': ['ftc_sim_dhcp'],
        'page_keyword': 'home_lan',
    },
    {
        'file': os.path.join(BASE, 'devices', 'ac1000hi', 'lessons', 'bai6.js'),
        'marker': "practiceUrl: '/sim_ac1000HI/cgi-bin/index.asp?page=adv_nat_top.asp',",
        'storage_keys': ['ftc_sim_portfwd'],
        'page_keyword': 'adv_nat_top',
    },
]

for cfg in configs:
    fname = os.path.basename(cfg['file'])
    with open(cfg['file'], 'r', encoding='utf-8') as f:
        content = f.read()

    if 'onSimLoad' in content:
        print('[SKIP] ' + fname + ' already has onSimLoad')
        continue

    removes = '\n'.join(["          localStorage.removeItem('" + k + "');" for k in cfg['storage_keys']])
    
    insert_block = """
    // Clear old localStorage when starting a new session
    onSimLoad: function(iframeWindow) {
      try {
        var loc = (iframeWindow.location.href || '').toLowerCase();
        if (loc.indexOf('""" + cfg['page_keyword'] + """') === -1) {
""" + removes + """
        }
      } catch(e) {}
    },
"""

    idx = content.find(cfg['marker'])
    if idx == -1:
        print('[ERROR] practiceUrl not found in ' + fname)
        continue

    insert_pos = idx + len(cfg['marker'])
    content = content[:insert_pos] + insert_block + content[insert_pos:]

    with open(cfg['file'], 'w', encoding='utf-8') as f:
        f.write(content)
    print('[OK] Added onSimLoad to ' + fname)

print('Done!')
