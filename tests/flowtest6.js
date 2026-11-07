// Exhaustive build-state flow test (v6): in every reachable build state (now up to the Phase 5 builds), with and without helpers, every
// built station either produces or shows a visible reason (status chip, level ≥ 1) for why it waits.
const H=require('./harness6.js');const DT=1/30;
const W0=H.boot();const B=W0.BUILDS.map(b=>b.id);delete global.__smeltOn;
const LEGS=['varm','magkran','rullkob','ktrans'];
let states=0,problems=[],checks=0;
function setup(W,ph,o){const S=W.S;S.heats=999;S.st.slagT=999;if(ph)W.build(B[ph-1]);
 for(const[id,n]of Object.entries({koks:6,cowper:6,malmkran:4,malmtog:6,skip:4,torpn:1,operator:1,kran:8,yard:8,charge:6,ladle:2,osekran:4,kalk:10,o2:10,kull:6,lans:1,slaggbil:1,elekkran:1,kokup:4,kran2:6,lft:4,caster:4,strands:3,turret:1,yard2:1}))W.setLv(id,n);
 for(const l of LEGS)if(o.legs)W.setLv(l,1);
 if(o.help)for(const st in W.HIRE)W.hire(st,1);
 S.cast=o.cast;S.mix=o.mix;S.chg=W.chgCap();W.rebuildSolids();W.bakeFloor()}
const STN=['rj','skrap','ovn','lf','blokk','strang','gjv','vv','tc','stel','nett','kob'];
const outKey={rj:'o:rj',skrap:'f:skrap>ovn',ovn:'tap',lf:null,blokk:'o:blokk',strang:'o:strang',gjv:'o:gjv',vv:'o:vv',tc:'o:tc',stel:'o:stel',nett:'o:nett',kob:'o:kob'};
for(let ph=0;ph<=B.length;ph++)for(const help of[0,1])for(const legs of[0,1])for(const cast of['auto','blokk','strang'])for(const mix of['begge','vals','arm']){
 H.store.clear();const W=H.boot();if(cast!=='auto'&&!(ph>=3))continue;if(mix!=='begge'&&!W.BUILDS.slice(0,ph).some(b=>b.id==='stel')){delete global.__smeltOn;continue}
 setup(W,ph,{help,legs,cast,mix});states++;
 const done={};let lfSeen=0;
 for(let k=0;k<30*240;k++){W.update(DT);if(W.LADLES.some(l=>l.state==='lf'))lfSeen=1;if(k%15===0){for(const id of STN){const key=outKey[id];if(key&&W.RT.acc[key]>0)done[id]=1}}if(k%30===0)W.draw()}
 if(lfSeen)done.lf=1;
 if(W.rjClosed()){for(const id in W.ZN){const st=W.status(id);if(st&&/råjern/i.test(st.t))problems.push('ph'+ph+': after Omlegging '+id+' still waits for råjern ('+st.t+')')}if(W.era()<7&&(W.S.hm>0||W.TORPS.some(t=>t.load>0)))/* (eras 7–10 run their own lines: hot metal from the ESF, steel / plates from the Phase 5 plants) */problems.push('ph'+ph+': råjern left in the steel plant after Omlegging')}
 for(const id of STN){const z=W.ZN[id];if(W.status(id)===null&&!done[id])continue;checks++;
  if(done[id])continue;const st=W.status(id);
  /* Phase 5: from era 8 the steel is made from ore – the scrap yard rests (its chip says so) */
  if(id==='skrap'&&W.era()>=8&&st&&st.t===W.t_('Hviler – stålet lages av malm'))continue;
  if(!st||!(st.lv>=1)||!st.t)problems.push('ph'+ph+(help?' help':'')+(legs?' legs':'')+' cast='+cast+' mix='+mix+': '+id+' dead without reason (status='+JSON.stringify(st)+')');
  else if(help&&legs){/* fully staffed and automated: only switches may excuse a dead station */
   const ok=(id==='blokk'&&(cast==='strang'||cast==='auto'))||(id==='tc'&&mix==='vals')||(id==='strang'&&cast==='blokk')||(id==='stel'&&mix==='arm')||(id==='nett'&&mix==='arm')||((id==='gjv'||id==='vv'||id==='tc'||id==='stel'||id==='nett'||id==='kob')&&cast==='blokk')||(id==='kob'&&mix==='vals')||(id==='lf'&&false)||(id==='skrap'&&/Skrapkassa er full|Chargering full/.test(st.t))||(id==='rj'&&/masseljern|torpedovogn/.test(st.t));
   if(!ok)problems.push('ph'+ph+' help legs cast='+cast+' mix='+mix+': '+id+' idle even though staffed ('+st.t+')')}}
 delete global.__smeltOn}
console.log('states',states,'station checks',checks,'problems',problems.length);console.log([...new Set(problems)].slice(0,50).join('\n'));process.exitCode=problems.length?1:0;
