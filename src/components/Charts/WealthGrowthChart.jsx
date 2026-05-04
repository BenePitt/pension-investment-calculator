import { Line } from 'react-chartjs-2'
import { COLORS, commonLineOptions } from '../../utils/chartConfig.js'

export default function WealthGrowthChart({ results }) {
  if (!results) return null

  const { depotSimplified, depotRealistic, policeAccumulation } = results
  const years = depotRealistic.yearlyData.map((y) => `Jahr ${y.year}`)

  const data = {
    labels: years,
    datasets: [
      {
        label: 'Depot realistisch (vor finaler Steuer)',
        data: depotRealistic.yearlyData.map((y) => y.depotwertEOY),
        borderColor: COLORS.depot,
        backgroundColor: COLORS.depotLight,
        fill: false,
        tension: 0.2,
        pointRadius: 2,
      },
      {
        label: 'Depot vereinfacht (vor finaler Steuer)',
        data: depotSimplified.yearlyData ? depotSimplified.yearlyData.map((y) => y.depotwertEOY) : [],
        borderColor: COLORS.depotRealistic,
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.2,
        borderDash: [4, 4],
        pointRadius: 0,
      },
      {
        label: 'Police-Vertragsguthaben',
        data: policeAccumulation.yearlyData.map((y) => y.contractValue),
        borderColor: COLORS.police,
        backgroundColor: COLORS.policeLight,
        fill: false,
        tension: 0.2,
        pointRadius: 2,
      },
      {
        label: 'Kumulierte Einzahlungen',
        data: depotRealistic.yearlyData.map((y) => y.cumulativeContributions),
        borderColor: COLORS.contributions,
        backgroundColor: COLORS.contributionsLight,
        fill: false,
        tension: 0.1,
        borderDash: [2, 4],
        pointRadius: 0,
      },
    ],
  }

  return (
    <figure className="chart-container" aria-label="Vermögensentwicklung Ansparphase">
      <figcaption className="chart-title">Vermögensentwicklung in der Ansparphase</figcaption>
      <div className="chart-wrapper">
        <Line data={data} options={commonLineOptions} />
      </div>
    </figure>
  )
}
