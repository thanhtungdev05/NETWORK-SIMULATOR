
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<link rel="stylesheet" type="text/css" href="/style.css">

<style type="text/css">

.button_1
{
display:inline-block;
cursor:pointer;
color:#fff;
font:bold 15px Be Vietnam;
margin:10px 5px;
padding:3px 8px;
line-height:normal;
*overflow:visible ;
text-align:center;
text-decoration:none;
position:relative;
background:#00A9A7;
behavior:url(/PIE.htc);
border:1px solid #00A9A7;
outline:0;
}

#positionstyle
{
text-align:center;
}

#wrapper{
margin:20px auto;
width:660px;
background:#FFFFFF;
padding:10px 20px;
}

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


function showTable(id,header,data,keyIndex){
        var html = [""];
        html.push("<table id=client_list width=660 border=1 align=center cellpadding=1 cellspacing=0  bordercolor=#CCCCCC bgcolor=#FFFFFF>");

        // 1.generate table header
        html.push("<tr height=30px>");
        for(var i =0; i<header.length; i++){
                html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +"</font></strong>"+ "</td>");
        }
        html.push("</tr>");
        // 2.generate table data
        for(var i =0; i<data.length; i++){
                if(data[i][keyIndex] != "N/A" && data[i][keyIndex] != ""){
                        html.push("<tr height=30px>");
                        for(var j=0; j<data[i].length; j++){
                                html.push("<td align=center class=tabdata>" + data[i][j] + "</td>");
                        }
                        html.push("</tr>");
                }
        }
        html.push("</table>");
        if(parseInt(document.dchp_client_list.LeaseNum.value)>210)
        {
                html.push("<div id=positionstyle>");
                html.push("<input type=button name=MORE class=button_1 value=\" 1 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list.asp\'>");
                html.push("<input type=button name=MORE class=button_1 value=\" 2 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list_2.asp\'>");
                html.push("<input type=button name=MORE class=button_1 value=\" 3 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list_3.asp\'>");
                html.push("</div>");
        }
        else if(parseInt(document.dchp_client_list.LeaseNum.value)>110)
        {
                html.push("<div id=positionstyle>");
                html.push("<input type=button name=MORE class=button_1 value=\" 1 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list.asp\'>");
                html.push("<input type=button name=MORE class=button_1 value=\" 2 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list_2.asp\'>");
                html.push("</div>");
        }
        else
        {
                html.push("<div id=positionstyle>");
                html.push("<input type=button name=MORE class=button_1 value=\" 1 \" onClick=javascript:window.location=\'/cgi-bin/more_client_list.asp\'>");
                html.push("</div>");
        }
        document.getElementById(id).innerHTML = html.join('');
}
</script>

</head>
<body>
<FORM METHOD="POST" ACTION="/cgi-bin/more_client_list.asp" name="dchp_client_list">

<div id="wrapper">
<INPUT id="LeaseNumList" type="HIDDEN" name="LeaseNum" value="">
<script>
        document.getElementById('LeaseNumList').value = lease_num;
</script>
<!-- <INPUT type="HIDDEN" name="LeaseNum" value=""> -->
<table width="660px" border="0" style="table-layout: fixed;" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" id="uiViewBodyTable">
  
  <tr height="30px">
        <td class="title-main" align=left style="white-space:nowrap;">
        LAN Client List</td>
  </tr>  
  </table>
  
<table width="660" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr id="buttoncolor">
 <td align=left class="tabdata">
        <div id=dhcpclientList></div>
<script language=JavaScript>
var tableHeader = [
        ["6%", "Index"],
        ["22%", "Device Name"],
        ["16%", "IP Address"],
        ["16%", "MAC Address"],
        ["16%", "Connection Type"],
        ["8%", "Roaming"],
        ["16%", "Expire Time"]
];
var tableData = [
        ["31", entry30_hostname, entry30_ip, entry30_mac, entry30_interfacetype, entry30_80211v, entry30_expireday + "days " + "<br />" + entry30_expiretime],
        ["32", entry31_hostname, entry31_ip, entry31_mac, entry31_interfacetype, entry31_80211v, entry31_expireday + "days " + "<br />" + entry31_expiretime],
        ["33", entry32_hostname, entry32_ip, entry32_mac, entry32_interfacetype, entry32_80211v, entry32_expireday + "days " + "<br />" + entry32_expiretime],
        ["34", entry33_hostname, entry33_ip, entry33_mac, entry33_interfacetype, entry33_80211v, entry33_expireday + "days " + "<br />" + entry33_expiretime],
        ["35", entry34_hostname, entry34_ip, entry34_mac, entry34_interfacetype, entry34_80211v, entry34_expireday + "days " + "<br />" + entry34_expiretime],
        ["36", entry35_hostname, entry35_ip, entry35_mac, entry35_interfacetype, entry35_80211v, entry35_expireday + "days " + "<br />" + entry35_expiretime],
        ["37", entry36_hostname, entry36_ip, entry36_mac, entry36_interfacetype, entry36_80211v, entry36_expireday + "days " + "<br />" + entry36_expiretime],
        ["38", entry37_hostname, entry37_ip, entry37_mac, entry37_interfacetype, entry37_80211v, entry37_expireday + "days " + "<br />" + entry37_expiretime],
        ["39", entry38_hostname, entry38_ip, entry38_mac, entry38_interfacetype, entry38_80211v, entry38_expireday + "days " + "<br />" + entry38_expiretime],
        ["40", entry39_hostname, entry39_ip, entry39_mac, entry39_interfacetype, entry39_80211v, entry39_expireday + "days " + "<br />" + entry39_expiretime],
        ["41", entry40_hostname, entry40_ip, entry40_mac, entry40_interfacetype, entry40_80211v, entry40_expireday + "days " + "<br />" + entry40_expiretime],
        ["42", entry41_hostname, entry41_ip, entry41_mac, entry41_interfacetype, entry41_80211v, entry41_expireday + "days " + "<br />" + entry41_expiretime],
        ["43", entry42_hostname, entry42_ip, entry42_mac, entry42_interfacetype, entry42_80211v, entry42_expireday + "days " + "<br />" + entry42_expiretime],
        ["44", entry43_hostname, entry43_ip, entry43_mac, entry43_interfacetype, entry43_80211v, entry43_expireday + "days " + "<br />" + entry43_expiretime],
        ["45", entry44_hostname, entry44_ip, entry44_mac, entry44_interfacetype, entry44_80211v, entry44_expireday + "days " + "<br />" + entry44_expiretime],
        ["46", entry45_hostname, entry45_ip, entry45_mac, entry45_interfacetype, entry45_80211v, entry45_expireday + "days " + "<br />" + entry45_expiretime],
        ["47", entry46_hostname, entry46_ip, entry46_mac, entry46_interfacetype, entry46_80211v, entry46_expireday + "days " + "<br />" + entry46_expiretime],
        ["48", entry47_hostname, entry47_ip, entry47_mac, entry47_interfacetype, entry47_80211v, entry47_expireday + "days " + "<br />" + entry47_expiretime],
        ["49", entry48_hostname, entry48_ip, entry48_mac, entry48_interfacetype, entry48_80211v, entry48_expireday + "days " + "<br />" + entry48_expiretime],
        ["50", entry49_hostname, entry49_ip, entry49_mac, entry49_interfacetype, entry49_80211v, entry49_expireday + "days " + "<br />" + entry49_expiretime],
        ["51", entry50_hostname, entry50_ip, entry50_mac, entry50_interfacetype, entry50_80211v, entry50_expireday + "days " + "<br />" + entry50_expiretime],
        ["52", entry51_hostname, entry51_ip, entry51_mac, entry51_interfacetype, entry51_80211v, entry51_expireday + "days " + "<br />" + entry51_expiretime],
        ["53", entry52_hostname, entry52_ip, entry52_mac, entry52_interfacetype, entry52_80211v, entry52_expireday + "days " + "<br />" + entry52_expiretime],
        ["54", entry53_hostname, entry53_ip, entry53_mac, entry53_interfacetype, entry53_80211v, entry53_expireday + "days " + "<br />" + entry53_expiretime],
        ["55", entry54_hostname, entry54_ip, entry54_mac, entry54_interfacetype, entry54_80211v, entry54_expireday + "days " + "<br />" + entry54_expiretime],
        ["56", entry55_hostname, entry55_ip, entry55_mac, entry55_interfacetype, entry55_80211v, entry55_expireday + "days " + "<br />" + entry55_expiretime],
        ["57", entry56_hostname, entry56_ip, entry56_mac, entry56_interfacetype, entry56_80211v, entry56_expireday + "days " + "<br />" + entry56_expiretime],
        ["58", entry57_hostname, entry57_ip, entry57_mac, entry57_interfacetype, entry57_80211v, entry57_expireday + "days " + "<br />" + entry57_expiretime],
        ["59", entry58_hostname, entry58_ip, entry58_mac, entry58_interfacetype, entry58_80211v, entry58_expireday + "days " + "<br />" + entry58_expiretime],
        ["60", entry59_hostname, entry59_ip, entry59_mac, entry59_interfacetype, entry59_80211v, entry59_expireday + "days " + "<br />" + entry59_expiretime],
        ["61", entry60_hostname, entry60_ip, entry60_mac, entry60_interfacetype, entry60_80211v, entry60_expireday + "days " + "<br />" + entry60_expiretime],
        ["62", entry61_hostname, entry61_ip, entry61_mac, entry61_interfacetype, entry61_80211v, entry61_expireday + "days " + "<br />" + entry61_expiretime],
        ["63", entry62_hostname, entry62_ip, entry62_mac, entry62_interfacetype, entry62_80211v, entry62_expireday + "days " + "<br />" + entry62_expiretime],
        ["64", entry63_hostname, entry63_ip, entry63_mac, entry63_interfacetype, entry63_80211v, entry63_expireday + "days " + "<br />" + entry63_expiretime],
        ["65", entry64_hostname, entry64_ip, entry64_mac, entry64_interfacetype, entry64_80211v, entry64_expireday + "days " + "<br />" + entry64_expiretime],
        ["66", entry65_hostname, entry65_ip, entry65_mac, entry65_interfacetype, entry65_80211v, entry65_expireday + "days " + "<br />" + entry65_expiretime],
        ["67", entry66_hostname, entry66_ip, entry66_mac, entry66_interfacetype, entry66_80211v, entry66_expireday + "days " + "<br />" + entry66_expiretime],
        ["68", entry67_hostname, entry67_ip, entry67_mac, entry67_interfacetype, entry67_80211v, entry67_expireday + "days " + "<br />" + entry67_expiretime],
        ["69", entry68_hostname, entry68_ip, entry68_mac, entry68_interfacetype, entry68_80211v, entry68_expireday + "days " + "<br />" + entry68_expiretime],
        ["70", entry69_hostname, entry69_ip, entry69_mac, entry69_interfacetype, entry69_80211v, entry69_expireday + "days " + "<br />" + entry69_expiretime],
        ["71", entry70_hostname, entry70_ip, entry70_mac, entry70_interfacetype, entry70_80211v, entry70_expireday + "days " + "<br />" + entry70_expiretime],
        ["72", entry71_hostname, entry71_ip, entry71_mac, entry71_interfacetype, entry71_80211v, entry71_expireday + "days " + "<br />" + entry71_expiretime],
        ["73", entry72_hostname, entry72_ip, entry72_mac, entry72_interfacetype, entry72_80211v, entry72_expireday + "days " + "<br />" + entry72_expiretime],
        ["74", entry73_hostname, entry73_ip, entry73_mac, entry73_interfacetype, entry73_80211v, entry73_expireday + "days " + "<br />" + entry73_expiretime],
        ["75", entry74_hostname, entry74_ip, entry74_mac, entry74_interfacetype, entry74_80211v, entry74_expireday + "days " + "<br />" + entry74_expiretime],
        ["76", entry75_hostname, entry75_ip, entry75_mac, entry75_interfacetype, entry75_80211v, entry75_expireday + "days " + "<br />" + entry75_expiretime],
        ["77", entry76_hostname, entry76_ip, entry76_mac, entry76_interfacetype, entry76_80211v, entry76_expireday + "days " + "<br />" + entry76_expiretime],
        ["78", entry77_hostname, entry77_ip, entry77_mac, entry77_interfacetype, entry77_80211v, entry77_expireday + "days " + "<br />" + entry77_expiretime],
        ["79", entry78_hostname, entry78_ip, entry78_mac, entry78_interfacetype, entry78_80211v, entry78_expireday + "days " + "<br />" + entry78_expiretime],
        ["80", entry79_hostname, entry79_ip, entry79_mac, entry79_interfacetype, entry79_80211v, entry79_expireday + "days " + "<br />" + entry79_expiretime],
        ["81", entry80_hostname, entry80_ip, entry80_mac, entry80_interfacetype, entry80_80211v, entry80_expireday + "days " + "<br />" + entry80_expiretime],
        ["82", entry81_hostname, entry81_ip, entry81_mac, entry81_interfacetype, entry81_80211v, entry81_expireday + "days " + "<br />" + entry81_expiretime],
        ["83", entry82_hostname, entry82_ip, entry82_mac, entry82_interfacetype, entry82_80211v, entry82_expireday + "days " + "<br />" + entry82_expiretime],
        ["84", entry83_hostname, entry83_ip, entry83_mac, entry83_interfacetype, entry83_80211v, entry83_expireday + "days " + "<br />" + entry83_expiretime],
        ["85", entry84_hostname, entry84_ip, entry84_mac, entry84_interfacetype, entry84_80211v, entry84_expireday + "days " + "<br />" + entry84_expiretime],
        ["86", entry85_hostname, entry85_ip, entry85_mac, entry85_interfacetype, entry85_80211v, entry85_expireday + "days " + "<br />" + entry85_expiretime],
        ["87", entry86_hostname, entry86_ip, entry86_mac, entry86_interfacetype, entry86_80211v, entry86_expireday + "days " + "<br />" + entry86_expiretime],
        ["88", entry87_hostname, entry87_ip, entry87_mac, entry87_interfacetype, entry87_80211v, entry87_expireday + "days " + "<br />" + entry87_expiretime],
        ["89", entry88_hostname, entry88_ip, entry88_mac, entry88_interfacetype, entry88_80211v, entry88_expireday + "days " + "<br />" + entry88_expiretime],
        ["90", entry89_hostname, entry89_ip, entry89_mac, entry89_interfacetype, entry89_80211v, entry89_expireday + "days " + "<br />" + entry89_expiretime],
        ["91", entry90_hostname, entry90_ip, entry90_mac, entry90_interfacetype, entry90_80211v, entry90_expireday + "days " + "<br />" + entry90_expiretime],
        ["92", entry91_hostname, entry91_ip, entry91_mac, entry91_interfacetype, entry91_80211v, entry91_expireday + "days " + "<br />" + entry91_expiretime],
        ["93", entry92_hostname, entry92_ip, entry92_mac, entry92_interfacetype, entry92_80211v, entry92_expireday + "days " + "<br />" + entry92_expiretime],
        ["94", entry93_hostname, entry93_ip, entry93_mac, entry93_interfacetype, entry93_80211v, entry93_expireday + "days " + "<br />" + entry93_expiretime],
        ["95", entry94_hostname, entry94_ip, entry94_mac, entry94_interfacetype, entry94_80211v, entry94_expireday + "days " + "<br />" + entry94_expiretime],
        ["96", entry95_hostname, entry95_ip, entry95_mac, entry95_interfacetype, entry95_80211v, entry95_expireday + "days " + "<br />" + entry95_expiretime],
        ["97", entry96_hostname, entry96_ip, entry96_mac, entry96_interfacetype, entry96_80211v, entry96_expireday + "days " + "<br />" + entry96_expiretime],
        ["98", entry97_hostname, entry97_ip, entry97_mac, entry97_interfacetype, entry97_80211v, entry97_expireday + "days " + "<br />" + entry97_expiretime],
        ["99", entry98_hostname, entry98_ip, entry98_mac, entry98_interfacetype, entry98_80211v, entry98_expireday + "days " + "<br />" + entry98_expiretime],
        ["100", entry99_hostname, entry99_ip, entry99_mac, entry99_interfacetype, entry99_80211v, entry99_expireday + "days " + "<br />" + entry99_expiretime],
        ["101", entry100_hostname, entry100_ip, entry100_mac, entry100_interfacetype, entry100_80211v, entry100_expireday + "days " + "<br />" + entry100_expiretime],
        ["102", entry101_hostname, entry101_ip, entry101_mac, entry101_interfacetype, entry101_80211v, entry101_expireday + "days " + "<br />" + entry101_expiretime],
        ["103", entry102_hostname, entry102_ip, entry102_mac, entry102_interfacetype, entry102_80211v, entry102_expireday + "days " + "<br />" + entry102_expiretime],
        ["104", entry103_hostname, entry103_ip, entry103_mac, entry103_interfacetype, entry103_80211v, entry103_expireday + "days " + "<br />" + entry103_expiretime],
        ["105", entry104_hostname, entry104_ip, entry104_mac, entry104_interfacetype, entry104_80211v, entry104_expireday + "days " + "<br />" + entry104_expiretime],
        ["106", entry105_hostname, entry105_ip, entry105_mac, entry105_interfacetype, entry105_80211v, entry105_expireday + "days " + "<br />" + entry105_expiretime],
        ["107", entry106_hostname, entry106_ip, entry106_mac, entry106_interfacetype, entry106_80211v, entry106_expireday + "days " + "<br />" + entry106_expiretime],
        ["108", entry107_hostname, entry107_ip, entry107_mac, entry107_interfacetype, entry107_80211v, entry107_expireday + "days " + "<br />" + entry107_expiretime],
        ["109", entry108_hostname, entry108_ip, entry108_mac, entry108_interfacetype, entry108_80211v, entry108_expireday + "days " + "<br />" + entry108_expiretime],
        ["110", entry109_hostname, entry109_ip, entry109_mac, entry109_interfacetype, entry109_80211v, entry109_expireday + "days " + "<br />" + entry109_expiretime]
];

                showTable('dhcpclientList',tableHeader,tableData,2);
                </script>
</td>
</tr>
</table>
</div>
</form>
</body>
</html>
