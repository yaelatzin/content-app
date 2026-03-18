import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

export default function ProfileView({ onClose, toast }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ username: '', avatar_url: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    async function loadProfile() {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      if (data) setForm({ username: data.username || '', avatar_url: data.avatar_url || '' })
      setLoading(false)
    }
    loadProfile()
  }, [user])

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      username: form.username || null,
      avatar_url: form.avatar_url || null,
      updated_at: new Date().toISOString()
    })
    if (!error) toast('Perfil actualizado', 'success')
    else toast(error.message, 'error')
    setSaving(false)
  }

  async function handleAvatar(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) return toast('La imagen debe ser menor a 2MB', 'error')
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error: upErr } = await supabase.storage
      .from('avatars')
      .upload(path, file, { upsert: true })
    if (upErr) { toast(upErr.message, 'error'); setUploading(false); return }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    setForm(f => ({ ...f, avatar_url: data.publicUrl }))
    toast('Foto subida', 'success')
    setUploading(false)
  }

  const initials = form.username
    ? form.username[0].toUpperCase()
    : user.email[0].toUpperCase()

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-title">
          Mi perfil
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        {loading
          ? <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}><div className="spinner" /></div>
          : (
            <form onSubmit={handleSave}>

              {/* Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '24px', gap: '12px' }}>
                <div style={{
                  width: '80px', height: '80px', borderRadius: '50%',
                  background: form.avatar_url ? 'transparent' : 'var(--accent-bg)',
                  border: '2px solid var(--accent-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  overflow: 'hidden', flexShrink: 0
                }}>
                  {form.avatar_url
                    ? <img src={form.avatar_url} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : <span style={{ fontSize: '28px', fontWeight: 700, color: 'var(--accent)' }}>{initials}</span>
                  }
                </div>
                <label style={{
                  padding: '6px 14px', borderRadius: '8px',
                  border: '1px solid var(--border2)',
                  background: 'transparent', color: 'var(--text2)',
                  fontSize: '12px', cursor: 'pointer', fontFamily: 'Syne, sans-serif'
                }}>
                  {uploading ? 'Subiendo...' : 'Cambiar foto'}
                  <input type="file" accept="image/*" onChange={handleAvatar} style={{ display: 'none' }} />
                </label>
              </div>

              {/* Email (solo lectura) */}
              <div className="form-group">
                <label className="form-label">Email</label>
                <input className="input" value={user.email} disabled
                  style={{ opacity: 0.5, cursor: 'not-allowed' }} />
              </div>

              {/* Username */}
              <div className="form-group">
                <label className="form-label">Nombre de usuario</label>
                <input className="input"
                  value={form.username}
                  onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
                  placeholder="¿Cómo quieres que te llamen?" />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button type="button" className="btn btn-ghost btn-full" onClick={onClose}>Cancelar</button>
                <button type="submit" className="btn btn-primary btn-full" disabled={saving}>
                  {saving ? <span className="spinner" style={{ width: 16, height: 16 }} /> : 'Guardar'}
                </button>
              </div>
            </form>
          )
        }
      </div>
    </div>
  )
}