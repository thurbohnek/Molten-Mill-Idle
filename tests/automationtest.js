// Phase 2 regression (node): from the first arc furnace on nobody carries. Helpers are operators at desks / in crane cabs,
// products leave on transport cars, the player is never asked to carry, desks exist and take over control.
const H=require('./harness6.js');const DT=1/30;let bad=0;const ok=(c,m)=>{console.log((c?'ok  ':'FAIL')+' '+m);if(!c)bad++};
function setup(b){H.store.clear();const W=H.boot(),S=W.S;S.heats=99;S.st.slagT=999;S.money=1e3;W.build(b);
 for(const st in W.HIRE)W.hire(st,W.HIRE[st].costs.length);for(const k of['kalk','o2','kull','kran','koks','cowper','strands','caster','furnace','power','yard','charge','magnet','gjvup','vvup','tcup','stelup','nettup','kobup','truck'])W.setLv(k,8);W.setLv('yard2',1);W.setLv('ladle',2);W.setLv('operator',1);W.rebuildSolids();return W}
/* before the arc furnace: helpers still carry (sanity) */
{const W=setup('tog');let carried=0;for(let i=0;i<30*120;i++){W.update(DT);if(W.helpers.some(h=>!h.agv&&h.stack.length))carried++}
 ok(carried>0&&!W.AUTO(),'LD era: helpers carry as before ('+carried+' frames)');ok(W.helpers.every(h=>!h.agv),'LD era: no transport cars')}
for(const b of['eaf1','uhp','consteel','kai']){const W=setup(b),S=W.S,P=W.P;const tag=b+' (era '+W.era()+')';
 const sold0=Object.assign({},S.st.soldK),pick={};let carry=0,offPost=0,frames=0,goalCarry=0,statusCarry=0;
 for(let i=0;i<30*240;i++){W.update(DT);if(i%30===0)W.draw();if(i<30)continue;frames++;
  for(const h of W.helpers){if(h.agv)continue;if(h.stack.length)carry++;if(h.state!=='post'&&h.state!=='toPost')offPost++}
  if(i%60===0){const g=W.goal();if(/Bær |Hent /.test(g.sub||'')&&!P.stack.length)goalCarry++;for(const s of W.status_all())if(s&&/Bær /.test(s.t))statusCarry++}}
 ok(carry===0,tag+': no operator carries anything ('+carry+')');ok(offPost===0,tag+': operators stay at desks / cabs ('+offPost+')');
 ok(goalCarry===0,tag+': the goal never asks the player to carry ('+goalCarry+')');ok(statusCarry===0,tag+': no "carry here" status ('+statusCarry+')');
 ok(W.carryTask()===null,tag+': no carry task');
 const ag=W.helpers.filter(h=>h.agv);const want=Object.keys(W.AGVK).reduce((a,st)=>a+W.nAGV(st),0);ok(ag.length===want&&want>0,tag+': transport cars '+ag.length+'/'+want);
 const prods=Object.keys(W.AGVK).filter(st=>W.nAGV(st)>0).map(st=>W.AGVK[st]);const nSold=prods.reduce((a,k)=>a+(S.st.soldK[k]||0)-(sold0[k]||0),0),maxPile=Math.max(...prods.map(k=>W.PILE[k].length));
 ok(nSold>0&&maxPile<40,tag+': products leave by car (sold '+nSold+', biggest pile '+maxPile+')');
 ok(W.lv('slaggbil')>0&&W.lv('elekkran')>0,tag+': slag pot carrier + electrode crane come with the shop');
 ok(!W.upOpen(W.UPm.carry),tag+': no "Bigger carry" upgrade');
 ok(/operat/i.test(W.t_(W.HIRE.ovn.op))&&W.padName(W.PAD.hire_skrap)===W.t_('Kranfører'),tag+': hire pads are operators');
 /* the player cannot pick anything up */
 P.x=W.SRCm.y0.x;P.y=W.SRCm.y0.y+60;P.stack=[];for(let i=0;i<30;i++)W.update(DT);ok(P.stack.length===0,tag+': walking over the scrap pile picks nothing up');
 /* desks: furnace + ladle crane + scrap pulpit (+ caster) */
 const ds=W.ctlDesks().map(d=>d.id);ok(['furnace','ladle','skrap'].every(k=>ds.includes(k))&&(!W.B_('strang')||ds.includes('caster')),tag+': control desks '+ds.join(','));
 const fd=W.CRDESK.furnace;W.G.go=null;P.x=fd.x;P.y=fd.y+30;P.vx=P.vy=0;const mw0=W.F.rp;W.deskTap(fd.x,fd.y);ok(W.G.ctl==='furnace',tag+': tapping the furnace desk takes over');
 for(let i=0;i<30*3;i++)W.update(DT);ok(W.G.ctl==='furnace',tag+': control held while at the desk');
 W.goTo(fd.x,fd.y+300);for(let i=0;i<30*3;i++)W.update(DT);ok(W.G.ctl==null,tag+': walking away hands control back');
 /* walking to a desk by tapping it from afar, then the crane pulpit */
 P.x=fd.x;P.y=fd.y+260;W.G.go=null;W.deskTap(fd.x,fd.y);for(let i=0;i<30*6&&W.G.ctl!=='furnace';i++)W.update(DT);ok(W.G.ctl==='furnace',tag+': tap from afar walks there and takes over');
 const sp=W.ctlDesks().find(d=>d.id==='skrap');W.G.ctl=null;P.x=sp.x;P.y=sp.y+30;W.G.go=null;W.deskTap(sp.x,sp.y);ok(W.G.crane==='skrap',tag+': the crane pulpit takes over the scrap crane');W.toggleCrane();ok(!W.G.crane,tag+': and hands it back');
 ok(W.workAvail(),tag+': the control room counts as work');
 ok(W.I18N_MISS.size===0,tag+': no missing strings')}
console.log(bad?'FAIL':'PASS');process.exitCode=bad?1:0;
