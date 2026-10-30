/** Produce only public static output. No installation or build-time network access. */
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {verify} from './verify.mjs';
import {generateSearchPages} from './search-pages.mjs';
import {verifySearchPages} from './verify-search-pages.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
try {
 verify();
 const dist=path.join(root,'dist');
 fs.rmSync(dist,{recursive:true,force:true});
 fs.cpSync(path.join(root,'public'),dist,{recursive:true,errorOnExist:true});
 // Use a content version so browsers cannot mix assets from different releases.
 const indexPath=path.join(dist,'index.html');
 const html=fs.readFileSync(indexPath,'utf8').replace(
  /((?:src|href)=")([\w./-]+\.(?:js|css))(\")/g,
  (_,before,file,after)=>{
   const version=createHash('sha256').update(fs.readFileSync(path.join(dist,file))).digest('hex').slice(0,12);
   return `${before}${file}?v=${version}${after}`;
  }
 );
 const pages=generateSearchPages(root,dist,html);
 verifySearchPages(root,dist,pages);
 console.log('Built dist/ — only the approved public directory is published.');
} catch(e) {console.error('Build aborted:',e.message);process.exitCode=1;}
