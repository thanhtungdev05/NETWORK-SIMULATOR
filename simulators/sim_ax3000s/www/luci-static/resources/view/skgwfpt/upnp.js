
function pageLoad()
{contentLoad();}
function contentLoad()
{var ubusparam=new Array("rtweb.firewall","getUPnPCfg",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){infoLoad(result.result[1]);});}
function infoLoad(resArr)
{setChecked("at-upnp-enable",resArr.enable?true:false);tableInfoLoad(resArr.enable);}
function tableInfoLoad(enable)
{var ubusparam=new Array("luci.upnp","get_status",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){tableLoad(result.result[1],enable);});}
function tableLoad(resArr,enable)
{var ruleArrSize=resArr.rules.length;var ruleArr=resArr.rules;var tableNoDataNode=document.getElementById("at-upnp-nodata-tbody");var tableNode=document.getElementById("at-upnp-tbody");tableNoDataNode.innerHTML="";tableNode.innerHTML="";if(enable==0||ruleArrSize==0){tableNoDataNode.innerHTML+="<tr align='center'><td colspan='5'>"+_("NoData")+"</td></tr>";}
else{for(var i=0;i<ruleArrSize;i++){tableItemLoad(ruleArr[i]);}}}
function tableItemLoad(itemValue)
{var itemStr="";var tableNode=document.getElementById("at-upnp-tbody");var serviceName=itemValue.descr;var externalPort=itemValue.extport;var Portocol=itemValue.proto;var internalHost=itemValue.intaddr;var internalPort=itemValue.intport;var itemNumber=itemValue.num;itemStr+="<tr id='at-"+itemNumber+"-upnpTr'>";itemStr+="<th>"+serviceName+"</th>";itemStr+="<th>"+externalPort+"</th>";itemStr+="<th>"+Portocol+"</th>";itemStr+="<th>"+internalHost+"</th>";itemStr+="<th>"+internalPort+"</th>";itemStr+="</tr>";tableNode.innerHTML+=itemStr;}
function upnpButtonApplyClick()
{var upnpData={};upnpData.enable=getChecked("at-upnp-enable")?1:0;var ubusparam=new Array("rtweb.firewall","setUPnPCfg",upnpData);var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){contentLoad();});}