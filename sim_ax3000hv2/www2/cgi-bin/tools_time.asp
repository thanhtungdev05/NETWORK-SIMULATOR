

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
        <head>
                <meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
                <meta http-equiv=Content-Script-Type content=text/javascript>
                <meta http-equiv=Content-Style-Type content=text/css>
                <meta http-equiv=Content-Type content="text/html; charset=UTF-8">
                <script language="JavaScript" src="/general.js"></script>
                <script language="JavaScript" src="/val.js"></script>
                <script language="JavaScript" type='text/javascript' src="/ip_new.js"></script>

                <style  type="text/css">
                        *{color:  #404040;}

                </style>
        </head>

<script type="text/javascript" src="/spin.js" ></script>
<link rel="stylesheet" type="text/css" href="/style.css">
        <SCRIPT language="javascript">
var cur_time = "Thu Jan  1 07:47:58 1970";
var tz_type='';
var tz_moth='';
var tz_date='';
var tz_year='';
var tz_hour='';
var tz_min='';
var tz_sec='';
var tz_zone='ICT-7';
var tz_server="vn.pool.ntp.org,asia.pool.ntp.org,2.openwrt.pool.ntp.org,3.openwrt.pool.ntp.org";

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

                function doSynchronize()
                {
                        if(document.Alpha_Time.uiViewSyncWith.value == "0" || document.Alpha_Time.uiViewSyncWith.value == "2")
                        {
                                doTimeChange();
                                doDisplay();
                        }
                        else if(document.Alpha_Time.uiViewSyncWith.value == "1")
                        {
                                syncwithpc();
                                doDisplay();
                        }
                        return;
                }

                function doTimeChange() 
                {
                        document.Alpha_Time.ToolsTimeSetFlag.value = 1;

                        //if(document.Alpha_Time.uiViewSyncWith[0].checked)
                        if(document.Alpha_Time.uiViewSyncWith.value == "0")
                                document.Alpha_Time.uiCurrentTime1.value =  document.Alpha_Time.uiCurTime.value;

                        if(document.Alpha_Time.uiCurrentTime1.value == "N/A (NTP server is connecting)")
                                document.Alpha_Time.uiCurrentTime1.value = "N/A (NTP server is connecting)";
                        else if(document.Alpha_Time.uiCurrentTime1.value == "N/A (Can't find NTP server)")
                                document.Alpha_Time.uiCurrentTime1.value = "N/A (Can't find NTP server)";
                 
                        return;
                }

                function isAsciiString(s) 
                {
                        var len= s.length;
                        var ch;

                        if(len == 0)
                                return false;

                        for( i=0; i< len; i++) 
                        {
                        ch= s.charCodeAt(i);
                        if(ch > 0x39 || ch < 0x30)
                                        return false;
                        }
                        return true;
                }

                function uiComputerTimeOnLoad() 
                {
                        var smtmp;
                        if(document.Alpha_Time.uiRadioValue.value != null )
                        {
                                smtmp = document.Alpha_Time.uiRadioValue.value;
                        }
                        else
                        {
                                return;
                        }

                        if(smtmp=="1")
                        {
                                syncwithpc();
                        }
                        else
                                return;
                }

                function syncwithpc() 
                {
                        var form=document.Alpha_Time;
                        theDate=(new Date()).getDate();
                        form.uiwPCdateDay.value = theDate;

                        theMonth=(new Date()).getMonth();
                        form.uiwPCdateMonth.value = theMonth;

                        theYear=(new Date()).getFullYear();
                        form.uiwPCdateYear.value = theYear;

                        theHour=(new Date()).getHours();
                        form.uiwPCdateHour.value = theHour;

                        theMinute=(new Date()).getMinutes();
                        form.uiwPCdateMinute.value = theMinute;

                        theSec=(new Date()).getSeconds();
                        form.uiwPCdateSec.value = theSec;

                        form.ToolsTimeSetFlag.value = 1;
                        uiShowNow();
                }

                function uiDoCancel() 
                {
                        document.location.href="/cgi-bin/tools_time.asp";
                }

                function isValidIpAddr(ip1,ip2,ip3,ip4) 
                {
                        alert("krammer is here!!");
                        if(ip1==0 || ip4==0 || ip4==255 || ip1==127)
                                return false;
                       return true;
                }

                function uiTimeSave() 
                {
                        var value;
                        var timestring;
                        var form=document.Alpha_Time;

                        if (form.uiViewSyncWith.value == "2")
                        {
                                day = form.uiPCdateDay.value;
                                value = parseInt(day);
                                if(isNaN(value))
                                {
                                        alert ("Invalid day!");
                                        return false;
                                }

                                month = form.uiPCdateMonth.value;
                                value = parseInt(month);
                                if(isNaN(value))
                                {
                                        alert ("Invalid month!");
                                        return false;
                                }

                                year = form.uiPCdateYear.value;
                                value = parseInt(year);
                                if(isNaN(value) || value > 2038 || value < 1970)
                                {
                                        alert ("Invalid year!");
                                        return false;
                                }

                                //if (!((1<=month) && (12>=month) && (31>=day) && (1<=day)) )
                                if ((day > 31) || (day < 1) ) 
                                {
                                        alert ("Invalid day!");
                                        return false;
                                }

                                if(month == 2)
                                {
                                        if((day == 29) && ((year % 4) != 0))
                                        {
                                                alert ("This is not a leap year!");
                                                return false;
                                        }
                                        if((day == 30) || (day == 31))
                                        {
                                                alert("The February never has this day!");
                                                return false;
                                        }
                                }
                                else if((month <= 7) && ((month % 2) ==0 ) && (day >= 31))
                                {
                                        alert ("This month is a small month!");
                                        return false;
                                }

                                /*if (!((year % 4)==0) && (month==2) && (day==29))
                                {
                                        alert ("This is not a leap year!");
                                        return false;
                                }

                                if ((month<=7) && ((month % 2)==0) && (day>=31))
                                {
                                        alert ("This month is a small month!");
                                        return false;

                                }*/

                                if ((month>=8) && ((month % 2)==1) && (day>=31))
                                {
                                        alert ("This month is a small month!");
                                        return false;
                                }

                                /*if ((month==2) && (day==30))
                                {
                                        alert("The February never has this day!");
                                        return false;
                                }*/

                                hour = form.uiPCdateHour.value;
                                if(isNaN(hour) || hour >23 || hour <0)
                                {
                                        alert ("Invalid hour!");
                                        return false;
                                }

                                min = form.uiPCdateMinute.value;
                                if(isNaN(min) || min >59 || min <0)
                                {
                                        alert ("Invalid minute!");
                                        return false;
                                }

                                sec = form.uiPCdateSec.value;
                                if(isNaN(sec) || sec >59 || sec <0)
                                {
                                        alert ("Invalid second!");
                                        return false;
                                }

                                timestring=year+"/"+month+"/"+day+" "+hour+":"+min+":"+sec
                                form.uiCurrentTime.value=timestring
                        }
                        else if (form.uiViewSyncWith.value == "0")
                        {
                                value = form.uiViewSNTPServer.value;

                                //if(value !="0.0.0.0")
                                //{
                                //      if (inValidIPAddr(value)){
                                //          alert("krammer is here!!");
                                //              return false;
                                //      }
                                //}

                        }
                        else if (form.uiViewSyncWith.value == "1")
                        {
                                syncwithpc();
                        }
                        showSpin();
                        form.SaveTime.value = 1;
                        form.submit();
                }

                /*
                function uiShowNow() {
                        var  now  =  new  Date();  
                        var  hh  =  now.getHours();  
                        var  mm  =  now.getMinutes();  
                        var  ss  =  now.getTime()  %  60000;  
                        ss  =  (ss  -  (ss  %  1000))  /  1000;  
                        var  clock  =  hh+':';  
                        if  (mm  <  10)  clock  +=  '0';  
                        clock  +=  mm+':';  
                        if  (ss  <  10)  clock  +=  '0';  
                        clock  +=  ss;  
                        document.Alpha_Time.uiCurrentTime.value = now.getYear() + "/" + (now.getMonth()+1) + "/" + now.getDate() + " " + clock;
                        setTimeout("uiShowNow()",1000);
                }*/

                function uiShowNow() 
                {
                        //if(document.Alpha_Time.uiViewSyncWith[1].checked)
                        if(document.Alpha_Time.uiViewSyncWith.value == "1")
                        { 
                                var  now  =  new  Date();
                                var  hh  =  now.getHours();  
                                var  mm  =  now.getMinutes();  
                                var  ss  =  now.getTime()  %  60000;  
                                ss  =  (ss  -  (ss  %  1000))  /  1000;  
                                var  clock  =  hh+':';  
                                if  (mm  <  10)  clock  +=  '0';  
                                        clock  +=  mm+':';  
                                if  (ss  <  10)  clock  +=  '0';  
                                        clock  +=  ss;  
                                document.Alpha_Time.uiCurrentTime.value = now.getYear() + "/" + (now.getMonth()+1) + "/" + now.getDate() + " " + clock;
                                document.Alpha_Time.uiCurrentTime1.value = now.toString();
                        }
                        else
                        {
                                document.Alpha_Time.uiCurrentTime1.value =  document.Alpha_Time.uiCurTime.value;
                        }

                        if(document.Alpha_Time.uiCurrentTime1.value == "N/A (NTP server is connecting)")
                                document.Alpha_Time.uiCurrentTime1.value = "N/A (NTP server is connecting)";
                        else if(document.Alpha_Time.uiCurrentTime1.value == "N/A (Can't find NTP server)")
                                document.Alpha_Time.uiCurrentTime1.value = "N/A (Can't find NTP server)";
                }

                function doDisplay()
                {
                        //if(document.Alpha_Time.uiViewSyncWith[0].checked) 
                        if(document.Alpha_Time.uiViewSyncWith.value == "0") 
                        {
                                setDisplay('timezone_ntp_div0',1);
                                setDisplay('timezone_manual_div2',0);
                        }
                        //else if(document.Alpha_Time.uiViewSyncWith[1].checked)
                        else if(document.Alpha_Time.uiViewSyncWith.value == "1")
                        {
                                setDisplay('timezone_ntp_div0',0);
                                setDisplay('timezone_manual_div2',0);
                        }
                        //else if(document.Alpha_Time.uiViewSyncWith[2].checked)
                        else if(document.Alpha_Time.uiViewSyncWith.value == "2")
                        {
                                setDisplay('timezone_ntp_div0',0);
                                setDisplay('timezone_manual_div2',1);
                        }
                }

                function startRefeshForNtp()
                {
                        var str1="N/A (NTP server is connecting)";
                        var str2="N/A (Can't find NTP server)";

                        var str3=document.Alpha_Time.uiCurrentTime1.value;

                        setTimeout("startRefeshForNtp()",10000);

                        if( (!document.Alpha_Time.uiViewSyncWith[0].checked) || (document.Alpha_Time.uiTimezoneType.value != "0") )
                                return ;

                        if(str1 == str3 || str2 == str3)
                                document.location.href="/cgi-bin/tools_time.asp";
                }
        </SCRIPT>

        <body onLoad="uiComputerTimeOnLoad();doDisplay();uiShowNow();setTimeout('startRefeshForNtp()',10000);" style="background:#4acbd6;">
                <FORM METHOD="POST" ACTION="/cgi-bin/tools_time.asp" name="Alpha_Time">
                        <div id="pagestyle">
                                <div id="contenttype">
                                        <div id="block1">
										<div class="main_item">
                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
                                                        <INPUT TYPE="HIDDEN" name="SaveTime" VALUE="0">
                                                        <INPUT TYPE="HIDDEN" id="uiCurrentTime" name="uiCurrentTime2">
                                                        <tr height="25px" style="background-color:#e6e6e6;">
                                                                <td width="20px">&nbsp;</td>
                                                                <td colspan="2" align="left" valign="middle" class="title-main">Time Zone</td>
                                                        </tr>
                                                </table>

                                                <table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
                                                        <tr height="30px">
                                                                <td width="20px">&nbsp;</td>
                                                                <td width="250px" align=left class="tabdata">Current Date/Time</td>
                                                                <td align=left class="tabdata">
                                                                        <input type="text" id="uiCurrentTime1" name="uiCurrentTime1" size="40" maxlength="40" onFocus="document.Alpha_Time.SaveBtn.focus()" style="background-color:transparent;border:0" disabled>
                                                                </td>
                                                        </tr>
                                                </table>
											</div>
											<div class="main_item">
                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
                                                        <!--sub title -->
                                                        <tr height="25px" style="background-color:#e6e6e6;">
                                                                <td width="20px">&nbsp; </td>
                                                                <td colspan="2" align=left  class="title-main">Time Synchronization</td>
                                                                <INPUT TYPE="HIDDEN" NAME="ToolsTimeSetFlag" VALUE="0">
																<INPUT TYPE="HIDDEN" NAME="uiRadioValue" VALUE="0">
                                                                <INPUT TYPE="HIDDEN" NAME="uiClearPCSyncFlag" VALUE="0">
                                                               <INPUT TYPE="HIDDEN" NAME="uiwPCdateMonth" VALUE="0">
                                                               <INPUT TYPE="HIDDEN" NAME="uiwPCdateDay" VALUE="">
                                                               <INPUT TYPE="HIDDEN" NAME="uiwPCdateYear" VALUE="">
                                                               <INPUT TYPE="HIDDEN" NAME="uiwPCdateHour" VALUE="">
                                                               <INPUT TYPE="HIDDEN" NAME="uiwPCdateMinute" VALUE="">
                                                               <INPUT TYPE="HIDDEN" NAME="uiwPCdateSec" VALUE="">
                                                               <INPUT TYPE="HIDDEN" id="uiCurTime" NAME="uiCurTime" VALUE="" style="background-color:transparent;border:0" disabled>
                                                               <INPUT TYPE="HIDDEN" id="uiTimezoneType" NAME="uiTimezoneType" VALUE="">
															   <script>
																	if( cur_time != "N/A")
																	{
																		document.getElementById("uiCurTime").value = cur_time;
																	}
																	if( tz_type != "N/A")
																	{
																		document.getElementById("uiTimezoneType").value = tz_type;
																	}
																</script>
															   
                                                        </tr>
                                                </table>

                                                <table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
                                                        <tr height="30px">
                                                                <td width="20px">&nbsp;</td>
                                                                <td width="250px" align=left class="tabdata">Synchronize time with</td>
                                                                <td align=left class="tabdata">
                                                                        <select id="uiViewSyncWith" NAME="uiViewSyncWith" SIZE="1" onChange="doSynchronize()">
                                                                                <OPTION value="0" >
                                                                                NTP Server automatically 
                                                             
                                                                                <OPTION value="1" >
                                                                                PC's Clock

                                                                                <OPTION value="2" >
                                                                                Manually
																			<script>
																				var select = document.getElementById("uiViewSyncWith");
																				select.selectedIndex = parseInt(tz_type);
																			</script>
																		</select>
                                                             
                                                                        
                                                                </td>
                                                        </tr>
                                                </table>
         
                                                <div id="timezone_manual_div2">
                                                        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
                                                                <tr height="30px">
                                                                        <td width="20px">&nbsp;</td>
                                                                        <td width="250px" align=left class="tabdata">Date</td>
                                                                        <td align=left class="tabdata">
                                                                                <select id="uiPCdateMonth"  NAME="uiPCdateMonth" SIZE="1">
                                                                                     <option VALUE=1>1
                                                                                     <option VALUE=2>2
                                                                                     <option VALUE=3>3
                                                                                     <option VALUE=4>4
                                                                                     <option VALUE=5>5
                                                                                     <option VALUE=6>6
                                                                                     <option VALUE=7>7
                                                                                     <option VALUE=8>8
                                                                                     <option VALUE=9>9
                                                                                     <option VALUE=10>10
                                                                                     <option VALUE=11>11
                                                                                     <option VALUE=12>12
                                                                                </SELECT>
                                                                                /
                                                                                <input type="text" id="uiPCdateDay" name="uiPCdateDay" size="2" maxlength="2" value="">
                                                                                /
                                                                                <input type="text" id="uiPCdateYear" name="uiPCdateYear" size="4" maxlength="4" value="">
                                                                                (Month/Date/Year)         
                                                                        </td>
                                                                </tr>

                                                                <tr height="30px">
                                                                        <td width="20px">&nbsp;</td>
                                                                        <td width="250px" align=left class="tabdata">Time</td>
                                                                        <td align=left class="tabdata">
                                                                                <input type="text" id="uiPCdateHour" name="uiPCdateHour" size="2" maxlength="2" value="" onkeyup="(this.v=function(){this.value=this.value.replace(/[^0-9-]+/,'');}).call(this)" onblur="this.v();">
                                                                                <input type="text" id="uiPCdateMinute" name="uiPCdateMinute" size="2" maxlength="2" value="" onkeyup="(this.v=function(){this.value=this.value.replace(/[^0-9-]+/,'');}).call(this)" onblur="this.v();">      
                                                                                <input type="text" id="uiPCdateSec" name="uiPCdateSec" size="2" maxlength="2" value="" onkeyup="(this.v=function(){this.value=this.value.replace(/[^0-9-]+/,'');}).call(this)" onblur="this.v();">      
                                                                                (hour:min:sec)
                                                                        </td>
                                                                </tr>

                                                                <script language="JavaScript" type="text/JavaScript">
                                                                        var strmonth = tz_moth;
                                                                        var strdate = tz_date;
                                                                        var stryear = tz_year;
                                                                        var strhour = tz_hour;
                                                                        var strmin = tz_min;
                                                                        var strsec = tz_sec;

                                                                        if(strmonth != "N/A")
                                                                                document.Alpha_Time.uiPCdateMonth.selectedIndex = parseInt(strmonth) - 1;
                                                                        if(strdate != "N/A")
                                                                                document.Alpha_Time.uiPCdateDay.value = strdate;
                                                                        if(stryear != "N/A")
                                                                                document.Alpha_Time.uiPCdateYear.value = stryear;
                                                                        if(strhour != "N/A")
                                                                                document.Alpha_Time.uiPCdateHour.value = strhour;
                                                                        if(strmin != "N/A")
                                                                                document.Alpha_Time.uiPCdateMinute.value = strmin;
                                                                        if(strsec != "N/A")
                                                                                document.Alpha_Time.uiPCdateSec.value = strsec;
                                                                </script>
                                                        </table>
                                                </div>

                                                <div id="timezone_ntp_div0">
                                                        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
                                                                <tr height="30px">
                                                                        <td width="20px">&nbsp;</td>
                                                                        <td width="250px" align=left class="tabdata">Time Zone</td>
                                                                        <td align=left class="tabdata">
                                                                                <SELECT NAME="uiViewdateToolsTZ" SIZE="1" style="width:330px;" disabled>
                                                                                     <option value="GMT-12:00" >(GMT-12:00) Enewetak, Kwajalein
                                                                                     <option value="GMT-11:00" >(GMT-11:00) Midway Island, Samoa
                                                                                     <option value="GMT-10:00" >(GMT-10:00) Hawaii
                                                                                     <option value="GMT-09:00" >(GMT-09:00) Alaska
                                                                                     <option value="GMT-08:00" >(GMT-08:00) Pacific Time (US,Canada)
                                                                                     <option value="GMT-07:00" >(GMT-07:00) Mountain Time (US & Canada)
                                                                                     <option value="GMT-06:00" >(GMT-06:00) Central Time (US & Canada), Maxico City, Saskatchewan
                                                                                     <option value="GMT-05:00" >(GMT-05:00) Eastern Time (US & Canada), Indiana(East)
                                                                                     <option value="GMT-04:00" >(GMT-04:00) Altlantic Time (Canada), Caracas, La Poz
                                                                                     <option value="GMT-03:30" >(GMT-03:30) Newfoundland
                                                                                     <option value="GMT-03:00" >(GMT-03:00) Brasilia, Buenos Aires, Georgetown
                                                                                     <option value="GMT-02:00" >(GMT-02:00) Mid-Atlantic
                                                                                     <option value="GMT-01:00" >(GMT-01:00) Azores, Cape Verde Is
                                                                                     <option value="GMT" >(GMT) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London
                                                                                     <option value="GMT+01:00" >(GMT+01:00) Berlin, Stockholm, Rome, Bern, Brussels, Vienna
                                                                                     <option value="GMT+02:00" >(GMT+02:00) Athens, Helsinki, Istanbul, Cairo, Eastern Europe, Israel
                                                                                     <option value="GMT+03:00" >(GMT+03:00) Baghdad, Kuwait, Nairobi, Riyadh, Moscow
                                                                                     <option value="GMT+03:30" >(GMT+03:30) Tehran
                                                                                     <option value="GMT+04:00" >(GMT+04:00) Abu Dhabi, Muscat, Tbilisi, Kazan, Volgograd
                                                                                     <option value="GMT+04:30" >(GMT+04:30) Kabul
                                                                                     <option value="GMT+05:00" >(GMT+05:00) Islamabad, Karachi, Ekaterinburg, Tashkent
                                                                                     <option value="GMT+05:30" >(GMT+05:30) New Delhi
                                                                                     <option value="GMT+06:00" >(GMT+06:00) Almaty, Dhaka
                                                                                     <option value="GMT+06:30" >(GMT+06:30) Yangon(Rangoon)
                                                                                     <option value="ICT-7" selected>(GMT+07:00) Bangkok, Jakarta, Hanoi
                                                                                     <option value="GMT+08:00" >(GMT+08:00) Beijing, Hong Kong, Perth, Singapore, Taipei
                                                                                     <option value="GMT+09:00" >(GMT+09:00) Tokyo, Osaka, Sapporo, Seoul, Yakutsk
                                                                                     <option value="GMT+09:30" >(GMT+09:30) Adelaide, Darwin
                                                                                     <option value="GMT+10:00" >(GMT+10:00) Brisbane, Canberra, Melbourne, Sydney, Hobart
                                                                                     <option value="GMT+11:00" >(GMT+11:00) Magadan, Solomon Is., New Caledonia
                                                                                     <option value="GMT+12:00" >(GMT+12:00) Fiji, Kamchatka, Marshall Is., Wellington, Auckland
                                                                                     <option value="GMT+13:00" >(GMT+13:00) Samoa, Nuku'alofa
                                                                                </SELECT> 
                                                                        </td>
                                                                </tr>

                                                                <tr height="30px">
                                                                        <td width="20px">&nbsp;</td>
                                                                        <td width="250px" align=left class="tabdata">NTP Server Address</td>
                                                                        <td align=left class="tabdata">
                                                                                <INPUT TYPE="TEXT" id="uiViewSNTPServer" NAME="uiViewSNTPServer" SIZE="24" MAXLENGTH="48" VALUE="" >
                                                                        <script>
																			var tz_server_array = tz_server.split(",");
																			if(tz_server_array[0] != "N/A" && tz_server_array[0] != undefined)
																				document.getElementById("uiViewSNTPServer").value = tz_server_array[0];
																		</script>
																		</td>
                                                                </tr>

                                                                
                                                                        <tr height="30px">
                                                                                <td width="20px">&nbsp;</td>
                                                                                <td width="250px" align=left class="tabdata">NTP Server2 Address</td>
                                                                                <td align=left class="tabdata">
                                                                                     <INPUT TYPE="TEXT" id="uiViewSNTPServer2" NAME="uiViewSNTPServer2" SIZE="24" MAXLENGTH="48" VALUE="" >
                                                                                </td>
																			<script>
																				var tz_server_array = tz_server.split(",");
																				if(tz_server_array[1] != "N/A" && tz_server_array[1] != undefined)
																					document.getElementById("uiViewSNTPServer2").value = tz_server_array[1];
																			</script>
                                                                        </tr>
                                                                
                                                        </table>
                                                </div>
											</div>
                                        </div>

                                        <div id="button0" class="main_item">
                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
                                                        <tr height="25px">
                                                                <td width="20px">&nbsp;</td>
                                                                <td colspan="2" align="left" class="title-main">Click "Save" to save your settings</td>
                                                        </tr>
                                                </table>

                                                <table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
                                                        <tr height="30px">
                                                                <td width="20px">&nbsp;</td>
                                                                <td colspan="2" align=left class="tabdata">
                                                                        <INPUT TYPE="BUTTON" NAME="SaveBtn" class="button1" VALUE="Save" onClick="uiTimeSave()">
                                                                </td>
                                                                <td align=left class="tabdata" style="display:none">
                                                                        <INPUT TYPE="BUTTON" NAME="CancelBtn" class="button1" VALUE="Cancel" onClick="uiDoCancel()">
                                                                </td>
                                                                <td id="firstDiv" style="float:left;"></td>
                                                                <INPUT TYPE="HIDDEN" NAME="ntp2ServerFlag" VALUE="Yes">
                                                                <INPUT TYPE="HIDDEN" NAME="ntp3ServerFlag" VALUE="">
                                                        </tr>
                                                </table>
                                        </div>
                                </div>
                        </div>

                

                </form>
        </body>
</html>
