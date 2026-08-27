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
			    						Advanced
								</span>
							</td>
			  			</tr>
					</table>
				</div>
                                                                                 
				<div id="block1">
					<table cellspacing=0 cellpadding=0 border=0 width="640" style="padding-left:20px;padding-right:20px;"  >
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
					      			<span class="help-main">
							      		Firewall
							      	</span><br>
							      	<span class="help-text">
						    			Select this option can automatically detect and block Denial of Service (DoS) attacks, such as Ping of Death, SYN Flood, Port Scan and Land Attack. 
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
							      		Routing
							      	</span><br>
							      	<span class="help-text">					      
						    			Select this Option will list the routing table information. You can also Add/Edit/Drop the static route. 						  
						  		</span>
					    		</td>
					  	</tr>

					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
							      	<span class="help-sub">
							      		Routing :: Static Route
							      	</span><br>      
							      	<span class="help-text">
							      		Select this option to set static Routing information. <br><b><i>Destination IP Address</i></b> This parameter specifies the IP network address of the final destination.<br><b><i>IP Subnet Mask</i></b> Enter the subnet mask for this destination.<br><b><i>Gateway IP Address</i></b> Enter the IP address of the gateway. The gateway is an immediate neighbor of your GPON Router that will forward the packet to the destination. 
							      		<!-- Foxconn alan add -->
							      		On the LAN, the gatewaymust be a router on the same segment as your Router; over Internet (WAN), the gateway
							      		must be the IP address of one of  the remote nodes.<br><b><i>Metric</i></b> Metric represents the "cost" of transmission for routing purposes. IP Routing uses hop count as the measurement of cost, with a minimum of 1 for directly connected networks.Enter a number that approximates the cost for this link. The number need not to be precise,but it must between 1 and 15. In practice, 2 or 3 is usually a good number.<br>  
							      		<!--cindy delete 09/07
								  	<b><i>Announced in RIP</i></b> This parameter determines if the GPON Router will include the route to this remote nodein its RIP broadcasts. If set to Yes, the route to this remote node will be propagated to other hosts through RIP broadcasts. If No, this route is kept private and is not included in RIP broadcasts.<br>
								  	-->
								</span>	
							</td>
					  	</tr>
					</table>
				</div>
<!--cindy delete 09/06                      
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
					</table>
				</div>
					                        
				<div id="block1">
					<table cellspacing=0 cellpadding=0 border=0 width="640" style="padding-left:20px;padding-right:20px;"   >
					  	<tr>
					    		<td style="text-align:justify;text-justify:auto;">
								<span class="help-main">
									VLAN
								</span><br>
								<span class="help-text">
									Virtual LAN (VLAN) is a group of devices on one or more LANs that are configured so that they can communicate as if they were attached to the same wire, when in fact they are located on a number of different LAN segments. Because VLANs are based on logical instead of physical connections, it is very flexible for user/host management, bandwidth allocation and resource optimization.						
								</span>
								
								<p style="margin-left: 18.0pt">
									<span class="help-text">
										1.Port-Based VLAN: each physical switch port is configured with an access list specifying membership in a set of VLANs.
									</span>
								</p>
								
								
								
								<span class="help-text">
									The key for the IEEE 802.1Q to perform the above functions is in its tags. 802.1Q-compliant switch ports can be configured to transmit tagged or untagged frames. A tag field containing VLAN (and/or 802.1p priority) information can be inserted into an Ethernet frame. If a port has an 802.1Q-compliant device attached (such as another switch), 
									these tagged frames can carry VLAN membership information between switches, thus letting a VLAN span multiple switches. However, it is important to ensure ports with 
									non-802.1Q-compliant devices attached are configured to transmit untagged frames. Many NICs for PCs and printers are not 802.1Q-compliant. If they receive a tagged frame, they will not understand the VLAN tag and will drop the frame. Also, the maximum legal Ethernet frame size for tagged frames was increased in 802.1Q (and its companion, 802.3ac) from 1,518 to 1,522 bytes. 
									This could cause network interface cards and older switches to drop tagged frames as "oversized."
								</span>
							</td>
						</tr>
						
						<tr>
							<td style="text-align:justify;text-justify:auto;">
								<span class="help-sub">
									PVID( Port VLAN ID)
								</span><br>
								<span class="help-text">
									Each physical port has a default VID called PVID (Port VID). PVID is assigned to untagged frames or priority tagged frames (frames with null (0) VID) received on this port.
								</span>
							</td>
					  	</tr>
					</table>
				</div>
-->				
				

<!--Cindy add ALG Switch 09/06-->
						<div id="block1">
							<table cellspacing=0 cellpadding=0 border=0 width="640"   style="padding-left:20px;padding-right:20px;" >
							  	<tr>
							    		<td style="text-align:justify;text-justify:auto;">
									      	<span class="help-main">
									      		ALG  
									      	</span><br>
									      	<span class="help-text">
									      		Enable or disable applications layer gateways.
									      	</span>
							    		</td>
							  	</tr>  
							</table>
						</div>
<!--Cindy add ALG Switch 09/06-->
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
