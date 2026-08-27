<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="utf-8" lang="utf-8" dir="ltr">
<head>
<meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE">
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv=Content-Script-Type content=text/javascript>
<meta http-equiv=Content-Style-Type content=text/css>
<link rel="stylesheet" type="text/css" href="/style.css">

<style type="text/css">
body
{
    width:100%;
    height:100%;
    padding:0;
    margin:0;
}

.current{
background:#38a7dc;
background-position:center;
padding:0;
margin:0;
text-decoration:none;
outline:0;
color:#fff;
}
	
.other
{
background: #ffffff;
background-position:center;
padding:0; 
margin:0;
text-decoration:none;
outline:0;
}

#container
{
padding: 0;
background:#e6e6e6;
-moz-border-radius:10px;
-webkit-border-radius:10px;
border-radius:10px;
behavior:url(/PIE.htc);
background-position:center;
float:left;
animation: navFadeIn 0.25s ease-out;
}

@keyframes navFadeIn {
  from { opacity: 0; transform: translateX(-8px); }
  to   { opacity: 1; transform: translateX(0); }
}

#container ul
{	
padding:0;
margin:0;
list-style-type:none;
vertical-align:center;
}

#menu li a
{
display:block;
width:192px;
height:35px;
line-height:35px;
font-size:15px;
font-weight:bold;
font-family:Arial,Helvetica,sans-serif;
color:#38a7dc;
text-align:center; 
padding:0;
margin:0;
transition: background-color 0.2s ease, color 0.2s ease;
}

#menu li a:hover
{
background:#38a7dc;
background-position:center;
color:#fff !important;
}

#menu li
{
width:192px;
text-align:center; 
padding:0;
margin:0;
}

</style>



<script>
function doLoad()
{
	
	window.parent.main.location="/cgi-bin/status_deviceinfo.asp";
	document.getElementsByTagName("body")[0].style.height = window.innerHeight+"px";  

}

function change_bg(obj)
{
    var a=document.getElementById("menu").getElementsByTagName("a");
    for(var i=0;i<a.length;i++)
    {
        a[i].className="other";
        a[i].style.color="#38a7dc";
    }
    obj.className="current";
    obj.style.color="#fff";
}

</script>

</head>

<body onload="doLoad();" style="margin:0;padding:0;">

<div id="container">
<ul id="menu">

	<li style="border-bottom:1px solid #e6e6e6;"><a href="/cgi-bin/status_deviceinfo.asp" target="main" style="color:#fff;" onclick="change_bg(this);" class="current">Device Info</a></li>

	 

	
	<li style="border-bottom:1px solid #e6e6e6;"><a href="/cgi-bin/status_log.cgi" target="main" onclick="change_bg(this);" class="other">  System Log  </a></li>
	



	<li style="border-bottom:1px solid #e6e6e6;"><a href="/cgi-bin/status_statistics.asp" target="main" onclick="change_bg(this);"  class="other">  Statistics  </a></li>

	


	
<!--cindy add for wifi table and lan table 12/11-->
	<li style="border-bottom:1px solid #e6e6e6;"><a href="/cgi-bin/EthernetStatus.asp" target="main" onclick="change_bg(this);"  class="other">  Ethernet Status  </a></li>
	<li style="border-bottom:1px solid #e6e6e6;"><a href="/cgi-bin/devicetable.asp" target="main" onclick="change_bg(this);"  class="other">  Device Table  </a></li>
	<li><a href="/cgi-bin/wirelessSignal.asp" target="main" onclick="change_bg(this);"  class="other">  Wireless Signal  </a></li>

<!--cindy add for wifi table and lan table 12/11-->
</ul>
</div>
</body>
</html>
