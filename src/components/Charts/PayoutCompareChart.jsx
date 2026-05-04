import { Bar } from 'react-chartjs-2'
import { COLORS } from '../../utils/chartConfig.js'

export default function PayoutCompareChart({ results }) {
  if (!results) return null

  const { depotSimplified, depotRealistic, policeAccumulation, policePayout } = results

  const fmt = (v) => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v)

  const data = {
    labels: ['Depot vereinfacht', 'Depot realistisch', 'Rentenpolice'],
    datasets: [
      {
        label: 'Netto (nach Steuer)',
        data: [depotSimplified.netValue, depotRealistic.netValue, policePayout.netto],
        backgroundColor: [COLORS.depot, COLORS.depotRealistic, COLORS.police],
        borderColor: [COLORS.depot, COLORS.depotRealistic, COLORS.police],
        borderWidth: 1,
      },
      {
        label: 'Steuer',
        data: [depotSimplified.tax, depotRealistic.tax + depotRealistic.cumulativeVorabpauschalensteuer, policePayout.tax],
        backgroundColor: [COLORS.tax, COLORS.tax, COLORS.tax],
        borderColor: [COLORS.tax, COLORS.tax, COLORS.tax],
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${fmt(ctx.raw)}`,
        },
      },
    },
    scales: {
      x: { stacked: true },
      y: {
        stacked: true,
        ticks: {
          callback: (v) => new Intl.NumberFormat('de-DE', { notation: 'compact', maximumFractionDigits: 1 }).format(v) + ' €',
        },
      },
    },
  }

  return (
    <figure className="chart-container" aria-label="Netto-Kapitalauszahlung im Vergleich">
      <figcaption className="chart-title">Netto-Kapitalauszahlung (gestapelt: Netto + Steuer = Brutto)</figcaption>
      <div className="chart-wrapper">
        <Bar data={data} options={options} />
      </div>
    </figure>
  )
}
