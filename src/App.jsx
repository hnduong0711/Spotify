import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/Homepage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Layout from './components/Layout/Layout'
import PlaylistDetail from './components/PlaylistDetail/PlaylistDetail'
import SongDetail from './components/SongDetail/SongDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="playlist/:id" element={<PlaylistDetail />} />
        <Route path="song/:id" element={<SongDetail />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  )
}

export default App