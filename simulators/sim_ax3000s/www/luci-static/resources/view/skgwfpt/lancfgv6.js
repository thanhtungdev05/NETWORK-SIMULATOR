
function radvdClick(obj)
{if(obj.checked==true)
$("#radvdCfgTab").show();else
$("#radvdCfgTab").hide();}
function dnsv6Mode_Change(dnsmode)
{if(dnsmode=="Static")
$("#dnsv6Satic").show();else
$("#dnsv6Satic").hide();}
function lancfgv6_parse_result(obj)
{setHTML("lladdrshow",obj.result[1].lladdr6);setChecked("enableRadvd",obj.result[1].raenable);setValue("preferred_Life_Time",obj.result[1].prelifetime);setValue("min_RA_Interval",obj.result[1].ramintime);setValue("max_RA_Interval",obj.result[1].ramaxtime);setValue("valid_Life_Time",obj.result[1].ralifetime);setChecked("M_Flag",obj.result[1].ramanage);setChecked("O_Flag",obj.result[1].raother);setChecked("enableDhcp6s",obj.result[1].dhcp6senable);setValue("dnsv6Mode",obj.result[1].dnsmode);setValue("dns6Primary",obj.result[1].dns1);setValue("dns6Secondary",obj.result[1].dns2);radvdClick(getObj("enableRadvd"));dnsv6Mode_Change(getValue("dnsv6Mode"));}
function pageLoad()
{var lanparam=new Array("rtweb.lanv6cfg","get",{});var jsonparam={"id":1,"params":lanparam};sk_auth_post(jsonparam,function(result){lancfgv6_parse_result(result);});}
function lancfgv6_pageCheckValue()
{if(getValue("dnsv6Mode")=="Static")
{if(getValue("dns6Primary")!=''&&isGlobalIpv6Address(getValue("dns6Primary"))==false)
{warninfo_show(_("DnsPrimaryError3"));return false;}
if(getValue("dns6Secondary")!=''&&isGlobalIpv6Address(getValue("dns6Secondary"))==false)
{warninfo_show(_("DnsSecondaryError3"));return false;}}
if(getChecked("enableRadvd")==true)
{if(getValue("min_RA_Interval")=='')
{warninfo_show(_("RAIntervalErr1"));return false;}
if(getValue("max_RA_Interval")=='')
{warninfo_show(_("RAIntervalErr2"));return false;}
if(isNaN(getValue("max_RA_Interval"))||getValue("max_RA_Interval")<4||getValue("max_RA_Interval")>1800)
{warninfo_show(_("RAIntervalErr3"));return false;}
if(isNaN(getValue("min_RA_Interval"))||getValue("min_RA_Interval")<3||getValue("min_RA_Interval")>1350)
{warninfo_show(_("RAIntervalErr4"));return false;}
if(parseInt(getValue("min_RA_Interval"))>0.75*parseInt(getValue("max_RA_Interval")))
{warninfo_show(_("RAIntervalErr5"));return false;}
if(getValue("preferred_Life_Time")=='')
{warninfo_show(_("RALifeTimeErr1"));return false;}
if(getValue("valid_Life_Time")=='')
{warninfo_show(_("RALifeTimeErr2"));return false;}
if(0+parseInt(getValue("preferred_Life_Time"))>parseInt(getValue("valid_Life_Time")))
{warninfo_show(_("RALifeTimeErr3"));return false;}
if(isNaN(getValue("preferred_Life_Time")))
{warninfo_show(_("RALifeTimeErr4"));return false;}
if(isNaN(getValue("valid_Life_Time")))
{warninfo_show(_("RALifeTimeErr5"));return false;}
if(getValue("dnsv6Mode")=="Static")
{if(getValue("dns6Primary")=='')
{warninfo_show(_("PriDNSErr1"));return false;}}}
return true;}
function lancfgv6_apply()
{if(lancfgv6_pageCheckValue()==true)
{var dhcp6sdata={"dhcp6senable":getChecked("enableDhcp6s"),"raenable":getChecked("enableRadvd"),"dnsmode":getValue("dnsv6Mode")};if(getChecked("enableRadvd"))
{dhcp6sdata.prelifetime=parseInt(getValue("preferred_Life_Time"));dhcp6sdata.ralifetime=parseInt(getValue("valid_Life_Time"));dhcp6sdata.ramintime=parseInt(getValue("min_RA_Interval"));dhcp6sdata.ramaxtime=parseInt(getValue("max_RA_Interval"));dhcp6sdata.ramanage=getChecked("M_Flag");dhcp6sdata.raother=getChecked("O_Flag");}
if(getValue("dnsv6Mode")=="Static")
{dhcp6sdata.dns1=getValue("dns6Primary");dhcp6sdata.dns2=getValue("dns6Secondary");}
var dhcp6sparam=new Array("rtweb.lanv6cfg","set",dhcp6sdata);var jsonparam={"id":1,"params":dhcp6sparam};sk_auth_apply(jsonparam,function(result){});}}