import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './credit-analysis.css'
import { AdminLayout } from './AdminLayout'
import { fetchAdminDashboard, type AdminDashboardResponse, type AdminGradeRow } from '../../lib/backendApi'

type DataRow = AdminGradeRow

function BarChartIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M5 19.25h14v1.5H5zM7 10.25h2.5v7H7zM10.75 7.25h2.5v10h-2.5zM14.5 12.25H17v5h-2.5z" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 4a3.25 3.25 0 1 1 0 6.5A3.25 3.25 0 0 1 12 4Zm-5.5 9c1.7 0 3.17.6 4.25 1.6 1.08-1 2.55-1.6 4.25-1.6 3.18 0 5.75 2.1 5.75 4.7v1.55H1.75V17.7C1.75 15.1 4.32 13 7.5 13Z" />
    </svg>
  )
}

function MoneyIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 6.5h16v11H4zm1.5 1.5v8h13V8Zm6.5 1.25c2.07 0 3.75 1.57 3.75 3.5s-1.68 3.5-3.75 3.5-3.75-1.57-3.75-3.5 1.68-3.5 3.75-3.5Zm0 1.5c-1.23 0-2.25.9-2.25 2s1.02 2 2.25 2 2.25-.9 2.25-2-1.02-2-2.25-2Z" />
    </svg>
  )
}

function formatCurrency(value: number) {
  return `${new Intl.NumberFormat('es-BO', { maximumFractionDigits: 0 }).format(value)} Bs.`
}

function insightFallback(summary: AdminDashboardResponse['summary']) {
  if (summary.retrasos_totales > 80) {
    return 'Se observa una concentracion alta de retrasos; conviene priorizar seguimiento de clientes con mayor antiguedad en mora.'
  }

  if (summary.promedio_dias_retraso > 25) {
    return 'El promedio de dias de retraso sigue presionando la cartera; una campana temprana de regularizacion puede reducir reincidencia.'
  }

  return 'La cartera mantiene un comportamiento estable; el foco puede ponerse en clientes con alertas tempranas y solicitudes abiertas.'
}

export function CreditAnalysisAdmin() {
  const navigate = useNavigate()
  const [year] = useState(2026)
  const [month] = useState('Ene')
  const [city, setCity] = useState('Todo Bolivia')
  const [hovered, setHovered] = useState<string | null>(null)
  const [data, setData] = useState<DataRow[]>([])
  const [dashboard, setDashboard] = useState<AdminDashboardResponse | null>(null)
  const [insight, setInsight] = useState('')
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

        setDashboard(response)
        setData(response.grades)
        setInsight(response.insight)
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
  const summary = dashboard?.summary

  return (
    <AdminLayout>
      <section className="credit-admin">
        <header className="credit-admin__hero card-surface">
          <div className="credit-admin__hero-copy">
            <p className="credit-admin__eyebrow">Mercantil AlivIA</p>
            <h2>Panel de cartera y seguimiento crediticio</h2>
            <p>
              Supervisa el comportamiento de la cartera, entra a la lista de creditos de usuarios y responde mas rapido a solicitudes pendientes.
            </p>

            <div className="credit-admin__hero-actions">
              <button type="button" className="credit-admin__primary-action" onClick={() => navigate('/admin/requests-users')}>
                Ver creditos de usuarios
              </button>
              <button type="button" className="credit-admin__secondary-action" onClick={() => navigate('/admin/requests-users')}>
                Revisar solicitudes
              </button>
            </div>
          </div>

          <div className="credit-admin__hero-side">
            <div className="credit-admin__filters">
              <label>
                Ano
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
        </header>

        <section className="credit-admin__metrics">
          <article className="credit-admin__metric card-surface">
            <span className="credit-admin__metric-icon credit-admin__metric-icon--primary">
              <PeopleIcon />
            </span>
            <p>Clientes monitoreados</p>
            <strong>{summary?.total_clientes.toLocaleString() ?? '--'}</strong>
          </article>

          <article className="credit-admin__metric card-surface">
            <span className="credit-admin__metric-icon credit-admin__metric-icon--secondary">
              <BarChartIcon />
            </span>
            <p>Retrasos totales</p>
            <strong>{summary?.retrasos_totales.toLocaleString() ?? '--'}</strong>
          </article>

          <article className="credit-admin__metric card-surface">
            <span className="credit-admin__metric-icon credit-admin__metric-icon--accent">
              <MoneyIcon />
            </span>
            <p>Mora total</p>
            <strong>{summary ? formatCurrency(summary.mora_total) : '--'}</strong>
          </article>

          <article className="credit-admin__metric card-surface">
            <span className="credit-admin__metric-icon credit-admin__metric-icon--muted">
              <BarChartIcon />
            </span>
            <p>Promedio dias mora</p>
            <strong>{summary?.promedio_dias_retraso ?? '--'}</strong>
          </article>
        </section>

        <section className="credit-admin__shortcuts">
          <button type="button" className="credit-admin__shortcut card-surface" onClick={() => navigate('/admin/requests-users')}>
            <span className="credit-admin__shortcut-label">Modulo</span>
            <strong>Creditos de usuarios</strong>
            <p>Entra a la lista completa y abre el detalle de cada caso.</p>
          </button>

          <button type="button" className="credit-admin__shortcut card-surface" onClick={() => navigate('/admin/requests-users')}>
            <span className="credit-admin__shortcut-label">Accion rapida</span>
            <strong>Solicitudes pendientes</strong>
            <p>Revisa prioridades altas, origen y estado del tramite.</p>
          </button>
        </section>

        <div className="credit-admin__grid">
          <aside className="credit-admin__panel card-surface">
            <div className="credit-admin__panel-head">
              <h3>Distribucion ASFI</h3>
              <span>{data.length} niveles</span>
            </div>

            <table className="credit-admin__table">
              <thead>
                <tr>
                  <th>Calificacion</th>
                  <th>Cantidad</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row) => (
                  <tr key={row.grade}>
                    <td>{row.grade}</td>
                    <td>{row.count.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </aside>

          <section className="credit-admin__panel card-surface">
            <div className="credit-admin__panel-head">
              <h3>Vista comparativa de cartera</h3>
              <span>{city}</span>
            </div>

            <div className="credit-admin__chart-wrap">
              {isLoading ? (
                <p className="credit-admin__state">Cargando estadisticas...</p>
              ) : error ? (
                <p className="credit-admin__state credit-admin__state--error">{error}</p>
              ) : (
                <svg className="credit-admin__chart" viewBox="0 0 600 320" preserveAspectRatio="xMidYMid meet">
                  {data.map((d, index) => {
                    const x = 60 + index * 80
                    const barHeight = (d.count / max) * 200
                    const y = 240 - barHeight

                    return (
                      <g key={d.grade}>
                        <rect
                          x={x}
                          y={y}
                          width={48}
                          height={barHeight}
                          rx={10}
                          className={`credit-admin__bar ${hovered === d.grade ? 'is-hover' : ''}`}
                          onMouseEnter={() => setHovered(d.grade)}
                          onMouseLeave={() => setHovered(null)}
                        />
                        <text x={x + 24} y={260} textAnchor="middle" className="credit-admin__bar-label">
                          {d.grade}
                        </text>
                        {hovered === d.grade && (
                          <g>
                            <rect x={x - 10} y={y - 44} width={126} height={36} rx={10} className="credit-admin__tooltip" />
                            <text x={x + 8} y={y - 21} className="credit-admin__tooltip-text">
                              {d.count.toLocaleString()} clientes
                            </text>
                          </g>
                        )}
                      </g>
                    )
                  })}
                  <line x1={40} y1={260} x2={560} y2={260} stroke="#d9dfda" strokeWidth={1} />
                </svg>
              )}
            </div>
          </section>

          <aside className="credit-admin__panel card-surface">
            <div className="credit-admin__panel-head">
              <h3>Lectura ejecutiva</h3>
              <span>{year} {month}</span>
            </div>

            <div className="credit-admin__insight">
              <p>{isLoading ? 'Generando interpretacion...' : insight || (summary ? insightFallback(summary) : 'Sin observaciones para el periodo.')}</p>
              <button type="button" className="credit-admin__link-action" onClick={() => navigate('/admin/requests-users')}>
                Ir a creditos y solicitudes
              </button>
            </div>
          </aside>
        </div>
      </section>
    </AdminLayout>
  )
}

export default CreditAnalysisAdmin
