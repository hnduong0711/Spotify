import { useState } from 'react'
import { Home, Library, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  const playlists = [
    { id: 1, name: 'RapViet for life', image: 'https://via.placeholder.com/32' },
  ]

  return (
    <motion.div
      animate={{ width: isOpen ? 280 : 80 }} // Tăng từ 240px lên 280px
      className="bg-[#1a1a1a] h-[calc(100vh-80px)] p-4 flex flex-col border-r border-gray-700 rounded-r-lg"
    >
      <button onClick={() => setIsOpen(!isOpen)} className="mb-4 self-end">
        {isOpen ? <ChevronLeft size={24} className="text-white" /> : <ChevronRight size={24} className="text-white" />}
      </button>
      <nav className="flex-1">
        <ul className="space-y-2">
          <li>
            <a href="/" className="flex items-center space-x-2 text-white hover:text-spotify-green">
              <Home size={24} />
              {isOpen && <span>Home</span>}
            </a>
          </li>
          <li>
            <a href="/library" className="flex items-center space-x-2 text-white hover:text-spotify-green">
              <Library size={24} />
              {isOpen && <span>Library</span>}
            </a>
          </li>
          <li>
            <a href="/create" className="flex items-center space-x-2 text-white hover:text-spotify-green">
              <Plus size={24} />
              {isOpen && <span>Create Playlist</span>}
            </a>
          </li>
        </ul>
        {isOpen ? (
          <div className="mt-4">
            <h3 className="text-sm font-semibold">Your Playlists</h3>
            <ul className="mt-2 space-y-1">
              {playlists.map(playlist => (
                <li key={playlist.id}>
                  <a href="#" className="flex items-center space-x-2 text-white hover:text-spotify-green cursor-pointer">
                    <img src={playlist.image} alt={playlist.name} className="w-8 h-8 rounded" />
                    <span>{playlist.name}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mt-4">
            <ul className="space-y-2">
              {playlists.map(playlist => (
                <li key={playlist.id}>
                  <a href="#" className="flex items-center justify-center text-white hover:text-spotify-green cursor-pointer">
                    <img src={playlist.image} alt={playlist.name} className="w-8 h-8 rounded" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </motion.div>
  )
}

export default Sidebar