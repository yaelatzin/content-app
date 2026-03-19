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
          <div style={{ marginBottom: '16px' }}>
		  <svg height="64" viewBox="0 0 147.73 133.36" xmlns="http://www.w3.org/2000/svg">
			<path fill="#f4ba15" d="M24.64,76.31L0,1.85h21.67l13.89,47.6h.37L49.83,1.85h19.82l-24.64,74.46v55.2h-20.38v-55.2Z"/>
			<path fill="#f4ba15" d="M94.76,124.94c-5.19-5.62-7.78-13.68-7.78-24.17V32.6c0-10.49,2.59-18.55,7.78-24.17,5.19-5.62,12.72-8.43,22.6-8.43s17.41,2.81,22.6,8.43c5.19,5.62,7.78,13.68,7.78,24.17v11.11h-19.26v-12.41c0-8.52-3.52-12.78-10.56-12.78s-10.56,4.26-10.56,12.78v70.94c0,8.4,3.52,12.59,10.56,12.59s10.56-4.2,10.56-12.59v-25.38h-10.19v-18.52h29.45v42.42c0,10.5-2.59,18.55-7.78,24.17-5.19,5.62-12.72,8.43-22.6,8.43s-17.41-2.81-22.6-8.43Z"/>
		  </svg>
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
              fontFamily: 'Montserrat, sans-serif', fontSize: '13px', fontWeight: 600
            }}
          >
            {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
          </button>
        </div>
      </div>
    </div>
  )
}
