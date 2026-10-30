/** Validate the published HTML, links and backwards-compatible public routing. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';

export function verifySearchPages(root,dist,pages){
 const catalog=JSON.parse(fs.readFileSync(path.join(root,'public/catalog.json'),'utf8'));
 const expected=['/','/shop/','/contact/',...catalog.products.map(p=>'/product/'+p.id+'/')];
 assert.deepEqual(pages.map(p=>p.route),expected);
 const sitemap=fs.readFileSync(path.join(dist,'sitemap.xml'),'utf8');
 assert.deepEqual([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]),expected.map(p=>'https://robotgo.ro'+p));
 for(const page of pages){
  const html=fs.readFileSync(path.join(dist,page.route,'index.html'),'utf8');
  const main=html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/)?.[1];
  assert.ok(main&&/<h1>/.test(main),'Readable heading before JavaScript: '+page.route);
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
  }
  for(const [,value]of html.matchAll(/(?:href|src)="([^"]+)"/g)){
   const url=new URL(value.replace(/&amp;/g,'&'),'https://robotgo.ro/');
   if(url.origin!=='https://robotgo.ro')continue;
   const target=path.join(dist,url.pathname,url.pathname.endsWith('/')?'index.html':'');
   assert.ok(fs.existsSync(target),'Broken public link or asset: '+page.route+' → '+value);
  }
  const product=catalog.products.find(p=>page.route==='/product/'+p.id+'/');
  if(product){
   assert.ok(main.includes(product.name),'Product name in initial HTML');
   assert.ok(main.includes(product.description.ro.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;')),'Product description in initial HTML');
   assert.ok(main.includes(product.localImage),'Correct product image in initial HTML');
  }
 }
 const context={window:{ROBOTGO_CATALOG:catalog},URLSearchParams};
 vm.runInNewContext(fs.readFileSync(path.join(root,'public/routing.js'),'utf8'),context);
 const route=context.window.ROBOTGO_ROUTING;
 assert.equal(route.url('/shop?category=umanoizi'),'/shop/?category=umanoizi');
 assert.equal(route.url('/product/'+catalog.products[0].id),'/product/'+catalog.products[0].id+'/');
 assert.equal(route.url('/quote?product=test'),'/#/quote?product=test');
 assert.equal(route.read({pathname:'/shop/',search:'?q=G1',hash:''}).params.get('q'),'G1');
 assert.equal(route.read({pathname:'/shop/index.html',search:'',hash:'#main'}).path,'/shop');
 assert.equal(route.read({pathname:'/',hash:'#/product/'+catalog.products[0].id}).path,'/product/'+catalog.products[0].id);
 assert.equal(route.read({pathname:'/',hash:'#/catalog?brand=unitree'}).path,'/shop');
 assert.equal(route.read({pathname:'/',hash:'#/oferta'}).path,'/quote');
 console.log('Search pages: '+pages.length+' HTML pages, sitemap, metadata, links, structured data and legacy routing verified.');
}
