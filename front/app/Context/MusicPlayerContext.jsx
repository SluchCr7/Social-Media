'use client'

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react'
import { useMusic } from './MusicContext'

const MusicPlayerContext = createContext()

export const MusicPlayerProvider = ({ children }) => {
  const audioRef = useRef(null)
  const { addListen, music } = useMusic()
  const trackViewed = useRef(null)
  const [isReady, setIsReady] = useState(false)
  const isPlaybackRequested = useRef(false)

  // 🎵 الحالة العامة
  const [songs, setSongs] = useState(music || [])
  const [current, setCurrent] = useState(music?.[0] || null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off') // off | one | all
  const [expanded, setExpanded] = useState(false)
  const [viewMusicPlayer, setViewMusicPlayer] = useState(false)

  // 🧩 تزامن قائمة الموسيقى مع مصدر البيانات الخارجي
  useEffect(() => {
    if (music && music.length) {
      setSongs(music)
      if (!current || !music.some(m => m._id === current._id)) {
        setCurrent(music[0])
        setCurrentIndex(0)
      }
    } else if (!music?.length) {
      setSongs([])
      setCurrent(null)
      setCurrentIndex(0)
      pause()
    }
  }, [music])

  // ▶️ تشغيل
  const play = useCallback(
    async (isUserAction = false) => {
      const audio = audioRef.current
      if (!audio || !current?.url) return

      if (isUserAction) isPlaybackRequested.current = true
      if (!isPlaybackRequested.current) return

      try {
        await audio.play()
        console.log('▶️ Playing...')
        if (current?._id && trackViewed.current !== current._id) {
          addListen(current._id)
          trackViewed.current = current._id
        }
      } catch (err) {
        console.error('Play failed:', err)
        setPlaying(false)
        isPlaybackRequested.current = false
      }
    },
    [current, addListen]
  )

  // ⏸️ إيقاف مؤقت
  const pause = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.pause()
    isPlaybackRequested.current = false
    setPlaying(false) // ✅ تحديث مباشر
    console.log('⏸️ Paused')
  }, [])

  // 🔄 تبديل
  const togglePlay = useCallback(() => {
    if (!audioRef.current || !isReady) return
    if (playing) pause()
    else play(true)
  }, [playing, play, pause, isReady])

  // تغيير المسار
  // const setTrack = useCallback(
  //   (track, index = 0, allSongs = songs) => {
  //     if (!track) return
  //     const audio = audioRef.current
  //     audio?.pause()
  //     setPlaying(false)
  //     isPlaybackRequested.current = true
  //     setCurrent(track)
  //     setCurrentIndex(index)
  //     if (allSongs?.length) setSongs(allSongs)
  //     console.log('🎵 Track changed:', track.title)
  //   },
  //   [songs]
  // )
  const setTrack = useCallback(
    (track, index = 0, allSongs = songs) => {
      if (!track) return;
      const audio = audioRef.current;
      if (audio) {
        audio.pause();
        audio.src = ''; // ✅ تنظيف المصدر قبل تعيين الجديد
      }

      setPlaying(false);
      isPlaybackRequested.current = true;
      setCurrent(track);
      setCurrentIndex(index);
      if (allSongs?.length) setSongs(allSongs);

      // ✅ تحميل المصدر مباشرة بعد التحديث
      setTimeout(() => {
        if (audioRef.current && track?.url) {
          audioRef.current.src = track.url;
          audioRef.current.load();
          console.log('🎵 Track switched to:', track.title);
        }
      }, 50);
    },
    [songs]
  );

  // التالي
  const next = useCallback(() => {
    if (!songs.length) return
    let nextIndex
    if (shuffle) {
      do {
        nextIndex = Math.floor(Math.random() * songs.length)
      } while (nextIndex === currentIndex)
    } else {
      nextIndex = currentIndex + 1
      if (nextIndex >= songs.length) {
        if (repeatMode === 'all') nextIndex = 0
        else return pause()
      }
    }
    setTrack(songs[nextIndex], nextIndex, songs)
  }, [songs, currentIndex, shuffle, repeatMode, pause, setTrack])

  // السابق
  const prev = useCallback(() => {
    if (!songs.length) return
    let prevIndex
    if (shuffle) {
      do {
        prevIndex = Math.floor(Math.random() * songs.length)
      } while (prevIndex === currentIndex)
    } else {
      prevIndex = (currentIndex - 1 + songs.length) % songs.length
    }
    setTrack(songs[prevIndex], prevIndex, songs)
  }, [songs, currentIndex, shuffle, setTrack])

  // عند تغيير الأغنية
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current?.url) {
      setIsReady(false)
      pause()
      return
    }

    if (audio.src !== current.url) {
      audio.pause()
      audio.src = current.url
      audio.load()
      setPlaying(false)
      setProgress(0)
      setDuration(0)
      trackViewed.current = null
      setIsReady(false)
      console.log('🔄 Audio source updated')
    }
  }, [current, pause])

  // مراقبة الأحداث
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onTime = () => setProgress(audio.currentTime)
    const onLoaded = () => {
      setIsReady(true)
      setDuration(audio.duration)
      if (isPlaybackRequested.current && !playing) play(false)
    }
    const onEnd = () => {
      setPlaying(false)
      if (repeatMode === 'one') {
        audio.currentTime = 0
        play(false)
      } else next()
    }

    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadeddata', onLoaded)
    audio.addEventListener('ended', onEnd)

    return () => {
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadeddata', onLoaded)
      audio.removeEventListener('ended', onEnd)
    }
  }, [repeatMode, next, play, playing])

  // التحكم في الصوت
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume
    }
  }, [volume, muted])

  // التحكم بالتقدم
  const seek = (time) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = time
    setProgress(time)
    if (!playing) {
      isPlaybackRequested.current = true
      play(false)
    }
  }

  return (
    <MusicPlayerContext.Provider
      value={{
        audioRef,
        current,
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
        expanded,
        setExpanded,
        viewMusicPlayer,
        setViewMusicPlayer,
        isReady,
      }}
    >
      <audio ref={audioRef} preload="metadata" hidden />
      {children}
    </MusicPlayerContext.Provider>
  )
}

export const useMusicPlayer = () => useContext(MusicPlayerContext)