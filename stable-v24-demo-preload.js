(()=>{
'use strict';
const SAVE='cascadeStableSave1', PENDING='cascadeStableDemoPending1';
let p=null,s=null;
try{p=JSON.parse(localStorage.getItem(PENDING)||'null')}catch(e){}
if(!p)return;
try{s=JSON.parse(localStorage.getItem(SAVE)||'null')}catch(e){}
if(!s||s.v!==1){localStorage.removeItem(PENDING);return}
s.powers=Object.assign({sonar:0,depth:0,hint:0,bombard:0},s.powers||{});
if(p.pack==='torps')s.ammo=(s.ammo||0)+10;
else if(p.pack==='tactical'){s.ammo=(s.ammo||0)+5;s.powers.sonar++;s.powers.hint++;}
else if(p.pack==='medals')s.coins=(s.coins||0)+1000;
else if(p.pack==='full'){s.ammo=(s.ammo||0)+10;s.powers.sonar++;s.powers.depth++;s.powers.hint++;s.powers.bombard++;}
localStorage.setItem(SAVE,JSON.stringify(s));
localStorage.removeItem(PENDING);
localStorage.setItem('cascadeStableDemoLastApplied1',JSON.stringify({pack:p.pack,at:Date.now()}));
})();