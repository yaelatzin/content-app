import { useState, useEffect, useCallback } from 'react'
import { supabase } from './lib/supabase'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { useToast } from './hooks/useToast'
import NavBar from './components/NavBar'
import LoginPage from './pages/LoginPage'
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

  if (authLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <div className="logo">CONTENT_APP</div>
      </div>
    )
  }

  if (!user) return <LoginPage />

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)' }}>
      <NavBar currentView={view} setView={setView} />

      {dataLoading && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '24px' }}>
          <div className="spinner" />
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
