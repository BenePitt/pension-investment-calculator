import KpiCard from './KpiCard.jsx'
import { formatEuro, formatPercentPt } from '../../utils/formatters.js'

export default function Dashboard({ results }) {
  if (!results) return null

  const { depotSimplified, depotRealistic, policeAccumulation, policePayout, policeRente, entnahme, breakeven } = results

  const vorteilDepot = depotRealistic.netValue - policePayout.netto
  const breakevenNegative = breakeven.breakevenKosten < 0

  return (
    <section className="dashboard" aria-label="Ergebnis-Dashboard">
      <h2>Ergebnisse</h2>

      <div className="kpi-section-title">Einzahlungen & Depotwert</div>
      <div className="kpi-grid">
        <KpiCard
          label="Summe Einzahlungen"
          value={formatEuro(depotSimplified.totalContributions)}
          sub={`Laufzeit: ${results.params.renteneintrittsalter - results.params.alterAktuell} Jahre`}
        />
        <KpiCard
          label="Depotwert vor Steuer (vereinfacht)"
          value={formatEuro(depotSimplified.depotwert)}
          sub={`Netto: ${formatEuro(depotSimplified.netValue)}`}
        />
        <KpiCard
          label="Depotwert vor Steuer (realistisch)"
          value={formatEuro(depotRealistic.depotwert)}
          sub={`Netto: ${formatEuro(depotRealistic.netValue)} · VP-Steuer: ${formatEuro(depotRealistic.cumulativeVorabpauschalensteuer)}`}
        />
        <KpiCard
          label="Police-Vertragsguthaben"
          value={formatEuro(policeAccumulation.contractValue)}
          sub={`Netto (Kapitalauszahlung): ${formatEuro(policePayout.netto)}`}
        />
      </div>

      <div className="kpi-section-title">Vorteil & Vergleich</div>
      <div className="kpi-grid">
        <KpiCard
          label="Vorteil Depot (realistisch) ggü. Police"
          value={formatEuro(vorteilDepot)}
          sub="bei Kapitalauszahlung"
          accent={vorteilDepot > 0}
        />
        <KpiCard
          label="Break-even Verwaltungskosten"
          value={formatPercentPt(breakeven.breakevenKosten) + ' p. a.'}
          sub={breakevenNegative
            ? '⚠ Negativ: Depot besser selbst bei 0 % Police-Kosten'
            : 'Police kostenlos genug für Gleichstand'}
          warning={breakevenNegative}
        />
      </div>

      <div className="kpi-section-title">Entnahme- & Rentenphase</div>
      <div className="kpi-grid">
        <KpiCard
          label="Depot-Entnahme netto/Monat"
          value={formatEuro(entnahme.monthlyNetWithdrawal)}
          sub={`bis Alter ${results.params.zielalterEntnahme} · kein garantierter Wert`}
        />
        <KpiCard
          label="Police-Bruttorente/Monat"
          value={formatEuro(policeRente.bruttoMonatsrente)}
          sub={`Netto: ${formatEuro(policeRente.nettoMonatsrente)} · Ertragsanteil: ${(results.params.ertragsanteil * 100).toFixed(0)} %`}
        />
      </div>
    </section>
  )
}
