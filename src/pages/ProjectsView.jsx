import { useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import ProjectModal from '../components/ProjectModal'

const FILTERS = [
  { key: 'all',          label: 'Todos' },
  { key: 'Not Started',  label: 'Pendientes' },
  { key: 'In Progress',  label: 'En progreso' },
  { key: 'Completed',    label: 'Completados' },
  { key: 'Cancelled',    label: 'Cancelados' },
]

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

export default function ProjectsView({ projects, workstreams, onRefresh, toast }) {
  const { user } = useAuth()
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)
  const [modal, setModal] = useState(null) // null | 'new' | project obj
  const [deleting, setDeleting] = useState(null)

  const filtered = useMemo(() =>
    filter === 'all' ? projects : projects.filter(p => p.status === filter),
    [projects, filter]
  )

  async function handleSave(form) {
    const payload = {
      title: form.title,
      description: form.description || null,
      workstream_id: form.workstream_id || null,
      started: form.started || null,
      due: form.due || null,
      completed: form.completed || null,
      status: form.status || 'Not Started',
      user_id: user.id,
    }
    if (form.id) {
      const { error } = await supabase.from('projects').update(payload).eq('id', form.id)
      if (error) throw error
      toast('Proyecto actualizado', 'success')
    } else {
      const { error } = await supabase.from('projects').insert(payload)
      if (error) throw error
      toast('Proyecto creado', 'success')
    }
    onRefresh()
  }

  async function handleDelete(id) {
    setDeleting(id)
    const { error } = await supabase.from('projects').delete().eq('id', id)
    if (!error) { toast('Proyecto eliminado'); onRefresh() }
    else toast(error.message, 'error')
    setDeleting(null)
    setExpanded(null)
  }

  async function quickStatus(id, status) {
    const extra = status === 'Completed' ? { completed: new Date().toISOString().split('T')[0] } : {}
    const { error } = await supabase.from('projects').update({ status, ...extra }).eq('id', id)
    if (!error) { toast('Status actualizado'); onRefresh() }
    else toast(error.message, 'error')
  }

  return (
    <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '20px', fontWeight: 800 }}>Proyectos</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge">{filtered.length}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('new')}>
            + Nuevo
          </button>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            flexShrink: 0, padding: '5px 12px', borderRadius: '8px',
            border: '1px solid var(--border2)',
            background: filter === f.key ? 'var(--surface3)' : 'transparent',
            color: filter === f.key ? 'var(--text)' : 'var(--text2)',
            fontFamily: 'DM Mono, monospace', fontSize: '11px', cursor: 'pointer'
          }}>{f.label}</button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0
        ? <div className="empty-state">No hay proyectos aquí</div>
        : filtered.map(p => {
            const isOpen = expanded === p.id
            const ws = workstreams.find(w => w.id === p.workstream_id)
            return (
              <div key={p.id} className="card" style={{
                marginBottom: '10px', cursor: 'pointer',
                borderColor: isOpen ? 'var(--accent-border)' : undefined,
                transition: 'border-color .2s'
              }}
                onClick={() => setExpanded(isOpen ? null : p.id)}>

                {/* Top row */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div style={{ flex: 1, fontSize: '14px', fontWeight: 600, lineHeight: 1.4 }}>{p.title}</div>
                  <span className={`pill ${STATUS_CLASS[p.status] || 'pill-empty'}`}>
                    {p.status || 'Sin estado'}
                  </span>
                </div>

                {/* Meta */}
                <div style={{ display: 'flex', gap: '12px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {ws && <span style={{ fontSize: '11px', color: 'var(--accent)', fontFamily: 'DM Mono, monospace' }}>{ws.name}</span>}
                  <span style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace' }}>
                    Vence {fmtDate(p.due)}
                  </span>
                  {p.completed && (
                    <span style={{ fontSize: '11px', color: 'var(--green)', fontFamily: 'DM Mono, monospace' }}>
                      ✓ {fmtDate(p.completed)}
                    </span>
                  )}
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: '12px', paddingTop: '12px' }} onClick={e => e.stopPropagation()}>
                    {p.description && (
                      <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.6, marginBottom: '12px' }}>
                        {p.description}
                      </p>
                    )}
					
					{p.script && (
				  <div style={{ marginBottom: '12px' }}>
					<div style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
					  Guion
					</div>
					<div style={{
					  fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7,
					  background: 'var(--surface2)', borderRadius: '8px',
					  padding: '12px 14px', whiteSpace: 'pre-wrap'
					}}>
					  {p.script}
					</div>
				  </div>
				)}

                    {/* Quick status */}
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {['Not Started', 'In Progress', 'Completed'].map(s => (
                        <button key={s} onClick={() => quickStatus(p.id, s)} style={{
                          padding: '5px 10px', borderRadius: '6px', fontSize: '11px',
                          fontFamily: 'Syne, sans-serif', cursor: 'pointer',
                          border: p.status === s ? '1px solid var(--accent)' : '1px solid var(--border2)',
                          background: p.status === s ? 'var(--accent-bg)' : 'transparent',
                          color: p.status === s ? 'var(--accent)' : 'var(--text2)',
                        }}>{s}</button>
                      ))}
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button className="btn btn-ghost btn-sm btn-full"
                        onClick={() => { setModal(p); setExpanded(null) }}>
                        Editar
                      </button>
                      <button className="btn btn-danger btn-sm btn-full"
                        disabled={deleting === p.id}
                        onClick={() => handleDelete(p.id)}>
                        {deleting === p.id ? '...' : 'Eliminar'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          })
      }

      {/* Modal */}
      {modal && (
        <ProjectModal
          project={modal === 'new' ? null : modal}
          workstreams={workstreams}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}
