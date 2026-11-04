/* Metricool visit protocol: https://tracker.metricool.com/resources/be.js
 * Keep the integration first-party so URLs/referrers can be stripped of private
 * parameters before the image request. No remote executable code is loaded.
 */
(()=>{'use strict';
 const key='robotgo-metricool-consent-v1';
 const hash=window.ROBOTGO_CONFIG?.metricoolHash||'';
 const origin='https://robotgo.ro';
 let currentPath='/',lastPage='';
 const pending=new Set();
 function preference(){try{return localStorage.getItem(key)||'';}catch{return 'deny';}}
 function allowed(){
  try{return preference()==='allow'&&localStorage.getItem('robotgo-analytics')==='allow'&&!navigator.globalPrivacyControl;}
  catch{return false;}
 }
 function setConsent(value){try{localStorage.setItem(key,value==='allow'?'allow':'deny');}catch{}}
 function track(path){
  currentPath=path;
  if(!allowed()||!['robotgo.ro','www.robotgo.ro'].includes(window.location.hostname)||!/^[a-f0-9]{32}$/.test(hash))return;
  // Only known, indexable catalogue pages. Account, quote and checkout routes
  // never go to Metricool; free-text searches and URL fragments are discarded.
  if(typeof path!=='string')return;
  const clean=path.split(/[?#]/,1)[0].replace(/\/+$/,'')||'/';
  const meta=window.ROBOTGO_SEO?.pages?.[clean];
  if(!window.ROBOTGO_ROUTING?.publicPaths?.includes(clean)||!meta||meta.noindex||/^\/(?:account|admin|api|quote|checkout|cart|favorites)(?:\/|$)/.test(clean))return;
  const page=origin+(clean==='/'?'/':clean+'/');
  if(lastPage===page)return;
  const params=new URLSearchParams({hash,u:page,bw:String(Math.max(0,Math.round(window.innerWidth||0))),bh:String(Math.max(0,Math.round(window.innerHeight||0)))});
  // Only the referring domain is useful for acquisition reports. Never send
  // the referring page's query, fragment, credentials or private path.
  try{const ref=new URL(document.referrer);if(['https:','http:'].includes(ref.protocol))params.set('ref',ref.origin+'/');}catch{}
  const pixel=new Image();
  pixel.crossOrigin='anonymous';
  pixel.referrerPolicy='no-referrer';
  pixel.onload=pixel.onerror=()=>pending.delete(pixel);
  pending.add(pixel);
  lastPage=page;
  pixel.src='https://tracker.metricool.com/c3po.jpg?'+params.toString();
 }
 window.addEventListener('storage',event=>{if(event.key===key||event.key==='robotgo-analytics')track(currentPath);});
 window.ROBOTGO_METRICOOL={track,setConsent,allowed,needsConsent:()=>preference()===''};
})();
