
function status_show(cpeInformStatus,cpeAcsStatus)
{switch(cpeInformStatus)
{case 0:$("#Infrom_status").text(_("tr69Sta_TermStarting"));break;case 1:$("#Infrom_status").text(_("tr69Sta_ConnEffective"));break;case 2:$("#Infrom_status").text(_("tr69Sta_NoDNSInfo"));break;case 3:$("#Infrom_status").text(_("tr69Sta_Interrupted"));break;case 4:$("#Infrom_status").text(_("tr69Sta_Success"));break;default:$("#Infrom_status").text(_("tr69Sta_Default"));break;}
$("#ACS_status").text(" test");switch(cpeAcsStatus)
{case 0:$("#ACS_status").text(_("tr69Sta_NoConnfromACS"));break;case 1:$("#ACS_status").text(_("tr69Sta_ConnFailed"));break;case 2:$("#ACS_status").text(_("tr69Sta_ConneSuccess"));break;case 3:$("#ACS_status").text(_("tr69Sta_ConnUnauth"));break;default:$("#ACS_status").text(_("tr69Sta_Default"));break;}}
function pageLoad()
{var ubusparam=new Array("gwweb.tr069","get_tr069_status",{});var jsonparam={"id":1,"params":ubusparam};var cpeInformStatus=0;var cpeAcsStatus=0;sk_auth_post(jsonparam,function(result){console.log(result.result[1].status);cpeInformStatus=result.result[1].status;cpeAcsStatus=result.result[1].ACSstatus;status_show(cpeInformStatus,cpeAcsStatus);});}