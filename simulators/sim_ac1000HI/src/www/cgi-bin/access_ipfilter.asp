<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<META http-equiv=Content-Script-Type content=text/javascript>
<META http-equiv=Content-Style-Type content=text/css>
<META http-equiv=Content-Type content="text/html; charset=&#10;UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css" >

<style  type="text/css">

*{color:  #404040;}

</style>

<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
<script type="text/javascript" src="/spin.js" ></script>
<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
<SCRIPT language=javascript>

//<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
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
//<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->

function tableShow(id,header,data,keyIndex){
			var html = ["<table width=615 border=0 cellpadding=1 cellspacing=0  bordercolor=#a6a6a6 bgcolor=#FFFFFF > "];
	// 1.generate table header
	html.push("<tr hight=42>");
			for(var i =0; i<header.length; i++){
			html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<strong>"+ header[i][1] +"</strong>"+ "</td>");
	}
	html.push("</tr>");
	// 2.generate table data
				for(var i =0; i<data.length; i++){
					if(data[i][keyIndex] != "N/A"){
			html.push("<tr height=42>");
						for(var j=0; j<data[i].length; j++){
				html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");
			}
			html.push("</tr>");
		}
	}
	html.push("</table>");
	document.getElementById(id).innerHTML = html.join('');
}



function doIndexChange()
{
	document.forms[0].RuleTypeChange.value = 0;
	document.forms[0].submit();
	return;
}

function doAdd()
{
	document.forms[0].RuleTypeChange.value = 1;
	
	
}

function doDel()
{
	document.forms[0].RuleTypeChange.value = 2;
}

function doChangeRuleType()
{	
	if(document.IPFILTERform.FILTERRuleTypeSEL.selectedIndex == 0)
	{
		document.getElementById("divMac").style.display="none";
		document.getElementById("divIP").style.display="";		
	}
	else
	{
		document.getElementById("divIP").style.display="none";
		document.getElementById("divMac").style.display="";
	}
	return;
	
}

function doCancel()
{
	document.forms[0].RuleTypeChange.value = 4;
	javascript:window.location='access_ipfilter.asp'
}
	
function switchFilterType(object)
{
	var index = object.selectedIndex;
	switch(index)
	{
		/*case 1:
			window.location='access_appfilter.asp';
			break;
			*/
		case 1:
			window.location='access_URLfilter.asp';
			break;
	}
}

function isValidIpAddr(ip1,ip2,ip3,ip4)
{
	
	if(ip1==0 || ip4==255 || ip1==127 || ip4==0)
	
	{
		if(ip1==0 && ip2==0 && ip3==0 && ip4==0)
			return true;
		else
			return false;
	}
	return true;	
}

function unValidIP(Address)
{
	var address = Address.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits;
	var i;

	var test=0;
	var point=-1;
	while(test!=-1)
	{
		point++;
		test=Address.indexOf(".",test+1);	
	}

	if(point<3)
	{
		alert("IP address is empty or wrong format!");
		return true;
	}

	if(address == null) 
	{ 
		alert("IP address is empty or wrong format!");
		return true;
	}
	else
	{
		digits = address[0].split(".");
		for(i=0; i < 4; i++)
		{
			if((Number(digits[i]) > 255 ) || (Number(digits[i]) < 0 ) || (Number(digits[0]) > 223))
			{ 
				alert("Invalid IP address: " + Address);
				return true;
			}
		}
		return false;
	}
}

function unValidMask(Mask)
{
	var mask = Mask.match("^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$");
	var digits;
	var bMask = 0;
	var watch = false;
	var i;
  
	var test=0;
	var point=-1;
	while(test!=-1)
	{
		point++;
		test=Mask.indexOf(".",test+1);	
	}
	
	if(point<3)
	{
		alert("Invalid subnet mask!");
		return true;
	}

	if(mask == null)
	{ 
		alert("Invalid subnet mask!");
		return true;
	}

	digits = mask[0].split(".");
	for(i=0; i < 4; i++)
	{
		if((Number(digits[i]) > 255 ) || (Number(digits[i]) < 0 ))
		{
			alert("Invalid subnet mask!");
			return true;
		}
		bMask = (bMask << 8) | Number(digits[i]);
	}
	if ((Number(digits[0]) == 0) && (Number(digits[1]) == 0)
		&& (Number(digits[2]) == 0) && (Number(digits[3]) == 0))
	{
		alert("Invalid subnet mask!");
		return true;	
	}
	bMask = bMask & 0x0FFFFFFFF;
 /*wang solve 0.0.0.1 or 255.255.255.1\129\193\225\241\249\253 can be saved*/
	if(((bMask & 0x01)== 1) && ((bMask & 0x0FFF) != 0x0FFF ))
	{
	      alert("Invalid subnet mask!");
	      return true;
	}
	for(i=0; i<32; i++)
	{
		if((watch==true) && ((bMask & 0x1)==0))
		{
			alert("Invalid subnet mask!");
			return true;
		}
		bMask = bMask >> 1;
		if((bMask & 0x01) == 1)
		{
			watch=true;
		}
	}
	return false;
}
//amy add start 2017-12-15.
/*
function IpfilterOnOff(off)
{
	if(off)
		{
		document.IPFILTERform.InterfaceSEL.disabled=true;
		document.IPFILTERform.DirectionSEL.disabled=true;
		
		document.IPFILTERform.FILTERRuleTypeSEL.disabled=true;
		if(document.IPFILTERform.FILTERRuleTypeSEL.selectedIndex == 0){
			document.IPFILTERform.SrcIPTXT.disabled=true;
			document.IPFILTERform.SrcMaskTXT.disabled=true;
			document.IPFILTERform.SrcPortTXT.disabled=true;
			document.IPFILTERform.DestIPTXT.disabled=true;
			document.IPFILTERform.DestMaskTXT.disabled=true;
			document.IPFILTERform.DestPortTXT.disabled=true;
			
			document.IPFILTERform.ProtocolSEL.disabled=true;
			}
		else
			document.IPFILTERform.MacAddrTXT.disabled=true;	
			
		}
	else
		{
		document.IPFILTERform.InterfaceSEL.disabled=false;
		document.IPFILTERform.DirectionSEL.disabled=false;
		
		document.IPFILTERform.FILTERRuleTypeSEL.disabled=false;
		if(document.IPFILTERform.FILTERRuleTypeSEL.selectedIndex == 0){
			document.IPFILTERform.SrcIPTXT.disabled=false;
			document.IPFILTERform.SrcMaskTXT.disabled=false;
			document.IPFILTERform.SrcPortTXT.disabled=false;
			document.IPFILTERform.DestIPTXT.disabled=false;
			document.IPFILTERform.DestMaskTXT.disabled=false;
			document.IPFILTERform.DestPortTXT.disabled=false;
			
			document.IPFILTERform.ProtocolSEL.disabled=false;
			}
		else
			document.IPFILTERform.MacAddrTXT.disabled=false;	
		}
		
}
*/
function IpfilterOnOff(off){

	if(off)
	{
		document.getElementById("rule_active").style.display="none";
		document.getElementById("divMac").style.display="none";
		document.getElementById("divIP").style.display="none";
	}

	else
		{
		document.getElementById("rule_active").style.display="";
		if(document.IPFILTERform.FILTERRuleTypeSEL.selectedIndex == 0)
			{
			document.getElementById("divMac").style.display="none";
			document.getElementById("divIP").style.display="";
			}
		else
			{
			document.getElementById("divMac").style.display="";
			document.getElementById("divIP").style.display="none";
			}
		}


}
//amy add end 2017-12-15.

function IPFilterinit()
{
	if(document.IPFILTERform.FULL.value.length != 0){
		alert(document.IPFILTERform.FULL.value);
	}
	if(document.IPFILTERform.Duplicate.value==1){
		alert("The rule has already exist!");
		document.IPFILTERform.submit();
	}
/*	if(document.IPFILTERform.FILTERRuleTypeSEL.selectedIndex == 0){
//		document.getElementById("divIP").style.display="";
		document.getElementById("divMac").style.display="none";
		}
	else{
	//	document.getElementById("divMac").style.display="";
		document.getElementById("divIP").style.display="none";	//amy removed 2017-12-15.
		}
		if(document.IPFILTERform.RuleActiveRDO[0].checked)
		IpfilterOnOff(0);
	else
		IpfilterOnOff(1);
	*///amy removed 20180331
}

function validateInput()
{
	var RuleActiveRDO = document.IPFILTERform.RuleActiveRDO;
	for(i=0; i<RuleActiveRDO.length; i++)
	{
		if(RuleActiveRDO[i].checked == true)
		{
			RDOValue = RuleActiveRDO[i].value;
			break;
		}
	}
	
	var InterfaceSEL = document.IPFILTERform.InterfaceSEL;
	for(i=0; i<InterfaceSEL.length; i++)
	{
		if(InterfaceSEL[i].selected == true)
		{
			InterfaceValue = InterfaceSEL[i].value;
			break;
		}
	}
	
	var DirectionSEL = document.IPFILTERform.DirectionSEL;
	for(i=0; i<DirectionSEL.length; i++)
	{
		if(DirectionSEL[i].selected == true)
		{
			DirectionValue = DirectionSEL[i].value;
			break;
		}
	}
	
	var ProtocolSEL = document.IPFILTERform.ProtocolSEL;
	for(i=0; i<ProtocolSEL.length; i++)
	{
		if(ProtocolSEL[i].selected == true)
		{
			ProtocolValue = ProtocolSEL[i].value;
			break;
		}
	}
	
	SrcIPData = [
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
	]
	DestIPData = [
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
	]
	SrcMaskData = [
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
	]
	DestMaskData = [
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
		"N/A","N/A","N/A","N/A",
	]
		    	
	RuleType = document.IPFILTERform.FILTERRuleTypeSEL.selectedIndex;
	switch(RuleType)
	{
		case 0:
			IP = document.IPFILTERform.SrcIPTXT.value;
			if(unValidIP(IP)){
				return false;
	    }

			if(IP != "0.0.0.0" && unValidMask(document.IPFILTERform.SrcMaskTXT.value))
			{
				return false;
			}
			/*wang ip = 0.0.0.0 subnet =0.0.0.0*/
			if(IP == "0.0.0.0" && document.IPFILTERform.SrcMaskTXT.value != "0.0.0.0")
			{
                            alert("If IP is 0.0.0.0,subnet mask must be 0.0.0.0");
				return false;
			}
			/*wang ip = x.x.x.0 or x.x.0.0 or x.0.0.0 but subnet !=255.255.255.255*/
			var last1 = IP.split(".")[IP.split(".").length-1];   //last1 is equal to the  fourth group of ip.
			if((last1 == 0) && (document.IPFILTERform.SrcMaskTXT.value.split(".")[3] == 255))
			{
				alert("Invalid subnet mask!");
				return false;
			}
			SrcPort = parseInt(document.IPFILTERform.SrcPortTXT.value);
			if(isNaN(SrcPort) || SrcPort < 0 || SrcPort > 65535){
				alert("Port number's range: 0 ~ 65535");
				return false;
			}

			IP = document.IPFILTERform.DestIPTXT.value;
			if(unValidIP(IP)){
				return false;
			}
			
			if(IP != "0.0.0.0" && unValidMask(document.IPFILTERform.DestMaskTXT.value))
			{
				return false;
			}
			/*wang ip = 0.0.0.0 subnet =0.0.0.0*/
			if(IP == "0.0.0.0" && document.IPFILTERform.DestMaskTXT.value != "0.0.0.0")
			{
                            alert("If IP is 0.0.0.0,subnet mask must be 0.0.0.0");
				return false;
			}
			/*wang ip = x.x.x.0 or x.x.0.0 or x.0.0.0 but subnet !=255.255.255.255*/
			var last1 = IP.split(".")[IP.split(".").length-1]; 
			if((last1 == 0) && (document.IPFILTERform.DestMaskTXT.value.split(".")[3] == 255))
			{
				alert("Invalid subnet mask!");
				return false;
			}
			DestPort = parseInt(document.IPFILTERform.DestPortTXT.value);
			if(isNaN(DestPort) || DestPort < 0 || DestPort > 65535)
			{	
				alert("Port number's range: 0 ~ 65535");
				return false;
			}
			if (document.IPFILTERform.DSCPFLT.value == "Yes") {
				dscp = parseInt(document.IPFILTERform.DSCPTXT.value);
				if(isNaN(dscp) || dscp < 0 || dscp > 64)
				{	
					alert("(DSCP's range: 0 ~ 64)");
					return false;
				}
			}
      for(var i=0; i<16; i++)
	    {
	    	if(document.IPFILTERform.RuleTypeSEL.value != "Black")
	    		break;
	    	if(tableData[i][1]=="N/A")
	    		continue;
	    	if(RDOValue !=tableData[i][1])
	    		continue;
	    	if(InterfaceValue!=tableData[i][2])
	    		continue;
	    	if(DirectionValue!=tableData[i][3])
	    		continue;
	    	if(document.IPFILTERform.SrcIPTXT.value!=SrcIPData[i])
	    		continue;
	    	if(document.IPFILTERform.SrcMaskTXT.value!=SrcMaskData[i])
	    		continue;
	    	if(document.IPFILTERform.DestIPTXT.value!=DestIPData[i])
	    		continue;
	    	if(document.IPFILTERform.DestMaskTXT.value!=DestMaskData[i])
	    		continue;
	    	if(document.IPFILTERform.SrcPortTXT.value!=tableData[i][7])
	    		continue;
	    	if(document.IPFILTERform.DestPortTXT.value!=tableData[i][8])
	    		continue;
	    	
	    	if(ProtocolValue==tableData[i][9]){
	    		alert("the rule has been set !");
	    		return false;
	    	}
	    	
	    }
			
			break;
		case 1:
			if(document.IPFILTERform.MacAddrTXT.value.length==0)
			{
	    		return false;
	    }
	    for(var i=0; i<16; i++)
	    {
	    	if(document.IPFILTERform.RuleTypeSEL.value != "Black")
	    		break;
	    	if(tableData[i][1]=="N/A")
	    		continue;
	    	if(RDOValue !=tableData[i][1])
	    		continue;
	    	
	    	
	    	if(InterfaceValue!=tableData[i][2])
	    		continue;
	    	if(DirectionValue!=tableData[i][3])
	    		continue;
	    	
	    	if(document.IPFILTERform.MacAddrTXT.value==tableData[i][6]){
	    		alert("the rule has been set !");
	    		return false;
	    	}
	    }
			break;
	}
	showSpin();//cindy add
	return true;
}

function blockMask(index)
{
	switch(index)
	{
		case 0:
			IP = document.IPFILTERform.SrcIPTXT;
			mask = document.IPFILTERform.SrcMaskTXT;
			break;
		case 1:
			IP = document.IPFILTERform.DestIPTXT;
			mask = document.IPFILTERform.DestMaskTXT;
			break;
	}
	/*wang */
	var addr1 = IP.value.split(".")[0];
	var addr4 = IP.value.split(".")[3];
	if(addr4 != 0) 
                {  mask.value = "255.255.255.255";}
	else if(IP.value == "0.0.0.0")
	{
		mask.value = "0.0.0.0";
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
	{       mask.disabled = false;       }
             //wang add end    
}

function doHexCheck(c)
{
  if ( (c >= "0") && (c <= "9") )
    return 1;
  else if ( (c >= "A") && (c <= "F") )
    return 1;
  else if ( (c >= "a") && (c <= "f") )
    return 1;

  return -1;
}

function doMACcheck(object)
{
	var szAddr = object.value;
	var len = szAddr.length;

	if(len==0)
	{
		alert("Empty MAC Address!");
		return;
	}

	if(len==12)
	{
		var newAddr = "";
		var i = 0;

		for(i=0; i<len; i++)
		{
			var c = szAddr.charAt(i);

			if(doHexCheck(c) < 0)
			{
				alert("Invalid MAC Address");
				object.focus();
				return;
			}
			if((i == 2)||(i == 4)||(i == 6)||(i == 8)||(i == 10))
			{
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

		if ((doHexCheck(c0) < 0)||(doHexCheck(c1) < 0))
		{
			alert("Invalid MAC Address");
			object.focus();
			return;
		}

		i = 2;
		while (i<len)
		{
			var c0 = szAddr.charAt(i);
			var c1 = szAddr.charAt(i+1);
			var c2 = szAddr.charAt(i+2);

			if ((c0 != ":")||(doHexCheck(c1)<0)||(doHexCheck(c2)<0))
			{
				alert("Invalid MAC Address");
				object.focus();
				return;
			}
			i = i + 3;
		}
		if((szAddr == "00:00:00:00:00:00") || (szAddr.toUpperCase() == "FF:FF:FF:FF:FF:FF"))
		{
			alert("Invalid MAC Address");
			object.focus();
			return;
		}
		return; 
	}
	else
	{
		alert("Invalid MAC Address");
		object.focus();
		return;
	}
}

</SCRIPT>

<META content="MSHTML 6.00.2900.3059" name=GENERATOR>
</HEAD>
			
<BODY onload="IPFilterinit();">
<FORM name=IPFILTERform action=/cgi-bin/access_ipfilter.asp method=post>
			<div id="pagestyle"><!--cindy add for border 11/28-->
				<div id="contenttype">
				<div id="block1">
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">

						<tr height="25px" class="bgcolor">

							<td  align="left" class="title-main" style="padding-left:20px;">Filter Type</td>
						</tr>
					</table>
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
						<tr height="30px">
	
						    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Filter Type Selection</td>
						     	<td align=left class="tabdata">
							<SELECT name=FILTERTYPE_index onchange=switchFilterType(this) size=1>
								<OPTION SELECTED>IP / MAC Filter
								<OPTION>URL Filter
							</SELECT> 
							</td>
						</tr>
						</table>
					</div>
					
					
						<div id="block1">
						<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
							<tr height="25px" class="bgcolor">

								<td width="250px" align="left" class="title-main" style="padding-left:20px;">Rule Type</td>
							</tr>
						</table>
						<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Rule Type Selection</td>
							     	<td align=left class="tabdata">
									<SELECT name=RuleTypeSEL size=1>
										<OPTION VALUE="Black" selected>Black List
										<OPTION VALUE="White" >White List
									</SELECT> 
								</td>
							</tr>
						</table>
					</div>
					

	


				<div id="block1">
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">					
						<tr height="25px" class="bgcolor">							
							<td  align="left" class="title-main" style="padding-left:20px;">Filter Rule Editing</td>
						</tr>
					</table>
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
						<tr height="30px">
						    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">IP / MAC Filter Rule Index</td>
						     	<td align=left class="tabdata">
								<SELECT name=RuleIndexSEL onchange="doIndexChange();" size=1>
									<OPTION VALUE="0" selected>1
									<OPTION VALUE="1" >2
									<OPTION VALUE="2" >3
									<OPTION VALUE="3" >4
									<OPTION VALUE="4" >5
									<OPTION VALUE="5" >6
									<OPTION VALUE="6" >7
									<OPTION VALUE="7" >8
									<OPTION VALUE="8" >9
									<OPTION VALUE="9" >10
									<OPTION VALUE="10" >11
									<OPTION VALUE="11" >12
									<OPTION VALUE="12" >13
									<OPTION VALUE="13" >14
									<OPTION VALUE="14" >15
									<OPTION VALUE="15" >16
								</SELECT> 
							</td>
						</tr>

						<tr height="30px">						    	
						    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Active</td>
						     	<td align=left class="tabdata">
						     		<INPUT TYPE="RADIO" name="RuleActiveRDO" VALUE="Yes" onClick="IpfilterOnOff(0)"
						     		
								> 
									Enable  
									
								&nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" name="RuleActiveRDO" VALUE="No" onClick="IpfilterOnOff(1)"
								
								checked> 
									Disable
							</td>
						</tr>	
						</table>
					<!--amy mocified start 0313-->
					
						<div id="rule_active" style="display:none;">
					
					<!--amy modified end 0313-->
					
						<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
					<!--else if tcWebApi_get("WebCustom_Entry","isCZGeneralSupported","h") <> "Yes"-->
							<tr height="30px" style="display:none">							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Interface</td>
							     	<td align=left class="tabdata">
						<!-- else if tcWebApi_get("WebCustom_Entry","isMultiSerSupported","h") <> "Yes"  -->		
								<SELECT name=InterfaceSEL size=1>
									
									<OPTION VALUE="PVC0" >WAN0
									<!--wang only use one wan port 20190927
									<OPTION VALUE="PVC1" >WAN1
									<OPTION VALUE="PVC2" >WAN2
									<OPTION VALUE="PVC3" >WAN3
									<!--wang
									<OPTION VALUE="PVC4" >WAN4
									<OPTION VALUE="PVC5" >WAN5
									<OPTION VALUE="PVC6" >WAN6
									<OPTION VALUE="PVC7" >WAN7
									-->
									

									

									

									
								</SELECT> 
								</td>
							</tr>
									<!--end if tcWebApi_get("WebCustom_Entry","isMultiSerSupported","h") = "Yes" -->

								

							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Direction</td>
							     	<td align=left class="tabdata">
								<SELECT name=DirectionSEL size=1>
									<OPTION VALUE="Both" >Both
									<OPTION VALUE="Incoming" >Incoming
									<OPTION VALUE="Outgoing" >Outgoing
								</SELECT>
								</td>
							</tr>

							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Rule Type</td>
							     	<td align=left class="tabdata">
								<SELECT name=FILTERRuleTypeSEL onchange="doChangeRuleType()" size=1>
									<OPTION VALUE="IP" >IP
									<OPTION VALUE="MAC" >MAC
								</SELECT>
								</td>
							</tr>
	
					</table>
					</div><!--end div-rule_active-->
					
					<!--amy modified start 0313-->
					
						<div id="divIP" style="display:none;">
					
					<!-- amy modified end 0313-->

						<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
							

							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Source IP Address</td>
							     	<td align=left class="tabdata">
							     		<INPUT name=SrcIPTXT onblur=blockMask(0); maxLength=15 size=15 VALUE="0.0.0.0">
								(0.0.0.0 means Don't care)
								</td>
							</tr>

							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Subnet Mask</td>
							     	<td align=left class="tabdata">
							     		<INPUT maxLength=15 size=15 name=SrcMaskTXT VALUE="0.0.0.0" >
								</td>
							</tr>

							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Port Number</td>
							     	<td align=left class="tabdata">
							     		<INPUT maxLength=7 size=8 name=SrcPortTXT VALUE="0" >
									(0 means Don't care)
								</td>
							</tr>

							
						</table>
					

					
						<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
							

							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Destination IP Address</td>
							     	<td align=left class="tabdata">
							     		<INPUT onblur=blockMask(1); maxLength=15 size=15 name=DestIPTXT VALUE="0.0.0.0" >
									(0.0.0.0 means Don't care)
								</td>
							</tr>

							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Subnet Mask</td>
							     	<td align=left class="tabdata">
							     		<INPUT maxLength=15 size=15 name=DestMaskTXT VALUE="0.0.0.0" >
								</td>
							</tr>

							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Port Number</td>
							     	<td align=left class="tabdata">
							     		<INPUT maxLength=7 size=8 name=DestPortTXT VALUE="0" >
									(0 means Don't care)
								</td>
							</tr>

						</table>
					

					
						<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
							
						
								

							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Protocol</td>
							     	<td align=left class="tabdata">
									<SELECT size=1 name=ProtocolSEL>
										<OPTION VALUE="TCP" >TCP
										<OPTION VALUE="UDP" >UDP
										<OPTION VALUE="ICMP" >ICMP
									</SELECT>
								</td>
							</tr>

							
						</table>
					
				</div><!--end divIp-->
				
				<!--amy modified start 0313-->
				
					<div id="divMac" style="display:none;">
				
				<!--amy modified end 0313-->
				
					
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
					
						<tr height="30px">
						    	
						    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">MAC Address</td>
						     	<td align=left class="tabdata">
						     		<INPUT name=MacAddrTXT onblur=doMACcheck(this) maxLength=17 size=17 value="">
							</td>
						</tr>						
					</table>
				</div>

				</div>

		<!---end   if tcWebApi_get("WebCustom_Entry","isCZGeneralSupported","h") ="Yes" --->

				<div id="block1">
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">					

  
						<tr height="25px" class="bgcolor">
							
							<td  align="left" class="title-main" style="padding-left:20px;">IP / MAC Filter Listing</td>
						</tr>
					</table>
					
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata"  >	
						<tr >
	
						    	<td colspan="2" align=left class="tabdata">
		<!--
			<iframe src="/cgi-bin/access_ipfilterlist.cgi" frameborder="0" width="560" height="200"></iframe>
			-->
			
					
							<div id=ipmacList ></div>
							<script language=JavaScript>
							    var tableHeader = [
											["40","Index"],
											["46","Active"],
										//	["62","Interface"],//amy removed 2018-01-13.
											["64","Direction"],
											["93","Src Address/" + "Mask"],
											["93","Dest Address/" + "Mask"],
											["87","Mac Address"],
											["33","Src Port"],
											["34","Dest Port"],
										
											["60","Protocol"]
											];

								var tableData = [
									
											["1", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["2", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["3", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["4", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["5", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["6", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["7", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["8", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["9", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["10", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["11", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["12", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["13", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["14", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["15", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"],
									
											
									
											["16", "N/A","N/A","N/A","N/A","N/A","N/A","N/A","N/A"]
										
											];
										
									for(var i=0;i<tableData.length;i++)
									{
											if(tableData[i][1]=="Yes")
											{
												tableData[i][1]="Enable";
											}
											else if(tableData[i][1]=="No")	
											{
												tableData[i][1]="Disable";
											}	
											
											if(tableData[i][2]=="Both")
											{
												tableData[i][2]="Both";
											}	
											else if(tableData[i][2]=="Incoming")
											{
												tableData[i][2]="Incoming";
											}	
											else if(tableData[i][2]=="Outgoing")
											{
												tableData[i][2]="Outgoing";
											}	
									}
								tableShow('ipmacList',tableHeader,tableData,1);
							</script>
						
						    	</td>							     
						</tr>


					</table>
					
				</div>

				<div id="button0">
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
						<tr height="25px">
							<td align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Save" to save IP/MAC Filter setting and "Delete" to delete IP/MAC Filter setting</td>
						</tr>
					</table>
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
						<tr height="40px">
			
							<td width="250px" align=left class="tabdata" style="padding-left:20px;">
								<INPUT type=hidden name=c2Support VALUE="0">
								<INPUT type=hidden name=FULL>
								<INPUT type=hidden name=RuleTypeChange VALUE="0">
								
								<INPUT type="hidden" name="Duplicate" VALUE="0">
								<Input type="hidden" name="NoDup" value="No">
								<INPUT type=hidden name=DSCPFLT VALUE="No">
								<INPUT type="submit" class="button1" value=Save name=IpFilterApply onclick="doAdd();return validateInput();">
							
							
							
								<INPUT type="submit" class="button1" value=Delete name=IpFilterDelete onclick="doDel();"> 
							
							
							
								<INPUT type="reset" style="display:none" class="button1" value=Cancel name=IpFilterCancel onclick="doCancel();" > 
							</td>
							<td id="firstDiv" style="float:left;"></td><!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
						</tr>

						
					</table>
				</div>
				</div>
			</div><!--cindy add for border 11/28-->

		
			<table width="690" border="0" cellpadding="0" cellspacing="0">
				<tr height="30">
					<td width="20">&nbsp;</td>
					<td width="250">&nbsp;</td>
					<td width="420"></td>
				</tr>	
				<tr>
					<td align=center colSpan=3 style="background-color:transparent;font-family: Arial,Helvetica,sans-serif;"><font size=2>Copyright Â© 2019 FPT. All Rights Reserved.   </font></td>
				</tr>
				<tr height="10">
					<td width="20">&nbsp;</td>
					<td width="250">&nbsp;</td>
					<td width="420"></td>
				</tr>	
			</table>
		
</FORM>
</BODY>
</HTML>

<!-- Báº®T Äáº¦U SCRIPT CHáº¶N RELOAD TRANG KHI SAVE (Tá»° Äá»˜NG THÃŠM VÃ€O) -->
<script>
(function() {
    // HÃ m hiá»ƒn thá»‹ thÃ´ng bÃ¡o thÃ nh cÃ´ng giáº£ láº­p
    function showFakeSaveMsg(formEl) {
        var target = document.getElementById('firstDiv') || document.getElementById('firstDiv0') || document.getElementById('firstDiv2') || document.getElementById('buttoncolor') || document.getElementById('button0');
        if (!target) {
            var btns = formEl ? formEl.querySelectorAll('.button1') : [];
            if (btns.length > 0) {
                target = document.createElement('span');
                btns[0].parentNode.insertBefore(target, btns[0].nextSibling);
            } else {
                target = document.body;
            }
        }
        if (!document.getElementById('fakeSaveMsg')) {
            var msg = document.createElement('span');
            msg.id = 'fakeSaveMsg';
            msg.style.color = '#15803d';
            msg.style.fontWeight = 'bold';
            msg.style.fontSize = '12px';
            msg.style.marginLeft = '10px';
            msg.style.lineHeight = '24px';
            target.appendChild(msg);
        }
        var msgEl = document.getElementById('fakeSaveMsg');
        msgEl.innerHTML = 'âœ” Saved successfully!';
        
        // Hiá»‡n spinner má»™t chÃºt cho giá»‘ng tháº­t
        if (typeof showSpin === 'function') {
            try { showSpin(); } catch(e){}
        } else if (typeof showSpin2 === 'function') {
            try { showSpin2(); } catch(e){}
        }
        
        setTimeout(function() {
            msgEl.innerHTML = '';
        }, 2500);

        // BÃO CÃO RA PORTAL (duyá»‡t lÃªn qua frameset Ä‘á»ƒ tÃ¬m Ä‘Ãºng portal)
        try {
            var w = window;
            for (var i = 0; i < 10; i++) {
                if (w.onSimulatorSave) {
                    w.onSimulatorSave(window);
                    break;
                }
                if (w === w.parent) break;
                w = w.parent;
            }
        } catch(e) {}
    }

    // 1. Cháº·n submit HTML native (cÃ¡c nÃºt <input type="submit">)
    document.addEventListener('submit', function(e) {
        e.preventDefault();
        showFakeSaveMsg(e.target);
    });

    // 2. Cháº·n submit báº±ng JS (document.form.submit())
    if (typeof HTMLFormElement !== 'undefined') {
        var originalSubmit = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function() {
            showFakeSaveMsg(this);
        };
    }
})();
</script>
<!-- Káº¾T THÃšC SCRIPT CHáº¶N RELOAD -->
