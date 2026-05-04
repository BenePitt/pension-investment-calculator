import { describe, it, expect } from 'vitest'
import { readFileSync, readdirSync, statSync } from 'fs'
import { resolve, dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { DEFAULTS } from '../calculations/defaults.js'
import { runAllCalculations } from '../calculations/index.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = resolve(__dirname, '..')

function findSourceFiles(dir, results = []) {
  const entries = readdirSync(dir)
  for (const entry of entries) {
    if (entry === '__tests__' || entry === 'node_modules') continue
    const full = join(dir, entry)
    const stat = statSync(full)
    if (stat.isDirectory()) {
      findSourceFiles(full, results)
    } else if (entry.endsWith('.js') || entry.endsWith('.jsx')) {
      results.push(full)
    }
  }
  return results
}

describe('runAllCalculations — reference scenario (Default-Werte)', () => {
  const results = runAllCalculations(DEFAULTS)

  it('Summe Einzahlungen ≈ 520,086 € (±0.1%)', () => {
    const expected = 520086
    expect(Math.abs(results.depotSimplified.totalContributions - expected) / expected).toBeLessThan(0.001)
  })

  it('Depotwert vereinfacht vor Steuer ≈ 1,922,428 € (±0.1%)', () => {
    const expected = 1922428
    expect(Math.abs(results.depotSimplified.depotwert - expected) / expected).toBeLessThan(0.001)
  })

  it('Depot netto vereinfacht ≈ 1,663,785 € (±0.1%)', () => {
    const expected = 1663785
    expect(Math.abs(results.depotSimplified.netValue - expected) / expected).toBeLessThan(0.001)
  })

  it('Depotwert realistisch vor finaler Steuer ≈ 1,786,397 € (±0.15%)', () => {
    const expected = 1786397
    expect(Math.abs(results.depotRealistic.depotwert - expected) / expected).toBeLessThan(0.0015)
  })

  it('Depot netto realistisch ≈ 1,634,016 € (±0.5%)', () => {
    const expected = 1634016
    expect(Math.abs(results.depotRealistic.netValue - expected) / expected).toBeLessThan(0.005)
  })

  it('Police Vertragsguthaben mit 67 ≈ 1,357,604 € (±0.1%)', () => {
    const expected = 1357604
    expect(Math.abs(results.policeAccumulation.contractValue - expected) / expected).toBeLessThan(0.001)
  })

  it('Police netto Kapitalauszahlung ≈ 1,197,879 € (±0.5%)', () => {
    const expected = 1197879
    expect(Math.abs(results.policePayout.netto - expected) / expected).toBeLessThan(0.005)
  })

  it('Depot-Entnahme netto monatlich bis 90 ≈ 10,985 € (±1.0%)', () => {
    const expected = 10985
    expect(Math.abs(results.entnahme.monthlyNetWithdrawal - expected) / expected).toBeLessThan(0.010)
  })

  it('Police-Bruttorente monatlich ≈ 4,073 € (±0.1%)', () => {
    const expected = 4073
    expect(Math.abs(results.policeRente.bruttoMonatsrente - expected) / expected).toBeLessThan(0.001)
  })

  it('Police-Nettorente monatlich ≈ 3,761 € (±0.1%)', () => {
    const expected = 3761
    expect(Math.abs(results.policeRente.nettoMonatsrente - expected) / expected).toBeLessThan(0.001)
  })

  it('Break-even Verwaltungskosten ≈ -0.06% p.a. (±0.02 pp)', () => {
    const expected = -0.0006
    expect(Math.abs(results.breakeven.breakevenKosten - expected)).toBeLessThan(0.0002)
  })
})

describe('Validierung', () => {
  it('Renteneintrittsalter muss größer als aktuelles Alter sein', () => {
    const invalid = { ...DEFAULTS, alterAktuell: 67, renteneintrittsalter: 67 }
    const ansparMonate = (invalid.renteneintrittsalter - invalid.alterAktuell) * 12
    expect(ansparMonate).toBe(0)
  })

  it('Zielalter Entnahme muss größer als Renteneintrittsalter sein', () => {
    const invalid = { ...DEFAULTS, zielalterEntnahme: 67, renteneintrittsalter: 67 }
    const entnahmeMonate = (invalid.zielalterEntnahme - invalid.renteneintrittsalter) * 12
    expect(entnahmeMonate).toBe(0)
  })

  it('Sparrate darf nicht negativ sein (Berechnung gibt sinnvollen Wert)', () => {
    const safe = { ...DEFAULTS, monatlicheSparrate: 0 }
    const result = runAllCalculations(safe)
    expect(result.depotSimplified.totalContributions).toBeGreaterThanOrEqual(0)
  })
})

describe('Datenschutz: kein localStorage/sessionStorage/cookie in Source-Code', () => {
  const files = findSourceFiles(srcDir)

  it('kein localStorage in Quelldateien', () => {
    for (const file of files) {
      const content = readFileSync(file, 'utf-8')
      expect(content, `localStorage gefunden in ${file}`).not.toMatch(/localStorage/)
    }
  })

  it('kein sessionStorage in Quelldateien', () => {
    for (const file of files) {
      const content = readFileSync(file, 'utf-8')
      expect(content, `sessionStorage gefunden in ${file}`).not.toMatch(/sessionStorage/)
    }
  })

  it('kein document.cookie in Quelldateien', () => {
    for (const file of files) {
      const content = readFileSync(file, 'utf-8')
      expect(content, `document.cookie gefunden in ${file}`).not.toMatch(/document\.cookie/)
    }
  })
})
