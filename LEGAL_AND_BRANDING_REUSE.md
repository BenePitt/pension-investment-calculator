# Veit-BDS Legal & Branding — Wiederverwendungsanleitung

Dieses Dokument beschreibt, wie **Impressum**, **Datenschutzerklärung** und das **Veit-BDS Logo**
aus diesem Projekt in ein beliebiges anderes React-Projekt übertragen werden können.

Am Ende dieses Dokuments befindet sich ein fertiger **Claude Code Prompt**, den du direkt in einem
anderen Projekt einfügen kannst.

---

## Was wird implementiert?

| Komponente | Beschreibung |
|---|---|
| **Impressum** | Modal mit Pflichtangaben nach § 5 TMG, Haftungsausschluss und Urheberrecht |
| **Datenschutzerklärung** | DSGVO-konformes Modal (kein Tracking, GitHub Pages Hosting) |
| **Veit-BDS Logo** | Footer-Branding mit Logo-Bild, Text "Gebaut von Veit-BDS", optionaler Link |

---

## Voraussetzungen im Zielprojekt

- React 18+
- Vite als Build-Tool (für `import.meta.env.BASE_URL`)
- TypeScript oder JavaScript (Komponente ggf. in `.tsx`/`.ts` umbenennen)
- Tailwind CSS **oder** plain CSS (Stile anpassen — s. unten)

---

## Schritt-für-Schritt-Anleitung

### 1. Logo-Datei kopieren

Kopiere `public/assets/veit-bds-logo.png` in den `public/assets/`-Ordner des Zielprojekts.

### 2. Konfigurationsdatei anlegen

**`src/legal/legalData.js`** — nur diese Datei muss projektspezifisch angepasst werden.
Alle anderen Dateien lesen ausschließlich daraus; Name und Adresse erscheinen so nur an einer Stelle.

```js
// Pflichtangaben für Impressum & Datenschutz — nur diese Datei projektspezifisch anpassen
export const legalData = {
  name: '[Dein Name]',
  street: '[Straße + Hausnummer]',
  zip: '[PLZ]',
  city: '[Ort]',
  email: '[deine@email.de]',
  phone: '',     // leer = nicht angezeigt
  website: '',   // leer = Logo wird nicht verlinkt
}
```

### 3. LegalModal-Komponente anlegen

**`src/components/LegalModal.jsx`** — vollständig kopierbar aus diesem Projekt.

Projektspezifisch anzupassen:
- **Abschnitt "Urheberrecht"** im Impressum: Markenhinweise an den Projektinhalt anpassen.
- **Abschnitt 3 (Hosting)**: Bei anderem Hosting als GitHub Pages entsprechend ersetzen.
- **Abschnitt 4 (Ihre Rechte)**: Zuständige Datenschutzbehörde anpassen (Bundesland des Wohnsitzes).

> **Hinweis zu Tailwind vs. plain CSS:** Die Datei aus diesem Projekt nutzt CSS-Klassen
> (`.legal-modal`, `.legal-section` usw.), die in `App.css` definiert sind. Bei Tailwind-Projekten
> die Klassen durch Tailwind-Utilities ersetzen (s. Abschnitt "Anpassungen").

### 4. App-Komponente anpassen

**Imports:**
```js
import { useState } from 'react'
import { LegalModal } from './components/LegalModal.jsx'
import { legalData } from './legal/legalData.js'
```

**State:**
```js
const [legalView, setLegalView] = useState(null)
```

**Footer** (innerhalb des JSX):
```jsx
<footer className="app-footer">

  {/* Veit-BDS Branding */}
  {legalData.website ? (
    <a href={legalData.website} target="_blank" rel="noopener noreferrer"
       className="footer-branding">
      <img src={`${import.meta.env.BASE_URL}assets/veit-bds-logo.png`}
           alt="Veit-BDS"
           onError={(e) => { e.currentTarget.style.display = 'none' }} />
      <span>Gebaut von <strong>Veit-BDS</strong></span>
    </a>
  ) : (
    <div className="footer-branding">
      <img src={`${import.meta.env.BASE_URL}assets/veit-bds-logo.png`}
           alt="Veit-BDS"
           onError={(e) => { e.currentTarget.style.display = 'none' }} />
      <span>Gebaut von <strong>Veit-BDS</strong></span>
    </div>
  )}

  {/* Impressum & Datenschutz Links */}
  {(legalData.name || legalData.email) && (
    <div className="footer-legal-links">
      <button onClick={() => setLegalView('impressum')} className="footer-legal-btn">
        Impressum
      </button>
      <button onClick={() => setLegalView('datenschutz')} className="footer-legal-btn">
        Datenschutz
      </button>
    </div>
  )}

</footer>

{/* Modal */}
{legalView && (
  <LegalModal view={legalView} onClose={() => setLegalView(null)} />
)}
```

---

## Anpassungen je nach Projekt

| Was anpassen | Wo |
|---|---|
| Name, Adresse, E-Mail | `src/legal/legalData.js` — einzige Datei mit persönlichen Daten |
| Urheberrecht-Text | `LegalModal.jsx` → Funktion `Impressum` → Abschnitt "Urheberrecht" |
| Externe Dienste (APIs, SDKs) | `LegalModal.jsx` → Funktion `Datenschutz` → neuen Abschnitt 3 einfügen |
| Hosting (nicht GitHub Pages) | `LegalModal.jsx` → Funktion `Datenschutz` → Abschnitt 3 ersetzen |
| Zuständige Datenschutzbehörde | `LegalModal.jsx` → Funktion `Datenschutz` → Abschnitt 4 |
| CSS-Stile | `App.css` → Abschnitt "Legal Modal" und "Footer" |

### Tailwind-Projekte

Bei Tailwind CSS die CSS-Klassen in `LegalModal.jsx` und im Footer durch Tailwind-Utilities ersetzen.
Richtwerte für das Dark-Theme:

| CSS-Klasse | Tailwind-Äquivalent |
|---|---|
| `.legal-overlay` | `fixed inset-0 z-50 bg-black/55 flex items-center justify-center p-4` |
| `.legal-modal` | `bg-white border border-gray-200 rounded-lg shadow-2xl w-full max-w-2xl max-h-[82vh] flex flex-col` |
| `.legal-modal-header` | `flex items-center justify-between px-5 py-4 border-b border-gray-200 sticky top-0 bg-white` |
| `.legal-section h3` | `text-sm font-semibold text-gray-900 mb-2 pb-1 border-b border-gray-100` |
| `.legal-link` | `text-blue-600 hover:underline` |

---

## Inhalt der Datenschutzerklärung — Struktur & Begründung

Die Datenschutzerklärung gliedert sich in vier Abschnitte:

### Abschnitt 1 — Verantwortlicher
Pflichtangabe nach Art. 13 DSGVO. Wird aus `legalData` befüllt.

### Abschnitt 2 — Datenverarbeitung durch den Betreiber
Der Betreiber erhebt keine Daten. Wichtig: Formulierung muss zwischen Betreiber und
Hosting-Anbieter unterscheiden. **Fehlerquelle:** Die pauschale Aussage „Diese Webseite
erhebt keine personenbezogenen Daten" ist technisch ungenau, weil der Hosting-Anbieter
Verbindungsdaten (IP-Adressen) verarbeitet — dies ist aber nicht dem Betreiber zuzurechnen.
Korrekte Formulierung: *„Der Betreiber erhebt keine Daten. Technisch bedingte Verarbeitung
durch den Hosting-Anbieter: siehe Abschnitt 3."*

### Abschnitt 3 — Hosting (GitHub Pages)
GitHub Pages verarbeitet beim Seitenaufruf Verbindungsdaten (IP-Adresse, Zeitstempel) als
technischer Dienstleister. Relevante Fakten:
- Anbieter: GitHub Inc., San Francisco, USA (Microsoft-Konzern)
- CDN: Fastly (globale Auslieferung)
- Zertifizierung: EU-US Data Privacy Framework
- Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
- Link: [GitHub General Privacy Statement](https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement)

Bei anderem Hosting (Netlify, Vercel, etc.) diesen Abschnitt mit den Angaben des jeweiligen
Anbieters ersetzen.

### Abschnitt 4 — Ihre Rechte
DSGVO-Betroffenenrechte (Art. 15–21). Da der Betreiber selbst keine Daten verarbeitet,
ist eine Anfrage an ihn gegenstandslos. Für Hosting-Daten: Nutzer direkt an GitHub verweisen.
Aufsichtsbehörde: zuständig ist die Behörde des Bundeslandes des Wohnsitzes des Betreibers.
Beispiel Bayern: Bayerischer Landesbeauftragter für den Datenschutz (BayLfD),
[www.datenschutz-bayern.de](https://www.datenschutz-bayern.de).

---

## Dateistruktur im Zielprojekt

```
projekt/
├── public/
│   └── assets/
│       └── veit-bds-logo.png          ← Datei kopieren
├── src/
│   ├── components/
│   │   └── LegalModal.jsx             ← Datei kopieren & anpassen
│   ├── legal/
│   │   └── legalData.js               ← Datei anlegen & ausfüllen
│   └── App.jsx (oder Hauptkomponente) ← Footer + State + Modal ergänzen
```

---

## Claude Code Prompt

Kopiere den folgenden Prompt und füge ihn in einem neuen Projekt in Claude Code ein.
Passe die Werte im Abschnitt "KONFIGURATION" an.

---

```
Implementiere in diesem React-Projekt drei Dinge:
1. Ein Impressum-Modal (§ 5 TMG, Deutschland)
2. Eine Datenschutzerklärung als Modal (DSGVO-konform, für statisches Hosting ohne Tracking)
3. Das Veit-BDS Logo im Footer mit dem Text "Gebaut von Veit-BDS"

──────────────────────────────────────────────────────────
KONFIGURATION — diese Werte bitte anpassen:
──────────────────────────────────────────────────────────
  Name:     [Dein Name]
  Straße:   [Straße + Hausnummer]
  PLZ:      [PLZ]
  Ort:      [Ort]
  E-Mail:   [deine@email.de]
  Telefon:  (leer lassen = nicht anzeigen)
  Website:  (leer lassen = Logo nicht verlinken)

  Externe Dienste (für Datenschutz Abschnitt 3):
    - Name: [NAME DES DIENSTES, z.B. "OpenWeather API"]
    - URL:  [URL DES DIENSTES]
    - Zweck: [WOFÜR WIRD ER GENUTZT]
    Falls keine externen APIs genutzt werden: Abschnitt weglassen.

  Hosting-Plattform (für Datenschutz Abschnitt 3):
    GitHub Pages (Standard — falls anderes Hosting, bitte angeben)

  Zuständige Datenschutzaufsichtsbehörde (Bundesland des Wohnsitzes):
    Bayern: Bayerischer Landesbeauftragter für den Datenschutz (BayLfD), www.datenschutz-bayern.de
    (Für andere Bundesländer bitte Behörde und URL anpassen)

──────────────────────────────────────────────────────────
SCHRITT 1 — Datei anlegen: src/legal/legalData.js
──────────────────────────────────────────────────────────
Inhalt (Name und Adresse nur hier — alle anderen Dateien lesen daraus):

  export const legalData = {
    name: '[Dein Name]',
    street: '[Straße + Hausnummer]',
    zip: '[PLZ]',
    city: '[Ort]',
    email: '[deine@email.de]',
    phone: '',
    website: '',
  }

──────────────────────────────────────────────────────────
SCHRITT 2 — Datei anlegen: src/components/LegalModal.jsx
──────────────────────────────────────────────────────────
Erstelle eine React-Komponente mit diesen Eigenschaften:

- Props: { view: 'impressum' | 'datenschutz', onClose: () => void }
- Fixed fullscreen overlay (z-50), schließt bei Klick auf Hintergrund
- Escape-Taste schließt das Modal (useEffect + keydown listener)
- Scrollbares Modal-Fenster (max-h ca. 82vh), max-w 640px
- Sticky Header mit Titel und × Close-Button
- Stile passend zum bestehenden Projekt-Design-System anlegen

Impressum-Inhalt (aus legalData befüllen):
  § Angaben gemäß § 5 TMG: Name, Straße, PLZ Ort
  § Kontakt: Telefon (nur wenn vorhanden), E-Mail als mailto-Link,
    Website (nur wenn vorhanden)
  § Haftungsausschluss: Privates Freizeitprojekt, kein Anspruch auf
    Vollständigkeit/Aktualität, kein Ersatz für Fachberatung
  § Urheberrecht: Eigene Inhalte unterliegen deutschem Urheberrecht,
    keine Verbindung zu Markeninhabern (projektspezifisch anpassen)

Datenschutz-Inhalt:
  1. Verantwortlicher: Name, Straße, PLZ Ort, E-Mail aus legalData
  2. Datenverarbeitung durch den Betreiber: Betreiber erhebt selbst keine
     personenbezogenen Daten. Keine Cookies, kein Tracking, alle Berechnungen
     lokal. Hinweis: technisch bedingte Verarbeitung durch Hosting-Anbieter
     (s. Abschnitt 3).
  3. Hosting (GitHub Pages): GitHub Inc. / Microsoft, IP-Adresse und
     Verbindungsdaten werden verarbeitet, Fastly CDN, EU-US Data Privacy
     Framework, Rechtsgrundlage Art. 6 Abs. 1 lit. f DSGVO, Link zur
     GitHub Privacy Policy.
  4. Ihre Rechte: DSGVO-Rechte (Art. 15–21). Da Betreiber keine Daten
     erhebt, ist Anfrage an ihn gegenstandslos. Für Hosting-Daten: direkt
     an GitHub wenden. Beschwerderecht bei zuständiger Aufsichtsbehörde
     (Behörde und Link gemäß KONFIGURATION oben einsetzen).

──────────────────────────────────────────────────────────
SCHRITT 3 — Logo-Datei
──────────────────────────────────────────────────────────
Die Logo-Datei liegt unter public/assets/veit-bds-logo.png.
Gehe davon aus, dass die Datei bereits vorhanden ist.

Lade das Logo mit:
  src={`${import.meta.env.BASE_URL}assets/veit-bds-logo.png`}

Füge einen onError-Handler hinzu, der das Bild bei Ladefehler ausblendet:
  onError={(e) => { e.currentTarget.style.display = 'none' }}

──────────────────────────────────────────────────────────
SCHRITT 4 — App-Hauptkomponente anpassen
──────────────────────────────────────────────────────────
Ergänze in der Hauptkomponente:

  import { useState } from 'react'
  import { LegalModal } from './components/LegalModal.jsx'
  import { legalData } from './legal/legalData.js'

  const [legalView, setLegalView] = useState(null)

Footer: Veit-BDS Branding (Logo + Text "Gebaut von Veit-BDS", als <a> wenn
legalData.website gesetzt, sonst als <div>) und Impressum/Datenschutz-Buttons
(nur wenn legalData.name oder legalData.email gesetzt).

Modal: {legalView && <LegalModal view={legalView} onClose={() => setLegalView(null)} />}

──────────────────────────────────────────────────────────
HINWEISE
──────────────────────────────────────────────────────────
- Name und Adresse: nur in src/legal/legalData.js — alle anderen Dateien
  lesen ausschließlich daraus.
- Das Projekt nutzt [Tailwind / plain CSS — hier angeben]; Stile entsprechend
  in LegalModal und Footer anlegen.
- Kein React Router nötig — alles über useState gelöst.
- Die Datenschutzerklärung unterscheidet explizit zwischen Betreiber (erhebt
  keine Daten) und Hosting-Anbieter (verarbeitet Verbindungsdaten). Diese
  Unterscheidung ist DSGVO-rechtlich wichtig und darf nicht verwischt werden.
```
