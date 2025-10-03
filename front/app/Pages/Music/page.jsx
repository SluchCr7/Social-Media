'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPlay, FaPause, FaStepBackward, FaStepForward,
  FaRandom, FaRedo, FaHeart, FaShareAlt,
  FaVolumeUp, FaSearch, FaExpand
} from 'react-icons/fa'
import Image from 'next/image'
import { useMusic } from '@/app/Context/MusicContext'

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

  // ----------------------
  // Render
  // ----------------------
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100">
      <audio ref={audioRef} preload="metadata" />

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/60 dark:bg-black/40 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
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
            <button className="px-3 py-1 rounded-md border">Upload</button>
            <div className="hidden md:block text-sm text-gray-500">@username</div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Featured */}
        <section className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl p-6" style={accentStyle}>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative w-40 h-40 rounded-xl shadow-lg overflow-hidden bg-gray-200">
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
                            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all"
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
        </section>

        {/* Sidebar */}
        <aside className="space-y-6">
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
        </aside>
      </main>
    </div>
  )
}
