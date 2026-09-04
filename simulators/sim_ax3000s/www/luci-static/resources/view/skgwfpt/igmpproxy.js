
function parse_result(obj)
{var enable=obj[1].result[1].proxy_enable;var wanname="";var wanobj=obj[0].result[1].wan;if(typeof(wanobj)=='undefined')
{return;}
var intf_sel=document.getElementById('igmpproxy_selInterface');for(var item in wanobj)
{if(-1==wanobj[item].v4_type.indexOf("bridge")&&(-1!=wanobj[item].GUIname.indexOf("IPTV")||-1!=wanobj[item].GUIname.indexOf("INTERNET")))
{wanname=wanobj[item].GUIname;intf_sel.add(new Option(wanname,wanname));}}
if(enable==true)
{$("#igmpproxy_selInterface").val(obj[1].result[1].wanname);setChecked("igmpproxy_chkProxy",true);}
else
{setChecked("igmpproxy_chkProxy",false);}}
function pageLoad()
{var wanparam=new Array("gwweb.wancfg","status",{});var iptvparam=new Array("rtweb.iptv","getIptvInfo",{});var jsonparam=[{"id":1,"params":wanparam},{"id":2,"params":iptvparam}];sk_auth_post(jsonparam,function(result){parse_result(result);});}
function igmpproxy_btnSave()
{var enable=0;if(getChecked("igmpproxy_chkProxy")==true)
{enable=1;}
var wan_name=getValue("igmpproxy_selInterface");var ubusparam=new Array("rtweb.iptv","setIptvConf",{"wanname":wan_name,"proxy_enable":enable});var jsonparam=[{"id":1,"params":ubusparam}];sk_auth_apply(jsonparam,function(result){});}
function igmpproxy_selchange_wan(obj)
{}