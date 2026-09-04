/******************For Multi-Language Strings Start*************************/
function DictionaryStrings()
{
	this.dicObj = {};

	if(typeof(stringsArray) == 'undefined')
	{
		//alert("Load strings failure for js!!"); 
		return;
	}
	for (var i=0; stringsArray[i][0] != ''; i++)
	{
		this.dicObj[stringsArray[i][0]] = stringsArray[i][1];
	}

	/***********external method************/
	this.getstring = function(key){
		if (typeof(this.dicObj[key]) != 'undefined')
			return this.dicObj[key];
		else{
			alert(key + ":has not be defined in language string array!");
			return "";
		}
	}
}
//var langtxt = new DictionaryStrings();
//window._ = function(key) {return langtxt.getstring(key);}
//alert(_("DesNetInvalid"));
/******************End*************************/

function addStringToArray(stringsArray,getdata)
{
	if(typeof(stringsArray) == 'undefined')
	{
		return;
	}
	/*getdata.AdminJS9Text = stringsArray[13][1];*/
	/*eval("getdata."+stringsArray[13][0]+"="+"stringsArray[13][1]"+";");*/
	for (var i=0; stringsArray[i][0] != ''; i++)
	{
		eval("getdata." + stringsArray[i][0] + "=" + "stringsArray[" + i + "][1]" + ";");
	}
}
function initPage(getdata)
{
	if (getdata != null)
	{
		/*var getdata = {
			"state":	"Not Configured",
			"mapEnable":	"1",
			"deviceRole":	"controller",
			"meshSetText":	"EasyMesh Setting",
			"meshStateText":	"State",
			"meshStateVlaue1":	"Not Configured",
			"meshStateVlaue2":	"Controller",
			"meshStateVlaue3":	"Agent",
			"meshStateVlaue4":	"Auto",
			"meshEnableText":	"Enable",
			"meshDisableText":	"Disable",
			"meshRoleText":	"Role Selection",
			"meshStartText":	"Mesh Networking Start",
			"meshTopologyText":	"Mesh Topology",
			"meshDeviceRole":	"Device Role",
			"meshDeviceInfo":	"Device Info",
			"meshSuperRouter":	"Superior Router"
		};*/
		//document.tool_admin.usernameText.value = getdata.username;
		document.getElementById("meshText").innerHTML = getdata.meshSetText;
		document.getElementById("meshStateText").innerHTML = getdata.meshStateText;
		//document.getElementById("MeshStateValue").innerHTML = getdata.state;
		document.getElementById("meshEnableText").innerHTML = getdata.meshSetEnableText;
		document.getElementById("meshRoleText").innerHTML = getdata.meshRoleText;
		document.getElementById("SaveBtn").value = getdata.ButtonSaveText;
		if(typeof info_WPSStatus !== 'undefined' && info_WPSStatus === "In progress") {
			document.getElementById("trigger").value = getdata.MeshInProgressText;
			document.getElementById("trigger").disabled = true;
			document.getElementById("trigger").style.backgroundColor = "gray";
			document.getElementById("trigger").style.borderColor = "gray";
		} else {
			document.getElementById("trigger").value = getdata.meshStartText;
			document.getElementById("trigger").disabled = false;
			document.getElementById("trigger").style.backgroundColor = "";
			document.getElementById("trigger").style.borderColor = "";
		}
		document.getElementById("MeshTopologyTip").innerHTML = getdata.meshTopologyText;
		document.getElementById("deviceRole").innerHTML = getdata.meshDeviceRole;
		document.getElementById("deviceInfo").innerHTML = getdata.meshDeviceInfo;
		document.getElementById("superRouter").innerHTML = getdata.meshSuperRouter;
		document.getElementById("enable_radio_text").innerHTML = getdata.meshEnableText;
		document.getElementById("disable_radio_text").innerHTML = getdata.meshDisableText;
		document.getElementById("role_controller_text").innerHTML = getdata.meshStateVlaue2;
		document.getElementById("role_agent_text").innerHTML = getdata.meshStateVlaue3;
		document.getElementById("role_auto_text").innerHTML = getdata.meshStateVlaue4;
		if(getdata.mapEnable == "1")
		{
			document.getElementById("enable_radio").checked = true;
			document.getElementById("disable_radio").checked = false;
			document.getElementById("start_tr").style.display="block";
			//document.getElementById("div_MeshTopList").style.display="block";//display mesh topo in status-easymesh topo
		}
		else
		{
			document.getElementById("enable_radio").checked = false;
			document.getElementById("disable_radio").checked = true;
			document.getElementById("start_tr").style.display="none";
			document.getElementById("div_MeshTopList").style.display="none";
		}
		
		document.getElementById("role_controller").checked = false;
		document.getElementById("role_agent").checked = false;
		document.getElementById("role_auto").checked = false;
		if(getdata.deviceRole == "1")//"controller")
		{
			document.getElementById("role_controller").checked = true;
			document.getElementById("MeshStateValue").innerHTML = getdata.meshStateVlaue2;
		}
		else if(getdata.deviceRole == "2")//"agent")
		{
			document.getElementById("role_agent").checked = true;
			document.getElementById("MeshStateValue").innerHTML = getdata.meshStateVlaue3;
		}
		else
		{
			document.getElementById("role_auto").checked = true;
			document.getElementById("MeshStateValue").innerHTML = getdata.meshStateVlaue4;//??????
		}
		
		document.getElementById("mesh_Role_table").style.display="none";
	}
}

function fresh()
{
	initPage(getdata);
}

function formSubmit(saveAll)
{
	if(document.cbi != null)
	{
		if(saveAll)
		{
				setText('SaveAll_Flag', 1);
		}
		else
		{
				setText('SaveAll_Flag', 0);
		}
		setText('Save_Flag', 1);
		/*if( true == setEBooValueCookie(document.cbi) )
		{
			document.cbi.submit();
		}
		else
		{
			setText('Save_Flag', 0);
		}*/
	}
	showSpin();
	document.cbi.submit();
	return;
}

function btnSave()
{
	if(document.cbi != null)
	{
		var isAllBHFHClosed = getdata.isMeshAllBHOrFHClosedStatus;
		if(isAllBHFHClosed == "Yes")
		{
			var DeviceEnable=getdata.mapEnable;
			//meshEnable = $('input[name=MapEnable]:checked').val();//???
			meshEnable = getRadioVal('mesh_active');
			if ( (meshEnable != DeviceEnable) && (1 == meshEnable) )
			{
				alert("All bh and fh are closed, Please open them !")
			}
		}
	
		if(getdata.mapEnable == "1")
		{
			var DeviceRole=getdata.deviceRole;
			//var devRole = document.getElementById("DeviceRole");//???
			var devRole = getRadioVal('mesh_Role');
			if ( (devRole.value != DeviceRole) )
			{
				setText('Change_Flag', 1);
			}
		}
		else
		{
			setText('Change_Flag', 1);
		}
		formSubmit(1);
	}
}

function triggerMultiApOnBoarding()
{
	/*Only Wi-Fi On-boarding*/
	var bh_val = 1;
	if(0 == bh_val)
	{
		setText('wifi_trigger_onboarding_Flag', 0);
		setText('ether_trigger_onboarding_Flag', 1);
	}
	else
	{
		setText('wifi_trigger_onboarding_Flag', 1);
		setText('ether_trigger_onboarding_Flag', 0);
		/*TCWebApi_constSet("Mesh_action", "wifi_trigger_onboarding", "1")
		TCWebApi_constSet("Mesh_action", "ether_trigger_onboarding", "0")*/
	}
	setText('Action_Flag', 1);
	alert(getdata.MeshStartedText);
	formSubmit(0);
}

function openWindow(url, windowName, w, h) {
	var wide=w;
	var high=h;
	if (document.all)
		var xMax = screen.width, yMax = screen.height;
	else if (document.layers)
		var xMax = window.outerWidth, yMax = window.outerHeight;
	else
	   var xMax = 640, yMax=500;
	var xOffset = (xMax - wide)/2;
	var yOffset = (yMax - high)/3;
	var settings = 'width='+wide+',height='+high+',screenX='+xOffset+',screenY='+yOffset+',top='+yOffset+',left='+xOffset+', resizable=yes, toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes';
	window.open( url, windowName, settings );
}

function popup_topo_detail(topo_index)
{
	openWindow('../cgi-bin/mesh_topo_detail.asp?index='+topo_index, 'MeshTopoDetailInfos', 700, 500);
}

function filterUniqueMac(data) {
	const seenMacs = {};
	return data.filter(item => {
		if (seenMacs[item.Mac]) {
			return false;
		} else {
			seenMacs[item.Mac] = true;
			return true;
		}
	});
}

function writeMeshTopoTable()
{
	if( getdata.mapEnable == "1" && (getdata.deviceRole == "1"))
	{
		//document.getElementById("div_MeshTopList").style.display="block";//display mesh topo in status-easymesh topo
		var topo_info_array;
		if(typeof(getdata.topo_json) != "undefined")
			topo_info_array=filterUniqueMac(getdata.topo_json);
		else
			topo_info_array=getdata.topo_json;
		if( typeof(topo_info_array) != "undefined" )
		{
			var dynamicHTML = '';
			for(var i=0; i < topo_info_array.length; i++)
			{		
				var device_role=topo_info_array[i].Role;
				var al_mac=topo_info_array[i].Mac;
				var distance=parseInt(topo_info_array[i].Distance);
				var uplink_device=topo_info_array[i].UplinkMac;
				var router_ip=topo_info_array[i].IP;
				var hostname=topo_info_array[i].HostName;
				var bhType=topo_info_array[i].BhType;
				var RSSI=topo_info_array[i].RSSI;
				var BhPhyRate=topo_info_array[i].BhPhyRate;
				var assocTime=topo_info_array[i].assocTime;
				var staInfo=topo_info_array[i].StaInfo;
				
				/*if(topo_info_array[i].NegoRate.length >0 && 
					topo_info_array[i].NegoRate[0] >= '0' && topo_info_array[i].NegoRate[0] <= '9')
				{
					var negoRate= Math.floor( parseInt(topo_info_array[i].NegoRate)/1000 );
				}
				else 
					var negoRate = 0;*/
				
				dynamicHTML += "<tr height=30>";
				/*for(var j=0; j<distance; j++)
				{
					dynamicHTML += "&nbsp&nbsp";
				}*/
				if('01'==device_role)//controller
				{
					dynamicHTML += "<td align='center' class='topborderstyle' width=78 style='text-align:left;'>Controller</td><td align='center' class='topborderstyle' style='text-align:left;'>"+hostname+"<br>IP: "+router_ip+"<br>MAC: "+al_mac.toUpperCase()+"</td><td align='center' class='topborderstyle'>--</td>";
				}
				else if('02'==device_role)//agent
				{
					if(1==distance)
					{
						dynamicHTML += "<td align='center' class='topborderstyle' style='text-align:left;'>1 level agent<br><span style='font-size:11px;'>";
						if(bhType=="5G")
							dynamicHTML += "(5G WLAN Networking)</span>";
						else if(bhType=="2.4G")
							dynamicHTML += "(2.4G WLAN Networking)</span>";
						else if(bhType=="Ethernet")
							dynamicHTML += "(Wired Networking)</span>";
						if(bhType=="Ethernet")
							dynamicHTML += "<br>RSSI: N/A <br>Backhaul PhyRate: N/A";
						else
							dynamicHTML += "<br>RSSI: "+RSSI+"<br>Backhaul PhyRate: "+BhPhyRate+"<br>Assoc Time: "+assocTime;
						dynamicHTML += "</td><td align='center' class='topborderstyle' style='text-align:left;'>"+hostname+"<br>IP: <a style='color:blue; text-decoration:underline; cursor:pointer;' onClick='redirect_agent(\""+router_ip+"\");'>"+router_ip+"</a><br>MAC: "+al_mac.toUpperCase()+"</td><td align='center' class='topborderstyle'>"+uplink_device.toUpperCase()+"</td>";
					}
					else if(2==distance)
					{
						dynamicHTML += "<td align='center' class='topborderstyle' style='text-align:left;'>2 level agent<br><span style='font-size:11px;'>";
						if(bhType=="5G")
							dynamicHTML += "(5G WLAN Networking)</span>";
						else if(bhType=="2.4G")
							dynamicHTML += "(2.4G WLAN Networking)</span>";
						else if(bhType=="Ethernet")
							dynamicHTML += "(Wired Networking)</span>";
						if(bhType=="Ethernet")
							dynamicHTML += "<br>RSSI: N/A <br>Backhaul PhyRate: N/A";
						else
							dynamicHTML += "<br>RSSI: "+RSSI+"<br>Backhaul PhyRate: "+BhPhyRate+"<br>Assoc Time: "+assocTime;
						dynamicHTML += "</td><td align='center' class='topborderstyle' style='text-align:left;'>"+hostname+"<br>IP: <a style='color:blue; text-decoration:underline; cursor:pointer;' onClick='redirect_agent(\""+router_ip+"\");'>"+router_ip+"</a><br>MAC: "+al_mac.toUpperCase()+"</td><td align='center' class='topborderstyle'>"+uplink_device.toUpperCase()+"</td>";
					}
					else if(3==distance)
					{
						dynamicHTML += "<td align='center' class='topborderstyle' style='text-align:left;'>3 level agent<br><span style='font-size:11px;'>";
						if(bhType=="5G")
							dynamicHTML += "(5G WLAN Networking)</span>";
						else if(bhType=="2.4G")
							dynamicHTML += "(2.4G WLAN Networking)</span>";
						else if(bhType=="Ethernet")
							dynamicHTML += "(Wired Networking)</span>";
						if(bhType=="Ethernet")
							dynamicHTML += "<br>RSSI: N/A <br>Backhaul PhyRate: N/A";
						else
							dynamicHTML += "<br>RSSI: "+RSSI+"<br>Backhaul PhyRate: "+BhPhyRate+"<br>Assoc Time: "+assocTime;
						dynamicHTML += "</td><td align='center' class='topborderstyle' style='text-align:left;'>"+hostname+"<br>IP: <a style='color:blue; text-decoration:underline; cursor:pointer;' onClick='redirect_agent(\""+router_ip+"\");'>"+router_ip+"</a><br>MAC: "+al_mac.toUpperCase()+"</td><td align='center' class='topborderstyle'>"+uplink_device.toUpperCase()+"</td>";
					}
					else if(4==distance)
					{
						dynamicHTML += "<td align='center' class='topborderstyle' style='text-align:left;'>4 level agent<br><span style='font-size:11px;'>";
						if(bhType=="5G")
							dynamicHTML += "(5G WLAN Networking)</span>";
						else if(bhType=="2.4G")
							dynamicHTML += "(2.4G WLAN Networking)</span>";
						else if(bhType=="Ethernet")
							dynamicHTML += "(Wired Networking)</span>";
						if(bhType=="Ethernet")
							dynamicHTML += "<br>RSSI: N/A <br>Backhaul PhyRate: N/A";
						else
							dynamicHTML += "<br>RSSI: "+RSSI+"<br>Backhaul PhyRate: "+BhPhyRate+"<br>Assoc Time: "+assocTime;
						dynamicHTML += "</td><td align='center' class='topborderstyle' style='text-align:left;'>"+hostname+"<br>IP: <a style='color:blue; text-decoration:underline; cursor:pointer;' onClick='redirect_agent(\""+router_ip+"\");'>"+router_ip+"</a><br>MAC: "+al_mac.toUpperCase()+"</td><td align='center' class='topborderstyle'>"+uplink_device.toUpperCase()+"</td>";
					}
					else if(5==distance)
					{
						dynamicHTML += "<td align='center' class='topborderstyle' style='text-align:left;'>5 level agent<br><span style='font-size:11px;'>";
						if(bhType=="5G")
							dynamicHTML += "(5G WLAN Networking)</span>";
						else if(bhType=="2.4G")
							dynamicHTML += "(2.4G WLAN Networking)</span>";
						else if(bhType=="Ethernet")
							dynamicHTML += "(Wired Networking)</span>";
						if(bhType=="Ethernet")
							dynamicHTML += "<br>RSSI: N/A <br>Backhaul PhyRate: N/A";
						else
							dynamicHTML += "<br>RSSI: "+RSSI+"<br>Backhaul PhyRate: "+BhPhyRate+"<br>Assoc Time: "+assocTime;
						dynamicHTML += "</td><td align='center' class='topborderstyle' style='text-align:left;'>"+hostname+"<br>IP: <a style='color:blue; text-decoration:underline; cursor:pointer;' onClick='redirect_agent(\""+router_ip+"\");'>"+router_ip+"</a><br>MAC: "+al_mac.toUpperCase()+"</td><td align='center' class='topborderstyle'>"+uplink_device.toUpperCase()+"</td>";
					}
					else if(6==distance)
					{
						dynamicHTML += "<td align='center' class='topborderstyle' style='text-align:left;'>6 level agent<br><span style='font-size:11px;'>";
						if(bhType=="5G")
							dynamicHTML += "(5G WLAN Networking)</span>";
						else if(bhType=="2.4G")
							dynamicHTML += "(2.4G WLAN Networking)</span>";
						else if(bhType=="Ethernet")
							dynamicHTML += "(Wired Networking)</span>";
						if(bhType=="Ethernet")
							dynamicHTML += "<br>RSSI: N/A <br>Backhaul PhyRate: N/A";
						else
							dynamicHTML += "<br>RSSI: "+RSSI+"<br>Backhaul PhyRate: "+BhPhyRate+"<br>Assoc Time: "+assocTime;
						dynamicHTML += "</td><td align='center' class='topborderstyle' style='text-align:left;'>"+hostname+"<br>IP: <a style='color:blue; text-decoration:underline; cursor:pointer;' onClick='redirect_agent(\""+router_ip+"\");'>"+router_ip+"</a><br>MAC: "+al_mac.toUpperCase()+"</td><td align='center' class='topborderstyle'>"+uplink_device.toUpperCase()+"</td>";
					}
					else{ 
						dynamicHTML += "<td align='center' class='topborderstyle' style='text-align:left;'>Multi level agent<br><span style='font-size:11px;'>";
						if(bhType=="5G")
							dynamicHTML += "(5G WLAN Networking)</span>";
						else if(bhType=="2.4G")
							dynamicHTML += "(2.4G WLAN Networking)</span>";
						else if(bhType=="Ethernet")
							dynamicHTML += "(Wired Networking)</span>";
						if(bhType=="Ethernet")
							dynamicHTML += "<br>RSSI: N/A <br>Backhaul PhyRate: N/A";
						else
							dynamicHTML += "<br>RSSI: "+RSSI+"<br>Backhaul PhyRate: "+BhPhyRate+"<br>Assoc Time: "+assocTime;
						dynamicHTML += "</td><td align='center' class='topborderstyle' style='text-align:left;'>"+hostname+"<br>IP: <a style='color:blue; text-decoration:underline; cursor:pointer;' onClick='redirect_agent(\""+router_ip+"\");'>"+router_ip+"</a><br>MAC: "+al_mac.toUpperCase()+"</td><td align='center' class='topborderstyle'>"+uplink_device.toUpperCase()+"</td>";
					}
				}
				else continue;
				dynamicHTML += "<td align='center' class='topborderstyle'>"+"Client Number: "+staInfo.length+"<br><input type='button' style='font-size:13px;line-height:18px;cursor:pointer;background:none;border:none;color:blue;text-decoration:underline;' value='View more details' id='topo_detail' onclick='popup_topo_detail(" + i + ")'> </td></tr>";
			}
			//$("#mesh_topo_body").html(dynamicHTML);
			document.write(dynamicHTML);
		}
	}
}

function redirect_agent(ipaddr)
{
	var url= "http://"+ ipaddr;
	window.open(url,ipaddr,"");
}

function setMeshEnable(enable)
{
	if(enable == 1)//open
	{
		if(1)//getdata.mapEnable == 0)
		{
			document.getElementById("mesh_Role_table").style.display="none";//"block";//!!!!!
			//document.getElementById("start_tr").style.display="none";
			//document.getElementById("div_MeshTopList").style.display="block";//display mesh topo in status-easymesh topo
		}
		if(getdata.mapEnable == 0)
			document.getElementById("start_tr").style.display="none";
		else
			document.getElementById("start_tr").style.display="block";
	}
	if(enable == 0)//close
	{
		if(1)//getdata.mapEnable == 1)
		{
			document.getElementById("mesh_Role_table").style.display="none";
			//document.getElementById("start_tr").style.display="block";
			document.getElementById("div_MeshTopList").style.display="none";
		}
		if(getdata.mapEnable == 0)
			document.getElementById("start_tr").style.display="none";
		else
			document.getElementById("start_tr").style.display="none";
	}
}

function meshRoleChange(role)//1:controller;2:agent;0:auto
{
	if(role == 1)
	{
		//document.getElementById("div_MeshTopList").style.display="block";//display mesh topo in status-easymesh topo
	}
	else
	{
		document.getElementById("div_MeshTopList").style.display="none";
	}
	if((('1' == getdata.mapEnable && document.getElementById('SaveBtn').style.display != 'none') ||('1' != getdata.mapEnable && document.getElementById('SaveBtn').style.display =='none')) && 
	((document.getElementById("role_controller").checked==true&&'1'==getdata.role)||(document.getElementById("role_agent").checked==true&&'2'==getdata.role)))
	{
		if(triggerDisabled == "1")
		{
			document.getElementById("trigger").style.display="none";
		}
		else
		{
			document.getElementById("trigger").style.display="block";
		}
	}
	else document.getElementById("trigger").style.display="none";
}