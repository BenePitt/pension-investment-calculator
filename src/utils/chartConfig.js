import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Filler,
  Tooltip,
  Legend,
  Title,
} from 'chart.js'

export function registerChartDefaults() {
  Chart.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Filler,
    Tooltip,
    Legend,
    Title
  )

  Chart.defaults.font.family = 'system-ui, -apple-system, sans-serif'
  Chart.defaults.font.size = 12
  Chart.defaults.color = '#374151'
  Chart.defaults.plugins.legend.position = 'bottom'
}

export const COLORS = {
  depot: '#2563eb',
  depotLight: 'rgba(37,99,235,0.15)',
  depotRealistic: '#1d4ed8',
  police: '#16a34a',
  policeLight: 'rgba(22,163,74,0.15)',
  contributions: '#6b7280',
  contributionsLight: 'rgba(107,114,128,0.15)',
  tax: '#dc2626',
  taxLight: 'rgba(220,38,38,0.2)',
  breakeven: '#d97706',
  neutral: '#9ca3af',
}

export function euroTooltip(context) {
  const value = context.raw
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }).format(value)
}

export const commonLineOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    tooltip: {
      callbacks: {
        label: (ctx) => `${ctx.dataset.label}: ${new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(ctx.raw)}`,
      },
    },
  },
  scales: {
    y: {
      ticks: {
        callback: (v) => new Intl.NumberFormat('de-DE', { notation: 'compact', maximumFractionDigits: 1 }).format(v) + ' €',
      },
    },
  },
}
