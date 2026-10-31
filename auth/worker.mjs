import {scrypt, randomBytes, randomUUID, createHash, timingSafeEqual} from 'node:crypto';
import {Buffer} from 'node:buffer';
const ORIGINS = new Set(['https://robotgo.ro', 'https://www.robotgo.ro']);
const COOKIE = '__Host-robotgo_session';
const now = () => Math.floor(Date.now()/1000);
const digest = value => createHash('sha256').update(value).digest('hex');
const token = () => randomBytes(32).toString('base64url');
const fail = (status, code) => {throw Object.assign(new Error(code), {status, code});};
const safeEqual = (a,b) => typeof a === 'string' && typeof b === 'string' && a.length === b.length && timingSafeEqual(Buffer.from(a),Buffer.from(b));
const derive = (password,salt) => new Promise((resolve,reject)=>scrypt(password,salt,32,{N:16384,r:8,p:5,maxmem:32*1024*1024},(e,key)=>e?reject(e):resolve(key)));
export async function hashPassword(password) {
 const salt=randomBytes(16).toString('hex');
 return `scrypt$16384$8$5$${salt}$${(await derive(password,salt)).toString('hex')}`;
}
async function checkPassword(password,hash) {
 const parts=(hash||'').split('$');
 const valid=parts.length===6&&parts.slice(0,4).join('$')==='scrypt$16384$8$5';
 const calculated=(await derive(password,valid?parts[4]:'00000000000000000000000000000000')).toString('hex');
 return valid&&safeEqual(calculated,parts[5]);
}
function email(value) {
 if(typeof value!=='string'||value.length>254)fail(400,'invalid_email');
 const result=value.trim().toLowerCase();
 if(!/^[^\s@<>"']+@[^\s@<>"']+\.[^\s@<>"']+$/.test(result))fail(400,'invalid_email');
 return result;
}
function password(value) {
 if(typeof value!=='string'||value.length<12||value.length>128)fail(400,'password_length');
 if(/^(.)\1+$/.test(value)||/^(password|parola|123456|qwerty|robotgo)/i.test(value))fail(400,'weak_password');
 return value;
}
function publicUser(u) {return {id:u.id,email:u.email,name:u.name,role:u.role,active:!!u.active,mustChangePassword:!!u.must_change,createdAt:u.created_at};}
async function body(req) {
 if(req.headers.get('content-type')?.split(';')[0]!=='application/json'||req.headers.get('x-robotgo-request')!=='1')fail(415,'json_required');
 const reader=req.body?.getReader();if(!reader)fail(400,'invalid_request');
 let size=0;const chunks=[];
 for(;;){const {value,done}=await reader.read();if(done)break;size+=value.length;if(size>8192){await reader.cancel();fail(413,'too_large');}chunks.push(value);}
 try{const parsed=JSON.parse(Buffer.concat(chunks).toString('utf8'));if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))fail(400,'invalid_request');return parsed;}catch{fail(400,'invalid_request');}
}
async function limit(db,key,max,seconds) {
 const t=now(),bucket=`${digest(key)}:${Math.floor(t/seconds)}`;
 const row=await db.prepare('INSERT INTO rate_limits(key,count,expires_at) VALUES(?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(bucket,t+seconds).first();
 if(row.count>max)fail(429,'too_many_attempts');
}
function sessionToken(req) {return req.headers.get('cookie')?.split(';').map(x=>x.trim()).find(x=>x.startsWith(COOKIE+'='))?.slice(COOKIE.length+1)||'';}
async function current(req,db,required=true) {
 const raw=sessionToken(req);
 const u=/^[A-Za-z0-9_-]{43}$/.test(raw)?await db.prepare('SELECT u.*, s.token_hash AS session_hash FROM sessions s JOIN users u ON u.id=s.user_id WHERE s.token_hash=? AND s.expires_at>? AND u.active=1').bind(digest(raw),now()).first():null;
 if(!u&&required)fail(401,'sign_in_required');return u;
}
const cookie=(raw,age)=>`${COOKIE}=${raw}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
async function newSession(db,u) {
 const raw=token(),age=u.role==='admin'?7200:43200,t=now();
 const inserted=await db.prepare('INSERT INTO sessions(token_hash,user_id,expires_at,created_at) SELECT ?,id,?,? FROM users WHERE id=? AND active=1 AND password_hash=? RETURNING token_hash').bind(digest(raw),t+age,t,u.id,u.password_hash).first();
 if(!inserted)fail(401,'sign_in_required');
 return cookie(raw,age);
}
async function cleanup(db) {await db.batch([db.prepare('DELETE FROM sessions WHERE expires_at<=?').bind(now()),db.prepare('DELETE FROM rate_limits WHERE expires_at<=?').bind(now())]);}
async function handle(req,env) {
 const db=env.DB,url=new URL(req.url),path=url.pathname.replace(/^\/api\/auth/,'');
 if(req.method==='GET'&&path==='/health'){await db.prepare('SELECT 1').first();return {data:{ok:true,version:'1.0.0',storage:'persistent'}};}
 if(req.method==='GET'&&path==='/session'){const u=await current(req,db,false);return {data:{user:u?publicUser(u):null}};}
 if(req.method==='GET'&&path==='/admin/users'){
  const u=await current(req,db);if(u.role!=='admin')fail(403,'admin_required');if(u.must_change)fail(403,'change_password_required');
  const page=Math.max(0,Math.min(100000,parseInt(url.searchParams.get('page')||'0',10)||0));
  const {results}=await db.prepare('SELECT id,email,name,role,active,must_change,created_at FROM users ORDER BY created_at DESC,id LIMIT 51 OFFSET ?').bind(page*50).all();
  const count=await db.prepare('SELECT COUNT(*) AS total FROM users').first();
  return {data:{users:results.slice(0,50).map(publicUser),page,hasMore:results.length>50,total:count.total}};
 }
 if(req.method!=='POST')fail(404,'not_found');
 const data=await body(req),ip=req.headers.get('cf-connecting-ip')||'unknown';
 await limit(db,`ip:${ip}`,90,900);
 if(path==='/register') {
  const mail=email(data.email),pass=password(data.password),name=typeof data.name==='string'?data.name.trim():'';
  if(name.length<2||name.length>100)fail(400,'invalid_name');
  if(data.acceptPrivacy!==true)fail(400,'privacy_required');
  await limit(db,`register:${ip}`,5,3600);
  const hash=await hashPassword(pass),recovery=token(),t=now();
  const u={id:randomUUID(),email:mail,name,password_hash:hash,recovery_hash:digest(recovery),role:'user',active:1,must_change:0,created_at:t};
  try{await db.prepare('INSERT INTO users(id,email,name,password_hash,recovery_hash,role,active,must_change,created_at,updated_at) VALUES(?,?,?,?,?,\'user\',1,0,?,?)').bind(u.id,mail,name,hash,u.recovery_hash,t,t).run();}
  catch(e){if(String(e).includes('UNIQUE'))fail(409,'email_registered');throw e;}
  return {status:201,data:{user:publicUser(u),recoveryCode:recovery},cookie:await newSession(db,u)};
 }
 if(path==='/login') {
  const mail=email(data.email);if(typeof data.password!=='string'||data.password.length>128)fail(401,'invalid_credentials');
  await limit(db,`login:${mail}`,12,900);
  const u=await db.prepare('SELECT * FROM users WHERE email=?').bind(mail).first();
  const valid=await checkPassword(data.password,u?.password_hash);
  if(!valid||!u?.active)fail(401,'invalid_credentials');
  await db.prepare('DELETE FROM sessions WHERE token_hash=?').bind(digest(sessionToken(req))).run();
  return {data:{user:publicUser(u)},cookie:await newSession(db,u)};
 }
 if(path==='/logout') {await db.prepare('DELETE FROM sessions WHERE token_hash=?').bind(digest(sessionToken(req))).run();return {data:{ok:true},cookie:cookie('',0)};}
 if(path==='/recover') {
  const mail=email(data.email),pass=password(data.password);
  await limit(db,`recover:${mail}`,6,3600);
  const code=typeof data.recoveryCode==='string'?data.recoveryCode.trim():'';
  const u=await db.prepare('SELECT * FROM users WHERE email=?').bind(mail).first();
  if(!u?.active||!safeEqual(digest(code),u.recovery_hash)||code.length!==43)fail(400,'invalid_recovery');
  const hash=await hashPassword(pass),recovery=token();
  const r=await db.prepare('UPDATE users SET password_hash=?,recovery_hash=?,must_change=0,updated_at=? WHERE id=? AND recovery_hash=? RETURNING id').bind(hash,digest(recovery),now(),u.id,u.recovery_hash).first();
  if(!r)fail(400,'invalid_recovery');
  await db.prepare('DELETE FROM sessions WHERE user_id=?').bind(u.id).run();
  return {data:{ok:true,recoveryCode:recovery},cookie:cookie('',0)};
 }
 const u=await current(req,db);
 if(path==='/password') {
  await limit(db,`password:${u.id}`,6,900);
  const pass=password(data.newPassword);
  if(typeof data.currentPassword!=='string'||data.currentPassword.length>128||!await checkPassword(data.currentPassword,u.password_hash))fail(401,'invalid_credentials');
  if(data.currentPassword===pass)fail(400,'different_password');
  const hash=await hashPassword(pass),recovery=token();
  const updated=await db.prepare('UPDATE users SET password_hash=?,recovery_hash=?,must_change=0,updated_at=? WHERE id=? AND password_hash=? RETURNING id').bind(hash,digest(recovery),now(),u.id,u.password_hash).first();
  if(!updated)fail(409,'session_changed');
  await db.prepare('DELETE FROM sessions WHERE user_id=?').bind(u.id).run();
  u.must_change=0;u.password_hash=hash;
  return {data:{user:publicUser(u),recoveryCode:recovery},cookie:await newSession(db,u)};
 }
 if(u.must_change)fail(403,'change_password_required');
 if(path==='/logout-all') {await db.prepare('DELETE FROM sessions WHERE user_id=?').bind(u.id).run();return {data:{ok:true},cookie:cookie('',0)};}
 if(path==='/admin/user-status') {
  if(u.role!=='admin')fail(403,'admin_required');
  if(typeof data.userId!=='string'||typeof data.active!=='boolean')fail(400,'invalid_request');
  const target=await db.prepare('SELECT id,role FROM users WHERE id=?').bind(data.userId).first();
  if(!target)fail(404,'not_found');if(target.role==='admin')fail(403,'admin_protected');
  await db.batch([db.prepare('UPDATE users SET active=?,updated_at=? WHERE id=?').bind(data.active?1:0,now(),target.id),db.prepare('DELETE FROM sessions WHERE user_id=?').bind(target.id)]);
  return {data:{ok:true}};
 }
 fail(404,'not_found');
}
export default {
 async fetch(req,env,ctx) {
  const origin=req.headers.get('origin'),headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store, private','X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'no-referrer','Vary':'Origin','X-Robots-Tag':'noindex, nofollow'};
  if(origin&&ORIGINS.has(origin)){headers['Access-Control-Allow-Origin']=origin;headers['Access-Control-Allow-Credentials']='true';}
  const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers});
  try {
   if(origin&&!ORIGINS.has(origin))fail(403,'origin_rejected');
   if(req.method==='OPTIONS'){headers['Access-Control-Allow-Methods']='GET, POST, OPTIONS';headers['Access-Control-Allow-Headers']='Content-Type, X-RobotGo-Request';return new Response(null,{status:204,headers});}
   if(req.method==='POST'&&(!origin||!ORIGINS.has(origin)))fail(403,'origin_rejected');
   const result=await handle(req,env);if(result.cookie)headers['Set-Cookie']=result.cookie;
   if(Math.random()<0.01&&ctx?.waitUntil)ctx.waitUntil(cleanup(env.DB).catch(()=>{}));
   return json(result.data,result.status||200);
  }catch(e){if(!e.status)console.error('Authentication backend error:',e.name);if(e.status===429)headers['Retry-After']='900';return json({error:e.code||'temporarily_unavailable'},e.status||503);}
 },
 async scheduled(_event,env,ctx){ctx.waitUntil(cleanup(env.DB));}
};
