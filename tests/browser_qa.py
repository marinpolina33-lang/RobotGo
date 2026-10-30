"""Browser + HTTP tests for the exact static deployment bundle. No live writes."""
from pathlib import Path
import subprocess,time,urllib.request,urllib.error,json,traceback,sys,base64,mimetypes,re
from playwright.sync_api import sync_playwright
R=Path(__file__).resolve().parents[1]
BASE='http://127.0.0.1:4173'
report={'release':'0.4h-p1','scope':'HTTP/static checks use a loopback Node server. Browser UI checks use an in-memory snapshot with the same application code and embedded local assets because managed Chromium blocks both HTTP-local and file navigation. External images are blocked. Real HTTP browser navigation, enforced CSP, persistent localStorage, live services and remote deployment are not validated.','checks':[],'js_errors':[],'csp_violations':[]}
def check(name,ok,details=None):
 report['checks'].append({'name':name,'passed':bool(ok),'details':details});print(('PASS ' if ok else 'FAIL ')+name,flush=True)
 (R/'tests/browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
def request(path='/',method='GET',headers=None):
 try:
  with urllib.request.urlopen(urllib.request.Request(BASE+path,method=method,headers=headers or {}),timeout=5) as r:return r.status,dict(r.headers),r.read()
 except urllib.error.HTTPError as e:return e.code,dict(e.headers),e.read()
def in_memory_snapshot():
 pub=R/'dist'
 def uri(v):
  f=pub/v
  return 'data:'+(mimetypes.guess_type(f.name)[0] or 'application/octet-stream')+';base64,'+base64.b64encode(f.read_bytes()).decode()
 def convert(v):
  if isinstance(v,str) and v.startswith('assets/'):return uri(v)
  if isinstance(v,list):return [convert(x) for x in v]
  if isinstance(v,dict):return {k:convert(x) for k,x in v.items()}
  return v
 h=(pub/'index.html').read_text()
 for name in re.findall(r'<link rel="stylesheet" href="([^"]+)">',h):h=h.replace('<link rel="stylesheet" href="'+name+'">','<style>'+(pub/name).read_text()+'</style>')
 for name in re.findall(r'<script src="([^"]+)"></script>',h):
  pairs={'catalog.js':('catalog.json','ROBOTGO_CATALOG'),'visuals.js':('visuals.json','ROBOTGO_VISUALS'),'exhibition-data.js':('exhibition.json','ROBOTGO_EXHIBITION')}
  if name in pairs:
   src,key=pairs[name];code='window.'+key+'='+json.dumps(convert(json.loads((pub/src).read_text())),ensure_ascii=False)+';'
  else:code=(pub/name).read_text()
  h=h.replace('<script src="'+name+'"></script>','<script>'+code.replace('</script','<\\/script')+'</script>')
 return h.replace('href="favicon.svg"','href="'+uri('favicon.svg')+'"')
server=subprocess.Popen(['node','tools/preview.mjs'],cwd=R,stdout=subprocess.DEVNULL,stderr=subprocess.PIPE)
try:
 for _ in range(60):
  try:request();break
  except Exception:time.sleep(.1)
 s,h,b=request();check('Home served with HTTP 200',s==200)
 check('CSP, framing, MIME and noindex headers served',h.get('X-Frame-Options')=='DENY' and h.get('X-Content-Type-Options')=='nosniff' and "script-src 'self'" in h.get('Content-Security-Policy','') and h.get('X-Robots-Tag')=='noindex, nofollow')
 check('HEAD returns no body',len(request('/',method='HEAD')[2])==0)
 for p in ['/.env','/server.mjs','/private/SOURCES.json','/render.yaml','/.git/config','/api/status','/api/requests','/missing-file.js']:
  check('Not publicly served: '+p,request(p)[0]==404)
 check('POST cannot create a request on static preview',request('/api/requests',method='POST')[0]==405)
 s,h,b=request('/assets/expozitie/umanoid-demonstratie.mp4',headers={'Range':'bytes=0-1023'})
 check('MP4 supports partial-content playback',s==206 and len(b)==1024 and h.get('Content-Type')=='video/mp4')
 check('Invalid byte range returns 416',request('/assets/expozitie/umanoid-demonstratie.mp4',headers={'Range':'bytes=999999999-'})[0]==416)
 files=[p for p in (R/'dist').rglob('*') if p.is_file() and p.name!='.htaccess']
 missing=[str(p.relative_to(R/'dist')) for p in files if request('/'+p.relative_to(R/'dist').as_posix(),method='HEAD')[0]!=200]
 check('Every public file returns HTTP 200',not missing,{'files':len(files),'missing':missing})
 with sync_playwright() as pw:
  browser=pw.chromium.launch(executable_path='/usr/bin/chromium',headless=True,args=['--no-sandbox'])
  ctx=browser.new_context(viewport={'width':1440,'height':1000},accept_downloads=True)
  ctx.route('**/*',lambda route:route.continue_() if route.request.url.startswith((BASE,'data:','blob:')) else route.abort())
  ctx.add_init_script("window.__csp=[];document.addEventListener('securitypolicyviolation',e=>window.__csp.push({directive:e.violatedDirective,blocked:e.blockedURI}));")
  page=ctx.new_page();page.set_default_timeout(5500)
  page.on('pageerror',lambda err:report['js_errors'].append(str(err)))
  page.set_content(in_memory_snapshot(),wait_until='domcontentloaded');page.wait_for_function('!!window.ROBOTGO_DIAGNOSTICS');page.wait_for_timeout(200)
  def go(path):page.evaluate('(p)=>location.hash=p',path);page.wait_for_timeout(100)
  check('Home title and RobotGo branding render','Robotul potrivit' in page.locator('h1').inner_text() and 'RobotGo' in page.locator('#header').inner_text())
  check('26 catalogue products loaded',page.evaluate('ROBOTGO_DIAGNOSTICS.getState().products')==26)
  check('AI/backend remain inactive',page.evaluate('ROBOTGO_CONFIG.backendEnabled===false && ROBOTGO_DIAGNOSTICS.getState().capabilities.ai===false'))
  check('Real exhibition photos appear on Home',page.locator('[data-ex-injected] .ex-card').count()==3)
  page.locator('.ap-cta-row [data-action="wizard"]').click();check('Selection wizard opens',page.locator('.wizard-stage').count()==1)
  page.locator('[data-action="wizard-domain"][data-domain="educatie"]').click();page.locator('[data-action="wizard-env"][data-env="lab"]').click()
  page.locator('#wizard-objective').fill('Demonstrație educațională supravegheată.');page.locator('[data-action="wizard-next"]').click()
  check('Wizard returns a model shortlist',page.locator('.wizard-result').inner_text().strip()!='');page.keyboard.press('Escape')
  go('/shop');check('Shop starts with 9 cards',page.locator('#shop-results > article').count()==9)
  page.locator('[data-filter="category"][value="umanoizi"]').check();page.wait_for_timeout(120)
  check('Interactive category filter updates URL and results','umanoizi' in page.url and page.locator('#shop-results > article').count()>0)
  go('/shop?q=unitree');check('Search query filters catalogue',page.locator('#shop-results').inner_text().lower().count('unitree')>=1)
  go('/product/unitree-g1');page.locator('[data-action="add-cart"]').first.click()
  check('Product adds to cart',page.evaluate('ROBOTGO_DIAGNOSTICS.getState().cart["unitree-g1"]')==1)
  page.locator('[data-action="compare"]').first.click();check('Product adds to comparison','unitree-g1' in page.evaluate('ROBOTGO_DIAGNOSTICS.getState().compare'))
  go('/shop?q=unitree%20g1');page.locator('[data-action="favorite"][data-id="unitree-g1"]').first.click();check('Product saves to favourites','unitree-g1' in page.evaluate('ROBOTGO_DIAGNOSTICS.getState().favorites'))
  go('/checkout');page.locator('#project').fill('Test local: solicitare de demonstrație. Nu trimite.');page.locator('input[name="acknowledge"]').check()
  with page.expect_download() as dl:page.locator('button[data-channel="download"]').click()
  download=dl.value;check('Purchase request downloads locally',download.suggested_filename.startswith('RobotGo_') and download.failure() is None)
  go('/account');check('Real password collection stays disabled',page.locator('input[type="password"]').is_disabled())
  go('/contact');check('No invented public contact details',page.locator('#robotgo-company-contact').count()==0)
  # Test-only fixture: changes browser memory, never the shipped files.
  page.evaluate("Object.assign(ROBOTGO_CONFIG,{companyName:'TEST CONTACT — NEPUBLICAT', email:'test@example.invalid',phoneNumber:'+40700123456', address:'Adresă de test'});")
  go('/');go('/contact');page.wait_for_selector('#robotgo-company-contact')
  check('Configured company/contact fields render', 'TEST CONTACT' in page.locator('#robotgo-company-contact').inner_text())
  check('Contact email and phone actions use safe links',page.locator('#robotgo-company-contact a[href^="mailto:"]').count()==1 and page.locator('#robotgo-company-contact a[href^="tel:"]').count()==1)
  page.locator('[data-action="language"]').click();page.wait_for_timeout(100)
  check('Contact module switches to English','Contact details' in page.locator('#robotgo-company-contact').inner_text())
  page.evaluate("Object.assign(ROBOTGO_CONFIG,{companyName:'',email:'',phoneNumber:'',address:''});")
  page.locator('[data-action="language"]').click();go('/media')
  check('All exhibition media appear',page.locator('.ex-card').count()==7)
  for m in page.evaluate('ROBOTGO_EXHIBITION.items.filter(x=>x.kind==="photo")'):
   page.locator(f'.ex-visual[data-ex-open="{m["id"]}"]').click();page.wait_for_function('document.querySelector(".rw-zoom-canvas img").naturalWidth>0')
   check('Exhibition photo loads and zooms: '+m['id'],page.locator('.rw-zoom-canvas img').evaluate('(i)=>i.naturalWidth>500'))
   page.locator('[data-action="rw-zoom-in"]').click();check('Zoom changes scale: '+m['id'],page.locator('#rw-zoom-value').inner_text()=='150%');page.keyboard.press('Escape')
  for m in page.evaluate('ROBOTGO_EXHIBITION.items.filter(x=>x.kind==="video")'):
   page.locator(f'.ex-visual[data-ex-open="{m["id"]}"]').click();page.wait_for_function('document.querySelector("#ex-current-video").readyState>=1',timeout=12000)
   check('Video opens paused: '+m['id'],page.locator('#ex-current-video').evaluate('(v)=>v.paused && v.muted && !v.autoplay'))
   page.locator('#ex-current-video').evaluate('(v)=>v.play()');page.wait_for_timeout(350)
   check('Video actually plays: '+m['id'],page.locator('#ex-current-video').evaluate('(v)=>v.currentTime>0.1 && !v.paused'))
   page.keyboard.press('Escape');check('Video removed on close: '+m['id'],page.locator('video').count()==0)
  paths=page.evaluate('ROBOTGO_DIAGNOSTICS.routes');missing=[]
  for language in ['ro','en']:
   if page.evaluate('ROBOTGO_DIAGNOSTICS.getState().language')!=language:page.locator('[data-action="language"]').click()
   for p in paths:
    go(p)
    if not page.locator('#main').inner_text().strip():missing.append(language+':'+p)
  check('All application routes render in RO and EN',not missing,{'routes':len(paths),'language_route_visits':2*len(paths),'missing':missing})
  if page.evaluate('ROBOTGO_DIAGNOSTICS.getState().language')!='ro':page.locator('[data-action="language"]').click()
  for width in [360,390,768,1440]:
   page.set_viewport_size({'width':width,'height':900})
   for p in ['/','/shop','/media','/contact','/account']:
    go(p);check(f'No horizontal overflow at {width}px: {p}',page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'))
  go('/privacy');page.locator('[data-action="clear-local"]').click();go('/')
  page.set_viewport_size({'width':1440,'height':1000});page.wait_for_timeout(3800)
  page.screenshot(path='/mnt/data/RobotGo_Pregatit_Desktop.png')
  page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(150);page.screenshot(path='/mnt/data/RobotGo_Pregatit_Mobil.png')
  report['csp_violations']=[]
  check('No browser JavaScript errors',not report['js_errors'],report['js_errors'])

  browser.close()
except Exception:
 report['exception']=traceback.format_exc();print(report['exception'],flush=True)
finally:
 server.terminate()
 try:server.wait(timeout=5)
 except:server.kill()
 report['passed']=sum(c['passed'] for c in report['checks']);report['failed']=sum(not c['passed'] for c in report['checks'])
 report['completed']='exception' not in report
 (R/'tests/browser-report.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
 print({k:report[k] for k in ['completed','passed','failed']},flush=True)
 sys.exit(0 if report['completed'] and report['failed']==0 else 1)
