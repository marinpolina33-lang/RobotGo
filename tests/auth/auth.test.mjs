import test from 'node:test';
import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import worker,{hashPassword} from '../../auth/worker.mjs';
function database(){const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('../../auth/schema.sql',import.meta.url),'utf8'));const wrap=(query,args=[])=>({bind(...a){return wrap(query,a)},async first(){return sql.prepare(query).get(...args)||null},async run(){return sql.prepare(query).run(...args)},async all(){return {results:sql.prepare(query).all(...args)}}});return {sql,prepare:wrap,async batch(stmts){sql.exec('BEGIN');try{const r=[];for(const s of stmts)r.push(await s.run());sql.exec('COMMIT');return r;}catch(e){sql.exec('ROLLBACK');throw e;}}};}
const pass='Luna-verde!PentruCont2026',other='Stea-albastra!Schimbata2026';
function client(db){let cookie='';return {get cookie(){return cookie},async request(path,data,extra={}){const headers={Origin:'https://robotgo.ro',...extra.headers};if(cookie)headers.Cookie=cookie;if(data!==undefined){headers['Content-Type']='application/json';headers['X-RobotGo-Request']='1';}const res=await worker.fetch(new Request('https://robotgo.ro/api/auth'+path,{method:data===undefined?'GET':'POST',headers,body:data===undefined?undefined:JSON.stringify(data)}),{DB:db},{});const set=res.headers.get('set-cookie');if(set)cookie=set.split(';')[0];return {status:res.status,body:await res.json(),headers:res.headers};}};}
const signup={email:'client@example.test',name:'Client test',password:pass,acceptPrivacy:true,role:'admin'};
test('registration, server role, protected admin, logout revocation and persisted accounts',async()=>{const db=database(),c=client(db);let r=await c.request('/register',signup);assert.equal(r.status,201);assert.equal(r.body.user.role,'user');assert.match(r.headers.get('set-cookie'),/HttpOnly; Secure; SameSite=Strict/);assert.equal(r.body.recoveryCode.length,43);const stored=db.sql.prepare('SELECT * FROM users').get();assert.notEqual(stored.password_hash,pass);assert.match(stored.password_hash,/^scrypt\$16384\$8\$5\$/);assert.equal((await c.request('/admin/users')).status,403);const old=c.cookie;assert.equal((await c.request('/logout',{})).status,200);assert.equal((await c.request('/session')).body.user,null);const revoked=await worker.fetch(new Request('https://robotgo.ro/api/auth/session',{headers:{cookie:old}}),{DB:db},{});assert.equal((await revoked.json()).user,null);assert.equal((await client(db).request('/login',{email:signup.email.toUpperCase(),password:pass})).status,200);});
test('password change revokes other devices and recovery rotates one-time code',async()=>{const db=database(),a=client(db),b=client(db);const initial=await a.request('/register',signup);await b.request('/login',{email:signup.email,password:pass});assert.equal((await a.request('/password',{currentPassword:'wrong',newPassword:other})).status,401);const changed=await a.request('/password',{currentPassword:pass,newPassword:other});assert.equal(changed.status,200);assert.equal((await b.request('/session')).body.user,null);assert.equal((await b.request('/login',{email:signup.email,password:pass})).status,401);assert.equal((await b.request('/recover',{email:signup.email,password:pass,recoveryCode:initial.body.recoveryCode})).status,400);const reset=await b.request('/recover',{email:signup.email,password:pass,recoveryCode:changed.body.recoveryCode});assert.equal(reset.status,200);assert.equal((await a.request('/session')).body.user,null);assert.equal((await b.request('/recover',{email:signup.email,password:other,recoveryCode:changed.body.recoveryCode})).status,400);assert.equal((await b.request('/login',{email:signup.email,password:pass})).status,200);});
test('admin must change initial password; disabling user revokes access',async()=>{const db=database(),admin=client(db),user=client(db);const t=Math.floor(Date.now()/1000);db.sql.prepare('INSERT INTO users(id,email,name,password_hash,role,active,must_change,created_at,updated_at) VALUES(?,?,?,?,?,1,1,?,?)').run('admin','admin@example.test','Administrator',await hashPassword(pass),'admin',t,t);await admin.request('/login',{email:'admin@example.test',password:pass});assert.equal((await admin.request('/admin/users')).status,403);await admin.request('/password',{currentPassword:pass,newPassword:other});const registered=await user.request('/register',signup);const listed=await admin.request('/admin/users');assert.equal(listed.status,200);assert.equal(listed.body.total,2);assert.equal(JSON.stringify(listed.body).includes('password_hash'),false);assert.equal((await admin.request('/admin/user-status',{userId:registered.body.user.id,active:false})).status,200);assert.equal((await user.request('/session')).body.user,null);assert.equal((await user.request('/login',{email:signup.email,password:pass})).status,401);assert.equal((await admin.request('/admin/user-status',{userId:'admin',active:false})).status,403);});
test('CSRF, validation, rate limits, duplicate emails and expiry',async()=>{const db=database(),c=client(db);assert.equal((await c.request('/register',signup,{headers:{Origin:'https://evil.test'}})).status,403);assert.equal((await c.request('/register',{...signup,password:'short'})).status,400);assert.equal((await c.request('/register',{...signup,acceptPrivacy:false})).status,400);await c.request('/register',signup);assert.equal((await c.request('/register',signup)).status,409);db.sql.prepare('UPDATE sessions SET expires_at=0').run();assert.equal((await c.request('/session')).body.user,null);for(let i=0;i<12;i++)assert.equal((await c.request('/login',{email:signup.email,password:'wrong'})).status,401);assert.equal((await c.request('/login',{email:signup.email,password:pass})).status,429);const noOrigin=await worker.fetch(new Request('https://robotgo.ro/api/auth/logout',{method:'POST',headers:{'Content-Type':'application/json','X-RobotGo-Request':'1'},body:'{}'}),{DB:db},{});assert.equal(noOrigin.status,403);});
const lead=(extra={})=>({requestKey:'067bc488-9053-4ce0-900b-100000000001',type:'quotation',acceptPrivacy:true,contact:{name:'Verificare tehnică',email:'qa@example.test',phone:'',company:'Test'},project:'Test de recepție pentru robot de servire.',source:'/quote/',items:[{id:'pudu-bellabot',qty:1}],...extra});
test('direct leads persist, retry is idempotent, changed retry rejected; no public listing',async()=>{
 const db=database(),c=client(db);assert.equal((await c.request('/capabilities')).body.leads,true);
 const r=await c.request('/leads',lead());assert.equal(r.status,201);assert.equal(r.body.received,true);
 assert.equal((await c.request('/leads',lead())).body.id,r.body.id);
 assert.equal(db.sql.prepare('SELECT COUNT(*) AS n FROM leads').get().n,1);
 assert.equal((await c.request('/leads',lead({project:'Un alt proiect modificat'}))).status,409);
 assert.equal((await c.request('/admin/leads')).status,401);
 assert.equal((await c.request('/admin/metrics')).status,401);
 assert.equal((await c.request('/admin/lead-status',{id:r.body.id,status:'qualified'})).status,401);
 await c.request('/register',signup);assert.equal((await c.request('/admin/leads')).status,403);
});
test('lead consent, field limits, email, honeypot, foreign origin and rate limits enforced',async()=>{
 const db=database(),c=client(db);
 for(const bad of [{acceptPrivacy:false},{website:'spam'},{project:'x'},{project:'x'.repeat(2501)},{contact:{name:'A',email:'bad'}},{items:[{id:'<script>',qty:1}]},{items:[{id:'pudu-bellabot',qty:100}]}])assert.equal((await c.request('/leads',lead(bad))).status,400);
 assert.equal((await c.request('/leads',lead(),{headers:{Origin:'https://evil.test'}})).status,403);
 for(let i=0;i<6;i++)assert.equal((await c.request('/leads',lead({requestKey:`067bc488-9053-4ce0-900b-10000000000${i}`}))).status,201);
 assert.equal((await c.request('/leads',lead({requestKey:'067bc488-9053-4ce0-900b-100000000009'}))).status,429);
});
test('admin can qualify leads while forced-password and regular accounts cannot',async()=>{
 const db=database(),a=client(db),c=client(db),t=Math.floor(Date.now()/1000);
 db.sql.prepare('INSERT INTO users(id,email,name,password_hash,role,active,must_change,created_at,updated_at) VALUES(?,?,?,?,?,1,1,?,?)').run('admin','admin@example.test','Administrator',await hashPassword(pass),'admin',t,t);
 await a.request('/login',{email:'admin@example.test',password:pass});const leadId=(await c.request('/leads',lead())).body.id;
 assert.equal((await a.request('/admin/leads')).status,403);
 await a.request('/password',{currentPassword:pass,newPassword:other});
 assert.equal((await a.request('/admin/lead-status',{id:leadId,status:'qualified'})).status,200);
 const r=await a.request('/admin/leads');assert.equal(r.body.leads[0].status,'qualified');assert.equal(r.body.leads[0].details.items[0].id,'pudu-bellabot');assert.equal(JSON.stringify(r.body).includes('payload_hash'),false);
 assert.equal((await a.request('/admin/metrics')).body.leads[0].count,1);
 assert.equal((await a.request('/admin/lead-status',{id:leadId,status:'invalid'})).status,400);
});
test('aggregate analytics require consent, allowlisted events and never store submitted form details',async()=>{
 const db=database(),c=client(db),ev={event:'product_view',page:'/product/unitree-g1/',device:'mobile',consent:true,email:'should-not-store@example.test'};
 assert.equal((await c.request('/events',{...ev,consent:false})).status,400);
 assert.equal((await c.request('/events',{...ev,event:'lead_received'})).status,400);
 assert.equal((await c.request('/events',ev)).status,200);
 await c.request('/events',ev);assert.equal(db.sql.prepare('SELECT count FROM event_counts').get().count,2);
 await c.request('/events',{...ev,page:'/quote/?email=private@example.test'});
 const rows=db.sql.prepare('SELECT * FROM event_counts').all();assert.equal(JSON.stringify(rows).includes('@'),false);assert.ok(rows.some(x=>x.page==='/other/'));
});
