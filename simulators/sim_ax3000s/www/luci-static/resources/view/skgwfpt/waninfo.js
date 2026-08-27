
var WanConnJson={};var WanCfgJson={};var vpInfonJson={};function getConnectypeStr(connectype)
{var contypestr;connectype=connectype.toLowerCase();if(connectype=="dhcp")
{contypestr="DHCP";}
else if(connectype=="pppoe")
{contypestr="PPPoE";}
else if(connectype=="bridge")
{contypestr="Bridge";}
else if(connectype=="static")
{contypestr="Static IP";}
else if(connectype=="ds-lite")
{contypestr="DS-Lite";}
else
{contypestr="DHCP";}
return contypestr;}
function getVlanidprioStr(vlanmode,vlanid,priority)
{var vpstr;if(vlanmode!='2')
{vpstr="--";}
else
{vpstr=vlanid+" / "+priority;}
return vpstr;}
function getServerModeStr(servMode)
{var smodestr;switch(parseInt(servMode))
{case 1:smodestr="TR069";break;case 2:smodestr="INTERNET";break;case 3:smodestr="VOIP";break;case 4:smodestr="IPTV";break;case 5:smodestr="TR069_INTERNET";break;case 6:smodestr="TR069_VOIP";break;case 7:smodestr="VOIP_INTERNET";break;default:smodestr="TR069_VOIP_INTERNET";break;}
return smodestr;}
function getIpmodeStr(ipProtocalMode)
{var ipProtocalstr;switch(parseInt(ipProtocalMode))
{case 1:ipProtocalstr="IPv4";break;case 2:ipProtocalstr="IPv6";break;case 3:ipProtocalstr="IPv4 & IPv6";break;default:ipProtocalstr="IPv4";break;}
return ipProtocalstr;}
function getSubnetMaskIpStr(value)
{var ipStr=""
if(value==undefined)
ipStr="&nbsp;"
else
ipStr=value
return ipStr;}
function getIpStr(value)
{var ipStr=""
if(value==undefined||isValidIpAddress(value)==false)
ipStr="&nbsp;"
else
ipStr=value
return ipStr;}
function getIpv6Str(value)
{var ipStr=""
if(value==undefined||isValidIpv6Address(value)==false)
ipStr="&nbsp;"
else
ipStr=value;return ipStr;}
function getEnableStr(value)
{var ret='Disabled';if(value==undefined||value!=1)
ret="Enable";else
ret="Disabled";return ret;}
function getUptimeStr(uptime)
{var days,hrs,mins,secs;var uptimeStr="";if(uptime==undefined||uptime==0)
{return"&nbsp;"}
secs=uptime%60;uptime=parseInt(uptime/60);mins=uptime%60;uptime=parseInt(uptime/60);hrs=uptime%24;uptime=parseInt(uptime/24);days=uptime;if(days!=0)
{uptimeStr=days+" days ";}
uptimeStr+=String(hrs).padStart(2,'0')+":"+String(mins).padStart(2,'0')+":"+String(secs).padStart(2,'0');return uptimeStr;}
function getConnStatusStr(status)
{var statusStr="Disconnected";if(status==undefined||status=="down")
{statusStr="Disconnected";}
else if(status=="up")
{statusStr="Connected";}
return statusStr}
function showWanBasicInfoTab()
{var wanEntry="";var i=0;$("#wan_basic_info_table").empty();for(i=0;i<WanConnJson.length;i++)
{if(WanConnJson[i].GUIname.indexOf("IPTV")!==-1)
continue;wanEntry+="<tr>";wanEntry+="<td>"+WanConnJson[i].GUIname+"</td>";wanEntry+="<td>"+getConnectypeStr(WanConnJson[i].v4_type!=''?WanConnJson[i].v4_type:WanConnJson[i].v6_type)+"</td>";wanEntry+="<td>"+getIpmodeStr(WanConnJson[i].IPStack)+"</td>";wanEntry+="<td>"+getVlanidprioStr(WanConnJson[i].vlanmode,WanConnJson[i].vlanid,WanConnJson[i].vlanpri)+"</td>";wanEntry+="<td>"+WanConnJson[i].mac_addr+"</td>";wanEntry+="</tr>";}
$("#wan_basic_info_table").append(wanEntry);}
function showWanIPv4InfoTab()
{var wanEntry="";var i=0;var dnsStr="";$("#wan_ipv4_info_table").empty();for(i=0;i<WanConnJson.length;i++)
{if(WanConnJson[i].v4_type!="bridge"&&WanConnJson[i].IPStack==2)
{continue;}
if(WanConnJson[i].GUIname.indexOf("IPTV")!==-1)
continue;wanEntry+="<tr>";wanEntry+="<td>"+WanConnJson[i].GUIname+"</td>";wanEntry+="<td>"+getConnStatusStr(WanConnJson[i].v4_status)+"</td>";wanEntry+="<td>"+getIpStr(WanConnJson[i].ipaddr)+"</td>";wanEntry+="<td>"+getSubnetMaskIpStr(WanConnJson[i].subnetmask)+"</td>";wanEntry+="<td>"+getIpStr(WanConnJson[i].gateway)+"</td>";dnsStr=getIpStr(WanConnJson[i].dns1);if(WanConnJson[i].dns2!=undefined&&isValidIpAddress(WanConnJson[i].dns2)==true)
{dnsStr+="<br>"+getIpStr(WanConnJson[i].dns2);}
wanEntry+="<td>"+dnsStr+"</td>";wanEntry+="<td>"+getUptimeStr(WanConnJson[i].v4_uptime)+"</td>";wanEntry+="</tr>";}
$("#wan_ipv4_info_table").append(wanEntry);}
function showWanIPv6InfoTab()
{var wanEntry="";var i=0;var ipv6AddrAndPdStr="";var dnsStr="";$("#wan_ipv6_info_table").empty();for(i=0;i<WanConnJson.length;i++)
{if(WanConnJson[i].v4_type!="bridge"&&WanConnJson[i].IPStack==1)
{continue;}
wanEntry+="<tr>";wanEntry+="<td>"+WanConnJson[i].GUIname+"</td>";wanEntry+="<td>"+getConnStatusStr((WanConnJson[i].v4_type=="bridge")?WanConnJson[i].v4_status:WanConnJson[i].v6_status)+"</td>";ipv6AddrAndPdStr=getIpv6Str(WanConnJson[i].gua);if(WanConnJson[i].prefix!=undefined&&isValidIpv6Address(WanConnJson[i].prefix)==true)
{ipv6AddrAndPdStr+="<br>"+getIpv6Str(WanConnJson[i].prefix);}
wanEntry+="<td>"+ipv6AddrAndPdStr+"</td>";wanEntry+="<td>"+getIpv6Str(WanConnJson[i].gatewayv6)+"</td>";dnsStr=getIpv6Str(WanConnJson[i].dns1v6);if(WanConnJson[i].dns2v6!=undefined&&isValidIpv6Address(WanConnJson[i].dns2v6)==true)
{dnsStr+="<br>"+getIpv6Str(WanConnJson[i].dns2v6);}
wanEntry+="<td>"+dnsStr+"</td>";wanEntry+="<td>"+getUptimeStr((WanConnJson[i].v4_type=="bridge")?WanConnJson[i].v4_uptime:WanConnJson[i].v6_uptime)+"</td>";wanEntry+="</tr>";}
$("#wan_ipv6_info_table").append(wanEntry);fillObj7Items();fillObj8Items();fillObj9Items();}
function fillObj7Items()
{$("#ipv6rdInfoTable").hide();$("#ipv6rd_table").empty();for(var i=0;i<WanConnJson.length;i++)
{if(WanConnJson[i].ipv6rd!=0)
{$("#ipv6rdInfoTable").show();var ipv6rdEntry="<tr>";ipv6rdEntry+="<td>"+WanConnJson[i].GUIname+"</td>";ipv6rdEntry+="<td>"+WanConnJson[i].v4_status+"</td>";ipv6rdEntry+="<td>"+WanCfgJson[i].ipv6rd_peeraddr+"</td>";ipv6rdEntry+="<td>"+WanCfgJson[i].ipv6rd_ipv4mask_len+"</td>";ipv6rdEntry+="<td>"+WanCfgJson[i].ipv6rd_ipv6prefix+"/"+WanCfgJson[i].ipv6rd_ipv6prefix_len+"</td>";ipv6rdEntry+="</tr>";$("#ipv6rd_table").append(ipv6rdEntry);}}}
function fillObj8Items()
{var dsliteEntry="";var i=0;$("#dsliteInfoTable").hide();$("#dslite_table").empty();for(i=0;i<WanConnJson.length;i++)
{if(WanConnJson[i].dslitemode!=0)
{$("#dsliteInfoTable").show();dsliteEntry+="<tr>";dsliteEntry+="<td>"+WanConnJson[i].GUIname+"</td>";dsliteEntry+="<td>"+WanConnJson[i].v6_status+"</td>";dsliteEntry+="<td>"+WanConnJson[i].dslitename+"</td>";dsliteEntry+="<td>"+WanConnJson[i].dsliteaddr+"</td>";dsliteEntry+="</tr>";$("#dslite_table").append(dsliteEntry);}}}
function fillObj9Items()
{var i=0;var type=["PPTP","L2TP","UNKNOW"];$("#vpnInfoTable").hide();$("#vpn_table").empty();for(i=0;i<vpInfonJson.length;i++)
{$("#vpnInfoTable").show();var vpnEntry="";vpnEntry+="<tr>";vpnEntry+="<td>"+vpInfonJson[i].TunnelName+"</td>";vpnEntry+="<td>"+type[vpInfonJson[i].TunnelType>=2?2:vpInfonJson[i].TunnelType]+"</td>";vpnEntry+="<td>"+vpInfonJson[i].Status+"</td>";vpnEntry+="<td>"+vpInfonJson[i].Info.Address+"</td>";vpnEntry+="<td>"+vpInfonJson[i].Info.Server+"</td>";vpnEntry+="<td>"+vpInfonJson[i].Info.Dns.split(",")[0]+"</br>";vpnEntry+=vpInfonJson[i].Info.Dns.split(",")[1]==null?"":vpInfonJson[i].Info.Dns.split(",")[1]+"</td>";vpnEntry+="<td>"+getUptimeStr(vpInfonJson[i].Info.Uptime)+"</td>";vpnEntry+="</tr>";$("#vpn_table").append(vpnEntry);}}
function showWanTab()
{showWanBasicInfoTab();showWanIPv4InfoTab();showWanIPv6InfoTab();}
function ubusGetWanInfo()
{var ubusparam=new Array("gwweb.wancfg","status",{});var ubusparam2=new Array("gwweb.pon.sfu","get_onuType",{});var ubusparam3=new Array("gwweb.wancfg","getWanCfg",{});var ubusparam4=new Array("gwweb.vpn","info",{});var jsonparam=[{"id":1,"params":ubusparam},{"id":2,"params":ubusparam2},{"id":3,"params":ubusparam3},{"id":4,"params":ubusparam4}];sk_auth_post(jsonparam,function(result){WanConnJson=result[0].result[1].wan;var onuType="";if(result[1].result!=null)
{onuType=result[1].result[1].onuType;$("#poninfotab").show();}
WanCfgJson=result[2].result[1].wan;vpInfonJson=result[3].result[1].vpninfo;if(onuType=="hybrid"||onuType=="sfu")
for(var i=0;i<WanConnJson.length;i++)
{if(WanConnJson[i].index==8)
{WanConnJson.splice(i,1);break;}}
showWanTab();});}
function translateTemperature(value)
{if(value>=Math.pow(2,15))
{return-Math.round((Math.pow(2,16)-value)/256);}
else
{return Math.round(value/256);}}
function poninfo_parse_result(data)
{var link_stat="";$.each(data,function(index,obj){if(obj.result==null)
{return;}
if(obj.id==1)
{$("#waninfo_Pon_LinkInfoshow").html(obj.result[1].PON_Link_Info);$("#waninfo_Pon_ONu_Stateshow").html(obj.result[1].ONu_State);$("#waninfo_Pon_GPON_Warn_Infoshow").html(obj.result[1].Warning_Info);link_stat=obj.result[1].PON_Link_Info;if(link_stat!="On")
{$("#waninfo_Pon_FEC_Enableshow").html("-");$("#waninfo_Pon_Encrypt_Modeshow").html("-");$("#waninfo_Pon_GPON_Up_Timeshow").html("-");}
else
{$("#waninfo_Pon_FEC_Enableshow").html(obj.result[1].FEC_Enable);$("#waninfo_Pon_Encrypt_Modeshow").html(obj.result[1].Encrypt_Mode);$("#waninfo_Pon_GPON_Up_Timeshow").html(obj.result[1].GPON_Up_Time);}}
else if(obj.id==2)
{if(link_stat!="On")
{$("#waninfo_Pon_PON_TX_Packagesshow").html(0);$("#waninfo_Pon_PON_RX_Packagesshow").html(0);}
else
{$("#waninfo_Pon_PON_TX_Packagesshow").html(obj.result[1].PON_TX_Packages);$("#waninfo_Pon_PON_RX_Packagesshow").html(obj.result[1].PON_RX_Packages);}}
else if(obj.id==3)
{if(link_stat!="On")
{$("#waninfo_Pon_Recv_Powershow").html("-dBm");$("#waninfo_Pon_Send_Powershow").html("-dBm");$("#waninfo_Pon_voltageshow").html("-mV");$("#waninfo_Pon_Currentshow").html("-mA");var temperStr="-"+"\u2103";$("#waninfo_Pon_Temperatureshow").html(temperStr);}
else
{var rx_light_power_t=obj.result[1].Recv_Power;var rx_light_power=Math.round(Math.log(rx_light_power_t/10000)/Math.log(10)*100)/10;var rx_light_powerStr=String(rx_light_power)+"dBm";$("#waninfo_Pon_Recv_Powershow").html(rx_light_powerStr);var tx_light_power_t=obj.result[1].Send_Power;var tx_light_power=(Math.round(Math.log(obj.result[1].Send_Power/10000)/(Math.log(10))*100)/10);var tx_light_powerStr=String(tx_light_power)+"dBm";$("#waninfo_Pon_Send_Powershow").html(tx_light_powerStr);var voltage_t=(obj.result[1].voltage)/10;var voltageStr=String(voltage_t)+"mV";$("#waninfo_Pon_voltageshow").html(voltageStr);var Current_t=(obj.result[1].Current)/500;var currentStr=String(Current_t)+"mA";$("#waninfo_Pon_Currentshow").html(currentStr);var temper=translateTemperature(obj.result[1].Temperature);var temperStr=String(temper)+"\u2103";$("#waninfo_Pon_Temperatureshow").html(temperStr);}}
else if(obj.id==4)
{if(link_stat!="On")
{$("#waninfo_Pon_PON_TX_Packagesshow").html(0);$("#waninfo_Pon_PON_RX_Packagesshow").html(0);$("#waninfo_Pon_Rx_Bytesshow").html(0);$("#waninfo_Pon_Rx_Packetsshow").html(0);$("#waninfo_Pon_Rx_Unicast_Packetsshow").html(0);$("#waninfo_Pon_Rx_Broadcast_Packetsshow").html(0);$("#waninfo_Pon_Rx_Multicast_Packetsshow").html(0);$("#waninfo_Pon_Rx_Dropped_Packetsshow").html(0);$("#waninfo_Pon_Rx_FEC_Eror_Packetsshow").html(0);$("#waninfo_Pon_Rx_HEC_Eror_Packetsshow").html(0);$("#waninfo_Pon_Tx_Bytesshow").html(0);$("#waninfo_Pon_Tx_Packetsshow").html(0);$("#waninfo_Pon_Tx_Unicast_Packetsshow").html(0);$("#waninfo_Pon_Tx_Broadcast_Packetsshow").html(0);$("#waninfo_Pon_Tx_Multicast_Packets").html(0);$("#waninfo_Pon_Tx_Dropped_Packetsshow").html(0);}
else
{$("#waninfo_Pon_Rx_Bytesshow").html(obj.result[1].Rx_Bytes);$("#waninfo_Pon_Rx_Packetsshow").html(obj.result[1].Rx_Packets);$("#waninfo_Pon_Rx_Unicast_Packetsshow").html(obj.result[1].Rx_Unicast_Packets);$("#waninfo_Pon_Rx_Broadcast_Packetsshow").html(obj.result[1].Rx_Broadcast_Packets);$("#waninfo_Pon_Rx_Multicast_Packetsshow").html(obj.result[1].Rx_Multicast_Packets);$("#waninfo_Pon_Rx_Dropped_Packetsshow").html(obj.result[1].Rx_Dropped_Packets);$("#waninfo_Pon_Rx_FEC_Eror_Packetsshow").html(obj.result[1].Rx_FEC_Eror_Packets);$("#waninfo_Pon_Rx_HEC_Eror_Packetsshow").html(obj.result[1].Rx_HEC_Eror_Packets);$("#waninfo_Pon_Tx_Bytesshow").html(obj.result[1].Tx_Bytes);$("#waninfo_Pon_Tx_Packetsshow").html(obj.result[1].Tx_Packets);$("#waninfo_Pon_Tx_Unicast_Packetsshow").html(obj.result[1].Tx_Unicast_Packets);$("#waninfo_Pon_Tx_Broadcast_Packetsshow").html(obj.result[1].Tx_Broadcast_Packets);$("#waninfo_Pon_Tx_Multicast_Packets").html(obj.result[1].Tx_Multicast_Packets);$("#waninfo_Pon_Tx_Dropped_Packetsshow").html(obj.result[1].Tx_Dropped_Packets);}}});}
function ubusGetPonInfo()
{var ubusparam_get_linkinfo=new Array("rtweb.poninfo","get_linkinfo",{});var ubusparam_get_capsta=new Array("rtweb.poninfo","get_capsta",{});var ubusparam_get_optinfo=new Array("rtweb.poninfo","get_optinfo",{});var ubusparam_get_txrxsta=new Array("rtweb.poninfo","get_txrxsta",{});var jsonparam=[{"id":1,"params":ubusparam_get_linkinfo},{"id":2,"params":ubusparam_get_capsta},{"id":3,"params":ubusparam_get_optinfo},{"id":4,"params":ubusparam_get_txrxsta}];sk_auth_post(jsonparam,function(result){poninfo_parse_result(result);});}
function pageLoad()
{ubusGetWanInfo();showWanTab();ubusGetPonInfo();}
function showNatSessionTable()
{var NatSessionResult=new Array();var index=0;$("#waninfo_secition").hide();$("#nattable_section").show();loading_show();var randnum=generateRandomString(10);var postdata={"sessionid":encodeURIComponent(envcar.sessionid),"command":"/usr/sbin/conntrack -L -f ipv4"};$.ajax({url:"/cgi-bin/cgi-exec?"+randnum,type:"POST",data:postdata,dataType:"text",success:function(result){const lines=result.split('\n');for(var i=0;i<lines.length;i++)
{var srcaddr="";var dstaddr="";var dstport="";var state="";const entry=lines[i].split(/\s+/);if(entry[0]=="udp")
{srcaddr=entry[3].split('=')[1];dstaddr=entry[4].split('=')[1];dstport=entry[6].split('=')[1];match=entry[9].match(/\[(.*?)\]/);if(match)
state=match[1];else
state="ASSURED";}
else if(entry[0]=="tcp")
{srcaddr=entry[4].split('=')[1];dstaddr=entry[5].split('=')[1];dstport=entry[7].split('=')[1];state=entry[3];}
else if(entry[0]=="icmp")
{srcaddr=entry[3].split('=')[1];dstaddr=entry[4].split('=')[1];dstport="";match=entry[10].match(/\[(.*?)\]/);if(match)
state=match[1];else
state="ASSURED";}
else
continue;NatSessionResult.push({"index":++index,"protocol":entry[0],"timeout":entry[2],"srcaddr":srcaddr,"dstaddr":dstaddr,"serverport":dstport,"state":state});}
var row="";$.each(NatSessionResult,function(index,obj){row+="<tr><td>"+obj.index+"</td><td>"+obj.protocol+"</td><td>"+obj.timeout+"</td><td>"+obj.srcaddr+"</td><td>"+obj.dstaddr+"</td><td>"+obj.serverport+"</td><td>"+obj.state;});document.getElementById('nat_connect_num').innerHTML=index;$("#NatTableBody").html(row);hide_mode();}});}