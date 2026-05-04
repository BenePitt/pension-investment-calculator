import {
  getSteuersatzKapital,
  getAnsparMonate,
  getSparrate,
  getMonatsrendite,
} from './defaults.js'

export function calculatePolice(params) {
  const monate = getAnsparMonate(params)
  const nettoRenditePA =
    params.bruttofondrendite - params.policeFondskosten - params.policeVerwaltungskosten
  const monatlich = getMonatsrendite(nettoRenditePA)

  let contractValue = params.startkapital
  let totalContributions = 0
  let restEroeffnungskosten = params.policeEroeffnungskosten

  const yearlyData = []

  for (let m = 0; m < monate; m++) {
    contractValue *= (1 + monatlich)
    const rate = getSparrate(params, m)
    totalContributions += rate

    const invested = Math.max(0, rate - restEroeffnungskosten)
    restEroeffnungskosten = Math.max(0, restEroeffnungskosten - rate)
    contractValue += invested

    const isYearEnd = (m + 1) % 12 === 0
    const isLastMonth = m === monate - 1
    if (isYearEnd || isLastMonth) {
      yearlyData.push({
        year: Math.floor(m / 12) + 1,
        contractValue,
        cumulativeContributions: totalContributions,
      })
    }
  }

  return { contractValue, totalContributions, yearlyData }
}

export function calculatePoliceCapitalPayout(params, contractValue, totalContributions) {
  const unterschiedsbetrag = Math.max(0, contractValue - totalContributions)

  const steuerfrei15 = params.freistellung15Prozent ? 0.15 * unterschiedsbetrag : 0
  let taxableBase = unterschiedsbetrag - steuerfrei15

  const ansparJahre = params.renteneintrittsalter - params.alterAktuell
  const regel12_62Erfuellt =
    params.regel12_62 && ansparJahre >= 12 && params.renteneintrittsalter >= 62

  if (regel12_62Erfuellt) {
    taxableBase = taxableBase / 2
  }

  const pauschbetrag = params.sparerPauschbetrag * params.pauschbetragVerfuegbar
  taxableBase = Math.max(0, taxableBase - pauschbetrag)

  const tax = taxableBase * params.grenzsteuersatz
  const netto = contractValue - tax

  return {
    brutto: contractValue,
    unterschiedsbetrag,
    steuerfrei15,
    regel12_62Erfuellt,
    taxableBase,
    tax,
    netto,
  }
}

export function calculatePoliceRente(params, contractValue) {
  const bruttoMonatsrente = (contractValue / 10000) * params.rentenfaktor
  const taxableMonthly = bruttoMonatsrente * params.ertragsanteil
  const monthlyTax = taxableMonthly * params.grenzsteuersatz
  const nettoMonatsrente = bruttoMonatsrente - monthlyTax

  return { bruttoMonatsrente, nettoMonatsrente, taxableMonthly, monthlyTax }
}
