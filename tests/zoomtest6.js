const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:800},deviceScaleFactor:2,hasTouch:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">'+fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8')+'</body></html>');
await p.waitForTimeout(800);
await p.evaluate(()=>{const W=window.__smelt;W.endIntro();W.S.moved=true;W.S.money=1e7;for(const id of['sm','lf','ld','strang'])try{W.build(id)}catch(e){};W.openMap(true)});
await p.waitForTimeout(400);
const st=()=>p.evaluate(()=>{const s=document.getElementById('mapScroll'),v=document.getElementById('mapSvg');return{h:v.getBoundingClientRect().height|0,w:v.getBoundingClientRect().width|0,sl:s.scrollLeft|0,st:s.scrollTop|0}});
console.log('open',await st());await p.screenshot({path:require('os').tmpdir()+'/zoom0.png'});
await p.click('#mzIn');await p.click('#mzIn');console.log('btn x2.25',await st());await p.screenshot({path:require('os').tmpdir()+'/zoom1.png'});
await p.click('#mzFit');console.log('fit',await st());
// pinch via CDP
const c=await ctx.newCDPSession(p);const box=await p.locator('#mapScroll').boundingBox();const cx=box.x+box.width/2,cy=box.y+box.height/2;
const tp=(t,pts)=>c.send('Input.dispatchTouchEvent',{type:t,touchPoints:pts.map((q,i)=>({x:q[0],y:q[1],id:i}))});
await tp('touchStart',[[cx-30,cy],[cx+30,cy]]);for(let i=1;i<=10;i++){await tp('touchMove',[[cx-30-i*8,cy],[cx+30+i*8,cy]]);}await tp('touchEnd',[]);
console.log('pinch',await st());
// node click still works
await p.click('#mzFit');const n=await p.locator('#mapSvg .node').nth(1);await n.click();console.log('sel',await p.evaluate(()=>document.querySelector('#mapPanel h3')?.textContent));
await p.setViewportSize({width:800,height:390});await p.waitForTimeout(300);await p.click('#mzIn');console.log('land',await st());await p.screenshot({path:require('os').tmpdir()+'/zoom_land.png'});
console.log('errs',errs);await b.close()})();
