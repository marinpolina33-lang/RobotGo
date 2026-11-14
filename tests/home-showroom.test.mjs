import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const ctx={window:{}};
for(const name of ['catalog','market-prices','practical','home-showroom'])vm.runInNewContext(read('public/'+name+'.js'),ctx);
const {ROBOTGO_HOME:home,ROBOTGO_CATALOG:catalog}=ctx.window;
const baseline=["unitree-g1", "unitree-go2", "leju-kuavo-4pro", "leju-kuavo-5", "leju-roban-2", "rokae-helios", "rokae-human-x", "rokae-ar", "rokae-cr", "deep-lynx-m20", "deep-x30", "pudu-bellabot", "pudu-cc1", "keenon-t10", "keenon-c40", "keenon-w3", "dobot-nova2", "dobot-magician-e6", "inspire-rh56bfx", "geekplus-p-series", "ubtech-walker-s2", "unitree-h1", "agilex-scout-mini", "brainco-revo2", "siasun-gcr5", "pudu-t300"];
test('homepage keeps every catalogue model accessible before JavaScript and in both languages',()=>{
 const initial=read('dist/index.html');
 for(const id of baseline)assert.ok(catalog.products.some(p=>p.id===id),'Preserve existing model '+id);
 for(const lang of ['ro','en']){
  const html=home.render(lang);
  assert.equal((html.match(/data-home-product=/g)||[]).length,32);
  for(const p of catalog.products){assert.ok(html.includes('href="/product/'+p.id+'/"'));assert.ok(initial.includes('data-home-product="'+p.id+'"'));}
  assert.ok(!/undefined|NaN/.test(html));
 }
 assert.equal(catalog.products.filter(p=>p.brandId==='alpha-robotics').length,6);
});
test('task filters and accent-insensitive search work together without losing models',()=>{
 const select=(g,q='')=>catalog.products.filter(p=>home.matches(p,g,q));
 assert.equal(select('all').length,32);
 assert.equal(select('alpha').length,6);
 assert.equal(select('reception').length,3);
 assert.deepEqual(Array.from(select('all','  ALICE ').map(p=>p.id)),['alpha-alice']);
 assert.equal(select('all','receptie').length,3);
 assert.equal(select('cleaning','alpha').length,0);
 assert.equal(select('all','no-such-model').length,0);
 for(const p of catalog.products)assert.ok(home.groups.some(g=>g[0]!=='all'&&g[0]!=='alpha'&&g[3](p)),'A task filter must expose '+p.id);
});
test('new models use local official images, null commercial prices and model-specific questions',()=>{
 vm.runInNewContext(read('public/robot-topics-data.js'),ctx);
 for(const p of catalog.products.filter(p=>p.brandId==='alpha-robotics')){
  assert.equal(p.price,null);assert.equal(p.currency,'EUR');
  assert.match(p.sourcePage,/^https:\/\/www\.alpharobotics\.ai\//);
  assert.ok(fs.existsSync(new URL('../public/'+p.localImage,import.meta.url)));
  assert.equal(ctx.window.ROBOTGO_TOPIC_DATA.productQuestions[p.id].faq.length,2);
  assert.ok(read('dist/product/'+p.id+'/index.html').includes(p.sourcePage));
 }
});
