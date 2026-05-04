import { formatEuro } from '../../utils/formatters.js'

export default function JahreswertTabelle({ results }) {
  if (!results) return null
  const { depotRealistic, policeAccumulation, params } = results
  const startAge = params.alterAktuell

  return (
    <section className="table-section" aria-label="Jahreswerte Depot und Police">
      <h3>Jahreswerte: Depot (realistisch) und Police</h3>
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Jahr</th>
              <th scope="col">Alter</th>
              <th scope="col">Kum. Einzahlungen</th>
              <th scope="col">Depot (vor finaler Steuer)</th>
              <th scope="col">VP-Steuer (Jahr)</th>
              <th scope="col">Police-Guthaben</th>
            </tr>
          </thead>
          <tbody>
            {depotRealistic.yearlyData.map((row, i) => {
              const polRow = policeAccumulation.yearlyData[i]
              return (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{startAge + row.year}</td>
                  <td>{formatEuro(row.cumulativeContributions)}</td>
                  <td>{formatEuro(row.depotwertEOY)}</td>
                  <td>{formatEuro(row.taxVP)}</td>
                  <td>{polRow ? formatEuro(polRow.contractValue) : '–'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
