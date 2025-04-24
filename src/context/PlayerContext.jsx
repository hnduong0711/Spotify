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
    if (!song) return

    // Kiểm tra nếu bài hát đang phát và không thay đổi
    const currentSrc = audioRef.current.src || ''
    const newSrc = song.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    if (currentSrc === newSrc && !audioRef.current.paused) {
      return // Không làm gì nếu bài hát đang phát và không thay đổi
    }

    // Reset audio và video trước khi load mới
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (videoRef.current && typeof videoRef.current.pause === 'function') {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }

    // Set state và load mới
    setCurrentSong(song)
    setPlaylist(songs)
    setCurrentIndex(index)

    audioRef.current.src = newSrc
    audioRef.current.volume = volume

    // Đợi audio load trước khi play
    audioRef.current.onloadeddata = () => {
      console.log('Audio data loaded successfully:', newSrc)
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        if (videoRef.current && typeof videoRef.current.play === 'function') {
          console.log('Attempting to play video... videoRef:', videoRef.current)
          videoRef.current.currentTime = 0
          videoRef.current.play().then(() => {
            console.log('Video play successful')
          }).catch(err => {
            console.log('Video play failed:', err.message)
            // Retry sau 100ms
            setTimeout(() => {
              if (videoRef.current && typeof videoRef.current.play === 'function') {
                console.log('Retrying video play... videoRef:', videoRef.current)
                videoRef.current.play().catch(e => console.log('Retry video play failed:', e.message))
              }
            }, 100)
          })
        } else {
          console.log('Video ref not ready or invalid, videoRef:', videoRef.current)
        }
      }).catch(err => {
        console.log('Autoplay blocked:', err.message)
        setIsPlaying(false)
      })
    }

    audioRef.current.onerror = () => {
      console.error('Error loading audio:', newSrc)
      setIsPlaying(false)
    }
  }, [volume])

  const togglePlay = useCallback(() => {
    if (!currentSong) return // Không làm gì nếu chưa có bài hát

    if (isPlaying) {
      audioRef.current.pause()
      if (videoRef.current && typeof videoRef.current.pause === 'function') {
        videoRef.current.pause()
        console.log('Video paused at:', videoRef.current.currentTime)
      }
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        if (videoRef.current && typeof videoRef.current.play === 'function') {
          console.log('Attempting to play video... videoRef:', videoRef.current)
          videoRef.current.currentTime = audioRef.current.currentTime // Đồng bộ thời gian
          videoRef.current.play().then(() => {
            console.log('Video play successful')
          }).catch(err => {
            console.log('Video play failed:', err.message)
            // Retry sau 100ms
            setTimeout(() => {
              if (videoRef.current && typeof videoRef.current.play === 'function') {
                console.log('Retrying video play... videoRef:', videoRef.current)
                videoRef.current.play().catch(e => console.log('Retry video play failed:', e.message))
              }
            }, 100)
          })
        } else {
          console.log('Video ref not ready or invalid, videoRef:', videoRef.current)
        }
      }).catch(err => {
        console.log('Autoplay blocked:', err.message)
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
    if (videoRef.current && typeof videoRef.current.currentTime !== 'undefined') {
      // Chỉ đồng bộ nếu thời gian chênh lệch quá 0.5 giây
      if (Math.abs(videoRef.current.currentTime - audioRef.current.currentTime) > 0.5) {
        videoRef.current.currentTime = audioRef.current.currentTime
      }
    }
  }, [])

  const setTime = useCallback((time) => {
    audioRef.current.currentTime = time
    setCurrentTime(time)
    if (videoRef.current && typeof videoRef.current.currentTime !== 'undefined') {
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
        if (videoRef.current && typeof videoRef.current.play === 'function') {
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