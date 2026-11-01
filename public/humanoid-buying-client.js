/* Progressive enhancement: the complete comparison remains readable without JS. */
(()=>{'use strict';
 const B=window.ROBOTGO_BUYING,state={ids:new Set(),brand:'',domain:'',only:false};
 function enhance(path,lang='ro'){
  const t=(a,b)=>lang==='en'?b:a,root=document.querySelector('.humanoid-comparison');
  document.body.classList.toggle('on-humanoid-comparison',path===B.path);
  if(root&&!root.dataset.enhanced){
   root.dataset.enhanced='true';const ids=state.ids,get=s=>root.querySelector(s),all=s=>[...root.querySelectorAll(s)];
   all('[data-humanoid-controls],[data-humanoid-actions],.humanoid-select').forEach(el=>el.hidden=false);
   get('[data-humanoid-brand]').value=state.brand;get('[data-humanoid-domain]').value=state.domain;get('[data-humanoid-only]').checked=state.only;
   all('[data-humanoid-select]').forEach(el=>el.checked=ids.has(el.dataset.humanoidSelect));
   const rows=all('[data-humanoid-row]');
   function update(message=''){
    const eligible=new Set(B.select(get('[data-humanoid-brand]').value,get('[data-humanoid-domain]').value).map(p=>p.id)),only=get('[data-humanoid-only]').checked;
    state.brand=get('[data-humanoid-brand]').value;state.domain=get('[data-humanoid-domain]').value;state.only=only;
    for(const row of rows)row.hidden=!eligible.has(row.dataset.humanoidRow)||(only&&!ids.has(row.dataset.humanoidRow));
    const count=rows.filter(r=>!r.hidden).length;
    get('[data-humanoid-status]').textContent=message||t(`${count} din 8 modele afișate. Selecție: ${ids.size} / 3.`,`${count} of 8 models shown. Shortlist: ${ids.size} / 3.`);
    get('[data-humanoid-empty]').hidden=count>0;
    get('[data-humanoid-selected]').textContent=ids.size?t('Selecția ta: ','Your shortlist: ')+B.products.filter(p=>ids.has(p.id)).map(p=>p.name).join(', '):t('Selectează până la 3 modele pentru aceeași cerere de ofertă.','Select up to 3 models for the same quotation request.');
    get('[data-humanoid-quote]').disabled=!ids.size;get('[data-humanoid-csv]').disabled=!ids.size&&!count;
   }
   root.addEventListener('change',e=>{
    const id=e.target.dataset.humanoidSelect;if(id){if(e.target.checked){if(ids.size===3){e.target.checked=false;update(t('Poți selecta cel mult 3 modele. Elimină unul pentru a adăuga altul.','Select up to 3 models. Remove one to add another.'));return;}ids.add(id);}else ids.delete(id);}update();
   });
   root.addEventListener('click',e=>{
    if(e.target.closest('[data-humanoid-reset]')){get('[data-humanoid-brand]').value='';get('[data-humanoid-domain]').value='';get('[data-humanoid-only]').checked=false;update();}
    if(e.target.closest('[data-humanoid-clear]')){ids.clear();all('[data-humanoid-select]').forEach(el=>el.checked=false);get('[data-humanoid-only]').checked=false;update();}
    if(e.target.closest('[data-humanoid-quote]')&&ids.size)location.assign(B.quoteUrl([...ids]));
    if(e.target.closest('[data-humanoid-csv]')){const chosen=ids.size?[...ids]:rows.filter(r=>!r.hidden).map(r=>r.dataset.humanoidRow);if(!chosen.length)return;const url=URL.createObjectURL(new Blob([B.csv(chosen,lang)],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download='robotgo-comparatie-umanoizi.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
   });update();
  }
  if(path!=='/quote')return;
  const form=document.querySelector('form[data-form="request"]');if(!form||form.querySelector('[data-humanoid-brief]'))return;
  const helper=document.createElement('details');helper.className='humanoid-brief';helper.dataset.humanoidBrief='';
  helper.innerHTML=`<summary>${t('Ajutor pentru cerințele unui proiect cu umanoizi','Help describing a humanoid project')}</summary><p>${t('Alege un punct de pornire. Întrebările se adaugă în descriere; completează-le înainte de trimitere.','Choose a starting point. Questions are added to the description; complete them before sending.')}</p><label for="humanoid-scenario">${t('Scenariu de evaluat','Scenario to evaluate')}</label><select class="field" id="humanoid-scenario"><option value="research">${t('Laborator / programare','Laboratory / programming')}</option><option value="handling">${t('Manipulare / integrare','Handling / integration')}</option><option value="event">${t('Demonstrație / eveniment','Demonstration / event')}</option></select><button class="btn light more-space" type="button" data-humanoid-template>${t('Adaugă întrebările în descriere','Add questions to the description')}</button><p role="status" data-humanoid-brief-status></p>`;
  form.querySelector('#project')?.closest('.form-field')?.before(helper);
  if(new URLSearchParams(location.search).get('brief')==='humanoid')helper.open=true;
  helper.querySelector('button').addEventListener('click',()=>{
   const project=form.elements.project,status=helper.querySelector('[data-humanoid-brief-status]'),key=helper.querySelector('select').value;
   const scenarios={research:t('Experiment și rezultat urmărit: \nSDK / ROS, interfețe și date necesare: ','Experiment and intended result: \nSDK / ROS, interfaces and required data: '),handling:t('Obiect, dimensiuni, masă și sculă: \nPreluare, depunere și traseu: ','Object, dimensions, mass and tool: \nPickup, placement and route: '),event:t('Public, locație și durată: \nSecvență dorită, operator și mod de control: ','Audience, venue and duration: \nDesired sequence, operator and control mode: ')};
   const marker=t('Cerințe pentru proiectul cu umanoizi:','Humanoid project requirements:');
   if(project.value.includes(marker)){status.textContent=t('Întrebările sunt deja în descriere. Le poți edita direct acolo.','Questions are already in the description. Edit them directly there.');project.focus();return;}
   const addition=marker+'\n'+scenarios[key]+'\n'+t('Spațiu, suprafețe și restricții: \nVersiune, accesorii și documentație cerute: \nCriterii de acceptare (rezultat, timp, intervenții): \nEchipă, termen și buget orientativ: ','Workspace, surfaces and constraints: \nRequired version, accessories and documentation: \nAcceptance criteria (result, time, interventions): \nTeam, timeframe and indicative budget: '),value=(project.value.trim()?project.value.trim()+'\n\n':'')+addition;
   if(value.length>project.maxLength){status.textContent=t('Descrierea este prea lungă pentru a adăuga întrebările. Scurtează textul sau completează cerințele direct.','The description is too long to add these questions. Shorten it or enter requirements directly.');return;}
   project.value=value;project.dispatchEvent(new Event('input',{bubbles:true}));status.textContent=t('Întrebările au fost adăugate. Completează detaliile și verifică descrierea înainte de trimitere.','Questions added. Fill in the details and review the description before sending.');project.focus();
  });
 }
 window.ROBOTGO_BUYING_UI={enhance};
})();
