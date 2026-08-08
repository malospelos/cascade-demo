(()=>{
'use strict';
const style=document.createElement('style');
style.id='cascadePortraitLayout';
style.textContent=`
@media (orientation:portrait) and (max-width:600px){
  .playfield{
    overflow:hidden!important;
    display:grid!important;
    grid-template-columns:108px minmax(0,1fr)!important;
    grid-template-rows:24px 54px minmax(0,1fr) 68px!important;
    gap:5px 4px!important;
    align-items:stretch!important;
    padding:0 3px 2px!important;
  }
  .statusDock{display:none!important}

  /* FILA 1: contador */
  .remaining{
    position:relative!important;
    left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    transform:none!important;
    grid-column:1 / 3!important;grid-row:1!important;
    justify-self:center!important;align-self:center!important;
    z-index:12!important;
    margin:0!important;
  }

  /* FILA 2: torpedos + ayudas */
  .ammoDock{
    position:relative!important;
    left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    grid-column:1!important;grid-row:2!important;
    width:108px!important;height:54px!important;
    z-index:22!important;
    display:flex!important;align-items:center!important;justify-content:flex-start!important;
  }
  .ammoDock>span{font-size:22px!important;margin-right:-9px!important;flex:0 0 auto!important}
  .ammoBar{height:46px!important;min-width:96px!important;width:96px!important;padding:5px 31px 4px 18px!important;border-width:2px!important;border-radius:10px!important}
  .ammoBar strong{font-size:16px!important;line-height:16px!important;white-space:nowrap!important}
  .ammoBar small{font-size:5.8px!important;line-height:9px!important;white-space:nowrap!important}
  .ammoPlus{right:-5px!important;top:5px!important;width:29px!important;height:32px!important;font-size:21px!important}

  .rightRail{
    position:relative!important;
    left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    transform:none!important;
    grid-column:2!important;grid-row:2!important;
    width:100%!important;height:54px!important;
    display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;
    gap:3px!important;z-index:22!important;
  }
  .hex{width:100%!important;height:50px!important;min-width:0!important;border-radius:11px!important;border-width:1.5px!important;padding:2px 1px!important;box-shadow:inset 0 2px #ffffff38,0 3px 0 #064760!important}
  .hex .ico{font-size:18px!important;line-height:23px!important}
  .hex .name{font-size:5px!important;line-height:7px!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:clip!important}
  .badge{right:-2px!important;bottom:-3px!important;width:17px!important;height:17px!important;font-size:7.5px!important;border-width:1.5px!important}
  .infoDot{left:-3px!important;top:-4px!important;width:14px!important;height:14px!important;font-size:7px!important;border-width:1.5px!important}

  /* FILA 3: tablero. Ocupa solo su propia fila, nunca debajo de la barra */
  .boardStage{
    position:relative!important;
    inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    grid-column:1 / 3!important;grid-row:3!important;
    min-width:0!important;min-height:0!important;
    width:100%!important;height:100%!important;
    display:flex!important;align-items:flex-start!important;justify-content:center!important;
    overflow:hidden!important;
  }
  .grid{
    width:min(calc(100vw - 20px),calc(100dvh - 275px))!important;
    height:min(calc(100vw - 20px),calc(100dvh - 275px))!important;
    max-width:100%!important;max-height:100%!important;
    padding:6px!important;gap:2px!important;border-radius:15px!important;
    flex:0 0 auto!important;
  }

  /* FILA 4: flota horizontal */
  .playfield .fleetPanel{
    position:relative!important;
    inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    transform:none!important;
    grid-column:1 / 3!important;grid-row:4!important;
    width:100%!important;height:68px!important;min-width:0!important;
    padding:4px 5px!important;border-radius:12px!important;z-index:20!important;overflow:hidden!important;
  }
  .fleetLabel{font-size:7px!important;line-height:10px!important;height:10px!important;margin:0!important}
  #fleet{display:none!important}
  #cascadeFleetStable{display:grid!important;grid-template-columns:repeat(var(--fleet-count,8),minmax(0,1fr))!important;gap:3px!important;align-items:stretch!important;height:48px!important;overflow:hidden!important}
  .cascadeFleetRow{min-width:0!important;width:auto!important;height:47px!important;min-height:47px!important;padding:2px!important;border-radius:7px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;overflow:hidden!important}
  .cascadeFleetThumb{width:100%!important;height:31px!important;min-height:31px!important;overflow:hidden!important}
  .cascadeFleetSprite{max-width:100%!important;max-height:30px!important;object-fit:contain!important}
  .cascadeFleetSegments{width:90%!important;margin:1px auto 0!important;gap:1px!important}
  .cascadeFleetSegment{height:2px!important;min-width:0!important}

  /* menu inferior */
  .footer{height:38px!important;gap:4px!important;padding:2px 0!important}
  .footer button{flex:1 1 0!important;min-width:0!important;padding:6px 2px!important;font-size:6px!important;white-space:nowrap!important}
}
@media (orientation:portrait) and (max-width:360px){
  .playfield{grid-template-columns:99px minmax(0,1fr)!important;grid-template-rows:22px 52px minmax(0,1fr) 64px!important}
  .ammoDock{width:99px!important;height:52px!important}
  .ammoBar{width:88px!important;min-width:88px!important;padding-left:16px!important}
  .rightRail{height:52px!important}
  .hex{height:48px!important}.hex .ico{font-size:16px!important}.hex .name{font-size:4.5px!important}
  .grid{width:min(calc(100vw - 16px),calc(100dvh - 260px))!important;height:min(calc(100vw - 16px),calc(100dvh - 260px))!important}
  .playfield .fleetPanel{height:64px!important}
}
`;
document.head.appendChild(style);
function syncFleetCount(){const box=document.getElementById('cascadeFleetStable');if(!box)return;const n=Math.max(1,box.querySelectorAll('.cascadeFleetRow').length);box.style.setProperty('--fleet-count',String(n))}
const obs=new MutationObserver(syncFleetCount);
const start=()=>{const f=document.querySelector('.fleetPanel');if(f){obs.observe(f,{childList:true,subtree:true});syncFleetCount()}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();