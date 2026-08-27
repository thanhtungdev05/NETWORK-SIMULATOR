
var psqlimitcfg=new Array();function pageLoad()
{hidepage_get_cfg();}
function hidepage_get_cfg()
{var ubusparam1=new Array("rtweb.hidepage","getCfg",{});var ubusparam2=new Array("gwweb.account","get_ssh",{});var ubusparam3=new Array("gwweb.account","get_telnet",{});var ubusparam4=new Array("rtweb.wifi","wlanPSQLimitGet",{});var jsonparam=[{"id":1,"params":ubusparam1},{"id":2,"params":ubusparam2},{"id":3,"params":ubusparam3},{"id":4,"params":ubusparam4}];sk_auth_post(jsonparam,function(result){if(result[0].result[1].ssh==1){setChecked("ssh_enable",true);}else{setChecked("ssh_enable",false);}
ssh_click(getObj("ssh_enable"));if(result[0].result[1].telnet==1){setChecked("telnet_enable",true);}else{setChecked("telnet_enable",false);}
telnet_click(getObj("telnet_enable"));if(0==result[1].result[0]){setValue("ssh_username",result[1].result[1].name);setValue("ssh_upsd",result[1].result[1].pwd);}
if(0==result[2].result[0]){setValue("telnet_username",result[2].result[1].name);setValue("telnet_upsd",result[2].result[1].pwd);}
var PSQLimitobj=getObj("Sel_PSQLimit");PSQLimitobj.length=0;var index=0;psqlimitcfg=result[3].result[1].bss;for(var i=0;i<result[3].result[1].bss.length;i++)
{if((result[3].result[1].bss[i].status=='Up')&&(result[3].result[1].bss[i].ifname!='rai7'))
{PSQLimitobj.options[index++]=new Option(result[3].result[1].bss[i].ifname.toString(),i.toString());if(index==1)
{if(result[3].result[1].bss[i].enable=="1")
{setChecked("psqlimit_enable",true);}
else
{setChecked("psqlimit_enable",false);}}}}});}
function SelChange_PSQLimit(cb)
{var index=cb.value;if(psqlimitcfg[index].enable=="1")
{setChecked("psqlimit_enable",true);}
else
{setChecked("psqlimit_enable",false);}}
function psq_apply()
{var ifname_index=getValue("Sel_PSQLimit");var psqlimit_enable=0;if(true==getChecked("psqlimit_enable"))
{psqlimit_enable=1;}
var Data=[{"band":psqlimitcfg[ifname_index].band,"index":psqlimitcfg[ifname_index].index,"enable":psqlimit_enable}];var ubusparam=new Array("rtweb.wifi","wlanPSQLimitSet",{"bss":Data});var jsonparam=[{"id":1,"params":ubusparam}];sk_auth_post(jsonparam,function(result){hide_mode();if(result[0].result[1].result!=0){warninfo_show("PSQ Configuration set error!")}});}
function isPasswordValid(password){if(password.length<12||password.length>64){console.log(" length is error");return false;}
const hasLowerCase=/[a-z]/;const hasUpperCase=/[A-Z]/;const hasNumber=/[0-9]/;const hasSpecialChar=/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;if(!hasLowerCase.test(password)){console.log("not hasLowerCase");return false;}
if(!hasUpperCase.test(password)){console.log("not hasUpperCase");return false;}
if(!hasNumber.test(password)){console.log("not hasNumber");return false;}
if(!hasSpecialChar.test(password)){console.log("not hasSpecialChar");return false;}
return true;}
function isUserNameValid(user){if(user.length<4||user.length>64){return false;}
return true;}
function check_ssh_param_valid(ssh_password,ssh_user)
{if(false==isUserNameValid(ssh_user)){warninfo_show(_("ssh_user_invalid"));return false;}
if(false==isPasswordValid(ssh_password)){warninfo_show(_("ssh_password_invalid"));return false;}
return true;}
function ssh_apply()
{var ssh=0;var ssh_password;var ssh_user;if(true==getChecked("ssh_enable")){ssh=1;ssh_password=getValue("ssh_upsd");ssh_user=getValue("ssh_username");if(false==check_ssh_param_valid(ssh_password,ssh_user)){return;}}
loading_show();var ubusparam1=new Array("rtweb.hidepage","setCfg",{"ssh":ssh});var ubusparam2=new Array("gwweb.account","set_ssh",{"newname":ssh_user,"newpwd":ssh_password});var jsonparam=[{"id":1,"params":ubusparam1}];if(1==ssh){jsonparam.push({"id":2,"params":ubusparam2});}
sk_auth_post(jsonparam,function(result){hide_mode();if(result[0].result[1].result!=0){warninfo_show("set_ssh_cfg_error")}});}
function check_telnet_param_valid(tel_password,tel_user)
{if(false==isUserNameValid(tel_user)){warninfo_show(_("telnet_user_invalid"));return false;}
if(false==isPasswordValid(tel_password)){warninfo_show(_("telnet_password_invalid"));return false;}
return true;}
function telnet_apply()
{var telnet=0;var tel_password;var tel_user;if(true==getChecked("telnet_enable")){telnet=1;tel_password=getValue("telnet_upsd");tel_user=getValue("telnet_username");if(false==check_telnet_param_valid(tel_password,tel_user)){return;}}
loading_show();var ubusparam1=new Array("rtweb.hidepage","setCfg",{"telnet":telnet});var ubusparam2=new Array("gwweb.account","set_telnet",{"newname":tel_user,"newpwd":tel_password});var jsonparam=[{"id":1,"params":ubusparam1}];if(1==telnet){jsonparam.push({"id":2,"params":ubusparam2});}
sk_auth_post(jsonparam,function(result){hide_mode();if(result[0].result[1].result!=0){warninfo_show("set_telnet_cfg_error")}});}
function ssh_click(obj)
{if(obj.checked==true)
$("#sshCfgTab").show();else
$("#sshCfgTab").hide();}
function telnet_click(obj)
{if(obj.checked==true)
$("#telnetCfgTab").show();else
$("#telnetCfgTab").hide();}