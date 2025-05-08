import { Link, useLocation } from 'react-router-dom'
import { User, Album, Music, LogOut } from 'lucide-react'

function ProfileSidebar() {
  const location = useLocation()

  
  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('currentUser')
    window.location.href = '/login'
  }

  return (
    <>
      <h2 className="text-xl text-white font-semibold mb-6">Quản Lý Tài Khoản</h2>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <Link
              to="/profile/info"
              className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a] ${
                location.pathname === '/profile/info' ? 'bg-[#2a2a2a]' : ''
              }`}
            >
              <User size={20} />
              <span>Thông tin tài khoản</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile/playlist"
              className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a] ${
                location.pathname === '/profile/playlist' ? 'bg-[#2a2a2a]' : ''
              }`}
            >
              <User size={20} />
              <span>Danh sách phát</span>
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a]"
            >
              <LogOut size={20} />
              <span>Đăng Xuất</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default ProfileSidebar