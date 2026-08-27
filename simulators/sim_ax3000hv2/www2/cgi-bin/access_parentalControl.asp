


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
	<link rel="stylesheet" type="text/css" href="/style.css">
	<style  type="text/css">
		*{color:  #404040;}
	</style>

	<script type="text/javascript" src="/spin.js" ></script>
<script language="JavaScript">
//////
/*
var parctl_index_0 = "2";
var parctl_name_0 = "a-host";//ParentCtrl_Entry31 Name
//var parctl_weekdays_0 = "1";//ParentCtrl_Entry31 Weekdays
var parctl_weekdays_0 = "Mon";
//var parctl_timerange_0 = "08:00-23:59";//ParentCtrl_Entry31 Timerange
var parctl_start_time_0 = "08:00:00";
var parctl_stop_time_0 = "23:59:00";
var parctl_mac_0 = "E0:BE:03:32:07:50";//ParentCtrl_Entry31 Macs
var parctl_index_1 = "3";
var parctl_name_1 = "E0-BE-03-32-07-51";
//var parctl_weekdays_1 = "1,2,3";
var parctl_weekdays_1 = "Mon Tue Wed";
//var parctl_timerange_1 = "08:01-23:59";
var parctl_start_time_1 = "08:01:00";
var parctl_stop_time_1 = "23:59:00";
var parctl_mac_1 = "E0:BE:03:32:07:51";
var parctl_index_2 = "5";
var parctl_name_2 = "ahome";
//var parctl_weekdays_2 = "3,4,5";
var parctl_weekdays_2 = "Wed Thu Fri";
//var parctl_timerange_2 = "08:02-23:59";
var parctl_start_time_2 = "08:02:00";
var parctl_stop_time_2 = "23:59:00";
var parctl_mac_2 = "E0:BE:03:32:07:52";
var lanhost_hostname_0 = "a-host";//LanHost_Entry0 HostName
var lanhost_mac_0 = "E0:BE:03:32:07:50";//LanHost_Entry0 MAC
var lanhost_hostname_1 = "b-host";
var lanhost_mac_1 = "E0:BE:03:32:07:51";
var lanhost_hostname_2 = "c-host";
var lanhost_mac_2 = "E0:BE:03:32:07:52";
var urlfilter_index_0 = "2";
var urlfilter_url_0 = "baidu";//UrlFilter_Entry0 URL
var urlfilter_name_0 = "All";//UrlFilter_Entry0 Name
var urlfilter_index_1 = "5";
var urlfilter_url_1 = "google";
var urlfilter_name_1 = "E0-BE-03-32-07-50";
var urlfilter_index_2 = "6";
var urlfilter_url_2 = "sina";
var urlfilter_name_2 = "E0-BE-03-32-07-51";
var urlfilter_active = "1";//UrlFilter_Common Activate
var urlfilter_mode = "1";//UrlFilter_Common Mode
*/
//////
var urlfilter_active = "0";
var urlfilter_mode = "";
var lanhost_mac_0 = "D8:43:AE:2E:65:45";
var lanhost_hostname_0 = "D8-43-AE-2E-65-45";

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

var time_list_obj = [];
var index = 0;
for(index = 0; index < 64; index++)
{
	if(typeof window['parctl_weekdays_' + index] !== 'undefined')
	{
		time_list_obj.push([window['parctl_name_' + index],window['parctl_weekdays_' + index],window['parctl_start_time_' + index],window['parctl_stop_time_' + index],window['parctl_mac_' + index],window['parctl_index_' + index]]);
	}
}

var host_list_obj = [];
for(index = 0; index < 64; index++)
{
	if(typeof window['lanhost_mac_' + index] !== 'undefined')
	{
		host_list_obj.push([window['lanhost_hostname_' + index],window['lanhost_mac_' + index]]);
	}
}

function doTimerDelete(i)
{
	document.access_parentalControl.delTimerNum.value=i;
	document.access_parentalControl.submit();
}

function writeDeviceNameTable()
{
	//if ('undefined' == typeof(host_list_obj[0][0])) return;
	var strtemp = "";
	for (var i = 0; i < host_list_obj.length; i++) {
		if (host_list_obj[i][0] != "" && host_list_obj[i][0] != "N/A" && !(host_list_obj[i][0].match(/^[ ]*$/))) {//match(/^[ ]*$/) mach kongge
			strtemp += '<option value=' + host_list_obj[i][1] + '>' + host_list_obj[i][0] + '</option>';
		}
		else if (host_list_obj[i][1] != "" && host_list_obj[i][1] != "N/A") {
			var tmpname = host_list_obj[i][1].replace(/:/g,'-');//replace all : by -
			strtemp += '<option value=' + host_list_obj[i][1] + '>' + tmpname + '</option>';
		}
	}
	document.write(strtemp);
}

function writeTimingTable()
{
	//if ('undefined' == typeof(time_list_obj[0][0])) return;
	var strtemp = "";
	for (var i = 0; i < time_list_obj.length; i++) {
		if (time_list_obj[i][0] != "" && time_list_obj[i][0] != "N/A") {
			strtemp += '<tr height=30><td align="center" class="topborderstyle">' + time_list_obj[i][0] + '</td>\n';
			strtemp += '<td align="center" class="topborderstyle">' + time_list_obj[i][4] + '</td>\n';
			strtemp += '<td align="center" class="topborderstyle">' + time_list_obj[i][1] + '</td>\n';
			strtemp += '<td align="center" class="topborderstyle">' + time_list_obj[i][2].substring(0,5)+'-'+time_list_obj[i][3].substring(0,5) + '</td>';
			strtemp += '<td align="center" class="topborderstyle"><input type="button" class="button3" name="RemoveBtn" value="Remove" onClick="doTimerDelete(' + time_list_obj[i][5] + ');"></td></tr>\n';
		}
	}
	document.write(strtemp);
}

var url_list_obj = [];
for(index = 0; index < 8; index++)
{
	if(typeof window['urlfilter_url_' + index] !== 'undefined')
	{
		url_list_obj.push([window['urlfilter_url_' + index],window['urlfilter_name_' + index],window['urlfilter_index_' + index]]);
	}
}

function doURLDelete(i)
{
	document.access_parentalControl.delURLNum.value=i;
	document.access_parentalControl.submit();
}

function writeURLTable()
{
	//if ('undefined' == typeof(url_list_obj[0][0])) return;
	var strtemp = "";
	for (var i = 0; i < url_list_obj.length; i++) {
		if (url_list_obj[i][0] != "" && url_list_obj[i][0] != "N/A") {
			strtemp += '<tr height=30><td align="center" class="topborderstyle">' + url_list_obj[i][0] + '</td>\n';
			strtemp += '<td align="center" class="topborderstyle">' + url_list_obj[i][1] + '</td>\n';
			strtemp += '<td align="center" class="topborderstyle"><input type="button" class="button3" name="RemoveBtn" value="Remove" onClick="doURLDelete(' + url_list_obj[i][2] + ');"></td></tr>\n';
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

function addTimer()
{
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
			tmpWeekdays = "Mon";
		else
			tmpWeekdays = tmpWeekdays + " Mon";
	}

	if(tue.checked)
	{
		if(tmpWeekdays.length == 0)
			tmpWeekdays = "Tue";
		else
			tmpWeekdays = tmpWeekdays + " Tue";
	}

	if(wed.checked)
	{
		if(tmpWeekdays.length == 0)
			tmpWeekdays = "Wed";
		else
			tmpWeekdays = tmpWeekdays + " Wed";
	}

	if(thu.checked)
	{
		if(tmpWeekdays.length == 0)
			tmpWeekdays = "Thu";
		else
			tmpWeekdays = tmpWeekdays + " Thu";
	}

	if(fri.checked)
	{
		if(tmpWeekdays.length == 0)
			tmpWeekdays = "Fri";
		else
			tmpWeekdays = tmpWeekdays + " Fri";
	}

	if(sat.checked)
	{
		if(tmpWeekdays.length == 0)
			tmpWeekdays = "Sat";
		else
			tmpWeekdays = tmpWeekdays + " Sat";
	}

	if(sun.checked)
	{
		if(tmpWeekdays.length == 0)
			tmpWeekdays = "Sun";
		else
			tmpWeekdays = tmpWeekdays + " Sun";
	}

	//if(document.access_parentalControl.wifitimer_enable[0].checked)
	{
		if(!(mon.checked||tue.checked||wed.checked||thu.checked||fri.checked||sat.checked||sun.checked))
		{
			alert("Please choose date!");
			return;
		}
	}

	var newTimeStart = document.access_parentalControl.start_hour.value + ":" + document.access_parentalControl.start_minute.value + ":00";
	var newTimeEnd = document.access_parentalControl.end_hour.value + ":" + document.access_parentalControl.end_minute.value + ":00";

	if(document.access_parentalControl.timer_device_select.value == "other")
	{
		if(doMACcheck(document.access_parentalControl.timer_MacAddrTXT) == -1)
		{
			return;
		}
		var newMacs = document.access_parentalControl.timer_MacAddrTXT.value; // 选中值
		var newDevName = 'other';//newMacs.replace(/:/g,'-');
	}
	else
	{
		var timerObj = document.access_parentalControl.timer_device_select;//document.getElementByIdx_x("timer_device_select"); //定位id
		var index = timerObj.selectedIndex; // 选中索引
		var newDevName = timerObj.options[index].text; // 选中文本
		var newMacs = timerObj.options[index].value; // 选中值
	}
	
	//for (var i = 0; i < 32; i++ )
	for (var i = 0; i < time_list_obj.length; i++ )
	{
		var tmp_weekday = time_list_obj[i][1];
		var tmp_start_time = time_list_obj[i][2];
		var tmp_stop_time = time_list_obj[i][3];
		var tmp_devname = time_list_obj[i][0];
		var tmp_mac = time_list_obj[i][4].replace(/-/g,":");
		if ( tmp_weekday != '' && tmp_weekday != undefined &&
			tmp_start_time != '' && tmp_start_time != undefined &&
			tmp_stop_time != '' && tmp_stop_time != undefined &&
			tmp_devname != '' && tmp_devname != undefined &&
			tmp_mac != '' && tmp_mac != undefined)
		{
			if(tmp_start_time == newTimeStart &&
				tmp_stop_time == newTimeEnd &&
				tmp_devname == newDevName &&
				tmp_mac == newMacs)
			{
				var existWeekArr = new Array;
				var index = 0;
				existWeekArr = tmp_weekday.split(" ");
				for(index = 0;index < existWeekArr.length;index++)
				{
					if(tmpWeekdays.indexOf(existWeekArr[index]) != -1)
					{
						var week = new Array('Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun');
						alert("Repeated timing information!" + "\r\n" + tmp_devname + " " + existWeekArr[index] + " " + tmp_start_time.substring(0,5) + "-" + tmp_stop_time.substring(0,5));
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
	document.access_parentalControl.start_time.value = newTimeStart;
	document.access_parentalControl.stop_time.value = newTimeEnd;
	document.access_parentalControl.submit();
}

function changeURLMode()
{
	showSpin();

	var url_org_mode = urlfilter_mode;
	var url_org_enable = urlfilter_active;

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
		//$("#add_text_error").html("必须填写");
	}
	else
	{
		//if ('undefined' == typeof(url_list_obj[0][0])) return;

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
				//$("#add_text_error").html("该URL已存在");
			}
		}

		var add_text = document.access_parentalControl.UrlFilter_URL.value;
		for ( var i = 0; i < add_text.length; i++ )
		{
			if ( /[0-9a-zA-Z.]/.test(add_text[i]) == false )
			{
				error_num ++;
				error_flag = 3;
				//$("#add_text_error").html("URL不合法");
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
	var urlenable = urlfilter_active;
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

	if(document.access_parentalControl.url_device_select.value == "other")
	{
		if(doMACcheck(document.access_parentalControl.url_MacAddrTXT) == -1)
		{
			return;
		}
		var newDevMacs = document.access_parentalControl.url_MacAddrTXT.value; // 选中值
		var newDevName = newDevMacs.replace(/:/g,'-');
	}
	else
	{
		var urlDevObj = document.access_parentalControl.url_device_select;//document.getElementByIdx_x("url_device_select"); //定位id
		var index = urlDevObj.selectedIndex; // 选中索引
		var newDevName = urlDevObj.options[index].text; // 选中文本
		var newDevMacs = urlDevObj.options[index].value; // 选中值
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
	if(document.access_parentalControl.timer_device_select.value == "other")
		document.getElementById('timer_other_device_mac').style.display = "";
	else
		document.getElementById('timer_other_device_mac').style.display = "none";
}

function doUrlDeviceChange()
{
	if(document.access_parentalControl.url_device_select.value == "other")
		document.getElementById('url_other_device_mac').style.display = "";
	else
		document.getElementById('url_other_device_mac').style.display = "none";
}

function init()
{
	var urlenable = urlfilter_active;
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
<input type="hidden" name="delTimerNum">
<input type="hidden" name="addTimerNum" value="">
<input type="hidden" name="delURLNum">
<input type="hidden" name="addURLNum" value="">
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
				<input type="hidden" name="start_time" value="">
				<input type="hidden" name="stop_time" value="">
				<input type="hidden" name="weekdays" value="">
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
					<input type="checkbox" name="mon" > Mon    
					<input type="hidden" name="mon_value" value="0">

					<input type="checkbox" name="tue"> Tue    
					<input type="hidden" name="tue_value" value="0">

					<input type="checkbox" name="wed"> Wed    
					<input type="hidden" name="wed_value" value="0">

					<input type="checkbox" name="thu" > Thu    
					<input type="hidden" name="thu_value" value="0">

					<input type="checkbox" name="fri" > Fri    
					<input type="hidden" name="fri_value" value="0">

					<input type="checkbox" name="sat"> Sat    
					<input type="hidden" name="sat_value" value="0">

					<input type="checkbox" name="sun"> Sun    
					<input type="hidden" name="sun_value" value="0">
				</td>
			</tr>
			<tr height="30px">
				<td align=left class="tabdata" style="width:250px;padding-left:20px;">Device Name</td>
				<td>
					<select id="timer_device_select" onChange="doTimerDeviceChange()"><!--refer to NAT-Virtual Server-Local IP Address-->
						<script language="JavaScript" type="text/JavaScript">
							writeDeviceNameTable();
						</script>
						<option value="other">Other</option>
					</select>
					<input type="hidden" name="timer_macs" value="">
					<input type="hidden" name="timer_name" value="">
				</td>
			</tr>
			<tr height="30px" id="timer_other_device_mac" style="display:none">
				<td align=left class="tabdata" style="width:250px;padding-left:20px;">MAC Address</td>
				<td colspan="5">
					<input name="timer_MacAddrTXT" maxLength=17 size=17 value="">(eg:aa:bb:cc:11:22:33)
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
					<input type="hidden" name="timerAddFlag" value="0">
					<input type="button" class="button1" name="AddTimerBtn" value="Add" onClick="addTimer()"> 
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
								<td class=tabdata align=center width="30%"><strong>Device Name</strong></td>
								<td class=tabdata align=center width="20%"><strong>MAC Address</strong></td>
								<td class=tabdata align=center width="25%"><strong>Repetition Date</strong></td> 
								<td class=tabdata align=center width="20%"><strong>Restricted Time</strong></td>
								<td class=tabdata align=center width="5%"><strong>Edit</strong></td>
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
				<select name=url_mode_select id="url_mode_select" size=1><!-- onchange=switchFilterType(this)>-->
					<option value="close">Close</option>
					<option value="black">Black List</option>
					<option value="white">White List</option>
				<script>
				var select = document.getElementById("url_mode_select");
				if(urlfilter_active == "0")
					select.selectedIndex = 0;
				else if(urlfilter_active == "1")
				{
					if(urlfilter_mode == "0")
						select.selectedIndex = 1;
					else
						select.selectedIndex = 2;
				}
				</script>
				</select> 
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
				<input type="hidden" name="URLModeModifyFlag" value="0">
				<input type="hidden" name="URLModeChangeFlag" value="0">
				<input type="hidden" name="URLEnable" value="">
				<input type="hidden" name="URLMode" value="">
				<input type="button" class="button1" name="ChangeURLModeBtn" value="Save" onClick="changeURLMode()"> 
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
			<input type="TEXT" maxLength=49 size=33 name="UrlFilter_URL" value="" > (eg:test.com)  
		</td>
	</tr>
	<tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">Device Name</td>
		<td align=left class="tabdata">
			<select id="url_device_select" onChange="doUrlDeviceChange()"><!--refer to NAT-Virtual Server-Local IP Address-->
				<option value="" selected >All</option>
				<script language="JavaScript" type="text/JavaScript">
					writeDeviceNameTable();
				</script>
				<option value="other" >Other</option>
			</select>
			<input type="hidden" name="url_macs" value="">
			<input type="hidden" name="url_name" value="">
		</td>
	</tr>
	<tr height="30px" id="url_other_device_mac" style="display:none">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">MAC Address</td>
		<td>
			<input name="url_MacAddrTXT" maxLength=17 size=17 value="">(eg:aa:bb:cc:11:22:33)
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
			<input type="hidden" name="URLAddFlag" value="0">
			<input type="button" class="button1" name="AddURLBtn" value="Add" onClick="addURL()"> 
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
