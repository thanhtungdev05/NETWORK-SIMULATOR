
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css">
<script type='text/javascript' src="/jsl.js" tppabs="http://192.168.1.1/js/jsl.js"></script>

<style  type="text/css">
*{color:  #404040;}

</style>

<script language="JavaScript">


function Reload(){
window.location.reload();

}
</script>

</head><body>
<FORM METHOD="POST" ACTION="/cgi-bin/status_statistics.asp" name="Stat_Form">
<div id="pagestyle"><!--cindy add for border 11/28-->
<div id="contenttype">

<div id="block1"><!--cindy add for id="block1" 12/05-->
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">

<tr height="25px" style="width:100%;background:#e6e6e6;">
<td width="250px" align=left class="title-main" style="padding-left:20px;">Traffic Statistics</td>
</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left class="tabdata" style="font-size:13px;">Interface</td>
<td align=left class="tabdata">

<select name="Stat_Radio" size="1" onchange="document.Stat_Form.submit()">
<option value="0" selected>Ethernet 

		
		


<option value="2" >WLAN 2.4G 



<option value="3" >WLAN 5G 

 

		
<option value="4" >PON 
		
</select>
</td>
</tr>

	<tr>
<td colspan="3" align=center style="padding-top:20px;padding-bottom:20px;">		
<table width="560" border="1" cellpadding="0" cellspacing="0" bordercolor="#cccccc" bgcolor="#FFFFFF">		
	       <tr class="tabdata">
	<td width="190" class="model"><div align=center> Transmit Statistics </div></td>
		<td width="110">&nbsp;</td>
	<td width="190" class="model"><div align=center>Receive Statistics </div></td>
		<td>&nbsp;</td>
		</tr>  


		<tr>
			<td class='tabdata'>&nbsp;&nbsp;Transmit Frames</td><td class='tabdata'><div align='center'>5220</div></td>
			<td class='tabdata'>&nbsp;&nbsp;Receive Frames</td><td class='tabdata'><div align='center'>3984</div></td></tr>
		<tr>
			<td class='tabdata'>&nbsp;&nbsp;Transmit Multicast Frames</td><td class='tabdata'><div align='center'>1193</div></td>
			<td class='tabdata'>&nbsp;&nbsp;Receive Multicast Frame</td><td class='tabdata'><div align='center'>1193</div></td></tr>
		<tr>
			<td class='tabdata'>&nbsp;&nbsp;Transmit total Bytes</td><td class='tabdata'><div align='center'>551171</div></td>
			<td class='tabdata'>&nbsp;&nbsp;Receive total Bytes</td><td class='tabdata'><div align='center'>2504197</div></td></tr>
		<tr>
			<td class='tabdata'>&nbsp;&nbsp;Transmit Collision</td><td class='tabdata'><div align='center'>0</div></td>
			<td class='tabdata'>&nbsp;&nbsp;Receive CRC Errors</td><td class='tabdata'><div align='center'>0</div></td></tr>
		<tr>
			<td class='tabdata'>&nbsp;&nbsp;Transmit Error Frames</td><td class='tabdata'><div align='center'>0</div></td>
			<td class='tabdata'>&nbsp;&nbsp;Receive Under-size Frames</td><td class='tabdata'><div align='center'>0</div></td></tr>



</table></td>
</tr>
</table>
</div><!--cindy add for id="block1" 12/05-->

<div id="button0">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
	<tr height="25px">		
		<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh traffic statistics</td>
	</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
<tr height="30px">
<td align=left class="tabdata" style="padding-left:20px;">
<INPUT TYPE="button"  NAME="StatRefresh" class="button1" onclick="Reload()" VALUE="Refresh">
              
</td>
</tr>
</table>
</div><!--cindy add for id="button0" 12/05-->
</div><!--id="contenttype"-->
</div><!--cindy add for border 11/28-->

	
               <table width="690" border="0" cellpadding="0" cellspacing="0">
	        	<tr height="30">
				<td width="20">&nbsp;</td>
				<td width="250">&nbsp;</td>
				<td width="420"></td>
			</tr>	
			<tr>
				<td align=center colSpan=3 style="background-color:transparent; font-family: Arial,Helvetica,sans-serif;"><font size=2>Copyright © 2019 FPT. All Rights Reserved.   </font></td>
			</tr>
			<tr height="10">
				<td width="20">&nbsp;</td>
				<td width="250">&nbsp;</td>
				<td width="420"></td>
			</tr>			
		</table>
	
</form></body></html>
