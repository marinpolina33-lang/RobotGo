/** Regression checks for useful content, anchors and honest indexing metadata. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
export function verifyDiscovery(root,dist,pages){
 const ctx={window:{}};
 for(const name of ['site-config','catalog','practical','robot-guides','robot-topics-data','robot-topics','exhibition-data','seo-improvements','humanoid-buying','discovery','content-updates','video-pages','seo'])vm.runInNewContext(fs.readFileSync(path.join(root,'public',name+'.js'),'utf8'),ctx);
 const discovery=ctx.window.ROBOTGO_DISCOVERY,seo=ctx.window.ROBOTGO_SEO;
 const htmlByPath=new Map(pages.map(p=>[p.route,fs.readFileSync(path.join(dist,p.route,'index.html'),'utf8')]));
 const idsByPath=new Map([...htmlByPath].map(([route,html])=>[route,new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]))]));
 for(const category of ctx.window.ROBOTGO_CATALOG.categories){
  for(const lang of ['ro','en']){
   const html=seo.renderLanding('/categories/'+category.id,lang);
   assert.ok(html.includes('data-selection="'+category.id+'"'));
   assert.equal(discovery.categories[category.id].rows.length,3);
   assert.ok(html.includes(discovery.glossaryPath+'/#'));
  }
 }
 for(const domain of ctx.window.ROBOTGO_CATALOG.domains)for(const lang of ['ro','en']){
  const html=seo.renderLanding('/solutions/'+domain.id,lang);
  assert.ok(html.includes('data-pilot="'+domain.id+'"'));
  assert.ok(html.includes('/quote/?domain='+domain.id));
 }
 for(const [route,html]of htmlByPath){
  const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)[1];
  for(const [,href]of main.matchAll(/href="([^"]+)"/g)){
   const url=new URL(href.replace(/&amp;/g,'&'),'https://robotgo.ro/');
   if(url.origin!=='https://robotgo.ro'||!url.hash||url.hash.startsWith('#/'))continue;
   assert.ok(idsByPath.get(url.pathname)?.has(decodeURIComponent(url.hash.slice(1))),`Missing anchor: ${route} → ${href}`);
  }
  assert.ok(!/href="\/#\/quote/.test(main),'Public quotation links use real documents');
  assert.equal((html.match(/<link rel="stylesheet" /g)||[]).length,1,'One stylesheet after packaging');
  assert.equal((html.match(/src="\/assets\/discovery\.[a-f0-9]+\.js"/g)||[]).length,1,'Discovery and editorial dates share a versioned asset');
  const key=route.replace(/\/$/,'')||'/',meta=seo.pages[key];
  if(meta.productId){assert.ok(main.includes(' — '+ctx.window.ROBOTGO_CATALOG.products.find(p=>p.id===meta.productId).type.ro.replace(/&/g,'&amp;')),'Product heading identifies robot type');assert.ok(main.includes('discovery-product-terms'));}
  if(key.startsWith('/guides/')&&key!==discovery.glossaryPath)assert.ok(main.includes('class="discovery-toc"'),'Long guides expose a crawlable table of contents');
  if(meta.modified){const graph=JSON.parse(html.match(/id="robotgo-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];assert.ok(graph.some(x=>x.dateModified===meta.modified),'Structured modification date agrees with maintained editorial date');}
 }
 const glossary=seo.schema(discovery.glossaryPath)['@graph'].find(x=>x['@type']==='WebPage').mainEntity;
 assert.equal(glossary['@type'],'DefinedTermSet');assert.equal(glossary.hasDefinedTerm.length,18);
 assert.equal(new Set(discovery.terms.map(t=>t[0])).size,18);
 const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
 assert.ok(!sitemap.includes('<loc>https://robotgo.ro/quote/</loc>'));
 assert.ok(htmlByPath.get('/quote/').includes('name="robots" content="noindex,follow"'));
 for(const p of pages){const meta=seo.pages[p.route.replace(/\/$/,'')||'/'];if(meta.modified&&!meta.noindex)assert.ok(sitemap.includes(`<loc>https://robotgo.ro${p.route}</loc><lastmod>${meta.modified}</lastmod>`));}
 for(const date of Object.values(ctx.window.ROBOTGO_CONTENT_UPDATES))assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(date)&&!Number.isNaN(Date.parse(date))&&Date.parse(date)<=Date.now(),'Editorial dates are explicit, valid and not in the future');
 console.log('Discovery checks: 7 selection tables, 7 pilot checklists, 18 glossary terms, anchors, dates, indexing and shared assets passed.');
}
