/** Produce only public static output. No installation or build-time network access. */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {verify} from './verify.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
try {
 verify();
 const dist=path.join(root,'dist');
 fs.rmSync(dist,{recursive:true,force:true});
 fs.cpSync(path.join(root,'public'),dist,{recursive:true,errorOnExist:true});
 console.log('Built dist/ — only the approved public directory is published.');
} catch(e) {console.error('Build aborted:',e.message);process.exitCode=1;}
