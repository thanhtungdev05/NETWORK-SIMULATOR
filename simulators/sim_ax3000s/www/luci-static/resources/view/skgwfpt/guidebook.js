
function Download_Guidefile(guideFileName)
{$.ajax({url:"/cgi-bin/cgi-download",data:{"sessionid":encodeURIComponent(envcar.sessionid),"path":"/tmp/"+guideFileName},method:"POST",xhrFields:{responseType:"blob"},success:function(data,status,xhr){var filename=guideFileName;if(typeof window.navigator.msSaveBlob!=='undefined'){window.navigator.msSaveBlob(data,filename);}else{var URL=window.URL||window.webkitURL;var downloadUrl=URL.createObjectURL(data);if(filename){var a=document.createElement("a");if(typeof a.download==='undefined'){window.location.href=downloadUrl;}else{a.href=downloadUrl;a.download=filename;document.body.appendChild(a);a.click();}}else{window.location.href=downloadUrl;}
setTimeout(function(){URL.revokeObjectURL(downloadUrl);},100);}}});}
function StartDownloadGuide()
{var guideFileName="guide_book.pdf";var actionData={};actionData.filename=guideFileName;var restoreparam=new Array("rtweb.system","get_tmpfile",actionData);var jsonparam={"id":1,"params":restoreparam};sk_auth_post(jsonparam,function(result){if(result.result[0]!=0){warninfo_show(_("backupFailTipText"));}
else{Download_Guidefile(guideFileName);}});}
function pageLoad()
{}