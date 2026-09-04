<!DOCTYPE html PUBLIC -//W3C//DTD XHTML 1.0 Transitional//EN http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd>
<html><head>
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<link rel="stylesheet" type="text/css" href="/style.css">
<script language="JavaScript">
	var virstrtmp = top.ary_strings;
	var vir_obj = {};
	for(var i=0; virstrtmp[i][0] != "";i++)
		vir_obj[virstrtmp[i][0]]=virstrtmp[i][1];
</script>
</head>
<script language="JavaScript">
	function saveLog()
	{
		var log='/message_syslog_sort.log?t='+new Date().getTime();
		var code = 'location.assign("' + log + '")';
		eval(code);
	}
</script>
<body>
<FORM>
<div style="background-color: #FFFFFF;width:680px;padding:0px 3px 10px 3px;margin:0;outline:0;position:relative;border:1px solid #fff;">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<tr height="25px" style="width:100%;background:#e6e6e6;">
<td align=left style="width:250px;padding-left:20px;font-family: 'BeVietnamBold',Be Vietnam;font-size:15px;white-space:nowrap;text-align:left;color: #4acbd6;"><script>document.writeln(vir_obj["SystemLogText"]);</script></td>
</tr>
</table>
<tr>
<td class="light-orange"></td><td colspan="3" class="tabdata">&nbsp;</td></tr><tr>
<td class="light-orange">&nbsp;</td><td colspan="3" class="tabdata">
<TEXTAREA NAME="AlphaLogDisplay" ROWS="25" COLS="80" WRAP="ON" EDIT="OFF" style="font-family:'BeVietnamRegular',Be Vietnam;font-size: 12px;color: #404040;" READONLY>
[1970-01-01 07:49:18][FIREWALL][INFO] * Populating IPv6 filter table fw3_commit_table_flag = 0
[1970-01-01 07:49:18][FIREWALL][INFO] * Populating IPv6 nat table
[1970-01-01 07:49:18][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'prerouting_lan_rule'
[1970-01-01 07:49:18][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'postrouting_lan_rule'
[1970-01-01 07:49:18][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'prerouting_wan_rule'
[1970-01-01 07:49:18][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'postrouting_wan_rule'
[1970-01-01 07:49:18][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'prerouting_rule'
[1970-01-01 07:49:18][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'postrouting_rule'
[1970-01-01 07:49:18][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:18][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:18][FIREWALL][INFO] * Populating IPv6 nat table fw3_commit_table_flag = 0
[1970-01-01 07:49:18][FIREWALL][INFO] * Populating IPv6 mangle table
[1970-01-01 07:49:18][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:18][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:18][FIREWALL][INFO] * Populating IPv6 mangle table fw3_commit_table_flag = 0
[1970-01-01 07:49:18][FIREWALL][INFO] * Populating IPv6 raw table
[1970-01-01 07:49:18][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:18][FIREWALL][INFO]     - Using automatic conntrack helper attachment
[1970-01-01 07:49:18][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:18][FIREWALL][INFO] * Populating IPv6 raw table fw3_commit_table_flag = 0
[1970-01-01 07:49:18][FIREWALL][INFO] * Set tcp_ecn to off
[1970-01-01 07:49:18][FIREWALL][INFO] * Set tcp_syncookies to on
[1970-01-01 07:49:18][FIREWALL][INFO] * Set tcp_window_scaling to on
[1970-01-01 07:49:18][FIREWALL][INFO] * Running script '/usr/share/miniupnpd/firewall.include'
[1970-01-01 07:49:26][PPPoE][DEBUG]PPPoE send PADI.
[1970-01-01 07:49:36][PPPoE][DEBUG]PPPoE send PADI.
[1970-01-01 07:49:47][PPPoE][DEBUG]PPPoE send PADI.
[1970-01-01 07:49:49][FIREWALL][WARNING]Rediect stderr to /dev/null
[1970-01-01 07:49:49][FIREWALL][WARNING]Unable to locate ipset utility, disabling ipset support
[1970-01-01 07:49:49][FIREWALL][WARNING]Section @defaults[0] requires unavailable target extension FLOWOFFLOAD, disabling
[1970-01-01 07:49:49][FIREWALL][WARNING]Section @zone[1] (wan) cannot resolve device of network 'wan6'
[1970-01-01 07:49:49][FIREWALL][WARNING]Section @defaults[0] requires unavailable target extension FLOWOFFLOAD, disabling
[1970-01-01 07:49:49][FIREWALL][INFO] * Clearing IPv4 filter table
[1970-01-01 07:49:49][FIREWALL][INFO] * Clearing IPv4 nat table
[1970-01-01 07:49:49][FIREWALL][INFO] * Clearing IPv4 mangle table
[1970-01-01 07:49:49][FIREWALL][INFO] * Clearing IPv4 raw table
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv4 filter table
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'ubus:igmpproxy[instance1] rule 0'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'ubus:igmpproxy[instance1] rule 1'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'ubus:igmpproxy[instance1] rule 2'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'ubus:igmpproxy[instance1] rule 3'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-DHCP-Renew'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-Ping'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-IGMP'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-IPSec-ESP'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-ISAKMP'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-ACS-Server'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'lan_access_22_accept'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'lan_access_22_drop'  family 4
[1970-01-01 07:49:49][FIREWALL][INFO]   * Forward 'lan' -> 'wan'
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv4 filter table fw3_commit_table_flag = 0
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv4 nat table
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv4 nat table fw3_commit_table_flag = 0
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv4 mangle table
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv4 mangle table fw3_commit_table_flag = 0
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv4 raw table
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:49][FIREWALL][INFO]     - Using automatic conntrack helper attachment
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv4 raw table fw3_commit_table_flag = 0
[1970-01-01 07:49:49][FIREWALL][INFO] * Clearing IPv6 filter table
[1970-01-01 07:49:49][FIREWALL][INFO] * Clearing IPv6 nat table
[1970-01-01 07:49:49][FIREWALL][INFO] * Clearing IPv6 mangle table
[1970-01-01 07:49:49][FIREWALL][INFO] * Clearing IPv6 raw table
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv6 filter table
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-DHCPv6'  family 5
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-MLD'  family 5
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-ICMPv6-Input'  family 5
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-ICMPv6-Forward'  family 5
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-IPSec-ESP'  family 5
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-ISAKMP'  family 5
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'Allow-ACS-Server'  family 5
[1970-01-01 07:49:49][FIREWALL][INFO]     ! Skipping due to different family of ip address
[1970-01-01 07:49:49][FIREWALL][INFO]     ! Skipping due to different family of ip address
[1970-01-01 07:49:49][FIREWALL][INFO]     ! Skipping due to different family of ip address
[1970-01-01 07:49:49][FIREWALL][INFO]     ! Skipping due to different family of ip address
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'lan_access_22_accept'  family 5
[1970-01-01 07:49:49][FIREWALL][INFO]   * Rule 'lan_access_22_drop'  family 5
[1970-01-01 07:49:49][FIREWALL][INFO]   * Forward 'lan' -> 'wan'
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv6 filter table fw3_commit_table_flag = 0
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv6 nat table
[1970-01-01 07:49:49][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'prerouting_lan_rule'
[1970-01-01 07:49:49][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'postrouting_lan_rule'
[1970-01-01 07:49:49][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'prerouting_wan_rule'
[1970-01-01 07:49:49][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'postrouting_wan_rule'
[1970-01-01 07:49:49][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'prerouting_rule'
[1970-01-01 07:49:49][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'postrouting_rule'
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv6 nat table fw3_commit_table_flag = 0
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv6 mangle table
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv6 mangle table fw3_commit_table_flag = 0
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv6 raw table
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:49:49][FIREWALL][INFO]     - Using automatic conntrack helper attachment
[1970-01-01 07:49:49][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:49:49][FIREWALL][INFO] * Populating IPv6 raw table fw3_commit_table_flag = 0
[1970-01-01 07:49:49][FIREWALL][INFO] * Set tcp_ecn to off
[1970-01-01 07:49:49][FIREWALL][INFO] * Set tcp_syncookies to on
[1970-01-01 07:49:49][FIREWALL][INFO] * Set tcp_window_scaling to on
[1970-01-01 07:49:49][FIREWALL][INFO] * Running script '/usr/share/miniupnpd/firewall.include'
[1970-01-01 07:49:57][PPPoE][DEBUG]PPPoE send PADI.
[1970-01-01 07:50:07][PPPoE][DEBUG]PPPoE send PADI.
[1970-01-01 07:50:17][PPPoE][DEBUG]PPPoE send PADI.
[1970-01-01 07:50:19][FIREWALL][WARNING]Rediect stderr to /dev/null
[1970-01-01 07:50:19][FIREWALL][WARNING]Unable to locate ipset utility, disabling ipset support
[1970-01-01 07:50:19][FIREWALL][WARNING]Section @defaults[0] requires unavailable target extension FLOWOFFLOAD, disabling
[1970-01-01 07:50:19][FIREWALL][WARNING]Section @zone[1] (wan) cannot resolve device of network 'wan6'
[1970-01-01 07:50:19][FIREWALL][WARNING]Section @defaults[0] requires unavailable target extension FLOWOFFLOAD, disabling
[1970-01-01 07:50:19][FIREWALL][INFO] * Clearing IPv4 filter table
[1970-01-01 07:50:19][FIREWALL][INFO] * Clearing IPv4 nat table
[1970-01-01 07:50:19][FIREWALL][INFO] * Clearing IPv4 mangle table
[1970-01-01 07:50:19][FIREWALL][INFO] * Clearing IPv4 raw table
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv4 filter table
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'ubus:igmpproxy[instance1] rule 0'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'ubus:igmpproxy[instance1] rule 1'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'ubus:igmpproxy[instance1] rule 2'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'ubus:igmpproxy[instance1] rule 3'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-DHCP-Renew'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-Ping'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-IGMP'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-IPSec-ESP'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-ISAKMP'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-ACS-Server'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'lan_access_22_accept'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'lan_access_22_drop'  family 4
[1970-01-01 07:50:19][FIREWALL][INFO]   * Forward 'lan' -> 'wan'
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv4 filter table fw3_commit_table_flag = 0
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv4 nat table
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv4 nat table fw3_commit_table_flag = 0
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv4 mangle table
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv4 mangle table fw3_commit_table_flag = 0
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv4 raw table
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:50:19][FIREWALL][INFO]     - Using automatic conntrack helper attachment
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv4 raw table fw3_commit_table_flag = 0
[1970-01-01 07:50:19][FIREWALL][INFO] * Clearing IPv6 filter table
[1970-01-01 07:50:19][FIREWALL][INFO] * Clearing IPv6 nat table
[1970-01-01 07:50:19][FIREWALL][INFO] * Clearing IPv6 mangle table
[1970-01-01 07:50:19][FIREWALL][INFO] * Clearing IPv6 raw table
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv6 filter table
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-DHCPv6'  family 5
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-MLD'  family 5
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-ICMPv6-Input'  family 5
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-ICMPv6-Forward'  family 5
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-IPSec-ESP'  family 5
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-ISAKMP'  family 5
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'Allow-ACS-Server'  family 5
[1970-01-01 07:50:19][FIREWALL][INFO]     ! Skipping due to different family of ip address
[1970-01-01 07:50:19][FIREWALL][INFO]     ! Skipping due to different family of ip address
[1970-01-01 07:50:19][FIREWALL][INFO]     ! Skipping due to different family of ip address
[1970-01-01 07:50:19][FIREWALL][INFO]     ! Skipping due to different family of ip address
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'lan_access_22_accept'  family 5
[1970-01-01 07:50:19][FIREWALL][INFO]   * Rule 'lan_access_22_drop'  family 5
[1970-01-01 07:50:19][FIREWALL][INFO]   * Forward 'lan' -> 'wan'
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv6 filter table fw3_commit_table_flag = 0
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv6 nat table
[1970-01-01 07:50:19][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'prerouting_lan_rule'
[1970-01-01 07:50:19][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'postrouting_lan_rule'
[1970-01-01 07:50:19][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'prerouting_wan_rule'
[1970-01-01 07:50:19][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'postrouting_wan_rule'
[1970-01-01 07:50:19][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'prerouting_rule'
[1970-01-01 07:50:19][FIREWALL][WARNING]fw3_ipt_rule_append(): Can't find target 'postrouting_rule'
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv6 nat table fw3_commit_table_flag = 0
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv6 mangle table
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv6 mangle table fw3_commit_table_flag = 0
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv6 raw table
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'lan'
[1970-01-01 07:50:19][FIREWALL][INFO]     - Using automatic conntrack helper attachment
[1970-01-01 07:50:19][FIREWALL][INFO]   * Zone 'wan'
[1970-01-01 07:50:19][FIREWALL][INFO] * Populating IPv6 raw table fw3_commit_table_flag = 0
[1970-01-01 07:50:19][FIREWALL][INFO] * Set tcp_ecn to off
[1970-01-01 07:50:19][FIREWALL][INFO] * Set tcp_syncookies to on
[1970-01-01 07:50:19][FIREWALL][INFO] * Set tcp_window_scaling to on
[1970-01-01 07:50:19][FIREWALL][INFO] * Running script '/usr/share/miniupnpd/firewall.include'
[1970-01-01 07:50:27][PPPoE][DEBUG]PPPoE send PADI.
[1970-01-01 07:50:37][PPPoE][DEBUG]PPPoE send PADI.
</TEXTAREA>
</td></tr><tr><td class="light-orange"></td>
<td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td></tr></table>
</div>
<div style="background-color: #FFFFFF;width:680px;padding:0px 3px 10px 3px;margin:0;outline:0;position:relative;border:1px solid #fff;"><table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
<tr>
<td width="220"class="orange" height="42">&nbsp;</td><td width="390" class="orange">&nbsp;
<INPUT Name="bt_refresh" type="button" class="button1" value="Refresh" onClick="javascript:window.location='/cgi-bin/status_log.cgi'">&nbsp;&nbsp;<input type="button" class="button1" value="Save" onClick="saveLog();">
</td></tr></table></div></form>
</body></html>
