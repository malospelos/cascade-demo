(()=>{
'use strict';
const POS={2:0,3:20,4:40,5:60,6:80};
const style=document.createElement('style');
style.textContent=`
.cascadeBoardSprite,.cascadeFleetSprite,.cascadeBossZoneArt .cascadeSprite,.cascadeBossModalArt .cascadeSprite{background-size:100% 600%!important}
.cascadeShipArt.horizontal{transform:translate(-50%,-50%) scale(1.16,1.08)!important}
.cascadeShipArt.vertical{transform:translate(-50%,-50%) rotate(90deg) scale(1.16,1.08)!important}
`;
document.head.appendChild(style);
function snap(){try{return window.__qa?.snapshot?.()}catch(e){return null}}
function apply(){
 const s=snap();if(!s?.ships)return;
 const byId=new Map(s.ships.map(x=>[String(x.id),x]));
 document.querySelectorAll('.cascadeShipArt').forEach(el=>{
  const ship=byId.get(el.dataset.ship);if(!ship)return;
  const sp=el.querySelector('.cascadeBoardSprite');if(sp)sp.style.backgroundPositionY=(ship.boss?100:(POS[ship.len]??80))+'%';
 });
 document.querySelectorAll('.cascadeFleetRow').forEach(el=>{
  const ship=byId.get(el.dataset.ship);if(!ship)return;
  const sp=el.querySelector('.cascadeFleetSprite');if(sp)sp.style.backgroundPositionY=(ship.boss?100:(POS[ship.len]??80))+'%';
 });
 document.querySelectorAll('.cascadeBossZoneArt .cascadeSprite,.cascadeBossModalArt .cascadeSprite').forEach(sp=>sp.style.backgroundPositionY='100%');
}
setTimeout(apply,100);setInterval(apply,150);
})();