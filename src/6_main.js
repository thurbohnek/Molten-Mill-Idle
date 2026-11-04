
/* ---------- intro (Studio.grane) ---------- */
function branch(x,y,len,a,d,g){const p=clamp(g*5-d,0,1);if(p<=0)return;const x2=x+Math.cos(a)*len*p,y2=y+Math.sin(a)*len*p;
 ctx.strokeStyle=C.ui;ctx.lineWidth=max(1.2,6-d*1.2);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke();
 if(p>=1&&d<4){branch(x2,y2,len*.7,a-.48,d+1,g);branch(x2,y2,len*.7,a+.48,d+1,g);if(d<1)branch(x2,y2,len*.62,a,d+1,g)}else if(p>=1){ctx.fillStyle=C.molten;circ(x2,y2,2.6);ctx.fill()}}
function drawIntro(){ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=C.bg;ctx.fillRect(0,0,cssW,cssH);const t=G.introT,cx=cssW/2,cy=cssH/2-20;
 ctx.lineCap='round';branch(cx,cy+10,40,-PI/2,0,RM?1:clamp(t/1.1,0,1));
 const ta=clamp((t-.5)/.5,0,1);ctx.globalAlpha=ta;ctx.font=`800 30px ${FONT}`;ctx.textBaseline='middle';const w1=ctx.measureText('Studio').width,w2=ctx.measureText('.grane').width,x0=cx-(w1+w2)/2;
 ctx.textAlign='left';ctx.fillStyle=C.ui;ctx.fillText('Studio',x0,cy+50);ctx.fillStyle=C.molten;ctx.fillText('.grane',x0+w1,cy+50);
 txt(t_('presenterer'),cx,cy+82,12,C.uidim,600);ctx.globalAlpha=1;
 if(t>1.45){ctx.fillStyle=`rgba(11,13,18,${clamp((t-1.45)/.35,0,1)})`;ctx.fillRect(0,0,cssW,cssH)}
 if(t>=1.8)drawTitle(t-1.8)}
/* second beat: the game's title card, glowing like a fresh tap */
function drawTitle(t){ctx.fillStyle=C.bg;ctx.fillRect(0,0,cssW,cssH);const cx=cssW/2,cy=cssH/2-10,a=clamp(t/.35,0,1)*(1-clamp((t-1.25)/.35,0,1));
 ctx.globalAlpha=a;const fs=min(54,cssW*.13),g=ctx.createRadialGradient(cx,cy,10,cx,cy,cssW*.6);g.addColorStop(0,'rgba(255,122,26,.28)');g.addColorStop(1,'rgba(255,122,26,0)');ctx.fillStyle=g;ctx.fillRect(0,0,cssW,cssH);
 ctx.font=`800 ${fs}px ${FONT}`;ctx.textAlign='center';ctx.textBaseline='middle';const lg=ctx.createLinearGradient(0,cy-fs*1.1,0,cy+fs*.4);lg.addColorStop(0,C.moltenhi);lg.addColorStop(1,C.molten);
 ctx.shadowColor='rgba(255,122,26,.7)';ctx.shadowBlur=RM?0:18;ctx.fillStyle=lg;ctx.fillText('MOLTEN',cx,cy-fs*.55);ctx.fillStyle=C.ui;ctx.shadowBlur=0;ctx.fillText('MILL',cx,cy+fs*.45);
 ctx.fillStyle=C.hazard;ctx.fillRect(cx-fs*1.3,cy+fs*1.05,fs*2.6,4);
 txt('IDLE · STEEL TYCOON',cx,cy+fs*1.05+22,13,C.uidim,800);ctx.globalAlpha=1}
function endIntro(){if(G.mode!=='intro')return;G.mode='play';stage.classList.remove('intro');try{cv.focus({preventScroll:true})}catch(e){}
 if(G.offline>0)toast(t_('Mens du var borte: +{0}',kr(G.offline)));else if(S.bonusGiven&&!S.heats){toast(t_('Nytt verk! Nå starter du helt fra malmen: masovn, torpedovogner og Bessemer-konverter.'));toast(t_('Startbonus fra forrige verk: +{0}',kr(S.bonusGiven)),true);S.bonusGiven=false;save()}else if(!S.heats&&!S.ph)toast(t_('Fase 1: Masovn og Bessemer-konverter'),true);
 /* once per player: everything in the plant can be tapped for an explanation */
 if(!S.infoHint){S.infoHint=1;toast(t_('Trykk på hva som helst for en forklaring'));save()}}

/* ---------- input ---------- */
const rel=e=>{const r=cv.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]};
cv.addEventListener('pointerdown',e=>{initAudio();if(G.mapOn)return;if(menu.classList.contains('on'))openMenu(false);if(G.mode==='intro'){endIntro();return}if(J.on||G.modal)return;const[x,y]=rel(e);J.on=true;J.id=e.pointerId;J.ox=J.x=x;J.oy=J.y=y;J.t0=performance.now();try{cv.setPointerCapture(e.pointerId)}catch(_){}e.preventDefault()});
cv.addEventListener('pointermove',e=>{if(!J.on||e.pointerId!==J.id)return;const[x,y]=rel(e);J.x=x;J.y=y});
const pUp=e=>{if(e.pointerId!==J.id)return;if(J.on&&e.type==='pointerup'&&performance.now()-(J.t0||0)<350&&Math.hypot(J.x-J.ox,J.y-J.oy)<12){const wx=cam.x+(J.ox-cssW/2)/zoom,wy=cam.y+(J.oy-cssH/2)/zoom;if(!padUnlock(wx,wy))tapInfo(wx,wy,J.t0||0)}J.on=false};cv.addEventListener('pointerup',pUp);cv.addEventListener('pointercancel',pUp);cv.addEventListener('lostpointercapture',pUp);
const KM={ArrowLeft:'l',KeyA:'l',ArrowRight:'r',KeyD:'r',ArrowUp:'u',KeyW:'u',ArrowDown:'d',KeyS:'d'};
addEventListener('keydown',e=>{initAudio();if(G.mode==='intro'&&(e.key===' '||e.key==='Enter'||KM[e.code])){endIntro()}
 if(e.key==='Escape'){if(INFO.on){hideInfo();if(!G.modal&&!G.mapOn&&!menu.classList.contains('on'))return}if(G.modal)closeModal();else if(G.mapOn){openMap(false);try{$('mapBtn').focus()}catch(_){}}else if(menu.classList.contains('on')){openMenu(false);try{mBtn.focus()}catch(_){}}return}
 if(G.modal||menu.classList.contains('on')||G.mapOn)return;if(e.code==='KeyK'){toggleCrane();return}if(e.key==='+'||e.code==='Equal'||e.code==='NumpadAdd'){setUZ(UZ*1.15);return}if(e.key==='-'||e.code==='Minus'||e.code==='NumpadSubtract'){setUZ(UZ/1.15);return}if((e.code==='Space'||e.code==='Enter')&&G.mode!=='intro'&&document.activeElement===cv||e.code==='KeyE'){if(padUnlock()){e.preventDefault();return}}const k=KM[e.code];if(k){keys[k]=1;e.preventDefault()}if(e.code==='KeyM')toggleMute()});
addEventListener('keyup',e=>{const k=KM[e.code];if(k)keys[k]=0});
addEventListener('blur',()=>{for(const k in keys)keys[k]=0;J.on=false});

/* ---------- save / resize / loop ---------- */
function save(){S.t=Date.now();
 const piles={};for(const k of PRK)piles[k]=PILE[k].map(packIt);
 /* steel in transit is stored safely: ladle steel becomes ingots, the caster run-out and cooling bed become billets, items on roller tables join the next queue */
 for(const L of LADLES){if(L.state==='filling')continue;const n=floor(L.steel/IT());for(let i=0;i<n;i++)piles.ingot.push(packIt({k:'ingot',t:IT(),q:L.q||1}))}
 for(const r of CAST.run)piles.billet.push(packIt({k:'billet',t:r.t,q:r.q}));for(const b of CAST.bed)piles.billet.push(packIt(b.it));
 if(PIT.n&&(PIT.state==='solid'||PIT.state==='strip'))for(let i=0;i<PIT.n;i++)piles.ingot.push(packIt({k:'ingot',t:PIT.ingT,q:PIT.L?PIT.L.q:1}));
 const nodes={};for(const id in NODE){const n=NODE[id];nodes[id]=(n.cur?[n.cur]:[]).concat(n.in).map(packIt)}for(const m of movers)nodes[m.to].push(packIt(m.it));
 const cash={};for(const z of TG)if(z.cash)cash[z.id]=z.cash;
 /* liquid råjern in torpedo cars goes back to the hearth; whatever does not fit is cast to pigs */
 let hearth=S.rj.hearth+RJ.pigAcc;for(const c of TORPS)hearth+=c.load;const hc=rjClosed()?0:hearthCap();while(hearth>hc+PIG_T*.5){hearth-=PIG_T;piles.pig.push(packIt({k:'pig',t:PIG_T,q:1}))}
 const fch=F.ch?(F.ch.hm!=null?F.ch.s+F.ch.hm:F.ch.done?0:F.ch.amt):0;
 const out=Object.assign({},S,{pp:{x:Math.round(P.x),y:Math.round(P.y),stack:P.stack.map(packS)},piles,nodes,store:Object.assign({},ST),cash,kok:Object.assign({},S.kok,{slots:S.kok.slots+PIT.n,cool:S.kok.cool.slice()}),F:{bath:F.state==='tapping'?0:F.bath+(F.hmCh?F.hmCh.amt:0),solid:F.solid+fch,scIn:F.scIn+(F.ch&&F.ch.hm!=null?F.ch.s:0),hmIn:F.hmIn+(F.ch&&F.ch.hm!=null?F.ch.hm:0)+(F.hmCh?F.hmCh.amt:0)},rj:{ore:S.rj.ore,hearth:max(0,hearth)},torp:[]});
 try{localStorage.setItem(KEY,JSON.stringify(out))}catch(e){}}
setInterval(save,4000);document.addEventListener('visibilitychange',()=>{if(document.hidden)save()});addEventListener('pagehide',save);
function resize(){const r=stage.getBoundingClientRect();cssW=max(200,r.width);cssH=max(300,r.height);dpr=min(2,window.devicePixelRatio||1);
 cv.width=Math.round(cssW*dpr);cv.height=Math.round(cssH*dpr);BZ=clamp(min(cssW/400,cssH/1000),.6,1.3);zoom=BZ*UZ}
/* player zoom: pinch, mouse wheel, +/- keys or the menu buttons; remembered per device */
let BZ=1,UZ=1;try{UZ=clamp(+localStorage.getItem('molten.uz')||1,.85,1.9)}catch(e){}
function setUZ(v){UZ=clamp(v,.85,1.9);zoom=BZ*UZ;try{localStorage.setItem('molten.uz',String(UZ))}catch(e){}const a=$('mZo'),b=$('mZi');if(a)a.disabled=UZ<=.86;if(b)b.disabled=UZ>=1.89}
{let pin=null;const D=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);
 cv.addEventListener('touchstart',e=>{if(e.touches.length===2&&!G.mapOn){pin={d:D(e.touches),z:UZ};J.on=false;e.preventDefault()}},{passive:false});
 cv.addEventListener('touchmove',e=>{if(pin&&e.touches.length===2){e.preventDefault();setUZ(pin.z*D(e.touches)/max(1,pin.d))}},{passive:false});
 const end=e=>{if(e.touches.length<2)pin=null};cv.addEventListener('touchend',end);cv.addEventListener('touchcancel',end);
 cv.addEventListener('wheel',e=>{if(G.mapOn)return;e.preventDefault();setUZ(UZ*Math.exp(-(e.deltaMode===1?e.deltaY*16:e.deltaY)*(e.ctrlKey?.01:.0015)))},{passive:false})}
applyLangDom();resize();setUZ(UZ);addEventListener('resize',resize);try{new ResizeObserver(resize).observe(stage)}catch(e){}
syncMenu();
let last=performance.now();
function frame(now){const dt=min(.05,max(0,(now-last)/1000));last=now;
 try{if(G.mode==='intro'){G.introT+=dt;drawIntro();if(G.introT>=3.4)endIntro()}else{update(dt);draw()}}catch(err){console.error(err)}
 requestAnimationFrame(frame)}
requestAnimationFrame(frame);
/* test hook (harmless in production) */
window.__smelt={get S(){return S},t_,setLang,get LANG(){return LANG},I18N_MISS,EN,IX,INFO,hitInfo,infoFor,showInfo,hideInfo,tapInfo,KNAME,MN,PNAME,TNAME,TOGN,CASTN,MIXN,RJE,fmt,kr,upSub,upName,padTitle,status_all:()=>ZONES.map(z=>status(z.id)),mapSel:id=>{MSEL=id},mapMode:m=>{MMODE=m},syncMenu,hud,padUnlock,chipLayout,GAUGE,RJ,TORPS,rjEra,rjClosed,hmNeed,hmCap,skipCap,torpCap,hearthCap,rjPow,rjSupCap,scrapMax,scrapMin,usesHM,ET,isEAF,WX0,pileOn,closeRJ,RJE,status_:null,route,addPile,P,F,LADLES,PIT,CAST,NODE,PILE,movers,helpers,SRC,SRCm,TG,TGm,PADS,PAD,SW,BUILDS,UP,UPm,HIRE,ZONES,ZN,CRANES,CRm,G,J,keys,ST,RT,update,draw,endIntro,navStep,cost,vis,buy,workAvail,count,accepts,freeFor,fcap,capCarry,hcap,presGain,doPrestige,doReset,save,syncHelpers,openPresModal,closeModal,carryTask,goal,demand,recommend,buyTarget,bestTarget,flipSw,val,curUp,padName,padSub,paidKey,status,bottlenecks,rate,flow,furnRate,Rpow,supCap,era,E_,ERA,chgCap,toggleCrane,craneHere,openMap,renderMap,
 build:id=>{const i=BUILDS.findIndex(b=>b.id===id);for(let k=S.ph;k<=i;k++){S.b[BUILDS[k].id]=1;S.ph=k+1;onBuild(BUILDS[k])}},
 hire:(st,n)=>{S.lv[HIRE[st].id]=n;syncHelpers()},setLv:(id,n)=>{S.lv[id]=n;syncHelpers();syncLadles();if(id==='yard2'||id==='magkran'||id==='varm')bakeFloor()},
 collide,SOLIDS:()=>SOLIDS,blockedPt,field,rebuildNav,rebuildSolids,bakeFloor,POS,WW,WH,QX,QY,START:POS.start,SUPN,PR,PRK,ROUTES,startTap,tapLadle,potMax,slotsMax,cam,setZoom:z=>{zoom=z},padLab,zonePlate,plateW,B_,lv,CY,cashAt,prodOn,ROLL,get zoom(){return zoom},ws,nextBuild,nodeRoom,yardT,PADPOS,inZone,SY,layoutPads,padShown,padMaks,padUrgent,upOpen,upAvail,routeWork,POSTS,inCab,postCrane,TAPDESK,UPROW,HIREPOS,padTitle};
}
window.claude?.hot?.ready ? window.claude.hot.ready(start) : start(window.claude?.hot?.data ?? {});
</script>
