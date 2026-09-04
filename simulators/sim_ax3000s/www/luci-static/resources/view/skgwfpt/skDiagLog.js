
var mac="";var filename="";function DownloadLogfile()
{$.ajax({url:"/cgi-bin/cgi-download",data:{"sessionid":encodeURIComponent(envcar.sessionid),"path":"/tmp/skdiag.tar.gz"},method:"POST",xhrFields:{responseType:"blob"},success:function(data,status,xhr){var filename=mac.replace(/:/g,'')+".tar.gz";if(typeof window.navigator.msSaveBlob!=='undefined'){window.navigator.msSaveBlob(data,filename);}else{var URL=window.URL||window.webkitURL;var downloadUrl=URL.createObjectURL(data);if(filename){var a=document.createElement("a");if(typeof a.download==='undefined'){window.location.href=downloadUrl;}else{a.href=downloadUrl;a.download=filename;document.body.appendChild(a);a.click();}}else{window.location.href=downloadUrl;}
setTimeout(function(){URL.revokeObjectURL(downloadUrl);},100);}}});}
function RemoveLogfile()
{var ubusparam=new Array("file","remove",{"path":"/tmp/skdiag.tar.gz"});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){});}
function UpdateProcess()
{var collectWait=_("Collect Wait");var collectSuccess=_("Collect Success");var procState=0;var ubusparam=new Array("file","exec",{"command":"cat","params":["/tmp/one_click_process"],"env":null});var ubusparam1=new Array("gwweb.wancfg","status",{});var jsonparam=[{"id":1,"params":ubusparam},{"id":2,"params":ubusparam1}];sk_auth_post(jsonparam,function(result){var wanjson=result[1].result[1].wan;mac=wanjson[0].mac_addr;console.log(mac);if(result[0].result[0]==0&&result[0].result[1].code==0){procState=parseInt(result[0].result[1].stdout);console.log(procState);$(".loading p").html(collectWait+procState+"%");if(procState<100)
{setTimeout(UpdateProcess,3000);}
else
{$(".loading p").html(collectSuccess);DownloadLogfile();setTimeout(RemoveLogfile,1000);dealy_hide_mode(2000);}}});}
function StartDownloadFile()
{var collectWait=_("Collect Wait");var ubusparam=new Array("rtweb.system","diagnostic",{});var jsonparam={"id":1,"params":ubusparam};loading_show();$(".loading p").html(collectWait+"0%");sk_auth_post(jsonparam,function(result){setTimeout(UpdateProcess,3000);});}