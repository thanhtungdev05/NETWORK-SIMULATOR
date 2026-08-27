




<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
        <head>
                <meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
                <meta http-equiv=Content-Script-Type content=text/javascript>
                <meta http-equiv=Content-Style-Type content=text/css>
                <meta http-equiv=Content-Type content="text/html; charset=iso-8859-1">
                <!--<script language="JavaScript" src="OutVariant.asp"></script>-->
                <script language="JavaScript" src="/general.js"></script>
                <script language="JavaScript" src="/jsl.js"></script>
                <script language="JavaScript" src="/ip.js"></script>
                <style  type="text/css">
                        *{color:  #404040;}
                </style>

<script type="text/javascript" src="/spin.js" ></script>
<link rel="stylesheet" type="text/css" href="/style.css">
               <script language="JavaScript">
var orgPwd="50E3598CBA";
var user_name="admin";


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

document.getElementById('uiViewTools_Password').disabled=false;
document.getElementById('uiViewTools_PasswordConfirm').disabled=false;
var target = document.getElementById('firstDiv');
var spinner = new Spinner(opts).spin(target);
}

                        function fresh()
                        {
                                
                        }

                        /*
                        function doRefresh()
                        {
                                alert("Password reset complete!");
                                var mydate = new Date();
                                mydate.setTime(mydate.getTime() - 1);
                                
                                document.cookie = "uid=del;path=/; expires=" + mydate.toGMTString(); 
                                document.cookie = "psw=del;path=/; expires=" + mydate.toGMTString(); 
                                
                                window.location.href = "../";    
                        }
                        */

                        function dostatus()
                        {
                         //var form=document.tool_admin;
                         //form.uistatus.value = "Password reset complete!";
                          //document.getElementById("display_div0").style.visibility="visible";
                          document.getElementById("display_div0").style.display="";
                        }

                        function delCookie(name)
                        {  
                          var exp = new Date();  
                          exp.setTime(exp.getTime() - 10000);  
                          document.cookie = name + "=del;expires=" + exp.toGMTString();   
                          document.cookie = name + "=del;expires=" + exp.toGMTString() + ";path=/;";  
                        }

                        function doLogout()
                        {
                          delCookie("uid");
                          delCookie("psw");
                          delCookie("SESSIONID");
                          top.window.location.href="/cgi-bin/login.asp";
                        }

                        function uiSave() 
                        {
                                

                                if (document.tool_admin.uiViewTools_Password.value.length == 0) 
                                {
                                        alert("Empty Password Invaild.");
                                        return;
                                }

                                var password = document.tool_admin.uiViewTools_Password.value;

                                

                                for(var i = 0; i < password.length; i ++ )
                                {
                                         var ascNum = password.charCodeAt(i);
                                        //ascNUM : 59 ->semicolon(;)

                                        if (ascNum < 33 || ascNum > 126 || ascNum == 59)
                                        {
                                                alert("Password Invalid.The password can not contain semicolon(;) !!");
                                                return -1;
                                        }
                                }

                                if (document.tool_admin.uiViewTools_Password.value != document.tool_admin.uiViewTools_PasswordConfirm.value) 
                                {
                                        alert("Your Password and Confirm Password must match before you can apply.");
                                        return;
                                }

                                if(quotationCheck(document.tool_admin.uiViewTools_Password, 30) ) 
                                        return;

                                
                                showSpin();
								if(document.tool_admin.uiViewTools_Password.value != orgPwd )
									document.tool_admin.isPwdChanged.value=1;
                                document.tool_admin.adminFlag.value=1;
								document.getElementById('uiViewTools_Pwd').value=document.tool_admin.uiViewTools_Password.value;
                                document.getElementById('uiViewTools_Password').disabled=true;
								document.getElementById('uiViewTools_PasswordConfirm').disabled=true;
								document.tool_admin.submit();
                                return;
                        }

                        function quotationCheck(object, limit_len) 
                        {
                                var len = object.value.length;
                                var c;
                                var i, j = 0;
                                for (i = 0; i < len; i++)
                                {
                                        var c = object.value.charAt(i);
                              
                                        if (c == '"')
                                        {
                                                j += 6;
                                        }
                                        else
                                                j++;
                                }
                                if (j > limit_len)
                                {
                                        alert('Input too many character,double quotation marks(") will be count as 6 characters(&quot;)!!');                                                                                          
                                        return true;
                                }
                                return false;
                        }
                </script>
        </head>

        <body onLoad="fresh()" style="background:#4acbd6;">
                <FORM METHOD="POST" ACTION="/cgi-bin/tools_admin.asp" name="tool_admin">
                        <INPUT TYPE="HIDDEN" NAME="adminFlag" VALUE="0">
                        <INPUT TYPE="HIDDEN" NAME="CurrentAccess" VALUE=>
						<INPUT TYPE="HIDDEN" NAME="OrgPwd" VALUE=>
						<INPUT TYPE="HIDDEN" NAME="isPwdChanged" VALUE="0">
                        <div id="pagestyle">
                                <div id="contenttype">  
                                        <div id="block1" class="main_item">
                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed; margin:5px 0;">
                                                        <tr height="25px" style="background-color:#e6e6e6;">
                                                                <td align=left class="title-main" style="width:620px;padding-left:20px;">
                                                                        Administrator
                                                                </td>
                                                        </tr>
                                                </table>

                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed">
                                                        
                                                                <tr height="30px">
                                                                        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                                                                                Username
                                                                        </td>
                                                                        <td align=left class="tabdata" style="word-wrap:break-word;word-break:break-all;">
                                                                                <strong>
                                                                                     <script>
																						document.write(user_name);
																					</script>
                                                                                     </strong>
                                                                                </td>
                                                                </tr>

                                                                <tr height="30px">
                                                                        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                                                                                New Password
                                                                        </td>
                                                                        <td align=left class="tabdata" color="#F36F22" style="white-space:nowrap;">
                                                                                <INPUT TYPE="PASSWORD" id="uiViewTools_Password" NAME="uiViewTools_Password" SIZE="26" MAXLENGTH="31" VALUE="">  
                                                                                (length range:1~30)  
																			<input type="hidden" id="uiViewTools_Pwd" NAME="uiViewTools_Pwd" value="">
                                                                        </td>
                                                                </tr>

                                                                <tr height="30px">
                                                                        <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                                                                                Confirm Password
                                                                        </td>
                                                                        <td align=left class="tabdata" style="white-space:nowrap;">
                                                                                <INPUT TYPE="PASSWORD" id="uiViewTools_PasswordConfirm" NAME="uiViewTools_PasswordConfirm" SIZE="26" MAXLENGTH="31" VALUE="">    
                                                                        </td>
                                                                </tr>

                                                                <tr height="30px" id="display_div0" style="display:none;">
                                                                        <td align=left class="tabdata" style="width:250px;padding-left:20px;color:red;font-size:15px;">
                                                                                Password reset complete!
                                                                        </td>
                                                                </tr>
                                                        

                                                        
                                                </table>
                                        </div><!--id="block1" 12/22-->

                                        <div id="button0" class="main_item">
                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
                                                        <tr height="25px">
                                                                <td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
                                                                        Click "Save" to save your settings
                                                                </td>
                                                        </tr>
                                                </table>

                                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
                                                        <tr height="40px">
                                                                <td align=left class="tabdata" style="width:250px;padding-left:20px;">
                                                                        <INPUT TYPE="button" class="button1" NAME="SaveBtn" VALUE="Save" onClick="uiSave()"> 
                                                                </td>
                                                                <td id="firstDiv" style="float:left;"></td>
                                                        </tr>
                                                </table>
                                        </div><!--id="button0" 12/22-->
                                </div>
                        </div>

                
                </form>
        </body>
</html>
