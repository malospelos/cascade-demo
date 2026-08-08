(()=>{
'use strict';
const xhr=new XMLHttpRequest();
xhr.open('GET','stable-v24-balanced-loader.js?v=6',false);
xhr.send(null);
if(!((xhr.status>=200&&xhr.status<300)||xhr.status===0))throw new Error('No se pudo cargar el motor procedural');
let code=xhr.responseText;
const marker="(0,eval)(src+'\\n//# sourceURL=stable-v24-balanced-runtime.js');";
if(!code.includes(marker))throw new Error('No se encontró el punto de parche procedural');
const patch=`src=src.replace("s.hits.push(k);state[r][c]={type:'hit'};logicalReveal(s,r,c);","const wasGhost=s.special==='ghost'&&s.hits.length===0;s.hits.push(k);if(wasGhost){for(let gx=0;gx<N;gx++)for(let gy=0;gy<N;gy++)if(state[gx][gy]?.type==='water')state[gx][gy].n=clue(gx,gy);showFloat('👻 SUBMARINO DETECTADO')}state[r][c]={type:'hit'};logicalReveal(s,r,c);");\n`;
code=code.replace(marker,patch+marker);
(0,eval)(code+'\n//# sourceURL=stable-v24-procedural-loader.js');
})();