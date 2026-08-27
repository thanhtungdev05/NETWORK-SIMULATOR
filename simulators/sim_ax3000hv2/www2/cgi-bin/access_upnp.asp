



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
var intaddr="N/A";
var proto="N/A";
var intport="N/A";
var extport="N/A";
var intaddr1="N/A";
var proto1="N/A";
var intport1="N/A";
var extport1="N/A";
var intaddr2="N/A";
var proto2="N/A";
var intport2="N/A";
var extport2="N/A";
var intaddr3="N/A";
var proto3="N/A";
var intport3="N/A";
var extport3="N/A";
var intaddr4="N/A";
var proto4="N/A";
var intport4="N/A";
var extport4="N/A";
var intaddr5="N/A";
var proto5="N/A";
var intport5="N/A";
var extport5="N/A";
var intaddr6="N/A";
var proto6="N/A";
var intport6="N/A";
var extport6="N/A";
var intaddr7="N/A";
var proto7="N/A";
var intport7="N/A";
var extport7="N/A";
var uci_upnp_status='1';


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
                // document.getElementById("gleaf1").style.display="none";
                
                document.getElementById("upnp_list").style.display="none";
        }
        else
        {
                // document.getElementById("gleaf1").style.display="none";
                
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
                                                                <INPUT TYPE="RADIO" NAME="UPnP_active" VALUE="Yes" onClick="upnpOff(0)">
                                                                Enable

                                                                &nbsp;&nbsp;&nbsp;
                                                                <INPUT TYPE="RADIO" NAME="UPnP_active" VALUE="No" onClick="upnpOff(1)">
                                                                Disable
                                                                <script>
                                                                        if (uci_upnp_status == "1") {
                                                                                document.getElementsByName("UPnP_active")[0].checked = true;
                                                                                document.getElementsByName("UPnP_active")[1].checked = false;
                                                                        } else {
                                                                                document.getElementsByName("UPnP_active")[0].checked = false;
                                                                                document.getElementsByName("UPnP_active")[1].checked = true;
                                                                        }
                                                                </script>
                                                        </td>
                                                </tr>
                                                <!-- 
                                                        <tr height="30px" id="gleaf1" style="display:none;">
                                                
                                                        <td width="20px">&nbsp;</td>
                                                        <td width="250px" align=left class="tabdata">Auto-configured</td>
                                                        <td align=left class="tabdata">
                                                                <INPUT NAME="UPnP_auto" TYPE="RADIO" VALUE="1"  >
                                                                Enable

                                                                &nbsp;&nbsp;&nbsp;
                                                                <INPUT TYPE="RADIO" NAME="UPnP_auto" VALUE="0"  >         Disable &nbsp;
                                                                (by UPnP-enabled Application)
                                                        </td>
                                                </tr> -->
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

                        <div id="upnp_list" style="display:none;">
                        <script>
                                if(uci_upnp_status == "1")
                                {
                                        document.getElementById("upnp_list").style.display="";
                                }
                        </script>
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

                <!--  -->

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
                                        ["1", intaddr, proto, intport, extport, "1"],
                                        ["2", intaddr1, proto1, intport1, extport1, "2"],
                                        ["3", intaddr2, proto2, intport2, extport2, "3"],
                                        ["4", intaddr3, proto3, intport3, extport3, "4"],
                                        ["5", intaddr4, proto4, intport4, extport4, "5"],
                                        ["6", intaddr5, proto5, intport5, extport5, "6"],
                                        ["7", intaddr6, proto6, intport6, extport6, "7"],
                                        ["8", intaddr7, proto7, intport7, extport7, "8"]
                                ];
                                showTable('upnpdList',tableHeader,tableData,2);
                        </script>
                </form>
        </body>
</html>
