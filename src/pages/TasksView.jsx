import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function TasksView({ tasks, projects, onRefresh, toast }) {
  const { user } = useAuth()
  const [newTitle, setNewTitle] = useState('')
  const [newProject, setNewProject] = useState('')
  const [adding, setAdding] = useState(false)
  const [showForm, setShowForm] = useState(false)

  async function addTask(e) {
    e.preventDefault()
    if (!newTitle.trim()) return
    setAdding(true)
    const { error } = await supabase.from('tasks').insert({
      title: newTitle.trim(),
      project_id: newProject || null,
      done: false,
      user_id: user.id,
    })
    if (!error) { toast('Tarea agregada'); onRefresh(); setNewTitle(''); setNewProject(''); setShowForm(false) }
    else toast(error.message, 'error')
    setAdding(false)
  }

  async function toggleDone(task) {
    const { error } = await supabase.from('tasks').update({ done: !task.done }).eq('id', task.id)
    if (!error) onRefresh()
    else toast(error.message, 'error')
  }

  async function deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) { toast('Tarea eliminada'); onRefresh() }
    else toast(error.message, 'error')
  }

  const pending   = tasks.filter(t => !t.done)
  const completed = tasks.filter(t => t.done)

  return (
    <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Tareas</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge">{tasks.length}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setShowForm(!showForm)}>
            {showForm ? '—' : '+ Nueva'}
          </button>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--accent-border)' }}>
          <form onSubmit={addTask}>
            <div className="form-group">
              <label className="form-label">Nombre de la tarea</label>
              <input className="input" value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                placeholder="Ej: Grabar video, editar, subir..." autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Proyecto (opcional)</label>
              <select className="select input" value={newProject}
                onChange={e => setNewProject(e.target.value)}>
                <option value="">Sin proyecto</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-ghost btn-sm btn-full"
                onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" className="btn btn-primary btn-sm btn-full" disabled={adding}>
                {adding ? '...' : 'Agregar'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Pending */}
      {pending.length === 0 && completed.length === 0 && (
        <div className="empty-state">No hay tareas. ¡Crea una!</div>
      )}

      {pending.map(t => {
        const proj = projects.find(p => p.id === t.project_id)
        return (
          <div key={t.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', padding: '12px 14px' }}>
            <button onClick={() => toggleDone(t)} style={{
              width: '20px', height: '20px', borderRadius: '6px',
              border: '1.5px solid var(--border2)', background: 'transparent',
              cursor: 'pointer', flexShrink: 0, display: 'flex',
              alignItems: 'center', justifyContent: 'center'
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', fontWeight: 500 }}>{t.title}</div>
              {proj && <div style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'DM Mono, monospace', marginTop: '2px' }}>{proj.title}</div>}
            </div>
            <button onClick={() => deleteTask(t.id)} style={{
              background: 'none', border: 'none', color: 'var(--text3)',
              cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '2px'
            }}>×</button>
          </div>
        )
      })}

      {/* Completed */}
      {completed.length > 0 && (
        <>
          <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', margin: '20px 0 10px' }}>
            Completadas ({completed.length})
          </div>
          {completed.map(t => {
            const proj = projects.find(p => p.id === t.project_id)
            return (
              <div key={t.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px', padding: '12px 14px', opacity: 0.6 }}>
                <button onClick={() => toggleDone(t)} style={{
                  width: '20px', height: '20px', borderRadius: '6px',
                  border: 'none', background: 'var(--green)',
                  cursor: 'pointer', flexShrink: 0, display: 'flex',
                  alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '11px'
                }}>✓</button>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', textDecoration: 'line-through', color: 'var(--text3)' }}>{t.title}</div>
                  {proj && <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginTop: '2px' }}>{proj.title}</div>}
                </div>
                <button onClick={() => deleteTask(t.id)} style={{
                  background: 'none', border: 'none', color: 'var(--text3)',
                  cursor: 'pointer', fontSize: '16px', lineHeight: 1, padding: '2px'
                }}>×</button>
              </div>
            )
          })}
        </>
      )}
    </div>
  )
}
