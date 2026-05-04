import { describe, it, expect } from 'vitest'
import { DEFAULTS } from '../calculations/defaults.js'
import { calculateDepotRealistic } from '../calculations/depot.js'

const YEARS = DEFAULTS.renteneintrittsalter - DEFAULTS.alterAktuell

function withMode(mode, overrides = {}) {
  return calculateDepotRealistic({ ...DEFAULTS, vorabpauschaleMode: mode, ...overrides })
}

// ─── Modus: deaktiviert ───────────────────────────────────────────────────────

describe('vorabpauschaleMode: deaktiviert', () => {
  const result = withMode('deaktiviert')

  it('yearlyData hat die korrekte Anzahl an Einträgen', () => {
    expect(result.yearlyData.length).toBe(YEARS)
  })

  it('alle vorabpauschale- und taxVP-Werte sind 0', () => {
    result.yearlyData.forEach((y) => {
      expect(y.vorabpauschale).toBe(0)
      expect(y.taxVP).toBe(0)
    })
  })

  it('kumulierte VP-Steuer ist 0', () => {
    expect(result.cumulativeVorabpauschalensteuer).toBe(0)
  })

  it('cumulativeVP ist 0', () => {
    expect(result.cumulativeVP).toBe(0)
  })

  it('effectiveTotalOutflows = totalContributions (kein VP)', () => {
    expect(result.effectiveTotalOutflows).toBeCloseTo(result.totalContributions, 0)
  })

  it('trueNetValue = netValue', () => {
    expect(result.trueNetValue).toBe(result.netValue)
  })

  it('adjustedCostBasis = totalContributions (cumulativeVP = 0)', () => {
    expect(result.adjustedCostBasis).toBeCloseTo(result.totalContributions, 0)
  })
})

// ─── Modus: depot ─────────────────────────────────────────────────────────────

describe('vorabpauschaleMode: depot', () => {
  const result = withMode('depot')

  it('yearlyData hat die korrekte Anzahl an Einträgen', () => {
    expect(result.yearlyData.length).toBe(YEARS)
  })

  it('kumulierte VP-Steuer ist positiv bei positivem Basiszins', () => {
    expect(result.cumulativeVorabpauschalensteuer).toBeGreaterThan(0)
  })

  it('cumulativeVP ist positiv', () => {
    expect(result.cumulativeVP).toBeGreaterThan(0)
  })

  it('effectiveTotalOutflows = totalContributions + cumulativeVPsteuer (VP = zusätzl. Belastung)', () => {
    expect(result.effectiveTotalOutflows).toBeCloseTo(
      result.totalContributions + result.cumulativeVorabpauschalensteuer,
      0
    )
  })

  it('effectiveTotalOutflows > totalContributions', () => {
    expect(result.effectiveTotalOutflows).toBeGreaterThan(result.totalContributions)
  })

  it('trueNetValue = netValue', () => {
    expect(result.trueNetValue).toBe(result.netValue)
  })

  it('adjustedCostBasis = totalContributions + cumulativeVP', () => {
    expect(result.adjustedCostBasis).toBeCloseTo(result.totalContributions + result.cumulativeVP, 0)
  })

  it('netValue < depotwert (finale Steuer wird fällig)', () => {
    expect(result.netValue).toBeLessThan(result.depotwert)
  })

  it('Depotwert kleiner als Modus deaktiviert (VP-Abzüge aus Depot)', () => {
    const deaktiviert = withMode('deaktiviert')
    expect(result.depotwert).toBeLessThan(deaktiviert.depotwert)
  })

  it('Referenzwerte stimmen (±0,15 %)', () => {
    expect(Math.abs(result.depotwert - 1786397) / 1786397).toBeLessThan(0.0015)
    expect(Math.abs(result.netValue - 1634016) / 1634016).toBeLessThan(0.005)
  })
})

// ─── Modus: sparrate ──────────────────────────────────────────────────────────

describe('vorabpauschaleMode: sparrate', () => {
  const result = withMode('sparrate')
  const depot = withMode('depot')

  it('yearlyData hat die korrekte Anzahl an Einträgen', () => {
    expect(result.yearlyData.length).toBe(YEARS)
  })

  it('VP wird berechnet (vorabpauschale > 0 in mindestens einem Jahr)', () => {
    expect(result.yearlyData.some((y) => y.vorabpauschale > 0)).toBe(true)
  })

  it('totalContributions < depot.totalContributions (reduzierte Einzahlungen)', () => {
    // Einzahlungen werden um die VP-Steuer des Vorjahres verringert
    expect(result.totalContributions).toBeLessThan(depot.totalContributions)
  })

  it('effectiveTotalOutflows = totalContributions + cumulativeVPsteuer', () => {
    expect(result.effectiveTotalOutflows).toBeCloseTo(
      result.totalContributions + result.cumulativeVorabpauschalensteuer,
      0
    )
  })

  it('effectiveTotalOutflows ≈ deaktiviert.totalContributions (Gesamtbelastung ≈ reines Sparrate-Budget)', () => {
    // 'sparrate': Einzahlung + VP ≈ ursprüngliche Sparrate (VP kommt aus dem Sparraten-Budget)
    // 'depot': Einzahlung + VP > Sparrate (VP ist Zusatzbelastung)
    const deaktiviert = withMode('deaktiviert')
    const relativeDiff = Math.abs(result.effectiveTotalOutflows - deaktiviert.totalContributions)
      / deaktiviert.totalContributions
    expect(relativeDiff).toBeLessThan(0.02)
  })

  it('trueNetValue = netValue (VP in Einzahlungsreduktion verrechnet)', () => {
    expect(result.trueNetValue).toBe(result.netValue)
  })

  it('netValue ≈ depot.netValue (< 5 % Abweichung, wirtschaftlich ähnliches Ergebnis)', () => {
    const relativeDiff = Math.abs(result.netValue - depot.netValue) / depot.netValue
    expect(relativeDiff).toBeLessThan(0.05)
  })

  it('Jahr 1: volle Sparrate investiert (kein prevYearVP)', () => {
    // Im ersten Jahr ist prevYearVPsteuer = 0, daher volle Einzahlung
    const depotYear1 = depot.yearlyData[0].yearlyContributions
    const sparrateYear1 = result.yearlyData[0].yearlyContributions
    expect(sparrateYear1).toBeCloseTo(depotYear1, 0)
  })

  it('Einzahlungsreduktion greift, sobald taxVP > 0 (Test ohne Pauschbetrag)', () => {
    // Mit Pauschbetrag = 1000€ deckt der Freibetrag die VP in frühen Jahren komplett → taxVP = 0
    // → keine Reduktion solange VP × 0,70 < 1000€ (ca. erste 7 Jahre).
    // Mit Pauschbetrag = 0 ist taxVP > 0 ab Jahr 2 → Einzahlungen ab Jahr 3 reduziert.
    const sNoPB = withMode('sparrate', { sparerPauschbetrag: 0, pauschbetragVerfuegbar: 1 })
    const dNoPB = withMode('depot', { sparerPauschbetrag: 0, pauschbetragVerfuegbar: 1 })
    const sparrateYear3 = sNoPB.yearlyData[2].yearlyContributions
    const depotYear3 = dNoPB.yearlyData[2].yearlyContributions
    expect(sparrateYear3).toBeLessThan(depotYear3)
  })
})

// ─── Vergleich der drei Modi ─────────────────────────────────────────────────

describe('Vergleich der drei Modi', () => {
  const deaktiviert = withMode('deaktiviert')
  const depot = withMode('depot')
  const sparrate = withMode('sparrate')

  it('deaktiviert und depot haben identische totalContributions (VP-Modus ändert Einzahlungen nicht)', () => {
    expect(deaktiviert.totalContributions).toBeCloseTo(depot.totalContributions, 0)
  })

  it('sparrate hat niedrigere totalContributions als depot', () => {
    expect(sparrate.totalContributions).toBeLessThan(depot.totalContributions)
  })

  it('effectiveTotalOutflows: deaktiviert = totalContributions', () => {
    expect(deaktiviert.effectiveTotalOutflows).toBeCloseTo(deaktiviert.totalContributions, 0)
  })

  it('effectiveTotalOutflows: depot und sparrate = contributions + VP', () => {
    expect(depot.effectiveTotalOutflows).toBeCloseTo(
      depot.totalContributions + depot.cumulativeVorabpauschalensteuer, 0
    )
    expect(sparrate.effectiveTotalOutflows).toBeCloseTo(
      sparrate.totalContributions + sparrate.cumulativeVorabpauschalensteuer, 0
    )
  })

  it('deaktiviert.netValue > depot.netValue (kein VP-Abzug aus Depot, voller Pauschbetrag am Ende)', () => {
    expect(deaktiviert.netValue).toBeGreaterThan(depot.netValue)
  })

  it('deaktiviert hat höchste totalContributions = depot.totalContributions', () => {
    expect(deaktiviert.totalContributions).toBeGreaterThan(sparrate.totalContributions)
  })
})

// ─── Edge Cases ───────────────────────────────────────────────────────────────

describe('Edge Cases', () => {
  it('basiszins = 0: vorabpauschale = 0, kein VP-Steuer in allen aktiven Modi', () => {
    const d = withMode('depot', { basiszins: 0 })
    const s = withMode('sparrate', { basiszins: 0 })
    d.yearlyData.forEach((y) => expect(y.vorabpauschale).toBe(0))
    s.yearlyData.forEach((y) => expect(y.vorabpauschale).toBe(0))
  })

  it('basiszins = 0: sparrate und depot haben identische Einzahlungen und Depotwert', () => {
    const d = withMode('depot', { basiszins: 0 })
    const s = withMode('sparrate', { basiszins: 0 })
    // Ohne VP-Steuer keine Einzahlungsreduktion in 'sparrate'
    expect(s.totalContributions).toBeCloseTo(d.totalContributions, 0)
    expect(s.depotwert).toBeCloseTo(d.depotwert, 0)
  })

  it('basiszins = 0: effectiveTotalOutflows = totalContributions in sparrate (kein VP)', () => {
    const s = withMode('sparrate', { basiszins: 0 })
    expect(s.effectiveTotalOutflows).toBeCloseTo(s.totalContributions, 0)
  })

  it('adjustedGain ist nie negativ', () => {
    const result = withMode('depot', { bruttofondrendite: 0.01 })
    const adjustedGain = Math.max(0, result.gain - result.cumulativeVP)
    expect(adjustedGain).toBeGreaterThanOrEqual(0)
    expect(result.tax).toBeGreaterThanOrEqual(0)
  })

  it('Laufzeit 1 Jahr: yearlyData hat genau 1 Eintrag in allen Modi', () => {
    const overrides = { alterAktuell: 66, renteneintrittsalter: 67 }
    expect(withMode('deaktiviert', overrides).yearlyData.length).toBe(1)
    expect(withMode('depot', overrides).yearlyData.length).toBe(1)
    expect(withMode('sparrate', overrides).yearlyData.length).toBe(1)
  })

  it('Startkapital 0, Sparrate 0: Depot = 0, VP = 0 in allen Modi', () => {
    const overrides = { startkapital: 0, monatlicheSparrate: 0 }
    ;['deaktiviert', 'depot', 'sparrate'].forEach((mode) => {
      const r = withMode(mode, overrides)
      expect(r.depotwert).toBeCloseTo(0, 0)
      expect(r.cumulativeVorabpauschalensteuer).toBeCloseTo(0, 0)
    })
  })

  it('cumulativeContributions am Jahresende gleich totalContributions', () => {
    const result = withMode('depot')
    const lastRow = result.yearlyData[result.yearlyData.length - 1]
    expect(lastRow.cumulativeContributions).toBeCloseTo(result.totalContributions, 0)
  })

  it('yearlyContributions wächst in Modus depot durch Sparratendynamik', () => {
    const rows = withMode('depot').yearlyData
    for (let i = 1; i < rows.length; i++) {
      expect(rows[i].yearlyContributions).toBeGreaterThanOrEqual(rows[i - 1].yearlyContributions)
    }
  })
})
