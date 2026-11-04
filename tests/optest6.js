// Idle-helper / operator test (v6): in states where automation (cranes, roller tables, slag truck, electrode crane, torpedo cars)
// covers a route, no hired helper may stand idle off-station for more than a few seconds; they go to the desk or the crane cab.
// Also: the tapper taps a ready furnace within ~1 s when an empty ladle is under the tap, and waits at his desk otherwise.
const H=require('./harness6.js');const DT=1/30;let fails=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)fails++};
function watch(W,sec,keep,label,opt){opt=opt||{};const st=new Map();let worst=0,worstH='',posted=0,cab=0,lastPick=new Map(),longNoWork=0;
 for(let k=0;k<30*sec;k++){if(keep)keep(W,k);W.update(DT);if(k%30===0)W.draw();
  for(const h of W.helpers){const at=h.state==='post'||h.state==='toPost';const idleNow=!h.moving&&!h.stack.length&&!at;
   const v=idleNow?(st.get(h)||0)+DT:0;st.set(h,v);if(v>worst){worst=v;worstH=h.r+'#'+h.i+':'+h.state}
   if(h.stack.length||at||h.moving&&h.state==='toTgt')lastPick.set(h,k*DT);const lp=lastPick.has(h)?lastPick.get(h):0;if(k*DT-lp>longNoWork)longNoWork=k*DT-lp;
   if(h.state==='post')posted++;if(W.inCab(h))cab++}}
 console.log(label,'· worst idle off-station',worst.toFixed(1),'s',worstH,'· helper-frames at desk',posted,'in cab',cab,'· longest without carrying or post',longNoWork.toFixed(1),'s');
 ok(worst<=5,label+': no helper idle off-station > 5 s ('+worst.toFixed(1)+' s)');ok(longNoWork<=25,label+': no helper drifts > 25 s without work or post ('+longNoWork.toFixed(1)+' s)');
 if(opt.post)ok(posted>0,label+': idle helpers use the operator desk');if(opt.cab)ok(cab>0,label+': a helper rides in the crane cab');return{posted,cab}}
function fresh(){H.store.clear();delete global.__smeltOn;const W=H.boot();W.S.heats=99;W.S.st.slagT=999;return W}
/* 1: scrap crane covers the scrap route (SM era) */
{const W=fresh();W.build('sm');W.setLv('kalk',10);W.setLv('kran',20);W.setLv('yard',15);W.hire('skrap',3);W.setLv('operator',1);
 watch(W,180,null,'skrapkran',{post:1,cab:1});
 /* manual control: the crane driver leaves the cab and watches at the desk */
 W.P.x=300;W.P.y=600;W.toggleCrane();let c2=0;for(let k=0;k<30*10;k++){W.update(DT);for(const h of W.helpers)if(W.inCab(h))c2++}ok(W.G.crane==='skrap'&&c2===0,'manual crane: nobody drawn in the cab while the player steers');W.toggleCrane()}
/* 2: ore crane + torpedo cars in the LD era: the ore/pig carriers */
{const W=fresh();W.build('ld');for(const[id,n]of Object.entries({kalk:12,o2:12,malmkran:14,malmtog:14,skip:10,torp:8,torpn:2,koks:15,cowper:15,rjsize:6,operator:1,slaggbil:1,ladle:2}))W.setLv(id,n);W.hire('rj',3);W.hire('ovn',2);
 watch(W,180,(W)=>{W.S.chg=W.chgCap()},'malmkran + torpedovogner',{post:1,cab:1})}
/* 3: magnet crane + hot charging + roller tables (late game) */
{const W=fresh();for(const b of W.BUILDS){W.build(b.id);if(b.id==='kob')break}for(const[id,n]of Object.entries({magkran:6,varm:1,rullkob:1,ktrans:1,strands:5,caster:8,operator:1,slaggbil:1,elekkran:1,kalk:15,o2:15,kull:8,lans:2,ladle:2}))W.setLv(id,n);
 for(const st of['strang','vv','tc','stel','nett','kob','ovn'])W.hire(st,2);
 watch(W,240,(W)=>{W.S.chg=W.chgCap()},'magnetkran + rullebaner + slaggbil/elektrodekran',{post:1})}
/* 4: the tapper */
{const W=fresh();W.setLv('operator',1);let readyWithLadle=0,worst=0,taps0=W.S.heats;
 for(let k=0;k<30*240;k++){W.S.hm=W.hmCap();W.S.chg=W.chgCap();W.update(DT);if(W.F.state==='ready'&&W.tapLadle()){readyWithLadle+=DT;worst=Math.max(worst,readyWithLadle)}else readyWithLadle=0}
 console.log('tapper: heats tapped',W.S.heats-taps0,'· longest ready with an empty ladle',worst.toFixed(2),'s');ok(W.S.heats-taps0>=3,'tapper taps heats by himself ('+(W.S.heats-taps0)+')');ok(worst<1.3,'tapper reacts within ~0,8 s ('+worst.toFixed(2)+' s)')}
/* 5: old save: operator level 1 = the tapper is hired */
{H.store.clear();H.store.set('smelteverket.v6',JSON.stringify({v:6,money:10,heats:20,lv:{operator:1,kalk:2},paid:{'u:torp':100},b:{sm:1}}));delete global.__smeltOn;const W=H.boot();
 ok(W.S.lv.operator===1&&W.padMaks(W.PAD.u_operator),'old save: Autotapping → Tapper hired (MAKS)');ok(W.S.paid['u:torp']===100&&W.PADS.find(d=>d.id==='u_torp')&&W.cost(W.PAD.u_torp)-W.S.paid['u:torp']===W.cost(W.PAD.u_torp)-100,'old save: paid-in u:torp kept on the torpedo pad')}
console.log(fails?'FAIL '+fails:'PASS');process.exitCode=fails?1:0;
