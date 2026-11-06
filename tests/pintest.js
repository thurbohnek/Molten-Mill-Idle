const {chromium,devices}=require('playwright'),fs=require('fs'),path=require('path'),os=require('os');
const PG=path.join(os.tmpdir(),'pin_page.html');fs.writeFileSync(PG,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">'+fs.readFileSync(process.argv[2]||path.join(__dirname,'../game.html'),'utf8')+'</body></html>');
let fails=0;const ok=(c,m)=>{console.log((c?'ok   ':'FAIL ')+m);if(!c)fails++};
(async()=>{const b=await chromium.launch();const c=await b.newContext({...devices['Pixel 7'],deviceScaleFactor:2});const p=await c.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+PG);await p.waitForTimeout(4500);if(await p.evaluate(()=>document.getElementById('modal').classList.contains('on')))await p.tap('#mdYes');await p.waitForTimeout(300);
ok(await p.evaluate(()=>!window.__smelt.G.pin),'no pin while the player is on screen');
const shots=[[700,0,'right'],[-500,0,'left'],[600,450,'downright']];
for(const [dx,dy,n] of shots){await p.evaluate(([dx,dy])=>{const W=window.__smelt;W.G.go=null;W.G.free=true;W.cam.x=W.P.x+dx;W.cam.y=W.P.y+dy},[dx,dy]);await p.waitForTimeout(250);
 const pin=await p.evaluate(()=>window.__smelt.G.pin);if(process.env.SHOTS)await p.screenshot({path:require('os').tmpdir()+'/pin_'+n+'.png'});
 const cam=await p.evaluate(()=>[window.__smelt.cam.x,window.__smelt.cam.y]);const offs=await p.evaluate(()=>{const W=window.__smelt,s=W.ws(W.P.x,W.P.y);return s});
 ok(!!pin,`${n}: pin shown (player at screen ${offs.map(Math.round)})`)}
// tap the pin -> camera returns
const pin=await p.evaluate(()=>window.__smelt.G.pin);const box=await p.evaluate(()=>{const r=document.getElementById('c').getBoundingClientRect();return[r.left,r.top]});
const pp=await p.evaluate(()=>[window.__smelt.P.x,window.__smelt.P.y]);
await p.touchscreen.tap(box[0]+pin.x,box[1]+pin.y);await p.waitForTimeout(1200);
const st=await p.evaluate(()=>{const W=window.__smelt;return{free:W.G.free,go:!!W.G.go,P:[W.P.x,W.P.y],pin:!!W.G.pin}});
ok(!st.free&&!st.pin,'tapping the pin brings the camera back');ok(!st.go&&Math.hypot(st.P[0]-pp[0],st.P[1]-pp[1])<3,'tapping the pin does not walk');
ok(!errs.length,'no page errors '+JSON.stringify(errs));await b.close();console.log(fails?'FAIL '+fails:'PASS')})()
