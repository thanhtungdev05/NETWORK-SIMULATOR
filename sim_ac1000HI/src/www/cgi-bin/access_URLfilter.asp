

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<META http-equiv=Content-Script-Type content=text/javascript>
<META http-equiv=Content-Style-Type content=text/css>
<META http-equiv=Content-Type content="text/html; charset=&#10;UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css">
<script language="JavaScript" type="text/javascript" src="/general.js"></script>

<style  type="text/css">

*{color:  #404040;}

</style>

<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
<script type="text/javascript" src="/spin.js" ></script>
<!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
<SCRIPT language="javascript" type="text/javascript">

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


var ary_url = [
				["N/A", "N/A"],
				["N/A", "N/A"],
				["N/A", "N/A"],
				["N/A", "N/A"],
				["N/A", "N/A"],
				["N/A", "N/A"],
				["N/A", "N/A"],
				["N/A", "N/A"]
			];
var	strActive = new Array("Enable", "Disable");
var n = 0;
var url_obj = new Array(new Array);
for (var i=0; i<ary_url.length; i++)
{
	if ("1" == ary_url[i][0])	
		url_obj[i] = [strActive[0], ary_url[i][1]];
	else
		url_obj[i] = [strActive[1], ary_url[i][1]];
}
function writeUrlTable()
{
	if ('undefined' == typeof(url_obj[0][0])) return;
	var strtemp = "";
	for (var i=0; i<url_obj.length; i++) {
		if (url_obj[i][1] != "" && url_obj[i][1] != "N/A") {
			strtemp += '<tr height=30><td align="center" class="topborderstyle">' + (i+1) + '</td>\n';
			strtemp += '<td align="center" class="topborderstyle">' + url_obj[i][0] + '</td>\n';
			strtemp += '<td align="center" class="topborderstyle">' + url_obj[i][1] + '</td></tr>\n';
		}
	}
	document.write(strtemp);
}
function switchFilterType(object)
{
  var index = object.selectedIndex;
	switch(index)
	{
		case 0:
			window.location='access_ipfilter.asp';
			break;
	/*	case 1:
			window.location='access_appfilter.asp';
			break;
			*/
	}
}
//amy add start 
/*
function UrlfilterOnOff(off)
{
	if(off)
		{
		
		document.UrlFilterform.UrlFilter_index.disabled=true;
		document.UrlFilterform.SingleRule_active[0].disabled=true;
		document.UrlFilterform.SingleRule_active[1].disabled=true;
		document.UrlFilterform.UrlFilter_URL.disabled=true;
		
	//	document.getElementById("div_ruleIndex").style.display="none";
	//	document.getElementById("div_urltxt").style.display="none";
	//	document.getElementById("div_urltable").style.display="none";
	//	document.UrlFilterform.UrlFilterDelete.disabled=true;
	//	document.getElementById("del").style.display="none";
	//	document.getElementById("div_del").style.display="none";
	//	document.getElementById("div_save").style.display="";
		//setDisplay('div_ruleIndex',0);
		//setDisplay('div_ruleIndex',0);
		//setDisplay('div_urltable',0);
		}
	else
		{
		
		document.UrlFilterform.UrlFilter_index.disabled=false;
		document.UrlFilterform.SingleRule_active[0].disabled=false;
		document.UrlFilterform.SingleRule_active[1].disabled=false;
		if(document.UrlFilterform.SingleRule_active[0].checked)
			document.UrlFilterform.UrlFilter_URL.disabled=false;
		else
			document.UrlFilterform.UrlFilter_URL.disabled=true;
	
		/*
		setDisplay('div_ruleIndex',1);
		if(document.UrlFilterform.SingleRule_active[0].checked)
			setDisplay('div_urltxt',1);
		else
			setDisplay('div_urltxt',0);
		setDisplay('div_urltable',1);
		
		document.getElementById("div_ruleIndex").style.display="block";
		if(document.UrlFilterform.SingleRule_active[0].checked)
			document.getElementById("div_urltxt").style.display="block";
		else
			document.getElementById("div_urltxt").style.display="none";
		document.getElementById("div_urltable").style.display="block";
		document.getElementById("del").style.display="";
		document.getElementById("div_del").style.display="";
		document.getElementById("div_save").style.display="none";
		*/
		
		/*}
		
		
}*/
function UrlfilterOnOff(off)
{
	if(off)
		{
	
		document.getElementById("div_ruleIndex").style.display="none";
		document.getElementById("div_urltxt").style.display="none";
		document.getElementById("div_urltable").style.display="none";
	//	document.getElementById("del").style.display="none";
		document.getElementById("div_del").style.display="none";
		document.getElementById("div_save").style.display="";

		}
	else
		{
	
		
		document.getElementById("div_ruleIndex").style.display="";
		if(document.UrlFilterform.SingleRule_active[0].checked)
			document.getElementById("div_urltxt").style.display="";
		else
			document.getElementById("div_urltxt").style.display="none";
		document.getElementById("div_urltable").style.display="";
	//	document.getElementById("del").style.display="";
		document.getElementById("div_del").style.display="";
		document.getElementById("div_save").style.display="none";
		
		}
		
		
}
function SingleRuleOnOff(off)
{
	if(off)
		document.getElementById("div_urltxt").style.display="none";
	//	document.UrlFilterform.UrlFilter_URL.disabled=true;
	else
		document.getElementById("div_urltxt").style.display="";
	//	document.UrlFilterform.UrlFilter_URL.disabled=false;
		
}
//amy add end.

function doDel()
{
document.UrlFilterform.Save_or_Delete.value = 2;

}
function doSubmit(){
	var str=UrlFilterform.UrlFilter_URL.value;
	var lower_str;

	lower_str = str.toLowerCase();
	str = lower_str;
	UrlFilterform.UrlFilter_URL.value = lower_str;

	if ((UrlFilterform.SingleRule_active[1].checked) && (str.length == 0)) {
		//alert("set switch for each");
	}
	else {
		if (str.length > 48 || isValidUrlName(str) == false){
			alert("Invalid url,please check!");
			return false;
		}	
	}
	showSpin();//cindy add
	document.UrlFilterform.Save_or_Delete.value = 1;
	
	// LÆ¯U Cáº¤U HÃŒNH VÃ€O SESSION STORAGE (GIáº¢ Láº¬P)
	var simData = {};
	for(var j=0; j<document.UrlFilterform.elements.length; j++) {
		var el = document.UrlFilterform.elements[j];
		if(el.name) {
			if(el.type === 'radio' || el.type === 'checkbox') {
				if(el.checked) simData[el.name] = el.value;
			} else {
				simData[el.name] = el.value;
			}
		}
	}
	sessionStorage.setItem('UF_simData', JSON.stringify(simData));
	
	document.UrlFilterform.submit();
}

function init()
{
//	if(document.UrlFilterform.RuleIndex_active[0].checked) //amy add start.
//		UrlfilterOnOff(0);
//	else
//		UrlfilterOnOff(1); //amy add end. amy removed 0313.
	if(document.forms[0].Duplicate.value == 1)
	{
		alert("The rule has already exist!");
		document.forms[0].submit();
	}
}
</SCRIPT>

<META content="MSHTML 6.00.2900.3059" name=GENERATOR></HEAD>

<BODY onLoad="init();">
<FORM name=UrlFilterform action="/cgi-bin/access_URLfilter.asp" method=post>
			<div id="pagestyle"><!--cindy add for border 11/28-->
				<div id="contenttype">
				<div id="block1">
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;" >
						

						<tr height="25px" class="bgcolor">

							<td  align="left" class="title-main" style="padding-left:20px;">Filter Type</td>
						</tr>
					</table>
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata"  >
						<tr height="30px">

						    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Filter Type Selection</td>
						     	<td align=left class="tabdata">
							<SELECT onchange=switchFilterType(this) size=1 name=FILTERTYPE_index>
								<OPTION >IP / MAC Filter
								<OPTION SELECTED>URL Filter
				    			</SELECT>
							</td>
						</tr>
					</table>
				</div>
				
				<div id="block1">
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;" >
						<tr height="25px" class="bgcolor">

							<td  align="left" class="title-main" style="padding-left:20px;">URL Filter Editing</td>
						</tr>
					</table>
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata"  >
						<tr height="30px">
    	
						    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Active</td>
						     	<td align=left class="tabdata">
						     		<INPUT type=radio checked value=1 name=RuleIndex_active onClick="UrlfilterOnOff(0)">  Enable  
    							&nbsp;&nbsp;&nbsp;&nbsp;<INPUT type=radio  value=0 name=RuleIndex_active onClick="UrlfilterOnOff(1)">  Disable
							</td>
						</tr>
					</table>
					<!--amy modified start 0313-->
					
						<div id="div_ruleIndex">
					
					<!--amy modified end 0313-->
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >	
						<tr height="30px">
						    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">URL Index</td>
						     	<td align=left class="tabdata">
				    			 <SELECT NAME="UrlFilter_index" SIZE="1" onchange="document.UrlFilterform.submit();">
				      				<OPTION selected value="0">1
				      				<OPTION  value="1">2
				      				<OPTION  value="2">3
				      				<OPTION  value="3">4
				      				<OPTION  value="4">5
				      				<OPTION  value="5">6
				      				<OPTION  value="6">7
				      				<OPTION  value="7">8
									<!-- Only Support 8 rules
				      				<OPTION  value="8">9
				      				<OPTION  value="9">10
				      				<OPTION  value="10">11
				      				<OPTION  value="11">12
				      				<OPTION  value="12">13
				      				<OPTION  value="13">14
				      				<OPTION  value="14">15
				      				<OPTION  value="15">16
									-->
				    			</SELECT>
							</td>
						</tr>

						<tr height="30px">
						    	
						    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">Individual active</td>
						     	<td align=left class="tabdata">
						     		<INPUT type=radio  value=1 name=SingleRule_active onClick="SingleRuleOnOff(0)">  Enable  
    								&nbsp;&nbsp;&nbsp;&nbsp;<INPUT type=radio checked value=0 name=SingleRule_active onClick="SingleRuleOnOff(1)">  Disable
							</td>
						</tr>
						</table>
					</div>
					<!--amy modified start 0313-->
					
						
							<div id="div_urltxt" style="display:none;">
						
					
					<!--amy modified end 0313-->
						<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
							<tr height="30px">
							    	
							    	<td width="250px" align=left class="tabdata" style="padding-left:20px;">URL(host)</td>
							     	<td align=left class="tabdata">
    									<INPUT TYPE="TEXT" maxLength=49 size=48 name="UrlFilter_URL" VALUE="" > (maxlength:48)  
								</td>
							</tr>

							
						</table>
					</div>
				</div>
				<!--amy modified start 0313-->
				
					<div id="div_urltable">
				
				<!--amy modified end 0313-->
				<div id="block1">
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"  style="margin:5px 0px;">
						

						<tr height="25px" class="bgcolor">

							<td  align="left" class="title-main" style="padding-left:20px;">URL Filter Listing</td>
						</tr>
					</table>
					<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF"  >
						<!--amy
						<tr height="30px">
    	
						    	<td colspan="2" align=left class="tabdata">
						    	-->
			<!--
    			<iframe src="/cgi-bin/access_urlfilterlist.cgi" frameborder="0" width="580" height="200"></iframe>
			-->			<tr>
						<td align=left class="tabdata">	
						
							<div class="configstyle">
								<table width="600" border="0"  cellpadding="0" cellspacing="0" bordercolor="#CCCCCC" bgcolor="#FFFFFF" >
								<tr height="30px">
				                			<td class=tabdata align=center width=30><STRONG>Index</STRONG></td>
									<td width=100 align=center class="tabdata"><strong>Active </strong></td> 
									<td class=tabdata align=center width=460><STRONG>  
					                  					URL  </STRONG>
									</td>
								</tr>
										
								<script language="JavaScript" type="text/JavaScript">
									writeUrlTable();
								</script>
								</table>
							</div>
						
							
						    	</td>						     	
						</tr>
    	
					
					</table>
				</div>
				</div>

				<div id="button0">
				<!--amy modified start 0313-->
				
					<div id="div_del">
				
				<!--amy modified end 0313-->
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">

    						<tr height="25px">
							<td align=left class="title-main" style="white-space:nowrap; padding-left:20px;">Click "Save" to save URL filter setting and "Delete" to delete URL filter setting</td>
						</tr>
					</table>
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >
						<tr height="40px">
   
							<td width="250px" align=left class="tabdata" style="padding-left:20px;">
							    
								<INPUT type=button class="button1" value=Save name=UrlFilterApply onclick="doSubmit()">
								<INPUT type=submit class="button1"  value=Delete name=UrlFilterDelete onclick="doDel();">																					
								<INPUT type=reset class="button1" style="display:none" value=Cancel name=UrlFilterCancel> 
							</td>
							<td id="firstDiv" style="float:left;"></td><!--cindy add for  show cache image in webgui when click the "save" button 2019/02/15-->
						</tr>
					</table>
					</div>
					<!--amy modified start 0313-->
					
						<div id="div_save" style="display:none;">
					
					<!--amy modified end 0313-->
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">

    						<tr height="25px" class="bgcolor">
							<td align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Save" to save URL filter setting</td>
						</tr>
					</table>
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" >

						<tr height="40px"> 
							<td width="250px" align=left class="tabdata" style="padding-left:20px;">
								<INPUT type=button class="button1" value=Save name=UrlFilterApply onclick="doSubmit()">
							</td>
					</table>
					</div>
					
    					<INPUT TYPE="HIDDEN" NAME="Save_or_Delete" VALUE="0">
					<INPUT type="hidden" name="Duplicate" VALUE="0">
					<Input type="hidden" name="NoDup" value="No">
					
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
		
		<!-- LÆ¯U Cáº¤U HÃŒNH VÃ€O SESSION STORAGE (GIáº¢ Láº¬P) -->
		<script>
			window.addEventListener('DOMContentLoaded', function() {
				var stored = sessionStorage.getItem('UF_simData');
				if(stored) {
					var data = JSON.parse(stored);
					for(var key in data) {
						var els = document.getElementsByName(key);
						if(els.length > 0) {
							if(els[0].type === 'radio' || els[0].type === 'checkbox') {
								for(var i=0; i<els.length; i++) {
									if(els[i].value === data[key]) els[i].checked = true;
								}
							} else if(els[0].tagName === 'SELECT') {
								for(var i=0; i<els[0].options.length; i++) {
									if(els[0].options[i].value === data[key] || els[0].options[i].text === data[key]) {
										els[0].selectedIndex = i;
										break;
									}
								}
							} else {
								els[0].value = data[key];
							}
						}
					}
					// Chá»‰ phá»¥c há»“i 1 láº§n duy nháº¥t sau khi báº¥m Save, sau Ä‘Ã³ xoÃ¡ Ä‘á»ƒ phiÃªn sau rá»—ng
					sessionStorage.removeItem('UF_simData');
				}
			});
		</script>
		</FORM>
	</BODY>
</HTML>
