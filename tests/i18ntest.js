// i18n + info coverage (node): every key the game can show has an English text; every UP id, HIRE id, zone, KNAME kind and
// furnace era has an explanation in both languages; no place / company names anywhere in the build.
// usage: node i18ntest.js [file]
process.env.GLANG='en';
const H=require('./harness6.js');const fs=require('fs');
const FILE=process.argv[2]||require('path').join(__dirname,'../index.html');const html=fs.readFileSync(FILE,'utf8');
let bad=0;const ok=(c,m)=>{if(!c){bad++;console.log('FAIL',m)}};
const W=H.boot();const t=W.t_,EN=W.EN;
const need=new Set();const add=s=>{if(s!=null&&/[A-Za-zÆØÅæøå]/.test(s))need.add(s)};
// data tables
W.ZONES.forEach(z=>add(z.n));Object.values(W.PR).forEach(p=>add(p.n));Object.values(W.KNAME).forEach(add);
W.ERA.forEach(e=>{add(e.n);add(e.k);add(e.pu);add(e.tt)});Object.values(W.SUPN).forEach(add);W.RJE.forEach(e=>{add(e.n);add(e.k)});
W.BUILDS.forEach(b=>{add(b.sn);add(b.n);add(b.d)});Object.values(W.HIRE).forEach(h=>add(h.n));W.SW.forEach(s=>add(s.lab));
Object.values(W.TNAME).forEach(add);Object.values(W.TOGN).forEach(add);Object.values(W.MN).forEach(m=>add(m.n));Object.values(W.PNAME).forEach(add);
Object.values(W.CASTN).forEach(add);Object.values(W.MIXN).forEach(add);W.CRANES.forEach(c=>{add(c.n);add(c.bonus)});
// literal keys in the source: t_('…') and data-i / data-ia
const code=html.slice(html.indexOf('<script>'));
for(const m of code.matchAll(/t_\('((?:[^'\\]|\\.)+)'/g))add(m[1].replace(/\\u00AD/g,'­').replace(/\\'/g,"'"));
for(const m of code.matchAll(/t_\((?:[^()]|\([^()]*\))*?\?'([^']+)':'([^']+)'/g)){add(m[1]);add(m[2])}
for(const m of html.matchAll(/data-ia?="([^"]+)"/g))add(m[1]);
// upgrade names and pad titles in every furnace era / iron era / lance level
const S=W.S;for(let e=0;e<6;e++){const ids=['sm','ld','eaf1','uhp','consteel'];S.b={};for(let i=0;i<e;i++)S.b[ids[i]]=1;if(e>=3)S.b.elrj=0;
 for(const rj of[0,1]){S.b.elrj=rj;for(const l of[0,1]){S.lv.lans=l;S.lv.sinter=l;for(const u of W.UP){const n=typeof u.n==='function'?u.n():u.n;add(n.replace(/­/g,''));
  const pt=W.padTitle(u);ok(!/[æøåÆØÅ]/.test(pt),'pad title still Norwegian: '+pt)}}}}
S.b={};S.lv={};
const miss=[...need].filter(k=>EN[k]==null&&!/§$/.test(k));
ok(miss.length===0,'keys without English: '+miss.length+'\n  '+miss.join('\n  '));
// English values must not look Norwegian
const nor=/[æøåÆØÅ]|\b(og|ikke|på|til|fra|med|som|eller|går|blir|venter|mangler|stål|ovn)\b/i;
const sus=Object.entries(EN).filter(([k,v])=>nor.test(v.replace(/Söderberg/g,'')));ok(sus.length===0,'English values that look Norwegian: '+JSON.stringify(sus.slice(0,10)));
// info texts in both languages
const IX=W.IX,two=(o,m)=>{ok(Array.isArray(o)&&o.length>=2&&o[0]&&o[1]&&o[0]!==o[1],'info missing/one language: '+m)};
for(const u of W.UP)two(IX.up[u.id],'UP '+u.id);
for(const k in W.HIRE)two(IX.hire[k],'HIRE '+k);two(IX.hire.all,'HIRE all');
for(const z of W.ZONES)two(IX.zone[z.id],'zone '+z.id);
for(const k in W.KNAME)two(IX.kind[k],'kind '+k);
ok(IX.era.length===W.ERA.length,'eras '+IX.era.length+'/'+W.ERA.length);W.ERA.forEach((e,i)=>two(IX.era[i],'era '+i));
ok(IX.rje.length===W.RJE.length,'iron eras');W.RJE.forEach((e,i)=>two(IX.rje[i],'iron era '+i));
for(const k of['conv','box','bucket','belt'])two(IX.drop[k],'drop '+k);
for(const s of W.SW)two(IX.sw[s.id],'switch '+s.id);
for(const c of W.CRANES)two(IX.crane[c.id],'crane '+c.id);
for(const z of W.TG)if(z.id!=='drop'){const o=IX.ring[z.id];ok(o&&o[0]&&o[1]&&o[2]&&o[3],'ring '+z.id)}
for(const s of W.SRC)if(!s.pile&&s.id!=='koklag'){const o=IX.ring[s.id];ok(o&&o[1]&&o[3],'source '+s.id)}
for(const k of['torp','ladle','hmL','pigm','train','desk','prestige','plot'])ok(IX.misc[k]&&IX.misc[k][1]&&IX.misc[k][3],'misc '+k);
console.log('UP',W.UP.length,'HIRE',Object.keys(W.HIRE).length,'zones',W.ZONES.length,'kinds',Object.keys(W.KNAME).length,'eras',W.ERA.length+'+'+W.RJE.length,'keys checked',need.size);
// every info bubble can be built in both languages without errors or missing keys
for(const lang of['en','no']){W.setLang(lang);for(const L of['up','hire','zone']){}
 const hs=[];for(const d of W.PADS)hs.push({type:'pad',d});for(const s of W.SW)hs.push({type:'sw',s});for(const z of W.TG)hs.push({type:z.id==='drop'?'drop':'ring',o:z});
 for(const s of W.SRC)hs.push({type:s.pile?'pile':'src',o:s});hs.push({type:'tap'},{type:'furnace'},{type:'rjf'});for(const z of W.ZONES)hs.push({type:'zone',z});
 for(const c of W.CRANES)hs.push({type:'crane',c});for(const L of W.LADLES)for(const st of['park','filling','await','carried','lf','pit','tur','cast'])hs.push({type:'ladle',L:Object.assign({},L,{state:st,steel:5,q:1.1})});for(const tp of W.TORPS)hs.push({type:'torp',t:tp});for(const k of['hmL','pigm','train'])hs.push({type:'misc',id:k});hs.push({type:'misc',id:'desk',r:'skrap'});
 for(let e=0;e<6;e++){S.b={};const ids=['sm','ld','eaf1','uhp','consteel'];for(let i=0;i<e;i++)S.b[ids[i]]=1;for(const h of hs){if(h.type==='pad'&&h.d.kind==='build'&&!W.nextBuild())continue;let r;try{r=W.infoFor(h)}catch(err){ok(false,lang+' infoFor threw '+JSON.stringify(h.type)+' '+err.message);continue}
  if(h.type==='pad'&&h.d.kind==='prestige'||r)ok(r&&r.t&&r.d,lang+' empty bubble '+h.type+' '+(h.d?h.d.id:h.o?h.o.id:h.z?h.z.id:h.c?h.c.id:h.id||''));
  if(r&&lang==='en')ok(!/[æøåÆØÅ]/.test(r.t+r.d+r.n),'Norwegian in English bubble: '+r.t+' | '+r.d+' | '+r.n)}}S.b={}}
// map, map panel, menu and HUD in both languages, with a live bottleneck (LD on 1 lime level), before and after the conversion
for(const stage of['ld','kai']){const W2=H.boot();W2.S.heats=99;W2.build(stage);W2.setLv('kalk',1);W2.setLv('o2',1);W2.setLv('koks',1);W2.setLv('cowper',1);
 for(let i=0;i<30*60;i++){W2.S.chg=W2.chgCap();W2.update(1/30)}
 for(const lang of['en','no']){W2.setLang(lang);try{W2.openMap(true);for(const m of['prod','money']){W2.mapMode(m);for(const id in W2.MN){W2.mapSel(id);W2.renderMap()}}W2.openMap(false);W2.syncMenu();W2.hud();W2.draw();
   if(stage==='ld')ok(W2.bottlenecks().length>0,'map test has a bottleneck')}catch(err){ok(false,stage+' '+lang+' map/menu threw: '+err.message)}}
 W2.setLang('en');ok(W2.I18N_MISS.size===0,'map misses: '+JSON.stringify([...W2.I18N_MISS]))}
W.setLang('en');ok(W.I18N_MISS.size===0,'runtime misses: '+JSON.stringify([...W.I18N_MISS]));
// no towns, countries, companies or the developer anywhere in the game
/* forbidden real-world names (places, people, companies) are kept encoded so they don't appear in the repo */
for(const re of Buffer.from('TW8gaSBSYW5hClxiUmFuYVxiCk5vcmdlfE5vcndheXxOb3J3ZWdpYW4oPyEgYm9rbcOlbCkKQ2Vsc2EKNy0/c3RlZWwKTm9yc2sgSmVybnZlcmsKVGVub3ZhCkRhbmllbGkKw5hyamFuCkVsa2VtClN0ZWluYmFra2Vu','base64').toString('utf8').split('\n').map(w=>new RegExp(w,'i'))){
 const m=html.replace(/\/\*[\s\S]*?\*\//g,'').match(re);ok(!m,'forbidden name in build: '+re+' → '+(m&&m[0]))}
console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0;
