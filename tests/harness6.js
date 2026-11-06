// Headless test for Molten Mill v6. Usage: node harness5.js [simMinutes] [bot|cheat|idle] [file]
// env: LAYOUT=1 (layout/label report only), PACE=1 (phase timing table), RT=1 (save round trip), V4SAVE=1
const fs=require('fs'),path=require('path');
const MIN=+process.argv[2]||40, MODE=process.argv[3]||'bot', FILE=process.argv[4]||'../index.html', DT=1/30;
const html=fs.readFileSync(path.join(__dirname,FILE),'utf8');
const code=html.slice(html.indexOf('<script>')+8,html.lastIndexOf('</script>'));
const TWF=+process.env.TWF||1.1;
const TW=(s,font)=>{const m=/(\d+(?:\.\d+)?)px/.exec(font||'')||[0,10];const px=+m[1];let w=0;for(const ch of ''+s)w+=ch===' '?.3:/[A-ZÆØÅ0-9]/.test(ch)?.68:/[.,:·'|]/.test(ch)?.3:.56;return w*px*TWF};
global.TW=TW;
const ctxProxy=()=>new Proxy({},{get(t,k){if(k in t)return t[k];if(k==='measureText')return s=>({width:TW(s,t.font)});
 if(k==='createRadialGradient'||k==='createLinearGradient')return()=>({addColorStop(){}});if(k==='createPattern')return()=>({});
 return function(){}},set(t,k,v){t[k]=v;return true}});
function el(id){return{id,style:{},dataset:{},hidden:false,children:[],closest:()=>null,querySelector:()=>null,classList:{_s:new Set(),add(c){this._s.add(c)},remove(c){this._s.delete(c)},toggle(c,f){(f===undefined?!this._s.has(c):f)?this._s.add(c):this._s.delete(c)},contains(c){return this._s.has(c)}},innerHTML:'',textContent:'',
 getBoundingClientRect:()=>({left:0,top:0,width:390,height:780,right:390,bottom:780}),addEventListener(){},focus(){},setAttribute(){},setPointerCapture(){},getContext:()=>ctxProxy(),width:0,height:0,offsetWidth:1,clientWidth:390,scrollLeft:0}}
let els={};const store=new Map();
/* game language for node tests: GLANG=en|no (default Norwegian, which the older string checks expect) */
const GLANG=process.env.GLANG==='en'?'en':'no';
global.window=global;
global.document={getElementById:i=>els[i]||(els[i]=el(i)),createElement:()=>el('canvas'),addEventListener(){},documentElement:{},hidden:false};
global.getComputedStyle=()=>({getPropertyValue:()=>''});
global.matchMedia=()=>({matches:false});
global.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,''+v),removeItem:k=>store.delete(k)};
global.requestAnimationFrame=()=>0;global.setInterval=()=>0;global.setTimeout=()=>0;global.addEventListener=()=>{};global.devicePixelRatio=2;
global.ResizeObserver=class{observe(){}};global.performance=global.performance||{now:()=>Date.now()};
Object.defineProperty(global,'navigator',{value:{vibrate(){}},configurable:true});
global.AudioContext=undefined;
let errors=0;const origErr=console.error;console.error=(...a)=>{errors++;if(errors<5)origErr('[console.error]',...a)};
if(process.env.SEED){let sd=+process.env.SEED;Math.random=()=>(sd=(sd*16807)%2147483647)/2147483647}
function boot(){delete global.__smeltOn;els={};store.set('molten.lang',GLANG);new Function(code)();const W=global.__smelt;W.endIntro();return W}
module.exports={boot,store,TW,DT,errorsRef:()=>errors};
if(require.main!==module)return;

// ---------- static layout + label checks ----------
/* all status texts: literals from status() plus the composed ones, each at its longest */
/* every status text in the current language: each t_('…') template in status(), filled with every argument it can get */
const STATUS_TEXTS=(()=>{const W0=boot();delete global.__smeltOn;const src=code.slice(code.indexOf('function status(id)'),code.indexOf('const steelIn'));const o=new Set();
 const args=[...['kalk/dolo','oksygen','kull','koks','cowpere','blokkstøping','streng','øseovn','kø','kran','emner','stenger','valstråd','armering'].map(x=>W0.t_(x)),'999,9','9 999','8'];
 for(const m of src.matchAll(/t_\('([^']+)'/g)){const k=m[1];if(k.indexOf('{0}')<0){o.add(W0.t_(k));continue}for(const a of args)o.add(W0.t_(k,a))}
 o.add('9 999 t/min');return[...o]})();
const layoutIssues=[],labelIssues=[];
function padRects(W){W.layoutPads();const R=[];for(const d of W.PADS){if(!W.vis(d)&&!W.padMaks(d))continue;const L=W.padLab(d);R.push({id:'pad:'+d.id,x:d.x-L.s,y:d.y-L.s,w:2*L.s,h:2*L.s,pad:1,d});R.push({id:'padlab:'+d.id,own:'pad:'+d.id,x:L.x,y:L.y,w:L.w,h:L.h,lab:1})}return R}
function worldRects(W){const R=padRects(W),S=W.S;
 const lab=(id,own,x,y,w,h)=>R.push({id,own,lab:1,x,y,w,h});
 for(const s of W.SW)if(s.on())R.push({id:'sw:'+s.id,x:s.x-38,y:s.y-24,w:76,h:44,pad:1});
 for(const z of W.ZONES){if(z.on?!z.on():!(!z.b||W.B_(z.b)))continue;const p=W.zonePlate(z),pw=W.plateW(p);lab('plate:'+z.id,'plate:'+z.id,p.x,p.y,pw,p.h);
  /* status chip: every status text the game can show, at its widest after the chip clamping (zone edge / gauge) */
  let best=null;for(const t of STATUS_TEXTS){const c=W.chipLayout(z,t);if(!best||c.w>best.w)best=c}
  if(best&&!/^(salg1|salg2|utlast)$/.test(z.id)){lab('chip:'+z.id,'plate:'+z.id,best.x,best.y,best.w,20);if(best.x+best.w>z.x1-6)R.push({id:'chipEdge:'+z.id,lab:1,x:best.x,y:best.y,w:best.w,h:20,edge:1})}}
 R.push({id:'gauge2',own:'gauge',x:W.GAUGE.x-60,y:W.GAUGE.y-22,w:120,h:48,pad:1});
 const ring=(id,x,y,r)=>R.push({id,own:id,ring:1,x:x-r,y:y-r,w:2*r,h:2*r});
 const P=W.POS;ring('ring:drop',P.drop.x,P.drop.y,40);ring('ring:tap',P.tapPad.x,P.tapPad.y,38);ring('ring:bil1',P.bil1.x,P.bil1.y,40);ring('ring:plate',P.plate.x,P.plate.y,36);
 for(const z of W.TG)if(z.open()&&!['drop','bil1','plate'].includes(z.id))ring('ring:'+z.id,z.x,z.y,40);
 for(const k of W.PRK){if(!W.prodOn(k))continue;const p=W.PR[k].pile;R.push({id:'pile:'+k,own:'pile:'+k,x:p.x-42,y:p.y-34,w:84,h:68,pile:1});lab('pilelab:'+k,'pile:'+k,p.x-44,p.y+38,88,30)}
 for(const s of W.SRC)if(s.store&&s.open()){const w=s.store==='elek'?116:96;R.push({id:'store:'+s.id,own:'store:'+s.id,x:s.x-w/2,y:s.y-47,w,h:75,pile:1})}
 if(!W.rjClosed()){R.push({id:'track',x:-340,y:W.POS.torpA-16,w:W.POS.torpX1+410,h:62,machine:1});ring('ring:skip',P.skip.x,P.skip.y,40)}
 if(W.usesHM())R.push({id:'hmladle',own:'hmladle',x:P.hmL.x-36,y:P.hmL.y-30,w:72,h:76,pile:1});
 R.push({id:'koklag',own:'koklag',x:P.koklag.x-80,y:P.koklag.y-49,w:160,h:83,pile:1});
 lab('gauge','gauge',966-60,356-22,120,48);
 for(const s of W.SOLIDS())R.push(s.r?{id:'solid',x:s.x-s.r,y:s.y-s.r,w:2*s.r,h:2*s.r,machine:1,circ:s}:{id:'solid',x:s.x,y:s.y,w:s.w,h:s.h,machine:1});
 return R}
function hit(a,b,M){return a.x+M<b.x+b.w&&b.x+M<a.x+a.w&&a.y+M<b.y+b.h&&b.y+M<a.y+a.h}
function layoutCheck(W,tag){const R=worldRects(W),out=[];
 for(let i=0;i<R.length;i++)for(let j=i+1;j<R.length;j++){const a=R[i],b=R[j];if(a.own&&a.own===b.own)continue;if(a.own===b.id||b.own===a.id)continue;
  let rep=false;if(a.lab&&b.lab)rep=true;else if((a.lab&&(b.pad||b.machine||b.pile))||(b.lab&&(a.pad||a.machine||a.pile)))rep=true;else if(a.pad&&b.pad)rep=true;else if((a.pad&&(b.ring||b.machine||b.pile))||(b.pad&&(a.ring||a.machine||a.pile)))rep=true;
  if(rep&&hit(a,b,2))out.push(tag+' overlap: '+a.id+' × '+b.id)}
 for(const r of R)if(r.edge)out.push(tag+' label chip past zone edge: '+r.id);
 for(const r of R)if(r.lab&&(r.x<W.WX0+12||r.y<12||r.x+r.w>W.WW-12||r.y+r.h>W.WH-12))out.push(tag+' label off map: '+r.id);
 /* pads inside their station zone */
 for(const d of W.PADS){if(!W.vis(d)||d.kind==='prestige')continue;const zid=d.kind==='build'?W.nextBuild().z:d.st;const z=W.ZN[zid];if(!W.inZone(z,d.x,d.y,26))out.push(tag+' pad outside zone: '+d.id+' in '+zid)}
 for(const k of W.PRK){if(!W.prodOn(k))continue;const p=W.PR[k].pile,z=W.ZN[W.PR[k].z];if(!W.inZone(z,p.x,p.y,30))out.push(tag+' pile outside zone: '+k)}
 /* reachability of every pad, ring and source from the start */
 W.rebuildNav();const f=W.field(W.START.x,W.START.y),NC=20,GW=Math.ceil((W.WW-W.WX0)/NC);
 const reach=(x,y)=>{for(let dj=-2;dj<=2;dj++)for(let di=-2;di<=2;di++){const i=Math.floor((x-W.WX0)/NC)+di,j=Math.floor(y/NC)+dj;if(i<0||j<0||i>=GW)continue;if(f[j*GW+i]>=0)return true}return false};
 for(const d of W.PADS)if(W.vis(d)&&!reach(d.x,d.y))out.push(tag+' unreachable pad: '+d.id);
 for(const z of W.TG)if(z.open()&&!reach(z.x,z.y))out.push(tag+' unreachable target: '+z.id);
 for(const s of W.SRC)if(s.open()&&!reach(s.x,s.y))out.push(tag+' unreachable source: '+s.id);
 for(const d of W.PADS)if(W.vis(d)&&d.kind!=='build'&&W.blockedPt(d.x,d.y,4))out.push(tag+' pad in solid: '+d.id);
 return out}
{const seen=new Set();const B=boot().BUILDS.length;delete global.__smeltOn;
 for(let ph=0;ph<=B;ph++)for(const late of[0,1]){const W=boot();W.S.heats=99;W.S.st.slagT=999;if(ph)W.build(W.BUILDS[ph-1].id);
  if(late){for(const u of W.UP)if(['malmkran','torpn','koks','cowper','sinter','kran','magkran','varm','rullkob','ktrans','kalk','o2','kull','lans','kanal','hette','yard2','elekkran','slaggbil'].includes(u.id))W.S.lv[u.id]=Math.max(W.S.lv[u.id]||0,u.max>2?3:1);W.setLv('ladle',2);W.setLv('strands',7);W.bakeFloor();W.rebuildSolids()}
  /* one pad per upgrade: every available upgrade must have a visible pad in its station row (no row overflow) */
  const o=layoutCheck(W,'ph'+ph+(late?'L':''));W.layoutPads();
  for(const u of W.UP){const d=W.PAD['u_'+u.id];if(W.upAvail(u)&&!W.vis(d))o.push('ph'+ph+(late?'L':'')+' layout: available upgrade without a pad: '+u.id);if(!W.upOpen(u)&&W.vis(d))o.push('ph'+ph+' layout: era-locked upgrade shown: '+u.id)}
  /* fully maxed station rows (MAKS tiles) must fit too */
  {const keep=JSON.stringify(W.S.lv);for(const u of W.UP)if(W.upOpen(u))W.S.lv[u.id]=u.max;for(const m of layoutCheck(W,'ph'+ph+(late?'L':'')+'max'))if(/padlab:u_|pad:u_/.test(m))o.push(m);W.S.lv=JSON.parse(keep);W.layoutPads()}
  for(const m of o){const key=m.replace(/^\S+ /,'');if(!seen.has(key)){seen.add(key);(m.indexOf('label')>=0||m.indexOf('lab')>=0?labelIssues:layoutIssues).push(m)}}delete global.__smeltOn}}
if(process.env.LAYOUT){console.log(labelIssues.length+' label issues\n '+labelIssues.join('\n '));console.log(layoutIssues.length+' layout issues\n '+layoutIssues.join('\n '));process.exit(0)}
if(process.env.V4SAVE)store.set('smelteverket.v4',JSON.stringify({v:4,money:1234,earned:2.5e6,life:3e6,heats:90}));
if(process.env.V5SAVE)store.set('smelteverket.v5',JSON.stringify({v:5,money:99999,earned:4e8,life:6e8,heats:900,b:{lf:1,eaf1:1}}));
const W=boot();const P=W.P;
if(process.env.V4SAVE||process.env.V5SAVE)console.log('old-save bonus money',W.S.money,'bonusGiven',W.S.bonusGiven,'ph',W.S.ph,'b',JSON.stringify(W.S.b));

// ---------- invariants ----------
const routeTrips={};let trips=0,tripBad=0,loadedToSrc=0,nanHits=0,tgtBad=0;const prev=new Map();
function checkHelpers(){for(const h of W.helpers){const p=prev.get(h)||{state:h.state,n:h.stack.length,tg:h.tg};
  if(h.state==='toSrc'&&h.stack.length)loadedToSrc++;
  if(p.state==='unload'&&h.state!=='unload'){trips++;routeTrips[h.r]=(routeTrips[h.r]||0)+1;if(h.stack.length)tripBad++;if(p.tg&&Math.hypot(h.x-p.tg.x,h.y-p.tg.y)>p.tg.r+30)tgtBad++}
  if(!isFinite(h.x)||!isFinite(h.y))nanHits++;
  prev.set(h,{state:h.state,n:h.stack.length,tg:h.tg})}}
// ---------- bot ----------
const J=W.J;
function goTo(x,y,tol){const d=Math.hypot(x-P.x,y-P.y);if(d<(tol||12)){J.on=false;return true}const w=W.navStep(P,x,y);const dx=w.x-P.x,dy=w.y-P.y,m=Math.hypot(dx,dy)||1;
 J.on=true;J.virt=true;J.ox=200;J.oy=400;const k=Math.min(48,Math.max(14,d));J.x=200+dx/m*k;J.y=400+dy/m*k;return false}
let botIdle=0;
function nearSrc(){for(const s of W.SRC)if(s.open()&&Math.hypot(P.x-s.x,P.y-s.y)<s.r)return s;return null}
function choose(){const S=W.S,n=P.stack.length;
 if(!S.lv.operator&&W.F.state==='ready'&&W.tapLadle())return{x:W.POS.tapPad.x,y:W.POS.tapPad.y,tol:12,k:'tap'};
 const g0=W.goal();if(g0.k==='slag'&&g0.x!=null)return{x:g0.x,y:g0.y,tol:14,k:'slag'};
 const bt=W.buyTarget();if(bt)return{x:bt.d.x,y:bt.d.y,tol:8,k:'buy'};
 if(n&&n<W.capCarry()){const s=nearSrc();if(s&&W.count(s)>0&&P.stack.filter(i=>i.k===s.kind).length<W.demand(s.kind)&&(s.kind===P.stack[n-1].k||n<2))return{x:P.x,y:P.y,tol:999,k:'pick'}}
 if(g0.k==='cash'&&g0.x!=null)return{x:g0.x,y:g0.y,tol:20,k:'cash'};
 if(n){const t=W.carryTask();if(t)return{x:t.x,y:t.y,tol:12,k:'carry'}}
 if(MODE==='bot'&&W.presGain()>=1&&W.vis(W.PAD.prestige)&&process.env.PRES)return{x:W.PAD.prestige.x,y:W.PAD.prestige.y,tol:8,k:'pres'};
 const t=W.carryTask();if(t)return{x:t.x,y:t.y,tol:12,k:'src'};
 /* automated eras (Phase 2): nothing to carry – sit at the furnace desk in the control room like a player would */
 if(W.AUTO&&W.AUTO()){const d=W.CRDESK.furnace;if(W.G.ctl!=='furnace'&&Math.hypot(P.x-d.x,P.y-d.y-30)<40){J.on=false;W.setCtl('furnace')}return W.G.ctl==='furnace'?{x:P.x,y:P.y,tol:999,k:'desk'}:{x:d.x,y:d.y+30,tol:10,k:'desk'}}
 return null}
let task=null,taskT=0,simT=0,presDone=0;
function botStep(){simT+=DT;/* like a player: tap a locked pad only when it is the one we came to buy */{const bt=W.buyTarget();if(bt&&Math.hypot(bt.d.x-P.x,bt.d.y-P.y)<20)W.padUnlock()}
 if(!task||simT>taskT||Math.hypot(task.x-P.x,task.y-P.y)<task.tol){task=choose();taskT=simT+2}
 if(!task){J.on=false;botIdle+=DT;return}
 if(task.k==='pres'&&Math.hypot(task.x-P.x,task.y-P.y)<task.tol&&W.G.modal){W.doPrestige();W.closeModal();presDone++;task=null;return}
 goTo(task.x,task.y,task.tol)}
// ---------- run ----------
const DG={};let t=0,sim=MIN*60,log=[],nextLog=60,exc=0;const phT={0:0},eraT={};let lastPh=0;const firstBuy={};let firstUp=null;
const CHEAT=MODE.startsWith('cheat');
if(CHEAT){const S=W.S;S.money=1e7;S.heats=40;S.st.slagT=999;W.build('vv');for(const st in W.HIRE)W.hire(st,W.HIRE[st].costs.length);
 for(const [id,n] of Object.entries({koks:8,cowper:8,malmkran:4,torp:4,torpn:1,rjsize:6,skip:4,malmtog:6,operator:1,hcap:4,hspeed:4,furnace:6,power:6,charge:6,kran:6,yard:6,yard2:1,kokup:6,kran2:5,ladle:2,strands:7,caster:6,gjvup:6,vvup:6,kalk:8,o2:8,kanal:1,hette:1,lfq:5,lft:5,osekran:3,magkran:2,torch:1,turret:1,slagcap:2,elekkran:1}))W.setLv(id,n);W.bakeFloor()}
const t0=Date.now();let craneManT=0;
while(t<sim){try{if(MODE!=='idle')botStep();
  /* exercise manual crane override in cheat mode */
  if(CHEAT){const m=t/60;if(Math.abs(m-2)<DT/60&&!global.__crT){global.__crT=1;W.P.x=300;W.P.y=600;const ch=W.craneHere();if(process.env.DBG)console.log("crane?",ch&&ch.id,W.G.crane,W.S.lv.kran);if(ch)W.toggleCrane()}if(W.G.crane){craneManT+=DT;const c=W.CRm[W.G.crane];const j=c.job;const tg=j?(c.state==='toPick'?j.from:j.to):null;if(tg){const dx=tg.x-c.x,dy=tg.y-c.y,d=Math.hypot(dx,dy)||1;J.on=true;J.virt=true;J.ox=200;J.oy=400;J.x=200+dx/d*40;J.y=400+dy/d*40}}if(m>=3&&W.G.crane&&global.__crT===1){global.__crT=2;W.toggleCrane()}}
  W.update(DT);if(((t*30)|0)%45===0)W.draw();}catch(e){exc++;if(exc<4)console.log('EXC',e.stack)}
 checkHelpers();t+=DT;const S=W.S;
 if(process.env.STUCK){global.__ps=global.__ps||{x:0,y:0,t:0};const ps=global.__ps;if(Math.hypot(P.x-ps.x,P.y-ps.y)>8){ps.x=P.x;ps.y=P.y;ps.t=t}else if(t-ps.t>15&&task&&Math.hypot(task.x-P.x,task.y-P.y)>40&&!global.__pr){global.__pr=1;console.log('STUCK at',(t/60).toFixed(1),'min P',P.x.toFixed(0),P.y.toFixed(0),'v',P.vx.toFixed(1),P.vy.toFixed(1),'modal',!!W.G.modal,'crane',W.G.crane,'map',W.G.mapOn,'wpt',JSON.stringify(W.navStep(P,task.x,task.y)),'task',JSON.stringify(task),'J',JSON.stringify(J),'blocked',W.blockedPt(P.x,P.y,0),'solids',JSON.stringify(W.SOLIDS().filter(o=>Math.abs((o.x+(o.w||0)/2)-P.x)<200&&Math.abs((o.y+(o.h||0)/2)-P.y)<200)))}}
 if(process.env.TRACE&&t>=+process.env.TRACE*60&&Math.abs((t%20))<DT){console.log('T',(t/60).toFixed(1),W.F.state,W.LADLES.map(l=>l.state+'/'+l.next+':'+l.steel.toFixed(1)).join(' '),'cast',S.cast,'run',W.CAST.run.length,'bed',W.CAST.bed.length,'gap',W.CAST.gap.toFixed(1),'crane',W.CRm.ose.state,'hm',S.hm.toFixed(0),JSON.stringify(W.TORPS.map(t=>[t.st,Math.round(t.x),+t.load.toFixed(1),+t.wait.toFixed(1)])),'rj',W.RJ.rate.toFixed(2),S.rj.hearth.toFixed(1),S.rj.ore.toFixed(0),'tg',S.tg.rj,'F',W.F.bath.toFixed(1),W.F.solid.toFixed(1),S.chg.toFixed(1),W.F.scIn.toFixed(1),'need',W.hmNeed().toFixed(1),'smin',W.scrapMin().toFixed(1),'smax',W.scrapMax().toFixed(1),W.fcap())}
 if(process.env.DIAGAT&&t>=+process.env.DIAGAT*60){const F=W.F;const ks=['F:'+F.state+(F.state==='melt'?(F.solid>0?'+melt':'+empty')+(F.lim?'(lim '+F.lim+')':''):'')+(F.state==='ready'&&!W.tapLadle()?'+noLadle':''),'crane:'+W.CRm.ose.state,'pit:'+W.PIT.state,'task:'+(task?task.k:'none')];for(const k of ks)DG[k]=(DG[k]||0)+DT}if(!isFinite(S.money)||!isFinite(S.earned)||!isFinite(W.F.bath)||!isFinite(W.F.solid)||!isFinite(S.chg))nanHits++;
 if(firstUp==null&&Object.keys(S.lv).some(k=>S.lv[k]>0))firstUp=t;
 if(global.__presT==null&&W.presGain()>=1&&S.ph>=W.BUILDS.length)global.__presT=t;
 if(S.ph!==lastPh){const key=(S.pres.n?'r'+(S.pres.n+1)+':':'')+S.ph;if(phT[key]==null)phT[key]=t;lastPh=S.ph}
 if(eraT[W.era()]==null&&!S.pres.n)eraT[W.era()]=t;
 if(CHEAT){const m=t/60;
  if(Math.abs(m-4)<DT/60){W.build('kai');for(const st in W.HIRE)W.hire(st,W.HIRE[st].costs.length);for(const id of['rullkob','ktrans','varm','bjelke','stelmor','splitt'])W.setLv(id,1);/* Phase 3: endless line + robot cells so every product is made */for(const[id,n]of[['endless',1],['elspd',8],['loop',2],['robot',1],['robspd',6],['pass',1],['insp',1],['tdheat',2]])W.setLv(id,n);W.rebuildSolids();W.bakeFloor()}
  if(Math.abs(m-1)<DT/60)S.tg.rj=0;if(Math.abs(m-2)<DT/60)S.tg.rj=1;
  if(Math.abs(m-5)<DT/60)S.cast='blokk';if(Math.abs(m-8)<DT/60)S.cast='strang';if(Math.abs(m-11)<DT/60)S.cast='auto';
  if(Math.abs(m-6)<DT/60){S.tg.strang=0;S.tg.tc=0}if(Math.abs(m-9)<DT/60){S.tg.strang=1;S.tg.tc=1;S.tg.stel=0}if(Math.abs(m-12)<DT/60){S.tg.tc=0;S.tg.endl=0}if(Math.abs(m-17)<DT/60)S.tg.endl=1;if(Math.abs(m-16)<DT/60){S.tg.stel=1;S.tg.tc=1}
  if(Math.abs(m-7)<DT/60)S.mix='vals';if(Math.abs(m-12)<DT/60)S.mix='arm';if(Math.abs(m-14)<DT/60)S.mix='begge';
  if(Math.abs(m-14)<DT/60){S.lv.slaggbil=0;S.pot=W.potMax()}if(Math.abs(m-15.5)<DT/60)S.lv.slaggbil=1}
 if(t>=nextLog){nextLog+=CHEAT?120:(MIN>100?900:180);const owned=Object.values(S.lv).reduce((a,b)=>a+b,0);
  log.push(`${(t/60).toFixed(0).padStart(4)}m ph=${S.ph} era=${W.era()} money=${S.money.toExponential(2)} earned=${S.earned.toExponential(2)} heats=${S.heats} lvl=${S.lvl+1} helpers=${W.helpers.length} up=${owned} idle=${(W.G.idleT).toFixed(0)}s rate/min=${(S.rate*60).toExponential(2)} melt=${W.rate('melt').toFixed(1)}t/min lim=${W.F.lim||'-'} bn=${W.bottlenecks().map(b=>b[0]+":"+b[1]).join("|")} hm=${W.S.hm.toFixed(0)} rj=${(W.RJ.rate*60).toFixed(1)} rec=${(W.recommend()||{d:{}}).d.id}`+(process.env.PAID?' paid='+JSON.stringify(Object.entries(S.paid).filter(e=>e[1]>1).map(e=>e[0]+':'+Math.round(e[1])))+' task='+(task&&task.k)+' bt='+((W.buyTarget()||{d:{}}).d.id)+' goal='+W.goal().sub:''))}}
const S=W.S;
if(process.env.DUMP){const F=W.F;console.log('TORPS',JSON.stringify(W.TORPS),'RJ',JSON.stringify({r:W.RJ.rate,h:S.rj.hearth,ore:S.rj.ore,tg:S.tg.rj,ov:W.RJ.overflow,need:W.hmNeed(),hmCap:W.hmCap(),cap:W.fcap(),scrapMin:W.scrapMin()}));console.log('RATE',W.furnRate(),W.Rpow(),JSON.stringify(W.F.sup),W.F.rate,W.F.state,JSON.stringify(W.F.ch),W.F.hmCh,W.supCap('o2'),JSON.stringify(S.lv.o2));console.log('DUMP F scIn',F.scIn,'hmIn',F.hmIn,'S.hm',S.hm,'scrapMax',W.scrapMax(),F.state,F.bath.toFixed(1),F.solid.toFixed(1),'chg',S.chg,'chgCap',W.chgCap(),'ch',JSON.stringify(F.ch),'stop',F.stop,'pot',S.pot,'elek',S.elek,'lim',F.lim);console.log('ladles',JSON.stringify(W.LADLES.map(l=>({s:l.state,n:l.next,st:+l.steel.toFixed(1),x:Math.round(l.x),y:Math.round(l.y),slot:l.slot,atTap:l.atTap}))));const c=W.CRm.ose;console.log('crane',c.state,Math.round(c.x),Math.round(c.y),'man',c.man,'job',c.job&&JSON.stringify({f:c.job.from,t:c.job.to}),'G.crane',W.G.crane);console.log('goal',JSON.stringify(W.goal()),'task',JSON.stringify(task),'P',Math.round(P.x),Math.round(P.y),'stack',P.stack.map(i=>i.k).join(','));console.log('pit',W.PIT.state,'cast',JSON.stringify({gap:W.CAST.gap}),'tapLadle',!!W.tapLadle(),'cast mode',S.cast,'kok',JSON.stringify(S.kok))}
console.log(log.join('\n'));if(process.env.DIAGAT)console.log('DIAG',Object.entries(DG).sort((a,b)=>b[1]-a[1]).map(e=>e[0]+'='+e[1].toFixed(0)).join(' '),'\nfcap',W.fcap(),'Rpow',W.Rpow().toFixed(2),'chgCap',W.chgCap(),'yard',W.yardT(W.SRCm.y0).toFixed(0));
console.log('Nytt verk ready at (min):',global.__presT!=null?(global.__presT/60).toFixed(1):'-');console.log('phase times (min):',Object.entries(phT).map(([c,v])=>c+':'+(v/60).toFixed(1)).join(' '),' firstUpgrade(s):',firstUp&&firstUp.toFixed(0));console.log('era times (min, first run):',Object.entries(eraT).map(([c,v])=>['Bessemer','SM','LD','EAF','UHP','Consteel'][c]+':'+(v/60).toFixed(1)).join(' '));
console.log('prod',JSON.stringify(S.st.prod),'\nsoldK',JSON.stringify(S.st.soldK),'\ncastB',S.st.castB,'castS',S.st.castS,'slagStops',S.st.slagStops,'recovered',W.G.slagRecover,'stopNow',W.F.stop,'craneManSec',craneManT.toFixed(0));
console.log('ladles',W.LADLES.map(l=>l.state+':'+l.steel.toFixed(1)).join(' '),'nodes',Object.values(W.NODE).map(n=>n.id+':'+n.in.length+(n.cur?'*':'')).join(' '),'piles',W.PRK.map(k=>k+':'+W.PILE[k].length).join(' '));
console.log('routeTrips',JSON.stringify(routeTrips));
let presOk='skipped';if(CHEAT){try{S.earned=4.1e10;const g=W.presGain();W.doPrestige();const ok1=W.S.pres.pts===g&&W.S.money===0&&!W.S.b.kai&&W.helpers.length===0;
 for(let i=0;i<30*120;i++){botStep();W.update(DT);if(i%30===0)W.draw()}presOk=ok1&&isFinite(W.S.money)?'ok(+'+g+')':'BAD'}catch(e){presOk='EXC '+e.message}}
console.log('prestige test:',presOk);
console.log('levels',JSON.stringify(W.S.lv));
console.log('--- RESULT',MODE,MIN+'min',`(${((Date.now()-t0)/1000).toFixed(1)}s real)`);
const res={exceptions:exc,consoleErrors:errors,nanHits,money:Math.round(S.money),earned:Math.round(S.earned),sold:S.st.sold,heats:S.heats,ph:S.ph,era:W.era(),
 helpers:W.helpers.length,trips,tripEndLoaded:tripBad,tripEndAway:tgtBad,loadedToSrc,vSrcLoaded:W.G.vSrcLoaded,
 idlePct:+(100*W.G.idleT/sim).toFixed(2),botIdleSec:+botIdle.toFixed(1),layoutIssues:layoutIssues.length,labelIssues:labelIssues.length};
console.log(JSON.stringify(res));
if(layoutIssues.length)console.log('layout:\n '+layoutIssues.slice(0,40).join('\n '));if(labelIssues.length)console.log('labels:\n '+labelIssues.slice(0,40).join('\n '));
let okay=exc===0&&errors===0&&nanHits===0&&tripBad===0&&tgtBad===0&&loadedToSrc===0&&W.G.vSrcLoaded===0&&S.st.sold>0&&layoutIssues.length===0&&labelIssues.length===0;
if(S.st.slagStops>W.G.slagRecover+(W.F.stop?1:0)){okay=false;console.log('FAIL: slag stop did not recover')}
if(CHEAT){const miss=[...W.PRK,'slag'].filter(k=>k!=='pig'||!W.rjClosed()||W.S.st.prod.pig>0).filter(k=>!(S.st.soldK[k]>0)||(k!=='slag'&&!(S.st.prod[k]>0)));if(miss.length){okay=false;console.log('FAIL: not produced+sold:',miss.join(','))}
 if(!(S.st.castB>0&&S.st.castS>0)){okay=false;console.log('FAIL: both casting routes not used')}if(!(S.st.slagStops>0)){okay=false;console.log('FAIL: slag stop not exercised')}if(!(craneManT>10)){okay=false;console.log('FAIL: manual crane not exercised')}}
if(MODE==='bot'&&res.idlePct>8){okay=false;console.log('FAIL: idle too high')}
if(process.env.ERAS&&W.era()<5&&!presDone){okay=false;console.log('FAIL: not every furnace era reached')}
/* every visible string had a translation (English runs) */
if(W.I18N_MISS.size){okay=false;console.log('FAIL: untranslated:',JSON.stringify([...W.I18N_MISS].slice(0,30)))}
console.log('lang',W.LANG);console.log(okay?'PASS':'FAIL');process.exitCode=okay?0:1;
if(process.env.RT){W.save();const raw=store.get('smelteverket.v6');const before={m:Math.round(W.S.money),b:JSON.stringify(W.S.b),lv:JSON.stringify(W.S.lv),h:W.helpers.length};
 const W2=boot();const after={m:Math.round(W2.S.money),b:JSON.stringify(W2.S.b),lv:JSON.stringify(W2.S.lv),h:W2.helpers.length};
 let e2=0;for(let i=0;i<30*60;i++){try{W2.update(DT);if(i%30===0)W2.draw()}catch(e){e2++;if(e2<3)console.log(e.stack)}}
 console.log('roundtrip',before.m===after.m&&before.b===after.b&&before.lv===after.lv&&before.h===after.h?'same':'DIFF',JSON.stringify(before),JSON.stringify(after),'exc',e2,'bytes',raw.length)}
