
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<META NAME="GENERATOR" Content="Microsoft Developer Studio">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">
*{
   color:  #404040;
}

</style>

<script language="JavaScript">
function doSave() {
	document.DvInfo_Form.submit();
}

function onSubmmit()
{
	if(document.DvInfo_Form.workingmode.value != '2')
		{
		if( confirm("Are you sure to change working mode and reboot?"))
		{
		  document.DvInfo_Form.SaveModeflag.value = 1;
	          document.DvInfo_Form.submit();
}
		}		
          else
               alert("The working mode is not changed !");		
}

//wang add for reconnect PPPoE 2017101010
function onClickreconnetPPPoE()
{
	if( confirm("Are you sure you want to reconnect PPPoE?"))
	{
		document.DvInfo_Form.ReconnectPPPoEflag.value = 1;
		document.DvInfo_Form.submit();
	}
}
//end

//cindy add for refresh button start 11/04
function Reload(){
//wang modify start for refresh button will change pppoe ip sometimes.
//window.location.reload();

document.location.href="/cgi-bin/status_deviceinfo.asp";
//end
}
//cindy add for refresh button end 11/04
function renewrelease(ip){
  document.DvInfo_Form.Dipflag.value = ip;
  document.DvInfo_Form.Saveflag.value = 1;
  document.DvInfo_Form.DipConnFlag.value = 0;
  document.DvInfo_Form.submit();  
}
function reconnect(flag){
  document.DvInfo_Form.DipConnFlag.value = flag;
  document.DvInfo_Form.Saveflag.value = 1;
  document.DvInfo_Form.submit();  
}
function dongle_reconnect(flag){
  document.DvInfo_Form.DongleConnFlag.value = flag;
  document.DvInfo_Form.Saveflag.value = 1;
  document.DvInfo_Form.submit();  
}


function transTemperature(temperature){
	var temp = Number(temperature);
	if (temp >= Math.pow(2, 15)){
		return -Math.round((Math.pow(2, 16)-temp)/256);
	}else{
		return Math.round(temp/256);
	}
}






</script>
</HEAD>
<BODY>
<FORM METHOD="POST" ACTION="/cgi-bin/status_deviceinfo.asp" name="DvInfo_Form">
<div id="pagestyle"><!--cindy add for border 11/28-->
<!--TABLE1 start -->
<div id="contenttype">
<div id="block1">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<INPUT TYPE="HIDDEN" NAME="Saveflag" VALUE="0">
<INPUT TYPE="HIDDEN" NAME="Dipflag" VALUE="0">
<tr style="height:25px;width:100%;background:#e6e6e6;">
<td width="20px">&nbsp; </td>
<td width="250px" align="left" class="title-main">Device Status</td>
<td class="tabdata" valign="middle"> </td></tr>
</table>

<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  Working Mode</td>
<td align=left class="tabdata">
<!--wang delete 20171107 for FPT ask to delete SFU mode
<INPUT TYPE="HIDDEN" NAME="SaveModeflag" VALUE="0">
	<SELECT NAME="workingmode" SIZE="1">
		<OPTION value="1" >SFU
		<OPTION value="2" selected>HGU
	</SELECT>

	&nbsp;&nbsp;&nbsp;&nbsp;<input type="submit" onclick="onSubmmit()" value="Save">
wang end -->
<!--only use HGU mode-->
HGU  
</td>
</tr>
<!--cindy add modelname information 12/04-->
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  Model</td>
<td align=left class="tabdata">Internet Hub AC1000F</td>
</tr>
<!--cindy add modelname information 12/04-->



<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Software Version</td>
<td align=left class="tabdata">VT5.5.10302NA</td>
</tr>


<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Hardware Version</td>
<td align=left class="tabdata">
02S2
</td>
</tr>

<!--Foxconn alan add start for show UpTimp (20170915) -->
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"><font color="#000000">Device Up Time</font></td>
<td align=left class="tabdata">
0 Days 
0 Hours 
25 Minutes
</td>
</tr>
<!-- Foxconn alan add end -->


<!--Foxconn alan add start for RAM size -->
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"><font color="#000000">RAM Size</font></td>
<td align=left class="tabdata">256MB</td>
</tr>
<!-- Foxconn alan add end -->
<!--Foxconn alan add start for MemUsage and CpuUsage -->
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"><font color="#000000">Mem Usage</font></td>
<td align=left class="tabdata">24.80%</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"><font color="#000000">CPU Usage</font></td>
<td align=left class="tabdata">0.24%(all); 
0.00%(0); 
0.00%(1); 
0.97%(2); 
0.00%(3)
</td>
</tr>
<!-- Foxconn alan add end -->
<!--Foxconn alan add start for NatSession -->
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"><font color="#000000">NAT Session</font></td>
<td align=left class="tabdata">14</td>
</tr>
<!-- Foxconn alan add end -->



<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">MAC Address</td>
<td align=left class="tabdata" style="text-transform:uppercase">

40:23:43:df:3b:b0   

</td>
</tr>
</table>
</div><!--cindy add for device status border 12/04-->

<div id="block1"><!--cindy add for id="block1" 12/04-->
<!--TABLE3(XPON) start -->


<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<INPUT TYPE="HIDDEN" NAME="style" VALUE="0">
<tr style="height:25px;width:100%;background:#e6e6e6;">
<td width="250px" align="left" class="title-main" style="padding-left:20px;">GPON Status</td>
</tr>
</table>


<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">


<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"> GPON Link Status </td>
<td align=left class="tabdata">down
</td>
</tr>

<!--wang hide GPON Firmware Ver on GUI follow FPT's sugestion 20180123-->

<tr style="display:none" height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">GPON Firmware Ver</td>
<td align=left class="tabdata">			
N/A
</td>
</tr>

<!-- hide end -->
<!-- Foxconn alan remove start
	
	<tr>
		<td class="light-orange">&nbsp;</td>
		<td class="light-orange"></td>
		<td class="tabdata"><div align=right>
		  GPON Mode  </div></td>
		<td class="tabdata"><div align=center>:</div></td>
		<td class="tabdata" colspan="3">
			Auto Detect
</td>
</tr>

Foxconn alan remove end -->

	

	



	
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"> Rx Power</td>
<td align=left class="tabdata">		
			<script language="JavaScript">
			 
				
					document.write("N/A"); 
				
			
		</script>
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"> Tx Power</td>
<td align=left class="tabdata">	
			<script language="JavaScript">
			
				 
					document.write("N/A");
				
			
		</script>
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"> Tx Bias Current</td>
<td align=left class="tabdata">	
			<script language="JavaScript">
			
				 
					document.write("N/A"); 
				
			
		</script>
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Supply Voltage</td>
<td align=left class="tabdata">		
			<script language="JavaScript">
			
				
					document.write("N/A");
				 
			
		</script>
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Temperature</td>
<td align=left class="tabdata">		
				<script language="JavaScript">
				
					
						document.write("N/A");
					 
			
			</script>
</td>
</tr>


</table>
</div><!--cindy add for id="block1" 12/04-->

<div id="block1"><!--cindy add for id="block1" 12/04-->
<!--TABLE1 ipv4 sub-title  start -->
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<tr style="height:25px;width:100%;background:#e6e6e6;">
<td width="250px" align=left  class="title-main" style="padding-left:20px;">LAN IPv4 Status</td>
</tr>
</table>
<!--TABLE1 ipv4 sub-title  start -->
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left  class="tabdata">  IP Address</td>
<td align=left class="tabdata">192.168.1.1 </td>
</tr>
<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left  class="tabdata">Subnet Mask</td>
<td align=left class="tabdata">255.255.255.0</td>
</tr>


<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left class="tabdata">  DHCP</td>
<td align=left class="tabdata">Enable</td>
</tr>

</table>

<!--cindy add lan ipv4 DNS 03/06-->

	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
		
			<tr height="30px">
				<td width="20px">&nbsp; </td>
				<td width="250px" align=left class="tabdata">  DNS Server</td>
				<td align=left class="tabdata">192.168.1.1</td>
			</tr>
		
	</table>

<!--cindy add lan ipv4 DNS 03/06-->

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">



<tr style="height:25px;width:100%;background:#e6e6e6;">
<td align=left  class="title-main" style="padding-left:20px;">LAN IPv6 Status</td>
</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left  class="tabdata">Link local IP</td>
<td class="tabdata" align=left>fe80::1/64 </td>
</tr>

<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left class="tabdata">  Manual Global IP</td>
<td align=left class="tabdata"><!--wang 20180104</td>-->
N/A</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left class="tabdata">Dynamic Global IP</td>
<td align=left class="tabdata"><!--wang 20180104</td>-->
N/A</td>
</tr>



<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left class="tabdata">  DHCP Server</td>
<td align=left class="tabdata">Disable</td>
</tr>





</table>
<!--TABLE_ end -->
</div><!--cindy add for id="block1" 12/04-->


<div id="block1">
<!--TABLE2(WAN) start -->
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<tr style="height:25px;width:100%;background:#e6e6e6;">
<td width="250px" align=left class="title-main" style="padding-left:20px;">
WAN Status</td>
</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<INPUT TYPE="HIDDEN" NAME="IPv6PrivacyAddrsSupportedFlag" value="N/A" >

<!--cindy delete 12/04
<tr>
<td class="light-orange">&nbsp;</td>
<td class="light-orange">&nbsp;</td>
<td class="tabdata"><div align=right>

	Interface
  </div></td>
<td class="tabdata"><div align=center>:</div></td>
<td class="tabdata" color="gray">
<SELECT NAME="DvInfo_PVC" SIZE="1" onChange="doSave()">

		<OPTION value="0" selected>WAN0
		<OPTION value="1" >WAN1
		<OPTION value="2" >WAN2
		<OPTION value="3" >WAN3
		<OPTION value="4" >WAN4
		<OPTION value="5" >WAN5
		<OPTION value="6" >WAN6
		<OPTION value="7" >WAN7

</SELECT>
</td>
</tr>
-->





<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">
WAN Type</td>
<td align=left class="tabdata"><INPUT TYPE="HIDDEN" NAME="DipConnFlag" VALUE="0">
        PPPoE
        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp 
		
</td>
</tr>



<!--wang add start for display pppoe username 20171007-->

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  User Name</td>
<td align=left class="tabdata">  fpt</td>
  </tr>

<tr height="30px">
<INPUT TYPE="HIDDEN" NAME="ReconnectPPPoEflag" VALUE="0">
<INPUT TYPE="HIDDEN" NAME="wan_PPPUsername" value="fpt" >
<INPUT TYPE="HIDDEN" NAME="wan_PPPPassword" value="fpt" >
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  Reconnect PPPoE Server</td>
<td align=left class="tabdata">
     <input type="button" name="pppoe_Reconnect" class="button2" onclick="onClickreconnetPPPoE();" value="Reconnect">
 </td>
</tr>

<!--end -->
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<!--TABLE2  ipv4 sub-title  start -->
  <!--wang add 20180123-->

<tr style="height:25px;width:100%;background:#e6e6e6;">
<td width="250px" align=left class="title-main" style="padding-left:20px;"> WAN IPv4 Status</td>
</tr>
<!--TABLE2  ipv4 sub-title  end -->
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed" >
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  Status</td>
<td align=left class="tabdata">
Not Connected
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">IP Address</td>
<td align=left class="tabdata">
	N/A</td>     		
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Subnet Mask</td>
<td align=left class="tabdata">N/A</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
	<td width="250px" align=left class="tabdata">

        Default Gateway</td>
	<td align=left class="tabdata">N/A
	
</td>
</tr>


<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  

Primary DNS Server

</td>
<td align=left class="tabdata">
<script language="JavaScript" type="text/JavaScript">
var artIpver = ["IPv4/IPv6",
					"IPv4/IPv6",
					"IPv4/IPv6",
					"IPv4/IPv6",
					"IPv4/IPv6",
					"IPv4/IPv6",
					"IPv4/IPv6",
					"IPv4/IPv6",
					"IPv4/IPv6",
					"IPv4/IPv6",
					"IPv4/IPv6"];

/***wang modify, for primary dns can't be display on web 20180104 ***/
//	var pvc_index = parseInt(document.DvInfo_Form.DvInfo_PVC.value);
	var pvc_index = 0;
/***wang add end ****/

	var strtype = "0";
	var strPriDNS = "168.95.1.1";
	var strDevDNS = "N/A";
	
	if (("IPv6" == artIpver[pvc_index]) || ("N/A" == artIpver[pvc_index]))
		document.writeln("N/A");
	else{
		//Foxconn alan remove for Wan DNS
		/*
		if (strtype == "1") {
			document.writeln(strPriDNS);
		}
		else{
		*/
			document.writeln(strDevDNS);
		//}	
	}	
</script>
</td>
</tr>


<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Secondary DNS Server</td>
<td align=left class="tabdata">
<script language="JavaScript" type="text/JavaScript">

	var strSecDNS = "168.95.1.2";
	var strSecDevDNS = "N/A";
	
	if (("IPv6" == artIpver[pvc_index]) || ("N/A" == artIpver[pvc_index]))
		document.writeln("N/A");
	else{
		//Foxconn alan remove for Wan DNS
		/*
		if (strtype == "1") {
			document.writeln(strSecDNS);
		}
		else{
		*/
			document.writeln(strSecDevDNS);
		//}	
	}	
</script>
</td>
</tr>



 <!--wang 20180123-->
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">


<!--wang add 20180123-->
<!--TABLE2  ipv6 sub-title  start -->
<tr style="height:25px;width:100%;background:#e6e6e6;">
<td align=left class="title-main" style="width:250px;padding-left:20px;"> WAN IPv6 Status</td>
</tr>
<!--TABLE2  ipv6 sub-title  end -->
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed" >
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Status </td>
<td align=left class="tabdata">
Not Connected
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">IP Address</td>
<td align=left class="tabdata">
<script language="JavaScript" type="text/JavaScript">
	var str_IP6 = "N/A";
	if("N/A" != str_IP6){
		var str_ip6value = str_IP6;
		var vlen = str_IP6.indexOf('/');
		if(vlen != -1){
			str_ip6value = str_IP6.substring(0, vlen);
		}
		document.writeln(str_ip6value);
	}
	else{
		document.writeln(str_IP6);
	}
	</script>  		
</td>
</tr>



<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Prefix Length</td>
<td align=left class="tabdata">
<script language="JavaScript" type="text/JavaScript">
	if("N/A" != str_IP6){
		var str_prelen = "64";
		var plen = str_IP6.indexOf('/');
		if(plen != -1){
			str_prelen = str_IP6.substring(1+plen, 3+plen);
		}
		document.writeln(str_prelen);
	}
	else{
		document.writeln(str_IP6);
	}
</script>
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Default Gateway</td>
<td align=left class="tabdata">
N/A	
</td>
	</tr>
	
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Primary DNS Server</td>
<td align=left class="tabdata">
N/A
		</td>
</tr>


<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Secondary DNS Server</td>
		<td align=left class="tabdata">N/A</td>
	</tr>
	

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Prefix Delegation</td>
<td align=left class="tabdata">N/A	</td>
	</tr>

	
<!-- end ("Wan_PVC","IPVERSION","h") <> "IPv4" -->

	
<!--wang end  ("Wan_PVC","ISP","h") <> "3" -->
</table>
</div><!--id="block1" 12/04-->
<!--TABLE2(WAN) end -->


<div id="button0">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
	<tr height="25px">		
		<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh device information</td>
</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" >
<tr height="40px">
<td width="250px" align=left class="tabdata" style="padding-left:20px;">
<input type="button" class="button1" onclick="Reload()" value="Refresh">
</td>
</tr>
</table>
</div><!-- id="button0"-->
</div><!--id="contenttype"-->
</div><!--cindy add for border 11/28-->


	
	        <table width="690" border="0" cellpadding="0" cellspacing="0">
			<tr height="30">
				<td width="20">&nbsp;</td>
				<td width="250">&nbsp;</td>
				<td width="420"></td>
			</tr>	
			<tr>
				<td align=center colSpan=3 style="background-color:transparent; font-family: Arial,Helvetica,sans-serif;"><font size=2>Copyright © 2019 FPT. All Rights Reserved.   </font></td>
			</tr>
			<tr height="10">
				<td width="20">&nbsp;</td>
				<td width="250">&nbsp;</td>
				<td width="420"></td>
			</tr>	
				
		</table>
	

</form>    
</BODY>
</HTML>
