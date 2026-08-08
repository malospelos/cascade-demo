(()=>{
'use strict';
const style=document.createElement('style');
style.textContent=`
@media (orientation:landscape){
  .fleetPanel{left:5px!important;top:50%!important;transform:translateY(-50%)!important;width:92px!important;min-width:0!important;padding:5px!important;border-radius:13px!important}
  .fleetLabel{font-size:8px!important;letter-spacing:1.5px!important;padding:0 2px 4px!important}
  #cascadeFleetStable{display:flex!important;flex-direction:column!important;gap:4px!important;padding:0!important;overflow:visible!important}
  .cascadeFleetRow{min-height:38px!important;padding:3px 4px 4px!important;gap:2px!important;border-radius:9px!important}
  .cascadeFleetThumb{height:23px!important}
  .cascadeFleetSegments{gap:3px!important;padding:0!important}
  .cascadeFleetSegment{height:2px!important}
}
@media (orientation:landscape) and (max-height:700px){
  .fleetPanel{width:82px!important;left:3px!important;padding:4px!important}
  .fleetLabel{font-size:7px!important;padding-bottom:3px!important}
  #cascadeFleetStable{gap:3px!important}
  .cascadeFleetRow{min-height:34px!important;padding:2px 3px 3px!important}
  .cascadeFleetThumb{height:20px!important}
  .cascadeFleetSegments{gap:2px!important}
}
@media (orientation:portrait){
  .fleetPanel{left:50%!important;top:26px!important;transform:translateX(-50%)!important;width:calc(100% - 16px)!important;min-width:0!important;padding:4px 5px 5px!important;border-radius:12px!important}
  .fleetLabel{position:static!important;transform:none!important;text-align:center!important;padding:0 0 3px!important;font-size:8px!important;letter-spacing:1.5px!important;line-height:1!important}
  #cascadeFleetStable{display:grid!important;grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:4px!important;padding:0!important;overflow:visible!important}
  .cascadeFleetRow{min-width:0!important;min-height:36px!important;padding:2px 3px 3px!important;gap:2px!important;border-radius:8px!important}
  .cascadeFleetThumb{height:20px!important}
  .cascadeFleetSegments{gap:2px!important;padding:0!important}
  .cascadeFleetSegment{height:2px!important}
}
@media (orientation:portrait) and (max-width:430px){
  .fleetPanel{top:24px!important;padding:3px 4px 4px!important}
  .fleetLabel{font-size:7px!important;padding-bottom:2px!important}
  #cascadeFleetStable{grid-template-columns:repeat(4,minmax(0,1fr))!important;gap:3px!important}
  .cascadeFleetRow{min-height:32px!important;padding:2px 3px!important}
  .cascadeFleetThumb{height:17px!important}
  .cascadeFleetSegments{gap:2px!important}
  .cascadeFleetSegment{height:2px!important}
}
@media (orientation:portrait) and (max-width:340px){
  #cascadeFleetStable{grid-template-columns:repeat(3,minmax(0,1fr))!important}
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
  const top=Math.max(58,Math.ceil(f.bottom-p.top+8));
  const side=window.innerWidth<=390?46:(window.innerWidth<=600?50:58);
  stage.style.setProperty('top',top+'px','important');
  stage.style.setProperty('left',side+'px','important');
  stage.style.setProperty('right',side+'px','important');
  stage.style.setProperty('bottom',window.innerWidth<=390?'46px':'50px','important');
 }else{
  const left=Math.max(58,Math.ceil(f.right-p.left+8));
  const right=window.innerHeight<=700?58:70;
  stage.style.setProperty('left',left+'px','important');
  stage.style.setProperty('right',right+'px','important');
  stage.style.setProperty('top','6px','important');
  stage.style.setProperty('bottom',window.innerHeight<=700?'48px':'54px','important');
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