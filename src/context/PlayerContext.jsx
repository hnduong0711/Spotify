import { createContext, useContext, useState, useRef, useCallback } from 'react'

const PlayerContext = createContext()

export function PlayerProvider({ children }) {
  const [currentSong, setCurrentSong] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.5)
  const [repeatMode, setRepeatMode] = useState('none') // none, all, one
  const [isShuffling, setIsShuffling] = useState(false)
  const [playlist, setPlaylist] = useState([]) // Danh sách bài hát
  const [currentIndex, setCurrentIndex] = useState(-1)
  const audioRef = useRef(new Audio())
  const videoRef = useRef(null)

  const playSong = useCallback((song, songs = [], index = 0) => {
    if (!song) return

    const newSrc = song.audioUrl || 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
    if (audioRef.current.src === newSrc && !audioRef.current.paused) return

    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (videoRef.current && typeof videoRef.current.pause === 'function') {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }

    setCurrentSong(song)
    setPlaylist(songs)
    setCurrentIndex(index)
    console.log('Playing song:', song.title, 'at index:', index, 'playlist length:', songs.length)

    audioRef.current.src = newSrc
    audioRef.current.volume = volume

    audioRef.current.onloadeddata = () => {
      console.log('Audio data loaded:', newSrc)
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        if (videoRef.current && typeof videoRef.current.play === 'function') {
          videoRef.current.currentTime = 0
          videoRef.current.play().catch(err => console.log('Video play failed:', err.message))
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
    if (!currentSong) return

    if (isPlaying) {
      audioRef.current.pause()
      if (videoRef.current && typeof videoRef.current.pause === 'function') {
        videoRef.current.pause()
      }
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
        if (videoRef.current && typeof videoRef.current.play === 'function') {
          videoRef.current.play().catch(err => console.log('Video play failed:', err.message))
        }
      }).catch(err => {
        console.log('Autoplay blocked:', err.message)
        setIsPlaying(false)
      })
    }
  }, [currentSong, isPlaying])

  const playPrev = useCallback(() => {
    if (playlist.length === 0 || currentIndex === -1) {
      console.log('No playlist or invalid index for prev:', { playlistLength: playlist.length, currentIndex })
      return
    }
    let newIndex = currentIndex - 1
    if (newIndex < 0) {
      newIndex = repeatMode === 'all' ? playlist.length - 1 : 0
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
      playSong(playlist[newIndex], playlist, newIndex)
      console.log('Playing prev:', playlist[newIndex].title, 'at index:', newIndex)
    }
  }, [currentIndex, playlist, repeatMode, playSong])

  const playNext = useCallback(() => {
    if (playlist.length === 0 || currentIndex === -1) {
      console.log('No playlist or invalid index for next:', { playlistLength: playlist.length, currentIndex })
      return
    }
    let newIndex = currentIndex + 1
    if (newIndex >= playlist.length) {
      newIndex = repeatMode === 'all' ? 0 : currentIndex
    }
    if (newIndex !== currentIndex) {
      setCurrentIndex(newIndex)
      playSong(playlist[newIndex], playlist, newIndex)
      console.log('Playing next:', playlist[newIndex].title, 'at index:', newIndex)
    }
  }, [currentIndex, playlist, repeatMode, playSong])

  const shufflePlay = useCallback(() => {
    if (playlist.length <= 1 || currentIndex === -1) {
      console.log('Not enough songs or invalid index for shuffle:', { playlistLength: playlist.length, currentIndex })
      return
    }
    setIsShuffling(!isShuffling)
    if (!isShuffling) {
      const remainingSongs = playlist.filter((_, idx) => idx !== currentIndex)
      const randomIndex = Math.floor(Math.random() * remainingSongs.length)
      const newSong = remainingSongs[randomIndex]
      const newIndex = playlist.findIndex(song => song.id === newSong.id)
      setCurrentIndex(newIndex)
      playSong(newSong, playlist, newIndex)
      console.log('Shuffling to:', newSong.title, 'at index:', newIndex)
    }
  }, [currentIndex, playlist, isShuffling, playSong])

  const updateTime = useCallback(() => {
    setCurrentTime(audioRef.current.currentTime)
    if (videoRef.current && typeof videoRef.current.currentTime !== 'undefined') {
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
      audioRef.current.play()
      if (videoRef.current && typeof videoRef.current.play === 'function') {
        videoRef.current.currentTime = 0
        videoRef.current.play()
      }
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