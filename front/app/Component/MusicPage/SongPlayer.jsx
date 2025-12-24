'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaExpand,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaRandom,
  FaRedo,
  FaListUl
} from 'react-icons/fa'
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

  const [bgColor, setBgColor] = useState('#4f46e5')
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  useEffect(() => {
    if (!current?.cover) {
      setBgColor('#4f46e5')
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
          setBgColor('#4f46e5')
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
        className="fixed bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl z-[100] px-4"
      >
        <div
          className="relative overflow-hidden rounded-[2.5rem] bg-black/40 dark:bg-black/60 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-4 flex flex-col md:flex-row items-center gap-6"
        >
          {/* Ambient Background Glow */}
          <div
            className="absolute inset-0 opacity-20 blur-[100px] pointer-events-none"
            style={{ backgroundColor: bgColor }}
          />

          {/* Album Art & Info */}
          <div className="flex items-center gap-4 flex-shrink-0 z-10">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10"
            >
              <Image src={current.cover || '/song-placeholder.png'} alt={current.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 to-transparent" />
            </motion.div>
            <div className="flex flex-col">
              <h4 className="text-white font-bold text-sm sm:text-base leading-tight truncate max-w-[150px]">
                {current.title}
              </h4>
              <p className="text-indigo-400 text-xs font-semibold">
                {current.artist}
              </p>
            </div>
          </div>

          {/* Controls & Progress */}
          <div className="flex-1 flex flex-col items-center gap-2 z-10 w-full">
            <div className="flex items-center gap-8">
              <button
                onClick={toggleShuffle}
                className={`transition-colors ${shuffle ? 'text-indigo-500' : 'text-gray-400 hover:text-white'}`}
              >
                <FaRandom size={14} />
              </button>

              <button onClick={prev} className="text-white hover:scale-110 transition-transform">
                <FaStepBackward size={18} />
              </button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={togglePlay}
                className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all"
              >
                {playing ? <FaPause size={20} /> : <FaPlay size={20} className="ml-1" />}
              </motion.button>

              <button onClick={next} className="text-white hover:scale-110 transition-transform">
                <FaStepForward size={18} />
              </button>

              <button
                onClick={toggleLoop}
                className={`transition-colors ${loop ? 'text-indigo-500' : 'text-gray-400 hover:text-white'}`}
              >
                <FaRedo size={14} />
              </button>
            </div>

            <div className="w-full flex items-center gap-3">
              <span className="text-[10px] font-bold text-gray-400 w-10 text-right">{formatTime(progress)}</span>
              <div className="flex-1">
                <Slider
                  min={0}
                  max={100}
                  value={progressPercent}
                  onChange={handleSeek}
                  trackStyle={{ background: 'linear-gradient(90deg, #4f46e5, #9333ea)', height: 4 }}
                  railStyle={{ backgroundColor: 'rgba(255,255,255,0.1)', height: 4 }}
                  handleStyle={{
                    borderColor: '#ffffff',
                    backgroundColor: '#ffffff',
                    opacity: 1,
                    boxShadow: '0 0 10px rgba(255,255,255,0.5)',
                    width: 12,
                    height: 12,
                    marginTop: -4
                  }}
                />
              </div>
              <span className="text-[10px] font-bold text-gray-400 w-10">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Extra Controls */}
          <div className="flex items-center gap-5 z-10 flex-shrink-0">
            <div className="relative">
              <button
                onMouseEnter={() => setShowVolumeSlider(true)}
                className="text-gray-400 hover:text-white transition-colors"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
              </button>

              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 p-3 bg-black/80 backdrop-blur-xl rounded-2xl border border-white/10"
                  >
                    <div className="h-24">
                      <Slider
                        vertical
                        min={0}
                        max={100}
                        value={isMuted ? 0 : volume * 100}
                        onChange={(val) => setVolume(val / 100)}
                        trackStyle={{ backgroundColor: '#4f46e5' }}
                        railStyle={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => current?._id && likeMusic(current._id)}
              className={`transition-colors ${current?.likes?.includes(user?._id) ? 'text-red-500' : 'text-gray-400 hover:text-white'}`}
            >
              <FaHeart size={18} />
            </button>

            <button
              onClick={() => setExpanded(true)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <FaExpand size={16} />
            </button>

            <div className="h-8 w-px bg-white/10 mx-2 hidden md:block" />

            <button className="text-gray-400 hover:text-indigo-400 transition-colors">
              <FaListUl size={18} />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

SongPlayer.displayName = 'SongPlayer'
export default SongPlayer