import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { usePlayer } from '../../context/PlayerContext'
import { Play, Pause, Plus, MoreHorizontal, Maximize2, Minimize2 } from 'lucide-react'
import PlaylistCardList from '../PlaylistCard/PlaylistCardList'

function SongDetail() {
  const { id } = useParams()
  const { currentSong, setVideoRef, isPlaying, togglePlay } = usePlayer()
  const [isFullScreen, setIsFullScreen] = useState(false)
  const videoRef = useRef(null)

  useEffect(() => {
    if (videoRef.current) {
      console.log('Video ref set:', videoRef.current)
      setVideoRef(videoRef.current)
      if (isPlaying && videoRef.current.paused && currentSong?.videoUrl) {
        videoRef.current.play().catch(err => console.log('Video play failed:', err.message))
      } else if (!isPlaying && !videoRef.current.paused) {
        videoRef.current.pause()
      }
    } else {
      console.log('Video ref not ready yet')
    }
  }, [setVideoRef, isPlaying, currentSong?.videoUrl])

  useEffect(() => {
    if (currentSong?.videoUrl && videoRef.current) {
      console.log('Video URL updated:', currentSong.videoUrl)
      videoRef.current.onerror = () => {
        console.error('Error loading video:', currentSong.videoUrl)
      }
      videoRef.current.onplay = () => {
        console.log('Video is playing')
      }
      videoRef.current.onpause = () => {
        console.log('Video is paused')
      }
      videoRef.current.onloadeddata = () => {
        console.log('Video data loaded successfully')
      }
    }
  }, [currentSong?.videoUrl])

  if (!currentSong) {
    return <div className="text-white text-center mt-10">Đang tải...</div>
  }

  return (
    <div className={`bg-[#1a1a1a] min-h-screen ${isFullScreen ? 'pb-20' : ''}`}>
      <div className="flex min-h-screen">
        {/* Bên trái: Thông tin bài hát */}
        <div className="w-1/2 p-6">
          <div className="flex items-end space-x-6 mb-6">
            <img src={currentSong.image} alt={currentSong.title} className="w-60 h-60 rounded shadow-lg" />
            <div>
              <p className="text-sm text-gray-300">Bài hát</p>
              <h1 className="text-6xl font-bold text-white mt-2">{currentSong.title}</h1>
              <p className="text-gray-300 mt-2">{currentSong.artists} • {currentSong.duration || '0:00'}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 mb-6">
            <button
              onClick={togglePlay}
              className="bg-spotify-base text-black rounded-full p-4 hover:bg-spotify-highlight"
            >
              {isPlaying ? <Pause size={24} fill="black" /> : <Play size={24} fill="black" />}
            </button>
            <button className="text-gray-400 hover:text-white">
              <Plus size={24} />
            </button>
            <button className="text-gray-400 hover:text-white">
              <MoreHorizontal size={24} />
            </button>
          </div>
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Nghệ sĩ</h2>
            <div className="text-gray-400 hover:text-white cursor-pointer">{currentSong.artists}</div>
          </div>
        </div>
        {/* Bên phải: Video */}
        <div
          className={`${
            isFullScreen
              ? 'fixed top-0 left-0 right-0 bottom-20 z-50 bg-black flex items-center justify-center'
              : 'w-1/2 p-6 flex items-center justify-center relative'
          }`}
        >
          {currentSong.videoUrl ? (
            <video
              ref={videoRef}
              src={currentSong.videoUrl}
              className={isFullScreen ? 'max-h-full max-w-full' : 'w-full h-auto rounded-lg'}
              muted
              preload="auto"
            />
          ) : (
            <img
              src={currentSong.image}
              alt={currentSong.title}
              className={isFullScreen ? 'max-h-full max-w-full' : 'w-full h-auto rounded-lg'}
            />
          )}
          <button
            onClick={() => setIsFullScreen(!isFullScreen)}
            className={isFullScreen ? 'absolute top-4 right-4 text-white' : 'absolute bottom-4 right-4 text-white'}
          >
            {isFullScreen ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SongDetail