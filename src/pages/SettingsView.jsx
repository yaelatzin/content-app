import { useState } from 'react'

const LANGUAGES = [
  { code: 'es', label: 'Español', flag: '🇲🇽' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
]

export default function SettingsView({ onClose }) {
  const [selected, setSelected] = useState(
    localStorage.getItem('app_language') || 'es'
  )

  function handleSelect(code) {
    setSelected(code)
    localStorage.setItem('app_language', code)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'var(--bg)', overflowY: 'auto',
      animation: 'slideUp .2s ease'
    }}>
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)',
        borderBottom: '1px solid var(--border)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none',
          color: 'var(--text2)', cursor: 'pointer',
          fontSize: '22px', lineHeight: 1, padding: '0 4px'
        }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: 700 }}>Configuración</span>
      </div>

      <div style={{ padding: '28px 20px', maxWidth: '480px', margin: '0 auto' }}>
        <div style={{
          fontSize: '11px', color: 'var(--text3)',
          fontFamily: 'DM Mono, monospace',
          textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '12px'
        }}>
          Idioma de la app
        </div>

        {LANGUAGES.map(lang => (
          <div key={lang.code} onClick={() => handleSelect(lang.code)} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 16px', borderRadius: '12px', marginBottom: '8px',
            background: 'var(--surface)',
            border: selected === lang.code ? '1px solid var(--accent)' : '1px solid var(--border)',
            cursor: 'pointer', transition: 'border-color .15s'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>{lang.flag}</span>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{lang.label}</span>
            </div>
            {selected === lang.code && (
              <div style={{
                width: '18px', height: '18px', borderRadius: '50%',
                background: 'var(--accent)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '11px', color: '#0d0d0f', fontWeight: 700
              }}>✓</div>
            )}
          </div>
        ))}

        <p style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '12px', lineHeight: 1.6 }}>
          El cambio de idioma se aplicará la próxima vez que abras la app.
        </p>
      </div>
    </div>
  )
}