/* Shared homepage: full server-rendered catalogue, progressively enhanced filters. */
(()=>{
 'use strict';
 const D=window.ROBOTGO_CATALOG;
 const arrow='<svg class="rg-home-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
 const down='<svg class="rg-home-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg>';
 const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const text=(v,lang)=>typeof v==='object'?(v?.[lang]||v?.ro||''):v||'';
 const normal=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 const alpha=D.products.filter(p=>p.brandId==='alpha-robotics');
 const groups=[
  ['all','Toți roboții','All robots',()=>true],
  ['reception','Recepție','Reception',p=>p.brandId==='alpha-robotics'&&p.tasks.includes('interaction')],
  ['serving','Servire & hoteluri','Serving & hotels',p=>p.tasks.includes('delivery')&&p.domains.includes('horeca')],
  ['humanoid','Umanoizi','Humanoids',p=>p.category==='umanoizi'],
  ['cleaning','Curățenie','Cleaning',p=>p.tasks.includes('cleaning')],
  ['quadruped','Câini roboți & hibrizi','Robot dogs & hybrids',p=>['patrupezi','hibrizi'].includes(p.category)],
  ['logistics','Logistică','Logistics',p=>p.tasks.includes('logistics')||p.category==='ugv-civile'],
  ['arms','Coboți & componente','Cobots & components',p=>['coboti','accesorii'].includes(p.category)],
  ['alpha','Alpha Robotics','Alpha Robotics',p=>p.brandId==='alpha-robotics']
 ];
 function matches(p,group='all',query=''){
  return (groups.find(g=>g[0]===group)||groups[0])[3](p)&&normal([p.name,p.brand,text(p.type,'ro'),text(p.type,'en'),text(p.description,'ro'),text(p.description,'en')].join(' ')).includes(normal(query).trim());
 }
 function render(lang='ro'){
  const en=lang==='en',t=(ro,enText)=>en?enText:ro;
  const ordered=[...D.products].sort((a,b)=>{
   const first=['unitree-g1','pudu-bellabot','alpha-timo','alpha-amy','alpha-alice','alpha-panda','alpha-speedybot-max','alpha-panda-hotel','pudu-cc1','unitree-go2'];
   const ai=first.indexOf(a.id),bi=first.indexOf(b.id);return (ai<0?100+(a.priority||0):ai)-(bi<0?100+(b.priority||0):bi);
  });
  return `<section class="rg-home-hero" aria-labelledby="rg-home-title"><div class="wrap">
   <div class="rg-home-intro"><div><span class="eyebrow">ROBOTGO ROMÂNIA · ${t('ROBOTICĂ PENTRU IDEILE TALE','ROBOTICS FOR YOUR IDEAS')}</span><h1 id="rg-home-title">${t('Robotul potrivit.','The right robot.')} <em>${t('Pentru ideea ta.','For your idea.')}</em></h1></div><div class="rg-home-invitation"><p>${t('De la primul „bun venit” la următoarea livrare. Descoperă roboți pentru afaceri, educație și cercetare.','From the first welcome to the next delivery. Discover robots for business, education and research.')}</p><div class="row"><a class="btn" href="#home-catalog">${t('Vezi toți roboții','See all robots')} ${down}</a><a class="rg-home-help" href="/quote/">${t('Ajută-mă să aleg','Help me choose')} ${arrow}</a></div></div></div>
   <div class="rg-home-stage"><div class="rg-home-stage-top"><span>${t('NOI ÎN CATALOG','NEW IN THE CATALOGUE')}</span><strong>Alpha Robotics</strong><span>${t('Recepție · Servire · Livrare','Reception · Serving · Delivery')}</span></div><div class="rg-home-lineup">${alpha.map(p=>`<a href="/product/${p.id}/" class="rg-home-robot"><img src="/${esc(p.localImage)}" width="377" height="430" fetchpriority="high" alt="${esc(p.name+' — '+text(p.type,lang))}"><span>${esc(p.name.replace(/^Alpha /,''))} <i aria-hidden="true">${arrow}</i></span></a>`).join('')}</div><p class="rg-home-stage-note">${t('Fotografii oficiale Alpha Robotics · selectează un robot pentru detalii','Official Alpha Robotics photographs · select a robot for details')}</p></div>
   <div class="rg-home-summary"><span><b>${D.products.length}</b> ${t('modele și familii de produse','models and product families')}</span><span><b>${D.brands.length}</b> ${t('branduri în catalog','brands in the catalogue')}</span><span>${t('Configurație și disponibilitate prin ofertă','Configuration and availability by quotation')}</span></div>
  </div></section>
  <section class="wrap rg-home-catalog" id="home-catalog" aria-labelledby="rg-home-catalog-title"><div class="rg-home-catalog-heading"><div><span class="eyebrow">${t('ALEGE DUPĂ CE AI DE FĂCUT','CHOOSE BY WHAT YOU NEED TO DO')}</span><h2 id="rg-home-catalog-title">${t('Toți roboții, într-un singur loc.','All robots, in one place.')}</h2></div><label class="rg-home-search">${t('Caută un model sau un brand','Find a model or brand')}<input id="rg-home-search" type="search" placeholder="${t('Ex.: G1, BellaBot, Alpha…','E.g. G1, BellaBot, Alpha…')}" autocomplete="off" aria-controls="rg-home-products"></label></div>
   <div class="rg-home-filters" role="group" aria-label="${t('Filtrează roboții după utilizare','Filter robots by use')}">${groups.map(g=>`<button type="button" data-home-filter="${g[0]}" aria-pressed="${g[0]==='all'}" aria-controls="rg-home-products">${esc(g[en?2:1])}<span>${D.products.filter(g[3]).length}</span></button>`).join('')}</div>
   <div class="rg-home-results"><p id="rg-home-result-count" role="status" aria-live="polite">${D.products.length} ${t('modele afișate','models shown')}</p><a href="/shop/">${t('Filtre avansate și comparație','Advanced filters and comparison')} ${arrow}</a></div>
   <div class="rg-home-grid" id="rg-home-products">${ordered.map(p=>`<article class="rg-home-card" data-home-product="${p.id}"><a class="rg-home-photo ${p.id==='unitree-go2'?'rg-home-photo-outdoors':''}" href="/product/${p.id}/" aria-label="${esc(t('Descoperă ','Discover ')+p.name)}"><img src="/${esc(p.localImage)}" alt="${esc(p.name+' — '+text(p.type,lang))}" width="480" height="440" loading="lazy" decoding="async">${p.brandId==='alpha-robotics'?`<span class="rg-home-new">${t('NOU','NEW')}</span>`:''}<span class="rg-home-photo-arrow" aria-hidden="true">${arrow}</span></a><div class="rg-home-card-copy"><span class="rg-home-brand">${esc(p.brand)} · ${esc(text(p.type,lang))}</span><h3><a href="/product/${p.id}/">${esc(p.name)}</a></h3><p>${esc(window.ROBOTGO_PRACTICAL.cardBrief(p,lang))}</p>${window.ROBOTGO_PRICES.render(p,lang)}<div class="rg-home-card-actions"><a href="/product/${p.id}/">${t('Vezi detalii','View details')} ${arrow}</a><a href="/quote/?product=${p.id}" aria-label="${esc(t('Solicită ofertă pentru ','Request a quote for ')+p.name)}">${t('Solicită ofertă','Request quote')}</a></div></div></article>`).join('')}</div>
   <div class="rg-home-empty" id="rg-home-empty" hidden><h3>${t('Niciun model pentru această selecție.','No models match this selection.')}</h3><p>${t('Încearcă alt nume sau revino la întregul catalog.','Try another name or return to the full catalogue.')}</p><button class="btn" type="button" id="rg-home-reset">${t('Arată toți roboții','Show all robots')}</button></div>
  </section>
  <section class="wrap rg-home-scenes" aria-labelledby="rg-home-scenes-title"><div><span class="eyebrow">${t('DE LA PRODUS LA UTILIZARE','FROM PRODUCT TO APPLICATION')}</span><h2 id="rg-home-scenes-title">${t('Imaginează-i în spațiul tău.','Picture them in your space.')}</h2><p>${t('Exemple vizuale prezentate de Alpha Robotics. Traseele, limbile și integrarea se verifică pentru fiecare proiect.','Visual examples presented by Alpha Robotics. Routes, languages and integration are checked for each project.')}</p></div><div class="rg-home-scenes-grid">${[
   ['amy-reception','alpha-amy','Recepție care atrage atenția','A reception that draws attention','Amy prezintă informații și ghidează vizitatorii.','Amy presents information and guides visitors.'],
   ['panda-delivery','alpha-panda','Un ajutor între bucătărie și sală','A helper between kitchen and dining room','Panda transportă preparatele; echipa se ocupă de preluare.','Panda transports food; your team handles collection.'],
   ['panda-hotel','alpha-panda-hotel','Livrări pentru oaspeți','Deliveries for guests','Panda Hotel transportă articole în compartimente închise.','Panda Hotel transports items in enclosed compartments.']
  ].map(([img,id,ro,enTitle,desc,enDesc])=>`<a class="rg-home-scene" href="/product/${id}/"><img src="/assets/products/scenario-${img}.webp" width="800" height="500" loading="lazy" alt="${esc(t(desc,enDesc))} — Alpha Robotics"><div><h3>${esc(t(ro,enTitle))} ${arrow}</h3><p>${esc(t(desc,enDesc))}</p><small>${t('Imagine de prezentare','Presentation image')} · Alpha Robotics</small></div></a>`).join('')}</div></section>`;
 }
 function mount(lang='ro'){
  const root=document.getElementById('home-catalog');if(!root||root.dataset.mounted)return;root.dataset.mounted='true';
  const input=root.querySelector('#rg-home-search'),buttons=[...root.querySelectorAll('[data-home-filter]')],cards=[...root.querySelectorAll('[data-home-product]')];let group='all';
  function update(){let count=0;cards.forEach(card=>{const p=D.products.find(p=>p.id===card.dataset.homeProduct);card.hidden=!matches(p,group,input.value);if(!card.hidden)count++;});buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.homeFilter===group)));root.querySelector('#rg-home-result-count').textContent=count+(lang==='en'?(count===1?' model shown':' models shown'):(count===1?' model afișat':' modele afișate'));root.querySelector('#rg-home-empty').hidden=count!==0;}
  buttons.forEach(button=>button.addEventListener('click',()=>{group=button.dataset.homeFilter;update();}));input.addEventListener('input',update);
  root.querySelector('#rg-home-reset').addEventListener('click',()=>{group='all';input.value='';update();input.focus();});
 }
 window.ROBOTGO_HOME={render,mount,matches,groups};
})();
