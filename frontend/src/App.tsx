import { useState } from 'react'
import DashboardPage from './pages/DashboardPage'
import LoginPage from './pages/LoginPage'
import { clearSession, readSession } from './lib/auth'
import type { Student } from './data/students'

export default function App() {
  const [session, setSession] = useState<Student | null>(() => readSession())

  function handleLogout() {
    clearSession()
    setSession(null)
  }

  if (!session) {
    return <LoginPage onSuccess={setSession} />
  }

  return <DashboardPage session={session} onLogout={handleLogout} />
}
