
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
		<meta http-equiv=Content-Script-Type content=text/javascript>
		<meta http-equiv=Content-Style-Type content=text/css>
		<meta http-equiv=Content-Type content="text/html; charset=iso-8859-1">
		<!--<script language="JavaScript" src="OutVariant.asp"></script>-->
		<script language="JavaScript" src="/general.js"></script>
		<script language="JavaScript" src="/jsl.js"></script>
		<script language="JavaScript" src="/ip.js"></script>
		<script language="JavaScript" src="/util_e8c.js"></script>
		
		<style  type="text/css">
				*{color:  #404040;}
		</style>

		<script type="text/javascript" src="/spin.js" ></script>
		<link rel="stylesheet" type="text/css" href="/style.css">
		<script language="JavaScript">
		var getdata = {
	"state":	"Not Configured",
	"mapEnable":	"1",
	"isMeshAllBHOrFHClosedStatus":	"No",
	"deviceRole":	"1",
	"topo_json":	[{
			"Role":	"01",
			"Distance":	"0",
			"Mac":	"20:be:b4:0b:16:91",
			"IP":	"192.168.1.1",
			"HostName":	"AX3000HV2-1691",
			"UplinkMac":	"",
			"BhType":	"",
			"RSSI":	"",
			"BhPhyRate":	"",
			"assocTime":	"",
			"StaInfo":	[{
					"devname":	"Unknown",
					"mac":	"d8:43:ae:2e:65:45",
					"ip":	"192.168.1.179",
					"medium":	"eth",
					"rssi":	0,
					"phyrate":	"1000",
					"roamtime":	"--",
					"upstream":	"0",
					"downstream":	"0"
				}]
		}],
	"meshSetText":	"Mesh Setting",
	"meshStateText":	"State",
	"meshStateVlaue1":	"Not Configured",
	"meshStateVlaue2":	"Controller",
	"meshStateVlaue3":	"Agent",
	"meshStateVlaue4":	"Auto",
	"meshSetEnableText":	"Enable",
	"meshEnableText":	"Enable",
	"meshDisableText":	"Disable",
	"meshRoleText":	"Role Selection",
	"meshStartText":	"Mesh Networking Start",
	"MeshStartedText":	"Mesh Networking has started",
	"MeshInProgressText":	"Mesh networking is in progress",
	"meshTopologyText":	"Mesh Topology",
	"meshDeviceRole":	"Device Role",
	"meshDeviceInfo":	"Device Info",
	"meshSuperRouter":	"Superior Router",
	"ButtonSaveText":	"Save",
	"ClickButtonSaveText":	"Click \"Save\" to save your settings",
	"MeshClientNumber":	"Client Number"
};
		
		if(typeof Object.assign != 'function') {//ieû��ʵ��Object.assign����
		  Object.assign = function(target) {
			'use strict';
			if (target == null) {
			  throw new TypeError('Cannot convert undefined or null to object');
			}

			target = Object(target);
			for(var index = 1; index < arguments.length; index++) {
			  var source = arguments[index];
			  if (source != null) {
				for (var key in source) {
				  if (Object.prototype.hasOwnProperty.call(source, key)) {
					target[key] = source[key];
				  }
				}
			  }
			}
			return target;
		  };
		}
		/*var isIE = (document.all)?true:false;
		if(isIE == true)
			var stringdata = document.getElementById("json_string");
		else*/
		var stringdata = top.json_string;
		Object.assign(getdata,stringdata);//�ϲ�json
		function writeMeshTopoDetailTable()
		{
			//showOrHideLoadingWindowFromIframe("hide");
			
			var url_array=window.location.href.split("=");
			var router_index=parseInt(url_array[1]);
			//alert(router_index);
			var topo_info_array=getdata.topo_json;
			if(router_index<topo_info_array.length)
			{
				var dynamicHTML = '';
				var sta_array=topo_info_array[router_index].StaInfo;
				for(var i=0; i<sta_array.length; i++ )
				{
					if(''==sta_array[i].devname || ''==sta_array[i].ip)
						continue;
					dynamicHTML += "<tr height=30>";
					dynamicHTML += "<td align='center' class='topborderstyle'>"+ sta_array[i].devname + "</td>";
					dynamicHTML += "<td align='center' class='topborderstyle'>"+ sta_array[i].mac.toUpperCase()+"</td>";
					dynamicHTML += "<td align='center' class='topborderstyle'>"+ sta_array[i].ip + "</td>";
					if(sta_array[i].medium == "eth")
						dynamicHTML += "<td align='center' class='topborderstyle'>Wired</td><td align='center' class='topborderstyle'>--</td>";
					else 
					{
						dynamicHTML += "<td align='center' class='topborderstyle'>" + sta_array[i].medium + " WLAN</td>";
						if( parseInt(sta_array[i].rssi) == 0 )
							dynamicHTML += "<td align='center' class='topborderstyle'>--</td>";
						else if( parseInt(sta_array[i].rssi) > 0 )
							dynamicHTML += "<td align='center' class='topborderstyle'>" + "-" + sta_array[i].rssi + "dBm</td>";
						else 
							dynamicHTML += "<td align='center' class='topborderstyle'>" + sta_array[i].rssi + "dBm</td>";
					}
					if( parseInt(sta_array[i].phyrate) == 0 )
						dynamicHTML += "<td align='center' class='topborderstyle'>--</td>";
					else
						dynamicHTML += "<td align='center' class='topborderstyle'>"+ sta_array[i].phyrate + "Mbps</td>";
					if(sta_array[i].roamtime == "--")
						dynamicHTML += "<td align='center' class='topborderstyle'>"+ sta_array[i].roamtime + "</td>";
					else
						dynamicHTML += "<td align='center' class='topborderstyle'>"+ sta_array[i].roamtime + "ms</td>";
					dynamicHTML += "<td align='center' class='topborderstyle'>"+ sta_array[i].upstream + "kbps</td>";
					dynamicHTML += "<td align='center' class='topborderstyle'>"+ sta_array[i].downstream + "kbps</td>";
					dynamicHTML += "</tr>";
				}
			}
			//$("#sta_info_body").html(dynamicHTML);
			document.write(dynamicHTML);
		}
		</script>
	</head>

	<body style="background:#4acbd6;">
		<FORM METHOD="POST" ACTION="/cgi-bin/mesh_topo_detail.asp" name="cbi">
			<div id="pagestyle" style="width:870px !important">
				<div id="contenttype" style="width:865px !important">  
					<div id="div_MeshTopList" class="main_item">
						<table width="865px" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed; margin:5px 0;">
							<tr height="25px" style="background-color:#e6e6e6;">
									<td align=left class="title-main" style="width:845px;padding-left:20px;" id="MeshTopologyTip">
									The informations of the devices attached below.
									</td>
							</tr>
						</table>
						<table width="100%" bgcolor="#FFFFFF"  cellspacing="0" cellpadding="0" border="0px" style="table-layout:fixed;text-align:center;">
							<tr>
								<td align=left class="tabdata">
									<div class="configstyle" style="width:865px !important">
										<table border="0"  cellpadding="0" cellspacing="0" bordercolor="#CCCCCC" bgcolor="#FFFFFF" style="width:865px !important">
											<tr height="30px">
												<td class=tabdata align=center width="12%"><STRONG id="deviceName">Device Name</STRONG></td>
												<td class=tabdata align=center width="12%"><strong id="macText">MAC</strong></td> 
												<td class=tabdata align=center width="12%"><STRONG id="ipText">IP</STRONG></td>
												<td class=tabdata align=center width="10%"><STRONG id="accessModeText">Access Mode</STRONG></td>
												<td class=tabdata align=center width="10%"><STRONG id="signalStrengText">Signal Strength</STRONG></td>
												<td class=tabdata align=center width="10%"><STRONG id="phyRateText">Physical Rate</STRONG></td>
												<td class=tabdata align=center width="10%"><STRONG id="roamTime">Roaming Time</STRONG></td>
												<td class=tabdata align=center width="12%"><STRONG id="realtimeUpstrem">Real-time upstream</STRONG></td>
												<td class=tabdata align=center width="12%"><STRONG id="realtimeDownstrem">Real-time downstream</STRONG></td>
											</tr>
											<tbody id="mesh_topo_body">
												<script language="JavaScript" type="text/JavaScript">
													writeMeshTopoDetailTable();
												</script>
											</tbody>
										</table>
									</div>
								</td>                       
							</tr>
						</table>
					</div>
				</div>
			</div>
			<table width="690" border="0" cellpadding="0" cellspacing="0" id="table_isPONCASupported" style="display:none">
					<tr height="30">
							<td width="20">&nbsp;</td>
							<td width="250">&nbsp;</td>
							<td width="420"></td>
					</tr>
					<tr>
							<td align=center colSpan=3 style="background-color:transparent;font-family:'BeVietnamRegular',Be Vietnam;"><font size=2 id="CopyrightText"></font></td>
					</tr>
					<tr height="10">
							<td width="20">&nbsp;</td>
							<td width="250">&nbsp;</td>
							<td width="420"></td>
					</tr>
			</table>
		</form>
	</body>
</html>
