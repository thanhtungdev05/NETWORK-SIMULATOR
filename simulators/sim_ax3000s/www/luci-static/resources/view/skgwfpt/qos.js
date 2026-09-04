
function pageLoad()
{Qos_Common_get_cfg();Qos_Queue_get_cfg();}
var QosCommon;var Qos_Enable=0;var QoS_Flag="0";var TempleteString="TR069,INTERNET";var SaveFlag="0";var ReCommitFlg="-1";var QosFlag=1;var EnableDSCPMark=0;var defaultdscp=-1;var EnDscpFlag=0;var DiscplineFlag="PQ";var Q1EnableFlag="";var Q2EnableFlag="";var Q3EnableFlag="";var Q4EnableFlag="";var oldDSCP=0;var old8021P=0;var Enable8021P=0;var ori_def_8021P=-1;var ori_def_DSCP=-1;var UpBandwidth=0;var ori_schedule_mode=3;var QosQueue=new Array();function Qos_Queue_get_cfg()
{var ubusparam=new Array("gwweb.qos","qosqueue_get",{});var jsonparam={"id":1,"params":ubusparam};sk_auth_post(jsonparam,function(result){QosQueue=result.result[1].qos_queue;if(QosQueue[0].enable=="1"){Q1Enable.checked=true;Q5Enable.checked=true;}
if(QosQueue[1].enable=="1"){Q2Enable.checked=true;Q6Enable.checked=true;}
if(QosQueue[2].enable=="1"){Q3Enable.checked=true;Q7Enable.checked=true;}
if(QosQueue[3].enable=="1"){Q4Enable.checked=true;Q8Enable.checked=true;}
{getObj("Q1Weight").value=QosQueue[0].weight;}
{getObj("Q2Weight").value=QosQueue[1].weight;}
{getObj("Q3Weight").value=QosQueue[2].weight;}
{getObj("Q4Weight").value=QosQueue[3].weight;}});}
function Qos_Common_get_cfg()
{var ubusparam=new Array("gwweb.qos","qoscom_get",{});var ubusparam_que=new Array("gwweb.qos","qosqueue_get",{});var ubusparam_policer=new Array("gwweb.qos","qospolicer_get",{});var applist;var enable=0;var que_num=0;var policer_num=0;var cmitrate=0;var schduler_alg=3;var dscpenable=-1;var jsonparam=[{"id":1,"params":ubusparam},{"id":2,"params":ubusparam_que},{"id":3,"params":ubusparam_policer}];sk_auth_post(jsonparam,function(result){applist=result[0].result[1].applist;enable=result[0].result[1].enable;ori_def_DSCP=result[0].result[1].defdscp;ori_def_8021P=result[0].result[1].defethpri;que_num=result[1].result[1].qos_queue.length;if(que_num==4){for(var i=0;i<4;i++){if(result[1].result[1].qos_queue[i].enable==1){schduler_alg=result[1].result[1].qos_queue[i].schduler_alg;ori_schedule_mode=schduler_alg;break;}}}
policer_num=result[2].result[1].qos_policer.length;if(policer_num>0){if(result[2].result[1].qos_policer[0].enable==1){cmitrate=result[2].result[1].qos_policer[0].cmitrate;}}
Qos_Enable=enable;if(ori_def_8021P==-1){Enable8021P=1;}else if(ori_def_8021P==0){Enable8021P=0;}else{Enable8021P=2;}
Qos_Common_init8021premark(Enable8021P);if(schduler_alg==3)
{PQEdit.style.display="block";WRREdit.style.display="none";QosPlanPQ.checked=true;QosPlanWRR.checked=false;DiscplineFlag="PQ";}else if(schduler_alg==2){PQEdit.style.display="none";WRREdit.style.display="block";QosPlanPQ.checked=false;QosPlanWRR.checked=true;DiscplineFlag="WRR";}
if(ori_def_DSCP!=-1){QosEnableDSCPMark.checked=true;}
Qos_Common_initTemplate(applist);TempleteString=applist;QosEnable.checked=(enable=="1")?true:false;if(que_num<4){crtque1_ubus=new Array("gwweb.qos","qosqueue_set",{"index":1});crtque2_ubus=new Array("gwweb.qos","qosqueue_set",{"index":2});crtque3_ubus=new Array("gwweb.qos","qosqueue_set",{"index":3});crtque4_ubus=new Array("gwweb.qos","qosqueue_set",{"index":4});jsonparam=[{"id":1,"params":crtque1_ubus},{"id":1,"params":crtque2_ubus},{"id":1,"params":crtque3_ubus},{"id":1,"params":crtque4_ubus}];sk_auth_apply(jsonparam,function(result){});}
if(policer_num==0){crtpolicer_ubus=new Array("gwweb.qos","qospolicer_set",{"index":1});jsonparam={"id":1,"params":crtpolicer_ubus};sk_auth_apply(jsonparam,function(result){});}
getObj("QosUpBandwidth").value=cmitrate;Qos_Queue_get_cfg();CurQoSShow();QoS_Flag="0";SaveFlag="0";ReCommitFlg="-1";});}
function Qos_Common_set_cfg()
{var ethprienable=-1;var schduler_alg=3;if(QosEnable8021P.value==0){ethprienable=0;}else if(QosEnable8021P.value==1){ethprienable=-1;}else{if(ori_def_8021P<1){ethprienable=1;}else{ethprienable=ori_def_8021P;}}
if(QosEnableDSCPMark.checked){ori_def_DSCP=1;}else{ori_def_DSCP=-1;}
var policer_enable=0;if(UpBandwidth>0){policer_enable=1;}
var ubusparam_policer=new Array("gwweb.qos","qospolicer_set",{"index":1,"enable":policer_enable,"cmitrate":UpBandwidth});if(DiscplineFlag=="PQ"){schduler_alg=3;var ubusparam=new Array("gwweb.qos","qoscom_set",{"enable":Qos_Enable,"applist":TempleteString,"defethpri":ethprienable,"defdscp":ori_def_DSCP,});var ubusparam1=new Array("gwweb.qos","qosqueue_set",{"enable":Q1EnableFlag,"schduler_alg":schduler_alg,"index":1});var ubusparam2=new Array("gwweb.qos","qosqueue_set",{"enable":Q2EnableFlag,"schduler_alg":schduler_alg,"index":2});var ubusparam3=new Array("gwweb.qos","qosqueue_set",{"enable":Q3EnableFlag,"schduler_alg":schduler_alg,"index":3});var ubusparam4=new Array("gwweb.qos","qosqueue_set",{"enable":Q4EnableFlag,"schduler_alg":schduler_alg,"index":4});}else if(DiscplineFlag=="WRR"){schduler_alg=2;var ubusparam=new Array("gwweb.qos","qoscom_set",{"enable":Qos_Enable,"applist":TempleteString,"defethpri":ethprienable,"defdscp":ori_def_DSCP,});var ubusparam1=new Array("gwweb.qos","qosqueue_set",{"enable":Q1EnableFlag,"index":1,"schduler_alg":schduler_alg,"weight":parseInt(getObj('Q1Weight').value)});var ubusparam2=new Array("gwweb.qos","qosqueue_set",{"enable":Q2EnableFlag,"index":2,"schduler_alg":schduler_alg,"weight":parseInt(getObj('Q2Weight').value)});var ubusparam3=new Array("gwweb.qos","qosqueue_set",{"enable":Q3EnableFlag,"index":3,"schduler_alg":schduler_alg,"weight":parseInt(getObj('Q3Weight').value)});var ubusparam4=new Array("gwweb.qos","qosqueue_set",{"enable":Q4EnableFlag,"index":4,"schduler_alg":schduler_alg,"weight":parseInt(getObj('Q4Weight').value)});}else if(DiscplineFlag=="CAR"){}else{return;}
var jsonparam=[{"id":1,"params":ubusparam1},{"id":2,"params":ubusparam2},{"id":3,"params":ubusparam3},{"id":4,"params":ubusparam4},{"id":5,"params":ubusparam},{"id":6,"params":ubusparam_policer}];sk_auth_apply(jsonparam,function(result){setTimeout(Qos_Common_get_cfg(),300);setTimeout(Qos_Queue_get_cfg(),300);});}
function Qos_Common_set_mode(template)
{var ubusparam=new Array("gwweb.qos","qoscom_set",{"rule_modle":template});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){setTimeout(Qos_Common_get_cfg(),300);});}
function Qos_Common_set_enable(enable)
{var ubusparam=new Array("gwweb.qos","qoscom_set",{"enable":enable});var jsonparam={"id":1,"params":ubusparam};sk_auth_apply(jsonparam,function(result){console.log(result.result[1]);setTimeout(Qos_Common_get_cfg(),300);});}
function Qos_Common_set_plan(plan)
{var schduler_alg=3;if(plan=='WRR'){schduler_alg=2;}
var ubusparam_1=new Array("gwweb.qos","qosqueue_set",{"index":1,"schduler_alg":schduler_alg});var ubusparam_2=new Array("gwweb.qos","qosqueue_set",{"index":2,"schduler_alg":schduler_alg});var ubusparam_3=new Array("gwweb.qos","qosqueue_set",{"index":3,"schduler_alg":schduler_alg});var ubusparam_4=new Array("gwweb.qos","qosqueue_set",{"index":4,"schduler_alg":schduler_alg});var jsonparam=[{"id":1,"params":ubusparam_1},{"id":2,"params":ubusparam_2},{"id":3,"params":ubusparam_3},{"id":4,"params":ubusparam_4}];sk_auth_apply(jsonparam,function(result){setTimeout(Qos_Common_get_cfg(),300);});}
function QosModeConstruction(domain,Mode,Enable,Bandwidth,Plan,EnableDSCPMark,Enable8021P)
{this.domain=domain;this.Mode=Mode;this.Enable=Enable;this.Bandwidth=Bandwidth;this.Plan=Plan;this.EnableDSCPMark=EnableDSCPMark;this.Enable8021P=Enable8021P;}
var CurMode=new Array(new QosModeConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS","OTHER","0","0","priority","0","0"),null);function QosAppConstruction(domain,AppName,ClassQueue)
{this.domain=domain;this.AppName=AppName;this.ClassQueue=ClassQueue;}
var CurApp=new Array(new QosAppConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.App.1","","4"),new QosAppConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.App.2","","4"),null);function QosClassConstruction(domain,ClassQueue,Type,Max,Min,ProtocolList,DSCPMarkValue,Value8021P)
{this.domain=domain;this.ClassQueue=ClassQueue;this.Type=Type;this.Max=Max;this.Min=Min;this.ProtocolList=ProtocolList;this.DSCPMarkValue=DSCPMarkValue;this.Value8021P=Value8021P;}
var CurClassArray=new Array(null);function QosQueueConstruction(domain,Enable,Priority,Weight)
{this.domain=domain;this.Enable=Enable;this.Priority=Priority;this.Weight=Weight;}
var CurQueue=new Array(new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.1","0","1","0"),new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.2","0","2","0"),new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.3","0","3","0"),new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.4","0","4","0"),new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.5","0","5","0"),new QosQueueConstruction("InternetGatewayDevice.X_CT-COM_UplinkQoS.PriorityQueue.6","0","6","0"),null);function Qos(Mode,App,Class,Queue)
{this.Mode=Mode;this.App=App;this.Class=Class;this.Queue=Queue;}
var CurQoS=new Qos(CurMode,CurApp,CurClassArray,CurQueue);var AppCnt=0;var ClsCnt=0;var QueueCnt=0;var ClsAddFlag=false;function Qos_Common_initTemplate(mode)
{if(mode==""){console.log("mode=NULL");return;}
var hascusopt=false;for(var i=0;i<QosMode.length;i++){if(mode==QosMode.options[i].value)
{QosMode.options[i].setAttribute('selected','true');hascusopt=true;}}
if(mode.length!=0&&hascusopt==false){var optcus=new Option(mode,mode);QosMode.add(optcus);QosMode.options[QosMode.length-1].setAttribute('selected','true');}}
function Qos_Common_init8021premark(en8021p)
{if(en8021p==""){console.log("..en8021p="+en8021p);}
for(var i=0;i<QosEnable8021P.length;i++){if(en8021p==QosEnable8021P.options[i].value)
{QosEnable8021P.options[i].setAttribute('selected','true');}}}
function QoSChangeMode()
{QoS_Flag="1";TempleteString=getObj('QosMode').value;Qos_Common_set_mode(TempleteString);}
function QoSEnableChange()
{if(QosEnable.checked==false)
{if(!confirm(_("Warn_Disable_the_Qos_Template")))
{QosEnable.checked=true;SaveFlag="0";return;}
QueueEdit.style.display="none";AddBtn.style.display="none";QOSGlobe.style.display="none";}
else
{if(!confirm(_("Warn_Enable_the_Qos_Template")))
{QosEnable.checked=false;SaveFlag="0";return;}
QueueEdit.style.display="block";AddBtn.style.display="block";QOSGlobe.style.display="block";ReCommitFlg="1";}
btnSaveCheck();Qos_Common_set_enable(QosFlag);}
function btnSaveCheck()
{TempleteString=getObj('QosMode').value;checkboxstatus();convertNullValue();SaveFlag="1";}
function checkboxstatus()
{if(QosEnable.checked){QosFlag=1;}else{QosFlag=0;}
if(QosEnableDSCPMark.checked){EnDscpFlag=1;}else{EnDscpFlag=0;}
if(QosPlanPQ.checked){DiscplineFlag="PQ";if(Q1Enable.checked){Q1EnableFlag=1;}else{Q1EnableFlag=0;}
if(Q2Enable.checked){Q2EnableFlag=1;}else{Q2EnableFlag=0;}
if(Q3Enable.checked){Q3EnableFlag=1;}else{Q3EnableFlag=0;}
if(Q4Enable.checked){Q4EnableFlag=1;}else{Q4EnableFlag=0;}}else if(QosPlanWRR.checked){DiscplineFlag="WRR";if(Q5Enable.checked){Q1EnableFlag=1;}else{Q1EnableFlag=0;}
if(Q6Enable.checked){Q2EnableFlag=1;}else{Q2EnableFlag=0;}
if(Q7Enable.checked){Q3EnableFlag=1;}else{Q3EnableFlag=0;}
if(Q8Enable.checked){Q4EnableFlag=1;}else{Q4EnableFlag=0;}}
if(oldDSCP!=EnDscpFlag||old8021P!=Enable8021P){ReCommitFlg="2";}}
function checkIfInt(weight)
{var len;if(isNaN(weight)){warninfo_show(_("Warn_Weight_Must_Be_Int"));return false;}
len=weight.length;var ch;for(i=0;i<len;i++)
{ch=weight.charAt(i);if(ch>'9'||ch<'0')
{warninfo_show(_("Warn_Weight_Must_Be_Int"));return false;}}
return true;}
function convertNullValue()
{if(getObj('Q1Weight').value=="")getObj('Q1Weight').value="0";if(getObj('Q2Weight').value=="")getObj('Q2Weight').value="0";if(getObj('Q3Weight').value=="")getObj('Q3Weight').value="0";if(getObj('Q4Weight').value=="")getObj('Q4Weight').value="0";if(DiscplineFlag=="WRR"){if(checkIfInt(getObj('Q1Weight').value)==false||checkIfInt(getObj('Q2Weight').value)==false||checkIfInt(getObj('Q3Weight').value)==false||checkIfInt(getObj('Q4Weight').value)==false){return false;}}
if(getObj('Q1Car').value=="")getObj('Q1Car').value="0";if(getObj('Q2Car').value=="")getObj('Q2Car').value="0";if(getObj('Q3Car').value=="")getObj('Q3Car').value="0";if(getObj('Q4Car').value=="")getObj('Q4Car').value="0";if(getObj('Q5Car').value=="")getObj('Q5Car').value="0";if(getObj('Q6Car').value=="")getObj('Q6Car').value="0";return true;}
function CurQoSShow()
{if(!QosEnable.checked){QueueEdit.style.display="none";AddBtn.style.display="none";QOSGlobe.style.display="none";}else{QueueEdit.style.display="block";AddBtn.style.display="block";QOSGlobe.style.display="block";}
if(DiscplineFlag=="PQ"){PQEdit.style.display="block";WRREdit.style.display="none";CAREdit.style.display="none";}else if(DiscplineFlag=="WRR"){PQEdit.style.display="none";WRREdit.style.display="block";CAREdit.style.display="none";}
AppCnt=CurQoS.App.length-1;ClsCnt=CurQoS.Class.length-1;QueueCnt=CurQoS.Queue.length-1;}
function QosPlanChange()
{var now_schedule_check=3;if(event.target.id=="QosPlanPQ"){PQEdit.style.display="block";WRREdit.style.display="none";QosPlanPQ.checked=true;QosPlanWRR.checked=false;}else if(event.target.id=="QosPlanWRR"){PQEdit.style.display="none";WRREdit.style.display="block";QosPlanPQ.checked=false;QosPlanWRR.checked=true;}else{return;}
if(QosPlanWRR.checked==true){now_schedule_check=2;}
if(ori_schedule_mode==now_schedule_check){return;}}
function QoSChange8021P()
{Enable8021P=parseInt(getObj("QosEnable8021P").value);}
function QosBtnSave()
{TempleteString=getObj('QosMode').value;checkboxstatus();convertNullValue();if(Q1EnableFlag==0&&Q2EnableFlag==0&&Q3EnableFlag==0&&Q4EnableFlag==0){warninfo_show(_("Warn_Enable_Queue"));setTimeout(Qos_Common_get_cfg(),300);setTimeout(Qos_Queue_get_cfg(),300);return false;}
if(DiscplineFlag=="WRR"){if(checkIfInt(getObj('Q1Weight').value)==false||checkIfInt(getObj('Q2Weight').value)==false||checkIfInt(getObj('Q3Weight').value)==false||checkIfInt(getObj('Q4Weight').value)==false){return false;}}
if(DiscplineFlag=="WRR"){var weightArr=new Array(getObj('Q1Weight').value,getObj('Q2Weight').value,getObj('Q3Weight').value,getObj('Q4Weight').value);var weightArrST=new Array(Q5Enable.checked,Q6Enable.checked,Q7Enable.checked,Q8Enable.checked);var idx=0;var weightTotal=0;for(idx=0;idx<weightArr.length;idx++)
{if(false==isPlusInteger(weightArr[idx]))
{warninfo_show(_("Warn_Weight_Invalid"));return false;}
if(weightArrST[idx]&&weightArr[idx]==0)
{warninfo_show(_("Warn_Weight_Cant_Be_Zero"));return false;}
weightTotal+=parseInt(weightArr[idx]);}
if(weightTotal>100)
{warninfo_show(_("Warn_WRR_Weight_Total"));return false;}}
var bdw=parseInt(getObj("QosUpBandwidth").value);if(bdw!="0"){if(parseInt(bdw)<8||parseInt(bdw)>10000000||!isInteger(bdw))
{warninfo_show(_("Warn_UpBandWidth_Range"));return false;}
UpBandwidth=bdw;}
else
{bdw=10000000;UpBandwidth=0;}
if(DiscplineFlag=="CAR")
{var bandArr=new Array(getObj('Q1Car').value,getObj('Q2Car').value,getObj('Q3Car').value,getObj('Q4Car').value,getObj('Q5Car').value,getObj('Q6Car').value);var bandArrST=new Array(Q9Enable.checked,Q10Enable.checked,Q11Enable.checked,Q12Enable.checked,Q13Enable.checked,Q14Enable.checked);var idx=0;var bandTotal=0;for(idx=0;idx<bandArr.length;idx++)
{if(false==isPlusInteger(bandArr[idx]))
{warninfo_show(_("Warn_Bandwidth_Invalid"));return false;}
if(bandArrST[idx])
bandTotal+=parseInt(bandArr[idx]);}
if(bandTotal>bdw)
{warninfo_show(_("Warn_TotalBandwidth_cant_Bigger_Then_UpBandwidth"));return false;}}
SaveFlag="1";Qos_Common_set_cfg();}
function VlanSubmit(filename)
{location.replace(filename);}
function btnJumpQosEdit()
{location.replace("qos/qosclass");return;}