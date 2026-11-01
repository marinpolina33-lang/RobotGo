/** Route-specific editorial payloads. All routes still ship complete initial HTML. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export function optimizePages(root,dist,pages){
 const context={window:{}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'public/robot-topics-data.js'),'utf8'),context);
 const all=context.window.ROBOTGO_TOPIC_DATA;
 const asset=(prefix,content,suffix)=>{
  const name=`assets/${prefix}.${createHash('sha256').update(content).digest('hex').slice(0,12)}.${suffix}`;
  fs.writeFileSync(path.join(dist,name),content);return '/'+name;
 };
 const sample=fs.readFileSync(path.join(dist,'index.html'),'utf8');
 const styles=[...sample.matchAll(/<link rel="stylesheet" href="([^"]+)">/g)].map(m=>m[1].split('?')[0]);
 const stylesheet=asset('site',styles.map(file=>fs.readFileSync(path.join(dist,file),'utf8')).join('\n'),'css');
 // Ship the comparison enhancement with its caller. A content-addressed filename
 // also prevents cached app.js responses from mixing different releases.
 const application=asset('application',fs.readFileSync(path.join(dist,'humanoid-buying-client.js'),'utf8')+'\n'+fs.readFileSync(path.join(dist,'app.js'),'utf8'),'js');
 const measurements=[];
 for(const p of pages){
  const key=p.route.replace(/\/$/,'')||'/',product=key.startsWith('/product/')?key.split('/')[2]:null;
  const data={topics:{},guides:{},productQuestions:product?{[product]:all.productQuestions[product]}:{}};
  for(const [route,t]of Object.entries(all.topics))data.topics[route]=route===key?t:{title:t.title,description:t.description,heading:t.heading,guides:t.guides};
  for(const [route,g]of Object.entries(all.guides))data.guides[route]=route===key?g:{title:g.title,description:g.description,label:g.label,intro:g.intro,date:g.date,products:g.products,comparison:g.comparison?{columns:[],rows:[]}:null};
  const content='window.ROBOTGO_TOPIC_DATA='+JSON.stringify(data)+';';
  const script=asset('seo-data',content,'js');
  const file=path.join(dist,p.route,'index.html');let html=fs.readFileSync(file,'utf8'),first=true;
  html=html.replace(/<link rel="stylesheet" href="[^"]+">/g,()=>{if(!first)return '';first=false;return `<link rel="stylesheet" href="${stylesheet}">`;});
  html=html.replace(/src="robot-topics-data.js(?:\?v=[^"]+)?"/,`src="${script}"`);
  fs.writeFileSync(file,html);
  const ctx={window:{},URLSearchParams};
  for(const [,src]of html.matchAll(/<script defer src="([^"]+)"><\/script>/g)){
   if(src.startsWith('auth.js')||src.startsWith('lead-client')||src.startsWith('app.js'))break;
   vm.runInNewContext(fs.readFileSync(path.join(dist,src.split('?')[0]),'utf8'),ctx);
  }
  if(key.startsWith('/guides/')||key.startsWith('/solutions/')||key.startsWith('/categories/')||key.startsWith('/compare/')){
   for(const lang of ['ro','en'])assert.ok(ctx.window.ROBOTGO_SEO.renderLanding(key,lang),'Page content remains available in both languages');
  }
  if(product)for(const lang of ['ro','en'])assert.ok(ctx.window.ROBOTGO_TOPICS.productFaq(ctx.window.ROBOTGO_CATALOG.products.find(x=>x.id===product),lang).includes(product),'Product buying answers survive route payload selection');
  html=html.replace(/<script defer src="humanoid-buying-client\.js(?:\?v=[^"]+)?"><\/script>/,'').replace(/src="app\.js(?:\?v=[^"]+)?"/,`src="${application}"`);
  assert.ok(html.includes(`src="${application}"`)&&!html.includes('src="humanoid-buying-client.js'),'Comparison enhancement and application are delivered together');
  fs.writeFileSync(file,html);
  measurements.push({path:p.route,editorialBytes:Buffer.byteLength(content),stylesheetRequests:1});
 }
 const before=fs.statSync(path.join(root,'public/robot-topics-data.js')).size;
 console.log(`Optimized ${pages.length} pages: 1 stylesheet request; editorial JS ${before} → ${measurements[0].editorialBytes} bytes on home (uncompressed).`);
 fs.writeFileSync(path.join(root,'docs/SEO_ASSET_BUDGET.json'),JSON.stringify({unit:'uncompressed source bytes, not measured network traffic',beforeEditorialBytes:before,pages:measurements},null,2)+'\n');
}
