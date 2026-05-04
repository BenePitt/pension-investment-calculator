export const DEFAULTS = {
  // Person & Sparplan
  alterAktuell: 28,
  renteneintrittsalter: 67,
  zielalterEntnahme: 90,
  startkapital: 0,
  monatlicheSparrate: 600,
  sparratendynamik: 0.03,
  beitragszeitpunkt: 'monatsende',

  // Rendite & Kosten
  bruttofondrendite: 0.07,
  depotFondskosten: 0.002,
  depotPlattformkosten: 0.0,
  policeFondskosten: 0.002,
  policeVerwaltungskosten: 0.015,
  policeEroeffnungskosten: 4000,

  // Steuern Depot
  sparerPauschbetrag: 1000,
  pauschbetragVerfuegbar: 1.0,
  abgeltungsteuer: 0.25,
  solidaritaetszuschlag: 0.055,
  kirchensteuer: 0.0,
  teilfreistellung: 0.30,
  basiszins: 0.032,
  // 'deaktiviert' | 'depot' (VP aus Depotwert) | 'sparrate' (VP aus Einkommen)
  vorabpauschaleMode: 'depot',

  // Steuern Rentenpolice
  grenzsteuersatz: 0.45,
  freistellung15Prozent: true,
  regel12_62: true,
  ertragsanteil: 0.17,
  kvdR: true,

  // Auszahlung & Rente
  rentenfaktor: 30.0,
}

export function getSteuersatzKapital(params) {
  const p = params || DEFAULTS
  const kstFaktor = p.kirchensteuer > 0
    ? 1 + p.solidaritaetszuschlag + p.kirchensteuer
    : 1 + p.solidaritaetszuschlag
  return p.abgeltungsteuer * kstFaktor
}

export function getAnsparMonate(params) {
  return (params.renteneintrittsalter - params.alterAktuell) * 12
}

export function getEntnahmeMonate(params) {
  return (params.zielalterEntnahme - params.renteneintrittsalter) * 12
}

export function getSparrate(params, monat) {
  return params.monatlicheSparrate * Math.pow(1 + params.sparratendynamik, Math.floor(monat / 12))
}

export function getMonatsrendite(annualRate) {
  return Math.pow(1 + annualRate, 1 / 12) - 1
}
