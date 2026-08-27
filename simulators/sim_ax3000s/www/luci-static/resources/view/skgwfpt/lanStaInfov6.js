
var sta_tmpDevData=new Array();function pageLoad()
{sta_init();}
function sta_init()
{sta_get_info();}
function sta_get_info()
{var ubusparam=new Array("rtweb.sta","getStaInfo",{});var jsonparam={"id":1,"params":ubusparam};var pData=null;var local_ipv6_addr="";var global_ipv6_addr="";var global_ipv6_addr_num=0;var pData=null;var local_ipv6_addr="";var global_ipv6_addr="";var global_ipv6_addr_num=0;sk_auth_post(jsonparam,function(result)
{sta_tmpDevData=[];for(var i=0;i<result.result[1].total;i++)
{pData=result.result[1].staDevices[i];if(pData.local_ipv6_addr==undefined||isValidIpv6Address(pData.local_ipv6_addr)==false)
continue;local_ipv6_addr=pData.local_ipv6_addr;global_ipv6_addr_num=pData.ipv6_array.length;global_ipv6_addr='';for(var j=0;j<global_ipv6_addr_num;j++)
{if(isValidIpv6Address(pData.ipv6_array[j])==false)
continue;if(j==0)
global_ipv6_addr=pData.ipv6_array[j];else
global_ipv6_addr+="<br>"+pData.ipv6_array[j];}
sta_tmpDevData.push({"index":i+1,"mac":pData.macAddr,"localIpAddr":local_ipv6_addr,"GlobalIpAddr":global_ipv6_addr,"meshrole":pData.meshrole,});}
sta_show_info();});}
function escapehtml(str){return str.replace(/'/g,'&#39;');}
function wan_mac_shift(mac,offset)
{let macArray=mac.split(':').map(part=>parseInt(part,16));macArray[5]+=offset;if(macArray[5]>0xff){macArray[4]+=Math.floor(macArray[5]/0x100);macArray[5]=macArray[5]%0x100;if(macArray[4]>0xff){macArray[3]+=Math.floor(macArray[4]/0x100);macArray[4]=macArray[4]%0x100;}}
return macArray.map(part=>part.toString(16).padStart(2,'0')).join(':');}
function sta_show_info(){var loop=0;var row="";$("#lanStaInfo_devlist").html("");if(0!=sta_tmpDevData.length){$.each(sta_tmpDevData,function(index,obj){row+="<tr><td>"+(index+1)+"</td>";row+="<td>"+(obj.meshrole==2?wan_mac_shift(obj.mac,1).toUpperCase():obj.mac)+"</td>";row+="<td>"+obj.localIpAddr+"</td>";row+="<td>"+obj.GlobalIpAddr+"</td></tr>";loop++;});}else{row+="<tr align='center'><td colspan='4'>"+"No data yet..."+"</td></tr>";}
$("#lanStaInfo_devlist").html(row);}