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
import ShareView from './pages/ShareView'
import './index.css'

function AppContent() {
  const { user, loading: authLoading } = useAuth()
  const { toast, ToastContainer } = useToast()

  const [view, setView] = useState('projects')
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])
  const [workstreams, setWorkstreams] = useState([])
  const [dataLoading, setDataLoading] = useState(false)
  const [pullY, setPullY] = useState(0)
  const [pulling, setPulling] = useState(false)

  const touchStartY = useRef(0)
  const hasFetched = useRef(false)

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

  useEffect(() => {
    if (user && !hasFetched.current) {
      hasFetched.current = true
      fetchAll()
    }
  }, [user, fetchAll])

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

  if (window.location.pathname === '/reset-password') {
    return <ResetPassword />
  }
  
  if (window.location.pathname === '/share') {
    return <ShareView />
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
        <svg height="100" viewBox="0 0 1080 1080" xmlns="http://www.w3.org/2000/svg"
		  style={{ animation: 'pulse 1.5s ease-in-out infinite' }}>
		  <path fill="#f4ba15" d="M251.58,461.14c0-125.78,96.88-225.21,224.36-225.21,70.54,0,130.03,30.59,165.72,73.08,5.95,6.8,10.2,16.15,10.2,23.8,0,18.69-14.45,31.44-34,31.44-12.75,0-19.55-6.8-28.89-14.45-26.35-29.74-64.59-50.99-113.03-50.99-86.68,0-155.52,71.39-155.52,162.32s68.84,162.32,155.52,162.32c47.59,0,86.69-21.25,113.03-50.99,8.5-7.65,16.15-15.3,28.89-15.3,19.55,0,34,13.6,34,32.3,0,6.8-4.25,16.15-10.2,22.95-35.69,42.49-94.33,73.94-165.72,73.94-127.48,0-224.36-99.44-224.36-225.21Z"/>
		  <path fill="#f4ba15" d="M489.9,356.24c-61.96,1.97-106.75,52.29-107.57,113.7-.1,7.5-20.55,7.85-21.11-.11-5.28-74.41,54.98-136.09,128.39-136.94,8.65-.1,12.62,4.16,13.33,9.64,1.04,8.01-3.55,13.41-13.03,13.71Z"/>
		  <rect fill="#f4ba15" x="701.11" y="363.98" width="26.85" height="194.31" rx="13.43" ry="13.43"/>
		  <rect fill="#f4ba15" x="749.39" y="389.79" width="29.45" height="142.69" rx="13.43" ry="13.43"/>
		  <rect fill="#f4ba15" x="799.47" y="407.82" width="28.95" height="106.62" rx="13.43" ry="13.43"/>
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
          <img
            src="/logo512.png"
            alt="logo"
            style={{
              width: '40px', height: '40px',
              borderRadius: '10px',
              opacity: pullY / 80,
              transform: `rotate(${pullY * 3}deg)`,
              filter: 'drop-shadow(0 2px 8px rgba(244,186,21,0.4))'
            }}
          />
        </div>
      )}

      {!dataLoading && (
        <>
          {view === 'dashboard' && <DashboardView projects={projects} setView={setView} />}
          {view === 'projects' && <ProjectsView projects={projects} workstreams={workstreams} onRefresh={fetchAll} toast={toast} />}
          {view === 'tasks' && <TasksView tasks={tasks} projects={projects} onRefresh={fetchAll} toast={toast} />}
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
