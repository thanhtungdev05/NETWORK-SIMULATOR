
function pageLoad()
{fwlevel_getlevel();}
var FwLevel;function fwlevel_getlevel()
{var ubusparam=new Array("rtweb.firewall","getFwLevel",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){console.log(result.result[1]);FwLevel=result.result[1]["firewalllevel"]["level"];if(FwLevel==3)
{FwLevel=0;}
setValue("fwlevel",FwLevel);});}
function fwlevel_setlevel(fwlevel)
{var ubusparam=new Array("rtweb.firewall","setFwLevel",{"level":fwlevel});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){console.log(result.result[1]);setTimeout(fwlevel_getlevel(),300);});}
function fwlevel_SelChange(value)
{}
function fwlevel_btnApply()
{var newLevel;if(getObj("fwlevel")[1].selected==true){newLevel=2;}else{newLevel=0;}
if(newLevel==FwLevel){console.log("no change: FwLevel="+FwLevel);}
hide_mode();loading_show();fwlevel_setlevel(newLevel);}