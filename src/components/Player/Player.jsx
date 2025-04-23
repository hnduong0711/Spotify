import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { useState } from 'react'

function Player() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div className="bg-[#282828] h-20 w-full flex items-center justify-between px-4">
      <div className="flex items-center space-x-4">
        <img src="https://via.placeholder.com/48" alt="Song" className="w-12 h-12 rounded" />
        <div>
          <p className="text-sm font-semibold">Song Title</p>
          <p className="text-xs text-gray-400">Artist Name</p>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <button><SkipBack size={20} /></button>
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button><SkipForward size={20} /></button>
        <div className="w-64 bg-gray-600 h-1 rounded">
          <div className="bg-spotify-green h-1 w-1/3 rounded"></div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Volume2 size={20} />
        <div className="w-24 bg-gray-600 h-1 rounded">
          <div className="bg-spotify-green h-1 w-2/3 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export default Player