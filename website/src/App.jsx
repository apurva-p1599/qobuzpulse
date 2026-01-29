import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Artists from './pages/Artists'
import Genres from './pages/Genres'
import Tracks from './pages/Tracks'
import Momentum from './pages/Momentum'
import Insights from './pages/Insights'

function App() {
  return (
    <ErrorBoundary>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/tracks" element={<Tracks />} />
            <Route path="/momentum" element={<Momentum />} />
            <Route path="/insights" element={<Insights />} />
          </Routes>
        </Layout>
      </Router>
    </ErrorBoundary>
  )
}

export default App
