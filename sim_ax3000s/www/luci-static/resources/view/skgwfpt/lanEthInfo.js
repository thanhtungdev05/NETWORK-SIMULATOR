
function lanEthInfo_parse_result(data)
{var lanmacparam=data[0].result[1];var lanipparam=data[1].result[1];var portinfo=data[2].result[1];var lanipv6param=data[3].result[1];var uplinkparam=data[4].result[1]["portinfo"];var wandataportinfo=data[5].result[1]["statistics"];var wanstatusportinfo=data[6].result[1];var uplink="";$("#lanEthInfo_lanmacshow").html(lanmacparam.macaddr);$("#lanEthInfo_ipv4show").html(lanipparam.ipaddr);$("#lanEthInfo_ipv6show").html(lanipv6param.lladdr6);for(var i=0;i<uplinkparam.length;i++){if(uplinkparam[i]==null)
continue;if(uplinkparam[i].iswan==1){uplink=uplinkparam[i].labelname;}}
var portarray=portinfo["rtweb.lancfg"];var row="";var wanduplex;var wanportstatus;if(wanstatusportinfo.duplex==0)
wanduplex=_("Unknown");else if(wanstatusportinfo.duplex==1)
wanduplex=_("Full");else
wanduplex=_("Half");if(wanstatusportinfo.status==0)
wanportstatus=_("Down");else
wanportstatus=_("Up");row+="<tr>";row+="<td>WAN</td>";row+="<td>"+wanportstatus+"</td>";row+="<td>"+wanduplex+"</td>";row+="<td>"+wanstatusportinfo.speed+"Mb/s</td>";row+="<td>"+wandataportinfo.rx_bytes+"</td>";row+="<td>"+wandataportinfo.rx_packets+"</td>";row+="<td>"+wandataportinfo.rx_errors+"</td>";row+="<td>"+wandataportinfo.rx_dropped+"</td>";row+="<td>"+wandataportinfo.tx_bytes+"</td>";row+="<td>"+wandataportinfo.tx_packets+"</td>";row+="<td>"+wandataportinfo.tx_errors+"</td>";row+="<td>"+wandataportinfo.tx_dropped+"</td>";row+="</tr>";for(var i=0;i<portarray.length;i++){var duplex;var portstatus;if(portarray[i].duplex==0)
duplex=_("Unknown");else if(portarray[i].duplex==1)
duplex=_("Full");else
duplex=_("Half");if(portarray[i].status==0)
portstatus=_("Down");else
portstatus=_("Up");row+="<tr>";row+="<td>"+portarray[i].devname+"</td>";row+="<td>"+portstatus+"</td>";row+="<td>"+duplex+"</td>";row+="<td>"+portarray[i].speed+"Mb/s</td>";row+="<td>"+portarray[i].rx_bytes+"</td>";row+="<td>"+portarray[i].rx_pkts+"</td>";row+="<td>"+portarray[i].rx_err+"</td>";row+="<td>"+portarray[i].rx_drops+"</td>";row+="<td>"+portarray[i].tx_bytes+"</td>";row+="<td>"+portarray[i].tx_pkts+"</td>";row+="<td>"+portarray[i].tx_err+"</td>";row+="<td>"+portarray[i].tx_drops+"</td>";row+="</tr>";}
$("#lanEthInfo_Statistics").html(row);}
function pageLoad()
{var lanmacparam=new Array("network.device","status",{"name":"br-lan"});var lanipparam=new Array("rtweb.lancfg","getLanCfg",{});var portinfo=new Array("rtweb.lancfg","getLanStats",{});var lanipv6param=new Array("rtweb.lanv6cfg","get",{});var uplinkparam=new Array("gwweb.portinfo","show_portinfo",{});var wandataparam=new Array("network.device","status",{"name":"ae_wan"});var wanstatusparam=new Array("gwweb.wancfg","phystatus",{});var jsonparam=[{"id":1,"params":lanmacparam},{"id":2,"params":lanipparam},{"id":3,"params":portinfo},{"id":4,"params":lanipv6param},{"id":5,"params":uplinkparam},{"id":6,"params":wandataparam},{"id":7,"params":wanstatusparam}];sk_auth_post(jsonparam,function(result){lanEthInfo_parse_result(result);});}