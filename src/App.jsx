import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./layouts/UserLayout";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<HomePage />} />
        </Route>
        <Route path="user" element={<UserLayout />}>
          <Route index element={<UserHomePage />} />
          <Route path="profile" element={<UserProfilePage />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminHomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
