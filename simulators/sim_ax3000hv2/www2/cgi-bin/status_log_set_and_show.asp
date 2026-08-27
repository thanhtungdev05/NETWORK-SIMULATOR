


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
		<meta http-equiv=Content-Script-Type content=text/javascript>
		<meta http-equiv=Content-Style-Type content=text/css>
		<meta http-equiv=Content-Type content="text/html; charset=iso-8859-1">
		<script language="JavaScript" src="OutVariant.asp"></script>
		<script language="JavaScript" src="/general.js"></script>
		<script language="JavaScript" src="/jsl.js"></script>
		<script language="JavaScript" src="/ip.js"></script>
		<style  type="text/css">
			*{color:  #404040;}
		</style>

		<script type="text/javascript" src="/spin.js" ></script>
	<link rel="stylesheet" type="text/css" href="/style.css">
<script language="JavaScript">
/*var syslog_logLevel = "6";
var syslog_logEnable = "1";
var syslog_server = "www.server";
var syslog_port = "2048";
var syslog_protocol = "udp";//tcp/udp*/
var syslog_logLevel='7';
var syslog_logEnable='0';
var syslog_server='bblogs.fpt.vn';
var syslog_port='514';
var syslog_protocol='udp';


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

function HiddenServerInfo(){
	if(document.status_log_form.ServerLogEnable[0].checked)
		document.getElementById("hiddenServerLog").style.display="";
	else
	document.getElementById("hiddenServerLog").style.display="none";
}

function uiSave(){
	showSpin();
	document.status_log_form.saveFlag.value=1;
	document.status_log_form.submit();
}

</script>
	</head>

<body style="background:#4acbd6;">
	<FORM METHOD="POST" ACTION="/cgi-bin/status_log_set_and_show.asp" name="status_log_form">
		<div id="pagestyle">
			<div id="contenttype">  
				<div id="block1" class="main_item">
					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed; margin:5px 0;">
						<tr height="25px" style="background-color:#e6e6e6;">
							<td align=left class="title-main" style="width:620px;padding-left:20px;">
								System Log Configuration
							</td>
						</tr>
					</table>

					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
						<tr height="30px">
							<td align=left class="tabdata" style="width:260px;padding-left:20px;">Log Level</td>
							<td align="left" class="tabdata">
								<select name="logLevel" size="1">
									<option value="0">Emergency</option>
									<option value="1">Alert</option>
									<option value="2">Critical</option>
									<option value="3">Error</option>
									<option value="4">Warning</option>
									<option value="5">Notice</option>
									<option value="6">Info</option>
									<option value="7">Debug</option>
								</select>
							</td>
							<script>
							document.getElementsByName("logLevel")[0].value = syslog_logLevel;
							</script>
						</tr>
						<tr height="30px">
							<td align=left class="tabdata" style="width:260px;padding-left:20px;">External system log server state</td>
							<td align=left class="tabdata">
											<INPUT TYPE="radio" NAME="ServerLogEnable" VALUE="Yes"  onClick="HiddenServerInfo();"> Enable&nbsp;&nbsp;&nbsp;&nbsp;
											<INPUT TYPE="radio" NAME="ServerLogEnable" VALUE="No"  onClick="HiddenServerInfo();"> Disable 
							</td>
							<script>
							if (syslog_logEnable == "1") {//打开双频合一
							document.getElementsByName("ServerLogEnable")[0].checked = true;
							document.getElementsByName("ServerLogEnable")[1].checked = false;
							} else {
							document.getElementsByName("ServerLogEnable")[0].checked = false;
							document.getElementsByName("ServerLogEnable")[1].checked = true;
							}
							</script>
						</tr>
					</table>
				</div>

				<div id="block1">
					<div id="hiddenServerLog" class="main_item" style="display:none">
					<script language="JavaScript" type="text/JavaScript">
						HiddenServerInfo();
					</script>
					<!--<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed; margin:5px 0;">
						<tr height="25px" style="background-color:#e6e6e6;">
							<td align=left class="title-main" style="width:620px;padding-left:20px;">
								Time Control setting
							</td>
						</tr>
					</table>-->

					<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
						<tr height="30px">
							<td align=left class="tabdata" style="width:260px;padding-left:20px;">External system log server</td>
							<td align=left class="tabdata">
								<INPUT TYPE="text" NAME="server" SIZE="26" MAXLENGTH="64">    
							</td>
							<script>
							document.getElementsByName("server")[0].value = syslog_server;
							</script>
						</tr>

					<tr height="30px">
						<td align=left class="tabdata" style="width:260px;padding-left:20px;">External system log server port</td>
						<td align=left class="tabdata">
							<INPUT TYPE="text" NAME="port" SIZE="26" MAXLENGTH="64">
						</td>
						<script>
						document.getElementsByName("port")[0].value = syslog_port;
						</script>
					</tr>

					<tr height="30px">
						<td align=left class="tabdata" style="width:260px;padding-left:20px;">External system log server protocol</td>
						<td align=left class="tabdata">
							<select name="protocol" size="1">
								<option value="tcp">TCP</option>
								<option value="udp">UDP</option>
							</select>
						</td>
						<script>
						document.getElementsByName("protocol")[0].value = syslog_protocol;
						</script>
					</tr>
				</table>
			</div>
		</div>

		<div id="button0" class="main_item">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
				<tr height="25px">
					<td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
						Click "Save" to save your settings
					</td>
				</tr>
			</table>

			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
				<tr height="40px">
					<td align=left class="tabdata" style="width:250px;padding-left:20px;">
						<INPUT TYPE="HIDDEN" NAME="saveFlag" VALUE="0">
						<INPUT TYPE="button" class="button1" NAME="SaveBtn" VALUE="Save" onClick="uiSave()"> 
					</td>
					<td id="firstDiv" style="float:left;"></td>
				</tr>
			</table>
		</div>
		<script language="JavaScript" type="text/JavaScript">
			document.writeln("<iframe src='/cgi-bin/status_log.cgi' frameborder='0' width='760' height='530' ></iframe>" );
		</script>
		</div>
	</div>

	
	</form>
</body>
</html>
