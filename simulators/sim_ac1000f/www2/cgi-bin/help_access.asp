<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
	<head>
		<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
		<meta http-equiv=Content-Script-Type content=text/javascript>
		<meta http-equiv=Content-Style-Type content=text/css>
		<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
		<link rel="stylesheet" type="text/css" href="/style.css">
		
	</head>

	<body text=#000000 bgcolor=#ffffff>
		<div id="pagestyle"><!--cindy add for border 11/28-->
		<div id="contenttype">
			<tbody>
				<div id="block1">
					<table cellspacing=0 cellpadding=0 border=0 width="640" style="margin:5px 0px;"  >
			  			<tr height="25px" class="bgcolor">
							<td style="padding-left:20px;">
								<span class="help-header">
			    						Access
								</span>
							</td>
			  			</tr>
					</table>
				</div>
<!--cindy delete 09/06
				<div id="block1">
					<table cellspacing=0 cellpadding=0 border=0 width="640"  style="padding-left:20px;padding-right:20px;"   >
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
							      	<span class="help-main">
							      		ACL
							      	</span><br>
							      	<span class="help-text">
									 
										You may use telnet or Web to remotely manage the GPON Router. User just needs to enable Telnet or Web and give it an IP address that want to access the GPON Router. The default IP 0.0.0.0 allows any client to use this service to remotely manage the GPON Router.	   
									
									
						  		</span>
					    		</td>
					  	</tr>
					</table>
				</div>
				<div id="block1">
					<table cellspacing=0 cellpadding=0 border=0 width="640"  style="padding-left:20px;padding-right:20px;"  >
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
							      	<span class="help-main">
							      		IP Filter
							      	</span><br>
							      	<span class="help-text">
							        	Select Telnet, FTP, TFTP, Web, SNMP, Ping to block incoming WAN requests for the corresponding service(s).
							      	</span> 
					    		</td>
					  	</tr>
					</table>
				</div>
-->
				<div id="block1">
					<table cellspacing=0 cellpadding=0 border=0 width="640"  style="padding-left:20px;padding-right:20px;"  >                                                     
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
					      			<span class="help-main">
					      				SNMP
					      			</span><br>
					      			<span class="help-text">
					      				Simple Network Management Protocol is used for exchanging information between network devices.<br><b><i>Get Community</i></b> Select to set the password for the incoming Get requests from the management station.<br><b><i>Set Community</i></b> Select to set the password for incoming Set requests from the management station.
					      			</span> 
					    		</td>
					  	</tr>
					</table>
				</div>
			                                                                  
				<div id="block1">
					<table cellspacing=0 cellpadding=0 border=0 width="640" style="padding-left:20px;padding-right:20px;"   >                                                               
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
							      	<span class="help-main">
							      		UPnP
								</span><br>
							      	<span class="help-text">
							      		UPnP (Universal Plug and Play) is a distributed, open networking standard that uses TCP/IP for simple peer-to-peer network connectivity between devices. A UPnP device can dynamically join a network, obtain an IP address, convey its capabilities and learn about other devices on the network.In turn, a device can leave a network smoothly and automatically when it is no longer in use.
							      		<!-- Foxconn alan add -->
							      		UPnP broadcasts are only allowed on the LAN.<br><b><i>Auto-Configure</i></b> 
							      		UPnP network devices can automatically configure network addressing, announce their presence in the network to other UPnP devices and enable exchange of simple product and service descriptions.   
							      	</span> 
					    		</td>
					  	</tr>
					</table>
				</div>
			                                                                            
				<div id="block1">
					<table cellspacing=0 cellpadding=0 border=0 width="640"  style="padding-left:20px;padding-right:20px;"  >                                                                         
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
							      	<span class="help-main">
							      		DDNS
							      	</span><br>
							      	<span class="help-text">
							      		The Dynamic Domain Name System lets you use a static host name with a dynamic IP address.User should type the host name, user name and password assigned to your GPON Router by your Dynamic DNS provider. User also can decide to turn on DYNDNS Wildcard or not.
							      	</span> 
					    		</td>
					  	</tr>
					</table>  
				</div>
<!--cindy add Filter information 09/06-->
				<div id="block1">
					<table cellspacing=0 cellpadding=0 border=0 width="640"  style="padding-left:20px;padding-right:20px;"  >
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
							      	<span class="help-main">
							      		IP Filter
							      	</span><br>
							      	<span class="help-text">
							        	Select Telnet, FTP, TFTP, Web, SNMP, Ping to block incoming WAN requests for the corresponding service(s).
							      	</span> 
					    		</td>
					  	</tr>
					</table>
				</div>
<!--cindy add Filter information 09/06-->
			</tbody>
			</div>
		</div><!--cindy add for border 11/28-->		
		
			
				<table width="690" border="0" cellpadding="0" cellspacing="0">
					<tr height="30">
						<td width="20">&nbsp;</td>
						<td width="250">&nbsp;</td>
						<td width="420"></td>
				        </tr>	
			           	<tr>
						<td align=center colSpan=3 style="color:#404040;background-color:transparent;font-family: Arial,Helvetica,sans-serif;"><font size=2>Copyright © 2019 FPT. All Rights Reserved.   </font></td>
			        	</tr>
					<tr height="10">
						<td width="20">&nbsp;</td>
						<td width="250">&nbsp;</td>
						<td width="420"></td>
			        	</tr>
	                	</table>
	        	
	</body>
</html>
