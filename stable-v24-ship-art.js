(()=>{
'use strict';
const ATLAS='cascade-ship-atlas.webp?v=1';
const style=document.createElement('style');
style.textContent=`
#grid{position:relative!important}
#grid .cell.sunk{font-size:0!important;color:transparent!important}
#fleet>.shipRow{display:none!important}
.cascadeShipArt{position:absolute;z-index:7;pointer-events:none;transform-origin:center center}
.cascadeShipArt.horizontal{transform:translate(-50%,-50%)}
.cascadeShipArt.vertical{transform:translate(-50%,-50%) rotate(90deg)}
.cascadeHull{position:absolute;inset:8% 1%;border-radius:55% 48% 48% 55%/52% 48% 48% 52%;background:linear-gradient(180deg,#e8f1f3 0%,#84969e 38%,#43545c 62%,#1d2f37 100%);border:1px solid #d8f4f8;box-shadow:0 2px 4px #001821aa,inset 0 3px 3px #ffffff55,inset 0 -4px 5px #00131c99;overflow:visible}
.cascadeHull:before{content:'';position:absolute;width:18%;height:58%;left:43%;top:-33%;border-radius:45% 45% 28% 28%;background:linear-gradient(90deg,#536971,#dce7e9 48%,#536971);border:1px solid #cce7eb;box-shadow:0 2px 3px #00182188}
.cascadeHull:after{content:'';position:absolute;left:18%;right:14%;top:42%;height:18%;background:radial-gradient(circle,#72f3ff 0 28%,#173e49 31% 48%,transparent 52%) 0 50%/22% 100% repeat-x;opacity:.88}
.cascadeShipArt:after{content:'';position:absolute;left:7%;right:5%;bottom:-3%;height:16%;border-radius:50%;background:radial-gradient(ellipse at center,#d9fbffbb 0 15%,#6de4f26b 38%,transparent 72%);filter:blur(1px)}
.cascadeShipArt.boss .cascadeHull{background:linear-gradient(180deg,#fff2c2 0%,#ad8a42 17%,#8b9ca1 35%,#3b4b52 67%,#182930 100%);border-color:#ffe58d;box-shadow:0 2px 5px #001821cc,0 0 8px #ffd34d55,inset 0 3px 3px #fff6cc88,inset 0 -4px 5px #00131caa}
.cascadeShipArt.boss .cascadeHull:before{height:72%;top:-42%;background:linear-gradient(90deg,#775c28,#e9d187 48%,#775c28);border-color:#ffe39a}
#fleet{display:flex!important;flex-direction:column;gap:5px!important}
.cascadeFleetRow{display:flex;align-items:center;gap:5px;min-height:25px;padding:2px 3px;border-radius:7px;background:#062f4666;border:1px solid #ffffff12;overflow:hidden}
.cascadeFleetRow.sunk{opacity:.34;filter:grayscale(.85)}
.cascadeFleetThumb{position:relative;flex:0 0 48px;height:20px}
.cascadeFleetThumb .miniHull{position:absolute;left:2px;right:2px;top:5px;bottom:3px;border-radius:55% 48% 48% 55%/52% 48% 48% 52%;background:linear-gradient(180deg,#dce8eb,#73868e 45%,#263941 100%);border:1px solid #cce9ee;box-shadow:0 1px 2px #001821aa}
.cascadeFleetThumb .miniHull:before{content:'';position:absolute;width:18%;height:65%;left:43%;top:-45%;border-radius:4px 4px 2px 2px;background:#9fafb5;border:1px solid #d9edef}
.cascadeFleetRow.boss .miniHull{background:linear-gradient(180deg,#f4df9a,#9f8545 24%,#687980 48%,#263941 100%);border-color:#ffe597;box-shadow:0 0 5px #ffd34d55}
.cascadeFleetPips{display:flex;gap:2px;flex-wrap:nowrap;min-width:0}
.cascadeFleetPip{width:6px;height:6px;border-radius:50%;border:1px solid #d6f6ff99;background:#d6f6ff22;box-sizing:border-box}
.cascadeFleetPip.hit{background:#ff765f;border-color:#ffc0b6}
.cascadeFleetPip.armor{background:#ffd768;border-color:#fff0a7}
.cascadeBossZoneArt,.cascadeBossModalArt{position:relative;overflow:hidden;margin-left:auto;margin-right:auto;border-radius:12px}
.cascadeBossZoneArt{width:142px;height:50px;margin-top:-5px;margin-bottom:-8px}
.cascadeBossModalArt{width:min(96%,380px);height:115px;margin-top:4px;margin-bottom:8px}
.cascadeBossZoneArt .cascadeSprite,.cascadeBossModalArt .cascadeSprite{position:absolute;left:50%;top:50%;width:100%;height:100%;transform:translate(-50%,-50%);background-image:url('${ATLAS}');background-size:100% 500%;background-position:center 100%;background-repeat:no-repeat;filter:drop-shadow(0 4px 8px #001018aa)}
`;
document.head.appendChild(style);
let lastSig='',lastGridCell=null;
function snapshot(){try{return window.__qa?.snapshot?.()}catch(e){return null}}
function sig(s){return JSON.stringify([s?.zone,s?.mode,s?.N,(s?.ships||[]).map(x=>[x.id,x.sunk,(x.hits||[]).join('|'),JSON.stringify(x.armorDamage||{})])])}
function buildShip(s,N,cells,grid,gr){
 if(!s?.sunk||!s.cells?.length)return;
 const els=s.cells.map(([r,c])=>cells[r*N+c]).filter(Boolean);if(els.length!==s.cells.length)return;
 const rs=els.map(e=>e.getBoundingClientRect()),horizontal=s.cells.every(p=>p[0]===s.cells[0][0]);
 const minL=Math.min(...rs.map(r=>r.left)),maxR=Math.max(...rs.map(r=>r.right)),minT=Math.min(...rs.map(r=>r.top)),maxB=Math.max(...rs.map(r=>r.bottom));
 const cw=rs[0].width,ch=rs[0].height,cx=(minL+maxR)/2-gr.left,cy=(minT+maxB)/2-gr.top;
 const span=horizontal?(maxR-minL):(maxB-minT);
 const d=document.createElement('div');d.className='cascadeShipArt '+(horizontal?'horizontal':'vertical')+(s.boss?' boss':'');d.dataset.ship=String(s.id);
 Object.assign(d.style,{left:cx+'px',top:cy+'px',width:Math.max(24,span-cw*.16)+'px',height:Math.max(14,Math.min(cw,ch)*.62)+'px'});
 const hull=document.createElement('div');hull.className='cascadeHull';d.appendChild(hull);grid.appendChild(d);
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
  const thumb=document.createElement('div');thumb.className='cascadeFleetThumb';const hull=document.createElement('div');hull.className='miniHull';thumb.appendChild(hull);
  const pips=document.createElement('div');pips.className='cascadeFleetPips';
  for(let i=0;i<ship.len;i++){const p=document.createElement('span');p.className='cascadeFleetPip';const k=ship.cells?.[i]?.join(',');if(k&&ship.hits?.includes(k))p.classList.add('hit');else if(k&&ship.armor?.includes(k)&&!ship.armorDamage?.[k])p.classList.add('armor');pips.appendChild(p)}
  row.append(thumb,pips);f.appendChild(row);
 });
}
function bossBlock(cls){const d=document.createElement('div');d.className=cls;const sp=document.createElement('div');sp.className='cascadeSprite';d.appendChild(sp);return d}
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