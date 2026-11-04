// Torpedo cars should leave full (or nearly), not with a small trickle. Scenario like the user's: LD, 2 cars, medium masovn.
const H=require('./harness6.js');const DT=1/30;let fails=0;
for(const cfg of[{rjsize:3,torp:1,torpn:1},{rjsize:6,torp:1,torpn:2},{rjsize:1,torp:4,torpn:2},{rjsize:10,torp:0,torpn:1}]){
 H.store.clear();const W=H.boot();const S=W.S;S.heats=99;S.st.slagT=99;W.build('ld');
 for(const[id,n]of Object.entries(Object.assign({operator:1,furnace:1,power:4,kalk:5,o2:5,ladle:1,osekran:3,slaggbil:1,strands:3,caster:3,koks:10,cowper:10,malmkran:10,malmtog:10,skip:6},cfg)))W.setLv(id,n);
 const keep=()=>{S.chg=W.chgCap();S.yard.ore=200};const prev={};const loads=[];let rjsum=0;
 for(let k=0;k<30*600;k++){keep();W.update(DT);rjsum+=W.F.rate>0?0:0;for(const t of W.TORPS){if(prev[t.i]==='fill'&&t.st==='go')loads.push(t.load);prev[t.i]=t.st}}
 const cap=W.torpCap(),small=loads.filter(l=>l<cap*.5).length;
 console.log(JSON.stringify(cfg),'cap',cap,'trips',loads.length,'avg',(loads.reduce((a,b)=>a+b,0)/loads.length).toFixed(1),'min',Math.min(...loads).toFixed(1),'small(<50%)',small,'heats',S.heats-99,'ovn',JSON.stringify(W.status('ovn')));
 if(small>loads.length*.25)fails++;delete global.__smeltOn}
console.log(fails?'FAIL':'PASS')
