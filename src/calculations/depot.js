import {
  getSteuersatzKapital,
  getAnsparMonate,
  getSparrate,
  getMonatsrendite,
} from './defaults.js'

// Effektive Teilfreistellung für das Depot:
// ETF-Anteil erhält die konfigurierte Teilfreistellung (Standard 30 % für Aktienfonds),
// Direktaktien-Anteil hat 0 % Teilfreistellung und erzeugt keine Vorabpauschale.
function getEffektiveTeilfreistellung(params) {
  const etfAnteil = 1 - (params.depotAktienanteil ?? 0)
  return etfAnteil * params.teilfreistellung
}

export function calculateDepotSimplified(params) {
  const monate = getAnsparMonate(params)
  const nettoRenditePA = params.bruttofondrendite - params.depotFondskosten - params.depotPlattformkosten
  const monatlich = getMonatsrendite(nettoRenditePA)
  const steuersatz = getSteuersatzKapital(params)
  const effectiveTF = getEffektiveTeilfreistellung(params)
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
  const taxableGain = Math.max(0, gewinn * (1 - effectiveTF) - pauschbetrag)
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
  const effectiveTF = getEffektiveTeilfreistellung(params)
  // Nur der ETF-Anteil des Depots erzeugt eine Vorabpauschale
  const etfAnteil = 1 - (params.depotAktienanteil ?? 0)

  let depot = params.startkapital
  let totalContributions = 0
  let cumulativeVP = 0
  let cumulativeVPsteuer = 0
  let yearContrib = 0

  let depotwertJan1 = depot
  let taxPaidThisYear = 0
  let pauschbetragRemainingThisYear = pauschbetragJahr
  let pauschbetragRemainingFinal = pauschbetragJahr
  let prevYearVPsteuer = 0

  const yearlyData = []

  for (let m = 0; m < monate; m++) {
    depot *= (1 + monatlich)
    const rate = getSparrate(params, m)

    const effectiveRate = params.vorabpauschaleMode === 'sparrate'
      ? Math.max(0, rate - prevYearVPsteuer / 12)
      : rate

    depot += effectiveRate
    totalContributions += effectiveRate
    yearContrib += effectiveRate

    const isYearEnd = (m + 1) % 12 === 0
    const isLastMonth = m === monate - 1

    if (isYearEnd || isLastMonth) {
      const yearIndex = Math.floor(m / 12)
      let vorabpauschale = 0
      let taxVP = 0

      const vpAktiv = params.vorabpauschaleMode !== 'deaktiviert'
      if (vpAktiv && isYearEnd) {
        // Basisertrag nur auf den ETF-Anteil des Depots (Aktien erzeugen keine VP)
        const basisertrag = depotwertJan1 * etfAnteil * params.basiszins * 0.70
        const yearlyGain = Math.max(0, depot - depotwertJan1 + taxPaidThisYear)
        vorabpauschale = Math.max(0, Math.min(basisertrag, yearlyGain))

        let taxableVP = vorabpauschale * (1 - effectiveTF)
        taxableVP = Math.max(0, taxableVP - pauschbetragRemainingThisYear)

        taxVP = taxableVP * steuersatz
        if (params.vorabpauschaleMode === 'depot') {
          depot -= taxVP
        }
        cumulativeVP += vorabpauschale
        cumulativeVPsteuer += taxVP

        pauschbetragRemainingFinal = Math.max(0, pauschbetragRemainingThisYear - vorabpauschale * (1 - effectiveTF))
        pauschbetragRemainingThisYear = pauschbetragJahr
        taxPaidThisYear = isLastMonth ? taxVP : 0
      }

      yearlyData.push({
        year: yearIndex + 1,
        yearlyContributions: yearContrib,
        depotwertEOY: depot,
        vorabpauschale,
        taxVP,
        cumulativeContributions: totalContributions,
        cumulativeVPsteuer,
      })

      if (isYearEnd && !isLastMonth) {
        if (params.vorabpauschaleMode === 'sparrate') {
          prevYearVPsteuer = taxVP
        }
        depotwertJan1 = depot
        taxPaidThisYear = 0
        yearContrib = 0
      }
    }
  }

  const gain = depot - totalContributions
  const adjustedGain = Math.max(0, gain - cumulativeVP)
  const taxableGain = Math.max(0, adjustedGain * (1 - effectiveTF) - pauschbetragRemainingFinal)
  const tax = taxableGain * steuersatz
  const netValue = depot - tax
  const adjustedCostBasis = totalContributions + cumulativeVP

  const effectiveTotalOutflows = params.vorabpauschaleMode !== 'deaktiviert'
    ? totalContributions + cumulativeVPsteuer
    : totalContributions

  const trueNetValue = netValue

  return {
    depotwert: depot,
    totalContributions,
    gain,
    cumulativeVP,
    cumulativeVorabpauschalensteuer: cumulativeVPsteuer,
    effectiveTotalOutflows,
    adjustedCostBasis,
    taxableGain,
    tax,
    netValue,
    trueNetValue,
    yearlyData,
  }
}
