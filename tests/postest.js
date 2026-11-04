const {chromium}=require('playwright');const fs=require('fs');
(async()=>{const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:800}});const p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
fs.writeFileSync(require('path').join(require('os').tmpdir(),'pos.html'),'<!doctype html><html><body style="margin:0">'+fs.readFileSync(require('path').join(__dirname,'../index.html'),'utf8')+'</body></html>');
const U='file://'+require('path').join(require('os').tmpdir(),'pos.html');
await p.goto(U);await p.waitForTimeout(600);
await p.evaluate(()=>{const W=window.__smelt;W.endIntro();W.S.moved=true;W.P.x=900;W.P.y=880;W.P.stack=[{k:'scrap',kk:2,t:1},{k:'scrap',kk:3,t:1}];W.save()});
await p.reload();await p.waitForTimeout(800);
console.log(await p.evaluate(()=>{const W=window.__smelt;return[Math.round(W.P.x),Math.round(W.P.y),W.P.stack.map(i=>i.k).join(',')]}),errs);await b.close()})();
