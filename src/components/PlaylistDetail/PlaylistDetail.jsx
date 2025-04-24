import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Play, Plus, Clock } from 'lucide-react'

function PlaylistDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [showFixedHeader, setShowFixedHeader] = useState(false)
  const headerRef = useRef(null)

  const playlist = {
    id: id,
    name: 'Daily Mix 1',
    description: 'B RAY, Masew, HIEUTHUHAI và nhiều hơn nữa',
    image: 'https://via.placeholder.com/300',
    creator: 'Spotify',
    songs: 50,
    duration: 'khoảng 2 giờ 45 phút',
    tracks: [
      {
        id: 1,
        title: 'Nhắn nhủ',
        artists: 'Ronboogz',
        album: 'Bác sĩ tâm hồn Ronboogz',
        duration: '3:46',
        image: 'https://via.placeholder.com/40',
      },
      {
        id: 2,
        title: 'Trong bao nổi buồn',
        artists: 'Ronboogz',
        album: 'Bác sĩ tâm hồn Ronboogz',
        duration: '4:27',
        image: 'https://via.placeholder.com/40',
      },
    ],
  }

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerBottom = headerRef.current.getBoundingClientRect().bottom
        setShowFixedHeader(headerBottom <= 0)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="bg-gradient-to-b from-[#1a6a6a] to-[#1a1a1a] min-h-screen">
      {showFixedHeader && (
        <div className="fixed top-0 left-0 right-0 z-40 bg-[#1a1a1a] p-4 flex items-center space-x-4">
          <button className="bg-spotify-base text-black rounded-full p-2 hover:bg-spotify-highlight">
            <Play size={16} fill="black" />
          </button>
          <h1 className="text-xl font-bold text-white">{playlist.name}</h1>
        </div>
      )}

      <div ref={headerRef} className="p-6 flex items-end space-x-6">
        <img src={playlist.image} alt={playlist.name} className="w-60 h-60 rounded shadow-lg" />
        <div>
          <p className="text-sm text-gray-300">Danh sách phát công khai</p>
          <h1 className="text-6xl font-bold text-white mt-2">{playlist.name}</h1>
          <p className="text-gray-300 mt-2">{playlist.description}</p>
          <p className="text-gray-300 mt-2">
            <span className="font-semibold text-white">{playlist.creator}</span> • {playlist.songs} bài hát, {playlist.duration}
          </p>
        </div>
      </div>

      <div className="p-6 flex items-center space-x-4 bg-[#1a1a1a] bg-opacity-70">
        <div className="relative group">
          <button className="bg-spotify-base text-black rounded-full p-4 hover:bg-spotify-highlight">
            <Play size={24} fill="black" />
          </button>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            Phát danh sách
          </span>
        </div>
        <div className="relative group">
          <button className="text-gray-400 hover:text-white">
            <Plus size={24} />
          </button>
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap">
            Lưu vào thư viện của bạn
          </span>
        </div>
      </div>

      <div className="p-6 bg-[#1a1a1a]">
        <div className="grid grid-cols-12 gap-4 text-gray-400 border-b border-gray-700 pb-2">
          <div className="col-span-1">#</div>
          <div className="col-span-5">Tiêu đề</div>
          <div className="col-span-4">Album</div>
          <div className="col-span-2 flex justify-end">
            <Clock size={16} />
          </div>
        </div>
        {playlist.tracks.map((track, index) => (
          <div
            key={track.id}
            className="grid grid-cols-12 gap-4 py-2 hover:bg-[#2a2a2a] rounded transition cursor-pointer"
            onClick={() => navigate(`/song/${track.id}`)}
          >
            <div className="col-span-1 text-gray-400">{index + 1}</div>
            <div className="col-span-5 flex items-center space-x-4">
              <img src={track.image} alt={track.title} className="w-10 h-10 rounded" />
              <div>
                <p className="text-white">{track.title}</p>
                <p className="text-gray-400 text-sm">{track.artists}</p>
              </div>
            </div>
            <div className="col-span-4 text-gray-400">{track.album}</div>
            <div className="col-span-2 text-gray-400 text-right">{track.duration}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlaylistDetail