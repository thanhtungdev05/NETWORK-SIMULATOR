

<!--
If you execute doRefresh() and then reload webpage, doRefresh() will be disabled.
Therefore, execute doRefresh() after webpage reloads.
-->
<!-- Foxconn alan fix a bug when some value set wrong it will also prompt "Reboot Complete!" -->


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=iso-8859-1">
<link rel="stylesheet" type="text/css" href="/style.css" tppabs="/style.css">

<style  type="text/css">

*{color:  #404040;}

</style>


<script language="JavaScript" src="/val.js"></script>
<script language="JavaScript" type='text/javascript' src="/ip_new.js"></script>
<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
<script type="text/javascript" src="/spin.js" ></script>
<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->

<script language="JavaScript">

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

function doNonSympolCheck(c)
{
	if ((c >= "0")&&(c <= "9"))
	{
		return 1;
	}
	else if ((c >= "A")&&(c <= "Z"))
	{
		return 1;
	}
	else if ((c >= "a")&&(c <= "z"))
	{
		return 1;
	}

  return -1;
}

function PasswdCheck(object)
{
	var len = object.value.length;
	var c;
	var i = 0;
	for(i=0; i<len; i++)
	{
		var c = object.value.charAt(i);
		if(doNonSympolCheck(c)==-1)
		{
			alert("passwd include invalid character:  " + c);
			return true;
		}
	}
	return false;
}

function AuthSave() 
{
/* Foxconn alan remove start for remove LOID and Password authentication
	
	if(document.AUTH_form.Auth_LOID.value.length <= 0){
		alert("Both of the fields should be filled");
		return false;
	}
	if (document.AUTH_form.Auth_LOID.value.length > 24){
		alert("LOID length can't more than 24!");
		return false;
	}
	if (document.AUTH_form.Auth_Password.value.length >= 12){
		alert("Password length can't more than 12!");
		return false;
	}
	
Foxconn alan remove end */
	
	/*if (PasswdCheck(document.AUTH_form.Auth_Password)){
		alert("Password contain invalid character!");
		return false;
	}*/

	
	if(document.AUTH_form.Auth_SN.value.length <= 0){
		alert("Serial number cannot be blank!");
		return false;
	}

	if (document.AUTH_form.Auth_SN.value.length != 12){
		alert("Serial number only support a string contain 12 characters!");
		return false;
	}
	
	if (!document.AUTH_form.Auth_SN.value.match(/[a-zA-Z]{4}[a-zA-Z0-9]{8}/)){
		alert("Serial number contain invalid character!");
		return false;
	}
	
	if(document.AUTH_form.Auth_PSW.value.length <= 0){
		alert("GPON Password should be filled");
		return false;
	}

	if (document.AUTH_form.Auth_PSW.value.length > 10){
		alert("Invalid input, GPON Password should be 10 characters(0~9, a~z, A~Z)!");
		return false;
	}
/* Foxconn alan add for check GPON Password */
	if (PasswdCheck(document.AUTH_form.Auth_PSW)){
		return false;
	}
	
	

	alert("Please wait for reboot complete!");


	showSpin();//cindy add
	document.AUTH_form.AuthFlag.value=1;
	document.AUTH_form.submit();
}

function doRefresh()
{
	alert("Reboot Complete!");
	var mydate = new Date();
	mydate.setTime(mydate.getTime() - 1);
	document.cookie = "SESSIONID=; expires=" + mydate.toGMTString(); 
	window.parent.location.href = "../";    
}


function return_login()
{
		parent.location.replace("/cgi-bin/login.asp");
}

</script>
</head>

<body>
<FORM METHOD="POST" ACTION="/cgi-bin/access_auth.asp" name="AUTH_form">
			<div id="pagestyle"><!--cindy add for border 11/28-->
			<div id="contenttype">
<!--Foxconn alan remove start for remove LOID and Password authentication
				<table width="740px" border="0"  cellpadding="0" cellspacing="0">
<tr><td height="40px"  colspan="5"></td></tr>
<tr><td width="10" valign="right" >&nbsp; </td>
<td width="150" height="15" class="title-main" style="padding-left:30px;">      	
			LOID
</td>
<td  colspan="3" valign="middle" style="padding-right:20"><hr style="height:1px;border:none;border-top:1px solid #38A7DC;" /></td>
</tr>
</table>



				<table width="740" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
	<tr>
		<td width="150" height="10"> </td>
		<td width="10">&nbsp;</td>
		<td width="150"></td>
		<td width="10" ></td>
		<td width="440"></td>
	</tr>
	<tr>		
		<td width="150" height="25" class="light-orange"></td>
		<td width="10" class="light-orange"></td>
		<td class="tabdata"><div align=right><img src="/exclamation.gif"></div></td>
		<td>&nbsp;</td>
		<td class="tabdata">
		<div style="color:FF9933;">
		 The device will be automatically rebooted after the operation! 
		 </div>
		</td>
	</tr>
	<tr>		
		<td width="150" height="25" class="light-orange"></td>
		<td width="10" class="light-orange"></td>
		<td class="tabdata"><div align=right> 
			LOID </div></td>
		<td class="tabdata"><div align=center>:</div></td>
		<td class="tabdata">
			
			<INPUT TYPE="TEXT" NAME="Auth_LOID" SIZE="30" MAXLENGTH="24" VALUE="fpt1111" >
			
		</td>
	</tr>
	<tr>
		<td class="light-orange">&nbsp;</td>
		<td class="light-orange"></td>
		<td class="tabdata"><div align=right> Password </div></td>
		<td class="tabdata"><div align=center>:</div></td>
		<td class="tabdata">
			
			<INPUT TYPE="TEXT" NAME="Auth_Password" SIZE="30" MAXLENGTH="15" VALUE="1111" >
			
		</td>
	</tr>
Foxconn alan remove end -->
				
<!--Foxconn alan add start for GPON SerialNumber and GPONPassword authentication -->
				<div id="block1">
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;" >
					

						<tr height="25px" class="bgcolor">

							<td  align="left" class="title-main" style="padding-left:20px;">
								GPON Serial Number
							</td>
						</tr>
					</table>
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
						<tr height="30px">
						    	
						    	<td colspan="2" align=left class="tabdata" style="padding-left:20px;">
								<div style="color:#F36F22;">
								    		<img src="/exclamation.gif">
			 					The device will be automatically rebooted after the operation! 
								 </div>
							</td>
						</tr>
											
					
							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">GPON Serial Number</td>
							     	<td align=left class="tabdata">
									<INPUT TYPE="TEXT" NAME="Auth_SN" SIZE="30" MAXLENGTH="15" VALUE="FPTF00025604" disabled="true">
								</td>
							</tr>
							
						
								<tr height="30px">
								    	
								    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">GPON Password </td>
								     	<td align=left class="tabdata">
								     		<INPUT TYPE="TEXT" NAME="Auth_PSW" SIZE="30" MAXLENGTH="15" VALUE="00000001" >&nbsp;
								     		(max length: 10)  
									</td>
								</tr>
						
					

						
					</table>
				</div>
				
<!-- Foxconn alan add end -->
				
<!--Foxconn alan remove start for remove original GPON SerialNumber and GPON Password
	
	<tr>
		<td width="150" height="30" class="title-main">Serial Number </td>
		<td width="10">&nbsp;</td>
		<td width="150"><hr noshade></td>
		<td width="10" ><hr noshade></td>
		<td colspan="3"><hr noshade></td>
	</tr>
	<tr>		
		<td width="150" height="25" class="light-orange"></td>
		<td width="10" class="light-orange"></td>
		<td class="tabdata"><div align=right> Serial Number </div></td>
		<td class="tabdata"><div align=center>:</div></td>
		<td class="tabdata">
			<INPUT TYPE="TEXT" NAME="Auth_SN" SIZE="30" MAXLENGTH="15" VALUE="FPTF00025604" >
		</td>
	</tr>
	
	<tr>		
		<td width="150" height="25" class="light-orange"></td>
		<td width="10" class="light-orange"></td>
		<td class="tabdata"><div align=right><font color="#000000">N/A</font></div></td>
		<td class="tabdata"><div align=center>:</div></td>
		<td class="tabdata">
			<INPUT TYPE="TEXT" NAME="Auth_PSW" SIZE="30" MAXLENGTH="10" VALUE="00000001" >
		</td>
	</tr>
	
	
	</table>
Foxconn alan remove end-->

				<div id="button0">
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;" >
					
						<tr height="25px">
							<td  align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Save" to save your settings</td>
						</tr>
					</table>
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata"  >
						<tr height="40px">
							
							<td colspan="2" align=left class="tabdata" style="padding-left:20px;">
								<INPUT TYPE="HIDDEN" NAME="AuthFlag" VALUE="0">
								<INPUT TYPE="SUBMIT" NAME="SaveBtn" class="button1" VALUE="Save" onClick="AuthSave();">
							</td>
							<td id="firstDiv" style="float:left;"></td><!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
							<td align=left class="tabdata" style="display:none">
								
									
								
							</td>
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
					<td align=center colSpan=3 style="background-color:transparent;font-family: Arial,Helvetica,sans-serif;"><font size=2>Copyright © 2019 FPT. All Rights Reserved.  </font></td>
				</tr>
				<tr height="10">
					<td width="20">&nbsp;</td>
					<td width="250">&nbsp;</td>
					<td width="420"></td>
				</tr>	
			</table>
		
	</form>
    </body>
</html>
