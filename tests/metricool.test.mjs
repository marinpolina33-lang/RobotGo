import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const source=fs.readFileSync(new URL('../public/metricool.js',import.meta.url),'utf8');
const consentKey='robotgo-metricool-consent-v1';
function browser(options={}){
 const data=new Map(Object.entries(options.storage||{})),requests=[],images=[],events={};
 const pages={'/':{},'/shop':{},'/product/unitree-g1':{},'/account':{},'/quote':{},'/privacy':{noindex:true}};
 const window={ROBOTGO_CONFIG:{metricoolHash:'55560498b07b2fd1cc4109c96fc58cfd'},ROBOTGO_SEO:{pages},ROBOTGO_ROUTING:{publicPaths:Object.keys(pages)},location:{hostname:options.hostname||'robotgo.ro'},innerWidth:390,innerHeight:844,addEventListener:(name,cb)=>{events[name]=cb;}};
 const localStorage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)};
 const navigator={globalPrivacyControl:!!options.gpc};
 const document={referrer:options.referrer||''};
 class Image{constructor(){images.push(this);}set src(value){requests.push(new URL(value));this.onload?.();}}
 vm.runInNewContext(source,{window,localStorage,navigator,document,Image,URL,URLSearchParams,Set});
 return {api:window.ROBOTGO_METRICOOL,window,localStorage,navigator,requests,images,events};
}
const granted={'robotgo-analytics':'allow',[consentKey]:'allow'};

test('never contacts Metricool without new explicit consent, including old internal consent',()=>{
 for(const storage of [{},{'robotgo-analytics':'allow'},{'robotgo-analytics':'deny',[consentKey]:'allow'},{'robotgo-analytics':'allow',[consentKey]:'deny'}]){
  const b=browser({storage});b.api.track('/');assert.equal(b.requests.length,0);
 }
 const b=browser({storage:{'robotgo-analytics':'allow'}});assert.equal(b.api.needsConsent(),true);b.api.setConsent('allow');b.api.track('/');assert.equal(b.requests.length,1);
});
test('preserves refusal, withdrawal and Global Privacy Control',()=>{
 const b=browser({storage:granted});b.api.track('/');b.api.setConsent('deny');b.api.track('/shop');assert.equal(b.requests.length,1);
 b.api.setConsent('allow');b.navigator.globalPrivacyControl=true;b.api.track('/shop');assert.equal(b.requests.length,1);
 const c=browser({storage:granted,gpc:true});c.api.track('/');assert.equal(c.requests.length,0);
});
test('sends the correct brand and sanitized public URL with origin-only referral',()=>{
 const b=browser({storage:granted,referrer:'https://example.com/private/alice?email=private@example.com#secret'});
 b.api.track('/product/unitree-g1/?q=private@example.com#secret');
 assert.equal(b.requests.length,1);const u=b.requests[0];
 assert.equal(u.origin,'https://tracker.metricool.com');assert.equal(u.pathname,'/c3po.jpg');
 assert.equal(u.searchParams.get('hash'),'55560498b07b2fd1cc4109c96fc58cfd');
 assert.equal(u.searchParams.get('u'),'https://robotgo.ro/product/unitree-g1/');assert.equal(u.searchParams.get('ref'),'https://example.com/');
 assert.equal(u.searchParams.get('bw'),'390');assert.equal(u.searchParams.get('bh'),'844');
 assert.equal(u.href.includes('private'),false);assert.equal(b.images[0].referrerPolicy,'no-referrer');assert.equal(b.images[0].crossOrigin,'anonymous');
});
test('does not track private, unknown, noindex or non-production pages',()=>{
 const b=browser({storage:granted});for(const page of ['/account','/quote','/privacy','/api/auth/session','/unknown','/product/private@example.com'])b.api.track(page);assert.equal(b.requests.length,0);
 const c=browser({storage:granted,hostname:'localhost'});c.api.track('/');assert.equal(c.requests.length,0);
});
test('one request per page view, no extra requests from re-rendering',()=>{
 const b=browser({storage:granted});b.api.track('/');b.api.track('/');b.api.track('/shop?q=test');b.api.track('/shop');b.api.track('/');assert.equal(b.requests.length,3);
});
test('cross-tab consent changes use the most recently rendered public page',()=>{
 const b=browser({storage:{'robotgo-analytics':'allow'}});b.api.track('/shop');b.localStorage.setItem(consentKey,'allow');b.events.storage({key:consentKey});assert.equal(b.requests.length,1);assert.equal(b.requests[0].searchParams.get('u'),'https://robotgo.ro/shop/');
});
test('site loads the integration before consent controls and exposes an explicit provider notice',()=>{
 const html=fs.readFileSync(new URL('../public/index.html',import.meta.url),'utf8');
 assert.equal(html.match(/src="metricool.js"/g)?.length,1);assert.ok(html.indexOf('src="metricool.js"')<html.indexOf('src="lead-client.js"'));
 const lead=fs.readFileSync(new URL('../public/lead-client.js',import.meta.url),'utf8');assert.ok(lead.includes('Metricool primește adresa IP'));assert.ok(lead.includes('window.ROBOTGO_METRICOOL?.setConsent(b.dataset.analytics)'));
});
