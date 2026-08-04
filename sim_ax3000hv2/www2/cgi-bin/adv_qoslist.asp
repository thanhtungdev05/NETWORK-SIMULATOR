<html>
<head>
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" href="/style.css" type="text/css">
<script language="JavaScript" type="text/JavaScript">
var str_langQos = [
                                ["Yes", "Yes"],
                                ["No", "No"]
                        ];
function        getStr(key)
{
        for (var i=0; i<str_langQos.length; i++) {
                if (key == str_langQos[i][0])
                {
                        return str_langQos[i][1];
                }
        }
        return "";
}
</script>

<style  type="text/css">

#maintable{color: #FFFFFF;}

table td
{
margin:5 0;padding:5 0;
}
</style>


</head>
<body topmargin="10" leftmargin="0">
<div style="width:100%;" align="center">
<table width="820" cellpadding="0" cellspacing="0" >
<tr>
        <td width="820" height="5" valign="baseline" class="orange"></td>
</tr>
</table>
<table width="820" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
<tr>
        <td width="820" height="35" class="headline"><font color="#8c8c8c">QoS Settings Summary</font></td>
</tr>
<tr>
        <td align="center">
        <table cellspacing=0 cellpadding=0 border=1 bordercolor="#d9d9d9"width="820"  id="maintable">
        <tr height="30">
                <td height="35" colspan="6" bgcolor="4DB848" class="tabdata" align=center><strong> Rules </strong></td>

                <td height="35" colspan="1" bgcolor="FF9933" class="tabdata" align=center>

                <strong> Actions </strong></td>
                </tr>
                <tr>
                        <td class="tabdata" rowspan=2 align=center bgcolor="4DB848">#</td>
                        <td class="tabdata" rowspan=2 align=center bgcolor="4DB848"> Active </td>
                        <td class="tabdata" rowspan=2 align=center bgcolor="4DB848"> Application </td> 
                        <td class="tabdata" align=center bgcolor="4DB848"> Destination </td>
                        <td class="tabdata" align=center bgcolor="4DB848"> Source </td>
                        <td class="tabdata" rowspan=2 align=center bgcolor="4DB848"> Protocol ID </td>
                        <!--
                        <td class="tabdata" rowspan=2 align=center bgcolor="4DB848"> VLAN ID </td>
                        -->
                        <!--<td class="tabdata" rowspan=2 align=center bgcolor="4DB848"><div> IPP/TOS </div><div> (DSCP) </div></td> -->
                        <!--
                        <td class="tabdata" rowspan=2 align=center bgcolor="4DB848"> 802.1p </td>
                        <td rowspan=2 align=center class="tabdata" bgcolor="FF9933"><div> IPP/TOS </div><div> (DSCP) </div><div> Remarking </div></td>
                        <td rowspan=2 class="tabdata" align=center bgcolor="FF9933"><div> 802.1p </div><div> Remarking </div></td>
                        -->
                        <td rowspan=2 class="tabdata" align=center bgcolor="FF9933"> Queue # </td>
                </tr>
                <tr>
                        <td class="tabdata" align=center bgcolor="4DB848"><div style="display:none"> MAC </div><div> IP/Mask </div><div> Port Range </div></td>
                        <td class="tabdata" align=center bgcolor="4DB848"><div style="display:none"> MAC </div><div> IP/Mask </div><div> Port Range </div></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">0</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">1</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">2</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">3</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">4</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">5</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
            <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">6</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">7</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">8</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">9</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->              <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td height="24" align="center" class="tabdata" bgcolor="4DB848">10</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">11</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">12</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">13</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">14</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                
                <tr>
                <td align="center" class="tabdata" bgcolor="4DB848">15</td>
                <td align="center" class="tabdata" bgcolor="4DB848"><script>document.writeln(getStr(""))</script></td>
                <td align="center" class="tabdata" bgcolor="4DB848"> </td>
                <!--<td align="center" class="tabdata" bgcolor="4DB848"> </td>-->
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                        <!--
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="4DB848"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                        -->
                <td align="center" class="tabdata" bgcolor="FF9933"></td>
                </tr>
                
                </table>
                </td>
                </tr>
        </table>



        <table width="820" height="15" class="orange" cellpadding="0" cellspacing="0">
        <tr><td height="10" valign="baseline" class="tabdata"><FONT color="#8c8c8c">e:ethernet,usb:USB,ra:wlan,NS: Normal service, MD: Minimize delay, MT: Maximize throughput, MR: Maximize reliability, MC: Minimize monetary cost, HH: Highest, H: High, M: Medium, L: Low.</FONT></td>
        </tr>
        <tr><td valign="baseline" class="orange"> </td>
        </tr>
        </table>

</td>
</tr>
</table>

</div>
</body>
</html>
