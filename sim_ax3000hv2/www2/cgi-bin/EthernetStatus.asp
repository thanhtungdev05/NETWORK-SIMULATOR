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

<script language="JavaScript">
var port1_status='0';
var port2_status='0';
var port3_status='1';
var port4_status='0';
var port1_current_bitrate='0';
var port2_current_bitrate='0';
var port3_current_bitrate='1000';
var port4_current_bitrate='0';
var eth1_txpkts='0';
var eth2_txpkts='0';
var eth3_txpkts='4453';
var eth4_txpkts='0';
var eth1_rxpkts='0';
var eth2_rxpkts='0';
var eth3_rxpkts='3553';
var eth4_rxpkts='0';
var eth1_txcrc='0';
var eth1_rxcrc='0';
var eth2_txcrc='0';
var eth2_rxcrc='0';
var eth3_txcrc='0';
var eth3_rxcrc='0';
var eth4_txcrc='0';
var eth4_rxcrc='0';

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
        html.push("</tr>");
        // 2.generate table data
        for(var i =0; i<data.length; i++)
        {
                   if(data[i][keyIndex] != "N/A")
                 {
                        html.push("<tr height=30px>");
                        for(var j=0; j<data[i].length; j++)
                        {
							if(j == 1)
							{
								if(data[i][j] == "0")
									html.push("<td align=center class=topborderstyle>down</td>");
								else if (data[i][j] == "2")
									html.push("<td align=center class=topborderstyle>down(Loop detected)</td>");
								else
									html.push("<td align=center class=topborderstyle>up</td>");
							}
							else
                                html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");
                        }
                        html.push("</tr>");
                }
        }
        html.push("</table>");

        document.getElementById(id).innerHTML = html.join('');
}


 </script>

</head>

<body style="background:#4acbd6;">
<FORM METHOD="POST" ACTION="/cgi-bin/EthernetStatus.asp" name="Devicetable">
<div id="pagestyle">
<div id="contenttype">
<div id="block1" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
        <tr height="25px" style="width:100%;background:#e6e6e6;">
                <td class="title-main" align=left style="padding-left:20px;">Ethernet Status</td>
    </tr>
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr>
 <td align=left class="tabdata" >
 <div class="configstyle">

 <div id="ethernetstatus"></div>

                <script language=JavaScript>
var tableHeader = [
        ["8%","Port"],
        ["16%","Admin State"],
        ["20%","Connection Speed"],
        ["16%","Tx Packets"],
        ["16%","Rx Packets"],
        ["12%","Tx CRC"],
        ["12%","Rx CRC"]
];

var tableData = [
        ["1", port1_status,port1_current_bitrate,eth1_txpkts,eth1_rxpkts,eth1_rxcrc,eth1_txcrc],
        ["2", port2_status,port2_current_bitrate,eth2_txpkts,eth2_rxpkts,eth2_rxcrc,eth2_txcrc],
        ["3", port3_status,port3_current_bitrate,eth3_txpkts,eth3_rxpkts,eth3_rxcrc,eth3_txcrc],
        ["4", port4_status,port4_current_bitrate,eth4_txpkts,eth4_rxpkts,eth4_rxcrc,eth4_txcrc]

];

// var tableData = [
//         ["1", "","","",""],
//         ["2", "","","",""],
//         ["3", "","","",""],
//         ["4", "","","",""]

// ];

                showTable('ethernetstatus',tableHeader,tableData,1);
        </script>
</div>
</td>
</tr>
</table>
</div><!--id="block1" 12/11-->

<div id="button0" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
        <tr height="25px">
                <td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh Ethernet Status</td>
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
