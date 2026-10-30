/** Loopback-only static server for testing the production bundle, headers and video ranges. */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist=path.join(root,'dist');
if(!fs.existsSync(path.join(dist,'index.html')))throw new Error('Run node tools/build.mjs first.');
const hosting=JSON.parse(fs.readFileSync(path.join(root,'config/hosting.json'),'utf8'));
const mime={'.html':'text/html; charset=utf-8','.xml':'application/xml; charset=utf-8','.js':'text/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.mp4':'video/mp4','.txt':'text/plain; charset=utf-8','.ico':'image/x-icon'};
function reply404(req,res){res.writeHead(404,{'Content-Type':'text/html; charset=utf-8'});if(req.method==='HEAD')res.end();else fs.createReadStream(path.join(dist,'404.html')).pipe(res);}
const server=http.createServer((req,res)=>{
 for(const[k,v]of Object.entries(hosting.headers))res.setHeader(k,v);
 if(!['GET','HEAD'].includes(req.method)){res.writeHead(405,{'Allow':'GET, HEAD','Content-Type':'text/plain'});return res.end('Method not allowed. This is a static preview, not an API.');}
 let urlPath;
 try{urlPath=decodeURIComponent(new URL(req.url,'http://localhost').pathname);}catch{res.writeHead(400);return res.end();}
 if(urlPath.split('/').some(x=>x.startsWith('.'))||urlPath.includes('\\')||urlPath.includes('\0'))return reply404(req,res);
 const file=path.resolve(dist,'.'+(urlPath==='/'?'/index.html':urlPath));
 if(!file.startsWith(dist+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()||!fs.realpathSync(file).startsWith(fs.realpathSync(dist)+path.sep))return reply404(req,res);
 const {size}=fs.statSync(file);
 if(urlPath.startsWith('/assets/'))res.setHeader('Cache-Control',hosting.assetCacheControl);
 res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');
 res.setHeader('Accept-Ranges','bytes');
 let start=0,end=size-1,status=200;
 if(req.headers.range){
  const match=/^bytes=(\d*)-(\d*)$/.exec(req.headers.range);
  if(!match||(!match[1]&&!match[2])){res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end();}
  if(match[1]){start=Number(match[1]);end=match[2]?Number(match[2]):end;}
  else{start=Math.max(0,size-Number(match[2]));}
  if(!Number.isSafeInteger(start)||!Number.isSafeInteger(end)||start<0||start>=size||end<start){res.writeHead(416,{'Content-Range':`bytes */${size}`});return res.end();}
  end=Math.min(end,size-1);status=206;res.setHeader('Content-Range',`bytes ${start}-${end}/${size}`);
 }
 res.writeHead(status,{'Content-Length':end-start+1});
 if(req.method==='HEAD')return res.end();
 const stream=fs.createReadStream(file,{start,end});
 stream.on('error',()=>res.destroy());req.on('close',()=>stream.destroy());stream.pipe(res);
});
const port=Number(process.env.PORT||4173);
if(!Number.isInteger(port)||port<1024||port>65535)throw new Error('PORT must be 1024–65535.');
server.listen(port,'127.0.0.1',()=>console.log(`Local preview only: http://127.0.0.1:${port}`));
