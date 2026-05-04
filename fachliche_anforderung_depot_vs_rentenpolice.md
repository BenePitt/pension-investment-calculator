# Fachliche Anforderung und Claude-Code-Prompt  
## Statische Webseite: Depot vs. fondsgebundene Rentenpolice Schicht 3

**Dokumentversion:** 1.0  
**Datum:** 03.05.2026  
**Ziel:** Umsetzung einer statischen, interaktiven Webseite in JavaScript zur rechnerischen Gegenüberstellung eines Aktiendepots und einer privaten fondsgebundenen Rentenversicherung / Rentenpolice Schicht 3 für die Altersvorsorge in Deutschland.

---

## 1. Kurzbeschreibung

Die Webseite soll Nutzerinnen und Nutzern ermöglichen, ein selbst bespartes Aktiendepot mit einer privaten fondsgebundenen Rentenpolice Schicht 3 zu vergleichen. Beide Varianten investieren modellhaft in dieselben Aktien beziehungsweise Aktienfonds. Der Vergleich soll die Ansparphase bis zum Rentenbeginn und zwei Auszahlungsvarianten abbilden:

1. **Kapitalauszahlung auf einmal**
2. **Regelmäßige Auszahlung als Rente beziehungsweise Entnahmeplan**

Alle zentralen Parameter müssen individuell veränderbar sein. Zu jedem Parameter muss eine detaillierte Erklärung direkt in der Oberfläche verfügbar sein, zum Beispiel über Info-Icons, Tooltips, ausklappbare Hilfetexte oder Hilfemodal-Dialoge.

Die Seite soll **keine Daten dauerhaft speichern**. Es darf keinen Backend-Service, keine Nutzerkonten, keine Datenbank, keine Cookies, kein Local Storage, keine Analytics und keine sonstige automatische Persistenz geben. Alle Berechnungen sollen lokal im Browser stattfinden.

---

## 2. Zielgruppe

Die Seite richtet sich an Privatpersonen in Deutschland, die verstehen möchten, wie sich Kosten, Steuern, Sparraten, Renditen und Auszahlungsoptionen auf den langfristigen Vergleich zwischen Depot und Rentenpolice auswirken.

Die Zielgruppe ist finanziell interessiert, aber nicht zwingend steuerlich oder versicherungsmathematisch vorgebildet. Die Oberfläche muss daher intuitiv sein und Fachbegriffe erklären.

---

## 3. Abgrenzung und wichtige Hinweise

### 3.1 Keine Finanz-, Steuer- oder Rechtsberatung

Die Webseite ist ein Rechen- und Veranschaulichungstool. Sie darf nicht als individuelle Anlage-, Steuer-, Versicherungs- oder Rechtsberatung auftreten.

Pflichttext in der Webseite:

> Diese Berechnung ist eine vereinfachte Modellrechnung und keine Anlage-, Steuer-, Versicherungs- oder Rechtsberatung. Steuerregeln, Produktbedingungen, Kosten, Rentenfaktoren und persönliche Umstände können sich ändern. Prüfe konkrete Entscheidungen mit einer qualifizierten Fachperson.

### 3.2 Vereinfachungen transparent machen

Die Webseite muss sichtbar erklären, dass unter anderem folgende Vereinfachungen gelten können:

- konstante durchschnittliche Rendite statt realer schwankender Kapitalmärkte;
- keine Berücksichtigung von Sequenzrisiken, wenn nicht explizit modelliert;
- vereinfachte steuerliche Behandlung;
- keine individuelle Produktprüfung konkreter Versicherungstarife;
- keine Berücksichtigung von Todesfallleistungen oder Vererbung, sofern deaktiviert;
- keine Berücksichtigung von Inflation, sofern nicht aktiviert;
- keine Gewähr, dass heutige Steuergesetze in Zukunft unverändert gelten.

---

## 4. Technische Rahmenbedingungen

### 4.1 Art der Webseite

- Statische Webseite.
- Kein Backend.
- Alle Berechnungen clientseitig im Browser.
- Veröffentlichung zum Beispiel über GitHub Pages, Netlify, Vercel Static Hosting oder einen beliebigen Webserver.
- Programmiersprache: **JavaScript**.
- Keine dauerhafte Speicherung von Nutzerdaten.

### 4.2 Empfohlener technischer Stack

Empfohlen:

- Vite als Build-Tool.
- React mit JavaScript-Dateien (`.jsx` / `.js`) oder alternativ Vanilla JavaScript.
- Chart.js oder Apache ECharts für Diagramme.
- Keine CDN-Abhängigkeiten im Produktivbetrieb, sondern gebündelte npm-Abhängigkeiten.
- CSS Modules, normales CSS oder ein leichtgewichtiges Utility-CSS; keine Pflicht für ein UI-Framework.

Falls bereits ein Repository existiert, soll Claude Code vorhandene Struktur respektieren. Falls kein Projekt existiert, soll ein neues Vite-Projekt mit JavaScript eingerichtet werden.

### 4.3 Datenschutzanforderungen

Pflichtanforderungen:

- Keine Nutzerkonten.
- Keine Serverübertragung der Eingaben.
- Keine Cookies.
- Kein `localStorage`.
- Kein `sessionStorage`, außer es wird explizit deaktivierbar und ausschließlich temporär genutzt. Besser: gar nicht nutzen.
- Keine Analytics.
- Keine Tracking-Skripte.
- Keine eingebetteten Drittanbieter-Widgets, die Daten nachladen.
- Keine dauerhafte Speicherung von Szenarien.
- Optional erlaubt: manuell ausgelöster Download einer JSON-Datei mit den aktuellen Parametern. Das ist keine automatische Speicherung, sondern ein Nutzerexport.
- Optional erlaubt: Import einer lokal ausgewählten JSON-Datei. Die Daten bleiben im Browser.

In der App soll ein kurzer Datenschutzhinweis stehen:

> Alle Berechnungen laufen lokal in deinem Browser. Deine Eingaben werden nicht übertragen und nicht dauerhaft gespeichert.

---

## 5. Fachlicher Defaultfall

Die Webseite soll mit einem Default-Szenario starten, das den bisher besprochenen Annahmen entspricht.

### 5.1 Persönliche Parameter

| Parameter | Default | Beschreibung |
|---|---:|---|
| Aktuelles Alter | 28 Jahre | Alter der Person zu Beginn der Berechnung. |
| Renteneintrittsalter | 67 Jahre | Alter, zu dem die Ansparphase endet und die Auszahlungsphase beginnt. |
| Endalter Entnahmeplan | 90 Jahre | Zielalter, bis zu dem das Depot im Entnahmeplan rechnerisch aufgebraucht wird. |
| Startkapital | 0 € | Initial verfügbares Kapital. |
| Monatliche Sparrate im ersten Jahr | 600 € | Monatlicher Beitrag zu Beginn. |
| Sparratendynamik | 3 % p. a. | Jährliche Erhöhung der monatlichen Sparrate. |
| Beitragszeitpunkt | Monatsende | Beitrag wird am Ende jedes Monats investiert. |

### 5.2 Rendite- und Kostenparameter

| Parameter | Depot Default | Rentenpolice Default | Beschreibung |
|---|---:|---:|---|
| Aktienrendite nominal brutto | 7,00 % p. a. | 7,00 % p. a. | Erwartete jährliche Rendite vor Kosten und Steuern. |
| Fondskosten / ETF-TER | 0,20 % p. a. | 0,20 % p. a. | Laufende Produktkosten des Fonds. |
| Depotkosten | 0,00 % p. a. | — | Laufende Plattform-/Depotkosten. |
| Verwaltungskosten Police | — | 1,50 % p. a. | Laufende Kosten des Versicherungsmantels. |
| Abschluss-/Eröffnungskosten Police | — | 4.000 € | Zu Beginn zu zahlende Kosten. |
| Eröffnungslogik Police | — | Beiträge zahlen zuerst Kosten | Es gibt keine Rendite, bis die 4.000 € aus Beiträgen beglichen sind. |

### 5.3 Steuerparameter

| Parameter | Default | Beschreibung |
|---|---:|---|
| Sparer-Pauschbetrag | 1.000 € p. a. | Für Einzelpersonen. Muss editierbar sein. |
| Sparer-Pauschbetrag verfügbar | 100 % | Im Default vollständig verfügbar. |
| Abgeltungsteuer | 25,00 % | Für Kapitalerträge im Depot. |
| Solidaritätszuschlag auf Abgeltungsteuer | 5,50 % | Ergibt zusammen mit 25 % Abgeltungsteuer eine Belastung von 26,375 % ohne Kirchensteuer. |
| Kirchensteuer | 0,00 % | Default: keine Kirchensteuer. Muss auf 8 % oder 9 % stellbar sein. |
| Teilfreistellung Aktienfonds Depot | 30,00 % | Für Aktienfonds. Muss editierbar sein. |
| Basiszins Vorabpauschale | 3,20 % | Default für 2026; muss editierbar sein. |
| Persönlicher Grenzsteuersatz im Alter | 45,00 % | Für Police-Kapitalauszahlung nach 12/62 und Ertragsanteil der Privatrente. |
| 15-%-Freistellung fondsgebundene Police | aktiviert | Für Unterschiedsbetrag aus Investmenterträgen bei fondsgebundener Lebens-/Rentenversicherung. |
| 12/62-Regel | aktiviert, wenn Bedingungen erfüllt | Laufzeit mindestens 12 Jahre und Auszahlung nach Vollendung des 62. Lebensjahres. |
| Ertragsanteil bei Rentenbeginn 67 | 17,00 % | Für private lebenslange Leibrente. Muss editierbar beziehungsweise tabellarisch ableitbar sein. |
| Krankenversicherung im Alter | KVdR | Default: keine zusätzlichen KV/PV-Abzüge auf private Kapitalerträge oder private Leibrente. |

### 5.4 Rentenparameter

| Parameter | Default | Beschreibung |
|---|---:|---|
| Auszahlungsvariante Depot | Entnahmeplan bis Alter 90 | Monatliche Netto-Entnahme wird so berechnet, dass das Depot mit 90 auf 0 läuft. |
| Rendite in Rentenphase Depot | wie Ansparphase | Default: Depot bleibt investiert mit gleicher Nettorendite nach Fondskosten. |
| Rentenfaktor Police | 30,00 € je 10.000 € Vertragsguthaben | Monatsrente pro 10.000 € Vertragsguthaben. Wichtig: Eingabe nicht als 3.000 €, sondern als 30,00 € modellieren. |
| Rentenzahlung Police | lebenslang | Kapital wird in eine lebenslange Rente umgewandelt. |

---

## 6. Zentrale Nutzerfunktionen

### 6.1 Parameter bearbeiten

Die Nutzerin oder der Nutzer muss alle relevanten Parameter ändern können. Änderungen sollen sofort oder nach Klick auf „Neu berechnen“ sichtbar werden. Empfohlen ist eine Kombination:

- Eingaben werden live validiert.
- Ergebnisse werden nach kurzer Debounce-Zeit automatisch aktualisiert.
- Zusätzlich gibt es einen Button „Neu berechnen“, um Kontrolle zu vermitteln.

### 6.2 Erklärung pro Parameter

Jeder Parameter benötigt eine sichtbare Erklärung. Umsetzungsvorschlag:

- Neben jedem Label ein Info-Icon.
- Klick oder Tastaturfokus öffnet einen Hilfetext.
- Hilfetext erklärt:
  - Bedeutung;
  - Wirkung auf die Berechnung;
  - Defaultannahme;
  - typische Spannbreite;
  - Hinweis, falls steuerlich oder produktabhängig.

### 6.3 Ergebnisübersicht

Direkt nach den Eingaben soll eine Ergebnisübersicht mit Karten angezeigt werden:

- Netto-Kapital Depot mit Rentenbeginn.
- Netto-Kapital Police mit Rentenbeginn.
- Differenz Kapitalauszahlung.
- Monatliche Netto-Entnahme Depot bis Zielalter.
- Monatliche Netto-Rente Police.
- Break-even-Verwaltungskosten der Police.
- Hinweis, welche Variante im aktuellen Szenario rechnerisch vorne liegt.

### 6.4 Detaillierte Ergebnisansicht

Zusätzlich zur Übersicht sollen Detailbereiche verfügbar sein:

1. **Ansparphase**  
   Entwicklung von Beiträgen, Kosten, Steuern und Vermögen.

2. **Kapitalauszahlung**  
   Bruttovermögen, steuerpflichtiger Gewinn, Steuerlast, Nettoauszahlung.

3. **Renten-/Entnahmephase**  
   Depot-Entnahmeplan bis Zielalter und Police-Rente.

4. **Break-even-Analyse**  
   Verwaltungskostenquote, bei der die Police gleichauf wäre.

5. **Jahrestabelle**  
   Jahr für Jahr: Beiträge, Depotwert, Policewert, Steuer, Kosten, Differenz.

6. **Methodik**  
   Formeln und vereinfachende Annahmen.

---

## 7. Visualisierungen

Die Webseite soll eine grafische Veranschaulichung mit interaktiven oder statischen Graphen enthalten. Die Graphen müssen bei Parameteränderungen aktualisiert werden.

### 7.1 Diagramm: Vermögensentwicklung Ansparphase

**Typ:** Liniendiagramm  
**X-Achse:** Alter oder Jahr  
**Y-Achse:** Vermögen in Euro  
**Linien:**

- Depotwert vor finaler Auszahlungsteuer;
- Police-Vertragsguthaben;
- optional Depot netto bei fiktivem Verkauf;
- kumulierte Einzahlungen.

**Ziel:** Sichtbar machen, wie stark sich laufende Kosten und Steuern über Zeit auswirken.

### 7.2 Diagramm: Netto-Kapitalauszahlung mit 67

**Typ:** Balkendiagramm oder Waterfall  
**Werte:**

- Depot brutto;
- Depot Steuer;
- Depot netto;
- Police brutto;
- Police Steuer;
- Police netto;
- Netto-Differenz.

**Ziel:** Verständlicher Vergleich der Einmalauszahlung.

### 7.3 Diagramm: Zusammensetzung des Endwerts

**Typ:** gestapelter Balken  
**Komponenten:**

- eingezahlte Beiträge;
- Kapitalerträge;
- gezahlte Steuern;
- Kostenwirkung beziehungsweise Opportunitätskosten;
- Netto-Endkapital.

### 7.4 Diagramm: Renten-/Entnahmephase

**Typ:** Liniendiagramm  
**X-Achse:** Alter 67 bis Zielalter  
**Y-Achse:** Depotrestwert / kumulierte Auszahlungen  
**Linien:**

- Depotrestwert im Entnahmeplan;
- kumulierte Netto-Entnahmen Depot;
- kumulierte Netto-Renten Police;
- optional Break-even-Alter.

### 7.5 Diagramm: Verwaltungskosten-Break-even

**Typ:** Liniendiagramm oder horizontales Balkendiagramm  
**X-Achse:** Verwaltungskosten der Police in % p. a.  
**Y-Achse:** Netto-Kapitalauszahlung Police  
**Referenzlinie:** Depot-Netto-Kapital  
**Markierung:** Break-even-Punkt.

**Ziel:** Zeigen, ab welcher Verwaltungskostenhöhe die Police rechnerisch gleichauf oder besser wäre.

### 7.6 Diagramm: Steuer- und Kostenlast kumuliert

**Typ:** Liniendiagramm oder Flächendiagramm  
**Werte:**

- Depot: kumulierte Vorabpauschalensteuer;
- Police: kumulierte Abschlusskosten und laufende Verwaltungskostenwirkung;
- optional Differenz der Nettovermögen.

---

## 8. Parameterkatalog mit Erklärungstexten

Die folgenden Parameter sollen in der UI vorhanden sein. Jeder Parameter soll eine eigene Hilfebeschreibung haben.

### 8.1 Persönliche und zeitliche Parameter

#### `currentAge` – Aktuelles Alter

- **Default:** 28
- **Einheit:** Jahre
- **Validierung:** 0 bis 100; muss kleiner als Renteneintrittsalter sein.
- **Hilfetext:**  
  „Dein aktuelles Alter zu Beginn der Berechnung. Zusammen mit dem Renteneintrittsalter bestimmt es die Länge der Ansparphase. Je länger die Laufzeit, desto stärker wirken Rendite, Kosten und Steuern durch den Zinseszinseffekt.“

#### `retirementAge` – Renteneintrittsalter

- **Default:** 67
- **Einheit:** Jahre
- **Validierung:** größer als aktuelles Alter; maximal 100.
- **Hilfetext:**  
  „Das Alter, in dem keine weiteren Sparbeiträge geleistet werden und die Auszahlung beginnt. Für die steuerliche Behandlung der Police ist relevant, ob die Vertragslaufzeit mindestens zwölf Jahre beträgt und die Auszahlung nach Vollendung des 62. Lebensjahres erfolgt.“

#### `withdrawalEndAge` – Zielalter Entnahmeplan

- **Default:** 90
- **Einheit:** Jahre
- **Validierung:** größer als Renteneintrittsalter.
- **Hilfetext:**  
  „Bis zu diesem Alter soll das Depot im Entnahmeplan rechnerisch reichen. Das ist keine lebenslange Garantie. Wird ein höheres Zielalter gewählt, sinkt die monatliche Entnahme.“

#### `initialCapital` – Startkapital

- **Default:** 0 €
- **Validierung:** >= 0 €
- **Hilfetext:**  
  „Bereits zu Beginn verfügbares Kapital. Im Depot wird es sofort investiert. Bei der Police kann es je nach Einstellung zuerst zur Begleichung der Abschluss-/Eröffnungskosten verwendet werden.“

#### `monthlyContribution` – Monatliche Sparrate im ersten Jahr

- **Default:** 600 €
- **Validierung:** >= 0 €
- **Hilfetext:**  
  „Der monatliche Beitrag im ersten Jahr. Bei aktivierter Dynamik erhöht sich dieser Betrag jährlich. Beiträge werden im Default am Monatsende investiert.“

#### `contributionGrowthRate` – Sparratendynamik

- **Default:** 3,00 % p. a.
- **Validierung:** -20 % bis +20 % p. a.
- **Hilfetext:**  
  „Jährliche Erhöhung der monatlichen Sparrate. Beispiel: Bei 600 € Start-Sparrate und 3 % Dynamik beträgt die Sparrate im zweiten Jahr 618 € pro Monat. Dynamik erhöht die Gesamteinzahlungen erheblich.“

#### `contributionTiming` – Beitragszeitpunkt

- **Default:** Monatsende
- **Optionen:** Monatsanfang, Monatsende
- **Hilfetext:**  
  „Legt fest, ob Monatsbeiträge vor oder nach der monatlichen Rendite investiert werden. Monatsanfang führt bei positiver Rendite zu etwas höheren Endwerten.“

---

### 8.2 Rendite und Kosten

#### `grossAnnualReturn` – Aktienrendite nominal brutto

- **Default:** 7,00 % p. a.
- **Validierung:** -20 % bis +20 % p. a.
- **Hilfetext:**  
  „Angenommene durchschnittliche jährliche Aktienrendite vor Produktkosten, Versicherungskosten und persönlichen Steuern. Die Realität schwankt stark; die Rechnung nutzt einen konstanten Durchschnittswert.“

#### `depotFundFee` – Fondskosten Depot

- **Default:** 0,20 % p. a.
- **Validierung:** 0 % bis 5 % p. a.
- **Hilfetext:**  
  „Laufende Kosten des Fonds oder ETF im Depot. Diese reduzieren die modellierte jährliche Rendite. Beispiel: 7,00 % Bruttorendite minus 0,20 % Fondskosten ergibt 6,80 % Rendite vor persönlichen Steuern.“

#### `depotPlatformFee` – Depot-/Plattformkosten

- **Default:** 0,00 % p. a.
- **Validierung:** 0 % bis 5 % p. a.
- **Hilfetext:**  
  „Laufende Depot- oder Plattformkosten. Viele günstige Depots haben keine prozentualen Depotkosten, aber die Eingabe ermöglicht individuelle Annahmen.“

#### `policyFundFee` – Fondskosten Police

- **Default:** 0,20 % p. a.
- **Validierung:** 0 % bis 5 % p. a.
- **Hilfetext:**  
  „Laufende Kosten des Fonds innerhalb der Rentenpolice. Der Fonds kann derselbe sein wie im Depot; die Fondskosten reduzieren auch hier die Rendite.“

#### `policyAdminFee` – Verwaltungskosten Police

- **Default:** 1,50 % p. a.
- **Validierung:** -5 % bis 5 % p. a.; negative Werte nur für Break-even-Rechnung oder explizite Simulation zulassen.
- **Hilfetext:**  
  „Laufende Kosten des Versicherungsmantels. Dieser Parameter ist einer der wichtigsten Treiber des Ergebnisses. Schon kleine jährliche Kostenunterschiede können über Jahrzehnte sehr große Auswirkungen haben.“

#### `policyOpeningCost` – Abschluss-/Eröffnungskosten Police

- **Default:** 4.000 €
- **Validierung:** >= 0 €
- **Hilfetext:**  
  „Einmalige Kosten der Police bei Vertragsbeginn. Im Default werden diese Kosten zuerst aus den Beiträgen bezahlt. Solange sie noch nicht beglichen sind, wird in der Police kein Kapital investiert.“

#### `policyOpeningCostMode` – Behandlung der Abschlusskosten

- **Default:** Beiträge zahlen zuerst Kosten
- **Optionen:**
  1. Beiträge zahlen zuerst Kosten;
  2. Kosten werden sofort vom Startkapital abgezogen;
  3. Kosten werden über die ersten fünf Jahre verteilt;
  4. Kosten werden separat als Barzahlung behandelt.
- **Hilfetext:**  
  „Legt fest, wie Abschluss-/Eröffnungskosten in der Simulation behandelt werden. Der Default bildet die Vorgabe ab: keine Rendite, bis 4.000 € zusammengespart sind.“

---

### 8.3 Steuerparameter Depot

#### `saverAllowance` – Sparer-Pauschbetrag

- **Default:** 1.000 € p. a.
- **Validierung:** >= 0 €
- **Hilfetext:**  
  „Jährlicher Freibetrag für Kapitalerträge. Im Default wird angenommen, dass der volle Betrag für dieses Depot verfügbar ist. Wird der Freibetrag bereits anderweitig genutzt, sollte der verfügbare Betrag reduziert werden.“

#### `saverAllowanceAvailablePct` – Verfügbarer Anteil des Pauschbetrags

- **Default:** 100 %
- **Validierung:** 0 % bis 100 %
- **Hilfetext:**  
  „Gibt an, wie viel des Sparer-Pauschbetrags für diese Berechnung verfügbar ist. 0 % bedeutet, dass der Freibetrag bereits vollständig anderweitig genutzt wird.“

#### `capitalGainsTaxRate` – Abgeltungsteuer

- **Default:** 25,00 %
- **Validierung:** 0 % bis 60 %
- **Hilfetext:**  
  „Steuersatz für Kapitalerträge im Depot. In Deutschland beträgt die Abgeltungsteuer standardmäßig 25 %. Zusätzlich können Solidaritätszuschlag und Kirchensteuer anfallen.“

#### `solidaritySurchargeRate` – Solidaritätszuschlag

- **Default:** 5,50 % auf die Abgeltungsteuer
- **Validierung:** 0 % bis 10 %
- **Hilfetext:**  
  „Der Solidaritätszuschlag wird auf die Abgeltungsteuer berechnet. Bei 25 % Abgeltungsteuer und 5,5 % Solidaritätszuschlag ergibt sich ohne Kirchensteuer eine Gesamtbelastung von 26,375 % auf steuerpflichtige Kapitalerträge.“

#### `churchTaxRate` – Kirchensteuer

- **Default:** 0,00 %
- **Optionen:** 0 %, 8 %, 9 %, frei editierbar
- **Hilfetext:**  
  „Kirchensteuer kann die Steuerbelastung auf Kapitalerträge erhöhen. Der Default ist 0 %, also keine Kirchensteuer.“

#### `equityFundPartialExemption` – Teilfreistellung Aktienfonds

- **Default:** 30,00 %
- **Validierung:** 0 % bis 100 %
- **Hilfetext:**  
  „Bei Aktienfonds ist ein Teil der Erträge steuerfrei. Im Default werden 30 % Teilfreistellung angesetzt. Dadurch werden nur 70 % bestimmter Fondserträge steuerlich berücksichtigt.“

#### `advanceLumpSumBasisRate` – Basiszins Vorabpauschale

- **Default:** 3,20 %
- **Validierung:** -5 % bis 10 %
- **Hilfetext:**  
  „Basiszins zur Berechnung der Vorabpauschale. Dieser Wert wird jährlich vom Bundesministerium der Finanzen veröffentlicht und kann sich ändern. Deshalb muss er editierbar sein.“

#### `advanceLumpSumEnabled` – Vorabpauschale aktivieren

- **Default:** aktiviert
- **Hilfetext:**  
  „Bei thesaurierenden Fonds kann während der Ansparphase jährlich eine Vorabpauschale steuerlich relevant werden. Die realistische Berechnung berücksichtigt diese laufende Besteuerung; die vereinfachte Berechnung ignoriert sie bis zum Verkauf.“

---

### 8.4 Steuerparameter Rentenpolice

#### `retirementPersonalTaxRate` – Persönlicher Grenzsteuersatz im Alter

- **Default:** 45,00 %
- **Validierung:** 0 % bis 60 %
- **Hilfetext:**  
  „Persönlicher Grenzsteuersatz im Rentenalter. Dieser wird für steuerpflichtige Teile der Police-Kapitalauszahlung und für den Ertragsanteil der privaten Rente verwendet. Je höher der Satz, desto geringer der steuerliche Vorteil der Police.“

#### `policyFundExemption` – 15-%-Freistellung fondsgebundene Police

- **Default:** 15,00 %
- **Validierung:** 0 % bis 100 %
- **Hilfetext:**  
  „Bei fondsgebundenen Lebens-/Rentenversicherungen kann ein Teil des Unterschiedsbetrags steuerfrei sein, soweit dieser aus Investmenterträgen stammt. Der Default bildet eine 15-%-Freistellung ab. Dieser Wert muss editierbar bleiben.“

#### `twelveSixtyTwoRuleEnabled` – 12/62-Regel anwenden

- **Default:** automatisch, wenn erfüllt
- **Hilfetext:**  
  „Bei bestimmten privaten Lebens-/Rentenversicherungen kann bei Kapitalauszahlung nur die Hälfte des steuerlich relevanten Unterschiedsbetrags mit dem persönlichen Steuersatz besteuert werden, wenn die Vertragslaufzeit mindestens zwölf Jahre beträgt und die Auszahlung nach Vollendung des 62. Lebensjahres erfolgt. Die App soll die Bedingung automatisch prüfen und zusätzlich erklärbar machen.“

#### `annuityTaxableEarningsShare` – Ertragsanteil der Privatrente

- **Default:** 17,00 % bei Rentenbeginn mit 67
- **Validierung:** 0 % bis 100 %
- **Hilfetext:**  
  „Bei einer privaten lebenslangen Rente wird nur der gesetzlich definierte Ertragsanteil besteuert. Bei Rentenbeginn mit 67 beträgt der Default 17 %. Die App soll entweder eine Tabelle hinterlegen oder den Wert editierbar machen.“

#### `healthInsuranceMode` – Krankenversicherung im Alter

- **Default:** KVdR
- **Optionen:** KVdR, freiwillig gesetzlich, privat versichert, manuelle Beitragssätze
- **Hilfetext:**  
  „Die Krankenversicherung kann die Nettoauszahlung beeinflussen. Im Default KVdR werden keine zusätzlichen Kranken- und Pflegeversicherungsbeiträge auf private Depot-Kapitalerträge oder die private Police-Rente abgezogen. Bei freiwillig gesetzlicher Versicherung können andere Regeln gelten.“

---

### 8.5 Auszahlungsparameter

#### `payoutMode` – Vergleichsmodus Auszahlung

- **Default:** beide anzeigen
- **Optionen:** Kapitalauszahlung, Rente/Entnahmeplan, beide
- **Hilfetext:**  
  „Legt fest, ob die Einmalauszahlung, die regelmäßige Auszahlung oder beide Varianten verglichen werden.“

#### `policyPensionFactor` – Rentenfaktor Police

- **Default:** 30,00 € je 10.000 € Vertragsguthaben
- **Validierung:** 0 € bis 100 € je 10.000 €
- **Hilfetext:**  
  „Der Rentenfaktor gibt an, wie viel monatliche Bruttorente pro 10.000 € Vertragsguthaben gezahlt wird. Beispiel: 30,00 € Rentenfaktor und 1.000.000 € Vertragsguthaben ergeben 3.000 € Bruttorente pro Monat.“

#### `depotWithdrawalReturn` – Rendite Depot in Rentenphase

- **Default:** gleiche Nettorendite wie Ansparphase
- **Validierung:** -20 % bis 20 % p. a.
- **Hilfetext:**  
  „Angenommene Rendite des Depots während der Entnahmephase. Ein niedrigerer Wert reduziert die mögliche monatliche Entnahme. Die reale Entwicklung kann stark schwanken.“

#### `depotWithdrawalTaxMode` – Besteuerung im Entnahmeplan

- **Default:** anteilige Besteuerung verkaufter Gewinne
- **Hilfetext:**  
  „Im Entnahmeplan wird monatlich ein Teil des Depots verkauft. Steuerpflichtig ist nur der Gewinnanteil des verkauften Betrags nach Teilfreistellung und nach Berücksichtigung des verfügbaren Sparer-Pauschbetrags.“

---

## 9. Berechnungslogik

### 9.1 Allgemeine Zeitlogik

Die Simulation läuft monatlich.

```text
months = (retirementAge - currentAge) * 12
yearIndex = floor(monthIndex / 12)
monthlyContribution(month) = monthlyContributionStart * (1 + contributionGrowthRate) ^ yearIndex
```

Default: Beiträge werden am Monatsende investiert.

```text
monthlyNetReturn = (1 + annualNetReturn) ^ (1 / 12) - 1
```

Für die Modellrechnung gilt:

```text
annualNetReturnDepotBeforePersonalTax = grossAnnualReturn - depotFundFee - depotPlatformFee
annualNetReturnPolicyBeforePersonalTax = grossAnnualReturn - policyFundFee - policyAdminFee
```

### 9.2 Depot: vereinfachte Ansparphase

In der vereinfachten Berechnung werden während der Ansparphase keine laufenden Steuern abgezogen.

Für jeden Monat:

```text
depotValue = depotValue * (1 + monthlyNetReturnDepot)
depotValue += monthlyContribution
costBasis += monthlyContribution
```

Bei Kapitalauszahlung:

```text
gain = max(0, depotValue - costBasis)
taxableGainBeforeAllowance = gain * (1 - equityFundPartialExemption)
availableAllowance = saverAllowance * saverAllowanceAvailablePct
taxableGain = max(0, taxableGainBeforeAllowance - availableAllowance)
taxRate = capitalGainsTaxRate * (1 + solidaritySurchargeRate) + optionalChurchTaxEffect
tax = taxableGain * taxRate
netDepotCapital = depotValue - tax
```

Kirchensteuer kann vereinfacht als zusätzlicher Zuschlag auf die Abgeltungsteuer modelliert werden. Die App soll transparent anzeigen, welche Formel genutzt wird.

### 9.3 Depot: realistische Ansparphase mit Vorabpauschale

Die realistische Berechnung berücksichtigt jährlich die Vorabpauschale bei thesaurierenden Aktienfonds.

Vereinfachtes Modell pro Jahr:

```text
startValue = Depotwert zu Jahresbeginn
endValueBeforeTax = Depotwert zu Jahresende vor Vorabpauschalensteuer
actualIncrease = max(0, endValueBeforeTax - startValue - contributionsDuringYear)
basicReturn = startValue * advanceLumpSumBasisRate * 0.70
advanceLumpSumGross = max(0, min(basicReturn, actualIncrease))
advanceLumpSumTaxableBeforeAllowance = advanceLumpSumGross * (1 - equityFundPartialExemption)
availableAllowanceYear = saverAllowance * saverAllowanceAvailablePct - allowanceAlreadyUsedThisYear
taxableAdvanceLumpSum = max(0, advanceLumpSumTaxableBeforeAllowance - availableAllowanceYear)
taxAdvance = taxableAdvanceLumpSum * capitalGainsTaxTotalRate
```

Die Steuer wird dem Depot entnommen:

```text
depotValue -= taxAdvance
```

Die bereits angesetzte Vorabpauschale erhöht die steuerliche Anschaffungsbasis für den späteren Verkauf:

```text
advanceLumpSumsAccumulated += advanceLumpSumGross
```

Bei finalem Verkauf:

```text
remainingGain = max(0, depotValue - costBasis - advanceLumpSumsAccumulated)
taxableRemainingGainBeforeAllowance = remainingGain * (1 - equityFundPartialExemption)
remainingAllowance = available allowance in sale year, if not consumed
taxableRemainingGain = max(0, taxableRemainingGainBeforeAllowance - remainingAllowance)
finalTax = taxableRemainingGain * capitalGainsTaxTotalRate
netDepotCapital = depotValue - finalTax
```

Hinweis: Die genaue steuerliche Behandlung der Vorabpauschale ist komplex. Die App muss diese Formel als Modellrechnung kenntlich machen und alle Parameter editierbar halten.

### 9.4 Rentenpolice: Ansparphase

Die Police investiert monatlich nach Abzug der Eröffnungskostenlogik.

Defaultlogik:

```text
remainingOpeningCost = policyOpeningCost
for each month:
  contribution = monthlyContribution(month)
  amountForOpeningCost = min(contribution, remainingOpeningCost)
  remainingOpeningCost -= amountForOpeningCost
  investableContribution = contribution - amountForOpeningCost

  policyValue = policyValue * (1 + monthlyNetReturnPolicy)
  policyValue += investableContribution
  policyCostBasis += contribution
```

Wichtig:

- Die gesamten gezahlten Beiträge zählen für den Unterschiedsbetrag grundsätzlich als eingezahlte Beiträge.
- Abschluss-/Eröffnungskosten mindern das Vertragsguthaben beziehungsweise verzögern die Investition.
- In der Ansparphase wird im Default keine persönliche jährliche Steuer auf die Police erhoben.

### 9.5 Rentenpolice: Kapitalauszahlung

```text
differenceAmount = max(0, policyValue - totalContributions)
fundExemptPart = differenceAmount * policyFundExemption
remainingDifference = differenceAmount - fundExemptPart

if twelveSixtyTwoRuleApplies:
  taxablePolicyIncomeBeforeAllowance = remainingDifference * 0.50
else:
  taxablePolicyIncomeBeforeAllowance = remainingDifference

availableAllowance = saverAllowance * saverAllowanceAvailablePct, if applicable in this model
taxablePolicyIncome = max(0, taxablePolicyIncomeBeforeAllowance - availableAllowance)
policyIncomeTax = taxablePolicyIncome * retirementPersonalTaxRate
netPolicyCapital = policyValue - policyIncomeTax
```

Optional:

```text
policySoli = policyIncomeTax * soliOnIncomeTaxRate
netPolicyCapitalWithSoli = policyValue - policyIncomeTax - policySoli
```

Der Solidaritätszuschlag auf persönliche Einkommensteuer soll als optionaler Parameter verfügbar sein, da er vom zu versteuernden Einkommen abhängen kann und nicht immer pauschal sinnvoll modelliert ist.

### 9.6 Police: Rentenzahlung

```text
grossMonthlyPolicyPension = policyValue / 10000 * policyPensionFactor
monthlyTaxablePart = grossMonthlyPolicyPension * annuityTaxableEarningsShare
monthlyIncomeTax = monthlyTaxablePart * retirementPersonalTaxRate
monthlyHealthInsurance = depending on healthInsuranceMode
netMonthlyPolicyPension = grossMonthlyPolicyPension - monthlyIncomeTax - monthlyHealthInsurance
```

Default bei KVdR:

```text
monthlyHealthInsurance = 0
```

### 9.7 Depot: Entnahmeplan bis Zielalter

Ziel: konstante monatliche Netto-Entnahme finden, bei der das Depot am Zielalter rechnerisch 0 € erreicht.

Empfohlene Methode: Binäre Suche auf die monatliche Netto-Entnahme.

Pseudoalgorithmus:

```text
low = 0
high = initialDepotValueAtRetirement / remainingMonths * 5
for i in 1..100:
  candidateNetWithdrawal = (low + high) / 2
  endingBalance = simulateWithdrawalPhase(candidateNetWithdrawal)
  if endingBalance >= 0:
    low = candidateNetWithdrawal
  else:
    high = candidateNetWithdrawal
netMonthlyWithdrawal = low
```

Simulation pro Monat:

```text
depotValue *= (1 + monthlyWithdrawalReturn)

grossSaleNeeded = solve gross sale so that:
  netCash = grossSale - taxOnGrossSale = targetNetWithdrawal

Tax on gross sale:
  saleRatio = grossSale / depotValueBeforeSale
  realizedCostBasis = remainingCostBasis * saleRatio
  realizedAdvanceLumpBasis = remainingAdvanceLumpBasis * saleRatio
  realizedGain = max(0, grossSale - realizedCostBasis - realizedAdvanceLumpBasis)
  taxableGain = realizedGain * (1 - equityFundPartialExemption)
  taxableAfterAllowance = max(0, taxableGain - remainingAllowanceThisYear)
  tax = taxableAfterAllowance * capitalGainsTaxTotalRate

After sale:
  depotValue -= grossSale
  remainingCostBasis -= realizedCostBasis
  remainingAdvanceLumpBasis -= realizedAdvanceLumpBasis
```

Die App muss klar anzeigen: Der Depot-Entnahmeplan ist keine lebenslange Garantie. Er hängt von Renditeannahmen und Zielalter ab.

### 9.8 Break-even-Verwaltungskosten der Police

Ziel: Finden der Verwaltungskostenquote der Police, bei der die Netto-Kapitalauszahlung der Police gleich der Netto-Kapitalauszahlung des Depots ist.

Empfohlene Methode: Binäre Suche.

```text
target = netDepotCapital
low = -0.05
high = 0.05
for i in 1..100:
  mid = (low + high) / 2
  simulatePolicyWithAdminFee(mid)
  if netPolicyCapital > target:
    low = mid  // höhere Kosten möglich
  else:
    high = mid // Kosten zu hoch
breakEvenPolicyAdminFee = (low + high) / 2
```

Die Oberfläche soll negative Break-even-Werte deutlich erklären:

> Ein negativer Break-even-Wert bedeutet, dass die Police selbst bei 0 % Verwaltungskosten rechnerisch nicht gleichauf wäre. Sie müsste einen zusätzlichen jährlichen Bonus oder eine Kostenrückvergütung erhalten.

---

## 10. Erwartete Referenzwerte für den Defaultfall

Die App soll für den Defaultfall ungefähr die folgenden Werte liefern. Kleine Abweichungen sind akzeptabel, wenn sie durch transparente Rundungs- oder Timingannahmen erklärt werden.

### 10.1 Eingaben Defaultfall

```text
Aktuelles Alter: 28
Renteneintritt: 67
Laufzeit: 39 Jahre / 468 Monate
Startkapital: 0 €
Monatliche Sparrate: 600 €
Sparratendynamik: 3 % p. a.
Bruttorendite: 7 % p. a.
Depot-Fondskosten: 0,20 % p. a.
Police-Fondskosten: 0,20 % p. a.
Police-Verwaltungskosten: 1,50 % p. a.
Police-Eröffnungskosten: 4.000 €
Sparer-Pauschbetrag: 1.000 € p. a.
Kirchensteuer: nein
Grenzsteuersatz Alter: 45 %
KV-Status: KVdR
Rentenfaktor: 30,00 € je 10.000 €
Entnahmeplan: bis Alter 90
```

### 10.2 Referenzergebnisse

| Kennzahl | Erwarteter Wert ca. |
|---|---:|
| Summe Einzahlungen | 520.086 € |
| Depotwert vereinfacht vor Steuer | 1.922.428 € |
| Depot netto vereinfacht | 1.663.785 € |
| Depotwert realistisch vor finaler Steuer | 1.786.397 € |
| Depot netto realistisch | 1.634.016 € |
| Police-Vertragsguthaben mit 67 | 1.357.604 € |
| Police netto Kapitalauszahlung | 1.197.879 € |
| Vorteil Depot bei Kapitalauszahlung realistisch | 436.137 € |
| Depot-Entnahme netto monatlich bis 90 | 10.985 € |
| Police-Bruttorente monatlich | 4.073 € |
| Police-Nettorente monatlich | 3.761 € |
| Break-even Verwaltungskosten Police Kapitalauszahlung | ca. -0,06 % p. a. |

Toleranz für Tests: ±0,5 % für komplexe Steuer-/Entnahmeberechnungen; ±0,1 % für einfache Ansparwerte ohne Steuern.

---

## 11. UI-/UX-Anforderungen

### 11.1 Seitenstruktur

Empfohlener Aufbau:

1. **Header / Hero**
   - Titel: „Depot vs. Rentenpolice Rechner“
   - Kurzbeschreibung
   - Hinweis: „Modellrechnung, keine Beratung“

2. **Parameterbereich**
   - Links oder oben als Formular.
   - Gruppiert in Akkordeons:
     - Person & Sparplan
     - Rendite & Kosten
     - Steuern Depot
     - Steuern Rentenpolice
     - Auszahlung & Rente
     - Erweiterte Annahmen

3. **Ergebnis-Dashboard**
   - Große Kennzahlenkarten.
   - Gewinnerhinweis je Auszahlungstyp.
   - Warnhinweise, falls Annahmen extrem sind.

4. **Diagrammbereich**
   - Tabs oder Karten für die Diagramme.

5. **Detailtabellen**
   - Jahreswerte.
   - Steuerdetails.
   - Auszahlungsdetails.

6. **Methodik & Quellen**
   - Formeln.
   - Annahmen.
   - Quellen und Rechtsstand.

### 11.2 Interaktionsanforderungen

- Alle Eingaben müssen mit Tastatur erreichbar sein.
- Eingabefelder müssen sinnvolle Einheiten anzeigen: €, %, Jahre.
- Prozentwerte sollen nutzerfreundlich als „7,00“ angezeigt und intern als `0.07` gerechnet werden.
- Große Zahlen sollen deutsch formatiert werden: `1.634.016 €`.
- Ergebnisse sollen gerundet angezeigt werden, aber intern mit Dezimalwerten gerechnet werden.
- Ein „Reset auf Defaultwerte“-Button muss vorhanden sein.
- Ein „Methodik anzeigen“-Bereich muss vorhanden sein.
- Fehlerhafte Eingaben sollen direkt erklärt werden, nicht erst nach Absenden.
- Bei extremen Eingaben sollen Warnungen erscheinen, zum Beispiel:
  - Verwaltungskosten höher als Rendite;
  - Renteneintrittsalter kleiner als aktuelles Alter;
  - Zielalter Entnahmeplan kleiner/gleich Renteneintrittsalter;
  - negativer Break-even.

### 11.3 Responsives Design

Die Webseite muss auf Desktop, Tablet und Smartphone nutzbar sein.

- Desktop: Parameter links, Ergebnisse rechts oder darunter.
- Mobil: einspaltiges Layout; Akkordeons für Eingaben; Diagramme horizontal scrollbar oder responsiv skaliert.
- Diagrammlegenden müssen auch auf kleinen Bildschirmen lesbar bleiben.

### 11.4 Barrierefreiheit

- Semantisches HTML.
- Labels für alle Eingaben.
- Buttons mit verständlichen Namen.
- Info-Icons per Tastatur erreichbar.
- Ausreichender Farbkontrast.
- Diagramme zusätzlich durch Tabellen oder Textzusammenfassungen interpretierbar.
- Keine reine Farbcodierung ohne Beschriftung.

---

## 12. Validierungsregeln

### 12.1 Allgemein

- Ungültige Werte dürfen nicht stillschweigend akzeptiert werden.
- Bei ungültigen Werten sollen Ergebnisse entweder nicht aktualisiert oder mit Warnhinweisen berechnet werden.
- Es muss klar zwischen Warnung und Fehler unterschieden werden.

### 12.2 Harte Fehler

- Renteneintrittsalter <= aktuelles Alter.
- Zielalter Entnahmeplan <= Renteneintrittsalter.
- Laufzeit <= 0 Monate.
- Nicht-numerische Eingaben.
- Negative Sparrate, falls nicht explizit als Entnahme modelliert.

### 12.3 Warnungen

- Renditeannahme > 12 % p. a.
- Verwaltungskosten Police > 2 % p. a.
- Rentenfaktor < 20 € oder > 45 € je 10.000 €.
- Grenzsteuersatz > 45 %.
- Break-even-Verwaltungskosten < 0 %.
- Depot-Entnahmeplan endet mit 0 € und bietet keine Langlebigkeitsgarantie.

---

## 13. Datenmodell

Empfohlene zentrale Struktur:

```js
const defaultScenario = {
  personal: {
    currentAge: 28,
    retirementAge: 67,
    withdrawalEndAge: 90,
    healthInsuranceMode: 'kvdr'
  },
  contributions: {
    initialCapital: 0,
    monthlyContribution: 600,
    contributionGrowthRate: 0.03,
    contributionTiming: 'endOfMonth'
  },
  returnsAndCosts: {
    grossAnnualReturn: 0.07,
    depotFundFee: 0.002,
    depotPlatformFee: 0,
    policyFundFee: 0.002,
    policyAdminFee: 0.015,
    policyOpeningCost: 4000,
    policyOpeningCostMode: 'contributionsFirst'
  },
  taxes: {
    saverAllowance: 1000,
    saverAllowanceAvailablePct: 1,
    capitalGainsTaxRate: 0.25,
    solidaritySurchargeRate: 0.055,
    churchTaxRate: 0,
    equityFundPartialExemption: 0.30,
    advanceLumpSumBasisRate: 0.032,
    advanceLumpSumEnabled: true,
    retirementPersonalTaxRate: 0.45,
    policyFundExemption: 0.15,
    twelveSixtyTwoRuleMode: 'auto',
    annuityTaxableEarningsShare: 0.17,
    soliOnIncomeTaxEnabled: false,
    soliOnIncomeTaxRate: 0.055
  },
  payout: {
    showCapitalPayout: true,
    showAnnuityPayout: true,
    policyPensionFactorPer10000: 30,
    depotWithdrawalAnnualReturnMode: 'sameAsAccumulation',
    depotWithdrawalAnnualReturn: null
  }
};
```

Empfohlenes Ergebnisobjekt:

```js
const result = {
  summary: {
    totalContributions,
    depotNetCapitalRealistic,
    depotNetCapitalSimplified,
    policyNetCapital,
    capitalDifference,
    depotNetMonthlyWithdrawal,
    policyGrossMonthlyPension,
    policyNetMonthlyPension,
    breakEvenPolicyAdminFee
  },
  accumulation: {
    yearlyRows: [],
    monthlyRows: []
  },
  taxes: {
    depotAdvanceTaxTotal,
    depotFinalTax,
    policyCapitalPayoutTax,
    policyMonthlyPensionTax
  },
  payout: {
    withdrawalRows: [],
    cumulativeDepotWithdrawals,
    cumulativePolicyPensions,
    breakEvenAge
  },
  warnings: []
};
```

---

## 14. Modulstruktur

Empfohlene Dateistruktur:

```text
src/
  main.jsx
  App.jsx
  data/
    defaults.js
    parameterHelpTexts.js
    taxReferenceTables.js
  calculation/
    money.js
    rates.js
    validation.js
    depotSimulation.js
    policySimulation.js
    taxDepot.js
    taxPolicy.js
    withdrawalPlan.js
    breakEven.js
    index.js
  components/
    Layout.jsx
    ParameterPanel.jsx
    ParameterInput.jsx
    InfoTooltip.jsx
    SummaryCards.jsx
    ChartCard.jsx
    ResultsTable.jsx
    Methodology.jsx
    Disclaimer.jsx
  charts/
    AccumulationChart.jsx
    CapitalPayoutChart.jsx
    CompositionChart.jsx
    WithdrawalChart.jsx
    BreakEvenChart.jsx
  styles/
    global.css
```

Falls Vanilla JavaScript genutzt wird, sollen die gleichen fachlichen Module als `.js`-Dateien umgesetzt und über klare Funktionen getrennt werden.

---

## 15. Tests und Qualitätssicherung

### 15.1 Pflicht-Tests

Mindestens folgende Tests sollen vorhanden sein:

1. **Sparraten-Summe**  
   Defaultfall ergibt ca. 520.086 € Einzahlungen.

2. **Depot ohne Steuer**  
   Defaultfall mit 6,80 % Nettorendite vor Steuer und Monatsende-Beiträgen ergibt ca. 1.922.428 € vor Steuer.

3. **Police ohne persönliche Steuer**  
   Defaultfall mit 5,30 % Nettorendite vor Steuer und 4.000 € Kosten zuerst ergibt ca. 1.357.604 € Vertragsguthaben.

4. **Police-Kapitalauszahlung**  
   Defaultfall ergibt ca. 1.197.879 € netto ohne Solidaritätszuschlag auf persönliche Einkommensteuer.

5. **Break-even Verwaltungskosten**  
   Defaultfall ergibt ca. -0,06 % p. a.

6. **Validierung**  
   Renteneintrittsalter <= aktuelles Alter erzeugt Fehler.

7. **Keine Persistenz**  
   Im Code wird weder `localStorage` noch `sessionStorage` noch Cookies genutzt.

### 15.2 Toleranzen

- Einfache Ansparwerte: ±0,1 %.
- Steuer- und Entnahmeplanwerte: ±0,5 %.
- Break-even-Werte: ±0,02 Prozentpunkte.

### 15.3 Manuelle Abnahmekriterien

- Alle Defaultwerte sind sichtbar und editierbar.
- Zu jedem Parameter ist ein Hilfetext vorhanden.
- Änderung eines Parameters aktualisiert Ergebnis und Diagramme.
- Die Seite funktioniert ohne Internetverbindung nach Build, sofern keine Webfonts oder externen Assets nachgeladen werden.
- Die Seite speichert keine Daten dauerhaft.
- Die Ergebniszahlen sind deutsch formatiert.
- Die mobile Ansicht ist bedienbar.

---

## 16. Quellen und Rechtsstand

Die App soll einen Quellenbereich enthalten. Die folgenden Quellen können als Startpunkt aufgeführt werden. Da sich Steuerrecht ändern kann, müssen die Werte in der App editierbar bleiben.

- Einkommensteuergesetz § 20, insbesondere Sparer-Pauschbetrag und Hinweise zu fondsgebundenen Lebensversicherungen:  
  https://www.gesetze-im-internet.de/estg/__20.html
- Einkommensteuergesetz § 32d, gesonderter Steuertarif für Einkünfte aus Kapitalvermögen:  
  https://www.gesetze-im-internet.de/estg/__32d.html
- Investmentsteuergesetz § 18, Vorabpauschale:  
  https://www.gesetze-im-internet.de/invstg_2018/__18.html
- Investmentsteuergesetz § 20, Teilfreistellung:  
  https://www.gesetze-im-internet.de/invstg_2018/__20.html
- Bundesministerium der Finanzen, Basiszins zur Berechnung der Vorabpauschale 2026:  
  https://www.bundesfinanzministerium.de/Content/DE/Downloads/BMF_Schreiben/Steuerarten/Investmentsteuer/2026-01-13-basiszins-berechnung-vorabpauschale.html
- Deutsche Rentenversicherung, Ertragsanteil:  
  https://www.deutsche-rentenversicherung.de/SharedDocs/Glossareintraege/DE/E/ertragsanteil.html
- Finanzverwaltung NRW, Tabelle Ertragsanteil bei lebenslangen Leibrenten:  
  https://www.finanzverwaltung.nrw.de/sites/default/files/asset/document/ertragsanteil_bei_lebenslangen_leibrenten.pdf
- BMF / EStH, Besteuerung von Lebensversicherungserträgen und fondsgebundene Lebensversicherungen:  
  https://ao.bundesfinanzministerium.de/esth/2024/C-Anhaenge/Anhang-22a/I/inhalt.html

Pflichttext im Quellenbereich:

> Rechtsstand und steuerliche Parameter sind modellhaft. Die Webseite ersetzt keine steuerliche Beratung. Bitte prüfe aktuelle Gesetze, BMF-Schreiben und individuelle Vertragsbedingungen.

---

# 17. Direkt nutzbarer Prompt für Claude Code

Der folgende Prompt ist dafür gedacht, direkt in Claude Code verwendet zu werden.

```text
Du bist Claude Code und sollst eine statische Webseite in JavaScript bauen. Ziel ist ein interaktiver Rechner „Depot vs. fondsgebundene Rentenpolice Schicht 3“ für Deutschland.

Bitte setze eine vollständig clientseitige statische Webseite um. Verwende JavaScript, keine Backend-Komponenten und keine dauerhafte Speicherung. Die Webseite darf keine Nutzerkonten, keine Cookies, kein localStorage, kein sessionStorage, keine Analytics und keine Datenbank verwenden. Alle Berechnungen müssen lokal im Browser stattfinden. Optional darf ein manuell ausgelöster JSON-Export/Import angeboten werden, aber keine automatische Speicherung.

Falls das Repository leer ist, erstelle ein Vite-Projekt mit React und JavaScript. Falls bereits eine Struktur existiert, respektiere sie. Nutze für Diagramme Chart.js oder eine vergleichbare gebündelte JavaScript-Bibliothek. Keine externen CDN-Skripte im Produktivbetrieb.

Die Seite soll folgende Hauptbereiche haben:

1. Header mit Titel, Kurzbeschreibung und Hinweis „Modellrechnung, keine Anlage-, Steuer-, Versicherungs- oder Rechtsberatung“.
2. Parameterbereich mit Akkordeons:
   - Person & Sparplan
   - Rendite & Kosten
   - Steuern Depot
   - Steuern Rentenpolice
   - Auszahlung & Rente
   - Erweiterte Annahmen
3. Ergebnis-Dashboard mit großen Kennzahlenkarten.
4. Diagrammbereich mit mehreren Graphen.
5. Detailtabellen für Jahreswerte, Steuern, Kosten und Auszahlungsphase.
6. Methodik- und Quellenbereich.
7. Datenschutzhinweis: „Alle Berechnungen laufen lokal in deinem Browser. Deine Eingaben werden nicht übertragen und nicht dauerhaft gespeichert.“

Alle Parameter müssen individuell editierbar sein. Zu jedem Parameter muss eine detaillierte Erklärung verfügbar sein, zum Beispiel über ein Info-Icon oder ausklappbaren Hilfetext. Erklärungen sollen Bedeutung, Wirkung auf die Berechnung, Defaultwert und typische Hinweise erklären.

Defaultwerte:

- Aktuelles Alter: 28
- Renteneintrittsalter: 67
- Zielalter Depot-Entnahmeplan: 90
- Startkapital: 0 €
- Monatliche Sparrate im ersten Jahr: 600 €
- Sparratendynamik: 3 % p. a.
- Beitragszeitpunkt: Monatsende
- Aktienrendite nominal brutto: 7 % p. a.
- Depot-Fondskosten: 0,20 % p. a.
- Depot-/Plattformkosten: 0 % p. a.
- Police-Fondskosten: 0,20 % p. a.
- Police-Verwaltungskosten: 1,50 % p. a.
- Police-Abschluss-/Eröffnungskosten: 4.000 €
- Police-Eröffnungskostenlogik: Beiträge zahlen zuerst die 4.000 € Kosten; bis dahin wird in der Police kein Kapital investiert.
- Sparer-Pauschbetrag: 1.000 € p. a.
- Verfügbarer Sparer-Pauschbetrag: 100 %
- Abgeltungsteuer: 25 %
- Solidaritätszuschlag auf Abgeltungsteuer: 5,5 %
- Kirchensteuer: 0 %
- Teilfreistellung Aktienfonds Depot: 30 %
- Basiszins Vorabpauschale: 3,20 %
- Vorabpauschale: aktiviert
- Persönlicher Grenzsteuersatz im Alter: 45 %
- 15-%-Freistellung fondsgebundene Police: aktiviert
- 12/62-Regel: automatisch anwenden, wenn Laufzeit mindestens 12 Jahre und Auszahlung nach Vollendung des 62. Lebensjahres erfolgt
- Ertragsanteil private Leibrente bei Rentenbeginn 67: 17 %
- Krankenversicherung im Alter: KVdR, also im Default keine zusätzlichen KV/PV-Abzüge
- Rentenfaktor Police: 30,00 € je 10.000 € Vertragsguthaben
- Depot-Entnahmeplan: konstante monatliche Netto-Entnahme bis Alter 90

Berechnungsanforderungen:

A. Allgemeine Monatslogik

- Simuliere monatlich.
- Laufzeit in Monaten = (Renteneintrittsalter - aktuelles Alter) * 12.
- Monatliche Sparrate im Monat m = Start-Sparrate * (1 + Sparratendynamik) ^ floor(m / 12).
- Default: Beitrag wird am Monatsende investiert.
- Monatliche Rendite = (1 + jährliche Nettorendite)^(1/12) - 1.
- Depot-Nettorendite vor persönlicher Steuer = Bruttorendite - Depot-Fondskosten - Depot-Plattformkosten.
- Police-Nettorendite vor persönlicher Steuer = Bruttorendite - Police-Fondskosten - Police-Verwaltungskosten.

B. Depot vereinfachte Berechnung

- Keine laufende Besteuerung während Ansparphase.
- Am Ende: Gewinn = Depotwert - Einzahlungen.
- Steuerpflichtiger Gewinn = Gewinn * (1 - Teilfreistellung) minus verfügbarer Sparer-Pauschbetrag, mindestens 0.
- Steuer = steuerpflichtiger Gewinn * Gesamtsteuersatz Kapitalerträge.
- Gesamtsteuersatz ohne Kirchensteuer = 25 % * (1 + 5,5 %) = 26,375 %.
- Netto = Depotwert - Steuer.

C. Depot realistische Berechnung mit Vorabpauschale

- Berücksichtige jährlich eine modellhafte Vorabpauschale bei thesaurierenden Aktienfonds.
- Basisertrag = Depotwert zu Jahresbeginn * Basiszins * 0,70.
- Vorabpauschale brutto = min(Basisertrag, positive tatsächliche Wertsteigerung des Jahres), mindestens 0.
- Steuerpflichtig nach Teilfreistellung = Vorabpauschale brutto * (1 - Teilfreistellung).
- Berücksichtige verfügbaren Sparer-Pauschbetrag jährlich.
- Ziehe Steuer aus dem Depotwert ab.
- Sammle die brutto angesetzten Vorabpauschalen als steuerliche Basiserhöhung für den späteren Verkauf.
- Bei Verkauf: versteuere nur den noch nicht durch Vorabpauschalen erfassten Gewinn nach Teilfreistellung und Pauschbetrag.
- Zeige die kumulierte Vorabpauschalensteuer separat an.

D. Rentenpolice Ansparphase

- Police zahlt zu Beginn 4.000 € Eröffnungs-/Abschlusskosten aus Beiträgen.
- Solange die 4.000 € nicht vollständig beglichen sind, wird der entsprechende Beitragsanteil nicht investiert.
- Nach Begleichung werden Beiträge investiert.
- Rendite der Police = Bruttorendite - Fondskosten - Verwaltungskosten.
- Keine persönliche jährliche Steuer in der Ansparphase.

E. Rentenpolice Kapitalauszahlung

- Unterschiedsbetrag = Vertragsguthaben - eingezahlte Beiträge, mindestens 0.
- Bei fondsgebundener Police: 15 % des Unterschiedsbetrags steuerfrei, soweit aus Investmenterträgen stammend.
- Wenn 12/62-Regel erfüllt: danach nur die Hälfte des verbleibenden Unterschiedsbetrags steuerpflichtig.
- Ziehe verfügbaren Sparer-Pauschbetrag ab, sofern im Modell aktiviert.
- Steuer = steuerpflichtiger Betrag * persönlicher Grenzsteuersatz im Alter.
- Netto-Kapital = Vertragsguthaben - Steuer.
- Solidaritätszuschlag auf persönliche Einkommensteuer nur optional modellieren; Default aus.

F. Police-Rente

- Brutto-Monatsrente = Vertragsguthaben / 10.000 * Rentenfaktor.
- Steuerpflichtiger Anteil = Brutto-Monatsrente * Ertragsanteil.
- Einkommensteuer = steuerpflichtiger Anteil * Grenzsteuersatz im Alter.
- Bei KVdR im Default keine zusätzlichen KV/PV-Abzüge.
- Netto-Monatsrente = Brutto-Monatsrente - Einkommensteuer - optionale KV/PV.

G. Depot-Entnahmeplan

- Berechne eine konstante monatliche Netto-Entnahme vom Rentenbeginn bis Zielalter.
- Depot bleibt in der Rentenphase investiert; Default-Rendite entspricht der Depot-Nettorendite vor Steuer aus der Ansparphase.
- Nutze eine binäre Suche, um die monatliche Netto-Entnahme zu finden, bei der das Depot am Zielalter rechnerisch auf 0 € fällt.
- Bei jeder monatlichen Entnahme wird anteilig verkauft.
- Steuerpflichtig ist nur der realisierte Gewinnanteil nach Teilfreistellung und verfügbarem Sparer-Pauschbetrag.
- Zeige deutlich: Der Entnahmeplan ist keine lebenslange Garantie.

H. Break-even-Verwaltungskosten

- Berechne per binärer Suche die Police-Verwaltungskosten p. a., bei denen die Netto-Kapitalauszahlung der Police gleich der realistischen Netto-Kapitalauszahlung des Depots ist.
- Erlaube für die Break-even-Suche negative Kostenwerte, um anzuzeigen, wenn selbst 0 % Verwaltungskosten nicht reichen.
- Erkläre negative Werte verständlich.

Diagramme:

1. Liniendiagramm Vermögensentwicklung Ansparphase:
   - Depotwert vor finaler Steuer
   - Police-Vertragsguthaben
   - kumulierte Einzahlungen
2. Balken- oder Waterfall-Diagramm Netto-Kapitalauszahlung:
   - Depot brutto, Steuer, netto
   - Police brutto, Steuer, netto
3. Gestapelter Balken Zusammensetzung Endwert:
   - Beiträge, Erträge, Steuern, Netto
4. Liniendiagramm Renten-/Entnahmephase:
   - Depotrestwert
   - kumulierte Depot-Entnahmen
   - kumulierte Police-Renten
5. Break-even-Diagramm:
   - Netto-Kapital Police in Abhängigkeit von Verwaltungskosten
   - Referenzlinie Depot-Netto
   - markierter Break-even-Punkt

Erwartete Referenzwerte für den Defaultfall, mit Toleranzen:

- Summe Einzahlungen: ca. 520.086 €
- Depotwert vereinfacht vor Steuer: ca. 1.922.428 €
- Depot netto vereinfacht: ca. 1.663.785 €
- Depotwert realistisch vor finaler Steuer: ca. 1.786.397 €
- Depot netto realistisch: ca. 1.634.016 €
- Police-Vertragsguthaben mit 67: ca. 1.357.604 €
- Police netto Kapitalauszahlung: ca. 1.197.879 €
- Vorteil Depot bei Kapitalauszahlung realistisch: ca. 436.137 €
- Depot-Entnahme netto monatlich bis 90: ca. 10.985 €
- Police-Bruttorente monatlich: ca. 4.073 €
- Police-Nettorente monatlich: ca. 3.761 €
- Break-even Verwaltungskosten Police Kapitalauszahlung: ca. -0,06 % p. a.

Toleranzen:

- Einfache Ansparwerte: ±0,1 %.
- Steuer- und Entnahmeplanwerte: ±0,5 %.
- Break-even: ±0,02 Prozentpunkte.

UI-Anforderungen:

- Responsive Layout für Desktop, Tablet und Smartphone.
- Deutsche Formatierung für Geldbeträge und Prozentwerte.
- Ergebniswerte als gut lesbare Karten.
- Eingaben mit Labels, Einheiten und Validierung.
- Jeder Parameter mit Hilfetext.
- Reset-Button auf Defaultwerte.
- Methodikbereich mit Formeln.
- Quellenbereich mit Steuerrechtsquellen.
- Barrierearm: semantisches HTML, Tastaturbedienung, ausreichender Kontrast, Diagrammdaten zusätzlich als Tabellen.

Validierung:

- Renteneintrittsalter muss größer als aktuelles Alter sein.
- Zielalter Entnahmeplan muss größer als Renteneintrittsalter sein.
- Sparrate darf nicht negativ sein.
- Prozentwerte müssen in sinnvollen Grenzen liegen.
- Bei negativen Break-even-Kosten Warnhinweis anzeigen.

Tests:

- Lege Tests für die Kernberechnungen an.
- Prüfe, dass die Referenzwerte im Defaultfall innerhalb der Toleranzen liegen.
- Prüfe Validierungen.
- Prüfe, dass im Code kein localStorage, sessionStorage oder document.cookie verwendet wird.

Bitte implementiere die Seite sauber strukturiert mit getrennten Berechnungsmodulen. Gib am Ende eine kurze README mit Start-, Build- und Testbefehlen aus.
```

---

## 18. Optionale Erweiterungen für spätere Versionen

Diese Punkte sind nicht zwingend für Version 1, aber sinnvoll:

1. Inflationsbereinigte Darstellung in heutiger Kaufkraft.
2. Rendite-Szenarien mit pessimistischer, neutraler und optimistischer Rendite.
3. Monte-Carlo-Simulation für schwankende Kapitalmärkte.
4. Separate Modellierung von Ausschüttungen statt nur thesaurierender Fonds.
5. Vergleich mit Rürup, Riester oder betrieblicher Altersvorsorge.
6. Steuerliche Szenarien für unterschiedliche Grenzsteuersätze im Alter.
7. Varianten für freiwillige gesetzliche Krankenversicherung.
8. Manuell wählbare Rentengarantiezeit und Todesfallleistung.
9. Export der Ergebnisse als PDF, ohne Nutzerdaten an einen Server zu senden.
10. URL-Parameter nur auf ausdrücklichen Nutzerwunsch, falls später eine teilbare Simulation gewünscht wird. Dabei klar darauf hinweisen, dass Parameter in der URL sichtbar sind.

---

## 19. Abschlussdefinition für Version 1

Version 1 gilt als fachlich abgeschlossen, wenn:

- alle Defaultparameter enthalten sind;
- alle Parameter editierbar sind;
- jeder Parameter eine Erklärung hat;
- die Defaultberechnung die Referenzwerte ungefähr trifft;
- die Kapitalauszahlung und Renten-/Entnahmevariante verglichen werden;
- mindestens fünf Diagramme vorhanden sind;
- die Seite keine Daten dauerhaft speichert;
- die Seite responsive und barrierearm nutzbar ist;
- Methodik, Quellen und Disclaimer sichtbar sind.
