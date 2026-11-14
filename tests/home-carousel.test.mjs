import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=file=>fs.readFileSync(new URL('../public/'+file+'.js',import.meta.url),'utf8');
class Element {
 constructor(){this.listeners=new Map();this.attrs={};this.isConnected=true;this.dataset={};}
 addEventListener(type,fn){if(!this.listeners.has(type))this.listeners.set(type,new Set());this.listeners.get(type).add(fn);}
 removeEventListener(type,fn){this.listeners.get(type)?.delete(fn);}
 emit(type,event={}){this.listeners.get(type)?.forEach(fn=>fn(event));}
 setAttribute(key,value){this.attrs[key]=value;}
 contains(el){return el===this;}
}
function harness(reduced=false){
 const root=new Element(),document=new Element(),media=new Element(),timers=new Map();let count=0,observer;
 media.matches=reduced;document.hidden=false;
 const panels=Array.from({length:5},()=>new Element()),choices=Array.from({length:5},()=>new Element());
 const controls=Object.fromEntries(['[data-carousel-play]','[data-carousel-prev]','[data-carousel-next]','[data-carousel-title]','[data-carousel-models]','.rg-carousel-position','.rg-carousel-caption','.rg-carousel-viewport'].map(s=>[s,new Element()]));
 root.querySelector=s=>controls[s];root.querySelectorAll=s=>s==='.rg-carousel-slide'?panels:choices;
 document.getElementById=id=>id==='rg-carousel'?root:null;
 const window={matchMedia:()=>media,IntersectionObserver:class{constructor(fn){observer=fn;}observe(){}disconnect(){observer=null;}}};
 const ctx={window,document,IntersectionObserver:window.IntersectionObserver,setTimeout:fn=>{const id=++count;timers.set(id,fn);return id;},clearTimeout:id=>timers.delete(id)};
 for(const file of ['catalog','market-prices','practical','home-showroom'])vm.runInNewContext(read(file),ctx);
 const home=window.ROBOTGO_HOME;home.mount();
 return {home,root,document,media,panels,choices,controls,timers,tick(){const job=[...timers][0];assert.ok(job,'autoplay scheduled');timers.delete(job[0]);job[1]();},intersect(value){observer([{isIntersecting:value}]);}};
}
test('autoplay changes one visible slide, manual selection pauses it, and wraparound works',()=>{
 const h=harness();h.tick();
 assert.equal(h.panels.filter(p=>!p.hidden).length,1);assert.equal(h.panels[1].hidden,false);
 h.choices[4].emit('click');assert.equal(h.panels[4].hidden,false);assert.equal(h.timers.size,0);
 assert.equal(h.controls['[data-carousel-play]'].attrs['aria-label'],'Pornește schimbarea automată');
 h.controls['[data-carousel-next]'].emit('click');assert.equal(h.panels[0].hidden,false);
 assert.equal(h.panels.filter(p=>p.inert).length,4);
 h.controls['[data-carousel-prev]'].emit('click');assert.equal(h.panels[4].hidden,false);
 h.controls['[data-carousel-play]'].emit('click');h.tick();assert.equal(h.panels[0].hidden,false);
});
test('autoplay respects reduced motion, background tabs, viewport visibility and pointer hover',()=>{
 const h=harness(true);assert.equal(h.timers.size,0);
 h.controls['[data-carousel-play]'].emit('click');assert.equal(h.timers.size,1);
 h.document.hidden=true;h.document.emit('visibilitychange');assert.equal(h.timers.size,0);
 h.document.hidden=false;h.document.emit('visibilitychange');assert.equal(h.timers.size,1);
 h.intersect(false);assert.equal(h.timers.size,0);h.intersect(true);assert.equal(h.timers.size,1);
 h.root.emit('pointerenter',{pointerType:'mouse'});assert.equal(h.timers.size,0);
 h.root.emit('pointerleave');assert.equal(h.timers.size,1);
 h.media.matches=true;h.media.emit('change');assert.equal(h.timers.size,0);
});
test('swipe ignores vertical scrolling and route remount removes timers and listeners',()=>{
 const h=harness(),v=h.controls['.rg-carousel-viewport'];
 v.emit('touchstart',{touches:[{clientX:200,clientY:200}]});v.emit('touchend',{changedTouches:[{clientX:190,clientY:90}]});assert.equal(h.timers.size,1);
 v.emit('touchstart',{touches:[{clientX:200,clientY:200}]});v.emit('touchend',{changedTouches:[{clientX:80,clientY:205}]});assert.equal(h.panels[1].hidden,false);assert.equal(h.timers.size,0);
 h.home.mount();assert.equal(h.timers.size,1);assert.equal(h.controls['[data-carousel-next]'].listeners.get('click').size,1);
 h.home.unmount();assert.equal(h.timers.size,0);assert.equal(h.document.listeners.get('visibilitychange').size,0);assert.equal(h.media.listeners.get('change').size,0);
});
