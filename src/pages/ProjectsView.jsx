import { useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'
import ProjectModal from '../components/ProjectModal'
import ProjectDetail from './ProjectDetail'

const FILTERS = [
  { key: 'all',          label: 'Todos' },
  { key: 'No empezado',  label: 'No empezado' },
  { key: 'En guión',     label: 'En guión' },
  { key: 'Grabado',      label: 'Grabado' },
  { key: 'En edición',   label: 'En edición' },
  { key: 'Publicado',    label: 'Publicado' },
]

const STATUS_CLASS = {
  'No empezado': 'pill-notstarted',
  'En guión':    'pill-inprogress',
  'Grabado':     'pill-grabado',
  'En edición':  'pill-edicion',
  'Publicado':   'pill-completed',
}

const STATUS_ORDER = {
  'No empezado': 0,
  'En guión':    1,
  'Grabado':     2,
  'En edición':  3,
  '':            4,
  'Publicado':   5,
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
  const [modal, setModal] = useState(null)
  const [detail, setDetail] = useState(null)

  const filtered = useMemo(() => {
    const list = filter === 'all' ? projects : projects.filter(p => p.status === filter)
    return [...list].sort((a, b) => {
      const orderDiff = (STATUS_ORDER[a.status] ?? 4) - (STATUS_ORDER[b.status] ?? 4)
      if (orderDiff !== 0) return orderDiff
      return new Date(b.created_at) - new Date(a.created_at)
    })
  }, [projects, filter])

  async function handleSave(form) {
    const payload = {
      title: form.title,
      description: form.description || null,
      workstream_id: form.workstream_id || null,
      started: form.started || null,
      due: form.due || null,
      completed: form.completed || null,
      status: form.status || 'No empezado',
      script: form.script || null,
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

  async function quickStatus(id, status) {
    const extra = status === 'Publicado' ? { completed: new Date().toISOString().split('T')[0] } : {}
    const { error } = await supabase.from('projects').update({ status, ...extra }).eq('id', id)
    if (!error) { toast('Status actualizado'); onRefresh() }
    else toast(error.message, 'error')
  }

  return (
    <div style={{ padding: '20px', maxWidth: '480px', margin: '0 auto' }}>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 className="anton" style={{ fontSize: '22px' }}>Proyectos</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="badge">{filtered.length}</span>
          <button className="btn btn-primary btn-sm" onClick={() => setModal('new')}>+ Nuevo</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginBottom: '16px', paddingBottom: '4px' }}>
        {FILTERS.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)} style={{
            flexShrink: 0, padding: '5px 12px', borderRadius: '8px',
            border: '1px solid var(--border2)',
            background: filter === f.key ? 'var(--surface3)' : 'transparent',
            color: filter === f.key ? 'var(--text)' : 'var(--text2)',
            fontFamily: 'Montserrat, monospace', fontSize: '11px', cursor: 'pointer'
          }}>{f.label}</button>
        ))}
      </div>

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
              }} onClick={() => setExpanded(isOpen ? null : p.id)}>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                  <div className="anton" style={{ flex: 1, fontSize: '15px', lineHeight: 1.3 }}>{p.title}</div>
                  <span className={`pill ${STATUS_CLASS[p.status] || 'pill-empty'}`}>
                    {p.status || 'Sin estado'}
                  </span>
                </div>

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

                {isOpen && (
                  <div style={{ borderTop: '1px solid var(--border)', marginTop: '12px', paddingTop: '12px' }}
                    onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                      {['No empezado', 'En guión', 'Grabado', 'En edición', 'Publicado'].map(s => (
                        <button key={s} onClick={() => quickStatus(p.id, s)} style={{
                          padding: '5px 10px', borderRadius: '6px', fontSize: '11px',
                          fontFamily: 'Montserrat, sans-serif', cursor: 'pointer',
                          border: p.status === s ? '1px solid var(--accent)' : '1px solid var(--border2)',
                          background: p.status === s ? 'var(--accent-bg)' : 'transparent',
                          color: p.status === s ? 'var(--accent)' : 'var(--text2)',
                        }}>{s}</button>
                      ))}
                    </div>
                    <button className="btn btn-primary btn-full"
                      onClick={() => { setDetail(p); setExpanded(null) }}>
                      Abrir →
                    </button>
                  </div>
                )}
              </div>
            )
          })
      }

      {modal && (
        <ProjectModal
          project={modal === 'new' ? null : modal}
          workstreams={workstreams}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {detail && (
        <ProjectDetail
          project={detail}
          workstreams={workstreams}
          onClose={() => setDetail(null)}
          onEdit={() => { setModal(detail); setDetail(null) }}
          onDelete={() => { setDetail(null); onRefresh() }}
          onStatusChange={(id, status) => {
            quickStatus(id, status)
            const updated = projects.find(p => p.id === id)
            if (updated) setDetail(Object.assign({}, updated, { status }))
          }}
          toast={toast}
        />
      )}
    </div>
  )
}
