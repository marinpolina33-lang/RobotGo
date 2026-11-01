/** Validate the published HTML, links and backwards-compatible public routing. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

export function verifySearchPages(root,dist,pages){
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'public/catalog.json'),'utf8'));
 const expected=['/','/shop/','/contact/',...catalog.products.map(p=>'/product/'+p.id+'/'),'/categories/','/solutions/','/about/',...catalog.categories.map(c=>'/categories/'+c.id+'/'),...catalog.domains.map(d=>'/solutions/'+d.id+'/'),'/guides/roboti-entertainment/','/brands/','/guides/primul-robot/','/robot/','/guides/cat-costa-un-robot/','/guides/','/guides/amr-vs-agv/','/guides/cobot-vs-robot-industrial/','/guides/umanoid-vs-caine-robot/','/guides/robot-programabil-sdk-ros/','/guides/robot-autonom-inteligenta-artificiala/','/guides/mentenanta-robotilor/','/guides/bellabot-vs-keenon-t10/','/guides/pudu-cc1-vs-keenon-c40/','/guides/dobot-nova2-vs-magician-e6/','/guides/unitree-g1-vs-h1/'];
 const context={window:{ROBOTGO_CATALOG:catalog},URLSearchParams};
 for(const file of ['site-config.js','practical.js','robot-guides.js','robot-topics-data.js','robot-topics.js','seo.js','routing.js'])vm.runInNewContext(fs.readFileSync(path.join(root,'public',file),'utf8'),context);
 const seo=context.window.ROBOTGO_SEO,links=new Map(),titles=new Set(),descriptions=new Set();
 for(const lang of ['ro','en']){
  const brands=seo.renderLanding('/brands',lang);
  for(const brand of catalog.brands){
   assert.ok(brands.includes('href="/shop/?brand='+brand.id+'"'),'Brand filter retains the exact brand ID');
  }
  for(const product of catalog.products)assert.ok(brands.includes('href="/product/'+product.id+'/"'),'Brand directory exposes every product before interaction');
  const guide=seo.renderLanding('/guides/primul-robot',lang);
  assert.equal((guide.match(/<h1>/g)||[]).length,1);
  for(const target of ['/shop/','/categories/','/solutions/','/contact/'])assert.ok(guide.includes('href="'+target+'"'),'Selection guide connects to useful canonical pages');
 }
 for(const lang of ['ro','en']){
  const blurbs=catalog.products.map(p=>context.window.ROBOTGO_PRACTICAL.cardBrief(p,lang));
  assert.ok(blurbs.every(text=>text.length>30),'Every model has a useful activity description in '+lang);
  assert.equal(new Set(blurbs).size,catalog.products.length,'Cards explain individual models rather than repeating a category slogan');
 }
 assert.deepEqual(pages.map(p=>p.route),expected);
 // New guides must be useful HTML documents, with matching interactive content.
 for(const [route,article] of Object.entries(context.window.ROBOTGO_GUIDES.articles)){
  for(const lang of ['ro','en']){
   const rendered=seo.renderLanding(route,lang);
   assert.equal((rendered.match(/<h1>/g)||[]).length,1,'One article heading in '+lang);
   assert.ok(rendered.includes('href="/shop/"')&&rendered.includes('href="/contact/"'),'Guides lead to models and quotation');
   assert.ok(rendered.includes('href="/product/'),'Guide links to actual catalogue models');
   assert.ok(!/undefined|NaN/.test(rendered),'Guide has no missing catalogue data');
  }
  const graph=seo.schema(route)['@graph'];
  const structuredArticle=graph.find(x=>x['@type']==='Article');
  assert.ok(structuredArticle,'Guide has Article data');
  assert.equal(structuredArticle.headline,article.title);
  assert.equal(structuredArticle.datePublished,article.date);
  assert.ok(seo.renderIntro().includes('href="'+route+'/"'),'Guide discoverable from homepage');
  assert.ok(seo.renderDirectory().includes('href="'+route+'/"'),'Guide discoverable from catalogue');
 }
 // Check editorial relationships, not just the number of generated URLs.
 const topics=context.window.ROBOTGO_TOPICS;
 const guideIndex=seo.renderLanding('/guides');
 for(const [route,topic] of Object.entries(topics.topics)){
  assert.ok(seo.pages[route],'Editorial topic maps to an existing canonical page');
  for(const lang of ['ro','en']){
   const extra=topics.renderTopic(route,lang);
   assert.ok(seo.renderLanding(route,lang).includes(extra),'Category/application carries its shared explanation');
   assert.ok(extra.includes('<details'),'Topic includes visible questions and answers');
   for(const slug of topic.guides)assert.ok(topics.guides['/guides/'+slug],'Topic links to an existing comparison');
  }
 }
 for(const [route,g] of Object.entries(topics.guides)){
  assert.ok(guideIndex.includes('href="'+route+'/"'),'Guide is discoverable from the guide directory');
  for(const lang of ['ro','en']){
   const body=seo.renderLanding(route,lang);
   assert.equal((body.match(/<h1>/g)||[]).length,1);
   assert.ok(!/undefined|NaN/.test(body),'Guide has no missing model or label');
   for(const id of g.products){
    assert.ok(catalog.products.some(p=>p.id===id),'Guide names a real catalogue model');
    assert.ok(body.includes('href="/product/'+id+'/"'),'Model links are present in both languages');
   }
  }
  for(const path of g.links)assert.ok(seo.pages[path],'Related reading points to a canonical page');
  const article=seo.schema(route)['@graph'].find(x=>x['@type']==='Article');
  assert.equal(article.headline,g.title);assert.equal(article.datePublished,g.date);
  const html=fs.readFileSync(path.join(dist,route,'index.html'),'utf8');
  assert.ok(html.includes('property="og:type" content="article"'));
  if(g.comparison){
   assert.equal(g.comparison.columns.length,3,'Model comparison has criterion and two models');
   assert.equal(g.products.length,2,'Each model comparison has exactly two catalogue models');
   for(const row of g.comparison.rows)assert.equal(row.length,3,'Comparison rows align with headers');
   for(const lang of ['ro','en']){
    const body=seo.renderLanding(route,lang);
    for(const col of g.comparison.columns)assert.ok(body.includes(col[lang==='en'?1:0]),'Comparison headings are translated');
    for(const id of g.products){
     const reading=topics.productLinks(catalog.products.find(p=>p.id===id),lang);
     assert.ok(reading.includes('href="'+route+'/"'),'Both products link back to their direct comparison');
    }
   }
  }
 }
 assert.deepEqual(Object.keys(topics.productQuestions).sort(),catalog.products.map(p=>p.id).sort(),'Every catalogue model has buying answers');
 const allQuestions={ro:new Set(),en:new Set()};
 for(const [id,q]of Object.entries(topics.productQuestions)){
  const product=catalog.products.find(p=>p.id===id);
  assert.ok(product,'Buying questions belong to an existing model');
  const html=fs.readFileSync(path.join(dist,'product',id,'index.html'),'utf8');
  for(const lang of ['ro','en']){
   const body=topics.productFaq(product,lang);
   assert.ok(context.window.ROBOTGO_PRACTICAL.product(product,lang).includes(body),'Product uses the shared buying answers in '+lang);
   if(lang==='ro')assert.ok(html.includes(body),'Buying answers are readable before JavaScript');
   assert.ok(body.includes('href="/contact/"'),'Buying answers lead to quotation contact');
   assert.ok(body.includes('href="/#/quote?product='+id+'"'),'Buying answers retain the selected model in the quote');
   for(const row of q.faq){
    assert.equal(row.length,4,'Question and answer exist in both languages');
    assert.ok(row.every(text=>typeof text==='string'&&text.trim().length>20),'Buying content is complete in both languages');
    const question=row[lang==='en'?1:0];
    assert.ok(!allQuestions[lang].has(question),'Model questions are distinct');allQuestions[lang].add(question);
   }
  }
  for(const [,source]of q.sources)assert.ok(source.startsWith('https://'),'Technical references use HTTPS');
 }
 assert.equal(allQuestions.ro.size,58,'All 26 model pages carry 58 specific buying questions');
 assert.equal(allQuestions.en.size,58,'English retains every buying question');
 for(const product of catalog.products){
  const reading=topics.productLinks(product);
  assert.ok(reading.includes('href="/guides/'),'Every product offers contextual explanation');
  for(const [,target]of reading.matchAll(/href="([^"]+)"/g))assert.ok(seo.pages[target.replace(/\/$/,'')],'Product reading has no broken internal target');
 }
 const guideCollection=seo.schema('/guides')['@graph'].find(x=>x['@type']==='CollectionPage');
 assert.equal(guideCollection.mainEntity.numberOfItems,14,'Guide collection includes four model comparisons');
 assert.ok(seo.renderIntro().includes('href="/guides/"'),'Guide hub is reachable from Home');
 assert.ok(seo.renderDirectory().includes('href="/guides/"'),'Guide hub is reachable from the catalogue');
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
   assert.ok(main.includes(context.window.ROBOTGO_PRACTICAL.product(product)),'Practical product content is crawlable and shared with the UI: '+product.id);
   assert.ok(main.includes(product.name),'Product name in initial HTML');
   assert.ok(main.includes(product.description.ro.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')),'Product description in initial HTML');
   assert.ok(main.includes(product.localImage),'Correct product image in initial HTML');
  }
 }
 const reachable=new Set(['/']),pending=['/'];
 assert.ok(context.window.ROBOTGO_PRACTICAL.guide('en').includes('Can the robot speak Romanian?'),'Entertainment FAQ is available in English');
 const guideHtml=fs.readFileSync(path.join(dist,'guides/roboti-entertainment/index.html'),'utf8');
 assert.ok(guideHtml.includes('property="og:type" content="article"'),'Guide has article social metadata');
 assert.ok(guideHtml.includes('"@type":"Article"'),'Editorial guide has Article structured data');
 for(const id of Object.keys(context.window.ROBOTGO_PRACTICAL.roles))assert.ok(guideHtml.includes('/product/'+id+'/'),'Entertainment guide connects activities to real catalogue models');
 const appShell=fs.readFileSync(path.join(dist,'index.html'),'utf8');
 const homeGraph=JSON.parse(appShell.match(/id="robotgo-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
 const site=homeGraph.find(x=>x['@type']==='WebSite');
 const home=homeGraph.find(x=>x['@type']==='WebPage');
 assert.equal(site.url,'https://robotgo.ro/');
 assert.ok(site.alternateName.includes('robotgo.ro'),'Domain is an explicit alternative site name');
 assert.equal(home.mainEntity['@id'],'https://robotgo.ro/#organization');
 assert.ok(appShell.includes('<title>RobotGo România |'),'Homepage title clearly identifies the brand');
 assert.ok(appShell.includes('RobotGo.ro este catalogul de roboți operat de ROUTEX LOGISTICA S.R.L.'),'Visible brand and operator identity before JavaScript');
 for(const page of pages){
  const html=fs.readFileSync(path.join(dist,page.route,'index.html'),'utf8');
  const footer=html.match(/<footer\b[^>]*>([\s\S]*?)<\/footer>/)[1];
  assert.match(footer,/<a href="\/"[^>]*>RobotGo România<\/a>/,'Every public page links back to the canonical homepage with the brand');
 }
 assert.ok(appShell.indexOf('src="catalog.js')<appShell.indexOf('src="practical.js')&&appShell.indexOf('src="practical.js')<appShell.indexOf('src="seo.js'),'Shared application content loads after the catalogue and before SEO');
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
 assert.equal(route.url('/brands'),'/brands/');
 assert.equal(route.url('/learn'),'/guides/primul-robot/');
 let redirected;
 context.window.location={pathname:'/',search:'',hash:'#/learn',replace:value=>{redirected=value;}};
 assert.equal(route.redirectLegacy(),true);assert.equal(redirected,'/guides/primul-robot/');
 context.window.location={pathname:'/',search:'',hash:'#/product/'+catalog.products[0].id,replace:value=>{redirected=value;}};
 assert.equal(route.redirectLegacy(),true);assert.equal(redirected,'/product/'+catalog.products[0].id+'/');
 context.window.location.hash='#/quote';assert.equal(route.redirectLegacy(),false);
 console.log('Search pages: '+pages.length+' HTML pages, sitemap, metadata, links, structured data and legacy routing verified.');
}
