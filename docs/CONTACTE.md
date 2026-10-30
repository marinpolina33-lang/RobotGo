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
