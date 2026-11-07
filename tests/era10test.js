// Phase 5 regression (node): era 10 – low-temperature electrowinning. The tank house is built on the last plot in era 9 (the
// plasma reactor keeps running); the era starts when the holding furnace is rebuilt into an induction furnace. The plasma reactor and
// the H₂ plant are laid down. Plates grow in the tanks, robots harvest them, plate wagons bring them to the induction furnace, which is
// now "the furnace". Bottlenecks: the tanks, the harvest robots, the plate wagons, the furnace. Save/load.
// usage: node tests/era10test.js
const H=require('./harness6.js');const DT=1/30;let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
const fresh=()=>{H.store.clear();const W=H.boot();W.S.heats=99;W.S.st.slagT=999;W.S.money=1e14;return W};
const run=(W,s)=>{for(let i=0;i<s/DT;i++)W.update(DT)};
const maxAll=W=>{for(let k=0;k<2;k++)for(const u of W.UP)if(W.upOpen(u))W.setLv(u.id,u.max);for(const st in W.HIRE)W.hire(st,W.HIRE[st].costs.length)};
/* stand still on a pad (at the spot where it is now: a build pad that moves on after a purchase is not followed) */
const stand=(W,d,s)=>{const P=W.P,x=d.x,y=d.y;d.lock=false;W.G.go=null;for(let i=0;i<s/DT;i++){P.x=x;P.y=y;P.vx=P.vy=0;W.update(DT)}};
{const W=fresh();W.toEra(9);const nb=W.nextBuild();ok(nb&&nb.id==='ew'&&W.vis(W.PAD.build)&&W.inZone(W.ZN.ew,W.PAD.build.x,W.PAD.build.y,26),'era 9: the next build is the tank house on the last plot');
 stand(W,W.PAD.build,20);ok(W.B_('ew')&&W.era()===9,'tank house built – still era 9');
 ok(W.status('ew').t==='Klar – venter på induksjonsovnen'&&W.vis(W.PAD.u_indmw)&&['tanks','ewcur','harv'].every(id=>W.vis(W.PAD['u_'+id])),'the tanks wait for the induction furnace; the induction power can be bought in advance');
 const nb2=W.nextBuild();ok(nb2&&nb2.id==='ind'&&W.vis(W.PAD.build)&&W.PAD.build.x===990,'next build: the induction furnace, in the melt shop');
 const h0=W.S.heats;stand(W,W.PAD.build,20);
 ok(W.era()===10&&W.ET()==='ind'&&W.mbOn('pls')&&W.mbOn('dri'),'era 10: the induction furnace melts plates; the plasma reactor and the H₂ plant are laid down');
 ok(W.TL.yF===W.P5G.ew.fill&&W.TORPS.length===W.nTorp(),'plate wagons fill at the stacker');
 maxAll(W);run(W,240);
 ok(W.rate('ew')>0&&W.rate('harv')>0&&W.rate('f:ew>ovn')>0&&W.rate('platefeed')>0,'plates: tanks → robots → stacker → wagon → plate bin → furnace');
 ok(W.S.heats-h0>20&&W.F.starve<1.5,'the induction furnace makes heats ('+(W.S.heats-h0)+'), never short of plates');
 ok(W.status('ew').lv===0&&W.p4K()===1.55,'fully upgraded: tanks "'+W.status('ew').t+'", premium ×1.55');
 W.save();const W2=H.boot();ok(W2.era()===10&&W2.ET()==='ind'&&W2.mbOn('pls')&&W2.TL.yF===W2.P5G.ew.fill,'save/load keeps era 10');
 let ex=0;const h1=W2.S.heats;for(let i=0;i<30*90;i++){try{W2.update(DT);if(i%30===0)W2.draw()}catch(e){ex++;if(ex<2)console.log(e.stack)}}ok(ex===0&&W2.S.heats>h1,'runs on after the reload ('+(W2.S.heats-h1)+' heats)')}
/* bottlenecks in era 10 */
for(const[tag,lvs,zone,want]of[['tanks',{tanks:0,ewcur:0},'ew','Flaskehals: elektrolysekar'],['harvest robot',{harv:0},'ew','Flaskehals: høsterobot'],['plate wagons',{ltc:0,ltcn:0},'ovn','Flaskehals: platevogner']]){
 const W=fresh();W.toEra(10);maxAll(W);for(const k in lvs)W.setLv(k,lvs[k]);run(W,180);const st=W.status(zone);ok(st&&st.lv===2&&st.t===want,tag+' held back → '+zone+' says "'+(st&&st.t)+'"')}
{const W=fresh();W.toEra(10);maxAll(W);run(W,180);const st=W.status('ovn');ok(st.lv===2&&st.t==='Flaskehals: ovnen'&&W.urgentIds('ovn').indexOf('indmw')>=0,'fully upgraded: the induction furnace is the limit ("'+st.t+'")')}
/* every Phase 5 plant can be torn down once it is laid down; the zones then free up */
{const W=fresh();W.toEra(10);W.setLv('operator',1);for(const u of['esf','dri','moe','pls'])W.demolish(u);ok(['esf','dri','moe','pls'].every(u=>W.S.mb[u].st==='gone'),'ESF, H₂ plant, cell hall and reactor demolished');
 let ex=0;for(let i=0;i<30*150;i++){try{W.update(DT);if(i%30===0)W.draw()}catch(e){ex++;if(ex<2)console.log(e.stack)}}ok(ex===0&&W.S.heats>99,'the works run on ('+(W.S.heats-99)+' heats)')}
console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0;
