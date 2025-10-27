'use client'

import React, { useEffect, useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { FaPlay, FaPause, FaHeart, FaExpand, FaShareAlt, FaStepForward, FaStepBackward } from 'react-icons/fa'
import { useMusicPlayer } from '@/app/Context/MusicPlayerContext'
import { useMusic } from '@/app/Context/MusicContext'
import { useAuth } from '@/app/Context/AuthContext'
import { useTranslation } from 'react-i18next'
import ColorThief from 'colorthief'

const SongPlayer = React.memo(() => {
  const {
    current,
    playing,
    togglePlay,
    progress,
    duration,
    next,
    prev,
    setExpanded
  } = useMusicPlayer()

  const { likeMusic } = useMusic()
  const { user } = useAuth()
  const { t } = useTranslation()

  const [bgColor, setBgColor] = useState('#111')
  const [compact, setCompact] = useState(false)

  // 🎨 استخراج لون الغلاف لتنسيق الخلفية
  useEffect(() => {
    if (current?.cover) {
      const img = new Image()
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
    } else {
      setBgColor('#222')
    }
  }, [current])

  // 📱 تصغير تلقائي عند التمرير
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 150) setCompact(true)
      else setCompact(false)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const progressPercent = useMemo(() => (progress / (duration || 1)) * 100, [progress, duration])

  // ⏱️ تنسيق الوقت
  const formatTime = (s) => {
    if (!s) return '0:00'
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec < 10 ? '0' : ''}${sec}`
  }

  if (!current) return null // 💤 لا يوجد أغنية

  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 80, damping: 14 }}
      className={`fixed bottom-3 left-1/2 -translate-x-1/2 z-50 
                  w-[95%] sm:w-[85%] md:w-[70%] lg:w-[60%] 
                  backdrop-blur-xl border border-white/10 
                  rounded-3xl overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.3)]`}
      style={{
        background: `linear-gradient(120deg, ${bgColor}cc, #000000cc)`
      }}
    >
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 100 }}
        onDragEnd={(e, info) => {
          if (info.offset.y < -40) setExpanded(true)
        }}
        className="cursor-grab active:cursor-grabbing p-3 sm:p-4 flex flex-col sm:flex-row items-center gap-3 sm:gap-4"
      >
        {/* 🎧 الغلاف + الموجات */}
        <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-md flex-shrink-0">
          {current?.cover ? (
            <Image src={current.cover} alt={current.title} fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center text-xs text-gray-400">
              {t('No Cover')}
            </div>
          )}
          {playing && (
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-white/90 rounded-full"
                  animate={{ height: ['25%', '90%', '40%'] }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.6 + i * 0.1,
                    ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* 🎶 معلومات الأغنية */}
        <div className="flex-1 min-w-0 text-white">
          <h4 className="font-semibold text-sm sm:text-base truncate">{current?.title || 'Unknown'}</h4>
          <p className="text-xs text-gray-300 truncate">{current?.artist || 'Unknown Artist'}</p>
          <div className="flex justify-between items-center mt-1 text-[10px] text-gray-400">
            <span>{formatTime(progress)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <div className="h-1 mt-1 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-white/80"
              style={{ width: `${progressPercent}%` }}
              transition={{ ease: 'easeOut', duration: 0.3 }}
            />
          </div>
        </div>

        {/* 🎛️ عناصر التحكم */}
        <div className="flex items-center gap-2 sm:gap-3">
          <motion.button
            onClick={prev}
            whileTap={{ scale: 0.9 }}
            className="text-white/80 hover:text-white transition"
          >
            <FaStepBackward />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={togglePlay}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 text-white 
                       flex items-center justify-center shadow-md hover:scale-110 transition-transform"
          >
            {playing ? <FaPause /> : <FaPlay />}
          </motion.button>

          <motion.button
            onClick={next}
            whileTap={{ scale: 0.9 }}
            className="text-white/80 hover:text-white transition"
          >
            <FaStepForward />
          </motion.button>

          <motion.button
            onClick={() => setExpanded(true)}
            whileTap={{ scale: 0.9 }}
            className="hidden sm:flex text-white/70 hover:text-white transition"
          >
            <FaExpand />
          </motion.button>

          <motion.button
            onClick={() => current?._id && likeMusic(current._id)}
            whileTap={{ scale: 0.9 }}
            className={`hidden sm:flex p-2 rounded-lg transition-all ${
              current?.likes?.includes(user?._id)
                ? 'bg-red-500 text-white'
                : 'bg-white/20 text-white/80 hover:bg-white/30'
            }`}
          >
            <FaHeart />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.9 }}
            className="hidden sm:flex p-2 text-white/70 hover:text-white transition"
          >
            <FaShareAlt />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
})

SongPlayer.displayName = 'SongPlayer'
export default SongPlayer
