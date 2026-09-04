
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
                if(data[i][keyIndex] != "N/A"){
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

<style type="text/css">

</style>
</head>
<body>
<FORM METHOD="POST" ACTION="/cgi-bin/more_client_list.asp" name="dchp_client_list">

<div id="wrapper">
<INPUT type="HIDDEN" name="LeaseNum" value="">
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
        ["8%","Index"],
        ["22%","Device Name"],
        ["16%","IP Address"],
        ["19%","MAC Address"],
        ["19%","Connection Type"],
        ["16%","Expire Time"]
];
var tableData = [
        ["111", "","","","","" + "days " + "<br />" + ""],
        ["112", "","","","","" + "days " + "<br />" + ""],
        ["113", "","","","","" + "days " + "<br />" + ""],
        ["114", "","","","","" + "days " + "<br />" + ""],
        ["115", "","","","","" + "days " + "<br />" + ""],
        ["116", "","","","","" + "days " + "<br />" + ""],
        ["117", "","","","","" + "days " + "<br />" + ""],
        ["118", "","","","","" + "days " + "<br />" + ""],
        ["119", "","","","","" + "days " + "<br />" + ""],
        ["120", "","","","","" + "days " + "<br />" + ""],
        ["121", "","","","","" + "days " + "<br />" + ""],
        ["122", "","","","","" + "days " + "<br />" + ""],
        ["123", "","","","","" + "days " + "<br />" + ""],
        ["124", "","","","","" + "days " + "<br />" + ""],
        ["125", "","","","","" + "days " + "<br />" + ""],
        ["126", "","","","","" + "days " + "<br />" + ""],
        ["127", "","","","","" + "days " + "<br />" + ""],
        ["128", "","","","","" + "days " + "<br />" + ""],
        ["129", "","","","","" + "days " + "<br />" + ""],
        ["130", "","","","","" + "days " + "<br />" + ""],
        ["131", "","","","","" + "days " + "<br />" + ""],
        ["132", "","","","","" + "days " + "<br />" + ""],
        ["133", "","","","","" + "days " + "<br />" + ""],
        ["134", "","","","","" + "days " + "<br />" + ""],
        ["135", "","","","","" + "days " + "<br />" + ""],
        ["136", "","","","","" + "days " + "<br />" + ""],
        ["137", "","","","","" + "days " + "<br />" + ""],
        ["138", "","","","","" + "days " + "<br />" + ""],
        ["139", "","","","","" + "days " + "<br />" + ""],
        ["140", "","","","","" + "days " + "<br />" + ""],
        ["141", "","","","","" + "days " + "<br />" + ""],
        ["142", "","","","","" + "days " + "<br />" + ""],
        ["143", "","","","","" + "days " + "<br />" + ""],
        ["144", "","","","","" + "days " + "<br />" + ""],
        ["145", "","","","","" + "days " + "<br />" + ""],
        ["146", "","","","","" + "days " + "<br />" + ""],
        ["147", "","","","","" + "days " + "<br />" + ""],
        ["148", "","","","","" + "days " + "<br />" + ""],
        ["149", "","","","","" + "days " + "<br />" + ""],
        ["150", "","","","","" + "days " + "<br />" + ""],
        ["151", "","","","","" + "days " + "<br />" + ""],
        ["152", "","","","","" + "days " + "<br />" + ""],
        ["153", "","","","","" + "days " + "<br />" + ""],
        ["154", "","","","","" + "days " + "<br />" + ""],
        ["155", "","","","","" + "days " + "<br />" + ""],
        ["156", "","","","","" + "days " + "<br />" + ""],
        ["157", "","","","","" + "days " + "<br />" + ""],
        ["158", "","","","","" + "days " + "<br />" + ""],
        ["159", "","","","","" + "days " + "<br />" + ""],
        ["160", "","","","","" + "days " + "<br />" + ""],
        ["161", "","","","","" + "days " + "<br />" + ""],
        ["162", "","","","","" + "days " + "<br />" + ""],
        ["163", "","","","","" + "days " + "<br />" + ""],
        ["164", "","","","","" + "days " + "<br />" + ""],
        ["165", "","","","","" + "days " + "<br />" + ""],
        ["166", "","","","","" + "days " + "<br />" + ""],
        ["167", "","","","","" + "days " + "<br />" + ""],
        ["168", "","","","","" + "days " + "<br />" + ""],
        ["169", "","","","","" + "days " + "<br />" + ""],
        ["170", "","","","","" + "days " + "<br />" + ""],
        ["171", "","","","","" + "days " + "<br />" + ""],
        ["172", "","","","","" + "days " + "<br />" + ""],
        ["173", "","","","","" + "days " + "<br />" + ""],
        ["174", "","","","","" + "days " + "<br />" + ""],
        ["175", "","","","","" + "days " + "<br />" + ""],
        ["176", "","","","","" + "days " + "<br />" + ""],
        ["177", "","","","","" + "days " + "<br />" + ""],
        ["178", "","","","","" + "days " + "<br />" + ""],
        ["179", "","","","","" + "days " + "<br />" + ""],
        ["180", "","","","","" + "days " + "<br />" + ""],
        ["181", "","","","","" + "days " + "<br />" + ""],
        ["182", "","","","","" + "days " + "<br />" + ""],
        ["183", "","","","","" + "days " + "<br />" + ""],
        ["184", "","","","","" + "days " + "<br />" + ""],
        ["185", "","","","","" + "days " + "<br />" + ""],
        ["186", "","","","","" + "days " + "<br />" + ""],
        ["187", "","","","","" + "days " + "<br />" + ""],
        ["188", "","","","","" + "days " + "<br />" + ""],
        ["189", "","","","","" + "days " + "<br />" + ""],
        ["190", "","","","","" + "days " + "<br />" + ""],
        ["191", "","","","","" + "days " + "<br />" + ""],
        ["192", "","","","","" + "days " + "<br />" + ""],
        ["193", "","","","","" + "days " + "<br />" + ""],
        ["194", "","","","","" + "days " + "<br />" + ""],
        ["195", "","","","","" + "days " + "<br />" + ""],
        ["196", "","","","","" + "days " + "<br />" + ""],
        ["197", "","","","","" + "days " + "<br />" + ""],
        ["198", "","","","","" + "days " + "<br />" + ""],
        ["199", "","","","","" + "days " + "<br />" + ""],
        ["200", "","","","","" + "days " + "<br />" + ""],
        ["201", "","","","","" + "days " + "<br />" + ""],
        ["202", "","","","","" + "days " + "<br />" + ""],
        ["203", "","","","","" + "days " + "<br />" + ""],
        ["204", "","","","","" + "days " + "<br />" + ""],
        ["205", "","","","","" + "days " + "<br />" + ""],
        ["206", "","","","","" + "days " + "<br />" + ""],
        ["207", "","","","","" + "days " + "<br />" + ""],
        ["208", "","","","","" + "days " + "<br />" + ""],
        ["209", "","","","","" + "days " + "<br />" + ""],
        ["210", "","","","","" + "days " + "<br />" + ""]

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
