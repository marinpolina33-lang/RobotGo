/** Generate real HTML pages from the same public catalogue as the interactive app. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const origin='https://robotgo.ro';
const esc=(value='')=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const ro=value=>value&&typeof value==='object'?value.ro??'':value??'';
const json=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/>/g,'\\u003e').replace(/&/g,'\\u0026');

export function generateSearchPages(root,dist,template){
 const data=JSON.parse(fs.readFileSync(path.join(root,'public/catalog.json'),'utf8'));
 const visuals=JSON.parse(fs.readFileSync(path.join(root,'public/visuals.json'),'utf8'));
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'public/site-config.js'),'utf8'),context);
 const cfg=context.window.ROBOTGO_CONFIG;
 const productUrl=p=>'/product/'+p.id+'/';
 const link=(url,label,cls='')=>`<a href="${esc(url)}" class="${esc(cls)}">${esc(label)}</a>`;
 const image=p=>`<span class="media has-image"><img src="/${esc(p.localImage)}" alt="${esc(p.name)}" width="640" height="480" loading="lazy"></span>`;
 const cards=products=>`<div class="product-grid">${products.map(p=>`<article class="product-card"><a class="product-photo-link" href="${productUrl(p)}">${image(p)}</a><div class="product-info"><span class="product-brand">${esc(p.brand)}</span><h2>${link(productUrl(p),p.name)}</h2><p>${esc(ro(p.description))}</p><p>Preț la ofertă</p>${link(productUrl(p),'Vezi modelul','btn sm')}</div></article>`).join('')}</div>`;
 const header=`<header class="ap-header"><div class="wrap ap-header-top">${link('/','RobotGo','logo')}<nav class="ap-nav" aria-label="Navigare principală">${link('/','Acasă')}${link('/shop/','Shop')}${link('/contact/','Contact')}</nav></div></header>`;
 const contact=`<p>${esc(cfg.companyName)} · CUI ${esc(cfg.vatId)}</p><p>${esc(cfg.address)}</p><p>${link('tel:'+cfg.phoneNumber,cfg.phoneNumber)} · ${link('mailto:'+cfg.email,cfg.email)}</p><p>${esc(cfg.openingHours)}</p>`;
 const footer=`<footer class="site-footer"><div class="wrap"><h2>Contact RobotGo</h2>${contact}${link('/shop/','Catalog de roboți')} · ${link('/contact/','Contact și oferte')}</div></footer>`;
 const organization={'@type':'Organization','@id':origin+'/#organization',name:'RobotGo',legalName:cfg.companyName,url:origin+'/',telephone:cfg.phoneNumber,email:cfg.email};
 const homepage={route:'/',title:'RobotGo România — Roboți pentru afaceri, educație și cercetare',description:'RobotGo România: roboți umanoizi, coboți și roboți mobili pentru afaceri, educație și cercetare. Compară modelele și solicită o ofertă.',body:`<section class="ap-home"><div class="ap-cinematic" style="--ap-bg:url('/${esc(visuals.background)}');--ap-floor:url('/${esc(visuals.floor)}')"><div class="wrap ap-scene"><div class="ap-copy"><span class="ap-kicker">ROBOTGO · ROBOTICĂ, PE ÎNȚELESUL TĂU</span><h1><span>Robotul potrivit.</span><em>Pentru ideea ta.</em></h1><p>Ce ai vrea să facă un robot pentru tine? Descoperă modele, vezi exemple și găsește un punct de pornire pentru proiectul tău.</p></div><div class="ap-art-group"><div class="ap-robot"><img src="/${esc(visuals.hero)}" width="621" height="785" alt="Vizual de concept RobotGo: robot cu un picior ridicat și unul sprijinit pe sol"></div></div></div></div><div class="wrap"><div class="ap-cta-row">${link('/shop/','Explorează catalogul','btn')}${link('/contact/','Solicită o ofertă','btn ghost')}</div><section class="section"><h2>RobotGo România — roboți pentru idei practice</h2><p>Explorează roboți umanoizi, câini roboți, roboți mobili, coboți, brațe și componente pentru afaceri, educație și cercetare. Alegerea configurației și disponibilitatea se confirmă prin ofertă.</p>${cards(data.products.slice(0,6))}${link('/shop/','Vezi toate cele '+data.products.length+' de modele','btn more-space')}</section></div></section>`,schema:[organization,{'@type':'WebSite','@id':origin+'/#website',url:origin+'/',name:'RobotGo România',alternateName:'RobotGo',inLanguage:'ro-RO',publisher:{'@id':origin+'/#organization'}}]};
 const pages=[homepage,{route:'/shop/',title:'Catalog de roboți în România | RobotGo',description:'Explorează '+data.products.length+' de modele de roboți: umanoizi, câini roboți, coboți, roboți mobili și componente. Fotografii, specificații și solicitări de ofertă.',body:`<div class="wrap"><header class="pagehead"><span class="eyebrow">SHOP ROBOTGO</span><h1>Catalog de roboți</h1><p>Compară modelele după tip și aplicație. Prețul, echiparea și disponibilitatea se confirmă prin ofertă.</p></header>${cards(data.products)}</div>`,schema:[]},{route:'/contact/',title:'Contact și solicitări de ofertă | RobotGo România',description:'Contactează RobotGo pentru roboți și configurații la ofertă. Telefon '+cfg.phoneNumber+', email '+cfg.email+'. Livrare în România.',body:`<div class="wrap section"><h1>Contact RobotGo</h1><p>Discută cu noi despre modelul, configurația și aplicația potrivite proiectului tău.</p>${contact}<h2>Oferte și livrare</h2><p>Pentru persoane fizice și juridice. Oferte în EUR; transport inclus în prețul ofertat doar în România. Plata se face cu avans prin transfer bancar, în condițiile ofertei acceptate.</p><p>${link('https://wa.me/'+cfg.whatsappNumber,'WhatsApp','btn')}${link('/#/quote','Solicită ofertă','btn light')}</p></div>`,schema:[organization]}];
 const labels={height:'Înălțime',payload:'Sarcină',dof:'Grade de libertate',speed:'Viteză',configuration:'Configurație',battery:'Baterie',dimensions:'Dimensiuni',weight:'Greutate',reach:'Rază de lucru',protection:'Protecție',runtime:'Autonomie',accuracy:'Precizie',repeatability:'Repetabilitate'};
 for(const p of data.products){
  const category=data.categories.find(c=>c.id===p.category);
  pages.push({route:productUrl(p),title:p.name+' — specificații și ofertă | RobotGo România',description:ro(p.description),body:`<div class="wrap section"><nav aria-label="Navigare ierarhică">${link('/','Acasă')} / ${link('/shop/','Catalog')} / ${esc(p.name)}</nav><div class="detail-top"><div class="detail-visual">${image(p)}<small>${esc(ro(p.imageNote))}</small></div><div class="detail-info"><p>${esc(p.brand)} · ${esc(ro(category?.name))}</p><h1>${esc(p.name)}</h1><p class="description">${esc(ro(p.description))}</p><h2>Preț la ofertă</h2><p>Configurația, prețul, disponibilitatea și termenul de livrare se confirmă prin ofertă. Oferte în EUR, cu transport inclus în prețul ofertat doar în România.</p>${link('/#/quote?product='+encodeURIComponent(p.id),'Solicită ofertă','btn')}${link('/contact/','Contact','btn light')}</div></div><section class="section"><h2>Detalii tehnice</h2><table class="spec-table"><tbody><tr><th scope="row">Tip</th><td>${esc(ro(p.type))}</td></tr>${Object.entries(p.specs||{}).map(([key,value])=>`<tr><th scope="row">${esc(labels[key]||key)}</th><td>${esc(ro(value))}</td></tr>`).join('')}</tbody></table></section><section class="section"><h2>Exemple de utilizare</h2><ul>${(p.examples?.ro||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ul><p>Aplicațiile se validează prin integrare și testare pentru configurația ofertată. Operarea și întreținerea se fac potrivit documentației.</p>${link('/shop/','Înapoi la catalog','btn light')}</section></div>`,schema:[{'@type':'Product','@id':origin+productUrl(p)+'#product',url:origin+productUrl(p),name:p.name,description:ro(p.description),image:origin+'/'+p.localImage,brand:{'@type':'Brand',name:p.brand}}]});
 }
 for(const page of pages){
  const canonical=origin+page.route;
  let html=template.replace(/<title>.*?<\/title>/,`<title>${esc(page.title)}</title>`)
   .replace(/(<meta (?:name="description"|property="og:description"|name="twitter:description") content=")[^"]*(">)/g,`$1${esc(page.description)}$2`)
   .replace(/(<meta (?:property="og:title"|name="twitter:title") content=")[^"]*(">)/g,`$1${esc(page.title)}$2`)
   .replace(/(<meta property="og:url" content=")[^"]*(">)/,`$1${canonical}$2`)
   .replace(/(<link rel="canonical" href=")[^"]*(">)/,`$1${canonical}$2`)
   .replace('<div id="header"></div>',`<div id="header">${header}</div>`)
   .replace('<main id="main" tabindex="-1"></main>',`<main id="main" tabindex="-1">${page.body}</main>`)
   .replace(/<noscript>[\s\S]*?<\/noscript>/,'<noscript><p class="wrap">Activează JavaScript pentru filtre, comparație și galeria interactivă.</p></noscript>')
   .replace('<div id="footer"></div>',`<div id="footer">${footer}</div>`);
  if(page.schema.length)html=html.replace('</head>',`<script type="application/ld+json">${json({'@context':'https://schema.org','@graph':page.schema})}</script></head>`);
  const target=path.join(dist,page.route,'index.html');fs.mkdirSync(path.dirname(target),{recursive:true});fs.writeFileSync(target,html);
 }
 fs.writeFileSync(path.join(dist,'sitemap.xml'),'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(p=>`  <url><loc>${origin}${p.route}</loc></url>`).join('\n')+'\n</urlset>\n');
 return pages;
}
