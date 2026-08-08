(()=>{
'use strict';
const HQ=window.__CASCADE_ATLAS_HQ||'';
const ATLAS=HQ.length===72967?HQ:'cascade-ship-atlas.webp?v=1';
if(HQ&&HQ.length!==72967)console.error('Atlas HQ incompleto:',HQ.length);
const style=document.createElement('style');
style.textContent=`
.boardStage{position:relative!important}
#grid{position:relative!important}
#grid .cell.sunk{font-size:0!important;color:transparent!important}
#cascadeShipLayer{position:absolute;z-index:7;pointer-events:none;overflow:visible}
.cascadeShipArt{position:absolute;pointer-events:none;transform-origin:center center;overflow:visible}
.cascadeShipArt.horizontal{transform:translate(-50%,-50%)}
.cascadeShipArt.vertical{transform:translate(-50%,-50%) rotate(90deg)}
.cascadeBoardSprite{position:absolute;inset:0;background-image:url('${ATLAS}');background-size:100% 500%;background-repeat:no-repeat;background-position-x:center;filter:drop-shadow(0 3px 5px #001820aa);image-rendering:auto}
.cascadeShipArt.boss .cascadeBoardSprite{filter:drop-shadow(0 4px 7px #001018cc) drop-shadow(0 0 7px #ffd34d66)}
.fleetPanel{position:relative!important}
#fleet{display:none!important}
#cascadeFleetStable{display:flex!important;flex-direction:column;gap:5px!important}
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
let lastBoardKey='',lastGeometryKey='',lastFleetShape='',lastBossKey='';
function snapshot(){try{return window.__qa?.snapshot?.()}catch(e){return null}}
function sprite(len,cls){const d=document.createElement('div');d.className=cls;d.style.backgroundPositionY=rowFor(len)+'%';return d}
function ensureShipLayer(){
 const stage=document.querySelector('.boardStage'),grid=document.getElementById('grid');if(!stage||!grid)return null;
 let layer=document.getElementById('cascadeShipLayer');if(!layer){layer=document.createElement('div');layer.id='cascadeShipLayer';stage.appendChild(layer)}
 const g=grid.getBoundingClientRect(),st=stage.getBoundingClientRect();
 Object.assign(layer.style,{left:(g.left-st.left)+'px',top:(g.top-st.top)+'px',width:g.width+'px',height:g.height+'px'});
 return layer;
}
function ensureFleet(){const panel=document.querySelector('.fleetPanel');if(!panel)return null;let f=document.getElementById('cascadeFleetStable');if(!f){f=document.createElement('div');f.id='cascadeFleetStable';panel.appendChild(f)}return f}
function boardKey(s){return JSON.stringify([s?.zone,s?.mode,s?.N,(s?.ships||[]).filter(x=>x.sunk).map(x=>[x.id,x.len,x.boss,x.cells])])}
function geometryKey(){const grid=document.getElementById('grid');if(!grid)return '';const g=grid.getBoundingClientRect();return [Math.round(g.left),Math.round(g.top),Math.round(g.width),Math.round(g.height)].join(':')}
function buildShip(s,N,cells,layer){
 if(!s?.sunk||!s.cells?.length)return;
 const els=s.cells.map(([r,c])=>cells[r*N+c]).filter(Boolean);if(els.length!==s.cells.length)return;
 const rs=els.map(e=>e.getBoundingClientRect()),horizontal=s.cells.every(p=>p[0]===s.cells[0][0]);
 const minL=Math.min(...rs.map(r=>r.left)),maxR=Math.max(...rs.map(r=>r.right)),minT=Math.min(...rs.map(r=>r.top)),maxB=Math.max(...rs.map(r=>r.bottom));
 const cellW=rs[0].width,cellH=rs[0].height,lr=layer.getBoundingClientRect();
 const cx=(minL+maxR)/2-lr.left,cy=(minT+maxB)/2-lr.top;
 const span=horizontal?(maxR-minL):(maxB-minT);
 const mainSize=span+(horizontal?cellW*.34:cellH*.34);
 const crossSize=Math.max(horizontal?cellH*1.12:cellW*1.12,26);
 const d=document.createElement('div');d.className='cascadeShipArt '+(horizontal?'horizontal':'vertical')+(s.boss?' boss':'');d.dataset.ship=String(s.id);
 Object.assign(d.style,{left:cx+'px',top:cy+'px',width:mainSize+'px',height:crossSize+'px'});
 d.appendChild(sprite(s.len,'cascadeBoardSprite'));layer.appendChild(d);
}
function syncBoard(s){const grid=document.getElementById('grid'),layer=ensureShipLayer();if(!grid||!layer||!s?.N)return;const cells=[...grid.querySelectorAll('.cell')];if(cells.length<s.N*s.N)return;layer.replaceChildren();(s.ships||[]).forEach(ship=>buildShip(ship,s.N,cells,layer));lastBoardKey=boardKey(s);lastGeometryKey=geometryKey()}
function createFleetRow(ship){const row=document.createElement('div');row.className='cascadeFleetRow';row.dataset.ship=String(ship.id);const thumb=document.createElement('div');thumb.className='cascadeFleetThumb';thumb.appendChild(sprite(ship.len,'cascadeFleetSprite'));const pips=document.createElement('div');pips.className='cascadeFleetPips';for(let i=0;i<ship.len;i++){const p=document.createElement('span');p.className='cascadeFleetPip';pips.appendChild(p)}row.append(thumb,pips);return row}
function updateFleet(s){const f=ensureFleet();if(!f||!s?.ships)return;const shape=JSON.stringify((s.ships||[]).map(x=>[x.id,x.len,x.boss]));if(shape!==lastFleetShape){f.replaceChildren(...s.ships.map(createFleetRow));lastFleetShape=shape}const rows=[...f.querySelectorAll('.cascadeFleetRow')];s.ships.forEach((ship,i)=>{const row=rows[i];if(!row)return;row.classList.toggle('sunk',!!ship.sunk);row.classList.toggle('boss',!!ship.boss);const pips=[...row.querySelectorAll('.cascadeFleetPip')];pips.forEach((p,j)=>{const k=ship.cells?.[j]?.join(',');p.classList.toggle('hit',!!(k&&ship.hits?.includes(k)));p.classList.toggle('armor',!!(k&&ship.armor?.includes(k)&&!ship.armorDamage?.[k]))})})}
function bossBlock(cls){const d=document.createElement('div');d.className=cls;d.appendChild(sprite(6,'cascadeSprite'));return d}
function syncBoss(s){const key=(s?.mode||'')+':'+(s?.zone||0);if(key===lastBossKey)return;lastBossKey=key;document.querySelectorAll('.cascadeBossZoneArt').forEach(x=>x.remove());const sub=document.getElementById('zoneSub');if(sub&&s?.mode==='campaign'&&s.zone%5===0)sub.appendChild(bossBlock('cascadeBossZoneArt'))}
function syncBossModal(){const box=document.getElementById('modalBox');if(box&&/(JEFE|TITÁN)/i.test(box.textContent||'')&&!box.querySelector('.cascadeBossModalArt')){const d=bossBlock('cascadeBossModalArt'),h=box.querySelector('h2');h?h.after(d):box.prepend(d)}}
function tick(){const s=snapshot();if(!s)return;const bk=boardKey(s),gk=geometryKey();if(bk!==lastBoardKey||gk!==lastGeometryKey)syncBoard(s);updateFleet(s);syncBoss(s);syncBossModal()}
window.addEventListener('resize',()=>{lastGeometryKey='';tick()},{passive:true});
setTimeout(tick,80);setInterval(tick,120);
})();