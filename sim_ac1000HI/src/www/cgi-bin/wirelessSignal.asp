<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" dir="ltr" lang="utf-8">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=11;IE=10;IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<meta http-equiv=Content-Type content="text/html; charset=UTF-8">
<script language="JavaScript" src="OutVariant.asp"></script>
<script language="JavaScript" src="/general.js"></script>
<script language="JavaScript" src="/jsl.js"></script>
<script language="JavaScript" src="/ip.js"></script>
<link rel="stylesheet" type="text/css" href="/style.css">
<style  type="text/css">
*{color:  #404040;}
</style>

<script language="JavaScript">
function Reload(){
window.location.reload();

}

var lanHostTableData = [
["Admin-PC","192.168.1.2","D8:43:AE:2E:65:45"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"],
["N/A","N/A","N/A"]
];

var wifiMacTabData = [
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],	
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"],
["N/A","N/A","N/A","N/A"]
];

var hostNameTable2 = [];
var IPTable2 = [];
var hostNameTable5 = [];
var IPTable5 = [];
//var wifiHostNum = "0";
//var cnt = 0;

function getHostNameAndIPTable()
{
	for(var i =0; i<wifiMacTabData.length; i++)
	{
		var mac = wifiMacTabData[i][0];
		var band = wifiMacTabData[i][1];
		if(mac == "N/A" || band == "N/A")
		{
			hostNameTable2[i] = "N/A";
			IPTable2[i] = "N/A";
			hostNameTable5[i] = "N/A";
			IPTable5[i] = "N/A";
			continue;
		}
		
		for(var j =0; j<lanHostTableData.length; j++)
		{
		    if (lanHostTableData[j][1] == "N/A")
		    {
				hostNameTable2[i] = "N/A";
				IPTable2[i] = "N/A";
				hostNameTable5[i] = "N/A";
				IPTable5[i] = "N/A";
		        continue;
		    }
			if(mac.toLowerCase() == lanHostTableData[j][2].toLowerCase())
			{
				if(band == "0")
				{
					hostNameTable2[i] = lanHostTableData[j][0];
					IPTable2[i] = lanHostTableData[j][1];
					hostNameTable5[i] = "N/A";
					IPTable5[i] = "N/A";
					//cnt = cnt + 1;
				}
				else
				{
					hostNameTable2[i] = "N/A";
					IPTable2[i] = "N/A";
					hostNameTable5[i] = lanHostTableData[j][0];
					IPTable5[i] = lanHostTableData[j][1];
					//cnt = cnt + 1;
				}
				break;
			}
		}
		//if(cnt == parseInt(wifiHostNum))
		//	break;
	}
}
		
function showTable0(id,header,data,keyIndex){
        var index = 1;
        var html = ["<table id=client_list border=0  cellpadding=1 cellspacing=0>"];

        // 1.generate table header
        html.push("<tr height=30px>");
        for(var i =0; i<header.length; i++){
                html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +" </strong>"+ "</td>");
        }
        html.push("</tr>");
        // 2.generate table data
        for(var i =0; i<data.length; i++){
                if(data[i][keyIndex] != "N/A"){
                        html.push("<tr height=30px>");
						html.push("<td align=center class=topborderstyle>" + index + "</td>");
                        index = index + 1;
                        for(var j=1; j<data[i].length; j++){
                                html.push("<td align=center class=topborderstyle>" + data[i][j] + "</td>");
                        }
                        html.push("</tr>");
                }
        }
        html.push("</table>");
        
        document.getElementById(id).innerHTML = html.join('');
}


function showTable1(id,header,data,keyIndex){
        var index = 1;
        var html = ["<table id=client_list border=0  cellpadding=1 cellspacing=0>"];

        // 1.generate table header
        html.push("<tr height=30px>");
        for(var i =0; i<header.length; i++){
                html.push("<td width=" + header[i][0] + " align=center class=tabdata>" +"<STRONG><FONT color=#000000>"+ header[i][1] +" </strong>"+ "</td>");
        }
        html.push("</tr>");
        // 2.generate table data
        for(var i =0; i<data.length; i++){
                if(data[i][keyIndex] != "N/A"){
                        html.push("<tr height=30px>");
                        html.push("<td align=center class=topborderstyle>" + index + "</td>");
                        index = index + 1;
                        for(var j=1; j<data[i].length; j++){
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
<FORM METHOD="POST" ACTION="/cgi-bin/Devicetable.asp" name="Devicetable">
<div id="pagestyle">
<div id="contenttype">
<div id="block1" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
        <tr height="25px" style="width:100%;background:#e6e6e6;">  
                <td class="title-main" align=left style="padding-left:20px;">Wireless 2.4G RSSI Information</td>
    </tr>        
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr>
 <td align=left class="tabdata">
 <div class="configstyle">
 <INPUT type="HIDDEN" name="WIFILeaseNum" value="0">
 <div id="RSSI2"></div>
        <script language=JavaScript>
        var tableHeader = [
        ["8%","Index"],
        ["22%","Device Name"],
        ["18%","IP Address"],
        ["24%","MAC Address"],
        ["14%","RSSI1"],
        ["14%","RSSI2"]
        ];
		
		getHostNameAndIPTable();

        var tableData = [
        ["1", hostNameTable2[0],IPTable2[0],wifiMacTabData[0][0],wifiMacTabData[0][2],wifiMacTabData[0][3]],
        ["2", hostNameTable2[1],IPTable2[1],wifiMacTabData[1][0],wifiMacTabData[1][2],wifiMacTabData[1][3]],
        ["3", hostNameTable2[2],IPTable2[2],wifiMacTabData[2][0],wifiMacTabData[2][2],wifiMacTabData[2][3]],
        ["4", hostNameTable2[3],IPTable2[3],wifiMacTabData[3][0],wifiMacTabData[3][2],wifiMacTabData[3][3]],
        ["5", hostNameTable2[4],IPTable2[4],wifiMacTabData[4][0],wifiMacTabData[4][2],wifiMacTabData[4][3]],
        ["6", hostNameTable2[5],IPTable2[5],wifiMacTabData[5][0],wifiMacTabData[5][2],wifiMacTabData[5][3]],
        ["7", hostNameTable2[6],IPTable2[6],wifiMacTabData[6][0],wifiMacTabData[6][2],wifiMacTabData[6][3]],
        ["8", hostNameTable2[7],IPTable2[7],wifiMacTabData[7][0],wifiMacTabData[7][2],wifiMacTabData[7][3]],
        ["9", hostNameTable2[8],IPTable2[8],wifiMacTabData[8][0],wifiMacTabData[8][2],wifiMacTabData[8][3]],
        ["10", hostNameTable2[9],IPTable2[9],wifiMacTabData[9][0],wifiMacTabData[9][2],wifiMacTabData[9][3]],
        ["11", hostNameTable2[10],IPTable2[10],wifiMacTabData[10][0],wifiMacTabData[10][2],wifiMacTabData[10][3]],
        ["12", hostNameTable2[11],IPTable2[11],wifiMacTabData[11][0],wifiMacTabData[11][2],wifiMacTabData[11][3]],
        ["13", hostNameTable2[12],IPTable2[12],wifiMacTabData[12][0],wifiMacTabData[12][2],wifiMacTabData[12][3]],
        ["14", hostNameTable2[13],IPTable2[13],wifiMacTabData[13][0],wifiMacTabData[13][2],wifiMacTabData[13][3]],
        ["15", hostNameTable2[14],IPTable2[14],wifiMacTabData[14][0],wifiMacTabData[14][2],wifiMacTabData[14][3]],
        ["16", hostNameTable2[15],IPTable2[15],wifiMacTabData[15][0],wifiMacTabData[15][2],wifiMacTabData[15][3]],
        ["17", hostNameTable2[16],IPTable2[16],wifiMacTabData[16][0],wifiMacTabData[16][2],wifiMacTabData[16][3]],
        ["18", hostNameTable2[17],IPTable2[17],wifiMacTabData[17][0],wifiMacTabData[17][2],wifiMacTabData[17][3]],
        ["19", hostNameTable2[18],IPTable2[18],wifiMacTabData[18][0],wifiMacTabData[18][2],wifiMacTabData[18][3]],
        ["20", hostNameTable2[19],IPTable2[19],wifiMacTabData[19][0],wifiMacTabData[19][2],wifiMacTabData[19][3]],
        ["21", hostNameTable2[20],IPTable2[20],wifiMacTabData[20][0],wifiMacTabData[20][2],wifiMacTabData[20][3]],
        ["22", hostNameTable2[21],IPTable2[21],wifiMacTabData[21][0],wifiMacTabData[21][2],wifiMacTabData[21][3]],
        ["23", hostNameTable2[22],IPTable2[22],wifiMacTabData[22][0],wifiMacTabData[22][2],wifiMacTabData[22][3]],
        ["24", hostNameTable2[23],IPTable2[23],wifiMacTabData[23][0],wifiMacTabData[23][2],wifiMacTabData[23][3]],
        ["25", hostNameTable2[24],IPTable2[24],wifiMacTabData[24][0],wifiMacTabData[24][2],wifiMacTabData[24][3]],
        ["26", hostNameTable2[25],IPTable2[25],wifiMacTabData[25][0],wifiMacTabData[25][2],wifiMacTabData[25][3]],
        ["27", hostNameTable2[26],IPTable2[26],wifiMacTabData[26][0],wifiMacTabData[26][2],wifiMacTabData[26][3]],
        ["28", hostNameTable2[27],IPTable2[27],wifiMacTabData[27][0],wifiMacTabData[27][2],wifiMacTabData[27][3]],
        ["29", hostNameTable2[28],IPTable2[28],wifiMacTabData[28][0],wifiMacTabData[28][2],wifiMacTabData[28][3]],
        ["30", hostNameTable2[29],IPTable2[29],wifiMacTabData[29][0],wifiMacTabData[29][2],wifiMacTabData[29][3]],
        ["31", hostNameTable2[30],IPTable2[30],wifiMacTabData[30][0],wifiMacTabData[30][2],wifiMacTabData[30][3]],
        ["32", hostNameTable2[31],IPTable2[31],wifiMacTabData[31][0],wifiMacTabData[31][2],wifiMacTabData[31][3]]
        ];

                showTable0('RSSI2',tableHeader,tableData,2);
        </script>
</div>
</td>
</tr>    
</table>
</div><!--id="block1" 12/11-->

<div id="block1" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;margin:5px 0;">
        <tr height="25px" style="width:100%;background:#e6e6e6;">    
                <td class="title-main" align=left style="padding-left:20px;"> Wireless 5G RSSI Information</td>
    </tr>        
</table>

<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="table-layout: fixed;">
 <tr>
 <td align=left class="tabdata">
 <div class="configstyle">
 <INPUT type="HIDDEN" name="WIFI5GLeaseNum" value="0">
 <div id="RSSI5"></div>
        <script language=JavaScript>
        var tableHeader5g = [
        ["8%","Index"],
        ["22%","Device Name"],
        ["18%","IP Address"],
        ["24%","MAC Address"],
        ["14%","RSSI1"],
        ["14%","RSSI2"]
        ];
		
        var tableData5g = [
        ["1", hostNameTable5[0],IPTable5[0],wifiMacTabData[0][0],wifiMacTabData[0][2],wifiMacTabData[0][3]],
        ["2", hostNameTable5[1],IPTable5[1],wifiMacTabData[1][0],wifiMacTabData[1][2],wifiMacTabData[1][3]],
        ["3", hostNameTable5[2],IPTable5[2],wifiMacTabData[2][0],wifiMacTabData[2][2],wifiMacTabData[2][3]],
        ["4", hostNameTable5[3],IPTable5[3],wifiMacTabData[3][0],wifiMacTabData[3][2],wifiMacTabData[3][3]],
        ["5", hostNameTable5[4],IPTable5[4],wifiMacTabData[4][0],wifiMacTabData[4][2],wifiMacTabData[4][3]],
        ["6", hostNameTable5[5],IPTable5[5],wifiMacTabData[5][0],wifiMacTabData[5][2],wifiMacTabData[5][3]],
        ["7", hostNameTable5[6],IPTable5[6],wifiMacTabData[6][0],wifiMacTabData[6][2],wifiMacTabData[6][3]],
        ["8", hostNameTable5[7],IPTable5[7],wifiMacTabData[7][0],wifiMacTabData[7][2],wifiMacTabData[7][3]],
        ["9", hostNameTable5[8],IPTable5[8],wifiMacTabData[8][0],wifiMacTabData[8][2],wifiMacTabData[8][3]],
        ["10", hostNameTable5[9],IPTable5[9],wifiMacTabData[9][0],wifiMacTabData[9][2],wifiMacTabData[9][3]],
        ["11", hostNameTable5[10],IPTable5[10],wifiMacTabData[10][0],wifiMacTabData[10][2],wifiMacTabData[10][3]],
        ["12", hostNameTable5[11],IPTable5[11],wifiMacTabData[11][0],wifiMacTabData[12][2],wifiMacTabData[12][3]],
        ["13", hostNameTable5[12],IPTable5[12],wifiMacTabData[12][0],wifiMacTabData[12][2],wifiMacTabData[12][3]],
        ["14", hostNameTable5[13],IPTable5[13],wifiMacTabData[13][0],wifiMacTabData[13][2],wifiMacTabData[13][3]],
        ["15", hostNameTable5[14],IPTable5[14],wifiMacTabData[14][0],wifiMacTabData[14][2],wifiMacTabData[14][3]],
        ["16", hostNameTable5[15],IPTable5[15],wifiMacTabData[15][0],wifiMacTabData[15][2],wifiMacTabData[15][3]],
        ["17", hostNameTable5[16],IPTable5[16],wifiMacTabData[16][0],wifiMacTabData[16][2],wifiMacTabData[16][3]],
        ["18", hostNameTable5[17],IPTable5[17],wifiMacTabData[17][0],wifiMacTabData[17][2],wifiMacTabData[17][3]],
        ["19", hostNameTable5[18],IPTable5[18],wifiMacTabData[18][0],wifiMacTabData[18][2],wifiMacTabData[18][3]],
        ["20", hostNameTable5[19],IPTable5[19],wifiMacTabData[19][0],wifiMacTabData[19][2],wifiMacTabData[19][3]],
        ["21", hostNameTable5[20],IPTable5[20],wifiMacTabData[20][0],wifiMacTabData[20][2],wifiMacTabData[20][3]],
        ["22", hostNameTable5[21],IPTable5[21],wifiMacTabData[21][0],wifiMacTabData[21][2],wifiMacTabData[21][3]],
        ["23", hostNameTable5[22],IPTable5[22],wifiMacTabData[22][0],wifiMacTabData[22][2],wifiMacTabData[22][3]],
        ["24", hostNameTable5[23],IPTable5[23],wifiMacTabData[23][0],wifiMacTabData[23][2],wifiMacTabData[23][3]],
        ["25", hostNameTable5[24],IPTable5[24],wifiMacTabData[24][0],wifiMacTabData[24][2],wifiMacTabData[24][3]],
        ["26", hostNameTable5[25],IPTable5[25],wifiMacTabData[25][0],wifiMacTabData[25][2],wifiMacTabData[25][3]],
        ["27", hostNameTable5[26],IPTable5[26],wifiMacTabData[26][0],wifiMacTabData[26][2],wifiMacTabData[26][3]],
        ["28", hostNameTable5[27],IPTable5[27],wifiMacTabData[27][0],wifiMacTabData[27][2],wifiMacTabData[27][3]],
        ["29", hostNameTable5[28],IPTable5[28],wifiMacTabData[28][0],wifiMacTabData[28][2],wifiMacTabData[28][3]],
        ["30", hostNameTable5[29],IPTable5[29],wifiMacTabData[29][0],wifiMacTabData[29][2],wifiMacTabData[29][3]],
        ["31", hostNameTable5[30],IPTable5[30],wifiMacTabData[30][0],wifiMacTabData[30][2],wifiMacTabData[30][3]],
        ["32", hostNameTable5[31],IPTable5[31],wifiMacTabData[31][0],wifiMacTabData[31][2],wifiMacTabData[31][3]]
        ];

                showTable1('RSSI5',tableHeader5g,tableData5g,2);
        </script>
</div>
</td>
</tr>    
</table>
</div><!--id="block1" 12/11-->

<div id="button0" class="main_item">
<table width="640" border="0" cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" style="margin:5px 0;">
        <tr height="25px">
                <td align=left class="title-main" style="padding-left:20px;white-space:nowrap;">Click "Refresh" to refresh wireless signal</td>
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
