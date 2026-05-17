import { useEffect, useMemo, useState } from 'react'
import './credit-analysis.css'
import { AdminLayout } from './AdminLayout'
import { fetchAdminDashboard, type AdminGradeRow } from '../../lib/backendApi'

type DataRow = AdminGradeRow

export function CreditAnalysisAdmin() {
  const [year] = useState(2026)
  const [month] = useState('Ene')
  const [city, setCity] = useState('Todo Bolivia')
  const [hovered, setHovered] = useState<string | null>(null)
  const [data, setData] = useState<DataRow[]>([])
  const [insight, setInsight] = useState('')
  const [analisisNotas, setAnalisisNotas] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let alive = true

    async function loadDashboard() {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetchAdminDashboard({ year, city })
        if (!alive) {
          return
        }

        setData(response.grades)
        setInsight(response.insight)
        setAnalisisNotas(response.analisis_notas ?? '')
      } catch (loadError) {
        if (!alive) {
          return
        }

        setError(loadError instanceof Error ? loadError.message : 'No se pudo cargar el panel admin.')
      } finally {
        if (alive) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()

    return () => {
      alive = false
    }
  }, [year, city])

  const max = useMemo(() => Math.max(...data.map((d) => d.count), 1), [data])

  return (
    <AdminLayout>
      <div className="credit-admin">
        <div className="credit-admin__top card-surface">
          <div className="credit-admin__brand">
            <div className="credit-admin__logo" aria-hidden>
              <svg viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#1a5336" />
                <path d="M8 12h8v1H8z" fill="#fff" />
              </svg>
            </div>
            <div>
              <h2>Análisis Crediticio</h2>
              <p className="credit-admin__subtitle">Vista Web Administrador</p>
            </div>
          </div>

          <div className="credit-admin__filters">
            <label>
              Año
              <select value={year} onChange={() => {}}>
                <option value={2026}>2026</option>
              </select>
            </label>

            <label>
              Mes
              <select value={month} onChange={() => {}}>
                <option value="Ene">Ene</option>
              </select>
            </label>

            <label>
              Ciudad
              <select value={city} onChange={(e) => setCity(e.target.value)}>
                <option>Todo Bolivia</option>
                <option>La Paz</option>
                <option>Santa Cruz</option>
                <option>Cochabamba</option>
              </select>
            </label>
          </div>
        </div>

        <div className="credit-admin__grid">
          <aside className="credit-admin__left card-surface">
            <h2 className="credit-admin__panel-title">Distribución de cartera (ASFI)</h2>
            <table className="credit-admin__table">
              <thead>
                <tr>
                  <th>Calificación</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {data.map((r) => (
                  <tr key={r.grade}>
                    <td>{r.grade}</td>
                    <td>{r.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </aside>

          <section className="credit-admin__center card-surface">
            <h2 className="credit-admin__panel-title">Mora nacional — {year} {month}</h2>

            <div className="credit-admin__chart-wrap">
              {isLoading ? (
                <p>Cargando estadísticas...</p>
              ) : error ? (
                <p>{error}</p>
              ) : (
                <svg className="credit-admin__chart" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
                  {data.map((d, i) => {
                    const x = 60 + i * 80
                    const barHeight = (d.count / max) * 200
                    const y = 240 - barHeight
                    return (
                      <g key={d.grade}>
                        <rect
                          x={x}
                          y={y}
                          width={48}
                          height={barHeight}
                          rx={6}
                          className={`credit-admin__bar ${hovered === d.grade ? 'is-hover' : ''}`}
                          onMouseEnter={() => setHovered(d.grade)}
                          onMouseLeave={() => setHovered(null)}
                        />
                        <text x={x + 24} y={260} textAnchor="middle" className="credit-admin__bar-label">
                          {d.grade}
                        </text>
                        {hovered === d.grade && (
                          <g>
                            <rect x={x - 8} y={y - 42} width={120} height={36} rx={8} className="credit-admin__tooltip" />
                            <text x={x + 4} y={y - 20} className="credit-admin__tooltip-text">
                              {d.count.toLocaleString()} clientes
                            </text>
                          </g>
                        )}
                      </g>
                    )
                  })}
                  <line x1={40} y1={260} x2={560} y2={260} stroke="#e6e8ea" strokeWidth={1} />
                </svg>
              )}
            </div>
          </section>

          <aside className="credit-admin__right card-surface">
            <h2 className="credit-admin__panel-title">Informe {year} {month}</h2>
            <div className="credit-admin__report">
              <p>{isLoading ? 'Generando interpretación...' : insight || 'Sin observaciones para el periodo.'}</p>

              <div className="credit-admin__notes">
                <label>Notas del analista</label>
                <p>{analisisNotas || 'No hay notas disponibles.'}</p>
                <textarea placeholder="Agrega anotaciones e interpretaciones..." />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </AdminLayout>
  )
}

export default CreditAnalysisAdmin
