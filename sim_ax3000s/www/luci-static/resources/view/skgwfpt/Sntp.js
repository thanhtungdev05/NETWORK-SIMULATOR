
function pageLoad()
{contentLoad();}
function contentLoad()
{var ubusparam=new Array("rtweb.ntp","getNtp",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){infoLoad(result.result[1]);});}
function infoLoad(resArr)
{jslDisable("at-synctime-enable");setChecked("at-synctime-enable",resArr.enable);setValue("at-system-time",resArr.time);ntpServerSelectLoad("at-prim-sntp-server",resArr.server1);ntpServerSelectLoad("at-secd-sntp-server",resArr.server2);setChecked("skg_sntp_daylight_enable",resArr.dst);timezoneLoad(resArr.timezone)}
function ntpServerSelectLoad(ogjId,server)
{var srvObj=getObj(ogjId);var setFlag=0;if(server==""){if(ogjId=="at-secd-sntp-server"){setValue(ogjId,"None");}
else{setValue(ogjId,"0.pool.ntp.org");}}
else{var optSize=srvObj.options.length;for(var i=0;i<optSize;i++){if(srvObj.options[i].value==server){setFlag=1;setValue(ogjId,srvObj.options[i].value);break;}}
if(!setFlag){setValue(ogjId,"Other");setValue(ogjId+"other",server);document.getElementById(ogjId+"other").removeAttribute("hidden");}}}
var timeZoneArray=[["TZ_ENEWETAK_KWAJALEIN",0,false,"-12:00","Dateline Standard Time, Eniwetok, Kwajalein"],["TZ_MIDWAY_ISLAND",1,false,"-11:00","Midway Island, Samoa"],["TZ_HAWAII",2,false,"-10:00","Hawaii"],["TZ_ALASKA",3,true,"-09:00","Alaska"],["TZ_PACIFIC",4,true,"-08:00","Pacific Time (US, Canada), Tijuana"],["TZ_ARIZONA",5,false,"-07:00","Arizona, Mountain Time (US)"],["TZ_CENTRAL_AMERICA",6,true,"-06:00","Central America, Central Canada"],["TZ_EST",7,true,"-05:00","Eastern Time (US, Canada)"],["TZ_ATLANTIC",8,true,"-04:00","Atlantic Time (Canada)"],["TZ_BRASILIA",9,true,"-03:00","Brasilia"],["TZ_MID_ATLANTIC",10,true,"-02:00","Mid-Atlantic"],["TZ_AZORES",11,true,"-01:00","Azores"],["TZ_CASABLANCA",12,true,"0:00","Casablanca, Monrovia"],["TZ_AMSTERDAM",13,true,"+01:00","Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna"],["TZ_ATHENS",14,true,"+02:00","Athens, Bucharest, Istanbul,"],["TZ_BAGHDAD",15,true,"+03:00","Baghdad"],["TZ_ABU_DHABI",16,false,"+04:00","Abu Dhabi, Muscat, Tbilisi"],["TZ_EKATERINBURG",17,true,"+05:00","Ekaterinburg"],["TZ_ALMATY",18,true,"+06:00","Almaty, Novosibirsk"],["TZ_BANGKOK",19,false,"+07:00","Bangkok, Hanoi, Jakarta"],["TZ_BEIJING",20,false,"+08:00","Beijing, Chongqing, Hong Kong, Urumqi"],["TZ_TOKYO",21,false,"+09:00","Osaka, Sapporo, Tokyo, Seoul"],["TZ_BRISBANE",22,false,"+10:00","Brisbane, Guam Port, Moresby"],["TZ_MAGADAN",23,false,"+11:00","Magadan, Solamon, New Caledonia"],["TZ_AUCKLAND",24,true,"+12:00","Auckland, Wellington"],["TZ_NUKUALOFA",25,false,"+13:00","Nukualofa"],];function timezoneLoad(tz)
{var timeZoneLength=timeZoneArray.length;for(var i=0;i<timeZoneLength;i++){var timeZoneTxt="";if("0:00"==timeZoneArray[i][3]){timeZoneTxt="(GMT) ";}
else{timeZoneTxt="(GMT"+timeZoneArray[i][3]+") ";}
timeZoneTxt+=timeZoneArray[i][4];addSelectOption("at-time-zone",timeZoneArray[i][1],timeZoneTxt);}
if(tz=="GMT0"){setValue("at-time-zone","12");}else{setValue("at-time-zone",12-parseInt(tz.split(">")[1]));}}
function serverSelectClick(obj)
{if(obj.value=="Other"){document.getElementById(obj.id+"other").removeAttribute("hidden");}
else{document.getElementById(obj.id+"other").setAttribute("hidden",true);}}
function buttonApplyClick()
{var sntpInfo={};var zoneStr=getValue("at-time-zone");var zoneNumber=12-parseInt(zoneStr);sntpInfo.enable=getChecked("at-synctime-enable")?1:0;sntpInfo.server1=getServerInfo("at-prim-sntp-server");sntpInfo.server2=getServerInfo("at-secd-sntp-server");sntpInfo.dst=getChecked("skg_sntp_daylight_enable")?1:0;zonename="GMT";if(zoneNumber>0){zonename+="+"+zoneNumber;}
else if(zoneNumber<0){zonename+=zoneNumber;}
sntpInfo.zonename=zonename;console.log(zonename);var ubusparam=new Array("rtweb.ntp","setNtp",sntpInfo);var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){contentLoad();});return true;}
function getServerInfo(objStr)
{var srv=getValue(objStr);if(srv=="Other"){return getValue(objStr+"other");}
else if(srv=="None"){return"";}
else{return getValue(objStr);}}