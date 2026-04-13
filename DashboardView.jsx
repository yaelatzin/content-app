import { useMemo } from 'react'

function fmtDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

export default function DashboardView({ projects, setView }) {
  const stats = useMemo(() => {
    const total    = projects.length
    const done     = projects.filter(p => p.status === 'Publicado').length
    const pending  = projects.filter(p => p.status === 'No empezado').length
    const progress = total ? Math.round((done / total) * 100) : 0
    return { total, done, pending, progress }
  }, [projects])

  const upcoming = useMemo(() => {
    const today = new Date()
    return projects
      .filter(p => p.status !== 'Publicado' && p.due)
      .sort((a, b) => new Date(a.due) - new Date(b.due))
      .slice(0, 4)
      .map(p => {
        const due  = new Date(p.due)
        const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24))
        return { ...p, diff }
      })
  }, [projects])

  const recent = useMemo(() =>
    projects.filter(p => p.status === 'Publicado')
      .sort((a, b) => new Date(b.completed || 0) - new Date(a.completed || 0))
      .slice(0, 4),
    [projects]
  )

  return (
    <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 className="anton" style={{ fontSize: '22px' }}>Resumen</h1>
        <span className="badge">
          {new Date().toLocaleDateString('es-MX', { month: 'long', year: 'numeric' })}
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '8px', marginBottom: '20px' }}>
        {[
          { label: 'Total',      value: stats.total,   color: 'var(--text)' },
          { label: 'Publicados', value: stats.done,    color: 'var(--green)' },
          { label: 'Pendientes', value: stats.pending, color: 'var(--amber)' },
        ].map(s => (
          <div key={s.label} className="card" style={{ padding: '14px 12px' }}>
            <div style={{ fontSize: '10px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
              {s.label}
            </div>
            <div style={{ fontSize: '26px', fontWeight: 800, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Progreso general
        </div>
        <div style={{ height: '8px', background: 'var(--surface2)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: '4px',
            background: 'linear-gradient(90deg, var(--accent), var(--green))',
            width: `${stats.progress}%`, transition: 'width .6s ease'
          }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
          <span style={{ fontSize: '11px', color: 'var(--text3)' }}>0%</span>
          <span style={{ fontSize: '11px', color: 'var(--accent)', fontWeight: 600 }}>{stats.progress}%</span>
          <span style={{ fontSize: '11px', color: 'var(--text3)' }}>100%</span>
        </div>
      </div>

      <div style={{ marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Próximos a vencer
        </div>
        <button onClick={() => setView('projects')} style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: '11px', cursor: 'pointer', fontFamily: 'Montserrat, sans-serif' }}>
          Ver todos →
        </button>
      </div>

      {upcoming.length === 0
        ? <div className="empty-state">No hay proyectos próximos</div>
        : upcoming.map(p => {
            const col = p.diff < 0 ? 'var(--red)' : p.diff <= 3 ? 'var(--amber)' : 'var(--green)'
            const label = p.diff < 0 ? `Vencido ${Math.abs(p.diff)}d` : p.diff === 0 ? 'Hoy' : `${p.diff}d`
            return (
              <div key={p.id} className="card" style={{ marginBottom: '8px', padding: '12px 14px', cursor: 'pointer' }}
                onClick={() => setView('projects')}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <span className="anton" style={{ fontSize: '14px', flex: 1 }}>{p.title}</span>
                  <span style={{ fontSize: '11px', color: col, fontFamily: 'DM Mono, monospace', flexShrink: 0 }}>{label}</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '4px', fontFamily: 'DM Mono, monospace' }}>
                  Vence {fmtDate(p.due)}
                </div>
              </div>
            )
          })
      }

      {recent.length > 0 && (
        <>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '24px', marginBottom: '10px' }}>
            Publicados recientemente
          </div>
          {recent.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--green)', flexShrink: 0 }} />
              <span style={{ fontSize: '13px', flex: 1 }}>{p.title}</span>
              <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>
                {fmtDate(p.completed)}
              </span>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
