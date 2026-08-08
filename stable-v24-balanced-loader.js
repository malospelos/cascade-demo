(()=>{
'use strict';
const xhr=new XMLHttpRequest();
xhr.open('GET','stable-v24.js?v=2',false);
xhr.send(null);
if(!((xhr.status>=200&&xhr.status<300)||xhr.status===0))throw new Error('No se pudo cargar stable-v24.js');
let src=xhr.responseText;
const replacements=[
  ["REGEN=20*60*1000","REGEN=12*60*1000"],
  ["lastCell=null;","lastCell=null,lastProgressShot=0;"],
  ["zoneShots=zoneHits=zoneAidUses=0;return true","zoneShots=zoneHits=zoneAidUses=0;lastProgressShot=0;return true"],
  ["hits++;zoneHits++;prof.hits++","hits++;zoneHits++;lastProgressShot=zoneShots;prof.hits++"],
  ["function antiFrustration(){const recentMisses=Math.max(0,zoneShots-zoneHits);if(zoneShots>=5&&recentMisses>0&&zoneShots%5===0){","function antiFrustration(){if(zoneShots-lastProgressShot>=9){"],
  ["revealWater(p[0],p[1],true);showFloat('📡 NUEVA PISTA');render();saveAll()","revealWater(p[0],p[1],true);lastProgressShot=zoneShots;showFloat('📡 NUEVA PISTA');render();saveAll()"],
  ["coins+=cfg().reward;ammo+=zone<3?3:5;","coins+=cfg().reward;const zBonus=N<=7?4:N<=11?5:6;ammo+=zBonus;"],
  ["BONUS: +${zone<3?3:5} torpedos","BONUS: +${zBonus} torpedos"],
  ["zoneShots=0;zoneHits=0;zoneAidUses=0;return true","zoneShots=0;zoneHits=0;zoneAidUses=0;lastProgressShot=0;return true"]
];
for(const [from,to] of replacements){
  if(!src.includes(from))throw new Error('Balance patch no encontrado: '+from.slice(0,80));
  src=src.replace(from,to);
}
(0,eval)(src+'\n//# sourceURL=stable-v24-balanced-runtime.js');
})();