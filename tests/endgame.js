// Endgame balance (node): with every upgrade of an era maxed the steel furnace must be the bottleneck — it never waits for
// ladles, the ladle crane, the ladle furnace, the caster, slag or scrap, and the caster's tundish never runs dry during a
// ladle change while a full ladle is on its way. Also reports per-stage utilisation and capacity vs the furnace's output.
// Phase 4: era 6 (hydrogen DRI) – "the furnace" is still the conveyor-fed arc furnace: the DRI chain (electrolysis, H₂ store,
// shaft furnace, pellets, DRI conveyor) must deliver the set DRI share with headroom. Era 7 (electric smelting) – "the furnace" is
// the restarted LD converter: the ESF, the DRI chain and the torpedo cars must keep it supplied with hot metal (no hot-metal wait).
// Ladle car + both casting lines (v7.6): from the ladle furnace on, a ladle car rolls the ladle from the tap to the ladle furnace and
// brings an empty one back; the crane only lifts treated ladles to the caster / ingot pit and empties back to the stand. With everything
// maxed in the conveyor-fed eras (5, 6) and the restarted converter (7) on AUTO, BOTH lines get steel and the furnace delivers
// 90–95 % of their combined capacity (caster at full speed + the ingot pit's measured maximum) while it still never waits (< 2 %);
// the ladle furnace, the ladle crane and the ladle car stay under 90 % busy; the rolling mill keeps ≥ 15 % headroom over the steel
// that actually reaches it; the arc furnace's power-off share (tapping + tap reaction + waits) is at most 16 %. In the caster-only and
// pit-only positions the furnace is faster than one line by design: there the status chips must name that line as the limit.
// Eras 2–4 (the caster exists but the furnace is much smaller than the maxed caster) keep the old rule: on AUTO the furnace never waits.
// usage: node endgame.js [simMinutes=10] [mode-ignored] [file]      env: ERAS=0,1,…  (default 1…7; era 0 is report-only)
const H=require('./harness6.js');const DT=1/30;
const MIN=+process.argv[2]||10;
let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
/* the last build of each era (all its stations exist); upgrades open in that era are maxed */
function setup(eraIx,helpers,cast){for(const k of[...H.store.keys()])if(k.startsWith('smelteverket'))H.store.delete(k);const W=H.boot(),S=W.S;S.heats=99;S.st.slagT=999;
 const b=[null,'lf','tog','eaf1','nett','kai','h2','esf'][eraIx];
 if(b)W.build(b);if(eraIx===7)W.toEra(7);
 for(const u of W.UP)if(W.upOpen(u))W.setLv(u.id,u.max);
 for(const u of W.UP)if(W.upOpen(u))W.setLv(u.id,u.max);/* gates that open after the first pass */
 for(const st in W.HIRE)W.hire(st,helpers&&(W.stOn?W.stOn(st):(z=>(!z.b||W.B_(z.b))&&!(z.rj&&W.rjClosed()))(W.ZN[st]))&&(!W.HIRE[st].req||W.HIRE[st].req())?W.HIRE[st].costs.length:0);
 if(cast)S.cast=cast;W.rebuildSolids();
 return W}
function run(W,min){const S=W.S,F=W.F,CAST=W.CAST,LADLES=W.LADLES,N=Math.round(min*60/DT),warm=Math.round(60/DT);
 const acc={melt:0,starve:0,slag:0,ladle:0,tapper:0,refine:0,tapping:0,hm:0,elek:0,lim:0,other:0,tot:0},why={};
 /* steel routed to each line (counted when a ladle arrives at the pit or on a turret arm), ladle car busy time */
 const toLine={pit:0,tur:0},prevSt=new Map();let carBusy=0;
 let nOnS=0,flowT=0,dry=0,dryN=0,wasFlow=false,castT=0,tapped=0,cast0=0,bil0=0,h0=0,crBusy=0,lfBusy=0,speedSum=0,speedN=0,vmin=9,yardMin=1e9,stalls=0;
 const out0={};let piles0=null;
 for(let i=0;i<N;i++){W.update(DT);if(i<warm)continue;
  if(i===warm){h0=S.heats;for(const l of LADLES)prevSt.set(l,l.state);cast0=S.st.prod.billet||0;piles0=Object.fromEntries(W.PRK.map(k=>[k,W.PILE[k].reduce((a,b)=>a+b.t,0)]));for(const id in W.NODE)out0[id]=0}
  acc.tot+=DT;const st=F.state;
  if(F.stop)acc.slag+=DT;
  else if(st==='ready'){if(!W.tapLadle()){acc.ladle+=DT;const L=LADLES.map(l=>l.state+(l.next?'>'+l.next:'')).join(',');why[L]=(why[L]||0)+DT}else acc.tapper+=DT}
  else if(st==='refine')acc.refine+=DT;else if(st==='tapping')acc.tapping+=DT;
  else if(F.solid>0&&F.rate>0)acc.melt+=DT;
  else if(F.starve>0)acc.starve+=DT;else if(F.waitHM>0)acc.hm+=DT;else if(F.elekOut)acc.elek+=DT;else acc.other+=DT;
  /* caster: the tundish runs dry while a ladle with steel is on its way to the turret */
  if(W.B_('strang')){const casting=LADLES.some(l=>l.state==='cast'),coming=LADLES.some(l=>l.steel>.01&&(l.state==='tur'||((l.state==='await'||l.state==='carried')&&l.next==='tur')));
   const fl=CAST.flow;if(wasFlow&&!fl&&coming){dryN++}if(!fl&&coming&&!casting)dry+=DT;wasFlow=fl;if(casting)castT+=DT;if(fl)flowT+=DT;
   if(CAST.spd!=null&&fl){speedSum+=CAST.spd;speedN++;vmin=Math.min(vmin,CAST.spd);nOnS+=CAST.nOn}}
  const c=W.CRm.ose;if(c.state!=='idle')crBusy+=DT;if(LADLES.some(l=>l.state==='lf'))lfBusy+=DT;
  for(const l of LADLES){const p=prevSt.get(l);if(p!==l.state&&(l.state==='pit'||l.state==='tur'))toLine[l.state]+=l.steel;prevSt.set(l,l.state)}
  if(W.carOn&&W.carOn()){const C=W.CAR;if(!(C.st==='tap'&&C.L&&C.L.state==='park'))carBusy+=DT}
  const y=W.count(W.SRCm.y0)+(W.SRCm.y1.open()?W.count(W.SRCm.y1):0);yardMin=Math.min(yardMin,y)}
 const T=acc.tot,heats=S.heats-h0,steel=W.rate('tap')/60;
 const res={flowT,acc,why,T,heats,dry,dryN,castT,crBusy:crBusy/T,lfBusy:lfBusy/T,carBusy:carBusy/T,pitIn:toLine.pit/T,turIn:toLine.tur/T,spd:speedN?speedSum/speedN:null,nOn:speedN?nOnS/speedN:0,vmin,yardMin,piles:{},nodes:{}};
 for(const k of W.PRK)res.piles[k]=W.PILE[k].reduce((a,b)=>a+b.t,0)-(piles0?piles0[k]:0);
 for(const id in W.NODE){const n=W.NODE[id];if(n.on())res.nodes[id]={util:n.util,q:n.in.length,cap:n.cap,rate:n.rate()}}
 return res}
const pct=v=>(v*100).toFixed(1)+' %';
function report(eraIx,helpers,cast,min){const W=setup(eraIx,helpers,cast);if(!W.nStrands){W.nStrands=()=>1+W.lv('strands');W.strandRate=()=>.6*Math.pow(1.11,W.lv('caster'))}const r=run(W,min),a=r.acc,T=r.T,F=W.F;
 const wait=(a.ladle+a.starve+a.slag+a.hm+a.elek)/T;
 /* furnace output: steel tapped per second of furnace cycle at the measured rate */
 const tapT=W.fcap()*(1-W.E_().heel),cycle=T/Math.max(1,r.heats),fOut=tapT/cycle;
 console.log(`\n== era ${eraIx} (${W.E_().n}) helpers=${helpers?'max':'0'} cast=${W.S.cast}  ${min} min ==`);
 console.log(`furnace: ${r.heats} heats, ${tapT.toFixed(0)} t/tap, cycle ${cycle.toFixed(1)} s → ${fOut.toFixed(2)} t/s steel; melt-limit ${W.furnRate().toFixed(2)} t/s (Rpow ${W.Rpow().toFixed(2)})`);
 console.log(`time: melt ${pct(a.melt/T)} refine ${pct(a.refine/T)} tapping ${pct(a.tapping/T)} tapper-react ${pct(a.tapper/T)} | WAIT ladle ${pct(a.ladle/T)} scrap ${pct(a.starve/T)} slag ${pct(a.slag/T)} hm ${pct(a.hm/T)} elek ${pct(a.elek/T)} other ${pct(a.other/T)} → total wait ${pct(wait)}`);
 const top=Object.entries(r.why).sort((x,y)=>y[1]-x[1]).slice(0,4).map(([k,v])=>k+' '+pct(v/T)).join(' | ');if(top)console.log('  ladle wait while: '+top);
 if(W.B_('strang')){const cap=W.nStrands()*W.strandRate();console.log(`caster: ${W.nStrands()} strands × ${W.strandRate().toFixed(2)} = ${cap.toFixed(1)} t/s max (${pct(cap/fOut)} of the furnace's output), casting ${pct(r.castT/T)}, strands running ${pct(r.flowT/T)}, mean speed ${r.spd==null?'-':pct(r.spd)} min ${r.spd==null?'-':pct(r.vmin)}, mean open strands ${r.nOn.toFixed(1)}, breaks(all) ${W.G.castBreak||0}, tundish dry with ladle coming ${r.dry.toFixed(1)} s (${r.dryN} breaks)`)}
 console.log(`ladle crane busy ${pct(r.crBusy)}, ladle furnace busy ${pct(r.lfBusy)}, ladle car busy ${pct(r.carBusy)}, ladles ${W.LADLES.length}, scrap yard min ${r.yardMin} lifts`);
 if(W.B_('strang'))console.log(`steel to the caster ${r.turIn.toFixed(2)} t/s (${pct(r.turIn/Math.max(1e-9,r.turIn+r.pitIn))}) · to the ingot pit ${r.pitIn.toFixed(2)} t/s (${pct(r.pitIn/Math.max(1e-9,r.turIn+r.pitIn))}) · power off (tapping + tap reaction + waits) ${pct((a.tapping+a.tapper+a.ladle+a.slag)/T)}`);
 const nn=Object.entries(r.nodes).map(([k,n])=>`${k} ${n.rate.toFixed(1)} t/s util ${pct(n.util)} q ${n.q}/${n.cap}`).join(' · ');if(nn)console.log('nodes: '+nn);
 const pl=Object.entries(r.piles).filter(([k,v])=>Math.abs(v)>1).map(([k,v])=>k+' '+(v>0?'+':'')+v.toFixed(0)+' t').join(' · ');if(pl)console.log('pile growth: '+pl);
 if(W.era()>=6){const D=W.S.dri;console.log(`DRI: shaft ${(W.DRI.rate*60).toFixed(0)} of ${(W.shaftCap()*60).toFixed(0)} t/min, share ${(W.DRI.sh*100).toFixed(0)} % (set ${W.S.drimix*100} %), bin ${D.bin.toFixed(0)}/${W.binCap()}, H₂ ${D.h2.toFixed(1)}/${W.h2Cap().toFixed(0)}, pellets ${D.pel.toFixed(0)}, short ${W.DRI.short.toFixed(2)} beltLim ${W.DRI.beltLim.toFixed(2)} lim ${W.driLim()} · ESF ${(W.ESF.rate*60).toFixed(0)} of ${(W.esfRate()*60).toFixed(0)} t/min lim ${W.esfLim()} · CO₂ ${W.co2t().toFixed(2)} green ×${W.greenK().toFixed(2)} p4 ×${W.p4K().toFixed(2)}`)}
 const st=W.bottlenecks().map(b=>b[0]+':'+b[1]).join(' | ');console.log('bottlenecks now: '+(st||'-')+' · ovn: '+W.status('ovn').t+' · strang: '+(W.status('strang')||{}).t);
 return{W,r,wait,fOut}}
/* the ingot pit's maximum: pit-only position with everything maxed (the furnace is faster than the pit there), steel into the pit per s */
function pitMax(eraIx,min){const{r}=report(eraIx,true,'blokk',min||3);return r.pitIn}
module.exports={setup,run,report,pitMax};
if(require.main!==module)return;
/* regression test (default): the final era with everything maxed, with and without helpers, auto and caster-only routing;
   plus each earlier era's fully upgraded state (helpers max) from the open hearth on. The Bessemer era is reported only:
   its ladle crane cannot be upgraded before the ladle furnace is built (the next build, minutes into the game). */
const eras=(process.env.ERAS||'1,2,3,4,5,6,7').split(',').map(Number);
const T_=(W,k)=>W.t_(k);
for(const e of eras){
 /* the pit-only run first: it measures the ingot pit's maximum and its chip must name the pit */
 const pmax=e>=5?(()=>{const{W,r,wait}=report(e,true,'blokk',Math.min(MIN,4));const tag=`era ${e} helpers=max cast=blokk`;
   const bl=W.status('blokk')||{},ov=W.status('ovn')||{};ok(wait<.02||bl.lv===2||ov.t.indexOf(T_(W,'blokkstøping'))>=0,`${tag}: the pit is the limit and its chip says so (furnace waits ${pct(wait)} · blokk "${bl.t}" · ovn "${ov.t}")`);
   console.log(`ingot pit maximum: ${r.pitIn.toFixed(2)} t/s`);return r.pitIn})():0;
 const cfg=e>=5?[[true,'auto'],[true,'strang'],[false,'auto']]:e===0?[[true,'auto']]:[[true,'auto']];
 for(const[helpers,cast]of cfg){const{W,r,wait,fOut}=report(e,helpers,cast,e>=5?MIN:Math.min(MIN,6));const tag=`era ${e} helpers=${helpers?'max':0} cast=${cast}`;
  if(e===0)continue;
  if(cast==='strang'){/* caster only: the caster is smaller than the furnace by design – the tundish never runs dry, and the chips say the caster is the limit */
   ok(r.dry<1&&r.dryN===0,`${tag}: tundish never dry while a full ladle is coming (${r.dry.toFixed(1)} s, ${r.dryN} breaks)`);
   const st=W.status('strang')||{},ov=W.status('ovn')||{};ok(wait<.02||st.lv===2||ov.t.indexOf(T_(W,'streng'))>=0,`${tag}: the caster is the limit and the chips say so (furnace waits ${pct(wait)} · strang "${st.t}" · ovn "${ov.t}")`);
   const bn=W.bottlenecks().filter(b=>b[0]!=='ovn'&&b[0]!=='strang');ok(bn.length===0,`${tag}: no other bottleneck chips: `+(bn.map(b=>b.join(':')).join(' | ')||'-'));continue}
  ok(wait<.02,`${tag}: furnace waits ${pct(wait)} (< 2 %)`);
  if(e<5&&W.carOn()){ok(r.crBusy<.9&&r.lfBusy<.9&&r.carBusy<.9,`${tag}: ladle crane ${pct(r.crBusy)}, ladle furnace ${pct(r.lfBusy)}, ladle car ${pct(r.carBusy)} busy (< 90 %)`)}
  if(e<5)continue;
  const bn=W.bottlenecks().filter(b=>b[0]!=='ovn');ok(bn.length===0,`${tag}: no downstream bottleneck chips: `+(bn.map(b=>b.join(':')).join(' | ')||'-'));
  if(!helpers)continue;
  /* both lines: the caster at full speed + the pit's maximum; the furnace delivers 90–95 % of that and both lines get steel */
  const cmax=W.casterCap(),both=cmax+pmax,share=fOut/both;
  console.log(`lines: caster max ${cmax.toFixed(1)} + pit max ${pmax.toFixed(1)} = ${both.toFixed(1)} t/s · furnace ${fOut.toFixed(1)} t/s = ${pct(share)} · caster runs at ${pct(r.turIn/cmax)} · pit at ${pct(r.pitIn/pmax)}`);
  ok(share>=.9&&share<=.97,`${tag}: the furnace delivers ${pct(share)} of caster + pit capacity (90–95 %)`);
  ok(r.pitIn>=.05*fOut&&r.turIn>=.5*fOut,`${tag}: both lines get steel (caster ${r.turIn.toFixed(1)} t/s, pit ${r.pitIn.toFixed(1)} t/s)`);
  ok(r.crBusy<.9&&r.lfBusy<.9&&r.carBusy<.9,`${tag}: ladle crane ${pct(r.crBusy)}, ladle furnace ${pct(r.lfBusy)}, ladle car ${pct(r.carBusy)} busy (< 90 %)`);
  if(e<7){const off=(r.acc.tapping+r.acc.tapper+r.acc.ladle+r.acc.slag)/r.T;ok(off<=.16,`${tag}: power-off share ${pct(off)} (≤ 16 %)`)}
  /* headroom at max: the rolling mill takes at least 15 % more than the steel the caster actually sends it */
  for(const id in r.nodes)ok(r.nodes[id].rate/r.turIn-1>=.15,`${tag}: node ${id} ${r.nodes[id].rate.toFixed(1)} t/s vs ${r.turIn.toFixed(1)} t/s from the caster → headroom ${pct(r.nodes[id].rate/r.turIn-1)} (≥ 15 %)`);
  if(e===6)ok(W.DRI.sh>=W.S.drimix*.85&&W.DRI.short<.3,`${tag}: the DRI chain delivers the set share (${(W.DRI.sh*100).toFixed(0)} % of ${W.S.drimix*100} %)`);
  if(e===7)ok(r.acc.hm/r.T<.005,`${tag}: the converter never waits for hot metal (${pct(r.acc.hm/r.T)})`);
  if(e>=6){const lim=W.era()===6?W.rate('dri')/60/W.shaftCap():W.rate('esfmelt')/60/W.esfRate();ok(lim<.92,`${tag}: the ${e===6?'shaft furnace':'ESF'} has headroom (runs at ${pct(lim)} of max)`)}
  ok(r.acc.starve/r.T<.005&&r.acc.slag/r.T<.005,`${tag}: no scrap starvation (${pct(r.acc.starve/r.T)}) and no slag stops (${pct(r.acc.slag/r.T)})`)}}
console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0;
