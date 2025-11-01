'use client'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React, { useCallback, useMemo } from 'react'
import { 
  FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo, FaTimes, FaHeart, FaShareAlt 
} from 'react-icons/fa'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'
import { useMusic } from '@/app/Context/MusicContext'
import { formatTime } from '@/app/utils/formatTime'
import { useAuth } from '@/app/Context/AuthContext'
import { useTranslation } from 'react-i18next'

const ExpandedWindow = () => {
  const {t} = useTranslation()
  const { 
    current, playing, togglePlay, progress, duration, next, prev, 
    shuffle, setShuffle, repeatMode, setRepeatMode, expanded, setExpanded,isReady 
  } = useMusicPlayer()

  const { likeMusic } = useMusic()
  const { user } = useAuth()
  const progressPercent = useMemo(()=>(progress / (duration || 1)) * 100, [progress, duration])
  
  const handleClose = useCallback(() => setExpanded(false), [setExpanded])
  const handleTogglePlay = useCallback(() => {
    if (!isReady) return
    togglePlay()
  }, [isReady, togglePlay])

  const handleLike = useCallback(() => {
    if (current?._id) likeMusic(current._id)
  }, [current?._id, likeMusic])

  const handleRepeat = useCallback(() => {
    setRepeatMode(repeatMode === 'off' ? 'all' : repeatMode === 'all' ? 'one' : 'off')
  }, [repeatMode, setRepeatMode])

  if (!current) return null

  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-xl 
                     flex items-center justify-center sm:p-6 p-0"
        >
          <motion.div
            initial={{ scale: 0.97, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.97, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full h-full sm:h-auto sm:max-w-3xl 
                       bg-gradient-to-b from-white/15 to-black/40 dark:from-gray-900/60 dark:to-black/70 
                       rounded-none sm:rounded-3xl shadow-2xl border border-white/10 
                       flex flex-col items-center p-5 sm:p-8 overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 sm:p-3 bg-white/20 hover:bg-white/30 
                         text-white rounded-full transition-all z-20"
            >
              <FaTimes size={18} />
            </button>

            {/* Cover Section */}
            <div className="flex-1 flex items-center justify-center w-full mt-10 sm:mt-0">
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-2xl">
                {current?.cover ? (
                  <Image
                    src={current.cover}
                    alt={current.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-500">
                    {t("No Cover")}
                  </div>
                )}
              </div>
            </div>

            {/* Song Info */}
            <div className="text-center mt-6 sm:mt-8 px-3">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-semibold text-white truncate">
                {current?.title}
              </h2>
              <p className="text-sm sm:text-base text-gray-300 mt-1 truncate">
                {current?.artist} • {current?.album || '—'}
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full mt-6 sm:mt-8 px-4 sm:px-8">
              <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="relative h-1.5 sm:h-2 bg-gray-700 rounded-full overflow-hidden group">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 rounded-full bg-blue-400 
                             shadow-md opacity-0 group-hover:opacity-100"
                  style={{ left: `calc(${progressPercent}% - 6px)` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 mt-8 sm:mt-10 pb-6">
              <button 
                onClick={() => setShuffle(!shuffle)}
                className={`p-2.5 sm:p-3 rounded-full ${
                  shuffle ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
                title="Shuffle"
              >
                <FaRandom size={18} className="sm:text-lg" />
              </button>

              <button onClick={prev} className="p-2.5 sm:p-3 text-gray-300 hover:text-white transition">
                <FaStepBackward size={18} className="sm:text-xl" />
              </button>

              <button
                onClick={handleTogglePlay}
                className="p-4 sm:p-5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 
                          text-white shadow-lg hover:scale-110 transition-transform"
              >
                {playing ? <FaPause size={22} /> : <FaPlay size={22} />}
              </button>


              <button onClick={next} className="p-2.5 sm:p-3 text-gray-300 hover:text-white transition">
                <FaStepForward size={18} className="sm:text-xl" />
              </button>

              <button
                onClick={handleRepeat}
                className={`p-2.5 sm:p-3 rounded-full ${
                  repeatMode !== 'off' ? 'bg-blue-600 text-white' : 'text-gray-300 hover:text-white'
                }`}
                title="Repeat"
              >
                <FaRedo size={18} />
              </button>

              <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-0">
                <button
                  onClick={handleLike}
                  className={`p-2.5 sm:p-3 rounded-full transition-all ${
                    current?.likes?.includes(user?._id)
                      ? 'bg-red-500 text-white'
                      : 'bg-white/20 text-gray-300 hover:bg-white/30'
                  }`}
                  title="Like"
                >
                  <FaHeart />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExpandedWindow
