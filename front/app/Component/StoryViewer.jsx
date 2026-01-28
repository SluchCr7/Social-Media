'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiXMark,
  HiHeart,
  HiShare,
  HiPlay,
  HiPause,
  HiTrash,
  HiEllipsisVertical,
  HiChatBubbleLeftRight,
  HiEye,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi2';
import Image from 'next/image';
import Link from 'next/link';
import { useSwipeable } from 'react-swipeable';
import { useStory } from '../Context/StoryContext';
import { useAuth } from '../Context/AuthContext';
import { useMessage } from '../Context/MessageContext';
import { useTranslation } from 'react-i18next';
import { useTranslate } from '../Context/TranslateContext';
import { formatRelativeTime } from '../utils/FormatDataCreatedAt';

const StoryViewer = ({ stories = [], onClose = () => { }, initialFit = 'contain' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState('');
  const [fitMode, setFitMode] = useState(initialFit);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { viewStory, toggleLove, shareStory, deleteStory } = useStory();
  const { user } = useAuth();
  const { AddNewMessage, setSelectedUser } = useMessage();
  const { t } = useTranslation();
  const { isRTL } = useTranslate();

  const timerRef = useRef(null);
  const durationRef = useRef(5000);
  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  const story = useMemo(() => stories[currentIndex] || null, [stories, currentIndex]);

  const photoUrl = useMemo(() => {
    if (!story) return null;
    const p = Array.isArray(story?.Photo) ? story.Photo.find(url => url) || null : story?.Photo || null;
    return p;
  }, [story]);

  // Mark story as viewed
  useEffect(() => {
    if (story?._id) {
      viewStory(story._id);
      setSelectedUser(story?.originalStory ? story.originalStory.owner : story?.owner);
    }
    setProgress(0);
    setIsImageLoaded(false);
  }, [currentIndex, story, viewStory, setSelectedUser]);

  // Preload next image
  useEffect(() => {
    const next = stories[currentIndex + 1];
    if (!next) return;
    const url = Array.isArray(next?.Photo) ? next.Photo.find(u => u) : next?.Photo;
    if (url) {
      const img = new window.Image();
      img.src = url;
    }
  }, [currentIndex, stories]);

  // Progress timer
  useEffect(() => {
    if (!story) return;
    let rafId = null;
    let start = null;
    const duration = durationRef.current;

    const step = (timestamp) => {
      if (isPaused) {
        rafId = requestAnimationFrame(step);
        return;
      }
      if (!start) start = timestamp;
      const elapsed = timestamp - start;
      const percent = (elapsed / duration) * 100;
      if (percent >= 100) {
        setProgress(100);
        cancelAnimationFrame(rafId);
        window.requestAnimationFrame(() => {
          setProgress(0);
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(idx => idx + 1);
          } else {
            setIsPaused(true);
            onClose();
          }
        });
        return;
      } else {
        setProgress(percent);
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    timerRef.current = rafId;

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [currentIndex, isPaused, story, stories.length, onClose]);

  const handleNext = useCallback(() => {
    setProgress(0);
    if (currentIndex < stories.length - 1) setCurrentIndex(idx => idx + 1);
    else {
      setIsPaused(true);
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    setProgress(0);
    if (currentIndex > 0) setCurrentIndex(idx => idx - 1);
  }, [currentIndex]);

  const handleLove = useCallback((e) => {
    e?.stopPropagation();
    if (!story?._id) return;
    toggleLove(story._id);
  }, [story, toggleLove]);

  const handleShare = useCallback((e) => {
    e?.stopPropagation();
    if (!story?._id) return;
    shareStory(story._id);
  }, [story, shareStory]);

  const handleDelete = useCallback(async (e) => {
    e?.stopPropagation();
    if (!story?._id) return;
    if (!confirm(t('Are you sure you want to delete this story?'))) return;
    try {
      await deleteStory(story._id);
      setIsPaused(true);
      onClose();
    } catch (err) {
      console.error('Failed to delete story', err);
    }
  }, [story, deleteStory, onClose, t]);

  const handleCommentSubmit = useCallback(async (e) => {
    e?.preventDefault();
    if (!comment.trim()) return;
    await AddNewMessage(comment);
    setComment('');
  }, [comment, AddNewMessage]);

  const togglePause = useCallback((e) => {
    if (e?.target?.closest && (e.target.closest('button') || e.target.closest('input') || e.target.closest('textarea'))) return;
    setIsPaused(prev => !prev);
  }, []);

  const handleTap = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (isRTL) {
      if (clickX < rect.width / 3) handleNext();
      else if (clickX > (rect.width * 2) / 3) handlePrev();
      else togglePause(e);
    } else {
      if (clickX < rect.width / 3) handlePrev();
      else if (clickX > (rect.width * 2) / 3) handleNext();
      else togglePause(e);
    }
  }, [isRTL, handleNext, handlePrev, togglePause]);

  const handleClose = useCallback(() => {
    setIsPaused(true);
    onClose();
  }, [onClose]);

  // Keyboard controls
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'ArrowRight') {
        if (!isRTL) handleNext();
        else handlePrev();
      }
      if (e.key === 'ArrowLeft') {
        if (!isRTL) handlePrev();
        else handleNext();
      }
      if (e.key === 'Escape') handleClose();
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsPaused(prev => !prev);
      }
      if (e.key === 'm') setShowActionsMenu(prev => !prev);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isRTL, handleNext, handlePrev, handleClose]);

  // Auto-resize textarea
  useEffect(() => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const adjust = () => {
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    };
    adjust();
    el.addEventListener('input', adjust);
    return () => el.removeEventListener('input', adjust);
  }, [comment]);

  const handlers = useSwipeable({
    onSwipedUp: () => handleClose(),
    onSwipedDown: () => handleClose(),
    onSwipedLeft: isRTL ? handlePrev : handleNext,
    onSwipedRight: isRTL ? handleNext : handlePrev,
    trackMouse: true,
    delta: 40,
  });

  if (!stories || stories.length === 0) return null;

  const isOwner = user?._id === story?.owner?._id;
  const isLoved = story?.loves?.some(u => u?._id === user?._id);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
      dir={isRTL ? 'rtl' : 'ltr'}
      aria-modal="true"
      role="dialog"
    >
      {/* Ambient Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-indigo-500/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-purple-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Close Button */}
      <button
        onClick={handleClose}
        className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} p-3 rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-xl border border-white/10 transition-all z-50 shadow-2xl hover:scale-110`}
        aria-label={t('Close Story')}
      >
        <HiXMark className="text-white text-2xl" />
      </button>

      {/* Main Container */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative mx-auto w-[96%] sm:w-[90%] md:w-[80%] lg:w-[70%] h-[90vh] max-h-[980px] rounded-[3rem] overflow-hidden flex bg-black shadow-2xl border border-white/10"
      >
        {/* Progress Bars */}
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-3xl flex gap-2">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden backdrop-blur-sm">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all ease-linear"
                style={{ width: idx < currentIndex ? '100%' : idx === currentIndex ? `${Math.min(progress, 100)}%` : '0%' }}
              />
            </div>
          ))}
        </div>

        {/* Side Action Rail */}
        <aside className={`hidden md:flex flex-col items-center justify-between py-8 px-4 w-24 bg-black/30 z-30 backdrop-blur-xl border-r border-white/5 ${isRTL ? 'order-2' : 'order-1'}`}>
          {/* Top: User Info */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
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
                  width={64}
                  height={64}
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-xl"
                />
              </Link>

              {story?.originalStory && story?.originalStory?.owner && (
                <Link
                  href={`/Pages/User/${story.originalStory.owner._id}`}
                  className="absolute -bottom-2 -right-2"
                >
                  <Image
                    src={story.originalStory.owner?.profilePhoto?.url || '/default-profile.png'}
                    alt="original owner"
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full border-2 border-gray-900 shadow-lg"
                  />
                </Link>
              )}
            </div>

            <div className="text-white text-xs text-center">
              <div className="font-black text-sm">
                {story?.owner?.username || t('Unknown')}
              </div>

              {story?.originalStory && story.originalStory.owner?.username && (
                <div className="text-gray-400 text-[9px] mt-1">
                  {t('From')} @{story.originalStory.owner.username}
                </div>
              )}

              <div className="text-gray-400 text-[9px] mt-2 font-bold uppercase tracking-wider">
                {formatRelativeTime(story?.createdAt)}
              </div>
            </div>
          </div>

          {/* Middle: Actions */}
          {isOwner ? (
            <div className="flex flex-col items-center gap-4">
              <button onClick={(e) => { e.stopPropagation(); setShowActionsMenu(prev => !prev); }} aria-label={t('Open Actions')} className="p-3 rounded-xl bg-white/5 hover:scale-110 transition-all shadow-lg">
                <HiEllipsisVertical className="text-white text-xl" />
              </button>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5">
                <HiHeart className="text-xl text-rose-500" />
                <span className="text-white text-xs font-bold">{story?.loves?.length || 0}</span>
              </div>
              <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white/5">
                <HiEye className="text-xl text-emerald-500" />
                <span className="text-white text-xs font-bold">{story?.views?.length || 0}</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4 items-center">
              <button type="button" onClick={handleLove} className="p-3 rounded-xl bg-white/5 backdrop-blur-sm hover:scale-110 transition-all shadow-lg" aria-label={t('Like Story')}>
                <HiHeart className={`text-xl ${isLoved ? 'text-rose-500' : 'text-white'}`} />
              </button>

              <button type="button" onClick={handleShare} className="p-3 rounded-xl bg-white/5 backdrop-blur-sm hover:scale-110 transition-all shadow-lg" aria-label={t('Share Story')}>
                <HiShare className="text-xl text-white" />
              </button>
            </div>
          )}

          {/* Bottom: Controls */}
          <div className="flex flex-col items-center gap-4">
            <button onClick={(e) => { e.stopPropagation(); setIsPaused(prev => !prev); }} aria-label={t('Pause/Play')} className="p-3 rounded-xl bg-white/5 hover:scale-110 transition-all shadow-lg">
              {isPaused ? <HiPlay className="text-white text-xl" /> : <HiPause className="text-white text-xl" />}
            </button>

            {isOwner && (
              <button onClick={handleDelete} aria-label={t('Delete Story')} className="p-3 rounded-xl bg-rose-600/80 hover:scale-110 transition-all shadow-lg">
                <HiTrash className="text-white text-xl" />
              </button>
            )}
          </div>
        </aside>

        {/* Main Media Area */}
        <main
          {...handlers}
          onPointerDown={() => setIsPaused(true)}
          onPointerUp={() => setIsPaused(false)}
          onClick={handleTap}
          ref={containerRef}
          className="flex-1 relative flex flex-col overflow-hidden cursor-pointer group/viewer"
        >
          {/* Background Gradients */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/60 to-black/90" />
          </div>

          {/* Pause Indicator */}
          <AnimatePresence>
            {isPaused && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="absolute inset-0 z-40 flex items-center justify-center pointer-events-none">
                <div className="p-6 rounded-full bg-white/10 backdrop-blur-xl border border-white/20">
                  {isPaused ? <HiPause className="text-white text-5xl" /> : <HiPlay className="text-white text-5xl" />}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Media Content */}
          <div className="relative flex-1 w-full h-full flex items-center justify-center">
            {photoUrl ? (
              <div className="absolute inset-0 w-full h-full">
                {fitMode === 'contain' && (
                  <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/70" />
                )}

                <motion.div
                  key={photoUrl + fitMode}
                  initial={{ opacity: 0, scale: fitMode === 'cover' ? 1.05 : 1.0 }}
                  animate={{ opacity: 1, scale: isPaused ? (fitMode === 'cover' ? 1.05 : 1.0) : (fitMode === 'cover' ? 1.0 : 1.0) }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="absolute inset-0"
                >
                  <Image
                    src={photoUrl}
                    alt="story media"
                    fill
                    sizes="(max-width: 768px) 100vw, 70vw"
                    onLoadingComplete={() => setIsImageLoaded(true)}
                    className={`${fitMode === 'cover' ? 'object-cover' : 'object-contain'} w-full h-full`}
                    priority={currentIndex === 0}
                    placeholder="empty"
                  />
                </motion.div>

                {/* Gradient Overlays */}
                <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                {story?.text && (
                  <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="absolute bottom-12 left-1/2 -translate-x-1/2 w-11/12 text-center z-30 pointer-events-auto"
                  >
                    <p className="text-xl sm:text-2xl font-black text-white px-6 py-4 bg-black/50 rounded-3xl shadow-2xl backdrop-blur-xl border border-white/10 uppercase tracking-tight">
                      {story.text}
                    </p>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: story?.backgroundColor || '#070707' }}>
                <p className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-2xl px-8 uppercase tracking-tight">
                  {story?.text}
                </p>
              </div>
            )}
          </div>

          {/* Navigation Arrows */}
          <div className="hidden md:flex absolute inset-y-0 left-6 items-center z-20 pointer-events-none">
            <button onClick={handlePrev} className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/viewer:opacity-100 transition-all pointer-events-auto hover:bg-white/10 hover:scale-110">
              <HiChevronLeft className="w-8 h-8" />
            </button>
          </div>
          <div className="hidden md:flex absolute inset-y-0 right-6 items-center z-20 pointer-events-none">
            <button onClick={handleNext} className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/viewer:opacity-100 transition-all pointer-events-auto hover:bg-white/10 hover:scale-110">
              <HiChevronRight className="w-8 h-8" />
            </button>
          </div>
        </main>

        {/* Mobile Actions Menu */}
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
  );
};

function MenuActionsComponent({
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
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.2 }}
      className={`absolute bottom-8 ${isRTL ? 'left-8' : 'right-8'} z-50 md:hidden`}
    >
      <div className="bg-black/80 backdrop-blur-2xl rounded-2xl p-4 flex flex-col gap-3 shadow-2xl border border-white/10">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLove(e);
            setShowActionsMenu(false);
          }}
          className="px-6 py-3 rounded-xl text-white text-sm font-bold hover:bg-white/10 transition-all"
        >
          {t('Like')}
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleShare(e);
            setShowActionsMenu(false);
          }}
          className="px-6 py-3 rounded-xl text-white text-sm font-bold hover:bg-white/10 transition-all"
        >
          {t('Share')}
        </button>

        {user?._id === story?.owner?._id && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(e);
              setShowActionsMenu(false);
            }}
            className="px-6 py-3 rounded-xl text-rose-400 text-sm font-bold hover:bg-rose-500/10 transition-all"
          >
            {t('Delete')}
          </button>
        )}

        <button
          onClick={() => {
            setFitMode((prev) => (prev === 'cover' ? 'contain' : 'cover'));
            setShowActionsMenu(false);
          }}
          className="px-6 py-3 rounded-xl text-white text-sm font-bold hover:bg-white/10 transition-all"
        >
          {fitMode === 'cover' ? t('Show full image') : t('Fill screen')}
        </button>
      </div>
    </motion.div>
  );
}

MenuActionsComponent.displayName = 'MenuActions';

const MenuActions = React.memo(MenuActionsComponent);

export default StoryViewer;
