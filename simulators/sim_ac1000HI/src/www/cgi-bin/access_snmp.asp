

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css" tppabs="/style.css" charset="utf-8">
<style  type="text/css">
*{color:  #404040;}
</style>

<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" src="/val.js"></script>
<script language="JavaScript" type='text/javascript' src="/ip_new.js"></script>
<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
<script type="text/javascript" src="/spin.js" ></script>
<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->

<script language="JavaScript">
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

function ipCheck() {

		var IP = document.forms[0].SNMP_trustStartIP.value;
		/* trust start ip and trust end ip can be null */
		if (document.forms[0].SNMP_trustStartIP.value == "" || document.forms[0].SNMP_trustEndIP.value == "") {
			if((document.forms[0].SNMP_trustStartIP.value != "") && inValidIPAddr(document.forms[0].SNMP_trustStartIP.value))	
						return true;
			if((document.forms[0].SNMP_trustEndIP.value != "") && inValidIPAddr(document.forms[0].SNMP_trustEndIP.value))	
						return true;
			
			return false;
		}
		
		if(inValidIPAddr(IP))
			return true;

		if(document.forms[0].SNMP_trustStartIP!=null)
		{	
			var IP_SRC_END = document.forms[0].SNMP_trustEndIP.value;		
			if((IP_SRC_END != "255.255.255.255") && (inValidIPAddr(IP_SRC_END)))
				return true;

			var startIp = IP.split(".");
			var endIp = IP_SRC_END.split(".");
			var stIP = parseInt(startIp[0])<<24 | parseInt(startIp[1])<<16 | parseInt(startIp[2])<<8 | parseInt(startIp[3]);
			var edIP = parseInt(endIp[0])<<24 | parseInt(endIp[1])<<16 | parseInt(endIp[2])<<8 | parseInt(endIp[3]);
			stIP = stIP >>> 0;
			edIP = edIP >>> 0;									
			if(stIP > edIP)
			{
				alert("Start IP address must be less than End IP address!");
				return true;
			}				
		}
		
		return false;	
}		

function ipv6Check() { 

		var startIP = document.forms[0].SNMP_trustStartIPv6.value;
		var endIP = document.forms[0].SNMP_trustEndIPv6.value;
				
		if(inValidIPv6Addr(startIP) || inValidIPv6Addr(endIP))
			return true;
		
		var startFullIP = getFullIpv6Address(startIP);
		var endFullIP = getFullIpv6Address(endIP);
		var startIntFullIP = startFullIP.split(":");
		var endIntFullIP = endFullIP.split(":");
		var index;
		var ret=false;
		if(startIntFullIP.length != 8) 
		{
			alert("paser Trust Start IPv6 address fail! length ="+startIntFullIP.length);
			return true;
		}
		if(endIntFullIP.length != 8)  
		{
			alert("paser Trust End IPv6 address fail! length ="+endIntFullIP.length);
			return true;
		}
		for(index =0 ;index < startIntFullIP.length ;index++){
			if(parseInt(startIntFullIP[index],16) < parseInt(endIntFullIP[index],16))
			{
				ret= false; 
				break;
			}
			else if(parseInt(startIntFullIP[index],16) > parseInt(endIntFullIP[index],16)) 
			{
				alert("Trust Start IPv6 address must be less than End IPv6 address!");
				ret = true; 
				break;
			}
		}
		return ret;

}

function SNMPsave() 
{
	var ipversion= ipv4OnlyOrIpv6OnlyCheck();
	
if(document.SNMP_form.SNMP_active[0].checked){
  if(document.SNMP_form.SNMP_get.value.length <= 0 || document.SNMP_form.SNMP_set.value.length <= 0)
  {
  	alert("Both of the fields should be filled");
  	return false;
  }
  
  if(document.SNMP_form.SnmpFullflag.value == "Yes")
  {  
  	if (document.SNMP_form.startTrapflag.value != "Yes") {
		if(document.SNMP_form.SNMP_sysName.value.length <= 0 || document.SNMP_form.SNMP_sysContact.value.length <= 0
		||document.SNMP_form.SNMP_sysLocation.value.length <= 0)
		{
			alert("All of the fields should be filled");
			return false;
		}
	}
/*cindy delete 0803
	if(ipversion==1 && (SNMP_form.SNMP_trapManagerIP.value=="0.0.0.0" || SNMP_form.SNMP_trapManagerIP.value=="")){
// WAN ipv6 only  
	}
	else{
  	if(inValidIPAddr(SNMP_form.SNMP_trapManagerIP.value))
  	{
  		return false;
  	}
  }

	if(document.SNMP_form.SnmpIPv6flag.value == "Yes")
	{
	//	if(document.SNMP_form.SNMP_trapManagerIPv6.value.length > 0)
    //		{
		if(ipversion!=1 && (SNMP_form.SNMP_trapManagerIPv6.value == "::" || SNMP_form.SNMP_trapManagerIPv6.value == "")){
		// WAN not ipv6 only
		}
		else{
			if(SNMP_form.SNMP_trapManagerIPv6.value == "::")
			{
				alert("Invalid IPv6 Address: ::");
				return false;
			}
  			if(inValidIPv6Addr(SNMP_form.SNMP_trapManagerIPv6.value))
				return false;
    //	}
	}
  }
 */	
  }
  
  if (SNMP_form.trustIPflag.value == "Yes")
  {  
  	if(ipversion ==1 && (document.forms[0].SNMP_trustStartIP.value=="0.0.0.0" || document.forms[0].SNMP_trustStartIP.value=="" ) && (document.forms[0].SNMP_trustEndIP.value == "0.0.0.0" || document.forms[0].SNMP_trustEndIP.value == "")){
  	//WAN ipv6 only
  	}
  	else{	
	  if (ipCheck())
		   return;
  	}
  	
	if (SNMP_form.SnmpIPv6flag.value == "Yes")  
	{
		if(ipversion!=1 && document.SNMP_form.SNMP_trustStartIPv6.value=="" && document.SNMP_form.SNMP_trustEndIPv6.value==""){
		//WAN ipv4 only
		}else{
		if(ipv6Check())
			return;		
  	}
  }
  }
	   
  if(quotationCheck(document.SNMP_form.SNMP_get, 29) ) 
		return false;
	if(quotationCheck(document.forms[0].SNMP_set, 29) ) 
		return false;
		
  if(document.SNMP_form.Snmpv3flag.value == "Yes")
  {
  	if(document.SNMP_form.SNMPv3_enable[0].checked)
	{
		if(document.SNMP_form.SNMPv3_User.value.length <= 0 )
		{
			alert("the user name field should be filled!!");
			return false;
		}
		if(document.SNMP_form.SNMPv3_User.value.length > 31 )
		{
			alert("the user name length more than 31!!");
			return false;
		}
		if(document.SNMP_form.Auth_Passwd.value.length < 8 )
		{
			alert("auth passwd must 8 characters at least!!");
			return false;
		}
		if(document.SNMP_form.Auth_Passwd.value.length > 31 )
		{
			alert("auth passwd length more than 31!!");
			return false;
		}
		if(PasswdCheck(document.SNMP_form.Auth_Passwd))
				return false;
		if(document.SNMP_form.Privacy_Passwd.value.length < 8 )
		{
			alert("privacy passwd must 8 characters at least!!");
			return false;
		}
		if(document.SNMP_form.Privacy_Passwd.value.length > 31 )
		{
			alert("privacy passwd length more than 31!!");
			return false;
		}
		if(PasswdCheck(document.SNMP_form.Privacy_Passwd))
				return false;
	}
  }
  }
  showSpin();//cindy add 
  document.SNMP_form.Snmpflag.value=1;
  document.SNMP_form.submit();
}

function doNonSympolCheck(c)
{
	if ((c >= "0")&&(c <= "9"))
	{
		return 1;
	}
	else if ((c >= "A")&&(c <= "Z"))
	{
		return 1;
	}
	else if ((c >= "a")&&(c <= "z"))
	{
		return 1;
	}

  return -1;
}

function PasswdCheck(object)
{
	var len = object.value.length;
	var c;
	var i = 0;
	for(i=0; i<len; i++)
	{
		var c = object.value.charAt(i);
		if(doNonSympolCheck(c)==-1)
		{
			alert("passwd include invalid character:  " + c);
			return true;
		}
	}
	return false;
}
function quotationCheck(object, limit_len) {
	var len = object.value.length;
	var c;
	var i, j = 0;
    for (i = 0; i < len; i++)
    {
	 	var c = object.value.charAt(i);
      
	  	if (c == '"')
		{
			j += 6;
		}
		else
			j++;
    }
   	if (j > limit_len)
	{
   	alert('Input too many characters!!');      	  								    	    	   		
		return true;
	}	
	return false;
}
function ipv4OnlyOrIpv6OnlyCheck() {
	var i = 0;
	var j = 0;
	var form=document.SNMP_form;
	
	if(form.IpVersion0.value=="IPv4/IPv6")
		return 2;
	if(form.IpVersion0.value=="IPv4")
		i++;
	if(form.IpVersion0.value=="IPv6")
		j++;
		
	if(form.IpVersion1.value=="IPv4/IPv6")
		return 2;
	if(form.IpVersion1.value=="IPv4")
		i++;
	if(form.IpVersion1.value=="IPv6")
		j++;

	if(form.IpVersion2.value=="IPv4/IPv6")
		return 2;
	if(form.IpVersion2.value=="IPv4")
		i++;
	if(form.IpVersion2.value=="IPv6")
		j++;

	if(form.IpVersion3.value=="IPv4/IPv6")
		return 2;
	if(form.IpVersion3.value=="IPv4")
		i++;
	if(form.IpVersion3.value=="IPv6")
		j++;

	if(form.IpVersion4.value=="IPv4/IPv6")
		return 2;
	if(form.IpVersion4.value=="IPv4")
		i++;
	if(form.IpVersion4.value=="IPv6")
		j++;

	if(form.IpVersion5.value=="IPv4/IPv6")
		return 2;
	if(form.IpVersion5.value=="IPv4")
		i++;
	if(form.IpVersion5.value=="IPv6")
		j++;

	if(form.IpVersion6.value=="IPv4/IPv6")
		return 2;
	if(form.IpVersion6.value=="IPv4")
		i++;
	if(form.IpVersion6.value=="IPv6")
		j++;

	if(form.IpVersion7.value=="IPv4/IPv6")
		return 2;
	if(form.IpVersion7.value=="IPv4")
		i++;
	if(form.IpVersion7.value=="IPv6")
		j++;

	if(i!=0 && j==0)
		return 0;

	if(j!=0 && i==0)
		return 1;
		
	if(i==0 && j==0)
		return 2;
	
 }
/*amy modified start 2017-12-15
function snmpOff(off){
	if(off){
		document.SNMP_form.SNMP_get.disabled = true;
		document.SNMP_form.SNMP_set.disabled = true;
    	        if(document.SNMP_form.SnmpFullflag.value == "Yes")
		{
			if (document.SNMP_form.startTrapflag.value != "Yes") {
				document.SNMP_form.SNMP_sysName.disabled = true;
				document.SNMP_form.SNMP_sysContact.disabled = true;
				document.SNMP_form.SNMP_sysLocation.disabled = true;
			}
			//cindy delete 0803
			//document.SNMP_form.SNMP_trapManagerIP.disabled = true;
			if(document.SNMP_form.SnmpIPv6flag.value == "Yes")
			{
				//cindy delete 0803
				//document.SNMP_form.SNMP_trapManagerIPv6.disabled = true;
			}
		}
		
		if (document.SNMP_form.trustIPflag.value == "Yes") {
			document.SNMP_form.SNMP_trustStartIP.disabled = true;
			document.SNMP_form.SNMP_trustEndIP.disabled = true;
			
			if(document.SNMP_form.SnmpIPv6flag.value == "Yes"){ 
				document.SNMP_form.SNMP_trustStartIPv6.disabled = true;
				document.SNMP_form.SNMP_trustEndIPv6.disabled = true; 
			}
		}
		if(document.SNMP_form.Snmpv3flag.value == "Yes")
		{
			document.SNMP_form.SNMPv3_enable[0].disabled = true;
			document.SNMP_form.SNMPv3_enable[1].disabled = true;
			document.SNMP_form.SNMPv3_User.disabled = true;
			document.SNMP_form.Access_Permissions.disabled = true;
			document.SNMP_form.Auth_Proto.disabled = true;
			document.SNMP_form.Auth_Passwd.disabled = true;
			document.SNMP_form.Privacy_Proto.disabled = true;
			document.SNMP_form.Privacy_Passwd.disabled = true;
		}					
	}
	else{
		document.SNMP_form.SNMP_get.disabled = false;
		document.SNMP_form.SNMP_set.disabled = false;
    	        if(document.SNMP_form.SnmpFullflag.value == "Yes")
		{
			if (document.SNMP_form.startTrapflag.value != "Yes") {
				document.SNMP_form.SNMP_sysName.disabled = false;
				document.SNMP_form.SNMP_sysContact.disabled = false;
				document.SNMP_form.SNMP_sysLocation.disabled = false;
			}
			//cindy delete 0803
			//document.SNMP_form.SNMP_trapManagerIP.disabled = false;
			if(document.SNMP_form.SnmpIPv6flag.value == "Yes")
			{
				//cindy delete 0803
				//document.SNMP_form.SNMP_trapManagerIPv6.disabled = false;
			}
		}
		
		if (document.SNMP_form.trustIPflag.value == "Yes") {
			document.SNMP_form.SNMP_trustStartIP.disabled = false;
			document.SNMP_form.SNMP_trustEndIP.disabled = false;
			
			if(document.SNMP_form.SnmpIPv6flag.value == "Yes") {
				document.SNMP_form.SNMP_trustStartIPv6.disabled = false;
				document.SNMP_form.SNMP_trustEndIPv6.disabled = false;
			}
		}
		if(document.SNMP_form.Snmpv3flag.value == "Yes")
		{
			document.SNMP_form.SNMPv3_enable[0].disabled = false;
			document.SNMP_form.SNMPv3_enable[1].disabled = false;
			document.SNMP_form.SNMPv3_User.disabled = false;
			document.SNMP_form.Access_Permissions.disabled = false;
			document.SNMP_form.Auth_Proto.disabled = false;
			document.SNMP_form.Auth_Passwd.disabled = false;
			document.SNMP_form.Privacy_Proto.disabled = false;
			document.SNMP_form.Privacy_Passwd.disabled = false;
		}						
	}
}
*/
function snmpOff(off){
	if(off)
		{
		setDisplay('div_snmp', 0);
		if(document.SNMP_form.Snmpv3flag.value == "Yes")
		setDisplay('div_snmpv3', 0);
		}
	else
		{
		setDisplay('div_snmp', 1);
		if(document.SNMP_form.Snmpv3flag.value == "Yes")
			{
			if(document.SNMP_form.SNMPv3_enable[0].checked)
				setDisplay('div_snmpv3', 1);
			else
				setDisplay('div_snmpv3', 0);
			}	
			
				
		}
}
//amy modified end 2017-12-15
function snmpv3Off(off){
	if(off)
		setDisplay('div_snmpv3', 0);
	else
		setDisplay('div_snmpv3', 1);
}

function snmpShow(){
	if(document.SNMP_form.elements[1].checked) 
		snmpOff(1); 
	else 
		snmpOff(0);
	
/*	if(document.SNMP_form.Snmpv3flag.value == "Yes")
	{
		if(document.SNMP_form.SNMPv3_enable[0].checked)
			snmpv3Off(0);
		else
			snmpv3Off(1);
	}*/	//amy removed 2017-12-15.
}
</script>

	</head>
	
	<body ><!--amy remove onLoad="snmpShow()" 0313-->
<FORM METHOD="POST" ACTION="/cgi-bin/access_snmp.asp" name="SNMP_form">
			<div id="pagestyle"><!--cindy add for border 11/28-->
			<div id="contenttype">
				<div id="block1">
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;" >
						<!--<tr height="10px">
							<td></td>
						</tr>-->

						<tr height="25px" class="bgcolor">
							
							<td  align="left" class="title-main" style="padding-left:20px;">SNMP</td>
						</tr>
					</table>
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
						<tr height="30px">
						    	<td width="20px">&nbsp;</td>
						    	<td width="250px" align=left class="tabdata">SNMP</td>
						     	<td align=left class="tabdata">
						     		<INPUT TYPE="RADIO" NAME="SNMP_active"  VALUE="Yes"  onClick="snmpOff(0)"  > 
						     		Enable 

								 &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="SNMP_active"  VALUE="No"  onClick="snmpOff(1)" checked > 
								Disable 
							</td>
							</tr>
						</table>
						<!--amy modified start 0313-->
						
							<div id="div_snmp" style="display:none;">
						
						<!--amy modified end 0313-->
						<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
					
							<tr height="30px">
							    	<td width="20px">&nbsp;</td>
							    	<td width="250px" align=left class="tabdata">SNMPv3</td>
							     	<td align=left class="tabdata">
								<INPUT TYPE="RADIO" NAME="SNMPv3_enable"  VALUE="Yes"  onClick="snmpv3Off(0)"  >
         								Enable  
						         		
        	     &nbsp;&nbsp;&nbsp;&nbsp;<INPUT TYPE="RADIO" NAME="SNMPv3_enable"  VALUE="No"  onClick="snmpv3Off(1)" checked >
							         	Disable  
								</td>
							</tr>
					

						<tr height="30px">
						    <td width="20px">&nbsp;</td>
						    	<td width="250px" align=left class="tabdata">Get Community</td>
						     	<td align=left class="tabdata">
						     		<INPUT TYPE="TEXT" NAME="SNMP_get" SIZE="30" MAXLENGTH="15" VALUE="" > 
							</td>
						</tr>

						<tr height="30px">
						    	<td width="20px">&nbsp;</td>
						    	<td width="250px" align=left class="tabdata">Set Community</td>
						     	<td align=left class="tabdata">
						     		<INPUT TYPE="TEXT" NAME="SNMP_set" SIZE="30" MAXLENGTH="15" VALUE="" >  
							</td>
   						 </tr>
				        
					
							<tr height="30px">
							    	<td width="20px">&nbsp;</td>
							    	<td width="250px" align=left class="tabdata">Trust Start IP</td>
							     	<td align=left class="tabdata">
							     		<INPUT TYPE="TEXT" NAME="SNMP_trustStartIP" SIZE="30" MAXLENGTH="15" VALUE="0.0.0.0" > 
								</td>
    							 </tr>

							<tr height="30px">
							    	<td width="20px">&nbsp;</td>
							    	<td width="250px" align=left class="tabdata">Trust End IP</td>
							     	<td align=left class="tabdata">
							     		<INPUT TYPE="TEXT" NAME="SNMP_trustEndIP" SIZE="30" MAXLENGTH="15" VALUE="0.0.0.0" > 
								</td>
     							</tr>
						
							 
								<tr height="30px">
								    	<td width="20px">&nbsp;</td>
								    	<td width="250px" align=left class="tabdata">Trust Start IPv6</td>
								     	<td align=left class="tabdata">
								     		<INPUT TYPE="TEXT" NAME="SNMP_trustStartIPv6" SIZE="30" MAXLENGTH="45" VALUE="" > 
									</td>
     								</tr>   

								<tr height="30px">
								    	<td width="20px">&nbsp;</td>
								    	<td width="250px" align=left class="tabdata">Trust End IPv6</td>
								     	<td align=left class="tabdata">
								     		<INPUT TYPE="TEXT" NAME="SNMP_trustEndIPv6" SIZE="30" MAXLENGTH="45" VALUE="" > 
									</td>
    		 						</tr>   
						
					
					
					
						
						
									<!--cindy delete 0803
									<tr>
								    <td class="light-orange">&nbsp;</td><td class="light-orange"></td><td class="tabdata"><div align=right>
								     Trap Manager IP     </div></td><td class="tabdata"><div align=center>:</div></td><td class="tabdata">
								        <INPUT TYPE="TEXT" NAME="SNMP_trapManagerIP" SIZE="30" MAXLENGTH="15" VALUE="0.0.0.0" >        </td>
								     </tr>
									 
									 <tr>
								    <td class="light-orange">&nbsp;</td><td class="light-orange"></td><td class="tabdata"><div align=right>
								     Trap Manager IPv6     </div></td><td class="tabdata"><div align=center>:</div></td><td class="tabdata">
								        <INPUT TYPE="TEXT" NAME="SNMP_trapManagerIPv6" SIZE="30" MAXLENGTH="50" VALUE="::" ></td>
								     </tr>  
									 
									 -->

															 						<!--<tr height="10px">
															<td></td>
														</tr>-->
					
				</table>
					</div>
				</div>
				
				

					<!--amy modified start 0313 -->
					
						<div id="div_snmpv3" style="display:none;">
					
					<!--amy modified end 0313 -->
						<div id="block1">
						<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
													<!--<tr height="10px">
							<td></td>
						</tr>-->

							<tr height="25px" class="bgcolor">
								
								<td  align="left" class="title-main" style="padding-left:20px;">SNMPv3</td>
							</tr>
						</table>
						<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
							<tr height="30px">
							    	<td width="20px">&nbsp;</td>
							    	<td width="250px" align=left class="tabdata">User Name</td>
							     	<td align=left class="tabdata">
							     		<INPUT TYPE="TEXT" NAME="SNMPv3_User" SIZE="30" MAXLENGTH="60" VALUE="" >
								</td>
   							 </tr>

							<tr height="30px">
							    	<td width="20px">&nbsp;</td>
							    	<td width="250px" align=left class="tabdata">Access Permissions</td>
							     	<td align=left class="tabdata">
							     		<SELECT NAME="Access_Permissions" SIZE="1" >
				<option value="R0" >RO
				<option value="RW" >RW
									</SELECT>
								</td>
    </tr>

							<tr height="30px">
							    	<td width="20px">&nbsp;</td>
							    	<td width="250px" align=left class="tabdata">Auth Protocol</td>
							     	<td align=left class="tabdata">
							     		<SELECT NAME="Auth_Proto" SIZE="1" >
				<option value="MD5" >MD5
				<option value="SHA" >SHA
									</SELECT>
								</td>
    </tr>

							<tr height="30px">
							  	<td width="20px">&nbsp;</td>
							    	<td width="250px" align=left class="tabdata">Auth Passwd</td>
							     	<td align=left class="tabdata">
        <INPUT TYPE="TEXT" NAME="Auth_Passwd" SIZE="30" MAXLENGTH="60" VALUE="" >
					          			(8~31 characters) 
								</td>
    </tr>

							<tr height="30px">
							    	<td width="20px">&nbsp;</td>
							    	<td width="250px" align=left class="tabdata">Privacy Protocol</td>
							     	<td align=left class="tabdata">
							     		<SELECT NAME="Privacy_Proto" SIZE="1" >
				<option value="DES" >DES
				<option value="AES" >AES
									</SELECT> 
								</td>
    </tr>

							<tr height="30px">
							    	<td width="20px">&nbsp;</td>
							    	<td width="250px" align=left class="tabdata">Privacy Passwd</td>
							     	<td align=left class="tabdata">
        <INPUT TYPE="TEXT" NAME="Privacy_Passwd" SIZE="30" MAXLENGTH="60" VALUE="" >
					          			(8~31 characters) 
								</td>
    </tr>

													<!--<tr height="10px">
							<td></td>
						</tr>-->
	</table>
	</div>
					</div>
			
		
				<div id="button0">
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
												<!--<tr height="10px">
							<td></td>
						</tr>-->
						<tr height="25px">
							<td  align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Save" to save your settings</td>
						</tr>
					</table>
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >	
						<tr height="40px">
							
							<td colspan="2" align=left class="tabdata" style="padding-left:20px;" >
		<INPUT TYPE="HIDDEN" NAME="IpVersion0" VALUE='IPv4/IPv6'>
		<INPUT TYPE="HIDDEN" NAME="IpVersion1" VALUE='0'>
		<INPUT TYPE="HIDDEN" NAME="IpVersion2" VALUE='0'>
		<INPUT TYPE="HIDDEN" NAME="IpVersion3" VALUE='0'>
		<INPUT TYPE="HIDDEN" NAME="IpVersion4" VALUE='0'>
		<INPUT TYPE="HIDDEN" NAME="IpVersion5" VALUE='0'>
		<INPUT TYPE="HIDDEN" NAME="IpVersion6" VALUE='0'>
		<INPUT TYPE="HIDDEN" NAME="IpVersion7" VALUE='0'>
		<INPUT TYPE="HIDDEN" NAME="Snmpflag" VALUE="0">
		<INPUT TYPE="HIDDEN" NAME="Snmpv3flag" VALUE="Yes">
		<INPUT TYPE="HIDDEN" NAME="SnmpIPv6flag" VALUE="Yes">
		<INPUT TYPE="HIDDEN" NAME="SnmpFullflag" VALUE="Yes">
		<INPUT TYPE="HIDDEN" NAME="startTrapflag" VALUE="Yes">
		<INPUT TYPE="HIDDEN" NAME="trustIPflag" VALUE="Yes">
								<INPUT TYPE="BUTTON" NAME="SaveBtn" class="button1" VALUE="Save" onClick="SNMPsave();">
							</td>
							<td id="firstDiv" style="float:left;"></td><!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
						</tr>

												<!--<tr height="10px">
							<td></td>
						</tr>-->
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
                    
	
		</form>
	</body>
</html>
