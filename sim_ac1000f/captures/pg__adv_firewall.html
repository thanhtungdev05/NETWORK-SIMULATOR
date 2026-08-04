

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<META http-equiv=Content-Script-Type content=text/javascript>
<META http-equiv=Content-Style-Type content=text/css>
<META http-equiv=Content-Type content="text/html; charset=UTF-8" ;>
<LINK rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">

*{color:  #404040;}

</style>

<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
<script type="text/javascript" src="/spin.js" ></script>
<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->

<SCRIPT language="JavaScript">

//<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
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
//<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->

function fwSave(){
//foxconn cindy add for FPT new requirement,add Remote Security Account when remote function enable 2020/01/10
	var value1 = document.fw_form.wanAccessLanWebRadio;
	var value2 = document.fw_form.telnetradio;
	var value3 = document.fw_form.sshradio;
	var username = document.fw_form.remote_username.value;
	var password = document.fw_form.remote_password.value;
	if(value1[0].checked||value2[0].checked||value3[0].checked)
	{
		if(username==""||password=="")
		{
			alert("Username/Password can't be blank!");
			return;
		}
		
		if(username.length>32||username.length<8||password.length>32||password.length<8)
		{
			alert("Username/Password length range is 8~32!");
			return;
		}

		for(var i = 0; i < username.length; i ++ )
		{
		  	 var ascNum = username.charCodeAt(i);
		   	//ascNUM : 59 ->semicolon(;)
			
		   	if (ascNum < 33 || ascNum > 126 || ascNum == 59)
			{
	   			alert("Username Invalid.Username can not contain semicolon(;) !!");
				return -1;
			}
		}

		for(var i = 0; i < password.length; i ++ )
		{
		  	 var ascNum = password.charCodeAt(i);
		   	//ascNUM : 59 ->semicolon(;)
			
		   	if (ascNum < 33 || ascNum > 126 || ascNum == 59)
			{
	   			alert("Password Invalid.Password can not contain semicolon(;) !!");
				return;
			}
		}

	}
//foxconn cindy add for FPT new requirement,add Remote Security Account when remote function enable 2020/01/10
	
showSpin();//cindy add 
  document.fw_form.fwFlag.value=1;
  document.fw_form.submit();
}

function enableWanAccessLanWeb()
{
	if( confirm("Are you sure Enable WAN access LAN WEB??"))
	{
		document.fw_form.saveAccessflag.value=1;
	}
	else{
		document.fw_form.wanAccessLanWebRadio[1].checked = true;
		document.fw_form.saveAccessflag.value=1;
	}
}

function disableWanAccessLanWeb()
{
	document.fw_form.saveAccessflag.value=1;
}

//foxconn cindy add for FPT new requirement,add Remote Security Account when remote function enable 2020/01/10
function ShowAccount()
{
	var value1 = document.fw_form.wanAccessLanWebRadio;
	var value2 = document.fw_form.telnetradio;
	var value3 = document.fw_form.sshradio;
	if(value1[0].checked||value2[0].checked||value3[0].checked)
		document.getElementById("Account_div").style.display = "";
	else
		document.getElementById("Account_div").style.display = "none";
}
//foxconn cindy add for FPT new requirement,add Remote Security Account when remote function enable 2020/01/10

</SCRIPT>

<META content="MSHTML 6.00.2900.3059" name=GENERATOR></HEAD>
<BODY onLoad="ShowAccount();">
<FORM name="fw_form" action="/cgi-bin/adv_firewall.asp" method=post>
<div id="pagestyle"><!--cindy add for border 11/28-->
	<div id="contenttype">
	<div id="block1">
		<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;" >
		<tr height="25px" class="bgcolor" >	
			<td  align=left class="title-main" style="padding-left:20px;">Firewall</td>
		</tr>
		</table>
		
		<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
		<tr height="30px">
			<td width="250px" align=left class="tabdata" style="padding-left:20px;">Firewall</td>
			<td align=left class="tabdata">
			<INPUT TYPE="RADIO" NAME="firewallEnable"  VALUE="1"  checked > Enable			     		
			&nbsp;&nbsp;&nbsp; <INPUT TYPE="RADIO" NAME="firewallEnable"  VALUE="0"    > Disable 
			</td>
		</tr>
		<tr height="30px">
			<td width="250px" align=left class="tabdata" style="padding-left:20px;">SPI</td>
			<td align=left class="tabdata">
				<INPUT TYPE="RADIO" NAME="spiEnable" VALUE="1"  > Enable
				&nbsp;&nbsp;&nbsp; <INPUT TYPE="RADIO" NAME="spiEnable" VALUE="0" checked > Disable
			</td>
		</tr>
		</table>
		
		<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
		<tr height="30px">
		
		<td  align=left class="tabdata" style="padding-left:20px;">
			<div style="color:#F36F22;">
	
			<img class="forattention" src="/exclamation.gif">
			
			(WARNING: If you enable SPI, all traffics initiated from WAN would be blocked, including DMZ and Virtual Server.)</div>
		</td>
		</tr>
		</table>
	</div>

	<div id="block1">
		<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata"  style="margin:5px 0px;">
		<tr height="25px" class="bgcolor">
			<td align=left class="title-main" style="padding-left:20px;">Set remote access state</td>
		</tr>
		</table>
		
		<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
		<tr height="30px">
			<td width="250px" align=left class="tabdata" style="padding-left:20px;">Remote Web</td>
			<td align=left class="tabdata">
				<INPUT TYPE="HIDDEN" NAME="saveAccessflag" VALUE="0">
				<INPUT TYPE="RADIO" NAME="wanAccessLanWebRadio" VALUE="Yes" onClick="enableWanAccessLanWeb(),ShowAccount();"  > Enable 
				&nbsp;&nbsp;&nbsp; <INPUT TYPE="RADIO" NAME="wanAccessLanWebRadio" VALUE="No" onClick="disableWanAccessLanWeb(),ShowAccount();" checked > Disable 
			</td>	
		</tr>
		<!--cindy add start about telnet 05/22-->
		<tr height="30px" style="display:none;">
			<td width="250px" align=left class="tabdata" style="padding-left:20px;">Remote Telnet</td>
			<td align=left class="tabdata">
				<INPUT TYPE="RADIO" NAME="telnetradio" VALUE="1" onClick="ShowAccount();"   > Enable 
				&nbsp;&nbsp;&nbsp; <INPUT TYPE="RADIO" NAME="telnetradio" VALUE="0" onClick="ShowAccount();" checked > Disable 
			</td>	
		</tr>
		<!--cindy add end about telnet 05/22-->
		
		<!--cindy add start about SSH 05/22-->
		<tr height="30px">
			<td width="250px" align=left class="tabdata" style="padding-left:20px;">Remote SSH</td>
			<td align=left class="tabdata">
				<INPUT TYPE="RADIO" NAME="sshradio" VALUE="1" onClick="ShowAccount();"   > Enable 
				&nbsp;&nbsp;&nbsp; <INPUT TYPE="RADIO" NAME="sshradio" VALUE="0" onClick="ShowAccount();" checked > Disable 
			</td>	
		</tr>
		<!--cindy add end about SSH 05/22-->
		</table>
	</div>

<!--//foxconn cindy add for FPT new requirement,add Remote Security Account when remote function enable 2020/01/10-->
	<div id="block1">
		<div id="Account_div">
		<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata"  style="margin:5px 0px;">
		<tr height="25px" class="bgcolor">
			<td align=left class="title-main" style="padding-left:20px;">Remote Security Account</td>
		</tr>
		</table>
		
		<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
		<tr height="30px">
			<td width="250px" align=left class="tabdata" style="padding-left:20px;">Username</td>
			<td align=left class="tabdata">
				<input type="text" name="remote_username" size="30"  maxlength="32" value=useradmin>
				(length range:8~32)
			</td>	
		</tr>
		
		<tr height="30px">
			<td width="250px" align=left class="tabdata" style="padding-left:20px;">Password</td>
			<td align=left class="tabdata">
				<input type="password" name="remote_password" size="30"  maxlength="32" value=>
				(length range:8~32)
			</td>	
		</tr>
		</table>
		</div>
	</div>
<!--//foxconn cindy add for FPT new requirement,add Remote Security Account when remote function enable 2020/01/10-->

	<div id="button0">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;" >
	<tr height="25px">
			<td  align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Save" to save your settings</td>
		</tr>
	</table>
	
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
	<tr height="40px">
		<td colspan="2" align=left class="tabdata" style="padding-left:20px;">
		<INPUT TYPE="HIDDEN" NAME="fwFlag" VALUE="0">
    		<INPUT TYPE="BUTTON" NAME="SaveBtn" class="button1" VALUE="Save" onClick="fwSave();">
    		</td>
    		<td width="20px"></td>
    		<td><INPUT onClick="javascript:window.location='adv_firewall.asp'" type=button value=Cancel name=firewall_cancel style="display:none;">
		</td>
		<td id="firstDiv" style="float:left;"></td><!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
</tr>
</table>
    	</div>
    	</div>
    </div><!--cindy add for border 11/28-->	

		
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
		
</FORM></BODY></HTML>
