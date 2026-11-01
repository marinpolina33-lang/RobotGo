# Implementarea auditului SEO — 1 noiembrie 2026

## Modificări

- 70 de documente HTML: cele 62 existente, `/service/`, `/quote/`, `/privacy/`, `/media/` și patru pagini dedicate filmărilor existente.
- Secțiuni bilingve despre restaurant/hotel, curățenie profesională, intralogistică, coboți și laboratoare de robotică. Linkuri de ofertare păstrează domeniul sau modelul.
- Informații de ofertare, configurație, elemente incluse/excluse, instalare, suport și livrare pe toate cele 26 de modele. Condițiile neconfirmate sunt formulate ca elemente de clarificat în ofertă.
- Cele 26 de produse păstrează WebPage și BreadcrumbList. Marcajul Product este amânat până când există oferte sau recenzii reale care îndeplinesc cerințele Google; nu se inventează preț, stoc sau rating.
- Sitemap generat cu 70 de adrese canonice și imagini. Pagini noi accesibile prin legături HTML. Adresele vechi `/#/service`, `/#/media`, `/#/quote` sunt redirecționate de aplicație spre documentele publice.
- Datele editoriale livrate pe fiecare pagină includ numai articolul / întrebările modelului necesare și metadatele navigării. Scripturi `defer`; zece CSS sursă grupate într-un fișier versionat prin hash. Dimensiuni în `SEO_ASSET_BUDGET.json`; nu sunt scoruri Lighthouse.
- Formularele ascund butoanele flotante și bara de navigare de jos; câmpuri lizibile, acțiuni cu înălțime minimă, tabele derulabile, imagini cu dimensiuni, respectarea mișcării reduse.

## Cereri reale și măsurare

- `POST /api/auth/leads` persistă cereri de ofertă și service în D1. Confirmarea returnează un număr de referință după salvare. Nu trimite email/WhatsApp și nu înregistrează comenzi/plăți.
- API: verificarea originii, antet anti-CSRF, dimensiune maximă, validarea datelor, honeypot, limite IP/email și cheie de idempotență. Retrimiterea aceleiași cereri nu o dublează.
- Administratorul existent vede cererile din cont și marchează nouă / calificată / ofertă emisă / închisă. Serverul verifică rolul și schimbarea parolei inițiale. Datele nu sunt accesibile public sau utilizatorilor obișnuiți.
- Evenimente opționale: `product_view`, `form_start`, `whatsapp_click`, `email_click`, numai după acord și cu respectarea Global Privacy Control. Totaluri pe zi, pagină fără parametri și mobil/desktop; fără nume, email, telefon, textul cererii sau identificator de vizitator.
- Cererile primite sunt numărate separat de clicuri. Totalurile nu sunt vizitatori unici și nu măsoară primirea mesajelor externe.
- Retenție: cereri 365 zile de la ultima actualizare; evenimente 180 zile. Preferință locală retractabilă în `/privacy/`. Nu s-au adăugat scripturi de publicitate.
- Schema D1 este aditivă; conturile și sesiunile existente se păstrează. Workerul existent gestionează noile endpointuri pe aceleași rute `/api/auth/*`.

## Inventar de cuvinte

`config/seo-keyword-opportunities.json` păstrează cele 582 de expresii ale auditului, intenția, URL-ul și condițiile. `SEO_KEYWORD_PLANNER_IMPORT.csv` este pregătit pentru validare în Keyword Planner (România, minimum 12 luni; setările și intervalele exportate trebuie păstrate). Nu sunt create 582 de pagini și nu sunt inserate artificial toate variantele în text.

## Recomandări condiționate

Acestea nu pot fi înlocuite cu afirmații inventate sau marcate ca îndeplinite prin cod:

- Indexarea, canonicalul ales de Google și recitirea sitemapului depind de Google. Cererile de indexare și testele live se consemnează separat după publicare.
- Volume Keyword Planner: necesită un cont eligibil și export efectiv. Nu se presupune volum 0 când lipsesc date.
- Studii de caz la clienți, rezultate măsurate, autorizări de service, acorduri de distribuție, drepturi/date video neconfirmate și termene comerciale necesită documente de la firmă. Galeria este descrisă ca material de expoziție.
- Închiriere, leasing, SEAP și finanțări rămân oportunități condiționate. Nu se publică drept servicii disponibile.
- Profilul Google Business necesită eligibilitate și confirmarea modului de servire; sediul social nu este prezentat ca showroom.
- Mențiunile editoriale de la parteneri implică relații reale și comunicări aprobate. Nu s-au trimis mesaje și nu s-au cumpărat linkuri.
- `/en/` și hreflang rămân condiționate de alegerea unei piețe țintă în engleză; interfața bilingvă existentă se păstrează.
- Comparațiile de performanță SEO și Core Web Vitals de teren necesită istoric suficient. Nu se raportează creștere de poziție în ziua implementării.

## Verificări

- `node tools/build.mjs`: 35 verificări statice, metadate/linkuri/schema/rute pentru 70 pagini și verificarea payloadurilor optimizate RO/EN.
- `node --test tests/auth/auth.test.mjs`: 8 teste de integrare, incluzând conturi, revocări, acces administrativ, cereri persistente, idempotență, limite și separarea măsurării de datele personale.
- Previziune prin Sites: verificare vizuală și funcțională a paginilor publice; API-ul direct se validează separat în producție.

Fișierele cu date private Search Console din audit nu se publică în repository sau în site.

## Verificări după publicare — 1 noiembrie 2026

- Publicarea inițială a fost confirmată live pe Render la 17:16 UTC.
- Formularul public a salvat o cerere sintetică în D1; retrimiterea a păstrat aceeași referință, fără duplicat. Înregistrarea de test a fost eliminată ulterior prin identificator exact; nu au fost trimise mesaje externe.
- Google Search Console a confirmat accesul și eligibilitatea pentru indexare a `/robot/`; solicitarea de indexare a fost acceptată. Acest rezultat nu dovedește indexarea sau creșterea pozițiilor.
- Prima măsurare PageSpeed după publicare: mobil Performanță 96, Accesibilitate 95, Bune practici 96, SEO 100; LCP 2,2 s, TBT 20 ms, CLS 0. Desktop: Performanță 100, LCP 0,5 s, TBT 0, CLS 0. Fără date reale CrUX disponibile.
- Testul a identificat două fundaluri rezolvate relativ la noul fișier CSS, contrast insuficient la etichetele de categorii/numerele ghidului și niveluri de titlu în subsol. Corecție suplimentară: URL-uri absolute pentru fundaluri, culori contrastante și titluri H2 în subsol. Prima măsurare de mai sus precede această corecție.
- Contul Google selectat nu are un cont Google Ads; volumele Keyword Planner nu au fost validate. Fișierul CSV de import este pregătit, fără inventarea volumelor.

- Testul live Google pentru Unitree G1 a confirmat indexabilitatea, dar a marcat `Product` fără `Offer`/`Review` ca neeligibil pentru product snippets. Marcajul Product incomplet a fost retras; rămân WebPage și BreadcrumbList. Datele comerciale din conținut rămân vizibile. Reintroducerea Product este condiționată de date comerciale reale care îndeplinesc cerințele Google.

- Corecțiile suplimentare au fost publicate la 17:28 UTC. PageSpeed mobil ulterior: home 96/100/100/100 (performanță/accesibilitate/bune practici/SEO), LCP 2,3 s, TBT 10 ms, CLS 0; categorie coboți 100/100/100/100, LCP 1,8 s, CLS 0.
- Sitemap retrimis cu succes la 1 noiembrie. Search Console afișa încă ultima citire din 30 octombrie și 46 URL-uri descoperite; acestea sunt datele precedente, nu numărul de 70 URL-uri al sitemapului publicat.
- Unitree G1 a trecut retestarea live fără problema Product, cu BreadcrumbList valid; solicitarea de indexare a fost acceptată. Google afișa încă pagina ca descoperită, neindexată în raportul istoric.
- Testul formularului a identificat CLS 0,375 (subsolul era vizibil înainte de încărcarea formularului). S-a rezervat spațiu de la primul HTML pentru zona cererii; titlurile formularelor și galeriei folosesc niveluri consecutive. Se verifică printr-o nouă măsurare după publicare.
- Playerul de pe pagina video a redat materialul cu readyState 4, fără eroare și durată 13,568 s; testul nu validează drepturile sau identitatea modelului.
