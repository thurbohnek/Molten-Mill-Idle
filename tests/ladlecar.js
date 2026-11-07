// Ladle car (node): from the automated melt shop on (arc-furnace conversion, with the ladle furnace) a ladle car rolls the full
// ladle from under the tap to the ladle furnace and brings an empty ladle back from the stand. The ladle crane never lifts a
// ladle at the tap any more (only treated ladles at the ladle furnace → caster / ingot pit, and empties → the stands).
// Also: the car's info bubble in both languages, the track is drawn where it is solid and every pad stays reachable, and a
// save / load in the middle of a transfer runs on (the car gets a ladle under the tap again and the furnace keeps tapping).
const H=require('./harness6.js');const DT=1/30;
let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
const clear=()=>{for(const k of[...H.store.keys()])if(k.startsWith('smelteverket'))H.store.delete(k)};
function shop(build){clear();const W=H.boot(),S=W.S;S.heats=99;S.st.slagT=999;S.moved=true;W.build(build||'uhp');
 for(const[id,n]of Object.entries({operator:1,furnace:8,power:8,kalk:14,o2:14,kull:8,lans:2,elekkran:1,slaggbil:1,kran:10,yard:8,yard2:1,charge:6,ladle:3,lft:6,osekran:6,strands:5,caster:8,turret:1,kokup:4,kanal:1,hette:1}))W.setLv(id,n);
 for(const st in W.HIRE)W.hire(st,2);W.rebuildSolids();return W}
/* 1: no car before the automated melt shop (the open-hearth / LD eras keep the crane-and-parking system) */
{clear();const W=H.boot();W.S.heats=99;W.build('ld');ok(W.B_('lf')&&!W.carOn(),'LD era: ladle furnace built, no ladle car yet (crane system as before)')}
/* 2: the car's cycle in the arc-furnace era */
{const W=shop('uhp'),C=W.CAR,c=W.CRm.ose;let seen={},carried=0,toLF=0,craneAtTap=0,emptyBack=0,lastSt='',h0=W.S.heats;
 for(let i=0;i<240/DT;i++){W.update(DT);seen[C.st]=1;
  if(C.st!==lastSt){if(C.st==='lf'&&C.L&&C.L.steel>1)toLF++;if(C.st==='tap'&&lastSt==='toTap'&&C.L&&C.L.steel<=.01)emptyBack++;lastSt=C.st}
  /* the crane must never lift a ladle at the tap: its pick-up points are the ladle furnace, the turret, the pit and the stands */
  if(c.state==='down'&&c.job&&c.job.L&&Math.hypot(c.x-W.POS.tap.x,c.y-W.POS.tap.y)<40)craneAtTap++;
  if(c.pay&&c.pay.steel>.01&&c.job&&Math.hypot(c.job.from.x-W.POS.tap.x,c.job.from.y-W.POS.tap.y)<40)carried++}
 ok(W.carOn(),'arc-furnace era: the ladle car runs');
 ok(['tap','toLF','lf','toStand','stand','toTap'].every(k=>seen[k]),'the car goes through its whole cycle: '+Object.keys(seen).join(' → '));
 ok(toLF>=5,`full ladles rolled from the tap to the ladle furnace by the car: ${toLF}`);
 ok(emptyBack>=5,`empty ladles brought back under the tap by the car: ${emptyBack}`);
 ok(craneAtTap===0&&carried===0,`the ladle crane never lifts a ladle at the tap (${craneAtTap} lifts, ${carried} full ladles from the tap)`);
 ok(W.S.heats-h0>=8,`the furnace keeps tapping (${W.S.heats-h0} heats in 4 min)`);
 /* every ladle-furnace treatment happened on the car */
 ok(W.LADLES.every(l=>l.state!=='lf'||W.CAR.L===l),'a ladle in the ladle furnace stands on the car');
 /* the bubble, both languages */
 for(let i=0;i<60/DT&&!(W.CAR.st==='tap'&&W.CAR.L);i++)W.update(DT);
 for(const lang of['en','no']){W.setLang(lang);const h=W.hitInfo(W.CAR.x+30,W.POS.tap.y+10),i=h&&W.infoFor(h);
  ok(h&&h.type==='lcar'&&i&&i.t&&i.d.length>40&&i.n,`${lang}: tapping the car opens its bubble ("${i&&i.t}" · ${i&&i.n})`);
  if(lang==='en')ok(!/[æøåÆØÅ]/.test(i.t+i.d+i.n),'en: no Norwegian in the car bubble')}
 W.setLang('no');
 /* the track: solid where drawn, the walkway crossing between the tap and the ladle furnace is open, every pad reachable */
 const y=W.POS.tap.y,R=W.POS.rail;ok(W.blockedPt(R.w1+40,y,0)&&W.blockedPt(W.POS.stand.x,y,0),'the track bed past the crossing is solid (drawn as a fenced trench)');
 ok(!W.blockedPt((R.w0+R.w1)/2,y,0),'the walkway crossing over the track is open');
 W.rebuildNav();const f=W.field(W.START.x,W.START.y),NC=20,GW=Math.ceil((W.WW-W.WX0)/NC);
 const reach=(x,yy)=>{for(let dj=-2;dj<=2;dj++)for(let di=-2;di<=2;di++){const i=Math.floor((x-W.WX0)/NC)+di,j=Math.floor(yy/NC)+dj;if(i<0||j<0||i>=GW)continue;if(f[j*GW+i]>=0)return true}return false};
 const miss=W.PADS.filter(d=>W.vis(d)&&!reach(d.x,d.y)).map(d=>d.id);ok(miss.length===0,'every visible pad is reachable: '+(miss.join(',')||'-'));
 ok(reach(1180,500)&&reach(1180,700)&&reach((R.w0+R.w1)/2,y),'north and south of the track and the crossing are reachable')}
/* 3: save / load in the middle of a transfer (full ladle on the car on its way to the ladle furnace) */
{const W=shop('consteel');let got=false;for(let i=0;i<300/DT&&!got;i++){W.update(DT);got=W.CAR.st==='toLF'&&W.CAR.L&&W.CAR.L.steel>1}
 ok(got,'a full ladle is rolling to the ladle furnace when the game is saved');W.save();delete global.__smeltOn;
 const W2=H.boot();let e=0,h0=W2.S.heats,st={};for(let i=0;i<120/DT;i++){try{W2.update(DT)}catch(err){e++;if(e<3)console.log(err.stack)}st[W2.CAR.st]=1}
 ok(e===0,'runs on after the reload without exceptions');ok(W2.carOn()&&W2.S.heats-h0>=3,`after the reload the car works and the furnace taps (${W2.S.heats-h0} heats in 2 min, car states ${Object.keys(st).join(',')})`);
 ok(W2.LADLES.every(l=>isFinite(l.x)&&isFinite(l.y)&&isFinite(l.steel)),'ladles restored with finite positions');
 /* an old save (no tap automation level, more caster levels than the new maximum) loads */
 clear();H.store.set('smelteverket.v6',JSON.stringify(Object.assign(JSON.parse(JSON.stringify(W2.S)),{lv:Object.assign({},W2.S.lv,{caster:22,tapauto:undefined})})));delete global.__smeltOn;
 const W3=H.boot();ok(W3.lv('caster')===W3.UPm.caster.max&&W3.lv('tapauto')===0,`old save: caster level clamped to ${W3.UPm.caster.max}, tap automation 0`);
 let e3=0;for(let i=0;i<30/DT;i++){try{W3.update(DT)}catch(err){e3++}}ok(e3===0,'old save runs')}
console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0;
