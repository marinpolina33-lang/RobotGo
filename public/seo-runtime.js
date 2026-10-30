/* Preserve the same metadata after JavaScript renders a public page. */
(()=>{
 'use strict';
 const seo=window.ROBOTGO_SEO;
 seo.apply=(path,lang='ro')=>{
  const page=seo.pages[path];if(!page)return;
  const product=page.productId&&window.ROBOTGO_CATALOG.products.find(p=>p.id===page.productId);
  const en=lang==='en',title=en?(product?product.name+' — specifications and quote | RobotGo':({'/':'RobotGo Romania — Robots for business, education and research','/shop':'Robot catalogue in Romania | RobotGo','/contact':'Contact and quotations | RobotGo Romania'}[path]||document.querySelector('#main h1')?.textContent+' | RobotGo')):page.title;
  const description=en?(product?.description.en||document.querySelector('#main .pagehead p')?.textContent||page.description):page.description;
  document.title=title;
  for(const [selector,value]of [['meta[name="description"]',description],['meta[property="og:title"]',title],['meta[name="twitter:title"]',title],['meta[property="og:description"]',description],['meta[name="twitter:description"]',description],['meta[property="og:locale"]',en?'en_GB':'ro_RO']]){const el=document.querySelector(selector);if(el)el.setAttribute('content',value);}
 };
})();
