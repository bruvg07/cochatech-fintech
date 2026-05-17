import { useMemo, useState } from 'react'
import './credit-analysis.css'

type DataRow = { grade: string; count: number }

export function CreditAnalysisAdmin() {
  const [year] = useState(2026)
  const [month] = useState('Ene')
  const [city, setCity] = useState('Todo Bolivia')
  const [hovered, setHovered] = useState<string | null>(null)

  // Example dataset (would come from API in real app)
  const data: DataRow[] = useMemo(
    () => [
      { grade: 'A', count: 12450 },
      { grade: 'B', count: 8420 },
      { grade: 'C', count: 4520 },
      { grade: 'D', count: 2140 },
      { grade: 'E', count: 860 },
      { grade: 'F', count: 210 }
    ],
    []
  )

  const max = Math.max(...data.map((d) => d.count))

  return (
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
            <h1>Análisis Crediticio</h1>
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

              {/* X axis baseline */}
              <line x1={40} y1={260} x2={560} y2={260} stroke="#e6e8ea" strokeWidth={1} />
            </svg>
          </div>
        </section>

        <aside className="credit-admin__right card-surface">
          <h2 className="credit-admin__panel-title">Informe {year} {month}</h2>
          <div className="credit-admin__report">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero.
              Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet.
            </p>

            <div className="credit-admin__notes">
              <label>Notas del analista</label>
              <textarea placeholder="Agrega anotaciones e interpretaciones..." />
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

export default CreditAnalysisAdmin
