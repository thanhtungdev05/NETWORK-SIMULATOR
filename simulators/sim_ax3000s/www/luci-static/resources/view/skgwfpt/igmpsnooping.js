
function pageLoad()
{console.log("igmpsnooping配置页面初始化");var ubusiptv=new Array("rtweb.iptv","getIptvInfo",{});var jsoniptv={"id":1,"params":ubusiptv};sk_auth_post(jsoniptv,function(result){if(result.result[1].snooping_enable==1)
{setChecked("igmpsnooping_chkSnooping",true);}
else
{setChecked("igmpsnooping_chkSnooping",false);}});}
function igmpsnooping_btnSave()
{var enable=0;if(getChecked("igmpsnooping_chkSnooping")==true)
{enable=1;}
var ubusparam=new Array("rtweb.iptv","setIptvConf",{"snooping_enable":enable});var jsonparam=[{"id":1,"params":ubusparam}];sk_auth_apply(jsonparam,function(result){});}