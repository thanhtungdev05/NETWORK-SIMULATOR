with open(r'c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\Gialapthietbi\sim_ax3000hv2\server2.py', 'r', encoding='utf8') as f:
    content = f.read()

import re
# First, remove the bad injection
content = re.sub(r'[\s]*if "dnsTypeRadio" in SIM_STATE:[\s\S]*?# 2\. Replace HTML inputs directly', '\n    # 2. Replace HTML inputs directly', content)

block = r'''
    if "dnsTypeRadio" in SIM_STATE:
        val = SIM_STATE["dnsTypeRadio"]
        html_str = re.sub(r'(var\s+dhcpd_type\s*=\s*["\'])[^"\']*?(["\'])', fr'\g<1>{val}\g<2>', html_str, flags=re.IGNORECASE)
        
    if "PrimaryDns" in SIM_STATE or "SecondDns" in SIM_STATE:
        pri = SIM_STATE.get("PrimaryDns", "")
        sec = SIM_STATE.get("SecondDns", "")
        val_dns = f"N/A,{pri},{sec}"
        html_str = re.sub(r'(var\s+dhcpd_dns_all\s*=\s*["\'])[^"\']*?(["\'])', fr'\g<1>{val_dns}\g<2>', html_str, flags=re.IGNORECASE)

    # 2. Replace HTML inputs directly
'''

content = content.replace('    # 2. Replace HTML inputs directly', block)

with open(r'c:\Users\LQQ\OneDrive\Máy tính\DỰA ÁN FPT\demo\Gialapthietbi\sim_ax3000hv2\server2.py', 'w', encoding='utf8') as f:
    f.write(content)

