import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const ctx={window:{}};
for(const name of ['site-config','catalog','social-video-data','social-video','video-pages'])vm.runInNewContext(fs.readFileSync(path.join(root,'public',name+'.js'),'utf8'),ctx);
const V=ctx.window.ROBOTGO_VIDEO;
const expected={'pudu-cc1':'SfmkM3auKCc','pudu-bellabot':'XnuYEJsRNIA','pudu-t300':'LRvsGNN_g88','unitree-g1':'LN_M6Q1zGqM'};

test('watch pages preserve the verified product/video mapping in both languages',()=>{
 for(const [product,id]of Object.entries(expected)){
  const v=V.byProduct(product);
  assert.equal(v.youtubeId,id);
  assert.ok(ctx.window.ROBOTGO_SOCIAL_DATA.videos[product].url.endsWith('/'+id));
  for(const lang of ['ro','en']){
   const html=V.render('/video/'+product,lang);
   assert.equal((html.match(/<iframe /g)||[]).length,1);
   assert.ok(html.includes('src="https://www.youtube-nocookie.com/embed/'+id+'"'));
   assert.ok(!/data:video|base64|autoplay|srcdoc=/.test(html));
   assert.ok(html.includes('href="/product/'+product+'/"'));
   assert.ok(html.includes('href="/quote/?product='+product+'"'));
   assert.ok(html.includes('href="https://wa.me/40778167507?text='));
   assert.ok(!/undefined|NaN/.test(html));
   const catalogProduct=ctx.window.ROBOTGO_CATALOG.products.find(p=>p.id===product);
   assert.ok(ctx.window.ROBOTGO_SOCIAL.product(catalogProduct,lang).includes('href="/video/'+product+'/"'));
  }
 }
 assert.equal(V.render('/video/missing'),null);
});

test('initial HTML, video schema and video sitemap point to the same playable embed',()=>{
 const sitemap=fs.readFileSync(path.join(root,'dist/video-sitemap.xml'),'utf8');
 const mainSitemap=fs.readFileSync(path.join(root,'dist/sitemap.xml'),'utf8');
 assert.equal((sitemap.match(/<video:video>/g)||[]).length,4);
 assert.ok(fs.readFileSync(path.join(root,'dist/robots.txt'),'utf8').includes('Sitemap: https://robotgo.ro/video-sitemap.xml'));
 for(const [product,id]of Object.entries(expected)){
  const html=fs.readFileSync(path.join(root,'dist/video',product,'index.html'),'utf8');
  const graph=JSON.parse(html.match(/id="robotgo-schema" type="application\/ld\+json">(.*?)<\/script>/s)[1])['@graph'];
  const video=graph.find(x=>x['@type']==='VideoObject');
  const webpage=graph.find(x=>x['@type']==='WebPage');
  assert.equal(webpage.mainEntity['@id'],video['@id']);
  assert.equal(video.embedUrl,'https://www.youtube-nocookie.com/embed/'+id);
  assert.ok(html.includes('src="'+video.embedUrl+'"'));
  assert.equal(video.thumbnailUrl[0],'https://i.ytimg.com/vi/'+id+'/hqdefault.jpg');
  assert.equal(video.duration,'PT32S');
  assert.ok(!Number.isNaN(Date.parse(video.uploadDate)));
  assert.ok(!('contentUrl' in video),'An HTML player is not an MP4 content URL');
  assert.ok(sitemap.includes('<video:player_loc>'+video.embedUrl+'</video:player_loc>'));
  assert.ok(mainSitemap.includes('<loc>https://robotgo.ro/video/'+product+'/</loc>'));
 }
});
