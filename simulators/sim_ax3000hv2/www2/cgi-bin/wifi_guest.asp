

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

/*var wifi_bandsteer_enable = "1";
var wifi_enable_2g = "1";
var wifi_ssid_2g = "ssid-2.4g";
var wifi_authMode_2g = "WPA2PSKWPA3PSK";
var wifi_encrypType_2g = "AES";
var wifi_pwd_2g = "112233";
var wifi_mode_2g = "7";
var wifi_enable_5g = "1";
var wifi_ssid_5g = "ssid-5g";
var wifi_authMode_5g = "WPAPSKWPA2PSK";
var wifi_encrypType_5g = "TKIPAES";
var wifi_pwd_5g = "123321";
var wifi_mode_5g = "15";*/
var wifi_enable_2g = "0";
var wifi_hideSSID_2g = "0";
var wifi_ssid_2g = "FPT Telecom\-1691 \- Guest";
var wifi_ft_support_2g = "";
var wifi_authMode_2g = "WPAPSKWPA2PSK";
var wifi_encrypType_2g = "AES";
var wifi_pwd_2g = "24BA7659";
var wifi_mode_2g = "11ax";
var wifi_enable_5g = "0";
var wifi_hideSSID_5g = "0";
var wifi_ssid_5g = "FPT Telecom\-1691 \- Guest";
var wifi_ft_support_5g = "";
var wifi_authMode_5g = "WPAPSKWPA2PSK";
var wifi_encrypType_5g = "AES";
var wifi_pwd_5g = "24BA7659";
var wifi_mode_5g = "11ax";


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


function strESSIDCheck(str)
{
	if(str.value.match(/[^\x00-\xff]/g)){
		alert("Invalid SSID Input!");
		return true;
	}
	if(str.value.length <= 0){
		alert("SSID is empty");
		return true;
	}
	return false;
}

function quotationCheck(object, limit_len)
{
	var len = object.value.length;
	var c;
	var i, j = 0;
	for (i = 0; i < len; i++)
	{
		var c = object.value.charAt(i);
		if (c == '"') {
			j += 6;
		}
		else
			j++;
	}
	if (j > limit_len-1)
	{
		alert('too many quotation marks!');
		return true;
	}
	return false;
}

function doHexCheck(c)
{
	if ((c >= "0")&&(c <= "9"))
	{
		return 1;
	}
	else if ((c >= "A")&&(c <= "F"))
	{
		return 1;
	}
	else if ((c >= "a")&&(c <= "f"))
	{
		return 1;
	}

	return -1;
}

function wpapskCheck(object)
{
	var keyvalue = object.value;
	var wpapsklen = object.value.length;
	if(wpapsklen >= 8 && wpapsklen < 64) {
		if (keyvalue.match(/[^\x00-\xff]/g)) {
			alert("Pre-Shared Key should be between 8 and 63 ASCII characters or 64 Hex string.");
			return true;
		}
	} else if (wpapsklen == 64) {
		for(i = 0; i < 64; i++){
			var c = keyvalue.charAt(i);
			if(doHexCheck(c)<0){
				alert("Pre-Shared Key Hex value error!");
				return true;
			}
		}
	} else {
		alert("Pre-Shared Key length error!");
		return true;
	}
	return false;
}

function doSave()
{
	//check SSID
	if(quotationCheck(document.wifi_form.ESSID, 193)||strESSIDCheck(document.wifi_form.ESSID)){
		return;
	}
	if(quotationCheck(document.wifi_form.ESSID_5g, 193)||strESSIDCheck(document.wifi_form.ESSID_5g)){
		return;
	}
	//check password
	var vAuthMode = document.wifi_form.WEP_Selection.value;
	if(vAuthMode != "OPEN") {
		if (wpapskCheck(document.wifi_form.PreSharedKey)){
			return false;
		}
		if(quotationCheck(document.wifi_form.PreSharedKey, 385) ){
			return false;
		}
	}
	vAuthMode = document.wifi_form.WEP_Selection_5g.value;
	if(vAuthMode != "OPEN") {
		if (wpapskCheck(document.wifi_form.PreSharedKey_5g)){
			return false;
		}
		if(quotationCheck(document.wifi_form.PreSharedKey_5g, 385) ){
			return false;
		}
	}

	//showSpin();
	document.wifi_form.saveFlag.value = 1;
	document.wifi_form.submit();
	return;
}

function wifi_enable_switch(on_off)
{
	if(on_off)
		document.getElementById("wifi_active_div").style.display = "";
	else
		document.getElementById("wifi_active_div").style.display = "none";
}

function wifi_enable_switch_5g(on_off)
{
	if(on_off)
		document.getElementById("wifi_active_5g_div").style.display = "";
	else
		document.getElementById("wifi_active_5g_div").style.display = "none";
}

function doEncryptionChange(object)
{
}

function doWEPChange()
{
	var vAuthMode = document.wifi_form.WEP_Selection.value;
	var select = document.getElementsByName("TKIP_Selection")[0];
	var options = select.options;
	if(vAuthMode == "OPEN") {
		document.getElementById("encrypType_tr").style.display = "none";
		document.getElementById("WPAPSK_tr").style.display = "none";
	} else if(vAuthMode == "WPA3PSK" || vAuthMode == "WPA2PSKWPA3PSK") {
		document.getElementById("encrypType_tr").style.display = "";
		document.getElementById("WPAPSK_tr").style.display = "";
		if(document.wifi_form.TKIP_Selection.value == "TKIP" || document.wifi_form.TKIP_Selection.value == "TKIPAES")
			document.wifi_form.TKIP_Selection.value = "AES";

		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "TKIP" || options[i].value == "TKIPAES")
				options[i].style.display = "none";
		}
	} else {
		document.getElementById("encrypType_tr").style.display = "";
		document.getElementById("WPAPSK_tr").style.display = "";

		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "TKIP" || options[i].value == "TKIPAES")
				options[i].style.display = "";
		}
	}
}

function doWEPChange_5g()
{
	var vAuthMode = document.wifi_form.WEP_Selection_5g.value;
	var select = document.getElementsByName("TKIP_Selection_5g")[0];
	var options = select.options;
	if(vAuthMode == "OPEN") {
		document.getElementById("encrypType_5g_tr").style.display = "none";
		document.getElementById("WPAPSK_5g_tr").style.display = "none";
	} else if(vAuthMode == "WPA3PSK" || vAuthMode == "WPA2PSKWPA3PSK") {
		document.getElementById("encrypType_5g_tr").style.display = "";
		document.getElementById("WPAPSK_5g_tr").style.display = "";
		if(document.wifi_form.TKIP_Selection_5g.value == "TKIP" || document.wifi_form.TKIP_Selection_5g.value == "TKIPAES")
			document.wifi_form.TKIP_Selection_5g.value = "AES";

		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "TKIP" || options[i].value == "TKIPAES")
				options[i].style.display = "none";
		}
	} else {
		document.getElementById("encrypType_5g_tr").style.display = "";
		document.getElementById("WPAPSK_5g_tr").style.display = "";

		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "TKIP" || options[i].value == "TKIPAES")
				options[i].style.display = "";
		}
	}
}

function wpapskCheck(object)
{
	var keyvalue=object.value;
	var wpapsklen=object.value.length;
	if(wpapsklen >= 8 && wpapsklen < 64) {
		if(keyvalue.match(/[^\x00-\xff]/g)) {
			alert("Pre-Shared Key should be between 8 and 63 ASCII characters or 64 Hex string.");
			return true;
		}
	} else if (wpapsklen==64) {
		for(i=0;i<64;i++) {
			var c=keyvalue.charAt(i);
			if(doHexCheck(c)<0){
				alert("Pre-Shared Key Hex value error!");
				return true;
			}
		}
	} else {
		alert("Pre-Shared Key length error!");
		return true;
	}
	return false;
}

function doLoad()
{
	var waitMessage = document.getElementById("waiting_div");
	if(waitMessage)
		waitMessage.style.display = "none";
	//2.4G
	var enable = wifi_enable_2g;
	if(enable == "1") {
		document.getElementById("wifi_active_div").style.display = "";
	} else {
		document.getElementById("wifi_active_div").style.display = "none";
	}
	var AuthMode = wifi_authMode_2g;
	var WirelessMode = wifi_mode_2g;
	var select = document.getElementsByName("TKIP_Selection")[0];
	var options = select.options;
	if(AuthMode == "OPEN") {
		document.getElementById("encrypType_tr").style.display = "none";
		document.getElementById("WPAPSK_tr").style.display = "none";
		for(var i = 0; i < options.length; i++) {
			if(WirelessMode == "6" && options[i].value == "TKIP")/*disable TKIP when 2.4g 802.11 Mode:802.11n*/
				options[i].disabled = true;
		}
	} else if(AuthMode == "WPA3PSK" || AuthMode == "WPA2PSKWPA3PSK") {
		document.getElementById("encrypType_tr").style.display = "";
		document.getElementById("WPAPSK_tr").style.display = "";

		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "TKIP" || options[i].value == "TKIPAES")
				options[i].style.display = "none";
			if(WirelessMode == "6" && options[i].value == "TKIP")/*disable TKIP when 2.4g 802.11 Mode:802.11n*/
				options[i].disabled = true;
		}
	} else {
		document.getElementById("encrypType_tr").style.display = "";
		document.getElementById("WPAPSK_tr").style.display = "";

		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "TKIP" || options[i].value == "TKIPAES")
				options[i].style.display = "";
			if(WirelessMode == "6" && options[i].value == "TKIP")/*disable TKIP when 2.4g 802.11 Mode:802.11n*/
				options[i].disabled = true;
		}
	}
	//5G
	enable = wifi_enable_5g;
	if(enable == "1") {
		document.getElementById("wifi_active_5g_div").style.display = "";
	} else {
		document.getElementById("wifi_active_5g_div").style.display = "none";
	}
	AuthMode = wifi_authMode_5g;
	WirelessMode = wifi_mode_5g;
	select = document.getElementsByName("TKIP_Selection_5g")[0];
	options = select.options;
	if(AuthMode == "OPEN") {
		document.getElementById("encrypType_5g_tr").style.display = "none";
		document.getElementById("WPAPSK_5g_tr").style.display = "none";
		for(var i = 0; i < options.length; i++) {
			if(WirelessMode == "15" && options[i].value == "TKIP")/*disable TKIP when 5g 802.11 Mode:11vht AC/AN*/
				options[i].disabled = true;
		}
	} else if(AuthMode == "WPA3PSK" || AuthMode == "WPA2PSKWPA3PSK") {
		document.getElementById("encrypType_5g_tr").style.display = "";
		document.getElementById("WPAPSK_5g_tr").style.display = "";

		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "TKIP" || options[i].value == "TKIPAES")
				options[i].style.display = "none";
			if(WirelessMode == "15" && options[i].value == "TKIP")/*disable TKIP when 5g 802.11 Mode:11vht AC/AN*/
				options[i].disabled = true;
		}
	} else {
		document.getElementById("encrypType_5g_tr").style.display = "";
		document.getElementById("WPAPSK_5g_tr").style.display = "";

		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "TKIP" || options[i].value == "TKIPAES")
				options[i].style.display = "";
			if(WirelessMode == "15" && options[i].value == "TKIP")/*disable TKIP when 5g 802.11 Mode:11vht AC/AN*/
				options[i].disabled = true;
		}
	}
}
</script>
</head>

<body style="background:#4acbd6;" onLoad="doLoad()">
<form name="wifi_form" method="post" ACTION="/cgi-bin/wifi_guest.asp">
<input type="hidden" name="saveFlag" value="0">
<div id="pagestyle">
	<div id="contenttype">
		<div id="block1" class="main_item">
			<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0px;">
				<tr height="25px" style="width:100%;background:#e6e6e6;">
					<td  align="left" class="title-main" style="padding-left:20px;">2.4G Guest Wi-Fi Settings</td>
				</tr>
			</table> 
			<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">SSID Enable</td>
					<td align=left class="tabdata">
						<INPUT TYPE="RADIO" NAME="enable_SSID" onClick="wifi_enable_switch(1)" VALUE="1">
						Enable
						&nbsp;&nbsp;&nbsp;&nbsp;
						<INPUT TYPE="RADIO" NAME="enable_SSID" onClick="wifi_enable_switch(0)" VALUE="0">
						Disable
					</td>
					<script>
					if (wifi_enable_2g == "1") {
						document.getElementsByName("enable_SSID")[0].checked = true;
						document.getElementsByName("enable_SSID")[1].checked = false;
					} else {
						document.getElementsByName("enable_SSID")[0].checked = false;
						document.getElementsByName("enable_SSID")[1].checked = true;
					}
					</script>
				</tr>
			</table>
			<div id="wifi_active_div" >
				<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
					<tr height="30px">
						<td width="250px" align=left class="tabdata" style="padding-left:20px;">SSID Broadcast State</td>
						<td align=left class="tabdata">
							<input type="radio" name="ESSID_HIDE_Selection" value="0">
							Enable
							&nbsp;&nbsp;&nbsp;&nbsp;
							<input type="radio" name="ESSID_HIDE_Selection" value="1">
							Disable
						</td>
						<script>
						if (wifi_hideSSID_2g == "0") {
							document.getElementsByName("ESSID_HIDE_Selection")[0].checked = true;
							document.getElementsByName("ESSID_HIDE_Selection")[1].checked = false;
						} else {
							document.getElementsByName("ESSID_HIDE_Selection")[0].checked = false;
							document.getElementsByName("ESSID_HIDE_Selection")[1].checked = true;
						}
						</script>
					</tr>
					<tr height="30px">
						<td width="250px" align=left class="tabdata" style="padding-left:20px;">SSID</td>
						<td align=left class="tabdata">
							<INPUT TYPE="TEXT" NAME="ESSID" SIZE="20" MAXLENGTH="32">
						</td>
						<script>
						document.getElementsByName("ESSID")[0].value = wifi_ssid_2g;
						</script>
					</tr>
					<tr height="30px">
						<td width="250px" align=left class="tabdata" style="padding-left:20px;">Authentication Type</td>
						<td align=left class="tabdata">
							<SELECT NAME="WEP_Selection" SIZE="1" onChange="doWEPChange()" style="width:176px">
								<OPTION value="OPEN">OPEN
								<OPTION value="WPAPSK">WPA-PSK
								<OPTION value="WPA2PSK">WPA2-PSK
								<OPTION value="WPAPSKWPA2PSK">WPA-PSK/WPA2-PSK
								<OPTION value="WPA3PSK">WPA3-SAE
								<OPTION value="WPA2PSKWPA3PSK">WPA2-PSK/WPA3-SAE
							</SELECT>
						</td>
						<script>
						document.getElementsByName("WEP_Selection")[0].value = wifi_authMode_2g;
						</script>
					</tr>

					<tr height="30px" id="encrypType_tr">
						<td width="250px" align=left class="tabdata" style="padding-left:20px;">Encryption Type</td>
						<td align=left class="tabdata">
							<SELECT NAME="TKIP_Selection" onChange="doEncryptionChange(this)" SIZE="1" style="width:176px">
								<OPTION value="AES">AES
								<OPTION value="TKIP">TKIP
								<OPTION value="TKIPAES">TKIP/AES
							</SELECT>
						</td>
						<script>
						document.getElementsByName("TKIP_Selection")[0].value = wifi_encrypType_2g;
						</script>
					</tr>

					<tr height="30px" id="WPAPSK_tr">
						<td width="250px" align=left class="tabdata" style="padding-left:20px;">Security Passphrase</td>
						<td align=left class="tabdata">
							<INPUT TYPE="TEXT" NAME="PreSharedKey" SIZE="20" MAXLENGTH="64" onBlur="wpapskCheck(this)"><font color="#000000">(8~63 characters or 64 Hex string)</font>
						</td>
						<script>
						document.getElementsByName("PreSharedKey")[0].value = wifi_pwd_2g;
						</script>
					</tr>
				</table>
			</div>
			<div id="5g_div">
			<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0px;">
				<tr height="25px" style="width:100%;background:#e6e6e6;">
					<td  align="left" class="title-main" style="padding-left:20px;">5G Guest Wi-FiSettings</td>
				</tr>
			</table>
			<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">SSID Enable</td>
					<td align=left class="tabdata">
						<INPUT TYPE="RADIO" NAME="enable_SSID_5g" onClick="wifi_enable_switch_5g(1)" VALUE="1">
						Enable
						&nbsp;&nbsp;&nbsp;&nbsp;
						<INPUT TYPE="RADIO" NAME="enable_SSID_5g" onClick="wifi_enable_switch_5g(0)" VALUE="0">
						Disable
					</td>
					<script>
					if (wifi_enable_5g == "1") {
						document.getElementsByName("enable_SSID_5g")[0].checked = true;
						document.getElementsByName("enable_SSID_5g")[1].checked = false;
					} else {
						document.getElementsByName("enable_SSID_5g")[0].checked = false;
						document.getElementsByName("enable_SSID_5g")[1].checked = true;
					}
					</script>
				</tr>
			</table>
			<div id="wifi_active_5g_div" >
				<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
					<tr height="30px">
						<td width="250px" align=left class="tabdata" style="padding-left:20px;">SSID Broadcast State</td>
						<td align=left class="tabdata">
							<input type="radio" name="ESSID_HIDE_Selection_5g" value="0">
							Enable
							&nbsp;&nbsp;&nbsp;&nbsp;
							<input type="radio" name="ESSID_HIDE_Selection_5g" value="1">
							Disable
						</td>
						<script>
						if (wifi_hideSSID_5g == "0") {
							document.getElementsByName("ESSID_HIDE_Selection_5g")[0].checked = true;
							document.getElementsByName("ESSID_HIDE_Selection_5g")[1].checked = false;
						} else {
							document.getElementsByName("ESSID_HIDE_Selection_5g")[0].checked = false;
							document.getElementsByName("ESSID_HIDE_Selection_5g")[1].checked = true;
						}
						</script>
					</tr>
					<tr height="30px">
						<td width="250px" align=left class="tabdata" style="padding-left:20px;">SSID</td>
						<td align=left class="tabdata">
							<INPUT TYPE="TEXT" NAME="ESSID_5g" SIZE="20" MAXLENGTH="32">
						</td>
						<script>
						document.getElementsByName("ESSID_5g")[0].value = wifi_ssid_5g;
						</script>
					</tr>
					<tr height="30px">
						<td width="250px" align=left class="tabdata" style="padding-left:20px;">Authentication Type</td>
						<td align=left class="tabdata">
							<SELECT NAME="WEP_Selection_5g" SIZE="1" onChange="doWEPChange_5g()" style="width:176px">
								<OPTION value="OPEN">OPEN
								<OPTION value="WPAPSK">WPA-PSK
								<OPTION value="WPA2PSK">WPA2-PSK
								<OPTION value="WPAPSKWPA2PSK">WPA-PSK/WPA2-PSK
								<OPTION value="WPA3PSK">WPA3-SAE
								<OPTION value="WPA2PSKWPA3PSK">WPA2-PSK/WPA3-SAE
							</SELECT>
						</td>
						<script>
						document.getElementsByName("WEP_Selection_5g")[0].value = wifi_authMode_5g;
						</script>
					</tr>

					<tr height="30px" id="encrypType_5g_tr">
						<td width="250px" align=left class="tabdata" style="padding-left:20px;">Encryption Type</td>
						<td align=left class="tabdata">
							<SELECT NAME="TKIP_Selection_5g" onChange="doEncryptionChange(this)" SIZE="1" style="width:176px">
								<OPTION value="AES">AES
								<OPTION value="TKIP">TKIP
								<OPTION value="TKIPAES">TKIP/AES
							</SELECT>
						</td>
						<script>
						document.getElementsByName("TKIP_Selection_5g")[0].value = wifi_encrypType_5g;
						</script>
					</tr>

					<tr height="30px" id="WPAPSK_5g_tr">
						<td width="250px" align=left class="tabdata" style="padding-left:20px;">Security Passphrase</td>
						<td align=left class="tabdata">
							<INPUT TYPE="TEXT" NAME="PreSharedKey_5g" SIZE="20" MAXLENGTH="64" onBlur="wpapskCheck(this)"><font color="#000000">(8~63 characters or 64 Hex string)</font>
						</td>
						<script>
						document.getElementsByName("PreSharedKey_5g")[0].value = wifi_pwd_5g;
						</script>
					</tr>
				</table>
			</div>
			</div>
		</div>

		<div id="button0" class="main_item">
			<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0px;" >
				<tr height="25px">
					<td align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Save" to save your settings</td>
				</tr>
			</table>
			<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="40px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">
						<input type="button" name="SaveBtn" class="button1" value="Save" onClick="doSave();">
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
