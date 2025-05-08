import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Bell, Search } from 'lucide-react'

function Header() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const user = JSON.parse(localStorage.getItem('currentUser')) || {}

  const logout = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('currentUser')
    window.location.href = '/login'
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' || e.type === 'click') {
      if (searchQuery.trim()) {
        navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
        setSearchQuery('')
      }
    }
  }

  return (
    <header className="bg-spotify-black h-16 flex items-center justify-between px-6">
      <div className="flex items-center cursor-pointer">
        <img
          src="https://storage.googleapis.com/pr-newsroom-wp/1/2018/11/Spotify_Logo_CMYK_Green.png"
          alt="Spotify Logo"
          className="h-8"
          onClick={() => window.location.href = '/'}
        />
      </div>
      <div className="flex-1 mx-6">
        <div className="relative max-w-md border border-gray-600 rounded-full">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
            size={20}
            onClick={handleSearch}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            placeholder="Search for songs, artists, playlists..."
            className="w-full pl-10 pr-4 py-2 bg-spotify-gray rounded-full text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-spotify-green"
          />
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {user ? (
          <Link className="flex items-center space-x-4" to="/profile">
            <img
              src={user.avatar || 'https://freesvg.org/img/abstract-user-flat-3.png'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full"
            />
            <span className="text-sm font-semibold">{user.username || 'User'}</span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-spotify-green"
            >
              Log Out
            </button>
          </Link>
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