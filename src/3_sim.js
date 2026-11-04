
/* ---------- solids + navigation ---------- */
let SOLIDS=[];
const FURN_SOL=()=>ET()==='sm'?[{x:688,y:416,w:226,h:370}]:ET()==='conv'?[{x:POS.F.x,y:POS.F.y+6,r:90},{x:POS.F.x-50,y:POS.F.y-136,w:100,h:70}]:[{x:POS.F.x,y:POS.F.y,r:98}];
function rebuildSolids(){SOLIDS=FURN_SOL().slice();
 /* råjernsverk: furnace, cowpers / transformers, coke plant, dust catcher (they stay standing after the Omlegging) */
 /* tall equipment is drawn rising up the screen, so its solid covers the whole drawn body (no walking "behind" it) */
 SOLIDS.push({x:POS.rjF.x,y:POS.rjF.y,r:86},rjEra()?{x:POS.rjF.x-44,y:POS.rjF.y-158,w:88,h:90}:{x:POS.rjF.x-62,y:POS.rjF.y-196,w:124,h:130},{x:-150,y:426,r:28},{x:-174,y:330,w:48,h:100});
 if(rjEra())SOLIDS.push({x:-480,y:190,w:216,h:46});else if(lv('cowper')){const n=min(4,1+floor(lv('cowper')/5));SOLIDS.push({x:-496,y:118,w:48+70*(n-1),h:146})}else SOLIDS.push({x:-300,y:200,w:64,h:40});
 if(lv('koks')){const n=min(3,1+floor(lv('koks')/6));SOLIDS.push({x:-714,y:140,w:44+52*(n-1),h:96})}
 /* supply plants: only what is built is solid */if(lv('kull'))SOLIDS.push({x:666,y:60,w:98,h:108});if(lv('o2'))SOLIDS.push({x:786,y:56,w:150,h:104});if(lv('kalk'))SOLIDS.push({x:928,y:68,w:112,h:56});
 if(B_('lf'))SOLIDS.push({x:POS.lf.x,y:POS.lf.y,r:62});
 SOLIDS.push({x:1415,y:216,w:240,h:168});/* bottom plate */
 if(B_('strang'))SOLIDS.push({x:1430,y:668,w:332,h:322},{x:1385,y:850,r:20});
 SOLIDS.push({x:1852,y:586,w:92,h:212});/* truck 1 */
 if(B_('vv'))SOLIDS.push({x:2035,y:520,w:240,h:160},{x:2318,y:540,w:304,h:120},{x:2648,y:420,w:240,h:362});
 if(B_('tc'))SOLIDS.push({x:2930,y:566,w:196,h:68});
 if(B_('stel'))SOLIDS.push({x:2622,y:106,w:470,h:88},{x:3246,y:548,w:296,h:88});
 if(B_('nett'))SOLIDS.push({x:3240,y:90,w:160,h:176});
 if(B_('kob'))SOLIDS.push({x:3262,y:878,w:156,h:110});
 navDirty=true}
const NC=20,GW=Math.ceil((WW-WX0)/NC),GH=Math.ceil(WH/NC);
const BLK=new Uint8Array(GW*GH);let navDirty=true;let FIELDS={},nFields=0;const QUE=new Int32Array(GW*GH);
function blockedPt(x,y,m){if(x<WX0+26||y<26||x>WW-26||y>WH-26||(x>QX-16&&y>QY-16))return true;
 for(const s of SOLIDS){if(s.r){if(hyp(x-s.x,y-s.y)<s.r+m)return true}else if(x>s.x-m&&x<s.x+s.w+m&&y>s.y-m&&y<s.y+s.h+m)return true}return false}
function rebuildNav(){for(let j=0;j<GH;j++)for(let i=0;i<GW;i++)BLK[j*GW+i]=blockedPt(WX0+i*NC+NC/2,j*NC+NC/2,12)?1:0;FIELDS={};nFields=0;navDirty=false}
const DIRS=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function field(tx,ty){if(navDirty)rebuildNav();const key=(tx|0)+','+(ty|0);let f=FIELDS[key];if(f)return f;
 if(nFields>200){FIELDS={};nFields=0}
 f=new Int32Array(GW*GH).fill(-1);const D=new Uint16Array(GW*GH);f.D=D;
 let ci=clamp(floor((tx-WX0)/NC),0,GW-1),cj=clamp(floor(ty/NC),0,GH-1);
 if(BLK[cj*GW+ci]){let best=-1,bd=1e9;for(let j=max(0,cj-5);j<=min(GH-1,cj+5);j++)for(let i=max(0,ci-5);i<=min(GW-1,ci+5);i++){if(BLK[j*GW+i])continue;const d=hyp(i-ci,j-cj);if(d<bd){bd=d;best=j*GW+i}}if(best>=0){ci=best%GW;cj=floor(best/GW)}}
 const s=cj*GW+ci;f[s]=s;let qh=0,qt=0;QUE[qt++]=s;
 while(qh<qt){const c=QUE[qh++],x=c%GW,y=(c-x)/GW;for(let k=0;k<8;k++){const d=DIRS[k],nx=x+d[0],ny=y+d[1];if(nx<0||ny<0||nx>=GW||ny>=GH)continue;const n=ny*GW+nx;if(BLK[n]||f[n]>=0)continue;
   if(d[0]&&d[1]&&(BLK[y*GW+nx]||BLK[ny*GW+x]))continue;f[n]=c;D[n]=D[c]+1;QUE[qt++]=n}}
 FIELDS[key]=f;nFields++;return f}
function losClear(ax,ay,bx,by){const d=hyp(bx-ax,by-ay),n=max(1,Math.ceil(d/14));for(let i=1;i<=n;i++){const t=i/n;if(blockedPt(lerp(ax,bx,t),lerp(ay,by,t),17))return false}return true}
const WPT={x:0,y:0};
function navStep(a,tx,ty){if(navDirty)rebuildNav();
 if(a.ntx!==tx||a.nty!==ty){a.ntx=tx;a.nty=ty;a.losT=0}
 if(hyp(tx-a.x,ty-a.y)<50){WPT.x=tx;WPT.y=ty;return WPT}
 a.losT=(a.losT||0)-1;
 if(a.losT<=0){a.losOk=losClear(a.x,a.y,tx,ty);a.losT=a.losOk?14:6}
 if(a.losOk){WPT.x=tx;WPT.y=ty;return WPT}
 const f=field(tx,ty);let c=clamp(floor(a.y/NC),0,GH-1)*GW+clamp(floor((a.x-WX0)/NC),0,GW-1);
 if(f[c]<0){const ci=c%GW,cj=(c-ci)/GW;let b=-1,bd=1e9;for(let j=max(0,cj-2);j<=min(GH-1,cj+2);j++)for(let i=max(0,ci-2);i<=min(GW-1,ci+2);i++){const n=j*GW+i;if(f[n]<0)continue;const d=f.D[n]*NC+hyp(WX0+i*NC+NC/2-a.x,j*NC+NC/2-a.y)*1.5;if(d<bd){bd=d;b=n}}
  if(b<0){WPT.x=tx;WPT.y=ty;return WPT}WPT.x=WX0+(b%GW)*NC+NC/2;WPT.y=floor(b/GW)*NC+NC/2;return WPT}
 for(let k=0;k<3;k++){const n=f[c];if(n<0||n===c)break;c=n}
 WPT.x=WX0+(c%GW)*NC+NC/2;WPT.y=floor(c/GW)*NC+NC/2;return WPT}
function collide(a){
 for(const s of SOLIDS){if(s.r){const dx=a.x-s.x,dy=a.y-s.y,d=hyp(dx,dy),m=s.r+14;if(d<m){if(d<.01){a.y=s.y+m}else{a.x=s.x+dx/d*m;a.y=s.y+dy/d*m}}}
  else{const nx=clamp(a.x,s.x,s.x+s.w),ny=clamp(a.y,s.y,s.y+s.h),dx=a.x-nx,dy=a.y-ny,d=hyp(dx,dy);if(d<14){if(d>.01){a.x=nx+dx/d*14;a.y=ny+dy/d*14}else{const l=a.x-s.x,r=s.x+s.w-a.x,t=a.y-s.y,b=s.y+s.h-a.y,m=min(l,r,t,b);if(m===l)a.x=s.x-14;else if(m===r)a.x=s.x+s.w+14;else if(m===t)a.y=s.y-14;else a.y=s.y+s.h+14}}}}
 a.x=clamp(a.x,WX0+30,WW-30);a.y=clamp(a.y,30,WH-30);
 if(a.x>QX-22&&a.y>QY-22){if(a.x-(QX-22)<a.y-(QY-22))a.x=QX-22;else a.y=QY-22}}
const near=(a,x,y,r)=>hyp(a.x-x,a.y-y)<r;
const stackKinds=a=>{const o=[],seen={};for(let i=a.stack.length-1;i>=0;i--){const it=a.stack[i];if(!seen[it.k]){seen[it.k]=1;o.push(it)}}return o};

/* ---------- rates: every flow in the plant is measured (rolling averages, t/min and kr/min) ---------- */
const RT={acc:{},ema:{},t:0};
function rec(key,v){RT.acc[key]=(RT.acc[key]||0)+v}
function updRates(dt){RT.t+=dt;if(RT.t<2)return;const a=.12,k=60/RT.t;
 for(const key in RT.acc){const v=RT.acc[key]*k;RT.ema[key]=(RT.ema[key]||0)*(1-a)+v*a;RT.acc[key]=0}
 for(const key in RT.ema)if(!(key in RT.acc)){RT.ema[key]*=1-a;if(RT.ema[key]<1e-4)delete RT.ema[key]}
 for(const key in RT.ema)RT.acc[key]=RT.acc[key]||0;RT.t=0}
const rate=key=>RT.ema[key]||0;
const flow=(a,b)=>rate('f:'+a+'>'+b);

/* ---------- piles, sources, targets ---------- */
const PILE={};for(const k of PRK)PILE[k]=[];
function addPile(it){const a=PILE[it.k];a.push(it);if(a.length>999)a.shift()}
const isProd=k=>PRK.indexOf(k)>=0;
const ST={elek:0,kanal:0,hette:0};/* small stores that refill by themselves */
const SRC=[
 {id:'y0',kind:'scrap',x:POS.y0.x,y:POS.y0.y,r:104,yard:1,open:()=>true},
 {id:'y1',kind:'scrap',x:POS.y1.x,y:POS.y1.y,r:104,yard:1,open:()=>lv('yard2')>0},
 {id:'ore',kind:'ore',x:POS.ore.x,y:POS.ore.y,r:104,yard:1,tt:ORE_T,open:()=>!rjClosed()},
 {id:'st_elek',kind:'elek',x:POS.elek.x,y:POS.elek.y,r:62,store:'elek',open:()=>isEAF()},
 {id:'st_kanal',kind:'kanal',x:POS.kanal.x,y:POS.kanal.y,r:60,store:'kanal',open:()=>lv('kanal')>0},
 {id:'st_hette',kind:'hette',x:POS.hette.x,y:POS.hette.y,r:60,store:'hette',open:()=>lv('hette')>0},
 {id:'koklag',kind:'kokk',x:POS.koklag.x,y:POS.koklag.y,r:66,open:()=>true,cnt:()=>S.kok.ready,dec:()=>S.kok.ready--},
 {id:'kokv',kind:'kokv',x:POS.kokv.x,y:POS.kokv.y,r:52,open:()=>true,cnt:()=>S.kok.hot,dec:()=>S.kok.hot--},
 {id:'pot',kind:'slag',x:POS.pot.x,y:POS.pot.y,r:52,open:()=>slagOn(),cnt:()=>S.pot,dec:()=>S.pot--},
 ...PRK.map(k=>({id:'p_'+k,kind:k,x:PR[k].pile.x,y:PR[k].pile.y,r:56,pile:k,open:()=>pileOn(k)}))];
const SRCm=Object.fromEntries(SRC.map(s=>[s.id,s]));
const yardT=s=>S.yard[s.id]||0;
const count=s=>s.yard?floor(yardT(s)/(s.tt||SCRAP_T)):s.pile?PILE[s.pile].length:s.cnt?s.cnt():ST[s.store]|0;
function take(s){if(s.yard){const tt=s.tt||SCRAP_T;S.yard[s.id]=yardT(s)-tt;const a=rnd(0,TAU),r=Math.sqrt(Math.random());return[{k:s.kind,kk:(Math.random()*8)|0,t:tt,age:-.2},s.x+Math.cos(a)*50*r,s.y+Math.sin(a)*70*r]}
 if(s.pile){const it=PILE[s.pile].pop();it.age=-.2;return[it,s.x,s.y-10]}
 if(s.cnt){s.dec();return[{k:s.kind,kk:(Math.random()*8)|0,age:-.2},s.x,s.y-10]}
 ST[s.store]--;return[{k:s.kind,kk:ST[s.store]%2,age:-.2},s.x,s.y-10]}
const pitRoom=()=>max(0,slotsMax()-S.kok.slots-PIT.n);
const HOPK=6;
const NODE={};
const nodeRoom=id=>{const n=NODE[id];return n?max(0,n.cap-n.in.length-n.inc):0};
const TG=[
 {id:'drop',kind:'scrap',x:POS.drop.x,y:POS.drop.y,r:56,open:()=>true,free:()=>floor((chgCap()-S.chg)/SCRAP_T+1e-6),give:it=>{S.chg+=it.t||SCRAP_T;rec('f:skrap>ovn',it.t||SCRAP_T)},fx:{x:POS.drop.x+30,y:POS.drop.y}},
 {id:'skip',kind:'ore',x:POS.skip.x,y:POS.skip.y,r:56,open:()=>!rjClosed(),free:()=>floor((skipCap()-S.rj.ore)/ORE_T+1e-6),give:it=>{S.rj.ore+=it.t||ORE_T;rec('f:malm>rj',it.t||ORE_T);S.st.ore+=it.t||ORE_T},fx:{x:POS.skip.x+20,y:POS.skip.y-20}},
 {id:'rjsale',sell:'dock',x:POS.rjsale.x,y:POS.rjsale.y,r:56,open:()=>!rjClosed()||PILE.pig.length>0||P.stack.some(i=>i.k==='pig')||helpers.some(h=>h.stack.some(i=>i.k==='pig'))},
 {id:'rack',kind:'elek',x:POS.rack.x,y:POS.rack.y,r:44,open:()=>isEAF(),free:()=>floor(12-S.elek+1e-6),give:()=>{S.elek=min(12,S.elek+1)}},
 {id:'plate',kinds:['kokk','kanal','hette'],x:POS.plate.x,y:POS.plate.y,r:42,open:()=>true,
  free:k=>k==='kokk'?pitRoom():k==='kanal'?(lv('kanal')?HOPK-(S.kanal|0):0):k==='hette'?(lv('hette')?HOPK-(S.hette|0):0):0,
  give:it=>{if(it.k==='kokk')S.kok.slots++;else S[it.k]=(S[it.k]|0)+1},fx:{x:POS.pit.x-80,y:POS.pit.y}},
 {id:'koklag',kind:'kokv',x:POS.koklag.x,y:POS.koklag.y,r:66,open:()=>true,free:()=>99,give:()=>{S.kok.cool.push(coolT())}},
 {id:'slagp',kind:'slag',sell:'dock',slag:1,x:POS.slagp.x,y:POS.slagp.y,r:60,open:()=>slagOn()},
 {id:'bil1',sell:'dock',x:POS.bil1.x,y:POS.bil1.y,r:56,open:()=>true},
 {id:'bil2',sell:'dock',x:POS.bil2.x,y:POS.bil2.y,r:56,open:()=>B_('stel')},
 {id:'tog',sell:'tog',x:POS.tog.x,y:POS.tog.y,r:56,open:()=>B_('tog')},
 {id:'kai',sell:'kai',x:POS.kai.x,y:POS.kai.y,r:56,open:()=>B_('kai')},
 {id:'gjvIn',kind:'billet',x:POS.gjvIn.x,y:POS.gjvIn.y,r:44,open:()=>B_('vv'),free:()=>nodeRoom('gjv'),give:it=>{NODE.gjv.in.push(it);rec('f:strang>gjv',it.t)}},
 {id:'nettIn',kind:'coil',x:POS.nettIn.x,y:POS.nettIn.y,r:44,open:()=>B_('nett'),free:()=>nodeRoom('nett'),give:it=>{NODE.nett.in.push(it);rec('f:stel>nett',it.t)}},
 {id:'kobIn',kinds:['rebar','tcore'],x:POS.kobIn.x,y:POS.kobIn.y,r:44,open:()=>B_('kob'),free:()=>nodeRoom('kob'),give:it=>{NODE.kob.in.push(it);rec('f:'+(it.k==='tcore'?'tc':'vv')+'>kob',it.t)}}];
const TGm=Object.fromEntries(TG.map(z=>[z.id,z]));
const accepts=(z,it)=>z.sell?(z.slag?it.k==='slag':isProd(it.k)):z.kinds?z.kinds.indexOf(it.k)>=0:z.kind===it.k;
const freeFor=(z,k)=>z.sell?1e9:z.free?max(0,z.free(k)):1e9;
const VEH={bil1:{load:0,off:0,drive:0,cap:12},bil2:{load:0,off:0,drive:0,cap:12},tog:{load:0,off:0,drive:0,cap:24},kai:{load:0,off:0,drive:0,cap:40}};
const itemVal=it=>it.k==='slag'?PR.slag.p*(it.t||2)*(1+.15*lv('slagcap')):val(it);
function sellVal(it,z){return itemVal(it)*SELLM[z.sell]()*gm()}
function earn(pr){S.earned+=pr;S.life+=pr;G.earnWin+=pr}
function sell(a,it,z){const pr=sellVal(it,z);if(a===P)S.money+=pr;else z.cash=(z.cash||0)+pr;earn(pr);S.st.sold++;S.st.soldK[it.k]=(S.st.soldK[it.k]||0)+1;
 const src=it.k==='slag'?'ovn':PR[it.k].z;rec('f:'+src+'>salg',it.k==='slag'?E_().slag*.12:it.t);rec('v:'+src,pr);rec('v:salg',pr);
 if(VEH[z.id])VEH[z.id].load++;
 const[sx,sy]=ws(a.x,a.y-40),onS=sx>-40&&sx<cssW+40&&sy>-40&&sy<cssH+40;
 if(onS){ftext('+'+kr(pr),a.x,a.y-60,a===P?C.coin:C.uidim);if(a===P&&coins.length<30){const[tx,ty]=moneyTarget();coins.push({x:sx,y:sy,x0:sx,y0:sy,tx,ty,t:0,d:.55+Math.random()*.15})}else bumpMoney();if(a===P)sfx('coin')}
 if(a===P)buzz(10)}
/* helper cash stacks beside a sale point */
const cashAt=z=>z.id==='bil1'?{x:z.x-62,y:z.y+12}:{x:z.x+62,y:z.y+12};
function collectCash(){for(const z of TG){if(!z.cash||!z.open())continue;const cp=cashAt(z);if(!near(P,cp.x,cp.y,62)&&!near(P,z.x,z.y,z.r))continue;
  const c=z.cash;z.cash=0;S.money+=c;ftext('+'+kr(c),P.x,P.y-70,C.coin);sfx('coin');buzz(12);
  const[sx,sy]=ws(cp.x,cp.y),[tx,ty]=moneyTarget();for(let i=0;i<min(8,2+floor(Math.log10(c+1)*1.5));i++)if(coins.length<30)coins.push({x:sx,y:sy,x0:sx+rnd(-10,10),y0:sy+rnd(-10,10),tx,ty,t:-i*.06,d:.55+Math.random()*.15})}}
function unloadOne(a,z){for(let i=a.stack.length-1;i>=0;i--){const it=a.stack[i];if(!accepts(z,it))continue;if(freeFor(z,it.k)<=0)return false;
  a.stack.splice(i,1);const n=a.stack.length;fly(it,a.x,a.y-38-n*7,z.fx||{x:z.x,y:z.y-20},0);
  if(z.sell)sell(a,it,z);else{z.give(it);if(a===P)sfx('drop')}
  return true}return false}
function pickOne(a,s){if(count(s)<=0)return false;const[it,fx,fy]=take(s);const n=a.stack.length;a.stack.push(it);fly(it,fx,fy,a,n);if(a===P){sfx('pop',min(n,12));buzz(6)}return true}
function act(a,dt){a.cd-=dt;if(a.cd>0)return;
 if(a.stack.length){for(const z of TG){if(z.open()&&near(a,z.x,z.y,z.r)&&unloadOne(a,z)){a.cd=.07;return}}}
 if(a.stack.length>=capCarry())return;
 for(const s of SRC){if(!s.open()||count(s)<=0||!near(a,s.x,s.y,s.r))continue;
  if(a.stack.filter(i=>i.k===s.kind).length>=demand(s.kind)){if(T-G.fullHint>2.5&&a.stack.length){G.fullHint=T;ftext(t_(s.kind==='scrap'?'Chargeringen er full':'Ingen plass å levere'),a.x,a.y-90,C.uidim)}continue}
  pickOne(a,s);a.cd=.08;return}}
/* how many of a kind the open drop zones can take right now (buyers take everything) */
function demand(k){if(isProd(k))return 1e9;if(k==='slag')return slagOn()?1e9:0;if(k==='kokv')return 99;let d=0;for(const z of TG)if(!z.sell&&z.open()&&accepts(z,{k}))d+=freeFor(z,k);return d}

/* ---------- where a product goes next by hand (a station input) or null = to sale ---------- */
function handNext(k){if(k==='billet'&&B_('vv')&&S.tg.strang&&!lv('varm'))return TGm.gjvIn;
 if((k==='rebar'||k==='tcore')&&B_('kob')&&!lv('rullkob')&&S.tg[k==='tcore'?'tc':'vv'])return TGm.kobIn;
 if(k==='coil'&&B_('nett')&&!lv('ktrans')&&S.tg.stel)return TGm.nettIn;return null}

/* ---------- helpers: strict state machine (go to source → fill → go to target → unload ALL → return) ---------- */
function bestYard(h){let best=null,bv=-1;for(const id of['y0','y1']){const s=SRCm[id];if(!s.open())continue;let v=count(s)+(h&&h.src===s?3:0);if(v>bv){bv=v;best=s}}return best||SRCm.y0}
function bestSell(h){const d=S.dest,from=(h&&h.src)||h||P;const dock=()=>{let best=TGm.bil1,bd=1e9;for(const id of['bil1','bil2','rjsale']){const z=TGm[id];if(!z.open())continue;const d=hyp(z.x-from.x,z.y-from.y);if(d<bd){bd=d;best=z}}return best};
 if(d==='dock')return dock();if(d&&d!=='best'&&TGm[d]&&TGm[d].open())return TGm[d];
 let b=dock();for(const k of['tog','kai'])if(TGm[k].open()&&SELLM[k]()>SELLM[b.sell]()*1.08)b=TGm[k];return b}
const prodTgt=(h,k)=>{const n=handNext(k);return n&&n.open()&&freeFor(n,k)>0?n:bestSell(h)};
function pairNeed(sid,tid){const Sx=SRCm[sid];if(!Sx.open())return -1;const n=count(Sx);if(n<=0)return -1;
 if(tid==='PROD')return .4+min(.5,n/16);const Z=TGm[tid];if(!Z.open())return -1;const fr=freeFor(Z,Sx.kind);if(fr<=0)return -1;
 if(sid==='koklag')return 1.3;if(sid==='kokv')return .6+S.kok.hot/8;if(sid==='pot')return S.pot>=potMax()-2?1.6:.45+S.pot/potMax();if(tid==='rack')return(12-S.elek)/12+.2;return fr/HOPK}
function grp(pairs,col){return{col,pairs,src:h=>{let best=null,bv=-1;for(const p of pairs){const v=pairNeed(p[0],p[1])+(h&&h.src===SRCm[p[0]]?.05:0);if(v>bv){bv=v;best=SRCm[p[0]]}}
  if(best)return best;for(const p of pairs)if(SRCm[p[0]].open())return SRCm[p[0]];return SRCm[pairs[0][0]]},
 tgt:h=>{for(const p of pairs)if(SRCm[p[0]]===h.src)return p[1]==='PROD'?prodTgt(h,h.src.kind):TGm[p[1]];return TGm[pairs[0][1]]||bestSell(h)}}}
const prodRoute=(k,col)=>({col,src:()=>SRCm['p_'+k],tgt:h=>prodTgt(h,k)});
const ROUTES={
 skrap:{col:HIRE.skrap.col,src:h=>bestYard(h),tgt:()=>TGm.drop},
 rj:grp([['ore','skip'],['p_pig','PROD']],HIRE.rj.col),
 ovn:grp([['pot','slagp'],['st_elek','rack']],HIRE.ovn.col),
 blokk:grp([['koklag','plate'],['kokv','koklag'],['st_kanal','plate'],['st_hette','plate'],['p_ingot','PROD']],HIRE.blokk.col),
 strang:prodRoute('billet',HIRE.strang.col),vv:prodRoute('rebar',HIRE.vv.col),tc:prodRoute('tcore',HIRE.tc.col),
 stel:prodRoute('coil',HIRE.stel.col),nett:prodRoute('mesh',HIRE.nett.col),kob:prodRoute('bent',HIRE.kob.col)};
function syncHelpers(){for(const st in HIRE){const want=lv(HIRE[st].id);let have=helpers.filter(h=>h.r===st).length;const pp=HIREPOS[st];
  while(have<want){helpers.push({r:st,i:have,gi:helpers.length,x:pp.x+rnd(-10,10),y:pp.y+30,vx:0,vy:0,walk:0,stack:[],cd:0,wait:0,moving:false,state:'toSrc',src:null,tg:null,trip:0,stuck:0});have++}}}
function slot(node,gi){const a=gi*2.39996+.6,r=node.yard?54:node.r>60?28:12+(gi%3)*6;return[node.x+Math.cos(a)*r,node.y+Math.sin(a)*r*.6]}
function hMove(h,tx,ty,dt){const w=navStep(h,tx,ty),dx=w.x-h.x,dy=w.y-h.y,d=hyp(dx,dy),sp=hspeed(),k=min(1,dt*8),dd=hyp(tx-h.x,ty-h.y);
 if(dd>5&&d>.5){const s=dd<30?sp*max(.35,dd/30):sp;h.vx=lerp(h.vx,dx/d*s,k);h.vy=lerp(h.vy,dy/d*s,k)}else{h.vx*=.75;h.vy*=.75}
 const ox=h.x,oy=h.y;h.x+=h.vx*dt;h.y+=h.vy*dt;collide(h);const m=hyp(h.vx,h.vy);h.moving=m>15;if(h.moving)h.walk+=dt*m*.07;
 if(hyp(h.x-ox,h.y-oy)<sp*dt*.15&&dd>20){h.stuck+=dt;if(h.stuck>1.2){h.losT=0;h.losOk=false;h.stuck=0;h.x+=rnd(-8,8);h.y+=rnd(-8,8);collide(h)}}else h.stuck=0;
 return dd}
/* is there carrying work on this route that the automation is not already covering? (with a little hysteresis) */
function routeWork(r){const R=ROUTES[r];
 if(r==='skrap'){const y=bestYard(null);return count(y)>=2&&TGm.drop.free()>=min(hcap(),3)}
 if(R.pairs)return R.pairs.some(p=>{const Sx=SRCm[p[0]];return pairNeed(p[0],p[1])>0&&count(Sx)>=(p[1]==='PROD'?2:1)});
 const s=R.src();return s.open()&&count(s)>=2}
/* operator posts: one helper of a route rides in the crane cab (when that crane runs by itself), the rest stand at the desk */
const postCrane=r=>{const c=POSTS[r]&&POSTS[r].crane&&CRm[POSTS[r].crane];return c&&c.built()?c:null};
const inCab=h=>h.state==='post'&&h.cab&&postCrane(h.r)&&!postCrane(h.r).man;
function deskSpot(h){const p=POSTS[h.r],k=helpers.filter(o=>o.r===h.r&&o!==h&&(o.state==='post'||o.state==='toPost')&&!o.cab&&o.gi<h.gi).length;return[p.x-16+k*16,p.y-26]}
function toPost(h){const c=postCrane(h.r);h.cab=!!c&&!helpers.some(o=>o!==h&&o.r===h.r&&o.cab&&(o.state==='post'||o.state==='toPost'));h.state='toPost';h.idle=0;h.postT=0;h.src=null;h.tg=null}
function hUpdate(h,dt){const R=ROUTES[h.r];h.cd-=dt;
 switch(h.state){
 case'toPost':{const[px,py]=deskSpot(h);const d=hMove(h,px,py,dt);if(d<10){h.state='post';h.postT=0}if(routeWork(h.r)&&h.postT>=0){h.state='toSrc'}break}
 case'post':{const[px,py]=deskSpot(h);h.postT+=dt;if(hyp(px-h.x,py-h.y)>3)hMove(h,px,py,dt);else{h.vx=h.vy=0;h.moving=false}
  /* back to carrying when the automation cannot keep up */
  if(h.postT>4&&(h.wk=(h.wk||0)+dt)>1){h.wk=0;if(routeWork(h.r)){h.state='toSrc';h.cab=false}}break}
 case'toSrc':{if(!h.src||!h.src.open())h.src=R.src(h);const[sx,sy]=slot(h.src,h.gi);const d=hMove(h,sx,sy,dt);
  if(d<10||(near(h,h.src.x,h.src.y,h.src.r*.75)&&d<40)){if(h.stack.length)G.vSrcLoaded++;h.state='pick';h.wait=0;h.tg=R.tgt(h)}break}
 case'pick':{hMove(h,h.x,h.y,dt);
  /* never pick more than the target can take (buyers take everything) */
  const lim=min(hcap(),h.tg?freeFor(h.tg,h.src.kind):hcap());
  if(h.stack.length>=max(1,lim)&&h.stack.length){h.tg=R.tgt(h);h.state='toTgt';break}
  if(h.cd<=0){if(h.src.open()&&count(h.src)>0&&lim>0&&(!h.stack.length||h.stack[0].k===h.src.kind)){pickOne(h,h.src);h.cd=.12;h.wait=0;h.idle=0}else{h.wait+=dt;
    /* nothing to carry for a while: go to the operator desk / crane cab instead of standing on the floor */
    if(!h.stack.length&&(h.idle=(h.idle||0)+dt)>3&&POSTS[h.r]){toPost(h);break}
    if(h.stack.length&&h.wait>1.5){h.tg=R.tgt(h);h.state='toTgt';break}
    if(!h.stack.length&&h.wait>1.2){const s=R.src(h);if(s!==h.src){h.src=s;h.state='toSrc'}else h.tg=R.tgt(h);h.wait=0}}}
  break}
 case'toTgt':{const tg=h.tg;const[tx,ty]=slot(tg,h.gi);const d=hMove(h,tx,ty,dt);
  if(d<10||(near(h,tg.x,tg.y,tg.r*.75)&&d<40)){h.state='unload';h.wait=0}break}
 case'unload':{hMove(h,h.x,h.y,dt);
  if(h.cd<=0){if(unloadOne(h,h.tg)){h.cd=.1;h.wait=0}else h.wait+=dt}
  if(!h.stack.length){h.trip++;G.trips++;h.src=null;h.tg=null;h.state='toSrc'}
  /* target full: stay and keep unloading as space frees — never walk back loaded */
  break}}}

/* ---------- steel furnace (one plot, six eras): converters, open hearth and arc furnaces ---------- */
const F={x:POS.F.x,y:POS.F.y,state:'melt',bath:0,solid:0,temp:1540,tilt:0,tapT:0,refT:0,flick:1,arc:0,tapAmt:0,slagAcc:0,stop:false,L:null,
 ch:null,chT:0,roof:0,lim:'',rate:0,rp:0,sup:{},elekOut:false,starve:0,waitHM:0,waitLadle:0,smDoor:-1,SB:null,scIn:0,hmIn:0,hmCh:null,lance:0};
function furnRate(){const E=E_();let rp=Rpow();F.elekOut=isEAF()&&S.elek<=0;if(F.elekOut)rp*=.4;F.rp=rp;let r=rp,lim='';
 for(const s of E.req){const c=lv(s)>0?supCap(s):E.fb*rp;F.sup[s]={cap:lv(s)>0?c:0,lim:c};if(c<r-1e-9){r=c;lim=s}}
 F.lim=lim;return r}
function furnRoom(){return max(0,fcap()-F.bath-F.solid)}
/* scrap the furnace may still take this heat (the rest of the charge must be råjern) */
function scrapRoom(){return max(0,min(furnRoom(),scrapMax()-F.scIn))}
/* råjern still needed this heat */
function hmNeed(){if(!usesHM())return 0;const cap=fcap();if(ET()==='conv')return max(0,cap-F.bath-F.solid-max(0,min(S.chg,scrapMax()-F.scIn)));return max(0,cap*E_().hm[1]-F.hmIn)}
function addSolid(m){F.solid+=m;F.scIn+=m}
function updFurnace(dt){const E=E_(),cap=fcap(),typ=E.type;
 /* ----- charging ----- */
 const room=furnRoom(),canCharge=F.state==='melt'||(E.ch==='belt'&&F.state==='refine');
 if(typ==='conv'){updConvCharge(dt,cap)}
 else if(F.ch){F.ch.t+=dt;const c=F.ch;
  if(E.ch==='bucket'){F.roof=c.t<c.dur*.3?ease(c.t/(c.dur*.3)):c.t<c.dur*.7?1:1-ease((c.t-c.dur*.7)/(c.dur*.3));if(!c.done&&c.t>=c.dur*.5){c.done=1;addSolid(c.amt);if(near(P,F.x,F.y,600))sfx('clank');spark(F.x,F.y,20,160,C.moltenhi,.6)}}
  if(c.t>=c.dur){if(!c.done){addSolid(c.amt)}F.ch=null;F.roof=0;F.smDoor=-1}}
 else if(canCharge&&room>.01&&S.chg>.01){const sr=scrapRoom();
  if(sr>.01){if(E.ch==='box'){F.chT+=dt;if(F.chT>=boxIv()&&(S.chg>=min(boxT,sr)-1e-6)){F.chT=0;const amt=min(boxT,S.chg,sr);S.chg-=amt;F.ch={t:0,dur:boxIv()*.85,amt,done:0};F.smDoor=(S.heats+floor(T))%3}}
  else if(E.ch==='bucket'){const bt=bucketT();if(F.solid<=cap*.3&&(S.chg>=min(bt,sr)-1e-6)){const amt=min(bt,S.chg,sr);S.chg-=amt;F.ch={t:0,dur:E.cd,amt,done:0}}}
  else{const m=min(beltRate()*dt,S.chg,sr);S.chg-=m;addSolid(m)}}}
 if(F.ch&&E.ch==='box'&&!F.ch.done&&F.ch.t>=F.ch.dur*.6){F.ch.done=1;addSolid(F.ch.amt)}
 /* ----- open hearth: hot metal is poured in through a door from the transfer ladle ----- */
 if(typ==='sm'){if(F.hmCh){const h=F.hmCh;h.t+=dt;if(h.t>=h.dur){F.bath+=h.amt;F.hmIn+=h.amt;F.hmCh=null}}
  else if(F.state==='melt'&&F.hmIn<cap*E.hm[1]-.005&&S.hm>min(.5,furnRoom()-.001)&&furnRoom()>.005){const amt=min(S.hm,cap*E.hm[1]-F.hmIn,furnRoom());S.hm-=amt;F.hmCh={t:0,dur:1.6,amt};rec('hmuse',amt)}}
 /* ----- slag: a full pot stops the furnace (the one hard stop) ----- */
 F.stop=slagOn()&&S.pot>=potMax();
 if(F.stop){G.slagT+=dt;if(!G.slagWas){G.slagWas=1;S.st.slagStops++;if(near(P,F.x,F.y,900))toast(t_('Slaggpotta er full – ovnen står!'))}}else if(G.slagWas){G.slagWas=0;G.slagRecover++}
 if(slagOn())S.st.slagT+=dt;
 /* ----- melting / blowing: limited by power (or the blower/lance) AND by every supply plant the era needs ----- */
 const r=furnRate();const paused=(F.ch&&(E.ch==='bucket'||typ==='conv'));F.rate=0;
 if(F.solid>0&&!F.stop&&!paused&&F.state!=='tapping'){const m=min(F.solid,r*dt);F.solid-=m;F.bath+=m;F.rate=m/dt;S.st.scrap+=m;rec('melt',m);
  for(const s of E.req)if(lv(s)>0)rec('s:'+s,m);
  if(isEAF()){S.elek=max(0,S.elek-m/E.elek)}
  if(slagOn()){F.slagAcc+=m/E.slag;while(F.slagAcc>=1){F.slagAcc-=1;if(S.pot<potMax())S.pot++}}
  if(typ!=='conv'&&Math.random()<dt*30)spark(F.x+rnd(-30,30),F.y-20+rnd(-20,20),2,120,C.arc,.35)}
 G.chgFull=(G.chgFull||0)*(1-dt*.1)+(F.state!=='ready'&&!F.stop&&!F.waitHM&&(typ==='conv'?S.hm>=hmCap()*.95&&S.chg>=scrapMin():S.chg>=chgCap()-SCRAP_T-.01)?dt*.1:0);
 /* waiting reasons: no scrap (starve) or no råjern (waitHM) */
 const waiting=F.state==='melt'&&F.solid<=1e-6&&!F.ch&&!F.hmCh&&F.bath<cap-.01;
 let needScrap=false,needHM=false;
 if(waiting){if(typ==='conv'){needScrap=S.chg<scrapMin()-1e-6;needHM=!needScrap&&S.hm<cap-min(S.chg,scrapMax())-1e-6}
  else{const sr=scrapRoom();needScrap=sr>.5&&S.chg<.5;needHM=!needScrap&&usesHM()&&S.hm<.5&&F.hmIn<cap*E.hm[1]-.05}}
 F.starve=needScrap?F.starve+dt:0;F.waitHM=needHM?F.waitHM+dt:0;
 if(F.waitHM>0)G.hmwAcc=(G.hmwAcc||0)+dt;
 if(F.state==='melt'){F.arc=F.solid>0&&!F.stop&&!paused?1:F.bath>0?.25:0;
  F.temp=typ==='conv'?lerp(F.temp,F.solid>0?1300+330*min(1,F.bath/cap):1250,dt*1.2):lerp(F.temp,1530+70*min(1,F.bath/cap)-40*min(1,F.solid/cap),dt*1.5);
  if(typ==='conv')F.lance=lerp(F.lance,F.solid>0&&!F.stop?1:0,dt*3);
  if(F.bath>=cap-.01&&F.solid<=1e-6&&!F.hmCh){F.state='refine';F.refT=refineT()}}
 else if(F.state==='refine'){F.arc=typ==='eaf'?.7:0;if(typ==='conv')F.lance=lerp(F.lance,0,dt*4);if(!F.stop)F.refT-=dt;F.temp=lerp(F.temp,1625,dt*.8);
  if(F.refT<=0){F.state='ready';F.temp=1625;if(near(P,F.x,F.y,700)){sfx('ready');buzz(40)}spark(F.x,F.y-10,26,200,C.moltenhi,.7);ftext(t_('1625 °C – KLAR!'),F.x,F.y-120,C.moltenhi);if(!lv('operator')&&S.heats<3)toast(t_('Klar for tapping! Gå på TAPP'))}}
 else if(F.state==='ready'){F.arc=0;F.lance=0;F.temp=1625+Math.sin(T*3)*2;const L=tapLadle();F.waitLadle=L?0:F.waitLadle+dt;if(!L)G.lwAcc=(G.lwAcc||0)+dt;if(lv('operator')&&L){F.opT=(F.opT||0)+dt;if(F.opT>.8)startTap()}}
 else if(F.state==='tapping'){F.tapT+=dt;const t=F.tapT,L=F.L,D=tapDur();F.arc=0;
  const tiltMax=typ==='conv'?1.45:E.tap==='spout'?.45:E.tap==='ebt'?.18:0;F.tilt=t<.6?ease(t/.6)*tiltMax:t<D-.6?tiltMax:max(0,tiltMax*(1-(t-(D-.6))/.6));
  if(t>.6&&t<D-.4){L.steel=min(L.sm,L.steel+L.sm*dt/(D-1));if(Math.random()<.9)spark(L.x,L.y-14,3,170,C.moltenhi,.6,-PI/2)}
  if(t>=D)finishTap()}
 F.flick=F.arc>0?(RM?.95:.72+Math.random()*.38*F.arc):1;
 /* ----- electrodes: crane keeps the rack full once bought ----- */
 if(isEAF()&&lv('elekkran')&&S.elek<10&&ST.elek>0){G.ekT=(G.ekT||0)+dt;if(G.ekT>1.5){G.ekT=0;ST.elek--;S.elek++}}
 /* ----- slag truck empties the pot by itself ----- */
 if(slagOn()&&lv('slaggbil')){if(!F.SB&&S.pot>=max(2,potMax()*.5))F.SB={t:0,n:0};
  if(F.SB){F.SB.t+=dt;if(F.SB.t>=2.5&&!F.SB.n){F.SB.n=S.pot;S.pot=0}if(F.SB.t>=6){const n=F.SB.n;if(n){const pr=n*itemVal({k:'slag',t:2})*SELLM.dock()*gm();S.money+=pr;earn(pr);S.st.soldK.slag=(S.st.soldK.slag||0)+n;rec('v:ovn',pr);rec('f:ovn>salg',n*E_().slag*.12);rec('v:salg',pr)}F.SB=null}}}}
/* converter charging: tilt toward the charging side, scrap box first, then the råjern ladle; then upright and blow */
function updConvCharge(dt,cap){
 if(F.ch){const c=F.ch;c.t+=dt;const k=c.t/c.dur;F.tilt=-(k<.18?ease(k/.18):k<.82?1:1-ease((k-.82)/.18))*1.25;
  if(!c.sDone&&k>=.3){c.sDone=1;if(c.s>0&&near(P,F.x,F.y,600))sfx('clank')}
  if(c.t>=c.dur){F.solid+=c.s+c.hm;F.scIn+=c.s;F.hmIn+=c.hm;F.ch=null;F.tilt=0}return}
 if(F.state!=='melt'||F.solid>1e-6)return;const need=cap-F.bath;if(need<=.01)return;
 const s=max(0,min(S.chg,scrapMax()-F.scIn,need));if(F.scIn+s<scrapMin()-1e-6)return;const hm=need-s;if(S.hm<hm-1e-6)return;
 S.chg-=s;S.hm-=hm;rec('hmuse',hm);F.ch={t:0,dur:2.6,s,hm};F.chT=0}
function finishTap(){const L=F.L;F.state='melt';F.tilt=0;F.bath=max(0,F.bath-F.tapAmt);F.temp=ET()==='conv'?1300:1555;F.L=null;F.scIn=0;F.hmIn=0;if(!L)return;L.steel=L.sm;S.heats++;S.st.heats++;rec('tap',L.sm);
 if(near(P,F.x,F.y,700))sfx('level');ftext(t_('Charge {0}: {1} t stål',S.heats,tf(L.sm)),F.x,F.y-140,C.ui);
 L.state='await';L.next=B_('lf')?'lf':castDest();L.from='ovn';save()}
const tapDur=()=>{const E=E_();return E.type==='conv'?3:E.tap==='spout'?3.4:E.tap==='hole'?2.8:2.4};
function startTap(){const L=tapLadle();if(!L||F.state!=='ready')return;const E=E_();F.state='tapping';F.tapT=0;F.opT=0;F.tapAmt=F.bath*(1-E.heel);F.L=L;
 L.state='filling';L.steel=0;L.sm=F.tapAmt;L.q=1;
 if(near(P,F.x,F.y,500)){shake=RM?0:6;sfx('tap');buzz([30,40,60])}spark(F.x+80,F.y,30,240,C.moltenhi,.8)}

/* ---------- råjernsverk: ore → råjernsovn (coke blast furnace / electric furnace) → torpedo cars → steel plant ---------- */
const RJ={rate:0,rp:0,lim:'',sup:{},starve:0,tapping:false,tapT:0,overflow:0,pigAcc:0,trainT:0,skipT:0,cow:0,heat:.6,stopT:0};
const TORPS=[];
let torpSeq=0;
function mkTorp(i){return{i,st:'fill',x:POS.torpX0+150*i,load:0,t:0,wait:0,ord:torpSeq++}}
function syncTorps(){const want=nTorp();while(TORPS.length<want)TORPS.push(mkTorp(TORPS.length))}
function rjRate(){let rp=rjPow(),r=rp,lim='';RJ.rp=rp;for(const s of rjReq()){const c=lv(s)>0?rjSupCap(s):.7*rp;RJ.sup[s]={cap:lv(s)>0?c:0,lim:c};if(c<r-1e-9){r=c;lim=s}}RJ.lim=lim;return r}
const castTorp=()=>TORPS.find(t=>t.st==='fill'&&Math.abs(t.x-POS.torpX0)<4);
function updRJ(dt){if(rjClosed()){RJ.rate=0;RJ.tapping=false;RJ.heat=max(0,RJ.heat-dt*.05);return}
 /* ore train fills the ore yard */
 const oy=SRCm.ore;S.yard.ore=min(oreYardCap(),yardT(oy)+oreYardRate()*dt);RJ.trainT+=dt;
 /* smelting: limited by the furnace size (or MVA) and by coke / hot blast */
 const r=rjRate(),oreK=1/feY(),room=max(0,hearthCap()-S.rj.hearth);
 const m=max(0,min(r*dt,S.rj.ore/oreK,room));S.rj.ore-=m*oreK;S.rj.hearth+=m;RJ.rate=m/dt;rec('rjmelt',m);rec('o:rj',m);S.st.hm+=m;
 for(const s of rjReq())if(lv(s)>0)rec('s:'+s,m);
 if(m>0)RJ.skipT+=dt*(.6+r);
 RJ.starve=S.rj.ore<oreK*.5&&room>.5?RJ.starve+dt:0;RJ.stopT=room<=.01?RJ.stopT+dt:0;
 RJ.heat=lerp(RJ.heat,m>0?1:.55,dt*.5);RJ.cow+=dt;
 /* tapping: into the torpedo car at the cast house, or to the pig-casting machine (sale switch, or no car there) */
 const tc=castTorp(),toSteel=S.tg.rj&&usesHM();RJ.tapping=false;RJ.overflow=0;
 if(tc&&toSteel&&S.rj.hearth>.05){const a=min(S.rj.hearth,4*dt,torpCap()-tc.load);if(a>0){tc.load+=a;S.rj.hearth-=a;RJ.tapping=true}}
 else if(S.rj.hearth>0&&(!toSteel||S.rj.hearth>=hearthCap()*.85)){const a=min(S.rj.hearth,max(toSteel?1.2:3,rjPow()*1.3)*dt);S.rj.hearth-=a;RJ.pigAcc+=a;RJ.overflow=a/dt;RJ.tapping=true;
  while(RJ.pigAcc>=PIG_T){RJ.pigAcc-=PIG_T;addPile({k:'pig',t:PIG_T,q:1});S.st.prod.pig=(S.st.prod.pig||0)+1;rec('o2:rj',PIG_T)}}
 RJ.tapT=RJ.tapping?RJ.tapT+dt:0;
 updTorps(dt)}
/* torpedo cars: queue on track B east of the cast house (no overtaking), the head fills under the runner on track A,
   drive loaded on track A to the steel plant, pour into the transfer ladle, return on track B */
const fillQ=()=>TORPS.filter(t=>t.st==='fill').sort((a,b)=>a.ord-b.ord);
function updTorps(dt){syncTorps();const sp=torpSpd(),X0=POS.torpX0,X1=POS.torpX1,cap=torpCap(),q=fillQ();
 for(const t of TORPS){t.t+=dt;
  switch(t.st){
  case'fill':{const k=q.indexOf(t),tx=X0+150*k;t.x=t.x<tx?min(tx,t.x+sp*dt):max(tx,t.x-sp*dt);
   if(k===0&&Math.abs(t.x-X0)<4){t.x=X0;const full=t.load>=cap-.01,need=hmNeed(),empty=S.rj.hearth<.2&&!RJ.tapping;
    /* a car leaves full; it only leaves part-loaded when the melt shop is actually short of iron and nothing else is on the way */
    const enRoute=TORPS.reduce((a,o)=>a+(o.st==='go'||o.st==='pour'?o.load:0),0),have=S.hm+enRoute,short=have<need-.05&&have<hmCap()*.5;
    if(full||(t.load>0&&empty&&short&&(have+t.load>=need||t.wait>6||t.load>=cap*.6))){t.st='go';t.wait=0}else if(t.load>0&&empty&&short)t.wait+=dt;else t.wait=0}
   if(!S.tg.rj||!usesHM()){t.wait=0}break}
  case'go':{const ahead=TORPS.filter(o=>o!==t&&(o.st==='pour'||(o.st==='go'&&o.x>t.x)));const tx=X1-ahead.length*150;t.x=min(tx,t.x+sp*dt);if(t.x>=X1-1){t.x=X1;t.st='pour'}break}
  case'pour':{if(!usesHM()){t.st='back';break}const room=max(0,hmCap()-S.hm),a=min(t.load,room,5*dt);if(a>0){t.load-=a;S.hm+=a;rec('f:rj>ovn',a);t.pouring=1}else t.pouring=0;
   if(t.load<=.01){t.load=0;t.st='back';t.pouring=0}break}
  case'back':{const ahead=TORPS.filter(o=>o!==t&&o.st==='back'&&o.x<t.x).length,tx=X0+150*(fillQ().length+ahead);t.x=max(tx,t.x-sp*dt);if(t.x<=tx+.5){t.st='fill';t.wait=0;t.ord=torpSeq++}break}}}}

/* ---------- overhead cranes: automatic, with manual override (joystick steers the hook) ---------- */
function mkCrane(id,o){const d=CRN[id];return Object.assign({id,d,x:d.park.x,y:d.park.y,h:1,state:'idle',job:null,load:0,pay:null,t:0,man:false},o)}
const CRANES=[
 mkCrane('skrap',{n:'skrapkran',built:()=>lv('kran')>0,spd:()=>kranSpd(),bonus:'dobbel last',
  find(c){if(chgCap()-S.chg<1)return null;const y=bestYard(null);if(count(y)<=0)return null;return{from:{x:y.x,y:y.y},to:{x:POS.drop.x-10,y:POS.drop.y},y}},
  pick(c,j){const want=kranLoad()*(c.man?2:1),amt=min(want,yardT(j.y));if(amt<1)return false;S.yard[j.y.id]=yardT(j.y)-amt;c.load=amt;return true},
  drop(c){const r=min(c.load,chgCap()-S.chg);if(r<=0)return false;S.chg+=r;c.load-=r;rec('f:skrap>ovn',r);spark(POS.drop.x,POS.drop.y,8,120,'#a8d4ff',.4);return c.load<=.01}}),
 mkCrane('malm',{n:'malmkran',built:()=>lv('malmkran')>0&&!rjClosed(),spd:()=>malmSpd(),bonus:'dobbel last',
  find(c){if(skipCap()-S.rj.ore<1)return null;const y=SRCm.ore;if(count(y)<=0)return null;return{from:{x:y.x,y:y.y},to:{x:POS.skip.x-10,y:POS.skip.y},y}},
  pick(c,j){const want=malmLoad()*(c.man?2:1),amt=min(want,yardT(j.y));if(amt<1)return false;S.yard.ore=yardT(j.y)-amt;c.load=amt;return true},
  drop(c){const r=min(c.load,skipCap()-S.rj.ore);if(r<=0)return false;S.rj.ore+=r;S.st.ore+=r;c.load-=r;rec('f:malm>rj',r);return c.load<=.01}}),
 mkCrane('ose',{n:'øsekran',built:()=>true,man_ok:()=>lv('osekran')>0,spd:()=>oseSpd()*(1+.6*0),bonus:'raskere',
  find(c){let best=null;for(const L of LADLES){if(L.state!=='await')continue;const to=ladleDest(L);if(!to)continue;const pr=L.steel>0?2:1;if(!best||pr>best.pr)best={L,to,from:{x:L.x,y:L.y},pr}}return best},
  pick(c,j){if(j.L.state!=='await')return false;const to=ladleDest(j.L);if(!to)return false;j.to=to;j.L.state='carried';c.pay=j.L;return true},
  drop(c,j){const L=c.pay;if(!L)return true;L.x=j.to.x;L.y=j.to.y;arriveLadle(L,j.to);c.pay=null;return true}}),
 mkCrane('mag',{n:'magnetkran',built:()=>B_('vv')&&lv('magkran')>0,spd:()=>150*(1+.08*lv('magkran')),bonus:'dobbel last',
  find(c){if(!S.tg.strang||lv('varm'))return null;if(PILE.billet.length<=0||nodeRoom('gjv')<=0)return null;return{from:{x:PR.billet.pile.x,y:PR.billet.pile.y},to:{x:POS.gjvIn.x,y:POS.gjvIn.y}}},
  pick(c){const n=min(magLoad()*(c.man?2:1),PILE.billet.length,nodeRoom('gjv'));if(n<=0)return false;c.pay=PILE.billet.splice(PILE.billet.length-n,n);return true},
  drop(c){const a=c.pay||[];while(a.length&&nodeRoom('gjv')>0){const it=a.shift();NODE.gjv.in.push(it);rec('f:strang>gjv',it.t)}if(a.length)return false;c.pay=null;return true}})];
const CRm=Object.fromEntries(CRANES.map(c=>[c.id,c]));
const canMan=c=>c.built()&&(!c.man_ok||c.man_ok());
function craneMove(c,tx,ty,dt,sp){const dx=tx-c.x,dy=ty-c.y,d=hyp(dx,dy);if(d<1)return 0;const s=min(d,sp*dt);c.x+=dx/d*s;c.y+=dy/d*s;return d-s}
function updCrane(c,dt,ix,iy){if(!c.built()){c.man=false;return}const sp=c.spd()*(c.man?1.6:1);c.t+=dt;
 if(c.id==='ose'){const q=LADLES.filter(l=>l.state==='await'&&ladleDest(l)).length-(c.state==='toPick'?1:0);G.oseQ=q>0?(G.oseQ||0)+dt:max(0,(G.oseQ||0)-dt*2);G.lwT=(G.lwT||0)+dt;if(G.lwT>8){G.ladleWait=(G.ladleWait||0)*.6+((G.lwAcc||0)/G.lwT)*.4;G.lwAcc=0;G.lwT=0}}
 if(c.man){c.x=clamp(c.x+ix*sp*dt,c.d.x0,c.d.x1);c.y=clamp(c.y+iy*sp*dt,c.d.y0,c.d.y1)}
 switch(c.state){
 case'idle':{c.job=c.find(c);if(c.job){c.state='toPick';c.t=0}else if(!c.man)craneMove(c,c.d.park.x,c.d.park.y,dt,sp*.5);break}
 case'toPick':{const j=c.job,f=j.from;if(c.id==='ose'){if(j.L.state!=='await'){c.state='idle';break}f.x=j.L.x;f.y=j.L.y}
  const d=c.man?hyp(f.x-c.x,f.y-c.y):craneMove(c,f.x,f.y,dt,sp);if(d<(c.man?30:2)){c.state='down';c.t=0}break}
 case'down':{c.h=max(0,1-c.t/.35);if(c.t>=.35){if(c.pick(c,c.job)){c.state='up';c.t=0}else{c.state='up2';c.t=0}}break}
 case'up2':{c.h=min(1,c.t/.35);if(c.t>=.35){c.state='idle';c.job=null}break}
 case'up':{c.h=min(1,c.t/.35);if(c.t>=.35){c.state='toDrop';c.t=0}break}
 case'toDrop':{const t=c.job.to;const d=c.man?hyp(t.x-c.x,t.y-c.y):craneMove(c,t.x,t.y,dt,sp);if(c.id==='ose'&&c.pay){c.pay.x=c.x;c.pay.y=c.y}if(d<(c.man?30:2)){c.state='lower';c.t=0}break}
 case'lower':{c.h=max(0,1-c.t/.35);if(c.id==='ose'&&c.pay){c.pay.x=c.x;c.pay.y=c.y}if(c.t>=.35){if(c.drop(c,c.job)){c.state='rise';c.t=0}}break}
 case'rise':{c.h=min(1,c.t/.35);if(c.t>=.35){c.state='idle';c.job=null}break}}}

/* ---------- støpeøser (ladles): the ladle car brings an empty ladle under the tap, the ladle crane does the rest ---------- */
const LADLES=[];
function mkLadle(i){return{i,state:'park',x:POS.park[0].x,y:POS.park[0].y+80*i,t:0,steel:0,sm:1,q:1,s:1,next:null,wait:0,slot:-1,lfT:0,from:''}}
function syncLadles(){const want=1+lv('ladle');while(LADLES.length<want)LADLES.push(mkLadle(LADLES.length))}
const PARKS=()=>[POS.tap,POS.park[0],POS.park[1]];
const occupied=(p,self)=>LADLES.some(l=>l!==self&&l.state!=='carried'&&hyp(l.x-p.x,l.y-p.y)<20&&(l.state!=='park'||l.atTap!=null));
/* the parked ladle nearest the tap moves under it when the tap position is free */
function updParked(dt){const ps=PARKS(),parked=LADLES.filter(l=>l.state==='park');const blocked=LADLES.some(l=>l.state!=='park'&&l.state!=='filling'&&l.state!=='carried'&&hyp(l.x-POS.tap.x,l.y-POS.tap.y)<20);
 const fill=LADLES.some(l=>l.state==='filling');let k=blocked||fill?1:0;
 for(const L of parked){let p=ps[min(k,ps.length-1)];L.atTap=k===0?1:null;L.x=lerp(L.x,p.x,min(1,dt*4));L.y=lerp(L.y,p.y,min(1,dt*4));k++}}
const tapLadle=()=>LADLES.find(l=>l.state==='park'&&l.atTap&&hyp(l.x-POS.tap.x,l.y-POS.tap.y)<6);
const goingTo=st=>LADLES.filter(l=>l.state===st||((l.state==='await'||l.state==='carried')&&l.next===st)).length;
function castDest(){if(!B_('strang'))return'pit';const m=S.cast;if(m==='blokk')return'pit';if(m==='strang')return'tur';
 /* auto: the caster takes the bulk; the ingot pit gets a heat only when the caster is already busy (spesialstål, small volume) */
 const tur=goingTo('tur')+goingTo('cast');if(tur<1+(lv('turret')?1:0))return'tur';if(goingTo('pit')===0)return'pit';return'tur'}
/* where the crane should take this ladle right now (null = destination busy, keep waiting) */
function ladleDest(L){const busy=st=>LADLES.some(l=>l!==L&&(l.state===st||(l.state==='carried'&&l.next===st)));
 switch(L.next){
 case'lf':return busy('lf')?null:POS.lf;
 case'pit':return busy('pit')?null:POS.pitL;
 case'tur':{const n=lv('turret')?2:1;for(let s=0;s<n;s++){if(!LADLES.some(l=>l!==L&&((l.state==='tur'||l.state==='cast')&&l.slot===s||(l.state==='carried'&&l.next==='tur'&&l.slot===s)))){L.slot=s;return POS.tur[s]}}return null}
 case'park':{for(const p of PARKS())if(!LADLES.some(l=>l!==L&&l.state!=='carried'&&hyp(l.x-p.x,l.y-p.y)<24))return p;return null}}return null}
function arriveLadle(L,p){const nx=L.next;L.wait=0;
 if(nx==='lf'){L.state='lf';L.lfT=lfTime();rec('f:'+L.from+'>lf',L.steel);L.from='lf'}
 else if(nx==='pit'){L.state='pit';rec('f:'+L.from+'>blokk',L.steel)}
 else if(nx==='tur'){L.state='tur';rec('f:'+L.from+'>strang',L.steel)}
 else{L.state='park';L.steel=0;L.atTap=null}}
function updLadle(L,dt){
 switch(L.state){
 case'filling':if(F.state!=='tapping'||F.L!==L){/* watchdog: never leave a ladle half-filled under the tap */if(L.steel>.1){L.state='await';L.next=B_('lf')?'lf':castDest();L.from='ovn'}else{L.state='park';L.steel=0}return}
  L.x=lerp(L.x,POS.tap.x,min(1,dt*6));L.y=lerp(L.y,POS.tap.y,min(1,dt*6));return;
 case'lf':{L.wait+=dt;if(Math.random()<dt*25)spark(L.x+rnd(-20,20),L.y-14,2,110,C.arc,.3);
  if(L.wait>=L.lfT){L.q=qLF();if(near(P,L.x,L.y,600))ftext(t_('Kvalitet ×{0}',L1(L.q)),L.x,L.y-80,C.prem);L.state='await';L.next=castDest()}return}
 case'tur':if(!LADLES.some(l=>l.state==='cast')&&CAST.gap<=0){L.state='cast';CAST.rot=1}return}}

/* ---------- blokkstøping: bottom pouring (stigstøping) ---------- */
const PIT={state:'idle',t:0,n:0,fill:0,hette:false,wait:0,L:null,pourTot:0,s0:0,ingT:0,dur:1,kanal:false};
let kcT=0;
function updPit(dt){const K=S.kok;
 for(let i=K.cool.length-1;i>=0;i--){K.cool[i]-=dt;if(K.cool[i]<=0){K.cool.splice(i,1);K.ready++}}
 const Lw=LADLES.find(l=>l.state==='pit'&&l.steel>.01);
 kcT+=dt;if(kcT>=kcraneIv()){kcT=0;/* the old mould crane works at base speed; carrying moulds yourself is faster */
  const place=pitRoom()>0&&K.ready>0&&(Lw||K.hot===0);if(place){K.ready--;K.slots++}else if(K.hot>0){K.hot--;K.cool.push(coolT())}else if(pitRoom()>0&&K.ready>0){K.ready--;K.slots++}}
 const pt=pitTimes();
 switch(PIT.state){
 case'idle':{if(!Lw){PIT.wait=0;break}PIT.wait+=dt;const need=max(1,Math.ceil(Lw.steel/(IT()*(1+RUNNER))-1e-6)),want=min(slotsMax(),need);
  if(K.slots>=want||(K.slots>0&&PIT.wait>3.5)){const n=min(K.slots,need);K.slots-=n;PIT.n=n;PIT.L=Lw;PIT.kanal=(S.kanal|0)>0;if(PIT.kanal)S.kanal--;
   PIT.hette=(S.hette|0)>0;if(PIT.hette)S.hette--;PIT.dur=PIT.kanal?1.2:3.6;PIT.state='prep';PIT.t=0;PIT.fill=0}break}
 case'prep':PIT.t+=dt;if(PIT.t>=PIT.dur){PIT.state='pour';PIT.t=0;PIT.s0=PIT.L.steel;PIT.pourTot=min(PIT.L.steel,PIT.n*IT()*(1+RUNNER));if(near(P,POS.pit.x,POS.pit.y,450))sfx('tap')}break;
 case'pour':{PIT.t+=dt;const f=min(1,PIT.t/pt.pour);PIT.fill=f;PIT.L.steel=max(0,PIT.s0-PIT.pourTot*f);
  if(f>=1){PIT.ingT=PIT.pourTot/(1+RUNNER)/PIT.n;S.st.castB++;if(near(P,POS.pit.x,POS.pit.y,450)&&T-(G.benT||-99)>20){G.benT=T;ftext(t_('Ben i kanalene: −{0} %',Math.round(RUNNER*100)),POS.pit.x,POS.pit.y+60,C.uidim)}PIT.state='solid';PIT.t=0;const L=PIT.L;if(L.steel<.02){L.steel=0;L.state='await';L.next='park'}}break}
 case'solid':PIT.t+=dt;if(PIT.t>=pt.solid){PIT.state='strip';PIT.t=0}break;
 case'strip':PIT.t+=dt;if(PIT.t>=pt.strip){K.hot+=PIT.n;const q=PIT.L?PIT.L.q:1;
  for(let i=0;i<PIT.n;i++){const it={k:'ingot',t:PIT.ingT*(1-crop(PIT.hette)),q};S.st.prod.ingot=(S.st.prod.ingot||0)+1;rec('o:blokk',it.t);addPile(it)}
  if(near(P,POS.pit.x,POS.pit.y,500)){ftext(t_('{0} støpeblokker',PIT.n),POS.pit.x,POS.pit.y-110,C.ui);sfx('clank')}
  PIT.n=0;PIT.fill=0;PIT.state='idle';PIT.L=null}break}}

/* ---------- stranggjuting: turret, tundish, up to 8 strands, shear → torch cutting, cooling bed ---------- */
const CAST={rot:0,gap:0,acc:[0,0,0,0,0,0,0,0],run:[],bed:[],cut:[]};
const SY=i=>POS.strang.y+i*38,CUTX=()=>lv('torch')?1620:1600,MOULDX=1462;
function updCaster(dt){CAST.rot=max(0,CAST.rot-dt);CAST.gap=max(0,CAST.gap-dt);const L=LADLES.find(l=>l.state==='cast');const n=nStr(),sr=strandRate(),bt=billetT();
 if(L){const draw=min(L.steel,n*sr*dt);L.steel-=draw;const per=draw/n;
  for(let i=0;i<n;i++){CAST.acc[i]+=per;if(CAST.acc[i]>=bt){CAST.acc[i]-=bt;CAST.run.push({lane:i,x:MOULDX,t:bt*(lv('torch')?.995:.98),q:L.q,cut:0})}}
  if(L.steel<=.01){/* the strand tails out what is left */for(let i=0;i<n;i++){if(CAST.acc[i]>.2)CAST.run.push({lane:i,x:MOULDX,t:CAST.acc[i]*.98,q:L.q,cut:0});CAST.acc[i]=0}
   L.steel=0;S.st.castS++;L.state='await';L.next='park';CAST.gap=lv('turret')?.8:3.5}}
 const v=110*(1+.1*lv('caster'));
 for(let i=CAST.run.length-1;i>=0;i--){const r=CAST.run[i];r.x+=v*dt;if(r.x>=CUTX()&&!r.cut){r.cut=1;CAST.cut.push({lane:r.lane,t:0});if(near(P,1600,SY(r.lane),420)&&!lv('torch')&&Math.random()<.3)sfx('clank')}
  if(r.x>=1652){CAST.run.splice(i,1);CAST.bed.push({it:{k:'billet',t:r.t,q:r.q,hot:1},y:SY(r.lane),age:0});S.st.prod.billet=(S.st.prod.billet||0)+1;rec('o:strang',r.t)}}
 for(let i=CAST.cut.length-1;i>=0;i--){CAST.cut[i].t+=dt;if(CAST.cut[i].t>.6)CAST.cut.splice(i,1)}
 for(let i=CAST.bed.length-1;i>=0;i--){const b=CAST.bed[i];b.age+=dt;b.y=lerp(b.y,990,dt*.25);if(b.age>2.2){if(route('strang',b.it))CAST.bed.splice(i,1);else b.age=1.5}}
 if(CAST.bed.length>14){const b=CAST.bed.shift();addPile(b.it)}}

/* ---------- product flow: processors with a capacity in t/s; items queue in front of each station ---------- */
function mkNode(id,cap,rateF,fx,on){NODE[id]={id,in:[],inc:0,cap,cur:null,p:0,dur:1,fxd:0,rate:rateF,fx,on,busy:0,util:0}}
const prod=(it,k)=>{it.k=k;S.st.prod[k]=(S.st.prod[k]||0)+1};
mkNode('gjv',10,()=>gjvRate(),()=>{},()=>B_('vv'));
mkNode('vv',4,()=>vvRate(),it=>{it.wc=wantCoil();if(!it.wc)prod(it,'rebar')},()=>B_('vv'));
mkNode('tc',4,()=>tcRate(),it=>prod(it,'tcore'),()=>B_('tc'));
mkNode('stel',4,()=>stelRate(),it=>prod(it,'coil'),()=>B_('stel'));
mkNode('nett',8,()=>nettRate(),it=>prod(it,'mesh'),()=>B_('nett'));
mkNode('kob',8,()=>kobRate(),it=>{it.tc=it.k==='tcore';prod(it,'bent')},()=>B_('kob'));
function wantCoil(){if(!B_('stel'))return false;if(S.mix==='vals')return true;if(S.mix==='arm')return false;G.mixN=(G.mixN||0)+1;return G.mixN%2===0}
const ROLL={
 'strang>gjv':[[1762,990],[1992,990],[1992,600],[2034,600]],
 'gjv>vv':[[2276,600],[2318,600]],
 'vv>stel':[[2604,560],[2604,150],[2622,150]],
 'vv>tc':[[2888,600],[2930,600]],
 'vv>kob':[[2888,690],[3148,690],[3148,840],[3172,840]],
 'tc>kob':[[3126,600],[3148,600],[3148,840],[3172,840]],
 'stel>nett':[[3092,150],[3148,150],[3148,330],[3172,330]]};
for(const k in ROLL){const p=ROLL[k];let L=0;for(let i=1;i<p.length;i++)L+=hyp(p[i][0]-p[i-1][0],p[i][1]-p[i-1][1]);p.len=L}
ROLLS.push([ROLL['strang>gjv'],()=>B_('vv')&&lv('varm')>0],[ROLL['gjv>vv'],()=>B_('vv')],[ROLL['vv>stel'],()=>B_('stel')],[ROLL['vv>tc'],()=>B_('tc')],
 [ROLL['vv>kob'],()=>B_('kob')&&lv('rullkob')>0&&!B_('tc')],[ROLL['tc>kob'],()=>B_('kob')&&lv('rullkob')>0&&B_('tc')],[ROLL['stel>nett'],()=>B_('nett')&&lv('ktrans')>0]);
const PILEOF={strang:'billet',vv:'rebar',tc:'tcore',stel:'coil',nett:'mesh',kob:'bent'};
/* automated next station (roller table / inline) or null */
function nextOf(from,it){switch(from){
 case'strang':return B_('vv')&&lv('varm')&&S.tg.strang?'gjv':null;
 case'gjv':return'vv';
 case'vv':return it.wc&&B_('stel')?'stel':B_('tc')?'tc':B_('kob')&&lv('rullkob')&&S.tg.vv?'kob':null;
 case'tc':return B_('kob')&&lv('rullkob')&&S.tg.tc?'kob':null;
 case'stel':return B_('nett')&&lv('ktrans')&&S.tg.stel?'nett':null}return null}
/* inline steps must wait for room; legs that end in a sale pile never block */
const INLINE={gjv:1,vv:1};
function route(from,it){const nx=nextOf(from,it);
 if(nx){if(nodeRoom(nx)>0){send(from,nx,it);return true}if(INLINE[from]||(from==='vv'&&(nx==='tc'||nx==='stel')))return false}
 if(from==='vv'&&it.wc){it.wc=false;prod(it,'rebar')}
 if(PILEOF[from]){it.hot=0;addPile(it);rec('o2:'+from,it.t);return true}
 return false}
function send(from,to,it){const p=ROLL[from+'>'+to];NODE[to].inc++;rec('f:'+from+'>'+to,it.t);movers.push({it,p,to,d:0})}
function moverPos(m){const p=m.p;let d=m.d;for(let i=1;i<p.length;i++){const a=p[i-1],b=p[i],l=hyp(b[0]-a[0],b[1]-a[1]);if(d<=l||i===p.length-1){const t=l?clamp(d/l,0,1):1;return[lerp(a[0],b[0],t),lerp(a[1],b[1],t)]}d-=l}return p[p.length-1]}
function updFlow(dt){for(let i=movers.length-1;i>=0;i--){const m=movers[i];m.d+=dt*260;if(m.d>=m.p.len){movers.splice(i,1);const N=NODE[m.to];N.inc--;N.in.push(m.it)}}
 for(const id in NODE){const n=NODE[id];if(!n.on())continue;
  if(!n.cur&&n.in.length){n.cur=n.in.shift();n.p=0;n.fxd=0;n.dur=max(.05,n.cur.t/n.rate()*(id==='gjv'&&n.cur.hot?.8:1))}
  if(n.cur){n.busy+=dt;if(n.p<1)n.p=min(1,n.p+dt/n.dur);if(n.p>=1){if(!n.fxd){n.fx(n.cur);n.fxd=1;rec('o:'+id,n.cur.t)}if(route(id,n.cur)){n.cur=null;n.fxd=0}else n.busy-=dt*.5}}}
 G.utT=(G.utT||0)+dt;if(G.utT>=2){for(const id in NODE){const n=NODE[id];n.util=n.util*.8+(n.busy/G.utT)*.2;n.busy=0}G.utT=0}}

/* ---------- vehicles ---------- */
function updVeh(v,dt,dist){if(v.drive>0){v.drive+=dt;const t=v.drive;v.off=t<1.2?ease(t/1.2)*dist:t<1.8?dist:dist*(1-ease((t-1.8)/1.2));if(t>=3){v.drive=0;v.off=0}}else if(v.load>=v.cap){v.load-=v.cap;v.drive=.001}}

/* ---------- pads: one pad per upgrade (laid out side by side in the station's upgrade row), one hire pad per station,
   plus the next build and Nytt verk ---------- */
const PADS=[];
for(const u of UP)PADS.push({id:'u_'+u.id,kind:'up',st:u.st,u,x:-9999,y:-9999,slot:-1,lw:(UPROW[u.st]||{}).lw||74});
for(const st in HIRE){const hp=HIREPOS[st];PADS.push({id:'hire_'+st,kind:'hire',st,h:HIRE[st],x:hp.x,y:hp.y,lw:hp.lw||84})}
PADS.push({id:'build',kind:'build',x:0,y:0},{id:'prestige',kind:'prestige',x:PRESPAD.x,y:PRESPAD.y});
const PAD=Object.fromEntries(PADS.map(d=>[d.id,d]));
/* paid-in progress stays per upgrade id ('u:<id>', the same keys older saves use) */
const paidKey=d=>d.kind==='up'?'u:'+d.u.id:d.kind==='hire'?d.h.id:d.kind==='build'?'b:'+(nextBuild()||{}).id:'pres';
/* a pad is shown in its station row while its gate holds; a maxed one keeps its slot as a small MAKS tile */
const padShown=d=>d.kind==='up'&&d.slot>=0;
const padMaks=d=>padShown(d)&&lv(d.u.id)>=d.u.max;
let layKey='';
function layoutPads(){let key='';for(const u of UP)key+=upOpen(u)?1:0;if(key===layKey)return;layKey=key;
 const n={};for(const d of PADS){if(d.kind!=='up')continue;const R=UPROW[d.st];if(!upOpen(d.u)||!R){d.slot=-1;continue}const i=n[d.st]=(n[d.st]||0);n[d.st]++;
  if(i>=R.s.length){d.slot=-1;continue}const nx=R.s[i][0],ny=R.s[i][1];
  /* a pad that slides in under a standing player must not start paying: it needs a fresh step-on (or a tap) */
  if((d.x!==nx||d.y!==ny)&&d.x>-9000&&near(P,nx,ny,40))d.lock=true;d.slot=i;d.x=nx;d.y=ny}}
/* the upgrade a station pad shows: one already part-paid, else what limits the line, else the cheapest */
/* which upgrades fix what this station is waiting on right now */
function urgentIds(st){switch(st){
 case'rj':{if(RJ.starve>1.5)return['malmkran','malmtog','skip'];if(F.waitHM>1.5){if(!castTorp()&&S.rj.hearth>=hearthCap()*.6)return['torpn','torp'];if(!RJ.lim)return['rjsize']}return[]}
 case'rjsup':{const o=[];if(RJ.lim)o.push(RJ.lim);for(const q of rjReq())if(!lv(q))o.push(q);if(F.waitHM>1.5&&!RJ.lim)o.push('sinter');return o}
 case'sup':{const o=[];if(F.lim)o.push(F.lim);for(const s of E_().req)if(!lv(s))o.push(s);if(F.elekOut)o.push('elekkran');return o}
 case'skrap':return F.starve>1.5?['kran','charge','yard','yard2']:[];
 case'ovn':return F.waitLadle>2?['ladle']:F.stop?['slaggbil','slagcap']:(G.chgFull||0)>.6&&!F.lim?['furnace','power','refine']:[];
 case'lf':return G.oseQ>3?['osekran']:LADLES.some(l=>l.state==='await'&&l.next==='lf')?['lft']:[];
 case'blokk':return LADLES.some(l=>l.state==='await'&&l.next==='pit'&&l.steel>.01)?['kokup','solid','kokbig']:[];
 case'strang':return LADLES.some(l=>l.state==='await'&&l.next==='tur'&&l.steel>.01)&&LADLES.some(l=>l.state==='cast')?['caster','strands','turret']:[];
 case'gjv':if(PILE.billet.length>20&&B_('vv')&&!lv('varm'))return['magkran','varm'];
 default:{const n=NODE[st];return n&&n.util>.9&&n.in.length>=n.cap*.5?[{gjv:'gjvup',vv:'vvup',tc:'tcup',stel:'stelup',nett:'nettup',kob:'kobup'}[st],'bjelke','splitt','stelmor']:[]}}}
/* the upgrade the station would suggest (part-paid → fixes the bottleneck → cheapest); used by the KART panel and tests */
function curUp(st){const c=UP.filter(u=>u.st===st&&upAvail(u));if(!c.length)return null;
 const part=c.find(u=>(S.paid['u:'+u.id]||0)>0);if(part)return part;
 const ur=urgentIds(st);let b=null;for(const u of c)if(ur.indexOf(u.id)>=0&&(!b||upCost(u)<upCost(b)))b=u;if(b)return b;
 b=c[0];for(const u of c)if(upCost(u)<upCost(b))b=u;return b}
const padUrgent=d=>d.kind==='up'&&lv(d.u.id)<d.u.max&&urgentIds(d.st).indexOf(d.u.id)>=0;
function vis(d){switch(d.kind){
 case'up':return d.slot>=0&&lv(d.u.id)<d.u.max;
 case'hire':return stOn(d.st)&&(!d.h.req||d.h.req())&&lv(d.h.id)<d.h.costs.length;
 case'build':{const b=nextBuild();if(!b)return false;d.x=b.x;d.y=b.y;return true}
 case'prestige':return S.ph>=BUILDS.length}return false}
function cost(d){switch(d.kind){case'up':return upCost(d.u);case'hire':return d.h.costs[min(lv(d.h.id),d.h.costs.length-1)];case'build':{const b=nextBuild();return b?b.cost:0}}return 0}
function padName(d){switch(d.kind){case'up':return upName(d.u);case'hire':return hName(d.h);case'build':{const b=nextBuild();return b?t_('Bygg: {0}',t_(b.n)):''}case'prestige':return t_('Nytt verk')}return''}
function padSub(d){switch(d.kind){case'up':{const u=d.u;if(u.person)return t_('Hjelpere {0} av {1}',lv(u.id),u.max);return lv(u.id)>=u.max?t_('MAKS'):t_('Nivå {0}/{1}',lv(u.id),u.max)}
 case'hire':return t_('Hjelpere {0} av {1}',lv(d.h.id),d.h.costs.length);case'build':return t_('Fase {0} · ny stasjon',S.ph+2);
 case'prestige':return presGain()>0?t_('+{0} ekspertise',presGain()):t_('Tjen {0} totalt',kr(PRES_NEED))}return''}
function buy(d){if(d.kind==='prestige')return;const key=paidKey(d);let nm='';
 if(d.kind==='up'){const u=d.u;nm=upName(u);S.lv[u.id]=lv(u.id)+1;
  if(u.id==='yard2'){S.yard.y1=max(yardT(SRCm.y1),20);bakeFloor()}if(u.id==='malmkran'&&lv('malmkran')===1)toast(t_('Malmkranen henter malm selv. Trykk STYR KRANEN for å kjøre den selv.'));if(['kalk','o2','kull','koks','cowper'].indexOf(u.id)>=0)rebuildSolids();if(u.id==='malmkran'||u.id==='magkran'||u.id==='varm'||u.id==='rullkob'||u.id==='ktrans'||u.id==='kalk'||u.id==='o2'||u.id==='kull')bakeFloor();
  if(u.id==='kanal')ST.kanal=max(ST.kanal,8);if(u.id==='hette')ST.hette=max(ST.hette,8);if(u.id==='kokup')S.kok.ready+=1;
  if(u.id==='kran'&&lv('kran')===1)toast(t_('Skrapkranen henter skrap selv. Trykk STYR KRANEN for å kjøre den selv (dobbel last).'))}
 else if(d.kind==='hire'){S.lv[d.h.id]=lv(d.h.id)+1;nm=hName(d.h)}
 else if(d.kind==='build'){const b=nextBuild();S.b[b.id]=1;S.ph++;nm=t_(b.n);onBuild(b)}
 S.paid[key]=0;syncHelpers();syncLadles();layoutPads();sfx('buy');buzz([20,30,20]);confetti(d.x,d.y);
 ftext(nm+'!',d.x,d.y-50,C.good);if(d.kind!=='build')toast(t_('{0} – kjøpt!',nm));save()}
function onBuild(b){S.st.eraT[b.id]=S.st.play;rebuildSolids();bakeFloor();layoutPads();
 if(b.era){const E=E_();if(F.state==='tapping')finishTap();
  if(F.ch){const c=F.ch;if(c.hm!=null){F.solid+=c.s+c.hm;F.scIn+=c.s;F.hmIn+=c.hm}else if(!c.done)addSolid(c.amt)}if(F.hmCh){F.bath+=F.hmCh.amt;F.hmIn+=F.hmCh.amt;F.hmCh=null}
  F.ch=null;F.roof=0;F.smDoor=-1;F.tilt=0;F.lance=0;F.bath=min(F.bath,fcap());F.solid=min(F.solid,max(0,fcap()-F.bath));
  if(b.id==='eaf1')closeRJ();
  toast(t_('Ny ovn: {0}!',t_(E.n)),true);toast((E.type==='conv'?t_('Ingen ekstern energi – oksidasjonen gir varmen'):E.E+' kWh/t')+' · '+t_('tap-til-tap {0}',t_(E.tt))+(E.req.length?' · '+t_('trenger {0}',E.req.map(s=>t_(SUPN[s])).join(', ')):''));
  if(usesHM())toast(t_('Chargen: {0}–{1} % råjern, resten skrap',Math.round(E.hm[0]*100),Math.round(E.hm[1]*100)));
  if(b.id==='eaf1'){ST.elek=max(ST.elek,12);S.elek=12}G.chFx=2;sfx('mile');buzz([30,40,30,40,60])}
 else if(b.rjEra){toast(t_('Ny råjernsovn: {0}!',t_(RJE[rjEra()].n)),true);toast(t_(b.d));G.chFx=2;sfx('mile')}
 else{toast(t_('{0} er bygget!',t_(b.n)),true);if(b.d)toast(t_(b.d))}
 G.chGuide=T+30;
 collide(P);for(const h of helpers)collide(h);hudT=0}
/* Omleggingen: the råjernsverk closes. Liquid iron left anywhere is cast to pigs (still sellable), malmhjelpere are paid back. */
function closeRJ(){let t=S.hm+S.rj.hearth+RJ.pigAcc;for(const c of TORPS){t+=c.load;c.load=0;c.st='fill';c.x=POS.torpX0+150*c.i;c.ord=c.i}S.hm=0;S.rj.hearth=0;S.rj.ore=0;RJ.pigAcc=0;
 const n=floor(t/PIG_T+.5);for(let i=0;i<n;i++)addPile({k:'pig',t:PIG_T,q:1});
 let ref=0;for(let i=0;i<lv('h_rj');i++)ref+=HIRE.rj.costs[i];S.lv.h_rj=0;
 for(const u of UP)if((u.st==='rj'||u.st==='rjsup')&&S.paid['u:'+u.id]>0){ref+=S.paid['u:'+u.id];S.paid['u:'+u.id]=0}if(S.paid.h_rj>0){ref+=S.paid.h_rj;S.paid.h_rj=0}
 for(let i=helpers.length-1;i>=0;i--){const h=helpers[i];if(h.r!=='rj')continue;for(const it of h.stack)if(it.k==='pig')addPile(it);helpers.splice(i,1)}helpers.forEach((h,i)=>h.gi=i);
 P.stack=P.stack.filter(i=>i.k!=='ore');
 if(G.crane==='malm'){CRm.malm.man=false;G.crane=null}
 if(ref>0)S.money+=ref;
 toast(t_('Omleggingen: Råjernsverket legges ned – nå blir det skrap og lysbue'),true);
 if(n>0)toast(t_('{0} masseljern ligger klare for salg ved malmtoget',n));if(ref>0)toast(t_('Malmhjelperne får nye jobber · +{0} tilbake',kr(ref)))}
function padUnlock(wx,wy){for(const d of PADS){if(!d.lock||!vis(d))continue;if((wx==null||hyp(wx-d.x,wy-d.y)<64)&&near(P,d.x,d.y,40)){d.lock=false;d.dw=.3;sfx('tick',600);buzz(10);return true}}return false}
function updPads(dt){let onPres=false;layoutPads();
 for(const d of PADS){if(!vis(d))continue;
  if(d.kind==='prestige'){if(near(P,d.x,d.y,34)){onPres=true;G.presT+=dt;if(G.presT>.7&&!G.modal&&!G.presShown){G.presShown=true;openPresModal()}}continue}
  if(!near(P,d.x,d.y,40)){d.lock=false}/* one purchase per visit: step off and back on, or tap the pad, for the next */
  if(G.crane||!near(P,d.x,d.y,34)||hyp(P.vx,P.vy)>70||d.lock){d.dw=0;continue}d.dw=(d.dw||0)+dt;/* walking across a pad never pays; stop on it to buy */
  const key=paidKey(d),c0=cost(d);if(c0-(S.paid[key]||0)<=.5){buy(d);d.lock=true;continue}
  if(d.dw>.3&&S.money>.001){const c=cost(d),paid=S.paid[key]||0,need=c-paid;let amt=min(need,S.money,max(40,c*.85)*dt);if(need-amt<.5&&S.money>=need)amt=need;S.paid[key]=paid+amt;S.money-=amt;
   if(Math.random()<dt*14){sfx('tick',(paid/c)*400);if(flyers.length<80)flyers.push({it:null,x0:P.x,y0:P.y-30,tg:{x:d.x,y:d.y},i:0,t:0,d:.25})}
   if(S.paid[key]>=c-.01){buy(d);d.lock=true}}}
 if(!onPres){G.presT=0;G.presShown=false}
 /* switches flip only when you stop on them (walking across never flips) */
 for(const s of SW){const on=s.on(),inside=on&&near(P,s.x,s.y,30)&&!G.crane;G.swT=G.swT||{};if(!inside){G.swT[s.id]=0;G.swIn[s.id]=false;continue}
  if(hyp(P.vx,P.vy)<70)G.swT[s.id]+=dt;if(G.swT[s.id]>.35&&!G.swIn[s.id]){G.swIn[s.id]=true;flipSw(s.id,true)}}}
const CASTN={auto:'Auto',blokk:'Blokk',strang:'Streng'},MIXN={arm:'Armering',begge:'Begge',vals:'Valstråd'};
function flipSw(id,fx){if(id==='cast'){const o=['auto','blokk','strang'];S.cast=o[(o.indexOf(S.cast)+1)%3]}else if(id==='mix'){const o=['arm','begge','vals'];S.mix=o[(o.indexOf(S.mix)+1)%3]}else{const k=id==='rjsw'?'rj':id;S.tg[k]=S.tg[k]?0:1}
 if(fx){const s=SWm[id];sfx('tick',300);buzz(15);ftext(swTxt(id),s.x,s.y-46,C.hazard)}save();if(menu.classList.contains('on'))syncMenu()}
const swTxt=id=>id==='cast'?t_('Støping')+': '+t_(CASTN[S.cast]):id==='mix'?t_('Valseprogram')+': '+t_(MIXN[S.mix]):id==='rjsw'?t_('Råjern')+': '+t_(S.tg.rj?'Stålverk':'Salg'):t_(S.tg[id]?'VIDERE':'SALG');

/* ---------- station status: every built station says what it is doing or waiting for ---------- */
const NODEZ={gjv:'gjv',vv:'vv',tc:'tc',stel:'stel',nett:'nett',kob:'kob'};
function status(id){const z=ZN[id];if(!z||!zoneBuilt(z))return null;const sn=x=>t_(SUPN[x]);
 switch(id){
 case'skrap':{if(F.starve>1.5)return{lv:2,t:t_('Flaskehals: skrap til ovnen')};if(S.chg>=chgCap()-1)return{lv:1,t:era()===0?t_('Skrapkassa er full (litt kjøleskrap)'):t_('Chargering full')};return{lv:0,t:tf(flow('skrap','ovn'))+' t/min'}}
 case'ovn':{if(F.stop)return{lv:2,t:t_('Slaggpotta er full – ovnen står!')};
  if(F.state==='ready'){if(!tapLadle()){const L=LADLES.find(l=>l.atTap)||LADLES[0],w=L?{pit:'blokkstøping',cast:'streng',lf:'øseovn',await:'kø',carried:'kran'}[L.state]:'';return{lv:2,t:w?t_('Flaskehals: øse ({0})',t_(w)):t_('Flaskehals: øse')}}if(!lv('operator'))return{lv:1,t:t_('Klar – gå på TAPP')}}if(F.lim&&F.solid>0)return{lv:2,t:lv(F.lim)?t_('Flaskehals: {0}',sn(F.lim)):t_('Flaskehals: {0} mangler',sn(F.lim))};
  if(F.elekOut)return{lv:1,t:t_('Venter på elektroder')};if(F.waitHM>1.5)return{lv:1,t:!S.tg.rj?t_('Råjernet går til salg (bryter)'):t_('Venter på råjern')};if((G.chgFull||0)>.6&&!F.lim)return{lv:2,t:t_('Flaskehals: ovnen')};if(F.starve>1.5)return{lv:1,t:t_('Venter på skrap')};if(F.state==='ready'&&!tapLadle())return{lv:1,t:t_('Venter på tom øse')};
  if(F.state==='ready'&&!lv('operator'))return{lv:1,t:t_('Klar – gå på TAPP')};if(F.waitLadle>2||G.ladleWait>.3)return{lv:2,t:t_('Flaskehals: venter på øse')};if(F.ch&&ET()==='conv')return{lv:0,t:t_('Chargerer')};return{lv:0,t:F.state==='refine'?(ET()==='sm'?t_('Raffinerer'):t_('Tapper snart')):F.state==='tapping'?t_('v§Tapper'):ET()==='conv'&&F.solid>0?t_('Blåser'):tf(F.rate*60)+' t/min'}}
 case'rj':{const tc=castTorp(),torpShort=!tc&&S.rj.hearth>=hearthCap()*.6;
  if(!S.tg.rj)return{lv:1,t:t_('Bryter: råjern til salg')};
  if(F.waitHM>1.5){if(RJ.starve>1.5)return{lv:2,t:t_('Flaskehals: malm til ovnen')};if(torpShort)return{lv:2,t:t_('Flaskehals: torpedovogner')};if(RJ.lim)return{lv:2,t:t_('Flaskehals: {0}',sn(RJ.lim))};return{lv:2,t:rjEra()?t_('Flaskehals: ovnseffekt (MVA)'):t_('Flaskehals: masovnen')}}
  if(RJ.starve>1.5)return{lv:1,t:t_('Venter på malm')};if(RJ.overflow>0)return{lv:1,t:t_('Overskudd støpes til masseljern')};if(RJ.stopT>2)return{lv:1,t:t_('Venter på torpedovogn')};
  return{lv:0,t:t_('{0} t/min råjern',tf(RJ.rate*60))}}
 case'rjsup':{const act=RJ.lim&&RJ.stopT<=0&&RJ.overflow<=0&&RJ.starve<=0;if(act)return{lv:2,t:lv(RJ.lim)?t_('Flaskehals: {0}',sn(RJ.lim)):t_('Mangler {0}',sn(RJ.lim))};
  for(const q of rjReq())if(!lv(q))return{lv:1,t:t_('Mangler {0}',sn(q))};return{lv:0,t:t_('Nok forsyning')}}
 case'sup':{const E=E_();for(const s of E.req){if(!lv(s))return{lv:2,t:t_('Mangler {0}anlegg',sn(s))}}if(F.lim)return{lv:2,t:t_('Flaskehals: {0}',sn(F.lim))};return{lv:0,t:t_('Nok forsyning')}}
 case'lf':{if(G.oseQ>3)return{lv:2,t:t_('Flaskehals: øsekranen')};const L=LADLES.find(l=>l.state==='lf');if(L)return{lv:0,t:t_('Behandler')};if(LADLES.some(l=>l.state==='await'&&l.next==='lf'))return{lv:2,t:t_('Flaskehals: øseovn')};return{lv:1,t:t_('Venter på stål')}}
 case'blokk':{const Lw=LADLES.find(l=>l.state==='pit');if(Lw&&PIT.state==='idle'&&S.kok.slots<1)return{lv:2,t:t_('Mangler kokiller!')};
  if(LADLES.some(l=>l.state==='await'&&l.next==='pit'&&steelIn(l)))return{lv:2,t:t_('Flaskehals: blokkstøping')};if(Lw||PIT.state!=='idle')return{lv:0,t:PIT.state==='pour'?t_('Stigstøper'):t_('Støper')};
  if(B_('strang')&&S.cast==='strang')return{lv:1,t:t_('Bryteren står på Streng')};if(B_('strang')&&S.cast==='auto')return{lv:1,t:t_('Auto: stålet går til strengen')};return{lv:1,t:t_('Venter på stål')}}
 case'strang':{const c=LADLES.find(l=>l.state==='cast');if(LADLES.some(l=>l.state==='await'&&l.next==='tur'&&steelIn(l))&&c)return{lv:2,t:t_('Flaskehals: strenger')};if(c)return{lv:0,t:t_('Støper · {0} strenger',nStr())};
  if(S.cast==='blokk')return{lv:1,t:t_('Bryteren står på Blokk')};return{lv:1,t:t_('Venter på stål')}}
 case'salg1':case'salg2':case'utlast':return{lv:0,t:''}
 default:{const n=NODE[NODEZ[id]];if(!n)return{lv:0,t:''};const q=n.in.length+(n.cur?1:0);
  if(n.cur&&n.util>.9&&n.in.length>=n.cap*.5)return{lv:2,t:t_('Flaskehals')};if(q)return{lv:0,t:tf(rate('o:'+id))+' t/min'};
  const need={gjv:'emner',vv:'emner',tc:'stenger',stel:'stenger',nett:'valstråd',kob:'armering'}[id];
  const hand=(id==='gjv'&&!lv('varm')&&!lv('magkran'))||(id==='nett'&&!lv('ktrans'))||(id==='kob'&&!lv('rullkob'));
  if(id==='stel'&&S.mix==='arm')return{lv:1,t:t_('Valseprogram: Armering')};if(id==='tc'&&B_('stel')&&S.mix==='vals')return{lv:1,t:t_('Valseprogram: Valstråd')};if(id==='gjv'&&!S.tg.strang)return{lv:1,t:t_('Emner går til salg (meny)')};
  return{lv:1,t:hand?t_('Bær {0} hit',t_(need)):t_('Venter på {0}',t_(need))}}}}
const steelIn=l=>l.steel>.01;
function bottlenecks(){const o=[];for(const z of ZONES){const s=status(z.id);if(s&&s.lv===2)o.push([z.id,s.t])}return o}

/* ---------- prestige / reset ---------- */
function doPrestige(){const g=presGain();if(g<1)return;const keep={mute:S.mute,vib:S.vib,moved:true,infoHint:S.infoHint,life:S.life,st:S.st,pres:{pts:S.pres.pts+g,n:S.pres.n+1}};
 S=Object.assign(freshS(),keep);initRun();save();toast(t_('Nytt verk! Inntekt ×{0}',L1(gm())),true);confetti(P.x,P.y-30,70);sfx('mile')}
function doReset(){const keep={mute:S.mute,vib:S.vib,infoHint:S.infoHint};S=Object.assign(freshS(),keep);initRun();save();toast(t_('Nytt spill startet'))}

/* ---------- useful-work check (idle stats) ---------- */
function canAfford(){return PADS.some(d=>d.kind!=='prestige'&&vis(d)&&S.money+(S.paid[paidKey(d)]||0)>=cost(d))}
function workAvail(noCash){if(!noCash&&TG.some(z=>z.cash>=10&&z.open()))return true;if(!lv('operator')&&F.state==='ready'&&tapLadle())return true;
 if(canAfford())return true;
 for(const it of stackKinds(P))if(TG.some(z=>z.open()&&accepts(z,it)&&freeFor(z,it.k)>0))return true;
 if(P.stack.length>=capCarry())return false;
 for(const s of SRC){if(!s.open()||count(s)<=0)continue;if(P.stack.filter(i=>i.k===s.kind).length<demand(s.kind))return true}
 return false}

/* ---------- init / restore ---------- */
const packIt=it=>[it.k,Math.round(it.t*1000)/1000,Math.round((it.q||1)*1000)/1000,it.wc?1:0,it.tc?1:0];
/* the player's own stack: any carryable kind, incl. scrap/ore/stores */
const packS=it=>({k:it.k,t:it.t,q:it.q,wc:it.wc?1:0,tc:it.tc?1:0,kk:it.kk|0,hot:it.hot?1:0});
const unpackS=o=>o&&typeof o==='object'&&KNAME[o.k]&&o.k!=='slag'?Object.assign({k:o.k,kk:o.kk|0,age:0},isFinite(o.t)&&o.t>0?{t:+o.t}:{},isFinite(o.q)&&o.q>0?{q:+o.q}:{},o.wc?{wc:true}:{},o.tc?{tc:true}:{},o.hot?{hot:1}:{}):null;
const unpackIt=a=>Array.isArray(a)&&PR[a[0]]&&a[0]!=='slag'&&isFinite(a[1])&&a[1]>0?{k:a[0],t:+a[1],q:isFinite(a[2])&&a[2]>0?+a[2]:1,wc:!!a[3],tc:!!a[4]}:null;
function initRun(){LADLES.length=0;syncLadles();
 for(const k of PRK){PILE[k]=(Array.isArray(S.piles[k])?S.piles[k]:[]).map(unpackIt).filter(Boolean).slice(-999)}
 for(const id in NODE){const n=NODE[id];n.cur=null;n.p=0;n.inc=0;n.in=(Array.isArray(S.nodes[id])?S.nodes[id]:[]).map(unpackIt).filter(Boolean).slice(0,n.cap)}
 movers.length=0;CAST.run.length=0;CAST.bed.length=0;CAST.cut.length=0;CAST.acc.fill(0);CAST.gap=0;
 Object.assign(F,{state:'melt',tilt:0,L:null,ch:null,hmCh:null,roof:0,slagAcc:0,starve:0,waitHM:0,SB:null,stop:false,lance:0});
 F.bath=clamp(num(S.F.bath),0,fcap()-1);F.solid=clamp(num(S.F.solid),0,max(0,fcap()-1-F.bath));F.scIn=clamp(num(S.F.scIn),0,fcap());F.hmIn=clamp(num(S.F.hmIn),0,fcap());
 TORPS.length=0;torpSeq=0;syncTorps();Object.assign(RJ,{rate:0,starve:0,stopT:0,overflow:0,pigAcc:0,tapping:false});
 S.rj.hearth=clamp(num(S.rj.hearth),0,hearthCap());S.rj.ore=clamp(num(S.rj.ore),0,skipCap());S.hm=clamp(num(S.hm),0,hmCap());if(rjClosed()){S.rj.hearth=0;S.rj.ore=0;S.hm=0}
 S.chg=clamp(num(S.chg),0,chgCap());
 const K=S.kok;K.slots=clamp(K.slots|0,0,slotsMax());K.hot=clamp(K.hot|0,0,40);K.ready=clamp(K.ready|0,0,40);K.cool=K.cool.filter(isFinite).slice(0,40);
 if(K.slots+K.hot+K.ready+K.cool.length<4)K.ready=6;
 S.pot=clamp(S.pot|0,0,potMax());S.elek=clamp(num(S.elek),0,12);S.kanal=clamp(S.kanal|0,0,HOPK);S.hette=clamp(S.hette|0,0,HOPK);
 Object.assign(PIT,{state:'idle',t:0,n:0,fill:0,L:null,wait:0});
 for(const z of TG){const c=S.cash[z.id];z.cash=isFinite(c)&&c>0?+c:0}
 for(const k of['y0','y1'])S.yard[k]=clamp(num(S.yard[k]),0,yardCap());S.yard.ore=clamp(num(S.yard.ore),0,oreYardCap());if(S.yard.y0<12)S.yard.y0=24;
 for(const k in ST){ST[k]=clamp((S.store||{})[k]|0,0,storeMax());if(ST[k]<6)ST[k]=6}
 helpers.length=0;syncHelpers();layKey='';layoutPads();
 for(const c of CRANES){c.x=c.d.park.x;c.y=c.d.park.y;c.h=1;c.state='idle';c.job=null;c.load=0;c.pay=null;c.man=false}G.crane=null;
 P.x=POS.start.x;P.y=POS.start.y;P.vx=P.vy=0;P.stack=[];
 /* back where you left off, with what you were carrying */
 {const pp=S.pp;if(pp&&isFinite(pp.x)&&isFinite(pp.y)&&pp.x>30&&pp.y>30&&pp.x<WW-30&&pp.y<WH-30&&!blockedPt(pp.x,pp.y,14)){P.x=+pp.x;P.y=+pp.y;
  if(Array.isArray(pp.stack))P.stack=pp.stack.map(unpackS).filter(it=>it&&!(it.k==='ore'&&rjClosed())).slice(0,capCarry())}}
 cam.x=P.x;cam.y=P.y;
 for(const k in VEH)Object.assign(VEH[k],{load:0,off:0,drive:0});
 parts.length=0;flyers.length=0;texts.length=0;coins.length=0;
 rebuildSolids();bakeFloor()}
initRun();
try{document.fonts&&document.fonts.ready.then(bakeFloor)}catch(e){}

/* offline earnings */
(()=>{if(!S.t)return;const dt=(Date.now()-S.t)/1000;if(dt>60&&helpers.length>=2&&S.rate>0){G.offline=floor(S.rate*min(dt,7200)*.3);S.money+=G.offline;earn(G.offline)}})();
