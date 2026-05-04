import { DEFAULTS } from './defaults.js'
import { calculateDepotSimplified, calculateDepotRealistic } from './depot.js'
import { calculatePolice, calculatePoliceCapitalPayout, calculatePoliceRente } from './police.js'
import { calculateEntnahmeplan } from './entnahme.js'
import { calculateBreakeven } from './breakeven.js'

export function runAllCalculations(userParams = {}) {
  const params = { ...DEFAULTS, ...userParams }

  const depotSimplified = calculateDepotSimplified(params)
  const depotRealistic = calculateDepotRealistic(params)
  const policeAccumulation = calculatePolice(params)

  const policePayout = calculatePoliceCapitalPayout(
    params,
    policeAccumulation.contractValue,
    policeAccumulation.totalContributions
  )

  const policeRente = calculatePoliceRente(params, policeAccumulation.contractValue)

  // Depot stays invested in retirement — start from gross depotwert (before final sale tax)
  // with the accumulated cost basis from the accumulation phase.
  const entnahme = calculateEntnahmeplan(
    params,
    depotRealistic.depotwert,
    depotRealistic.adjustedCostBasis
  )

  const breakeven = calculateBreakeven(params, depotRealistic.netValue)

  return {
    params,
    depotSimplified,
    depotRealistic,
    policeAccumulation,
    policePayout,
    policeRente,
    entnahme,
    breakeven,
  }
}

export { DEFAULTS }
