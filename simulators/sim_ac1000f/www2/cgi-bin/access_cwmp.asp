


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css" tppabs="/style.css">

<style  type="text/css">

*{color:  #404040;}

#wrapper{
margin:50px auto;
width:680px;
background:#FFFFFF;
padding:10px 3px;
}
</style>

<script language="javascript" src="/general.js"></script>
<script language="JavaScript">
function cwmpinit(){
//cindy add start
window.history.replaceState('object','CWMP Management','/tr069');
document.title="CWMP Management";
//cindy add end
	if(document.CWMP_form.elements[0].checked) 
		cwmpSwitch(1);
	else
		cwmpSwitch(0);	
		
	if(document.CWMP_form.CWMPLockFlag.value == 1)
		doCWMPLock();
}

function cwmpSwitch(on_off)
{
	if(on_off == 0){
		for(i = 2; i < 11; i++){
			document.CWMP_form.elements[i].disabled = true;}
			
	
	}		
	else{
		for(i = 2; i < 11; i++){
			document.CWMP_form.elements[i].disabled = true;//cindy modify false=>true 0825
}
		if(document.CWMP_form.CWMP_PeriodActive[1].checked)
			document.CWMP_form.elements[10].disabled = true;
		
	}
}
function cwmpPeriodSwitch(on_off)
{
	if(on_off == 0)
			document.CWMP_form.elements[10].disabled = true;
	else
			document.CWMP_form.elements[10].disabled = true;//cindy modify false=>true 0825
}

function isNumeric(s)
{
  var len= s.length;
  var ch;
  if(len==0)
    return false;
  for( i=0; i< len; i++)
  {
    ch= s.charAt(i);
    if( ch > '9' || ch < '0')
    {
      return false;
    }
  }
  return true;
}

function cwmpNumValidCheck()
{
	var value1;
/*	
	value1 = document.CWMP_form.CWMP_ConnectionRequestPort.value;
	if(!isNumeric(value1)){
		alert("The connection request port should be interger!");
		return false;
	}
	else{
		if(Number(value1) > 65535 || Number(value1) < 1){
			alert("The connection request port should be 1-65535!");
			return false;
		}
	}
*/
	value1 = document.CWMP_form.CWMP_PeriodInterval.value;
	if(!document.CWMP_form.elements[8].checked)
		return true;
	if(!isNumeric(value1)){
		alert("The periodic interval should be interger!");
		return false;
	}
	else{
		if(Number(value1) > 999999 || Number(value1) < 1){
			alert("The inform interval should be 1-999999!");
			return false;
		}
	}
	
	return true;
}

function StringCheck(val)
{
    re = /^[^\s]+$/;
    if( re.test(val) )
        return true;
    else
        return false;
}

function cwmpStringValidCheck()
{
	var value1;
	var value2 = null;
	var url = /^https*:\/\/\w+/;
	var path = /^\/\w+/;

	value1 = document.CWMP_form.CWMP_ACSURL.value;
	if(value1 == "") {
		alert("ACS URL should not be empty!");
		return false;
	}

	if(!StringCheck(value1)){
		alert("ACS URL should not be have blank character!");
		return false;
	}
	else{	
		if(StringCheck(value1)){
			value2 = value1.match(url);
			if(value2 == null){
				alert("The format of ACS URL is wrong!");
				return false;
			}
			if(chineseCheck(document.CWMP_form.CWMP_ACSURL, "ACSURLId"))
			{
				return false;
			}
		}
	}
	
	if(chineseCheck(document.CWMP_form.CWMP_ACSUserName, "ACSUserNameId"))
	{
		return false;
	}
	if(chineseCheck(document.CWMP_form.CWMP_ACSPassword, "ACSPasswordId"))
	{
		return false;
	}
	if(chineseCheck(document.CWMP_form.CWMP_ConnectionRequestUserName, "CWMPConnectionRequestUserNameId"))
	{
		return false;
	}
	if(chineseCheck(document.CWMP_form.CWMP_ConnectionRequestPassword, "CWMPConnectionRequestPasswordId"))
	{
		return false;
	}
	/* value1 = document.CWMP_form.CWMP_ACSUserName.value;
	if(!StringCheck(value1)){
		alert("Username for logining ACS should not be empty!");
		return false;
	}
	
	value1 = document.CWMP_form.CWMP_ACSPassword.value;
	if(!StringCheck(value1)){
		alert("Password for logining ACS should not be empty!");
		return false;
	}
	*/
	
	value1 = document.CWMP_form.CWMP_ConnectionRequestPath.value;
    /*	
	if(!StringCheck(value1)){
		alert("Connection request path should not be empty!");
		return false;
	}
	else{
	*/
	if(StringCheck(value1)){
		value2 = value1.match(path);
		if(value2 == null){
			alert("The format of connection request path is wrong!");
			return false;
		}
	}
	/*
	value1 = document.CWMP_form.CWMP_ConnectionRequestUserName.value;
	if(!StringCheck(value1)){
		alert("Username for Connection request should not be empty!");
		return false;
	}
	
	value1 = document.CWMP_form.CWMP_ConnectionRequestPassword.value;
	if(!StringCheck(value1)){
		alert("Password for Connection request should not be empty!");
		return false;
	}
	*/
	return true;
}
//Luke add for Mirror function 20170824
function mirrorSave()
{
	document.CWMP_form.Mirrorflag.value=1;	
	document.CWMP_form.submit();
}
//Luke add for Mirror function end
function cwmpSave()
{
	if(document.CWMP_form.elements[0].checked){
		if(!cwmpNumValidCheck())
			return false;
		if(!cwmpStringValidCheck())
			return false;
		
	}
	
	document.CWMP_form.Cwmpflag.value=1;	
	document.CWMP_form.submit();

}
function doCWMPLock()
{
	for(i = 0; i < document.forms[0].elements.length; i++)
	{	
		document.forms[0].elements[i].disabled = true;
	}
}


</script>
</head>
<body onload="cwmpinit()">

<form name="CWMP_form" method="post" ACTION="/cgi-bin/access_cwmp.asp" >
<div id="wrapper">
<!--cindy delete 0819
<table width="760px" border="0"  cellpadding="0" cellspacing="0">
<tr><td height="40px"  colspan="5"></td></tr>
<tr><td width="10">&nbsp; </td>
<td width="140" height="15">      	
</td>
<td  colspan="3" valign="middle"  class="title-main">
      	CWMP Setup 
      	</td>
</tr>
</table>
-->

<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center">
	<tr style="display:none" height="30px">
		<td class="tabdata" align=left>
    
    CWMP
    
    	    </td>
    <td class="tabdata">
      <input name="CWMP_Active" type="radio" value="Yes" checked onclick="cwmpSwitch(1)">
       Enable 
	  <input name="CWMP_Active" type="radio" value="No"  onclick="cwmpSwitch(0)">
   	   Disable 
     </td>
  </tr>
</table>
  
<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td width="250px" align="left" class="title-main" style="padding-left:20px;">
			ACS Login Information
		</td>
</tr>
</table>

<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center">
<tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
			<div id="ACSURLId">URL</div>
		</td>
 	<td align=left class="tabdata">
 		<input disabled="true" name="CWMP_ACSURL" type="text" value="http://acs2.fpt.net/cpe/" size="64" maxlength="256">
	</td>
 </tr>
 	
 <tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
			<div  id="ACSUserNameId"> User Name</div>
		</td>
 	<td align=left class="tabdata">
 		<input disabled="true" name="CWMP_ACSUserName" type="text" value="acstr69" size="32" maxlength="256">
	</td>
 </tr>
	 
 <tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
			<div  id="ACSPasswordId"> Password</div>
		</td>
 	<td align=left class="tabdata">
 		<input disabled="true" name="CWMP_ACSPassword" type="text" value="acstr69" size="32" maxlength="256">
	</td>
 </tr>
</table>
 
<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td width="250px" align="left" class="title-main" style="padding-left:20px;">
			Connection Request Information
		</td>
</tr>
</table>

<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center">
<tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
			Path
		</td>
 	<td align=left class="tabdata">
 		<input disabled="true" name="CWMP_ConnectionRequestPath" type="text" value="/tr69" size="63" maxlength="256">
	</td>
 </tr>

<tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
			<div id="CWMPConnectionRequestUserNameId">User Name</div>
		</td>
 	<td align=left class="tabdata">
 		<input disabled="true" name="CWMP_ConnectionRequestUserName" type="text" value="cpetr69" size="32" maxlength="256">
	</td>
 </tr>

 <tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
			<div id="CWMPConnectionRequestPasswordId">Password</div>
		</td>
 	<td align=left class="tabdata">
 		<input disabled="true" name="CWMP_ConnectionRequestPassword" type="text" value="cpetr69" size="32" maxlength="256">
	</td>
 </tr>
</table>

<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td width="250px" align="left" class="title-main" style="padding-left:20px;">
			Periodic Inform Config
		</td>
</tr>
</table>
  
<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center">
  <tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
			Periodic Inform
		</td>
 	<td align=left class="tabdata">
 		<input name="CWMP_PeriodActive" disabled="true" value="Yes" type="radio" checked onclick="cwmpPeriodSwitch(1)">
  	    Enable
 	  &nbsp;&nbsp;&nbsp;&nbsp;<input name="CWMP_PeriodActive" disabled="true" value="No" type="radio"  onclick="cwmpPeriodSwitch(0)">
 		Disable
	</td>
 </tr>
  
   <tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
			Interval
		</td>
 	<td align=left class="tabdata">
 		<input disabled="true" type="text" name="CWMP_PeriodInterval" value="86400" size="9" maxlength="9" >
	</td>
 </tr>
</table>




<!--Foxconn Luke add for Mirror function  20170824-->

<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td width="250px" align="left" class="title-main" style="padding-left:20px;">
			Mirror Function
		</td>
	</tr>
</table>

<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center">
	<tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
			Mirror 
		</td>
	 	<td align=left class="tabdata">
	 		<input name="Mirror_Active" value="Yes" type="radio"  >
  			Enable
			&nbsp;&nbsp;&nbsp;&nbsp;<input name="Mirror_Active" value="No" type="radio" checked >
 			Disable
		</td>
 	</tr>
</table>
<!--Foxconn Luke add for mirror function end -->

 <div id="button0">
<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px">
		<td width="250px" align="left" class="title-main" style="padding-left:20px;">
			Click "Save" to save mirror function
		</td>
   </tr>
</table>

<table width="680" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" align="center">
    <tr height="40px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
	<input name="CWMPLockFlag" type="HIDDEN" value="0">
		<INPUT TYPE="HIDDEN" NAME="Cwmpflag" VALUE="0">
		<!--cindy delete 0817
		<input name="cwmp_apply" type="button" value="Apply" onClick="cwmpSave()" class="sbutton">
      	<input type="reset"  name="cwmp_cancel" value="Cancel">
      	-->
		<!--Foxconn Luke add for mirror function 20170824 -->	
		<INPUT TYPE="HIDDEN" NAME="Mirrorflag" VALUE="0">
	 	 	<input name="mirror_save" type="button"  class="button1" value="Save" onClick="mirrorSave()" class="sbutton">
		<!--Foxconn Luke add for mirror function end -->
	</td>
  </tr>
  </table>
  </div>
</div>
</form>
</body>
</html>        
