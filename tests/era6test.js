// Phase 4 regression (node): era 6 – hydrogen direct reduction feeding the conveyor-fed arc furnace.
// The world grows left when the hydrogen plant is the next build; the chain electrolysis → H₂ store → shaft furnace ← pellets →
// DRI conveyor → charging conveyor works; the DRI share follows its switch and lowers CO₂ / raises the price; the bottleneck is
// attributed to the right part of the chain; save/load keeps the new state.
// usage: node tests/era6test.js
const H=require('./harness6.js');const DT=1/30;let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
const fresh=()=>{H.store.clear();const W=H.boot();W.S.heats=99;W.S.st.slagT=999;W.S.money=1e13;return W};
const run=(W,s)=>{for(let i=0;i<s/DT;i++)W.update(DT)};
const maxAll=W=>{for(let k=0;k<2;k++)for(const u of W.UP)if(W.upOpen(u))W.setLv(u.id,u.max)};
{const W=fresh();W.build('kob');ok(W.WXL===W.WXL0,'before the quay: the world still starts at '+W.WXL);
 W.build('kai');ok(W.WXL===W.WX0&&!W.blockedPt(-1200,560,10),'the hydrogen plant is the next build: the world grows left to '+W.WXL+' and its plot is walkable');
 ok(W.vis(W.PAD.prestige),'Nytt verk is still offered from the quay on');
 const b=W.PAD.build;ok(W.vis(b)&&W.nextBuild().id==='h2'&&W.inZone(W.ZN.dri,b.x,b.y,26),'build pad for the hydrogen plant in its plot');
 const c5=W.co2t();maxAll(W);const c5m=W.co2t();
 W.build('h2');ok(W.era()===6&&W.CS()&&W.E_().n==='Hydrogen-DRI'&&W.E_().yr===2030,'era 6 (2030) – still the conveyor-fed furnace');
 ok(W.stOn('dri')&&W.SOLIDS().some(s=>s.x===W.P4G.hall.x0),'DRI plot built, electrolyser hall solid');
 for(const id of['elyz','h2st','shaft','pellet','dribelt'])ok(W.upOpen(W.UPm[id])&&W.vis(W.PAD['u_'+id]),'pad for '+id);
 ok(W.vis(W.PAD.hire_dri)&&W.ctlDesks().some(d=>d.id==='dri'),'DRI operators (hire pad) and the shaft-furnace desk');
 /* the chain, fully upgraded: the set share is reached */
 maxAll(W);W.hire('dri',3);run(W,240);
 ok(W.DRI.rate>=0&&W.rate('dri')>0&&W.rate('f:dri>ovn')>0,'DRI is made and fed to the furnace ('+W.rate('f:dri>ovn').toFixed(0)+' t/min)');
 ok(Math.abs(W.DRI.sh-W.S.drimix)<.1,'DRI share '+(W.DRI.sh*100).toFixed(0)+' % ≈ set '+W.S.drimix*100+' %');
 ok(W.co2t()<c5m&&W.co2t()<.1,'CO₂ falls: '+c5m.toFixed(2)+' → '+W.co2t().toFixed(2)+' t/t');ok(W.p4K()>1.1&&W.greenK()>1.14,'price premium ×'+W.p4K().toFixed(2)+' and green ×'+W.greenK().toFixed(2));
 const st=W.status('dri');ok(st&&st.lv===0,'no DRI bottleneck at max: '+(st&&st.t));
 ok(W.CSB.d.some(v=>v>0),'DRI lies on the charging conveyor');
 /* the switch: 50 → 70 % raises the share and the power needed */
 const k0=W.kwh();W.flipSw('drimix');ok(W.S.drimix===.7,'switch 50 → 70 %');run(W,240);ok(W.DRI.sh>.6&&W.kwh()>k0,'70 %: share '+(W.DRI.sh*100).toFixed(0)+' %, '+k0+' → '+W.kwh()+' kWh/t');
 W.flipSw('drimix');ok(W.S.drimix===.3,'… → 30 %');
 /* save / load */
 W.S.dri.h2=12.5;W.S.dri.pel=777;W.S.dri.bin=55;W.save();const W2=H.boot();
 ok(W2.era()===6&&W2.S.drimix===.3&&W2.S.dri.pel===777&&Math.abs(W2.S.dri.h2-12.5)<1e-6&&W2.S.dri.bin===55,'save/load keeps era 6, the switch and the H₂ / pellet / DRI stocks');
 let ex=0;for(let i=0;i<30*30;i++){try{W2.update(DT);if(i%30===0)W2.draw()}catch(e){ex++}}ok(ex===0,'runs on after the reload')}
/* bottleneck attribution: one part of the chain held back at a time */
const cases=[['elyz',{elyz:0},'Flaskehals: elektrolyse'],['h2st',{h2st:0},'Flaskehals: H₂-lager'],['pellet',{pellet:0},'Flaskehals: pellettilførsel'],['shaft',{shaft:0},'Flaskehals: sjaktovn'],['dribelt',{dribelt:0},'Flaskehals: DRI-bånd']];
for(const[id,lvs,txt]of cases){const W=fresh();W.build('h2');maxAll(W);for(const k in lvs)W.setLv(k,lvs[k]);W.S.drimix=.7;W.S.dri.bin=0;W.S.dri.h2=0;W.S.dri.pel=0;run(W,180);
 const st=W.status('dri');ok(st&&st.lv===2&&st.t===txt,id+' held back → '+(st&&st.t));ok(W.padUrgent(W.PAD['u_'+id])&&W.curUp('dri').id===id,id+': its pad is flagged and suggested');
 ok(W.status('ovn').lv!==2||!/DRI/.test(W.status('ovn').t),'the furnace itself keeps melting (scrap fills the rest)')}
console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0;
