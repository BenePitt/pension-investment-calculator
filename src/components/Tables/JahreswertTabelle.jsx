import { formatEuro } from '../../utils/formatters.js'

export default function JahreswertTabelle({ results }) {
  if (!results) return null
  const { depotRealistic, policeAccumulation, params } = results
  const startAge = params.alterAktuell
  const showVP = params.vorabpauschaleMode !== 'deaktiviert'

  return (
    <section className="table-section" aria-label="Jahreswerte Depot und Police">
      <h3>Jahreswerte: Depot (realistisch) und Police</h3>
      {showVP && (
        <p className="table-note">
          Eff. Jahresbelastung = Jahres-Sparrate + VP-Steuer (Vorabpauschalen-Steuer aus Einkommen, nicht aus Fondsvermögen)
        </p>
      )}
      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th scope="col">Jahr</th>
              <th scope="col">Alter</th>
              <th scope="col">Jahres-Sparrate</th>
              {showVP && <th scope="col">VP-Steuer (Jahr)</th>}
              {showVP && <th scope="col">Eff. Jahresbelastung</th>}
              <th scope="col">Depot (vor finaler Steuer)</th>
              <th scope="col">Police-Guthaben</th>
            </tr>
          </thead>
          <tbody>
            {depotRealistic.yearlyData.map((row, i) => {
              const polRow = policeAccumulation.yearlyData[i]
              const effectiveBurden = (row.yearlyContributions ?? 0) + (row.taxVP ?? 0)
              return (
                <tr key={row.year}>
                  <td>{row.year}</td>
                  <td>{startAge + row.year}</td>
                  <td>{formatEuro(row.yearlyContributions ?? 0)}</td>
                  {showVP && <td>{row.taxVP > 0 ? formatEuro(row.taxVP) : '–'}</td>}
                  {showVP && (
                    <td style={{ fontWeight: row.taxVP > 0 ? '600' : 'normal' }}>
                      {formatEuro(effectiveBurden)}
                    </td>
                  )}
                  <td>{formatEuro(row.depotwertEOY)}</td>
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
