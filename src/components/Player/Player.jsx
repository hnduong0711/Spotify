import { usePlayer } from '../../context/PlayerContext'
import { Play, Pause, SkipBack, SkipForward, Volume2, Repeat, Shuffle } from 'lucide-react'

function Player() {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    volume,
    repeatMode,
    setRepeatMode,
    isShuffling,
    setIsShuffling,
    togglePlay,
    playPrev,
    playNext,
    shufflePlay,
    setTime,
    setVolumeLevel,
  } = usePlayer()

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
  }

  const handleProgressChange = (e) => {
    const newTime = (e.target.value / 100) * duration
    setTime(newTime)
  }

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value / 100
    setVolumeLevel(newVolume)
  }

  const toggleRepeatMode = () => {
    if (repeatMode === 'none') setRepeatMode('all')
    else if (repeatMode === 'all') setRepeatMode('one')
    else setRepeatMode('none')
  }

  return (
    <div className="bg-[#282828] h-20 w-full flex items-center justify-between px-4 fixed bottom-0 left-0 right-0">
      <div className="flex items-center space-x-4">
        <img
          src={currentSong?.image || 'https://via.placeholder.com/48'}
          alt="Song"
          className="w-12 h-12 rounded"
        />
        <div>
          <p className="text-sm font-semibold">{currentSong?.title || 'Song Title'}</p>
          <p className="text-xs text-gray-400">{currentSong?.artists || 'Artist Name'}</p>
        </div>
      </div>
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-4">
          <button onClick={shufflePlay} disabled={!currentSong}>
            <Shuffle size={20} className={isShuffling ? 'text-spotify-base' : 'text-white'} />
          </button>
          <button onClick={playPrev} disabled={!currentSong}>
            <SkipBack size={20} className={!currentSong ? 'text-gray-600' : 'text-white'} />
          </button>
          <button onClick={togglePlay} disabled={!currentSong}>
            {isPlaying ? (
              <Pause size={24} className={!currentSong ? 'text-gray-600' : 'text-white'} />
            ) : (
              <Play size={24} className={!currentSong ? 'text-gray-600' : 'text-white'} />
            )}
          </button>
          <button onClick={playNext} disabled={!currentSong}>
            <SkipForward size={20} className={!currentSong ? 'text-gray-600' : 'text-white'} />
          </button>
          <button onClick={toggleRepeatMode} disabled={!currentSong} className="relative">
            <Repeat size={20} className={repeatMode !== 'none' ? 'text-spotify-base' : 'text-white'} />
            {repeatMode === 'one' && (
              <span className="absolute top-0 right-0 text-xs text-spotify-base">1</span>
            )}
          </button>
        </div>
        <div className="flex items-center space-x-2 w-64">
          <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
          <input
            type="range"
            min="0"
            max="100"
            value={(currentTime / duration) * 100 || 0}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-600 rounded appearance-none"
            style={{
              background: `linear-gradient(to right, #1ed760 ${(currentTime / duration) * 100 || 0}%, #4b4b4b ${(currentTime / duration) * 100 || 0}%)`,
            }}
          />
          <span className="text-xs text-gray-400">{formatTime(duration)}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <Volume2 size={20} />
        <input
          type="range"
          min="0"
          max="100"
          value={volume * 100}
          onChange={handleVolumeChange}
          className="w-24 h-1 bg-gray-600 rounded appearance-none"
          style={{
            background: `linear-gradient(to right, #1ed760 ${volume * 100}%, #4b4b4b ${volume * 100}%)`,
          }}
        />
      </div>
    </div>
  )
}

export default Player