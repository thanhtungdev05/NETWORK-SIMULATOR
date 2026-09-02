const fs=require('fs'), path=require('path');
const cay = JSON.parse(fs.readFileSync(path.join(__dirname,'..','spec','menu-tree.json'),'utf8'));
const map = new Map();               // "119,3" -> {path, titles:Set, types:Set}
const duyet = (n, tram) => {
  const t = n.title ? tram.concat(n.title) : tram;
  if (n.path) {
    const k = JSON.stringify(n.path);
    if (!map.has(k)) map.set(k, {path:n.path, duongMenu:new Set(), kieu:new Set()});
    map.get(k).duongMenu.add(t.join(' >> ')); if(n.type) map.get(k).kieu.add(n.type);
  }
  (n.c||[]).forEach(x=>duyet(x,t));
};
for (const m of cay) duyet({title:m.title, c:m.c}, []);
const ds = [...map.values()].map(v=>({path:v.path, duongMenu:[...v.duongMenu], kieu:[...v.kieu]}))
  .sort((a,b)=>a.path[0]-b.path[0] || (a.path[1]||0)-(b.path[1]||0));
fs.writeFileSync(path.join(__dirname,'..','spec','duong-dan-lenh.json'), JSON.stringify(ds,null,1));
console.log('Duong dan lenh DUY NHAT:', ds.length);
const kieu={}; for(const d of ds) for(const k of d.kieu) kieu[k]=(kieu[k]||0)+1;
console.log('KIEU:', JSON.stringify(kieu));
console.log(JSON.stringify(ds.slice(0,6),null,1));
