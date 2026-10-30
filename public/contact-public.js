/* Public business details. Values are inserted as text, never as HTML. */
(()=>{'use strict';
 const cfg=window.ROBOTGO_CONFIG||{};
 const str=key=>typeof cfg[key]==='string'?cfg[key].trim():'';
 const text=(tag,value='',className='')=>{const el=document.createElement(tag);el.textContent=value;if(className)el.className=className;return el;};
 const field=(list,label,value,{wide=false,href=''}={})=>{
  if(!value)return;
  const row=text('div','',wide?'business-fact business-fact-wide':'business-fact');
  row.append(text('dt',label));
  const dd=text('dd');
  if(href){const a=text('a',value);a.href=href;dd.append(a);}else dd.textContent=value;
  row.append(dd);list.append(row);
 };
 function section(title){const el=text('section','','business-section');el.append(text('h2',title));return el;}
 function company(ro){
  const el=section(ro?'Datele firmei':'Company details'),dl=text('dl','','business-facts');
  field(dl,ro?'Denumire firmă':'Company name',str('companyName'),{wide:true});
  field(dl,ro?'Cod fiscal (CUI)':'Tax ID (CUI)',str('vatId'));
  field(dl,ro?'Registrul Comerțului':'Trade Register',str('registrationNo'));
  if(cfg.vatRegistered===true)field(dl,'TVA / VAT',ro?'Plătitoare de TVA':'VAT registered');
  field(dl,ro?'Sediu social':'Registered office',str('address'),{wide:true});
  el.append(dl);return el;
 }
 function contact(ro){
  const el=section('Contact'),dl=text('dl','','business-facts');
  const phone=str('phoneNumber').replace(/[\s()-]/g,'');
  if(/^\+?[1-9]\d{6,14}$/.test(phone))field(dl,ro?'Telefon':'Phone',phone,{href:'tel:'+phone});
  const email=str('email');
  if(/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(email))field(dl,'Email',email,{wide:true,href:'mailto:'+email});
  field(dl,ro?'Program':'Opening hours',!ro&&str('openingHoursEn')?str('openingHoursEn'):str('openingHours'),{wide:true});
  el.append(dl);return el;
 }
 function terms(ro){
  const el=section(ro?'Oferte și livrare':'Quotes and delivery'),dl=text('dl','','business-facts');
  field(dl,ro?'Clienți':'Customers',ro?'Persoane fizice și juridice':'Individuals and businesses');
  field(dl,ro?'Monedă':'Currency','EUR');
  field(dl,ro?'Plată':'Payment',ro?'Avans prin transfer bancar':'Deposit by bank transfer');
  field(dl,ro?'Transport':'Transport',ro?'Inclus doar în România':'Included only within Romania');
  el.append(dl);
  const details=text('details','','business-quote-details');
  details.append(text('summary',ro?'Detalii despre ofertă':'Quote details'));
  details.append(text('p',ro?'Valoarea avansului, termenele de plată, TVA și livrarea se precizează în ofertă. Datele bancare se comunică doar în ofertă.':'The deposit amount, payment schedule, VAT and delivery are specified in the quote. Bank details are provided only in the quote.'));
  el.append(details);return el;
 }
 function mount(){
  const ro=document.documentElement.lang!=='en';
  const signature=JSON.stringify([ro,cfg]);
  for(const [id,isFooter]of [['robotgo-contact-details',false],['robotgo-footer-details',true]]){
   const host=document.getElementById(id);if(!host||host.dataset.signature===signature)continue;
   host.dataset.signature=signature;host.replaceChildren();
   const grid=text('div','','business-grid');
   grid.append(contact(ro),company(ro));host.append(grid);
   if(!isFooter)host.append(terms(ro));
  }
 }
 let queued=false;
 function schedule(){if(queued)return;queued=true;queueMicrotask(()=>{queued=false;mount();});}
 for(const id of ['main','footer']){const root=document.getElementById(id);if(root)new MutationObserver(schedule).observe(root,{childList:true});}
 new MutationObserver(schedule).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 window.addEventListener('hashchange',schedule);schedule();
})();
