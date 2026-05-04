import { formatEuro } from '../../utils/formatters.js'

export default function EntnahmeTabelle({ results }) {
  if (!results) return null
  const { entnahme, params } = results
  const startAge = params.renteneintrittsalter

  return (
    <section className="table-section" aria-label="Entnahmeplan Jahreswerte">
      <h3>Depot-Entnahmeplan (Jahreswerte)</h3>
      <p className="table-note">⚠ Kein garantierter Plan – zeigt rechnerischen Verlauf bis Alter {params.zielalterEntnahme}.</p>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Jahr</th>
              <th scope="col">Alter</th>
              <th scope="col">Depot-Restwert</th>
              <th scope="col">Entnahme brutto/Jahr</th>
              <th scope="col">Entnahme netto/Jahr</th>
              <th scope="col">Steuer/Jahr</th>
            </tr>
          </thead>
          <tbody>
            {entnahme.yearlyData.map((row) => (
              <tr key={row.year}>
                <td>{row.year}</td>
                <td>{startAge + row.year - 1}</td>
                <td>{formatEuro(row.depotValue)}</td>
                <td>{formatEuro(row.annualGrossWithdrawal)}</td>
                <td>{formatEuro(row.annualNetWithdrawal)}</td>
                <td>{formatEuro(row.annualTax)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
