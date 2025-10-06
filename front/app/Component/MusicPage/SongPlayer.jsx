'use client'
import React from 'react'
import { FaExpand, FaPause, FaPlay, FaHeart, FaShareAlt } from 'react-icons/fa'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'
import { useMusic } from '@/app/Context/MusicContext'
import { useAuth } from '@/app/Context/AuthContext'

const SongPlayer = () => {
  const {
    current,
    playing,
    togglePlay,
    progress,
    duration,
    setExpanded
  } = useMusicPlayer()

  const { likeMusic } = useMusic()
  const { user } = useAuth()

  const progressPercent = (progress / (duration || 1)) * 100

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full px-2 sm:px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="backdrop-blur-xl bg-white/30 dark:bg-gray-900/40 border border-white/10 
                   shadow-lg sm:shadow-xl rounded-t-2xl px-3 py-2 sm:px-4 sm:py-3 
                   flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4"
      >
        {/* Left: Cover + Info */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden relative bg-gray-200 dark:bg-gray-800">
            {current?.cover ? (
              <Image src={current.cover} alt={current.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Cover
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h4 className="font-semibold text-sm sm:text-base truncate">
              {current?.title || 'Unknown Title'}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
              {current?.artist || 'Unknown Artist'}
            </p>
          </div>
        </div>

        {/* Center: Controls */}
        <div className="hidden sm:flex items-center gap-2 ml-auto">
          <button
            onClick={() => current?._id && likeMusic(current._id)}
            className={`p-2 sm:p-3 rounded-lg transition-all ${
              current?.likes?.includes(user?._id)
                ? 'bg-red-500 text-white'
                : 'bg-white/30 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300'
            }`}
            title="Like"
          >
            <FaHeart />
          </button>

          <button
            className="p-2 sm:p-3 rounded-lg bg-white/30 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 hover:bg-white/40 transition-all"
            title="Share"
          >
            <FaShareAlt />
          </button>

          <button
            onClick={togglePlay}
            className="p-3 sm:p-4 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-md 
                       hover:scale-110 transition-transform"
            title="Play / Pause"
          >
            {playing ? <FaPause /> : <FaPlay />}
          </button>

          <button
            onClick={() => setExpanded(true)}
            className="p-2 sm:p-3 rounded-lg bg-white/30 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300 hover:bg-white/40 transition-all"
            title="Expand"
          >
            <FaExpand />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full mt-2 sm:mt-0">
          <div className="h-1.5 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
              style={{ width: `${progressPercent}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
          </div>
        </div>

        {/* Mobile Controls */}
        <div className="flex sm:hidden justify-center items-center gap-3 mt-2">
          <button
            onClick={() => current?._id && likeMusic(current._id)}
            className={`p-2 rounded-lg ${
              current?.likes?.includes(user?._id)
                ? 'bg-red-500 text-white'
                : 'bg-white/30 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300'
            }`}
          >
            <FaHeart className="text-base" />
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
            className="p-2 rounded-lg bg-white/30 dark:bg-gray-800/40 text-gray-700 dark:text-gray-300"
          >
            <FaExpand className="text-base" />
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default SongPlayer
