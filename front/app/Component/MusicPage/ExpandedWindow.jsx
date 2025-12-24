'use client'

import React, { useCallback, useMemo, useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import {
  FaPlay, FaPause, FaStepForward, FaStepBackward,
  FaRandom, FaRedo, FaTimes, FaHeart, FaShareAlt,
  FaVolumeUp, FaVolumeMute, FaListUl, FaMagic
} from 'react-icons/fa'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'
import { useMusic } from '@/app/Context/MusicContext'
import { formatTime } from '@/app/utils/formatTime'
import { useAuth } from '@/app/Context/AuthContext'
import { useTranslation } from 'react-i18next'
import ColorThief from 'colorthief'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'

const ExpandedWindow = () => {
  const { t } = useTranslation()
  const {
    current, playing, togglePlay, progress, duration, next, prev,
    shuffle, setShuffle, repeatMode, setRepeatMode, expanded, setExpanded, isReady,
    volume, setVolume, isMuted
  } = useMusicPlayer()

  const { likeMusic } = useMusic()
  const { user } = useAuth()

  const [accentColor, setAccentColor] = useState('#4f46e5')

  useEffect(() => {
    if (!current?.cover || !expanded) return

    const img = new window.Image()
    img.crossOrigin = 'Anonymous'
    img.src = current.cover
    img.onload = () => {
      try {
        const colorThief = new ColorThief()
        const color = colorThief.getColor(img)
        setAccentColor(`rgb(${color.join(',')})`)
      } catch {
        setAccentColor('#4f46e5')
      }
    }
  }, [current, expanded])

  const progressPercent = useMemo(() => (progress / (duration || 1)) * 100, [progress, duration])

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[1000] bg-black flex flex-col overflow-hidden"
        >
          {/* Immersive Background */}
          <div className="absolute inset-0">
            <Image
              src={current.cover}
              alt="background"
              fill
              className="object-cover opacity-30 blur-[120px] scale-150"
            />
            <motion.div
              animate={{
                background: [
                  `radial-gradient(circle at 20% 20%, ${accentColor}44 0%, transparent 50%)`,
                  `radial-gradient(circle at 80% 80%, ${accentColor}44 0%, transparent 50%)`,
                  `radial-gradient(circle at 20% 20%, ${accentColor}44 0%, transparent 50%)`,
                ]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/80" />
          </div>

          {/* Top Bar */}
          <div className="relative z-10 p-8 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Zocial Studio • Live</span>
            </div>
            <button
              onClick={handleClose}
              className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/10 text-white flex items-center justify-center border border-white/10 transition-all backdrop-blur-md"
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* Main Content Area */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24 w-full max-w-6xl">

              {/* Cover Art - Left/Center */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotate: -5 }}
                animate={{ scale: 1, opacity: 1, rotate: 0 }}
                className="relative group shrink-0"
              >
                <div className="absolute inset-0 bg-white/20 blur-[60px] rounded-full scale-75 animate-pulse" />
                <div className="relative w-72 h-72 sm:w-96 sm:h-96 rounded-[3rem] overflow-hidden shadow-[0_40px_100px_rgba(0,0,0,0.8)] border border-white/20 group-hover:scale-[1.02] transition-transform duration-700">
                  <Image src={current.cover} alt={current.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
                </div>

                {/* Floating Tags */}
                <motion.div
                  initial={{ x: 20 }} animate={{ x: 0 }}
                  className="absolute -bottom-4 -right-4 bg-white text-black font-black text-[10px] px-4 py-2 rounded-full shadow-2xl uppercase tracking-widest"
                >
                  HD AUDIO
                </motion.div>
              </motion.div>

              {/* Info & Controls - Right */}
              <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left w-full space-y-10">
                <div>
                  <motion.h1
                    layoutId="song-title"
                    className="text-4xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight"
                  >
                    {current.title}
                  </motion.h1>
                  <motion.p
                    layoutId="song-artist"
                    className="text-xl sm:text-2xl text-white/50 font-bold mt-4 flex items-center justify-center lg:justify-start gap-4"
                  >
                    {current.artist}
                    <span className="w-2 h-2 rounded-full bg-white/20" />
                    <span className="text-sm uppercase tracking-widest text-indigo-400 font-black">
                      {current.album || 'Single'}
                    </span>
                  </motion.p>
                </div>

                {/* Progress Bar Container */}
                <div className="w-full space-y-4">
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
                    <motion.div
                      className="absolute h-full bg-white shadow-[0_0_20px_white]"
                      animate={{ width: `${progressPercent}%` }}
                      transition={{ type: 'spring', damping: 20 }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-bold text-white/40 tracking-widest font-mono">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Interaction Row */}
                <div className="w-full flex flex-wrap items-center justify-center lg:justify-start gap-8">
                  <div className="flex items-center gap-8">
                    <button onClick={prev} className="text-white/60 hover:text-white transition-all transform hover:scale-110 active:scale-95">
                      <FaStepBackward size={28} />
                    </button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleTogglePlay}
                      className="w-24 h-24 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.4)]"
                    >
                      {playing ? <FaPause size={32} /> : <FaPlay size={32} className="ml-2" />}
                    </motion.button>

                    <button onClick={next} className="text-white/60 hover:text-white transition-all transform hover:scale-110 active:scale-95">
                      <FaStepForward size={28} />
                    </button>
                  </div>

                  <div className="h-10 w-px bg-white/10 mx-2 hidden sm:block" />

                  <div className="flex items-center gap-6">
                    <button onClick={() => setShuffle(!shuffle)} className={`transition-all ${shuffle ? 'text-indigo-400' : 'text-white/40 hover:text-white'}`}>
                      <FaRandom size={20} />
                    </button>
                    <button onClick={handleRepeat} className={`transition-all ${repeatMode !== 'off' ? 'text-indigo-400' : 'text-white/40 hover:text-white'}`}>
                      <FaRedo size={20} />
                    </button>
                    <button onClick={handleLike} className={`transition-all ${current?.likes?.includes(user?._id) ? 'text-red-500 scale-125' : 'text-white/40 hover:text-white'}`}>
                      <FaHeart size={20} />
                    </button>
                  </div>
                </div>

                {/* Volume & Utility */}
                <div className="w-full lg:max-w-md pt-8 flex items-center gap-6 opacity-60 hover:opacity-100 transition-opacity">
                  <button className="text-white" onClick={() => setVolume(volume === 0 ? 0.7 : 0)}>
                    {isMuted || volume === 0 ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
                  </button>
                  <div className="flex-1">
                    <Slider
                      min={0} max={100} value={volume * 100}
                      onChange={(v) => setVolume(v / 100)}
                      trackStyle={{ background: '#fff' }}
                      railStyle={{ background: 'rgba(255,255,255,0.1)' }}
                      handleStyle={{ display: 'none' }}
                    />
                  </div>
                  <div className="flex gap-4">
                    <FaMagic className="text-white/40 hover:text-indigo-400 cursor-pointer" />
                    <FaListUl className="text-white/40 hover:text-indigo-400 cursor-pointer" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Bottom Deck - Track Visualizer Placeholder */}
          <div className="relative z-10 h-32 w-full flex items-end justify-center px-8 pb-8">
            <div className="flex items-end gap-1.5 h-full opacity-20">
              {[...Array(60)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: playing ? [10, Math.random() * 60 + 10, 10] : 10 }}
                  transition={{ repeat: Infinity, duration: 0.5 + Math.random(), ease: "easeInOut" }}
                  className="w-1.5 bg-white rounded-full"
                />
              ))}
            </div>
          </div>

        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ExpandedWindow
