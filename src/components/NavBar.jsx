import { useAuth } from '../hooks/useAuth'

const VIEWS = [
  { id: 'dashboard',    label: 'Dashboard' },
  { id: 'projects',     label: 'Proyectos' },
  { id: 'tasks',        label: 'Tareas' },
  { id: 'workstreams',  label: 'Workstreams' },
]

export default function NavBar({ currentView, setView }) {
  const { user, signOut } = useAuth()
  const initials = user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 100,
      background: 'var(--bg)',
      borderBottom: '1px solid var(--border)',
      paddingBottom: '0',
    }}>
      {/* Top row */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px 10px'
      }}>
        <span style={{
          fontFamily: 'DM Mono, monospace',
          fontSize: '13px', color: 'var(--accent)',
          letterSpacing: '0.08em'
        }}>CONTENT_APP</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px', color: 'var(--text3)'
          }}>
            {new Date().toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
          </span>
          <button
            onClick={signOut}
            title="Cerrar sesión"
            style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: 'var(--accent-bg)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent)',
              fontFamily: 'Syne, sans-serif',
              fontSize: '12px', fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title={`Cerrar sesión (${user?.email})`}
          >
            {initials}
          </button>
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{
        display: 'flex', gap: '4px',
        padding: '0 16px 12px',
        overflowX: 'auto',
      }}>
        {VIEWS.map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            style={{
              flexShrink: 0,
              padding: '6px 14px',
              borderRadius: '20px',
              border: currentView === v.id ? 'none' : '1px solid var(--border2)',
              background: currentView === v.id ? 'var(--accent)' : 'transparent',
              color: currentView === v.id ? '#0d0d0f' : 'var(--text2)',
              fontFamily: 'Syne, sans-serif',
              fontSize: '12px', fontWeight: currentView === v.id ? 700 : 400,
              cursor: 'pointer',
              transition: 'all .15s'
            }}
          >
            {v.label}
          </button>
        ))}
      </div>
    </div>
  )
}
