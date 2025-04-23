import { useContext } from 'react'
import { Link } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'

function Header() {
  const { user, logout } = useContext(AuthContext)

  return (
    <header className="bg-spotify-black h-16 flex items-center justify-between px-6">
      <div className="flex items-center">
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png"
          alt="Spotify Logo"
          className="h-8"
        />
      </div>
      <div className="flex-1 mx-6">
        <div className="relative max-w-md border border-gray-600 rounded-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search for songs, artists, playlists..."
            className="w-full pl-10 pr-4 py-2 bg-spotify-gray rounded-full text-white placeholder-gray-400"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button>
          <Bell className="text-white hover:text-spotify-green" size={24} />
        </button>
        {user ? (
          <div className="flex items-center space-x-2">
            <img
              src={user.avatar || 'https://via.placeholder.com/32'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-semibold">{user.name || 'User'}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-spotify-green"
            >
              Log Out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="text-sm font-semibold text-white hover:text-spotify-green"
          >
            Log In
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header