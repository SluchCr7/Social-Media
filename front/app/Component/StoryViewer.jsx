'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { IoClose, IoSend } from 'react-icons/io5'
import { FaHeart, FaShare, FaPlay, FaPause, FaTrashAlt, FaEllipsisV, FaCommentDots } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { useSwipeable } from 'react-swipeable'
import { motion, AnimatePresence } from 'framer-motion'
import TimeAgo from 'react-timeago'

// Context hooks (kept as-is so behavior remains unchanged)
import { useStory } from '../Context/StoryContext'
import { useAuth } from '../Context/AuthContext'
import { useMessage } from '../Context/MessageContext'
import { useTranslation } from 'react-i18next'
import { useTranslate } from '../Context/TranslateContext'
import { formatRelativeTime } from '../utils/FormatDataCreatedAt'

/**
 * Redesigned StoryViewer
 * - Keeps all existing logic (viewStory, toggleLove, shareStory, AddNewMessage, etc.)
 * - New layout: image/content area takes full available space; actions live in a separate action rail so they never overlap media/text
 * - Action rail adapts to RTL
 * - Owner-only controls (Delete) shown clearly in action menu
 * - Two display modes for image: 'cover' (fullscreen crop like big platforms) and 'contain' (shows whole image with tasteful gradient fill). Default = 'cover'
 * - Improved accessibility, keyboard controls, and clear separation of interactive areas
 */

const StoryViewer = ({ stories = [], onClose = () => {}, initialFit = 'contain' /* 'cover' | 'contain' */ }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [comment, setComment] = useState('')
  const [fitMode, setFitMode] = useState(initialFit)
  const { viewStory, toggleLove, shareStory, deleteStory } = useStory()
  const { user } = useAuth()
  const { AddNewMessage, setSelectedUser } = useMessage()
  const story = stories[currentIndex] || null
  const timerRef = useRef(null)
  const durationRef = useRef(5000)
  const { t } = useTranslation()
  const { isRTL } = useTranslate()
  const containerRef = useRef(null)
  const textareaRef = useRef(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)

  // When story changes -> mark as viewed + select user
  useEffect(() => {
    if (story?._id) {
      viewStory(story._id)
      setSelectedUser(story?.originalStory ? story.originalStory.owner : story?.owner)
    }
    setProgress(0)
    setIsImageLoaded(false)
  }, [currentIndex, story, viewStory, setSelectedUser])

  // Progress timer
  useEffect(() => {
    if (!story) return
    if (isPaused) {
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
          handleNext()
          return 0
        }
        return next
      })
    }, interval)

    return () => clearInterval(timerRef.current)
  }, [currentIndex, isPaused, story])

  // Keyboard nav
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
      if (e.key === 'Escape') handleClose()
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault()
        setIsPaused(prev => !prev)
      }
      if (e.key === 'm') setShowActionsMenu(prev => !prev)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [currentIndex, isRTL])

  const handleNext = useCallback(() => {
    setProgress(0)
    if (currentIndex < stories.length - 1) setCurrentIndex(idx => idx + 1)
    else handleClose()
  }, [currentIndex, stories.length])

  const handlePrev = useCallback(() => {
    setProgress(0)
    if (currentIndex > 0) setCurrentIndex(idx => idx - 1)
  }, [currentIndex])

  const handlers = useSwipeable({
    onSwipedUp: () => handleClose(),
    onSwipedDown: () => handleClose(),
    onSwipedLeft: isRTL ? handlePrev : handleNext,
    onSwipedRight: isRTL ? handleNext : handlePrev,
    trackMouse: true,
    delta: 40,
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

  const handleDelete = async (e) => {
    e?.stopPropagation()
    if (!story?._id) return
    if (!confirm(t('Are you sure you want to delete this story?'))) return
    try {
      await deleteStory(story._id)
      // After delete, remove from list if parent didn't handle it; we just close
      handleClose()
    } catch (err) {
      console.error('Failed to delete story', err)
    }
  }

  const handleCommentSubmit = async (e) => {
    e?.preventDefault()
    if (!comment.trim()) return
    await AddNewMessage(comment)
    setComment('')
  }

  const togglePause = (e) => {
    if (e?.target?.closest && (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea'))) return
    setIsPaused(prev => !prev)
  }

  const handleTap = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    // thirds behaviour preserved
    if (isRTL) {
      if (clickX < rect.width / 3) handleNext()
      else if (clickX > (rect.width * 2) / 3) handlePrev()
      else togglePause(e)
    } else {
      if (clickX < rect.width / 3) handlePrev()
      else if (clickX > (rect.width * 2) / 3) handleNext()
      else togglePause(e)
    }
  }

  const handleClose = useCallback(() => {
    setIsPaused(true)
    onClose()
  }, [onClose])

  // auto-resize textarea
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

  // Layout: main media + side action rail (keeps actions out of media bounds)
  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 backdrop-blur-sm"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-modal="true"
      role="dialog"
    >
      {/* Close */}
      <button
        onClick={handleClose}
        className={`absolute top-4 ${isRTL ? 'left-4' : 'right-4'} p-2 rounded-full bg-black/40 hover:bg-black/70 transition z-50 shadow-lg`}
        aria-label={t('Close Story')}
      >
        <IoClose className="text-white text-2xl" />
      </button>

      {/* Container: media + actions */}
      <motion.div
        initial={{ scale: 0.98, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.98, opacity: 0 }}
        transition={{ duration: 0.22 }}
        className="relative mx-auto w-[96%] sm:w-[86%] md:w-[78%] lg:w-[72%] h-[86vh] max-h-[980px] rounded-2xl overflow-hidden flex bg-black shadow-2xl"
      >
        {/* Progress bar area (top) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-3xl flex gap-2">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 rounded-full bg-white/15 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 transition-all ease-linear"
                style={{ width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Action Rail (separate column) */}
        <aside className={`hidden md:flex flex-col items-center justify-between py-6 px-3 w-20 bg-black/20 z-30 backdrop-blur-sm ${isRTL ? 'order-2' : 'order-1'}`}>
          {/* Top: avatar & info */}
          <div className="flex flex-col items-center gap-3">
            <Link href={`/Pages/User/${story?.owner?._id || story?.originalStory?.owner?._id}`} className="relative block">
              <Image
                src={story?.originalStory ? story.originalStory.owner?.profilePhoto?.url : story?.owner?.profilePhoto?.url || '/default-profile.png'}
                alt="owner"
                width={56}
                height={56}
                className="w-14 h-14 rounded-full object-cover border-2 border-white/10 shadow-sm"
              />
            </Link>
            <div className="text-white text-xs text-center">
              <div className="font-semibold">{story?.originalStory ? story.originalStory.owner?.username : story?.owner?.username || t('Unknown')}</div>
              <div className="text-gray-300 text-xxs">{formatRelativeTime(story?.createdAt)}</div>
            </div>
          </div>

          {/* Middle: main actions */}
          <div className="flex flex-col items-center gap-3">
            <button onClick={(e) => { e.stopPropagation(); setShowActionsMenu(prev => !prev) }} aria-label={t('Open Actions')} className="p-3 rounded-full bg-white/6 hover:scale-105 transition shadow-md">
              <FaEllipsisV className="text-white text-lg" />
            </button>

            <button onClick={(e) => { e.stopPropagation(); handleLove(e) }} aria-label={t('Like Story')} className="p-3 rounded-full bg-white/6 hover:scale-105 transition shadow-md">
              <FaHeart className={`text-lg ${story?.loves?.some(u => u?._id === user?._id) ? 'text-red-400' : 'text-white'}`} />
            </button>

            <button onClick={(e) => { e.stopPropagation(); handleShare(e) }} aria-label={t('Share Story')} className="p-3 rounded-full bg-white/6 hover:scale-105 transition shadow-md">
              <FaShare className="text-lg text-white" />
            </button>

            <button onClick={(e) => { e.stopPropagation(); setIsPaused(prev => !prev) }} aria-label={t('Pause/Play')} className="p-3 rounded-full bg-white/6 hover:scale-105 transition shadow-md">
              {isPaused ? <FaPlay className="text-white text-lg" /> : <FaPause className="text-white text-lg" />}
            </button>
          </div>

          {/* Bottom: owner stats or delete */}
          <div className="flex flex-col items-center gap-3">
            {user?._id === story?.owner?._id ? (
              <button onClick={handleDelete} aria-label={t('Delete Story')} className="p-3 rounded-full bg-red-600/80 hover:scale-105 transition shadow-md">
                <FaTrashAlt className="text-white text-lg" />
              </button>
            ) : (
              <button onClick={(e) => { e.stopPropagation(); setSelectedUser(story?.owner); /* open message maybe */ }} aria-label={t('Message Owner')} className="p-3 rounded-full bg-white/6 hover:scale-105 transition shadow-md">
                <FaCommentDots className="text-white text-lg" />
              </button>
            )}
          </div>
        </aside>

        {/* Main media column */}
        <main
          {...handlers}
          onPointerDown={() => setIsPaused(true)}
          onPointerUp={() => setIsPaused(false)}
          onClick={handleTap}
          ref={containerRef}
          className={`flex-1 relative flex flex-col ${isRTL ? 'pl-0 pr-0' : 'pl-0 pr-0'} overflow-hidden cursor-pointer`}
        >
          {/* Cinematic background + gradients */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/70 to-black/95" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full blur-3xl bg-gradient-to-r from-indigo-700/30 to-sky-500/20 opacity-80" />
          </div>

          {/* Pause indicator */}
          <AnimatePresence>
            {isPaused && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <div className="p-4 rounded-full bg-white/10 backdrop-blur-sm">
                  {isPaused ? <FaPause className="text-white text-4xl" /> : <FaPlay className="text-white text-4xl" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Media area */}
          <div className="relative flex-1 w-full h-full flex items-center justify-center">
            {/* If fitMode is 'cover' we use object-cover to fill whole area (may crop) — big platforms do this; if 'contain' we show whole image with gradient margin bars */}
            {photoUrl ? (
              <div className="absolute inset-0 w-full h-full">
                {/* placeholder low-opacity backdrop to avoid letterboxing */}
                {fitMode === 'contain' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/70" />
                )}

                <motion.div
                  key={photoUrl + fitMode}
                  initial={{ scale: fitMode === 'cover' ? 1.05 : 1.0 }}
                  animate={{ scale: isPaused ? (fitMode === 'cover' ? 1.05 : 1.0) : (fitMode === 'cover' ? 1.0 : 1.0) }}
                  transition={{ duration: (durationRef.current / 1000) + 0.6, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={photoUrl}
                    alt="story media"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onLoadingComplete={() => setIsImageLoaded(true)}
                    className={`${fitMode === 'cover' ? 'object-cover' : 'object-contain'} w-full h-full`}
                    priority
                  />
                </motion.div>

                {/* Optional text overlay kept separate and never overlapped by actions rail */}
                {story?.text && (
                  <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-11/12 text-center z-30 pointer-events-auto">
                    <p className="text-lg sm:text-xl font-semibold text-white px-5 py-3 bg-black/45 rounded-2xl shadow-xl backdrop-blur-md">
                      {story.text}
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: story?.backgroundColor || '#070707' }}>
                <p className="text-xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-xl px-6">
                  {story?.text}
                </p>
              </div>
            )}
          </div>

          {/* Bottom action area (message input) — positioned inside main column but above end so actions rail never overlaps */}
          {story && story?.owner?._id !== user?._id && (
            <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl z-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <form onSubmit={handleCommentSubmit} className={`flex items-center gap-3 w-full bg-black/30 backdrop-blur-md px-3 py-2 rounded-full border border-white/6`}>
                <textarea
                  ref={textareaRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t('Send a message...')}
                  rows={1}
                  className={`w-full resize-none px-4 py-2 rounded-full bg-transparent text-white text-sm placeholder-gray-300 focus:outline-none`}
                />

                {comment.trim() ? (
                  <button type="submit" className="p-3 rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 hover:scale-105 transition shadow-lg" aria-label={t('Send Message')}>
                    <IoSend className="text-white text-lg" />
                  </button>
                ) : (
                  <div className="flex gap-2 items-center">
                    <button type="button" onClick={handleLove} className="p-3 rounded-full bg-white/6 backdrop-blur-sm hover:scale-110 transition shadow-md" aria-label={t('Like Story')}>
                      <FaHeart className={`text-lg ${story?.loves?.some(u => u?._id === user?._id) ? 'text-red-400' : 'text-white'}`} />
                    </button>

                    <button type="button" onClick={handleShare} className="p-3 rounded-full bg-white/6 backdrop-blur-sm hover:scale-110 transition shadow-md" aria-label={t('Share Story')}>
                      <FaShare className="text-lg text-white" />
                    </button>
                  </div>
                )}
              </form>
            </div>
          )}

        </main>

        {/* Small action menu modal (for mobile / when ellipsis clicked) */}
        <AnimatePresence>
          {showActionsMenu && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.16 }} className={`absolute bottom-6 ${isRTL ? 'left-6' : 'right-6'} z-50 md:hidden`}>
              <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 flex flex-col gap-2 shadow-lg">
                <button onClick={(e) => { e.stopPropagation(); handleLove(e); setShowActionsMenu(false) }} className="px-3 py-2 rounded-md text-white text-sm">{t('Like')}</button>
                <button onClick={(e) => { e.stopPropagation(); handleShare(e); setShowActionsMenu(false) }} className="px-3 py-2 rounded-md text-white text-sm">{t('Share')}</button>
                {user?._id === story?.owner?._id && (
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(e); setShowActionsMenu(false) }} className="px-3 py-2 rounded-md text-red-400 text-sm">{t('Delete')}</button>
                )}
                <button onClick={() => { setFitMode(prev => prev === 'cover' ? 'contain' : 'cover'); setShowActionsMenu(false) }} className="px-3 py-2 rounded-md text-white text-sm">{fitMode === 'cover' ? t('Show full image') : t('Fill screen')}</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  )
}

export default StoryViewer
