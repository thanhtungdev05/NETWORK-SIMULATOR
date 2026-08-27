
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css">

<style type="text/css">

.button_1
{
display:inline-block;
cursor:pointer;
color:#fff;
font:bold 15px Arial,Verdana,sans-serif;
margin:10px 5px;
padding:3px 8px;
line-height:normal;
*overflow:visible ;
text-align:center;
text-decoration:none;
position:relative;
background:#38a7dc;
behavior:url(/PIE.htc);
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
	html.push("<table id=client_list width=660 border=1 align=center cellpadding=1 cellspacing=0  bordercolor=#CCCCCC bgcolor=#FFFFFF>");
	
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
	if(parseInt(document.dchp_client_list.LeaseNum.value)>210)
	{
		html.push("<div id=positionstyle>");
		html.push("<input type=button name=MORE class=button_1 value=\" 1 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list.asp\'>");		
		html.push("<input type=button name=MORE class=button_1 value=\" 2 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list_2.asp\'>");		
		html.push("<input type=button name=MORE class=button_1 value=\" 3 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list_3.asp\'>");
		html.push("</div>");
	}
	else if(parseInt(document.dchp_client_list.LeaseNum.value)>110)
	{
		html.push("<div id=positionstyle>");
		html.push("<input type=button name=MORE class=button_1 value=\" 1 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list.asp\'>");
		html.push("<input type=button name=MORE class=button_1 value=\" 2 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list_2.asp\'>");
		html.push("</div>");
	}
	else
	{
		html.push("<div id=positionstyle>");
		html.push("<input type=button name=MORE class=button_1 value=\" 1 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list.asp\'>");
		html.push("</div>");
	}
	document.getElementById(id).innerHTML = html.join('');
}
</script>

</head>
<body>
<FORM METHOD="POST" ACTION="/cgi-bin/more_client_list.asp" name="dchp_client_list">

<div id="wrapper">
<INPUT type="HIDDEN" name="LeaseNum" value="1"><!--amy change DhcpLease to LanHost 20180322-->
<table width="660px" border="0" style="table-layout: fixed;" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" id="uiViewBodyTable">
  
  <tr height="30px">
  	<td class="title-main" align=left style="white-space:nowrap;">
  	LAN Client List</td>
  </tr>	 
  </table>
  
<table width="660" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr id="buttoncolor">
 <td align=left class="tabdata">
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
//amy change DhcpLease_Entry.x to LanHost_Entry.x 20180322.
var tableData = [
	["31", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["32", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["33", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["34", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["35", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["36", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["37", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["38", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["39", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["40", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["41", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["42", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["43", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["44", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["45", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["46", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["47", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["48", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["49", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["50", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["51", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["52", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["53", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["54", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["55", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["56", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["57", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["58", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["59", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["60", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["61", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["62", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["63", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["64", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["65", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["66", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["67", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["68", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["69", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["70", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["71", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["72", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["73", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["74", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["75", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["76", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["77", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["78", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["79", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["80", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["81", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["82", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["83", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["84", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["85", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["86", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["87", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["88", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["89", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["90", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["91", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["92", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["93", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["94", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["95", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["96", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["97", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["98", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["99", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["100", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],	
	["101", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["102", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["103", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["104", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["105", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["106", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["107", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["108", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["109", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"],
	["110", "N/A","N/A","N/A","N/A","N/A" + "days " + "<br />" + "N/A"]

];

		showTable('dhcpclientList',tableHeader,tableData,2);
		</script>
</td>
</tr>
</table>
</div>
</form>
</body>
</html>
