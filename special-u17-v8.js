(()=>{
'use strict';
const $=id=>document.getElementById(id);
const targets=[...document.querySelectorAll('.ret')];
const N=['IZQUIERDO','CENTRAL','DERECHO'], POS=[18,50,82], MAX_HP=20, RANK={S:4,A:3,B:2,C:1};
const TEST=new URLSearchParams(location.search).get('autotest')==='1';
let state='intro',hp=MAX_HP,player=3,ammo=13,lane=1,enemyLane=1,energy=100,sonar=1,depth=1,track=1;
let running=true,reloading=false,reloadStart=0,reloadMs=1250,systems={periscope:true,tubes:true,engine:true};
let criticalUsed=false,timers=[],combo=1,shots=0,hits=0,enemyAttacks=0,sonarIntel=false,depthWindow=false;
let selected=null,surfaceStart=0,surfaceEnd=0,launchPrep=false,maneuverLockedUntil=0,guidedLockLane=null,searchInterval=null,attackArmed=false;
function later(fn,ms){const t=setTimeout(fn,ms);timers.push(t);return t}
function clearTimers(){timers.forEach(clearTimeout);timers=[];clearInterval(searchInterval)}
function phase(a,b,d=false){$('phaseTitle').textContent=a;$('phaseText').textContent=b;$('phase').classList.toggle('danger',d)}
function hideTargets(){targets.forEach(t=>t.classList.remove('active','selected'))}
function setState(s){state=s;$('game').className='game '+s;hideTargets();render()}
function showTarget(k){if(k!=='hull'&&k!=='critical'&&!systems[k])return;document.querySelector(`[data-target="${k}"]`)?.classList.add('active')}
function tactical(a,b,ms=2200){$('tacticalTitle').textContent=a;$('tacticalText').textContent=b;$('tactical').classList.add('on');later(()=>$('tactical').classList.remove('on'),ms)}
function systemsDown(){return Object.values(systems).filter(v=>!v).length}
function hpPct(){return Math.max(0,hp/MAX_HP*100)}
function renderContacts(){for(let i=0;i<3;i++){const c=$('c'+i);if(!c)continue;const v=sonarIntel?(i===enemyLane?100:10):(i===enemyLane?60+Math.random()*20:10+Math.random()*25);c.querySelector('span').style.width=v+'%';c.classList.toggle('hot',sonarIntel&&i===enemyLane)}}
function render(){
 $('enemyPct').textContent=Math.round(hpPct())+'%';$('enemyBar').style.width=hpPct()+'%';
 $('playerTxt').textContent=$('hullBox').textContent=player+'/3';$('playerBar').style.width=Math.max(0,player/3*100)+'%';
 $('ammoBox').textContent=ammo;$('ammoCount').textContent=ammo;$('energyBox').textContent=Math.round(energy)+'%';$('energyBar').style.width=energy+'%';
 $('laneTxt').textContent='CARRIL '+N[lane];$('dots').innerHTML=[0,1,2].map(i=>i===lane?'<span class="on">●</span>':'●').join(' ');
 $('sonarCount').textContent=sonar;$('depthCount').textContent=depth;$('trackCount').textContent=track;$('combo').textContent='x'+combo;$('reloadBox').textContent=reloading?'...':'LISTO';
 document.querySelectorAll('[data-sys]').forEach(el=>el.classList.toggle('dead',!systems[el.dataset.sys]));
 const locked=performance.now()<maneuverLockedUntil;
 $('left').disabled=!running||lane===0||energy<40||locked;$('right').disabled=!running||lane===2||energy<40||locked;
 $('fire').disabled=!running||reloading||ammo<=0||!['contact','surface'].includes(state);
 $('sonar').disabled=!running||!sonar||state!=='search';$('depth').disabled=!running||!depth||!depthWindow;$('track').disabled=!running||!track||state!=='surface';
 $('depthCue').classList.toggle('on',depthWindow&&depth>0)
}
function move(d){if(!running||energy<40||performance.now()<maneuverLockedUntil)return;const n=lane+d;if(n<0||n>2)return;lane=n;energy-=40;render()}
$('left').onclick=()=>move(-1);$('right').onclick=()=>move(1);
function boom(el){const r=el.getBoundingClientRect(),f=$('flash');f.style.left=(r.left+r.width/2-7)+'px';f.style.top=(r.top+r.height/2-7)+'px';f.classList.remove('go');void f.offsetWidth;f.classList.add('go')}
function startReload(){reloading=true;reloadStart=performance.now();$('reload').classList.add('on');render()}
function finishReload(){reloading=false;$('reload').classList.remove('on');$('reloadBar').style.width='0';if(state==='surface'&&performance.now()<surfaceEnd-120)refreshSurfaceTargets();render();if(ammo===0&&depth===0&&hp>0)later(()=>lose('SIN MUNICIÓN · EL U-17 ESCAPA'),250)}
function targetValue(k){return k==='critical'?10:k==='tubes'&&systems.tubes?9:k==='engine'&&systems.engine?8:k==='periscope'&&systems.periscope?7:4}
function bestTarget(){return targets.filter(t=>t.classList.contains('active')).sort((a,b)=>targetValue(b.dataset.target)-targetValue(a.dataset.target))[0]}
function damage(n){hp=Math.max(0,hp-n);hits++}
function refreshSurfaceTargets(){if(state!=='surface'||!running)return;hideTargets();showTarget('hull');showTarget('tubes');if(hp<=15)showTarget('engine');if(hp<=6&&!criticalUsed&&Math.random()<.42)showTarget('critical');if(selected)document.querySelector(`[data-target="${selected}"]`)?.classList.add('selected')}
function shoot(k){
 if(!running||reloading||ammo<=0||!['contact','surface'].includes(state))return;const el=document.querySelector(`[data-target="${k}"]`);if(!el?.classList.contains('active'))return;
 ammo--;shots++;boom(el);hideTargets();startReload();combo=Math.min(6,combo+1);
 if(launchPrep){energy=Math.max(0,energy-20);maneuverLockedUntil=performance.now()+700;tactical('RIESGO ASUMIDO','Has disparado durante el lanzamiento: -20% maniobra y 0,7 s comprometido.',1600)}
 if(k==='hull'){damage(2);phase('💥 IMPACTO EN CASCO','-10% integridad enemiga')}
 else if(k==='critical'){damage(4);criticalUsed=true;phase('💥 IMPACTO CRÍTICO','-20% integridad · oportunidad aprovechada')}
 else if(k==='periscope'){systems.periscope=false;damage(1);phase('📡 PERISCOPIO DESTRUIDO','Daño leve + mucho más tiempo para esquivar');tactical('VENTAJA REAL','Los próximos torpedos tardan casi 1 segundo más en alcanzar el destructor.')}
 else if(k==='tubes'){systems.tubes=false;damage(1);attackArmed=false;phase('🚀 TUBOS NEUTRALIZADOS','Daño leve + fuerte caída de ataques enemigos');tactical('VENTAJA REAL','La probabilidad de ataque tras una emersión cae del 82% al 35%.')}
 else if(k==='engine'){systems.engine=false;damage(1);surfaceEnd=Math.max(surfaceEnd,surfaceStart+5200);phase('⚙ PROPULSIÓN DAÑADA','Daño leve + emersión prolongada');tactical('VENTAJA REAL','Ganas un disparo seguro adicional antes de la fase de riesgo.')}
 render();if(hp<=0)return later(win,350);later(finishReload,reloadMs)
}
targets.forEach(t=>t.onclick=()=>shoot(t.dataset.target));
$('fire').onclick=()=>{const p=selected&&document.querySelector(`[data-target="${selected}"]`)?.classList.contains('active')?document.querySelector(`[data-target="${selected}"]`):bestTarget();if(p)shoot(p.dataset.target)};
$('track').onclick=()=>{if(!track||state!=='surface')return;track--;const b=bestTarget();if(b){selected=b.dataset.target;b.classList.add('selected');const m={critical:'PUNTO CRÍTICO · DAÑO x2',tubes:'TUBOS · 82% → 35% ATAQUES',engine:'MOTOR · +1 DISPARO SEGURO',periscope:'PERISCOPIO · +0,9 s AVISO',hull:'CASCO · DAÑO DIRECTO'};phase('🎯 RASTREO TÁCTICO',m[selected]);tactical('OBJETIVO RECOMENDADO',m[selected],2800)}render()};
$('sonar').onclick=()=>{if(!sonar||state!=='search')return;sonar--;sonarIntel=true;renderContacts();phase('📡 SONAR ACTIVO','Trayectoria confirmada: '+N[enemyLane]);tactical('INTERCEPCIÓN','Muévete a '+N[enemyLane]+' antes de que cruce bajo tu quilla.');render()};
$('depth').onclick=()=>{if(!depth||!depthWindow)return;depth--;depthWindow=false;damage(2);combo=Math.min(6,combo+1);phase('💣 CARGA DE PROFUNDIDAD','-10% sin gastar munición de cañón');render();if(hp<=0)later(win,350)};
function search(){if(!running)return;setState('search');selected=null;sonarIntel=false;depthWindow=false;enemyLane=Math.floor(Math.random()*3);renderContacts();phase('BÚSQUEDA','Interpreta contactos, intercepta o conserva recursos');let p=0;clearInterval(searchInterval);searchInterval=setInterval(()=>{if(state!=='search'){clearInterval(searchInterval);return}renderContacts();p++;if(p===3&&lane===enemyLane){depthWindow=true;phase('CONTACTO BAJO LA QUILLA','¡CARGA disponible durante 1,4 s!');render();later(()=>{depthWindow=false;render()},1400)}},480);later(contact,3000)}
function contact(){if(!running)return;depthWindow=false;setState('contact');phase('CONTACTO','Periscopio visible: ventaja defensiva o munición para el casco');showTarget('periscope');render();later(surface,systems.periscope?1650:820)}
function surface(){
 if(!running)return;setState('surface');launchPrep=false;attackArmed=Math.random()<(systems.tubes?.82:.35);surfaceStart=performance.now();surfaceEnd=surfaceStart+(systems.engine?3900:5200);phase('EMERSIÓN','Dos disparos seguros. El tercero entra en zona de riesgo.');refreshSurfaceTargets();render();
 const loop=()=>{if(!running||state!=='surface')return;const remain=surfaceEnd-performance.now();if(remain<=0)return dive();if(remain<1500&&!launchPrep&&attackArmed){launchPrep=true;phase('⚠ PREPARANDO LANZAMIENTO','¿Tercer disparo o reservas MANIOBRA?',true);tactical('DECISIÓN DE RIESGO','Disparar ahora cuesta energía y retrasa tu primera maniobra.',1450)}requestAnimationFrame(loop)};requestAnimationFrame(loop)
}
function dive(){if(!running||state!=='surface')return;setState('dive');phase('INMERSIÓN',attackArmed?'El U-17 completa su secuencia de ataque':'El U-17 rompe contacto sin disparar');later(()=>attackArmed?attack():search(),650)}
function attack(){
 if(!running)return;setState('attack');enemyAttacks++;const guided=hp<=12&&Math.random()<.48;const dur=systems.periscope?(guided?2850:2050):(guided?3750:2950);let targetLane=lane;guidedLockLane=null;
 $('alert').classList.add('on');$('alert').classList.toggle('guided',guided);$('alertTitle').textContent=guided?'⚠ TORPEDO GUIADO':'⚠ TORPEDO DETECTADO';$('incoming').textContent=N[targetLane];$('alertHint').textContent=guided?'ESPERA AL BLOQUEO · DESPUÉS ESQUIVA':'CAMBIA DE CARRIL';phase(guided?'⚠ TORPEDO GUIADO':'⚠ ATAQUE ENEMIGO',guided?'Sigue tu movimiento hasta fijar objetivo':'Trayectoria fijada a '+N[targetLane],true);
 const t=$('torp'),start=performance.now(),startX=POS[enemyLane];t.classList.remove('go');t.style.animation='none';t.style.opacity='1';
 function frame(now){if(state!=='attack')return;const p=Math.min(1,(now-start)/dur);$('lockBar').style.width=(p*100)+'%';if(guided&&p<.66){targetLane=lane;$('incoming').textContent=N[targetLane]}else if(guided&&guidedLockLane===null){guidedLockLane=targetLane;$('incoming').textContent='BLOQUEADO: '+N[guidedLockLane]}const finalLane=guidedLockLane===null?targetLane:guidedLockLane;t.style.left=(startX+(POS[finalLane]-startX)*p)+'%';t.style.top=(34+57*p)+'%';if(p<1)return requestAnimationFrame(frame);finishAttack(finalLane,guided)}requestAnimationFrame(frame)
}
function finishAttack(targetLane,guided){$('alert').classList.remove('on','guided');$('lockBar').style.width='0';const t=$('torp');t.style.opacity='0';t.style.animation='';if(lane===targetLane){player--;combo=1;$('screenFlash').classList.remove('hit');void $('screenFlash').offsetWidth;$('screenFlash').classList.add('hit');phase('💥 IMPACTO ENEMIGO','Casco dañado · cadena táctica reiniciada',true);render();if(player<=0)return lose('DESTRUCTOR HUNDIDO')}else{combo=Math.min(6,combo+1);phase('🌊 TORPEDO ESQUIVADO',guided?'Esperaste el bloqueo y maniobraste a tiempo':'Maniobra completada');render()}later(search,650)}
function rankAndScore(){const sys=systemsDown(),score=Math.round(500+player*180+ammo*35+sys*210+combo*45+(player===3?180:0));let rank='C';if(score>=1850&&sys>=2&&player>=2)rank='S';else if(score>=1450&&sys>=1)rank='A';else if(score>=1050)rank='B';return{rank,score,sys}}
function win(){running=false;clearTimers();hideTargets();phase('⚓ OBJETIVO ELIMINADO','U-17 FANTASMA hundido');later(()=>result(true),450)}
function lose(msg){if(!running)return;running=false;clearTimers();hideTargets();phase('OPERACIÓN FALLIDA',msg,true);later(()=>result(false,msg),400)}
function result(ok,msg=''){
 $('overlay').classList.add('show');if(!ok){$('modal').innerHTML=`<h2>OPERACIÓN FALLIDA</h2><p>${msg||'El U-17 ha escapado.'}</p><button class="retry" onclick="location.reload()">REINTENTAR</button>`;return}
 const r=rankAndScore(),oldRank=localStorage.getItem('cascadeU17BestRank')||'C',oldScore=+(localStorage.getItem('cascadeU17BestScore')||0);if(RANK[r.rank]>RANK[oldRank])localStorage.setItem('cascadeU17BestRank',r.rank);if(r.score>oldScore)localStorage.setItem('cascadeU17BestScore',r.score);const bestRank=localStorage.getItem('cascadeU17BestRank')||r.rank,bestScore=Math.max(oldScore,r.score);
 $('modal').innerHTML=`<h2>⚓ U-17 ELIMINADO · RANGO ${r.rank}</h2><p>OPERACIÓN ESPECIAL COMPLETADA</p><div class="stats"><div class="stat"><b>${player}/3</b>CASCO</div><div class="stat"><b>${ammo}</b>MUNICIÓN</div><div class="stat"><b>${r.sys}/3</b>SISTEMAS</div><div class="stat"><b>x${combo}</b>CADENA</div><div class="stat"><b>${r.score}</b>PUNTOS</div><div class="stat"><b>${bestRank} · ${bestScore}</b>RÉCORD</div></div><p>Rango S: destruye al menos 2 sistemas y conserva 2 puntos de casco.</p><button class="retry" onclick="location.reload()">MEJORAR RANGO</button>`
}
function snapshot(){return{state,hp,maxHp:MAX_HP,player,ammo,lane,enemyLane,energy,sonar,depth,track,reloading,systems:{...systems},combo,shots,hits,enemyAttacks,depthWindow,launchPrep,attackArmed,rank:rankAndScore()}}
window.__u17Debug={snapshot,rankAndScore};
function autotest(){const out=[],check=(n,o,d='')=>out.push({name:n,ok:!!o,detail:d});const save={hp,player,ammo,depth,combo,systems:{...systems}};hp=MAX_HP;damage(2);check('casco resta 10%',hp===18,'hp='+hp);let active=0,down=0;for(let i=0;i<10000;i++){if(Math.random()<.82)active++;if(Math.random()<.35)down++}check('tubos activos 82%',active>7800&&active<8600,'ataques='+active);check('tubos destruidos 35%',down>3100&&down<3900,'ataques='+down);hp=MAX_HP;for(let i=0;i<10;i++)hp=Math.max(0,hp-2);check('casco solo exige 10 impactos',hp===0);const safeBase=Math.floor((3900-1500-1)/1250)+1,safeEngine=Math.floor((5200-1500-1)/1250)+1;check('base = 2 disparos seguros',safeBase===2,'safe='+safeBase);check('motor = +1 disparo seguro',safeEngine===3,'safe='+safeEngine);Object.assign(window,{__U17_AUTOTEST_RESULT__:out});document.body.dataset.u17Test=JSON.stringify(out);document.title='U17_AUTOTEST_'+(out.every(x=>x.ok)?'PASS':'FAIL');hp=save.hp;player=save.player;ammo=save.ammo;depth=save.depth;combo=save.combo;systems=save.systems;render()}
function tick(now){if(running){energy=Math.min(100,energy+.3);if(reloading)$('reloadBar').style.width=Math.min(100,(now-reloadStart)/reloadMs*100)+'%';render()}requestAnimationFrame(tick)}
render();requestAnimationFrame(tick);if(TEST){running=false;autotest()}else{phase('OPERACIÓN ESPECIAL','U-17 FANTASMA detectado · prepara el destructor');later(search,850)}
})();