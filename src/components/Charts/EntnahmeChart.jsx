import { Line } from 'react-chartjs-2'
import { COLORS, commonLineOptions } from '../../utils/chartConfig.js'
import { formatEuro } from '../../utils/formatters.js'

export default function EntnahmeChart({ results }) {
  if (!results) return null

  const { entnahme, policeRente, params } = results
  const startAge = params.renteneintrittsalter

  const labels = entnahme.yearlyData.map((y) => `Alter ${startAge + y.year - 1}`)

  let cumDepotWithdrawal = 0
  let cumPoliceRente = 0
  const cumDepotData = []
  const cumPoliceData = []

  for (const y of entnahme.yearlyData) {
    cumDepotWithdrawal += y.annualNetWithdrawal
    cumPoliceRente += policeRente.nettoMonatsrente * 12
    cumDepotData.push(cumDepotWithdrawal)
    cumPoliceData.push(cumPoliceRente)
  }

  const data = {
    labels,
    datasets: [
      {
        label: 'Depot-Restwert',
        data: entnahme.yearlyData.map((y) => y.depotValue),
        borderColor: COLORS.depot,
        backgroundColor: COLORS.depotLight,
        fill: true,
        tension: 0.2,
        pointRadius: 2,
        yAxisID: 'y',
      },
      {
        label: 'Kumulierte Depot-Entnahmen (netto)',
        data: cumDepotData,
        borderColor: COLORS.contributions,
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.1,
        borderDash: [4, 4],
        pointRadius: 0,
        yAxisID: 'y',
      },
      {
        label: 'Kumulierte Police-Renten (netto)',
        data: cumPoliceData,
        borderColor: COLORS.police,
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.1,
        borderDash: [2, 4],
        pointRadius: 0,
        yAxisID: 'y',
      },
    ],
  }

  const options = {
    ...commonLineOptions,
    plugins: {
      ...commonLineOptions.plugins,
      legend: { position: 'bottom' },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ${formatEuro(ctx.raw)}`,
        },
      },
    },
  }

  return (
    <figure className="chart-container" aria-label="Renten- und Entnahmephase">
      <figcaption className="chart-title">Entnahme- und Rentenphase (Alter {startAge}–{params.zielalterEntnahme})</figcaption>
      <div className="chart-note">⚠ Der Entnahmeplan ist keine lebenslange Garantie. Das Depot kann früher aufgebraucht sein.</div>
      <div className="chart-wrapper">
        <Line data={data} options={options} />
      </div>
    </figure>
  )
}
