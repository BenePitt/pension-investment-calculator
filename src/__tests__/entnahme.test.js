import { describe, it, expect } from 'vitest'
import { DEFAULTS } from '../calculations/defaults.js'
import { calculateDepotRealistic } from '../calculations/depot.js'
import { calculateEntnahmeplan } from '../calculations/entnahme.js'

describe('calculateEntnahmeplan', () => {
  // Depot stays invested in retirement — use gross depotwert and accumulated cost basis
  it('produces monthly net withdrawal ≈ 10,985 € (±1.0%)', () => {
    const depot = calculateDepotRealistic(DEFAULTS)
    const result = calculateEntnahmeplan(DEFAULTS, depot.depotwert, depot.adjustedCostBasis)
    const tolerance = 10985 * 0.010
    expect(Math.abs(result.monthlyNetWithdrawal - 10985)).toBeLessThan(tolerance)
  })

  it('depot reaches ≈ 0 at end of drawdown period', () => {
    const depot = calculateDepotRealistic(DEFAULTS)
    const result = calculateEntnahmeplan(DEFAULTS, depot.depotwert, depot.adjustedCostBasis)
    const lastYear = result.yearlyData[result.yearlyData.length - 1]
    expect(Math.abs(lastYear.depotValue)).toBeLessThan(5000)
  })

  it('yearlyData has correct number of entries', () => {
    const depot = calculateDepotRealistic(DEFAULTS)
    const result = calculateEntnahmeplan(DEFAULTS, depot.depotwert, depot.adjustedCostBasis)
    const expectedYears = DEFAULTS.zielalterEntnahme - DEFAULTS.renteneintrittsalter
    expect(result.yearlyData.length).toBe(expectedYears)
  })

  it('each year depotValue is lower than previous (decreasing)', () => {
    const depot = calculateDepotRealistic(DEFAULTS)
    const result = calculateEntnahmeplan(DEFAULTS, depot.depotwert, depot.adjustedCostBasis)
    for (let i = 1; i < result.yearlyData.length; i++) {
      expect(result.yearlyData[i].depotValue).toBeLessThan(result.yearlyData[i - 1].depotValue)
    }
  })

  it('returns 0 monthly withdrawal when startDepotValue is 0', () => {
    const result = calculateEntnahmeplan(DEFAULTS, 0, 0)
    expect(result.monthlyNetWithdrawal).toBeCloseTo(0, 0)
  })

  it('grossWithdrawal > netWithdrawal (taxes are paid)', () => {
    const depot = calculateDepotRealistic(DEFAULTS)
    const result = calculateEntnahmeplan(DEFAULTS, depot.depotwert, depot.adjustedCostBasis)
    expect(result.monthlyGrossWithdrawal).toBeGreaterThan(result.monthlyNetWithdrawal)
  })
})
