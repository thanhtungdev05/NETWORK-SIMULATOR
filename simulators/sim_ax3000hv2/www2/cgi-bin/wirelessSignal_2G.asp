<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<!--<script language="JavaScript" src="OutVariant.asp"></script>-->
<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" src="/jsl.js"></script>
<script language="JavaScript" src="/ip.js"></script>
<link rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">
*{color:  #404040;}
</style>

<script language="JavaScript">
//////
/*
var lanhost_0_hostname = "a_phone";//LanHost_Entry63 HostName
var lanhost_0_ip = "192.168.29.6";//LanHost_Entry63 IP
var lanhost_0_mac = "11:22:33:44:55:66";//LanHost_Entry63 MAC
var lanhost_1_hostname = "b_phone";//LanHost_Entry63 HostName
var lanhost_1_ip = "192.168.29.8";//LanHost_Entry63 IP
var lanhost_1_mac = "11:22:33:44:55:88";//LanHost_Entry63 MAC
var wifimactab_0_mac = "11:22:33:44:55:66";//wifiMacTab_Entry0 MAC
var wifimactab_0_band = "0";//wifiMacTab_Entry0 BAND
var wifimactab_0_rssi0 = "12";//wifiMacTab_Entry0 RSSI0
var wifimactab_0_rssi1 = "11";//wifiMacTab_Entry0 RSSI1
var wifimactab_1_mac = "11:22:33:44:55:88";//wifiMacTab_Entry0 MAC
var wifimactab_1_band = "1";//wifiMacTab_Entry0 BAND
var wifimactab_1_rssi0 = "14";//wifiMacTab_Entry0 RSSI0
var wifimactab_1_rssi1 = "13";//wifiMacTab_Entry0 RSSI1
var com_num0 = "1";//wifiMacTab_Common NUM0
var com_num1 = "1";//wifiMacTab_Common NUM1
*/
//////
var com_num0 = "0";
var com_num1 = "0";
var lanhost_0_hostname = "Unknown";
var lanhost_0_ip = "192.168.1.179";
var lanhost_0_mac = "D8:43:AE:2E:65:45";

function Reload()
{
	window.location.reload();
}

var lanHostTableData = [];
var index = 0;
for(index = 0; index < 64; index++)
{
	if(typeof window['lanhost_' + index + "_mac"] !== 'undefined')
	{
		lanHostTableData.push([window['lanhost_' + index + "_hostname"],window['lanhost_' + index + "_ip"],window['lanhost_' + index + "_mac"]]);
	}
	else
	{
		lanHostTableData.push(["N/A","N/A","N/A"]);
	}
}
/*var lanHostTableData = [
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
["","",""],
["","",""]
];*/

var wifiMacTabData = [];
var index = 0;
for(index = 0; index < 32; index++)
{
	if(typeof window['wifimactab_' + index + "_mac"] !== 'undefined')
	{
		wifiMacTabData.push([window['wifimactab_' + index + "_mac"],window['wifimactab_' + index + "_band"],window['wifimactab_' + index + "_rssi0"],window['wifimactab_' + index + "_rssi1"],window['wifimactab_' + index + "_tx_rate"],window['wifimactab_' + index + "_rx_rate"],window['wifimactab_' + index + "_ssid"],window['wifimactab_' + index + "_standards"]]);
	}
	else
	{
		wifiMacTabData.push(["N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"]);
	}
}
/*var wifiMacTabData = [
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],	
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""],
["","","",""]
];*/

var hostNameTable2 = [];
var IPTable2 = [];
var hostNameTable5 = [];
var IPTable5 = [];
//var wifiHostNum = "";
//var cnt = 0;

function getHostNameAndIPTable()
{
	for(var i =0; i<32; i++)
	{
		var mac = wifiMacTabData[i][0];
		var band = wifiMacTabData[i][1];
		if(mac == "N/A" || band == "N/A")
		{
			hostNameTable2[i] = "N/A";
			IPTable2[i] = "N/A";
			hostNameTable5[i] = "N/A";
			IPTable5[i] = "N/A";
			continue;
		}
		
		for(var j =0; j<64; j++)
		{
			if (lanHostTableData[j][1] == "N/A")
			{
				hostNameTable2[i] = "N/A";
				IPTable2[i] = "N/A";
				hostNameTable5[i] = "N/A";
				IPTable5[i] = "N/A";
				continue;
			}
			if(mac.toLowerCase() == lanHostTableData[j][2].toLowerCase())
			{
				if(band == "0")
				{
					hostNameTable2[i] = lanHostTableData[j][0];
					IPTable2[i] = lanHostTableData[j][1];
					hostNameTable5[i] = "N/A";
					IPTable5[i] = "N/A";
					//cnt = cnt + 1;
				}
				else
				{
					hostNameTable2[i] = "N/A";
					IPTable2[i] = "N/A";
					hostNameTable5[i] = lanHostTableData[j][0];
					IPTable5[i] = lanHostTableData[j][1];
					//cnt = cnt + 1;
				}
				break;
			}
		}
		if(j == 64)
		{
			hostNameTable2[i] = "N/A";
			IPTable2[i] = "N/A";
			hostNameTable5[i] = "N/A";
			IPTable5[i] = "N/A";
		}
		if(j == 64)
		{
			hostNameTable2[i] = "N/A";
			IPTable2[i] = "N/A";
			hostNameTable5[i] = "N/A";
			IPTable5[i] = "N/A";
		}
		//if(cnt == parseInt(wifiHostNum))
		//	break;
	}
}

function showTable0(id,header,data,keyIndex)
{
	var index = 1;
	var html = ["<table id=client_list border=0  cellpadding=1 cellspacing=0 style=\"width: 880px;\">"];

	// 1.generate table header
	html.push("<tr height=30px>");
	for(var i =0; i<header.length; i++){
		html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +" </strong>"+ "</td>");
	}
	html.push("</tr>");
	// 2.generate table data
	for(var i =0; i<data.length; i++){
		if(typeof(data[i][keyIndex]) != "undefined" && data[i][keyIndex] != "N/A"){
			html.push("<tr height=30px>");
			html.push("<td align=center class=topborderstyle>" + index + "</td>");
			index = index + 1;
			for(var j=1; j<data[i].length-1; j++){
				if(j==4)
					html.push("<td align=center class=topborderstyle>" + (parseInt(data[i][j])+parseInt(data[i][j+1]))/2 + "</td>");
				else if(j==3)
					html.push("<td align=center class=topborderstyle>" + data[i][j].toUpperCase() + "</td>");
				else if(j==5 || j==6 || j==7)
					html.push("<td align=center class=topborderstyle>" + data[i][j+1] + "</td>");
				else
					html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");
			}
			html.push("</tr>");
		}
	}
	html.push("</table>");

	document.getElementById(id).innerHTML = html.join('');
}
</script>
</head>

<body style="background:#4acbd6;">
<FORM METHOD="POST" ACTION="/cgi-bin/Devicetable.asp" name="Devicetable">
<div id="pagestyle" style="width: 888px;">
<div id="contenttype" style="width: 880px;">
<div id="block1" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;width: 880px;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td class="title-main" align=left style="padding-left:20px;">Wireless 2.4G RSSI Information</td>
	</tr>        
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;width: 880px;">
	<tr>
		<td align=left class="tabdata">
			<div class="configstyle">
			<input type="hidden" name="WIFILeaseNum" id="WIFILeaseNum">
			<script>
			document.getElementById("WIFILeaseNum").vlaue = com_num0;
			</script>
			<div id="RSSI2"></div>
			<script language=JavaScript>
			var tableHeader = [
				["6%","Index"],
				["16%","Device Name"],
				["16%","IP Address"],
				["20%","MAC Address"],
				["10%","RSSI"],
				["12%","Phyrate(Up/Down)"],
				["12%","SSID"],
				["8%","Standards"]
			];
			getHostNameAndIPTable();
			var tableData = [
				["1", hostNameTable2[0],IPTable2[0],wifiMacTabData[0][0],wifiMacTabData[0][2],wifiMacTabData[0][3],wifiMacTabData[0][4]+"/"+wifiMacTabData[0][5],wifiMacTabData[0][6],wifiMacTabData[0][7]],
				["2", hostNameTable2[1],IPTable2[1],wifiMacTabData[1][0],wifiMacTabData[1][2],wifiMacTabData[1][3],wifiMacTabData[1][4]+"/"+wifiMacTabData[1][5],wifiMacTabData[1][6],wifiMacTabData[1][7]],
				["3", hostNameTable2[2],IPTable2[2],wifiMacTabData[2][0],wifiMacTabData[2][2],wifiMacTabData[2][3],wifiMacTabData[2][4]+"/"+wifiMacTabData[2][5],wifiMacTabData[2][6],wifiMacTabData[2][7]],
				["4", hostNameTable2[3],IPTable2[3],wifiMacTabData[3][0],wifiMacTabData[3][2],wifiMacTabData[3][3],wifiMacTabData[3][4]+"/"+wifiMacTabData[3][5],wifiMacTabData[3][6],wifiMacTabData[3][7]],
				["5", hostNameTable2[4],IPTable2[4],wifiMacTabData[4][0],wifiMacTabData[4][2],wifiMacTabData[4][3],wifiMacTabData[4][4]+"/"+wifiMacTabData[4][5],wifiMacTabData[4][6],wifiMacTabData[4][7]],
				["6", hostNameTable2[5],IPTable2[5],wifiMacTabData[5][0],wifiMacTabData[5][2],wifiMacTabData[5][3],wifiMacTabData[5][4]+"/"+wifiMacTabData[5][5],wifiMacTabData[5][6],wifiMacTabData[5][7]],
				["7", hostNameTable2[6],IPTable2[6],wifiMacTabData[6][0],wifiMacTabData[6][2],wifiMacTabData[6][3],wifiMacTabData[6][4]+"/"+wifiMacTabData[6][5],wifiMacTabData[6][6],wifiMacTabData[6][7]],
				["8", hostNameTable2[7],IPTable2[7],wifiMacTabData[7][0],wifiMacTabData[7][2],wifiMacTabData[7][3],wifiMacTabData[7][4]+"/"+wifiMacTabData[7][5],wifiMacTabData[7][6],wifiMacTabData[7][7]],
				["9", hostNameTable2[8],IPTable2[8],wifiMacTabData[8][0],wifiMacTabData[8][2],wifiMacTabData[8][3],wifiMacTabData[8][4]+"/"+wifiMacTabData[8][5],wifiMacTabData[8][6],wifiMacTabData[8][7]],
				["10", hostNameTable2[9],IPTable2[9],wifiMacTabData[9][0],wifiMacTabData[9][2],wifiMacTabData[9][3],wifiMacTabData[9][4]+"/"+wifiMacTabData[9][5],wifiMacTabData[9][6],wifiMacTabData[9][7]],
				["11", hostNameTable2[10],IPTable2[10],wifiMacTabData[10][0],wifiMacTabData[10][2],wifiMacTabData[10][3],wifiMacTabData[10][4]+"/"+wifiMacTabData[10][5],wifiMacTabData[10][6],wifiMacTabData[10][7]],
				["12", hostNameTable2[11],IPTable2[11],wifiMacTabData[11][0],wifiMacTabData[11][2],wifiMacTabData[11][3],wifiMacTabData[11][4]+"/"+wifiMacTabData[11][5],wifiMacTabData[11][6],wifiMacTabData[11][7]],
				["13", hostNameTable2[12],IPTable2[12],wifiMacTabData[12][0],wifiMacTabData[12][2],wifiMacTabData[12][3],wifiMacTabData[12][4]+"/"+wifiMacTabData[12][5],wifiMacTabData[12][6],wifiMacTabData[12][7]],
				["14", hostNameTable2[13],IPTable2[13],wifiMacTabData[13][0],wifiMacTabData[13][2],wifiMacTabData[13][3],wifiMacTabData[13][4]+"/"+wifiMacTabData[13][5],wifiMacTabData[13][6],wifiMacTabData[13][7]],
				["15", hostNameTable2[14],IPTable2[14],wifiMacTabData[14][0],wifiMacTabData[14][2],wifiMacTabData[14][3],wifiMacTabData[14][4]+"/"+wifiMacTabData[14][5],wifiMacTabData[14][6],wifiMacTabData[14][7]],
				["16", hostNameTable2[15],IPTable2[15],wifiMacTabData[15][0],wifiMacTabData[15][2],wifiMacTabData[15][3],wifiMacTabData[15][4]+"/"+wifiMacTabData[15][5],wifiMacTabData[15][6],wifiMacTabData[15][7]],
				["17", hostNameTable2[16],IPTable2[16],wifiMacTabData[16][0],wifiMacTabData[16][2],wifiMacTabData[16][3],wifiMacTabData[16][4]+"/"+wifiMacTabData[16][5],wifiMacTabData[16][6],wifiMacTabData[16][7]],
				["18", hostNameTable2[17],IPTable2[17],wifiMacTabData[17][0],wifiMacTabData[17][2],wifiMacTabData[17][3],wifiMacTabData[17][4]+"/"+wifiMacTabData[17][5],wifiMacTabData[17][6],wifiMacTabData[17][7]],
				["19", hostNameTable2[18],IPTable2[18],wifiMacTabData[18][0],wifiMacTabData[18][2],wifiMacTabData[18][3],wifiMacTabData[18][4]+"/"+wifiMacTabData[18][5],wifiMacTabData[18][6],wifiMacTabData[18][7]],
				["20", hostNameTable2[19],IPTable2[19],wifiMacTabData[19][0],wifiMacTabData[19][2],wifiMacTabData[19][3],wifiMacTabData[19][4]+"/"+wifiMacTabData[19][5],wifiMacTabData[19][6],wifiMacTabData[19][7]],
				["21", hostNameTable2[20],IPTable2[20],wifiMacTabData[20][0],wifiMacTabData[20][2],wifiMacTabData[20][3],wifiMacTabData[20][4]+"/"+wifiMacTabData[20][5],wifiMacTabData[20][6],wifiMacTabData[20][7]],
				["22", hostNameTable2[21],IPTable2[21],wifiMacTabData[21][0],wifiMacTabData[21][2],wifiMacTabData[21][3],wifiMacTabData[21][4]+"/"+wifiMacTabData[21][5],wifiMacTabData[21][6],wifiMacTabData[21][7]],
				["23", hostNameTable2[22],IPTable2[22],wifiMacTabData[22][0],wifiMacTabData[22][2],wifiMacTabData[22][3],wifiMacTabData[22][4]+"/"+wifiMacTabData[22][5],wifiMacTabData[22][6],wifiMacTabData[22][7]],
				["24", hostNameTable2[23],IPTable2[23],wifiMacTabData[23][0],wifiMacTabData[23][2],wifiMacTabData[23][3],wifiMacTabData[23][4]+"/"+wifiMacTabData[23][5],wifiMacTabData[23][6],wifiMacTabData[23][7]],
				["25", hostNameTable2[24],IPTable2[24],wifiMacTabData[24][0],wifiMacTabData[24][2],wifiMacTabData[24][3],wifiMacTabData[24][4]+"/"+wifiMacTabData[24][5],wifiMacTabData[24][6],wifiMacTabData[24][7]],
				["26", hostNameTable2[25],IPTable2[25],wifiMacTabData[25][0],wifiMacTabData[25][2],wifiMacTabData[25][3],wifiMacTabData[25][4]+"/"+wifiMacTabData[25][5],wifiMacTabData[25][6],wifiMacTabData[25][7]],
				["27", hostNameTable2[26],IPTable2[26],wifiMacTabData[26][0],wifiMacTabData[26][2],wifiMacTabData[26][3],wifiMacTabData[26][4]+"/"+wifiMacTabData[26][5],wifiMacTabData[26][6],wifiMacTabData[26][7]],
				["28", hostNameTable2[27],IPTable2[27],wifiMacTabData[27][0],wifiMacTabData[27][2],wifiMacTabData[27][3],wifiMacTabData[27][4]+"/"+wifiMacTabData[27][5],wifiMacTabData[27][6],wifiMacTabData[27][7]],
				["29", hostNameTable2[28],IPTable2[28],wifiMacTabData[28][0],wifiMacTabData[28][2],wifiMacTabData[28][3],wifiMacTabData[28][4]+"/"+wifiMacTabData[28][5],wifiMacTabData[28][6],wifiMacTabData[28][7]],
				["30", hostNameTable2[29],IPTable2[29],wifiMacTabData[29][0],wifiMacTabData[29][2],wifiMacTabData[29][3],wifiMacTabData[29][4]+"/"+wifiMacTabData[29][5],wifiMacTabData[29][6],wifiMacTabData[29][7]],
				["31", hostNameTable2[30],IPTable2[30],wifiMacTabData[30][0],wifiMacTabData[30][2],wifiMacTabData[30][3],wifiMacTabData[30][4]+"/"+wifiMacTabData[30][5],wifiMacTabData[30][6],wifiMacTabData[30][7]],
				["32", hostNameTable2[31],IPTable2[31],wifiMacTabData[31][0],wifiMacTabData[31][2],wifiMacTabData[31][3],wifiMacTabData[31][4]+"/"+wifiMacTabData[31][5],wifiMacTabData[31][6],wifiMacTabData[31][7]]
			];

			showTable0('RSSI2',tableHeader,tableData,2);
			</script>
</div>
</td>
</tr>    
</table>
</div><!--id="block1" 12/11-->
<div id="button0" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
	<tr height="25px">
		<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh wireless signal</td>
	</tr>
</table>

<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
<tr height="30px">
<td align=left class="tabdata" style="padding-left:20px;">
<input type="button" class="button1" onclick="Reload()" value="Refresh"></td>
</tr>
</table>
</div>
</div><!--id="contenttype"-->
</div><!--id="pagestyle"-->
 </FORM>
</body></html>
