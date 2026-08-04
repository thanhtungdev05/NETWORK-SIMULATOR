
function pageLoad()
{QosGetPortList()
Qos_Edit_get_waninfo();Qos_Edit_get_type();setTimeout(QosShowInit(),300);}
var WanList=new Array();var CurClass=new Array();var CurApp=new Array();var CurMode=new Array();var CurTypeArray=new Array();var CurRule=new Array();var portlist={};var change_class_type=0;var ori_class_type="";function QosGetPortList()
{var ubusparam=new Array("gwweb.portinfo","get_lanlist",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){portlist=result.result[1];console.log(portlist);LanList=[];idx_cnt=0;for(var ix=0;ix<portlist.eth.length;++ix){LanList[idx_cnt++]=new stLan(portlist.eth[ix].ifname,portlist.eth[ix].labelname);}
if(portlist.wlan2g!=undefined){for(var ix=0;ix<portlist.wlan2g.length;++ix){LanList[idx_cnt++]=new stLan(portlist.wlan2g[ix].ifname,portlist.wlan2g[ix].labelname);}}
if(portlist.wlan5g!=undefined){for(var ix=0;ix<portlist.wlan5g.length;++ix){LanList[idx_cnt++]=new stLan(portlist.wlan5g[ix].ifname,portlist.wlan5g[ix].labelname);}}
if(portlist.wlan6g!=undefined){for(var ix=0;ix<portlist.wlan6g.length;++ix){LanList[idx_cnt++]=new stLan(portlist.wlan6g[ix].ifname,portlist.wlan6g[ix].labelname);}}
console.log("LanList.idx_cnt="+idx_cnt);});}
function Qos_Edit_get_waninfo()
{var ubusparam=new Array("gwweb.wancfg","status",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){console.log(result.result[1]);var WanInfo=result.result[1]["wan"];WanList=[];for(var i=0;i<WanInfo.length;++i){WanList.push(new WanIndexConstruction(WanInfo[i].layer2interface,WanInfo[i].GUIname));}});}
function isInteger(str){var pattern=/^[+-]?\d+$/;return pattern.test(str);}
function isIPv4(str){const ipv4Regex=/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;return ipv4Regex.test(str);}
function isIPv6(ip){const segments=ip.split(':');if(ip.includes('::')){if(ip.indexOf('::')!==ip.lastIndexOf('::')){return false;}}
if(ip.includes('::')){const parts=ip.split('::');if(parts.length>2)return false;const left=parts[0]?parts[0].split(':'):[];const right=parts[1]?parts[1].split(':'):[];if(left.length+right.length>7)return false;}else{if(segments.length!==8)return false;}
for(const segment of segments){if(segment==='')continue;if(!/^[0-9a-fA-F]{1,4}$/.test(segment))return false;}
return true;}
function checkIPVer(str){if(isIPv4(str)){return 4;}else if(isIPv6(str)){return 6;}else{return 0;}}
function Qos_Edit_get_type()
{var ubusparam11=new Array("gwweb.qos","qosclass_get",{});var ubusparam12=new Array("gwweb.qos","qosapp_get",{});var jsonparam1=[{"id":1,"params":ubusparam12},{"id":2,"params":ubusparam11}];sk_auth_post(jsonparam1,function(result){var AppType=result[0].result[1]["qos_app"];var QosType=result[1].result[1]["qos_class"];var nulltype=0;var i=0;var j=0;CurTypeArray=[];CurRule=[];CurClass=[];CurApp=[];for(i=0;i<QosType.length;++i){nulltype=0;CurClass.push(new QosClassConstruction(QosType[i].index,QosType[i].que_idx,QosType[i].dscpmark,QosType[i].ethprimark,QosType[i].index));CurRule.push(QosType[i]);if(QosType[i].srcmac!=""){CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"SMAC",QosType[i].srcmacmask,QosType[i].srcmac,QosType[i].protocol));nulltype=1;}
if(QosType[i].dstmac!=""){CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"DMAC",QosType[i].dstmacmask,QosType[i].dstmac,QosType[i].protocol));nulltype=1;}
if(QosType[i].ethpricheck!="-1"){CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"8021P",QosType[i].ethpricheck_max,QosType[i].ethpricheck,QosType[i].protocol));nulltype=1;}
if(QosType[i].srcip!=""){var sipend=(QosType[i].srcmask!="")?QosType[i].srcmask:QosType[i].srcip;CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"SIP",sipend,QosType[i].srcip,QosType[i].protocol));nulltype=1;}
if(QosType[i].dstip!=""){var dipend=(QosType[i].dstmask!="")?QosType[i].dstmask:QosType[i].dstip;CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"DIP",dipend,QosType[i].dstip,QosType[i].protocol));nulltype=1;}
if(QosType[i].srcport!="-1"){CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"SPORT",QosType[i].srcport_max,QosType[i].srcport,QosType[i].protocol));nulltype=1;}
if(QosType[i].dstport!="-1"){CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"DPORT",QosType[i].dstport_max,QosType[i].dstport,QosType[i].protocol));nulltype=1;}
if(QosType[i].dscpcheck!="-1"){CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"DSCP",QosType[i].dscpcheck_max,QosType[i].dscpcheck,QosType[i].protocol));nulltype=1;}
if(QosType[i].toscheck!="-1"){CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"TOS",QosType[i].toscheck_max,QosType[i].toscheck,QosType[i].protocol));nulltype=1;}
if(QosType[i].intf!=""){if(QosType[i].intf.includes("nas")){CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"WANInterface",QosType[i].intf,QosType[i].intf,QosType[i].protocol));}else{var intfrange=QosType[i].intf.split(',');CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"LANInterface",intfrange[intfrange.length-1],intfrange[0],QosType[i].protocol));}
nulltype=1;}
if(QosType[i].ethertype=="1"||QosType[i].ethertype=="2"){var ethertype;if(parseInt(QosType[i].ethertype)==1){ethertype="IPv4";}else{ethertype="IPv6";}
CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"EtherType",ethertype,ethertype,QosType[i].protocol));nulltype=1;}
if(nulltype==0)
{if(QosType[i].protocol=="ALL"){CurTypeArray.push(new QosTypeConstruction(QosType[i].index,"NullType","","",QosType[i].protocol));}}}
for(j=0;j<AppType.length;++j){if(AppType[j].trafficclass>0){for(i=0;i<QosType.length;++i){if(AppType[j].trafficclass==QosType[i].index){CurApp.push(new QosAppConstruction(AppType[j].index,AppType[j].name,QosType[i].que_idx,"Available"));}}}
else{CurApp.push(new QosAppConstruction(AppType[j].index,AppType[j].name,"","Unavailable"));}}
AppCnt=CurApp.length;setTimeout(writeAppTable(),300);Cls.style.display="none";AppEdit.style.display="none";ClsCnt=CurClass.length;console.log("CurClass.length="+CurClass.length);setTimeout(writeClsTable(),300);Cls.style.display="none";ClsEdit.style.display="none";if(CurClass.length>0){ClsTypeCnt=CurTypeArray.length;if(CurEditClsIndex>=0){setTimeout(writeTypeTable(CurClass[CurEditClsIndex].domain),300);}
Cls.style.display="none";ClsTypeEdit.style.display="none";}});}
function Qos_Edit_del_app_byindex(index)
{console.log("Qos_Edit_del_app  index="+index);var ubusparam11=new Array("gwweb.qos","qosapp_get",{});var ubusparam12=new Array("gwweb.qos","qosflow_get",{});var ubusparam13=new Array("gwweb.qos","qosclass_get",{});var jsonparam1=[{"id":1,"params":ubusparam11},{"id":2,"params":ubusparam12},{"id":3,"params":ubusparam13}];sk_auth_post(jsonparam1,function(result){var QosApp=result[0].result[1]["qos_app"];var QosFlow=result[1].result[1]["qos_flow"];var QosType=result[2].result[1]["qos_class"];var app_idx=index;var flow_idx=-1;var class_idx=-1;for(var i=0;i<QosType.length;++i)
{if(QosType[i].app_idx==app_idx)
{class_idx=QosType[i].index;break;}}
for(var i=0;i<QosFlow.length;++i)
{if(QosFlow[i].app_idx==app_idx)
{flow_idx=QosFlow[i].index;break;}}
var ubusparam21=new Array("gwweb.qos","qosclass_delete",{"idx":class_idx});var ubusparam22=new Array("gwweb.qos","qosflow_delete",{"idx":flow_idx});var ubusparam23=new Array("gwweb.qos","qosapp_delete",{"idx":app_idx});var jsonparam2=[{"id":1,"params":ubusparam21},{"id":2,"params":ubusparam22},{"id":3,"params":ubusparam23}];sk_auth_apply(jsonparam2,function(result){Qos_Edit_get_type();});});}
function Qos_Edit_set_app(appindex,appname,queue)
{console.log("Qos_Edit_set_app appindex="+appindex+",appname="+appname+",queue="+queue);var ubusparam21=new Array("gwweb.qos","qosapp_get",{});var ubusparam22=new Array("gwweb.qos","qosflow_get",{});var ubusparam23=new Array("gwweb.qos","qosclass_get",{});var jsonparam2=[{"id":1,"params":ubusparam21},{"id":2,"params":ubusparam22},{"id":3,"params":ubusparam23}];var jsonparam;sk_auth_post(jsonparam2,function(result){var QosApp=result[0].result[1]["qos_app"];var QosFlow=result[1].result[1]["qos_flow"];var QosClass=result[2].result[1]["qos_class"];var app_idx=appindex;var flow_idx=-1;var class_idx=-1;var queue_idx=-1;var trafficclass=-1;var flag=0;for(var i=0;i<QosClass.length;++i)
{if(QosClass[i].app_idx==app_idx)
{queue_idx=QosClass[i].que_idx;break;}}
for(var j=0;j<QosApp.length;++j)
{if(QosApp[j].index==app_idx)
{if(QosApp[j].name!=appname&&queue_idx==parseInt(queue))
flag=1;else if(QosApp[j].name==appname&&queue_idx!=parseInt(queue))
flag=2;else if(QosApp[j].name!=appname&&queue_idx!=parseInt(queue))
flag=3;class_idx=QosApp[j].trafficclass;break;}}
var ubusparam31=new Array("gwweb.qos","qosapp_set",{"index":app_idx,"name":appname});var ubusparam32=new Array("gwweb.qos","qosclass_set",{"index":class_idx,"que_idx":parseInt(queue)});var jsonparam31={"id":1,"params":ubusparam31};var jsonparam32={"id":1,"params":ubusparam32};var jsonparam33=[{"id":1,"params":ubusparam31},{"id":2,"params":ubusparam32}];var ubusparam33=new Array("gwweb.qos","qosflow_set",{});var ubusparam34=new Array("gwweb.qos","qosclass_set",{"que_idx":parseInt(queue)});var jsonparam34=[{"id":1,"params":ubusparam33},{"id":2,"params":ubusparam34}];var jsonparam3;if(class_idx>0)
{if(flag==0)
return;if(flag==1)
{jsonparam3=jsonparam31;}
else if(flag==2)
{jsonparam3=jsonparam32;}
else if(flag==3)
{jsonparam3=jsonparam33;}
sk_auth_apply(jsonparam3,function(result){Qos_Edit_get_type();});}
else
{jsonparam3=jsonparam34;sk_auth_apply(jsonparam3,function(result){flow_idx=result[0].result[1].idx;class_idx=result[1].result[1].idx;var ubusparam41=new Array("gwweb.qos","qosapp_set",{"index":app_idx,"trafficclass":class_idx});var ubusparam42=new Array("gwweb.qos","qosflow_set",{"index":flow_idx,"app_idx":app_idx,"tc_idx":class_idx});var ubusparam43=new Array("gwweb.qos","qosclass_set",{"index":class_idx,"app_idx":app_idx,"que_idx":parseInt(queue)});var jsonparam4=[{"id":1,"params":ubusparam41},{"id":2,"params":ubusparam42},{"id":3,"params":ubusparam43}];sk_auth_apply(jsonparam4,function(result){Qos_Edit_get_type();});});}});}
function Qos_Edit_add_app(appindex,appname,queue)
{console.log("Qos_Edit_add_app appindex="+appindex+",appname="+appname+",queue="+queue);var idx=appindex;var ubusparam01=new Array("gwweb.qos","qosapp_set",{"name":appname});var ubusparam02=new Array("gwweb.qos","qosflow_set",{});var ubusparam03=new Array("gwweb.qos","qosclass_set",{});var jsonparam0=[{"id":1,"params":ubusparam01},{"id":2,"params":ubusparam02},{"id":3,"params":ubusparam03}];var ubusparam21=new Array("gwweb.qos","qosapp_get",{});var ubusparam22=new Array("gwweb.qos","qosflow_get",{});var ubusparam23=new Array("gwweb.qos","qosclass_get",{});var jsonparam2=[{"id":1,"params":ubusparam21},{"id":2,"params":ubusparam22},{"id":3,"params":ubusparam23}];var jsonparam;if(appindex==0)
{jsonparam=jsonparam0;console.log("Qos_Edit_set_app appindex=0");}
else
{console.log("Qos_Edit_set_app appindex！=0");}
sk_auth_apply(jsonparam,function(result){console.log(result);console.log(result[0].result[1].result);console.log(result[0].result[1].idx);console.log("Qos_Edit_set_app jsonparam");var app_idx=result[0].result[1].idx;var flow_idx=result[1].result[1].idx;var class_idx=result[2].result[1].idx;sk_auth_post(jsonparam2,function(result){console.log(result[0].result[1]);console.log(result[1].result[1]);console.log(result[2].result[1]);var ubusparam31=new Array("gwweb.qos","qosapp_set",{"index":app_idx,"trafficclass":class_idx});var ubusparam32=new Array("gwweb.qos","qosflow_set",{"index":flow_idx,"app_idx":app_idx,"tc_idx":class_idx});var ubusparam33=new Array("gwweb.qos","qosclass_set",{"index":class_idx,"app_idx":app_idx,"que_idx":parseInt(queue)});var jsonparam3=[{"id":1,"params":ubusparam31},{"id":2,"params":ubusparam32},{"id":3,"params":ubusparam33}];sk_auth_apply(jsonparam3,function(result){Qos_Edit_get_type();});});});}
function Qos_Edit_set_class(queue,dscpmark,priority)
{if(AddFlag==false){var index=CurClass[CurEditClsIndex].domain;}else{var index=0;}
console.log("Qos_Edit_set_class index = "+index);var ubusparam=new Array("gwweb.qos","qosclass_set",{"index":index,"que_idx":parseInt(queue),"dscpmark":parseInt(dscpmark),"ethprimark":parseInt(priority)});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){console.log(result.result[1]);Qos_Edit_get_type();});}
function Qos_Edit_del_class(index)
{console.log("Qos_Edit_del_class index = "+index);var ubusparam11=new Array("gwweb.qos","qosapp_get",{});var ubusparam12=new Array("gwweb.qos","qosflow_get",{});var ubusparam13=new Array("gwweb.qos","qosclass_get",{});var jsonparam1=[{"id":1,"params":ubusparam11},{"id":2,"params":ubusparam12},{"id":3,"params":ubusparam13}];sk_auth_post(jsonparam1,function(result){var QosApp=result[0].result[1]["qos_app"];var QosFlow=result[1].result[1]["qos_flow"];var QosType=result[2].result[1]["qos_class"];var app_idx=-1;var flow_idx=-1;var class_idx=index;var i=0;for(i=0;i<QosType.length;++i)
{if(QosType[i].index==index)
{app_idx=QosType[i].app_idx;break;}}
for(i=0;i<QosFlow.length;++i)
{if(QosFlow[i].tc_idx==index)
{flow_idx=QosFlow[i].index;break;}}
var ubusparam21=new Array("gwweb.qos","qosclass_delete",{"idx":index});var ubusparam22=new Array("gwweb.qos","qosflow_delete",{"idx":flow_idx});var ubusparam23=new Array("gwweb.qos","qosapp_set",{"index":app_idx,"trafficclass":-1});var jsonparam2=[{"id":1,"params":ubusparam21},{"id":2,"params":ubusparam22},{"id":3,"params":ubusparam23}];sk_auth_apply(jsonparam2,function(result){Qos_Edit_get_type();});});}
function Qos_Get_CurRuleIndex(policyindex)
{var ruleindex=-1;var rulesize=CurRule.length;for(var i=0;i<rulesize;++i){if(CurRule[i].index==policyindex){ruleindex=i;}}
return ruleindex;}
function Qos_Edit_set_type_all(index)
{var ruleindex=Qos_Get_CurRuleIndex(index);if(ruleindex==-1){console.log("type index error: "+index);return;}
var kvpara={"index":parseInt(index),"enable":1,"intf":CurRule[ruleindex].intf,"dstip":CurRule[ruleindex].dstip,"dstmask":CurRule[ruleindex].dstmask,"srcip":CurRule[ruleindex].srcip,"srcmask":CurRule[ruleindex].srcmask,"protocol":CurRule[ruleindex].protocol,"dstport":CurRule[ruleindex].dstport,"dstport_max":CurRule[ruleindex].dstport_max,"srcport":CurRule[ruleindex].srcport,"srcport_max":CurRule[ruleindex].srcport_max,"srcmac":CurRule[ruleindex].srcmac,"srcmacmask":CurRule[ruleindex].srcmacmask,"dstmac":CurRule[ruleindex].dstmac,"dstmacmask":CurRule[ruleindex].dstmacmask,"ethertype":CurRule[ruleindex].ethertype,"dscpcheck":CurRule[ruleindex].dscpcheck,"dscpcheck_max":CurRule[ruleindex].dscpcheck_max,"ethpricheck":CurRule[ruleindex].ethpricheck,"ethpricheck_max":CurRule[ruleindex].ethpricheck_max,"toscheck":CurRule[ruleindex].toscheck,"toscheck_max":CurRule[ruleindex].toscheck_max};var ubusparam=new Array("gwweb.qos","qosclass_set",kvpara);var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){console.log(result.result[1]);Qos_Edit_get_type();});}
function Qos_Edit_set_type(index,type,max,min,protocollist)
{if(change_class_type==1){if(ori_class_type=="SMAC"){console.log("ori_class_type = %s",ori_class_type);var ori_kvpara={"index":parseInt(index),"srcmacmask":"","srcmac":"","protocol":"","enable":0};}else if(ori_class_type=="DMAC"){var ori_kvpara={"index":parseInt(index),"dstmacmask":"","dstmac":"","protocol":"","enable":0};}else if(ori_class_type=="8021P"){var ori_kvpara={"index":parseInt(index),"ethpricheck_max":-1,"ethpricheck":-1,"protocol":"","enable":0};}else if(ori_class_type=="SIP"){var ori_kvpara={"index":parseInt(index),"srcmask":"","srcip":"","protocol":"","enable":0};}else if(ori_class_type=="DIP"){var ori_kvpara={"index":parseInt(index),"dstmask":"","dstip":"","protocol":"","enable":0};}else if(ori_class_type=="SPORT"){var ori_kvpara={"index":parseInt(index),"srcport_max":-1,"srcport":-1,"protocol":"","enable":0};}else if(ori_class_type=="DPORT"){var ori_kvpara={"index":parseInt(index),"dstport_max":-1,"dstport":-1,"protocol":"","enable":0};}else if(ori_class_type=="DSCP"){var ori_kvpara={"index":parseInt(index),"dscpcheck_max":-1,"dscpcheck":-1,"protocol":"","enable":0};}else if(ori_class_type=="TOS"){var ori_kvpara={"index":parseInt(index),"toscheck_max":"","toscheck":"","protocol":"","enable":0};}else if(ori_class_type=="WANInterface"){var ori_kvpara={"index":parseInt(index),"intf":"","protocol":"","enable":0};}else if(ori_class_type=="LANInterface"){var ori_kvpara={"index":parseInt(index),"intf":"","protocol":"","enable":0};}else if(ori_class_type=="EtherType"){var ori_kvpara={"index":parseInt(index),"ethertype":-1,"protocol":"","enable":0};}}
if(type=="SMAC"){var kvpara={"index":parseInt(index),"srcmacmask":max,"srcmac":min,"protocol":protocollist,"enable":1};}else if(type=="DMAC"){var kvpara={"index":parseInt(index),"dstmacmask":max,"dstmac":min,"protocol":protocollist,"enable":1};}else if(type=="8021P"){var kvpara={"index":parseInt(index),"ethpricheck_max":parseInt(max),"ethpricheck":parseInt(min),"protocol":protocollist,"enable":1};}else if(type=="SIP"){var kvpara={"index":parseInt(index),"srcmask":max,"srcip":min,"protocol":protocollist,"enable":1};}else if(type=="DIP"){var kvpara={"index":parseInt(index),"dstmask":max,"dstip":min,"protocol":protocollist,"enable":1};}else if(type=="SPORT"){var kvpara={"index":parseInt(index),"srcport_max":parseInt(max),"srcport":parseInt(min),"protocol":protocollist,"enable":1};}else if(type=="DPORT"){var kvpara={"index":parseInt(index),"dstport_max":parseInt(max),"dstport":parseInt(min),"protocol":protocollist,"enable":1};}else if(type=="DSCP"){var kvpara={"index":parseInt(index),"dscpcheck_max":parseInt(max),"dscpcheck":parseInt(min),"protocol":protocollist,"enable":1};}else if(type=="TOS"){var kvpara={"index":parseInt(index),"toscheck_max":parseInt(max),"toscheck":parseInt(min),"protocol":protocollist,"enable":1};}else if(type=="WANInterface"){var kvpara={"index":parseInt(index),"intf":min,"protocol":protocollist,"enable":1};}else if(type=="LANInterface"){var intf=min;if(min!=max){var start=0;for(var idx=0;idx<LanList.length;++idx){if(LanList[idx].Domain==min){start=1;continue;}
if(start>0){intf=intf+","+LanList[idx].Domain;}
if(LanList[idx].Domain==max){break;}}
console.log("set.intf="+intf);}
var kvpara={"index":parseInt(index),"intf":intf,"protocol":protocollist,"enable":1};}else if(type=="EtherType"){var ethertype=0;if(min=="IPv4"){ethertype=1;}else if(min=="IPv6"){ethertype=2;}
var kvpara={"index":parseInt(index),"ethertype":ethertype,"protocol":protocollist,"enable":1};}else{warninfo_show("No class type be specified");return;}
if(change_class_type==1){var ori_ubusparam=new Array("gwweb.qos","qosclass_set",ori_kvpara);var ori_jsonparam={"id":1,"params":ori_ubusparam};sk_auth_post(ori_jsonparam,function(result){});change_class_type=0;}
var ubusparam=new Array("gwweb.qos","qosclass_set",kvpara);var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){if(result.result[1].result==3){warninfo_show("class match item has exist");}
Qos_Edit_get_type();});}
function Qos_Edit_del_type(index)
{var ubusparam=new Array("gwweb.qos","delQosSection",{"type":2,"mask":(1<<(index-1))});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){console.log(result.result[1]);Qos_Edit_get_type();});}
function QosShowInit()
{CurQoSShow();}
function CurQoSShow()
{AppTable.style.display="block";ClsTable.style.display="block";AddBtn.style.display="block";Cls.style.display="none";AppCnt=CurApp.length;ClsCnt=CurClass.length;QueueCnt=CurQueue.length;ClsTypeCnt=CurTypeArray.length;}
function WanIndexConstruction(domain,WanName,ServiceName,EnNAT)
{this.domain=domain;this.WanName=WanName;}
function QosRuleConstruction(domain,Rule)
{this.domain=domain;this.idx=Rule.idx;this.priority=Rule.priority;this.dscp_chk=Rule.dscp_chk;this.dscp=Rule.dscp;this.tos_type=Rule.tos_type;this.vlan8021p=Rule.vlan8021p;this.ethertype=Rule.ethertype;this.srcport=Rule.srcport;this.dstport=Rule.dstport;this.name=Rule.name;this.protocol=Rule.protocol;this.srcmac=Rule.srcmac;this.dstmac=Rule.dstmac;this.srcipstart=Rule.srcipstart;this.srcipend=Rule.srcipend;this.dstipstart=Rule.dstipstart;this.dstipend=Rule.dstipend;this.wanintf=Rule.wanintf;this.lanintf=Rule.lanintf;}
function QosTypeConstruction(domain,Type,Max,Min,ProtocolList)
{this.domain=domain;this.Type=Type;this.Max=Max;this.Min=Min;this.ProtocolList=ProtocolList;}
function QosAppConstruction(domain,AppName,ClassQueue,AppStatus)
{this.domain=domain;this.AppName=AppName;this.ClassQueue=ClassQueue;this.AppStatus=AppStatus;}
function QosClassConstruction(domain,ClassQueue,DSCPMarkValue,Value8021P,idx)
{this.domain=domain;this.ClassQueue=ClassQueue;this.DSCPMarkValue=DSCPMarkValue;this.Value8021P=Value8021P;}
function QosModeConstruction(domain,Mode,Enable,Bandwidth,Plan,EnableForceWeight,EnableDSCPMark,Enable8021P)
{this.domain=domain;this.Mode=Mode;this.Enable=Enable;this.Bandwidth=Bandwidth;this.Plan=Plan;this.EnableForceWeight=EnableForceWeight;this.EnableDSCPMark=EnableDSCPMark;this.Enable8021P=Enable8021P;}
function QosQueueConstruction(domain,Enable,Priority,Weight)
{this.domain=domain;this.Enable=Enable;this.Priority=Priority;this.Weight=Weight;}
var CurQueue=new Array(new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.1","0","1","0"),new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.2","0","2","0"),new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.3","0","3","0"),new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.4","0","4","0"),new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.5","0","5","0"),new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.6","0","6","0"),null);function Qos(Mode,App,Class,Queue)
{this.Mode=Mode;this.App=App;this.Class=Class;this.Queue=Queue;}
var CurQoS=new Qos(CurMode,CurApp,CurClass,CurQueue);var AppCnt=0;var ClsCnt=0;var ClsTypeCnt=0;var QueueCnt=0;var AddFlag=false;function btnReturnQoS()
{location.replace("../qos");return;}
function writeAppTable()
{var k,loc,QIndex=0;if(CurApp==null)
{return;}
loc='<TABLE class="tblList" border=1>';loc+='<THEAD><TR align="middle">';loc+='<TH class="table_title" align="center">'+_("App_Name")+'</TH>';loc+='<TH class="table_title" align="center">'+_("Queue")+'</TH>';loc+='<TH class="table_title" align="center">'+_("Edit")+'</TH>';loc+='<TH class="table_title"><INPUT id=DelApp onclick=btnDelApp() type=button value='+_("Delete_App")+' name=DelApp class="BtnDel" ></TH>'
loc+='<TH class="table_title"><INPUT id=AddApp onclick=btnAddApp() type=button value='+_("Add_App")+' name=AddApp class="BtnDel" ></TH>'
loc+='</TR></THEAD>';for(k=0;k<AppCnt;k++)
{loc+='<TR align="middle">';if(CurApp[k].AppName=="")
{loc+='<TD align="center">&nbsp;</TD>';}
else
{loc+='<TD align="center">'+CurApp[k].AppName+'</TD>';}
loc+='<TD align="center">'+CurApp[k].ClassQueue+'</TD>';loc+='<TD align="center"><input name="EditApp" type="button" id="App_'+k+'" onClick="btnEditApp(this.id)" value="Edit"/></td>\n';loc+='<TD align="center"><input type="checkbox" id="rmapp" name="rmapp" value="false"></td>\n';if(k==0)
{loc+='<TD align="center" rowspan='+AppCnt+'>&nbsp;</TD>';}
loc+='</TR>';}
loc+='</TABLE >';getObj('AppTable').innerHTML=loc;}
function writeClsTable()
{var loc,k;loc='<TABLE class="tblList" border=1>';loc+='<THEAD><TR align="middle">';loc+='<TH class="table_title" align="center" >'+_("Class_Queue")+'</TH>';loc+='<TH class="table_title" align="center" style="width:80px;">'+_("Value_DSCPTC")+'</TH>';loc+='<TH class="table_title" align="center" style="width:80px;">'+_("Value_8021P")+'</TH>';loc+='<TH class="table_title" align="center" style="width:100px;">'+_("Add_Type")+'</TH>';loc+='<TH class="table_title" align="center" style="width:100px;">'+_("Edit")+'</TH>';loc+='<TH class="table_title" style="width:100px;"><INPUT id=DelCls onclick=btnDelCls() type=button value='+_("Delete_Class")+' name=DelCls></TH>'
loc+='<TH class="table_title" style="width:100px;"><INPUT id=AddCls onclick=btnAddCls() type=button value='+_("Add_Class")+' name=AddCls></TH>'
loc+='</TR></THEAD>';if(CurClass==null)
{return;}
for(k=0;k<ClsCnt;k++)
{loc+='<TR align="middle">';var tmpDSCPMarkValue,tmpValue8021P;if(CurClass[k].DSCPMarkValue=="N/A")
{tmpDSCPMarkValue="0";}
else
{tmpDSCPMarkValue=CurClass[k].DSCPMarkValue;}
if(CurClass[k].Value8021P=="N/A")
{tmpValue8021P="0";}
else
{tmpValue8021P=CurClass[k].Value8021P;}
loc+='<TD align="center">'+CurClass[k].ClassQueue+'</TD>';loc+='<TD align="center">'+tmpDSCPMarkValue+'</TD>';loc+='<TD align="center">'+tmpValue8021P+'</TD>';loc+='<TD align="center"><input name="addtype" type="button" id="Cls_'+k
+'" onClick="btnAddClsType(this.id)" value="Add" class="BtnAdd"/></td>\n';loc+='<TD align="center"><input name="EditCls" type="button" id="Cls_'+k
+'" onClick="btnEditCls(this.id)" value="Edit"/></td>\n';loc+='<TD align="center"><input type="checkbox" name="rmcls" id="rmcls" value="false"></td>\n';if(k==0)
{loc+='<TD align="center" rowspan='+ClsCnt+'>&nbsp;</TD>';}
loc+='</TR>';}
loc+='</TABLE>';getObj('ClsTable').innerHTML=loc;}
function btnDelApp()
{QoSAppDelSubmit();}
function QoSAppDelSubmit()
{var Rmapp;var Rmcls;var k=0;var DelClsCount=0;var Domainstr;var indexstr;var indexmask;Rmapp=document.getElementsByName('rmapp');if(Rmapp!=null)
{if(Rmapp.length>0)
{for(k=0;k<Rmapp.length;k++)
{if(Rmapp[k].checked==true)
{Qos_Edit_del_app_byindex(CurApp[k].domain);DelClsCount++;}}}
else
{if(Rmapp.checked==true)
{Qos_Edit_del_app_byindex(CurApp[0].domain);DelClsCount++;}}}
if(DelClsCount==0)
{warninfo_show(_("Warn_Not_Select_Any_App"));return;}}
var CurEditAppIndex=0;var CurEditClsIndex=-1;var CurEditTypeIndex=0;function btnAddApp()
{AddFlag=true;getObj("AppName").value="";ClassQueue[0].value=1;Cls.style.display="block";AppEdit.style.display="block";ClsTypeEdit.style.display="none";ClsEdit.style.display="none";ClsTypeTable.style.display="none";}
function QoSChangeAppName()
{}
function QoSChangeProtocolList()
{var ori_ipver_tmp=0;var ori_ethtype_tmp=-1;var cur_ipver_tmp=0;var cur_ipver_tmp_min=0;var cur_ipver_tmp_max=0;var cur_ethtype_tmp=-1;var cur_set_type=getValue("Type");var selectElement=document.getElementById("ProtocolList");var optionToHide_icmpv4=selectElement.querySelector("option[value='ICMP']");var optionToHide_icmpv6=selectElement.querySelector("option[value='ICMPv6']");if(optionToHide_icmpv4){optionToHide_icmpv4.style.display="none";}
if(optionToHide_icmpv6){optionToHide_icmpv6.style.display="none";}
if(CurRule[CurEditClsIndex].srcip!=''){ori_ipver_tmp=checkIPVer(CurRule[CurEditClsIndex].srcip);}
if(CurRule[CurEditClsIndex].dstip!=''){ori_ipver_tmp=checkIPVer(CurRule[CurEditClsIndex].dstip);}
if(CurRule[CurEditClsIndex].ethertype!=-1){ori_ethtype_tmp=CurRule[CurEditClsIndex].ethertype;}
if((cur_set_type=="SIP")||(cur_set_type=="DIP")){if((getValue("Min")!="")&&(getValue("Max")!="")){cur_ipver_tmp_min=checkIPVer(getValue("Min"));cur_ipver_tmp_max=checkIPVer(getValue("Max"));if(cur_ipver_tmp_min==cur_ipver_tmp_max){cur_ipver_tmp=cur_ipver_tmp_min;}else{warninfo_show(_("IP min and max has different version"));return;}}
if(ori_ethtype_tmp==1){ori_ipver_tmp=4;}else if(ori_ethtype_tmp==2){ori_ipver_tmp=6;}
if(((ori_ipver_tmp==4)&&(cur_ipver_tmp==6))||((ori_ipver_tmp==6)&&(cur_ipver_tmp==4))||((ori_ethtype_tmp==1)&&(cur_ipver_tmp==6))||((ori_ethtype_tmp==2)&&(cur_ipver_tmp==4))){warninfo_show(_("This classification rule has specified ethtertype by ip or ethtertype"));return;}}
if(cur_set_type=="EtherType"){cur_ethtype_tmp=getValue("EtherTypeMin");if(((ori_ipver_tmp==4)&&(cur_ethtype_tmp==2))||((ori_ipver_tmp==6)&&(cur_ethtype_tmp==1))){warninfo_show(_("This classification rule has specified ethtertype by ip"));return;}
if(cur_ethtype_tmp==1){ori_ipver_tmp=4;}else if(cur_ethtype_tmp==2){ori_ipver_tmp=6;}}
if((ori_ipver_tmp==4)||((ori_ipver_tmp==0)&&(cur_ipver_tmp==4))){if(optionToHide_icmpv4){optionToHide_icmpv4.style.display="block";}}else if((ori_ipver_tmp==6)||((ori_ipver_tmp==0)&&(cur_ipver_tmp==6))){if(optionToHide_icmpv6){optionToHide_icmpv6.style.display="block";}}else{if(optionToHide_icmpv4){optionToHide_icmpv4.style.display="block";}
if(optionToHide_icmpv6){optionToHide_icmpv6.style.display="block";}}}
function QoSAppSubmit()
{var url;if(false==AppCheck())
{return;}
QoS_Flag="0";App_Flag="Yes";AppQueueFlag=ClassQueue[0].value;if(AddFlag==true){var appindex=0;Qos_Edit_add_app(appindex,getObj("AppName").value,getObj("ClassQueue").value);}else{var appindex=CurApp[CurEditAppIndex].domain;Qos_Edit_set_app(appindex,getObj("AppName").value,getObj("ClassQueue").value);}}
function AppCheck()
{var classQ;var Classifytype;var max;var min;var dscp;var v8021p;var sip;var dip;if(AddFlag==true)
{if(AppCnt>=5)
{warninfo_show(_("Warn_Too_Much_App"));Cls.style.display="none";return false;}}
if(getValue('AppName')=='')
{warninfo_show(_("Warn_Appname_Cant_Be_Null"));return false;}
if(AddFlag==true)
{for(var i=0;i<AppCnt;i++)
{if(getValue('AppName')==CurApp[i].AppName)
{warninfo_show(_("Warn_App_Exist"));return false;}}}
else
{for(var i=0;i<AppCnt;i++)
{if(i!=CurEditAppIndex)
{if(getValue('AppName')==CurApp[i].AppName)
{warninfo_show(_("Warn_AppClass_Conflict"));return false;}}
else if((ClassQueue[0].value==CurApp[CurEditAppIndex].ClassQueue)&&(getValue('AppName')==CurApp[CurEditAppIndex].AppName))
{warninfo_show(_("Warn_No_Edit"));Cls.style.display="none";return false;}}}
return true;}
function btnEditApp(index)
{CurEditAppIndex=index.substr(index.indexOf('_')+1);AddFlag=false;getObj("AppName").value=CurApp[CurEditAppIndex].AppName;ClassQueue[0].value=CurApp[CurEditAppIndex].ClassQueue;Cls.style.display="block";AppEdit.style.display="block";ClsTypeEdit.style.display="none";ClsEdit.style.display="none";ClsTypeTable.style.display="none";curAppIdx=CurApp[CurEditAppIndex].domain;}
function btnAddCls()
{AddFlag=true;ClassQueue[1].value=1;getObj("DSCPMarkValue").value=0;getObj("v8021pValue").value=0;Cls.style.display="block";AppEdit.style.display="none";ClsTypeEdit.style.display="none";ClsEdit.style.display="block";ClsTypeTable.style.display="none";}
function QoSClsSubmit()
{if(false==ClsCheck())
{return;}
if(CurClass.length>=10){warninfo_show(_("Warn_Too_Much_Class"));return;}
QoS_Flag="2";App_Flag="Yes";ClsQueueValueFlag=ClassQueue[1].value;Qos_Edit_set_class(ClassQueue[1].value,getObj("DSCPMarkValue").value,getObj("v8021pValue").value);}
function is_integer(val)
{if(/^(\+|-)?\d+$/.test(val))
{return true;}
else
{return false;}}
function ClsCheck()
{var classQ;var Classifytype;var max;var min;var dscp;var v8021p;var sip;var dip;dscp=getValue('DSCPMarkValue');v8021p=getValue('v8021pValue');console.log("dscp="+dscp+" v8021p="+v8021p);if(is_integer(dscp)==false||dscp<0||dscp>63)
{warninfo_show(_("Warn_DscpTc_Range"));return false;}
if(is_integer(v8021p)==false||v8021p<0||v8021p>7)
{warninfo_show(_("Warn_8021P_Range"));return false;}
return true;}
function btnDelCls()
{QoSClsDelSubmit();}
function QoSClsDelSubmit()
{var Rmapp;var Rmcls;var k=0;var DelClsCount=0;var Domainstr=0;var indexstr="";var indexmask;Rmcls=document.getElementsByName('rmcls');if(Rmcls!=null)
{if(Rmcls.length>0)
{for(k=0;k<Rmcls.length;k++)
{if(Rmcls[k].checked==true)
{DelClsCount++;Qos_Edit_del_class(CurClass[k].domain);}}}
else
{if(Rmcls.checked==true)
{Qos_Edit_del_class(CurClass[0].domain);DelClsCount++;}}}
if(DelClsCount==0)
{warninfo_show(_("Warn_Not_Select_Any_Class"));return;}
curTypeIdx=Domainstr;QoS_Flag="3";App_Flag="No";}
var TypeModifyID=-1;function btnAddClsType(index)
{var protocollist_defval="TCP";CurEditClsIndex=index.substr(index.indexOf('_')+1);AddFlag=true;TypeModifyID.value="-1";getObj("Max").value=0;getObj("Min").value=0;Cls.style.display="block";AppEdit.style.display="none";ClsEdit.style.display="none";if(CurRule[CurEditClsIndex].protocol!=""){protocollist_defval=CurRule[CurEditClsIndex].protocol;}
getObj("ProtocolList").value=protocollist_defval;ClsTypeEdit.style.display="block";ClsTypeTable.style.display="block";writeTypeTable(CurClass[CurEditClsIndex].domain);lan.style.display="none";wan.style.display="none";TypeTos.style.display="none";ethertype.style.display="none";TypeCommon.style.display="block";}
function GetLanName(Domain)
{for(i=0;i<LanList.length;i++)
{if(Domain==LanList[i].Domain)
{this.Name=LanList[i].Name;return this;}}}
function writeTypeTable(domain)
{var loc,k;var TmpStr=0;var Typedomain;var val;loc='<TABLE class="tblList" border=1>';loc+='<THEAD><TR align="middle">';loc+='<TH class="table_title" align="center">'+_("Class_Type")+'</TH>';loc+='<TH class="table_title" align="center">'+_("MIN")+'</TH>';loc+='<TH class="table_title" align="center">'+_("MAX")+'</TH>';loc+='<TH class="table_title" align="center">'+_("Protocol")+'</TH>';loc+='<TH class="table_title" align="center">'+_("Edit")+'</TH>';loc+='<TH class="table_title"><INPUT id=DelClsType onclick=btnDelClsType() type=button value='+_("Delete_Type")+' name=DelClsType></TH>'
loc+='</TR></THEAD>';if(CurQoS.Class==null)
{return;}
for(k=0;k<ClsTypeCnt;k++)
{if(CurTypeArray[k].domain!=domain)continue;if(CurTypeArray[k].Type=="N/A")continue;loc+='<TR align="middle">';if(CurTypeArray[k].Type=="DSCP")
{loc+='<TD align="center">'+'DSCP/TC'+'</TD>';}
else
{loc+='<TD align="center">'+CurTypeArray[k].Type+'</TD>';}
if(CurTypeArray[k].Type=="WANInterface")
{for(i=0;i<WanList.length;i++)
{if(WanList[i].domain==CurTypeArray[k].Min)
{loc+='<TD align="center">'+WanList[i].WanName+'</TD>';loc+='<TD align="center">'+WanList[i].WanName+'</TD>';break;}}}
else if(CurTypeArray[k].Type=="LANInterface")
{var LanMax=new GetLanName(CurTypeArray[k].Min);var LanMin=new GetLanName(CurTypeArray[k].Min);loc+='<TD align="center">'+LanMin.Name+'</TD>';loc+='<TD align="center">'+LanMax.Name+'</TD>';}
else
{loc+='<TD align="center">'+CurTypeArray[k].Min+'</TD>';loc+='<TD align="center">'+CurTypeArray[k].Max+'</TD>';}
val=k%10;loc+='<TD align="center">'+CurTypeArray[k].ProtocolList.toUpperCase()+'</TD>';loc+='<TD align="center"><input name="EditCls" type="button" id="Type_'+k
+'" onClick="btnEditClsType(this.id)" value="Edit"/></td>\n';loc+='<TD align="center"><input type="checkbox" name="rmtype" id="rmtype" value="false"><input type="hidden" name="rmvalue" id="rmvalue" value="'+val+'"></td>\n';loc+='</TR>';}
loc+='</TABLE>';getObj('ClsTypeTable').innerHTML=loc;}
function etherType(Domain,Name)
{this.Domain=Domain;this.Name=Name;}
var EtherTypeList=new Array();EtherTypeList[0]=new etherType("IPv4","IPv4");EtherTypeList[1]=new etherType("IPv6","IPv6");function WriteEtherType()
{var loc,k;loc='<table width="100%" border="0">';loc+='<tr><td width="30%">'+_("Ethertype_Is")+'</td>';loc+='<td colspan="6">';loc+='<select size="1" id="EtherTypeMin" name="EtherTypeMin" style="width:160px;height:25px">';if(EtherTypeList!=null)
{if(EtherTypeList.length>0)
{for(i=0;i<EtherTypeList.length;i++)
{if(i==0)
loc+='<option value="'+EtherTypeList[i].Domain+'" selected>'+EtherTypeList[i].Name+'</option>';else
loc+='<option value="'+EtherTypeList[i].Domain+'" >'+EtherTypeList[i].Name+'</option>';}}}
loc+='</select></td>';loc+='</tr>';loc+='</table>';getObj('ethertype').innerHTML=loc;}
function stLan(Domain,Name)
{this.Domain=''+Domain;this.Name=Name;}
var LanList=new Array();var idx_cnt=0,itf_port=1;LanList[idx_cnt++]=new stLan(itf_port++,"LAN1");LanList[idx_cnt++]=new stLan(itf_port++,"LAN2");LanList[idx_cnt++]=new stLan(itf_port++,"LAN3");LanList[idx_cnt++]=new stLan(itf_port++,"LAN4");itf_port=9
LanList[idx_cnt++]=new stLan(itf_port++,"SSID1");LanList[idx_cnt++]=new stLan(itf_port++,"SSID2");LanList[idx_cnt++]=new stLan(itf_port++,"SSID3");LanList[idx_cnt++]=new stLan(itf_port++,"SSID4");itf_port=17
LanList[idx_cnt++]=new stLan(itf_port++,"SSID5");LanList[idx_cnt++]=new stLan(itf_port++,"SSID6");LanList[idx_cnt++]=new stLan(itf_port++,"SSID7");LanList[idx_cnt++]=new stLan(itf_port++,"SSID8");function WriteLanInterFace()
{var loc,k;loc='<table width="100%" border="0">';loc+='<tr><td width="30%">'+_("Interface_Is")+'</td>';loc+='<td colspan="6">';loc+='<select size="1" id="TypeLanInterFaceMin" name="TypeLanInterFaceMin" style="width:160px;height:25px">';for(i=0;i<LanList.length;i++)
{loc+='<option value="'+LanList[i].Domain+'" selected>'+LanList[i].Name+'</option>';}
loc+='</select></td>';loc+='</tr>';loc+='</table>';getObj('lan').innerHTML=loc;}
function WriteWanInterFace()
{var loc,k;loc='<table width="100%" border="0">';loc+='<tr><td width="30%">'+_("Interface_Is")+'</td>';loc+='<td colspan="6">';loc+='<select size="1" id="TypeWanInterFaceMin" name="TypeWanInterFaceMin" style="width:160px;height:25px">';if(WanList!=null)
{if(WanList.length>0)
{for(i=0;i<WanList.length;i++)
{if(i==0)
loc+='<option value="'+WanList[i].domain+'" selected>'+WanList[i].WanName+'</option>';else
loc+='<option value="'+WanList[i].domain+'" >'+WanList[i].WanName+'</option>';}}}
loc+='</select></td>';loc+='</tr>';loc+='</table>';getObj('wan').innerHTML=loc;}
function QoSChangeClassType()
{getObj("Max").value=0;getObj("Min").value=0;if(getValue('Type')=="WANInterface")
{TypeCommon.style.display="none";lan.style.display="none";WriteWanInterFace();wan.style.display="block";TypeTos.style.display="none";ethertype.style.display="none";}
else if(getValue('Type')=="LANInterface")
{TypeCommon.style.display="none";wan.style.display="none";WriteLanInterFace();lan.style.display="block";TypeTos.style.display="none";ethertype.style.display="none";}
else if(getValue('Type')=="TOS")
{TypeCommon.style.display="block";wan.style.display="none";lan.style.display="none";TypeTos.style.display="block";ethertype.style.display="none";}
else if(getValue('Type')=="EtherType")
{TypeCommon.style.display="none";wan.style.display="none";lan.style.display="none";WriteEtherType();ethertype.style.display="block";}
else
{if(getValue('Type')=="SPORT"||getValue('Type')=="DPORT")
{var mySelect=$("#ProtocolList option");mySelect.each(function(i,el){if($(el).text()=="ALL"||$(el).text()=="ICMP"||$(el).text()=="ICMPv6"){$(this).hide();}})}
else
{var mySelect=$("#ProtocolList option");mySelect.each(function(i,el){if($(el).text()=="ALL"||$(el).text()=="ICMP"||$(el).text()=="ICMPv6"){$(this).show();}})}
TypeCommon.style.display="block";lan.style.display="none";wan.style.display="none";TypeTos.style.display="none";ethertype.style.display="none";}}
function QoSTypeSubmit()
{var min="0",max="0";curTypeIdx=CurClass[CurEditClsIndex].domain;if(getValue('Type')=="WANInterface")
{getObj("Min").value=getObj("TypeWanInterFaceMin").value;getObj("Max").value=getObj("TypeWanInterFaceMin").value;}
else if(getValue('Type')=="LANInterface")
{getObj("Min").value=getObj("TypeLanInterFaceMin").value;getObj("Max").value=getObj("TypeLanInterFaceMin").value;}
else if(getValue('Type')=="EtherType")
{getObj("Min").value=getObj("EtherTypeMin").value;getObj("Max").value=getObj("EtherTypeMin").value;}
else if(getValue('Type')=="NullType")
{getObj("Min").value="0";getObj("Max").value="0";}
if(TypeModifyID=="-1")
{QoS_Flag="33";}
else
{QoS_Flag="44";}
if(false==ClsTypeCheck())
{return;}
Qos_Edit_set_type(curTypeIdx,getValue('Type'),getObj("Max").value,getObj("Min").value,getObj("ProtocolList").value);}
function getValidTypeNum(index,isadd)
{var cnt=0;for(var i=0;i<9;i++)
{if(CurTypeArray[index*9+i].Type!="N/A")
{cnt++;}}
if(isadd)
{cnt++;}
return cnt;}
function ProtocolCheck()
{var Typedomain;var k;var domain=CurClass[CurEditClsIndex].domain;var protocol=getObj("ProtocolList").value;var clsType=getValue('Type');if((('DPORT'==clsType)||('SPORT'==clsType))&&(('ICMP'==protocol)||('ICMPv6'==protocol)))
{warninfo_show(_("Warn_ICMP_Dont_Set_Port"));return false;}
for(k=0;k<ClsTypeCnt;k++)
{if(AddFlag==false)
{if(k==CurEditTypeIndex)
{continue;}}
Typedomain=CurTypeArray[k].domain;console.log("Typedomain="+Typedomain+" domain="+domain);if(Typedomain==domain)
{console.log("CurTypeArray[k].ProtocolList="+CurTypeArray[k].ProtocolList+" protocol="+protocol);if(CurTypeArray[k].ProtocolList!=protocol&&CurTypeArray[k].ProtocolList!="N/A")
{{warninfo_show(_("Warn_Protocol_Conflict_InClass"));return false;}}
return true;}}
return true;}
function TypeCommonCheck()
{var Typedomain;var k;var domain=CurClass[CurEditClsIndex].domain;var ClsType=getObj('Type').value;for(k=0;k<ClsTypeCnt;k++)
{if(AddFlag==false)
{if(k==CurEditTypeIndex)
{continue;}}
Typedomain=CurTypeArray[k].domain;if(Typedomain==domain)
{if(CurTypeArray[k].Type==ClsType)
{warninfo_show(_("Warn_ClassType_Exist_InClass"));return false;}
if((CurTypeArray[k].Type=='TOS'&&ClsType=='DSCP')||(CurTypeArray[k].Type=='DSCP'&&ClsType=='TOS'))
{warninfo_show(_("Warn_Cant_Combine_Tos_With_DscpTc"));return false;}}}
return true;}
function ClsTypeCheck()
{var classQ;var Classifytype;var max;var min;var dscp;var v8021p;var sip;var dip;var k;classQ=ClassQueue[1].value;Classifytype=getValue('Type');max=getValue('Max');min=getValue('Min');if(max==''||min=='')
{warninfo_show(_("Warn_Input_CantBe_Null"));return false;}
if(false==ProtocolCheck())
{return false;}
if(false==TypeCommonCheck())
{return false;}
if((Classifytype=='SMAC')||(Classifytype=='DMAC'))
{if(min!=''&&isValidMacAddress(min)==false)
{warninfo_show(_("Warn_The_Min_MacAddr_IsInvalid"));return false;}
else if(max!=''&&isValidMacAddress(max)==false)
{warninfo_show(_("Warn_The_Max_MacAddr_IsInvalid"));return false;}
else if(min!=max)
{warninfo_show(_("Warn_MacAddr_Must_Same"));return false;}}
else if(Classifytype=='8021P')
{if(max!=''&&(is_integer(max)==false||max<0||max>7))
{warninfo_show(_("Warn_8021P_Max_Range"));return false;}
else if(min!=''&&(is_integer(min)==false||min<0||min>7))
{warninfo_show(_("Warn_8021P_Min_Range"));return false;}
else if(parseInt(min)>parseInt(max))
{warninfo_show(_("Warn_8021P_Min_Bigger_Then_Max"));return false;}}
else if(Classifytype=='SIP')
{if(max!=''&&(isAbcIpAddress(max)==false)&&(isIpv6Address(max)==false))
{var TipStr=_("Warn_The_SrcIp_Max")+' "'+max+'" '+_("Warn_Invalid_IpAddr");warninfo_show(TipStr);return false;}
else if(min!=''&&(isAbcIpAddress(min)==false)&&(isIpv6Address(min)==false))
{var TipStr=_("Warn_The_SrcIp_Min")+' "'+min+'" '+_("Warn_Invalid_IpAddr");warninfo_show(TipStr);return false;}
else if((isAbcIpAddress(min)==true)&&(isAbcIpAddress(max)==true)&&(cmpIpAddress(max,min)==false))
{var TipStr=_("Warn_The_SrcIp_Min")+' "'+min+'" '+_("Warn_Bigger_Then_Max")+' '+max;warninfo_show(TipStr);return false;}
else if((isIpv6Address(min)==true)||(isIpv6Address(max)==true))
{var minfull=getFullIpv6Address(min);var maxfull=getFullIpv6Address(max);if(minfull==''||maxfull=='')
{warninfo_show(_("Warn_Min_Max_Must_Both_Ipv4_Or_Ipv6"));return false;}
if(isMultiCastIpv6Address(max)==true)
{var TipStr=_("Warn_The_SrcIp_Max")+' "'+max+'" '+_("Warn_Invalid_IpAddr");warninfo_show(TipStr);return false;}
if(isMultiCastIpv6Address(min)==true)
{var TipStr=_("Warn_The_SrcIp_Min")+' "'+min+'" '+_("Warn_Invalid_IpAddr");warninfo_show(TipStr);return false;}
if(minfull!=maxfull)
{if(cmpIpv6Address(maxfull,minfull)==false)
{var TipStr=_("Warn_The_SrcIp_Min")+' "'+min+'" '+_("Warn_Bigger_Then_Max")+' '+max;warninfo_show(TipStr);return false;}}}}
else if(Classifytype=='DIP')
{if(max!=''&&(isAbcIpAddress(max)==false)&&(isIpv6Address(max)==false))
{var TipStr=_("Warn_The_DstIp_Max")+' "'+max+'" '+_("Warn_Invalid_IpAddr");warninfo_show(TipStr);return false;}
else if(min!=''&&(isAbcIpAddress(min)==false)&&(isIpv6Address(min)==false))
{var TipStr=_("Warn_The_DstIp_Min")+' "'+min+'" '+_("Warn_Invalid_IpAddr");warninfo_show(TipStr);return false;}
else if((isAbcIpAddress(min)==true)&&(isAbcIpAddress(max)==true)&&(cmpIpAddress(max,min)==false))
{var TipStr=_("Warn_The_DstIp_Min")+' "'+min+'" '+_("Warn_Bigger_Then_Max")+' '+max;warninfo_show(TipStr);return false;}
else if((isIpv6Address(min)==true)||(isIpv6Address(max)==true))
{var minfull=getFullIpv6Address(min);var maxfull=getFullIpv6Address(max);if(minfull==''||maxfull=='')
{warninfo_show(_("Warn_Min_Max_Must_Both_Ipv4_Or_Ipv6"));return false;}
if(isMultiCastIpv6Address(max)==true)
{var TipStr=_("Warn_The_DstIp_Max")+' "'+max+'" '+_("Warn_Invalid_IpAddr");warninfo_show(TipStr);return false;}
if(isMultiCastIpv6Address(min)==true)
{var TipStr=_("Warn_The_DstIp_Min")+' "'+min+'" '+_("Warn_Invalid_IpAddr");warninfo_show(TipStr);return false;}
if(minfull!=maxfull)
{if(cmpIpv6Address(maxfull,minfull)==false)
{var TipStr=_("Warn_The_DstIp_Min")+' "'+min+'" '+_("Warn_Bigger_Then_Max")+' '+max;warninfo_show(TipStr);return false;}}}}
else if((Classifytype=='DPORT')||(Classifytype=='SPORT'))
{if(max!=''&&isValidPort(max)==false)
{warninfo_show(_("Warn_The_Max_Port_Is_Invalid"));return false;}
else if(min!=''&&isValidPort(min)==false)
{warninfo_show(_("Warn_The_Min_Port_Is_Invalid"));return false;}
else if(parseInt(min)>parseInt(max))
{warninfo_show(_("Warn_Port_Min_Bigger_Then_Max"));return false;}}
else if(Classifytype=='DSCP')
{if(max!=''&&(is_integer(max)==false||max<0||max>63))
{warninfo_show(_("Warn_DscpTC_Range_Max"));return false;}
else if(min!=''&&(is_integer(min)==false||min<0||min>63))
{warninfo_show(_("Warn_DscpTC_Range_Min"));return false;}
else if(parseInt(min)>parseInt(max))
{warninfo_show(_("Warn_DscpTc_Min_Bigger_Then_Max"));return false;}}
else if(Classifytype=='TOS')
{if(max!=min)
{warninfo_show(_("Warn_Tos_Min_Max_Must_Same"));return false;}
else if((is_integer(min)==false||min<0||min>99))
{warninfo_show(_("Warn_Tos_Range_Min"));return false;}
else if((is_integer(max)==false||max<0||max>99))
{warninfo_show(_("Warn_Tos_Range"));return false;}}
else if(Classifytype=='WANInterface')
{return true;}
else if(Classifytype=='EtherType')
{return true;}
else if(Classifytype=='LANInterface')
{return true;}
return true;}
function btnDelClsType()
{QoSTypeDelSubmit();}
function QoSTypeDelSubmit()
{var url;var Rmapp;var Rmtype;var RmVal;var k=0;var DelClsCount=0;var Domainstr;var TypeIst=new Array();var i=0;var typestr="";var curRuleIndex=-1;Domainstr=CurClass[CurEditClsIndex].domain;Rmtype=document.getElementsByName("rmtype");RmVal=document.getElementsByName("rmvalue");curRuleIndex=Qos_Get_CurRuleIndex(Domainstr);if(curRuleIndex==-1){console.log("rule index error: "+Domainstr);return;}
console.log("curRuleIndex="+curRuleIndex);if(Rmtype!=null)
{if(Rmtype.length>0)
{for(k=0;k<Rmtype.length;k++)
{if(Rmtype[k].checked==true)
{var typeIndex=RmVal[k].value;if(CurTypeArray[typeIndex].Type=="SMAC"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].srcmac="";CurRule[curRuleIndex].srcmacmask="";}else if(CurTypeArray[typeIndex].Type=="DMAC"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].dstmac="";CurRule[curRuleIndex].dstmacmask="";}else if(CurTypeArray[typeIndex].Type=="8021P"){CurTypeArray[typeIndex].Min=-1;CurTypeArray[typeIndex].Max=-1;CurRule[curRuleIndex].ethpricheck=-1;CurRule[curRuleIndex].ethpricheck_max=-1;}else if(CurTypeArray[typeIndex].Type=="SIP"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].srcip="";CurRule[curRuleIndex].srcmask="";}else if(CurTypeArray[typeIndex].Type=="DIP"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].dstip="";CurRule[curRuleIndex].dstmask="";}else if(CurTypeArray[typeIndex].Type=="SPORT"){CurTypeArray[typeIndex].Min=-1;CurTypeArray[typeIndex].Max=-1;CurRule[curRuleIndex].srcport=-1;CurRule[curRuleIndex].srcport_max=-1;}else if(CurTypeArray[typeIndex].Type=="DPORT"){CurTypeArray[typeIndex].Min=-1;CurTypeArray[typeIndex].Max=-1;CurRule[curRuleIndex].dstport=-1;CurRule[curRuleIndex].dstport_max=-1;}else if(CurTypeArray[typeIndex].Type=="DSCP"){CurTypeArray[typeIndex].Min=-1;CurTypeArray[typeIndex].Max=-1;CurRule[curRuleIndex].dscpcheck=-1;CurRule[curRuleIndex].dscpcheck_max=-1;}else if(CurTypeArray[typeIndex].Type=="TOS"){CurTypeArray[typeIndex].Min=-1;CurTypeArray[typeIndex].Max=-1;CurRule[curRuleIndex].toscheck=-1;CurRule[curRuleIndex].toscheck_max=-1;}else if(CurTypeArray[typeIndex].Type=="WANInterface"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].intf="";}else if(CurTypeArray[typeIndex].Type=="LANInterface"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].intf="";}else if(CurTypeArray[typeIndex].Type=="EtherType"){CurTypeArray[typeIndex].Min=-1;CurTypeArray[typeIndex].Max=-1;CurRule[curRuleIndex].ethertype=-1;}else{console.log("type error: "+type);}
DelClsCount++;}}}
else
{if(Rmtype.checked==true)
{var typeIndex=RmVal[0].value;if(CurTypeArray[typeIndex].Type=="SMAC"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].srcmac="";CurRule[curRuleIndex].srcmacmask="";}else if(CurTypeArray[typeIndex].Type=="DMAC"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].dstmac="";CurRule[curRuleIndex].dstmacmask="";}else if(CurTypeArray[typeIndex].Type=="8021P"){CurTypeArray[typeIndex].Min="-1";CurTypeArray[typeIndex].Max="-1";CurRule[curRuleIndex].ethpricheck=-1;CurRule[curRuleIndex].ethpricheck_max=-1;}else if(CurTypeArray[typeIndex].Type=="SIP"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].srcip="";CurRule[curRuleIndex].srcmask="";}else if(CurTypeArray[typeIndex].Type=="DIP"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].dstip="";CurRule[curRuleIndex].dstmask="";}else if(CurTypeArray[typeIndex].Type=="SPORT"){CurTypeArray[typeIndex].Min="-1";CurTypeArray[typeIndex].Max="-1";CurRule[curRuleIndex].srcport=-1;CurRule[curRuleIndex].srcport_max=-1;}else if(CurTypeArray[typeIndex].Type=="DPORT"){CurTypeArray[typeIndex].Min="-1";CurTypeArray[typeIndex].Max="-1";CurRule[curRuleIndex].dstport=-1;CurRule[curRuleIndex].dstport_max=-1;}else if(CurTypeArray[typeIndex].Type=="DSCP"){CurTypeArray[typeIndex].Min="-1";CurTypeArray[typeIndex].Max="-1";CurRule[curRuleIndex].dscpcheck=-1;CurRule[curRuleIndex].dscpcheck_max=-1;}else if(CurTypeArray[typeIndex].Type=="TOS"){CurTypeArray[typeIndex].Min="-1";CurTypeArray[typeIndex].Max="-1";CurRule[curRuleIndex].toscheck=-1;CurRule[curRuleIndex].toscheck_max=-1;}else if(CurTypeArray[typeIndex].Type=="WANInterface"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].intf="";}else if(CurTypeArray[typeIndex].Type=="LANInterface"){CurTypeArray[typeIndex].Min="";CurTypeArray[typeIndex].Max="";CurRule[curRuleIndex].intf="";}else if(CurTypeArray[typeIndex].Type=="EtherType"){CurTypeArray[typeIndex].Min="-1";CurTypeArray[typeIndex].Max="-1";CurRule[curRuleIndex].ethertype=-1;}else{console.log("type error: "+type);}
DelClsCount++;}}}
if(DelClsCount==0)
{warninfo_show(_("Warn_Not_Select_Any_Class"));return;}
var curTypeNum=0;var alltypelen=CurTypeArray.length;for(var i=0;i<alltypelen;++i){if(CurTypeArray[i].domain==Domainstr){++curTypeNum;}}
var cur_rule_type_num=0;for(var i=0;i<CurTypeArray.length;i++){if(CurTypeArray[i].domain==Domainstr){cur_rule_type_num++;}}
if(!confirm(_("Warn_To_Del_The_ClassType")))
{return;}
Del_Flag="1";curTypeIdx=Domainstr;Qos_Edit_set_type_all(Domainstr);if(cur_rule_type_num==DelClsCount){var ubusparam=new Array("gwweb.qos","qosclass_set",{"index":curTypeIdx,"enable":0,"protocol":""});console.log(ubusparam);var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){console.log(result);});}}
function btnEditClsType(index)
{CurEditTypeIndex=index.substr(index.indexOf('_')+1);AddFlag=false;change_class_type=1;ori_class_type=CurTypeArray[CurEditTypeIndex].Type;TypeModifyID=CurEditTypeIndex%10;getObj("Type").value=CurTypeArray[CurEditTypeIndex].Type;if(getValue('Type')=="WANInterface")
{TypeCommon.style.display="none";lan.style.display="none";TypeTos.style.display="none";ethertype.style.display="none";WriteWanInterFace();wan.style.display="block";getObj("TypeWanInterFaceMin").value=CurTypeArray[CurEditTypeIndex].Min;}
else if(getValue('Type')=="EtherType")
{TypeCommon.style.display="none";lan.style.display="none";TypeTos.style.display="none";WriteEtherType();wan.style.display="none";ethertype.style.display="block";getObj("EtherTypeMin").value=CurTypeArray[CurEditTypeIndex].Min;}
else if(getValue('Type')=="LANInterface")
{TypeCommon.style.display="none";wan.style.display="none";TypeTos.style.display="none";ethertype.style.display="none";WriteLanInterFace();lan.style.display="block";getObj("TypeLanInterFaceMin").value=CurTypeArray[CurEditTypeIndex].Min;}
else
{lan.style.display="none";wan.style.display="none";TypeTos.style.display="none";ethertype.style.display="none";TypeCommon.style.display="block";getObj("Max").value=CurTypeArray[CurEditTypeIndex].Max;getObj("Min").value=CurTypeArray[CurEditTypeIndex].Min;}
getObj("ProtocolList").value=CurTypeArray[CurEditTypeIndex].ProtocolList;Cls.style.display="block";AppEdit.style.display="none";ClsEdit.style.display="none";ClsTypeEdit.style.display="block";}
function btnEditCls(index)
{CurEditClsIndex=index.substr(index.indexOf('_')+1);AddFlag=false;ClassQueue[1].value=CurClass[CurEditClsIndex].ClassQueue;if(CurClass[CurEditClsIndex].DSCPMarkValue=="N/A"){getObj("DSCPMarkValue").value=0;}else{getObj("DSCPMarkValue").value=CurClass[CurEditClsIndex].DSCPMarkValue;}
if(CurClass[CurEditClsIndex].Value8021P=="N/A"){getObj("v8021pValue").value=0;}else{getObj("v8021pValue").value=CurClass[CurEditClsIndex].Value8021P;}
Cls.style.display="block";AppEdit.style.display="none";ClsEdit.style.display="block";ClsTypeEdit.style.display="none";ClsTypeTable.style.display="block";curTypeIdx=CurClass[CurEditClsIndex].domain;writeTypeTable(CurClass[CurEditClsIndex].domain);}
function isAbcIpAddress(address)
{if(isValidIpAddress(address)==false)
{return false;}
var addrParts=address.split('.');var num=0;num=parseInt(addrParts[0]);if(num<1||num>=224||num==127)
{return false;}
return true;}
function isIpv6Address(address)
{if(getFullIpv6Address(address)=='')
{return false;}
return true;}
function getFullIpv6Address(address)
{var c='';var i=0,j=0,k=0,n=0;var startAddress=new Array();var endAddress=new Array();var finalAddress='';var startNum=0;var endNum=0;var lowerAddress;var totalNum=0;lowerAddress=address.toLowerCase();var addrParts=lowerAddress.split('::');if(addrParts.length==2)
{if(addrParts[0]!='')
{startAddress=ParseIpv6Array(addrParts[0]);if(startAddress.length==0)
{return'';}}
if(addrParts[1]!='')
{endAddress=ParseIpv6Array(addrParts[1]);if(endAddress.length==0)
{return'';}}
if(startAddress.length+endAddress.length>=8)
{return'';}}
else if(addrParts.length==1)
{startAddress=ParseIpv6Array(addrParts[0]);if(startAddress.length!=8)
{return'';}}
else
{return'';}
for(i=0;i<startAddress.length;i++)
{finalAddress+=startAddress[i];if(i!=7)
{finalAddress+=':';}}
for(;i<8-endAddress.length;i++)
{finalAddress+='0000';if(i!=7)
{finalAddress+=':';}}
for(;i<8;i++)
{finalAddress+=endAddress[i-(8-endAddress.length)];if(i!=7)
{finalAddress+=':';}}
return finalAddress;}
function cmpIpAddress(address1,address2)
{var Lnum=0;var Snum=0;var addrParts1=address1.split('.');var addrParts2=address2.split('.');for(var i=0;i<=3;i++)
{Lnum=parseInt(addrParts1[i]);Snum=parseInt(addrParts2[i]);if(Lnum>Snum)
{return true;}
if(Lnum<Snum)
{return false;}}
return true;}
function cmpIpv6Address(address1,address2)
{var Lnum=0;var Snum=0;var addrParts1=address1.split(':');var addrParts2=address2.split(':');for(var i=0;i<=7;i++)
{Lnum=addrParts1[i];Snum=addrParts2[i];if(Lnum>Snum)
{return true;}
if(Lnum<Snum)
{return false;}}
return true;}