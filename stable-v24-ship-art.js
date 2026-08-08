(()=>{
'use strict';
const ATLAS='cascade-ship-atlas.webp?v=1';
const style=document.createElement('style');
style.textContent=`
#grid{position:relative!important}
.cascadeShipArt{position:absolute;z-index:7;pointer-events:none;overflow:visible;transform-origin:center center;opacity:0;animation:cascadeShipFade .22s ease-out forwards}
.cascadeShipArt.vertical{transform:translate(-50%,-50%) rotate(90deg)!important}
.cascadeShipArt.horizontal{transform:translate(-50%,-50%)!important}
.cascadeShipSprite{position:absolute;left:50%;top:50%;width:235%;height:235%;transform:translate(-50%,-50%);background-image:url('${ATLAS}');background-repeat:no-repeat;background-size:100% 500%;background-position-x:center;filter:drop-shadow(0 3px 5px #001820aa)}
.cascadeShipArt.boss .cascadeShipSprite{width:250%;height:250%;filter:drop-shadow(0 4px 7px #001018cc) drop-shadow(0 0 8px #ffd24a66)}
@keyframes cascadeShipFade{from{opacity:0}to{opacity:1}}
#fleet{display:flex!important;flex-direction:column;gap:5px!important}
.cascadeFleetRow{display:flex;align-items:center;gap:5px;min-height:25px;padding:2px 3px;border-radius:7px;background:#062f4666;border:1px solid #ffffff12;overflow:hidden}
.cascadeFleetRow.sunk{opacity:.34;filter:grayscale(.8)}
.cascadeFleetThumb{position:relative;flex:0 0 46px;height:22px;overflow:hidden}
.cascadeFleetThumb .cascadeSprite{position:absolute;left:50%;top:50%;width:220%;height:220%;transform:translate(-50%,-50%);background-image:url('${ATLAS}');background-size:100% 500%;background-repeat:no-repeat;background-position-x:center;filter:drop-shadow(0 1px 2px #001820aa)}
.cascadeFleetRow.boss .cascadeFleetThumb{flex-basis:52px;height:25px}
.cascadeFleetRow.boss .cascadeSprite{width:235%;height:235%;filter:drop-shadow(0 1px 3px #001018bb) drop-shadow(0 0 5px #ffd24a55)}
.cascadeFleetPips{display:flex;gap:2px;flex-wrap:nowrap;min-width:0}
.cascadeFleetPip{width:6px;height:6px;border-radius:50%;border:1px solid #d6f6ff99;background:#d6f6ff22;box-sizing:border-box}
.cascadeFleetPip.hit{background:#ff765f;border-color:#ffc0b6}
.cascadeFleetPip.armor{background:#ffd768;border-color:#fff0a7}
.cascadeBossZoneArt,.cascadeBossModalArt{position:relative;overflow:hidden;margin-left:auto;margin-right:auto}
.cascadeBossZoneArt{width:142px;height:50px;margin-top:-5px;margin-bottom:-8px}
.cascadeBossModalArt{width:min(96%,380px);height:115px;margin-top:4px;margin-bottom:8px}
.cascadeBossZoneArt .cascadeSprite,.cascadeBossModalArt .cascadeSprite{position:absolute;left:50%;top:50%;width:230%;height:230%;transform:translate(-50%,-50%);background-image:url('${ATLAS}');background-size:100% 500%;background-position:center 100%;background-repeat:no-repeat;filter:drop-shadow(0 4px 8px #001018aa)}
`;
document.head.appendChild(style);
const rowFor=len=>Math.max(0,Math.min(4,len-2))*25;
let observer=null,pending=false;
function snapshot(){try{return window.__qa?.snapshot?.()}catch(e){return null}}
function spriteEl(len,cls='cascadeSprite'){
 const d=document.createElement('div');d.className=cls;d.style.backgroundPositionY=rowFor(len)+'%';return d;
}
function artForShip(s,N,cells,grid,gridRect){
 if(!s?.sunk||!s.cells?.length)return;
 const els=s.cells.map(([r,c])=>cells[r*N+c]).filter(Boolean);if(els.length!==s.cells.length)return;
 const rects=els.map(e=>e.getBoundingClientRect());
 const minL=Math.min(...rects.map(r=>r.left)),maxR=Math.max(...rects.map(r=>r.right));
 const minT=Math.min(...rects.map(r=>r.top)),maxB=Math.max(...rects.map(r=>r.bottom));
 const horizontal=s.cells.every(p=>p[0]===s.cells[0][0]);
 const cellW=rects[0].width,cellH=rects[0].height;
 const span=horizontal?(maxR-minL):(maxB-minT);
 const cx=(minL+maxR)/2-gridRect.left,cy=(minT+maxB)/2-gridRect.top;
 const d=document.createElement('div');d.className='cascadeShipArt '+(horizontal?'horizontal':'vertical')+(s.boss?' boss':'');
 Object.assign(d.style,{left:cx+'px',top:cy+'px',width:(span+Math.max(cellW,cellH)*.08)+'px',height:(Math.min(cellW,cellH)*.92)+'px'});
 d.appendChild(spriteEl(s.len,'cascadeShipSprite'));
 grid.appendChild(d);
}
function syncBoard(s){
 const grid=document.getElementById('grid');if(!grid||!s?.N)return;
 grid.querySelectorAll('.cascadeShipArt').forEach(x=>x.remove());
 const cells=[...grid.querySelectorAll('.cell')];if(cells.length<s.N*s.N)return;
 cells.forEach(el=>{if(el.classList.contains('sunk'))el.textContent=''});
 const gr=grid.getBoundingClientRect();
 (s.ships||[]).forEach(ship=>artForShip(ship,s.N,cells,grid,gr));
}
function syncFleet(s){
 const f=document.getElementById('fleet');if(!f||!s?.ships)return;
 f.innerHTML='';
 (s.ships||[]).forEach(ship=>{
   const row=document.createElement('div');row.className='cascadeFleetRow'+(ship.sunk?' sunk':'')+(ship.boss?' boss':'');
   const thumb=document.createElement('div');thumb.className='cascadeFleetThumb';thumb.appendChild(spriteEl(ship.len));
   const pips=document.createElement('div');pips.className='cascadeFleetPips';
   for(let i=0;i<ship.len;i++){
     const p=document.createElement('span');p.className='cascadeFleetPip';
     const k=ship.cells?.[i]?.join(',');if(k&&ship.hits?.includes(k))p.classList.add('hit');else if(k&&ship.armor?.includes(k)&&!ship.armorDamage?.[k])p.classList.add('armor');
     pips.appendChild(p);
   }
   row.append(thumb,pips);f.appendChild(row);
 });
}
function bossBlock(cls){const d=document.createElement('div');d.className=cls;d.appendChild(spriteEl(6));return d}
function syncBoss(s){
 const sub=document.getElementById('zoneSub');
 document.querySelectorAll('.cascadeBossZoneArt').forEach(x=>x.remove());
 if(sub&&s?.mode==='campaign'&&s.zone%5===0)sub.appendChild(bossBlock('cascadeBossZoneArt'));
 const box=document.getElementById('modalBox');
 if(box&&/(JEFE|TITÁN)/i.test(box.textContent||'')&&!box.querySelector('.cascadeBossModalArt')){
   const d=bossBlock('cascadeBossModalArt'),h=box.querySelector('h2');h?h.after(d):box.prepend(d);
 }
}
function sync(){
 pending=false;if(observer)observer.disconnect();
 const s=snapshot();if(s){syncBoard(s);syncFleet(s);syncBoss(s)}
 if(observer)observer.observe(document.body,{childList:true,subtree:true,characterData:true});
}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(sync)}
observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true,characterData:true});
window.addEventListener('resize',schedule,{passive:true});
setTimeout(sync,120);
})();
