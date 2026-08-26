# -*- coding: utf-8 -*-
"""
1) Them onSimLoad vao bai1, bai4, bai5, bai6 cua AC1000HI
2) Them script chan reload + localStorage vao cac trang simulator
"""
import os, re

BASE = r'c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\Gialapthietbi'
SIM_CGI = os.path.join(BASE, 'sim_ac1000hi', 'src', 'www', 'cgi-bin')

# =====================================================================
# PHAN 1: Them onSimLoad vao cac bai hoc
# =====================================================================

lessons_config = [
    {
        'file': os.path.join(BASE, 'devices', 'ac1000hi', 'lessons', 'bai1.js'),
        'practiceUrl_marker': "practiceUrl: '/sim_ac1000hi/cgi-bin/index.asp?page=home_wan.asp',",
        'storage_keys': ['ftc_sim_wan'],
        'page_keyword': 'home_wan',
    },
    {
        'file': os.path.join(BASE, 'devices', 'ac1000hi', 'lessons', 'bai4.js'),
        'practiceUrl_marker': "practiceUrl: '/sim_ac1000hi/cgi-bin/index.asp?page=access_ddns.asp',",
        'storage_keys': ['ftc_sim_dns'],
        'page_keyword': 'access_ddns',
    },
    {
        'file': os.path.join(BASE, 'devices', 'ac1000hi', 'lessons', 'bai5.js'),
        'practiceUrl_marker': "practiceUrl: '/sim_ac1000hi/cgi-bin/index.asp?page=home_lan.asp',",
        'storage_keys': ['ftc_sim_dhcp'],
        'page_keyword': 'home_lan',
    },
    {
        'file': os.path.join(BASE, 'devices', 'ac1000hi', 'lessons', 'bai6.js'),
        'practiceUrl_marker': "practiceUrl: '/sim_ac1000hi/cgi-bin/index.asp?page=adv_nat_top.asp',",
        'storage_keys': ['ftc_sim_portfwd'],
        'page_keyword': 'adv_nat_top',
    },
]

for cfg in lessons_config:
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

    idx = content.find(cfg['practiceUrl_marker'])
    if idx == -1:
        print('[ERROR] practiceUrl not found in ' + fname)
        continue

    insert_pos = idx + len(cfg['practiceUrl_marker'])
    content = content[:insert_pos] + insert_block + content[insert_pos:]

    with open(cfg['file'], 'w', encoding='utf-8') as f:
        f.write(content)
    print('[OK] Added onSimLoad to ' + fname)


# =====================================================================
# PHAN 2: Them script chan reload + localStorage vao cac trang simulator
# =====================================================================

sim_pages = [
    {
        'file': os.path.join(SIM_CGI, 'home_wan.asp'),
        'store_key': 'ftc_sim_wan',
        'form_name': 'Alpha_WAN',
    },
    {
        'file': os.path.join(SIM_CGI, 'access_ddns.asp'),
        'store_key': 'ftc_sim_dns',
        'form_name': 'DDNS_form',
    },
    {
        'file': os.path.join(SIM_CGI, 'home_lan.asp'),
        'store_key': 'ftc_sim_dhcp',
        'form_name': 'uiViewLanForm',
    },
    {
        'file': os.path.join(SIM_CGI, 'adv_nat_top.asp'),
        'store_key': 'ftc_sim_portfwd',
        'form_name': 'NAT_form',
    },
]

FAKE_SAVE_TEMPLATE = """
<!-- SCRIPT CHAN RELOAD + LOCALSTORAGE (TU DONG THEM VAO) -->
<script>
(function() {{
    var STORE_KEY = '{store_key}';

    function saveFormToStorage() {{
        try {{
            var form = document.{form_name} || document.forms[0];
            if (!form) return;
            var data = {{}};
            for (var i = 0; i < form.elements.length; i++) {{
                var el = form.elements[i];
                if (!el.name) continue;
                if (el.type === 'radio' || el.type === 'checkbox') {{
                    if (el.checked) data[el.name] = el.value;
                }} else {{
                    data[el.name] = el.value;
                }}
            }}
            localStorage.setItem(STORE_KEY, JSON.stringify(data));
        }} catch(e) {{}}
    }}

    function restoreFormFromStorage() {{
        try {{
            var raw = localStorage.getItem(STORE_KEY);
            if (!raw) return;
            var data = JSON.parse(raw);
            var form = document.{form_name} || document.forms[0];
            if (!form) return;
            for (var name in data) {{
                var elements = form.elements[name];
                if (!elements) continue;
                var list = elements.length !== undefined && elements.tagName === undefined ? elements : [elements];
                for (var i = 0; i < list.length; i++) {{
                    var el = list[i];
                    if (el.type === 'radio' || el.type === 'checkbox') {{
                        el.checked = (el.value === data[name]);
                    }} else {{
                        el.value = data[name];
                    }}
                }}
            }}
        }} catch(e) {{}}
    }}

    function showFakeSaveMsg(formEl) {{
        saveFormToStorage();
        var target = document.getElementById('firstDiv') || document.getElementById('firstDiv0') || document.getElementById('buttoncolor') || document.getElementById('button0');
        if (!target) {{
            var btns = formEl ? formEl.querySelectorAll('.button1, input[type=submit], input[type=button]') : [];
            if (btns.length > 0) {{
                target = document.createElement('span');
                btns[0].parentNode.insertBefore(target, btns[0].nextSibling);
            }} else {{
                target = document.body;
            }}
        }}
        if (!document.getElementById('fakeSaveMsg')) {{
            var msg = document.createElement('span');
            msg.id = 'fakeSaveMsg';
            msg.style.color = '#15803d';
            msg.style.fontWeight = 'bold';
            msg.style.fontSize = '12px';
            msg.style.marginLeft = '10px';
            msg.style.lineHeight = '24px';
            target.appendChild(msg);
        }}
        var msgEl = document.getElementById('fakeSaveMsg');
        msgEl.innerHTML = '\\u2714 Saved successfully!';
        setTimeout(function() {{ msgEl.innerHTML = ''; }}, 2500);

        if (window.parent && window.parent.onSimulatorSave) {{
            try {{ window.parent.onSimulatorSave(window); }} catch(e) {{}}
        }}
    }}

    document.addEventListener('submit', function(e) {{
        e.preventDefault();
        showFakeSaveMsg(e.target);
    }});

    if (typeof HTMLFormElement !== 'undefined') {{
        HTMLFormElement.prototype.submit = function() {{
            showFakeSaveMsg(this);
        }};
    }}

    if (document.readyState === 'loading') {{
        document.addEventListener('DOMContentLoaded', restoreFormFromStorage);
    }} else {{
        restoreFormFromStorage();
    }}
    setTimeout(restoreFormFromStorage, 800);
}})();
</script>
<!-- KET THUC SCRIPT CHAN RELOAD -->
"""

for cfg in sim_pages:
    fname = os.path.basename(cfg['file'])
    with open(cfg['file'], 'r', encoding='utf-8') as f:
        content = f.read()

    if 'showFakeSaveMsg' in content:
        print('[SKIP] ' + fname + ' already has fake save script')
        continue

    script = FAKE_SAVE_TEMPLATE.format(
        store_key=cfg['store_key'],
        form_name=cfg['form_name'],
    )

    # Append at end of file
    content = content.rstrip() + '\n' + script
    with open(cfg['file'], 'w', encoding='utf-8') as f:
        f.write(content)
    print('[OK] Added fake save script to ' + fname)

print('\nAll done!')
