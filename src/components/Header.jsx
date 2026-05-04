export default function Header() {
  return (
    <header className="app-header">
      <div className="header-inner">
        <h1>Depot vs. Rentenpolice Schicht&nbsp;3</h1>
        <p className="header-subtitle">
          Interaktiver Vergleichsrechner für Deutschland – Aktiendepot gegen fondsgebundene Rentenversicherung
        </p>
        <div className="disclaimer-banner" role="note">
          <strong>Hinweis:</strong> Diese Berechnung ist eine vereinfachte Modellrechnung und keine Anlage-,
          Steuer-, Versicherungs- oder Rechtsberatung. Steuerregeln, Produktbedingungen, Kosten, Rentenfaktoren
          und persönliche Umstände können sich ändern. Prüfe konkrete Entscheidungen mit einer qualifizierten Fachperson.
        </div>
      </div>
    </header>
  )
}
