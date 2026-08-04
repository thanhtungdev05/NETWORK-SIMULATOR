
var sta_devnum=0;var sta_tmpDevData=new Array();function pageLoad()
{sta_init();}
function sta_init()
{sta_get_info();}
function convertEthToLan(input){if(input.startsWith('ra')){if(input.includes('i')){const index=input.replace('rai','');return`Wi-Fi 5G${index === '0' ? '' : '_' + (parseInt(index) + 1)}`;}else{const index=input.replace('ra','');return`Wi-Fi 2.4G${index === '0' ? '' : '_' + (parseInt(index) + 1)}`;}}
return input.replace(/eth0\.(\d)/g,(match,p1)=>{return`LAN${p1}`;});}
function PhymodeConvert(tx_standard,rx_standard,ifname)
{phymode="";if(ifname.includes("rai")==true)
{if(tx_standard=="HE_SU"||rx_standard=="HE_SU")
phymode="802.11ax"
else if(tx_standard=="VHT"||rx_standard=="VHT")
phymode="802.11ac"
else if(tx_standard=="HT_MM"||rx_standard=="HT_MM")
phymode="802.11n"
else if(tx_standard=="OFDM"||rx_standard=="OFDM")
phymode="802.11a"}
else
{if(tx_standard=="HE_SU"||rx_standard=="HE_SU")
phymode="802.11ax"
else if(tx_standard=="VHT"||rx_standard=="VHT"||tx_standard=="HT_MM"||rx_standard=="HT_MM")
phymode="802.11n"
else if(tx_standard=="OFDM"||rx_standard=="OFDM")
phymode="802.11g"
else if(tx_standard=="CCK"||rx_standard=="CCK")
phymode="802.11b"}
return phymode;}
function getProtocolSupport(has11k,has11v){if(has11v===1){return" 802.11v";}else if(has11k===1){return" 802.11k";}else{return"";}}
function meshTopo(data,result){if(data.result&&data.result[1]&&data.result[1].TopologyInfo){var uplinkRole=0;var tmp_jsTopoInfo=JSON.parse(data.result[1].TopologyInfo);$.each(tmp_jsTopoInfo["topology information"],function(index,val){uplinkRole=val.role;var tmp_jsTopoRadioInfo=val["RADIO"];$.each(tmp_jsTopoRadioInfo,function(index,val){$.each(val.VAP,function(index,val){$.each(val.RADIO_CLIENT,function(index,val){result.push({"mac":val.mac.toUpperCase(),"11k_support":val["11k_support"],"11v_support":val["11v_support"],"rssi":val["rx_rssi"],"rx_rate":val["rx_rate"],"tx_rate":val["tx_rate"],"uplinkRole":uplinkRole,"medium":val["medium"]})});})});});$.each(tmp_jsTopoInfo["topology information"],function(index,val){result.push({"mac":val.mac.toUpperCase(),"rssi":val["rssi"],})});}else{return;}}
function sta_get_info(){var ubusparam=new Array("rtweb.sta","getStaInfo",{});var ubusparam_2=new Array("rtweb.wifi","wlanStaGet",{});var ubusparam_3=new Array("rtweb.mesh","MeshTopyGet",{});var jsonparam=[{"id":1,"params":ubusparam},{"id":2,"params":ubusparam_2},{"id":3,"params":ubusparam_3}];var pData=null;var rssi="-";var phymode="-";var phyRate="-";var wlan_tmpDevData=new Array();var curWlanData=null;var curMeshData=null;sk_auth_post(jsonparam,function(result){sta_devnum=0;sta_tmpDevData=[];wlan_tmpDevData=[];mesh_tmpDevData=[];for(var i=0;i<result[1].result[1].bss.length;i++){pData=result[1].result[1].bss[i];wlan_tmpDevData.push({"mac":pData.mac,"signal":pData.signal,"tx_standard":pData.tx_standard,"rx_standard":pData.rx_standard,"nss":pData.nss,"nss_r":pData.nss_r,});}
meshTopo(result[2],mesh_tmpDevData);for(var i=0;i<result[0].result[1].total;i++){pData=result[0].result[1].staDevices[i];rssi="-";phymode="-";if(pData.ifname.includes("ra")==true){curWlanData=wlan_tmpDevData.find(obj=>obj.mac===pData.macAddr);if(curWlanData!=undefined){rssi=curWlanData.signal;phymode=PhymodeConvert(curWlanData.tx_standard,curWlanData.rx_standard,pData.ifname);if(phymode!="")
phymode=curWlanData.nss_r+"x"+curWlanData.nss+" "+phymode;}
curMeshData=mesh_tmpDevData.find(obj=>obj.mac===pData.macAddr);if(curMeshData!=undefined){if(pData.ifname.includes("rai7")!=true)
phymode=phymode+getProtocolSupport(curMeshData["11k_support"],curMeshData["11v_support"])
if(rssi=="")
rssi=curMeshData["rssi"];}
if(phymode=="")
phymode="-";}
else
{curMeshData=mesh_tmpDevData.find(obj=>obj.mac===pData.macAddr);if(curMeshData!=undefined&&curMeshData.medium=="wireless"&&curMeshData.uplinkRole=="2")
{rssi=curMeshData["rssi"];}}
if(pData.ifname.includes("rai7")==true){curMeshData=mesh_tmpDevData.find(obj=>obj.mac===pData.macAddr);if(curMeshData!=undefined&&curMeshData.rx_rate!=undefined&&curMeshData.tx_rate!=undefined){phyRate=curMeshData.rx_rate+"/"+curMeshData.tx_rate;}
else
{phyRate=pData.negorate_r/1000+"/"+pData.negorate/1000;}}else
{if(pData.ifname.includes("ra")==true){phyRate=pData.negorate_r/1000+"/"+pData.negorate/1000;}else{curMeshData=mesh_tmpDevData.find(obj=>obj.mac===pData.macAddr);if(curMeshData!=undefined&&curMeshData.medium=="wireless"&&curMeshData.uplinkRole=="2")
{phyRate=curMeshData.rx_rate+"/"+curMeshData.tx_rate;}
else
phyRate=pData.negorate/1000;}}
sta_devnum++;sta_tmpDevData.push({"index":i+1,"devName":pData.hostname,"ipAddr":pData.ipAddr,"macAddr":pData.macAddr,"port":convertEthToLan(pData.ifname),"dhcpOfferTime":pData.dhcpOfferTime,"phyRate":phyRate,"standard":phymode,"rssi":rssi,"meshrole":pData.meshrole,});}
sta_show_info();});}
function escapehtml(str){return str.replace(/'/g,'&#39;');}
function wan_mac_shift(mac,offset)
{let macArray=mac.split(':').map(part=>parseInt(part,16));macArray[5]+=offset;if(macArray[5]>0xff){macArray[4]+=Math.floor(macArray[5]/0x100);macArray[5]=macArray[5]%0x100;if(macArray[4]>0xff){macArray[3]+=Math.floor(macArray[4]/0x100);macArray[4]=macArray[4]%0x100;}}
return macArray.map(part=>part.toString(16).padStart(2,'0')).join(':');}
function sta_show_info(){var loop=0;var row="";$("#lanStaInfo_devlist").html("");if(0!=sta_devnum){$.each(sta_tmpDevData,function(index,obj){var sta_name=escapehtml(obj.devName);row+="<tr><td>"+(index+1)+"</td>";row+="<td>"+sta_name+"</td>";row+="<td>"+obj.ipAddr+"</td>";row+="<td id='Sta_MAC"+loop+"'> "+(obj.meshrole==2?wan_mac_shift(obj.macAddr,1).toUpperCase():obj.macAddr)+"</td>";row+="<td>"+obj.port+"</td>";row+="<td>"+obj.dhcpOfferTime+"</td>";row+="<td>"+obj.phyRate+"</td>";row+="<td>"+obj.standard+"</td>";row+="<td>"+obj.rssi+"</td></tr>";loop++;});}else{row+="<tr align='center'><td colspan='9'>"+"No data yet..."+"</td></tr>";}
$("#lanStaInfo_devlist").html(row);}
function sta_StatusToStr(status)
{var ret="";if(status==0){ret="Offline";}
else if(status==1){ret="Online";}
return ret;}
function sta_secondsToDhms(seconds)
{if(typeof seconds!=="number"||seconds<0){throw new Error("Invalid input");}
var days=Math.floor(seconds/(24*3600));seconds%=24*3600;var hours=Math.floor(seconds/3600);seconds%=3600;var minutes=Math.floor(seconds/60);seconds%=60;var result="";if(days>0){result+=days+"D ";}
if(hours>0){result+=hours+"H ";}
if(minutes>0){result+=minutes+"M ";}
if(seconds>0){result+=seconds+"S";}
return result.trim();}
function sta_type2str(type)
{var ret=_("lanStaInfo_Unknown");if(type==1){ret=_("lanStaInfo_Wired");}
else if(type==2){ret="2.4G";}else if(type==3){ret="5G";}
return ret;}
function sta_PortToStr(port)
{var ret="";ret="LAN"+port;return ret;}
function isValidString(string){var i=0;var value=0;for(i=0;i<string.length;i++){vaule=string.charAt(i).charCodeAt(0);if(vaule<32||vaule>=123)
{return false;}}
return true;}
function isHostnameValid(string){var i=0;var value=0;var strLen=string.length;if(strLen>0){if(string.indexOf("\\")!=-1){return false;}
if(string.indexOf("\|")!=-1){return false;}}
for(i=0;i<string.length;i++){vaule=string.charAt(i).charCodeAt(0);if(vaule<32||vaule==127)
{return false;}}
return true;}
function sta_set_hostname(mac,hostname)
{var ubusparam=new Array("rtweb.sta","setSta",{"mac":mac,"hostname":hostname});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){hide_mode();if(result.result[1].result!="0")
{warninfo_show(_("lanStaInfo_SetErr"))}});}
function save()
{var path="/tmp/wlan_sta_history.log";$.ajax({url:"/cgi-bin/cgi-download",data:{"sessionid":encodeURIComponent(envcar.sessionid),"path":path},method:"POST",xhrFields:{responseType:"blob"},success:function(data,status,xhr){var filename="wlan_sta_history.log";if(typeof window.navigator.msSaveBlob!=='undefined'){window.navigator.msSaveBlob(data,filename);}else{var URL=window.URL||window.webkitURL;var downloadUrl=URL.createObjectURL(data);if(filename){var a=document.createElement("a");if(typeof a.download==='undefined'){window.location.href=downloadUrl;}else{a.href=downloadUrl;a.download=filename;document.body.appendChild(a);a.click();}}else{window.location.href=downloadUrl;}
setTimeout(function(){URL.revokeObjectURL(downloadUrl);},100);}}});}