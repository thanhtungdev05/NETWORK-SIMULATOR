# -*- coding: utf-8 -*-
import os

BASE = r'c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\Gialapthietbi'

# === BAI 2: Cau hinh Wi-Fi (2.4G + 5G) ===
bai2_path = os.path.join(BASE, 'devices', 'ac1000hi', 'lessons', 'bai2.js')

INSERT_BAI2 = """
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

PRACTICE_URL_BAI2 = "  practiceUrl: '/sim_ac1000hi/cgi-bin/index.asp?page=home_wireless.asp',"

with open(bai2_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'clearFields' not in content and 'onSimLoad' not in content:
    idx = content.find(PRACTICE_URL_BAI2)
    if idx != -1:
        insert_pos = idx + len(PRACTICE_URL_BAI2)
        content = content[:insert_pos] + INSERT_BAI2 + content[insert_pos:]
        with open(bai2_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('[OK] Updated bai2.js')
    else:
        print('[ERROR] practiceUrl not found in bai2.js')
else:
    print('[SKIP] bai2.js already has clearFields/onSimLoad')


# === BAI 3: Cau hinh wifi IoT ===
bai3_path = os.path.join(BASE, 'devices', 'ac1000hi', 'lessons', 'bai3.js')

INSERT_BAI3 = """
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

PRACTICE_URL_BAI3 = "  practiceUrl: '/sim_ac1000hi/cgi-bin/index.asp?page=home_wireless.asp',"

with open(bai3_path, 'r', encoding='utf-8') as f:
    content = f.read()

if 'clearFields' not in content and 'onSimLoad' not in content:
    idx = content.find(PRACTICE_URL_BAI3)
    if idx != -1:
        insert_pos = idx + len(PRACTICE_URL_BAI3)
        content = content[:insert_pos] + INSERT_BAI3 + content[insert_pos:]
        with open(bai3_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print('[OK] Updated bai3.js')
    else:
        print('[ERROR] practiceUrl not found in bai3.js')
else:
    print('[SKIP] bai3.js already has clearFields/onSimLoad')

print('Done!')
