import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usePlayer } from '../../context/PlayerContext'
import { Play, Plus, MoreHorizontal, Maximize2, Minimize2 } from 'lucide-react'
import PlaylistCardList from '../PlaylistCard/PlaylistCardList'

function SongDetail() {
  const { id } = useParams()
  const { playSong, setVideoRef, isPlaying } = usePlayer()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const videoRef = useRef(null)

  // Danh sách bài hát từ playlist (giả lập)
  const playlistSongs = [
    {
      id: '1',
      title: 'Nhắn nhủ',
      artists: 'Ronboogz',
      image: 'https://via.placeholder.com/300',
      audioUrl: '/audio/nhannhu.mp3',
      videoUrl: '/video/nhannhu.mp4',
    },
    {
      id: '2',
      title: 'Trong bao nổi buồn',
      artists: 'Ronboogz',
      image: 'https://via.placeholder.com/300',
      audioUrl: '/audio/trongbaonoibuon.mp3',
      videoUrl: '/video/trongbaonoibuon.mp4',
    },
  ]

  // Tìm bài hát hiện tại dựa trên id
  const song = playlistSongs.find(s => s.id === id) || playlistSongs[0]

  // Khởi tạo bài hát mặc định khi vào trang
  useEffect(() => {
    if (!hasPlayed) {
      // Đảm bảo videoRef được set trước khi play
      if (videoRef.current) {
        setVideoRef(videoRef)
        const songIndex = playlistSongs.findIndex(s => s.id === id)
        playSong(song, playlistSongs, songIndex !== -1 ? songIndex : 0)
        setHasPlayed(true)
      }
    }
  }, [id, hasPlayed, playSong, setVideoRef])

  const handlePlay = () => {
    if (videoRef.current) {
      setVideoRef(videoRef)
      const songIndex = playlistSongs.findIndex(s => s.id === id)
      playSong(song, playlistSongs, songIndex !== -1 ? songIndex : 0)
    }
  }

  // Kiểm tra video URL
  useEffect(() => {
    if (song.videoUrl && videoRef.current) {
      console.log('Video URL:', song.videoUrl)
      videoRef.current.onerror = () => {
        console.error('Error loading video:', song.videoUrl)
      }
    }
  }, [song.videoUrl])

  return (
    <div className={`bg-[#1a1a1a] min-h-screen ${isFullScreen ? 'pb-20' : ''}`}>
      {/* Video Full Screen */}
      {isFullScreen && (
        <div className="fixed top-0 left-0 right-0 bottom-20 z-50 bg-black flex items-center justify-center">
          {song.videoUrl ? (
            <video
              ref={videoRef}
              src={song.videoUrl}
              className="max-h-full max-w-full"
              muted
            />
          ) : (
            <img src={song.image} alt={song.title} className="max-h-full max-w-full" />
          )}
          <button
            onClick={() => setIsFullScreen(false)}
            className="absolute top-4 right-4 text-white"
          >
            <Minimize2 size={24} />
          </button>
        </div>
      )}

      {/* Main Content */}
      {!isFullScreen && (
        <div className="flex min-h-screen">
          {/* Bên trái: Thông tin bài hát */}
          <div className="w-1/2 p-6">
            <div className="flex items-end space-x-6 mb-6">
              <img src={song.image} alt={song.title} className="w-60 h-60 rounded shadow-lg" />
              <div>
                <p className="text-sm text-gray-300">Bài hát</p>
                <h1 className="text-6xl font-bold text-white mt-2">{song.title}</h1>
                <p className="text-gray-300 mt-2">{song.artists} • Ghé Mới • 2025 • 3:46 • 2,320,083</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 mb-6">
              <button
                onClick={handlePlay}
                className="bg-spotify-base text-black rounded-full p-4 hover:bg-spotify-highlight"
              >
                <Play size={24} fill="black" />
              </button>
              <button className="text-gray-400 hover:text-white">
                <Plus size={24} />
              </button>
              <button className="text-gray-400 hover:text-white">
                <MoreHorizontal size={24} />
              </button>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Lời bài hát</h2>
              <p className="text-gray-400 whitespace-pre-line">
                Anh muốn có một em ghé mới (mới), một em ghé mới (mới)
                Một nguồn không theo sau và khi bên anh chỉ để làm phiên (chỉ để làm phiên)
                Baby, anh muốn em ghé mới (alright), một em ghé mới (new chick)
                Ngày em bước đi là khi đối anh ngập tràn trong xanh (trong xanh)
                Dừng đây anh về em ghé mới (ới ời), thích em ghé mới
                Dừng có để anh bên em ghé mới (mới), ôm em ghé mới (mới đêm)
                ...Xem thêm
              </p>
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-2">Nghệ sĩ</h2>
              <div className="text-gray-400 hover:text-white cursor-pointer">B RAY</div>
              <div className="text-gray-400 hover:text-white cursor-pointer">Young H</div>
            </div>
            <PlaylistCardList
              title="Bài hát của nghệ sĩ"
              data={[
                { id: 101, name: 'B RAY Hits', image: 'https://via.placeholder.com/150' },
                { id: 102, name: 'Young H Vibes', image: 'https://via.placeholder.com/150' },
                { id: 103, name: 'Rap Viet 2025', image: 'https://via.placeholder.com/150' },
              ]}
            />
          </div>
          {/* Bên phải: Video */}
          <div className="w-1/2 p-6 flex items-center justify-center relative">
            {song.videoUrl ? (
              <video
                ref={videoRef}
                src={song.videoUrl}
                className="w-full h-auto rounded-lg"
                muted
              />
            ) : (
              <img src={song.image} alt={song.title} className="w-full h-auto rounded-lg" />
            )}
            <button
              onClick={() => setIsFullScreen(true)}
              className="absolute bottom-4 right-4 text-white"
            >
              <Maximize2 size={24} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SongDetail