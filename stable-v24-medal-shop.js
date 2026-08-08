(()=>{
'use strict';
const medals=document.querySelector('.medals');
if(!medals)return;
medals.style.cursor='pointer';
medals.setAttribute('role','button');
medals.setAttribute('tabindex','0');
medals.setAttribute('aria-label','Abrir arsenal');
function openArsenal(e){
 if(e)e.preventDefault();
 const btn=document.getElementById('shopPlus');
 if(btn)btn.click();
}
medals.addEventListener('click',openArsenal);
medals.addEventListener('keydown',e=>{
 if(e.key==='Enter'||e.key===' '){e.preventDefault();openArsenal(e)}
});
})();