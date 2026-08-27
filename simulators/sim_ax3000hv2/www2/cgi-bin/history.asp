<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<style type="text/css">
*{color: #404040;}

.time-container {
    display: flex;
    justify-content: space-between;
    padding: 0 30px 0 60px;
	gap: 1px;
}

.time-date, .time-clock {
	width: 50%;
	text-align: left;
}
</style>

<script type="text/javascript" src="/spin.js" ></script>
<link rel="stylesheet" type="text/css" href="/style.css">
<SCRIPT language=javascript>
var reboot_record_num = "5";
var reboot_0_reason = "DGASP";
var reboot_0_time = "1970-01-01T07:13:42";
var reboot_1_reason = "DGASP";
var reboot_1_time = "1970-01-01T07:13:26";
var reboot_2_reason = "DGASP";
var reboot_2_time = "1970-01-01T07:13:29";
var reboot_3_reason = "DGASP";
var reboot_3_time = "1970-01-01T07:13:26";
var reboot_4_reason = "DGASP";
var reboot_4_time = "1970-01-01T07:13:28";
var upgrade_record_num = "0";
var radar_detect_record_num = "0";

/*radar_detect_record_num = "2";
var radar_detect_0_reason = "Radar Detected";
var radar_detect_0_time = "1970-01-01T07:05:25";
var radar_detect_0_radar_chan = "120";
var radar_detect_1_reason = "Radar Detected";
var radar_detect_1_time = "1970-01-01T07:04:56";
var radar_detect_1_radar_chan = "120";*/
//------reboot history
var rebootHistoryTable = [];
var index = 0;
var index_show = 1;
//for(index = 0; index < reboot_record_num; index++)
for(index = reboot_record_num-1; index >= 0 ; index--)//����
{
	if(typeof window['reboot_' + index + "_time"] !== 'undefined')
	{
		rebootHistoryTable.push([index_show,window['reboot_' + index + "_reason"],window['reboot_' + index + "_time"]]);
		index_show++;
	}
}

function reloadRebootMore()
{
	showTable('rebootHistoryList', tableHeader, rebootHistoryTable, 2, rebootHistoryTable.length);
	document.getElementById("more_reboot_button").style.display = "none";
	document.getElementById("less_reboot_button").style.display = "";
}

function reloadRebootLess()
{
	showTable('rebootHistoryList', tableHeader, rebootHistoryTable, 2, 10);
	document.getElementById("more_reboot_button").style.display = "";
	document.getElementById("less_reboot_button").style.display = "none";
}

//------upgrade history
var upgradeHistoryTable = [];
index = 0;
index_show = 1;
//for(index = 0; index < upgrade_record_num; index++)
for(index = upgrade_record_num-1; index >= 0 ; index--)//����
{
	if(typeof window['upgrade_' + index + "_time"] !== 'undefined')
	{
		upgradeHistoryTable.push([index_show,window['upgrade_' + index + "_reason"],window['upgrade_' + index + "_time"]]);
		index_show++;
	}
}

//------Radar Detect history
var radarDetectHistoryTable = [];
index = 0;
index_show = 1;
//for(index = 0; index < radar_detect_record_num; index++)
for(index = radar_detect_record_num-1; index >= 0 ; index--)//����
{
	if(typeof window['radar_detect_' + index + "_time"] !== 'undefined')
	{
		radarDetectHistoryTable.push([index_show,window['radar_detect_' + index + "_reason"],window['radar_detect_' + index + "_time"],window['radar_detect_' + index + "_radar_chan"]]);
		index_show++;
	}
}

function reloadUpgradeMore()
{
	showTable('upgradeHistoryList', tableHeader, upgradeHistoryTable, 2, upgradeHistoryTable.length);
	document.getElementById("more_upgrade_button").style.display = "none";
	document.getElementById("less_upgrade_button").style.display = "";
}

function reloadUpgradeLess()
{
	showTable('upgradeHistoryList', tableHeader, upgradeHistoryTable, 2, 10);
	document.getElementById("more_upgrade_button").style.display = "";
	document.getElementById("less_upgrade_button").style.display = "none";
}

//------common
function showTable(id,header,data,keyIndex,limit)
{
	var index = 0;
	var html = ["<table id=\"history_list\" border=0  cellpadding=1 cellspacing=0>"];

	// 1.generate table header
	html.push("<tr height=30px>");
	for(var i =0; i<header.length; i++){
		html.push("<td width=" + header[i][0] + " align=\"center\" class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +" </strong>"+ "</td>");
	}
	html.push("</tr>");
	// 2.generate table data
	for(var i=0; i<limit; i++){
		if(typeof(data[i][keyIndex]) != "undefined" && data[i][keyIndex] != "N/A"){
			index++;
			html.push("<tr height=30px>");
			for(var j=0; j<data[i].length; j++){
				if (j == 2) {
                    // �ָ�ʱ������
                    var timeParts = data[i][j].replace("T", " ").split(' ');
                    var datePart = timeParts[0] || '';
                    var timePart = timeParts[1] || '';
					html.push("<td align='center' class='topborderstyle'>" +
						"<div class='time-container'>" +
							"<span class='time-date'>" + datePart + "</span>" +
							"<span class='time-clock'>" + timePart + "</span>" +
						"</div>" +
						"</td>");
                } else {
                    html.push("<td align=\"center\" class=topborderstyle>" + data[i][j] + "</td>");
                }
			}
			html.push("</tr>");
		}
	}
	html.push("</table>");
	document.getElementById(id).innerHTML = html.join('');
}

const tableHeader = [
	["30%", "Index"],
	["30%", "Reason"],
	["40%", "Time"]
];

const tableHeaderRadarDetect = [
	["10%", "Index"],
	["25%", "Reason"],
	["40%", "Time"],
	["25%", "Radar channel"]
];

// ��ʼ����ʾ
function doLoad()
{
	//------reboot history
    const totalRebootRecords = rebootHistoryTable.length > 10 ? 10 : rebootHistoryTable.length;
    showTable('rebootHistoryList', tableHeader, rebootHistoryTable, 2, totalRebootRecords);
    
    // ���Ӱ�ť�������¼����10����
    if (reboot_record_num > 10) {
		document.getElementById("normal_reboot_button").style.display = "none";
        document.getElementById("more_reboot_button").style.display = "";
    } else {
		document.getElementById("normal_reboot_button").style.display = "";
		document.getElementById("more_reboot_button").style.display = "none";
	}
	document.getElementById("less_reboot_button").style.display = "none";
	
	//------upgrade history
	const totalUpgardeRecords = upgradeHistoryTable.length > 10 ? 10 : upgradeHistoryTable.length;
    showTable('upgradeHistoryList', tableHeader, upgradeHistoryTable, 2, totalUpgardeRecords);
    
    // ���Ӱ�ť�������¼����10����
    if (upgrade_record_num > 10) {
        document.getElementById("normal_upgrade_button").style.display = "none";
		document.getElementById("more_upgrade_button").style.display = "";
    } else {
		document.getElementById("normal_upgrade_button").style.display = "";
		document.getElementById("more_upgrade_button").style.display = "none";
	}
	document.getElementById("less_upgrade_button").style.display = "none"; 
	
	showTable('radarDetectList', tableHeaderRadarDetect, radarDetectHistoryTable, 2, radarDetectHistoryTable.length);
}

function Reload(){
	window.location.reload();
}
</SCRIPT>
</head>
<body onload="doLoad()">
<FORM METHOD="POST" ACTION="/cgi-bin/history.asp" name="history_form">
<div id="pagestyle">
	<div id="contenttype">
		<div id="block1" class="main_item">
			<table width="640px" border="0" cellpadding="0" cellspacing="0" class="tabdata" style="margin:5px 0px;">
				<tr height="25px" style="width:100%;background:#e6e6e6;">
					<td align="left" class="title-main" style="padding-left:20px;">Reboot History(total:
					<script>
						document.write(reboot_record_num)
					</script>
					)</td> 
				</tr>
			</table>
			<table width="600px" border="0" cellpadding="0" cellspacing="0">
				<tr>
					<td>
						<div id="rebootHistoryList"></div>
					</td>
				</tr>
			</table>
		</div>
		<div id="normal_reboot_button" class="main_item">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0">
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh records table.</td>
				</tr>
			</table>
			<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td align=left class="tabdata" style="padding-left:20px;">
						<input type="button" class="button1" onclick="Reload()" value="Refresh"></td>
					</td>
				</tr>
			</table>
		</div>
		<div id="more_reboot_button" class="main_item" style="display:none">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0">
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh records table.</td>
				</tr>
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "More" to view more records.</td>
				</tr>
			</table>
			<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td align=left class="tabdata" style="padding-left:20px;">
						<input type="button" class="button1" onclick="Reload()" value="Refresh">
						<input type="button" class="button1" onclick="reloadRebootMore()" value="More">
					</td>
				</tr>
			</table>
		</div>
		<div id="less_reboot_button" class="main_item" style="display:none">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0">
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh records table.</td>
				</tr>
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Less" to view the latest 10 records.</td>
				</tr>
			</table>
			<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td align=left class="tabdata" style="padding-left:20px;">
						<input type="button" class="button1" onclick="Reload()" value="Refresh">
						<input type="button" class="button1" onclick="reloadRebootLess()" value="Less">
					</td>
				</tr>
			</table>
		</div>
	</div>
</div>
<div id="pagestyle">
	<div id="contenttype">
		<div id="block1" class="main_item">
			<table width="640px" border="0" cellpadding="0" cellspacing="0" class="tabdata" style="margin:5px 0px;">
				<tr height="25px" style="width:100%;background:#e6e6e6;">
					<td align="left" class="title-main" style="padding-left:20px;">Upgrade History(total:
					<script>
						document.write(upgrade_record_num)
					</script>
					)</td> 
				</tr>
			</table>
			<table width="600px" border="0" cellpadding="0" cellspacing="0">
				<tr>
					<td>
						<div id="upgradeHistoryList"></div>
					</td>
				</tr>
			</table>
		</div>
		<div id="normal_upgrade_button" class="main_item">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0">
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh records table.</td>
				</tr>
			</table>
			<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td align=left class="tabdata" style="padding-left:20px;">
						<input type="button" class="button1" onclick="Reload()" value="Refresh"></td>
					</td>
				</tr>
			</table>
		</div>
		<div id="more_upgrade_button" class="main_item" style="display:none">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0">
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh records table.</td>
				</tr>
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "More" to view more records.</td>
				</tr>
			</table>
			<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td align=left class="tabdata" style="padding-left:20px;">
						<input type="button" class="button1" onclick="Reload()" value="Refresh">
						<input type="button" class="button1" onclick="reloadUpgradeMore()" value="More">
					</td>
				</tr>
			</table>
		</div>
		<div id="less_upgrade_button" class="main_item" style="display:none">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0">
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh records table.</td>
				</tr>
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Less" to view the latest 10 records.</td>
				</tr>
			</table>
			<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td align=left class="tabdata" style="padding-left:20px;">
						<input type="button" class="button1" onclick="Reload()" value="Refresh">
						<input type="button" class="button1" onclick="reloadUpgradeLess()" value="Less">
					</td>
				</tr>
			</table>
		</div>
	</div>
</div>
<div id="pagestyle">
	<div id="contenttype">
		<div id="block1" class="main_item">
			<table width="640px" border="0" cellpadding="0" cellspacing="0" class="tabdata" style="margin:5px 0px;">
				<tr height="25px" style="width:100%;background:#e6e6e6;">
					<td align="left" class="title-main" style="padding-left:20px;">Radar Detect History(total:
					<script>
						document.write(radar_detect_record_num)
					</script>
					)</td> 
				</tr>
			</table>
			<table width="600px" border="0" cellpadding="0" cellspacing="0">
				<tr>
					<td>
						<div id="radarDetectList"></div>
					</td>
				</tr>
			</table>
		</div>
		<div class="main_item">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0">
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh records table.</td>
				</tr>
			</table>
			<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td align=left class="tabdata" style="padding-left:20px;">
						<input type="button" class="button1" onclick="Reload()" value="Refresh"></td>
					</td>
				</tr>
			</table>
		</div>
	</div>
</div>

</form>
</body>
</html>
