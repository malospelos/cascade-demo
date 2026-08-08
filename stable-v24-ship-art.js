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
.fleetPanel{position:relative!important;min-width:138px!important;padding:10px 10px 12px!important;border-radius:20px!important;background:linear-gradient(180deg,#05263de8,#021726ee)!important;border:1px solid #a5efff2f!important;box-shadow:0 8px 22px #00192366,inset 0 1px 0 #ffffff12!important}
.fleetLabel{text-align:left!important;padding:2px 6px 8px!important;font-size:13px!important;font-weight:900!important;letter-spacing:2.8px!important;color:#f4fbff!important;text-shadow:0 2px 4px #00131d!important}
#fleet{display:none!important}
#cascadeFleetStable{display:flex!important;flex-direction:column;gap:9px!important}
.cascadeFleetRow{position:relative;display:flex;flex-direction:column;align-items:stretch;gap:7px;min-height:64px;padding:8px 10px 9px;border-radius:16px;background:linear-gradient(180deg,#0c4663e6,#083854e6);border:1px solid #96ebff42;box-shadow:inset 0 1px 0 #ffffff18,0 3px 10px #00162438;overflow:hidden;transition:opacity .2s ease,filter .2s ease,border-color .2s ease,box-shadow .2s ease}
.cascadeFleetRow::before{content:'';position:absolute;inset:0;border-radius:inherit;background:radial-gradient(circle at 18% 18%,#9df8ff12 0%,transparent 46%),linear-gradient(180deg,transparent,#00111b10);pointer-events:none}
.cascadeFleetRow.sunk{opacity:.42;filter:saturate(.45) brightness(.82)}
.cascadeFleetRow.boss{border-color:#ffd96d66;background:linear-gradient(180deg,#244f66f0,#0a394de8);box-shadow:inset 0 1px 0 #ffffff18,0 3px 10px #00162438,0 0 0 1px #ffe18c14}
.cascadeFleetThumb{position:relative;width:100%;height:40px;overflow:visible;border-radius:8px}
.cascadeFleetSprite{position:absolute;left:0;right:0;top:-6px;bottom:-5px;background-image:url('${ATLAS}');background-size:100% 500%;background-repeat:no-repeat;background-position-x:center;filter:drop-shadow(0 3px 4px #001820c8) drop-shadow(0 0 10px #8af0ff22);image-rendering:auto}
.cascadeFleetRow.boss .cascadeFleetSprite{filter:drop-shadow(0 3px 5px #001018d9) drop-shadow(0 0 8px #ffd34d44)}
.cascadeFleetSegments{display:flex;align-items:center;justify-content:stretch;gap:10px;width:100%;padding:0 2px}
.cascadeFleetSegment{flex:1 1 0;height:4px;border-radius:999px;background:linear-gradient(180deg,#f8ffff,#c7f5ff 58%,#7ce0ff);box-shadow:0 0 7px #8befff85,0 0 1px #ffffffaa}
.cascadeFleetRow.sunk .cascadeFleetSegment{background:linear-gradient(180deg,#7ca0ad,#55707d 58%,#365160);box-shadow:0 0 0 transparent,0 0 1px #6f8796aa}
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
 s.ships.forEach((ship,i)=>{
  const row=rows[i];if(!row)return;
  row.classList.toggle('sunk',!!ship.sunk);row.classList.toggle('boss',!!ship.boss);
  const thumb=row.querySelector('.cascadeFleetThumb');
  if(thumb){
   const h=Math.max(38,Math.min(54,26+ship.len*4));
   thumb.style.height=h+'px';
   const spriteEl=thumb.querySelector('.cascadeFleetSprite');
   if(spriteEl){
    spriteEl.style.backgroundPositionY=rowFor(ship.len)+'%';
    const extra=Math.max(4,ship.len*2);
    spriteEl.style.left=(-extra)+'px';
    spriteEl.style.right=(-extra)+'px';
    spriteEl.style.top='-'+Math.round(h*.18)+'px';
    spriteEl.style.bottom='-'+Math.round(h*.10)+'px';
   }
  }
 });
}
function bossBlock(cls){const d=document.createElement('div');d.className=cls;d.appendChild(sprite(6,'cascadeSprite'));return d}
function syncBoss(s){const key=(s?.mode||'')+':'+(s?.zone||0);if(key===lastBossKey)return;lastBossKey=key;document.querySelectorAll('.cascadeBossZoneArt').forEach(x=>x.remove());const sub=document.getElementById('zoneSub');if(sub&&s?.mode==='campaign'&&s.zone%5===0)sub.appendChild(bossBlock('cascadeBossZoneArt'))}
function syncBossModal(){const box=document.getElementById('modalBox');if(box&&/(JEFE|TITÁN)/i.test(box.textContent||'')&&!box.querySelector('.cascadeBossModalArt')){const d=bossBlock('cascadeBossModalArt'),h=box.querySelector('h2');h?h.after(d):box.prepend(d)}}
function tick(){const s=snapshot();if(!s)return;const bk=boardKey(s),gk=geomKey();if(bk!==lastBoardKey||gk!==lastGeom)syncBoard(s);updateFleet(s);syncBoss(s);syncBossModal()}
window.addEventListener('resize',()=>{lastGeom='';tick()},{passive:true});window.addEventListener('scroll',()=>{lastGeom='';tick()},{passive:true});
setTimeout(tick,80);setInterval(tick,120);
})();