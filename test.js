let html_str = 'var dhcpd_dns_all = "";';
let val_dns = 'N/A,8.8.8.8,1.1.1.1';
html_str = html_str.replace(/(var\s+dhcpd_dns_all\s*=\s*['"])[^'"]*?(['"])/i, '' + val_dns + '');
console.log(html_str);
