import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout/Layout";
import PlaylistDetail from "./components/PlaylistDetail/PlaylistDetail";
import SongDetail from "./components/SongDetail/SongDetail";
import ProfileManagement from "./components/ProfileManagement/ProfileManagement";
import { UserProvider } from "./context/ProfileContext";
import ProfileLayout from "./components/Layout/ProfileLayout";
import ProfileTab from "./components/ProfileManagement/ProfileTab";
import AlbumsTab from "./components/ProfileManagement/AlbumsTab";
import SongsTab from "./components/ProfileManagement/SongsTab";
import AdminLayout from "./admin/layouts/AdminLayout";
import SongManagement from "./admin/components/SongManagement/SongManagement";
import UserManagement from "./admin/components/UserManagement/UserManagement";
import Login from "./admin/components/Login/Login";

function App() {
  const isAuthenticated = !!localStorage.getItem('user');
  return (
      <UserProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="playlist/:id" element={<PlaylistDetail />} />
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
          <Route
              path="/admin/login"
              element={isAuthenticated ? <Navigate to="/admin" /> : <Login />}
          />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<SongManagement />} />
            <Route path="songs" element={<SongManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>
          <Route path="*" element={<Navigate to="/admin/login" />} />
        </Routes>
      </UserProvider>
  );
}

export default App;