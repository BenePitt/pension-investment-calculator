import { describe, it, expect } from 'vitest'
import { DEFAULTS } from '../calculations/defaults.js'
import { calculateDepotRealistic } from '../calculations/depot.js'
import { calculatePolice, calculatePoliceCapitalPayout } from '../calculations/police.js'
import { calculateBreakeven } from '../calculations/breakeven.js'

describe('calculateBreakeven', () => {
  it('breakevenKosten ≈ -0.0006 (±0.0002)', () => {
    const depot = calculateDepotRealistic(DEFAULTS)
    const result = calculateBreakeven(DEFAULTS, depot.netValue)
    expect(Math.abs(result.breakevenKosten - (-0.0006))).toBeLessThan(0.0002)
  })

  it('chartData has 61 entries', () => {
    const depot = calculateDepotRealistic(DEFAULTS)
    const result = calculateBreakeven(DEFAULTS, depot.netValue)
    expect(result.chartData.length).toBe(61)
  })

  it('higher Verwaltungskosten result in lower policeNetto (monotone)', () => {
    const depot = calculateDepotRealistic(DEFAULTS)
    const result = calculateBreakeven(DEFAULTS, depot.netValue)
    for (let i = 1; i < result.chartData.length; i++) {
      expect(result.chartData[i].policeNetto).toBeLessThan(result.chartData[i - 1].policeNetto)
    }
  })

  it('depotNetto line is constant across all chartData entries', () => {
    const depot = calculateDepotRealistic(DEFAULTS)
    const result = calculateBreakeven(DEFAULTS, depot.netValue)
    const firstDepotNetto = result.chartData[0].depotNetto
    result.chartData.forEach(d => {
      expect(d.depotNetto).toBe(firstDepotNetto)
    })
  })

  it('at breakevenKosten, policeNetto ≈ depotNettoRealistisch (within 10€)', () => {
    const depot = calculateDepotRealistic(DEFAULTS)
    const depotNetto = depot.netValue
    const result = calculateBreakeven(DEFAULTS, depotNetto)

    const p = { ...DEFAULTS, policeVerwaltungskosten: result.breakevenKosten }
    const acc = calculatePolice(p)
    const payout = calculatePoliceCapitalPayout(p, acc.contractValue, acc.totalContributions)
    expect(Math.abs(payout.netto - depotNetto)).toBeLessThan(10)
  })
})
