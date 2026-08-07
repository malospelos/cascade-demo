(()=>{
'use strict';
const modal=document.getElementById('modal');
const box=document.getElementById('modalBox');
if(!modal||!box)return;
function isVictory(){return !!box.querySelector('#nextZone') || /ZONA DESPEJADA/.test(box.textContent||'')}
modal.addEventListener('pointerdown',e=>{
  if(e.target===modal && isVictory()){
    e.preventDefault();
    e.stopImmediatePropagation();
  }
},true);
})();