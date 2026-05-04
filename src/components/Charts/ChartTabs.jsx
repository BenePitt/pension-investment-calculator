import { useState } from 'react'
import WealthGrowthChart from './WealthGrowthChart.jsx'
import PayoutCompareChart from './PayoutCompareChart.jsx'
import EntnahmeChart from './EntnahmeChart.jsx'
import BreakevenChart from './BreakevenChart.jsx'

const TABS = [
  { id: 'wealth', label: 'Vermögensentwicklung' },
  { id: 'payout', label: 'Kapitalauszahlung' },
  { id: 'entnahme', label: 'Entnahmephase' },
  { id: 'breakeven', label: 'Break-even' },
]

export default function ChartTabs({ results }) {
  const [active, setActive] = useState('wealth')

  return (
    <section className="chart-tabs-section" aria-label="Diagramme">
      <h2>Diagramme</h2>
      <div className="tab-bar" role="tablist" aria-label="Diagrammauswahl">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            className={`tab-btn${active === tab.id ? ' tab-btn--active' : ''}`}
            onClick={() => setActive(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" aria-label={TABS.find((t) => t.id === active)?.label}>
        {active === 'wealth' && <WealthGrowthChart results={results} />}
        {active === 'payout' && <PayoutCompareChart results={results} />}
        {active === 'entnahme' && <EntnahmeChart results={results} />}
        {active === 'breakeven' && <BreakevenChart results={results} />}
      </div>
    </section>
  )
}
