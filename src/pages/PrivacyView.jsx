export default function PrivacyView({ onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 400,
      background: 'var(--bg)', overflowY: 'auto',
      animation: 'slideUp .2s ease'
    }}>
      {/* Header */}
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
        <span style={{ fontSize: '14px', fontWeight: 700 }}>Política de privacidad</span>
      </div>

      {/* Content */}
      <div style={{ padding: '28px 20px', maxWidth: '480px', margin: '0 auto' }}>
        {[
          {
            title: '1. Información que recopilamos',
            text: 'Recopilamos únicamente la información que tú nos proporcionas directamente: tu dirección de correo electrónico al registrarte, y el contenido que creas dentro de la app como proyectos, tareas, workstreams y notas.'
          },
          {
            title: '2. Cómo usamos tu información',
            text: 'Tu información se usa exclusivamente para brindarte el servicio de la aplicación. No utilizamos tus datos para publicidad, análisis externos ni ningún otro fin comercial.'
          },
          {
            title: '3. Almacenamiento y seguridad',
            text: 'Tus datos se almacenan de forma segura en Supabase, una plataforma con cifrado en tránsito y en reposo. Cada usuario solo puede acceder a sus propios datos gracias a políticas de seguridad a nivel de fila (Row Level Security).'
          },
          {
            title: '4. Compartición de datos',
            text: 'No vendemos, alquilamos ni compartimos tu información personal con terceros bajo ninguna circunstancia. Tus datos son tuyos.'
          },
          {
            title: '5. Eliminación de datos',
            text: 'Puedes solicitar la eliminación de tu cuenta y todos tus datos en cualquier momento contactándonos directamente. Una vez eliminados, los datos no pueden recuperarse.'
          },
          {
            title: '6. Cambios a esta política',
            text: 'Podemos actualizar esta política ocasionalmente. Te notificaremos de cambios importantes a través de la app. El uso continuado de la app después de los cambios implica tu aceptación.'
          },
          {
            title: '7. Contacto',
            text: 'Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través de la app.'
          },
        ].map(({ title, text }) => (
          <div key={title} style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent)', marginBottom: '6px' }}>
              {title}
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text2)', lineHeight: 1.7 }}>{text}</p>
          </div>
        ))}

        <div style={{ marginTop: '32px', padding: '14px', background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: '11px', color: 'var(--text3)', fontFamily: 'DM Mono, monospace', textAlign: 'center' }}>
            Última actualización: Marzo 2026
          </p>
        </div>
      </div>
    </div>
  )
}