import { useState, useMemo } from 'react'
import Header from './components/Header.jsx'
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
        <p>
          🔒 <strong>Datenschutz:</strong> Alle Berechnungen laufen lokal in deinem Browser.
          Deine Eingaben werden nicht übertragen und nicht dauerhaft gespeichert.
        </p>
      </footer>
    </div>
  )
}
