
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
        ["211", "","","","","" + "days " + "<br />" + ""],
        ["212", "","","","","" + "days " + "<br />" + ""],
        ["213", "","","","","" + "days " + "<br />" + ""],
        ["214", "","","","","" + "days " + "<br />" + ""],
        ["215", "","","","","" + "days " + "<br />" + ""],
        ["216", "","","","","" + "days " + "<br />" + ""],
        ["217", "","","","","" + "days " + "<br />" + ""],
        ["218", "","","","","" + "days " + "<br />" + ""],
        ["219", "","","","","" + "days " + "<br />" + ""],
        ["220", "","","","","" + "days " + "<br />" + ""],
        ["221", "","","","","" + "days " + "<br />" + ""],
        ["222", "","","","","" + "days " + "<br />" + ""],
        ["223", "","","","","" + "days " + "<br />" + ""],
        ["224", "","","","","" + "days " + "<br />" + ""],
        ["225", "","","","","" + "days " + "<br />" + ""],
        ["226", "","","","","" + "days " + "<br />" + ""],
        ["227", "","","","","" + "days " + "<br />" + ""],
        ["228", "","","","","" + "days " + "<br />" + ""],
        ["229", "","","","","" + "days " + "<br />" + ""],
        ["230", "","","","","" + "days " + "<br />" + ""],
        ["231", "","","","","" + "days " + "<br />" + ""],
        ["232", "","","","","" + "days " + "<br />" + ""],
        ["233", "","","","","" + "days " + "<br />" + ""],
        ["234", "","","","","" + "days " + "<br />" + ""],
        ["235", "","","","","" + "days " + "<br />" + ""],
        ["236", "","","","","" + "days " + "<br />" + ""],
        ["237", "","","","","" + "days " + "<br />" + ""],
        ["238", "","","","","" + "days " + "<br />" + ""],
        ["239", "","","","","" + "days " + "<br />" + ""],
        ["240", "","","","","" + "days " + "<br />" + ""],
        ["241", "","","","","" + "days " + "<br />" + ""],
        ["242", "","","","","" + "days " + "<br />" + ""],
        ["243", "","","","","" + "days " + "<br />" + ""],
        ["244", "","","","","" + "days " + "<br />" + ""],
        ["245", "","","","","" + "days " + "<br />" + ""],
        ["246", "","","","","" + "days " + "<br />" + ""],
        ["247", "","","","","" + "days " + "<br />" + ""],
        ["248", "","","","","" + "days " + "<br />" + ""],
        ["249", "","","","","" + "days " + "<br />" + ""],
        ["250", "","","","","" + "days " + "<br />" + ""],
        ["251", "","","","","" + "days " + "<br />" + ""],
        ["252", "","","","","" + "days " + "<br />" + ""],
        ["253", "","","","","" + "days " + "<br />" + ""]
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
