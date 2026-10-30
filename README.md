# RobotGo — catalog public

Site: https://robotgo.ro/ · Repository: `marinpolina33-lang/RobotGo` · Ramură: `main`.

## Publicare și verificare

Serviciul Render Static Site existent este `robotgo-preview`, cu build `node tools/build.mjs` și director public `dist/`. Domeniul principal este `robotgo.ro`; `www` redirecționează către acesta. DNS-ul și nameserverele se gestionează separat de cod.

Proiectul nu necesită dependențe npm. Folosește Node.js 20 sau mai nou:

```sh
node tools/verify.mjs
node tools/build.mjs
node tools/preview.mjs
```

Ultima comandă pornește un server local la `http://127.0.0.1:4173` și nu publică pe internet. Render publică doar conținutul `dist/`.

## Indexare în motoarele de căutare

- Pagina principală permite indexarea și declară adresa canonică `https://robotgo.ro/`.
- `public/robots.txt` permite accesul și indică `https://robotgo.ro/sitemap.xml`.
- Build-ul generează 46 de pagini HTML cu conținut vizibil fără JavaScript: pagina principală, catalog, contact, 26 de produse, două pagini de navigare, 7 categorii, 7 domenii și pagina despre firmă. Fiecare are titlu, descriere și adresă canonică proprie; toate sunt incluse în sitemap-ul generat în `dist/`.
- Catalogul și paginile de produs folosesc linkuri normale. Adresele vechi `#/...` pentru pagini publice sunt redirecționate în browser către documentul HTML canonic; instrumentele interactive (ofertă, comparație, coș) păstrează rutele cu fragment.
- Datele structurate identifică site-ul, firma, paginile, colecțiile și traseele de navigare. Marcajul Product pentru rezultate îmbogățite este amânat până la existența unor oferte sau recenzii eligibile și verificabile. Nu se declară prețuri, stocuri sau recenzii neverificate.
- `render.yaml` și `config/hosting.json` nu impun un antet global `X-Robots-Tag: noindex`.
- Pagina 404 rămâne neindexabilă. Fișierele inexistente primesc 404; nu există rescriere generală către aplicație.
- Publicarea face site-ul eligibil pentru indexare; nu confirmă includerea în Google și nu garantează o poziție în rezultate. După verificarea proprietății în Google Search Console, se poate trimite sitemap-ul și solicita indexarea paginii principale.

### Notificarea motoarelor de căutare

Fișierul public de verificare IndexNow este indicat în `config/indexnow.json`. După publicarea unei versiuni, `node tools/submit-indexnow.mjs` previzualizează adresele din sitemap, iar `node tools/submit-indexnow.mjs --submit` le trimite o singură dată. Scriptul verifică întâi fișierul de pe domeniu și concordanța sitemap-ului public cu versiunea locală. Nu se trimit notificări la fiecare vizită și nu există retrimiteri repetitive automate.

IndexNow notifică Bing și celelalte motoare participante. HTTP 200 confirmă primirea; HTTP 202 indică primirea cu verificarea cheii în așteptare. Niciunul nu confirmă indexarea sau poziționarea. Google se gestionează separat în Search Console: verificarea proprietății, trimiterea `https://robotgo.ro/sitemap.xml` și inspecția URL pentru pagina principală, catalog și produse. API-ul Google Indexing este rezervat tipurilor eligibile de pagini și nu este folosit pentru catalogul de roboți.

Documentație: https://www.indexnow.org/documentation · https://www.indexnow.org/faq · https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl

## Funcționare actuală

Catalogul include 26 de produse, 29 de fotografii locale de produs, 3 fotografii și 4 clipuri de expoziție. Sursele și hash-urile imaginilor sunt în `docs/product-image-sources.json`. Build-ul validează fișierele și configurația pentru a preveni reintroducerea blocajului de indexare.

Datele operatorului ROUTEX LOGISTICA S.R.L. și contactele sunt în `public/site-config.js`. Cererile de ofertă folosesc emailul sau WhatsApp-ul clientului. Backend-ul, autentificarea, plățile online și AI-ul conectat nu sunt active. Prețurile, disponibilitatea și condițiile comerciale se confirmă prin ofertă.

## Documentație

- `docs/STADIU.md` — stadiu și limite.
- `docs/CONTACTE.md` — datele publice de contact.
- `docs/product-image-sources.json` — sursele fotografiilor.

Nu include parole, tokenuri sau alte informații private în fișierele publice ori în repository.

Auditul, harta intențiilor de căutare și pașii de măsurare sunt în [docs/SEO.md](docs/SEO.md).
