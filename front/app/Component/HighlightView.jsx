'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import clsx from 'clsx';
import { useHighlights } from '@/app/Context/HighlightContext';
import { useTranslate } from '../Context/TranslateContext';

export default function HighlightViewerModal({ highlight, onClose, allStories = [] }) {
  const { isRTL } = useTranslate();
  const { addStoryToHighlight, deleteHighlight } = useHighlights();

  const stories = highlight?.stories || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const viewerRef = useRef(null);
  const touchStartX = useRef(null);

  const STORY_DURATION_MS = 7000;

  // ✅ Helper: get photo url
  const getPhoto = useCallback((story) => {
    if (!story) return '/placeholder.jpg';
    return Array.isArray(story.Photo) ? story.Photo[0] : story.Photo;
  }, []);

  // ✅ Preload images
  const imageCache = useRef(new Map());
  useEffect(() => {
    if (typeof window === 'undefined') return;
    stories.forEach((s) => {
      const src = getPhoto(s);
      if (!imageCache.current.has(src)) {
        const img = new window.Image();
        img.src = src;
        imageCache.current.set(src, img);
      }
    });
  }, [stories, getPhoto]);

  // ✅ Filter available stories
  const availableStories = useMemo(() => {
    const excluded = new Set(stories.map((s) => s._id));
    return allStories.filter((s) => !excluded.has(s._id));
  }, [allStories, stories]);

  const filteredAvailable = availableStories.filter((s) => {
    if (!search) return true;
    const text = (s.text || '').toLowerCase();
    return text.includes(search.toLowerCase());
  });

  // ✅ Progress loop
  useEffect(() => {
    if (!stories.length) return;

    const tick = (now) => {
      if (isPaused) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }

      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const elapsed = now - lastTimeRef.current;
      const percent = Math.min(100, (elapsed / STORY_DURATION_MS) * 100 + (progress || 0));

      setProgress(percent);

      if (percent >= 100) {
        if (currentIndex < stories.length - 1) {
          setCurrentIndex((i) => i + 1);
          setProgress(0);
          lastTimeRef.current = now;
        } else {
          onClose();
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    lastTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
  }, [currentIndex, isPaused, stories.length]);

  useEffect(() => setProgress(0), [currentIndex, stories.length]);

  // ✅ Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') return isRTL ? prev() : next();
      if (e.key === 'ArrowLeft') return isRTL ? next() : prev();
      if (e.key === 'Escape') return onClose();
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        setIsPaused((p) => !p);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRTL, currentIndex, stories.length]);

  const next = useCallback(() => {
    if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
    else onClose();
  }, [currentIndex, stories.length, onClose]);

  const prev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  // ✅ Gestures
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches?.[0]?.clientX ?? null;
    setIsPaused(true);
  };
  const handleTouchEnd = (e) => {
    const endX = e.changedTouches?.[0]?.clientX ?? null;
    if (touchStartX.current == null || endX == null) return setIsPaused(false);
    const diff = endX - touchStartX.current;
    if (diff > 60) (isRTL ? next() : prev());
    if (diff < -60) (isRTL ? prev() : next());
    touchStartX.current = null;
    setIsPaused(false);
  };

  const handleMouseDown = () => setIsPaused(true);
  const handleMouseUp = () => setIsPaused(false);

  const handleAddStory = async (storyId) => {
    await addStoryToHighlight(highlight._id, storyId);
    setShowMenu(false);
  };

  const handleDeleteHighlight = async () => {
    await deleteHighlight(highlight._id);
    setConfirmDeleteOpen(false);
    onClose();
  };

  if (!highlight) return null;

  const currentStory = stories[currentIndex];
  const currentPhoto = getPhoto(currentStory);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-modal
        role="dialog"
      >
        {/* Shell */}
        <div className="w-full max-w-4xl h-[90vh] rounded-3xl overflow-hidden shadow-[0_10px_70px_rgba(0,0,0,0.8)] bg-black/60 flex flex-col border border-white/10 backdrop-blur-xl">

          {/* ✅ Top Bar */}
          <div className="flex items-center justify-between gap-3 px-5 py-3 bg-black/40 border-b border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full overflow-hidden border border-white/20">
                <Image
                  src={highlight.coverImage || '/placeholder.jpg'}
                  width={44}
                  height={44}
                  alt="Highlight cover"
                  className="object-cover"
                />
              </div>
              <div className="text-white">
                <h3 className="text-sm font-semibold">{highlight.title}</h3>
                <p className="text-xs opacity-70">{currentIndex + 1}/{stories.length}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowMenu((p) => !p)}
                aria-expanded={showMenu}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition"
              >
                <FaPlus /> <span className="hidden sm:inline">Add story</span>
              </button>

              <button
                onClick={() => setConfirmDeleteOpen(true)}
                className="px-3 py-2 rounded-xl bg-transparent border border-red-500/40 text-red-400 text-sm hover:bg-red-500/10 transition"
                title="Delete highlight"
              >
                <FaTrash />
              </button>

              <button
                onClick={onClose}
                aria-label="Close viewer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* ✅ Main Content */}
          <div
            ref={viewerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 flex items-center justify-center bg-black"
          >
            {/* Background blurred */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 blur-3xl opacity-30"
              style={{
                backgroundImage: `url(${currentPhoto})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* ✅ Image Container */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                className="relative w-full h-full flex items-center justify-center overflow-hidden"
              >
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  {/* ✅ Full-fit image with shadow */}
                  <div className="relative max-h-full max-w-full flex items-center justify-center">
                    <Image
                      src={currentPhoto}
                      alt={currentStory?.text || `Story ${currentIndex + 1}`}
                      fill
                      className="object-contain select-none transition-all duration-500 ease-in-out"
                      priority={true}
                    />
                  </div>

                  {/* ✅ Text Overlay */}
                  {currentStory?.text && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                      className="absolute bottom-10 left-6 right-6 sm:left-10 sm:right-10 bg-gradient-to-t from-black/80 to-transparent rounded-xl p-5 text-white text-center sm:text-left shadow-[0_0_25px_rgba(0,0,0,0.6)]"
                    >
                      <p className="text-lg sm:text-xl font-semibold leading-snug break-words whitespace-pre-wrap">
                        {currentStory.text}
                      </p>
                    </motion.div>
                  )}

                  {/* ✅ Bottom gradient */}
                  <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/90 to-transparent pointer-events-none" />

                  {/* ✅ Click zones */}
                  <button
                    onClick={prev}
                    aria-label="Previous story"
                    className="absolute left-0 top-0 bottom-0 w-[40%] bg-transparent"
                  />
                  <button
                    onClick={next}
                    aria-label="Next story"
                    className="absolute right-0 top-0 bottom-0 w-[40%] bg-transparent"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* ✅ Progress Bar */}
            <div className="absolute top-5 left-6 right-6 z-50 flex gap-2">
              {stories.map((_, idx) => (
                <div key={idx} className="flex-1 h-1 rounded-md bg-white/20 overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    style={{ width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' }}
                    transition={{ ease: 'linear', duration: 0.1 }}
                  />
                </div>
              ))}
            </div>

            {/* ✅ Floating controls */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="px-4 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition"
                aria-pressed={isPaused}
              >
                {isPaused ? '▶ Play' : '❚❚ Pause'}
              </button>
              <div className="text-white text-xs opacity-70">{currentIndex + 1} / {stories.length}</div>
            </div>
          </div>

          {/* ✅ Bottom thumbnails */}
          <div className="border-t border-white/10 p-3 bg-black/40 backdrop-blur-md">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {stories.map((s, i) => (
                  <button
                    key={s._id}
                    onClick={() => setCurrentIndex(i)}
                    className={clsx(
                      'flex-none w-20 h-12 rounded-md overflow-hidden border transition',
                      i === currentIndex ? 'border-white/90 shadow-md' : 'border-white/10 opacity-80 hover:opacity-100'
                    )}
                    aria-label={`Jump to story ${i + 1}`}
                  >
                    <Image src={getPhoto(s)} alt={s.text || `Story ${i + 1}`} width={160} height={90} className="object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs text-white/70">{highlight.description || ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Add story menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.aside
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute top-24 left-6 z-60 w-80 rounded-2xl bg-black/85 border border-white/10 shadow-2xl p-4 backdrop-blur-md"
              role="dialog"
              aria-label="Add story to highlight"
            >
              <div className="flex items-center gap-2 mb-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stories..."
                  className="flex-1 bg-white/5 placeholder:text-white/40 rounded-xl px-3 py-2 text-white text-sm outline-none focus:ring-1 focus:ring-white/30"
                />
                <button onClick={() => setShowMenu(false)} className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm">Close</button>
              </div>

              <div className="max-h-60 overflow-y-auto space-y-2 custom-scroll">
                {filteredAvailable.length ? (
                  filteredAvailable.map((story) => (
                    <div key={story._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/10 transition">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <Image src={getPhoto(story)} alt="" width={48} height={48} className="object-cover" />
                      </div>
                      <div className="flex-1 text-white text-sm">
                        <div className="truncate font-medium">{story.text || 'Story'}</div>
                        <div className="text-xs text-white/60">{story.createdAt ? new Date(story.createdAt).toLocaleDateString() : '—'}</div>
                      </div>
                      <div>
                        <button onClick={() => handleAddStory(story._id)} className="px-3 py-1 rounded-lg bg-green-500/20 hover:bg-green-500/40 text-green-200 text-sm transition">Add</button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-white/60 text-center py-6">No stories available</p>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ✅ Confirm delete */}
        <AnimatePresence>
          {confirmDeleteOpen && (
            <motion.div className="absolute inset-0 z-70 flex items-center justify-center bg-black/70 backdrop-blur-sm">
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="w-full max-w-md p-6 rounded-2xl bg-black/90 border border-white/10 shadow-2xl backdrop-blur-md"
              >
                <h4 className="text-white text-lg font-semibold mb-2">Delete highlight?</h4>
                <p className="text-sm text-white/80 mb-4">This will permanently delete the highlight and cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setConfirmDeleteOpen(false)} className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition">Cancel</button>
                  <button onClick={handleDeleteHighlight} className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm transition">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </AnimatePresence>
  );
}
