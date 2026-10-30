# RobotGo — migrare controlată Cloudflare DNS → ClouDNS

Data pregătirii: 2026-10-30. **Stare: doar pregătire. Delegarea la RoTLD NU a fost modificată.**

## Ce păstrăm

- Înregistrarea domeniului `robotgo.ro`: RoTLD
- Hosting: Render Static Site `robotgo-preview`, `https://robotgo-preview.onrender.com`
- Cod și deploy: `marinpolina33-lang/RobotGo` → `main` → Render
- DNS țintă: ClouDNS (înlocuiește exclusiv DNS-ul Cloudflare)

## Important: două niveluri de automatizare

- **ClouDNS Free**: permite editarea manuală a înregistrărilor în interfața ClouDNS; **NU include API HTTP**. GitHub Actions poate face audituri DNS publice automat, fără chei sau card.
- **ClouDNS Premium**: include API HTTP. Pentru administrare automată cu GitHub trebuie un cont cu acces API, utilizator API separat și secrete GitHub. Un trial Premium S de 30 zile poate fi disponibil fără card, dar nu presupune acces API permanent după expirare.
- Nu există o integrare ClouDNS ChatGPT instalată în acest proiect. Nu trimite parole sau tokenuri în conversație.
- Auditul GitHub pregătit aici este strict **read-only**. Nu realizează modificări DNS, nu creează o zonă și nu schimbă nameserverele.

Documentație:
https://www.cloudns.net/premium/
https://www.cloudns.net/wiki/article/29/
https://www.cloudns.net/wiki/article/42/
https://render.com/docs/custom-domains
https://render.com/docs/configure-other-dns

## Etapa 1 — înainte de schimbarea nameserverelor

1. Intră în Render la `https://dashboard.render.com/static/srv-dbi1mddg1s2s73dnmbhg` → Settings → Custom Domains → Add Custom Domain. Adaugă `robotgo.ro`; verifică dacă Render adaugă și `www.robotgo.ro`. Notează valorile DNS **exact afișate**. Nu dezactiva subdomeniul onrender.com.
2. Din Cloudflare (dacă mai ai acces) **exportă toate înregistrările DNS**: A, AAAA, CNAME, MX, TXT/SPF, DKIM, DMARC, CAA, SRV, subdomenii, verificări și eventuale setări DNSSEC. Rezultatele DNS publice nu garantează inventarul complet.
3. Creează/accesează contul `https://www.cloudns.net/`. Din Dashboard → DNS Hosting → Create zone → **Master zone**, nu un `Free zone` cu hostname ClouDNS. Introdu `robotgo.ro` (fără https://, fără www). Alege `Create with NS records`, recomandat de ClouDNS.
4. În zona nouă configurează înregistrările site-ului. După confirmarea lor în Render, valorile propuse sunt:
   - `A` | host `@` (sau gol dacă interfața ClouDNS indică astfel) | `216.24.57.1`
   - `CNAME` | host `www` | `robotgo-preview.onrender.com`
   - Elimină orice A/AAAA/CNAME incompatibile **doar din zona ClouDNS nouă**, după verificare; Render avertizează că AAAA poate cauza probleme.
   - Nu inventa și nu șterge MX/TXT/CAA/alte înregistrări. Reproduce exact ceea ce e necesar pentru email și alte servicii.
5. Notează nameserverele **asociate zonei tale** în ClouDNS. Nu copia nameservere generice din exemplele documentației; pot varia după cont și plan.

## Etapa 2 — audit fără schimbarea delegării

6. Rulează GitHub Actions (după ce fișierul ajunge pe ramura implicită) `RobotGo ClouDNS - audit DNS without access keys` cu input `name_servers` = nameserverele din contul tău ClouDNS, separate prin virgulă.
   - Pe ramura de pregătire există și testul automat la `push`.
   - Scriptul `tools/cloudns_dns_audit.py` poate interoga direct fiecare nameserver ClouDNS, chiar dacă RoTLD indică încă Cloudflare.
   - Așteptăm să vedem A pentru domeniul principal = `216.24.57.1`, CNAME `www` = `robotgo-preview.onrender.com` și **fără AAAA** pentru apex.
   - Confirmă separat înregistrările de email, celelalte subdomenii și eventualele CAA. Un mesaj `WEB DNS PRECONFIGURAT` nu validează toate serviciile.
7. La RoTLD verifică DNSSEC/DS înainte de migrare. Dacă există DS pentru vechiul furnizor, coordonează dezactivarea/actualizarea cu noua zonă; o cheie DS greșită poate opri rezolvarea DNS.

## Etapa 3 — schimbarea nameserverelor (EXCLUSĂ din automatizare)

8. **Numai după finalizarea etapelor 1 și 2**, intră la `https://rotld.ro/domadmin/` → administrarea domeniului → Nameservere. Înlocuiește nameserverele Cloudflare cu cele listate exact în ClouDNS.
9. Verifică delegarea NS la 1.1.1.1 și 8.8.8.8, răspunsul HTTPS pentru `https://robotgo.ro` și `https://www.robotgo.ro`, rezolvarea emailului și starea Custom Domains/SSL din Render.
10. Dacă apar probleme, păstrează și inventarul Cloudflare original pentru rollback, dacă zona Cloudflare încă există și este funcțională. Schimbarea NS înapoi nu este întotdeauna instantanee.

## Starea site-ului comercial

Codul RobotGo din `main` rămâne PREVIEW / DEMO și conține `noindex`; transferul DNS nu activează AI, formulare reale, plăți, indexare sau contactele comerciale. Acestea se tratează separat înainte de lansarea comercială.

## Verificări și siguranță

- Fișierul `config/cloudns-dns.json` descrie numai valorile propuse, fără credențiale.
- Workflow GitHub folosește `contents: read` și doar comenzi DNS/HTTP de citire.
- În această pregătire nu s-a creat zona ClouDNS și nu s-a schimbat nimic la RoTLD, Render sau Cloudflare.
- În GitHub există un vechi Pull Request Draft pentru DigitalOcean; **nu îl integra** dacă s-a decis ClouDNS.

## Alternativă: automatizarea ClouDNS Premium HTTP API (opțional)

ClouDNS Free nu oferă HTTP API. Pentru ca GitHub să poată crea zona și înregistrările automat, contul trebuie să aibă **Premium S ori alt plan cu HTTP API**. ClouDNS anunță un trial Premium S de 30 zile fără card, însă accesul API și continuarea după expirare se verifică în cont.

1. În ClouDNS: **API & Resellers → API Users → Add new user**. Preferabil folosește un sub-user cu permisiuni numai pentru zona `robotgo.ro` când configurarea contului o permite. Păstrează secretele doar în GitHub, nu în chat sau fișiere.
2. În GitHub `marinpolina33-lang/RobotGo` → **Settings → Secrets and variables → Actions**: adaugă `CLOUDNS_AUTH_ID` și `CLOUDNS_AUTH_PASSWORD` în repository secrets (sau în environment-ul `dns-production`). Nu sunt necesare chei DigitalOcean.
3. Configurează GitHub **Settings → Environments → dns-production** cu aprobare pentru modificări, dacă planul și setările permit; aprobarea nu se configurează automat de script.
4. După revizuirea și integrarea Pull Request #2 în `main`, deschide **Actions → RobotGo ClouDNS Premium API - guarded operations → Run workflow**. Mai întâi selectează `plan`, care doar verifică situația.
5. Dacă planul spune că lipsește zona, selectează **create-zone** și introdu confirmarea `CONFIGURE-ROBOTGO`. Scriptul încearcă să creeze exclusiv zona Master `robotgo.ro`.
6. Verifică în Render (Custom Domains) țintele `216.24.57.1` și `robotgo-preview.onrender.com`. Apoi selectează **add-web-records** cu aceeași confirmare. Scriptul adaugă doar înregistrări lipsă A și CNAME; la conflicte se oprește și nu șterge nimic.
7. Înainte de schimbarea nameserverelor la RoTLD, verifică nameserverele autoritative ClouDNS și toate înregistrările (inclusiv MX/TXT/DKIM/CAA/alte servicii), plus DNSSEC/DS. Schimbarea RoTLD rămâne manuală.

Fluxul API nu pornește la push și nu schimbă nimic fără `workflow_dispatch` plus confirmarea pentru scriere. Verificarea sintaxei scriptului la push nu utilizează credențiale. Nu este garantată executarea API până când contul ClouDNS nu este autorizat și testul `plan` nu funcționează.

Documentație: https://www.cloudns.net/wiki/article/42/ (autentificare), https://www.cloudns.net/wiki/article/48/ (creare zonă), https://www.cloudns.net/wiki/article/58/ (creare înregistrare), https://www.cloudns.net/wiki/article/57/ (citire înregistrări).
