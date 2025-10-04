'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPlay, FaPause, FaStepBackward, FaStepForward,
  FaRandom, FaRedo, FaHeart, FaShareAlt,
  FaVolumeUp, FaSearch, FaExpand, FaHome, FaMusic, FaUpload, FaCog, FaListUl
} from 'react-icons/fa'
import Image from 'next/image'
import { useMusic } from '../../Context/MusicContext' // ✅ استدعاء الكونتكست
import AddMusicModal from '@/app/Component/AddMusicMenu'
import { useAuth } from '@/app/Context/AuthContext'

// ----------------------
// Utility
// ----------------------
const formatTime = (s = 0) => {
  if (!s || isNaN(s)) return '0:00'
  const mm = Math.floor(s / 60)
  const ss = Math.floor(s % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}

// ----------------------
// Main Component
// ----------------------
export default function MusicPage() {
  // ✅ جايب البيانات من الكونتكست
  const { music: songs, isLoading, likeMusic, viewMusic } = useMusic()
  const {user} = useAuth()

  // player state
  const audioRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const current = songs[currentIndex] || null
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off') // 'off' | 'one' | 'all'
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [openModel , setOpenModel] = useState(false)
  const [showLeftNav, setShowLeftNav] = useState(false)

  // derived filtered list
  const filtered = useMemo(() => {
    if (!search) return songs
    const q = search.toLowerCase()
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        s.album.toLowerCase().includes(q)
    )
  }, [songs, search])

  // sync audio element when current changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    audio.src = current.url
    audio.load()
    setProgress(0)
    setDuration(current.duration || 0)
    if (playing) {
      audio.play().catch(() => setPlaying(false))
    }
    // ✅ عداد المشاهدات
    if (current?._id) viewMusic(current._id)
  }, [currentIndex, current?.url])

  // audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.currentTime)
    const onLoaded = () => {
      setDuration(audio.duration || current?.duration || 0)
      if (playing) audio.play().catch(() => setPlaying(false))
    }
    const onEnd = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0
        audio.play()
      } else {
        handleNext()
      }
    }
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('ended', onEnd)
    }
  }, [playing, repeatMode, currentIndex, songs, shuffle])

  // play/pause toggle
  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch (err) {
        console.error('Play failed', err)
        setPlaying(false)
      }
    }
  }

  const handlePrev = () => {
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * songs.length))
      return
    }
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0
      return
    }
    setCurrentIndex((i) => (i - 1 + songs.length) % songs.length)
  }

  const handleNext = () => {
    if (!songs.length) return
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random() * songs.length))
      return
    }
    setCurrentIndex((i) => {
      const next = i + 1
      if (next >= songs.length) {
        if (repeatMode === 'all') return 0
        setPlaying(false)
        return i
      }
      return next
    })
  }

  // seek
  const handleSeek = (e) => {
    const rect = e.target.getBoundingClientRect()
    const x = (e.clientX || (e.touches && e.touches[0].clientX)) - rect.left
    const pct = Math.max(0, Math.min(1, x / rect.width))
    const time = pct * (duration || current?.duration || 0)
    audioRef.current.currentTime = time
    setProgress(time)
  }

  // volume
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  // start first song if available
  useEffect(() => {
    if (!songs.length) return
    setCurrentIndex((i) => Math.min(i, songs.length - 1))
  }, [songs.length])

  // accent style
  const accentStyle = useMemo(() => {
    return {
      background: `linear-gradient(90deg, rgba(99,102,241,0.12), rgba(236,72,153,0.06))`,
    }
  }, [current?.cover])

  // queue helper
  const queue = useMemo(() => {
    if (!songs.length) return []
    return songs.slice(currentIndex + 1).concat(songs.slice(0, currentIndex))
  }, [songs, currentIndex])

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 relative overflow-x-hidden">
      <AddMusicModal isOpen={openModel} onClose={()=> setOpenModel(false)}/>
      <audio ref={audioRef} preload="metadata" />

      {/* Dynamic blurred hero background from cover */}
      {current?.cover && (
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 -z-10"
          style={{
            backgroundImage: `url(${current.cover})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(60px) brightness(0.35)'
          }}
        />
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/60 dark:bg-black/40 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-2 rounded-md border bg-white/20" onClick={()=> setShowLeftNav(s=>!s)}>
              <FaListUl />
            </button>
            <div className="text-2xl font-bold">Zocial</div>
            <div className="hidden md:flex items-center gap-2 bg-white/80 dark:bg-gray-800/60 rounded-full px-3 py-1 border">
              <FaSearch className="text-gray-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search songs, artists, albums..."
                className="bg-transparent outline-none w-64 text-sm text-gray-700 dark:text-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-3">
              <button onClick={()=> setOpenModel(true)} className="px-3 py-1 rounded-md border">Upload</button>
              <div className="hidden md:block text-sm text-gray-500">{user?.username}</div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Nav (collapsible on mobile) */}
        <aside className={`lg:col-span-2 transition-transform duration-300 ${showLeftNav ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-auto bg-white/60 dark:bg-black/40 border-r border-gray-200 dark:border-gray-800 backdrop-blur-md p-4 lg:p-0`}>
          <div className="lg:block hidden lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:pt-6">
            <nav className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <FaHome />
                <span className="ml-2">Home</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <FaMusic />
                <span className="ml-2">Discover</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <FaHeart />
                <span className="ml-2">Liked</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={()=> setOpenModel(true)}>
                <FaUpload />
                <span className="ml-2">Upload</span>
              </div>
              <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
                <FaCog />
                <span className="ml-2">Settings</span>
              </div>
            </nav>
          </div>
          {/* Mobile close button */}
          <div className="lg:hidden mt-4">
            <button className="px-3 py-2 rounded-md border" onClick={()=> setShowLeftNav(false)}>Close</button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-7 space-y-6">
          {/* Featured */}
          <div className="rounded-2xl p-6 relative" style={accentStyle}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-48 h-48 md:w-40 md:h-40 rounded-xl shadow-2xl overflow-hidden bg-gray-200">
                {current?.cover && (
                  <Image src={current.cover} alt={current.title} fill className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Now Playing</div>
                    <h2 className="text-2xl font-semibold">
                      {current?.title || 'Select a song'}
                    </h2>
                    <div className="text-sm text-gray-500 mt-1">
                      {current?.artist} • {current?.album}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => current?._id && likeMusic(current._id)}
                      className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40"
                    >
                      <FaHeart />
                    </button>
                    <button className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40">
                      <FaShareAlt />
                    </button>
                    <button
                      onClick={() => setExpanded(true)}
                      className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40"
                    >
                      <FaExpand />
                    </button>
                  </div>
                </div>

                {/* Player controls */}
                <div className="mt-6">
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                    <button
                      onClick={() => setShuffle((s) => !s)}
                      className={`p-3 rounded-full ${
                        shuffle
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/20 dark:bg-gray-800/40'
                      }`}
                      title="Shuffle"
                    >
                      <FaRandom />
                    </button>
                    <button
                      onClick={handlePrev}
                      className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40"
                    >
                      <FaStepBackward />
                    </button>
                    <button
                      onClick={togglePlay}
                      className="p-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl shadow-lg"
                    >
                      {playing ? <FaPause /> : <FaPlay />}
                    </button>
                    <button
                      onClick={handleNext}
                      className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40"
                    >
                      <FaStepForward />
                    </button>
                    <button
                      onClick={() =>
                        setRepeatMode((m) =>
                          m === 'off' ? 'all' : m === 'all' ? 'one' : 'off'
                        )
                      }
                      className={`p-3 rounded-full ${
                        repeatMode !== 'off'
                          ? 'bg-blue-600 text-white'
                          : 'bg-white/20 dark:bg-gray-800/40'
                      }`}
                      title="Repeat"
                    >
                      <FaRedo />
                    </button>
                  </div>

                  {/* progress */}
                  <div className="mt-4">
                    <div className="flex items-center gap-4">
                      <div className="text-xs w-12 text-right">{formatTime(progress)}</div>
                      <div
                        className="flex-1"
                        onClick={handleSeek}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 w-full relative">
                          <div
                            style={{
                              width: `${(progress / (duration || 1)) * 100}%`,
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all shadow-[0_0_10px_rgba(99,102,241,0.45)]"
                          />
                        </div>
                      </div>
                      <div className="text-xs w-12">{formatTime(duration)}</div>
                    </div>
                    <div className="mt-2 flex items-center gap-3 justify-end">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaVolumeUp />
                        <input
                          type="range"
                          min={0}
                          max={1}
                          step={0.01}
                          value={muted ? 0 : volume}
                          onChange={(e) => {
                            setVolume(Number(e.target.value))
                            setMuted(false)
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* subtle animations */}
            <AnimatePresence>
              {expanded && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="absolute inset-0 bg-black/30 flex items-center justify-center p-6"
                >
                  <div className="bg-white/90 dark:bg-gray-900/90 rounded-2xl p-6 w-full max-w-3xl">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-semibold">Expanded Player</h3>
                      <button onClick={()=> setExpanded(false)} className="px-3 py-1 rounded-md border">Close</button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-1 relative w-full h-56 rounded-xl overflow-hidden bg-gray-200">
                        {current?.cover && <Image src={current.cover} alt={current.title} fill className="object-cover" />}
                      </div>
                      <div className="md:col-span-2">
                        <h4 className="text-lg font-semibold">{current?.title}</h4>
                        <div className="text-sm text-gray-500 mt-1">{current?.artist} • {current?.album}</div>
                        <div className="mt-4">
                          <div className="text-xs">Progress</div>
                          <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 mt-2">
                            <div style={{ width: `${(progress / (duration || 1)) * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
                          </div>
                          <div className="mt-2 text-sm flex justify-between"><span>{formatTime(progress)}</span><span>{formatTime(duration)}</span></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Playlist */}
          <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
            <h3 className="text-lg font-semibold mb-3">Playlist</h3>
            {isLoading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-2">
                {filtered.map((s, i) => (
                  <div
                    key={s._id}
                    className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition ${
                      current?._id === s._id ? 'ring-2 ring-blue-400 bg-white/30' : ''
                    }`}
                  >
                    <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200">
                      <Image src={s.cover} alt={s.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm text-gray-500">{s.artist}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-gray-500">{formatTime(s.duration)}</div>
                      <button
                        onClick={() => {
                          const idx = songs.findIndex((x) => x._id === s._id)
                          if (idx !== -1) {
                            setCurrentIndex(idx)
                            setPlaying(true)
                            audioRef.current.play().catch(() => {})
                          }
                        }}
                        className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/40"
                      >
                        <FaPlay />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>

        {/* Right Sidebar (Queue / Now Playing) */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
            <div className="text-sm text-gray-500">Now Playing</div>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200">
                {current?.cover && (
                  <Image src={current.cover} alt={current.title} fill className="object-cover" />
                )}
              </div>
              <div>
                <div className="font-medium">{current?.title || '—'}</div>
                <div className="text-xs text-gray-500">{current?.artist}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">
              Plays: {current?.views ?? 0} • Likes: {current?.likes ?? 0}
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold">Up Next</h4>
              <div className="text-xs text-gray-500">{queue.length} songs</div>
            </div>
            <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
              {queue.map((q, idx) => (
                <div key={q._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-200">
                    <Image src={q.cover} alt={q.title} fill className="object-cover" />
                  </div>
                  <div className="flex-1 text-sm">
                    <div className="font-medium truncate">{q.title}</div>
                    <div className="text-xs text-gray-500 truncate">{q.artist}</div>
                  </div>
                  <div className="text-xs text-gray-500">{formatTime(q.duration)}</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

      </div>

      {/* Bottom sticky compact player (persistent) */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-3xl">
        <div className="backdrop-blur-lg bg-white/40 dark:bg-black/50 border rounded-3xl p-3 flex items-center gap-4">
          <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200">
            {current?.cover && <Image src={current.cover} alt={current.title} fill className="object-cover" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium text-sm">{current?.title || '—'}</div>
                <div className="text-xs text-gray-500">{current?.artist}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={togglePlay} className="p-2 rounded-full bg-white/20 dark:bg-gray-800/40">{playing ? <FaPause /> : <FaPlay />}</button>
                <button onClick={()=> setExpanded(true)} className="p-2 rounded-full bg-white/20 dark:bg-gray-800/40"><FaExpand /></button>
              </div>
            </div>
            <div className="mt-2">
              <div className="h-1 rounded-full bg-gray-200">
                <div style={{ width: `${(progress / (duration || 1)) * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
