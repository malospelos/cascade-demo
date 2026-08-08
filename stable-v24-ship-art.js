(()=>{
'use strict';
const HQ=window.__CASCADE_ATLAS_HQ||'';
const ATLAS=HQ.length===72967?HQ:'cascade-ship-atlas.webp?v=1';
if(HQ&&HQ.length!==72967)console.error('Atlas HQ incompleto:',HQ.length);
const style=document.createElement('style');
style.textContent=`
#grid{position:relative!important}
#grid .cell.sunk{font-size:0!important;color:transparent!important}
#fleet>.shipRow{display:none!important}
.cascadeShipArt{position:absolute;z-index:7;pointer-events:none;transform-origin:center center;overflow:visible}
.cascadeShipArt.horizontal{transform:translate(-50%,-50%)}
.cascadeShipArt.vertical{transform:translate(-50%,-50%) rotate(90deg)}
.cascadeBoardSprite{position:absolute;inset:0;background-image:url('${ATLAS}');background-size:100% 500%;background-repeat:no-repeat;background-position-x:center;filter:drop-shadow(0 3px 5px #001820aa);image-rendering:auto}
.cascadeShipArt.boss .cascadeBoardSprite{filter:drop-shadow(0 4px 7px #001018cc) drop-shadow(0 0 7px #ffd34d66)}
#fleet{display:flex!important;flex-direction:column;gap:5px!important}
.cascadeFleetRow{display:flex;align-items:center;gap:4px;min-height:27px;padding:1px 2px;border-radius:7px;background:#062f4666;border:1px solid #ffffff12;overflow:hidden}
.cascadeFleetRow.sunk{opacity:.34;filter:grayscale(.7)}
.cascadeFleetThumb{position:relative;flex:0 0 60px;height:20px;overflow:hidden;border-radius:5px}
.cascadeFleetSprite{position:absolute;inset:0;background-image:url('${ATLAS}');background-size:100% 500%;background-repeat:no-repeat;background-position-x:center;filter:drop-shadow(0 1px 2px #001820bb);image-rendering:auto}
.cascadeFleetRow.boss .cascadeFleetThumb{flex-basis:64px;height:22px}
.cascadeFleetRow.boss .cascadeFleetSprite{filter:drop-shadow(0 1px 3px #001018cc) drop-shadow(0 0 6px #ffd34d77)}
.cascadeFleetPips{display:flex;gap:2px;flex-wrap:nowrap;min-width:0}
.cascadeFleetPip{width:5px;height:5px;border-radius:50%;border:1px solid #d6f6ff99;background:#d6f6ff22;box-sizing:border-box}
.cascadeFleetPip.hit{background:#ff765f;border-color:#ffc0b6}
.cascadeFleetPip.armor{background:#ffd768;border-color:#fff0a7}
.cascadeBossZoneArt,.cascadeBossModalArt{position:relative;overflow:visible;margin-left:auto;margin-right:auto}
.cascadeBossZoneArt{width:180px;height:60px;margin-top:-6px;margin-bottom:-7px}
.cascadeBossModalArt{width:min(96%,420px);aspect-ratio:3/1;margin-top:5px;margin-bottom:9px}
.cascadeBossZoneArt .cascadeSprite,.cascadeBossModalArt .cascadeSprite{position:absolute;inset:0;background-image:url('${ATLAS}');background-size:100% 500%;background-position:center 100%;background-repeat:no-repeat;filter:drop-shadow(0 4px 8px #001018aa);image-rendering:auto}
`;
document.head.appendChild(style);
const rowFor=len=>Math.max(0,Math.min(4,len-2))*25;
let lastSig='',lastGridCell=null;
function snapshot(){try{return window.__qa?.snapshot?.()}catch(e){return null}}
function sig(s){return JSON.stringify([s?.zone,s?.mode,s?.N,(s?.ships||[]).map(x=>[x.id,x.sunk,(x.hits||[]).join('|'),JSON.stringify(x.armorDamage||{})])])}
function sprite(len,cls){const d=document.createElement('div');d.className=cls;d.style.backgroundPositionY=rowFor(len)+'%';return d}
function buildShip(s,N,cells,grid,gr){
 if(!s?.sunk||!s.cells?.length)return;
 const els=s.cells.map(([r,c])=>cells[r*N+c]).filter(Boolean);if(els.length!==s.cells.length)return;
 const rs=els.map(e=>e.getBoundingClientRect()),horizontal=s.cells.every(p=>p[0]===s.cells[0][0]);
 const minL=Math.min(...rs.map(r=>r.left)),maxR=Math.max(...rs.map(r=>r.right)),minT=Math.min(...rs.map(r=>r.top)),maxB=Math.max(...rs.map(r=>r.bottom));
 const cw=rs[0].width,cx=(minL+maxR)/2-gr.left,cy=(minT+maxB)/2-gr.top;
 const span=horizontal?(maxR-minL):(maxB-minT);
 const d=document.createElement('div');d.className='cascadeShipArt '+(horizontal?'horizontal':'vertical')+(s.boss?' boss':'');d.dataset.ship=String(s.id);
 Object.assign(d.style,{left:cx+'px',top:cy+'px',width:Math.max(38,span-cw*.05)+'px',height:Math.max(18,span/3)+'px'});
 d.appendChild(sprite(s.len,'cascadeBoardSprite'));grid.appendChild(d);
}
function syncBoard(s){
 const grid=document.getElementById('grid');if(!grid||!s?.N)return;
 grid.querySelectorAll('.cascadeShipArt').forEach(x=>x.remove());
 const cells=[...grid.querySelectorAll('.cell')];if(cells.length<s.N*s.N)return;
 const gr=grid.getBoundingClientRect();(s.ships||[]).forEach(ship=>buildShip(ship,s.N,cells,grid,gr));
}
function syncFleet(s){
 const f=document.getElementById('fleet');if(!f||!s?.ships)return;
 f.querySelectorAll('.cascadeFleetRow').forEach(x=>x.remove());
 (s.ships||[]).forEach(ship=>{
  const row=document.createElement('div');row.className='cascadeFleetRow'+(ship.sunk?' sunk':'')+(ship.boss?' boss':'');
  const thumb=document.createElement('div');thumb.className='cascadeFleetThumb';thumb.appendChild(sprite(ship.len,'cascadeFleetSprite'));
  const pips=document.createElement('div');pips.className='cascadeFleetPips';
  for(let i=0;i<ship.len;i++){const p=document.createElement('span');p.className='cascadeFleetPip';const k=ship.cells?.[i]?.join(',');if(k&&ship.hits?.includes(k))p.classList.add('hit');else if(k&&ship.armor?.includes(k)&&!ship.armorDamage?.[k])p.classList.add('armor');pips.appendChild(p)}
  row.append(thumb,pips);f.appendChild(row);
 });
}
function bossBlock(cls){const d=document.createElement('div');d.className=cls;d.appendChild(sprite(6,'cascadeSprite'));return d}
function syncBoss(s){
 const sub=document.getElementById('zoneSub');document.querySelectorAll('.cascadeBossZoneArt').forEach(x=>x.remove());
 if(sub&&s?.mode==='campaign'&&s.zone%5===0)sub.appendChild(bossBlock('cascadeBossZoneArt'));
 const box=document.getElementById('modalBox');if(box&&/(JEFE|TITÁN)/i.test(box.textContent||'')&&!box.querySelector('.cascadeBossModalArt')){const d=bossBlock('cascadeBossModalArt'),h=box.querySelector('h2');h?h.after(d):box.prepend(d)}
}
function sync(s){syncBoard(s);syncFleet(s);syncBoss(s);lastSig=sig(s);lastGridCell=document.querySelector('#grid .cell')}
function tick(){
 const s=snapshot(),first=document.querySelector('#grid .cell');if(!s||!first)return;
 const expected=(s.ships||[]).filter(x=>x.sunk).length,have=document.querySelectorAll('#grid .cascadeShipArt').length;
 const fleetHave=document.querySelectorAll('#fleet .cascadeFleetRow').length;
 if(sig(s)!==lastSig||first!==lastGridCell||have!==expected||fleetHave!==(s.ships||[]).length)sync(s);
}
window.addEventListener('resize',()=>{const s=snapshot();if(s)sync(s)},{passive:true});
setTimeout(tick,100);setInterval(tick,120);
})();