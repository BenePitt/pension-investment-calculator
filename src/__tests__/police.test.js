import { describe, it, expect } from 'vitest'
import { DEFAULTS } from '../calculations/defaults.js'
import {
  calculatePolice,
  calculatePoliceCapitalPayout,
  calculatePoliceRente,
} from '../calculations/police.js'

describe('calculatePolice', () => {
  it('produces Police Vertragsguthaben ≈ 1,357,604 € (±0.1%)', () => {
    const result = calculatePolice(DEFAULTS)
    const tolerance = 1357604 * 0.001
    expect(Math.abs(result.contractValue - 1357604)).toBeLessThan(tolerance)
  })

  it('yearlyData has correct number of entries', () => {
    const result = calculatePolice(DEFAULTS)
    const expectedYears = DEFAULTS.renteneintrittsalter - DEFAULTS.alterAktuell
    expect(result.yearlyData.length).toBe(expectedYears)
  })

  it('first contributions absorbed by Eröffnungskosten before investing', () => {
    // With 4000€ opening costs and 600€/month, first 6-7 months should not invest
    const result = calculatePolice({ ...DEFAULTS, startkapital: 0 })
    // contractValue after 1 year should be less than without opening costs
    const noOpeningCosts = calculatePolice({ ...DEFAULTS, policeEroeffnungskosten: 0 })
    expect(result.contractValue).toBeLessThan(noOpeningCosts.contractValue)
  })

  it('totalContributions is positive (same sparrate formula as depot)', () => {
    const police = calculatePolice(DEFAULTS)
    expect(police.totalContributions).toBeGreaterThan(0)
  })

  it('zero opening costs gives higher contractValue', () => {
    const withCosts = calculatePolice(DEFAULTS)
    const withoutCosts = calculatePolice({ ...DEFAULTS, policeEroeffnungskosten: 0 })
    expect(withoutCosts.contractValue).toBeGreaterThan(withCosts.contractValue)
  })
})

describe('calculatePoliceCapitalPayout', () => {
  it('produces Police netto Kapital ≈ 1,197,879 € (±0.5%)', () => {
    const acc = calculatePolice(DEFAULTS)
    const result = calculatePoliceCapitalPayout(DEFAULTS, acc.contractValue, acc.totalContributions)
    const tolerance = 1197879 * 0.005
    expect(Math.abs(result.netto - 1197879)).toBeLessThan(tolerance)
  })

  it('15%-Freistellung reduces Unterschiedsbetrag', () => {
    const acc = calculatePolice(DEFAULTS)
    const with15 = calculatePoliceCapitalPayout(
      { ...DEFAULTS, freistellung15Prozent: true },
      acc.contractValue, acc.totalContributions
    )
    const without15 = calculatePoliceCapitalPayout(
      { ...DEFAULTS, freistellung15Prozent: false },
      acc.contractValue, acc.totalContributions
    )
    expect(with15.netto).toBeGreaterThan(without15.netto)
  })

  it('12/62-Regel halves taxable base', () => {
    const acc = calculatePolice(DEFAULTS)
    const with1262 = calculatePoliceCapitalPayout(
      { ...DEFAULTS, regel12_62: true },
      acc.contractValue, acc.totalContributions
    )
    const without1262 = calculatePoliceCapitalPayout(
      { ...DEFAULTS, regel12_62: false },
      acc.contractValue, acc.totalContributions
    )
    expect(with1262.netto).toBeGreaterThan(without1262.netto)
    expect(with1262.regel12_62Erfuellt).toBe(true)
  })

  it('Unterschiedsbetrag = contractValue - totalContributions, min 0', () => {
    const acc = calculatePolice(DEFAULTS)
    const result = calculatePoliceCapitalPayout(DEFAULTS, acc.contractValue, acc.totalContributions)
    expect(result.unterschiedsbetrag).toBe(Math.max(0, acc.contractValue - acc.totalContributions))
  })

  it('netto = brutto - tax', () => {
    const acc = calculatePolice(DEFAULTS)
    const result = calculatePoliceCapitalPayout(DEFAULTS, acc.contractValue, acc.totalContributions)
    expect(result.netto).toBeCloseTo(result.brutto - result.tax, 1)
  })
})

describe('calculatePoliceRente', () => {
  it('produces Bruttorente ≈ 4,073 €/Monat (±0.1%)', () => {
    const acc = calculatePolice(DEFAULTS)
    const result = calculatePoliceRente(DEFAULTS, acc.contractValue)
    const tolerance = 4073 * 0.001
    expect(Math.abs(result.bruttoMonatsrente - 4073)).toBeLessThan(tolerance)
  })

  it('produces Nettorente ≈ 3,761 €/Monat (±0.1%)', () => {
    const acc = calculatePolice(DEFAULTS)
    const result = calculatePoliceRente(DEFAULTS, acc.contractValue)
    const tolerance = 3761 * 0.001
    expect(Math.abs(result.nettoMonatsrente - 3761)).toBeLessThan(tolerance)
  })

  it('Bruttorente = contractValue / 10000 * rentenfaktor', () => {
    const acc = calculatePolice(DEFAULTS)
    const result = calculatePoliceRente(DEFAULTS, acc.contractValue)
    expect(result.bruttoMonatsrente).toBeCloseTo(acc.contractValue / 10000 * DEFAULTS.rentenfaktor, 2)
  })

  it('tax = bruttoMonatsrente * ertragsanteil * grenzsteuersatz', () => {
    const acc = calculatePolice(DEFAULTS)
    const result = calculatePoliceRente(DEFAULTS, acc.contractValue)
    expect(result.monthlyTax).toBeCloseTo(
      result.bruttoMonatsrente * DEFAULTS.ertragsanteil * DEFAULTS.grenzsteuersatz, 2
    )
  })
})
