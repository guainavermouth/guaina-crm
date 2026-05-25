import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import LeadsPage from './pages/LeadsPage'
import KanbanPage from './pages/KanbanPage'
import PitchesPage from './pages/PitchesPage'

function App() {
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
