<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css">

<style type="text/css">
.button2
{
display:inline-block;
cursor:pointer;
color:#fff;
font:bold 15px Arial,Verdana,sans-serif;
margin:10px;
padding:3px 8px;
line-height:normal;
*overflow:visible ;
text-align:center;
text-decoration:none;
position:relative;
background:#38a7dc;
border:1px solid #38a7dc;
outline:0;
}

#positionstyle
{
text-align:center;
}

#wrapper{
margin:20px auto;
width:660px;
background:#FFFFFF;
padding:10px 20px;
}

</style>

<script language="JavaScript">

function showTable(id,header,data,keyIndex){
	var html = [""];
	html.push("<table  width=660 border=1 align=center cellpadding=1 cellspacing=0  bordercolor=#CCCCCC bgcolor=#FFFFFF>");
	
	// 1.generate table header
	html.push("<tr height=30px>");
	for(var i =0; i<header.length; i++){
		html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +"</font></strong>"+ "</td>");
	}
	html.push("</tr>");
	// 2.generate table data
	for(var i =0; i<data.length; i++){
		if(data[i][keyIndex] != "N/A"){
			html.push("<tr height=30px>");
			for(var j=0; j<data[i].length; j++){
				html.push("<td align=center class=tabdata>" + data[i][j] + "</td>");
			}
			html.push("</tr>");
		}
	}
	html.push("</table>");
	
	html.push("<div id=positionstyle>");
	html.push("<input type=button name=MORE class=button2 value=\" 1 \" onClick=javascript:window.location=\'/cgi-bin/more_rssi_list_2.asp\'>");
	html.push("</div>");

	document.getElementById(id).innerHTML = html.join('');
}
</script>

</head>
<body>
<FORM METHOD="POST" ACTION="/cgi-bin/more_rssi_list_2.asp" name="rssi_client_list">

<div id="wrapper">
<INPUT type="HIDDEN" name="LeaseNum" value="0">
<table width="660px" border="0" style="table-layout: fixed;" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" id="uiViewBodyTable">
  
  <tr height="30px">
  	<td class="title-main" align=left style="white-space:nowrap;">
  	Wireless 2.4G RSSI Information</td>
  </tr>	 
</table>
  
<table width="660" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr id="buttoncolor">
 <td align=left class="tabdata">
	<div id=rssiclientList></div>
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
	["31", "N/A","N/A","N/A","N/A","N/A"],
	["32", "N/A","N/A","N/A","N/A","N/A"],
	["33", "N/A","N/A","N/A","N/A","N/A"],
	["34", "N/A","N/A","N/A","N/A","N/A"],
	["35", "N/A","N/A","N/A","N/A","N/A"],
	["36", "N/A","N/A","N/A","N/A","N/A"],
	["37", "N/A","N/A","N/A","N/A","N/A"],
	["38", "N/A","N/A","N/A","N/A","N/A"],
	["39", "N/A","N/A","N/A","N/A","N/A"],
	["40", "N/A","N/A","N/A","N/A","N/A"],
	["41", "N/A","N/A","N/A","N/A","N/A"],
	["42", "N/A","N/A","N/A","N/A","N/A"],
	["43", "N/A","N/A","N/A","N/A","N/A"],
	["44", "N/A","N/A","N/A","N/A","N/A"],
	["45", "N/A","N/A","N/A","N/A","N/A"],
	["46", "N/A","N/A","N/A","N/A","N/A"],
	["47", "N/A","N/A","N/A","N/A","N/A"],
	["48", "N/A","N/A","N/A","N/A","N/A"],
	["49", "N/A","N/A","N/A","N/A","N/A"],
	["50", "N/A","N/A","N/A","N/A","N/A"],
	["51", "N/A","N/A","N/A","N/A","N/A"]
];

		showTable('rssiclientList',tableHeader,tableData,2);
		</script>
</td>
</tr>
</table>
</div>
</form>
</body>
</html>
