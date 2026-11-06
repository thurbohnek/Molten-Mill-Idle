// tap-to-walk: tap walks along a planned path (dotted line), swipe pans the camera, long press opens the bubble, keys still walk
const {chromium,devices}=require('playwright'),fs=require('fs'),path=require('path'),os=require('os');
const PG=path.join(os.tmpdir(),'tapwalk_page.html');fs.writeFileSync(PG,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">'+fs.readFileSync(process.argv[2]||path.join(__dirname,'../game.html'),'utf8')+'</body></html>');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch();const c=await b.newContext({...devices['Pixel 7']});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+PG);await p.waitForTimeout(4500);
if(await p.evaluate(()=>document.getElementById('modal').classList.contains('on')))await p.tap('#mdYes');await p.waitForTimeout(400);
const W=()=>p.evaluate(()=>{const W=window.__smelt,S=W.S;return{px:W.P?W.P.x:null,py:W.P?W.P.y:null}});
const info=await p.evaluate(()=>{const c=document.getElementById('c').getBoundingClientRect();return{l:c.left,t:c.top,w:c.width,h:c.height,hasP:!!window.__smelt.P}});
console.log(info);
const st=()=>p.evaluate(()=>{const W=window.__smelt;return{P:[Math.round(W.P.x),Math.round(W.P.y)],cam:[Math.round(W.cam.x),Math.round(W.cam.y)],go:!!W.G.go,free:!!W.G.free,info:!!W.INFO.on}});
const s0=await st();console.log('start',s0);
// tap 120px left/below of player on screen -> walk
const sx=info.l+info.w/2,sy=info.t+info.h/2;
await p.touchscreen.tap(sx-110,sy+140);await p.waitForTimeout(150);let s1=await st();ok(s1.go,'tap starts a walk (path set)');
await p.screenshot({path:require('os').tmpdir()+'/tapwalk_path.png'});
await p.waitForTimeout(3000);let s2=await st();ok(!s2.go&&Math.hypot(s2.P[0]-s0.P[0],s2.P[1]-s0.P[1])>60,'player walked and arrived '+JSON.stringify(s2.P));
// swipe pans camera
const cs=await st();await p.mouse.move(sx,sy);await p.mouse.down();for(let i=1;i<=10;i++){await p.mouse.move(sx-i*15,sy-i*8);await p.waitForTimeout(16)}await p.mouse.up();await p.waitForTimeout(300);
let s3=await st();ok(s3.free&&Math.hypot(s3.cam[0]-cs.cam[0],s3.cam[1]-cs.cam[1])>60,'swipe moves the camera '+JSON.stringify(cs.cam)+' -> '+JSON.stringify(s3.cam));
ok(Math.hypot(s3.P[0]-cs.P[0],s3.P[1]-cs.P[1])<5,'swipe does not move the player');
await p.waitForTimeout(800);let s4=await st();ok(Math.hypot(s4.cam[0]-s3.cam[0],s4.cam[1]-s3.cam[1])<3,'camera stays after the swipe');
// tap again -> camera follows again
await p.touchscreen.tap(sx+60,sy+40);await p.waitForTimeout(1500);let s5=await st();ok(s5.free&&Math.hypot(s5.cam[0]-s4.cam[0],s5.cam[1]-s4.cam[1])<3,'tap to walk after a swipe keeps the camera where it is');
await p.evaluate(()=>{window.__smelt.G.free=false});await p.waitForTimeout(800);
// long press on the player -> bubble
await p.waitForTimeout(1500);const pp=await p.evaluate(()=>{const W=window.__smelt,c=document.getElementById('c').getBoundingClientRect(),s=W.ws(W.P.x,W.P.y);return[c.left+s[0],c.top+s[1]]});
// long press on scrap pile: find via hitInfo scan around screen
const tgt=await p.evaluate(()=>{const W=window.__smelt,c=document.getElementById('c').getBoundingClientRect();for(let y=200;y<700;y+=20)for(let x=30;x<380;x+=20){const wx=W.cam.x+(x-c.width/2)/W.zoom,wy=W.cam.y+(y-c.height/2)/W.zoom,h=W.hitInfo(wx,wy);if(h&&h.type!=='zone'&&h.type!=='pad')return[c.left+x,c.top+y,h.type]}return null});
console.log('long-press target',tgt);
if(tgt){const b0=await st();await p.mouse.move(tgt[0],tgt[1]);await p.mouse.down();await p.waitForTimeout(700);await p.mouse.up();await p.waitForTimeout(200);let s6=await st();ok(s6.info,'long press opens the explanation bubble');ok(!s6.go,'long press does not walk');
 await p.screenshot({path:require('os').tmpdir()+'/tapwalk_bubble.png'});
 await p.touchscreen.tap(sx,sy-200);await p.waitForTimeout(200);let s7=await st();ok(!s7.info&&!s7.go,'next tap only closes the bubble')}
// keyboard still walks
const k0=await st();await p.keyboard.down('ArrowRight');await p.waitForTimeout(500);await p.keyboard.up('ArrowRight');let s8=await st();ok(s8.P[0]>k0.P[0]+20,'arrow keys still walk');
// tap on a building: walks to the free spot beside it, never inside a solid
const bad=await p.evaluate(()=>{const W=window.__smelt;let n=0;for(let i=0;i<60;i++){const tx=W.P.x+(Math.random()-.5)*900,ty=W.P.y+(Math.random()-.5)*900;if(W.goTo(tx,ty)){const g=W.G.go;for(const q of g.pts)if(W.blockedPt(q.x,q.y,10))n++}}W.G.go=null;return n});
ok(bad===0,'no path point inside a building ('+bad+')');
ok(errs.length===0,'no page errors '+JSON.stringify(errs));
await b.close();console.log(fails?'FAIL '+fails:'PASS')})()
