// Phase 5 regression (node): era 8 – molten oxide electrolysis (MOE). The cell hall is built on a new plot (the build waits for
// the LD converter to run, era 7); its pads open at once, but the era starts when the melt shop gets its induction holding furnace.
// Then the LD converter is laid down on a reserve plot (or torn down when none is free), the ESF and the DRI plant are laid down where
// they stand, and transfer cars take liquid steel from the hall up the corridor and along the old torpedo tracks to the holding furnace.
// Bottlenecks are attributed (the hall itself, the transfer cars, the melt shop); O₂ is sold; save/load keeps everything.
// usage: node tests/era8test.js
const H=require('./harness6.js');const DT=1/30;let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
const fresh=()=>{H.store.clear();const W=H.boot();W.S.heats=99;W.S.st.slagT=999;W.S.money=1e14;return W};
const run=(W,s)=>{for(let i=0;i<s/DT;i++)W.update(DT)};
const maxAll=W=>{for(let k=0;k<2;k++)for(const u of W.UP)if(W.upOpen(u))W.setLv(u.id,u.max);for(const st in W.HIRE)W.hire(st,W.HIRE[st].costs.length)};
/* stand still on a pad (at the spot where it is now: a build pad that moves on after a purchase is not followed) */
const stand=(W,d,s)=>{const P=W.P,x=d.x,y=d.y;d.lock=false;W.G.go=null;for(let i=0;i<s/DT;i++){P.x=x;P.y=y;P.vx=P.vy=0;W.update(DT)}};
{const W=fresh();W.build('kai');W.build('h2');W.build('esf');ok(W.era()===6&&!W.nextBuild(),'era 6 with the ESF built: the cell hall is not offered until the LD converter runs');
 W.toEra(7);const nb=W.nextBuild();ok(W.era()===7&&nb&&nb.id==='moe'&&W.vis(W.PAD.build)&&W.inZone(W.ZN.moe,W.PAD.build.x,W.PAD.build.y,26),'era 7: the next build is the cell hall, on its new plot');
 ok(W.WH===1560,'the MOE plot fits in the 1560-tall world');
 W.S.money=1e14;stand(W,W.PAD.build,20);ok(W.B_('moe')&&W.era()===7,'cell hall built – still era 7 (no outlet yet)');
 const st=W.status('moe');ok(st&&st.lv===1&&st.t==='Klar – venter på holdeovnen','the hall waits for the holding furnace: '+(st&&st.t));
 ok(['cells','rect','anode','o2c'].every(id=>W.upAvail(W.UPm[id])&&W.vis(W.PAD['u_'+id])),'the hall\'s upgrade pads are open while it waits');
 const nb2=W.nextBuild();ok(nb2&&nb2.id==='hold'&&W.PAD.build.x===990&&W.PAD.build.y===1040,'next build: the holding furnace, in the melt shop');
 const h0=W.S.heats;W.S.money=1e14;stand(W,W.PAD.build,20);
 ok(W.era()===8&&W.ET()==='hold','standing on the build pad starts era 8: an induction holding furnace in the melt shop');
 ok(W.S.mb.ld&&(W.S.mb.ld.st==='mb'||W.S.mb.ld.st==='gone')&&W.mbOn('esf')&&W.mbOn('dri'),'the LD converter is laid down ('+(W.S.mb.ld&&W.S.mb.ld.st)+'), the ESF and the DRI plant are laid down where they stand');
 ok(!W.stOn('dri')&&!W.stOn('esf')&&W.vis(W.PAD.dem_esf)&&W.vis(W.PAD.dem_dri)&&W.vis(W.PAD.rst_dri)&&!W.payable(W.PAD.rst_dri),'their pads give way to Demolish (and a locked Restart for the H₂ plant)');
 ok(W.WH===2400&&W.blockedPt(0,1800,0)&&!W.blockedPt(-1200,1800,14),'the world grows down in the plot column only (L-shaped)');
 ok(W.POS.torpX0===0&&W.TL.yF===W.P5G.moe.fill&&W.TORPS.length===W.nTorp(),'transfer cars fill at the hall\'s tap ('+W.TORPS.length+' cars)');
 ok(!W.scrapUse()&&!W.UPm.kran.req()&&W.status('skrap').lv===0,'the scrap yard rests');
 maxAll(W);run(W,240);
 ok(W.rate('moe')>0&&W.rate('f:moe>ovn')>0&&W.S.heats-h0>20,'steel flows hall → transfer car → holding furnace → ladles ('+W.rate('f:moe>ovn').toFixed(0)+' t/min, '+(W.S.heats-h0)+' heats)');
 ok(W.rate('v:moe')>0&&W.rate('f:moe>salg')>0,'O₂ from the anodes is sold ('+W.rate('f:moe>salg').toFixed(0)+' t/min)');
 ok(W.status('moe').lv===0&&W.status('ovn').lv<2,'fully upgraded: hall "'+W.status('moe').t+'", melt shop "'+W.status('ovn').t+'"');
 ok(W.p4K()===1.35&&W.co2t()<.1,'premium ×1.35, CO₂ '+W.co2t().toFixed(2));
 const r0=W.moeRate();W.setCtl('moe');ok(Math.abs(W.moeRate()/r0-1.1)<1e-6,'taking over the cell desk: +10 % current');W.setCtl('moe');
 /* save / load */
 W.save();const W2=H.boot();ok(W2.era()===8&&W2.ET()==='hold'&&W2.mbOn('dri')&&W2.TL.yF===W2.P5G.moe.fill&&W2.WH===2400,'save/load keeps era 8, the laid-down plants and the transfer line');
 let ex=0;const h1=W2.S.heats;for(let i=0;i<30*90;i++){try{W2.update(DT);if(i%30===0)W2.draw()}catch(e){ex++;if(ex<2)console.log(e.stack)}}ok(ex===0&&W2.S.heats>h1,'runs on after the reload ('+(W2.S.heats-h1)+' heats)')}
/* bottlenecks in era 8 */
{const W=fresh();W.toEra(8);maxAll(W);W.setLv('ltc',0);W.setLv('ltcn',0);run(W,180);const a=W.status('moe'),o=W.status('ovn');
 ok(a.lv===2&&a.t==='Flaskehals: overføringsvogner'&&o.lv===2&&o.t==='Flaskehals: overføringsvogner','too few transfer cars: hall "'+a.t+'" · melt shop "'+o.t+'"');
 ok(W.urgentIds('ovn').indexOf('ltcn')>=0,'the extra-car pad is flagged')}
{const W=fresh();W.toEra(8);maxAll(W);W.setLv('rect',0);W.setLv('cells',0);run(W,120);const a=W.status('moe');
 ok(a.lv===0&&W.P5.held<.3&&W.urgentIds('moe').indexOf('rect')>=0,'a small hall is the limit: nothing holds it back, its own pads are flagged ("'+a.t+'")')}
{const W=fresh();W.toEra(8);maxAll(W);W.S.cast='strang';run(W,360);const a=W.status('moe'),o=W.status('ovn');
 ok(a.lv===1&&a.t==='Venter på stålverket'&&o.lv===2,'caster only: the melt shop holds the hall back – hall "'+a.t+'" · melt shop "'+o.t+'"')}
/* demolish the laid-down plants of era 7 */
{const W=fresh();W.toEra(8);const n0=W.SOLIDS().length;W.demolish('esf');ok(W.S.mb.esf.st==='gone'&&W.SOLIDS().length<n0&&!W.vis(W.PAD.dem_esf),'the ESF can be torn down (solids freed)');
 let ex=0;for(let i=0;i<30*20;i++){try{W.update(DT);if(i%30===0)W.draw()}catch(e){ex++}}ok(ex===0,'runs without it')}
/* an old save from era 7 (before Phase 5) loads with defaults and goes on */
{const W=fresh();W.toEra(7);W.save();const raw=JSON.parse(H.store.get('smelteverket.v6'));delete raw.p5;H.store.set('smelteverket.v6',JSON.stringify(raw));
 const W2=H.boot();ok(W2.era()===7&&W2.S.p5&&W2.S.p5.fines===0&&W2.nextBuild().id==='moe'&&W2.WH===1560,'a save from before Phase 5 loads with defaults, next build: the cell hall')}
console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0;
