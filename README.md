# RobotGo — pachet tehnic pentru publicare

**Bază:** RobotGo v0.4h. **Revizie tehnică:** 0.4h-p1. **Stadiu:** PREVIEW, nepublicat.

Designul, catalogul cu 26 de fișe, cele 3 fotografii și cele 4 clipuri sunt păstrate. Nu a fost înregistrat un domeniu, creat un cont sau activat un serviciu cu plată.

## Publicare recomandată: GitHub + Render Static Site

1. Folosește un repository GitHub care îți aparține. Poate fi privat; acordă aplicației Render acces doar la acel repository.
2. Încarcă **conținutul acestui dosar**, nu arhiva ZIP ca un singur fișier. La rădăcină trebuie să fie `render.yaml`, `package.json`, `tools/` și `public/`.
3. În Render creează un **Static Site** din repository. Folosește:
   - Build Command: `node tools/build.mjs`
   - Publish Directory: `dist`
   - Variabilă opțională: `SKIP_INSTALL_DEPS=true` — proiectul nu are dependențe npm.
4. Alternativ, importă `render.yaml` ca Blueprint și verifică resursele afișate înainte de aprobare. Fișierul descrie un singur site static, fără bază de date sau server persistent.
5. Adresa de previzualizare este stabilită de Render. Nu este creată și nu este cunoscută în această livrare.
6. Adaugă un domeniu propriu numai după confirmarea înregistrării și a controlului asupra lui. Datele DNS se preiau din serviciul real creat în Render, nu din exemple.

Nu încărca materiale confidențiale în repository. Pentru un repository public, toate fișierele sale sunt publice, chiar dacă Render publică numai `dist/`. Este recomandat un repository privat pentru acest proiect.

## Testare locală

Instalează o versiune Node.js compatibilă cu proiectul (minimum 20), apoi:

```sh
node tools/verify.mjs
node tools/build.mjs
node tools/preview.mjs
```

Ultima comandă pornește doar un server local la `http://127.0.0.1:4173`. Nu publică site-ul pe internet. Oprește-l cu Ctrl+C. Nu este necesar `npm install`.

## Modificări pregătite

- Structură de publicare separată: `public/` → verificare → `dist/`.
- Configurație Render, headere de securitate și pagină 404.
- Fără redirecționare generală a adreselor `/api/*` către HTML: site-ul folosește rute `#/`.
- Modul de afișare a contactelor; nu introduce date fictive atunci când câmpurile sunt goale.
- Fișierele sensibile, registrul intern al surselor și serverul opțional vechi nu fac parte din pachetul public.
- Indexarea rămâne blocată prin `noindex` și `robots.txt`. Aceasta NU este protecție prin parolă.

## Ce rămâne neactivat

Domeniul, publicarea în contul de hosting, autentificarea, emailurile automate, plățile, baza de date și serviciul AI nu sunt active. Datele de contact sunt lăsate goale până la primirea valorilor reale. Pozele online ale produselor pot depinde de servere externe. Permisiunile de publicare comercială a imaginilor trebuie confirmate.

Înainte de lansarea comercială, completează identitatea operatorului, contactele, politicile, condițiile comerciale și configurațiile produselor. Etapa pregătită aici este demonstrația online, nu un magazin complet operațional.

## Fișiere utile

- `docs/STADIU.md` — făcut / neactivat / limite.
- `docs/CONTACTE.md` — actualizarea sigură a contactelor.
- `docs/SURSE.md` — documentația Render folosită.
- `tests/static-report.json` și `tests/browser-report.json` — rezultatele verificărilor.

Nu trimite parole, coduri 2FA, tokenuri private sau date de card în conversație și nu le pune în JavaScript.
