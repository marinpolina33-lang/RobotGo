/** Production static-site validation. Runs locally and on Render without npm dependencies. */
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const pub=path.join(root,'public');
export function verify() {
 const checks=[];
 function check(name,ok,detail=''){checks.push({name,passed:!!ok,detail}); if(!ok) console.error('FAIL:',name,detail);}
 function read(name){return fs.readFileSync(path.join(pub,name),'utf8');}
 function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name)):[path.join(dir,e.name)]);}
 const files=walk(pub),rels=files.map(f=>path.relative(pub,f).split(path.sep).join('/'));
 check('No symlinks or private/server files in public', files.every(f=>!fs.lstatSync(f).isSymbolicLink()) && rels.every(r=> !/(^|\/)(?:\.git|\.env(?:\..*)?|private|node_modules|server\.mjs|render\.yaml|SOURCES\.json)(\/|$)/i.test(r)));
 const types=new Set(['.html','.css','.js','.json','.xml','.svg','.webp','.mp4','.txt','.png','.jpg','.jpeg','.ico']);
 check('Public files use expected types', rels.every(r=>types.has(path.extname(r))||r==='.htaccess'));
 const context={window:{}};
 for(const name of ['site-config.js','catalog.js','visuals.js','exhibition-data.js']) vm.runInNewContext(read(name),context,{timeout:3000,filename:name});
 const cfg=context.window.ROBOTGO_CONFIG,cat=context.window.ROBOTGO_CATALOG,vis=context.window.ROBOTGO_VISUALS,ex=context.window.ROBOTGO_EXHIBITION;
 check('Real account release; unrelated lead/AI backend stays disabled', cfg.demo===false&&cfg.releaseStage==='accounts-live'&&cfg.backendEnabled===false);
 check('Verified production domain configured',cfg.domainTarget==='robotgo.ro'&&cfg.domainStatus==='verified');
 check('26 product records preserved',cat.products.length===26);
 check('7 categories preserved',cat.categories.length===7);
 check('13 brand records preserved',cat.brands.length===13);
 check('Product IDs unique',new Set(cat.products.map(p=>p.id)).size===cat.products.length);
 check('Product category and brand references valid',cat.products.every(p=>cat.categories.some(c=>c.id===p.category)&&cat.brands.some(b=>b.id===p.brandId)));
 check('Product application references valid',cat.products.every(p=>p.domains.every(id=>cat.domains.some(d=>d.id===id))));
 check('RO/EN descriptions present',cat.products.every(p=>p.description?.ro&&p.description?.en));
 check('3 photographs and 4 videos preserved',ex.items.filter(x=>x.kind==='photo').length===3&&ex.items.filter(x=>x.kind==='video').length===4);
 function checkPair(file,key){check(file+' matches executable data', JSON.stringify(JSON.parse(read(file)))===JSON.stringify(context.window[key]));}
 checkPair('catalog.json','ROBOTGO_CATALOG');checkPair('visuals.json','ROBOTGO_VISUALS');checkPair('exhibition.json','ROBOTGO_EXHIBITION');
 const local=[];function scan(o){if(typeof o==='string'&&o.startsWith('assets/'))local.push(o);else if(o&&typeof o==='object')Object.values(o).forEach(scan);} [cat,vis,ex].forEach(scan);
 const missing=[...new Set(local)].filter(p=>!fs.existsSync(path.join(pub,p)));
 check('All referenced local catalogue and exhibition assets exist',!missing.length,missing.join(', '));
 const productImages=cat.products.flatMap(p=>[p.localImage,...(p.gallery||[]).map(g=>g.localImage)]);
 check('Every product and gallery image has a same-site asset',productImages.every(p=>typeof p==='string'&&p.startsWith('assets/products/')&&!p.includes('..')));
 const sources=JSON.parse(fs.readFileSync(path.join(root,'docs/product-image-sources.json'),'utf8')).images;
 const invalidImages=[...new Set(productImages)].filter(file=>{
  if(typeof file!=='string'||!fs.existsSync(path.join(pub,file)))return true;
  const bytes=fs.readFileSync(path.join(pub,file)),source=sources.find(r=>r.path===file);
  return bytes.toString('ascii',0,4)!=='RIFF'||bytes.toString('ascii',8,12)!=='WEBP'||!source||source.sha256!==createHash('sha256').update(bytes).digest('hex');
 });
 check('Product image bytes match verified WebP sources',invalidImages.length===0,invalidImages.join(', '));

 const insecure=[];function scanUrls(o){if(typeof o==='string'&&o.startsWith('http://'))insecure.push(o);else if(o&&typeof o==='object')Object.values(o).forEach(scanUrls);} [cat,vis,ex].forEach(scanUrls);
 check('No HTTP-only images in public data',insecure.length===0,insecure.join(', '));
 const html=read('index.html');
 const htmlRefs=[...html.matchAll(/(?:src|href)="([^"#][^"]*)"/g)].map(m=>m[1]).filter(v=>!v.includes(':'));
 check('HTML script/style/favicon references exist',htmlRefs.every(p=>fs.existsSync(path.join(pub,p))));
 check('Contact module loaded after app',html.indexOf('src="contact-public.js"')>html.indexOf('src="app.js"'));
 check('Responsive viewport present',/name="viewport"/.test(html));
 check('No inline scripts in HTML', !/<script(?![^>]*\bsrc=)[^>]*>/i.test(html));
 check('Non-JavaScript fallback present',html.includes('<noscript>'));
 const robots=read('robots.txt'),sitemap=read('sitemap.xml');
 check('Production homepage allows search indexing',html.includes('name="robots" content="index,follow,max-image-preview:large"') && !/noindex|nofollow/i.test(html));
 check('Robots permits crawling and advertises the production sitemap',/^Allow:\s*\/$/m.test(robots) && !/^Disallow:\s*\/\s*$/m.test(robots) && /^Sitemap: https:\/\/robotgo\.ro\/sitemap\.xml$/m.test(robots));
 check('Canonical and sitemap use the production homepage without hash routes',html.includes('rel="canonical" href="https://robotgo.ro/"') && sitemap.includes('xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"') && JSON.stringify([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1]))===JSON.stringify(['https://robotgo.ro/']));
 const syntaxFailures=[];
 for(const name of rels.filter(n=>n.endsWith('.js'))){const out=spawnSync(process.execPath,['--check',path.join(pub,name)],{encoding:'utf8'});if(out.status!==0)syntaxFailures.push({name,stderr:out.stderr});}
 check('All public JavaScript passes syntax check',!syntaxFailures.length,JSON.stringify(syntaxFailures));
 const signatures=[/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,/\bgh[pousr]_[A-Za-z0-9]{30,}\b/,/\bgithub_pat_[A-Za-z0-9_]{30,}\b/,/\bsk[-_](?:proj-|live_|test_)?[A-Za-z0-9_-]{30,}\b/,/\bsb_secret_[A-Za-z0-9_-]{20,}\b/];
 const hits=[];for(const f of files.filter(f=>/\.(js|json|html|css|txt)$/.test(f))){const text=fs.readFileSync(f,'utf8');if(signatures.some(p=>p.test(text)))hits.push(path.relative(pub,f));}
 check('No recognizable private-key/token signatures in public text',!hits.length,hits.join(', '));
 const contactKeys=['email','companyName','phoneNumber','whatsappNumber','address','vatId','registrationNo','openingHours'];
 const contactsValid=contactKeys.every(k=>typeof cfg[k]==='string' && !/TEST CONTACT|example\.invalid|NEPUBLICAT/i.test(cfg[k]))
  && (!cfg.email || /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(cfg.email))
  && (!cfg.whatsappNumber || /^[1-9]\d{6,14}$/.test(cfg.whatsappNumber))
  && (!cfg.phoneNumber || /^\+?[1-9]\d{6,14}$/.test(cfg.phoneNumber.replace(/[\s()-]/g,'')));
 check('Optional public contacts valid; no test placeholders', contactsValid);
 const hosting=JSON.parse(fs.readFileSync(path.join(root,'config/hosting.json'),'utf8'));
 check('Security header configuration present',hosting.headers['X-Content-Type-Options']==='nosniff'&&hosting.headers['X-Frame-Options']==='DENY'&&hosting.headers['Content-Security-Policy'].includes("object-src 'none'"));
 check('Apache compatibility does not block indexing',!/X-Robots-Tag[^\n]*(?:noindex|none)/i.test(read('.htaccess')));
 const yaml=fs.readFileSync(path.join(root,'render.yaml'),'utf8');
 check('Hosting configuration cannot reintroduce a global indexing block',!Object.entries(hosting.headers).some(([k,v])=>k.toLowerCase()==='x-robots-tag'&&/noindex|none/i.test(v)) && !/name: X-Robots-Tag\s+value: [^\n]*(?:noindex|none)/i.test(yaml));
 check('Render uses static publish only',/runtime: static/.test(yaml)&&/staticPublishPath: \.\/dist/.test(yaml)&&!/^\s*(?:startCommand|databases|plan|domains):/m.test(yaml));
 check('No broad SPA rewrite for nonexistent API paths',!/^\s*routes:/m.test(yaml));
 const result={version:cfg.version,checkedAt:new Date().toISOString(),scope:'Local static-file and configuration validation. Not a penetration test. Does not verify external-image availability, Render remote schema, or live services.',files:files.length,checks,passed:checks.filter(c=>c.passed).length,failed:checks.filter(c=>!c.passed).length};
 console.log(`Static checks: ${result.passed}/${checks.length}; ${result.files} public files.`);
 if(result.failed)throw new Error('Static validation failed. See failed checks above.');
 return result;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){try{const report=verify();if(process.argv.includes('--report'))fs.writeFileSync(path.join(root,'tests/static-report.json'),JSON.stringify(report,null,2));}catch(e){console.error(e.message);process.exitCode=1;}}
