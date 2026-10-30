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
