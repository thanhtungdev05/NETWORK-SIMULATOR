<!DOCTYPE html
	PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" lang="utf-8" dir="ltr">

<head>
	<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE">
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<meta http-equiv=Content-Script-Type content=text/javascript>
	<meta http-equiv=Content-Style-Type content=text/css>
	<link rel="stylesheet" type="text/css" href="/style.css">

	<style type="text/css">
		body {
			width: 100%;
			height: 100%;
			padding: 0;
			margin: 0;
		}

		.current {
			background: #ffcb00;
			background-position: center;
			padding: 0;
			margin: 0;
			text-decoration: none;
			outline: 0;
			color: #000;
		}

		#MainMenu li a {
			display: block;
			width: 192px;
			height: 35px;
			line-height: 35px;
			font-size: 15px;
			font-weight: bold;
			font-family: "BeVietnamBold", Be Vietnam;
			color: #4acbd6;
			text-align: center;
			padding: 0;
			margin: 0;
			border-bottom-left-radius: 6px;
		}

		#MainMenu li a:hover {
			background: #fff;
			background-position: center;
			color: #ffcb00 !important;
		}

		#MainMenu li {
			width: 192px;
			text-align: center;
			padding: 0;
			margin: 0;
		}

		.other {
			background: #FFFFFF;
			background-position: center;
			padding: 0;
			margin: 0;
			text-decoration: none;
			outline: 0;
		}

		#container {
			padding: 0;
			background: #4acbd6;
			-moz-border-radius: 10px;
			-webkit-border-radius: 10px;
			border-radius: 10px;
			behavior: url(/PIE.htc);
			background-position: center;
			float: left;
		}

		#container ul {
			padding: 0;
			margin: 0;
			list-style-type: none;
			vertical-align: center;
		}
	</style>

	<script>
		function doLoad() {

			window.parent.main.location = "/cgi-bin/help_status.asp";
			if (window.innerHeight != undefined)
				document.getElementsByTagName("body")[0].style.height = window.innerHeight + "px";
			else
				document.getElementsByTagName("body")[0].style.height = document.documentElement.clientHeight + "px";

		}

		function change_bg(obj) {
			var a = document.getElementById("MainMenu").getElementsByTagName("a");
			for (var i = 0; i < a.length; i++) {
				a[i].className = "other";
				a[i].style.color = "#4acbd6";
			}
			obj.className = "current";
			obj.style.color = "#fff";
		}

	</script>

</head>

<body onload="doLoad();" style="margin:0;padding:0;background-color:#4acbd6;">

	<div id="container">
		<ul id="MainMenu">
			<li style="border-bottom:1px solid #E6E6E6;"><a href="/cgi-bin/help_status.asp" target="main"
					style="color:#fff;" onclick="change_bg(this);" class="current">Status</a></li>
			<li style="border-bottom:1px solid #E6E6E6;"><a href="/cgi-bin/help_interface.asp" target="main"
					onclick="change_bg(this);" class="other">Network</a></li>
			<li style="border-bottom:1px solid #E6E6E6;"><a href="/cgi-bin/help_access.asp" target="main"
					onclick="change_bg(this);" class="other">Access</a></li>
			<li style="border-bottom:1px solid #E6E6E6;"><a href="/cgi-bin/help_advanced.asp" target="main"
					onclick="change_bg(this);" class="other">Advanced</a></li>
			<li style="border-bottom:1px solid #E6E6E6;"><a href="/cgi-bin/help_maintenance.asp" target="main"
					onclick="change_bg(this);" class="other">Maintenance</a></li>

		</ul>
	</div>
</body>

</html>