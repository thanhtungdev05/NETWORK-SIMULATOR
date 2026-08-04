
function pageLoad()
{contentLoad();}
function contentLoad()
{var ubusparam=new Array("rtweb.firewall","getAlgCfg",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){infoLoad(result.result[1]);});}
function infoLoad(resArr)
{setChecked("at-alg-h323",resArr.h323Enable?true:false);setChecked("at-alg-sip",resArr.sipEnable?true:false);setChecked("at-alg-rtsp",resArr.rtspEnable?true:false);setChecked("at-alg-l2tp",resArr.l2tpEnable?true:false);setChecked("at-alg-ipsec",resArr.ipsecEnable?true:false);setChecked("at-alg-ftp",resArr.ftpEnable?true:false);setChecked("at-alg-pptp",resArr.pptpEnable?true:false);}
function algButtonApplyClick()
{var algData={};algData.h323Enable=getChecked("at-alg-h323")?1:0;algData.sipEnable=getChecked("at-alg-sip")?1:0;algData.rtspEnable=getChecked("at-alg-rtsp")?1:0;algData.l2tpEnable=getChecked("at-alg-l2tp")?1:0;algData.ipsecEnable=getChecked("at-alg-ipsec")?1:0;algData.ftpEnable=getChecked("at-alg-ftp")?1:0;algData.pptpEnable=getChecked("at-alg-pptp")?1:0;var ubusparam=new Array("rtweb.firewall","setAlgCfg",algData);var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){});}