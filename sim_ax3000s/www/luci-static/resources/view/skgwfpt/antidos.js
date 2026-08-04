
function pageLoad()
{console.log("DoS设置页面初始化");antidos_get_cfg();}
var AntiDos;function antidos_get_cfg()
{var ubusparam=new Array("rtweb.firewall","getFwLevel",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){console.log(result.result[1]);AntiDos=result.result[1]["firewalllevel"]["antidos"];if(AntiDos=="1"){dosprotect0.checked=false;dosprotect1.checked=true;}else{dosprotect0.checked=true;dosprotect1.checked=false;}});}
function antidos_set_cfg(antidos)
{var ubusparam=new Array("rtweb.firewall","setFwLevel",{"antidos":antidos});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){console.log(result.result[1]);setTimeout(antidos_get_cfg(),300);});}
function antidos_btnApply()
{var newAntidos;if(dosprotect1.checked){newAntidos=1;}else{newAntidos=0;}
if(newAntidos==AntiDos){console.log("no change: AntiDos="+AntiDos);}
hide_mode();loading_show();antidos_set_cfg(newAntidos);}