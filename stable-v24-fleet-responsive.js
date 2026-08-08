(()=>{
'use strict';
const style=document.createElement('style');
style.textContent=`
@media (orientation:landscape){
  .fleetPanel{left:8px!important;top:50%!important;transform:translateY(-50%)!important;width:118px!important;min-width:0!important;padding:7px!important;border-radius:16px!important}
  .fleetLabel{font-size:10px!important;letter-spacing:2px!important;padding:1px 4px 6px!important}
  #cascadeFleetStable{display:flex!important;flex-direction:column!important;gap:5px!important;padding:0!important;overflow:visible!important}
  .cascadeFleetRow{min-height:48px!important;padding:5px 6px 6px!important;gap:4px!important;border-radius:11px!important}
  .cascadeFleetThumb{height:30px!important}
  .cascadeFleetSegments{gap:5px!important;padding:0 1px!important}
  .cascadeFleetSegment{height:3px!important}
}
@media (orientation:landscape) and (max-height:700px){
  .fleetPanel{width:104px!important;left:5px!important;padding:5px!important}
  .fleetLabel{font-size:9px!important;padding-bottom:4px!important}
  #cascadeFleetStable{gap:4px!important}
  .cascadeFleetRow{min-height:41px!important;padding:3px 5px 4px!important;gap:3px!important}
  .cascadeFleetThumb{height:24px!important}
  .cascadeFleetSegments{gap:4px!important}
}
@media (orientation:portrait){
  .fleetPanel{left:50%!important;top:30px!important;transform:translateX(-50%)!important;width:calc(100% - 20px)!important;min-width:0!important;padding:7px 8px 8px!important;border-radius:15px!important}
  .fleetLabel{position:static!important;transform:none!important;text-align:center!important;padding:0 0 6px!important;font-size:10px!important;letter-spacing:2px!important}
  #cascadeFleetStable{display:grid!important;grid-template-columns:repeat(auto-fit,minmax(92px,1fr))!important;gap:6px!important;padding:0!important;overflow:visible!important}
  .cascadeFleetRow{min-width:0!important;min-height:50px!important;padding:4px 6px 5px!important;gap:3px!important;border-radius:11px!important}
  .cascadeFleetThumb{height:28px!important}
  .cascadeFleetSegments{gap:4px!important;padding:0!important}
  .cascadeFleetSegment{height:3px!important}
}
@media (orientation:portrait) and (max-width:600px){
  .fleetPanel{top:28px!important;width:calc(100% - 14px)!important;padding:6px 7px 7px!important}
  .fleetLabel{font-size:9px!important;padding-bottom:5px!important}
  #cascadeFleetStable{grid-template-columns:repeat(3,minmax(0,1fr))!important;gap:5px!important}
  .cascadeFleetRow{min-height:44px!important;padding:3px 5px 4px!important}
  .cascadeFleetThumb{height:24px!important}
  .cascadeFleetSegments{gap:3px!important}
}
@media (orientation:portrait) and (max-width:390px){
  .fleetPanel{top:26px!important;padding:5px 6px 6px!important}
  #cascadeFleetStable{gap:4px!important}
  .cascadeFleetRow{min-height:40px!important;padding:3px 4px!important}
  .cascadeFleetThumb{height:21px!important}
}
`;
document.head.appendChild(style);
function reserveSpace(){
 const playfield=document.getElementById('playfield');
 const fleet=document.querySelector('.fleetPanel');
 const stage=document.querySelector('.boardStage');
 if(!playfield||!fleet||!stage)return;
 const p=playfield.getBoundingClientRect();
 const f=fleet.getBoundingClientRect();
 const portrait=window.matchMedia('(orientation:portrait)').matches;
 if(portrait){
  const top=Math.max(86,Math.ceil(f.bottom-p.top+12));
  const side=window.innerWidth<=390?50:(window.innerWidth<=600?54:62);
  stage.style.setProperty('top',top+'px','important');
  stage.style.setProperty('left',side+'px','important');
  stage.style.setProperty('right',side+'px','important');
  stage.style.setProperty('bottom',window.innerWidth<=390?'48px':'54px','important');
 }else{
  const left=Math.max(72,Math.ceil(f.right-p.left+12));
  const right=window.innerHeight<=700?62:78;
  stage.style.setProperty('left',left+'px','important');
  stage.style.setProperty('right',right+'px','important');
  stage.style.setProperty('top','8px','important');
  stage.style.setProperty('bottom',window.innerHeight<=700?'50px':'58px','important');
 }
}
let ro;
function init(){
 reserveSpace();
 const fleet=document.querySelector('.fleetPanel');
 if(fleet&&'ResizeObserver' in window){
  ro?.disconnect();
  ro=new ResizeObserver(()=>reserveSpace());
  ro.observe(fleet);
 }
}
window.addEventListener('resize',()=>requestAnimationFrame(reserveSpace),{passive:true});
window.addEventListener('orientationchange',()=>setTimeout(reserveSpace,120),{passive:true});
setTimeout(init,120);
setInterval(reserveSpace,500);
})();