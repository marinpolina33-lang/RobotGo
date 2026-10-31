/** Validate the published HTML, links and backwards-compatible public routing. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

export function verifySearchPages(root,dist,pages){
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'public/catalog.json'),'utf8'));
 const expected=['/','/shop/','/contact/',...catalog.products.map(p=>'/product/'+p.id+'/'),'/categories/','/solutions/','/about/',...catalog.categories.map(c=>'/categories/'+c.id+'/'),...catalog.domains.map(d=>'/solutions/'+d.id+'/')];
 const context={window:{ROBOTGO_CATALOG:catalog},URLSearchParams};
 for(const file of ['site-config.js','seo.js','routing.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'public',file),'utf8'),context);
 const seo=context.window.ROBOTGO_SEO,links=new Map(),titles=new Set(),descriptions=new Set();
 assert.deepEqual(pages.map(p=>p.route),expected);
 const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
 assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),expected.map(p=>'https://robotgo.ro'+p));
 for(const page of pages){
  const html=fs.readFileSync(path.join(dist,page.route,'index.html'),'utf8');
  const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main&&/<h1>/.test(main),'Readable heading before JavaScript: '+page.route);
  assert.equal((main.match(/<h1[ >]/g)||[]).length,1,'One main heading: '+page.route);
  const entry=seo.pages[page.route.replace(/\/+$/,'')||'/'];
  assert.equal(page.title,entry.title,'Shared title must survive JavaScript rendering');
  assert.equal(page.description,entry.description,'Shared description must survive JavaScript rendering');
  assert.ok(!titles.has(page.title),'Unique page title: '+page.route);titles.add(page.title);
  assert.ok(!descriptions.has(page.description),'Unique page description: '+page.route);descriptions.add(page.description);
  assert.ok(html.includes('property="og:image"'),'Social preview image');
  if(entry.kind)assert.ok(main.includes(seo.renderLanding(entry.path)),'Same useful content before and after JavaScript');
  if(page.route==='/shop/')assert.ok(main.includes(seo.renderDirectory()),'Complete model directory exists before JavaScript');
  assert.ok(html.includes('rel="icon" href="favicon.png" type="image/png" sizes="96x96"'),'Raster favicon supported by Google Search');
  links.set(page.route,[]);
  assert.ok(html.includes('<base href="/">'),'Nested assets use the site root');
  assert.ok(html.includes('rel="canonical" href="https://robotgo.ro'+page.route+'"'));
  assert.ok(!/noindex|nofollow/i.test(html));
  assert.ok(html.indexOf('src="catalog.js')<html.indexOf('src="routing.js')&&html.indexOf('src="routing.js')<html.indexOf('src="app.js'));
  for(const [,attrs,body]of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
   if(/\bsrc=/.test(attrs))continue;
   assert.ok(attrs.includes('type="application/ld+json"'),'Only inert structured data is inline');
   const schema=JSON.parse(body);
   assert.equal(schema['@context'],'https://schema.org');
   for(const entry of schema['@graph']){assert.ok(!entry.offers&&!entry.aggregateRating&&!entry.review,'Do not invent commercial data');}
   const organization=schema['@graph'].find(x=>x['@type']==='Organization');
   if(organization){
    assert.equal(organization.logo.url,'https://robotgo.ro/assets/brand/robotgo-logo.png');
    assert.ok(fs.existsSync(path.join(dist,'assets/brand/robotgo-logo.png')),'Organization logo is publicly available');
   }
   if(page.route!=='/'){const breadcrumb=schema['@graph'].find(x=>x['@type']==='BreadcrumbList');assert.ok(breadcrumb,'Breadcrumb data');assert.equal(breadcrumb.itemListElement.at(-1).item,'https://robotgo.ro'+page.route);}
  }
  for(const [,value]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   const url=new URL(value.replace(/&amp;/g,'&'),'https://robotgo.ro/');
   if(url.origin!=='https://robotgo.ro')continue;
   const target=path.join(dist,url.pathname,url.pathname.endsWith('/')?'index.html':'');
   assert.ok(fs.existsSync(target),'Broken public link or asset: '+page.route+' → '+value);
   if(expected.includes(url.pathname)&&!url.hash)links.get(page.route).push(url.pathname);
  }
  const product=catalog.products.find(p=>page.route==='/product/'+p.id+'/');
  if(product){
   assert.ok(main.includes(product.name),'Product name in initial HTML');
   assert.ok(main.includes(product.description.ro.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')),'Product description in initial HTML');
   assert.ok(main.includes(product.localImage),'Correct product image in initial HTML');
  }
 }
 const reachable=new Set(['/']),pending=['/'];
 while(pending.length)for(const target of links.get(pending.pop())||[])if(!reachable.has(target)){reachable.add(target);pending.push(target);}
 assert.equal(reachable.size,expected.length,'Every indexed page must be reachable through ordinary links from home');
 // The UI shows nine image cards initially. Plain links must still expose all
 // models without asking a crawler or a visitor to activate "load more".
 for(const lang of ['ro','en']){
  const directory=seo.renderDirectory(lang);
  const productLinks=[...directory.matchAll(/href="(\/product\/[^"?]+\/)"/g)].map(m=>m[1]);
  assert.deepEqual(productLinks.sort(),catalog.products.map(p=>'/product/'+p.id+'/').sort(),'All model links in '+lang+' directory');
  for(const category of catalog.categories)assert.ok(directory.includes('href="/categories/'+category.id+'/"'),'Directory links to category document');
 }
 assert.match(seo.pages['/product/pudu-bellabot'].title,/robot de servire/);
 assert.match(seo.pages['/product/pudu-cc1'].title,/robot de curățenie/);
 assert.match(seo.pages['/product/brainco-revo2'].title,/mână robotică/);
 const icon=fs.readFileSync(path.join(dist,'favicon.png'));
 assert.equal(icon.subarray(0,8).toString('hex'),'89504e470d0a1a0a');
 assert.equal(icon.readUInt32BE(16),96);assert.equal(icon.readUInt32BE(20),96);
 const route=context.window.ROBOTGO_ROUTING;
 assert.equal(route.url('/shop?category=umanoizi'),'/shop/?category=umanoizi');
 assert.equal(route.url('/product/'+catalog.products[0].id),'/product/'+catalog.products[0].id+'/');
 assert.equal(route.url('/quote?product=test'),'/#/quote?product=test');
 assert.equal(route.read({pathname:'/shop/',search:'?q=G1',hash:''}).params.get('q'),'G1');
 assert.equal(route.read({pathname:'/shop/index.html',search:'',hash:'#main'}).path,'/shop');
 assert.equal(route.read({pathname:'/',hash:'#/product/'+catalog.products[0].id}).path,'/product/'+catalog.products[0].id);
 assert.equal(route.read({pathname:'/',hash:'#/catalog?brand=unitree'}).path,'/shop');
 assert.equal(route.read({pathname:'/',hash:'#/oferta'}).path,'/quote');
 assert.equal(route.url('/categories/umanoizi'),'/categories/umanoizi/');
 assert.equal(route.url('/solutii'),'/solutions/');
 let redirected;
 context.window.location={pathname:'/',search:'',hash:'#/product/'+catalog.products[0].id,replace:value=>{redirected=value;}};
 assert.equal(route.redirectLegacy(),true);assert.equal(redirected,'/product/'+catalog.products[0].id+'/');
 context.window.location.hash='#/quote';assert.equal(route.redirectLegacy(),false);
 console.log('Search pages: '+pages.length+' HTML pages, sitemap, metadata, links, structured data and legacy routing verified.');
}
