# RobotGo — audit și implementare SEO

## Plan de execuție pentru întregul catalog — 1 noiembrie 2026

Extinderea 3 adaugă fișe de lucru pentru 26 de modele și patru comparații candidate. Planul are 20 de acțiuni, dependențe și o procedură de măsurare. Cele 353 de expresii, 60 de pagini și 18 întrebări publicate rămân baza existentă. Fișele noi sunt planuri, nu completări publicate. Nu s-a executat un deploy, nu s-a trimis sitemap și nu sunt declarate măsurători Google noi. Vezi [planul principal](PLAN_SEO_ROBOTGO.md), [fișele editoriale](SEO_CONTENT_BRIEFS.md) și [planul de măsurare](SEO_MEASUREMENT_PLAN.md).

## Planul de extindere și măsurare — 1 noiembrie 2026

[Planul SEO](PLAN_SEO_ROBOTGO.md) acoperă acum 60 pagini țintă și 353 expresii editoriale (86 noi), cu o singură pagină principală desemnată pentru fiecare expresie. Include 13 acțiuni și briefuri cu 40 de întrebări pentru cele 20 de produse fără FAQ propriu. Acțiunile și întrebările noi sunt marcate **planificate**, nu implementate. Cele 60 de pagini și 18 întrebări deja publicate constituie baza de comparație. Nu s-au folosit date Search Console sau volume de căutare; planul consemnează explicit aceste limite și criteriile de evaluare.

Această revizie modifică documentația și configurația editorială, fără un nou build public sau o retrimitere de sitemap. Mapa detaliată este în `SEO_QUERY_MAP.csv`, iar lista structurată de acțiuni în `config/seo-roadmap.json`.

## Extindere pe modele și comparații comerciale — 1 noiembrie 2026

Două ghiduri distincte compară BellaBot cu DINERBOT T10 și PUDU CC1 cu KLEENBOT C40. Tabelele au câte o coloană pentru fiecare model, folosesc parametri confirmați în paginile producătorilor și disting recomandările de alegere de teste efectuate. Nu se inventează prețuri, reduceri, rezultate de productivitate ori amortizare. Versiunile Pro și alte generații nu sunt amestecate.

Șase fișe de produs (cele patru modele comparate, Unitree G1 și Go2) primesc 18 întrebări și răspunsuri specifice, în RO/EN, prezente și în HTML-ul inițial. Subiectele includ configurația, accesul SDK, tăvile, culoarele, mochetă, stații, consumabile și pregătirea ofertei. Linkurile către comparațiile directe au prioritate în fișele celor patru produse și în paginile HoReCa / curățenie. Directorul conține 12 ghiduri, sitemap-ul 60 de pagini, iar harta editorială 51 de grupuri / 267 de expresii. Nu sunt volume sau poziții măsurate.

Validare: conținut comun înainte/după JavaScript, întrebări distincte în ambele limbi, relații produs–comparație, tabele cu antet accesibil, canonical, sitemap și schema Article. FAQ-urile sunt conținut vizibil; nu se promite un rezultat îmbogățit Google și nu se adaugă marcaje FAQPage comerciale. Publicarea live se verifică separat.

Surse de documentare: https://www.pudurobotics.com/en/products/bellabot ; https://www.keenon.com/en/product/T10 ; https://www.pudurobotics.com/en/products/puducc1 ; https://www.keenon.com/en/product/C40 ; https://www.unitree.com/g1/ ; https://www.unitree.com/go2/ ; https://developers.google.com/search/docs/fundamentals/creating-helpful-content

## Extindere pe tipuri, aplicații și întrebări tehnice — 1 noiembrie 2026

Au fost îmbogățite cele 7 pagini de categorie și 7 pagini de domeniu cu explicații distincte, termeni uzuali, criterii și răspunsuri specifice. Categoriile răspund despre tipul echipamentului; domeniile răspund despre fluxul de lucru. Exemplele includ robot ospătar, livrare în hotel, spălat pardoseli, intralogistică, manipulare, STEM, inspecție și promovare.

Directorul `/guides/` reunește 10 ghiduri. Șase pagini noi tratează AMR vs AGV, cobot vs robot industrial, umanoid vs câine robot, programare SDK/API/ROS 2, autonomie și AI, respectiv mentenanță. Fiecare are conținut RO/EN comun înainte/după JavaScript, exemple de modele existente, surse tehnice și Article. Directorul are CollectionPage și ItemList. Toate cele 26 de fișe de produs oferă legături către explicații relevante. Meniul, subsolul, Home și catalogul descoperă directorul prin URL normal.

Sitemap-ul include **58 de pagini canonice**. Titlurile și descrierile celor 14 pagini au fost clarificate, fără a schimba URL-urile ori identitatea Home. Nu se generează pagini duplicate pentru ortografii, orașe sau fiecare combinație de cuvinte. Harta editorială și expresiile de monitorizare sunt în `docs/SEO_KEYWORDS.md` și `config/seo-keywords.json`; nu sunt blocuri de keywords inserate în pagină.

Validarea include schema și legăturile fiecărui ghid, apartenența modelelor la catalog, conținutul inițial și randat, navigarea de la produse, directorul complet, sitemap, canonical și toate verificările existente. Publicarea live și comportamentul în browser se confirmă separat; nu reprezintă dovada unei poziții Google sau a apariției la toate căutările.

## Căutarea „robot” și intenția de cumpărare — 1 noiembrie 2026

Extinderea adaugă două pagini editoriale distincte și întărește pagina comercială existentă:

| Căutare / intenție | Pagină | Conținut |
|---|---|---|
| robot, ce este un robot, tipuri de roboți | `/robot/` | Explicație, comparație între șase tipuri, utilizări, modele existente și întrebări despre autonomie și alegere |
| cât costă un robot, preț robot | `/guides/cat-costa-un-robot/` | Echipament, integrare, software, exploatare, trei exemple și pregătirea ofertei; fără prețuri inventate |
| roboți de vânzare, robot de cumpărat în România | `/shop/` | Titlu, descriere și H1 comercial, cu preț și disponibilitate confirmate prin ofertă |

Ghidurile au HTML inițial complet, aceeași sursă de conținut în aplicație, titluri și descrieri proprii, canonical, BreadcrumbList și Article cu autor RobotGo și data publicării. Sunt disponibile în RO/EN prin selectorul existent, fără a inventa URL-uri lingvistice separate. Sunt legate din Home, catalog, paginile de categorii/aplicații, ghidul pentru primul robot, meniu și subsol. Sitemap-ul generat are acum **51 de pagini canonice**. Sloganul și imaginea principală Home, identitatea de brand și autentificarea reală sunt păstrate.

Validare: build-ul verifică toate paginile și cele două ghiduri înainte/după JavaScript, canonical, linkuri, modelul Article, data și accesibilitatea din Home/catalog. Confirmarea publicării se face separat pe domeniul live. Nu se declară volume de căutare măsurate, poziții Google sau un termen garantat de indexare. IndexNow notifică doar motoarele participante și nu confirmă indexarea în Google.

Referințe consultate: https://ifr.org/service-robots ; https://developers.google.com/search/docs/fundamentals/seo-starter-guide ; https://developers.google.com/search/docs/fundamentals/creating-helpful-content ; https://developers.google.com/search/docs/essentials/spam-policies

## Descoperirea conținutului și consolidarea Home — 1 noiembrie 2026

Auditul suplimentar a găsit paginile Branduri și Ghid pentru prima vizită accesibile numai prin fragmente, deci fără documente HTML distincte pentru Google. Sunt acum publicate la `/brands/` și `/guides/primul-robot/`, în același sistem de conținut RO/EN folosit înainte și după JavaScript. Catalogul de branduri are legături directe către toate cele 26 de modele și filtre corecte pentru cele 13 branduri; ghidul explică sarcina, spațiul, echiparea, software-ul și pregătirea ofertei. Linkurile din meniu, subsol și Home folosesc adresele normale. Adresa veche `/#/learn` deschide ghidul nou. Sitemap-ul conține 49 de pagini, fără o nouă trimitere în Search Console.

HTTP și www ajungeau deja la HTTPS pe domeniul canonic. `/index.html` răspundea însă separat cu 200. Regula Cloudflare descrisă în `config/seo-redirects.json` consolidează numai acest alias Home prin 301 către `/`, pentru GET și HEAD, păstrând query string-ul. Nu schimbă DNS, categoriile, API-ul sau politicile de securitate. Documentele nested `index.html` și variantele fără slash declară în continuare propriile URL-uri canonice; nu sunt redirecționate artificial către Home.

Imaginea principală din fișa unui produs păstrează `fetchpriority="high"` și după randarea aplicației. Miniaturile și imaginile din liste nu primesc această prioritate. Aceasta este o îmbunătățire a priorității de încărcare, nu un rezultat Core Web Vitals măsurat sau o promisiune de poziționare.

Validarea suplimentară acoperă linkurile către toate produsele în directorul brandurilor, parametrii filtrelor, conținutul ghidului în RO/EN și compatibilitatea adresei vechi. Regula 301 și paginile noi se verifică pe domeniul public după publicare. Un rezultat organic Google către pagina principală rămâne un criteriu separat, încă neconfirmat.

Referință: https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics

## Revizie de identitate a paginii principale — 1 noiembrie 2026

Canonical-ul, indexarea permisă, conținutul HTML inițial și datele structurate erau deja prezente. Lipsa unui rezultat de brand observat anterior nu demonstrează o eroare de indexare. Această revizie întărește identificarea paginii principale fără a schimba URL-uri, categorii, DNS sau protecțiile conturilor:

- Titlul Home începe cu „RobotGo România” și descrie tipurile principale de roboți. Titlul și descrierea sunt comune între HTML, previzualizările sociale și aplicație.
- Textul vizibil identifică explicit robotgo.ro drept catalogul operat de ROUTEX LOGISTICA S.R.L., cu legătură spre pagina Despre. Sloganul și imaginea aprobate rămân în prima secțiune.
- WebSite declară și numele alternativ robotgo.ro. WebPage se leagă explicit de Organization; organizația descrie activitatea și țara deservită fără profiluri sociale sau acreditări inventate.
- Subsolul fiecăreia dintre cele 47 de pagini publice are o legătură de brand către pagina principală și o legătură spre operatorul site-ului.
- Build-ul verifică identitatea Home, schema și legăturile de întoarcere, pe lângă verificările existente pentru toate paginile.

Cloudflare: zona activă are Browser Integrity Check pornit, nivel medium, SSL full și nu avea ruleset personalizat de blocare la citirea configurației. Clientul Python implicit a primit 403 cu cod 1010; aplicația de audit identificată explicit ca RobotGoSEOAudit/1.0 a primit 200 pentru Home. Acest rezultat nu este un test al Googlebot autentic și nu dovedește blocarea lui. Nu s-a dezactivat protecția și nu s-a folosit un User-Agent Googlebot fals.

Nu s-a retrimis cererea de indexare sau sitemap-ul. Revizuirea automată a instrumentului de browser pentru căutările Google este distinctă de SEO-ul site-ului și nu poate fi reparată prin metadate. Monitorizarea rămâne în pauză după blocajul comunicat. Nu se declară succes organic până la observarea unui rezultat Google direct către https://robotgo.ro/.

Referințe: https://developers.google.com/search/docs/appearance/site-names ; https://developers.google.com/search/docs/appearance/structured-data/organization ; https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-1xxx-errors/error-1010/

Data auditului: 30 octombrie 2026. Domeniu canonic: https://robotgo.ro/.

## Diagnosticul verificat

Site-ul este accesibil public prin HTTPS. HTTP și `www` ajung la domeniul canonic. Pagina principală, catalogul și produsele răspund cu HTTP 200; o adresă inexistentă răspunde cu 404. `robots.txt` permite accesul și indică sitemap-ul. În răspunsurile verificate nu există `X-Robots-Tag: noindex`.

Blocajul `noindex` din pagina principală a fost eliminat într-o intervenție anterioară, în aceeași zi. Primul catalog a avut adrese cu fragment și conținut dependent de JavaScript. Acestea sunt probleme istorice reale, dar fără raportul Google Search Console nu putem afirma care este motivul actual atribuit de Google fiecărui URL. Nu există în această verificare dovada unei penalizări sau a unei probleme DNS active.

Căutarea web nu a returnat rezultate verificabile prin serviciul disponibil în sesiune. Nu raportăm „zero pagini indexate”, trafic, poziții sau volume de căutare fără o sursă măsurabilă. Captura utilizatorului arată ambiguitatea numelui RobotGo cu un proiect software; aceasta justifică identitatea clară de catalog de roboți în România, dar nu dovedește singură cauza neindexării.

Google poate reciti și procesa modificările în câteva zile sau săptămâni. Acesta este un interval orientativ din documentație, nu un termen garantat. Verificarea în Search Console oferă control și diagnostic; nu este o condiție obligatorie pentru descoperirea organică a unui site.

## Modificările implementate

| Problemă | Remediere |
|---|---|
| Titlurile pregătite în HTML erau înlocuite de titluri generice după încărcarea aplicației | Aceeași sursă de metadate pentru build și aplicație; titluri și descrieri distincte pe fiecare pagină |
| Categorii și domenii accesibile numai prin filtre sau fragmente | 7 pagini de categorie, 7 pagini de aplicație și două pagini de navigare, cu adrese HTML proprii |
| Conținut insuficient pentru alegerea unei categorii | Texte specifice despre alegere și cerințele ofertei, alături de modelele relevante |
| Semnale de identitate și încredere dispersate | Pagină „Despre RobotGo” cu firma, modelul comercial, etapele ofertei și condițiile deja confirmate |
| Linkuri vechi `#/product/...` și `#/solutions/...` | Redirecționare în browser spre adresa normală și documentul cu canonical corect; fragmentele nu pot primi redirect HTTP deoarece nu sunt trimise serverului |
| Navigare contextuală redusă | Legături categorii–modele–aplicații, trasee de navigare și verificarea accesibilității fiecărei pagini pornind din pagina principală |
| Configurație Apache moștenită cu `noindex` | Eliminarea regulii și verificare automată; această regulă nu era activă pe Render |
| Marcaj Product incomplet pentru rezultatele îmbogățite Google | Folosirea WebPage, CollectionPage, BreadcrumbList, Organization și WebSite; fără preț zero, stoc sau recenzii inventate |
| Previzualizări sociale fără imagini dedicate | Open Graph/Twitter cu imagine de produs sau imagine de brand și descriere corespunzătoare |
| Descoperirea imaginilor și încărcarea imaginii principale | Imagini în sitemap și preîncărcarea imaginii principale pe Home și paginile de produs |

Total: 46 de pagini canonice. URL-urile filtrelor rămân funcționale și declară pagina catalogului drept canonical. Nu sunt incluse în sitemap coșul, ofertele personale, căutările interne sau combinații de filtre. Selectorul EN rămâne disponibil, dar nu declarăm `hreflang` pentru versiuni lingvistice care nu au URL-uri separate.

## Harta intențiilor de căutare

Expresiile de mai jos descriu subiectele paginilor; nu reprezintă volume de căutare măsurate sau promisiuni de poziționare.

| Intenție | Pagină principală |
|---|---|
| RobotGo România, catalog de roboți | `/`, `/shop/` |
| roboți umanoizi | `/categories/umanoizi/` |
| câini roboți, roboți patrupezi | `/categories/patrupezi/` |
| roboți hibrizi cu roți și picioare | `/categories/hibrizi/` |
| roboți mobili | `/categories/amr/` |
| coboți, brațe robotice | `/categories/coboti/` |
| platforme mobile UGV pentru cercetare | `/categories/ugv-civile/` |
| mâini robotice și componente | `/categories/accesorii/` |
| roboți pentru restaurante și hoteluri | `/solutions/horeca/` |
| roboți de curățenie profesională | `/solutions/curatenie/` |
| roboți pentru depozite și logistică | `/solutions/logistica/` |
| roboți pentru producție și asamblare | `/solutions/industrie/` |
| roboți pentru educație și cercetare | `/solutions/educatie/` |
| roboți pentru inspecție civilă | `/solutions/inspectie/` |
| roboți pentru evenimente și demonstrații | `/solutions/evenimente/` |
| model + specificații / ofertă | `/product/<id>/` |
| RobotGo contact, firma care operează site-ul | `/contact/`, `/about/` |

## Google Search Console: stare verificată la 31 octombrie 2026

Proprietatea `sc-domain:robotgo.ro` a fost verificată de proprietar. Pagina principală este raportată ca indexată, cu acces Googlebot reușit și canonical ales de Google egal cu URL-ul inspectat. Sitemap-ul a fost procesat cu succes: 46 de pagini descoperite, fără a implica indexarea tuturor. S-a cerut o singură dată reindexarea paginii principale; repetarea nu accelerează accesarea.

Un rezultat organic Google pentru `/categories/coboti/` a fost verificat la căutarea `site:robotgo.ro` pe 31 octombrie. Acest rezultat nu dovedește apariția paginii principale la căutările de brand. Monitorizarea paginii principale urmărește separat un link organic către `https://robotgo.ro/`.

## Conținut orientat spre căutări și alegerea produsului — 31 octombrie 2026

- Home: titlu și descriere despre roboți în România; ghid comparativ pentru roboți umanoizi, patrupezi, coboți și roboți mobili, cu linkuri directe spre paginile relevante.
- Navigare contextuală spre toate cele 7 domenii și întrebări despre prețul unui robot, alegere, acces software, cerere de ofertă și livrare.
- Produse: titlul include modelul și tipul la singular, de exemplu „Unitree G1 — robot umanoid | RobotGo”.
- Industrie: titlu și descriere pentru roboți industriali și coboți, conform scopului paginii.
- Textele Home sunt comune între HTML-ul inițial și aplicația JavaScript, în RO/EN. Sloganul și aspectul primei secțiuni sunt păstrate.

Nu se adaugă meta keywords sau liste artificiale de variante fără diacritice. Cuvintele sunt folosite în explicații utile, titluri și linkuri descriptive. Nu se declară volume de căutare măsurate sau creșteri de poziție neverificate. Întrebările sunt conținut vizibil și accesibil; nu promit rezultate îmbogățite FAQ.

## Claritatea produselor și descoperirea catalogului — 31 octombrie 2026

Verificarea codului a identificat trei îmbunătățiri concrete. Categoria generică AMR producea titlul „robot mobil” atât pentru un robot de servire, cât și pentru unul de curățenie. Catalogul afișa 9 carduri după încărcarea JavaScript, iar restul necesitau butonul „Mai arată”; documentul inițial avea toate cele 26 de modele, dar legăturile nu erau păstrate în aceeași formă după randare. Site-ul declara numai o favicon SVG, format care nu apare în lista actuală de formate pentru favicon din documentația Google Search. Aceste observații nu stabilesc motivul pentru care Google nu afișează pagina principală la o anumită interogare.

- Titluri și descrieri editoriale pentru toate cele 26 de produse, cu modelul, tipul sau sarcina reală și invitația de a solicita ofertă. Exemple: robot de servire, robot de curățenie, câine robot, cobot, mână robotică, robot pentru hoteluri și robot pentru transport.
- Index vizibil cu toate cele 26 de modele, grupate în cele 7 categorii. Aceleași linkuri HTML sunt prezente în documentul inițial și în aplicație, în RO/EN. Filtrarea și încărcarea progresivă a cardurilor rămân funcționale.
- Categoriile din prima secțiune Home și tipul din fișa produsului trimit la paginile canonice de categorie. Filtrele rămân în catalog, unde sunt necesare pentru selecție.
- Navigarea inițială include paginile de categorii și domenii. HTML-ul inițial al produselor include și modele din aceeași categorie, așa cum face deja aplicația.
- Favicon PNG de 96 × 96 px și logo PNG de 256 × 256 px, derivate din identitatea SVG existentă. Organization declară logo-ul și identificatorul fiscal deja publicat; nu se adaugă profiluri sociale, recenzii, prețuri sau stocuri neverificate.

Validarea verifică toate paginile generate, metadatele distincte, linkurile din ambele versiuni ale indexului, favicon PNG și logo-ul din datele structurate. URL-urile canonice și sitemap-ul cu 46 de pagini sunt păstrate; această intervenție nu retrimite cererea de indexare sau sitemap-ul. Efectul asupra impresiilor, clicurilor și pozițiilor se măsoară ulterior în Search Console și nu se deduce din trecerea testelor tehnice.

Referințe suplimentare:

- https://developers.google.com/search/docs/specialty/ecommerce/pagination-and-incremental-page-loading
- https://developers.google.com/search/docs/appearance/favicon-in-search
- https://developers.google.com/search/docs/appearance/structured-data/organization

## Celelalte motoare și măsurarea rezultatelor

IndexNow este configurat. Trimiterea anterioară a 29 de URL-uri a primit HTTP 202: primire cu validarea cheii în așteptare, nu confirmare de indexare. După publicarea acestei versiuni se poate trimite o singură notificare pentru sitemap-ul actualizat cu `node tools/submit-indexnow.mjs --submit`. IndexNow nu înlocuiește procedura Google Search Console.

Măsurarea utilă începe cu paginile indexate, impresiile pentru numele firmei și subiectele paginilor, clicurile și cererile reale de ofertă. Nu se afirmă un scor SEO perfect, poziția 1, un termen fix de indexare sau un rezultat Core Web Vitals care nu a fost măsurat.

După primele date Search Console: se prioritizează paginile cu impresii relevante, se clarifică descrierile și întrebările reale ale clienților, apoi se adaugă studii de caz numai pentru proiecte realizate și documentate. Profilurile oficiale existente ale firmei și partenerii reali pot indica site-ul; nu se cumpără linkuri și nu se creează recenzii sau parteneriate fictive.

## Validare și întreținere

Build-ul verifică 35 de condiții de sursă/configurație și toate cele 46 de pagini: un singur H1, metadate distincte și consecvente, canonical, JSON-LD, imagini și linkuri existente, sitemap, adrese vechi și accesibilitatea prin linkuri interne. Validarea browserului urmărește rezultatul după JavaScript, navigarea, schimbarea limbii și filtrele. Aceste verificări nu înlocuiesc datele din indexul Google sau măsurători reale de trafic și performanță.

Surse oficiale consultate la data auditului:

- https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics
- https://developers.google.com/search/docs/appearance/title-link
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/appearance/structured-data/product-snippet
- https://www.indexnow.org/documentation
