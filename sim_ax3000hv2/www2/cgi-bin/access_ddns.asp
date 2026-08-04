

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<!--<script language="JavaScript" src="OutVariant.asp"></script>-->
<link rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">

*{color:  #404040;}

</style>

</head>

<script type="text/javascript" src="/spin.js" ></script>
<script language="JavaScript">
var ddns_active='0';
var server_name='no-ip.com';
var lookup_host='yourhost.example.com';
var username='your_username';
var wildcard_support='';
var password='your_password';
var address='(null)';
var time='(null)';
var report='failed';

var ddnsPwd="";
ddnsPwd = password;
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

function ddnsSwitch(on_off)
{      
/*      if(on_off == 0)
                for(i = 2; i < 8; i++)
                        document.DDNS_form.elements[i].disabled = true;
        else
                for(i = 2; i < 9; i++)
                        document.DDNS_form.elements[i].disabled = false;*/

        if(on_off)

                document.getElementById("ddns_active").style.display="block";
        else
                document.getElementById("ddns_active").style.display="none";

}

function checkSubmit()
{
        if(document.DDNS_form.elements[0].checked)
        {
                for(i = 3; i < 6; i++)
                {
                        if(document.DDNS_form.elements[i].value.length == 0)
                        {
                                alert('Please fill out all fields before the submission');
                                document.DDNS_form.elements[i].focus();
                                return false;
                        }
                }
                if(invalidCharCheck(document.DDNS_form.sysDNSHost) ) 
                        return false;
                if(invalidCharCheck(document.DDNS_form.sysDNSUser) ) 
                        return false;
                if(invalidCharCheck(document.DDNS_form.sysDNSPassword) ) 
                        return false;
        }
        showSpin();
        document.DDNS_form.SaveFlag.value = 1;
        document.DDNS_form.submit();
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

function doLoad()
{
//      if(!document.DDNS_form.elements[0].checked)
//              ddnsSwitch(0); 

        if(document.DDNS_form.sysDNSPassword != null)
                document.DDNS_form.sysDNSPassword.value = ddnsPwd;
}
</script>

<body onLoad="doLoad()" style="background:#4acbd6;">
                <FORM METHOD="POST" ACTION="/cgi-bin/access_ddns.asp" name="DDNS_form">
                        <div id="pagestyle">
                        <div id="contenttype">
                                <div id="block1">
								<div class="main_item">
                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">

                                                <tr height="25px" style="width:100%;background:#e6e6e6;">
                                                        <td  align="left" class="title-main" style="padding-left:20px;">Dynamic DNS</td>
                                                </tr>
                                        </table>
                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
                                                <tr height="30px">
                                                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Dynamic DNS</td>
                                                        <td align=left class="tabdata">
                                                                <INPUT NAME="Enable_DyDNS" TYPE="RADIO" onClick="ddnsSwitch(1)" VALUE="Yes">
                                                                Enable

                                                                &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="Enable_DyDNS" VALUE="No" onClick="ddnsSwitch(0)">
                                                                Disable
                                                                <script>
                                                                        if (ddns_active == "1") {
                                                                                document.getElementsByName("Enable_DyDNS")[0].checked = true;
                                                                                document.getElementsByName("Enable_DyDNS")[1].checked = false;
                                                                        } else {
                                                                                document.getElementsByName("Enable_DyDNS")[0].checked = false;
                                                                                document.getElementsByName("Enable_DyDNS")[1].checked = true;
                                                                        }
                                                                </script>

                                                        </td>
                                                </tr>
                                        </table>
                                        <div id="ddns_active" style="display:none;">
                                        <script>
                                        if(ddns_active == "1")
                                        {
                                                document.getElementById("ddns_active").style.display="";
                                        }
                                        </script>
                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
                                                <tr height="30px">

                                                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Service Provider </td>
                                                        <td align=left class="tabdata">
                                                                <SELECT NAME="ddns_ServerName" SIZE="1">
                                                                <option value="dyndns.org">www.dyndns.org

                                                                <option value="thatip.com">www.thatip.com

                                                                <option value="zoneedit.com">www.zoneedit.com

                                                                <option value="dhis.org">www.dhis.org

                                                                <option value="changeip.com">www.changeip.com

                                                                <option value="he.net">www.he.net

                                                                <option value="google.com">www.google.com

                                                                <option value="easydns.com">www.easydns.com

                                                                <option value="no-ip.com">www.no-ip.com

                                                                <script>
                                                                var selectElement = document.getElementsByName("ddns_ServerName")[0];

                                                                        for (var i = 0; i < selectElement.options.length; i++)
                                                                        {
                                                                        if (selectElement.options[i].value == server_name)
                                                                                {
                                                                                        selectElement.options[i].selected = true;
                                                                                        break;
                                                                                }
                                                                        }
                                                                </script>
                                                                </SELECT>
                                                        </td>
                                                </tr>

                                                <tr height="30px">

                                                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">My Host Name </td>
                                                        <td align=left class="tabdata">
                                                                <INPUT TYPE="TEXT" NAME="sysDNSHost" SIZE="32" MAXLENGTH="63">
                                                                <script>
                                                                document.getElementsByName('sysDNSHost')[0].value = lookup_host;
                                                                </script>
                                                        </td>
                                                </tr>

                                                <tr height="30px">

                                                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Username </td>
                                                        <td align=left class="tabdata">
                                                                <INPUT TYPE="TEXT" NAME="sysDNSUser" SIZE="32" MAXLENGTH="31">
                                                                <script>
                                                                        document.getElementsByName('sysDNSUser')[0].value = username;
                                                                </script>
                                                        </td>
                                                </tr>

                                                <tr height="30px">

                                                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Password</td>
                                                        <td align=left class="tabdata">
                                                                <INPUT TYPE="PASSWORD" NAME="sysDNSPassword" SIZE="32" MAXLENGTH="31" VALUE="" >
                                                        </td>
                                                </tr>
                                        </table>
                                        </div>
                                                <div id="ddns_result" class="main_item" style="display:none;">
                                                <script>
                                                        if (ddns_active == "1") {
                                                                document.getElementById("ddns_result").style.display = "";
                                                        }
                                                </script>
                                                <table width="640px" border="0"  cellpadding="0" cellspacing="0" class="tabdata" style="margin:5px 0px;">
                                                        <tr height="25px" style="width:100%;background:#e6e6e6;">
                                                                <td align=left class="title-main" style="padding-left:20px;">Dynamic DNS Reporting</td>
                                                        </tr>
                                                </table>

                                        <div class="configstyle">
                                <table width="640px"  border="0" cellpadding="0" cellspacing="0" bordercolor="#CCCCCC"  >
                                        <tr  bgcolor=#FFFFFF height=35><td width="190" align=center class="tabdata" ><strong>Reported Address</strong></td>
                                                <td width="190" align=center class="tabdata"><strong>Time</strong></td>
                                                <td width="160" align=center class="tabdata"><strong>Report status</strong> </td>
                                        </tr>
                                        <tr  bgcolor=#FFFFFF height=35>
                                                <td name = "address" width="190" align=center class="tabdata" >
                                                <script>
                                                        document.write(address);
                                                </script>
                                                </td>
                                                <td name = "time" width="190" align=center class="tabdata">
                                                <script>
                                                        document.write(time);
                                                </script>
                                                </td>
                                                <td id = "report" width="160" align=center class="tabdata">
                                                <script>
                                                        document.write(report);
                                                </script>
                                                </td>
                                        </tr>
                                        </table>
                                        </div>
                                        </div>
                                        </div>
                                </div><!--block1-->
                                <div id="button0" class="main_item">
                                        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">

                                                <tr height="25px">
                                                        <td  align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Save" to save your settings</td>
                                                </tr>
                                        </table>
                                        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
                                                <tr height="40px">

                                                        <td colspan="2" align=left class="tabdata" style="padding-left:20px;">
                                                                <INPUT TYPE="SUBMIT" NAME="SaveBtn" class="button1" VALUE="Save" onClick=" return checkSubmit()">
                                                                <INPUT TYPE="HIDDEN" NAME="SaveFlag" VALUE="0">
                                                        </td>
                                                        <td id="firstDiv" style="float:left;"></td>
                                                </tr>


                                        </table>
                                </div>
                                </div>
                        </div>

                
                </form>
        </body>
</html>
