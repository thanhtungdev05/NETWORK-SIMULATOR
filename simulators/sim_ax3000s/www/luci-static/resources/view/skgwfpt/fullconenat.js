
function pageLoad()
{contentLoad();}
function contentLoad()
{var ubusparam=new Array("rtweb.firewall","getFullConeNatCfg",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){infoLoad(result.result[1]);});}
function infoLoad(resArr)
{setChecked("at-fuleconenat",resArr.enable?true:false);console.log("resArr.enable, [%d]]",resArr.enable);}
function fuleconenatButtonApplyClick()
{var fuleconenatData={};fuleconenatData.enable=getChecked("at-fuleconenat")?1:0;console.log("fuleconenatData.enable, [%d]]",fuleconenatData.enable);var ubusparam=new Array("rtweb.firewall","setFullConeNatCfg",fuleconenatData);var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){});}