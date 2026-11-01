# Implementarea auditului SEO — 1 noiembrie 2026

## Modificări

- 70 de documente HTML: cele 62 existente, `/service/`, `/quote/`, `/privacy/`, `/media/` și patru pagini dedicate filmărilor existente.
- Secțiuni bilingve despre restaurant/hotel, curățenie profesională, intralogistică, coboți și laboratoare de robotică. Linkuri de ofertare păstrează domeniul sau modelul.
- Informații de ofertare, configurație, elemente incluse/excluse, instalare, suport și livrare pe toate cele 26 de modele. Condițiile neconfirmate sunt formulate ca elemente de clarificat în ofertă.
- `Product` semantic pentru 26 de produse, fără preț, stoc, recenzii sau rating inventat. Nu se declară eligibilitate Google pentru product snippets.
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
