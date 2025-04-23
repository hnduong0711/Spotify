import { createContext, useContext, useState, useRef, useCallback } from 'react'

const PlayerContext = createContext()

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [repeatMode, setRepeatMode] = useState('none') // none, all, one
  const [isShuffling, setIsShuffling] = useState(false) // Trạng thái Shuffle
  const [playlist, setPlaylist] = useState([]) // Danh sách bài hát
  const [currentIndex, setCurrentIndex] = useState(-1) // Vị trí bài hát hiện tại
  const audioRef = useRef(new Audio())
  const videoRef = useRef(null)

  const playSong = useCallback((song, songs = [], index = 0) => {
    if (audioRef.current && audioRef.current.src === (song.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3') && !audioRef.current.paused) {
      return // Không làm gì nếu bài hát đang phát và không thay đổi
    }

    setCurrentSong(song)
    setPlaylist(songs)
    setCurrentIndex(index)
    audioRef.current.src = song.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    audioRef.current.volume = volume
    audioRef.current.play().then(() => {
      setIsPlaying(true)
      if (videoRef.current && videoRef.current.play) {
        videoRef.current.currentTime = 0 // Reset video time
        videoRef.current.play().catch(err => console.log('Video play error:', err))
      }
    }).catch(err => {
      console.log('Autoplay blocked:', err)
      setIsPlaying(false)
    })
  }, [volume])

  const togglePlay = useCallback(() => {
    if (!currentSong) return // Không làm gì nếu chưa có bài hát

    if (isPlaying) {
      audioRef.current.pause()
      if (videoRef.current && videoRef.current.pause) {
        videoRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        if (videoRef.current && videoRef.current.play) {
          videoRef.current.currentTime = audioRef.current.currentTime // Đồng bộ thời gian
          videoRef.current.play().catch(err => console.log('Video play error:', err))
        }
      }).catch(err => {
        console.log('Autoplay blocked:', err)
        setIsPlaying(false)
      })
    }
  }, [currentSong, isPlaying])

  const playPrev = useCallback(() => {
    if (playlist.length === 0 || currentIndex === -1) return
    let newIndex = currentIndex - 1
    if (newIndex < 0) {
      newIndex = repeatMode === 'all' ? playlist.length - 1 : 0
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
      playSong(playlist[newIndex], playlist, newIndex)
    }
  }, [currentIndex, playlist, repeatMode, playSong])

  const playNext = useCallback(() => {
    if (playlist.length === 0 || currentIndex === -1) return
    let newIndex = currentIndex + 1
    if (newIndex >= playlist.length) {
      newIndex = repeatMode === 'all' ? 0 : currentIndex
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
      playSong(playlist[newIndex], playlist, newIndex)
    }
  }, [currentIndex, playlist, repeatMode, playSong])

  const shufflePlay = useCallback(() => {
    if (playlist.length === 0 || currentIndex === -1) return
    setIsShuffling(!isShuffling)
    if (!isShuffling) {
      const remainingSongs = playlist.filter((_, idx) => idx !== currentIndex)
      const randomIndex = Math.floor(Math.random() * remainingSongs.length)
      const newSong = remainingSongs[randomIndex]
      const newIndex = playlist.findIndex(song => song.id === newSong.id)
      setCurrentIndex(newIndex)
      playSong(newSong, playlist, newIndex)
    }
  }, [currentIndex, playlist, isShuffling, playSong])

  const updateTime = useCallback(() => {
    setCurrentTime(audioRef.current.currentTime)
    if (videoRef.current && videoRef.current.currentTime !== undefined) {
      // Chỉ đồng bộ nếu thời gian chênh lệch quá 0.5 giây
      if (Math.abs(videoRef.current.currentTime - audioRef.current.currentTime) > 0.5) {
        videoRef.current.currentTime = audioRef.current.currentTime
      }
    }
  }, [])

  const setTime = useCallback((time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
    if (videoRef.current && videoRef.current.currentTime !== undefined) {
      videoRef.current.currentTime = time
    }
  }, [])

  const setVolumeLevel = useCallback((vol) => {
    setVolume(vol)
    audioRef.current.volume = vol
  }, [])

  const setVideoRef = useCallback((ref) => {
    videoRef.current = ref
  }, [])

  audioRef.current.ontimeupdate = updateTime
  audioRef.current.onloadedmetadata = () => setDuration(audioRef.current.duration)
  audioRef.current.onended = () => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0
      audioRef.current.play().then(() => {
        if (videoRef.current && videoRef.current.play) {
          videoRef.current.currentTime = 0
          videoRef.current.play()
        }
      })
    } else if (isShuffling) {
      shufflePlay()
    } else {
      playNext()
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        isPlaying,
        currentTime,
        duration,
        volume,
        repeatMode,
        setRepeatMode,
        isShuffling,
        setIsShuffling,
        playSong,
        togglePlay,
        playPrev,
        playNext,
        shufflePlay,
        setTime,
        setVolumeLevel,
        setVideoRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}

export const usePlayer = () => useContext(PlayerContext)