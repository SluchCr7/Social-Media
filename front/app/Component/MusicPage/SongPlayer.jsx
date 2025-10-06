'use client'
import React from 'react'
import { FaExpand, FaPause, FaPlay, FaHeart, FaShareAlt } from 'react-icons/fa'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'
import { useMusic } from '@/app/Context/MusicContext'

const SongPlayer = () => {
  const {
    current,
    playing,
    togglePlay,
    progress,
    duration,
    next,
    prev,
    shuffle,
    setShuffle,
    repeatMode,
    setRepeatMode,
    setExpanded
  } = useMusicPlayer()
  const { likeMusic } = useMusic()

  const progressPercent = (progress / (duration || 1)) * 100

  return (
    <div className="fixed bottom-5 left-1/2 transform -translate-x-1/2 z-50 w-11/12 max-w-3xl">
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-white/30 dark:bg-gray-900/40 border border-white/10 shadow-xl 
                   rounded-2xl px-4 py-3 flex items-center gap-4 transition-all"
      >
        {/* Cover */}
        <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-800 flex-shrink-0">
          {current?.cover ? (
            <Image src={current.cover} alt={current.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
              No Cover
            </div>
          )}
        </div>

        {/* Info + Controls */}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            {/* Song Info */}
            <div>
              <h4 className="font-semibold text-sm sm:text-base truncate">{current?.title || 'Unknown Title'}</h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">{current?.artist || 'Unknown Artist'}</p>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => current?._id && likeMusic(current._id)}
                className={`p-3 rounded-lg ${
                  current?.likes?.includes(user._id) ? 'bg-red-500 text-white' : 'bg-white/30 dark:bg-gray-800/40'
                }`}
                title="Like"
              >
                <FaHeart />
              </button>
              <button
                className="p-2 rounded-full bg-white/20 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 
                           hover:bg-white/30 transition-all"
                title="Share"
              >
                <FaShareAlt />
              </button>
              <button
                onClick={togglePlay}
                className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md 
                           hover:scale-110 transition-transform"
              >
                {playing ? <FaPause /> : <FaPlay />}
              </button>
              <button
                onClick={() => setExpanded(true)}
                className="p-3 rounded-full bg-white/20 dark:bg-gray-700/40 text-gray-700 dark:text-gray-300 
                           hover:bg-white/30 transition-all"
              >
                <FaExpand />
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-3 relative group">
            <div className="h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                style={{ width: `${progressPercent}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>
            <motion.div
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-500 shadow-md opacity-0 group-hover:opacity-100"
              style={{ left: `calc(${progressPercent}% - 6px)` }}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SongPlayer
