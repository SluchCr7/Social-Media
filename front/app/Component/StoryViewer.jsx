'use client'

import React, { useState, useEffect, useRef } from 'react'
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
import { useTranslate } from '../Context/TranslateContext' // تأكد من وجود هذا
import { formatRelativeTime } from '../utils/FormatDataCreatedAt'

const StoryViewer = ({ stories, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [comment, setComment] = useState("")
  const { viewStory, toggleLove, shareStory } = useStory()
  const { user } = useAuth()
  const { AddNewMessage, setSelectedUser } = useMessage()
  const story = stories[currentIndex]
  const timerRef = useRef(null)
  const { t } = useTranslation()
  const { language } = useTranslate()
  const isRTL = ['ar', 'fa', 'he', 'ur'].includes(language)

  useEffect(() => {
    if (story?._id) {
      viewStory(story._id)
      setSelectedUser(story?.originalStory ? story.originalStory.owner : story?.owner)
    }
  }, [currentIndex, story, viewStory, setSelectedUser])

  useEffect(() => {
    if (!story || isPaused) return
    setProgress(0)

    const interval = 50
    const duration = 5000
    const increment = (interval / duration) * 100

    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev + increment >= 100) {
          handleNext()
          return 0
        }
        return prev + increment
      })
    }, interval)

    return () => clearInterval(timerRef.current)
  }, [currentIndex, isPaused, story])

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onClose()
    }
  }

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  // ✅ التبديل في الاتجاه للسحب بناءً على اللغة
  const handlers = useSwipeable({
    onSwipedUp: onClose,
    onSwipedDown: onClose,
    onSwipedLeft: isRTL ? handlePrev : handleNext,
    onSwipedRight: isRTL ? handleNext : handlePrev,
    trackMouse: true,
    delta: 50,
  })

  const photoUrl = Array.isArray(story?.Photo)
    ? story.Photo.find(url => url) || null
    : story?.Photo || null

  const handleLove = (e) => {
    e.stopPropagation()
    toggleLove(story._id)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    shareStory(story._id)
  }

  const handleCommentSubmit = async (e) => {
    e.preventDefault()
    if (!comment.trim()) return
    await AddNewMessage(comment)
    setComment("")
  }

  const togglePause = (e) => {
    if (e.target.closest('button') || e.target.closest('input')) return
    setIsPaused(prev => !prev)
  }

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left

    // ✅ انعكاس الاتجاه حسب اللغة
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

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/95 backdrop-blur-3xl"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* زر الإغلاق */}
      <button
        onClick={onClose}
        className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 sm:p-3 rounded-full bg-black/40 hover:bg-black/70 hover:scale-105 transition z-50 shadow-xl`}
        aria-label="Close Story"
      >
        <IoClose className="text-white text-2xl sm:text-3xl" />
      </button>

      {/* شريط التقدم */}
      <div className={`absolute top-4 ${isRTL ? 'right-1/2 translate-x-1/2' : 'left-1/2 -translate-x-1/2'} flex gap-1 sm:gap-2 w-[90%] sm:w-11/12 max-w-xl z-40`}>
        {stories.map((_, idx) => (
          <div key={idx} className="flex-1 h-1 sm:h-1.5 rounded-full bg-white/30 overflow-hidden shadow-sm">
            <div
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width:
                  idx < currentIndex ? '100%' :
                    idx === currentIndex ? `${progress}%` : '0%',
                opacity: idx <= currentIndex ? 1 : 0.5,
              }}
            />
          </div>
        ))}
      </div>

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3 }}
        {...handlers}
        onPointerDown={() => setIsPaused(true)}
        onPointerUp={() => setIsPaused(false)}
        onClick={handleTap}
        className="relative w-[95%] sm:w-[80%] md:w-[55%] lg:max-w-xl h-[70vh] sm:h-[80vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-center bg-black cursor-pointer transform-gpu"
      >
        {/* تأثير الخلفية */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-70" />

        {/* مؤشر التوقف */}
        <AnimatePresence>
          {isPaused && (
            <motion.div
              key="pause-indicator"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center z-40 pointer-events-none"
            >
              <div className="p-5 rounded-full bg-white/20 backdrop-blur-sm">
                {isPaused ? (
                  <FaPause className="text-white text-4xl" />
                ) : (
                  <FaPlay className="text-white text-4xl" />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* معلومات المستخدم */}
        <div className={`absolute top-4 ${isRTL ? 'right-4' : 'left-4'} flex items-center gap-3 z-30`}>
          <Link href={`/Pages/User/${story?.owner?._id || story?.originalStory?.owner?._id}`} className="relative block">
            <Image
              src={
                story?.originalStory
                  ? story.originalStory.owner?.profilePhoto?.url
                  : story?.owner?.profilePhoto?.url || '/default-profile.png'
              }
              alt="story owner"
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-lg"
            />
          </Link>

          <div className={`flex flex-col leading-tight text-white drop-shadow-lg ${isRTL ? 'text-right' : 'text-left'}`}>
            <Link
              href={`/Pages/User/${story?.owner?._id || story?.originalStory?.owner?._id}`}
              className="font-bold text-base hover:underline"
            >
              {story?.originalStory
                ? story.originalStory.owner?.username
                : story?.owner?.username || 'Unknown'}
            </Link>

            <span className="text-gray-300 text-xs">
              <span>{formatRelativeTime(story?.createdAt)}</span>
              {story?.originalStory && (
                <span className={`ml-2 text-emerald-400 italic ${isRTL ? 'mr-2 ml-0' : ''}`}>
                  • {t("Reshared")} @{story?.owner?.username}
                </span>
              )}
            </span>
          </div>
        </div>

        {/* الصورة أو النص */}
        {photoUrl ? (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <Image
              src={photoUrl}
              alt="story"
              fill
              className="object-cover w-full h-full"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
            {story.text && (
              <div className="absolute bottom-28 w-11/12 text-center z-20">
                <p className="text-lg sm:text-xl font-semibold text-white px-5 py-3 bg-black/50 rounded-2xl shadow-xl backdrop-blur-md">
                  {story.text}
                </p>
              </div>
            )}
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center px-10 text-center"
            style={{ backgroundColor: story.backgroundColor || '#000000' }}
          >
            <p className="text-xl sm:text-3xl font-extrabold text-white leading-snug drop-shadow-xl">
              {story.text}
            </p>
          </div>
        )}

        {/* شريط التعليق والأزرار */}
        {story?.owner?._id !== user?._id && (
          <div className={`absolute bottom-0 left-0 w-full p-4 z-50 bg-black/30 backdrop-blur-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
            <form onSubmit={handleCommentSubmit} className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="relative flex-1">
                <input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("Send a message...")}
                  className={`w-full px-5 py-3 rounded-3xl bg-white/20 backdrop-blur-lg text-white text-sm placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white/50 shadow-inner transition-all duration-200 border-none ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              {comment.trim() ? (
                <button
                  type="submit"
                  className="p-3 rounded-full bg-indigo-600 hover:bg-indigo-700 transition shadow-lg"
                  aria-label="Send Message"
                >
                  <IoSend className="text-xl text-white" />
                </button>
              ) : (
                <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                  <button
                    type="button"
                    onClick={handleLove}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-lg hover:scale-110 transition shadow-md"
                    aria-label="Like Story"
                  >
                    <FaHeart className={`text-xl ${story?.loves?.some(u => u?._id === user?._id) ? "text-red-500" : "text-white"}`} />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-lg hover:scale-110 transition shadow-md"
                    aria-label="Share Story"
                  >
                    <FaShare className="text-xl text-white" />
                  </button>
                </div>
              )}
            </form>
          </div>
        )}

        {/* إحصائيات المالك */}
        {user?._id === story?.owner?._id && (
          <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-6 text-white bg-black/40 backdrop-blur-md rounded-2xl px-5 py-2 shadow-xl z-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <span className="text-sm font-medium flex items-center gap-1">
              👁 {story?.views?.length || 0} {t("Views")}
            </span>
            <span className="text-sm font-medium flex items-center gap-1">
              <FaHeart className="text-red-500 text-sm" /> {story?.loves?.length || 0} {t("Likes")}
            </span>
          </div>
        )}
      </motion.div>
    </div>
  )
}

export default StoryViewer
