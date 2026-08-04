
function do_reboot()
{hide_mode();var data={};data.type=2;var ubusparam_reboot=new Array("rtweb.system","set_reboot_type",data);var jsonparam_reboot={"id":1,"params":ubusparam_reboot};sk_auth_post(jsonparam_reboot,function(result){var ubusparam=new Array("system","reboot",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){console.log(result);loading_show();$(".loading p").html("Device is Rebooting…");setTimeout("ping_gateway()",10000);});});}
function confirm_reboot()
{var data={"info":_("rebootTipText"),"ifcancel":"0","submit":"do_reboot"};daillog_show(data);return;}
function pageLoad()
{timeSelectLoad();scheRebootLoad();}
function scheRebootLoad()
{var ubusparam=new Array("rtweb.system","get_schrestart",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){var resArr=result.result[1];setChecked("scheRebootEnable",resArr.Enable);setValue("scheRebootHour",resArr.Hour);setValue("scheRebootMinutes",resArr.Minute);setChecked("rebootWeekMon",resArr.Monday);setChecked("rebootWeekTue",resArr.Tuesday);setChecked("rebootWeekWed",resArr.Wednesday);setChecked("rebootWeekThur",resArr.Thursday);setChecked("rebootWeekFri",resArr.Friday);setChecked("rebootWeekSat",resArr.Saturday);setChecked("rebootWeekSun",resArr.Sunday);});}
function timeSelectLoad()
{for(var i=0;i<24;i++){addSelectOption("scheRebootHour",i,i<9?"0"+i:i);}
for(var i=0;i<60;i++){addSelectOption("scheRebootMinutes",i,i<9?"0"+i:i);}}
function sechRebootClick()
{var data={};data.Enable=getChecked("scheRebootEnable");data.Hour=Number(getValue("scheRebootHour"));data.Minute=Number(getValue("scheRebootMinutes"));;data.Monday=getChecked("rebootWeekMon");data.Tuesday=getChecked("rebootWeekTue");data.Wednesday=getChecked("rebootWeekWed");data.Thursday=getChecked("rebootWeekThur");data.Friday=getChecked("rebootWeekFri");data.Saturday=getChecked("rebootWeekSat");data.Sunday=getChecked("rebootWeekSun");var param=new Array("rtweb.system","set_schrestart",data);var jsonstr={"id":1,"params":param};sk_auth_apply(jsonstr,function(result){scheRebootLoad();});}