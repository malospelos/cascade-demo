(()=>{
'use strict';
const style=document.createElement('style');
style.id='cascadePortraitLayout';
style.textContent=`
@media (orientation:portrait) and (max-width:600px){
  .playfield{
    overflow:hidden!important;
    display:grid!important;
    grid-template-columns:118px minmax(0,1fr)!important;
    grid-template-rows:22px 46px minmax(0,1fr) 66px!important;
    gap:4px!important;
    align-items:stretch!important;
    padding:0 4px 2px!important;
  }
  .statusDock{display:none!important}

  .remaining{
    position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    transform:none!important;grid-column:1 / 3!important;grid-row:1!important;
    justify-self:center!important;align-self:center!important;z-index:12!important;margin:0!important;
    padding:3px 8px!important;font-size:7.5px!important;border-radius:10px!important;
  }

  /* HUD compacto: deposito + cuatro ayudas */
  .ammoDock{
    position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    grid-column:1!important;grid-row:2!important;width:118px!important;height:46px!important;z-index:22!important;
    display:flex!important;align-items:center!important;justify-content:flex-start!important;
  }
  .ammoDock>span{font-size:20px!important;margin:0 -8px 0 -1px!important;flex:0 0 auto!important;z-index:3!important}
  .ammoBar{
    height:44px!important;min-width:108px!important;width:108px!important;
    padding:15px 29px 3px 18px!important;border:1.5px solid #70dff155!important;border-radius:10px!important;
    background:linear-gradient(180deg,#123f58f2,#082f46f2)!important;box-shadow:inset 0 1px #ffffff30,0 3px 0 #03283c!important;
    text-align:center!important;
  }
  .ammoBar:before{
    content:'DEPÓSITO DE TORPEDOS';position:absolute;left:19px;right:29px;top:3px;
    font-size:4.8px;line-height:7px;font-weight:900;letter-spacing:.02em;color:#d9f4fb;white-space:nowrap;
  }
  .ammoBar strong{font-size:15px!important;line-height:15px!important;white-space:nowrap!important}
  .ammoBar small{display:block!important;font-size:5.4px!important;line-height:8px!important;color:#bde4ed!important;white-space:nowrap!important}
  .ammoPlus{
    right:4px!important;top:10px!important;width:23px!important;height:26px!important;border-radius:6px!important;
    font-size:17px!important;line-height:23px!important;background:#50c849!important;box-shadow:0 2px 0 #1f7f25!important;
  }

  .rightRail{
    position:relative!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    transform:none!important;grid-column:2!important;grid-row:2!important;width:100%!important;height:46px!important;
    display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:3px!important;z-index:22!important;
  }
  .hex{
    width:100%!important;height:44px!important;min-width:0!important;border-radius:9px!important;border:1.5px solid #89e6f34a!important;
    padding:2px 1px 1px!important;background:linear-gradient(180deg,#174c63f0,#0a3850f0)!important;
    box-shadow:inset 0 1px #ffffff2b,0 3px 0 #043047!important;
  }
  .hex .ico{font-size:16px!important;line-height:20px!important;height:20px!important;display:block!important}
  .hex .name{font-size:4.9px!important;line-height:7px!important;letter-spacing:.01em!important;white-space:nowrap!important;overflow:hidden!important;text-overflow:clip!important}
  .badge{
    right:2px!important;bottom:2px!important;width:14px!important;height:14px!important;font-size:6.5px!important;
    border-width:1px!important;background:#ffd557!important;color:#16333d!important;box-shadow:none!important;
  }
  .infoDot{
    left:3px!important;top:3px!important;width:12px!important;height:12px!important;font-size:6px!important;border-width:1px!important;
    background:#f4fdff!important;color:#07516d!important;opacity:.9!important;
  }

  .boardStage{
    position:relative!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;
    grid-column:1 / 3!important;grid-row:3!important;min-width:0!important;min-height:0!important;width:100%!important;height:100%!important;
    display:flex!important;align-items:flex-start!important;justify-content:center!important;overflow:hidden!important;
  }
  .grid{
    width:min(calc(100vw - 18px),calc(100dvh - 257px))!important;
    height:min(calc(100vw - 18px),calc(100dvh - 257px))!important;
    max-width:100%!important;max-height:100%!important;padding:6px!important;gap:2px!important;border-radius:15px!important;flex:0 0 auto!important;
  }

  .playfield .fleetPanel{
    position:relative!important;inset:auto!important;left:auto!important;right:auto!important;top:auto!important;bottom:auto!important;transform:none!important;
    grid-column:1 / 3!important;grid-row:4!important;width:100%!important;height:66px!important;min-width:0!important;
    padding:4px 5px!important;border-radius:12px!important;z-index:20!important;overflow:hidden!important;
  }
  .fleetLabel{font-size:7px!important;line-height:10px!important;height:10px!important;margin:0!important}
  #fleet{display:none!important}
  #cascadeFleetStable{display:grid!important;grid-template-columns:repeat(var(--fleet-count,8),minmax(0,1fr))!important;gap:3px!important;align-items:stretch!important;height:46px!important;overflow:hidden!important}
  .cascadeFleetRow{min-width:0!important;width:auto!important;height:45px!important;min-height:45px!important;padding:2px!important;border-radius:7px!important;display:flex!important;flex-direction:column!important;justify-content:center!important;overflow:hidden!important}
  .cascadeFleetThumb{width:100%!important;height:29px!important;min-height:29px!important;overflow:hidden!important}
  .cascadeFleetSprite{max-width:100%!important;max-height:28px!important;object-fit:contain!important}
  .cascadeFleetSegments{width:90%!important;margin:1px auto 0!important;gap:1px!important}
  .cascadeFleetSegment{height:2px!important;min-width:0!important}

  .footer{height:36px!important;gap:4px!important;padding:2px 0!important}
  .footer button{flex:1 1 0!important;min-width:0!important;padding:5px 2px!important;font-size:6px!important;white-space:nowrap!important}
}
@media (orientation:portrait) and (max-width:360px){
  .playfield{grid-template-columns:108px minmax(0,1fr)!important;grid-template-rows:21px 44px minmax(0,1fr) 62px!important}
  .ammoDock{width:108px!important;height:44px!important}.ammoBar{width:99px!important;min-width:99px!important;padding-left:16px!important}
  .ammoBar:before{left:17px;right:27px;font-size:4.3px}.ammoPlus{width:22px!important;right:3px!important}
  .rightRail{height:44px!important}.hex{height:42px!important}.hex .ico{font-size:15px!important;line-height:19px!important}.hex .name{font-size:4.3px!important}
  .grid{width:min(calc(100vw - 14px),calc(100dvh - 247px))!important;height:min(calc(100vw - 14px),calc(100dvh - 247px))!important}
  .playfield .fleetPanel{height:62px!important}
}
`;
document.head.appendChild(style);
function syncFleetCount(){const box=document.getElementById('cascadeFleetStable');if(!box)return;const n=Math.max(1,box.querySelectorAll('.cascadeFleetRow').length);box.style.setProperty('--fleet-count',String(n))}
const obs=new MutationObserver(syncFleetCount);
const start=()=>{const f=document.querySelector('.fleetPanel');if(f){obs.observe(f,{childList:true,subtree:true});syncFleetCount()}};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start);else start();
})();