'use client'
import React, { useEffect, useRef } from 'react'
import { FaExpand, FaPause, FaPlay } from 'react-icons/fa'
import Image from 'next/image'
import { motion } from 'framer-motion'

const SongPlayer = ({ playing, togglePlay, progress, duration, current, setExpanded, accentColor, setSeeking }) => {
  const progressPercent = (progress / (duration || 1)) * 100
  const coverRef = useRef(null)

  useEffect(() => {
    // stop rotation when not playing
    if (!coverRef.current) return
  }, [playing])

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-3xl">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.35 }}
        className="backdrop-blur-xl bg-white/20 dark:bg-black/40 border border-white/10 shadow-2xl rounded-2xl px-4 py-3 flex items-center gap-4"
        style={{ boxShadow: `0 8px 30px ${accentColor ? `${accentColor}30` : 'rgba(0,0,0,0.12)'}` }}
      >
        {/* Cover */}
        <div
          ref={coverRef}
          className={`w-14 h-14 relative rounded-xl overflow-hidden bg-gray-200 flex-shrink-0 transition-transform`}
          style={{
            transform: playing ? 'rotate(0deg)' : 'rotate(0deg)',
            // Use CSS animation (we toggle via a class)
            animation: playing ? 'spin 12s linear infinite' : 'none'
          }}
        >
          {current?.cover ? (
            <Image src={current.cover} alt={current.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Cover</div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="truncate pr-4">
              <div className="font-medium text-sm truncate">{current?.title || '—'}</div>
              <div className="text-xs text-gray-500 truncate">{current?.artist || '—'}</div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow"
                aria-label={playing ? 'Pause' : 'Play'}
              >
                {playing ? <FaPause /> : <FaPlay />}
              </button>
              <button
                onClick={() => setExpanded(true)}
                className="p-2 rounded-full bg-white/10 dark:bg-gray-700/30 text-white"
                aria-label="Expand player"
              >
                <FaExpand />
              </button>
            </div>
          </div>

          {/* progress */}
          <div className="mt-2">
            <div
              className="h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 relative cursor-pointer"
              onMouseDown={(e) => {
                // indicate parent to start dragging seek
                setSeeking && setSeeking(true)
                // allow parent to handle exact seek (MusicPage has handler on whole bar)
              }}
              onMouseUp={() => setSeeking && setSeeking(false)}
              role="progressbar"
              aria-valuenow={Math.floor(progressPercent)}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: `linear-gradient(90deg, rgba(99,102,241,1), rgba(236,72,153,1))`,
                  boxShadow: `0 4px 20px ${accentColor ? `${accentColor}33` : 'rgba(99,102,241,0.15)'}`
                }}
              />
              {/* knob */}
              <div
                className="absolute -top-1.5 w-3 h-3 rounded-full shadow-lg"
                style={{
                  left: `calc(${progressPercent}% - 6px)`,
                  background: accentColor || '#6366f1'
                }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{Math.floor(progress / 60)}:{String(Math.floor(progress % 60)).padStart(2,'0')}</span>
              <span>{Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2,'0')}</span>
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default SongPlayer
