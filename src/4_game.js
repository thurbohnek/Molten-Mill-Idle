
/* ---------- effects ---------- */
function spark(x,y,n,sp,c,life,up){if(RM)n=Math.ceil(n/2);for(let i=0;i<n&&parts.length<320;i++){const a=up!=null?up+rnd(-.9,.9):rnd(0,TAU),s=rnd(.3,1)*sp;parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,l:rnd(.5,1)*(life||.6),m:life||.6,c:c||C.moltenhi,g:120})}}
function confetti(x,y,n){const cols=[C.hazard,C.molten,C.good,C.ui];n=n||30;if(RM)n=floor(n/2.5);for(let i=0;i<n&&parts.length<400;i++){const a=rnd(0,TAU),s=rnd(60,220);parts.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-80,l:rnd(.6,1.1),m:1.1,c:cols[i%4],g:260,sq:1})}}
function ftext(t,x,y,c){if(texts.length>40)texts.shift();texts.push({t,x,y,c:c||C.ui,a:0})}
function fly(it,x,y,tg,i){if(flyers.length>80)flyers.shift();flyers.push({it,x0:x,y0:y,tg,i,t:0,d:.22})}
const qT=[];let tOn=0;function toast(m,big){if(qT.length>4)qT.shift();qT.push([m,!!big])}
function moneyTarget(){const a=$('mv').getBoundingClientRect(),b=cv.getBoundingClientRect();return[a.left-b.left-12,a.top-b.top+a.height/2]}
function bumpMoney(){const e=$('money');e.classList.remove('bump');void e.offsetWidth;e.classList.add('bump')}
function ws(x,y){return[(x-cam.x)*zoom+cssW/2+shx,(y-cam.y)*zoom+cssH/2+shy]}

/* ---------- main update ---------- */
const J={on:false,id:0,ox:0,oy:0,x:0,y:0};const JR=48;const keys={};
const HUDM={t:-9,top:0,bot:0};
function update(dt){
 T+=dt;S.st.play+=dt;
 let ix=0,iy=0;
 if(!G.modal&&!G.mapOn){if(J.on){const dx=J.x-J.ox,dy=J.y-J.oy,m=hyp(dx,dy);if(m>6){const k=min(1,m/JR);ix=dx/m*k;iy=dy/m*k}}
  if(keys.l)ix-=1;if(keys.r)ix+=1;if(keys.u)iy-=1;if(keys.d)iy+=1}
 const im=hyp(ix,iy);if(im>1){ix/=im;iy/=im}
 if(im>.1&&!S.moved)S.moved=true;
 const cr=G.crane?CRm[G.crane]:null;if(cr&&!canMan(cr)){G.crane=null;cr.man=false}
 const px=cr?0:ix,py=cr?0:iy;
 const sp=speed(),kk=min(1,dt*14);P.vx=lerp(P.vx,px*sp,kk);P.vy=lerp(P.vy,py*sp,kk);P.x+=P.vx*dt;P.y+=P.vy*dt;collide(P);
 const pm=hyp(P.vx,P.vy);P.moving=pm>20;if(P.moving)P.walk+=dt*pm*.07;
 if(!cr)act(P,dt);
 for(const s of[P,...helpers])for(const it of s.stack)it.age=(it.age||0)+dt;
 if(!cr&&near(P,POS.tapPad.x,POS.tapPad.y,44)&&F.state==='ready'){if(tapLadle())startTap();else if(T-G.tapHint>2.5){G.tapHint=T;ftext(t_('Ingen tom øse under tappen'),POS.tapPad.x,POS.tapPad.y-50,C.uidim)}}
 updPads(dt);collectCash();
 {const n=helpers.length;G.hOff=(G.hOff+1)%max(1,n);for(let i=0;i<n;i++)hUpdate(helpers[(i+G.hOff)%n],dt)}
 /* yards and small stores refill by themselves */
 for(const id of['y0','y1']){const s=SRCm[id];if(s.open())S.yard[id]=min(yardCap(),yardT(s)+yardRate()*dt)}
 G.stT=(G.stT||0)+dt;if(G.stT>storeIv()){G.stT=0;for(const k in ST)if(ST[k]<storeMax())ST[k]++}
 updRJ(dt);updFurnace(dt);updParked(dt);for(const L of LADLES)updLadle(L,dt);
 for(const c of CRANES)updCrane(c,dt,c===cr?ix:0,c===cr?iy:0);
 updPit(dt);updCaster(dt);updFlow(dt);updRates(dt);
 updVeh(VEH.bil1,dt,520);updVeh(VEH.bil2,dt,900);updVeh(VEH.tog,dt,1200);updVeh(VEH.kai,dt,1100);
 for(let i=parts.length-1;i>=0;i--){const p=parts[i];p.l-=dt;if(p.l<=0){parts.splice(i,1);continue}p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=p.g*dt;p.vx*=.985;p.vy*=.985}
 for(let i=flyers.length-1;i>=0;i--){const f=flyers[i];f.t+=dt/f.d;if(f.t>=1)flyers.splice(i,1)}
 for(let i=texts.length-1;i>=0;i--){const t=texts[i];t.a+=dt;t.y-=dt*30;if(t.a>1.2)texts.splice(i,1)}
 for(let i=coins.length-1;i>=0;i--){const c=coins[i];c.t+=dt/c.d;if(c.t<0)continue;if(c.t>=1){coins.splice(i,1);bumpMoney()}}
 G.winT+=dt;if(G.winT>=10){S.rate=S.rate*.7+(G.earnWin/G.winT)*.3;G.earnWin=0;G.winT=0;S.st.best=max(S.st.best||0,S.rate)}
 checkLevel();G.lvlFx=max(0,G.lvlFx-dt);G.chFx=max(0,G.chFx-dt);
 if(!workAvail()){G.idleT+=dt;G.idleS+=dt}else if(!workAvail(1))G.idleS+=dt;
 /* camera: follows the player, or the crane hook while you steer a crane */
 const vw=cssW/zoom,vh=cssH/zoom,lk=min(1,dt*6),fx=cr?cr.x:P.x+P.vx*.15,fy=cr?cr.y:P.y+P.vy*.15;
 cam.x=lerp(cam.x,fx,lk);cam.y=lerp(cam.y,fy,lk);
 if(T-HUDM.t>.5){HUDM.t=T;try{const st=$('stage').getBoundingClientRect(),g=$('goal').getBoundingClientRect(),s=$('stat').getBoundingClientRect();
   if(g.height>0)HUDM.top=g.bottom-st.top+10;if(s.height>0)HUDM.bot=st.bottom-s.top+10}catch(e){}}
 const pt=max(150,HUDM.top/zoom),pb=max(90,HUDM.bot/zoom);
 cam.x=vw>=WW-WX0?(WW+WX0)/2:clamp(cam.x,WX0+vw/2-40,WW-vw/2+40);cam.y=vh>=WH+pt+pb?WH/2+(pb-pt)/2:clamp(cam.y,vh/2-pt,WH-vh/2+pb);
 shake=max(0,shake-dt*10);shx=shake?rnd(-shake,shake):0;shy=shake?rnd(-shake,shake):0;
 setLoops();
 if(tOn>0){tOn-=dt;if(tOn<=0)$('toast').classList.remove('on')}else if(qT.length&&tOn<=0&&!G.modal){const e=$('toast'),[m,b]=qT.shift();e.textContent=m;e.classList.toggle('big',b);e.classList.add('on');tOn=b?2.6:2.2}
 hud();if(G.mapOn){G.mapT=(G.mapT||0)+dt;if(G.mapT>1){G.mapT=0;renderMap()}}
 if(INFO.on){INFO.t+=dt;if(INFO.t>1){INFO.t=0;refreshInfo()}}
}
function checkLevel(){let n=0;while(S.earned>=LVL_T(S.lvl)&&n<5){const b=Math.round(LVL_T(S.lvl)*.1);S.lvl++;n++;S.money+=b;
  toast(t_('Verksnivå {0}! Bonus +{1}',S.lvl+1,kr(b)),true);sfx('mile');buzz([30,40,30,40,60]);G.lvlFx=1.6;confetti(P.x,P.y-30,60)}}

/* ---------- goals: the phase goal on top, the next useful action under it, an arrow to where to go ---------- */
const TNAME={skip:'skipet',rjsale:'malmtoget',drop:'chargeringen',rack:'elektrodestativet',plate:'bunnplata',koklag:'kokillelageret',slagp:'slaggplassen',bil1:'lastebilen',bil2:'lastebil 2',tog:'toget',kai:'kaia',gjvIn:'gjennomvarmingsovnen',nettIn:'nettverket',kobIn:'klipp og bøy'};
function bestTarget(a,it){let best=null,bv=-1e9;for(const z of TG){if(!z.open()||!accepts(z,it)||freeFor(z,it.k)<=0)continue;const d=hyp(z.x-a.x,z.y-a.y);
  let v=-d/400;if(z.sell)v+=SELLM[z.sell]()*1.2;if(!z.sell)v+=3;if(isProd(it.k)&&!z.sell&&handNext(it.k)!==z)v-=9;if(v>bv){bv=v;best=z}}return best}
function srcPrio(s,n){const k=s.kind;
 if(s.pile)return n>=3?6+min(4,n/5):2;
 if(k==='slag')return S.pot>=potMax()-1?12:S.pot>=3?5:1.5;
 if(k==='kokk')return pitRoom()>0?(PIT.state==='idle'&&LADLES.some(l=>l.state==='pit')?9:5):0;
 if(k==='kokv')return n>=3?5:2.5;
 if(k==='scrap'&&era()===5)return csLim()==='kran'?3:0;/* Consteel: the charging crane does it; carry only when the crane cannot keep up */
 if(k==='scrap')return era()===0?(S.chg<SCRAP_T?2:.8):S.chg<chgCap()*.6?5:2.5;
 if(k==='ore')return S.rj.ore<skipCap()*.6?(F.waitHM>0?7:5.5):2.5;
 if(k==='elek')return S.elek<4?7:2;
 return(S[k]|0)<2?4:1.2}
function carryTask(){
 if(P.stack.length){for(const it of stackKinds(P)){const z=bestTarget(P,it);if(z)return{x:z.x,y:z.y,m:t_('Bær {0} til {1}',t_(KNAME[it.k]),t_(TNAME[z.id]))}}if(P.stack.length>=capCarry())return null}
 const c=[];
 for(const s of SRC){if(!s.open())continue;const n=count(s);if(n<=0)continue;if(P.stack.filter(i=>i.k===s.kind).length>=demand(s.kind))continue;const z=bestTarget(s,{k:s.kind,t:1});if(!z)continue;
  let pr=srcPrio(s,n);if(pr<=0)continue;pr-=hyp(s.x-P.x,s.y-P.y)/600;c.push({s,pr})}
 c.sort((a,b)=>b.pr-a.pr);if(!c.length)return null;const s=c[0].s;
 return{x:s.x,y:s.y,m:t_(s.kind==='ore'?'Hent {0} fra malmlageret':s.yard?'Hent {0} fra skraphaugen':s.kind==='kokk'?'Hent {0} fra kokillelageret':s.kind==='kokv'?'Hent {0} ved bunnplata':s.kind==='slag'?'Hent {0} fra slaggpotta':s.store?'Hent {0} fra lageret':'Hent {0}',t_(KNAME[s.kind]))}}
function tutor(){const L=tapLadle();
 if(F.state==='ready'&&L&&!lv('operator'))return{x:POS.tapPad.x,y:POS.tapPad.y,m:t_('Gå på <span>TAPP</span> for å tappe ovnen')};
 const ks=stackKinds(P).map(i=>i.k);
 if(ks.indexOf('ingot')>=0)return{x:POS.bil1.x,y:POS.bil1.y,m:t_('Selg støpeblokkene på <span>lastebilen</span>')};
 if(ks.indexOf('kokk')>=0&&pitRoom()>0)return{x:POS.plate.x,y:POS.plate.y,m:t_('Sett kokillene på <span>bunnplata</span>')};
 if(ks.indexOf('kokv')>=0)return{x:POS.koklag.x,y:POS.koklag.y,m:t_('Bær varme kokiller til <span>kokillelageret</span>')};
 if(ks.indexOf('ore')>=0&&S.rj.ore<skipCap()-ORE_T)return{x:POS.skip.x,y:POS.skip.y,m:t_('Legg malmen i <span>skipet</span> – den går opp i masovnen')};
 if(ks.indexOf('scrap')>=0&&S.chg<chgCap()-1)return{x:POS.drop.x,y:POS.drop.y,m:t_('Legg skrapet i <span>{0}</span>',t_(ET()==='conv'?'skrapkassa':'chargeringskassene'))};
 if(PILE.ingot.length>0)return{x:PR.ingot.pile.x,y:PR.ingot.pile.y,m:t_('Hent <span>støpeblokkene</span>')};
 if(PIT.state!=='idle')return{m:t_(PIT.state==='pour'?'Stigstøping: stålet stiger i kokillene!':PIT.state==='strip'?'Strippekranen løfter av kokillene':'Blokkene størkner …')};
 if(!rjClosed()&&S.rj.ore<skipCap()*.6&&count(SRCm.ore)>0)return{x:POS.ore.x,y:POS.ore.y,m:t_('Hent malm i <span>malmlageret</span>')};
 if(scrapUse()&&S.chg<chgCap()-1)return{x:POS.y0.x,y:POS.y0.y,m:t_('Hent skrap fra <span>skraphaugen</span>')};
 if(F.state==='tapping')return{m:t_('Tapper stål i øsa!')};
 if(ET()==='conv'){if(F.ch)return{m:t_('Konverteren tippes: skrap og <span>råjern</span> chargeres')};if(F.solid>0)return{m:t_('Konverteren blåser luft gjennom råjernet … <span>{0} °C</span>',Math.round(F.temp))};if(F.state==='refine')return{m:t_('Prøvetaking …')};return{m:t_('Venter på <span>råjern</span> fra masovnen ({0} t klart)',tf(S.hm))}}
 return{m:t_(F.state==='refine'?'Raffinerer … <span>{0} °C</span>':'Ovnen smelter … <span>{0} °C</span>',Math.round(F.temp))}}
const PW=d=>d.kind==='build'?40:d.kind==='hire'?3:1;
function recommend(){let best=null,bs=1e99;for(const d of PADS){if(d.kind==='prestige'||!vis(d))continue;const left=cost(d)-(S.paid[paidKey(d)]||0);let w=PW(d);
  if(d.kind==='up'){if(padUrgent(d))w=6;else if({kran:1,operator:1,yard2:1,truck:1,ladle:1}[d.u.id])w=1.6}
  const sc=left/w;if(sc<bs){bs=sc;best={d,left}}}return best}
/* what to buy now: the recommendation, or something small on the way. While saving for the phase build only
   bottleneck fixes and very small things are worth it. */
function buyTarget(){const r=recommend();if(!r)return null;if(r.left<=S.money+.01)return r;const sav=r.d.kind==='build';
 let b=null;for(const d of PADS){if(d.kind==='prestige'||!vis(d))continue;const left=cost(d)-(S.paid[paidKey(d)]||0);if(left>S.money+.01)continue;
  const ok=sav?(left<=r.left*.04||(padUrgent(d)&&left<=r.left*.2)):left<=r.left*.25;if(ok&&(!b||left<b.left))b={d,left}}return b}
function phaseGoal(){const b=nextBuild();if(!b)return S.ph>=BUILDS.length?{m:presGain()>0?t_('Mål: <span>Nytt verk</span> er klart'):t_('Mål: tjen {0} → <span>Nytt verk</span>',kr(PRES_NEED)),p:clamp(S.earned/PRES_NEED,0,1)}:null;
 const left=b.cost-(S.paid['b:'+b.id]||0);return{m:S.money>=left?t_('Mål: bygg <span>{0}</span> – gå på ruta',t_(b.n)):t_('Mål: tjen {0} → <span>{1}</span>',kr(b.cost),t_(b.n)),p:clamp((S.money+(S.paid['b:'+b.id]||0))/b.cost,0,1),b}}
function goal(){const pg=phaseGoal();let x=null,y=null,sub='';
 if(S.heats<2&&!S.pres.n){const t=tutor();return{m:t.m,x:t.x,y:t.y,sub:'',p:null}}
 const L=tapLadle();
 if(!lv('operator')&&F.state==='ready'&&L)return{m:pg?pg.m:'',p:pg&&pg.p,x:POS.tapPad.x,y:POS.tapPad.y,sub:t_('Ovnen er klar – gå på TAPP')};
 if(slagOn()&&!lv('slaggbil')&&S.pot>=potMax()-1){const k=P.stack.some(i=>i.k==='slag');
  if(!k&&P.stack.length>=capCarry()){const t=carryTask();if(t)return{m:pg?pg.m:'',p:pg&&pg.p,x:t.x,y:t.y,k:'slagfirst',sub:t_('Slaggpotta er full! {0} først',t.m)}}
  return{m:pg?pg.m:'',p:pg&&pg.p,x:k?POS.slagp.x:POS.pot.x,y:k?POS.slagp.y:POS.pot.y,k:'slag',sub:(F.stop?t_('Ovnen står!')+' ':'')+t_('Slaggpotta er full – bær slagg til slaggplassen')}}
 /* standing at an upgrade pad: what it does */
 {const d=PADS.find(d=>d.kind==='up'&&vis(d)&&near(P,d.x,d.y,40));if(d)return{m:pg?pg.m:'',p:pg&&pg.p,x:null,y:null,sub:padName(d)+' · '+(d.u.person?t_('Hjelpere {0} av {1}',lv(d.u.id),1):t_('Nivå {0}/{1}',lv(d.u.id),d.u.max))+' · '+upSub(d.u)+(padUrgent(d)?' · '+t_('fikser flaskehalsen'):'')}}
 if(pg&&pg.b&&S.money>=pg.b.cost-(S.paid['b:'+pg.b.id]||0))return{m:pg.m,p:pg.p,x:pg.b.x,y:pg.b.y,sub:pg.b.d?t_(pg.b.d):''};
 if(T<(G.chGuide||0)&&!BUILDS[S.ph-1]?.era){const nb=PADS.find(d=>d.kind==='up'&&vis(d)&&d.st===BUILDS[S.ph-1]?.z);if(nb)return{m:pg?pg.m:'',p:pg&&pg.p,x:nb.x,y:nb.y,sub:t_('Ny stasjon: {0} {1}',padName(nb),kr(cost(nb)))}}
 const bt=buyTarget();
 if(bt){const d=bt.d;return{m:pg?pg.m:'',p:pg&&pg.p,x:d.x,y:d.y,k:'buy',sub:t_('Kjøp: {0} – {1}',padName(d),kr(Math.ceil(bt.left)))}}
 const cz=TG.filter(z=>z.cash>=10&&z.open()).sort((a,b)=>b.cash-a.cash)[0],rc=recommend();
 if(cz&&(!rc||cz.cash+S.money>=rc.left||cz.cash>=rc.left*.15)){const cp=cashAt(cz);return{m:pg?pg.m:'',p:pg&&pg.p,x:cp.x,y:cp.y,k:'cash',sub:t_('Hent {0} ved {1}',kr(cz.cash),t_(TNAME[cz.id]))}}
 const bn=bottlenecks()[0];
 const t=carryTask();if(t){x=t.x;y=t.y;sub=t.m}else if(bn){const zn=t_(ZN[bn[0]].n);sub=zn.charAt(0)+zn.slice(1).toLowerCase()+': '+bn[1]}
 else{const nx=recommend();sub=nx?t_('Neste: {0} – {1}',padName(nx.d),kr(Math.ceil(nx.left))):''}
 return{m:pg?pg.m:t_('Fullt utbygd! Tjen mest mulig.'),p:pg&&pg.p,x,y,sub}}
let gCache={},lastHud={},hudT=0;
function setT(id,v,html){if(lastHud[id]===v)return;lastHud[id]=v;if(html)$(id).innerHTML=v;else $(id).textContent=v}
const focusName=()=>{const k=S.ph?BUILDS[S.ph-1].sn:'Masovn og Bessemer';return t_(EN['fase§'+k]!=null?'fase§'+k:k)};/* the phase chip may use a shorter English name */
function hud(){const mvT=NO_()?fmt(S.money):'$'+fmt(S.money);setT('mv',mvT);{const lg=NO_()?mvT.length>4:mvT.length>=4;if(lastHud.mlong!==lg){lastHud.mlong=lg;$('money').classList.toggle('long',lg)}}setT('cv',t_('Fase {0} · Nivå {1}',S.ph+1,S.lvl+1));setT('pv',focusName());
 /* a long money figure must not squeeze the phase chip into "…": shrink the money chip instead */
 if(hudT<=1){const cvE=$('cv');try{if(cvE.scrollWidth>cvE.clientWidth+1&&!lastHud.tight){lastHud.tight=mvT.length;$('money').classList.add('tight')}else if(lastHud.tight&&mvT.length<lastHud.tight){lastHud.tight=0;$('money').classList.remove('tight')}}catch(e){}}
 const a=S.lvl?LVL_T(S.lvl-1):0,b=LVL_T(S.lvl),pr=clamp((S.earned-a)/(b-a),0,1);const w=Math.round(pr*100)+'%';if(lastHud.lw!==w){lastHud.lw=w;$('lvb').style.width=w}
 hudT-=1;if(hudT>0&&gCache.m!=null)return;hudT=6;
 gCache=goal();setT('gm',gCache.m,1);setT('gs',gCache.sub||'');const gp=gCache.p==null?'':Math.round(gCache.p*100)+'%';if(lastHud.gp!==gp){lastHud.gp=gp;$('gbar').hidden=gp==='';$('gbi').style.width=gp||'0%'}
 const bad=bottlenecks().length>0;if(lastHud.bad!==bad){lastHud.bad=bad;$('mapBtn').classList.toggle('bad',bad)}
 const E=E_(),cap=fcap();let s,c;
 if(F.stop){s=t_('Slaggpotta er full – ovnen står!');c=C.danger}
 else{const cv=E.type==='conv',pct=Math.floor(min(1,F.bath/cap)*100);s=t_(E.k)+' · '+(F.state==='melt'?(cv?(F.ch?t_('chargerer'):F.solid>0?t_('blåser {0} %',pct):t_('venter på råjern')):t_('{0} %',pct)):F.state==='refine'?t_(E.type==='sm'?'raffinerer':'tapper snart'):F.state==='ready'?t_('KLAR'):t_('tapper'))+' · '+Math.round(F.temp)+' °C · '+cap+' t'+(cv?'':' · '+tf(F.rate*60)+' t/min')+(usesHM()?' · '+t_('råjern {0} t',tf(S.hm)):'');
  c=F.lim||F.waitHM>1.5||csLim()?C.danger:F.state==='ready'?C.moltenhi:F.state==='tapping'||F.solid>0?C.molten:C.steel}
 setT('st',s);if(lastHud.sc!==c){lastHud.sc=c;$('sdot').style.background=c}
 /* crane button: shown in a zone whose crane you can take over */
 const cz=craneHere();const cb=$('craneBtn');const ct=cz?t_(G.crane===cz.id?'Slipp {0}':'Styr {0}',t_(cz.n)):'';if(lastHud.cb!==ct){lastHud.cb=ct;cb.hidden=!cz;cb.textContent=ct;cb.classList.toggle('on',!!cz&&G.crane===cz.id);cb.setAttribute('aria-pressed',cz&&G.crane===cz.id?'true':'false')}}
function craneHere(){if(G.crane)return CRm[G.crane];for(const c of CRANES){if(!canMan(c))continue;const d=c.d;if(P.x>d.x0-40&&P.x<d.x1+40&&P.y>d.y0-40&&P.y<d.y1+40)return c}return null}
function toggleCrane(){const c=craneHere();if(!c)return;if(G.crane===c.id){c.man=false;G.crane=null;toast(t_('Kranen kjører selv igjen'))}else{G.crane=c.id;c.man=true;J.on=false;toast(t_('Du styrer {0} ({1})',t_(c.n),t_(c.bonus)))}hudT=0;sfx('tick',200);buzz(12)}
$('craneBtn').addEventListener('click',e=>{initAudio();toggleCrane();e.stopPropagation()});

/* ---------- menu + modal ---------- */
const menu=$('menu'),mBtn=$('menuBtn');
const TOGN={rj:'Råjern → stålverket',strang:'Emner → gjennomvarming',vv:'Armering → klipp og bøy',tc:'Tempcore → klipp og bøy',stel:'Valstråd → nettverk'};
const TOGON={rj:()=>stOn('rj'),strang:()=>B_('vv')&&(lv('varm')||lv('magkran')),vv:()=>B_('kob')&&lv('rullkob')&&!B_('tc'),tc:()=>B_('kob')&&lv('rullkob')&&B_('tc'),stel:()=>B_('nett')&&lv('ktrans')};
const refItem=k=>({k,t:1,q:k==='ingot'||k==='billet'?qLF():qLF()});
function prodOn(k){return{pig:pileOn('pig'),ingot:1,billet:B_('strang'),rebar:B_('vv'),tcore:B_('tc'),coil:B_('stel'),mesh:B_('nett'),bent:B_('kob')}[k]}
function syncMenu(){syncDest();$('mSound').setAttribute('aria-pressed',S.mute?'false':'true');$('mSound').textContent=t_(S.mute?'Av':'På');$('mVib').setAttribute('aria-pressed',S.vib?'true':'false');$('mVib').textContent=t_(S.vib?'På':'Av');
 $('mLangEn').setAttribute('aria-pressed',NO_()?'false':'true');$('mLangNo').setAttribute('aria-pressed',NO_()?'true':'false');
 $('mCastW').hidden=!B_('strang');for(const b of $('mCast').children)b.setAttribute('aria-checked',b.dataset.c===S.cast?'true':'false');
 $('mMixW').hidden=!B_('stel');for(const b of $('mMix').children)b.setAttribute('aria-checked',b.dataset.m===S.mix?'true':'false');
 const tg=Object.keys(TOGN).filter(k=>TOGON[k]());$('mTogW').hidden=!tg.length;
 $('mTog').innerHTML=tg.map(k=>'<div class="mrow"><span>'+t_(TOGN[k])+'</span><button class="mbtn tg" type="button" data-t="'+k+'" aria-pressed="'+(S.tg[k]?'true':'false')+'">'+t_(S.tg[k]?'Videre':'Salg')+'</button></div>').join('');
 const bm=BASEP()*gm();const kt=v=>NO_()?L1(v)+' kr/t':'$'+L1(v)+'/t';
 $('prices').innerHTML=PRK.map(k=>{const on=prodOn(k);return'<span'+(on?'':' class="lk"')+'>'+t_(PR[k].n)+(k==='ingot'&&B_('strang')?' ('+t_('spesialstål')+')':'')+'</span><b'+(on?'':' class="lk"')+'>'+(on?kt(val(refItem(k))*bm):t_('låst'))+'</b>'}).join('')+(slagOn()?'<span>'+t_(PR.slag.n)+'</span><b>'+kt(PR.slag.p*(1+.15*lv('slagcap'))*bm)+'</b>':'');
 const st=S.st,m=floor(st.play/60),pd=st.prod||{},K=(k,v)=>t_(k)+': <b>'+v+'</b>',pc=v=>t_('{0} %',v);
 $('stats').innerHTML=K('Spilletid',m>=60?t_('{0} t {1} min',floor(m/60),m%60):m+' min')+'<br>'+K('Ovn',year()+' · '+t_(E_().n))+(kwh()?' · '+kwh()+' kWh/t':'')+(rjClosed()?'':'<br>'+K('Råjern',t_(RJE[rjEra()].n))+' · '+t_('{0} t laget',fmt(S.st.hm||0)))+'<br>'+K('Charger tappet',fmt(S.heats))+' · '+K('Skrap smeltet',fmt(st.scrap)+' t')+'<br>'+K('Støpeblokker',fmt(pd.ingot||0))+' · '+K('Emner',fmt(pd.billet||0))+'<br>'+K('Armering',fmt((pd.rebar||0)+(pd.tcore||0)))+' · '+K('Valstråd',fmt(pd.coil||0))+'<br>'+K('Utbytte blokk',pc(Math.round((1-crop(lv('hette')))/(1+RUNNER)*100)))+' · '+K('streng',pc(lv('torch')?99:98))+'<br>'+K('Solgt',fmt(st.sold))+' '+t_('stk')+' · '+K('Inntekt',kr(S.rate*60,'/min'))+'<br>'+K('Tjent totalt',kr(S.life))+'<br>'+K('Nytt verk',S.pres.n)+' · '+K('Ekspertise',S.pres.pts)+' (×'+L1(1+.5*S.pres.pts)+')'}
function openMenu(on){if(on)hideInfo();menu.classList.toggle('on',on);mBtn.setAttribute('aria-expanded',on?'true':'false');$('resetRow').hidden=false;$('resetConf').hidden=true;if(on){openMap(false);syncMenu()}}
mBtn.addEventListener('click',e=>{initAudio();openMenu(!menu.classList.contains('on'));e.stopPropagation()});
$('mSound').addEventListener('click',()=>{toggleMute()});$('mZo').addEventListener('click',()=>setUZ(UZ/1.15));$('mZi').addEventListener('click',()=>setUZ(UZ*1.15));
for(const b of $('mCast').children)b.addEventListener('click',()=>{S.cast=b.dataset.c;syncMenu();save()});
for(const b of $('mMix').children)b.addEventListener('click',()=>{S.mix=b.dataset.m;syncMenu();save()});
$('mTog').addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button[data-t]');if(!b)return;flipSw(b.dataset.t,false);syncMenu()});
const DESTS=['best','dock','tog','kai'];
function syncDest(){const cur=S.dest||'best';const nm={dock:'Lastebil',tog:'Tog',kai:'Kai'},op={best:1,dock:1,tog:B_('tog'),kai:B_('kai')};
 for(const k of DESTS){const b=$('d_'+k);b.disabled=!op[k];b.setAttribute('aria-checked',k===cur?'true':'false');b.textContent=k==='best'?t_('Beste pris'):t_(nm[k])+(op[k]?' ×'+L1(SELLM[k]()):' ('+t_('låst')+')')}
 const t=bestSell(null);$('destInfo').textContent=t_('Leveres nå til {0} · ×{1} pris',t_(({dock:'lastebil',tog:'tog',kai:'kai'})[t.sell]),L1(SELLM[t.sell]()))}
for(const k of DESTS){const b=$('d_'+k);b.addEventListener('click',()=>{if(b.disabled)return;S.dest=k;syncDest();save()})}
$('mVib').addEventListener('click',()=>{S.vib=!S.vib;syncMenu();save();buzz(20)});
$('mLangEn').addEventListener('click',()=>setLang('en'));$('mLangNo').addEventListener('click',()=>setLang('no'));
$('mReset').addEventListener('click',()=>{$('resetRow').hidden=true;$('resetConf').hidden=false;try{$('mResetNo').focus()}catch(e){}});
$('mResetNo').addEventListener('click',()=>{$('resetRow').hidden=false;$('resetConf').hidden=true});
$('mResetYes').addEventListener('click',()=>{doReset();openMenu(false)});
function toggleMute(){S.mute=!S.mute;if(AU.m)AU.m.gain.value=S.mute?0:.7;syncMenu();save()}
function showModal(title,html,yes,onYes,start){hideInfo();G.modal=onYes||(()=>{});$('mdT').textContent=title;$('mdP').innerHTML=html;$('mdYes').textContent=yes;$('mdNo').hidden=!!start;$('modal').classList.toggle('start',!!start);$('modal').classList.add('on');J.on=false;try{$('mdYes').focus()}catch(e){}}
/* the start card: what the game is and the year it starts in; shown once on a new game, and again from the menu */
function showStart(){const y=ERA[0].yr;showModal(t_('Slik spiller du'),'<b>'+t_('{0}. Du overtar et lite jernverk: en koksmasovn og en Bessemer-konverter.',y)+'</b><br>'+t_('Bær malm og skrap, stå på rutene for å kjøpe oppgraderinger og ansette hjelpere.')+'<br>'+t_('Bygg verket ut gjennom over hundre år med stålproduksjon – helt fram til moderne lysbueovn og valseverk.'),t_('Start'),()=>{},true);if(!S.introSeen){S.introSeen=1;save()}}
$('mHow').addEventListener('click',()=>{openMenu(false);showStart()});
/* a press outside the box dismisses the card / cancels the question */
$('modal').addEventListener('pointerdown',e=>{if(e.target===$('modal'))closeModal()});
function closeModal(){G.modal=null;$('modal').classList.remove('on');try{cv.focus({preventScroll:true})}catch(e){}}
$('mdYes').addEventListener('click',()=>{const f=G.modal;closeModal();if(f)f()});
$('mdNo').addEventListener('click',closeModal);
function openPresModal(){const g=presGain();if(g<1){showModal(t_('Nytt verk'),t_('Du trenger mer inntekt i dette verket. Tjen <b>{0}</b> totalt for første ekspertisepoeng.',kr(PRES_NEED)),'OK',null);return}
 showModal(t_('Start nytt verk?'),t_('Du bygger et nytt stålverk fra bunnen. Du får <b>+{0} ekspertise</b> – all inntekt blir <b>×{1}</b> for alltid.<br>Penger, stasjoner og oppgraderinger nullstilles.',g,L1(1+.5*(S.pres.pts+g))),t_('Start nytt verk'),doPrestige)}

/* ---------- KART: schematic of the whole line with measured flows (rolling averages) ---------- */
const MN={
 koks:{x:80,y:44,sup:1,rj:1,n:'Koksverk'},cowper:{x:185,y:44,sup:1,rj:1,n:'Cowpere'},
 malm:{x:70,y:330,rj:1,n:'Malmlager'},rj:{x:200,y:330,rj:1,n:'Råjernsovn'},
 kalk:{x:360,y:44,sup:1,n:'Kalk / dolo'},o2:{x:465,y:44,sup:1,n:'Oksygen'},kull:{x:570,y:44,sup:1,n:'Kullinjeksjon'},
 skrap:{x:320,y:215,n:'Skrapplass'},ovn:{x:445,y:215,n:'Ovn'},lf:{x:570,y:215,n:'Øseovn'},
 strang:{x:700,y:150,n:'kart§Stranggjuting'},blokk:{x:700,y:300,n:'Blokkstøping'},gjv:{x:830,y:215,n:'Gjennomvarming'},vv:{x:960,y:215,n:'Valseverk'},
 tc:{x:1090,y:300,n:'Tempcore'},stel:{x:1090,y:130,n:'Valstråd'},nett:{x:1220,y:130,n:'Nettverk'},kob:{x:1220,y:420,n:'Klipp og bøy'},salg:{x:1360,y:260,sale:1,n:'Salg'}};
const PCOL={malm:'#a0604a',rajern:'#ffb030',pig:'#9a8f86',skrap:'#c0804f',stal:'#ff7a1a',ingot:'#e8b04a',billet:'#ff5d5d',rebar:'#b9c1cb',tcore:'#6fb7ff',coil:'#c39bff',mesh:'#9bd35f',bent:'#4dd0c8',slag:'#8b8780'};
const PNAME={malm:'Malm',rajern:'Råjern (flytende)',pig:'Masseljern',skrap:'Skrap',stal:'Flytende stål',ingot:'Støpeblokk',billet:'Emne',rebar:'Armeringsstål',tcore:'Tempcore-armering',coil:'Valstråd',mesh:'Armeringsnett',bent:'Bøyd armering',slag:'Slagg'};
/* value per tonne used for kr/min on the map: scrap 1,0 · liquid steel ~1,27 · products by the price ladder */
const VALT=p=>({malm:1.5,rajern:6,skrap:7.5,stal:9.5,slag:PR.slag.p}[p]||PR[p].p)*BASEP()*gm();
const MEDG=[['malm','rj','malm'],['rj','ovn','rajern'],['rj','salg','pig'],['skrap','ovn','skrap'],['ovn','lf','stal'],['ovn','blokk','stal'],['ovn','strang','stal'],['lf','blokk','stal'],['lf','strang','stal'],['strang','gjv','billet'],['gjv','vv','billet'],['vv','tc','rebar'],['vv','stel','rebar'],['vv','kob','rebar'],['tc','kob','tcore'],['stel','nett','coil'],
 ['blokk','salg','ingot'],['strang','salg','billet'],['vv','salg','rebar'],['tc','salg','tcore'],['stel','salg','coil'],['nett','salg','mesh'],['kob','salg','bent'],['ovn','salg','slag']];
const mClosed=id=>!!MN[id].rj&&rjClosed();
const mBuilt=id=>id==='salg'||(mClosed(id)?false:id==='malm'?true:MN[id].rj&&MN[id].sup?rjReq().indexOf(id)>=0||lv(id)>0:MN[id].sup?E_().req.indexOf(id)>=0||lv(id)>0:stOn(id==='blokk'?'blokk':id));
let MMODE='prod',MSEL='ovn';
function edgeV(e){return flow(e[0],e[1])}
function mUtil(id){if(id==='rj')return clamp(rate('rjmelt')/max(1e-6,RJ.rp*60),0,1);if(MN[id].sup&&!MN[id].rj){if(F.lim===id)return{lv:2,t:lv(id)?t_('Flaskehals: {0} – for liten kapasitet',t_(SUPN[id])):t_('Flaskehals: {0} mangler',t_(SUPN[id]))};return{lv:0,t:''}}if(MN[id].rj&&MN[id].sup){const c=rjSupCap(id);return c>0?clamp(rate('s:'+id)/(c*60),0,1):0}if(MN[id].sup){const c=supCap(id);return c>0?clamp(rate('s:'+id)/(c*60),0,1):0}
 if(id==='ovn')return clamp(rate('melt')/max(1e-6,F.rp*60),0,1);if(NODE[id])return clamp(NODE[id].util,0,1);
 if(id==='strang')return clamp(rate('o:strang')/(nStr()*strandRate()*60),0,1);if(id==='skrap')return clamp(flow('skrap','ovn')/max(1e-6,F.rp*60),0,1);return null}
function mStat(id){if(id==='malm'){if(RJ.starve>1.5)return F.waitHM>1.5?{lv:2,t:t_('Flaskehals: malm til ovnen')}:{lv:1,t:t_('Venter på malm')};return{lv:0,t:''}}if(MN[id].sup&&!MN[id].rj){if(F.lim===id)return{lv:2,t:lv(id)?t_('Flaskehals: {0} – for liten kapasitet',t_(SUPN[id])):t_('Flaskehals: {0} mangler',t_(SUPN[id]))};return{lv:0,t:''}}if(MN[id].rj&&MN[id].sup){if(RJ.lim===id&&status('rjsup')&&status('rjsup').lv===2)return{lv:2,t:t_('Flaskehals: {0}',t_(SUPN[id]))};return{lv:0,t:''}}return status(id)}
function nodeVA(id){let vin=0,vout=0;for(const e of MEDG){const v=edgeV(e)*VALT(e[2]);if(e[1]===id)vin+=v;if(e[0]===id)vout+=e[1]==='salg'?rate('v:'+id):v}return{vin,vout,va:vout-vin}}
function mPath(a,b){const A=MN[a],B=MN[b],NW=104,NH=54;
 if(a==='rj'&&b==='ovn'){const ax=A.x+NW/2,bx=B.x-NW/2;return`M${ax},${A.y} C${ax+70},${A.y} ${bx-60},${B.y+16} ${bx},${B.y+16}`}
 if(a==='rj'&&b==='salg'){const bx=B.x-50;return`M${A.x},${A.y+NH/2} C${A.x},${A.y+120} ${A.x+60},476 ${A.x+120},476 L${bx},476`}
 if(b==='salg'){const ax=A.x+NW/2,bx=B.x-50,ay=A.y,by=clamp(A.y,80,440);if(a==='blokk')return`M${ax},${ay} C${ax+40},${ay} ${ax+20},470 ${ax+70},470 L${bx},470 L${bx},${by+40}`;if(a==='stel')return`M${ax},${ay-8} C${ax+24},${ay-8} ${ax+14},70 ${ax+44},70 L${bx},70`;if(a==='ovn')return`M${A.x},${A.y+NH/2} C${A.x},${A.y+200} ${A.x+60},486 ${A.x+120},486 L${bx},486`;const dx=(bx-ax)/2;return`M${ax},${ay} C${ax+dx},${ay} ${bx-dx},${by} ${bx},${by}`}
 if(a==='vv'&&b==='kob'){return`M${A.x+20},${A.y+NH/2} C${A.x+20},${A.y+150} ${B.x-120},${B.y} ${B.x-NW/2},${B.y}`}
 if(a==='ovn'&&(b==='blokk'||b==='strang')){const ax=A.x+NW/2,bx=B.x-NW/2;return`M${ax},${A.y+(b==='blokk'?14:-14)} C${ax+80},${A.y+(b==='blokk'?60:-60)} ${bx-60},${B.y} ${bx},${B.y}`}
 const ax=A.x+NW/2,bx=B.x-NW/2,ay=A.y,by=B.y,dx=(bx-ax)/2;return`M${ax},${ay} C${ax+dx},${ay} ${bx-dx},${by} ${bx},${by}`}
function renderMap(){if(!G.mapOn)return;const money=MMODE==='money',FN='font-family="Rubik, system-ui, sans-serif"';let h='';
 const income=rate('v:salg');
 for(const s of['koks','cowper']){if(!mBuilt(s))continue;const A=MN[s],B=MN.rj,off=s==='koks'?-14:14,d=`M${A.x},${A.y+16} C${A.x},${A.y+120} ${B.x+off},${B.y-140} ${B.x+off},${B.y-27}`,on=rate('s:'+s)>.01;
  h+=`<path d="${d}" fill="none" stroke="${RJ.lim===s?'#ff6b5a':'#7d8590'}" stroke-width="2.5" stroke-dasharray="5 5" opacity=".85"/>`;if(on)h+=`<path class="flow" d="${d}" fill="none" stroke="#c9ced6" stroke-width="1.5" stroke-dasharray="2 14" stroke-linecap="round"/>`}
 for(const s of['kalk','o2','kull']){if(!mBuilt(s))continue;const A=MN[s],B=MN.ovn,off=(['kalk','o2','kull'].indexOf(s)-1)*18,d=`M${A.x},${A.y+16} C${A.x},${A.y+76} ${B.x+off},${B.y-87} ${B.x+off},${B.y-27}`,on=rate('s:'+s)>.01;
  h+=`<path d="${d}" fill="none" stroke="${F.lim===s?'#ff6b5a':'#7d8590'}" stroke-width="2.5" stroke-dasharray="5 5" opacity=".85"/>`;if(on)h+=`<path class="flow" d="${d}" fill="none" stroke="#c9ced6" stroke-width="1.5" stroke-dasharray="2 14" stroke-linecap="round"/>`}
 for(const e of MEDG){if(!mBuilt(e[0])||!mBuilt(e[1]))continue;const v=edgeV(e);if(v<.005)continue;const val=e[1]==='salg'?rate('v:'+e[0]):v*VALT(e[2]);
  const w=money?2+min(16,Math.log10(1+val)*2.2):2+min(14,Math.sqrt(v)*1.1),col=money?'#ffcf33':PCOL[e[2]],d=mPath(e[0],e[1]);
  h+=`<path d="${d}" fill="none" stroke="#000" stroke-opacity=".45" stroke-width="${w+3}"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-opacity=".88"/><path class="flow" d="${d}" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="${max(1.4,w*.32)}" stroke-dasharray="2 14" stroke-linecap="round"/>`}
 const nb=nextBuild();
 for(const id in MN){const o=MN[id],built=mBuilt(id);
  if(mClosed(id)&&(!o.sup||lv(id)>0)){const w=o.sup?92:104,hh=o.sup?32:54,x=o.x-w/2,y=o.y-hh/2;h+=`<g class="node${MSEL===id?' sel':''}" data-id="${id}" tabindex="0" role="button" aria-label="${t_(o.n)}, ${t_('nedlagt')}"><rect class="nb" x="${x}" y="${y}" width="${w}" height="${hh}" rx="${o.sup?16:10}" fill="#14161b" stroke="rgba(244,241,234,.18)" stroke-width="1.5"/><text x="${o.x}" y="${o.y-(o.sup?2:6)}" text-anchor="middle" fill="#6b7079" font-size="${o.sup?11:12}" font-weight="700" ${FN}>${t_(o.n)}</text><text x="${o.x}" y="${o.y+(o.sup?11:12)}" text-anchor="middle" fill="#6b7079" font-size="9.5" font-weight="800" ${FN}>${t_('NEDLAGT')}</text></g>`;continue}const isNext=!built&&nb&&(nb.z===id||(nb.id==='vv'&&(id==='gjv'||id==='vv'))||(id==='ovn'));if(!built&&!isNext)continue;
  const sup=o.sup,w=o.sale?100:sup?92:104,hh=o.sale?400:sup?32:54,x=o.x-w/2,y=o.y-hh/2,sel=MSEL===id;
  if(!built){h+=`<g class="node" data-id="${id}" tabindex="0" role="button" aria-label="${t_(o.n)}, ${t_('neste bygg')}"><rect class="nb" x="${x}" y="${y}" width="${w}" height="${hh}" rx="10" fill="none" stroke="rgba(244,241,234,.35)" stroke-dasharray="5 5" stroke-width="1.5"/><text x="${o.x}" y="${o.y-4}" text-anchor="middle" fill="#a7adb7" font-size="11" font-weight="700" ${FN}>${t_(o.n)}</text><text x="${o.x}" y="${o.y+12}" text-anchor="middle" fill="#7d8590" font-size="9.5" ${FN}>${t_('neste · {0}',kr(nb.cost))}</text></g>`;continue}
  const st=id==='salg'?null:mStat(id),bad=st&&st.lv===2,amb=st&&st.lv===1;let stat;
  if(sup){const cap=(o.rj?rjSupCap(id):supCap(id))*60,lim=o.rj?RJ.lim===id:F.lim===id,need=(o.rj?RJ.rp:F.rp)*60;stat=money?t_('{0} drift',kr(0,'/min')):lim?tf(cap)+' < '+tf(need)+' t/min':tf(rate('s:'+id))+' / '+tf(cap)+' t/min'}
  else if(o.sale)stat='';else if(money){const va=nodeVA(id).va;stat=(va>=0?'+':'')+kr(va,'/min')}else{let out=0;for(const e of MEDG)if(e[0]===id)out+=edgeV(e);stat=t_('ut {0} t/min',tf(out))}
  const sc=money?(sup?'#a7adb7':nodeVA(id).va>=0?'#5fd38d':'#ff6b5a'):'#a7adb7',fill=bad?'#2a1414':sup?'#151a22':'#1b2029',stc=bad?'#ff6b5a':amb?'rgba(245,197,24,.7)':sup?'rgba(255,255,255,.18)':'rgba(255,255,255,.22)';
  h+=`<g class="node${sel?' sel':''}" data-id="${id}" tabindex="0" role="button" aria-pressed="${sel}" aria-label="${t_(o.n)}${bad?', '+t_('flaskehals'):''}">`;
  if(bad)h+=`<rect class="pulse" x="${x-5}" y="${y-5}" width="${w+10}" height="${hh+10}" rx="14" fill="none" stroke="#ff6b5a" stroke-width="2"/>`;
  h+=`<rect class="nb" x="${x}" y="${y}" width="${w}" height="${hh}" rx="${sup?16:10}" fill="${fill}" stroke="${stc}" stroke-width="1.5"/>`;
  if(o.sale)h+=`<text x="${o.x}" y="${o.y-14}" text-anchor="middle" fill="#f4f1ea" font-size="15" font-weight="800" ${FN}>${t_('SALG')}</text><text x="${o.x}" y="${o.y+6}" text-anchor="middle" fill="#a7adb7" font-size="10.5" ${FN}>${t_(B_('kai')?'bil · tog · kai':B_('tog')?'bil · tog':'lastebil')}</text><text x="${o.x}" y="${o.y+28}" text-anchor="middle" fill="#ffcf33" font-size="12" font-weight="800" ${FN}>${NO_()?fmt(income):'$'+fmt(income)}</text><text x="${o.x}" y="${o.y+43}" text-anchor="middle" fill="#a7adb7" font-size="10" ${FN}>${NO_()?'kr/min':t_('per min')}</text>`;
  else if(sup)h+=`<text x="${o.x}" y="${o.y-2}" text-anchor="middle" fill="#f4f1ea" font-size="11" font-weight="700" ${FN}>${t_(o.n)}</text><text x="${o.x}" y="${o.y+11}" text-anchor="middle" fill="${(o.rj?RJ.lim:F.lim)===id?'#ff6b5a':sc}" font-size="9" ${FN}>${lv(id)?stat:t_('ikke bygget')}</text>`;
  else{h+=`<text x="${o.x}" y="${o.y-8}" text-anchor="middle" fill="#f4f1ea" font-size="12" font-weight="700" ${FN}>${id==='rj'?t_('kart§'+RJE[rjEra()].k.replace('EL-RÅJERNSOVN','EL-RÅJERN')):id==='ovn'?t_('kart§'+E_().k.replace('-KONVERTER','').replace('-LYSBUEOVN',' EAF').replace('LYSBUEOVN','EAF').replace('-OVN','')):t_(o.n)}</text><text x="${o.x}" y="${o.y+10}" text-anchor="middle" fill="${sc}" font-size="10.5" font-weight="600" ${FN}>${stat}</text>`;
   if(bad)h+=`<rect x="${o.x-40}" y="${y-11}" width="80" height="16" rx="5" fill="#ff6b5a"/><text x="${o.x}" y="${y+1}" text-anchor="middle" fill="#1a0b08" font-size="9.5" font-weight="800" ${FN}>${t_('FLASKEHALS')}</text>`;
   else if(amb)h+=`<rect x="${o.x-40}" y="${y-11}" width="80" height="16" rx="5" fill="#f5c518"/><text x="${o.x}" y="${y+1}" text-anchor="middle" fill="#111" font-size="9.5" font-weight="800" ${FN}>${t_('VENTER')}</text>`}
  h+='</g>'}
 h+=`<text x="16" y="494" fill="#7d8590" font-size="11" ${FN}>${t_('målt · glidende snitt · per spillminutt')}</text>`;
 $('mapSvg').innerHTML=h;
 const bn=bottlenecks();$('mapSum').innerHTML=t_('Inntekt <b>{0}</b> · Smelter <b>{1} t/min</b>',kr(income,'/min'),tf(rate('melt')))+(bn.length?' · '+t_('Flaskehals')+': <b class="bad">'+[...new Set(bn.map(b=>b[0]==='rjsup'?t_(MN[RJ.lim||'koks'].n):b[0]==='rj'?(RJ.lim&&b[1]===t_('Flaskehals: {0}',t_(SUPN[RJ.lim]))?t_(MN[RJ.lim].n):t_('Råjernsovn')):b[0]==='sup'||b[0]==='ovn'&&F.lim?t_(MN[F.lim||'kalk'].n):MN[b[0]]?t_(MN[b[0]].n):t_(ZN[b[0]].n).toLowerCase()))].join(', ')+'</b>':' · '+t_('ingen flaskehals'));
 renderPanel()}
const li=(col,t)=>'<li><i style="background:'+col+'"></i><span>'+t+'</span></li>';
const MZ={kalk:'sup',o2:'sup',kull:'sup',salg:'salg1',koks:'rjsup',cowper:'rjsup',malm:'rj'};
function renderPanel(){const id=MSEL,o=MN[id],on=o?t_(o.n):'';if(!o){$('mapPanel').innerHTML='';return}if(mClosed(id)){$('mapPanel').innerHTML='<h3>'+on+' <span class="flag amb">'+t_('NEDLAGT')+'</span></h3><p class="pnote">'+t_('Råjernsverket ble lagt ned ved omleggingen. Stålet lages nå av skrap.')+(PILE.pig.length?' '+t_('{0} masseljern ligger igjen for salg.',PILE.pig.length):'')+'</p>';return}
 const built=mBuilt(id),st=id==='salg'?null:mStat(id);let h='<h3>'+on;
 if(st&&st.lv===2)h+=' <span class="flag">'+t_('FLASKEHALS')+'</span>';else if(st&&st.lv===1)h+=' <span class="flag amb">'+t_('VENTER')+'</span>';else if(built&&id!=='salg')h+=' <span class="flag ok">OK</span>';h+='</h3>';
 const row=(k,v,sty)=>'<div class="prow"><div class="k">'+k+'</div><div'+(sty||'')+'>'+v+'</div></div>',tm=v=>tf(v)+' t/min';
 if(!built){const nb=nextBuild();h+='<p class="pnote">'+t_('Neste bygg: <b>{0}</b> · {1}. Bygges på ruta i tomta.',nb?t_(nb.n):'',kr(nb?nb.cost:0))+'</p>';$('mapPanel').innerHTML=h;return}
 if(st&&st.t)h+='<div class="pnote" style="margin:0 0 4px">'+st.t+'</div>';
 if(o.sup){const c=o.rj?rjSupCap(id):supCap(id);const need=(o.rj?RJ.rp:F.rp)*60,isLim=o.rj?RJ.lim===id:F.lim===id;
  h+=row(t_('Kapasitet'),lv(id)?t_('{0} t/min stål',tf(c*60)):t_('ikke bygget'))
   +row(t_('Ovnen vil'),t_('{0} t/min når den smelter',tf(need)),isLim?' style="color:var(--danger);font-weight:800"':'')
   +row(t_('Snitt bruk'),tm(rate('s:'+id)))
   +row(t_('Drift'),t_('{0} · kjøpes én gang',kr(0,'/min')));
  h+='<p class="pnote">'+(isLim?t_('Mens ovnen smelter/blåser, trenger den mer enn anlegget klarer, så den går saktere. Snittet er lavere fordi ovnen også lader og tapper. Oppgrader anlegget til minst {0} t/min.',tf(need)):t_('Anlegget holder følge med ovnen. Snittet er lavere enn kapasiteten fordi ovnen også lader og tapper.'))+'</p>'}
 else if(o.sale){const ins=MEDG.filter(e=>e[1]==='salg'&&mBuilt(e[0])&&edgeV(e)>.005);h+='<div class="prow"><div class="k">'+t_('Selges')+'</div><ul>'+(ins.map(e=>li(PCOL[e[2]],t_(PNAME[e[2]])+' · '+tm(edgeV(e))+' = <b>'+kr(rate('v:'+e[0]),'/min')+'</b>')).join('')||'<li>'+t_('ingenting ennå')+'</li>')+'</ul></div>'+row(t_('Sum'),kr(rate('v:salg'),'/min'),' style="color:var(--coin);font-weight:800"')}
 else{const ins=MEDG.filter(e=>e[1]===id&&mBuilt(e[0])),outs=MEDG.filter(e=>e[0]===id&&mBuilt(e[1])&&!(e[2]==='slag'&&!slagOn()));const v=nodeVA(id);
  let inL=ins.map(e=>li(PCOL[e[2]],t_('{0} · {1} fra {2}',t_(PNAME[e[2]]),tm(edgeV(e)),t_(MN[e[0]].n)))).join('');const supL=s=>li('#7d8590',t_(MN[s].n)+(lv(s)?' · '+tm(rate('s:'+s)):' · '+t_('mangler')));if(id==='rj')inL+=rjReq().map(supL).join('');if(id==='ovn')inL+=E_().req.map(supL).join('');
  h+='<div class="prow"><div class="k">'+t_('Inn')+'</div><ul>'+(inL||'<li>—</li>')+'</ul></div><div class="prow"><div class="k">'+t_('Ut')+'</div><ul>'+(outs.map(e=>li(PCOL[e[2]],t_(PNAME[e[2]])+' · '+tm(edgeV(e))+' → '+t_(MN[e[1]].n))).join('')||'<li>—</li>')+'</ul></div>';
  h+=row(CUR()+'/min',t_('Verdi inn {0} → ut {1}',kr(v.vin),kr(v.vout))+' · <b style="color:'+(v.va>=0?'var(--good)':'var(--danger)')+'">'+(v.va>=0?'+':'')+kr(v.va,'/min')+'</b>');
  const u=mUtil(id);if(u!=null){const p=Math.round(u*100);h+=row(t_('Utnyttelse'),t_('{0} %',p)+'<div class="util"><i style="width:'+p+'%;background:'+(p>=95?'var(--danger)':p>85?'var(--hazard)':'var(--good)')+'"></i></div>')}}
 if(id==='skrap'&&era()===5){h+=row(t_('Kran'),t_('{0} t/min · løft {1} t',tf(flow('skrap','ovn')),tf(craneLift())))+row(t_('Bånd'),t_('{0} t/min · maks {1} t/min',tf(rate('csfeed')),tf(beltRate()*60)))+row(t_('Forvarming'),t_('Skrapet inn i ovnen: {0} °C',Math.round(CSB.pre)));
  const l=csLim();if(l)h+='<p class="pnote">'+(l==='kran'?t_('Kranen fyller ikke linja raskt nok – kjøp Skrapkran eller Større magnet.'):l==='band'?t_('Linja er full, men båndet går for sakte – kjøp Raskere Consteel-bånd.'):t_('Skrapplassen er tom – kjøp Skraptilførsel.'))+'</p>'}
 const zid=MZ[id]||id,hi=HIRE[zid];if(hi)h+=row(t_('Hjelpere'),t_('{0} av {1}',lv(hi.id),hi.costs.length));
 const ups=UP.filter(u=>u.st===zid);if(ups.length)h+='<div class="prow"><div class="k">'+t_('Oppgr.')+'</div><div class="lv">'+ups.map(u=>{const l=lv(u.id),on=upOpen(u),mx=l>=u.max,ok=on||l>0,urg=on&&!mx&&urgentIds(u.st).indexOf(u.id)>=0;return'<span'+(ok?'':' class="lk"')+'>'+upName(u)+(urg?' <i class="urg">'+t_('flaskehals')+'</i>':'')+'</span><b class="'+(mx?'mx':ok?'':'lk')+'">'+(mx?t_('MAKS'):!on?t_('låst'):(u.max>1?t_('Nivå {0}/{1}',l,u.max):t_('kan kjøpes'))+' · '+kr(upCost(u)))+'</b>'}).join('')+'</div></div>';
 h+='<p class="pnote">'+t_('Hver oppgradering har sin egen rute i stasjonen – velg selv rekkefølgen. Låst = kommer med en senere ovn eller et nytt bygg.')+'</p>';$('mapPanel').innerHTML=h}
function openMap(on){if(on)hideInfo();G.mapOn=on;$('mapov').classList.toggle('on',on);$('mapBtn').setAttribute('aria-expanded',on?'true':'false');if(on){J.on=false;menu.classList.remove('on');G.mapT=0;renderMap();try{mapZoom(MZ_,null,true);const sc=$('mapScroll'),zx=MN[MSEL]?MN[MSEL].x:500;sc.scrollLeft=max(0,zx*mapK()-sc.clientWidth/2)}catch(e){};try{$('mapClose').focus()}catch(e){}}else{try{cv.focus({preventScroll:true})}catch(e){}}}
/* map zoom: buttons, pinch, wheel, mouse drag */
let MZ_=1;const MZMAX=4;
function mapBase(){const sc=$('mapScroll');return max(200,sc.clientHeight-2)}
function mapK(){const sv=$('mapSvg');return(parseFloat(sv.style.height)||mapBase())/500}
function mapZoom(z,f,force){const sc=$('mapScroll'),sv=$('mapSvg');z=clamp(z,1,MZMAX);const oldH=parseFloat(sv.style.height)||mapBase(),nh=mapBase()*z;if(!force&&Math.abs(nh-oldH)<.5){MZ_=z;return}
 const fx=f?f[0]:sc.clientWidth/2,fy=f?f[1]:sc.clientHeight/2,cx=sc.scrollLeft+fx,cy=sc.scrollTop+fy,r=nh/oldH;MZ_=z;sv.style.height=nh+'px';sv.style.minHeight='0';sc.scrollLeft=cx*r-fx;sc.scrollTop=cy*r-fy;
 $('mzIn').disabled=z>=MZMAX-.01;$('mzOut').disabled=z<=1.01}
{const sc=$('mapScroll'),rel=(x,y)=>{const b=sc.getBoundingClientRect();return[x-b.left,y-b.top]};
 $('mzIn').addEventListener('click',()=>mapZoom(MZ_*1.5));$('mzOut').addEventListener('click',()=>mapZoom(MZ_/1.5));$('mzFit').addEventListener('click',()=>mapZoom(1));
 sc.addEventListener('wheel',e=>{e.preventDefault();const k=Math.exp(-(e.deltaMode===1?e.deltaY*16:e.deltaY)*(e.ctrlKey?.01:.0018));mapZoom(MZ_*k,rel(e.clientX,e.clientY))},{passive:false});
 let pin=null;const dist=t=>Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY),mid=t=>rel((t[0].clientX+t[1].clientX)/2,(t[0].clientY+t[1].clientY)/2);
 sc.addEventListener('touchstart',e=>{if(e.touches.length===2){pin={d:dist(e.touches),z:MZ_,m:mid(e.touches)};e.preventDefault()}},{passive:false});
 sc.addEventListener('touchmove',e=>{if(pin&&e.touches.length===2){e.preventDefault();const m=mid(e.touches);sc.scrollLeft-=m[0]-pin.m[0];sc.scrollTop-=m[1]-pin.m[1];pin.m=m;mapZoom(pin.z*dist(e.touches)/pin.d,m)}},{passive:false});
 sc.addEventListener('touchend',e=>{if(e.touches.length<2)pin=null});sc.addEventListener('touchcancel',()=>{pin=null});
 let dr=null,moved=false;sc.addEventListener('mousedown',e=>{if(e.button!==0)return;dr={x:e.clientX,y:e.clientY,l:sc.scrollLeft,t:sc.scrollTop};moved=false});
 addEventListener('mousemove',e=>{if(!dr)return;const dx=e.clientX-dr.x,dy=e.clientY-dr.y;if(!moved&&Math.hypot(dx,dy)>5){moved=true;sc.style.cursor='grabbing'}if(moved){sc.scrollLeft=dr.l-dx;sc.scrollTop=dr.t-dy}});
 addEventListener('mouseup',()=>{if(dr){dr=null;sc.style.cursor=''}});
 sc.addEventListener('click',e=>{if(moved){e.stopPropagation();e.preventDefault();moved=false}},true);
 addEventListener('resize',()=>{if(G.mapOn)mapZoom(MZ_,null,true)})}
$('mapBtn').addEventListener('click',e=>{initAudio();openMap(!G.mapOn);e.stopPropagation()});
$('mapClose').addEventListener('click',()=>openMap(false));
$('mProd').addEventListener('click',()=>{MMODE='prod';$('mProd').setAttribute('aria-pressed','true');$('mMoney').setAttribute('aria-pressed','false');renderMap()});
$('mMoney').addEventListener('click',()=>{MMODE='money';$('mProd').setAttribute('aria-pressed','false');$('mMoney').setAttribute('aria-pressed','true');renderMap()});
{const pick=e=>{const n=e.target.closest&&e.target.closest('.node');if(!n)return;MSEL=n.dataset.id;renderMap();const m=$('mapSvg').querySelector('.node[data-id="'+MSEL+'"]');if(m)try{m.focus({preventScroll:true})}catch(_){}};
 $('mapSvg').addEventListener('click',pick);$('mapSvg').addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pick(e)}})}
