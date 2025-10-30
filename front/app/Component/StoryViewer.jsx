'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { IoClose, IoSend } from 'react-icons/io5'
import { FaHeart, FaShare, FaPlay, FaPause, FaTrashAlt, FaEllipsisV, FaCommentDots } from 'react-icons/fa'
import Image from 'next/image'
import Link from 'next/link'
import { useSwipeable } from 'react-swipeable'
import { motion, AnimatePresence } from 'framer-motion'
import TimeAgo from 'react-timeago'
import { FaEye } from "react-icons/fa";
// Context hooks (kept as-is so behavior remains unchanged)
import { useStory } from '../Context/StoryContext'
import { useAuth } from '../Context/AuthContext'
import { useMessage } from '../Context/MessageContext'
import { useTranslation } from 'react-i18next'
import { useTranslate } from '../Context/TranslateContext'
import { formatRelativeTime } from '../utils/FormatDataCreatedAt'


const StoryViewer = ({ stories = [], onClose = () => {}, initialFit = 'contain' /* 'cover' | 'contain' */ }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [comment, setComment] = useState('')
  const [fitMode, setFitMode] = useState(initialFit)
  const { viewStory, toggleLove, shareStory, deleteStory } = useStory()
  const { user } = useAuth()
  const { AddNewMessage, setSelectedUser } = useMessage()
  const timerRef = useRef(null) // will hold raf id
  const durationRef = useRef(5000)
  const { t } = useTranslation()
  const { isRTL } = useTranslate()
  const containerRef = useRef(null)
  const textareaRef = useRef(null)
  const [isImageLoaded, setIsImageLoaded] = useState(false)
  const [showActionsMenu, setShowActionsMenu] = useState(false)

  // memoize current story and photoUrl so they don't recreate every render
  const story = useMemo(() => stories[currentIndex] || null, [stories, currentIndex])

  const photoUrl = useMemo(() => {
    if (!story) return null
    const p = Array.isArray(story?.Photo) ? story.Photo.find(url => url) || null : story?.Photo || null
    return p
  }, [story])

  // When story changes -> mark as viewed + select user
  useEffect(() => {
    if (story?._id) {
      viewStory(story._id)
      setSelectedUser(story?.originalStory ? story.originalStory.owner : story?.owner)
    }
    setProgress(0)
    setIsImageLoaded(false)
  }, [currentIndex, story, viewStory, setSelectedUser])

  // Preload next image for smooth transition
  useEffect(() => {
    const next = stories[currentIndex + 1]
    if (!next) return
    const url = Array.isArray(next?.Photo) ? next.Photo.find(u => u) : next?.Photo
    if (url) {
      const img = new window.Image()
      img.src = url
    }
  }, [currentIndex, stories])

  // Progress timer using requestAnimationFrame (more efficient than setInterval)
  useEffect(() => {
    if (!story) return
    let rafId = null
    let start = null
    const duration = durationRef.current

    const step = (timestamp) => {
      if (isPaused) {
        // keep paused state; don't advance. schedule next check in RAF to respond quickly when resumed.
        rafId = requestAnimationFrame(step)
        return
      }
      if (!start) start = timestamp
      const elapsed = timestamp - start
      const percent = (elapsed / duration) * 100
      if (percent >= 100) {
        // advance to next story
        setProgress(100)
        // small timeout to let UI show full bar, then advance
        // using requestAnimationFrame recursion so no setTimeout needed; we will call handleNext synchronously after cancel.
        cancelAnimationFrame(rafId)
        // call next on next tick to avoid messing with RAF stack.
        window.requestAnimationFrame(() => {
          // note: using callback setter to ensure latest state
          setProgress(0)
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(idx => idx + 1)
          } else {
            // close when at the end
            setIsPaused(true)
            onClose()
          }
        })
        return
      } else {
        setProgress(percent)
        rafId = requestAnimationFrame(step)
      }
    }

    rafId = requestAnimationFrame(step)
    timerRef.current = rafId

    return () => {
      if (rafId) cancelAnimationFrame(rafId)
    }
    // we intentionally include isPaused and story here so it restarts correctly
  }, [currentIndex, isPaused, story, stories.length, onClose])

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
  }, [isRTL]) // handlers below are stable via useCallback

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

  // Handlers - memoized to avoid re-creating on each render
  const handleNext = useCallback(() => {
    setProgress(0)
    if (currentIndex < stories.length - 1) setCurrentIndex(idx => idx + 1)
    else {
      setIsPaused(true)
      onClose()
    }
  }, [currentIndex, stories.length, onClose])

  const handlePrev = useCallback(() => {
    setProgress(0)
    if (currentIndex > 0) setCurrentIndex(idx => idx - 1)
  }, [currentIndex])

  const handleLove = useCallback((e) => {
    e?.stopPropagation()
    if (!story?._id) return
    toggleLove(story._id)
  }, [story, toggleLove])

  const handleShare = useCallback((e) => {
    e?.stopPropagation()
    if (!story?._id) return
    shareStory(story._id)
  }, [story, shareStory])

  const handleDelete = useCallback(async (e) => {
    e?.stopPropagation()
    if (!story?._id) return
    if (!confirm(t('Are you sure you want to delete this story?'))) return
    try {
      await deleteStory(story._id)
      // After delete, remove from list if parent didn't handle it; we just close
      setIsPaused(true)
      onClose()
    } catch (err) {
      console.error('Failed to delete story', err)
    }
  }, [story, deleteStory, onClose, t])

  const handleCommentSubmit = useCallback(async (e) => {
    e?.preventDefault()
    if (!comment.trim()) return
    await AddNewMessage(comment)
    setComment('')
  }, [comment, AddNewMessage])

  const togglePause = useCallback((e) => {
    if (e?.target?.closest && (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea'))) return
    setIsPaused(prev => !prev)
  }, [])

  const handleTap = useCallback((e) => {
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
  }, [isRTL, handleNext, handlePrev, togglePause])

  const handleClose = useCallback(() => {
    setIsPaused(true)
    onClose()
  }, [onClose])

  const handlers = useSwipeable({
    onSwipedUp: () => handleClose(),
    onSwipedDown: () => handleClose(),
    onSwipedLeft: isRTL ? handlePrev : handleNext,
    onSwipedRight: isRTL ? handleNext : handlePrev,
    trackMouse: true,
    delta: 40,
  })

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
                style={{ width: idx < currentIndex ? '100%' : idx === currentIndex ? `${Math.min(progress, 100)}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Action Rail (separate column) */}
        <aside className={`hidden md:flex flex-col items-center justify-between py-6 px-3 w-20 bg-black/20 z-30 backdrop-blur-sm ${isRTL ? 'order-2' : 'order-1'}`}>
          {/* Top: avatar & info */}
          <div className="flex flex-col items-center gap-3">
            <div className="relative">
              {/* صورة صاحب القصة أو الذي أعاد النشر */}
              <Link
                href={`/Pages/User/${story?.owner?._id || story?.originalStory?.owner?._id}`}
                className="relative block"
              >
                <Image
                  src={
                    story?.owner?.profilePhoto?.url ||
                    story?.originalStory?.owner?.profilePhoto?.url ||
                    '/default-profile.png'
                  }
                  alt="owner"
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover border-2 border-white/10 shadow-sm"
                />
              </Link>

              {/* صورة صاحب القصة الأصلية (مصغّرة) */}
              {story?.originalStory && story?.originalStory?.owner && (
                <Link
                  href={`/Pages/User/${story.originalStory.owner._id}`}
                  className="absolute -bottom-1 -right-1"
                >
                  <Image
                    src={story.originalStory.owner?.profilePhoto?.url || '/default-profile.png'}
                    alt="original owner"
                    width={22}
                    height={22}
                    className="w-5 h-5 rounded-full border-2 border-gray-900 shadow-md"
                  />
                </Link>
              )}
            </div>

            <div className="text-white text-xs text-center">
              {/* اسم صاحب القصة الحالية */}
              <div className="font-semibold">
                {story?.owner?.username || t('Unknown')}
              </div>

              {/* إذا كانت قصة معاد نشرها، أظهر صاحب القصة الأصلية تحته */}
              {story?.originalStory && story.originalStory.owner?.username && (
                <div className="text-gray-400 text-[10px] mt-0.5">
                  {t('From')} @{story.originalStory.owner.username}
                </div>
              )}

              {/* وقت النشر */}
              <div className="text-gray-300 text-xxs">
                {formatRelativeTime(story?.createdAt)}
              </div>
            </div>
          </div>

          {
            user?._id === story?.owner?._id ? (
              <div className="flex flex-col items-center gap-3">
                <button onClick={(e) => { e.stopPropagation(); setShowActionsMenu(prev => !prev) }} aria-label={t('Open Actions')} className="p-3 rounded-full bg-white/6 hover:scale-105 transition shadow-md">
                  <FaEllipsisV className="text-white text-lg" />
                </button>
                <div aria-label={t('Like Story')} className="p-3 rounded-full bg-white/6 hover:scale-105 transition shadow-md flex flex-col items-center gap-1">
                  <FaHeart className={`text-lg text-red-500`} />
                  <span className="text-white text-sm">{story?.loves?.length}</span>
                </div>
                <div aria-label={t('View Story')} className="p-3 rounded-full bg-white/6 hover:scale-105 transition shadow-md flex flex-col items-center gap-1">
                  <FaEye className={`text-lg text-green-500`} />
                  <span className="text-white text-sm">{story?.views?.length}</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3 items-center">
                <button type="button" onClick={handleLove} className="p-3 rounded-full bg-white/6 backdrop-blur-sm hover:scale-110 transition shadow-md" aria-label={t('Like Story')}>
                  <FaHeart className={`text-lg ${story?.loves?.some(u => u?._id === user?._id) ? 'text-red-400' : 'text-white'}`} />
                </button>

                <button type="button" onClick={handleShare} className="p-3 rounded-full bg-white/6 backdrop-blur-sm hover:scale-110 transition shadow-md" aria-label={t('Share Story')}>
                  <FaShare className="text-lg text-white" />
                </button>
              </div>
            )}
          <button onClick={(e) => { e.stopPropagation(); setIsPaused(prev => !prev) }} aria-label={t('Pause/Play')} className="p-3 rounded-full bg-white/6 hover:scale-105 transition shadow-md">
            {isPaused ? <FaPlay className="text-white text-lg" /> : <FaPause className="text-white text-lg" />}
          </button>
          {/* Bottom: owner stats or delete */}
          <div className="flex flex-col items-center gap-3">
            {user?._id === story?.owner?._id && (
              <button onClick={handleDelete} aria-label={t('Delete Story')} className="p-3 rounded-full bg-red-600/80 hover:scale-105 transition shadow-md">
                <FaTrashAlt className="text-white text-lg" />
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
                  initial={{ opacity: 0, scale: fitMode === 'cover' ? 1.05 : 1.0 }}
                  animate={{ opacity: 1, scale: isPaused ? (fitMode === 'cover' ? 1.05 : 1.0) : (fitMode === 'cover' ? 1.0 : 1.0) }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: (durationRef.current / 1000) + 0.35, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={photoUrl}
                    alt="story media"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onLoadingComplete={() => setIsImageLoaded(true)}
                    className={`${fitMode === 'cover' ? 'object-cover' : 'object-contain'} w-full h-full`}
                    priority={currentIndex === 0}
                    // if you have a small blurred placeholder you can set it here; fallback harmless
                    placeholder={photoUrl ? 'empty' : undefined}
                  />
                </motion.div>

                {/* Optional text overlay kept separate and never overlapped by actions rail */}
                {story?.text && (
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-11/12 text-center z-30 pointer-events-auto">
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
        </main>

        {/* Small action menu modal (for mobile / when ellipsis clicked) */}
        <AnimatePresence>
          {showActionsMenu && (
            <MenuActions
              user={user}
              story={story}
              setShowActionsMenu={setShowActionsMenu}
              handleLove={handleLove}
              handleShare={handleShare}
              handleDelete={handleDelete}
              fitMode={fitMode}
              setFitMode={setFitMode}
              t={t}
              isRTL={isRTL}
            />
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  )
}

/**
 * MenuActions component separated and memoized to avoid re-renders.
 * Kept behavior identical to your original `menuActions` function.
 */
const MenuActions = React.memo(({
  user,
  story,
  setShowActionsMenu,
  handleLove,
  handleShare,
  handleDelete,
  fitMode,
  setFitMode,
  t,
  isRTL
}) => {
  return (
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
  )
})

export default StoryViewer
