import { useEffect } from 'react'
import { legalData } from '../legal/legalData.js'

function Impressum() {
  return (
    <div className="legal-content">
      <section className="legal-section">
        <h3>Angaben gemäß § 5 TMG</h3>
        <p>{legalData.name}<br />{legalData.street}<br />{legalData.zip} {legalData.city}</p>
      </section>

      <section className="legal-section">
        <h3>Kontakt</h3>
        {legalData.phone && <p>Telefon: {legalData.phone}</p>}
        {legalData.email && (
          <p>E-Mail: <a href={`mailto:${legalData.email}`} className="legal-link">{legalData.email}</a></p>
        )}
        {legalData.website && (
          <p>Website: <a href={legalData.website} target="_blank" rel="noopener noreferrer" className="legal-link">{legalData.website}</a></p>
        )}
      </section>

      <section className="legal-section">
        <h3>Haftungsausschluss</h3>
        <p>
          Diese Webseite ist ein privates Freizeitprojekt ohne kommerziellen Hintergrund.
          Die bereitgestellten Informationen und Berechnungen dienen ausschließlich der allgemeinen
          Orientierung und ersetzen keine individuelle Finanz-, Steuer- oder Rechtsberatung.
          Es besteht kein Anspruch auf Vollständigkeit, Richtigkeit oder Aktualität.
        </p>
      </section>

      <section className="legal-section">
        <h3>Urheberrecht</h3>
        <p>
          Die durch den Betreiber erstellten Inhalte und Werke auf dieser Seite unterliegen dem
          deutschen Urheberrecht. Diese Webseite ist ein unabhängiges Privatprojekt und steht in
          keiner Verbindung zu Finanzinstituten, Versicherungsunternehmen oder sonstigen
          Markeninhabern der in diesem Rechner verwendeten Begriffe und Produktbezeichnungen.
        </p>
      </section>
    </div>
  )
}

function Datenschutz() {
  return (
    <div className="legal-content">
      <div className="legal-privacy-callout">
        🔒 <strong>Datenschutz auf einen Blick:</strong> Alle Berechnungen laufen lokal in
        Ihrem Browser. Ihre Eingaben werden nicht übertragen und nicht dauerhaft gespeichert.
      </div>

      <section className="legal-section">
        <h3>1. Verantwortlicher</h3>
        <p>
          {legalData.name}<br />
          {legalData.street}<br />
          {legalData.zip} {legalData.city}
        </p>
        {legalData.email && (
          <p>E-Mail: <a href={`mailto:${legalData.email}`} className="legal-link">{legalData.email}</a></p>
        )}
      </section>

      <section className="legal-section">
        <h3>2. Datenverarbeitung durch den Betreiber</h3>
        <p>
          Der Betreiber dieser Webseite erhebt und speichert selbst keine personenbezogenen Daten.
          Es werden keine Cookies gesetzt, kein Tracking durchgeführt und keine Nutzerdaten gespeichert
          oder an Dritte weitergegeben. Alle Berechnungen laufen ausschließlich lokal in Ihrem Browser
          ab und verlassen Ihr Gerät nicht.
        </p>
        <p>
          <em>Hinweis:</em> Beim Abruf der Webseite verarbeitet der Hosting-Anbieter technisch bedingt
          Verbindungsdaten (u. a. Ihre IP-Adresse). Dieser Vorgang liegt außerhalb des Einflussbereichs
          des Betreibers und wird im folgenden Abschnitt erläutert.
        </p>
      </section>

      <section className="legal-section">
        <h3>3. Hosting (GitHub Pages)</h3>
        <p>
          Diese Webseite wird über <strong>GitHub Pages</strong> (GitHub Inc., 88 Colin P. Kelly Jr.
          Street, San Francisco, CA 94107, USA; ein Unternehmen der Microsoft Corporation) bereitgestellt.
          Beim Aufruf der Seite verarbeitet GitHub als technischer Dienstleister Verbindungsdaten —
          insbesondere Ihre IP-Adresse —, um die Webseite auszuliefern. Für die Bereitstellung wird
          das Fastly-CDN eingesetzt, wodurch die Auslieferung ggf. über Server in verschiedenen Ländern
          erfolgt.
        </p>
        <p>
          GitHub Inc. ist nach dem <strong>EU-US Data Privacy Framework</strong> zertifiziert.
          Rechtsgrundlage für die Verarbeitung durch GitHub ist Art. 6 Abs. 1 lit. f DSGVO
          (berechtigtes Interesse an der Bereitstellung der Webseite). Der Betreiber hat auf
          Inhalt und Umfang dieser Verarbeitung keinen Einfluss.
        </p>
        <p>
          Weitere Informationen:{' '}
          <a
            href="https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            GitHub Datenschutzerklärung
          </a>
        </p>
      </section>

      <section className="legal-section">
        <h3>4. Ihre Rechte</h3>
        <p>
          Nach der DSGVO stehen Ihnen gegenüber dem Verantwortlichen folgende Rechte zu: Auskunft
          (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung
          (Art. 18) sowie Widerspruch gegen die Verarbeitung (Art. 21). Da der Betreiber dieser
          Webseite selbst keine personenbezogenen Daten verarbeitet, ist eine Anfrage an ihn
          insoweit gegenstandslos.
        </p>
        <p>
          Für Verbindungsdaten, die durch den Hosting-Anbieter verarbeitet werden, wenden Sie sich
          bitte direkt an <strong>GitHub Inc.</strong> (siehe Abschnitt 3).
        </p>
        <p>
          Sie haben außerdem das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren.
          Zuständig für Bayern ist der{' '}
          <strong>Bayerische Landesbeauftragte für den Datenschutz (BayLfD)</strong>:{' '}
          <a
            href="https://www.datenschutz-bayern.de"
            target="_blank"
            rel="noopener noreferrer"
            className="legal-link"
          >
            www.datenschutz-bayern.de
          </a>
        </p>
      </section>
    </div>
  )
}

export function LegalModal({ view, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  return (
    <div
      className="legal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={view === 'impressum' ? 'Impressum' : 'Datenschutzerklärung'}
    >
      <div className="legal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal-header">
          <h2>{view === 'impressum' ? 'Impressum' : 'Datenschutzerklärung'}</h2>
          <button className="legal-close-btn" onClick={onClose} aria-label="Schließen">
            &times;
          </button>
        </div>
        <div className="legal-modal-body">
          {view === 'impressum' ? <Impressum /> : <Datenschutz />}
        </div>
      </div>
    </div>
  )
}
