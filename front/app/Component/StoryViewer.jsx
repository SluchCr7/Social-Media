
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { IoClose, IoSend } from "react-icons/io5"
import { FaHeart, FaShare, FaPlay, FaPause } from "react-icons/fa"
import Image from 'next/image'
import Link from 'next/link'
import { useSwipeable } from 'react-swipeable'
import { useStory } from '../Context/StoryContext'
import { useAuth } from '../Context/AuthContext'
import { useMessage } from '../Context/MessageContext'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import TimeAgo from 'react-timeago'
import { useTranslate } from '../Context/TranslateContext'
import { formatRelativeTime } from '../utils/FormatDataCreatedAt' // تابعك للمادّة

const StoryViewer = ({ stories = [], onClose = () => {} }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [comment, setComment] = useState("")
  const { viewStory, toggleLove, shareStory } = useStory()
  const { user } = useAuth()
  const { AddNewMessage, setSelectedUser } = useMessage()
  const story = stories[currentIndex] || null
  const timerRef = useRef(null)
  const durationRef = useRef(5000) // مدة عرض كل ستوري بالميلّي ثانية
  const { t } = useTranslation()
  const { language } = useTranslate()
  const isRTL = ['ar', 'fa', 'he', 'ur'].includes(language)
  const containerRef = useRef(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)

  // إذا تغير الاستوري، قم بعرضه وتعيين المستخدم المحدد
  useEffect(() => {
    if (story?._id) {
      viewStory(story._id)
      setSelectedUser(story?.originalStory ? story.originalStory.owner : story?.owner)
    }
    // reset progress & loaded flag
    setProgress(0)
    setIsImageLoaded(false)
  }, [currentIndex, story, viewStory, setSelectedUser])

  // مؤقت ال progress
  useEffect(() => {
    if (!story) return
    if (isPaused) {
      // نوقف المؤقت
      clearInterval(timerRef.current)
      return
    }

    const interval = 50
    const duration = durationRef.current
    const increment = (interval / duration) * 100

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        const next = prev + increment
        if (next >= 100) {
          // نمر للاستوري التالي
          handleNext()
          return 0
        }
        return next
      })
    }, interval)

    return () => clearInterval(timerRef.current)
  }, [currentIndex, isPaused, story])

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') {
        if (!isRTL) handleNext()
        else handlePrev()
      }
      if (e.key === 'ArrowLeft') {
        if (!isRTL) handlePrev()
        else handleNext()
      }
      if (e.key === 'Escape') {
        handleClose()
      }
      if (e.key === ' ' || e.code === 'Space') {
        // منع الـ page scroll عند مسافة التوقف
        e.preventDefault()
        setIsPaused(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentIndex, isRTL])

  const handleNext = useCallback(() => {
    setProgress(0)
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(idx => idx + 1)
    } else {
      handleClose()
    }
  }, [currentIndex, stories.length])

  const handlePrev = useCallback(() => {
    setProgress(0)
    if (currentIndex > 0) {
      setCurrentIndex(idx => idx - 1)
    }
  }, [currentIndex])

  const handlers = useSwipeable({
    onSwipedUp: () => handleClose(),
    onSwipedDown: () => handleClose(),
    onSwipedLeft: isRTL ? handlePrev : handleNext,
    onSwipedRight: isRTL ? handleNext : handlePrev,
    trackMouse: true,
    delta: 50,
  })

  const photoUrl = Array.isArray(story?.Photo)
    ? story.Photo.find(url => url) || null
    : story?.Photo || null

  const handleLove = (e) => {
    e?.stopPropagation()
    if (!story?._id) return
    toggleLove(story._id)
  }

  const handleShare = (e) => {
    e?.stopPropagation()
    if (!story?._id) return
    shareStory(story._id)
  }

  const handleCommentSubmit = async (e) => {
    e?.preventDefault()
    if (!comment.trim()) return
    await AddNewMessage(comment)
    setComment("")
  }

  const togglePause = (e) => {
    // إذا تم الضغط على زر أو داخل حقل إدخال فلا نغير حالة الإيقاف
    if (e?.target?.closest && (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea'))) return
    setIsPaused(prev => !prev)
  }

  const handleTap = (e) => {
    // منع التفاعل إن لم يكن داخل العنصر الصحيح
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left

    // سلوك النقر حسب تقسيم الشاشة (ثالثات)
    if (isRTL) {
      if (clickX < rect.width / 3) {
        handleNext()
      } else if (clickX > (rect.width * 2) / 3) {
        handlePrev()
      } else {
        togglePause(e)
      }
    } else {
      if (clickX < rect.width / 3) {
        handlePrev()
      } else if (clickX > (rect.width * 2) / 3) {
        handleNext()
      } else {
        togglePause(e)
      }
    }
  }

  const handleClose = useCallback(() => {
    // فضلاً اغلاق بسلاسة
    setIsPaused(true)
    // animate fade-out ثم استدعاء onClose مباشرة (يمكن الاعتماد على parent animation إن وُجد)
    onClose()
  }, [onClose])

  // auto-resize textarea
  const textareaRef = useRef(null)
  useEffect(() => {
    if (!textareaRef.current) return
    const el = textareaRef.current
    const adjust = () => {
      el.style.height = 'auto'
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`
    }
    adjust()
    el.addEventListener('input', adjust)
    return () => el.removeEventListener('input', adjust)
  }, [comment])

  if (!stories || stories.length === 0) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 backdrop-blur-sm"
      dir={isRTL ? "rtl" : "ltr"}
      aria-modal="true"
      role="dialog"
    >
      {/* زر الإغلاق */}
      <button
        onClick={handleClose}
        className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 hover:scale-105 transition z-50 shadow-xl`}
        aria-label={t('Close Story')}
      >
        <IoClose className="text-white text-2xl sm:text-3xl" />
      </button>

      {/* شريط التقدم */}
      <div className={`absolute top-4 ${isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} flex gap-2 w-[90%] sm:w-11/12 max-w-xl z-40`}>
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 sm:h-1.5 rounded-full bg-white/20 overflow-hidden shadow-sm">
            <div
              className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all ease-linear"
              style={{
                width:
                  idx < currentIndex ? '100%' :
                    idx === currentIndex ? `${progress}%` : '0%',
                opacity: idx <= currentIndex ? 1 : 0.6,
              }}
            />
          </div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.25 }}
        {...handlers}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onClick={handleTap}
        ref={containerRef}
        className="relative w-[95%] sm:w-[80%] md:w-[60%] lg:max-w-2xl h-[78vh] sm:h-[86vh] rounded-2xl overflow-hidden shadow-2xl flex flex-col justify-center bg-black cursor-pointer transform-gpu"
      >
        {/* الخلفية المتوهجة الديناميكية */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/95" />
          <div className="absolute top-[-10%] left-1/2 translate-x-[-50%] w-[700px] h-[700px] rounded-full blur-3xl bg-gradient-to-r from-indigo-700/30 to-sky-500/20 opacity-80" />
        </div>

        {/* ظل داخلي cinematic */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <div className="absolute inset-0 shadow-[inset_0_60px_120px_rgba(0,0,0,0.7)]" />
        </div>

        {/* مؤشّر التوقف - يظهر عندما يكون متوقف */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              key="pause-ind"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
            >
              <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                {isPaused ? (
                  <FaPause className="text-white text-4xl" />
                ) : (
                  <FaPlay className="text-white text-4xl" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* معلومات المستخدم (avatar + name + time) */}
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex items-center gap-3 z-30`}>
          <Link href={`/Pages/User/${story?.owner?._id || story?.originalStory?.owner?._id}`} className="relative block">
            <Image
              src={
                story?.originalStory
                  ? story.originalStory.owner?.profilePhoto?.url
                  : story?.owner?.profilePhoto?.url || '/default-profile.png'
              }
              alt="story owner"
              width={44}
              height={44}
              className="w-11 h-11 rounded-full object-cover border-2 border-white/20 shadow-md"
            />
          </Link>

          <div className={`flex flex-col leading-tight text-white drop-shadow-md ${isRTL ? 'text-right' : 'text-left'}`}>
            <Link
              href={`/Pages/User/${story?.owner?._id || story?.originalStory?.owner?._id}`}
              className="font-semibold text-base hover:underline"
            >
              {story?.originalStory
                ? story.originalStory.owner?.username
                : story?.owner?.username || t('Unknown')}
            </Link>

            <span className="text-gray-300 text-xs flex items-center gap-2">
              <span>{formatRelativeTime(story?.createdAt)}</span>
              {story?.originalStory && (
                <span className={`text-emerald-400 italic text-xs ${isRTL ? 'mr-2 ml-0' : 'ml-2'}`}>
                  • {t("Reshared")} @{story?.owner?.username}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* المحتوى — صورة أو نص (صورة بملاءمة كاملة بدون قص) */}
        {photoUrl ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">
            {/* Ken Burns effect — نحرّك الحاوية نفسها */}
            <motion.div
              key={photoUrl}
              initial={{ scale: 1.03 }}
              animate={{ scale: isPaused ? 1.03 : 1.0 }}
              transition={{ duration: (durationRef.current / 1000) + 0.5, ease: "easeOut" }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <Image
                src={photoUrl}
                alt="story"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                onLoadingComplete={() => setIsImageLoaded(true)}
                className="object-contain w-full h-full"
                priority
              />
            </motion.div>

            {/* gradient overlay to fill empty margins when object-contain used */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/50" />
              <div className="absolute left-0 top-0 bottom-0 w-1/6 bg-gradient-to-r from-black/40 to-transparent" />
              <div className="absolute right-0 top-0 bottom-0 w-1/6 bg-gradient-to-l from-black/40 to-transparent" />
            </div>

            {/* إذا كان هناك نص فوق الصورة */}
            {story?.text && (
              <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-11/12 text-center z-30">
                <p className="text-lg sm:text-xl font-semibold text-white px-5 py-3 bg-black/45 rounded-2xl shadow-xl backdrop-blur-md">
                  {story.text}
                </p>
              </div>
            )}
          </div>
        ) : (
          // عرض نصي مع خلفية لونية إن لم توجد صورة
          <div
            className="w-full h-full flex items-center justify-center px-8 text-center"
            style={{ backgroundColor: story?.backgroundColor || '#0b0b0b' }}
          >
            <p className="text-xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-xl">
              {story?.text}
            </p>
          </div>
        )}

        {/* شريط التعليق والأزرار (مخفي لمالك الستوري) */}
        {story && story?.owner?._id !== user?._id && (
          <div className={`absolute bottom-0 left-0 w-full p-4 z-50 bg-black/30 backdrop-blur-md border-t border-white/6 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <form onSubmit={handleCommentSubmit} className={`flex items-center gap-2 w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <textarea
                  ref={textareaRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("Send a message...")}
                  rows={1}
                  className={`w-full resize-none px-4 py-3 rounded-full bg-white/8 backdrop-blur-sm text-white text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-200 border-none ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              {comment.trim() ? (
                <button
                  type="submit"
                  className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 hover:scale-105 transform transition shadow-lg"
                  aria-label={t('Send Message')}
                >
                  <IoSend className="text-white text-lg" />
                </button>
              ) : (
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={handleLove}
                    className="p-3 rounded-full bg-white/6 backdrop-blur-sm hover:scale-110 transition shadow-md"
                    aria-label={t('Like Story')}
                  >
                    <FaHeart className={`text-lg ${story?.loves?.some(u => u?._id === user?._id) ? "text-red-400" : "text-white"}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-3 rounded-full bg-white/6 backdrop-blur-sm hover:scale-110 transition shadow-md"
                    aria-label={t('Share Story')}
                  >
                    <FaShare className="text-lg text-white" />
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* إحصائيات المالك (يعرض لمالك الستوري) */}
        {story && user?._id === story?.owner?._id && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-5 text-white bg-black/40 backdrop-blur-md rounded-2xl px-5 py-2 shadow-lg z-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium flex items-center gap-2">
              👁 {story?.views?.length || 0} <span className="text-xs text-gray-300">{t("Views")}</span>
            </span>
            <span className="text-sm font-medium flex items-center gap-2">
              <FaHeart className="text-red-400 text-sm" /> {story?.loves?.length || 0} <span className="text-xs text-gray-300">{t("Likes")}</span>
            </span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default StoryViewer
