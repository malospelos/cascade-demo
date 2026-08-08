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
.fleetPanel{position:relative!important;min-width:116px!important;padding:8px 8px 9px!important;border-radius:15px!important;background:linear-gradient(180deg,#07334ce8,#041e31e8)!important;border:1px solid #8fddec33!important;box-shadow:0 8px 22px #00192366,inset 0 1px 0 #ffffff12!important}
.fleetLabel{text-align:left!important;padding:0 4px 6px!important;font-size:10px!important;letter-spacing:1.4px!important;color:#d8f7ff!important;text-shadow:0 1px 2px #00131d!important}
#fleet{display:none!important}
#cascadeFleetStable{display:flex!important;flex-direction:column;gap:6px!important}
.cascadeFleetRow{position:relative;display:grid;grid-template-columns:64px 1fr;align-items:center;gap:8px;min-height:38px;padding:4px 5px;border-radius:10px;background:linear-gradient(180deg,#0b4865cc,#07374dcc);border:1px solid #9ce9f433;box-shadow:inset 0 1px 0 #ffffff10;overflow:hidden;transition:opacity .2s ease,filter .2s ease}
.cascadeFleetRow.sunk{opacity:.36;filter:grayscale(.8)}
.cascadeFleetRow.boss{border-color:#ffd96d55;background:linear-gradient(180deg,#5e4a1f55,#07374dcc)}
.cascadeFleetThumb{position:relative;width:64px;height:28px;overflow:visible;border-radius:7px}
.cascadeFleetSprite{position:absolute;left:-3px;right:-3px;top:-4px;bottom:-4px;background-image:url('${ATLAS}');background-size:100% 500%;background-repeat:no-repeat;background-position-x:center;filter:drop-shadow(0 2px 3px #001820cc);image-rendering:auto}
.cascadeFleetRow.boss .cascadeFleetSprite{filter:drop-shadow(0 2px 4px #001018dd) drop-shadow(0 0 7px #ffd34d77)}
.cascadeFleetPips{display:flex;gap:4px;flex-wrap:nowrap;align-items:center;justify-content:flex-start;min-width:0}
.cascadeFleetPip{width:9px;height:9px;border-radius:50%;border:1px solid #d6f6ffbb;background:#d6f6ff24;box-sizing:border-box;box-shadow:0 0 3px #8fefff22}
.cascadeFleetPip.hit{background:#ff765f;border-color:#ffc0b6;box-shadow:0 0 6px #ff6b5555}
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
 Object.assign(d.style,{left:((minL+maxR)/2)+'px',top:((minT+maxB)/2)+'px',width:(span+(horizontal?cellW*.18:cellH*.18))+'px',height:Math.max(24,(horizontal?cellH:cellW)*.92)+'px'});
 d.appendChild(sprite(ship.len,'cascadeBoardSprite'));layer.appendChild(d);
}
function syncBoard(s){const grid=document.getElementById('grid'),layer=ensureShipLayer();if(!grid||!layer||!s?.N)return;const cells=[...grid.querySelectorAll('.cell')];if(cells.length<s.N*s.N)return;layer.replaceChildren();(s.ships||[]).forEach(ship=>buildShip(ship,s.N,cells,layer));lastBoardKey=boardKey(s);lastGeom=geomKey()}
function createFleetRow(ship){
 const row=document.createElement('div');row.className='cascadeFleetRow';row.dataset.ship=String(ship.id);
 const thumb=document.createElement('div');thumb.className='cascadeFleetThumb';thumb.appendChild(sprite(ship.len,'cascadeFleetSprite'));
 const pips=document.createElement('div');pips.className='cascadeFleetPips';
 for(let i=0;i<ship.len;i++){const p=document.createElement('span');p.className='cascadeFleetPip';pips.appendChild(p)}
 row.append(thumb,pips);return row
}
function updateFleet(s){
 const f=ensureFleet();if(!f||!s?.ships)return;
 const shape=JSON.stringify(s.ships.map(x=>[x.id,x.len,x.boss]));
 if(shape!==lastFleetShape){f.replaceChildren(...s.ships.map(createFleetRow));lastFleetShape=shape}
 const rows=[...f.querySelectorAll('.cascadeFleetRow')];
 s.ships.forEach((ship,i)=>{
  const row=rows[i];if(!row)return;
  row.classList.toggle('sunk',!!ship.sunk);row.classList.toggle('boss',!!ship.boss);
  const pips=[...row.querySelectorAll('.cascadeFleetPip')];
  let damage=Array.isArray(ship.hits)?ship.hits.length:0;
  if(ship.armorDamage&&typeof ship.armorDamage==='object')damage+=Object.values(ship.armorDamage).filter(v=>v>0).length;
  damage=Math.max(0,Math.min(ship.len,damage));
  pips.forEach((p,j)=>p.classList.toggle('hit',j<damage));
 });
}
function bossBlock(cls){const d=document.createElement('div');d.className=cls;d.appendChild(sprite(6,'cascadeSprite'));return d}
function syncBoss(s){const key=(s?.mode||'')+':'+(s?.zone||0);if(key===lastBossKey)return;lastBossKey=key;document.querySelectorAll('.cascadeBossZoneArt').forEach(x=>x.remove());const sub=document.getElementById('zoneSub');if(sub&&s?.mode==='campaign'&&s.zone%5===0)sub.appendChild(bossBlock('cascadeBossZoneArt'))}
function syncBossModal(){const box=document.getElementById('modalBox');if(box&&/(JEFE|TITÁN)/i.test(box.textContent||'')&&!box.querySelector('.cascadeBossModalArt')){const d=bossBlock('cascadeBossModalArt'),h=box.querySelector('h2');h?h.after(d):box.prepend(d)}}
function tick(){const s=snapshot();if(!s)return;const bk=boardKey(s),gk=geomKey();if(bk!==lastBoardKey||gk!==lastGeom)syncBoard(s);updateFleet(s);syncBoss(s);syncBossModal()}
window.addEventListener('resize',()=>{lastGeom='';tick()},{passive:true});window.addEventListener('scroll',()=>{lastGeom='';tick()},{passive:true});
setTimeout(tick,80);setInterval(tick,120);
})();