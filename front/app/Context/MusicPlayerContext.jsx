'use client'

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { useMusic } from './MusicContext'

const MusicPlayerContext = createContext()

export const MusicPlayerProvider = ({ children }) => {
  const audioRef = useRef(null)
  const { viewMusic } = useMusic()

  const [current, setCurrent] = useState(null)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off') // 'off' | 'one' | 'all'
  const [songs, setSongs] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
useEffect(() => {
    if (songs.length && !current) {
        // تعيين أول أغنية تلقائياً
        setTrack(songs[0], 0, songs)
    }
}, [songs])
  // ⏯️ التحكم في الصوت
  const play = async () => {
    if (!audioRef.current) return
    try {
      await audioRef.current.play()
      setPlaying(true)
    } catch (err) {
      console.error('Play failed:', err)
    }
  }

  const pause = () => {
    if (!audioRef.current) return
    audioRef.current.pause()
    setPlaying(false)
  }

  const togglePlay = () => (playing ? pause() : play())

  // 🔊 تغيير المقطع الحالي
  const setTrack = (track, index = 0, allSongs = songs) => {
    if (!track) return
    setCurrent(track)
    setCurrentIndex(index)
    if (allSongs?.length) setSongs(allSongs)
    if (audioRef.current) {
      audioRef.current.src = track.url
      audioRef.current.load()
      play()
      viewMusic(track._id)
    }
  }

  // ⏮️ السابق
  const prev = () => {
    if (!songs.length) return
    if (shuffle) {
      const rand = Math.floor(Math.random() * songs.length)
      return setTrack(songs[rand], rand)
    }
    const newIndex = (currentIndex - 1 + songs.length) % songs.length
    setTrack(songs[newIndex], newIndex)
  }

  // ⏭️ التالي
  const next = () => {
    if (!songs.length) return
    if (shuffle) {
      const rand = Math.floor(Math.random() * songs.length)
      return setTrack(songs[rand], rand)
    }
    let nextIndex = currentIndex + 1
    if (nextIndex >= songs.length) {
      if (repeatMode === 'all') nextIndex = 0
      else return pause()
    }
    setTrack(songs[nextIndex], nextIndex)
  }

  // ⏱️ التقدم
  const seek = (time) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = time
    setProgress(time)
  }

  // 🔊 الصوت
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  // 🎧 أحداث الصوت
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.currentTime)
    const onLoaded = () => setDuration(audio.duration)
    const onEnd = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        play()
      } else next()
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnd)
    }
  }, [repeatMode, songs, currentIndex, shuffle])

  return (
    <MusicPlayerContext.Provider
      value={{
        audioRef,
        current,
        setCurrent,
        playing,
        play,
        pause,
        togglePlay,
        progress,
        setProgress,
        duration,
        setDuration,
        volume,
        setVolume,
        muted,
        setMuted,
        shuffle,
        setShuffle,
        repeatMode,
        setRepeatMode,
        next,
        prev,
        seek,
        setTrack,
        songs,
        setSongs,
        currentIndex,
        setCurrentIndex,
      }}
    >
      <audio ref={audioRef} preload="metadata" hidden />
      {children}
    </MusicPlayerContext.Provider>
  )
}

export const useMusicPlayer = () => useContext(MusicPlayerContext)
