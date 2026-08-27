
function pageLoad()
{ubus_get_sun_info();}
function ubus_get_sun_info()
{var ubusparam=new Array("gwweb.tr069","get_stun_cfg",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){if(result.result[1].enable==1)
{setChecked("enable2",true);}else
{setChecked("enable1",true);}
setValue("stunServerAddress",result.result[1].server_address);setValue("stunServerPort",result.result[1].server_port);setValue("stunUser",result.result[1].username);setValue("stunPwd",result.result[1].password);setValue("stunMaxKeepAlivePeriod",result.result[1].max_keepalive);setValue("stunMinKeepAlivePeriod",result.result[1].min_keepalive);});}
function isValidIPAddress(address){const ipv4Pattern=/^(25[0-5]|2[0-4]\d|[01]?\d{1,2})(\.(25[0-5]|2[0-4]\d|[01]?\d{1,2})){3}$/;if(ipv4Pattern.test(address)){return true;}
const ipv6Pattern=/^([\da-fA-F]{1,4}:){7}([\da-fA-F]{1,4})$/;const compressedIpv6Pattern=/^((([A-F0-9]{1,4}:){0,5}[A-F0-9]{1,4})?::)?(([A-F0-9]{1,4}:){0,5}[A-F0-9]{1,4})?$/i;if(ipv6Pattern.test(address)||compressedIpv6Pattern.test(address)){return true;}
try{const url=new URL(`http://${address}`);if(url.hostname===address){return true;}}catch(error){}
return false;}
function containsIllegalCharacters(str){var regex=/[^\w\s]/;return regex.test(str);}
function isNumber2(str){var n=Math.floor(Number(str));return String(n)===str&&n>0;}
function isInRange(number){return number>=0&&number<=65535;}
function checkStunInfo()
{if(getValue("stunServerPort")&&!isValidIPAddress(getValue("stunServerAddress")))
{warninfo_show(_('stuncfg_ServerAddrInvalid'));return false;}
if(getValue("stunUser").length>64){warninfo_show(_('stuncfg_UserNameTooLong'));return false;}
if(getValue("stunPwd").length>64){warninfo_show(_('stuncfg_UserPasswordTooLong'));return false;}
if(getValue("stunUser")&&containsIllegalCharacters(getValue("stunUser")))
{warninfo_show(_('stuncfg_UserNameInvalid'));return false;}
if(getValue("stunPwd")&&containsIllegalCharacters(getValue("stunPwd")))
{warninfo_show(_('stuncfg_UserPasswordInvalid'));return false;}
if(!getValue("stunServerPort"))
{warninfo_show(_('stuncfg_ServerPortEmpty'));return false;}
if(!getValue("stunMinKeepAlivePeriod"))
{warninfo_show(_('stuncfg_MinKeepAliveEmpty'));return false;}
if(!getValue("stunMaxKeepAlivePeriod"))
{warninfo_show(_('stuncfg_MaxKeepAliveEmpty'));return false;}
if(!isNumber2(getValue("stunServerPort")))
{warninfo_show(_('stuncfg_ServerPortIsNotNum'));return false;}
if(!isInRange(parseInt(getValue("stunServerPort"))))
{warninfo_show(_('stuncfg_ServerPortRangeError'));return false;}
if(!isNumber2(getValue("stunMinKeepAlivePeriod")))
{warninfo_show(_('stuncfg_MinKeepAliveIsNotNum'));return false;}
if(!isNumber2(getValue("stunMaxKeepAlivePeriod")))
{warninfo_show(_('stuncfg_MaxKeepAliveIsNotNum'));return false;}
if(parseInt(getValue("stunMaxKeepAlivePeriod"))<parseInt(getValue("stunMinKeepAlivePeriod"))){warninfo_show(_('stuncfg_MaxLessThanMin'));return false;}
return true;}
function btnApply()
{if(!checkStunInfo())
{return;}
var apply_data={};if(getChecked("enable2"))
{apply_data.enable=1;}else
{apply_data.enable=0;}
apply_data.username=getValue("stunUser");apply_data.password=getAES(getValue("stunPwd"));apply_data.server_address=getValue("stunServerAddress");apply_data.server_port=parseInt(getValue("stunServerPort"));apply_data.min_keepalive=parseInt(getValue("stunMinKeepAlivePeriod"));apply_data.max_keepalive=parseInt(getValue("stunMaxKeepAlivePeriod"));var ubusparam=new Array("gwweb.tr069","set_stun_cfg_encrypt",apply_data);var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){console.log(result.result[1]);});}