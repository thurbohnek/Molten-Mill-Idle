/* Molten Mill Idle: Steel Tycoon — Copyright (c) 2026 Studio.grane. All rights reserved. */
function start(){
'use strict';
if(window.__smeltOn)return;window.__smeltOn=1;
const $=i=>document.getElementById(i);
const cv=$('c'),ctx=cv.getContext('2d'),stage=$('stage');
let RM=false;try{RM=matchMedia('(prefers-reduced-motion: reduce)').matches}catch(e){}
const css=getComputedStyle(document.documentElement),C={};
'bg frame floor floor2 seam paint hazard ink steel steeld steell scrap rust molten moltenhi moltend arc vest vestl helmet helper skin coin ui uidim refrac truck good night panel shred kalk kull leg rebar wire prem water water2 ship rail locked danger o2 elek ildf gass vann tcore kokille slag hette bind valse'.split(' ').forEach(k=>C[k]=(css.getPropertyValue('--'+k)||'').trim()||'#888888');
const PI=Math.PI,TAU=PI*2,hyp=Math.hypot,min=Math.min,max=Math.max,floor=Math.floor;
const clamp=(v,a,b)=>v<a?a:v>b?b:v,lerp=(a,b,t)=>a+(b-a)*t,rnd=(a,b)=>a+Math.random()*(b-a);
const ease=t=>{t=clamp(t,0,1);return t<.5?2*t*t:1-Math.pow(-2*t+2,2)/2};
const seeded=s=>()=>(s=(s*16807)%2147483647,(s-1)/2147483646);
const hsh=n=>{const s=Math.sin(n*127.1+311.7)*43758.5453;return s-Math.floor(s)};
const HX={};const hx=c=>{if(HX[c])return HX[c];let h=c.replace('#','');if(h.length===3)h=h.split('').map(x=>x+x).join('');const n=parseInt(h,16)||0;return HX[c]=[n>>16&255,n>>8&255,n&255]};
const mix=(a,b,t)=>{const A=hx(a),B=hx(b);return'rgb('+A.map((v,i)=>Math.round(v+(B[i]-v)*t)).join(',')+')'};
const rgba=(c,a)=>{const A=hx(c);return`rgba(${A[0]},${A[1]},${A[2]},${a})`};
/* language: English (default) or Norwegian bokmål, chosen in the menu and remembered per device */
let LANG='en';try{const l=localStorage.getItem('molten.lang');if(l==='no'||l==='en')LANG=l}catch(e){}
const NO_=()=>LANG==='no';
/* number format — Norwegian: 9 999 · 12,5k · 3,2 mill · 1,1 mrd · English: 9,999 · 12.5k · 3.2M · 1.1B */
const dsep=s=>NO_()?s.replace('.',','):s;
const dec=v=>{let s=v>=100?floor(v)+'':v>=10?(floor(v*10)/10).toFixed(1):(floor(v*100)/100).toFixed(2);if(s.indexOf('.')>=0)s=s.replace(/0+$/,'').replace(/\.$/,'');return dsep(s)};
const fmt=n=>{n=floor(+n||0);const a=Math.abs(n),sg=n<0?'−':'',no=NO_();
 if(a<1e4)return sg+(''+a).replace(/\B(?=(\d{3})+(?!\d))/g,no?' ':',');if(a<1e6)return sg+dec(a/1e3)+'k';if(a<1e9)return sg+dec(a/1e6)+(no?' mill':'M');if(a<1e12)return sg+dec(a/1e9)+(no?' mrd':'B');return sg+dec(a/1e12)+(no?' bill':'T')};
/* money: "1 234 kr" (Norwegian) or "$1,234" (English); suf is a unit after it, e.g. '/min' or '/t' */
const kr=(n,suf)=>{suf=suf||'';const s=fmt(n);if(NO_())return s+' kr'+suf;return s[0]==='−'?'−$'+s.slice(1)+suf:'$'+s+suf};
const CUR=()=>NO_()?'kr':'$';
const FONT='Rubik,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif';
const L1=v=>dsep((Math.round(v*10)/10).toFixed(1));
const tf=v=>v>=100?fmt(v):v>=10?L1(v):dsep((Math.round(v*100)/100).toFixed(2));

/* ---------- world: one production line running left → right, every station in its own tinted zone ----------
   spine y=600; supply plants for the furnace in a blue zone above it; downstream stations follow to the right,
   utlasting (rail + quay) at the far right. */
/* WX0 is the grid / floor origin (the Phase 4 plots left of the ironworks included); WXL is the walkable left edge:
   -760 until the hydrogen plant's plot opens (the build after the quay), then the world grows to the left */
const WX0=-1620,WXL0=-760,WW=4300,WH0=1140,WHMAX=1560,CY=600,QX=3560,QY=850;
let WXL=WXL0;
/* the world grows downward when the first old plant is mothballed: a strip of reserve plots + the control room (y 1132–1536) */
let WH=WH0;
/* v6: the integrated works start at the far left: ore + coke → råjernsovn → råjern by torpedo car to the steel furnace */
const ZONES=[
 {id:'rjsup',x0:-744,y0:24,x1:8,y1:300,col:'#8ab4e8',n:'FORSYNING · RÅJERN',sup:1,rj:1},
 {id:'rj',x0:-744,y0:316,x1:8,y1:1116,col:'#ff5a3c',n:'RÅJERNSVERK',rj:1},
 {id:'skrap',x0:24,y0:316,x1:540,y1:1116,col:'#d08a4f',n:'SKRAPPLASS'},
 {id:'sup',x0:556,y0:24,x1:1044,y1:300,col:'#6fb7ff',n:'FORSYNING · OVN',sup:1},
 {id:'ovn',x0:556,y0:316,x1:1044,y1:1116,col:'#ff7a1a',n:'SMELTEVERK'},
 {id:'lf',x0:1060,y0:316,x1:1300,y1:940,col:'#b48cff',n:'ØSEOVN',b:'lf'},
 {id:'blokk',x0:1316,y0:24,x1:1780,y1:556,col:'#5fd38d',n:'BLOKKSTØPING'},
 {id:'strang',x0:1316,y0:572,x1:1780,y1:1116,col:'#ff6b6b',n:'STRANGGJUTING',b:'strang'},
 {id:'salg1',x0:1796,y0:316,x1:2000,y1:940,col:'#ffcf33',n:'SALG',sale:1},
 {id:'gjv',x0:2016,y0:316,x1:2290,y1:940,col:'#ff9f45',n:'GJENNOMVARMING',b:'vv'},
 {id:'vv',x0:2306,y0:316,x1:2900,y1:940,col:'#c9d0d8',n:'VALSEVERK',b:'vv'},
 {id:'tc',x0:2916,y0:316,x1:3140,y1:940,col:'#4dd0c8',n:'BRÅKJØLING',b:'tc'},
 {id:'stel',x0:2306,y0:24,x1:3140,y1:300,col:'#c39bff',n:'VALSTRÅD',b:'stel'},
 {id:'nett',x0:3156,y0:24,x1:3520,y1:420,col:'#9bd35f',n:'NETTVERK',b:'nett'},
 {id:'salg2',x0:3156,y0:436,x1:3520,y1:744,col:'#ffcf33',n:'SALG 2',b:'stel',sale:1},
 {id:'kob',x0:3156,y0:760,x1:3520,y1:1116,col:'#ef8ad6',n:'KLIPP OG BØY',b:'kob'},
 {id:'utlast',x0:3536,y0:24,x1:4280,y1:1116,col:'#ffcf33',n:'UTLASTING',b:'tog',sale:1},
 /* reserve plots for mothballed plants (b:'mb' keeps them out of the station logic; shown only while a plant stands there) */
 {id:'mbp0',x0:609,y0:1132,x1:1044,y1:1536,col:'#8d96a3',n:'RESERVETOMT',b:'mb',mbp:1},
 {id:'mbp1',x0:1316,y0:1132,x1:1780,y1:1536,col:'#8d96a3',n:'RESERVETOMT',b:'mb',mbp:1},
 {id:'mbp2',x0:158,y0:1132,x1:593,y1:1536,col:'#8d96a3',n:'RESERVETOMT',b:'mb',mbp:1},
 {id:'mbp3',x0:-293,y0:1132,x1:142,y1:1536,col:'#8d96a3',n:'RESERVETOMT',b:'mb',mbp:1},
 {id:'mbp4',x0:-744,y0:1132,x1:-309,y1:1536,col:'#8d96a3',n:'RESERVETOMT',b:'mb',mbp:1},
 /* the control room for the furnace, ladle crane and caster (arc-furnace eras) */
 {id:'cr',x0:1060,y0:1132,x1:1300,y1:1536,col:'#7fe0ff',n:'KONTROLLROM',b:'mb',cr:1},
 /* Phase 3 (modern eras): the endless cast-to-rebar line in the band under the rolling mill, and below it casting tech,
    by-products and the robot cells (the lower strip exists from the arc-furnace era on). on() = the plot is shown and its pads open. */
 {id:'endl',x0:1796,y0:956,x1:3140,y1:1236,col:'#ffa04a',n:'ENDELØS LINJE',on:()=>AUTO()&&B_('vv')&&B_('strang')},
 {id:'qa',x0:1796,y0:1252,x1:2290,y1:1536,col:'#7fd6ff',n:'STØPETEKNIKK',on:()=>AUTO()&&B_('strang')},
 {id:'byp',x0:2306,y0:1252,x1:3140,y1:1536,col:'#9be08a',n:'BIPRODUKTER',on:()=>AUTO()},
 {id:'rob',x0:3156,y0:1132,x1:3520,y1:1536,col:'#f0a0ff',n:'ROBOTCELLER',on:()=>AUTO()&&lv('endless')>0},
 /* Phase 4 (2030 →): a new plot left of the old ironworks – the hydrogen direct-reduction plant on top, the electric smelting
    furnace under it. The DRI gallery runs in the gaps between the old plots to the conveyor-fed arc furnace. */
 {id:'dri',x0:-1604,y0:24,x1:-776,y1:596,col:'#7ad7c2',n:'HYDROGEN-DRI',b:'h2'},
 {id:'esf',x0:-1604,y0:612,x1:-776,y1:1116,col:'#ff9b5a',n:'ELEKTRISK SMELTEOVN',b:'esf'}];
const ZN=Object.fromEntries(ZONES.map(z=>[z.id,z]));
const inZone=(z,x,y,m)=>{m=m||0;return x>=z.x0+m&&x<=z.x1-m&&y>=z.y0+m&&y<=z.y1-m};
const POS={
 y0:{x:150,y:500},y1:{x:150,y:900},drop:{x:440,y:600},start:{x:330,y:600},
 F:{x:800,y:600},tap:{x:990,y:600},tapPad:{x:990,y:448},park:[{x:990,y:704},{x:990,y:800}],
 pot:{x:800,y:812},rack:{x:648,y:812},slagp:{x:690,y:1036},elek:{x:870,y:1046},valve:{x:880,y:236},
 lf:{x:1180,y:600},bins:{x:1180,y:420},
 pit:{x:1535,y:300},pitL:{x:1535,y:214},koklag:{x:1400,y:104},kokv:{x:1724,y:104},plate:{x:1366,y:300},kanal:{x:1528,y:108},hette:{x:1630,y:108},
 tur:[{x:1385,y:770},{x:1385,y:930}],strang:{x:1440,y:690},bed:{x:1705,y:830},
 bil1:{x:1898,y:452},truck1:{x:1898,y:690},
 gjv:{x:2155,y:600},gjvIn:{x:2074,y:810},
 vv:{x:2470,y:600},kb:{x:2768,y:600},tc:{x:3028,y:600},
 stel:{x:2700,y:150},nett:{x:3330,y:200},nettIn:{x:3210,y:330},bil2:{x:3214,y:590},truck2:{x:3392,y:590},kob:{x:3340,y:950},kobIn:{x:3210,y:840},
 tog:{x:3700,y:440},kai:{x:3700,y:764},railY:300,
 /* råjernsverk */
 rjF:{x:-300,y:560},skip:{x:-480,y:690},ore:{x:-590,y:900},rjsale:{x:-300,y:1020},rjsw:{x:-56,y:1062},
 tapRJ:{x:-110,y:692},hmL:{x:668,y:756},torpA:692,torpB:722,torpX0:-110,torpX1:550,oreTrainY:1082};
const CRNX={malm:{x0:-716,x1:-424,y0:620,y1:1050,park:{x:-560,y:1010}}};
/* overhead cranes: bridge runs along x between rails at the zone's top and bottom edge */
const CRN={
 skrap:{x0:56,x1:512,y0:330,y1:1100,park:{x:300,y:440}},
 ose:{x0:930,x1:1770,y0:40,y1:1100,park:{x:1240,y:470}},
 mag:{x0:1600,x1:2120,y0:590,y1:1100,park:{x:1860,y:900}},malm:CRNX.malm};
/* Phase 3 geometry: the endless line (along y), casting-tech cabinets, by-product plants, robot cells, scrap sorting line */
const ELG={y:1040,bend:1790,loop0:1806,loop1:1870,heat0:1884,heat1:1958,st0:2000,stN:8,stD:36,q0:2300,q1:2430,gauge:2452,shear:2478,bund0:2700,bund1:2764,end:2770};
const QAX=[1836,1914,1992,2070,2148],QAY=1350;
const BYPG={slag:{x0:2330,x1:2580},heat:{x0:2616,x1:2830},co2:{x0:2866,x1:3112},y0:1296,y1:1404};
const ROBG={bend:{x:3196,y:1160,w:150,h:96},weld:{x:3340,y:1236,w:160,h:150}};
const SORTG={x0:60,x1:420,y:1072};
/* Phase 4 geometry (the plot left of the ironworks): electrolyser hall, H₂ tanks (later a rock cavern), the shaft furnace and its
   steam stack, the hot DRI bin, the pellet yard with its rail siding; the DRI gallery runs east in the gaps between the old plots
   (y 308 between the ironworks' supply strip and the ironworks, x 16 between the ironworks and the scrap yard) to the charging
   conveyor. The electric smelting furnace: a long rectangular hearth with six electrodes in a row, DRI bins above it, slag tapped
   at the west end, hot metal at the east end into the torpedo cars (track A, y 692) that run to the restarted LD converter. */
const P4G={hall:{x0:-1584,y0:70,x1:-1256,y1:262},tank:[{x:-1170,y:116,r:30},{x:-1170,y:196,r:30}],cav:{x:-1222,y:238,w:112,h:40},
 shaft:{x:-930,y:216,R:54},stack:{x:-820,y:96},bin:{x:-1040,y:418,r:28},yard:{x0:-1584,y0:294,x1:-1270,y1:496},pile:{x:-1430,y:408},rail:318,
 belt:[[-1290,404],[-984,236]],gal:[[-1012,418],[-760,418],[-760,308],[16,308],[16,600],[64,600]],feed:[[-1040,446],[-1040,648],[-1316,648]]};
const ESFG={x0:-1380,x1:-952,y0:718,y1:822,cy:770,tapX:-880,bins:[-1300,-1166,-1032],binY:670,slag:{x:-1462,y:770},trafo:{x0:-1330,x1:-1000,y:846,h:30}};
const TWINP={x:1180,y:1372};
/* Consteel line (era 5), left → right along the spine: open charging section in the scrap yard (pan conveyor, loaded by the
   magnet crane) → dynamic seal → preheating tunnel (the off-gas leaves at its charging end, dx) → connecting car into the shell.
   The gas cleaning (drop-out box → bag filter → fan → stack) stands in the free strip above the scrap yard. */
const CSG={x0:58,xc:344,xs:382,xt:672,xf:744,y:600,w:40,hw:34,dx:404,dw:34,gy:262};
const TROBP={x:868,y:726};
const SLAGP={x:800,y:812,w:96,h:72};/* slag pit under the slag door (Consteel) *//* temperature-measuring robot beside the slag door */
/* scrap-yard layout per era: the Consteel line runs through the yard, so pile 1 moves up, the pads move down */
const LAY0={y0:{x:150,y:500},drop:{x:440,y:600},post:{x:490,y:840},row:[[296,414],[374,414],[452,414],[296,506],[374,506],[452,506],[382,930]],x1:512,park:{x:300,y:440}},
 LAY5={y0:{x:150,y:450},drop:{x:212,y:672},post:{x:486,y:1046},row:[[296,746],[374,746],[452,746],[296,838],[374,838],[452,838],[382,930]],x1:330,park:{x:96,y:600}};

/* ---------- products (everything is sellable). Price per tonne follows the research ladder:
   masseljern ~0,75 → skrap 1,0 → emne ~1,4 → armering ~1,8 → valstråd ~1,85 → nett ~2,0 → klipp og bøy ~2,2 (× 7,5 kr) ---------- */
const PR={
 pig:{n:'Masseljern',p:5.6,z:'rj',pile:{x:-110,y:946},col:'#9a8f86'},
 ingot:{n:'Støpeblokk',p:10.5,z:'blokk',pile:{x:1712,y:300},col:'#e8b04a'},
 billet:{n:'Emne',p:10.5,z:'strang',pile:{x:1705,y:1052},col:'#ff5d5d'},
 rebar:{n:'Armeringsstål',p:13.5,z:'vv',pile:{x:2790,y:866},col:'#b9c1cb'},
 tcore:{n:'Bråkjølt armering',p:14.25,z:'tc',pile:{x:3086,y:850},col:'#6fb7ff'},
 coil:{n:'Valstråd',p:13.9,z:'stel',pile:{x:3070,y:244},col:'#c39bff'},
 mesh:{n:'Armeringsnett',p:15,z:'nett',pile:{x:3456,y:330},col:'#9bd35f'},
 bent:{n:'Bøyd armering',p:16.5,z:'kob',pile:{x:3456,y:1050},col:'#4dd0c8'},
 /* Phase 3: rebar straight off the endless line (no reheating), and welded rebar cages from the robot cells */
 ebar:{n:'Endeløs armering',p:14.6,z:'endl',pile:{x:2830,y:1150},col:'#ffb36b'},
 cage:{n:'Armeringskurv',p:19,z:'rob',pile:{x:3446,y:1460},col:'#f0a0ff'},
 slag:{n:'Slagg (pukk)',p:.6}};
const PRK=['pig','ingot','billet','rebar','tcore','coil','mesh','bent','ebar','cage'];
const KNAME={scrap:'skrap',ore:'malm',pig:'masseljern',slag:'slagg',elek:'elektroder',kokk:'kokiller',kokv:'varme kokiller',kanal:'kanalstein',hette:'varmholdsmasse',ingot:'støpeblokker',billet:'emner',rebar:'armeringsstål',tcore:'Bråkjølt armering',coil:'valstråd',mesh:'armeringsnett',bent:'bøyd armering',ebar:'endeløs armering',cage:'armeringskurver'};

/* ---------- steel furnace eras (same plot), following the works' history: Bessemer → SM → LD → [Omlegging] → arc furnaces.
   type conv = converter (charge råjern + skrap, blow, tilt to tap), sm = open hearth, eaf = arc furnace.
   hm = [min, max] share of hot metal (råjern) in the charge; the rest is scrap. Time compressed. ---------- */
const ERA=[
 {n:'Bessemer-konverter',k:'BESSEMER',yr:1880,type:'conv',cap:10,blow:9,ref:1,ch:'conv',req:[],fb:.7,elek:0,slag:0,heel:0,tap:'mouth',pu:'s blåsing',tt:'≈20 min',hm:[.9,1]},
 {n:'Siemens-Martin-ovn',k:'SM-OVN',yr:1910,type:'sm',cap:16,P:34,E:1000,ref:4,ch:'box',req:['kalk'],fb:.7,elek:0,slag:0,heel:0,tap:'hole',pu:'MW gass',tt:'≈8 t',hm:[.35,.6]},
 {n:'LD-konverter',k:'LD-KONVERTER',yr:1960,type:'conv',cap:30,blow:9,ref:1,ch:'conv',req:['kalk','o2'],fb:.6,elek:0,slag:7,heel:0,tap:'mouth',pu:'s blåsing',tt:'≈40 min',hm:[.75,.85]},
 {n:'Lysbueovn',k:'LYSBUEOVN',yr:1975,type:'eaf',cap:40,P:52,E:600,ref:3,ch:'bucket',cd:3,req:['kalk','o2'],fb:.6,elek:22,slag:6,heel:0,tap:'spout',pu:'MVA',tt:'≈2 t',hm:[0,0]},
 {n:'UHP-lysbueovn',k:'UHP-LYSBUEOVN',yr:1985,cap:60,type:'eaf',P:85,E:420,ref:2.5,ch:'bucket',cd:1.6,req:['kalk','o2','kull'],fb:.45,elek:45,slag:12,heel:.08,tap:'ebt',pu:'MVA',tt:'<60 min',hm:[0,0]},
 {n:'Båndchargert ovn',k:'BÅNDOVN',yr:1995,cap:90,type:'eaf',P:120,E:340,ref:1,ch:'belt',req:['kalk','o2','kull'],fb:.45,elek:75,slag:22,heel:.45,tap:'ebt',pu:'MVA',tt:'≈40 min',hm:[0,0]},
 /* Phase 4: the same conveyor-fed arc furnace, now also fed hot direct-reduced iron (DRI) from the hydrogen shaft furnace */
 {n:'Hydrogen-DRI',k:'DRI-BÅNDOVN',yr:2030,cap:90,type:'eaf',P:140,E:340,ref:1,ch:'belt',req:['kalk','o2','kull'],fb:.45,elek:75,slag:22,heel:.45,tap:'ebt',pu:'MVA',tt:'≈40 min',hm:[0,0],gate:'h2'},
 /* the electric smelting furnace melts DRI to green hot metal; the restarted LD converter refines it with some scrap */
 {n:'Elektrisk smelteovn',k:'LD-KONVERTER',yr:2035,type:'conv',cap:48,blow:12,ref:1,ch:'conv',req:['kalk','o2'],fb:.6,elek:0,slag:22,heel:0,tap:'mouth',pu:'s blåsing',tt:'≈40 min',hm:[.6,.85],needs:['ld'],gate:'esf'}];
ERA.forEach(e=>{e.needs=e.needs||[]});
const SUPC={kalk:.7,o2:1.4,kull:5},SUPN={kalk:'kalk/dolo',o2:'oksygen',kull:'kull',koks:'koks',cowper:'cowpere'};
/* råjernsovn on its own plot: coke blast furnace → electric pig-iron furnace (Søderberg electrodes, closed top) */
const RJE=[{n:'Koksmasovn',k:'MASOVN',yr:1880,rate:.24},{n:'Elektrisk råjernsovn',k:'EL-RÅJERNSOVN',yr:1965,rate:.75}];
/* the year the works are in: set by the steel furnace era (the electric smelter arrives in between) */
const year=()=>max(E_().yr,rjEra()&&!rjClosed()?RJE[1].yr:0);
const RJSUPC={koks:.2,cowper:.2};

/* ---------- phases: one build at a time, always the next one in this list ---------- */
const BUILDS=[
 {id:'sm',sn:'SM-ovn',n:'Siemens-Martin-ovn',z:'ovn',cost:450,x:990,y:1040,era:1,d:'Råjern og skrap i kasser – større charger, men trenger kalk.'},
 {id:'lf',sn:'Øseovn',n:'Øseovn',z:'lf',cost:1000,x:1180,y:600,d:'Legeringer og temperatur i øsa gir bedre kvalitet og høyere pris.'},
 {id:'ld',sn:'LD-konverter',n:'LD-konverter',z:'ovn',cost:3000,x:990,y:1040,era:2,d:'Rent oksygen gjennom en lanse ovenfra. Mye råjern, litt skrap.'},
 {id:'strang',sn:'Strang',n:'Stranggjuting',z:'strang',cost:7000,x:1545,y:840,d:'Samme pris, men 97 % utbytte i stedet for ca. 85 %.'},
 {id:'vv',sn:'Valseverk',n:'Valseverk',z:'gjv',cost:4.5e4,x:2155,y:600,d:'Gjennomvarmingsovn og valselinje: emner blir armeringsstål.'},
 {id:'elrj',sn:'El-råjernsovn',n:'Elektrisk råjernsovn',z:'rj',cost:1.6e5,x:-640,y:440,rjEra:1,d:'Tre Søderberg-elektroder og lukket topp. Koksen er bare reduksjonsmiddel – energien er strøm.'},
 {id:'tog',sn:'Jernbane',n:'Jernbane',z:'utlast',cost:5e5,x:3700,y:440,d:'Toget betaler mer per tonn enn lastebilen.'},
 {id:'eaf1',sn:'Omlegging',n:'Omlegging: lysbueovn',z:'ovn',cost:1.2e6,x:990,y:1040,era:3,d:'Råjernsverket legges ned. Stålet lages av skrap i lysbueovn.'},
 {id:'uhp',sn:'UHP-ovn',n:'UHP-lysbueovn',z:'ovn',cost:3e6,x:990,y:1040,era:4,d:'Vannkjølte paneler, stor trafo, O₂-lanser og kullinjeksjon.'},
 {id:'tc',sn:'Bråkjøling',n:'Bråkjøling',z:'tc',cost:9e6,x:3028,y:600,d:'Bråkjøling gir B500-armering uten dyre legeringer.'},
 {id:'stel',sn:'Valstråd',n:'Valstråd',z:'stel',cost:2.2e7,x:2700,y:150,d:'Ferdigblokk, leggehode og kjølebane. Med egen lastebil.'},
 {id:'nett',sn:'Nettverk',n:'Nettverk',z:'nett',cost:5.5e7,x:3330,y:200,d:'Valstråd sveises til armeringsnett.'},
 {id:'consteel',sn:'Båndchargering',n:'Båndchargert ovn',z:'ovn',cost:1.3e8,x:990,y:1040,era:5,d:'Kontinuerlig chargering med forvarmingstunnel og flat bad.'},
 {id:'kob',sn:'Klipp og bøy',n:'Klipp og bøy',z:'kob',cost:3.2e8,x:3330,y:950,d:'Ferdig bøyd armering per byggeprosjekt.'},
 {id:'kai',sn:'Kai',n:'Kai',z:'utlast',cost:7.5e8,x:3700,y:764,d:'Skip gir best pris for eksport.'},
 /* Phase 4 */
 {id:'h2',sn:'Hydrogen-DRI',n:'Hydrogen-DRI-anlegg',z:'dri',cost:3e9,x:-1100,y:470,era:6,d:'Elektrolyse lager hydrogen som reduserer jernmalmpellets til DRI. Varm DRI mates inn i båndovnen.'},
 {id:'esf',sn:'El. smelteovn',n:'bygg§Elektrisk smelteovn',z:'esf',cost:1.2e10,x:-1100,y:960,d:'Smelter DRI til grønt råjern. Start LD-konverteren igjen for å raffinere det.'}];
const BLD=Object.fromEntries(BUILDS.map(b=>[b.id,b]));
const PRES_NEED=4e9;
/* Nytt verk is offered from the quay on (the end of the game before Phase 4); the Phase 4 eras extend the run beyond it */
const PRES_PH=BUILDS.findIndex(b=>b.id==='kai')+1,P4_PH=BUILDS.findIndex(b=>b.id==='h2');

/* ---------- upgrades: every upgrade has its own pad in its station's upgrade row; the player picks the order.
   req = only real progress gates (furnace era, building, the plant it needs); intro:1 = shown during the first two heats too ---------- */
const UP=[
 {id:'carry',st:'skrap',n:'Større bæring',max:16,base:20,m:1.55,intro:1,req:()=>!AUTO()},
 {id:'speed',st:'skrap',n:'Raskere gange',max:12,base:45,m:1.6},
 {id:'yard',st:'skrap',n:'Skraptilførsel',max:20,base:70,m:1.55,req:()=>scrapUse()},
 {id:'kran',st:'skrap',n:'Skrapkran',max:23,base:180,m:1.52,req:()=>scrapUse()},
 {id:'charge',st:'skrap',n:()=>['Større skrapkasse','Flere chargeringskasser','Større skrapkasse','Større skrapkurv','Større skrapkurv','Raskere chargeringsbånd','Raskere chargeringsbånd','Større skrapkasse'][era()],max:20,base:110,m:1.5,req:()=>scrapUse()},
 {id:'yard2',st:'skrap',n:'Skraphaug 2',max:1,costs:[900],req:()=>scrapUse()},
 {id:'magnet',st:'skrap',n:'Større magnet',max:10,base:2e6,m:1.6,req:()=>CS()},
 {id:'forvarm',st:'skrap',n:'Kurvforvarming',max:1,costs:[1e5],req:()=>era()===3||era()===4},
 {id:'sort',st:'skrap',n:'Skrapsortering',max:3,costs:[1.2e5,1.5e6,2e7],req:()=>AUTO()},
 {id:'furnace',st:'ovn',n:()=>ET()==='conv'?'Større konverter':'Større ovn',max:20,base:120,m:1.5},
 {id:'power',st:'ovn',n:()=>['Sterkere blåsemaskin','Sterkere brennere','Kraftigere O₂-lanse','Mer effekt','Mer effekt','Mer effekt','Mer effekt','Kraftigere O₂-lanse'][era()],max:20,base:160,m:1.5},
 {id:'refine',st:'ovn',n:()=>ET()==='sm'?'Raskere raffinering':'Raskere tapping',max:8,base:300,m:1.9},
 {id:'operator',st:'ovn',n:'Tapper',max:1,costs:[1500],person:1},
 {id:'ladle',st:'ovn',n:'Ekstra øse',max:2,costs:[450,2.5e4]},
 {id:'slagcap',st:'ovn',n:'Større slaggpotte',max:10,base:1500,m:1.7,req:()=>slagOn()},
 {id:'slaggbil',st:'ovn',n:'Slaggbil',max:1,costs:[6e4],req:()=>slagOn()},
 {id:'kalk',st:'sup',n:'Kalk og dolo',max:23,base:60,m:1.5,sup:1,req:()=>E_().req.indexOf('kalk')>=0||lv('kalk')>0},
 {id:'o2',st:'sup',n:'Oksygenanlegg',max:21,base:500,m:1.5,sup:1,req:()=>E_().req.indexOf('o2')>=0||lv('o2')>0},
 {id:'lans',st:'sup',n:()=>lv('lans')?'Veggmonterte injektorer':'Dørlansemanipulator',max:2,costs:[2e4,6e5],req:()=>isEAF()&&lv('o2')>0&&(lv('lans')<1||era()>=4)},
 {id:'elekkran',st:'sup',n:'Elektrodekran',max:1,costs:[9e4],req:()=>isEAF()},
 {id:'kull',st:'sup',n:'Kullinjeksjon',max:21,base:300000,m:1.45,sup:1,req:()=>era()>=4},
 {id:'rjsize',st:'rj',n:()=>rjEra()?'Mer effekt (MVA)':'Større masovn',max:20,base:150,m:1.5},
 {id:'malmtog',st:'rj',n:'Malmtilførsel',max:20,base:70,m:1.55},
 {id:'malmkran',st:'rj',n:'Malmkran',max:20,base:200,m:1.52},
 {id:'skip',st:'rj',n:()=>rjEra()?'Større chargeringsbånd':'Større skip',max:20,base:100,m:1.5},
 {id:'torp',st:'rj',n:'Større torpedovogn',max:20,base:260,m:1.5},
 {id:'torpn',st:'rj',n:'Ekstra torpedovogn',max:2,costs:[2500,6e4]},
 {id:'koks',st:'rjsup',n:'Koksverk',max:21,base:35,m:1.5,sup:1,intro:1},
 {id:'cowper',st:'rjsup',n:'Cowpere',max:21,base:50,m:1.5,sup:1,intro:1,req:()=>!rjEra()},
 {id:'sinter',st:'rjsup',n:()=>lv('sinter')?'Pelletverk':'Sinterverk',max:2,costs:[2500,9e4]},
 {id:'lfq',st:'lf',n:'Bedre metallurgi',max:16,base:700,m:1.6},
 {id:'lft',st:'lf',n:'Raskere behandling',max:12,base:600,m:1.65},
 {id:'osekran',st:'lf',n:'Ny øsekran',max:10,base:900,m:1.75},
 {id:'kokup',st:'blokk',n:'Flere kokiller',max:6,base:150,m:1.75},
 {id:'kokbig',st:'blokk',n:'Større kokiller',max:16,base:450,m:1.6},
 {id:'solid',st:'blokk',n:'Raskere størkning',max:14,base:300,m:1.6},
 {id:'kran2',st:'blokk',n:'Raskere kokillekran',max:18,base:400,m:1.6},
 {id:'kanal',st:'blokk',n:'Kanalsteinlager',max:1,costs:[350]},
 {id:'hette',st:'blokk',n:'Varmholdsmasse',max:1,costs:[1500]},
 {id:'strands',st:'strang',n:'Flere strenger',max:7,costs:[2.5e4,8e4,2.5e5,7e5,2e6,5e6,1.2e7]},
 {id:'caster',st:'strang',n:'Støpefart',max:22,base:1.5e4,m:1.5},
 {id:'torch',st:'strang',n:'Skjærebrenner',max:1,costs:[2e5]},
 {id:'turret',st:'strang',n:'Øsetårn (sekvens)',max:1,costs:[1e5]},
 {id:'truck',st:'salg1',n:'Salgsavtale',max:30,base:200,m:1.5},
 {id:'hspeed',st:'salg1',n:()=>AUTO()?'Vognfart':'Hjelperfart',max:14,base:400,m:1.65,req:()=>helpersHired()||AUTO()},
 {id:'hcap',st:'salg1',n:()=>AUTO()?'Vognkapasitet':'Hjelperkapasitet',max:14,base:500,m:1.65,req:()=>helpersHired()||AUTO()},
 {id:'gjvup',st:'gjv',n:'Ovnskapasitet',max:25,base:3e4,m:1.42},
 {id:'bjelke',st:'gjv',n:'Bjelkeovn',max:1,costs:[1.5e6]},
 {id:'magkran',st:'gjv',n:'Magnetkran',max:12,base:1e5,m:1.6},
 {id:'varm',st:'gjv',n:'Varminnsetting',max:1,costs:[1e6]},
 {id:'vvup',st:'vv',n:'Valsefart',max:24,base:3.5e4,m:1.42},
 {id:'splitt',st:'vv',n:'Splittvalsing',max:1,costs:[3e6]},
 {id:'rullkob',st:'vv',n:'Rullebane til klipp og bøy',max:1,costs:[1.2e8],req:()=>B_('kob')},
 {id:'tcup',st:'tc',n:'Bråkjølingskapasitet',max:24,base:2.5e6,m:1.42},
 {id:'stelup',st:'stel',n:'Finverksfart',max:24,base:5e6,m:1.42},
 {id:'stelmor',st:'stel',n:'Kjølevifter',max:1,costs:[2e7]},
 {id:'ktrans',st:'stel',n:'Kveiletransport',max:1,costs:[5e7],req:()=>B_('nett')},
 {id:'nettup',st:'nett',n:'Sveisefart',max:24,base:1.2e7,m:1.42},
 {id:'kobup',st:'kob',n:'Bøyefart',max:24,base:6e7,m:1.42},
 {id:'togp',st:'utlast',n:'Togavtale',max:20,base:6e5,m:1.55,req:()=>B_('tog')},
 {id:'kaip',st:'utlast',n:'Kaiavtale',max:20,base:1.5e8,m:1.55,req:()=>B_('kai')},
 /* Phase 3: casting tech (tundish heating + slag detection, stirring, high-speed strand, inspection), the endless line,
    robot cells, by-products and the digital twin */
 {id:'tdheat',st:'qa',n:'Fordelervarme',max:3,costs:[1.5e5,2e6,2.5e7]},
 {id:'slagdet',st:'qa',n:'Slaggvakt',max:1,costs:[2.5e5]},
 {id:'ems',st:'qa',n:'EM-omrøring',max:2,costs:[4e5,8e6]},
 {id:'hss',st:'qa',n:'Hurtigstreng',max:3,costs:[1e6,1.2e7,1.5e8]},
 {id:'insp',st:'qa',n:'Inspeksjonsbue',max:1,costs:[6e5]},
 {id:'pass',st:'endl',n:'Produktpass',max:1,costs:[3e5]},
 {id:'endless',st:'endl',n:'Endeløs linje',max:1,costs:[4e7],req:()=>era()>=4},
 {id:'elspd',st:'endl',n:'Linjefart',max:20,base:3e6,m:1.42,req:()=>lv('endless')>0},
 {id:'loop',st:'endl',n:'Sløyfebuffer',max:4,costs:[4e6,2e7,8e7,3e8],req:()=>lv('endless')>0},
 {id:'robot',st:'rob',n:'Robotcelle',max:1,costs:[1.5e8]},
 {id:'robspd',st:'rob',n:'Robotfart',max:24,base:4e7,m:1.42,req:()=>lv('robot')>0},
 {id:'slagmill',st:'byp',n:'Slagg til sement',max:10,base:3e5,m:1.7},
 {id:'dheat',st:'byp',n:'Fjernvarme',max:10,base:5e5,m:1.75,req:()=>era()>=4},
 {id:'co2',st:'byp',n:'CO₂-fangst',max:3,costs:[8e6,8e7,6e8],req:()=>era()>=4},
 {id:'twin',st:'cr',n:'Digital tvilling',max:3,costs:[2e7,2e8,1.5e9],req:()=>era()>=4&&lv('h_ovn')>=1},
 /* Phase 4: the hydrogen DRI plant (electrolysis → H₂ storage → shaft furnace ← pellets → DRI conveyor) and the ESF */
 {id:'elyz',st:'dri',n:'Elektrolysører',max:22,base:3e7,m:1.3},
 {id:'h2st',st:'dri',n:()=>lv('h2st')>=3?'Større fjellhall':'H₂-lager',max:6,costs:[1.5e8,6e8,2e9,6e9,1.5e10,4e10]},
 {id:'shaft',st:'dri',n:'Større sjaktovn',max:20,base:4e7,m:1.3},
 {id:'pellet',st:'dri',n:'Pellettilførsel',max:20,base:2e7,m:1.3},
 {id:'dribelt',st:'dri',n:'DRI-bånd',max:12,base:1e8,m:1.5,req:()=>era()===6||lv('dribelt')>0},
 {id:'esfmw',st:'esf',n:'Mer effekt (MW)',max:20,base:1.5e8,m:1.3},
 {id:'etorp',st:'esf',n:'Større torpedovogner',max:8,base:4e8,m:1.5},
 {id:'etorpn',st:'esf',n:'Ekstra torpedovogn',max:3,costs:[1e9,4e9,1.5e10]}];
const UPm=Object.fromEntries(UP.map(u=>[u.id,u]));
UP.forEach(u=>{if(u.costs)u.max=u.costs.length});
const HIRE={
 rj:{id:'h_rj',n:'Malmhjelper',costs:[70,900,9000],col:'#ff9a6a'},
 skrap:{id:'h_skrap',n:'Skraphjelper',op:'Kranfører',costs:[90,900,9000],col:'#ffd23f',req:()=>scrapUse()},
 ovn:{id:'h_ovn',n:'Ovnshjelper',op:'Kontrollromsoperatør',costs:[2500,15000,1.2e5],col:'#f1ede2',req:()=>slagOn()},
 blokk:{id:'h_blokk',n:'Blokkhjelper',op:'Blokkoperatør',costs:[250,2500,25000],col:'#ff8c5a'},
 strang:{id:'h_strang',n:'Emnehjelper',op:'Strengoperatør',costs:[3e4,2.5e5,2e6],col:'#a0d8ff'},
 vv:{id:'h_vv',n:'Valseverkshjelper',op:'Valseoperatør',costs:[1.5e5,1.2e6,1e7],col:'#d0d6de'},
 tc:{id:'h_tc',n:'Bråkjølingshjelper',op:'Bråkjølingsoperatør',costs:[3e6,2e7,1.2e8],col:'#7fe0d8'},
 stel:{id:'h_stel',n:'Valstrådhjelper',op:'Valstrådoperatør',costs:[8e6,5e7,3e8],col:'#c48bff'},
 nett:{id:'h_nett',n:'Netthjelper',op:'Sveiseoperatør',costs:[1.5e7,1e8,6e8],col:'#9bd35f'},
 kob:{id:'h_kob',n:'Bøyehjelper',op:'Bøyeoperatør',costs:[6e7,4e8,3e9],col:'#ef8ad6'},
 dri:{id:'h_dri',n:'DRI-operatør',op:'DRI-operatør',costs:[3e8,2e9,1.2e10],col:'#7ad7c2'}};
/* upgrade rows: slots [x,y] filled in UP order by the upgrades a station shows (maxed ones keep their slot as MAKS);
   lw = label width (row pitch − 4). One hire pad per station, beside its row. */
const R_=(x0,y,n,dx)=>Array.from({length:n},(_,i)=>[x0+i*dx,y]);
const UPROW={
 rj:{s:[...R_(-444,826,4,78),...R_(-366,932,3,78)],lw:74},
 rjsup:{s:R_(-196,250,3,78),lw:74},
 skrap:{s:[...R_(296,414,3,78),...R_(296,506,3,78),[382,930]],lw:74},
 sup:{s:[[612,250],[690,250],[768,250],[934,250],[1010,250]],lw:72},
 ovn:{s:[[600,413],[600,504],[682,930],[838,930],[916,930],[994,930],[676,413]],lw:74},
 lf:{s:R_(1102,880,3,78),lw:74},
 blokk:{s:R_(1418,484,6,66),lw:62},
 strang:{s:R_(1346,1056,4,78),lw:74},
 salg1:{s:R_(1822,886,3,66),lw:62},
 gjv:{s:[...R_(2056,470,3,78),[2226,850]],lw:74},
 vv:{s:R_(2352,840,3,78),lw:74},
 tc:{s:[[3028,430]],lw:74},
 stel:{s:R_(2352,236,3,78),lw:74},
 nett:{s:[[3330,362]],lw:74},
 kob:{s:[[3214,1062]],lw:74},
 utlast:{s:R_(3920,600,2,78),lw:74},
 qa:{s:R_(1836,1490,5,78),lw:74},
 endl:{s:R_(2110,1190,4,78),lw:74},
 byp:{s:[[2400,1490],[2680,1490],[2960,1490]],lw:74},
 rob:{s:[[3200,1490],[3278,1490]],lw:74},
 cr:{s:[[1180,1480]],lw:74},
 dri:{s:R_(-1556,548,5,78),lw:74},
 esf:{s:R_(-1556,1056,3,78),lw:74}};
const HIREPOS={rj:{x:-444,y:932},skrap:{x:296,y:930},ovn:{x:600,y:930},blokk:{x:1346,y:484,lw:74},strang:{x:1354,y:690},vv:{x:2596,y:840},tc:{x:2968,y:830},stel:{x:2352,y:130},nett:{x:3456,y:130},kob:{x:3350,y:1062},dri:{x:-1166,y:548}};
/* where an idle helper goes when automation has his route covered: a control desk in the station (and the crane cab) */
const POSTS={rj:{x:-660,y:560,crane:'malm'},skrap:{x:490,y:840,crane:'skrap'},ovn:{x:900,y:745},blokk:{x:1372,y:196},strang:{x:1700,y:628,crane:'mag'},
 vv:{x:2680,y:862},tc:{x:3060,y:724},stel:{x:2660,y:256},nett:{x:3196,y:180},kob:{x:3470,y:900},dri:{x:-1010,y:500}};
const TAPDESK={x:1018,y:520};
/* the control room (arc-furnace eras): furnace, ladle-crane and caster desks; control-room / caster operators sit here */
const CRB={x0:1080,y0:1170,x1:1280,y1:1330};
const CRDESK={furnace:{x:1124,y:1250},caster:{x:1236,y:1250},ladle:{x:1180,y:1306}};
const CRPOST={ovn:CRDESK.furnace,strang:CRDESK.caster};
/* the plant runs from control rooms from the first arc furnace on: nobody carries where a crane, conveyor or car does the job */
const AUTO=()=>era()>=3;
/* stations whose products leave on automatic transport cars in the automated eras */
const AGVK={blokk:'ingot',strang:'billet',vv:'rebar',tc:'tcore',stel:'coil',nett:'mesh',kob:'bent',endl:'ebar',rob:'cage'};
const postOf=r=>AUTO()&&CRPOST[r]?Object.assign({crane:POSTS[r]&&POSTS[r].crane},CRPOST[r]):POSTS[r];
const opN=st=>AUTO()&&HIRE[st]?lv(HIRE[st].id):0;
const PADPOS=Object.fromEntries(Object.keys(UPROW).map(k=>[k,{up:{x:UPROW[k].s[0][0],y:UPROW[k].s[0][1]},hire:HIREPOS[k]}]));
const PRESPAD={x:4120,y:600};
/* walk-on switches (step on to flip) */
const SW=[
 {id:'rjsw',x:POS.rjsw.x,y:POS.rjsw.y,lab:'Råjern',on:()=>stOn('rj')},
 {id:'cast',x:1180,y:764,lab:'Støping',on:()=>B_('strang')},
 {id:'mix',x:2470,y:448,lab:'Valseprogram',on:()=>B_('stel')},
 /* Phase 4: the DRI share of the arc furnace charge (era 6) and the pellet grade (the ESF also takes cheaper blast-furnace pellets) */
 {id:'drimix',x:-1166,y:440,lab:'DRI-andel',on:()=>era()===6},
 {id:'pgrade',x:-1166,y:440,lab:'Pellettype',on:()=>era()===7}];
const SWm=Object.fromEntries(SW.map(s=>[s.id,s]));

/* ---------- old plants: when a new era is built the previous main plant is mothballed (dark, no smoke) instead of torn down.
   It moves to the nearest free reserve plot (the ironworks stays on its own plot). Demolish: pay, get a little scrap back,
   the plot and its solids are freed. Restart: only when a later era declares it needs the plant (ERA[].needs). ---------- */
const MBU={
 bess:{n:'Bessemer-konverter',yr:1880,from:'sm',kind:'conv',R:58,dem:150,up:2,scrap:40},
 sm:{n:'Siemens-Martin-ovn',yr:1910,from:'ld',kind:'sm',dem:1500,up:20,scrap:80},
 ld:{n:'LD-konverter',yr:1960,from:'eaf1',kind:'conv',R:72,ld:1,torp:1,dem:2e4,up:300,scrap:140,re:1,rc:4e9,rb:1.2e10},
 rj:{n:'Råjernsverk',yr:1880,from:'eaf1',kind:'rj',dem:3e4,up:400,scrap:200},
 eaf:{n:'Lysbueovn',yr:1975,from:'uhp',kind:'eaf',e:3,dem:1.5e5,up:3000,scrap:220},
 uhp:{n:'UHP-lysbueovn',yr:1985,from:'consteel',kind:'eaf',e:4,dem:1.5e6,up:3e4,scrap:260},
 /* Phase 4: the conveyor-fed arc furnace is laid down when the LD converter is restarted for the electric smelting era */
 cs:{n:'Båndchargert ovn',yr:1995,from:'esf',when:()=>era()===7,kind:'eaf',e:5,dem:1.5e7,up:3e5,scrap:300}};
const MBK=Object.keys(MBU);
const MBPLOTS=['mbp0','mbp1','mbp2','mbp3','mbp4'];
const mbSt=u=>(S.mb&&S.mb[u]&&S.mb[u].st)||'';
const mbOn=u=>mbSt(u)==='mb';
const mbZone=u=>{const m=S.mb[u];return m&&m.p?ZN[m.p]:null};
/* a plant can be restarted once an era that needs it is open (its gate build done), or the current era declares the need */
const eraOpen=i=>i<=era()||!!(ERA[i].gate&&B_(ERA[i].gate));
const restartOK=u=>!!MBU[u].re&&ERA.some((e,i)=>e.needs.indexOf(u)>=0&&eraOpen(i));
/* the LD converter runs again (electric smelting era) */
const ldRun=()=>mbSt('ld')==='run';
const rjGone=()=>mbSt('rj')==='gone';

/* ---------- save ---------- */
const KEY='smelteverket.v6';
function rawLoad(k){try{const s=localStorage.getItem(k);return s?JSON.parse(s):null}catch(e){return null}}
function freshS(){return{v:6,money:0,earned:0,life:0,heats:0,ph:0,lv:{},paid:{},b:{},tg:{strang:1,vv:1,tc:1,stel:1,rj:1,endl:1},cast:'auto',mix:'begge',
 mute:false,vib:true,dest:'best',moved:false,t:0,rate:0,lvl:0,pres:{pts:0,n:0},
 st:{sold:0,scrap:0,heats:0,play:0,best:0,prod:{},soldK:{},castB:0,castS:0,slagStops:0,slagT:0,eraT:{},hm:0,ore:0,def:0,ground:0,byp:0,ord:0,ordN:0},
 piles:{},nodes:{},store:{},cash:{},kok:{slots:6,hot:0,ready:6,cool:[]},pot:0,elek:12,chg:0,yard:{y0:24,y1:0,ore:40},F:{bath:0,solid:0},
 rj:{ore:14,hearth:6},hm:10,torp:[],mb:{},bonusGiven:false,ord:null,
 /* Phase 4: H₂ in store (t), pellets in the yard (t), hot DRI in the bin (t); DRI share set-point; pellet grade */
 dri:{h2:0,pel:0,bin:0},drimix:.5,pgrade:'bf'}}
let S=freshS();
const num=v=>isFinite(v)&&v>=0?+v:0;
(()=>{const s=rawLoad(KEY);
 if(s&&typeof s==='object'&&s.v===6){const f=freshS();S=Object.assign(f,s);for(const k of['lv','paid','b','tg','pres','st','piles','nodes','store','cash','kok','yard','F','rj','dri'])S[k]=Object.assign(freshS()[k],s[k]&&typeof s[k]==='object'&&!Array.isArray(s[k])?s[k]:{});
  S.st.prod=Object.assign({},S.st.prod||{});S.st.soldK=Object.assign({},S.st.soldK||{});S.st.eraT=Object.assign({},S.st.eraT||{});if(!Array.isArray(S.kok.cool))S.kok.cool=[];if(!Array.isArray(S.torp))S.torp=[];
  for(const k in S.lv){if(!UPm[k]&&!HIREbyId(k)){delete S.lv[k];continue}S.lv[k]=clamp(S.lv[k]|0,0,(UPm[k]?UPm[k].max:HIREbyId(k).costs.length))}
  for(const k in S.paid){const v=S.paid[k];if(!isFinite(v)||v<0)delete S.paid[k]}
  /* phases are sequential: trust only the prefix of builds that actually exists */
  let ph=0;while(ph<BUILDS.length&&S.b[BUILDS[ph].id])ph++;for(const k in S.b)if(!BLD[k]||BUILDS.indexOf(BLD[k])>=ph)delete S.b[k];S.ph=ph}
 else{/* a v5 (or older) save: new integrated works, so a modest log-scaled starting bonus instead of converting */
  let bonus=0;for(const k of['smelteverket.v5','smelteverket.v4','smelteverket.v3']){const o=rawLoad(k);if(o&&typeof o==='object'){const e=num(+o.life)+num(+o.earned);if(e>0){bonus=Math.round(min(20000,30*Math.pow(Math.log10(1+e),2)));break}}}
  if(bonus>0){S.money=bonus;S.bonusGiven=bonus}}
 for(const k of['money','earned','life','heats','lvl','rate','pot','elek','chg','hm'])S[k]=num(S[k]);
 for(const k of['ore','hearth'])S.rj[k]=num(S.rj[k]);
 for(const k of['h2','pel','bin'])S.dri[k]=num(S.dri[k]);if([.3,.5,.7].indexOf(S.drimix)<0)S.drimix=.5;if(S.pgrade!=='dr')S.pgrade='bf';
 if(!isFinite(S.pres.pts)||S.pres.pts<0)S.pres.pts=0;
 /* Phase 3: a construction-site order in progress (anything malformed is dropped; a new order comes later) */
 {const o=S.ord;let ok=o&&typeof o==='object'&&o.q&&typeof o.q==='object'&&o.g&&typeof o.g==='object'&&isFinite(o.left)&&isFinite(o.bonus)&&o.bonus>=0;
  if(ok)for(const c in o.q){if(['straight','bent','mesh','cage'].indexOf(c)<0||!isFinite(o.q[c])||o.q[c]<=0){ok=false;break}o.g[c]=clamp(num(+o.g[c]),0,o.q[c])}
  if(ok){o.done=o.done===1||o.done===2?o.done:0;o.fin=num(+o.fin);o.dur=isFinite(o.dur)&&o.dur>0?+o.dur:300;o.left=clamp(+o.left,-1,o.dur)}else S.ord=null}
})();
function HIREbyId(id){for(const k in HIRE)if(HIRE[k].id===id)return HIRE[k];return null}
const lv=id=>S.lv[id]||0;
const B_=id=>!!S.b[id];
const era=()=>B_('esf')&&ldRun()?7:B_('h2')?6:B_('consteel')?5:B_('uhp')?4:B_('eaf1')?3:B_('ld')?2:B_('sm')?1:0;
/* the conveyor-fed (Consteel) charging line runs: the conveyor-charged arc furnace, with or without DRI */
const CS=()=>E_().ch==='belt';
const E_=()=>ERA[era()];
const ET=()=>E_().type;
const isEAF=()=>ET()==='eaf';
const slagOn=()=>era()>=2;
const rjEra=()=>B_('elrj')?1:0;
const rjClosed=()=>era()>=3;
const usesHM=()=>E_().hm[1]>0;
/* scrap matters for this era (Bessemer only takes a little cooling scrap) */
const scrapUse=()=>era()>=1||S.heats>=4;
/* a station exists when its build is done (base stations always exist); the råjernsverk closes at the Omlegging */
const zoneBuilt=z=>z.on?z.on():z.mbp?MBK.some(u=>mbOn(u)&&S.mb[u].p===z.id):z.cr?AUTO():(!z.b||B_(z.b))&&!(z.rj&&rjClosed());
const stOn=id=>zoneBuilt(ZN[id]);
const pileOn=k=>k==='ebar'?lv('endless')>0||PILE.ebar.length>0:k==='cage'?lv('robot')>0||PILE.cage.length>0:stOn(PR[k].z)||(k==='pig'&&PILE.pig.length>0);

/* ---------- tuning ---------- */
const capCarry=()=>4+2*lv('carry');
const hcap=()=>4+2*lv('hcap');
const speed=()=>160*(1+.08*lv('speed'));
const hspeed=()=>130*(1+.08*lv('hspeed'));
const fcap=()=>Math.round(E_().cap*(1+.18*lv('furnace')));
/* the player at the furnace desk (control room) runs the power program by hand: +10 % */
const MW=()=>(E_().P||0)*(1+.15*lv('power'))*(G.ctl==='furnace'?1.1:1);
const kwh=()=>ET()==='conv'?0:Math.round(E_().E*(lv('forvarm')&&(era()===3||era()===4)?.88:1)*(CS()?csPreK():1)*(era()===6?driKwhK():1));
/* converters: the blow takes blowT seconds (blower / lance upgrades shorten it); no external energy */
const blowT=()=>E_().blow/(1+.15*lv('power'));
/* melting / blowing limit in t/s (game time): power / specific energy, or a full charge per blow */
const Rpow=()=>ET()==='conv'?fcap()/blowT():MW()/kwh()*30;
/* the share of the charge that is scrap: at least scrapMin(), at most scrapMax() per heat; the rest is råjern */
const scrapMax=()=>fcap()*(1-E_().hm[0]),scrapMin=()=>fcap()*(1-E_().hm[1]);
const supCap=s=>lv(s)>0?SUPC[s]*Math.pow(1.24,lv(s)-1)*(s==='o2'?[1,1.35,1.8][lv('lans')]:1):0;
const SCRAP_T=2;
const yardCap=()=>30+12*lv('yard');
const yardRate=()=>.8*Math.pow(1.22,lv('yard'));
/* in the automated eras the crane operators (scrap helpers) drive it: more lift and a little more speed per operator */
const kranLoad=()=>4*(1+.38*max(0,lv('kran')-1))*(1+.4*opN('skrap'));
const kranSpd=()=>170*(1+.09*lv('kran'))*(1+.08*opN('skrap'));
/* Consteel: the charging crane carries a big lifting magnet (Større magnet adds lift) */
const craneLift=()=>kranLoad()*(CS()?1.5*(1+.15*lv('magnet')):1);
const boxT=4,nBox=()=>3+lv('charge');
const bucketT=()=>max(6,fcap()*.5)*(1+.06*lv('charge'));
const chgCap=()=>{const e=E_().ch;return e==='conv'?max(2*SCRAP_T,Math.ceil(scrapMax()*1.6/SCRAP_T)*SCRAP_T)*(1+.15*lv('charge')):e==='box'?boxT*nBox():e==='bucket'?bucketT()*2:fcap()*.5*(1+.15*lv('charge'))};
const boxIv=()=>2.4/(1+.2*lv('charge'));
const beltRate=()=>3*Math.pow(1.2,lv('charge'));
const refineT=()=>E_().ref*Math.pow(.86,lv('refine'));
/* råjernsverk */
const ORE_T=4,PIG_T=3;
const feY=()=>[.5,.58,.64][lv('sinter')];                       /* tonnes iron per tonne ore: raw concentrate → sinter → pellets */
const rjReq=()=>rjEra()?['koks']:['koks','cowper'];
const rjPow=()=>RJE[rjEra()].rate*Math.pow(1.17,lv('rjsize'))*[1,1.1,1.2][lv('sinter')];
const rjSupCap=s=>lv(s)>0?RJSUPC[s]*Math.pow(1.24,lv(s)-1)*(s==='koks'&&rjEra()?3.2:1):0;
const skipCap=()=>20+8*lv('skip');
const oreYardCap=()=>40+14*lv('malmtog');
const oreYardRate=()=>.5*Math.pow(1.22,lv('malmtog'))*(rjEra()?3:1);
const malmLoad=()=>4*(1+.38*max(0,lv('malmkran')-1));
const malmSpd=()=>170*(1+.09*lv('malmkran'));
const torpCap=l=>era()===7?Math.round(60*(1+.2*(l==null?lv('etorp'):l))):Math.round(12*(1+.22*lv('torp'))*(rjEra()?1.6:1));
const nTorp=()=>era()===7?2+lv('etorpn'):1+lv('torpn');
const torpSpd=()=>era()===7?260*(1+.06*lv('etorp')):150*(1+.06*lv('torp'));
const hearthCap=()=>max(12,torpCap()*1.4);
const hmCap=()=>max(fcap()*1.3,torpCap()*1.25);
const potMax=()=>8+2*lv('slagcap');
const IT=()=>2*(1+.25*lv('kokbig')),RUNNER=.06;               /* ingot tonnes; steel lost in the runner system ("ben") */
const slotsMax=()=>6+lv('kokup');
const pitTimes=()=>({pour:2.8,solid:2.8/(1+.25*lv('solid')),strip:1.4});
const crop=h=>h?.04:.12;                    /* pipe crop on ingots; hot-top powder reduces it */
const kcraneIv=()=>4.5/(1+.28*lv('kran2'))/(1+.5*opN('blokk'));
const coolT=()=>6;
const lfTime=()=>5/(1+.2*lv('lft'));
const qLF=()=>B_('lf')?1.08+.03*lv('lfq'):1;
const oseSpd=()=>230*(1+.25*lv('osekran'));
const nStr=()=>1+lv('strands');
/* the player at the caster desk pushes the casting speed: +15 % */
const strandRate=()=>.6*Math.pow(1.11,lv('caster'))*(G.ctl==='caster'?1.15:1)*hssK();
const billetT=()=>clamp(Math.round(fcap()*(1-E_().heel)/18),2,12);
const gjvRate=()=>.5*Math.pow(1.16,lv('gjvup'))*(lv('bjelke')?1.6:1);
const vvRate=()=>.7*Math.pow(1.16,lv('vvup'))*(lv('splitt')?1.3:1);
const tcRate=()=>1.2*Math.pow(1.16,lv('tcup'));
const stelRate=()=>1*Math.pow(1.16,lv('stelup'))*(lv('stelmor')?1.25:1);
const nettRate=()=>1*Math.pow(1.16,lv('nettup'));
const kobRate=()=>1*Math.pow(1.16,lv('kobup'));
/* ---------- Phase 3 tuning ---------- */
const robRate=()=>1.2*Math.pow(1.16,lv('robspd'));
const elRate=()=>.9*Math.pow(1.16,lv('elspd'));
/* high-speed strand: every strand casts faster (more defects without electromagnetic stirring) */
const hssK=()=>1+.12*lv('hss');
/* CO₂ per tonne of steel by furnace era (t CO₂/t): the ore-based routes are high, scrap + arc furnace low. Capture, the endless
   line (no reheating furnace) and sorted scrap lower it further. With the product passport the buyers pay a green premium. */
const CO2E=[2.3,2.1,1.9,.75,.6,.45,.3,.2];
/* Phase 4: DRI made with hydrogen carries almost no CO₂ – the more DRI in the charge, the lower the footprint; fossil-free
   steel below 0,3 t CO₂/t earns an extra green premium */
const co2t=()=>max(era()>=6?.02:.05,CO2E[era()]-(era()===6?.25*DRI.sh:0)-(lv('endless')?.04:0)-.09*lv('co2')-.01*lv('sort'));
const greenK=()=>lv('pass')?1+clamp((1.05-co2t())*.14,0,.14)+(era()>=6?clamp((.3-co2t())*.4,0,.1):0):1;
/* virgin iron (DRI in the arc furnace, green hot metal in the converter) dilutes copper and tin: premium low-residual grades */
const p4K=()=>era()===6?1+.25*DRI.sh:era()===7?1.2:1;
/* copper in the scrap (%): the sorting line picks out copper; clean scrap gives better steel (price) and fewer surface cracks */
const cuPct=()=>.22-.14*[0,.4,.7,1][lv('sort')];
const cuK=()=>AUTO()?1+(.22-cuPct())*.3:1;
const twinK=()=>1+.02*lv('twin');
const p3K=()=>greenK()*cuK()*twinK()*p4K();
/* ---------- Phase 4 tuning (eras 6–7). Rates in tonnes per game second, like every other flow.
   electrolysis (MW) → H₂ (t/s) into the store → the shaft furnace draws H₂ and pellets and makes DRI into the hot bin →
   era 6: the DRI conveyor lays it on the arc furnace's charging conveyor · era 7: the electric smelting furnace melts it ---------- */
const H2_PER=.055,PEL_PER=1.42;              /* t H₂ and t pellets per t DRI */
const elyMW=l=>160*Math.pow(1.165,l==null?lv('elyz'):l);
const h2Rate=()=>elyMW()*.0004*(1+.04*opN('dri'));
/* H₂ storage: tanks, then (level 3 on) a lined rock cavern – a bigger buffer and more flow to the shaft furnace */
const h2Cap=l=>{l=l==null?lv('h2st'):l;return 6*Math.pow(1.7,l)*(l>=3?3:1)};
const h2Draw=l=>{l=l==null?lv('h2st'):l;return .5*Math.pow(1.55,l)*(l>=3?1.4:1)};
const shaftCap=l=>2.5*Math.pow(1.15,l==null?lv('shaft'):l)*(1+.04*opN('dri'))*(G.ctl==='dri'?1.1:1);
const pelGrade=()=>era()===7&&S.pgrade==='bf';
const pelRate=l=>3.5*Math.pow(1.18,l==null?lv('pellet'):l)*(pelGrade()?1.4:1);
const pelCap=()=>300+60*lv('pellet');
const binCap=()=>120+20*lv('shaft');
const driBelt=l=>4.2*Math.pow(1.2,l==null?lv('dribelt'):l);
/* the arc furnace with DRI: the gangue and the oxygen left in the DRI need more electricity and more lime */
const driKwhK=()=>1+.3*DRI.sh;
/* electric smelting furnace: DRI → hot metal. Blast-furnace grade pellets are cheaper (more per contract) but carry more gangue:
   more DRI per tonne of iron, more slag and more kWh */
const esfMW=l=>120*(1+.2*(l==null?lv('esfmw'):l));
const esfKwh=()=>pelGrade()?520:450;
const esfDriPer=()=>pelGrade()?1.2:1.08;
const esfSlagPer=()=>pelGrade()?.25:.08;
const esfRate=()=>esfMW()/esfKwh()*30;
const magLoad=()=>2+lv('magkran');
const storeMax=()=>24,storeIv=()=>1.2;
const gm=()=>(1+.5*S.pres.pts)*(1+.03*S.lvl);
/* Salgsavtale is the shared base price for every buyer; train and ship pay a premium on top */
const BASEP=()=>Math.pow(1.25,lv('truck'));
const SELLM={dock:()=>BASEP(),tog:()=>BASEP()*1.3*Math.pow(1.08,lv('togp')),kai:()=>BASEP()*1.6*Math.pow(1.08,lv('kaip'))};
const presGain=()=>floor(Math.sqrt(S.earned/PRES_NEED));
const LVL_T=n=>Math.round(400*Math.pow(3.2,n));
/* spesialstål: after the caster is built, ingots are the small special-steel route and sell at a premium */
const prem=it=>it.k==='ingot'&&B_('strang')?1.35:1;
const val=it=>it.t*PR[it.k].p*(it.q||1)*prem(it)*p3K();
function upCost(u){const l=lv(u.id);if(u.costs)return u.costs[min(l,u.costs.length-1)];return Math.round(u.base*Math.pow(u.m||1,l)/5)*5}
const helpersHired=()=>Object.values(HIRE).some(h=>lv(h.id)>0);
const upRaw=u=>typeof u.n==='function'?u.n():u.n;
/* pad title: long compounds get soft hyphens so they can wrap inside the compact label */
const PN={elyz:'Elektro\u00ADlysører',pellet:'Pellet\u00ADtilførsel',etorp:'Større torpedo\u00ADvogner',etorpn:'Ekstra torpedo\u00ADvogn',esfmw:'Mer effekt (MW)',yard:'Skrap\u00ADtilførsel',forvarm:'Kurv\u00ADforvarming',elekkran:'Elektrode\u00ADkran',o2:'Oksygen\u00ADanlegg',kull:'Kull\u00ADinjeksjon',malmtog:'Malm\u00ADtilførsel',
 kanal:'Kanalstein\u00ADlager',hette:'Varmholds\u00ADmasse',torch:'Skjære\u00ADbrenner',varm:'Varm\u00ADinnsetting',hcap:'Hjelper\u00ADkapasitet',gjvup:'Ovns\u00ADkapasitet',
 splitt:'Splitt\u00ADvalsing',stelup:'Finverks\u00ADfart',ktrans:'Kveile\u00ADtransport',hspeed:'Hjelper\u00ADfart',slagcap:'Større slagg\u00ADpotte',kokup:'Flere kokiller',
 operator:'Tapper',sort:'Skrap\u00ADsortering',tdheat:'Fordeler\u00ADvarme',hss:'Hurtig\u00ADstreng',insp:'Inspeksjons\u00ADbue',loop:'Sløyfe\u00ADbuffer',slagmill:'Slagg til sement',dheat:'Fjern\u00ADvarme',twin:'Digital tvilling'};
const padTitleNo=u=>{const n=upRaw(u);if(u.id==='hcap'&&AUTO())return'Vogn\u00ADkapasitet';if(u.id==='hspeed'&&AUTO())return'Vognfart';if(u.id==='lans')return lv('lans')?'Vegg\u00ADinjektorer':'Dørlanse';if(u.id==='charge'&&era()===1)return'Flere kasser';if(u.id==='charge'&&CS())return'Raskere bånd';if(u.id==='skip'&&rjEra())return'Større bånd';
 if(u.id==='power'&&era()===0)return'Sterkere blåse\u00ADmaskin';return PN[u.id]||n};
/* English pad titles come from the dictionary (keyed by the Norwegian text without soft hyphens) */
const padTitle=u=>{const n=padTitleNo(u);return NO_()?n:t_(n.replace(/\u00AD/g,''))};
const upName=u=>t_(upRaw(u).replace(/\u00AD/g,'')).replace(/\u00AD/g,'');
const hName=h=>t_(AUTO()&&h.op?h.op:h.n);
/* a station shows an upgrade when its era/building gate holds; during the first two heats (tutorial) only the intro ones */
const upOpen=u=>stOn(u.st)&&(!u.req||u.req())&&(u.intro||S.heats>=2||S.pres.n>0);
const upAvail=u=>upOpen(u)&&lv(u.id)<u.max;
function upSub(u){const l=lv(u.id),nx=l+1,ar=(a,b,un)=>a+' → '+b+(un?' '+un:''),pc=()=>t_('stk'),fa=n=>t_('+{0} % fart',n),ka=n=>t_('+{0} % kapasitet',n);switch(u.id){
 case'carry':return ar(capCarry(),capCarry()+2,pc());case'speed':return fa(8);
 case'yard':return t_('+{0} % skrap',22);case'kran':{const e5=CS()?1.5*(1+.15*lv('magnet')):1;return l?ar(tf(craneLift()),tf(4*(1+.38*l)*e5*(1+.4*opN('skrap'))),'t'):CS()?ar(tf(craneLift()),tf(4*e5),'t'):t_('Henter selv')}case'magnet':return ar(tf(craneLift()),tf(kranLoad()*1.5*(1+.15*(l+1))),'t');
 case'charge':return era()===1?ar(nBox(),nBox()+1,t_('kasser')):CS()?fa(20):ET()==='conv'?t_('+{0} % kasse',15):t_('+{0} % kurv',6);
 case'furnace':return ar(fcap(),Math.round(E_().cap*(1+.18*nx)),'t');
 case'power':return ET()==='conv'?ar(L1(blowT()),L1(E_().blow/(1+.15*nx)),t_('s blåsing')):ar(Math.round(MW()),Math.round(E_().P*(1+.15*nx)),t_(E_().pu));
 case'refine':return t_('−{0} % tid',14);case'operator':return t_('Tapper ovnen for deg');
 case'ladle':return ar(1+l,2+l,t_('øser'));case'slagcap':return ar(potMax(),potMax()+2);
 case'slaggbil':return t_('Tømmer selv');case'elekkran':return t_('Fyller selv');
 case'kalk':case'o2':case'kull':return l?ka(24):t_('Bygg anlegget');
 case'lans':return t_('+{0} % O₂',l?33:35);case'forvarm':return t_('−{0} % kWh/t',12);
 case'lfq':return'×'+L1(qLF())+' → ×'+L1(qLF()+.03);case'lft':return fa(20);case'osekran':return fa(25);
 case'kokup':return ar(slotsMax(),slotsMax()+1);case'kokbig':return ar(L1(IT()),L1(IT()+.5),'t');
 case'solid':return fa(25);case'kran2':return fa(28);case'kanal':return t_('Raskere oppsett');case'hette':return t_('Mindre kapp');
 case'strands':return ar(nStr(),nStr()+1);case'caster':return fa(11);case'torch':return t_('+{0} % utbytte',L1(1.5));
 case'turret':return t_('Sekvensstøping');case'magkran':return l?ar(magLoad(),magLoad()+1,pc()):t_('Flytter selv');case'varm':return t_('Rullebane');
 case'truck':return t_('+{0} % pris',25);case'hspeed':return fa(8);case'hcap':return ar(hcap(),hcap()+2,pc());
 case'bjelke':return ka(60);case'splitt':return t_('+{0} % valsefart',30);case'stelmor':return fa(25);
 case'rullkob':case'ktrans':return t_('Automatisk');
 case'rjsize':return rjEra()?t_('+{0} % effekt',17):t_('+{0} % råjern',17);case'malmtog':return t_('+{0} % malm',22);case'malmkran':return l?ar(tf(malmLoad()),tf(4*(1+.38*l)),'t'):t_('Henter selv');
 case'skip':return ar(skipCap(),skipCap()+8,'t');case'torp':return ar(torpCap(),Math.round(12*(1+.22*nx)*(rjEra()?1.6:1)),'t');case'torpn':return ar(nTorp(),nTorp()+1,t_('vogner'));
 case'koks':case'cowper':return l?ka(24):t_('Bygg anlegget');
 /* Phase 3 */
 case'sort':return t_('Cu {0} → {1} %',dsep(cuPct().toFixed(2)),dsep((.22-.14*[0,.4,.7,1][min(3,nx)]).toFixed(2)));case'tdheat':return t_('Jevnere overheting');case'slagdet':case'ems':return t_('Færre feilemner');
 case'hss':return fa(12);case'insp':return t_('Finner og sliper feil');case'pass':return t_('Grønn pris +{0} %',Math.round(clamp((1.05-co2t())*.14,0,.14)*100));case'endless':return t_('Støp rett til armering');
 case'elspd':return fa(16);case'loop':return ar(L1(1.2+1.3*l),L1(1.2+1.3*nx),'s');case'robot':return t_('Bøyer og sveiser kurver');case'robspd':return fa(16);
 case'slagmill':return t_('Slaggpris ×{0}',L1(1+1.2*nx));case'dheat':return t_('Varme fra ovnen blir inntekt');case'co2':return ar(L1(co2t()),L1(max(.05,co2t()-.09)),t_('t CO₂/t'));case'twin':return t_('+{0} % pris',2);
 /* Phase 4 */
 case'elyz':return ar(Math.round(elyMW()),Math.round(elyMW(nx)),'MW');case'h2st':return l===2?t_('Fjellhall: ×{0} lager',3):ar(tf(h2Cap()),tf(h2Cap(nx)),t_('t H₂'));
 case'shaft':return ar(tf(shaftCap()*60),tf(shaftCap(nx)*60),t_('t/min'));case'pellet':return t_('+{0} % pellets',18);case'dribelt':return ar(tf(driBelt()*60),tf(driBelt(nx)*60),t_('t/min'));
 case'esfmw':return ar(Math.round(esfMW()),Math.round(esfMW(nx)),'MW');case'etorp':return ar(Math.round(60*(1+.2*l)),Math.round(60*(1+.2*nx)),'t');case'etorpn':return ar(2+l,3+l,t_('vogner'));case'sinter':return t_('{0} → {1} % jern',Math.round(feY()*100),Math.round([.5,.58,.64][min(2,l+1)]*100));case'togp':case'kaip':return t_('+{0} % pris',8);}
 return fa(16)}

/* ---------- runtime state ---------- */
const P={x:POS.start.x,y:POS.start.y,vx:0,vy:0,walk:0,stack:[],cd:0,moving:false};
const parts=[],flyers=[],texts=[],coins=[],helpers=[],movers=[];
const cam={x:P.x,y:P.y};let zoom=1,cssW=380,cssH=700,dpr=1,T=0,shake=0,shx=0,shy=0;
const G={idleS:0,hOff:0,fullHint:0,mode:'intro',introT:0,tapHint:0,earnWin:0,winT:0,offline:0,idleT:0,vSrcLoaded:0,trips:0,modal:null,presT:0,lvlFx:0,swIn:{},chFx:0,slagT:0,slagRecover:0,crane:null,mapOn:false};
