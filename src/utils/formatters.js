const euroFormat = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const euroFormatDec = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const percentFormat = new Intl.NumberFormat('de-DE', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

const numberFormat = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export function formatEuro(value) {
  if (value === null || value === undefined || isNaN(value)) return '–'
  return euroFormat.format(value)
}

export function formatEuroDec(value) {
  if (value === null || value === undefined || isNaN(value)) return '–'
  return euroFormatDec.format(value)
}

export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) return '–'
  return percentFormat.format(value)
}

export function formatPercentPt(value, decimals = 2) {
  if (value === null || value === undefined || isNaN(value)) return '–'
  const formatted = (value * 100).toFixed(decimals).replace('.', ',')
  return `${formatted} %`
}

export function formatNumber(value) {
  if (value === null || value === undefined || isNaN(value)) return '–'
  return numberFormat.format(value)
}
