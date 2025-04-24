import { Link, useLocation } from 'react-router-dom'
import { User, Album, Music, LogOut } from 'lucide-react'
import { useContext } from 'react'
import { UserContext } from '../../context/ProfileContext'

function ProfileSidebar() {
  const { currentUser } = useContext(UserContext)
  const location = useLocation()
  const isArtist = currentUser.role_id === 2

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
              <span>Chỉnh Sửa Thông Tin</span>
            </Link>
          </li>
          {isArtist && (
            <>
              <li>
                <Link
                  to="/profile/albums"
                  className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a] ${
                    location.pathname === '/profile/albums' ? 'bg-[#2a2a2a]' : ''
                  }`}
                >
                  <Album size={20} />
                  <span>Quản Lý Album</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/profile/songs"
                  className={`flex items-center space-x-2 w-full p-2 rounded text-white hover:bg-[#2a2a2a] ${
                    location.pathname === '/profile/songs' ? 'bg-[#2a2a2a]' : ''
                  }`}
                >
                  <Music size={20} />
                  <span>Quản Lý Bài Hát</span>
                </Link>
              </li>
            </>
          )}
          <li>
            <button
              onClick={() => alert('Đăng xuất thành công!')}
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