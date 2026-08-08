(()=>{
'use strict';
const style=document.createElement('style');
style.id='cascadePortraitLayout';
style.textContent=`
@media (orientation:portrait) and (max-width:600px){
  .playfield{overflow:hidden!important}
  .statusDock{display:none!important}
  .remaining{top:2px!important}

  /* BARRA DE COMBATE: torpedos + cuatro ayudas, una sola linea arriba */
  .ammoDock{left:4px!important;top:25px!important;bottom:auto!important;width:108px!important;height:52px!important;z-index:22!important;display:flex!important;align-items:center!important}
  .ammoDock>span{font-size:22px!important;margin-right:-9px!important;flex:0 0 auto!important}
  .ammoBar{height:46px!important;min-width:96px!important;width:96px!important;padding:5px 31px 4px 18px!important;border-width:2px!important;border-radius:10px!important}
  .ammoBar strong{font-size:16px!important;line-height:16px!important;white-space:nowrap!important}
  .ammoBar small{font-size:5.8px!important;line-height:9px!important;white-space:nowrap!important}
  .ammoPlus{right:-5px!important;top:5px!important;width:29px!important;height:32px!important;font-size:21px!important}

  .rightRail{left:114px!important;right:4px!important;top:25px!important;transform:none!important;height:52px!important;display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:3px!important;z-index:22!important}
  .hex{width:auto!important;height:48px!important;min-width:0!important;border-radius:11px!important;border-width:1.5px!important;padding:2px 1px!important;box-shadow:inset 0 2px #ffffff38,0 3px 0 #064760!important}
  .hex .ico{font-size:18px!important;line-height:23px!important}
  .hex .name{font-size:5px!important;line-height:7px!important;white-space:nowrap!important;overflow:hidden!important}
  .badge{right:-2px!important;bottom:-3px!important;width:17px!important;height:17px!important;font-size:7.5px!important;border-width:1.5px!important}
  .infoDot{left:-3px!important;top:-4px!important;width:14px!important;height:14px!important;font-size:7px!important;border-width:1.5px!important}

  /* TABLERO: ocupa el ancho central y empieza debajo de la barra de combate */
  .boardStage{left:5px!important;right:5px!important;top:83px!important;bottom:78px!important;inset:auto!important;display:flex!important;align-items:flex-start!important;justify-content:center!important}
  .grid{width:min(calc(100vw - 24px),calc(100dvh - 265px))!important;height:min(calc(100vw - 24px),calc(100dvh - 265px))!important;max-width:100%!important;max-height:100%!important;padding:6px!important;gap:2px!important;border-radius:15px!important}

  /* FLOTA: una tira horizontal debajo del tablero */
  .fleetPanel{left:5px!important;right:5px!important;top:auto!important;bottom:3px!important;transform:none!important;width:auto!important;min-width:0!important;height:68px!important;padding:4px 5px!important;border-radius:12px!important;z-index:20!important;overflow:hidden!important}
  .fleetLabel{font-size:7px!important;line-height:10px!important;height:10px!important;margin:0!important}
  #fleet{display:none!important}
  #cascadeFleetStable{display:grid!important;grid-template-columns:repeat(var(--fleet-count,8),minmax(0,1fr))!important;gap:3px!important;align-items:stretch!important;height:48px!important;overflow:hidden!important}
  .cascadeFleetRow{min-width:0!important;width:auto!important;height:47px!important;min-height:47px!important;padding:2px!important;border-radius:7px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;overflow:hidden!important}
  .cascadeFleetThumb{width:100%!important;height:31px!important;min-height:31px!important;overflow:hidden!important}
  .cascadeFleetSprite{max-width:100%!important;max-height:30px!important;object-fit:contain!important}
  .cascadeFleetSegments{width:90%!important;margin:1px auto 0!important;gap:1px!important}
  .cascadeFleetSegment{height:2px!important;min-width:0!important}

  .footer{height:38px!important;gap:4px!important;padding:2px 0!important}
  .footer button{flex:1 1 0!important;min-width:0!important;padding:6px 2px!important;font-size:6px!important;white-space:nowrap!important}
}
@media (orientation:portrait) and (max-width:360px){
  .ammoDock{width:99px!important}
  .ammoBar{width:88px!important;min-width:88px!important;padding-left:16px!important}
  .rightRail{left:105px!important}
  .hex .ico{font-size:16px!important}
  .hex .name{font-size:4.5px!important}
  .grid{width:min(calc(100vw - 18px),calc(100dvh - 255px))!important;height:min(calc(100vw - 18px),calc(100dvh - 255px))!important}
}
`;
document.head.appendChild(style);
function syncFleetCount(){
  const box=document.getElementById('cascadeFleetStable');
  if(!box)return;
  const n=Math.max(1,box.querySelectorAll('.cascadeFleetRow').length);
  box.style.setProperty('--fleet-count',String(n));
}
const obs=new MutationObserver(syncFleetCount);
const start=()=>{const f=document.querySelector('.fleetPanel');if(f){obs.observe(f,{childList:true,subtree:true});syncFleetCount()}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();