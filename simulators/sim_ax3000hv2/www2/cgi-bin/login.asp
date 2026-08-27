<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>login</title>
		<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE">
		<meta http-equiv=content-type content="text/html; charset=gb2312">
		<script type="text/javascript" src="/sha256.js" ></script>
		<link rel="stylesheet" type="text/css" href="/style.css" tppabs="/style.css">
		<style	type="text/css">
			#div_visite
			{
				background:#f4f4f4 url(/bg.gif) repeat top left;
				border-radius: 8px 8px 8px 8px;
				-moz-border-radius: 8px 8px 8px 8px;
				-webkit-border-radius: 8px 8px 8px 8px;
				display:inline-block;
				position:relative;
				margin-left: auto;
				margin-right: auto;
				margin-top: 170px;
				padding: 15px 20px;
				width: 500px;
				height:350px;
				behavior:url(/PIE.htc);
			}

			#fpt
			{
				background:url(/login.png) no-repeat top left;
				background-size: 100px 35px;
			}

			#usr
			{
				background:url(/usr.png) no-repeat center right;
				height:60px;
			}

			#pwd
			{
				background:url(/pwd.png) no-repeat center right;
				height:60px;
			}

			.button1
			{
				display:inline-block;
				cursor:pointer;
				color:#fff;
				font:bold 15px Be Vietnam;
				margin:5px;
				padding:7px 14px;
				line-height:normal;
				overflow:visible;
				text-align:center;
				text-decoration:none;
				position:relative;
				background:#00A9A7;
				border:1px solid #00A9A7;
				outline:0;
			}

			#buttoncolor input:hover
			{
				display:inline-block;
				background:#007573;
				color:#fff;
				outline:0;
			}
		</style>
		<script language=javascript type=text/javascript>
			var lockTimes="0";
var LoginTimes="0";

			document.onkeypress = function(e)
			{
				var code;
				if (!e)
				{
					var e=window.event;
				}
				if(e.keyCode)
				{
					code = e.keyCode;
				}
				else if(e.which)
				{
					code = e.which;
				}
				if(code == 13)
				{
					if(document.getElementById('username').value != "" && document.getElementById('password').value == ""  )
					{
						document.getElementById('password').focus();
					}
					else
					{
						submitform();
						return false;
					}
				}
			}

			function delCookie(name)
			{  
				var exp = new Date();  
				exp.setTime(exp.getTime() - 10000);  
				document.cookie = name + "=del;expires=" + exp.toGMTString();   
				document.cookie = name + "=del;expires=" + exp.toGMTString() + ";path=/;";
			}

			function doLoad()
			{
				delCookie("uid");
				delCookie("psw");
				delCookie("SESSIONID");
				delCookie("logout");
				delCookie("ipchange");
				delCookie("sysauth");
				try {
					document.getElementById('username').value = '';
					document.getElementById('password').value = '';
				} catch(e) {}
				document.configform.username.focus();
			}

			/*function encodeString(val)
			{
				var len = val.length;
				var i = 0;
				var newStr = "";
				var original = val;
				var charASCIINum = 0;
				var reverseStr = "";
				for(i = 0 ; i < len ; )
				{
					reverseStr = reverseStr + original[i]
					i = i + 2;
				}
				for(i = 1 ; i < len ; )
				{
					reverseStr = reverseStr + original[i]
					i = i + 2;
				}
				for(i = 0 ; i < len ; i++)
				{
					charASCIINum = reverseStr[i].charCodeAt();
					if(0<=charASCIINum && charASCIINum<10)
					{
						newStr = newStr + "00" + charASCIINum.toString();
					}
					else if(10<=charASCIINum && charASCIINum<100)
					{
						newStr = newStr + "0" + charASCIINum.toString();
					}
					else if(100<=charASCIINum && charASCIINum<1000)
					{
						newStr = newStr + charASCIINum.toString();
					}
				}
				return newStr;
			}*/

			function submitform()
			{
				var username = document.getElementById('username');
				var password = document.getElementById('password');

				if (username.value == "")
				{
					alert("Account can't be blank!");
					return false;
				}
				if (password.value == "")
				{
					alert("Password can't be blank!");
					return false;
				}

				var cookie = "uid=" + sha256_digest(username.value) + ";path=/;";
				document.cookie = cookie;
				var cookie = "psw=" + sha256_digest(password.value) + ";path=/;";
				document.cookie = cookie;
				location.replace("/cgi-bin/reqLogin");
				return true;
			}

			function gotoLOID()
			{
				location.replace("/cgi-bin/access_auth.asp?islogin=0");
			}
		</script>
	</head>

	
		<body onload="doLoad()" height="100%" align="center">
			<div width="100%" height="100%" align="center">
				<div id=div_visite >
					<form id="configform" name="configform" action="/cgi-bin/login.asp" method="get">
						<table	cellspacing="0" cellpadding="0" align="center" width="500">
							<tr>
								<td style="text-align:center;">
									<img src="/login.png" width="120" height="65">
								</td>
							</tr>
						</table>
						<table	cellspacing="0" cellpadding="0" width="500" style="margin-top:5px;">
							<tr height="20px">
								<td width="190px"></td>
								<td width="55px" style="color:grey; font-family: Be Vietnam;font-size: 15px;font-weight:bold;text-align:left;">hotline</td>
								<td style="color:red; font-family: Be Vietnam;font-size: 15px;font-weight:bold;text-align:left;">1900 6600</td>
							</tr>
						  </table>

						<table	cellspacing="0" cellpadding="0" align="center" width="500" height="200">
							<tr>
								<td>
									<table	cellspacing="0" cellpadding="0" align="center" border="0" width="500" height="160"	>
										<tr>
											 <td width=160px height=40px>
											 <div id="usr"></div>
											 </td>				  
											 <td align=left>&nbsp;&nbsp;<input id="username" style="height:30px;width: 160px; font-family: arial;line-height:30px;" name="username" size="20" > </td>
										</tr>
									  
										<tr>
											 <td height=40px>
											 <div  id="pwd"></div>
											 </td>
											 <td align=left>&nbsp;&nbsp;<input id="password" style="height:30px;width: 160px; font-family: arial ;line-height:30px;" type="password" name="password" size="20"></td>
										</tr>
									  
										<tr>
											 <td height=25px></td>
											 <td style="color:red; font-family: Be Vietnam;font-size: 15px;font-weight:bold;text-align:left;">
											 <script language=javascript> 
											if(LoginTimes == "N/A")
												LoginTimes = 0;
											if(lockTimes == "N/A")
												lockTimes = 0;
											var LoginFailedCnt = parseInt(lockTimes)*5 + parseInt(LoginTimes);
											if (LoginFailedCnt > 0 && LoginTimes < 5 && LoginTimes > 0)
											{
												var str = "Input invalid username/password" + ' ' + parseInt(LoginFailedCnt) + ' ' +"times.";
												document.write(str);
											}
											</script>
											 </td>
										</tr>
									</table>
								</td>
							</tr>
							<tr>
								<td>
									<table	cellspacing="0" cellpadding="0"  border="0" width="500" align="center" >			
										<tr id="buttoncolor"  height=40px>
											 <td align=center>
											 <input class="button1" onclick="submitform()" type="button" value="Login" name="btnsubmit">
											 </td>
										</tr>  
									</table>
								</td>
							</tr>
						</table>
					</form>
				</div>
			</div>
		</body>
	

</html>
