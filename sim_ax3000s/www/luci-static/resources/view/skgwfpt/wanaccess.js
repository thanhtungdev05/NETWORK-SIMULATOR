
var WanCfgJson={};var WanAccessJson={};var sel_wan_index;function parse_result(obj)
{var enable=0;var wanname="";sel_wan_index=1;var wanport=8080;if(typeof(WanCfgJson)=='undefined')
{return;}
var intf_sel=document.getElementById('wanaccess_selInterface');for(var item in WanCfgJson)
{if(-1==WanCfgJson[item].v4_type.indexOf("bridge")&&(WanCfgJson[item].GUIname.indexOf("INTERNET")))
{wanname=WanCfgJson[item].GUIname;intf_sel.add(new Option(wanname,wanname));}}
if(WanAccessJson.length>0){enable=WanAccessJson[WanAccessJson.length-1].enable;wanport=WanAccessJson[WanAccessJson.length-1].wanport;$("#wanaccess_selInterface").val(WanAccessJson[WanAccessJson.length-1].wanname);sel_wan_index=WanAccessJson[WanAccessJson.length-1].wanindex;}
document.getElementById("wanaccess_port").value=wanport;if(enable==true)
{setChecked("wanaccess_chk",true);}
else
{setChecked("wanaccess_chk",false);}}
function pageLoad()
{var wanparam=new Array("gwweb.wancfg","status",{});var wanaccessparam=new Array("rtweb.wanaccess","getWanAccess",{});var jsonparam=[{"id":1,"params":wanparam},{"id":2,"params":wanaccessparam}];sk_auth_post(jsonparam,function(result){WanCfgJson=result[0].result[1].wan;WanAccessJson=result[1].result[1].wanaccess;parse_result(result);});}
function sleep(ms)
{return new Promise(resolve=>setTimeout(resolve,ms));}
async function wanaccess_apply()
{var item=0;await sleep(4000);var wan_name=getValue("wanaccess_selInterface");var wan_port=parseInt(getValue("wanaccess_port"));for(item;item<WanAccessJson.length;item++)
{if(WanAccessJson[item].wanname==wan_name)
{WanAccessJson[item].wanport=wan_port;WanAccessJson[item].enable=getChecked("wanaccess_chk");break;}}
if(item==WanAccessJson.length)
{location.reload();}}
function isNumber2(str){var n=Math.floor(Number(str));return String(n)===str&&n>0;}
function isInRange(number){return number>=0&&number<=65535;}
function checkPortValid()
{if(!getValue("wanaccess_port"))
{warninfo_show(_('Warn_Port_Invalid'));return false;}
if(!isNumber2(getValue("wanaccess_port")))
{warninfo_show(_('Warn_Port_Invalid'));return false;}
if(!isInRange(parseInt(getValue("wanaccess_port"))))
{warninfo_show(_('Warn_Port_Invalid'));return false;}
return true;}
function wanaccess_btnSave()
{var enable=0;var find=0;var item=0;if(!checkPortValid())
{return;}
if(getChecked("wanaccess_chk")==true)
{enable=1;}
var wan_name=getValue("wanaccess_selInterface");var wan_port=parseInt(getValue("wanaccess_port"));var ubusparam=new Array("rtweb.wanaccess","setWanAccess",{"enable":parseInt(enable),"wanname":wan_name,"wanindex":parseInt(sel_wan_index),"wanport":wan_port});var jsonparam=[{"id":1,"params":ubusparam}];sk_auth_apply(jsonparam,function(result){wanaccess_apply();});}
function wanaccess_selchange_wan(obj)
{var wan_name=getValue("wanaccess_selInterface");var wan_port;var enable;for(var item=0;item<WanCfgJson.length;item++)
{if(WanCfgJson[item].GUIname==wan_name)
{sel_wan_index=WanCfgJson[item].index;}}
document.getElementById("wanaccess_port").value=8080;setChecked("wanaccess_chk",false);for(var item=0;item<WanAccessJson.length;item++)
{if(WanAccessJson[item].wanname==wan_name)
{document.getElementById("wanaccess_port").value=WanAccessJson[item].wanport;enable=WanAccessJson[item].enable;if(enable==true)
{setChecked("wanaccess_chk",true);}
else
{setChecked("wanaccess_chk",false);}}}}