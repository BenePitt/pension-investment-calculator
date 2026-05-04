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
  let yearContrib = 0

  let depotwertJan1 = depot
  let taxPaidThisYear = 0
  let pauschbetragRemainingThisYear = pauschbetragJahr
  let pauschbetragRemainingFinal = pauschbetragJahr

  // 'sparrate': VP-Steuer des Vorjahres reduziert die laufenden Einzahlungen,
  // sodass die Jahresbelastung (Einzahlung + VP) ≈ Jahres-Sparrate bleibt.
  let prevYearVPsteuer = 0

  const yearlyData = []

  for (let m = 0; m < monate; m++) {
    depot *= (1 + monatlich)
    const rate = getSparrate(params, m)

    // Im 'sparrate'-Modus: Einzahlung um VP-Steuer des Vorjahres verringern
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
        const basisertrag = depotwertJan1 * params.basiszins * 0.70
        const yearlyGain = Math.max(0, depot - depotwertJan1 + taxPaidThisYear)
        vorabpauschale = Math.max(0, Math.min(basisertrag, yearlyGain))

        let taxableVP = vorabpauschale * (1 - params.teilfreistellung)
        taxableVP = Math.max(0, taxableVP - pauschbetragRemainingThisYear)

        taxVP = taxableVP * steuersatz
        // 'depot': VP-Steuer wird jährlich aus dem Fondsvermögen entnommen (zusätzl. Belastung)
        // 'sparrate': Depot unberührt — VP bereits durch reduzierte Einzahlungen finanziert
        if (params.vorabpauschaleMode === 'depot') {
          depot -= taxVP
        }
        cumulativeVP += vorabpauschale
        cumulativeVPsteuer += taxVP

        pauschbetragRemainingFinal = Math.max(0, pauschbetragRemainingThisYear - vorabpauschale * (1 - params.teilfreistellung))
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
        // Im 'sparrate'-Modus: VP-Steuer dieses Jahres wird im nächsten Jahr
        // von den monatlichen Einzahlungen abgezogen
        if (params.vorabpauschaleMode === 'sparrate') {
          prevYearVPsteuer = taxVP
        }
        depotwertJan1 = depot
        taxPaidThisYear = 0
        yearContrib = 0
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

  // 'depot':     VP-Steuer ist zusätzliche Belastung über die Sparrate hinaus
  // 'sparrate':  Einzahlungen wurden um VP reduziert → VP bereits in der Sparrate enthalten
  // In beiden Fällen: effectiveTotalOutflows = was der Anleger insgesamt aufgewendet hat
  const effectiveTotalOutflows = params.vorabpauschaleMode !== 'deaktiviert'
    ? totalContributions + cumulativeVPsteuer
    : totalContributions

  // trueNetValue: für alle Modi gleich netValue
  // ('sparrate': VP bereits in Beitragsreduktion verrechnet, kein externer Abzug nötig)
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
