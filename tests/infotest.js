// Tap-to-explain (Playwright): a short tap on each type of object opens its bubble; the next press anywhere closes it,
// tapping another object opens that one, the closing press still starts the joystick, Escape / menu / map close it,
// and tapping a locked pad next to the player keeps buying instead. Runs in English and Norwegian.
// usage: node infotest.js [file]
const {chromium}=require('playwright');const fs=require('fs');
const FILE=process.argv[2]||require('path').join(__dirname,'../index.html');
let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
(async()=>{const b=await chromium.launch();
for(const LANG of['en','no']){
const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{try{localStorage.setItem('molten.lang',l)}catch(e){}},LANG);
fs.writeFileSync(require('path').join(require('os').tmpdir(),'info_page.html'),'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">'+fs.readFileSync(FILE,'utf8')+'</body></html>');
await p.goto('file://'+require('path').join(require('os').tmpdir(),'info_page.html'));await p.waitForTimeout(700);
await p.evaluate(()=>{const W=window.__smelt;W.endIntro();W.S.moved=true;W.S.heats=99;W.build('strang');W.setLv('kanal',1);W.setLv('hette',1);W.setLv('kalk',2);W.setLv('o2',2);W.hire('skrap',1);
 W.addPile({k:'ingot',t:2,q:1});W.S.money=0;for(let i=0;i<600;i++)W.update(1/60)});
ok(await p.evaluate(()=>window.__smelt.LANG)===LANG,LANG+': language from localStorage');
/* place the camera on a world point (player parked nearby, off pads and rings), return page coords of the point */
const aim=async(wx,wy,px,py)=>{await p.evaluate(([wx,wy,px,py])=>{const W=window.__smelt;W.P.stack=[];W.P.x=px;W.P.y=py;W.P.vx=W.P.vy=0;W.cam.x=px;W.cam.y=py},[wx,wy,px,py]);await p.waitForTimeout(250);
 return p.evaluate(([wx,wy])=>{const W=window.__smelt,c=document.getElementById('c').getBoundingClientRect(),s=W.ws(wx,wy);return[c.left+s[0],c.top+s[1]]},[wx,wy])};
const lp=async(x,y)=>{await p.mouse.move(x,y);await p.mouse.down();await p.waitForTimeout(600);await p.mouse.up()};
const bubble=()=>p.evaluate(()=>{const e=document.getElementById('info');return{on:e.classList.contains('on'),t:document.getElementById('infoT').textContent,d:document.getElementById('infoP').textContent,n:document.getElementById('infoN').textContent,
 top:e.style.top,bottom:e.style.bottom,r:e.getBoundingClientRect().toJSON()}});
const expect=(wx,wy)=>p.evaluate(([wx,wy])=>{const W=window.__smelt,h=W.hitInfo(wx,wy);const i=h&&W.infoFor(h);return h?{type:h.type,key:h.key,t:i&&i.t}:null},[wx,wy]);
/* object list: [label, expected hit type, world x, world y, player park x, y] */
const O=await p.evaluate(()=>{const W=window.__smelt,P=W.POS,S=W.S,L=W.LADLES[0],T=W.TORPS[0],kr=W.CRm.ose;const pad=W.PAD.u_hette,hp=W.PAD.hire_skrap,sw=W.SW.find(s=>s.id==='cast');
 return[['upgrade pad (hot-top compound)','pad',pad.x,pad.y,pad.x,pad.y+150],['hire pad','pad',hp.x,hp.y,hp.x+130,hp.y-60],['build pad','pad',W.nextBuild().x,W.nextBuild().y,W.nextBuild().x-160,W.nextBuild().y],
  ['switch','sw',sw.x,sw.y,sw.x,sw.y-140],['sale ring','ring',P.bil1.x,P.bil1.y,P.bil1.x-120,P.bil1.y-70],['drop / charging','drop',P.drop.x,P.drop.y,P.drop.x-120,P.drop.y+100],
  ['TAP ring','tap',P.tapPad.x,P.tapPad.y,P.tapPad.x+120,P.tapPad.y+40],['scrap pile','src',P.y0.x,P.y0.y,P.y0.x+150,P.y0.y+60],['store (hot-top)','src',P.hette.x,P.hette.y,P.hette.x,P.hette.y+170],
  ['product pile','pile',W.PR.ingot.pile.x,W.PR.ingot.pile.y,W.PR.ingot.pile.x-100,W.PR.ingot.pile.y+140],['slag pot','src',P.pot.x,P.pot.y,P.pot.x-120,P.pot.y+80],
  ['ladle','ladle',L.x,L.y,L.x+150,L.y+30],['torpedo car','torp',T.x,[P.torpA,P.torpB].find(y=>{const h=W.hitInfo(T.x,y);return h&&h.type==='torp'})||P.torpA,T.x,P.torpB+110],['crane','crane',kr.x,kr.y,kr.x,kr.y+140],
  ['steel furnace','furnace',P.F.x,P.F.y+40,P.F.x-160,P.F.y+180],['iron furnace','rjf',P.rjF.x,P.rjF.y-60,P.rjF.x+170,P.rjF.y+60],['ore train','misc',-560,P.oreTrainY,-560,P.oreTrainY-160],
  ['hot-metal ladle','misc',P.hmL.x,P.hmL.y,P.hmL.x-130,P.hmL.y+40],['zone (ladle furnace)','zone',1270,350,1180,500],['plot (next build)','zone',2400,800,2350,700]]});
let prevKey=null;
for(let [lab,type,wx,wy,px,py] of O){let[x,y]=await aim(wx,wy,px,py);
 /* torpedo cars move: re-read the first car's position right before the tap */
 if(type==='torp'){[wx,wy,x,y]=await p.evaluate(()=>{const W=window.__smelt,P=W.POS,T=W.TORPS[0],c=document.getElementById('c').getBoundingClientRect();const y=[P.torpA,P.torpB].find(y=>{const h=W.hitInfo(T.x,y);return h&&h.type==='torp'})||P.torpA;W.G.free=true;W.cam.x=T.x;W.cam.y=y;const s=W.ws(T.x,y);return[T.x,y,c.left+s[0],c.top+s[1]]})}
 const ex=await expect(wx,wy);
 await lp(x,y);await p.waitForTimeout(120);const B=await bubble();
 ok(ex&&ex.type===type,LANG+' '+lab+': hit '+(ex&&ex.type)+' ('+(ex&&ex.key)+')');
 ok(B.on&&B.t&&B.t===ex.t&&B.d.length>20,LANG+' '+lab+': bubble "'+B.t+'" — '+B.d.slice(0,60)+'… | '+B.n);
 if(B.on){const r=B.r;ok(r.left>=0&&r.right<=390&&r.top>=0&&r.bottom<=800&&r.width<=390*.88+1,LANG+' '+lab+': bubble inside the screen, ≤ 88 % wide ('+Math.round(r.width)+')');
  /* not over the tapped object */const over=x>r.left&&x<r.right&&y>r.top&&y<r.bottom;ok(!over,LANG+' '+lab+': bubble does not cover the object ('+(B.top?'top':'bottom')+')')}
 prevKey=ex&&ex.key}
/* the next press closes it; tapping another object opens that one at once */
{const[x,y]=await aim(1180,560,1180,700);await lp(x,y);await p.waitForTimeout(100);const a=await bubble();
 const[x2,y2]=await aim(1180,560,1180,700);const pz=await p.evaluate(()=>{const W=window.__smelt;return[W.POS.lf.x,W.POS.lf.y]});
 await p.mouse.click(x2+0,y2+0);await p.waitForTimeout(100);const b2=await bubble();ok(a.on&&!b2.on,LANG+': same object tapped again closes ('+a.on+'→'+b2.on+')');
 // open on the furnace, then tap the TAP ring: the ring's bubble replaces it
 const[fx,fy]=await aim(800,640,900,700);await lp(fx,fy);await p.waitForTimeout(100);const f1=await bubble();
 const tp=await p.evaluate(()=>{const W=window.__smelt,c=document.getElementById('c').getBoundingClientRect(),s=W.ws(W.POS.tapPad.x,W.POS.tapPad.y);return[c.left+s[0],c.top+s[1]]});
 await lp(tp[0],tp[1]);await p.waitForTimeout(100);const f2=await bubble();ok(f1.on&&f2.on&&f2.t!==f1.t,LANG+': tapping another object shows its bubble ("'+f1.t+'" → "'+f2.t+'")');
 // empty floor: closes, nothing new
 const[ex,ey]=await aim(548,700,548,560);await p.mouse.click(ex,ey);await p.waitForTimeout(100);const f3=await bubble();ok(!f3.on,LANG+': tap on empty floor closes the bubble')}
/* the closing tap only closes the bubble; the next tap walks */
{const[x,y]=await aim(800,640,640,780);await lp(x,y);await p.waitForTimeout(100);const on=(await bubble()).on;await p.evaluate(()=>{window.__smelt.G.go=null});
 const p0=await p.evaluate(()=>[window.__smelt.P.x,window.__smelt.P.y]);await p.mouse.click(260,600);await p.waitForTimeout(300);const B=await bubble();const p1=await p.evaluate(()=>[window.__smelt.P.x,window.__smelt.P.y]);
 await p.mouse.click(260,600);await p.waitForTimeout(900);const p2=await p.evaluate(()=>[window.__smelt.P.x,window.__smelt.P.y]);
 ok(on&&!B.on&&Math.hypot(p1[0]-p0[0],p1[1]-p0[1])<3&&Math.hypot(p2[0]-p0[0],p2[1]-p0[1])>20,LANG+': the closing tap only closes, the next tap walks (moved '+Math.round(Math.hypot(p2[0]-p0[0],p2[1]-p0[1]))+' px)')}
/* HUD press, Escape, menu and map close it */
{const[x,y]=await aim(800,640,640,780);await lp(x,y);await p.waitForTimeout(80);await p.keyboard.press('Escape');ok(!(await bubble()).on,LANG+': Escape closes');
 await lp(x,y);await p.waitForTimeout(80);const o1=(await bubble()).on;await p.click('#menuBtn');await p.waitForTimeout(80);ok(o1&&!(await bubble()).on,LANG+': opening the menu closes');await p.click('#menuBtn');
 await lp(x,y);await p.waitForTimeout(80);const o2=(await bubble()).on;await p.click('#mapBtn');await p.waitForTimeout(80);ok(o2&&!(await bubble()).on,LANG+': opening the map closes');await p.click('#mapClose')}
/* a locked pad next to the player: the tap continues buying, no bubble */
{const r=await p.evaluate(()=>{const W=window.__smelt,d=W.PAD.u_carry;W.S.money=1e6;W.G.go=null;W.P.x=d.x;W.P.y=d.y;W.P.vx=W.P.vy=0;W.cam.x=d.x;W.cam.y=d.y;for(let i=0;i<120;i++)W.update(1/60);return{lock:!!d.lock,lv:W.S.lv.carry||0}});
 const[x,y]=await p.evaluate(()=>{const W=window.__smelt,d=W.PAD.u_carry,c=document.getElementById('c').getBoundingClientRect(),s=W.ws(d.x,d.y);return[c.left+s[0],c.top+s[1]]});
 await p.mouse.click(x,y);await p.waitForTimeout(60);const B=await bubble();const r2=await p.evaluate(()=>{const W=window.__smelt;for(let i=0;i<90;i++)W.update(1/60);return W.S.lv.carry||0});
 ok(r.lock&&!B.on&&r2>r.lv,LANG+': tapping a locked pad at the player buys on (level '+r.lv+'→'+r2+'), no bubble');await p.evaluate(()=>{window.__smelt.S.money=0})}
/* the bubble and a toast never overlap */
{const[x,y]=await aim(800,300,800,140);await lp(x,y);await p.waitForTimeout(80);await p.evaluate(()=>{const W=window.__smelt;W.G.mode='play'});
 await p.evaluate(()=>{window.__smelt.update(0.01)});const o=await p.evaluate(()=>{const W=window.__smelt;const e=document.getElementById('toast');e.textContent='Test toast';e.classList.add('on');const a=document.getElementById('info').getBoundingClientRect(),t=e.getBoundingClientRect();return{a:a.toJSON(),t:t.toJSON(),on:document.getElementById('info').classList.contains('on')}});
 const ov=o.on&&o.a.left<o.t.right&&o.t.left<o.a.right&&o.a.top<o.t.bottom&&o.t.top<o.a.bottom;ok(o.on&&!ov,LANG+': bubble and toast do not overlap');await p.evaluate(()=>document.getElementById('toast').classList.remove('on'))}
/* language switch from the menu keeps the game state and re-renders text */
{const before=await p.evaluate(()=>({m:window.__smelt.S.money,b:JSON.stringify(window.__smelt.S.b),x:window.__smelt.P.x}));await p.click('#menuBtn');await p.click(LANG==='en'?'#mLangNo':'#mLangEn');await p.waitForTimeout(300);
 const after=await p.evaluate(()=>({m:window.__smelt.S.money,b:JSON.stringify(window.__smelt.S.b),x:window.__smelt.P.x,lang:window.__smelt.LANG,ls:localStorage.getItem('molten.lang'),map:document.querySelector('#mapBtn span').textContent,stat:document.getElementById('st').textContent,menu:document.querySelector('#menu h2').textContent}));
 ok(after.lang!==LANG&&after.ls===after.lang&&after.b===before.b&&Math.abs(after.m-before.m)<1e3,LANG+': menu switches language at once, state kept ('+after.lang+', map button "'+after.map+'", "'+after.stat.slice(0,30)+'")');
 ok((after.lang==='no')===(after.map==='KART'),LANG+': DOM text follows the language');await p.click('#menuBtn')}
ok(errs.length===0,LANG+': no page errors '+JSON.stringify(errs.slice(0,3)));await ctx.close()}
await b.close();console.log(bad?'FAIL '+bad:'PASS');process.exitCode=bad?1:0})();
