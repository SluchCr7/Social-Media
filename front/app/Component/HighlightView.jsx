'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiXMark,
  HiPlus,
  HiTrash,
  HiChevronLeft,
  HiChevronRight,
  HiPause,
  HiPlay,
  HiSignal,
  HiCalendarDays,
  HiCommandLine,
  HiSparkles,
  HiEye,
  HiHeart
} from 'react-icons/hi2';
import Image from 'next/image';
import { useHighlights } from '@/app/Context/HighlightContext';
import { useTranslate } from '../Context/TranslateContext';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import { useAuth } from '../Context/AuthContext';

const HighlightViewerModal = memo(function HighlightViewerModal({
  highlight,
  onClose,
  allStories = [],
}) {
  const { isRTL } = useTranslate();
  const { addStoryToHighlight, deleteHighlight, updateHighlight, removeStoryFromHighlight } = useHighlights();
  const { user } = useAuth();
  const { t } = useTranslation();

  const stories = useMemo(() => highlight?.archivedStories || [], [highlight]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit State
  const [editTitle, setEditTitle] = useState(highlight?.title || '');
  const [editCover, setEditCover] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const STORY_DURATION_MS = 6000;

  // Cleanup preview
  useEffect(() => {
    return () => {
      if (editPreview) URL.revokeObjectURL(editPreview);
    };
  }, [editPreview]);

  const isOwner = user?._id === highlight?.user;

  const getPhoto = useCallback((story) => {
    if (!story) return '/placeholder.jpg';

    if (story.Photo) {
      if (Array.isArray(story.Photo) && story.Photo.length > 0) {
        return story.Photo[0];
      }
      if (typeof story.Photo === 'string') {
        return story.Photo;
      }
    }

    if (story.photo) {
      if (Array.isArray(story.photo) && story.photo.length > 0) {
        return story.photo[0];
      }
      if (typeof story.photo === 'string') {
        return story.photo;
      }
    }

    return '/placeholder.jpg';
  }, []);

  const next = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const prev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isEditing) return;

    const tick = (now) => {
      if (isPaused) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const elapsed = now - lastTimeRef.current;

      setProgress(prev => {
        const nextVal = prev + (elapsed / STORY_DURATION_MS) * 100;
        if (nextVal >= 100) return 100;
        return nextVal;
      });

      lastTimeRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isPaused, isEditing]);

  useEffect(() => {
    if (progress >= 100 && !isEditing) {
      next();
    }
  }, [progress, next, isEditing]);

  // Keyboard controls
  useEffect(() => {
    if (isEditing) return;

    const handler = (e) => {
      if (e.key === 'ArrowRight') isRTL ? prev() : next();
      if (e.key === 'ArrowLeft') isRTL ? next() : prev();
      if (e.key === 'Escape') onClose();
      if (e.key === ' ') setIsPaused(p => !p);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRTL, next, prev, onClose, isEditing]);

  const handleUpdate = async () => {
    await updateHighlight(highlight._id, { title: editTitle, image: editCover });
    setIsEditing(false);
  };

  const currentStory = stories[currentIndex];
  const currentPhoto = getPhoto(currentStory);

  if (!highlight) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/98 backdrop-blur-3xl overflow-hidden"
      >
        {/* Ambient Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 blur-[150px] rounded-full animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        {/* Main Viewer Container */}
        <div className="relative w-full h-full max-w-6xl md:h-[92vh] flex flex-col md:rounded-[3rem] bg-gradient-to-br from-black via-gray-900 to-black shadow-2xl border border-white/10 overflow-hidden">

          {/* Progress Indicators */}
          {!isEditing && (
            <div className="absolute top-6 left-10 right-10 z-[100] flex gap-2">
              {stories.map((_, idx) => (
                <div key={idx} className="flex-1 h-1.5 rounded-full bg-white/10 overflow-hidden backdrop-blur-sm">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                    style={{ width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' }}
                    transition={{ ease: 'linear', duration: 0 }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Top Control Rail */}
          <div className="absolute top-14 left-10 right-10 z-[100] flex items-center justify-between">
            <div className="flex items-center gap-4 backdrop-blur-xl bg-black/30 px-6 py-3 rounded-2xl border border-white/10">
              <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-white/20 relative shadow-xl">
                <Image src={highlight.coverImage || '/placeholder.jpg'} width={56} height={56} alt="Cover" className="object-cover h-full" />
              </div>
              <div className="text-white">
                <h3 className="text-sm font-black uppercase tracking-widest">{highlight.title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold">
                  <HiSignal className="animate-pulse" />
                  MEMORY {currentIndex + 1} / {stories.length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105"
                  >
                    {isPaused ? <HiPlay className="w-5 h-5" /> : <HiPause className="w-5 h-5" />}
                  </button>

                  {isOwner && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-indigo-600 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105"
                        title={t("Edit Highlight")}
                      >
                        <HiCommandLine className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowAddMenu(true)}
                        className="hidden sm:flex items-center gap-2 px-6 py-3 rounded-xl bg-white/5 hover:bg-indigo-600 backdrop-blur-xl border border-white/10 text-white font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105"
                      >
                        <HiPlus className="w-4 h-4" /> {t("Add Memory")}
                      </button>

                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="w-12 h-12 rounded-xl bg-white/5 hover:bg-rose-500 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center transition-all hover:scale-105"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              )}

              <button
                onClick={onClose}
                className="w-12 h-12 rounded-xl bg-white/5 hover:bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105"
              >
                <HiXMark className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Main Media Core */}
          <div className="flex-1 relative bg-black group/viewer">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 backdrop-blur-2xl"
              >
                <div className="w-full max-w-md p-10 bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-[3rem] space-y-8 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                      <HiSparkles className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">{t("Edit Memory")}</h3>
                  </div>

                  <div className="flex flex-col items-center gap-4">
                    <label htmlFor="edit-cover-upload" className="cursor-pointer group relative w-40 h-40 rounded-3xl overflow-hidden border-2 border-dashed border-gray-600 hover:border-indigo-500 transition-all">
                      <Image src={editPreview || highlight.coverImage || '/placeholder.jpg'} fill className="object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={t("Cover")} />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-all">
                        <HiPlus className="text-white text-3xl drop-shadow-lg" />
                      </div>
                    </label>
                    <input id="edit-cover-upload" type="file" hidden accept="image/*" onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setEditCover(e.target.files[0]);
                        setEditPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }} />
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{t("Update Cover Art")}</span>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest">{t("Title")}</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-indigo-500 transition-all"
                      placeholder={t("Enter highlight title...")}
                    />
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button onClick={() => setIsEditing(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 font-bold text-xs uppercase hover:bg-white/10 transition-all">
                      {t("Cancel")}
                    </button>
                    <button onClick={handleUpdate} className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xs uppercase hover:shadow-xl hover:shadow-indigo-500/30 transition-all">
                      {t("Save Changes")}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={currentPhoto || '/placeholder.jpg'}
                    alt={t("Story")}
                    fill
                    className="object-contain"
                    priority
                    onError={(e) => {
                      console.error('Failed to load story image:', currentPhoto);
                      e.target.src = '/placeholder.jpg';
                    }}
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                  {currentStory?.text && (
                    <motion.div
                      initial={{ y: 30, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="absolute bottom-24 left-10 right-10 text-center"
                    >
                      <p className="text-2xl md:text-4xl font-black text-white uppercase tracking-tight leading-tight drop-shadow-2xl">
                        {currentStory.text}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation Regions */}
            {!isEditing && (
              <>
                <div className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-pointer" onClick={prev} />
                <div className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-pointer" onClick={next} />

                <div className="hidden md:flex absolute inset-y-0 left-6 items-center z-20 pointer-events-none">
                  <button onClick={prev} className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/viewer:opacity-100 transition-all pointer-events-auto hover:bg-white/10 hover:scale-110">
                    <HiChevronLeft className="w-8 h-8" />
                  </button>
                </div>
                <div className="hidden md:flex absolute inset-y-0 right-6 items-center z-20 pointer-events-none">
                  <button onClick={next} className="w-16 h-16 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/viewer:opacity-100 transition-all pointer-events-auto hover:bg-white/10 hover:scale-110">
                    <HiChevronRight className="w-8 h-8" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Enhanced Footer with Thumbnails */}
          {!isEditing && (
            <div className="hidden md:flex items-center justify-between px-10 py-6 bg-gradient-to-t from-black via-gray-900/50 to-transparent border-t border-white/5 backdrop-blur-xl">
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-2 flex-1">
                {stories.map((s, i) => (
                  <div key={s._id} className="relative group/thumb flex-shrink-0">
                    <button
                      onClick={() => { setCurrentIndex(i); setProgress(0); }}
                      className={`relative w-28 h-16 rounded-2xl overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-indigo-500 scale-110 shadow-xl shadow-indigo-500/30' : 'border-transparent opacity-40 hover:opacity-100 hover:scale-105'}`}
                    >
                      <Image src={getPhoto(s)} fill className="object-cover" alt={t("Thumbnail")} />
                      {i === currentIndex && (
                        <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/30 to-transparent" />
                      )}
                    </button>
                    {isOwner && stories.length > 1 && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm(t("Remove this story from highlight?"))) {
                            await removeStoryFromHighlight(highlight._id, s._id);
                            if (i === currentIndex) {
                              if (i > 0) {
                                setCurrentIndex(i - 1);
                              } else if (stories.length > 1) {
                                setCurrentIndex(0);
                              }
                            }
                          }
                        }}
                        className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-lg hover:bg-rose-600 z-10"
                        title={t("Remove story")}
                      >
                        <HiTrash className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {highlight.description && (
                <div className="flex items-center gap-3 text-gray-400 ml-6">
                  <HiCommandLine className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{highlight.description}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Add Story Menu */}
        <AnimatePresence>
          {showAddMenu && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 w-full sm:w-[420px] h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 border-l border-white/10 z-[2000] p-10 space-y-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500">
                    <HiPlus className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">{t("Add Memories")}</h3>
                </div>
                <button onClick={() => setShowAddMenu(false)} className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                  <HiXMark className="w-6 h-6" />
                </button>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search stories...")}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder-gray-600 outline-none focus:border-indigo-500 transition-all"
              />

              <div className="space-y-4 overflow-y-auto h-[calc(100%-250px)] pr-2 custom-scrollbar">
                {allStories
                  .filter(s => !stories.some(ex => ex._id === s._id))
                  .filter(s => !search || s.text?.toLowerCase().includes(search.toLowerCase()))
                  .map(st => (
                    <div key={st._id} className="group p-5 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all">
                      <div className="w-16 h-16 rounded-2xl overflow-hidden relative flex-shrink-0">
                        <Image src={getPhoto(st)} fill className="object-cover" alt={t("Story")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-black text-white uppercase mb-1 truncate">{st.text || t('MEMORY')}</div>
                        <div className="text-[9px] text-gray-500 font-bold uppercase">{dayjs(st.createdAt).format('DD MMM YYYY')}</div>
                      </div>
                      <button
                        onClick={() => { addStoryToHighlight(highlight._id, st._id); setShowAddMenu(false); }}
                        className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all flex-shrink-0"
                      >
                        <HiPlus className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute inset-0 z-[3000] flex items-center justify-center bg-black/80 backdrop-blur-xl"
            >
              <div className="bg-gradient-to-br from-gray-900 to-black border border-rose-500/30 rounded-[3rem] p-12 max-w-md text-center space-y-8 shadow-2xl">
                <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto text-4xl">
                  <HiTrash />
                </div>
                <div className="space-y-3">
                  <h4 className="text-2xl font-black text-white uppercase tracking-tight">{t("Delete Highlight")}</h4>
                  <p className="text-gray-400 text-sm font-medium leading-relaxed">{t("This will permanently remove this highlight and all its memories from your profile.")}</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setConfirmDelete(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all">{t("Cancel")}</button>
                  <button onClick={() => { deleteHighlight(highlight._id); onClose(); }} className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest hover:shadow-xl hover:shadow-rose-500/30 transition-all">{t("Delete")}</button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
});

HighlightViewerModal.displayName = 'HighlightViewerModal';
export default HighlightViewerModal;