

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<style  type="text/css">
	body{color:  #404040;}
</style>

<script language="JavaScript" src="/val.js"></script>
<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" type='text/javascript' src="/ip_new.js"></script>
<script type="text/javascript" src="/spin.js" ></script>
<link rel="stylesheet" type="text/css" href="/style.css">
<script language="JavaScript">
//////
/*
var diag_ping_ethLan = "PASS";//Diagnostic_PVC EtherLanConn Fail/PASS/Skipped
var diag_ping_ponLink = "PASS";//Diagnostic_PVC xPONLinkSta Fail/PASS/Skipped
var diag_ping_ponAppLink = "PASS";//Diagnostic_PVC xPONAppLinkSta Fail/PASS/Skipped
var pri_dns = "192.168.14.1";//Dproxy_Entry Primary_DNS or WanInfo_Entry0 DNS
var diag_ping_pridns = "PASS";//Diagnostic_PVC PingPriDNS Fail/PASS/Skipped
var diag_ping_yahoo = "PASS";//Diagnostic_PVC PingYahoo Fail/PASS/Skipped
var diag_ping_other = "Fail";//Diagnostic_PVC PingOther Fail/PASS/Skipped
var diag_ping_otherType = "Yes";//Diagnostic_PVC PingOtherType Yes/No
var diag_ping_ip = "192.168.6.91";//Diagnostic_PVC PingOtherIPaddr
var diag_trace_ip = "192.168.6.9";//Diagnostic_PVC TraceIPaddr
var diag_testtype = "3";//Diagnostic_PVC TestType 2:ping;3:Tracert
var diag_trace_result = "PASS";//Diagnostic_PVC TraceResult Wait/PASS
var tcpdump_inter = "ra0";//Tcpdump_Pcap TcpdumpInterface br0/eth0.1/eth0.2/eth0.3/eth0.4/ra0/rai0/pon
var tcpdump_num = "100";//Tcpdump_Pcap TcpdumpPcapNum
*/
//////
var diag_ping_ethLan = "N/A";
var diag_ping_ponLink = "N/A";
var diag_ping_ponAppLink = "N/A";
var pri_dns = "";
var diag_ping_pridns = "N/A";
var gateway4 = "";
var diag_ping_gateway4 = "N/A";
var diag_ping_yahoo = "N/A";
var diag_ping_other = "N/A";
var diag_ping_otherType = "0";
var diag_ping_ip = "";
var diag_trace_ip = "";
var diag_testtype = "3";
var diag_trace_result = "N/A";
var diag_nslookup_url = "";
var tcpdump_inter = "br-lan";
var tcpdump_num = "";


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

function start_tcpdump_settings() 
{
	var TcpdumpPcapNumValue=document.Test_Form.TcpdumpPcapNum.value;
	document.Test_Form.TcpdumpStart.value="Start";
	if(TcpdumpPcapNumValue<=0)
	{
		alert("PcapNum can not be null !");
		return -1;
	}

	if(TcpdumpPcapNumValue>2000)
	{
		alert("The maximum of PcapNum is 2000");
		return -1;
	}
	showSpin();
	document.Test_Form.Tcpdump_flag.value=1;
	document.Test_Form.submit();
	return;
}

function stop_tcpdump_settings() 
{
	document.Test_Form.TcpdumpStart.value="Stop";
	showSpin();
	document.Test_Form.Tcpdump_flag.value=2;
	document.Test_Form.submit();
	return;
}

function backup_tcpdump_settings()
{
	var value;
	var interface;
	//var serialnumber= "";
	if(document.Test_Form.TcpdumpInterface[0].selected)
		value="all";
	else if(document.Test_Form.TcpdumpInterface[1].selected)
		value="eth1";
	else if(document.Test_Form.TcpdumpInterface[2].selected)
		value="eth2";
	else if(document.Test_Form.TcpdumpInterface[3].selected)
		value="eth3";
	else if(document.Test_Form.TcpdumpInterface[4].selected)
		value="eth4";
	else if(document.Test_Form.TcpdumpInterface[5].selected)
		value="2.4G";
	else if(document.Test_Form.TcpdumpInterface[6].selected)
		value="5G";
	else if(document.Test_Form.TcpdumpInterface[7].selected)
		value="pon";

	interface=value;

	var cfg='/'+interface+'_tcpdump_result.pcap?t=' + new Date().getTime();
	//var cfg='/tcpdump_result.pcap';
	var code = 'location.assign("' + cfg + '")';
	eval(code);
}

//var loadDownDiagLogButtonTimer;
function gen_diagnostic_logs() 
{
	showSpin();
	//loadDownDiagLogButtonTimer = setInterval(loadDownDiagLogButton, 1000);
	document.Test_Form.diagnostic_log_flag.value=1;
	document.Test_Form.submit();
	return;
}

function backup_diagnostic_logs()
{
	var cfg='/log_export.tar.gz?t=' + new Date().getTime();
	var code = 'location.assign("' + cfg + '")';
	eval(code);
}

function DoRefresh() 
{
	document.Test_Form.testFlag.value = 2;
	document.Test_Form.submit();
}

function doTest()
{
	if(document.Test_Form.pingtest_type[0].checked)
	{
		value = document.Test_Form.IP.value;
		//if(inValidIPAddr(value))
		if(DestIPAddr_Chk(value) == true && isValidUrlName(value) == false)
		{
			alert("Invalid address " + value);
			return false;
		}
	}    
	document.Test_Form.testFlag.value = 1;
	document.Test_Form.ping_TestType.value = "2";
	document.Test_Form.submit();
}

function doReload() 
{
	if(document.Test_Form.pingtest_type[0].checked)
	{
		document.Test_Form.pingtest_type.value = "Yes";
		setDisplay('ping_other_input', 1);
	}
	else
	{
		document.Test_Form.pingtest_type.value = "No";
		setDisplay('ping_other_input', 0);
	}
	//document.Test_Form.ping_TestType.value = "2";
	//document.Test_Form.submit();
	return;
}

function DestIPAddr_Chk(Address)
{
	var address = Address.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits;
	var i;
	if(address == null) { 
		//alert("Invalid IP address " + Address);
		return true;
	}

	digits = address[0].split(".");
	for(i=0; i < 4; i++)
	{
		if((Number(digits[i]) > 255 ) || (Number(digits[i]) < 0 ) || (Number(digits[0]) == 0) || (digits[i] == null))
		{ 
			//alert("Invalid IP address " + Address);
			return true;
		}
	}
	return false;
}

function doTracertTest()
{
	setDisplay('WaitMsgTracert', 1);        

	var destip=document.Test_Form.tracert_destaddr.value;
	//if(DestIPAddr_Chk(destip))
	if(DestIPAddr_Chk(destip) == true && isValidUrlName(destip) == false)
	{
		alert("Invalid address " + destip);
		return false;
	}

	document.Test_Form.testFlag.value = 1;
	document.Test_Form.tracert_enable.value = 1;
	document.Test_Form.ping_TestType.value = "3";
	document.Test_Form.submit();
	return ;
}

function doNslookup()
{
	var destip=document.Test_Form.nslookup_destaddr.value;
	//if(DestIPAddr_Chk(destip))
	if(DestIPAddr_Chk(destip) == true && isValidUrlName(destip) == false)
	{
		alert("Invalid address " + destip);
		return false;
	}

	document.Test_Form.do_nslookup.value = 1;
	document.Test_Form.submit();
	return ;
}

function RefeshForTracert()
{
	var str1="Wait";
	var str2=document.Test_Form.tracert_result.value;
	if(str1 == str2)
	{
		setTimeout("RefeshForTracert()",5000);
		document.location.href="/cgi-bin/tools_test.asp";
	}
}
</script>
</head>

<body onLoad="setTimeout('RefeshForTracert()',5000);" style="background:#4acbd6;">
<FORM METHOD="POST" ACTION="/cgi-bin/tools_test.asp" name="Test_Form">
<div id="pagestyle">
<div id="contenttype">
<div id="block1">
<div  class="main_item">
	<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
		<input type="hidden" name="testFlag" value="0">
		<tr height="25px" style="background-color:#e6e6e6;">
			<td width="20px">&nbsp;</td>
			<td colspan="2" align="left" valign="middle" class="title-main">Diagnostic Test</td>
		</tr>
	</table>

	<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
			<tr height="30px" style="display:none">
				<td width="20px">&nbsp;</td>
				<td width="340px" align=left class="tabdata">Virtual Circuit</td>
				<td align=left class="tabdata">
					<select name="Test_PVC" size="1" onChange="DoRefresh()"  style="width:80px;">
					</select>
				</td>
			</tr>

			<tr height="30px">
				<td width="20px">&nbsp;</td>
				<td width="500px" align=left class="tabdata">&gt;&gt;Testing Ethernet LAN connection</td>
				<td align=left class="tabdata">
					<script language="JavaScript" type="text/JavaScript">
						var strlanconn = diag_ping_ethLan;
						if(strlanconn == "Fail")
							document.writeln('<font face="Arial" color="red"><strong>Fail</strong></font>');
						else if(strlanconn == "PASS")
							document.writeln('<font face="Arial" color="green"><strong>PASS</strong></font>');
						else if(strlanconn == "Skipped")
							document.writeln('<font face="Arial" color="green"><strong>Skipped</strong></font>');
						else
							document.writeln('<font face="Arial" color="green"><strong>' +strlanconn+ '</strong></font>');
					</script>
				</td>
			</tr>

			<tr height="30px">
				<td width="20px">&nbsp;</td>
				<td width="340px" align=left class="tabdata">&gt;&gt;Testing GPON MAC Status</td>
				<td align=left class="tabdata">
					<script language="JavaScript" type="text/JavaScript">
						var xponLinkStatus = diag_ping_ponLink;
						if(xponLinkStatus == "Fail")
							document.writeln('<font face="Arial" color="red"><strong>Fail</strong></font>');
						else if(xponLinkStatus == "PASS")
							document.writeln('<font face="Arial" color="green"><strong>PASS</strong></font>');
						else if(xponLinkStatus == "Skipped")
							document.writeln('<font face="Arial" color="green"><strong>Skipped</strong></font>');
						else
							document.writeln('<font face="Arial" color="green"><strong>' +xponLinkStatus+ '</strong></font>');
					</script>
				</td>
			</tr>

			<tr height="30px">
				<td width="20px">&nbsp;</td>
				<td width="340px" align=left class="tabdata">&gt;&gt;Testing GPON Link Status</td>
				<td align=left class="tabdata">
					<script language="JavaScript" type="text/JavaScript">
						var xPONAppLinkStatus = diag_ping_ponAppLink;
						if(xPONAppLinkStatus == "Fail")
							document.writeln('<font face="Arial" color="red"><strong>Fail</strong></font>');
						else if(xPONAppLinkStatus == "PASS")
							document.writeln('<font face="Arial" color="green"><strong>PASS</strong></font>');
						else if(xPONAppLinkStatus == "Skipped")
							document.writeln('<font face="Arial" color="green"><strong>Skipped</strong></font>');
						else
							document.writeln('<font face="Arial" color="green"><strong>' +xPONAppLinkStatus+ '</strong></font>');
					</script>
				</td>
			</tr>

			<tr height="30px">
				<td width="20px">&nbsp;</td>
					<td width="340px" align=left class="tabdata">&gt;&gt;Ping DHCP Primary DNS (
					<font id="dns"></font>
					<script>
						document.getElementById("dns").textContent = pri_dns+" )";
					</script>
				</td>
				<td align=left class="tabdata">
					<script language="JavaScript" type="text/JavaScript">
						var strpingdns = diag_ping_pridns;
						if(strpingdns == "Fail")
						document.writeln('<font face="Arial" color="red"><strong>Fail</strong></font>');
						else if(strpingdns == "PASS")
						document.writeln('<font face="Arial" color="green"><strong>PASS</strong></font>');
						else if(strpingdns == "Skipped")
						document.writeln('<font face="Arial" color="green"><strong>Skipped</strong></font>');
						else
						document.writeln('<font face="Arial" color="green"><strong>' +strpingdns+ '</strong></font>');
					</script>
				</td>
			</tr>

			<tr height="30px">
				<td width="20px">&nbsp;</td>
				<td width="340px" align=left class="tabdata">&gt;&gt;Ping Gateway (
					<font id="gateway4"></font>
					<script>
						document.getElementById("gateway4").textContent = gateway4+" )";
					</script>
				</td>
				<td align=left class="tabdata">
					<script language="JavaScript" type="text/JavaScript">
							var strpinggateway = diag_ping_gateway4;
							if(strpinggateway == "Fail")
							document.writeln('<font face="Arial" color="red"><strong>Fail</strong></font>');
							else if(strpinggateway == "PASS")
							document.writeln('<font face="Arial" color="green"><strong>PASS</strong></font>');
							else if(strpinggateway == "Skipped")
							document.writeln('<font face="Arial" color="green"><strong>Skipped</strong></font>');
							else
							document.writeln('<font face="Arial" color="green"><strong>' +strpinggateway+ '</strong></font>');
					</script>
				</td>
			</tr>

			<tr height="30px">
				<td width="20px">&nbsp;</td>
				<td width="340px" align=left class="tabdata">&gt;&gt;Ping www.google.com.vn ( use DHCP Pri. or Sec. DNS )</td>
				<td align=left class="tabdata">
					<script language="JavaScript" type="text/JavaScript">
						var strpingyahoo = diag_ping_yahoo;
						if(strpingyahoo == "Fail")
							document.writeln('<font face="Arial" color="red"><strong>Fail</strong></font>');
						else if(strpingyahoo == "PASS")
							document.writeln('<font face="Arial" color="green"><strong>PASS</strong></font>');
						else if(strpingyahoo == "Skipped")
							document.writeln('<font face="Arial" color="green"><strong>Skipped</strong></font>');
						else
							document.writeln('<font face="Arial" color="green"><strong>' +strpingyahoo+ '</strong></font>');
					</script>
				</td>
			</tr>

		<tr height="30px">
			<td width="20px">&nbsp;</td>
			<td width="340px" align=left class="tabdata">&gt;&gt;Ping other IP address 
				<input type="radio" name="pingtest_type" value="1" onClick="doReload()">  
				Enable 
				<input type="radio" name="pingtest_type" value="0" onClick="doReload()">  
				Disable
				<script>
					if (diag_ping_otherType == "1") {
						document.getElementsByName("pingtest_type")[0].checked = true;
						document.getElementsByName("pingtest_type")[1].checked = false;
					} else {
						document.getElementsByName("pingtest_type")[0].checked = false;
						document.getElementsByName("pingtest_type")[1].checked = true;
					}
				</script>
			</td>
			<td align=left class="tabdata">
				<script language="JavaScript" type="text/JavaScript">
					var strpingother = diag_ping_other;
					if(strpingother == "Fail")
						document.writeln('<font face="Arial" color="red"><strong>Fail</strong></font>');
					else if(strpingother == "PASS")
						document.writeln('<font face="Arial" color="green"><strong>PASS</strong></font>');
					else if(strpingother == "Skipped")
						document.writeln('<font face="Arial" color="green"><strong>Skipped</strong></font>');
					else
						document.writeln('<font face="Arial" color="green"><strong>' +strpingother+ '</strong></font>');
				</script>
			</td>
		</tr>

		<tr height="30px" style="display:none">
			<td width="20px">&nbsp;</td>
			<td colspan="2" align=left class="tabdata">
				<textarea name="ping_cmd" rows="7" readonly="readonly"  style="width:314px;background-color:#000000;font-size:15px;color: white;"></textarea>
			</td>
		</tr>

		<tr height="30px" id="ping_other_input" style="display:none">
			<td width="20px">&nbsp;</td>
			<td width="314px" height="30px" class="tabdata" align=left>
				<input type="text" style="border:none;width:155px;font-size:13px" value="Set IP address">
				<input style="width:120px;font-size:13px;margin-left:35px" type="text" name="IP" id="ping_IP" size="15" maxlength="60">
			</td>
			<td></td>
		</tr>
		<script language="JavaScript" type="text/JavaScript">
			if(diag_ping_otherType == "1")
				document.getElementById("ping_other_input").style.display = "";
			else
				document.getElementById("ping_other_input").style.display = "none";
			document.getElementById("ping_IP").value = diag_ping_ip;
		</script>
	</table>
</div>

<div  class="main_item">
	<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
		<tr height="25px">
			<td width="20px">&nbsp;</td>
			<td colspan="2" align="left" class="title-main">Click "Start" to start diagnostic test</td>
		</tr>
	</table>

	<table width="640px" border="0"  cellpadding="0" cellspacing="0" class="tabdata">
		<tr height="30px">
			<td width="20px">&nbsp;</td>
			<td colspan="2" align=left class="tabdata">
				<input type="SUBMIT" name="TestBtn" class="button1" value="Start" onClick="doTest();">
			</td>
		</tr>
	</table>
</div>

<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
		<tr height="25px" style="background-color:#e6e6e6;">
			<td width="20px">&nbsp;</td>
			<td colspan="2" align="left" class="title-main">Trace Route Test</td>
		</tr>
	</table>

	<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
		<tr height="30px" id="trace_wait_id" style="display:none">
			<td width="20px">&nbsp;</td>
			<td width="250px" colspan="2" align=left class="tabdata">
			<div id="WaitMsgTracert"><font color="#FF0000" size="-1"> traceroute is testing, please wait</font></div>
			<script language="JavaScript" type="text/JavaScript">
			if(diag_trace_result == "Wait")
				{
					document.getElementById("trace_wait_id").style.display = "";
					setDisplay('WaitMsgTracert', 1);
				}
				else
				{
					document.getElementById("trace_wait_id").style.display = "none";
					setDisplay('WaitMsgTracert', 0);
				}
			</script>
			</td>
		</tr>

		<tr height="30px">
			<td width="20px">&nbsp;</td>
			<td width="250px" align=left class="tabdata">Dest Address</td>
			<td align=left class="tabdata" color="#F36F22">
				<input type="text" name="tracert_destaddr" id="tracert_destaddr" size="30" maxlength="60">
				<script language="JavaScript" type="text/JavaScript">
					document.getElementById("tracert_destaddr").value = diag_trace_ip;
					var strTracertResult = diag_trace_result;
					var strTestType = diag_testtype;//2:ping;3:Tracert
					if(strTestType == "3")
					{
						if(strTracertResult == "Fail")
							document.writeln('<font face="Arial" color="red"><strong>Fail</strong></font>');
						else     if(strTracertResult == "Skipped")
							document.writeln('<font face="Arial" color="green"><strong>Skipped</strong></font>');
						else     if(strTracertResult == "Wait")
							document.writeln('<font face="Arial" color="green"><strong>Wait</strong></font>');
					}
				</script>
			</td>
		</tr>

		<tr height="30px" id="trace_reult_id">
			<td width="20px">&nbsp;</td>
			<td colspan="2" align=left class="tabdata">
				<script language="JavaScript" type="text/JavaScript">
					document.writeln("<iframe src='/cgi-bin/getTracentResult.cgi' frameborder='0' width='500' ></iframe>" );
				</script>
			</td>
		</tr>
		<script>
		if(diag_trace_result == "Done")
			document.getElementById("trace_reult_id").style.display = "";
		else
			document.getElementById("trace_reult_id").style.display = "none";
		</script>

		<input type="hidden" name="PingorTracertDNS" value="0">
		<input type="hidden" name="tracert_enable" value="0">
		<input type="hidden" id="Repetitions" name="Repetitions" value="10">
		<input type="hidden" id="ping_TestType" name="ping_TestType" value="1">
		<input type="hidden" id="AddRoute_Tracert" name="AddRoute_Tracert" value="ppp0">
		<input type="hidden" name="tracert_result" id="tracert_result">
		<script>
			document.getElementById("tracert_result").value = diag_trace_result;
		</script>
	</table>

	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
		<tr height="25px">
			<td width="20px">&nbsp;</td>
			<td colspan="2" align="left" class="title-main">Click "Start" to start trace route test</td>
		</tr>
	</table>

	<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
		<tr height="30px">
			<td width="20px">&nbsp;</td>
			<td colspan="2" align=left class="tabdata">
				<input type="button" name="TestTracertBtn" id="TestTracertBtn" class="button1" value="Start" onClick="doTracertTest();">
				<script>
				if(diag_trace_result == "Wait")
					document.getElementById("TestTracertBtn").disabled = true;
				else
					document.getElementById("TestTracertBtn").disabled = false;
				</script>
			</td>
		</tr>
	</table>
</div>
<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
			<tr height="25px" style="background-color:#e6e6e6;">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align="left" class="title-main">Nslookup</td>
			</tr>
	</table>
	<input type="hidden" id="do_nslookup" name="do_nslookup" value="0">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
			<tr height="30px">
					<td width="20px">&nbsp;</td>
					<td width="250px" align=left class="tabdata">Dest Address</td>
					<td align=left class="tabdata" color="#F36F22">
							<INPUT TYPE="TEXT" NAME="nslookup_destaddr" id="nslookup_destaddr" SIZE="30" MAXLENGTH="60">
					</td>
					<script language="JavaScript" type="text/JavaScript">
					document.getElementById("nslookup_destaddr").value = diag_nslookup_url;
					</script>
			</tr>
			<!--<tr height="30px">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align=left class="tabdata">
							<script language="JavaScript" type="text/JavaScript">
							document.writeln("<iframe src='/cgi-bin/getNslookupResult.cgi' frameborder='0' width='500' ></iframe>" );
							</script>
					</td>
			</tr>-->
			<tr height="30px" id="nslookupRow" style="display:none">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align=left class="tabdata" id="nslookupRowTd">
							<script language="JavaScript" type="text/JavaScript">
							var xhr = new XMLHttpRequest();
							xhr.open('GET', '/cgi-bin/getNslookupResult.cgi', true);
							xhr.onreadystatechange = function() {
								 if(xhr.readyState == 4) {
									  if(xhr.status == 200) {
										   document.getElementById('nslookupRow').style.display = '';
										   document.getElementById('nslookupRowTd').innerHTML += "<iframe src='/cgi-bin/getNslookupResult.cgi' frameborder='0' width='500'></iframe>"
									  }
								 }
							};
							xhr.send();
							</script>
					</td>
			</tr>
	</table>

	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
			<tr height="25px">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align="left" class="title-main">Click "Start" to start Nslookup</td>
			</tr>
	</table>

	<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
			<tr height="30px">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align=left class="tabdata">
							<INPUT TYPE="BUTTON" NAME="nslookupBtn" class="button1" VALUE="Start" onClick="doNslookup();">
					</td>
			</tr>
	</table>
</div>

<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
		<tr height="25px" style="background-color:#e6e6e6;">
			<td width="20px">&nbsp;</td>
			<td colspan="2" align="left" class="title-main">TcpDump Test</td>
		</tr>
	</table>

	<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
		<tr height="30px">
			<td width="20px">&nbsp;</td>
			<td width="250px" align=left class="tabdata">Interface</td>
			<td align=left class="tabdata">
				<select name="TcpdumpInterface" id="TcpdumpInterface" size="1" >
					 <option value="br-lan">All
					 <option value="eth0.1">Ethernet1
					 <option value="eth0.2">Ethernet2
					 <option value="eth0.3">Ethernet3
					 <option value="eth0.4">Ethernet4
					 <option value="ra0">WLAN 2.4G
					 <option value="rai0">WLAN 5G
					 <option value="pon">PON
				</select>
				<script>
				document.getElementById("TcpdumpInterface").value = tcpdump_inter;
				</script>
			</td>
		</tr>

		<tr height="30px">
			<td width="20px">&nbsp;</td>
			<td width="250px" align=left class="tabdata">Packets Num</td>
			<td align=left class="tabdata">
				<input type="text" name="TcpdumpPcapNum" id="TcpdumpPcapNum" size="9" maxlength="4">
				<script>
					document.getElementById("TcpdumpPcapNum").value = tcpdump_num;
				</script>
				The max of packets number is : 2000
			</td>
		</tr>
	</table>

	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="table-layout: fixed;">
		<tr height="30px">
			<td align=left class="tabdata">
				<div id="tcpdumpstatus">
					<table width=500px border=0 cellpadding=0 cellspacing=0 bgcolor=#FFFFFF >
						<!--<tr height=30 id="Capturing_message" style="display:none">-->
						<tr height=30>
							<th width=20px align=left class=tabdata>
								&nbsp;
							</th>
							<td width=250px align=left class=tabdata>
								Status
							</td>
							<th align=left class=tabdata><font id="tcpdump_status"></font></th>
						</tr>
					</table>
				</div>         
			</td>
		</tr>
	</table>
</div>

<div id="button0" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="table-layout: fixed; margin:5px 0px;">
		<tr height="25px">
			<td width="20px">&nbsp;</td>
			<td colspan="2" align="left" class="title-main">Click "Start" to start capturing packets. Click "Save" to save the packets.</td>
		</tr>
	</table>

	<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
		<tr height="30px">
			<td width="20px">&nbsp;</td>
			<td width="60px" align=left>
				<INPUT type='submit' name='TcpStart' id='TcpStart' class='button1' value="Start" onClick='start_tcpdump_settings()' style="display:none">
				<INPUT type='submit' name='TcpStop' id='TcpStop' class='button1' value="Stop" onClick='stop_tcpdump_settings()' style="display:none">
			</td>
			<td><input type="hidden" name="TcpdumpStart" value="Start">
				<input type="hidden" name="Tcpdump_flag" value="0">
				<input type="button" name='downloadTcpdump' id='downloadTcpdump' class="button1" value="Save" onClick='backup_tcpdump_settings()' style="display:none">
			</td>
			<script language=JavaScript>
				setInterval(loadDoc, 1000);
				function loadDoc() 
				{
					var xmlhttp;
					if (window.XMLHttpRequest) {
						// code for IE7+, Firefox, Chrome, Opera, Safari
						xmlhttp=new XMLHttpRequest();
					} else {
						// code for IE6, IE5
						xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
					}

					xmlhttp.onreadystatechange = function() 
					{
						if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
							if (xmlhttp.responseText.trim() == "Capturing") {
								document.getElementById("TcpStart").style.display = "none";
								document.getElementById("TcpStop").style.display = "";
								document.getElementById("downloadTcpdump").style.display = "none";
								document.getElementById("tcpdump_status").textContent = "Capturing";
								document.getElementById("tcpdump_status").style.color = "#FF9933";
							} else if (xmlhttp.responseText.trim() == "Done") {
								document.getElementById("TcpStart").style.display = "";
								document.getElementById("TcpStop").style.display = "none";
								document.getElementById("downloadTcpdump").style.display = "";
								document.getElementById("tcpdump_status").textContent = "DONE";
								document.getElementById("tcpdump_status").style.color = "#4DB848";
							} else if (xmlhttp.responseText.trim() == "None") {
								document.getElementById("TcpStart").style.display = "";
								document.getElementById("TcpStop").style.display = "none";
								document.getElementById("downloadTcpdump").style.display = "none";
								document.getElementById("tcpdump_status").textContent = "Idle";
								document.getElementById("tcpdump_status").style.color = "#0E4DA2";
							}
						}
					};
					xmlhttp.open("GET", "/cgi-bin/getTcpdumpStatua.cgi", true);
					xmlhttp.setRequestHeader('If-Modified-Since', '0');
					xmlhttp.send();
				}
			</script>
			<td id="firstDiv" style="float:left;"></td>
			<td >&nbsp;</td>
		</tr>
	</table>
</div>
</div>
<div id="block1" class="main_item">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
			<tr height="25px" style="background-color:#e6e6e6;">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align="left" class="title-main">Diagnostic Log</td>
			</tr>
	</table>
	<input type="hidden" id="diagnostic_log_flag" name="diagnostic_log_flag" value="0">
	<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
			<tr height="30px" id="gen_log_id" style="display:none;">
				<td width="20px">&nbsp;</td>
				<td width="250px" colspan="2" align=left class="tabdata">
				<font color="#FF0000" size="-1" id="gening_wait">Diagnostic logs are being generated, please wait</font>
				</td>
			</tr>
			<tr height="25px">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align="left" class="title-main">Click "Start" to generate Diagnostic Log.Click "Save" to save Diagnostic Log.
					</td>
			</tr>
	</table>

	<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
			<tr height="30px">
					<td width="20px">&nbsp;</td>
					<td width="60px" align="left">
							<INPUT TYPE="BUTTON" id="diagnosticLog" NAME="diagnosticLog" class="button1" VALUE="Start" onClick="gen_diagnostic_logs();">
					</td>
					<td id="downDiagLog_td" style="visibility:hidden;">
						<INPUT TYPE="BUTTON" NAME="downloaddiagnosticLog" class="button1" VALUE="Save" onClick="backup_diagnostic_logs();">
						<script language=JavaScript>
							/*if( gen_diag_status == "finish"){
								document.getElementById("diagnosticLog").disabled = false;
								document.getElementById("diagnosticLog").style.backgroundColor = "";
								document.getElementById("diagnosticLog").style.borderColor = "";
								document.getElementById("downDiagLog_td").style.visibility = "visible";
								document.getElementById("gen_log_id").style.display = "none";
								setDisplay('gening_wait', 0);
							} else if( gen_diag_status == "none") {
								document.getElementById("diagnosticLog").disabled = false;
								document.getElementById("diagnosticLog").style.backgroundColor = "";
								document.getElementById("diagnosticLog").style.borderColor = "";
								document.getElementById("downDiagLog_td").style.visibility = "hidden";
								document.getElementById("gen_log_id").style.display = "none";
								setDisplay('gening_wait', 0);
							} else {//generating
								document.getElementById("diagnosticLog").disabled = true;
								document.getElementById("diagnosticLog").style.backgroundColor = "gray";
								document.getElementById("diagnosticLog").style.borderColor = "gray";
								document.getElementById("downDiagLog_td").style.visibility = "hidden";
								document.getElementById("gen_log_id").style.display = "";
								setDisplay('gening_wait', 1);
							}*/
							var loadDownDiagLogButtonTimer = setInterval(loadDownDiagLogButton, 1000);
							function loadDownDiagLogButton() 
							{
								var xmlhttp;
								if (window.XMLHttpRequest) {
									// code for IE7+, Firefox, Chrome, Opera, Safari
									xmlhttp=new XMLHttpRequest();
								} else {
									// code for IE6, IE5
									xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
								}

								xmlhttp.onreadystatechange = function() 
								{
									if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
										if (xmlhttp.responseText.trim() == "finish") {
											document.getElementById("diagnosticLog").disabled = false;
											document.getElementById("diagnosticLog").style.backgroundColor = "";
											document.getElementById("diagnosticLog").style.borderColor = "";
											document.getElementById("downDiagLog_td").style.visibility = "visible";
											document.getElementById("gen_log_id").style.display = "none";
											setDisplay('gening_wait', 0);
											if(loadDownDiagLogButtonTimer) {
												clearInterval(loadDownDiagLogButtonTimer);
												loadDownDiagLogButtonTimer = null;
											}
										} else if( xmlhttp.responseText.trim() == "none") {
											document.getElementById("diagnosticLog").disabled = false;
											document.getElementById("diagnosticLog").style.backgroundColor = "";
											document.getElementById("diagnosticLog").style.borderColor = "";
											document.getElementById("downDiagLog_td").style.visibility = "hidden";
											document.getElementById("gen_log_id").style.display = "none";
											setDisplay('gening_wait', 0);
											if(loadDownDiagLogButtonTimer) {
												clearInterval(loadDownDiagLogButtonTimer);
												loadDownDiagLogButtonTimer = null;
											}
										} else {//generating
											document.getElementById("diagnosticLog").disabled = true;
											document.getElementById("diagnosticLog").style.backgroundColor = "gray";
											document.getElementById("diagnosticLog").style.borderColor = "gray";
											document.getElementById("downDiagLog_td").style.visibility = "hidden";
											document.getElementById("gen_log_id").style.display = "";
											setDisplay('gening_wait', 1);
										}
									}
								};
								xmlhttp.open("GET", "/cgi-bin/getGenDiagLogStatus.cgi", true);
								xmlhttp.setRequestHeader('If-Modified-Since', '0');
								xmlhttp.send();
							}
						</script>
					</td>
			</tr>
	</table>
</div>
</div>

</form>
</body>
</html>
