


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<META http-equiv=Content-Script-Type content=text/javascript>
<META http-equiv=Content-Style-Type content=text/css>
<META http-equiv=Content-Type content="text/html; charset=&#10;UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css" >

<style  type="text/css">

*{color:  #404040;}

.main_item
{
	background-color: #FFFFFF;
	width:680px;
	padding:0px 3px 10px 3px;
	margin:0;
	outline:0;
	position:relative;
	border:1px solid #fff;
	-moz-border-radius:10px;
	-webkit-border-radius:10px;
	border-radius:10px;
	behavior:url(/PIE.htc);
}
</style>

<script type="text/javascript" src="/spin.js" ></script>
<SCRIPT language=javascript>

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
                                                /*for(var j=0; j<data[i].length; j++){
                                html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");
                        }*/
						html.push("<td align=center class=topborderstyle>" + data[i][0] + "</td>");
						html.push("<td align=center class=topborderstyle>" + data[i][1] + "</td>");
						html.push("<td align=center class=topborderstyle>" + data[i][5] + "</td>");
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
		var org_list_type = "";
        document.forms[0].RuleTypeChange.value = 1;
        
		if(org_list_type != document.forms[0].RuleTypeSEL.value)
			document.forms[0].ListTypeChangeFlag.value = 1;

}

function doDel()
{
        document.forms[0].RuleTypeChange.value = 2;
}

function doChangeRuleType()
{
		
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
                                alert("Invalid IP address:" + Address);
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
 /* solve 0.0.0.1 or 255.255.255.1\129\193\225\241\249\253 can be saved*/
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
				
                        {
                        document.getElementById("divMac").style.display="";
                        document.getElementById("divIP").style.display="none";
                        }
                }


}

function IPFilterinit()
{
        if(document.IPFILTERform.FULL.value.length != 0){
                alert(document.IPFILTERform.FULL.value);
        }
        if(document.IPFILTERform.Duplicate.value==1){
                alert("The rule has already exist!");
                document.IPFILTERform.submit();
        }
/*      if(document.IPFILTERform.FILTERRuleTypeSEL.selectedIndex == 0){
//              document.getElementById("divIP").style.display="";
                document.getElementById("divMac").style.display="none";
                }
        else{
        //      document.getElementById("divMac").style.display="";
                document.getElementById("divIP").style.display="none"; 
                }
                if(document.IPFILTERform.RuleActiveRDO[0].checked)
                IpfilterOnOff(0);
        else
                IpfilterOnOff(1);
        */
}
function doMACcheck(object)
{
        var szAddr = object.value;
        var len = szAddr.length;

        if(len==0)
        {
                alert("Empty MAC Address!");
                return -1;
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
                                return -1;
                        }
                        if((i == 2)||(i == 4)||(i == 6)||(i == 8)||(i == 10))
                        {
                                newAddr = newAddr + ":";
                        }
                        newAddr = newAddr + c;
                }
                object.value = newAddr;
                return 0;
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
                        return -1;
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
                                return -1;
                        }
                        i = i + 3;
                }
                if((szAddr == "00:00:00:00:00:00") || (szAddr.toUpperCase() == "FF:FF:FF:FF:FF:FF"))
                {
                        alert("Invalid MAC Address");
                        object.focus();
                        return -1;
                }
                return 0; 
        }
        else
        {
                alert("Invalid MAC Address");
                object.focus();
                return -1;
        }
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
                "","","","",
                "","","","",
                "","","","",
                "","","","",
        ]
        DestIPData = [
                "","","","",
                "","","","",
                "","","","",
                "","","","",
        ]
        SrcMaskData = [
                "","","","",
                "","","","",
                "","","","",
                "","","","",
        ]
        DestMaskData = [
                "","","","",
                "","","","",
                "","","","",
                "","","","",
        ]
                    
        RuleType = document.IPFILTERform.FILTERRuleTypeSEL.selectedIndex;
        switch(RuleType)
        {
                case 0:
				
                        //if(document.IPFILTERform.MacAddrTXT.value.length==0)
						if(document.IPFILTERform.RuleActiveRDO.value == "Yes" && doMACcheck(document.IPFILTERform.MacAddrTXT) == -1)
                        {
                        return false;
            }
            for(var i=0; i<16; i++)
            {
                if(document.IPFILTERform.RuleTypeSEL.value != "")
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
        showSpin();
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

</SCRIPT>

<META content="MSHTML 6.00.2900.3059" name=GENERATOR>
</HEAD>

<BODY onload="IPFilterinit();">
<FORM name=IPFILTERform action=/cgi-bin/access_ipfilter.asp method=post>
                        <div id="pagestyle">
                                <div id="contenttype">
                                <div id="block1" class="main_item" style="display:none">
                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
                                                <tr height="25px" style="width:100%;background:#4acbd6;">
                                                        <td  align="left" class="title-main" style="padding-left:20px;">Filter Type</td>
                                                </tr>
                                        </table>
                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
                                                <tr height="30px">
                                                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">Filter Type Selection</td>
                                                        <td align=left class="tabdata">
                                                        <SELECT name=FILTERTYPE_index onchange=switchFilterType(this) size=1>
                                                                <OPTION SELECTED>MAC Filter
                                                                <OPTION>URL Filter
                                                        </SELECT> 
                                                        </td>
                                                </tr>
                                                </table>
                                        </div>

                                        
                                                <div id="block1" class="main_item">
                                                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
                                                        <tr height="25px" style="width:100%;background:#4acbd6;">
                                                                <td width="250px" align="left" class="title-main" style="padding-left:20px;">Rule Type</td>
                                                        </tr>
                                                </table>
                                                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
                                                        <tr height="30px">
                                                                <td width="250px" align=left class="tabdata" style="padding-left:20px;">Rule Type Selection</td>
                                                                <td align=left class="tabdata">
                                                                        <SELECT name=RuleTypeSEL size=1>
                                                                                <OPTION VALUE="Black" >Black List
                                                                                <OPTION VALUE="White" >White List
                                                                        </SELECT> 
                                                                </td>
                                                        </tr>
                                                </table>
                                        </div>
                                        
                                <div id="block1" class="main_item">
                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
                                                <tr height="25px" style="width:100%;background:#4acbd6;">
                                                        <td  align="left" class="title-main" style="padding-left:20px;">Filter Rule Editing</td>
                                                </tr>
                                        </table>
                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
                                                <tr height="30px">
                                                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">MAC Filter Rule Index</td>
                                                        <td align=left class="tabdata">
                                                                <SELECT name=RuleIndexSEL onchange="doIndexChange();" size=1>
                                                                        <OPTION VALUE="0" >1
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

                                                                > 
                                                                        Disable
                                                        </td>
                                                </tr>
                                                </table>
                                        
                                                <div id="rule_active" style="display:none;">
                                        

                                                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
                                        <!--else if tcWebApi_get("WebCustom_Entry","isCZGeneralSupported","h") <> "Yes"-->
                                                        <tr height="30px" style="display:none">                                                           
                                                                <td width="250px" align=left class="tabdata" style="padding-left:20px;">Interface</td>
                                                                <td align=left class="tabdata">
                                                <!-- else if tcWebApi_get("WebCustom_Entry","isMultiSerSupported","h") <> "Yes"  -->
                                                                <SELECT name=InterfaceSEL size=1>
                                                                        

                                                                        

                                                                        

                                                                        
                                                                </SELECT> 
                                                                </td>
                                                        </tr>
                                                                        <!--end if tcWebApi_get("WebCustom_Entry","isMultiSerSupported","h") = "Yes" -->

                                                                

                                                        <tr height="30px" style="display:none">
                                                            
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
																	
                                                                        <OPTION VALUE="MAC" >MAC
                                                                </SELECT>
                                                                </td>
                                                        </tr>

                                        </table>
                                        </div><!--end div-rule_active-->

                                        
                                                <div id="divIP" style="display:none;">
                                        

                                                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >


                                                        <tr height="30px">
                                                            
                                                                <td width="250px" align=left class="tabdata" style="padding-left:20px;">Source IP Address</td>
                                                                <td align=left class="tabdata">
                                                                        <INPUT name=SrcIPTXT onblur=blockMask(0); maxLength=15 size=15 VALUE="">
                                                                (0.0.0.0 means Don't care)
                                                                </td>
                                                        </tr>

                                                        <tr height="30px">
                                                            
                                                                <td width="250px" align=left class="tabdata" style="padding-left:20px;">Subnet Mask</td>
                                                                <td align=left class="tabdata">
                                                                        <INPUT maxLength=15 size=15 name=SrcMaskTXT VALUE="" >
                                                                </td>
                                                        </tr>

                                                        <tr height="30px">
                                                            
                                                                <td width="250px" align=left class="tabdata" style="padding-left:20px;">Port Number</td>
                                                                <td align=left class="tabdata">
                                                                        <INPUT maxLength=7 size=8 name=SrcPortTXT VALUE="" >
                                                                        (0 means Don't care)
                                                                </td>
                                                        </tr>


                                                </table>



                                                <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >


                                                        <tr height="30px">
                                                            
                                                                <td width="250px" align=left class="tabdata" style="padding-left:20px;">Destination IP Address</td>
                                                                <td align=left class="tabdata">
                                                                        <INPUT onblur=blockMask(1); maxLength=15 size=15 name=DestIPTXT VALUE="" >
                                                                        (0.0.0.0 means Don't care)
                                                                </td>
                                                        </tr>

                                                        <tr height="30px">
                                                            
                                                                <td width="250px" align=left class="tabdata" style="padding-left:20px;">Subnet Mask</td>
                                                                <td align=left class="tabdata">
                                                                        <INPUT maxLength=15 size=15 name=DestMaskTXT VALUE="" >
                                                                </td>
                                                        </tr>

                                                        <tr height="30px">
                                                            
                                                                <td width="250px" align=left class="tabdata" style="padding-left:20px;">Port Number</td>
                                                                <td align=left class="tabdata">
                                                                        <INPUT maxLength=7 size=8 name=DestPortTXT VALUE="" >
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

                                
                                        <div id="divMac" style="display:none;">
                                


                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >

                                                <tr height="30px">
                                                    
                                                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">MAC Address</td>
                                                        <td align=left class="tabdata">
                                                                <INPUT name=MacAddrTXT maxLength=17 size=17 value="">
                                                        </td>
                                                </tr>
                                        </table>
                                </div>

                                </div>

                <!---end   if tcWebApi_get("WebCustom_Entry","isCZGeneralSupported","h") ="Yes" --->

                                <div id="block1" class="main_item">
                                        <table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
                                                <tr height="25px" style="width:100%;background:#4acbd6;">
                                                        <td  align="left" class="title-main" style="padding-left:20px;">MAC Filter Listing</td>
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
                                                                                //   ["62","Interface"],
                                                                                //     ["64","Direction"],
                                                                                //     ["93","Src Address/" + "Mask"],
                                                                                //     ["93","Dest Address/" + "Mask"],
                                                                                     ["87","Mac Address"],
                                                                                //     ["33","Src Port"],
                                                                                //     ["34","Dest Port"],
                                                                                
                                                                                //     ["60","Protocol"]
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

                                <div id="button0" class="main_item">
                                        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
                                                <tr height="25px">
                                                        <td align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Save" to save MAC Filter setting and "Delete" to delete MAC Filter setting</td>
                                                </tr>
                                        </table>
                                        <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
                                                <tr height="40px">

                                                        <td width="250px" align=left class="tabdata" style="padding-left:20px;">
                                                                <INPUT type=hidden name=c2Support VALUE="0">
                                                                <INPUT type=hidden name=FULL>
                                                                <INPUT type=hidden name=RuleTypeChange VALUE="0">
																<INPUT type=hidden name=ListTypeChangeFlag VALUE="0">
                                                                
                                                                <INPUT type="hidden" name="Duplicate" VALUE="0">
                                                                <Input type="hidden" name="NoDup" value="No">
                                                                <INPUT type=hidden name=DSCPFLT VALUE="">
                                                                <INPUT type="submit" class="button1" value=Save name=IpFilterApply onclick="doAdd();return validateInput();">



                                                                <INPUT type="submit" class="button1" value=Delete name=IpFilterDelete onclick="doDel();"> 



                                                                <INPUT type="reset" style="display:none" class="button1" value=Cancel name=IpFilterCancel onclick="doCancel();" > 
                                                        </td>
                                                        <td id="firstDiv" style="float:left;"></td>
                                                </tr>


                                        </table>
                                </div>
                                </div>
                        </div>

                
</FORM>
</BODY>
</HTML>
