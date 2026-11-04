// Helpers in every phase (all hired, max): no helper may sit stuck with a load while its target has room, and every
// trip must end empty at the target.
const H=require('./harness6.js');const DT=1/30;
const W0=H.boot();const B=W0.BUILDS.map(b=>b.id);delete global.__smeltOn;
let states=0,probs=new Set(),trips=0,bad=0;
for(let ph=0;ph<=B.length;ph++)for(const legs of[0,1]){H.store.clear();const W=H.boot();const S=W.S;S.heats=999;S.st.slagT=999;if(ph)W.build(B[ph-1]);
 for(const st in W.HIRE)W.hire(st,W.HIRE[st].costs.length);W.setLv('operator',1);W.setLv('ladle',2);W.setLv('kalk',8);W.setLv('o2',8);W.setLv('kull',4);W.setLv('hcap',6);
 if(legs)for(const l of['malmkran','koks','cowper','varm','magkran','rullkob','ktrans','kran','elekkran','slaggbil'])W.setLv(l,1);states++;
 const track=new Map(),prev=new Map();
 for(let k=0;k<30*300;k++){W.update(DT);if(k%30===0)W.draw();
  for(const h of W.helpers){const p=prev.get(h);if(p&&p.state==='unload'&&h.state!=='unload'){trips++;if(h.stack.length)bad++}prev.set(h,{state:h.state})}
  if(k%30===0)for(const h of W.helpers){const key=h.state+'|'+h.stack.length+'|'+Math.round(h.x/20)+','+Math.round(h.y/20);const t=track.get(h)||{key,n:0,free:0};if(t.key===key)t.n++;else{t.key=key;t.n=0}track.set(h,t);
   const full=h.state==='unload'&&h.tg&&W.freeFor(h.tg,h.stack[0]&&h.stack[0].k)<=0;t.free=full?0:t.free+1;
   if(t.n>40&&h.stack.length&&t.free>=3)probs.add('ph'+ph+(legs?'L':'')+' helper '+h.r+' stuck '+h.state+' with '+h.stack.length+' '+(h.stack[0]&&h.stack[0].k)+' tgt='+(h.tg&&h.tg.id))}}
 delete global.__smeltOn}
console.log('states',states,'trips',trips,'tripsEndedLoaded',bad);console.log([...probs].slice(0,40).join('\n')||'no stuck helpers');process.exitCode=probs.size||bad?1:0;
