'use strict';'require view';'require form';'require uci';'require ui';'require rpc';return view.extend({load:function(){return Promise.all([uci.load('firewall')])},render:function(){const redirectSections=uci.sections('firewall','redirect');const filteredRules=redirectSections.map((item,index)=>({item,index})).filter(({item})=>typeof item==='object'&&item!==null&&item.name&&['HTTP','FTP','HTTPS'].includes(item.name)).map(({item,index})=>{return{...item,originalIndex:index};});const result=filteredRules.reduce((acc,item)=>{const port=item.src_dport!==undefined&&item.src_dport!==null&&item.src_dport!==''?item.src_dport:item.dest_port;acc[item.name]=port;return acc;},{});let redirectData={'ports':result}
let s;this.m=new form.JSONMap(redirectData,_('Remote Service Port Control - IPv4'),_('Configure Remote Service Port Control - IPv4 settings'));s=this.m.section(form.TypedSection,'ports');s.anonymous=true;const httpOption=s.option(form.Value,'HTTP',_('HTTP'),_('Please enter a value with 1 ~ 65535 characters.'));httpOption.datatype='range(1, 65535)'
const ftpOption=s.option(form.Value,'FTP',_('FTP'),_('Please enter a value with 1 ~ 65535 characters.'));ftpOption.datatype='range(1, 65535)'
const httpsOption=s.option(form.Value,'HTTPS',_('HTTPS'),_('Please enter a value with 1 ~ 65535 characters.'));httpsOption.datatype='range(1, 65535)'
function validatePorts(){const ports=[httpOption.formvalue('ports'),ftpOption.formvalue('ports'),httpsOption.formvalue('ports')].filter(port=>port!==null&&port!==undefined&&port!=='');return ports.length===new Set(ports).size;}
let errorShown=false
var super_save=this.m.save
this.m.save=function(){return super_save.apply(this,arguments).then(function(){if(!validatePorts()){if(!errorShown){ui.addNotification(null,E('p','ERROR:HTTP、FTP、HTTPS cannot be the same value!'),'error');errorShown=true}
return Promise.reject()}
filteredRules.map((item)=>{const sectionId=`@redirect[${item.originalIndex}]`;if(item.name==httpOption.title){uci.set('firewall',sectionId,'src_dport',httpOption.formvalue('ports'));}else if(item.name==ftpOption.title){uci.set('firewall',sectionId,'src_dport',ftpOption.formvalue('ports'));}else if(item.name==httpsOption.title){uci.set('firewall',sectionId,'src_dport',httpsOption.formvalue('ports'));}})
return uci.save().then(function(){errorShown=false
return true;});})}
return this.m.render()}});