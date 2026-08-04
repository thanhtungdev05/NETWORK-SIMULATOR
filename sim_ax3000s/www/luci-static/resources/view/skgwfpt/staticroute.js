
function pageLoad()
{staticRouteLoad();}
function staticRouteItemLoad(itemValue,index)
{var tableNode=document.getElementById("staticRouteTBody");var itemStr="";itemStr+="<tr>";itemStr+="<td><label class='skcheckbox'>";itemStr+=" <input type='checkbox' id='staticRoute_Sel_"+index+"' name='staticRouteSelect' hidden>"
itemStr+="<label for='staticRoute_Sel_"+index+"' class='skcheckbox-label'></label>";itemStr+="</label></td>";itemStr+="<td>"+"V"+itemValue.ipver+"</td>";itemStr+="<td>"+itemValue.target+"/"+itemValue.netmask+"</td>";itemStr+="<td>"+itemValue.gateway+"</td>";itemStr+="<td>"+itemValue.interface+"</td>";itemStr+="<td>"+itemValue.metric+"</td>";itemStr+="</tr>";tableNode.innerHTML+=itemStr;}
function staticRouteShowTable(resArr,resArrWan,resArrVpn)
{var tableNode=document.getElementById("staticRouteTBody");var route4Num=resArr.route4_num;var route6Num=resArr.route6_num;var i,j;var load_num=0;tableNode.innerHTML="";if((!route4Num)&&(!route6Num)){tableNode.innerHTML="<tr align='center'><td colspan='6'>"+_("No data yet...")+"</td></tr>";document.getElementById("staticRouteAll_Sel").checked=false;document.getElementById("staticRouteAll_Sel").disabled=true;return;}
document.getElementById("staticRouteAll_Sel").checked=false;document.getElementById("staticRouteAll_Sel").disabled=false;for(i=0;i<route4Num;i++){if(resArr.route4[i].interface.indexOf("wan")!=-1){for(j=0;j<resArrWan.wan.length;j++){if((resArrWan.wan[j].networktype!="bridge")&&(resArr.route4[i].interface=="wan_"+resArrWan.wan[j].index)){resArr.route4[i].interface=resArrWan.wan[j].GUIname;}}}else{for(j=0;j<resArrVpn.vpncfg.length;j++){if((resArrVpn.vpncfg[j].TunnelServer.indexOf(".")!=-1)&&(resArr.route4[i].interface=="vpn_"+resArrVpn.vpncfg[j].index)){resArr.route4[i].interface=resArrVpn.vpncfg[j].TunnelName;}}}
staticRouteItemLoad(resArr.route4[i],load_num++);}
for(i=0;i<route6Num;i++){if(resArr.route6[i].interface.indexOf("wan")!=-1){for(j=0;j<resArrWan.wan.length;j++){if((resArrWan.wan[j].networktype!="bridge")&&(resArr.route6[i].interface=="wan_"+resArrWan.wan[j].index)){resArr.route6[i].interface=resArrWan.wan[j].GUIname;}}}else{for(j=0;j<resArrVpn.vpncfg.length;j++){if((resArrVpn.vpncfg[j].TunnelServer.indexOf(":")!=-1)&&(resArr.route6[i].interface=="vpn_"+resArrVpn.vpncfg[j].index)){resArr.route6[i].interface=resArrVpn.vpncfg[j].TunnelName;}}}
staticRouteItemLoad(resArr.route6[i],load_num++);}}
function staticRouteLoad()
{var jsonArr=[];jsonArr.push({"id":1,"params":new Array("rtweb.staticroute","get_static_route",{})});jsonArr.push({"id":2,"params":new Array("gwweb.wancfg","getWanCfg",{})});jsonArr.push({"id":2,"params":new Array("gwweb.vpn","get",{})});sk_auth_post(jsonArr,function(result){staticRouteShowTable(result[0].result[1],result[1].result[1],result[2].result[1]);});}
function staticRouteSelectAll(obj)
{var selist=document.getElementsByName("staticRouteSelect");if(selist.length=0)
return;for(var i=0;i<selist.length;i++){if(obj.checked)
selist[i].checked=true;else
selist[i].checked=false;}}
function staticRouteDel()
{var selist=document.getElementsByName("staticRouteSelect");var table=document.getElementById("staticRouteTBody");var jsonArr=[];var paramId=1;if(selist.length==0)
return;for(var i=0;i<table.rows.length;i++){var row=table.rows[i];if(getChecked("staticRoute_Sel_"+i)){var ipver=row.cells[1].innerText.split("V");var ipmask=row.cells[2].innerText.split("/");var metric=row.cells[5].innerText;jsonArr.push({"id":(paramId++),"params":new Array("rtweb.staticroute","del_static_route",{"ipver":ipver[1],"target":ipmask[0],"netmask":Number(ipmask[1]),"metric":Number(metric)})});}}
if(paramId==1){return;}
sk_auth_apply(jsonArr,function(result){staticRouteLoad();});}
function changeIpver(obj)
{if(obj.value=="4"){$("#RouteAdd_IpAndMask4").parent().show();$("#RouteAdd_Gateway4").parent().show();$("#RouteAdd_IpAndMask6").parent().hide();$("#RouteAdd_Gateway6").parent().hide();}
else{$("#RouteAdd_IpAndMask4").parent().hide();$("#RouteAdd_Gateway4").parent().hide();$("#RouteAdd_IpAndMask6").parent().show();$("#RouteAdd_Gateway6").parent().show();}}
function staticRouteAddSubmit()
{var data={};if(document.getElementById("staticRouteTBody").rows.length>=32){warninfo_show(_("The number of configured static routes has reached the maximum value."));$(".warn .close").unbind("click").on("click",function(){$(".warn").hide();});return;}
if(getValue("RouteAdd_IpVer")=="4"){var ipv4StrArray=getValue("RouteAdd_IpAndMask4").split('/');if(ipv4StrArray.length<2){warninfo_show(_("PrefixLength Expected."));$(".warn .close").unbind("click").on("click",function(){$(".warn").hide();});return;}
data.target=ipv4StrArray[0];data.netmask=Number(ipv4StrArray[1]);ipv4StrArray=getValue("RouteAdd_Gateway4").split('/');if(ipv4StrArray.length>1){warninfo_show(_("The gateway address error."));$(".warn .close").unbind("click").on("click",function(){$(".warn").hide();});return;}
data.gateway=ipv4StrArray[0];}else{var ipv6StrArray=getValue("RouteAdd_IpAndMask6").split('/');if(ipv6StrArray.length<2){warninfo_show(_("PrefixLength Expected."));$(".warn .close").unbind("click").on("click",function(){$(".warn").hide();});return;}
data.target=ipv6StrArray[0];data.netmask=Number(ipv6StrArray[1]);ipv6StrArray=getValue("RouteAdd_Gateway6").split('/');if(ipv6StrArray.length>1){warninfo_show(_("The gateway address error."));$(".warn .close").unbind("click").on("click",function(){$(".warn").hide();});return;}
data.gateway=ipv6StrArray[0];}
data.ipver=getValue("RouteAdd_IpVer");data.interface=getValue("RouteAdd_Interface");data.metric=Number(getValue("RouteAdd_Metric"));hide_mode();var param=new Array("rtweb.staticroute","add_static_route",data);var jsonstr={"id":1,"params":param};sk_auth_apply(jsonstr,function(result){var resultVal=result.result[1].result;if(resultVal=="REPEAT"){warninfo_show(_("The static route with the same destination address already exists."));}else if(resultVal=="DIPErr"){warninfo_show(_("DstIP or PrefixLength err."));}else if(resultVal!="0"){warninfo_show(_("The static route addtion failed."));}else{staticRouteLoad();}});}
function staticRouteAdd()
{var data={"type":"form","tittle":_("Add New Rule"),"panelContent":null,"submit":"staticRouteAddSubmit"};var param=new Array("gwweb.wancfg","getWanCfg",{});var param1=new Array("gwweb.vpn","get",{});var jsonstr=[{"id":1,"params":param},{"id":2,"params":param1}];sk_auth_post(jsonstr,function(result){var interfaces=new Array();var ipvers=new Array();var wanList=result[0].result[1].wan;var vpnList=result[1].result[1].vpncfg;ipvers.push({"value":"4","name":_("IPv4")})
ipvers.push({"value":"6","name":_("IPv6")})
interfaces.push({"value":"lan","name":_("LAN")});for(var i=0;i<wanList.length;i++){if(wanList[i].networktype!="bridge"){interfaces.push({"value":"wan_"+wanList[i].index,"name":wanList[i].GUIname});}}
for(var i=0;i<vpnList.length;i++){if(vpnList[i].enable==1){interfaces.push({"value":"vpn_"+vpnList[i].index,"name":vpnList[i].TunnelName});}}
data.panelContent=new Array();data.panelContent.push({"type":"select","id":"RouteAdd_IpVer","tittle":_("IP Version"),"value":"","option":ipvers,"onchange":"changeIpver"});data.panelContent.push({"type":"text","id":"RouteAdd_IpAndMask4","datatype":"ipv4","tittle":_("DstIP/PrefixLength"),"value":""});data.panelContent.push({"type":"text","id":"RouteAdd_Gateway4","datatype":"ipv4","tittle":_("Gateway"),"value":""});data.panelContent.push({"type":"text","id":"RouteAdd_IpAndMask6","datatype":"ipv6","tittle":_("DstIP/PrefixLength"),"value":""});data.panelContent.push({"type":"text","id":"RouteAdd_Gateway6","datatype":"ipv6","tittle":_("Gateway"),"value":""});data.panelContent.push({"type":"select","id":"RouteAdd_Interface","tittle":_("Interface"),"value":"","option":interfaces});data.panelContent.push({"type":"text","id":"RouteAdd_Metric","datatype":"Metric","tittle":_("Metric"),"value":""});panel_show(data);$("#RouteAdd_IpAndMask6").parent().hide();$("#RouteAdd_Gateway6").parent().hide();});}