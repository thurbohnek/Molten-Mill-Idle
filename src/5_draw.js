/* ---------- draw ---------- */
let VX0=0,VY0=0,VX1=0,VY1=0;
const inView=(x,y,r)=>x+r>VX0&&x-r<VX1&&y+r>VY0&&y-r<VY1;
const stackSp=n=>n>18?max(3.2,126/n):7;
const g=ctx;
function drawWorker(a,vest,helmet,cap){const x=a.x,y=a.y,bob=a.moving?Math.abs(Math.sin(a.walk))*2:0,sw=a.moving?Math.sin(a.walk)*4:0;
 shadow(x,y+3,14,7,.35);
 ctx.fillStyle='#262a33';rr(x-8,y-6+sw*.6,6,11,3);ctx.fill();rr(x+2,y-6-sw*.6,6,11,3);ctx.fill();
 ctx.fillStyle=mix(vest,'#000000',.25);rr(x-11,y-21-bob,22,19,8);ctx.fill();
 ctx.fillStyle=vest;rr(x-11,y-23-bob,22,18,8);ctx.fill();
 ctx.fillStyle='#dfe4ea';ctx.fillRect(x-11,y-15-bob,22,3);ctx.fillRect(x-4,y-23-bob,3,8);
 ctx.fillStyle=vest;circ(x-12,y-14-bob+sw*.3,4);ctx.fill();circ(x+12,y-14-bob-sw*.3,4);ctx.fill();
 ctx.fillStyle=C.skin;circ(x,y-28-bob,7);ctx.fill();
 ctx.fillStyle=helmet;ctx.beginPath();ctx.arc(x,y-30-bob,8.5,PI,0);ctx.fill();ctx.fillRect(x-10,y-31-bob,20,2.5);
 ctx.fillStyle='rgba(255,255,255,.5)';ctx.fillRect(x-3,y-37-bob,6,2);
 const sway=-a.vx*.012,n=a.stack.length,sp=stackSp(n);
 for(let i=0;i<n;i++){const it=a.stack[i];if(it.age<0)continue;const s=1+max(0,.18-it.age)*3,ix=x+sway*i*(sp/7),iy=y-40-bob-i*sp;
  ctx.save();ctx.translate(ix,iy);ctx.scale(s,s);drawItem(it,0,0,1);ctx.restore()}
 if(cap&&n>=cap)txt(t_('MAKS'),x,y-48-n*sp-bob,10,C.hazard,800,'center',3)}
/* a static text label on the floor: drawn in the label pass, so it is never drawn under the HUD or across another label */
function labFix(k,t,x,y,fs,col,wt){wt=wt||800;ctx.font=`${wt} ${fs}px ${FONT}`;const w=ctx.measureText(t).width+8,h=fs*1.2+4;LBL.push({k,x:x-w/2,y:y-h/2,w,h,pr:1,ax:null,fix:1,f:(lx,ly)=>txt(t,lx+w/2,ly+h/2,fs,col,wt,'center',3)})}
/* floor rings (drop / sale / station inputs) */
function padRing(x,y,r,label,glow,fill,col){if(!inView(x,y,r+10))return;ctx.fillStyle='rgba(0,0,0,.3)';circ(x+2,y+4,r);ctx.fill();ctx.fillStyle=col||HZ;circ(x,y,r);ctx.fill();ctx.fillStyle=glow?mix('#20242c',C.molten,glow):'#20242c';circ(x,y,r-7);ctx.fill();
 if(fill!=null){ctx.save();circ(x,y,r-7);ctx.clip();ctx.fillStyle=rgba(fill>=1?C.good:fill<.25?C.danger:C.hazard,.35);const h=(r-7)*2*clamp(fill,0,1);ctx.fillRect(x-r,y+r-7-h,2*r,h);ctx.restore()}
 txt(label,x,y+1,label.length>5?(label.length>8?8.5:10.5):13,glow?'#fff':col?C.ui:C.hazard,800);LOBS.push({x:x-r,y:y-r,w:2*r,h:2*r,ring:1})}
/* ---- scrap yards: pile size follows the tonnes lying there ---- */
/* the scrap pile is cached per yard and only redrawn when its size changes noticeably */
const YC={};
function drawYard(s){if(!s.open()||!inView(s.x,s.y,170))return;const n=min(170,Math.round(yardT(s)*(s.kind==='ore'?1.6:2.2))),q=n<20?n:Math.round(n/6)*6;
 let c=YC[s.id];if(!c){c=YC[s.id]={cv:document.createElement('canvas'),n:-1};c.cv.width=440;c.cv.height=520}
 if(c.n!==q){c.n=q;const f=c.cv.getContext('2d');f.setTransform(2,0,0,2,0,0);f.clearRect(0,0,220,260);const ox=110,oy=130;SK.shadow(f,ox+4,oy+6,82*min(1,.35+q/170),104*min(1,.35+q/170),.25);
  for(let i=0;i<q;i++){const a=hsh(i*2.1+s.x)*TAU,r=Math.sqrt(hsh(i*5.3+s.y))*min(1,.4+q/150),px=ox+Math.cos(a)*80*r,py=oy+Math.sin(a)*106*r,cc=hsh(i*1.7);if(s.kind==='ore'){f.fillStyle=cc>.6?'#4a3a36':cc>.3?'#6b3d33':'#5a4440';SK.circ(f,px,py,3+cc*2.5);f.fill();f.fillStyle='rgba(255,210,190,.18)';SK.circ(f,px-1,py-1,1.2);f.fill()}else SK.chunk(f,px,py,4+cc*6,hsh(i*3.1),SK.SCRAPC[floor(cc*4.99)%5])}}
 g.drawImage(c.cv,s.x-110,s.y-130,220,260);
 txt(tf(yardT(s))+' t',s.x,s.y+112,10,C.ui,800,'center',3);LOBS.push({x:s.x-26,y:s.y+105,w:52,h:14})}
/* ---- charging: chargeringskasser (SM), skrapkurv (EAF/UHP), Consteel trough with preheat tunnel ---- */
function drawCharge(){const E=E_(),cx=POS.drop.x,cy=POS.drop.y;if(E.ch==='belt'&&era()===5){drawConsteel();return}if(!inView(cx+150,cy,320))return;const fillK=clamp(S.chg/chgCap(),0,1);
 if(E.ch==='conv'){/* converter: one scrap charging box on a rail car between the yard and the vessel */
  SK.rail(g,cx+40,640,cy,26);const fl=F.ch&&F.ch.s>0&&F.ch.t/F.ch.dur>.1&&F.ch.t/F.ch.dur<.5;SK.car(g,cx+84,cy,70,40);
  if(!fl){SK.box(g,cx+56,cy-14,56,28,'#4a5058','#1b1e22',3);const n=Math.round(fillK*8);for(let q=0;q<n;q++)SK.chunk(g,cx+64+(q%4)*13,cy-6+floor(q/4)*11,4,hsh(q),SK.SCRAPC[q%5])}}
 else if(E.ch==='box'){/* box rack + track to the charging machine */SK.rail(g,cx+40,690,cy,26);
  const nb=nBox(),full=S.chg/boxT;for(let i=0;i<min(nb,10);i++){const bx=cx+56+(i%5)*24,by=cy+(i<5?-34:34);const f=clamp(full-i,0,1);SK.box(g,bx-10,by-12,20,24,'#4a5058','#1b1e22',3);if(f>0)for(let k=0;k<Math.ceil(f*4);k++)SK.chunk(g,bx-5+(k%2)*10,by-6+floor(k/2)*12,3.5,hsh(i*4+k),SK.SCRAPC[(i+k)%5]);if(f>.5&&lv('kalk')){g.fillStyle='#e9e4d6';SK.circ(g,bx+4,by-8,2.4);g.fill();SK.circ(g,bx-4,by+6,2);g.fill()}}
  /* chargeringsmaskin on rails, peel reaching into a door */
  const c=F.ch,door=F.smDoor>=0?F.smDoor:1,dy=POS.F.y-60+door*60,k=c?Math.sin(PI*clamp(c.t/c.dur,0,1)):0,mx=lerp(600,664,k),my=lerp(cy,dy,c?1:0);
  SK.railV(g,640,POS.F.y-110,POS.F.y+110,28);SK.box(g,mx-26,my-22,40,44,'#c79a1e','#5a4510',4);SK.hazardBar(g,mx-26,my-22,40,5);g.fillStyle='#55595f';g.fillRect(mx+14,my-4,lerp(10,40,k),8);
  if(c){SK.box(g,mx+18+lerp(10,36,k)-10,my-12,20,24,'#4a5058','#1b1e22',3);for(let q=0;q<4;q++)SK.chunk(g,mx+22+lerp(10,36,k)-10+(q%2)*8,my-6+floor(q/2)*10,3.2,hsh(q),SK.SCRAPC[q])}}
 else if(E.ch==='bucket'){/* two scrap buckets on the charging bay; the crane lifts a full one over the furnace */
  const bt=bucketT();for(let i=0;i<2;i++){const bx=cx+(i?70:0),by=cy+(i?-6:0),f=clamp((S.chg-i*bt)/bt,0,1);SK.shadow(g,bx+3,by+5,30,26,.3);g.fillStyle='#3a3f46';circ(bx,by,28);g.fill();g.strokeStyle='#1b1e22';g.lineWidth=3;circ(bx,by,28);g.stroke();g.fillStyle='#1d1f23';circ(bx,by,22);g.fill();
   for(let k=0;k<Math.round(f*16);k++){const a=hsh(k*3+i)*TAU,r=17*Math.sqrt(hsh(k*7+i));SK.chunk(g,bx+Math.cos(a)*r,by+Math.sin(a)*r,3+hsh(k)*2.5,hsh(k*2),SK.SCRAPC[k%5])}
   g.fillStyle='#55595f';g.fillRect(bx-34,by-5,8,10);g.fillRect(bx+26,by-5,8,10)}
  txt(t_('KURV'),cx,cy+1,10.5,C.ui,800,'center',3)}
 else if(era()===5)drawConsteel();
 else{/* Consteel: open charging section → dynamic seal → preheating tunnel → connecting car */
  const x0=262,x1=POS.F.x-86,y=cy,w=30,T0=494;/* scrap lies from the furnace end back as far as the belt is filled */
  g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x0+2,y-w/2+3,x1-x0,w);g.fillStyle='#575c64';g.fillRect(x0,y-w/2-3,x1-x0,w+6);g.fillStyle='#1d1f23';g.fillRect(x0,y-w/2,x1-x0,w);
  g.save();g.beginPath();g.rect(lerp(x1,x0,clamp(fillK*1.15,0,1)),y-40,x1-x0,80);g.clip();SK.troughDraw(g,x0,x1,y,w,T,x=>x<T0?0:clamp(.06+(x-T0)/(x1-T0)*.55,0,.66));g.restore();
  SK.box(g,T0-30,y-w/2-10,28,w+20,'#2a2d33','#0f1012',3);for(let k=0;k<5;k++){g.fillStyle='rgba(255,255,255,.12)';g.fillRect(T0-26+k*4.6,y-w/2-6,1.6,w+12)}SK.fan(g,T0-16,y-w/2-20,9,T,8);
  g.globalAlpha=.8;SK.box(g,T0,y-w/2-12,x1-T0-12,w+24,'#3a3a3e','#161618',4);g.globalAlpha=1;
  const gr=g.createLinearGradient(T0,0,x1-12,0);gr.addColorStop(0,'rgba(255,90,20,0)');gr.addColorStop(1,'rgba(255,110,30,.42)');g.fillStyle=gr;SK.rr(g,T0,y-w/2-12,x1-T0-12,w+24,4);g.fill();
  g.strokeStyle='rgba(164,85,63,.85)';g.lineWidth=2;SK.rr(g,T0+3,y-w/2-9,x1-T0-18,w+18,3);g.stroke();
  for(let i=0;i<6;i++){const sx=T0+16+i*((x1-T0-44)/5);SK.box(g,sx-3,y-w/2-19,6,8,'#8b939e','#2a2d31',1)}

  const sl=RM?0:Math.sin(T*.6)*2.5;g.strokeStyle='#8b939e';g.lineWidth=3;g.strokeRect(x1-14+sl,y-w/2-5,34,w+10);g.fillStyle='#6b7079';g.fillRect(x1-14+sl,y-w/2-5,34,4);g.fillRect(x1-14+sl,y+w/2+1,34,4)}}
function drawBucketFlight(){if(!F.ch||E_().ch!=='bucket')return;const c=F.ch,k=clamp(c.t/c.dur,0,1),cx=POS.drop.x,cy=POS.drop.y,fx=POS.F.x,fy=POS.F.y,e2=ease(min(1,k*2.2)),bx=lerp(cx+20,fx,e2),by=lerp(cy,fy,e2)-Math.sin(PI*min(1,k*2.2))*30,op=k>.42&&k<.75?(k-.42)/.33:k>=.75?1:0;
 SK.line(g,bx-6,by-40,bx-6,by-26,'#15161a',1.5);SK.line(g,bx+6,by-40,bx+6,by-26,'#15161a',1.5);SK.shadow(g,bx+16,by+24,34,30,.35);
 if(op<.9)for(let q=0;q<12;q++)SK.chunk(g,bx+(hsh(q)-.5)*36,by+(hsh(q*3)-.5)*36+op*16,3.6,hsh(q*2),SK.SCRAPC[q%5]);
 g.fillStyle='#3a3f46';g.beginPath();g.arc(bx-op*14,by,30,PI/2,PI*1.5);g.fill();g.beginPath();g.arc(bx+op*14,by,30,-PI/2,PI/2);g.fill();g.strokeStyle='#e0b020';g.lineWidth=2.5;SK.circ(g,bx,by,32);g.stroke();g.fillStyle='#55595f';g.fillRect(bx-36,by-5,8,10);g.fillRect(bx+28,by-5,8,10)}
const dropRing=()=>padRing(POS.drop.x,POS.drop.y,40,E_().ch==='box'?t_('KASSER'):E_().ch==='bucket'?'':E_().ch==='conv'?t_('SKRAP'):era()===5?t_('SJAKT'):t_('BÅND'),0,S.chg/chgCap(),'#8a5a32');
/* ---- the furnace, per era ---- */
const ROT=PI/2;/* local −x (transformer side) faces up toward the supply zone, tap faces right */
function furnOpts(){const e=era(),A={tap:-PI/2,door:0,car:PI/2,h4:-2.4-ROT,h5:-.9-ROT},melt=F.solid>0&&!F.stop&&!(F.ch&&E_().ch==='bucket');
 const o={a:A,trafo:e>=4?2:1,arc:F.arc*(F.state==='tapping'?0:1),tapping:F.state==='tapping'&&F.tapT>.6,slag:slagOn()&&melt,ductAng:-2.4-ROT,duct:92*1.05,smoke:true};
 if(e===3){o.refr=1;o.spout=1;o.h5=false;o.inj=lv('lans')?[]:[];o.roofOff=F.roof;o.bath=clamp(F.bath/fcap(),.15,1);o.scrapIn=clamp(F.solid/fcap(),0,1)}
 if(e>=4){o.inj=lv('lans')>=2?[-2.0-ROT,-2.7-ROT,2.6-ROT,-1.0-ROT]:[-1.0-ROT];o.kullInj=lv('kull')?0:-1;if(lv('kull'))o.inj=[-2.05-ROT].concat(o.inj);o.roofOff=F.roof;o.foam=lv('kull')>0;o.bath=clamp(F.bath/fcap(),.2,1)}
 if(e===5){o.car=true;o.roofOff=0;o.h4=false}
 return o}
function drawFurnace(){const x=F.x,y=F.y;if(!inView(x,y,260))return;const e=era(),tl=F.tilt;
 if(ET()==='conv'){const E=E_();SK2.converter(g,x,y,convR(),T,{tilt:tl,ld:e===2,blow:F.state==='melt'&&F.solid>0&&!F.stop&&!F.ch?1:0,lance:F.lance,hot:F.bath>0||F.solid>0?clamp(.35+.65*(F.bath+F.solid)/fcap(),0,1):0,tapping:F.state==='tapping'&&F.tapT>.6});drawConvCharge();return}
 if(ET()==='sm'){SK.smFurnace(g,x,y,T,{heat:clamp(.25+.75*F.bath/fcap(),0,1),door:F.ch?F.smDoor:-1,tapping:F.state==='tapping'&&F.tapT>.6,fire:F.state!=='tapping'});return}
 g.save();g.translate(x,y);g.rotate(tl*.25);SK.eaf(g,0,0,92,T,ROT,furnOpts());g.restore()}
/* supply plants (blue zone) and the pipes / belt that feed the furnace; flow animates with real use */
function drawSupply(){if(!inView(800,170,360))return;const u=s=>supCap(s)>0?clamp(rate('s:'+s)/(supCap(s)*60),0,1):0;const lim=F.lim;
 const sp=s=>16+50*u(s);
 /* lime / dolomite: day silos → weigh hoppers → inclined belt to the roof 5th hole */
 if(lv('kalk')){const cols=['#e9e4d6','#c9a98a','#e9e4d6'];const n=min(3,1+floor(lv('kalk')/6));for(let i=0;i<3;i++){const sx=948+i*36;if(i<n){SK.silo(g,sx,86,15,cols[i]);SK.box(g,sx-7,106,14,11,'#3b4048','#17191c',2);g.fillStyle=u('kalk')>.02?'#5fd38d':'#565d67';g.fillRect(sx-4,109,8,3)}}
  const kItems=(g2,L,w2,tt)=>{if(u('kalk')<.01)return;const nn=max(6,floor(L/18));for(let i=0;i<nn;i++){const p=((RM?i/nn:tt*.1*(.4+u('kalk'))*140/L+i/nn)%1)*L;g2.fillStyle=i%2?'#c9a98a':'#e9e4d6';SK.circ(g2,p,(hsh(i)-.5)*w2*.5,1.8);g2.fill()}};
  if(era()===1){/* SM: lime/limestone went into the charging boxes with the scrap — belt to a hopper over the box rack, no roof feed */
   SK.belt(g,960,150,548,150,10,T,{trestle:true,speed:sp('kalk'),items:kItems});SK.belt(g,548,150,548,516,10,T,{trestle:true,speed:sp('kalk'),items:kItems});
   SK.box(g,532,512,32,22,'#3b4048','#17191c',3);g.fillStyle='#e9e4d6';g.fillRect(537,516,22,5)}
  else{const h5=e5();SK.belt(g,984,128,h5.x+4,h5.y-4,10,T,{trestle:true,speed:sp('kalk'),items:kItems})}
  if(lim==='kalk')limTag(928,68,112,56)}
 /* oxygen: LOX tank + vaporisers → pipe → valve skid → hoses/lances */
 if(lv('o2')){const vr=min(8,2+floor(lv('o2')/3));SK.loxTank(g,820,98,30);for(let i=0;i<vr;i++)SK.vaporiser(g,858+(i%4)*19,66+floor(i/4)*19,15,T,i);
  SK.pipe(g,[[848,150],[880,150],[880,218]],6,'#6fa8e8',T,{flow:u('o2')>.01?'#f4fbff':null,speed:sp('o2')});SK.valveSkid(g,858,218,44,34);
  const ip=ET()==='conv'?lanceTop():injPt(-1.0);SK.hose(g,880,252,920,300,ip.x,ip.y,4,'#6fa8e8',T,u('o2')>.01?'#f4fbff':null);
  if(lv('lans')===1){/* door lance manipulator */SK.box(g,ip.x+6,ip.y-26,22,18,'#4a5058','#111',2);SK.line(g,ip.x+16,ip.y-10,ip.x-14,ip.y+14,'#c9ced6',3)}
  if(lim==='o2')limTag(786,56,150,104)}
 /* carbon: silo → blow tank → pneumatic pipe to the injector in the wall */
 if(lv('kull')){SK.silo(g,700,96,30,'#4a4e55');SK.blowTank(g,748,150,13);SK.pipe(g,[[730,96],[748,96],[748,136]],5,'#55595f',T);
  const ip=injPt(-2.05);SK.pipe(g,[[748,164],[748,260],[ip.x-10,ip.y-24],[ip.x,ip.y]],6,'#2b2b2e',T,{flow:u('kull')>.01?'#0a0a0b':null,dash:[2,4],speed:sp('kull')*1.4});
  if(lim==='kull')limTag(666,60,98,108)}}
const e5=()=>({x:POS.F.x+Math.cos(-.9)*92*.55,y:POS.F.y+Math.sin(-.9)*92*.55});
/* the LD lance carriage: where the oxygen hose ends in the converter eras */
const lanceTop=()=>{const R=convR(),[mx,my]=SK2.convPt(F.x,F.y,R,0,1.05);return{x:mx+R*.3,y:my-R*2.5-R*.12}};
const injPt=a=>({x:POS.F.x+Math.cos(a)*92*.9,y:POS.F.y+Math.sin(a)*92*.9});
/* the limiting plant gets a pulsing red outline (the zone chip already names it, so no extra text) */
function limTag(x,y,w,h){const a=RM?1:.55+.45*Math.sin(T*5);g.save();g.globalAlpha=a;g.strokeStyle='#ff6b5a';g.lineWidth=3;g.setLineDash([8,5]);g.lineDashOffset=RM?0:-T*24;SK.rr(g,x-6,y-6,w+12,h+12,10);g.stroke();g.setLineDash([]);g.restore()}
/* slag pot + slag truck, electrode rack, electrode store */
function drawOvnSide(){if(!inView(780,900,320))return;
 if(slagOn()&&era()===5){const x=POS.pot.x,y=POS.pot.y,f=S.pot/potMax();drawCsSlag();txt(t_('SLAGG')+' '+S.pot+'/'+potMax(),x,y+46,10,f>=1?C.danger:f>.6?C.hazard:C.ui,800,'center',3);LOBS.push({x:x-38,y:y+39,w:76,h:14});const sy=POS.slagp;for(let i=0;i<9;i++){const a=i/9*TAU;drawSlag(sy.x+Math.cos(a)*56,sy.y+Math.sin(a)*36,10,i)}}
 else if(slagOn()){const x=POS.pot.x,y=POS.pot.y,f=S.pot/potMax();SK.shadow(g,x+4,y+8,34,28,.35);g.fillStyle='#3a3c40';circ(x,y,30);g.fill();g.strokeStyle='#1b1d20';g.lineWidth=3;circ(x,y,30);g.stroke();
  const gr=g.createRadialGradient(x-6,y-6,2,x,y,24);gr.addColorStop(0,mix('#3a3430','#ffb030',f));gr.addColorStop(1,mix('#2a2420','#c2410c',f));g.fillStyle=gr;circ(x,y,24*(.4+.6*f));g.fill();
  if(f>=1){g.strokeStyle=rgba(C.danger,.6+.4*Math.sin(T*8));g.lineWidth=4;circ(x,y,36);g.stroke()}
  txt(t_('SLAGG')+' '+S.pot+'/'+potMax(),x,y+46,10,f>=1?C.danger:f>.6?C.hazard:C.ui,800,'center',3);LOBS.push({x:x-38,y:y+39,w:76,h:14});
  const sy=POS.slagp;for(let i=0;i<9;i++){const a=i/9*TAU;drawSlag(sy.x+Math.cos(a)*56,sy.y+Math.sin(a)*36,10,i)}
  if(F.SB){const k=F.SB.t/6,p=k<.4?{x:lerp(sy.x,x,ease(k/.4)),y:lerp(sy.y,y+20,ease(k/.4))}:k<.6?{x,y:y+20}:{x:lerp(x,sy.x,ease((k-.6)/.4)),y:lerp(y+20,sy.y,ease((k-.6)/.4))};
   SK.box(g,p.x-26,p.y-18,52,36,'#e0b020','#5a4510',6);g.fillStyle='#16181c';for(const[a,b]of[[-1,-1],[1,-1],[-1,1],[1,1]])g.fillRect(p.x+a*22-4,p.y+b*18-4,8,8);if(k>.4&&k<.85){g.fillStyle='#3a3c40';circ(p.x,p.y,14);g.fill()}}}
 if(isEAF()){const x=POS.rack.x,y=POS.rack.y;g.setLineDash([5,4]);g.strokeStyle='#5b8fd0';g.lineWidth=2;SK.rr(g,x-42,y-28,84,56,8);g.stroke();g.setLineDash([]);SK.box(g,x-34,y-20,68,40,'#2b3038','#141619',4);for(let i=0;i<12;i++){const cx=x-26+(i%6)*10.4,cy=y-8+floor(i/6)*16;g.fillStyle=i<S.elek?'#2a2c31':'rgba(255,255,255,.06)';circ(cx,cy,4.4);g.fill();if(i<S.elek){g.fillStyle='#5a5f68';circ(cx-1,cy-1,1.6);g.fill()}}
  txt(t_('ELEKTRODER')+' '+Math.round(S.elek)+'/12',x,y-30,9.5,S.elek<2?C.danger:C.ui,800,'center',3);LOBS.push({x:x-46,y:y-37,w:92,h:14})}}
function drawStore(s){if(!s.open()||!inView(s.x,s.y,100))return;const x=s.x,y=s.y;
 const W2=s.store==='elek'?116:96;SK.box(g,x-W2/2,y-30,W2,58,'#5a4a36','#2a2016',5);g.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<4;i++)g.fillRect(x-W2/2+4+i*(W2-8)/4,y-26,(W2-8)/4-4,50);
 const n=ST[s.store]|0;for(let i=0;i<min(n,16);i++){const lay=floor(i/8),c=i%8,cx=x-W2/2+16+(c%4)*((W2-32)/3),cy=y-14+floor(c/4)*22-lay*5;drawItem({k:s.kind,kk:i%2},cx,cy,1.05)}
 labFix('st'+s.id,t_(({elek:'ELEKTRODER',kanal:'KANALSTEIN',hette:'HETTEPULVER'})[s.store])+' · '+n,x,y-40,9.5,C.ui)}
/* ---- ladles on the ladle car / under the crane ---- */
function drawLadle(L){if(!inView(L.x,L.y,60))return;const f=L.sm>0?clamp(L.steel/L.sm,0,1):0,car=L.state==='park'||L.state==='filling'||(L.state==='await'&&hyp(L.x-POS.tap.x,L.y-POS.tap.y)<30);
 if(car)SK.car(g,L.x,L.y,66,52);
 const sc=L.state==='carried'?1.12:1;SK.ladle(g,L.x,L.y,26*sc,T,{fill:L.steel>.01?max(.15,f):0,eye:L.state==='lf'||L.state==='cast',rot:L.arm!=null&&L.state!=='carried'?armA(L.arm)-PI/2:0});
 if(L.steel>.05&&L.state!=='filling'){const t=tf(L.steel)+' t';ctx.font=`800 11px ${FONT}`;const w=ctx.measureText(t).width+8;LBL.push({k:'L'+L.i,x:L.x-w/2,y:L.y-50,w,h:16,pr:0,f:(lx,ly)=>txt(t,lx+w/2,ly+8,11,C.moltenhi,800,'center',3)})}}
function drawLF(){if(!B_('lf')||!inView(POS.lf.x,POS.lf.y,200))return;const cx=POS.lf.x,cy=POS.lf.y,L=LADLES.find(l=>l.state==='lf'),R=44;
 SK.rail(g,cx-70,cx+70,cy,40);
 /* alloy bins → weigh hopper → chute into the roof */
 const bins=['#8a8f99','#c9ced6','#6f747c','#2b2b2e','#dfe3e8','#b8b0a0'];const nb=2+min(4,floor(lv('lfq')/3));for(let i=0;i<nb;i++)SK.box(g,cx-70+i*24,POS.bins.y-26,20,20,bins[i],'rgba(0,0,0,.5)',2);
 SK.box(g,cx-12,POS.bins.y+6,24,14,'#3b4048','#17191c',2);SK.pipe(g,[[cx,POS.bins.y+20],[cx,cy-R*.62-10],[cx-8,cy-R*.62]],5,'#8a8f96',T);
 if(L)SK.parts(6,1.4,8,T,(f,a)=>{g.fillStyle=bins[floor(a*nb*.99)];SK.circ(g,cx,lerp(POS.bins.y+20,cy-R*.62,f),1.8);g.fill()});
 if(L)drawLadle(L);
 SK.shadow(g,cx+4,cy+6,R,R*.9,.3);g.fillStyle='#5c6f84';SK.circ(g,cx,cy,R);g.fill();[.92,.78,.64].forEach(r=>{g.strokeStyle='rgba(170,190,210,.55)';g.lineWidth=2;SK.circ(g,cx,cy,R*r);g.stroke()});
 g.fillStyle='#bfae92';SK.circ(g,cx,cy,R*.34);g.fill();
 if(L){const fl=RM?.7:.5+.5*Math.abs(Math.sin(T*17));const gr=g.createRadialGradient(cx,cy,0,cx,cy,R*.4);gr.addColorStop(0,`rgba(240,244,255,${.6+.35*fl})`);gr.addColorStop(.6,'rgba(255,140,40,.3)');gr.addColorStop(1,'rgba(255,120,30,0)');g.fillStyle=gr;SK.circ(g,cx,cy,R*.42);g.fill()}
 const E=[[cx-R*.15,cy],[cx+R*.08,cy-R*.13],[cx+R*.08,cy+R*.13]];E.forEach(e=>{g.fillStyle='#c27a3e';SK.circ(g,e[0],e[1],4.6);g.fill();g.fillStyle='#1d1e22';SK.circ(g,e[0],e[1],3.4);g.fill()});
 /* wire feeder spools */
 for(let i=0;i<2;i++){const x=cx+R+22,y=cy-18+i*36;g.fillStyle='#2a2d33';SK.circ(g,x,y,11);g.fill();g.strokeStyle='#8b939e';g.lineWidth=1;for(let k=1;k<3;k++){SK.circ(g,x,y,k*4);g.stroke()}const a=RM?0:T*(L?3:0)+i;SK.line(g,x,y,x+Math.cos(a)*10,y+Math.sin(a)*10,'#f5c518',1.5)}}
/* ---- blokkstøping: bottom plate with up to 12 moulds around the trumpet, runners under the plate ---- */
const MOULD=[];{const xs=[-88,-50,50,88],ys=[-52,0,52];for(const y of ys)for(const x of xs)MOULD.push([x,y])}MOULD.sort((a,b)=>hyp(a[0],a[1])-hyp(b[0],b[1]));
function drawPit(){const p=POS.pit;if(!inView(p.x,p.y,200))return;const PW_=240,PH=168,x0=p.x-PW_/2,y0=p.y-PH/2;
 SK.shadow(g,p.x+4,p.y+6,PW_*.52,PH*.52,.3);SK.box(g,x0,y0,PW_,PH,'#565b62','#2a2d31',6);g.strokeStyle='rgba(0,0,0,.18)';g.lineWidth=1;for(let x=x0+14;x<x0+PW_;x+=22){g.beginPath();g.moveTo(x,y0+3);g.lineTo(x,y0+PH-3);g.stroke()}
 const st=PIT.state,n=PIT.n,pour=st==='pour',f=PIT.fill,pt=pitTimes(),solidK=st==='solid'?PIT.t/pt.solid:st==='strip'?1:0;
 const hotK=st==='pour'?1:st==='solid'?1-solidK*.5:st==='strip'?.5-.3*min(1,PIT.t/pt.strip):0,lift=st==='strip'?ease(min(1,PIT.t/(pt.strip*.7))):0;
 for(let i=0;i<n;i++){const m=MOULD[i];g.strokeStyle='#2a2b2f';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+m[0],p.y+m[1]);g.stroke();
  if(pour||hotK>0){g.strokeStyle=heat(pour?.9*min(1,f*3):hotK*.8);g.lineWidth=3.2;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(p.x+m[0]*(pour?min(1,f*3):1),p.y+m[1]*(pour?min(1,f*3):1));g.stroke()}g.lineCap='butt'}
 g.fillStyle='#4b4f56';circ(p.x,p.y,13);g.fill();g.fillStyle='#b06a3a';circ(p.x,p.y,9);g.fill();g.fillStyle=pour?heat(.95):'#1a1512';circ(p.x,p.y,5.5);g.fill();
 for(let i=0;i<MOULD.length&&i<slotsMax();i++){const m=MOULD[i],mx=p.x+m[0],my=p.y+m[1];
  if(i<n){if(lift>0){SK.ingot(g,mx,my,11,hotK*.9);g.globalAlpha=1-lift*.9}SK.mould(g,mx,my-lift*30,17,st==='pour'?f:st==='idle'||st==='prep'?0:1,hotK);g.globalAlpha=1;
   if(st==='solid')SK.parts(4,1.8,i*9+3,T,(ff,a,b)=>{g.fillStyle=`rgba(255,${200+50*a|0},120,${(1-ff)*.9})`;SK.circ(g,mx+(a-.5)*14,my+(b-.5)*14,.8+1.2*(1-ff));g.fill()})}
  else if(i<n+S.kok.slots)SK.mould(g,mx,my,17,0,0);
  else{g.strokeStyle='rgba(244,241,234,.2)';g.setLineDash([3,3]);g.lineWidth=1.5;g.strokeRect(mx-15,my-15,30,30);g.setLineDash([])}}
 if(st==='prep'){const k=PIT.t/PIT.dur;txt(t_(PIT.kanal?'Kanalstein klar':'Murer kanaler …'),p.x,y0+PH+12,10,C.ui,700,'center',3);g.fillStyle='#262a32';g.fillRect(p.x-30,y0+PH+20,60,4);g.fillStyle=C.hazard;g.fillRect(p.x-30,y0+PH+20,60*k,4)}
 if(st==='strip'){const k=lift;g.fillStyle='#3a3f47';g.fillRect(x0-10,y0-20-k*30,PW_+20,10);g.fillStyle=C.hazard;g.fillRect(x0-10,y0-20-k*30,PW_+20,3)}
 if(PIT.state==='idle'&&LADLES.some(l=>l.state==='pit')&&S.kok.slots<1)txt(t_('Mangler kokiller!'),p.x,y0+PH+12,11,C.danger,800,'center',3)}
function drawKok(){const p=POS.koklag;if(inView(p.x,p.y,90)){SK.box(g,p.x-60,p.y-30,120,64,'#3a3e45','#16181c',5);const nr=min(S.kok.ready,12),cool=S.kok.cool,nc=min(cool.length,6);
  for(let i=0;i<nr;i++)SK.mould(g,p.x-46+(i%6)*18.4,p.y-16+floor(i/6)*18,7.5,0,0,{top:false});
  for(let i=0;i<nc;i++)SK.mould(g,p.x-46+(i%6)*18.4,p.y+20,7.5,.8,clamp(cool[i]/coolT(),0,1)*.7,{top:false});
  labFix('koklag',t_('KOKILLER · {0} klare',S.kok.ready)+(cool.length?' · '+t_('{0} kjøles',cool.length):''),p.x,p.y-42,9.5,C.ui)}
 const k=POS.kokv;if(inView(k.x,k.y,70)&&S.kok.hot){const n=min(S.kok.hot,12);for(let i=0;i<n;i++)SK.mould(g,k.x-30+(i%4)*20,k.y-12+floor(i/4)*16,7.5,.8,.75,{top:false});labFix('kokv',t_('{0} varme',S.kok.hot),k.x,k.y+40,10,C.molten)}}
/* ---- stranggjuting, top-down: ladle turret → tundish on its car → copper moulds → spray chamber → withdrawal/straightener → torch/shear → run-out → cooling bed ---- */
const TD={x0:1420,x1:1460,y0:670,y1:986},MCX=1474,PBX=1436,WSX=1542;/* tundish shell, mould centre x, shroud impact x, withdrawal units */
const castV=()=>110*(1+.1*lv('caster'));
/* butterfly turret: concrete plinth, slewing ring, two forked lifting arms (the ladles are drawn on top by the ladle pass) */
function drawTurret(){const x=TUR.x,y=TUR.y,R=TUR.R,two=lv('turret')>0;
 SK.shadow(g,x+4,y+6,34,31,.32);g.fillStyle='#4a4e55';circ(x,y,32);g.fill();g.strokeStyle='#2a2c30';g.lineWidth=2;circ(x,y,32);g.stroke();
 g.fillStyle='#24272c';for(let i=0;i<8;i++){const a=i/8*TAU+PI/8;circ(x+Math.cos(a)*28,y+Math.sin(a)*28,1.7);g.fill()}
 g.strokeStyle='#8b939e';g.lineWidth=3.2;circ(x,y,23);g.stroke();
 g.strokeStyle='#4e535b';g.lineWidth=1.3;g.beginPath();for(let i=0;i<28;i++){const a=CAST.ang+i/28*TAU;g.moveTo(x+Math.cos(a)*20.5,y+Math.sin(a)*20.5);g.lineTo(x+Math.cos(a)*25.6,y+Math.sin(a)*25.6)}g.stroke();
 g.lineCap='round';g.lineJoin='round';
 for(let s=0;s<2;s++){const a=armA(s),ca=Math.cos(a),sa=Math.sin(a),P=(d,p)=>[x+ca*d-sa*p,y+sa*d+ca*p],live=two||s===CAST.arm;
  const pth=()=>{g.beginPath();let q=P(R,-31);g.moveTo(q[0],q[1]);q=P(15,-31);g.lineTo(q[0],q[1]);q=P(15,31);g.lineTo(q[0],q[1]);q=P(R,31);g.lineTo(q[0],q[1])};
  /* lifting cylinder from the column to the fork */const c0=P(4,0),c1=P(17,0);SK.line(g,c0[0],c0[1],c1[0],c1[1],'#2a2d31',9);SK.line(g,c0[0],c0[1],c1[0],c1[1],'#9aa2ad',4);
  pth();g.strokeStyle=live?'#5a4510':'#2c2a26';g.lineWidth=9;g.stroke();pth();g.strokeStyle=live?'#c79a1e':'#6b6556';g.lineWidth=5.5;g.stroke();
  for(const p of[-31,31]){const q=P(R,p);g.fillStyle='#1d1f23';circ(q[0],q[1],4.6);g.fill();g.fillStyle=live?'#8b939e':'#4a4e55';circ(q[0],q[1],2.2);g.fill()}
  if(!live){/* parked arm: locking pin, no ladle position until the turret upgrade */const q=P(15,0);g.fillStyle='#d24b3a';circ(q[0],q[1],3);g.fill()}}
 g.lineCap='butt';g.lineJoin='miter';
 g.fillStyle='#3b4048';circ(x,y,13);g.fill();g.strokeStyle=C.hazard;g.lineWidth=2.4;g.setLineDash([4,3]);g.lineDashOffset=-CAST.ang*13;circ(x,y,11.5);g.stroke();g.setLineDash([]);
 g.fillStyle='#6b7079';circ(x,y,5);g.fill()}
/* tundish ("fordeler"): refractory-lined trough with lid on a car on rails; pouring box with dams at the shroud, a stopper per strand, overflow box */
function drawTundish(n){const{x0,x1,y0,y1}=TD,lev=CAST.tlev,py=TUR.y,w=x1-x0,fl=RM?.8:.75+.25*Math.sin(T*9);
 for(const rx of[x0+5,x1-5]){g.fillStyle='#24272c';g.fillRect(rx-2.5,y0-34,5,y1-y0+56);g.fillStyle='#9aa2ad';g.fillRect(rx-1,y0-34,2,y1-y0+56)}
 /* car frame and wheels at both ends */
 for(const by of[y0-10,y1+2]){SK.box(g,x0-7,by,w+14,9,'#3d434b','#15171a',2);g.fillStyle='#15171a';for(const rx of[x0+5,x1-5])g.fillRect(rx-3,by-3,6,15)}
 /* overflow / emergency box at the north end */
 SK.box(g,x0+4,y0-32,w-8,18,'#4a3a30','#1b1612',3);g.fillStyle='#2a1d18';g.fillRect(x0+8,y0-28,w-16,10);g.fillStyle='#7a5a48';g.fillRect(x0+w/2-3,y0-16,6,8);
 SK.shadow(g,x0+w/2+4,(y0+y1)/2+6,w/2+4,(y1-y0)/2+2,.3);
 SK.box(g,x0,y0,w,y1-y0,'#5d6168','#1d2024',5);g.fillStyle='#8a6450';SK.rr(g,x0+2.5,y0+2.5,w-5,y1-y0-5,4);g.fill();
 /* lid in sections, lifting lugs on the shell */
 g.fillStyle='#454a52';SK.rr(g,x0+4.5,y0+4.5,w-9,y1-y0-9,3);g.fill();g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1;
 for(let yy=y0+80;yy<y1-20;yy+=80){g.beginPath();g.moveTo(x0+5,yy);g.lineTo(x1-5,yy);g.stroke()}
 if(lev>.05){g.strokeStyle=rgba('#ff8a20',.25+.4*lev*fl);g.lineWidth=1.2;g.beginPath();for(let yy=y0+80;yy<y1-20;yy+=80){g.moveTo(x0+8,yy+1.2);g.lineTo(x1-8,yy+1.2)}g.stroke()}
 g.fillStyle='#2a2d31';for(let yy=y0+40;yy<y1;yy+=80){g.fillRect(x0-3,yy-4,3,8);g.fillRect(x1,yy-4,3,8)}
 /* pouring box: lid opening at the shroud, impact pad and two dams that calm the flow */
 const ox=x0+6,ow=20,oy=py-16,oh=32;g.fillStyle='#2a1d18';g.fillRect(ox,oy,ow,oh);
 if(lev>.02){g.fillStyle=heat(.55+.4*lev*fl);g.globalAlpha=.35+.65*lev;g.fillRect(ox+1,oy+1,ow-2,oh-2);g.globalAlpha=1}
 g.fillStyle='#c9b08a';g.fillRect(ox,oy-2,ow,3);g.fillRect(ox,oy+oh-1,ow,3);
 g.strokeStyle='rgba(60,40,30,.8)';g.lineWidth=1.4;g.strokeRect(PBX-6,py-6,12,12);
 /* one nozzle per strand: stopper rod on a lever + mechanism at the inside edge; unused nozzles are plugged */
 for(let i=0;i<8;i++){const y=SY(i),nx=x1-8,dn=y>py?1:-1;
  if(i<n){g.fillStyle='#2a1d18';circ(nx,y,5);g.fill();if(lev>.02){g.fillStyle=heat(.6+.38*lev*fl);g.globalAlpha=.4+.6*lev;circ(nx,y,4.2);g.fill();g.globalAlpha=1}
   SK.line(g,nx,y,x0+9,y+7*dn,'#1d1f23',2.6);SK.line(g,nx,y,x0+9,y+7*dn,'#9aa2ad',1.2);SK.box(g,x0+5,dn>0?y+3:y-12,8,9,'#3d4756','#14171c',2);g.fillStyle='#d24b3a';g.fillRect(x0+6.5,dn>0?y+4.5:y-10.5,2,2);
   g.fillStyle='#2a2c30';circ(nx,y,2.6);g.fill();g.fillStyle='#8b939e';circ(nx-.7,y-.7,1);g.fill()}
  else{g.fillStyle='#5a5f66';circ(nx,y,4);g.fill();g.strokeStyle='#2a2d31';g.lineWidth=1;circ(nx,y,4);g.stroke()}}}
/* ladle shroud: a ceramic tube from the ladle's slide gate into the pouring box. While attached it is drawn after the ladles
   (it hangs under the gate); otherwise the manipulator holds it parked beside the tundish (drawn in drawCaster). */
const SHM={x:1404,y:902};
function gatePt(L){const a=armA(L.arm==null?CAST.arm:L.arm)-PI/2,c=Math.cos(a),s=Math.sin(a);return[L.x+c*17-s*16,L.y+s*17+c*16]}
function drawShroud(){if(!B_('strang')||!inView(TD.x0,TUR.y,140))return;const Lc=LADLES.find(l=>l.state==='cast');if(!Lc||CAST.rf<1)return;
 const top=gatePt(Lc),bot=[PBX,TUR.y];g.lineCap='round';SK.line(g,top[0],top[1],bot[0],bot[1],'#3a3e45',7.5);SK.line(g,top[0],top[1],bot[0],bot[1],'#ddd8cc',4.6);g.lineCap='butt';
 g.fillStyle='#6b7079';circ(top[0],top[1],4.2);g.fill();g.fillStyle='#2a2d31';circ(bot[0],bot[1],4.4);g.fill();
 if(CAST.pour){g.fillStyle=`rgba(255,${210+35*(RM?.5:Math.sin(T*11))|0},120,.95)`;circ(bot[0],bot[1],2.8);g.fill()}}
function drawShroudPark(){const on=LADLES.some(l=>l.state==='cast')&&CAST.rf>=1,x=SHM.x,y=SHM.y;
 SK.shadow(g,x+2,y+3,8,7,.3);g.fillStyle='#2a2d31';circ(x,y,6);g.fill();g.fillStyle='#c79a1e';circ(x,y,3);g.fill();
 if(on){SK.line(g,x,y,x+12,y-10,'#1d1f23',4);SK.line(g,x,y,x+12,y-10,'#c79a1e',2);return}
 SK.line(g,x,y,x-9,y-7,'#1d1f23',4);SK.line(g,x,y,x-9,y-7,'#c79a1e',2);/* parked shroud in the manipulator fork, collar up */g.lineCap='round';SK.line(g,x-11,y-8,x-15,y+14,'#3a3e45',8);SK.line(g,x-11,y-8,x-15,y+14,'#cfc6b4',5);g.lineCap='butt';g.fillStyle='#6b7079';circ(x-11,y-8,4);g.fill();g.fillStyle='#2a2d31';circ(x-11,y-8,2);g.fill()}
function drawCaster(){if(!B_('strang')||!inView(1540,830,320))return;const n=nStr(),flow=CAST.flow,cx=CUTX(),v=castV(),osc=RM?0:Math.sin(T*TAU*2.2);
 /* floor: run-out table bed, spray chamber pit, cooling bed */
 g.fillStyle='#1d2025';g.fillRect(1488,TD.y0-6,52,TD.y1-TD.y0+12);
 g.fillStyle='#2a2d33';g.fillRect(1568,TD.y0+2,84,TD.y1-TD.y0-4);
 SK.box(g,1652,668,110,326,'#30343b','#15171a',4);
 const step=RM?0:Math.sin(T*2.4)*2.5;/* walking-beam cooling bed: fixed and moving notched rails */
 g.strokeStyle='#565c65';g.lineWidth=2;g.beginPath();for(let r=0;r<6;r++){const xx=1662+r*18,dy=r%2?step:0;g.moveTo(xx,674+dy);for(let yy=674;yy<988;yy+=10){g.lineTo(xx+3,yy+5+dy);g.lineTo(xx,yy+10+dy)}}g.stroke();
 drawTurret();drawTundish(n);drawShroudPark();
 /* mould water manifold along the mould row */
 g.fillStyle='#2f5f8a';g.fillRect(TD.x1+1,TD.y0+4,3,TD.y1-TD.y0-8);
 /* the strand glow: one gradient from the mould exit to the cutter, shared by all strands */
 let sg=null;if(flow){sg=g.createLinearGradient(MCX+11,0,cx,0);sg.addColorStop(0,heat(.97));sg.addColorStop(.3,heat(.8));sg.addColorStop(.62,heat(.66));sg.addColorStop(1,heat(.56))}
 const off=RM?0:(T*v)%9;
 for(let i=0;i<8;i++){const y=SY(i),on=i<n;
  if(!on){/* not bought yet: covered mould position, bare floor */SK.box(g,MCX-11,y-11,22,22,'#2a2d33','#15171a',3);g.strokeStyle='rgba(255,255,255,.08)';g.lineWidth=1;g.beginPath();g.moveTo(MCX-7,y-7);g.lineTo(MCX+7,y+7);g.moveTo(MCX+7,y-7);g.lineTo(MCX-7,y+7);g.stroke();
   SK.box(g,WSX,y-12,26,24,'#24272c',null,3);continue}
  /* run-out rollers */
  for(let rx=1572;rx<1650;rx+=10){g.fillStyle='#4f555e';g.fillRect(rx,y-8,4,16);g.fillStyle='rgba(255,255,255,.14)';g.fillRect(rx,y-8,1.4,16)}
  /* strand from the mould through the spray chamber to the cutter, with moving oscillation marks */
  if(flow){g.fillStyle=sg;g.fillRect(MCX+10,y-4.5,cx-MCX-10,9);g.fillStyle='rgba(60,20,10,.1)';for(let xx=1540+off;xx<cx;xx+=9)g.fillRect(xx,y-4.5,1,9);g.fillStyle='rgba(255,255,255,.12)';g.fillRect(MCX+10,y-4.5,cx-MCX-10,2)}
  /* copper mould tube in its water jacket on the oscillating table */
  const o=osc*.7;SK.box(g,MCX-11,y-11+o*.4,22,22,'#3d4756','#14171c',3);g.fillStyle='#b87333';g.fillRect(MCX-7-o*.3,y-7-o*.3,14+o*.6,14+o*.6);g.fillStyle='#e0a070';g.fillRect(MCX-7-o*.3,y-7-o*.3,14+o*.6,2);
  g.fillStyle=flow?heat(.9+.08*(RM?.5:Math.sin(T*13+i))):'#2a1a14';g.fillRect(MCX-4.5,y-4.5,9,9);
  g.fillStyle='#6fa8e8';g.fillRect(MCX-11,y-3,2.5,6);
  if(flow&&CAST.tlev>.02){/* open stream from the metering nozzle into the mould */g.strokeStyle='rgba(255,236,170,.95)';g.lineWidth=2;g.beginPath();g.moveTo(TD.x1-8,y);g.lineTo(MCX,y);g.stroke()}
  /* withdrawal & straightening unit: two driven roll pairs, drive motor below */
  SK.box(g,WSX,y-13,26,5,'#3d4756','#14171c',2);SK.box(g,WSX,y+8,26,5,'#3d4756','#14171c',2);
  for(const rx of[WSX+6,WSX+19]){g.fillStyle='#8b939e';g.fillRect(rx-3,y-8,6,16);g.fillStyle='rgba(0,0,0,.35)';const k=flow&&!RM?((T*v*.25)%4):0;g.fillRect(rx-3,y-8+k*4,6,1.5);g.fillRect(rx-3,y-8+((k*4+8)%16),6,1.5)}
  SK.box(g,WSX+7,y+13,12,6,'#2f5f8a','#14171c',1.5)}
 /* spray chamber: header pipes across the strands with spray fans, steam rising from the cooling water */
 g.fillStyle='#3d434b';g.fillRect(1488,TD.y0-8,52,5);g.fillRect(1488,TD.y1+3,52,5);
 /* water manifolds at both ends, spray headers along each strand with nozzles aimed at it */
 g.fillStyle='#2f5f8a';g.fillRect(1488,TD.y0-4,3,TD.y1-TD.y0+8);g.fillRect(1537,TD.y0-4,3,TD.y1-TD.y0+8);
 for(let i=0;i<n;i++){const y=SY(i);g.fillStyle='#3a6f9e';g.fillRect(1490,y-10,48,2);g.fillRect(1490,y+8,48,2);
  if(flow){g.fillStyle='rgba(190,225,255,.3)';g.beginPath();for(let hx=1496;hx<1536;hx+=12){g.moveTo(hx,y-8);g.lineTo(hx-3,y-4.5);g.lineTo(hx+3,y-4.5);g.closePath();g.moveTo(hx,y+8);g.lineTo(hx-3,y+4.5);g.lineTo(hx+3,y+4.5);g.closePath()}g.fill()}}
 if(flow){if(RM){g.fillStyle='rgba(235,240,245,.18)';for(let i=0;i<n;i++){SK.circ(g,1508,SY(i)-14,9);g.fill()}}
  else SK.parts(10+n*2,.55,9,T,(f,a,b)=>{const y=SY(floor(b*n*.999));g.fillStyle=`rgba(235,240,245,${.3*(1-f)})`;SK.circ(g,1492+a*44+f*6,y-6-f*20,3+f*9);g.fill()})}
 /* billets: cut pieces on the run-out; when the strand has stopped, the uncut tails */
 for(const r of CAST.run){if(r.x>cx)SK.billetBar(g,r.x-40,SY(r.lane),40,9,.5);else if(!flow)SK.billetBar(g,max(MCX+12,r.x-40),SY(r.lane),min(40,r.x-MCX-12),9,.55)}
 /* cooling bed: billets walk across and cool from orange to grey */
 for(const b of CAST.bed){const k=b.it.hot?clamp(.62-(b.va||0)*.055,.07,.62):.07;SK.billetBar(g,1658,b.y,98,7,k)}
 /* cutters: hydraulic shear (old) or torch cutting machine (upgrade) */
 for(let i=0;i<n;i++){const y=SY(i),cut=CAST.cut.find(c=>c.lane===i),ph=cut?cut.t/.6:0,bx=cx;
  if(!lv('torch')){SK.box(g,bx-9,y-16,18,32,'#6b6f76','#1d1f23',2);SK.hazardBar(g,bx-9,y-16,18,4);g.fillStyle='#2a2c30';g.fillRect(bx-1.5,y-11,3,22);if(cut&&ph<.3){g.fillStyle=`rgba(255,250,220,${1-ph/.3})`;g.fillRect(bx-3,y-10,6,20)}}
  else{const carX=bx-6+(cut?ph*10:0);g.fillStyle='#6d6358';g.fillRect(bx-22,y-15,44,1.6);g.fillRect(bx-22,y+13.5,44,1.6);
   SK.box(g,carX-6,y-16,12,32,'#4a5058','#1b1e22',2);SK.hazardBar(g,carX-6,y-16,12,3);SK.line(g,carX-3,y-16,carX-3,y-21,'#d24b3a',1.4);SK.line(g,carX+2,y-16,carX+2,y-21,'#3a8fd0',1.4);
   if(cut&&ph<.8){const ny=lerp(y-6,y+6,ph/.8);g.fillStyle='#b87333';circ(carX+6,ny,2.4);g.fill();if(!RM)SK.parts(10,3,i*7,T,(ff,a,b)=>{g.fillStyle=`rgba(255,${190+60*a|0},${90+80*b|0},${1-ff})`;SK.circ(g,carX+6+(a-.3)*10*ff,ny+ff*16,1+1.2*(1-ff));g.fill()})}
   else{g.fillStyle='#b87333';circ(carX+6,y-6,2);g.fill()}}}}
/* ---- downstream stations ---- */
function nodeQ(id){const n=NODE[id];return n.in.length+(n.cur?1:0)}
function drawGjv(){if(!B_('vv')||!inView(POS.gjv.x,POS.gjv.y,200))return;const x0=2035,x1=2275,y0=520,h=160,walk=lv('bjelke')>0,fl=i=>RM?.7:.5+.5*Math.sin(T*9+i*1.7),busy=!!NODE.gjv.cur;
 SK.shadow(g,(x0+x1)/2+4,y0+h/2+5,(x1-x0)/2+6,h/2+4,.3);SK.box(g,x0-6,y0-6,x1-x0+12,h+12,'#5a5f66','#1c1e22',5);SK.box(g,x0,y0,x1-x0,h,'#2a1d18',null,3);
 for(let i=0;i<10;i++){const bx=x0+12+i*24;[y0-3,y0+h+3].forEach(by=>{g.fillStyle=`rgba(255,${120+80*fl(i)|0},40,${busy?.5+.4*fl(i+2):.25})`;SK.circ(g,bx,by,2.4);g.fill()})}
 const q=min(14,nodeQ('gjv')),n=NODE.gjv,pp=n.cur?n.p:0;
 if(walk){const P=1.8,st=RM?0:T/P,f=st-floor(st),up=f<.25?ease(f/.25):f<.6?1:f<.8?1-ease((f-.6)/.2):0;g.fillStyle='rgba(120,130,140,.35)';for(let r=0;r<3;r++)g.fillRect(x0+4,y0+24+r*48-(up*2),x1-x0-8,3)}
 for(let i=0;i<q;i++){const x=x1-14-i*16-(walk?0:pp*6);if(x<x0+4)break;g.fillStyle=SK.heat(clamp((x-x0)/(x1-x0)*.9+.05,0,1));g.fillRect(x,y0+10,8,h-20)}
 if(!walk&&q){const rx=x0-40+pp*8;SK.box(g,rx,y0+h/2-8,30,16,'#4a5058','#111',2)}
 const sp=RM?.6:max(0,Math.sin(T*3));if(busy)SK.parts(8,2.5,y0,T,(f,a)=>{g.fillStyle=`rgba(160,210,255,${.7*(1-f)*sp})`;SK.circ(g,x1+8+f*14,y0+h/2+(a-.5)*30*f,1.5);g.fill()})}
const STANDS=[[2330,'H'],[2366,'V'],[2402,'H'],[2448,'V'],[2484,'H'],[2540,'H'],[2576,'V'],[2612,'H']];
function drawVV(){if(!B_('vv')||!inView(2600,600,320))return;const y=600,n=NODE.vv,busy=!!n.cur,loop=RM?12:12+6*Math.sin(T*2.2);
 g.fillStyle='#2a2d33';g.fillRect(2310,y-10,320,20);
 if(busy){g.lineCap='round';const xs=[2296].concat(STANDS.map(a=>a[0])).concat([2640]);for(let i=0;i<xs.length-1;i++){const a=xs[i],b=xs[i+1],w=max(1.6,7-i*.7);g.beginPath();g.moveTo(a,y);if(a===2484){g.lineTo(2498,y);g.bezierCurveTo(2508,y,2510,y+loop,2512,y+loop);g.bezierCurveTo(2522,y+loop,2526,y,2540,y)}else g.lineTo(b,y);g.strokeStyle=SK.heat(.84-i*.01);g.lineWidth=w;g.stroke()}g.lineCap='butt'}
 STANDS.forEach(([x,k])=>{if(k==='H'){SK.line(g,x,y+30,x,y+52,'#5b616a',3);SK.box(g,x-11,y+50,22,20,'#3d4756','#14171c',3)}else{SK.line(g,x,y-30,x,y-52,'#5b616a',3);SK.box(g,x-11,y-70,22,20,'#3d4756','#14171c',3)}
  const hw=k==='H'?30:15;SK.shadow(g,x+3,y+4,13,hw+4,.3);SK.box(g,x-10,y-hw,20,hw*2,'#6b7079','#1d2024',3);if(k==='H'){g.fillStyle='#b9c1cb';g.fillRect(x-4,y-hw+5,8,hw*2-10)}else{g.fillStyle='#b9c1cb';SK.circ(g,x,y-7,5.5);g.fill();SK.circ(g,x,y+7,5.5);g.fill()}});
 /* cooling bed with notched rakes */
 SK.box(g,2650,420,236,362,'#2e3238','#15171a',4);for(let x=2662;x<2880;x+=18){g.fillStyle='#4b5058';g.fillRect(x,424,3,354)}
 const fl=rate('o:vv'),P=1.2,st=RM||fl<.01?0:T/P,f=st-floor(st),lift=f<.4?ease(f/.4):1,nb=min(18,Math.round(Math.sqrt(fl)*3)+(busy?3:0));
 for(let r=0;r<nb;r++){const yy=770-(r+lift)*19;if(yy<430)continue;g.fillStyle=SK.heat(clamp(.7-r*.04,.1,1));g.fillRect(2656,yy-1.6,224,3.2)}}
function drawTC(){if(!B_('tc')||!inView(POS.tc.x,POS.tc.y,160))return;const y=600,busy=!!NODE.tc.cur;
 if(busy)for(let x=2930;x<3126;x+=2){const k=x<2960?.8:x<3060?lerp(.8,.12,clamp((x-2960)/30,0,1)):lerp(.12,.42,clamp((x-3060)/60,0,1));g.fillStyle=SK.heat(k);g.fillRect(x,y-3,2.4,6)}
 SK.shadow(g,3010,y+6,70,30,.3);SK.box(g,2950,y-26,120,52,'#3d4756','#14171c',5);g.fillStyle='rgba(58,143,208,.5)';g.fillRect(2954,y-22,112,44);
 for(let i=0;i<8;i++)for(let j=0;j<2;j++){g.fillStyle='#9cc8ff';SK.circ(g,2962+i*14,y-14+j*28,2.2);g.fill()}
 if(busy)SK.parts(14,.35,6,T,(f,a)=>{g.fillStyle=`rgba(230,236,242,${.36*(1-f)})`;SK.circ(g,2960+a*100-f*20,y-30-f*42,5+f*12);g.fill()})}
function drawStel(){if(!B_('stel')||!inView(POS.stel.x+150,150,360))return;const y=150,busy=!!NODE.stel.cur;
 g.fillStyle=busy?SK.heat(.8):'#3a2018';g.fillRect(2622,y-2,60,4);SK.box(g,2630,y-16,48,32,'#3d4756','#14171c',4);for(let i=0;i<6;i++){g.strokeStyle='#8b939e';g.lineWidth=2;g.beginPath();g.moveTo(2636+i*7,y-10);g.lineTo(2640+i*7,y+10);g.stroke()}
 g.fillStyle=busy?SK.heat(.7):'#3a2018';g.fillRect(2678,y-1.5,70,3);SK.box(g,2690,y-12,44,24,'#2f5f8a','#14171c',4);g.fillStyle='rgba(160,210,255,.4)';g.fillRect(2694,y-8,36,16);
 SK.box(g,2800,y-40,200,80,'#2a2d33','#111',4);for(let i=0;i<5;i++)SK.fan(g,2822+i*40,y,12,T,lv('stelmor')?12:6);
 g.save();g.beginPath();g.rect(2802,y-40,196,80);g.clip();if(busy){const off=RM?0:(T*14)%5;for(let i=-2;i<42;i++){const x=2800+i*5+off;const k=clamp(.62-(x-2800)/200*.55,.08,1);g.strokeStyle=SK.heat(k);g.lineWidth=1.6;SK.ell(g,x,y,22,34,0);g.stroke()}}g.restore();
 SK.shadow(g,2774,y+4,22,22,.3);g.fillStyle='#4a5058';SK.circ(g,2772,y,21);g.fill();const a0=RM?0:T*14*(busy?1:0);g.strokeStyle=busy?SK.heat(.75):'#5a3a2a';g.lineWidth=2.4;g.beginPath();for(let s=0;s<=1;s+=.04){const a=a0+s*TAU*1.5,r=4+s*14;s?g.lineTo(2772+Math.cos(a)*r,y+Math.sin(a)*r):g.moveTo(2772+Math.cos(a)*r,y+Math.sin(a)*r)}g.stroke();
 g.fillStyle='#3a3f46';SK.circ(g,3040,y,22);g.fill();g.strokeStyle='#8b939e';g.lineWidth=1.5;SK.circ(g,3040,y,22);g.stroke()}
function drawNett(){if(!B_('nett')||!inView(POS.nett.x,POS.nett.y,200))return;const busy=!!NODE.nett.cur,P=.9,st=RM?.5:T/P,f=st-floor(st),adv=busy?(f<.35?ease(f/.35):1):0,step=16,off=busy?(floor(st)%1000+adv)*step:0;
 const ys=[];for(let i=0;i<8;i++)ys.push(120+i*14);
 SK.coilTop(g,3196,140,15,'#8a7a6a');SK.coilTop(g,3196,196,15,'#8a7a6a');
 SK.box(g,3222,110,20,110,'#3b4048','#111',3);ys.forEach(y=>{g.fillStyle='#a7774f';g.fillRect(3242,y-1,170,2)});
 for(let x=3330+(off%step);x<3412;x+=step){g.fillStyle='#b98a62';g.fillRect(x-1,ys[0]-6,2,ys[7]-ys[0]+12)}
 SK.shadow(g,3320,168,12,64,.3);SK.box(g,3310,96,20,150,'#4a5058','#1d2024',3);SK.hazardBar(g,3310,96,20,5);
 const fl=busy&&f>.4&&f<.8;ys.forEach(y=>{SK.box(g,3312,y-4,16,8,'#2a2d33','#111',2);if(fl){const gr=g.createRadialGradient(3320,y,0,3320,y,8);gr.addColorStop(0,'rgba(235,245,255,.98)');gr.addColorStop(1,'rgba(120,170,255,0)');g.fillStyle=gr;SK.circ(g,3320,y,8);g.fill()}})}
function drawKob(){if(!B_('kob')||!inView(POS.kob.x,POS.kob.y,200))return;const busy=!!NODE.kob.cur;
 g.fillStyle='#2a2d33';g.fillRect(3262,880,156,24);g.fillStyle='rgba(255,255,255,.07)';for(let x=3264;x<3418;x+=8)g.fillRect(x,880,3,24);
 for(let i=0;i<2;i++){const x=3300+i*80,y=960;SK.shadow(g,x+3,y+4,24,22,.3);g.fillStyle='#4a5058';SK.circ(g,x,y,22);g.fill();g.strokeStyle='#22262b';g.lineWidth=2;SK.circ(g,x,y,22);g.stroke();
  const a=busy?NODE.kob.p*PI/2*(i?-1:1):0;g.save();g.translate(x,y);g.rotate(a);g.fillStyle='#c9ced6';SK.circ(g,14,0,4);g.fill();g.restore();g.fillStyle='#2a2d33';SK.circ(g,x,y,6);g.fill();
  if(busy){g.strokeStyle=C.rebar;g.lineWidth=3.5;g.lineCap='round';g.beginPath();g.moveTo(x-40,y);g.lineTo(x,y);g.lineTo(x+Math.cos(a+PI/2)*26,y+Math.sin(a+PI/2)*26);g.stroke();g.lineCap='butt'}}}
function drawPileK(k){const p=PR[k].pile,a=PILE[k];if(!pileOn(k)||!inView(p.x,p.y,80))return;const n=min(a.length,32);
 g.fillStyle='rgba(0,0,0,.22)';SK.rr(g,p.x-42,p.y-34,84,68,8);g.fill();g.setLineDash([6,5]);g.strokeStyle='rgba(245,197,24,.45)';g.lineWidth=2;SK.rr(g,p.x-42,p.y-34,84,68,8);g.stroke();g.setLineDash([]);
 for(let i=0;i<n;i++){const lay=floor(i/8),c=i%8,cx=p.x-22+(c%4)*15,cy=p.y-6+floor(c/4)*16-lay*5;
  if(k==='pig')drawPig(cx+4,cy,.75);else if(k==='ingot')SK.ingot(g,cx+4,cy,7,0);else if(k==='billet')SK.billetBar(g,p.x-32,p.y+18-(i%8)*5-lay*2,64,4,.06);else if(k==='coil')SK.coilTop(g,cx+4,cy,8,'#7a6a5c');else if(k==='mesh')drawMesh(p.x,p.y+14-i*3,2.2);else if(k==='bent')drawBent(cx+4,cy,1.3);else SK.bundle(g,p.x-30,p.y+12-(i%8)*6-lay*2,60,3,[.15,.5,.85],k==='tcore'?'#3a4350':C.rebar)}
 const top=a.length?a[a.length-1]:{k,t:1,q:qLF()},pr=val(top)*BASEP()*gm()/max(.001,top.t),n1=a.length+' '+t_('stk'),n2=kr(pr,'/t'),pn=t_(PR[k].n);
 ctx.font=`800 9.5px ${FONT}`;let PW=ctx.measureText(pn).width;ctx.font=`700 9px ${FONT}`;PW=Math.ceil(max(88,PW+14,ctx.measureText(n1+' · '+n2).width+14));const hw=PW/2;
 LBL.push({k:'p'+k,x:p.x-hw,y:p.y+38,w:PW,h:30,pr:1,ax:p.x,f:(lx,ly)=>{g.fillStyle='rgba(16,19,26,.9)';SK.rr(g,lx,ly,PW,30,8);g.fill();g.strokeStyle='rgba(245,197,24,.6)';g.lineWidth=1;SK.rr(g,lx+.5,ly+.5,PW-1,29,8);g.stroke();txt(pn,lx+hw,ly+9,9.5,C.ui,800);txt(n1+' · '+n2,lx+hw,ly+21,9,C.coin,700)}})}
/* ---- converters: charging animation (scrap box, then the råjern ladle) and the råjern station at the steel plant ---- */
const convR=()=>era()===2?72:58;
const convMouth=()=>SK2.convPt(F.x,F.y,convR(),F.tilt,1.05);
function hmLadlePos(){const c=F.ch,hp=POS.hmL;
 if(ET()==='conv'&&c&&c.hm>0){const k=c.t/c.dur;if(k>.36&&k<.95){const[mx,my]=convMouth(),kk=(k-.36)/.59,go=ease(min(1,kk*3)),back=kk>.8?ease((kk-.8)/.2):0,f=go-back;return{x:lerp(hp.x,mx-40,f),y:lerp(hp.y,my-46,f),lift:f,pour:kk>.3&&kk<.8?1:0,to:[mx,my]}}}
 if(ET()==='sm'&&F.hmCh){const h=F.hmCh,k=h.t/h.dur,f=k<.2?ease(k/.2):k>.85?1-ease((k-.85)/.15):1,dx=F.x-85-34,dy=F.y+60;return{x:lerp(hp.x,dx,f),y:lerp(hp.y,dy,f),lift:f,pour:k>.2&&k<.85?1:0,to:[F.x-85-6,F.y+60]}}
 return{x:hp.x,y:hp.y,lift:0,pour:0}}
function drawHMStation(){if(!usesHM()||!inView(POS.hmL.x,POS.hmL.y,200))return;const p=hmLadlePos(),hp=POS.hmL,f=clamp(S.hm/hmCap(),0,1);
 SK.car(g,hp.x,hp.y,62,50);
 if(p.lift>0){SK.line(g,p.x-8,p.y-70,p.x-8,p.y-20,'#15161a',1.5);SK.line(g,p.x+8,p.y-70,p.x+8,p.y-20,'#15161a',1.5);SK.box(g,p.x-16,p.y-80,32,12,'#c79a1e','#5a4510',3)}
 SK.ladle(g,p.x,p.y,24*(1+.12*p.lift),T,{fill:S.hm>.05||p.pour?max(.25,f):0,eye:false});
 const t=t_('RÅJERN')+' '+tf(S.hm)+'/'+Math.round(hmCap())+' t';ctx.font=`800 10px ${FONT}`;const w=ctx.measureText(t).width+10;
 LBL.push({k:'hm',x:hp.x-w/2,y:hp.y+30,w,h:15,pr:1,ax:hp.x,f:(lx,ly)=>txt(t,lx+w/2,ly+7,10,F.waitHM>1.5?C.danger:C.moltenhi,800,'center',3)})}
function drawConvCharge(){const c=F.ch;if(!c||ET()!=='conv')return;const k=c.t/c.dur,[mx,my]=convMouth();
 if(c.s>0&&k>.1&&k<.5){const kk=(k-.1)/.4,mv=ease(min(1,kk*2)),bx=lerp(POS.drop.x+84,mx-36,mv),by=lerp(POS.drop.y,my-34,mv),rot=kk>.5?-(kk-.5)*2.2:0;
  SK.line(g,bx-10,by-60,bx-10,by-12,'#15161a',1.4);SK.line(g,bx+10,by-60,bx+10,by-12,'#15161a',1.4);
  g.save();g.translate(bx,by);g.rotate(rot);SK.box(g,-28,-14,56,28,'#4a5058','#1b1e22',3);if(kk<.7)for(let q=0;q<8;q++)SK.chunk(g,-20+(q%4)*13,-6+floor(q/4)*11,4,hsh(q),SK.SCRAPC[q%5]);g.restore();
  if(kk>.55)SK.parts(10,2.5,5,T,(ff,a)=>SK.chunk(g,lerp(bx-24,mx,ff)+(a-.5)*10,lerp(by,my,ff)+ff*ff*8,3,a,SK.SCRAPC[floor(a*4.99)%5]))}}
function drawHMPour(){if(!usesHM())return;const p=hmLadlePos();if(!p.pour||!p.to)return;stream(p.x+16,p.y-8,p.to[0],p.to[1],.75)}
/* ---- råjernsverk ---- */
const RJX=POS.rjF.x,RJY=POS.rjF.y;
function rjRun(){return rjClosed()?0:clamp(RJ.rate/max(.01,RJ.rp*.5),0,1)}
function drawOreTrain(){const y=POS.oreTrainY,cl=rjClosed(),full=yardT(SRCm.ore)>=oreYardCap()-1,cyc=RJ.trainT%12,w=cl||full?-1:floor(cyc/2.4),tipK=cl||full?0:Math.sin(PI*clamp((cyc%2.4)/2,0,1));
 for(let i=0;i<5;i++){const x=-700+i*96,tip=i===w?tipK:0,empty=cl||(i<w&&!full);g.save();g.translate(x,y-tip*14);
  SK.box(g,-40,-15,80,30,'#6a4a3a','#2a1a14',3);g.fillStyle='rgba(0,0,0,.25)';g.fillRect(-36,-11,72,22);
  if(!empty&&tip<.9)for(let q=0;q<10;q++){g.fillStyle=q%3?'#6b3d33':'#4a3a36';SK.circ(g,-30+(q%5)*15,-6+floor(q/5)*11-tip*4,4.5);g.fill()}g.restore();
  if(tip>.2&&i<3){const sx=x,sy=y-20;SK.parts(10,2,i*5,T,(ff,a)=>{g.fillStyle=a>.5?'#6b3d33':'#4a3a36';SK.circ(g,sx+(a-.5)*50,lerp(sy,POS.ore.y+120,ff),3);g.fill()})}}
 SK.box(g,-230,y-17,74,34,'#c0392b','#7d241b',5);g.fillStyle='#1d2026';g.fillRect(-194,y-13,30,26);g.fillStyle='#9fd0ff';g.fillRect(-190,y-9,22,7)}
function drawCoke(){const n=lv('koks')?min(3,1+floor(lv('koks')/6)):0,u=rjSupCap('koks')>0?clamp(rate('s:koks')/(rjSupCap('koks')*60),0,1):0;
 if(!n){for(let i=0;i<26;i++){g.fillStyle=i%2?'#1e1e22':'#2b2b2e';SK.circ(g,-660+hsh(i)*90,170+hsh(i*3)*44,3+hsh(i*5)*3);g.fill()}if(!rjClosed())labFix('koks',t_('KOKS KJØPES INN'),-616,232,8.5,C.uidim)}
 for(let i=0;i<3;i++){if(i>=n)continue;const x=-690+i*52;SK2.cyl(g,x,214,22,0,80,'#3a3c42','#6a6e76',26);SK2.cap(g,x,214-80*OK,22,'#4a4e55')}
 const items=(g2,L,w2,tt)=>{if(!n||u<.01)return;const nn=max(6,floor(L/16));for(let i=0;i<nn;i++){const p=((RM?i/nn:tt*.08*(.4+u)*140/L+i/nn)%1)*L;g2.fillStyle=i%2?'#1e1e22':'#3a3a40';SK.circ(g2,p,(hsh(i)-.5)*w2*.5,2.2);g2.fill()}};
 SK.belt(g,-540,224,-540,640,10,T,{trestle:true,speed:16+50*u,items});SK.belt(g,-540,640,-500,664,10,T,{speed:16+50*u,items})}
function drawCowpers(){if(rjEra()){/* electric furnace: three single-phase transformers instead of hot-blast stoves */
  for(let i=0;i<3;i++){const x=-450+i*80,y=236;SK.box(g,x-28,y-46,56,44,'#8a8a84','rgba(0,0,0,.45)',4);for(let k=0;k<6;k++){g.fillStyle=k%2?'#5c5c56':'#a3a39c';g.fillRect(x-30+k*11,y-4,6,9)}
   g.save();g.translate(x,y-28);g.fillStyle='#f5c518';g.beginPath();g.moveTo(0,-7);g.lineTo(6,5);g.lineTo(-6,5);g.closePath();g.fill();g.fillStyle='#111';g.fillRect(-.8,-3,1.6,5);g.restore()}
  if(!rjClosed())labFix('mva',Math.round(rjPow()*400)+' MVA',-370,178,9,C.ui);return}
 const lvC=lv('cowper'),n=lvC?min(4,1+floor(lvC/5)):0,on=rjRun()>0,act=n?floor((RM?0:T)/5)%n:-1;
 if(!n){SK.box(g,-300,200,64,40,'#4a4f56','#1b1e22',4);SK.fan(g,-268,220,12,T,on?10:0);if(!rjClosed())labFix('kaldbl',t_('KALDBLÅST'),-268,254,8.5,C.uidim)}
 /* hot-blast main to the bustle pipe, gas main from the dust catcher to the burners */
 SK.pipe(g,[[-150,330],[-150,176],[-480,176]],5,'#55595f',T);
 if(n)SK.pipe(g,[[-490,226],[-214,226],[-214,470],[-262,486]],9,'#7a5a4a',T,{flow:on?'#ffb070':null,speed:30});
 for(let i=0;i<4;i++){const x=-470+i*70;if(i<n)SK2.cowper(g,x,240,T,i===act,on)}}
function drawRJ(){if(!inView(-368,570,560))return;const cl=rjClosed(),run=rjRun(),el=rjEra();
 drawOreTrain();drawCoke();drawCowpers();
 /* dust catcher + downcomer */
 SK2.cyl(g,-150,426,24,0,110,'#55595f','#9aa2ac',28);SK2.cap(g,-150,426-112*OK,22,'#6a7078');
 /* skip incline (or charging belt) to the top */
 const top=el?[RJX-30,RJY-128*OK]:[RJX-24,RJY-300*OK],bot=[POS.skip.x+6,POS.skip.y-18];
 SK.line(g,bot[0]-5,bot[1],top[0]-5,top[1],'#3a3f46',4);SK.line(g,bot[0]+5,bot[1]+3,top[0]+5,top[1]+3,'#3a3f46',4);
 for(let i=1;i<10;i++){const k=i/10;SK.line(g,lerp(bot[0]-5,top[0]-5,k),lerp(bot[1],top[1],k),lerp(bot[0]+5,top[0]+5,k),lerp(bot[1]+3,top[1]+3,k),'#2a2d33',2)}
 {const ph=RM?.5:(RJ.skipT*.3)%2,k=ph<1?ph:2-ph,sx=lerp(bot[0],top[0],k),sy=lerp(bot[1],top[1],k);SK.box(g,sx-9,sy-8,18,14,'#c79a1e','#5a4510',3);if(ph<1){g.fillStyle='#6b3d33';SK.circ(g,sx,sy-5,4);g.fill()}}
 /* cast house runners: iron to the torpedo, overflow to the pig-casting machine */
 const th=SK2.bfTap(RJX,RJY),runr=[[th[0],th[1]],[-200,604],[-150,640],[-112,668]];
 SK.pipe(g,runr,10,'#3b2b24',T,{flow:RJ.tapping&&!RJ.overflow&&!cl?heat(.95):null,dash:[6,4],speed:40,cap:'butt'});
 SK.pipe(g,[[-150,640],[-40,640]],8,'#3b2b24',T,{flow:RJ.overflow>0&&!cl?heat(.95):null,dash:[6,4],speed:40,cap:'butt'});
 /* furnace */
 if(el)SK2.elFurnace(g,RJX,RJY,T,{run,tapping:RJ.tapping});else SK2.blastFurnace(g,RJX,RJY,T,{run,tapping:RJ.tapping,bell:!RM&&(T%3)<.4&&run>0});
 if(!el)SK.pipe(g,[[RJX+18,RJY-366*OK],[RJX+18,RJY-410*OK],[-150,RJY-410*OK],[-150,426-112*OK]],12,'#6a7078',T);
 else SK.pipe(g,[[RJX+50,RJY-150*OK],[RJX+50,RJY-200*OK],[-150,RJY-200*OK],[-150,426-112*OK]],10,'#6a7078',T);
 if(el){/* flexible cables from the transformers to the electrode holders */for(let i=0;i<3;i++){const E=[[0,-27],[-26,13.5],[26,13.5]][i];SK.hose(g,-450+i*80,226,-380+i*40,300,RJX+E[0],RJY+E[1]-222*OK,4,'#141518',T)}}
 /* top gas puffs */
 if(run>0)SK.parts(5,.5,21,T,(f,a)=>{g.fillStyle=`rgba(190,190,195,${.18*(1-f)*run})`;SK.circ(g,-150+(a-.5)*20,426-130*OK-f*40,6+f*12);g.fill()});
 /* pig-casting machine: chain of moulds down to the pig pile */
 {const x=-40,y0=640,y1=900,mv=RJ.overflow>0&&!cl;g.fillStyle='#2a2d33';g.fillRect(x-9,y0,18,y1-y0);const off=mv&&!RM?(T*40)%16:0;
  for(let y=y0+off;y<y1;y+=16){const k=(y-y0)/(y1-y0);g.fillStyle=mv?heat(clamp(.8-k*.9,.05,1)):'#3a3f46';g.fillRect(x-7,y,14,11)}
  SK.box(g,x-14,y0-8,28,12,'#4a5058','#111',2)}
 if(cl){/* closed: desaturate and darken the whole råjernsverk (cheap blend modes, no canvas filter) */g.save();const z0=ZN.rjsup,z1=ZN.rj;g.globalCompositeOperation='saturation';g.fillStyle='#808080';g.fillRect(z0.x0,z0.y0,z0.x1-z0.x0,z1.y1-z0.y0);g.globalCompositeOperation='source-over';g.fillStyle='rgba(18,20,24,.42)';g.fillRect(z0.x0,z0.y0,z0.x1-z0.x0,z1.y1-z0.y0);g.restore();const a=.85;g.globalAlpha=a;SK.box(g,RJX-60,RJY-40,120,28,'rgba(16,19,26,.9)','rgba(255,255,255,.2)',8);txt(t_('NEDLAGT'),RJX,RJY-26,14,C.uidim,800);g.globalAlpha=1}
 /* malm buffer at the top */
 if(!cl){const t=t_('SKIP')+' '+tf(S.rj.ore)+'/'+skipCap()+' t';ctx.font=`800 10px ${FONT}`;const w=ctx.measureText(t).width+10;LBL.push({k:'skip',x:POS.skip.x-w/2,y:POS.skip.y+44,w,h:15,pr:1,ax:POS.skip.x,f:(lx,ly)=>txt(t,lx+w/2,ly+7,10,RJ.starve>1.5?C.danger:C.ui,800,'center',3)})}}
function drawTorps(){if(!inView(220,700,700))return;const cl=rjClosed();
 for(const t of TORPS){if(cl&&t.i>0)continue;const onA=t.st==='go'||t.st==='pour'||(t.st==='fill'&&fillQ()[0]===t&&Math.abs(t.x-POS.torpX0)<3),y=onA?POS.torpA:POS.torpB;if(!inView(t.x,y,90))continue;
  const k=t.load/max(1,torpCap()),pour=t.st==='pour'&&t.pouring;SK2.torpedo(g,t.x,y,130,k,T,{tilt:pour?.9:0});
  if(pour){const mx=t.x,my=y-16*OK+10;stream(mx,my,POS.hmL.x-6,POS.hmL.y-6,.6)}
  if(t.load>.5){const s=tf(t.load)+' t';ctx.font=`800 10px ${FONT}`;const w=ctx.measureText(s).width+8;LBL.push({k:'tp'+t.i,x:t.x-w/2,y:y-48,w,h:15,pr:0,ax:t.x,f:(lx,ly)=>txt(s,lx+w/2,ly+7,10,C.moltenhi,800,'center',3)})}}
 /* tap stream into the car at the cast house */
 const tc=castTorp();if(tc&&RJ.tapping&&!RJ.overflow&&!cl)stream(-112,664,tc.x,POS.torpA-16*OK-4,.6)}
/* ---- cranes ---- */
function drawCraneBridge(c){if(!c.built())return;const d=c.d,x=c.x,y=c.y;if(!inView(x,(d.y0+d.y1)/2,(d.y1-d.y0)/2+40))return;const man=G.crane===c.id;
 g.fillStyle='rgba(0,0,0,.18)';g.fillRect(x-4,d.y0,18,d.y1-d.y0);
 const big=c.id==='skrap'&&era()===5,hl=1-c.h,my=y+6+10*hl,mr=c.id==='ose'?10:big?13+3*c.h:9+2.5*c.h;
 if(c.id!=='ose'){SK.shadow(g,x+3+5*c.h,my+4+6*c.h,mr*1.1,mr*.75,.35);SK.line(g,x-3,y,x-3,my,'#15161a',1.3);SK.line(g,x+3,y,x+3,my,'#15161a',1.3);
  if(c.load>0||(c.pay&&c.pay.length)){for(let i=0;i<10;i++){const a=i/10*TAU,rr2=mr*(.8+.35*hsh(i));if(c.id==='mag')SK.billetBar(g,x-14,my-6+i%3*6,28,4,.1);else if(c.id==='malm'){g.fillStyle=i%2?'#6b3d33':'#4a3a36';SK.circ(g,x+Math.cos(a)*rr2,my+Math.sin(a)*rr2,3);g.fill()}else SK.chunk(g,x+Math.cos(a)*rr2,my+Math.sin(a)*rr2,2.5+hsh(i*2)*2.5,hsh(i),SK.SCRAPC[i%4])}}
  g.fillStyle='#2a2c31';SK.circ(g,x,my,mr);g.fill();g.strokeStyle='#e0b020';g.lineWidth=2.2;SK.circ(g,x,my,mr);g.stroke();g.fillStyle='#3f434a';SK.circ(g,x,my,mr*.45);g.fill();
  if(big){/* lifting magnet: ribbed disc, junction box and a lamp that is lit while the magnet is energised */const on=c.load>0;g.strokeStyle='rgba(0,0,0,.45)';g.lineWidth=1.2;for(let i=0;i<8;i++){const a=i/8*TAU;g.beginPath();g.moveTo(x+Math.cos(a)*mr*.5,my+Math.sin(a)*mr*.5);g.lineTo(x+Math.cos(a)*mr*.92,my+Math.sin(a)*mr*.92);g.stroke()}
   g.fillStyle='#55595f';g.fillRect(x-4,my-3,8,6);g.fillStyle=on?'#ff5a3c':'#5a2a24';SK.circ(g,x,my,2.2);g.fill();
   if(on&&!RM){g.strokeStyle=`rgba(140,200,255,${.35+.25*Math.sin(T*9)})`;g.lineWidth=2;SK.circ(g,x,my,mr+3);g.stroke()}
   SK.line(g,x+3,y,x+3,my,'#d24b3a',1)}}
 SK.box(g,x-15,d.y0-12,30,11,'#3c3f45','#1d2024');SK.box(g,x-15,d.y1+1,30,11,'#3c3f45','#1d2024');
 g.globalAlpha=man?1:.8;g.fillStyle=man?'#ffd23f':'#e0b020';g.fillRect(x-9,d.y0-2,3,d.y1-d.y0+4);g.fillRect(x+6,d.y0-2,3,d.y1-d.y0+4);g.fillStyle='rgba(20,20,20,.35)';g.fillRect(x-6,d.y0-2,12,d.y1-d.y0+4);g.globalAlpha=1;
 SK.box(g,x-13,y-11,26,18,'#c79a1e','#5a4510',3);g.fillStyle='#55595f';g.fillRect(x-9,y-7,18,6);
 if(man){g.strokeStyle=C.hazard;g.lineWidth=2;g.setLineDash([5,4]);g.lineDashOffset=-T*20;SK.circ(g,x,y,34);g.stroke();g.setLineDash([]);const j=c.job;if(j){const t=c.state==='toPick'||c.state==='idle'?j.from:j.to;if(t){g.strokeStyle='rgba(245,197,24,.8)';g.lineWidth=2;SK.circ(g,t.x,t.y,26+Math.sin(T*6)*3);g.stroke()}}}}
/* ---- vehicles ---- */
function drawTruckV(cx,cy,v,kind){const o=v.off;g.save();g.beginPath();g.rect(cx-60,cy-140,120,WH);g.clip();g.translate(cx,cy+o);g.globalAlpha=1-clamp(o/500,0,.9);
 SK.box(g,-40,-110,80,170,'#5a5f66','#3a3d42',6);g.strokeStyle='#2c2f35';g.lineWidth=3;g.strokeRect(-34,-104,68,158);SK.box(g,-38,62,76,46,C.truck,mix(C.truck,'#000000',.4),8);g.fillStyle='#9fd0ff';g.fillRect(-30,92,60,8);
 const n=v.drive?v.cap:v.load;for(let i=0;i<n;i++){const r=floor(i/2),c=i%2;SK.billetBar(g,-30+c*32,-96+r*24,28,8,.06)}g.restore()}
function drawTruckH(cx,cy,v){const o=v.off;g.save();g.beginPath();g.rect(cx-160,cy-80,WW,160);g.clip();g.translate(cx+o,cy);g.globalAlpha=1-clamp(o/700,0,.9);
 SK.box(g,-150,-36,240,72,'#5a5f66','#3a3d42',6);SK.box(g,94,-34,54,68,C.truck,mix(C.truck,'#000000',.4),8);g.fillStyle='#9fd0ff';g.fillRect(132,-26,8,52);
 const n=v.drive?v.cap:v.load;for(let i=0;i<n;i++){const r=floor(i/4),c=i%4;SK.bundle(g,-140+c*56,-28+r*20,50,3,[.2,.5,.8],C.rebar)}g.restore()}
function drawTrain(){if(!B_('tog')||!inView(QX+300,POS.railY,700))return;const v=VEH.tog,y=POS.railY;g.save();g.beginPath();g.rect(0,y-80,WW,160);g.clip();g.translate(v.off,0);g.globalAlpha=1-clamp(v.off/1400,0,.6);
 const lx=3900;SK.box(g,lx,y-24,110,48,'#c0392b','#7d241b',6);g.fillStyle='#1d2026';g.fillRect(lx+64,y-20,36,40);g.fillStyle='#9fd0ff';g.fillRect(lx+68,y-16,28,8);
 const ld=v.drive?v.cap:v.load;for(let w=0;w<3;w++){const wx=lx-132-w*132;SK.box(g,wx,y-22,120,44,'#5a5f66','#3a3d42',4);for(let i=0;i<8;i++){if(w*8+i>=ld)break;SK.bundle(g,wx+8,y-18+i*4.6,104,1,[.2,.5,.8],C.rebar)}}g.restore()}
function drawShip(){if(!B_('kai')||!inView(QX+400,QY+150,500))return;const v=VEH.kai,bob=RM?0:Math.sin(T*.9)*1.2;g.save();g.beginPath();g.rect(QX,QY,WW-QX,WH-QY);g.clip();g.translate(QX+60+v.off,QY+120+bob);
 SK.shadow(g,330,40,320,30,.35);g.fillStyle=C.ship;SK.rr(g,0,0,620,120,46);g.fill();g.fillStyle='#b9bec5';SK.rr(g,8,8,604,104,40);g.fill();
 const ld=v.drive?v.cap:v.load;for(let h=0;h<5;h++){const hx=60+h*96;SK.box(g,hx,22,84,76,'#2a2d33','#111',3);for(let i=0;i<8;i++){if(h*8+i>=ld)break;SK.bundle(g,hx+6,28+i*8,72,2,[.2,.5,.8],C.rebar)}}
 SK.box(g,560,20,40,80,'#e9edf2','#555',4);g.restore()}
function drawCash(z){if(!z.open()||!z.cash||z.cash<1)return;const cp=cashAt(z),x=cp.x,y=cp.y;if(!inView(x,y,60))return;
 const n=clamp(Math.ceil(Math.log2(z.cash+1)*.9),1,14);shadow(x+2,y+8,22,8,.3);
 for(let i=0;i<n;i++){const yy=y+4-i*3.2,r=(i*1.7)%3-1.5;ctx.fillStyle=i%2?'#3f8f5a':'#4fa86b';ctx.fillRect(x-17+r,yy-5,34,8);ctx.fillStyle='rgba(255,255,255,.25)';ctx.fillRect(x-17+r,yy-5,34,1.5);ctx.fillStyle='#2b6b41';circ(x+r,yy-1,2.4);ctx.fill()}
 const t=kr(z.cash);ctx.font=`800 11px ${FONT}`;const w=ctx.measureText(t).width+10,ty=y-n*3.2-14;LOBS.push({x:x-20,y:y-n*3.2-6,w:40,h:n*3.2+16});
 LBL.push({k:'c'+z.id,x:x-w/2,y:ty-8,w,h:16,pr:3,ax:x,f:(lx,ly)=>{const pl=RM?1:1+Math.sin(T*5)*.05;ctx.save();ctx.translate(lx+w/2,ly+8);ctx.scale(pl,pl);txt(t,0,0,11,C.coin,800,'center',3);ctx.restore()}})}
function star(x,y,r){ctx.beginPath();for(let i=0;i<10;i++){const a=-PI/2+i*PI/5,rr2=i%2?r*.45:r;ctx.lineTo(x+Math.cos(a)*rr2,y+Math.sin(a)*rr2)}ctx.closePath()}
/* pad name label: world-space box above the pad (shared by drawing, the label solver and the layout test).
   Row pads (upgrades + hire) are compact: a 48 px tile and a fixed-width label (name on ≤ 2 lines, level/helpers under it). */
const LABC={};
function wrap2(t,mw,fs){ctx.font=`800 ${fs}px ${FONT}`;const W=x=>ctx.measureText(x).width,flat=t.replace(/­/g,'');if(W(flat)<=mw)return[flat];
 let best=null,bw=1e9;for(let i=0;i<t.length;i++){const c=t[i];if(c!==' '&&c!=='­'&&c!=='-')continue;const a=(t.slice(0,i)+(c==='-'?'-':c==='­'?'-':'')).replace(/­/g,''),b=t.slice(i+1).replace(/­/g,'');if(!a||!b)continue;const m=max(W(a),W(b));if(m<bw){bw=m;best=[a,b]}}
 return best&&bw<=mw?best:null}
function padLab(d){const row=d.kind==='up'||d.kind==='hire';
 if(row){const s=24,w=d.lw||74,nm=d.kind==='up'?padTitle(d.u):hName(d.h),sub=padSub(d),key=nm+'|'+w+'|'+sub;let c=LABC[key];
  if(!c){let fs=10,lines=null;for(;fs>=7.5;fs-=.5){lines=wrap2(nm,w-8,fs);if(lines)break}if(!lines){fs=7.5;lines=[nm.replace(/­/g,'')]}
   let sf=9;ctx.font=`600 ${sf}px ${FONT}`;while(ctx.measureText(sub).width>w-6&&sf>7){sf-=.5;ctx.font=`600 ${sf}px ${FONT}`}
   c=LABC[key]={lines,fs,sf,h:lines.length*(fs+1)+sf+8};if(Object.keys(LABC).length>600)for(const k in LABC)delete LABC[k]}
  return{x:d.x-w/2,y:d.y-s-3-c.h,w,h:c.h,nm,sub,s,lines:c.lines,fs:c.fs,sf:c.sf}}
 const s=d.kind==='build'?34:30,nm=padName(d),sub=padSub(d);
 ctx.font=`800 11px ${FONT}`;let w=ctx.measureText(nm).width;ctx.font=`600 9px ${FONT}`;w=max(w,ctx.measureText(sub).width,60)+16;
 return{x:d.x-w/2,y:d.y-s-34,w,h:28,nm,sub,s}}
function drawRowLab(L,lx,ly,urg,maks){ctx.fillStyle=urg?'rgba(48,14,12,.94)':'rgba(16,19,26,.9)';rr(lx,ly,L.w,L.h,7);ctx.fill();ctx.strokeStyle=urg?rgba(C.danger,.9):'rgba(255,255,255,.1)';ctx.lineWidth=urg?1.5:1;rr(lx+.5,ly+.5,L.w-1,L.h-1,7);ctx.stroke();
 let y=ly+3.5+(L.fs+1)/2;for(const t of L.lines){txt(t,lx+L.w/2,y,L.fs,maks?C.uidim:C.ui,800);y+=L.fs+1}txt(L.sub,lx+L.w/2,y-(L.fs+1)/2+L.sf/2+1.5,L.sf,maks?C.good:urg?'#ffb0a6':C.uidim,maks?800:600)}
function drawUpPads(){layoutPads();for(const d of PADS){const maks=padMaks(d);if(!maks&&!vis(d)||!inView(d.x,d.y,90))continue;const pres=d.kind==='prestige',bld=d.kind==='build',row=d.kind==='up'||d.kind==='hire';
 if(maks){/* maxed: small dim tile with a check mark, keeps its place in the row */const L=padLab(d);ctx.fillStyle='rgba(22,25,32,.7)';rr(d.x-16,d.y-16,32,32,9);ctx.fill();ctx.strokeStyle=rgba(C.good,.6);ctx.lineWidth=2;rr(d.x-16,d.y-16,32,32,9);ctx.stroke();
  ctx.beginPath();ctx.moveTo(d.x-7,d.y);ctx.lineTo(d.x-2,d.y+5);ctx.lineTo(d.x+8,d.y-6);ctx.stroke();LOBS.push({x:d.x-16,y:d.y-16,w:32,h:32});
  LBL.push({k:d.id,x:L.x,y:L.y,w:L.w,h:L.h,pr:1,ax:null,fix:1,f:(lx,ly)=>drawRowLab(L,lx,ly,false,true)});continue}
 const c=cost(d),paid=S.paid[paidKey(d)]||0,pr=pres?0:paid/max(1,c),aff=pres?presGain()>0:S.money+paid>=c,urg=padUrgent(d),s=bld?34:row?24:30,pl=aff&&!RM?1+Math.sin(T*6)*.05:1;
 ctx.save();ctx.translate(d.x,d.y);ctx.scale(pl,pl);const rd=row?9:12;
 ctx.fillStyle='rgba(0,0,0,.35)';rr(-s+3,-s+4,2*s,2*s,rd);ctx.fill();ctx.fillStyle=bld?'rgba(14,32,52,.95)':pres?'rgba(40,32,10,.94)':urg?'rgba(44,16,14,.95)':'rgba(22,25,32,.94)';rr(-s,-s,2*s,2*s,rd);ctx.fill();
 if(pr>0){ctx.save();rr(-s,-s,2*s,2*s,rd);ctx.clip();ctx.fillStyle=rgba(C.good,.75);ctx.fillRect(-s,s-2*s*pr,2*s,2*s*pr);ctx.restore()}
 if(urg){ctx.strokeStyle=C.danger;ctx.lineWidth=3;rr(-s,-s,2*s,2*s,rd);ctx.stroke()}
 else{ctx.setLineDash(row?[6,4]:[7,5]);ctx.lineDashOffset=RM?0:-T*20;ctx.strokeStyle=aff?C.hazard:bld?'rgba(111,183,255,.75)':'rgba(244,241,234,.5)';ctx.lineWidth=row?2.5:3;rr(-s,-s,2*s,2*s,rd);ctx.stroke();ctx.setLineDash([])}
 if(urg){/* FLASKEHALS badge: red corner dot with a white bar (no text) */ctx.fillStyle=C.danger;circ(s-2,-s+2,6.5);ctx.fill();ctx.fillStyle='#fff';ctx.fillRect(s-3,-s-1.5,2,5);ctx.fillRect(s-3,-s+4.5,2,2)}
 /* locked after a purchase: TRYKK on top (instead of the icon), the next price stays below */
 if(d.lock){const a=RM?1:.85+.15*Math.sin(T*6);ctx.globalAlpha=a;txt(t_('TRYKK'),0,row?-7:-8,row?10:11,C.good,800);ctx.globalAlpha=1}
 else if(row){ctx.save();ctx.translate(0,-7);ctx.scale(.8,.8);icon(d,0,0);ctx.restore()}else icon(d,0,-8);
 const ct=kr(Math.ceil(c-paid)),cl=ct.length-(NO_()?3:0);
 txt(pres?(aff?t_('KLAR'):'—'):ct,0,row?12:16,row?(cl>5?8.5:10):(cl>6?10:12),aff?C.hazard:C.ui,800);ctx.restore();
 const L=padLab(d);LOBS.push({x:d.x-s,y:d.y-s,w:2*s,h:2*s});
 if(row)LBL.push({k:d.id,x:L.x,y:L.y,w:L.w,h:L.h,pr:2,ax:null,fix:1,f:(lx,ly)=>drawRowLab(L,lx,ly,urg,false)});
 else LBL.push({k:d.id,x:L.x,y:L.y,w:L.w,h:L.h,pr:2,ax:d.x,f:(lx,ly)=>{ctx.fillStyle=bld?'rgba(14,32,52,.92)':'rgba(16,19,26,.9)';rr(lx,ly,L.w,28,8);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.1)';ctx.lineWidth=1;rr(lx+.5,ly+.5,L.w-1,27,8);ctx.stroke();txt(L.nm,lx+L.w/2,ly+9,11,C.ui,800);txt(L.sub,lx+L.w/2,ly+21,9,bld?C.prem:C.uidim,600)}})}}
function icon(d,x,y){ctx.save();ctx.translate(x,y);ctx.fillStyle=C.hazard;ctx.strokeStyle=C.hazard;ctx.lineWidth=2.5;ctx.lineCap='round';ctx.lineJoin='round';
 if(d.kind==='hire'){const n=d.h.costs.length,l=lv(d.h.id);for(let i=0;i<n;i++){const hx=-12+i*12;if(i<l){ctx.fillStyle=d.h.col;circ(hx,-4,3.6);ctx.fill();rr(hx-5,1,10,7,3);ctx.fill()}else{ctx.strokeStyle='rgba(244,241,234,.6)';ctx.lineWidth=1.4;ctx.setLineDash([2,2]);circ(hx,-4,3.6);ctx.stroke();rr(hx-5,1,10,7,3);ctx.stroke();ctx.setLineDash([])}}}
 else if(d.kind==='build'){ctx.strokeStyle=C.prem;ctx.lineWidth=2;ctx.strokeRect(-10,-8,20,16);ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(0,5);ctx.moveTo(-5,0);ctx.lineTo(5,0);ctx.stroke()}
 else if(d.kind==='prestige'){star(0,0,11);ctx.fill()}
 else{const id=d.u?d.u.id:'';if(d.u&&d.u.person){ctx.fillStyle='#e84d3a';circ(0,-5,4.5);ctx.fill();rr(-7,1,14,9,4);ctx.fill();ctx.fillStyle='#f8f6ee';ctx.fillRect(-5,-10,10,3);ctx.restore();return}switch(id){case'carry':for(let i=0;i<3;i++)drawScrap(0,6-i*6,6,i,0);break;
  case'speed':case'hspeed':ctx.beginPath();ctx.moveTo(-9,-7);ctx.lineTo(-2,0);ctx.lineTo(-9,7);ctx.moveTo(1,-7);ctx.lineTo(8,0);ctx.lineTo(1,7);ctx.stroke();break;
  case'furnace':ctx.fillStyle=C.molten;circ(0,0,9);ctx.fill();ctx.fillStyle=C.moltenhi;circ(0,0,4.5);ctx.fill();ctx.strokeStyle='#111';ctx.lineWidth=1.5;circ(0,0,9);ctx.stroke();break;
  case'power':ctx.beginPath();ctx.moveTo(2,-10);ctx.lineTo(-6,1);ctx.lineTo(0,1);ctx.lineTo(-2,10);ctx.lineTo(6,-1);ctx.lineTo(0,-1);ctx.closePath();ctx.fill();break;
  case'kalk':SK.silo(g,0,0,9,'#e9e4d6');break;case'o2':SK.loxTank(g,0,0,10);break;case'kull':SK.silo(g,0,0,9,'#4a4e55');break;case'lans':SK.line(g,-9,7,9,-7,'#c9ced6',3);break;
  case'kokup':case'kokbig':case'kran2':SK.mould(g,0,0,9,0,0);break;case'solid':SK.ingot(g,0,0,8,.4);break;case'kanal':drawBrick(0,0,1.2,1);break;case'hette':drawSack(0,0,1.1,0,C.hette);break;
  case'strands':case'caster':for(let i=0;i<3;i++)SK.billetBar(g,-10,-6+i*6,20,4,.6-i*.15);break;case'torch':ctx.fillStyle='#ffb030';circ(0,0,4);ctx.fill();break;
  case'truck':txt(CUR(),0,0,14,C.hazard,800);break;case'ladle':SK.ladle(g,0,0,9,T,{fill:.8,eye:false});break;case'slagcap':case'slaggbil':drawSlag(0,0,9,2);break;
  case'kran':case'magkran':case'osekran':case'elekkran':ctx.fillStyle='#e0b020';ctx.fillRect(-10,-8,4,16);ctx.fillRect(6,-8,4,16);ctx.fillRect(-10,-2,20,4);break;
  case'yard':case'yard2':case'charge':drawScrap(0,0,9,3,.2);break;case'magnet':ctx.fillStyle='#2a2c31';circ(0,0,9);ctx.fill();ctx.strokeStyle=C.hazard;ctx.lineWidth=2.2;circ(0,0,9);ctx.stroke();ctx.fillStyle='#ff5a3c';circ(0,0,2.4);ctx.fill();ctx.strokeStyle='rgba(140,200,255,.8)';ctx.lineWidth=1.5;circ(0,0,12);ctx.stroke();break;case'lfq':case'lft':drawLeg(0,0,1.1);break;
  default:ctx.beginPath();ctx.moveTo(-8,4);ctx.lineTo(0,-6);ctx.lineTo(8,4);ctx.stroke()}}ctx.restore()}
/* operator desks: idle helpers whose route is covered by a crane / conveyor work here; the tapper has his own desk by TAPP */
const TAPPER={x:TAPDESK.x,y:TAPDESK.y-24,vx:0,stack:[],moving:false,walk:0};
function desk(x,y,lab,on,arm){if(!inView(x,y,60))return;shadow(x+2,y+9,22,6,.3);ctx.fillStyle='#2b2f37';rr(x-19,y-8,38,18,4);ctx.fill();ctx.fillStyle='#454b55';rr(x-19,y-10,38,6,3);ctx.fill();
 const gl=on?(RM?.8:.6+.25*Math.sin(T*3.1+x)):.25;ctx.fillStyle=rgba('#7fe0ff',gl);ctx.fillRect(x-13,y-6,12,8);ctx.fillStyle=rgba(on?'#5fd38d':'#7d8590',on?.9:.5);ctx.fillRect(x+2,y-6,10,3);ctx.fillStyle=rgba('#ffcf33',on&&!RM&&Math.sin(T*7+x)>0?.95:.35);circ(x+8,y+2,2);ctx.fill();
 if(arm!=null){ctx.strokeStyle='#c9ced6';ctx.lineWidth=2.5;ctx.lineCap='round';const a=-PI/2+arm*.9;ctx.beginPath();ctx.moveTo(x+14,y-4);ctx.lineTo(x+14+Math.cos(a)*12,y-4+Math.sin(a)*12);ctx.stroke();ctx.fillStyle='#e84d3a';circ(x+14+Math.cos(a)*12,y-4+Math.sin(a)*12,2.6);ctx.fill();ctx.lineCap='butt'}
 txt(lab,x,y+17,7.5,C.uidim,800,'center',2);LOBS.push({x:x-22,y:y-12,w:44,h:34})}
function drawDesks(){for(const r in POSTS){const p=POSTS[r];if(!lv(HIRE[r].id)||!stOn(r==='rj'?'rj':r)||!inView(p.x,p.y,80))continue;const at=helpers.filter(h=>h.r===r&&h.state==='post'&&!inCab(h));
  desk(p.x,p.y,t_(postCrane(r)&&helpers.some(h=>h.r===r&&inCab(h))?'KRANFØRER':'OPERATØR'),at.length>0,null);
  for(const h of at){if(RM)continue;ctx.fillStyle=ROUTES[r].col;circ(h.x-6+Math.sin(T*9+h.gi)*2,p.y-11,2.4);ctx.fill();circ(h.x+6+Math.sin(T*8+h.gi+1)*2,p.y-11,2.4);ctx.fill()}}
 if(lv('operator')&&stOn('ovn')){const k=F.state==='tapping'?1:F.state==='ready'&&tapLadle()?clamp((F.opT||0)/.8,0,1):0;desk(TAPDESK.x,TAPDESK.y,t_('TAPPER'),F.state==='ready'||F.state==='tapping',k)}}
function drawSwitches(){for(const s of SW){if(!s.on()||!inView(s.x,s.y,60))continue;LOBS.push({x:s.x-38,y:s.y-24,w:76,h:44});const t=t_(s.id==='cast'?CASTN[S.cast]:s.id==='rjsw'?(S.tg.rj?'Stålverk':'Salg'):MIXN[S.mix]);
 ctx.fillStyle='rgba(0,0,0,.35)';rr(s.x-36,s.y-20,74,44,10);ctx.fill();ctx.fillStyle='#173826';rr(s.x-38,s.y-24,76,44,10);ctx.fill();ctx.strokeStyle=C.good;ctx.lineWidth=2.5;rr(s.x-38,s.y-24,76,44,10);ctx.stroke();
 txt(t_(s.lab).toUpperCase(),s.x,s.y-12,8,C.uidim,800);txt(t,s.x,s.y+5,12,C.good,800)}}
/* status chips beside every zone name plate: what the station waits for, or FLASKEHALS */
/* status chip beside a zone plate: never runs past the zone edge or under the furnace gauge — shrink to 9px, drop " (…)", then cut with "…" */
function chipLayout(z,txt0){const p=zonePlate(z),pw=plateW(p),x=p.x+pw+6,y=p.y;
 let R=z.x1-8;if(z.id==='ovn'&&y+20>GAUGE.y-22&&y<GAUGE.y+26)R=min(R,GAUGE.x-66);if(z.id==='skrap'&&era()===5)R=min(R,CSG.dx-CSG.dw/2-8);/* Consteel off-gas duct */let t=txt0,fs=10.5;ctx.font=`800 ${fs}px ${FONT}`;
 while(ctx.measureText(t).width+24>R-x&&fs>9){fs-=.5;ctx.font=`800 ${fs}px ${FONT}`}
 if(ctx.measureText(t).width+24>R-x){const uy=p.y+p.h+4,ux=p.x;let uR=z.x1-8;if(z.id==='ovn'&&uy+20>GAUGE.y-22&&uy<GAUGE.y+26)uR=min(uR,GAUGE.x-66);if(z.id==='skrap'&&era()===5)uR=min(uR,CSG.dx-CSG.dw/2-8);
  const row=(UPROW[z.id]||{s:[]}).s,hp=HIREPOS[z.id],clear=!row.some(q=>q[1]-70<uy+20&&q[1]+26>uy&&q[0]+40>ux&&q[0]-40<uR)&&!(hp&&hp.y-70<uy+20&&hp.y+26>uy);
  if(clear){let f2=10.5;ctx.font=`800 ${f2}px ${FONT}`;while(ctx.measureText(t).width+24>uR-ux&&f2>9){f2-=.5;ctx.font=`800 ${f2}px ${FONT}`}if(ctx.measureText(t).width+24<=uR-ux)return{x:ux,y:uy,w:ctx.measureText(t).width+24,h:20,t,fs:f2};ctx.font=`800 ${fs}px ${FONT}`}
  t=t.replace(/ \(.*\)$/,'');while(t.length>6&&ctx.measureText(t+'…').width+24>R-x)t=t.slice(0,-1);if(t!==txt0&&!txt0.startsWith(t+' ('))t+='…'}
 return{x,y,w:ctx.measureText(t).width+24,h:20,t,fs}}
function drawStatus(){for(const z of ZONES){if(!zoneBuilt(z)||!inView(z.x0+120,z.y0+20,160))continue;const p=zonePlate(z),pw=plateW(p);LOBS.push({x:p.x,y:p.y,w:pw,h:p.h});
  const s=status(z.id);if(!s||!s.lv||!s.t)continue;const col=s.lv===2?C.danger:C.hazard,L=chipLayout(z,s.t),x=L.x,y=L.y,w=L.w,t=L.t,fs=L.fs;
  const a=s.lv===2&&!RM?.8+.2*Math.sin(T*5):1;ctx.globalAlpha=a;ctx.fillStyle='rgba(16,19,26,.92)';rr(x,y,w,20,10);ctx.fill();ctx.strokeStyle=col;ctx.lineWidth=1.5;rr(x+.5,y+.5,w-1,19,10);ctx.stroke();ctx.fillStyle=col;circ(x+10,y+10,4);ctx.fill();txt(t,x+16,y+10.5,fs,col,800,'left');ctx.globalAlpha=1;LOBS.push({x,y,w,h:20})}}
const GAUGE={x:966,y:356};
function drawGauge(){const x=GAUGE.x,y=GAUGE.y,cap=fcap();if(!inView(x,y,80))return;ctx.fillStyle='rgba(14,17,23,.92)';rr(x-60,y-22,120,48,10);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.08)';ctx.lineWidth=1;rr(x-60,y-22,120,48,10);ctx.stroke();LOBS.push({x:x-60,y:y-22,w:120,h:48});
 const tc=F.temp>=1600?C.moltenhi:F.temp>=1560?C.molten:C.ui;txt(Math.round(F.temp)+' °C',x,y-6,15,tc,800);
 const bath=F.state==='tapping'?max(0,F.bath-F.tapAmt*clamp(F.tapT/3,0,1)):F.bath,stt=t_(F.stop?'STOPP':F.state==='ready'?'KLAR':F.state==='tapping'?'v§TAPPER':F.state==='refine'?(ET()==='sm'?'KOKER':ET()==='conv'?'PRØVE':'VARMER'):F.lim?'FORSYNING':F.ch&&ET()==='conv'?'CHARGERER':F.solid>0?(ET()==='conv'?'BLÅSER':'SMELTER'):F.waitHM>1.5?'RÅJERN?':'LADER');
 const fb=clamp(bath/cap,0,1),fs=clamp(F.solid/cap,0,1-fb);ctx.fillStyle='#262a32';rr(x-50,y+8,100,9,4);ctx.fill();ctx.fillStyle=C.molten;rr(x-50,y+8,100*fb,9,4);ctx.fill();if(fs>0){ctx.fillStyle=C.steell;ctx.fillRect(x-50+100*fb,y+8,100*fs,9)}
 txt(stt+' · '+Math.round(bath)+'/'+cap+' t',x,y+13,8,F.stop||F.lim?'#fff':'#111',800)}
/* ---- label pass: name plates, pile plates and ladle tonnage are drawn last, on top of the world.
   Safety net only (the static layout is overlap-free): keep plates inside the screen horizontally and,
   if two still intersect, push the later one up above it. Greedy in a fixed order, so it never jitters. ---- */
const LBL=[],LOFF={},LOBS=[];
function drawLabels(){const vx0=cam.x-cssW/2/zoom,vx1=cam.x+cssW/2/zoom,m=6/zoom,G2=3,done=LOBS.slice();
 const vy0=cam.y-cssH/2/zoom,vy1=cam.y+cssH/2/zoom;if(HUDM.top>0)done.push({x:vx0-400,y:vy0-4000,w:vx1-vx0+800,h:4000+HUDM.top/zoom,hud:1});if(HUDM.bot>0)done.push({x:vx0-400,y:vy1-HUDM.bot/zoom,w:vx1-vx0+800,h:4000,hud:1});
 for(const L of LBL)L.e=L.ax!=null&&(L.ax<vx0||L.ax>vx1)?1:0;
 LBL.sort((a,b)=>a.e-b.e||b.pr-a.pr||a.y-b.y||a.x-b.x);
 let rg=false;/* moving tonnage labels (pr 0: ladles, torpedo cars) also keep off the floor rings */
 const hitAt=(x,y,w,h)=>{for(const o of done){if(o.ring&&!rg)continue;if(x+2<o.x+o.w&&o.x+2<x+w&&y+2<o.y+o.h&&o.y+2<y+h)return o}return null};
 /* a label that had to move is never parked on a floor ring (it may sit over a ring only where it belongs) */
 const ringAt=(x,y,w,h)=>done.some(o=>o.ring&&x+2<o.x+o.w&&o.x+2<x+w&&y+2<o.y+o.h&&o.y+2<y+h);
 for(const L of LBL){let x=L.x;rg=L.pr===0;
  /* row-pad labels never move (the static layout keeps them apart); one that would sit under the HUD is simply not drawn */
  if(L.fix){if(!hitAt(x,L.y,L.w,L.h)){done.push({x,y:L.y,w:L.w,h:L.h});L.f(x,L.y)}continue}
  if(L.ax!=null){const lo=vx0+m,hi=vx1-m-L.w;if(hi>=lo&&L.ax>vx0-36&&L.ax<vx1+36)x=clamp(x,lo,hi)}
  if(L.e&&hitAt(x,L.y,L.w,L.h))continue;
  {const o=hitAt(x,L.y,L.w,L.h);if(o&&o.hud){delete LOFF[L.k];continue}}/* under the HUD: not drawn (never shoved into the scene) */
  let up=L.y,okU=false;for(let i=0;i<6;i++){const o=hitAt(x,up,L.w,L.h);if(!o){okU=true;break}up=o.y-L.h-G2}
  let y=up;if(up!==L.y){let dn=L.y,okD=false;for(let i=0;i<6;i++){const o=hitAt(x,dn,L.w,L.h);if(!o){okD=true;break}dn=o.y+o.h+G2}if(okD&&(!okU||dn-L.y<L.y-up))y=dn;else if(!okU)y=L.y}
  if(Math.abs(y-L.y)>2*L.h+6||(y===L.y&&hitAt(x,y,L.w,L.h))||(y!==L.y&&ringAt(x,y,L.w,L.h))){delete LOFF[L.k];continue}
  const o=LOFF[L.k]||(LOFF[L.k]={dy:0,t:T}),ty=y-L.y;if(T-o.t>.5)o.dy=ty;o.t=T;o.dy+=(ty-o.dy)*.35;if(Math.abs(ty-o.dy)<.5)o.dy=ty;
  let yy=L.y+o.dy;if(Math.abs(yy-y)>.5&&(hitAt(x,yy,L.w,L.h)||ringAt(x,yy,L.w,L.h))){o.dy=ty;yy=y}/* never glide across another label or pad */
  done.push({x,y:min(y,yy),w:L.w,h:L.h+Math.abs(yy-y)});L.f(x,yy)}
 LBL.length=0;LOBS.length=0}
function bolt(x,y,len){const a=rnd(0,TAU);ctx.beginPath();ctx.moveTo(x,y);let px=x,py=y;for(let i=1;i<=4;i++){px=x+Math.cos(a)*len*i/4+rnd(-5,5);py=y+Math.sin(a)*len*i/4+rnd(-5,5);ctx.lineTo(px,py)}ctx.stroke()}
function glowC(x,y,r,col,a){if(!inView(x,y,r))return;const gr=ctx.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,rgba(col,a));gr.addColorStop(1,rgba(col,0));ctx.fillStyle=gr;ctx.fillRect(x-r,y-r,r*2,r*2)}
function stream(x0,y0,x1,y1,w){ctx.lineCap='round';ctx.strokeStyle=rgba(C.molten,.9);ctx.lineWidth=9*w;ctx.beginPath();ctx.moveTo(x0,y0);ctx.quadraticCurveTo((x0+x1)/2,min(y0,y1)-14,x1,y1);ctx.stroke();ctx.strokeStyle=rgba(C.moltenhi,.9);ctx.lineWidth=3.5*w;ctx.setLineDash([10,8]);ctx.lineDashOffset=-T*160;ctx.stroke();ctx.setLineDash([]);ctx.lineCap='butt'}
function drawMovers(){for(const m of movers){const[x,y]=moverPos(m);if(!inView(x,y,30))continue;const it=m.it;
 if(it.k==='billet'||it.k==='rebar'&&m.to==='tc'||m.to==='stel')SK.billetBar(g,x-18,y,36,6,.6);else if(it.k==='coil')SK.coilTop(g,x,y,9,'#7a6a5c');else SK.bundle(g,x-18,y-4,36,3,[.2,.5,.8],it.k==='tcore'?'#3a4350':C.rebar)}}
function draw(){
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=C.frame;ctx.fillRect(0,0,cssW,cssH);
 VX0=cam.x-cssW/2/zoom-20;VX1=cam.x+cssW/2/zoom+20;VY0=cam.y-cssH/2/zoom-60;VY1=cam.y+cssH/2/zoom+60;
 ctx.save();ctx.translate(cssW/2+shx,cssH/2+shy);ctx.scale(zoom,zoom);ctx.translate(-cam.x,-cam.y);
 const sx0=clamp(VX0,WX0,WW),sy0=clamp(VY0,0,WH),sx1=clamp(VX1,WX0,WW),sy1=clamp(VY1,0,WH);
 if(sx1>sx0&&sy1>sy0)ctx.drawImage(fc,(sx0-WX0)*FS,sy0*FS,(sx1-sx0)*FS,(sy1-sy0)*FS,sx0,sy0,sx1-sx0,sy1-sy0);
 ctx.lineCap='butt';ctx.lineJoin='miter';
 /* floor rings */
 {const L=tapLadle(),tg=F.state==='ready'&&L?.5+.5*Math.sin(T*8):0;padRing(POS.tapPad.x,POS.tapPad.y,38,t_(lv('operator')?'AUTO':'TAPP'),lv('operator')?0:tg)}
 if(!rjClosed())padRing(POS.skip.x,POS.skip.y,40,t_('MALM'),0,S.rj.ore/skipCap(),'#7a4a3a');
 if(TGm.rjsale.open())padRing(POS.rjsale.x,POS.rjsale.y,40,t_('SALG')+' ×'+L1(SELLM.dock()));
 padRing(POS.bil1.x,POS.bil1.y,40,t_('SALG')+' ×'+L1(SELLM.dock()));if(B_('stel'))padRing(POS.bil2.x,POS.bil2.y,40,t_('SALG')+' ×'+L1(SELLM.dock()));
 if(B_('tog'))padRing(POS.tog.x,POS.tog.y,40,t_('TOG')+' ×'+L1(SELLM.tog()));if(B_('kai'))padRing(POS.kai.x,POS.kai.y,40,t_('KAI')+' ×'+L1(SELLM.kai()));
 if(slagOn())padRing(POS.slagp.x,POS.slagp.y,38,t_('SLAGG'),0,null,'#56524d');
 padRing(POS.plate.x,POS.plate.y,36,t_('PLATE'),0,(S.kok.slots+PIT.n)/slotsMax(),'#3a6ea8');
 if(B_('vv'))padRing(POS.gjvIn.x,POS.gjvIn.y,36,t_('EMNER'),0,1-nodeRoom('gjv')/NODE.gjv.cap,'#3a6ea8');
 if(B_('nett'))padRing(POS.nettIn.x,POS.nettIn.y,36,t_('KVEILER'),0,1-nodeRoom('nett')/NODE.nett.cap,'#3a6ea8');
 if(B_('kob'))padRing(POS.kobIn.x,POS.kobIn.y,36,t_('STENGER'),0,1-nodeRoom('kob')/NODE.kob.cap,'#3a6ea8');
 drawMovers();
 for(const s of SRC){if(s.yard)drawYard(s);else if(s.store)drawStore(s)}
 drawRJ();drawTorps();
 drawKok();for(const k of PRK)drawPileK(k);
 for(const z of TG)drawCash(z);
 drawSupply();if(E_().ch!=='belt')dropRing();drawCharge();if(E_().ch==='belt')dropRing();drawPit();drawCaster();drawGjv();drawVV();drawTC();drawStel();drawNett();drawKob();drawOvnSide();
 if(inView(POS.truck1.x,POS.truck1.y,300))drawTruckV(POS.truck1.x,POS.truck1.y,VEH.bil1);if(B_('stel')&&inView(POS.truck2.x+200,POS.truck2.y,400))drawTruckH(POS.truck2.x,POS.truck2.y,VEH.bil2);
 drawTrain();drawShip();
 drawHMStation();drawTRob();drawFurnace();drawBucketFlight();drawHMPour();
 for(const L of LADLES)if(L.state!=='lf'&&L.state!=='carried')drawLadle(L);drawShroud();
 drawLF();
 drawDesks();
 const ents=[[P,C.vest,C.helmet,capCarry()]];for(const h of helpers)if(inView(h.x,h.y,60)&&!inCab(h))ents.push([h,ROUTES[h.r].col,'#f8f6ee',0]);/* the MAX marker is for the player only */
 if(lv('operator'))ents.push([TAPPER,'#e84d3a','#f8f6ee',0]);
 ents.sort((a,b)=>a[0].y-b[0].y);for(const e of ents)drawWorker(e[0],e[1],e[2],e[3]);
 for(const L of LADLES)if(L.state==='carried')drawLadle(L);
 for(const c of CRANES)drawCraneBridge(c);
 for(const h of helpers)if(inCab(h)){const c=postCrane(h.r);if(!inView(c.x,c.y,40))continue;/* the crane driver in the cab */ctx.fillStyle=ROUTES[h.r].col;circ(c.x+5,c.y-3,4.2);ctx.fill();ctx.fillStyle='#f8f6ee';circ(c.x+5,c.y-5,3.2);ctx.fill();ctx.fillStyle='rgba(159,208,255,.55)';ctx.fillRect(c.x-10,c.y-7,8,5)}
 ctx.restore();
 /* glow pass */
 ctx.setTransform(dpr,0,0,dpr,0,0);ctx.save();ctx.translate(cssW/2+shx,cssH/2+shy);ctx.scale(zoom,zoom);ctx.translate(-cam.x,-cam.y);
 ctx.globalCompositeOperation='lighter';
 {const heatK=F.state==='melt'?.15+.6*min(1,F.bath/fcap()):1;glowC(F.x,F.y,170*F.flick,C.molten,.22*heatK);
  if(F.arc>0&&isEAF()&&inView(F.x,F.y,120)&&!F.roof){glowC(F.x,F.y,60,C.arc,.2*F.arc*F.flick)}
  if(F.state==='tapping'&&F.tapT>.6&&F.L&&inView(F.x,F.y,240)){const D=tapDur(),w=F.tapT<.9?(F.tapT-.6)/.3:F.tapT>D-.7?max(0,(D-.4-F.tapT)/.3):1;glowC(F.L.x,F.L.y,110,C.molten,.4*w);{const sp=ET()==='conv'?convMouth():ET()==='sm'?[F.x+100,F.y]:[F.x+86,F.y];stream(sp[0],sp[1],F.L.x,F.L.y-6,max(0,w))}}}
 for(const L of LADLES)if(L.steel>0)glowC(L.x,L.y,90,C.molten,(L.state==='lf'?.1:.26)*(L.steel/max(1,L.sm))+.05);
 if(inView(POS.pit.x,POS.pit.y,200)){const st=PIT.state;if(st==='pour'){const L=PIT.L;if(L){const w=PIT.fill<.08?PIT.fill/.08:PIT.fill>.94?(1-PIT.fill)/.06:1;stream(L.x,L.y+12,POS.pit.x,POS.pit.y-4,w)}glowC(POS.pit.x,POS.pit.y,160,C.molten,.35)}else if(st==='solid'||st==='strip'){glowC(POS.pit.x,POS.pit.y,140,C.molten,.2)}}
 if(B_('strang')&&inView(1500,830,260)){const k=CAST.tlev;if(k>.02)glowC(1450,830,150,C.molten,.14*k);if(CAST.pour)glowC(PBX,TUR.y,46,C.molten,.32);if(CAST.flow)glowC(1520,830,110,C.molten,.08)}
 if(LADLES.some(l=>l.state==='lf')&&inView(POS.lf.x,POS.lf.y,120)){const x=POS.lf.x,y=POS.lf.y;glowC(x,y,70,C.arc,.14);if(!RM){ctx.strokeStyle=rgba(C.arc,.9);ctx.lineWidth=2;for(let i=0;i<3;i++){const a=-PI/2+i*TAU/3;if(Math.random()<.6)bolt(x+Math.cos(a)*8,y+Math.sin(a)*8,rnd(6,14))}}}
 if(NODE.gjv.cur)glowC(POS.gjv.x,POS.gjv.y,130,C.molten,.16);if(NODE.vv.cur)glowC(2470,600,110,C.molten,.14);
 for(const p of parts){if(!inView(p.x,p.y,10))continue;const a=clamp(p.l/p.m,0,1);if(p.sq){ctx.globalCompositeOperation='source-over';ctx.fillStyle=p.c;ctx.globalAlpha=a;ctx.fillRect(p.x-3,p.y-3,6,6);ctx.globalAlpha=1;ctx.globalCompositeOperation='lighter'}else{ctx.strokeStyle=rgba(p.c.startsWith('#')?p.c:C.moltenhi,a);ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(p.x,p.y);ctx.lineTo(p.x-p.vx*.04,p.y-p.vy*.04);ctx.stroke()}}
 ctx.globalCompositeOperation='source-over';
 drawStatus();drawSwitches();drawUpPads();drawGauge();drawLabels();
 for(const f of flyers){let ex,ey;if(f.tg.stack){ex=f.tg.x;ey=f.tg.y-40-f.i*stackSp(f.tg.stack.length)}else{ex=f.tg.x;ey=f.tg.y}const t=ease(min(1,f.t)),x=lerp(f.x0,ex,t),y=lerp(f.y0,ey,t)-Math.sin(PI*t)*40;
  if(!inView(x,y,30))continue;if(f.it)drawItem(f.it,x,y,1);else{ctx.fillStyle=C.coin;circ(x,y,5);ctx.fill();ctx.fillStyle='#c98a00';circ(x,y,2.5);ctx.fill()}}
 for(const t of texts){ctx.globalAlpha=clamp(1.2-t.a,0,1);txt(t.t,t.x,t.y,15,t.c,800,'center',4);ctx.globalAlpha=1}
 ctx.restore();
 /* screen space */
 ctx.setTransform(dpr,0,0,dpr,0,0);
 if(gCache.x!=null&&!G.crane)arrow(gCache.x,gCache.y);
 for(const c of coins){const t=ease(min(1,c.t)),x=lerp(c.x0,c.tx,t),y=lerp(c.y0,c.ty,t)-Math.sin(PI*t)*60;ctx.fillStyle=C.coin;circ(x,y,7);ctx.fill();ctx.fillStyle='#fff3b0';circ(x-2,y-2,2.5);ctx.fill();ctx.strokeStyle='#c98a00';ctx.lineWidth=1.5;circ(x,y,7);ctx.stroke()}
 if(G.lvlFx>0&&!RM){ctx.globalAlpha=clamp(G.lvlFx,0,1)*.35;ctx.strokeStyle=C.good;ctx.lineWidth=10;ctx.strokeRect(5,5,cssW-10,cssH-10);ctx.globalAlpha=1}
 if(G.chFx>0&&!RM){ctx.globalAlpha=clamp(G.chFx,0,1)*.4;ctx.strokeStyle=C.hazard;ctx.lineWidth=12;ctx.strokeRect(6,6,cssW-12,cssH-12);ctx.globalAlpha=1}
 if(J.on){ctx.fillStyle='rgba(255,255,255,.08)';circ(J.ox,J.oy,JR);ctx.fill();ctx.strokeStyle='rgba(255,255,255,.25)';ctx.lineWidth=2;ctx.stroke();const dx=J.x-J.ox,dy=J.y-J.oy,m=hyp(dx,dy),k=m>JR?JR/m:1;ctx.fillStyle=G.crane?'rgba(224,176,32,.9)':'rgba(245,197,24,.85)';circ(J.ox+dx*k,J.oy+dy*k,22);ctx.fill()}
 else if(!S.moved){const a=.6+.4*Math.sin(T*4);ctx.globalAlpha=a;txt(t_('Dra hvor som helst for å gå'),cssW/2,cssH-80,15,C.ui,800,'center',4);ctx.globalAlpha=1}}
/* goal arrow: above pads and their labels, or at the screen edge pointing the way */
const PADT={};function arrow(tx,ty){const[sx,sy]=ws(tx,ty),m=34,top=max(124,HUDM.top+10),bot=cssH-max(56,HUDM.bot+6);ctx.fillStyle=C.hazard;ctx.strokeStyle='#111';ctx.lineWidth=2.5;ctx.lineJoin='round';
 const isPad=PADS.some(d=>vis(d)&&d.x===tx&&d.y===ty);
 if(sx>m&&sx<cssW-m&&sy>top&&sy<bot){const b=RM?0:Math.abs(Math.sin(T*5))*10,y=sy-(isPad?86:52)*zoom-20-b;ctx.beginPath();ctx.moveTo(sx,y+16);ctx.lineTo(sx-14,y);ctx.lineTo(sx-6,y);ctx.lineTo(sx-6,y-14);ctx.lineTo(sx+6,y-14);ctx.lineTo(sx+6,y);ctx.lineTo(sx+14,y);ctx.closePath();ctx.stroke();ctx.fill()}
 else{const cx=clamp(sx,m,cssW-m),cy=clamp(sy,top,bot),a=Math.atan2(sy-cssH/2,sx-cssW/2),p=RM?0:Math.sin(T*6)*3;ctx.save();ctx.translate(cx+Math.cos(a)*p,cy+Math.sin(a)*p);ctx.rotate(a);ctx.beginPath();ctx.moveTo(16,0);ctx.lineTo(-10,-13);ctx.lineTo(-4,0);ctx.lineTo(-10,13);ctx.closePath();ctx.stroke();ctx.fill();ctx.restore()}}
/* ======================= Consteel line (era 5), top-down with a light oblique for the tall gas-cleaning plant =======================
   open charging section (oscillating pan conveyor, loaded by the magnet crane) → dynamic seal → preheating tunnel with
   post-combustion air injectors; the off-gas runs back through the tunnel and leaves at its charging end up the duct to the
   drop-out box, bag filter, fan and stack → connecting car into the shell. */
/* pan stroke: a slow forward stroke and a fast return, so the scrap creeps forward */
const csOsc=()=>{if(RM||CSB.v<=.5)return 0;const P=.42,k=(T%P)/P;return k<.75?k/.75*2.6:2.6*(1-(k-.75)/.25)};
const csHeatC=tc=>tc<280?null:heat(clamp(.2+(tc-280)/600*.65,0,.7));
/* the scrap layer between xa and xb, from the tonnes in each conveyor cell; every chunk travels with the conveyor */
function csScrap(xa,xb,yc,w,lanes,dim){const sp=4.6,cap=csCap(),pos=CSB.pos,o=((pos%sp)+sp)%sp,k0=floor(pos/sp),n=Math.ceil((xb-xa)/sp)+2;
 for(let i=-1;i<n;i++){const x=xa+i*sp+o;if(x<xa-1||x>xb+1)continue;const ci=csI(x),d=clamp(CSB.m[ci]/cap,0,1);if(d<.015)continue;const key=i-k0,hc=csHeatC(CSB.tc[ci]);
  for(let l=0;l<lanes;l++){const h=hsh(key*3.17+l*11.31);if(h>d*1.12)continue;const a=hsh(key*5.13+l*2.37),b=hsh(key*1.7+l*7.9),yy=yc+((l+.5)/lanes-.5)*w*.88+(b-.5)*w*.16;
   const s=2+a*2.6+(d>.6?.8:0);let col=SK.SCRAPC[floor(a*4.99)%5];if(dim)col=mix(col,'#101114',dim);if(hc&&b<clamp((CSB.tc[ci]-280)/160,0,1)*.9+.1)col=heat(clamp(.2+(CSB.tc[ci]-280)/600*.65,0,.7)*(.8+.3*a));SK.chunk(g,x+(a-.5)*2,yy,s,a*2,col)}
  if(d>.55&&hsh(key*9.7)<d-.4){const a=hsh(key*2.9);let col=a>.5?'#8b8f96':'#9a6a45';if(hc)col=hc;SK.chunk(g,x,yc+(a-.5)*w*.5,3.2+a*2,a*1.6,col)}}}
function drawConsteel(){const C=CSG,y=C.y,w=C.w,hw=C.hw,osc=csOsc();
 if(inView((C.x0+C.xf)/2,y,(C.xf-C.x0)/2+60)){
 /* foundation + trench under the whole line */
 g.fillStyle='rgba(0,0,0,.3)';g.fillRect(C.x0-30,y-w/2-9,C.xt-C.x0+34,w+22);
 /* inertial drive at the tail end: motor + eccentric counterweights that shake the pan */
 {const x0=28,x1=C.x0+2;SK.box(g,x0,y-27,x1-x0,54,'#3b4048','#15171a',4);SK.hazardBar(g,x0,y-27,x1-x0,4);g.fillStyle='#2f6fb0';SK.rr(g,x0+5,y-18,15,13,2);g.fill();g.fillStyle='#24548a';g.fillRect(x0+5,y-9,15,3);
  const a=RM?0:T*18*(CSB.v>.5?1:0);for(const[cx,cy]of[[x0+15,y+11]]){g.fillStyle='#22252a';SK.circ(g,cx,cy,8);g.fill();g.fillStyle='#8b939e';g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,7,a,a+PI*.8);g.closePath();g.fill()}
  g.fillStyle='#55595f';g.fillRect(x1-6,y-12,8,24)}
 /* open charging section: support legs, frame, pan (side walls with stiffeners, floor plates) and the scrap layer */
 {const xa=C.x0,xb=C.xc;for(let x=xa+14;x<xb;x+=48){g.fillStyle='#24272c';g.fillRect(x-4,y-w/2-11,8,5);g.fillRect(x-4,y+w/2+6,8,5)}
  g.fillStyle='#3a3f46';g.fillRect(xa,y-w/2-7,xb-xa,w+14);
  g.save();g.beginPath();g.rect(xa,y-w/2-8,xb-xa,w+16);g.clip();g.translate(osc,0);
  g.fillStyle='#17191c';g.fillRect(xa-4,y-w/2,xb-xa+8,w);g.fillStyle='rgba(255,255,255,.05)';for(let x=xa-4;x<xb+4;x+=10)g.fillRect(x,y-w/2,1.4,w);
  g.fillStyle='#6b7079';g.fillRect(xa-4,y-w/2-5,xb-xa+8,5);g.fillRect(xa-4,y+w/2,xb-xa+8,5);g.fillStyle='rgba(255,255,255,.22)';g.fillRect(xa-4,y-w/2-5,xb-xa+8,1.2);
  g.fillStyle='#454a52';for(let x=xa;x<xb+4;x+=14){g.fillRect(x,y-w/2-7,2.4,7);g.fillRect(x,y+w/2,2.4,7)}g.restore();
  csScrap(xa+3,xb-1,y,w-4,4,0);
  /* hazard edge lines on the floor beside the open section (no walking on the conveyor) */
  g.fillStyle='rgba(245,197,24,.55)';for(let x=xa;x<xb;x+=16){g.fillRect(x,y-w/2-13,9,2.2);g.fillRect(x,y+w/2+11,9,2.2)}
  /* lifts just dropped by the magnet: chunks falling onto the layer, dust */
  for(const d of CSB.drops){const k=(T-d.t)/.55;if(k<0||k>1)continue;const fall=ease(min(1,k*1.6));for(let q=0;q<12;q++){const a=hsh(q*3.1+d.t),b=hsh(q*7.7+d.t);SK.chunk(g,d.x+(a-.5)*30,lerp(y-30,y,fall)+(b-.5)*w*.6,2.4+a*2.6,a*2,SK.SCRAPC[q%5])}
   if(k>.3){g.fillStyle=`rgba(150,140,128,${.3*(1-k)})`;SK.ell(g,d.x,y,18+30*k,10+12*k);g.fill()}}}
 /* dynamic seal: a portal with heavy chain curtains and a seal fan that keeps false air out of the tunnel */
 {const xa=C.xc,xb=C.xs;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(xa+3,y-hw+9,xb-xa,2*hw-12);SK.box(g,xa,y-hw+6,xb-xa,2*hw-12,'#2d3137','#121316',3);
  g.fillStyle='#17191c';g.fillRect(xa+4,y-w/2,xb-xa-8,w);csScrap(xa+4,xb-4,y,w-4,4,.45);
  for(let x=xa+6;x<xb-4;x+=4.2){const sw=RM||CSB.v<.5?0:Math.sin(T*7+x)*.8;g.strokeStyle='rgba(150,158,168,.75)';g.lineWidth=1.3;g.setLineDash([2,1.6]);g.beginPath();g.moveTo(x,y-w/2-1);g.lineTo(x+sw,y+w/2+1);g.stroke()}g.setLineDash([]);
  g.fillStyle='#4a5058';g.fillRect(xa,y-hw+6,xb-xa,4);g.fillRect(xa,y+hw-10,xb-xa,4);
  SK.pipe(g,[[(xa+xb)/2,y+hw-6],[(xa+xb)/2,y+hw+8]],7,'#5b616a',T);SK.fan(g,(xa+xb)/2,y+hw+16,9,T,9)}
 /* preheating tunnel: one long refractory-lined hood of flanged, water-cooled sections over the conveyor (arched roof, lit from
    the upper left); the off-gas from the furnace runs back through it over the scrap, so the hood is hottest at the furnace end */
 {const xa=C.xs,xb=C.xt,TL=xb-xa,ns=7,sw=TL/ns,y0=y-hw,y1=y+hw;g.fillStyle='rgba(0,0,0,.4)';SK.rr(g,xa+6,y0+8,TL,2*hw,8);g.fill();
  /* foot rails of the hood, and the cooling-water headers along both sides */
  g.fillStyle='#2a2d33';g.fillRect(xa,y0-3,TL,2*hw+6);
  const gr=g.createLinearGradient(0,y0,0,y1);gr.addColorStop(0,'#7d848d');gr.addColorStop(.32,'#9aa1aa');gr.addColorStop(.5,'#8a9099');gr.addColorStop(.78,'#5c626b');gr.addColorStop(1,'#3e434a');g.fillStyle=gr;SK.rr(g,xa,y0,TL,2*hw,7);g.fill();
  /* heat: the hood darkens and reddens toward the furnace (refractory hot face behind the steel) */
  const hg=g.createLinearGradient(xa,0,xb,0);hg.addColorStop(0,'rgba(120,60,30,0)');hg.addColorStop(.55,`rgba(140,62,30,${.16+.14*CSB.gasK})`);hg.addColorStop(1,`rgba(170,60,22,${.32+.2*CSB.gasK})`);g.fillStyle=hg;SK.rr(g,xa,y0,TL,2*hw,7);g.fill();
  /* arched-roof panel tubes (thin lines along the hood) */
  g.strokeStyle='rgba(20,24,30,.28)';g.lineWidth=1;for(let o=-hw+5;o<hw-3;o+=4.5){g.beginPath();g.moveTo(xa+3,y+o);g.lineTo(xb-3,y+o);g.stroke()}
  /* section flanges with bolts; the joint lets a thin line of the glowing layer show */
  for(let s2=0;s2<=ns;s2++){const jx=xa+s2*sw;g.fillStyle='#30343a';g.fillRect(jx-2.4,y0-2,4.8,2*hw+4);g.fillStyle='rgba(255,255,255,.18)';g.fillRect(jx-2.4,y0-2,1.2,2*hw+4);
   g.fillStyle='#1b1d21';for(let q=y0+4;q<y1-2;q+=9)SK.circ(g,jx,q,1.1),g.fill();
   if(s2>0&&s2<ns){const ci=csI(jx),d=clamp(CSB.m[ci]/csCap(),0,1),hk=clamp((CSB.tc[ci]-300)/900,0,1)*d;if(hk>.03){g.fillStyle=heat(.15+.5*hk);g.fillRect(jx-.8,y-w/2+3,1.6,w-6);g.fillStyle=rgba('#ff7a1a',.22*hk);g.fillRect(jx-4,y-w/2,8,w)}}}
  /* cooling water: supply and return headers along the south side, a hose to every section */
  g.strokeStyle='#2b6aa3';g.lineWidth=3;g.beginPath();g.moveTo(xa+4,y1+5);g.lineTo(xb-4,y1+5);g.stroke();g.strokeStyle='#4f8fd8';g.lineWidth=1.4;g.beginPath();g.moveTo(xa+4,y1+9);g.lineTo(xb-4,y1+9);g.stroke();
  for(let s2=0;s2<ns;s2++){const hx=xa+(s2+.5)*sw;g.strokeStyle='#2b6aa3';g.lineWidth=1.6;g.beginPath();g.moveTo(hx,y1+5);g.quadraticCurveTo(hx+4,y1,hx,y1-4);g.stroke()}
  /* off-gas flowing back toward the takeoff: soft chevrons along the ridge, coloured by the gas temperature */
  {const off=RM?0:(T*46)%26;for(let x=xb-12-off;x>xa+46;x-=26){const gt=csGasT(x),k=clamp((gt-200)/1000,0,1);g.strokeStyle=rgba(k>.55?'#ffc080':'#e8ddd2',(.18+.3*k)*CSB.gasK);g.lineWidth=1.6;g.beginPath();g.moveTo(x+4,y-6);g.lineTo(x-1,y-1);g.lineTo(x+4,y+4);g.stroke()}}
  /* post-combustion: air fan and manifold along the north side, six injectors into the hood (the CO in the gas burns where they blow in) */
  {const mx0=C.dx+C.dw/2+22,inj=[];for(let i=0;i<6;i++)inj.push(xa+sw*(1.25+i*.92));
   SK.pipe(g,[[mx0,y0-12],[inj[5],y0-12]],5,'#6fa8e8',T,{flow:CSB.gasK>.42?'#e8f4ff':null,speed:30});SK.fan(g,mx0-4,y0-26,9,T,10);
   for(const ix of inj){SK.pipe(g,[[ix,y0-12],[ix,y0+4]],3,'#6fa8e8',T);g.fillStyle='#2a2d33';SK.circ(g,ix,y0+6,3.8);g.fill();const fl=RM?.7:.55+.45*Math.sin(T*13+ix);g.fillStyle=rgba('#ffb040',(.3+.55*fl)*CSB.gasK);SK.circ(g,ix,y0+6,2.4);g.fill()}}
  /* heat haze rising off the hot end */
  if(!RM&&CSB.gasK>.3)SK.parts(5,.5,21,T,(f,a)=>{g.fillStyle=`rgba(255,170,90,${.07*(1-f)*CSB.gasK})`;SK.circ(g,xb-20-a*110,y-6-f*14,6+f*10);g.fill()})}
 /* connecting car: the telescopic end of the conveyor on its own carriage, in through the side opening of the shell */
 {const xa=C.xt,xb=C.xf,wc=w-8;g.fillStyle='#6d6358';g.fillRect(xa-14,y-hw+2,36,2.2);g.fillRect(xa-14,y+hw-4,36,2.2);
  SK.box(g,xa-2,y-wc/2-8,xb-xa+2,wc+16,'#3d434b','#15171a',3);SK.hazardBar(g,xa-2,y-wc/2-8,24,4);SK.hazardBar(g,xa-2,y+wc/2+4,24,4);g.fillStyle='#0f1012';for(const sx of[xa+2,xa+16])for(const sy of[-1,1]){g.fillRect(sx,y+sy*(wc/2+10)-3,8,6)}
  g.fillStyle='#1b1d21';g.fillRect(xa,y-wc/2,xb-xa,wc);csScrap(xa,xb,y,wc-2,3,0);
  g.strokeStyle='#2b6aa3';g.lineWidth=2;g.beginPath();g.moveTo(xa,y-wc/2-3);g.lineTo(xb,y-wc/2-3);g.moveTo(xa,y+wc/2+3);g.lineTo(xb,y+wc/2+3);g.stroke();
  g.fillStyle='#8b939e';g.fillRect(xa-18,y+hw-1,20,3.5);g.fillStyle='#c9ced6';g.fillRect(xa-4,y+hw-.5,8,2.5);
  const tg=clamp(CSB.feed/max(1,beltRate()),0,1);if(tg>.05){g.fillStyle=rgba('#ff8a2a',.35*tg);g.fillRect(xb-18,y-wc/2,18,wc)}}}
 /* off-gas duct from the takeoff box at the tunnel's charging end up to the drop-out box */
 if(inView(C.dx,(C.gy+y)/2,(y-C.gy)/2+40)){const x0=C.dx-C.dw/2,x1=C.dx+C.dw/2,y0=C.gy,y1=y-hw+4;
  g.fillStyle='rgba(0,0,0,.32)';g.fillRect(x0+5,y0+6,C.dw,y1-y0);
  for(let yy=y1-30;yy>y0+20;yy-=76){g.fillStyle='#24272c';g.fillRect(x0-7,yy-4,7,8);g.fillRect(x1,yy-4,7,8)}
  const gr=g.createLinearGradient(x0,0,x1,0);gr.addColorStop(0,'#9aa2ac');gr.addColorStop(.45,'#6a7078');gr.addColorStop(1,'#3e434a');g.fillStyle=gr;g.fillRect(x0,y0,C.dw,y1-y0);
  g.fillStyle='rgba(0,0,0,.35)';for(let yy=y1-14;yy>y0;yy-=38)g.fillRect(x0-2,yy,C.dw+4,3);
  {const ym=(y0+y1)/2;g.fillStyle='#3a3f46';g.fillRect(x0-3,ym-9,C.dw+6,18);g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=1;for(let q=-7;q<=7;q+=3.5){g.beginPath();g.moveTo(x0-3,ym+q);g.lineTo(x1+3,ym+q);g.stroke()}}
  if(!RM){g.save();g.beginPath();g.rect(x0+6,y0,C.dw-12,y1-y0);g.clip();g.setLineDash([5,9]);g.lineDashOffset=T*60;g.strokeStyle=`rgba(210,196,182,${.18+.25*CSB.gasK})`;g.lineWidth=3;g.beginPath();g.moveTo(C.dx,y1);g.lineTo(C.dx,y0);g.stroke();g.setLineDash([]);g.restore()}
  /* takeoff box on the first tunnel section */
  SK.box(g,x0-6,y-hw-10,C.dw+12,22,'#555c65','#15171a',3);g.fillStyle='rgba(255,255,255,.15)';g.fillRect(x0-6,y-hw-10,C.dw+12,3)}
 drawCsGas()}
/* gas cleaning above the scrap yard: drop-out box (sparks and coarse dust fall out) → bag filter → induced-draught fan → stack */
function drawCsGas(){const C=CSG;if(!inView(270,150,300))return;const H=OK;
 const obox=(x,y0,w,d,z,top,front,edge)=>{const yt=y0-z*H;g.fillStyle='rgba(0,0,0,.33)';g.fillRect(x+6,y0+6,w,d);g.fillStyle=front;g.fillRect(x,yt+d,w,y0+d-(yt+d));g.fillStyle=top;g.fillRect(x,yt,w,d);g.strokeStyle=edge;g.lineWidth=1;g.strokeRect(x+.5,yt+.5,w-1,y0+d-yt-1);return yt};
 /* drop-out box (refractory-lined settling chamber) with its dust hopper and screw */
 {const x=372,y0=200,w=64,d=62,yt=obox(x,y0,w,d,64,'#7c4a3a','#5a3328','#1d1210');g.strokeStyle='rgba(255,210,180,.18)';for(let q=x+8;q<x+w;q+=10){g.beginPath();g.moveTo(q,yt+3);g.lineTo(q,yt+d-3);g.stroke()}
  g.fillStyle='#3a2a24';g.beginPath();g.moveTo(x+12,y0+d-6);g.lineTo(x+w-12,y0+d-6);g.lineTo(x+w/2+5,y0+d+6);g.lineTo(x+w/2-5,y0+d+6);g.closePath();g.fill();
  SK.box(g,x+w+4,y0+d-14,18,16,'#4a5058','#15171a',2);SK.line(g,x+w/2,y0+d+3,x+w+8,y0+d-6,'#8b939e',3)}
 /* duct from the drop-out box into the bag filter */
 SK.pipe(g,[[372,186],[340,186]],16,'#6a7078',T,{flow:'rgba(220,210,200,.6)',speed:-26,cap:'butt'});
 /* bag filter: eight compartments with rows of pulse-jet blowpipes on the roof, dust hoppers under */
 {const x=170,y0=140,w=170,d=94,yt=obox(x,y0,w,d,82,'#8b939e','#5b636d','#24272c');
  for(let i=0;i<4;i++)for(let j=0;j<2;j++){const cx=x+6+i*40,cy=yt+6+j*42;g.fillStyle='#7a828c';g.fillRect(cx,cy,36,38);g.strokeStyle='rgba(0,0,0,.25)';g.strokeRect(cx+.5,cy+.5,35,37);
   for(let r=0;r<5;r++){g.fillStyle='#5b636d';g.fillRect(cx+3,cy+4+r*7,30,2);const on=!RM&&((floor(T*1.6)+i*2+j)%8===0)&&r===floor((T*8)%5);g.fillStyle=on?'#ffd23f':'#2f6fb0';g.fillRect(cx+31,cy+3+r*7,4,4)}}
  g.fillStyle='#3e434a';for(let i=0;i<4;i++){const hx=x+12+i*40;g.beginPath();g.moveTo(hx,y0+d-8);g.lineTo(hx+28,y0+d-8);g.lineTo(hx+18,y0+d+2);g.lineTo(hx+10,y0+d+2);g.closePath();g.fill()}
  SK.hazardBar(g,x,y0+d-12,w,3)}
 /* induced-draught fan (spiral casing + motor) and the stack */
 SK.pipe(g,[[170,214],[146,214]],12,'#6a7078',T,{flow:'rgba(230,230,230,.5)',speed:-30,cap:'butt'});
 {const fx=128,fy=212;SK.shadow(g,fx+4,fy+6,22,16,.3);g.fillStyle='#4a5058';SK.circ(g,fx,fy,18);g.fill();g.strokeStyle='#15171a';g.lineWidth=1.5;SK.circ(g,fx,fy,18);g.stroke();SK.fan(g,fx,fy,12,T,14);SK.box(g,fx-10,fy+16,20,12,'#2f6fb0','#15171a',2)}
 SK.pipe(g,[[112,206],[100,206],[100,196]],10,'#6a7078',T);
 {const sx=88,sy=196;SK.shadow(g,sx+14,sy+8,22,12,.3);SK2.cyl(g,sx,sy,14,0,215,'#6b7079','#b3bac3',44);SK2.cap(g,sx,sy-215*H,14,'#4a4f56');g.fillStyle='#15171a';SK.circ(g,sx,sy-215*H,9);g.fill();
  g.fillStyle='#d24b3a';g.fillRect(sx-14,sy-200*H,28,3);g.fillStyle='#f4f1ea';g.fillRect(sx-14,sy-194*H,28,3);
  if(!RM)SK.parts(7,.35,31,T,(f,a)=>{g.fillStyle=`rgba(220,224,230,${.16*(1-f)})`;SK.circ(g,sx+f*36+(a-.5)*8,sy-215*H-f*50,6+f*16);g.fill()})}}
/* slag door → slag chute → slag pit (Consteel: foaming slag runs over the door sill all the time the furnace melts) */
function drawCsSlag(){const x=POS.F.x,yd=POS.F.y+94,p=SLAGP,k=CSB.slk||0,f=clamp(S.pot/potMax(),0,1);if(!inView(x,(yd+p.y)/2,140))return;
 const px0=p.x-p.w/2,py0=p.y-p.h/2;
 /* the pit: concrete walls, slag heap growing toward the full mark, fresh slag glowing where it lands */
 g.fillStyle='rgba(0,0,0,.35)';SK.rr(g,px0+4,py0+6,p.w,p.h,6);g.fill();SK.box(g,px0,py0,p.w,p.h,'#5a5650','#1d1b19',6);g.fillStyle='#211e1b';SK.rr(g,px0+6,py0+6,p.w-12,p.h-12,4);g.fill();
 g.save();SK.rr(g,px0+6,py0+6,p.w-12,p.h-12,4);g.clip();
 /* the heap: a mound that grows toward the full mark; cooled lumps grey-black, the fresh tongue on top still glowing */
 {const hr=min(1,.3+f),mx=p.x,my=py0+20+18*f;const mg=g.createRadialGradient(mx,my,2,mx,my,(p.w-12)*.6*hr);mg.addColorStop(0,'#4a4540');mg.addColorStop(.7,'#2e2b28');mg.addColorStop(1,'rgba(33,30,27,0)');g.fillStyle=mg;SK.ell(g,mx,my,(p.w-14)*.55*hr,(p.h-14)*.6*hr);g.fill();
  const n=floor(10+60*f);for(let i=0;i<n;i++){const a=hsh(i*1.3)*TAU,r=Math.sqrt(hsh(i*4.1))*hr,hx=mx+Math.cos(a)*(p.w-16)*.5*r,hy=my+Math.sin(a)*(p.h-16)*.55*r;drawSlag(hx,hy,2.6+hsh(i*2.9)*3,i)}
  if(k>.05){/* fresh slag spreading from where the chute pours in */for(let i=0;i<9;i++){const a=hsh(i*5.3),b=hsh(i*7.1),r=4+a*5;g.fillStyle=heat(.42+.35*b*k);SK.ell(g,p.x+(a-.5)*26,py0+14+b*14*(.5+f),r,r*.7,a*3);g.fill()}
   const gr=g.createRadialGradient(p.x,py0+16,0,p.x,py0+16,30);gr.addColorStop(0,rgba('#ffb030',.7*k));gr.addColorStop(.5,rgba('#ff6a00',.35*k));gr.addColorStop(1,'rgba(160,40,10,0)');g.fillStyle=gr;SK.circ(g,p.x,py0+16,30);g.fill()}}
 g.restore();
 if(f>=1){g.strokeStyle=rgba(C.danger,.6+.4*Math.sin(T*8));g.lineWidth=3;SK.rr(g,px0-4,py0-4,p.w+8,p.h+8,8);g.stroke()}
 g.fillStyle='#f5c518';g.fillRect(px0,py0-3,p.w,3);
 /* chute from the door sill down into the pit */
 const c0=yd+2,c1=py0+10;g.fillStyle='rgba(0,0,0,.3)';g.fillRect(x-11,c0+2,26,c1-c0);g.fillStyle='#4a4440';g.fillRect(x-12,c0,24,c1-c0);g.fillStyle='#2a2522';g.fillRect(x-9,c0,18,c1-c0);
 /* the flowing tongue: a hot core, crust plates riding on it, sparks and fume */
 if(k>.02){const wv=yy=>RM?0:Math.sin(yy*.05+T*1.3)*.8,ww=yy=>(6.2+.8*Math.sin(yy*.13+T*1.7))*(.6+.4*k);
  const edge=dx=>{g.beginPath();g.moveTo(x+wv(c0)-ww(c0)*dx,c0);for(let yy=c0;yy<=c1+6;yy+=3)g.lineTo(x+wv(yy)-ww(yy)*dx,yy);for(let yy=c1+6;yy>=c0;yy-=3)g.lineTo(x+wv(yy)+ww(yy)*dx,yy);g.closePath()};
  /* dark skin at the edges, hot foamy core in the middle */
  edge(1);g.fillStyle=rgba('#7a2a10',.95*k);g.fill();edge(.68);const gr=g.createLinearGradient(0,c0,0,c1);gr.addColorStop(0,rgba('#ffe0a0',.95*k));gr.addColorStop(.35,rgba('#ffa040',.92*k));gr.addColorStop(1,rgba('#e0601a',.9*k));g.fillStyle=gr;g.fill();
  /* crust flakes and foam bubbles riding down with the flow */
  const sp=RM?0:T*22;for(let i=0;i<16;i++){const L=c1-c0+6,yy=c0+((i*7.3+sp)%L),a=hsh(i*3.3+floor((i*7.3+sp)/L));g.fillStyle=a>.55?rgba('#5a2614',.6*k):rgba('#fff0c0',.5*k);SK.ell(g,x+wv(yy)+(a-.5)*ww(yy)*1.1,yy,1.2+a*1.8,.8+a*.8,a*3);g.fill()}
  if(!RM){SK.parts(8,1.3,41,T,(ff,a,b)=>{g.strokeStyle=`rgba(255,${200+40*a|0},120,${(1-ff)*k})`;g.lineWidth=1.2;const sx=x+(a-.5)*10+(a-.5)*30*ff,sy=c0+6+b*(c1-c0)-ff*18+ff*ff*24;g.beginPath();g.moveTo(sx,sy);g.lineTo(sx-(a-.5)*4,sy-3);g.stroke()});
   SK.parts(6,.4,43,T,(ff,a)=>{g.fillStyle=`rgba(170,160,150,${.2*(1-ff)*k})`;SK.circ(g,x+10+ff*30+(a-.5)*10,c0+10-ff*40,5+ff*12);g.fill()})}}
 /* front loader that clears the pit (the slag carrier upgrade) */
 if(F.SB){const sy=POS.slagp,kk=F.SB.t/6,q=kk<.4?{x:lerp(sy.x,p.x-70,ease(kk/.4)),y:lerp(sy.y,p.y+4,ease(kk/.4))}:kk<.6?{x:p.x-70,y:p.y+4}:{x:lerp(p.x-70,sy.x,ease((kk-.6)/.4)),y:lerp(p.y+4,sy.y,ease((kk-.6)/.4))};
  const dir=kk<.6?1:-1,lf=kk>.4&&kk<.6?Math.sin(PI*(kk-.4)/.2):0;g.save();g.translate(q.x,q.y);g.scale(dir,1);
  SK.shadow(g,3,5,26,16,.3);g.fillStyle='#16181c';for(const[a,b]of[[-14,-13],[-14,9],[10,-13],[10,9]])g.fillRect(a-5,b,10,5);SK.box(g,-20,-11,30,22,'#e0b020','#5a4510',4);SK.box(g,-16,-8,12,16,'#2b3038','#111',2);
  g.fillStyle='rgba(159,208,255,.6)';g.fillRect(-14,-6,8,5);g.fillStyle='#6b6f76';g.fillRect(10,-3,8,6);SK.box(g,18,-14,10,28,'#8a7a40','#3a2a10',2);
  if(kk>.5){for(let i=0;i<5;i++)SK.chunk(g,22,-8+i*4,2.4,hsh(i),i%2?'#5a524a':'#3a3632')}g.restore()}}
/* temperature-measuring robot: arm on a pedestal by the slag door, probe magazine and bin for burnt probes */
const TRK={park:[[850,698],-2.2],fetch:[[896,702],-.4],mount:[[896,702],-.4],go:[[828,706],-2.55],in:[[816,700],-2.55],out:[[828,706],-2.55],eject:[[898,750],.6],home:[[850,698],-2.2]};
function tRobPose(){const st=TROB.st,nx=TROBN[st],a=TRK[st],b=st==='park'?TRK.park:TRK[nx],d=TROBD[st]||1,k=st==='park'||st==='mount'?0:ease(clamp(TROB.t/d,0,1));
 const from=st==='in'?TRK.go:a,to=st==='in'?TRK.in:b,kk=st==='in'?(TROB.t<d*.25?ease(TROB.t/(d*.25)):TROB.t>d*.8?1-ease((TROB.t-d*.8)/(d*.2)):1):k;
 const A=st==='in'?from:a,B=st==='in'?to:b;return{x:lerp(A[0][0],B[0][0],kk),y:lerp(A[0][1],B[0][1],kk),a:lerp(A[1],B[1],kk),ext:st==='in'?kk:0,probe:st==='mount'?TROB.t/TROBD.mount:['go','in','out','eject'].indexOf(st)>=0?1:0,burnt:st==='out'||st==='eject'}}
function drawTRob(){if(era()!==5)return;const b=TROBP;if(!inView(b.x,b.y,90))return;const p=tRobPose();
 /* probe magazine (cardboard tubes) and bin */
 SK.box(g,884,688,26,22,'#3b4048','#15171a',3);for(let i=0;i<4;i++){g.fillStyle='#c9a36a';g.fillRect(887+i*5.6,692,4,14);g.fillStyle='#6b4a2a';g.fillRect(887+i*5.6,692,4,2)}
 SK.box(g,886,740,24,20,'#4a4440','#15171a',3);g.fillStyle='#211e1b';g.fillRect(889,743,18,14);for(let i=0;i<3;i++)SK.chunk(g,893+i*5,750,2.4,i*.4,'#3a2a20');
 /* pedestal + two-link arm (simple inverse kinematics) + lance with the probe */
 SK.shadow(g,b.x+3,b.y+5,20,14,.35);g.fillStyle='#3a3f46';SK.circ(g,b.x,b.y,16);g.fill();SK.hazardBar(g,b.x-16,b.y+10,32,4);g.fillStyle='#e8762a';SK.circ(g,b.x,b.y,11);g.fill();
 const L1=30,L2=28,dx=p.x-b.x,dy=p.y-b.y,dd=clamp(hyp(dx,dy),4,L1+L2-1),ba=Math.atan2(dy,dx),ca=Math.acos(clamp((L1*L1+dd*dd-L2*L2)/(2*L1*dd),-1,1)),ea=ba+ca,ex=b.x+Math.cos(ea)*L1,ey=b.y+Math.sin(ea)*L1;
 g.lineCap='round';g.strokeStyle='#c4581c';g.lineWidth=9;g.beginPath();g.moveTo(b.x,b.y);g.lineTo(ex,ey);g.stroke();g.strokeStyle='#e8762a';g.lineWidth=7;g.beginPath();g.moveTo(b.x,b.y);g.lineTo(ex,ey);g.lineTo(p.x,p.y);g.stroke();
 g.fillStyle='#2a2d33';SK.circ(g,ex,ey,4.5);g.fill();SK.circ(g,b.x,b.y,5);g.fill();
 const la=p.a,ll=34+p.ext*30,tx=p.x+Math.cos(la)*ll,ty=p.y+Math.sin(la)*ll;g.strokeStyle='#8b939e';g.lineWidth=3.5;g.beginPath();g.moveTo(p.x,p.y);g.lineTo(tx,ty);g.stroke();g.strokeStyle='rgba(255,255,255,.4)';g.lineWidth=1;g.beginPath();g.moveTo(p.x,p.y-1);g.lineTo(tx,ty-1);g.stroke();
 if(p.probe>0){const pl=9*min(1,p.probe);g.strokeStyle=p.burnt?'#3a2416':'#c9a36a';g.lineWidth=4.5;g.beginPath();g.moveTo(tx,ty);g.lineTo(tx+Math.cos(la)*pl,ty+Math.sin(la)*pl);g.stroke()}
 g.lineCap='butt';g.fillStyle='#2a2d33';SK.circ(g,p.x,p.y,4);g.fill();
 if(TROB.st==='in'&&TROB.t>TROBD.in*.2&&TROB.t<TROBD.in*.8){g.fillStyle=rgba('#ffb030',.5);SK.circ(g,POS.F.x+4,POS.F.y+92,7);g.fill()}
 /* the reading over the robot while it is fresh */
 if(TROB.show>0&&TROB.n>0){const s=TROB.val+' °C',a=clamp(TROB.show/.6,0,1);ctx.font=`800 11px ${FONT}`;const w=ctx.measureText(s).width+12;LBL.push({k:'trob',x:b.x+18,y:b.y-56,w,h:17,pr:0,ax:b.x,f:(lx,ly)=>{ctx.globalAlpha=a;ctx.fillStyle='rgba(14,17,23,.92)';rr(lx,ly,w,17,8);ctx.fill();ctx.strokeStyle=rgba(C.moltenhi,.8);ctx.lineWidth=1.2;rr(lx+.5,ly+.5,w-1,16,8);ctx.stroke();txt(s,lx+w/2,ly+9,11,C.moltenhi,800);ctx.globalAlpha=1}})}}
