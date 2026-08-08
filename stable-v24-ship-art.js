(()=>{
'use strict';
const HQ=window.__CASCADE_ATLAS_HQ||'';
const ATLAS=HQ.length===72967?HQ:'cascade-ship-atlas.webp?v=1';
const style=document.createElement('style');
style.textContent=`
#grid .cell.sunk{font-size:0!important;color:transparent!important}
#cascadeShipLayer{position:fixed;inset:0;z-index:30;pointer-events:none;overflow:visible}
.cascadeShipArt{position:absolute;pointer-events:none;transform-origin:center center;overflow:visible}
.cascadeShipArt.horizontal{transform:translate(-50%,-50%)}
.cascadeShipArt.vertical{transform:translate(-50%,-50%) rotate(90deg)}
.cascadeBoardSprite{position:absolute;inset:0;background-image:url('${ATLAS}');background-size:100% 500%;background-repeat:no-repeat;background-position-x:center;filter:drop-shadow(0 3px 5px #001820aa);image-rendering:auto}
.cascadeShipArt.boss .cascadeBoardSprite{filter:drop-shadow(0 4px 7px #001018cc) drop-shadow(0 0 7px #ffd34d66)}
.fleetPanel{position:absolute!important;left:3px!important;top:48%!important;transform:translateY(-50%)!important;width:72px!important;min-width:0!important;padding:6px 4px!important;border:2px solid #0e2130!important;border-radius:13px!important;background:linear-gradient(#083d59ed,#052d43ed)!important;box-shadow:0 8px 18px #00283e88!important;z-index:15!important}
.fleetLabel{text-align:center!important;padding:0 0 4px!important;font-size:8px!important;font-weight:1000!important;letter-spacing:1px!important;color:#bfe9f5!important;text-shadow:none!important}
#fleet{display:none!important}
#cascadeFleetStable{display:flex!important;flex-direction:column!important;gap:3px!important;padding:0!important}
.cascadeFleetRow{position:relative!important;display:flex!important;flex-direction:column!important;align-items:stretch!important;gap:2px!important;min-height:32px!important;padding:2px 3px 3px!important;border-radius:7px!important;background:#0a425d7a!important;border:1px solid #ffffff10!important;box-shadow:none!important;overflow:hidden!important;transition:opacity .2s ease,filter .2s ease!important}
.cascadeFleetRow::before{display:none!important}
.cascadeFleetRow.sunk{opacity:.3!important;filter:grayscale(.8)!important}
.cascadeFleetRow.boss{border-color:#ffd06633!important;background:#5b292433!important}
.cascadeFleetThumb{position:relative!important;width:100%!important;height:21px!important;overflow:hidden!important;border-radius:5px!important}
.cascadeFleetSprite{position:absolute!important;left:-3px!important;right:-3px!important;top:-3px!important;bottom:-3px!important;background-image:url('${ATLAS}');background-size:100% 500%;background-repeat:no-repeat;background-position-x:center;filter:drop-shadow(0 1px 2px #001820bb)!important;image-rendering:auto}
.cascadeFleetRow.boss .cascadeFleetSprite{filter:drop-shadow(0 1px 3px #001018cc) drop-shadow(0 0 4px #ffd34d55)!important}
.cascadeFleetSegments{display:flex!important;align-items:center!important;gap:2px!important;width:100%!important;padding:0 1px!important}
.cascadeFleetSegment{flex:1 1 0!important;height:2px!important;border-radius:999px!important;background:#d8f8ff!important;box-shadow:0 0 4px #8befff66!important}
.cascadeFleetRow.sunk .cascadeFleetSegment{background:#55717d!important;box-shadow:none!important}
@media(max-height:700px){
 .fleetPanel{width:62px!important;padding:5px 3px!important}
 .fleetLabel{font-size:7px!important;padding-bottom:3px!important}
 #cascadeFleetStable{gap:2px!important}
 .cascadeFleetRow{min-height:28px!important;padding:2px!important}
 .cascadeFleetThumb{height:18px!important}
}
@media(max-width:390px){
 .fleetPanel{left:1px!important;width:58px!important}
 .cascadeFleetThumb{height:17px!important}
 .cascadeFleetSegments{gap:1px!important}
}
.cascadeBossZoneArt,.cascadeBossModalArt{position:relative;overflow:visible;margin-left:auto;margin-right:auto}
.cascadeBossZoneArt{width:180px;height:60px;margin-top:-6px;margin-bottom:-7px}
.cascadeBossModalArt{width:min(96%,420px);aspect-ratio:3/1;margin-top:5px;margin-bottom:9px}
.cascadeBossZoneArt .cascadeSprite,.cascadeBossModalArt .cascadeSprite{position:absolute;inset:0;background-image:url('${ATLAS}');background-size:100% 500%;background-position:center 100%;background-repeat:no-repeat;filter:drop-shadow(0 4px 8px #001018aa);image-rendering:auto}
`;
document.head.appendChild(style);
const rowFor=len=>Math.max(0,Math.min(4,len-2))*25;
let lastBoardKey='',lastGeom='',lastFleetShape='',lastBossKey='';
function snapshot(){try{return window.__qa?.snapshot?.()}catch(e){return null}}
function sprite(len,cls){const d=document.createElement('div');d.className=cls;d.style.backgroundPositionY=rowFor(len)+'%';return d}
function ensureShipLayer(){let l=document.getElementById('cascadeShipLayer');if(!l){l=document.createElement('div');l.id='cascadeShipLayer';document.body.appendChild(l)}return l}
function ensureFleet(){const panel=document.querySelector('.fleetPanel');if(!panel)return null;let f=document.getElementById('cascadeFleetStable');if(!f){f=document.createElement('div');f.id='cascadeFleetStable';panel.appendChild(f)}return f}
function boardKey(s){return JSON.stringify([s?.zone,s?.mode,s?.N,(s?.ships||[]).filter(x=>x.sunk).map(x=>[x.id,x.len,x.boss,x.cells])])}
function geomKey(){const g=document.getElementById('grid')?.getBoundingClientRect();return g?[Math.round(g.left),Math.round(g.top),Math.round(g.width),Math.round(g.height)].join(':'):''}
function buildShip(ship,N,cells,layer){
 if(!ship?.sunk||!ship.cells?.length)return;
 const els=ship.cells.map(([r,c])=>cells[r*N+c]).filter(Boolean);if(els.length!==ship.cells.length)return;
 const rs=els.map(e=>e.getBoundingClientRect()),horizontal=ship.cells.every(p=>p[0]===ship.cells[0][0]);
 const minL=Math.min(...rs.map(r=>r.left)),maxR=Math.max(...rs.map(r=>r.right)),minT=Math.min(...rs.map(r=>r.top)),maxB=Math.max(...rs.map(r=>r.bottom));
 const cellW=rs[0].width,cellH=rs[0].height,span=horizontal?(maxR-minL):(maxB-minT);
 const d=document.createElement('div');d.className='cascadeShipArt '+(horizontal?'horizontal':'vertical')+(ship.boss?' boss':'');d.dataset.ship=String(ship.id);
 Object.assign(d.style,{left:((minL+maxR)/2)+'px',top:((minT+maxB)/2)+'px',width:(span+(horizontal?cellW*.34:cellH*.34))+'px',height:Math.max(24,(horizontal?cellH:cellW)*1.02)+'px'});
 d.appendChild(sprite(ship.len,'cascadeBoardSprite'));layer.appendChild(d);
}
function syncBoard(s){const grid=document.getElementById('grid'),layer=ensureShipLayer();if(!grid||!layer||!s?.N)return;const cells=[...grid.querySelectorAll('.cell')];if(cells.length<s.N*s.N)return;layer.replaceChildren();(s.ships||[]).forEach(ship=>buildShip(ship,s.N,cells,layer));lastBoardKey=boardKey(s);lastGeom=geomKey()}
function createFleetRow(ship){
 const row=document.createElement('div');row.className='cascadeFleetRow';row.dataset.ship=String(ship.id);
 const thumb=document.createElement('div');thumb.className='cascadeFleetThumb';thumb.appendChild(sprite(ship.len,'cascadeFleetSprite'));
 const segments=document.createElement('div');segments.className='cascadeFleetSegments';
 for(let i=0;i<ship.len;i++){const seg=document.createElement('span');seg.className='cascadeFleetSegment';segments.appendChild(seg)}
 row.append(thumb,segments);return row
}
function updateFleet(s){
 const f=ensureFleet();if(!f||!s?.ships)return;
 const shape=JSON.stringify(s.ships.map(x=>[x.id,x.len,x.boss]));
 if(shape!==lastFleetShape){f.replaceChildren(...s.ships.map(createFleetRow));lastFleetShape=shape}
 const rows=[...f.querySelectorAll('.cascadeFleetRow')];
 s.ships.forEach((ship,i)=>{const row=rows[i];if(!row)return;row.classList.toggle('sunk',!!ship.sunk);row.classList.toggle('boss',!!ship.boss)});
}
function bossBlock(cls){const d=document.createElement('div');d.className=cls;d.appendChild(sprite(6,'cascadeSprite'));return d}
function syncBoss(s){const key=(s?.mode||'')+':'+(s?.zone||0);if(key===lastBossKey)return;lastBossKey=key;document.querySelectorAll('.cascadeBossZoneArt').forEach(x=>x.remove());const sub=document.getElementById('zoneSub');if(sub&&s?.mode==='campaign'&&s.zone%5===0)sub.appendChild(bossBlock('cascadeBossZoneArt'))}
function syncBossModal(){const box=document.getElementById('modalBox');if(box&&/(JEFE|TITÁN)/i.test(box.textContent||'')&&!box.querySelector('.cascadeBossModalArt')){const d=bossBlock('cascadeBossModalArt'),h=box.querySelector('h2');h?h.after(d):box.prepend(d)}}
function tick(){const s=snapshot();if(!s)return;const bk=boardKey(s),gk=geomKey();if(bk!==lastBoardKey||gk!==lastGeom)syncBoard(s);updateFleet(s);syncBoss(s);syncBossModal()}
window.addEventListener('resize',()=>{lastGeom='';tick()},{passive:true});window.addEventListener('scroll',()=>{lastGeom='';tick()},{passive:true});
setTimeout(tick,80);setInterval(tick,120);
})();