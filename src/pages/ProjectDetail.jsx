import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

const STATUS_CLASS = {
  'No empezado': 'pill-notstarted',
  'En guión':    'pill-inprogress',
  'Grabado':     'pill-grabado',
  'En edición':  'pill-edicion',
  'Publicado':   'pill-completed',
}

function fmtDate(d) {
  if (!d) return '—'
  const [y, m, day] = d.split('-')
  return `${day}/${m}/${y}`
}

export default function ProjectDetail({ project, workstreams, onClose, onEdit, onDelete, onStatusChange, toast }) {
  const { user } = useAuth()
  const [deleting, setDeleting] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [videoUrl, setVideoUrl] = useState(project.video_url || null)
  const ws = workstreams.find(w => w.id === project.workstream_id)

  async function handleDelete() {
    if (!window.confirm('¿Eliminar este proyecto?')) return
    setDeleting(true)
    const { error } = await supabase.from('projects').delete().eq('id', project.id)
    if (!error) { toast('Proyecto eliminado'); onDelete() }
    else { toast(error.message, 'error'); setDeleting(false) }
  }

  async function handleVideoUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 500 * 1024 * 1024) return toast('El video debe ser menor a 500MB', 'error')
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/${project.id}/video.${ext}`
    const { error: upErr } = await supabase.storage
      .from('videos')
      .upload(path, file, { upsert: true })
    if (upErr) { toast(upErr.message, 'error'); setUploading(false); return }
    const { data } = supabase.storage.from('videos').getPublicUrl(path)
    const { error: updateErr } = await supabase.from('projects')
      .update({ video_url: data.publicUrl })
      .eq('id', project.id)
    if (!updateErr) {
      setVideoUrl(data.publicUrl)
      toast('¡Video subido!', 'success')
    } else {
      toast(updateErr.message, 'error')
    }
    setUploading(false)
  }

  async function handleDeleteVideo() {
    if (!window.confirm('¿Eliminar el video?')) return
    const { error } = await supabase.from('projects')
      .update({ video_url: null })
      .eq('id', project.id)
    if (!error) { setVideoUrl(null); toast('Video eliminado') }
    else toast(error.message, 'error')
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'var(--bg)', overflowY: 'auto',
      display: 'flex', flexDirection: 'column',
      animation: 'slideUp .2s ease'
    }}>

      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: 'var(--text2)',
          cursor: 'pointer', fontSize: '22px', lineHeight: 1, padding: '0 4px'
        }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: 700, flex: 1 }}>Detalle del proyecto</span>
        <span className={`pill ${STATUS_CLASS[project.status] || 'pill-empty'}`}>
          {project.status || 'Sin estado'}
        </span>
      </div>

      <div style={{ padding: '24px 20px', maxWidth: '480px', margin: '0 auto', width: '100%', flex: 1 }}>

        <h1 className="anton" style={{ fontSize: '26px', lineHeight: 1.2, marginBottom: '12px' }}>
          {project.title}
        </h1>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '24px', alignItems: 'center' }}>
          {ws && <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>{ws.name}</span>}
          {project.video_type && project.video_type !== 'Orgánico' && (
            <span style={{
              fontSize: '10px', fontFamily: 'DM Mono, monospace',
              padding: '2px 8px', borderRadius: '6px',
              background: project.video_type === 'Campaña pagada' ? 'rgba(62,207,142,0.12)' : 'rgba(78,168,222,0.12)',
              color: project.video_type === 'Campaña pagada' ? 'var(--green)' : 'var(--blue)',
            }}>
              {project.video_type === 'Campaña pagada'
                ? `💰 $${Number(project.monto).toLocaleString('es-MX')}`
                : '🤝 Colaboración'}
            </span>
          )}
          <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>Inicio {fmtDate(project.started)}</span>
          <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>Vence {fmtDate(project.due)}</span>
          {project.completed && (
            <span style={{ fontSize: '11px', color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>
              ✓ Completado {fmtDate(project.completed)}
            </span>
          )}
        </div>

        {project.description && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Descripción
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7 }}>{project.description}</p>
          </div>
        )}

        {project.script && (
          <div style={{ marginBottom: '28px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
              Guion
            </div>
            <div style={{
              fontSize: '14px', color: 'var(--text2)', lineHeight: 1.8,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: '12px', padding: '16px', whiteSpace: 'pre-wrap'
            }}>
              {project.script}
            </div>
          </div>
        )}

        <div style={{ marginBottom: '28px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px' }}>
            Video final
          </div>

          {videoUrl ? (
            <div>
              <video
                src={videoUrl}
                controls
                playsInline
                preload="metadata"
                style={{
                  width: '100%', borderRadius: '12px',
                  background: 'var(--surface)', marginBottom: '10px',
                  maxHeight: '300px'
                }}
              />
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <a
                  href={videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    flex: 1, display: 'block', textAlign: 'center',
                    padding: '8px', borderRadius: '8px',
                    border: '1px solid var(--border2)',
                    fontSize: '12px', color: 'var(--accent)',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Ver en pantalla completa →
                </a>
                <a
                  href={videoUrl}
                  download
                  style={{
                    flex: 1, display: 'block', textAlign: 'center',
                    padding: '8px', borderRadius: '8px',
                    background: 'var(--accent-bg)',
                    border: '1px solid var(--accent-border)',
                    fontSize: '12px', color: 'var(--accent)',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
                    textDecoration: 'none'
                  }}
                >
                  Descargar ↓
                </a>
              </div>
              <button onClick={handleDeleteVideo} className="btn btn-danger btn-sm" style={{ width: '100%' }}>
                Eliminar video
              </button>
            </div>
          ) : (
            <label style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              gap: '8px', padding: '20px',
              border: '1px dashed var(--border2)', borderRadius: '12px',
              cursor: uploading ? 'not-allowed' : 'pointer',
              color: uploading ? 'var(--text3)' : 'var(--text2)',
              fontSize: '13px', fontFamily: 'Montserrat, sans-serif',
              transition: 'border-color .15s, color .15s',
            }}>
              {uploading ? '⏳ Subiendo video...' : '📹 Subir video terminado'}
              <input
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
          )}
        </div>

        {!project.description && !project.script && !videoUrl && (
          <div className="empty-state">Este proyecto no tiene descripción, guion ni video aún.</div>
        )}
      </div>

      <div style={{
        position: 'sticky', bottom: 0,
        background: 'var(--bg)', borderTop: '1px solid var(--border)',
        padding: '16px 20px 32px',
        maxWidth: '480px', margin: '0 auto', width: '100%'
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>
          Cambiar status
        </div>
        <div style={{ display: 'flex', gap: '6px', marginBottom: '14px', flexWrap: 'wrap' }}>
          {['No empezado', 'En guión', 'Grabado', 'En edición', 'Publicado'].map(s => (
            <button key={s} onClick={() => onStatusChange(project.id, s)} style={{
              padding: '6px 12px', borderRadius: '8px', fontSize: '11px',
              fontFamily: 'Montserrat, sans-serif', cursor: 'pointer',
              border: project.status === s ? '1px solid var(--accent)' : '1px solid var(--border2)',
              background: project.status === s ? 'var(--accent-bg)' : 'transparent',
              color: project.status === s ? 'var(--accent)' : 'var(--text2)',
            }}>{s}</button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-ghost btn-full" onClick={onEdit}>Editar</button>
          <button className="btn btn-danger btn-full" disabled={deleting} onClick={handleDelete}>
            {deleting ? '...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}