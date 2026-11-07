// Phase 5 regression (node): era 9 – the hydrogen plasma reactor. It is built on the next plot during era 8 (the cell hall keeps
// running); the era starts when the laid-down H₂ plant is restarted (its electrolysers and store – the shaft furnace stays cold), or
// rebuilt if it was torn down. The cell hall is then laid down. Ore fines + H₂ → liquid steel; the steam condenser sends the water
// back to the electrolysers. Bottlenecks: the reactor, ore fines, hydrogen (electrolysis / water), the transfer cars. Save/load.
// usage: node tests/era9test.js
const H=require('./harness6.js');const DT=1/30;let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
const fresh=()=>{H.store.clear();const W=H.boot();W.S.heats=99;W.S.st.slagT=999;W.S.money=1e14;return W};
const run=(W,s)=>{for(let i=0;i<s/DT;i++)W.update(DT)};
const maxAll=W=>{for(let k=0;k<2;k++)for(const u of W.UP)if(W.upOpen(u))W.setLv(u.id,u.max);for(const st in W.HIRE)W.hire(st,W.HIRE[st].costs.length)};
/* stand still on a pad (at the spot where it is now: a build pad that moves on after a purchase is not followed) */
const stand=(W,d,s)=>{const P=W.P,x=d.x,y=d.y;d.lock=false;W.G.go=null;for(let i=0;i<s/DT;i++){P.x=x;P.y=y;P.vx=P.vy=0;W.update(DT)}};
{const W=fresh();W.toEra(8);const nb=W.nextBuild();ok(nb&&nb.id==='pls'&&W.vis(W.PAD.build)&&W.inZone(W.ZN.pls,W.PAD.build.x,W.PAD.build.y,26),'era 8: the next build is the plasma reactor on the plot below the hall');
 const r=W.PAD.rst_dri;ok(W.vis(r)&&!W.payable(r),'the H₂ plant\'s Restart pad is shown, locked');
 stand(W,W.PAD.build,20);ok(W.B_('pls')&&W.era()===8,'plasma reactor built – still era 8, the hall runs on');
 ok(W.status('pls').t==='Klar – start elektrolysørene'&&['pmw','ptorch','fines','cond'].every(id=>W.vis(W.PAD['u_'+id])),'the reactor waits for hydrogen; its pads are open');
 ok(W.restartOK('dri')&&W.payable(r)&&W.cost(r)===W.MBU.dri.rc&&W.padName(r)==='Start igjen','the H₂ plant\'s Restart unlocks (cost '+W.cost(r)+')');
 const pg=W.phaseGoal();ok(pg&&/Hydrogen-DRI-anlegg/.test(pg.m),'the goal points to the restart: '+pg.m);ok(!W.nextBuild(),'the tank house waits for era 9');
 maxAll(W);for(const u of['bess','sm','rj','eaf','uhp','cs','ld','esf'])if(W.mbOn(u))W.demolish(u);maxAll(W);ok(W.recommend().d===r,'with the works built out, the restart is the recommended buy');
 const h0=W.S.heats;stand(W,r,12);
 ok(W.era()===9&&W.S.mb.dri.st==='run'&&W.mbOn('moe'),'standing on Restart starts era 9: the H₂ plant runs, the cell hall is laid down');
 ok(W.TL.yF===W.P5G.pls.fill&&W.POS.torpX0===0,'the transfer cars now fill at the reactor\'s tap');
 ok(W.stOn('dri')&&!W.upOpen(W.UPm.shaft)&&!W.upOpen(W.UPm.pellet)&&W.upOpen(W.UPm.elyz),'in the H₂ plant only the electrolysers and the store have pads (the shaft furnace stays cold)');
 maxAll(W);run(W,240);
 ok(W.rate('pls')>0&&W.rate('h2prod')>0&&W.rate('f:h2>pls')>0&&W.rate('f:pls>ovn')>0,'H₂ electrolysis → reactor → transfer car → holding furnace ('+W.rate('f:pls>ovn').toFixed(0)+' t/min)');
 ok(W.S.heats-h0>20&&W.DRI.rate===0,'heats are made ('+(W.S.heats-h0)+'), the shaft furnace stays cold');
 ok(W.status('pls').lv===0&&W.status('dri').lv===0,'fully upgraded: reactor "'+W.status('pls').t+'", H₂ plant "'+W.status('dri').t+'"');
 ok(W.p4K()===1.45,'premium ×1.45');
 W.save();const W2=H.boot();ok(W2.era()===9&&W2.S.mb.dri.st==='run'&&W2.mbOn('moe')&&W2.TL.yF===W2.P5G.pls.fill,'save/load keeps era 9');
 let ex=0;const h1=W2.S.heats;for(let i=0;i<30*90;i++){try{W2.update(DT);if(i%30===0)W2.draw()}catch(e){ex++;if(ex<2)console.log(e.stack)}}ok(ex===0&&W2.S.heats>h1,'runs on after the reload ('+(W2.S.heats-h1)+' heats)')}
/* bottlenecks in era 9 */
for(const[tag,lvs,zone,want]of[['ore fines',{fines:0},'pls','Flaskehals: malmstøv'],['water (no condenser)',{cond:0},'dri','Flaskehals: vann til elektrolysen'],['electrolysis',{elyz:8},'dri','Flaskehals: elektrolyse'],['transfer cars',{ltc:0,ltcn:0},'pls','Flaskehals: overføringsvogner']]){
 const W=fresh();W.toEra(9);maxAll(W);for(const k in lvs)W.setLv(k,lvs[k]);run(W,180);const st=W.status(zone);ok(st&&st.lv===2&&st.t===want,tag+' held back → '+zone+' says "'+(st&&st.t)+'"')}
{const W=fresh();W.toEra(9);maxAll(W);W.setLv('elyz',8);run(W,180);ok(W.status('pls').t==='Flaskehals: hydrogen','… and the reactor names hydrogen')}
/* the H₂ plant torn down in era 8: rebuilt in place */
{const W=fresh();W.toEra(8);W.demolish('dri');ok(W.S.mb.dri.st==='gone'&&!W.vis(W.PAD.rst_dri),'H₂ plant demolished');W.build('pls');const r=W.PAD.rst_dri;
 ok(W.vis(r)&&W.padName(r)==='Bygg opp igjen'&&W.cost(r)===W.MBU.dri.rb&&W.inZone(W.ZN.dri,r.x,r.y,26),'Rebuild pad in the H₂ plant\'s plot ('+W.cost(r)+')');stand(W,r,12);
 ok(W.era()===9&&W.S.mb.dri.st==='run','Rebuild starts era 9');let ex=0;for(let i=0;i<30*60;i++){try{W.update(DT);if(i%30===0)W.draw()}catch(e){ex++}}ok(ex===0&&W.rate('h2prod')>0,'runs, the electrolysers make H₂')}
console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0;
