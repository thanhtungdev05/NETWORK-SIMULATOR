<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
	<!-- page1 -->
		
		<head>
			<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
			<meta http-equiv=Content-Script-Type content=text/javascript>
			<meta http-equiv=Content-Style-Type content=text/css>
			<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
			<link rel="stylesheet" href="/style.css"  type="text/css">

			<style  type="text/css">
		
				body{color: #404040;}

				img.forattention
				{
					vertical-align:middle;										
				}
				
				.btn1
				{
					display:inline-block;
					cursor:pointer;
					color:#fff;
					font:15px Arial,Verdana,sans-serif;
					padding:0px 8px;
					height:20px;
					line-height:20px;
					*overflow:visible ;
					text-align:center;
					text-decoration:none;
					position:relative;
					background-color:#38a7dc;
					border:1px solid #38a7dc;
					outline:0;
				}

				label:hover
				{
					display:inline-block;
					background:#1a6f98;
					color:#fff;
					outline:0;
				}
				.InputTextWarning
				{
  					color:#CC0000;
  					border:0;
  				}

				#contenttype1
                                {
                                background-color: #FFFFFF;
				width:680px;
				padding:10px 3px 0px 3px;
				margin:0;
                                outline:0;
                                position:relative;
				border:1px solid #fff;
				-moz-border-radius:10px;
				-webkit-border-radius:10px;
				border-radius:10px;
				behavior:url(/PIE.htc);
}

				#contenttype2
                                {
                                 background-color: #FFFFFF;
                                 width:680px;
			  	 padding:0px 3px 10px 3px;
                                 margin:0;
                                 outline:0;
                                 position:relative;
                                 border:1px solid #fff;
                                 -moz-border-radius:10px;
                                 -webkit-border-radius:10px;
                                 border-radius:10px;
                                 behavior:url(/PIE.htc);
                                }

			</style>

			<script language="JavaScript" src="/general.js"></script>
			<script language="JavaScript">
		//cindy add for separate romfile and tclinux.bin

				function uiDoUpdate0()
				{
					var form=document.restoreForm;
					var string3 = form.tools_FW_UploadFile0.value.search(/romfile/);
					var string4 = form.tools_FW_UploadFile0.value.search(/VDSL_CO_romfile/);
					var string5 = form.tools_FW_UploadFile0.value.search(/tclinux/);
					
					if(form.tools_FW_UploadFile0.value=="") 
					{
						alert("You must select a file to update.");
					}
					else if(form.fwNameChk.value == "Yes") 
					{
						if (form.upload_type0.value=="romfile")
							form.UG_filetype.value = "romfile";
					
						else if (form.upload_type0.value=="tclinux.bin")
							form.UG_filetype.value = "tclinux";
					
						else 
						{
							/* it will not come to here */
							alert("you put a wrong file.");
							return;
						}
						form.uiStatus0.value = "Upgrade in progress, please wait...";
						form.postflag0.value = "1";
						form.submit();
					}
					else
					{
						if("N/A" == "Yes") 
						{
							if (((form.upload_type0.value=="romfile") && (string3 >= 0) && (string4 < 0)) || 
								((form.upload_type0.value=="tclinux.bin") && (string4 >= 0)) ||
								((form.upload_type[2].selected) && (string5 >= 0))) 
							
							{
								form.uiStatus0.value = "Upgrade in progress, please wait...";
								form.postflag0.value = "1";
								form.submit();
							}
							else
								alert("you put a wrong file.");
						}
						else 
						{
							if (((form.upload_type0.value == "romfile") && (string3 >= 0)) || ((form.upload_type0.value == "tclinux.bin") && (string5 >= 0))) 
							{
								form.uiStatus0.value = "Upgrade in progress, please wait...";
								form.postflag0.value = "1";
								form.submit();
							}
							else
								alert("you put a wrong file.");
						}
					}
				}

		//cindy add for separate romfile and tclinux.bin
				function uiDoUpdate()
				{
					var form=document.uiPostUpdateForm;
					var string3 = form.tools_FW_UploadFile.value.search(/romfile/);
					var string4 = form.tools_FW_UploadFile.value.search(/VDSL_CO_romfile/);
					var string5 = form.tools_FW_UploadFile.value.search(/tclinux/);

					if(form.tools_FW_UploadFile.value=="") 
					{
						alert("You must select a file to update.");
					}
					else if(form.fwNameChk.value == "Yes") 
					{
						//if (form.upload_type[0].selected)
						if (form.upload_type.value=="romfile")//cindy add
							
							form.UG_filetype.value = "romfile";
						
							
							//else if (form.upload_type[1].selected)
							else if (form.upload_type.value=="tclinux.bin")//cindy add
								form.UG_filetype.value = "tclinux";
						
						else 
						{
							/* it will not come to here */
							alert("you put a wrong file.");
							return;
						}
						form.uiStatus.value = "Upgrade in progress, please wait...";
						form.postflag.value = "1";
						form.submit();
					}
					else
					{
						if("N/A" == "Yes") 
						{
							//if (((form.upload_type[0].selected) && (string3 >= 0) && (string4 < 0)) || 
							//	((form.upload_type[1].selected) && (string4 >= 0)) ||
							//	((form.upload_type[2].selected) && (string5 >= 0))) 
							//cindy modify
							if (((form.upload_type.value=="romfile") && (string3 >= 0) && (string4 < 0)) || 
								((form.upload_type.value=="tclinux.bin") && (string4 >= 0)) ||
								((form.upload_type[2].selected) && (string5 >= 0))) 
							
							{
								form.uiStatus.value = "Upgrade in progress, please wait...";
								form.postflag.value = "1";
								form.submit();
							}
							else
								alert("you put a wrong file.");
						}
						else 
						{
							//if (((form.upload_type.value == "1") && (string3 >= 0)) || ((form.upload_type.value == "4") && (string5 >= 0))) 
							if (((form.upload_type.value == "romfile") && (string3 >= 0)) || ((form.upload_type.value == "tclinux.bin") && (string5 >= 0))) 

							{
								form.uiStatus.value = "Upgrade in progress, please wait...";
								form.postflag.value = "1";
								form.submit();
							}
							else
								alert("you put a wrong file.");
						}
					}
				}

				function backup_settings()
				{
					var cfg = '/cgi-bin/romfile.cfg';
					var code = 'location.assign("' + cfg + '")';
					eval(code);
				}

				function backup_vdsl_settings()
				{
					var cfg = '/VDSL_CO_romfile.cfg';
					var code = 'location.assign("' + cfg + '")';
					eval(code);
				}
				
				

				function handleFile()
				{
					var file = document.getElementById("xFile");
					var split_vars = file.value.split('\\');
					var fileName = document.getElementById("update_file_name");
					fileName.value = split_vars[split_vars.length-1];
				}

		//cindy add for separate romfile and tclinux.bin
				function handleFile0()
				{
					var file = document.getElementById("xFile0");
					var split_vars = file.value.split('\\');
					var fileName = document.getElementById("update_file_name0");
					fileName.value = split_vars[split_vars.length-1];
				}
		//cindy add for separate romfile and tclinux.bin
				
			</script>
		</head>
	
		
			<body>
		
				<FORM ENCTYPE="multipart/form-data" METHOD="POST" name="uiPostUpdateForm">
					<INPUT TYPE="HIDDEN" NAME="postflag" VALUE="0">
					<INPUT TYPE="HIDDEN" NAME="HTML_HEADER_TYPE" VALUE="2">
					

					<div id="pagestyle"><!--cindy add for border 11/28-->
						<div id="contenttype1">  <!--gleaf-->
							<div id="block1">
								<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
									<tr height="25px" style="background-color:#e6e6e6;">
										<td width="20px">&nbsp;</td>
										<td colspan="2" align="left" valign="middle" class="title-main">Firmware Upgrade</td>
									</tr>
								</table>

								<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
									<tr height="30px">
									    	<td width="20px">&nbsp;</td>
									    	<td width="250px" align=left class="tabdata">Firmware upgrade type </td>
									    	<td align=left class="tabdata">
			<!--cindy delete
									    		<select NAME="upload_type" SIZE="1">
									    			
								                                        <option value="1" >romfile</option>
											     		
								                                          <option value="4" selected="selected">tclinux.bin</option>
											     	
									     		</select>
									     	</td>
									</tr>

									<tr height="30px">
									    	<td width="20px">&nbsp;</td>
										<td colspan="2" align=left class="tabdata">
											<img class="forattention" src="/exclamation.gif">
											<font color="#F36F22">Romfile for configuration upgrade and tclinux.bin for firmware upgrade.</font>
										</td>
									</tr>
		                                           -->
		
		                                           <!--cindy add start -->
					                     	                        <input type="text" name="upload_type" readonly value="tclinux.bin" style="border:0;">
				                                        	</td>
			                       	                         </tr>
	             	                                      <!--cindy add start -->
				
									<!--New Firmware Location -->
									<tr height="30px">
									    	<td width="20px">&nbsp;</td>
									    	<td width="250px" align=left class="tabdata">Location</td>
									     	<td align=left class="tabdata">
									     		<!--gleaf modified begin-->
									     		<!--<a href="javascript:;" class="a-upload">
												<INPUT TYPE="FILE" NAME="tools_FW_UploadFile" SIZE="30" MAXLENGTH="128">
											</a>-->
												
											<input id="update_file_name" type="text" disabled="disable" SIZE="12" MAXLENGTH="128" value="" style="width:80px;">&nbsp;
											<label class="btn1" for="xFile" style="height:20px;">Browse...</label>
											<input type="file" id="xFile" name="tools_FW_UploadFile" style="position:absolute;clip:rect(0 0 0 0);" onchange="handleFile()">									
											<!--gleaf modified end-->
										</td>
									</tr>				
								
									

									<!--Status -->
									<tr height="30px">
										<td width="20px">&nbsp;</td>
										<td width="250px" align=left class="tabdata">Status</td>
										<td align=left class="tabdata">
											<!--
											<INPUT TYPE="TEXT"  style="background-color:#ffffff;"NAME="uiStatus" SIZE="45" MAXLENGTH="55" readonly VALUE="" class="InputTextWarning">
											-->
											
									<!--cindy add start 03/03-->
									<!--
										
											<INPUT TYPE="TEXT" NAME="uiStatus" SIZE="45" MAXLENGTH="55" readonly VALUE="" class="InputTextWarning">
									
									-->
										<INPUT TYPE="TEXT" NAME="uiStatus" SIZE="45" MAXLENGTH="55" readonly VALUE="" class="InputTextWarning">
									<!--cindy add end 03/03-->
										</td>
									</tr>

									<!--<tr class="ccomment"height="30px">-->
									<tr height="30px">
										<td width="20px">&nbsp;</td>
										<td colspan="2" align=left class="tabdata">
											<img class="forattention" src="/exclamation.gif">
											<font color="#F36F22">It might take several minutes, don't power off it during upgrading. Device will restart after the upgrade.</font>
										</td>
									</tr>
								</table>
							</div>

							<div id="block1">
								<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">	
									<tr height="25px">
										<td width="20px">&nbsp;</td>
										<td colspan="2" align="left" class="title-main">Click "Upgrade" to upgrade the firmware</td>
									</tr>
								</table>

								<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
									<tr height="30px">
										<td width="20px">&nbsp;</td>
										<td colspan="2" align=left class="tabdata">
											<INPUT TYPE="BUTTON" NAME="FW_apply" class="button1" VALUE="Upgrade" onClick="uiDoUpdate()"> 
											<INPUT type=hidden name="fwNameChk" VALUE="N/A">
										</td>								
									</tr>
								</table>
							</div>						
						</div>
					</div>
</form>
<FORM ENCTYPE="multipart/form-data" METHOD="POST" name="restoreForm">
	<INPUT TYPE="HIDDEN" NAME="postflag0" VALUE="0">
	<INPUT TYPE="HIDDEN" NAME="HTML_HEADER_TYPE" VALUE="2">
	
		
<div id="pagestyle">
	<div id="contenttype2">
<!--cindy add for separate romfile and tclinux.bin-->
		<div id="block1">
			<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">
				<tr height="25px" style="background-color:#e6e6e6;">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align="left" valign="middle" class="title-main">Restore Configuration</td>
				</tr>
			</table>

			<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
				<tr height="30px">
					<td width="20px">&nbsp;</td>
					<td width="250px" align=left class="tabdata">Firmware upgrade type </td>
					<td align=left class="tabdata">
						<input type="text" name="upload_type0" readonly value="romfile" style="border:0;">
					</td>
				</tr>
				<!--New Firmware Location -->
				<tr height="30px">
					<td width="20px">&nbsp;</td>
					<td width="250px" align=left class="tabdata">Location</td>
					<td align=left class="tabdata">												
						<input id="update_file_name0" type="text" disabled="disable" SIZE="12" MAXLENGTH="128" value="" style="width:80px;">&nbsp;
						<label class="btn1" for="xFile0" style="height:20px;">Browse...</label>
						<input type="file" id="xFile0" name="tools_FW_UploadFile0" style="position:absolute;clip:rect(0 0 0 0);" onchange="handleFile0()">									
					</td>
				</tr>
				
			

			<!--Status -->
				<tr height="30px">
					<td width="20px">&nbsp;</td>
					<td width="250px" align=left class="tabdata">Status</td>
					<td align=left class="tabdata">
						<!--cindy add start 03/03-->
						<!--
							
							<INPUT TYPE="TEXT" NAME="uiStatus0" SIZE="45" MAXLENGTH="55" readonly VALUE="" class="InputTextWarning">
						
						-->
							<INPUT TYPE="TEXT" NAME="uiStatus0" SIZE="45" MAXLENGTH="55" readonly VALUE="" class="InputTextWarning">
						<!--cindy add end 03/03-->
					</td>
				</tr>

				<!--<tr class="ccomment"height="30px">-->
				<tr height="30px">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align=left class="tabdata">
						<img class="forattention" src="/exclamation.gif">
						<font color="#F36F22">It might take several minutes, don't power off it during upgrading. Device will restart after the upgrade.</font>
					</td>
				</tr>
			</table>
		</div>

		<div id="block1">
			<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">	
				<tr height="25px">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align="left" class="title-main">Click "Restore" to restore the configuration</td>
				</tr>
			</table>

			<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
				<tr height="30px">
					<td width="20px">&nbsp;</td>
					<td colspan="2" align=left class="tabdata">
						<INPUT TYPE="BUTTON" NAME="FW_apply" class="button1" VALUE="Restore" onClick="uiDoUpdate0();"> 
						<INPUT type=hidden name="fwNameChk" VALUE="N/A">
					</td>								
				</tr>
			</table>
		</div>						

							<div id="button0">											
								<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata" style="margin:5px 0px;">		
									<!--ROMFILE BACKUP -->
									<tr height="25px">
										<td width="20px">&nbsp;</td>
										<td colspan="2" align="left" class="title-main">Click "Download" to download the current configuration file</td>
									</tr>
								</table>

								<table width="640px" border="0"  cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" class="tabdata">
									
										<tr height="30px">
										    	<td width="20px">&nbsp;</td>
										    	<td colspan="2" align=left class="tabdata">
										     		<input type="button" class="button1" value="Download" onClick='backup_settings()'>
												
											</td>
										</tr>
									
								</table>
							</div>
						</div>
					</div><!--cindy add for border 11/28-->
															
					
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
			<!-- page1  end-->
	
</html>

<!-- BẮT ĐẦU SCRIPT CHẶN RELOAD TRANG KHI SAVE (TỰ ĐỘNG THÊM VÀO) -->
<script>
(function() {
    // Hàm hiển thị thông báo thành công giả lập
    function showFakeSaveMsg(formEl) {
        var target = document.getElementById('firstDiv') || document.getElementById('firstDiv0') || document.getElementById('firstDiv2') || document.getElementById('buttoncolor') || document.getElementById('button0');
        if (!target) {
            var btns = formEl ? formEl.querySelectorAll('.button1') : [];
            if (btns.length > 0) {
                target = document.createElement('span');
                btns[0].parentNode.insertBefore(target, btns[0].nextSibling);
            } else {
                target = document.body;
            }
        }
        if (!document.getElementById('fakeSaveMsg')) {
            var msg = document.createElement('span');
            msg.id = 'fakeSaveMsg';
            msg.style.color = '#15803d';
            msg.style.fontWeight = 'bold';
            msg.style.fontSize = '12px';
            msg.style.marginLeft = '10px';
            msg.style.lineHeight = '24px';
            target.appendChild(msg);
        }
        var msgEl = document.getElementById('fakeSaveMsg');
        msgEl.innerHTML = '✔ Saved successfully!';
        
        // Hiện spinner một chút cho giống thật
        if (typeof showSpin === 'function') {
            try { showSpin(); } catch(e){}
        } else if (typeof showSpin2 === 'function') {
            try { showSpin2(); } catch(e){}
        }
        
        setTimeout(function() {
            msgEl.innerHTML = '';
        }, 2500);

        // BÁO CÁO RA PORTAL (duyệt lên qua frameset để tìm đúng portal)
        try {
            var w = window;
            for (var i = 0; i < 10; i++) {
                if (w.onSimulatorSave) {
                    w.onSimulatorSave(window);
                    break;
                }
                if (w === w.parent) break;
                w = w.parent;
            }
        } catch(e) {}
    }

    // 1. Chặn submit HTML native (các nút <input type="submit">)
    document.addEventListener('submit', function(e) {
        e.preventDefault();
        showFakeSaveMsg(e.target);
    });

    // 2. Chặn submit bằng JS (document.form.submit())
    if (typeof HTMLFormElement !== 'undefined') {
        var originalSubmit = HTMLFormElement.prototype.submit;
        HTMLFormElement.prototype.submit = function() {
            showFakeSaveMsg(this);
        };
    }
})();
</script>
<!-- KẾT THÚC SCRIPT CHẶN RELOAD -->
