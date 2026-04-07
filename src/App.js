import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from './lib/supabase'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { useToast } from './hooks/useToast'
import NavBar from './components/NavBar'
import LoginPage from './pages/LoginPage'
import ResetPassword from './pages/ResetPassword'
import DashboardView from './pages/DashboardView'
import ProjectsView from './pages/ProjectsView'
import TasksView from './pages/TasksView'
import WorkstreamsView from './pages/WorkstreamsView'
import './index.css'

function AppContent() {
  const { user, loading: authLoading } = useAuth()
  const { toast, ToastContainer } = useToast()
  const [view, setView] = useState('projects')
  const [projects, setProjects]       = useState([])
  const [tasks, setTasks]             = useState([])
  const [workstreams, setWorkstreams] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  
  const [pullY, setPullY] = useState(0)
  const [pulling, setPulling] = useState(false)
  const touchStartY = useRef(0)

  useEffect(() => {
  const onTouchStart = e => {
    if (window.scrollY === 0) touchStartY.current = e.touches[0].clientY
  }
  const onTouchMove = e => {
    if (window.scrollY !== 0) return
    const dy = e.touches[0].clientY - touchStartY.current
    if (dy > 0 && dy < 100) { setPullY(dy); setPulling(true) }
  }
  const onTouchEnd = () => {
    if (pullY > 60) fetchAll()
    setPullY(0); setPulling(false)
  }
  window.addEventListener('touchstart', onTouchStart)
  window.addEventListener('touchmove', onTouchMove)
  window.addEventListener('touchend', onTouchEnd)
  return () => {
    window.removeEventListener('touchstart', onTouchStart)
    window.removeEventListener('touchmove', onTouchMove)
    window.removeEventListener('touchend', onTouchEnd)
  }
}, [pullY, fetchAll])
  
  useEffect(() => {
  const hash = window.location.hash
  if (hash && hash.includes('access_token')) {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get('access_token')
        const refreshToken = params.get('refresh_token')
        if (accessToken && refreshToken) {
          supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          })
        }
      }
    })
  }
}, [])

  const fetchAll = useCallback(async () => {
    if (!user) return
    setDataLoading(true)
    const [pRes, tRes, wRes] = await Promise.all([
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('tasks').select('*').order('created_at', { ascending: false }),
      supabase.from('workstreams').select('*').order('name'),
    ])
    if (pRes.data) setProjects(pRes.data)
    if (tRes.data) setTasks(tRes.data)
    if (wRes.data) setWorkstreams(wRes.data)
    setDataLoading(false)
  }, [user])

  useEffect(() => { fetchAll() }, [fetchAll])

  if (window.location.pathname === '/reset-password') {
    return <ResetPassword />
  }

  if (authLoading || dataLoading) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'var(--bg)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: '24px'
      }}>
        <svg height="64" viewBox="0 0 147.73 133.36" xmlns="http://www.w3.org/2000/svg"
          style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
          <path fill="#f4ba15" d="M24.64,76.31L0,1.85h21.67l13.89,47.6h.37L49.83,1.85h19.82l-24.64,74.46v55.2h-20.38v-55.2Z"/>
          <path fill="#f4ba15" d="M94.76,124.94c-5.19-5.62-7.78-13.68-7.78-24.17V32.6c0-10.49,2.59-18.55,7.78-24.17,5.19-5.62,12.72-8.43,22.6-8.43s17.41,2.81,22.6,8.43c5.19,5.62,7.78,13.68,7.78,24.17v11.11h-19.26v-12.41c0-8.52-3.52-12.78-10.56-12.78s-10.56,4.26-10.56,12.78v70.94c0,8.4,3.52,12.59,10.56,12.59s10.56-4.2,10.56-12.59v-25.38h-10.19v-18.52h29.45v42.42c0,10.5-2.59,18.55-7.78,24.17-5.19,5.62-12.72,8.43-22.6,8.43s-17.41-2.81-22.6-8.43Z"/>
        </svg>
        <div style={{
          width: '120px', height: '3px',
          background: 'var(--surface2)', borderRadius: '2px', overflow: 'hidden'
        }}>
          <div style={{
            height: '100%', borderRadius: '2px',
            background: 'var(--accent)',
            animation: 'loading-bar 1.2s ease-in-out infinite'
          }} />
        </div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <NavBar currentView={view} setView={setView} />

		{pulling && (
  <div style={{
    position: 'fixed', top: 0, left: 0, right: 0,
    display: 'flex', justifyContent: 'center',
    zIndex: 999, pointerEvents: 'none',
    transform: `translateY(${Math.min(pullY - 20, 60)}px)`,
    transition: pullY === 0 ? 'transform .3s ease' : 'none'
  }}>
    <svg
      height="36" viewBox="0 0 147.73 133.36"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        opacity: pullY / 80,
        transform: `rotate(${pullY * 3}deg)`,
        filter: 'drop-shadow(0 2px 8px rgba(244,186,21,0.4))'
      }}
    >
      <path fill="#f4ba15" d="M24.64,76.31L0,1.85h21.67l13.89,47.6h.37L49.83,1.85h19.82l-24.64,74.46v55.2h-20.38v-55.2Z"/>
      <path fill="#f4ba15" d="M94.76,124.94c-5.19-5.62-7.78-13.68-7.78-24.17V32.6c0-10.49,2.59-18.55,7.78-24.17,5.19-5.62,12.72-8.43,22.6-8.43s17.41,2.81,22.6,8.43c5.19,5.62,7.78,13.68,7.78,24.17v11.11h-19.26v-12.41c0-8.52-3.52-12.78-10.56-12.78s-10.56,4.26-10.56,12.78v70.94c0,8.4,3.52,12.59,10.56,12.59s10.56-4.2,10.56-12.59v-25.38h-10.19v-18.52h29.45v42.42c0,10.5-2.59,18.55-7.78,24.17-5.19,5.62-12.72,8.43-22.6,8.43s-17.41-2.81-22.6-8.43Z"/>
    </svg>
  </div>
)}

      {!dataLoading && (
        <>
          {view === 'dashboard'   && <DashboardView   projects={projects} setView={setView} />}
          {view === 'projects'    && <ProjectsView    projects={projects} workstreams={workstreams} onRefresh={fetchAll} toast={toast} />}
          {view === 'tasks'       && <TasksView       tasks={tasks} projects={projects} onRefresh={fetchAll} toast={toast} />}
          {view === 'workstreams' && <WorkstreamsView workstreams={workstreams} projects={projects} onRefresh={fetchAll} toast={toast} />}
        </>
      )}

      <ToastContainer />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}