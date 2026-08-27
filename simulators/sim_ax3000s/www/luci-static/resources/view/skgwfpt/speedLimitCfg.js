
var sta_devnum=0;var sta_tmpDevData=new Array();function pageLoad()
{speed_sta_init();}
function speed_sta_init()
{var ubusparam=new Array("rtweb.sta","getStaInfo",{});var jsonparam={"id":1,"params":ubusparam};var pData=null;sk_auth_post(jsonparam,function(result)
{sta_devnum=0;sta_tmpDevData=[];for(var i=0;i<result.result[1].total;i++)
{pData=result.result[1].staDevices[i];sta_devnum++;sta_tmpDevData.push({"hostname":pData.hostname,"macAddr":pData.macAddr,"ipAddr":pData.ipAddr,"upSpeed":pData.maxstrus,"downSpeed":pData.maxstrds,"meshrole":pData.meshrole,"index":i+1,});}
sta_show_info();});}
function wan_mac_shift(mac,offset)
{let macArray=mac.split(':').map(part=>parseInt(part,16));macArray[5]+=offset;if(macArray[5]>0xff){macArray[4]+=Math.floor(macArray[5]/0x100);macArray[5]=macArray[5]%0x100;if(macArray[4]>0xff){macArray[3]+=Math.floor(macArray[4]/0x100);macArray[4]=macArray[4]%0x100;}}
return macArray.map(part=>part.toString(16).padStart(2,'0')).join(':');}
function sta_show_info(){var loop=0;var row="";$("#speedLimitCfg_devlist").html("");if(0!=sta_devnum){$.each(sta_tmpDevData,function(index,obj){var sta_status=sta_StatusToStr(parseInt(obj.status));row+="<tr><td id='Sta_HostName"+loop+"'>"+obj.hostname+"</td>";row+="<td id='Sta_MAC"+loop+"'> "+(obj.meshrole==2?wan_mac_shift(obj.macAddr,1).toUpperCase():obj.macAddr)+"</td>";row+="<td>"+obj.ipAddr+"</td>"
if(obj.upSpeed==0&&obj.downSpeed==0)
{row+='<td><input type="text" class="sktable-control" id="sta_up_'+loop+'" value="" disabled></input></td>'
row+='<td><input type="text" class="sktable-control" id="sta_down_'+loop+'" value="" disabled></input></td>'}
else
{row+='<td><input type="text" class="sktable-control" id="sta_up_'+loop+'" value="'+obj.upSpeed+'"></input></td>'
row+='<td><input type="text" class="sktable-control" id="sta_down_'+loop+'" value="'+obj.downSpeed+'"></input></td>'}
row+="<td><label class='skcheckbox'>";row+=" <input type='checkbox' id='rml"+loop+"' name='rml"+loop+"' value='"+obj.index+"' hidden"
if(obj.upSpeed!=0||obj.downSpeed!=0)
row+=" checked";row+=">";row+="<label for='rml"+loop+"' class='skcheckbox-label'></label>";row+="</label>";row+="</td></tr>";loop++;});}else{row+="<tr align='center'><td colspan='7'>"+"No data yet..."+"</td></tr>";}
$("#speedLimitCfg_devlist").html(row);for(let i=0;i<sta_devnum;i++){let checkbox=document.getElementById('rml'+i);let staUp=document.getElementById('sta_up_'+i);let staDown=document.getElementById('sta_down_'+i);checkbox.addEventListener('change',function(){if(checkbox.checked){staUp.disabled=false;staDown.disabled=false;}else{staUp.disabled=true;staDown.disabled=true;}});}}
function sta_StatusToStr(status)
{var ret="";if(status==0){ret="offline";}
else if(status==1){ret="online";}
return ret;}
function check_limit_max(upspeed,downspeed)
{if((upspeed>1000000)||(upspeed<0)||(downspeed>1000000)||(downspeed<0))
{return false;}
return true;}
function speedLimit_cfg_apply()
{loading_show();for(var i=0;i<sta_devnum;i++)
{var newName=document.getElementById("Sta_HostName"+i).innerText;if(sta_tmpDevData[i].meshrole==2)
var macAddr=wan_mac_shift(document.getElementById("Sta_MAC"+i).innerText,-1).toUpperCase();else
var macAddr=document.getElementById("Sta_MAC"+i).innerText;if(document.getElementById("rml"+i).checked==true)
{var upspeed=parseInt(document.getElementById("sta_up_"+i).value);var downspeed=parseInt(document.getElementById("sta_down_"+i).value);if(check_limit_max(upspeed,downspeed)==false)
{hide_mode();warninfo_show("Speed limit size cannot be less than 0 or more than 1000M.");return;}}
else
{var upspeed=0;var downspeed=0;}
sta_set_hostname(macAddr,newName,upspeed,downspeed);}
speed_sta_init();}
function sta_set_hostname(mac,hostname,upspeed,downspeed)
{var ubusparam=new Array("rtweb.sta","setSta",{"mac":mac,"hostname":hostname,"upspeed":upspeed,"downspeed":downspeed});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){if(result.result[1].result!="0")
{warninfo_show(_("lanStaInfo_SetErr"))}});}