import { useState, useMemo } from 'react'
import Header from './components/Header.jsx'
import { LegalModal } from './components/LegalModal.jsx'
import { legalData } from './legal/legalData.js'
import ParameterPanel from './components/ParameterPanel/ParameterPanel.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import ChartTabs from './components/Charts/ChartTabs.jsx'
import JahreswertTabelle from './components/Tables/JahreswertTabelle.jsx'
import EntnahmeTabelle from './components/Tables/EntnahmeTabelle.jsx'
import Methodik from './components/Methodik.jsx'
import Quellen from './components/Quellen.jsx'
import { DEFAULTS } from './calculations/defaults.js'
import { runAllCalculations } from './calculations/index.js'

function validate(params) {
  const errors = []
  if (params.renteneintrittsalter <= params.alterAktuell)
    errors.push('Renteneintrittsalter muss größer als aktuelles Alter sein.')
  if (params.zielalterEntnahme <= params.renteneintrittsalter)
    errors.push('Zielalter Entnahmeplan muss größer als Renteneintrittsalter sein.')
  if (params.monatlicheSparrate < 0)
    errors.push('Monatliche Sparrate darf nicht negativ sein.')
  if (params.bruttofondrendite < 0 || params.bruttofondrendite > 0.5)
    errors.push('Rendite muss zwischen 0 % und 50 % liegen.')
  return errors
}

export default function App() {
  const [params, setParams] = useState({ ...DEFAULTS })
  const [legalView, setLegalView] = useState(null)

  function handleChange(key, value) {
    setParams((prev) => ({ ...prev, [key]: value }))
  }

  function handleReset() {
    setParams({ ...DEFAULTS })
  }

  const errors = useMemo(() => validate(params), [params])

  const results = useMemo(() => {
    if (errors.length > 0) return null
    return runAllCalculations(params)
  }, [params, errors])

  return (
    <div className="app">
      <Header />
      <main className="app-main">
        <ParameterPanel params={params} onChange={handleChange} onReset={handleReset} />
        <div className="results-column">
          {errors.length > 0 && (
            <div className="validation-errors" role="alert">
              {errors.map((e, i) => (
                <p key={i} className="validation-error">{e}</p>
              ))}
            </div>
          )}
          {results && (
            <>
              <Dashboard results={results} />
              <ChartTabs results={results} />
              <section className="tables-section" aria-label="Detailtabellen">
                <h2>Detailtabellen</h2>
                <JahreswertTabelle results={results} />
                <EntnahmeTabelle results={results} />
              </section>
              <Methodik />
              <Quellen />
            </>
          )}
        </div>
      </main>
      <footer className="app-footer">
        <div className="footer-inner">
          <p className="footer-privacy-note">
            🔒 <strong>Datenschutz:</strong> Alle Berechnungen laufen lokal in deinem Browser.
            Deine Eingaben werden nicht übertragen und nicht dauerhaft gespeichert.
          </p>
          <div className="footer-meta">

            {legalData.website ? (
              <a
                href={legalData.website}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-branding"
              >
                <img
                  src={`${import.meta.env.BASE_URL}assets/veit-bds-logo.png`}
                  alt="Veit-BDS"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <span>Gebaut von <strong>Veit-BDS</strong></span>
              </a>
            ) : (
              <div className="footer-branding">
                <img
                  src={`${import.meta.env.BASE_URL}assets/veit-bds-logo.png`}
                  alt="Veit-BDS"
                  onError={(e) => { e.currentTarget.style.display = 'none' }}
                />
                <span>Gebaut von <strong>Veit-BDS</strong></span>
              </div>
            )}

            {(legalData.name || legalData.email) && (
              <div className="footer-legal-links">
                <button
                  className="footer-legal-btn"
                  onClick={() => setLegalView('impressum')}
                >
                  Impressum
                </button>
                <button
                  className="footer-legal-btn"
                  onClick={() => setLegalView('datenschutz')}
                >
                  Datenschutz
                </button>
              </div>
            )}

          </div>
        </div>
      </footer>

      {legalView && (
        <LegalModal view={legalView} onClose={() => setLegalView(null)} />
      )}
    </div>
  )
}
