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
			<div id="block1">
				<table cellspacing=0 cellpadding=0 border=0 width="640" style="margin:5px 0px;"  >
					<tr height="25px" class="bgcolor">
						<td style="padding-left:20px;">
							<span class="help-header">
					    			Interface Setup
							</span>
						</td>
					</tr>
				</table>
			</div>
                                            
<!--cindy add quick start information 09/06-->
			<div id="block1">
				<table cellspacing=0 cellpadding=0 border=0 width="640" style="padding-left:20px;padding-right:20px;"  >  
				  	<tr>
				    		<td>
						      	<span class="help-main">
					    			Quick Start
							</span><br>	
						</td>
					</tr>
					<tr>
						<td style="text-align:justify;text-justify:auto;">
						      	<span class="help-text">
							    		The Quick Start Wizard is a useful and easy utility to help setup the device to quickly connect to your ISP (Internet Service Provider) with only a few steps required. It will guide you step by step to configure the password, time zone, and WAN settings of your device. The Quick Start Wizard is a helpful guide for first time users to the device.
						      	</span>
					      </td>
					</tr>
				</table>
			</div>
<!--cindy add quick start information 09/06-->
			<div id="block1">
				<table cellspacing=0 cellpadding=0 border=0 width="640" style="padding-left:20px;padding-right:20px;"  >  
				  	<tr>
				    		<td>
						      	<span class="help-main">
						      		Interface Setup
							</span><br>	
						</td>
				  	</tr>
				  	
				  	<tr>
						<td style="text-align:justify;text-justify:auto;">
						      	<span class="help-sub">
						      		Internet :: WAN
						      	</span><br>
							<span class="help-text">
							  	WAN setings are used to connet to your ISP.
							  	<!-- Foxconn alan remove
							  	N/A  
							   	-->
							</span>
				    		</td>
				  	</tr>	
				  	
					<tr>
					    	<td style="text-align:justify;text-justify:auto;">
						      	<span class="help-sub">
						      		Internet :: Encapsulation
						      	</span>    
						      	<span class="help-text">
						      	<!--cindy delete 09/07
								<b><i>Dynamic IP </i></b> Select this option if your ISP provides you an IP address automatically. This option is typically used for Fiber services. Please enter the Dynamic IP information accordingly.<br><b><i>Static IP </i></b> Select this option to set static IP information. You will need to enter in the Connection type, IP address, subnet mask, and gateway address,  provided to you by your ISP. 
								Each IP address entered in the fields must be in the appropriate IP form, which is four IP octets separated by a dot (x.x.x.x).The Router will not accept the IP address if it is not in this format. 
							-->		
								<br><b><i>PPPoE</i></b> Select this option if your ISP requires you to use a PPPoE connection. This option is typically used for PON services.
								Please enter the information accordingly.<br><b><i>Bridge Mode </i></b>The modem can be configured to act as a bridging device between your LAN and your ISP. 
								Bridges are devices that enable two or more networks to communicate as if they are two segments of the same physical LAN. Please set the Connection type.
							</span>
						</td>
					</tr>
			<!--cindy delete 09/07
					<tr>
					      	<td style="text-align:justify;text-justify:auto;">
					        	<span class="help-sub">
					        		Internet :: PPPoE 
					        	</span><br>
						    	<span class="help-text">
						        	Select this option if your ISP requires you to use a PPPoE connection. This option is typically used for PON services.Select Dynamic PPPoE to obtain an IP address automatically for your PPPoE connection. Select Static PPPoE to use a static IP address for your PPPoE connection. Please enter the information accordingly. <br><b><i>Username </i></b> Enter your username for your PPPoE connection.<br><b><i>Password </i></b> Enter your passward for your PPPoE connection.	    
						        	<br><b><i>Connection Setting</i></b> For PPPoE connection, you can select <b>Always on</b> or <b>Connect on-demand</b>. Connect on demand is dependent onthe traffic. If there is no traffic (or <b>Idle</b>) for a pre-specified period of time), the connection will tear downautomatically. And once there is traffic send or receive, the connection will be automatically on.<br><b><i>Static/Dynamic IP Address</i></b> 
						        	For PPPoE connection, you need to specify the public IP address for this GPON Router. The IP address can be either dynamically (via DHCP) or given IP address provide by your ISP. For Static IP, you need to specify the IP address, Subnet Mask and Gateway IP address.		
						    	</span>
						</td>
					</tr>
			-->		
					<tr>
					    	<td style="text-align:justify;text-justify:auto;">
					      		<span class="help-sub">
					        		Internet :: NAT      
					      		</span><br>
					      		<span class="help-text">
					        		<b><i>NAT</i></b> Select this option to Enable/Disable the NAT (Network Address Translation) function for this WAN. The NAT function can be activated or deactivated per WAN basis.       
							</span>
						</td>
					</tr>
			<!--cindy delete 09/07
					<tr>
					    	<td style="text-align:justify;text-justify:auto;">
					      		<span class="help-sub">
					      			Internet :: Default Route 
					      		</span><br>
					      		<span class="help-text">
								<b><i>Default Route </i></b>&nbsp;
								<span class="MsoNormal"><span lang=EN-US>if enable this function, the current WAN will be the default gateway to internet from this device.</span></span>
							</span>
						</td>
					</tr>

					<tr>
					    	<td style="text-align:justify;text-justify:auto;">
						      	<span class="help-sub">
						      		Internet :: Dynamic Route 
						      	</span><br>
						      	<span class="help-text">
						      		<b><i>RIP</i></b> (Routing Information protocol) Select this option to specify the RIP version, including <b>RIP-1</b>, <b>RIP-2M</b> and <b>RIP-2B</b>. RIP-2M and RIP-2B are both sent in RIP-2 format; the difference is that RIP-2M using Multicast and RIP-2 using Broadcast format. <br><b><i>RIP Direction</i></b> Select this option to specify the RIP direction. <b>None</b> is for disabling the RIP function. <b>Both</b> means the
						      		GPON Router will periodically send routing information and accept routing information then incorporateinto routing table. <b>IN only </b> means the GPON router will only accept but will not send RIP packet.<b>OUT only</b> means the GPON router will only send but will not accept RIP packet.		
							</span>
						</td>
					</tr>
			-->		
					<tr>
					    	<td style="text-align:justify;text-justify:auto;">
						      	<span class="help-sub">
						      		Internet :: Multicast
						      	</span><br>
						      	<span class="help-text">
								<b><i>IGMP</i></b> (Internet Group Multicast Protocol) is a session-layer protocol used to establish membership in a multicast group. The GPON router supports both IGMP version 1 (<b>IGMP-v1</b>) and <b>IGMP-v2</b>. Select <b>None</b> to disable it.
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
						      		LAN settings 
						      	</span><br>
						      	<span class="help-text">
						      		These are the IP settings of the LAN interface for the device. These settings may be referred to as Private settings. You may change the LAN IP address if needed. The LAN IP address is private to your internal network and cannot be seen on the Internet.
							</span>
				    		</td>
				  	</tr>
			<!--cindy delete 09/07
				  	<tr>
				    		<td style="text-align:justify;text-justify:auto;">
					      		<span class="help-sub">
					      			LAN :: Dynamic Route 
					      		</span><br>
					      		<span class="help-text">
						    		Please refer to <b>Internet::Dynamic Route</b>. The only difference is the interface.
						  	</span>
				    		</td>
				  	</tr>
			-->  	
				    	<tr>
				    		<td style="text-align:justify;text-justify:auto;">
					      		<span class="help-sub">
					      			LAN :: Multicast
					      		</span><br>
					      		<span class="help-text">
						    		Please refer to <b>Internet::Multicast</b>. The only difference is the interface.
					  		</span>
				    		</td>
				  	</tr>
				  	
				    	<tr>
				      		<td style="text-align:justify;text-justify:auto;"> 
					        	<span class="help-sub">
					        		LAN :: DHCP Server
					        	</span><br>
					        	<span class="help-text"> 
						        	DHCP stands for Dynamic Host Control Protocol. The DHCP Server gives out IP addresses when a device is booting up and request an IP address to be logged on to the network. That device must be set as a DHCP client to obtain the IP address automatically. By default, the DHCP Server is enabled.
						        	<br><b><i>Starting IP Address </i></b> The starting IP address for the DHCP server's IP assignment.<br><b><i>Ending IP Address</i></b> The ending IP address for the DHCP server's IP assignment.<br><b><i>Lease Time</i></b> The length of time for the IP lease. 
					        	</span>
				      		</td>
				    	</tr>
				    
				    	<tr>
				      		<td style="text-align:justify;text-justify:auto;"> 
						    	<span class="help-sub">
						    		LAN :: DHCP Relay  
						    	</span><br>
					        	<span class="help-text"> 
					        		A DHCP relay is a computer that forwards DHCP data between computers that request IP addresses and the DHCP server that assigns the addresses. Each of the device's interfaces can be configured as a DHCP relay. If it is enable, the DHCP requests from local PCs will forward to the DHCP server runs on WAN side.      
								To have this function working properly, please run on router mode only, disable the DHCP server on the LAN port, and make sure the routing table has the correct routing entry.<br><b><i>DHCP Server IP for relay agent </i></b> The DHCP server IP Address runs on WAN side. 
							</span> 
					  	</td>
				    	</tr>

				  	<tr>
				    		<td style="text-align:justify;text-justify:auto;">
					      		<span class="help-sub">
					      			LAN :: DNS Server
					      		</span><br>
						  	<span class="help-text">
						  		The DNS Configuration allows the user to set the configuration of DNS.<br><b><i>DNS Relay selection</i></b> If user want to disable this feature, he just need to set both Primary and secondary DNS IP to 0.0.0.0.Using DNS relay, users can setup DNS server IP to 192.168.1.1 on their Computer. If not, device will perform as no DNS relay.
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
							      		Wireless LAN Settings
							      	</span><br>
							      	<span class="help-text">  
							       	<b><i>SSID</i></b> The SSID is a unique name to identify the GPON Router in the wireless LAN. Wireless clients associating to the GPON Router must have the same SSID.<br><b><i>Broadcast SSID</i></b> Select <b>No</b> to hide the SSID such that a station can not obtain the SSID through passive scanning. Select <b>Yes</b> to make the SSID visible so a station can obtain the SSID through passive scanning.<br><b><i>Channel ID</i></b> The range of radio frequencies used by IEEE 802.11b/g wireless devices is called a channel.<br>     
								</span>
					    		</td>
					  	</tr>
					  	
					  	<!-- saffi removed + the WEP help info -->
					 	<!-- <tr>
					    	<td> 
					      	<span class="help-sub">
					      
					      	Wireless LAN :: WEP
					      
					      	</span><br>
					      	<span class="help-text">
					       WEP (Wired Equivalent Privacy) encrypts data frames before transmitting over the wireless network. Select <b>Disable</b> to allow all wireless computers to communicate with the access points without any data encryption.Select <b>64-bit WEP</b> or <b>128-bit WEP</b> to use data encryption.<br><b><i>Key#1~Key#4</i></b> 
					       
						-->
					       <!-- Foxconn alan add -->
						<!--
					       The WEP keys are used to encrypt data. Both the GPON Router and the wireless clients must use the same WEP key for data transmission.If you chose 64-bit WEP, then enter any 10 hexadecimal digits ("0-9", "A-F") 
						   preceded by 0x for each key (1-4). If you chose 128-bit WEP, then enter 26 hexadecimal digits ("0-9", "AF") preceded by 0x for each key (1-4).The values must be set up exactly the same on the Access Points as they are on the wireless client stations. The same value must be assigned to Key 1 on both the access point (your GPON Router) and the client adapters, the same value must be assigned to Key 2 on both the access point and the client stations and so on, for all four WEP keys.       
							
						  </span>
					    	</td>
					  	</tr> -->  
								<!-- saffi removed - the WEP help info 
					  	<tr>
					    	<td>&nbsp;</td>
					  	</tr>
						-->
						
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;"> 
							      	<span class="help-sub">
							      		Wireless LAN :: WPA-PSK 
							      	</span><br>
							      	<span class="help-text">
							       	Wi-Fi Protected Access, pre-shared key. Encrypts data frames before transmitting over the wireless network.<br><b><i>Pre-shared Key</i></b> The Pre-shared Key are used to encrypt data. Both the GPON Router and the wireless clients must use the same WPA-PSK key for data transmission.        
								</span>
					    		</td>
					  	</tr>   
					  
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;"> 
							      	<span class="help-sub">
							      		Wireless LAN :: Advanced setting
							      	</span><br>
							      	<span class="help-text">  
							        	<b><i>Beacon Interval</i></b> The Beacon Interval value indicates the frequency interval of the beacon. Enter a value between 20 and 1000. A beacon is a packet broadcast by the Router to synchronize the wireless network.<br>     
							        	<!-- Foxconn alan add -->
							  <!--cindy delete      	
							        	<b><i>RTS Threshold</i></b> The RTS (Request To Send) threshold (number of bytes) for enabling RTS/CTS handshake. Data with its frame size larger than this value will perform the RTS/CTS handshake. Setting this attribute to be larger than the maximum MSDU (MAC service data unit) size turns off the RTS/CTS     
									handshake. Setting this attribute to zero turns on the RTS/CTS handshake. Enter a value between 0 and 2432.<br><b><i>Fragment Threshold</i></b> The threshold (number of bytes) for the fragmentation boundary for directed messages.It is the maximum data fragment size that can be sent. Enter a value between 256 and 2432.<br> 
							   -->	
									<!-- Foxconn alan add -->
									<b><i>DTIM</i></b> This value, between 1 and 255, indicates the interval of the Delivery Traffic Indication Message (DTIM).<br> 
								</span>
					    		</td>
					  	</tr>

					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;"> 
							      	<span class="help-sub">
							      		Wireless LAN :: MAC Filter
							      	</span><br>
							      	<span class="help-text">   
							       	You can allow or deny a list of MAC addresses associated with the wireless stations access to the GPON Router.<br><b><i>Status</i></b> Use the drop down list box to enable or disable MAC address filtering.<br><b><i>Action</i></b> Select <b>Deny Association</b> to block access to the router,     
							       	<!-- Foxconn alan add -->
							       	MAC addresses not listed will be allowed to access the router. Select <b>Allow Association</b> to permit access to the router, MAC addresses not listed will be denied access to the router. <b>    
								</span>
					    		</td>
					  	</tr>  
					  
					  	<!--<tr>
					    		<td>&nbsp;</td>
					  	</tr>-->
					</table>
				</div>
			
<!--Cindy add NAT and QOS information 09/06-->
				<div id="block1">
					<table cellspacing=0 cellpadding=0 border=0 width="640" style="padding-left:20px;padding-right:20px;"   >                                                                                         
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
							      	<span class="help-main">
							      		NAT
							      	</span><br>
							      	<span class="help-text">
							      		Select this option to setup the NAT (Network Address Translation) function for your GPON Router.<br><b><i>WAN</i></b> Enter WAN Index that you plan to setup for the NAT function.<br><b><i>NAT Status</i></b> This field shows the current status of the NAT function for the current WAN.<br><b><i>Number of IPs</i></b> This field is to specify how many IPs are provided by your ISP for current WAN.It can be single IP or multiple IPs.
							      		<br>Note: for WANs with single IP, they share the same DMZ and Virtual servers; for WANs
							         	with multiple IPs, each WAN can set DMZ and Virtual servers. Furthermore, for WANswith multiple IPs, they can define the Address Mapping rules; for WANs with single IP, since they have only one IP, there is no need to individually define the Address Mapping rule.
							      	</span> 
					    		</td>
					  	</tr>

					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
						      		<span class="help-sub">
						      			NAT :: DMZ
						      		</span><br>
						      		<span class="help-text">
						      			A DMZ (demilitarized zone) is a host between a private local network and the outside public network. It prevents outside users from getting direct access to a server that has company data.Users of the public network outside the company can access only the DMZ host.<br><b><i>DMZ Host IP Address</i></b> Enter the specified IP Address for DMZ host on the LAN side.		
						      		</span>
					    		</td>
					  	</tr>

					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
						      		<span class="help-sub">
						      			NAT :: Virtual Server
						      		</span><br>
							  	<span class="help-text">
							  		The Virtual Server is the server or server(s) behind NAT (on the LAN), for example, Web server or FTP server, that you can make visible to the outside world even though NAT makes your whole inside network appear as a single machine to the outside world.<br><b><i>Rule Index</i></b> The Virtual server rule index for this WAN. You can specify up to 10 rules. All the WANs with single IP will use the same Virtual Server rules.<br>
						       		<b><i>Start & End port number </i></b> Enter the specific Start and End Port number you want to forward. If it is one port only, you can enter the End port number the same as Start port number. For example, you want to set the FTP Virtual server, you can set the start and end port number to 21.<br><b><i>Local IP Address</i></b> Enter the IP Address for the Virtual Server in LAN side. 
						        	</span>
					     		</td>
					  	</tr>
	
					  	<tr>
					    		<td bgcolor="#FFFFFF" style="text-align:justify;text-justify:auto;">
					      			<span class="help-sub">
					      				NAT :: IP Address Mapping
					      			</span><br>
					      			<span class="help-text">
					        			The IP Address Mapping is for those WANs that with multi-IPs. The IP Address Mapping rule is per-WAN based. (only for Multiple IPs' WANs). <br><b><i>Rule Index</i></b> The Virtual server rule index for this WAN. You can specify up to 10 rules. All the WANs with single IP will use the same Virtual Server rules.<br><b><i>Rule Type </i></b> There are four types of one-to-one, 
					        			Many-to-One, Many-to-Many Overload and Many-to-Many No-overload.<br><b><i>Local Start & End IP </i></b> 
									Enter the local IP Address you plan to mapped to. Local Start IP is the starting local IP address andLocal End IP is the ending local IP address. If the rule is for all local IPs, then the Start IP is 0.0.0.0 and the End IP is 255.255.255.255.<b><i>Public Start & End IP </i></b> Enter the public IP Address you want to do NAT. 
									Public Start Ip is the starting public IP address and Public End IP is the ending public IP address. If you have a dynamic IP, enter 0.0.0.0 as the Public Start IP.
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
									QoS	
								</span>
								<br>
								<span class="help-text">
									QoS (Quality of Service)<br>This option will provide better service of selected network traffic over various technologies.	
								</span>
							</td>
						</tr>
			  <!--cindy delete 09/07     	
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
					    			<span class="help-sub">					    
							    		QoS::802.1p					    
							    	</span><br>
								<span class="help-text">
									Select this option to Activate/Deactivated the 802.1p IEEE 802.1p establishes eight levels of priority(0 ~ 7). Although network managers must determine actual mappings, IEEE has made broad recommendations. Seven is the highest priority which is usually assigned to network-critical traffic such as Routing Information Protocol (RIP) and Open Shortest Path First (OSPF) table updates. 
									Five and six are often for delay-sensitive applications such as interactive video and voice. Data classes four through one range 
									from controlled-load applications such as streaming multimedia and business-critical traffic - carrying SAP data, for instance - down to "loss eligible" traffic. Zero is used as a best-effort default priority, invoked automatically when no other value has been set.						
								</span>
							</td>
					  	</tr>
			-->
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
								<span class="help-sub">
									QoS::IP QoS
								</span><br>
								<span class="help-text">
									Select this option to Enable/Disable the IP QoS on different types(IP ToS and DiffServ). IP QoS function is intended to deliver guaranteed as well as differentiated Internet services by giving network resource and usage control to the Network operator.
								</span>
							</td>
						</tr>

					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
								<span class="help-sub">
									QoS::Applications QoS
								</span><br>
								<span class="help-text">
									Select this option to Enable/Disable the different application packets prioritized on the queues.
								</span>
							</td>
						</tr>
			  <!--cindy delete 09/07     	
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
								<span class="help-sub">
									QoS::VLAN Group QOS
								</span>
								<br>
								<span class="help-text">
									Select this option to Enable/Disable the 4094 VID on the 4 different queues. VID(VLAN ID) is the identification of the VLAN, which is basically used by the standard 802.1Q. It has 12 bits and allow the identification of 4096 (2^12) VLANs. Of the 4096 possible VIDs, a VID of 0 is used to identify priority frames and value 4095 (FFF) is reserved, so the maximum possible VLAN configurations are 4,094.
								</span>
							</td>
					  	</tr>
			-->		  	
					</table>
				</div>
<!--Cindy add NAT and QOS information 09/06-->
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
