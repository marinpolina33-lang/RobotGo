/* Shared, dependency-free rendering for the interactive site and generated HTML. */
(()=>{'use strict';
 const data=window.ROBOTGO_SOCIAL_DATA;
 const esc=(s='')=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const tr=(lang,ro,en)=>lang==='en'?en:ro;
 const names={youtube:'YouTube',tiktok:'TikTok',facebook:'Facebook',instagram:'Instagram'};
 const platformName=(network,lang)=>network==='website'?tr(lang,'Site-ul producătorului','Manufacturer website'):names[network];
 const paths={youtube:'M21 7.5a3 3 0 0 0-2.1-2.1C17 5 12 5 12 5s-5 0-6.9.4A3 3 0 0 0 3 7.5 31 31 0 0 0 3 16.5a3 3 0 0 0 2.1 2.1C7 19 12 19 12 19s5 0 6.9-.4a3 3 0 0 0 2.1-2.1 31 31 0 0 0 0-9ZM10 9l5 3-5 3Z',facebook:'M14 21v-8h3l.5-4H14V7c0-1 .3-2 2-2h2V1.5A25 25 0 0 0 15 1c-3 0-5 2-5 5v3H7v4h3v8',instagram:'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm10 4h.01M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z',tiktok:'M14 3v12.5A4.5 4.5 0 1 1 10 11v4a1 1 0 1 0 1 1V3h3Zm0 0c0 4 3 6 6 6v4c-3 0-5-1-6-3'};
 const icon=network=>`<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="${paths[network]||'m9 5 11 7-11 7Z'}"/></svg>`;
 function external(url,label,cls='',extra=''){
  if(!/^https:\/\//.test(url))return '';
  return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener noreferrer" ${extra}>${label}<span class="rg-external" aria-hidden="true">↗</span></a>`;
 }
 function channels(lang='ro'){
  return `<section class="rg-social" aria-label="${tr(lang,'Canalele oficiale RobotGo','Official RobotGo channels')}"><div><h2>${tr(lang,'Urmărește RobotGo','Follow RobotGo')}</h2><p>${tr(lang,'Roboți în acțiune, idei și prezentări pe canalele noastre oficiale.','Robots in action, ideas and presentations on our official channels.')}</p></div><nav class="rg-social-links" aria-label="${tr(lang,'Rețele sociale','Social networks')}">${data.profiles.map(p=>external(p.url,icon(p.network)+`<span>${p.network==='facebook'?tr(lang,'Pagina Facebook','Facebook Page'):names[p.network]}</span>`,'rg-social-link',`aria-label="RobotGo — ${names[p.network]}" data-social-network="${p.network}"`)).join('')}</nav></section>`;
 }
 function link(p,lang='ro'){
  const video=data.videos[p.id];if(!video)return '';
  const own=window.ROBOTGO_VIDEO?.byProduct(p.id);
  if(own)return `<a class="rg-video-link" href="${window.ROBOTGO_VIDEO.route(own)}" data-product-video="${esc(p.id)}" aria-label="${esc(tr(lang,'Prezentare video: ','Video presentation: ')+p.name)}">${icon('youtube')}<span>${tr(lang,'Vezi prezentarea video','Watch the presentation')}</span></a>`;
  return external(video.url,icon(video.platform)+`<span>${tr(lang,'Vezi prezentarea video','Watch the presentation')}</span>`,'rg-video-link',`data-product-video="${esc(p.id)}" aria-label="${esc(tr(lang,'Prezentare video: ','Video presentation: ')+p.name+' — '+platformName(video.platform,lang))}"`);
 }
 function product(p,lang='ro'){
  const video=data.videos[p.id];if(!video)return '';
  const note=video.note?.[lang]||video.note?.ro||'';
  return `<section class="rg-product-video" id="prezentare-video" aria-labelledby="rg-video-heading"><div class="rg-video-photo"><img src="/${esc(p.localImage)}" width="240" height="180" alt="${esc(p.name)}" loading="lazy" decoding="async"></div><div class="rg-video-copy"><span class="rg-video-eyebrow">${video.publisher==='RobotGo'?'ROBOTGO / VIDEO':tr(lang,'PREZENTARE VIDEO','VIDEO PRESENTATION')}</span><h2 id="rg-video-heading">${esc(p.name)} ${tr(lang,'în imagini','in action')}</h2><p>${esc(video.title?.[lang]||video.title?.ro||p.name)}</p>${link(p,lang)}<small>${tr(lang,'Publicat de','Published by')} ${esc(video.publisher)} · ${platformName(video.platform,lang)} · ${window.ROBOTGO_VIDEO?.byProduct(p.id)?tr(lang,'Vezi pe pagina video RobotGo','Watch on the RobotGo video page'):tr(lang,'Se deschide într-o filă nouă','Opens in a new tab')}</small>${note?`<p class="rg-video-note">${esc(note)}</p>`:''}${video.alternatives?.length?`<div class="rg-video-alternatives"><span>${tr(lang,'Vezi și pe:','Also watch on:')}</span>${video.alternatives.map(a=>external(a.url,icon(a.network)+names[a.network],'rg-video-alternative')).join('')}</div>`:''}</div></section>`;
 }
 window.ROBOTGO_SOCIAL={channels,link,product};
})();
