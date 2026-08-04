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
<link rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">
*{color:  #404040;}
</style>

<script language="JavaScript">
var lease_num='1';
var entry0_hostname='Unknown';
var entry0_ip='192.168.1.179';
var entry0_mac='D8:43:AE:2E:65:45';
var entry0_interfacetype='LAN3';
var entry0_80211v='';
var entry0_expireday='0';
var entry0_expiretime='0';
var entry1_hostname='';
var entry1_ip='';
var entry1_mac='';
var entry1_interfacetype='';
var entry1_80211v='';
var entry1_expireday='';
var entry1_expiretime='';
var entry2_hostname='';
var entry2_ip='';
var entry2_mac='';
var entry2_interfacetype='';
var entry2_80211v='';
var entry2_expireday='';
var entry2_expiretime='';
var entry3_hostname='';
var entry3_ip='';
var entry3_mac='';
var entry3_interfacetype='';
var entry3_80211v='';
var entry3_expireday='';
var entry3_expiretime='';
var entry4_hostname='';
var entry4_ip='';
var entry4_mac='';
var entry4_interfacetype='';
var entry4_80211v='';
var entry4_expireday='';
var entry4_expiretime='';
var entry5_hostname='';
var entry5_ip='';
var entry5_mac='';
var entry5_interfacetype='';
var entry5_80211v='';
var entry5_expireday='';
var entry5_expiretime='';
var entry6_hostname='';
var entry6_ip='';
var entry6_mac='';
var entry6_interfacetype='';
var entry6_80211v='';
var entry6_expireday='';
var entry6_expiretime='';
var entry7_hostname='';
var entry7_ip='';
var entry7_mac='';
var entry7_interfacetype='';
var entry7_80211v='';
var entry7_expireday='';
var entry7_expiretime='';
var entry8_hostname='';
var entry8_ip='';
var entry8_mac='';
var entry8_interfacetype='';
var entry8_80211v='';
var entry8_expireday='';
var entry8_expiretime='';
var entry9_hostname='';
var entry9_ip='';
var entry9_mac='';
var entry9_interfacetype='';
var entry9_80211v='';
var entry9_expireday='';
var entry9_expiretime='';
var entry10_hostname='';
var entry10_ip='';
var entry10_mac='';
var entry10_interfacetype='';
var entry10_80211v='';
var entry10_expireday='';
var entry10_expiretime='';
var entry11_hostname='';
var entry11_ip='';
var entry11_mac='';
var entry11_interfacetype='';
var entry11_80211v='';
var entry11_expireday='';
var entry11_expiretime='';
var entry12_hostname='';
var entry12_ip='';
var entry12_mac='';
var entry12_interfacetype='';
var entry12_80211v='';
var entry12_expireday='';
var entry12_expiretime='';
var entry13_hostname='';
var entry13_ip='';
var entry13_mac='';
var entry13_interfacetype='';
var entry13_80211v='';
var entry13_expireday='';
var entry13_expiretime='';
var entry14_hostname='';
var entry14_ip='';
var entry14_mac='';
var entry14_interfacetype='';
var entry14_80211v='';
var entry14_expireday='';
var entry14_expiretime='';
var entry15_hostname='';
var entry15_ip='';
var entry15_mac='';
var entry15_interfacetype='';
var entry15_80211v='';
var entry15_expireday='';
var entry15_expiretime='';
var entry16_hostname='';
var entry16_ip='';
var entry16_mac='';
var entry16_interfacetype='';
var entry16_80211v='';
var entry16_expireday='';
var entry16_expiretime='';
var entry17_hostname='';
var entry17_ip='';
var entry17_mac='';
var entry17_interfacetype='';
var entry17_80211v='';
var entry17_expireday='';
var entry17_expiretime='';
var entry18_hostname='';
var entry18_ip='';
var entry18_mac='';
var entry18_interfacetype='';
var entry18_80211v='';
var entry18_expireday='';
var entry18_expiretime='';
var entry19_hostname='';
var entry19_ip='';
var entry19_mac='';
var entry19_interfacetype='';
var entry19_80211v='';
var entry19_expireday='';
var entry19_expiretime='';
var entry20_hostname='';
var entry20_ip='';
var entry20_mac='';
var entry20_interfacetype='';
var entry20_80211v='';
var entry20_expireday='';
var entry20_expiretime='';
var entry21_hostname='';
var entry21_ip='';
var entry21_mac='';
var entry21_interfacetype='';
var entry21_80211v='';
var entry21_expireday='';
var entry21_expiretime='';
var entry22_hostname='';
var entry22_ip='';
var entry22_mac='';
var entry22_interfacetype='';
var entry22_80211v='';
var entry22_expireday='';
var entry22_expiretime='';
var entry23_hostname='';
var entry23_ip='';
var entry23_mac='';
var entry23_interfacetype='';
var entry23_80211v='';
var entry23_expireday='';
var entry23_expiretime='';
var entry24_hostname='';
var entry24_ip='';
var entry24_mac='';
var entry24_interfacetype='';
var entry24_80211v='';
var entry24_expireday='';
var entry24_expiretime='';
var entry25_hostname='';
var entry25_ip='';
var entry25_mac='';
var entry25_interfacetype='';
var entry25_80211v='';
var entry25_expireday='';
var entry25_expiretime='';
var entry26_hostname='';
var entry26_ip='';
var entry26_mac='';
var entry26_interfacetype='';
var entry26_80211v='';
var entry26_expireday='';
var entry26_expiretime='';
var entry27_hostname='';
var entry27_ip='';
var entry27_mac='';
var entry27_interfacetype='';
var entry27_80211v='';
var entry27_expireday='';
var entry27_expiretime='';
var entry28_hostname='';
var entry28_ip='';
var entry28_mac='';
var entry28_interfacetype='';
var entry28_80211v='';
var entry28_expireday='';
var entry28_expiretime='';
var entry29_hostname='';
var entry29_ip='';
var entry29_mac='';
var entry29_interfacetype='';
var entry29_80211v='';
var entry29_expireday='';
var entry29_expiretime='';
var entry30_hostname='';
var entry30_ip='';
var entry30_mac='';
var entry30_interfacetype='';
var entry30_80211v='';
var entry30_expireday='';
var entry30_expiretime='';
var entry31_hostname='';
var entry31_ip='';
var entry31_mac='';
var entry31_interfacetype='';
var entry31_80211v='';
var entry31_expireday='';
var entry31_expiretime='';
var entry32_hostname='';
var entry32_ip='';
var entry32_mac='';
var entry32_interfacetype='';
var entry32_80211v='';
var entry32_expireday='';
var entry32_expiretime='';
var entry33_hostname='';
var entry33_ip='';
var entry33_mac='';
var entry33_interfacetype='';
var entry33_80211v='';
var entry33_expireday='';
var entry33_expiretime='';
var entry34_hostname='';
var entry34_ip='';
var entry34_mac='';
var entry34_interfacetype='';
var entry34_80211v='';
var entry34_expireday='';
var entry34_expiretime='';
var entry35_hostname='';
var entry35_ip='';
var entry35_mac='';
var entry35_interfacetype='';
var entry35_80211v='';
var entry35_expireday='';
var entry35_expiretime='';
var entry36_hostname='';
var entry36_ip='';
var entry36_mac='';
var entry36_interfacetype='';
var entry36_80211v='';
var entry36_expireday='';
var entry36_expiretime='';
var entry37_hostname='';
var entry37_ip='';
var entry37_mac='';
var entry37_interfacetype='';
var entry37_80211v='';
var entry37_expireday='';
var entry37_expiretime='';
var entry38_hostname='';
var entry38_ip='';
var entry38_mac='';
var entry38_interfacetype='';
var entry38_80211v='';
var entry38_expireday='';
var entry38_expiretime='';
var entry39_hostname='';
var entry39_ip='';
var entry39_mac='';
var entry39_interfacetype='';
var entry39_80211v='';
var entry39_expireday='';
var entry39_expiretime='';
var entry40_hostname='';
var entry40_ip='';
var entry40_mac='';
var entry40_interfacetype='';
var entry40_80211v='';
var entry40_expireday='';
var entry40_expiretime='';
var entry41_hostname='';
var entry41_ip='';
var entry41_mac='';
var entry41_interfacetype='';
var entry41_80211v='';
var entry41_expireday='';
var entry41_expiretime='';
var entry42_hostname='';
var entry42_ip='';
var entry42_mac='';
var entry42_interfacetype='';
var entry42_80211v='';
var entry42_expireday='';
var entry42_expiretime='';
var entry43_hostname='';
var entry43_ip='';
var entry43_mac='';
var entry43_interfacetype='';
var entry43_80211v='';
var entry43_expireday='';
var entry43_expiretime='';
var entry44_hostname='';
var entry44_ip='';
var entry44_mac='';
var entry44_interfacetype='';
var entry44_80211v='';
var entry44_expireday='';
var entry44_expiretime='';
var entry45_hostname='';
var entry45_ip='';
var entry45_mac='';
var entry45_interfacetype='';
var entry45_80211v='';
var entry45_expireday='';
var entry45_expiretime='';
var entry46_hostname='';
var entry46_ip='';
var entry46_mac='';
var entry46_interfacetype='';
var entry46_80211v='';
var entry46_expireday='';
var entry46_expiretime='';
var entry47_hostname='';
var entry47_ip='';
var entry47_mac='';
var entry47_interfacetype='';
var entry47_80211v='';
var entry47_expireday='';
var entry47_expiretime='';
var entry48_hostname='';
var entry48_ip='';
var entry48_mac='';
var entry48_interfacetype='';
var entry48_80211v='';
var entry48_expireday='';
var entry48_expiretime='';
var entry49_hostname='';
var entry49_ip='';
var entry49_mac='';
var entry49_interfacetype='';
var entry49_80211v='';
var entry49_expireday='';
var entry49_expiretime='';
var entry50_hostname='';
var entry50_ip='';
var entry50_mac='';
var entry50_interfacetype='';
var entry50_80211v='';
var entry50_expireday='';
var entry50_expiretime='';
var entry51_hostname='';
var entry51_ip='';
var entry51_mac='';
var entry51_interfacetype='';
var entry51_80211v='';
var entry51_expireday='';
var entry51_expiretime='';
var entry52_hostname='';
var entry52_ip='';
var entry52_mac='';
var entry52_interfacetype='';
var entry52_80211v='';
var entry52_expireday='';
var entry52_expiretime='';
var entry53_hostname='';
var entry53_ip='';
var entry53_mac='';
var entry53_interfacetype='';
var entry53_80211v='';
var entry53_expireday='';
var entry53_expiretime='';
var entry54_hostname='';
var entry54_ip='';
var entry54_mac='';
var entry54_interfacetype='';
var entry54_80211v='';
var entry54_expireday='';
var entry54_expiretime='';
var entry55_hostname='';
var entry55_ip='';
var entry55_mac='';
var entry55_interfacetype='';
var entry55_80211v='';
var entry55_expireday='';
var entry55_expiretime='';
var entry56_hostname='';
var entry56_ip='';
var entry56_mac='';
var entry56_interfacetype='';
var entry56_80211v='';
var entry56_expireday='';
var entry56_expiretime='';
var entry57_hostname='';
var entry57_ip='';
var entry57_mac='';
var entry57_interfacetype='';
var entry57_80211v='';
var entry57_expireday='';
var entry57_expiretime='';
var entry58_hostname='';
var entry58_ip='';
var entry58_mac='';
var entry58_interfacetype='';
var entry58_80211v='';
var entry58_expireday='';
var entry58_expiretime='';
var entry59_hostname='';
var entry59_ip='';
var entry59_mac='';
var entry59_interfacetype='';
var entry59_80211v='';
var entry59_expireday='';
var entry59_expiretime='';
var entry60_hostname='';
var entry60_ip='';
var entry60_mac='';
var entry60_interfacetype='';
var entry60_80211v='';
var entry60_expireday='';
var entry60_expiretime='';
var entry61_hostname='';
var entry61_ip='';
var entry61_mac='';
var entry61_interfacetype='';
var entry61_80211v='';
var entry61_expireday='';
var entry61_expiretime='';
var entry62_hostname='';
var entry62_ip='';
var entry62_mac='';
var entry62_interfacetype='';
var entry62_80211v='';
var entry62_expireday='';
var entry62_expiretime='';
var entry63_hostname='';
var entry63_ip='';
var entry63_mac='';
var entry63_interfacetype='';
var entry63_80211v='';
var entry63_expireday='';
var entry63_expiretime='';
var entry64_hostname='';
var entry64_ip='';
var entry64_mac='';
var entry64_interfacetype='';
var entry64_80211v='';
var entry64_expireday='';
var entry64_expiretime='';
var entry65_hostname='';
var entry65_ip='';
var entry65_mac='';
var entry65_interfacetype='';
var entry65_80211v='';
var entry65_expireday='';
var entry65_expiretime='';
var entry66_hostname='';
var entry66_ip='';
var entry66_mac='';
var entry66_interfacetype='';
var entry66_80211v='';
var entry66_expireday='';
var entry66_expiretime='';
var entry67_hostname='';
var entry67_ip='';
var entry67_mac='';
var entry67_interfacetype='';
var entry67_80211v='';
var entry67_expireday='';
var entry67_expiretime='';
var entry68_hostname='';
var entry68_ip='';
var entry68_mac='';
var entry68_interfacetype='';
var entry68_80211v='';
var entry68_expireday='';
var entry68_expiretime='';
var entry69_hostname='';
var entry69_ip='';
var entry69_mac='';
var entry69_interfacetype='';
var entry69_80211v='';
var entry69_expireday='';
var entry69_expiretime='';
var entry70_hostname='';
var entry70_ip='';
var entry70_mac='';
var entry70_interfacetype='';
var entry70_80211v='';
var entry70_expireday='';
var entry70_expiretime='';
var entry71_hostname='';
var entry71_ip='';
var entry71_mac='';
var entry71_interfacetype='';
var entry71_80211v='';
var entry71_expireday='';
var entry71_expiretime='';
var entry72_hostname='';
var entry72_ip='';
var entry72_mac='';
var entry72_interfacetype='';
var entry72_80211v='';
var entry72_expireday='';
var entry72_expiretime='';
var entry73_hostname='';
var entry73_ip='';
var entry73_mac='';
var entry73_interfacetype='';
var entry73_80211v='';
var entry73_expireday='';
var entry73_expiretime='';
var entry74_hostname='';
var entry74_ip='';
var entry74_mac='';
var entry74_interfacetype='';
var entry74_80211v='';
var entry74_expireday='';
var entry74_expiretime='';
var entry75_hostname='';
var entry75_ip='';
var entry75_mac='';
var entry75_interfacetype='';
var entry75_80211v='';
var entry75_expireday='';
var entry75_expiretime='';
var entry76_hostname='';
var entry76_ip='';
var entry76_mac='';
var entry76_interfacetype='';
var entry76_80211v='';
var entry76_expireday='';
var entry76_expiretime='';
var entry77_hostname='';
var entry77_ip='';
var entry77_mac='';
var entry77_interfacetype='';
var entry77_80211v='';
var entry77_expireday='';
var entry77_expiretime='';
var entry78_hostname='';
var entry78_ip='';
var entry78_mac='';
var entry78_interfacetype='';
var entry78_80211v='';
var entry78_expireday='';
var entry78_expiretime='';
var entry79_hostname='';
var entry79_ip='';
var entry79_mac='';
var entry79_interfacetype='';
var entry79_80211v='';
var entry79_expireday='';
var entry79_expiretime='';
var entry80_hostname='';
var entry80_ip='';
var entry80_mac='';
var entry80_interfacetype='';
var entry80_80211v='';
var entry80_expireday='';
var entry80_expiretime='';
var entry81_hostname='';
var entry81_ip='';
var entry81_mac='';
var entry81_interfacetype='';
var entry81_80211v='';
var entry81_expireday='';
var entry81_expiretime='';
var entry82_hostname='';
var entry82_ip='';
var entry82_mac='';
var entry82_interfacetype='';
var entry82_80211v='';
var entry82_expireday='';
var entry82_expiretime='';
var entry83_hostname='';
var entry83_ip='';
var entry83_mac='';
var entry83_interfacetype='';
var entry83_80211v='';
var entry83_expireday='';
var entry83_expiretime='';
var entry84_hostname='';
var entry84_ip='';
var entry84_mac='';
var entry84_interfacetype='';
var entry84_80211v='';
var entry84_expireday='';
var entry84_expiretime='';
var entry85_hostname='';
var entry85_ip='';
var entry85_mac='';
var entry85_interfacetype='';
var entry85_80211v='';
var entry85_expireday='';
var entry85_expiretime='';
var entry86_hostname='';
var entry86_ip='';
var entry86_mac='';
var entry86_interfacetype='';
var entry86_80211v='';
var entry86_expireday='';
var entry86_expiretime='';
var entry87_hostname='';
var entry87_ip='';
var entry87_mac='';
var entry87_interfacetype='';
var entry87_80211v='';
var entry87_expireday='';
var entry87_expiretime='';
var entry88_hostname='';
var entry88_ip='';
var entry88_mac='';
var entry88_interfacetype='';
var entry88_80211v='';
var entry88_expireday='';
var entry88_expiretime='';
var entry89_hostname='';
var entry89_ip='';
var entry89_mac='';
var entry89_interfacetype='';
var entry89_80211v='';
var entry89_expireday='';
var entry89_expiretime='';
var entry90_hostname='';
var entry90_ip='';
var entry90_mac='';
var entry90_interfacetype='';
var entry90_80211v='';
var entry90_expireday='';
var entry90_expiretime='';
var entry91_hostname='';
var entry91_ip='';
var entry91_mac='';
var entry91_interfacetype='';
var entry91_80211v='';
var entry91_expireday='';
var entry91_expiretime='';
var entry92_hostname='';
var entry92_ip='';
var entry92_mac='';
var entry92_interfacetype='';
var entry92_80211v='';
var entry92_expireday='';
var entry92_expiretime='';
var entry93_hostname='';
var entry93_ip='';
var entry93_mac='';
var entry93_interfacetype='';
var entry93_80211v='';
var entry93_expireday='';
var entry93_expiretime='';
var entry94_hostname='';
var entry94_ip='';
var entry94_mac='';
var entry94_interfacetype='';
var entry94_80211v='';
var entry94_expireday='';
var entry94_expiretime='';
var entry95_hostname='';
var entry95_ip='';
var entry95_mac='';
var entry95_interfacetype='';
var entry95_80211v='';
var entry95_expireday='';
var entry95_expiretime='';
var entry96_hostname='';
var entry96_ip='';
var entry96_mac='';
var entry96_interfacetype='';
var entry96_80211v='';
var entry96_expireday='';
var entry96_expiretime='';
var entry97_hostname='';
var entry97_ip='';
var entry97_mac='';
var entry97_interfacetype='';
var entry97_80211v='';
var entry97_expireday='';
var entry97_expiretime='';
var entry98_hostname='';
var entry98_ip='';
var entry98_mac='';
var entry98_interfacetype='';
var entry98_80211v='';
var entry98_expireday='';
var entry98_expiretime='';
var entry99_hostname='';
var entry99_ip='';
var entry99_mac='';
var entry99_interfacetype='';
var entry99_80211v='';
var entry99_expireday='';
var entry99_expiretime='';
var entry100_hostname='';
var entry100_ip='';
var entry100_mac='';
var entry100_interfacetype='';
var entry100_80211v='';
var entry100_expireday='';
var entry100_expiretime='';
var entry101_hostname='';
var entry101_ip='';
var entry101_mac='';
var entry101_interfacetype='';
var entry101_80211v='';
var entry101_expireday='';
var entry101_expiretime='';
var entry102_hostname='';
var entry102_ip='';
var entry102_mac='';
var entry102_interfacetype='';
var entry102_80211v='';
var entry102_expireday='';
var entry102_expiretime='';
var entry103_hostname='';
var entry103_ip='';
var entry103_mac='';
var entry103_interfacetype='';
var entry103_80211v='';
var entry103_expireday='';
var entry103_expiretime='';
var entry104_hostname='';
var entry104_ip='';
var entry104_mac='';
var entry104_interfacetype='';
var entry104_80211v='';
var entry104_expireday='';
var entry104_expiretime='';
var entry105_hostname='';
var entry105_ip='';
var entry105_mac='';
var entry105_interfacetype='';
var entry105_80211v='';
var entry105_expireday='';
var entry105_expiretime='';
var entry106_hostname='';
var entry106_ip='';
var entry106_mac='';
var entry106_interfacetype='';
var entry106_80211v='';
var entry106_expireday='';
var entry106_expiretime='';
var entry107_hostname='';
var entry107_ip='';
var entry107_mac='';
var entry107_interfacetype='';
var entry107_80211v='';
var entry107_expireday='';
var entry107_expiretime='';
var entry108_hostname='';
var entry108_ip='';
var entry108_mac='';
var entry108_interfacetype='';
var entry108_80211v='';
var entry108_expireday='';
var entry108_expiretime='';
var entry109_hostname='';
var entry109_ip='';
var entry109_mac='';
var entry109_interfacetype='';
var entry109_80211v='';
var entry109_expireday='';
var entry109_expiretime='';

function Reload(){
window.location.reload();

}

function showTable(id,header,data,keyIndex){
        var html = ["<table id=client_list border=0  cellpadding=1 cellspacing=0>"];
        // 1.generate table header
        html.push("<tr height=30px>");
        for(var i =0; i<header.length; i++){
                html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +" </strong>"+ "</td>");
        }
		html.push("<td></td>");
        html.push("</tr>");
        // 2.generate table data
        for(var i =0; i<data.length; i++)
        {
                   if(data[i][keyIndex] != "N/A" && data[i][keyIndex] != "")
                 {
                        html.push("<tr height=30px>");
                        for(var j=0; j<data[i].length; j++)
                        {
							if(j == 3)
                                html.push("<td align=center class=topborderstyle>" + data[i][j].toUpperCase() + "</td>");
							else
								html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");

                        }
						html.push("<td></td>");
                        html.push("</tr>");
                }
        }
        html.push("</table>");
        if(parseInt(document.Devicetable.LeaseNum.value)>30)
        {
                html.push('<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">');
                html.push("<tr height=30px>");
                html.push('<td align=left class="tabdata" style="padding-left:20px;">');
                html.push("<input type=button name=MORE class=button1 value=More... onClick=javascript:window.open(\"/cgi-bin/more_client_list.asp\")>");
                html.push("</td>");
                html.push("</tr>");
                html.push("</table>");
        }

        document.getElementById(id).innerHTML = html.join('');
}


 </script>

</head>

<body style="background:#4acbd6;">
<FORM METHOD="POST" ACTION="/cgi-bin/Devicetable.asp" name="Devicetable">
<div id="pagestyle">
<div id="contenttype">
<div id="block1" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
        <tr height="25px" style="width:100%;background:#e6e6e6;">
                <td class="title-main" align=left style="padding-left:20px;">LAN Client List</td>
    </tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr>
 <td align=left class="tabdata" >
 <div class="configstyle">
<INPUT id="LeaseNumList" type="HIDDEN" name="LeaseNum" value="">
<script>
document.getElementById('LeaseNumList').value = lease_num;
</script>
<!-- <INPUT type="HIDDEN" name="LeaseNum" value=""> -->

 <div id=dhcpclientList style="overflow:auto;"></div>

                <script language=JavaScript>
var tableHeader = [
        ["6%","Index"],
        ["20%","Device Name"],
        ["16%","IP Address"],
        ["16%","MAC Address"],
        ["16%","Connection Type"],
        ["8%","Roaming"],
        ["16%","Expire Time"],
        ["2%",""]
];

var tableData = [
        ["1", entry0_hostname, entry0_ip, entry0_mac, entry0_interfacetype, entry0_80211v, entry0_expireday + "days " + "<br />" + entry0_expiretime],
        ["2", entry1_hostname, entry1_ip, entry1_mac, entry1_interfacetype, entry1_80211v, entry1_expireday + "days " + "<br />" + entry1_expiretime],
        ["3", entry2_hostname, entry2_ip, entry2_mac, entry2_interfacetype, entry2_80211v, entry2_expireday + "days " + "<br />" + entry2_expiretime],
        ["4", entry3_hostname, entry3_ip, entry3_mac, entry3_interfacetype, entry3_80211v, entry3_expireday + "days " + "<br />" + entry3_expiretime],
        ["5", entry4_hostname, entry4_ip, entry4_mac, entry4_interfacetype, entry4_80211v, entry4_expireday + "days " + "<br />" + entry4_expiretime],
        ["6", entry5_hostname, entry5_ip, entry5_mac, entry5_interfacetype, entry5_80211v, entry5_expireday + "days " + "<br />" + entry5_expiretime],
        ["7", entry6_hostname, entry6_ip, entry6_mac, entry6_interfacetype, entry6_80211v, entry6_expireday + "days " + "<br />" + entry6_expiretime],
        ["8", entry7_hostname, entry7_ip, entry7_mac, entry7_interfacetype, entry7_80211v, entry7_expireday + "days " + "<br />" + entry7_expiretime],
        ["9", entry8_hostname, entry8_ip, entry8_mac, entry8_interfacetype, entry8_80211v, entry8_expireday + "days " + "<br />" + entry8_expiretime],
        ["10", entry9_hostname, entry9_ip, entry9_mac, entry9_interfacetype, entry9_80211v, entry9_expireday + "days " + "<br />" + entry9_expiretime],
        ["11", entry10_hostname, entry10_ip, entry10_mac, entry10_interfacetype, entry10_80211v, entry10_expireday + "days " + "<br />" + entry10_expiretime],
        ["12", entry11_hostname, entry11_ip, entry11_mac, entry11_interfacetype, entry11_80211v, entry11_expireday + "days " + "<br />" + entry11_expiretime],
        ["13", entry12_hostname, entry12_ip, entry12_mac, entry12_interfacetype, entry12_80211v, entry12_expireday + "days " + "<br />" + entry12_expiretime],
        ["14", entry13_hostname, entry13_ip, entry13_mac, entry13_interfacetype, entry13_80211v, entry13_expireday + "days " + "<br />" + entry13_expiretime],
        ["15", entry14_hostname, entry14_ip, entry14_mac, entry14_interfacetype, entry14_80211v, entry14_expireday + "days " + "<br />" + entry14_expiretime],
        ["16", entry15_hostname, entry15_ip, entry15_mac, entry15_interfacetype, entry15_80211v, entry15_expireday + "days " + "<br />" + entry15_expiretime],
        ["17", entry16_hostname, entry16_ip, entry16_mac, entry16_interfacetype, entry16_80211v, entry16_expireday + "days " + "<br />" + entry16_expiretime],
        ["18", entry17_hostname, entry17_ip, entry17_mac, entry17_interfacetype, entry17_80211v, entry17_expireday + "days " + "<br />" + entry17_expiretime],
        ["19", entry18_hostname, entry18_ip, entry18_mac, entry18_interfacetype, entry18_80211v, entry18_expireday + "days " + "<br />" + entry18_expiretime],
        ["20", entry19_hostname, entry19_ip, entry19_mac, entry19_interfacetype, entry19_80211v, entry19_expireday + "days " + "<br />" + entry19_expiretime],
        ["21", entry20_hostname, entry20_ip, entry20_mac, entry20_interfacetype, entry20_80211v, entry20_expireday + "days " + "<br />" + entry20_expiretime],
        ["22", entry21_hostname, entry21_ip, entry21_mac, entry21_interfacetype, entry21_80211v, entry21_expireday + "days " + "<br />" + entry21_expiretime],
        ["23", entry22_hostname, entry22_ip, entry22_mac, entry22_interfacetype, entry22_80211v, entry22_expireday + "days " + "<br />" + entry22_expiretime],
        ["24", entry23_hostname, entry23_ip, entry23_mac, entry23_interfacetype, entry23_80211v, entry23_expireday + "days " + "<br />" + entry23_expiretime],
        ["25", entry24_hostname, entry24_ip, entry24_mac, entry24_interfacetype, entry24_80211v, entry24_expireday + "days " + "<br />" + entry24_expiretime],
        ["26", entry25_hostname, entry25_ip, entry25_mac, entry25_interfacetype, entry25_80211v, entry25_expireday + "days " + "<br />" + entry25_expiretime],
        ["27", entry26_hostname, entry26_ip, entry26_mac, entry26_interfacetype, entry26_80211v, entry26_expireday + "days " + "<br />" + entry26_expiretime],
        ["28", entry27_hostname, entry27_ip, entry27_mac, entry27_interfacetype, entry27_80211v, entry27_expireday + "days " + "<br />" + entry27_expiretime],
        ["29", entry28_hostname, entry28_ip, entry28_mac, entry28_interfacetype, entry28_80211v, entry28_expireday + "days " + "<br />" + entry28_expiretime],
        ["30", entry29_hostname, entry29_ip, entry29_mac, entry29_interfacetype, entry29_80211v, entry29_expireday + "days " + "<br />" + entry29_expiretime]
];

                showTable('dhcpclientList',tableHeader,tableData,2);
        </script>
</div>
</td>
</tr>
</table>
</div><!--id="block1" 12/11-->

<div id="button0" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
        <tr height="25px">
                <td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh device table</td>
        </tr>
</table>

<table width="620" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
<tr height="30px">
<td align=left class="tabdata" style="padding-left:20px;">
<input type="button" class="button1" onclick="Reload()" value="Refresh"></td>
</tr>
</table>
</div>
</div><!--id="contenttype"-->
</div><!--id="pagestyle"-->

                
 </FORM>
</body></html>
