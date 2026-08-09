(()=>{
'use strict';
const $=id=>document.getElementById(id);
const targets=[...document.querySelectorAll('.ret')];
const N=['IZQUIERDO','CENTRAL','DERECHO'];
const POS=[18,50,82];
const RANK={S:4,A:3,B:2,C:1};
let state='intro', hp=10, player=3, ammo=9, lane=1, enemyLane=1, energy=100;
let sonar=1,depth=1,track=1,running=true,reloading=false,reloadStart=0,reloadMs=1250;
let systems={periscope:true,tubes:true,engine:true}, criticalUsed=false, timers=[];
let combo=1,shots=0,hits=0,enemyAttacks=0,sonarIntel=false,depthWindow=false;
let selected=null,surfaceEnd=0,surfaceTimer=0,launchPrep=false,maneuverLockedUntil=0;
let guidedLockLane=null, searchInterval=null;

function later(fn,ms){const t=setTimeout(fn,ms);timers.push(t);return t}
function clearTimers(){timers.forEach(clearTimeout);timers=[];clearInterval(searchInterval)}
function phase(a,b,d=false){$('phaseTitle').textContent=a;$('phaseText').textContent=b;$('phase').classList.toggle('danger',d)}
function setState(s){state=s;$('game').className='game '+s;hideTargets();render()}
function hideTargets(){targets.forEach(t=>t.classList.remove('active','selected'))}
function showTarget(k){if(k!=='hull'&&k!=='critical'&&!systems[k])return;document.querySelector(`[data-target="${k}"]`)?.classList.add('active')}
function tactical(title,text,ms=2400){$('tacticalTitle').textContent=title;$('tacticalText').textContent=text;$('tactical').classList.add('on');later(()=>$('tactical').classList.remove('on'),ms)}
function systemsDown(){return Object.values(systems).filter(v=>!v).length}
function hpPct(){return Math.max(0,hp/10*100)}
function renderContacts(){for(let i=0;i<3;i++){const c=$('c'+i);if(!c)continue;const v=sonarIntel?(i===enemyLane?100:10):(i===enemyLane?58+Math.random()*22:10+Math.random()*28);c.querySelector('span').style.width=v+'%';c.classList.toggle('hot',sonarIntel&&i===enemyLane)}}
function render(){
 $('enemyPct').textContent=Math.round(hpPct())+'%';$('enemyBar').style.width=hpPct()+'%';
 $('playerTxt').textContent=$('hullBox').textContent=player+'/3';$('playerBar').style.width=Math.max(0,player/3*100)+'%';
 $('ammoBox').textContent=ammo;$('ammoCount').textContent=ammo;$('energyBox').textContent=Math.round(energy)+'%';$('energyBar').style.width=energy+'%';
 $('laneTxt').textContent='CARRIL '+N[lane];$('dots').innerHTML=[0,1,2].map(i=>i===lane?'<span class="on">●</span>':'●').join(' ');
 $('sonarCount').textContent=sonar;$('depthCount').textContent=depth;$('trackCount').textContent=track;$('combo').textContent='x'+combo;
 $('reloadBox').textContent=reloading?'...':'LISTO';document.querySelectorAll('[data-sys]').forEach(el=>el.classList.toggle('dead',!systems[el.dataset.sys]));
 const moveLocked=performance.now()<maneuverLockedUntil;
 $('left').disabled=!running||lane===0||energy<40||moveLocked;$('right').disabled=!running||lane===2||energy<40||moveLocked;
 $('fire').disabled=!running||reloading||ammo<=0||!['contact','surface'].includes(state);
 $('sonar').disabled=!running||!sonar||state!=='search';$('depth').disabled=!running||!depth||!depthWindow;$('track').disabled=!running||!track||state!=='surface';
 $('depthCue').classList.toggle('on',depthWindow&&depth>0);
}
function move(d){if(!running||energy<40||performance.now()<maneuverLockedUntil)return;const n=lane+d;if(n<0||n>2)return;lane=n;energy-=40;render()}
$('left').onclick=()=>move(-1);$('right').onclick=()=>move(1);
function boom(el){const r=el.getBoundingClientRect(),f=$('flash');f.style.left=(r.left+r.width/2-7)+'px';f.style.top=(r.top+r.height/2-7)+'px';f.classList.remove('go');void f.offsetWidth;f.classList.add('go')}
function startReload(){reloading=true;reloadStart=performance.now();$('reload').classList.add('on');render()}
function finishReload(){reloading=false;$('reload').classList.remove('on');$('reloadBar').style.width='0';if(state==='surface'&&performance.now()<surfaceEnd-120){refreshSurfaceTargets()}render()}
function targetValue(k){if(k==='critical')return 10;if(k==='tubes'&&systems.tubes)return 8;if(k==='engine'&&systems.engine)return 7;if(k==='periscope'&&systems.periscope)return 6;return 4}
function bestTarget(){return targets.filter(t=>t.classList.contains('active')).sort((a,b)=>targetValue(b.dataset.target)-targetValue(a.dataset.target))[0]}
function damage(n){hp=Math.max(0,hp-n);hits++}
function refreshSurfaceTargets(){if(state!=='surface'||!running)return;hideTargets();showTarget('hull');showTarget('tubes');if(hp<=7)showTarget('engine');if(hp<=4&&!criticalUsed&&Math.random()<.42)showTarget('critical');if(selected){document.querySelector(`[data-target="${selected}"]`)?.classList.add('selected')}}
function shoot(k){
 if(!running||reloading||ammo<=0||!['contact','surface'].includes(state))return;
 const el=document.querySelector(`[data-target="${k}"]`);if(!el?.classList.contains('active'))return;
 ammo--;shots++;boom(el);hideTargets();startReload();combo=Math.min(6,combo+1);
 if(launchPrep){energy=Math.max(0,energy-18);maneuverLockedUntil=performance.now()+650;tactical('RIESGO ASUMIDO','Has disparado durante la preparación enemiga: -18% maniobra y 0,65 s de compromiso.',1800)}
 if(k==='hull'){damage(2);phase('💥 IMPACTO EN CASCO','-20% integridad enemiga')}
 else if(k==='critical'){damage(4);criticalUsed=true;phase('💥 IMPACTO CRÍTICO','-40% integridad · oportunidad aprovechada')}
 else if(k==='periscope'){systems.periscope=false;damage(1);phase('📡 PERISCOPIO DESTRUIDO','-10% integridad + más tiempo para esquivar');tactical('VENTAJA','Los siguientes torpedos avisan 0,9 s antes.')}
 else if(k==='tubes'){systems.tubes=false;damage(1);phase('🚀 TUBOS NEUTRALIZADOS','-10% integridad + menos ataques');tactical('VENTAJA','Probabilidad de ataque enemigo reducida casi a la mitad.')}
 else if(k==='engine'){systems.engine=false;damage(1);surfaceEnd=Math.max(surfaceEnd,performance.now()+3600);phase('⚙ PROPULSIÓN DAÑADA','-10% integridad + emersión prolongada');tactical('VENTAJA','Esta y las próximas emersiones duran más: aprovecha la recarga.')}
 render();
 if(hp<=0)return later(win,450);
 later(finishReload,reloadMs);
}
targets.forEach(t=>t.onclick=()=>shoot(t.dataset.target));
$('fire').onclick=()=>{const preferred=selected&&document.querySelector(`[data-target="${selected}"]`)?.classList.contains('active')?document.querySelector(`[data-target="${selected}"]`):bestTarget();if(preferred)shoot(preferred.dataset.target)};
$('track').onclick=()=>{if(!track||state!=='surface')return;track--;const b=bestTarget();if(b){selected=b.dataset.target;b.classList.add('selected');const map={critical:'PUNTO CRÍTICO · -40%',tubes:'TUBOS · MENOS ATAQUES',engine:'MOTOR · MÁS TIEMPO',periscope:'PERISCOPIO · MÁS AVISO',hull:'CASCO · -20%'};phase('🎯 RASTREO TÁCTICO',map[selected]);tactical('OBJETIVO RECOMENDADO',map[selected],3000)}render()};
$('sonar').onclick=()=>{if(!sonar||state!=='search')return;sonar--;sonarIntel=true;renderContacts();phase('📡 SONAR ACTIVO','Trayectoria confirmada: '+N[enemyLane]);tactical('INTERCEPCIÓN','Muévete al carril '+N[enemyLane]+' antes de que cruce bajo tu quilla.');render()};
$('depth').onclick=()=>{if(!depth||!depthWindow)return;depth--;depthWindow=false;damage(2);combo=Math.min(6,combo+1);phase('💣 CARGA DE PROFUNDIDAD','-20% integridad sin gastar munición de cañón');render();if(hp<=0)later(win,450)};
function search(){
 if(!running)return;setState('search');selected=null;sonarIntel=false;depthWindow=false;enemyLane=Math.floor(Math.random()*3);renderContacts();phase('BÚSQUEDA','Interpreta los contactos, intercepta o conserva recursos');let pulse=0;
 clearInterval(searchInterval);searchInterval=setInterval(()=>{if(state!=='search'){clearInterval(searchInterval);return}renderContacts();pulse++;if(pulse===3&&lane===enemyLane){depthWindow=true;phase('CONTACTO BAJO LA QUILLA','¡Ventana de CARGA! 1,4 segundos');render();later(()=>{depthWindow=false;render()},1400)}},480);
 later(contact,3000);
}
function contact(){if(!running)return;depthWindow=false;setState('contact');phase('CONTACTO','Periscopio visible: daño táctico o munición para el casco');showTarget('periscope');render();later(surface,systems.periscope?1650:820)}
function surface(){
 if(!running)return;setState('surface');launchPrep=false;surfaceEnd=performance.now()+(systems.engine?4300:6200);phase('EMERSIÓN','Elige objetivo. Puedes efectuar varios disparos si gestionas la recarga.');refreshSurfaceTargets();render();
 const loop=()=>{if(!running||state!=='surface')return;const remain=surfaceEnd-performance.now();if(remain<=0)return dive();if(remain<1500&&!launchPrep){launchPrep=true;phase('⚠ PREPARANDO LANZAMIENTO','¿Otro disparo o reservas MANIOBRA?',true);tactical('DECISIÓN DE RIESGO','Disparar ahora reduce energía y bloquea la maniobra 0,65 s.',1500)}requestAnimationFrame(loop)};requestAnimationFrame(loop);
}
function dive(){if(!running||state!=='surface')return;setState('dive');phase('INMERSIÓN',launchPrep?'El U-17 completa su secuencia de ataque':'El U-17 rompe contacto');later(()=>{const chance=systems.tubes?.78:.42;(launchPrep||Math.random()<chance)?attack():search()},650)}
function attack(){
 if(!running)return;setState('attack');enemyAttacks++;const guided=hp<=6&&Math.random()<.48;const dur=systems.periscope?(guided?2850:2050):(guided?3750:2950);let targetLane=lane;guidedLockLane=null;
 $('alert').classList.add('on');$('alert').classList.toggle('guided',guided);$('alertTitle').textContent=guided?'⚠ TORPEDO GUIADO':'⚠ TORPEDO DETECTADO';$('incoming').textContent=N[targetLane];$('alertHint').textContent=guided?'ESPERA AL BLOQUEO · DESPUÉS ESQUIVA':'CAMBIA DE CARRIL';
 phase(guided?'⚠ TORPEDO GUIADO':'⚠ ATAQUE ENEMIGO',guided?'El torpedo sigue tu movimiento hasta fijar objetivo':'Trayectoria fijada a '+N[targetLane],true);
 const t=$('torp'),start=performance.now(),startX=POS[enemyLane];t.classList.add('go');
 function frame(now){if(state!=='attack')return;const p=Math.min(1,(now-start)/dur),lockPct=Math.min(100,p*100);$('lockBar').style.width=lockPct+'%';
   if(guided&&p<.66){targetLane=lane;$('incoming').textContent=N[targetLane]}else if(guided&&guidedLockLane===null){guidedLockLane=targetLane;$('incoming').textContent='BLOQUEADO: '+N[guidedLockLane]}
   const finalLane=guidedLockLane===null?targetLane:guidedLockLane;const x=startX+(POS[finalLane]-startX)*p;const y=34+(91-34)*p;t.style.left=x+'%';t.style.top=y+'%';t.style.opacity='1';
   if(p<1)return requestAnimationFrame(frame);finishAttack(guidedLockLane===null?targetLane:guidedLockLane,guided)}
 requestAnimationFrame(frame);
}
function finishAttack(targetLane,guided){
 $('alert').classList.remove('on','guided');$('lockBar').style.width='0';const t=$('torp');t.classList.remove('go');t.style.opacity='0';
 if(lane===targetLane){player--;combo=1;$('screenFlash').classList.remove('hit');void $('screenFlash').offsetWidth;$('screenFlash').classList.add('hit');phase('💥 IMPACTO ENEMIGO','Casco dañado · cadena táctica reiniciada',true);render();if(player<=0)return lose('DESTRUCTOR HUNDIDO')}
 else{combo=Math.min(6,combo+1);phase('🌊 TORPEDO ESQUIVADO',guided?'Has esperado el bloqueo y maniobrado a tiempo':'Maniobra completada');render()}
 later(search,650);
}
function rankAndScore(){const sys=systemsDown(),score=Math.round(500+player*160+ammo*35+sys*120+combo*45+(player===3?180:0));let rank='C';if(score>=1500)rank='S';else if(score>=1250)rank='A';else if(score>=950)rank='B';return{rank,score,sys}}
function win(){running=false;clearTimers();hideTargets();phase('⚓ OBJETIVO ELIMINADO','U-17 FANTASMA hundido');later(()=>result(true),550)}
function lose(msg){running=false;clearTimers();hideTargets();phase('OPERACIÓN FALLIDA',msg,true);later(()=>result(false,msg),500)}
function result(ok,msg=''){
 $('overlay').classList.add('show');if(!ok){$('modal').innerHTML=`<h2>OPERACIÓN FALLIDA</h2><p>${msg||'El U-17 ha escapado.'}</p><button class="retry" onclick="location.reload()">REINTENTAR</button>`;return}
 const r=rankAndScore();const oldRank=localStorage.getItem('cascadeU17BestRank')||'C',oldScore=+(localStorage.getItem('cascadeU17BestScore')||0);if(RANK[r.rank]>RANK[oldRank])localStorage.setItem('cascadeU17BestRank',r.rank);if(r.score>oldScore)localStorage.setItem('cascadeU17BestScore',r.score);
 const bestRank=localStorage.getItem('cascadeU17BestRank')||r.rank,bestScore=Math.max(oldScore,r.score);$('modal').innerHTML=`<h2>⚓ U-17 ELIMINADO · RANGO ${r.rank}</h2><p>OPERACIÓN ESPECIAL COMPLETADA</p><div class="stats"><div class="stat"><b>${player}/3</b>CASCO</div><div class="stat"><b>${ammo}</b>MUNICIÓN</div><div class="stat"><b>${r.sys}/3</b>SISTEMAS</div><div class="stat"><b>x${combo}</b>CADENA</div><div class="stat"><b>${r.score}</b>PUNTOS</div><div class="stat"><b>${bestRank} · ${bestScore}</b>RÉCORD</div></div><p>Mejora tu rango conservando casco, munición y destruyendo sistemas tácticos.</p><button class="retry" onclick="location.reload()">MEJORAR RANGO</button>`;
}
function tick(now){if(running){energy=Math.min(100,energy+.3);if(reloading){const p=Math.min(100,(now-reloadStart)/reloadMs*100);$('reloadBar').style.width=p+'%'}render()}requestAnimationFrame(tick)}
render();requestAnimationFrame(tick);phase('OPERACIÓN ESPECIAL','U-17 FANTASMA detectado · prepara el destructor');later(search,850);
})();