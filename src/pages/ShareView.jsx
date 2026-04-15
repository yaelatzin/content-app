import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

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
    supabase
      .from('projects')
      .select('id, title, description, status, started, due, script')
      .eq('id', id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) setError('Idea no encontrada.')
        else setProject(data)
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

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <svg width="28" height="28" viewBox="0 0 147.73 133.36" xmlns="http://www.w3.org/2000/svg">
          <path fill="#f4ba15" d="M24.64,76.31L0,1.85h21.67l13.89,47.6h.37L49.83,1.85h19.82l-24.64,74.46v55.2h-20.38v-55.2Z"/>
          <path fill="#f4ba15" d="M94.76,124.94c-5.19-5.62-7.78-13.68-7.78-24.17V32.6c0-10.49,2.59-18.55,7.78-24.17,5.19-5.62,12.72-8.43,22.6-8.43s17.41,2.81,22.6,8.43c5.19,5.62,7.78,13.68,7.78,24.17v11.11h-19.26v-12.41c0-8.52-3.52-12.78-10.56-12.78s-10.56,4.26-10.56,12.78v70.94c0,8.4,3.52,12.59,10.56,12.59s10.56-4.2,10.56-12.59v-25.38h-10.19v-18.52h29.45v42.42c0,10.5-2.59,18.55-7.78,24.17-5.19,5.62-12.72,8.43-22.6,8.43s-17.41-2.81-22.6-8.43Z"/>
        </svg>
        <span style={{ fontSize: '13px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>idea compartida</span>
      </div>

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