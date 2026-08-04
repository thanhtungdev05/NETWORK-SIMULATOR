'use strict';'require view';'require fs';'require rpc';'require ui';'require form';return view.extend({ponInfoCmapi:rpc.declare({object:'luci',method:'usecmapi',params:['method','data'],expect:{}}),load:function(){return Promise.all([this.ponInfoCmapi('webagent_optical_get_param','{}'),this.ponInfoCmapi('webagent_pon_get_operation_state','{}'),this.ponInfoCmapi('webagent_pon_get_los_info','{}')]);},render:function(data){let ponInfoData=JSON.parse(data[0].data);let RegStatus=JSON.parse(data[1].data)
let ponLosData=JSON.parse(data[2].data);let isPowerOn=ponLosData.ponLosInfo===0
var GponRegStatus="";switch(RegStatus.operationState)
{case 0:GponRegStatus=_('Unknown State');break;case 1:GponRegStatus=_('Initial State(o1)');break;case 2:GponRegStatus=_('Standby State(o2)');break;case 3:GponRegStatus=_('Serial Number State(o3)');break;case 4:GponRegStatus=_('Ranging State(o4)');break;case 5:GponRegStatus=_('Operation State(o5)');break;case 6:GponRegStatus=_('POPUP State(o6)');break;case 7:GponRegStatus=_('Emergency Stop State(o7)');break;default:GponRegStatus=_('Unknown State');break;}
var fields=[_('ONU state'),GponRegStatus,_('Optical Module Input Power(dBm)'),(isPowerOn&&ponInfoData.rxPower?ponInfoData.rxPower/10000.0:'--'),_('Optical Module Output Power(dBm)'),(isPowerOn&&ponInfoData.txPower?ponInfoData.txPower/10000.0:'--'),_('Optical Module Supply Voltage(mV)'),(ponInfoData.volt?ponInfoData.volt:'--'),_('Optical Transmitter Bias Current(mA)'),(ponInfoData.current?ponInfoData.current/1000.0:'--'),_('Operating Temperature of the Optical Module(°C)'),(ponInfoData.temp?ponInfoData.temp/1000.0:'--'),];var table=E('table',{'class':'table'});for(var i=0;i<fields.length;i+=2){var row=E('tr',{'class':'tr'},[E('td',{'class':'td left emFont','width':'40%'},[fields[i]]),E('td',{'class':'td left'},[(fields[i+1]!=null)?fields[i+1]:'?'])]);if(Math.floor(i/2)%2==0){row.style.backgroundColor='#EFF8FF';}
table.appendChild(row);}
var container=E('div')
const titleElement=E('h3',{'name':'content'},_('Page Information'))
container.appendChild(titleElement)
container.appendChild(E('span',_('Display the optical module')))
container.appendChild(E('br'))
container.appendChild(E('br'))
container.appendChild(table)
container.appendChild(E('div',{'style':'text-align: right; margin-top: 20px'},E('button',{'class':'btn cbi-button refreshBtn','style':'min-width: 100px','click':ui.createHandlerFn(this,function(){window.location.reload();})},_('Refresh'))));return container;},handleSaveApply:null,handleSave:null,handleReset:null,handleSaveInst:null});