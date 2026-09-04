

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<style  type="text/css">

*{color:  #404040;}

</style>

<script type="text/javascript" src="/spin.js" ></script>
<link rel="stylesheet" type="text/css" href="/style.css">
<SCRIPT language=javascript>
var destip0='127.0.0.0';
var subnetmask0='255.255.0.0';
var gatewayip0='0.0.0.0';
var metric0='';
var device0='lan';
var user_def0='';
var destip1='192.168.1.0';
var subnetmask1='255.255.255.0';
var gatewayip1='0.0.0.0';
var metric1='';
var device1='lan';
var user_def1='';
var destip2='';
var subnetmask2='';
var gatewayip2='';
var metric2='';
var device2='';
var user_def2='1';
var destip3='';
var subnetmask3='';
var gatewayip3='';
var metric3='';
var device3='';
var user_def3='1';
var destip4='';
var subnetmask4='';
var gatewayip4='';
var metric4='';
var device4='';
var user_def4='1';
var destip5='';
var subnetmask5='';
var gatewayip5='';
var metric5='';
var device5='';
var user_def5='1';
var destip6='';
var subnetmask6='';
var gatewayip6='';
var metric6='';
var device6='';
var user_def6='1';
var destip7='';
var subnetmask7='';
var gatewayip7='';
var metric7='';
var device7='';
var user_def7='1';
var destip8='';
var subnetmask8='';
var gatewayip8='';
var metric8='';
var device8='';
var user_def8='1';
var destip9='';
var subnetmask9='';
var gatewayip9='';
var metric9='';
var device9='';
var user_def9='1';
var destip10='';
var subnetmask10='';
var gatewayip10='';
var metric10='';
var device10='';
var user_def10='1';
var destip11='';
var subnetmask11='';
var gatewayip11='';
var metric11='';
var device11='';
var user_def11='1';
var destip12='';
var subnetmask12='';
var gatewayip12='';
var metric12='';
var device12='';
var user_def12='1';
var destip13='';
var subnetmask13='';
var gatewayip13='';
var metric13='';
var device13='';
var user_def13='1';
var destip14='';
var subnetmask14='';
var gatewayip14='';
var metric14='';
var device14='';
var user_def14='1';
var destip15='';
var subnetmask15='';
var gatewayip15='';
var metric15='';
var device15='';
var user_def15='1';
var destip16='';
var subnetmask16='';
var gatewayip16='';
var metric16='';
var device16='';
var user_def16='1';
var destip17='';
var subnetmask17='';
var gatewayip17='';
var metric17='';
var device17='';
var user_def17='1';
var destip18='';
var subnetmask18='';
var gatewayip18='';
var metric18='';
var device18='';
var user_def18='1';
var destip19='';
var subnetmask19='';
var gatewayip19='';
var metric19='';
var device19='';
var user_def19='1';
var destip20='';
var subnetmask20='';
var gatewayip20='';
var metric20='';
var device20='';
var user_def20='1';
var destip21='';
var subnetmask21='';
var gatewayip21='';
var metric21='';
var device21='';
var user_def21='1';
var destip22='';
var subnetmask22='';
var gatewayip22='';
var metric22='';
var device22='';
var user_def22='1';
var destip23='';
var subnetmask23='';
var gatewayip23='';
var metric23='';
var device23='';
var user_def23='1';
var destip24='';
var subnetmask24='';
var gatewayip24='';
var metric24='';
var device24='';
var user_def24='1';
var destip25='';
var subnetmask25='';
var gatewayip25='';
var metric25='';
var device25='';
var user_def25='1';
var destip26='';
var subnetmask26='';
var gatewayip26='';
var metric26='';
var device26='';
var user_def26='1';
var destip27='';
var subnetmask27='';
var gatewayip27='';
var metric27='';
var device27='';
var user_def27='1';


//

var aryISP = new Array("","", "", "", "", "", "", "","","","");

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

function doGatewayCheck()
{
        if (document.forms[0].Route_PVCGateway[0].checked == true){
        document.forms[0].staticGatewayIP.disabled = false;
                    document.forms[0].Route_PVC_Index.disabled = true;
        }
        else{
            document.forms[0].staticGatewayIP.disabled = true;
                  document.forms[0].Route_PVC_Index.disabled = false;
                  document.forms[0].Route_PVC_Index.options.selectedIndex = "";
                  
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
                alert("Invalid destination IP address:"+Address);
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
        mask=document.RoutingTable_form.staticSubnetMask;
        IPAddr=document.RoutingTable_form.staticDestIP;
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
                alert("Invalid subnet mask:");
                mask.focus();
                v = "0.0.0.0";
                return false;
        }
		var bitAnd0 = addr[0]&digits[0];
		var bitAnd1 = addr[1]&digits[1];
		var bitAnd2 = addr[2]&digits[2];
		var bitAnd3 = addr[3]&digits[3];
		if(bitAnd0 != addr[0] || bitAnd1 != addr[1] || bitAnd2 != addr[2] || bitAnd3 != addr[3])
		{
			alert("Netmask doesn't match route address");
			return false;
        }

        if((Number(addr[3])==0)&&(Number(digits[3])==255))
        {
                alert("Invalid subnet mask:");
                return false;
        }
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
        var     nCurTemp = 0;
        var     vDestIPAddress = new Array(routecount);
        var     vcurLinks = new Array(routecount);

        vDestIPAddress[0] = destip0;
        vDestIPAddress[1] = destip1;
        vDestIPAddress[2] = destip2;
        vDestIPAddress[3] = destip3;
        vDestIPAddress[4] = destip4;
        vDestIPAddress[5] = destip5;
        vDestIPAddress[6] = destip6;
        vDestIPAddress[7] = destip7;
        vDestIPAddress[8] = destip8;
        vDestIPAddress[9] = destip9;
        vDestIPAddress[10] = destip10;
        vDestIPAddress[11] = destip11;
        vDestIPAddress[12] = destip12;
        vDestIPAddress[13] = destip13;
        vDestIPAddress[14] = destip14;
        vDestIPAddress[15] = destip15;

        for(var i=0; i<routecount; i++)
        {
                if(vDestIPAddress[i] != "N/A")
                        vcurLinks[nCurTemp++] = new stStaticRoute(i, vDestIPAddress[i]);
        }
        var     vObjRet = new Array(nCurTemp+1);
        for(var m=0; m<nCurTemp; m++)
        {
                vObjRet[m] = vcurLinks[m];
        }
        vObjRet[nCurTemp] = null;
        return vObjRet;
}
var StaticRouteInfo = getStaticRouteInfo();

function doSubmit(index) {
        if(document.RoutingTable_form.user_def_num.value>=16){
                alert("Users can only define 16 routes!\n");
                return false;
        }
        var pvc= document.forms[0].Route_PVC_Index.options.selectedIndex;
        var mask = document.forms[0].staticSubnetMask;
        var destIP = document.forms[0].staticDestIP;

//      document.forms[0].EditFlag.value=index;
        document.forms[0].RouteActive.value="Yes";

        if(index)
        {

        //      var strdstIPtmp = "";
                var stripvalue = document.forms[0].staticDestIP.value;
        //      if ((strdstIPtmp == "N/A") || ((strdstIPtmp != "N/A") && (stripvalue != strdstIPtmp))) {
                        for (i = 0; i < StaticRouteInfo.length - 1; i++)
                        {
                                if (StaticRouteInfo[i].DestIPAddress == stripvalue)
                                {
                                        alert(stripvalue + ' has added!');
                                        return false;
                                }
                        }
                //}

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
                        alert("Invalid subnet mask:");
                        document.forms[0].staticSubnetMask.focus();
                        return false;
                }

        }
        showSpin(); 
        document.forms[0].EditFlag.value=index;
        document.forms[0].submit();
}
function changePVC(theselect)
{
        var pvc = trans_to_realindex(document.forms[0].Route_PVC_Index.options.selectedIndex);

        document.forms[0].pvc_index_num.value = pvc;
}

function doUserDefNumCheck(){
        if(document.RoutingTable_form.user_def_num.value>=16){
                alert("Users can only define 16 routes!\n");
                return false;
        }
//      window.location='/cgi-bin/adv_static_route.asp?add_num='+document.RoutingTable_form.add_num.value

        return true;
}
function doDelete(i)
 {
 
        document.RoutingTable_form.delnum.value=i;
        document.RoutingTable_form.submit();
}
/*
function doedit(i)
 {
        document.RoutingTable_form.action="/cgi-bin/adv_static_route.asp";
        document.RoutingTable_form.editnum.value=i;
        document.RoutingTable_form.submit();
}
*/
function showTable(id,header,data,keyIndex){
	// 2.generate table data
	var html = ["<table width=\"640\"  border=\"0\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" bordercolor=\"#CCCCCC\">"];
	// 1.generate table header
	html.push("<tr bgcolor=#FFFFFF height=30><td width=\"40\" align=center class=\"tabdata\"><strong>Index</strong></td>");
	for(var i =0; i<header.length; i++){
			html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +" </strong>"+ "</td>");
	}
	html.push("</tr>");
	for(var i =0; i<data.length; i++)
	{
		 if(data[i][keyIndex] != "N/A" && data[i][keyIndex] != "")
		 {
			html.push("<tr bgcolor=#FFFFFF height=30 id=tablebutton>");
			for(var j=0; j<data[i].length; j++)
			{
				if(j == 6)
				{
					html.push("<td align=center class=\"topborderstyle\">");
					if(data[i][j] == "1")
						html.push("<INPUT TYPE=\"button\" class=\"button3\" NAME=\"RemoveBtn\" VALUE=\"Remove\" onClick=\"doDelete(" + i + ");\">");
					else
						html.push("&nbsp;");
					html.push("</td>");
				}
				else
					html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");
					
			}
			html.push("</tr>");
		}
	}
	html.push("</table>");

	document.getElementById(id).innerHTML = html.join('');
}
</SCRIPT>

</head><body onLoad="doGatewayCheck();">
<FORM METHOD="POST" ACTION="/cgi-bin/adv_routing_table.asp" name="RoutingTable_form">
<div id="pagestyle">
<div id="contenttype">
<INPUT type="hidden" name="Route_num" value="">
<INPUT TYPE="HIDDEN" NAME="delnum">
<!--
<INPUT TYPE="HIDDEN" NAME="editnum">
-->
<INPUT TYPE="HIDDEN" NAME="user_def_num" value="">
<INPUT TYPE="HIDDEN" NAME="add_num" value="">

<INPUT TYPE="HIDDEN" NAME="User_def" value="1">
<!--
<INPUT TYPE="HIDDEN" NAME="editnum">
<INPUT TYPE="HIDDEN" NAME="Route_num">
<INPUT TYPE="HIDDEN" NAME="add_num">
-->
<INPUT TYPE="HIDDEN" NAME="RouteActive" value="Yes">
<INPUT TYPE="HIDDEN" NAME="pvc_index_num" value="0">
<INPUT TYPE="HIDDEN" NAME="pvc_index" value="0">

        <div id="block1" class="main_item">
                <table width="640px" border="0"  cellpadding="0" cellspacing="0" class="tabdata"  style="margin:5px 0px;">
                <tr height="25px" style="width:100%;background:#e6e6e6;">
                        <td align=left class="title-main" style="padding-left:20px;">Static Route</td>
                </tr>
                </table>
                <table width="640px" border="0"  cellpadding="0" cellspacing="0" class="tabdata" bgcolor="#FFFFFF" >
                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Destination IP Address</td>
                        <td align=left class="tabdata">
                                <INPUT type="TEXT" maxLength=16 size=16 value="0.0.0.0"  name="staticDestIP"> 
                        </td>
                </tr>

                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">IP Subnet Mask</td>
                        <td align=left class="tabdata">
                                <INPUT type="TEXT" maxLength=16 size=16 value="0.0.0.0" name="staticSubnetMask"> 
                        </td>
                </tr>

                <tr height="30px">
                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Gateway IP Address</td>
                        <td align=left class="tabdata">
                                <INPUT onclick=doGatewayCheck() type=radio value="Yes" name="Route_PVCGateway">
                                <INPUT type="TEXT" maxLength=16 size=16 value="0.0.0.0" name="staticGatewayIP">
                                <INPUT onclick=doGatewayCheck() type=radio value="No" name="Route_PVCGateway">
                                <script>
                                        document.getElementsByName("Route_PVCGateway")[0].checked = true;
                                        document.getElementsByName("Route_PVCGateway")[1].checked = false;
                                </script>
                                        <SELECT NAME="Route_PVC_Index" SIZE="1" onChange="changePVC()">
									
											<option value="ppp0">WAN0
													<!-- only use one wan port 
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
                                <td width="250px" align=left class="tabdata" style="padding-left:20px;">Metric</td>
                                <td align=left class="tabdata">
                                        <INPUT type="TEXT" maxLength=5 size=3 value="0" name="staticMetric">  
                                </td>
                        </tr>
                </table>
        </div>

        <div id="block1" class="main_item">
                        <table width="640px" border="0"  cellpadding="0" cellspacing="0" class="tabdata" style="margin:5px 0px;"  bgcolor="#FFFFFF">
                        <tr height="25px">
                                <td align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Add" to add a static route</td>
                        </tr>
                        </table>
                        <table width="640px" border="0"  cellpadding="0" cellspacing="0" class="tabdata">
                        <tr height="40px" id="buttoncolor">
                                <td colspan="2" align=left class="tabdata" style="padding-left:20px;">
                                <INPUT type="hidden" value="0" name="EditFlag"> 
                                <input name="AddRoute" type="button" class="button1" value="Add" onClick="doSubmit(1)">
                                </td>
                                <td id="firstDiv" style="float:left;"></td>
                        </tr>
                        </table>
        </div>

        <div id="block1" class="main_item">
                <table width="640px" border="0"  cellpadding="0" cellspacing="0" class="tabdata" style="margin:5px 0px;">
                        <tr height="25px" style="width:100%;background:#e6e6e6;">
                                <td align=left class="title-main" style="padding-left:20px;">Routing Table List</td> 
                        </tr>
                </table>
                <table width="600px" border="0"  cellpadding="0" cellspacing="0"  >

                        <tr>
                                <td>
				
				<div id=routeList></div>
				<script>
				var tableHeader = [
				["100","Dest IP"],
				["100","Mask"],
				["100","Gateway IP"],
				["60","Metric"],
				["60","Device"],
				["80","Edit"]
		];
				var tableData = [
				["0", destip0, subnetmask0, gatewayip0, metric0, device0, user_def0],
                                ["1", destip1, subnetmask1, gatewayip1, metric1, device1, user_def1],
                                ["2", destip2, subnetmask2, gatewayip2, metric2, device2, user_def2],
                                ["3", destip3, subnetmask3, gatewayip3, metric3, device3, user_def3],
                                ["4", destip4, subnetmask4, gatewayip4, metric4, device4, user_def4],
                                ["5", destip5, subnetmask5, gatewayip5, metric5, device5, user_def5],
                                ["6", destip6, subnetmask6, gatewayip6, metric6, device6, user_def6],
                                ["7", destip7, subnetmask7, gatewayip7, metric7, device7, user_def7],
                                ["8", destip8, subnetmask8, gatewayip8, metric8, device8, user_def8],
                                ["9", destip9, subnetmask9, gatewayip9, metric9, device9, user_def9],
                                ["10", destip10, subnetmask10, gatewayip10, metric10, device10, user_def10],
                                ["11", destip11, subnetmask11, gatewayip11, metric11, device11, user_def11],
                                ["12", destip12, subnetmask12, gatewayip12, metric12, device12, user_def12],
                                ["13", destip13, subnetmask13, gatewayip13, metric13, device13, user_def13],
                                ["14", destip14, subnetmask14, gatewayip14, metric14, device14, user_def14],
                                ["15", destip15, subnetmask15, gatewayip15, metric15, device15, user_def15],
                                ["16", destip16, subnetmask16, gatewayip16, metric16, device16, user_def16],
                                ["17", destip17, subnetmask17, gatewayip17, metric17, device17, user_def17],
                                ["18", destip18, subnetmask18, gatewayip18, metric18, device18, user_def18],
                                ["19", destip19, subnetmask19, gatewayip19, metric19, device19, user_def19],
                                ["20", destip20, subnetmask20, gatewayip20, metric20, device20, user_def20],
                                ["21", destip21, subnetmask21, gatewayip21, metric21, device21, user_def21],
                                ["22", destip22, subnetmask22, gatewayip22, metric22, device22, user_def22],
                                ["23", destip23, subnetmask23, gatewayip23, metric23, device23, user_def23],
                                ["24", destip24, subnetmask24, gatewayip24, metric24, device24, user_def24],
                                ["25", destip25, subnetmask25, gatewayip25, metric25, device25, user_def25],
                                ["26", destip26, subnetmask26, gatewayip26, metric26, device26, user_def26],
                                ["27", destip27, subnetmask27, gatewayip27, metric27, device27, user_def27]
                                ];
				showTable('routeList',tableHeader,tableData,1);
				</script>
				
                                </table>
                                </div><!--class=configstyle-->
                        </td>
                </tr>

                </table>
                </div>
        </div>

</div>

                
</form></body></html>
