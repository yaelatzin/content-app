import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

export default function LoginPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setSuccess(''); setLoading(true)
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) throw error
      } else {
        const { error } = await signUp(email, password)
        if (error) throw error
        setSuccess('¡Cuenta creada! Revisa tu email para confirmar.')
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

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{
            display: 'inline-block',
            background: 'var(--accent-bg)',
            border: '1px solid var(--accent-border)',
            borderRadius: '12px',
            padding: '10px 20px',
            marginBottom: '16px'
          }}>
            <span style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '13px', color: 'var(--accent)',
              letterSpacing: '0.1em'
            }}>CONTENT_APP</span>
          </div>
          <div style={{ fontSize: '13px', color: 'var(--text3)' }}>
            {mode === 'login' ? 'Inicia sesión para continuar' : 'Crea tu cuenta'}
          </div>
        </div>

        {/* Card */}
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
              <input
                className="input"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Contraseña</label>
              <input
                className="input"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              disabled={loading}
              style={{ marginTop: '8px' }}
            >
              {loading
                ? <span className="spinner" style={{ width: 16, height: 16 }} />
                : mode === 'login' ? 'Entrar' : 'Crear cuenta'
              }
            </button>
          </form>
        </div>

        {/* Toggle */}
        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: 'var(--text3)' }}>
          {mode === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button
            onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); setSuccess('') }}
            style={{
              background: 'none', border: 'none',
              color: 'var(--accent)', cursor: 'pointer',
              fontFamily: 'Syne, sans-serif', fontSize: '13px', fontWeight: 600
            }}
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}
