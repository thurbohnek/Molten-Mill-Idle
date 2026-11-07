// long tap-walks: the player must reach far targets across the whole plant without stopping on the way
const H=require('./harness6.js');const DT=1/30;let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
for(const b of[null,'eaf1','kai','esf']){for(const k of[...H.store.keys()])if(k.startsWith('smelteverket'))H.store.delete(k);
 const W=H.boot();if(b){W.build(b);if(b==='esf'&&W.toEra)W.toEra(7)}W.rebuildSolids&&W.rebuildSolids();
 let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;let n=0,okN=0,stops=[];
 for(let t=0;t<25;t++){const P=W.P;let tx,ty,g=0;do{tx=W.WXL+60+rnd()*(W.WW-W.WXL-120);ty=60+rnd()*(W.WH-120);g++}while((W.blockedPt(tx,ty,16)||Math.hypot(tx-P.x,ty-P.y)<900)&&g<500);
  if(g>=500)continue;const d0=Math.hypot(tx-P.x,ty-P.y);if(!W.goTo(tx,ty))continue;n++;let s=0;while(W.G.go&&s<60/DT){W.update(DT);s++}
  const d=Math.hypot(W.P.x-tx,W.P.y-ty);if(d<30)okN++;else stops.push(`${d0|0}→left ${d|0} after ${(s*DT).toFixed(1)}s`)}
 ok(n>0&&okN===n,`${b||'start'}: ${okN}/${n} long walks (≥900 px) arrive `+stops.slice(0,3).join(' | '))}
if(bad)process.exit(1);console.log('PASS')
