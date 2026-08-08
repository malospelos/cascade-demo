(()=>{
'use strict';
const style=document.createElement('style');
style.textContent=`
/* Landscape/tablet/desktop: reserve a real left rail for FLOTA */
@media (orientation:landscape) and (min-width:601px){
  .fleetPanel{left:8px!important;top:50%!important;transform:translateY(-50%)!important;width:122px!important;min-width:0!important;padding:8px!important;border-radius:16px!important}
  .fleetLabel{font-size:10px!important;letter-spacing:2px!important;padding:1px 4px 7px!important}
  #cascadeFleetStable{gap:6px!important}
  .cascadeFleetRow{min-height:54px!important;padding:6px 7px 7px!important;gap:5px!important;border-radius:12px!important}
  .cascadeFleetThumb{height:34px!important}
  .cascadeFleetSegments{gap:6px!important;padding:0 1px!important}
  .cascadeFleetSegment{height:3px!important}
  .boardStage{left:140px!important;right:78px!important}
}
@media (orientation:landscape) and (max-height:700px){
  .fleetPanel{width:108px!important;left:5px!important;padding:6px!important}
  .fleetLabel{font-size:9px!important;padding-bottom:5px!important}
  .cascadeFleetRow{min-height:46px!important;padding:4px 6px 5px!important;gap:3px!important}
  .cascadeFleetThumb{height:28px!important}
  .cascadeFleetSegments{gap:5px!important}
  .cascadeFleetSegment{height:3px!important}
  .boardStage{left:120px!important;right:62px!important}
}
/* Portrait tablet: move FLOTA above the board so it never overlaps cells */
@media (orientation:portrait) and (min-width:601px){
  .fleetPanel{left:50%!important;top:6px!important;transform:translateX(-50%)!important;width:min(94%,820px)!important;min-width:0!important;padding:7px 9px 8px!important;border-radius:16px!important}
  .fleetLabel{position:absolute!important;left:12px!important;top:50%!important;transform:translateY(-50%)!important;width:48px!important;padding:0!important;font-size:10px!important;letter-spacing:1.8px!important;z-index:2!important}
  #cascadeFleetStable{display:flex!important;flex-direction:row!important;gap:6px!important;padding-left:52px!important;overflow:hidden!important}
  .cascadeFleetRow{flex:1 1 0!important;min-width:0!important;min-height:58px!important;padding:5px 6px 6px!important;gap:4px!important;border-radius:12px!important}
  .cascadeFleetThumb{height:35px!important}
  .cascadeFleetSegments{gap:5px!important;padding:0 1px!important}
  .cascadeFleetSegment{height:3px!important}
  .boardStage{inset:92px 62px 58px 62px!important}
}
/* Portrait phones/small tablets: compact 3-column fleet dock */
@media (orientation:portrait) and (max-width:600px){
  .fleetPanel{left:50%!important;top:4px!important;transform:translateX(-50%)!important;width:calc(100% - 14px)!important;min-width:0!important;padding:6px 7px 7px!important;border-radius:14px!important}
  .fleetLabel{position:static!important;transform:none!important;text-align:center!important;padding:0 0 5px!important;font-size:9px!important;letter-spacing:1.8px!important}
  #cascadeFleetStable{display:grid!important;grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important;padding:0!important;overflow:visible!important}
  .cascadeFleetRow{min-width:0!important;min-height:45px!important;padding:4px 5px 5px!important;gap:3px!important;border-radius:10px!important}
  .cascadeFleetThumb{height:25px!important}
  .cascadeFleetSegments{gap:4px!important;padding:0!important}
  .cascadeFleetSegment{height:3px!important}
  .boardStage{inset:142px 54px 50px 54px!important}
}
@media (orientation:portrait) and (max-width:390px){
  .fleetPanel{padding:5px 6px 6px!important}
  #cascadeFleetStable{gap:4px!important}
  .cascadeFleetRow{min-height:41px!important;padding:3px 4px 4px!important}
  .cascadeFleetThumb{height:22px!important}
  .cascadeFleetSegments{gap:3px!important}
  .boardStage{inset:132px 50px 48px 50px!important}
}
`;
document.head.appendChild(style);
})();