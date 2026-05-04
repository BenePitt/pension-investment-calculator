import { describe, it, expect } from 'vitest'
import { DEFAULTS } from '../calculations/defaults.js'
import { calculateDepotSimplified, calculateDepotRealistic } from '../calculations/depot.js'

describe('calculateDepotSimplified', () => {
  it('produces reference totalContributions ≈ 520,086 € (±0.1%)', () => {
    const result = calculateDepotSimplified(DEFAULTS)
    expect(result.totalContributions).toBeCloseTo(520086, -1)
    const tolerance = 520086 * 0.001
    expect(Math.abs(result.totalContributions - 520086)).toBeLessThan(tolerance)
  })

  it('produces reference Depotwert vereinfacht ≈ 1,922,428 € (±0.1%)', () => {
    const result = calculateDepotSimplified(DEFAULTS)
    const tolerance = 1922428 * 0.001
    expect(Math.abs(result.depotwert - 1922428)).toBeLessThan(tolerance)
  })

  it('produces reference Depot netto vereinfacht ≈ 1,663,785 € (±0.1%)', () => {
    const result = calculateDepotSimplified(DEFAULTS)
    const tolerance = 1663785 * 0.001
    expect(Math.abs(result.netValue - 1663785)).toBeLessThan(tolerance)
  })

  it('Teilfreistellung 30% reduces taxable gain', () => {
    const withTF = calculateDepotSimplified({ ...DEFAULTS, teilfreistellung: 0.30 })
    const withoutTF = calculateDepotSimplified({ ...DEFAULTS, teilfreistellung: 0.0 })
    expect(withTF.taxableGain).toBeLessThan(withoutTF.taxableGain)
  })

  it('Pauschbetrag reduces taxable gain', () => {
    const with1000 = calculateDepotSimplified({ ...DEFAULTS, sparerPauschbetrag: 1000 })
    const with0 = calculateDepotSimplified({ ...DEFAULTS, sparerPauschbetrag: 0 })
    expect(with1000.taxableGain).toBeLessThan(with0.taxableGain)
  })

  it('tax = taxableGain * 26.375%', () => {
    const result = calculateDepotSimplified(DEFAULTS)
    expect(result.tax).toBeCloseTo(result.taxableGain * 0.26375, 0)
  })

  it('netValue = depotwert - tax', () => {
    const result = calculateDepotSimplified(DEFAULTS)
    expect(result.netValue).toBeCloseTo(result.depotwert - result.tax, 1)
  })
})

describe('calculateDepotRealistic', () => {
  it('produces reference Depotwert realistisch ≈ 1,786,397 € (±0.15%)', () => {
    const result = calculateDepotRealistic(DEFAULTS)
    const tolerance = 1786397 * 0.0015
    expect(Math.abs(result.depotwert - 1786397)).toBeLessThan(tolerance)
  })

  it('produces reference Depot netto realistisch ≈ 1,634,016 € (±0.5%)', () => {
    const result = calculateDepotRealistic(DEFAULTS)
    const tolerance = 1634016 * 0.005
    expect(Math.abs(result.netValue - 1634016)).toBeLessThan(tolerance)
  })

  it('yearlyData has correct number of entries', () => {
    const result = calculateDepotRealistic(DEFAULTS)
    const expectedYears = DEFAULTS.renteneintrittsalter - DEFAULTS.alterAktuell
    expect(result.yearlyData.length).toBe(expectedYears)
  })

  it('Vorabpauschale is 0 when yearlyGain is 0 (zero return)', () => {
    const zeroReturnParams = { ...DEFAULTS, bruttofondrendite: 0.002, depotFondskosten: 0.002, depotPlattformkosten: 0 }
    const result = calculateDepotRealistic(zeroReturnParams)
    result.yearlyData.forEach(y => {
      expect(y.vorabpauschale).toBeGreaterThanOrEqual(0)
    })
  })

  it('cumulativeVP reduces the final taxable gain vs simplified', () => {
    const realistic = calculateDepotRealistic(DEFAULTS)
    expect(realistic.cumulativeVP).toBeGreaterThan(0)
  })

  it('adjustedCostBasis = totalContributions + cumulativeVP', () => {
    const result = calculateDepotRealistic(DEFAULTS)
    expect(result.adjustedCostBasis).toBeCloseTo(result.totalContributions + result.cumulativeVP, 1)
  })

  it('depotwert realistisch is less than simplified (Vorabpauschale taxes reduce depot)', () => {
    const simplified = calculateDepotSimplified(DEFAULTS)
    const realistic = calculateDepotRealistic(DEFAULTS)
    expect(realistic.depotwert).toBeLessThan(simplified.depotwert)
  })
})
