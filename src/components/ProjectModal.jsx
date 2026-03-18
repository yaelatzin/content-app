import { useState, useEffect } from 'react'

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed', 'Cancelled']

export default function ProjectModal({ project, workstreams, onSave, onClose }) {
  const isEdit = !!project?.id
  const [form, setForm] = useState({
    title: '',
    description: '',
    workstream_id: '',
    started: new Date().toISOString().split('T')[0],
    due: '',
    status: 'Not Started',
    ...project,
    completed: project?.completed || '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (project) setForm({ ...project, completed: project.completed || '' })
  }, [project])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim()) return setError('El nombre es requerido')
    setLoading(true); setError('')
    try {
      await onSave(form)
      onClose()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          {isEdit ? 'Editar proyecto' : 'Nuevo proyecto'}
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input className="input" value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="Ej: Video sobre tryouts..." />
          </div>

          <div className="form-group">
            <label className="form-label">Descripción</label>
            <textarea className="textarea input" value={form.description || ''}
              onChange={e => set('description', e.target.value)}
              placeholder="¿De qué trata el contenido?" />
          </div>

          <div className="form-group">
            <label className="form-label">Workstream</label>
            <select className="select input" value={form.workstream_id || ''}
              onChange={e => set('workstream_id', e.target.value)}>
              <option value="">Sin workstream</option>
              {workstreams.map(ws => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Inicio</label>
              <input className="input" type="date" value={form.started || ''}
                onChange={e => set('started', e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Vence</label>
              <input className="input" type="date" value={form.due || ''}
                onChange={e => set('due', e.target.value)} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="select input" value={form.status || 'Not Started'}
                onChange={e => set('status', e.target.value)}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Completado</label>
              <input className="input" type="date" value={form.completed || ''}
                onChange={e => set('completed', e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button type="button" className="btn btn-ghost btn-full" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading
                ? <span className="spinner" style={{ width: 16, height: 16 }} />
                : isEdit ? 'Guardar cambios' : 'Crear proyecto'
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
