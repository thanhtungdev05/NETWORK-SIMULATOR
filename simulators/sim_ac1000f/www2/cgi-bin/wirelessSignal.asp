<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" href="/style.css" type="text/css">
<script language="JavaScript" src="OutVariant.asp"></script>
<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" src="/jsl.js"></script>
<script language="JavaScript" src="/ip.js"></script>
<style  type="text/css">
*{color:  #404040;}

#positionstyle
{
margin-left:20px;
}
</style>

<script language="JavaScript">
function Reload(){
window.location.reload();

}

function showTable0(id,header,data,keyIndex){
	var html = ["<table id=client_list border=0  cellpadding=1 cellspacing=0>"];
	
	// 1.generate table header
	html.push("<tr height=30px>");
	for(var i =0; i<header.length; i++){
		html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +" </strong>"+ "</td>");
	}
	html.push("</tr>");
	// 2.generate table data
	for(var i =0; i<data.length; i++){
		if(data[i][keyIndex] != "N/A"){
			html.push("<tr height=30px>");
			for(var j=0; j<data[i].length; j++){
				html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");
			}
			html.push("</tr>");
		}
	}
	html.push("</table>");
	if(parseInt(document.Devicetable.WIFILeaseNum.value)>30)
	{
		html.push("<div id=positionstyle>");
		html.push("<input type=button name=MORE class=button1 value=More... onClick=javascript:window.open(\"/cgi-bin/more_rssi_list_2.asp\")>");
		html.push("</div>");
	}

	document.getElementById(id).innerHTML = html.join('');
}


function showTable1(id,header,data,keyIndex){
	var html = ["<table id=client_list border=0  cellpadding=1 cellspacing=0>"];
	
	// 1.generate table header
	html.push("<tr height=30px>");
	for(var i =0; i<header.length; i++){
		html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +" </strong>"+ "</td>");
	}
	html.push("</tr>");
	// 2.generate table data
	for(var i =0; i<data.length; i++){
		if(data[i][keyIndex] != "N/A"){
			html.push("<tr height=30px>");
			for(var j=0; j<data[i].length; j++){
				html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");
			}
			html.push("</tr>");
		}
	}
	html.push("</table>");
	if(parseInt(document.Devicetable.WIFI5GLeaseNum.value)>30)
	{
		html.push("<div id=positionstyle>");
		html.push("<input type=button name=MORE class=button1 value=More... onClick=javascript:window.open(\"/cgi-bin/more_rssi_list_5.asp\")>")
		html.push("</div>");
	}

	document.getElementById(id).innerHTML = html.join('');
}

 </script>
 
</head>

<body>
<FORM METHOD="POST" ACTION="/cgi-bin/Devicetable.asp" name="Devicetable">
<div id="pagestyle"><!--cindy add for border 11/28-->
<div id="contenttype">
<div id="block1">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">  
		<td class="title-main" align=left style="padding-left:20px;">Wireless 2.4G RSSI Information</td>
    </tr>	 
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr>
 <td align=left class="tabdata">
 <div class="configstyle">
 <INPUT type="HIDDEN" name="WIFILeaseNum" value="0">
 <div id="RSSI2"></div>
	<script language=JavaScript>
	var tableHeader = [
	["8%","Index"],
	["22%","Device Name"],
	["18%","IP Address"],
	["24%","MAC Address"],
	["14%","RSSI1"],	
	["14%","RSSI2"]
	];


	var tableData = [
	["1", "N/A","N/A","N/A","N/A","N/A"],
	["2", "N/A","N/A","N/A","N/A","N/A"],
	["3", "N/A","N/A","N/A","N/A","N/A"],
	["4", "N/A","N/A","N/A","N/A","N/A"],
	["5", "N/A","N/A","N/A","N/A","N/A"],
	["6", "N/A","N/A","N/A","N/A","N/A"],
	["7", "N/A","N/A","N/A","N/A","N/A"],
	["8", "N/A","N/A","N/A","N/A","N/A"],
	["9", "N/A","N/A","N/A","N/A","N/A"],
	["10", "N/A","N/A","N/A","N/A","N/A"],
	["11", "N/A","N/A","N/A","N/A","N/A"],
	["12", "N/A","N/A","N/A","N/A","N/A"],
	["13", "N/A","N/A","N/A","N/A","N/A"],
	["14", "N/A","N/A","N/A","N/A","N/A"],
	["15", "N/A","N/A","N/A","N/A","N/A"],
	["16", "N/A","N/A","N/A","N/A","N/A"],
	["17", "N/A","N/A","N/A","N/A","N/A"],
	["18", "N/A","N/A","N/A","N/A","N/A"],
	["19", "N/A","N/A","N/A","N/A","N/A"],
	["20", "N/A","N/A","N/A","N/A","N/A"],
	["21", "N/A","N/A","N/A","N/A","N/A"],
	["22", "N/A","N/A","N/A","N/A","N/A"],
	["23", "N/A","N/A","N/A","N/A","N/A"],
	["24", "N/A","N/A","N/A","N/A","N/A"],
	["25", "N/A","N/A","N/A","N/A","N/A"],
	["26", "N/A","N/A","N/A","N/A","N/A"],
	["27", "N/A","N/A","N/A","N/A","N/A"],
	["28", "N/A","N/A","N/A","N/A","N/A"],
	["29", "N/A","N/A","N/A","N/A","N/A"],
	["30", "N/A","N/A","N/A","N/A","N/A"]	
	];

		showTable0('RSSI2',tableHeader,tableData,2);
	</script>
</div>
</td>
</tr>	 
</table>
</div><!--id="block1" 12/11-->

<div id="block1">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">    
		<td class="title-main" align=left style="padding-left:20px;"> Wireless 5G RSSI Information</td>
    </tr>	 
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr>
 <td align=left class="tabdata">
 <div class="configstyle">
 <INPUT type="HIDDEN" name="WIFI5GLeaseNum" value="0">
 <div id="RSSI5"></div>
	<script language=JavaScript>
	var tableHeader5g = [
	["8%","Index"],
	["22%","Device Name"],
	["18%","IP Address"],
	["24%","MAC Address"],
	["14%","RSSI1"],	
	["14%","RSSI2"]
	];

	var tableData5g = [
	["1", "N/A","N/A","N/A","N/A","N/A"],
	["2", "N/A","N/A","N/A","N/A","N/A"],
	["3", "N/A","N/A","N/A","N/A","N/A"],
	["4", "N/A","N/A","N/A","N/A","N/A"],
	["5", "N/A","N/A","N/A","N/A","N/A"],
	["6", "N/A","N/A","N/A","N/A","N/A"],
	["7", "N/A","N/A","N/A","N/A","N/A"],
	["8", "N/A","N/A","N/A","N/A","N/A"],
	["9", "N/A","N/A","N/A","N/A","N/A"],
	["10", "N/A","N/A","N/A","N/A","N/A"],
	["11", "N/A","N/A","N/A","N/A","N/A"],
	["12", "N/A","N/A","N/A","N/A","N/A"],
	["13", "N/A","N/A","N/A","N/A","N/A"],
	["14", "N/A","N/A","N/A","N/A","N/A"],
	["15", "N/A","N/A","N/A","N/A","N/A"],
	["16", "N/A","N/A","N/A","N/A","N/A"],
	["17", "N/A","N/A","N/A","N/A","N/A"],
	["18", "N/A","N/A","N/A","N/A","N/A"],
	["19", "N/A","N/A","N/A","N/A","N/A"],
	["20", "N/A","N/A","N/A","N/A","N/A"],
	["21", "N/A","N/A","N/A","N/A","N/A"],
	["22", "N/A","N/A","N/A","N/A","N/A"],
	["23", "N/A","N/A","N/A","N/A","N/A"],
	["24", "N/A","N/A","N/A","N/A","N/A"],
	["25", "N/A","N/A","N/A","N/A","N/A"],
	["26", "N/A","N/A","N/A","N/A","N/A"],
	["27", "N/A","N/A","N/A","N/A","N/A"],
	["28", "N/A","N/A","N/A","N/A","N/A"],
	["29", "N/A","N/A","N/A","N/A","N/A"],
	["30", "N/A","N/A","N/A","N/A","N/A"]
	];

		showTable1('RSSI5',tableHeader5g,tableData5g,2);
	</script>
</div>
</td>
</tr>	 
</table>
</div><!--id="block1" 12/11-->

<div id="button0">
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

	
               <table width="690" border="0" cellpadding="0" cellspacing="0">
	        	<tr height="30">
				<td width="20">&nbsp;</td>
				<td width="250">&nbsp;</td>
				<td width="420"></td>
			</tr>	
			<tr>
				<td align=center colSpan=3 style="background-color:transparent;font-family: Arial,Helvetica,sans-serif;"><font size=2>Copyright © 2019 FPT. All Rights Reserved.   </font></td>
			</tr>
			<tr height="10">
		        	<td width="20">&nbsp;</td>
				<td width="250">&nbsp;</td>
				<td width="420"></td>
			</tr>	
		</table>
	
 </FORM>
</body></html>
