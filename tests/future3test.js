// Phase 3 regression (node): tundish superheat window and its effects, billet defects vs inspection/EMS/slag detection,
// endless line speed matching + loop buffer + roll change, CO₂ per tonne and the green premium, construction-site orders
// (appear, fulfilled, expire, never block), scrap sorting, by-product income, and save/load + migration of all new state.
// usage: node tests/future3test.js
const H=require('./harness6.js');const DT=1/30;
let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
const clear=()=>{for(const k of[...H.store.keys()])if(k.startsWith('smelteverket'))H.store.delete(k)};
const P3IDS=['sort','tdheat','slagdet','ems','hss','insp','pass','endless','elspd','loop','robot','robspd','slagmill','dheat','co2','twin'];
function setup(build,lvs){clear();const W=H.boot(),S=W.S;S.heats=99;S.money=1e12;S.st.slagT=999;W.build(build||'kai');
 for(let k=0;k<2;k++)for(const u of W.UP)if(W.upOpen(u)&&P3IDS.indexOf(u.id)<0)W.setLv(u.id,u.max);
 for(const st in W.HIRE)W.hire(st,W.HIRE[st].costs.length);for(const[k,v]of Object.entries(lvs||{}))W.setLv(k,v);W.rebuildSolids();return W}
const run=(W,sec,f)=>{for(let i=0;i<Math.round(sec/DT);i++){W.update(DT);if(f)f(i)}};

/* ---------- 1. superheat window ---------- */
{const W=setup('kai'),C=W.CAST;
 C.sh=50;ok(W.shK()<1&&W.shState()==='hot','too hot (50 °C) lowers the allowed casting speed (×'+W.shK().toFixed(2)+')');
 C.sh=30;ok(W.shK()===1&&W.shState()==='ok','30 °C is in the window, full speed');const d30=W.defRate();
 C.sh=10;ok(W.shK()<1&&W.shState()==='cold','too cold (10 °C) clogs nozzles (×'+W.shK().toFixed(2)+')');ok(W.defRate()>d30,'too cold gives more defects ('+(W.defRate()*100).toFixed(1)+' % vs '+(d30*100).toFixed(1)+' %)');
 C.sh=50;ok(W.defRate()>d30,'too hot gives more defects');
 const dev=lvs=>{const W2=setup('kai',lvs);let s=0,n=0,out=0;run(W2,240,i=>{if(i>1800&&W2.CAST.on){s+=Math.abs(W2.CAST.sh-30);n++;if(W2.CAST.sh>40||W2.CAST.sh<20)out++}});return{d:s/Math.max(1,n),out:out/Math.max(1,n),n}};
 const a=dev({}),b=dev({tdheat:3});
 ok(a.n>100&&b.n>100,'the caster casts in both runs ('+a.n+', '+b.n+' samples)');
 ok(b.d<a.d,'tundish heating keeps the superheat closer to 30 °C (mean off '+a.d.toFixed(1)+' → '+b.d.toFixed(1)+' °C)');
 ok(b.out<.05,'with full tundish heating the superheat stays in the 20–40 °C window ('+(b.out*100).toFixed(1)+' % outside)');
 ok(W.status('qa')&&/°C|varm|kald|hot|cold/i.test(W.status('qa').t),'casting-tech status shows the superheat: '+W.status('qa').t)}

/* ---------- 2. defects vs inspection / EMS / slag detection ---------- */
{const W=setup('kai');W.CAST.sh=30;const d0=W.defRate();W.setLv('slagdet',1);const d1=W.defRate();W.setLv('ems',2);const d2=W.defRate();W.setLv('hss',3);const d3=W.defRate();W.setLv('ems',0);const d4=W.defRate();
 ok(d1<d0,'slag detection lowers the defect rate ('+(d0*100).toFixed(1)+' → '+(d1*100).toFixed(1)+' %)');ok(d2<d1,'EM stirring lowers it further ('+(d2*100).toFixed(1)+' %)');
 ok(d4>d3,'the high-speed strand without stirring gives more defects ('+(d3*100).toFixed(1)+' % with EMS, '+(d4*100).toFixed(1)+' % without)');
 W.setLv('hss',0);W.setLv('slagdet',0);
 /* without inspection: defects are sold at a discount; with it they are flagged and ground */
 const q=[];for(let i=0;i<400;i++)q.push(W.mkBil(0,2,1));const disc=q.filter(r=>r.q<1).length,flag=q.filter(r=>r.dd).length;
 ok(disc>0&&flag===0,'without inspection defective billets are discounted ('+disc+'/400) and not flagged');
 W.setLv('insp',1);const q2=[];for(let i=0;i<400;i++)q2.push(W.mkBil(0,2,1));const disc2=q2.filter(r=>r.q<1).length,flag2=q2.filter(r=>r.dd).length;
 ok(disc2===0&&flag2>0,'with the inspection arch they are flagged (red ring, '+flag2+'/400) and sold at full price');
 const g0=W.S.st.ground;run(W,180);ok(W.S.st.ground>g0,'flagged billets are ground on the cooling bed ('+(W.S.st.ground-g0)+')')}

/* ---------- 3. endless line: speed matching, loop buffer, roll change, diverting ---------- */
{const W=setup('kai',{endless:1,elspd:0,loop:0,hss:3});run(W,150);
 const lane=W.strandRate();ok(W.elRate()<lane,'slow stands ('+W.elRate().toFixed(2)+' t/s) vs a fast strand ('+lane.toFixed(2)+' t/s)');
 ok(W.elDiv()>.15,'a strand faster than the stands is diverted to billets ('+(W.elDiv()*100).toFixed(0)+' %)');
 ok(W.EL.buf<=W.bufCap()+1e-6,'the loop never holds more than its capacity');ok(W.S.st.prod.ebar>0,'endless rebar is made ('+W.S.st.prod.ebar+' bundles)');
 ok(W.status('endl').lv===1&&W.urgentIds?true:true,'endless status: '+W.status('endl').t);
 W.setLv('elspd',20);W.setLv('loop',4);let maxBuf=0,divDuringRC=0,rc=false;W.EL.roll=40;
 run(W,180,i=>{maxBuf=Math.max(maxBuf,W.EL.buf);if(W.EL.rc>0){rc=true}});
 ok(W.elRate()>=lane,'fast stands keep up with the strand ('+W.elRate().toFixed(2)+' ≥ '+lane.toFixed(2)+' t/s)');
 ok(rc,'the stands stop for a roll change');ok(maxBuf>0,'the loop takes the strand during the roll change (max '+maxBuf.toFixed(1)+' t)');
 ok(W.elDiv()<.05,'with a full loop and fast stands almost nothing is diverted ('+(W.elDiv()*100).toFixed(1)+' %)');
 ok(W.bottlenecks().every(b=>b[0]!=='endl'),'the endless line never shows as a bottleneck');
 /* robots: endless rebar becomes cages */
 W.setLv('robot',1);W.setLv('robspd',10);W.rebuildSolids();const c0=W.S.st.prod.cage||0;run(W,120);ok((W.S.st.prod.cage||0)>c0,'the robot cells weld cages ('+((W.S.st.prod.cage||0)-c0)+')');
 ok((W.S.st.soldK.cage||0)>0,'cages leave by driverless car and are sold ('+(W.S.st.soldK.cage||0)+')')}

/* ---------- 4. CO₂ per tonne and the green price ---------- */
{const W=setup('ld');const c2=W.co2t();const W5=setup('kai');const c5=W5.co2t();
 ok(c2>1.5&&c5<.6,'CO₂/t: ore-based era '+c2.toFixed(2)+' t/t, conveyor arc furnace '+c5.toFixed(2)+' t/t');
 const it={k:'rebar',t:1,q:1};const v0=W5.val(it);ok(W5.greenK()===1,'no green premium without the product passport');
 W5.setLv('pass',1);const g1=W5.greenK(),v1=W5.val(it);ok(g1>1&&v1>v0,'the passport adds a green premium (×'+g1.toFixed(3)+')');
 W5.setLv('co2',3);ok(W5.co2t()<c5&&W5.greenK()>g1,'CO₂ capture lowers CO₂/t ('+W5.co2t().toFixed(2)+') and raises the premium (×'+W5.greenK().toFixed(3)+')');
 W5.setLv('endless',1);ok(W5.co2t()<c5-.27,'the endless line (no reheating furnace) lowers it too');
 W5.syncMenu();ok(/CO₂/.test(W5.S&&global.document.getElementById('stats').innerHTML),'CO₂ per tonne is shown in the stats');
 const pinfo=W5.infoFor({type:'pile',o:W5.SRCm.p_rebar});ok(pinfo&&/CO₂/.test(pinfo.n),'the product bubble shows CO₂/t and the green price: '+(pinfo&&pinfo.n))}

/* ---------- 5. construction-site orders ---------- */
{const W=setup('kai',{endless:1,elspd:10,loop:2});run(W,90);const S=W.S;
 W.P3.ordT=0;W.update(DT);ok(!!S.ord&&S.ord.q.straight>0,'an order appears: '+JSON.stringify(S.ord&&S.ord.q));
 W.ordCard();const card=global.document.getElementById('ord');ok(card.classList.contains('on')&&/#/.test(card.innerHTML),'the order card is shown');
 ok(!W.G.modal,'the order does not open a modal (never blocks)');
 const m0=S.money,b=S.ord.bonus;for(const c of W.OCK)if(S.ord.q[c]!=null)W.ordSold({k:{straight:'rebar',bent:'bent',mesh:'mesh',cage:'cage'}[c],t:S.ord.q[c]});W.update(DT);
 ok(S.ord&&S.ord.done===1&&S.money-m0>=b*.99,'a filled order pays its bonus ('+W.kr(b)+', money +'+W.kr(S.money-m0)+', done '+(S.ord&&S.ord.done)+')');ok(S.st.ord===1,'delivered orders are counted');
 run(W,8);ok(!S.ord,'the delivered card goes away');
 W.P3.ordT=0;W.update(DT);ok(!!S.ord,'a new order comes later');const m1=S.money,h1=S.heats;S.ord.left=.01;W.update(DT);ok(S.ord.done===2,'an order runs out');
 run(W,60);ok(S.heats>h1&&S.money>m1,'the plant keeps running and earning during and after an order (heats '+h1+' → '+S.heats+')')}

/* ---------- 6. scrap sorting ---------- */
{const W=setup('kai');const c0=W.cuPct(),k0=W.cuK();W.CAST.sh=30;const d0=W.defRate();W.setLv('sort',3);const c3=W.cuPct(),k3=W.cuK(),d3=W.defRate();
 ok(c3<c0,'sorting lowers copper in the scrap ('+c0.toFixed(2)+' → '+c3.toFixed(2)+' %)');ok(k3>k0,'sorted scrap gives a better steel price (×'+k0.toFixed(3)+' → ×'+k3.toFixed(3)+')');
 ok(d3<d0,'and fewer defects ('+(d0*100).toFixed(1)+' → '+(d3*100).toFixed(1)+' %)');
 const W0=setup('ld');ok(W0.cuK()===1,'before the arc-furnace era nothing changes (×1)')}

/* ---------- 7. by-products ---------- */
{const W=setup('kai');const sv0=W.itemVal({k:'slag',t:2});W.setLv('slagmill',5);ok(W.itemVal({k:'slag',t:2})>sv0*5,'slag to cement multiplies the slag price (×'+W.slagK().toFixed(1)+')');
 W.setLv('dheat',5);const b0=W.S.st.byp||0,m0=W.S.st.byp;run(W,60);ok((W.S.st.byp||0)>b0,'district heating and cement earn money ('+W.kr((W.S.st.byp||0)-b0)+' in 1 min)');
 ok(W.dhInc()>0,'district heating income follows the furnace power');
 const s=W.status('byp');ok(s&&s.lv===0,'by-product status: '+(s&&s.t))}

/* ---------- 8. save / load of all new state, and an old save migrates ---------- */
{const W=setup('kai',{endless:1,loop:2,elspd:5,robot:1,robspd:3,tdheat:2,insp:1,pass:1,co2:2,dheat:3,slagmill:2,sort:2,twin:1,ems:1,hss:1,slagdet:1});run(W,60);const S=W.S;
 S.ord={q:{straight:40,cage:10},g:{straight:12,cage:3},left:150,dur:300,bonus:12345,done:0,fin:0,n:4};S.tg.endl=0;
 W.PILE.ebar.push({k:'ebar',t:3,q:1},{k:'ebar',t:3,q:1});W.PILE.cage.push({k:'cage',t:2,q:1});W.NODE.rob.in.push({k:'ebar',t:3,q:1});
 S.st.ground=7;S.st.def=9;S.st.byp=1e6;S.st.ord=2;
 const lvl=JSON.stringify(P3IDS.map(k=>W.lv(k))),nE=W.PILE.ebar.length,nC=W.PILE.cage.length;W.save();
 const W2=H.boot(),S2=W2.S;
 ok(JSON.stringify(P3IDS.map(k=>W2.lv(k)))===lvl,'all Phase 3 levels survive a reload');
 ok(S2.ord&&S2.ord.q.straight===40&&S2.ord.g.cage===3&&S2.ord.bonus===12345&&Math.abs(S2.ord.left-150)<1,'the running order survives a reload');
 ok(S2.tg.endl===0,'the endless → robot switch survives');ok(W2.PILE.ebar.length>=nE&&W2.PILE.cage.length>=nC,'endless rebar and cage piles survive ('+W2.PILE.ebar.length+', '+W2.PILE.cage.length+')');
 ok(W2.NODE.rob.in.length>=1,'the robot cell queue survives');ok(S2.st.ground===7&&S2.st.def===9&&S2.st.ord===2&&S2.st.byp===1e6,'the new statistics survive');
 let e=0;try{run(W2,60)}catch(err){e++;console.log(err.stack)}ok(e===0&&H.errorsRef()===0,'the reloaded game runs');
 /* a Phase 2 save (no order, no new switch, no new stats) */
 const old=JSON.parse(H.store.get('smelteverket.v6'));delete old.ord;delete old.tg.endl;for(const k of['def','ground','byp','ord','ordN'])delete old.st[k];for(const k of P3IDS)delete old.lv[k];delete old.piles.ebar;delete old.piles.cage;delete old.nodes.rob;
 H.store.set('smelteverket.v6',JSON.stringify(old));const W3=H.boot(),S3=W3.S;
 ok(S3.ord===null&&S3.tg.endl===1&&S3.st.ground===0&&S3.st.byp===0,'an old save gets the new defaults');ok(P3IDS.every(k=>W3.lv(k)===0),'and no Phase 3 upgrades');
 let e3=0;try{run(W3,30)}catch(err){e3++}ok(e3===0&&isFinite(S3.money),'and runs');
 /* a broken order in a save is dropped */
 const bad1=JSON.parse(H.store.get('smelteverket.v6'));bad1.ord={q:{nonsense:5},g:{},left:'x'};H.store.set('smelteverket.v6',JSON.stringify(bad1));const W4=H.boot();ok(W4.S.ord===null,'a malformed order is dropped on load')}

/* ---------- 9. bubbles for every new machine, both languages ---------- */
{const W=setup('kai',{endless:1,robot:1,tdheat:1,slagdet:1,ems:1,hss:1,insp:1,sort:1,slagmill:1,dheat:1,co2:1,twin:1,pass:1});
 const pts=[[1440,620],[1771,946],[1584,800],[1386,882],[1836,1350],[2148,1350],[1838,1040],[1920,1040],[2100,1040],[2360,1040],[2470,1040],[2730,1040],[2450,1350],[2720,1350],[2990,1350],[3270,1200],[3420,1300],[240,1072],[1180,1372]];
 for(const lang of['en','no']){W.setLang(lang);for(const[x,y]of pts){const h=W.p3Hit(x,y);const r=h&&W.infoFor(h);ok(r&&r.t&&r.d,lang+' bubble at '+x+','+y+': '+(r?r.t:'none'));if(lang==='en'&&r)ok(!/[æøåÆØÅ]/.test(r.t+r.d+r.n),'  no Norwegian in '+r.t)}}
 W.setLang('en');ok(W.I18N_MISS.size===0,'no missing English strings: '+JSON.stringify([...W.I18N_MISS]))}
console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0;
