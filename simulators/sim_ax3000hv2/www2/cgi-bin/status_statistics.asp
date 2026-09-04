
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<script type='text/javascript' src="/jsl.js" tppabs="http://192.168.1.1/js/jsl.js"></script>
<link rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">
*{color:  #404040;}
</style>

<script language="JavaScript">
var wlan_tx_frames ='0';
var wlan_rx_frames ='0';
var wlan_tx_errframes ='0';
var wlan_rx_errframes ='200642';
var wlan_tx_dropframes ='0';
var wlan_rx_dropframes ='200642';
var tx_bytes ='0';
var rx_bytes ='0';
var wlan11ac_tx_frames ='0';
var wlan11ac_rx_frames ='0';
var wlan11ac_tx_errframes ='0';
var wlan11ac_rx_errframes ='123610';
var wlan11ac_tx_dropframes ='0';
var wlan11ac_rx_dropframes ='123610';
var wlan11ac_tx_bytes ='0';
var wlan11ac_rx_bytes ='0';
var statis_type='';
var out_pkts='2';
var in_pkts='3';
var out_discards='4';
var in_discards='5';
var data_rate_down='6';
var data_rate_up='7';
var snr_margin_down='8';
var snr_margin_up='9';
var atten_down='10';
var atten_up='11';
var power_down='12';
var power_up='13';
var crc_down='14';
var crc_up='15';
var wlan_tx_packets='16';
var wlan_rx_packets='17';
var wlan_tx_bytes='18';
var wlan_rx_bytes='19';
var wlan11ac_tx_packets='24';
var wlan11ac_rx_packets='25';
var tx_frames='3901';
var rx_frames='3477';
var out_multicast_pkts='342';
var in_multicast_pkts='319';
var out_octets='1387181';
var in_octets='606631';
var tx_collision_cnt='0';
var rx_crc_err='0';
var out_errors='0';
var tx_under_runcnt='0';
var tx_frame_cnt='0';
var rx_frame_cnt='0';
var tx_frame_len='0';
var rx_frame_len='0';
var tx_multicast_cnt='0';
var rx_multicast_cnt='0';
var tx_broadcast_cnt='0';
var rx_broadcast_cnt='0';
var tx_drop_cnt='0';
var rx_crc_cnt='0';
var tx_less64_cnt='0';
var rx_less64_cnt='0';



function Reload(){
window.location.reload();

}
</script>

</head><body style="background:#4acbd6;">
<FORM METHOD="POST" ACTION="/cgi-bin/status_statistics.asp" name="Stat_Form">
<div id="pagestyle">
<div id="contenttype">

<div id="block1" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">

<tr height="25px" style="width:100%;background:#e6e6e6;">
<td width="250px" align=left class="title-main" style="padding-left:20px;">Traffic Statistics</td>
</tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
<tr height="30px">
<td width="20px">&nbsp; </td>
<td width="250px" align=left class="tabdata" style="font-size:13px;">Interface</td>
<td align=left class="tabdata">

<select name="Stat_Radio" size="1" onchange="document.Stat_Form.submit()">

<script>
        var statisticsEthernetText = "Ethernet";
        document.write('<option value="1" ' + (statis_type === '1' ? 'selected' : '') + '>' + statisticsEthernetText + '</option>');
</script>
<!-- <option value="0" >Ethernet -->

<script>
        var StatisticsWLANText = "WLAN 2.4G";
        document.write('<option value="2" ' + (statis_type === '2' ? 'selected' : '') + '>' + StatisticsWLANText + '</option>');
</script>
<!-- 
 -->

<script>
        var Statistics5gWLANText = "WLAN 5G";
        document.write('<option value="3" ' + (statis_type === '3' ? 'selected' : '') + '>' + Statistics5gWLANText + '</option>');
</script>
<!-- 
 -->

<script>
        var StatisticsPonText = "PON";
        document.write('<option value="4" ' + (statis_type === '4' ? 'selected' : '') + '>' + StatisticsPonText + '</option>');
</script>
<!-- <option value="4" >PON -->
</select>
</td>
</tr>

<tr>
<td colspan="3" align=center style="padding-top:20px;padding-bottom:20px;">
<table width="560" border="1" cellpadding="0" cellspacing="0" bordercolor="#cccccc" bgcolor="#FFFFFF">
               <tr class="tabdata">
        <td width="190" class="model"><div align=center> Transmit Statistics </div></td>
                <td width="110">&nbsp;</td>
        <td width="190" class="model"><div align=center>Receive Statistics </div></td>
                <td>&nbsp;</td>
                </tr>

<script>
window.onload = function()
{
if(statis_type == "4")
{
        document.getElementById('statis_type4').style.display = '';
}
else if(statis_type == "2")
{
        document.getElementById('statis_type2').style.display = '';
}
else if(statis_type == "3")
{
        document.getElementById('statis_type3').style.display = '';
}
else
{
        document.getElementById('statis_type1').style.display = '';
}
}
</script>

<tbody id = statis_type2 style="display: none;">
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Tx Frames Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan_tx_frames + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Frames Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan_rx_frames + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
				<!--<tr>
                        <td class='tabdata'>&nbsp;&nbsp;Tx Packets Count</td><td class='tabdata'><div align='center'></div></td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Packets Count</td><td class='tabdata'><div align='center'></div></td></tr>
                <tr>-->
                        <td class='tabdata'>&nbsp;&nbsp;Tx Bytes Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + tx_bytes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Bytes Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + rx_bytes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>

                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Tx Errors Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan_tx_errframes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Errors Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan_rx_errframes + '</div>');
                        </script>
                        <div align='center'></div>
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Tx Drops Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan_tx_dropframes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Drops Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan_rx_dropframes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
</tbody>

<tbody id = statis_type3 style="display: none;">
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Tx Packets Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan11ac_tx_frames + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Packets Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan11ac_rx_frames + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Tx Bytes Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan11ac_tx_bytes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Bytes Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan11ac_rx_bytes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Tx Errors Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan11ac_tx_errframes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Errors Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan11ac_rx_errframes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Tx Drops Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan11ac_tx_dropframes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Drops Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + wlan11ac_rx_dropframes + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
</tbody>

<tbody id = statis_type4 style="display: none;">
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Tx Packets Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + tx_frame_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Packets Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + rx_frame_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Tx Bytes Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + tx_frame_len + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Rx Bytes Count</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + rx_frame_len + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Transmit Multicast Frames</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + tx_multicast_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Receive Multicast Frame</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + rx_multicast_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Transmit Broadcast Frames</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + tx_broadcast_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Receive Broadcast Frame</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + rx_broadcast_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Transmit Collision</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + tx_drop_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Receive CRC Errors</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + rx_crc_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Transmit Under-size Frames</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + tx_less64_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Receive Under-size Frames</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + rx_less64_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
</tbody>

<tbody id = statis_type1 style="display: none;">
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Transmit Frames</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + tx_frames + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Receive Frames</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + rx_frames + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Transmit Multicast Frames</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + out_multicast_pkts + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Receive Multicast Frame</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + in_multicast_pkts + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Transmit total Bytes</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + out_octets + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Receive total Bytes</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + in_octets + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Transmit Collision</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + tx_collision_cnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Receive CRC Errors</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + rx_crc_err + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
                <tr>
                        <td class='tabdata'>&nbsp;&nbsp;Transmit Error Frames</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + out_errors + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td>
                        <td class='tabdata'>&nbsp;&nbsp;Receive Under-size Frames</td><td class='tabdata'>
                        <script>
                        document.write('<div align="center">' + tx_under_runcnt + '</div>');
                        </script>
                        <!-- <div align='center'></div> -->
                        </td></tr>
</tbody>
</table></td>
</tr>
</table>
</div>

<div id="button0" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
        <tr height="25px">
                <td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh traffic statistics</td>
        </tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF">
<tr height="30px">
<td align=left class="tabdata" style="padding-left:20px;">
<INPUT TYPE="button"  NAME="StatRefresh" class="button1" onclick="Reload()" VALUE="Refresh">
              
</td>
</tr>
</table>
</div>
</div><!--id="contenttype"-->
</div>

        
</form></body></html>
