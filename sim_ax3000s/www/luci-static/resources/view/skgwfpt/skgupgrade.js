
function software_upgrade()
{var data={};data.type=1;var ubusparam_reboot=new Array("rtweb.system","set_reboot_type",data);var jsonparam_reboot={"id":1,"params":ubusparam_reboot};sk_auth_post(jsonparam_reboot,function(result){var ubusparam=new Array("file","exec",{"command":"/sbin/sysupgrade","params":["-u","/tmp/firmware.bin"],"env":null});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(reldata){});});setTimeout("ping_gateway()",35000);}
function check_upgrade()
{var ubusparam=new Array("file","exec",{"command":"/sbin/sysupgrade","params":["--test","/tmp/firmware.bin"],"env":null});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(reldata){if(reldata.result[0]==0&&reldata.result[1].code==0)
{clearTimer();$(".loading p").html(_("upgradeingTipText"));software_upgrade();}
else
{hide_mode();warninfo_show(_("upgradeFailTipText"));}});}
function validate_firmware()
{var ubusparam=new Array("system","validate_firmware_image",{"path":"/tmp/firmware.bin"});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(reldata){if(reldata.result[0]==0&&reldata.result[1].valid==true&&reldata.result[1].tests.fwtool_signature==true)
{check_upgrade();}
else
{hide_mode();warninfo_show(_("fmVerifFailTipText"));}});}
function do_upload()
{loading_show();$(".loading p").html(_("fmUploadingTipText"));var formData=new FormData();formData.append('sessionid',envcar.sessionid);formData.append("filename","/tmp/firmware.bin");formData.append('filedata',$('#filename')[0].files[0]);$.ajax({url:'/cgi-bin/cgi-upload',type:'POST',data:formData,processData:false,contentType:false,dataType:"json",success:function(response){validate_firmware();},error:function(xhr,status,error){hide_mode();warninfo_show(_("fmUploadFailTipText"));}});}