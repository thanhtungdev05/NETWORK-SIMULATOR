<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
        <head>
                <meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
                <meta http-equiv=Content-Script-Type content=text/javascript>
                <meta http-equiv=Content-Style-Type content=text/css>
                <meta http-equiv=Content-Type content="text/html; charset=iso-8859-1">
                <link rel="stylesheet" type="text/css" href="/style.css">
				<style  type="text/css">
                        *{color:  #404040;}
                </style>

                <script type='text/javascript'>
                        function onClickRunWizard() 
                        {
                                
                                        window.open("/cgi-bin/wizardset.asp","OpenClose","toolbar=no,menubar=no,height=400,width=520,location=0,left=100,top=100");
                                
                                return false;
                        }
                </script>
        </head>

        <body style="background:#4acbd6;">
                <div id="pagestyle">
                   <div id="contenttype">
                        <div id="block1" class="main_item">
                                <table width="640px" border="0"  cellpadding="0" cellspacing="0" style="margin:5px 0;">
                                        <tr height="25px" style="width:100%;background:#e6e6e6;">
                                                <td width="250px" align=left class="title-main" style="padding-left:20px;">Quick Start</td>
                                        </tr>
                                </table>

                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
                                        <tr>
                                                <td width="20">&nbsp;</td>
                                                <!-- <td class="databold" style="padding-right:30px;padding-bottom:10px;">-->
                                                <td class="databold" style="padding-right:20px;text-align:justify;text-justify:auto;">  
                                                        
                                                                
                                                                        This GPON Router is ideal for home networking and small business networking.The 'Quick Start' wizard will guide you to configure the GPON Router to connect to your ISP (Internet Service Provider).The router's easy Quick Start will allow you to have Internet access within minutes.Please follow the 'Quick Start'  wizard step by step to configure the GPON Router.
                                                                
                                                        
                                                </td>
                                        </tr>
                                </table>
                        </div>
                        <div id="button0" class="main_item">
                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
                                        <tr height="25px">
                                                <td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">
                                                        Click "Run Wizard" to configure the GPON Router
                                                </td>
                                        </tr>
                                </table>

                                <table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
                                         <tr height="40px">
                                                <td  align="left" class="tabdata" style="padding-left:20px;">
                                                        <INPUT type=button value="Run Wizard" name=wizard  class="button1" onclick="onClickRunWizard()">
                                                </td>
                                         </tr>
                                </table>
                        </div>
                  </div><!--id=contenttype-->
                </div>

                
        </body>
</html>        
