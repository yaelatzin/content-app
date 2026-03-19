import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import PrivacyView from '../pages/PrivacyView'
import SettingsView from '../pages/SettingsView'
import ProfileEdit from '../pages/ProfileEdit'
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
  const [showPrivacy,    setShowPrivacy]    = useState(false)
  const [showSettings,   setShowSettings]   = useState(false)
  const [menuOpen,       setMenuOpen]       = useState(false)
  const [profileOpen,    setProfileOpen]    = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [profile,        setProfile]        = useState(null)
  const [isDark,         setIsDark]         = useState(() => {
    return localStorage.getItem('theme') !== 'light'
  })

  useEffect(() => {
    document.body.classList.toggle('light', !isDark)
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  useEffect(() => { loadProfile() }, [user])

  async function loadProfile() {
    const { supabase } = await import('../lib/supabase')
    const { data } = await supabase.from('profiles')
      .select('username, avatar_url').eq('id', user.id).single()
    if (data) setProfile(data)
  }

  const initials = profile?.username
    ? profile.username[0].toUpperCase()
    : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <>
      {/* NAVBAR */}
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
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: '4px', display: 'flex', flexDirection: 'column',
            gap: '5px', justifyContent: 'center'
          }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: '20px', height: '2px',
                background: menuOpen ? 'var(--accent)' : 'var(--text2)',
                borderRadius: '2px', transition: 'background .15s'
              }} />
            ))}
          </button>

          {/* Logo center */}
          <svg height="26" viewBox="0 0 147.73 133.36" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f4ba15" d="M24.64,76.31L0,1.85h21.67l13.89,47.6h.37L49.83,1.85h19.82l-24.64,74.46v55.2h-20.38v-55.2Z"/>
            <path fill="#f4ba15" d="M94.76,124.94c-5.19-5.62-7.78-13.68-7.78-24.17V32.6c0-10.49,2.59-18.55,7.78-24.17,5.19-5.62,12.72-8.43,22.6-8.43s17.41,2.81,22.6,8.43c5.19,5.62,7.78,13.68,7.78,24.17v11.11h-19.26v-12.41c0-8.52-3.52-12.78-10.56-12.78s-10.56,4.26-10.56,12.78v70.94c0,8.4,3.52,12.59,10.56,12.59s10.56-4.2,10.56-12.59v-25.38h-10.19v-18.52h29.45v42.42c0,10.5-2.59,18.55-7.78,24.17-5.19,5.62-12.72,8.43-22.6,8.43s-17.41-2.81-22.6-8.43Z"/>
          </svg>

          {/* Avatar */}
          <button onClick={() => setProfileOpen(!profileOpen)} style={{
            width: '34px', height: '34px', borderRadius: '50%',
            background: profile?.avatar_url ? 'transparent' : 'var(--accent-bg)',
            border: '2px solid var(--accent-border)',
            cursor: 'pointer', overflow: 'hidden', padding: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif',
            fontSize: '13px', fontWeight: 700
          }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : initials
            }
          </button>
        </div>

        {/* Nav tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '0 16px 12px', overflowX: 'auto' }}>
          {VIEWS.map(v => (
            <button key={v.id} onClick={() => setView(v.id)} style={{
              flexShrink: 0, padding: '6px 14px', borderRadius: '20px',
              border: currentView === v.id ? 'none' : '1px solid var(--border2)',
              background: currentView === v.id ? 'var(--accent)' : 'transparent',
              color: currentView === v.id ? '#0d0d0f' : 'var(--text2)',
              fontFamily: 'Montserrat, sans-serif', fontSize: '12px',
              fontWeight: currentView === v.id ? 700 : 400,
              cursor: 'pointer', transition: 'all .15s'
            }}>{v.label}</button>
          ))}
        </div>
      </div>

      {/* SIDEBAR IZQUIERDO — Hamburguesa */}
      <div style={{
        position: 'fixed', top: 0, left: menuOpen ? 0 : '-260px',
        width: '260px', height: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border2)',
        zIndex: 300, transition: 'left .25s ease',
        display: 'flex', flexDirection: 'column',
        padding: '0 0 40px'
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border)'
        }}>
          <svg height="24" viewBox="0 0 147.73 133.36" xmlns="http://www.w3.org/2000/svg">
            <path fill="#f4ba15" d="M24.64,76.31L0,1.85h21.67l13.89,47.6h.37L49.83,1.85h19.82l-24.64,74.46v55.2h-20.38v-55.2Z"/>
            <path fill="#f4ba15" d="M94.76,124.94c-5.19-5.62-7.78-13.68-7.78-24.17V32.6c0-10.49,2.59-18.55,7.78-24.17,5.19-5.62,12.72-8.43,22.6-8.43s17.41,2.81,22.6,8.43c5.19,5.62,7.78,13.68,7.78,24.17v11.11h-19.26v-12.41c0-8.52-3.52-12.78-10.56-12.78s-10.56,4.26-10.56,12.78v70.94c0,8.4,3.52,12.59,10.56,12.59s10.56-4.2,10.56-12.59v-25.38h-10.19v-18.52h29.45v42.42c0,10.5-2.59,18.55-7.78,24.17-5.19,5.62-12.72,8.43-22.6,8.43s-17.41-2.81-22.6-8.43Z"/>
          </svg>
          <button onClick={() => setMenuOpen(false)} style={{
            background: 'none', border: 'none', color: 'var(--text2)',
            fontSize: '22px', cursor: 'pointer'
          }}>×</button>
        </div>
        <div style={{ flex: 1, padding: '12px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 10px', borderRadius: '10px', marginBottom: '4px'
          }}>
            <span style={{ fontSize: '14px', color: 'var(--text)' }}>
              {isDark ? '🌙 Modo oscuro' : '☀️ Modo claro'}
            </span>
            <button onClick={() => setIsDark(!isDark)} style={{
              width: '40px', height: '22px', borderRadius: '11px',
              background: isDark ? 'var(--accent)' : 'var(--border2)',
              border: 'none', cursor: 'pointer', position: 'relative',
              transition: 'background .2s', flexShrink: 0
            }}>
              <div style={{
                position: 'absolute', top: '3px',
                left: isDark ? '20px' : '3px',
                width: '16px', height: '16px', borderRadius: '50%',
                background: '#fff', transition: 'left .2s'
              }} />
            </button>
          </div>
          <div style={{ height: '1px', background: 'var(--border)', margin: '8px 0' }} />
          <button onClick={() => { setShowSettings(true); setMenuOpen(false) }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 10px', borderRadius: '10px', border: 'none',
            background: 'none', color: 'var(--text)', cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif', fontSize: '14px', textAlign: 'left',
            marginBottom: '4px'
          }}>🌐 Idioma</button>
          <button onClick={() => { setShowPrivacy(true); setMenuOpen(false) }} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
            padding: '12px 10px', borderRadius: '10px', border: 'none',
            background: 'none', color: 'var(--text)', cursor: 'pointer',
            fontFamily: 'Montserrat, sans-serif', fontSize: '14px', textAlign: 'left'
          }}>⚖️ Privacidad</button>
        </div>
      </div>
      {menuOpen && <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 299, background: 'rgba(0,0,0,0.5)' }} />}

      {/* SIDEBAR DERECHO — Perfil */}
      <div style={{
        position: 'fixed', top: 0, right: profileOpen ? 0 : '-280px',
        width: '280px', height: '100vh',
        background: 'var(--surface)',
        borderLeft: '1px solid var(--border2)',
        zIndex: 300, transition: 'right .25s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border)'
        }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>Mi perfil</span>
          <button onClick={() => setProfileOpen(false)} style={{
            background: 'none', border: 'none', color: 'var(--text2)',
            fontSize: '22px', cursor: 'pointer'
          }}>×</button>
        </div>

        {/* Contenido perfil */}
        <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {/* Avatar grande */}
          <div style={{
            width: '80px', height: '80px', borderRadius: '50%',
            background: profile?.avatar_url ? 'transparent' : 'var(--accent-bg)',
            border: '3px solid var(--accent-border)',
            overflow: 'hidden', marginBottom: '14px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {profile?.avatar_url
              ? <img src={profile.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent)' }}>{initials}</span>
            }
          </div>

          {/* Nombre */}
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', textAlign: 'center' }}>
            {profile?.username || user?.email?.split('@')[0]}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginBottom: '20px', textAlign: 'center' }}>
            {user?.email}
          </div>

          {/* Botón editar perfil */}
          <button
            onClick={() => { setShowEditProfile(true); setProfileOpen(false) }}
            className="btn btn-ghost btn-full"
            style={{ marginBottom: '12px' }}
          >
            Editar perfil
          </button>
        </div>

        {/* Botón salir abajo */}
        <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
          <button onClick={signOut} className="btn btn-danger btn-full">
            Cerrar sesión
          </button>
        </div>
      </div>
      {profileOpen && <div onClick={() => setProfileOpen(false)} style={{ position: 'fixed', inset: 0, zIndex: 299, background: 'rgba(0,0,0,0.5)' }} />}

      {showPrivacy    && <PrivacyView    onClose={() => setShowPrivacy(false)} />}
      {showSettings   && <SettingsView   onClose={() => setShowSettings(false)} />}
      {showEditProfile && (
        <ProfileEdit
          profile={profile}
          onClose={() => setShowEditProfile(false)}
          onSaved={() => { loadProfile(); setShowEditProfile(false) }}
          toast={toast}
        />
      )}
      <ToastContainer />
    </>
  )
}