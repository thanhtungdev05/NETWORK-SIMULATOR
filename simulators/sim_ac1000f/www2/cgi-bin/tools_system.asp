

<!--
If you execute doRefresh() and then reload webpage, doRefresh() will be disabled.
Therefore, execute doRefresh() after webpage reloads.
-->

	

	

	


<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
		
		<head>
			<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
			<meta http-equiv=Content-Script-Type content=text/javascript>
			<meta http-equiv=Content-Style-Type content=text/css>
			<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
			<link rel="stylesheet" href="/style.css" type="text/css">

			<style  type="text/css">
				*{color:  #404040;}

			</style>

			<script language="JavaScript">
				function restart0()
				{
					alert("Restart with current settings! Please wait for reboot complete!");
					document.tools_System_Restore.rebootFlag0.value=1;
					document.tools_System_Restore.submit();
				}

				function restart1()
				{
					if(confirm("WARNING:if you do this,you will lose some of your personal information,such as your pppoe account.Are you sure to continue?"))
					{
					alert("Restart with factory default settings! Please wait for reboot complete!");
					document.tools_System_Restore.rebootFlag1.value=1;
					document.tools_System_Restore.submit();
				}
				}
					
//<!--cindy add new button to restore default config file but keep user data-->						
				function restart2()
				{
					alert("Restart with factory default settings! Please wait for reboot complete!");
					document.tools_System_Restore.rebootFlag2.value=1;
					document.tools_System_Restore.submit();
				}
//<!--cindy add new button to restore default config file but keep user data-->						
				function doRefresh()
				{
	                            alert("System reboot completed!");
					var mydate = new Date();
					mydate.setTime(mydate.getTime() - 1);
					
						document.cookie = "uid=del;path=/; expires=" + mydate.toGMTString(); 
						document.cookie = "psw=del;path=/; expires=" + mydate.toGMTString(); 
					
					location.href = "../";    
				}
			</script>
		</head>

		<body>
			<FORM METHOD="POST" ACTION="/cgi-bin/tools_system.asp" name="tools_System_Restore">
				<INPUT TYPE="HIDDEN" NAME="testFlag" VALUE="0">
				<div id="pagestyle"><!--cindy add for border 11/28-->
					<div id="contenttype">    <!--gleaf-->
						<div id="block1">
							<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
								<tr height="25px">
									<td  align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Reboot" to restart system with current settings</td>
								</tr>
							</table>

							<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
								<tr height="30px">
									<td width="20px">&nbsp;</td>
									<td align=left class="tabdata">
										<INPUT TYPE="HIDDEN" NAME="rebootFlag0" value="0">
										<INPUT TYPE="HIDDEN" NAME="restoreFlag0" value="1">
							    			<INPUT TYPE="SUBMIT" NAME="RestartBtn0" class="button1" VALUE="Reboot" onClick="restart0();">	    			
									</td>								
								</tr>
							</table>
						</div>

						<div id="block1">
							<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
								<tr height="25px">
									<td  align=left class="title-main" style="white-space:nowrap;padding-left:20px;">Click "Reset" to restart system with factory default settings</td>
								</tr>
							</table>
							
							<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">	
								<tr height="30px">
									<td width="20px">&nbsp;</td>
									<td align=left class="tabdata">
										<INPUT TYPE="HIDDEN" NAME="rebootFlag1" value="0">
										<INPUT TYPE="HIDDEN" NAME="restoreFlag1" value="2">
							    			<INPUT TYPE="SUBMIT" NAME="RestartBtn1" class="button1" VALUE="Reset" onClick="restart1();">
									</td>								
								</tr>
							</table>
						</div>
<!--cindy add new button to restore default config file but keep user data-->						
						<div id="button0">
							<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
								<tr height="25px">
									<td  align=left class="title-maintest" style="padding-left:20px;">
											Click "Partial Reset" to restore system with factory default settings but keep user data
									</td>
								</tr>
							</table>
							
							<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">	
								<tr height="30px">
									<td width="20px">&nbsp;</td>
									<td align=left class="tabdata">
										<INPUT TYPE="HIDDEN" NAME="rebootFlag2" value="0">
										<INPUT TYPE="HIDDEN" NAME="restoreFlag2" value="4">
							    			<INPUT TYPE="SUBMIT" NAME="RestartBtn2" class="button1" VALUE="Partial Reset" onClick="restart2();">
									</td>								
								</tr>
							</table>
						</div>
<!--cindy add new button to restore default config file but keep user data-->						
					</div>   <!--gleaf-->
				</div>

				
					<table width="690" border="0" cellpadding="0" cellspacing="0">
						<tr height="30">
							<td width="20">&nbsp;</td>
							<td width="250">&nbsp;</td>
							<td width="420"></td>
						</tr>	
						<tr>
							<td align=center colSpan=3 style="background-color:transparent;font-family: Arial,Helvetica,sans-serif;"><font size=2>Copyright © 2019 FPT. All Rights Reserved.   </font></td>
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

