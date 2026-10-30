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
- Sitemap-ul include pagina principală. Rutele interactive `#/...` nu sunt URL-uri indexabile separat; nu trebuie adăugate ca pagini distincte în sitemap.
- `render.yaml` și `config/hosting.json` nu impun un antet global `X-Robots-Tag: noindex`.
- Pagina 404 rămâne neindexabilă. Fișierele inexistente primesc 404; nu există rescriere generală către aplicație.
- Publicarea face site-ul eligibil pentru indexare; nu confirmă includerea în Google și nu garantează o poziție în rezultate. După verificarea proprietății în Google Search Console, se poate trimite sitemap-ul și solicita indexarea paginii principale.

## Funcționare actuală

Catalogul include 26 de produse, 29 de fotografii locale de produs, 3 fotografii și 4 clipuri de expoziție. Sursele și hash-urile imaginilor sunt în `docs/product-image-sources.json`. Build-ul validează fișierele și configurația pentru a preveni reintroducerea blocajului de indexare.

Datele operatorului ROUTEX LOGISTICA S.R.L. și contactele sunt în `public/site-config.js`. Cererile de ofertă folosesc emailul sau WhatsApp-ul clientului. Backend-ul, autentificarea, plățile online și AI-ul conectat nu sunt active. Prețurile, disponibilitatea și condițiile comerciale se confirmă prin ofertă.

## Documentație

- `docs/STADIU.md` — stadiu și limite.
- `docs/CONTACTE.md` — datele publice de contact.
- `docs/product-image-sources.json` — sursele fotografiilor.

Nu include parole, tokenuri sau alte informații private în fișierele publice ori în repository.
