(()=>{
'use strict';
const SAVE='cascadeStableSave1', DAILY='cascadeStableDaily1';
function read(k){try{return JSON.parse(localStorage.getItem(k)||'null')}catch(e){return null}}
function freshBoardState(s){if(!s||!Array.isArray(s.state))return false;for(const row of s.state)for(const c of row){if(c?.type==='hit')return false;if(c?.type==='water'&&c.auto===false)return false}return true}
function clearAutoWaters(s){let changed=false;if(!s||!Array.isArray(s.state))return false;for(let r=0;r<s.state.length;r++)for(let c=0;c<s.state[r].length;c++){const x=s.state[r][c];if(x?.type==='water'&&x.auto===true){s.state[r][c]=null;changed=true}}return changed}
function applyCampaign(){const s=read(SAVE);if(!s||!freshBoardState(s))return false;if(!clearAutoWaters(s))return false;localStorage.setItem(SAVE,JSON.stringify(s));try{window.__qa?.exitDaily()}catch(e){}return true}
function applyDaily(){const d=read(DAILY);if(!d||!freshBoardState(d))return false;if(!clearAutoWaters(d))return false;localStorage.setItem(DAILY,JSON.stringify(d));try{window.__qa?.enterDaily()}catch(e){}return true}
function patchText(root=document){root.querySelectorAll?.('.modal p').forEach(p=>{if(p.textContent.includes('Empiezas con pistas gratuitas'))p.textContent='Empieza explorando el tablero. Cada disparo de agua revelará un número que te ayudará a deducir la posición de la flota.';if(p.textContent.includes('Las zonas empiezan con pistas'))p.textContent='Los barcos no se tocan, ni siquiera en diagonal. Empieza explorando y usa los números que vayas descubriendo para deducir la flota.'})}
setTimeout(()=>{applyCampaign();patchText()},80);
document.addEventListener('click',e=>{if(e.target?.id==='nextZone')setTimeout(()=>{applyCampaign();patchText()},80);if(e.target?.id==='startDaily')setTimeout(()=>{applyDaily();patchText()},80)},true);
const mo=new MutationObserver(()=>patchText());mo.observe(document.getElementById('modalBox')||document.body,{childList:true,subtree:true});
})();