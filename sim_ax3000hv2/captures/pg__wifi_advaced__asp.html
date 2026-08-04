

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
/*var com_countryRegion_2g = "1";
var com_ht_extcha_2g = "1";
var com_11nMode_2g = "1";
var com_apon_2g = "1";
var com_mode_2g = "11ax";
var com_ht_bw_2g = "0";
var com_ht_bssCoexist_2g = "0";
var com_channel_2g = "6";
var info_curChannel_2g = "8";
var com_countryRegion_5g = "1";
var com_11nMode_5g = "1";
var com_11acMode_5g = "1";
var com_apon_5g = "1";
var com_mode_5g = "11ax";
var com_ht_bw_5g = "1";
var com_ht_bssCoexist_5g = "0";
var com_vht_bw_5g = "2";
var com_channel_5g = "100";
var info_curChannel_5g = "36";
var dfs_dfsEnable_5g = "1";*/
var com_countryRegion_2g = "1";
var com_ht_extcha_2g = "1";
var com_apon_2g = "1";
var com_channel_2g = "0";
var com_mode_2g = "11ax";
var com_11nMode_2g = "1";
var com_ht_bssCoexist_2g = "0";
var com_ht_bw_2g = "0";
var info_curChannel_2g = "7";
var com_countryRegion_5g = "13";
var com_apon_5g = "1";
var com_channel_5g = "0";
var com_mode_5g = "11ax";
var com_11nMode_5g = "1";
var com_11acMode_5g = "1";
var com_ht_bssCoexist_5g = "0";
var com_ht_bw_5g = "1";
var com_vht_bw_5g = "2";
var info_curChannel_5g = "116";
var dfs_dfsEnable_5g = "1";


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
	//2.4g
	if(document.wifi_form.WirelessMode.selectedIndex >= 3) {
		document.wifi_form.Is11nMode.value = 1;
		if(document.wifi_form.WLANChannelBandwidth.selectedIndex == 1){
			document.wifi_form.Wlan_HTBW40M.value = 1;
			document.wifi_form.WLANChannelBandwidth.value = 1;
		}else if(document.wifi_form.WLANChannelBandwidth.selectedIndex == 2){
			document.wifi_form.Wlan_HTBW40M.value = 0;
			document.wifi_form.WLANChannelBandwidth.value = 1;
		}else{
			document.wifi_form.WLANChannelBandwidth.value = 0;
		}
	}else{
		document.wifi_form.Is11nMode.value=0;
	}
	if(document.wifi_form.Channel_ID.selectedIndex <= 4)
		document.wifi_form.ExtChannFlag.value = 1;
	else
		document.wifi_form.ExtChannFlag.value = 0;
	//5g
	if(document.wifi_form.WLANChannelBandwidth_5g.value == "0") {
		document.wifi_form.WLANChannelBandwidth_5g.value = "0";
	} else if(document.wifi_form.WLANChannelBandwidth_5g.value == "1") {
		document.wifi_form.WLANChannelBandwidth_5g.value = "1";
		document.wifi_form.WLan11acVHTChannelBandwidth.value = "0";
		document.wifi_form.WLan11acVHT_BW.value = "0";
	} else if (document.wifi_form.WLANChannelBandwidth_5g.value == "2") {
	document.wifi_form.WLANChannelBandwidth_5g.value = "1";
		document.wifi_form.WLan11acVHTChannelBandwidth.value = "0";
		document.wifi_form.WLan11acVHT_BW.value = "1";
	} else if(document.wifi_form.WLANChannelBandwidth_5g.value == "3") {
	document.wifi_form.WLANChannelBandwidth_5g.value = "1";
		document.wifi_form.WLan11acVHTChannelBandwidth.value = "0";
		document.wifi_form.WLan11acVHT_BW.value = "2";
	}
	if(document.wifi_form.WirelessMode_5g.selectedIndex >= 1) {
		document.wifi_form.Is11nMode_5g.value = 1;
		if(document.wifi_form.WirelessMode_5g.selectedIndex >= 2) {
			document.wifi_form.Is11acMode_5g.value = 1;
		} else {
			document.wifi_form.Is11acMode_5g.value = 0;
		}
	}else{
		document.wifi_form.Is11nMode_5g.value = 0;
		document.wifi_form.Is11acMode_5g.value = 0;
	}
	//showSpin();
	document.wifi_form.saveFlag.value = 1;
	document.wifi_form.submit();
	return;
}


function SelectValue(o,v)
{
	for(var i=0; i<o.options.length; i++)
		if(o.options[i].value == v){
		o.options[i].selected=true;
		break;
	}
}

function doload_channel_options()
{
	var autoText = "Auto";
	var ctlChannel_ID = document.wifi_form.Channel_ID_5g;
	ctlChannel_ID.length = 0;
	var index = 0;
	if ((document.wifi_form.WirelessMode_5g.value=='11an') && (document.wifi_form.WLANChannelBandwidth_5g.value  >= 1)) {
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("36", "36");
		ctlChannel_ID.options[index++] = new Option("40", "40");
		ctlChannel_ID.options[index++] = new Option("44", "44");
		ctlChannel_ID.options[index++] = new Option("48", "48");
		ctlChannel_ID.options[index++] = new Option("52", "52");
		ctlChannel_ID.options[index++] = new Option("56", "56");
		ctlChannel_ID.options[index++] = new Option("60", "60");
		ctlChannel_ID.options[index++] = new Option("64", "64");
		ctlChannel_ID.options[index++] = new Option("100", "100");
		ctlChannel_ID.options[index++] = new Option("104", "104");
		ctlChannel_ID.options[index++] = new Option("108", "108");
		ctlChannel_ID.options[index++] = new Option("112", "112");
		ctlChannel_ID.options[index++] = new Option("116", "116");
		ctlChannel_ID.options[index++] = new Option("120", "120");
		ctlChannel_ID.options[index++] = new Option("124", "124");
		ctlChannel_ID.options[index++] = new Option("128", "128");
		ctlChannel_ID.options[index++] = new Option("132", "132");
		ctlChannel_ID.options[index++] = new Option("136", "136");
		ctlChannel_ID.options[index++] = new Option("140", "140");
		ctlChannel_ID.options[index++] = new Option("144", "144");
		ctlChannel_ID.options[index++] = new Option("149", "149");
		ctlChannel_ID.options[index++] = new Option("153", "153");
		ctlChannel_ID.options[index++] = new Option("157", "157");
		ctlChannel_ID.options[index++] = new Option("161", "161");
	} else if (((document.wifi_form.WirelessMode_5g.value=="11anac" || document.wifi_form.WirelessMode_5g.value=="11ac" || document.wifi_form.WirelessMode_5g.value=="11ax")) && (document.wifi_form.WLANChannelBandwidth_5g.value >= 1)) {
		if (document.wifi_form.WLANChannelBandwidth_5g.value == 1) {
			ctlChannel_ID.options[index++] = new Option(autoText, "0");
			ctlChannel_ID.options[index++] = new Option("36", "36");
			ctlChannel_ID.options[index++] = new Option("40", "40");
			ctlChannel_ID.options[index++] = new Option("44", "44");
			ctlChannel_ID.options[index++] = new Option("48", "48");
			ctlChannel_ID.options[index++] = new Option("52", "52");
			ctlChannel_ID.options[index++] = new Option("56", "56");
			ctlChannel_ID.options[index++] = new Option("60", "60");
			ctlChannel_ID.options[index++] = new Option("64", "64");
			ctlChannel_ID.options[index++] = new Option("100", "100");
			ctlChannel_ID.options[index++] = new Option("104", "104");
			ctlChannel_ID.options[index++] = new Option("108", "108");
			ctlChannel_ID.options[index++] = new Option("112", "112");
			ctlChannel_ID.options[index++] = new Option("116", "116");
			ctlChannel_ID.options[index++] = new Option("120", "120");
			ctlChannel_ID.options[index++] = new Option("124", "124");
			ctlChannel_ID.options[index++] = new Option("128", "128");
			ctlChannel_ID.options[index++] = new Option("132", "132");
			ctlChannel_ID.options[index++] = new Option("136", "136");
			ctlChannel_ID.options[index++] = new Option("140", "140");
			ctlChannel_ID.options[index++] = new Option("144", "144");
			ctlChannel_ID.options[index++] = new Option("149", "149");
			ctlChannel_ID.options[index++] = new Option("153", "153");
			ctlChannel_ID.options[index++] = new Option("157", "157");
			ctlChannel_ID.options[index++] = new Option("161", "161");
		}
		if (document.wifi_form.WLANChannelBandwidth_5g.value == 2) {
			ctlChannel_ID.options[index++] = new Option(autoText, "0");
			ctlChannel_ID.options[index++] = new Option("36", "36");
			ctlChannel_ID.options[index++] = new Option("40", "40");
			ctlChannel_ID.options[index++] = new Option("44", "44");
			ctlChannel_ID.options[index++] = new Option("48", "48");
			ctlChannel_ID.options[index++] = new Option("52", "52");
			ctlChannel_ID.options[index++] = new Option("56", "56");
			ctlChannel_ID.options[index++] = new Option("60", "60");
			ctlChannel_ID.options[index++] = new Option("64", "64");
			ctlChannel_ID.options[index++] = new Option("100", "100");
			ctlChannel_ID.options[index++] = new Option("104", "104");
			ctlChannel_ID.options[index++] = new Option("108", "108");
			ctlChannel_ID.options[index++] = new Option("112", "112");
			ctlChannel_ID.options[index++] = new Option("116", "116");
			ctlChannel_ID.options[index++] = new Option("120", "120");
			ctlChannel_ID.options[index++] = new Option("124", "124");
			ctlChannel_ID.options[index++] = new Option("128", "128");
			ctlChannel_ID.options[index++] = new Option("132", "132");
			ctlChannel_ID.options[index++] = new Option("136", "136");
			ctlChannel_ID.options[index++] = new Option("140", "140");
			ctlChannel_ID.options[index++] = new Option("144", "144");
			ctlChannel_ID.options[index++] = new Option("149", "149");
			ctlChannel_ID.options[index++] = new Option("153", "153");
			ctlChannel_ID.options[index++] = new Option("157", "157");
			ctlChannel_ID.options[index++] = new Option("161", "161");
		}
		if (document.wifi_form.WLANChannelBandwidth_5g.value == 3) {
			ctlChannel_ID.options[index++] = new Option(autoText, "0");
			ctlChannel_ID.options[index++] = new Option("36", "36");
			ctlChannel_ID.options[index++] = new Option("40", "40");
			ctlChannel_ID.options[index++] = new Option("44", "44");
			ctlChannel_ID.options[index++] = new Option("48", "48");
			ctlChannel_ID.options[index++] = new Option("52", "52");
			ctlChannel_ID.options[index++] = new Option("56", "56");
			ctlChannel_ID.options[index++] = new Option("60", "60");
			ctlChannel_ID.options[index++] = new Option("64", "64");
			ctlChannel_ID.options[index++] = new Option("100", "100");
			ctlChannel_ID.options[index++] = new Option("104", "104");
			ctlChannel_ID.options[index++] = new Option("108", "108");
			ctlChannel_ID.options[index++] = new Option("112", "112");
			ctlChannel_ID.options[index++] = new Option("116", "116");
			ctlChannel_ID.options[index++] = new Option("120", "120");
			ctlChannel_ID.options[index++] = new Option("124", "124");
			ctlChannel_ID.options[index++] = new Option("128", "128");
		}
	} else {
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("36", "36");
		ctlChannel_ID.options[index++] = new Option("40", "40");
		ctlChannel_ID.options[index++] = new Option("44", "44");
		ctlChannel_ID.options[index++] = new Option("48", "48");
		ctlChannel_ID.options[index++] = new Option("52", "52");
		ctlChannel_ID.options[index++] = new Option("56", "56");
		ctlChannel_ID.options[index++] = new Option("60", "60");
		ctlChannel_ID.options[index++] = new Option("64", "64");
		ctlChannel_ID.options[index++] = new Option("100", "100");
		ctlChannel_ID.options[index++] = new Option("104", "104");
		ctlChannel_ID.options[index++] = new Option("108", "108");
		ctlChannel_ID.options[index++] = new Option("112", "112");
		ctlChannel_ID.options[index++] = new Option("116", "116");
		ctlChannel_ID.options[index++] = new Option("120", "120");
		ctlChannel_ID.options[index++] = new Option("124", "124");
		ctlChannel_ID.options[index++] = new Option("128", "128");
		ctlChannel_ID.options[index++] = new Option("132", "132");
		ctlChannel_ID.options[index++] = new Option("136", "136");
		ctlChannel_ID.options[index++] = new Option("140", "140");
		ctlChannel_ID.options[index++] = new Option("144", "144");
		ctlChannel_ID.options[index++] = new Option("149", "149");
		ctlChannel_ID.options[index++] = new Option("153", "153");
		ctlChannel_ID.options[index++] = new Option("157", "157");
		ctlChannel_ID.options[index++] = new Option("161", "161");
		ctlChannel_ID.options[index++] = new Option("165", "165");
	}
}

function doLoad()
{
	var waitMessage = document.getElementById("waiting_div");
	if(waitMessage)
		waitMessage.style.display = "none";
	//init 2.4g channel
	var autoText = "Auto";
	var index = 0;
	var ctlChannel_ID = document.wifi_form.Channel_ID;
	var vChannel = ctlChannel_ID.value;
	var vCountryRegion = document.wifi_form.hCountryRegion.value;
	vChannel = com_channel_2g;
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
	ctlChannel_ID.options[0].selected = true;
	SelectValue(ctlChannel_ID, vChannel);

	var is_11nMode = com_11nMode_2g;
	var select = document.getElementsByName("WLANChannelBandwidth")[0];
	var options = select.options;
	if(is_11nMode == "1") {
		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "2")
				options[i].style.display = "";
		}
	} else {
		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "2")
				options[i].style.display = "none";
		}
	}

	//init 5g channel
	index = 0;
	ctlChannel_ID = document.wifi_form.Channel_ID_5g;
	vChannel = ctlChannel_ID.value;
	var vCountryRegionABand = document.wifi_form.hCountryRegionABand.value;
	vChannel = com_channel_5g;
	ctlChannel_ID.length = 0;
	if (vCountryRegionABand == 13) {
		if ((document.wifi_form.WirelessMode_5g.value=='11an') && (document.wifi_form.WLANChannelBandwidth_5g.value  >= 1)) {
			ctlChannel_ID.options[index++] = new Option(autoText, "0");
			ctlChannel_ID.options[index++] = new Option("36", "36");
			ctlChannel_ID.options[index++] = new Option("40", "40");
			ctlChannel_ID.options[index++] = new Option("44", "44");
			ctlChannel_ID.options[index++] = new Option("48", "48");
			ctlChannel_ID.options[index++] = new Option("52", "52");
			ctlChannel_ID.options[index++] = new Option("56", "56");
			ctlChannel_ID.options[index++] = new Option("60", "60");
			ctlChannel_ID.options[index++] = new Option("64", "64");
			ctlChannel_ID.options[index++] = new Option("100", "100");
			ctlChannel_ID.options[index++] = new Option("104", "104");
			ctlChannel_ID.options[index++] = new Option("108", "108");
			ctlChannel_ID.options[index++] = new Option("112", "112");
			ctlChannel_ID.options[index++] = new Option("116", "116");
			ctlChannel_ID.options[index++] = new Option("120", "120");
			ctlChannel_ID.options[index++] = new Option("124", "124");
			ctlChannel_ID.options[index++] = new Option("128", "128");
			ctlChannel_ID.options[index++] = new Option("132", "132");
			ctlChannel_ID.options[index++] = new Option("136", "136");
			ctlChannel_ID.options[index++] = new Option("140", "140");
			ctlChannel_ID.options[index++] = new Option("144", "144");
			ctlChannel_ID.options[index++] = new Option("149", "149");
			ctlChannel_ID.options[index++] = new Option("153", "153");
			ctlChannel_ID.options[index++] = new Option("157", "157");
			ctlChannel_ID.options[index++] = new Option("161", "161");
		} else if (((document.wifi_form.WirelessMode_5g.value=="11anac" || document.wifi_form.WirelessMode_5g.value=="11ac" || document.wifi_form.WirelessMode_5g.value=="11ax")) && (document.wifi_form.WLANChannelBandwidth_5g.value >= 1)) {
			if (document.wifi_form.WLANChannelBandwidth_5g.value == 1) {
				ctlChannel_ID.options[index++] = new Option(autoText, "0");
				ctlChannel_ID.options[index++] = new Option("36", "36");
				ctlChannel_ID.options[index++] = new Option("40", "40");
				ctlChannel_ID.options[index++] = new Option("44", "44");
				ctlChannel_ID.options[index++] = new Option("48", "48");
				ctlChannel_ID.options[index++] = new Option("52", "52");
				ctlChannel_ID.options[index++] = new Option("56", "56");
				ctlChannel_ID.options[index++] = new Option("60", "60");
				ctlChannel_ID.options[index++] = new Option("64", "64");
				ctlChannel_ID.options[index++] = new Option("100", "100");
				ctlChannel_ID.options[index++] = new Option("104", "104");
				ctlChannel_ID.options[index++] = new Option("108", "108");
				ctlChannel_ID.options[index++] = new Option("112", "112");
				ctlChannel_ID.options[index++] = new Option("116", "116");
				ctlChannel_ID.options[index++] = new Option("120", "120");
				ctlChannel_ID.options[index++] = new Option("124", "124");
				ctlChannel_ID.options[index++] = new Option("128", "128");
				ctlChannel_ID.options[index++] = new Option("132", "132");
				ctlChannel_ID.options[index++] = new Option("136", "136");
				ctlChannel_ID.options[index++] = new Option("140", "140");
				ctlChannel_ID.options[index++] = new Option("144", "144");
				ctlChannel_ID.options[index++] = new Option("149", "149");
				ctlChannel_ID.options[index++] = new Option("153", "153");
				ctlChannel_ID.options[index++] = new Option("157", "157");
				ctlChannel_ID.options[index++] = new Option("161", "161");
			}
			if (document.wifi_form.WLANChannelBandwidth_5g.value == 2) {
				ctlChannel_ID.options[index++] = new Option(autoText, "0");
				ctlChannel_ID.options[index++] = new Option("36", "36");
				ctlChannel_ID.options[index++] = new Option("40", "40");
				ctlChannel_ID.options[index++] = new Option("44", "44");
				ctlChannel_ID.options[index++] = new Option("48", "48");
				ctlChannel_ID.options[index++] = new Option("52", "52");
				ctlChannel_ID.options[index++] = new Option("56", "56");
				ctlChannel_ID.options[index++] = new Option("60", "60");
				ctlChannel_ID.options[index++] = new Option("64", "64");
				ctlChannel_ID.options[index++] = new Option("100", "100");
				ctlChannel_ID.options[index++] = new Option("104", "104");
				ctlChannel_ID.options[index++] = new Option("108", "108");
				ctlChannel_ID.options[index++] = new Option("112", "112");
				ctlChannel_ID.options[index++] = new Option("116", "116");
				ctlChannel_ID.options[index++] = new Option("120", "120");
				ctlChannel_ID.options[index++] = new Option("124", "124");
				ctlChannel_ID.options[index++] = new Option("128", "128");
				ctlChannel_ID.options[index++] = new Option("132", "132");
				ctlChannel_ID.options[index++] = new Option("136", "136");
				ctlChannel_ID.options[index++] = new Option("140", "140");
				ctlChannel_ID.options[index++] = new Option("144", "144");
				ctlChannel_ID.options[index++] = new Option("149", "149");
				ctlChannel_ID.options[index++] = new Option("153", "153");
				ctlChannel_ID.options[index++] = new Option("157", "157");
				ctlChannel_ID.options[index++] = new Option("161", "161");
			}
			if (document.wifi_form.WLANChannelBandwidth_5g.value == 3) {
				ctlChannel_ID.options[index++] = new Option(autoText, "0");
				ctlChannel_ID.options[index++] = new Option("36", "36");
				ctlChannel_ID.options[index++] = new Option("40", "40");
				ctlChannel_ID.options[index++] = new Option("44", "44");
				ctlChannel_ID.options[index++] = new Option("48", "48");
				ctlChannel_ID.options[index++] = new Option("52", "52");
				ctlChannel_ID.options[index++] = new Option("56", "56");
				ctlChannel_ID.options[index++] = new Option("60", "60");
				ctlChannel_ID.options[index++] = new Option("64", "64");
				ctlChannel_ID.options[index++] = new Option("100", "100");
				ctlChannel_ID.options[index++] = new Option("104", "104");
				ctlChannel_ID.options[index++] = new Option("108", "108");
				ctlChannel_ID.options[index++] = new Option("112", "112");
				ctlChannel_ID.options[index++] = new Option("116", "116");
				ctlChannel_ID.options[index++] = new Option("120", "120");
				ctlChannel_ID.options[index++] = new Option("124", "124");
				ctlChannel_ID.options[index++] = new Option("128", "128");
			}
		} else {
			ctlChannel_ID.options[index++] = new Option(autoText, "0");
			ctlChannel_ID.options[index++] = new Option("36", "36");
			ctlChannel_ID.options[index++] = new Option("40", "40");
			ctlChannel_ID.options[index++] = new Option("44", "44");
			ctlChannel_ID.options[index++] = new Option("48", "48");
			ctlChannel_ID.options[index++] = new Option("52", "52");
			ctlChannel_ID.options[index++] = new Option("56", "56");
			ctlChannel_ID.options[index++] = new Option("60", "60");
			ctlChannel_ID.options[index++] = new Option("64", "64");
			ctlChannel_ID.options[index++] = new Option("100", "100");
			ctlChannel_ID.options[index++] = new Option("104", "104");
			ctlChannel_ID.options[index++] = new Option("108", "108");
			ctlChannel_ID.options[index++] = new Option("112", "112");
			ctlChannel_ID.options[index++] = new Option("116", "116");
			ctlChannel_ID.options[index++] = new Option("120", "120");
			ctlChannel_ID.options[index++] = new Option("124", "124");
			ctlChannel_ID.options[index++] = new Option("128", "128");
			ctlChannel_ID.options[index++] = new Option("132", "132");
			ctlChannel_ID.options[index++] = new Option("136", "136");
			ctlChannel_ID.options[index++] = new Option("140", "140");
			ctlChannel_ID.options[index++] = new Option("144", "144");
			ctlChannel_ID.options[index++] = new Option("149", "149");
			ctlChannel_ID.options[index++] = new Option("153", "153");
			ctlChannel_ID.options[index++] = new Option("157", "157");
			ctlChannel_ID.options[index++] = new Option("161", "161");
			ctlChannel_ID.options[index++] = new Option("165", "165");
		}
	} else if (vCountryRegionABand == 1){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("36", "36");
		ctlChannel_ID.options[index++] = new Option("40", "40");
		ctlChannel_ID.options[index++] = new Option("44", "44");
		ctlChannel_ID.options[index++] = new Option("48", "48");
		ctlChannel_ID.options[index++] = new Option("52", "52");
		ctlChannel_ID.options[index++] = new Option("56", "56");
		ctlChannel_ID.options[index++] = new Option("60", "60");
		ctlChannel_ID.options[index++] = new Option("64", "64");
		ctlChannel_ID.options[index++] = new Option("100", "100");
		ctlChannel_ID.options[index++] = new Option("104", "104");
		ctlChannel_ID.options[index++] = new Option("108", "108");
		ctlChannel_ID.options[index++] = new Option("112", "112");
		ctlChannel_ID.options[index++] = new Option("116", "116");
		ctlChannel_ID.options[index++] = new Option("120", "120");
		ctlChannel_ID.options[index++] = new Option("124", "124");
		ctlChannel_ID.options[index++] = new Option("128", "128");
		ctlChannel_ID.options[index++] = new Option("132", "132");
		ctlChannel_ID.options[index++] = new Option("136", "136");
		ctlChannel_ID.options[index++] = new Option("140", "140");
	} else if (vCountryRegionABand == 2){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("36", "36");
		ctlChannel_ID.options[index++] = new Option("40", "40");
		ctlChannel_ID.options[index++] = new Option("44", "44");
		ctlChannel_ID.options[index++] = new Option("48", "48");
		ctlChannel_ID.options[index++] = new Option("52", "52");
		ctlChannel_ID.options[index++] = new Option("56", "56");
		ctlChannel_ID.options[index++] = new Option("60", "60");
		ctlChannel_ID.options[index++] = new Option("64", "64");
	} else if (vCountryRegionABand == 3){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("52", "52");
		ctlChannel_ID.options[index++] = new Option("56", "56");
		ctlChannel_ID.options[index++] = new Option("60", "60");
		ctlChannel_ID.options[index++] = new Option("64", "64");
		ctlChannel_ID.options[index++] = new Option("149", "149");
		ctlChannel_ID.options[index++] = new Option("153", "153");
		ctlChannel_ID.options[index++] = new Option("157", "157");
		ctlChannel_ID.options[index++] = new Option("161", "161");
	} else if (vCountryRegionABand == 4){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("149", "149");
		ctlChannel_ID.options[index++] = new Option("153", "153");
		ctlChannel_ID.options[index++] = new Option("157", "157");
		ctlChannel_ID.options[index++] = new Option("161", "161");
		ctlChannel_ID.options[index++] = new Option("165", "165");
	} else if (vCountryRegionABand == 5){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("149", "149");
		ctlChannel_ID.options[index++] = new Option("153", "153");
		ctlChannel_ID.options[index++] = new Option("157", "157");
		ctlChannel_ID.options[index++] = new Option("161", "161");
	} else if (vCountryRegionABand == 6){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("36", "36");
		ctlChannel_ID.options[index++] = new Option("40", "40");
		ctlChannel_ID.options[index++] = new Option("44", "44");
		ctlChannel_ID.options[index++] = new Option("48", "48");
	} else if (vCountryRegionABand == 8){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("52", "52");
		ctlChannel_ID.options[index++] = new Option("56", "56");
		ctlChannel_ID.options[index++] = new Option("60", "60");
		ctlChannel_ID.options[index++] = new Option("64", "64");
	} else if (vCountryRegionABand == 9){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("36", "36");
		ctlChannel_ID.options[index++] = new Option("40", "40");
		ctlChannel_ID.options[index++] = new Option("44", "44");
		ctlChannel_ID.options[index++] = new Option("48", "48");
		ctlChannel_ID.options[index++] = new Option("52", "52");
		ctlChannel_ID.options[index++] = new Option("56", "56");
		ctlChannel_ID.options[index++] = new Option("60", "60");
		ctlChannel_ID.options[index++] = new Option("64", "64");
		ctlChannel_ID.options[index++] = new Option("100", "100");
		ctlChannel_ID.options[index++] = new Option("104", "104");
		ctlChannel_ID.options[index++] = new Option("108", "108");
		ctlChannel_ID.options[index++] = new Option("112", "112");
		ctlChannel_ID.options[index++] = new Option("116", "116");
		ctlChannel_ID.options[index++] = new Option("132", "132");
		ctlChannel_ID.options[index++] = new Option("136", "136");
		ctlChannel_ID.options[index++] = new Option("140", "140");
		ctlChannel_ID.options[index++] = new Option("149", "149");
		ctlChannel_ID.options[index++] = new Option("153", "153");
		ctlChannel_ID.options[index++] = new Option("157", "157");
		ctlChannel_ID.options[index++] = new Option("161", "161");
		ctlChannel_ID.options[index++] = new Option("165", "165");
	} else if (vCountryRegionABand == 10){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("36", "36");
		ctlChannel_ID.options[index++] = new Option("40", "40");
		ctlChannel_ID.options[index++] = new Option("44", "44");
		ctlChannel_ID.options[index++] = new Option("48", "48");
		ctlChannel_ID.options[index++] = new Option("149", "149");
		ctlChannel_ID.options[index++] = new Option("153", "153");
		ctlChannel_ID.options[index++] = new Option("157", "157");
		ctlChannel_ID.options[index++] = new Option("161", "161");
		ctlChannel_ID.options[index++] = new Option("165", "165");
	} else if (vCountryRegionABand == 11){
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("36", "36");
		ctlChannel_ID.options[index++] = new Option("40", "40");
		ctlChannel_ID.options[index++] = new Option("44", "44");
		ctlChannel_ID.options[index++] = new Option("48", "48");
		ctlChannel_ID.options[index++] = new Option("52", "52");
		ctlChannel_ID.options[index++] = new Option("56", "56");
		ctlChannel_ID.options[index++] = new Option("60", "60");
		ctlChannel_ID.options[index++] = new Option("64", "64");
		ctlChannel_ID.options[index++] = new Option("100", "100");
		ctlChannel_ID.options[index++] = new Option("104", "104");
		ctlChannel_ID.options[index++] = new Option("108", "108");
		ctlChannel_ID.options[index++] = new Option("112", "112");
		ctlChannel_ID.options[index++] = new Option("116", "116");
		ctlChannel_ID.options[index++] = new Option("120", "120");
		ctlChannel_ID.options[index++] = new Option("149", "149");
		ctlChannel_ID.options[index++] = new Option("153", "153");
		ctlChannel_ID.options[index++] = new Option("157", "157");
		ctlChannel_ID.options[index++] = new Option("161", "161");
	} else {
		ctlChannel_ID.options[index++] = new Option(autoText, "0");
		ctlChannel_ID.options[index++] = new Option("36", "36");
		ctlChannel_ID.options[index++] = new Option("40", "40");
		ctlChannel_ID.options[index++] = new Option("44", "44");
		ctlChannel_ID.options[index++] = new Option("48", "48");
		ctlChannel_ID.options[index++] = new Option("52", "52");
		ctlChannel_ID.options[index++] = new Option("56", "56");
		ctlChannel_ID.options[index++] = new Option("60", "60");
		ctlChannel_ID.options[index++] = new Option("64", "64");
		ctlChannel_ID.options[index++] = new Option("100", "100");
		ctlChannel_ID.options[index++] = new Option("104", "104");
		ctlChannel_ID.options[index++] = new Option("108", "108");
		ctlChannel_ID.options[index++] = new Option("112", "112");
		ctlChannel_ID.options[index++] = new Option("116", "116");
		ctlChannel_ID.options[index++] = new Option("120", "120");
		ctlChannel_ID.options[index++] = new Option("124", "124");
		ctlChannel_ID.options[index++] = new Option("128", "128");
		ctlChannel_ID.options[index++] = new Option("132", "132");
		ctlChannel_ID.options[index++] = new Option("136", "136");
		ctlChannel_ID.options[index++] = new Option("140", "140");
		ctlChannel_ID.options[index++] = new Option("149", "149");
		ctlChannel_ID.options[index++] = new Option("153", "153");
		ctlChannel_ID.options[index++] = new Option("157", "157");
		ctlChannel_ID.options[index++] = new Option("161", "161");
		ctlChannel_ID.options[index++] = new Option("165", "165");
	}
	ctlChannel_ID.options[0].selected = true;
	SelectValue(ctlChannel_ID, vChannel);

	is_11nMode = com_11nMode_5g;
	var is_11acMode = com_11acMode_5g;
	select = document.getElementsByName("WLANChannelBandwidth_5g")[0];
	options = select.options;
	if(is_11nMode == "1") {
		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "2")
				options[i].style.display = "";
		}
	} else {
		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "2")
				options[i].style.display = "none";
		}
	}
	
		if(is_11nMode == "1") {
		if(is_11acMode == "1") {/*ac及以上*/
			for(var i = 0; i < options.length; i++) {
				if(options[i].value == "1" || options[i].value == "2" || options[i].value == "3")//20/40、20/40/80、20/40/80/160
					options[i].style.display = "";
			}
		} else {/*11a/n*/
			for(var i = 0; i < options.length; i++) {
				if(options[i].value == "2" || options[i].value == "3")//20/40/80、20/40/80/160
					options[i].style.display = "none";
				if(options[i].value == "1")//20/40
					options[i].style.display = "";
			}
		}
	} else {/*11a*/
		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "1" || options[i].value == "2" || options[i].value == "3")//20/40、20/40/80、20/40/80/160
				options[i].style.display = "none";
		}
	}
}

function doWirelessModeChange()
{
	var select = document.getElementsByName("WLANChannelBandwidth")[0];
	var options = select.options;
	if(document.wifi_form.WirelessMode.selectedIndex >= 3){
		document.wifi_form.Is11nMode.value = 1;
		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "2")
				options[i].style.display = "";
		}
	} else {
		document.wifi_form.Is11nMode.value = 0;
		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "2")
				options[i].style.display = "none";
		}
		document.wifi_form.WLANChannelBandwidth.value = "0";
	}
}

function doWirelessModeChange_5g()
{
	var select = document.getElementsByName("WLANChannelBandwidth_5g")[0];
	var options = select.options;
	if(document.wifi_form.WirelessMode_5g.selectedIndex >= 1) {
		document.wifi_form.Is11nMode_5g.value = 1;
		if(document.wifi_form.WirelessMode_5g.selectedIndex >= 2) {/*ac及以上*/
			for(var i = 0; i < options.length; i++) {
				if(options[i].value == "1" || options[i].value == "2" || options[i].value == "3")//20/40、20/40/80、20/40/80/160
					options[i].style.display = "";
			}
			document.wifi_form.Is11acMode_5g.value = 1;
		} else {/*11a/n*/
			for(var i = 0; i < options.length; i++) {
				if(options[i].value == "2" || options[i].value == "3")//20/40/80、20/40/80/160
					options[i].style.display = "none";
				if(options[i].value == "1")//20/40
					options[i].style.display = "";
			}
			if(document.wifi_form.WLANChannelBandwidth_5g.value != "0" && document.wifi_form.WLANChannelBandwidth_5g.value != "1")
				document.wifi_form.WLANChannelBandwidth_5g.value = "0";
			document.wifi_form.Is11acMode_5g.value = 0;
		}
	} else {/*11a*/
		document.wifi_form.Is11nMode_5g.value = 0;
		document.wifi_form.Is11acMode_5g.value = 0;
		for(var i = 0; i < options.length; i++) {
			if(options[i].value == "1" || options[i].value == "2" || options[i].value == "3")//20/40、20/40/80、20/40/80/160
				options[i].style.display = "none";
		}
		document.wifi_form.WLANChannelBandwidth_5g.value = "0";
	}
	doload_channel_options();
}

function doChannelBandwidthChange()
{
}

function doChannelBandwidthChange_5g()
{
	doload_channel_options();
}

function doExtChaLockChange()
{
}
</script>
</head>

<body style="background:#4acbd6;"  onLoad="doLoad()">
<form name="wifi_form" method="post" ACTION="/cgi-bin/wifi_advaced.asp">
<input type="hidden" name="saveFlag" value="0">
<div id="pagestyle">
	<div id="contenttype">
		<INPUT TYPE="HIDDEN" NAME="hCountryRegion">
		<INPUT TYPE="HIDDEN" NAME="hCountryRegionABand">
		<INPUT TYPE="HIDDEN" NAME="Is11nMode">
		<INPUT TYPE="HIDDEN" NAME="ExtChannFlag">
		<INPUT TYPE="HIDDEN" NAME="Wlan_HTBW40M">
		<INPUT TYPE="HIDDEN" NAME="HTBW" value="0">
		<script>
		document.getElementsByName("hCountryRegion")[0].value = com_countryRegion_2g;
		document.getElementsByName("hCountryRegionABand")[0].value = com_countryRegion_5g;
		document.getElementsByName("Is11nMode")[0].value = com_11nMode_2g;
		document.getElementsByName("ExtChannFlag")[0].value = com_ht_extcha_2g;
		document.getElementsByName("Wlan_HTBW40M")[0].value = com_ht_bssCoexist_2g;
		</script>
		<div id="block1" class="main_item">
			<!------2.4G------>
			<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0px;">
				<tr height="25px" style="width:100%;background:#e6e6e6;">
					<td  align="left" class="title-main" style="padding-left:20px;">2.4G Wi-Fi Advanced Settings</td>
				</tr>
			</table> 

			<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">Radio Enabled</td>
					<td align=left class="tabdata">
						<input type="radio" name="wlan_APenable" value="1" disabled>Enable&nbsp;&nbsp;&nbsp;&nbsp;
						<input type="radio" name="wlan_APenable" value="0" disabled>Disable
					</td>
					<script>
					if (com_apon_2g == "1") {
						document.getElementsByName("wlan_APenable")[0].checked = true;
						document.getElementsByName("wlan_APenable")[1].checked = false;
					} else {
						document.getElementsByName("wlan_APenable")[0].checked = false;
						document.getElementsByName("wlan_APenable")[1].checked = true;
					}
					</script>
				</tr>
				<tr height="30px">
					<td align=left class="tabdata" style="width:250px;padding-left:20px;">
					802.11 Mode</td>
					<td align=left class="tabdata">
						<SELECT NAME="WirelessMode" SIZE="1" onChange="doWirelessModeChange()" disabled>
							<option value="11b">802.11b
							<option value="11g">802.11g
							<option value="11bg">802.11b+g
							<option value="11n">802.11n
							<option value="11gn">802.11g+n
							<option value="11bgn">802.11b+g+n
							<option value="11ax">802.11b/g/n/ax mixed
						</SELECT>
					</td>
					<script>
					if(com_mode_2g == "N/A")
						document.getElementsByName("WirelessMode")[0].value = "11bgn";
					else
						document.getElementsByName("WirelessMode")[0].value = com_mode_2g;
					</script>
				</tr>
				<tr height="30px">
					<td align=left class="tabdata" style="width:250px;padding-left:20px;">Channel Bandwidth</td>
					<td align=left class="tabdata">
						<select name="WLANChannelBandwidth" onChange="doChannelBandwidthChange();">
							<option value="0">20 MHz</option>
							<option value="1" style="display:none;">Auto</option>
							<option value="2">20/40 MHz</option>
						</select>
					</td>
					<script>
					if(com_ht_bw_2g == "0")
						document.getElementsByName("WLANChannelBandwidth")[0].value = "0";
					if(com_ht_bssCoexist_2g == "1" && com_ht_bw_2g != "0")
						document.getElementsByName("WLANChannelBandwidth")[0].value = "1";
					if(com_ht_bw_2g == "N/A")
						document.getElementsByName("WLANChannelBandwidth")[0].value = "1";
					if(com_ht_bssCoexist_2g == "0" && com_ht_bw_2g == "1")
						document.getElementsByName("WLANChannelBandwidth")[0].value = "2";
					</script>
				</tr>
				<tr height="30px">
					<td align=left class="tabdata" style="width:250px;padding-left:20px;">
					Channel</td>
					<td align=left class="tabdata">
					<SELECT NAME="Channel_ID" SIZE="1" onChange="doExtChaLockChange()" disabled>
					</SELECT>
					Current Channel :
					<input type="text" name="CurrentChannel" size="3" maxlength="2" disabled>
					</td>
					<script>
					if(com_channel_2g == "0") {
						if(info_curChannel_2g == "0" || info_curChannel_2g == "N/A")
							document.getElementsByName("CurrentChannel")[0].value = "auto";
						else
							document.getElementsByName("CurrentChannel")[0].value = info_curChannel_2g;
					} else {
						document.getElementsByName("CurrentChannel")[0].value = com_channel_2g;
					}
					</script>
				</tr>
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">OFDMA</td>
					<td align=left class="tabdata">DL:Enable
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					UL:Disable</td>
				</tr>
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;"> MU-MIMO</td>
					<td align=left class="tabdata">DL:Enable
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					UL:Disable</td>
				</tr>
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">UPASD</td>
					<td align=left class="tabdata">Disable</td>
				</tr>
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">TWT</td>
					<td align=left class="tabdata">Disable</td>
				</tr>
			</table>
			<!------5G------>
			<INPUT TYPE="HIDDEN" NAME="Wlan_HTBW40M_5g" value="">
			<INPUT TYPE="HIDDEN" NAME="Is11nMode_5g">
			<INPUT TYPE="HIDDEN" NAME="Is11acMode_5g">
			<script>
			document.getElementsByName("Is11nMode_5g")[0].value = com_11nMode_5g;
			document.getElementsByName("Is11acMode_5g")[0].value = com_11acMode_5g;
			</script>
			<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0px;">
				<tr height="25px" style="width:100%;background:#e6e6e6;">
					<td  align="left" class="title-main" style="padding-left:20px;">5G Wi-Fi Advanced Settings</td>
				</tr>
			</table> 

			<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">Radio Enabled</td>
					<td align=left class="tabdata">
						<INPUT TYPE="RADIO" NAME="wlan_APenable_5g" VALUE="1" disabled>Enable
						&nbsp;&nbsp;&nbsp;&nbsp;
						<INPUT TYPE="RADIO" NAME="wlan_APenable_5g" VALUE="0" disabled>Disable
					</td>
					<script>
					if (com_apon_5g == "1") {
						document.getElementsByName("wlan_APenable_5g")[0].checked = true;
						document.getElementsByName("wlan_APenable_5g")[1].checked = false;
					} else {
						document.getElementsByName("wlan_APenable_5g")[0].checked = false;
						document.getElementsByName("wlan_APenable_5g")[1].checked = true;
					}
					</script>
				</tr>
				<tr height="30px">
					<td align=left class="tabdata" style="width:250px;padding-left:20px;">
							802.11 Mode
					</td>
					<td align=left class="tabdata">
						<SELECT NAME="WirelessMode_5g" SIZE="1" onChange="doWirelessModeChange_5g()" disabled>
							<option value="11a">11a only
							<option value="11an">11a/n mixed mode
							<option value="11anac">11vht AC/AN/A
							<option value="11ac">11vht AC/AN
							<option value="11ax">802.11a/n/ac/ax mixed
						</SELECT>
					</td>
					<script>
					if(com_mode_5g == "N/A")
						document.getElementsByName("WirelessMode_5g")[0].value = "11ac";
					else
						document.getElementsByName("WirelessMode_5g")[0].value = com_mode_5g;
					</script>
				</tr>
				<tr height="30px">
					<td align=left class="tabdata" style="width:250px;padding-left:20px;">
					Channel Bandwidth </td>
					<td align=left class="tabdata">
						<INPUT TYPE="HIDDEN" NAME="WLan11acVHTChannelBandwidth">
						<INPUT TYPE="HIDDEN" NAME="WLan11acVHT_BW">
						<INPUT TYPE="HIDDEN" NAME="VHTBW" value="0">
						<select name="WLANChannelBandwidth_5g" onChange="doChannelBandwidthChange_5g();">
							<option value="0">20 MHz</option>
							<option value="1">20/40 MHz</option>
							<option value="2">20/40/80 MHz</option>
							<option value="3">20/40/80/160 MHz</option>
						</select>
					</td>
					<script>
					document.getElementsByName("WLan11acVHTChannelBandwidth")[0].value = com_ht_bssCoexist_5g;
					document.getElementsByName("WLan11acVHT_BW")[0].value = com_ht_bw_5g;
					if(com_ht_bw_5g == "0") {
						document.getElementsByName("WLANChannelBandwidth_5g")[0].value = "0";
					} else if(com_ht_bssCoexist_5g == "0" && com_ht_bw_5g == "1") {
						if(com_vht_bw_5g == "0")
							document.getElementsByName("WLANChannelBandwidth_5g")[0].value = "1";
						else if(com_vht_bw_5g == "1")
							document.getElementsByName("WLANChannelBandwidth_5g")[0].value = "2";
						else if(com_vht_bw_5g == "2")
							document.getElementsByName("WLANChannelBandwidth_5g")[0].value = "3";
					}
					</script>
				</tr>
				<tr>
					<td align=left class="tabdata" style="width:250px;padding-left:20px;">
					Channel</td>
					<td>
						<SELECT NAME="Channel_ID_5g" SIZE="1" onChange="doExtChaLockChange()" disabled></SELECT>
						Current Channel : 
						<input type="text" name="CurrentChannel_5g" size="3" maxlength="2" disabled>
					</td>
					<script>
					if(com_channel_5g == "0") {
						if(info_curChannel_5g == "0" || info_curChannel_5g == "N/A")
							document.getElementsByName("CurrentChannel_5g")[0].value = "auto";
						else
							document.getElementsByName("CurrentChannel_5g")[0].value = info_curChannel_5g;
					} else {
						document.getElementsByName("CurrentChannel_5g")[0].value = com_channel_5g;
					}
					</script>
				</tr>
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">DFS</td>
					<td align=left class="tabdata">
						<INPUT TYPE="RADIO" NAME="wlan_dfsenable_5g" VALUE="1">Enable
						&nbsp;&nbsp;&nbsp;&nbsp;
						<INPUT TYPE="RADIO" NAME="wlan_dfsenable_5g" VALUE="0">Disable
					</td>
					<script>
					if (dfs_dfsEnable_5g == "1") {
						document.getElementsByName("wlan_dfsenable_5g")[0].checked = true;
						document.getElementsByName("wlan_dfsenable_5g")[1].checked = false;
					} else {
						document.getElementsByName("wlan_dfsenable_5g")[0].checked = false;
						document.getElementsByName("wlan_dfsenable_5g")[1].checked = true;
					}
					</script>
				</tr>
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">OFDMA</td>
					<td align=left class="tabdata">DL:Enable
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					UL:Disable</td>
				</tr>
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;"> MU-MIMO</td>
					<td align=left class="tabdata">DL:Enable
					&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					UL:Disable</td>
				</tr>
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">UPASD</td>
					<td align=left class="tabdata">Disable</td>
				</tr>
				<tr height="30px">
					<td width="250px" align=left class="tabdata" style="padding-left:20px;">TWT</td>
					<td align=left class="tabdata">Disable</td>
				</tr>
			</table>
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
