// Phase 2 regression (node): old plants stay standing mothballed after an era change, Demolish removes them (refund scrap,
// clears solids, frees the plot), Restart stays locked until an era needs the plant, save/load round trip, old-save migration.
const H=require('./harness6.js');const DT=1/30;let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
const fresh=()=>{H.store.clear();const W=H.boot();W.S.heats=99;W.S.st.slagT=999;return W};
const inSol=(W,x,y)=>W.SOLIDS().some(s=>s.r?Math.hypot(x-s.x,y-s.y)<s.r:x>s.x&&x<s.x+s.w&&y>s.y&&y<s.y+s.h);
{const W=fresh();ok(W.WH===W.WH0&&Object.keys(W.S.mb).length===0,'new game: no old plants, world 1140 tall');
 W.build('sm');const m=W.S.mb.bess;ok(m&&m.st==='mb'&&m.p==='mbp0','SM built → Bessemer mothballed on the first reserve plot');ok(W.WH===W.WHM,'the world grew to '+W.WH);
 const g=W.mbGeo('bess');ok(inSol(W,g.cx,g.cy),'the mothballed converter is solid');ok(W.vis(W.PAD.dem_bess)&&W.payable(W.PAD.dem_bess),'Demolish pad shown');
 ok(W.zoneBuilt(W.ZN.mbp0),'its plot is shown');
 W.build('eaf1');ok(['bess','sm','ld','rj'].every(u=>W.mbOn(u)),'Omlegging: Bessemer, SM, LD and the ironworks all mothballed');
 const plots=['bess','sm','ld'].map(u=>W.S.mb[u].p);ok(new Set(plots).size===3,'each on its own plot '+plots.join(','));ok(W.S.mb.rj.p==='rj','ironworks stays on its own plot');
 /* restart locked */
 const r=W.PAD.rst_ld;ok(W.vis(r)&&!W.payable(r)&&!W.restartOK('ld')&&!W.restartUnit('ld'),'LD restart pad shown, locked');ok(!W.vis(W.PAD.rst_ld)===false&&!W.PAD.rst_bess,'only restartable plants get a Restart pad');
 /* restart hook works once an era declares the need */
 W.ERA[W.era()].needs.push('ld');ok(W.restartOK('ld')&&W.payable(r),'an era that needs the LD unlocks Restart');W.ERA[W.era()].needs.length=0;
 /* upkeep */
 const up=W.mbUpkeep();W.S.money=1e7;const u0=W.S.st.upkeep||0;for(let i=0;i<30*60;i++)W.update(DT);const paid=(W.S.st.upkeep||0)-u0;ok(up>0&&Math.abs(paid-up)<up*.05,'upkeep '+up+'/min charged ('+paid.toFixed(0)+' in a minute)');
 /* demolish the Bessemer by standing on its pad */
 const d=W.PAD.dem_bess;W.vis(d);const y0=W.yardT(W.SRCm.y0),P=W.P;W.S.money=1e7;P.x=d.x;P.y=d.y;P.vx=P.vy=0;W.G.go=null;d.lock=false;
 for(let i=0;i<30*8&&W.mbOn('bess');i++){P.x=d.x;P.y=d.y;W.update(DT)}
 ok(W.S.mb.bess.st==='gone','standing on Demolish tears the Bessemer down');ok(W.yardT(W.SRCm.y0)>=y0+W.MBU.bess.scrap-1,'+'+W.MBU.bess.scrap+' t scrap to the yard');
 ok(!inSol(W,g.cx,g.cy)&&!W.vis(d),'its solids and pad are gone');ok(!W.zoneBuilt(W.ZN.mbp0),'the plot is free');
 /* ironworks demolish */
 W.demolish('rj');ok(W.S.mb.rj.st==='gone'&&!inSol(W,W.POS.rjF.x,W.POS.rjF.y),'demolished ironworks: no solids left');
 /* the next mothballed plant takes the freed plot */
 W.build('uhp');ok(W.S.mb.eaf.p==='mbp0','the EAF takes the freed plot');
 /* save / load round trip */
 W.save();const W2=H.boot();ok(JSON.stringify(W2.S.mb)===JSON.stringify(W.S.mb),'save/load keeps the mothball state '+JSON.stringify(W2.S.mb));
 ok(inSol(W2,W2.mbGeo('eaf').cx,W2.mbGeo('eaf').cy)&&!inSol(W2,W2.POS.rjF.x,W2.POS.rjF.y),'solids restored after load');
 let ex=0;for(let i=0;i<30*30;i++){try{W2.update(DT);if(i%30===0)W2.draw()}catch(e){ex++}}ok(ex===0,'runs on after load');
 /* prestige resets the old plants */
 W2.S.earned=4.1e10;W2.doPrestige();ok(Object.keys(W2.S.mb).length===0&&W2.WH===W2.WH0,'Nytt verk: no old plants, world back to 1140')}
/* migration: a save from before Phase 2 already in the UHP era gets its old plants as if they had been kept */
{H.store.clear();const W0=H.boot();W0.S.heats=99;W0.build('uhp');W0.save();const raw=JSON.parse(H.store.get('smelteverket.v6'));delete raw.mb;H.store.set('smelteverket.v6',JSON.stringify(raw));
 const W=H.boot();ok(['bess','sm','ld','rj','eaf'].every(u=>W.mbOn(u)),'old save in the UHP era: old plants created mothballed');
 const ps=['bess','sm','ld','eaf'].map(u=>W.S.mb[u].p);ok(new Set(ps).size===4,'on distinct plots');ok(W.WH===W.WHM,'world grown (to 1560; the Phase 5 column comes later)');
 let ex=0;for(let i=0;i<30*30;i++){try{W.update(DT);if(i%30===0)W.draw()}catch(e){ex++}}ok(ex===0,'migrated save runs');
 /* a damaged entry is repaired, nothing breaks */
 W.S.mb.sm={st:'??'};W.S.mb.bogus={st:'mb',p:'mbp0'};W.save();const W3=H.boot();ok(!W3.S.mb.bogus&&W3.mbOn('sm'),'bad mothball entries are repaired')}
/* layout: every reachable demolish pad, nobody restored inside the old plants */
{const W=fresh();W.build('kai');W.rebuildNav();const f=W.field(W.START.x,W.START.y),NC=20,GW=Math.ceil((W.WW-W.WX0)/NC);
 for(const d of W.PADS){if((d.kind==='demol'||d.kind==='restart')&&W.vis(d)){const i=Math.floor((d.x-W.WX0)/NC),j=Math.floor(d.y/NC);ok(f[j*GW+i]>=0&&!W.blockedPt(d.x,d.y,4),d.id+' reachable and free')}}}
console.log(bad?'FAIL':'PASS');process.exitCode=bad?1:0;
