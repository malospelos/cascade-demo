(()=>{
'use strict';
if(!window.__qa)return;
const grid=document.getElementById('grid');
if(!grid)return;
function refresh(){try{window.__qa.render();window.__qa.update()}catch(e){}}
grid.addEventListener('pointerup',e=>{
  if(!e.target.closest('.cell'))return;
  setTimeout(refresh,280);
},true);
})();