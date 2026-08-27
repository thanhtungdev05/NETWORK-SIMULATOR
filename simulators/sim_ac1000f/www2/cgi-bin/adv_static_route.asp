
<HTML><HEAD>
<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE">
<META http-equiv=Content-Script-Type content=text/javascript>
<META http-equiv=Content-Style-Type content=text/css>
<META http-equiv=Content-Type content="text/html; charset=&#10;UTF-8">
<LINK href="/style.css" type=text/css rel=stylesheet>

<style  type="text/css">

*{color:  #404040;}

table td
{
margin:5 0;padding:5 0;
}



</style>


<SCRIPT language=javascript>



var aryISP = new Array("2","2", "2", "2", "2", "2", "2", "1","3","3","3");


function doGatewayCheck()
{
   	if (document.forms[0].Route_PVCGateway[0].checked == true){
        document.forms[0].staticGatewayIP.disabled = false;
		    document.forms[0].Route_PVC_Index.disabled = true;
	}
	else{
	    document.forms[0].staticGatewayIP.disabled = true;
		  document.forms[0].Route_PVC_Index.disabled = false;
		  document.forms[0].Route_PVC_Index.options.selectedIndex = "N/A";
		  
   }
}	

function isValidIpAddrRoute(ip1,ip2,ip3,ip4) {
    if(ip1==0 || ip4==255 || ip1==127 )
        return false;

    return true;
}

function valDoValidateIPRoute(Address) {
    var address = Address.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
    var digits;
    var i;
    var error=null;

    if(address == null) {
        alert('Invalid destination IP address!');
        error="Invalid destination IP address";
        return false;
    }
    else {
        digits = address[0].split(".");
        for(i=0; i < 4; i++) {
            if((Number(digits[i]) > 255 ) || (Number(digits[i]) < 0 ) || (Number(digits[0]) > 223) || (digits[i] == null)) {
                alert('Invalid destination IP address!');
              	error="Invalid IP address";
              	return false;
              	break;
            }
        }

        if((Number(digits[0])==0) && (Number(digits[1])==0) && (Number(digits[2])==0) && (Number(digits[3])==0))
        {
              	alert("Invalid destination IP address: "+Address);
              	return false;
        }

        if(!isValidIpAddrRoute(digits[0],digits[1],digits[2],digits[3],false)) {
         	alert('Invalid destination IP address!');
        	return false;
        }
    }
    return error;
}

function IPCheckRoute(address) {
    var message;
    if (address.value != "N/A") {
        message = valDoValidateIPRoute(address.value);
        if(message!=null) {
            address.focus();
            return false;
        }
   }
   return true;
}

function isValidIpAddr(ip1,ip2,ip3,ip4) {
    if(ip1==0 || ip4==0 || ip4==255 || ip1==127 )
        return false;

    return true;
}

function valDoValidateIP(Address) {
    var address = Address.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
    var digits;
    var i;
    var error=null;

    if(address == null) {
        alert('Invalid IP address!');
        error="Invalid IP address";
        return false;
    }
    else {
        digits = address[0].split(".");
        for(i=0; i < 4; i++) {
            if((Number(digits[i]) > 255 ) || (Number(digits[i]) < 0 ) || (Number(digits[0]) > 223)) {
                alert('Invalid IP address!');
              	error="Invalid IP address";
              	return false;
              	break;
            }
        }

        if((Number(digits[0])==1) && (Number(digits[1])==0) && (Number(digits[2])==0) && (Number(digits[3])==0))
            return error;

        if(!isValidIpAddr(digits[0],digits[1],digits[2],digits[3],false)) {
            alert('Invalid IP address!');
        	return false;
        }
    }
    return error;
}

function IPCheck(address) {
    var message;
    if (address.value != "N/A") {
        message = valDoValidateIP(address.value);
        if(message!=null) {
     	    address.focus();
     	    return false;
        }
    }
    return true;
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


function metricCheck() {

	var value = document.forms[0].staticMetric.value;

	if (!isNumeric(value)) {
		alert("Value for Metric must be in decimal and between 0 and 15");
		return true;
	}

	if (value < 0 || value > 15) {
		alert("Value for Metric must be between 0 and 15");
		return true;
	}

	return false;
}

function trans_to_realindex(now_index) {
	var pvc = now_index;
	var hasAtm=0, hasPtm=0, hasWan0=0, hasPon=0;





	hasPon = 1;


	if(hasAtm==1 && hasPtm==0 && hasWan0==1){
		//AtmEther, no Ptm

		if(pvc==8) //ether
			pvc = 10;
			
	}

	if(hasAtm==0 && hasPtm==1 && hasWan0==1){
		//PtmEther, no Atm

		if(pvc==0) //ptm0
			pvc = 8;
		else if(pvc==1) //ptm1
			pvc = 9;
		else if(pvc==2) //ether
			pvc = 10;
		
		}

	if(hasAtm==0 && hasPtm==1 && hasWan0==0){
		//Ptm, no AtmEther

		if(pvc==0) //ptm0
			pvc = 8;
		else if(pvc==1) //ptm1
			pvc = 9;
			
	}

	if(hasAtm==0 && hasPtm==0 && hasWan0==1){
		//Ether, no AtmPtm

		if(pvc==0) //ether
			pvc = 10;

		}
	if(hasAtm==1 && hasPtm==1 && hasWan0==1){
	//Ether,Atm,Ptm
	
			if(pvc==9) //ether
				pvc = 10;
	
	}
	if (hasPon==1){
		// Fiber
		pvc = now_index;
	}
	return pvc;
}

function SubnetCheckRouter(mask,IPAddr) {
//cindy modify start
	mask=document.Static_Eng.staticSubnetMask;
	IPAddr=document.Static_Eng.staticDestIP;
	var v=mask.value;
	var addr = IPAddr.value.split(".");
	var digits = v.split(".");
	if ( !((v == "128.0.0.0")||
		(v == "192.0.0.0")||
		(v == "224.0.0.0")||
		(v == "240.0.0.0")||
		(v == "248.0.0.0")||
		(v == "252.0.0.0")||
		(v == "254.0.0.0")||
		(v == "255.0.0.0")||
		(v == "255.128.0.0")||
		(v == "255.192.0.0")||
		(v == "255.224.0.0")||
		(v == "255.240.0.0")||
		(v == "255.248.0.0")||
		(v == "255.252.0.0")||
		(v == "255.254.0.0")||
		(v == "255.255.0.0")||
		(v == "255.255.128.0")||
		(v == "255.255.192.0")||
		(v == "255.255.224.0")||
		(v == "255.255.240.0")||
		(v == "255.255.248.0")||
		(v == "255.255.252.0")||
		(v == "255.255.254.0")||
		(v == "255.255.255.0")||
		(v == "255.255.255.128")||
		(v == "255.255.255.192")||
		(v == "255.255.255.224")||
		(v == "255.255.255.240")||
		(v == "255.255.255.248")||
		(v == "255.255.255.252")||
		(v == "255.255.255.254")||
		(v == "255.255.255.255")) )
	{
		alert("Invalid subnet mask: ");
		mask.focus();
		v = "0.0.0.0";
		return false;
	}
	
	//cindy add start 
	if((Number(addr[3])==0)&&(Number(digits[3])==255))
	{
		alert("Invalid subnet mask: ");
		return false;
	}
//cindy modify end
	return true;
}

var routecount = 16;
function stStaticRoute(domain,DestIPAddress)
{
	this.domain = domain;
	this.DestIPAddress = DestIPAddress;
}
function getStaticRouteInfo()
{
	var	nCurTemp = 0;
	var	vDestIPAddress = new Array(routecount);
	var	vcurLinks = new Array(routecount);
	
	vDestIPAddress[0] = "N/A";
	vDestIPAddress[1] = "N/A";
	vDestIPAddress[2] = "N/A";
	vDestIPAddress[3] = "N/A";
	vDestIPAddress[4] = "N/A";
	vDestIPAddress[5] = "N/A";
	vDestIPAddress[6] = "N/A";
	vDestIPAddress[7] = "N/A";
	vDestIPAddress[8] = "N/A";
	vDestIPAddress[9] = "N/A";
	vDestIPAddress[10] = "N/A";
	vDestIPAddress[11] = "N/A";
	vDestIPAddress[12] = "N/A";
	vDestIPAddress[13] = "N/A";
	vDestIPAddress[14] = "N/A";
	vDestIPAddress[15] = "N/A";
	
	for(var i=0; i<routecount; i++)
	{
		if(vDestIPAddress[i] != "N/A")
			vcurLinks[nCurTemp++] = new stStaticRoute(i, vDestIPAddress[i]);
	}
	var	vObjRet = new Array(nCurTemp+1);
	for(var m=0; m<nCurTemp; m++)
	{
		vObjRet[m] = vcurLinks[m];
	}
	vObjRet[nCurTemp] = null;
	return vObjRet;
}
var StaticRouteInfo = getStaticRouteInfo();

function doSubmit(index) {
	var pvc= document.forms[0].Route_PVC_Index.options.selectedIndex;
	var mask = document.forms[0].staticSubnetMask;
	var destIP = document.forms[0].staticDestIP;

	document.forms[0].EditFlag.value=index;
	document.forms[0].RouteActive.value="Yes";

	if(index)
	{
	
		var strdstIPtmp = "N/A";
		var stripvalue = document.forms[0].staticDestIP.value;
		if ((strdstIPtmp == "N/A") || ((strdstIPtmp != "N/A") && (stripvalue != strdstIPtmp))) {
			for (i = 0; i < StaticRouteInfo.length - 1; i++)
			{
				if (StaticRouteInfo[i].DestIPAddress == stripvalue)
				{
					alert(stripvalue + ' has added!');
					return false;
				}
			}
		}
		
		if (metricCheck()) return false;
		if(!IPCheckRoute(document.forms[0].staticDestIP)) return false;
		if (document.forms[0].Route_PVCGateway[0].checked)
			if(!IPCheck(document.forms[0].staticGatewayIP)) return false;

		if (document.forms[0].Route_PVCGateway[1].checked) {	

			var strpvc = trans_to_realindex(document.forms[0].Route_PVC_Index.options.selectedIndex);
			document.forms[0].pvc_index.value = strpvc;
			var strisptmp = aryISP[strpvc];


			if ((strisptmp == "0") || (strisptmp == "1")){
				alert("Can not choose WAN on MER mode!");
				return false;
			}
			else if(strisptmp == "3") {
				alert("Can not choose WAN on Bridge mode!");
				return false;
			}
			
			

		}
		if(!SubnetCheckRouter(mask,destIP))
		{ 
			return false;
		}
		if((destIP.value != "0.0.0.0") && (mask.value == "0.0.0.0") ){
			alert("Invalid subnet mask: ");
			document.forms[0].staticSubnetMask.focus();
			return false;
		}
	}
	document.forms[0].submit();	
}
function changePVC(theselect)
{
	var pvc = trans_to_realindex(document.forms[0].Route_PVC_Index.options.selectedIndex);

	document.forms[0].pvc_index_num.value = pvc;
}
</SCRIPT>

<META content="MSHTML 6.00.2800.1400" name=GENERATOR></HEAD>
<BODY onLoad="doGatewayCheck();">
<FORM name="Static_Eng" action="/cgi-bin/adv_static_route.asp" method="post">
<INPUT TYPE="HIDDEN" NAME="User_def" value="1">
<INPUT TYPE="HIDDEN" NAME="editnum">
<INPUT TYPE="HIDDEN" NAME="Route_num">
<INPUT TYPE="HIDDEN" NAME="add_num">
<INPUT TYPE="HIDDEN" NAME="RouteActive" value="Yes">
<INPUT TYPE="HIDDEN" NAME="pvc_index_num" value="0">
<INPUT TYPE="HIDDEN" NAME="pvc_index" value="0">
<div id="pagestyle"><!--cindy add for border 11/28-->
	<div id="block1">
		<table width="640px" border="0"  cellpadding="0" cellspacing="0" class="tabdata" style="padding-left:20px;">
		<tr height="32px">
			<td width="250px" align=left class="title-main">Static Route</td>
		</tr>
		<tr height="30px">
			<td width="250px" align=left class="tabdata">Destination IP Address</td>
			<td align=left class="tabdata">
				<INPUT maxLength=16 size=16 value="0.0.0.0" name="staticDestIP"> 
			</td>
		</tr>

		<tr height="30px">
			<td width="250px" align=left class="tabdata">IP Subnet Mask</td>
			<td align=left class="tabdata">
				<INPUT maxLength=16 size=16 value="0.0.0.0" name="staticSubnetMask"> 
			</td>
</tr>

		<tr height="30px">
			<td width="250px" align=left class="tabdata">Gateway IP Address</td>
			<td align=left class="tabdata">
    	<INPUT onclick=doGatewayCheck() type=radio value="Yes"  name="Route_PVCGateway">
    	<INPUT maxLength=16 size=16 value="0.0.0.0" name="staticGatewayIP">
    	<INPUT onclick=doGatewayCheck() type=radio value="No" checked name="Route_PVCGateway">
    		<SELECT NAME="Route_PVC_Index" SIZE="1" onChange="changePVC()">


	
    	<option value="PVC0">WAN0
		<!--wang only use one wan port 20190927
		<option value="PVC1">WAN1
		<option value="PVC2">WAN2
		<option value="PVC3">WAN3
		<!--
		<option value="PVC4">WAN4
		<option value="PVC5">WAN5
		<option value="PVC6">WAN6
		<option value="PVC7">WAN7
		-->
		

    	</SELECT> 
				</td>
			</tr>

			<tr height="30px">
				<td width="250px" align=left class="tabdata">Metric</td>
				<td align=left class="tabdata">
					<INPUT maxLength=5 size=3 value="0" name="staticMetric">  
				</td>
			</tr>
		</table>
	</div>

	<div id="button0">
		<table width="640px" border="0"  cellpadding="0" cellspacing="0" class="tabdata" style="padding-left:20px;">
			<tr height="30px">
				<td align=left class="title-main" style="white-space:nowrap;">Click "Save" to save a static route and "Back" to routing table list page</td>
			</tr>
		<tr height="40px">
			<td  width="250px" align=left class="tabdata">
				<INPUT type="hidden" value="0" name="EditFlag"> 
				<INPUT onClick="doSubmit(1);" class="button1" type=button value="Save" name="StaticSubmit">
    			
    			
    			
    				<INPUT type="button" class="button1" style="margin-left:20px;" value="Back" name="StaticBack" onClick="javascript:window.location='/cgi-bin/adv_routing_table.asp'" >
   		 	
   		 	
    			
    				<INPUT type="reset" class="button1" value="Cancel" name="DTStaticReset" style="display:none;">
   		 	</td>
    		</tr>	
		</table>
	</div>
</div><!--cindy add for border 11/28--> 

<div id="cpright">
<table border="0" cellpadding="0" cellspacing="0">
  <TBODY>

	<tr height="32px">
		<td width="20px">&nbsp;</td>
		<td width="250px">&nbsp;</td>
		<td width="372px"></td>
	</tr>	

	<tr>
	<td align=center colSpan=3><font size=2>Copyright © 2019 FPT. All Rights Reserved.  </font> </td>
	</tr>
		
</TBODY>
  </table>
  </div>
</FORM></BODY></HTML>
