
function pageLoad()
{ubus_get_speedtest_status();ubus_get_speedtest_cfg();}
var speedtest_itval;var speedtest_status=0;var speedtest_direction=0;var urljson;var result_flag=0;function ubus_get_speedtest_status()
{var ubusparam_status=new Array("diag.speedtest","speedtest_status_get",{});var jsonparam_status={"id":1,"params":ubusparam_status};sk_auth_post(jsonparam_status,function(result){speedtest_status=result.result[1].status;});return speedtest_status;}
function target_url_onchange(selectElement)
{if(selectElement.value=="other"){$("#diag_speedtest_targeturl_other").show();}else{$("#diag_speedtest_targeturl_other").hide();}}
function target_url_option_add(val)
{var select=document.getElementById("diag_speedtest_targeturl");var newOption=document.createElement("option");newOption.value=val;newOption.text=val
select.insertBefore(newOption,select.options[0]);}
function target_url_set(val)
{let found=false;urljson.urllist.forEach(item=>{if(item.url==val){found=true;}});if(found){setValue("diag_speedtest_targeturl",val);}else{setValue("diag_speedtest_targeturl","other");setValue("diag_speedtest_targeturl_other",val);$("#diag_speedtest_targeturl_other").show();}}
function ubus_speedtest_result_get()
{var ubusparam_res=new Array("diag.speedtest","speedtest_result_get",{});var jsonparam_res={"id":1,"params":ubusparam_res};sk_auth_post(jsonparam_res,function(result){if(result.result[1].wanidx!=0){setValue("diag_speedtest_interface",result.result[1].wanidx);}
if(result.result[1].direction!=0){setValue("diag_speedtest_direction",result.result[1].direction);speedtest_direction=result.result[1].direction;}
target_url_set(result.result[1].url);if(speedtest_status==1){setValue("diag_speedtest_result","Testing...... This test needs to wait 30 seconds.");speedtest_itval=setInterval("speedtest_get_result()",5000);}else{var res_str="";var status_str=(speedtest_status==1)?"Testing...":"Finished";if(result.result[1].direction==1){res_str="Upload:"+status_str+"\n"+result.result[1].upload;}else if(result.result[1].direction==2){res_str="Download:"+status_str+"\n"+result.result[1].download;}
setValue("diag_speedtest_result",res_str);clearInterval(speedtest_itval);}});}
function ubus_get_speedtest_cfg()
{var ubusparam=new Array("gwweb.wancfg","status",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){var wanjson=result.result[1].wan;var wan_num=wanjson.length;var select_obj=document.getElementById("diag_speedtest_interface");for(var i=0;i<wan_num;i++){if(wanjson[i].v4_type=="bridge"){continue;}
option=new Option(wanjson[i].GUIname,wanjson[i].index);select_obj.add(option,undefined);}});var ubusparam_status=new Array("diag.speedtest","speedtest_status_get",{});var jsonparam_status={"id":1,"params":ubusparam_status};sk_auth_post(jsonparam_status,function(result){speedtest_status=result.result[1].status;});var ubusparam_urlcfg=new Array("diag.speedtest","speedtest_urlcfg_get",{});var jsonparam_urlcfg={"id":1,"params":ubusparam_urlcfg};sk_auth_post(jsonparam_urlcfg,function(result){urljson=result.result[1];for(var i=0;i<urljson.url_num;i++){target_url_option_add(urljson.urllist[i].url);}
ubus_speedtest_result_get();});}
function btn_start()
{var apply_data={};apply_data.wanidx=parseInt(getValue("diag_speedtest_interface"));if(!(apply_data.wanidx>0)){warninfo_show("Has no WAN configuration");return;}
if(getValue("diag_speedtest_targeturl")=="other"){apply_data.url=getValue("diag_speedtest_targeturl_other");}else{apply_data.url=getValue("diag_speedtest_targeturl");}
apply_data.direction=parseInt(getValue("diag_speedtest_direction"));setValue("diag_speedtest_result","Testing...... This test needs to wait 30 seconds.");var ubusparam=new Array("diag.speedtest","speedtest_start",apply_data);var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){speedtest_itval=setInterval("speedtest_get_result()",5000);});}
function btn_stop()
{var ubusparam=new Array("diag.speedtest","speedtest_stop",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){});}
function speedtest_get_result()
{var ubusparam_status=new Array("diag.speedtest","speedtest_status_get",{});var jsonparam_status={"id":1,"params":ubusparam_status};sk_auth_post(jsonparam_status,function(result){speedtest_status=result.result[1].status;if(speedtest_status==1){}else{if(result_flag>2){result_flag=0;clearInterval(speedtest_itval);}else{result_flag+=1;}}
var ubusparam=new Array("diag.speedtest","speedtest_result_get",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){var res_str="";var status_str=(speedtest_status==1)?"Testing...":"Finished";result.result[1].download=(speedtest_status==0&&result.result[1].download=="")?"Failed":result.result[1].download;result.result[1].upload=(speedtest_status==0&&result.result[1].upload=="")?"Failed":result.result[1].upload;if(result.result[1].direction==1){res_str="Upload:"+status_str+"\n"+result.result[1].upload;}else if(result.result[1].direction==2){res_str="Download:"+status_str+"\n"+result.result[1].download;}
setValue("diag_speedtest_result",res_str);});});}