import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import ProfileView from '../pages/ProfileView'
import { useToast } from '../hooks/useToast'

const VIEWS = [
  { id: 'dashboard',   label: 'Dashboard' },
  { id: 'projects',    label: 'Proyectos' },
  { id: 'tasks',       label: 'Tareas' },
  { id: 'workstreams', label: 'Workstreams' },
]

export default function NavBar({ currentView, setView }) {
  const { user } = useAuth()
  const { toast, ToastContainer } = useToast()
  const [showProfile, setShowProfile] = useState(false)
  const [profile, setProfile] = useState(null)

  // Cargar foto/nombre del perfil al montar
  useState(() => {
    import('../lib/supabase').then(({ supabase }) => {
      supabase.from('profiles').select('username, avatar_url')
        .eq('id', user.id).single()
        .then(({ data }) => { if (data) setProfile(data) })
    })
  }, [])

  const initials = profile?.username
    ? profile.username[0].toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <>
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
      }}>
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
              onClick={() => setShowProfile(true)}
              title="Mi perfil"
              style={{
                width: '32px', height: '32px', borderRadius: '50%',
                background: profile?.avatar_url ? 'transparent' : 'var(--accent-bg)',
                border: '2px solid var(--accent-border)',
                color: 'var(--accent)',
                fontFamily: 'Syne, sans-serif',
                fontSize: '12px', fontWeight: 700,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden', padding: 0
              }}
            >
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="avatar"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials
              }
            </button>
          </div>
        </div>

        <div style={{
          display: 'flex', gap: '4px',
          padding: '0 16px 12px',
          overflowX: 'auto',
        }}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: '20px',
              border: currentView === v.id ? 'none' : '1px solid var(--border2)',
              background: currentView === v.id ? 'var(--accent)' : 'transparent',
              color: currentView === v.id ? '#0d0d0f' : 'var(--text2)',
              fontFamily: 'Syne, sans-serif',
              fontSize: '12px', fontWeight: currentView === v.id ? 700 : 400,
              cursor: 'pointer', transition: 'all .15s'
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      {showProfile && (
        <ProfileView
          onClose={() => { setShowProfile(false); }}
          toast={toast}
        />
      )}
      <ToastContainer />
    </>
  )
}