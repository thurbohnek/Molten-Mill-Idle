// Buying a new furnace era (or the electric pig-iron furnace) while the old one is charging, blowing or tapping must not strand anything.
const H=require('./harness6.js');let bad=0;
const BASE={koks:8,cowper:8,malmkran:4,malmtog:6,skip:4,torp:4,torpn:1,rjsize:6,kalk:8,o2:8,kull:6,kran:8,yard:8,ladle:2,osekran:4,slaggbil:1,elekkran:1,operator:1,strands:3,caster:4};
for(const era of['sm','ld','elrj','eaf1','uhp','consteel'])for(const when of['charge','blow','tapping']){H.store.clear();const W=H.boot();const S=W.S;S.heats=99;S.st.slagT=99;for(const[id,n]of Object.entries(BASE))W.setLv(id,n);
 const idx=W.BUILDS.findIndex(b=>b.id===era);if(idx>0)W.build(W.BUILDS[idx-1].id);S.chg=W.chgCap();S.hm=W.hmCap();
 const hit=()=>when==='tapping'?W.F.state==='tapping':when==='charge'?!!(W.F.ch||W.F.hmCh):(W.F.state==='melt'&&W.F.solid>1&&!W.F.ch);
 let i=0;for(;i<30*240&&!hit();i++)W.update(1/30);const was=hit()?when:'(not reached: '+W.F.state+')';if(W.F.state==='tapping')W.F.tapT=1;W.build(era);
 const h0=W.S.heats;let nan=0;for(let k=0;k<30*240;k++){W.update(1/30);if(!isFinite(W.F.bath)||!isFinite(W.S.hm))nan++}
 const ok=W.S.heats-h0>=2&&!nan&&W.LADLES.every(l=>isFinite(l.steel));console.log(era.padEnd(9),'built while',was.padEnd(10),'→ heats in next 4 min:',W.S.heats-h0,ok?'':'  <-- FAIL');if(!ok)bad++;delete global.__smeltOn}
console.log(bad?'FAIL':'PASS');process.exitCode=bad?1:0;
