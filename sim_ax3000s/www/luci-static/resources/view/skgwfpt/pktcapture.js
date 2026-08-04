
var ori_wan_num=0;var ori_wan_ary=[];var mac="";function pageLoad()
{ubus_get_pktcapture_cfg();}
function ubus_get_pktcapture_cfg()
{var has_wan=0;var ubusparam1=new Array("gwweb.wancfg","status",{});var ubusparam2=new Array("diag.pktcap","pktcapture_res_get",{});var jsonparam=[{"id":1,"params":ubusparam1},{"id":2,"params":ubusparam2}];sk_auth_post(jsonparam,function(result){var wanjson=result[0].result[1].wan;var wan_num=wanjson.length;var select_obj=document.getElementById("diag_pktcapture_interface");var option=new Option("LAN","br-lan");select_obj.add(option,undefined);mac=wanjson[0].mac_addr;for(var i=0;i<wan_num;i++){option=new Option(wanjson[i].GUIname,wanjson[i].layer2interface);select_obj.add(option,undefined);has_wan=1;ori_wan_num=wan_num;ori_wan_ary[i]=wanjson[i].index;}
if(has_wan==1){option=new Option("ALL_WAN","ALL_WAN");select_obj.add(option,undefined);}
var status=result[1].result[1].Enable;var intf_tmp=result[1].result[1].PktFilter;var intf_sec=document.getElementById("diag_pktcapture_interface");var pktcap_bt=document.getElementById("button_start");if(status==1){pktcap_bt.innerHTML="Stop";intf_sec.disabled=true;}
if(intf_tmp!=""&&intf_tmp!="br-lan"){setValue("diag_pktcapture_interface",intf_tmp);}});}
function diag_pktcapture_interface_change()
{}
function diag_pktcapture_direction_change()
{}
function btn_start()
{var apply_data={};var intf_sec=document.getElementById("diag_pktcapture_interface");var direc_sec=document.getElementById("diag_pktcapture_direction");var pktcap_bt=document.getElementById("button_start");apply_data.PktFilter=getValue("diag_pktcapture_interface");apply_data.Direction=parseInt(getValue("diag_pktcapture_direction"));if(pktcap_bt.innerHTML=="Start"){apply_data.Enable=1;pktcap_bt.innerHTML="Stop";intf_sec.disabled=true;direc_sec.disabled=true;}else if(pktcap_bt.innerHTML=="Stop"){apply_data.Enable=0;pktcap_bt.innerHTML="Start";intf_sec.disabled=false;direc_sec.disabled=false;}
var ubusparam=new Array("diag.pktcap","pktcapture_set",apply_data);var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){});}
function do_download(index)
{var head="/tmp/tmp_packets";var path=head;if(index!=0){path=head+"_"+index;}
$.ajax({url:"/cgi-bin/cgi-download",data:{"sessionid":encodeURIComponent(envcar.sessionid),"path":path},method:"POST",xhrFields:{responseType:"blob"},success:function(data,status,xhr){var filename=mac.replace(/:/g,'')+"_"+index+".pcap";if(typeof window.navigator.msSaveBlob!=='undefined'){window.navigator.msSaveBlob(data,filename);}else{var URL=window.URL||window.webkitURL;var downloadUrl=URL.createObjectURL(data);if(filename){var a=document.createElement("a");if(typeof a.download==='undefined'){window.location.href=downloadUrl;}else{a.href=downloadUrl;a.download=filename;document.body.appendChild(a);a.click();}}else{window.location.href=downloadUrl;}
setTimeout(function(){URL.revokeObjectURL(downloadUrl);},100);}}});}
function sleep(time)
{var stamp=new Date().getTime();var end=stamp+time;while(true){if(new Date().getTime()>end){return;}}}
function Download_pktcapfile()
{var intf=getValue("diag_pktcapture_interface");if(intf=="ALL_WAN"){for(var i=0;i<ori_wan_num;i++){do_download(ori_wan_ary[i]);sleep(100);}}else{do_download(0);}}
function btn_save()
{Download_pktcapfile();var ubusparam=new Array("diag.pktcap","pktcapture_res_get",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){});}