/* Public European benchmarks, kept separate from RobotGo's quoted sales prices.
 * Values reproduced from RoboSelect and checked at the linked retailers.
 * Do not use these references for order totals or Product/Offer structured data.
 */
(function(){
 'use strict';
 const references={
  'unitree-g1':{
   amount:23892,currency:'EUR',checkedOn:'2026-11-14',
   configuration:{ro:'G1 — configurația de bază',en:'G1 — base configuration'},
   country:{ro:'Belgia',en:'Belgium'},
   source:'KoningDrone',url:'https://koningdrone.be/en/product/unitree-g1/',
   catalogUrl:'https://robotics-hub.appwithchat.chatgpt.site/roboti/unitree-g1/',
   note:{ro:'Preț promoțional al comerciantului. Configurațiile EDU se cotează separat.',en:'Retailer promotional price. EDU configurations are quoted separately.'}
  },
  'unitree-go2':{
   amount:4200,currency:'EUR',checkedOn:'2026-11-14',
   configuration:{ro:'Go2 Pro',en:'Go2 Pro'},
   country:{ro:'Austria',en:'Austria'},
   source:'General Laser',url:'https://www.general-laser.at/en/shop-en/robots-en/unitree-robotics-en/quadruped-robots-en/unitree-go2-pro-en',
   catalogUrl:'https://robotics-hub.appwithchat.chatgpt.site/roboti/unitree-go2/',
   note:{ro:'Reper pentru versiunea Pro. Telecomanda poate fi opțională; versiunile Air și EDU au oferte separate.',en:'Reference for the Pro version. The controller may be optional; Air and EDU versions are quoted separately.'}
  }
 };
 const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const t=(lang,ro,en)=>lang==='en'?en:ro;
 const get=p=>references[typeof p==='string'?p:p?.id]||null;
 const amount=(p,lang='ro')=>{
  const r=get(p);
  return new Intl.NumberFormat(lang==='en'?'en-GB':'ro-RO',{style:'currency',currencyDisplay:'narrowSymbol',currency:r?.currency||p.currency||'EUR'}).format(r?r.amount:p.price);
 };
 const tax=(r,lang)=>t(lang,'TVA inclus în sursă','VAT included at source')+' · '+r.country[lang==='en'?'en':'ro'];
 const text=(p,lang='ro')=>{
  const r=get(p);
  if(r)return amount(p,lang)+' · '+r.configuration[lang==='en'?'en':'ro']+' · '+t(lang,'reper european','European reference')+' · '+tax(r,lang);
  return p.price==null?t(lang,'Preț la cerere','Price on request'):amount(p,lang);
 };
 const render=(p,lang='ro',detail=false)=>{
  const r=get(p),locale=lang==='en'?'en':'ro';
  if(!r)return `<div class="market-price"><strong>${esc(text(p,lang))}</strong></div>`;
  return `<div class="market-price${detail?' market-price-detail':''}" data-market-price="${esc(p.id)}"><span class="market-price-label">${t(lang,'Preț public în Europa','Public European price')}</span><strong class="market-price-amount">${esc(amount(p,lang))}</strong><span class="market-price-config">${esc(r.configuration[locale])}</span><small>${esc(tax(r,lang))}</small>${detail?`<p>${t(lang,'Reper orientativ de piață. Oferta finală RobotGo, TVA-ul aplicabil, transportul și disponibilitatea se confirmă pentru configurația solicitată.','Indicative market reference. The final RobotGo quote, applicable VAT, shipping and availability are confirmed for your requested configuration.')}</p><p class="market-price-source">${t(lang,'Sursă','Source')}: <a href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">${esc(r.source)}</a> · ${t(lang,'Verificat la','Checked on')} <time datetime="${r.checkedOn}">${r.checkedOn.split('-').reverse().join('.')}</time>.</p><p class="market-price-note">${esc(r.note[locale])}</p>`:`<small class="market-price-note">${t(lang,'Reper orientativ · ofertă RobotGo la cerere','Indicative reference · request a RobotGo quote')}</small>`}</div>`;
 };
 const compact=(p,lang='ro')=>get(p)?amount(p,lang)+' · '+t(lang,'reper UE','EU reference'):text(p,lang);
 window.ROBOTGO_PRICES={get,text,render,compact};
})();
