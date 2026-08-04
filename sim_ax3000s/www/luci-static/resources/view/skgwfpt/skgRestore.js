
var mac="";function reboot_gateway()
{var ubusparam=new Array("file","exec",{"command":"/sbin/reboot","params":null,"env":null});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(reldata){$(".loading p").html(_("rebootingTipText"));});setTimeout("ping_gateway()",20000);}
function Restoring_configFile(fileName)
{$(".loading p").html(_("restoringTipText"));var backupFileName=fileName;var actionData={};actionData.action="load";actionData.filename=backupFileName;var ubusparam=new Array("rtweb.system","restore_backup",actionData);var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(reldata){if(reldata.result[0]==0)
{reboot_gateway();}
else
{hide_mode();warninfo_show(_("restoreFailTipText"));}});}
function unzip_uploadFile()
{var ubusparam=new Array("file","exec",{"command":"/bin/tar","params":["-tzf","/tmp/backup.tar.gz"],"env":null});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(reldata){if(reldata.result[1].code==0)
{Restoring_configFile();}
else
{hide_mode();warninfo_show(_("Configuration file decompression FAIL! "));}});}
function getUploadFilePathName(name)
{return"restore_config";}
function checkFileExist()
{if(document.getElementById("ConfigUpload").value==""){return false;}
return true;}
function myUploadConfigFile()
{if(!checkFileExist()){warninfo_show(_("uploadNoFileText"));return;}
loading_show();$(".loading p").html(_("uploadingTipText"));var fileName=getUploadFilePathName($('#ConfigUpload')[0].files[0].name);var formData=new FormData();formData.append('sessionid',envcar.sessionid);formData.append("filename","/tmp/"+fileName);formData.append('filedata',$('#ConfigUpload')[0].files[0]);$.ajax({url:'/cgi-bin/cgi-upload',type:'POST',data:formData,processData:false,contentType:false,dataType:"json",success:function(response){if(response.size)
Restoring_configFile(fileName);else
{hide_mode();warninfo_show(_("uploadFailTipText"));}},error:function(xhr,status,error){hide_mode();warninfo_show(_("uploadErrorTipText"));}});}
function myDownloadConfigFile()
{var backupFileName="backup_config";var actionData={};actionData.action="get";actionData.filename=backupFileName;var restoreparam=new Array("rtweb.system","restore_backup",actionData);var ubusparam1=new Array("gwweb.wancfg","status",{});var jsonparam=[{"id":1,"params":restoreparam},{"id":2,"params":ubusparam1}];sk_auth_post(jsonparam,function(result){var wanjson=result[1].result[1].wan;mac=wanjson[0].mac_addr;console.log(mac);if(result[0].result[0]!=0){warninfo_show(_("backupFailTipText"));}
else{downloadFileToLoacl(backupFileName);}});}
function downloadFileToLoacl(backupFileName)
{$.ajax({url:"/cgi-bin/cgi-download",data:{"sessionid":encodeURIComponent(envcar.sessionid),"path":"/tmp/"+backupFileName},method:"POST",xhrFields:{responseType:"blob"},success:function(data,status,xhr){var filename=mac.replace(/:/g,'')+"_backup_config";if(typeof window.navigator.msSaveBlob!=='undefined'){window.navigator.msSaveBlob(data,filename);}else{var URL=window.URL||window.webkitURL;var downloadUrl=URL.createObjectURL(data);if(filename){var a=document.createElement("a");if(typeof a.download==='undefined'){window.location.href=downloadUrl;}else{a.href=downloadUrl;a.download=filename;document.body.appendChild(a);a.click();}}else{window.location.href=downloadUrl;}
setTimeout(function(){URL.revokeObjectURL(downloadUrl);},100);}}});}
function msgCallRestore()
{hide_mode();loading_show();$(".loading p").html(_("recoveringCurTipText"));var restoreparam=new Array("rtweb.system","restore_backup",{"action":"default"});var jsonparam={"id":1,"params":restoreparam};sk_auth_post(jsonparam,function(result){console.log(result);});setTimeout("ping_gateway()",20000);}
function DevRestoreRemoteSubmit()
{var data={"info":_("defaultAskTipText"),"parentpage":"0","ifcancel":"0","submit":"msgCallRestore"};daillog_show(data);return;}
function pageLoad()
{if(envcar.userlevel>=2)
{$("#conftab").hide();}}