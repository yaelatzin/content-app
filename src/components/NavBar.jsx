import PrivacyView from '../pages/PrivacyView'
import SettingsView from '../pages/SettingsView'
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
  const [showPrivacy, setShowPrivacy] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
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
          <svg height="28" viewBox="0 0 147.73 133.36" xmlns="http://www.w3.org/2000/svg">
		  <path fill="#f4ba15" d="M24.64,76.31L0,1.85h21.67l13.89,47.6h.37L49.83,1.85h19.82l-24.64,74.46v55.2h-20.38v-55.2Z"/>
		  <path fill="#f4ba15" d="M94.76,124.94c-5.19-5.62-7.78-13.68-7.78-24.17V32.6c0-10.49,2.59-18.55,7.78-24.17,5.19-5.62,12.72-8.43,22.6-8.43s17.41,2.81,22.6,8.43c5.19,5.62,7.78,13.68,7.78,24.17v11.11h-19.26v-12.41c0-8.52-3.52-12.78-10.56-12.78s-10.56,4.26-10.56,12.78v70.94c0,8.4,3.52,12.59,10.56,12.59s10.56-4.2,10.56-12.59v-25.38h-10.19v-18.52h29.45v42.42c0,10.5-2.59,18.55-7.78,24.17-5.19,5.62-12.72,8.43-22.6,8.43s-17.41-2.81-22.6-8.43Z"/>
		</svg>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
			  fontFamily: 'DM Mono, monospace',
			  fontSize: '11px', color: 'var(--text2)'
			}}>
			  {profile?.username || user?.email?.split('@')[0]}
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
	  {/* Menú lateral izquierdo */}
<div style={{
  position: 'fixed', left: 0, bottom: 0,
  display: 'flex', flexDirection: 'column', gap: '2px',
  padding: '0 0 24px 12px', zIndex: 90
}}>
  <button onClick={() => setShowSettings(true)} style={{
    background: 'none', border: 'none',
    color: 'var(--text3)', cursor: 'pointer',
    fontFamily: 'DM Mono, monospace', fontSize: '10px',
    letterSpacing: '0.05em', textAlign: 'left', padding: '4px 6px',
    borderRadius: '6px', transition: 'color .15s'
  }}
    onMouseEnter={e => e.target.style.color = 'var(--accent)'}
    onMouseLeave={e => e.target.style.color = 'var(--text3)'}
  >
    ⚙ Idioma
  </button>
  <button onClick={() => setShowPrivacy(true)} style={{
    background: 'none', border: 'none',
    color: 'var(--text3)', cursor: 'pointer',
    fontFamily: 'DM Mono, monospace', fontSize: '10px',
    letterSpacing: '0.05em', textAlign: 'left', padding: '4px 6px',
    borderRadius: '6px', transition: 'color .15s'
  }}
    onMouseEnter={e => e.target.style.color = 'var(--accent)'}
    onMouseLeave={e => e.target.style.color = 'var(--text3)'}
  >
    ⚖ Privacidad
  </button>
</div>

{showPrivacy  && <PrivacyView  onClose={() => setShowPrivacy(false)} />}
{showSettings && <SettingsView onClose={() => setShowSettings(false)} />}
    </>
  )
}