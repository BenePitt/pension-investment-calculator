export default function KpiCard({ label, value, sub, accent = false, warning = false }) {
  return (
    <div className={`kpi-card${accent ? ' kpi-card--accent' : ''}${warning ? ' kpi-card--warning' : ''}`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value">{value}</div>
      {sub && <div className="kpi-sub">{sub}</div>}
    </div>
  )
}
