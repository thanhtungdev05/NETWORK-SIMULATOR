
var dns_itval;var taskid=0;var host;var protocol;var intf="";var flag=0;var is_working=0;var working_num=0;var wan_num=0;var no_br_num=0;var option_ary=new Array();var start_enable=0;function pageLoad()
{ubus_get_dnstest_cfg();}
function ubus_get_dnstest_cfg()
{var apply_data={};apply_data.Taskid=1;ubusparam=new Array("diag.dns","dns_conf_get",apply_data);jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){is_working=result.result[1].is_working;taskid=result.result[1].Taskid;if(is_working==1){setValue("diag_dns_lookup_url",result.result[1].host);setValue("diag_dns_lookup_time",result.result[1].time);setValue("diag_dns_lookup_protocol",result.result[1].protocol);dns_itval=setInterval("dnstest_web_data()",3000);document.getElementById("diag_dns_lookup_url").disabled=true;document.getElementById("diag_dns_lookup_time").disabled=true;document.getElementById("diag_dns_lookup_protocol").disabled=true;}});if(is_working==0){setValue("diag_dns_lookup_protocol","-4");}}
function diag_dns_lookup_protocol_change()
{}
function dns_CheckAddr(arg)
{if(arg==""){warninfo_show("Address is null");return 0;}
if(isValidIpAddress(arg)==true){return 1;}
if(isValidIpv6Address(arg)==true){return 2;}
if(checkeURL(arg)==true){return 3;}
warninfo_show("Paramenter invalid");return 0;}
function dns_CheckTime(value)
{if(value==""){warninfo_show("Timeout is null");return 0;}
const regex=/^\d+(\.\d+)?$/;if(regex.test(value))
return 1;warninfo_show("Paramenter invalid");return 0;}
function btn_Start()
{var apply_data={};var check_res;apply_data.Host=getValue("diag_dns_lookup_url");check_res=dns_CheckAddr(apply_data.Host);if(check_res==0){return;}
apply_data.ProtocolVersion=getValue("diag_dns_lookup_protocol");var time_value=getValue("diag_dns_lookup_time");if(dns_CheckTime(time_value)==0)
return;apply_data.Timeout=parseInt(time_value);setValue("diag_dns_lookup_result","");if(start_enable==0){start_enable=1;}else{return;}
var ubusparam=new Array("diag.dns","dns_param_config",apply_data);var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){if(result.result[1].failreason=="dns lookup task configuration success"){taskid=result.result[1].result;var start_data={};start_data.Taskid=taskid;var ubusparam_start=new Array("diag.dns","dns_start",start_data);var jsonparam_start={"id":1,"params":ubusparam_start};sk_auth_post(jsonparam_start,function(result){if(result.result[1].failreason=="dns lookup task start"){dns_itval=setInterval("dnstest_web_data()",3000);document.getElementById("diag_dns_lookup_url").disabled=true;document.getElementById("diag_dns_lookup_time").disabled=true;document.getElementById("diag_dns_lookup_protocol").disabled=true;}});}});}
function dnstest_web_data()
{var start_data={};start_data.Taskid=taskid;var statusparam=new Array("diag.dns","dns_conf_get",start_data);var statusjson={"id":1,"params":statusparam};sk_auth_post(statusjson,function(result){is_working=result.result[1].is_working;if(is_working==0){working_num++;}});var ubusparam_res=new Array("diag.dns","dns_result",start_data);var jsonparam_res={"id":1,"params":ubusparam_res};sk_auth_post(jsonparam_res,function(result){setValue("diag_dns_lookup_result",result.result[1].Ori_data);console.log("working_num = %d",working_num);if((is_working==0)&&(working_num>1)){clearInterval(dns_itval);start_enable=0;document.getElementById("diag_dns_lookup_url").disabled=false;document.getElementById("diag_dns_lookup_protocol").disabled=false;document.getElementById("diag_dns_lookup_time").disabled=false;}});}