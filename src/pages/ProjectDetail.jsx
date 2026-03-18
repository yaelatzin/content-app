import { useState } from 'react'
import { supabase } from '../lib/supabase'

const STATUS_CLASS = {
  'Completed':  'pill-completed',
  'Not Started':'pill-notstarted',
  'In Progress':'pill-inprogress',
  'Cancelled':  'pill-cancelled',
}

function fmtDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

export default function ProjectDetail({ project, workstreams, onClose, onEdit, onDelete, onStatusChange, toast }) {
  const [deleting, setDeleting] = useState(false)
  const ws = workstreams.find(w => w.id === project.workstream_id)

  async function handleDelete() {
    if (!window.confirm('¿Eliminar este proyecto?')) return
    setDeleting(true)
    const { error } = await supabase.from('projects').delete().eq('id', project.id)
    if (!error) { toast('Proyecto eliminado'); onDelete() }
    else { toast(error.message, 'error'); setDeleting(false) }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'var(--bg)',
      overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
      animation: 'slideUp .2s ease'
    }}>

      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none',
          color: 'var(--text2)', cursor: 'pointer',
          fontSize: '22px', lineHeight: 1, padding: '0 4px'
        }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: 700, flex: 1 }}>Detalle del proyecto</span>
        <span className={`pill ${STATUS_CLASS[project.status] || 'pill-empty'}`}>
          {project.status || 'Sin estado'}
        </span>
      </div>

      {/* Content */}
      <div style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto', width: '100%', flex: 1 }}>

        {/* Title */}
        <h1 style={{ fontSize: '22px', fontWeight: 800, lineHeight: 1.3, marginBottom: '12px' }}>
          {project.title}
        </h1>

        {/* Meta */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {ws && (
            <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>
              {ws.name}
            </span>
          )}
          <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>
            Inicio {fmtDate(project.started)}
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>
            Vence {fmtDate(project.due)}
          </span>
          {project.completed && (
            <span style={{ fontSize: '11px', color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>
              ✓ Completado {fmtDate(project.completed)}
            </span>
          )}
        </div>

        {/* Descripción */}
        {project.description && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Descripción
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7 }}>
              {project.description}
            </p>
          </div>
        )}

        {/* Guion */}
        {project.script && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Guion
            </div>
            <div style={{
              fontSize: '14px', color: 'var(--text2)', lineHeight: 1.8,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '16px',
              whiteSpace: 'pre-wrap'
            }}>
              {project.script}
            </div>
          </div>
        )}

        {!project.description && !project.script && (
          <div className="empty-state">Este proyecto no tiene descripción ni guion aún.</div>
        )}
      </div>

      {/* Footer — Status + acciones */}
      <div style={{
        position: 'sticky', bottom: 0,
        background: 'var(--bg)',
        borderTop: '1px solid var(--border)',
        padding: '16px 20px 32px',
        maxWidth: '480px', margin: '0 auto', width: '100%'
      }}>

        {/* Quick status */}
        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Cambiar status
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {['Not Started', 'In Progress', 'Completed', 'Cancelled'].map(s => (
            <button key={s} onClick={() => onStatusChange(project.id, s)} style={{
              padding: '6px 12px', borderRadius: '8px', fontSize: '11px',
              fontFamily: 'Syne, sans-serif', cursor: 'pointer',
              border: project.status === s ? '1px solid var(--accent)' : '1px solid var(--border2)',
              background: project.status === s ? 'var(--accent-bg)' : 'transparent',
              color: project.status === s ? 'var(--accent)' : 'var(--text2)',
            }}>{s}</button>
          ))}
        </div>

        {/* Editar / Eliminar */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost btn-full" onClick={onEdit}>
            Editar
          </button>
          <button className="btn btn-danger btn-full" disabled={deleting} onClick={handleDelete}>
            {deleting ? '...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}