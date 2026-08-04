<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=iso-8859-1">
<link rel="stylesheet" href="/style.css" type="text/css">

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
	
	document.getElementById(id).innerHTML = html.join('');
}


 </script>
 
</head>

<body>
<FORM METHOD="POST" ACTION="/cgi-bin/EthernetStatus.asp" name="Devicetable">
<div id="pagestyle"><!--cindy add for border 11/28-->
<div id="contenttype">
<div id="block1">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
  		<td class="title-main" align=left style="padding-left:20px;">Ethernet Status</td>
    </tr>	 
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr>
 <td align=left class="tabdata" >
 <div class="configstyle">

 <div id="ethernetstatus"></div>
 
		<script language=JavaScript>
var tableHeader = [
	["8%","Port"],
	["22%","Admin State"],
	["26%","Connection Speed"],
	["22%","Packets Sent"],
	["22%","Packets Received"]
];

var tableData = [
	["1", "Enable","Disconnected","N/A","N/A"],
	["2", "Enable","1000M FULL","2863","4683"],
	["3", "Enable","Disconnected","N/A","N/A"],
	["4", "Enable","Disconnected","N/A","N/A"]
	
];

		showTable('ethernetstatus',tableHeader,tableData,1);
	</script>
</div>		
</td>
</tr>	 
</table>
</div><!--id="block1" 12/11-->

<div id="button0">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
	<tr height="25px">		
		<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh Ethernet Status</td>
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
