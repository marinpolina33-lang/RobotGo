import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const ctx={window:{}};
for(const file of ['catalog','market-prices'])vm.runInNewContext(read('public/'+file+'.js'),ctx);
const products=ctx.window.ROBOTGO_CATALOG.products;
const prices=ctx.window.ROBOTGO_PRICES;

test('European references match only the two shared models and preserve quote-only sales',()=>{
 assert.equal(prices.get('unitree-g1').amount,23892);
 assert.equal(prices.get('unitree-go2').amount,4200);
 assert.equal(prices.get('unitree-go2').configuration.ro,'Go2 Pro');
 assert.equal(products.filter(p=>prices.get(p)).length,2);
 for(const p of products){
  assert.equal(p.price,null,'Retailer benchmarks must never become RobotGo order totals');
  if(!prices.get(p))assert.equal(prices.text(p),'Preț la cerere');
 }
 assert.equal(prices.get('unitree-h1'),null,'H2 prices must not be assigned to H1');
});

test('each benchmark includes configuration, source VAT, provenance and quote terms in both languages',()=>{
 for(const id of ['unitree-g1','unitree-go2']){
  const p=products.find(p=>p.id===id),r=prices.get(p);
  for(const lang of ['ro','en']){
   const html=prices.render(p,lang,true);
   assert.ok(html.includes(r.configuration[lang]));
   assert.ok(html.includes(lang==='ro'?'TVA inclus în sursă':'VAT included at source'));
   assert.ok(html.includes('href="'+r.url+'"'));
   assert.ok(html.includes('datetime="2026-11-14"'));
   assert.ok(html.includes(lang==='ro'?'Oferta finală RobotGo':'final RobotGo quote'));
   assert.ok(prices.text(p,lang).includes(r.configuration[lang]));
  }
 }
});

test('initial product, home and catalogue HTML include references without creating sales offers',()=>{
 for(const id of ['unitree-g1','unitree-go2']){
  const product=read('dist/product/'+id+'/index.html');
  for(const file of ['dist/index.html','dist/shop/index.html'])assert.ok(read(file).includes('data-market-price="'+id+'"'));
  assert.ok(product.includes('data-market-price="'+id+'"'));
  assert.ok(product.includes(prices.get(id).url));
  const graph=JSON.parse(product.match(/id="robotgo-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  assert.equal(graph.some(x=>x['@type']==='Offer'),false);
  assert.equal(/"offers"\s*:/.test(JSON.stringify(graph)),false);
 }
});
