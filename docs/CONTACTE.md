# Date publice de contact

Editează doar valorile publice din `public/site-config.js` și publică din nou:

| Câmp | Valoarea necesară |
|---|---|
| `companyName` | Denumirea reală a operatorului |
| `email` | Adresa comercială funcțională |
| `phoneNumber` | Telefonul comercial în format internațional |
| `whatsappNumber` | Numărul WhatsApp internațional, doar cifre, fără + |
| `address` | Adresa publică |
| `vatId` | Identificatorul fiscal, dacă este aplicabil |
| `registrationNo` | Numărul de înregistrare relevant |
| `openingHours` | Programul real de contact |

Câmpurile goale nu sunt înlocuite cu date inventate. Modulul `contact-public.js` afișează datele în pagina `#/contact`, în română și engleză. Adresele de email și telefon au linkuri de contact. Modulul nu creează căsuța poștală, nu trimite cereri și nu activează autentificarea.

`domainTarget` este doar o etichetă a domeniului vizat. Schimbarea ei nu înregistrează domeniul și nu configurează DNS.

**Nu schimba** `backendEnabled: false` sau `demo: true` pentru a simula activarea funcțiilor. Pentru activare sunt necesare servicii reale, reguli de acces și teste de integrare.

Verificarea automată acceptă câmpuri goale sau contacte publice cu format valid; respinge exemplele de test și formatele invalide. Nu este necesar să modifici codul verificării pentru a completa contactele reale. Verificarea formatului nu confirmă că o căsuță poștală sau un număr există ori îți aparține.

## Configurație confirmată — 30 octombrie 2026

- Operator: ROUTEX LOGISTICA S.R.L.; CUI 54708422.
- Telefon: +40778167507; același număr folosit pentru WhatsApp.
- Email: robotgo100@gmail.com; căsuță existentă furnizată de proprietar.
- Program: luni–vineri, 09:00–17:00, ora României.
- Public: persoane fizice și juridice.
- Flux: solicitare de ofertă în EUR; plata prin transfer bancar se stabilește în oferta acceptată.
- Transport inclus în prețul ofertat. Stocul, termenul și TVA se precizează în ofertă.
- Formularele pregătesc textul complet pentru aplicația de email sau WhatsApp. Clientul verifică și trimite mesajul acolo. Există copiere/descărcare de rezervă.
- Niciun email nu este trimis de server și nicio încasare nu este procesată pe site.

De completat de proprietar: strada și numărul sediului (adresa primită este incompletă), numărul Registrului Comerțului, statutul TVA, coordonatele bancare și condițiile de plată. Nu publica un cont bancar presupus. Politicile comerciale și de confidențialitate trebuie finalizate separat. Indexarea rămâne blocată până la finalizarea lansării.
