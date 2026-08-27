

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=iso-8859-1">
<style  type="text/css">

*{color:  #404040;}

</style>

<script type="text/javascript" src="/spin.js" ></script>
<link rel="stylesheet" type="text/css" href="/style.css">
<script language='javascript'>

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
function doSave()
{
        showSpin();
        document.NAT_ALG_form.algFlag.value = 1;
        document.NAT_ALG_form.submit();
        return;
}
</script>
</head>

<body style="background:#4acbd6;">
<form name="NAT_ALG_form" method="post" ACTION="/cgi-bin/adv_nat_alg_switch.asp">
<INPUT TYPE="HIDDEN" NAME="algFlag" VALUE="0">
<div id="pagestyle">
        <div id="contenttype">
        <div id="block1" class="main_item">
                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0px;"  >
                  <tr height="25px" style="width:100%;background:#e6e6e6;">
                        <td  align="left" class="title-main" style="padding-left:20px;">ALG Switch</td>
                  </tr>
                 </table> 

                 <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"  >
                  <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">RTSP</td>
                        <td align=left class="tabdata">
       <input name="rtsp_active" type="radio" value="on" checked>
                                Enable
      &nbsp;&nbsp;&nbsp;&nbsp;<input name="rtsp_active" type="radio" value="off" >
         Disable
    </td>
 </tr>
                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">L2TP</td>
                        <td align=left class="tabdata">
       <input name="l2tp_active" type="radio" value="on" checked>
                        Enable
      &nbsp;&nbsp;&nbsp;&nbsp;<input name="l2tp_active" type="radio" value="off"  >
         Disable
    </td>
 </tr>
                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">PPTP</td>
                        <td align=left class="tabdata">
       <input name="pptp_active" type="radio" value="on" checked>
                        Enable
      &nbsp;&nbsp;&nbsp;&nbsp;<input name="pptp_active" type="radio" value="off"  >
         Disable
    </td>
 </tr>

                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">IPSEC</td>
                        <td align=left class="tabdata">
       <input name="ipsec_active" type="radio" value="on" checked>
                        Enable
      &nbsp;&nbsp;&nbsp;&nbsp;<input name="ipsec_active" type="radio" value="off"  >
         Disable
    </td>
 </tr>
 
                <tr height="30px" style="display:none;">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">SIP</td>
                        <td align=left class="tabdata">
                        <input name="sip_active" type="radio" value="on" checked>
                        Enable
        &nbsp;&nbsp;&nbsp;&nbsp;<input name="sip_active" type="radio" value="off"  >
         Disable
    </td>
 </tr>
                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">H323</td>
                        <td align=left class="tabdata">
       <input name="h323_active" type="radio" value="on" checked>
                        Enable
      &nbsp;&nbsp;&nbsp;&nbsp;<input name="h323_active" type="radio" value="off"  >
         Disable
    </td>
 </tr>
</table>
        </div>
 
        <div id="button0" class="main_item">
                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0px;" >
                <tr height="25px">
                        <td align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Save" to save your settings</td>
                </tr>
                </table>
                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"  >
                  <tr height="40px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">
                                <input type="button" name="SaveBtn" class="button1" value="Save" onClick="doSave();">
                                <input type="button" name="BackBtn" style="display:none;"value="Cancel" onClick="javascript:window.location='/cgi-bin/adv_nat_alg_switch.asp'">
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
