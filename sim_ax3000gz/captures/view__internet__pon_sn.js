'use strict';'require view';'require rpc';'require form';'require uci';'require ui';return view.extend({snCmapi:rpc.declare({object:'luci',method:'usecmapi',params:['method','data'],expect:{}}),load:function(){return Promise.all([this.snCmapi('webagent_pon_get_sn_web','{}'),this.snCmapi('webagent_pon_get_pwd_web','{}')]);},render:function(data){let snData=JSON.parse(data[0].data);let passData=JSON.parse(data[1].data);let snInfoData={'snInfo':snData};snInfoData.snInfo.asciiPwd=passData.asciiPwd;let m,s,o
m=new form.JSONMap(snInfoData,_('SN'),_('This page provides the function of SN parameter(s) configuration. '))
s=m.section(form.TypedSection,'snInfo')
s.anonymous=true
o=s.option(form.Value,'asciiSn',_('SN'))
o.readonly=true
let passOption=s.option(form.Value,'asciiPwd',_('Password'),_('Please enter a value with 1 ~ 10 characters.'));passOption.password=true
passOption.datatype='maxlength(10)'
passOption.validate=function(section_id,value){if(/[^\x00-\x7F]/.test(value)){return _('Password must contain only ASCII characters (no Chinese).');}
return true;};return m.render();},handleSave:null,handleSaveApply:null,handleSaveInst:function(ev){var Fn=L.bind(function(){document.removeEventListener('uci-applied',Fn);});document.addEventListener('uci-applied',Fn);this.super('handleSaveInst',[ev,'webagent_pon_set_pwd_web']);}});