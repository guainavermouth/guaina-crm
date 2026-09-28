import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import AuthGate from './components/AuthGate'
import LeadsPage from './pages/LeadsPage'
import KanbanPage from './pages/KanbanPage'
import PitchesPage from './pages/PitchesPage'
import { isAuthenticated } from './lib/auth'

function App() {
  const [authed, setAuthed] = useState(() => isAuthenticated())

  if (!authed) {
    return <AuthGate onAuthenticated={() => setAuthed(true)} />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LeadsPage />} />
        <Route path="/kanban" element={<KanbanPage />} />
        <Route path="/pitches" element={<PitchesPage />} />
      </Routes>
    </Layout>
  )
}

export default App
