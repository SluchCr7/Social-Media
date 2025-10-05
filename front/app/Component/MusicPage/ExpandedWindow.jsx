'use client'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaRandom, FaRedo, FaTimes } from 'react-icons/fa'

const ExpandedWindow = ({
  current,
  expanded,
  setExpanded,
  progress,
  duration,
  formatTime,
  playing,
  togglePlay
}) => {
  const progressPercent = (progress / (duration || 1)) * 100

  return (
    <AnimatePresence>
      {expanded && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed inset-0 z-[1000] bg-black/70 backdrop-blur-md flex items-center justify-center px-4 py-8"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-3xl bg-white/10 dark:bg-gray-900/70 
                       rounded-3xl shadow-2xl border border-white/20 p-6 flex flex-col items-center"
          >
            {/* Close Button */}
            <button
              onClick={() => setExpanded(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 text-white rounded-full transition-all"
            >
              <FaTimes size={18} />
            </button>

            {/* Cover */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden shadow-xl">
              {current?.cover ? (
                <Image src={current.cover} alt={current.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 dark:bg-gray-700 text-gray-500">
                  No Cover
                </div>
              )}
            </div>

            {/* Song Info */}
            <div className="text-center mt-6">
              <h2 className="text-2xl font-semibold text-white">{current?.title || 'Unknown Title'}</h2>
              <p className="text-gray-300 mt-1">{current?.artist || 'Unknown Artist'} • {current?.album || '—'}</p>
            </div>

            {/* Progress Bar */}
            <div className="w-full mt-8">
              <div className="flex justify-between text-sm text-gray-400 mb-1">
                <span>{formatTime(progress)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden group">
                <motion.div
                  className="h-full bg-gradient-to-r from-indigo-500 to-blue-500"
                  style={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.3 }}
                />
                <motion.div
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-blue-400 
                             shadow-md opacity-0 group-hover:opacity-100"
                  style={{ left: `calc(${progressPercent}% - 6px)` }}
                />
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-6 mt-8">
              <button className="p-3 text-gray-300 hover:text-white transition"><FaRandom /></button>
              <button className="p-3 text-gray-300 hover:text-white transition"><FaStepBackward size={20} /></button>
              <button
                onClick={togglePlay}
                className="p-5 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg hover:scale-110 transition-transform"
              >
                {playing ? <FaPause size={22} /> : <FaPlay size={22} />}
              </button>
              <button className="p-3 text-gray-300 hover:text-white transition"><FaStepForward size={20} /></button>
              <button className="p-3 text-gray-300 hover:text-white transition"><FaRedo /></button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExpandedWindow
