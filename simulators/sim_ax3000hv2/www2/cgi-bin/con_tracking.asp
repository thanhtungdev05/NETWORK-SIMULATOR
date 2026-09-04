
<!--node:ConntrackStorage_Entry;attr:enable-->
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
	<head>
	<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
	<meta http-equiv=Content-Script-Type content=text/javascript>
	<meta http-equiv=Content-Style-Type content=text/css>
	<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
	<style  type="text/css">
		body{color:  #404040;}
	</style>
	<script language="JavaScript" src="/val.js"></script>
	<script language="JavaScript" src="/general.js"></script>
	<script language="JavaScript" type='text/javascript' src="/ip_new.js"></script>
	<script type="text/javascript" src="/spin.js" ></script>
	<link rel="stylesheet" type="text/css" href="/style.css">
	<script language="JavaScript">
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

	function start_contrack() 
	{
		showSpin();
		document.conTrack_Form.saveFlag.value = 1;
		document.conTrack_Form.contrack_enable.value = 1;
		document.conTrack_Form.submit();
		return;
	}

	function stop_contrack() 
	{
		showSpin();
		document.conTrack_Form.saveFlag.value = 1;
		document.conTrack_Form.contrack_enable.value = 0;
		document.conTrack_Form.submit();
		return;
	}

	function backup_conTrack_settings()
	{
		var file = '/conntrack_storage.pcap?t=' + new Date().getTime();
		var code = 'location.assign("' + file + '")';
		eval(code);
	}
	</script>
	</head>
<body style="background:#4acbd6;">
	<FORM METHOD="POST" ACTION="/cgi-bin/con_tracking.asp" name="conTrack_Form">
	<div id="pagestyle">
	<div id="contenttype">
		<div id="block1">
			<div id="block1" class="main_item">
				<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
					<tr height="25px" style="background-color:#e6e6e6;">
						<td width="20px">&nbsp;</td>
						<td colspan="2" align="left" class="title-main">Connection Tracking</td>
					</tr>
				</table>
				<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="table-layout: fixed;">
					<tr height="30px">
						<td align=left class="tabdata">
						<div id="tackstatus"></div>         
						<script language=JavaScript>
							var timeIdStatus = setInterval(loadDocButton, 2000);
							function loadDocButton() 
							{
								var xmlhttp;
								if (window.XMLHttpRequest) 
								{
									// code for IE7+, Firefox, Chrome, Opera, Safari
									xmlhttp=new XMLHttpRequest();
								}
								else
								{
									// code for IE6, IE5
									xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
								}

								xmlhttp.onreadystatechange = function() 
								{
									if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
									{
										document.getElementById("tackstatus").innerHTML = xmlhttp.responseText;
										/*if(xmlhttp.responseTex != undefined && xmlhttp.responseTex.indexOf("DONE") > 0)
											clearInterval(timeIdStatus);*/
									}
								};
								xmlhttp.open("GET", "/cgi-bin/contrack_status.asp", true);
								xmlhttp.setRequestHeader('If-Modified-Since', '0');
								xmlhttp.send();
							}
						</script>
						</td>
					</tr>
				</table>
			</div>

			<div id="button0" class="main_item">
				<table width="640" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="table-layout: fixed; margin:5px 0px;">
					<tr height="25px">
						<td width="20px">&nbsp;</td>
						<td colspan="2" align="left" class="title-main">Click "Start" to start connection tracking. Click "Save" to save the packets.</td>
					</tr>
				</table>

				<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
					<tr height="30px">
						<td width="20px">&nbsp;</td>
						<div id="conTrackButton"></div>         
						<script language=JavaScript>
							var timeIdButton = setInterval(loadDocSatus, 2000);
							function loadDocSatus() 
							{
								var xmlhttp;
								if (window.XMLHttpRequest) 
								{
									// code for IE7+, Firefox, Chrome, Opera, Safari
									xmlhttp=new XMLHttpRequest();
								}
								else
								{
									// code for IE6, IE5
									xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
								}

								xmlhttp.onreadystatechange = function() 
								{
									if (xmlhttp.readyState == 4 && xmlhttp.status == 200) 
									{
										document.getElementById("conTrackButton").innerHTML = xmlhttp.responseText;
										/*if(xmlhttp.responseTex != undefined && xmlhttp.responseTex.indexOf("VALUE=Start") > 0)
											clearInterval(timeIdButton);*/
									}
								};
								xmlhttp.open("GET", "/cgi-bin/contrack_button.asp", true);
								xmlhttp.setRequestHeader('If-Modified-Since', '0');
								xmlhttp.send();
							}
						</script>
						<td id="firstDiv" style="float:left;">
							<INPUT TYPE="HIDDEN" NAME="contrack_enable" VALUE="0">
							<INPUT TYPE="HIDDEN" NAME="saveFlag" VALUE="0">
						</td>
						<td >&nbsp;</td>
					</tr>
				</table>
			</div>
		</div>
	</div>

	
	</form>
	</body>
</html>
