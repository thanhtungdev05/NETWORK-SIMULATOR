// Boc tach cay menu tu cac file .jg — .jg la JS object literal (khoa khong nhay,
// chuoi nhay don) nen KHONG parse bang JSON.parse duoc, phai eval trong sandbox.
const fs = require('fs'), path = require('path'), vm = require('vm');
const DIR = path.join(__dirname, '..', 'reference', 'jg');
const out = {};
for (const f of fs.readdirSync(DIR).sort()) {
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  let val;
  try { val = vm.runInNewContext('(' + src + ')', {}, {timeout: 20000}); }
  catch (e) { out[f] = {LOI: String(e).slice(0,200)}; continue; }
  out[f] = val;
}
fs.writeFileSync(path.join(__dirname, '..', 'spec', '_jg_raw.json'), JSON.stringify(out));
// tom tat
const tt = {};
for (const [f, v] of Object.entries(out)) {
  if (v && v.LOI) { tt[f] = v; continue; }
  tt[f] = { kieu: Array.isArray(v) ? 'mang' : typeof v, soPhanTu: Array.isArray(v) ? v.length : Object.keys(v||{}).length };
}
console.log(JSON.stringify(tt, null, 1));
