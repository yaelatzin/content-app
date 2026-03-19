import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function ProfileEdit({ profile, onClose, onSaved, toast }) {
  const { user } = useAuth()
  const [username, setUsername] = useState(profile?.username || '')
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || '')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      username: username || null,
      avatar_url: avatarUrl || null,
      updated_at: new Date().toISOString()
    })
    if (!error) { toast('Perfil actualizado', 'success'); onSaved() }
    else toast(error.message, 'error')
    setSaving(false)
  }

  async function handleAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return toast('Máximo 2MB', 'error')
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage
      .from('avatars').upload(path, file, { upsert: true })
    if (upErr) { toast(upErr.message, 'error'); setUploading(false); return }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setAvatarUrl(data.publicUrl)
    toast('Foto subida', 'success')
    setUploading(false)
  }

  const initials = username ? username[0].toUpperCase() : user?.email?.[0]?.toUpperCase() || '?'

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'var(--bg)', overflowY: 'auto',
      animation: 'slideUp .2s ease'
    }}>
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'var(--bg)', borderBottom: '1px solid var(--border)',
        padding: '14px 20px',
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <button onClick={onClose} style={{
          background: 'none', border: 'none', color: 'var(--text2)',
          cursor: 'pointer', fontSize: '22px', lineHeight: 1, padding: '0 4px'
        }}>←</button>
        <span style={{ fontSize: '14px', fontWeight: 700 }}>Editar perfil</span>
      </div>

      {/* Contenido */}
      <div style={{ padding: '32px 20px', maxWidth: '480px', margin: '0 auto' }}>
        <form onSubmit={handleSave}>

          {/* Avatar */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '32px', gap: '14px' }}>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              background: avatarUrl ? 'transparent' : 'var(--accent-bg)',
              border: '3px solid var(--accent-border)',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              {avatarUrl
                ? <img src={avatarUrl} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ fontSize: '32px', fontWeight: 700, color: 'var(--accent)' }}>{initials}</span>
              }
            </div>
            <label style={{
              padding: '8px 18px', borderRadius: '8px',
              border: '1px solid var(--border2)',
              background: 'transparent', color: 'var(--text2)',
              fontSize: '13px', cursor: 'pointer',
              fontFamily: 'Montserrat, sans-serif', fontWeight: 600
            }}>
              {uploading ? 'Subiendo...' : 'Cambiar foto'}
              <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
            </label>
          </div>

          {/* Email solo lectura */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="input" value={user.email} disabled
              style={{ opacity: 0.5, cursor: 'not-allowed' }} />
          </div>

          {/* Username */}
          <div className="form-group">
            <label className="form-label">Nombre de usuario</label>
            <input className="input" value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="¿Cómo quieres que te llamen?" />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="button" className="btn btn-ghost btn-full" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
              {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}