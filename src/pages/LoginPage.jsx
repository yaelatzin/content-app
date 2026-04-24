import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

const CreaderoLogo = ({ height = 80 }) => (
  <svg height={height} viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg">
    <path fill="#f4ba15" d="M251.58,461.14c0-125.78,96.88-225.21,224.36-225.21,70.54,0,130.03,30.59,165.72,73.08,5.95,6.8,10.2,16.15,10.2,23.8,0,18.69-14.45,31.44-34,31.44-12.75,0-19.55-6.8-28.89-14.45-26.35-29.74-64.59-50.99-113.03-50.99-86.68,0-155.52,71.39-155.52,162.32s68.84,162.32,155.52,162.32c47.59,0,86.69-21.25,113.03-50.99,8.5-7.65,16.15-15.3,28.89-15.3,19.55,0,34,13.6,34,32.3,0,6.8-4.25,16.15-10.2,22.95-35.69,42.49-94.33,73.94-165.72,73.94-127.48,0-224.36-99.44-224.36-225.21Z"/>
    <path fill="#f4ba15" d="M489.9,356.24c-61.96,1.97-106.75,52.29-107.57,113.7-.1,7.5-20.55,7.85-21.11-.11-5.28-74.41,54.98-136.09,128.39-136.94,8.65-.1,12.62,4.16,13.33,9.64,1.04,8.01-3.55,13.41-13.03,13.71Z"/>
    <rect fill="#f4ba15" x="701.11" y="363.98" width="26.85" height="194.31" rx="13.43" ry="13.43"/>
    <rect fill="#f4ba15" x="749.39" y="389.79" width="29.45" height="142.69" rx="13.43" ry="13.43"/>
    <rect fill="#f4ba15" x="799.47" y="407.82" width="28.95" height="106.62" rx="13.43" ry="13.43"/>
  </svg>
)

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'magic') {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: { emailRedirectTo: 'https://creadero.vercel.app' }
        })
        if (error) throw error
        setSuccess('¡Link enviado! Revisa tu email y haz clic en el link para entrar.')
      } else if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else if (mode === 'register') {
        const { error } = await signUp(email, password)
        if (error) throw error
        setSuccess('¡Cuenta creada! Ya puedes iniciar sesión.')
      }
    } catch (err) {
      setError(err.message || 'Ocurrió un error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      padding: '20px', background: 'var(--bg)'
    }}>
      <div style={{ width: '100%', maxWidth: '380px' }}>

        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
            <CreaderoLogo height={80} />
          </div>
          <div style={{ fontSize: '22px', fontWeight: 800, color: 'var(--accent)', fontFamily: 'Montserrat, sans-serif', marginBottom: '4px' }}>
            creadero
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>
            {mode === 'login' ? 'Inicia sesión' : mode === 'register' ? 'Crea tu cuenta' : 'Entrar sin contraseña'}
          </div>
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

            <div className="form-group">
              <label className="form-label">Email</label>
              <input className="input" type="email"
                placeholder="tu@email.com" value={email}
                onChange={e => setEmail(e.target.value)} required />
            </div>

            {mode !== 'magic' && (
              <div className="form-group">
                <label className="form-label">Contraseña</label>
                <input className="input" type="password"
                  placeholder="••••••••" value={password}
                  onChange={e => setPassword(e.target.value)}
                  required minLength={6} />
              </div>
            )}

            <button type="submit" className="btn btn-primary btn-full"
              disabled={loading} style={{ marginTop: '8px' }}>
              {loading
                ? <span className="spinner" style={{ width: 16, height: 16 }} />
                : mode === 'login' ? 'Entrar'
                : mode === 'register' ? 'Crear cuenta'
                : 'Enviar link mágico'
              }
            </button>
          </form>
        </div>

        {mode !== 'magic' && (
          <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text3)' }}>
            {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess('') }}
              style={{
                background: 'none', border: 'none', color: 'var(--accent)',
                cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                fontSize: '13px', fontWeight: 600
              }}>
              {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
            </button>
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: '12px' }}>
          {mode !== 'magic' ? (
            <button onClick={() => { setMode('magic'); setError(''); setSuccess('') }}
              style={{
                background: 'none', border: 'none', color: 'var(--text3)',
                cursor: 'pointer', fontFamily: 'Montserrat, sans-serif', fontSize: '12px'
              }}>
              ¿Olvidaste tu contraseña? Entra sin contraseña →
            </button>
          ) : (
            <button onClick={() => { setMode('login'); setError(''); setSuccess('') }}
              style={{
                background: 'none', border: 'none', color: 'var(--accent)',
                cursor: 'pointer', fontFamily: 'Montserrat, sans-serif',
                fontSize: '13px', fontWeight: 600
              }}>
              ← Volver al login
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
