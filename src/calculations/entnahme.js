import { getSteuersatzKapital, getEntnahmeMonate, getMonatsrendite } from './defaults.js'

function grossFromNet(netWithdrawal, gainRatio, params, monthlyPauschbetrag) {
  const s = getSteuersatzKapital(params)
  const k = gainRatio * (1 - params.teilfreistellung)
  // If k = 0 or G*k <= pb, no tax → G = net
  // Otherwise: G = (net - pb*s) / (1 - k*s)
  if (k <= 0) return netWithdrawal
  const pb = monthlyPauschbetrag
  // Check if even a small withdrawal triggers tax
  const gNoTax = netWithdrawal
  if (gNoTax * k <= pb) return gNoTax
  // Solve analytically
  const denominator = 1 - k * s
  if (denominator <= 0) return netWithdrawal * 2 // fallback
  return (netWithdrawal - pb * s) / denominator
}

function simulate(netWithdrawal, params, startDepotValue, startCostBasis, collectData) {
  const monate = getEntnahmeMonate(params)
  const nettoRenditePA = params.bruttofondrendite - params.depotFondskosten - params.depotPlattformkosten
  const monatlich = getMonatsrendite(nettoRenditePA)
  const monthlyPauschbetrag = (params.sparerPauschbetrag * params.pauschbetragVerfuegbar) / 12

  let depot = startDepotValue
  let costBasis = startCostBasis

  const yearlyData = collectData ? [] : null
  let yearGrossWithdrawal = 0
  let yearNetWithdrawal = 0
  let yearTax = 0

  for (let m = 0; m < monate; m++) {
    depot *= (1 + monatlich)

    const unrealizedGain = Math.max(0, depot - costBasis)
    const gainRatio = depot > 0 ? unrealizedGain / depot : 0

    const gross = grossFromNet(netWithdrawal, gainRatio, params, monthlyPauschbetrag)
    const s = getSteuersatzKapital(params)
    const k = gainRatio * (1 - params.teilfreistellung)
    const taxableShare = Math.max(0, gross * k - monthlyPauschbetrag)
    const tax = taxableShare * s

    const withdrawalRatio = depot > 0 ? gross / depot : 1
    costBasis = Math.max(0, costBasis * (1 - withdrawalRatio))
    depot -= gross

    if (collectData) {
      yearGrossWithdrawal += gross
      yearNetWithdrawal += netWithdrawal
      yearTax += tax

      const isYearEnd = (m + 1) % 12 === 0
      const isLastMonth = m === monate - 1
      if (isYearEnd || isLastMonth) {
        yearlyData.push({
          year: Math.floor(m / 12) + 1,
          depotValue: Math.max(0, depot),
          annualGrossWithdrawal: yearGrossWithdrawal,
          annualNetWithdrawal: yearNetWithdrawal,
          annualTax: yearTax,
        })
        yearGrossWithdrawal = 0
        yearNetWithdrawal = 0
        yearTax = 0
      }
    }

    if (depot < -1000 && !collectData) return { finalDepot: depot, yearlyData }
  }

  return { finalDepot: depot, yearlyData }
}

export function calculateEntnahmeplan(params, startDepotValue, startCostBasis) {
  if (startDepotValue <= 0) {
    return { monthlyNetWithdrawal: 0, monthlyGrossWithdrawal: 0, yearlyData: [] }
  }

  const monate = getEntnahmeMonate(params)
  const nettoRenditePA = params.bruttofondrendite - params.depotFondskosten - params.depotPlattformkosten
  const monatlich = getMonatsrendite(nettoRenditePA)

  // Rough upper bound: PV annuity (no tax) = startDepotValue * r / (1-(1+r)^-n)
  const r = monatlich
  const annuityFactor = r > 0 ? r / (1 - Math.pow(1 + r, -monate)) : 1 / monate
  let low = 0
  let high = startDepotValue * annuityFactor * 1.5

  for (let i = 0; i < 100; i++) {
    const mid = (low + high) / 2
    const { finalDepot } = simulate(mid, params, startDepotValue, startCostBasis, false)
    if (Math.abs(finalDepot) < 0.01) {
      low = mid
      high = mid
      break
    }
    if (finalDepot > 0) {
      low = mid
    } else {
      high = mid
    }
  }

  const monthlyNetWithdrawal = (low + high) / 2
  const { yearlyData } = simulate(monthlyNetWithdrawal, params, startDepotValue, startCostBasis, true)

  // Compute average gross withdrawal from the final simulation
  const totalGross = yearlyData.reduce((sum, y) => sum + y.annualGrossWithdrawal, 0)
  const monthlyGrossWithdrawal = totalGross / monate

  return { monthlyNetWithdrawal, monthlyGrossWithdrawal, yearlyData }
}
