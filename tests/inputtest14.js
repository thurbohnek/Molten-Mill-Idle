// Input (Playwright, touch emulation): tap vs drag threshold, joystick walking, pinch and wheel zoom (persisted),
// keyboard walking, K toggles the crane, tapping an object while driving the crane, bubble close, menu/map buttons.
const {chromium}=require('playwright');const fs=require('fs');
const PG=require('path').join(require('os').tmpdir(),'input14_page.html');
fs.writeFileSync(PG,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">'+fs.readFileSync(process.argv[2]||require('path').join(__dirname,'../game.html'),'utf8')+'</body></html>');
let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:800},hasTouch:true,isMobile:true});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.goto('file://'+PG);await p.waitForTimeout(600);
await p.evaluate(()=>{const W=window.__smelt;W.endIntro();W.S.moved=true;W.S.heats=9;W.setLv('kran',2);W.S.money=0;W.P.x=330;W.P.y=700;W.cam.x=330;W.cam.y=700;for(let i=0;i<10;i++)W.update(1/60)});
const c=await ctx.newCDPSession(p);const box=await p.locator('canvas').boundingBox();
const tp=(t,pts)=>c.send('Input.dispatchTouchEvent',{type:t,touchPoints:pts.map((q,i)=>({x:q[0],y:q[1],id:i}))});
const S=async()=>p.evaluate(()=>{const W=window.__smelt;return{x:Math.round(W.P.x),y:Math.round(W.P.y),info:W.INFO.on,key:W.INFO.key,uz:+localStorage.getItem('molten.uz'),zoom:W.zoom,crane:W.G.crane,J:W.J.on}});
/* 1: a long press on the scrap pile (world 150,500) opens its bubble and does not move the player */
const ws=async(x,y)=>p.evaluate(([x,y])=>{const r=window.__smelt.ws(x,y);return[r[0],r[1]]},[x,y]);
{const [sx,sy]=await ws(150,500);const a=await S();await tp('touchStart',[[box.x+sx,box.y+sy]]);await p.waitForTimeout(650);await tp('touchEnd',[]);await p.waitForTimeout(150);const s=await S();
 ok(s.info&&/y0/.test(s.key),'long press opens the scrap-pile bubble: '+s.key);ok(Math.abs(s.x-a.x)<3&&Math.abs(s.y-a.y)<3,'a long press does not move the player')}
/* 2: the next tap only closes the bubble; a tap after that walks */
{const cx=box.x+195,cy=box.y+470;const a=await S();await tp('touchStart',[[cx,cy]]);await p.waitForTimeout(60);await tp('touchEnd',[]);await p.waitForTimeout(400);const s=await S();
 ok(!s.info,'the tap closes the bubble');ok(Math.abs(s.x-a.x)<3&&Math.abs(s.y-a.y)<3,'the closing tap does not walk');
 await tp('touchStart',[[cx,cy]]);await p.waitForTimeout(60);await tp('touchEnd',[]);await p.waitForTimeout(1200);const s2=await S();ok(Math.hypot(s2.x-a.x,s2.y-a.y)>30,`a tap walks the player (${a.x},${a.y} → ${s2.x},${s2.y})`);ok(!s2.J,'pointer released on touch end')}
/* 3: a swipe moves the camera, not the player, and opens no bubble */
{const a=await S();const c0=await p.evaluate(()=>[window.__smelt.cam.x,window.__smelt.cam.y]);const [sx,sy]=[box.x+195,box.y+400];await tp('touchStart',[[sx,sy]]);for(let i=1;i<=6;i++){await tp('touchMove',[[sx+i*12,sy]]);await p.waitForTimeout(20)}await tp('touchEnd',[]);await p.waitForTimeout(100);const s=await S();const c1=await p.evaluate(()=>[window.__smelt.cam.x,window.__smelt.cam.y]);
 ok(!s.info,'a swipe opens no bubble');ok(Math.abs(s.x-a.x)<3,'a swipe does not move the player');ok(Math.abs(c1[0]-c0[0])>30,`a swipe moves the camera (${c0[0].toFixed(0)} → ${c1[0].toFixed(0)})`)}
/* 4: pinch changes the zoom and it is remembered */
{const z0=(await S()).zoom;const cx=box.x+195,cy=box.y+400;await tp('touchStart',[[cx-20,cy],[cx+20,cy]]);for(let i=1;i<=10;i++)await tp('touchMove',[[cx-20-i*6,cy],[cx+20+i*6,cy]]);await tp('touchEnd',[]);await p.waitForTimeout(100);const s=await S();
 ok(s.zoom>z0*1.3,`pinch zooms in (${z0.toFixed(2)} → ${s.zoom.toFixed(2)})`);ok(s.uz>1.3,'zoom persisted to localStorage: '+s.uz);ok(!s.J,'pinch does not leave the joystick on')}
/* 5: wheel zooms out; +/- keys */
{const z0=(await S()).zoom;await p.mouse.move(box.x+195,box.y+400);await p.mouse.wheel(0,600);await p.waitForTimeout(100);const s=await S();ok(s.zoom<z0,`wheel down zooms out (${z0.toFixed(2)} → ${s.zoom.toFixed(2)})`);
 await p.keyboard.press('Equal');await p.waitForTimeout(50);const s2=await S();ok(s2.zoom>s.zoom,'+ key zooms in');await p.keyboard.press('Minus');await p.waitForTimeout(50);ok((await S()).zoom<s2.zoom,'- key zooms out')}
/* 6: arrow keys walk */
{const a=await S();await p.keyboard.down('ArrowLeft');await p.waitForTimeout(400);await p.keyboard.up('ArrowLeft');await p.waitForTimeout(50);const s=await S();ok(s.x<a.x-20,`arrow key walks left (${a.x} → ${s.x})`)}
/* 7: K toggles the crane inside its zone; a tap sends the hook there (not the player); K again releases */
{await p.evaluate(()=>{const W=window.__smelt;W.P.x=300;W.P.y=700;W.G.go=null;for(let i=0;i<10;i++)W.update(1/60)});await p.keyboard.press('KeyK');await p.waitForTimeout(50);let s=await S();ok(s.crane==='skrap','K takes over the scrap crane: '+s.crane);
 const y0=await p.evaluate(()=>window.__smelt.CRm.skrap.y);const [sx,sy]=await ws(300,y0+160);await tp('touchStart',[[box.x+sx,box.y+sy]]);await p.waitForTimeout(60);await tp('touchEnd',[]);await p.waitForTimeout(1500);
 const cr=await p.evaluate(()=>[window.__smelt.CRm.skrap.y,window.__smelt.P.y]);
 ok(cr[0]>y0+60&&Math.abs(cr[1]-700)<3,`a tap steers the crane, not the player (crane y ${y0.toFixed(0)} → ${cr[0].toFixed(0)}, player y ${cr[1].toFixed(0)})`);
 await p.keyboard.press('KeyK');await p.waitForTimeout(50);ok(!(await S()).crane,'K releases the crane');ok(await p.evaluate(()=>!document.getElementById('craneBtn').hidden),'the crane button is visible in the zone')}
/* 8: HUD buttons */
{await p.click('#mapBtn');ok(await p.evaluate(()=>window.__smelt.G.mapOn),'map button opens the map');await p.click('#mapClose');ok(await p.evaluate(()=>!window.__smelt.G.mapOn),'close button closes it');
 await p.click('#menuBtn');ok(await p.evaluate(()=>document.getElementById('menu').classList.contains('on')),'menu button opens the menu');await p.keyboard.press('Escape');ok(await p.evaluate(()=>!document.getElementById('menu').classList.contains('on')),'Escape closes it')}
ok(errs.length===0,'no page errors '+JSON.stringify(errs.filter(e=>!/TUNNEL/.test(e))));
console.log(bad?'FAIL':'PASS');await b.close();process.exit(bad?1:0)})();
