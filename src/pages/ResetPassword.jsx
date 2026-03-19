import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (password !== confirm) return setError('Las contraseñas no coinciden')
    if (password.length < 6) return setError('Mínimo 6 caracteres')
    setLoading(true); setError('')
    const { error } = await supabase.auth.updateUser({ password })
    if (!error) setSuccess('¡Contraseña actualizada! Ya puedes iniciar sesión.')
    else setError(error.message)
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px', background: 'var(--bg)'
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <svg height="56" viewBox="0 0 147.73 133.36" xmlns="http://www.w3.org/2000/svg" style={{ marginBottom: '16px' }}>
            <path fill="#f4ba15" d="M24.64,76.31L0,1.85h21.67l13.89,47.6h.37L49.83,1.85h19.82l-24.64,74.46v55.2h-20.38v-55.2Z"/>
            <path fill="#f4ba15" d="M94.76,124.94c-5.19-5.62-7.78-13.68-7.78-24.17V32.6c0-10.49,2.59-18.55,7.78-24.17,5.19-5.62,12.72-8.43,22.6-8.43s17.41,2.81,22.6,8.43c5.19,5.62,7.78,13.68,7.78,24.17v11.11h-19.26v-12.41c0-8.52-3.52-12.78-10.56-12.78s-10.56,4.26-10.56,12.78v70.94c0,8.4,3.52,12.59,10.56,12.59s10.56-4.2,10.56-12.59v-25.38h-10.19v-18.52h29.45v42.42c0,10.5-2.59,18.55-7.78,24.17-5.19,5.62-12.72,8.43-22.6,8.43s-17.41-2.81-22.6-8.43Z"/>
          </svg>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>Nueva contraseña</div>
        </div>

        <div className="card" style={{ padding: '28px' }}>
          <form onSubmit={handleSubmit}>
            {error && <div className="error-msg">{error}</div>}
            {success && (
              <div style={{
                padding: '10px 14px', borderRadius: '8px',
                background: 'var(--green-bg)', color: 'var(--green)',
                border: '1px solid rgba(62,207,142,0.2)',
                fontSize: '13px', marginBottom: '14px'
              }}>{success}</div>
            )}
            {!success && (
              <>
                <div className="form-group">
                  <label className="form-label">Nueva contraseña</label>
                  <input className="input" type="password"
                    placeholder="••••••••" value={password}
                    onChange={e => setPassword(e.target.value)}
                    required minLength={6} />
                </div>
                <div className="form-group">
                  <label className="form-label">Confirmar contraseña</label>
                  <input className="input" type="password"
                    placeholder="••••••••" value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    required minLength={6} />
                </div>
                <button type="submit" className="btn btn-primary btn-full"
                  disabled={loading} style={{ marginTop: '8px' }}>
                  {loading
                    ? <span className="spinner" style={{ width: 16, height: 16 }} />
                    : 'Guardar contraseña'
                  }
                </button>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}