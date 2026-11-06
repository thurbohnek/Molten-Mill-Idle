// Save/load round trip mid-action: steel and iron are conserved (within the rounding the save format allows),
// nobody is restored inside a solid, and nothing is duplicated.
const {boot:boot0,store,DT}=require('./harness6.js');const boot=()=>boot0();
let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
const upto=(W,id)=>{for(const b of W.BUILDS){if(W.B_(b.id))continue;W.build(b.id);if(b.id===id)break}};
function run(W,sec,tap){for(let i=0;i<sec/DT;i++){W.update(DT);if(tap&&W.F.state==='ready'&&!W.lv('operator'))W.startTap()}}
function until(W,fn,max){for(let i=0;i<(max||300)/DT;i++){if(fn(W))return true;W.update(DT);if(W.F.state==='ready'&&!W.lv('operator'))W.startTap()}return false}
const tOf=a=>a.reduce((s,it)=>s+(it.t||0),0);
function inv(W){const S=W.S,F=W.F;let steel=F.bath-(F.state==='tapping'?F.tapAmt:0)+F.solid+(F.ch?(F.ch.hm!=null?F.ch.s+F.ch.hm:F.ch.done?0:F.ch.amt):0)+(F.hmCh?F.hmCh.amt:0)+S.chg;
 for(const L of W.LADLES)steel+=L.state==='filling'&&F.state==='tapping'&&F.L===L?F.tapAmt:L.steel;
 if(W.PIT.n&&W.PIT.state!=='idle'&&W.PIT.state!=='prep')steel+=W.PIT.state==='pour'?W.PIT.pourTot*W.PIT.fill/(1+.06):W.PIT.n*W.PIT.ingT;
 steel+=tOf(W.CAST.run)+tOf(W.CAST.bed.map(b=>b.it));for(const k of W.PRK)if(k!=='pig')steel+=tOf(W.PILE[k]);
 for(const id in W.NODE){const n=W.NODE[id];steel+=tOf(n.in)+(n.cur?n.cur.t:0)}steel+=tOf(W.movers.map(m=>m.it));
 for(const h of [W.P,...W.helpers])steel+=tOf(h.stack.filter(i=>W.PRK.indexOf(i.k)>=0&&i.k!=='pig'));
 let iron=S.hm+S.rj.hearth+W.RJ.pigAcc+tOf(W.PILE.pig);for(const t of W.TORPS)iron+=t.load;for(const h of [W.P,...W.helpers])iron+=tOf(h.stack.filter(i=>i.k==='pig'));
 const K=S.kok;let moulds=K.slots+K.hot+K.ready+K.cool.length+W.PIT.n;for(const h of [W.P,...W.helpers])moulds+=h.stack.filter(i=>i.k==='kokk'||i.k==='kokv').length;
 return{steel,iron,moulds,money:S.money}}
function roundtrip(W,name,tol){const a=inv(W);const pos=W.helpers.map(h=>[h.r,Math.round(h.x),Math.round(h.y)]);W.save();const raw=store.get('smelteverket.v6');
 const W2=boot();const b=inv(W2);const dS=b.steel-a.steel,dI=b.iron-a.iron;
 ok(Math.abs(dS)<=tol.steel&&Math.abs(dI)<=tol.iron,`${name}: steel ${a.steel.toFixed(1)} → ${b.steel.toFixed(1)} (Δ${dS.toFixed(1)}, tol ${tol.steel}) · iron ${a.iron.toFixed(1)} → ${b.iron.toFixed(1)} (Δ${dI.toFixed(1)})`);
 ok(b.moulds===a.moulds,`${name}: moulds ${a.moulds} → ${b.moulds}`);
 ok(Math.abs(b.money-a.money)<1,`${name}: money kept (${Math.round(a.money)} → ${Math.round(b.money)})`);
 const inSolid=[W2.P,...W2.helpers].filter(h=>W2.blockedPt(h.x,h.y,0));ok(inSolid.length===0,`${name}: nobody restored inside a solid (${inSolid.length})`);
 let e=0;for(let i=0;i<60/DT;i++){try{W2.update(DT)}catch(err){e++}}ok(e===0,`${name}: runs on after the reload without exceptions`);return W2}
const IT=W=>2*(1+.25*W.lv('kokbig'));
/* A: mid-tap (converter → ladle), hot metal on the way in a torpedo car, helpers carrying */
{store.delete('smelteverket.v6');const W=boot();W.S.moved=true;W.S.heats=99;upto(W,'ld');W.setLv('kalk',8);W.setLv('o2',8);W.setLv('koks',12);W.setLv('cowper',12);W.setLv('malmkran',6);W.setLv('kran',6);W.setLv('h_rj',3);W.setLv('h_skrap',3);W.setLv('h_blokk',3);W.setLv('h_ovn',2);W.setLv('ladle',1);W.setLv('torpn',1);W.S.money=5000;
 run(W,120,true);ok(until(W,W=>W.F.state==='tapping'&&W.F.tapT>1&&W.F.tapT<1.6,400),'A: reached mid-tap');
 const heat=W.F.tapAmt;console.log('A: tapAmt',heat.toFixed(1),'torps',W.TORPS.map(t=>t.st+':'+t.load.toFixed(1)).join(' '),'helpers carrying',W.helpers.reduce((s,h)=>s+h.stack.length,0));
 roundtrip(W,'A mid-tap',{steel:IT(W)*(1+W.LADLES.length)+1,iron:3.5})}
/* B: mid-pour at the ingot pit, a loaded ore helper, hot moulds carried */
{store.delete('smelteverket.v6');const W=boot();W.S.moved=true;W.S.heats=99;upto(W,'sm');W.setLv('kalk',6);W.setLv('koks',10);W.setLv('cowper',10);W.setLv('h_rj',2);W.setLv('h_skrap',2);W.setLv('h_blokk',3);W.setLv('kokup',4);W.setLv('operator',1);W.S.money=900;
 run(W,120,true);ok(until(W,W=>W.PIT.state==='pour'&&W.PIT.t>1.2,500),'B: reached mid-pour');
 roundtrip(W,'B mid-pour',{steel:IT(W)*3+1,iron:3.5})}
/* C: continuous caster running, ladle on the turret, billets on the run-out and the bed, mill fed by the magnet crane */
{store.delete('smelteverket.v6');const W=boot();W.S.moved=true;W.S.heats=99;upto(W,'eaf1');W.setLv('kalk',14);W.setLv('o2',14);W.setLv('elekkran',1);W.setLv('kran',10);W.setLv('yard',8);W.setLv('charge',6);W.setLv('strands',3);W.setLv('turret',1);W.setLv('osekran',4);W.setLv('ladle',2);W.setLv('operator',1);W.setLv('magkran',3);W.setLv('slaggbil',1);W.setLv('h_strang',2);W.setLv('h_vv',2);W.S.cast='strang';W.S.money=0;W.S.yard.y0=200;
 run(W,200,true);ok(until(W,W=>W.LADLES.some(l=>l.state==='cast')&&W.CAST.run.length>0,600),'C: casting with billets on the run-out and the bed · magnet crane '+W.CRm.mag.state);
 roundtrip(W,'C mid-cast',{steel:IT(W)*W.LADLES.length+W.nStr?0:0+ 3*4+1,iron:0.01})}
/* D: Consteel with a loaded charging crane, player carrying, ladle under the crane */
{store.delete('smelteverket.v6');const W=boot();W.S.moved=true;W.S.heats=99;upto(W,'consteel');W.setLv('kalk',21);W.setLv('o2',21);W.setLv('kull',14);W.setLv('elekkran',1);W.setLv('kran',14);W.setLv('magnet',4);W.setLv('yard',14);W.setLv('charge',8);W.setLv('strands',7);W.setLv('turret',1);W.setLv('osekran',8);W.setLv('ladle',2);W.setLv('operator',1);W.setLv('slaggbil',1);W.S.cast='strang';W.S.money=0;W.S.yard.y0=W.S.yard.y1=300;
 run(W,200,true);ok(until(W,W=>W.CRm.skrap.load>0&&W.LADLES.some(l=>l.state==='carried'),600),'D: crane loaded and a ladle in the air');
 W.P.stack=[{k:'billet',t:3,q:1,kk:0,age:0},{k:'billet',t:3,q:1,kk:0,age:0}];
 roundtrip(W,'D consteel',{steel:IT(W)*W.LADLES.length+8*12+W.CRm.skrap.load+1,iron:0.01})}
console.log(bad?'FAIL':'PASS');process.exit(bad?1:0);
