


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
	<style  type="text/css">
		*{color:  #404040;}
	</style>

	<script type="text/javascript" src="/spin.js" ></script>
	<link rel="stylesheet" type="text/css" href="/style.css">
<script language="JavaScript">
//////
/*
var info_curChannel = "6";//Info_WLan CurrentChannel
var info_curChannel_5G = "36";//Info_WLan11ac CurrentChannel
//wifictl.wifi_diagnose.ch_num_2g
var ch_num_2g = "2";//WifiDiagnose_Common ChNum2G
//wifictl.wifi_diagnose.ch_num_5g
var ch_num_5g = "5";//WifiDiagnose_Common ChNum5G
//wifictl.wifi_diagnose.autodiag_enable
var diag_auto_enable = "1";//WifiDiagnose_AutoDiagnose Enable
//wifictl.wifi_diagnose.autodiag_time
var diag_auto_time = "60";//WifiDiagnose_AutoDiagnose Time
//wifictl.wifi_diagnose.state
var diag_state = "Finished";//WifiDiagnose_Common State
//wifictl.wifidiag_entry0.ch
var diag_entry0_ch = "6";//WifiDiagnose_Entry0 Ch
//wifictl.wifidiag_entry0.congestion
var diag_entry0_cong = "13";//WifiDiagnose_Entry0 Congestion
//wifictl.wifidiag_entry0.interference
var diag_entry0_inter = "15";//WifiDiagnose_Entry0 Interference
var diag_entry1_ch = "36";
var diag_entry1_cong = "13";
var diag_entry1_inter = "15";
*/
//////
var info_curChannel = "7";
var info_curChannel_5G = "116";
var ch_num_2g = "0";
var ch_num_5g = "0";
var diag_auto_enable = "0";
var diag_auto_time = "3:00";
var diag_state = "None";

function showSpin(){
        var opts = {
                  lines: 8, // The number of lines to draw
                  length: 0, // The length of each line
                  width: 6, // The line thickness
                  radius: 7, // The radius of the inner circle
                  scale: 1, // Scales overall size of the spinner
                  corners: 1, // Corner roundness (0..1)
                  color: '#999999', // CSS color or array of colors
                  fadeColor: '#transparent', // CSS color or array of colors
                  speed: 1.1, // Rounds per second
                  rotate: 0, // The rotation offset
                  animation: 'spinner-line-fade-quick', // The CSS animation name for the lines
                  direction: 1, // 1: clockwise, -1: counterclockwise
                  zIndex: 2e9, // The z-index (defaults to 2000000000)
                  className: 'spinner', // The CSS class to assign to the spinner
                  top: '50%', // Top position relative to parent
                  left: '50%', // Left position relative to parent
                  shadow:false, // Box-shadow for the lines
                  position: 'absolute' // Element positioning
                };

var target = document.getElementById('firstDiv');
var spinner = new Spinner(opts).spin(target);
}

var ChNum2G = ch_num_2g;
var ChNum5G = ch_num_5g;
var state = diag_state;

function HiddenOptimizeTimer(){
	if(document.wifi_diagnose.autoOptimize_enable[0].checked)
		document.getElementById("hiddentimer").style.display="";
	else
		document.getElementById("hiddentimer").style.display="none";
	if(state == "Waiting")
	{
		document.getElementById("diagnose_result").style.display="none";
		document.getElementById("diagnose_result_tip").style.display="";
		document.getElementById("diagnose_wait_result").style.display = "";
	}
	else if(state == "Finished")
	{
		document.getElementById("diagnose_result").style.display="";
		document.getElementById("diagnose_result_tip").style.display="";
		document.getElementById("diagnose_wait_result").style.display = "none";
	}
	else
	{
		document.getElementById("diagnose_result").style.display="none";
		document.getElementById("diagnose_result_tip").style.display="none";
		document.getElementById("diagnose_wait_result").style.display = "none";
	}
}

function Timenumber()
{
	var timenum=document.wifi_diagnose.time.value;
	var Stimedigits = timenum.split(":");
	var Stimenum1=Number(Stimedigits[0]);
	var Stimenum2=Number(Stimedigits[1]);
	if(document.wifi_diagnose.autoOptimize_enable[0].checked)
	{
		if(timenum.indexOf(":")==-1)
		{
			alert("Invalid time!");
			return false;
		}
		if(!((Stimenum1>=0&&Stimenum1<=23)&&(Stimenum2>=0&&Stimenum2<=59)))
		{
			alert("Invalid time!");
			return false;
		}
	}
	return true;
}

function uiSave()
{
	if(Timenumber()==false)
		return;
	showSpin();
	document.wifi_diagnose.saveFlag.value=1;
	document.wifi_diagnose.submit();
}

function uiOptimize()
{
	showSpin();
	document.wifi_diagnose.optimizeFlag.value=1;
	document.wifi_diagnose.submit();
}

function uiDiagnose()
{
	if(confirm("Diagnostic operation may cause some wifi connections to be reconnected, please confirm whether to operate.") == false)
		return false;
	showSpin();
	document.wifi_diagnose.diagnoseFlag.value=1;
	document.wifi_diagnose.submit();
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

function popup_topo_detail_2g(topo_index)
{
	openWindow('wirelessSignal_2G.asp?index='+topo_index, '2.4G Sta Infos', 900, 500);
}

function popup_topo_detail_5g(topo_index)
{
	openWindow('wirelessSignal_5G.asp?index='+topo_index, '5G Sta Infos', 900, 500);
}

var CurrentChannel_2G = info_curChannel;
var CurrentChannel_5G = info_curChannel_5G;
var wifiDiagnosticTable = [];
var index = 0;
for(index = 0; index < 32; index++)
{
	if(typeof window['diag_entry' + index + "_ch"] !== 'undefined')
	{
		wifiDiagnosticTable.push([window['diag_entry' + index + "_ch"],window['diag_entry' + index + "_cong"],window['diag_entry' + index + "_inter"]]);
	}
}
/*var wifiDiagnosticTable = [
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],	
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""],
["","",""]
];*/

function showTable(id,header,data,keyIndex)
{
	var index = 0;
	var html = ["<table id=client_list border=0  cellpadding=1 cellspacing=0>"];

	// 1.generate table header
	html.push("<tr height=30px>");
	for(var i =0; i<header.length; i++){
		html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +" </strong>"+ "</td>");
	}
	html.push("</tr>");
	// 2.generate table data
	for(var i=0; i<data.length; i++){
		if(typeof(data[i][keyIndex]) != "undefined" && data[i][keyIndex] != "N/A"){
			index++;
			html.push("<tr height=30px>");
			for(var j=0; j<data[i].length; j++){
				html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");
			}
			if(data[i][keyIndex] == CurrentChannel_2G)
			{
				var dynamicHTML = "<td align='center' class='topborderstyle'><input type='button' style='font-size:13px;line-height:18px;cursor:pointer;' value='View the RSSI infos' id='topo_detail' onclick='popup_topo_detail_2g(" + i + ")'> </td></tr>";
				html.push(dynamicHTML);
			}
			else if(data[i][keyIndex] == CurrentChannel_5G)
			{
				var dynamicHTML = "<td align='center' class='topborderstyle'><input type='button' style='font-size:13px;line-height:18px;cursor:pointer;' value='View the RSSI infos' id='topo_detail' onclick='popup_topo_detail_5g(" + i + ")'> </td></tr>";
				html.push(dynamicHTML);
			}
			else
			{
				html.push("<td align=center class=topborderstyle>--</td>");
			}
			html.push("</tr>");
		}
		if(index >= parseInt(ChNum2G) + parseInt(ChNum5G))
		break;
	}
	html.push("</table>");
	document.getElementById(id).innerHTML = html.join('');
}

</script>
</head>

<body onLoad="HiddenOptimizeTimer()" style="background:#4acbd6;">
<FORM METHOD="POST" ACTION="/cgi-bin/wifi_diagnose.asp" name="wifi_diagnose">
<div id="pagestyle">
<div id="contenttype">  
		<div id="block1" class="main_item">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed; margin:5px 0;">
				<tr height="25px" style="background-color:#e6e6e6;">
					<td align=left class="title-main" style="width:620px;padding-left:20px;">
						Auto-Optimize
					</td>
				</tr>
			</table>

			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
				<tr height="30px">
					<td align=left class="tabdata" style="width:250px;padding-left:20px;">Auto-Optimize</td>
					<td align=left class="tabdata">
						<input type="radio" name="autoOptimize_enable" value="1" onClick="HiddenOptimizeTimer();"> Enable&nbsp;&nbsp;&nbsp;&nbsp;         
						<input type="radio" name="autoOptimize_enable" value="0" onClick="HiddenOptimizeTimer();"> Disable
						<script>
						if (diag_auto_enable == "1") {
							document.getElementsByName("autoOptimize_enable")[0].checked = true;
							document.getElementsByName("autoOptimize_enable")[1].checked = false;
						} else {
							document.getElementsByName("autoOptimize_enable")[0].checked = false;
							document.getElementsByName("autoOptimize_enable")[1].checked = true;
						}
					</script>
					</td>
				</tr>
			</table>
		</div>

		<div id="block1">
			<div id="hiddentimer" class="main_item">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed; margin:5px 0;">
				<tr height="25px" style="background-color:#e6e6e6;">
					<td align=left class="title-main" style="width:620px;padding-left:20px;">
						Auto-Optimize Time Setting
					</td>
				</tr>
			</table>

			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
				<tr height="30px">
					<td align=left class="tabdata" style="width:250px;padding-left:20px;">Auto-Optimize Time</td>
					<td align=left class="tabdata">
						<input type="text" name="time" id="time" size="7" maxlength="5">(hour:min)
						<script>
							document.getElementById("time").value = diag_auto_time;
						</script>
					</td>
				</tr>
			</table>
			</div>
		</div>

		<div id="button0" class="main_item">
		<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
			<tr height="25px">
				<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
					Click "Diagnose" to start a WiFi full channel scan and diagnostics
				</td>
			</tr>
			<tr height="25px">
				<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
					Click "Optimize" to optimize WiFi to the optimal channel
				</td>
			</tr>
			<tr height="25px">
				<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
					Click "Save Auto-Optimize Setting" to save the Auto-Optimize settings
				</td>
			</tr>
		</table>

		<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
			<tr height="40px">
				<td align=left class="tabdata" style="width:50px;padding-left:20px;">
					<input type="hidden" name="diagnoseFlag" value="0">
					<input type="button" class="button1" name="DiagnoseBtn" id="DiagnoseBtn" value="Diagnose" onClick="uiDiagnose()">
					<script>
					if(diag_state == "Waiting")
					{
						document.getElementById("DiagnoseBtn").value = "Diagnosing";
						document.getElementById("DiagnoseBtn").style.background = "gray";
						document.getElementById("DiagnoseBtn").style.border = "gray";
						document.getElementById("DiagnoseBtn").disabled = true;
					}
					else
					{
						document.getElementById("DiagnoseBtn").value = "Diagnose";
						document.getElementById("DiagnoseBtn").style.background = "";
						document.getElementById("DiagnoseBtn").style.border = "";
						document.getElementById("DiagnoseBtn").disabled = false;
					}
					</script>
				</td>
				<td align=left class="tabdata" style="width:50px;padding-left:20px;">
					<input type="hidden" name="optimizeFlag" value="0">
					<input type="button" class="button1" name="OptimizeBtn" value="Optimize" onClick="uiOptimize()"> 
				</td>
				<td align=left class="tabdata" style="width:50px;padding-left:20px;">
					<input type="hidden" name="saveFlag" value="0">
					<input type="button" class="button1" name="SaveBtn" value="Save Auto-Optimize Setting" onClick="uiSave()">
				</td>
				<td id="firstDiv" style="float:left;"></td>
			</tr>
		</table>
		</div>
		<div id="diagnose_result_tip" class="main_item">
		<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed; margin:5px 0;">
			<tr height="25px" style="background-color:#e6e6e6;">
				<td align=left class="title-main" style="width:620px;padding-left:20px;">
					WiFi Diagnostic Result
				</td>
			</tr>
		</table>
		</div>
		<div id="diagnose_wait_result" class="main_item">
		<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
			<tr height="25px">
				<td align=left style="padding-left:20px;white-space:nowrap;color:red;font-size:13px;">
					WiFi diagnosing,please wait 7 seconds to refresh to get the result......
				</td>
			</tr>
		</table>
		</div>
		<div id="diagnose_result" class="main_item" style="display:none">
		<script language=JavaScript>
			var tableHeader = [
			//["8%","Index"],
			["22%","Channel"],
			["18%","Congestion"],
			["24%","Interference"],
			["14%","RSSI"]
			];

			showTable('diagnose_result',tableHeader,wifiDiagnosticTable,0);
			</script>
		</div>
	</div>
</div>
</form>
</body>
</html>
