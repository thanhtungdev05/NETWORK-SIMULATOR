

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
<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" type="text/javascript" src="/jsl.js"></script>
<script language="JavaScript" type="text/javascript" src="/val.js"></script>
<script language="JavaScript" type="text/javascript" src="/pvc.js"></script>
<script language="JavaScript" type="text/javascript" src="/ip.js"></script>
<script language="JavaScript" type='text/javascript' src="/ip_new.js"></script>
<script type="text/javascript" src="/spin.js" ></script>
<style>
*{color:  #404040;}

</style>
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
function removeCookie()
{
		var mydate = new Date();
		mydate.setTime(mydate.getTime() - 1);
		
				document.cookie = "uid=del;path=/; expires=" + mydate.toGMTString(); 
				document.cookie = "psw=del;path=/; expires=" + mydate.toGMTString(); 
		
		//parent.location.href = "../";
}
function showTable(id,header,data,keyIndex){
	var html = ["<table id=client_list width=580 border=1 cellpadding=1 cellspacing=0  bordercolor=#CCCCCC bgcolor=#FFFFFF>"];
	// 1.generate table header
	html.push("<tr>");
	for(var i =0; i<header.length; i++){
		html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +"</font></strong>"+ "</td>");
	}
	html.push("</tr>");
	// 2.generate table data
	for(var i =0; i<data.length; i++){
		if(data[i][keyIndex] != "N/A"){
			html.push("<tr>");
			for(var j=0; j<data[i].length; j++){
				html.push("<td align=center class=tabdata>" + data[i][j] + "</td>");
			}
			html.push("</tr>");
		}
	}
	html.push("</table>");
	if(parseInt(document.uiViewLanForm.LeaseNum.value)>10)
	{
		html.push("<input type=button name=MORE  value=More... onClick=javascript:window.open(\"/cgi-bin/more_client_list.asp\")>")
	}
	document.getElementById(id).innerHTML = html.join('');
}

function doDelete(i)
{
	document.uiViewLanForm.delnum.value=i;
	document.uiViewLanForm.submit();
}


function checkPhysicalPort(){

	if(document.forms[0].DHCPPhyPortEth0.checked)
		document.forms[0].DHCPPhyPortEth0.value = "Yes";
	else
		document.forms[0].DHCPPhyPortEth0.value = "No";
		
	if (document.forms[0].DHCP1PortsFlag.value != "Yes" && document.forms[0].DHCPZY1PortsFlag.value != "Yes")
		if(document.forms[0].DHCPPhyPortEth1.checked)
			document.forms[0].DHCPPhyPortEth1.value = "Yes";
		else
			document.forms[0].DHCPPhyPortEth1.value = "No";
		
	if (   document.forms[0].DHCP2PortsFlag.value != "Yes" 
			&& document.forms[0].DHCP1PortsFlag.value != "Yes" 
			&& document.forms[0].DHCPZY1PortsFlag.value != "Yes") 
	{
		if(document.forms[0].DHCPPhyPortEth2.checked)
			document.forms[0].DHCPPhyPortEth2.value = "Yes";
		else
			document.forms[0].DHCPPhyPortEth2.value = "No";		
			
		if(document.forms[0].DHCPPhyPortEth3.checked)
			document.forms[0].DHCPPhyPortEth3.value = "Yes";
		else
			document.forms[0].DHCPPhyPortEth3.value = "No";
	}
/*		
	if(document.forms[0].DHCPPhyPortUsb0.checked)
		document.forms[0].DHCPPhyPortUsb0.value = "Yes";
	else
		document.forms[0].DHCPPhyPortUsb0.value = "No";

*/
	if (document.forms[0].wlanISExist.value == "On") {
		if (document.forms[0].DHCPMBSSIDNumberFlag.value == "1") {	
			if(document.forms[0].DHCPPhyPortRa0.checked)
				document.forms[0].DHCPPhyPortRa0.value = "Yes";
			else
				document.forms[0].DHCPPhyPortRa0.value = "No";
		}
		if(document.forms[0].DHCPMBSSIDNumberFlag.value == "2"){
			if(document.forms[0].DHCPPhyPortWLANMssid0.checked)
				document.forms[0].DHCPPhyPortWLANMssid0.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLANMssid0.value = "No"

			if(document.forms[0].DHCPPhyPortWLANMssid1.checked)
				document.forms[0].DHCPPhyPortWLANMssid1.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLANMssid1.value = "No"
														
		}
		if(document.forms[0].DHCPMBSSIDNumberFlag.value == "3"){
			if(document.forms[0].DHCPPhyPortWLANMssid0.checked){
				document.forms[0].DHCPPhyPortWLANMssid0.value = "Yes"
			}
			else
				document.forms[0].DHCPPhyPortWLANMssid0.value = "No"

			if(document.forms[0].DHCPPhyPortWLANMssid1.checked)
				document.forms[0].DHCPPhyPortWLANMssid1.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLANMssid1.value = "No"
																	
			if(document.forms[0].DHCPPhyPortWLANMssid2.checked)
				document.forms[0].DHCPPhyPortWLANMssid2.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLANMssid2.value = "No"
		}
		if(document.forms[0].DHCPMBSSIDNumberFlag.value == "4"){	
			if(document.forms[0].DHCPPhyPortWLANMssid0.checked){	
				document.forms[0].DHCPPhyPortWLANMssid0.value = "Yes"
			}
			else
				document.forms[0].DHCPPhyPortWLANMssid0.value = "No"

			if(document.forms[0].DHCPPhyPortWLANMssid1.checked)
				document.forms[0].DHCPPhyPortWLANMssid1.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLANMssid1.value = "No"
																	
			if(document.forms[0].DHCPPhyPortWLANMssid2.checked)
				document.forms[0].DHCPPhyPortWLANMssid2.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLANMssid2.value = "No"
			if(document.forms[0].DHCPPhyPortWLANMssid3.checked)
				document.forms[0].DHCPPhyPortWLANMssid3.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLANMssid3.value = "No"
		}
	}
	if (document.forms[0].wlan11acISExist.value == "On") {
		if (document.forms[0].DHCPMBSSID11acNumberFlag.value == "1") {	
			if(document.forms[0].DHCPPhyPortRai0.checked)
				document.forms[0].DHCPPhyPortRai0.value = "Yes";
			else
				document.forms[0].DHCPPhyPortRai0.value = "No";
		}
		if(document.forms[0].DHCPMBSSID11acNumberFlag.value == "2"){
			if(document.forms[0].DHCPPhyPortWLAN11acMssid0.checked)
				document.forms[0].DHCPPhyPortWLAN11acMssid0.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLAN11acMssid0.value = "No"
			if(document.forms[0].DHCPPhyPortWLAN11acMssid1.checked)
				document.forms[0].DHCPPhyPortWLAN11acMssid1.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLAN11acMssid1.value = "No"
		}
		if(document.forms[0].DHCPMBSSID11acNumberFlag.value == "3"){
			if(document.forms[0].DHCPPhyPortWLAN11acMssid0.checked){
				document.forms[0].DHCPPhyPortWLAN11acMssid0.value = "Yes"
			}
			else
				document.forms[0].DHCPPhyPortWLAN11acMssid0.value = "No"
			if(document.forms[0].DHCPPhyPortWLAN11acMssid1.checked)
				document.forms[0].DHCPPhyPortWLAN11acMssid1.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLAN11acMssid1.value = "No"
			if(document.forms[0].DHCPPhyPortWLAN11acMssid2.checked)
				document.forms[0].DHCPPhyPortWLAN11acMssid2.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLAN11acMssid2.value = "No"
		}
		if(document.forms[0].DHCPMBSSID11acNumberFlag.value == "4"){	
			if(document.forms[0].DHCPPhyPortWLAN11acMssid0.checked){	
				document.forms[0].DHCPPhyPortWLAN11acMssid0.value = "Yes"
			}
			else
				document.forms[0].DHCPPhyPortWLAN11acMssid0.value = "No"
			if(document.forms[0].DHCPPhyPortWLAN11acMssid1.checked)
				document.forms[0].DHCPPhyPortWLAN11acMssid1.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLAN11acMssid1.value = "No"
			if(document.forms[0].DHCPPhyPortWLAN11acMssid2.checked)
				document.forms[0].DHCPPhyPortWLAN11acMssid2.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLAN11acMssid2.value = "No"
			if(document.forms[0].DHCPPhyPortWLAN11acMssid3.checked)
				document.forms[0].DHCPPhyPortWLAN11acMssid3.value = "Yes"
			else
				document.forms[0].DHCPPhyPortWLAN11acMssid3.value = "No"
		}
	}
}

function StringCheck(val)
{
    re = /^[^\s]+$/;
    if( re.test(val) )
        return true;
    else
        return false;
}

function doCheckmacAddr(){
	var macstr = document.uiViewLanForm.MACAddr.value;
var maclen = macstr.length;
	var tmp = macstr.toUpperCase();
	document.uiViewLanForm.MACAddr.value = tmp;
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
function doUserModeUiMgmtIpValidate()
{
    var value;
    var value_temp;
    
    value = document.uiViewLanForm.uiViewIPAddr.value;
    value_temp = document.uiViewLanForm.uiViewNetMask.value;
    if(inValidNetAddr(value,value_temp))
        return false;
    	
	
	value = document.uiViewLanForm.isIPv6Supported.value;
	if(value == 1){
		//check if IPv6 address/prefix field is not inputed
		if(document.uiViewLanForm.uiViewIPv6Addr.value != "" || document.uiViewLanForm.uiViewIPv6Prefix.value != ""){
			//check IPv6 Address format	
			value = document.uiViewLanForm.uiViewIPv6Addr.value;	
			if(inValidIPv6Addr(value))
				return false;	
			if(false == isGlobalIpv6Address(value)){
				alert('Invalid IPv6 GlobalAddress:' + value);
				return false;
			}
	
			//check IPv6 Prefix format
			value = document.uiViewLanForm.uiViewIPv6Prefix.value;
			if(inValidIPv6Prefix(value))
				return false;
		}
	}
	
				        
	if("Yes" == document.uiViewLanForm.aliasFlag.value)
	{	
		var mask = document.uiViewLanForm.uiViewNetMask.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
		var digits2 = mask[0].split(".");
		var lanip = document.uiViewLanForm.uiViewIPAddr.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
		var digits3 = lanip[0].split(".");
		
		value = document.uiViewLanForm.uiViewAliasIPAddr.value;
        value_temp = document.uiViewLanForm.uiViewAliasNetMask.value;
        if(inValidNetAddr(value,value_temp))
             return false;
		var mask = document.uiViewLanForm.uiViewAliasNetMask.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
		var digits4 = mask[0].split(".");
		var lanip = document.uiViewLanForm.uiViewAliasIPAddr.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
		var digits5 = lanip[0].split("."); 
			
		if(document.uiViewLanForm.uiViewIPAddr.value == document.uiViewLanForm.uiViewAliasIPAddr.value)
		{
			alert("Alias ip duplicate to Main ip!" );
			return false;
		}
		
		for(i=0;i<4;i++)
		{
			if((digits3[i] & digits2[i])!= (digits5[i] & digits2[i]))
				break;
		}
		if(i==4)
		{
			 alert("Alias IP is not allowed to be in the main ip subnet!");
			 return false; 
		}
		
		for(i=0;i<4;i++)
		{
			if((digits3[i] & digits4[i])!= (digits5[i] & digits4[i]))
				break;
		}
		if(i==4)
		{
			 alert("Main IP is not allowed to be in the alias ip subnet!");
			 return false; 
		}
	}
}
function doAdminUiMgmtIpValidate()
{
	var value;

	if(document.uiViewLanForm.dhcpTypeRadio[1].checked)    
	 {
    	value = document.uiViewLanForm.StartIp.value;
    	if(inValidIPAddr(value))
        return false;
		if("Yes" == document.uiViewLanForm.aliasFlag.value)
		{
			if(!doPoolRangeAlias())
				return false;
		}
		else
		{
      if(!doPoolRange())
        return false;
		}
		
		/* set physical port value */
		if ("Yes" == document.uiViewLanForm.DHCPFilterFlag.value)
			checkPhysicalPort();
		
      	if("Yes" == document.uiViewLanForm.option60Flag.value)
	{	
		value = document.uiViewLanForm.ConPoolStartIp.value;
		if(inValidIPAddr(value))
			return false;

		value = document.uiViewLanForm.ConPoolPoolSize.value;
    		if(value.match("[^0-9]") != null) {
        		alert("IP Conditional Pool Count needs to be an positive integer");
       	 		return false;
    		}
    		
         	if(!doConditionalPoolRange())
        		return false;
			
	}
	
      if(document.uiViewLanForm.dnsTypeRadio[1].checked)
      {  
      	value = document.uiViewLanForm.PrimaryDns.value;
    	if(inValidIPAddr(value))
        	return false;  
          
      	value = document.uiViewLanForm.SecondDns.value;
    	if(inValidIPAddr(value))
        	return false;  
      } 
      if(doValidateServer())
      	return false;  

	
	if(StringCheck(document.uiViewLanForm.IpAddr.value) || StringCheck(document.uiViewLanForm.MACAddr.value))
		{
			if(document.uiViewLanForm.emptyEntry.value == "N/A")
			{
				alert("DHCP reservation table is full!" );
				return false;
			} 
			value = document.uiViewLanForm.IpAddr.value;
			if(inValidIPAddr(value))
			return false; 
				
			if(doCheckmacAddr())
			return false;	
			
			if(!doStaticTableRange())
			return false;			
				
			document.uiViewLanForm.addFlag.value = "1";
		}
		if(document.uiViewLanForm.staticNum.value != "0"){
		if(document.uiViewLanForm.tmpStartIp.value != document.uiViewLanForm.StartIp.value)
		{
			if(confirm("Change Start Ip may lead to reservation item be deleted!\nContinue?") == false)
				return false;
		}
		if(document.uiViewLanForm.tmpPoolCount.value != document.uiViewLanForm.PoolSize.value)
		{
			if(confirm("Change Ip pool count may lead to reservation item be deleted!\nContinue?") == false)
				return false;
		}
		}
                
    }
    if(document.uiViewLanForm.dhcpTypeRadio[2].checked)
    {
    	value = document.uiViewLanForm.ServerIp.value;
    	 if(inValidIPAddr(value))
    	 	return false;
    }
}
function uiMgmtIpDoValidate() {
	if(doUserModeUiMgmtIpValidate()==false)
		return false;

	if(document.uiViewLanForm.userMode.value != 1)
	{
		if(doAdminUiMgmtIpValidate()==false)
			return false;
	}
 
    return true;
}
function reloadAdminAction()
{
	if(!dhcpRelayCheck()){
		return false;
	}
	
	onloadCheck();
	
	if(document.uiViewLanForm.dhcpTypeRadio[0].checked)
	{
		document.getElementById("dhcp_enabled_div0").style.display="none";
		document.getElementById("dhcp_relay_div").style.display="none";
		
	}
	else if(document.uiViewLanForm.dhcpTypeRadio[1].checked)
	{
		document.getElementById("dhcp_enabled_div0").style.display="";
		document.getElementById("dhcp_relay_div").style.display="none";
		
	}
	else if(document.uiViewLanForm.dhcpTypeRadio[2].checked)
	{
		document.getElementById("dhcp_enabled_div0").style.display="none";
		document.getElementById("dhcp_relay_div").style.display="";
		
	}
	
	else
	;
	
	return;
}
function reloadUsermodeAction()
{
	return;
}
function doReload() {
	reloadUsermodeAction();

	if(document.uiViewLanForm.userMode.value !=1){
		reloadAdminAction();
	}
 
	return;
}

function doUserModeDispaly()
{
	return;
}
function doAdminDispaly()
{


	
	{
		document.getElementById("dhcp_enabled_div0").style.display="";
		document.getElementById("dhcp_relay_div").style.display="none";
		
	}
	

	
	
	
	return;
}
function doDisplay() {
	doUserModeDispaly();
	if(document.forms[0].userMode.value != 1)
	{
		doAdminDispaly();
	}
	return;
}
function doValidateRange(startIP,endIP) {
    var staddress;
    var edaddress;
    var cnt;

    staddress=startIP.split(".");
    edaddress=endIP.split(".");
    for(cnt=0; cnt < 4; cnt++) {
        if(Number(edaddress[cnt])<Number(staddress[cnt])) {
            alert("End IP address is less than Start IP address");
	return false;
}
    }
    return true;
}

function doValidateServer() {
    var Element;
    var ElementValue;

    Element = document.uiViewLanForm.PoolSize;
    ElementValue = Element.value;
    if(ElementValue.match("[^0-9]") != null) {
        alert("IP Pool Count needs to be an positive integer");
        return true;
    }
    Element = document.uiViewLanForm.dhcp_LeaseTime;
    ElementValue = Element.value;
    if(ElementValue.match("[^0-9]") != null) {
        alert("Lease Time needs to be an positive integer");
        return true;
    }
    if(!StringCheck(ElementValue))
	{
		alert("Empty Lease Time!!");
		return true;
	}
	if(ElementValue < 30 && ElementValue != 0)
	{
		alert("Lease Time needs to be no less than 30");
		return true;
	}
	if(!parseInt(ElementValue))
		document.uiViewLanForm.dhcp_LeaseTime.value = 259200;
    Element = document.uiViewLanForm.StartIp;
    ElementValue = Element.value;
    if(inValidIPAddr(Element.value)) return true;
    if(doValidateRange(ElementValue,Element.value)!=true) return true;
	return false;
}

function poolcheck(st,pool,value,Mvalue){
	if( (pool > 254) || (st+pool) > ((Mvalue & st) + value - 1) )
	{
	//mtk04880: for resolving bug 12324 : showing alert twice
	//  alert("DHCP IP Pool Range exceed limit!!");
		return false;
	}else
	{
		return true;
	}
}
function ip_poolcheck(st,pool,Mvalue,rouip,aMvalue,aip){
	var digits1 = st[0].split(".");
	var stIP = parseInt(digits1[0]<<24|digits1[1]<<16|digits1[2]<<8|digits1[3]);
	var digits2 = Mvalue[0].split(".");
	var maskvalue = parseInt(digits2[0]<<24|digits2[1]<<16|digits2[2]<<8|digits2[3]);
	var digits3 = rouip[0].split(".");
	var lanipvalue = parseInt(digits3[0]<<24|digits3[1]<<16|digits3[2]<<8|digits3[3]);
	var digits4 = aMvalue[0].split(".");
	var amaskvalue = parseInt(digits4[0]<<24|digits4[1]<<16|digits4[2]<<8|digits4[3]);
	var digits5 = aip[0].split(".");
	var aipvalue = parseInt(digits5[0]<<24|digits5[1]<<16|digits5[2]<<8|digits5[3]);

	var tmpipvalue = 1;
	var tmpmaskvalue = 1;
	
	if((lanipvalue&maskvalue)==(stIP&maskvalue)){
		tmpipvalue = lanipvalue;
		tmpmaskvalue = maskvalue;
	}else if((aipvalue&amaskvalue)==(stIP&amaskvalue)){
		tmpipvalue = aipvalue;
		tmpmaskvalue = amaskvalue;
	}else
		return false;
	
 	if(((tmpipvalue&(~tmpmaskvalue))>=(stIP&(~tmpmaskvalue))) && ((tmpipvalue&(~tmpmaskvalue))<((stIP&(~tmpmaskvalue))+pool)))
	{
		return false;
	}else
	{
		return true;
	}
} 
function checkPoolOverlap(startIP1, num1, startIP2, num2)
{
	var digits1 = startIP1[0].split(".");
	var digits2 = startIP2[0].split(".");
	for(i=0;i<4;i++)
	{
		if(parseInt(digits1[i]) < parseInt(digits2[i]))
		{
			if(parseInt(digits1[3])+num1-1 >= parseInt(digits2[3]))
				return true;
			else
				return false;
		}
		if(parseInt(digits1[i]) > parseInt(digits2[i]))
		{
			if(parseInt(digits2[3])+num2-1 >= parseInt(digits1[3]))
				return true;
			else
				return false;
		}
	}
	return true;
}


function doStaticTableRange()
{
	var sIP = document.uiViewLanForm.StartIp.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
  	var digits = sIP[0].split(".");
	var num = document.uiViewLanForm.PoolSize.value.match("^[0-9]{1,3}$");
	var mask = document.uiViewLanForm.uiViewNetMask.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits2 = mask[0].split(".");	
	var staticIP = document.uiViewLanForm.IpAddr.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
  	var staticdigits = staticIP[0].split(".");
	
	var stIP = parseInt(digits[3]);
	var Pool_num = parseInt(num);
	var staticIP = parseInt(staticdigits[3]);
	var isIpValid = 1;
	var total = parseInt(document.uiViewLanForm.staticNum.value);
	var leaseTotal = parseInt(document.uiViewLanForm.LeaseNum.value);
	
	for(i=0;i<4;i++)
	{
	  if((digits2[i] & digits[i]) != (digits2[i] & staticdigits[i])){	
			isIpValid = 0;
			break;
		}
	}
	if("Yes" == document.uiViewLanForm.aliasFlag.value){
		var mask = document.uiViewLanForm.uiViewAliasNetMask.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
		var digits3= mask[0].split(".");
		if(isIpValid == 0){
		for(i=0;i<4;i++)
		{
		  if((digits3[i] & digits[i]) != (digits3[i] & staticdigits[i])){	
				isIpValid = 0;
				break;
			}
		}
		}
	}
	if(isIpValid == 0){
		alert("DHCP Start IP and DHCP Static IP are not in the same subnet");                                   						
		return false;
	}
	
    if( staticIP <  stIP || staticIP >= stIP+Pool_num)
	{
	   alert("DHCP Static IP is out of DHCP pool range!");
	return false;
	}


	var table=document.getElementById("static_list");
	for(j=1; j<=total; j++)
	{	
		var str1 = table.rows[j].cells[1].innerHTML.replace(" ","");
		var str2 = table.rows[j].cells[2].innerHTML.replace(" ","");
		if( str1 == document.uiViewLanForm.IpAddr.value)
		{
			   alert("DHCP Static IP has existed in the list!");
			 return false;
		 }
		 if(str2 == document.uiViewLanForm.MACAddr.value)
		{
			   alert("DHCP Static MAC address has existed in the list!");
			 return false;
		 }
	}
/*	
	var table=document.getElementById("client_list").contentWindow.document.getElementById("dhcplist");
	
	for(j=1; j<=leaseTotal; j++)
	{	
		if(table.rows[j].cells[2].innerText == document.uiViewLanForm.IpAddr.value)
		{
			   alert("DHCP Client IP has existed in the list!");
			 return false;
		 }
		 if(table.rows[j].cells[3].innerText == document.uiViewLanForm.MACAddr.value)
		{
			   alert("DHCP Client MAC address has existed in the list!");
			 return false;
		 }
	}
*/
	return true;
}

function doPoolRange()
{
	var sIP = document.uiViewLanForm.StartIp.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits = sIP[0].split(".");
 	var num = document.uiViewLanForm.PoolSize.value.match("^[0-9]{1,3}$");
	var mask = document.uiViewLanForm.uiViewNetMask.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits2 = mask[0].split(".");
	var lanip = document.uiViewLanForm.uiViewIPAddr.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits3 = lanip[0].split(".");
  
	var amask = document.uiViewLanForm.uiViewAliasNetMask.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var aip = document.uiViewLanForm.uiViewAliasIPAddr.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");

	var stIP = parseInt(digits[3]);
	var Pool_num = parseInt(num);
	var Mask = parseInt(digits2[3]);
	
	if(!StringCheck(document.uiViewLanForm.PoolSize.value))
	{
		alert("Empty IP Pool Count!!");
		return false;
	}
  if(document.uiViewLanForm.uiViewIPAddr.value == document.uiViewLanForm.StartIp.value)
	{
		alert("DHCP Start IP and Router Local IP are not allowed to be the same");   	                                   								
		return false;
	}
	
	for(i=0;i<4;i++)
	{
	  if((digits2[i] & digits3[i]) != (digits2[i] & digits[i]))
		{
			alert("DHCP Start IP and Router Local IP are not in the same subnet");                                   						
			return false;
		}
	}
		
  if( (digits2[0]== 255) && (digits2[1] == 255) && (digits2[2] == 255) )
	{
		for( n=0; n<7; n++ )
     {
       k = (256 >> n) ;
       if((256 - k) == digits2[3])
       {
    	   if( !poolcheck(stIP,Pool_num,k,Mask) ){
    	   	//mtk04880: for resolving bug 12324 : showing alert twice
    	   	alert("DHCP IP Pool Range exceed limit!!");
    	   	return false;
    	   }
         
       }
     }
	}else
	{
		if(Pool_num > 254)
		{
	  	alert("DHCP IP Pool Range exceed limit!!"); 	                                   								
			return false;
		}
	}
	if( !ip_poolcheck(sIP,Pool_num,mask,lanip,amask,aip) ){
		//alert("DHCP IP Pool can not contain Router Local IP!!");
	  	alert("DHCP IP Pool can not contain Router Local IP!!"); 
		return false;
	} 
	return true;
}

function doPoolRangeAlias()
{
	var sIP = document.uiViewLanForm.StartIp.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
  	var digits = sIP[0].split(".");
 	var num = document.uiViewLanForm.PoolSize.value.match("^[0-9]{1,3}$");
	
	var mask_local = document.uiViewLanForm.uiViewNetMask.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits2 = mask_local[0].split(".");
	var lanip_local = document.uiViewLanForm.uiViewIPAddr.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
  	var digits3 = lanip_local[0].split(".");

	var mask = document.uiViewLanForm.uiViewAliasNetMask.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits4 = mask[0].split(".");
	var lanip = document.uiViewLanForm.uiViewAliasIPAddr.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits5 = lanip[0].split(".");
	var MaskAlias = parseInt(digits4[3]);
	var validMainFlag = 1;
	var validAliasFlag = 1;
	var validDhcpMainFlag = 1;
	var validDhcpAliasFlag = 1;
	
    var stIP = parseInt(digits[3]);
  	var Pool_num = parseInt(num);
	var Mask = parseInt(digits2[3]);
	
	if(!StringCheck(document.uiViewLanForm.PoolSize.value))
	{
		alert("Empty IP Pool Count!!");
		return false;
	}
 	if(document.uiViewLanForm.uiViewIPAddr.value == document.uiViewLanForm.StartIp.value)
	{
		alert("DHCP Start IP and Router Local Main IP are not allowed to be the same");   	                                   								
		return false;
	}
 	if(document.uiViewLanForm.uiViewAliasIPAddr.value == document.uiViewLanForm.StartIp.value)
	{
		alert("DHCP Start IP and Router Local Alias IP are not allowed to be the same");   	                                   								
		return false;
	}
	
	for(i=0;i<4;i++)
	{
	  if((digits2[i] & digits3[i]) != (digits2[i] & digits[i]))
		{
			validMainFlag = 0;
			break;
			//alert("DHCP Start IP and Router Local IP are not in the same subnet");                                   						
			//return false;
		}
	}
	for(i=0;i<4;i++)
	{
		 if((digits4[i] & digits5[i]) != (digits4[i] & digits[i]))
		{
			validAliasFlag = 0;
			break;
			//alert("DHCP Start IP and Router Local Alias IP are not in the same subnet");                                   						
			//return false;
		}
	}
	
	if((validMainFlag == 0) && (validAliasFlag == 0))
	{
		alert("DHCP Start IP should be in the same subnet with main ip or alias ip!");
		return false;
	}
	if(Pool_num > 254)
	{
	 	alert("DHCP IP Pool Range exceed limit!!"); 	                                   								
		return false;
	}
	if(validMainFlag == 1)
	{
		if( (digits2[0]== 255) && (digits2[1] == 255) && (digits2[2] == 255) )
		{
			for( n=0; n<7; n++ )
     			{
       				k = (256 >> n) ;
       				if((256 - k) == digits2[3])
       				{
    	   				if( !poolcheck(stIP,Pool_num,k,Mask) )
    	   				{   
						validDhcpMainFlag = 0;
        					break;
        				}
       				}
     			}
		}
	}

	if(validAliasFlag == 1)
	{
		if( (digits4[0]== 255) && (digits4[1] == 255) && (digits4[2] == 255) )
		{
			for( n=0; n<7; n++ )
     			{
       			k = (256 >> n) ;
       			if((256 - k) == digits4[3])
       			{
    	   				if( !poolcheck(stIP,Pool_num,k,MaskAlias) )
    	   				{
						validDhcpAliasFlag = 0;
        					break;		
					}
       			}
     			}
		}
	}
	
	if( ((validMainFlag == 1 && validAliasFlag == 1) && ((validDhcpMainFlag | validDhcpAliasFlag) == 0)) 
	|| (validMainFlag == 1 && validDhcpMainFlag == 0)
	|| (validAliasFlag == 1 && validDhcpAliasFlag == 0) )
	{
		alert("DHCP IP Pool Range exceed limit!!"); 	            
		return false;
	}
	if( !ip_poolcheck(sIP,Pool_num,mask_local,lanip_local,mask,lanip) ){
		//alert("DHCP IP Pool can not contain Router Local IP!!");
		alert("DHCP IP Pool can not contain Router Local IP!!"); 	            
		return false;
	}
	
	return true;
}

function doConditionalPoolRange()
{
	var sIP = document.uiViewLanForm.StartIp.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
  	var digits = sIP[0].split(".");
 	var num = document.uiViewLanForm.PoolSize.value.match("^[0-9]{1,3}$");
	var mask = document.uiViewLanForm.uiViewNetMask.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits2 = mask[0].split(".");
	var lanip = document.uiViewLanForm.uiViewIPAddr.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
  	var digits3 = lanip[0].split(".");

    	var stIP = parseInt(digits[3]);
  	var Pool_num = parseInt(num);
	var Mask = parseInt(digits2[3]);

	var validMainFlag = 1;
	var validAliasFlag = 1;
	var validDhcpMainFlag = 1;
	var validDhcpAliasFlag = 1;

	var conPoolStartIP = document.uiViewLanForm.ConPoolStartIp.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
  	var digits6 = conPoolStartIP[0].split(".");
 	var conPoolNum = document.uiViewLanForm.ConPoolPoolSize.value.match("^[0-9]{1,3}$");

  	var conPoolStartIPValue = parseInt(digits6[3]);
  	var conPoolNumValue = parseInt(conPoolNum);
  	
	if(document.uiViewLanForm.uiViewIPAddr.value == document.uiViewLanForm.ConPoolStartIp.value)
	{
		alert("DHCP Conditional Pool Start IP and Router Local Main IP are not allowed to be the same");   	                                   								
		return false;
	}
	
 	for(i=0;i<4;i++)
	{
		if((digits2[i] & digits3[i]) != (digits2[i] & digits6[i]))
	  	{
			validMainFlag = 0;
			break;
			//alert("DHCP Start IP and Router Local IP are not in the same subnet");                                   						
			//return false;
	  	}
	}

	if("Yes" == document.uiViewLanForm.aliasFlag.value)
	{
		var mask = document.uiViewLanForm.uiViewAliasNetMask.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
		var digits4 = mask[0].split(".");
		var lanip = document.uiViewLanForm.uiViewAliasIPAddr.value.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
		var digits5 = lanip[0].split(".");
		var MaskAlias = parseInt(digits4[3]);

		if(document.uiViewLanForm.uiViewAliasIPAddr.value == document.uiViewLanForm.ConPoolStartIp.value)
		{
			alert("DHCP Conditional Pool Start IP and Router Local Alias IP are not allowed to be the same");   	                                   								
			return false;
		}
		for(i=0;i<4;i++)
		{
			 if((digits4[i] & digits5[i]) != (digits4[i] & digits6[i]))
			{
				validAliasFlag = 0;
				break;
				//alert("DHCP Start IP and Router Local Alias IP are not in the same subnet");                                   						
				//return false;
			}
		}
		
	}


 	if("Yes" == document.uiViewLanForm.aliasFlag.value)
 	{
 		if((validMainFlag == 0) && (validAliasFlag == 0))
		{
			alert("DHCP Conditional Pool Start IP should be in the same subnet with Router Local IP or Alias ip!");
			return false;
		}

 	}
       else
 	{
 		if(validMainFlag == 0)
		{
			alert("DHCP Conditional Pool Start IP should be in the same subnet with Router Local IP!");
			return false;
		}

 	}
 
	if(document.uiViewLanForm.StartIp.value == document.uiViewLanForm.ConPoolStartIp.value)
	{
		alert("DHCP Conditional Pool Start IP and DHCP Main Pool Start IP are not allowed to be the same"); 
		return false;
	}
	if(checkPoolOverlap(sIP, Pool_num, conPoolStartIP, conPoolNumValue) == true)
	{
		alert("DHCP Conditional Pool is Overlap with DHCP Main Pool!");
		return false;
	} 
	if(conPoolNumValue > 254)
	{
	 	alert("DHCP Conditional Pool IP Range exceed limit!!"); 	                                   								
		return false;
	}
	
	if(validMainFlag == 1)
	{
		if( (digits2[0]== 255) && (digits2[1] == 255) && (digits2[2] == 255) )
		{
			for( n=0; n<7; n++ )
     			{
       			k = (256 >> n) ;
       			if((256 - k) == digits2[3])
       			{
    	  				if( !poolcheck(conPoolStartIPValue,conPoolNumValue,k,Mask) )
    	  				{
						validDhcpMainFlag = 0;
        					break;
					}
       			}
     			}
		}
	}
	if(validAliasFlag == 1)
	{
		if("Yes" == document.uiViewLanForm.aliasFlag.value)
		{
			if( (digits4[0]== 255) && (digits4[1] == 255) && (digits4[2] == 255) )
			{
				for( n=0; n<7; n++ )
     				{
       				k = (256 >> n) ;
       				if((256 - k) == digits4[3])
       				{
    						if( !poolcheck(conPoolStartIPValue,conPoolNumValue,k,MaskAlias) )
    						{
							validDhcpAliasFlag = 0;
       						break;
       					}
     					}
				}
			}
		}
	}

	if( ((validMainFlag == 1 && validAliasFlag == 1) && ((validDhcpMainFlag | validDhcpAliasFlag) == 0)) 
	|| (validMainFlag == 1 && validDhcpMainFlag == 0)
	|| (validAliasFlag == 1 && validDhcpAliasFlag == 0) )
	{
		alert("DHCP Conditional Pool IP Range exceed limit!!"); 
		return false;
	}
	return true;
}

function inValidIPv6PrefixDHCP6S(Address) {
	var address1 = Address.match("^[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}::$"); 
	var address2 = Address.match("^[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}::$");
	var address3 = Address.match("^[0-9A-Fa-f]{1,4}:[0-9A-Fa-f]{1,4}::$"); 
	var address4 = Address.match("^[0-9A-Fa-f]{1,4}::$");
	
	  if( (address1 != null) || (address2 != null) || (address3 != null) || (address4 != null) ) { 
  	
  	return true;
  }
		alert("Invalid IPv6 Prefix"); 
  return false;
}

function doUserModeSave()
{
	var form = document.uiViewLanForm;
	if (!uiMgmtIpDoValidate())
		return false;
    
	if (form.isIPv6Supported.value == 1 )
	{
		if(!checkAllIPv6Options())
			return false;
	}
     	
	return true;
}

function doAdminSave()
{
	var form = document.uiViewLanForm;
	if(!dhcpRelayCheck()){
		return false;
	}
	
	return true;
}

function uiSave() {

	var form = document.uiViewLanForm;
	var straliasori = "Yes";
	if (straliasori == "Yes") {
		if (form.uiViewAliasIPAddr.value == "0.0.0.0") {
			form.uiViewAliasNetMask.value = "0.0.0.0";
			form.aliasFlag.value = "No";
		}
	}
	
	if(false == doUserModeSave())
		return;

	if(document.uiViewLanForm.userMode.value != 1)
		if(false == doAdminSave())
			return;



	if (straliasori == "Yes") {
		form.aliasFlag.value = "Yes";
	}
	
	if(document.uiViewLanForm.uiViewIPAddr.value != document.uiViewLanForm.orgIP.value)
	{
		document.uiViewLanForm.doChangeIP.value = 1;
		//setTimeout("doRefresh()",3000);
		removeCookie();
	}

	document.uiViewLanForm.dhcpFlag.value = 0;
	document.uiViewLanForm.submit();
}

function checkAllIPv6Options( )
{		
	var value;
	// = document.uiViewLanForm.ipv6Flag.value;
	var form = document.uiViewLanForm;
	//if(value == 1)
	if(document.uiViewLanForm.uiViewIPv6Addr.value != "" || document.uiViewLanForm.uiViewIPv6Prefix.value != "")
	{
	//check IPv6 Address format	
	value = document.uiViewLanForm.uiViewIPv6Addr.value;	
	if(inValidIPv6Addr(value))
		return false;	
	
	if(false == isGlobalIpv6Address(value)){
		alert('Invalid IPv6 GlobalAddress:' + value);
		return false;
	}
		//check IPv6 Prefix format
	value = document.uiViewLanForm.uiViewIPv6Prefix.value;
	if(!inValidPrefixLen(value))
		return false;
	}
	
 	if(form.radvdRadio[1].checked)
	{
		if( form.radvdModeFlag.value == 1)
		{
			if(! inValidIPv6PrefixDHCP6S(form.uiViewIPv6PrefixRadvd.value) )
				return false;
			if(!checkRadvdEnable( ) )
				return false;
		}		
	}
		if(form.dhcp6sEnableRadio[1].checked)
	{
		//if(! inValidIPv6Prefix(form.uiViewIPv6PrefixRadvd.value) )
		//	return;
		//if(!inValidIPv6PrefixDHCP6S(form.uiViewIPv6DHCPPrefix.value) )
			//return;
		if(!checkDHCP6SMode())
			return false;

	}    	
	document.uiViewLanForm.radvdFlag.value = 0;
	document.uiViewLanForm.dhcp6sFlag.value = 0;
	return true;
}
function checkRadvdEnable( )
{
	form = document.uiViewLanForm;
	var ret;
	if(form.radvdRadio[1].checked)
	{
		ret = checkRadvdInput( );
	}
	
	return ret;
}

	
	
function checkRadvdInput( )
{
	form = document.uiViewLanForm;
	
	if(!inValidIPv6PrefixDHCP6S(form.uiViewIPv6PrefixRadvd.value) )
		return false;
	if(!inValidPrefixLen(form.uiViewIPv6PrefixLenRadvd.value) )
		return false;
	if(!invalidLifetimeValue(form.uiPreferredLifetimeRadvd.value) )
		return false;
	if(!invalidLifetimeValue(form.uiValidLifetimeRadvd.value) )
		return false;
        var preferredlifetime = parseInt(form.uiPreferredLifetimeRadvd.value);
        var validlifetime = parseInt(form.uiValidLifetimeRadvd.value);
        if((validlifetime) <= (preferredlifetime) )
       {
                    alert("Validlifetime should be larger than Preferredlifetime!!");

                    return false;
    
       }
	return true
}

function checkDHCP6SMode( )
{
		form = document.uiViewLanForm;
		
		if(form.dhcp6sModeFlag.value == 1)
	{
		 if(!checkDHCP6SParam() )
		 	return false;
	}
	return true;
}


function checkDHCP6SParam()
{
	form = document.uiViewLanForm;
	if(!inValidIPv6PrefixDHCP6S(form.uiViewIPv6DHCPPrefix.value) )
		return false;
	if(!inValidPrefixLen(form.uiViewIPv6DHCPPrefixLen.value) )
		return false;		
	if(!invalidLifetimeValue(form.uiPreferredLifetimeDHCP6.value) )
		return false;
	if(!invalidLifetimeValue(form.uiValidLifetimeDHCP6.value) )
		return false;
        var preferredlifetime = parseInt(form.uiPreferredLifetimeDHCP6.value);
        var validlifetime = parseInt(form.uiValidLifetimeDHCP6.value);
        if((validlifetime) <= (preferredlifetime) )
       {
                    alert("Validlifetime should be larger than Preferredlifetime!!");

                    return false;
       }
	if(inValidIPv6Addr(form.uiPrimaryDNSDHCP6.value) )
		return false;
	if(inValidIPv6Addr(form.uiSecondaryDNSDHCP6.value) )
		return false;
		
	return true;
}

function inValidPrefixLen(value1) {

	
	if(value1.match("[^0-9]") != null)  {

        alert("Radvd Prefix Length should not a number!!");
    	                    
        return false;
    }
	var PrefixLen = parseInt(value1);
	if (value1=="") {

        alert("Radvd Prefix Length should not be empty!!");

		return false;
	}
	if ( (PrefixLen > 64) || (PrefixLen < 16) ) {

        alert("Radvd Prefix Length should be between 16 and 64!!");

		return false;
	}
	return true;
}

function invalidLifetimeValue(value1) {
	var form = document.uiViewLanForm;
	
	if(value1.match("[^0-9]") != null)  {

        alert("Life Time should not a number!!");
    	                    
        return false;
    }
	var lifetime = parseInt(value1);
	if (value1 == "") {

        alert("Life Time value should not be empty!!");

		return false;
	}
	if ( (lifetime > 4294967295) || (lifetime < 300) ) {

        alert("Life Time value should be between 300 and 4294967295!!");

		return false;
	}
	return true;
}

function autoDNSRelay()
{
	document.uiViewLanForm.PrimaryDns.disabled = true;
	document.uiViewLanForm.SecondDns.disabled = true;
}	

function manualDNSRelay()
{
	document.uiViewLanForm.PrimaryDns.disabled = false;
	document.uiViewLanForm.SecondDns.disabled = false;
}

function dhcpRelayCheckFail()
{
	document.uiViewLanForm.dhcpTypeRadio[2].disabled = true;
	document.uiViewLanForm.ServerIp.disabled = true;
}

function disableTheAliasIp()
{
	if(document.uiViewLanForm.dhcpTypeRadio[3].checked)
	{
		document.uiViewLanForm.uiViewAliasIPAddr.disabled = true;
		document.uiViewLanForm.uiViewAliasNetMask.disabled = true;
	}
	else
	{
		document.uiViewLanForm.uiViewAliasIPAddr.disabled = false;
		document.uiViewLanForm.uiViewAliasNetMask.disabled = false;
	}
}
function userModeOnloadCheck()
{
	return;
}

function adminOnloadCheck()
{


	if(document.uiViewLanForm.dhcpTypeRadio[1].checked)
	{
		if(document.uiViewLanForm.dnsTypeRadio[0].checked)	
			autoDNSRelay();
		else if(document.uiViewLanForm.dnsTypeRadio[1].checked)
			manualDNSRelay();
	}
	if(document.uiViewLanForm.dhcpTypeRadio[2].checked)
	{
		if(!dhcpRelayCheck())
		{
			dhcpRelayCheckFail();
		}
	}
 
}
function onloadCheck()
{
	userModeOnloadCheck();
	if(document.uiViewLanForm.userMode.value !=1)
	{
		adminOnloadCheck();
	}
	return;

}

function dhcpRelayCheck()
{
	//alert("run here 1");
	if(document.uiViewLanForm.dhcpTypeRadio[2].checked){
		//alert("run here 2");
		if(document.uiViewLanForm.defaultRoute_isp.value == 3){
			alert("DHCP Relay may be no use if default route is not dynamic or static routing mode!!");
			return false;
		}
	}
	return true;
}
function radvdChanged()
{	
		//var form = document.uiViewLanForm;
		//form.uiViewIPv6PrefixRadvd.disabled = true;
		//form.uiViewIPv6PrefixLenRadvd.disabled = true;
		//form.uiPreferredLifetimeRadvd.disabled = true;
		//form.uiValidLifetimeRadvd.disabled = true;
		//form.radvdEnableFlag.value = 0;
		//form.radvdFlag.value = 1;
		//document.uiViewLanForm.submit();


	with (document.uiViewLanForm){
		radvdFlag.value = 1;
		if (radvdRadio[0].checked == true){
			setDisplay('div_radvden', 0);
			radvdEnableFlag.value = 0;
		}
		else {
			setDisplay('div_radvden', 1);
			radvdEnableFlag.value = 1;
			radvdModeChanged();
		}
	}
}

function radvdModeChanged( )
{
		//var  form = document.uiViewLanForm;
		//form.uiViewIPv6PrefixRadvd.disabled = false;
		//form.uiViewIPv6PrefixLenRadvd.disabled = false;
		//form.uiPreferredLifetimeRadvd.disabled = false;
		//form.uiValidLifetimeRadvd.disabled = false;
		//form.radvdEnableFlag.value = 1;		
		//form.radvdFlag.value = 1;
		//document.uiViewLanForm.submit();

		with (document.uiViewLanForm){
		radvdFlag.value = 1;
		if (radvdModeRadio[0].checked){
			radvdModeFlag.value = 0;
			setDisplay('div_radvdprelen', 0);
			setDisplay('div_radvdprelite', 0);
			setDisplay('div_radvdvate', 0);
		}
		else {
			radvdModeFlag.value = 1;
			setDisplay('div_radvdprelen', 1);
			setDisplay('div_radvdprelite', 1);
			setDisplay('div_radvdvate', 1);
		}
	}
}

function dhcp6sChanged()
{
		//var form = document.uiViewLanForm;
		//form.uiViewIPv6PrefixRadvd.disabled = true;
		//form.uiViewIPv6PrefixLenRadvd.disabled = true;
		//form.uiPreferredLifetimeRadvd.disabled = true;
		//form.uiValidLifetimeRadvd.disabled = true;		
		//form.dhcp6sEnableFlag.value = 0;
		//form.dhcp6sFlag.value = 1;
		//document.uiViewLanForm.submit();
		
	with (document.uiViewLanForm){
		dhcp6sFlag.value = 1;
		if (dhcp6sEnableRadio[0].checked == true){
			setDisplay('div_dhcp6sen', 0);
			dhcp6sEnableFlag.value = 0;
		}
		else {
			setDisplay('div_dhcp6sen', 1);
			dhcp6sEnableFlag.value = 1;
			dhcp6sModeChanged();
		}
	}
}

function ripngEnableChanged() 
{
	if(document.uiViewLanForm.ripngEnableRadio[0].checked)
		setDisplay('div_ripng_direction', 0);
	else
		setDisplay('div_ripng_direction', 1);
}

function dhcp6sModeChanged()
{
	//var form = document.uiViewLanForm;	
	//form.dhcp6sModeFlag.value = 0;		
	//form.dhcp6sFlag.value = 1;
	//document.uiViewLanForm.submit();
	
	with (document.uiViewLanForm){
		dhcp6sFlag.value = 1;
		if (dhcp6sModeRadio[0].checked){
			dhcp6sModeFlag.value = 0;
			setDisplay('div_dhcp6sprelen', 0);
			setDisplay('div_dhcp6splite', 0);
			setDisplay('div_dhcp6svate', 0);
			setDisplay('div_dhcp6sdns1', 0);
			setDisplay('div_dhcp6sdns2', 0);
		}
		else {
			dhcp6sModeFlag.value = 1;
			setDisplay('div_dhcp6sprelen', 1);
			setDisplay('div_dhcp6splite', 1);
			setDisplay('div_dhcp6svate', 1);
			setDisplay('div_dhcp6sdns1', 1);
			setDisplay('div_dhcp6sdns2', 1);
		}
	}
}

function dhcp6sModeAuto()
{
	var form = document.uiViewLanForm;
	
	form.dhcp6sModeFlag.value = 2;
		
	form.dhcp6sFlag.value = 1;
	document.uiViewLanForm.submit();
}

function dhcp6sPDEnable()
{
	var form = document.uiViewLanForm;
	form.dhcp6sPDFlag.value = 1;
	form.dhcp6sFlag.value = 1;
	document.uiViewLanForm.submit();
}

function dhcp6sPDDisable()
{
	var form = document.uiViewLanForm;
	form.dhcp6sPDFlag.value = 0;
	form.dhcp6sFlag.value = 1;
	document.uiViewLanForm.submit();
}




function setDhcpAddresses(lanIp)
{
	with (document.forms[0])
	{
		var addrParts = lanIp.split('.');
		if ( addrParts.length != 4 )
			return false;
		t1 = parseInt(addrParts[3]) + 1;
		t2 = 254 - parseInt(addrParts[3]);//parseInt(maskParts[3]);
		if (255 <= t2)
		{
			t2 = 254;
		}
		
		document.uiViewLanForm.StartIp.value = "";
		var tmpStartIp = "";
		for (i = 0; i < 3; i++)
		{
			document.uiViewLanForm.StartIp.value = document.uiViewLanForm.StartIp.value + addrParts[i] + ".";
		}
		document.uiViewLanForm.StartIp.value = document.uiViewLanForm.StartIp.value + t1;
		document.uiViewLanForm.PoolSize.value = t2;
	}
}
</script>
</head>
	<body onLoad="onloadCheck()" style="background:#4acbd6;">



<FORM METHOD="POST" ACTION="/cgi-bin/home_lan.asp" name="uiViewLanForm">
<INPUT TYPE="HIDDEN" NAME="lan_VC" value="0">
<INPUT TYPE="HIDDEN" NAME="lan_Alias_VC" value="0">
<INPUT TYPE="HIDDEN" NAME="aliasFlag" value="Yes">
<INPUT TYPE="HIDDEN" NAME="defaultRoute" value="0">
<INPUT TYPE="HIDDEN" NAME="isIgmpMaxGroupSupported" VALUE="N/A">
<INPUT type="HIDDEN" NAME="doChangeIP" value="0">
<INPUT type="HIDDEN" NAME="orgIP" value="192.168.1.1">

<INPUT TYPE="HIDDEN" NAME="defaultRoute_isp" value="2">
<INPUT type="HIDDEN" name="staticNum" value="0">
<INPUT type="HIDDEN" name="LeaseNum" value="1">
<INPUT type="HIDDEN" name="emptyEntry" value="0">
<INPUT TYPE="HIDDEN" NAME="addFlag" VALUE="0">
<INPUT TYPE="HIDDEN" NAME="delnum">
<INPUT TYPE="HIDDEN" NAME="tmpStartIp" value="192.168.1.2">
<INPUT type="HIDDEN" NAME="tmpPoolCount" value="253">
<INPUT TYPE="HIDDEN" NAME="option60Flag" value="No">
<INPUT type="HIDDEN" NAME="isIPv6Supported" value="1">
<INPUT type="HIDDEN" NAME="ipv6Flag" value="1">
<INPUT type="hidden" name="userMode" value="0">


<div id="pagestyle">
<div id="contenttype">
<div id="block1" class="main_item"> 
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
        <tr height="25px" style="width:100%;background:#e6e6e6;">
				<td align=left class="title-main" style="width:250px;padding-left:20px;">Set LAN IP Address</td>
		</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
    <td align=left class="tabdata" style="width:250px;padding-left:20px;">IP Address</td>
	<td class="tabdata">
        <INPUT TYPE="TEXT" NAME="uiViewIPAddr" SIZE="15" MAXLENGTH="15" VALUE="192.168.1.1" onchange="setDhcpAddresses(this.value)">	
        <INPUT TYPE="HIDDEN" NAME="dhcpFlag" VALUE="1"><INPUT TYPE="HIDDEN" NAME="lanFlag" VALUE="0"><INPUT TYPE="HIDDEN" NAME="DNSproxy" VALUE='Yes'></td>
     </tr>
	 <tr height="30px">
	<td align=left class="tabdata" style="width:250px;padding-left:20px;">IP Subnet Mask</td>
	<td align=left class="tabdata">
	<INPUT TYPE="TEXT" NAME="uiViewNetMask" SIZE="15" MAXLENGTH="15" VALUE="255.255.255.0" ></td>
	</tr>

    <tr height="30px" style="display:none;">
    <td align=left class="tabdata" style="width:250px;padding-left:20px;">Alias IP Address</td>
	<td align=left class="tabdata">
        <INPUT TYPE="TEXT" NAME="uiViewAliasIPAddr" SIZE="15" MAXLENGTH="15" VALUE="0.0.0.0" >
		 (0.0.0.0 means to close the alias ip)	
     </td>
	 </tr>
	 <tr height="30px" style="display:none;">
    <td align=left class="tabdata" style="width:250px;padding-left:20px;">Alias IP Subnet Mask</td>
	<td align=left class="tabdata"><INPUT TYPE="TEXT" NAME="uiViewAliasNetMask" SIZE="15" MAXLENGTH="15" VALUE="0.0.0.0" >
	</td>
	</tr>

</table>
<table style="display:none;" width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">	



<tr height="30px">
    <td align=left class="tabdata" style="width:250px;padding-left:20px;"> 
	
    Snoop
	</td>
	<td align=left class="tabdata">
 
   
   		<INPUT NAME="lan_snoop" TYPE="RADIO" VALUE="Yes" checked >		Enable		
		&nbsp;&nbsp;&nbsp;&nbsp;
		<INPUT TYPE="RADIO" NAME="lan_snoop" VALUE="No"  >		Disable
		</td>
		</tr>
   
	






  <tr>
    <td class="light-orange">&nbsp;</td>
	<td class="light-orange"></td>
    <td class="tabdata"><div align=right>Dynamic Route</div></td>
	<td width="10" class="tabdata"><div align=center>:</div></td>
	<td class="tabdata">
        <SELECT NAME="lan_RIP" SIZE="1">
		<OPTION value="RIP1" selected>RIP1
		<OPTION value="RIP2" >RIP2
		</SELECT>
		Direction
		<SELECT NAME="lan_RIP_Dir" SIZE="1">
		<OPTION value="None" selected>None
		<OPTION value="Both" >Both
		<OPTION value="IN Only" >IN Only
		<OPTION value="OUT Only" >OUT Only
		</SELECT>
		</td></tr>

	

 	
	
      
  
        </table>
		</div>


<div id="block1" class="main_item"> 
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">DHCP Server Option</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
	<td width="250px" align=left class="tabdata" style="padding-left:20px;">DHCP </td>
	<td align=left  class="tabdata">
        <INPUT TYPE="RADIO" NAME="dhcpTypeRadio" VALUE="0"  onClick="doReload()">Disable
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="dhcpTypeRadio" VALUE="1" checked onClick="doReload()">Enable
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="dhcpTypeRadio" VALUE="2"  onClick="doReload()">Relay

    </td>
  </tr>
</table>
</div>





<div id="dhcp_enabled_div0" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">DHCP Address Setting</td>
	</tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">Start IP</td>
		<td align=left class="tabdata">
			<INPUT TYPE="TEXT" NAME="StartIp" SIZE="15" MAXLENGTH="15" VALUE="192.168.1.2" >	        
		</td>
	 </tr>
	<tr style="height:30px">
        <td width="250px" align=left class="tabdata" style="padding-left:20px;">IP Pool Count </td>
        <td align=left class="tabdata">
			<INPUT TYPE="TEXT" NAME="PoolSize" SIZE="15" MAXLENGTH="3" VALUE="253" >	        
		</td>
	</tr>
    	    

    <tr height="30px">
        <td width="250px" align=left class="tabdata" style="padding-left:20px;"> Lease Time</td>
        <td align=left class="tabdata">
        <INPUT TYPE="TEXT" NAME="dhcp_LeaseTime" SIZE="15" MAXLENGTH="6" VALUE="86400" >
        seconds   (range:0 as default value of 259200 or 30~)	        
     </td>
	 </tr>
 
	 

<div id="block1" class="main_item"> 
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;">DNS Information Setting</td>
	</tr>
</table>
                                                            
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
    <tr height="30px">
	<td align=left width="250px" class="tabdata" style="padding-left:20px;">
		DNS Relay
	</td>
	<td align=left  class="tabdata">
	    <INPUT TYPE="RADIO" NAME="dnsTypeRadio" VALUE="0" onClick="autoDNSRelay()" checked >Automatically
	    <INPUT TYPE="RADIO" NAME="dnsTypeRadio" VALUE="1" onClick="manualDNSRelay()"  >Manually
     </td>
	 </tr>
    <tr height="30px">
	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Primary DNS</td>
	<td align=left class="tabdata" width="30px">
        <INPUT TYPE="TEXT" NAME="PrimaryDns" SIZE="15" MAXLENGTH="15" VALUE="N/A" >	        
     </td>
	 </tr>

    <tr height="30px">
        <td width="250px" align=left class="tabdata" style="padding-left:20px;"> Secondary DNS </td>
        <td align=left class="tabdata" width="300px">
        <INPUT TYPE="TEXT" NAME="SecondDns" SIZE="15" MAXLENGTH="15" VALUE="N/A" >	        
     </td>
	 </tr>
</div> 

	
	<div id="block1" class="main_item"> 
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
        <tr height="25px" style="width:100%;background:#e6e6e6;">
            <td align=left class="title-main" style="width:250px;padding-left:20px;">Add DHCP Reservation</td>
    </tr>
	</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;"> IP Address</td>
		<td align=left class="tabdata"><INPUT TYPE="TEXT" NAME="IpAddr" SIZE="15" MAXLENGTH="15" VALUE="" ></td>
    </tr>
    <tr height="30px">
		<td align=left class="tabdata" style=" width:250px;padding-left:20px;"> MAC Address</td>
		<td align=left class="tabdata" width="300px"> <INPUT TYPE="TEXT" NAME="MACAddr" SIZE="15" MAXLENGTH="17" VALUE="" >	</td>
	</tr>
	</div>
	<div id="block1" class="main_item"> 
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
        <tr height="25px" style="width:100%;background:#e6e6e6;">
      <td class="title-main" align=left style="padding-left:20px;"> DHCP Reservation List</td>
    </tr>        
  </table>                                                                
  <table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
	<tr>
   <td colspan="3" align=center>
 <table id="static_list" width="580" border="1" cellpadding="1" cellspacing="0" bordercolor="#CCCCCC" bgcolor="#FFFFFF">
	<tr>
		<td width="120px" align=center class="tabdata"><strong><FONT color=#000000>Index</strong></td>
		<td width="180px" align=center class="tabdata"><strong><FONT color=#000000>IP</strong></td>
		<td width="200px" align=center class="tabdata"><strong><FONT color=#000000>MAC</strong></td>
		<td width="180px" align=center class="tabdata"><strong><FONT color=#000000>Drop</strong></td>
	</tr>
       
	
	
	
	
	
	
	 
</table>
        </td>
		</tr>		
		
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;display:none;">
        <tr height="25px" style="width:100%;background:#e6e6e6;">
      <td class="title-main" align=left style="padding-left:20px;"> Device Table</td>
    </tr>        
  </table>
	<tr>
    <td colspan="3" align=center>
 <!--
        <iframe src="/cgi-bin/dhcp_client_list.cgi" id="client_list" frameborder="0" width="600" height="180" align=left></iframe>
        -->
		<div id=dhcpclientList style="display:none;"></div>
<script language=JavaScript>
var tableHeader = [
	["50","#"],
	["140","Device Name"],
	["150","IP Address"],
	["140","MAC Address"],
	["100","Expire Time"]
];
var tableData = [
	["1", "Admin-PC","192.168.1.2","D8:43:AE:2E:65:45","0" + "days " + "13:0:48"],
	["2", "N/A","N/A","N/A","N/A" + "days " + "N/A"],
	["3", "N/A","N/A","N/A","N/A" + "days " + "N/A"],
	["4", "N/A","N/A","N/A","N/A" + "days " + "N/A"],
	["5", "N/A","N/A","N/A","N/A" + "days " + "N/A"],
	["6", "N/A","N/A","N/A","N/A" + "days " + "N/A"],
	["7", "N/A","N/A","N/A","N/A" + "days " + "N/A"],
	["8", "N/A","N/A","N/A","N/A" + "days " + "N/A"],
	["9", "N/A","N/A","N/A","N/A" + "days " + "N/A"],
	["10", "N/A","N/A","N/A","N/A" + "days " + "N/A"]
];

		showTable('dhcpclientList',tableHeader,tableData,2);
		</script>
        </td></tr>
		</table>
</div>
	
     
<div id="dhcp_relay_div">
	<table width="760" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
		<tr height="30px">
		<td align=left width="250px" class="tabdata" style="padding-left:20px;">
    		Server IP</td>
			<td align=left class="tabdata">
        <INPUT TYPE="TEXT" NAME="ServerIp" SIZE="15" MAXLENGTH="15" VALUE= >	        
    </td>
	</tr>
     </table>
</div>
    
     
  

 	
	<div id="block1" class="main_item"> 
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
  <tr height="25px" style="width:100%;background:#e6e6e6;"> 
	  <td align=left class="title-main" style="width:250px;padding-left:20px;">IPv6 Address Setting   </td>
  </tr>
 </table>   

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px"> 
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">  IPv6 Global Address</td>
        <td align=left class="tabdata" style="white-space:nowrap;"> 
        <INPUT TYPE="TEXT" NAME="uiViewIPv6Addr" SIZE="36" MAXLENGTH="39" VALUE="">
          <font size=+1>&nbsp;/&nbsp;
          <INPUT TYPE="TEXT" NAME="uiViewIPv6Prefix" SIZE="3" MAXLENGTH="3" VALUE=""></td>
          </font>
		</td>
	</tr>
</table>
</div>
<div id="block1" class="main_item"> 
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
  <tr height="25px" style="width:100%;background:#e6e6e6;"> 
	  <td align=left class="title-main" style="width:250px;padding-left:20px;">Radvd   </td>
  </tr>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
     <tr height="30px" style="display:none">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">   
                Radvd Enable 
        </td>
        <td align=left class="tabdata">
		<INPUT TYPE="RADIO" NAME="radvdRadio" VALUE="0" onClick="radvdChanged()"  > 
          Disable 
		  <INPUT TYPE="RADIO" NAME="radvdRadio" VALUE="1" onClick="radvdChanged()" checked > 
          Enable 
		  </td>
		  <INPUT TYPE="HIDDEN" NAME="radvdEnableFlag" VALUE=1 >
		  <INPUT TYPE="HIDDEN" NAME="radvdFlag"  >
     </tr>
	</table>
	<div id="div_radvden">
	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
	<tr height="30px" id="div_radvdmode">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">Radvd Mode</td>
        <td align=left class="tabdata"> 
			<INPUT TYPE="RADIO" NAME="radvdModeRadio" VALUE="0" onClick="radvdModeChanged()" checked >
			Auto
			&nbsp;&nbsp;&nbsp;&nbsp;
			<INPUT TYPE="RADIO" NAME="radvdModeRadio" VALUE="1" onClick="radvdModeChanged()"  > 
			Manual
		</td>
			<INPUT TYPE="HIDDEN" NAME="radvdModeFlag" VALUE=0 >
     </tr>	
	 <tr height="30px" id="div_radvdprelen">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">Prefix/Length</td>
        <td align=left class="tabdata"> 
		<INPUT TYPE="TEXT" NAME="uiViewIPv6PrefixRadvd" SIZE="36" MAXLENGTH="39" VALUE="3ffe:501:ffff:100::"> 
          <font size=+1>&nbsp;/&nbsp;
		   <INPUT TYPE="TEXT" NAME="uiViewIPv6PrefixLenRadvd" SIZE="3" MAXLENGTH="3" VALUE="64">
		  </font>
		  </td>
      </tr>
	  <tr height="30px" id="div_radvdprelite">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;">Preferred Lifetime</td>
        <td align=left class="tabdata">  
			<INPUT TYPE="TEXT" NAME="uiPreferredLifetimeRadvd" SIZE="30" MAXLENGTH="15" VALUE="3600"> 
        </td>
      </tr>
      <tr height="30px" id="div_radvdvate"> 
        <td align=left class="tabdata" style="width:250px;padding-left:20px;"> 
		ValidLifetime 
          </div>
		  </td>
        <td align=left class="tabdata">  <input type="TEXT" name="uiValidLifetimeRadvd" size="30" maxlength="15" value="7200"></td>
      </tr>

	  	<tr height="30px">
    <td align=left class="tabdata" style="width:250px;padding-left:20px;">RA Flags Set</td>
	<td align=left class="tabdata"> ManagedAddr
            <SELECT NAME="radvdManagedAddrflag" SIZE="1">
		<OPTION value="off" selected>off
		<OPTION value="on" >on
		</SELECT>
            OtherConfig
            <SELECT NAME="radvdOtherConfigflag" SIZE="1">
		<OPTION value="off" >off
		<OPTION value="on" selected>on
		</SELECT>
		</td>
		</tr>
 
    </table>
	</div>
	</div>
<div id="block1" class="main_item"> 
	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
      <tr height="25px" style="width:100%;background:#e6e6e6;"> 
        <td  align=left class="title-main" style="width:250px;padding-left:20px;">DHCPv6 Server Option</td>
      </tr>
	  </table>
	  <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
      <tr height="30px">
        <td align=left style="padding-left:20px;width:250px;"class="tabdata">DHCPv6 Server</td>
		<td align=left class="tabdata">
		<INPUT TYPE="RADIO" NAME="dhcp6sEnableRadio" VALUE="0" onClick="dhcp6sChanged()" checked > 
          Disable<INPUT TYPE="RADIO" NAME="dhcp6sEnableRadio" VALUE="1" onClick="dhcp6sChanged()"  > 
          Enable
		  </td>
		  <INPUT TYPE="HIDDEN" NAME="dhcp6sEnableFlag" VALUE=0 >
		  <INPUT TYPE="HIDDEN" NAME="dhcp6sFlag"  >
		  
		  <INPUT TYPE="HIDDEN" NAME="dhcp6sModeFlag" VALUE=0 >
		  <INPUT TYPE="HIDDEN" NAME="dhcp6sPDFlag" VALUE=N/A >
		  <INPUT TYPE="HIDDEN" NAME="dhcp6sModeSubmitFlag"  >
      </tr>
	  </table>
	<div id="div_dhcp6sen">
	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
        <td align=left class="tabdata" style="width:250px;padding-left:20px;"> DHCPv6 Mode</td>
		<td align class="tabdata">
		<INPUT TYPE="RADIO" NAME="dhcp6sModeRadio" VALUE="0"  onClick="dhcp6sModeChanged()" checked > 
          Automatically <INPUT TYPE="RADIO" NAME="dhcp6sModeRadio" VALUE="1"  onClick="dhcp6sModeChanged()"  > 
          Manually
		  </td>
      </tr>
	  <tr id="div_dhcp6sprelen" height="30px"> 
        <td class="tabdata" align=left style="width:250px;padding-left:20px;">  Prefix/Length</td>
      	<td align=left class="tabdata" style="white-space:nowrap;">
          <INPUT TYPE="TEXT" NAME="uiViewIPv6DHCPPrefix" SIZE="39" MAXLENGTH="39" VALUE="">
          <font size=+1>&nbsp;/&nbsp;
          <INPUT TYPE="TEXT" NAME="uiViewIPv6DHCPPrefixLen" SIZE="3" MAXLENGTH="3" VALUE="">
		  </td>
      </tr>
      <tr id="div_dhcp6splite" height="30px"> 
        <td class="tabdata" align=left style="width:250px;padding-left:20px;"> Preferred Lifetime</td>
        <td align=left class="tabdata"> 
        <INPUT TYPE="TEXT" NAME="uiPreferredLifetimeDHCP6" SIZE="30" MAXLENGTH="15" VALUE="3600"> 
        </td>
      </tr>
	<tr id="div_dhcp6svate" height="30px"> 
		<td class="tabdata" align=left style="width:250px;padding-left:20px;">  ValidLifetime </td>
		<td align-left class="tabdata"> 
		 <INPUT TYPE="TEXT" NAME="uiValidLifetimeDHCP6" SIZE="30" MAXLENGTH="15" VALUE="7200"> 
		</td>
	</tr>
	  
	  
                    <tr id="div_dhcp6sdns1">
                            <td class="tabdata" align=left style="width:250px;padding-left:20px;">Primary DNS</td>
                            <td align=left class="tabdata">
                                 <INPUT TYPE="TEXT" NAME="uiPrimaryDNSDHCP6" SIZE="39" MAXLENGTH="39" VALUE="fe80::1">
                                 <font size=+1>&nbsp;</font> 
                            </td>
                    </tr>
                                                                         
                    <tr id="div_dhcp6sdns2" height="30px">
                            <td class="tabdata" align=left style="width:250px;padding-left:20px;">Secondary DNS</td>
                            <td align=left class="tabdata">
                                 <INPUT TYPE="TEXT" NAME="uiSecondaryDNSDHCP6" SIZE="39" MAXLENGTH="39" VALUE="fe80::2">
                                 <font size=+1>&nbsp;</font> 
                            </td>
                    </tr>
            </table>
    </div><!--id="div_dhcp6sen"-->
	<script language="JavaScript" type="text/JavaScript">
		radvdChanged();
		dhcp6sChanged();
	</script>
	
	
	
	
	
        
  	
	</div>
	<div id="block1" class="main_item"> 
    <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
    <tr height="25px">
    	<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Save" to save your settings</td>
    </tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
  <tr height="40" >

    <td width="250px" align=left class="tabdata" style="padding-left:20px;">
        <INPUT TYPE="button" NAME="SaveBtn" class="button1" VALUE="Save" onClick="uiSave()">        
        <INPUT TYPE="reset" NAME="lan_cancel" class="button1" VALUE="Cancel">
	<INPUT TYPE="HIDDEN" NAME="DHCPMBSSIDNumberFlag" VALUE="4">
	<INPUT TYPE="HIDDEN" NAME="DHCP2PortsFlag" VALUE="N/A">
	<INPUT TYPE="HIDDEN" NAME="DHCP1PortsFlag" VALUE="N/A">
	<INPUT TYPE="HIDDEN" NAME="DHCPZY1PortsFlag" VALUE="N/A">
	<INPUT TYPE="HIDDEN" NAME="DHCPFilterFlag" VALUE="N/A">
	<INPUT TYPE="HIDDEN" NAME="wlanISExist" VALUE="On">
	<INPUT TYPE="HIDDEN" NAME="wlan11acISExist" VALUE="On">
	<INPUT TYPE="HIDDEN" NAME="DHCPMBSSID11acNumberFlag" VALUE="4">
	</td>
	</tr>
	</table>
	</div>
		
</table>
</div>
</div>
</form>
</body>

<script language="JavaScript">
	doDisplay();
</script>

</html>
