
var ping_itval;var taskid=0;var host;var protocol;var intf="";var flag=0;var is_working=0;var working_num=0;var wan_num=0;var no_br_num=0;var option_ary=new Array();var start_enable=0;function pageLoad()
{ubus_get_pingtest_cfg();}
function ubus_get_pingtest_cfg()
{var ubusparam=new Array("gwweb.wancfg","status",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){var wanjson=result.result[1].wan;wan_num=wanjson.length;var select_obj=document.getElementById("diag_ping_interface");var option=new Option("LAN","br-lan");select_obj.add(option,undefined);for(var i=0;i<wan_num;i++){if(wanjson[i].v4_type=="bridge"){continue;}
option=new Option(wanjson[i].GUIname,wanjson[i].layer3interface);select_obj.add(option,undefined);option_ary[no_br_num]=new Array();option_ary[no_br_num].intf=wanjson[i].layer3interface;option_ary[no_br_num].ipaddr=wanjson[i].ipaddr;option_ary[no_br_num].gua=wanjson[i].gua;no_br_num++;}});var apply_data={};apply_data.Taskid=1;ubusparam=new Array("diag.ping","ping_conf_get",apply_data);jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){is_working=result.result[1].is_working;taskid=result.result[1].Taskid;if(is_working==1){setValue("diag_ping_url",result.result[1].host);setValue("diag_ping_protocol",result.result[1].protocol);setValue("diag_ping_interface",result.result[1].intf);ping_itval=setInterval("pingtest_web_data()",3000);document.getElementById("diag_ping_url").disabled=true;document.getElementById("diag_ping_protocol").disabled=true;document.getElementById("diag_ping_interface").disabled=true;}});if(is_working==0){setValue("diag_ping_url","127.0.0.1");setValue("diag_ping_protocol","-4");setValue("diag_ping_interface","br-lan");}}
function diag_ping_protocol_change()
{}
function diag_ping_interface_change()
{}
function ping_CheckAddr(arg)
{if(arg==""){warninfo_show("Address is null");return 0;}
if(isValidIpAddress(arg)==true){return 1;}
if(isValidIpv6Address(arg)==true){return 2;}
if(checkeURL(arg)==true){return 3;}
warninfo_show("Paramenter invalid");return 0;}
function btn_Start()
{var apply_data={};var check_res;apply_data.Host=getValue("diag_ping_url");check_res=ping_CheckAddr(apply_data.Host);if(check_res==0){return;}
apply_data.ProtocolVersion=getValue("diag_ping_protocol");if(apply_data.ProtocolVersion=='-4'){if(check_res==2){warninfo_show("IPv6 address but choose IPv4 protocol");return;}}
if(apply_data.ProtocolVersion=='-6'){if(check_res==1){warninfo_show("IPv4 address but choose IPv6 protocol");return;}}
setValue("diag_ping_result","");if(start_enable==0){start_enable=1;}else{return;}
apply_data.Interface=getValue("diag_ping_interface");apply_data.NumberOfRepetitions=5;var ubusparam=new Array("diag.ping","ping_param_config",apply_data);var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){if(result.result[1].failreason=="ping task configuration success"){taskid=result.result[1].result;var start_data={};start_data.Taskid=taskid;var ubusparam_start=new Array("diag.ping","ping_start",start_data);var jsonparam_start={"id":1,"params":ubusparam_start};sk_auth_post(jsonparam_start,function(result){if(result.result[1].failreason=="ping task start"){ping_itval=setInterval("pingtest_web_data()",3000);document.getElementById("diag_ping_url").disabled=true;document.getElementById("diag_ping_protocol").disabled=true;document.getElementById("diag_ping_interface").disabled=true;}});}});}
function pingtest_web_data()
{var start_data={};start_data.Taskid=taskid;var statusparam=new Array("diag.ping","ping_conf_get",start_data);var statusjson={"id":1,"params":statusparam};sk_auth_post(statusjson,function(result){is_working=result.result[1].is_working;if(is_working==0){working_num++;}});var ubusparam_res=new Array("diag.ping","ping_result",start_data);var jsonparam_res={"id":1,"params":ubusparam_res};sk_auth_post(jsonparam_res,function(result){setValue("diag_ping_result",result.result[1].Ori_data);console.log("working_num = %d",working_num);if((is_working==0)&&(working_num>1)){clearInterval(ping_itval);start_enable=0;document.getElementById("diag_ping_url").disabled=false;document.getElementById("diag_ping_protocol").disabled=false;document.getElementById("diag_ping_interface").disabled=false;}});}