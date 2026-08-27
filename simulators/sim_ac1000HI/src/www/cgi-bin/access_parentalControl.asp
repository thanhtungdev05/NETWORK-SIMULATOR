


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
        <head>
                <meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
                <meta http-equiv=Content-Script-Type content=text/javascript>
                <meta http-equiv=Content-Style-Type content=text/css>
                <meta http-equiv=Content-Type content="text/html; charset=iso-8859-1">
                <script language="JavaScript" src="OutVariant.asp"></script>
                <script language="JavaScript" src="/general.js"></script>
                <script language="JavaScript" src="/jsl.js"></script>
                <script language="JavaScript" src="/ip.js"></script>
                <link rel="stylesheet" type="text/css" href="/style.css">
				<style  type="text/css">
                        *{color:  #404040;}
                </style>

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

var time_list_obj = [
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"],
						["N/A", "N/A", "N/A"]
					];
					
var host_list_obj = [
						["Admin-PC","D8:43:AE:2E:65:45"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"],
						["N/A","N/A"]
					];

function doTimerDelete(i)
 {
        document.access_parentalControl.delTimerNum.value=i;
        document.access_parentalControl.submit();
}

function writeDeviceNameTable()
{
        if ('undefined' == typeof(host_list_obj[0][0])) return;
        var strtemp = "";
        for (var i = 0; i < host_list_obj.length; i++) {
                if (host_list_obj[i][0] != "" && host_list_obj[i][0] != "N/A" && !(host_list_obj[i][0].match(/^[ ]*$/))) {//match(/^[ ]*$/) mach kongge
					strtemp += '<OPTION value=' + host_list_obj[i][1] + '>' + host_list_obj[i][0] + '</OPTION>';
                        
				}
				else if (host_list_obj[i][1] != "" && host_list_obj[i][1] != "N/A") {
					var tmpname = host_list_obj[i][1].replace(/:/g,'-');//replace all : by -
					strtemp += '<OPTION value=' + host_list_obj[i][1] + '>' + tmpname + '</OPTION>';
				}
        }
        document.write(strtemp);
}

function writeTimingTable()
{
        if ('undefined' == typeof(time_list_obj[0][0])) return;
        var strtemp = "";
        for (var i = 0; i < time_list_obj.length; i++) {
                if (time_list_obj[i][0] != "" && time_list_obj[i][0] != "N/A") {
                        strtemp += '<tr height=30><td align="center" class="topborderstyle">' + time_list_obj[i][0] + '</td>\n';
						
						var weekdaysInEn = "";
						if(time_list_obj[i][1].indexOf("1") != -1)
						{
							if(weekdaysInEn.length == 0)
								weekdaysInEn = "Mon";
							else
								weekdaysInEn = weekdaysInEn + ",Mon";
						}
						if(time_list_obj[i][1].indexOf("2") != -1)
						{
							if(weekdaysInEn.length == 0)
								weekdaysInEn = "Tue";
							else
								weekdaysInEn = weekdaysInEn + ",Tue";
						}
						if(time_list_obj[i][1].indexOf("3") != -1)
						{
							if(weekdaysInEn.length == 0)
								weekdaysInEn = "Wed";
							else
								weekdaysInEn = weekdaysInEn + ",Wed";
						}
						if(time_list_obj[i][1].indexOf("4") != -1)
						{
							if(weekdaysInEn.length == 0)
								weekdaysInEn = "Thu";
							else
								weekdaysInEn = weekdaysInEn + ",Thu";
						}
						if(time_list_obj[i][1].indexOf("5") != -1)
						{
							if(weekdaysInEn.length == 0)
								weekdaysInEn = "Fri";
							else
								weekdaysInEn = weekdaysInEn + ",Fri";
						}
						if(time_list_obj[i][1].indexOf("6") != -1)
						{
							if(weekdaysInEn.length == 0)
								weekdaysInEn = "Sat";
							else
								weekdaysInEn = weekdaysInEn + ",Sat";
						}
						if(time_list_obj[i][1].indexOf("7") != -1)
						{
							if(weekdaysInEn.length == 0)
								weekdaysInEn = "Sun";
							else
								weekdaysInEn = weekdaysInEn + ",Sun";
						}
						
                        strtemp += '<td align="center" class="topborderstyle">' + weekdaysInEn + '</td>\n';
                        strtemp += '<td align="center" class="topborderstyle">' + time_list_obj[i][2] + '</td>';
						strtemp += '<td align="center" class="topborderstyle"><INPUT TYPE="button" class="button3" NAME="RemoveBtn" VALUE="Remove" onClick="doTimerDelete(' + i + ');"></td></tr>\n';
                }
        }
        document.write(strtemp);
}

var url_list_obj = [
						["N/A", "N/A"],
						["N/A", "N/A"],
						["N/A", "N/A"],
						["N/A", "N/A"],
						["N/A", "N/A"],
						["N/A", "N/A"],
						["N/A", "N/A"],
						["N/A", "N/A"]
					];

function doURLDelete(i)
 {
        document.access_parentalControl.delURLNum.value=i;
        document.access_parentalControl.submit();
}

function writeURLTable()
{
		if ('undefined' == typeof(url_list_obj[0][0])) return;
        var strtemp = "";
        for (var i = 0; i < url_list_obj.length; i++) {
                if (url_list_obj[i][0] != "" && url_list_obj[i][0] != "N/A") {
                        strtemp += '<tr height=30><td align="center" class="topborderstyle">' + url_list_obj[i][0] + '</td>\n';
                        strtemp += '<td align="center" class="topborderstyle">' + url_list_obj[i][1] + '</td>\n';
						strtemp += '<td align="center" class="topborderstyle"><INPUT TYPE="button" class="button3" NAME="RemoveBtn" VALUE="Remove" onClick="doURLDelete(' + i + ');"></td></tr>\n';
                }
        }
        document.write(strtemp);
}

function doHexCheck(c)
{
  if ( (c >= "0") && (c <= "9") )
    return 1;
  else if ( (c >= "A") && (c <= "F") )
    return 1;
  else if ( (c >= "a") && (c <= "f") )
    return 1;

  return -1;
}

function doMACcheck(object)
{
	var szAddr = object.value;
	var len = szAddr.length;

	if(len==0)
	{
		alert("Empty MAC Address!");
		return -1;
	}

	if(len==12)
	{
		var newAddr = "";
		var i = 0;

		for(i=0; i<len; i++)
		{
				var c = szAddr.charAt(i);

				if(doHexCheck(c) < 0)
				{
					alert("Invalid MAC Address");
					object.focus();
					return -1;
				}
				if((i == 2)||(i == 4)||(i == 6)||(i == 8)||(i == 10))
				{
					newAddr = newAddr + ":";
				}
				newAddr = newAddr + c;
		}
		object.value = newAddr;
		return 0;
	}
	else if ( len == 17 )
	{
		var i = 2;
		var c0 = szAddr.charAt(0);
		var c1 = szAddr.charAt(1);

		if ((doHexCheck(c0) < 0)||(doHexCheck(c1) < 0))
		{
			alert("Invalid MAC Address");
			object.focus();
			return -1;
		}

		i = 2;
		while (i<len)
		{
			var c0 = szAddr.charAt(i);
			var c1 = szAddr.charAt(i+1);
			var c2 = szAddr.charAt(i+2);

			if ((c0 != ":")||(doHexCheck(c1)<0)||(doHexCheck(c2)<0))
			{
					alert("Invalid MAC Address");
					object.focus();
					return -1;
			}
			i = i + 3;
		}
		if((szAddr == "00:00:00:00:00:00") || (szAddr.toUpperCase() == "FF:FF:FF:FF:FF:FF"))
		{
			alert("Invalid MAC Address");
			object.focus();
			return -1;
		}
		return 0; 
	}
	else
	{
		alert("Invalid MAC Address");
		object.focus();
		return -1;
	}
}

function addTimer(){
        //if(Timenumber()==false)
        //        return;
		var colums = document.getElementById("timer_list").rows.length;
		if ( colums >= 32 )
		{
			alert("Up to 32 Timers can be configured");
			return;
		}

        var mon = document.access_parentalControl.mon;
        var tue = document.access_parentalControl.tue;
        var wed = document.access_parentalControl.wed;
        var thu = document.access_parentalControl.thu;
        var fri = document.access_parentalControl.fri;
        var sat = document.access_parentalControl.sat;
        var sun = document.access_parentalControl.sun;
		var tmpWeekdays = "";
        
		if(mon.checked)
        {
			if(tmpWeekdays.length == 0)
				tmpWeekdays = "1";
			else
				tmpWeekdays = tmpWeekdays + ",1";
		}

        if(tue.checked)
        {
			if(tmpWeekdays.length == 0)
				tmpWeekdays = "2";
			else
				tmpWeekdays = tmpWeekdays + ",2";
		}

        if(wed.checked)
        {
			if(tmpWeekdays.length == 0)
				tmpWeekdays = "3";
			else
				tmpWeekdays = tmpWeekdays + ",3";
		}

        if(thu.checked)
        {
			if(tmpWeekdays.length == 0)
				tmpWeekdays = "4";
			else
				tmpWeekdays = tmpWeekdays + ",4";
		}

        if(fri.checked)
        {
			if(tmpWeekdays.length == 0)
				tmpWeekdays = "5";
			else
				tmpWeekdays = tmpWeekdays + ",5";
		}

        if(sat.checked)
        {
			if(tmpWeekdays.length == 0)
				tmpWeekdays = "6";
			else
				tmpWeekdays = tmpWeekdays + ",6";
		}

        if(sun.checked)
        {
			if(tmpWeekdays.length == 0)
				tmpWeekdays = "7";
			else
				tmpWeekdays = tmpWeekdays + ",7";
		}

        //if(document.access_parentalControl.wifitimer_enable[0].checked)
        {
			if(!(mon.checked||tue.checked||wed.checked||thu.checked||fri.checked||sat.checked||sun.checked))
			{
                alert("Please choose date!");
                return;
			}
        }
		
		//var newTimerange = document.access_parentalControl.starttime + "-" + document.access_parentalControl.endtime;
		var newTimeStart = document.access_parentalControl.start_hour.value + ":" + document.access_parentalControl.start_minute.value;
		var newTimeEnd = document.access_parentalControl.end_hour.value + ":" + document.access_parentalControl.end_minute.value;
		var newTimerange = newTimeStart + "-" + newTimeEnd;
		//var newDevName = document.access_parentalControl.timer_device_select.value;
		//var newMacs = newDevName.replace("-",":");
		if(	document.access_parentalControl.timer_device_select.value == "other")
		{
			if(doMACcheck(document.access_parentalControl.timer_MacAddrTXT) == -1)
			{
				return;
            }
			var newMacs = document.access_parentalControl.timer_MacAddrTXT.value; // é€‰ä¸­å€¼
			var newDevName = newMacs.replace(/:/g,'-');
		}
		else
		{
			var timerObj = document.access_parentalControl.timer_device_select;//document.getElementByIdx_x("timer_device_select"); //å®šä½id
			var index = timerObj.selectedIndex; // é€‰ä¸­ç´¢å¼•
			var newDevName = timerObj.options[index].text; // é€‰ä¸­æ–‡æœ¬
			var newMacs = timerObj.options[index].value; // é€‰ä¸­å€¼
		}
		
		//for (var i = 0; i < 32; i++ )
		for (var i = 0; i < time_list_obj.length; i++ )
		{
			var tmp_weekday = time_list_obj[i][1];
			var tmp_time = time_list_obj[i][2];
			var tmp_devname = time_list_obj[i][0];
			var tmp_mac = time_list_obj[i][0].replace(/-/g,":");
			if ( tmp_weekday != '' && tmp_weekday != undefined &&
				tmp_time != '' && tmp_time != undefined &&
				tmp_devname != '' && tmp_devname != undefined &&
				tmp_mac != '' && tmp_mac != undefined)
			{
				if(tmp_time == newTimerange &&
					tmp_devname == newDevName &&
					tmp_mac == newMacs)
				{
					var existWeekArr = new Array;
					var index = 0;
					existWeekArr = tmp_weekday.split(",");
					for(index = 0;index < existWeekArr.length;index++)
					{
						if(tmpWeekdays.indexOf(existWeekArr[index]) != -1)
						{
							var week = new Array('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
							alert("Repeated timing information!" + "\r\n" + tmp_devname + " " + week[existWeekArr[index]-1] + " " + tmp_time);
							return;
						}
					}
				}
			}
		}
	
        showSpin();
		
        document.access_parentalControl.timerAddFlag.value = 1;
		document.access_parentalControl.weekdays.value = tmpWeekdays;
		document.access_parentalControl.timer_macs.value = newMacs;
		document.access_parentalControl.timer_name.value = newDevName;
		document.access_parentalControl.timer_range.value = newTimerange;
        document.access_parentalControl.submit();
}

function changeURLMode()
{
	showSpin();
	
	var url_org_mode = "0";
	var url_org_enable = "0";
	
	document.access_parentalControl.URLModeModifyFlag.value = 1;
	if(document.access_parentalControl.url_mode_select.value == "close")
	{
		document.access_parentalControl.URLEnable.value= "0";
		if(url_org_enable != "0")
			document.access_parentalControl.URLModeChangeFlag.value = 1;
	}
	else
	{
		document.access_parentalControl.URLEnable.value= "1";
		if(document.access_parentalControl.url_mode_select.value == "white")
		{
			//document.access_parentalControl.URLMode.value= "Include";
			document.access_parentalControl.URLMode.value= "1";
			if(url_org_enable != "1" || url_org_mode != "1")
				document.access_parentalControl.URLModeChangeFlag.value = 1;
		}
		else
		{
			//document.access_parentalControl.URLMode.value= "Exclude";
			document.access_parentalControl.URLMode.value= "0";
			if(url_org_enable != "1" || url_org_mode != "0")
				document.access_parentalControl.URLModeChangeFlag.value = 1;
		}
	}
	document.access_parentalControl.submit();
}

var error_flag = 0;
function extraValidCheck(newDevName)
{
	var error_num = 0;
	if ( document.access_parentalControl.UrlFilter_URL.value == "" )
	{
		error_num ++;
		error_flag = 1;
		//$("#add_text_error").html("å¿…é¡»å¡«å†™");
	}
	else
	{
		if ('undefined' == typeof(url_list_obj[0][0])) return;
		
		for (var i = 0; i < url_list_obj.length; i++ )
		{
			if (url_list_obj[i][0] == "" || url_list_obj[i][0] == "N/A")
				continue;
				
			var url = url_list_obj[i][0];
			var name = url_list_obj[i][1];
			if ( document.access_parentalControl.UrlFilter_URL.value ==  url && 
				newDevName.toLowerCase() == name.toLowerCase())
			{
				error_num ++;
				error_flag = 2;
				//$("#add_text_error").html("è¯¥URLå·²å­˜åœ¨");
			}
		}
		
		var add_text = document.access_parentalControl.UrlFilter_URL.value;
		for ( var i = 0; i < add_text.length; i++ )
		{
			if ( /[0-9a-zA-Z.]/.test(add_text[i]) == false )
			{
				error_num ++;
				error_flag = 3;
				//$("#add_text_error").html("URLä¸åˆæ³•");
				break;
			}
		}
	}
	if ( error_num > 0 )
	{
		return false;
	}
	return true;
}

function addURL()
{
	var urlenable = "0";
	if(urlenable == "0")
	{
		alert("Please select URL filter mode first");
		return;
	}
	
	var colums = document.getElementById("url_list").rows.length;
	if ( colums >= 8 )//???
	{
		alert("Up to 8 URLs can be configured");
		return;
	}
	
	if( document.access_parentalControl.UrlFilter_URL.value.length >= 256 )
	{
		alert("Length of URL should less than 256!");
		//$("#add_text").val("");
		return;
	}
	
	if(	document.access_parentalControl.url_device_select.value == "other")
	{
		if(doMACcheck(document.access_parentalControl.url_MacAddrTXT) == -1)
		{
			return;
		}
		var newDevMacs = document.access_parentalControl.url_MacAddrTXT.value; // é€‰ä¸­å€¼
		var newDevName = newDevMacs.replace(/:/g,'-');
	}
	else
	{
		var urlDevObj = document.access_parentalControl.url_device_select;//document.getElementByIdx_x("url_device_select"); //å®šä½id
		var index = urlDevObj.selectedIndex; // é€‰ä¸­ç´¢å¼•
		var newDevName = urlDevObj.options[index].text; // é€‰ä¸­æ–‡æœ¬
		var newDevMacs = urlDevObj.options[index].value; // é€‰ä¸­å€¼
	}
	
	if( ! extraValidCheck(newDevName) )
	{
		if( error_flag == 1)
		{
			alert("URL can not be empty");
		}
		if( error_flag == 2)
		{
			alert("The rule is exist");
		}
		if( error_flag == 3)
		{
			alert("Invalid URL,please check!");
		}
		return;
	}
	
	showSpin();
		
	document.access_parentalControl.URLAddFlag.value = 1;
	//document.access_parentalControl.url_macs.value = document.access_parentalControl.url_device_select.value.replace("-",":");
	document.access_parentalControl.url_name.value = newDevName;
	document.access_parentalControl.url_macs.value = newDevMacs;
	document.access_parentalControl.submit();
}

function switchFilterType(object)
{
  var index = object.selectedIndex;
        if(index == 0)
        {
            document.getElementById('url_setting').style.display = "none";
        }
		else
		{
			document.getElementById('url_setting').style.display = "";
		}
}

function doTimerDeviceChange()
{
	if(	document.access_parentalControl.timer_device_select.value == "other")
		document.getElementById('timer_other_device_mac').style.display = "";
	else
		document.getElementById('timer_other_device_mac').style.display = "none";
}

function doUrlDeviceChange()
{
	if(	document.access_parentalControl.url_device_select.value == "other")
		document.getElementById('url_other_device_mac').style.display = "";
	else
		document.getElementById('url_other_device_mac').style.display = "none";
}

function init()
{
	var urlenable = "";
	if(urlenable == "1")
		document.getElementById('url_setting').style.display = "";
	else
		//document.getElementById('url_setting').style.display = "none";
		document.getElementById('url_setting').style.display = "";
	doTimerDeviceChange();
}
</script>
        </head>
        <body onLoad="init()" style="background:#4acbd6;">
                <FORM METHOD="POST" ACTION="/cgi-bin/access_parentalControl.asp" name="access_parentalControl">
                        <div id="pagestyle">
							<div id="contenttype">
                                <div id="pc_timing">
									<INPUT TYPE="HIDDEN" NAME="delTimerNum">
									<INPUT TYPE="HIDDEN" NAME="addTimerNum" value="0">
									<INPUT TYPE="HIDDEN" NAME="delURLNum">
									<INPUT TYPE="HIDDEN" NAME="addURLNum" value="0">									
                                        <div id="block1">
											<div id="hiddentimer" class="main_item">
												<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed; margin:5px 0;">
													<tr height="25px" style="background-color:#e6e6e6;">
															<td align=left class="title-main" style="width:620px;padding-left:20px;">
																	Time Setting
															</td>
													</tr>
												</table>

												<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
													<tr height="30px">
														<INPUT TYPE="HIDDEN" NAME="timer_range" VALUE="">
														<INPUT TYPE="HIDDEN" NAME="weekdays" VALUE="">
														<td align=left class="tabdata" style="width:200px;padding-left:20px;">Restricted Time</td>
														<td style="width: 50px;">
															<select id="start_hour" class="main_select1">
																<option value="00">00</option>
																<option value="01">01</option>
																<option value="02">02</option>
																<option value="03">03</option>
																<option value="04">04</option>
																<option value="05">05</option>
																<option value="06">06</option>
																<option value="07">07</option>
																<option value="08" selected>08</option>
																<option value="09">09</option>
																<option value="10">10</option>
																<option value="11">11</option>
																<option value="12">12</option>
																<option value="13">13</option>
																<option value="14">14</option>
																<option value="15">15</option>
																<option value="16">16</option>
																<option value="17">17</option>
																<option value="18">18</option>
																<option value="19">19</option>
																<option value="20">20</option>
																<option value="21">21</option>
																<option value="22">22</option>
																<option value="23">23</option>
															</select>
														</td>
														<td style="width: 50px;">
															<select id="start_minute" class="main_select1">
																<option value="00" selected>00</option>
																<option value="01">01</option>
																<option value="02">02</option>
																<option value="03">03</option>
																<option value="04">04</option>
																<option value="05">05</option>
																<option value="06">06</option>
																<option value="07">07</option>
																<option value="08">08</option>
																<option value="09">09</option>
																<option value="10">10</option>
																<option value="11">11</option>
																<option value="12">12</option>
																<option value="13">13</option>
																<option value="14">14</option>
																<option value="15">15</option>
																<option value="16">16</option>
																<option value="17">17</option>
																<option value="18">18</option>
																<option value="19">19</option>
																<option value="20">20</option>
																<option value="21">21</option>
																<option value="22">22</option>
																<option value="23">23</option>
																<option value="24">24</option>
																<option value="25">25</option>
																<option value="26">26</option>
																<option value="27">27</option>
																<option value="28">28</option>
																<option value="29">29</option>
																<option value="30">30</option>
																<option value="31">31</option>
																<option value="32">32</option>
																<option value="33">33</option>
																<option value="34">34</option>
																<option value="35">35</option>
																<option value="36">36</option>
																<option value="37">37</option>
																<option value="38">38</option>
																<option value="39">39</option>
																<option value="40">40</option>
																<option value="41">41</option>
																<option value="42">42</option>
																<option value="43">43</option>
																<option value="44">44</option>
																<option value="45">45</option>
																<option value="46">46</option>
																<option value="47">47</option>
																<option value="48">48</option>
																<option value="49">49</option>
																<option value="50">50</option>
																<option value="51">51</option>
																<option value="52">52</option>
																<option value="53">53</option>
																<option value="54">54</option>
																<option value="55">55</option>
																<option value="56">56</option>
																<option value="57">57</option>
																<option value="58">58</option>
																<option value="59">59</option>
															</select>
														</td>
														<td style="width: 30px;"><span>To</span></td>
														<td style="width: 50px;">
															<select id="end_hour" class="main_select1">
																<option value="00">00</option>
																<option value="01">01</option>
																<option value="02">02</option>
																<option value="03">03</option>
																<option value="04">04</option>
																<option value="05">05</option>
																<option value="06">06</option>
																<option value="07">07</option>
																<option value="08">08</option>
																<option value="09">09</option>
																<option value="10">10</option>
																<option value="11">11</option>
																<option value="12">12</option>
																<option value="13">13</option>
																<option value="14">14</option>
																<option value="15">15</option>
																<option value="16">16</option>
																<option value="17">17</option>
																<option value="18">18</option>
																<option value="19">19</option>
																<option value="20">20</option>
																<option value="21">21</option>
																<option value="22">22</option>
																<option value="23" selected>23</option>
															</select>
														</td>
														<td>
															<select id="end_minute" class="main_select1">
																<option value="00">00</option>
																<option value="01">01</option>
																<option value="02">02</option>
																<option value="03">03</option>
																<option value="04">04</option>
																<option value="05">05</option>
																<option value="06">06</option>
																<option value="07">07</option>
																<option value="08">08</option>
																<option value="09">09</option>
																<option value="10">10</option>
																<option value="11">11</option>
																<option value="12">12</option>
																<option value="13">13</option>
																<option value="14">14</option>
																<option value="15">15</option>
																<option value="16">16</option>
																<option value="17">17</option>
																<option value="18">18</option>
																<option value="19">19</option>
																<option value="20">20</option>
																<option value="21">21</option>
																<option value="22">22</option>
																<option value="23">23</option>
																<option value="24">24</option>
																<option value="25">25</option>
																<option value="26">26</option>
																<option value="27">27</option>
																<option value="28">28</option>
																<option value="29">29</option>
																<option value="30">30</option>
																<option value="31">31</option>
																<option value="32">32</option>
																<option value="33">33</option>
																<option value="34">34</option>
																<option value="35">35</option>
																<option value="36">36</option>
																<option value="37">37</option>
																<option value="38">38</option>
																<option value="39">39</option>
																<option value="40">40</option>
																<option value="41">41</option>
																<option value="42">42</option>
																<option value="43">43</option>
																<option value="44">44</option>
																<option value="45">45</option>
																<option value="46">46</option>
																<option value="47">47</option>
																<option value="48">48</option>
																<option value="49">49</option>
																<option value="50">50</option>
																<option value="51">51</option>
																<option value="52">52</option>
																<option value="53">53</option>
																<option value="54">54</option>
																<option value="55">55</option>
																<option value="56">56</option>
																<option value="57">57</option>
																<option value="58">58</option>
																<option value="59" selected>59</option>
															</select>
														</td>
													</tr>

													<tr height="30px">
														<td align=left class="tabdata" style="width:250px;padding-left:20px;">Repetition Date</td>
														<td align=left class="tabdata" colspan="5">
															<INPUT TYPE="checkbox" NAME="mon" > Mon    
															<INPUT type="hidden" name="mon_value" value="0">

															<INPUT TYPE="checkbox" NAME="tue"> Tue    
															<INPUT type="hidden" name="tue_value" value="0">

															<INPUT TYPE="checkbox" NAME="wed"> Wed    
															<INPUT type="hidden" name="wed_value" value="0">

															<INPUT TYPE="checkbox" NAME="thu" > Thu    
															<INPUT type="hidden" name="thu_value" value="0">

															<INPUT TYPE="checkbox" NAME="fri" > Fri    
															<INPUT type="hidden" name="fri_value" value="0">

															<INPUT TYPE="checkbox" NAME="sat"> Sat    
															<INPUT type="hidden" name="sat_value" value="0">

															<INPUT TYPE="checkbox" NAME="sun"> Sun    
															<INPUT type="hidden" name="sun_value" value="0">
														</td>
													</tr>
													<tr height="30px">
														<td align=left class="tabdata" style="width:250px;padding-left:20px;">Device Name</td>
														<td>
															<select id="timer_device_select" onChange="doTimerDeviceChange()"><!--refer to NAT-Virtual Server-Local IP Address-->
																<script language="JavaScript" type="text/JavaScript">
																		writeDeviceNameTable();
																</script>
																<OPTION value="other">Other</OPTION>
															</select>
															<INPUT TYPE="HIDDEN" NAME="timer_macs" VALUE="">
															<INPUT TYPE="HIDDEN" NAME="timer_name" VALUE="">
														</td>
													</tr>
													<tr height="30px" id="timer_other_device_mac" style="display:none">
														<td align=left class="tabdata" style="width:250px;padding-left:20px;">MAC Address</td>
														<td colspan="5">
															<INPUT name="timer_MacAddrTXT" maxLength=17 size=17 value="">(eg:aa:bb:cc:11:22:33)
														</td>
													</tr>
												</table>
											</div>
											<div id="button_timing" class="main_item">
                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
													<tr height="25px">
														<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
																Click "Add" to add your timing settings
														</td>
													</tr>
                                                </table>
                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
													<tr height="40px">
														<td align=left class="tabdata" style="width:250px;padding-left:20px;">
															<INPUT TYPE="HIDDEN" NAME="timerAddFlag" VALUE="0">
															<INPUT TYPE="button" class="button1" NAME="AddTimerBtn" VALUE="Add" onClick="addTimer()"> 
														</td>
														<td id="firstDiv" style="float:left;"></td>
													</tr>
                                                </table>
											</div>
											<div id="div_timingList" class="main_item">
												<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"  style="margin:5px 0px;">
													<tr height="25px" class="bgcolor" style="width:100%;background:#e6e6e6;">
														<td  align="left" class="title-main" style="padding-left:20px;">Timing Listing</td>
													</tr>
												</table>
												<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"  >
													<tr>
														<td align=left class="tabdata">
															<div class="configstyle">
																<table width="640" border="0"  cellpadding="0" cellspacing="0" bordercolor="#CCCCCC" bgcolor="#FFFFFF" >
																	<tr height="30px">
																			<td class=tabdata align=center width=190><strong>Device Name</strong></td>
																			<td class=tabdata align=center width=210><strong>Repetition Date</strong></td> 
																			<td class=tabdata align=center width=170><strong>Restricted Time</strong></td>
																			<td class=tabdata align=center width=70><strong>Edit</strong></td>
																	</tr>
																	<tbody id="timer_list">
																		<script language="JavaScript" type="text/JavaScript">
																			writeTimingTable();
																		</script>
																	</tbody>
																</table>
															</div>
														</td>                       
													</tr>
												</table>
											</div>
                                        </div>
                                </div>
								<div id="pc_urlfilter">
								<div class="main_item">
									<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"  style="margin:5px 0px;">
										<tr height="25px" class="bgcolor" style="width:100%;background:#e6e6e6;">
												<td  align="left" class="title-main" style="padding-left:20px;">URL Filter Mode</td>
										</tr>
									</table>
									<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
										<tr height="30px">
												<td width="250px" align=left class="tabdata" style="padding-left:20px;">Filter Mode Selection</td>
												<td align=left class="tabdata">
													<SELECT name=url_mode_select size=1><!-- onchange=switchFilterType(this)>-->
															<OPTION VALUE="close" selected>Close</OPTION>
															<OPTION VALUE="black" >Black List</OPTION>
															<OPTION VALUE="white" >White List</OPTION>
													</SELECT> 
												</td>
										</tr>
									</table>
									</div>
									<div class="main_item">
									<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
											<tr height="25px">
													<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
															Click "Save" to save your URL Mode settings
													</td>
											</tr>
									</table>
									<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
											<tr height="40px">
												<td align=left class="tabdata" style="width:100px;padding-left:20px;">
														<INPUT TYPE="HIDDEN" NAME="URLModeModifyFlag" VALUE="0">
														<INPUT TYPE="HIDDEN" NAME="URLModeChangeFlag" VALUE="0">
														<INPUT TYPE="HIDDEN" NAME="URLEnable" VALUE="">
														<INPUT TYPE="HIDDEN" NAME="URLMode" VALUE="">
														<INPUT TYPE="button" class="button1" NAME="ChangeURLModeBtn" VALUE="Save" onClick="changeURLMode()"> 
												</td>
											</tr>
									</table>
									</div>
								</div>
								<div id="url_setting" class="main_item">
									<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"  style="margin:5px 0px;">
										<tr height="25px" class="bgcolor" style="width:100%;background:#e6e6e6;">
												<td  align="left" class="title-main" style="padding-left:20px;">URL Filter Setting</td>
										</tr>
									</table>
									<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
											<tr height="30px">
													<td width="250px" align=left class="tabdata" style="padding-left:20px;">URL Address</td>
													<td align=left class="tabdata">
															<INPUT TYPE="TEXT" maxLength=49 size=33 name="UrlFilter_URL" VALUE="" > (eg:test.com)  
													</td>
											</tr>
											<tr height="30px">
													<td width="250px" align=left class="tabdata" style="padding-left:20px;">Device Name</td>
													<td align=left class="tabdata">
														<select id="url_device_select" onChange="doUrlDeviceChange()"><!--refer to NAT-Virtual Server-Local IP Address-->
																<OPTION value="" selected >All</OPTION>
																<script language="JavaScript" type="text/JavaScript">
																	writeDeviceNameTable();
																</script>
																<OPTION value="other" >Other</OPTION>
														</select>
														<INPUT TYPE="HIDDEN" NAME="url_macs" VALUE="">
														<INPUT TYPE="HIDDEN" NAME="url_name" VALUE="">
													</td>
											</tr>
											<tr height="30px" id="url_other_device_mac" style="display:none">
												<td align=left class="tabdata" style="width:250px;padding-left:20px;">MAC Address</td>
												<td>
													<INPUT name="url_MacAddrTXT" maxLength=17 size=17 value="">(eg:aa:bb:cc:11:22:33)
												</td>
											</tr>
									</table>
								</div>
								<div id="button_url" class="main_item">
									<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
											<tr height="25px">
													<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
															Click "Add" to add your URL settings
													</td>
											</tr>
									</table>
									<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
											<tr height="40px">
													<td align=left class="tabdata" style="width:250px;padding-left:20px;">
															<INPUT TYPE="HIDDEN" NAME="URLAddFlag" VALUE="0">
															<INPUT TYPE="button" class="button1" NAME="AddURLBtn" VALUE="Add" onClick="addURL()"> 
													</td>
													<td id="firstDiv" style="float:left;"></td>
											</tr>
									</table>
								</div>
								<div id="div_URLList" class="main_item">
									<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"  style="margin:5px 0px;">
										<tr height="25px" class="bgcolor" style="width:100%;background:#e6e6e6;">
												<td  align="left" class="title-main" style="padding-left:20px;">URL Filter Listing</td>
										</tr>
									</table>
									<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"  >
										<tr>
											<td align=left class="tabdata">
												<div class="configstyle">
														<table width="640" border="0"  cellpadding="0" cellspacing="0" bordercolor="#CCCCCC" bgcolor="#FFFFFF" >
														<tr height="30px">
																<td class=tabdata align=center width=285><STRONG>URL Address</STRONG></td>
																<td class=tabdata align=center width=285><strong>Device Name</strong></td> 
																<td class=tabdata align=center width=70><STRONG>Edit</STRONG></td>
														</tr>
														<tbody id="url_list">
															<script language="JavaScript" type="text/JavaScript">
																writeURLTable();
															</script>
														</tbody>
														</table>
												</div>
											</td>                       
										</tr>
									</table>
								</div>
							</div>
                        </div>
                </form>
        </body>
</html>
