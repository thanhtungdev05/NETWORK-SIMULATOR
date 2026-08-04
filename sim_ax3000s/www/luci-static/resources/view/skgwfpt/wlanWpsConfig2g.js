
function pageLoad()
{getWpsCfg();}
var wifi_wps={};function isValidAscii(val)
{for(var i=0;i<val.length;i++)
{var ch=val.charAt(i);if(ch<' '||ch>'~')
{return ch;}}
return'';}
function isSafeStringIn(compareStr,UnsafeStr)
{for(var i=0;i<compareStr.length;i++)
{var c=compareStr.charAt(i);if(isValidAscii(c)!='')
{return false;}
else
{if(UnsafeStr.indexOf(c)==-1)
{return false;}}}
return true;}
function isvalidpin(val)
{var ret=false;var len=val.length;var pinSize=8;var pinvalue=new Array();if(len!=pinSize)
{return false;}
else
{for(i=0;i<pinSize;i++)
{pinvalue[i]=parseInt(val.charAt(i),10);}
var accum=0;accum=(pinvalue[0]+pinvalue[2]+pinvalue[4]+pinvalue[6])*3+pinvalue[1]+pinvalue[3]+pinvalue[5]+pinvalue[7];if(0==(accum%10))
{return true;}
else
{return false;}}
return ret;}
function getWpsCfg()
{var ubusparam=new Array("rtweb.wifi","wlanWpsGet",{"band":"2.4G","index":1});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){wifi_wps.enable=result.result[1].radios[0].wpsEnable;wifi_wps.mode=result.result[1].radios[0].wpsMethods;wifi_wps.status=result.result[1].radios[0].wpsStatus;wifi_wps.pin=result.result[1].radios[0].pin;var toggleElement=document.getElementById('wps_hide');if(wifi_wps.enable==0){toggleElement.style.display='none';document.getElementById('wps_switch').value=(_('wlanMapSetting2g_enabled'));}else{toggleElement.style.display='block';document.getElementById('wps_switch').value=(_('wlanMapSetting2g_disabled'));}});}
function wifiReload()
{var ubusparam=new Array("rtweb.wifi","reload",{"band":2});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){console.log("wifi reload");});}
function setwpsCfg(mode,pincode)
{var data=[];var objValue={"band":"2.4G","index":1,"enable":1,"mode":mode,"pin":pincode};data.push(objValue);var ubusparam=new Array("rtweb.wifi","wlanWpsSet",{"bss":data});var jsonparam=[{"id":1,"params":ubusparam}];sk_auth_post(jsonparam,function(result){loading_show();setTimeout("hide_mode()",5000);});}
function setwpsCfg_en(enable)
{var data=[];var objValue={"band":"2.4G","index":1,"enable":enable};data.push(objValue);var ubusparam=new Array("rtweb.wifi","wlanWpsSet",{"bss":data});var jsonparam=[{"id":1,"params":ubusparam}];sk_auth_post(jsonparam,function(result){loading_show();setTimeout("hide_mode()",5000);});}
function BntClick_PbcShow()
{var toggleElement=document.getElementById('wps_hide');if(toggleElement.style.display==='none'){toggleElement.style.display='block';document.getElementById('wps_switch').value=(_('wlanMapSetting2g_disabled'));setwpsCfg_en(1);}else{toggleElement.style.display='none';document.getElementById('wps_switch').value=(_('wlanMapSetting2g_enabled'));setwpsCfg_en(0);}}
function BntClick_PbcApply()
{setwpsCfg("pbc","");}
function BntClick_PinApply()
{var pin=getValue("Txt_WPSPIN");if(isvalidpin(pin)==false)
{warninfo_show(_('wlanWpsConfig2g_pininvalid'));return false;}
setwpsCfg("pin",pin);}
function BntClick_Apply()
{setwpsCfg();}