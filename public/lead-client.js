/* Direct quotation delivery and optional aggregate measurement. No form data in analytics. */
(()=>{'use strict';
 const ro=()=>document.documentElement.lang!=='en',t=(a,b)=>ro()?a:b;
 let checked=null,path='/',view='',active=0;
 const started=new WeakSet();
 const choice=()=>{try{return localStorage.getItem('robotgo-analytics')||'';}catch{return 'deny';}};
 const allowed=()=>choice()==='allow'&&!navigator.globalPrivacyControl;
 const api=async(endpoint,data)=>{const r=await fetch('/api/auth'+endpoint,{method:data===undefined?'GET':'POST',credentials:'same-origin',cache:'no-store',headers:data===undefined?{}:{'Content-Type':'application/json','X-RobotGo-Request':'1'},body:data===undefined?undefined:JSON.stringify(data),signal:AbortSignal.timeout(15000)});const result=await r.json();if(!r.ok)throw new Error(result.error||'unavailable');return result;};
 function track(event){if(!allowed())return;void api('/events',{consent:true,event,page:path==='/'?'/':path+'/',device:matchMedia('(max-width:800px)').matches?'mobile':'desktop'}).catch(()=>{});}
 function consentUI(){
  document.querySelectorAll('[data-analytics-status]').forEach(el=>el.textContent=navigator.globalPrivacyControl?t('Măsurarea este oprită prin preferința globală de confidențialitate.','Measurement is disabled by your global privacy preference.'):choice()==='allow'?(window.ROBOTGO_METRICOOL?.allowed()?t('Măsurarea internă și Metricool sunt permise.','Internal and Metricool measurement are allowed.'):t('Măsurarea internă este permisă. Metricool este oprit.','Internal measurement is allowed. Metricool is disabled.')):t('Măsurarea opțională este oprită.','Optional measurement is disabled.'));
  const footer=document.querySelector('#footer .wrap');if(!footer||footer.querySelector('.analytics-choice'))return;
  const box=document.createElement('section');box.className='analytics-choice';
  box.innerHTML=`<p>${t('Ne ajuți să îmbunătățim catalogul? Poți permite măsurarea internă și Metricool: pagini publice vizitate, clicuri de contact și surse de trafic. Metricool primește adresa IP pentru măsurarea vizitelor și a țării, fără datele din formulare.','Help improve the catalogue by allowing internal and Metricool measurement of public pages, contact clicks and traffic sources. Metricool receives the IP address to measure visits and country, without form content.')}</p><div class="row"><button class="btn ghost sm" data-analytics="allow">${t('Permit măsurarea','Allow measurement')}</button><button class="btn ghost sm" data-analytics="deny">${t('Nu permit','Decline')}</button><a href="/privacy/">${t('Detalii și preferințe','Details and preferences')}</a></div><p data-analytics-status role="status"></p>`;
  if((!choice()||(choice()==='allow'&&window.ROBOTGO_METRICOOL?.needsConsent()))&&!navigator.globalPrivacyControl)footer.append(box);else{const a=document.createElement('a');a.href='/privacy/';a.textContent=t('Preferințe de măsurare','Measurement preferences');box.replaceChildren(a);footer.append(box);}
 }
 function enhance(next){path=next;const version=++active;document.body.classList.toggle('on-request',['/quote','/checkout','/service'].includes(path));consentUI();window.ROBOTGO_METRICOOL?.track(path);if(path.startsWith('/product/')&&view!==path){view=path;track('product_view');}
  if(!window.ROBOTGO_CONFIG.leadsEnabled||!document.querySelector('form[data-form="request"]'))return;
  if(!checked)checked=api('/capabilities').catch(()=>null);
  void checked.then(cap=>{if(!cap?.leads||version!==active)return;document.querySelectorAll('form[data-form="request"]').forEach(form=>{
   if(form.querySelector('[data-channel="direct"]'))return;
   const group=form.querySelector('.row.more-space');if(!group)return;
   const button=document.createElement('button');button.type='submit';button.className='btn';button.dataset.channel='direct';button.textContent=t('Trimite cererea către RobotGo','Send request to RobotGo');group.prepend(button);
   const note=document.createElement('p');note.className='form-note';note.innerHTML=t('Trimiterea directă înregistrează cererea la RobotGo și afișează un număr de referință. Numele și emailul sunt necesare pentru răspuns. Nu este o comandă. Datele sunt prelucrate pentru această solicitare; ','Direct submission records your request at RobotGo and displays a reference. Name and email are required for a response. This is not an order. Your data is used for this request; ')+`<a href="/privacy/">${t('detalii despre date','privacy details')}</a>.`;group.before(note);
   const hp=document.createElement('div');hp.className='lead-honeypot';hp.setAttribute('aria-hidden','true');hp.innerHTML='<label>Website<input name="website" autocomplete="off" tabindex="-1"></label>';form.append(hp);
   const result=document.createElement('div');result.className='request-receipt';result.hidden=true;result.setAttribute('role','status');result.setAttribute('aria-live','polite');result.dataset.receipt='';group.after(result);
  });});
 }
 document.addEventListener('focusin',e=>{const form=e.target.closest('form[data-form="request"]');if(form&&!started.has(form)){started.add(form);track('form_start');}});
 document.addEventListener('click',e=>{const b=e.target.closest('[data-analytics]');if(b){try{localStorage.setItem('robotgo-analytics',b.dataset.analytics);window.ROBOTGO_METRICOOL?.setConsent(b.dataset.analytics);}catch{}document.querySelectorAll('.analytics-choice').forEach(x=>x.remove());consentUI();window.ROBOTGO_METRICOOL?.track(path);return;}const a=e.target.closest('a,button');if(!a)return;if(a.matches('[data-channel="whatsapp"],[data-action="whatsapp"]')||a.getAttribute('href')?.startsWith('https://wa.me/'))track('whatsapp_click');if(a.matches('[data-channel="email"]')||a.getAttribute('href')?.startsWith('mailto:'))track('email_click');});
 document.addEventListener('submit',async e=>{
  const form=e.target;if(!form.matches('form[data-form="request"]')||e.submitter?.dataset.channel!=='direct')return;e.preventDefault();e.stopImmediatePropagation();
  if(form.dataset.sending==='true'||!form.reportValidity())return;
  const f=Object.fromEntries(new FormData(form)),receipt=form.querySelector('[data-receipt]');
  const show=(message,error=false)=>{receipt.hidden=false;receipt.textContent=message;receipt.classList.toggle('request-error',error);};
  if(!f.name?.trim()||!f.email?.trim()){show(t('Completează numele și emailul pentru a primi un răspuns.','Enter your name and email for a response.'),true);form.elements[!f.name?.trim()?'name':'email'].focus();return;}
  if((f.project||'').trim().length<10){show(t('Descrie proiectul în cel puțin 10 caractere.','Describe your project in at least 10 characters.'),true);form.elements.project.focus();return;}
  const state=window.ROBOTGO_DIAGNOSTICS.getState(),bag=form.dataset.kind==='purchase'?state.cart:form.dataset.kind==='quotation'?state.quote:{};
  const record={type:form.dataset.kind,language:ro()?'ro':'en',acceptPrivacy:f.acknowledge==='on',contact:{name:f.name,email:f.email,phone:f.phone,company:f.company},application:f.domain||'',timeline:f.timeline||'',project:f.project,serviceType:f.kind||'',model:f.model||'',website:f.website||'',source:path==='/'?'/':path+'/',items:Object.entries(bag).map(([id,qty])=>({id,qty}))};
  const fingerprint=JSON.stringify(record);if(form._lastRecord!==fingerprint){form._requestKey=crypto.randomUUID();form._lastRecord=fingerprint;}record.requestKey=form._requestKey;
  form.dataset.sending='true';form.setAttribute('aria-busy','true');const button=e.submitter;button.disabled=true;show(t('Se trimite cererea…','Sending request…'));
  try{const result=await api('/leads',record);if(result.received!==true)throw new Error();show(t('Cererea a fost primită de RobotGo. Număr de referință: ','RobotGo received your request. Reference: ')+result.id+t('. Păstrează acest număr. Echipa va verifica solicitarea și te poate contacta la datele furnizate. Confirmarea nu reprezintă o comandă.','. Keep this reference. The team will review your request and may contact you using the supplied details. Confirmation is not an order.'));}
  catch(err){show(err.message==='too_many_attempts'?t('Ai trimis prea multe solicitări. Încearcă mai târziu sau folosește contactul direct.','Too many requests. Try later or use direct contact.'):t('Nu am putut confirma primirea. Poți reîncerca aceeași cerere sau folosi emailul/WhatsApp.','Receipt could not be confirmed. Retry the same request or use email/WhatsApp.'),true);}
  finally{button.disabled=false;form.dataset.sending='false';form.removeAttribute('aria-busy');}
 },true);
 window.ROBOTGO_LEADS={enhance,track};
})();
