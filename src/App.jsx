import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout/Layout";
import PlaylistDetail from "./components/PlaylistDetail/PlaylistDetail";
import SongDetail from "./components/SongDetail/SongDetail";
import ProfileManagement from "./components/ProfileManagement/ProfileManagement";
import { UserProvider } from "./context/ProfileContext";
import ProfileLayout from './components/Layout/ProfileLayout'
import ProfileTab from './components/ProfileManagement/ProfileTab'
import AlbumsTab from './components/ProfileManagement/AlbumsTab'
import SongsTab from './components/ProfileManagement/SongsTab'

function App() {
  return (
    <UserProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path=":type/:id" element={<PlaylistDetail />} />
          <Route path=":type/:id" element={<PlaylistDetail />} />
          <Route path="song/:id" element={<SongDetail />} />
          <Route path="/profile" element={<ProfileManagement />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/profile" element={<ProfileLayout />}>
          <Route path="info" element={<ProfileTab />} />
          <Route path="albums" element={<AlbumsTab />} />
          <Route path="songs" element={<SongsTab />} />
          <Route index element={<ProfileTab />} />
        </Route>
      </Routes>
    </UserProvider>
  );
}

export default App;
