import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import HomePage from "./pages/Homepage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Layout from "./components/Layout/Layout";
import PlaylistDetail from "./components/PlaylistDetail/PlaylistDetail";
import SongDetail from "./components/SongDetail/SongDetail";
import { UserProvider } from "./context/ProfileContext";
import ProfileLayout from "./components/Layout/ProfileLayout";
import ProfileTab from "./components/ProfileManagement/ProfileTab";
import PlaylistTab from "./components/ProfileManagement/PlaylistTab";
import SongsTab from "./components/ProfileManagement/SongsTab";
import AdminLayout from "./admin/layouts/AdminLayout";
import SongManagement from "./admin/components/SongManagement/SongManagement";
import UserManagement from "./admin/components/UserManagement/UserManagement";
import Login from "./admin/components/Login/Login";
import SearchResult from "./components/SearchResult/SearchResult";
import ChangePasswordTab from "./components/ProfileManagement/ChangePasswordTab";
import AlbumManagement from "./admin/components/AlbumManagement/AlbumManagement";
import AlbumDetailManagement from "./admin/components/AlbumDetailManagement/AlbumDetailManagement";
import Chat from "./admin/components/Chat/Chat";
import ChatAI from "./components/ChatAI/ChatAI";
import ChatConversation from "./components/Chat/ChatConversation/ChatConversation";
import ChatUser from "./components/Chat/Chat";

function App() {
  const isAuthenticated = !!localStorage.getItem("currentAdmin");
  const isUserAuthenticated = !!localStorage.getItem("currentUser");

  return (
    <UserProvider>
      <Routes>
        <Route
          element={<ProtectedRoute isAuthenticated={isUserAuthenticated} />}
        >
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path=":type/:id" element={<PlaylistDetail />} />
            <Route path="song/:id" element={<SongDetail />} />
            <Route path="search" element={<SearchResult />} />
            <Route path="chat-ai" element={<ChatAI />} />
            <Route path="/Chat" element={<ChatUser />} />
            <Route
              path="/Chat/ChatConversation/:userId/:username"
              element={<ChatConversation />}
            />
          </Route>
          <Route path="/profile" element={<ProfileLayout />}>
            <Route index element={<ProfileTab />} />
            <Route path="info" element={<ProfileTab />} />
            <Route path="playlist" element={<PlaylistTab />} />
            <Route path="songs" element={<SongsTab />} />
            <Route path="changepassword" element={<ChangePasswordTab />} />
          </Route>
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/admin/login"
          element={isAuthenticated ? <Navigate to="/admin" /> : <Login />}
        />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<SongManagement />} />
          <Route path="songs" element={<SongManagement />} />
          <Route path="artists" element={<UserManagement />} />
          <Route path="albums" element={<AlbumManagement />} />
          <Route path="chat" element={<Chat />} />
          <Route path="albums/:albumId" element={<AlbumDetailManagement />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
      <ToastContainer />
    </UserProvider>
  );
}

const ProtectedRoute = ({ isAuthenticated }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

export default App;
