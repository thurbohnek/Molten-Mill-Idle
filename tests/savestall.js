const H=require('./harness6.js');const DT=1/30;
for(const helpers of [1,0])for(const cut of [37,91,180,333]){for(const k of[...H.store.keys()])if(k.startsWith('smelteverket'))H.store.delete(k);let W=H.boot(),S=W.S;S.heats=99;S.st.slagT=999;
 W.build('kai');for(let r=0;r<2;r++)for(const u of W.UP)if(W.upOpen(u))W.setLv(u.id,u.max);
 for(const st in W.HIRE){try{W.hire(st,helpers?W.HIRE[st].costs.length:0)}catch(e){}}W.rebuildSolids();
 for(let i=0;i<cut/DT;i++)W.update(DT);W.save();delete global.__smeltOn;
 W=H.boot();S=W.S;const F=W.F;let lastH=S.heats,t=0,lastT=0,stuck=null;
 for(let i=0;i<15*60/DT;i++){W.update(DT);t+=DT;if(S.heats!==lastH){lastH=S.heats;lastT=t}
  if(!stuck&&t-lastT>240){stuck={t:Math.round(t),state:F.state,solid:F.solid,rate:F.rate,stop:F.stop,starve:F.starve,lim:F.lim,ovn:W.status('ovn').t,skrap:W.status('skrap').t}}}
 console.log('helpers',helpers,'save at',cut,'s → heats after reload',S.heats,stuck?JSON.stringify(stuck):'no stall');if(stuck)process.exitCode=1}
/* self-heal: a broken old save (bath 373 t, scrap count used up) must recover */
{for(const k of[...H.store.keys()])if(k.startsWith('smelteverket'))H.store.delete(k);const W=H.boot(),S=W.S,F=W.F;S.heats=99;S.st.slagT=999;W.build('kai');for(let r=0;r<2;r++)for(const u of W.UP)if(W.upOpen(u))W.setLv(u.id,u.max);W.rebuildSolids();
 for(let i=0;i<20/DT;i++)W.update(DT);F.state='melt';F.solid=0;F.bath=W.fcap()-41;F.scIn=W.fcap();const h=S.heats;for(let i=0;i<180/DT;i++)W.update(DT);console.log('broken save heals:',S.heats>h?'yes':'NO');if(S.heats<=h)process.exitCode=1}
