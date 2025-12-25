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
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl z-[100] px-4"
      >
        <div className="group relative">
          {/* ✨ Ethereal Aura Glow */}
          <motion.div
            animate={{
              backgroundColor: bgColor,
              scale: playing ? [1, 1.05, 1] : 1,
              opacity: playing ? 0.3 : 0.15
            }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="absolute -inset-4 blur-[60px] rounded-full pointer-events-none transition-colors duration-1000"
          />

          <div className="relative overflow-hidden rounded-[2.5rem] bg-white/70 dark:bg-[#0B0F1A]/80 backdrop-blur-3xl border border-white/20 dark:border-white/5 shadow-2xl p-3 flex flex-col md:flex-row items-center gap-4">

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

              <div className="flex md:hidden items-center gap-2">
                <button onClick={prev} className="p-2 text-gray-500"><HiBackward size={20} /></button>
                <button onClick={togglePlay} className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  {playing ? <HiPause size={20} /> : <HiPlay size={20} className="ml-0.5" />}
                </button>
                <button onClick={next} className="p-2 text-gray-500"><HiForward size={20} /></button>
              </div>
            </div>

            {/* 🕹️ Central Controls & Slider Section */}
            <div className="hidden md:flex flex-1 flex-col items-center gap-1.5 px-2">
              <div className="flex items-center gap-7">
                <button
                  onClick={toggleShuffle}
                  className={`transition-all duration-300 ${shuffle ? 'text-indigo-500 scale-110' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                >
                  <HiArrowsRightLeft size={18} />
                </button>

                <button onClick={prev} className="text-gray-700 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-all hover:scale-110 active:scale-95">
                  <HiBackward size={22} />
                </button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={togglePlay}
                  className="w-12 h-12 rounded-full bg-indigo-600 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center shadow-xl shadow-indigo-500/20 dark:shadow-white/5 transition-all"
                >
                  {playing ? <HiPause size={24} /> : <HiPlay size={24} className="ml-1" />}
                </motion.button>

                <button onClick={next} className="text-gray-700 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-all hover:scale-110 active:scale-95">
                  <HiForward size={22} />
                </button>

                <button
                  onClick={toggleLoop}
                  className={`transition-all duration-300 ${loop ? 'text-indigo-500 scale-110' : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'}`}
                >
                  <HiArrowPath size={18} />
                </button>
              </div>

              <div className="w-full flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400 tabular-nums w-8">{formatTime(progress)}</span>
                <div className="flex-1 px-1">
                  <Slider
                    min={0}
                    max={100}
                    value={progressPercent}
                    onChange={handleSeek}
                    trackStyle={{ background: 'linear-gradient(90deg, #6366f1, #a855f7)', height: 5, borderRadius: 10 }}
                    railStyle={{ backgroundColor: 'rgba(0,0,0,0.05)', height: 5, borderRadius: 10 }}
                    handleStyle={{
                      borderColor: 'white',
                      backgroundColor: '#6366f1',
                      opacity: 1,
                      borderWidth: 3,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      width: 14,
                      height: 14,
                      marginTop: -4.5
                    }}
                  />
                </div>
                <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400 tabular-nums w-8">{formatTime(duration)}</span>
              </div>
            </div>

            {/* 🛠️ Utility Actions Section */}
            <div className="hidden md:flex items-center gap-3 px-2 border-l border-gray-100 dark:border-white/5 ml-2">
              <div className="relative">
                <button
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
                  onClick={toggleMute}
                >
                  {isMuted || volume === 0 ? <HiSpeakerXMark size={20} /> : <HiSpeakerWave size={20} />}
                </button>

                <AnimatePresence>
                  {showVolumeSlider && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                      className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-4 bg-white/90 dark:bg-[#1A1F2E]/90 backdrop-blur-2xl rounded-2xl border border-gray-100 dark:border-white/10 shadow-2xl"
                    >
                      <div className="h-32 flex flex-col items-center">
                        <Slider
                          vertical
                          min={0}
                          max={100}
                          value={isMuted ? 0 : volume * 100}
                          onChange={(val) => setVolume(val / 100)}
                          trackStyle={{ background: '#6366f1', width: 6 }}
                          railStyle={{ backgroundColor: 'rgba(0,0,0,0.05)', width: 6 }}
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
                className={`w-9 h-9 flex items-center justify-center rounded-xl transition-all ${current?.likes?.includes(user?._id) ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50'}`}
              >
                <HiHeart size={20} className={current?.likes?.includes(user?._id) ? 'fill-current' : ''} />
              </motion.button>

              <button className="w-9 h-9 flex items-center justify-center rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors">
                <HiQueueList size={20} />
              </button>
            </div>

            {/* Mobile Progress Bar (Strip at bottom) */}
            <div className="absolute bottom-0 left-0 right-0 h-1 md:hidden">
              <div className="h-full bg-indigo-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

SongPlayer.displayName = 'SongPlayer'
export default SongPlayer