
var tracert_itval;var is_working;var taskid=0;var host;var maxhop;var timeout;var numoftries;var protocol;var intf;var flag=0;function pageLoad()
{ubus_get_tracert_cfg();}
function ubus_get_tracert_cfg()
{var ubusparam=new Array("gwweb.wancfg","status",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){var wanjson=result.result[1].wan;var wan_num=wanjson.length;var select_obj=document.getElementById("diag_tracert_interface");var option=new Option("LAN","br-lan");select_obj.add(option,undefined);for(var i=0;i<wan_num;i++){if(wanjson[i].v4_type=="bridge"){continue;}
option=new Option(wanjson[i].GUIname,wanjson[i].layer3interface);select_obj.add(option,undefined);}});var apply_data={};apply_data.Taskid=1;ubusparam=new Array("diag.tracert","tracert_conf_get",apply_data);jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){is_working=result.result[1].is_working;taskid=result.result[1].Taskid;if(is_working==1){setValue("diag_tracert_url",result.result[1].host);setValue("diag_tracert_maxhops",result.result[1].maxhopcnt);setValue("diag_tracert_timeout",result.result[1].timeout);setValue("diag_tracert_numoftries",result.result[1].numoftries);setValue("diag_tracert_protocol",result.result[1].protocol);setValue("diag_tracert_interface",result.result[1].intf);tracert_itval=setInterval("tracert_web_data()",3000);document.getElementById("diag_tracert_url").disabled=true;document.getElementById("diag_tracert_maxhops").disabled=true;document.getElementById("diag_tracert_timeout").disabled=true;document.getElementById("diag_tracert_numoftries").disabled=true;document.getElementById("diag_tracert_protocol").disabled=true;document.getElementById("diag_tracert_interface").disabled=true;}});}
function diag_tracert_protocol_change()
{}
function diag_tracert_interface_change()
{}
function traceroute_CheckAddr(arg)
{if(arg==""){warninfo_show("Address is null");return 0;}
if(isValidIpAddress(arg)==true){return 1;}
if(isValidIpv6Address(arg)==true){return 2;}
if(checkeURL(arg)==true){return 3;}
warninfo_show("Paramenter invalid");return 0;}
function btn_Start()
{var apply_data={};var check_res;apply_data.Host=getValue("diag_tracert_url");check_res=traceroute_CheckAddr(apply_data.Host);if(check_res==0){return;}
if(getValue("diag_tracert_maxhops")==""){warninfo_show("Max Hops is null");return;}
apply_data.MaxHopCount=parseInt(getValue("diag_tracert_maxhops"));if(apply_data.MaxHopCount<1||apply_data.MaxHopCount>64){warninfo_show("Max hop count must be in range 1 to 64");return;}
if(getValue("diag_tracert_timeout")==""){warninfo_show("Timeout is null");return;}
apply_data.Timeout=parseInt(getValue("diag_tracert_timeout"));if(apply_data.Timeout<1||apply_data.Timeout>10){warninfo_show("Timeout must be in range 1 to 10s");return;}
if(getValue("diag_tracert_numoftries")==""){warninfo_show("NumOfTries is null");return;}
apply_data.NumberOfTries=parseInt(getValue("diag_tracert_numoftries"));if(apply_data.NumberOfTries<1||apply_data.NumberOfTries>86400){warninfo_show("NumberOfTries must be in range 1 to 86400");return;}
apply_data.ProtocolVersion=getValue("diag_tracert_protocol");if(apply_data.ProtocolVersion=='-4'){if(check_res==2){warninfo_show("IPv6 address but choose IPv4 protocol");return;}}
if(apply_data.ProtocolVersion=='-6'){if(check_res==1){warninfo_show("IPv4 address but choose IPv6 protocol");return;}}
apply_data.Interface=getValue("diag_tracert_interface");setValue("diag_tracert_result","");var ubusparam=new Array("diag.tracert","tracert_param_config",apply_data);var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){if(result.result[1].failreason=="traceroute task configuration success"){taskid=result.result[1].result;var start_data={};start_data.Taskid=taskid;var ubusparam_start=new Array("diag.tracert","tracert_start",start_data);var jsonparam_start={"id":1,"params":ubusparam_start};sk_auth_post(jsonparam_start,function(result){if(result.result[1].failreason=="traceroute task start"){tracert_itval=setInterval("tracert_web_data()",3000);document.getElementById("diag_tracert_url").disabled=true;document.getElementById("diag_tracert_maxhops").disabled=true;document.getElementById("diag_tracert_timeout").disabled=true;document.getElementById("diag_tracert_numoftries").disabled=true;document.getElementById("diag_tracert_protocol").disabled=true;document.getElementById("diag_tracert_interface").disabled=true;}});}});}
function btn_Stop()
{var start_data={};start_data.Taskid=1;var ubusparam_stop=new Array("diag.tracert","tracert_stop",start_data);var jsonparam_stop={"id":1,"params":ubusparam_stop};sk_auth_post(jsonparam_stop,function(result){});}
function tracert_web_data(){var start_data={};start_data.Taskid=taskid;var statusparam=new Array("diag.tracert","tracert_conf_get",start_data);var statusjson={"id":1,"params":statusparam};sk_auth_post(statusjson,function(result){is_working=result.result[1].is_working;});var ubusparam_res=new Array("diag.tracert","tracert_result",start_data);var jsonparam_res={"id":1,"params":ubusparam_res};sk_auth_post(jsonparam_res,function(result){hide_mode();setValue("diag_tracert_result",result.result[1].Ori_data);if(is_working==0){clearInterval(tracert_itval);document.getElementById("diag_tracert_url").disabled=false;document.getElementById("diag_tracert_maxhops").disabled=false;document.getElementById("diag_tracert_timeout").disabled=false;document.getElementById("diag_tracert_numoftries").disabled=false;document.getElementById("diag_tracert_protocol").disabled=false;document.getElementById("diag_tracert_interface").disabled=false;}});}