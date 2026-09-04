

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<META http-equiv=Content-Script-Type content=text/javascript>
<META http-equiv=Content-Style-Type content=text/css>
<META http-equiv=Content-Type content="text/html; charset=UTF-8" ;>
<link rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">

*{color:  #404040;}

</style>

<script type="text/javascript" src="/spin.js" ></script>

<SCRIPT language="JavaScript">

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
function check_pwd(password)
{
	//const password = 'Cc1239999***'
	/*
	(?=.{12})è¡¨ç¤ºè¦å¤§ç­‰äºŽ12ä½ã€‚
	(?=.*?[a-z])è¡¨ç¤ºè¦æœ‰å°å†™å­—æ¯ã€‚
	(?=.*?[A-Z])è¡¨ç¤ºè¦æœ‰å¤§å†™å­—æ¯ã€‚
	(?=.*?\d)è¡¨ç¤ºè¦æœ‰æ•°å­—ã€‚
	(?=.?[?!&ï¿¥$%^#,./@";:><[]}{-=+_\|ã€‹ã€Šã€‚ï¼Œã€ï¼Ÿâ€™â€˜â€œâ€~ `])è¡¨ç¤ºè¦æœ‰ç‰¹æ®Šå­—ç¬¦ã€‚
	*/
    //const check = /^(?=.{12})(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[*?!&ï¿¥$%^#,./@";:><\[\]}{\-=+_\\|ã€‹ã€Šã€‚ï¼Œã€ï¼Ÿâ€™â€˜â€œâ€~ `]).*$/;
    const check = /^(?=.{12})(?=.*?[A-Z])(?=.*?\d)(?=.*?[*?!&ï¿¥$%^#,./@";:><\[\]}{\-=+_\\|ã€‹ã€Šã€‚ï¼Œã€ï¼Ÿâ€™â€˜â€œâ€~ `]).*$/;
    if (check.test(password)) {
        return true;
    } else {
        return false;
    }
}

function invalidCharCheck(object)
{
	var len = object.value.length;
	var c;
	var i;
	for (i = 0; i < len; i++)
	{
		var c = object.value.charAt(i);
		if (c == '"' || c == ':' || c == '&' || c == '\'' || c == '(' || c== ')' || c==';' || c=='`' || c =='|' || c=='\\' || c=='$')
		{
			alert('Invaild characters.( & \' \( \) " : ; ` | \\ $)');                                                             
			return true;
		}
	}
	return false;
}

function fwSave(){
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
				
				if(check_pwd(password) == false)
				{
                        alert("For the password of remote web access, it should include capital, special character, numbers and the length of password is at least 12 characters.");
                        return;
                }

                if(username.length>30||username.length<1||password.length>30||password.length<12)
                {
                        alert("Username/Password length range is 1~30!");
                        return;
                }
				
				if(invalidCharCheck(document.fw_form.remote_username) ) 
                        return;
                if(invalidCharCheck(document.fw_form.remote_password) ) 
                        return;

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

showSpin(); 
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

</SCRIPT>

<META content="MSHTML 6.00.2900.3059" name=GENERATOR></HEAD>
<BODY onLoad="ShowAccount();" style="background:#4acbd6;">
<FORM name="fw_form" action="/cgi-bin/adv_firewall.asp" method=post>
<div id="pagestyle">
        <div id="contenttype">
        <div id="block1" class="main_item">
                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;" >
                <tr height="25px" style="width:100%;background:#e6e6e6;" >
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

        <div id="block1" class="main_item">
                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata"  style="margin:5px 0px;">
                <tr height="25px" style="width:100%;background:#e6e6e6;">
                        <td align=left class="title-main" style="padding-left:20px;">Set remote access state</td>
                </tr>
                </table>

                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Remote Web</td>
                        <td align=left class="tabdata">
                                <INPUT TYPE="HIDDEN" NAME="saveAccessflag" VALUE="0">
                                <INPUT TYPE="RADIO" NAME="wanAccessLanWebRadio" VALUE="Enable" onClick="enableWanAccessLanWeb(),ShowAccount();"  > Enable 
                                &nbsp;&nbsp;&nbsp; <INPUT TYPE="RADIO" NAME="wanAccessLanWebRadio" VALUE="Disable" onClick="disableWanAccessLanWeb(),ShowAccount();" checked > Disable 
                        </td>
                </tr>
                <tr height="30px" style="display:none;">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Remote Telnet</td>
                        <td align=left class="tabdata">
                                <INPUT TYPE="RADIO" NAME="telnetradio" VALUE="1" onClick="ShowAccount();"   > Enable 
                                &nbsp;&nbsp;&nbsp; <INPUT TYPE="RADIO" NAME="telnetradio" VALUE="0" onClick="ShowAccount();" checked > Disable 
                        </td>
                </tr>

                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Remote SSH</td>
                        <td align=left class="tabdata">
                                <INPUT TYPE="RADIO" NAME="sshradio" VALUE="Enable" onClick="ShowAccount();"   > Enable 
                                &nbsp;&nbsp;&nbsp; <INPUT TYPE="RADIO" NAME="sshradio" VALUE="Disable" onClick="ShowAccount();" checked > Disable 
                        </td>
                </tr>
                </table>
        </div>

        <div id="block2">
                <div id="Account_div" class="main_item" style="display:none">
                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata"  style="margin:5px 0px;">
                <tr height="25px" style="width:100%;background:#e6e6e6;">
                        <td align=left class="title-main" style="padding-left:20px;">Remote Security Account</td>
                </tr>
                </table>

                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Username</td>
                        <td align=left class="tabdata">
                                <input type="text" name="remote_username" size="28"  maxlength="30" value=>
                                (length range:1~30)
                        </td>
                </tr>

                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Password</td>
                        <td align=left class="tabdata">
                                <input type="password" name="remote_password" size="28"  maxlength="30" value=>
                                (length range:12~30)
                        </td>
                </tr>
                </table>
                </div>
        </div>

        <div id="button0" class="main_item">
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
                <td id="firstDiv" style="float:left;"></td>
</tr>
</table>
        </div>
        </div>
    </div>

                
</FORM></BODY></HTML>
