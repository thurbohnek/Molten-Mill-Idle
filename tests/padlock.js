// One purchase per visit, per pad: stand on a pad → exactly one buy, then TRYKK; tap → one more; step off and on → one more.
// Done on two different pads of the same upgrade row (Større bæring and Raskere gange), plus E key unlock on the second.
const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:390,height:800},deviceScaleFactor:2,hasTouch:true});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.setContent('<!doctype html><html><body style="margin:0">'+fs.readFileSync(process.argv[2]||require('path').join(__dirname,'../index.html'),'utf8')+'</body></html>');await p.waitForTimeout(600);
await p.evaluate(()=>{const W=window.__smelt;W.endIntro();W.S.moved=true;W.S.heats=5;W.S.money=1e6;W.layoutPads()});
const lvOf=id=>p.evaluate(id=>window.__smelt.S.lv[id]||0,id);
const stand=(id)=>p.evaluate(id=>{const W=window.__smelt,d=W.PAD[id];W.P.x=d.x;W.P.y=d.y;W.P.vx=W.P.vy=0;W.cam.x=d.x;W.cam.y=d.y},id);
const tap=async id=>{const pos=await p.evaluate(id=>{const W=window.__smelt,d=W.PAD[id],cv=document.querySelector('canvas').getBoundingClientRect();return[cv.left+cv.width/2+(d.x-W.cam.x)*W.zoom,cv.top+cv.height/2+(d.y-W.cam.y)*W.zoom]},id);await p.mouse.click(pos[0],pos[1])};
const off=id=>p.evaluate(id=>{const W=window.__smelt,d=W.PAD[id];W.P.x=d.x;W.P.y=d.y+150;W.update(1/30);W.P.x=d.x;W.P.y=d.y;W.P.vx=W.P.vy=0},id);
let fails=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)fails++};
for(const [id,u] of [['u_carry','carry'],['u_speed','speed']]){
 const l0=await lvOf(u);await stand(id);await p.waitForTimeout(4000);const l1=await lvOf(u);
 const locked=await p.evaluate(id=>!!window.__smelt.PAD[id].lock,id);
 if(id==='u_carry')await p.screenshot({path:require('os').tmpdir()+'/padlock.png'});
 ok(l1-l0===1&&locked,id+': one buy on arrival, then locked (TRYKK) ('+l0+'→'+l1+')');
 if(id==='u_carry'){await tap(id)}else{await p.keyboard.press('KeyE')}await p.waitForTimeout(3000);const l2=await lvOf(u);ok(l2-l1===1,id+': '+(id==='u_carry'?'tap':'E key')+' unlocks exactly one more ('+l1+'→'+l2+')');
 await off(id);await p.waitForTimeout(3000);const l3=await lvOf(u);ok(l3-l2===1,id+': step off and on → one more ('+l2+'→'+l3+')')}
/* the lock is per pad: the neighbour pad is not locked by a buy on the first */
{const st=await p.evaluate(()=>{const W=window.__smelt;return{a:!!W.PAD.u_carry.lock,b:!!W.PAD.u_yard.lock}});ok(!st.b,'neighbour pad u_yard not locked by buys on other pads')}
console.log('errors',JSON.stringify(errs));ok(errs.length===0,'no page errors');console.log(fails?'FAIL':'PASS');await b.close();process.exitCode=fails?1:0})();
