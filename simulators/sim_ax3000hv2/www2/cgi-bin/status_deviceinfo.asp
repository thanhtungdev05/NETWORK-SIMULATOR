
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
var wan_connmode='Connect_Keep_Alive';
var onu_type=2;
var fwver=0;
var connect_time='0d0h0m0s';
var serial_number='FPTH24BA7659';
var hwver='C30-401';
var customer_swversion='FT6.11.036hv';
var model_name='AX3000HV2';
var up_time='0d0h47m46s';
var ram_size='462.06 MiB';
var mem_usage='38.19%';
var cpu_usage='13.57';
var cpu_usage0='17.70';
var cpu_usage1='9.43';
var nat_session=113;
var dev_pvc=8;
var wan_mac='';
var eth_mac='20:BE:B4:0B:16:91';
var onu_status='O1';
var link_sta='down';
var rx_power='-inf';
var tx_power='-inf';
var tx_bias='0.0';
var supply_voltage='3.2';
var temperature='44.9';
var link_localip='fe80::1/64';
var dynamic_globalip='/0';
var manual_globalip='';
var dhcp_server='server';
var dhcpd_type = "";
var dhcpd_dns_all = "";
var eth_ip='192.168.1.1';
var net_mask='255.255.255.0';
var is_sfu='';
var dhcp_type='server';
var relay='';
var dhcp_type2='Enable';
var dhcp_type3='Disable';
var dhcp_type4='Relay';
var common_type=1;
var dns1='';
var dns2='';
var lan_ip='';
var link_mode='LinkPPP';
var dis_pconnbtn_type=1;
var pppoe_username="fpt";
var wan_status='down';
var wan_status6='null';
var wan_status6='down';
var isp='';
var ip_version='';
var custom='';
var pvc_stauts='';
var wan_ip='';
var wan_submask='';
var wan_gatewany='';
var primary_dns='';
var str_IP6='';
var str_IP6PreLen='';
var wan_gatewany6='';
var wan_dns6='';
var pd1='N';
var pd2='A';
var pd6='N/A';
var wan_dns='4';
var secdns_ip='5';
var ip6_sec_dnsip='';
var nat_ip0='192.168.1.179';
var session_count0='79';

function doSave()
{
    document.DvInfo_Form.submit();
}

function onSubmmit()
{
	if(document.DvInfo_Form.workingmode.value != onu_type)
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

function net_table()
{
        window.open("/cgi-bin/status_nat_table.asp","nat_table","width=800,height=600,scrollbars=yes");
}

function openWindow(url, windowName, w, h) {
	var wide=w;
	var high=h;
	if (document.all)
		var xMax = screen.width, yMax = screen.height;
	else if (document.layers)
		var xMax = window.outerWidth, yMax = window.outerHeight;
	else
	   var xMax = 640, yMax=500;
	var xOffset = (xMax - wide)/2;
	var yOffset = (yMax - high)/3;
	var settings = 'width='+wide+',height='+high+',screenX='+xOffset+',screenY='+yOffset+',top='+yOffset+',left='+xOffset+', resizable=yes, toolbar=no,location=no,directories=no,status=no,menubar=no,scrollbars=yes';
	window.open( url, windowName, settings );
}

function popup_topo_detail()
{
	openWindow('../cgi-bin/nat_table.asp', 'MeshTopoDetailInfos', 700, 500);
}

function onClickreconnetPPPoE()
{
	if( confirm("Are you sure you want to reconnect PPPoE?"))
	{
		document.DvInfo_Form.ReconnectPPPoEflag.value = 1;
		document.DvInfo_Form.submit();
	}
}

function Reload()
{
	document.location.href="/cgi-bin/status_deviceinfo.asp";
}

function reconnect(flag){
	document.DvInfo_Form.DipConnFlag.value = flag;
	document.DvInfo_Form.Saveflag.value = 1;
	document.DvInfo_Form.submit();
}



	function transTemperature(temperature)
	{
		var temp = Number(temperature);
		if (temp >= Math.pow(2, 15))
		{
			return -Math.round((Math.pow(2, 16)-temp)/256);
		}else{
			return Math.round(temp/256);
		}
	}




</script>
</HEAD>
<BODY style="background:#4acbd6;">
<FORM METHOD="POST" ACTION="/cgi-bin/status_deviceinfo.asp" name="DvInfo_Form">
<div id="pagestyle">

<div id="contenttype">
<div id="block1" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<INPUT TYPE="HIDDEN" NAME="Saveflag" VALUE="0">
<INPUT TYPE="HIDDEN" NAME="Dipflag" VALUE="0">
<tr style="height:25px;width:100%;background:#e6e6e6;">
<td width="20px">&nbsp; </td>

<td width="250px" align="left" class="title-main">Device Status</td>
<td class="tabdata" valign="middle"></td></tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  Working Mode</td>
<td align=left class="tabdata">

HGU

</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Serial Number</td>
<td align=left class="tabdata">
	<script>
		document.write(serial_number);
	</script>
	<!--  -->
</td>
</tr>
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  Model</td>
<td align=left class="tabdata">
	<script>
		document.write(model_name);
	</script>
	<!--  -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Software Version</td>
<td align=left class="tabdata">
	<script>
		if(customer_swversion != "N/A")
		{
			document.write(customer_swversion);
		}
	</script>
	<!--  -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Hardware Version</td>
<td align=left class="tabdata">
	<script>
		if(hwver != "N/A")
		{
			document.write(hwver);
		}
	</script>
<!--  -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"><font color="#000000">Device Up Time</font></td>
<td align=left class="tabdata">
	<script>
		document.write(up_time);
	</script>
<!--  Days
 Hours
 Minutes -->
</td>
</tr>


<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"><font color="#000000">RAM Size</font></td>
<td align=left class="tabdata">
	<script>
			document.write(ram_size);
	</script>
	<!--  -->
</td>
</tr>
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"><font color="#000000">Mem Usage</font></td>
<td align=left class="tabdata">
	<script>
			document.write(mem_usage);
	</script>
	<!--  -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"><font color="#000000">CPU Usage</font></td>
<td align=left class="tabdata">
	<script>
		if(cpu_usage != "N/A")
		{
			document.write(cpu_usage + "%(all)");
		}
		if(cpu_usage0 != "N/A")
		{
			document.write(cpu_usage0 + "%(0)");
		}
		if(cpu_usage1 != "N/A")
		{
			document.write(cpu_usage1 + "%(1)");
		}
	</script>
<!-- %(all);
%(0);
%(1); -->
</td>
</tr>
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"><font color="#000000">NAT Session</font></td>
<td align=left class="tabdata">
	<script>
		if(nat_session != "N/A")
		{
			document.write(nat_session);
		}
	</script>
	<!--  -->
</td>
</tr>

<tr height="30px">
	<td width="20px">&nbsp;</td>
	<td width="250px" align=left class="tabdata">
			<font color="#000000">NAT Table</font>
	</td>
	<td align=left class="tabdata">
			<input type="button" name="net_table" class="button2" onclick="popup_topo_detail();" value="Show">
	</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">MAC Address</td>
<td align=left class="tabdata" style="text-transform:uppercase">
	<script>
		document.write(eth_mac);
	</script>
</td>
</tr>
</table>
</div>


<div id="block1" class="main_item">



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
<td align=left class="tabdata">
	<script>
		//document.write(link_sta);
		if(link_sta == "up")
			document.write("up");
		else
			document.write("down");
	</script>
	<!-- down -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">ONU State </td>
<td align=left class="tabdata">
	<script>
		document.write(onu_status);
	</script>
	<!--  -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"> Rx Power</td>
<td align=left class="tabdata">
<script language="JavaScript">
		document.write(rx_power +"  dBm");
</script>
                        <!-- <script language="JavaScript">
                        
                                document.write((Math.round(Math.log((Number())/10000)/(Math.log(10))*100)/10)+"  dBm");
                        
                </script> -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"> Tx Power</td>
<td align=left class="tabdata">
<script language="JavaScript">
		document.write(tx_power +"  dBm");
</script>
                        <!-- <script language="JavaScript">
                        
                                document.write((Math.round(Math.log((Number())/10000)/(Math.log(10))*100)/10)+"  dBm");
                        
                </script> -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata"> Tx Bias Current</td>
<td align=left class="tabdata">
<script language="JavaScript">
		document.write(tx_bias +"  mA");
</script>

                        <!-- <script language="JavaScript">
                        
                                document.write((Number()*2/1000)+"  mA");
                        
                </script> -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Supply Voltage</td>
<td align=left class="tabdata">
<script language="JavaScript">
		document.write(supply_voltage +"  V");
</script>
                        <!-- <script language="JavaScript">
                        
                                document.write((Number()/10000)+"  V");
                        
                </script> -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Temperature</td>
<td align=left class="tabdata">
<script language="JavaScript">
		document.write(temperature +" &#8451;");
</script>
                                <!-- <script language="JavaScript">
                                
                                        document.write(transTemperature()+" &#8451;");
                                
                        </script> -->
</td>
</tr>

</table>
</div>


<div id="block1" class="main_item">

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<tr style="height:25px;width:100%;background:#e6e6e6;">
<td width="250px" align=left  class="title-main" style="padding-left:20px;">LAN IPv4 Status</td>
</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left  class="tabdata">  IP Address</td>
<td align=left class="tabdata">
	<script>
			document.write(eth_ip);
	</script>
	<!--  -->
 </td>
</tr>
<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left  class="tabdata">Subnet Mask</td>
<td align=left class="tabdata">
	<script>
		if(net_mask != "N/A")
		{
			document.write(net_mask);
		}
	</script>
	<!--  -->
</td>
</tr>

<!--  -->
<tr id = "sfuRow" height="30px" style="display: none;">
<td width="20px">&nbsp; </td>
<td width="250px" align=left class="tabdata">  DHCP</td>
<td align=left class="tabdata">
<script>
	if(dhcp_type =="server")
	{
		document.write("Enable");
	}
	else
	{
		if(rely == "1")
		{
			document.write("Disable");
		}
		else
		{
			document.write("Relay");
		}
	}
</script>
<tr height="30px" id="landns" style="display: none;">
	<td width="20px">&nbsp; </td>
	<td width="250px" align=left class="tabdata">
		DNS Server
	</td>
	<td align=left class="tabdata">
		<script>
			document.write(eth_ip);
		</script>
	</td>
</tr>
	<tr height="30px" id="primary_dns" style="display: none;">
		<td width="20px">&nbsp; </td>
		<td width="250px" align=left class="tabdata">
			Primary DNS
		</td>
	<td align=left class="tabdata">
		<script>
			var dhcpd_dns_array = dhcpd_dns_all.split(",");
			document.write(dhcpd_dns_array[1]);
		</script>
	</td>
	</tr>

	<tr height="30px" id="secondary_dns" style="display: none;">
		<td width="20px">&nbsp; </td>
		<td width="250px" align=left class="tabdata">
			Secondary DNS
		</td>
		<td align=left class="tabdata">
			<script>
				var dhcpd_dns_array = dhcpd_dns_all.split(",");
				document.write(dhcpd_dns_array[2]);
			</script>
		</td>
	</tr>
<!-- Disable -->
</td>
</tr>
<script>
if (is_sfu != "Yes")
{
    document.getElementById('sfuRow').style.display = '';
}
if (dhcpd_type == "1")
{
	document.getElementById('primary_dns').style.display = '';
	document.getElementById('secondary_dns').style.display = '';
}
else
{
	document.getElementById('landns').style.display = '';
}
</script>
<!--  -->
</table>

</div>

<table id = "ipv6_1" width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;" style="display:none;">
<tr style="height:25px;width:100%;background:#e6e6e6;">
<td align=left  class="title-main" style="padding-left:20px;">LAN IPv6 Status</td>
</tr>
</table>

<table id = "ipv6_2" width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed" style="display:none;">
<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left  class="tabdata">Link local IP</td>
<td class="tabdata" align=left>
<script>
	document.write(link_localip);
</script>
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left class="tabdata">  Manual Global IP</td>
<td align=left class="tabdata">
<script>
	document.write(manual_globalip);
</script>
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left class="tabdata">Dynamic Global IP</td>
<td align=left class="tabdata">
<script>
	if(dynamic_globalip == "/0")
	{
		document.write(" ");
	}
	else
	{
		document.write(dynamic_globalip);
	}
</script>
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left class="tabdata">  DHCP Server</td>
<td align=left class="tabdata">
<script>
	if(dhcp_server == "server")
	{
		document.write("On");
	}
	else
	{
		document.write("Off");
	}
</script>
</td>
</tr>
</table>
<script>
	if(dhcp_server == "server")
		{
			document.getElementById('ipv6_1').style.display = '';
			document.getElementById('ipv6_2').style.display = '';
		}
</script>


<div id="block1" class="main_item">

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<tr style="height:25px;width:100%;background:#e6e6e6;">
<td width="250px" align=left class="title-main" style="padding-left:20px;">
WAN Status</td>
</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">
WAN Type</td>
<td align=left class="tabdata"><INPUT TYPE="HIDDEN" NAME="DipConnFlag" VALUE="0">
	<script>
	if(link_mode != "N/A")
	{
		document.write(link_mode);
	}
	</script>
        <!--  -->
        &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp
		<script>
		window.onload = function() {
			var buttonState = localStorage.getItem('buttonState');
			if (buttonState === 'disconnectButton2') {
				document.getElementById('disconnectButton1').style.display='none';
				document.getElementById('disconnectButton2').style.display='';
			} else {
				document.getElementById('disconnectButton1').style.display='';
				document.getElementById('disconnectButton2').style.display='none';
			}
		}
		</script>

		<script>
		window.onload = function() {
			if(wan_connmode == "Connect_Keep_Alive")
			{
				document.getElementById('disconnectButton1').style.display = 'none';
				document.getElementById('disconnectButton2').style.display = 'none';
			}
			else
			{
				if (wan_status === "down") {
					document.getElementById('disconnectButton1').style.display = 'none';
					document.getElementById('disconnectButton2').style.display = '';
				} else {
					document.getElementById('disconnectButton1').style.display = '';
					document.getElementById('disconnectButton2').style.display = 'none';
				}
			}
		}
		</script>

		<input id="disconnectButton1" type="button" class="button1" name="Disconnect" value="Disconnect" onClick="reconnect(2)">
		<input id="disconnectButton2" type="button" class="button1" name="Disconnect" value="Connect" onClick="reconnect(3)">
                <!-- <INPUT id="reconnectButton" TYPE="button" class="button1" NAME="Connect" VALUE="Connect" onClick="reconnect(1)"> -->
                <!-- 
                
                <INPUT TYPE="button" class="button1" NAME="Connect" VALUE="Connect" onClick="reconnect(1)" >
                        
                 -->
</td>
</tr>

	<tr id = "connect_time" height="30px" style="display: none;">
		<td width="20px">&nbsp;</td>
		<td width="250px" align=left class="tabdata">
			PPP connection time
		</td>
		<td class="tabdata">
			<script>
				document.write(connect_time);
			</script>
		</td>
	</tr>
	<script>
		if(connect_time != "0d0h0m0s")
		{
			document.getElementById('connect_time').style.display = '';
		}
	</script>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  User Name</td>
<td align=left class="tabdata">
	<script>
		document.write(pppoe_username);
	</script>
</td>
</tr>

<tr height="30px">
<INPUT TYPE="HIDDEN" NAME="ReconnectPPPoEflag" VALUE="0">
<INPUT TYPE="HIDDEN" NAME="wan_PPPUsername" value="" >
<INPUT TYPE="HIDDEN" NAME="wan_PPPPassword" value="" >
<INPUT TYPE="HIDDEN" NAME="wan_connType" value="" >
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  Reconnect PPPoE Server</td>
<td align=left class="tabdata">
<input type="button" name="pppoe_Reconnect" class="button2" onclick="onClickreconnetPPPoE();" value="Reconnect">
</td>
</tr>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">

<!-- 
 -->
<tr id = "ipv4" style="height:25px;width:100%;background:#e6e6e6;" style="display: none;">
<td width="250px" align=left class="title-main" style="padding-left:20px;"> WAN IPv4 Status</td>
</tr>
<script>
	if(isp != "3")
	{
		if(ip_version != "IPv6")
		{
			document.getElementById('ipv4').style.display = '';
		}
	}
</script>

</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed" >
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">  Status</td>
<td align=left class="tabdata">
<script>
	if(custom == "C9")
	{
		if(pvc_stauts == "3")
		{
			document.write("GPON CONNECTION FAILURE");
		}
		else if(pvc_stauts == "5")
		{
			document.write("PPP up");
		}
		else if(pvc_stauts == "4")
		{
			document.write("PPP down");
		}
		else if(pvc_stauts == "2")
		{
			document.write("PPP USERNAME/PASSWORD INVALID");
		}
		else if(pvc_stauts == "1")
		{
			document.write("Connected");
		}
		else
		{
			document.write("Not Connected");
		}
	}
	else
	{
		if(wan_status == "up")
		{
			document.write("Connected");
		}
		else
		{
			document.write("Not Connected");
		}
	}
</script>
<!-- Not Connected -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">IP Address</td>
<td align=left class="tabdata">
<script>
	if(wan_ip == "")
	{
		document.write("N/A");
	}
	else
	{
		document.write(wan_ip);

	}
</script>
        <!-- N/A -->
</td>
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Subnet Mask</td>
<td align=left class="tabdata">
<script>
	if(wan_submask == "")
	{
		document.write("N/A");
	}
	else
	{
		document.write(wan_submask);
	}
</script>
	<!-- N/A -->
</td>
</tr>

	<tr height="30px">
	<td width="20px">&nbsp;</td>
			<td width="250px" align=left class="tabdata">
			Default Gateway</td>
			<td align=left class="tabdata">
			<script>
				if(wan_gatewany == "")
				{
					document.write("N/A");
				}
				else
				{
					document.write(wan_gatewany);
				}
			</script>
			<!-- N/A -->
	</td>
	</tr>

	
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">

Primary DNS

</td>
<td align=left class="tabdata">
<script language="JavaScript" type="text/JavaScript">
        if (primary_dns == "")
                document.writeln("N/A");
        else
		{
            document.writeln(primary_dns);
        }
</script>
</td>
</tr>






</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
<tr style="height:25px;width:100%;background:#e6e6e6;">
<td align=left class="title-main" style="width:250px;padding-left:20px;"> WAN IPv6 Status</td>
</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed" >
<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Status </td>
<td align=left class="tabdata">
<script>
	if(wan_status6 == "up")
	{
		document.write("Connected");
	}
	else
	{
		document.write("Not Connected");
	}
</script>
<!-- Not Connected -->
</td>
</tr>

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">IP Address</td>
<td align=left class="tabdata">
<script language="JavaScript" type="text/JavaScript">
        /*var str_IP6 = "";
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
        }*/
		// var str_IP6 = "";
		if(str_IP6 == "")
			document.writeln("N/A");
		else
			document.writeln(str_IP6);
        </script>
</td>
</tr>

<!--  -->

<tr height="30px">
<td width="20px">&nbsp;</td>
<td width="250px" align=left class="tabdata">Prefix Length</td>
<td align=left class="tabdata">
<script language="JavaScript" type="text/JavaScript">
        /*if("N/A" != str_IP6){
                var str_prelen = "64";
                var plen = str_IP6.indexOf('/');
                if(plen != -1){
                        str_prelen = str_IP6.substring(1+plen, 3+plen);
                }
                document.writeln(str_prelen);
        }
        else{
                document.writeln(str_IP6);
        }*/
		// var str_IP6PreLen = "";
		if(str_IP6PreLen == "")
			document.writeln("N/A");
		else
			document.writeln(str_IP6PreLen);
</script>
</td>
</tr>

		<tr height="30px">
			<td width="20px">&nbsp;</td>
			<td width="250px" align=left class="tabdata">Default Gateway</td>
			<td align=left class="tabdata">
				<script>
					if(wan_gatewany6 == "")
					{
						document.write("N/A");
					}
					else
					{
						document.write(wan_gatewany6);
					}
				</script>
				<!-- N/A -->
			</td>
        </tr>

		<tr height="30px">
			<td width="20px">&nbsp;</td>
			<td width="250px" align=left class="tabdata">Primary DNS Server</td>
			<td align=left class="tabdata">
				<script>
					if(wan_dns6 == "")
					{
						document.write("N/A");
					}
					else
					{
						document.write(wan_dns6);
					}
				</script>
				<!-- N/A -->
			</td>
		</tr>

		

		<tr height="30px">
		<td width="20px">&nbsp;</td>
		<td width="250px" align=left class="tabdata">Prefix Delegation</td>
		<td align=left class="tabdata">
			<script>
				if(pd6 == "")
				{
					document.write("N/A");
				}
				else
				{
					document.write(pd6);
				}
			</script>
			<!-- N/A -->
		</td>
		</tr>

        <!-- -->

</table>
</div>

<div id="button0" class="main_item">

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
</div>
</div>
</div>


	

</form>
</BODY>
</HTML>