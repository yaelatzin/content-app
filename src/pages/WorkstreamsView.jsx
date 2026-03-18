import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function WorkstreamsView({ workstreams, projects, onRefresh, toast }) {
  const { user } = useAuth()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    if (!form.name.trim()) return
    setSaving(true)
    const payload = { name: form.name.trim(), description: form.description || null, user_id: user.id }
    let error
    if (editing) {
      ({ error } = await supabase.from('workstreams').update(payload).eq('id', editing))
    } else {
      ({ error } = await supabase.from('workstreams').insert(payload))
    }
    if (!error) { toast(editing ? 'Workstream actualizado' : 'Workstream creado'); onRefresh(); setShowForm(false); setEditing(null); setForm({ name: '', description: '' }) }
    else toast(error.message, 'error')
    setSaving(false)
  }

  async function handleDelete(id) {
    const { error } = await supabase.from('workstreams').delete().eq('id', id)
    if (!error) { toast('Workstream eliminado'); onRefresh() }
    else toast(error.message, 'error')
  }

  function startEdit(ws) {
    setEditing(ws.id)
    setForm({ name: ws.name, description: ws.description || '' })
    setShowForm(true)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 className="anton" style={{ fontSize: '22px' }}>Resumen</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span className="badge">{workstreams.length}</span>
          <button className="btn btn-primary btn-sm" onClick={() => { setShowForm(!showForm); setEditing(null); setForm({ name: '', description: '' }) }}>
            {showForm && !editing ? '—' : '+ Nuevo'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '16px', borderColor: 'var(--accent-border)' }}>
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="input" value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="Ej: Voleibol, Marketing..." autoFocus />
            </div>
            <div className="form-group">
              <label className="form-label">Descripción (opcional)</label>
              <input className="input" value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="¿De qué trata esta línea de contenido?" />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="button" className="btn btn-ghost btn-sm btn-full"
                onClick={() => { setShowForm(false); setEditing(null) }}>Cancelar</button>
              <button type="submit" className="btn btn-primary btn-sm btn-full" disabled={saving}>
                {saving ? '...' : editing ? 'Guardar' : 'Crear'}
              </button>
            </div>
          </form>
        </div>
      )}

      {workstreams.length === 0 && <div className="empty-state">No hay workstreams. ¡Crea uno!</div>}

      {workstreams.map(ws => {
        const wsPjs  = projects.filter(p => p.workstream_id === ws.id)
        const done   = wsPjs.filter(p => p.status === 'Completed').length
        const pct    = wsPjs.length ? Math.round((done / wsPjs.length) * 100) : 0
        return (
          <div key={ws.id} className="card" style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: 700 }}>{ws.name}</div>
                {ws.description && (
                  <div style={{ fontSize: '12px', color: 'var(--text2)', marginTop: '3px' }}>{ws.description}</div>
                )}
              </div>
              <span className="badge" style={{ flexShrink: 0, marginLeft: '8px' }}>{wsPjs.length} proyectos</span>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginTop: '10px' }}>
              {done} completados · {pct}% progreso
            </div>
            <div style={{ height: '4px', background: 'var(--surface3)', borderRadius: '2px', marginTop: '8px' }}>
              <div style={{ height: '4px', borderRadius: '2px', background: 'var(--accent)', width: `${pct}%`, transition: 'width .5s' }} />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button className="btn btn-ghost btn-sm btn-full" onClick={() => startEdit(ws)}>Editar</button>
              <button className="btn btn-danger btn-sm btn-full" onClick={() => handleDelete(ws.id)}>Eliminar</button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
