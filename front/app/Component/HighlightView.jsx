'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import clsx from 'clsx';
import { useHighlights } from '@/app/Context/HighlightContext';
import { useTranslate } from '../Context/TranslateContext';


export default function HighlightViewerModal({ highlight, onClose, allStories = [] }) {
  const { isRTL } = useTranslate();
  const { addStoryToHighlight, deleteHighlight } = useHighlights();

  const stories = highlight?.stories || [];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0); // 0..100
  const [isPaused, setIsPaused] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const viewerRef = useRef(null);
  const touchStartX = useRef(null);

  // duration per story in ms (configurable)
  const STORY_DURATION_MS = 7000;

  // helpers
  const getPhoto = useCallback((story) => {
    if (!story) return '/placeholder.jpg';
    return Array.isArray(story.Photo) ? story.Photo[0] : story.Photo;
  }, []);

  // preloaded images for smoother transitions
  const imageCache = useRef(new Map());
  useEffect(() => {
    if (typeof window === 'undefined') return; // تأكد أننا في المتصفح فقط

    stories.forEach((s) => {
      const src = getPhoto(s);
      if (!imageCache.current.has(src)) {
        const img = new window.Image(); // ← استخدم window.Image بدل Image
        img.src = src;
        imageCache.current.set(src, img);
      }
    });
  }, [stories, getPhoto]);


  const availableStories = useMemo(() => {
    const excluded = new Set(stories.map((s) => s._id));
    return allStories.filter((s) => !excluded.has(s._id));
  }, [allStories, stories]);

  const filteredAvailable = availableStories.filter((s) => {
    if (!search) return true;
    const text = (s.text || '').toLowerCase();
    return text.includes(search.toLowerCase());
  });

  // Progress loop using requestAnimationFrame for smoothness
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
        // advance and reset
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

    // start
    lastTimeRef.current = null;
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTimeRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, isPaused, stories.length]);

  // reset progress when currentIndex changes (or stories change)
  useEffect(() => setProgress(0), [currentIndex, stories.length]);

  // keyboard navigation
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRTL, currentIndex, stories.length]);

  const next = useCallback(() => {
    if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
    else onClose();
  }, [currentIndex, stories.length, onClose]);

  const prev = useCallback(() => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  }, [currentIndex]);

  // gestures
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
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        aria-modal
        role="dialog"
      >
        {/* Shell */}
        <div className="w-full max-w-3xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-b from-black/70 to-black/50 flex flex-col">

          {/* Top Bar */}
          <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-white/10">
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
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm"
              >
                <FaPlus /> <span className="hidden sm:inline">Add story</span>
              </button>

              <button
                onClick={() => setConfirmDeleteOpen(true)}
                className="px-3 py-2 rounded-xl bg-transparent border border-red-500/30 text-red-400 text-sm hover:bg-red-500/5"
                title="Delete highlight"
              >
                <FaTrash/>
              </button>

              <button
                onClick={onClose}
                aria-label="Close viewer"
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Content */}
          <div
            ref={viewerRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            className="relative flex-1 bg-black/40 flex items-center justify-center"
          >
            {/* Background blurred large image */}
            <div
              aria-hidden
              className="absolute inset-0 -z-10 blur-3xl opacity-40"
              style={{
                backgroundImage: `url(${currentPhoto})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Story image with subtle card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.99 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.01 }}
                transition={{ duration: 0.45 }}
                className="w-full max-w-2xl mx-auto h-full p-6 flex items-center justify-center"
              >
                <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-[0_10px_60px_rgba(0,0,0,0.6)] bg-black">
                  <Image
                    src={currentPhoto}
                    alt={currentStory?.text || `Story ${currentIndex + 1}`}
                    fill
                    className="object-cover"
                    draggable={false}
                    priority={true}
                  />

                  {/* text overlay */}
                  {currentStory?.text && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.08 }}
                      className="absolute bottom-6 left-6 right-6 bg-gradient-to-t from-black/70 to-transparent rounded-md p-4 text-white text-center sm:text-left"
                    >
                      <p className="text-lg font-semibold leading-tight">{currentStory.text}</p>
                    </motion.div>
                  )}

                  {/* bottom gradient for contrast */}
                  <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

                  {/* left / right invisible click zones (bigger tap targets) */}
                  <button
                    onClick={prev}
                    aria-label="Previous story"
                    className="absolute left-0 top-0 bottom-0 w-[38%] sm:w-1/3 bg-transparent"
                  />
                  <button
                    onClick={next}
                    aria-label="Next story"
                    className="absolute right-0 top-0 bottom-0 w-[38%] sm:w-1/3 bg-transparent"
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Small floating controls: pause, index */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-3">
              <button
                onClick={() => setIsPaused((p) => !p)}
                className="px-3 py-1 rounded-xl bg-white/6 text-white text-sm"
                aria-pressed={isPaused}
              >
                {isPaused ? 'Play' : 'Pause'}
              </button>
              <div className="text-white text-xs opacity-80">{currentIndex + 1} / {stories.length}</div>
            </div>

            {/* Progress segments */}
            <div className="absolute top-4 left-6 right-6 z-50 flex gap-2">
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

          </div>

          {/* Bottom panel: thumbnails + details */}
          <div className="border-t border-white/6 p-3 bg-gradient-to-t from-black/40 to-transparent">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 overflow-x-auto py-1">
                {stories.map((s, i) => (
                  <button
                    key={s._id}
                    onClick={() => setCurrentIndex(i)}
                    className={clsx('flex-none w-20 h-12 rounded-md overflow-hidden border-2', i === currentIndex ? 'border-white/80' : 'border-white/10')}
                    aria-label={`Jump to story ${i + 1}`}
                  >
                    <Image src={getPhoto(s)} alt={s.text || `Story ${i + 1}`} width={160} height={90} className="object-cover" />
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <p className="text-xs text-white/80">{highlight.description || ''}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add story menu */}
        <AnimatePresence>
          {showMenu && (
            <motion.aside
              initial={{ opacity: 0, scale: 0.98, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.2 }}
              className="absolute top-20 left-6 z-60 w-80 rounded-2xl bg-black/80 border border-white/10 shadow-2xl p-4"
              role="dialog"
              aria-label="Add story to highlight"
            >
              <div className="flex items-center gap-2 mb-3">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stories..."
                  className="flex-1 bg-white/5 placeholder:text-white/40 rounded-xl px-3 py-2 text-white text-sm"
                />
                <button onClick={() => setShowMenu(false)} className="px-3 py-2 rounded-lg bg-white/5">Close</button>
              </div>

              <div className="max-h-56 overflow-y-auto space-y-2 custom-scroll">
                {filteredAvailable.length ? (
                  filteredAvailable.map((story) => (
                    <div key={story._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/6">
                      <div className="w-12 h-12 rounded-lg overflow-hidden">
                        <Image src={getPhoto(story)} alt="" width={48} height={48} className="object-cover" />
                      </div>
                      <div className="flex-1 text-white text-sm">
                        <div className="truncate font-medium">{story.text || 'Story'}</div>
                        <div className="text-xs text-white/60">{story.createdAt ? new Date(story.createdAt).toLocaleDateString() : '—'}</div>
                      </div>
                      <div>
                        <button onClick={() => handleAddStory(story._id)} className="px-3 py-1 rounded-lg bg-green-500/10">Add</button>
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

        {/* Confirm delete */}
        <AnimatePresence>
          {confirmDeleteOpen && (
            <motion.div className="absolute inset-0 z-70 flex items-center justify-center">
              <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="w-full max-w-md p-6 rounded-2xl bg-black/90 border border-white/10 shadow-xl">
                <h4 className="text-white text-lg font-semibold mb-2">Delete highlight?</h4>
                <p className="text-sm text-white/80 mb-4">This will permanently delete the highlight and cannot be undone.</p>
                <div className="flex gap-3 justify-end">
                  <button onClick={() => setConfirmDeleteOpen(false)} className="px-3 py-2 rounded-lg bg-white/5">Cancel</button>
                  <button onClick={handleDeleteHighlight} className="px-3 py-2 rounded-lg bg-red-600 text-white">Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </AnimatePresence>
  );
}


// 'use client';
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaTimes, FaPlus } from 'react-icons/fa';
// import Image from 'next/image';
// import { useHighlights } from '@/app/Context/HighlightContext';
// import { useTranslate } from '../Context/TranslateContext';
// import { FaX } from 'react-icons/fa6';

// export default function HighlightViewerModal({ highlight, onClose, allStories = [] }) {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [progress, setProgress] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const [touchStartX, setTouchStartX] = useState(null);
//   const [showMenu, setShowMenu] = useState(false);
//   const stories = highlight?.stories || [];
//   const { isRTL } = useTranslate();
//   const { addStoryToHighlight,deleteHighlight } = useHighlights();
//   const intervalRef = useRef(null);

//   const getPhoto = useCallback((story) => {
//     if (!story) return '/placeholder.jpg';
//     return Array.isArray(story.Photo) ? story.Photo[0] : story.Photo;
//   }, []);

//   const availableStories = allStories.filter(
//     (s) => !stories.some((st) => st._id === s._id)
//   );

//   useEffect(() => {
//     if (!stories.length) return;
//     clearInterval(intervalRef.current);
//     setProgress(0);

//     if (!isPaused) {
//       intervalRef.current = setInterval(() => {
//         setProgress((prev) => {
//           if (prev >= 100) {
//             handleNext();
//             return 0;
//           }
//           return prev + 1.2;
//         });
//       }, 70);
//     }

//     return () => clearInterval(intervalRef.current);
//   }, [currentIndex, isPaused, stories]);

//   const handleNext = () => {
//     if (currentIndex < stories.length - 1) setCurrentIndex((i) => i + 1);
//     else onClose();
//   };

//   const handlePrev = () => {
//     if (currentIndex > 0) setCurrentIndex((i) => i - 1);
//   };

//   const handleTouchStart = (e) => setTouchStartX(e.touches[0].clientX);
//   const handleTouchEnd = (e) => {
//     const diff = e.changedTouches[0].clientX - touchStartX;
//     if (diff > 60) (isRTL ? handleNext() : handlePrev());
//     if (diff < -60) (isRTL ? handlePrev() : handleNext());
//   };

//   const handleAddStory = async (storyId) => {
//     await addStoryToHighlight(highlight._id, storyId);
//     setShowMenu(false);
//   };

//   if (!highlight) return null;
//   const currentStory = stories[currentIndex];
//   const currentPhoto = getPhoto(currentStory);

//   return (
//     <AnimatePresence>
//       <motion.div
//         className={`fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md ${
//           isRTL ? 'direction-rtl' : 'direction-ltr'
//         }`}
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         exit={{ opacity: 0 }}
//         dir={isRTL ? 'rtl' : 'ltr'}
//       >
//         {/* ❌ زر الإغلاق */}
//         <button
//           onClick={onClose}
//           className={`absolute top-5 ${
//             isRTL ? 'left-5' : 'right-5'
//           } text-white hover:opacity-80 z-[110]`}
//         >
//           <FaTimes size={22} />
//         </button>

//         {/* ➕ زر الإضافة */}
//         <button
//           onClick={() => setShowMenu((p) => !p)}
//           className={`absolute top-5 ${
//             isRTL ? 'right-5' : 'left-5'
//           } text-white hover:text-green-400 transition z-[110]`}
//           title="Add Story"
//         >
//           <FaPlus size={22} />
//         </button>
//         <button
//           onClick={() => deleteHighlight(highlight._id)}
//           className={`absolute top-5 ${
//             isRTL ? 'right-5' : 'left-5'
//           } text-white hover:text-green-400 transition z-[110]`}
//           title="Delete Highlight"
//         >
//           <FaX size={22} />
//         </button>

//         {/* 🧭 قائمة الـ Stories المتاحة */}
//         <AnimatePresence>
//           {showMenu && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               transition={{ duration: 0.3 }}
//               className={`absolute top-16 ${
//                 isRTL ? 'right-5' : 'left-5'
//               } bg-black/70 backdrop-blur-xl rounded-2xl p-4 z-[120] w-72 shadow-2xl border border-white/10`}
//             >
//               <h4 className="text-white text-sm font-semibold mb-3 flex items-center justify-between">
//                 Choose Story
//                 <button
//                   onClick={() => setShowMenu(false)}
//                   className="text-xs text-gray-300 hover:text-white"
//                 >
//                   Close
//                 </button>
//               </h4>

//               <div className="max-h-64 overflow-y-auto space-y-2 custom-scroll">
//                 {availableStories.length ? (
//                   availableStories.map((story) => (
//                     <motion.button
//                       key={story._id}
//                       onClick={() => handleAddStory(story._id)}
//                       whileHover={{ scale: 1.03 }}
//                       className="flex items-center gap-3 w-full bg-white/10 hover:bg-white/20 text-white rounded-xl p-2 transition"
//                     >
//                       <div className="relative w-12 h-12 rounded-lg overflow-hidden">
//                         <Image
//                           src={getPhoto(story)}
//                           alt=""
//                           fill
//                           className="object-cover"
//                         />
//                       </div>
//                       <div
//                         className={`flex-1 ${
//                           isRTL ? 'text-right' : 'text-left'
//                         }`}
//                       >
//                         <p className="text-sm font-medium truncate">
//                           {story.text || 'Story'}
//                         </p>
//                         <p className="text-xs text-gray-300 truncate">
//                           {story.createdAt
//                             ? new Date(story.createdAt).toLocaleDateString()
//                             : '—'}
//                         </p>
//                       </div>
//                     </motion.button>
//                   ))
//                 ) : (
//                   <p className="text-gray-300 text-xs text-center py-3">
//                     No Stories found to add
//                   </p>
//                 )}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* 🌄 الخلفية الديناميكية */}
//         <motion.div
//           key={currentIndex}
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 0.35 }}
//           exit={{ opacity: 0 }}
//           transition={{ duration: 0.6 }}
//           className="absolute inset-0 -z-10 blur-3xl"
//           style={{
//             backgroundImage: `url(${currentPhoto})`,
//             backgroundSize: 'cover',
//             backgroundPosition: 'center',
//           }}
//         />

//         {/* 🖼️ Story Container */}
//         <div
//           className="relative w-full max-w-sm h-[80vh] flex flex-col items-center justify-center select-none"
//           onMouseDown={() => setIsPaused(true)}
//           onMouseUp={() => setIsPaused(false)}
//           onTouchStart={handleTouchStart}
//           onTouchEnd={handleTouchEnd}
//         >
//           {/* ⏳ Progress Bar */}
//           <div
//             className={`absolute top-3 left-0 right-0 flex gap-1 px-4 z-30 ${
//               isRTL ? 'flex-row-reverse' : ''
//             }`}
//           >
//             {stories.map((_, idx) => (
//               <div key={idx} className="flex-1 bg-white/25 h-1 rounded-full overflow-hidden">
//                 <motion.div
//                   className="h-full bg-white"
//                   animate={{
//                     width:
//                       idx < currentIndex
//                         ? '100%'
//                         : idx === currentIndex
//                         ? `${progress}%`
//                         : '0%',
//                   }}
//                   transition={{ ease: 'linear', duration: 0.1 }}
//                 />
//               </div>
//             ))}
//           </div>

//           {/* 🧾 Header */}
//           <div
//             className={`absolute top-8 ${
//               isRTL ? 'right-4 flex-row-reverse' : 'left-4'
//             } flex items-center gap-3 z-30`}
//           >
//             <div className="w-9 h-9 rounded-full overflow-hidden border border-white/40 shadow-md">
//               <Image
//                 src={highlight.coverImage || '/placeholder.jpg'}
//                 alt="Highlight cover"
//                 width={36}
//                 height={36}
//                 className="object-cover"
//               />
//             </div>
//             <div className="text-white">
//               <h3
//                 className={`text-sm font-semibold leading-none ${
//                   isRTL ? 'text-right' : 'text-left'
//                 }`}
//               >
//                 {highlight.title}
//               </h3>
//               <p className="text-xs opacity-70 pt-1">
//                 {currentIndex + 1}/{stories.length}
//               </p>
//             </div>
//           </div>

//           {/* 🖼️ الصورة */}
//           <AnimatePresence mode="wait">
//             <motion.div
//               key={currentIndex}
//               initial={{ opacity: 0, scale: 1.03 }}
//               animate={{ opacity: 1, scale: 1 }}
//               exit={{ opacity: 0, scale: 1.03 }}
//               transition={{ duration: 0.6, ease: 'easeOut' }}
//               className="w-full h-full flex items-center justify-center"
//             >
//               <div className="relative w-full h-full rounded-xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.6)]">
//                 <Image
//                   src={currentPhoto}
//                   alt={`Story ${currentIndex + 1}`}
//                   fill
//                   className="object-cover"
//                   draggable={false}
//                 />

//                 {/* 📝 النص إن وُجد */}
//                 {currentStory?.text && (
//                   <motion.div
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
//                     className={`absolute bottom-8 left-0 right-0 px-5 text-center z-20 ${
//                       isRTL ? 'text-right' : 'text-center'
//                     }`}
//                   >
//                     <p className="text-white text-lg font-medium drop-shadow-md leading-snug">
//                       {currentStory.text}
//                     </p>
//                   </motion.div>
//                 )}

//                 {/* 🌈 تدرج سفلي ناعم */}
//                 <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
//               </div>
//             </motion.div>
//           </AnimatePresence>

//           {/* 🖐️ مناطق التنقل */}
//           <div
//             className={`absolute inset-0 flex ${
//               isRTL ? 'flex-row-reverse' : ''
//             } justify-between items-center z-40`}
//           >
//             <div onClick={handlePrev} className="w-1/3 h-full cursor-pointer" />
//             <div onClick={handleNext} className="w-1/3 h-full cursor-pointer ml-auto" />
//           </div>
//         </div>
//       </motion.div>
//     </AnimatePresence>
//   );
// }
