import { calculatePolice, calculatePoliceCapitalPayout } from './police.js'

function simulatePoliceNetto(verwaltungskosten, params) {
  const p = { ...params, policeVerwaltungskosten: verwaltungskosten }
  const { contractValue, totalContributions } = calculatePolice(p)
  const { netto } = calculatePoliceCapitalPayout(p, contractValue, totalContributions)
  return netto
}

export function calculateBreakeven(params, depotNettoRealistisch) {
  let low = -0.05
  let high = 0.10
  const tolerance = 0.000001

  for (let i = 0; i < 200; i++) {
    const mid = (low + high) / 2
    const netto = simulatePoliceNetto(mid, params)
    if (Math.abs(netto - depotNettoRealistisch) < tolerance) {
      low = mid
      high = mid
      break
    }
    // Higher Verwaltungskosten → lower police netto
    // If netto > target → need higher costs → search right → low = mid
    if (netto > depotNettoRealistisch) {
      low = mid
    } else {
      high = mid
    }
  }

  const breakevenKosten = (low + high) / 2

  const chartData = []
  const steps = 61
  const rangeStart = -0.03
  const rangeEnd = 0.03
  for (let i = 0; i < steps; i++) {
    const k = rangeStart + (i / (steps - 1)) * (rangeEnd - rangeStart)
    chartData.push({
      verwaltungskosten: k,
      policeNetto: simulatePoliceNetto(k, params),
      depotNetto: depotNettoRealistisch,
    })
  }

  return { breakevenKosten, chartData }
}
