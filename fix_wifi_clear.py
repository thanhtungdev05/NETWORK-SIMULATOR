# -*- coding: utf-8 -*-
import os

BASE = r'c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\Gialapthietbi'

INSERT_BLOCK = """
    // Clear old wifi localStorage when starting a new session (on login page only)
    onSimLoad: function(iframeWindow) {
      try {
        var loc = (iframeWindow.location.href || '').toLowerCase();
        if (loc.indexOf('home_wireless') === -1) {
          localStorage.removeItem('ftc_sim_wifi24');
          localStorage.removeItem('ftc_sim_wifi5g');
        }
      } catch(e) {}
    },

    // CSS selectors for fields to clear at session start
    clearFields: [
      'input[name="ESSID"]',
      'input[name="PreSharedKey1"]',
      'input[name="PreSharedKey2"]',
      'input[name="PreSharedKey3"]'
    ],
"""

PRACTICE_URL_LINE = "    practiceUrl: '/sim_ac1000f/cgi-bin/index.asp?page=home_wireless.asp',"

files_to_fix = [
    os.path.join(BASE, 'devices', 'ac1000f', 'lessons', 'bai2.js'),
    os.path.join(BASE, 'devices', 'ac1000f', 'lessons', 'bai3.js'),
]

for fpath in files_to_fix:
    fname = os.path.basename(fpath)
    with open(fpath, 'r', encoding='utf-8') as f:
        content = f.read()

    if 'clearFields' in content:
        print('[SKIP] ' + fname + ' already has clearFields')
        continue

    if 'onSimLoad' in content:
        print('[SKIP] ' + fname + ' already has onSimLoad')
        continue

    idx = content.find(PRACTICE_URL_LINE)
    if idx == -1:
        print('[ERROR] practiceUrl not found in ' + fname)
        continue

    insert_pos = idx + len(PRACTICE_URL_LINE)
    new_content = content[:insert_pos] + INSERT_BLOCK + content[insert_pos:]

    with open(fpath, 'w', encoding='utf-8') as f:
        f.write(new_content)

    print('[OK] Updated ' + fname)

print('Done!')
