export default function Methodik() {
  return (
    <section className="methodik-section" aria-label="Methodik und Formeln">
      <h2>Methodik &amp; Formeln</h2>

      <details>
        <summary>Monatliche Akkumulation</summary>
        <div className="methodik-content">
          <p><strong>Laufzeit:</strong> (Renteneintrittsalter − aktuelles Alter) × 12 Monate</p>
          <p><strong>Sparrate Monat m:</strong> Startsparrate × (1 + Sparratendynamik)<sup>⌊m/12⌋</sup></p>
          <p><strong>Monatliche Rendite:</strong> (1 + Jahresnettorendite)<sup>1/12</sup> − 1</p>
          <p><strong>Beitragszeitpunkt:</strong> Monatsende – erst Zinseszins, dann Einzahlung</p>
        </div>
      </details>

      <details>
        <summary>Depot (vereinfacht)</summary>
        <div className="methodik-content">
          <p>Keine laufende Besteuerung. Am Ende:</p>
          <ul>
            <li>Gewinn = Depotwert − Einzahlungen</li>
            <li>Steuerpflichtiger Gewinn = max(0, Gewinn × (1 − Teilfreistellung) − Sparer-PB)</li>
            <li>Steuer = Steuerpfl. Gewinn × 26,375 %</li>
            <li>Netto = Depotwert − Steuer</li>
          </ul>
        </div>
      </details>

      <details>
        <summary>Depot (realistisch, mit Vorabpauschale)</summary>
        <div className="methodik-content">
          <ul>
            <li>Basisertrag = Depotwert Jahresbeginn × Basiszins × 70 %</li>
            <li>Vorabpauschale = min(Basisertrag, max(0, Jahresgewinn))</li>
            <li>Steuerpfl. VP = max(0, VP × (1 − TF) − Sparer-PB) × 26,375 %</li>
            <li>VP erhöht die steuerliche Bemessungsgrundlage (Kostenbasis) für den Endverkauf</li>
            <li>Endverkauf: nur der durch VPs nicht bereits erfasste Gewinn wird versteuert</li>
          </ul>
        </div>
      </details>

      <details>
        <summary>Rentenpolice</summary>
        <div className="methodik-content">
          <p><strong>Anspar:</strong> Erste Beiträge begleichen Eröffnungskosten (4.000 € Standard). Danach voll investiert. Keine jährliche Steuer.</p>
          <p><strong>Kapitalauszahlung:</strong></p>
          <ul>
            <li>Unterschiedsbetrag = max(0, Guthaben − Einzahlungen)</li>
            <li>15 %-Freistellung bei fondsgebundener Police (§ 20 Abs. 1 Nr. 6 EStG)</li>
            <li>12/62-Regel: Hälfte des verbleibenden Betrags steuerfrei</li>
            <li>Steuer = Steuerpflichtiger Rest × Grenzsteuersatz (45 % Default)</li>
          </ul>
          <p><strong>Rente:</strong></p>
          <ul>
            <li>Bruttorente = Guthaben / 10.000 × Rentenfaktor</li>
            <li>Steuerpflichtig = Bruttorente × Ertragsanteil (17 % bei Beginn 67)</li>
          </ul>
        </div>
      </details>

      <details>
        <summary>Depot-Entnahmeplan</summary>
        <div className="methodik-content">
          <p>Binäre Suche findet konstante monatliche Netto-Entnahme, bei der das Depot am Zielalter auf 0 € fällt. Anteiliger Verkauf: nur der Gewinnanteil (nach TF und Sparer-PB) ist steuerpflichtig.</p>
        </div>
      </details>

      <details>
        <summary>Break-even-Verwaltungskosten</summary>
        <div className="methodik-content">
          <p>Binäre Suche über die Police-Verwaltungskosten (−5 % bis +10 %), bei denen Police-Netto = Depot-Netto (realistisch). Negative Werte bedeuten: selbst bei 0 % Kosten ist das Depot besser – ein Subsidy wäre nötig.</p>
        </div>
      </details>

      <details>
        <summary>Vereinfachungen &amp; Grenzen des Modells</summary>
        <div className="methodik-content">
          <ul>
            <li>Konstante durchschnittliche Rendite (kein Sequenzrisiko)</li>
            <li>Keine Inflation explizit modelliert</li>
            <li>Vereinfachte steuerliche Behandlung (z. B. keine Kirchensteuer auf EstG-Einkünfte)</li>
            <li>Keine individuelle Produktprüfung konkreter Versicherungstarife</li>
            <li>Keine Todesfallleistungen oder Vererbung</li>
            <li>Rentenfaktor ist nicht garantiert – kann sich ändern</li>
          </ul>
        </div>
      </details>
    </section>
  )
}
