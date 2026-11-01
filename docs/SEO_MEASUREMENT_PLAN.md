# Plan de măsurare și decizie SEO — RobotGo

**1 noiembrie 2026 · Stadiu: procedură propusă, fără export de performanță în această revizie**

## Ce înregistrăm

| Nivel | Indicator | Sursă | Interpretare |
|---|---|---|---|
| Descoperire | URL și starea raportată de indexare | Search Console, inspecție URL | Se notează starea observată și data verificării |
| Vizibilitate | Impresii și interogări relevante | Search Console | Se separă RobotGo, modele și aplicații generale |
| Accesări | Clicuri și CTR | Search Console | Se evaluează cu poziția, dispozitivul și tipul căutării |
| Experiență | LCP, INP, CLS; probleme observate în interfață | Date de teren dacă există, plus teste de laborator | Condițiile și sursa sunt obligatorii |
| Intenție | Deschidere formular sau click WhatsApp | Evenimente, după implementare | Nu reprezintă cerere primită |
| Cerere | Solicitare recepționată | Sistem comercial sau evidență manuală | Se verifică existența unei cereri reale |
| Calitate | Model, aplicație și cerințe suficiente pentru răspuns | Evaluare comercială | Se poate prepara o ofertă sau o clarificare concretă |

Valorile inițiale sunt **necunoscute**. Nu se completează cu zero. Planul nu instalează un instrument de analiză și nu colectează date noi.

## Perioade și segmentare

Se păstrează filtrele folosite și perioada exactă. România și mobilul sunt primele segmente de analizat. Pentru comparații se folosesc, de regulă, două intervale consecutive de 28 de zile complete, cu zilele săptămânii comparabile. Dacă datele sunt puține, se mărește perioada; rezultatele unei singure zile nu decid schimbarea strategiei.

Interogările omise din rapoarte și diferențele de agregare pot face ca totalurile filtrate să difere de totalul proprietății. Se interpretează fiecare raport în propriul context.

## Reguli de decizie

| Observație | Verificare | Acțiune posibilă | Semnal de reevaluare |
|---|---|---|---|
| Pagina nu apare în raport | Starea URL, perioada, canonical și descoperirea | Corectarea unei probleme confirmate sau continuarea observației | Stare nouă raportată și apariția datelor |
| Impresii relevante, puține clicuri | Titlu, fragment afișat, poziție și intenție | Clarificarea promisiunii paginii | Evoluție în condiții comparabile |
| Două pagini apar pentru aceeași căutare | Diferența de intenție și URL-ul creditat | Clarificarea rolurilor și a linkurilor; consolidare doar dacă sunt duplicate reale | Interogările ajung la pagina potrivită |
| Accesări fără solicitări | Conținut, selecția modelului și funcționarea contactului | Eliminarea neclarităților și repararea obstacolelor observate | Cereri reale mai ușor de calificat |
| Cereri nepotrivite | Căutări, mesajul paginii și oferta comercială | Delimitarea aplicațiilor și a configurațiilor | Mai puține confuzii în solicitări |
| Fișa producătorului se schimbă | Versiune, unități, accesorii și sursă | Actualizarea fișei și a comparațiilor afectate | Coerență între pagini și ofertă |

## Experiență pe mobil

Reperele Google pentru categoria „bun” sunt LCP cel mult 2,5 secunde, INP cel mult 200 ms și CLS cel mult 0,1, evaluate la percentila 75 și separat pe dispozitive. Acestea sunt ținte de experiență, nu rezultate măsurate pentru RobotGo și nu garanții de clasare.

Un test de laborator notează URL-ul, dispozitivul/emularea, conexiunea, data și versiunea aplicației. Se compară aceleași condiții. INP de teren și un test punctual de interacțiune se raportează separat. Se verifică în special meniul, filtrele, galeria, tabelele comparative și butonul de ofertă.

## Experimente și revizii

Se schimbă un grup coerent de elemente, cu motiv consemnat. Jurnalul conține: URL, ipoteză, dovadă inițială, schimbare, publicare, perioadă analizată și concluzie. O corelație temporală nu dovedește singură cauzalitatea. O eroare funcțională se remediază imediat; un rezultat SEO se evaluează pe date suficiente.

Reviziile de conținut sunt declanșate de modificări reale ale modelelor, documentației și condițiilor comerciale. Intervalele de analiză sunt o procedură de lucru; această planificare nu pornește automatizări.

## Referințe

- [Google Search Console — filtre și comparații](https://support.google.com/webmasters/answer/17011165?hl=en)
- [Google Search Console — indicatori și dimensiuni](https://support.google.com/webmasters/answer/7576553?hl=en)
- [Google web.dev — Web Vitals](https://web.dev/articles/vitals)
