<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=iso-8859-1">
<link rel="stylesheet" href="/style.css" type="text/css">
<script language="JavaScript" src="OutVariant.asp"></script>
<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" src="/jsl.js"></script>
<script language="JavaScript" src="/ip.js"></script>
<style  type="text/css">
*{color:  #404040;}

</style>

<script language="JavaScript">
function Reload(){
window.location.reload();

}

function showTable(id,header,data,keyIndex){
	var html = ["<table id=client_list border=0  cellpadding=1 cellspacing=0>"];
	// 1.generate table header
	html.push("<tr height=30px>");
	for(var i =0; i<header.length; i++){
		html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +" </strong>"+ "</td>");
	}
	html.push("</tr>");
	// 2.generate table data
	for(var i =0; i<data.length; i++)
	{
		   if(data[i][keyIndex] != "N/A")
		 {
			html.push("<tr height=30px>");
			for(var j=0; j<data[i].length; j++)
			{
				html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");
			}
			html.push("</tr>");
		}
	}
	html.push("</table>");
	if(parseInt(document.Devicetable.LeaseNum.value)>30)
	{	
		html.push('<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">');
		html.push("<tr height=30px>");
		html.push('<td align=left class="tabdata" style="padding-left:20px;">');
		html.push("<input type=button name=MORE class=button1 value=More... onClick=javascript:window.open(\"/cgi-bin/more_client_list.asp\")>");
		html.push("</td>");
		html.push("</tr>");
		html.push("</table>");
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
  		<td class="title-main" align=left style="padding-left:20px;">LAN Client List</td>
    </tr>	 
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr>
 <td align=left class="tabdata" >
 <div class="configstyle">
<INPUT type="HIDDEN" name="LeaseNum" value="1"><!--amy change DhcpLease to LanHost 20180322-->
 
 <div id=dhcpclientList></div>
 
		<script language=JavaScript>
var tableHeader = [
	["8%","Index"],
	["22%","Device Name"],
	["16%","IP Address"],
	["19%","MAC Address"],
	["19%","Connection Type"],	
	["16%","Expire Time"]
];

var tableData = [
	["1", "Unknown-D8:43:AE:2E:65:45","192.168.1.179","D8:43:AE:2E:65:45","Ethernet","0" + "days " + "<br />" + "0"],
	["2", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["3", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["4", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["5", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["6", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["7", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["8", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["9", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["10", "N/A","N/A","N/A","N/A","N/A" + "days "+ "<br />" + "N/A"],
	["11", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["12", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["13", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["14", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["15", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["16", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["17", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["18", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["19", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["20", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["21", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["22", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["23", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["24", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["25", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["26", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["27", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["28", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["29", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["30", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"]
];

		showTable('dhcpclientList',tableHeader,tableData,2);
	</script>
</div>		
</td>
</tr>	 
</table>
</div><!--id="block1" 12/11-->

<div id="button0">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
	<tr height="25px">		
		<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh device table</td>
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
