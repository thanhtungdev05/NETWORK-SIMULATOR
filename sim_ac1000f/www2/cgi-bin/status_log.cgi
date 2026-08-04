<!DOCTYPE html PUBLIC -//W3C//DTD XHTML 1.0 Transitional//EN http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd>
<html><head>
<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=utf-8">
<link rel="stylesheet" href="/style.css" type="text/css" tppabs="http://192.168.1.1/css/style.css">
<script language="JavaScript">	var virstrtmp = top.ary_strings;
	var vir_obj = {};
	for(var i=0; virstrtmp[i][0] != "";i++) vir_obj[virstrtmp[i][0]]=virstrtmp[i][1];
</script>
	</head>
<script language="JavaScript">
function showTable(id,data){
   selectNum = document.getElementById("read_level").value;
	var html = ["<table id=sys_log>"];
	var level = 0
	for(var i =0; i<data.length; i++){
		if(data[i][2] != "N/A"){
			var levelList = ["Emergency","Alert","Critical","Error","Warning","Notice","Info","Debug"]
			for(var count=0; count<8; count++){
				if(data[i][2].match(levelList[count])!=null) {
					level=count;
					}
				}
			if(selectNum >= level){ 
				html.push("<tr>");
				for(var j=0; j<(data[i].length); j++){
					html.push(data[i][j]);
				}
				html.push("</tr>");
			}
		}
	}
	html.push("</table>");
	document.getElementById(id).innerHTML = html.join('');
}
	var tableData = [
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:34:37</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:34:47</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:34:57</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:35:07</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE LCP down.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:35:12</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:35:22</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:35:32</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:35:42</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:35:52</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:36:02</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:36:12</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:36:22</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:36:32</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:36:42</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:36:52</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE LCP down.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:36:56</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:37:06</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:37:16</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:37:26</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:37:36</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:37:46</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:37:56</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:38:06</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:38:16</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:38:26</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:38:36</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE LCP down.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:38:40</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:38:50</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:39:00</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:39:10</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:39:20</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:39:30</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:39:40</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:39:50</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:40:01</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:40:11</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:40:21</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE LCP down.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:40:25</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:40:35</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:40:45</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:40:55</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:41:05</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:41:15</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:41:25</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:41:35</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:41:45</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:41:55</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:42:05</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE LCP down.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:42:09</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
,
	["<td width='15%'>Aug 17</td>","<td width='15%'>09:42:19</td>","<td width='18%'>Alert</td>","<td width='15%'>Daemon</td>","<td width='37%'>PPPoE send PADI.</td>"]
];
function save_log(){
	var cfg='/cgi-bin/foxsys.log';
	var code='location.assign("' + cfg + '")';
	eval(code);
}
function Refresh_log(){
	document.location.href="/cgi-bin/status_log.cgi";
}
</script>
<body marginwidth="0" marginheight="0">
<form>
	<div id="pagestyle">
		<div id="content_right">
			<div id="block1">
				<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;"> 
					<tr height="25px">
   <td align="left" class="title-main" style="padding-left:20px;">
<script>document.writeln(vir_obj["SystemLogText0"]);</script></td>
   </tr>
   </table>
   <table  width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
       <tbody>
       <tr height="40px" id="buttoncolor">
       <td align="left" class="tabdata" style="padding-left:20px;">
			<a class="button1" onClick="save_log();">
<script>document.writeln(vir_obj["SystemLogText1"]);</script></a>
       </td>
       </tr>
       </tbody>
  	</table>
   </div>
			<div id="block1">
				<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;"> 
					<tr height="25px">
						<td width="250px" align="left" class="title-main" style="padding-left:20px;background:#e6e6e6;">
<script>document.writeln(vir_obj["SystemLogSetReadingText"]);</script></td>
					</tr>
				</table>
				<table  width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tbody>
					<tr height="30px">
						<td width="250" id="XS2" class="tabdata" align="left" style="font-size:13px;padding-left:20px;">
<script>document.writeln(vir_obj["SystemLogReadingText"]);</script></td>
						<td class="tabdata" align="left">
							<select name="read_level" id="read_level" onchange="showTable('div_log',tableData)">
								<option value="0" id="XS17">
<script>document.writeln(vir_obj["SystemLogEmergencyText"]);</script></option>
								<option value="1" id="XS18">
<script>document.writeln(vir_obj["SystemLogAlertText"]);</script></option>
								<option value="2" id="XS19">
<script>document.writeln(vir_obj["SystemLogCriticalText"]);</script></option>
								<option value="3" id="XS20">
<script>document.writeln(vir_obj["SystemLogErrorText"]);</script></option>
								<option value="4" id="XS21">
<script>document.writeln(vir_obj["SystemLogWarningText"]);</script></option>
								<option value="5" id="XS22">
<script>document.writeln(vir_obj["SystemLogNoticeText"]);</script></option>
								<option value="6" id="XS23">
<script>document.writeln(vir_obj["SystemLogInformationalText"]);</script></option>
								<option value="7" id="XS24" selected>
<script>document.writeln(vir_obj["SystemLogDebugText"]);</script></option>
							</select>
						</td>
					</tr>
				</tbody></table>
			</div>
			<div class="cfglist">
				<table style="margin:5px 0;">
					<tbody><tr><th colspan="5" id="XS3" class="tableTitle">
<script>document.writeln(vir_obj["SystemLogText"]);</script></th></tr>
					</tbody></table>
				<table>
					<tbody>
					<tr>
						<td id="XS4" width="15%"><strong>
<script>document.writeln(vir_obj["SystemLogDateText"]);</script></strong></td>
						<td id="XS5" width="15%"><strong>
<script>document.writeln(vir_obj["SystemLogTimeText"]);</script></strong></td>
						<td id="XS6" width="18%"><strong>
<script>document.writeln(vir_obj["SystemLogLevelText"]);</script></strong></td>
						<td id="XS7" width="15%"><strong>
<script>document.writeln(vir_obj["SystemLogSystemText"]);</script></strong></td>
						<td id="XS8" width="37%"><strong>
<script>document.writeln(vir_obj["SystemLogActionText"]);</script></strong></td>
					</tr>
				</tbody></table>
				<div id="div_log" style="overflow-y: auto; overflow-x:hidden;height: 400px;">
				</div>
			</div>
		</div>
	</div>
				<table  width="690px" border="0" cellpadding="0" cellspacing="0">
                           <tr height="30">
 					<td width="20">&nbsp;</td>
 					<td width="250">&nbsp;</td>
 					<td width="420"></td>
 				</tr>
 				<tr>
 					<td align=center colSpan=3 style="background-color:transparent;font-family: Arial,Helvetica,sans-serif;color:#404040;"><font size=2>
<script>document.writeln(vir_obj["CopyrightText"]);</script></font></td>
 				</tr>
                           <tr height="10">
 					<td width="20">&nbsp;</td>
 					<td width="250">&nbsp;</td>
 					<td width="420"></td>
 				</tr>
 			</table>
</form>
</body>
<script language=JavaScript>
	showTable('div_log',tableData);
</script>
</html>
