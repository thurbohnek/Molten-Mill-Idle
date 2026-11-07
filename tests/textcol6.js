// Runtime text-collision scan: hooks fillText, plays through states, sweeps camera, reports overlapping texts.
const {chromium}=require('playwright');const fs=require('fs');
const FILE=process.argv[2]||require('path').join(__dirname,'../index.html'),LANG=process.env.GLANG==='no'?'no':'en';console.log('lang',LANG);
(async()=>{const b=await chromium.launch();const found=new Map();
for(const [VW,VH] of [[390,800],[800,390]]){
const p=await b.newPage({viewport:{width:VW,height:VH}});const errs=[];p.on('pageerror',e=>errs.push(e.message));
await p.addInitScript(l=>{try{localStorage.setItem('molten.lang',l)}catch(e){}},LANG);
await p.addInitScript(()=>{window.__TX=[];window.__PN=[];let seq=0;const P=CanvasRenderingContext2D.prototype;
 const pt=(c,x,y)=>{const T=c.getTransform();return[T.a*x+T.c*y+T.e,T.b*x+T.d*y+T.f]};
 const add=(c,x,y)=>{if(!window.__TXon)return;const[q,r]=pt(c,x,y);const B=c.__bb||(c.__bb=[1e9,1e9,-1e9,-1e9]);B[0]=Math.min(B[0],q);B[1]=Math.min(B[1],r);B[2]=Math.max(B[2],q);B[3]=Math.max(B[3],r)};
 const ob=P.beginPath;P.beginPath=function(){this.__bb=null;return ob.apply(this,arguments)};
 for(const k of['moveTo','lineTo']){const o=P[k];P[k]=function(x,y){add(this,x,y);return o.apply(this,arguments)}}
 {const o=P.arcTo;P.arcTo=function(x1,y1,x2,y2){add(this,x1,y1);add(this,x2,y2);return o.apply(this,arguments)}}
 {const o=P.quadraticCurveTo;P.quadraticCurveTo=function(a,b2,x,y){add(this,x,y);return o.apply(this,arguments)}}
 {const o=P.arc;P.arc=function(x,y,r){add(this,x-r,y-r);add(this,x+r,y+r);return o.apply(this,arguments)}}
 {const o=P.rect;P.rect=function(x,y,w,h){add(this,x,y);add(this,x+w,y+h);return o.apply(this,arguments)}}
 if(P.roundRect){const o=P.roundRect;P.roundRect=function(x,y,w,h){add(this,x,y);add(this,x+w,y+h);return o.apply(this,arguments)}}
 const dark=c=>{const f=c.fillStyle;if(typeof f!=='string')return false;let m=f.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);let r,g,b,al=1;if(m){r=+m[1];g=+m[2];b=+m[3];al=m[4]==null?1:+m[4]}else if(/^#[0-9a-f]{6}$/i.test(f)){r=parseInt(f.slice(1,3),16);g=parseInt(f.slice(3,5),16);b=parseInt(f.slice(5,7),16)}else return false;return r<45&&g<45&&b<55&&al*c.globalAlpha>=.8};
 const of=P.fill;P.fill=function(){if(window.__TXon&&this.__bb&&dark(this)&&this.canvas.id!=='ov'){const B=this.__bb,w=B[2]-B[0],h=B[3]-B[1];if(w>24&&h>12&&w<420&&h<160)window.__PN.push({x:B[0],y:B[1],w,h,s:seq++})}return of.apply(this,arguments)};
 const ofr=P.fillRect;P.fillRect=function(x,y,w,h){if(window.__TXon&&dark(this)&&this.canvas.id!=='ov'){const[a1,b1]=pt(this,x,y),[a2,b2]=pt(this,x+w,y+h);const W2=Math.abs(a2-a1),H2=Math.abs(b2-b1);if(W2>24&&H2>12&&W2<420&&H2<160)window.__PN.push({x:Math.min(a1,a2),y:Math.min(b1,b2),w:W2,h:H2,s:seq++})}return ofr.apply(this,arguments)};
 const ft=P.fillText;P.fillText=function(t,x,y){if(window.__TXon&&String(t).trim()&&this.canvas.id!=='ov'){const m=this.measureText(t),T=this.getTransform(),al=this.textAlign;
  if(Math.abs(T.b)<1e-6&&this.globalAlpha>.3){let w=m.width,asc=m.actualBoundingBoxAscent||8,des=m.actualBoundingBoxDescent||2,x0=al==='center'?x-w/2:(al==='right'||al==='end')?x-w:x;window.__TX.push({t:String(t),x:T.a*x0+T.e,y:T.d*(y-asc)+T.f,w:w*T.a,h:(asc+des)*T.d,s:seq++})}}
  return ft.apply(this,arguments)}});
fs.writeFileSync(require('path').join(require('os').tmpdir(),'tc_page.html'),'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head><body style="margin:0">'+fs.readFileSync(FILE,'utf8')+'</body></html>');await p.goto('file://'+require('path').join(require('os').tmpdir(),'tc_page.html'));await p.waitForTimeout(600);
const scan=async(tag)=>{const r=await p.evaluate(tag=>{const W=window.__smelt,out=[];const dpr=devicePixelRatio;
  /* (Phase 5: below 1560 only the plot column exists) */
  const pts=[];for(let x=W.WXL+120;x<=4100;x+=Math.round(innerWidth*.7))for(let y=150;y<=(W.WH>2000?2300:W.WH>1200?1460:1000);y+=Math.round(innerHeight*.6))if(y<1560||x<-700)pts.push([x,y]);
  for(const [x,y] of pts){W.P.x=x;W.P.y=y;W.cam.x=x;W.cam.y=y;for(let k=0;k<3;k++)W.update(1/60);window.__TX=[];window.__PN=[];window.__TXon=1;W.draw();window.__TXon=0;
   const A=window.__TX.filter(o=>o.w>2),PN=window.__PN;const ov=(a,c)=>[Math.min(a.x+a.w,c.x+c.w)-Math.max(a.x,c.x),Math.min(a.y+a.h,c.y+c.h)-Math.max(a.y,c.y)];
   const hud=[...document.querySelectorAll('#hud *, .hud *, header *')].length;
   for(let i=0;i<A.length;i++)for(let j=i+1;j<A.length;j++){const a=A[i],c=A[j];if(a.t===c.t&&Math.abs(a.x-c.x)<2&&Math.abs(a.y-c.y)<2)continue;const[ox,oy]=ov(a,c);
    if(ox>2&&oy>2)out.push(tag+' @'+x+','+y+': TEKST "'+a.t+'" × "'+c.t+'"')}
   for(const t of A)for(const q of PN){const[ox,oy]=ov(t,q);if(ox<3||oy<3)continue;const inside=t.x>=q.x-2&&t.y>=q.y-2&&t.x+t.w<=q.x+q.w+2&&t.y+t.h<=q.y+q.h+2;
    if(q.s>t.s&&!(inside&&false))out.push(tag+' @'+x+','+y+': SKJULT "'+t.t+'" under panel '+Math.round(q.w)+'x'+Math.round(q.h));
    else if(q.s<t.s&&!inside)out.push(tag+' @'+x+','+y+': KANT "'+t.t+'" over panelkant '+Math.round(q.w)+'x'+Math.round(q.h))}}
  out.push("DBG n="+window.__TX.length);return out},tag);for(const s of r){if(s.startsWith('DBG')){console.log(tag,s);continue}const k=s.replace(/^.*?: /,'').replace(/[\d\s,.]+/g,'#').replace(/panel.*$/,'');if(!found.has(k))found.set(k,s)}};
const st=(code,sec)=>p.evaluate(([code,sec])=>{const W=window.__smelt;(new Function('W',code))(W);for(let i=0;i<60*sec;i++){W.update(1/60);if(W.F.state==='ready'&&Math.random()<.02)W.startTap()}},[code,sec]);
await p.evaluate(()=>{const W=window.__smelt;W.endIntro();W.S.moved=true});
await scan('start '+VW);
const upto=id=>`for(const b of W.BUILDS){if(W.B_(b.id))continue;W.build(b.id);if(b.id==='${id}')break}`;
await st("W.S.heats=6;W.S.money=5000;W.setLv('koks',3);W.setLv('cowper',4);W.hire('rj',1);W.hire('blokk',1)",30);await scan('bessemer '+VW);
await st(upto('sm')+";W.setLv('kalk',2);W.hire('skrap',1)",30);await scan('sm '+VW);
await st(upto('ld')+";W.S.heats=20;W.setLv('o2',3);W.setLv('kalk',4);W.hire('ovn',1);W.setLv('torpn',2);W.setLv('malmkran',2)",40);await scan('ld '+VW);
await st(upto('strang')+";W.setLv('strands',3);W.S.cast='auto'",40);await scan('strang '+VW);
await st(upto('elrj'),40);await scan('elrj '+VW);
await st(upto('eaf1'),40);await scan('omlegging '+VW);
await st("for(const b of W.BUILDS){if(b.id==='consteel')break;if(!W.B_(b.id))W.build(b.id)}W.setLv('ladle',3);W.setLv('strands',6)",60);await scan('uhp '+VW);
await st("for(const b of W.BUILDS)if(!W.B_(b.id))W.build(b.id);for(const u of W.UP)W.S.lv[u.id]=Math.min(u.max,(W.S.lv[u.id]||0)+3);W.bakeFloor();W.rebuildSolids()",60);await scan('all '+VW);
await st("W.S.st.slagT=0;W.S.pot=999",5);await scan('slagstop '+VW);
await st("for(const[k,v]of Object.entries({endless:1,loop:2,elspd:4,robot:1,robspd:3,tdheat:1,slagdet:1,ems:1,hss:1,insp:1,sort:2,pass:1,dheat:3,slagmill:3,co2:2,twin:1}))W.setLv(k,v);W.S.st.slagT=999;W.S.pot=0;W.rebuildSolids();W.bakeFloor();W.P3.ordT=0",60);await scan('phase3 '+VW);
/* Phase 4: hydrogen DRI (era 6) and electric smelting with the LD restarted (era 7) */
await st("W.toEra(6);for(const u of W.UP)if(W.upOpen(u))W.S.lv[u.id]=Math.min(u.max,(W.S.lv[u.id]||0)+4);W.hire('dri',2);W.rebuildSolids();W.bakeFloor()",60);await scan('era6 '+VW);
await st("W.toEra(7);for(const u of W.UP)if(W.upOpen(u))W.S.lv[u.id]=Math.min(u.max,(W.S.lv[u.id]||0)+4);W.rebuildSolids();W.bakeFloor()",60);await scan('era7 '+VW);
/* Phase 5: molten oxide electrolysis (era 8, with the plasma plot waiting), hydrogen plasma (era 9), electrowinning (era 10) */
await st("W.toEra(8);W.build('pls');for(const u of W.UP)if(W.upOpen(u))W.S.lv[u.id]=Math.min(u.max,(W.S.lv[u.id]||0)+4);W.hire('moe',2);W.rebuildSolids();W.bakeFloor()",60);await scan('era8 '+VW);
await st("W.toEra(9);for(const u of W.UP)if(W.upOpen(u))W.S.lv[u.id]=Math.min(u.max,(W.S.lv[u.id]||0)+4);W.hire('pls',2);W.rebuildSolids();W.bakeFloor()",60);await scan('era9 '+VW);
await st("W.toEra(10);for(const u of W.UP)if(W.upOpen(u))W.S.lv[u.id]=Math.min(u.max,(W.S.lv[u.id]||0)+4);W.hire('ew',2);W.rebuildSolids();W.bakeFloor()",60);await scan('era10 '+VW);
console.log(VW,'errs',errs.slice(0,3));await p.close()}
for(const v of found.values())console.log(v);console.log('unique',found.size);await b.close()})();
