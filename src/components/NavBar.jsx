import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import ProfileView from '../pages/ProfileView'
import PrivacyView from '../pages/PrivacyView'
import SettingsView from '../pages/SettingsView'
import { useToast } from '../hooks/useToast'

const VIEWS = [
  { id: 'dashboard',   label: 'Dashboard' },
  { id: 'projects',    label: 'Proyectos' },
  { id: 'tasks',       label: 'Tareas' },
  { id: 'workstreams', label: 'Workstreams' },
]

export default function NavBar({ currentView, setView }) {
  const { user, signOut } = useAuth()
  const { toast, ToastContainer } = useToast()
  const [showProfile,  setShowProfile]  = useState(false)
  const [showPrivacy,  setShowPrivacy]  = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const [profile,      setProfile]      = useState(null)
  const [isDark,       setIsDark]       = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })

  useEffect(() => {
    document.body.classList.toggle('light', !isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => {
    import('../lib/supabase').then(({ supabase }) => {
      supabase.from('profiles').select('username, avatar_url')
        .eq('id', user.id).single()
        .then(({ data }) => { if (data) setProfile(data) })
    })
  }, [user])

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
          {/* Hamburger menu */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: 'none', border: 'none',
              cursor: 'pointer', padding: '4px',
              display: 'flex', flexDirection: 'column',
              gap: '5px', justifyContent: 'center'
            }}
          >
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: '20px', height: '2px',
                background: menuOpen ? 'var(--accent)' : 'var(--text2)',
                borderRadius: '2px',
                transition: 'background .15s'
              }} />
            ))}
          </button>

          {/* Logo center */}
          <svg height="26" viewBox="0 0 147.73 133.36" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f4ba15" d="M24.64,76.31L0,1.85h21.67l13.89,47.6h.37L49.83,1.85h19.82l-24.64,74.46v55.2h-20.38v-55.2Z"/>
            <path fill="#f4ba15" d="M94.76,124.94c-5.19-5.62-7.78-13.68-7.78-24.17V32.6c0-10.49,2.59-18.55,7.78-24.17,5.19-5.62,12.72-8.43,22.6-8.43s17.41,2.81,22.6,8.43c5.19,5.62,7.78,13.68,7.78,24.17v11.11h-19.26v-12.41c0-8.52-3.52-12.78-10.56-12.78s-10.56,4.26-10.56,12.78v70.94c0,8.4,3.52,12.59,10.56,12.59s10.56-4.2,10.56-12.59v-25.38h-10.19v-18.52h29.45v42.42c0,10.5-2.59,18.55-7.78,24.17-5.19,5.62-12.72,8.43-22.6,8.43s-17.41-2.81-22.6-8.43Z"/>
          </svg>

          {/* Right: username + avatar + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px', color: 'var(--text2)'
            }}>
              {profile?.username || user?.email?.split('@')[0]}
            </span>
            <button onClick={() => setShowProfile(true)} style={{
              width: '32px', height: '32px', borderRadius: '50%',
              background: profile?.avatar_url ? 'transparent' : 'var(--accent-bg)',
              border: '2px solid var(--accent-border)',
              color: 'var(--accent)',
              fontFamily: 'Syne, sans-serif', fontSize: '12px', fontWeight: 700,
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', padding: 0
            }}>
              {profile?.avatar_url
                ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : initials
              }
            </button>
            <button onClick={signOut} style={{
              background: 'none', border: '1px solid var(--border2)',
              borderRadius: '8px', color: 'var(--text3)',
              fontFamily: 'DM Mono, monospace', fontSize: '10px',
              letterSpacing: '0.05em', padding: '5px 10px', cursor: 'pointer',
            }}>salir</button>
          </div>
        </div>

        {/* Nav tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '0 16px 12px', overflowX: 'auto' }}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: '20px',
              border: currentView === v.id ? 'none' : '1px solid var(--border2)',
              background: currentView === v.id ? 'var(--accent)' : 'transparent',
              color: currentView === v.id ? '#0d0d0f' : 'var(--text2)',
              fontFamily: 'Syne, sans-serif', fontSize: '12px',
              fontWeight: currentView === v.id ? 700 : 400,
              cursor: 'pointer', transition: 'all .15s'
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      {/* Dropdown menu */}
      {menuOpen && (
        <>
          <div
            onClick={() => setMenuOpen(false)}
            style={{ position: 'fixed', inset: 0, zIndex: 150 }}
          />
          <div style={{
            position: 'fixed', top: '62px', left: '16px',
            zIndex: 200, background: 'var(--surface)',
            border: '1px solid var(--border2)',
            borderRadius: '14px', padding: '8px',
            minWidth: '200px',
            animation: 'fadeIn .15s ease'
          }}>

            {/* Tema */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '10px 12px', borderRadius: '8px',
            }}>
              <span style={{ fontSize: '13px', color: 'var(--text)' }}>
                {isDark ? '🌙 Modo oscuro' : '☀️ Modo claro'}
              </span>
              <button
                onClick={() => setIsDark(!isDark)}
                style={{
                  width: '40px', height: '22px', borderRadius: '11px',
                  background: isDark ? 'var(--accent)' : 'var(--border2)',
                  border: 'none', cursor: 'pointer', position: 'relative',
                  transition: 'background .2s', flexShrink: 0
                }}
              >
                <div style={{
                  position: 'absolute', top: '3px',
                  left: isDark ? '20px' : '3px',
                  width: '16px', height: '16px', borderRadius: '50%',
                  background: '#fff', transition: 'left .2s'
                }} />
              </button>
            </div>

            <div style={{ height: '1px', background: 'var(--border)', margin: '4px 0' }} />

            {/* Idioma */}
            <button onClick={() => { setShowSettings(true); setMenuOpen(false) }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', border: 'none',
              background: 'none', color: 'var(--text)', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', fontSize: '13px', textAlign: 'left'
            }}>
              🌐 Idioma
            </button>

            {/* Privacidad */}
            <button onClick={() => { setShowPrivacy(true); setMenuOpen(false) }} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
              padding: '10px 12px', borderRadius: '8px', border: 'none',
              background: 'none', color: 'var(--text)', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', fontSize: '13px', textAlign: 'left'
            }}>
              ⚖️ Privacidad
            </button>
          </div>
        </>
      )}

      {showProfile  && <ProfileView  onClose={() => setShowProfile(false)}  toast={toast} />}
      {showPrivacy  && <PrivacyView  onClose={() => setShowPrivacy(false)} />}
      {showSettings && <SettingsView onClose={() => setShowSettings(false)} />}
      <ToastContainer />
    </>
  )
}