
var ori_wan_data={};var ori_lan_data={};var pre_dstintf_chk=new Array();function pageLoad()
{ubus_get_pktcapture_cfg();}
function ubus_get_pktcapture_cfg()
{var ubusparam_waninfo=new Array("gwweb.wancfg","status",{});var ubusparam_laninfo=new Array("rtweb.lancfg","getLanStats",{});var ubusparam_mirrorinfo=new Array("diag.pktmirror","pktmirror_conf_get",{});var jsonparam=[{"id":1,"params":ubusparam_waninfo},{"id":2,"params":ubusparam_laninfo},{"id":3,"params":ubusparam_mirrorinfo}];sk_auth_post(jsonparam,function(result){ori_wan_data=result[0].result[1]["wan"];ori_lan_data=result[1].result[1]["rtweb.lancfg"];diag_pktmirror_set_srcintf(ori_wan_data,ori_lan_data);diag_pktmirror_set_dstintf(ori_lan_data);diag_pktmirror_init_config(result[2].result[1]);});}
function diag_pktmirror_set_srcintf(wandata,landata)
{var select_obj=document.getElementById("diag_pktmirror_srcintf");if(wandata.length>0){var option=new Option("ALL_WAN","ALL_WAN");select_obj.add(option,undefined);}
for(var i=0;i<landata.length;i++){option=new Option(landata[i].devname,landata[i].devname);select_obj.add(option,undefined);}}
function diag_pktmirror_set_dstintf(landata)
{for(var i=0;i<landata.length;i++){var tmp_val={};tmp_val.name=landata[i].devname;tmp_val.checked=false;tmp_val.id="diag_pktmirror_dstintf_"+landata[i].devname;pre_dstintf_chk[i]=tmp_val;var li_lan=document.createElement("li");li_lan.id="diag_pktmirror_li_"+landata[i].devname;var label_radio=document.createElement("label");label_radio.class="skradio";var input=document.createElement("input");input.type="radio";input.name="diag_pktmirror_dstintf_"+landata[i].devname;input.id="diag_pktmirror_dstintf_"+landata[i].devname;input.value=landata[i].devname;input.onclick=function(){for(var j=0;j<pre_dstintf_chk.length;j++){if(pre_dstintf_chk[j].name==this.value){if(pre_dstintf_chk[j].checked==false){this.checked=true;pre_dstintf_chk[j].checked=true;}else{this.checked=false;pre_dstintf_chk[j].checked=false;}
break;}}};input.hidden="";label_radio.appendChild(input);var label_text=document.createElement("label");label_text.class="skradio-text";label_text.for=li_lan.id;label_text.appendChild(document.createTextNode(landata[i].devname));li_lan.appendChild(label_radio);li_lan.appendChild(label_text);var container=document.getElementById("diag_pktmirror_dstintflist");container.appendChild(li_lan);}}
function diag_pktmirror_init_config(mirrorconf)
{var lan_ary=mirrorconf.Dest.split(",");if(mirrorconf.Source.length>0)
{setValue("diag_pktmirror_srcintf",mirrorconf.Source);}
setValue("diag_pktmirror_direction",mirrorconf.Direction);for(var i=0;i<lan_ary.length;i++){var id="diag_pktmirror_dstintf_"+lan_ary[i];var input=document.getElementById(id)
if(input==null){continue;}
input.checked=true;for(var j=0;j<pre_dstintf_chk.length;j++){if(pre_dstintf_chk[j].name==lan_ary[i]){pre_dstintf_chk[j].checked=true;}}}
var pktmirror_bt=document.getElementById("button_start");var src_sec=document.getElementById("diag_pktmirror_srcintf");var direc_sec=document.getElementById("diag_pktmirror_direction");if(mirrorconf.Enable==1){pktmirror_bt.innerHTML="Stop";src_sec.disabled=true;direc_sec.disabled=true;diag_pktmirror_setdststyle(true);}}
function diag_pktmirror_srcintf_change()
{}
function diag_pktmirror_direction_change()
{}
function diag_pktmirror_dstbuild()
{var tmp_val="";var dst_val="";for(var i=0;i<pre_dstintf_chk.length;i++){if(pre_dstintf_chk[i].checked==true){tmp_val=pre_dstintf_chk[i].name+",";dst_val=dst_val+tmp_val;}}
return dst_val;}
function diag_pktmirror_setdststyle(value)
{for(var i=0;i<pre_dstintf_chk.length;i++){var id="diag_pktmirror_dstintf_"+pre_dstintf_chk[i].name;var input=document.getElementById(id);if(input==null){continue;}
input.disabled=value;}}
function btn_start()
{var apply_data={};var pktmirror_bt=document.getElementById("button_start");var src_sec=document.getElementById("diag_pktmirror_srcintf");var direc_sec=document.getElementById("diag_pktmirror_direction");var dstintf=diag_pktmirror_dstbuild();if(dstintf==""){alert("Destination interface has no select!");return;}
apply_data.Source=getValue("diag_pktmirror_srcintf");apply_data.Direction=parseInt(getValue("diag_pktmirror_direction"));apply_data.Dest=dstintf;if(pktmirror_bt.innerHTML=="Start"){apply_data.Enable=1;pktmirror_bt.innerHTML="Stop";src_sec.disabled=true;direc_sec.disabled=true;diag_pktmirror_setdststyle(true);}else if(pktmirror_bt.innerHTML=="Stop"){apply_data.Enable=0;pktmirror_bt.innerHTML="Start";src_sec.disabled=false;direc_sec.disabled=false;diag_pktmirror_setdststyle(false);}
var ubusparam=new Array("diag.pktmirror","pktmirror_set",apply_data);var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){});}