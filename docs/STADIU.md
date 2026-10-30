# RobotGo — stadiu la 30 octombrie 2026

## Publicat

- Repository GitHub: marinpolina33-lang/RobotGo; ramura main.
- Render Static Site: robotgo-preview; build `node tools/build.mjs`, publicare `dist/`.
- https://robotgo.ro funcțional prin HTTPS; www redirecționează către domeniul principal.
- DNS administrat prin Cloudflare; domeniul rămâne la RoTLD.
- Migrarea ClouDNS abandonată la cererea proprietarului; PR #2 închis fără integrare.

## Contacte și solicitări de ofertă

Datele ROUTEX LOGISTICA S.R.L. sunt în `public/site-config.js`. Fluxul ales de proprietar: persoane fizice și juridice, ofertă în EUR, transport inclus în prețul ofertat, transfer bancar conform ofertei acceptate.

Clientul își selectează modelele și cantitățile, completează cererea, verifică mesajul și îl trimite din aplicația proprie de email sau WhatsApp. Serverul nu colectează formulare și nu trimite emailuri. Generarea mesajului nu înseamnă că acesta a fost trimis sau că o comandă/plată a fost confirmată. Copierea și descărcarea textului sunt disponibile ca alternativă.

## Rămâne de completat

- Adresa completă (stradă și număr), numărul Registrului Comerțului, statutul TVA.
- Coordonatele bancare și condițiile de plată, de furnizat cu oferta/factura; nu sunt publicate date bancare inventate.
- Acoperirea geografică, termenele, garanția/returul și documentația completă privind prelucrarea datelor.
- Prețurile și disponibilitatea modelelor se confirmă individual prin ofertă.

## Limite actuale

Indexarea este blocată prin `noindex` și `robots.txt`. Nu există procesare de carduri, autentificare clienți, stocuri în timp real, backend de cereri sau AI conectat. Ghidul local și selecțiile în browser funcționează. Fotografiile externe și drepturile comerciale rămân de verificat în vederea lansării complete.
