/** Notify participating search engines only after the public key is deployed.
 * Preview: node tools/submit-indexnow.mjs
 * Submit:  node tools/submit-indexnow.mjs --submit
 * IndexNow receipt is not a guarantee of crawling, indexing or ranking.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const config=JSON.parse(fs.readFileSync(path.join(root,'config/indexnow.json'),'utf8'));
const {origin,keyFile,endpoint}=config;
if(origin!=='https://robotgo.ro'||endpoint!=='https://api.indexnow.org/indexnow'||!/^[a-f0-9]{32}\.txt$/.test(keyFile))throw new Error('Unexpected IndexNow destination or key file.');
const key=fs.readFileSync(path.join(root,'public',keyFile),'utf8').trim();
if(key+'.txt'!==keyFile)throw new Error('Key file and contents do not match.');
const sitemap=fs.readFileSync(path.join(root,'dist/sitemap.xml'),'utf8');
const urlList=[...new Set([...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replace(/&amp;/g,'&')))];
if(!urlList.length||urlList.length>10000||urlList.some(value=>{const u=new URL(value);return u.origin!==origin||u.hash||u.search||u.username||u.password;}))throw new Error('Sitemap must contain only canonical RobotGo URLs.');
const body={host:new URL(origin).host,key,keyLocation:origin+'/'+keyFile,urlList};
if(!process.argv.includes('--submit')){
 console.log(JSON.stringify({mode:'preview',endpoint,host:body.host,urlCount:urlList.length,urls:urlList},null,2));
}else{
 const options={signal:AbortSignal.timeout(30000),redirect:'error'};
 const keyResponse=await fetch(body.keyLocation,options);
 if(!keyResponse.ok||(await keyResponse.text()).trim()!==key)throw new Error('Public key is not deployed. No URLs submitted.');
 const sitemapResponse=await fetch(origin+'/sitemap.xml',{...options,signal:AbortSignal.timeout(30000)});
 if(!sitemapResponse.ok||(await sitemapResponse.text()).trim()!==sitemap.trim())throw new Error('Live sitemap does not match this release. No URLs submitted.');
 const response=await fetch(endpoint,{method:'POST',headers:{'Content-Type':'application/json; charset=utf-8'},body:JSON.stringify(body),signal:AbortSignal.timeout(30000),redirect:'error'});
 const result={submittedAt:new Date().toISOString(),endpoint,httpStatus:response.status,urlCount:urlList.length,received:[200,202].includes(response.status),keyValidationPending:response.status===202,indexingConfirmed:false,response:(await response.text()).slice(0,1000)};
 console.log(JSON.stringify(result,null,2));
 if(!result.received)process.exitCode=1;
}
