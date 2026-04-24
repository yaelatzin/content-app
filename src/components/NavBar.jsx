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

const CreaderoLogo = ({ height = 32 }) => (
  <svg height={height} viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f4ba15" d="M251.58,461.14c0-125.78,96.88-225.21,224.36-225.21,70.54,0,130.03,30.59,165.72,73.08,5.95,6.8,10.2,16.15,10.2,23.8,0,18.69-14.45,31.44-34,31.44-12.75,0-19.55-6.8-28.89-14.45-26.35-29.74-64.59-50.99-113.03-50.99-86.68,0-155.52,71.39-155.52,162.32s68.84,162.32,155.52,162.32c47.59,0,86.69-21.25,113.03-50.99,8.5-7.65,16.15-15.3,28.89-15.3,19.55,0,34,13.6,34,32.3,0,6.8-4.25,16.15-10.2,22.95-35.69,42.49-94.33,73.94-165.72,73.94-127.48,0-224.36-99.44-224.36-225.21Z"/>
    <path fill="#f4ba15" d="M489.9,356.24c-61.96,1.97-106.75,52.29-107.57,113.7-.1,7.5-20.55,7.85-21.11-.11-5.28-74.41,54.98-136.09,128.39-136.94,8.65-.1,12.62,4.16,13.33,9.64,1.04,8.01-3.55,13.41-13.03,13.71Z"/>
    <rect fill="#f4ba15" x="701.11" y="363.98" width="26.85" height="194.31" rx="13.43" ry="13.43"/>
    <rect fill="#f4ba15" x="749.39" y="389.79" width="29.45" height="142.69" rx="13.43" ry="13.43"/>
    <rect fill="#f4ba15" x="799.47" y="407.82" width="28.95" height="106.62" rx="13.43" ry="13.43"/>
  </svg>
)

export default function NavBar({ currentView, setView }) {
  const { user, signOut } = useAuth()
  const { toast, ToastContainer } = useToast()
  const [showPrivacy,     setShowPrivacy]     = useState(false)
  const [showSettings,    setShowSettings]    = useState(false)
  const [menuOpen,        setMenuOpen]        = useState(false)
  const [profileOpen,     setProfileOpen]     = useState(false)
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [profile,         setProfile]         = useState(null)
  const [isDark,          setIsDark]          = useState(() => {
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

          {/* Logo Creadero */}
          <CreaderoLogo height={36} />

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

      {/* SIDEBAR IZQUIERDO */}
      <div style={{
        position: 'fixed', top: 0, left: menuOpen ? 0 : '-260px',
        width: '260px', height: '100vh',
        background: 'var(--surface)',
        borderRight: '1px solid var(--border2)',
        zIndex: 300, transition: 'left .25s ease',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid var(--border)'
        }}>
          <CreaderoLogo height={28} />
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

        <div style={{ flex: 1, padding: '28px 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
          <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text)', marginBottom: '4px', textAlign: 'center' }}>
            {profile?.username || user?.email?.split('@')[0]}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', marginBottom: '20px', textAlign: 'center' }}>
            {user?.email}
          </div>
          <button onClick={() => { setShowEditProfile(true); setProfileOpen(false) }}
            className="btn btn-ghost btn-full" style={{ marginBottom: '12px' }}>
            Editar perfil
          </button>
        </div>

        <div style={{ padding: '20px', borderTop: '1px solid var(--border)' }}>
          <button onClick={signOut} className="btn btn-danger btn-full">Cerrar sesión</button>
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
