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

- Operator: ROUTEX LOGISTICA S.R.L.; CUI 54708422; plătitoare de TVA, conform proprietarului.
- Adresa publică: Strada Episcopiei, București, Sectorul 4, scara 3, etaj 5, apartament 77. Numărul străzii este omis la cererea explicită a proprietarului.
- Telefon: +40778167507; același număr folosit pentru WhatsApp.
- Email: robotgo100@gmail.com; căsuță existentă furnizată de proprietar.
- Program: luni–vineri, 09:00–17:00, ora României.
- Public: persoane fizice și juridice.
- Flux: solicitare de ofertă în EUR; plata cu avans prin transfer bancar. Valoarea avansului și termenele de plată se stabilesc în oferta acceptată. Datele bancare se comunică doar în ofertă, nu se publică pe site.
- Transport inclus în prețul ofertat doar în România. Stocul, termenul și TVA se precizează în ofertă.
- Formularele pregătesc textul complet pentru aplicația de email sau WhatsApp. Clientul verifică și trimite mesajul acolo. Există copiere/descărcare de rezervă.
- Niciun email nu este trimis de server și nicio încasare nu este procesată pe site.

De clarificat cu proprietarul: numărul complet al Registrului Comerțului. Răspunsul primit este „4690”; nu se publică drept număr complet înainte de clarificare. Statutul TVA este confirmat de proprietar, fără a presupune o cotă de TVA sau dacă prețurile includ TVA. Datele bancare rămân exclusiv în ofertă. Nu solicita și nu publica numărul străzii, omis explicit de proprietar. Politicile comerciale și de confidențialitate trebuie finalizate separat. Indexarea rămâne blocată până la finalizarea lansării.
