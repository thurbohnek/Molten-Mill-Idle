// Bottleneck tests (v6): (1) steel furnace limited by its supply plants, fixed by upgrades; (2) the blast furnace limited by
// cowpers/coke, then fixed by upgrading them; (3) the LD converter limited by råjern supply, flagged on the råjernsverk.
const H=require('./harness6.js');const DT=1/30;let fails=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)fails++};
function run(W,sec,keep){let rs=0,n=0;const F=W.F;for(let k=0;k<30*sec;k++){if(keep)keep();W.update(DT);if(F.rate>0){rs+=F.rate;n++}if(k%30===0)W.draw()}return{avgRate:n?rs/n:0}}
const STEEL={operator:1,power:20,furnace:10,ladle:2,osekran:6,slaggbil:1,elekkran:1,kokup:6,kran2:8,caster:10,strands:7,turret:1,kalk:1,o2:1,kull:1,lans:0};
for(const era of['ld','eaf1','uhp','consteel']){H.store.clear();const W=H.boot();const S=W.S;S.heats=999;S.st.slagT=999;W.build(era);
 for(const[id,n]of Object.entries(STEEL))W.setLv(id,n);if(W.era()<4)S.lv.kull=0;W.rebuildSolids();
 const keep=()=>{S.chg=W.chgCap();if(W.usesHM())S.hm=W.hmCap()};
 const a=run(W,90,keep);const lim=W.F.lim,st=W.status('ovn'),ss=W.status('sup');const rp=W.Rpow();
 console.log(era,'limit',rp.toFixed(2),'t/s · measured',a.avgRate.toFixed(2),'t/s · limiter',lim,'·',JSON.stringify(st),JSON.stringify(ss));
 ok(!!lim,era+': limited by a supply plant ('+lim+')');ok(a.avgRate<rp*.6,era+': rate '+a.avgRate.toFixed(2)+' < 60 % of '+rp.toFixed(2));
 ok(st&&st.lv===2&&/Flaskehals/.test(st.t),era+': furnace shows "'+(st&&st.t)+'"');ok(ss&&ss.lv===2,era+': supply zone flagged ('+(ss&&ss.t)+')');
 const pd=W.PAD['u_'+lim];ok(pd&&W.vis(pd)&&W.padUrgent(pd),era+': the limiter has its own pad, flagged FLASKEHALS (u_'+lim+')');
 for(const id of['kalk','o2','kull'])if(W.ERA[W.era()].req.includes(id))W.setLv(id,21);W.setLv('lans',W.era()>=4?2:W.era()===3?1:0);
 const b=run(W,90,keep);console.log(era,'after upgrades',b.avgRate.toFixed(2),'t/s · limiter',W.F.lim||'(power)');
 ok(!W.F.lim,era+': no supply limit after upgrades');ok(b.avgRate>a.avgRate*1.8,era+': ×'+(b.avgRate/a.avgRate).toFixed(2)+' (>1,8)');delete global.__smeltOn}
/* (2) blast furnace: ore unlimited, furnace big, coke + cowpers barely built */
{H.store.clear();const W=H.boot();const S=W.S;S.heats=99;W.setLv('rjsize',12);W.setLv('koks',1);W.setLv('cowper',1);W.setLv('torpn',2);W.setLv('torp',10);
 const keep=()=>{S.rj.ore=W.skipCap();S.hm=0};let r1=0,n=0;for(let k=0;k<30*60;k++){keep();W.update(DT);r1+=W.RJ.rate;n++}r1/=n;
 const lim=W.RJ.lim,st=W.status('rjsup');console.log('masovn: rate',r1.toFixed(3),'t/s of',W.rjPow().toFixed(3),'· limiter',lim,'·',JSON.stringify(st),'· urgent pads',W.PADS.filter(d=>d.st==='rjsup'&&W.padUrgent(d)).map(d=>d.u.id).join(','));
 ok(lim==='koks'||lim==='cowper','masovn limited by coke/cowpers ('+lim+')');ok(st&&st.lv===2,'rjsup flagged ('+(st&&st.t)+')');ok(W.vis(W.PAD['u_'+lim])&&W.padUrgent(W.PAD['u_'+lim]),'the coke/cowper limiter pad is flagged FLASKEHALS');
 W.setLv('koks',21);W.setLv('cowper',21);let r2=0;n=0;for(let k=0;k<30*60;k++){keep();W.update(DT);r2+=W.RJ.rate;n++}r2/=n;console.log('after coke+cowper upgrades',r2.toFixed(3),'t/s · limiter',W.RJ.lim||'(furnace size)');
 ok(!W.RJ.lim&&r2>r1*2,'masovn ×'+(r2/r1).toFixed(2)+' after upgrades, no supply limit');delete global.__smeltOn}
/* (3) LD with a big converter but a small blast furnace: the converter waits for råjern, the råjernsverk is flagged */
{H.store.clear();const W=H.boot();const S=W.S;S.heats=99;S.st.slagT=99;W.build('ld');for(const[id,n]of Object.entries({operator:1,furnace:8,power:10,kalk:21,o2:21,ladle:2,osekran:6,slaggbil:1,strands:7,caster:10,turret:1,koks:21,cowper:21,malmkran:10,malmtog:12,skip:8,torp:6,torpn:2}))W.setLv(id,n);
 const keep=()=>{S.chg=W.chgCap();S.yard.ore=200};let flagged=0,ovnWait=0,rjUrg=0;for(let k=0;k<30*180;k++){keep();W.update(DT);if(k%30===0){W.draw();const st=W.status('rj'),so=W.status('ovn');if(st&&st.lv===2&&/Flaskehals/.test(st.t))flagged++;if(so&&/råjern/.test(so.t))ovnWait++;if(W.padUrgent(W.PAD.u_rjsize))rjUrg++}}
 const st=W.status('rj');console.log('LD vs small masovn: rj status',JSON.stringify(st),'· ovn',JSON.stringify(W.status('ovn')),'· flagged',flagged,'s · bottlenecks',JSON.stringify(W.bottlenecks()));
 ok(flagged>60,'råjernsverk flagged as bottleneck while LD waits ('+flagged+' s)');ok(ovnWait>60,'converter says it waits for råjern ('+ovnWait+' s)');
 ok(W.vis(W.PAD.u_rjsize)&&rjUrg>60,'the Større masovn pad is flagged FLASKEHALS while the LD waits ('+rjUrg+' s)');delete global.__smeltOn}
console.log(fails?'FAIL '+fails:'PASS');process.exitCode=fails?1:0;
