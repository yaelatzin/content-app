import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const publicSupabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_ANON_KEY,
  { global: { headers: {} }, auth: { persistSession: false } }
)

function fmtDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

const STATUS_CLASS = {
  'No empezado': 'pill-notstarted',
  'En guión':    'pill-inprogress',
  'Grabado':     'pill-grabado',
  'En edición':  'pill-edicion',
  'Publicado':   'pill-completed',
}

export default function ShareView() {
  const [project, setProject] = useState(null)
  const [error, setError]     = useState(null)

  useEffect(() => {
  const id = new URLSearchParams(window.location.search).get('id')
  if (!id) { setError('Link inválido.'); return }

  // Validar que sea un UUID real antes de consultar
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) { setError('Link inválido.'); return }

  publicSupabase
    .from('projects')
    .select('id, title, description, status, started, due, script')
    .eq('id', id)
    .maybeSingle()
    .then(({ data, error }) => {
      if (error) { setError('Error al cargar la idea.'); return }
      if (!data)  { setError('Idea no encontrada.'); return }
      setProject(data)
    })
}, [])

  if (error) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text2)', fontFamily: 'Montserrat, sans-serif' }}>
      {error}
    </div>
  )

  if (!project) return (
    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text2)', fontFamily: 'Montserrat, sans-serif' }}>
      Cargando...
    </div>
  )

  return (
    <div style={{ padding: '24px', maxWidth: '480px', margin: '0 auto' }}>

      <svg width="48" height="48" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
		  <path fill="#f4ba15" d="M251.58,461.14c0-125.78,96.88-225.21,224.36-225.21,70.54,0,130.03,30.59,165.72,73.08,5.95,6.8,10.2,16.15,10.2,23.8,0,18.69-14.45,31.44-34,31.44-12.75,0-19.55-6.8-28.89-14.45-26.35-29.74-64.59-50.99-113.03-50.99-86.68,0-155.52,71.39-155.52,162.32s68.84,162.32,155.52,162.32c47.59,0,86.69-21.25,113.03-50.99,8.5-7.65,16.15-15.3,28.89-15.3,19.55,0,34,13.6,34,32.3,0,6.8-4.25,16.15-10.2,22.95-35.69,42.49-94.33,73.94-165.72,73.94-127.48,0-224.36-99.44-224.36-225.21Z"/>
		  <path fill="#f4ba15" d="M489.9,356.24c-61.96,1.97-106.75,52.29-107.57,113.7-.1,7.5-20.55,7.85-21.11-.11-5.28-74.41,54.98-136.09,128.39-136.94,8.65-.1,12.62,4.16,13.33,9.64,1.04,8.01-3.55,13.41-13.03,13.71Z"/>
		  <rect fill="#f4ba15" x="701.11" y="363.98" width="26.85" height="194.31" rx="13.43" ry="13.43"/>
		  <rect fill="#f4ba15" x="749.39" y="389.79" width="29.45" height="142.69" rx="13.43" ry="13.43"/>
		  <rect fill="#f4ba15" x="799.47" y="407.82" width="28.95" height="106.62" rx="13.43" ry="13.43"/>
		</svg>

      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px', marginBottom: '12px' }}>
          <h1 className="anton" style={{ fontSize: '18px', lineHeight: 1.3, margin: 0 }}>{project.title}</h1>
          {project.status && (
            <span className={`pill ${STATUS_CLASS[project.status] || 'pill-empty'}`} style={{ flexShrink: 0 }}>
              {project.status}
            </span>
          )}
        </div>

        {project.description && (
          <p style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '12px', lineHeight: 1.6 }}>
            {project.description}
          </p>
        )}

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {project.started && <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>Inicio {fmtDate(project.started)}</span>}
          {project.due     && <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>Vence {fmtDate(project.due)}</span>}
        </div>

        {project.script && (
          <div style={{ borderTop: '1px solid var(--border)', marginTop: '14px', paddingTop: '14px' }}>
            <p style={{ fontSize: '11px', color: 'var(--text3)', marginBottom: '8px', fontFamily: 'DM Mono, monospace' }}>GUIÓN</p>
            <p style={{ fontSize: '14px', color: 'var(--text)', lineHeight: 1.7, whiteSpace: 'pre-wrap', margin: 0 }}>{project.script}</p>
          </div>
        )}
      </div>

      <p style={{ fontSize: '11px', color: 'var(--text3)', textAlign: 'center', marginTop: '16px', fontFamily: 'DM Mono, monospace' }}>
        vista de solo lectura · no puedes editar esta idea
      </p>
    </div>
  )
}