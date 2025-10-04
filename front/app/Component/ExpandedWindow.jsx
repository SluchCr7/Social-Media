'use client'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo, FaTimes, FaHeart } from 'react-icons/fa'

const ExpandedWindow = ({
  current,
  expanded,
  setExpanded,
  progress,
  duration,
  formatTime,
  playing,
  togglePlay,
  toggleLike,
  liked,
  accentColor,
  setAccentColor,
  lyrics // optional: current.lyrics or passed prop
}) => {
  const [localScroll, setLocalScroll] = useState(0)
  const lyricsRef = useRef(null)

  // Scroll lyrics automatically if they include timestamps array
  useEffect(() => {
    if (!lyricsRef.current) return
    // if lyrics is an array of {time, text} we can sync, else we leave it scrollable
    if (!Array.isArray(lyrics)) return
    // find current index
    const idx = lyrics.findIndex((l) => l.time > progress) - 1
    const clamped = Math.max(0, idx)
    const el = lyricsRef.current.children[clamped]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [progress, lyrics])

  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-4xl bg-white/10 dark:bg-gray-900/80 rounded-3xl p-6 shadow-2xl border border-white/10"
            style={{ outline: `1px solid ${accentColor ? `${accentColor}33` : 'transparent'}` }}
          >
            <button
              onClick={() => setExpanded(false)}
              className="absolute right-4 top-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {/* Cover */}
              <div className="w-full flex items-center justify-center">
                <div className="relative w-64 h-64 rounded-2xl overflow-hidden shadow-2xl">
                  {current?.cover ? (
                    <Image src={current.cover} alt={current.title} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-500">No Cover</div>
                  )}
                </div>
              </div>

              {/* Details + Controls */}
              <div className="md:col-span-2">
                <h3 className="text-2xl font-semibold text-white">{current?.title || 'Unknown Title'}</h3>
                <p className="text-sm text-gray-300 mt-1">{current?.artist} • {current?.album || '—'}</p>

                {/* Controls */}
                <div className="mt-5 flex items-center gap-4">
                  <button className="p-3 text-gray-300 hover:text-white" title="Shuffle"><FaRandom /></button>
                  <button onClick={() => {
                    // parent handles prev
                    const ev = new CustomEvent('player-prev'); window.dispatchEvent(ev)
                  }} className="p-3 text-gray-300 hover:text-white"><FaStepBackward /></button>

                  <button
                    onClick={togglePlay}
                    className="p-4 rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${accentColor || '#6366f1'}, ${accentColor ? darkenHex(accentColor, -30) : '#ec4899'})`,
                      color: '#fff',
                      boxShadow: `0 10px 30px ${accentColor ? `${accentColor}44` : 'rgba(0,0,0,0.2)'}`
                    }}
                  >
                    {playing ? <FaPause /> : <FaPlay />}
                  </button>

                  <button onClick={() => {
                    const ev = new CustomEvent('player-next'); window.dispatchEvent(ev)
                  }} className="p-3 text-gray-300 hover:text-white"><FaStepForward /></button>

                  <button className={`p-3 rounded-md ${liked ? 'bg-red-600 text-white scale-105' : 'text-gray-300'}`} onClick={() => toggleLike && toggleLike(current?._id)}>
                    <FaHeart />
                  </button>
                </div>

                {/* progress + times */}
                <div className="mt-6">
                  <div className="flex items-center justify-between text-sm text-gray-300">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-gray-700 overflow-hidden">
                    <div style={{ width: `${(progress / (duration || 1)) * 100}%` }} className="h-full rounded-full" />
                  </div>
                </div>

                {/* Lyrics + extra */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-3 max-h-44 overflow-auto text-sm text-gray-200" ref={lyricsRef}>
                    <div className="font-semibold mb-2">Lyrics</div>
                    {Array.isArray(lyrics) ? (
                      lyrics.map((l, idx) => (
                        <div key={idx} className={`py-1 ${progress >= (l.time || 0) ? 'text-white' : 'text-gray-300'}`}>
                          {l.text}
                        </div>
                      ))
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm text-gray-300">{lyrics || 'Lyrics not available'}</pre>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-gray-300">Album</div>
                      <div className="font-medium">{current?.album || '—'}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-gray-300">Released</div>
                      <div className="font-medium">{current?.year || '—'}</div>
                    </div>
                    <div className="bg-white/5 rounded-lg p-3">
                      <div className="text-xs text-gray-300">Genre</div>
                      <div className="font-medium">{current?.genre || '—'}</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// helper to slightly darken a hex color (accepts #RRGGBB or rgb)
function darkenHex(hex, amt = -20) {
  try {
    if (!hex) return '#6366f1'
    // strip alpha if present
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

export default ExpandedWindow
