// Consteel era (node): the magnet crane alone (no scrap helpers) keeps the furnace fed, its lifts are spread over the whole
// charging section, the scrap is preheated in the tunnel, the temperature robot measures periodically, slag runs out of the
// slag door, the bottleneck chips point at the crane / conveyor / yard, solids match the drawn line, bubbles exist (NO+EN).
// usage: node consteeltest.js [file]
process.env.GLANG='en';
const H=require('./harness6.js');
let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
const LV={kran:10,charge:8,furnace:8,power:8,kalk:16,o2:16,kull:12,lans:2,slaggbil:1,operator:1,ladle:2,elekkran:1,yard:10,yard2:1,strands:7,caster:10,turret:1,slagcap:4,osekran:4};
function fresh(){for(const k of[...H.store.keys()])if(k.startsWith('smelteverket'))H.store.delete(k);return H.boot()}
function boot(lv){const W=fresh();W.S.heats=99;W.S.st.slagT=999;W.build('consteel');for(const k in lv)W.setLv(k,lv[k]);W.hire('skrap',0);W.S.yard.y0=W.S.yard.y1=150;return W}
/* ---------- 1. crane alone feeds the furnace ---------- */
{const W=boot(LV),S=W.S,F=W.F,C=W.CSG,DT=1/30;let melt=0,starve=0,hasScrap=0,slk=0,slkN=0,t=0,lastT=-1,pot0=0;const hist=new Array(7).fill(0),xs=[];
 ok(W.helpers.filter(h=>h.r==='skrap').length===0,'no scrap helpers hired');ok(W.CRm.skrap.built(),'charging crane exists in the Consteel era');
 const r0=W.TROB().n;let tempOk=true,readings=0,lastN=0;
 for(let i=0;i<30*600;i++){W.update(DT);t+=DT;if(t<40)continue;
  if(F.state==='melt'){melt+=DT;if(F.starve>0)starve+=DT;if(F.rate>0)hasScrap+=DT;slk+=W.CSB.slk;slkN++}
  for(const d of W.CSB.drops)if(d.t>lastT){lastT=d.t;xs.push(d.x);hist[Math.round((d.x-(C.x0+24))/((C.xc-24-(C.x0+24))/6))]++}
  const R=W.TROB();if(R.n>lastN){lastN=R.n;readings++;if(R.val<1450||R.val>1700)tempOk=false}}
 const sf=starve/melt,hf=hasScrap/melt;
 ok(sf<.03,'furnace starved '+(sf*100).toFixed(1)+' % of melting time (< 3 %), crane level '+LV.kran);
 ok(hf>.9,'furnace melting scrap '+(hf*100).toFixed(1)+' % of melting time');
 ok(S.heats>99+20,'heats in 10 min: '+(S.heats-99));
 const n=xs.length,mn=Math.min(...xs),mx=Math.max(...xs);
 ok(n>100,'crane lifts in 10 min: '+n);ok(mn<C.x0+40&&mx>C.xc-40,'drops span the charging section '+Math.round(mn)+'…'+Math.round(mx)+' of '+C.x0+'…'+C.xc);
 ok(hist.every(v=>v>=n*.06),'every drop slot used ≥ 6 %: '+hist.join(','));
 ok(W.CSB.pre>350&&W.CSB.pre<700,'scrap preheated in the tunnel: '+Math.round(W.CSB.pre)+' °C');
 const k=W.kwh();ok(k>=300&&k<=360,'specific energy with preheat '+k+' kWh/t (base 340)');
 ok(readings>=600/30&&tempOk,'temperature robot readings: '+readings+' in 10 min, all 1450–1700 °C');
 ok(slk/slkN>.7,'slag runs from the door while melting: '+(slk/slkN).toFixed(2));ok(S.st.soldK.slag>0||S.pot>0,'slag reaches the pit');
 /* conveyor mass is conserved and bounded */
 ok(Math.abs(W.csSum()-S.chg)<1e-3&&S.chg<=W.chgCap()+1e-6,'conveyor tonnes '+S.chg.toFixed(1)+' ≤ '+W.chgCap().toFixed(1));
 /* the gas profile: hottest at the furnace end, cooler at the takeoff */
 ok(W.csGasT(C.xf-4)>W.csGasT(C.xs+4)+300,'off-gas cools toward the takeoff: '+Math.round(W.csGasT(C.xf-4))+' → '+Math.round(W.csGasT(C.xs+4))+' °C');
 /* scrap is hotter near the furnace end of the tunnel than at the entry */
 {let a=0,am=0,b=0,bm=0;for(let i=0;i<W.CSN;i++){const x=W.csX(i),m=W.CSB.m[i];if(x>C.xs&&x<C.xs+60){a+=m*W.CSB.tc[i];am+=m}if(x>C.xt-60&&x<C.xt){b+=m*W.CSB.tc[i];bm+=m}}
  ok(am>0&&bm>0&&b/bm>a/am+100,'scrap heats along the tunnel: '+Math.round(a/max1(am))+' → '+Math.round(b/max1(bm))+' °C')}
}
function max1(v){return Math.max(1e-9,v)}
/* ---------- 2. limiter chips: crane, conveyor, yard ---------- */
{const W=boot(Object.assign({},LV,{kran:0,furnace:16,power:16,charge:16}));for(let i=0;i<30*90;i++)W.update(1/30);
 const s=W.status('skrap');ok(W.csLim()==='kran'&&s.lv===2&&s.t===W.t_('Flaskehals: chargeringskranen'),'weak crane → chip "'+(s&&s.t)+'"');
 ok(W.curUp('skrap')&&['kran','magnet'].includes(W.curUp('skrap').id),'scrap-yard pad suggests the crane: '+(W.curUp('skrap')||{}).id);
 ok(W.bottlenecks().some(b=>b[0]==='skrap'),'map/bottleneck list has the scrap yard');}
{const W=boot(Object.assign({},LV,{kran:20,magnet:6,charge:0,furnace:16,power:16}));for(let i=0;i<30*90;i++)W.update(1/30);
 const s=W.status('skrap');ok(W.csLim()==='band'&&s.t===W.t_('Flaskehals: chargeringsbåndet'),'slow conveyor → chip "'+(s&&s.t)+'"');ok((W.curUp('skrap')||{}).id==='charge','pad suggests the faster conveyor');}
{const W=boot(Object.assign({},LV,{kran:20,magnet:4,charge:16,furnace:16,power:16,yard:0,yard2:0}));W.S.yard.y0=0;for(let i=0;i<30*90;i++)W.update(1/30);
 const s=W.status('skrap');ok(W.csLim()==='yard'&&s.t===W.t_('Flaskehals: skraptilførsel'),'empty yard → chip "'+(s&&s.t)+'"');}
{const W=boot(Object.assign({},LV,{kran:20,magnet:10,charge:20,furnace:6,power:6}));for(let i=0;i<30*90;i++)W.update(1/30);ok(W.csLim()==='','strong line: no scrap-yard bottleneck ('+W.csLim()+')')}
/* ---------- 3. manual crane: drive it, drop anywhere over the charging section (double lift) ---------- */
{const W=boot(LV),c=W.CRm.skrap,C=W.CSG;for(let i=0;i<60;i++)W.update(1/30);/* Phase 2: in the automated eras the crane is taken over at its pulpit */const pu=W.ctlDesks?W.ctlDesks().find(d=>d.id==='skrap'):null;if(pu){W.P.x=pu.x;W.P.y=pu.y+30}else{W.P.x=250;W.P.y=560}const ch=W.craneHere();ok(ch&&ch.id==='skrap','crane button at the scrap-crane pulpit');W.toggleCrane();ok(c.man,'crane under manual control');
 for(let i=0;i<30*10&&!(c.state==='idle'||c.state==='toPick');i++)W.update(1/30);let dropped=false,picked=false;
 for(let i=0;i<30*40&&!dropped;i++){if(c.load>W.craneLift()*1.5)picked=Math.max(picked||0,c.load);const before=W.CSB.drops.length;const j=c.job;let tx=c.x,ty=c.y;if(j){if(c.state==='toPick'){tx=j.from.x;ty=j.from.y}else if(c.state==='toDrop'){tx=180;ty=C.y}}
  const dx=tx-c.x,dy=ty-c.y,d=Math.hypot(dx,dy);W.J.on=d>4;W.J.virt=true;W.J.ox=200;W.J.oy=400;W.J.x=200+(d?dx/d*40:0);W.J.y=400+(d?dy/d*40:0);W.update(1/30);if(picked&&W.CSB.drops.length!==before)dropped=true}
 W.J.on=false;const last=W.CSB.drops[W.CSB.drops.length-1];ok(dropped&&Math.abs(last.x-180)<30,'manual lift dropped where the crane was ('+(last&&Math.round(last.x))+')');
 ok(picked>=W.craneLift()*1.95,'manual lift is a double load: '+(+picked).toFixed(1)+' t vs '+W.craneLift().toFixed(1));W.toggleCrane();ok(!c.man,'crane back on auto')}
/* ---------- 4. solids: the hood, seal, duct, car, gas plant and robot are solid; the open conveyor and pads are not ---------- */
{const W=boot(LV),C=W.CSG;W.rebuildSolids();const b=(x,y)=>W.blockedPt(x,y,0);
 ok(b(500,C.y)&&b(C.xs+3,C.y)&&b(C.xt+10,C.y)&&b(C.dx,450)&&b(400,200)&&b(250,150)&&b(W.TROBP.x,W.TROBP.y)&&b(800,720),'tunnel, car, duct, drop-out box, bag filter, robot, slag chute are solid');
 ok(!b(200,C.y)&&!b(W.POS.drop.x,W.POS.drop.y)&&!b(W.POS.y0.x,W.POS.y0.y+60),'open charging section, chute ring and pile are walkable');
 W.rebuildNav();const f=W.field(W.START.x,W.START.y),NC=20,GW=Math.ceil((W.WW-W.WX0)/NC),reach=(x,y)=>f[Math.floor(y/NC)*GW+Math.floor((x-W.WX0)/NC)]>=0;
 ok(reach(W.POS.drop.x,W.POS.drop.y)&&reach(W.POS.y0.x,W.POS.y0.y)&&reach(W.POS.y1.x,W.POS.y1.y)&&reach(W.POS.pot.x,W.POS.pot.y)&&reach(W.POS.tapPad.x,W.POS.tapPad.y),'yard, chute, slag pit and TAP reachable');
 {const L=W.chipLayout(W.ZN.skrap,'Bottleneck: scrap to the furnace and a very long text that must be cut');ok(L.x+L.w<=C.dx-C.dw/2-2,'scrap-yard chip stays left of the duct ('+Math.round(L.x+L.w)+' ≤ '+(C.dx-C.dw/2)+')')}}
/* ---------- 5. tap-to-explain bubbles for every part of the line, both languages ---------- */
{const W=boot(LV),C=W.CSG;for(let i=0;i<30*20;i++)W.update(1/30);
 W.CRm.skrap.x=60;W.CRm.skrap.y=1000;W.pause(true);
 const pts={charge:[200,C.y],conveyor:[40,C.y],seal:[(C.xc+C.xs)/2,C.y],tunnel:[520,C.y+10],inj:[520,C.y-C.hw-12],duct:[C.dx,450],filter:[250,150],car:[C.xt+10,C.y],door:[W.POS.F.x,W.POS.F.y+110],robot:[W.TROBP.x,W.TROBP.y]};
 for(const lang of['en','no']){W.setLang(lang);for(const id in pts){const h=W.hitInfo(...pts[id]),i=h&&W.infoFor(h);ok(h&&h.type==='cs'&&h.id===id&&i&&i.t&&i.d.length>40&&(lang==='no'||!/[æøåÆØÅ]/.test(i.t+i.d+i.n)),lang+' bubble '+id+': '+(i?i.t+' | '+i.n:'none'))}
  const hp=W.hitInfo(W.POS.pot.x,W.POS.pot.y),ip=W.infoFor(hp);ok(ip&&ip.t===(lang==='en'?'Slag pit':'Slagg-grop'),lang+' slag pit bubble: '+(ip&&ip.t));
  const c=W.CRm.skrap,hc=W.infoFor({type:'crane',c});ok(hc&&hc.t===(lang==='en'?'Charging crane':'Chargeringskran'),lang+' crane bubble: '+(hc&&hc.t));
  const fu=W.infoFor({type:'furnace'});ok(fu&&/45/.test(fu.d),lang+' furnace bubble explains the hot heel')}
 W.setLang('en');ok(W.I18N_MISS.size===0,'no untranslated strings: '+JSON.stringify([...W.I18N_MISS].slice(0,5)))}
/* ---------- 6. earlier eras keep their layout ---------- */
{const W=fresh();W.S.heats=99;W.build('nett');ok(W.era()===4&&W.POS.y0.y===500&&W.POS.drop.x===440&&W.UPROW.skrap.s[0][1]===414&&W.SRCm.y0.y===500,'UHP era: original scrap-yard layout');
 W.build('consteel');ok(W.POS.y0.y===W.LAY5.y0.y&&W.POS.drop.x===W.LAY5.drop.x&&W.UPROW.skrap.s[0][1]===W.LAY5.row[0][1],'Consteel era: line layout')}
console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0;
