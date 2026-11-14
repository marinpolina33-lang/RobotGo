/* Shared homepage: full server-rendered catalogue, progressively enhanced filters. */
(()=>{
 'use strict';
 const D=window.ROBOTGO_CATALOG;
 const arrow='<svg class="rg-home-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
 const down='<svg class="rg-home-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M12 4v16m-6-6 6 6 6-6"/></svg>';
 const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const text=(v,lang)=>typeof v==='object'?(v?.[lang]||v?.ro||''):v||'';
 const normal=s=>String(s).normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
 // Hero groups use verified catalogue models. Native cutouts keep the original product pixels.
 const slides=[
  {id:'reception',ro:'Recepție & interacțiune',en:'Reception & interaction',models:['alpha-timo','alpha-amy','alpha-alice'],image:'reception-lineup.webp',names:'Timo · Amy · Alice',tone:'ice'},
  {id:'delivery',ro:'Servire & livrare',en:'Serving & delivery',models:['alpha-panda','alpha-speedybot-max','alpha-panda-hotel'],image:'delivery-lineup.webp',names:'Panda · Speedybot Max · Panda Hotel',tone:'aqua'},
  {id:'humanoid',ro:'Roboți umanoizi',en:'Humanoid robots',models:['leju-kuavo-4pro','rokae-helios','rokae-human-x'],names:'LEJU KUAVO 4 Pro · ROKAE Helios · Human X',tone:'blue',cutouts:[[902,1554,0,0,902,1554,1],[500,863,60,87,380,776,.91],[392,800,23,135,304,566,.96]]},
  {id:'logistics',ro:'Transport & logistică',en:'Transport & logistics',models:['agilex-scout-mini','pudu-t300','geekplus-p-series'],names:'AgileX Scout Mini · PUDU T300 · Geek+ P Series',tone:'mint',cutouts:[[1600,1600,320,595,920,470,.44],[1600,1000,486,191,353,687,.92],[335,184,0,0,335,184,.4]]},
  {id:'arms',ro:'Brațe & manipulare',en:'Arms & manipulation',models:['rokae-ar','dobot-magician-e6'],names:'ROKAE AR · DOBOT Magician E6',tone:'violet',cutouts:[[500,485,9,34,477,385,.86],[1132,1600,317,304,519,774,1]]}
 ];
 const chevron='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';
 const pauseIcon='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zm7 0h3v14h-3z"/></svg>';
 const playIcon='<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m8 4 12 8-12 8z"/></svg>';
 function modelLinks(s){return s.models.map((id,i)=>`<a href="/product/${id}/">${esc(s.names.split(' · ')[i])}</a>`).join('<span aria-hidden="true"> · </span>');}
 function renderCarousel(lang){
  const en=lang==='en',t=(ro,eng)=>en?eng:ro;
  return `<section class="rg-carousel" id="rg-carousel" aria-roledescription="${t('carusel','carousel')}" aria-label="${t('Descoperă roboții pe categorii','Discover robots by category')}">
   <div class="rg-carousel-viewport" id="rg-carousel-viewport">
    ${slides.map((s,i)=>`<div class="rg-carousel-slide rg-carousel-${s.tone}" id="rg-slide-${s.id}" role="group" aria-roledescription="${t('diapozitiv','slide')}" aria-label="${i+1} / ${slides.length} — ${esc(s[en?'en':'ro'])}" ${i?'hidden inert':''}>
     <img class="rg-carousel-backdrop" src="/assets/home/robot-stage.webp" width="1774" height="887" alt="" ${i?'loading="lazy"':'fetchpriority="high"'}>
     <div class="rg-carousel-tint" aria-hidden="true"></div>
     <div class="rg-carousel-art ${s.image?'rg-carousel-composite':'rg-carousel-native'}">${s.image?`<img class="rg-carousel-lineup" src="/assets/home/${s.image}" width="${i===0?1536:1774}" height="${i===0?1024:887}" alt="${esc(s.models.map(id=>D.products.find(p=>p.id===id).name).join(', '))}" ${i?'loading="lazy" decoding="async"':'fetchpriority="high"'}>`:s.models.map((id,k)=>{const p=D.products.find(p=>p.id===id),[w,h,x,y,bw,bh,scale]=s.cutouts[k];return `<a href="/product/${id}/" class="rg-carousel-product" style="height:${scale*100}%" aria-label="${esc(p.name)}"><svg viewBox="${x} ${y} ${bw} ${bh}" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${esc(p.name)}"><image href="/${esc(p.localImage)}" width="${w}" height="${h}"/></svg></a>`;}).join('')}</div>
    </div>`).join('')}
    <div class="rg-carousel-arrows"><button type="button" data-carousel-prev aria-label="${t('Categoria anterioară','Previous category')}">${chevron}</button><button type="button" data-carousel-next aria-label="${t('Categoria următoare','Next category')}">${chevron}</button></div>
    <button type="button" class="rg-carousel-play" data-carousel-play aria-label="${t('Oprește schimbarea automată','Pause automatic slideshow')}">${pauseIcon}</button>
    <span class="rg-carousel-position" aria-hidden="true">01 / 05</span>
   </div>
   <div class="rg-carousel-details wrap"><div class="rg-carousel-caption" aria-live="off"><div><span class="rg-carousel-kicker">${t('DESCOPERĂ POSIBILITĂȚILE','DISCOVER THE POSSIBILITIES')}</span><h2 data-carousel-title>${slides[0][en?'en':'ro']}</h2></div><p data-carousel-models>${modelLinks(slides[0])}</p></div>
    <div class="rg-carousel-categories" role="group" aria-label="${t('Alege categoria din prezentare','Choose slideshow category')}">${slides.map((s,i)=>`<button type="button" data-carousel-select="${i}" aria-pressed="${i===0}" aria-controls="rg-carousel-viewport"><span aria-hidden="true">0${i+1}</span>${esc(s[en?'en':'ro'])}</button>`).join('')}</div>
   </div>
  </section>`;
 }
 let disposeCarousel=()=>{};
 function unmount(){disposeCarousel();disposeCarousel=()=>{};}
 function mountCarousel(lang){
  unmount();
  const root=document.getElementById('rg-carousel');if(!root)return;root.dataset.ready='true';
  const panels=[...root.querySelectorAll('.rg-carousel-slide')],choices=[...root.querySelectorAll('[data-carousel-select]')],toggle=root.querySelector('[data-carousel-play]');
  const media=window.matchMedia('(prefers-reduced-motion: reduce)'),listeners=[];
  let index=0,paused=media.matches,hover=false,focused=false,inView=true,timer=null,touch=null;
  function listen(el,event,fn,options){el.addEventListener(event,fn,options);listeners.push(()=>el.removeEventListener(event,fn,options));}
  function sync(){
   clearTimeout(timer);timer=null;
   toggle.innerHTML=paused?playIcon:pauseIcon;
   toggle.setAttribute('aria-label',lang==='en'?(paused?'Start automatic slideshow':'Pause automatic slideshow'):(paused?'Pornește schimbarea automată':'Oprește schimbarea automată'));
   if(!paused&&!hover&&!focused&&inView&&!document.hidden&&root.isConnected)timer=setTimeout(()=>{show(index+1);},6500);
  }
  function show(next,manual=false){
   index=(next+slides.length)%slides.length;if(manual)paused=true;
   panels.forEach((panel,i)=>{panel.hidden=i!==index;panel.inert=i!==index;});
   choices.forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
   const s=slides[index];root.querySelector('[data-carousel-title]').textContent=s[lang==='en'?'en':'ro'];root.querySelector('[data-carousel-models]').innerHTML=modelLinks(s);
   root.querySelector('.rg-carousel-position').textContent=String(index+1).padStart(2,'0')+' / '+String(slides.length).padStart(2,'0');
   root.querySelector('.rg-carousel-caption').setAttribute('aria-live',manual?'polite':'off');sync();
  }
  listen(root.querySelector('[data-carousel-prev]'),'click',()=>show(index-1,true));
  listen(root.querySelector('[data-carousel-next]'),'click',()=>show(index+1,true));
  choices.forEach((b,i)=>listen(b,'click',()=>show(i,true)));
  listen(toggle,'click',()=>{paused=!paused;sync();});
  listen(root,'pointerenter',event=>{if(event.pointerType==='mouse'){hover=true;sync();}});
  listen(root,'pointerleave',()=>{hover=false;sync();});
  // Keyboard focus stops movement while links and controls are being explored.
  listen(root,'focusin',event=>{focused=event.target.matches(':focus-visible');sync();});
  listen(root,'focusout',event=>{if(!root.contains(event.relatedTarget)){focused=false;sync();}});
  listen(root,'keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowRight'){event.preventDefault();show(index+(event.key==='ArrowRight'?1:-1),true);}});
  const viewport=root.querySelector('.rg-carousel-viewport');
  listen(viewport,'touchstart',event=>{touch=event.touches.length===1?[event.touches[0].clientX,event.touches[0].clientY]:null;},{passive:true});
  listen(viewport,'touchend',event=>{if(!touch||!event.changedTouches.length)return;const p=event.changedTouches[0],dx=p.clientX-touch[0],dy=p.clientY-touch[1];touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)show(index+(dx<0?1:-1),true);},{passive:true});
  listen(viewport,'touchcancel',()=>{touch=null;},{passive:true});
  listen(document,'visibilitychange',sync);
  listen(media,'change',()=>{if(media.matches)paused=true;sync();});
  const observer='IntersectionObserver' in window?new IntersectionObserver(entries=>{inView=entries[0].isIntersecting;sync();},{threshold:.15}):null;
  observer?.observe(viewport);sync();
  disposeCarousel=()=>{clearTimeout(timer);listeners.forEach(remove=>remove());observer?.disconnect();};
 }
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
  return `<section class="rg-home-hero" aria-labelledby="rg-home-title">${renderCarousel(lang)}<div class="wrap">
   <div class="rg-home-intro"><div><span class="eyebrow">ROBOTGO ROMÂNIA · ${t('ROBOTICĂ PENTRU IDEILE TALE','ROBOTICS FOR YOUR IDEAS')}</span><h1 id="rg-home-title">${t('Robotul potrivit.','The right robot.')} <em>${t('Pentru ideea ta.','For your idea.')}</em></h1></div><div class="rg-home-invitation"><p>${t('De la primul „bun venit” la următoarea livrare. Descoperă roboți pentru afaceri, educație și cercetare.','From the first welcome to the next delivery. Discover robots for business, education and research.')}</p><div class="row"><a class="btn" href="#home-catalog">${t('Vezi toți roboții','See all robots')} ${down}</a><a class="rg-home-help" href="/quote/">${t('Ajută-mă să aleg','Help me choose')} ${arrow}</a></div></div></div>
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
  mountCarousel(lang);
  const root=document.getElementById('home-catalog');if(!root||root.dataset.mounted)return;root.dataset.mounted='true';
  const input=root.querySelector('#rg-home-search'),buttons=[...root.querySelectorAll('[data-home-filter]')],cards=[...root.querySelectorAll('[data-home-product]')];let group='all';
  function update(){let count=0;cards.forEach(card=>{const p=D.products.find(p=>p.id===card.dataset.homeProduct);card.hidden=!matches(p,group,input.value);if(!card.hidden)count++;});buttons.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.homeFilter===group)));root.querySelector('#rg-home-result-count').textContent=count+(lang==='en'?(count===1?' model shown':' models shown'):(count===1?' model afișat':' modele afișate'));root.querySelector('#rg-home-empty').hidden=count!==0;}
  buttons.forEach(button=>button.addEventListener('click',()=>{group=button.dataset.homeFilter;update();}));input.addEventListener('input',update);
  root.querySelector('#rg-home-reset').addEventListener('click',()=>{group='all';input.value='';update();input.focus();});
 }
 window.ROBOTGO_HOME={render,mount,unmount,matches,groups,slides};
})();
