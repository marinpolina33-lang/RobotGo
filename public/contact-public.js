/* RobotGo v0.4h — optional public-contact display. No credentials, no network calls.
   Load AFTER app.js. Values come from window.ROBOTGO_CONFIG.
   This adds contact details; it does not create mailboxes or send forms. */
(()=>{'use strict';
 const cfg=window.ROBOTGO_CONFIG||{};
 const main=document.getElementById('main');
 if(!main)return;
 const text=(tag,value,cls)=>{const n=document.createElement(tag);n.textContent=value;if(cls)n.className=cls;return n;};
 const str=k=>typeof cfg[k]==='string'?cfg[k].trim():'';
 const digits=v=>/^\+?[1-9]\d{6,14}$/.test(v.replace(/[\s()-]/g,''))?v.replace(/[\s()-]/g,''):'';
 function mount(){
  if((location.hash||'#/').split('?')[0]!=='#/contact')return;
  const ro=document.documentElement.lang!=='en';
  const values=['companyName','email','phoneNumber','address','vatId','registrationNo','openingHours'].map(str);
  if(!values.some(Boolean))return;
  const signature=JSON.stringify([ro,...values,cfg.vatRegistered]);
  const old=document.getElementById('robotgo-company-contact');
  if(old?.dataset.signature===signature)return;
  old?.remove();
  const section=text('section','', 'panel');section.id='robotgo-company-contact';section.dataset.signature=signature;
  section.setAttribute('aria-label',ro?'Date de contact':'Contact details');section.style.margin='20px 0';
  section.append(text('h2',ro?'Date de contact':'Contact details'));
  if(str('companyName'))section.append(text('p',str('companyName')));
  const email=str('email');
  if(/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)&&!/["'\r\n]/.test(email)){
   const p=text('p','Email: '),a=text('a',email);a.href='mailto:'+encodeURIComponent(email);p.append(a);section.append(p);
  }
  const phone=digits(str('phoneNumber'));
  if(phone){const p=text('p',ro?'Telefon: ':'Phone: '),a=text('a',phone);a.href='tel:'+phone;p.append(a);section.append(p);}
  for(const [key,labelRo,labelEn]of [['address','Adresă','Address'],['vatId','Cod fiscal','Tax ID'],['registrationNo','Înregistrare','Registration'],['openingHours','Program','Opening hours']]){
   if(str(key))section.append(text('p',(ro?labelRo:labelEn)+': '+(key==='openingHours'&&!ro&&str('openingHoursEn')?str('openingHoursEn'):str(key))));
  }
  if(cfg.vatRegistered===true)section.append(text('p',ro?'Statut TVA: societate plătitoare de TVA.':'VAT status: VAT-registered company.'));
  section.append(text('p',ro?'Persoane fizice și juridice · Oferte în EUR · Transport inclus în prețul ofertat doar în România · Plată cu avans prin transfer bancar, conform ofertei acceptate.':'Individuals and businesses · Quotes in EUR · Transport included in the quoted price only within Romania · Deposit by bank transfer under the accepted quote.'));
  section.append(text('p',ro?'Trimite solicitarea prin email sau WhatsApp. Valoarea avansului, termenele de plată, disponibilitatea, livrarea și TVA se detaliază în ofertă. Datele bancare sunt comunicate doar în ofertă.':'Send your request by email or WhatsApp. The deposit amount, payment schedule, availability, delivery and VAT are detailed in the quote. Bank details are provided only in the quote.','muted'));
  const wrap=main.querySelector('.wrap');if(!wrap)return;
  const grid=wrap.querySelector('.guide-grid');if(grid)grid.before(section);else wrap.append(section);
 }
 let queued=false;
 function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;mount();});}
 new MutationObserver(schedule).observe(main,{childList:true});
 new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 window.addEventListener('hashchange',schedule);schedule();
})();
