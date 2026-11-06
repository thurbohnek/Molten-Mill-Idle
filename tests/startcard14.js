// Start card: shown once after the intro on a new game (EN + NO, portrait + landscape), not on reload of a save,
// dismissed by Start / tap outside / Escape, reopened from the menu; the era year shows in the furnace bubble and stats.
const {chromium}=require('playwright');const fs=require('fs');
const PG=require('path').join(require('os').tmpdir(),'start14_page.html');
fs.writeFileSync(PG,'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">'+fs.readFileSync(process.argv[2]||require('path').join(__dirname,'../game.html'),'utf8')+'</body></html>');
let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
(async()=>{const b=await chromium.launch();
for(const [lang,w,h] of [['en',390,800],['no',390,800],['en',800,390],['no',800,390]]){
 const ctx=await b.newContext({viewport:{width:w,height:h},deviceScaleFactor:1});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
 await p.addInitScript(l=>{try{localStorage.setItem('molten.lang',l)}catch(e){}},lang);
 await p.goto('file://'+PG);await p.waitForTimeout(500);
 await p.evaluate(()=>window.__smelt.endIntro0());await p.waitForTimeout(300);
 const on=await p.evaluate(()=>document.getElementById('modal').classList.contains('on')&&document.getElementById('modal').classList.contains('start'));
 ok(on,`${lang} ${w}x${h}: start card shown on a new game`);
 const txt=await p.evaluate(()=>document.getElementById('mdP').textContent);ok(/^1880\./.test(txt),`${lang}: card starts with the year: "${txt.slice(0,40)}…"`);
 const box=await p.locator('#modal .box').boundingBox();ok(box&&box.x>=0&&box.y>=0&&box.x+box.width<=w&&box.y+box.height<=h,`${lang} ${w}x${h}: card fits the screen (${box&&Math.round(box.width)}x${box&&Math.round(box.height)})`);
 await p.screenshot({path:require('os').tmpdir()+`/startcard_${lang}_${w}x${h}.png`});
 ok(await p.evaluate(()=>document.getElementById('mdNo').hidden&&document.getElementById('mdYes').textContent==='Start'),`${lang}: only a Start button`);
 await p.click('#mdYes');ok(!(await p.evaluate(()=>document.getElementById('modal').classList.contains('on'))),`${lang}: Start closes the card`);
 ok(await p.evaluate(()=>window.__smelt.S.introSeen===1),`${lang}: marked as seen`);
 /* reload with the save: no card */
 const raw=await p.evaluate(()=>{window.__smelt.save();return localStorage.getItem('smelteverket.v6')});
 await p.addInitScript(r=>{try{localStorage.setItem('smelteverket.v6',r)}catch(e){}},raw);await p.goto('file://'+PG);await p.waitForTimeout(500);await p.evaluate(()=>window.__smelt.endIntro0());await p.waitForTimeout(200);
 ok(await p.evaluate(()=>window.__smelt.S.introSeen===1),`${lang}: save restored`);
 ok(!(await p.evaluate(()=>document.getElementById('modal').classList.contains('on'))),`${lang}: no card on reload of an existing save`);
 /* menu reopens it; a press outside closes it; Escape closes it */
 await p.click('#menuBtn');await p.click('#mHow');ok(await p.evaluate(()=>document.getElementById('modal').classList.contains('on')&&!document.getElementById('menu').classList.contains('on')),`${lang}: menu "How to play" reopens it (menu closed)`);
 await p.mouse.click(30,h-30);ok(!(await p.evaluate(()=>document.getElementById('modal').classList.contains('on'))),`${lang}: a press outside closes it`);
 await p.click('#menuBtn');await p.click('#mHow');await p.keyboard.press('Escape');ok(!(await p.evaluate(()=>document.getElementById('modal').classList.contains('on'))),`${lang}: Escape closes it`);
 /* a press that opens the card does not start walking */
 ok(await p.evaluate(()=>!window.__smelt.J.on),`${lang}: joystick off`);
 /* the prestige question still has both buttons */
 await p.evaluate(()=>{window.__smelt.openPresModal()});ok(await p.evaluate(()=>!document.getElementById('mdNo').hidden||document.getElementById('mdYes').textContent==='OK'),`${lang}: other modals keep their buttons`);await p.keyboard.press('Escape');
 /* years */
 const y=await p.evaluate(()=>{const W=window.__smelt;const o=[W.infoFor({type:'furnace'}).t];W.build('ld');o.push(W.infoFor({type:'furnace'}).t);W.build('consteel');o.push(W.infoFor({type:'furnace'}).t);W.syncMenu();o.push(document.getElementById('stats').textContent);return o});
 ok(/1880$/.test(y[0])&&/1960$/.test(y[1])&&/1995$/.test(y[2])&&/1995/.test(y[3]),`${lang}: era years ${y[0]} | ${y[1]} | ${y[2]} | stats has year`);
 ok(errs.length===0,`${lang}: no page errors ${JSON.stringify(errs.filter(e=>!/TUNNEL/.test(e)))}`);await ctx.close()}
console.log(bad?'FAIL':'PASS');await b.close();process.exit(bad?1:0)})();
