(()=>{
'use strict';
const ATLAS='cascade-ship-atlas.webp?v=1';
const style=document.createElement('style');
style.textContent=`
#grid{position:relative!important}
.cascadeShipArt{position:absolute;z-index:7;pointer-events:none;background-image:url('${ATLAS}');background-repeat:no-repeat;background-size:100% 500%;background-position-x:center;filter:drop-shadow(0 3px 4px #00182099);animation:cascadeShipReveal .28s ease-out both;transform-origin:center center}
.cascadeShipArt.boss{z-index:8;filter:drop-shadow(0 4px 7px #001018cc) drop-shadow(0 0 7px #ffd24a66)}
@keyframes cascadeShipReveal{from{opacity:0;transform:translate(-50%,-50%) scale(.78)}to{opacity:1;transform:translate(-50%,-50%) scale(1)}}
.cascadeShipArt.vertical{animation:none;transform:translate(-50%,-50%) rotate(90deg)}
.cascadeBossZoneArt{width:112px;height:42px;margin:-2px auto -5px;background-image:url('${ATLAS}');background-size:100% 500%;background-position:center 100%;background-repeat:no-repeat;filter:drop-shadow(0 3px 4px #001018aa);pointer-events:none}
.shipRow.titan .cascadeBossFleetArt{width:72px;height:28px;margin:1px auto 3px;background-image:url('${ATLAS}');background-size:100% 500%;background-position:center 100%;background-repeat:no-repeat;filter:drop-shadow(0 2px 3px #00101899);pointer-events:none}
.modal .cascadeBossModalArt{width:min(92%,340px);aspect-ratio:3/1;margin:6px auto 10px;background-image:url('${ATLAS}');background-size:100% 500%;background-position:center 100%;background-repeat:no-repeat;filter:drop-shadow(0 4px 8px #001018aa)}
`;
document.head.appendChild(style);
const rowFor=len=>Math.max(0,Math.min(4,len-2))*25;
let observer=null,pending=false;
function snapshot(){try{return window.__qa?.snapshot?.()}catch(e){return null}}
function artForShip(s,N,cells,grid,gridRect){
 if(!s?.sunk||!s.cells?.length)return;
 const els=s.cells.map(([r,c])=>cells[r*N+c]).filter(Boolean);if(els.length!==s.cells.length)return;
 const rects=els.map(e=>e.getBoundingClientRect());
 const minL=Math.min(...rects.map(r=>r.left)),maxR=Math.max(...rects.map(r=>r.right));
 const minT=Math.min(...rects.map(r=>r.top)),maxB=Math.max(...rects.map(r=>r.bottom));
 const cw=rects[0].width,ch=rects[0].height,horizontal=s.cells.every(p=>p[0]===s.cells[0][0]);
 const d=document.createElement('div');d.className='cascadeShipArt'+(horizontal?'':' vertical')+(s.boss?' boss':'');
 d.style.backgroundPositionY=rowFor(s.len)+'%';
 const cx=(minL+maxR)/2-gridRect.left,cy=(minT+maxB)/2-gridRect.top;
 const w=horizontal?(maxR-minL+cw*.55):(maxB-minT+ch*.55);
 const h=horizontal?ch*2.05:cw*2.05;
 Object.assign(d.style,{left:cx+'px',top:cy+'px',width:w+'px',height:h+'px',transform:horizontal?'translate(-50%,-50%)':'translate(-50%,-50%) rotate(90deg)'});
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
function syncBoss(s){
 const sub=document.getElementById('zoneSub');
 document.querySelectorAll('.cascadeBossZoneArt').forEach(x=>x.remove());
 if(sub&&s?.mode==='campaign'&&s.zone%5===0){const d=document.createElement('div');d.className='cascadeBossZoneArt';sub.appendChild(d)}
 document.querySelectorAll('.shipRow.titan').forEach(row=>{if(!row.querySelector('.cascadeBossFleetArt')){const d=document.createElement('div');d.className='cascadeBossFleetArt';row.prepend(d)}});
 const box=document.getElementById('modalBox');
 if(box&&/(JEFE|TITÁN)/i.test(box.textContent||'')&&!box.querySelector('.cascadeBossModalArt')){const d=document.createElement('div');d.className='cascadeBossModalArt';const h=box.querySelector('h2');h?h.after(d):box.prepend(d)}
}
function sync(){pending=false;if(observer)observer.disconnect();const s=snapshot();if(s){syncBoard(s);syncBoss(s)}if(observer)observer.observe(document.body,{childList:true,subtree:true,characterData:true})}
function schedule(){if(pending)return;pending=true;requestAnimationFrame(sync)}
observer=new MutationObserver(schedule);observer.observe(document.body,{childList:true,subtree:true,characterData:true});
window.addEventListener('resize',schedule,{passive:true});
setTimeout(sync,140);
})();
