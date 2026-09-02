// Dung cay menu day du tu 8 file .jg -> spec/menu-tree.json
// Moi muc con co "path" = duong dan lenh RouterOS that (vd /ip/address),
// day chinh la anh xa menu -> hop dong M2 can gia lap.
const fs=require('fs'), path=require('path');
const raw = JSON.parse(fs.readFileSync(path.join(__dirname,'..','spec','_jg_raw.json'),'utf8'));

const duyet = (nut, sau) => {
  const ra = { title: nut.title, type: nut.type, path: nut.path, name: nut.name };
  for (const k of Object.keys(ra)) if (ra[k]===undefined) delete ra[k];
  if (nut.ro) ra.chiDoc = 1;
  if (nut.removable) ra.xoaDuoc = 1;
  if (nut.nonaddable) ra.khongThemDuoc = 1;
  if (nut.autorefresh) ra.tuLamTuoi = 1;
  if (Array.isArray(nut.c) && nut.c.length && sau < 4) ra.c = nut.c.map(x=>duyet(x, sau+1));
  return ra;
};

const cay = [];
const tapPath = new Set();
const gomPath = n => { if(n.path) tapPath.add(n.path); (n.c||[]).forEach(gomPath); };

for (const [tep,arr] of Object.entries(raw)) for (const m of arr) {
  const muc = { tep, name:m.name, title:m.title, group:m.group, prio:m.prio,
                nonpublic:m.nonpublic?1:undefined, coDieuKien:m.pred?1:undefined,
                c:(m.c||[]).map(x=>duyet(x,0)) };
  for (const k of Object.keys(muc)) if (muc[k]===undefined) delete muc[k];
  cay.push(muc); gomPath(muc);
}
fs.writeFileSync(path.join(__dirname,'..','spec','menu-tree.json'), JSON.stringify(cay,null,1));

const paths=[...tapPath].sort();
fs.writeFileSync(path.join(__dirname,'..','spec','duong-dan-lenh.json'), JSON.stringify(paths,null,1));
console.log('Muc cap 1:', cay.length, '| Duong dan lenh duy nhat:', paths.length);
console.log('20 duong dan dau:', JSON.stringify(paths.slice(0,20)));
