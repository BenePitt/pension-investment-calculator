import { describe, it, expect } from 'vitest'
import {
  formatEuro,
  formatEuroDec,
  formatPercent,
  formatPercentPt,
  formatNumber,
} from '../utils/formatters.js'

// Node.js nutzt U+202F (schmales geschütztes Leerzeichen) vor dem €-Symbol.
// Wir normalisieren für Vergleiche auf ein normales Leerzeichen.
function norm(s) {
  return s.replace(/[  ]/g, ' ')
}

// ─── formatEuro ───────────────────────────────────────────────────────────────

describe('formatEuro', () => {
  it('enthält "1.000" und "€" für 1000', () => {
    const result = formatEuro(1000)
    expect(result).toContain('1.000')
    expect(result).toContain('€')
  })

  it('enthält "0" und "€" für 0', () => {
    const result = formatEuro(0)
    expect(result).toContain('0')
    expect(result).toContain('€')
  })

  it('enthält "−" oder "-" und "500" für -500', () => {
    const result = formatEuro(-500)
    expect(result).toContain('500')
    expect(result).toContain('€')
  })

  it('rundet 1234,99 auf 1235', () => {
    expect(formatEuro(1234.99)).toContain('1.235')
  })

  it('rundet 1234,49 auf 1234', () => {
    expect(formatEuro(1234.49)).toContain('1.234')
  })

  it('enthält "1.000.000" für 1 Million', () => {
    expect(formatEuro(1000000)).toContain('1.000.000')
  })

  it('gibt – zurück für null', () => {
    expect(formatEuro(null)).toBe('–')
  })

  it('gibt – zurück für undefined', () => {
    expect(formatEuro(undefined)).toBe('–')
  })

  it('gibt – zurück für NaN', () => {
    expect(formatEuro(NaN)).toBe('–')
  })

  it('Rückgabewert ist ein String', () => {
    expect(typeof formatEuro(42)).toBe('string')
  })
})

// ─── formatEuroDec ────────────────────────────────────────────────────────────

describe('formatEuroDec', () => {
  it('enthält ",50" und "1.234" für 1234,5', () => {
    const result = norm(formatEuroDec(1234.5))
    expect(result).toContain('1.234')
    expect(result).toContain(',50')
  })

  it('enthält ",00" für 0', () => {
    expect(norm(formatEuroDec(0))).toContain(',00')
  })

  it('gibt – zurück für null', () => {
    expect(formatEuroDec(null)).toBe('–')
  })

  it('gibt – zurück für NaN', () => {
    expect(formatEuroDec(NaN)).toBe('–')
  })
})

// ─── formatPercent ────────────────────────────────────────────────────────────

describe('formatPercent', () => {
  it('0,25 → enthält "25" und "%"', () => {
    const result = norm(formatPercent(0.25))
    expect(result).toContain('25')
    expect(result).toContain('%')
  })

  it('0 → enthält "0" und "%"', () => {
    const result = norm(formatPercent(0))
    expect(result).toContain('0')
    expect(result).toContain('%')
  })

  it('1 → enthält "100" und "%"', () => {
    const result = norm(formatPercent(1))
    expect(result).toContain('100')
    expect(result).toContain('%')
  })

  it('0,001 → enthält "0,10" (zwei Dezimalstellen)', () => {
    const result = norm(formatPercent(0.001))
    expect(result).toContain('0,10')
  })

  it('gibt – zurück für null', () => {
    expect(formatPercent(null)).toBe('–')
  })

  it('gibt – zurück für NaN', () => {
    expect(formatPercent(NaN)).toBe('–')
  })
})

// ─── formatPercentPt ─────────────────────────────────────────────────────────
// Diese Funktion nutzt manuelles .replace('.', ',') — keine Locale-Ambiguität.

describe('formatPercentPt', () => {
  it('0,07 → "7,00 %"', () => {
    expect(formatPercentPt(0.07)).toBe('7,00 %')
  })

  it('0 → "0,00 %"', () => {
    expect(formatPercentPt(0)).toBe('0,00 %')
  })

  it('−0,005 → "-0,50 %"', () => {
    expect(formatPercentPt(-0.005)).toBe('-0,50 %')
  })

  it('eine Dezimalstelle: 0,07 → "7,0 %"', () => {
    expect(formatPercentPt(0.07, 1)).toBe('7,0 %')
  })

  it('null Dezimalstellen: 0,07 → "7 %"', () => {
    expect(formatPercentPt(0.07, 0)).toBe('7 %')
  })

  it('gibt – zurück für null', () => {
    expect(formatPercentPt(null)).toBe('–')
  })

  it('gibt – zurück für NaN', () => {
    expect(formatPercentPt(NaN)).toBe('–')
  })
})

// ─── formatNumber ─────────────────────────────────────────────────────────────

describe('formatNumber', () => {
  it('1000 → enthält "1.000"', () => {
    expect(formatNumber(1000)).toContain('1.000')
  })

  it('0 → "0"', () => {
    expect(formatNumber(0)).toBe('0')
  })

  it('1234,7 → enthält "1.235" (gerundet)', () => {
    expect(formatNumber(1234.7)).toContain('1.235')
  })

  it('gibt – zurück für null', () => {
    expect(formatNumber(null)).toBe('–')
  })

  it('gibt – zurück für NaN', () => {
    expect(formatNumber(NaN)).toBe('–')
  })
})
