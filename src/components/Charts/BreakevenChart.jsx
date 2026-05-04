import { Line } from 'react-chartjs-2'
import { COLORS } from '../../utils/chartConfig.js'
import { formatEuro, formatPercentPt } from '../../utils/formatters.js'

export default function BreakevenChart({ results }) {
  if (!results) return null

  const { breakeven } = results
  const { chartData, breakevenKosten } = breakeven

  const labels = chartData.map((d) => `${(d.verwaltungskosten * 100).toFixed(1)} %`)

  const data = {
    labels,
    datasets: [
      {
        label: 'Police-Netto (Kapitalauszahlung)',
        data: chartData.map((d) => d.policeNetto),
        borderColor: COLORS.police,
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.2,
        pointRadius: 0,
      },
      {
        label: 'Depot netto realistisch (Referenz)',
        data: chartData.map((d) => d.depotNetto),
        borderColor: COLORS.depot,
        backgroundColor: 'transparent',
        fill: false,
        borderDash: [4, 4],
        tension: 0,
        pointRadius: 0,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          title: (items) => `Verwaltungskosten: ${items[0].label}`,
          label: (ctx) => `${ctx.dataset.label}: ${formatEuro(ctx.raw)}`,
        },
      },
      annotation: {},
    },
    scales: {
      x: {
        title: { display: true, text: 'Police-Verwaltungskosten p. a.' },
        ticks: { maxTicksLimit: 7 },
      },
      y: {
        ticks: {
          callback: (v) => new Intl.NumberFormat('de-DE', { notation: 'compact', maximumFractionDigits: 0 }).format(v) + ' €',
        },
      },
    },
  }

  const isNegative = breakevenKosten < 0

  return (
    <figure className="chart-container" aria-label="Break-even-Diagramm Verwaltungskosten">
      <figcaption className="chart-title">
        Break-even: Police-Verwaltungskosten vs. Depot
      </figcaption>
      <div className={`chart-note ${isNegative ? 'chart-note--warning' : ''}`}>
        Break-even-Verwaltungskosten: <strong>{formatPercentPt(breakevenKosten)} p. a.</strong>
        {isNegative && ' – Selbst bei 0 % Kosten ist das Depot besser (negative Kosten nötig für Gleichstand).'}
        {!isNegative && ` – Bei ≤ ${formatPercentPt(breakevenKosten)} Verwaltungskosten ist die Police vorteilhaft.`}
      </div>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </figure>
  )
}
