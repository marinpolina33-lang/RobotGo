/* Public page URLs are shared by navigation and the static-page build. */
(()=>{
 'use strict';
 const products=new Set((window.ROBOTGO_CATALOG?.products||[]).map(p=>p.id));
 const publicPaths=new Set(window.ROBOTGO_SEO?Object.keys(window.ROBOTGO_SEO.pages):['/','/shop','/contact',...[...products].map(id=>'/product/'+id)]);
 const aliases={'/catalog':'/shop','/roboti':'/categories','/oferta':'/quote','/despre':'/about','/compara':'/compare','/branduri':'/brands','/suport':'/service','/solutii':'/solutions'};
 function split(raw){const mark=raw.indexOf('?');let path=(mark<0?raw:raw.slice(0,mark)).replace(/\/index\.html$/,'').replace(/\/+$/,'')||'/';if(!path.startsWith('/'))path='/'+path;return {path:aliases[path]||path,params:new URLSearchParams(mark<0?'':raw.slice(mark+1))};}
 function url(raw){const {path,params}=split(raw),query=params.size?'?'+params.toString():'';return publicPaths.has(path)?(path==='/'?'/':path+'/')+query:'/#'+path+query;}
 function read(location){return split(location.hash?.startsWith('#/')?location.hash.slice(1):(location.pathname||'/')+(location.search||''));}
 function redirectLegacy(){const location=window.location;if(!location?.hash?.startsWith('#/'))return false;const current=read(location);if(!publicPaths.has(current.path))return false;location.replace(url(current.path+(current.params.size?'?'+current.params.toString():'')));return true;}
 window.ROBOTGO_ROUTING={url,read,redirectLegacy,publicPaths:[...publicPaths]};
})();
