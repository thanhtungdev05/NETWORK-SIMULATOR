
var WanConnJson={};var tr069WanIf="";var foundTR069Wan=0;function pageLoad()
{init_tr069();disableAll();}
function disableAll()
{var form=document.getElementById('mainForm');var formElements=form.elements;for(var i=0;i<formElements.length;i++){formElements[i].disabled=true;}}
function getTr069WanIf()
{var i=0;for(i=0;i<WanConnJson.length;i++)
{if(WanConnJson[i].GUIname.indexOf("TR069")!=-1)
{foundTR069Wan=1;if(WanConnJson[i].v4_type=="bridge")
{if(WanConnJson[i].layer2interface!=undefined)
{tr069WanIf=WanConnJson[i].layer2interface+".sub.1";}}
else
{if(WanConnJson[i].layer3interface!=undefined)
{tr069WanIf=WanConnJson[i].layer3interface;}}}}}
function init_tr069()
{var ubusparam=new Array("gwweb.tr069","get_acs_cfg",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){tr069_parse_data(result);});var ubusparam=new Array("gwweb.tr069","get_acs_ssl_cfg",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){setValue("privKeyPaswd",result.result[1].KeyPassword);});ubusparam=new Array("gwweb.wancfg","status",{});jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){if(result.result[0]==0)
{WanConnJson=result.result[1].wan;getTr069WanIf();}});}
function tr069_parse_data(data)
{if(data.result[1].Enable==1){setChecked("tr069Enable2",true);setChecked("tr069Enable1",false);}
else{setChecked("tr069Enable2",false);setChecked("tr069Enable1",true);}
if(data.result[1].DataModel=="tr181"){I("modelswitch").selectedIndex=1;}
else{I("modelswitch").selectedIndex=0;}
if(data.result[1].PeriodicEnable==true){setChecked("inform2",true);setChecked("inform1",false);}
else{setChecked("inform2",false);setChecked("inform1",true);}
setValue("informInterval",data.result[1].PeriodicInterval);setValue("acsURL",data.result[1].AcsUrl);setValue("acsUser",data.result[1].AcsUser);setValue("acsPwd",data.result[1].AcsPwd);if(data.result[1].SoapMessageDebugEnable==true){setChecked("debug2",true);setChecked("debug1",false);}
else{setChecked("debug2",false);setChecked("debug1",true);}
if(data.result[1].AuthenticationEnable==true){setChecked("connReqAuth",true);showhide("divConnAuth",1);}
else{setChecked("connReqAuth",false);showhide("divConnAuth",0);}
setValue("connReqUser",data.result[1].ConnReqUser);setValue("connReqPwd",data.result[1].ConnReqPwd);setValue("connReqUrl",data.result[1].ConnReqUrl);}
function SelChange_DataMode()
{}
function connAuthChange()
{if(getChecked("connReqAuth"))
showhide("divConnAuth",1);else
showhide("divConnAuth",0);}
function validateURL(url){try{new URL(url);return true;}catch(error){return false;}}
function tr069_pageCheckValue()
{if(foundTR069Wan==0)
{alert(_("acscfg_InterfaceInvalid2"))}
if(!InputRangeJudge(getValue("informInterval"))){warninfo_show(_("acscfg_InformIInvalid"));return false;}
if(!validateURL(getValue("acsURL"))){warninfo_show(_("acscfg_ACSURLInvalid"));return false;}
if((getValue("acsUser").length>64)){warninfo_show(_("acscfg_ACSUsernameTooLong"));return false;}
if((getValue("acsPwd").length>64)){warninfo_show(_("acscfg_ACSPasswordTooLong"));return false;}
if((getValue("connReqUser").length>64)){warninfo_show(_("acscfg_ConnReqUsernameTooLong"));return false;}
if((getValue("connReqPwd").length>64)){warninfo_show(_("acscfg_ConnReqUserPasswordTooLong"));return false;}
return true;}
function I(i){return document.getElementById(i);}
function getValue(item){return I(item).value;}
function setValue(item,value){I(item).value=value;}
function getChecked(item){return I(item).checked;}
function setChecked(item,value)
{if(value==true)
I(item).checked=true;else
I(item).checked=false;}
function InputRangeJudge(value)
{if(!isNaN(value)){if(/^[1-9]\d{0,10}$/.test(value)==true&&value>=1&&value<=4294967295){return true;}
else{return false;}}}
function containsIllegalCharacters(str){var regex=/[^\w\s]/;return regex.test(str);}
function passwordApply()
{if(getValue("privKeyPaswd")&&!containsIllegalCharacters(getValue("privKeyPaswd")))
{loading_show();var ubusparam=new Array("gwweb.tr069","set_acs_ssl_cfg",{"KeyPassword":getValue("privKeyPaswd")});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){hide_mode();location.reload();});}else{warninfo_show(_("acscfg_PasswordInvalid"));}}
function lcpkApply()
{var ubusparam=new Array("gwweb.tr069","set_acs_ssl_cfg",{"ssl_key":"/etc/ssl/private/client_key.pem"});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){});}
function do_lcpk_upload()
{if(getObj("filename1").files.length>0)
{loading_show();var formData=new FormData();formData.append('sessionid',envcar.sessionid);formData.append("filename","/etc/ssl/private/client_key.pem");formData.append('filedata',$('#filename1')[0].files[0]);$.ajax({url:'/cgi-bin/cgi-upload',type:'POST',data:formData,processData:false,contentType:false,dataType:"json",success:function(response){hide_mode();console.log(response);lcpkApply();},error:function(xhr,status,error){hide_mode();warninfo_show(_("acscfg_UploadFailed"));}});}}
function lcApply()
{var ubusparam=new Array("gwweb.tr069","set_acs_ssl_cfg",{"ssl_cert":"/etc/ssl/certs/client.pem"});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){});}
function do_lc_upload()
{if(getObj("filename2").files.length>0)
{loading_show();var formData=new FormData();formData.append('sessionid',envcar.sessionid);formData.append("filename","/etc/ssl/certs/client.pem");formData.append('filedata',$('#filename2')[0].files[0]);$.ajax({url:'/cgi-bin/cgi-upload',type:'POST',data:formData,processData:false,contentType:false,dataType:"json",success:function(response){hide_mode();console.log(response);lcApply();},error:function(xhr,status,error){hide_mode();warninfo_show(_("acscfg_UploadFailed"));}});}}
function tccApply()
{var ubusparam=new Array("gwweb.tr069","set_acs_ssl_cfg",{"ssl_cacert":"/etc/ssl/certs/ca_info.pem"});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){});}
function do_tcc_upload()
{if(getObj("filename3").files.length>0)
{loading_show();var formData=new FormData();formData.append('sessionid',envcar.sessionid);formData.append("filename","/etc/ssl/certs/ca_info.pem");formData.append('filedata',$('#filename3')[0].files[0]);$.ajax({url:'/cgi-bin/cgi-upload',type:'POST',data:formData,processData:false,contentType:false,dataType:"json",success:function(response){hide_mode();console.log(response);tccApply();},error:function(xhr,status,error){hide_mode();warninfo_show(_("acscfg_UploadFailed"));}});}}