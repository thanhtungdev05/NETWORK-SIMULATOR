
var binpath=""
var tmplogpath=""
var devinfo={}
var hardinfostr=""
var loadedpagenum=1
var mac="";function get_loginfo_real(command,params)
{var randnum=generateRandomString(10);var cmdstr=String(command).replace(/\\/g,'\\\\').replace(/(\s)/g,'\\$1');if(Array.isArray(params))
for(var i=0;i<params.length;i++)
cmdstr+=' '+String(params[i]).replace(/\\/g,'\\\\').replace(/(\s)/g,'\\$1');var postdata={"sessionid":encodeURIComponent(envcar.sessionid),"command":cmdstr};loading_show_data(_("infoLoadingText"));$.ajax({url:"/cgi-bin/cgi-exec?"+randnum,type:"POST",data:postdata,dataType:"text",success:function(result){hide_mode();$("#Frm_LogText").val($("#Frm_LogText").val()+result);}});}
function select_logmode(mode)
{if(mode=='1'){document.getElementById("logRemoteDiv").style.display="none";}
else{document.getElementById("logRemoteDiv").style.display="block";}}
function dis_mode_set(enable)
{if(!enable){document.getElementById("Frm_LogLevel").disabled=false;document.getElementById("Frm_LogMode").disabled=false;document.getElementById("Frm_LogModeProto").disabled=false;document.getElementById("levelModeIPAddr").disabled=false;document.getElementById("levelModePort").disabled=false;document.getElementById("Btn_download").disabled=false;document.getElementById("Btn_Refresh").disabled=false;}
else{document.getElementById("Frm_LogLevel").disabled=true;document.getElementById("Frm_LogMode").disabled=true;document.getElementById("Frm_LogModeProto").disabled=true;document.getElementById("levelModeIPAddr").disabled=true;document.getElementById("levelModePort").disabled=true;document.getElementById("Btn_download").disabled=true;document.getElementById("Btn_Refresh").disabled=true;}}
function get_logconfig()
{var ubusparam=new Array("rtweb.system","get_log_conf",{});var ubusparam2=new Array("rtweb.devinfo","get",{});var ubusparam3=new Array("rtweb.lancfg","getLanCfg",{});var jsonparam=[{"id":1,"params":ubusparam},{"id":2,"params":ubusparam2},{"id":2,"params":ubusparam3}];sk_auth_post(jsonparam,function(result){var logconf=result[0].result[1];setValue("Frm_LogLevel",logconf.level);if(logconf.enable==1){setChecked("at-log-enable1",true);dis_mode_set(false);}
else{setChecked("at-log-enable0",true);dis_mode_set(true);}
setValue("Frm_LogMode",logconf.mode);if(logconf.protocol==""){setValue("Frm_LogModeProto","tcp");}
else{setValue("Frm_LogModeProto",logconf.protocol);}
setValue("levelModeIPAddr",logconf.remote_ip);if(logconf.remote_port!=0){setValue("levelModePort",logconf.remote_port);}
select_logmode(logconf.mode);scriptpath=logconf.getsyslog_path;tmplogpath=logconf.tmplog_path;devinfo=result[1].result[1];var brlanip=result[2].result[1].ipaddr;hardinfostr="Manufacturer: SKYWORTH"
hardinfostr+="\nProductClass: "+devinfo.model
hardinfostr+="\nSerialNumber: "+devinfo.sn
hardinfostr+="\nHWVer: "+devinfo.hardver
hardinfostr+="\nSWVer: "+devinfo.softver
hardinfostr+="\nIP: "+brlanip
hardinfostr+="\n\n"
get_loginfo();});}
function checkScrollAndPrintLines(){const textarea=document.getElementById('Frm_LogText');textarea.addEventListener('scroll',function(){if(textarea.scrollTop+textarea.clientHeight>=textarea.scrollHeight-1){var lineCount=textarea.value.split('\n').length;var pagenum=Math.floor((lineCount-7)/500)+1
if(pagenum<=loadedpagenum)
return;loadedpagenum=pagenum
get_loginfo_real(scriptpath,[loadedpagenum]);}});}
function get_loginfo()
{$("#Frm_LogText").val(hardinfostr);get_loginfo_real(scriptpath);loadedpagenum=1;}
function pageLoad()
{get_logconfig();checkScrollAndPrintLines();}
function select_loglevel(level)
{var ubusparam=new Array("rtweb.system","set_conlevel",{"level":parseInt(level)});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){});}
function apply_check()
{var logMode=document.getElementById("Frm_LogMode").value;var remoteIp=document.getElementById("levelModeIPAddr").value;var remotePort=document.getElementById("levelModePort").value;if(logMode==1){return true;}
if(!isValidIpAddress(remoteIp)&&!isValidIpv6Address(remoteIp)){warninfo_show(_("logIPValidWarningText"));return false;}
if(!isValidPort(remotePort)){warninfo_show(_("logPortValidWarningText"));return false;}
return true;}
function sysLogBtnApply()
{if(!apply_check()){return false;}
var log_conf={};if(getChecked("at-log-enable1")){log_conf.enable=1;}
else{log_conf.enable=0;}
log_conf.level=Number(getValue("Frm_LogLevel"));log_conf.mode=Number(getValue("Frm_LogMode"));log_conf.protocol=getValue("Frm_LogModeProto");log_conf.remote_ip=getValue("levelModeIPAddr");log_conf.remote_port=Number(getValue("levelModePort"));var ubusparam=new Array("rtweb.system","set_log_conf",log_conf);var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){pageLoad();});return true;}
function Download_Logfile()
{$.ajax({url:"/cgi-bin/cgi-download",data:{"sessionid":encodeURIComponent(envcar.sessionid),"path":tmplogpath},method:"POST",xhrFields:{responseType:"blob"},success:function(data,status,xhr){var hardinfo=new Blob([hardinfostr],{type:"text/plain"});data=new Blob([hardinfo,data],{type:"text/plain"});var filename=mac.replace(/:/g,'')+".log";if(typeof window.navigator.msSaveBlob!=='undefined'){window.navigator.msSaveBlob(data,filename);}else{var URL=window.URL||window.webkitURL;var downloadUrl=URL.createObjectURL(data);if(filename){var a=document.createElement("a");if(typeof a.download==='undefined'){window.location.href=downloadUrl;}else{a.href=downloadUrl;a.download=filename;document.body.appendChild(a);a.click();}}else{window.location.href=downloadUrl;}
setTimeout(function(){URL.revokeObjectURL(downloadUrl);},100);}
hide_mode();}});}
function myDownloadFile()
{loading_show_data(_("infoDownloadingText"));var ubusparam=new Array("file","exec",{"command":scriptpath,"params":["-F",tmplogpath],"env":null});var ubusparam1=new Array("gwweb.wancfg","status",{});var jsonparam=[{"id":1,"params":ubusparam1},{"id":2,"params":ubusparam}];sk_auth_post(jsonparam,function(result){var wanjson=result[0].result[1].wan;mac=wanjson[0].mac_addr;console.log(mac);Download_Logfile();});}