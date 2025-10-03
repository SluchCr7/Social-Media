'use client'

import React, { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaPlay, FaPause, FaStepBackward, FaStepForward, FaRandom, FaRedo, FaHeart, FaShareAlt, FaVolumeUp, FaSearch, FaExpand } from 'react-icons/fa'
import Image from 'next/image' // optional, replace with <img> if not using Next.js

// ----------------------
// Helper / Demo Data
// ----------------------
const demoSongs = [
  {
    _id: '1',
    title: 'Sunset Boulevard',
    artist: 'A. Rising',
    album: 'Golden Hours',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1200&q=80', // placeholder
    url: '/song1.mp3', // replace with actual URL or cloud link
    duration: 225,
    lyrics: `Verse 1\nLa la la...\nChorus\nOh oh oh...`,
    likes: 124,
    views: 4032,
  },
  {
    _id: '2',
    title: 'Night Drive',
    artist: 'The Wanderers',
    album: 'City Light',
    cover: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&q=80',
    url: '/song2.mp3',
    duration: 196,
    lyrics: `Intro\nDrive with me...\nChorus\nNight drive...`,
    likes: 98,
    views: 2810,
  },
  {
    _id: '3',
    title: 'Cloud Nine',
    artist: 'Sora',
    album: 'Heights',
    cover: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1200&q=80',
    url: '/song2.mp3',
    duration: 254,
    lyrics: null,
    likes: 210,
    views: 11221,
  },
]

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
  // playlist & fetching
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // try fetch from API, fallback to demoSongs
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch('/api/music')
        if (!res.ok) throw new Error('no api')
        const data = await res.json()
        if (!cancelled) {
          setSongs(data)
        }
      } catch (err) {
        // fallback
        if (!cancelled) setSongs(demoSongs)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => (cancelled = true)
  }, [])

  // player state
  const audioRef = useRef(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const current = songs[currentIndex] || null
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0) // seconds
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off') // 'off' | 'one' | 'all'
  const [likedIds, setLikedIds] = useState(new Set())
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)

  // derived filtered list
  const filtered = useMemo(() => {
    if (!search) return songs
    const q = search.toLowerCase()
    return songs.filter(s => s.title.toLowerCase().includes(q) || s.artist.toLowerCase().includes(q) || s.album.toLowerCase().includes(q))
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
  }, [currentIndex, current?.url])

  // audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.currentTime)
    const onLoaded = () => {
      setDuration(audio.duration || current?.duration || 0)
      if (playing) audio.play().catch(()=>setPlaying(false))
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
    setCurrentIndex((i) => {
      const prev = (i - 1 + songs.length) % songs.length
      return prev
    })
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

  // like toggle (local; you can call API)
  const toggleLike = (id) => {
    setLikedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // start first song if available
  useEffect(() => {
    if (!songs.length) return
    // ensure currentIndex in range
    setCurrentIndex((i) => Math.min(i, songs.length - 1))
  }, [songs.length])

  // set dynamic accent from cover -> CSS variable
  const accentStyle = useMemo(() => {
    return {
      // Use CSS fallback gradient; for advanced accent extraction you'd analyze image colors
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
                {current?.cover ? (
                  // Next/Image shown for Next projects; if not using Next, swap to <img>
                  <Image src={current.cover} alt={current.title} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-200" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-4 justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Now Playing</div>
                    <h2 className="text-2xl font-semibold">{current?.title || 'Select a song'}</h2>
                    <div className="text-sm text-gray-500 mt-1">{current?.artist} • {current?.album}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => toggleLike(current?._id)} className={`p-3 rounded-lg ${current && likedIds.has(current._id) ? 'bg-red-600 text-white' : 'bg-white/30 dark:bg-gray-800/40'}`}>
                      <FaHeart />
                    </button>
                    <button className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40">
                      <FaShareAlt />
                    </button>
                    <button onClick={() => setExpanded(true)} className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40">
                      <FaExpand />
                    </button>
                  </div>
                </div>

                {/* Player controls */}
                <div className="mt-6">
                  <div className="flex items-center gap-4 justify-center md:justify-start">
                    <button onClick={() => setShuffle(s => !s)} className={`p-3 rounded-full ${shuffle ? 'bg-blue-600 text-white' : 'bg-white/20 dark:bg-gray-800/40'}`} title="Shuffle">
                      <FaRandom />
                    </button>
                    <button onClick={handlePrev} className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40">
                      <FaStepBackward />
                    </button>
                    <button onClick={togglePlay} className="p-4 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-2xl shadow-lg">
                      {playing ? <FaPause /> : <FaPlay />}
                    </button>
                    <button onClick={handleNext} className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40">
                      <FaStepForward />
                    </button>
                    <button onClick={() => setRepeatMode(m => m === 'off' ? 'all' : m === 'all' ? 'one' : 'off')} className={`p-3 rounded-full ${repeatMode !== 'off' ? 'bg-blue-600 text-white' : 'bg-white/20 dark:bg-gray-800/40'}`} title="Repeat">
                      <FaRedo />
                    </button>
                  </div>

                  {/* progress */}
                  <div className="mt-4">
                    <div className="flex items-center gap-4">
                      <div className="text-xs w-12 text-right">{formatTime(progress)}</div>
                      <div className="flex-1" onClick={handleSeek} style={{ cursor: 'pointer' }}>
                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 w-full relative">
                          <div style={{ width: `${(progress / (duration || 1)) * 100}%` }} className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all" />
                        </div>
                      </div>
                      <div className="text-xs w-12">{formatTime(duration)}</div>
                    </div>
                    {/* transparent overlay to allow touch seeking */}
                    <div className="mt-2 flex items-center gap-3 justify-end">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FaVolumeUp />
                        <input type="range" min={0} max={1} step={0.01} value={muted ? 0 : volume} onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lyrics & Comments */}
          <div className="rounded-2xl p-6 bg-white/60 dark:bg-gray-900/60 border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-4">
                <h3 className="font-semibold">Lyrics</h3>
                <div className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                  {current?.lyrics || 'No lyrics available for this track.'}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Comments</h3>
                <div className="text-sm text-gray-500">Comments are displayed here (placeholder). You can integrate with your posts/comments system to attach comments to a track.</div>
                <button className="px-3 py-2 rounded-lg bg-blue-600 text-white">Open Comments</button>
              </div>
            </div>
          </div>

          {/* Playlist (mobile-friendly list) */}
          <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
            <h3 className="text-lg font-semibold mb-3">Playlist</h3>
            {loading ? (
              <div className="text-sm text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-2">
                {filtered.map((s, i) => (
                  <div key={s._id} className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition ${current?._id === s._id ? 'ring-2 ring-blue-400 bg-white/30' : ''}`}>
                    <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200">
                      <Image src={s.cover} alt={s.title} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{s.title}</div>
                      <div className="text-sm text-gray-500">{s.artist}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-gray-500">{formatTime(s.duration)}</div>
                      <button onClick={() => { const idx = songs.findIndex(x => x._id === s._id); if (idx !== -1) { setCurrentIndex(idx); setPlaying(true); audioRef.current.play().catch(()=>{}); } }} className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/40">
                        <FaPlay />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Right column: sidebar */}
        <aside className="space-y-6">
          <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
            <div className="text-sm text-gray-500">Now Playing</div>
            <div className="flex items-center gap-3 mt-3">
              <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200">
                {current?.cover && <Image src={current.cover} alt={current.title} fill className="object-cover" />}
              </div>
              <div>
                <div className="font-medium">{current?.title || '—'}</div>
                <div className="text-xs text-gray-500">{current?.artist}</div>
              </div>
            </div>
            <div className="mt-3 text-xs text-gray-500">Plays: {current?.views ?? 0} • Likes: {current?.likes ?? 0}</div>
          </div>

          <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
            <div className="font-semibold mb-2">Filters</div>
            <div className="flex flex-col gap-2">
              <button className="px-3 py-2 rounded-lg bg-white/20 dark:bg-gray-800/40 text-left">Trending</button>
              <button className="px-3 py-2 rounded-lg bg-white/20 dark:bg-gray-800/40 text-left">Recent</button>
              <button className="px-3 py-2 rounded-lg bg-white/20 dark:bg-gray-800/40 text-left">Most Liked</button>
            </div>
          </div>

          <div className="rounded-2xl p-4 bg-white/50 dark:bg-gray-900/50 border">
            <div className="font-semibold">Suggested</div>
            <div className="mt-3 space-y-2">
              {songs.slice(0,3).map(s => (
                <div key={s._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 relative rounded-md overflow-hidden bg-gray-200">
                    <Image src={s.cover} alt={s.title} fill className="object-cover" />
                  </div>
                  <div className="text-sm">
                    <div className="font-medium">{s.title}</div>
                    <div className="text-xs text-gray-500">{s.artist}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* Footer mini player (sticky bottom) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-4xl md:hidden">
        <div className="backdrop-blur bg-white/70 dark:bg-gray-900/60 border rounded-2xl p-3 flex items-center gap-3">
          <div className="w-12 h-12 relative rounded-md overflow-hidden">
            {current?.cover && <Image src={current.cover} alt={current.title} fill className="object-cover" />}
          </div>
          <div className="flex-1">
            <div className="font-medium">{current?.title}</div>
            <div className="text-xs text-gray-500">{current?.artist}</div>
          </div>
          <button onClick={togglePlay} className="p-3 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
            {playing ? <FaPause /> : <FaPlay />}
          </button>
        </div>
      </div>

      {/* Expanded full player modal */}
      <AnimatePresence>
        {expanded && current && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-60 flex items-center justify-center p-6">
            <div onClick={() => setExpanded(false)} className="absolute inset-0 bg-black/50" />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative z-10 bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full p-6 border">
              <div className="flex gap-6">
                <div className="w-72 h-72 relative rounded-lg overflow-hidden">
                  <Image src={current.cover} alt={current.title} fill className="object-cover" />
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{current.title}</h2>
                  <div className="text-sm text-gray-500">{current.artist} • {current.album}</div>
                  <div className="mt-6">
                    <div className="text-sm text-gray-500 mb-2">About</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Detailed description about the track, credits, links to artist or album, and any other metadata. You can integrate comments and social interactions here.</p>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button onClick={togglePlay} className="px-4 py-2 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                      {playing ? 'Pause' : 'Play'}
                    </button>
                    <button onClick={() => toggleLike(current._id)} className={`px-4 py-2 rounded-lg ${likedIds.has(current._id) ? 'bg-red-600 text-white' : 'bg-white/20 dark:bg-gray-800/40'}`}>
                      <FaHeart className="inline-block mr-2" /> Like
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-white/20 dark:bg-gray-800/40"><FaShareAlt className="inline-block mr-2" />Share</button>
                  </div>
                </div>
              </div>
              <button onClick={() => setExpanded(false)} className="absolute top-4 right-4 text-gray-500">Close</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
