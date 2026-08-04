

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" type="text/javascript" src="/jsl.js"></script>
<script language="JavaScript" type='text/javascript' src="/ip_new.js"></script>
<script type="text/javascript" src="/spin.js" ></script>
<link rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">

*{color:  #404040;}
</style>

<script language="JavaScript">
//////
/*var qos_com_active = "1";//QoS_Common Discipline Yes/No
var qos_com_discipline = "WRR";//QoS_Common Discipline WRR/SP
var qos_com_wwr_highest = "1";//QoS_Common WeightHighest
var qos_com_wwr_high = "2";//QoS_Common WeightHigh
var qos_com_wwr_medium = "3";//QoS_Common WeightMedium
var qos_com_wwr_low = "4";//QoS_Common WeightLow
var webCurSet_qos_id = "1";//WebCurSet_Entry qos_id 0-15
var qos_entry_active = "1";//QoS_Entry Active Yes/No
var qos_entry_app = "DHCP";//QoS_Entry Application IGMP/MGCP/DNS/DHCP/RIP/RSTP/RTCP/RTP
var qos_entry_destIp = "192.168.6.66";//QoS_Entry DesIP 
var qos_entry_destMask = "255.255.255.0";//QoS_Entry DesMask 
var qos_entry_destPortBegin = "192.168.66.6";//QoS_Entry DesPortRangeBegin 
var qos_entry_destPortEnd = "255.255.255.0";//QoS_Entry DesPortRangeEnd 
var qos_entry_srcIp = "192.168.66.6";//QoS_Entry SrcIP 
var qos_entry_srcMask = "255.255.255.0";//QoS_Entry SrcMask 
var qos_entry_srcPortBegin = "22";//QoS_Entry SrcPortRangeBegin 
var qos_entry_srcPortEnd = "23";//QoS_Entry SrcPortRangeEnd 
var qos_entry_proto = "ICMP";//QoS_Entry ProtocolID TCP/UDP TCP UDP ICMP
var qos_entry_actQue = "Highest";//QoS_Entry ActQueue Low/Medium/High/Highest
var lanhost_0_ip = "192.168.29.6";//LanHost_Entry0 IP
var lanhost_0_mac = "aa:bb:cc:dd:11:22";//LanHost_Entry0 MAC
var lanhost_2_ip = "192.168.29.2";
var lanhost_2_mac = "aa:bb:cc:dd:11:26";*/
//////
var qos_com_active = "0";
var qos_com_upBW = "0";
var qos_com_discipline = "SP";
var qos_com_wwr_highest = "1";
var qos_com_wwr_high = "1";
var qos_com_wwr_medium = "1";
var qos_com_wwr_low = "1";
var webCurSet_qos_id = "0";
var qos_entry_active = "0";
var qos_entry_app = "";
var qos_entry_dip = "";
var qos_entry_dport = "";
var qos_entry_sip = "";
var qos_entry_sport = "";
var qos_entry_proto = "";
var qos_entry_actQue = "";
var lanhost_0_ip = "192.168.1.179";
var lanhost_0_mac = "D8:43:AE:2E:65:45";

function showSpin0(){
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

	var target = document.getElementById('firstDiv0');
	var spinner = new Spinner(opts).spin(target);
}

function showSpin1(){
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

	var target = document.getElementById('firstDiv1');
	var spinner = new Spinner(opts).spin(target);
}

function showSpin2(){
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

	var target = document.getElementById('firstDiv2');
	var spinner = new Spinner(opts).spin(target);
}

function ornIppTosDscp(type){
	var form = document.QoS_Form;

	switch(type){
		case 0://disable all
			form.Qos_IPP_DSCP1[0].disabled = true;
			form.Qos_IPP_DSCP1[1].disabled = true;
			form.QosIPPValue1.disabled = true;
			form.QosIPPValue2.disabled = true;
			form.QosTOS.disabled = true;
			form.QosDSCPValue1.disabled = true;
			form.QosDSCPValue2.disabled = true;
			break;
		case 1://enable all
			form.Qos_IPP_DSCP1[0].disabled = false;
			form.Qos_IPP_DSCP1[1].disabled = false;
			form.QosIPPValue1.disabled = false;
			form.QosIPPValue2.disabled = false;
			form.QosTOS.disabled = false;
			form.QosDSCPValue1.disabled = false;
			form.QosDSCPValue2.disabled = false;
			break;
		case 2://IPP
			form.Qos_IPP_DSCP1[0].disabled = false;
			form.Qos_IPP_DSCP1[1].disabled = false;
			form.QosIPPValue1.disabled = false;
			form.QosIPPValue2.disabled = false;
			form.QosTOS.disabled = false;
			form.QosDSCPValue1.disabled = true;
			form.QosDSCPValue2.disabled = true;
			break;
		case 3://DSCP
			form.Qos_IPP_DSCP1[0].disabled = false;
			form.Qos_IPP_DSCP1[1].disabled = false;
			form.QosIPPValue1.disabled = true;
			form.QosIPPValue2.disabled = true;
			form.QosTOS.disabled = true;
			form.QosDSCPValue1.disabled = false;
			form.QosDSCPValue2.disabled = false;
			break;
		default:
			break;
		}
}

function reIppTosDscp(type)
{
	var form = document.QoS_Form;

	switch(type){
		case 0://disable all
			form.Qos_IPP_DSCP2[0].disabled = true;
			form.Qos_IPP_DSCP2[1].disabled = true;
			form.QosReIPPValue.disabled = true;
			form.QosReTOS.disabled = true;
			form.QosReDSCPValue.disabled = true;
			break;
		case 1://enable all
			form.Qos_IPP_DSCP2[0].disabled = false;
			form.Qos_IPP_DSCP2[1].disabled = false;
			form.QosReIPPValue.disabled = false;
			form.QosReTOS.disabled = false;
			form.QosReDSCPValue.disabled = false;
			break;
		case 2://IPP
			form.Qos_IPP_DSCP2[0].disabled = false;
			form.Qos_IPP_DSCP2[1].disabled = false;
			form.QosReIPPValue.disabled = false;
			form.QosReTOS.disabled = false;
			form.QosReDSCPValue.disabled = true;
			break;
		case 3://DSCP
			form.Qos_IPP_DSCP2[0].disabled = false;
			form.Qos_IPP_DSCP2[1].disabled = false;
			form.QosReIPPValue.disabled = true;
			form.QosReTOS.disabled = true;
			form.QosReDSCPValue.disabled = false;
			break;
		default:
			break;
	}
}

function fromDMacToPriority(TorF){
	var value;
	var form = document.QoS_Form;

	if(TorF == 0){
		value = true;
		ornIppTosDscp(0);
		reIppTosDscp(0);
	}else{
		value = false;
		ornIppTosDscp(1);
		reIppTosDscp(1);
	}

	form.QosDestMacValue.disabled = value;
	form.QosDestIpValue.disabled = value;
	form.QosDestMaskValue.disabled = value;
	form.QosDestPortValue1.disabled = value;
	form.QosDestPortValue2.disabled = value;
	form.QosSrcMacValue.disabled = value;
	form.QosSrcIpValue.disabled = value;
	form.QosSrcMaskValue.disabled = value;
	form.QosSrcPortValue1.disabled = value;
	form.QosSrcPortValue2.disabled = value;
	form.QosProtocol.disabled = value;
	form.QosVIDValue1.disabled = value;
	form.QosVIDValue2.disabled = value;
	form.Qos8021pValue1.disabled = value;
	form.Qos8021pValue2.disabled = value;
	form.Qos8021pReValue.disabled = value;
	form.Qos8021pReApp.disabled = value;

	form.QosConfigPriority.disabled = value;
}

function fromSumToDeact(TorF){
	var form = document.QoS_Form;
	var value;

	if(TorF == 0)
		value = true;
	else
		value = false;

	form.Qosdiscipline[0].disabled = value;
	form.Qosdiscipline[1].disabled = value;
	//form.Qosdisciplinesave.disabled = value;
	form.QosWRRweight1.disabled = value;
	form.QosWRRweight2.disabled = value;
	form.QosWRRweight3.disabled = value;
	form.QosWRRweight4.disabled = value;
	form.Qos_Summary.disabled = value;
	form.QosRuleIndex.disabled = value;
	form.QosRuleActive[0].disabled = value;
	form.QosRuleActive[1].disabled = value;
}


function formAppToPhyport(TorF){
	var form = document.QoS_Form;
	var value;

	if(TorF == 0)
		value = true;
	else
		value = false;

	form.QosApp.disabled = value;

	if (form.wlanISExist.value == "On") {
		if(form.QosMBSSIDNumberFlag.value == 1){
			//form.QosPhyPortWLANMssid0.disabled=value;
			form.QosPhyPortRa0.disabled = value;
		}
		if(form.QosMBSSIDNumberFlag.value == 2){
			form.QosPhyPortWLANMssid0.disabled = value;
			if(form.UserMode.value == 0){
				form.QosPhyPortWLANMssid1.disabled = value;
			}
		}
		if(form.QosMBSSIDNumberFlag.value == 3){
			form.QosPhyPortWLANMssid0.disabled = value;
			if(form.UserMode.value == 0){
				form.QosPhyPortWLANMssid1.disabled = value;
				form.QosPhyPortWLANMssid2.disabled = value;
			}
		}
		if(form.QosMBSSIDNumberFlag.value == 4){
			form.QosPhyPortWLANMssid0.disabled = value;
			if(form.UserMode.value == 0){
				form.QosPhyPortWLANMssid1.disabled = value;
				form.QosPhyPortWLANMssid2.disabled = value;
				form.QosPhyPortWLANMssid3.disabled = value;
			}
		}
	}

	if (form.wlan11acISExist.value == "On") {
		if(form.Qos11acMBSSIDNumberFlag.value == 1){
			form.QosPhyPortRai0.disabled = value;
		}
		if(form.Qos11acMBSSIDNumberFlag.value == 2){
			form.QosPhyPortWLAN11acMssid0.disabled = value;
			form.QosPhyPortWLAN11acMssid1.disabled = value;
		}
		if(form.Qos11acMBSSIDNumberFlag.value == 3){
			form.QosPhyPortWLAN11acMssid0.disabled = value;
			form.QosPhyPortWLAN11acMssid1.disabled = value;
			form.QosPhyPortWLAN11acMssid2.disabled = value;
		}
		if(form.Qos11acMBSSIDNumberFlag.value == 4){
			form.QosPhyPortWLAN11acMssid0.disabled = value;
			form.QosPhyPortWLAN11acMssid1.disabled = value;
			form.QosPhyPortWLAN11acMssid2.disabled = value;
			form.QosPhyPortWLAN11acMssid3.disabled = value;
		}
	}

	form.QosPhyPortEth0.disabled = value;

	if (form.QoS1PortFlag.value != "Yes") {
		form.QosPhyPortEth1.disabled = value;
		if (form.QoS2PortsFlag.value != "Yes") {
			form.QosPhyPortEth2.disabled = value;
			form.QosPhyPortEth3.disabled = value;
		}
	}
}

function disableAll()
{
	fromSumToDeact(0);
	formAppToPhyport(0);
	fromDMacToPriority(0);
}

function enableAll()
{
	fromSumToDeact(1);
	formAppToPhyport(1);
	fromDMacToPriority(1);
}

function onDisChanged()
{
	var form = document.QoS_Form;
	var value;
	if (form.Qosdiscipline[0].selected)
		value = false;
	else
		value = true;

	form.QosWRRweight1.disabled = value;
	form.QosWRRweight2.disabled = value;
	form.QosWRRweight3.disabled = value;
	form.QosWRRweight4.disabled = value;
}

function init()
{
	if(document.QoS_Form.Qos_active[1].checked){
		disableAll();
		return;
	}
	onDisChanged();
	if(document.QoS_Form.QosRuleActive[1].checked){
		formAppToPhyport(0);
		fromDMacToPriority(0);
		return;
	}
	if(document.QoS_Form.Qos_IPP_DSCP1[0].checked){
		ornIppTosDscp(2);
	}else{
		ornIppTosDscp(3);
	}
	if(document.QoS_Form.Qos_IPP_DSCP2[0].checked){
		reIppTosDscp(2);
	}else{
		reIppTosDscp(3);
	}
	doMACaddressChange();
}           

function isValidHex(ucHex)
{
	return (ucHex>='0' && ucHex<='9') || (ucHex>='a' && ucHex<='f') || (ucHex>='A' && ucHex<='F') ? true : false;
}

function doMACcheck(object)
{
	var szAddr = object.value;
	var len = szAddr.length;

	if ( len == 0 )
	{
		return;
	}

	if ( len == 12 )
	{
		var newAddr = "";
		var i = 0;
		for ( i = 0; i < len; i++ )
		{
			var c = szAddr.charAt(i);
			if ( !isValidHex(c) )
			{
				if( object.name == "QosDestMacValue"){
					alert("Invalid Destination MAC address!");
				}else{
					alert("Invalid Source MAC address!");
				}
				object.focus();
				return;
			}

			if ( (i == 2) || (i == 4) || (i == 6) || (i == 8) || (i == 10) ){
				newAddr = newAddr + ":";
			}

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

		if ( (!isValidHex(c0)) || (!isValidHex(c1)) )
		{
			if( object.name == "QosDestMacValue")
			{
				alert("Invalid Destination MAC address!");
			}else{
				alert("Invalid Source MAC address!");
			}

			object.focus();
			return;
		}         

		i = 2;
		while ( i < len )
		{
			var c0 = szAddr.charAt(i);
			var c1 = szAddr.charAt(i+1);
			var c2 = szAddr.charAt(i+2);

			if ( (c0 != ":") || (!isValidHex(c1)) || (!isValidHex(c2)) )
			{
				if( object.name == "QosDestMacValue")
				{
					alert("Invalid Destination MAC address!");
				}else{
					alert("Invalid Source MAC address!");
				}

				object.focus();
				return;
			}
		i = i + 3;
		}
		return;
	}
	else
	{
		if( object.name == "QosDestMacValue")
		{
			alert("Invalid Destination MAC address!");
			}else{
			alert("Invalid Source MAC address!");
		}

	object.focus();
	return;
	}
}

function errorValueAlert(option){
	switch(option){
		case 0:
			alert("Destination Port Error!");break;
		case 1:
			alert("Source Port Error!");break;
		case 2:
			alert("Vlan ID Error!");break;
		case 3:
			alert("Wrong DSCP Priority!");break;
		case 4:
			alert("Wrong Remarked DSCP value!");break;
		case 6:
			alert("Wrong New 802.1p Priority!");break;
		case 7:
			alert("WRR weight is out of range!");break;
		default:
			break;
	}
}

function checkRangeValue(sElem, eElem, min, max, option)
{
	start = parseInt(sElem.value);
	end = parseInt(eElem.value);

	if((sElem.value == "")&&(eElem.value == ""))
		return true;

	if(isNaN(start) || start > max || start < min)
	{
		errorValueAlert(option);
		return false;
	}

	if(isNaN(end) || end > max || end < min)
	{
		errorValueAlert(option);
		return false;
	}

	if(start > end)
	{
		errorValueAlert(option);
		return false;
	}

	return true;
}

function inValidSubnetMask(IPAddr,Mask)
{
	var ip = IPAddr.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var mask = Mask.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits;
	var ipdigits;
	var bMask = 0;
	var watch = false;
	var i;

	if(mask == null)
	{ 
		alert(_("InvalidNetMask") + " " + Mask);
		return true;
	}
	ipdigits = ip[0].split(".");
	digits = mask[0].split(".");

	for(i=0; i < 4; i++)
	{
		if((Number(digits[i]) > 255 ) || (Number(digits[i]) < 0 ) || digits[i] == null)
		{
			alert(_("InvalidNetMask") + " " + Mask);
			return true;
		}
		bMask = (bMask << 8) | Number(digits[i]);
	}

	if((Number(digits[0]) == 0))
	{
		alert(_("InvalidNetMask") + " " + Mask);
		return true;
	}

	bMask = bMask & 0x0FFFFFFFF;
	for(i=0; i<32; i++)
	{
		if((watch==true) && ((bMask & 0x1)==0)) { 
		alert(_("InvalidNetMask") + " " + Mask);
		return true;
		}
		bMask = bMask >> 1;
		if((bMask & 0x01) == 1) watch=true;
	}

	if(ipdigits[3] == 0 && digits[3] == 255){
		alert(_("InvalidIpAndNetMask") + " " + IPAddr + ' & ' + Mask);
		return true;
	}
	/*  delete for if the last numer of ip is not 0 , 255.255.255.255 can't be saved 
	if(!((Number(ipdigits[0]&digits[0])==Number(ipdigits[0]))
			&&(Number(ipdigits[1]&digits[1])==Number(ipdigits[1]))
			&&(Number(ipdigits[2]&digits[2])==Number(ipdigits[2]))
			&&(Number(ipdigits[3]&digits[3])==Number(ipdigits[3])))){
			alert(_("InvalidIpAndNetMask") + " " + IPAddr + ' & ' + Mask);
			return true;
	}
	*/
	return false;
}

function inValidQOSIP(Address){
	var address = Address.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits;
	var i;

	if (address == null) {
		//alert('Invalid IP address' + Address);
		return true;
	}
	digits = address[0].split(".");
	for(i=0; i < 4; i++){
		if((Number(digits[i]) > 255 ) || (Number(digits[i]) < 0 ) || (digits[i] == null)){ 
			alert('Invalid IP address ' + Address);
			return true;
		}
	}
	if(((Number(digits[0]) == 0) && (Number(digits[1]) == 0) && (Number(digits[2]) == 0) && (Number(digits[3]) == 0))||
		((Number(digits[0]) == 255) && (Number(digits[1]) == 255) && (Number(digits[2]) == 255) && (Number(digits[3]) == 255)))
	{
		alert('Invalid IP address ' + Address);
		return true;
	}
return false;
}

function blockMask(index)
{
	switch(index)
	{
		case 0:
			IP = document.QoS_Form.QosDestIpValue;
			mask = document.QoS_Form.QosDestMaskValue;
			break;
		case 1:
			IP = document.QoS_Form.QosSrcIpValue;
			mask = document.QoS_Form.QosSrcMaskValue;
			break;
	}

	var addr1 = IP.value.split(".")[0];
	var addr4 = IP.value.split(".")[3];

	if(IP.value == ""){
		 mask.value = "";
	}
	else if(addr4 != 0) {
		mask.value = "255.255.255.255";
	}
	else if(addr1 < 128 && addr1  > 0)
	{
		mask.value = "255.0.0.0";
	}
	else if(addr1 < 192 && addr1 > 127)
	{
		mask.value="255.255.0.0";
	}
	else if(addr1 < 224 && addr1  > 191)
	{
		mask.value = "255.255.255.0";
	}
	else
	{
		mask.disabled = false;
	}

}

function verifyForm(){
	var form = document.QoS_Form;
	var v6flag = false;
	if(form.QOS_Flag.value != 0)
		return;

	if(document.QoS_Form.Qos_active[1].checked)
		return;

	if(document.QoS_Form.QosRuleActive[1].checked)
		return;

	if(form.QosDestIpValue.value != "")
	{
		if(inValidQOSIP(form.QosDestIpValue.value)) {
			if (inValidIPv6Addr(form.QosDestIpValue.value)) {
				return false;
			}
			else
				v6flag = true;
		}

		if(form.QosDestMaskValue.value == ""){
			alert("Empty Mask address");
			return false;
		}
	}

	if(form.QosDestMaskValue.value != "")
	{
		if (v6flag) {
			if(inValidIPv6Prefix(form.QosDestMaskValue.value))
				return false;
		}
		else {
			if(inValidSubnetMask(form.QosDestIpValue.value,form.QosDestMaskValue.value))
				return false;
		}
	}

	if(!checkRangeValue(form.QosDestPortValue1, form.QosDestPortValue2, 0, 65535, 0))
		return false;

	v6flag = false;
	if(form.QosSrcIpValue.value != "")
	{
		if(inValidQOSIP(form.QosSrcIpValue.value)) {
			if (inValidIPv6Addr(form.QosSrcIpValue.value)) {
				return false;
			}
			else
				v6flag = true;
		}

		if(form.QosSrcMaskValue.value == ""){
			alert("Empty Mask address");
			return false;
		}
	}   

	if(form.QosSrcMaskValue.value != "")
	{
		if (v6flag) {
			if(inValidIPv6Prefix(form.QosSrcMaskValue.value))
				return false;
		}
		else {
			if(inValidSubnetMask(form.QosSrcIpValue.value,form.QosSrcMaskValue.value))
				return false;
		}
	}

	if(!checkRangeValue(form.QosSrcPortValue1, form.QosSrcPortValue2, 0, 65535, 1))
		return false;

	if((form.QosVIDValue1.value !=0 ) || (form.QosVIDValue2.value != 0))
	{
		if(!checkRangeValue(form.QosVIDValue1, form.QosVIDValue2, 1, 4094, 2))
			return false;
	}

	if(document.QoS_Form.Qos_IPP_DSCP1[0].checked)
	{
		if(form.QosIPPValue1.selectedIndex > form.QosIPPValue2.selectedIndex)
		{
			alert("Wrong IP Precedence value!");
			return false;
		}
	}else{
		if(!checkRangeValue(form.QosDSCPValue1, form.QosDSCPValue2, 0, 255, 3))
			return false;
	}

	if(form.Qos8021pValue1.selectedIndex > form.Qos8021pValue2.selectedIndex)
	{
		alert("Wrong Original 802.1p Priority!");return false;
	}

	if(form.Qos_IPP_DSCP2[1].checked)
	{
		if(!checkRangeValue(form.QosReDSCPValue, form.QosReDSCPValue, 0, 255, 4))
		return false;
	}
	/* check protocol is set for port setting */
	if (form.QosDestPortValue1.value != "" || form.QosSrcPortValue1.value != "") {
		if (form.QosProtocol.options[0].selected == true) {
			//alert("We should set protocol if src or dst port is setted!");
			//return false;
			form.QosProtocol.options[1].selected = true;
		}
}

	if(form.QosConfigPriority.selectedIndex == 0)
	{
		alert("We should assign priority queue for this rule!");return false;
	}

	showSpin1();
	return;
}

function checkPhysicalPort()
{

	if(document.forms[0].QosPhyPortEth0.checked)
		document.forms[0].QosPhyPortEth0.value = "Yes";
	else
		document.forms[0].QosPhyPortEth0.value = "No";

	if (document.forms[0].QoS1PortFlag.value != "Yes") {
		if(document.forms[0].QosPhyPortEth1.checked)
			document.forms[0].QosPhyPortEth1.value = "Yes";
		else
			document.forms[0].QosPhyPortEth1.value = "No";

		if (document.forms[0].QoS2PortsFlag.value != "Yes") {
			if(document.forms[0].QosPhyPortEth2.checked)
				document.forms[0].QosPhyPortEth2.value = "Yes";
			else
				document.forms[0].QosPhyPortEth2.value = "No";

			if(document.forms[0].QosPhyPortEth3.checked)
				document.forms[0].QosPhyPortEth3.value = "Yes";
			else
				document.forms[0].QosPhyPortEth3.value = "No";
		}
	}

	if (document.forms[0].wlanISExist.value == "On") {
		if(document.forms[0].QosMBSSIDNumberFlag.value == "1"){
			if(document.forms[0].QosPhyPortRa0.checked)
				document.forms[0].QosPhyPortRa0.value = "Yes";
			else
				document.forms[0].QosPhyPortRa0.value = "No";
		}
		if(document.forms[0].QosMBSSIDNumberFlag.value == "2"){
			if(document.forms[0].QosPhyPortWLANMssid0.checked)
				document.forms[0].QosPhyPortWLANMssid0.value = "Yes"
			else
				document.forms[0].QosPhyPortWLANMssid0.value = "No"
			if(document.forms[0].UserMode.value == "0"){
				if(document.forms[0].QosPhyPortWLANMssid1.checked)
					document.forms[0].QosPhyPortWLANMssid1.value = "Yes"
				else
					document.forms[0].QosPhyPortWLANMssid1.value = "No"
			}
		}
		if(document.forms[0].QosMBSSIDNumberFlag.value == "3"){
			if(document.forms[0].QosPhyPortWLANMssid0.checked){
				document.forms[0].QosPhyPortWLANMssid0.value = "Yes"
			}
			else
				document.forms[0].QosPhyPortWLANMssid0.value = "No"
			if(document.forms[0].UserMode.value == "0"){
				if(document.forms[0].QosPhyPortWLANMssid1.checked)
					document.forms[0].QosPhyPortWLANMssid1.value = "Yes"
				else
					document.forms[0].QosPhyPortWLANMssid1.value = "No"
				if(document.forms[0].QosPhyPortWLANMssid2.checked)
					document.forms[0].QosPhyPortWLANMssid2.value = "Yes"
				else
					document.forms[0].QosPhyPortWLANMssid2.value = "No"
			}
		}
		if(document.forms[0].QosMBSSIDNumberFlag.value == "4"){
			if(document.forms[0].QosPhyPortWLANMssid0.checked){
				document.forms[0].QosPhyPortWLANMssid0.value = "Yes"
			}
			else
				document.forms[0].QosPhyPortWLANMssid0.value = "No"
			if(document.forms[0].UserMode.value == "0"){
				if(document.forms[0].QosPhyPortWLANMssid1.checked)
					document.forms[0].QosPhyPortWLANMssid1.value = "Yes"
				else
					document.forms[0].QosPhyPortWLANMssid1.value = "No"
				if(document.forms[0].QosPhyPortWLANMssid2.checked)
					document.forms[0].QosPhyPortWLANMssid2.value = "Yes"
				else
					document.forms[0].QosPhyPortWLANMssid2.value = "No"
				if(document.forms[0].QosPhyPortWLANMssid3.checked)
					document.forms[0].QosPhyPortWLANMssid3.value = "Yes"
				else
					document.forms[0].QosPhyPortWLANMssid3.value = "No"
			}
		}
	}

	if (document.forms[0].wlan11acISExist.value == "On") {
		if(document.forms[0].Qos11acMBSSIDNumberFlag.value == "1"){
			if(document.forms[0].QosPhyPortRai0.checked)
				document.forms[0].QosPhyPortRai0.value = "Yes";
			else
				document.forms[0].QosPhyPortRai0.value = "No";
		}
		if(document.forms[0].Qos11acMBSSIDNumberFlag.value == "2"){
			if(document.forms[0].QosPhyPortWLAN11acMssid0.checked)
				document.forms[0].QosPhyPortWLAN11acMssid0.value = "Yes"
			else
				document.forms[0].QosPhyPortWLAN11acMssid0.value = "No"

			if(document.forms[0].QosPhyPortWLAN11acMssid1.checked)
				document.forms[0].QosPhyPortWLAN11acMssid1.value = "Yes"
			else
				document.forms[0].QosPhyPortWLAN11acMssid1.value = "No"
		}
		if(document.forms[0].Qos11acMBSSIDNumberFlag.value == "3"){
			if(document.forms[0].QosPhyPortWLAN11acMssid0.checked)
				document.forms[0].QosPhyPortWLAN11acMssid0.value = "Yes"
			else
				document.forms[0].QosPhyPortWLAN11acMssid0.value = "No"

			if(document.forms[0].QosPhyPortWLAN11acMssid1.checked)
				document.forms[0].QosPhyPortWLAN11acMssid1.value = "Yes"
			else
				document.forms[0].QosPhyPortWLAN11acMssid1.value = "No"

			if(document.forms[0].QosPhyPortWLAN11acMssid2.checked)
				document.forms[0].QosPhyPortWLAN11acMssid2.value = "Yes"
			else
				document.forms[0].QosPhyPortWLAN11acMssid2.value = "No"
		}
		if(document.forms[0].Qos11acMBSSIDNumberFlag.value == "4"){
			if(document.forms[0].QosPhyPortWLAN11acMssid0.checked)
				document.forms[0].QosPhyPortWLAN11acMssid0.value = "Yes"
			else
				document.forms[0].QosPhyPortWLAN11acMssid0.value = "No"

			if(document.forms[0].QosPhyPortWLAN11acMssid1.checked)
				document.forms[0].QosPhyPortWLAN11acMssid1.value = "Yes"
			else
				document.forms[0].QosPhyPortWLAN11acMssid1.value = "No"

			if(document.forms[0].QosPhyPortWLAN11acMssid2.checked)
				document.forms[0].QosPhyPortWLAN11acMssid2.value = "Yes"
			else
				document.forms[0].QosPhyPortWLAN11acMssid2.value = "No"

			if(document.forms[0].QosPhyPortWLAN11acMssid3.checked)
				document.forms[0].QosPhyPortWLAN11acMssid3.value = "Yes"
			else
				document.forms[0].QosPhyPortWLAN11acMssid3.value = "No"
		}
	}
}

function doAdd()
{
	document.forms[0].QOS_Flag.value = 0;

	document.QoS_Form.qoSOptType.value = "typeRule";
	checkPhysicalPort();
}

function doIndexChange()
{
	document.forms[0].QOS_Flag.value = 1;
	document.forms[0].submit();
	return;
}

function doDel()
{
	document.QoS_Form.qoSOptType.value = "typeRule";
	document.forms[0].QOS_Flag.value = 2;
}              

function setProtoPort(protoIdx, dPort1, dPort2)
{
	var form = document.QoS_Form;

	form.QosProtocol.selectedIndex = protoIdx;
	form.QosDestPortValue1.value = dPort1;
	form.QosDestPortValue2.value = dPort2;
}         

function doQosAppIdxChange()
{
	var form = document.QoS_Form;
	form.QosDestIpValue.value = "";
	form.QosDestMaskValue.value = "";
	setProtoPort(3, "", "");
	form.QosSrcPortValue1.value = "";
	form.QosSrcPortValue2.value = "";

	switch(form.QosApp.selectedIndex){
		case 0:
		default:
			break;
		case 1://IGMP
			form.QosDestIpValue.value = "224.0.0.0";
			form.QosDestMaskValue.value = "240.0.0.0";
			break;
		case 2://MGCP
			setProtoPort(3, 2427, 2427);
			break;
		case 3://DNS
			setProtoPort(3, 53, 53);
			break;
		case 4://DHCP
			setProtoPort(3, 67, 67);
			form.QosSrcPortValue1.value = 68;
			form.QosSrcPortValue2.value = 68;
			break;
		case 5://RIP
			setProtoPort(3, 520, 520);
			break;
		case 6://RSTP
			setProtoPort(3, 554, 554);
			break;
		case 7://RTCP
			setProtoPort(3, 5005, 5005);
			break;
		case 8://RTP
			setProtoPort(3, 5004, 5004);
			break;
	}
}

function doQos1pAppIdxChange()
{
	switch(document.QoS_Form.Qos8021pReApp.selectedIndex){
		case 0:
		default:
			break;
		case 1://ketNET
			document.QoS_Form.Qos8021pReValue.selectedIndex = 8;
			break;
		case 2://voice
			document.QoS_Form.Qos8021pReValue.selectedIndex = 7;
			break;
		case 3://vide0
			document.QoS_Form.Qos8021pReValue.selectedIndex = 6;
			break;
		case 4://IGMP
			document.QoS_Form.Qos8021pReValue.selectedIndex = 5;
			break;
		case 5://keyData
			document.QoS_Form.Qos8021pReValue.selectedIndex = 4;
			break;
	}
}

function onClickQosDiscipline()
{
	var form = document.QoS_Form;
	if (form.Qosdiscipline[0].selected)
	{
		if(form.QosWRRweight1.value == "" ||
			form.QosWRRweight2.value == "" ||
			form.QosWRRweight3.value == "" ||
			form.QosWRRweight4.value == "")
		{
			alert("Please fill out all fields before the submission");
			return false;
		}
	}

	if((!checkRangeValue(form.QosWRRweight1, form.QosWRRweight1, 1, 15, 7)) ||
			(!checkRangeValue(form.QosWRRweight2, form.QosWRRweight2, 1, 15, 7)) ||
			(!checkRangeValue(form.QosWRRweight3, form.QosWRRweight3, 1, 15, 7)) ||
			(!checkRangeValue(form.QosWRRweight4, form.QosWRRweight4, 1, 15, 7)))
		return false;
	else{
		showSpin0(); 
		document.forms[0].QOS_Flag.value = 4;
		document.QoS_Form.qoSOptType.value = "discRule";
		document.forms[0].submit();
	}
}

function onClickQosSummary()
{
	window.open("/cgi-bin/adv_qoslist.asp","QoS_List","toolbar=no,menubar=no,scrollbars=yes,height=600, width=850,location=0,left=100,top=100");
	return false;
}


function showTable(id,header,data,keyIndex)
{
	var html = ["<table id=client_list width=640 border=0  cellpadding=1 cellspacing=0  bordercolor=#CCCCCC>"];
	// 1.generate table header
	html.push("<tr bgcolor=#FFFFFF height=30>");
	for(var i =0; i<header.length; i++){
		html.push("<td width=" + header[i][0] + " align=center class=tablelisttitle>" + header[i][1] + "</td>");
	}
	html.push("</tr>");
	// 2.generate table data
	for(var i =0; i<data.length; i++){
		if(data[i][keyIndex] != "N/A"){
			html.push("<tr bgcolor=#FFFFFF height=30 id=tablebutton>");
			for(var j=0; j<(data[i].length - 1); j++){
			if(j == 2)
				html.push("<td align=center class=topborderstyle>" + data[i][j].toUpperCase() + "</td>");
			else
				html.push("<td align=center  class=topborderstyle>" + data[i][j] + "</td>");
			}
			html.push('<td align=center  class=topborderstyle> <input type="button" class="button3" name="RemoveBtn" value="Remove" onClick=doDeleteRule(' + data[i][j] + ');> </td>');
			html.push("</tr>");
		}
	}
	html.push("</table>");
	document.getElementById(id).innerHTML = html.join('');
}

function doDeleteRule(i)
{
	document.forms[0].QOS_Flag.value = 3;
	document.QoS_Form.delnum.value=i;
	document.QoS_Form.submit();
}

function doAddRule()
{
	if (document.QoS_Form.QoS_Bandwidth_Control_Description.value == "")
	{
		alert("Empty Description!");
		return false;
	}
	if (doCheckmacAddr())
		return false;
	if(!doCheckRepeatmacAddr())
		return false;
	if (doCheckSpeed())
		return false;

	if(document.QoS_Form.QoS_Bandwidth_Control_mac_select[0].selected == true)//Manaually Enter MAC Addres
	{
		document.forms[0].MacAddFlag.value = 1;
		var macWithoutColon = document.QoS_Form.QoS_Bandwidth_Control_Mac.value.replace(/:/g,'');//replace all : by 
		document.QoS_Form.QoS_Bandwidth_Control_Mac_WithOut_Colon.value = macWithoutColon;
	}
	else{
		var macWithoutColon = document.QoS_Form.QoS_Bandwidth_Control_mac_select.value.replace(/:/g,'');//replace all : by 
		document.QoS_Form.QoS_Bandwidth_Control_Mac_WithOut_Colon.value = macWithoutColon;
	}
	var j=0;
	for(var i =0; i<tableData.length; i++){
		var tableValueTmp = tableData[i][2];
		if(tableValueTmp != "N/A")
			j=j + 1;
	}
	if(j == 10)
	{
		 alert("Maximal number of rules: 10; Available rules 0.");
		 return false;
	}
	showSpin2(); 
	document.forms[0].QOS_Flag.value = 5;
	document.QoS_Form.submit();
}

function doCheckSpeed()
{
	var upValue = document.QoS_Form.QoS_Bandwidth_Control_Up.value;
	var downValue = document.QoS_Form.QoS_Bandwidth_Control_Down.value;

	if (document.QoS_Form.QoS_Bandwidth_Control_Up.value.length == 0) {
		alert("Empty Speed Invaild.");
		return 1;
	}

	if (upValue <= 0 || upValue > 800) {
		alert(upValue + " " + "is over range limit.");
		return 1;
	}

	if (document.QoS_Form.QoS_Bandwidth_Control_Down.value.length == 0) {
		alert("Empty Speed Invaild.");
		return 1;
	}

	if (downValue <=0 || downValue > 800) {
		alert(downValue + " " + "is over range limit.");
		return 1;
	}
}

function doCheckmacAddr()
{
	var macstr = document.QoS_Form.QoS_Bandwidth_Control_Mac.value;
	var maclen = macstr.length;
	var tmp = macstr.toUpperCase();
	document.QoS_Form.QoS_Bandwidth_Control_Mac.value = tmp;

	if(document.QoS_Form.QoS_Bandwidth_Control_mac_select[0].selected == true){
		if(maclen==0){
			alert("Empty MAC Address!");
			return 1;
		}
	}

	if(maclen != 0){
		var findpos = macstr.search("^([0-9A-Fa-f]{2})(:[0-9A-Fa-f]{2}){5}$");
		if( findpos != 0 )
		{
			alert("Invalid MAC address:" + macstr);
		}
		return findpos;
	}
	return 0;
}

function doCheckRepeatmacAddr()
{
	var inputValueTmp = document.QoS_Form.QoS_Bandwidth_Control_Mac.value;
	var inputValue = inputValueTmp.toUpperCase();

	for(var i =0; i<tableData.length; i++){
		if(tableData[i][2] == "N/A")
			continue;
		var tableValueTmp = tableData[i][2];
		var tableValue = tableValueTmp.toUpperCase();

		if(document.QoS_Form.QoS_Bandwidth_Control_mac_select[0].selected == true)
		{
			if (inputValue == tableValue)
			{
				alert("MAC repeat.");
				return 0;
			}
		}
		else
		{
			var j = document.QoS_Form.QoS_Bandwidth_Control_mac_select.selectedIndex;
			var inputValueTmp1 = document.QoS_Form.QoS_Bandwidth_Control_mac_select[j].value;
			var inputValue1 = inputValueTmp1.toUpperCase();
			if (inputValue1 == tableValue)
			{
				alert("MAC repeat.");
				return 0;
			}
		}
	}
	return 1;
}

function speedInputEnable()
{
	if ((document.QoS_Form.QoS_Bandwidth_Control_Mac.disabled == false) && document.QoS_Form.QoS_Bandwidth_Control_Mac.value != "")
	{
		if (doCheckRepeatmacAddr() == 1)
		{
			document.QoS_Form.QoS_Bandwidth_Control_Up.disabled = false;
			document.QoS_Form.QoS_Bandwidth_Control_Down.disabled = false;
			document.QoS_Form.QoS_Bandwidth_Control_Up.value = 0;
			document.QoS_Form.QoS_Bandwidth_Control_Down.value = 0;
		}
	}
	else
	{
		document.QoS_Form.QoS_Bandwidth_Control_Up.disabled = true;
		document.QoS_Form.QoS_Bandwidth_Control_Down.disabled = true;
	}
}

function macInputEnable()
{
	if (document.QoS_Form.QoS_Bandwidth_Control_Description.value != "")
	{
		//document.QoS_Form.QoS_Bandwidth_Control_mac_select.disabled = false;
		doMACaddressChange();
	}
	else
	{
		//document.QoS_Form.QoS_Bandwidth_Control_mac_select.disabled = true;
	}
}

function qosbandwidthinput_init()
{
	document.QoS_Form.QoS_Bandwidth_Control_mac_select.disabled = true;   
	document.QoS_Form.QoS_Bandwidth_Control_Mac.disabled = true;
	document.QoS_Form.QoS_Bandwidth_Control_Up.disabled = true;
	document.QoS_Form.QoS_Bandwidth_Control_Down.disabled = true;
}

function disableqos()
{
	if(document.QoS_Form.Qos_active[1].checked==true)
	{
		document.getElementById("hiddenqosfunction").style.display="none";
		document.getElementById("qos_rule").style.display="none";
	}
	else
	{
		document.getElementById("hiddenqosfunction").style.display="";
		if(qos_com_active == "1")
			document.getElementById("qos_rule").style.display="";
	}
}

function disableqosRule()
{
	if(document.QoS_Form.QosRuleActive[1].checked==true)
	{
		document.getElementById("qosRule").style.display="none";
	}
	else
	{
		document.getElementById("qosRule").style.display="";
	}
}

function doMACaddressChange()
{
	if(document.QoS_Form.QoS_Bandwidth_Control_mac_select[0].selected == true)
	{
		document.getElementById("ManuallyMacAddr").style.display=""; 
	}
	else{
		document.getElementById("ManuallyMacAddr").style.display="none";
	}
}


</script>

</head>
<body onload="init();" style="background:#4acbd6;">
<form METHOD="POST" ACTION="/cgi-bin/adv_qos.asp" name="QoS_Form" onsubmit="return verifyForm()">
<div id="pagestyle">
<div id="contenttype">
<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
		<tr height="25px" style="width:100%;background:#e6e6e6;">
			<td align=left class="title-main" style="width:250px;padding-left:20px;">
				Quality of Service</td>
		</tr>
	</table>

	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				QoS State </td>
			<td align=left class="tabdata">
				<input type="radio" name="Qos_active" value="1" onclick="enableAll();init();disableqos();"> Enable&nbsp;&nbsp;&nbsp;&nbsp; 
				<input type="radio" name="Qos_active" value="0" onclick="disableAll();disableqos();"> Disable 
				<script>
				if (qos_com_active == "1") {
					document.getElementsByName("Qos_active")[0].checked = true;
					document.getElementsByName("Qos_active")[1].checked = false;
				} else {
					document.getElementsByName("Qos_active")[0].checked = false;
					document.getElementsByName("Qos_active")[1].checked = true;
				}
			</script>
			</td>
		</tr>
	</table>
</div><!--id="block1" 12/19-->

<div id="hiddenqosfunction">
<script>
if(qos_com_active == "1")
	document.getElementById("hiddenqosfunction").style.display = "";
else
	document.getElementById("hiddenqosfunction").style.display = "none";
</script>
<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
		<tr height="25px" style="width:100%;background:#e6e6e6;">
			<td align=left class="title-main" style="width:250px;padding-left:20px;">
				Discipline Setting </td>
		</tr>
	</table>

	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
		<tr height="30px">
			<td align="left" class="tabdata" style="width:250px;padding-left:20px;">
			Uplink Bandwidth </td>
			<td align="left" class="tabdata">
				<input name="UplinkBandwidth" id="UplinkBandwidth" size="10" maxlength="30">(kbps)
				<script>
				document.getElementById("UplinkBandwidth").value = qos_com_upBW;
				</script>
			</td>
		</tr>
		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Discipline </td>
			<td align=left class="tabdata">
				<select name="Qosdiscipline" id="Qosdiscipline" size="1" onchange="onDisChanged()">
					<option value="WRR">WRR
					<option value="SP">Strict Priority
				</select>
				<script>
				document.getElementById("Qosdiscipline").value = qos_com_discipline;
				</script>
				<input type="hidden" name="qoSOptType" value="N/A">
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				WRR weight</td>
			<td align=left class="tabdata">
				Highest:<input type="text" id="QosWRRweight1" name="QosWRRweight1" size="1" maxlength="2">
				High:<input type="text" id="QosWRRweight2" name="QosWRRweight2" size="1" maxlength="2">
				Medium:<input type="text" id="QosWRRweight3" name="QosWRRweight3" size="1" maxlength="2">
				Low:<input type="text" id="QosWRRweight4" name="QosWRRweight4" size="1" maxlength="2">
				<script>
				document.getElementById("QosWRRweight1").value = qos_com_wwr_highest;
				document.getElementById("QosWRRweight2").value = qos_com_wwr_high;
				document.getElementById("QosWRRweight3").value = qos_com_wwr_medium;
				document.getElementById("QosWRRweight4").value = qos_com_wwr_low;
				</script>
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="padding-left:270px;white-space:nowrap;">
				(valid:1~15) 
			</td>
		</tr>
	</table>
</div><!--id="block1" 12/19-->
</div>
<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
		<tr height="25px">
			<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
				Click "Save" to save discipline setting </td>
		</tr>
	</table>

	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
		<tr height="40px" id="buttoncolor">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				<input type="button" class="button1" name="Qosdisciplinesave" value="Save" onClick="onClickQosDiscipline();">
				<input type="button" class="button1" name="Qos_Summary" value="Summary" onClick="onClickQosSummary();" style="display:none">
			</td>
			<td id="firstDiv0" style="float:left;"></td>
		</tr>
	</table>
</div><!--id="block1" 12/19-->

<div id="qos_rule" class="main_item">
<script>
if(qos_com_active == "1")
	document.getElementById("qos_rule").style.display="";
else
	document.getElementById("qos_rule").style.display="none";
</script>
<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
		<tr height="25px" style="width:100%;background:#e6e6e6;">
			<td align=left class="title-main" style="width:250px;padding-left:20px;">
				QOS Rule </td>
		</tr>
	</table>

	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Rule Index </td>
			<td align=left class="tabdata">
				<select name="QosRuleIndex" id="QosRuleIndex" size="1" onChange="doIndexChange()">
					<option value="0">0
					<option value="1">1
					<option value="2">2
					<option value="3">3
					<option value="4">4
					<option value="5">5
					<option value="6">6
					<option value="7">7
					<option value="8">8
					<option value="9">9
					<option value="10">10
					<option value="11">11
					<option value="12">12
					<option value="13">13
					<option value="14">14
					<option value="15">15
				</select>
				<script>
				document.getElementById("QosRuleIndex").value = webCurSet_qos_id;
				</script>
				<input type="hidden" name="QOS_Flag" value="0">
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Active </td>
			<td align=left class="tabdata" style="white-space:nowrap;">
				<input type="radio" name="QosRuleActive" value="1" onclick="formAppToPhyport(1);fromDMacToPriority(1);init();disableqosRule();"> Enable 
				&nbsp;&nbsp;&nbsp;&nbsp;<input type="radio" name="QosRuleActive" value="0" onclick="formAppToPhyport(0);fromDMacToPriority(0);disableqosRule();"> Disable 
					<script>
					if(qos_entry_active == "1") {
						document.getElementsByName("QosRuleActive")[0].checked = true;
						document.getElementsByName("QosRuleActive")[1].checked = false;
					} else {
						document.getElementsByName("QosRuleActive")[0].checked = false;
						document.getElementsByName("QosRuleActive")[1].checked = true;
					}
					</script>
			</td>
		</tr>
	</table>

<div id="qosRule">
<script>
if(qos_entry_active == "1")
	document.getElementById("qosRule").style.display = "";
else
	document.getElementById("qosRule").style.display = "none";
</script>
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Application </td>
			<td align=left class="tabdata">
				<select name="QosApp" id="QosApp" size="1" onChange="doQosAppIdxChange();">
					<option> 
					<option value="IGMP">
					IGMP
					<option value="MGCP">
					MGCP
					<option value="DNS">
					DNS
					<option value="DHCP">
					DHCP
					<option value="RIP">
					RIP
					<option value="RSTP">
					RSTP
					<option value="RTCP">
					RTCP
					<option value="RTP">
					RTP
				</select>
				<script>
				document.getElementById("QosApp").value = qos_entry_app;
				</script>
			</td>
		</tr>

	<div style="display:none">
		<tr style="display:none">
		<td width="250" class="tabdata" align=left>
			Physical Ports </td>
		<td width="470" height="39" class="tabdata">
			<table border="1" cellpadding="0" cellspacing="0" bordercolor="#CCCCCC">
				<tr>
					<td width="40" align=center><input type="CHECKBOX" name="QosPhyPortEth0" ></td>
					<td width="40" align=center><input type="CHECKBOX" name="QosPhyPortEth1" ></td>
					<td width="40" align=center><input type="CHECKBOX" name="QosPhyPortEth2" ></td>
					<td width="40" align=center><input type="CHECKBOX" name="QosPhyPortEth3" ></td>
			</tr>
			<tr class="tabdata">
				<td class="tabdata" align=center> eth0 </td>
				<td class="tabdata" align=center> eth1 </td>
				<td class="tabdata" align=center> eth2 </td>
				<td class="tabdata" align=center> eth3 </td>
				</table>
			</td>
		</tr>
	</div><!--delete end-->

		<tr style="display:none">
			<td class="light-orange">&nbsp;</td>
			<td class="light-orange"></td>
			<td class="tabdata" align=right> 
				Destination MAC </td>
			<td class="tabdata" align=center>:</td>
			<td class="tabdata">
				<input type="text" name="QosDestMacValue" size="17" maxlength="17" value="" onBlur="doMACcheck(this)">
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Destination IPv4/IPv6 </td>
			<td align=left class="tabdata">
				<input type="text" onblur=blockMask(0); name="QosDestIpValue" id="QosDestIpValue" size="39" maxlength="39">
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Mask/Prefix </td>
			<td align=left class="tabdata">
				<input type="text" name="QosDestMaskValue" id="QosDestMaskValue" size="15" maxlength="15">
				<script>
				var dip_array = qos_entry_dip.split("/");
				if(dip_array[0] != "N/A" && dip_array[0] != undefined)
					document.getElementById("QosDestIpValue").value = dip_array[0];
				if(dip_array[1] != "N/A" && dip_array[1] != undefined)
					document.getElementById("QosDestMaskValue").value = dip_array[1];
				</script>
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Port Range </td>
			<td align=left class="tabdata" style="white-space:nowrap;">
				<input type="text" name="QosDestPortValue1" id="QosDestPortValue1" size="3" maxlength="5" >~
				<input type="text" name="QosDestPortValue2" id="QosDestPortValue2" size="3" maxlength="5">
				<script>
				var dport_array = qos_entry_dport.split(":");
				if(dport_array[0] != "N/A" && dport_array[0] != undefined)
					document.getElementById("QosDestPortValue1").value = dport_array[0];
				if(dport_array[1] != "N/A" && dport_array[1] != undefined)
					document.getElementById("QosDestPortValue2").value = dport_array[1];
				</script>
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Source IPv4/IPv6 </td>
			<td align=left class="tabdata">
				<input type="text" onblur=blockMask(1); name="QosSrcIpValue" id="QosSrcIpValue" size="39" maxlength="39">
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Mask/Prefix </td>
			<td align=left class="tabdata">
				<input type="text" name="QosSrcMaskValue" id="QosSrcMaskValue" size="15" maxlength="15">
				<script>
				var sip_array = qos_entry_sip.split("/");
				if(sip_array[0] != "N/A" && sip_array[0] != undefined)
					document.getElementById("QosSrcIpValue").value = sip_array[0];
				if(sip_array[1] != "N/A" && sip_array[1] != undefined)
					document.getElementById("QosSrcMaskValue").value = sip_array[1];
				</script>
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Port Range </td>
			<td align=left class="tabdata" style="white-space:nowrap;">
				<input type="text" name="QosSrcPortValue1" id="QosSrcPortValue1" size="3" maxlength="5">~
				<input type="text" name="QosSrcPortValue2" id="QosSrcPortValue2" size="3" maxlength="5">
				<script>
				var sport_array = qos_entry_sport.split(":");
				if(sport_array[0] != "N/A" && sport_array[0] != undefined)
					document.getElementById("QosSrcPortValue1").value = sport_array[0];
				if(sport_array[1] != "N/A" && sport_array[1] != undefined)
					document.getElementById("QosSrcPortValue2").value = sport_array[1];
				</script>
			</td>
		</tr>

		<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Protocol ID </td>
		<td align=left class="tabdata">
			<select name="QosProtocol" id="QosProtocol" size="1">
				<option SELECTED>
				<option value="tcpudp">TCP/UDP
				<option value="tcp">TCP
				<option value="udp">UDP
				<option value="icmp">ICMP
			</select>
			<script>
			document.getElementById("QosProtocol").value = qos_entry_proto;
			</script>
			</td>
		</tr>

		<tr height="30px" style="display:none">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Source MAC </td>
			<td align=left class="tabdata">
				<input type="text" name="QosSrcMacValue" size="17" maxlength="17" value="" onBlur="doMACcheck(this)">
			</td>
		</tr>

		<tr height="30px" style="display:none;">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Vlan ID Range </td>
			<td align=left class="tabdata">
				<input type="text" name="QosVIDValue1" size="3" maxlength="5" value="">~
				<input type="text" name="QosVIDValue2" size="3" maxlength="5" value="">
			</td>
		</tr>

		<tr style="display:none">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				IPP/DS Field </td>
			<td align=left class="tabdata">
				<input type="radio" name="Qos_IPP_DSCP1" value="IPPTOS"  onclick="ornIppTosDscp(2);"> IPP/TOS &nbsp;&nbsp;
				<input type="radio" name="Qos_IPP_DSCP1" value="DSCP"  onclick="ornIppTosDscp(3)"> DSCP 
			</td>
		</tr>

		<tr style="display:none">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				IP Precedence Range </td>
			<td align=left class="tabdata">
				<select name="QosIPPValue1" size="1">
					<option>
					<option >0
					<option >1
					<option >2
					<option >3
					<option >4
					<option >5
					<option >6
					<option >7
				</select>~
				<select name="QosIPPValue2" size="1">
					<option>
					<option >0
					<option >1
					<option >2
					<option >3
					<option >4
					<option >5
					<option >6
					<option >7
				</select>
			</td>
		</tr>

		<tr style="display:none">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Type of Service </td>
			<td align=left class="tabdata">
				<select name="QosTOS" size="1">
					<option>
					<option value="Normal service" >Normal service
					<option value="Minimize delay" >Minimize delay
					<option value="Maximize throughput" >Maximize throughput
					<option value="Maximize reliability" >Maximize reliability
					<option value="Minimize monetary cost" >Minimize monetary cost
				</select>
			</td>
		</tr>

		<tr style="display:none">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			DSCP Range </td>
			<td align=left class="tabdata">
				<input type="text" name="QosDSCPValue1" size="3" maxlength="3" value="">~
				<input type="text" name="QosDSCPValue2" size="3" maxlength="3" value=""> (Value Range: 0 ~ 255; IPv4 Range is 0 ~ 63, or can't match) 
			</td>
		</tr>

		<tr height="30px" style="display:none">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				802.1p </td>
			<td align=left class="tabdata">
				<select name="Qos8021pValue1" size="1">
					<option>
					<option >0
					<option >1
					<option >2
					<option >3
					<option >4
					<option >5
					<option >6
					<option >7
				</select>~
				<select name="Qos8021pValue2" size="1">
					<option>
					<option >0
					<option >1
					<option >2
					<option >3
					<option >4
					<option >5
					<option >6
					<option >7
				</select>
			</td>
		</tr>

		<tr height="30px" style="display:none">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Active </td>
			<td class="tabdata"><hr  class="light-gray-line"></td>
			<td class="tabdata"><hr  class="light-gray-line"></td>
		</tr>

		<tr height="30px" style="display:none">
			<td class="light-orange">&nbsp;</td>
			<td class="light-orange"></td>
			<td class="tabdata" align=right> IPP/DS Field </td>
			<td class="tabdata" align=center>:</td>
			<td class="tabdata">
				<input type="radio" name="Qos_IPP_DSCP2" value="IPPTOS"
				 onclick="reIppTosDscp(2);"> IPP/TOS &nbsp;&nbsp;
				<input type="radio" name="Qos_IPP_DSCP2" value="DSCP"
				 onclick="reIppTosDscp(3);"> DSCP 
			</td>
		</tr>

		<tr height="30px" style="display:none">
			<td class="light-orange">&nbsp;</td>
			<td class="light-orange"></td>
			<td class="tabdata" align=right> IP Precedence Remarking </td>
			<td class="tabdata" align=center>:</td>
			<td class="tabdata">
				<select name="QosReIPPValue" size="1">
					<option>
					<option >0
					<option >1
					<option >2
					<option >3
					<option >4
					<option >5
					<option >6
					<option >7
				</select>
			</td>
		</tr>

		<tr height="30px" style="display:none">
			<td class="light-orange">&nbsp;</td>
			<td class="light-orange"></td>
			<td class="tabdata" align=right> Type of Service Remarking </td>
			<td class="tabdata" align=center>:</td>
			<td class="tabdata">
				<select name="QosReTOS" size="1">
					<option SELECTED>
					<option value="Normal service" >Normal service
					<option value="Minimize delay" >Minimize delay
					<option value="Maximize throughput" >Maximize throughput
					<option value="Maximize reliability" >Maximize reliability
					<option value="Minimize monetary cost" >Minimize monetary cost
				</select>
			</td>
		</tr>

		<tr height="30px" style="display:none">
			<td class="light-orange">&nbsp;</td>
			<td class="light-orange"></td>
			<td class="tabdata" align=right> DSCP Remarking </td>
			<td class="tabdata" align=center>:</td>
			<td class="tabdata">
				<input type="text" name="QosReDSCPValue" size="3" maxlength="3" value=
				""> (Value Range: 0 ~ 255; IPv4 Range is 0 ~ 63, or can't remark) 
			</td>
		</tr>

		<tr height="30px" style="display:none">
			<td class="light-orange">&nbsp;</td>
			<td class="light-orange"></td>
			<td class="tabdata" align=right> 802.1p Remarking </td>
			<td class="tabdata" align=center>:</td>
			<td class="tabdata">
				<select name="Qos8021pReValue" size="1">
					<option>
					<option >0
					<option >1
					<option >2
					<option >3
					<option >4
					<option >5
					<option >6
					<option >7
				</select>
				<select name="Qos8021pReApp" size="1" onchange="doQos1pAppIdxChange();">
					<option>
					<option value="Key Net Traffic(RIP, OSPF)" >Key Net Traffic(RIP, OSPF)
					<option value="Voice" >Voice
					<option value="Video" >Video
					<option value="IGMP" >IGMP
					<option value="Key Data" >>Key Data
				</select>
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Queue </td>
			<td align=left class="tabdata">
				<select name="QosConfigPriority" id="QosConfigPriority" size="1">
					<option>
					<option value="4">Low
					<option value="3">Medium
					<option value="2">High
					<option value="1">Highest
				</select>
				<script>
				document.getElementById("QosConfigPriority").value = qos_entry_actQue;
				</script>
			</td>
		</tr>
	</table>
</div><!--id=qosRule 2/26-->
</div><!--id="block1" 12/19-->

<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
		<tr height="25px">
			<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
			Click "Add" to add qos rule setting or click "Delete" to delete qos rule setting </td>
		</tr>
	</table>

	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
		<tr height="40px" id="buttoncolor">
			<td width="250px" align=left class="tabdata" style="padding-left:20px;">
				<input type="SUBMIT" class="button1" name="QoS_Add" value="Add" onClick="doAdd();">
				<input type="SUBMIT" class="button1" name="QoS_Del" value="Delete" onClick="doDel();">

				<input type="hidden" name="QosMBSSIDNumberFlag" value="8"><!--WLan_Common BssidNum <-> wireless.radio0.bssidnum-->
				<input type="hidden" name="Qos11acMBSSIDNumberFlag" value="8"><!--WLan11ac_Common BssidNum <-> wireless.radio1.bssidnum-->
				<input type="hidden" name="QoS1PortFlag" value="N/A"><!--WebCustom_Entry isZY1PSupported-->
				<input type="hidden" name="QoS2PortsFlag" value="N/A"><!--WebCustom_Entry is2PSupported-->
				<input type="hidden" name="wlanISExist" ID="IDwlanISExist" value="On"><!--Info_WLan isExist-->
				<input type="hidden" name="wlan11acISExist" ID="IDwlan11acISExist" value="On"><!--Info_WLan isExist-->
				<input type="hidden" name="UserMode" value="0"> <!--WebCustom_Entry isC2TrueSupported Yes-0-->
				<input type="hidden" name="WlanPort_1" value="No"> 
				<input type="hidden" name="WlanPort_2" value="No"> 
				<input type="hidden" name="WlanPort_3" value="No"> 
				<input type="hidden" name="QoS_Bandwidth_Control_Mac_WithOut_Colon" value="">
			</td>
			<td id="firstDiv1" style="float:left;"></td>
		</tr>
	</table>
</div><!--id="block1" 12/19-->
</div><!--id="qos_rule"-->

<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
		<tr height="25px" style="width:100%;background:#e6e6e6;">
			<td align=left class="title-main" style="width:250px;padding-left:20px;">
			Bandwidth Control </td>
		</tr>
	</table>

	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
			Description </td>
			<td align=left class="tabdata">
				<input name="QoS_Bandwidth_Control_Description" size="32" maxlength="30" value="" placeholder="PC" Onclick="doMACaddressChange()">
			</td>
		</tr>
		<tr height="30px">
			<input type="hidden" name="MacAddFlag" value="0">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">LAN Device </td>
			<td align=left class="tabdata">
				<select name="QoS_Bandwidth_Control_mac_select" id="QoS_Bandwidth_Control_mac_select" size="1" onchange="doMACaddressChange()">
					<option value="0" selected >Manaually Enter MAC Address
					<script>
						var index = 0;
						for(index=0; index < 8; index++)
						{
							if(typeof window['lanhost_' + index + '_ip'] !== 'undefined')
							{
								var option = document.createElement("option");
								option.value = window['lanhost_' + index + '_mac'];
								//option.text = window[lanhostNames[index]];
								option.appendChild(document.createTextNode(window['lanhost_' + index + '_ip']+" - "+window['lanhost_' + index + '_mac']));
								document.getElementById("QoS_Bandwidth_Control_mac_select").appendChild(option);
							}
						}
					</script> 
				</select>
			</td>
		</tr>

		<tr id="ManuallyMacAddr" height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				MAC Address </td>
			<td align=left class="tabdata">
				<input name="QoS_Bandwidth_Control_Mac" size="18"  maxlength="24" value="" placeholder="11:22:33:44:55:66"> 
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				UP Stream </td>
			<td align=left class="tabdata">
				<input type="number" name="QoS_Bandwidth_Control_Up" size="6" maxlength="6" value="" min="1" placeholder="0" onkeyup="(this.v=function(){this.value=this.value.replace(/[^0-9-]+/,'');}).call(this)" onblur="this.v();">  (Mbps) 
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;"></td>
			<td align=left class="tabdata"> 
			(Speeds ranging from 1-800)
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				Down Stream </td>
			<td align=left class="tabdata">
				<input type="number" name="QoS_Bandwidth_Control_Down" size="6" maxlength="6"  value="" min="1" placeholder="0" onkeyup="(this.v=function(){this.value=this.value.replace(/[^0-9-]+/,'');}).call(this)" onblur="this.v();"> (Mbps)
			</td>
		</tr>

		<tr height="30px">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;"></td>
			<td align=left class="tabdata"> 
			(Speeds ranging from 1-800)
			</td>
		</tr>
	</table>
</div><!--id="block1" 12/19-->

<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
		<tr height="25px">
			<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
		Click "Add" to add bandwidth control setting</td>
		</tr>
	</table>

	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
		<tr height="30px" id="buttoncolor">
			<td align=left class="tabdata" style="width:250px;padding-left:20px;">
				<input type="button" class="button1" name="QoS_Bandwidth_Control_Add" value="Add" onClick="doAddRule();">
			</td>
			<td id="firstDiv2" style="float:left;"></td>
		</tr>
	</table>
</div><!--id="block1" 12/19-->

<div id="block2" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
		<tr height="25px" style="width:100%;background:#e6e6e6;">
			<td class="title-main" align=left style="padding-left:20px;">Bandwidth Control List</td> 
		</tr>
	</table>

	<table width="640" border="0" cellpadding="0" cellspacing="0" style="table-layout: fixed;">
		<tr>
			<td align=center class="tabdata">
				<input type="hidden" name="delnum">
				<input type="hidden" name="addNum" value="">
				<div class="configstyle">
					<div id=qosBandwidthControl></div>
				</div>
			</td>
		</tr>
	</table>
</div><!--id="block2" 12/19-->
</div><!--id="contenttype"-->
</div><!--id="pagestyle" 12/19-->

<script language=JavaScript>

function getMacWithColon(txtString) 
{
	var i = 0;
	var len = txtString.length;
	var result = "";
	if(txtString == "N/A" || len != 12)
		return txtString
	for(var i = 0; i < len ; i++ )
	{
		if(i % 2 == 0 && i != 0)
			result =result + ':';
		result = result + txtString[i];
	}
	return result;
}

var tableHeader = [
	["8%","Index"],
	["14%","Description"],
	["17%","MAC Address"],
	["22%","UP Stream(Mbps)"],
	["23%","Down Stream(Mbps)"],
	["16%","Edit"]
];

var tableData = [];
var index = 0;
for(index = 0; index < 10; index++)
{
	if(typeof window['maxBW_' + index + "_mac"] !== 'undefined')
	{
		tableData.push([index +1,window['maxBW_' + index + "_description"],window['maxBW_' + index + "_mac"],window['maxBW_' + index + "_upRate"],window['maxBW_' + index + "_downRate"],index]);
	}
}
/*var tableData = [
	["1", "",getMacWithColon(""),"","","0"],
	["2", "",getMacWithColon(""),"","","1"],
	["3", "",getMacWithColon(""),"","","2"],
	["4", "",getMacWithColon(""),"","","3"],
	["5", "",getMacWithColon(""),"","","4"],
	["6", "",getMacWithColon(""),"","","5"],
	["7", "",getMacWithColon(""),"","","6"],
	["8", "",getMacWithColon(""),"","","7"],
	["9", "",getMacWithColon(""),"","","8"],
	["10", "",getMacWithColon(""),"","","9"]
];*/

showTable('qosBandwidthControl',tableHeader,tableData,2);

</script>
</form>
</body>
</html>
