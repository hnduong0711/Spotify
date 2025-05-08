import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// Sidebar với 3 tab
const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (window.confirm('Bạn có chắc muốn đăng xuất?')) {
      localStorage.removeItem('adminToken');
      localStorage.removeItem('currentAdmin');
      navigate('/admin/login');
    }
  };

  return (
    <div className="w-52 h-screen bg-gray-800 text-white flex flex-col">
      <div className="p-4 text-xl font-bold">Quản Lý Spotify</div>
      <nav className="flex-1">
        <NavLink
          to="/admin/songs"
          className={({ isActive }) =>
            `block py-2 px-4 hover:bg-gray-700 ${
              isActive ? 'bg-blue-500' : ''
            }`
          }
        >
          Quản Lý Bài Hát
        </NavLink>
        <NavLink
          to="/admin/artists"
          className={({ isActive }) =>
            `block py-2 px-4 hover:bg-gray-700 ${
              isActive ? 'bg-blue-500' : ''
            }`
          }
        >
          Quản Lý Nghệ Sĩ
        </NavLink>
        <NavLink
          to="/admin/albums"
          className={({ isActive }) =>
            `block py-2 px-4 hover:bg-gray-700 ${
              isActive ? 'bg-blue-500' : ''
            }`
          }
        >
          Quản Lý Album
        </NavLink>
        <NavLink
          to="/admin/chat"
          className={({ isActive }) =>
            `block py-2 px-4 hover:bg-gray-700 ${
              isActive ? 'bg-blue-500' : ''
            }`
          }
        >
          Chat với AI
        </NavLink>
        <button
          onClick={handleLogout}
          className="w-full text-left py-2 px-4 hover:bg-gray-700"
        >
          Đăng Xuất
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;