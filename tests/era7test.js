// Phase 4 regression (node): era 7 – the electric smelting furnace (ESF) and the restarted LD converter.
// Building the ESF unlocks the mothballed LD converter's Restart pad; restarting it (or rebuilding it after a demolish) starts the
// era: the LD runs in the melt shop again, the conveyor furnace is mothballed, torpedo cars carry green hot metal from the ESF.
// Bottlenecks are attributed (ESF power, torpedo cars, DRI chain); the pellet-grade switch works; save/load keeps everything.
// usage: node tests/era7test.js
const H=require('./harness6.js');const DT=1/30;let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
const fresh=()=>{H.store.clear();const W=H.boot();W.S.heats=99;W.S.st.slagT=999;W.S.money=1e13;return W};
const run=(W,s)=>{for(let i=0;i<s/DT;i++)W.update(DT)};
const maxAll=W=>{for(let k=0;k<2;k++)for(const u of W.UP)if(W.upOpen(u))W.setLv(u.id,u.max)};
const stand=(W,d,s)=>{const P=W.P;d.lock=false;W.G.go=null;for(let i=0;i<s/DT;i++){P.x=d.x;P.y=d.y;P.vx=P.vy=0;W.update(DT)}};
{const W=fresh();W.build('kai');W.build('h2');const r=W.PAD.rst_ld;ok(W.vis(r)&&!W.payable(r)&&!W.restartOK('ld'),'era 6 without the ESF: LD restart pad shown, locked');
 W.build('esf');ok(W.era()===6&&W.B_('esf'),'ESF built – still era 6 until the converter runs');
 ok(W.status('esf').t==='Venter på LD-konverteren','the ESF waits for the LD converter');
 ok(W.restartOK('ld')&&W.payable(r)&&W.cost(r)===W.MBU.ld.rc&&W.padName(r)==='Start igjen','Restart unlocked by the era that needs it (cost '+W.cost(r)+')');
 const pg=W.phaseGoal();ok(pg&&/LD-konverter/.test(pg.m),'the goal points to the restart: '+pg.m);
 maxAll(W);W.hire('dri',3);for(const st in W.HIRE)W.hire(st,W.HIRE[st].costs.length);{const W3=W;for(const u of['bess','sm','rj','eaf','uhp'])if(W3.mbOn(u))W3.demolish(u)}maxAll(W);ok(W.recommend().d===r,'with the plant built out (old plants torn down), the restart is the recommended buy');const plot=W.S.mb.ld.p;stand(W,r,12);
 ok(W.era()===7&&W.S.mb.ld.st==='run'&&W.ET()==='conv','standing on Restart starts era 7 – the LD converter runs again');
 ok(W.S.mb.cs&&W.S.mb.cs.st==='mb','the conveyor-fed furnace is mothballed on a reserve plot ('+(W.S.mb.cs&&W.S.mb.cs.p)+', the LD left '+plot+')');
 ok(W.POS.torpX0===W.ESFG.tapX&&W.TORPS.length===W.nTorp(),'torpedo cars fill at the ESF taphole ('+W.TORPS.length+' cars)');
 ok(!W.CS()&&W.POS.drop.x===440,'the Consteel line is gone, the scrap yard is laid out for the converter');
 maxAll(W);const h0=W.S.heats;run(W,240);
 ok(W.rate('f:esf>ovn')>0&&W.rate('esfmelt')>0,'green hot metal flows ESF → torpedo → converter ('+W.rate('f:esf>ovn').toFixed(0)+' t/min)');
 ok(W.S.heats-h0>15,'the converter makes heats ('+(W.S.heats-h0)+' in 4 min)');ok(W.rate('v:esf')>0,'ESF slag is sold for cement');
 ok(W.F.waitHM<1.5&&W.status('esf').lv===0,'fully upgraded: no hot-metal wait, ESF '+W.status('esf').t);
 ok(W.p4K()===1.2&&W.co2t()<.1,'premium ×1.2, CO₂ '+W.co2t().toFixed(2));
 /* pellet grade */const pr=W.pelRate(),dp=W.esfDriPer();W.flipSw('pgrade');ok(W.S.pgrade==='dr'&&W.pelRate()<pr&&W.esfDriPer()<dp,'DR-grade pellets: fewer per contract, less DRI per t iron');W.flipSw('pgrade');
 /* save / load in era 7 */
 run(W,20);W.save();const W2=H.boot();ok(W2.era()===7&&W2.S.mb.ld.st==='run'&&W2.S.mb.cs.st==='mb'&&W2.POS.torpX0===W2.ESFG.tapX,'save/load keeps era 7, the running LD and the torpedo line');
 let ex=0;const h1=W2.S.heats;for(let i=0;i<30*90;i++){try{W2.update(DT);if(i%30===0)W2.draw()}catch(e){ex++;if(ex<2)console.log(e.stack)}}ok(ex===0&&W2.S.heats>h1,'runs on after the reload ('+(W2.S.heats-h1)+' heats)')}
/* bottlenecks in era 7 */
for(const[tag,lvs,want]of[['ESF power',{esfmw:0},/ovnseffekt/],['torpedo cars',{etorp:0,etorpn:0,torp:0},/torpedovogner/]]){const W=fresh();W.toEra(7);maxAll(W);for(const k in lvs)W.setLv(k,lvs[k]);run(W,180);
 const st=W.status('esf');ok(st&&st.lv===2&&want.test(st.t)&&W.ESF.hmShort>.5,tag+' held back → converter waits for hot metal, ESF says '+(st&&st.t))}
{const W=fresh();W.toEra(7);maxAll(W);W.setLv('elyz',0);run(W,180);const st=W.status('dri');ok(st&&st.lv===2&&st.t==='Flaskehals: elektrolyse'&&W.status('esf').t==='Venter på DRI','DRI short → the DRI plant shows electrolysis, the ESF waits for DRI')}
/* demolished LD: Rebuild in the melt shop */
{const W=fresh();W.build('kai');W.demolish('ld');ok(W.S.mb.ld.st==='gone','LD demolished');W.build('esf');const r=W.PAD.rst_ld;
 ok(W.vis(r)&&r.x===990&&r.y===1040&&W.padName(r)==='Bygg opp igjen'&&W.cost(r)===W.MBU.ld.rb,'Rebuild pad in the melt shop ('+W.cost(r)+')');stand(W,r,12);
 ok(W.era()===7&&W.S.mb.ld.st==='run','Rebuild starts era 7');let ex=0;for(let i=0;i<30*60;i++){try{W.update(DT);if(i%30===0)W.draw()}catch(e){ex++}}ok(ex===0,'runs')}
/* old save from era 5 migrates: nothing of Phase 4, and it can go on */
{const W=fresh();W.build('kai');W.save();const raw=JSON.parse(H.store.get('smelteverket.v6'));delete raw.dri;delete raw.drimix;delete raw.pgrade;H.store.set('smelteverket.v6',JSON.stringify(raw));
 const W2=H.boot();ok(W2.era()===5&&W2.S.dri&&W2.S.drimix===.5&&W2.S.pgrade==='bf'&&W2.nextBuild().id==='h2','a save from before Phase 4 loads with defaults, next build: hydrogen plant')}
console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0;
