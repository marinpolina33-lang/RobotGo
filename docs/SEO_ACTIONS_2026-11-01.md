# RobotGo — 34 de acțiuni implementate pentru descoperirea și înțelegerea paginilor

Data: 1 noiembrie 2026. Obiectiv: mai multe oportunități de afișare pentru căutări relevante despre roboții din catalog. Măsurile de conținut și navigare sunt în română și engleză în interfața existentă. Adresele canonice rămân în română; nu se declară versiuni `/en/` inexistente.

Acestea sunt modificări concrete ale site-ului, nu creșteri de poziție deja măsurate. Nu se presupun volume de căutare, vânzări, certificări, stocuri, prețuri sau studii de caz care nu au fost confirmate. Versiunea este publicată; dovezile verificării sunt consemnate mai jos.

## Lista acțiunilor

| Nr. | Acțiune implementată | Unde / dovadă în site | Rol |
|---:|---|---|---|
| 1 | Tabel de selecție pentru umanoizi: mers, manipulare, interacțiune | `/categories/umanoizi/` | Răspunde mai precis intenției „robot umanoid”. |
| 2 | Tabel pentru patrupezi: laborator, traseu, senzori | `/categories/patrupezi/` | Ajută selecția pentru câine robot și inspecție. |
| 3 | Tabel pentru hibrizi: roți, obstacole, încărcătură | `/categories/hibrizi/` | Explică limitele relevante pentru teren mixt. |
| 4 | Diferențiere între roboții de servire, curățenie și transport | `/categories/amr/` | Evită tratarea tuturor roboților mobili ca echivalenți. |
| 5 | Criterii pentru coboți: sculă, rază, toleranță, ciclu | `/categories/coboti/` | Conectează specificațiile la operația reală. |
| 6 | Criterii pentru UGV: mobilitate, calcul, integrare | `/categories/ugv-civile/` | Clarifică ce presupune o platformă de dezvoltare. |
| 7 | Criterii pentru mâini robotice și accesorii | `/categories/accesorii/` | Detaliază prinderea și compatibilitatea. |
| 8 | Scenariu de pilot pentru restaurante și hoteluri | `/solutions/horeca/` | Traseu aglomerat, încărcătură și lift. |
| 9 | Scenariu de pilot pentru curățenie profesională | `/solutions/curatenie/` | Suprafață accesibilă, rezultat și întreținere. |
| 10 | Scenariu de pilot pentru logistică | `/solutions/logistica/` | Transfer complet, blocaje și confirmări software. |
| 11 | Scenariu de pilot pentru producție | `/solutions/industrie/` | Piese reprezentative, ciclu și predare. |
| 12 | Scenariu de pilot pentru educație și cercetare | `/solutions/educatie/` | Sarcină de laborator, SDK și organizare. |
| 13 | Scenariu de pilot pentru inspecție civilă | `/solutions/inspectie/` | Date, traseu și senzori. |
| 14 | Scenariu de pilot pentru evenimente | `/solutions/evenimente/` | Demonstrație, public și continuitate. |
| 15 | Glosar unic cu 18 termeni, fără pagini aproape identice pentru fiecare sinonim | `/guides/glosar-robotica/` | Explică robot, umanoid, cobot, AMR, AGV, UGV, DOF, payload, reach, repetabilitate, SDK, ROS, SLAM, gripper, teleoperare, autonomie, TCO și pilot. |
| 16 | Legături către definițiile relevante pe toate cele 26 de produse | Secțiunea „Înțelege specificațiile” | Cititorul poate explica un termen fără a pierde modelul de interes. |
| 17 | Legături contextuale categorie/domeniu → glosar și ghiduri | Cele 14 pagini tematice | Ajută explorarea și descoperirea paginilor prin linkuri HTML. |
| 18 | Acces la glosar din home, catalog, ghiduri și subsol | Navigarea publică | Noua pagină nu este izolată. |
| 19 | Fișă pentru costul total: achiziție, integrare, exploatare | `/guides/cat-costa-un-robot/` | Acoperă evaluarea bugetului fără prețuri sau amortizări inventate. |
| 20 | Parcurs de la cerințe la acceptarea unui pilot | `/guides/primul-robot/` | Explică pașii unui proiect. |
| 21 | Metodă editorială și canal pentru corectarea specificațiilor | `/about/` | Separă sursele producătorilor de recomandări și de teste reale. |
| 22 | Cuprins cu legături către secțiuni în ghidurile lungi | Ghidurile existente | Reduce efortul de găsire a răspunsului. |
| 23 | Corectarea navigării la ancore după randarea JavaScript | Cuprins, glosar, „Sari la conținut” | Evită rerandarea și pierderea poziției când se selectează o secțiune. |
| 24 | Titluri H1 care includ modelul și tipul robotului | 26 de fișe, în HTML și în interfață | Clarifică subiectul fiecărei pagini. |
| 25 | Înlocuirea vechilor legături `/#/quote` cu `/quote/` | Întrebările produselor și ghidul de entertainment | Păstrează modelul/aplicația într-o adresă publică normală. |
| 26 | Date `lastmod` pentru 59 de pagini modificate substanțial | Sitemap XML | Date explicite, fără actualizare artificială la fiecare build. |
| 27 | Alinierea `dateModified` cu data editorială | WebPage și Article unde se aplică | Coerență între datele structurate și actualizările reale. |
| 28 | Marcaj DefinedTermSet pentru definițiile vizibile | Glosar | Descrie exact cele 18 definiții; nu promite un rezultat îmbogățit Google. |
| 29 | Formularul de ofertă marcat `noindex,follow` și exclus din sitemap | `/quote/` | Păstrează accesul la formular și prioritizează paginile informative în sitemap. |
| 30 | Decodare asincronă a imaginilor statice și text descriptiv pentru imaginea socială | Carduri și produse | Ajută redarea și descrierea vizualurilor; nu reprezintă un scor de performanță măsurat. |
| 31 | Modulul nou și datele editoriale grupate într-un fișier cu hash | `/assets/discovery.[hash].js` | O singură solicitare și versiuni coerente în cache. CSS-ul rămâne grupat într-un singur fișier. |
| 32 | Legături de recuperare pe pagina 404 | Home, catalog, categorii, ghiduri, contact | Vizitatorul ajuns la o adresă greșită poate continua util. Statusul 404 rămâne real. |
| 33 | Extinderea hărții de intenții cu termeni explicativi noi | `config/seo-keywords.json`, `config/seo-keyword-opportunities.json`, `docs/SEO_QUERY_MAP.csv` | Un URL principal pentru fiecare intenție; volumele rămân nemăsurate. |
| 34 | Verificări automate pentru conținut, ancore, date, sitemap și resurse | `tools/verify-discovery.mjs`, rulat în build | Blochează publicarea dacă aceste proprietăți se strică. |

## Rezultatul tehnic urmărit

- 72 de documente HTML publice; 71 de URL-uri indexabile în sitemap. Formularul de ofertă este accesibil, dar exclus intenționat din indexare.
- Cele 7 tabele și 7 liste de pilot apar în HTML inițial și după activarea JavaScript, în aceeași formă relevantă.
- Glosarul are o adresă proprie, linkuri interne și 18 ancore verificabile.
- Datele actualizării sunt menținute explicit în `public/content-updates.js`. Un nou build fără schimbare editorială nu mută data înainte.
- Designul principal, produsele, conturile și backendul cererilor se păstrează. Nu au fost create oferte, recenzii sau disponibilități fictive.

## Acțiuni care necesită dovezi sau date externe

Acestea nu sunt raportate ca executate prin modificarea codului:

1. **Indexarea și recitirea sitemapului:** Google decide momentul și paginile incluse. Solicitările deja făcute nu se repetă în buclă. Verificarea programată pentru 8 noiembrie rămâne relevantă.
2. **Volumele cuvintelor cheie:** necesită un export real Keyword Planner sau un serviciu de date autorizat. Ipotezele editoriale nu sunt statistici de căutare.
3. **Studii de caz și rezultate ale piloților:** necesită implementări documentate, acorduri pentru publicare și valori măsurate. Listele noi sunt propuneri de evaluare, nu rezultate obținute.
4. **Mențiuni de la producători și parteneri:** necesită relații reale și autorizarea comunicărilor. Nu se cumpără linkuri și nu se declară parteneriate neconfirmate.
5. **Google Business Profile:** necesită eligibilitate și un mod real de servire a clienților. Sediul social nu este prezentat drept showroom.

## Măsurare după publicare

În Search Console: proprietatea `sc-domain:robotgo.ro`, căutare Web, România, aceleași filtre și perioade complete. Urmăriți separat afișări, clicuri, CTR și poziție medie, pe interogare și pagină. Interogările anonimizate pot lipsi din tabel. Fără afișări raportate pentru o interogare, poziția se marchează „indisponibilă”, nu zero sau un loc presupus.

Prioritate: „robot”, „roboți”, „robot umanoid”, „roboți umanoizi”, „câine robot”, „robot de servire”, „robot de curățenie profesională”, „cobot”, denumirile modelelor și intențiile explicative din harta de cuvinte. Acestea sunt ținte de monitorizare, nu interogări deja observate.

Comparația de evoluție rămâne programată pentru 4 ianuarie 2027, pe două perioade complete de 28 de zile, cu separarea dispozitivelor. Nu se atribuie o creștere de poziție acestei versiuni în ziua publicării.

## Confirmarea publicării și verificările efectuate

Versiunea `e432f9d6e00e62d5d5305f41600be6d0bd5fa049` a devenit **live la 1 noiembrie 2026, 23:11:23, ora României**, prin publicarea Render `dep-dbjqlrg473hc73al1j4g`.

- Build: 35/35 verificări statice, validarea celor 72 de documente, plus verificările noi de conținut, ancore, sitemap, date editoriale și resurse comune.
- Toate cele 8 teste de integrare existente pentru autentificare, permisiuni, revocări, cereri și măsurare au trecut. Backendul nu a fost modificat.
- Browser live: glosarul și cele 18 definiții, comutarea RO/EN, canonicalul, accesul din ghiduri, tabelul categoriei coboți, scenariul HoReCa, titlul Unitree G1 și legăturile spre definiții.
- Cuprinsul ghidului de cost a deschis secțiunea corectă prin `#section-8`.
- Formularul deschis din HoReCa a păstrat domeniul `horeca`, a afișat trimiterea directă către RobotGo și a păstrat canonicalul `/quote/` cu `noindex,follow`. Nu a fost transmisă o cerere de test în producție în această etapă.
- Sitemap public verificat: **71 URL-uri, 59 date lastmod**, glosarul inclus, formularul exclus.
- Search Console a indicat inițial că noul glosar era necunoscut pentru Google. O singură cerere de indexare a fost trimisă și acceptată cu mesajul **„Indexing requested”**, după verificarea automată a URL-ului live. Acesta este un statut de solicitare, nu confirmarea indexării sau a unei poziții.
- Verificarea vizuală s-a făcut în browserul disponibil. Nu se raportează scoruri PageSpeed noi sau teste pe un telefon fizic pentru această versiune.

Pagini verificate: [glosar](https://robotgo.ro/guides/glosar-robotica/), [coboți](https://robotgo.ro/categories/coboti/), [HoReCa](https://robotgo.ro/solutions/horeca/), [ghid de cost](https://robotgo.ro/guides/cat-costa-un-robot/), [Unitree G1](https://robotgo.ro/product/unitree-g1/).

## Referințe

- [Google: conținut util pentru oameni](https://developers.google.com/search/docs/fundamentals/creating-helpful-content)
- [Google: legături accesibile crawlerelor](https://developers.google.com/search/docs/crawling-indexing/links-crawlable)
- [Google: sitemap și date lastmod](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google: folosirea noindex](https://developers.google.com/search/docs/crawling-indexing/block-indexing)
- [Google: structura adreselor pentru comerț](https://developers.google.com/search/docs/specialty/ecommerce/designing-a-url-structure-for-ecommerce-sites)
