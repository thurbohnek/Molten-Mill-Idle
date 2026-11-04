
/* ---------- audio ---------- */
const AU={ac:null,m:null,hum:null,cr:null,roar:null,lastCoin:0,nb:null};
function initAudio(){
 if(AU.ac){if(AU.ac.state==='suspended')AU.ac.resume().catch(()=>{});return}
 try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;const ac=new AC();AU.ac=ac;
  AU.m=ac.createGain();AU.m.gain.value=S.mute?0:.7;AU.m.connect(ac.destination);
  const nb=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;AU.nb=nb;
  const lp=ac.createBiquadFilter();lp.type='lowpass';lp.frequency.value=420;AU.hum=ac.createGain();AU.hum.gain.value=0;
  const o1=ac.createOscillator();o1.type='sawtooth';o1.frequency.value=50;const o2=ac.createOscillator();o2.type='square';o2.frequency.value=100;
  const g2=ac.createGain();g2.gain.value=.35;o1.connect(lp);o2.connect(g2);g2.connect(lp);lp.connect(AU.hum);AU.hum.connect(AU.m);o1.start();o2.start();
  const n1=ac.createBufferSource();n1.buffer=nb;n1.loop=true;const hp=ac.createBiquadFilter();hp.type='highpass';hp.frequency.value=2200;AU.cr=ac.createGain();AU.cr.gain.value=0;n1.connect(hp);hp.connect(AU.cr);AU.cr.connect(AU.m);n1.start();
  const n2=ac.createBufferSource();n2.buffer=nb;n2.loop=true;n2.playbackRate.value=.7;const bp=ac.createBiquadFilter();bp.type='bandpass';bp.frequency.value=380;bp.Q.value=.6;AU.roar=ac.createGain();AU.roar.gain.value=0;n2.connect(bp);bp.connect(AU.roar);AU.roar.connect(AU.m);n2.start();
 }catch(e){AU.ac=null}}
function blip(f0,f1,d,type,v,delay){if(!AU.ac||S.mute)return;try{const ac=AU.ac,t=ac.currentTime+(delay||0),o=ac.createOscillator(),g=ac.createGain();o.type=type;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(max(20,f1),t+d);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+.008);g.gain.exponentialRampToValueAtTime(.0005,t+d);o.connect(g);g.connect(AU.m);o.start(t);o.stop(t+d+.02)}catch(e){}}
function noise(d,f,v,q){if(!AU.ac||S.mute)return;try{const ac=AU.ac,t=ac.currentTime,s=ac.createBufferSource(),b=ac.createBiquadFilter(),g=ac.createGain();s.buffer=AU.nb;b.type='bandpass';b.frequency.value=f;b.Q.value=q||1;g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.0005,t+d);s.connect(b);b.connect(g);g.connect(AU.m);s.start(t,Math.random());s.stop(t+d+.02)}catch(e){}}
function sfx(n,k){k=k||0;switch(n){
 case'pop':blip(380+k*45,760+k*45,.07,'sine',.16);break;
 case'drop':blip(240,130,.08,'square',.05);noise(.06,1200,.08,2);break;
 case'clank':noise(.14,900,.18,3);blip(160,90,.1,'triangle',.08);break;
 case'coin':{const now=performance.now();if(now-AU.lastCoin<60)return;AU.lastCoin=now;blip(1320,1320,.06,'triangle',.11);blip(1980,1980,.14,'triangle',.09,.05);break}
 case'tick':blip(880+k,880+k,.03,'square',.025);break;
 case'buy':[523,659,784,1047].forEach((f,i)=>blip(f,f,.16,'triangle',.13,i*.07));break;
 case'tap':blip(90,38,.9,'sawtooth',.22);noise(.8,300,.35,.7);break;
 case'ready':blip(660,880,.22,'square',.06);blip(660,880,.22,'square',.06,.28);break;
 case'level':[392,523,659,784].forEach((f,i)=>blip(f,f*1.01,.2,'sine',.12,i*.09));break;
 case'mile':[523,659,784,1047,1319].forEach((f,i)=>blip(f,f,.22,'triangle',.13,i*.08));break}}
function setLoops(){if(!AU.ac)return;const t=AU.ac.currentTime;let arc=0,roar=0;
 {const d=hyp(P.x-F.x,P.y-F.y),k=clamp(1.2-d/700,0,1);arc=F.arc*k;if(F.state==='tapping'&&F.tapT>.6&&F.tapT<3.4)roar=.32*k;if(PIT.state==='pour'){const d2=hyp(P.x-POS.pit.x,P.y-POS.pit.y);roar=max(roar,.26*clamp(1.2-d2/600,0,1))}}
 if(S.mute){arc=0;roar=0}
 AU.hum.gain.setTargetAtTime(.05*arc,t,.08);AU.cr.gain.setTargetAtTime(arc>0?(Math.random()<.35?.09*arc:.012*arc):0,t,.02);AU.roar.gain.setTargetAtTime(roar,t,.15)}
const buzz=ms=>{if(!S.vib)return;try{navigator.vibrate&&navigator.vibrate(ms)}catch(e){}};


/* ---------- drawing helpers ---------- */
function rr(x,y,w,h,r,c){c=c||ctx;r=min(r,w/2,h/2);c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
function circ(x,y,r,c){c=c||ctx;c.beginPath();c.arc(x,y,r,0,TAU)}
function ell(x,y,a,b,c){c=c||ctx;c.beginPath();c.ellipse(x,y,a,b,0,0,TAU)}
function shadow(x,y,a,b,al){ctx.fillStyle=`rgba(0,0,0,${al||.3})`;ell(x,y,a,b);ctx.fill()}
function block(x,y,w,h,d,top,side,r){r=r==null?6:r;ctx.fillStyle='rgba(0,0,0,.3)';rr(x+5,y+7,w,h,r);ctx.fill();ctx.fillStyle=side;rr(x,y,w,h,r);ctx.fill();ctx.fillStyle=top;rr(x,y-d,w,h,r);ctx.fill()}
function txt(t,x,y,s,c,w,al,stroke){ctx.font=`${w||800} ${s}px ${FONT}`;ctx.textAlign=al||'center';ctx.textBaseline='middle';if(stroke){ctx.lineWidth=stroke;ctx.strokeStyle='rgba(10,12,16,.85)';ctx.lineJoin='round';ctx.strokeText(t,x,y)}ctx.fillStyle=c;ctx.fillText(t,x,y)}
function hazPat(c){const h=document.createElement('canvas');h.width=h.height=16;const g=h.getContext('2d');g.fillStyle=C.hazard;g.fillRect(0,0,16,16);g.fillStyle=C.ink;g.beginPath();g.moveTo(0,0);g.lineTo(8,0);g.lineTo(0,8);g.fill();g.beginPath();g.moveTo(16,0);g.lineTo(16,8);g.lineTo(8,16);g.lineTo(0,16);g.fill();return c.createPattern(h,'repeat')}
const HZ=hazPat(ctx);
const SHAPES=[];for(let k=0;k<8;k++){const r=seeded(k*977+13),n=6+(k%3),pts=[];for(let i=0;i<n;i++){const a=i/n*TAU+r()*.5,d=.6+r()*.5;pts.push([Math.cos(a)*d*1.25,Math.sin(a)*d*.75])}SHAPES.push(pts)}
function poly(p,dy){ctx.beginPath();p.forEach((q,i)=>i?ctx.lineTo(q[0],q[1]+dy):ctx.moveTo(q[0],q[1]+dy));ctx.closePath()}
function drawScrap(x,y,s,k,rot){ctx.save();ctx.translate(x,y);ctx.rotate(rot||0);ctx.scale(s,s);const p=SHAPES[k&7];
 poly(p,.35);ctx.fillStyle=C.rust;ctx.fill();poly(p,0);ctx.fillStyle=k%3?C.scrap:C.steeld;ctx.fill();ctx.lineWidth=.1;ctx.strokeStyle=k%2?C.steell:'#8a7c70';ctx.stroke();ctx.restore()}
function drawSlag(x,y,s,k){ctx.save();ctx.translate(x,y);ctx.scale(s,s);const p=SHAPES[(k||0)&7];poly(p,.3);ctx.fillStyle='#1f1d1b';ctx.fill();poly(p,0);ctx.fillStyle=C.slag;ctx.fill();ctx.fillStyle='rgba(255,255,255,.12)';circ(-.3,-.2,.25);ctx.fill();ctx.fillStyle='#2b2826';circ(.3,.15,.18);ctx.fill();ctx.restore()}
/* long square bar: billet (light) / bloom (heavier, darker) */
function drawBillet(x,y,hot,w,k){w=w||24;const bl=k==='bloom',hh=bl?7:5;ctx.fillStyle=hot>0?mix('#4a4f57',C.moltend,hot):bl?'#3a3631':'#3e434b';ctx.fillRect(x-w/2,y-1,w,hh+1);ctx.fillStyle=hot>0?mix(C.steel,C.molten,hot):bl?'#7d7468':C.steel;ctx.fillRect(x-w/2,y-hh,w,hh);ctx.fillStyle=hot>0?mix(C.steell,C.moltenhi,hot):bl?'#a3998b':C.steell;ctx.fillRect(x-w/2,y-hh,w,1.5)}
/* ingot lying down: tapered block, hot-top (head) on the wide end */
function drawIngot(x,y,s,hot){ctx.save();ctx.translate(x,y);ctx.scale(s,s);
 ctx.fillStyle='rgba(0,0,0,.3)';ctx.beginPath();ctx.moveTo(-11,-3);ctx.lineTo(11,-5);ctx.lineTo(11,8);ctx.lineTo(-11,6);ctx.fill();
 ctx.fillStyle=hot>0?mix('#3b3530',C.moltend,hot):'#3b3530';ctx.beginPath();ctx.moveTo(-12,-2);ctx.lineTo(10,-4);ctx.lineTo(10,5);ctx.lineTo(-12,4);ctx.fill();
 ctx.fillStyle=hot>0?mix('#6c6a66',C.molten,hot):'#6c6a66';ctx.beginPath();ctx.moveTo(-12,-6);ctx.lineTo(10,-9);ctx.lineTo(10,1);ctx.lineTo(-12,0);ctx.fill();
 ctx.fillStyle=hot>0?mix('#8f8b84',C.moltenhi,hot):'#8f8b84';ctx.fillRect(-12,-6,22,1.4);
 ctx.fillStyle=hot>0?mix('#4b4440',C.molten,hot):'#4b4440';ctx.fillRect(7,-9,3,10);ctx.restore()}
function drawRebar(x,y,w,tc){const c1=tc?'#3a4350':C.rebar,c2=tc?'#262c35':'#5a4535';for(let i=0;i<4;i++){const yy=y-4+i*2.4;ctx.fillStyle=i%2?c2:c1;ctx.fillRect(x-w/2,yy,w,2);ctx.fillStyle=tc?'rgba(180,210,255,.22)':'rgba(255,220,180,.25)';for(let j=-w/2+2;j<w/2;j+=4)ctx.fillRect(x+j,yy,1,2)}
 ctx.fillStyle=tc?C.prem:C.hazard;ctx.fillRect(x-w/4-1,y-5,3,11);ctx.fillRect(x+w/4-1,y-5,3,11);ctx.fillStyle=tc?'#cfe6ff':'#fff1b0';ctx.fillRect(x-2,y-7,5,4)}
function drawCoil(x,y,w){ctx.fillStyle='#3b2d22';ell(x,y+1,w*.42,w*.24);ctx.fill();ctx.strokeStyle=C.wire;ctx.lineWidth=3;ell(x,y-2,w*.36,w*.2);ctx.stroke();ctx.strokeStyle='#d0a070';ctx.lineWidth=1;ell(x,y-3,w*.3,w*.15);ctx.stroke()}
function drawMesh(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-11,-6,24,15);ctx.strokeStyle='#8a6a52';ctx.lineWidth=1.4;ctx.beginPath();for(let i=0;i<=4;i++){ctx.moveTo(-12+i*6,-8);ctx.lineTo(-12+i*6,7);}for(let j=0;j<=3;j++){ctx.moveTo(-12,-8+j*5);ctx.lineTo(12,-8+j*5)}ctx.stroke();ctx.fillStyle=C.hazard;ctx.fillRect(9,-9,4,4);ctx.restore()}
function drawBent(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.lineCap='round';ctx.lineJoin='round';for(let i=0;i<3;i++){ctx.strokeStyle=i%2?'#5a4535':C.rebar;ctx.lineWidth=2.2;ctx.beginPath();ctx.moveTo(-10,-6+i*3);ctx.lineTo(-10,4+i*1.5);ctx.lineTo(8,4+i*1.5);ctx.lineTo(8,-4+i*3);ctx.stroke()}ctx.fillStyle=C.good;ctx.fillRect(-2,2,5,5);ctx.restore()}
function drawSack(x,y,s,k,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.25)';rr(-9,-4,19,11,4);ctx.fill();ctx.fillStyle=col||(k?C.kull:C.kalk);rr(-10,-6,20,11,4);ctx.fill();ctx.fillStyle=col?'rgba(0,0,0,.2)':k?'#4a4a50':'#c9c2b0';ctx.fillRect(-10,-2,20,2);ctx.fillStyle=col?'#f4e2bf':k?'#1b1b1e':'#fffdf5';ctx.fillRect(-6,-5,5,2);ctx.restore()}
function drawLeg(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.25)';rr(-8,-5,17,12,3);ctx.fill();ctx.fillStyle=C.leg;rr(-9,-7,18,12,3);ctx.fill();ctx.fillStyle='#b6c6da';ctx.fillRect(-9,-7,18,3);ctx.fillStyle='#3d4a5c';ctx.fillRect(-2,-9,4,4);ctx.fillStyle=C.hazard;ctx.fillRect(-9,0,18,1.5);ctx.restore()}
function drawBottle(x,y,s,col){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.25)';rr(-9,-2,20,9,4);ctx.fill();ctx.fillStyle=col;rr(-10,-5,18,9,4.5);ctx.fill();ctx.fillStyle='rgba(255,255,255,.3)';ctx.fillRect(-8,-4,13,1.6);ctx.fillStyle='#2a2d33';ctx.fillRect(8,-3,4,5);ctx.restore()}
function drawRod(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.25)';rr(-11,-1,24,8,4);ctx.fill();ctx.fillStyle=C.elek;rr(-12,-5,24,9,4.5);ctx.fill();ctx.fillStyle='#5a5f68';ctx.fillRect(-11,-4,22,1.5);ctx.fillStyle='#1b1c20';circ(11,-.5,3.5);ctx.fill();ctx.restore()}
function drawBrick(x,y,s,hole){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.25)';ctx.fillRect(-8,-3,18,10);ctx.fillStyle='#6b3527';ctx.fillRect(-9,-2,18,8);ctx.fillStyle=C.ildf;ctx.fillRect(-9,-6,18,7);ctx.fillStyle='#c97a5f';ctx.fillRect(-9,-6,18,1.4);if(hole){ctx.fillStyle='#2a1712';circ(0,-2.5,2.5);ctx.fill();ctx.fillStyle='#c97a5f';ctx.fillRect(-1,-6,2,1)}ctx.restore()}
function drawRoll(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.25)';rr(-11,-2,24,10,3);ctx.fill();ctx.fillStyle='#5b636e';rr(-12,-6,24,10,3);ctx.fill();ctx.fillStyle=C.valse;ctx.fillRect(-8,-6,16,10);ctx.strokeStyle='#d7dde4';ctx.lineWidth=1;for(let i=-6;i<8;i+=3){ctx.beginPath();ctx.moveTo(i,-6);ctx.lineTo(i,4);ctx.stroke()}ctx.restore()}
function drawSpool(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.25)';ell(1,3,9,5);ctx.fill();ctx.strokeStyle=C.bind;ctx.lineWidth=2.4;ell(0,0,8,4.5);ctx.stroke();ctx.lineWidth=1;ell(0,-.5,5,2.6);ctx.stroke();ctx.restore()}
function drawTank(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.25)';rr(-8,-4,18,13,3);ctx.fill();ctx.fillStyle='#d9dee5';rr(-9,-7,18,13,3);ctx.fill();ctx.fillStyle=C.vann;ctx.fillRect(-7,-2,14,7);ctx.strokeStyle='#8d959f';ctx.lineWidth=1;ctx.strokeRect(-9,-7,18,13);ctx.fillStyle='#8d959f';ctx.fillRect(-2,-9,4,3);ctx.restore()}
/* cast-iron ingot mould; hot = just stripped */
function drawMould(x,y,s,hot){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.3)';rr(-7,-4,16,14,2);ctx.fill();ctx.fillStyle=hot>0?mix(C.kokille,'#7a3b20',hot):C.kokille;rr(-8,-8,16,15,2);ctx.fill();ctx.fillStyle=hot>0?mix('#16181c',C.molten,hot*.8):'#16181c';rr(-4.5,-5,9,9,1.5);ctx.fill();ctx.fillStyle='rgba(255,255,255,.12)';ctx.fillRect(-8,-8,16,1.5);ctx.restore()}
/* iron ore as pellets / sinter: a small heap of dark red-grey balls */
function drawOre(x,y,s,k){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.28)';ell(1,3,11,6);ctx.fill();
 for(let i=0;i<7;i++){const a=i*2.4+k,r=i?5.5:0,px=Math.cos(a)*r,py=Math.sin(a)*r*.6-(i?0:2);ctx.fillStyle=i%3?'#6b3d33':'#4a3a36';circ(px,py,3.6);ctx.fill();ctx.fillStyle='rgba(255,210,190,.22)';circ(px-1,py-1.2,1.2);ctx.fill()}ctx.restore()}
/* masseljern: a cast pig with notches */
function drawPig(x,y,s){ctx.save();ctx.translate(x,y);ctx.scale(s,s);ctx.fillStyle='rgba(0,0,0,.28)';rr(-11,-2,24,9,3);ctx.fill();ctx.fillStyle='#4f4844';rr(-12,-6,24,10,3);ctx.fill();ctx.fillStyle='#7d746c';rr(-12,-6,24,4,2);ctx.fill();
 ctx.fillStyle='#2f2a27';for(let i=-1;i<=1;i++)ctx.fillRect(i*7-.8,-6,1.6,10);ctx.restore()}
function drawItem(it,x,y,sc){switch(it.k){
 case'scrap':drawScrap(x,y,9*sc,it.kk||0,((it.kk||0)%8-4)*.08);break;case'slag':drawSlag(x,y,8*sc,it.kk||0);break;
 case'ingot':drawIngot(x,y,sc,0);break;case'bloom':case'billet':drawBillet(x,y+2,0,24*sc,it.k);break;
 case'rebar':drawRebar(x,y,24*sc,0);break;case'tcore':drawRebar(x,y,24*sc,1);break;case'coil':drawCoil(x,y,24*sc);break;
 case'mesh':drawMesh(x,y,sc);break;case'bent':drawBent(x,y,sc);break;
 case'ore':drawOre(x,y,sc,it.kk||0);break;case'pig':drawPig(x,y,sc);break;
 case'kalk':drawSack(x,y,sc,it.kk);break;case'hette':drawSack(x,y,sc,0,C.hette);break;case'leg':drawLeg(x,y,sc);break;
 case'o2':drawBottle(x,y,sc,C.o2);break;case'gass':drawBottle(x,y,sc,C.gass);break;case'elek':drawRod(x,y,sc);break;
 case'ildf':drawBrick(x,y,sc,0);break;case'kanal':drawBrick(x,y,sc,1);break;case'valse':drawRoll(x,y,sc);break;
 case'bind':drawSpool(x,y,sc);break;case'vann':drawTank(x,y,sc);break;case'kokk':drawMould(x,y,sc,0);break;case'kokv':drawMould(x,y,sc,.8);break}}


/* ---------- drawing kit ported from the approved sketch (skisse_v5): every function takes the context first ---------- */
const SK=(()=>{const F=(w,s)=>`${w} ${s}px ${FONT}`;
const HEAT=['#3f4248','#4a2e26','#7a2a12','#b8400e','#ff6a00','#ffb030','#ffe7a6'];
function heat(k){k=clamp(k,0,1)*(HEAT.length-1);const i=Math.min(HEAT.length-2,Math.floor(k));return mix(HEAT[i],HEAT[i+1],k-i)}

/* ================= drawing helpers ================= */
function rr(g,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));g.beginPath();g.moveTo(x+r,y);g.arcTo(x+w,y,x+w,y+h,r);g.arcTo(x+w,y+h,x,y+h,r);g.arcTo(x,y+h,x,y,r);g.arcTo(x,y,x+w,y,r);g.closePath()}
function circ(g,x,y,r){g.beginPath();g.arc(x,y,Math.max(0,r),0,TAU)}
function ell(g,x,y,rx,ry,a){g.beginPath();g.ellipse(x,y,Math.max(0,rx),Math.max(0,ry),a||0,0,TAU)}
function shadow(g,x,y,rx,ry,a){g.fillStyle=`rgba(0,0,0,${a==null?.3:a})`;ell(g,x,y,rx,ry);g.fill()}
function box(g,x,y,w,h,fill,edge,r){g.fillStyle=fill;rr(g,x,y,w,h,r==null?2:r);g.fill();if(edge){g.strokeStyle=edge;g.lineWidth=1;rr(g,x+.5,y+.5,w-1,h-1,r==null?2:r);g.stroke()}}
function txt(g,s,x,y,size,col,w,al){g.font=F(w||700,size);g.textAlign=al||'center';g.textBaseline='middle';g.fillStyle=col;g.fillText(s,x,y)}
function line(g,x1,y1,x2,y2,col,w){g.strokeStyle=col;g.lineWidth=w||1;g.beginPath();g.moveTo(x1,y1);g.lineTo(x2,y2);g.stroke()}
function hazardBar(g,x,y,w,h){g.save();rr(g,x,y,w,h,2);g.clip();g.fillStyle='#15171c';g.fillRect(x,y,w,h);g.fillStyle='#f5c518';for(let s=-h;s<w+h;s+=10){g.beginPath();g.moveTo(x+s,y+h);g.lineTo(x+s+5,y+h);g.lineTo(x+s+5+h,y);g.lineTo(x+s+h,y);g.closePath();g.fill()}g.restore()}
/* stateless particles: fn(f 0..1 life, a, b, i) */
function parts(n,rate,seed,t,fn){for(let i=0;i<n;i++){const ph=t*rate+i/n,k=Math.floor(ph);fn(ph-k,hsh(seed+i*13.1+k*7.7),hsh(seed+i*3.3+k*1.9),i)}}
function pathPts(g,p){g.beginPath();g.moveTo(p[0][0],p[0][1]);for(let i=1;i<p.length;i++)g.lineTo(p[i][0],p[i][1])}
/* pipe on supports, optional animated flow dashes */
function pipe(g,p,w,col,t,o){o=o||{};g.lineJoin='round';g.lineCap=o.cap||'round';
  g.save();g.translate(1.5,2.5);pathPts(g,p);g.strokeStyle='rgba(0,0,0,.32)';g.lineWidth=w+2;g.stroke();g.restore();
  pathPts(g,p);g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=w+2;g.stroke();
  pathPts(g,p);g.strokeStyle=col;g.lineWidth=w;g.stroke();
  pathPts(g,p);g.strokeStyle='rgba(255,255,255,.22)';g.lineWidth=Math.max(.8,w*.28);g.stroke();
  if(o.flow){g.setLineDash(o.dash||[Math.max(2,w*.8),Math.max(5,w*2.2)]);g.lineDashOffset=RM?0:-(t*(o.speed||28));pathPts(g,p);g.strokeStyle=o.flow;g.lineWidth=Math.max(1.2,w*.42);g.stroke();g.setLineDash([])}
  g.lineCap='butt'}
function hose(g,x1,y1,cx,cy,x2,y2,w,col,t,flow){g.lineCap='round';const P=()=>{g.beginPath();g.moveTo(x1,y1);g.quadraticCurveTo(cx,cy,x2,y2)};
  P();g.strokeStyle='rgba(0,0,0,.55)';g.lineWidth=w+2;g.stroke();P();g.strokeStyle=col;g.lineWidth=w;g.stroke();
  if(flow){g.setLineDash([2,5]);g.lineDashOffset=RM?0:-t*24;P();g.strokeStyle=flow;g.lineWidth=Math.max(1,w*.5);g.stroke();g.setLineDash([])}g.lineCap='butt'}
/* conveyor belt in local frame (x along belt) */
function belt(g,x1,y1,x2,y2,w,t,o){o=o||{};const L=Math.hypot(x2-x1,y2-y1),a=Math.atan2(y2-y1,x2-x1);g.save();g.translate(x1,y1);g.rotate(a);
  g.fillStyle='rgba(0,0,0,.3)';g.fillRect(2,-w/2+3,L,w+2);
  if(o.trestle){for(let s=10;s<L-4;s+=22){g.fillStyle='#262a30';g.fillRect(s,-w/2-5,3,w+10)}}
  g.fillStyle='#50555d';g.fillRect(0,-w/2-2,L,w+4);g.fillStyle='#202328';g.fillRect(0,-w/2,L,w);
  const off=RM?0:(t*(o.speed||16))%9;g.strokeStyle='rgba(255,255,255,.09)';g.lineWidth=1;g.beginPath();for(let s=-9+off;s<L;s+=9){g.moveTo(s,-w/2+1);g.lineTo(s+w*.25,0);g.lineTo(s,w/2-1)}g.stroke();
  if(o.items)o.items(g,L,w,t);g.restore()}
function rail(g,x0,x1,y,gauge){gauge=gauge||0;g.fillStyle='#2b2620';for(let x=x0;x<x1;x+=7)g.fillRect(x,y-gauge/2-4,3,gauge+8);g.fillStyle='#6d6358';g.fillRect(x0,y-gauge/2-1.5,x1-x0,2.2);if(gauge)g.fillRect(x0,y+gauge/2-.5,x1-x0,2.2)}
function railV(g,x,y0,y1,gauge){g.fillStyle='#2b2620';for(let y=y0;y<y1;y+=7)g.fillRect(x-gauge/2-4,y,gauge+8,3);g.fillStyle='#6d6358';g.fillRect(x-gauge/2-1.5,y0,2.2,y1-y0);g.fillRect(x+gauge/2-.5,y0,2.2,y1-y0)}
function fan(g,x,y,r,t,sp){g.fillStyle='#24272c';circ(g,x,y,r);g.fill();g.strokeStyle='#5b616a';g.lineWidth=1.2;circ(g,x,y,r);g.stroke();const a0=RM?0:t*(sp||6);g.fillStyle='#8a929c';for(let i=0;i<4;i++){g.save();g.translate(x,y);g.rotate(a0+i*PI/2);ell(g,r*.45,0,r*.42,r*.16);g.fill();g.restore()}g.fillStyle='#3a3f46';circ(g,x,y,r*.18);g.fill()}
function pulse(t,P){P=P||.7;if(RM)return 0;const k=Math.floor(t/P),f=(t%P)/P;return k+ease(f/.35)}

/* scrap chunk */
const SCRAPC=['#8a4a2a','#a0602f','#6e7378','#7a5240','#5d6268'];
function chunk(g,x,y,s,a,col){g.save();g.translate(x,y);g.rotate(a*PI);g.fillStyle=col;g.fillRect(-s,-s*.42,s*2,s*.84);g.fillStyle='rgba(0,0,0,.28)';g.fillRect(-s,s*.12,s*2,s*.3);g.restore()}
function pile(g,x,y,w,h,kind,s){shadow(g,x+w/2+3,y+h/2+4,w*.48,h*.46,.22);
  const n=kind==='shred'?150:kind==='bale'?12:44;
  for(let i=0;i<n;i++){const a=hsh(s+i*1.3),b=hsh(s+i*2.7),c=hsh(s+i*4.1);const px=x+w*(.08+.84*(a+hsh(s+i*5.3))/2),py=y+h*(.06+.88*(b+hsh(s+i*6.7))/2);
    if(kind==='heavy'){chunk(g,px,py,3+c*5,c*2,SCRAPC[Math.floor(c*3.99)%3===2?0:Math.floor(c*2)])}
    else if(kind==='shred'){g.fillStyle=mix('#56606c','#9aa6b4',c);circ(g,px,py,1.1+c*1.6);g.fill()}
    else{const sx=x+8+(i%3)*(w-16)/2.4,sy=y+10+Math.floor(i/3)*(h-18)/3.6;g.save();g.translate(sx+5,sy+5);g.rotate((c-.5)*.5);g.fillStyle=mix('#9aa3ad','#c9d0d8',c);g.fillRect(-9,-8,18,16);g.strokeStyle='rgba(40,45,52,.75)';g.lineWidth=1;g.strokeRect(-9,-8,18,16);g.beginPath();g.moveTo(-9,-2);g.lineTo(9,-2);g.moveTo(-9,3);g.lineTo(9,3);g.stroke();g.restore()}}}

/* ================= equipment components ================= */
/* Electric arc furnace, top-down. Local frame: transformer side = −x. Angles in local frame. */

function ladle(g,x,y,r,t,o){o=o||{};shadow(g,x+r*.14,y+r*.22,r*1.08,r*.98,.35);g.save();g.translate(x,y);g.rotate(o.rot||0);
  g.fillStyle='#4a4f56';g.fillRect(-r*1.2,-r*.13,r*.26,r*.26);g.fillRect(r*.94,-r*.13,r*.26,r*.26);g.fillStyle='#2a2d31';g.fillRect(-r*1.2,-r*.05,r*.1,r*.1);g.fillRect(r*1.1,-r*.05,r*.1,r*.1);
  g.fillStyle='#50555c';circ(g,0,0,r);g.fill();g.strokeStyle='#26292d';g.lineWidth=1.5;circ(g,0,0,r);g.stroke();
  g.fillStyle='#3a3030';circ(g,0,0,r*.86);g.fill();
  box(g,r*.5,r*.5,r*.32,r*.22,'#6b7079','#2a2d31',2);
  const f=o.fill==null?1:o.fill;
  if(o.lid){g.fillStyle='#6b7079';circ(g,0,0,r*.82);g.fill();g.strokeStyle='#4a4f56';g.lineWidth=2;circ(g,0,0,r*.6);g.stroke();g.fillStyle='#3e434a';circ(g,0,0,r*.18);g.fill()}
  else if(f>.02){const gr=g.createRadialGradient(-r*.2,-r*.2,r*.05,0,0,r*.76);gr.addColorStop(0,mix('#6b3a20','#ffe39a',f));gr.addColorStop(.6,mix('#4a2a1a','#ff8a20',f));gr.addColorStop(1,mix('#3a2418','#b8400e',f));g.fillStyle=gr;circ(g,0,0,r*.76);g.fill();
    for(let i=0;i<8;i++){const a=i*.8+(RM?0:t*.12),rr2=r*(.25+.4*hsh(i+2));g.fillStyle=`rgba(90,72,60,${.55*f})`;ell(g,Math.cos(a)*rr2,Math.sin(a)*rr2,r*.17,r*.09,a);g.fill()}
    if(o.eye!==false){const p=RM?.7:.6+.4*Math.sin(t*3.2);const gr2=g.createRadialGradient(r*.22,-r*.12,0,r*.22,-r*.12,r*.24*p);gr2.addColorStop(0,'rgba(255,250,220,.95)');gr2.addColorStop(1,'rgba(255,200,90,0)');g.fillStyle=gr2;circ(g,r*.22,-r*.12,r*.26);g.fill()}}
  else{g.fillStyle='#2a2220';circ(g,0,0,r*.76);g.fill();g.strokeStyle='rgba(120,74,58,.6)';g.lineWidth=1;for(let k=1;k<4;k++){circ(g,0,0,r*.19*k);g.stroke()}}
  g.restore()}
function car(g,x,y,w,h){shadow(g,x+3,y+4,w*.55,h*.55,.3);box(g,x-w/2,y-h/2,w,h,'#3d434b','#1b1e22',3);hazardBar(g,x-w/2,y-h/2,w,4);hazardBar(g,x-w/2,y+h/2-4,w,4);
  g.fillStyle='#16181c';[[-1,-1],[1,-1],[-1,1],[1,1]].forEach(([a,b])=>g.fillRect(x+a*w*.36-5,y+b*h*.5-3,10,6))}
function loxTank(g,x,y,r){shadow(g,x+4,y+6,r*1.05,r*.9,.35);g.fillStyle='#eef2f6';circ(g,x,y,r);g.fill();g.strokeStyle='#4f8fd8';g.lineWidth=r*.12;circ(g,x,y,r*.92);g.stroke();
  const gr=g.createRadialGradient(x-r*.35,y-r*.35,r*.1,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(160,175,195,.4)');g.fillStyle=gr;circ(g,x,y,r*.84);g.fill();
  g.fillStyle='#9aa6b4';circ(g,x,y,r*.16);g.fill();g.fillStyle='#4f8fd8';g.fillRect(x-r*.5,y+r*.2,r,r*.16);txt(g,'O₂',x,y+r*.28,r*.2,'#fff',800)}
function vaporiser(g,x,y,s,t,i){shadow(g,x+s*.55,y+s*.6,s*.55,s*.5,.25);g.fillStyle='#c9d3dd';g.fillRect(x,y,s,s);g.strokeStyle='#8090a0';g.lineWidth=1;g.strokeRect(x+.5,y+.5,s-1,s-1);
  g.strokeStyle='#e9f0f7';g.lineWidth=1.4;g.beginPath();g.moveTo(x+s/2,y+2);g.lineTo(x+s/2,y+s-2);g.moveTo(x+2,y+s/2);g.lineTo(x+s-2,y+s/2);g.moveTo(x+4,y+4);g.lineTo(x+s-4,y+s-4);g.moveTo(x+s-4,y+4);g.lineTo(x+4,y+s-4);g.stroke();
  const fr=RM?.5:.5+.5*Math.sin(t*1.3+i*1.7);g.fillStyle=`rgba(255,255,255,${.25+.3*fr})`;g.fillRect(x+1,y+1,s-2,s*.35)}
function silo(g,x,y,r,col,ring){shadow(g,x+4,y+6,r*1.05,r*.92,.35);g.fillStyle=col;circ(g,x,y,r);g.fill();g.strokeStyle=ring||'rgba(0,0,0,.35)';g.lineWidth=2;circ(g,x,y,r);g.stroke();
  g.strokeStyle='rgba(0,0,0,.16)';g.lineWidth=1;for(let i=0;i<10;i++){const a=i/10*TAU;g.beginPath();g.moveTo(x+Math.cos(a)*r*.2,y+Math.sin(a)*r*.2);g.lineTo(x+Math.cos(a)*r*.95,y+Math.sin(a)*r*.95);g.stroke()}
  const gr=g.createRadialGradient(x-r*.4,y-r*.4,1,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.28)');gr.addColorStop(1,'rgba(0,0,0,.12)');g.fillStyle=gr;circ(g,x,y,r);g.fill();
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x-r*.14,y-r*.14,r*.28,r*.28)}
function blowTank(g,x,y,r){shadow(g,x+2,y+3,r,r*.9,.3);g.fillStyle='#6a6f77';circ(g,x,y,r);g.fill();g.strokeStyle='#2a2d31';g.lineWidth=1.5;circ(g,x,y,r);g.stroke();g.fillStyle='#8b939e';circ(g,x,y,r*.5);g.fill();g.fillStyle='#d24b3a';circ(g,x+r*.75,y-r*.75,r*.25);g.fill()}
function valveSkid(g,x,y,w,h){shadow(g,x+w/2+3,y+h/2+4,w*.55,h*.55,.3);box(g,x,y,w,h,'#2b3038','#141619',3);g.strokeStyle='rgba(255,255,255,.08)';g.strokeRect(x+3.5,y+3.5,w-7,h-7);
  for(let i=0;i<3;i++){const vx=x+w*(.22+.28*i),vy=y+h*.38;g.fillStyle='#6fa8e8';g.fillRect(vx-4,vy-2,8,4);g.strokeStyle='#d24b3a';g.lineWidth=1.6;circ(g,vx,vy,3.6);g.stroke()}
  g.fillStyle='#e9edf2';circ(g,x+w*.78,y+h*.75,3.4);g.fill();g.strokeStyle='#111';g.lineWidth=1;g.beginPath();g.moveTo(x+w*.78,y+h*.75);g.lineTo(x+w*.78+2,y+h*.75-2);g.stroke();
  g.fillStyle='#e0b020';g.fillRect(x+w*.12,y+h*.68,w*.45,3)}
function ingot(g,x,y,s,k){g.fillStyle=k>.05?heat(k):'#5d5f64';g.fillRect(x-s,y-s*.55,s*2,s*1.1);g.fillStyle='rgba(255,255,255,.16)';g.fillRect(x-s,y-s*.55,s*2,s*.25);g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=1;g.strokeRect(x-s+.5,y-s*.55+.5,s*2-1,s*1.1-1)}
function billetBar(g,x,y,L,h,k){g.fillStyle=heat(k);g.fillRect(x,y-h/2,L,h);g.fillStyle='rgba(255,255,255,.14)';g.fillRect(x,y-h/2,L,h*.3);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x,y+h/2-1,L,1)}
function coilTop(g,x,y,r,col){shadow(g,x+2,y+3,r,r*.9,.3);g.fillStyle=col||'#7a6a5c';circ(g,x,y,r);g.fill();g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1;for(let k=1;k<5;k++){circ(g,x,y,r*(.45+k*.12));g.stroke()}g.fillStyle='#2a2d33';circ(g,x,y,r*.42);g.fill();
  g.strokeStyle='#c9ced6';g.lineWidth=1.5;for(let i=0;i<4;i++){const a=i*PI/4+.4;g.beginPath();g.moveTo(x+Math.cos(a)*r*.42,y+Math.sin(a)*r*.42);g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);g.moveTo(x-Math.cos(a)*r*.42,y-Math.sin(a)*r*.42);g.lineTo(x-Math.cos(a)*r,y-Math.sin(a)*r);g.stroke()}}
function bundle(g,x,y,L,n,ties,col,tagOn){shadow(g,x+L/2+2,y+n*1.6+3,L*.5,n*1.4,.25);for(let i=0;i<n;i++){g.fillStyle=i%2?mix(col||'#7b5f4c','#000',.15):(col||'#7b5f4c');g.fillRect(x,y+i*3,L,2.6)}
  g.fillStyle='#d7dde4';(ties||[]).forEach(f=>g.fillRect(x+f*L-1,y-1.5,2.4,n*3+2));if(tagOn){g.fillStyle='#fff';g.fillRect(x+L-1,y+n*1.5-4,6,8);g.fillStyle='#d24b3a';g.fillRect(x+L,y+n*1.5-3,4,2)}}

/* ingot teeming plate: used in gallery and mock. ph: 0..1 cycle */


/* Electric arc furnace, top-down (ported from the approved sketch, extended for the eras).
   Local frame: transformer side = −x. o.refr: refractory walls (early EAF) instead of water-cooled panels.
   o.roofOff 0..1: roof + arms swung aside for bucket charging. o.spout: long tapping spout instead of an EBT nose. */
function eaf(g,cx,cy,R,t,rot,o){o=o||{};const A=Object.assign({car:0,tap:PI/2,door:-PI/2,h4:-PI/4,h5:PI/4},o.a||{});
  const P=(a,r)=>[Math.cos(a)*r,Math.sin(a)*r];const arc=o.arc==null?1:o.arc,ro=clamp(o.roofOff||0,0,1),open=o.open||ro>.02;
  const E=[[R*.16,0],[-R*.08,-R*.14],[-R*.08,R*.14]];
  const fl=RM?.7:.5+.5*Math.abs(Math.sin(t*21)*Math.cos(t*6.7+.4));
  g.save();g.translate(cx,cy);g.rotate(rot||0);
  g.fillStyle='rgba(0,0,0,.35)';circ(g,R*.06,R*.1,R*1.04);g.fill();
  if(o.trafo){const x0=-R*1.86,x1=-R*1.42,big=o.trafo>1;shadow(g,(x0+x1)/2+4,6,(x1-x0)*.6,R*.86,.3);box(g,x0,-R*(big?.9:.8),x1-x0,R*(big?1.8:1.6),'#8a8a84','rgba(0,0,0,.45)',3);box(g,x0+R*.05,-R*(big?.82:.72),x1-x0-R*.1,R*(big?1.64:1.44),'#77776f',null,2);
    for(let i=0;i<(big?11:9);i++){g.fillStyle=i%2?'#5c5c56':'#a3a39c';g.fillRect(x0-R*.13,-R*(big?.78:.66)+i*R*.15,R*.13,R*.09)}
    g.save();g.translate((x0+x1)/2,-R*.42);g.rotate(-(rot||0));g.fillStyle='#f5c518';g.beginPath();g.moveTo(0,-R*.1);g.lineTo(R*.09,R*.07);g.lineTo(-R*.09,R*.07);g.closePath();g.fill();g.fillStyle='#111';g.fillRect(-R*.012,-R*.05,R*.024,R*.07);g.restore();
    E.forEach(e=>{box(g,x1-R*.02,e[1]*1.5-R*.035,R*.08,R*.07,'#c27a3e',null,1)})}
  const armsOn=o.arms!==false&&ro<.02&&!o.open;
  if(o.arms!==false&&!o.open){E.forEach((e,i)=>{for(let k=0;k<2;k++){const sw=RM?0:Math.sin(t*1.4+i*1.7+k)*R*.035,y1=e[1]*1.5+(k-.5)*R*.05,y2=e[1]+(k-.5)*R*.04,cy2=(y1+y2)/2+(k?1:-1)*R*.13+sw,dx=-ro*R*1.25;
    hose(g,-R*1.42,y1,-R*1.3+dx*.5,cy2,-R*1.18+dx,y2,R*.045,'#141518',t)}})}
  if(o.spout){g.save();g.rotate(A.tap);box(g,R*.78,-R*.12,R*.72,R*.24,'#7c4a3a','#2a1712',R*.05);g.fillStyle=o.tapping?heat(.92):'#3a2018';g.fillRect(R*.8,-R*.05,R*.68,R*.1);g.restore()}
  else{const[tx,ty]=P(A.tap,R*.9);g.fillStyle='#2c3036';circ(g,tx,ty,R*.24);g.fill();g.strokeStyle='#1b1e22';g.lineWidth=2;circ(g,tx,ty,R*.24);g.stroke();
   const[tx2,ty2]=P(A.tap,R*1.02);g.fillStyle=o.tapping?heat(.9):'#c9b48a';circ(g,tx2,ty2,R*.06);g.fill()}
  g.fillStyle='#2c3036';circ(g,0,0,R);g.fill();g.strokeStyle='#1b1e22';g.lineWidth=2;circ(g,0,0,R);g.stroke();
  const N=28;for(let i=0;i<N;i++){const a0=i/N*TAU+.035,a1=(i+1)/N*TAU-.035;
   if(o.refr){g.strokeStyle=i%2?'#8a4a38':'#7c4232';g.lineWidth=R*.12;g.beginPath();g.arc(0,0,R*.9,a0,a1);g.stroke();g.strokeStyle='rgba(255,200,170,.18)';g.lineWidth=1;g.beginPath();g.arc(0,0,R*.95,a0,a1);g.stroke()}
   else{g.strokeStyle='#6f7c88';g.lineWidth=R*.1;g.beginPath();g.arc(0,0,R*.915,a0,a1);g.stroke();g.strokeStyle='rgba(200,215,230,.38)';g.lineWidth=1;g.beginPath();g.arc(0,0,R*.955,a0,a1);g.stroke()}}
  if(o.car){g.save();g.rotate(A.car);g.fillStyle='#140d0a';g.fillRect(R*.78,-R*.17,R*.26,R*.34);g.fillStyle=rgba('#ff7a1a',.35+.2*fl);g.fillRect(R*.78,-R*.13,R*.1,R*.26);g.restore()}
  if(o.door!==false){g.save();g.rotate(A.door);if(o.slag){const gr=g.createRadialGradient(R*1.05,0,0,R*1.05,0,R*.22);gr.addColorStop(0,rgba('#ffb030',.85));gr.addColorStop(1,rgba('#c2410c',0));g.fillStyle=gr;ell(g,R*1.06,0,R*.2,R*.13);g.fill()}
    box(g,R*.84,-R*.17,R*.18,R*.34,'#56616c','#1e2227',2);for(let k=0;k<4;k++){g.fillStyle='rgba(255,255,255,.14)';g.fillRect(R*.86,-R*.14+k*R*.08,R*.14,R*.025)}g.restore()}
  const roof=()=>{g.fillStyle=o.refr?'#6b625c':'#5b636d';circ(g,0,0,R*.84);g.fill();
    if(o.refr){g.strokeStyle='rgba(30,24,20,.35)';g.lineWidth=1;for(const r of[.74,.62,.5,.4]){circ(g,0,0,R*r);g.stroke()}for(let i=0;i<16;i++){const a=i/16*TAU;g.beginPath();g.moveTo(Math.cos(a)*R*.32,Math.sin(a)*R*.32);g.lineTo(Math.cos(a)*R*.83,Math.sin(a)*R*.83);g.stroke()}}
    else{[.79,.7,.61,.52,.43].forEach(r=>{g.strokeStyle='rgba(150,166,182,.6)';g.lineWidth=R*.035;circ(g,0,0,R*r);g.stroke()});
     g.strokeStyle='rgba(30,34,39,.5)';g.lineWidth=1.2;for(let i=0;i<8;i++){const a=i/8*TAU+.2;g.beginPath();g.moveTo(Math.cos(a)*R*.32,Math.sin(a)*R*.32);g.lineTo(Math.cos(a)*R*.83,Math.sin(a)*R*.83);g.stroke()}
     g.fillStyle='#3a8fd0';for(let i=0;i<12;i++){const a=i/12*TAU;circ(g,Math.cos(a)*R*.83,Math.sin(a)*R*.83,R*.028);g.fill()}}
    if(o.h4!==false){const[h4x,h4y]=P(A.h4,R*.55);g.save();g.translate(h4x,h4y);g.rotate(o.ductAng!=null?o.ductAng:A.h4);const DL=o.duct||R*1.2,DW=R*.27;
      g.fillStyle='rgba(0,0,0,.3)';g.fillRect(3,-DW/2+4,DL,DW);g.fillStyle='#6a7078';g.fillRect(0,-DW/2,DL,DW);for(let s=R*.18;s<DL;s+=R*.13){g.fillStyle='rgba(0,0,0,.2)';g.fillRect(s,-DW/2,R*.03,DW)}g.fillStyle='rgba(255,255,255,.14)';g.fillRect(0,-DW/2,DL,DW*.22);
      if(o.smoke!==false&&arc>0)parts(5,.45,7,t,(f,a,b)=>{g.fillStyle=`rgba(190,190,195,${.22*(1-f)*arc})`;circ(g,R*.2+f*DL*.7,(a-.5)*DW*.6,R*.06+f*R*.14);g.fill()});
      g.restore();g.fillStyle='#7c848d';circ(g,h4x,h4y,R*.17);g.fill();g.fillStyle='#1a1512';circ(g,h4x,h4y,R*.1);g.fill();g.fillStyle=rgba('#ff7a1a',.35*fl*arc);circ(g,h4x,h4y,R*.09);g.fill()}
    if(o.h5!==false){const[h5x,h5y]=P(A.h5,R*.55);box(g,h5x-R*.08,h5y-R*.08,R*.16,R*.16,'#7c848d','#30353b',2);g.fillStyle='#16110f';g.fillRect(h5x-R*.045,h5y-R*.045,R*.09,R*.09)}
    g.fillStyle='#bfae92';circ(g,0,0,R*.3);g.fill();g.strokeStyle='#8f7f66';g.lineWidth=R*.03;circ(g,0,0,R*.3);g.stroke();
    if(arc>0){const gr=g.createRadialGradient(0,0,0,0,0,R*.4*(.75+.35*fl));gr.addColorStop(0,`rgba(240,244,255,${.95*arc})`);gr.addColorStop(.35,`rgba(196,176,255,${.55*arc})`);gr.addColorStop(.7,`rgba(255,140,40,${.3*arc})`);gr.addColorStop(1,'rgba(255,120,30,0)');g.fillStyle=gr;circ(g,0,0,R*.45);g.fill()}};
  const inside=()=>{const b=o.bath==null?1:o.bath;const gr=g.createRadialGradient(-R*.1,0,R*.1,0,0,R*.86);gr.addColorStop(0,mix('#5a3a2a','#ffe39a',b));gr.addColorStop(.5,mix('#4a2e22','#ff8a20',b));gr.addColorStop(1,mix('#2a1c16','#a8380c',b));g.fillStyle=gr;circ(g,0,0,R*.86);g.fill();
    if(o.scrapIn>0){for(let i=0;i<Math.round(26*o.scrapIn);i++){const a=hsh(i*3.3)*TAU,r=R*.7*Math.sqrt(hsh(i*7.1));chunk(g,Math.cos(a)*r,Math.sin(a)*r,R*(.05+.04*hsh(i)),hsh(i*2),SCRAPC[i%5])}}
    if(o.foam){parts(26,.5,3,t,(f,a,b,i)=>{const ang=PI+(a-.5)*1.3,r=R*(.62+.22*b);g.fillStyle=`rgba(${120+60*b},${70+30*b},40,${.55*(1-Math.abs(f-.5)*2)})`;circ(g,Math.cos(ang)*r,Math.sin(ang)*r,R*(.03+.05*f));g.fill()})}
    else{for(let i=0;i<9;i++){const a=hsh(i)*TAU+t*.05,r=R*(.3+.45*hsh(i+3));g.fillStyle='rgba(110,70,40,.45)';ell(g,Math.cos(a)*r,Math.sin(a)*r,R*.09,R*.05,a);g.fill()}}};
  if(open){inside();if(ro>.02){g.save();g.translate(-R*1.25*ro,-R*.35*ro);g.globalAlpha=.96;roof();g.globalAlpha=1;g.restore()}}else roof();
  (o.inj||[]).forEach((a,i)=>{g.save();g.rotate(a);
    if(o.flame!==false&&arc>0){const bur=o.burner,L=R*(bur?.26:.36)*(RM?1:1+.15*Math.sin(t*31+i*2.3)),W2=R*(bur?.11:.035);const gr=g.createLinearGradient(R*.82,0,R*.82-L,0);
      gr.addColorStop(0,bur?'rgba(255,220,150,.95)':'rgba(235,245,255,.98)');gr.addColorStop(.5,bur?'rgba(255,140,40,.7)':'rgba(120,180,255,.75)');gr.addColorStop(1,'rgba(80,140,255,0)');
      g.fillStyle=gr;g.beginPath();g.moveTo(R*.82,-W2);g.lineTo(R*.82-L,0);g.lineTo(R*.82,W2);g.closePath();g.fill()}
    box(g,R*.8,-R*.075,R*.17,R*.15,o.kullInj===i?'#3a3c42':'#b87333',o.kullInj===i?'#111':'#5a3418',2);g.fillStyle='#e0a070';g.fillRect(R*.83,-R*.03,R*.05,R*.06);g.restore()});
  if(armsOn){E.forEach((e,i)=>{const jy=RM?0:Math.sin(t*9+i*2)*R*.008*arc,ax0=-R*1.16,ax1=e[0]+R*.05,ay=e[1]+jy;
      g.fillStyle='rgba(0,0,0,.3)';g.fillRect(ax0+3,ay-R*.045+4,ax1-ax0,R*.09);
      const gr=g.createLinearGradient(0,ay-R*.045,0,ay+R*.045);gr.addColorStop(0,'#d99a62');gr.addColorStop(1,'#8a5226');g.fillStyle=gr;rr(g,ax0,ay-R*.045,ax1-ax0,R*.09,R*.02);g.fill();
      g.strokeStyle='rgba(255,230,200,.35)';g.lineWidth=1;g.beginPath();g.moveTo(ax0+2,ay-R*.015);g.lineTo(ax1-R*.06,ay-R*.015);g.stroke();
      box(g,ax0-R*.08,ay-R*.075,R*.16,R*.15,'#4a5058','#22262b',2);g.fillStyle='#8b939e';circ(g,ax0,ay,R*.03);g.fill()});
    E.forEach((e,i)=>{const jy=RM?0:Math.sin(t*9+i*2)*R*.008*arc;g.fillStyle='#120e0c';circ(g,e[0],e[1]+jy,R*.085);g.fill();g.fillStyle='#c27a3e';circ(g,e[0],e[1]+jy,R*.078);g.fill();g.fillStyle='#1d1e22';circ(g,e[0],e[1]+jy,R*.06);g.fill();g.fillStyle='rgba(255,255,255,.22)';circ(g,e[0]-R*.018,e[1]+jy-R*.018,R*.022);g.fill()});
    if(arc>0)parts(10,1.6,11,t,(f,a,b)=>{const ang=a*TAU,r=R*(.05+.3*f);g.strokeStyle=`rgba(255,240,200,${.9*(1-f)*arc})`;g.lineWidth=1.1;g.beginPath();g.moveTo(Math.cos(ang)*r,Math.sin(ang)*r);g.lineTo(Math.cos(ang)*(r+R*.05),Math.sin(ang)*(r+R*.05));g.stroke()})}
  else if(ro>.02&&o.arms!==false){/* arms lifted and swung out with the roof */g.save();g.translate(-R*1.25*ro,-R*.35*ro);E.forEach(e=>{const ax0=-R*1.16+R*1.25*ro*.6,ax1=e[0]+R*.05,ay=e[1];g.fillStyle='#b07040';rr(g,ax0,ay-R*.04,ax1-ax0,R*.08,R*.02);g.fill();g.fillStyle='#1d1e22';circ(g,e[0],e[1],R*.06);g.fill()});g.restore()}
  g.restore()}

/* Siemens-Martin (open hearth), top-down, long axis vertical. Charging doors on the left side face the scrap yard,
   checker chambers (regeneratorer) at both ends, the flame reverses every few seconds; tap hole on the right side. */
function smFurnace(g,cx,cy,t,o){o=o||{};const W=170,H=210,x0=cx-W/2,y0=cy-H/2,heatK=clamp(o.heat==null?.6:o.heat,0,1);
  const per=7,ph=RM?.3:(t%(per*2))/(per*2),dir=ph<.5?1:-1,fk=RM?1:Math.min(1,Math.min(ph%.5,.5-ph%.5)*12);
  /* checker chambers + flues */
  const chamber=(yc,hot)=>{shadow(g,cx+4,yc+6,W*.62,32,.3);box(g,cx-W*.6,yc-30,W*1.2,60,'#4b3f3a','#1d1714',6);
    for(let i=0;i<10;i++)for(let j=0;j<3;j++){const v=.55+.45*hsh(i*3+j*7);g.fillStyle=hot>.6?heat(.3+.32*v):mix('#3a2a24','#7a3a22',v*.6);g.fillRect(cx-W*.55+i*W*.11,yc-22+j*15,W*.09,11)}
    g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1;g.strokeRect(cx-W*.6+.5,yc-29.5,W*1.2-1,59)};
  const topHot=dir<0?1:.35,botHot=dir>0?1:.35;chamber(y0-44,topHot);chamber(y0+H+44,botHot);
  box(g,cx-22,y0-16,44,22,'#5a4a42','#1d1714',3);box(g,cx-22,y0+H-6,44,22,'#5a4a42','#1d1714',3);
  /* stack (pipe) beside the top chamber */
  g.fillStyle='#3c3f45';circ(g,cx+W*.78,y0-44,16);g.fill();g.fillStyle='#16181c';circ(g,cx+W*.78,y0-44,10);g.fill();
  parts(6,.4,13,t,(f,a)=>{g.fillStyle=`rgba(170,170,176,${.25*(1-f)})`;circ(g,cx+W*.78+f*30,y0-44-f*40+(a-.5)*10,6+f*14);g.fill()});
  /* hearth */
  shadow(g,cx+5,cy+8,W*.56,H*.55,.35);box(g,x0,y0,W,H,'#6b3a2c','#1f120e',16);
  const gr=g.createLinearGradient(0,y0,0,y0+H);gr.addColorStop(0,heat(.3+.5*heatK));gr.addColorStop(.5,heat(.45+.5*heatK));gr.addColorStop(1,heat(.3+.5*heatK));g.fillStyle=gr;rr(g,x0+12,y0+12,W-24,H-24,10);g.fill();
  /* flame tongue from the active port */
  if(o.fire!==false){const fy=dir>0?y0+12:y0+H-12,len=(H-40)*(.75+.15*Math.sin(t*7))*fk,gf=g.createLinearGradient(0,fy,0,fy+dir*len);gf.addColorStop(0,'rgba(255,250,220,.95)');gf.addColorStop(.4,'rgba(255,190,80,.75)');gf.addColorStop(1,'rgba(255,110,30,0)');
   g.fillStyle=gf;g.beginPath();g.moveTo(cx-34,fy);g.quadraticCurveTo(cx-40,fy+dir*len*.6,cx,fy+dir*len);g.quadraticCurveTo(cx+40,fy+dir*len*.6,cx+34,fy);g.closePath();g.fill()}
  /* roof arches (semi-open so the bath and flame read through) */
  g.globalAlpha=.55;for(let i=0;i<9;i++){g.fillStyle=i%2?'#9a5a44':'#8a4a38';g.fillRect(x0+8,y0+14+i*((H-28)/9),W-16,(H-28)/9-3)}g.globalAlpha=1;
  g.strokeStyle='rgba(255,210,170,.25)';g.lineWidth=1;for(let i=1;i<9;i++){const y=y0+14+i*((H-28)/9)-1.5;g.beginPath();g.moveTo(x0+8,y);g.lineTo(x0+W-8,y);g.stroke()}
  /* charging doors on the left side */
  for(let i=0;i<3;i++){const dy=cy-60+i*60,op=o.door===i;box(g,x0-14,dy-16,18,32,op?'#2a1a14':'#56616c','#1e2227',3);g.fillStyle=op?heat(.85):rgba('#ff7a1a',.25+.35*heatK);g.fillRect(x0-6,dy-10,6,20)}
  /* tap hole + short spout on the right side */
  box(g,x0+W-4,cy-10,26,20,'#7c4a3a','#2a1712',4);g.fillStyle=o.tapping?heat(.95):'#3a2018';g.fillRect(x0+W,cy-4,22,8);}
/* ingot mould seen from above (skisse style): cast iron box, hot-top collar, cavity that glows when filled */
function mould(g,x,y,S,fill,hot,o){o=o||{};shadow(g,x+3,y+4,S*1.05,S*.95,.35);box(g,x-S,y-S,S*2,S*2,'#3b3f46','#1c1e22',3);g.fillStyle='rgba(255,255,255,.08)';g.fillRect(x-S,y-S,S*2,S*.35);
  if(o.top!==false){g.fillStyle='#9b7b4f';g.fillRect(x-S*.7,y-S*.7,S*1.4,S*1.4);g.fillStyle='#7d613c';g.fillRect(x-S*.58,y-S*.58,S*1.16,S*1.16)}
  const iw=S*.95;g.fillStyle='#17120f';g.fillRect(x-iw/2,y-iw/2,iw,iw);
  if(fill>0){const q=iw*(.35+.65*fill);g.fillStyle=heat(clamp(hot,0,1)*.95);g.globalAlpha=.35+.65*fill;g.fillRect(x-q/2,y-q/2,q,q);g.globalAlpha=1}}

function troughDraw(g,x0,x1,y,w,t,heatFn,o){o=o||{};g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x0+2,y-w/2+3,x1-x0,w);g.fillStyle='#575c64';g.fillRect(x0,y-w/2-3,x1-x0,w+6);g.fillStyle='#1d1f23';g.fillRect(x0,y-w/2,x1-x0,w);
  g.fillStyle='rgba(255,255,255,.05)';for(let x=x0+4;x<x1;x+=12)g.fillRect(x,y-w/2,1.5,w);
  const off=pulse(t)*5,sp=8.6,span=Math.ceil((x1-x0)/sp+3)*sp;
  for(let i=0;i*sp<span;i++){const raw=i*sp+off,s=Math.floor(raw/span),x=x0-6+(raw%span);if(x<x0-1||x>x1+1)continue;const a=hsh(i*3.7+s*11),b=hsh(i*5.1+s*3),k=heatFn(x);
    chunk(g,x,y+(b-.5)*w*.62,2.4+a*2.6,a*2,k>.04?heat(k*(.85+.3*a)):SCRAPC[Math.floor(a*4.99)%5]);if(hsh(i*2.2+s)>.5)chunk(g,x+3,y+(a-.5)*w*.5,2+b*2,b,k>.04?heat(k*.9):SCRAPC[Math.floor(b*4.99)%5])}}

function strandCut(g,t,x0,Xc,y,hw,mode,i,o){o=o||{};const P=o.P||4,ph=RM?.5:((t+i*1.13)%P)/P,L=o.L||48,spd=o.spd||1;
  const head=ph<.6?Xc+ph/.6*L:Xc+((ph-.6)/.4)*6;const cutAt=.6;
  if(o.piece!==false&&ph>=cutAt){const fx=Xc+L+((ph-cutAt)/.4)*(o.run||90);billetBar(g,fx-L+4,y,L-4,hw*2,.32)}
  if(o.cut===false)return head;
  if(mode==='saks'){const travel=ph>.5&&ph<.62?(ph-.5)/.12*4:0;const bx=Xc+travel;
    box(g,bx-9,y-hw-12,18,hw*2+24,'#6b6f76','#1d1f23',2);hazardBar(g,bx-9,y-hw-12,18,4);hazardBar(g,bx-9,y+hw+8,18,4);g.fillStyle='#2a2c30';g.fillRect(bx-1.5,y-hw-8,3,hw*2+16);
    if(ph>.58&&ph<.66){g.fillStyle=`rgba(255,250,220,${1-(ph-.58)/.08})`;g.fillRect(bx-3,y-hw-4,6,hw*2+8)}}
  else{const carX=ph<.4?Xc-8:ph<.6?Xc-8+(ph-.4)/.2*6:ph<.75?Xc-2-(ph-.6)/.15*6:Xc-8;
    g.fillStyle='#6d6358';g.fillRect(Xc-24,y-hw-9,46,1.6);g.fillRect(Xc-24,y+hw+7.5,46,1.6);
    box(g,carX-7,y-hw-12,14,hw*2+24,'#4a5058','#1b1e22',2);g.fillStyle='#16181c';g.fillRect(carX-6,y-hw-11,4,3);g.fillRect(carX+2,y-hw-11,4,3);g.fillRect(carX-6,y+hw+8,4,3);g.fillRect(carX+2,y+hw+8,4,3);
    const ny=ph>.4&&ph<.6?lerp(y-hw,y+hw,(ph-.4)/.2):y-hw-4;g.fillStyle='#b87333';circ(g,carX+7,ny,2.6);g.fill();
    if(ph>.4&&ph<.6){parts(14,3,i*7,t,(f,a,b)=>{g.fillStyle=`rgba(255,${190+60*a|0},${90+80*b|0},${1-f})`;circ(g,carX+7+(a-.3)*10*f,ny+f*18+(b-.5)*6,1+1.2*(1-f));g.fill()});const gl=g.createRadialGradient(carX+7,ny,0,carX+7,ny,7);gl.addColorStop(0,'rgba(255,255,240,.95)');gl.addColorStop(1,'rgba(255,170,60,0)');g.fillStyle=gl;circ(g,carX+7,ny,7);g.fill()}}
  return head}

return{heat,rr,circ,ell,shadow,box,txt,line,hazardBar,parts,pipe,hose,belt,rail,railV,fan,pulse,chunk,pile,ladle,car,loxTank,vaporiser,silo,blowTank,valveSkid,ingot,billetBar,coilTop,bundle,troughDraw,strandCut,eaf,smFurnace,mould,SCRAPC}})();
const heat=SK.heat;

/* ---------- v6 drawing kit: tall equipment in a light oblique view (height z goes up the screen by OK·z) ---------- */
const OK=.62;
const SK2=(()=>{const{box,circ,ell,shadow,line,parts,chunk,SCRAPC,rr}=SK;
/* one horizontal slice of a round body: circle with a left-lit gradient */
function slice(g,x,y,r,c0,c1){const gr=g.createLinearGradient(x-r,0,x+r,0);gr.addColorStop(0,c1);gr.addColorStop(.45,c0);gr.addColorStop(1,mix(c0,'#000000',.45));g.fillStyle=gr;circ(g,x,y,r);g.fill()}
/* vertical cylinder from z0 to z1 (drawn as stacked slices so it reads as a solid) */
function cyl(g,x,y,r,z0,z1,c0,c1,hoops){const st=max(3,r*.35);for(let z=z0;z<=z1;z+=st)slice(g,x,y-z*OK,r,c0,c1);slice(g,x,y-z1*OK,r,c0,c1);
 if(hoops){g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1.2;for(let z=z0+hoops;z<z1;z+=hoops){g.beginPath();g.ellipse(x,y-z*OK,r,r*.32,0,0,PI);g.stroke()}}}
/* top cap seen from above */
function cap(g,x,y,r,c){g.fillStyle=c;circ(g,x,y,r);g.fill();g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=1;circ(g,x,y,r);g.stroke()}
/* ---- converter (Bessemer / LD): pear on trunnions; tilt > 0 turns the mouth toward +x (tap side) ---- */
function convProfile(s){if(s<-.62)return .9*Math.sqrt(max(0,1-Math.pow((s+.62)/.38,2)));if(s<.2)return .9;if(s<.92)return lerp(.9,.46,(s-.2)/.72);return .5}
function convPt(cx,cy,R,tilt,s){const z0=R*1.15;return[cx+s*R*Math.sin(tilt),cy-(z0+s*R*Math.cos(tilt))*OK]}
function converter(g,cx,cy,R,t,o){o=o||{};const tl=o.tilt||0,ld=!!o.ld,z0=R*1.15,c0=ld?'#5d636c':'#5f5048',c1=ld?'#9aa2ac':'#9a8676';
 shadow(g,cx+6,cy+8,R*1.15,R*.75,.35);
 /* pedestals + trunnion pins (back one first) */
 const ped=(sy)=>{box(g,cx-R*.2,cy+sy-z0*OK,R*.4,z0*OK+6,'#3c4149','#15171a',3);g.fillStyle='#2a2d33';g.fillRect(cx-R*.26,cy+sy-4,R*.52,10)};
 const pin=(sy)=>{g.fillStyle='#6b7079';circ(g,cx,cy+sy-z0*OK,R*.17);g.fill();g.strokeStyle='#22252a';g.lineWidth=2;circ(g,cx,cy+sy-z0*OK,R*.17);g.stroke();g.fillStyle='#22252a';circ(g,cx,cy+sy-z0*OK,R*.06);g.fill()};
 ped(-R*1.08);pin(-R*1.08);
 /* body: slices sorted by height */
 const N=30,list=[];for(let i=0;i<=N;i++){const s=-1+i*2.05/N;list.push(s)}if(Math.cos(tl)<0)list.reverse();
 for(const s of list){const[x,y]=convPt(cx,cy,R,tl,s),r=convProfile(s)*R;if(r<.5)continue;const ring=s>-.08&&s<.14;slice(g,x,y,ring?r*1.07:r,ring?'#7a7f87':c0,ring?'#c9ced6':c1)}
 /* Bessemer: wind box under the bottom + blast pipe up to the trunnion */
 if(!ld){const[bx,by]=convPt(cx,cy,R,tl,-1.04);g.fillStyle='#3a3230';circ(g,bx,by,R*.32);g.fill();g.strokeStyle='#1d1715';g.lineWidth=1.5;circ(g,bx,by,R*.32);g.stroke();
  const[px,py]=convPt(cx,cy,R,tl,-.02);SK.pipe(g,[[cx,cy+R*1.08-z0*OK],[px+R*.95*Math.cos(tl)*.0+R*.6,py+R*.2],[bx+R*.25,by]],R*.09,'#6b5e56',t)}
 /* mouth */
 const[mx,my]=convPt(cx,cy,R,tl,1.05),rm=R*.44;g.save();g.translate(mx,my);g.transform(Math.cos(tl),Math.sin(tl)*OK,0,1,0,0);
 g.fillStyle='#2a2d31';circ(g,0,0,rm*1.12);g.fill();g.fillStyle='#120c0a';circ(g,0,0,rm);g.fill();
 const hot=o.hot||0;if(hot>0){const gr=g.createRadialGradient(0,0,0,0,0,rm);gr.addColorStop(0,`rgba(255,240,190,${.9*hot})`);gr.addColorStop(.6,`rgba(255,140,40,${.7*hot})`);gr.addColorStop(1,'rgba(160,50,10,0)');g.fillStyle=gr;circ(g,0,0,rm);g.fill()}
 g.restore();
 /* taphole on the cone (LD) */
 if(ld){const[hx,hy]=convPt(cx,cy,R,tl,.78);const dx=Math.cos(tl)*R*.46;g.fillStyle=o.tapping?heat(.95):'#2a1a14';circ(g,hx+dx,hy+Math.sin(tl)*R*.46*OK,R*.08);g.fill()}
 ped(R*1.08);pin(R*1.08);
 /* blow: tall flame out of the mouth (Bessemer: the famous flame; LD: shorter, with the lance) */
 if(o.blow>0&&Math.cos(tl)>.6){const fl=RM?1:1+.12*Math.sin(t*23)+.08*Math.sin(t*37),H=R*(ld?1.4:2.5)*fl*o.blow,W=rm*(ld?.9:1.15);
  const gr=g.createLinearGradient(0,my,0,my-H);gr.addColorStop(0,'rgba(255,252,235,.98)');gr.addColorStop(.35,ld?'rgba(255,190,90,.85)':'rgba(255,220,140,.9)');gr.addColorStop(.75,'rgba(255,120,30,.5)');gr.addColorStop(1,'rgba(255,90,20,0)');
  g.fillStyle=gr;g.beginPath();g.moveTo(mx-W,my);g.bezierCurveTo(mx-W*1.2,my-H*.45,mx-W*.3,my-H*.8,mx+(RM?0:Math.sin(t*5)*W*.3),my-H);g.bezierCurveTo(mx+W*.3,my-H*.8,mx+W*1.2,my-H*.45,mx+W,my);g.closePath();g.fill();
  parts(ld?14:26,1.4,3,t,(f,a,b)=>{const ang=-PI/2+(a-.5)*1.9,sp=R*(1.2+1.6*b)*f;g.strokeStyle=`rgba(255,${200+50*a|0},120,${1-f})`;g.lineWidth=1.4;const x=mx+Math.cos(ang)*sp,y=my+Math.sin(ang)*sp+f*f*R*1.4;g.beginPath();g.moveTo(x,y);g.lineTo(x-Math.cos(ang)*4,y-Math.sin(ang)*4+2);g.stroke()});
  parts(6,.35,9,t,(f,a)=>{g.fillStyle=`rgba(${ld?150:190},${ld?120:110},${ld?110:90},${.3*(1-f)})`;circ(g,mx+(a-.5)*R+f*R*.6,my-H*.7-f*R*1.6,R*(.2+.4*f));g.fill()})}
 /* LD lance: water-cooled pipe lowered from the lance carriage above */
 if(ld){const[mx,my]=convPt(cx,cy,R,0,1.05),top=my-R*2.5,low=o.lance||0,tip=lerp(my-R*1.5,my+R*.15,low);box(g,mx-R*.32,top-R*.3,R*.64,R*.34,'#3d4756','#14171c',3);SK.hazardBar(g,mx-R*.32,top-R*.3,R*.64,4);
  g.fillStyle='#c9ced6';g.fillRect(mx-R*.05,top,R*.1,tip-top);g.fillStyle='rgba(255,255,255,.4)';g.fillRect(mx-R*.04,top,R*.025,tip-top);
  SK.hose(g,mx+R*.05,top+4,mx+R*.7,top+R*.3,mx+R*.9,top-R*.1,2.5,'#4f8fd8',t,low>.5?'#f4fbff':null);SK.hose(g,mx-R*.05,top+6,mx-R*.6,top+R*.4,mx-R*.85,top-R*.05,2.5,'#3a8fd0',t)}
}
/* ---- coke blast furnace: hearth, bosh, stack, bell top; bustle pipe with tuyeres ---- */
function bfProfile(z){return z<40?54:z<80?lerp(54,64,(z-40)/40):z<250?lerp(64,44,(z-80)/170):z<275?lerp(44,30,(z-250)/25):26}
function blastFurnace(g,cx,cy,t,o){o=o||{};const run=o.run||0;
 shadow(g,cx+8,cy+10,92,70,.35);
 /* bustle pipe back half + tuyere stubs behind */
 const bz=62,br=84,by=cy-bz*OK;g.lineWidth=11;g.strokeStyle='#6d5d52';g.beginPath();g.ellipse(cx,by,br,br*.42,0,PI,TAU);g.stroke();
 for(let z=0;z<=300;z+=6){const r=bfProfile(z),c0=z<40?'#4a3a34':z<80?'#5a4a42':'#5b6068',c1=z<40?'#7a645a':z<80?'#8a7468':'#9aa2ac';slice(g,cx,cy-z*OK,r,c0,c1)}
 g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=1.3;for(let z=100;z<250;z+=30){const r=bfProfile(z);g.beginPath();g.ellipse(cx,cy-z*OK,r,r*.3,0,0,PI);g.stroke()}
 /* top: receiving hopper and bell (seen from above) */
 cap(g,cx,cy-300*OK,26,'#6b7079');cap(g,cx,cy-300*OK,15,'#3a3f46');g.fillStyle=o.bell?'#8b939e':'#2a2d31';circ(g,cx,cy-300*OK,8);g.fill();
 /* uptakes */
 /* uptakes rising from the top cone and joining the downcomer */
 for(const dx of[-16,16])SK.pipe(g,[[cx+dx,cy-288*OK],[cx+dx,cy-340*OK],[cx+18,cy-366*OK]],8,'#6a7078',t);
 /* bustle pipe front half + tuyeres glowing */
 g.lineWidth=11;g.strokeStyle='#7a6a5e';g.beginPath();g.ellipse(cx,by,br,br*.42,0,0,PI);g.stroke();g.lineWidth=2;g.strokeStyle='rgba(255,220,180,.25)';g.beginPath();g.ellipse(cx,by-3,br,br*.42,0,.2,PI-.2);g.stroke();
 for(let i=0;i<10;i++){const a=i/10*PI+.16,x0=cx+Math.cos(a)*br,y0=by+Math.sin(a)*br*.42,x1=cx+Math.cos(a)*56,y1=cy-38*OK+Math.sin(a)*56*.42;line(g,x0,y0,x1,y1,'#5a4e46',4);
  g.fillStyle=run>0?rgba('#ffb030',.5+.5*run*(RM?1:.7+.3*Math.sin(t*9+i))):'#3a2a24';circ(g,x1,y1,3.2);g.fill()}
 /* taphole glow */
 const th=bfTap(cx,cy);g.fillStyle=o.tapping?heat(.95):'#3a2018';circ(g,th[0],th[1],5);g.fill()}
const bfTap=(cx,cy)=>[cx+46,cy+18];
/* ---- electric pig-iron furnace: low round shaft, closed lid, three Søderberg electrodes ---- */
function elFurnace(g,cx,cy,t,o){o=o||{};const run=o.run||0;shadow(g,cx+8,cy+10,94,70,.35);
 cyl(g,cx,cy,76,0,70,'#4e535b','#8b939e',22);cap(g,cx,cy-74*OK,78,'#5b636d');g.strokeStyle='rgba(150,166,182,.55)';g.lineWidth=2;for(const r of[64,48]){circ(g,cx,cy-74*OK,r);g.stroke()}
 /* charge chutes from the day bins */
 for(let i=0;i<6;i++){const a=i/6*TAU+.5,x=cx+Math.cos(a)*56,y=cy-74*OK+Math.sin(a)*56*.9;line(g,x,y,x,y-50*OK,'#6b7079',4)}
 const E=[[0,-30],[-26,15],[26,15]];
 for(const[ex,ey]of E){const x=cx+ex,y=cy+ey*.9;if(run>0){const fl=RM?.8:.6+.4*Math.abs(Math.sin(t*17+ex));const gr=g.createRadialGradient(x,y-74*OK,0,x,y-74*OK,22);gr.addColorStop(0,`rgba(255,220,150,${.8*run*fl})`);gr.addColorStop(1,'rgba(255,120,30,0)');g.fillStyle=gr;circ(g,x,y-74*OK,22);g.fill()}
  cyl(g,x,y,11,74,210,'#6b7079','#c9ced6',34);g.fillStyle='#c27a3e';for(const z of[96,104])g.fillRect(x-13,y-z*OK-2,26,4);box(g,x-14,y-222*OK,28,14,'#3d4756','#14171c',3)}
 /* off-gas (CO) duct */
 line(g,cx+50,cy-74*OK-20,cx+50,cy-150*OK,'#6a7078',10);
 const th=bfTap(cx,cy);g.fillStyle=o.tapping?heat(.95):'#3a2018';circ(g,th[0]+6,th[1]+4,5);g.fill()}
/* ---- hot-blast stove (cowper): tall cylinder with dome; on blast = hot glow at the valve, on gas = burner flame ---- */
function cowper(g,x,y,t,blast,on){cyl(g,x,y,24,0,150,on?'#6b625c':'#4a4744',on?'#a39488':'#76706a',30);g.fillStyle=on?'#8a7a6e':'#5a5550';g.beginPath();g.arc(x,y-150*OK,24,PI,TAU);g.fill();cap(g,x,y-150*OK-4,20,on?'#9a8a7e':'#66605a');
 if(!on)return;if(blast){g.fillStyle=rgba('#ff5a20',RM?.8:.6+.3*Math.sin(t*6));circ(g,x+18,y-40*OK,5);g.fill()}
 else{const f=RM?1:.7+.3*Math.sin(t*19+x);const gr=g.createRadialGradient(x-14,y-14*OK,0,x-14,y-14*OK,10);gr.addColorStop(0,`rgba(255,230,160,${.9*f})`);gr.addColorStop(1,'rgba(255,120,30,0)');g.fillStyle=gr;circ(g,x-14,y-14*OK,10);g.fill()}}
/* ---- torpedo car: cigar-shaped ladle on two bogies; tilt rolls the mouth toward the viewer to pour ---- */
function torpedo(g,x,y,L,load,t,o){o=o||{};const r=17,z=16,yy=y-z*OK;
 shadow(g,x+4,y+6,L*.55,12,.3);for(const s of[-1,1]){box(g,x+s*L*.32-18,y-6,36,12,'#22252a','#0d0e10',3);g.fillStyle='#3a3f46';circ(g,x+s*L*.32-10,y+4,4);g.fill();circ(g,x+s*L*.32+10,y+4,4);g.fill()}
 const gr=g.createLinearGradient(0,yy-r,0,yy+r);gr.addColorStop(0,'#9aa2ac');gr.addColorStop(.45,'#5d636c');gr.addColorStop(1,'#2a2d33');g.fillStyle=gr;g.beginPath();g.ellipse(x,yy,L/2,r,0,0,TAU);g.fill();
 g.strokeStyle='rgba(0,0,0,.4)';g.lineWidth=1;for(const k of[-.25,.25]){g.beginPath();g.moveTo(x+k*L,yy-r+2);g.lineTo(x+k*L,yy+r-2);g.stroke()}
 g.fillStyle='#3a3f46';g.fillRect(x-L/2-6,yy-3,8,6);g.fillRect(x+L/2-2,yy-3,8,6);
 const ro=o.tilt||0,mx=x,my=yy-r*.55*Math.cos(ro)+r*.7*Math.sin(ro);g.fillStyle='#2a2d31';g.beginPath();g.ellipse(mx,my,13,6+3*Math.sin(ro),0,0,TAU);g.fill();
 g.fillStyle=load>0?heat(clamp(.55+.4*load,0,1)):'#140d0a';g.beginPath();g.ellipse(mx,my,10,4+3*Math.sin(ro),0,0,TAU);g.fill()}
return{slice,cyl,cap,converter,convPt,blastFurnace,elFurnace,cowper,torpedo,bfTap}})();

/* ---------- floor bake: static floor, zones, rails and roller tables go to one offscreen canvas ---------- */
const FS=1,fc=document.createElement('canvas');fc.width=(WW-WX0)*FS;fc.height=WH*FS;
/* which zone plot is next to be built (only that one is shown before it exists) */
const nextBuild=()=>BUILDS[S.ph]||null;
const zoneShown=z=>z.rj||zoneBuilt(z)||(nextBuild()&&ZN[nextBuild().z]===z)||(z.id==='gjv'||z.id==='vv')&&nextBuild()&&nextBuild().id==='vv'||(z.id==='salg2'&&nextBuild()&&nextBuild().id==='stel');
function zonePlate(z){const nb=nextBuild(),built=zoneBuilt(z);let t=t_(z.n);if(z.id==='ovn')t=t_('STÅLVERK')+' · '+t_(E_().k);if(z.id==='rj')t=t_('RÅJERNSVERK')+' · '+t_(rjEra()?'EL-OVN':'MASOVN');
 if(z.rj&&rjClosed())return{t:t_(z.n)+' · '+t_('NEDLAGT'),x:z.x0+12,y:z.y0+12,h:20,w:0,col:'#6b7079'};
 if(!built)t=t_('TOMT')+' · '+(nb?t_(nb.n).toUpperCase():t_(z.n));return{t,x:z.x0+12,y:z.y0+12,h:20,w:0,col:built?z.col:'#7d8590'}}
function plateW(p,g){g=g||ctx;g.font=`800 11px ${FONT}`;return g.measureText(p.t).width+18}
const ROLLS=[];/* [path, built()] static roller tables / conveyors */
function bakeFloor(){const f=fc.getContext('2d'),r=seeded(7);f.setTransform(FS,0,0,FS,-WX0*FS,0);
 f.fillStyle='#373c44';f.fillRect(WX0,0,WW-WX0,WH);
 f.strokeStyle='rgba(0,0,0,.2)';f.lineWidth=1;f.beginPath();for(let x=24-48*16;x<WW;x+=48){f.moveTo(x+.5,0);f.lineTo(x+.5,WH)}for(let y=24;y<WH;y+=48){f.moveTo(0,y+.5);f.lineTo(WW,y+.5)}f.stroke();
 for(let i=0;i<620;i++){const x=WX0+r()*(WW-WX0),y=r()*WH,rad=3+r()*18;f.fillStyle=r()>.5?'rgba(0,0,0,.06)':'rgba(255,255,255,.025)';f.beginPath();f.arc(x,y,rad,0,TAU);f.fill()}
 /* zones: tinted floor + dashed border (plates are drawn on top later) */
 for(const z of ZONES){if(!zoneShown(z))continue;const built=zoneBuilt(z),w=z.x1-z.x0,h=z.y1-z.y0;
  f.fillStyle=z.rj&&rjClosed()?'rgba(0,0,0,.16)':built?rgba(z.col,z.sup?.08:.075):'rgba(0,0,0,.12)';SK.rr(f,z.x0,z.y0,w,h,16);f.fill();
  f.setLineDash(built?[10,7]:[6,8]);f.strokeStyle=built?rgba(z.col,.7):z.rj?'rgba(244,241,234,.18)':'rgba(244,241,234,.28)';f.lineWidth=2;SK.rr(f,z.x0+1,z.y0+1,w-2,h-2,16);f.stroke();f.setLineDash([])}
 /* scrap yards (bays with low walls) */
 for(const[id,p]of[['y0',POS.y0],['y1',POS.y1]]){const on=id==='y0'||lv('yard2');f.fillStyle=on?'#2e3238':'rgba(46,50,56,.45)';SK.rr(f,p.x-96,p.y-122,192,244,10);f.fill();f.strokeStyle='#1b1e23';f.lineWidth=5;f.strokeRect(p.x-96,p.y-122,192,244);
  if(!on){f.font=`800 12px ${FONT}`;f.textAlign='center';f.fillStyle='rgba(244,241,234,.3)';f.fillText(t_('SKRAPHAUG 2'),p.x,p.y)}}
 /* råjernsverk floor: ore bay, ore-train track, cast house, skip pit, torpedo tracks to the steel plant */
 {const cl=rjClosed(),p=POS.ore;f.fillStyle=cl?'rgba(46,50,56,.55)':'#2e3238';SK.rr(f,p.x-96,p.y-122,192,244,10);f.fill();f.strokeStyle='#1b1e23';f.lineWidth=5;f.strokeRect(p.x-96,p.y-122,192,244);
  const ty=POS.oreTrainY;f.fillStyle='#2b2826';f.fillRect(WX0+10,ty-20,640,40);for(let x=WX0+14;x<WX0+650;x+=16){f.fillStyle='#4a3f36';f.fillRect(x,ty-17,7,34)}f.fillStyle=cl?'#5a4a40':C.rail;f.fillRect(WX0+10,ty-11,640,4);f.fillRect(WX0+10,ty+7,640,4);
  f.fillStyle='rgba(0,0,0,.2)';SK.rr(f,-236,590,200,70,8);f.fill();f.fillStyle='rgba(0,0,0,.25)';SK.rr(f,POS.skip.x-54,POS.skip.y-48,108,96,10);f.fill();
  const rail=(y,x0,x1)=>{f.fillStyle='#2b2620';for(let x=x0;x<x1;x+=8)f.fillRect(x,y-13,3.4,26);f.fillStyle=cl?'#5a4e44':'#7d7064';f.fillRect(x0,y-9,x1-x0,2.6);f.fillRect(x0,y+7,x1-x0,2.6)};
  rail(POS.torpA,-340,POS.torpX1+70);rail(POS.torpB,-340,POS.torpX1-60);
  if(cl){f.fillStyle='rgba(55,60,68,.55)';f.fillRect(-340,POS.torpA-16,POS.torpX1+410,54)}}
 /* crane rails */
 f.fillStyle='#22252b';{const c=CRN.skrap;f.fillRect(c.x0-6,c.y0-8,c.x1-c.x0+12,6);f.fillRect(c.x0-6,c.y1+2,c.x1-c.x0+12,6)}
 {const c=CRN.ose;f.fillRect(c.x0-6,c.y0-10,c.x1-c.x0+12,5);f.fillRect(c.x0-6,c.y1+4,c.x1-c.x0+12,5)}
 if(lv('malmkran')&&!rjClosed()){const c=CRN.malm;f.fillStyle='#22252b';f.fillRect(c.x0-6,c.y0-8,c.x1-c.x0+12,6);f.fillRect(c.x0-6,c.y1+2,c.x1-c.x0+12,6)}
 if(B_('vv')&&lv('magkran')){const c=CRN.mag;f.fillRect(c.x0-6,c.y0-6,c.x1-c.x0+12,5);f.fillRect(c.x0-6,c.y1+2,c.x1-c.x0+12,5)}
 /* furnace platform + slag yard */
 f.fillStyle='rgba(0,0,0,.18)';if(ET()!=='sm')f.beginPath(),f.arc(POS.F.x,POS.F.y,150,0,TAU),f.fill();else SK.rr(f,676,404,250,394,14),f.fill();
 if(slagOn()){const p=POS.slagp;f.fillStyle='#2b2826';f.beginPath();f.ellipse(p.x,p.y,84,56,0,0,TAU);f.fill();for(let i=0;i<120;i++){const a=r()*TAU,d=Math.sqrt(r());f.fillStyle=r()<.5?'rgba(90,86,80,.5)':'rgba(0,0,0,.35)';f.fillRect(p.x+Math.cos(a)*d*80,p.y+Math.sin(a)*d*52,3,3)}}
 /* ladle car rails from the tap to the ladle parking */
 SK.railV(f,POS.tap.x,POS.tap.y-40,POS.park[1].y+40,40);
 /* roller tables / conveyors that exist */
 for(const[p,on]of ROLLS){if(!on())continue;f.lineCap='butt';f.lineJoin='miter';f.strokeStyle='#202328';f.lineWidth=22;f.beginPath();p.forEach((q,i)=>i?f.lineTo(q[0],q[1]):f.moveTo(q[0],q[1]));f.stroke();f.strokeStyle='#4a5059';f.lineWidth=16;f.setLineDash([3,6]);f.stroke();f.setLineDash([])}
 /* truck bays */
 {const p=POS.truck1;f.fillStyle='#2c3036';f.fillRect(p.x-48,p.y-110,96,260);f.fillStyle=hazPat(f);f.fillRect(p.x-48,p.y-114,96,7)}
 if(B_('stel')){const p=POS.truck2;f.fillStyle='#2c3036';f.fillRect(p.x-140,p.y-46,300,92);f.fillStyle=hazPat(f);f.fillRect(p.x-144,p.y-46,7,92)}
 /* utlasting: rails along the top, quay + water in the bottom-right corner */
 if(zoneShown(ZN.utlast)){const ry=POS.railY,rx=ZN.utlast.x0+10;f.fillStyle='#2b2826';f.fillRect(rx,ry-26,WW-rx,52);for(let x=rx+4;x<WW;x+=18){f.fillStyle='#4a3f36';f.fillRect(x,ry-23,8,46)}f.fillStyle=C.rail;f.fillRect(rx,ry-14,WW-rx,5);f.fillRect(rx,ry+10,WW-rx,5);f.fillStyle='#8d8579';f.fillRect(rx,ry-14,WW-rx,1.5);f.fillRect(rx,ry+10,WW-rx,1.5)}
 {const qy=QY,wg=f.createLinearGradient(0,qy,0,WH);wg.addColorStop(0,C.water2);wg.addColorStop(1,C.water);f.fillStyle=wg;f.fillRect(QX,qy,WW-QX,WH-qy);
  f.fillStyle=hazPat(f);f.fillRect(QX,qy-8,WW-QX,8);f.fillStyle='#22262c';for(let x=QX+50;x<WW;x+=140){f.fillRect(x,qy-20,14,12)}
  f.strokeStyle='rgba(255,255,255,.08)';f.lineWidth=2;for(let i=0;i<22;i++){const x=QX+10+r()*(WW-QX-40),y=qy+20+r()*(WH-qy-30);f.beginPath();f.moveTo(x,y);f.quadraticCurveTo(x+12,y-4,x+24,y);f.stroke()}}
 /* border */
 f.fillStyle='#1d2026';f.fillRect(WX0,0,WW-WX0,10);f.fillRect(WX0,0,10,WH);f.fillRect(WX0,WH-10,QX-WX0,10);f.fillRect(WW-10,0,10,QY);
 /* zone name plates */
 f.textBaseline='middle';for(const z of ZONES){if(!zoneShown(z))continue;const p=zonePlate(z),w=plateW(p,f);SK.box(f,p.x,p.y,w,p.h,p.col,null,10);f.font=`800 11px ${FONT}`;f.textAlign='center';f.fillStyle='#111';f.fillText(p.t,p.x+w/2,p.y+p.h/2+.5)}
}
