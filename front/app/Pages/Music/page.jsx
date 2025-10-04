'use client'

import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FaPlay, FaPause, FaStepBackward, FaStepForward,
  FaRandom, FaRedo, FaHeart, FaShareAlt,
  FaVolumeUp, FaSearch, FaExpand, FaHome, FaMusic, FaUpload, FaCog, FaListUl
} from 'react-icons/fa'
import Image from 'next/image'
import { useMusic } from '../../Context/MusicContext'
import AddMusicModal from '@/app/Component/AddMusicMenu'
import { useAuth } from '@/app/Context/AuthContext'
import SongPlayer from '@/app/Component/SongPlayer'
import ExpandedWindow from '@/app/Component/ExpandedWindow'

// Utility
const formatTime = (s = 0) => {
  if (!s || isNaN(s)) return '0:00'
  const mm = Math.floor(s / 60)
  const ss = Math.floor(s % 60).toString().padStart(2, '0')
  return `${mm}:${ss}`
}

export default function MusicPage() {
  const { music: songs, isLoading, likeMusic, viewMusic ,currentMusic:setCtxCurrent } = useMusic()
  const { user } = useAuth()

  const audioRef = useRef(null)
  const progressBarRef = useRef(null)
  const seekDraggingRef = useRef(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const current = songs[currentIndex] || null
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.9)
  const [muted, setMuted] = useState(false)
  const [shuffle, setShuffle] = useState(false)
  const [repeatMode, setRepeatMode] = useState('off')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [openModel , setOpenModel] = useState(false)
  const [showLeftNav, setShowLeftNav] = useState(false)
  const [accentColor, setAccentColor] = useState('#6366f1')
  const [likedIds, setLikedIds] = useState(new Set())
  const [showVol, setShowVol] = useState(false)
  const [seeking, setSeeking] = useState(false)
  const [lyricsCache, setLyricsCache] = useState(null)

  // derived filtered list
  const filtered = useMemo(() => {
    if (!search) return songs
    const q = search.toLowerCase()
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q) ||
        (s.album && s.album.toLowerCase().includes(q))
    )
  }, [songs, search])

  // set current in context if function provided
  useEffect(() => {
    if (setCtxCurrent) setCtxCurrent(current)
  }, [current, setCtxCurrent])

  // extract accent color from cover using canvas (client-only)
  useEffect(() => {
    if (!current?.cover) return
    // load image and sample
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = current.cover
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const w = Math.min(50, img.width)
        const h = Math.min(50, img.height)
        canvas.width = w
        canvas.height = h
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, w, h)
        const data = ctx.getImageData(0, 0, w, h).data
        let r=0,g=0,b=0,count=0
        for (let i=0;i<data.length;i+=4) {
          const alpha = data[i+3]
          if (alpha < 125) continue
          r += data[i]; g += data[i+1]; b += data[i+2]; count++
        }
        if (count === 0) return
        r = Math.round(r/count); g = Math.round(g/count); b = Math.round(b/count)
        const hex = `#${((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1)}`
        setAccentColor(hex)
      } catch (e) {
        // fallback
        setAccentColor('#6366f1')
      }
    }
    img.onerror = () => setAccentColor('#6366f1')
  }, [current?.cover])

  // sync audio element when current changes
  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !current) return
    audio.src = current.url
    audio.load()
    setProgress(0)
    setDuration(current.duration || 0)
    // try autoplay if was playing
    if (playing) {
      audio.play().catch(() => setPlaying(false))
    }
    // increment view
    if (current?._id) viewMusic && viewMusic(current._id)
    // load lyrics placeholder (if your API supports it)
    // here we assume current.lyrics could be a string or array; keep cache
    setLyricsCache(current.lyrics || null)
  }, [currentIndex, current?.url])

  // audio events
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.currentTime)
    const onLoaded = () => {
      setDuration(audio.duration || current?.duration || 0)
      if (playing) {
        audio.play().catch(() => setPlaying(false))
      }
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

  // volume sync
  useEffect(() => {
    if (!audioRef.current) return
    audioRef.current.volume = muted ? 0 : volume
  }, [volume, muted])

  // initial index adjustment
  useEffect(() => {
    if (!songs.length) return
    setCurrentIndex((i) => Math.min(i, songs.length - 1))
  }, [songs.length])

  // keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if (e.target && ['INPUT','TEXTAREA'].includes(e.target.tagName)) return
      if (e.code === 'Space') {
        e.preventDefault(); togglePlay()
      } else if (e.key === 'ArrowRight') handleNext()
      else if (e.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // play/pause
  const togglePlay = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause(); setPlaying(false)
    } else {
      try { await audio.play(); setPlaying(true) } catch (e) { setPlaying(false) }
    }
  }

  const handlePrev = () => {
    if (!songs.length) return
    if (audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0; return
    }
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random()*songs.length)); return
    }
    setCurrentIndex(i => (i - 1 + songs.length) % songs.length)
  }

  const handleNext = () => {
    if (!songs.length) return
    if (shuffle) {
      setCurrentIndex(Math.floor(Math.random()*songs.length)); return
    }
    setCurrentIndex(i => {
      const next = i + 1
      if (next >= songs.length) {
        if (repeatMode === 'all') return 0
        setPlaying(false); return i
      }
      return next
    })
  }

  // seek: handles click or drag
  const handleSeek = (clientX) => {
    const bar = progressBarRef.current
    if (!bar || !audioRef.current) return
    const rect = bar.getBoundingClientRect()
    const x = clientX - rect.left
    const pct = Math.max(0, Math.min(1, x / rect.width))
    const time = pct * (duration || current?.duration || 0)
    audioRef.current.currentTime = time
    setProgress(time)
  }

  // mouse handlers for progress bar
  useEffect(() => {
    const onMove = (e) => {
      if (!seekDraggingRef.current) return
      handleSeek(e.clientX || (e.touches && e.touches[0].clientX))
    }
    const onUp = () => { seekDraggingRef.current = false; setSeeking(false) }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('touchmove', onMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp)
    }
  }, [duration, current])

  // queue
  const queue = useMemo(() => {
    if (!songs.length) return []
    return songs.slice(currentIndex + 1).concat(songs.slice(0, currentIndex))
  }, [songs, currentIndex])

  // like handler (local animation + api call if present)
  const handleLike = async (id) => {
    setLikedIds(prev => {
      const copy = new Set(prev)
      if (copy.has(id)) copy.delete(id)
      else copy.add(id)
      return copy
    })
    try { await likeMusic && likeMusic(id) } catch (e) {}
  }

  // listen to dispatched prev/next events from ExpandedWindow controls
  useEffect(() => {
    const onPrev = () => handlePrev()
    const onNext = () => handleNext()
    window.addEventListener('player-prev', onPrev)
    window.addEventListener('player-next', onNext)
    return () => {
      window.removeEventListener('player-prev', onPrev)
      window.removeEventListener('player-next', onNext)
    }
  }, [songs, shuffle, repeatMode])

  // small helper to open & play a song
  const playSongAt = (idx) => {
    if (idx < 0 || idx >= songs.length) return
    setCurrentIndex(idx)
    setPlaying(true)
    setTimeout(()=> {
      audioRef.current && audioRef.current.play().catch(()=>{})
    }, 50)
  }

  // render
  return (
    <div className="min-h-screen w-full relative">
      <AddMusicModal isOpen={openModel} onClose={()=> setOpenModel(false)} />
      <SongPlayer
        playing={playing}
        togglePlay={togglePlay}
        progress={progress}
        duration={duration}
        current={current}
        setExpanded={setExpanded}
        accentColor={accentColor}
        setSeeking={setSeeking}
      />
      <ExpandedWindow
        current={current}
        expanded={expanded}
        setExpanded={setExpanded}
        progress={progress}
        duration={duration}
        formatTime={formatTime}
        playing={playing}
        togglePlay={togglePlay}
        toggleLike={handleLike}
        liked={likedIds.has(current?._id)}
        accentColor={accentColor}
        setAccentColor={setAccentColor}
        lyrics={lyricsCache}
      />

      <div className="min-h-screen w-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900 text-gray-900 dark:text-gray-100 relative overflow-x-hidden">
        <audio ref={audioRef} preload="metadata" />

        {/* Dynamic blurred hero background */}
        {current?.cover && (
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10"
            style={{
              backgroundImage: `url(${current.cover})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(70px) brightness(0.35)'
            }}
          />
        )}

        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-white/50 dark:bg-black/40 border-b border-gray-200 dark:border-gray-800">
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
          {/* Left Nav */}
          <aside className={`lg:col-span-2 transition-transform duration-300 ${showLeftNav ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} fixed lg:static inset-y-0 left-0 z-50 w-64 lg:w-auto bg-white/60 dark:bg-black/40 border-r border-gray-200 dark:border-gray-800 backdrop-blur-md p-4 lg:p-0`}>
            <div className="lg:block hidden lg:sticky lg:top-16 lg:h-[calc(100vh-64px)] lg:pt-6">
              <nav className="space-y-2">
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><FaHome /><span className="ml-2">Home</span></div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><FaMusic /><span className="ml-2">Discover</span></div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><FaHeart /><span className="ml-2">Liked</span></div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800" onClick={()=> setOpenModel(true)}><FaUpload /><span className="ml-2">Upload</span></div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><FaCog /><span className="ml-2">Settings</span></div>
              </nav>
            </div>
            <div className="lg:hidden mt-4">
              <button className="px-3 py-2 rounded-md border" onClick={()=> setShowLeftNav(false)}>Close</button>
            </div>
          </aside>

          {/* Main */}
          <main className="lg:col-span-7 space-y-6">
            <div className="rounded-2xl p-6 relative" style={{ background: `linear-gradient(180deg, ${accentColor}15, transparent)` }}>
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-48 h-48 md:w-40 md:h-40 rounded-xl shadow-2xl overflow-hidden bg-gray-200">
                  {current?.cover ? <Image src={current.cover} alt={current.title} fill className="object-cover" /> : null}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-4 justify-between">
                    <div>
                      <div className="text-sm text-gray-500">Now Playing</div>
                      <h2 className="text-2xl font-semibold">{current?.title || 'Select a song'}</h2>
                      <div className="text-sm text-gray-500 mt-1">{current?.artist} • {current?.album}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => current?._id && handleLike(current._id)} className={`p-3 rounded-lg ${likedIds.has(current?._id) ? 'bg-red-600 text-white scale-105' : 'bg-white/30 dark:bg-gray-800/40' } transition-transform`}>
                        <FaHeart />
                      </button>
                      <button className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40"><FaShareAlt /></button>
                      <button onClick={() => setExpanded(true)} className="p-3 rounded-lg bg-white/30 dark:bg-gray-800/40"><FaExpand /></button>
                    </div>
                  </div>

                  {/* Player controls */}
                  <div className="mt-6">
                    <div className="flex items-center gap-4 justify-center md:justify-start">
                      <button onClick={() => setShuffle(s => !s)} className={`p-3 rounded-full ${shuffle ? 'bg-blue-600 text-white' : 'bg-white/20 dark:bg-gray-800/40'}`} title="Shuffle"><FaRandom /></button>
                      <button onClick={handlePrev} className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40"><FaStepBackward /></button>
                      <button onClick={togglePlay} className="p-4 rounded-full" style={{ background: `linear-gradient(90deg, ${accentColor}, ${accentColor ? darkenHex(accentColor,-30) : '#ec4899'})`, color: '#fff', fontSize: '1.1rem' }}>{playing ? <FaPause /> : <FaPlay />}</button>
                      <button onClick={handleNext} className="p-3 rounded-full bg-white/30 dark:bg-gray-800/40"><FaStepForward /></button>
                      <button onClick={() => setRepeatMode(m => m === 'off' ? 'all' : m === 'all' ? 'one' : 'off')} className={`p-3 rounded-full ${repeatMode !== 'off' ? 'bg-blue-600 text-white' : 'bg-white/20 dark:bg-gray-800/40'}`} title="Repeat"><FaRedo /></button>
                    </div>

                    {/* progress */}
                    <div className="mt-4">
                      <div className="flex items-center gap-4">
                        <div className="text-xs w-12 text-right">{formatTime(progress)}</div>
                        <div
                          className="flex-1"
                          onMouseDown={(e) => { seekDraggingRef.current = true; setSeeking(true); handleSeek(e.clientX) }}
                          onTouchStart={(e) => { seekDraggingRef.current = true; setSeeking(true); handleSeek(e.touches[0].clientX) }}
                        >
                          <div ref={progressBarRef} className="h-2 rounded-full bg-gray-200 dark:bg-gray-700 w-full relative">
                            <div className="h-full rounded-full transition-all" style={{ width: `${(progress / (duration || 1)) * 100}%`, background: `linear-gradient(90deg, ${accentColor}, ${accentColor ? darkenHex(accentColor,-30) : '#ec4899'})`, boxShadow: `0 0 30px ${accentColor}33` }} />
                          </div>
                        </div>
                        <div className="text-xs w-12">{formatTime(duration)}</div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 justify-end">
                        <div className="relative">
                          <div className="flex items-center gap-2 text-sm text-gray-500" onMouseEnter={()=>setShowVol(true)} onMouseLeave={()=>setShowVol(false)}>
                            <FaVolumeUp />
                            <input
                              type="range"
                              min={0}
                              max={1}
                              step={0.01}
                              value={muted ? 0 : volume}
                              onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false) }}
                              className="w-24"
                            />
                          </div>

                          {/* Vertical slider popover for better control */}
                          {showVol && (
                            <div className="absolute right-0 -top-40 w-10 h-36 bg-white/5 rounded-lg p-2 flex items-center justify-center">
                              <input
                                type="range"
                                orient="vertical"
                                style={{ writingMode: 'bt-lr', transform: 'rotate(-90deg)', width: '120px' }}
                                min={0}
                                max={1}
                                step={0.01}
                                value={muted ? 0 : volume}
                                onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false) }}
                              />
                            </div>
                          )}
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
                    <div key={s._id} className={`flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition ${current?._id === s._id ? 'ring-2 ring-blue-400 bg-white/30' : ''}`}>
                      <div className="w-12 h-12 relative rounded-md overflow-hidden bg-gray-200">
                        <Image src={s.cover} alt={s.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{s.title}</div>
                        <div className="text-sm text-gray-500 truncate">{s.artist}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-xs text-gray-500">{formatTime(s.duration)}</div>
                        <button onClick={() => playSongAt(songs.findIndex(x => x._id === s._id))} className="p-2 rounded-lg bg-white/20 dark:bg-gray-800/40"><FaPlay /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="lg:col-span-3 space-y-6">
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
              <div className="mt-3 text-xs text-gray-500">Plays: {current?.views?.length ?? 0} • Likes: {current?.likes?.length ?? 0}</div>
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
                    <div className="flex-1 text-sm min-w-0">
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

      </div>
    </div>
  )
}

// helper to darken a hex color slightly
function darkenHex(hex, amt = -30) {
  try {
    if (!hex) return '#6366f1'
    const c = hex.replace('#','')
    const num = parseInt(c,16)
    let r = (num >> 16) + amt
    let g = ((num >> 8) & 0x00FF) + amt
    let b = (num & 0x0000FF) + amt
    r = Math.max(Math.min(255, r), 0)
    g = Math.max(Math.min(255, g), 0)
    b = Math.max(Math.min(255, b), 0)
    return `#${(r<<16 | g<<8 | b).toString(16).padStart(6,'0')}`
  } catch (e) {
    return hex
  }
}
