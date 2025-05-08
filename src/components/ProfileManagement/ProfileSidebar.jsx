import { Link, useLocation } from 'react-router-dom'
import { User, BookHeadphones , Music, LogOut, Ellipsis, House  } from 'lucide-react'

function ProfileSidebar() {
  const location = useLocation()

  
  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('currentUser')
    window.location.href = '/login'
  }

  return (
    <>
      <h2 className="text-2xl text-white font-semibold mb-6 text-center">Quản Lý Tài Khoản</h2>
      <nav className="flex-1">
        <ul className="space-y-2">
        <li>
            <Link
              to="/"
              className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a]`}
            >
              <House size={24} />
              <span>Trở về Spotify</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile/info"
              className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a] ${
                location.pathname === '/profile/info' ? 'bg-[#2a2a2a]' : ''
              }`}
            >
              <User size={24} />
              <span>Thông tin tài khoản</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile/changepassword"
              className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a] ${
                location.pathname === '/profile/changepassword' ? 'bg-[#2a2a2a]' : ''
              }`}
            >
              <Ellipsis size={24} />
              <span>Đổi mật khẩu</span>
            </Link>
          </li>
          <li>
            <Link
              to="/profile/playlist"
              className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a] ${
                location.pathname === '/profile/playlist' ? 'bg-[#2a2a2a]' : ''
              }`}
            >
              <BookHeadphones  size={24} />
              <span>Danh sách phát</span>
            </Link>
          </li>
          <li>
            <button
              onClick={logout}
              className="flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a]"
            >
              <LogOut size={24} />
              <span>Đăng Xuất</span>
            </button>
          </li>
        </ul>
      </nav>
    </>
  )
}

export default ProfileSidebar