<html><head><meta http-equiv=Content-Script-Type content=text/javascript><meta http-equiv=Content-Style-Type
content=text/css><meta http-equiv=Content-Type content="text/html; charset=gb2312"><link rel="stylesheet"
href="/JS/stylemain.css" type="text/css"></head>
<script language="JavaScript">
		function delCookie(name)
		{  
			var exp = new Date();  
			exp.setTime(exp.getTime() - 10000);  
			document.cookie = name + "=del;expires=" + exp.toGMTString();   
			document.cookie = name + "=del;expires=" + exp.toGMTString() + ";path=/;";  
		}
		delCookie("uid");
		delCookie("psw");
		delCookie("SESSIONID");
		top.window.location.href="/cgi-bin/login.asp";
		document.cookie = "logout=1;path=/;";
</script>
<body onload=""><table width="580" border="0" align="center" cellpadding="0" cellspacing="0" bordercolor="#CCCCCC" bgcolor="#FFFFFF">
</table></body></html>
