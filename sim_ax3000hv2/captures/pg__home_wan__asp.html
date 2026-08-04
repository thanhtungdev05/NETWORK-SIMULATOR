

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/tr/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css">
<style type="text/css">
	*{color: #404040;}
</style>
<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" src="/val.js"></script>
<script language="JavaScript" src="/wanfunc.js"></script>
<script language="JavaScript" src="/mac.js"></script>
<!--<script language="JavaScript" src="OutVariant.asp"></script>-->
<script language="JavaScript" type='text/javascript' src="/ip_new.js"></script>
<script type="text/javascript" src="/spin.js" ></script>
<link href="/stylemain_e8c.css" type=text/css rel=stylesheet>
<SCRIPT language=javascript src="/menu_e8c.js"></SCRIPT>
<SCRIPT language=javascript src="/jquery_e8c.js"></SCRIPT>
<SCRIPT language=javascript src="/util_e8c.js"></SCRIPT>
<style type='text/css'>
.cus_help {
	width:150px;
}
</style>
<!--<META content="MSHTML 6.00.6000.16809" name=GENERATOR>--></HEAD>
<!--<BODY onload="DisplayLocation(getElement('Selected_Menu').value);FinishLoad();if(getElById('ConfigForm') != null)LoadFrame()" 
onunload=DoUnload() style="background:#4acbd6;">-->
<BODY onload="FinishLoad();if(getElById('ConfigForm') != null)LoadFrame()" onunload=DoUnload() style="background:#4acbd6;">
<!--<table height="100%" cellSpacing=0 cellPadding=0 width=808 align=center 
border=0>
<tbody><tr>
<td vAlign=top>-->
<SCRIPT language=JavaScript type=text/javascript>
//////
/*var wan_ipversion = "IPv4/IPv6";//WanInfo_WanIF IPVERSION
var wan_vlanmode = "UNTAG";//WanInfo_WanIF VLANMode TAG/UNTAG
var wan_vlan = "";//WanInfo_WanIF VLANID
var wan_multicastVID = "";//WanInfo_WanIF MulticastVID
var wan_natenable = "";//WanInfo_WanIF NATENABLE Enable
var pppoe_name = "fpt";//WanInfo_WanIF PASSWORD
var pppoe_pwd = "fpt";//WanInfo_WanIF USERNAME
var wan_connection = "Connect_Keep_Alive";//WanInfo_WanIF CONNECTION Connect_Manually/Connect_Keep_Alive
var wan_mtu = "0";//WanInfo_WanIF MTU
*/
//////
var wan_ipversion = "IPv4/IPv6";
var wan_vlan = "";
var wan_vlanmode = "UNTAG";
var wan_multicastVID = "";
var wan_natenable = "1";
var pppoe_name = "fpt";
var pppoe_pwd = "fpt";
var wan_connection = "Connect_Keep_Alive";
var wan_mtu = "0";


var nEntryNum = "1";//";
// num 0
var vArrayStr = "";
var vEntryName = vArrayStr.split(','); 
vArrayStr = "";
var vEntryIndex = vArrayStr.split(',');
var vCurrentDHCPv6 = "";
var vBindStatus = "";
var ppp_flag = 2;
var manual_flag = 2;
var vcurConnect = "";
if(vcurConnect == "Connect_Keep_Alive")
	ppp_flag = 0;
else if(vcurConnect == "Connect_Manually")
	ppp_flag = 1;
vcurConnect = "";
if(vcurConnect == "connect")
	manual_flag = 0;
else if((vcurConnect == "disconnect"))
	manual_flag = 1;

// num 20
var CycleV = "";
var IFIdxArray = CycleV.split(',');


// num 26
var CycleV = "";
var PPPBiArray = CycleV.split(',');

var IFIdxStore = ""

function isPPPproxybiOn()
{
	//if ( 'none' != getElement('ppp_bi').style.display )
	if('0' != ppp_bi_dis.value)
	{
		if ( getCheckVal('cb_enable_pppbi') == '1' )
			return 1;
	}
	return 0;
}
function checkDupPPPBi()
{
	var curIdx = "";
	var i = 0;

	if ( 1 == isPPPproxybiOn() )
	{
		for( i = 0; i < nEntryNum; i++ )
		{
			if ( curIdx == vEntryIndex[i] )
				continue;
			if ('Yes' == PPPBiArray[i])
				return 1;
		}
	}

	return 0;
}

function getMaxIFIdx()
{
	var IFIdxLen = IFIdxArray.length;
	var IFIdxStoreV = 0;
	var i = 0;
	var IFIdxV = 0;

	if ( isPlusInteger(IFIdxStore) )
		IFIdxStoreV = parseInt(IFIdxStore);

	IFIdxStoreV ++;

	for ( i = IFIdxStoreV; i <= 99; i ++ )
	{
		if (!isIdExist(i))
			return i;
	}

	for ( i = 1; i < IFIdxStoreV; i ++ )
	{
		if (!isIdExist(i))
			return i;
	}

	return 1; 
}

function isIdExist(ifIdx)
{
	var i = 0;
	var IFIdxV = 0;
	var IFIdxLen = IFIdxArray.length;

	for ( i = 0; i < IFIdxLen; i ++ )
	{
		IFIdxV = parseInt(IFIdxArray[i]);

		if ( IFIdxV == ifIdx )
			return true;
	}
	
	return false;
}

function WanIPConstruction(domain,conName,vlanId,vlanPri,vlanEnable,bindstr,ConnectionType, nat, enblService, wanIpAddress,serviceList,dnsstr,addrType,wanSubnetMask,defaultGateway,DHCPRelay,DhcpCode,xIpv4Enable,xIpv6Enable,xIpv6Status,xIpv6AddrType,xIpv6Addr,xIpv6PrefixLen,xIpv6Gateway,xIpv6Dns)
{
	this.domain = domain;
	var list = domain.split('.');
	this.key = '.' + list[4] + '.I.' + list[6];
	this.wanConn = 'IPCon';
	this.wanId = this.domain;
	this.conName = conName;
	this.vlanId = vlanId;
	this.vlanPri = vlanPri;
	this.vlanEnable = vlanEnable;
	this.bind = bindstr;
	this.multMode = 0;
	this.bindflag = 1;
	this.ConnectionType = ConnectionType;
	this.nat = getBoolValue(nat);
	this.enblService = getBoolValue(enblService);
	this.wanIpAddress = wanIpAddress;
	this.serviceList = serviceList;
	var dns = dnsstr.split(',');
	this.dnsPrimary = dns[0];
	this.dnsSecondary = dns[1];
	this.addrType = addrType;
	this.wanSubnetMask = wanSubnetMask;
	this.defaultGateway = defaultGateway;
	this.atmVpi = '';
	this.atmVci = '';
	this.LinkType = '';
	this.atmServiceCategory = '';
	this.atmPeakCellRate = '';
	this.atmSustainedCellRate = '';
	this.atmMaxBurstSize = '';
	this.encapMode = '';
	this.DHCPRelay = DHCPRelay;
	this.ProxyEnable = '';
	this.Relating = ' ';
	this.DhcpCode=DhcpCode;
	this.xIpv4Enable = xIpv4Enable;
	this.xIpv6Enable = xIpv6Enable;
	this.xIpv6Status = xIpv6Status;
	this.xIpv6AddrType = xIpv6AddrType;
	this.xIpv6Addr = xIpv6Addr;
	this.xIpv6PrefixLen = xIpv6PrefixLen;
	if (this.xIpv6PrefixLen == '0')
	{
		this.xIpv6PrefixLen = '';
	}
	this.xIpv6Gateway = xIpv6Gateway;
	var Ipv6DnsServer = xIpv6Dns.split(',');
	this.xIpv6Dns1 = Ipv6DnsServer[0];
	if (Ipv6DnsServer.length > 1)
	{
		this.xIpv6Dns2 = Ipv6DnsServer[1];
	}
	else
	{
		this.xIpv6Dns2 = '';
	}
}

function WanPPPConstruction(domain,conName,vlanId,vlanPri,vlanEnable,bindstr,ConnectionType, nat,enblService, wanIpAddress,serviceList,dnsstr,RemoteIPAddress,pppUserName, pppPassword,CntTrigger,ProxyEnable,pppIdleTimeout,DHCPRelay, ConnectionStatus,xIpv4Enable,xIpv6Enable,xIpv6Status,xIpv6AddrType,xIpv6Addr,xIpv6PrefixLen,xIpv6Gateway,xIpv6Dns)
{
	this.domain = domain;
	var list = domain.split('.');
	this.key = '.' + list[4] + '.P.' + list[6];
	this.wanConn = 'PPPCon';
	this.wanId = this.domain;
	this.conName = conName;
	this.vlanId = vlanId;
	this.vlanPri = vlanPri;
	this.vlanEnable = vlanEnable;
	this.bind = bindstr;
	this.multMode = 0;
	this.bindflag = 1;
	this.ConnectionType = ConnectionType;
	this.nat = getBoolValue(nat);
	this.enblService = getBoolValue(enblService);
	this.wanIpAddress = wanIpAddress;
	this.serviceList = serviceList;
	var dns = dnsstr.split(',');
	this.dnsPrimary = dns[0];
	this.dnsSecondary = dns[1];
	this.defaultGateway = RemoteIPAddress;
	this.pppUserName = pppUserName;
	this.pppPassword = pppPassword;
	this.ProxyEnable = ProxyEnable;
	this.pppIdleTimeout = pppIdleTimeout;
	this.atmVpi = '';
	this.atmVci = '';
	this.LinkType = '';
	this.atmServiceCategory = '';
	this.atmPeakCellRate = '';
	this.atmSustainedCellRate = '';
	this.atmMaxBurstSize = '';
	this.encapMode = '';
	this.cntMode = CntTrigger;
	this.Status = ConnectionStatus;
	this.Relating = ' ';
	this.DHCPRelay = DHCPRelay;
	this.xIpv4Enable = xIpv4Enable;
	this.xIpv6Enable = xIpv6Enable;
	this.xIpv6Status = xIpv6Status;
	this.xIpv6AddrType = xIpv6AddrType;
	this.xIpv6Addr = xIpv6Addr;
	this.xIpv6PrefixLen = xIpv6PrefixLen;
	if (this.xIpv6PrefixLen == '0')
	{
		this.xIpv6PrefixLen = '';
	}
	this.xIpv6Gateway = xIpv6Gateway;
	var Ipv6DnsServer = xIpv6Dns.split(',');
	this.xIpv6Dns1 = Ipv6DnsServer[0];
	if (Ipv6DnsServer.length > 1)
	{
		this.xIpv6Dns2 = Ipv6DnsServer[1];
	}
	else
	{
		this.xIpv6Dns2 = '';
	}
}

function trimString(destStr, cTrim)
{
	var i;
	var j;
	var retStr = '';
	for (i = 0; i < destStr.length; i++)
	{
		if (destStr.charAt(i) != cTrim)
		{
			retStr += destStr.charAt(i);
		}
	}
	return retStr;
}

function PvcConstruction(domain,atmPvc,atmQoS,atmPeakCellRate,LinkType,atmSustainedCellRate,atmMaxBurstSize,encapMode)
{
	this.domain = domain;
	var list = domain.split('.');
	this.key = '.' + list[4] + '.';
	var realPvc = trimString(atmPvc, ' ');
	if(realPvc.charAt(0) == 'P')
	{
		realPvc = realPvc.substr(4);
	}
	var pvc = realPvc.split('/');
	this.atmVpi = pvc[0];
	this.atmVci = pvc[1];
	this.LinkType = LinkType;
	this.atmServiceCategory = atmQoS;
	this.atmPeakCellRate = atmPeakCellRate;
	this.atmSustainedCellRate = atmSustainedCellRate;
	this.atmMaxBurstSize = atmMaxBurstSize;
	this.encapMode = encapMode;
}
var pppUsrAccess = '|Subscriber,';
var pppUsrAccessArr = pppUsrAccess.split(",");
var pppPwdAccess = '|Subscriber,';
var pppPwdAccessArr = pppPwdAccess.split(",");
var WanPPP = new Array(null);
var WanIP = new Array(null);
var CntPvc = new Array(new PvcConstruction("InternetGatewayDevice.WANDevice.1.WANConnectionDevice.4.WANDSLLinkConfig","PVC:0/35","UBR","0","EoA","0","0","LLC"),null);
if (WanIP.length > 1)
AssociateParam('WanIP','CntPvc','atmVpi|atmVci|atmServiceCategory|atmPeakCellRate|LinkType|atmSustainedCellRate|atmMaxBurstSize|encapMode');
if (WanPPP.length > 1)
AssociateParam('WanPPP','CntPvc','atmVpi|atmVci|atmServiceCategory|atmPeakCellRate|LinkType|atmSustainedCellRate|atmMaxBurstSize|encapMode');
function ipv6mode(domain, mode)
{
	this.domain = domain;
	this.mode = mode;
}
var ipv6enable = new Array(new ipv6mode("InternetGatewayDevice.DeviceInfo.X_CT-COM_IPProtocolVersion","3"),null);
var ipv6version = ipv6enable[0].mode;
var Wan = Array();
for (i = 0; i < WanIP.length-1; i++)
{
	Wan[i] = WanIP[i];
}
for (j = 0; j < WanPPP.length-1; j++,i++)
{
	Wan[i] = WanPPP[j];
}
var upRate = parseInt('0');
var pcrMax = 5500;
if (upRate != 0)
	pcrMax = Math.floor((upRate * 1000) / (53 * 8));
var i = 0;
var AddFlag = false;
var SelWanIndex = -1;
var pvcByUseIndex = -1;
var pvcByUseCount = 0;
var wanList = '';
var changePVCFlag = true;

var msg = new Array(6);
msg[0] = "Operate successfully!";
msg[1] = "Fail to modify, because only create eight interfaces under one PVC!";
msg[2] = "Fail to modify, because there is not empty PVC and only create 8 PVC!";
msg[3] = "Fail to create,the PVC has owned 8 interfaces!";
msg[4] = "Fail to create, because there is not empty PVC and only create 8 PVC!";
msg[5] = "Fail to delete,because the interface dose not exist!";

var oldIpVer;

function LoadFrame()
{
	with (getElById('ConfigForm'))
	{
		Wan_Flag.value = "0";
		var wanStatus = "N/A";
		if((0 != parseInt(wanStatus)) && (wanStatus != "N/A"))
		{
			if(99 == parseInt(wanStatus))
			{
				alert(msg[5]);
			}
			else{
				alert(msg[parseInt(wanStatus)]);
			}
			if( true == setEBooValueCookie(document.ConfigForm) )
				document.ConfigForm.submit();
		}

		oldIpVer = getRadioVal("IpVersion");
		if ((CurWan.length-1) > 0)
		{
			WanModeChange();
			if (serviceList.value == "TR069" || serviceList.value == "VOICE" || serviceList.value == "TR069_VOICE" )
			{
				dhcpv6pdflag.value = "No";
				setDisplay('secBind',0);
				setDisplay('secNat',1);
				clearBindList();
			}
			else
			{
				var ipVer = getRadioVal("IpVersion");
				setDisplay('secBind',1);
				if((wanMode.value == "Bridge") || ("IPv6" == ipVer)) setDisplay('secNat',1);
				else setDisplay('secNat',1);
				if ((serviceList.value == "OTHER") && wanMode.value == "Route" && ("IPv6" == ipVer || "IPv4/IPv6" == ipVer ))
				{
					setDisplay('setNPT',1);
				}
				else
				{
					setDisplay('setNPT',0);
				}
			}
			if(linkMode.value == "linkPPP")
				DialMethodChange();
			VLANModeChg();
			
			WanCurrIFIdx.value = getIFIdxvidDomain(getSelectVal('wanId'));
		}
		else
		{
			IpMode[2].checked = false;
			onChangeSvrList();
			ServiceListLoad(0);
		}
		var isCYE8SFUSupported="";
		var wanuilimit="";
		if("Yes" == isCYE8SFUSupported && "1" != wanuilimit){
			btnAddCnt.style.display="none";
			btnRemoveCnt.style.display="none";
		}
	}
}

function IpVersionChange()
{
	with (getElById('ConfigForm'))
	{
		var ipVer = getRadioVal("IpVersion");
		var ConnType = getSelectVal('wanMode');
		var Serverlist = getSelectVal('serviceList');
		if (ConnType != 'Route')
		{
			setDisplay('divIpVersion', 0);
			setDisplay('secIPv6Div', 0);
			return;
		}
		setDisplay('divIpVersion', 0);
		setDisplay('secIPv6Div', 0);
		if ("IPv4" == ipVer)
		{
			if (Serverlist == "TR069" || Serverlist == "VOICE" || Serverlist == "TR069_VOICE" )
			{
				setDisplay('secNat', 1);
				nat.value = "Disabled";
			}
			else
			{
				setDisplay('secNat', 1);
				if ( oldIpVer != ipVer )
				{
					nat.value = "Enable";
					setCheck('cb_nat', 1);
				}
			}
			if ('linkIP' == getSelectVal('linkMode'))
			{
				setDisplay('secDhcp', 1);
				setDisplay('secStatic', 1);
				setDisplay('secPppoeItems', 0);
				if (SelWanIndex != -1)
				{
					if ((Wan[SelWanIndex].addrType == 'DHCP') || (Wan[SelWanIndex].wanConn == "PPPCon"))
					{
						IpMode[0].checked = true;
					}
					else
					{
						IpMode[1].checked = true;
					}
				}
			}
			else
			{
				setDisplay('secDhcp', 0);
				setDisplay('secStatic', 0);
				setDisplay('secPppoeItems', 1);
			}
			setDisplay('secPppoe', 0);
			setDisplay('secPppoa', 0);
			setDisplay('secIpoa', 0);
			if(IpMode[1].checked && ("linkIP" == getSelectVal('linkMode')))
			{
				setDisplay('secStaticItems', 1);
			}
			else
			{
				setDisplay('secStaticItems', 0);
			}
			setDisplay('TrIpv6AddrType', 0);
			setDisplay('TrIpv6Addr', 0);
			setDisplay('TrIpv6Dns1', 0);
			setDisplay('TrIpv6Dns2', 0);
			setDisplay('TrIpv6Gateway', 0);
			setDisplay('TrIpv6GatewayInfo', 0);
			setDisplay('setNPT',0);
		}
		else if ("IPv6" == ipVer)
		{
			setDisplay('secNat', 1);
			nat.value = "Disabled";
			setDisplay('secDhcp', 0);
			setDisplay('secStatic', 0);
			setDisplay('secPppoe', 0);
			setDisplay('secPppoa', 0);
			setDisplay('secIpoa', 0);
			setDisplay('secStaticItems', 0);
			setDisplay('TrIpv6AddrType', 1);
			var linkstr = getSelectVal('linkMode');
			if(linkstr == "linkIP")
				WriteIPv6List(1);
			else
				WriteIPv6List(0);
			if (serviceList.value == "OTHER" && wanMode.value == "Route" )
			{
				setDisplay('setNPT',1);
			}
			else
			{
				setDisplay('setNPT',0);
			}
		}
		else
		{
			if (Serverlist == "TR069" || Serverlist == "VOICE" || Serverlist == "TR069_VOICE")
			{
				setDisplay('secNat', 1);
				nat.value = "Disabled";
			}
			else
			{
				setDisplay('secNat', 1);
				if ( oldIpVer != ipVer )
				{
					nat.value = "Enable";
					setCheck('cb_nat', 1);
				}
			}
			if ('linkIP' == getSelectVal('linkMode'))
			{
				setDisplay('secDhcp', 1);
				setDisplay('secStatic', 1);
				setDisplay('secPppoeItems', 0);
				if (SelWanIndex != -1)
				{
					if ((Wan[SelWanIndex].addrType == 'DHCP') || (Wan[SelWanIndex].wanConn == "PPPCon"))
					{
						IpMode[0].checked = true;
					}
					else
					{
						IpMode[1].checked = true;
					}
				}
			}
			else
			{
				setDisplay('secDhcp', 0);
				setDisplay('secStatic', 0);
				setDisplay('secPppoeItems', 1);
			}
				setDisplay('secPppoe', 0);
				setDisplay('secPppoa', 0);
				setDisplay('secIpoa', 0);
				if (('linkIP' == getSelectVal('linkMode')) && IpMode[1].checked)
				{
					setDisplay('secStaticItems', 1);
				}
				else
				{
					setDisplay('secStaticItems', 0);
				}
				setDisplay('TrIpv6AddrType', 1);
				if('linkIP' == getSelectVal('linkMode'))
				{
					if(IpMode[0].checked)
					{
						WriteIPv6List(0);
					}
					else if(IpMode[1].checked)
						WriteIPv6List(2);
					else
						WriteIPv6List(0);
				}
				else
					WriteIPv6List(0);
				if (serviceList.value == "OTHER" && wanMode.value == "Route" )
				{
					setDisplay('setNPT',1);
				}
				else
				{
					setDisplay('setNPT',0);
				}
			}
			oldIpVer = ipVer;
			
			dsliteShow();
			pdEnableShow();
			ppp_dialMethodChg();
	}
}
var changeflag = 1;

function onChangeSvrList()
{
	with (getElById('ConfigForm'))
	{
		if ((serviceList.value == 0) && (IpMode[2].checked == true) && (wanMode.value != "Bridge"))
		{
			changeflag = 0;
			secManualDial.style.display = "none";
			secIdleTime.style.display = "none";
		}
		else if((serviceList.value != 0) && (IpMode[2].checked == true) && (wanMode.value != "Bridge"))
		{
			if(changeflag == 0)
			{
				addOption(DialMethod,1,"Connect automatically if there are enough straffic");
				addOption(DialMethod,'Manual',"Dial manually");
				changeflag = 1;
			}
		}
		if (serviceList.value == "OTHER" && wanMode.value == "Route")
		{
			setDisplay('setNPT',1);
		}
		else
		{
			setDisplay('setNPT',0);
		}
		if (serviceList.value == "TR069" || serviceList.value == "VOICE" || serviceList.value == "TR069_VOICE" )
		{
			dhcpv6pdflag.value = "No";
			cb_nat.checked = false;
			nat.value = "Disabled";
			setDisplay('secBind',0);
			setDisplay('secNat',1);
			clearBindList();
		}
		else
		{
			dhcpv6pdflag.value = "Yes";
			cb_nat.checked = true;
			nat.value = "Enable";
			setDisplay('secBind',1);
			if(wanMode.value == "Bridge")
			{
				setDisplay('secNat',1);
				nat.value = "Disabled";
			}
			else
			{
				setDisplay('secNat',1);
			}
		}
		if (AddFlag == true)
		{
			if (serviceList.value == "OTHER" && wanMode.value == "Bridge")
			{
				cb_dhcprelay.checked = true;
			}
			else
			{
				cb_dhcprelay.checked = false;
			}
		}
		IpVersionChange();
		MTUDispChange();
		MultiVIDDispChange();
		dsliteShow();
		pdEnableShow();
		dhcpEnableShow();
		pppoeProxyShow();
		ppp_dialMethodChg();
	}
}

function onSelectSvrList()
{
	pdDefaultSel = 1;
	enabledhcpSel = 1;
	onChangeSvrList();
	with (getElById('ConfigForm'))
	{
		if (serviceList.value == "OTHER" && wanMode.value == "Bridge")
		{
			cb_dhcprelay.checked = true;
		}
		else
		{
			cb_dhcprelay.checked = false;
		}
	}
}

function DialMethodChange()
{
	setDisplay('secIdleTime',0);
	setDisplay('secManualDial',0);
}

function cb_enblServiceChange()
{
	if(document.ConfigForm.cb_enblService.checked)
		document.ConfigForm.WanActive.value = "Yes";
	else
		document.ConfigForm.WanActive.value = "No";
}

function clearBindList()
{
	for (var i = 1; i <= 4; i++)
	{
		document.getElementById("secLan" + i).disabled = false;
		document.getElementById("cb_bindlan" + i).checked = false;
		document.getElementById("secWireless" + i).disabled = false;
		document.getElementById("cb_bindwireless" + i).checked = false;
	}
}

function linkModeSelect()
{
	with (getElById('ConfigForm'))
	{
		pdDefaultSel = 1;
		isNeedChange = 1;
		var ipVer = getRadioVal("IpVersion");
		if (getSelectVal('linkMode') == 'linkIP')
		{
			if("IPv6" == ipVer)
				WriteIPv6List(1);
			else if("IPv4/IPv6" == ipVer)
			{
				if(IpMode[0].checked)
					WriteIPv6List(0);
				else if(IpMode[1].checked)
					WriteIPv6List(2);
				else
					WriteIPv6List(0);
			}
			setDisplay("secDhcp", 1);
			setDisplay('secStatic',1);
			if (SelWanIndex != -1)
			{
			}
			else
			{
				IpMode[0].checked = true;
			}
		}
		else
		{
			if("IPv4" != ipVer)
				WriteIPv6List(0);
			setDisplay("secDhcp", 0);
			setDisplay('secStatic',0);
			IpMode[2].checked = true;
			DialMethodChange();
		}
		setDisplay('secPppoe',0);
		IpModeChange();
		IpVersionChange();
		MTUDispChange();
		dsliteShow();
		pdEnableShow();
		dhcpEnableShow();
		pppoeProxyShow();
		ppp_dialMethodChg();
	}
}

var isWanModeChg = -1;
var isAddBtnClick = 0;
function ServiceListLoad(isBridge)
{
	var bridgeArray = new Array('INTERNET'
		, 'OTHER'
	);
	var i = 0;
	var status = 'TR069_INTERNET';//WanInfo_WanIF ServiceList
	var isSel = 0;
	var routeArray = new Array('TR069', 'INTERNET', 'TR069_INTERNET', 'OTHER');

	with ( getElById('serviceList') )
	{
		options.length=0;

		if ( 1 == isBridge )
		{
			for( i=0; i< bridgeArray.length; i++)
			{
				var opt = new Option(bridgeArray[i], bridgeArray[i]);
				if ( status == opt.value )
				{
					opt.selected = true;
					isSel = i;
				}
				options.add ( opt );
			}
			options[isSel].setAttribute('selected', 'true');
		}
		else
		{
			for( i=0; i< routeArray.length; i++)
			{
				var opt = new Option(routeArray[i], routeArray[i]);
				if ( status == opt.value )
				{
					opt.selected = true;
					isSel = i;
				}
				options.add ( opt );
			}
			options[isSel].setAttribute('selected', 'true');
		}
		
		if ( -1 == isWanModeChg )
			isWanModeChg = isBridge;
		else
		{
			if ( 	isWanModeChg != isBridge )
			{
				isWanModeChg = isBridge;
				onSelectSvrList();
			}
		}
	}
}

function WanModeChange()
{
	with (getElById('ConfigForm'))
	{
		if (wanMode.value == "Route")
		{
			ServiceListLoad(0);
			//setDisplay('secIpMode',1);
			setDisplay('secRouteItems',1);
			setDisplay('divLink', 1);
			setDisplay('secDhcp',1);
			setDisplay('secStatic',1);
			setDisplay('secPppoe',1);
			setDisplay('secbridgeDhcprelay',0);
			setDisplay('secBridgeType',0);
		
			if (serviceList.value == "TR069" || serviceList.value == "VOICE" || serviceList.value == "TR069_VOICE")
			{
				setDisplay('secNat',1);
			}
			else
			{
				setDisplay('secNat',1);
			}
			setDisplay('secIgmp',1);
			IpModeChange();
		}
		else if (wanMode.value == "Bridge")
		{
			ServiceListLoad(1);
			//setDisplay('secIpMode',0);
			setDisplay('secRouteItems',0);
			setDisplay('divLink', 0);
			setDisplay('secStaticItems',0);
			setDisplay('secPppoeItems',0);
			setDisplay('secDhcp',0);
			setDisplay('secStatic',0);
			setDisplay('secPppoe',0);
			setDisplay('secBridgeType',1);
			setDisplay('cb_dhcprelay',1);
			getElement('secbridgeDhcprelay').style.display = "";
			//setRadio("IpVersion", "IPv4");
			setDisplay('secNat',1);
			nat.value = "Disabled";
			setDisplay('secIgmp',0);
		}
		else if (wanMode.value == "multMode")
		{
			//setDisplay('secIpMode',1);
			setDisplay('secRouteItems',1);
			setDisplay('secDhcp',0);
			setDisplay('secStatic',0);
			setDisplay('secPppoe',1);
			setDisplay('secbridgeDhcprelay',0);
			IpMode[2].checked = true;
			setDisplay('secNat',1);
			setDisplay('secIgmp',1);
			IpModeChange();
		}
		if (AddFlag == true)
		{
			if (serviceList.value == "OTHER" && wanMode.value == "Bridge")
			{
				cb_dhcprelay.checked = true;
			}
			else
			{
				cb_dhcprelay.checked = false;
			}
		}
		IpVersionChange();
			MTUDispChange();
			MultiVIDDispChange();
		dsliteShow();
		pdEnableShow();
		dhcpEnableShow();
		pppoeProxyShow();
		ppp_dialMethodChg();
	}
}

function WanModeSelect()
{
	isNeedChange = 1;
	WanModeChange();
	linkModeSelect();
	with (getElById('ConfigForm'))
	{
		if (serviceList.value == "OTHER" && wanMode.value == "Bridge")
		{
		cb_dhcprelay.checked = true;
		}
		else
		{
		cb_dhcprelay.checked = false;
		}
		if ( serviceList.value != "TR069" &&
					serviceList.value != "VOICE" &&
					serviceList.value != "TR069_VOICE" &&
					'Route' == wanMode.value )
		{
			nat.value = "Enable";
			setCheck('cb_nat', 1);
		}
	}
}

function IpModeChange()
{
	with (getElById('ConfigForm'))
	{
		var ipVer = getRadioVal("IpVersion");
		if (IpMode[0].checked == true)
		{
			setDisplay('secStaticItems',0);
			setDisplay('secPppoeItems',0);
			document.ConfigForm.ISPTypeValue.value = "0";
			if("IPv4/IPv6" == ipVer){
				if(getSelectVal('linkMode') == 'linkIP')
					WriteIPv6List(0);
			}
		}
		else if (IpMode[1].checked == true)
		{
			setDisplay('secStaticItems',1);
			setDisplay('secPppoeItems',0);
			document.ConfigForm.ISPTypeValue.value = "1";
			if("IPv4/IPv6" == ipVer){
				if(getSelectVal('linkMode') == 'linkIP')
					WriteIPv6List(2);
			}
		}
		else if (IpMode[2].checked == true)
		{
			setDisplay('secStaticItems',0);
			setDisplay('secPppoeItems',1);
			document.ConfigForm.ISPTypeValue.value = "2";
		}
		else if (IpMode[3].checked == true)
		{
			setDisplay('secStaticItems',0);
			setDisplay('secPppoeItems',1);
			document.ConfigForm.ISPTypeValue.value = "3";
		}
		else if (IpMode[4].checked == true)
		{
			setDisplay('secStaticItems',1);
			setDisplay('secPppoeItems',0);
			document.ConfigForm.ISPTypeValue.value = "4";
		}
	}
}

function cb_bindflagChange()
{
	with (getElById('ConfigForm'))
	{
		if (cb_bindflag.checked == true)
		{
			bindflag.value = "Yes";
			setDisplay('secBind',1);
			if(wanMode.value == "Bridge")
				setDisplay('secbridgeDhcprelay',1);
			else
				setDisplay('secbridgeDhcprelay',0);
			
		}
		else
		{
			bindflag.value = "No";
			setDisplay('secBind',0);
			setDisplay('secbridgeDhcprelay',0);
		}
	}
}

function Enbl8021dChange()
{
	with (getElById('ConfigForm'))
	{
		if (enbl8021d.checked == true)
		{
			setDisplay('sec8021d',1);
			document.ConfigForm.vlanPri.value = "Yes";
		}
		else
		{
			setDisplay('sec8021d',0);
			document.ConfigForm.vlanPri.value = "No";
		}
	}
}

function Enbl8021qChange()
{
	with (getElById('ConfigForm'))
	{
		if (enbl8021q.checked == true)
		{
			setDisplay('secVlan',1);
			document.ConfigForm.vlanId.value = "Yes";
			if ( 0 == v8021P.value.length )
				v8021P.value = '0';
		}
		else
		{
			setDisplay('secVlan',0);
			document.ConfigForm.vlanId.value = "No";
		}
	}
}

function	EnableNatClick()
{
	if(document.ConfigForm.cb_nat.checked)
		document.ConfigForm.nat.value = "Enable";
	else
		document.ConfigForm.nat.value = "Disabled";
}

function	EnableIGMPProxyClick()
{
	if(document.ConfigForm.cb_enblIgmp.checked)
		document.ConfigForm.enblIgmp.value = "Yes";
	else
		document.ConfigForm.enblIgmp.value = "No";
}

function EnableDHCPRealy()
{
	if(document.ConfigForm.cb_dhcprelay.checked)
		document.ConfigForm.dhcprelay.value = "Yes";
	else
		document.ConfigForm.dhcprelay.value = "No";
}

function atmServiceCategoryChange()
{
	with (getElById('ConfigForm'))
	{
		switch (atmServiceCategory.value)
		{
			case "ubr":
			setDisplay('secAtmPeakCellRate',0);
			setDisplay('secAtmSustainedCellRate',0);
			setDisplay('secAtmMaxBurstSize',0);
			break;
			case "ubr+":
			case "cbr":
			secAtmPeakCellRate.style.display = "";
			secAtmSustainedCellRate.style.display = "none";
			secAtmMaxBurstSize.style.display = "none";
			break;
			case "nrt-vbr":
			case "rt-vbr":
			secAtmPeakCellRate.style.display = "";
			secAtmSustainedCellRate.style.display = "";
			secAtmMaxBurstSize.style.display = "";
			break;
		}
	}
}

function getWanList(list,index)
{
	var temp = Wan[index].domain.split('.');
	if (list == '')
	{
		return (temp[4] + '.' + temp[5] + '.' + temp[6]);
	}
	else
	{
		return ('|' + temp[4] + '.' + temp[5] + '.' + temp[6]);
	}
}

function isDigit(val) {
	if (val < '0' || val > '9')
		return false;
	return true;
}

function isDecimalDigit(digit)
{
	if ( digit == "" )
	{
		return false;
	}
	for ( var i = 0 ; i < digit.length ; i++ )
	{
		if ( !isDigit(digit.charAt(i)) )
		{
			return false;
		}
	}
	return true;
}

function isUseableIpAddress(address)
{
	var num = 0;
	var addrParts = address.split('.');
	if (addrParts.length != 4)
	{
		return false;
	}
	if (isDecimalDigit(addrParts[0]) == false)
	{
		return false;
	}
	num = parseInt(addrParts[0]);
	if (!(num >= 1 && num <= 223 && num != 127))
	{
		return false;
	}
	for (var i = 1; i <= 2; i++)
	{
		if (isDecimalDigit(addrParts[i]) == false)
		{
			return false;
		}
		num = parseInt(addrParts[i]);
		if (!(num >= 0 && num <= 255))
		{
			return false;
		}
	}
	if (isDecimalDigit(addrParts[3]) == false)
	{
		return false;
	}
	num = parseInt(addrParts[3]);
	if (!(num >= 1 && num <= 254))
	{
		return false;
	}
	return true;
}

function WANChkIdleTimeT() {
	/*var form=document.Alpha_WAN;
	if (form.wan_ConnectSelect[1].selected)
		form.wan_IdleTimeT.disabled = false;
	else
		form.wan_IdleTimeT.disabled = true;*/
}

function CheckForm(type)
{
	if (type == 0)
	{
		return true;
	}
	with (getElById('ConfigForm'))
	{
		ClearStatusVar();
		if (wanId.length == 0)
		{
			alert("There are no WAN connection so far, please click add to create a WAN connection and click ok to save the configuration!");
			return false;
		}

		if ( serviceList.value.indexOf('TR069') >= 0 )
		{
			for(var i=0; i< (CurWan.length-1); i++)
			{
				if ( false == AddFlag && curSetIndex.value == CurWan[i].domain )
					continue;
				if ( CurWan[i].WanName.indexOf('TR069') >= 0 )
				{
					alert('Only create one TR069 WAN port!');
					return false;
				}
			}
		}

		if ( 'TAG' == VLANMode.value )
		{
			var v = vlan.value;
			if(isPlusInteger(v) == false)
			{
				alert("VLAN IDInvalid!");
				return false;
			}
			else
			{
				if ((v == "") || (v < 1) || (v > 4094))
				{
					alert("VLAN IDInvalid!");
					return false;
				}
			}
		}

		if ( 'TAG' == VLANMode.value )
		{
			var v = v8021P.value;
			if (isPlusInteger(v) == false)
			{
				alert("802.1pInvalid!");
				return false;
			}
			else
			{
				if ((v == "") || (v < 0) || (v > 7))
				{
					alert("802.1pInvalid!");
					return false;
				}
			}
		}

		if ( 'none' != getElement('mulvidsec').style.display )
		{
			var v = MulticastVID.value;
			if ( 0 != v.length)
			{
				if (isPlusInteger(v) == false)
				{
					alert("MulticastVLAN IDInvalid!");
					return false;
				}
				else
				{
					if ( v < 1 || v > 4094 )
					{
						alert("MulticastVLAN IDInvalid!");
						return false;
					}
				}
			}
			MulVIDUsed.value = 'Yes';
		}
		else
			MulVIDUsed.value = 'No';

		if ( 'none' != getElement('MTUsec').style.display )
		{
			var v = MTU.value;
			if (isPlusInteger(v) == false)
			{
				alert("MTUInvalid!");
				return false;
			}
			else
			{
				if (getSelectVal('linkMode') == 'linkPPP')
				{
					if ('IPv4' == getRadioVal('IpVersion'))
					{
						if ((v == '') || ( 0 != v && (v < 128) || (v > 1492)))
						{
							alert("Invalid MTU,please input a integer between 128 and 1492, or use the default value by inputting 0");
							return false;
						}
					}
					else
					{
						if (getCheckVal('cb_enabledslite') == 1){
							if ((v == '') || ( 0 != v && (v < 1320) || (v > 1492)))
							{
								alert("Invalid MTU,please input a integer between 1320 and 1492, or use the default value by inputting 0!");
								return false;
							}
						}else{
							if ((v == '') || ( 0 != v && (v < 1280) || (v > 1500)))
							{
								alert("Invalid MTU,please input a integer between 1280 and 1492, or use the default value by inputting 0!");
								return false;
							}
						}
					}
				}
				else
				{
					if ('IPv4' == getRadioVal('IpVersion'))
					{
						if ((v == '') || ( 0 != v && (v < 576) || (v > 1500)))
						{
							alert("Invalid MTU,please input a integer between 576 and 1500, or use the default value by inputting 0!");
							return false;
						}
					}
					else
					{
						if (getCheckVal('cb_enabledslite') == 1){
							if ((v == '') || ( 0 != v && (v < 1320) || (v > 1500)))
							{
								alert("Invalid MTU,please input a integer between 1320 and 1500, or use the default value by inputting 0!");
								return false;
							}
						}else{
						if ((v == '') || ( 0 != v && (v < 1280) || (v > 1500)))
						{
							alert("Invalid MTU,please input a integer between 1280 and 1500, or use the default value by inputting 0!");
							return false;
						}
					}
					}
				}
			}
		}

		if ( 'none' != getElement('PDEnableSec').style.display )
		{
			PDUsed.value = 'Yes';
			if (getCheckVal('cb_enabledpd') == 1)
				enablepd.value = 'Yes';
			else
				enablepd.value = 'No';
		}
		else
			PDUsed.value = 'No';

		if ( 'none' != getElement('pdmode_1').style.display )
		{
			pdmodeUsed.value = 'Yes';
			if ( getRadioVal('pdmode') == 'No' )
			{
				var prefixObjs = pdprefix.value.split('/');
				if ( prefixObjs.length != 2 )
				{
					alert("Invalid address prefix! Format for XXXX:XXXX:XXXX:XXXX::/XX");
					return false;
				}

				if ( true != isGlobalIpv6Address(prefixObjs[0]) )
				{
					alert("Invalid IP prefix! Format forXXXX:XXXX:XXXX:XXXX::");
					return false;
				}

				var TemLen = parseInt(prefixObjs[1]);
				if ( true != isPlusInteger(prefixObjs[1]) || true == isNaN(TemLen) || TemLen > 64 || TemLen < 16)
				{
					alert("Invalid prefix length,should be betwenen 16 and 64!");
					return false;
				}
				
				switch ( CheckPDTime(pdprefixptime.value, pdprefixvtime.value) )
				{
					case 1 :
						alert('Prefix primary time"' + pdprefixptime.value + '" is invalid');
						return false;
					case 2 :
						alert('Prefix lease time! "' + pdprefixvtime.value + '" is invalid');
						return false;
					case 3 :
						alert('Prefix lease time! ' + pdprefixvtime.value + 'should be greater than prefix primary time' + pdprefixptime.value);
						return false;
				}
			}
		}
		else
			pdmodeUsed.value = 'No';

		if ( 'none' != getElement('enabledhcpsec').style.display )
		{
			if (getCheckVal('cb_enabledhcp') == 1)
			{
				enable_dhcp.value = '1';
				dhcprelay.value = "No";
			}
			else
			{
				enable_dhcp.value = '0';
				dhcprelay.value = "Yes";
			}
		}
		else
		{
			enable_dhcp.value = '0';
			dhcprelay.value = "Yes";
		}

		if (getCheckVal('NPT_enable') == 1)
			NPT_enable_value.value = '1';
		else
			NPT_enable_value.value = '0';

		if (getElement('secPppoeItems').style.display != "none")
		{
			if (getElement('secIdleTime').style.display != "none")
			{
				if (isPlusInteger(pppTimeOut.value) == false)
				{
					alert("Invalid idle timeout!");
					return false;
				}
				else
				{
					if ((getElement('pppTimeOut').value < 1) || (getElement('pppTimeOut').value > 4320)
					|| (getElement('pppTimeOut').value == ''))
					{
						alert("Invalid idle timeout!");
						return false;
					}
				}
			}
			if (isValidNameEx(pppUserName.value) == false)
			{
				alert("Invalid Username");
				return false;
			}
			if (isValidNameEx(pppPassword.value) == false)
			{
				alert("Invalid Password");
				return false;
			}
		}
		if ((getElement('secStaticItems').style.display != "none") && ("IPv6" != getRadioVal("IpVersion")))
		{
			if (WanIP != null)
			{
				var iloop;
				for (iloop = 0; iloop< WanIP.length-1; iloop++)
				{
					if ( (vpi != WanIP[iloop].atmVpi) && (vci != WanIP[iloop].atmVci))
					{
						if ( wanIpAddress.value == WanIP[iloop].wanIpAddress)
						{
							alert("IPaddress and" + WanIP[iloop].conName + "conflict") ;
							return false;
						}
					}
				}
			}

			if (!isAbcIpAddress(wanIpAddress.value))
			{
				alert("Invalid IP address!");
				wanIpAddress.focus();
				return false;
			}
			if (!isValidSubnetMask(wanSubnetMask.value))
			{
				alert("Invalid subnet mask!");
				wanSubnetMask.focus();
				return false;
			}
			if (!isHostIpWithSubnetMask(wanIpAddress.value, wanSubnetMask.value))
			{
				alert("IP address and subnet mask dose not match!");
				wanIpAddress.focus();
				return false;
			}
			if (!isAbcIpAddress(defaultGateway.value))
			{
				alert("Invalid default getway!");
				defaultGateway.focus();
				return false;
			}
			if (!isAbcIpAddress(dnsPrimary.value))
			{
				alert("The primary DNS server address is invalid!");
				dnsPrimary.focus();
				return false;
			}
			if (!isUseableIpAddress(dnsPrimary.value))
			{
				alert("The primary DNS server address is invalid!");
				dnsPrimary.focus();
				return false;
			}
			if (dnsSecondary.value != '' && !isAbcIpAddress(dnsSecondary.value))
			{
				alert("The secondary DNS server address is invalid!");
				dnsSecondary.focus();
				return false;
			}
			if (dnsSecondary.value != '' && !isUseableIpAddress(dnsSecondary.value))
			{
				alert("The secondary DNS server address is invalid!");
				dnsSecondary.focus();
				return false;
			}
		}
		if ((secIPv6Div.style.display != "none"))
		{
			if ('IPv4' != getRadioVal('IpVersion'))
			{
				if (TrIpv6Addr.style.display != "none")
				{
					if (!isGlobalIpv6Address(getValue('IdIpv6Addr')))
					{
						alert("The IPv6 address is not correct!");
						return false;
					}
					var v = getValue('IdIpv6PrefixLen');
					if(isPlusInteger(v) == false)
					{
						alert("The length of IPv6 prefix is not correct!");
						return false;
					}
					else
					{
						if ((v == "") || (v <= 0) || (v > 128))
						{
							alert("The length of IPv6 prefix is not correct!");
							return false;
						}
						if (v.length > 1 && v.charAt(0) == '0')
						{
							alert("The length of IPv6 prefix is not correct!");
							return false;
						}
					}
					if (!isUnicastIpv6Address(getValue('IdIpv6Dns1')))
					{
						alert("The primary DNS server IPv6 address is not correct!");
						return false;
					}
					var v1 = getValue('IdIpv6Dns2');
					if (v1 != '' && !isUnicastIpv6Address(v1))
					{
						alert("The secondary DNS server IPv6 address is not correct!");
						return false;
					}
				}
				var v2 = getValue('IdIpv6Gateway');
				if (v2 != '' && !isUnicastIpv6Address(v2))
				{
					alert("The IPv6 default gateway is not correct!");
					return false;
				}
			}
		}
		if ( 'none' != getElement('dslite_1').style.display )
		{
			if (getCheckVal('cb_enabledslite') == 1)
				enabledslite.value = 'Yes';
			else
				enabledslite.value = 'No';

			dsliteUsed.value = 'Yes';
		}
		else
			dsliteUsed.value = 'No';

		//if ( 'none' != getElement('ppp_bi').style.display )
		if('0' != ppp_bi_dis.value)
		{
			pppbiUsed.value = 'Yes';
			if ( getCheckVal('cb_enable_pppbi') == '1' )
			{
				if ( 1 == checkDupPPPBi() )
				{
					alert("Only support one WAN connection using the bridge mode!");
					return false;
				}
				enablepppbi.value = 'Yes';
			}
			else
				enablepppbi.value = 'No';
		}
		else
			pppbiUsed.value = 'No';
	}


	mode = getSelectVal('wanMode');
	ipMode = getRadioVal('IpMode');
	brMode = getSelectVal('bridgeMode');
	var type = getLinkType(mode,ipMode,brMode);
	var wanType = getWanType(mode,ipMode,brMode);
	var BindArray = new Array();
	var j = 0;
	for (var i = 1; i <= 4; i++)
	{
		var len = 'InternetGatewayDevice.LANDevice.1.'.length;
		if (getCheckVal('cb_bindlan'+i) == 1)
			BindArray[j++] = getValue('cb_bindlan'+i).substr(len);
		if (getCheckVal('cb_bindwireless'+i) == 1)
			BindArray[j++] = getValue('cb_bindwireless'+i).substr(len);
	}
	if (BindArray.length > 0)
	{
		for (var j = 0; j < Wan.length; j++)
		{
			if ((j != SelWanIndex) && (Wan[j].bind != ""))
			{
				if (mode == "Bridge")
				{
					for (i = 0; i < BindArray.length; i++)
					{
						if (Wan[j].bind.indexOf(BindArray[i]) >= 0)
						{
							alert('Bind options conflict with other WAN connections ,and please choose the binding interface again! But will not make any binding, if all bind options by other WAN binding!');
							return false;
						}
					}
				}
				else
				{
					if (getRadioVal('IpVersion') == 'IPv4')
					{
						if ((Wan[j].ConnectionType.indexOf("Bridge") >= 0)
						|| (Wan[j].xIpv4Enable == 1))
						{
							for (i = 0; i < BindArray.length; i++)
							{
								if (Wan[j].bind.indexOf(BindArray[i]) >= 0)
								{
									alert('Bind options conflict with other WAN connections ,and please choose the binding interface again! But will not make any binding, if all bind options by other WAN binding!');
									return false;
								}
							}
						}
					}
					else if (getRadioVal('IpVersion') == 'IPv6')
					{
						if ((Wan[j].ConnectionType.indexOf("Bridge") >= 0)
						|| (Wan[j].xIpv6Enable == 1))
						{
							for (i = 0; i < BindArray.length; i++)
							{
								if (Wan[j].bind.indexOf(BindArray[i]) >= 0)
								{
									alert('Bind options conflict with other WAN connections ,and please choose the binding interface again! But will not make any binding, if all bind options by other WAN binding!');
									return false;
								}
							}
						}
					}
					else
					{
						for (i = 0; i < BindArray.length; i++)
						{
							if (Wan[j].bind.indexOf(BindArray[i]) >= 0)
							{
								alert('Bind options conflict with other WAN connections ,and please choose the binding interface again! But will not make any binding, if all bind options by other WAN binding!');
								return false;
							}
						}
					}
				}
			}
		}
	}

	if (AddFlag == true)
	{
		var count = 0;
		var i;
		if (AddFlag == true)
		{
			for (i = 0; i < Wan.length; i++)
			{
				if (Wan[i].atmVpi == vpi && Wan[i].atmVci == vci)
				{
					count++;
				}
			}
			if (count >= 4)
			{
				alert('Only add four WAN connections under one PVC!');
				return false;
			}
		}
		count = 0;
		if (wanType == 'WANIPConnection') 
		{
			for (i = 0; i < Wan.length; i++)
			{
				if (Wan[i].wanConn == 'IPCon' && Wan[i].atmVpi == vpi && Wan[i].atmVci == vci)
				{
					count++;
				}
			}
			if (count >= 3)
			{
				alert('Only add three WAN connections using the mode of IPOE or birdge under one PVC!');
				return false;
			}
		}
		else if (mode == 'Bridge') 
		{
			for (i = 0; i < Wan.length; i++)
			{
				if ((Wan[i].ConnectionType == 'PPP' || Wan[i].ConnectionType == 'IP' || Wan[i].wanConn == 'IPCon')
						&& Wan[i].atmVpi == vpi
						&& Wan[i].atmVci == vci)
				{
					count++;
				}
			}
			if (count >= 3)
			{
				alert('Only add four WAN connections using the mode of PPPoE under one PVC!');
				return false;
			}
		}
		else 
		{
			for (i = 0; i < Wan.length; i++)
			{
				if ((Wan[i].wanConn == 'PPPCon' && Wan[i].ConnectionType == 'IP_Routed')
						&& Wan[i].atmVpi == vpi
						&& Wan[i].atmVci == vci)
				{
					count++;
				}
			}
			if (count >= 4)
			{
				alert('Only add four WAN connections using the mode of PPPoE under one PVC!');
				return false;
			}
		}
	}
	if (CntPvc.length >= 9 && GetWanIndexPvcByUse(vpi,vci) == -1)
	{
		if (AddFlag == true)
		{
			alert("Only create 8 PVC!");
			return false;
		}
	}
	return true;
}

function DisableInvisibleItems()
{
	var Inputs = document.getElementsByTagName("div");
	for (var i = 0; i < Inputs.length; i++)
	{
		if (Inputs[i].style.display == "none")
		{
			Inputs[i].disabled = true;
		}
	}
}

function ManualCntSubmit()
{
	if (AddFlag == true)
	{
		return;
	}
	setDisable('btnRemoveCnt',1);
	setDisable('btnOK',1);
	setDisable('btnAddCnt',1);
	setDisable('pppDialButton',1);
	document.ConfigForm.Wan_Flag.value = "4";
	if( true == setEBooValueCookie(document.ConfigForm) )
		document.ConfigForm.submit();
}

function resetText()
{
	var Inputs = document.getElementsByTagName("input");
	for (var i = 0; i < Inputs.length; i++)
	{
		if (Inputs[i].type == "text" || Inputs[i].type == "password" )
		{
			Inputs[i].value = '';
		}
	}
}

function AddOption(selItem,value,text,ifSelected)
{
	var option = document.createElement("option");
	option.innerHTML = text;
	option.value = value;
	option.selected = ifSelected;
	selItem.appendChild(option);
}

function RemoveOption(selItem,index)
{
	selItem.removeChild(selItem.options[index]);
}

function GetWanIndexPvcByUse(atmVpi,atmVci,exception)
{
	for (i = 0; i < Wan.length; i++)
	{
		if (Wan[i].atmVpi == atmVpi && Wan[i].atmVci == atmVci
				&& (exception == null || exception != i))
		{
			return i;
		}
	}
	return -1;
}

function GetWanIndexPvcByUseEx(atmVpi, atmVci, execption)
{
	for (i = 0; i < Wan.length; i++)
	{
		if ((Wan[i].atmVpi == atmVpi) &&
			(Wan[i].atmVci == atmVci) &&
			(execption != i) &&
			(Wan[i].Relating.domain == Wan[execption].Relating.domain))
		{
			return i;
		}
	}
	return -1;
}

function getSameWanList(index)
{
	var atmVpi = Wan[index].atmVpi;
	var atmVci = Wan[index].atmVci;
	var list = '';
	for (i = 0; i < Wan.length; i++)
	{
		if (i != index && Wan[i].atmVpi == atmVpi && Wan[i].atmVci == atmVci)
		{
			list += getWanList(list,i);
		}
	}
	return list;
}

function getDeleteDomainName()
{
	var Pvc = Wan[SelWanIndex].Relating;
	var index = Pvc.domain.lastIndexOf('.');
	var DslDomain = Pvc.domain.substr(0,index);
	var pos = GetWanIndexPvcByUseEx(Wan[SelWanIndex].atmVpi,
	Wan[SelWanIndex].atmVci,SelWanIndex);
	if (pos > -1)
	{
		return Wan[SelWanIndex].domain;
	}
	else
	{
		return DslDomain;
	}
}

function ClearStatusVar()
{
	wanList = '';
	pvcByUseIndex = -1;
	changePVCFlag = true;
}

function CancelAddCnt()
{
	with (getElById('ConfigForm'))
	{
		RemoveOption(getElement('wanId'),wanId.length - 1);
		AddFlag = false;
		btnAddCnt.disabled = false;
	}
}

function onCancel()
{
	var wanIdItem = getElement('wanId');
	if (wanIdItem.value == -1)
	{
		CancelAddCnt();
		if (wanIdItem.length > 0)
		{
			WanIdChange();
		}
	}
	else RefreshPage();
}

function getBind(bindstr,cb_str)
{
	if (getCheckVal(cb_str) == 1)
	{
		if (bindstr == '')
		{
			return getValue(cb_str);
		}
		else
		{
			return ',' + getValue(cb_str);
		}
	}
	return '';
}

function getChangeWanTypeUrl(CntType)
{
	var url = '';
	if (pvcByUseIndex == -1)
	{
		pvcByUseIndex = SelWanIndex;
	}
	url = 'dellist=' + wanList + '&';
	url += getAddWanUrl(CntType);
	return url;
}

function getLinkType(mode,ipMode,brMode)
{
	if (mode == "Route")
	{
		if (ipMode == 'PPPoA')
		{
			return 'PPPoA';
		}
		else if (ipMode == 'IPoA')
		{
			return 'IPoA';
		}
		else if (ipMode == 'CIP')
		{
			return 'CIP';
		}
		else
		{
			return 'EoA';
		}
	}
	else if (mode == "Bridge")
	{
		return 'EoA';
	}
}

function getWanType(mode,ipMode,brMode)
{
	var LinkType = getLinkType(mode,ipMode,brMode);
	if (mode == 'Bridge' && LinkType == 'EoA')
	{
		if (brMode == 'IP_Bridged')
		{
			return 'WANIPConnection';
		}
		else
		{
			return 'WANPPPConnection';
		}
	}
	if ((LinkType == 'EoA' && ipMode == 'PPPoE') || (LinkType == 'PPPoA'))
	{
		return 'WANPPPConnection';
	}
	else if ((LinkType == 'EoA' && ipMode != 'PPPoE') || (LinkType == 'IPoA') || (LinkType == 'CIP'))
	{
		return 'WANIPConnection';
	}
}

function addParam(Form,mode,ipMode,brMode)
{
	var serviceList = getValue('serviceList');
	var vpi = getValue('atmVpi');
	var vci = getValue('atmVci');
	Form.usingPrefix('y');
	var wanName = serviceList + '_' + mode.charAt(0) + '_' + vpi + '_' + vci;
	if ("OTHER" == serviceList)
	{
		wanName = 'Other' + '_' + mode.charAt(0) + '_' + vpi + '_' + vci;
	}
	Form.addParameter('Name',wanName);
	Form.addParameter('X_ATP_VLANEnabled',getCheckVal('enbl8021q'));
	if (getCheckVal('enbl8021q') == 1)
	{
		Form.addParameter('X_ATP_VLANID',getValue('vlan'));
	}
	if (getCheckVal('enbl8021d') == 1)
	{
		Form.addParameter('X_ATP_Priority',getValue('v8021P'));
	}
	else
	{
		Form.addParameter('X_ATP_Priority',255);
	}
	var bindstr = '';
	for (i = 1; i <= 4; i++)
	{
		bindstr = bindstr + getBind(bindstr,'cb_bindlan'+i);
		bindstr = bindstr + getBind(bindstr,'cb_bindwireless'+i);
	}
	Form.addParameter('X_CT-COM_LanInterface',bindstr);
	if (mode == 'Route')
	{
		Form.addParameter('ConnectionType','IP_Routed');
		if (ipMode == 'PPPoE')
		{
			Form.addParameter('Username',getValue('pppUserName'));
			var pwd = getValue('pppPassword');
			if (pwd != '@1GV)Z<!')
			{
				Form.addParameter('Password',pwd);
			}
			if (pwd == '@1GV)Z<!')
			{
				var Pword = Wan[SelWanIndex].pppPassword;
				Form.addParameter('Password', Pword);
			}
			Form.addParameter('ConnectionTrigger',getValue('DialMethod'));
			Form.addParameter('DNSEnabled', "1");
			Form.addParameter('DNSOverrideAllowed', "1");
			Form.addParameter('DNSServers','');
		}
		else if (ipMode == 'Static')
		{
			Form.addParameter('AddressingType',ipMode);
			Form.addParameter('ExternalIPAddress',getValue('wanIpAddress'));
			Form.addParameter('SubnetMask',getValue('wanSubnetMask'));
			Form.addParameter('DefaultGateway',getValue('defaultGateway'));
			var DnsStr = getValue('dnsPrimary') + ',' + getValue('dnsSecondary');
			Form.addParameter('DNSServers',DnsStr);
			Form.addParameter('DNSEnabled', "1");
			Form.addParameter('DNSOverrideAllowed', "0");
		}
		else if (ipMode == 'DHCP')
		{
			Form.addParameter('AddressingType',ipMode);
			Form.addParameter('DNSEnabled', "1");
			Form.addParameter('DNSOverrideAllowed', "1");
			Form.addParameter('DNSServers','');
			Form.addParameter('X_ATP_DHCPOptionCode',getValue('wanDhcpCode'));
		}
		else if (ipMode == 'IPoA')
		{
			Form.addParameter('AddressingType', "Static");
			Form.addParameter('ExternalIPAddress',getValue('wanIpAddress'));
			Form.addParameter('SubnetMask',getValue('wanSubnetMask'));
			Form.addParameter('DefaultGateway',getValue('defaultGateway'));
			var DnsStr = getValue('dnsPrimary') + ',' + getValue('dnsSecondary');
			Form.addParameter('DNSServers',DnsStr);
			Form.addParameter('DNSEnabled', "1");
			Form.addParameter('DNSOverrideAllowed', "0");
		}
		else if (ipMode == 'CIP')
		{
			Form.addParameter('AddressingType', "Static");
			Form.addParameter('ExternalIPAddress',getValue('wanIpAddress'));
			Form.addParameter('SubnetMask',getValue('wanSubnetMask'));
			Form.addParameter('DefaultGateway',getValue('defaultGateway'));
			var DnsStr = getValue('dnsPrimary') + ',' + getValue('dnsSecondary');
			Form.addParameter('DNSServers',DnsStr);
			Form.addParameter('DNSEnabled', "1");
			Form.addParameter('DNSOverrideAllowed', "0");
		}
		else if (ipMode == 'PPPoA')
		{
			Form.addParameter('Username',getValue('pppUserName'));
			var pwd = getValue('pppPassword');
			if (pwd != '@1GV)Z<!')
			{
				Form.addParameter('Password',pwd);
			}
			if (pwd == '@1GV)Z<!')
			{
				var Pword = Wan[SelWanIndex].pppPassword;
				Form.addParameter('Password', Pword);
			}
			Form.addParameter('ConnectionTrigger',getValue('DialMethod'));
			Form.addParameter('DNSEnabled', "1");
			Form.addParameter('DNSOverrideAllowed', "1");
			Form.addParameter('DNSServers','');
		}
		var enablNat = getCheckVal('cb_nat');
		if (enablNat == 0)
		{
			Form.addParameter('NATEnabled', 0);
		}
		else
		{
			Form.addParameter('NATEnabled', 1);
		}
	}
	else if (mode == 'Bridge')
	{
		Form.addParameter('ConnectionType',brMode);
		Form.addParameter('X_CT-COM_LanInterface-DHCPEnable',(getCheckVal('cb_dhcprelay')+1)%2);
		Form.addParameter('DNSEnabled', "0");
		Form.addParameter('DNSServers','');
		if (brMode == 'IP')
		{
			Form.addParameter('AddressingType','Static');
		}
	}
	if (mode == 'Route')
	{
		var IpVer = getRadioVal('IpVersion');
		var xIpv4Enable = 0;
		var xIpv6Enable = 0;
		if (IpVer == 'IPv4')
		{
			xIpv4Enable = 1;
			xIpv6Enable = 0;
		}
		else if (IpVer == 'IPv6')
		{
			xIpv4Enable = 0;
			xIpv6Enable = 1;
		}
		else
		{
			xIpv4Enable = 1;
			xIpv6Enable = 1;
		}
		Form.addParameter('X_CT-COM_IPv4Enable', xIpv4Enable);
		Form.addParameter('X_CT-COM_IPv6Enable', xIpv6Enable);
		if (1 == xIpv6Enable)
		{
			Form.addParameter('X_CT-COM_IPv6AddressingType', getSelectVal('IdIpv6AddrType'));
			if ('SLAAC' != getSelectVal('IdIpv6AddrType'))
			{
				Form.addParameter('X_CT-COM_IPv6DefaultGateway', getValue('IdIpv6Gateway'));
			}
			else
			{
				Form.addParameter('X_CT-COM_IPv6DefaultGateway', '');
			}
			if (getSelectVal('IdIpv6AddrType') == 'Static')
			{
				Form.addParameter('X_CT-COM_IPv6Address', getValue('IdIpv6Addr'));
				Form.addParameter('X_CT-COM_IPv6PrefixLength', getValue('IdIpv6PrefixLen'));
				if (getValue('IdIpv6Dns2') == '')
				{
					Form.addParameter('X_CT-COM_IPv6DNSServers', getValue('IdIpv6Dns1'));
				}
				else
				{
					Form.addParameter('X_CT-COM_IPv6DNSServers', getValue('IdIpv6Dns1') + ',' + getValue('IdIpv6Dns2'));
				}
				Form.addParameter('X_CT-COM_IPv6DNSEnabled', '1');
				Form.addParameter('X_CT-COM_IPv6DNSOverrideAllowed', '0');
			}
			else
			{
				Form.addParameter('X_CT-COM_IPv6Address', "");
				Form.addParameter('X_CT-COM_IPv6PrefixLength', '0');
				Form.addParameter('X_CT-COM_IPv6DNSEnabled', '1');
				Form.addParameter('X_CT-COM_IPv6DNSOverrideAllowed', '1');
				Form.addParameter('X_CT-COM_IPv6DNSServers', "");
			}
		}
	}
	else
	{
		Form.addParameter('X_CT-COM_IPv6Enable', '0');
	}
	Form.addParameter('Enable',getCheckVal('cb_enblService'));
	Form.addParameter('X_CT-COM_ServiceList',serviceList);
	Form.endPrefix();
	Form.usingPrefix('x');
	Form.addParameter('DestinationAddress','PVC:' + vpi + '/' + vci);
	var ATMQoS = getSelectVal('atmServiceCategory');
	Form.addParameter('ATMQoS',ATMQoS);
	Form.addParameter('Enable',1);
	switch (ATMQoS)
	{
		case "ubr+":
		case "cbr":
		Form.addParameter('ATMPeakCellRate',getValue('atmPeakCellRate'));
		break;
		case "nrt-vbr":
		case "rt-vbr":
		Form.addParameter('ATMPeakCellRate',getValue('atmPeakCellRate'));
		Form.addParameter('ATMSustainableCellRate',getValue('atmSustainedCellRate'));
		Form.addParameter('ATMMaximumBurstSize',getValue('atmMaxBurstSize'));
		break;
	}
	if (mode == 'Route')
	{
		if (ipMode == 'PPPoE')
		{
			Form.addParameter('LinkType','EoA');
		}
		else if (ipMode == 'PPPoA')
		{
			Form.addParameter('LinkType','PPPoA');
		}
		else if (ipMode == 'IPoA')
		{
			Form.addParameter('LinkType','IPoA');
		}
		else if (ipMode == 'CIP')
		{
			Form.addParameter('LinkType','CIP');
		}
		else
		{
			Form.addParameter('LinkType','EoA');
		}
	}
	else if (mode == 'Bridge')
	{
		Form.addParameter('LinkType','EoA');
	}
	Form.addParameter('ATMEncapsulation',getValue('encapMode'));
	Form.endPrefix();
}

function isLinkTypeDiffer(mode,ipMode,vpi,vci,exception)
{
	mode = getSelectVal('wanMode');
	ipMode = getRadioVal('IpMode');
	vpi = getValue('atmVpi')
	vci = getValue('atmVci');
	var brMode = getSelectVal('bridgeMode');
	var type = getWanType(mode,ipMode,brMode);
	for (i = 0; i < Wan.length; i++)
	{
		if (Wan[i].atmVpi == vpi && Wan[i].atmVci == vci
				&& (exception == null || exception != i))
		{
			if (type != Wan[i].LinkType)
			{
				return true;
			}
		}
	}
	return false;
}

function getAddWanUrl(CntType)
{
	if (pvcByUseIndex == -1)
	{
		url =  'x=InternetGatewayDevice.WANDevice.1.WANConnectionDevice.' + '&y=' + CntType;
	}
	else
	{
		var DslDomain = Wan[pvcByUseIndex].Relating.domain;
		var CntDomain = DslDomain.substr(0,DslDomain.lastIndexOf('.'));
		url = 'x=' + CntDomain + '&y=' + CntType;
	}
	return url;
}

function AddSubmitParam(Form,type)
{
	if (type == 0)
	{
		var DslList = "";
		var cb_Dsl = getElById('cb_dslEnable');
		for (i = 0; i < cb_Dsl.length; i++)
		{
			if (cb_Dsl[i].checked == true)
			{
				if(DslList == "")
				{
					DslList += cb_Dsl[i].value;
				}
			}
		}
		Form.addParameter('InternetGatewayDevice.WANDevice.1.WANDSLInterfaceConfig.ConfigMode', DslList);
		Form.setAction('set.cgi?RequestFile=html/network/wan1.asp');
	}
	else
	{
		var url;
		var mode = getSelectVal('wanMode');
		var ipMode = getRadioVal('IpMode');
		var brMode = getSelectVal('bridgeMode');
		var CntType = getWanType(mode,ipMode,brMode);
		vpi = getValue('atmVpi')
		vci = getValue('atmVci');
		pvcByUseIndex = -1;
		for (i = 0; i < Wan.length; i++)
		{
			if (((Wan[i].atmVpi == vpi && Wan[i].atmVci == vci)) && (i != SelWanIndex))
			{
				pvcByUseIndex = i;
				break;
			}
		}
		if (AddFlag == true)
		{
			url = 'addwan.cgi?' + getAddWanUrl(CntType);
		}
		else
		{
			var temp = Wan[SelWanIndex].domain.split('.');
			if ((Wan[SelWanIndex].atmVpi != vpi) || (Wan[SelWanIndex].atmVci != vci))
			{
				changePVCFlag = true;
			}
			else
			{
				changePVCFlag = false;
			}
			if (Wan[SelWanIndex].domain.indexOf(CntType) < 0)
			{
				if (changePVCFlag == true)
				{
					if (GetWanIndexPvcByUseEx(Wan[SelWanIndex].atmVpi,
					Wan[SelWanIndex].atmVci,SelWanIndex) > -1)
					{
						wanList = temp[4] + '.' + temp[5] + '.' + temp[6];
					}
					else
					{
						wanList = temp[4];
					}
					url = 'changewantype.cgi?dellist=' + wanList + '&' + getAddWanUrl(CntType);
				}
				else
				{
					wanList = temp[4] + '.' + temp[5] + '.' + temp[6];
					url = 'changewantype.cgi?' + getChangeWanTypeUrl(CntType)
				}
			}
			else
			{
				if (changePVCFlag == true)
				{
					var index = GetWanIndexPvcByUse(vpi,vci);
					if (index >= 0)
					{
						pvcByUseIndex = index;
						if (GetWanIndexPvcByUseEx(Wan[SelWanIndex].atmVpi,Wan[SelWanIndex].atmVci,SelWanIndex) >=0 )
						{
							wanList = temp[4] + '.' + temp[5] + '.' + temp[6];
						}
						else
						{
							wanList = temp[4];
						}
						url = 'changewantype.cgi?' + getChangeWanTypeUrl(CntType);
					}
					else
					{
						if (GetWanIndexPvcByUseEx(Wan[SelWanIndex].atmVpi,
						Wan[SelWanIndex].atmVci,SelWanIndex) > -1)
						{
							wanList = temp[4] + '.' + temp[5] + '.' + temp[6];
							url = 'changewantype.cgi?dellist=' + wanList + '&' + getAddWanUrl(CntType);
						}
						else
						{
							url = 'setcfg.cgi?x=' + Wan[SelWanIndex].Relating.domain + '&y=' + Wan[SelWanIndex].domain + '&RequestFile=html/network/wan1.asp';
						}
					}
				}
				else
				{
					url = 'setcfg.cgi?x=' + Wan[SelWanIndex].Relating.domain + '&y=' + Wan[SelWanIndex].domain + '&RequestFile=html/network/wan1.asp';
				}
			}
		}
		addParam(Form,mode,ipMode,brMode);
		Form.setAction(url);
		setDisable('btnRemoveCnt',1);
		setDisable('btnOK',1);
		setDisable('btnAddCnt',1);
	}
}

function VLANModeChg()
{
	with (getElById('ConfigForm'))
	{
		switch (VLANMode.value)
		{
			case 'TAG':
				setDisplay('vlansec', 1);
				//setDisplay('priosec', 1);
				setDisplay('mulvidsec', 1);
				vlanId.value = "Yes";
				vlanPri.value = "Yes";
			if ( 0 == v8021P.value.length )
				v8021P.value = '0';
			break;

			case 'UNTAG':
				setDisplay('vlansec', 0);
				setDisplay('priosec', 0);
				setDisplay('mulvidsec',0);
				vlanId.value = "No";
				vlanPri.value = "No";
			break;
			case 'TRANSPARENT':
				setDisplay('vlansec', 0);
				setDisplay('priosec', 0);
				setDisplay('mulvidsec', 1);
				vlanId.value = "No";
				vlanPri.value = "No";
			break;

			default:
			break;
		}
	}
}

var isNeedChange = 0;
function MTUDispChange()
{
	var mtudescrip = new Array('MTU[128-1492]:', 'MTU[576-1500]:', 'MTU[0,1280-1500]:', 'MTU[1280-1500]:','MTU[1320-1492]:','MTU[1320-1500]:');
	with (getElById('ConfigForm'))
	{
		if ( 'Route' == wanMode.value )
		{
			setDisplay('MTUsec', 1);
			if (AddFlag == true || isNeedChange)
			{
				isNeedChange = false;
				if (getSelectVal('linkMode') == 'linkPPP')
					MTU.value = 1492;
				else
					MTU.value = 1500;
			}

			if (getSelectVal('linkMode') == 'linkPPP')
			{
				if ('IPv4' == getRadioVal('IpVersion'))
					getElement("MIUDescrip").innerHTML = mtudescrip[0];
				else{
					if (getCheckVal('cb_enabledslite') == 1){
						getElement("MIUDescrip").innerHTML = mtudescrip[4];
					}else{
					getElement("MIUDescrip").innerHTML = mtudescrip[2];
			}
				}
			}
			else
			{
				if ('IPv4' == getRadioVal('IpVersion'))
					getElement("MIUDescrip").innerHTML = mtudescrip[1];
				else{
					if (getCheckVal('cb_enabledslite') == 1){
						getElement("MIUDescrip").innerHTML = mtudescrip[5];
					}else{
					getElement("MIUDescrip").innerHTML = mtudescrip[3];
			}
				}
			}
		}
		else
		{
			setDisplay('MTUsec', 0);
		}
	}
}

function MultiVIDDispChange()
{
	var svrList;

	with (getElById('ConfigForm'))
	{
		svrList = serviceList.value;
		if ( svrList.indexOf('INTERNET') >= 0 || svrList.indexOf('OTHER') >= 0 )
			setDisplay('mulvidsec', 1);
		else
			setDisplay('mulvidsec', 0);
	}
}

function dsliteShow()
{
	var ipVer;
	var svrList;
	var mode;
	var addrType;

	ipVer = getRadioVal('IpVersion');
	svrList = getSelectVal('serviceList');
	mode = getSelectVal('wanMode');

	if ( 'Route' == mode && 
		'IPv4' != ipVer && svrList.indexOf('INTERNET') >= 0)
	{
		setDisplay('dslite_1', 1);
		var modeObj = document.getElementsByName('dslitemode');
		if ( modeObj.length >= 2 )
		{
			modeObj[0].disabled = false;
			modeObj[1].disabled = false;
		}
		addrType = getSelectVal('IdIpv6AddrType');
		if ( 'Static' == addrType )
		{
			if ( modeObj.length >= 2 )
			{
				modeObj[0].disabled = true;
				modeObj[1].checked = true;
			}
		}
		cb_enabledsliteChange();
	}
	else
	{
		setDisplay('dslite_1', 0);
		setDisplay('dslite_2', 0);
		setDisplay('dslite_3', 0);
	}
}

function cb_enabledsliteChange()
{
	with (getElById('ConfigForm'))
	{
		if ( 1 == getCheckVal('cb_enabledslite') )
		{
			setDisplay('dslite_2', 1);
			dslitemodeChange();
		}
		else
		{
			setDisplay('dslite_2', 0);
			setDisplay('dslite_3', 0);
		}
	}
	MTUDispChange();
}

function dslitemodeChange()
{
	var mode;

	with (getElById('ConfigForm'))
	{
		mode = getRadioVal("dslitemode");
		switch (mode)
		{
			case '1':
				setDisplay('dslite_3', 1);
				break;
			default:
				setDisplay('dslite_3', 0);
				break;
		}
	}
}

var pdDefaultSel = 0;
function pdEnableShow()
{
	var ipVer;
	var mode;
	var svrList;

	ipVer = getRadioVal('IpVersion');
	mode = getSelectVal('wanMode');
	svrList = getSelectVal('serviceList');
	addrType = getSelectVal('IdIpv6AddrType');

	if ( 'Route' == mode && 'IPv4' != ipVer
		&& (svrList.indexOf('INTERNET') >= 0 || svrList.indexOf('OTHER') >= 0) )
	{
		setDisplay('PDEnableSec', 1);
		if ( svrList.indexOf('INTERNET') >= 0 && 1 == pdDefaultSel )
			setCheck('cb_enabledpd', 1);
		pdDefaultSel = 0;
		pdModeShow( getCheckVal('cb_enabledpd') );
	}
	else
	{
		setDisplay('PDEnableSec', 0);
		pdModeShow(0);
	}
}

function cb_pdEnableChange()
{
	var pdEnable = getCheckVal('cb_enabledpd');
	pdModeShow(pdEnable);
}

function pdModeShow( show )
{
	addrType = getSelectVal('IdIpv6AddrType');

	if ( 1 == show )
	{
		setDisplay('pdmode_1', 1);
		var modeObj = document.getElementsByName('pdmode');
		if ( modeObj.length >= 2 )
		{
			modeObj[0].disabled = false;
			modeObj[1].disabled = false;
		}

		if ( 'Static' == addrType )
		{
			if ( modeObj.length >= 2 )
			{
				modeObj[0].disabled = true;
				modeObj[1].checked = true;
			}
		}

		pdmodeChange();
	}
	else
	{
		setDisplay('pdmode_1', 0);
		pdStaticCfgShow(0);
	}
}

function pdmodeChange()
{
	var pdmode_sel;

	pdmode_sel = getRadioVal('pdmode');
	if ( 'No' == pdmode_sel )
		pdStaticCfgShow(1);
	else
		pdStaticCfgShow(0);
}

function pdStaticCfgShow( show )
{
	setDisplay('pdmode_2', show);
	setDisplay('pdmode_3', show);
	setDisplay('pdmode_4', show);
}

function CheckPDTime(Time1,Time2)
{
	var TemTime1 = Time1;
	var TemTime2 = Time2;

	if ( TemTime1.length > 10 || '' == TemTime1 )
		return 1;
	if ( TemTime2.length > 10 || '' == TemTime2 )
		return 2;
	if ( true != isPlusInteger(TemTime1))
		return 1;
	if ( true != isPlusInteger(TemTime2))
		return 2;

	TemTime1 = parseInt(Time1);
	TemTime2 = parseInt(Time2);
	if ( TemTime1 > 4294967295 || TemTime1 < 600 )
		return 1;
	if ( TemTime2 > 4294967295 || TemTime2 < 600 )
		return 2;
	if ( TemTime2 <= TemTime1 )
			return 3;

	return true;
}

var enabledhcpSel = 0;
function dhcpEnableShow()
{
	var svrList;

	svrList = getSelectVal('serviceList');
	if ( 'TR069' == svrList || 'VOICE' == svrList || 'TR069_VOICE' == svrList )
	{
		setDisplay('enabledhcpsec', 0);
		setCheck('cb_enabledhcp', 0);
	}
	else
	{
		setDisplay('enabledhcpsec', 1);
		if ( 1 == enabledhcpSel )
		{
			enabledhcpSel = 0;
			if ( svrList.indexOf('OTHER') >= 0 )
				setCheck('cb_enabledhcp', 0);
			else
				setCheck('cb_enabledhcp', 1);
		}
	}
}

function pppoeProxyShow()
{
	pppbiShow();
}

function ppp_proxy_bi_Change()
{
}

function pppbiShow()
{
	var mode;
	var linkMode;
	var svrList;

	mode = getSelectVal('wanMode');
	linkMode = getSelectVal('linkMode');
	svrList = getSelectVal('serviceList');

	if ( 'Route' == mode && 'linkPPP' == linkMode &&
			(svrList.indexOf('INTERNET') >= 0 || svrList.indexOf('OTHER') >= 0) )
	{
		setDisplay('ppp_bi', 0);
		ppp_bi_dis.value = '1';
	}
	else
	{
		setDisplay('ppp_bi', 0);
		ppp_bi_dis.value = '0';
	}
}

function ppp_dialMethodChg()
{
}
</SCRIPT>
<FORM name=ConfigForm id='ConfigForm' action="/cgi-bin/home_wan.asp" method="post">
<div id="pagestyle">
<div id="contenttype">
<div id="block1" class="main_item"> 
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;"> Set WAN Information </td>
	</tr>
	<tr style="display:none;">
		<td width=150>Connection Name:
			<input type="hidden" id="curSetIndex" name="curSetIndex" value="">
			<input type="hidden" id="WanActive" name="WanActive" value="">
			<input type="hidden" id="WanCurrIFIdx" name="WanCurrIFIdx" value='1'>
			<input type="hidden" id="ServiceListInt" name="ServiceListInt" value='TR069_INTERNET'>
			<input type="hidden" id="ppp_bi_dis" name="ppp_bi_dis" value='0'>
			<input type="hidden" id="easymesh" name="easymesh" value="Yes">
<script language="JavaScript" type="text/JavaScript">
var ipvChanged = 0;//flag of ip version whether changed

function CheckIpVersionState()
{
	var vForm = document.ConfigForm;
	ipvChanged = 0;
	vForm.IPVersionValue.value = "";
	var vValue = getRadioVal("IpVersion");
	if(vForm.IPVersionValue.value != vValue){
		if(vForm.IPVersionValue.value == "IPv4")
			ipvChanged = 1;
		else if(vForm.IPVersionValue.value == "IPv6")
			ipvChanged = 2;
		else ipvChanged = 3;
	}
	vForm.IPVersionValue.value = vValue;
	
	with (getElById('ConfigForm'))
	{
		if(IdIpv6AddrType.value == "SLAAC")
			pppv6Mode.value = "No";
		else if(IdIpv6AddrType.value == "DHCP")
			pppv6Mode.value = "Yes";
		else
			pppv6Mode.value = "N/A";
	}
}

function WanIndexConstruction(domain,WanName)
{
	this.domain = domain;
	this.WanName = WanName;
}
function CheckWansActives()
{
	var nCurTemp = 0;
	var vcurLinks = new Array(nEntryNum);

	for(var i=0; i<nEntryNum; i++)
	{
		vcurLinks[nCurTemp++] = new WanIndexConstruction(vEntryIndex[i], vEntryName[i]);
	}
	
	var vObjRet = new Array(nCurTemp+1);
	for(var m=0; m<nCurTemp; m++)
	{
		vObjRet[m] = vcurLinks[m];
	}
	vObjRet[nCurTemp] = null;
	return vObjRet;
}
var CurWan = CheckWansActives();
var WanNameObjs;

function WriteWanNameSelected()
{
	var WanIDNums = CurWan;
	var nlength = WanIDNums.length-1;
	var i = 0;
	var isSel = 0;
	var gotopts = 0;
	if(nlength == 1) 
		document.ConfigForm.curSetIndex.value = WanIDNums[0].domain;

	WanNameObjs = new Array(nlength)
	for( i=0; i< nlength; i++)
	{
		WanNameObjs[i] = new WanNameObject(WanIDNums[i].domain, WanIDNums[i].WanName, IFIdxArray[i]);
	}
	WanNameObjs.sort(WanNameSort);

	with (getElById('wanId'))
	{
		for( i=0; i< WanNameObjs.length; i++)
		{
			var opt = new Option(WanNameObjs[i].IfaceName, WanNameObjs[i].IfaceDomain);
			if ( document.ConfigForm.curSetIndex.value == WanNameObjs[i].IfaceDomain )
			{
				opt.selected = true
				isSel = i;
			}
			options.add ( opt );
			gotopts = 1;
		}
		if ( gotopts )
		{
			options[isSel].setAttribute('selected', 'true');
		}
	}
}

function getIFIdxvidDomain(domain)
{
	var i = 0;
	for( i=0; i< WanNameObjs.length; i++)
	{
		if ( domain == WanNameObjs[i].IfaceDomain )
			return WanNameObjs[i].IfaceIndex;
	}

	return 1;
}

function WanNameObject(IFDomain, IFName, IFIdx)
{
	this.IfaceDomain = IFDomain;
	this.IfaceName = IFName;
	this.IfaceIndex = IFIdx;
}

function v4v6BindCheck(curindex, v4BindIdx, v6BindIdx)
{
	if ( ( curindex == v4BindIdx && (-1 == v6BindIdx ) )
		|| ( curindex == v4BindIdx && curindex == v6BindIdx )
		|| ( curindex == v6BindIdx && (-1 == v4BindIdx ) )
		|| ( curindex == v6BindIdx && curindex == v4BindIdx ) )
		return 1;

	return 0;
}

/*type: */
/*0: Add action*/
/*1: Modify action*/
function	checkBandBoxStatus(type)
{
/*lan*/
	var strCurBind = "";
	var aCurBindFlag = new Array(12);
	aCurBindFlag[0] = "";
	if(aCurBindFlag[0] != "N/A")
	{
		aCurBindFlag[1] = "";
		aCurBindFlag[2] = "";
		aCurBindFlag[3] = "";
		aCurBindFlag[4] = "";
		aCurBindFlag[5] = "";
		aCurBindFlag[6] = "";
		aCurBindFlag[7] = "";
		aCurBindFlag[8] = "No";
		aCurBindFlag[9] = "No";
		aCurBindFlag[10] = "";
		aCurBindFlag[11] = "";
		aCurBindFlag[12] = "";
		aCurBindFlag[13] = "";
		for(k=0; k<14; k++)
		{
			strCurBind = strCurBind + aCurBindFlag[k] + ",";
		}
	}
	
	var strBindFlag = "";
	var nInterfaces = CurWan.length-1;
	var vForm = document.ConfigForm;
	if(vForm.cb_bindlan1.checked)
		vForm.bindlan1.value = "Yes";
	else vForm.bindlan1.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan1.value + ",";
	if(vForm.cb_bindlan2.checked)
		vForm.bindlan2.value = "Yes";
	else vForm.bindlan2.value = "No";
		strBindFlag = strBindFlag + vForm.bindlan2.value + ",";
	if(vForm.cb_bindlan3.checked)
		vForm.bindlan3.value = "Yes";
	else vForm.bindlan3.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan3.value + ",";
	if(vForm.cb_bindlan4.checked)
		vForm.bindlan4.value = "Yes";
	else vForm.bindlan4.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan4.value + ",";
/*wireless*/
	if(vForm.cb_bindwireless1.checked)
		vForm.bindwireless1.value = "Yes";
	else vForm.bindwireless1.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless1.value + ",";
	if(vForm.cb_bindwireless2.checked)
		vForm.bindwireless2.value = "Yes";
	else vForm.bindwireless2.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless2.value + ",";
	if(vForm.cb_bindwireless3.checked)
		vForm.bindwireless3.value = "Yes";
	else vForm.bindwireless3.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless3.value + ",";
	if(vForm.cb_bindwireless4.checked)
		vForm.bindwireless4.value = "Yes";
	else vForm.bindwireless4.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless4.value;
	strBindFlag = strBindFlag + ",No,No,";
/*wireless 5g*/
	if(vForm.cb_bindwirelessac1.checked)
		vForm.bindwirelessac1.value = "Yes";
	else vForm.bindwirelessac1.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac1.value + ",";
	if(vForm.cb_bindwirelessac2.checked)
		vForm.bindwirelessac2.value = "Yes";
	else vForm.bindwirelessac2.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac2.value + ",";
	if(vForm.cb_bindwirelessac3.checked)
		vForm.bindwirelessac3.value = "Yes";
	else vForm.bindwirelessac3.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac3.value + ",";
	if(vForm.cb_bindwirelessac4.checked)
		vForm.bindwirelessac4.value = "Yes";
	else vForm.bindwirelessac4.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac4.value;
	var aTemp1 = new Array();
	var aTemp2 = new Array();
	var aTemp3 = new Array();

	if(vBindStatus != "N/A")
	{
		aTemp1 = vBindStatus.split(',');
		aTemp2 = strBindFlag.split(',');
		aTemp3 = strCurBind.split(',');
		/*check ip version;*/
		var strIpversion = vForm.IPVersionValue.value;/*current ip version;*/
		if ( 'none' != getElement('dslite_1').style.display )
		{
			if (getCheckVal('cb_enabledslite') == 1)
				strIpversion = "IPv4/IPv6";
		}

		for(var i=0; i<14; i++)
		{
			if((aTemp1[i] == "Yes") && (aTemp2[i] == "Yes"))
			{
				if (1 == type) /* modify action*/
				{
					if ( ("IPv4" == strIpversion && vForm.curSetIndex.value == parseInt(aTemp1[42+2*i]))
						|| ("IPv6" == strIpversion && vForm.curSetIndex.value == parseInt(aTemp1[42+2*i+1]))
						|| ("IPv4/IPv6" == strIpversion && v4v6BindCheck(vForm.curSetIndex.value, parseInt(aTemp1[42+2*i]), parseInt(aTemp1[42+2*i+1]))) )
						continue;
				}
				if((("IPv4" == strIpversion) && (0 == aTemp1[14+2*i])) || (("IPv6" == strIpversion) && (0 == aTemp1[14+2*i+1]))){	
					continue;
				}
				var strindex;
				if(i < 4)
				{
					strindex = i+1;
					alert("Lan" + strindex.toString() + "have been binded with other Interface,and cannot repeat bind!");
				}
				else if(i >=4 && i < 8)
				{
					strindex = i - 3;
					alert("SSID" + strindex.toString() + "have been binded with other Interface,and cannot repeat bind!");
				}
				else
				{
					strindex = i - 9;
					alert("SSIDAC" + strindex.toString() + "have been binded with other Interface,and cannot repeat bind!");
				}
				return false;
			}
		}
	}
	return true;
}

function	checkBandBoxStatus1(type)
{
	var strCurBind = "";
	var aCurBindFlag = new Array(24);

	aCurBindFlag[0] = "";
	if(aCurBindFlag[0] != "N/A")
	{
		aCurBindFlag[1] = "";
		aCurBindFlag[2] = "";
		aCurBindFlag[3] = "";
		aCurBindFlag[4] = "";
		aCurBindFlag[5] = "";
		aCurBindFlag[6] = "";
		aCurBindFlag[7] = "";
		aCurBindFlag[8] = "";
		aCurBindFlag[9] = "";
		aCurBindFlag[10] = "";
		aCurBindFlag[11] = "";
		aCurBindFlag[12] = "";
		aCurBindFlag[13] = "";
		aCurBindFlag[14] = "";
		aCurBindFlag[15] = "";
		aCurBindFlag[16] = "";
		aCurBindFlag[17] = "";
		aCurBindFlag[18] = "";
		aCurBindFlag[19] = "";
		aCurBindFlag[20] = "";
		aCurBindFlag[21] = "";
		aCurBindFlag[22] = "";
		aCurBindFlag[23] = "";
		for(k=0; k<24; k++)
		{
			strCurBind = strCurBind + aCurBindFlag[k] + ",";
		}
	}
	
	var strBindFlag = "";
	var nInterfaces = CurWan.length-1;
	var vForm = document.ConfigForm;
	if(vForm.cb_bindlan1.checked)
		vForm.bindlan1.value = "Yes";
	else vForm.bindlan1.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan1.value + ",";
	if(vForm.cb_bindlan2.checked)
		vForm.bindlan2.value = "Yes";
	else vForm.bindlan2.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan2.value + ",";
	if(vForm.cb_bindlan3.checked)
		vForm.bindlan3.value = "Yes";
	else vForm.bindlan3.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan3.value + ",";
	if(vForm.cb_bindlan4.checked)
		vForm.bindlan4.value = "Yes";
	else vForm.bindlan4.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan4.value + ",";
	if(vForm.cb_bindlan5.checked)
		vForm.bindlan5.value = "Yes";
	else vForm.bindlan5.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan5.value + ",";
	if(vForm.cb_bindlan6.checked)
		vForm.bindlan6.value = "Yes";
	else vForm.bindlan6.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan6.value + ",";
	if(vForm.cb_bindlan7.checked)
		vForm.bindlan7.value = "Yes";
	else vForm.bindlan7.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan7.value + ",";
	if(vForm.cb_bindlan8.checked)
		vForm.bindlan8.value = "Yes";
	else vForm.bindlan8.value = "No";
	strBindFlag = strBindFlag + vForm.bindlan8.value + ",";
//wireless
	if(vForm.cb_bindwireless1.checked)
		vForm.bindwireless1.value = "Yes";
	else vForm.bindwireless1.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless1.value + ",";
	if(vForm.cb_bindwireless2.checked)
		vForm.bindwireless2.value = "Yes";
	else vForm.bindwireless2.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless2.value + ",";
	if(vForm.cb_bindwireless3.checked)
		vForm.bindwireless3.value = "Yes";
	else vForm.bindwireless3.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless3.value + ",";
	if(vForm.cb_bindwireless4.checked)
		vForm.bindwireless4.value = "Yes";
	else vForm.bindwireless4.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless4.value;
	strBindFlag = strBindFlag + ",";
	if(vForm.cb_bindwireless5.checked)
		vForm.bindwireless5.value = "Yes";
	else vForm.bindwireless5.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless5.value + ",";
	if(vForm.cb_bindwireless6.checked)
		vForm.bindwireless6.value = "Yes";
	else vForm.bindwireless6.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless6.value + ",";
	if(vForm.cb_bindwireless7.checked)
		vForm.bindwireless7.value = "Yes";
	else vForm.bindwireless7.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless7.value + ",";
	if(vForm.cb_bindwireless8.checked)
		vForm.bindwireless8.value = "Yes";
	else vForm.bindwireless8.value = "No";
	strBindFlag = strBindFlag + vForm.bindwireless8.value;
	strBindFlag = strBindFlag + ",";
/*wireless 5g*/
	if(vForm.cb_bindwirelessac1.checked)
		vForm.bindwirelessac1.value = "Yes";
	else vForm.bindwirelessac1.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac1.value + ",";
	if(vForm.cb_bindwirelessac2.checked)
		vForm.bindwirelessac2.value = "Yes";
	else vForm.bindwirelessac2.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac2.value + ",";
	if(vForm.cb_bindwirelessac3.checked)
		vForm.bindwirelessac3.value = "Yes";
	else vForm.bindwirelessac3.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac3.value + ",";
	if(vForm.cb_bindwirelessac4.checked)
		vForm.bindwirelessac4.value = "Yes";
	else vForm.bindwirelessac4.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac4.value;
	strBindFlag = strBindFlag + ",";
	if(vForm.cb_bindwirelessac5.checked)
		vForm.bindwirelessac5.value = "Yes";
	else vForm.bindwirelessac5.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac5.value + ",";
	if(vForm.cb_bindwirelessac6.checked)
		vForm.bindwirelessac6.value = "Yes";
	else vForm.bindwirelessac6.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac6.value + ",";
	if(vForm.cb_bindwirelessac7.checked)
		vForm.bindwirelessac7.value = "Yes";
	else vForm.bindwirelessac7.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac7.value + ",";
	if(vForm.cb_bindwirelessac8.checked)
		vForm.bindwirelessac8.value = "Yes";
	else vForm.bindwirelessac8.value = "No";
	strBindFlag = strBindFlag + vForm.bindwirelessac8.value + ",";
	strBindFlag = strBindFlag + "No,No";
	var aTemp1 = new Array();
	var aTemp2 = new Array();
	var aTemp3 = new Array();

	if(vBindStatus != "N/A")
	{
		aTemp1 = vBindStatus.split(',');
		aTemp2 = strBindFlag.split(',');
		aTemp3 = strCurBind.split(',');
		//*check ip version;*/
		var strIpversion = vForm.IPVersionValue.value;/*current ip version;*/
		if ( 'none' != getElement('dslite_1').style.display )
		{
			if (getCheckVal('cb_enabledslite') == 1)
					strIpversion = "IPv4/IPv6";
		}
		
		for(var i=0; i<26; i++)
		{
			if((aTemp1[i] == "Yes") && (aTemp2[i] == "Yes"))
			{
				if (1 == type) /* modify action*/
				{
					if ( ("IPv4" == strIpversion && vForm.curSetIndex.value == parseInt(aTemp1[78+2*i]))
						 || ("IPv6" == strIpversion && vForm.curSetIndex.value == parseInt(aTemp1[78+2*i+1]))
						 || ("IPv4/IPv6" == strIpversion && v4v6BindCheck(vForm.curSetIndex.value, parseInt(aTemp1[78+2*i]), parseInt(aTemp1[78+2*i+1]))) )
						continue;
				}
				if((("IPv4" == strIpversion) && (0 == aTemp1[26+2*i])) || (("IPv6" == strIpversion) && (0 == aTemp1[26+2*i+1]))){	
					continue;
				}

				var strindex;
				if(i < 8)
				{
					strindex = i+1;
					alert("Lan" + strindex.toString() + "have been binded with other Interface,and cannot repeat bind!");
				}
				else if(i >=8 && i < 16)
				{
					strindex = i - 7;
					alert("SSID" + strindex.toString() + "have been binded with other Interface,and cannot repeat bind!");
				}
				else
				{
					strindex = i - 15;
					alert("SSIDAC" + strindex.toString() + "have been binded with other Interface,and cannot repeat bind!");
				}

				return false;
			}
		}
	}
	return true;
}

function getENCAPstatus()
{
	with (getElById('ConfigForm'))
	{
		if(wanMode.value == "Bridge")
		{
			ISPTypeValue.value = "3";
			EnCAPFlag.value = "1483 Bridged IP LLC";
		}
		else
		{
			if(linkMode.value == "linkPPP")
			{
				ISPTypeValue.value = "2";//pppoe mode
				EnCAPFlag.value = "PPPoE LLC";
			}
			else
				EnCAPFlag.value = "1483 Bridged IP LLC";
		}
	}
}

function btnSave()
{
	if(checkVoipIdle() == false)
	{
		return false;
	}

	if(CheckForm(1) == false)
		return false;
	getENCAPstatus();
	CheckIpVersionState();
	cb_enblServiceChange();
	/*EnableDHCPRealy();*/
	var	vForm = document.ConfigForm;

	if(vForm.linkMode.value == "linkPPP")
	{
		DialMethodChange();
		setText('pppManualStatus_Flag', 'disconnect');
	}
	vForm.Wan_Flag.value = "1";
	if(AddFlag == true){
		vForm.OperatorStyle.value = "Add";/*add new*/
		if(checkBandBoxStatus1(0) == false)
		return false;
		vForm.WanCurrIFIdx.value = getMaxIFIdx();
	}
	else{
		vForm.OperatorStyle.value = "Modify";/*modify*/
		if(checkBandBoxStatus1(1) == false)
		return false;
	}
	
	//vForm.serviceList.value = "INTERNET";//???????
	//alert(vForm.serviceList.value);
	//VLANModeChg();
	setDisable('btnRemoveCnt',1);
	setDisable('btnOK',1);
	setDisable('btnAddCnt',1);
	var vlanModeOrg = wan_vlanmode;
	var vlanIdOrg= wan_vlan;
	if(vlanModeOrg != vForm.VLANMode.value || (vForm.VLANMode.value == "TAG" && vlanModeOrg == "TAG" && vlanIdOrg != vForm.vlan.value))
		vForm.vlanChangeFlag.value = "1";
	if( true == setEBooValueCookie(vForm) )
		vForm.submit();
}

function btnChangeTransMode()
{
	var vForm = document.ConfigForm;
	var oldTransMode = '';
	if(oldTransMode == vForm.transMode.value)
	{
		alert("Transmission mode switch is not performed!");
		return;
	}
	if (confirm("Are you sure you want to switch transmission mode and restart the device?") == false)
		return;

	vForm.Wan_Flag.value = "5";

	setDisable('btnRemoveCnt',1);
	setDisable('btnOK',1);
	setDisable('btnAddCnt',1);

	if( true == setEBooValueCookie(vForm) )
		vForm.submit();
}

function btnAddWanCnt()
{
	if ((CurWan.length-1) >= 8)
	{
		alert("Only create 8 WAN connections!");
		return;
	}
	if (AddFlag == true)
	{
		alert("Please save connection before create a new connection!");
		return;
	}
	AddFlag = true;
	resetText();
	with (getElById('ConfigForm'))
	{
		AddOption(getElementByName('wanId'),-1,'New WAN Connection',true);
		btnAddCnt.disabled = true;
		setSelect('linkMode', 'linkPPP');
		setSelect('serviceList','INTERNET');
		setText('ConnectionFlag', "Connect_Keep_Alive");
		setCheck('cb_enblService',1);
		setSelect('wanMode',"Route");
		setSelect('bridgeMode', "PPPoE_Bridged");
		lockObj('pppUserName',false);
		lockObj('pppPassword',false);
		lockObj('vlan',false);
		SelWanIndex = -1;
		enabledhcpSel = 1;
		WanModeChange();
		onChangeSvrList();
		IpMode[2].checked = true;
		IpModeChange();
		VLANModeChg();

		var LanNum = 4;
		for (var i = 0; i < LanNum; i++)
		{
			var checkString = 'cb_bindlan' + (i+1);
			setCheck(checkString,0);
		}

		var WlanNum = 8;
		for (var i = 0; i < WlanNum; i++)
		{
			checkString = 'cb_bindwireless' + (i+1);
			setCheck(checkString,0);
			checkString = 'cb_bindwirelessac' + (i+1);
			setCheck(checkString,0);
		}

		setRadio('pdmode', 'Yes');
		document.getElementById("table8").focus();
	}
}

function btnRemoveWanCnt()
{
	if ((CurWan.length - 1) == 0)
	{
		alert("Fail to delete because there is no WAN connection!");
		return;
	}
	if (AddFlag == true)
	{
		alert("Fail to delete because the new WAN connection is not saved!");
		return;
	}

	if(checkVoipIdle() == false)
	{
		return false;
	}
	
	if (confirm("Are you sure to delete the WAN connection?") == false)
		return;

	var	vForm = document.ConfigForm;
	vForm.Wan_Flag.value = "3";
	for(var i=0; i<(CurWan.length-1); i++)
	{
		if(CurWan[i].domain != vForm.curSetIndex.value)
		{
			vForm.afterdeleteFlag.value = CurWan[i].domain;
			break;
		}
	}
	setDisable('btnRemoveCnt',1);
	setDisable('btnOK',1);
	setDisable('btnAddCnt',1);
	vForm.OperatorStyle.value = "Del";
	if( true == setEBooValueCookie(vForm) )
		vForm.submit();
}

function OnIPv6Changed()
{
	with (getElById('ConfigForm'))
	{
		var linkstr = getSelectVal('linkMode');
		var AddrType = getSelectVal('IdIpv6AddrType');
		if (AddrType == 'SLAAC')
		{
			setDisplay('TrIpv6Addr', 0);
			setDisplay('TrIpv6Dns1', 0);
			setDisplay('TrIpv6Dns2', 0);
			setDisplay('TrIpv6GatewayInfo', 0);
			setDisplay('TrIpv6Gateway', 0);
			ISPTypeValue.value = "0";
		}
		else if (AddrType == 'DHCP')
		{
			setDisplay('TrIpv6Addr', 0);
			setDisplay('TrIpv6Dns1', 0);
			setDisplay('TrIpv6Dns2', 0);
			setDisplay('TrIpv6Gateway', 1);
			setDisplay('TrIpv6GatewayInfo', 1);
			ISPTypeValue.value = "0";
		}
		else if (AddrType == 'Static')
		{
			setDisplay('TrIpv6Addr', 1);
			setDisplay('TrIpv6Dns1', 1);
			setDisplay('TrIpv6Dns2', 1);
			setDisplay('TrIpv6Gateway', 1);
			setDisplay('TrIpv6GatewayInfo', 1);
			ISPTypeValue.value = "1";
		}
		dsliteShow();
		pdEnableShow();
	}
}
function WriteIPv6List(index)
{
	var vmode = new Array("No", "Yes", "N/A");
	var ctrl = getElById('IdIpv6AddrType');
	for(var i=0; i<ctrl.options.length;)
	{
		ctrl.removeChild(ctrl.options[i]);
	}
	if(index == 0)
	{
		var aMenu = new Array("SLAAC","DHCP");
		for(i=0; i<aMenu.length; i++)
		{
			ctrl.options.add(new Option(aMenu[i],aMenu[i]));
			if(vCurrentDHCPv6 == vmode[i])
			{
				document.ConfigForm.IdIpv6AddrType.selectedIndex = i;
			}
		}
	}
	else if(index == 1)
	{
		var aMenu = new Array("SLAAC","DHCP","Static");
		for(i=0; i<aMenu.length; i++)
		{
			ctrl.options.add(new Option(aMenu[i],aMenu[i]));
			if(vCurrentDHCPv6 == vmode[i])
			{
				document.ConfigForm.IdIpv6AddrType.selectedIndex = i;
			}
		}
	}
	else if(index == 2)
	{
		var aMenu = "Static";
		ctrl.options.add(new Option(aMenu,aMenu));
	}
	OnIPv6Changed();
}

function WanIdChange()
{
	document.ConfigForm.Wan_Flag.value = "2";
	document.ConfigForm.curSetIndex.value = getSelectVal('wanId');
	if( true == setEBooValueCookie(document.ConfigForm) )
		document.ConfigForm.submit();
}
</script>
</td>
	<td><label> 
		<select onChange=WanIdChange() name=wanId id='wanId' >
		</select>
		<script language=JavaScript type=text/javascript>
			WriteWanNameSelected();
		</script>
		<input type="hidden" id="Wan_Flag" name="Wan_Flag" value="0">
		<input type="hidden" id="EnCAPFlag" name="EnCAPFlag" value="PPPoE">
		<input type="hidden" id="PPPGetIpFlag" name="PPPGetIpFlag" value="Dynamic">
		<input type="hidden" id="ConnectionFlag" name="ConnectionFlag" value="">
		<input type="hidden" id="Enable_Flag" name="Enable_Flag" value="Yes">
		<input type="hidden" id="Disable_Flag" name="Disable_Flag" value="No">
		<input type="hidden" id="afterdeleteFlag" name="afterdeleteFlag" value="0">
		<input type="hidden" id="OperatorStyle" name="OperatorStyle" value="Add">
		<input type="hidden" id="dhcpv6pdflag" name="dhcpv6pdflag" value="Yes">
		<input type="hidden" id="vlanChangeFlag" name="vlanChangeFlag" value="0">
		<input type="hidden" id="pppManualStatus_Flag" name="pppManualStatus_Flag" value="">
		</label>
	</td>
	<td> <input id=btnAddCnt name=btnAddCnt onclick="btnAddWanCnt()" type=button value="New"> </td>
</tr>
<tr style="display:none;">
	<td width=150>Gateway Type:</td>
	<td width=200><label>
		<select id=select2 onChange=WanModeSelect() name="wanMode">
			<option value="Route" >Route 
			<option value="Bridge" >Bridge 
		</select>
		</label>
	</td>
	<td>Enable
		<label>
		<input id=cb_enblService onclick=cb_enblServiceChange() type=checkbox name=cb_enblService >
		<input id=enblService type=hidden name="enblService">
		</label></td></tr>
<tr style="display:none;">
	<td width=150>Bearer Service:</td>
	<td><label>
		<SELECT id=serviceList onchange=onSelectSvrList() name=serviceList> 
		</SELECT>
		 </label>
	</td>
	<td width=200>Note: If change voice wan connection service, please register voip service again.</td>
	<td>&nbsp;</td></tr>
<tr style="display:none;">
	<td width=150 height="32">Enable Binding:</td>
	<td width=306><label> 
		<input id=cb_bindflag onclick=cb_bindflagChange() type=checkbox name="cb_bindflag" >
		<input id=bindflag type=hidden value="" name="bindflag">
	</label></td></tr>
<div id=secBind>
<tr style="display:none;">
	<td width=150 height="20">Binding Option:</td>
	<td width="75"><label></label>
		<div id=secLan1><input id=cb_bindlan1 type=checkbox name=cb_bindlan1 > LAN1 
	<input id=bindlan1 type=hidden value=0 name=bindlan1> 
	</div>
	</td>
	<td width="75">
		<div id=secLan2>
			<input id=cb_bindlan2 type=checkbox name=cb_bindlan2 > LAN2 
			<input id=bindlan2 type=hidden value=0 name=bindlan2> 
		</div>
	</td>
	<td width="77">
			<div id=secLan3><input id=cb_bindlan3 type=checkbox name=cb_bindlan3 > LAN3
			<input id=bindlan3 type=hidden value=0 name=bindlan3> 
		</div>
	</td>
	<td width="79">
		<div id=secLan4>
		<input id=cb_bindlan4 type=checkbox name=cb_bindlan4 > LAN4 
		<input id=bindlan4 type=hidden value=0 name=bindlan4> 
		</div>
		<label></label></td></tr>
<tr id="LanBindExt" style="display:none;"> 
	<td width=150 height="20">&nbsp;</td>
	<td width="75"><label></label>
			<div id=secLan5><input id=cb_bindlan5 type=checkbox name=cb_bindlan5 > LAN5 
			<input id=bindlan5 type=hidden value=0 name=bindlan5> 
		</div>
	</td>
	<td width="75">
		<div id=secLan6>
			<input id=cb_bindlan6 type=checkbox name=cb_bindlan6 > LAN6 
			<input id=bindlan6 type=hidden value=0 name=bindlan6> 
		</div>
	</td>
	<td width="77">
			<div id=secLan7><input id=cb_bindlan7 type=checkbox name=cb_bindlan7 > LAN7
			<input id=bindlan7 type=hidden value=0 name=bindlan7> 
		</div>
	</td>
	<td width="79">
		<div id=secLan8>
			<input id=cb_bindlan8 type=checkbox name=cb_bindlan8 > LAN8 
			<input id=bindlan8 type=hidden value=0 name=bindlan8> 
		</div>
		<label></label></td></tr>
<table cellSpacing=0 cellPadding=0 width="100%" border=0 id="wlanBindTab" style="display:none;">
<tbody>
	<tr> 
		<td width=150 height="20">&nbsp;</td>
		<td width="75"><label></label>
		<div id=secWireless1>
			<input id=cb_bindwireless1 type=checkbox name=cb_bindwireless1 > SSID1
			<input id=bindwireless1 type=hidden value=0 name=bindwireless1> 
		</div></td>
		<td width="75">
			<div id=secWireless2>
			<input id=cb_bindwireless2 type=checkbox name=cb_bindwireless2 > SSID2 
			<input id=bindwireless2 type=hidden value=0 name=bindwireless2> </div></td>
		<td width="77">
			<div id=secWireless3>
			<input id=cb_bindwireless3 type=checkbox name=cb_bindwireless3 > SSID3 
			<input id=bindwireless3 type=hidden value=0 name=bindwireless3> 
			</div></td>
		<td width="79">
			<div id=secWireless4><input id=cb_bindwireless4 type=checkbox name=cb_bindwireless4 > SSID4 
			<input id=bindwireless4 type=hidden value=0 name=bindwireless4> 
			</div><label></label></td></tr>
	<tr id="wlanBindSSIDExt"> 
		<td width=150 height="20">&nbsp;</td>
		<td width="75"><label></label>
			<div id=secWireless5>
				<input id=cb_bindwireless5 type=checkbox name=cb_bindwireless5 > SSID5
				<input id=bindwireless5 type=hidden value=0 name=bindwireless5> 
			</div></td>
		<td width="75">
			<div id=secWireless6>
				<input id=cb_bindwireless6 type=checkbox name=cb_bindwireless6 > SSID6 <input id=bindwireless6 
			type=hidden value=0 name=bindwireless6> </div></td>
		<td width="77">
			<div id=secWireless7>
				<input id=cb_bindwireless7 type=checkbox name=cb_bindwireless7 > SSID7 
				<input id=bindwireless7 type=hidden value=0 name=bindwireless7> 
			</div></td>
		<td width="79">
			<div id=secWireless8><input id=cb_bindwireless8 type=checkbox name=cb_bindwireless8 > SSID8 
				<input id=bindwireless8 type=hidden value=0 name=bindwireless8> 
			</div><label></label></td></tr>
</tbody></table>
<table cellSpacing=0 cellPadding=0 width="100%" border=0 id="wlanacBindTab" style="display:none;">
<tbody>
	<tr> 
		<td width=150 height="20">&nbsp;</td>
		<td width="75"><label></label>
			<div id=secWirelessac1>
				<input id=cb_bindwirelessac1 type=checkbox name=cb_bindwirelessac1 > SSIDAC1
				<input id=bindwirelessac1 type=hidden value=0 name=bindwirelessac1> 
			</div></td>
		<td width="75">
			<div id=secWirelessac2>
				<input id=cb_bindwirelessac2 type=checkbox name=cb_bindwirelessac2 > SSIDAC2
				<input id=bindwirelessac2 type=hidden value=0 name=bindwirelessac2> 
			</div></td>
		<td width="77">
			<div id=secWirelessac3>
				<input id=cb_bindwirelessac3 type=checkbox name=cb_bindwirelessac3 > SSIDAC3 
				<input id=bindwirelessac3 type=hidden value=0 name=bindwirelessac3> 
			</div></td>
		<td width="79">
			<div id=secWirelessac4>
				<input id=cb_bindwirelessac4 type=checkbox name=cb_bindwirelessac4 > SSIDAC4
				<input id=bindwirelessac4 type=hidden value=0 name=bindwirelessac4> 
			</div><label></label></td></tr>
	<tr id="wlanacBindSSIDExt"> 
		<td width=150 height="20">&nbsp;</td>
		<td width="75"><label></label>
		<div id=secWirelessac5>
			<input id=cb_bindwirelessac5 type=checkbox name=cb_bindwirelessac5 > SSIDAC5
			<input id=bindwirelessac5 type=hidden value=0 name=bindwirelessac5> 
		</div></td>
		<td width="75">
			<div id=secWirelessac6>
				<input id=cb_bindwirelessac6 type=checkbox name=cb_bindwirelessac6 > SSIDAC6
				<input id=bindwirelessac6 type=hidden value=0 name=bindwirelessac6> 
			</div></td>
		<td width="77">
			<div id=secWirelessac7>
				<input id=cb_bindwirelessac7 type=checkbox name=cb_bindwirelessac7 > SSIDAC7 
				<input id=bindwirelessac7 type=hidden value=0 name=bindwirelessac7> 
			</div></td>
		<td width="79">
			<div id=secWirelessac8>
				<input id=cb_bindwirelessac8 type=checkbox name=cb_bindwirelessac8 > SSIDAC8
				<input id=bindwirelessac8 type=hidden value=0 name=bindwirelessac8> 
			</div><label></label></td></tr>
</tbody></table>
</div>
<table height=30 cellSpacing=0 cellPadding=0 width="100%" border=0 style="display:none;">
<tbody>
	<tr id='enabledhcpsec'>
		<td width=150 >DHCP ServerEnable
		</td>
		<td>
			<input id='cb_enabledhcp' type=checkbox name='cb_enabledhcp' >
			<input id='enable_dhcp' type=hidden name='enable_dhcp'>
<script language="JavaScript" type="text/JavaScript">
var max_lan_port_num = 8;
var ssid_idx = 0;
var real_lan_port_num = "";
var active_ssid_bit = 0;
var max_wlan_port_num = 8;
var real_wlan_port_num = "";
var max_wlan_ac_port_num = 8;
var real_wlan_ac_port_num = "";
var i;
for(i = (parseInt(real_lan_port_num) + 1); i <= max_lan_port_num; i++)
{
	setDisplay('secLan' + i, 0);
}
if( real_lan_port_num <= 4 )
	setDisplay('LanBindExt', 0);

/* wireless 24g */
for(i = (parseInt(real_wlan_port_num) + 1); i <= max_wlan_port_num; i++)
{
	setDisplay('secWireless' + i, 0);
}
if( real_wlan_port_num <= 4 )
	setDisplay('wlanBindSSIDExt', 0);

/* wireless 5g */
for(i = (parseInt(real_wlan_ac_port_num) + 1); i <= max_wlan_ac_port_num; i++)
{
	setDisplay('secWirelessac' + i, 0);
}
if( real_wlan_port_num <= 4 )
	setDisplay('wlanacBindSSIDExt', 0);
/* wireless 24g */
for( i = 0; i < 8; i++ )
{
	ssid_idx = i + 1;
	if( 1 << i & active_ssid_bit )
	{
		setDisable('cb_bindwireless' + ssid_idx, 0);
	}
	else
	{
		setDisable('cb_bindwireless' + ssid_idx, 0);
	}
}

/* wireless 5g */
for( i = 16; i < 24; i++ )
{
	ssid_idx = i - 16 + 1;
	if( 1 << i & active_ssid_bit )
	{
		setDisable('cb_bindwirelessac' + ssid_idx, 0);
	}
	else
	{
		setDisable('cb_bindwirelessac' + ssid_idx, 0);
	}
}

</script>
		</td>
	</tr>
</tbody></table>
<div id="div_isipv6sup">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;"> IP Version</td>
		<td align=left class="tabdata" id="ip_version">
			
			<script>
			if(wan_ipversion == "IPv4")
				document.getElementById("ip_version").innerHTML = "IPv4";
			else if(wan_ipversion == "IPv4/IPv6")
				document.getElementById("ip_version").innerHTML = "IPv4/IPv6";
			else
				document.getElementById("ip_version").innerHTML = "IPv6";
			</script>
		</td>
	</tr>
</table>
</div>
<div id=divLink>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<tbody>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;"> Connection Type</td>
		<td align=left class="tabdata">
			<label> 
				<SELECT id=linkMode onchange=linkModeSelect() name="linkMode">
					<!--<OPTION value="linkIP" >Connect via IP-->
					<!--<OPTION value="linkPPP" >-->
					<OPTION value="linkPPP" selected>PPPoE
				</SELECT>
</label></td></tr></tbody></table></div>
<div id=divIpVersion style="display:none">Protocol Version:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
	<input id=IpVersion onclick="pdDefaultSel=1;IpVersionChange();MTUDispChange();" type=radio value="IPv4" name="IpVersion" >IPv4&nbsp;&nbsp; 
	<input id=IpVersion onclick="pdDefaultSel=1;IpVersionChange();MTUDispChange();" type=radio value="IPv6" name="IpVersion" >IPv6&nbsp;&nbsp; 
	<input id=IpVersion onclick="pdDefaultSel=1;IpVersionChange();MTUDispChange();" type=radio value="IPv4/IPv6" name="IpVersion" >IPv4/IPv6&nbsp;&nbsp; 
</div>
<input type="hidden" id="IPVersionValue" name="IPVersionValue" value="IPv4/IPv6">
<input type="hidden" id="ISPTypeValue" name="ISPTypeValue" value="">
<div id=setNPT style="display:none">
	<table cellSpacing=0 cellPadding=0 width="100%" border=0>
		<tbody>
			<tr>
				<td width=150>NPTv6:</td>
				<td>
					<input type=checkbox id="NPT_enable" name="NPT_enable" >
					<input type="hidden" id="NPT_enable_value" name="NPT_enable_value" value="">
				</td>
			</tr>
		</tbody>
	</table>
</div>
<div id=secIpMode style="display:none">
<div id=secDhcp>
<table cellSpacing=0 cellPadding=0 width="100%" border=0>
<tbody>
	<tr>
		<td width=150 height="20"><input onclick="IpModeChange()" type=radio value="DHCP" id="IpMode_dynamic" name="IpMode" > DHCP</td>
		<td>Get an IP automatically from ISP.</td></tr></tbody></table></div>
<div id=secStatic>
<table cellSpacing=0 cellPadding=0 width="100%" border=0>
<tbody>
	<tr>
		<td width=150><input onclick="IpModeChange()" type=radio value="Static" id="IpMode_staic" name="IpMode" > Static</td>
		<td>Get a static IP from ISP.</td></tr></tbody></table></div>
<div id=secPppoe style="display:none">
<table cellSpacing=0 cellPadding=0 width="100%" border=0>
<tbody>
	<tr>
		<td width=150><input onclick="IpModeChange()" type=radio value="PPPoE" id="IpMode_PPPoE" name="IpMode" > PPPoE</td>
		<td>Please select if your ISP use PPPoE.</td></tr></tbody></table></div>
<div id=secPppoa>
<table style="DISPLAY: none" cellSpacing=0 cellPadding=0 
width="100%" border=0>
<tbody>
	<tr>
		<td width=150><input onclick="IpModeChange()" type=radio value="PPPoA" id="IpMode_PPPoA" name="IpMode" > PPPoA</td>
		<td>Please select if your ISP use PPPoA.</td></tr></tbody></table></div>
<div id=secIpoa>
<table style="DISPLAY: none" cellSpacing=0 cellPadding=0 
width="100%" border=0>
<tbody>
	<tr>
		<td width=150><input onclick="IpModeChange()" type=radio value="IPoA" id="IpMode_IPoA" name="IpMode" > IPoA</td>
		<td>Please select if your ISP use IPoA.</td>
	</tr></tbody></table></div><BR>
</div>
<div id=secBridgeType style="DISPLAY: none">
<table cellSpacing=0 cellPadding=0 width="100%" border=0>
	<tbody>
	<tr>
		<td width=150>Bridge Mode:</td>
		<td><label>
			<SELECT id=bridgeMode name="bridgeMode"> 
				<OPTION value="PPPoE_Bridged" >PPPoE_Bridged</OPTION> 
				<OPTION value="IP_Bridged" >IP_Bridged</OPTION></SELECT> 
</label></td></tr></tbody></table></div>
<div id=secbridgeDhcprelay style="DISPLAY: none">
<table cellSpacing=0 cellPadding=0 width="100%" border=0>
<tbody>
	<tr style="DISPLAY: none">
		<td width=150>Enable DHCP Transparent Transmission:</td>
		<td><label>
			<input id=cb_dhcprelay type=checkbox name=cb_dhcprelay onClick="EnableDHCPRealy()" >
			<input type="hidden" id="dhcprelay" name="dhcprelay" value="No">
		</label></td></tr></tbody></table></div>
<input id=multMode type=hidden value=0 name=multMode>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<tbody>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;">802.1q </td>
		<td align=left class="tabdata">
			<select id='VLANMode' onChange="VLANModeChg()" size=1 name='VLANMode'>
				<option value="TAG">Tag 
				<option value="UNTAG">Untag
				<script>
				var select = document.getElementById("VLANMode");
				if(wan_vlanmode == "TAG")
					select.selectedIndex = 0;
				else
					select.selectedIndex = 1;
			</script>
				<!--<option value="TRANSPARENT" >TRANSPARENT-->
			</select>
		</td>
	</tr>
	<tr id='vlansec' height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;"> VLAN ID</td>
		<td align=left class="tabdata">
			<input id=vlan maxLength=4 size=5 name=vlan>
			<script>
				document.getElementById("vlan").value = wan_vlan;
			</script>
			<input id=vlanId type=hidden name=vlanId value="No">
			<input id=vlanUNTAG type=hidden name=vlanUNTAG value="4096">
			<input id=vlanTRANSPARENT type=hidden name=vlanTRANSPARENT value="4097">
		<!--(range: 0~4095)-->(range: 1~4094) </td>
	</tr>
	<tr id='priosec' style="display:none">
		<td>802.1p[0-7]:</td>
		<td colspan='2'>
				<input id=v8021P maxLength=1 size=5 name=v8021P value="">
				<input id=vlanPri type=hidden name=vlanPri value="No">
				<input id=vlanPriNone type=hidden name=vlanPriNone value="0">
		</td>
	</tr>
</tbody>
</table>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;display:none">
	<tr id='mulvidsec' height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;"> Multi VLan Option</td>
		<td align=left class="tabdata">
			<input id=MulticastVID maxLength=4 size=5 name=MulticastVID value="">
			<script>
				document.getElementById("MulticastVID").value = wan_multicastVID;
			</script>
			<input type="hidden" id="MulVIDUsed" name="MulVIDUsed" value="No">
		<!--(range: -1~4095, -1 means no multi vlan)-->(range: 1~4094) </td>
	</tr>
</table>
<div id=secNat>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
<tbody>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;"> NAT Status</td>
		<td align=left class="tabdata"><label>
			<input id=cb_nat type=checkbox name=cb_nat onClick="EnableNatClick()">
			<input id=nat type=hidden name="nat">
			<script>
				if(wan_natenable == "1")
				{
					document.getElementById("cb_nat").checked = true;
					document.getElementById("nat").value = "Enable";
				}
				else
				{
					document.getElementById("cb_nat").checked = false;
					document.getElementById("nat").value = "Disabled";
				}
			</script>
</label></td></tr></tbody></table></div>
<div id=secIgmp>
<table cellSpacing=0 cellPadding=0 width="100%" border=0>
<tbody>
	<tr style="DISPLAY: none">
		<td width=150>Enable IGMP Proxy:</td>
		<td><label>
			<input id=cb_enblIgmp type=checkbox name="cb_enblIgmp" >
			<input id=enblIgmp type=hidden value="No" name=enblIgmp>
			</label></td></tr></tbody></table></div>
<BR>
<div id=secRouteItems>
<div id=secStaticItems style="DISPLAY: none">
<table cellSpacing=0 cellPadding=0 width="100%" border=0>
<tbody>
	<tr>
		<td width=150>IP Address:</td>
		<td><label><input id=wanIpAddress maxLength=15 size=15 name=wanIpAddress value=""> </label></td></tr>
	<tr>
		<td>Subnet Mask</td>
		<td><input id=wanSubnetMask maxLength=15 size=15 name=wanSubnetMask value="">
		</td>
	</tr>
	<tr>
		<td>Default Gateway:</td>
		<td><input id=defaultGateway maxLength=15 size=15 name=defaultGateway value=""></td></tr>
	<tr>
		<td>Primary DNS Server:</td>
		<td><input id=dnsPrimary maxLength=15 size=15 name=dnsPrimary value=""></td></tr>
	<tr>
		<td>Secondary DNS Server:</td>
		<td><input id=dnsSecondary maxLength=15 size=15 name=dnsSecondary value=""></td></tr></tbody></table></div>
<div id=secPppoeItems>
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
	<tr height="25px" style="width:100%;background:#e6e6e6;">
		<td align=left class="title-main" style="width:250px;padding-left:20px;" >
		Set PPPoE Information
		</td>
	</tr>
</table>
<table cellSpacing=0 cellPadding=0 width="100%" border=0>
<tbody>
	<tr height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;"> PPPoE Username</td>
		<td align=left class="tabdata"><label><input id=pppUserName style="FONT-FAMILY: 'Times New Roman'" maxLength=63 size=15 
		name=pppUserName>
			<script>
				document.getElementById("pppUserName").value = pppoe_name;
			</script>
		</label></td></tr>
	<tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;"> PPPoE Password</td>
		<td align=left class="tabdata" style="width:370px;">
			<span id="inpsw"><input id=pppPassword style="FONT-FAMILY: 'Times New Roman'" type=password maxLength=63 size=15 name=pppPassword>
			<script>
				document.getElementById("pppPassword").value = pppoe_pwd;
			</script>
			</span>
		</td>
	</tr>
	<tr height="30px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">PPPoE Connection Mode</td>
		<td align=left class="tabdata" style="width:370px;">
			<select name="wan_ConnectSelect" id="wan_ConnectSelect" size="1" onchange="WANChkIdleTimeT();">
				<option value="Connect_Keep_Alive">Always On 
				<option value="Connect_Manually">Connect Manually 
				<script>
				var select = document.getElementById("wan_ConnectSelect");
				if(wan_connection == "Connect_Manually")
					select.selectedIndex = 1;
				else
					select.selectedIndex = 0;
			</script>
			</select>
		</td>
	</tr>
	<tr id='MTUsec' height="30px">
		<td align=left class="tabdata" style="width:250px;padding-left:20px;" id='MIUDescrip'> TCP MTU Option</td>
		<td align=left class="tabdata">
			<input id=MTU maxLength=4 size=5 name=MTU>
			<script>
				document.getElementById("MTU").value = wan_mtu;
			</script>
		</td>
	</tr>
	<tr style="DISPLAY: none">
		<td>Server Name:</td>
		<td><input id=pppServerName style="FONT-FAMILY: 'Times New Roman'" maxLength=63 size=15 name=pppServerName>
		</td>
	</tr>
	<tr style='DISPLAY: none'>
		<td>Dial Mode:</td>
		<td><SELECT id=DialMethod style="WIDTH: 117px" onchange=DialMethodChange() name=DialMethod></SELECT>
		</td>
	</tr>
	<tr id=secManualDial style="DISPLAY: none">
		<td>&nbsp;</td>
		<td><input id=pppDialButton onclick=ManualCntSubmit() type=button value="Manual" name=pppDialButton> 
		</td></tr>
	<tr id=secIdleTime style="DISPLAY: none">
		<td>
			Idle Timeout[1-4320]
		</td>
		<td> 
			<input id=pppTimeOut maxLength=4 size=4 name=pppTimeOut>
			<input type="hidden" id="pppv6Mode" name="pppv6Mode" value="0">
		</td>
	</tr>
	<tr id='ppp_bi' style="display:none">
		<td>Enable PPPoE Router Bridge Mode:</td>
		<td>
			<input id='cb_enable_pppbi' type=checkbox name='cb_enable_pppbi' >
			<input id='enablepppbi' type=hidden name='enablepppbi'>
			<input id='pppbiUsed' type=hidden name='pppbiUsed'>
			<input id='pppbiDisabled' type=hidden name='pppbiDisabled' value='No'>
		</td>
	</tr>
</tbody></table></div></div><!--888-->
<div id=secIPv6Div style="display:none">
<table cellSpacing=0 cellPadding=0 width="100%" border=0>
<tbody>
	<tr id=TrIpv6AddrType>
		<td width=150>Style of Acquiring IPv6 WAN Information:</td>
		<td><select id="IdIpv6AddrType" style="WIDTH: 130px" onChange="pdDefaultSel=1;OnIPv6Changed();" name="IdIpv6AddrType">
			<option value="SLAAC" >SLAAC 
			<option value="DHCP" >DHCP
			<option value="Static" >Static 
			</select>
		</td>
	</tr>
	<tr id=TrIpv6Addr>
		<td>IPv6Address:</td>
		<td><input id=IdIpv6Addr maxLength=39 size=36 name=IdIpv6Addr value="">&nbsp;/ 
			<input id=IdIpv6PrefixLen maxLength=3 size=3 name=IdIpv6PrefixLen value=""> 
	</td></tr>
	<tr id=TrIpv6Gateway>
		<td>IPv6Default Gateway:</td>
		<td><input id=IdIpv6Gateway maxLength=39 size=36 name=IdIpv6Gateway value="">
		<script language="JavaScript" type="text/JavaScript">
		var ipv6gwstr = "";
		if("N/A" == ipv6gwstr)
			setText('IdIpv6Gateway', "");
		else
			setText('IdIpv6Gateway', ipv6gwstr);
		</script></td></tr>
	<tr id="TrIpv6GatewayInfo">
		<td></td>
		<td>(Automatically acquire if IPv6 default gateway is empty)</td></tr>
	<tr id=TrIpv6Dns1>
		<td>Primary IPv6 DNS Server</td>
		<td><input id=IdIpv6Dns1 maxLength=39 size=36 name=IdIpv6Dns1 value=""></td></tr>
	<tr id=TrIpv6Dns2>
		<td>Secondary IPv6 DNS Server</td>
		<td><input id=IdIpv6Dns2 maxLength=39 size=36 name=IdIpv6Dns2 value="">
		</td></tr>
	<tr id='PDEnableSec'>
		<td id='PDEnableDescrip'>Enable PD:</td>
		<td>
			<input id='cb_enabledpd' type=checkbox onclick='cb_pdEnableChange()' name='cb_enabledpd' >
			<input id='enablepd' type=hidden name='enablepd'>
			<input id='PDUsed' type=hidden name='PDUsed'>
			<input id='PDDisabled' type=hidden name='PDDisabled' value='No'>
		</td>
	</tr>
	<tr id='pdmode_1'>
		<td>Prefix Mode:</td>
		<td>
			<input id='pdmode' onclick='pdmodeChange()' type=radio value="Yes" name="pdmode" checked>Auto&nbsp;&nbsp; 
			<input id='pdmode' onclick='pdmodeChange()' type=radio value="No" name="pdmode" >Manual&nbsp;&nbsp; 
			<input id='pdmodeUsed' type=hidden name='pdmodeUsed'>
			<input id='pdmodeDisabled' type=hidden name='pdmodeDisabled' value='No'>
			<input id='pdmodeAuto' type=hidden name='pdmodeAuto' value='PrefixDelegation'>
			<input id='pdmodeStatic' type=hidden name='pdmodeStatic' value='Static'>
			<input id='pdmodeNone' type=hidden name='pdmodeNone' value='None'>
		</td>
	</tr>
	<tr id='pdmode_2'>
		<td>Prefix Address:</td>
		<td>
			<input id='pdprefix' maxLength=39 size=36 name='pdprefix' value="">
		</td>
	</tr>
	<tr id='pdmode_3'>
		<td>Primary Time:</td>
		<td>
			<input id='pdprefixptime' maxLength=10 size=10 name='pdprefixptime' value="">
			<STRONG style="COLOR: #ff0033">*</STRONG>[600 - 4294967295 s]
		</td>
	</tr>
	<tr id='pdmode_4'>
		<td>Lease Time:</td>
		<td>
			<input id='pdprefixvtime' maxLength=10 size=10 name='pdprefixvtime' value="">
			<STRONG style="COLOR: #ff0033">*</STRONG>[600 - 4294967295 s]
		</td>
	</tr>
	<tr id='dslite_1'>
		<td>DS-LiteEnable</td>
		<td>
			<input id='cb_enabledslite' onclick=cb_enabledsliteChange() type=checkbox name='cb_enabledslite' >
			<input id='enabledslite' type=hidden name='enabledslite'>
			<input id='dsliteUsed' type=hidden name='dsliteUsed'>
			<input id='dsliteDisabled' type=hidden name='dsliteDisabled' value='No'>
		</td>
	</tr>
	<tr id='dslite_2'>
		<td>DS-LiteGateway Type:</td>
		<td>
			<input id='dslitemode' onclick='dslitemodeChange()' type=radio value="0" name="dslitemode" >Auto&nbsp;&nbsp; 
			<input id='dslitemode' onclick='dslitemodeChange()' type=radio value="1" name="dslitemode" >Manual&nbsp;&nbsp; 
		</td>
	</tr>
	<tr id='dslite_3'>
		<td>DS-LiteServer:</td>
		<td>
			<input id='dsliteaddress' maxLength=39 size=36 name='dsliteaddress' value="">
		</td>
	</tr>
</tbody></table></div>
<label></label><BR>
	<!--<LEFT> 
	<input id=btnRemoveCnt name=btnRemoveCnt onclick="btnRemoveWanCnt()" type=button value="Delete Connection">
	</LEFT>--></td>
</tr>
	<tr>
		<td><input id=pppIdleTimeout type=hidden value=0 name=pppIdleTimeout>
			<input type=hidden name=xponstate value="Yes">
			<input type='hidden' id='Option60Enable1' name='Option60Enable1' value="">
			<input type='hidden' id='Option60Enable2' name='Option60Enable2' value="">
			<input type='hidden' id='Option60Enable3' name='Option60Enable3' value="">
			<input type='hidden' id='Option60Enable4' name='Option60Enable4' value="">
			<input type='hidden' id='Option60Type1' name='Option60Type1' value="">
			<input type='hidden' id='Option60Type2' name='Option60Type2' value="">
			<input type='hidden' id='Option60Type3' name='Option60Type3' value="">
			<input type='hidden' id='Option60Type4' name='Option60Type4' value="">
			<input type='hidden' id='Option60ValueMode1' name='Option60ValueMode1' value="">
			<input type='hidden' id='Option60ValueMode2' name='Option60ValueMode2' value="">
			<input type='hidden' id='Option60ValueMode3' name='Option60ValueMode3' value="">
			<input type='hidden' id='Option60ValueMode4' name='Option60ValueMode4' value="">
			<input type='hidden' id='Option60Value1' name='Option60Value1' value="">
			<input type='hidden' id='Option60Value2' name='Option60Value2' value="">
			<input type='hidden' id='Option60Value3' name='Option60Value3' value="">
			<input type='hidden' id='Option60Value4' name='Option60Value4' value="">
		</td></tr></tbody></table>
<div id="button0" class="main_item">
	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
		<tr height="25px">
			<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Save" to save your settings</td>
		</tr>
	</table>
	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
		<tr height="40px">
			<td width="250px" align=left class="tabdata" style="padding-left:20px;">
				<input type="button" name="btnOK" id ="btnOK" class="button1" value="Save" onClick="btnSave()" >
			</td>
			<td width="160" class="orange"></td>
		</tr> 
	</table>
	<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="display:none">
	<tr height="40px">
		<td width="250px" align=left class="tabdata" style="padding-left:20px;">
			<input id=btnRemoveCnt name=btnRemoveCnt onclick="btnRemoveWanCnt()" type=button value="Delete Connection">
			<input id=btnAddCnt name=btnAddCnt onclick="btnAddWanCnt()" type=button value="New">
		</td>
		<td width="160" class="orange"></td>
	</tr> 
</table></div>
</div><!--id="contenttype"-->
</div></FORM>
<script language="JavaScript">
function lockObj(objName, readST)
{
	if ( null != getElById(objName) )
	{
		getElById(objName).readOnly = readST;
		getElById(objName).style.color = readST ? 'gray' : '';
	}
}
var UsernameOpenFlag = "";
var PasswordOpenFlag = "";
var VLANIDOpenFlag = "";
if(UsernameOpenFlag == "0")
	lockObj('pppUserName', true);
if(PasswordOpenFlag == "0")
	lockObj('pppPassword', true);
if(VLANIDOpenFlag == "0")
	lockObj('vlan', true);
</script>
</BODY></HTML>
