import {
  getSteuersatzKapital,
  getAnsparMonate,
  getSparrate,
  getMonatsrendite,
} from './defaults.js'

export function calculateDepotSimplified(params) {
  const monate = getAnsparMonate(params)
  const nettoRenditePA = params.bruttofondrendite - params.depotFondskosten - params.depotPlattformkosten
  const monatlich = getMonatsrendite(nettoRenditePA)
  const steuersatz = getSteuersatzKapital(params)
  const pauschbetrag = params.sparerPauschbetrag * params.pauschbetragVerfuegbar

  let depot = params.startkapital
  let totalContributions = 0
  const yearlyData = []

  for (let m = 0; m < monate; m++) {
    depot *= (1 + monatlich)
    const rate = getSparrate(params, m)
    depot += rate
    totalContributions += rate

    const isYearEnd = (m + 1) % 12 === 0
    const isLastMonth = m === monate - 1
    if (isYearEnd || isLastMonth) {
      yearlyData.push({ year: Math.floor(m / 12) + 1, depotwertEOY: depot, cumulativeContributions: totalContributions })
    }
  }

  const gewinn = depot - totalContributions
  const taxableGain = Math.max(0, gewinn * (1 - params.teilfreistellung) - pauschbetrag)
  const tax = taxableGain * steuersatz
  const netValue = depot - tax

  return { depotwert: depot, totalContributions, gewinn, taxableGain, tax, netValue, yearlyData }
}

export function calculateDepotRealistic(params) {
  const monate = getAnsparMonate(params)
  const nettoRenditePA = params.bruttofondrendite - params.depotFondskosten - params.depotPlattformkosten
  const monatlich = getMonatsrendite(nettoRenditePA)
  const steuersatz = getSteuersatzKapital(params)
  const pauschbetragJahr = params.sparerPauschbetrag * params.pauschbetragVerfuegbar

  let depot = params.startkapital
  let totalContributions = 0
  let cumulativeVP = 0
  let cumulativeVPsteuer = 0

  let depotwertJan1 = depot
  let taxPaidThisYear = 0
  let pauschbetragRemainingThisYear = pauschbetragJahr
  let pauschbetragRemainingFinal = pauschbetragJahr

  const yearlyData = []

  for (let m = 0; m < monate; m++) {
    depot *= (1 + monatlich)
    const rate = getSparrate(params, m)
    depot += rate
    totalContributions += rate

    const isYearEnd = (m + 1) % 12 === 0
    const isLastMonth = m === monate - 1

    if (isYearEnd || isLastMonth) {
      const yearIndex = Math.floor(m / 12)

      if (params.vorabpauschalenAktiviert && isYearEnd && !isLastMonth) {
        const basisertrag = depotwertJan1 * params.basiszins * 0.70
        const yearlyGain = Math.max(0, depot - depotwertJan1 + taxPaidThisYear)
        const vorabpauschale = Math.max(0, Math.min(basisertrag, yearlyGain))

        let taxableVP = vorabpauschale * (1 - params.teilfreistellung)
        taxableVP = Math.max(0, taxableVP - pauschbetragRemainingThisYear)

        const taxVP = taxableVP * steuersatz
        depot -= taxVP
        cumulativeVP += vorabpauschale
        cumulativeVPsteuer += taxVP
        taxPaidThisYear = taxVP

        pauschbetragRemainingFinal = Math.max(0, pauschbetragRemainingThisYear - vorabpauschale * (1 - params.teilfreistellung))
        pauschbetragRemainingThisYear = pauschbetragJahr

        yearlyData.push({
          year: yearIndex + 1,
          depotwertEOY: depot,
          vorabpauschale,
          taxVP,
          cumulativeContributions: totalContributions,
          cumulativeVPsteuer,
        })

        depotwertJan1 = depot
        taxPaidThisYear = 0
      } else if (isLastMonth && !isYearEnd) {
        yearlyData.push({
          year: yearIndex + 1,
          depotwertEOY: depot,
          vorabpauschale: 0,
          taxVP: 0,
          cumulativeContributions: totalContributions,
          cumulativeVPsteuer,
        })
      } else if (isYearEnd && isLastMonth) {
        if (params.vorabpauschalenAktiviert) {
          const basisertrag = depotwertJan1 * params.basiszins * 0.70
          const yearlyGain = Math.max(0, depot - depotwertJan1 + taxPaidThisYear)
          const vorabpauschale = Math.max(0, Math.min(basisertrag, yearlyGain))

          let taxableVP = vorabpauschale * (1 - params.teilfreistellung)
          taxableVP = Math.max(0, taxableVP - pauschbetragRemainingThisYear)

          const taxVP = taxableVP * steuersatz
          depot -= taxVP
          cumulativeVP += vorabpauschale
          cumulativeVPsteuer += taxVP

          pauschbetragRemainingFinal = Math.max(0, pauschbetragRemainingThisYear - vorabpauschale * (1 - params.teilfreistellung))

          yearlyData.push({
            year: yearIndex + 1,
            depotwertEOY: depot,
            vorabpauschale,
            taxVP,
            cumulativeContributions: totalContributions,
            cumulativeVPsteuer,
          })
        } else {
          yearlyData.push({
            year: yearIndex + 1,
            depotwertEOY: depot,
            vorabpauschale: 0,
            taxVP: 0,
            cumulativeContributions: totalContributions,
            cumulativeVPsteuer: 0,
          })
        }
      }
    }
  }

  // Final sale: only tax gain not yet covered by Vorabpauschalen
  const gain = depot - totalContributions
  const adjustedGain = Math.max(0, gain - cumulativeVP)
  const taxableGain = Math.max(0, adjustedGain * (1 - params.teilfreistellung) - pauschbetragRemainingFinal)
  const tax = taxableGain * steuersatz
  const netValue = depot - tax
  const adjustedCostBasis = totalContributions + cumulativeVP

  return {
    depotwert: depot,
    totalContributions,
    gain,
    cumulativeVP,
    cumulativeVorabpauschalensteuer: cumulativeVPsteuer,
    adjustedCostBasis,
    taxableGain,
    tax,
    netValue,
    yearlyData,
  }
}
