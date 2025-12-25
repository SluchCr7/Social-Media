'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  HiPlay,
  HiPause,
  HiChevronUp,
  HiForward,
  HiBackward,
  HiSpeakerWave,
  HiSpeakerXMark,
  HiArrowsRightLeft,
  HiArrowPath,
  HiQueueList,
  HiHeart
} from 'react-icons/hi2'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'
import { useMusic } from '@/app/Context/MusicContext'
import { useAuth } from '@/app/Context/AuthContext'
import { useTranslation } from 'react-i18next'
import ColorThief from 'colorthief'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const SongPlayer = React.memo(() => {
  const {
    current,
    playing,
    togglePlay,
    progress,
    duration,
    next,
    prev,
    setExpanded,
    volume,
    setVolume,
    toggleMute,
    isMuted,
    shuffle,
    toggleShuffle,
    loop,
    toggleLoop,
    seekTo
  } = useMusicPlayer()

  const { likeMusic } = useMusic()
  const { user } = useAuth()
  const { t } = useTranslation()

  const [bgColor, setBgColor] = useState('#6366f1')
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  useEffect(() => {
    if (!current?.cover) {
      setBgColor('#6366f1')
      return
    }

    if (typeof window !== 'undefined') {
      const img = new window.Image()
      img.crossOrigin = 'Anonymous'
      img.src = current.cover
      img.onload = () => {
        try {
          const colorThief = new ColorThief()
          const color = colorThief.getColor(img)
          setBgColor(`rgb(${color.join(',')})`)
        } catch {
          setBgColor('#6366f1')
        }
      }
    }
  }, [current])

  const progressPercent = useMemo(() => (progress / (duration || 1)) * 100, [progress, duration])

  const formatTime = useCallback((s) => {
    if (!s || isNaN(s)) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec < 10 ? '0' : ''}${sec}`
  }, [])

  const handleSeek = useCallback((value) => {
    seekTo((value / 100) * duration)
  }, [seekTo, duration])

  if (!current) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 120, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 120, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed bottom-0 left-0 right-0 z-[999] pb-safe"
      >
        <div className="relative mx-auto w-full max-w-7xl px-3 sm:px-6 pb-4 sm:pb-6">
          {/* 🔮 Neural Aura Glow */}
          <motion.div
            animate={{
              backgroundColor: bgColor,
              scale: playing ? [1, 1.08, 1] : 1,
              opacity: playing ? 0.4 : 0.2
            }}
            transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
            className="absolute -inset-6 blur-[80px] rounded-full pointer-events-none"
          />

          <div className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-white/80 dark:bg-[#0A0A0A]/95 backdrop-blur-3xl border border-gray-200 dark:border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] p-2 sm:p-3 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">

            {/* 🎵 Album Metadata Section */}
            <div className="flex items-center gap-4 flex-shrink-0 w-full md:w-auto p-1">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg group/art shrink-0"
              >
                <Image src={current.cover || '/song-placeholder.png'} alt={current.title} fill className="object-cover" />
                <div className={`absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover/art:opacity-100 transition-opacity cursor-pointer`} onClick={() => setExpanded(true)}>
                  <HiChevronUp className="text-white text-xl" />
                </div>
              </motion.div>

              <div className="flex flex-col min-w-0 flex-1">
                <motion.h4
                  key={current.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-gray-900 dark:text-white font-black text-sm sm:text-base leading-tight truncate"
                >
                  {current.title}
                </motion.h4>
                <p className="text-indigo-500 dark:text-indigo-400 text-[11px] font-bold uppercase tracking-wider truncate">
                  {current.artist}
                </p>
              </div>

              <div className="flex sm:hidden items-center gap-3 ml-auto">
                <button onClick={prev} className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors"><HiBackward className="w-5 h-5" /></button>
                <button onClick={togglePlay} className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/40 active:scale-95 transition-transform">
                  {playing ? <HiPause className="w-5 h-5" /> : <HiPlay className="w-5 h-5 ml-0.5" />}
                </button>
                <button onClick={next} className="p-2.5 text-gray-600 dark:text-gray-400 hover:text-indigo-500 transition-colors"><HiForward className="w-5 h-5" /></button>
              </div>
            </div>

            {/* 🕹️ Central Controls & Slider Section */}
            <div className="hidden sm:flex flex-1 flex-col items-center gap-2 px-2">
              <div className="flex items-center gap-6 md:gap-8">
                <button
                  onClick={toggleShuffle}
                  className={`transition-all duration-300 ${shuffle ? 'text-indigo-500 scale-110' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  <HiArrowsRightLeft className="w-[18px] h-[18px]" />
                </button>

                <button onClick={prev} className="text-gray-700 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-all hover:scale-110 active:scale-95">
                  <HiBackward className="w-6 h-6" />
                </button>

                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-500 dark:from-white dark:to-gray-100 text-white dark:text-gray-900 flex items-center justify-center shadow-2xl shadow-indigo-500/30 dark:shadow-white/10 transition-all"
                >
                  {playing ? <HiPause className="w-6 h-6" /> : <HiPlay className="w-6 h-6 ml-1" />}
                </motion.button>

                <button onClick={next} className="text-gray-700 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-all hover:scale-110 active:scale-95">
                  <HiForward className="w-6 h-6" />
                </button>

                <button
                  onClick={toggleLoop}
                  className={`transition-all duration-300 ${loop ? 'text-indigo-500 scale-110' : 'text-gray-400 hover:text-gray-700 dark:hover:text-white'}`}
                >
                  <HiArrowPath className="w-[18px] h-[18px]" />
                </button>
              </div>

              <div className="w-full flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tabular-nums w-10 text-right">{formatTime(progress)}</span>
                <div className="flex-1 px-1">
                  <Slider
                    min={0}
                    max={100}
                    value={progressPercent}
                    onChange={handleSeek}
                    trackStyle={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', height: 6, borderRadius: 10 }}
                    railStyle={{ backgroundColor: 'rgba(156,163,175,0.2)', height: 6, borderRadius: 10 }}
                    handleStyle={{
                      borderColor: 'white',
                      backgroundColor: '#6366f1',
                      opacity: 1,
                      borderWidth: 3,
                      boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
                      width: 16,
                      height: 16,
                      marginTop: -5
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tabular-nums w-10">{formatTime(duration)}</span>
              </div>
            </div>

            {/* 🛠️ Utility Actions Section */}
            <div className="hidden sm:flex items-center gap-3 px-2 border-l border-gray-200 dark:border-white/5 ml-2">
              <div className="relative">
                <button
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? <HiSpeakerXMark className="w-5 h-5" /> : <HiSpeakerWave className="w-5 h-5" />}
                </button>

                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-4 bg-white/95 dark:bg-[#1A1F2E]/95 backdrop-blur-2xl rounded-2xl border border-gray-200 dark:border-white/10 shadow-2xl"
                    >
                      <div className="h-32 flex flex-col items-center">
                        <Slider
                          vertical
                          min={0}
                          max={100}
                          value={isMuted ? 0 : volume * 100}
                          onChange={(val) => setVolume(val / 100)}
                          trackStyle={{ background: '#6366f1', width: 6 }}
                          railStyle={{ backgroundColor: 'rgba(156,163,175,0.2)', width: 6 }}
                          handleStyle={{ borderColor: 'white', backgroundColor: '#6366f1', width: 14, height: 14, marginLeft: -4 }}
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => current?._id && likeMusic(current._id)}
                className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${current?.likes?.includes(user?._id) ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <HiHeart className={`w-5 h-5 ${current?.likes?.includes(user?._id) ? 'fill-current' : ''}`} />
              </motion.button>

              <button className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                <HiQueueList className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Progress Bar (Strip at bottom) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 sm:hidden bg-gray-200 dark:bg-white/5 rounded-b-[2rem]">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-[2rem] transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

SongPlayer.displayName = 'SongPlayer'
export default SongPlayer