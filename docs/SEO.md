# RobotGo — audit și implementare SEO

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
