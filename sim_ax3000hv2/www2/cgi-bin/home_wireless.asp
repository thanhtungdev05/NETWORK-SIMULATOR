
 
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<style>
*{color:  #404040;}
</style>
<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" type="text/javascript" src="/ip_new.js"></script>
<script type="text/javascript" src="/spin.js" ></script>
<link rel="stylesheet" type="text/css" href="/style.css">
<script language="JavaScript">
//////
/*var com_11nMode = "1";//WLan_Common 11nMode
var com_is11nSpecComply = "N/A";//Info_WLan is11nSpecComply
var com_bssidNum = "8";//WLan_Common BssidNum
var com_country = "VIETNAM";//WLan_Common Country
var com_countryRegion = "1";//WLan_Common CountryRegion
var com_rt_device = "7916";//WLan_Common rt_device
var com_apon = "1";//WLan_Common APOn 0/1
var com_channel = "10";//WLan_Common Channel
var info_curChannel = "9";//Info_WLan CurrentChannel
var com_beaconPeriod = "12321";//WLan_Common BeaconPeriod
var com_dtim = "16";//WLan_Common DtimPeriod
var com_mode = "16";//WLan_Common WirelessMode 1/4/0/6/7/9/16
var com_txpower = "100";//WLan_Common TxPower 50/60/70/80/90/100
var info_maxStaSupport = "64";//Info_WLan maxStaNumSupported
var com_maxSta = "32";//WLan_Common MAXSTATIONNUM
var com_mcastEnable = "0";//WLan_Common McastEnable 0/1
var com_ht_bssCoexist = "0";//WLan_Common HT_BSSCoexistence 0/1
var com_ht_bw = "1";//WLan_Common HT_BW 0/1?
var com_ht_extcha = "1";//WLan_Common HT_EXTCHA 0/1
var com_ht_gi = "1";//WLan_Common HT_GI 0/1
var entry_ht_mcs = "33";//WLan_Entry HT_MCS
var entry_enable = "1";//WLan_Entry EnableSSID 0/1
var entry_ssid = "fpt-2.4g-1";//WLan_Entry SSID
var entry_hideSSID = "1";//WLan_Entry HideSSID 0/1
var entry_wmm = "1";//WLan_Entry WMM 0/1
var entry_WPSConfMode = "1";//WLan_Entry WPSConfMode 0-disable/1-enable? 
var entry_WPSConfStatus = "1";//WLan_Entry WPSConfStatus 1/2
var entry_WPSMode = "1";//WLan_Entry WPSMode 0/1
var info_selfPinCode = "321";//Info_WLan wlanSelfPinCode
var entry_enrolleePinCode = "135";//WLan_Entry enrolleePinCode
var info_WPStimerRunning = "1";//Info_WLan wlanWPStimerRunning_0 0/1
var info_WPSStatus = "In progress";//Info_WLan wlanWPSStatus_0 Idle/In progress/Configured/WPS process Fail
var entry_authMode = "WPAPSKWPA2PSK";//WLan_Entry AuthMode OPEN/WPAPSK/WPA2PSK/WPAPSKWPA2PSK/WPA3PSK/WPA2PSKWPA3PSK
var entry_encrypType = "AES";//WLan_Entry EncrypType AES/TKIP/TKIPAES
var entry_WPAPSK = "12345678";//WLan_Entry WPAPSK
var entry_accPolicy = "0";//WLan_Entry AccessPolicy
var entry_mac1 = "AA:BB:CC:DD:11:21";//WLan_Entry WLan_MAC0
var entry_mac2 = "AA:BB:CC:DD:11:22";//WLan_Entry WLan_MAC1
var entry_mac3 = "AA:BB:CC:DD:11:23";//WLan_Entry WLan_MAC2
var entry_mac6 = "AA:BB:CC:DD:11:26";//WLan_Entry WLan_MAC5
var entry_mac8 = "AA:BB:CC:DD:11:28";//WLan_Entry WLan_MAC7*/
//////
var com_is11nSpecComply = "N/A";
var com_bssidNum = "8";
var com_country = "VIETNAM";
var com_countryRegion = "1";
var com_rt_device = "7916";
var com_apon = "1";
var com_channel = "0";
var com_beaconPeriod = "100";
var com_dtim = "1";
var com_mode = "11ax";
var com_11nMode = "1";
var com_txpower = "100";
var com_ht_gi = "0";
var com_maxSta = "0";
var com_mcastEnable = "1";
var info_curChannel = "7";
var info_maxStaSupport = "35";
var com_ht_bssCoexist = "0";
var com_ht_bw = "0";
var com_ht_extcha = "1";
var entry_ht_mcs = "33";
var entry_enable = "1";
var entry_ssid = "FPT Telecom\-1691";
var entry_hideSSID = "0";
var entry_wmm = "0";
var entry_WPAPSK = "24BA7659";
var entry_accPolicy = "0";
var entry_mac_all = "";
var entry_WPSConfMode = "7";
var entry_WPSMode = "1";
var info_selfPinCode = "321";
var entry_enrolleePinCode = "";
var info_WPSStatus="Idle";
var entry_WPSConfStatus = "2";
var info_WPStimerRunning = "0";
var entry_authMode = "WPAPSKWPA2PSK";
var entry_encrypType = "AES";

var entry_mac_arry = [];
if(typeof(entry_mac_all) !== 'undefined')
	entry_mac_arry = entry_mac_all.split(",");
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
var wpsenable;
var wepidx;
var WEPSelectIndex;
function doCheckWepSelectIndex()
{
	var wlan=document.WLAN;
	WEPSelectIndex = wlan.WEP_Selection.selectedIndex;
	return true;
}

function doStartWPS(){
	if((document.WLAN.WPSMode_Selection[0].checked)&&(document.WLAN.isInWPSing.value==0))
	{
		var pincode = document.WLAN.WPSEnrolleePINCode;
		var len = pincode.value.length;
		if(doPINCodeCheck(pincode) == false)
		{
			return ;
		}
		if(entry_WPSConfStatus == "2")
		{
			if(len <= 0)
			{
				alert("WPS PIN code couldn't be null!");
				return;
			}
		}
	}
	if(document.WLAN.isInWPSing.value==0){//xyyou???
		alert("Please Start WPS peer within 2 minutes.");
	}
	document.WLAN.WpsStart.value = 1;
	document.WLAN.submit();
}

function doResetOOB()
{
	document.WLAN.WpsOOB.value = 1;
	document.WLAN.submit();
}

function doGenerate()
{
	document.WLAN.WpsGenerate.value = "1";
	document.WLAN.submit();
}

function doWEPTypeChange()
{

}

function strESSIDCheck(str)
{
	if(str.value.match(/[^\x00-\xff]/g)){
		alert("Invalid SSID Input!");
		return true;
	}
	if(document.WLAN.ESSID.value.length <= 0){
		alert("SSID is empty");
		return true;
	}
	return false;
}

function doRegionCheck()
{
	var vCountryName = document.WLAN.Countries_Channels.value;
	var ctlCountryRegion = document.WLAN.hCountryRegion;
	var ctlCountryRegion0 = document.WLAN.CountryRegion0;
	var ctlCountryRegion1 = document.WLAN.CountryRegion1;
	var ctlCountryRegion2 = document.WLAN.CountryRegion2;
	var ctlCountryRegion3 = document.WLAN.CountryRegion3;
	var ctlCountryRegion5 = document.WLAN.CountryRegion5;
	if(vCountryName == "CANADA")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "COLOMBIA")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "DOMINICAN REPUBLIC")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "GUATEMALA")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "MEXICO")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "NORWAY")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "PANAMA")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "PUERTO RICO")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "UNITED STATES")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "TAIWAN")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "UZBEKISTAN")
		ctlCountryRegion.value = ctlCountryRegion0.value;
	else if (vCountryName == "JAPAN")
		ctlCountryRegion.value = ctlCountryRegion5.value;
//	else if (vCountryName == "SPAIN")
//		ctlCountryRegion.value = ctlCountryRegion2.value;
//	else if (vCountryName == "FRANCE")
//		ctlCountryRegion.value = ctlCountryRegion3.value;
	else
		ctlCountryRegion.value = ctlCountryRegion1.value;
	RefreshPage();
	document.WLAN.CountryChange.value = 1; 
	//document.WLAN.submit();
}

function dowpscheck()
{
	var wlan=document.WLAN;
	if(wlan.SSID_INDEX.value==0){	
		if(wlan.UseWPS_Selection[0].checked == true){
		//check if WscV2Supported
		
		//do simple check if only WPS 1.0 supported, use original check code in 1.0
		
		//WEPSelectIndex 1=WEP64,2=WEP128,3=Radius-WEP64,4=Radius-WEP128
		//if(WEPSelectIndex == 1 || WEPSelectIndex == 2 || WEPSelectIndex == 6 || WEPSelectIndex == 7){
		if(WEPSelectIndex == 6 || WEPSelectIndex == 7){
			alert("We should not use WEP when WPS function turned on!");
			if(wpsenable){
				wlan.UseWPS_Selection[0].checked = true;
			}else{
				wlan.UseWPS_Selection[1].checked = true;
			}
			//wlan.WEP_Selection.selectedIndex = wepidx;
			return 0;
		}else{
			return 1;
		}
		
		}
		else{
			return 1;
		}
	}else{
		return 1;
	}
}

//function doBroadcastSSIDChange(){
function doBroadcastSSIDChange()
{
	//check if WscV2Supported
	
	return 1;
}

function doEncryptionChange(object)
{
	//check if WscV2Supported
	
	return 1;
}

function doWEPChange()
{
	doCheckWepSelectIndex();
	var wlan=document.WLAN;
	
	if ((wlan.SSID_INDEX.value==0))
	{
		if(WEPSelectIndex == 4 || WEPSelectIndex == 5)
		{
			if( wlan.UseWPS_Selection[0].checked == true)
			{
				var rv = confirm("WPS will be disabled!");
				wlan.UseWPS_Selection[0].checked = false;
				wlan.UseWPS_Selection[1].checked = true;
			}
			wlan.UseWPS_Selection[0].disabled = true;
			wlan.UseWPS_Selection[1].disabled = true;
			wlan.WPSMode_Selection[0].disabled = true;
			wlan.WPSMode_Selection[1].disabled = true;
			wlan.StartWPS.disabled = true;
		}
		else
		{
			if( wlan.UseWPS_Selection[0].checked == false)
			{
				wlan.UseWPS_Selection[0].checked = true;
				wlan.UseWPS_Selection[1].checked = false;
			}
			wlan.UseWPS_Selection[0].disabled = false;
			wlan.UseWPS_Selection[1].disabled = false;
			wlan.WPSMode_Selection[0].disabled = false;
			wlan.WPSMode_Selection[1].disabled = false;
			wlan.StartWPS.disabled = false;
		}
	}

	//do simple check if only WPS 1.0 supported, use original check code in 1.0
	
	//if((wlan.SSID_INDEX.value==0) && (wlan.UseWPS_Selection[0].checked == true) &&(WEPSelectIndex == 1 || WEPSelectIndex == 2 || WEPSelectIndex == 6 || WEPSelectIndex == 7))
	if((wlan.SSID_INDEX.value==0) && (wlan.UseWPS_Selection[0].checked == true) &&(WEPSelectIndex == 6 || WEPSelectIndex == 7))
	{
		alert("We should not use WEP when WPS function turned on!");
		wlan.WEP_Selection.selectedIndex = wepidx;
	}
	
	if(WEPSelectIndex == 0)
	{
		var rv = confirm("Your network will be set to OPEN without security setting, we strongly suggest you choose WPA-PSK or WPA2-PSK encryption!!");
		if (rv == false)
		{
			wlan.WEP_Selection.selectedIndex = wepidx;
		}
	}

	document.WLAN.wlanWEPFlag.value = 1;

	doLoad();
}

function doWEPChange2()
{
	if(dowpscheck()){
		document.WLAN.wlanWEPFlag.value = 1;
		//if(document.WLAN.WEP_Selection.selectedIndex != 9){
		if(WEPSelectIndex != 9){
			document.WLAN.WEP_Selection.selectedIndex = 9;
			document.WLAN.submit();
		}
	}
}

function doWDSEncrypTypeChange()
{
		document.WLAN.wlanWEPFlag.value = 4;
		//document.WLAN.submit();
}

function doSSIDChange()
{
	//alert(document.WLAN.SSID_INDEX.value);
	document.WLAN.wlanWEPFlag.value = 2;
	document.WLAN.submit();
}

function nOnlyModeChangeEncryptionType()
{
	var selectElements = document.querySelectorAll('select[name="TKIP_Selection4"], select[name="TKIP_Selection5"], select[name="TKIP_Selection6"]');
	if(document.WLAN.WirelessMode.selectedIndex == 3) {/*802.11n only*/
		selectElements.forEach(function(selectElement) {
			if (selectElement.value === "TKIP") {
				selectElement.value = "AES";
			}
		});
	}
}

function WirelessModeAffectEncryptionType()
{
	var selectElements = document.querySelectorAll('select[name="TKIP_Selection4"], select[name="TKIP_Selection5"], select[name="TKIP_Selection6"]');
	if(document.WLAN.WirelessMode.selectedIndex == 3) {/*802.11n only*/
		selectElements.forEach(function(selectElement) {
			for (var i = 0; i < selectElement.options.length; i++) {
				var option = selectElement.options[i];
				if (option.value === "TKIP") {
					option.disabled = true;
					break;
				}
			}
		});
	} else {
		selectElements.forEach(function(selectElement) {
			for (var i = 0; i < selectElement.options.length; i++) {
				var option = selectElement.options[i];
				if (option.value === "TKIP") {
					option.disabled = false;
					break;
				}
			}
		});
	}
}

function doWirelessModeChange()
{
	document.WLAN.wlanWEPFlag.value = 1;
	if(document.WLAN.WirelessMode.selectedIndex>=3){
		document.WLAN.Is11nMode.value=1;
	}else{
		document.WLAN.Is11nMode.value=0;
		document.WLAN.WMM_Selection.value=0;
		if(com_rt_device == "7615")
			document.WLAN.WLanTxBeamForming[3].selected = true;
//		document.getElementById("WLanTxBeamForming").style.display="none";
	}
	//document.WLAN.submit();
	nOnlyModeChangeEncryptionType();
	doLoad();
}

function doChannelBandwidthChange()
{
	document.WLAN.wlanWEPFlag.value = 1;
	//if(document.WLAN.WLANExtensionChannel.selectedIndex==0){
	//	document.WLAN.ExtChannFlag.value = 0;
	//}else{
	//	document.WLAN.ExtChannFlag.value = 1;
	//}
	//document.WLAN.submit();
	doLoad();
}

function doExtChannChange()
{
	if(document.WLAN.WLANExtensionChannel.selectedIndex==0){
		document.WLAN.ExtChannFlag.value = 0;
	}else{
		document.WLAN.ExtChannFlag.value = 1;
	}
}

function doExtChaLockChange()
{
	if(document.WLAN.WirelessMode.selectedIndex >= 3){
		if((document.WLAN.WLANChannelBandwidth.selectedIndex == 1)||(document.WLAN.WLANChannelBandwidth.selectedIndex == 2)){
			document.WLAN.wlanWEPFlag.value = 1;
			//document.WLAN.submit();
			doLoad();
		}
	}
}

function doAccControlChange()
{
	//document.WLAN.submit();
	RefreshPage();
	doLoad(); 
}

function doWPSUseChange()
{
	if(dowpscheck()){
		document.WLAN.wlanWEPFlag.value = 1;
		//document.WLAN.submit();
		RefreshPage();
		doLoad(); 
	}
}

function doWPSModeChange()
{
	document.WLAN.wlanWEPFlag.value = 1;
	if(document.WLAN.WLANChannelBandwidth.selectedIndex == 1){
		document.WLAN.Wlan_HTBW40M.value = 1;
		document.WLAN.WLANChannelBandwidth.value = 1;
	}
	else if(document.WLAN.WLANChannelBandwidth.selectedIndex == 2){
		document.WLAN.Wlan_HTBW40M.value = 0;
		document.WLAN.WLANChannelBandwidth.value = 1;
	}
	else{
		document.WLAN.WLANChannelBandwidth.value = 0;
	}
	document.WLAN.submit();
}

function wpapskCheck(object)
{
	var keyvalue=object.value;
	var wpapsklen=object.value.length;

	if(wpapsklen >= 8 && wpapsklen < 64) {
		if(keyvalue.match(/[^\x00-\xff]/g))
		{
//			alert("wpapsk Key should be between 8 and 63 ASCII characters(except \',\') or 64 Hex string.");
			alert("Pre-Shared Key should be between 8 and 63 ASCII characters or 64 Hex string.");
			return true;
//   	    } else {
//   	        for ( i = 0; i < wpapsklen; i++)
//   	        if (keyvalue.charAt(i) == ','){
////			   alert("wpapsk Key should be between 8 and 63 ASCII characters(except \',\') or 64 Hex string.");
//			   alert("Pre-Shared Key should be between 8 and 63 ASCII characters or 64 Hex string.");
//			   return true;
//   	        }
		}
	}else if(wpapsklen==64){
		for(i=0;i<64;i++){
			var c=keyvalue.charAt(i);
			if(doHexCheck(c)<0){
//				alert('wpapsk Key Hex value error!');
				alert("Pre-Shared Key Hex value error!");
				return true;
			}
		}
	}else {
//    	alert('wpapsk Key length error!');
		alert("Pre-Shared Key length error!");
		return true;
	}
	return false;
}

function RadiusKeyCheck(object) {
	var keyvalue=object.value;
	var radiuskeylen=object.value.length;
	
	if(radiuskeylen < 8) {
		alert('Radius Key length error!');
		return true;
	}else if(radiuskeylen==64){
		for(i=0;i<64;i++){
			var c=keyvalue.charAt(i);
			if(doHexCheck(c)<0){
				alert('Radius Key Hex value error!');
				return true;
			}
		}
	}else if(radiuskeylen > 64) {
		alert('Radius Key length error!');
		return true;
	}
	return false;
}

function WDSKeyCheck(object) {
	var keyvalue=object.value;
	var wdskeylen=object.value.length;

		if(wdskeylen < 8) {
			alert('WDS Key length error!');
		return true;
	}else if(wdskeylen==64){
		for(i=0;i<64;i++){
			var c=keyvalue.charAt(i);
			if(doHexCheck(c)<0){
				alert('WDS Key Hex value error!');
				return true;
			}
		}
	}else if(wdskeylen > 64) {
			alert('WDS Key length error!');
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

function doNonSympolCheck(c)
{
	if ((c >= "0")&&(c <= "9"))
	{
		return 1;
	}
	else if ((c >= "A")&&(c <= "Z"))
	{
		return 1;
	}
	else if ((c >= "a")&&(c <= "z"))
	{
		return 1;
	}

	return -1;
}

function doKEYcheck(object)
{
	var index = object.value.indexOf("0x");
	len=object.value.length;
	
	if(len == 0){
		return true;
	}

	//if(document.WLAN.WEP_Selection.selectedIndex==1)
	if(WEPSelectIndex==1)
	{
//	        if(len==5)/*wep 64*/
//	        {
//		        for(i=0;i<len;i++)
//		        {
//			var c = object.value.charAt(i);
//			if(doNonSympolCheck(c)==-1)
//			{
//				alert("Invalid Key Value");
//					return false;
//			}
//		}
//	}
	if(len==5)/*wep 64*/
	{
		return true;
	}
	else if(len==10)/*wep 64*/
	{
		for(i=0;i<len;i++)
		{
			var c = object.value.charAt(i);
			if(doHexCheck(c)==-1)
			{
				alert("Invalid Key Value");
					return false;
			}
		}
	}
	//	else if(len==12)/*wep 64*/
	//	{
	//		if(index==0)
	//	{
	//		    for ( i = 2; i < len; i++ )
	//		{
	//			var c = object.value.charAt(i);
	//			if(doHexCheck(c)==-1)
	//			{
	//				alert("Invalid Key Value");
	//				return;
	//			}
	//		}
	//	}
	//		else
	//		{
	//			alert("Invalid Key Value");
	//			return;
	//		}
	//	}
		else
		{
			alert("Invalid Key Value");
			return false;
		}
	}
	//else if(document.WLAN.WEP_Selection.selectedIndex==2)
	else if(WEPSelectIndex==2)
	{
//		if(len==13)/*wep 128*/
//	{
//		for(i=0;i<len;i++)
//		{
//			var c = object.value.charAt(i);
//			if(doNonSympolCheck(c)==-1)
//			{
//				alert("Invalid Key Value");
//					return false;
//			}
//		}
//	}
	if(len==13)/*wep 128*/
	{
		return true;
	}
	else if(len==26)/*wep 128*/
	{
		for(i=0;i<len;i++)
		{
			var c = object.value.charAt(i);
			if(doHexCheck(c)==-1)
			{
				alert("Invalid Key Value");
					return false;
			}
		}
	}
		//else if(len==28)/*wep 128*/
		//{
		//	if(index==0)
		//	{
		//	    for ( i = 2; i < len; i++ )
		//		{
		//			var c = object.value.charAt(i);
		//			if(doHexCheck(c)==-1)
		//			{
		//				alert("Invalid Key Value");
		//				return;
		//			}
		//		}
		//	}
		//	else
		//	{
		//		alert("Invalid Key Value");
		//		return;
		//	}
		//}
		else
		{
			alert("Invalid Key Value");
			return false;
		}
	}
	if(document.WLAN.isDot1XSupported.value==1)
	{
		//if(document.WLAN.WEP_Selection.selectedIndex==6)
		if(WEPSelectIndex==6)
		{
//	        if(len==5)/*wep 64*/
//	        {
//		        for(i=0;i<len;i++)
//		        {
//					var c = object.value.charAt(i);
//					if(doNonSympolCheck(c)==-1)
//					{
//						alert("Invalid Key Value");
//						return false;
//					}
//				}
//			}
			if(len==5)/*wep 64*/
			{
				return true;
			}
			else if(len==10)/*wep 64*/
			{
				for(i=0;i<len;i++)
				{
					var c = object.value.charAt(i);
					if(doHexCheck(c)==-1)
					{
						alert("Invalid Key Value");
						return false;
					}
				}
			}
			else
			{
				alert("Invalid Key Value");
				return false;
			}
		}
		//else if(document.WLAN.WEP_Selection.selectedIndex==7)
		else if(WEPSelectIndex==7)
		{
//			if(len==13)/*wep 128*/
//			{
//				for(i=0;i<len;i++)
//				{
//					var c = object.value.charAt(i);
//					if(doNonSympolCheck(c)==-1)
//					{
//						alert("Invalid Key Value");
//						return false;
//					}
//				}
//			}
			if(len==13)/*wep 128*/
			{
				return true;
			}
			else if(len==26)/*wep 128*/
			{
				for(i=0;i<len;i++)
				{
					var c = object.value.charAt(i);
					if(doHexCheck(c)==-1)
					{
						alert("Invalid Key Value");
						return false;
					}
				}
			}
			else
			{
				alert("Invalid Key Value");
				return false;
			}
		}
	}
	return true;
}

function doMACcheck(object)
{
	var szAddr = object.value;
	var len = szAddr.length;
	var errMsg = "Invalid MAC Address";

	if ( len == 0 )
	{
		//object.value ="00:00:00:00:00:00";
		return;
	}

	if ( len == 12 )
	{
		var newAddr = "";
		var i = 0;

		for ( i = 0; i < len; i++ )
		{
			var c = szAddr.charAt(i);

			if ( doHexCheck(c) < 0 )
			{
				alert("Invalid MAC Address");
				object.focus();
				return -1;
			}
			if ( (i == 2) || (i == 4) || (i == 6) || (i == 8) || (i == 10) )
				newAddr = newAddr + ":";
			newAddr = newAddr + c;
		}
		object.value = newAddr;
		return;
	}
	else if ( len == 17 )
	{
		var i = 2;
		var c0 = szAddr.charAt(0);
		var c1 = szAddr.charAt(1);

		if ( (doHexCheck(c0) < 0) || (doHexCheck(c1) < 0) )
		{
			alert("Invalid MAC Address");
			object.focus();
			return -1;
		}
		
		i = 2;
		while ( i < len )
		{
			var c0 = szAddr.charAt(i);
			var c1 = szAddr.charAt(i+1);
			var c2 = szAddr.charAt(i+2);
			if ( (c0 != ":") || (doHexCheck(c1) < 0) || (doHexCheck(c2) < 0) )
			{
				alert("Invalid MAC Address");
				object.focus();
				return -1;
			}
			i = i + 3;
		}
		return; 
	}
	else
	{
		alert("Invalid MAC Address");
		object.focus();
		return -1;
	}
}

function isNumeric(s)
{
	var len= s.length;
	var ch;
	if(len==0)
		return false;
	for( i=0; i< len; i++)
	{
		ch= s.charAt(i);
		if( ch > '9' || ch < '0')
		{
			return false;
		}
	}
	return true;
}

function checkBeacon(value) 
{
	if (!isNumeric(value)) {
		alert("Non-integer value given" + value);
		return true;
	}
	if (value < 20 || value > 1024) {
		alert("Beacon value must be between 20 and 1024");
		return true;
	}
	return false;
}

function checkRTS(value) 
{
	if (!isNumeric(value)) {
		alert("Non-integer value given" + value);
		return true;
	}
	if (value < 1500 || value > 2347) {
		alert("RTS Threshold value must be between 1500 and 2347");
		return true;
	}
	return false;
}

function checkFrag(value) 
{
	if (!isNumeric(value)) {
		alert("Non-integer value given" + value);
		return true;
	}
	if (value < 256 || value > 2346) {
		alert("Fragmentation Threshold value must be between 256 and 2346");
		return true;
	}
	if (value % 2) {
		alert("Fragmentation Threshold value must be an even number");
		return true;
	}
	return false;
}

function checkDTIM(value) 
{
	if (!isNumeric(value)) {
		alert("Non-integer value given" + value);
		return true;
	}
	if (value < 1 || value > 255) {
		alert("DTIM value must be between 1 and 255");
		return true;
	}
	return false;
}

function checkStationNum(value, limit) 
{
	if (!isNumeric(value) || parseInt(value,10) < 0 || parseInt(value,10) > parseInt(limit,10)){
		alert("Station Number value must be between 0 and " + limit);
		return true;
	}
	return false;
}

function checkRekeyinteral(value, flag) 
{
	if (!isNumeric(value)) {
		if(flag == 1){
			alert("WPA Group Rekey Interval : Non-integer value given"); 
		}else{
			alert("Key Renewal Interval : Non-integer value given");
		}
		return true;
	}
	if (value < 10 || value > 4194303) {
		if(flag == 1){
			alert("WPA Group Rekey Interval must be between 10 and 4194303");
		}else{
			alert("Key Renewal Interval must be between 10 and 4194303");
		}
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
      
	  	if (c == '"')
		{
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

function ValidateChecksum(PIN)
{
	var accum = 0;
	accum += 3 * (((PIN - PIN % 10000000) / 10000000) % 10);
	accum += 1 * (((PIN - PIN % 1000000) / 1000000) % 10);
	accum += 3 * (((PIN - PIN % 100000) / 100000) % 10);
	accum += 1 * (((PIN - PIN % 10000) / 10000) % 10);
	accum += 3 * (((PIN - PIN % 1000) / 1000) % 10);
	accum += 1 * (((PIN - PIN % 100) / 100) % 10);
	accum += 3 * (((PIN - PIN % 10) / 10) % 10);
	accum += 1 * (((PIN - PIN % 1) / 1) % 10);
	if ((accum % 10) == 0)
		return true;
	else
		return false;
}



function doPINCodeCheck(object)
{
	var len= object.value.length;
	var ch;



	if (len > 0)
	{
		if(len < 8)
		{
			alert("WPS PIN code must be 8 digits!");
			return;
		}
		for( i=0; i < len; i++)
		{
			ch= object.value.charAt(i);
			if( ch > '9' || ch < '0')
			{
				alert("WPS PIN code must be 8 digits!");
				return;
			}
		}
		if (ValidateChecksum(Number(object.value)) == false)
		{
			alert("WPS PIN code checksum error!");
		}
		return;
	}

}

function doSave()
{
	if(document.WLAN.SSID_INDEX.value==0){
		if(document.WLAN.WPSMode_Selection[0].checked)
		{
			var pincode = document.WLAN.WPSEnrolleePINCode;
			if((doPINCodeCheck(pincode) == false))
			{
				return false;
			}
		}
	}
	/*if(document.WLAN.SSID_INDEX.value == 3)
	{
		alert("This SSID is reserved for Mesh and cannot be modified!!");
		return false;
	}*/
	if(checkBeacon(document.WLAN.BeaconInterval.value) ||
		//checkRTS(document.WLAN.RTSThreshold.value) || //remove for 7552
		//checkFrag(document.WLAN.FragmentThreshold.value) || //remove for 7552
		checkDTIM(document.WLAN.DTIM.value)
		|| checkStationNum(document.WLAN.StationNum.value, document.WLAN.maxStaNum.value)
	){
		return false;
	}

	//if(document.WLAN.WEP_Selection.selectedIndex == 3){
	if(WEPSelectIndex == 1){ 
		document.WLAN.hRekeyMethod.value = "TIME";
		if (wpapskCheck(document.WLAN.PreSharedKey2)){
			return false;
		}

		if(quotationCheck(document.WLAN.PreSharedKey2, 385) ){
			return false;
		}
		if(checkRekeyinteral(document.WLAN.keyRenewalInterval2.value, 0)){
			return false;
		}
	}
	//if(document.WLAN.WEP_Selection.selectedIndex == 4){
	if(WEPSelectIndex == 2){
		document.WLAN.hRekeyMethod.value = "TIME";
		if (wpapskCheck(document.WLAN.PreSharedKey1)){
			return false;
		}

		if(quotationCheck(document.WLAN.PreSharedKey1, 385) ){
			return false;
		}
		if(checkRekeyinteral(document.WLAN.keyRenewalInterval1.value, 0)){
			return false;
		}
	}
	//if(document.WLAN.WEP_Selection.selectedIndex == 5){
	if(WEPSelectIndex == 3){
		document.WLAN.hRekeyMethod.value = "TIME";
		if (wpapskCheck(document.WLAN.PreSharedKey3)){
			return false;
		}
		
		if(quotationCheck(document.WLAN.PreSharedKey3, 385) ){
			return false;
		}
		if(checkRekeyinteral(document.WLAN.keyRenewalInterval3.value, 0)){
			return false;
		}
	}

	if(WEPSelectIndex == 4){
		document.WLAN.hRekeyMethod.value = "TIME";
		if (wpapskCheck(document.WLAN.PreSharedKey4)){
			return false;
		}

		if(quotationCheck(document.WLAN.PreSharedKey4, 385) ){
			return false;
		}
		if(checkRekeyinteral(document.WLAN.keyRenewalInterval4.value, 0)){
			return false;
		}
	}

	if(WEPSelectIndex == 5){
		document.WLAN.hRekeyMethod.value = "TIME";
		if (wpapskCheck(document.WLAN.PreSharedKey5)){
			return false;
		}

		if(quotationCheck(document.WLAN.PreSharedKey5, 385) ){
			return false;
		}
		if(checkRekeyinteral(document.WLAN.keyRenewalInterval5.value, 0)){
			return false;
		}
	}

	//if(document.WLAN.WEP_Selection.selectedIndex == 5){
	//	document.WLAN.hRekeyMethod.value = "TIME";
	//}
	//if(document.WLAN.WEP_Selection.selectedIndex == 1){
	if(WEPSelectIndex == 1){ 
		document.WLAN.hRekeyMethod.value = "DISABLE";
		if((!doKEYcheck(document.WLAN.WEP_Key13))||
		(!doKEYcheck(document.WLAN.WEP_Key23))||
		(!doKEYcheck(document.WLAN.WEP_Key33))||
		(!doKEYcheck(document.WLAN.WEP_Key43))){
			//alert("key check fail");
			return false;
		}
	}

	//if(document.WLAN.WEP_Selection.selectedIndex == 2){
	if(WEPSelectIndex == 2){ 
		document.WLAN.hRekeyMethod.value = "DISABLE";
		if((!doKEYcheck(document.WLAN.WEP_Key14))||
		(!doKEYcheck(document.WLAN.WEP_Key24))||
		(!doKEYcheck(document.WLAN.WEP_Key34))||
		(!doKEYcheck(document.WLAN.WEP_Key44))){
			//alert("key check fail");
			return false;
		}
	}

	if(document.WLAN.isDot1XSupported.value==1)
	{
		//if(document.WLAN.WEP_Selection.selectedIndex == 6)
		if(WEPSelectIndex == 6) 
		{
			if((!doKEYcheck(document.WLAN.WEP_Key11))||
			(!doKEYcheck(document.WLAN.WEP_Key21))||
			(!doKEYcheck(document.WLAN.WEP_Key31))||
			(!doKEYcheck(document.WLAN.WEP_Key41)))
			{
				//alert("key check fail");
				return false;
			}
		}
		//if(document.WLAN.WEP_Selection.selectedIndex == 7)
		if(WEPSelectIndex == 7) 
		{
			if((!doKEYcheck(document.WLAN.WEP_Key12))||
			(!doKEYcheck(document.WLAN.WEP_Key22))||
			(!doKEYcheck(document.WLAN.WEP_Key32))||
			(!doKEYcheck(document.WLAN.WEP_Key42)))
			{

				return false;
			}
		}
		var vAuthMode = document.WLAN.WEP_Selection.selectedIndex;
		//var vAuthMode = document.WLAN.WEP_Selection.selectedIndex;
		//if((document.WLAN.WEP_Selection.selectedIndex == 6) ||(document.WLAN.WEP_Selection.selectedIndex == 7) 
		//|| (document.WLAN.WEP_Selection.selectedIndex == 8) || (document.WLAN.WEP_Selection.selectedIndex == 9)
		//|| (document.WLAN.WEP_Selection.selectedIndex == 10))
		if((WEPSelectIndex == 6) || (WEPSelectIndex == 7) || (WEPSelectIndex == 8) || (WEPSelectIndex == 9)
		|| (WEPSelectIndex == 10))
		{
			if(document.WLAN.isDot1XEnhanceSupported.value == 0)
			{
				if(vAuthMode == 6){
					radiusip = document.WLAN.radiusSVR_IP1.value;
				}
				else if(vAuthMode == 7){
					radiusip = document.WLAN.radiusSVR_IP2.value;
				}
				else if(vAuthMode == 8){
					radiusip = document.WLAN.radiusSVR_IP3.value;
				}
				else if(vAuthMode == 9){
					radiusip = document.WLAN.radiusSVR_IP4.value;
				}
				else if(vAuthMode == 10){
					radiusip = document.WLAN.radiusSVR_IP5.value;
				}

				 if(inValidIPAddr(radiusip))
				 {
					return false;
				 }
			}
			 //serverport
			//radiusport = parseInt(document.WLAN.radiusSVR_Port.value);
			if(vAuthMode == 6){
				radiusport = parseInt(document.WLAN.radiusSVR_Port1.value);
				radiuskey = document.WLAN.radiusSVR_Key1.value;
				if(RadiusKeyCheck(document.WLAN.radiusSVR_Key1))
						return false; 
				session_timeout_interval = document.WLAN.radiusSVR_ReAuthInter1.value;
			}
			else if(vAuthMode == 7){
				radiusport = parseInt(document.WLAN.radiusSVR_Port2.value);
				radiuskey = document.WLAN.radiusSVR_Key2.value;
				if(RadiusKeyCheck(document.WLAN.radiusSVR_Key2))
						return false; 
				session_timeout_interval = document.WLAN.radiusSVR_ReAuthInter2.value;
			}
			else if(vAuthMode == 8){
				radiusport = parseInt(document.WLAN.radiusSVR_Port3.value);
				radiuskey = document.WLAN.radiusSVR_Key3.value;
				if(RadiusKeyCheck(document.WLAN.radiusSVR_Key3))
						return false; 
				session_timeout_interval = document.WLAN.radiusSVR_ReAuthInter3.value;
			}
			else if(vAuthMode == 9){
				radiusport = parseInt(document.WLAN.radiusSVR_Port4.value);
				radiuskey = document.WLAN.radiusSVR_Key4.value;
				if(RadiusKeyCheck(document.WLAN.radiusSVR_Key4))
						return false; 
				session_timeout_interval = document.WLAN.radiusSVR_ReAuthInter4.value;
			}
			else if(vAuthMode == 10){
				radiusport = parseInt(document.WLAN.radiusSVR_Port5.value);
				radiuskey = document.WLAN.radiusSVR_Key5.value;
				if(RadiusKeyCheck(document.WLAN.radiusSVR_Key5))
						return false; 
				session_timeout_interval = document.WLAN.radiusSVR_ReAuthInter5.value;
			}
			if(isNaN(radiusport) || radiusport < 0 || radiusport > 65535)
			{	
				alert("Radius Server Port number's range: 0 ~ 65535");
				return false;
			}
			
			// radius share key
			//radiuskey = document.WLAN.radiusSVR_Key.value;
			{
				if (radiuskey.length == 0)
				{
  					alert("Radius Share secret can not be empty"); 
  					return false; 
				}
			}
			//session_timeout_interval = document.WLAN.radiusSVR_ReAuthInter.value;
			{
				if (session_timeout_interval.length == 0)
				{
						alert("Re-auth Interval can not be empty"); 
						return false; 
				}
			}
		}
		//if((document.WLAN.WEP_Selection.selectedIndex == 8) //WPA
		//	|| (document.WLAN.WEP_Selection.selectedIndex == 9) //WPA2
		//	|| (document.WLAN.WEP_Selection.selectedIndex == 10)) //WPAWPA2
		if((WEPSelectIndex == 8) || (WEPSelectIndex == 9) || (WEPSelectIndex == 10))
		{
			if(vAuthMode == 8){
				WPARekeyInter = document.WLAN.WPARekeyInter3.value;
			}
			else if(vAuthMode == 9){
				WPARekeyInter = document.WLAN.WPARekeyInter4.value;
			}
			else if(vAuthMode == 10){
				WPARekeyInter = document.WLAN.WPARekeyInter5.value;
			}

			if(checkRekeyinteral(WPARekeyInter, 1)){
				return false;
			}
		}
	}

	//if wds support meantime AuthMode of MAIN SSID is wpa2psk,wpapsk WPAPSKWPA2PSK , then check wds key 
	if(document.WLAN.isWDSSupported.value==1)
	{
		if(document.WLAN.WLAN_WDS_Active[0].checked == true)//if wds enable ,to check wds_key, or not to check
		{
			if(document.WLAN.isDot1XSupported.value==1)
			{
//				if((document.WLAN.WEP_Selection.selectedIndex == 3) ||
//				(document.WLAN.WEP_Selection.selectedIndex == 4) || (document.WLAN.WEP_Selection.selectedIndex == 5)
//				|| (document.WLAN.WEP_Selection.selectedIndex == 8) || (document.WLAN.WEP_Selection.selectedIndex == 9)
//				|| (document.WLAN.WEP_Selection.selectedIndex == 10))
				if((WEPSelectIndex == 3) || (WEPSelectIndex == 4) || (WEPSelectIndex == 5)
				|| (WEPSelectIndex == 8) || (WEPSelectIndex == 9) || (WEPSelectIndex == 10))
				{
					if (WDSKeyCheck(document.WLAN.WDS_Key))
					{
						return false;
					}
			
					if(quotationCheck(document.WLAN.WDS_Key, 385) )
					{
						return false;
					}
				}
			}
			else
			{
//				if((document.WLAN.WEP_Selection.selectedIndex == 3) ||
//				(document.WLAN.WEP_Selection.selectedIndex == 4) || (document.WLAN.WEP_Selection.selectedIndex == 5))
				if((WEPSelectIndex == 3) || (WEPSelectIndex == 4) || (WEPSelectIndex == 5))
				{
					if (WDSKeyCheck(document.WLAN.WDS_Key))
					{
						return false;
					}
					if(quotationCheck(document.WLAN.WDS_Key, 385) )
					{
						return false;
					}
				}
			}
		}
	}
	if(quotationCheck(document.WLAN.ESSID, 193)||strESSIDCheck(document.WLAN.ESSID)){
		return;
	}

	if(doMACcheck(document.WLAN.WLANFLT_MAC1) == -1)
	{
		return false;
	}
	if(doMACcheck(document.WLAN.WLANFLT_MAC2) == -1)
	{
		return false;
	}
	if(doMACcheck(document.WLAN.WLANFLT_MAC3) == -1)
	{
		return false;
	}
	if(doMACcheck(document.WLAN.WLANFLT_MAC4) == -1)
	{
		return false;
	}
	if(doMACcheck(document.WLAN.WLANFLT_MAC5) == -1)
	{
		return false;
	}
	if(doMACcheck(document.WLAN.WLANFLT_MAC6) == -1)
	{
		return false;
	}
	if(doMACcheck(document.WLAN.WLANFLT_MAC7) == -1)
	{
		return false;
	}
	if(doMACcheck(document.WLAN.WLANFLT_MAC8) == -1)
	{
		return false;
	}

	document.WLAN.wlanWEPFlag.value = 3;
	if(document.WLAN.WirelessMode.selectedIndex>=3){
		document.WLAN.Is11nMode.value=1;
		document.WLAN.WMM_Selection.value=0;//add for 7552
		if(document.WLAN.WLANChannelBandwidth.selectedIndex == 1){
			document.WLAN.Wlan_HTBW40M.value = 1;
			document.WLAN.WLANChannelBandwidth.value = 1;
		}
		else if(document.WLAN.WLANChannelBandwidth.selectedIndex == 2){
			document.WLAN.Wlan_HTBW40M.value = 0;
			document.WLAN.WLANChannelBandwidth.value = 1;
		}
		else{
			document.WLAN.WLANChannelBandwidth.value = 0;
		}
	}else{
		document.WLAN.Is11nMode.value=0;
	}
	document.WLAN.submit();
}

function checkSelectedKEY()
{
	var group;
	var curCBX;
	var vAuthMode = document.WLAN.WEP_Selection.value;
	if(vAuthMode == "Radius-WEP64"){
		group = document.WLAN.DefWEPKey1;
	}
	else if(vAuthMode == "Radius-WEP128"){
		group = document.WLAN.DefWEPKey2;
	}
	else if(vAuthMode == "WEP-64Bits"){
		group = document.WLAN.DefWEPKey3;
	}
	else if(vAuthMode == "WEP-128Bits"){
		group = document.WLAN.DefWEPKey4;
	}

	for (var i=0; i<group.length; i++){
		if (group[i].checked)
		break;
	}
	
	if(vAuthMode == "Radius-WEP64"){
		switch (i)
		{
		case 0:
			curCBX = document.WLAN.WEP_Key11;
			break;
		case 1:
			curCBX = document.WLAN.WEP_Key21;
			break;
		case 2:
			curCBX = document.WLAN.WEP_Key31;
			break;
		case 3:
			curCBX = document.WLAN.WEP_Key41;
			break;
		default:
		  ;
		}
	}
	else if(vAuthMode == "Radius-WEP128"){
		switch (i)
		{
		case 0:
			curCBX = document.WLAN.WEP_Key12;
			break;
		case 1:
			curCBX = document.WLAN.WEP_Key22;
			break;
		case 2:
			curCBX = document.WLAN.WEP_Key32;
			break;
		case 3:
			curCBX = document.WLAN.WEP_Key42;
			break;
		default:
		  ;
		}
	}
	else if(vAuthMode == "WEP-64Bits"){
		switch (i)
		{
		case 0:
			curCBX = document.WLAN.WEP_Key13;
			break;
		case 1:
			curCBX = document.WLAN.WEP_Key23;
			break;
		case 2:
			curCBX = document.WLAN.WEP_Key33;
			break;
		case 3:
			curCBX = document.WLAN.WEP_Key43;
			break;
		default:
		  ;
		}
	}
	else if(vAuthMode == "WEP-128Bits"){
		switch (i)
		{
		case 0:
			curCBX = document.WLAN.WEP_Key14;
			break;
		case 1:
			curCBX = document.WLAN.WEP_Key24;
			break;
		case 2:
			curCBX = document.WLAN.WEP_Key34;
			break;
		case 3:
			curCBX = document.WLAN.WEP_Key44;
			break;
		default:
		  ;
		}
	}
	
	len=curCBX.value.length;
	index = curCBX.value.indexOf("0x");
	
//	if(document.WLAN.WEP_Selection.selectedIndex==1)/*wep 64*/
	if(WEPSelectIndex==1)/*wep 64*/
	{
		if(len==5)
		{
			for(i=0;i<len;i++)
			{
				var c = curCBX.value.charAt(i);
				if(doNonSympolCheck(c)==-1)
				{
					alert("Invalid Key Value");
					curCBX.focus();
					return false;
				}
			}
		}
		else if(len==10)
		{
			for(i=0;i<len;i++)
			{
				var c = curCBX.value.charAt(i);
				if(doHexCheck(c)==-1)
				{
					alert("Invalid Key Value");
					curCBX.focus();
					return false;
				}
			}
		}
		else if(len==12)
		{
			if(index==0)
			{
				for(i=2;i<len;i++)
				{
					var c = curCBX.value.charAt(i);
					if(doHexCheck(c)==-1)
					{
						alert("Invalid Key Value");
						curCBX.focus();
						return false;
					}
				}
			}
			else
			{
				alert("Invalid Key Value");
				curCBX.focus();
				return false;
			}
		}
		else
		{
			alert("Invalid Key Value");
			curCBX.focus();
			return false;
		}
	}
//	else if(document.WLAN.WEP_Selection.selectedIndex==2)/*wep 128*/
	else if(WEPSelectIndex==2)/*wep 128*/
	{
		if(len==13)
		{
			for(i=0;i<len;i++)
			{
				var c = curCBX.value.charAt(i);
				if(doNonSympolCheck(c)==-1)
				{
					alert("Invalid Key Value");
					curCBX.focus();
					return false;
				}
			}
		}
		else if(len==26)
		{
			for(i=0;i<len;i++)
			{
				var c = curCBX.value.charAt(i);
				if(doHexCheck(c)==-1)
				{
					alert("Invalid Key Value");
					curCBX.focus();
					return false;
				}
			}
		}
		else if(len==28)
		{
			if(index==0)
			{
				for(i=2;i<len;i++)
				{
					var c = curCBX.value.charAt(i);
					if(doHexCheck(c)==-1)
					{
						alert("Invalid Key Value");
						curCBX.focus();
						return false;
					}
				}
			}
			else
			{
				alert("Invalid Key Value");
				curCBX.focus();
				return false;
			}
		}
		else
		{
			alert("Invalid Key Value");
			curCBX.focus();
			return false;
		}
	}
}

function checkFocus(value)
{
	//if(document.form.WEP_Selection.selectedIndex == 0){
	if(WEPSelectIndex == 0){
		document.form.WEP_Selection.focus();
	}
}

function autoWLAN_WDS_Active()
{
	if(document.WLAN.WDS_EncrypType_Selection != null){
		document.WLAN.WDS_EncrypType_Selection.disabled = false;
		document.WLAN.WDS_Key.disabled = false;
	}
	document.WLAN.WLANWDS_PEER_MAC1.disabled = false;
	document.WLAN.WLANWDS_PEER_MAC2.disabled = false;
	document.WLAN.WLANWDS_PEER_MAC3.disabled = false;
	document.WLAN.WLANWDS_PEER_MAC4.disabled = false;
}

function autoWLAN_WDS_Deactive()
{
	if(document.WLAN.WDS_EncrypType_Selection != null){
		document.WLAN.WDS_EncrypType_Selection.disabled = true;
		document.WLAN.WDS_Key.disabled = true;
	}
	document.WLAN.WLANWDS_PEER_MAC1.disabled = true;
	document.WLAN.WLANWDS_PEER_MAC2.disabled = true;
	document.WLAN.WLANWDS_PEER_MAC3.disabled = true;
	document.WLAN.WLANWDS_PEER_MAC4.disabled = true;
}

function doLoad()
{
	doCheckSSID();
	RefreshPage();
	doCheckWepSelectIndex();
	if(0)//document.WLAN.isDot1XSupported.value==1)
	{
		if(document.WLAN.isAuthenTypeSupported.value==1)
		{
			document.getElementById("WEP_Selection_div").style.display="none";
			document.getElementById("WEP_Selection_show_div").style.display="";
			doWEPChange2();
		}
		else
		{
			document.getElementById("WEP_Selection_div").style.display="";
			document.getElementById("WEP_Selection_show_div").style.display="none";
		}
	}
	if(document.WLAN.WirelessMode.selectedIndex>=3){
		document.WLAN.Is11nMode.value=1;
		if((document.WLAN.WLANChannelBandwidth.selectedIndex == 1)||(document.WLAN.WLANChannelBandwidth.selectedIndex == 2)){
			if(document.WLAN.Channel_ID.selectedIndex <= 4){
				document.WLAN.WLANExtensionChannel.selectedIndex = 1;
				document.WLAN.WLANExtensionChannel.disabled = true;
				document.WLAN.ExtChannFlag.value = 1;
			}
			else if(document.WLAN.Channel_ID.selectedIndex >= 8){
				document.WLAN.WLANExtensionChannel.selectedIndex = 0;
				document.WLAN.WLANExtensionChannel.disabled = true;
				document.WLAN.ExtChannFlag.value = 0;
			}
			else{
				document.WLAN.WLANExtensionChannel.disabled = false;
				if(document.WLAN.WLANExtensionChannel.selectedIndex==0){
					document.WLAN.ExtChannFlag.value = 0;
				}else{
					document.WLAN.ExtChannFlag.value = 1;
				}
			}
		}
	}else{
		document.WLAN.Is11nMode.value=0;
	}

	if(document.WLAN.isInWPSing.value==1){
		document.WLAN.ResetOOB.disabled = true;
		document.WLAN.BUTTON.disabled = true;
		document.WLAN.CancelBtn.disabled = true;
	}
	if(document.WLAN.wlan_VC.value==0){
		wpsenable = document.WLAN.UseWPS_Selection[0].checked;
	}

	wepidx = WEPSelectIndex;

	if(document.WLAN.isWDSSupported.value==1)
	{
		if(document.WLAN.WLAN_WDS_Active[0].checked == true){//if wds enable
			autoWLAN_WDS_Active();
		}else if(document.WLAN.WLAN_WDS_Active[1].checked == true){//if wds disable
			autoWLAN_WDS_Deactive();
		}
	}
	if(document.WLAN.bharti_ssid2.value==1)
		doloadSSID2();
	if ((document.WLAN.SSID_INDEX.value==0)&& (WEPSelectIndex == 4 || WEPSelectIndex == 5))
	{
		document.WLAN.UseWPS_Selection[0].disabled = true;
		document.WLAN.UseWPS_Selection[1].disabled = true;
		document.WLAN.WPSMode_Selection[0].disabled = true;
		document.WLAN.WPSMode_Selection[1].disabled = true;
		document.WLAN.StartWPS.disabled = true;
	}
	WirelessModeAffectEncryptionType();
}

function doCheckSSID()
{
	var ssid_val = document.WLAN.wlan_VC.value;
	var ssid_optval = document.WLAN.SSID_INDEX.value;
	if(ssid_val != ssid_optval)
	{
		document.WLAN.wlanWEPFlag.value = 2;
		document.WLAN.submit();
	}
}

function doloadSSID2()
{
	if(document.WLAN.SSID_INDEX.selectedIndex == 1)
	{
		var j;
		var frm = document.WLAN;
		for(j = 0; j < frm.elements.length; j++)
		{	
			if(frm.elements[j].type != "hidden")
				frm.elements[j].disabled = true;
		}
	}
	document.WLAN.SSID_INDEX.disabled = false;
}

var bInit = 1;

function RefreshPage()
{
	var autoText = "Auto";
	var index = 0;
	var ctlChannel_ID = document.WLAN.Channel_ID;
	var vChannel = ctlChannel_ID.value;
	var vCountryRegion = document.WLAN.hCountryRegion.value;
	if(bInit == 1){
		vChannel = com_channel;
		bInit = 0;
	}
	ctlChannel_ID.length = 0;
	if(vCountryRegion == 0){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("01", "1");
		ctlChannel_ID.options[index++] = new Option("02", "2");
		ctlChannel_ID.options[index++] = new Option("03", "3");
		ctlChannel_ID.options[index++] = new Option("04", "4");
		ctlChannel_ID.options[index++] = new Option("05", "5");
		ctlChannel_ID.options[index++] = new Option("06", "6");
		ctlChannel_ID.options[index++] = new Option("07", "7");
		ctlChannel_ID.options[index++] = new Option("08", "8");
		ctlChannel_ID.options[index++] = new Option("09", "9");
		ctlChannel_ID.options[index++] = new Option("10", "10");
		ctlChannel_ID.options[index++] = new Option("11", "11");
	}else if(vCountryRegion == 2){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("10", "10");
		ctlChannel_ID.options[index++] = new Option("11", "11");
	}else if(vCountryRegion == 3){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("10", "10");
		ctlChannel_ID.options[index++] = new Option("11", "11");
		ctlChannel_ID.options[index++] = new Option("12", "12");
		ctlChannel_ID.options[index++] = new Option("13", "13");
	}else if(vCountryRegion == 4){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("04", "4");
	}else if(vCountryRegion == 5){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("01", "1");
		ctlChannel_ID.options[index++] = new Option("02", "2");
		ctlChannel_ID.options[index++] = new Option("03", "3");
		ctlChannel_ID.options[index++] = new Option("04", "4");
		ctlChannel_ID.options[index++] = new Option("05", "5");
		ctlChannel_ID.options[index++] = new Option("06", "6");
		ctlChannel_ID.options[index++] = new Option("07", "7");
		ctlChannel_ID.options[index++] = new Option("08", "8");
		ctlChannel_ID.options[index++] = new Option("09", "9");
		ctlChannel_ID.options[index++] = new Option("10", "10");
		ctlChannel_ID.options[index++] = new Option("11", "11");
		ctlChannel_ID.options[index++] = new Option("12", "12");
		ctlChannel_ID.options[index++] = new Option("13", "13");
		ctlChannel_ID.options[index++] = new Option("14", "14");
	}else if(vCountryRegion == 6){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("03", "3");
		ctlChannel_ID.options[index++] = new Option("04", "4");
		ctlChannel_ID.options[index++] = new Option("05", "5");
		ctlChannel_ID.options[index++] = new Option("06", "6");
		ctlChannel_ID.options[index++] = new Option("07", "7");
		ctlChannel_ID.options[index++] = new Option("08", "8");
		ctlChannel_ID.options[index++] = new Option("09", "9");
	}else{
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("01", "1");
		ctlChannel_ID.options[index++] = new Option("02", "2");
		ctlChannel_ID.options[index++] = new Option("03", "3");
		ctlChannel_ID.options[index++] = new Option("04", "4");
		ctlChannel_ID.options[index++] = new Option("05", "5");
		ctlChannel_ID.options[index++] = new Option("06", "6");
		ctlChannel_ID.options[index++] = new Option("07", "7");
		ctlChannel_ID.options[index++] = new Option("08", "8");
		ctlChannel_ID.options[index++] = new Option("09", "9");
		ctlChannel_ID.options[index++] = new Option("10", "10");
		ctlChannel_ID.options[index++] = new Option("11", "11");
		ctlChannel_ID.options[index++] = new Option("12", "12");
		ctlChannel_ID.options[index++] = new Option("13", "13");
	}
	ctlChannel_ID.options[0].selected=true;
	SelectValue(ctlChannel_ID, vChannel);

	if(document.WLAN.Is11nMode.value == "1"){
		document.getElementById("11nMode_0_div").style.display="none";
		document.getElementById("11nMode_1_div").style.display="";
	}else{
		document.getElementById("11nMode_0_div").style.display="";
		document.getElementById("11nMode_1_div").style.display="none";
	}

	if((document.WLAN.WLANChannelBandwidth.value == 1) || (document.WLAN.WLANChannelBandwidth.value == 2))
		document.getElementById("HT_BW_1_div").style.display="";
	else
		document.getElementById("HT_BW_1_div").style.display="none";

	if(document.WLAN.wlan_VC.value==0){
		document.getElementById("WPSSettingText_table").style.display="";
		if(document.WLAN.UseWPS_Selection[0].checked == true)
			document.getElementById("WPSConfMode_1_div").style.display="";
		else
			document.getElementById("WPSConfMode_1_div").style.display="none";
	}
	else
		document.getElementById("WPSSettingText_table").style.display="none";

	if(document.WLAN.WLAN_FltActive[0].checked == true)
		document.getElementById("accessControl_div").style.display="";
	else
		document.getElementById("accessControl_div").style.display="none";

	var vAuthMode = document.WLAN.WEP_Selection.value;
	if(document.getElementById("Radius-WEP64_div") != null) 
		document.getElementById("Radius-WEP64_div").style.display="none";
	if(document.getElementById("Radius-WEP128_div") != null)
		document.getElementById("Radius-WEP128_div").style.display="none";
	if(document.getElementById("WPA_div") != null)
		document.getElementById("WPA_div").style.display="none";
	if(document.getElementById("WPA2_div") != null)
		document.getElementById("WPA2_div").style.display="none";
	if(document.getElementById("WPA1WPA2_div") != null)
		document.getElementById("WPA1WPA2_div").style.display="none";
		
	if(vAuthMode == "Radius-WEP64"){
		if(document.getElementById("Radius-WEP64_div") != null) 
			document.getElementById("Radius-WEP64_div").style.display="";
	}
	if(vAuthMode == "Radius-WEP128"){
		if(document.getElementById("Radius-WEP128_div") != null)
			document.getElementById("Radius-WEP128_div").style.display="";
	}
	if(vAuthMode == "WPA"){
		if(document.getElementById("WPA_div") != null)
			document.getElementById("WPA_div").style.display="";
	}
	if(vAuthMode == "WPA2"){
		if(document.getElementById("WPA2_div") != null)
			document.getElementById("WPA2_div").style.display="";
	}
	if(vAuthMode == "WPA1WPA2"){
		if(document.getElementById("WPA1WPA2_div") != null)
			document.getElementById("WPA1WPA2_div").style.display="";
	}
	if(document.getElementById("WEP-64Bits_div") != null)
		document.getElementById("WEP-64Bits_div").style.display="none";
	if(document.getElementById("WEP-128Bits_div") != null)
		document.getElementById("WEP-128Bits_div").style.display="none";
	if(document.getElementById("WPA2PSK_div") != null)
		document.getElementById("WPA2PSK_div").style.display="none";
	if(document.getElementById("WPAPSK_div") != null)
		document.getElementById("WPAPSK_div").style.display="none";
	if(document.getElementById("WPAPSKWPA2PSK_div") != null)
		document.getElementById("WPAPSKWPA2PSK_div").style.display="none";
	if(document.getElementById("WPA3PSK_div") != null)
		document.getElementById("WPA3PSK_div").style.display="none";
	if(document.getElementById("WPA2PSKWPA3PSK_div") != null)
		document.getElementById("WPA2PSKWPA3PSK_div").style.display="none";
	if(vAuthMode == "WEP-64Bits"){
		if(document.getElementById("WEP-64Bits_div") != null)
			document.getElementById("WEP-64Bits_div").style.display="";
	}else if(vAuthMode == "WEP-128Bits"){
		if(document.getElementById("WEP-128Bits_div") != null)
			document.getElementById("WEP-128Bits_div").style.display="";
	}else if(vAuthMode == "WPA2PSK"){
		if(document.getElementById("WPA2PSK_div") != null)
			document.getElementById("WPA2PSK_div").style.display="";
	}else if(vAuthMode == "WPAPSK"){
		if(document.getElementById("WPAPSK_div") != null)
			document.getElementById("WPAPSK_div").style.display="";
	}else if(vAuthMode == "WPAPSKWPA2PSK"){
		if(document.getElementById("WPAPSKWPA2PSK_div") != null)
			document.getElementById("WPAPSKWPA2PSK_div").style.display="";
	}else if(vAuthMode == "WPA3PSK"){
		if(document.getElementById("WPA3PSK_div") != null)
			document.getElementById("WPA3PSK_div").style.display="";
	}else if(vAuthMode == "WPA2PSKWPA3PSK"){
		if(document.getElementById("WPA2PSKWPA3PSK_div") != null)
			document.getElementById("WPA2PSKWPA3PSK_div").style.display="";
	}
	if(document.getElementById("else_div") != null)
		document.getElementById("else_div").style.display="none";
	if(vAuthMode == "OPEN")
		;
	else if(vAuthMode == "WEP-64Bits")
		;
	else if(vAuthMode == "WEP-128Bits")
		;
	else if(vAuthMode == "Radius-WEP64")
		;
	else if(vAuthMode == "Radius-WEP128")
		;
	else if(document.getElementById("else_div") != null)
		document.getElementById("else_div").style.display="";
}

function SelectValue(o,v)
{
	for(var i=0; i<o.options.length; i++)
		if(o.options[i].value == v){
		o.options[i].selected=true;
		break;
	}
}
</script>
</head>
<body onLoad="doLoad()" style="background:#4acbd6;">
<form method="POST" action="/cgi-bin/home_wireless.asp" name="WLAN">
<div id="pagestyle">
<div id="contenttype">
<input type="hidden" name="isWPSSupported" value="1">
<input type="hidden" name="WscV2Support" value="0"><!--WLan_Entry0 WscV2Support:1-1;other-0-->
<input type="hidden" name="BasicRate_Value1" value="15">
<input type="hidden" name="BasicRate_Value2" value="3">
<input type="hidden" name="BasicRate_Value3" value="351">
<input type="hidden" name="CountryRegion0" value="0">
<input type="hidden" name="CountryRegion1" value="1">
<input type="hidden" name="CountryRegion2" value="2">
<input type="hidden" name="CountryRegion3" value="3">
<input type="hidden" name="CountryRegion5" value="5">
<input type="hidden" name="CountryRegion6" value="6">
<input type="hidden" name="HTMCSAUTO" value="33">
<input type="hidden" name="HTBW" value="0">
<input type="hidden" name="WPSConfigured" value="2">
<input type="hidden" name="WpsConfModeAll" value="7">
<input type="hidden" name="WpsConfModeNone" value="0">
<input type="hidden" name="WpsStart" value="0">
<input type="hidden" name="WpsOOB" value="0">
<input type="hidden" name="isInWPSing" id="isInWPSing_id">
<input type="hidden" name="WpsGenerate" value="0">
<input type="hidden" name="Is11nMode" id="Is11nMode_id">
<input type="hidden" name="is11nSpecComply" id="is11nSpecComply_id">
<input type="hidden" name="isWPA2PreAuthSupported" value="N/A"><!--Info_WLan isWPA2PreAuthSupported-->
<input type="hidden" name="Wlan_HTBW40M" id="Wlan_HTBW40M_id">
<input type="hidden" name="ExtChannFlag" id="ExtChannFlag_id" >
<input type="hidden" name="isAuthenTypeSupported" value="0"><!--Info_WLan isAuthenTypeSupported:Yes-1;other-0-->
<input type="hidden" name="isDot1XSupported" value="0"><!--Info_WLan","isDot1XSupported:Yes-1;other-0-->
<input type="hidden" name="isDot1XEnhanceSupported" value="0"><!--Info_WLan isDot1XEnhanceSupported:Yes-1;other-0-->
<input type="hidden" name="wlan_VC" value="0">
<input type="hidden" name="BssidNum" id="BssidNum_id">
<input type="hidden" name="CountryName" id="CountryName_id">
<input type="hidden" name="hCountryRegion" id="hCountryRegion_id">
<input type="hidden" name="hRekeyMethod" value="DISABLE">
<input type="hidden" name="isWDSSupported" value="0">
<input type="hidden" name="WDS_EncrypType_NONE" value="NONE">
<input type="hidden" name="WDS_EncrypType_WEP" value="WEP">
<input type="hidden" name="bharti_ssid2" value="0"><!--Info_WLan isbharti:Yes-1;other-0-->
<input type="hidden" name="isPerSSIDSupport" value="1">
<input type="hidden" name="RTDEVICE" id="RTDEVICE_id">
<script>
	document.getElementById("Is11nMode_id").value = com_11nMode;
	document.getElementById("is11nSpecComply_id").value = com_is11nSpecComply;
	document.getElementById("isInWPSing_id").value = info_WPStimerRunning;
	document.getElementById("Wlan_HTBW40M_id").value = com_ht_bssCoexist;
	document.getElementById("ExtChannFlag_id").value = com_ht_extcha;
	document.getElementById("BssidNum_id").value = com_bssidNum;
	document.getElementById("CountryName_id").value = com_country;
	document.getElementById("hCountryRegion_id").value = com_countryRegion;
	document.getElementById("RTDEVICE_id").value = com_rt_device;
</script>

<div class="main_item">
	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
		<tr height="25px" style="width:100%;background:#e6e6e6;">
			<td align=left class="title-main" style="width:250px;padding-left:20px;">Set Wireless radio state</td>
		</tr>
	</table>
<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">2.4G Radio</td>
		<td align=left class="tabdata">
			<input type="radio" name="wlan_APenable" value="1">Enable&nbsp;&nbsp;&nbsp;&nbsp;
			<input type="radio" name="wlan_APenable" value="0">Disable
			<script>
			if (com_apon == "1") {
				document.getElementsByName("wlan_APenable")[0].checked = true;
				document.getElementsByName("wlan_APenable")[1].checked = false;
			} else {
				document.getElementsByName("wlan_APenable")[0].checked = false;
				document.getElementsByName("wlan_APenable")[1].checked = true;
			}
			</script>
		</td>
	</tr>
</table>
<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		Channel</td>
		<td align=left class="tabdata">
			<select name="Countries_Channels" size="1" onChange="doRegionCheck()" style="display:none;">
				<script language="JavaScript" type='text/javascript'>
					var countryarr = new Array(98);
					countryarr[0]="ALBANIA";
					countryarr[1]="ALGERIA";
					countryarr[2]="ARGENTINA";
					countryarr[3]="ARMENIA";
					countryarr[4]="AUSTRALIA";
					countryarr[5]="AUSTRIA";
					countryarr[6]="AZERBAIJAN";
					countryarr[7]="BAHRAIN";
					countryarr[8]="BELARUS";
					countryarr[9]="BELGIUM";
					countryarr[10]="BELIZE";
					countryarr[11]="BOLIVIA";
					countryarr[12]="BRAZIL";
					countryarr[13]="BRUNEI DARUSSALAM";
					countryarr[14]="BULGARIA";
					countryarr[15]="CANADA";
					countryarr[16]="CHILE";
					countryarr[17]="CHINA";
					countryarr[18]="COLOMBIA";
					countryarr[19]="COSTA RICA";
					countryarr[20]="CROATIA";
					countryarr[21]="CYPRUS";
					countryarr[22]="CZECH REPUBLIC";
					countryarr[23]="DENMARK";
					countryarr[24]="DOMINICAN REPUBLIC";
					countryarr[25]="ECUADOR";
					countryarr[26]="EGYPT";
					countryarr[27]="ELSALVADOR";
					countryarr[28]="FINLAND";
					countryarr[29]="FRANCE";
					countryarr[30]="GEORGIA";
					countryarr[31]="GERMANY";
					countryarr[32]="GREECE";
					countryarr[33]="GUATEMALA";
					countryarr[34]="HONDURAS";
					countryarr[35]="HONGKONG";
					countryarr[36]="HUNGARY";
					countryarr[37]="ICELAND";
					countryarr[38]="INDIA";
					countryarr[39]="INDONESIA";
					countryarr[40]="IRAN";
					countryarr[41]="IRELAND";
					countryarr[42]="ISRAEL";
					countryarr[43]="ITALY";
					countryarr[44]="JAPAN";
					countryarr[45]="KAZAKHSTAN";
					countryarr[46]="KOREA DEMOCRATIC";
					countryarr[47]="KOREA REPUBLIC";
					countryarr[48]="LATVIA";
					countryarr[49]="LEBANON";
					countryarr[50]="LIECHTENSTEIN";
					countryarr[51]="LITHUANIA";
					countryarr[52]="LUXEMBOURG";
					countryarr[53]="MACAU";
					countryarr[54]="MACEDONIA";
					countryarr[55]="MALAYSIA";
					countryarr[56]="MEXICO";
					countryarr[57]="MONACO";
					countryarr[58]="MOROCCO";
					countryarr[59]="NETHERLANDS";
					countryarr[60]="NEW ZEALAND";
					countryarr[61]="NORWAY";
					countryarr[62]="OMAN";
					countryarr[63]="PAKISTAN";
					countryarr[64]="PANAMA";
					countryarr[65]="PERU";
					countryarr[66]="PHILIPPINES";
					countryarr[67]="POLAND";
					countryarr[68]="PORTUGAL";
					countryarr[69]="PUERTO RICO";
					countryarr[70]="QATAR";
					countryarr[71]="ROMANIA";
					countryarr[72]="RUSSIA";
					countryarr[73]="SAUDI ARABIA";
					countryarr[74]="SINGAPORE";
					countryarr[75]="SLOVAKIA";
					countryarr[76]="SLOVENIA";
					countryarr[77]="SOUTH AFRICA";
					countryarr[78]="SPAIN";
					countryarr[79]="SWEDEN";
					countryarr[80]="SWITZERLAND";
					countryarr[81]="SYRIAN ARAB REPUBLIC";
					countryarr[82]="TAIWAN";
					countryarr[83]="THAILAND";
					countryarr[84]="TRINIDAD AND TOBAGO";
					countryarr[85]="TUNISIA";
					countryarr[86]="TURKEY";
					countryarr[87]="UKRAINE";
					countryarr[88]="UNITED ARAB EMIRATES";
					countryarr[89]="UNITED KINGDOM";
					countryarr[90]="UNITED STATES";
					countryarr[91]="URUGUAY";
					countryarr[92]="UZBEKISTAN";
					countryarr[93]="VENEZUELA";
					countryarr[94]="VIETNAM";
					countryarr[95]="YEMEN";
					countryarr[96]="ZIMBABWE";
					countryarr[97]="Undefined";

					for(i=0;i<98;i++)
					{
						if(document.WLAN.CountryName.value.match(countryarr[i]) != null)
						{
							document.WLAN.Countries_Channels[i]=new Option(countryarr[i],countryarr[i],false,true);
							document.WLAN.Countries_Channels[i].selected=true;
						}
						else
						{
							if(countryarr[i].match("TAIWAN") !=null){
								document.WLAN.Countries_Channels[i]=new Option(countryarr[i],countryarr[i],true,false);
								//document.WLAN.Countries_Channels[i].selected=true;
							}
						else{
							document.WLAN.Countries_Channels[i]=new Option(countryarr[i],countryarr[i],false,false);
							document.WLAN.Countries_Channels[i].selected=false;
						}
					}
				}
				</script>
			</select>     
			<select name="Channel_ID" id="Channel_ID" size="1" onChange="doExtChaLockChange()">
			</select>
			Current Channel :
			<input type="text" name="CurrentChannel" id="CurrentChannel_id" size="3" maxlength="2" disabled>
			<script>
			if(com_channel == "0")
			{
				if(info_curChannel == "0" || info_curChannel == "N/A")
					document.getElementById("CurrentChannel_id").value = "auto";
				else
					document.getElementById("CurrentChannel_id").value = info_curChannel;
			}
			else
				document.getElementById("CurrentChannel_id").value = com_channel;
			</script>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Beacon Interval</td>
		<td align=left class="tabdata">
			<input type="text" name="BeaconInterval" id="BeaconInterval_id" size="7" maxlength="4"><font color="#000000">(range: 20~1024)</font>
			<script>
			if(com_beaconPeriod == "N/A")
				document.getElementById("BeaconInterval_id").value = "100";
			else
				document.getElementById("BeaconInterval_id").value = com_beaconPeriod;
			</script>
		</td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			RTS/CTS Threshold</td>
		<td align=left class="tabdata">
			<input type="text" name="RTSThreshold" size="7" maxlength="5" value=""><font color="#000000">(range: 1500~2347)</font>
		</td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Fragmentation Threshold</td>
		<td align=left class="tabdata">
			<input type="text" name="FragmentThreshold" size="7" maxlength="5" value=""><font color="#000000">(range: 256~2346, even numbers only)</font>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			DTIM</td>
		<td align=left class="tabdata">
			<input type="text" name="DTIM" id="DTIM_id" size="7" maxlength="5"><font color="#000000">(range: 1~255)</font>
			<script>
			if(com_dtim == "N/A")
				document.getElementById("DTIM_id").value = "1";
			else
				document.getElementById("DTIM_id").value = com_dtim;
			</script>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			802.11 Mode</td>
		<td align=left class="tabdata">
			<select name="WirelessMode" id="WirelessMode_id" size="1" onChange="doWirelessModeChange()">
				<!--<option value="1">802.11b
				<option value="4">802.11g
				<option value="0">802.11b+g
				<option value="6">802.11n
				<option value="7">802.11g+n
				<option value="9">802.11b+g+n
				<option value="16">802.11b/g/n/ax mixed-->
				<!--org asp:1:802.11b;4:802.11g;0:802.11b+g;6:802.11n;7:802.11g+n;9:802.11b+g+n;16:802.11b/g/n/ax
				uci set wireless.radio0.hwmode=11ax  (11b 11g 11bg 11n 11gn 11bgn 11ax)-->
				<option value="11b">802.11b
				<option value="11g">802.11g
				<option value="11bg">802.11b+g
				<option value="11n">802.11n
				<option value="11gn">802.11g+n
				<option value="11bgn">802.11b+g+n
				<option value="11ax">802.11b/g/n/ax mixed
			</select>
			<script>
				if(com_mode == "N/A")
					document.getElementById("WirelessMode_id").value = "11bgn";
				else
					document.getElementById("WirelessMode_id").value = com_mode;
			</script>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		<font color="#000000">Wireless Power Level</font></td>
		<td align=left class="tabdata">
			<select name="TxPower" id="TxPower_id" size="1" >
				<option value="50">50%
				<option value="60">60%
				<option value="70">70%
				<option value="80">80%
				<option value="90">90%
				<option value="100">100%
				<script>
				if(com_txpower == "N/A")
					document.getElementById("TxPower_id").value = "100";
				else
					document.getElementById("TxPower_id").value = com_txpower;
				</script>
			</select>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Max Client Number</td>
		<td align=left class="tabdata">
			<input type="hidden" name="maxStaNum" id="maxStaNum">
			<input name="StationNum" id="StationNum" type="text" size="7" maxlength="2" onblur="value=isNumeric(value)?value:'0';"><span id="StationNum_tip"></span>
			<script>
				document.getElementById("maxStaNum").value = info_maxStaSupport;
				if(com_maxSta == "N/A")
					document.getElementById("StationNum").value = "0";
				else
					document.getElementById("StationNum").value = com_maxSta;
				document.getElementById("StationNum_tip").innerHTML = "(range: 0~"+info_maxStaSupport+", 0 means no limit)";
			</script>
			</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">WIFI Multicast State</td>
		<td align=left class="tabdata">
			<input type="radio" name="multicastState" value="1">Enable&nbsp;&nbsp;&nbsp;&nbsp;
			<input type="radio" name="multicastState" value="0">Disable
			<script>
			if (com_mcastEnable == "1") {
				document.getElementsByName("multicastState")[0].checked = true;
				document.getElementsByName("multicastState")[1].checked = false;
			} else {
				document.getElementsByName("multicastState")[0].checked = false;
				document.getElementsByName("multicastState")[1].checked = true;
			}
			</script>
		</td>
	</tr>
</table>
</div>
<div id="11nMode_1_div" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">11n Settings</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">Channel Bandwidth</td>
		<td align=left class="tabdata">
			<select name="WLANChannelBandwidth" id="WLANChannelBandwidth" onChange="doChannelBandwidthChange();">
				<option value="0">20 MHz</option>
				<option value="1" style="display:none;">Auto</option>
				<option value="2">20/40 MHz</option>
				<script>
				if(com_ht_bw == "0")
					document.getElementById("WLANChannelBandwidth").value = "0";
				if(com_ht_bssCoexist == "1" && com_ht_bw != "0")
					document.getElementById("WLANChannelBandwidth").value = "1";
				if(com_ht_bw == "N/A")
					document.getElementById("WLANChannelBandwidth").value = "1";
				if(com_ht_bssCoexist == "0" && com_ht_bw == "1")
					document.getElementById("WLANChannelBandwidth").value = "2";
				</script>
			</select>
		</td>
	</tr>
</table>
<div id="HT_BW_1_div">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;display:none;">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Extension Channel</td>
		<td align=left class="tabdata">
			<select name="WLANExtensionChannel" id="WLANExtensionChannel" onChange="doExtChannChange();">
				<option value="0">below the control channel</option>
				<option value="1">above the control channel</option>
				<script>
				if(com_ht_extcha == "N/A")
					document.getElementById("WLANExtensionChannel").value = "0";
				else
					document.getElementById("WLANExtensionChannel").value = com_ht_extcha;
				</script>
			</select>
		</td>
	</tr>
</table>
</div>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Guard Interval</td>
		<td align=left class="tabdata">
			<select name="WLANGuardInterval" id="WLANGuardInterval">
				<option value="0">800 nsec</option>
				<option value="1">400 nsec</option>
				<script>
				if(com_ht_gi == "N/A")
					document.getElementById("WLANGuardInterval").value = "1";
				else
					document.getElementById("WLANGuardInterval").value = com_ht_gi;
				</script>
			</select>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		MCS</td>
		<td align=left class="tabdata">
			<select name="WLANMCS" id="WLANMCS_id">
				<option value="0">0</option>
				<option value="1">1</option>
				<option value="2">2</option>
				<option value="3">3</option>
				<option value="4">4</option>
				<option value="5">5</option>
				<option value="6">6</option>
				<option value="7">7</option>
				<option value="33">Auto</option>
			</select>
			<script>
			if(entry_ht_mcs == "N/A")
				document.getElementById("WLANMCS_id").value = "33";
			else
				document.getElementById("WLANMCS_id").value = entry_ht_mcs;
			</script>
		</td>
	</tr>
</table>
</div>
<div class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">SSID Settings</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">SSID index</td>
		<td align=left class="tabdata">
		<select name="SSID_INDEX" size="1" onChange="doSSIDChange()">
		<option value="0" selected>1
		<option value="1" >2
		<option value="2" >3
		<option value="3" >4
		</select>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">PerSSID Switch</td>
		<td align=left class="tabdata">
			<input type="radio" name="ESSID_Enable_Selection" value="1">
			Enable
			<input type="radio" name="ESSID_Enable_Selection" value="0">
			Disable
			<script>
			if (entry_enable == "1") {
				document.getElementsByName("ESSID_Enable_Selection")[0].checked = true;
				document.getElementsByName("ESSID_Enable_Selection")[1].checked = false;
			} else {
				document.getElementsByName("ESSID_Enable_Selection")[0].checked = false;
				document.getElementsByName("ESSID_Enable_Selection")[1].checked = true;
			}
			</script>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">SSID Name</td>
		<td align=left class="tabdata">
			<input type="text" name="ESSID" id="ESSID" size="35" maxlength="32">
			<script>
			document.getElementById("ESSID").value = entry_ssid;
			</script>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">SSID Broadcast State</td>
		<td align=left class="tabdata">
			<input type="radio" name="ESSID_HIDE_Selection" value="0">Enable &nbsp;&nbsp;&nbsp;
			<input type="radio" name="ESSID_HIDE_Selection" value="1" onClick="doBroadcastSSIDChange();">Disable
			<script>
			if (entry_hideSSID == "0") {
				document.getElementsByName("ESSID_HIDE_Selection")[0].checked = true;
				document.getElementsByName("ESSID_HIDE_Selection")[1].checked = false;
			} else {
				document.getElementsByName("ESSID_HIDE_Selection")[0].checked = false;
				document.getElementsByName("ESSID_HIDE_Selection")[1].checked = true;
			}
			</script>
		</td>
	</tr>
</table>
<div id="11nMode_0_div">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		WMM</td>
		<td align=left class="tabdata">
			<input type="radio" name="WMM_Selection" value="1">Enable&nbsp;&nbsp;&nbsp;&nbsp;
			<input type="radio" name="WMM_Selection" value="0">Disable
			<script>
			if (entry_wmm == "1") {
				document.getElementsByName("WMM_Selection")[0].checked = true;
				document.getElementsByName("WMM_Selection")[1].checked = false;
			} else {
				document.getElementsByName("WMM_Selection")[0].checked = false;
				document.getElementsByName("WMM_Selection")[1].checked = true;
			}
			</script>
		</td>
	</tr>
</table>
</div>

</div>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;" id="WPSSettingText_table">
	<tr height="30px"style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">
			WPS Settings</td>
		<td width="440"></td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<!----WebCurSet_Entry wlan_id = "0" begin------->
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		Use WPS</td>
		<td align=left class="tabdata">
		<input name="UseWPS_Selection" value="1" onClick="doWPSUseChange();" type="radio">Enable&nbsp;&nbsp;&nbsp;&nbsp;
		<input name="UseWPS_Selection" value="0" onClick="doWPSUseChange();" type="radio">Disable</td>
		<script>
			if (entry_WPSConfMode != "0") {
				document.getElementsByName("UseWPS_Selection")[0].checked = true;
				document.getElementsByName("UseWPS_Selection")[1].checked = false;
			} else if (entry_WPSConfMode == "0" || entry_WPSConfMode == "N/A"){
				document.getElementsByName("UseWPS_Selection")[0].checked = false;
				document.getElementsByName("UseWPS_Selection")[1].checked = true;
			}
		</script>
	</tr>
</table>
<div id="WPSConfMode_1_div" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		WPS State</td>
		<td align=left class="tabdata" id="entry_WPSConfStatus_info">
		<script>
		if(entry_WPSConfStatus == "1")
			document.getElementById("entry_WPSConfStatus_info").innerHTML = "Unconfigured"
		else if(entry_WPSConfStatus == "2")
			document.getElementById("entry_WPSConfStatus_info").innerHTML = "Configured"
		else if(entry_WPSConfStatus == "N/A")
			document.getElementById("entry_WPSConfStatus_info").innerHTML = "Unconfigured"
		</script>
	</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
	WPS Mode</td>
		<td align=left class="tabdata">
			<input name="WPSMode_Selection" value="0" onClick="doWPSModeChange();" type="radio">PIN code&nbsp;&nbsp;&nbsp;&nbsp;
			<input name="WPSMode_Selection" value="1" onClick="doWPSModeChange();" type="radio">PBC
			<script>
			if (entry_WPSMode == "0") {
				document.getElementsByName("WPSMode_Selection")[0].checked = true;
				document.getElementsByName("WPSMode_Selection")[1].checked = false;
			} else {
				document.getElementsByName("WPSMode_Selection")[0].checked = false;
				document.getElementsByName("WPSMode_Selection")[1].checked = true;
			}
			</script></td>
	</tr>
<div>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		AP PIN</td>
		<td align=left class="tabdata" id="WPSEnrolleePINCode_info">
		<script>
			document.getElementById("WPSEnrolleePINCode_info").value = info_selfPinCode;
			</script>&nbsp;&nbsp;
	<input type="button" name="pin_generate" value="Generate" onClick="doGenerate()"></td>
	</tr>
	<tr height="30px" id="WPSMode_is_0">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		STA PIN</td>
		<td align=left class="tabdata">
			<input name="WPSEnrolleePINCode" id="WPSEnrolleePINCode" size="9" maxlength="9" onblur="doPINCodeCheck(this)" type="text"></td>
			<script>
			document.getElementById("WPSEnrolleePINCode").value = entry_enrolleePinCode;
			</script>
	</tr>
</div>
<script>
	if(entry_WPSMode == "0")
		document.getElementById("WPSMode_is_0").style.display = "";
	else
		document.getElementById("WPSMode_is_0").style.display = "none";
</script>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;"></td>
	<td align=left class="tabdata">
		<input name="StartWPS" id="StartWPS" onclick="doStartWPS();" type="button"></td>
		<script>
		if(info_WPStimerRunning == "1")
			document.getElementById("StartWPS").value = "Stop WPS";
		else
			document.getElementById("StartWPS").value = "Start WPS";
		</script>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		WPS Progress</td>
		<td align=left class="tabdata" id="info_wlanWPSStatus_0">
		<script>
		if(info_WPSStatus == "Idle")
			document.getElementById("info_wlanWPSStatus_0").innerHTML = "Idle"
		else if(info_WPSStatus == "In progress")
			document.getElementById("info_wlanWPSStatus_0").innerHTML = "Inprogress"
		else if(info_WPSStatus == "Configured")
			document.getElementById("info_wlanWPSStatus_0").innerHTML = "Configured"
		else if(info_WPSStatus == "WPS process Fail")
			document.getElementById("info_wlanWPSStatus_0").innerHTML = "WPS process Fail"
		else
			document.getElementById("info_wlanWPSStatus_0").innerHTML = info_WPSStatus
		</script>
		</td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;"></td>
		<td align=left class="tabdata">
		<input name="ResetOOB" value="Reset to OOB" onclick="doResetOOB();" type="button" ></td>
	</tr>
</table>
</div>
<!----WebCurSet_Entry wlan_id = "0" end------->
<div class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">
			Select Security Type </td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Authentication Type</td>
		<td align=left class="tabdata">
			<select name="WEP_Selection" id="WEP_Selection" size="1" onChange="doWEPChange()">
				<option value="OPEN">OPEN
				<option value="WPAPSK">WPA-PSK
				<option value="WPA2PSK">WPA2-PSK
				<option value="WPAPSKWPA2PSK">WPA-PSK/WPA2-PSK
				<option value="WPA3PSK">WPA3-SAE
				<option value="WPA2PSKWPA3PSK">WPA2-PSK/WPA3-SAE
				<script>
				document.getElementById("WEP_Selection").value = entry_authMode;
				</script>
			</select>
			<input type="hidden" name="wlanWEPFlag" value="0">
		</td>
	</tr>
</table>
<div id="WEP-64Bits_div">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">
			WEP </td>
	</tr>
</table>
	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">       
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">WEP AuthType</td>
		<td align=left class="tabdata">
			<select name="WEP_TypeSelection1" size="1" onChange="doWEPTypeChange()">
				<option value="OpenSystem" >OPENWEP
				<option value="SharedKey" >SHAREDWEP
				<option value="WEPAuto" >Both
			</select>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">WEP-64Bits</td>
		<td align=left class="tabdata">For each key, please enter either (1) 5 characters, or (2) 10 characters ranging from 0~9, a, b, c, d, e, f.</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">WEP-128Bits</td>
		<td align=left class="tabdata">For each key, please enter either (1) 13 characters, or (2) 26 characters ranging from 0~9, a, b, c, d, e, f.</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			<input type="radio" name="DefWEPKey3" value="1"  >
			Key#1:</td>
		<td align=left class="tabdata"><input type="text" name="WEP_Key13" size="30" maxlength="28" value="" onBlur="doKEYcheck(this)" >
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;"> 
			<input type="radio" name="DefWEPKey3" value="2"  >
			Key#2:</td>
		<td align=left class="tabdata"><input type="text" name="WEP_Key23" size="30" maxlength="28" value=""  onBlur="doKEYcheck(this)" >
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			<input type="radio" name="DefWEPKey3" value="3"  >
			Key#3:</td>
		<td align=left class="tabdata"><input type="text" name="WEP_Key33" size="30" maxlength="28" value=""  onBlur="doKEYcheck(this)" >
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			<input type="radio" name="DefWEPKey3" value="4"  >
			Key#4:</td>
		<td align=left class="tabdata"><input type="text" name="WEP_Key43" size="30" maxlength="28" value=""  onBlur="doKEYcheck(this)" >
		</td>
	</tr>
</table>
</div>
<div id="WEP-128Bits_div">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">
			WEP </td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">WEP AuthType</td>
		<td align=left class="tabdata">
		<select name="WEP_TypeSelection2" size="1" onChange="doWEPTypeChange()">
			<option value="OpenSystem" >OPENWEP
			<option value="SharedKey" >SHAREDWEP
			<option value="WEPAuto" >Both
		</select>
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">WEP-64Bits</td>
		<td align=left class="tabdata">For each key, please enter either (1) 5 characters, or (2) 10 characters ranging from 0~9, a, b, c, d, e, f.</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">WEP-128Bits</td>
		<td align=left class="tabdata">For each key, please enter either (1) 13 characters, or (2) 26 characters ranging from 0~9, a, b, c, d, e, f.</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			<input type="radio" name="DefWEPKey4" value="1"   >
			Key#1:
		</td>
		<td align=left class="tabdata">   
			<input type="text" name="WEP_Key14" size="30" maxlength="28" value="" onBlur="doKEYcheck(this);" >
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			<input type="radio" name="DefWEPKey4" value="2"  >
			Key#2:
		</td>
		<td align=left class="tabdata">
			<input type="text" name="WEP_Key24" size="30" maxlength="28" value=""  onBlur="doKEYcheck(this);" >
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			<input type="radio" name="DefWEPKey4" value="3"  >
			Key#3:
		</td>
		<td align=left class="tabdata">           
			<input type="text" name="WEP_Key34" size="30" maxlength="28" value=""  onBlur="doKEYcheck(this);" >
		</td>
	</tr>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			<input type="radio" name="DefWEPKey4" value="4"  >
			Key#4:
		</td>
		<td align=left class="tabdata">
			<input type="text" name="WEP_Key44" size="30" maxlength="28" value=""  onBlur="doKEYcheck(this);" >
		</td>
	</tr>
</table>
</div>
<div id="WPA2PSK_div">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">WPA-PSK</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Encryption Type</td>
		<td align=left class="tabdata">
			<select name="TKIP_Selection4" id="TKIP_Selection4" onChange="doEncryptionChange(this)" size="1">
				<option value="AES">AES
				<option value="TKIP">TKIP
				<option value="TKIPAES">TKIP/AES
				<script>
				document.getElementById("TKIP_Selection4").value = entry_encrypType;
				</script>
			</select>
		</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">Security Passphrase </td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Security Passphrase</td>
		<td align=left class="tabdata">
			<input type="text" name="PreSharedKey1" id="PreSharedKey1" size="48" maxlength="64" onBlur="wpapskCheck(this)"><font color="#000000">(8~63 characters or 64 Hex string)</font>
			<script>
				document.getElementById("PreSharedKey1").value = entry_WPAPSK;
			</script>
		</td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:270px;">&nbsp;</td>
		<td align=left class="tabdata">
			(8~63 characters or 64 Hex string) </td>
	</tr>
	<tr height="30px" style="display:none;">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Key Renewal Interval</td>
		<td align=left class="tabdata">
			<input type="text" id="keyRenewalInterval1" name="keyRenewalInterval1" size="7" maxlength="7" onBlur="checkRekeyinteral(this.value, 0)">
				seconds   (10 ~ 4194303)
		  	<script language="JavaScript" type="text/JavaScript">
				var rekeystr = "";
				if("N/A" == rekeystr || "" == rekeystr)
					document.getElementById('keyRenewalInterval1').value = "3600";
				else
					document.getElementById('keyRenewalInterval1').value = rekeystr;
			</script>
		</td>
	</tr>
</table>
</div>
<div id="WPAPSK_div">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">WPA-PSK</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		Encryption Type</td>
		<td align=left class="tabdata">
			<select name="TKIP_Selection5" id="TKIP_Selection5" onChange="doEncryptionChange(this)" size="1">
				<option value="AES">AES
				<option value="TKIP">TKIP
				<option value="TKIPAES">TKIP/AES
				<script>
				document.getElementById("TKIP_Selection5").value = entry_encrypType;
				</script>
		</select>
		</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">Security Passphrase</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Security Passphrase</td>
		<td align=left class="tabdata">
			<input type="text" name="PreSharedKey2" id="PreSharedKey2" size="48" maxlength="64" onBlur="wpapskCheck(this)">(8~63 characters or 64 Hex string)
			<script>
				document.getElementById("PreSharedKey2").value = entry_WPAPSK;
			</script>
		</td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:270px;">&nbsp;</td>
		<td align=left class="tabdata">
			(8~63 characters or 64 Hex string) </td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Key Renewal Interval</td>
		<td align=left class="tabdata">
			<input type="text" id="keyRenewalInterval2" name="keyRenewalInterval2" size="7" maxlength="7" onBlur="checkRekeyinteral(this.value, 0)">
				seconds   (10 ~ 4194303)
		  	<script language="JavaScript" type="text/JavaScript">
				var rekeystr = "";
				if("N/A" == rekeystr || "" == rekeystr)
					document.getElementById('keyRenewalInterval2').value = "3600";
				else
					document.getElementById('keyRenewalInterval2').value = rekeystr;
			</script>
			</td>
	</tr>
</table>
</div>
<div id="WPAPSKWPA2PSK_div">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">WPA-PSK</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		Encryption Type</td>
		<td align=left class="tabdata">
			<select name="TKIP_Selection6" id="TKIP_Selection6" onChange="doEncryptionChange(this)" size="1">
				<option value="AES">AES
				<option value="TKIP">TKIP
				<option value="TKIPAES">TKIP/AES
				<script>
				document.getElementById("TKIP_Selection6").value = entry_encrypType;
				</script>
			</select>
		</td>
	</tr>
	</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">Security Passphrase</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Security Passphrase</td>
		<td align=left class="tabdata">
			<input type="text" name="PreSharedKey3" id="PreSharedKey3" size="48" maxlength="64" onBlur="wpapskCheck(this)"><font color="#000000">(8~63 characters or 64 Hex string)</font>
				<script>
				document.getElementById("PreSharedKey3").value = entry_WPAPSK;
				</script>
		</td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:270px;">&nbsp;</td>
		<td align=left class="tabdata">
			(8~63 characters or 64 Hex string) </td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Key Renewal Interval</td>
		<td align=left class="tabdata">
			<input type="text" id="keyRenewalInterval3" name="keyRenewalInterval3" size="7" maxlength="7" onBlur="checkRekeyinteral(this.value, 0)">
				seconds   (10 ~ 4194303)
		  	<script language="JavaScript" type="text/JavaScript">
				var rekeystr = "";
				if("N/A" == rekeystr || "" == rekeystr)
					document.getElementById('keyRenewalInterval3').value = "3600";
				else
					document.getElementById('keyRenewalInterval3').value = rekeystr;
			</script>
			</td>
	</tr>
</table>
</div>
<div id="WPA3PSK_div">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">WPA-PSK</td>
	</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		Encryption Type</td>
		<td align=left class="tabdata">
			<select name="TKIP_Selection7" id="TKIP_Selection7" onChange="doEncryptionChange(this)" size="1">
				<option value="AES">AES
				<script>
				if(entry_encrypType == "AES")
				document.getElementById("TKIP_Selection7").value = entry_encrypType;
				</script>
			</select>
		</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">Security Passphrase</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Security Passphrase</td>
		<td align=left class="tabdata">
			<input type="text" name="PreSharedKey4" id="PreSharedKey4" size="48" maxlength="64" onBlur="wpapskCheck(this)"><font color="#000000">(8~63 characters or 64 Hex string)</font>
			<script>
				document.getElementById("PreSharedKey4").value = entry_WPAPSK;
			</script>
		</td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:270px;">&nbsp;</td>
		<td align=left class="tabdata">
			(8~63 characters or 64 Hex string) </td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Key Renewal Interval</td>
		<td align=left class="tabdata">
			<input type="text" id="keyRenewalInterval4" name="keyRenewalInterval4" size="7" maxlength="7" onBlur="checkRekeyinteral(this.value, 0)">
				seconds   (10 ~ 4194303)
				<script language="JavaScript" type="text/JavaScript">
				var rekeystr = "";
				if("N/A" == rekeystr || "" == rekeystr)
					document.getElementById('keyRenewalInterval4').value = "3600";
				else
					document.getElementById('keyRenewalInterval4').value = rekeystr;
			</script>
		</td>
	</tr>
</table>
</div>
<div id="WPA2PSKWPA3PSK_div">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">WPA-PSK</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
		Encryption Type</td>
		<td align=left class="tabdata">
			<select name="TKIP_Selection8" id="TKIP_Selection8" onChange="doEncryptionChange(this)" size="1">
				<option value="AES">AES
				<script>
				if(entry_encrypType == "AES")
				document.getElementById("TKIP_Selection8").value = entry_encrypType;
				</script>
			</select>
		</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">Security Passphrase</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Security Passphrase</td>
		<td align=left class="tabdata">
			<input type="text" name="PreSharedKey5" id="PreSharedKey5" size="48" maxlength="64" onBlur="wpapskCheck(this)"><font color="#000000">(8~63 characters or 64 Hex string)</font>
			<script>
			document.getElementById("PreSharedKey5").value = entry_WPAPSK;
			</script>
		</td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:270px;">&nbsp;</td>
		<td align=left class="tabdata">
			(8~63 characters or 64 Hex string) </td>
	</tr>
	<tr height="30px" style="display:none">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Key Renewal Interval</td>
		<td align=left class="tabdata">
			<input type="text" id="keyRenewalInterval5" name="keyRenewalInterval5" size="7" maxlength="7" onBlur="checkRekeyinteral(this.value, 0)">
				seconds   (10 ~ 4194303)
				<script language="JavaScript" type="text/JavaScript">
				var rekeystr = "";
				if("N/A" == rekeystr || "" == rekeystr)
					document.getElementById('keyRenewalInterval5').value = "3600";
				else
					document.getElementById('keyRenewalInterval5').value = rekeystr;
			</script>
		</td>
	</tr>
</table>
</div>
</div>
<div class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">
			Set MAC access control state</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Access Control State</td>
		<td align=left class="tabdata">
			<input type="radio" name="WLAN_FltActive" value="1" onClick="doAccControlChange();">Enable&nbsp;&nbsp;&nbsp;&nbsp;
			<input type="radio" name="WLAN_FltActive" value="0" onClick="doAccControlChange();">Disable
			<script>
			if(entry_accPolicy != "0")
			{
				document.getElementsByName("WLAN_FltActive")[0].checked = true;
				document.getElementsByName("WLAN_FltActive")[1].checked = false;
			}
			if(entry_accPolicy == "0" || entry_accPolicy == "N/A")
			{
				document.getElementsByName("WLAN_FltActive")[0].checked = false;
				document.getElementsByName("WLAN_FltActive")[1].checked = true;
			}
			</script>
		</td>
	</tr>
</table>
<div id="accessControl_div">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Access Control Model</td>
		<td align=left class="tabdata">
			<select name="WLAN_FltAction" id="WLAN_FltAction" size="1">
				<option value="1">Allow
				<option value="2">Deny
				<script>
				var select = document.getElementById("WLAN_FltAction");
				if(entry_accPolicy == "1")
					select.selectedIndex = 0;
				else if(entry_accPolicy == "2")
					select.selectedIndex = 1;
				</script>
			</select>
			the follow Wireless LAN station(s) association.
		</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">Mac Address #1</td>
		<td align=left class="tabdata">
			<input type="text" name="WLANFLT_MAC1" id="WLANFLT_MAC1" size="20" maxlength="20">
			<script>
			if(typeof(entry_mac_arry[0]) !== 'undefined')
				document.getElementById("WLANFLT_MAC1").value = entry_mac_arry[0];
			</script>
		</td>
	</tr>
</table>
	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">Mac Address #2</td>
		<td align=left class="tabdata">
			<input type="text" name="WLANFLT_MAC2" id="WLANFLT_MAC2" size="20" maxlength="20">
			<script>
			if(typeof(entry_mac_arry[1]) !== 'undefined')
				document.getElementById("WLANFLT_MAC2").value = entry_mac_arry[1];
			</script>
		</td>
	</tr>
</table>
	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">Mac Address #3</td>
		<td align=left class="tabdata">
			<input type="text" name="WLANFLT_MAC3" id="WLANFLT_MAC3" size="20" maxlength="20">
			<script>
			if(typeof(entry_mac_arry[2]) !== 'undefined')
				document.getElementById("WLANFLT_MAC3").value = entry_mac_arry[2];
			</script>
		</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">Mac Address #4</td>
		<td align=left class="tabdata">
			<input type="text" name="WLANFLT_MAC4" id="WLANFLT_MAC4" size="20" maxlength="20">
			<script>
			if(typeof(entry_mac_arry[3]) !== 'undefined')
				document.getElementById("WLANFLT_MAC4").value = entry_mac_arry[3];
			</script>
		</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">Mac Address #5</td>
		<td align=left class="tabdata">
			<input type="text" name="WLANFLT_MAC5" id="WLANFLT_MAC5" size="20" maxlength="20">
			<script>
			if(typeof(entry_mac_arry[4]) !== 'undefined')
				document.getElementById("WLANFLT_MAC5").value = entry_mac_arry[4];
			</script>
		</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">Mac Address #6</td>
		<td align=left class="tabdata">
			<input type="text" name="WLANFLT_MAC6" id="WLANFLT_MAC6" size="20" maxlength="20">
			<script>
			if(typeof(entry_mac_arry[6]) !== 'undefined')
				document.getElementById("WLANFLT_MAC6").value = entry_mac_arry[6];
			</script>
		</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">Mac Address #7</td>
		<td align=left class="tabdata">
			<input type="text" name="WLANFLT_MAC7" id="WLANFLT_MAC7" size="20" maxlength="20">
			<script>
			if(typeof(entry_mac_arry[6]) !== 'undefined')
				document.getElementById("WLANFLT_MAC7").value = entry_mac_arry[6];
			</script>
		</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">Mac Address #8</td>
		<td align=left class="tabdata">
			<input type="text" name="WLANFLT_MAC8" id="WLANFLT_MAC8" size="20" maxlength="20">
			<script>
			if(typeof(entry_mac_arry[7]) !== 'undefined')
				document.getElementById("WLANFLT_MAC8").value = entry_mac_arry[7];
			</script>
		</td>
	</tr>
</table>
</div>
</div>
<div class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
	<tr height="25px">
		<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Save" to save your settings</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
	<tr height="40px">
		<td colspan="2" align=left class="tabdata" style="padding-left:20px;">
			<input type="button" name="BUTTON" class="button1" value="Save" onClick="return doSave();">
			<input type="button" name="CancelBtn" class="button1" value="Cancel" onClick="javascript:window.location='home_wireless.asp'">
			<input type="hidden" name="CountryChange" value="0">
		</td>
	</tr>
</table>
</div>
</div><!--end id=contenttype-->
</div><!--end id=pagestyle-->
</form>
<!----Info_WLan isExist = "Error" begin------->
</body>
</html>
