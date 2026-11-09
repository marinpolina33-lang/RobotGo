# Verificarea SEO după publicare

## Verificări reproductibile

- `npm test`: generează cele 77 de pagini HTML, verifică metadatele, sitemapul,
  legăturile interne, comparațiile, ancorele, datele editoriale, apoi testele
  pentru videoclipuri și integrarea Metricool.
- `python3 -m unittest discover -s tests -p '*_test.py'`: verifică detectorul
  pentru blocări `noindex`, `X-Robots-Tag`, canonical și redirecționări.
- `npm run audit:seo -- --output /tmp/robotgo-seo.json`: verifică site-ul public
  după deploy. Necesită Python 3; folosește doar biblioteca standard, fără
  conturi, tokenuri sau modificări ale site-ului. Testează toate adresele paginilor
  din sitemap, HTTP, canonical, meta robots/Googlebot, X-Robots-Tag, H1, titluri,
  robots.txt, formularul exclus intenționat și răspunsul 404 pentru adrese inexistente.

Auditul public arată eligibilitatea tehnică pentru indexare. Nu poate determina
starea actuală din indexul Google sau poziția unei pagini în rezultate.

## Interpretarea raportului Google Search Console

| Stare | Acțiune |
|---|---|
| Alternate page with proper canonical tag | Verifică URL-ul și pagina principală aleasă. Păstrează excluderea dacă este o variantă duplicată; nu publica toate variantele în sitemap. |
| Excluded by noindex tag | Păstrează excluderea formularelor și paginilor tehnice. Elimină directiva numai dacă URL-ul este o pagină publică destinată căutării. |
| Discovered – currently not indexed | Google cunoaște URL-ul, dar încă nu l-a accesat pentru indexare. Verifică accesibilitatea, legăturile și conținutul; inspectează paginile comerciale prioritare. |

Exportul general al raportului nu include obligatoriu adresele din fiecare grup.
Pentru diagnostic individual, deschide fiecare motiv, apoi exportă tabelul cu URL-uri.
În **URL Inspection**, compară URL-ul canonical declarat cu cel ales de Google și
rulează **Test live URL**. Dacă pagina prioritară este eligibilă și neindexată,
folosește **Request indexing** o dată după schimbarea relevantă.

Priorități: pagina principală, categoria de umanoizi, comparația umanoizilor,
Unitree G1, categoria de coboți și aplicația de evenimente. În raportul Sitemaps,
verifică starea și ultima citire pentru `https://robotgo.ro/sitemap.xml` și
`https://robotgo.ro/video-sitemap.xml`.

Nu șterge noindex pentru `/quote/`, nu introduce formularele în sitemap și nu
bloca accesarea lor în robots.txt: Google trebuie să poată citi directiva noindex.
Nu înlocui răspunsurile 404 cu pagina principală. Nu modifica toate datele lastmod
la fiecare build; schimbă data doar pentru conținutul actualizat.

Documentație oficială:
- https://support.google.com/webmasters/answer/7440203
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://developers.google.com/search/docs/crawling-indexing/consolidate-duplicate-urls

Google poate necesita zile sau săptămâni pentru recrawl. Cererile repetate nu
accelerează procesul și nu garantează indexarea sau clasarea.
