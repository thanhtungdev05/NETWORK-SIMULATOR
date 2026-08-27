
function pageLoad()
{contentLoad();}
function contentLoad()
{var ubusparam=new Array("rtweb.system","get_led_status",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){infoLoad(result.result[1]);});}
function infoLoad(resArr)
{if(resArr.led_off==true){setChecked("at-led-control",false);}else{setChecked("at-led-control",true);}}
function buttonApplyClick()
{var ledFlag=0;if(getChecked("at-led-control")==false){ledFlag=7;}else{ledFlag=6;}
var ubusparam=new Array("rtweb.system","led_control",{"level":ledFlag});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){});return true;}