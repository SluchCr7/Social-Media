'use client'

import React, { useEffect, useState, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
  FaPlay,
  FaPause,
  FaHeart,
  FaExpand,
  FaShareAlt,
  FaStepForward,
  FaStepBackward,
  FaVolumeUp,
  FaVolumeMute,
  FaRandom,
  FaRedo
} from 'react-icons/fa'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'
import { useMusic } from '@/app/Context/MusicContext'
import { useAuth } from '@/app/Context/AuthContext'
import { useTranslation } from 'react-i18next'
import ColorThief from 'colorthief'
import Slider from 'rc-slider' // لتوفير شريط تحكم بالصوت احترافي
import 'rc-slider/assets/index.css' // ملف الـ CSS الخاص بالـ Slider

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

  const [bgColor, setBgColor] = useState('#111')
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)

  // 🎨 استخراج لون الغلاف لتنسيق الخلفية
  useEffect(() => {
    if (!current?.cover) {
      setBgColor('#222')
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
          setBgColor('#222')
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
    // هذا الـ div سيضمن أن الـ SongPlayer يظهر في منتصف الجزء السفلي بالظبط
    // Fixed, Centered, Responsive, and on top of everything.
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 90, damping: 15 }}
        className={`fixed bottom-0 left-0 w-full z-50 p-4 pb-8 flex justify-center items-center
                    bg-gradient-to-t from-gray-950/90 via-gray-950/70 to-transparent`} // خلفية متدرجة شفافة
      >
        <div
          className={`w-[96%] max-w-5xl bg-white/5 backdrop-blur-xl border border-white/10
                      rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)]
                      flex flex-col md:flex-row items-center p-3 sm:p-4 gap-3 sm:gap-6`}
          style={{
            background: `linear-gradient(90deg, ${bgColor}33, #00000066)` // خلفية متدرجة تعتمد على لون الغلاف
          }}
        >
          {/* 🎧 معلومات الأغنية (يسار) */}
          <div className="flex items-center gap-3 flex-shrink-0 w-full md:w-auto">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden shadow-md flex-shrink-0">
              {current?.cover ? (
                <Image src={current.cover} alt={current.title} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                  {t('No Cover')}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 text-white">
              <h4 className="font-semibold text-sm sm:text-base truncate">
                {current?.title || 'Unknown'}
              </h4>
              <p className="text-xs text-gray-300 truncate">
                {current?.artist || 'Unknown Artist'}
              </p>
            </div>
          </div>

          {/* 🎛️ أزرار التحكم الرئيسية وشريط التقدم (المنتصف) */}
          <div className="flex-1 flex flex-col items-center w-full md:w-auto">
            {/* أزرار التحكم */}
            <div className="flex items-center gap-4 sm:gap-6 mb-2">
              <motion.button
                onClick={toggleShuffle}
                whileTap={{ scale: 0.9 }}
                className={`text-white/70 hover:text-white transition ${shuffle ? 'text-green-400' : ''}`}
                aria-label={t('Shuffle')}
              >
                <FaRandom size={16} />
              </motion.button>
              <motion.button
                onClick={prev}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-white/80 transition"
                aria-label={t('Previous')}
              >
                <FaStepBackward size={20} />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={togglePlay}
                className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white
                          flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
                aria-label={playing ? t('Pause') : t('Play')}
              >
                {playing ? <FaPause size={20} /> : <FaPlay size={20} />}
              </motion.button>
              <motion.button
                onClick={next}
                whileTap={{ scale: 0.9 }}
                className="text-white hover:text-white/80 transition"
                aria-label={t('Next')}
              >
                <FaStepForward size={20} />
              </motion.button>
              <motion.button
                onClick={toggleLoop}
                whileTap={{ scale: 0.9 }}
                className={`text-white/70 hover:text-white transition ${loop ? 'text-green-400' : ''}`}
                aria-label={t('Loop')}
              >
                <FaRedo size={16} />
              </motion.button>
            </div>

            {/* شريط التقدم */}
            <div className="flex items-center gap-3 w-full text-xs text-gray-300">
              <span>{formatTime(progress)}</span>
              <Slider
                min={0}
                max={100}
                value={progressPercent}
                onChange={handleSeek}
                className="flex-1"
                trackStyle={{ backgroundColor: '#4F46E5' }} // لون شريط التقدم
                handleStyle={{
                  borderColor: '#4F46E5',
                  backgroundColor: '#6366F1',
                  opacity: 1,
                  boxShadow: 'none',
                  marginTop: -4 // لضبط موقع المقبض
                }}
                railStyle={{ backgroundColor: '#ffffff33' }} // لون شريط التقدم الخلفي
              />
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* 🔊 عناصر إضافية (يمين) */}
          <div className="flex items-center gap-3 flex-shrink-0 mt-2 md:mt-0">
            {/* زر الصوت والمتحكم */}
            <div className="relative flex items-center gap-2">
              <motion.button
                onClick={() => setShowVolumeSlider(prev => !prev)}
                whileTap={{ scale: 0.9 }}
                className="text-white/70 hover:text-white transition"
                aria-label={isMuted ? t('Unmute') : t('Mute')}
              >
                {isMuted || volume === 0 ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
              </motion.button>
              <AnimatePresence>
                {showVolumeSlider && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="absolute bottom-full mb-2 w-24 p-2 bg-gray-800/80 backdrop-blur-md rounded-lg shadow-xl"
                  >
                    <Slider
                      min={0}
                      max={100}
                      value={isMuted ? 0 : volume * 100}
                      onChange={(val) => setVolume(val / 100)}
                      vertical // لجعل المتحكم عمودي
                      className="h-20"
                      trackStyle={{ backgroundColor: '#6366F1' }}
                      handleStyle={{
                        borderColor: '#4F46E5',
                        backgroundColor: '#6366F1',
                        opacity: 1,
                        boxShadow: 'none',
                        marginLeft: -2 // لضبط موقع المقبض العمودي
                      }}
                      railStyle={{ backgroundColor: '#ffffff33' }}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              onClick={() => current?._id && likeMusic(current._id)}
              whileTap={{ scale: 0.9 }}
              className={`p-2 rounded-full transition-all text-sm
                        ${current?.likes?.includes(user?._id)
                          ? 'bg-red-500 text-white'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                        }`}
              aria-label={t('Like')}
            >
              <FaHeart />
            </motion.button>

            <motion.button
              onClick={() => setExpanded(true)}
              whileTap={{ scale: 0.9 }}
              className="p-2 rounded-full bg-white/10 text-white/70 hover:bg-white/20 transition text-sm"
              aria-label={t('Expand')}
            >
              <FaExpand />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
})

SongPlayer.displayName = 'SongPlayer'
export default SongPlayer