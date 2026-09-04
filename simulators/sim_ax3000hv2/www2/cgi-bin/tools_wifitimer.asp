


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
        <head>
                <meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
                <meta http-equiv=Content-Script-Type content=text/javascript>
                <meta http-equiv=Content-Style-Type content=text/css>
                <meta http-equiv=Content-Type content="text/html; charset=iso-8859-1">
                <!--<script language="JavaScript" src="OutVariant.asp"></script>-->
                <script language="JavaScript" src="/general.js"></script>
                <script language="JavaScript" src="/jsl.js"></script>
                <script language="JavaScript" src="/ip.js"></script>
                <style  type="text/css">
                        *{color:  #404040;}
                </style>

                <script type="text/javascript" src="/spin.js" ></script>
				<link rel="stylesheet" type="text/css" href="/style.css">
<script language="JavaScript">
var wifi_timer_en = "0";
var start_time = "0";
var end_time = "0";
var mon_val = "0";
var tue_val = "0";
var wed_val = "0";
var thu_val = "0";
var fri_val = "0";
var sat_val = "0";
var sun_val = "0";

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

function HiddenWiFiTimer(){
        if(document.tool_wifitimer.wifitimer_enable[0].checked)
                document.getElementById("hiddentimer").style.display="";
        else
                document.getElementById("hiddentimer").style.display="none";

}

function Timenumber(){
        var startnum=document.tool_wifitimer.starttime.value;
        var endnum=document.tool_wifitimer.endtime.value;
        var Stimedigits = startnum.split(":");
        var Stimenum1=Number(Stimedigits[0]);
        var Stimenum2=Number(Stimedigits[1]);

        var Etimedigits = endnum.split(":");
        var Etimenum1=Number(Etimedigits[0]);
        var Etimenum2=Number(Etimedigits[1]);
        if(document.tool_wifitimer.wifitimer_enable[0].checked)
        {
        if(startnum.indexOf(":")==-1)
        {
                alert("Invalid start time!");
                return false;
        }
        if(endnum.indexOf(":")==-1)
        {
                alert("Invalid end time!");
                return false;
        }
                if(!((Stimenum1>=0&&Stimenum1<=23)&&(Stimenum2>=0&&Stimenum2<=59)))
        {
                alert("Invalid start time!");
                return false;
        }
                if(!((Etimenum1>=0&&Etimenum1<=23)&&(Etimenum2>=0&&Etimenum2<=59)))
        {
                alert("Invalid end time!");
                return false;
        }
        }
        return true;
}

function uiSave(){
        if(Timenumber()==false)
                return;

        var mon = document.tool_wifitimer.mon;
        var tue = document.tool_wifitimer.tue;
        var wed = document.tool_wifitimer.wed;
        var thu = document.tool_wifitimer.thu;
        var fri = document.tool_wifitimer.fri;
        var sat = document.tool_wifitimer.sat;
        var sun = document.tool_wifitimer.sun;
        if(mon.checked)
                document.tool_wifitimer.mon_value.value=1;
        else
                document.tool_wifitimer.mon_value.value=0;

        if(tue.checked)
                document.tool_wifitimer.tue_value.value=1;
        else
                document.tool_wifitimer.tue_value.value=0;

        if(wed.checked)
                document.tool_wifitimer.wed_value.value=1;
        else
                document.tool_wifitimer.wed_value.value=0;

        if(thu.checked)
                document.tool_wifitimer.thu_value.value=1;
        else
                document.tool_wifitimer.thu_value.value=0;

        if(fri.checked)
                document.tool_wifitimer.fri_value.value=1;
        else
                document.tool_wifitimer.fri_value.value=0;

        if(sat.checked)
                document.tool_wifitimer.sat_value.value=1;
        else
                document.tool_wifitimer.sat_value.value=0;

        if(sun.checked)
                document.tool_wifitimer.sun_value.value=1;
        else
                document.tool_wifitimer.sun_value.value=0;

        if(document.tool_wifitimer.wifitimer_enable[0].checked)
        {
                if(!(mon.checked||tue.checked||wed.checked||thu.checked||fri.checked||sat.checked||sun.checked))
                {
                alert("Please choose date!");
                return;
                }
        }
        showSpin();
        document.tool_wifitimer.saveFlag.value=1;
        document.tool_wifitimer.submit();
}

</script>
        </head>

        <body onLoad="HiddenWiFiTimer()" style="background:#4acbd6;">
                <FORM METHOD="POST" ACTION="/cgi-bin/tools_wifitimer.asp" name="tool_wifitimer">
                        <div id="pagestyle">
                                <div id="contenttype">  
                                        <div id="block1" class="main_item">
                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed; margin:5px 0;">
                                                        <tr height="25px" style="background-color:#e6e6e6;">
                                                                <td align=left class="title-main" style="width:620px;padding-left:20px;">
                                                                        WiFi Timer Setting
                                                                </td>
                                                        </tr>
                                                </table>

                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
                                                        <tr height="30px">
                                                                <td align=left class="tabdata" style="width:250px;padding-left:20px;">WiFi Timer Status</td>
                                                                <td align=left class="tabdata">
                                                                        <INPUT TYPE="radio" NAME="wifitimer_enable" VALUE="1"  onClick="HiddenWiFiTimer();" > Enable&nbsp;&nbsp;&nbsp;&nbsp;         
                                                                        <INPUT TYPE="radio" NAME="wifitimer_enable" VALUE="0"  onClick="HiddenWiFiTimer();" > Disable 
																		<script>
																			if( wifi_timer_en != "1")
																			{
																				document.getElementsByName("wifitimer_enable")[0].checked = false;
																				document.getElementsByName("wifitimer_enable")[1].checked = true;
																			}
																			else
																			{
																				document.getElementsByName("wifitimer_enable")[0].checked = true;
																				document.getElementsByName("wifitimer_enable")[1].checked = false;
																			}
																		</script>
																</td>
                                                        </tr>
                                                </table>
                                        </div>

                                        <div id="block1">
                                                <div id="hiddentimer" class="main_item">
                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed; margin:5px 0;">
                                                        <tr height="25px" style="background-color:#e6e6e6;">
                                                                <td align=left class="title-main" style="width:620px;padding-left:20px;">
                                                                        Time Control setting
                                                                </td>
                                                        </tr>
                                                </table>

                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
                                                        <tr height="30px">
                                                                <td align=left class="tabdata" style="width:250px;padding-left:20px;">Start Time</td>
                                                                <td align=left class="tabdata">
                                                                        <INPUT TYPE="text" id="starttime" NAME="starttime" SIZE="7" MAXLENGTH="5"  VALUE="" > (hour:min)    
                                                                </td>
                                                        </tr>

                                                        <tr height="30px">
                                                                <td align=left class="tabdata" style="width:250px;padding-left:20px;">End Time</td>
                                                                <td align=left class="tabdata">
                                                                        <INPUT TYPE="text" id="endtime" NAME="endtime" SIZE="7" MAXLENGTH="5"  VALUE="" > (hour:min)    
																		<script>
																			if( start_time != "N/A")
																			{
																				document.getElementById("starttime").value = start_time;
																			}
																			if( end_time != "N/A")
																			{
																				document.getElementById("endtime").value = end_time;
																			}
																		</script>
																</td>
                                                        </tr>

                                                        <tr height="30px">
                                                                <td align=left class="tabdata" style="width:250px;padding-left:20px;">Choose Date</td>
                                                                <td align=left class="tabdata">
                                                                        <INPUT TYPE="checkbox" id="mon" NAME="mon"> Mon    
                                                                        <INPUT type="hidden" name="mon_value" id="mon_value" value="0">

                                                                        <INPUT TYPE="checkbox" id="tue" NAME="tue"> Tue    
                                                                        <INPUT type="hidden" name="tue_value" id="tue_value" value="0">

                                                                        <INPUT TYPE="checkbox" id="wed" NAME="wed"> Wed    
                                                                        <INPUT type="hidden" name="wed_value" id="wed_value" value="0">

                                                                        <INPUT TYPE="checkbox" id="thu" NAME="thu" > Thu    
                                                                        <INPUT type="hidden" name="thu_value" id="thu_value" value="0">

                                                                        <INPUT TYPE="checkbox" id="fri" NAME="fri" > Fri    
                                                                        <INPUT type="hidden" name="fri_value" id="fri_value" value="0">

                                                                        <INPUT TYPE="checkbox" id="sat" NAME="sat" > Sat    
                                                                        <INPUT type="hidden" name="sat_value" id="sat_value" value="0">

                                                                        <INPUT TYPE="checkbox" id="sun" NAME="sun" > Sun    
                                                                        <INPUT type="hidden" name="sun_value" id="sun_value" value="0">
																		<script>
																			if( mon_val != "N/A")
																			{
																				document.getElementById("mon_value").value = mon_val;
																				if(mon_val == "1"){
																					document.getElementById("mon").checked = true;
																				}
																			}
																			if( tue_val != "N/A")
																			{
																				document.getElementById("tue_value").value = tue_val;
																				if(tue_val == "1"){
																					document.getElementById("tue").checked = true;
																				}
																			}
																			if( wed_val != "N/A")
																			{
																				document.getElementById("wed_value").value = wed_val;
																				if(wed_val == "1"){
																					document.getElementById("wed").checked = true;
																				}
																			}
																			if( thu_val != "N/A")
																			{
																				document.getElementById("thu_value").value = thu_val;
																				if(thu_val == "1"){
																					document.getElementById("thu").checked = true;
																				}
																			}
																			if( fri_val != "N/A")
																			{
																				document.getElementById("fri_value").value = fri_val;
																				if(fri_val == "1"){
																					document.getElementById("fri").checked = true;
																				}
																			}
																			if( sat_val != "N/A")
																			{
																				document.getElementById("sat_value").value = sat_val;
																				if(sat_val == "1"){
																					document.getElementById("sat").checked = true;
																				}
																			}
																			if( sun_val != "N/A")
																			{
																				document.getElementById("sun_value").value = sun_val;
																				if(sun_val == "1"){
																					document.getElementById("sun").checked = true;
																				}
																			}
																		</script>
                                                                </td>
                                                        </tr>
                                                </table>
                                        </div>
                                        </div>

                                        <div id="button0" class="main_item">
                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
                                                        <tr height="25px">
                                                                <td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
                                                                        Click "Save" to save your settings
                                                                </td>
                                                        </tr>
                                                </table>

                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
                                                        <tr height="40px">
                                                                <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                                                                        <INPUT TYPE="HIDDEN" NAME="saveFlag" VALUE="0">
                                                                        <INPUT TYPE="button" class="button1" NAME="SaveBtn" VALUE="Save" onClick="uiSave()"> 
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
