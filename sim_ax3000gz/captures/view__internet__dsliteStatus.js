'use strict';'require view';'require dom';'require poll';'require baseclass';'require fs';'require network';'require ui';'require uci';"require rpc";return view.extend({load:function(){return Promise.all([network.getWANNetworks()])},render:function(data){var wan6_nets=data[0]
var dsliteData=uci.get('network','dslite')||'';var dslite_net=null
if(wan6_nets&&wan6_nets.length>0){wan6_nets.forEach(item=>{if(item.sid=='dslite'){dslite_net=item}});}
var fields=[_('WAN Connection'),'WAN',_('Interface IPv4 Address'),dslite_net?dslite_net._ubus('ipv4-address')[0].address:"--",_('AFTR'),dsliteData.peeraddr?dsliteData.peeraddr:'--',_('Connection Status'),dslite_net?(dslite_net._ubus('up')?_('Online'):_('Offline')):_('--'),];var table=E('table',{'class':'table'});table.appendChild(E('tr',{'class':'tr','style':'background-color: #C8E6FE;'},[E('td',{'class':'td left emFont','width':'40%'},[_('Connection Name')]),E('td',{'class':'td left'},[dsliteData._name?dsliteData._name:'--'])]));for(var i=0;i<fields.length;i+=2){var row=E('tr',{'class':'tr'},[E('td',{'class':'td left emFont','width':'40%'},[fields[i]]),E('td',{'class':'td left'},[(fields[i+1]!=null)?fields[i+1]:'?'])]);const rowIndex=Math.floor(i/2)+1;if(rowIndex%2===0){row.style.backgroundColor='#EFF8FF';}
table.appendChild(row);}
var container=E('div')
container.appendChild(E('h3',_('DSLite Connection Status')))
container.appendChild(E('span',_('This page shows the status of DSLite connection. ')))
container.appendChild(E('br'))
container.appendChild(E('br'))
container.appendChild(table)
container.appendChild(E('div',{'style':'text-align: right; margin-top: 20px'},E('button',{'class':'btn cbi-button refreshBtn','style':'min-width: 100px','click':ui.createHandlerFn(this,function(){window.location.reload();})},_('Refresh'))));return container;},handleSaveApply:null,handleSave:null,handleReset:null,handleSaveInst:null});