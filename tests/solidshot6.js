const {chromium}=require('playwright');const fs=require('fs');
const upto=id=>`for(const b of W.BUILDS){if(W.B_(b.id))continue;W.build(b.id);if(b.id==='${id}')break}`;
const STATES={
 start:"",
 bessemer:"W.setLv('koks',3);W.setLv('cowper',6);W.setLv('malmkran',2)",
 sm:upto('sm')+";W.setLv('kalk',3);W.setLv('koks',8);W.setLv('cowper',12)",
 ld:upto('ld')+";W.setLv('kalk',5);W.setLv('o2',4);W.setLv('cowper',20);W.setLv('koks',14)",
 elrj:upto('elrj')+";W.setLv('kalk',5);W.setLv('o2',4);W.setLv('strands',3)",
 eaf:upto('eaf1')+";W.setLv('strands',4)",
 uhp:upto('uhp')+";W.setLv('kull',3);W.setLv('strands',6);W.setLv('ladle',2)",
 all:"for(const b of W.BUILDS)W.build(b.id);for(const u of W.UP)W.S.lv[u.id]=u.max;W.setLv('strands',8);W.bakeFloor()",
 /* Phase 4 */era6:"W.toEra(6);for(const u of W.UP)if(W.upOpen(u))W.S.lv[u.id]=Math.min(u.max,8);W.bakeFloor()",
 era7:"W.toEra(7);for(const u of W.UP)if(W.upOpen(u))W.S.lv[u.id]=Math.min(u.max,8);W.bakeFloor()"};
(async()=>{const b=await chromium.launch();
for(const [name,code] of Object.entries(STATES)){
 const p=await b.newPage({viewport:{width:1450,height:1140},deviceScaleFactor:1});const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.setContent('<!doctype html><html><body style="margin:0">'+fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8')+'</body></html>');await p.waitForTimeout(500);
 await p.evaluate(code=>{const W=window.__smelt;W.endIntro();W.S.moved=true;W.S.heats=99;W.S.money=1e12;(new Function('W',code))(W);W.rebuildSolids();W.bakeFloor();
  for(let i=0;i<60*20;i++){W.update(1/60);if(W.F.state==='ready')W.startTap()}
  const cv=document.querySelector('canvas');let e=cv;while(e){e.style&&(e.style.visibility='visible');e=e.parentElement}
  for(const el of document.querySelectorAll('body *'))if(el!==cv&&!el.contains(cv))el.style.visibility='hidden';
  const o=document.createElement('canvas');o.id='ov';o.style.cssText='position:fixed;left:0;top:0;pointer-events:none;z-index:99;visibility:visible';o.width=innerWidth;o.height=innerHeight;document.body.appendChild(o)},code);
 const TL=name.startsWith('era')?[[-1190,330],[-1190,860],[-380,560],[600,560]]:[[-380,560],[600,560],[1500,560],[2300,560],[3100,560],[3800,560]];
 for(let t=0;t<TL.length;t++){
  await p.evaluate(([x,y])=>{const W=window.__smelt;W.setZoom(.9);W.P.x=x;W.P.y=y;W.cam.x=x;W.cam.y=y},TL[t]);await p.waitForTimeout(400);
  await p.evaluate(()=>{const W=window.__smelt;const z=W.zoom,cam=W.cam;
   const o=document.getElementById('ov'),c=o.getContext('2d');c.clearRect(0,0,o.width,o.height);const r=document.querySelector('canvas').getBoundingClientRect();
   const sx=x=>r.left+r.width/2+(x-cam.x)*z,sy=y=>r.top+r.height/2+(y-cam.y)*z;c.strokeStyle='red';c.lineWidth=2;c.setLineDash([6,4]);
   for(const s of W.SOLIDS()){c.beginPath();if(s.r)c.arc(sx(s.x),sy(s.y),s.r*z,0,7);else c.rect(sx(s.x),sy(s.y),s.w*z,s.h*z);c.stroke()}});
  await p.screenshot({path:require('os').tmpdir()+`/sol_${name}_${t}.png`})}
 console.log(name,errs);await p.close()}
await b.close()})();
