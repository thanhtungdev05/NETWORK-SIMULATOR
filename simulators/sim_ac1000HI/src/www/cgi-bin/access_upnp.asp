



<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">

*{color:  #404040;}

</style>
</head>

<script type="text/javascript" src="/spin.js" ></script>
<script language="JavaScript">

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

function showTable(id,header,data,keyIndex){
        var html = ["<table id=client_list  border=0  cellpadding=1 cellspacing=0  bordercolor=#CCCCCC width=640 >"];
        // 1.generate table header
        html.push("<tr bgcolor=#FFFFFF height=30>");
        for(var i =0; i<header.length; i++){
                html.push("<td width=" + header[i][0] + "  align=center class=tabdata>" +"<STRONG><FONT color=#000000>" +header[i][1] + "</td>");
        }
        html.push("</tr>");
        // 2.generate table data
        for(var i =0; i<data.length; i++){
                if(data[i][keyIndex] != "N/A"){
                        html.push("<tr bgcolor=#FFFFFF height=30 id=tablebutton>");
                        for(var j=0; j<(data[i].length - 1); j++){
                                html.push("<td align=center id=topborderstyle>" + data[i][j] + "</td>");
                        }
                        html.push('<td align=center id=topborderstyle> <INPUT TYPE="button" class="button3" NAME="RemoveBtn" VALUE="Remove" onClick=doDelete(' + data[i][j] + ');> </td>');
                        html.push("</tr>");
                }
        }
        html.push("</table>");
        document.getElementById(id).innerHTML = html.join('');
}

function doDelete(i)
 {
        document.UPnP_form.delnum.value=i;
        document.UPnP_form.submit();
}

function upnpOff(off)
{
        if(off)
        {
                document.getElementById("gleaf1").style.display="none";
                
                document.getElementById("upnp_list").style.display="none";
        }
        else
        {
                document.getElementById("gleaf1").style.display="";
                
                document.getElementById("upnp_list").style.display="";
        }
}
function doSubmit()
{
showSpin();
document.UPnP_form.SaveFlag.value = 1;
document.UPnP_form.submit();
}
</script>

        <body  style="background:#4acbd6;">
                <FORM METHOD="POST" ACTION="/cgi-bin/access_upnp.asp" name="UPnP_form">
                        <div id="pagestyle">
                                <div id="contenttype">
                                <div id="block1" class="main_item">
                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
                                                <tr height="25px" style="width:100%;background:#e6e6e6;">
                                                        <td  align="left" class="title-main" style="padding-left:20px;">Universal Plug & Play</td>
                                                </tr>
                                        </table>
                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
                                                <tr height="30px">
                                                        <td width="20px">&nbsp;</td>
                                                        <td width="250px" align=left class="tabdata">UPNP</td>
                                                        <td align=left class="tabdata">
                                                                <INPUT TYPE="RADIO" NAME="UPnP_active" VALUE="Yes" onClick="upnpOff(0)" checked >         
                                                                Enable 
                                                     
                                                                &nbsp;&nbsp;&nbsp;
                                                                <INPUT TYPE="RADIO" NAME="UPnP_active" VALUE="No" onClick="upnpOff(1)"  >         
                                                                Disable 
                                                        </td>
                                                </tr>
                                                
                                                        <tr height="30px" id="gleaf1">
                                                
                                                        <td width="20px">&nbsp;</td>
                                                        <td width="250px" align=left class="tabdata">Auto-configured</td>
                                                        <td align=left class="tabdata">
                                                                <INPUT NAME="UPnP_auto" TYPE="RADIO" VALUE="1" checked >        
                                                                Enable
                                                 
                                                                &nbsp;&nbsp;&nbsp;
                                                                <INPUT TYPE="RADIO" NAME="UPnP_auto" VALUE="0"  >         Disable &nbsp; 
                                                                (by UPnP-enabled Application) 
                                                        </td>
                                                </tr>
                                         
                                                
                                        </table>
                                </div>

                                <div id="block1" class="main_item">
                                        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
                                                <tr height="25px">

                                                        <td align=left class="title-main" style="padding-left:20px;">Click "Save" to save your settings</td>
                                                </tr>
                                        </table>
                                        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
                                                <tr height="40px" id="buttoncolor">
                                                        <td width="20px">&nbsp;</td>
                                                        <td align=left class="tabdata">
                                                                <INPUT TYPE="button" NAME="SaveBtn" class="button1" VALUE="Save" onClick="doSubmit();">
                                                                <INPUT TYPE="HIDDEN" NAME="SaveFlag" VALUE="0">
                                                        </td>
                                                        <td id="firstDiv" style="float:left;"></td>
                                                </tr>
                                        </table>
                                </div>
                        
                                <div id="upnp_list">
                        
                                        <div id="block1" class="main_item">
                                        <table width="640" border="0" cellpadding="0" cellspacing="0"  class="tabdata"  style="margin:5px 0px;">
                                                <tr height="25px" style="width:100%;background:#e6e6e6;">
                                                                <td align=left class="title-main" style="padding-left:20px;">UPnP List</td> 
                                                </tr>
                                        </table>
                                        <table width="640" border="0" cellpadding="0" cellspacing="0"  class="tabdata" style="table-layout: fixed;" >
                                                <tr height="30px">

                                                        <td colspan="2" align=left class="tabdata">
                                                                <INPUT TYPE="HIDDEN" NAME="delnum">
                                                                <div class="configstyle">
                                                                <div id=upnpdList></div>
                                                                </div>
                                                        </td>
                                                </tr>
                                        </table>
                                        </div>
                                </div>
                                </div>
                        </div>

                

                        <script language=JavaScript>
                                var tableHeader = [
                                        ["40","Index"],
                                        ["120","IP Address"],
                                        ["100","Protocol"],
                                        ["100","Internal Port"],
                                        ["100","External Port"],
                                        ["80","Edit"]
                                ];

                                var tableData = [
                                        ["1", "N/A","N/A","N/A","N/A","N/A"],
                                        ["2", "N/A","N/A","N/A","N/A","N/A"],
                                        ["3", "N/A","N/A","N/A","N/A","N/A"],
                                        ["4", "N/A","N/A","N/A","N/A","N/A"],
                                        ["5", "N/A","N/A","N/A","N/A","N/A"],
                                        ["6", "N/A","N/A","N/A","N/A","N/A"],
                                        ["7", "N/A","N/A","N/A","N/A","N/A"],
                                        ["8", "N/A","N/A","N/A","N/A","N/A"]
                                ];

                                showTable('upnpdList',tableHeader,tableData,2);
                        </script>
                </form>
        </body>
</html>
