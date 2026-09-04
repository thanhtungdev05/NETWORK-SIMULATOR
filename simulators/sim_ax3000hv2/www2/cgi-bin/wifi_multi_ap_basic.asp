

<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML><HEAD><TITLE>EasyMesh</TITLE>
<META http-equiv=Content-Language content=zh-cn>
<META http-equiv=Content-Type content="text/html; charset=gb2312">
<LINK href="/stylemain_e8c.css" type=text/css rel=stylesheet>
<SCRIPT language=javascript src="/menu_e8c.js"></SCRIPT>
<SCRIPT language=javascript src="/util_e8c.js"></SCRIPT>
<SCRIPT language=javascript src="/json2_e8c.js"></SCRIPT>
<SCRIPT language=javascript src="/jquery_e8c.js"></SCRIPT>

<META content="MSHTML 6.00.6000.16809" name=GENERATOR></HEAD>
<BODY style="TEXT-ALIGN: center" vLink=#000000 aLink=#000000 link=#000000 leftMargin=0 topMargin=0 
onload="DisplayLocation(getElement('Selected_Menu').value);FinishLoad();if(getElById('ConfigForm') != null)LoadFrame()" 
onunload=DoUnload() marginheight="0" marginwidth="0">
<TABLE height="100%" cellSpacing=0 cellPadding=0 width=808 align=center border=0>
	<TBODY>
	<TR>
		<TD height=1>
			
				
				<TABLE height=90 cellSpacing=0 cellPadding=0 width=808 background=/img/framelogo.jpg border=0>
				 
			
				<TBODY>
       			<TR>
					<TD>&nbsp;</TD>
					<TD vAlign=bottom align=right width=358>
						<TABLE id=table8 cellSpacing=0 cellPadding=0 border=0>
							<TBODY>
							<TR>
								<TD vAlign=bottom align=right><SPAN class=curUserName>&nbsp; </SPAN></TD>
								<TD class=welcom vAlign=bottom align=middle width=120>Welcome! </TD>
								<TD vAlign=bottom width=50>
									<A onclick=DoLogout() href="/cgi-bin/logout.cgi" target=_top><SPAN class=logout>Log out </SPAN></A>
								</TD>
							</TR>
							</TBODY>
						</TABLE>
					</TD>
				</TR>
				</TBODY>
			</TABLE>
			<TABLE id=table2 height=100 cellSpacing=0 cellPadding=0 width=808 border=0>
				<TBODY>
				<TR>
					<TD class=LocationDisplay id=LocationDisplay align=middle width=163 bgColor=#ef8218 rowSpan=3></TD>
					<TD width=434 bgColor=#427594 height=33>
						<P align=right>
							<FONT face=Times New Roman color=#ffffff>
								<B><FONT face=Times New Roman color=#ffffff size=6>
									<INPUT id=Selected_Menu type=hidden value="APP->EasyMesh" name=Selected_Menu>
								</FONT></B>
								<SPAN class=GatewayName>Gateway Name:
									<SCRIPT language=javascript>
										document.write(top.gateWayName);
									</SCRIPT>
								</SPAN>
							</FONT>
						</P>
					</TD>
					<TD width=211 bgColor=#ef8218 height=33>
						<P class=GatewayType align=center>Gateway Type:
							<SCRIPT language=javascript>
								document.write(top.ModelName);
							</SCRIPT>
						</P>
					</TD>
				</TR>
				<TR>
					<TD id=MenuArea_L1 vAlign=bottom bgColor=#ef8218 colSpan=2 height=43>&nbsp;</TD>
				</TR>
				<TR>
					<TD id=MenuArea_L2 bgColor=#427594 colSpan=2 height=24></TD>
				</TR>
				</TBODY>
			</TABLE>
			<SCRIPT language=javascript>
				MakeMenu(getElById ('Selected_Menu').value);
			</SCRIPT>

			<TABLE id=table3 height=15 cellSpacing=0 cellPadding=0 width=808 border=0>
				<TBODY>
				<TR>
					<TD height=15>
						<IMG height=15 src="/img/panel1.gif" width=164 border=0>
					</TD>
					<TD>
						<IMG height=15 src="/img/panel2.gif" width=645 border=0>
					</TD>
				</TR>
				</TBODY>
			</TABLE>
		</TD>
	</TR>
	<TR>
		<TD vAlign=top>

			<TABLE height=100% cellSpacing=0 cellPadding=0 border=0>
				<TBODY>	
				<TR>
					<TD vAlign=top width=157 bgColor=#e7e7e7 height=30>
						<ul class="cbi-tabmenu">
							<li class="cbi-tab" id="map-cfg-tab-basic">
								<a href="wifi_multi_ap_basic.asp">Basic</a>
							</li>
							<li class="cbi-tab-disabled" id="map-cfg-tab-adv" style="display:none">
								<a href="wifi_multi_ap_advanced.asp">Advanced</a>
							</li>
							<li class="cbi-tab-disabled" id="map-cfg-tab-action" style="display:none">
								<a href="wifi_multi_ap_action.asp">Action</a>
							</li>
							<li class="cbi-tab-disabled" id="map-cfg-tab-status" style="display:none">
								<a href="wifi_multi_ap_status.asp">Status</a>
							</li>
						</ul>
					</TD>
					<TD vAlign=top width=7 background=/img/panel3.gif>
						<ul class="cbi-tabmenu">
							<li class="cbi-tab" id="map-cfg-tab-basic-pel">&nbsp;</li>
							<li class="cbi-tab-disabled" id="map-cfg-tab-adv-pel" style="display:none">&nbsp;</li>
							<li class="cbi-tab-disabled" id="map-cfg-tab-action-pel" style="display:none">&nbsp;</li>
							<li class="cbi-tab-disabled" id="map-cfg-tab-status-pel" style="display:none">&nbsp;</li>
						</ul>
					</TD>
					<TD vAlign=top width=474 rowspan="2">
						<FORM style="DISPLAY: none" name=ConfigForm></FORM>
						<div id="maincontent" class="container">
							<div id="l1datNot">
								
							</div>
							<div id="l1datYes">

								
						      	<div id="isMapSupportedYes">

						      		
						            <div id="isMapCfgSupportedYes">
						            	<div id="map_cfgs_loading_div" style="display: none">
						            		<div class="alert-message" id="BusyMsg" style="display:none">
						            			<img src="/img/loading.gif" alt="" style="vertical-align:middle" />
						            			<big><strong>Please wait while the settings are being applied.</strong></big>
						            		</div>
						            	</div>

						            		<div class="alert-message" id="LOADING_MULTI_AP" style="display:none;">
							                    <img src="/img/loading.gif" alt="" style="vertical-align:middle" />
							                    <big><strong>Please wait.</strong></big>
							                </div>
							                <div id="map_validate_controller_settings_error_div" style="display: none">
							                	<div id="map_validate_controller_rssith_error_msg" style="display: none" class="alert-message error"><big><strong>RSSI Threshold is incorrect!</big></strong></div>
							                	<div id="map_validate_controller_channelth_error_msg" style="display: none" class="alert-message error"><big><strong>2G/5G Channel Utilization Threshold is incorrect!</big></strong></div>
							                	<div id="map_validate_controller_error_msg" class="alert-message error"><big><strong>Please enter an integer number !</big></strong></div>
							                </div>
							                <div id="MULTI_AP_SETTINGS">
							                    <input type="hidden" name="__activeTab" id="__activeTab" value="basic">
							                    <form method="post" name="cbi" action="/cgi-bin/wifi_multi_ap_basic.asp" onsubmit="return validate_all()" autocomplete="off">
							                    		<input type="hidden" name="SaveAll_Flag" value="0" />
							                    		<input type="hidden" name="Save_Flag" value="0" />
							                    		<input type="hidden" name="Action_Flag" value="0" />
							                    		<input type="hidden" name="resetToDefaultEasyMesh_Flag" value="0" />
							                    		<input type="hidden" name="wifi_trigger_onboarding_Flag" value="0" />
							                    		<input type="hidden" name="ether_trigger_onboarding_Flag" value="0" />
														<input type="hidden" name="MeshTriggerFlag" value="" />
														<input type="hidden" name="Change_Flag" value="0" />

							                    	<table class="cbi-section-table" id="map-cfg-basic">
							                    	<TBODY>
							                    		<tbody id="map-cfg-basic-meshenable-setting">
															<tr>
																<td>EasyMesh</td>
																<td colspan="2">
																	<input type="radio" style="width: auto" name="MapEnable" id="MapEnableOn" value="1" onchange="MapEnableClick(1)" onClick="this.blur();"  /> Enable
																	<input type="radio" style="width: auto" name="MapEnable" id="MapEnableOff" value="0" onchange="MapEnableClick(0)" onClick="this.blur();"  /> Disable
																</td>
															</tr>															
							                    		</tbody>

							                    	<div id="appliedMapEnableDiffNA_MapEnableYes_basic">
							                    		
							                        </div><!-- appliedMapEnableDiffNA_MapEnableYes_basic -->
							                        </table>
							                    </form>
							                </div>
							
							                <SCRIPT language=JavaScript type=text/javascript>
																	
																	var webReloadFlag = 0;
																	
																	
																	function JSO_Only_Status(staType)
																	{
																			var ret = ' { ' + 
																				'"status": "' + staType + '"' + 
																				' } ';
																			return ret;
																	}
																	
																	function JSO_get_apply_status()
																	{
																			var staType = 'DONE';
																			var webstate = "";
																			
																			if(1 == webstate)
																			{
																					staType = 'ON_PROGRESS';
																			}
																			else
																			{
																					staType = 'DONE';
																			}
																			
																			var ret = JSO_Only_Status(staType);
																			return ret;
																	}
																	
																	function JSO_get_al_mac()
																	{
																		var ret = '';
																		var al_mac = '';
																		
																		al_mac = "";
																		
																		ret = ' { ';
																		ret = ret + '"status": "SUCCESS",';
																		ret = ret + '"al_mac": "' + al_mac + '"';
																		ret = ret + ' } ';
																		
																		return ret;
																	}

																	function JSO_get_device_role()
																	{
																			var ret = '';
																			var mapDevRole = "";
																	
																			ret = '{ ';
																			ret = ret +	'"mapDevRole": "' + mapDevRole + '"';
																			ret = ret + ' }';
																	
																			return ret;
																	}
																	
																	function JSO_get_runtime_topology()
																	{
																		var ret = "";
																		ret = ret.replace(/\'/g,'\\\\u0022');
																		ret = ret.replace(/\\\\u0022Pass-phrase\\\\u0022:/g,'\\\\u0022WPAPSK\\\\u0022:');
																		return ret;
																	}
																	function JSO_get_sta_bh_interface()
																	{
																		
																		return ret;
																	}
																	function getX_Response(type)
																	{
																			var X_Res='';
																			try
																			{
																					switch(type)
																					{
																							case "get_apply_status":
																								X_Res = JSO_get_apply_status();
																								break;
																							case "get_device_role":
																								X_Res = JSO_get_device_role();
																								break;
																							case "get_al_mac":
																								X_Res = JSO_get_al_mac();
																								break;
																							case "get_runtime_topology":
																								X_Res = JSO_get_runtime_topology();
																								break;
																							case "get_sta_bh_interface":
																								X_Res = JSO_get_sta_bh_interface();
																											break;
																							default:
																								break;
																					}
																			}
																			catch(e)
																			{
																					X_Res='';
																			}
																			
																			return X_Res;
																	}
																	
																	function get_sta_bh_interface()
																	{
																		var devRole =  "";
																		if((devRole == "Agent") || ("2" == devRole))
																		{
																			var XHR_type = 'get_sta_bh_interface';
																		    var x_response = getX_Response(XHR_type);
																			{
																				try
																				{
																					var rsp = JSON.parse(x_response);
																					if(rsp.status == "SUCCESS")
																					{
																						var sta_bh_inf_arr = rsp.staBhInfStr.split(";");
																						for(var idx=0; idx < sta_bh_inf_arr.length; idx++)
																						{
																							if(sta_bh_inf_arr[idx] == "")
																							{
																								continue;
																							}
																							console.log("conn interface", sta_bh_inf_arr[idx]);
																							return sta_bh_inf_arr[idx];
																						}
																					}
																					else
																					{
																						console.log("Failed to get STA BH Interface!\nStatus: ",rsp.status);
																					}
																				}
																				catch(e)
																				{
																					console.log("Incorrect response!\nFailed to get STA BH Interface!");
																				}
																			}
																		}
																		else
																		{
																			staBhInfUl.parentNode.parentNode.style.display = "none";
																		}
																	}
																	
																	function CheckWifi()
																	{
																			var isWifiSupport = "";
																			if(isWifiSupport == "No")
																			{
																					alert("Please check all SSID setting:AuthMode/Encrypt Type should be (OPEN or WPA2PSK or WPA3PSK or WPA2PSKWPA3PSK(ssid is not fronthaul))/(NONE or AES) when mesh is enable.");
																					return 1;
																			}
																			var isWifi2gEnable = "";
																			var isWifi5gEnable = "";
																			if(0 == isWifi2gEnable || 0 == isWifi5gEnable)
																			{
																					alert("Please check all wifi(2.4g and 5g) should be enable.");
																					return 1;
																			}
																	}
																	
																	function MapEnableClick(_val)
																	{
																			if(_val)
																			{
																					if ( 1 == CheckWifi() )
																					{
																						var mapEnableRadio1 = document.getElementById("MapEnableOn");
																						var mapEnableRadio2 = document.getElementById("MapEnableOff");
																						mapEnableRadio1.checked = false;
																						mapEnableRadio2.checked = true;
																						return;
																					}
																					document.getElementById("map-cfg-basic-detail-setting").style.display = "";
																					document.getElementById("map-cfg-basic-ap-onboarding").style.display = "";
																					document.getElementById("map-cfg-tab-adv").style.display = "";
																					document.getElementById("map-cfg-tab-adv-pel").style.display = "";
																					document.getElementById("map-cfg-tab-action").style.display = "";
																					document.getElementById("map-cfg-tab-action-pel").style.display = "";
																					document.getElementById("map-cfg-tab-status").style.display = "";
																					document.getElementById("map-cfg-tab-status-pel").style.display = "";
																					
																					var devRole = document.getElementById("current-dev-role").innerHTML;
																					switch(devRole)
																	      	{
																	        		case "Not Configured": // Auto
																	        		    document.getElementById("map-cfg-basic-dev-role-configured-settings").style.display = "";
																							document.getElementById("map-cfg-back-haul-connection-status-settings").style.display = "";
																							document.getElementById("map-cfg-tab-adv").style.display = "none";
																							document.getElementById("map-cfg-tab-adv-pel").style.display = "none";
																	        				break;
																	        		case "Controller": // Controller
																	        		    document.getElementById("map-cfg-basic-dev-role-configured-settings").style.display = "";
																							document.getElementById("map-cfg-back-haul-connection-status-settings").style.display = "none";
																	        				break;
																	        		case "Agent": // Agent
																	        		    document.getElementById("map-cfg-basic-dev-role-configured-settings").style.display = "";
																							document.getElementById("map-cfg-back-haul-connection-status-settings").style.display = "";
																							document.getElementById("map-cfg-tab-adv").style.display = "none";
																							document.getElementById("map-cfg-tab-adv-pel").style.display = "none";
																	        				break;
																	        		default:
																	        				break;
																	      	}
																			}
																			else
																			{
																					document.getElementById("map-cfg-basic-detail-setting").style.display = "";
																					document.getElementById("map-cfg-basic-ap-onboarding").style.display = "none";
																					document.getElementById("map-cfg-tab-adv").style.display = "none";
																					document.getElementById("map-cfg-tab-adv-pel").style.display = "none";
																					document.getElementById("map-cfg-tab-action").style.display = "none";
																					document.getElementById("map-cfg-tab-action-pel").style.display = "none";
																					document.getElementById("map-cfg-tab-status").style.display = "none";
																					document.getElementById("map-cfg-tab-status-pel").style.display = "none";
																					
																					document.getElementById("map-cfg-basic-dev-role-configured-settings").style.display = "none";
																					document.getElementById("map-cfg-back-haul-connection-status-settings").style.display = "none";
																			}
																	}
																	
																	function validate_all()
																	{
																	    var devRole = document.getElementById("DeviceRole");
																	    var mapEnableRadio = document.getElementById("MapEnableOn");
																	    if(devRole.type == "radio" && (!(mapEnableRadio.checked)))
																	    {
																	        alert("Please click on Enable radio button of EasyMesh.");
																	        return false;
																	    }
																	    
																	/* Mesh_mapdcfg.MapEnable=1 */

																		document.getElementById("LOADING_MULTI_AP").style.display = "";
																	    document.getElementById("MULTI_AP_SETTINGS").style.display = "none";
																	    return true;
																	}
																	
																	function resetToDefaultEasyMesh()
																	{
																	
																			setText('resetToDefaultEasyMesh_Flag', 1);
																			setText('Action_Flag', 1);							                        
																	    	formSubmit(0);
																	}
																	
																	/* Mesh_mapdcfg.MapEnable=1 */
																	
																	function checkWebStatus()
																	{
																			
																			location.href = '/cgi-bin/wifi_multi_ap_basic.asp';
																	}
																	
																	function get_apply_status_cb(rsp)
																	{
																			clearTimeout(checkWebStatus);
																			webReloadFlag = 0;
																	    try
																	    {
																	        var r = JSON.parse(rsp);
																	    }
																	    catch(e)
																	    {
																	        return;
																	    }
																	    if(r.status == "ON_PROGRESS")
																	    {
																	        var altmsg ="Device is applying the saved settings now!\n" +
																	            "It is recommended to wait until all the saved settings are applied.\n";
																	        //alert(altmsg);
																	        
																	        document.getElementById('map_cfgs_loading_div').style.display = '';
																	        document.getElementById('BusyMsg').style.display = '';
																	        document.getElementById('LOADING_MULTI_AP').style.display = 'none';
																	        document.getElementById('MULTI_AP_SETTINGS').style.display = 'none';
																	        document.getElementById('map-cfg-tab-basic').style.display = 'none';
																	        document.getElementById('map-cfg-tab-adv').style.display = 'none';
																	        document.getElementById('map-cfg-tab-action').style.display = 'none';
																	        document.getElementById('map-cfg-tab-status').style.display = 'none';
																	        document.getElementById('map-cfg-tab-basic-pel').style.display = 'none';
																	        document.getElementById('map-cfg-tab-adv-pel').style.display = 'none';
																	        document.getElementById('map-cfg-tab-action-pel').style.display = 'none';
																	        document.getElementById('map-cfg-tab-status-pel').style.display = 'none';
																	        setTimeout(checkWebStatus, 5000);
																	        webReloadFlag = 1;
																	    }
																	}
																	
																	function get_apply_status()
																	{
																			var XHR_type = 'get_apply_status';
																			var x_response = getX_Response(XHR_type);
																			{
																					get_apply_status_cb(x_response);
																			}
																	}
																	
																	function LoadMapFrame ()
																	{
																			get_apply_status();
																			if(webReloadFlag)
																			{
																				return;
																			}
																	/* Mesh_mapdcfg.MapEnable=1 */
																	}
							                </script>
							      </div><!-- isMapCfgSupportedYes -->
							      
									</div><!-- isMapSupportedYes -->
									
								</div><!-- l1datYes -->
						</div>
					</TD>
			    <TD vAlign=top width=170 background=/img/panel4.gif rowSpan=5>
			    	<TABLE cellSpacing=0 cellPadding=20 width="100%" border=0 height='100%'>
			    		<TBODY>
			     		<TR>
				    		<TD valign='top'>
			    				<A href="/cgi-bin/help_content.asp#EasyMesh" target=_blank><IMG height=34 src="/img/help_en.gif" width=40 border=0></A>
			    			</TD>
			    		</TR>
			     	
			    		</TBODY>
			    	</TABLE>
			  	</TD>
				</TR>
				<TR>
					<TD vAlign=top width=157 bgColor=#e7e7e7 height=10></TD>
					<TD width=7 background=/img/panel3.gif> </TD>
					<TD></TD>
				</TR>
				<TR>
					<TD vAlign=top width=157 bgColor=#e7e7e7 height=30>
						<P class=Item_L2></P>
					</TD>
					<TD width=7 background=/img/panel3.gif> </TD>
				</TR>
				</TBODY>
			</TABLE>

		</TD>
	</TR>
	<TR>
		<TD height=1>
			<TABLE id=table7 height=35 cellSpacing=0 cellPadding=0 width=808 border=0>
				<TBODY>
				<TR>
					<TD width=162 bgColor=#ef8218> </TD>
					<TD width=278 bgColor=#427594> </TD>
					<TD width=196 bgColor=#427594>
						<P align=center id="cbi-btnsave_cancel-pel">
							<IMG id="btnOK" onclick="btnSave()" height=23 src="N/A" width=80 border=0>&nbsp;&nbsp;
							<IMG id="btnCancel" height=23 src="N/A" onclick="RefreshPage()" width=80 border=0>
						</P>
					</TD>
					<TD width=170 bgColor=#313031> </TD>
				</TR>
				</TBODY>
			</TABLE>
		</TD>
	</TR>
	</TBODY>
</TABLE>
<SCRIPT language=JavaScript type=text/javascript>
function formSubmit(saveAll)
{
		if(document.cbi != null)
		{
				if(saveAll)
				{
						setText('SaveAll_Flag', 1);
				}
				else
				{
						setText('SaveAll_Flag', 0);
				}
				setText('Save_Flag', 1);
				if( true == setEBooValueCookie(document.cbi) )
				{
					document.cbi.submit();	
				}
				else
				{
					setText('Save_Flag', 0);
				}
		}
}

function btnSave()
{
		if(document.cbi != null)
		{
			var isAllBHFHClosed = "";
			if(isAllBHFHClosed == "Yes")
			{
				var DeviceEnable=;		
				meshEnable = $('input[name=MapEnable]:checked').val();
				if ( (meshEnable != DeviceEnable) && (1 == meshEnable) )
				{
					alert("All bh and fh are closed, Please open them !")	
				}						
			}																
		

				setText('Change_Flag', 1);

				formSubmit(1);
		}
}

function LoadFrame ()
{
		var isl1datSupported = 1;



		if(isl1datSupported)
		{
				setDisplay('l1datNot',0);
				setDisplay('l1datYes',1);


		}
		else
		{
				setDisplay('l1datNot',1);
				setDisplay('l1datYes',0);
		}
}
</SCRIPT>
</BODY>
</HTML>
