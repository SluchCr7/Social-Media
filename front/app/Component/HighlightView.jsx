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
  HiCommandLine
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
  const { addStoryToHighlight, deleteHighlight, updateHighlight, removeStoryFromHighlight } = useHighlights(); // ✅ Added removeStoryFromHighlight
  const { user } = useAuth(); // ✅ Need user to check ownership
  const { t } = useTranslation();

  const stories = useMemo(() => highlight?.archivedStories || [], [highlight]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // ✅ Edit Mode

  // Edit State
  const [editTitle, setEditTitle] = useState(highlight?.title || '');
  const [editCover, setEditCover] = useState(null);
  const [editPreview, setEditPreview] = useState(null);

  const rafRef = useRef(null);
  const lastTimeRef = useRef(null);
  const STORY_DURATION_MS = 6000;
  useEffect(() => {
    console.log(highlight)
    console.log(`stories : ${highlight.stories}`)
  }, [highlight])
  // Cleanup preview
  useEffect(() => {
    return () => {
      if (editPreview) URL.revokeObjectURL(editPreview);
    };
  }, [editPreview]);

  const isOwner = user?._id === highlight?.user; // Check ownership

  const getPhoto = useCallback((story) => {
    if (!story) return '/placeholder.jpg';

    // Try Photo (capital P) first
    if (story.Photo) {
      if (Array.isArray(story.Photo) && story.Photo.length > 0) {
        return story.Photo[0];
      }
      if (typeof story.Photo === 'string') {
        return story.Photo;
      }
    }

    // Fallback to photo (lowercase)
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
    if (isEditing) return; // Pause timer when editing

    const tick = (now) => {
      if (isPaused) {
        lastTimeRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      if (lastTimeRef.current == null) lastTimeRef.current = now;
      const elapsed = now - lastTimeRef.current;
      const speed = isPaused ? 0 : (100 / STORY_DURATION_MS);
      const delta = (elapsed * speed) / 1000;

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

  // Debug logging
  useEffect(() => {
    if (highlight && stories.length > 0) {
      console.log('📸 Highlight Stories Debug:', {
        highlightTitle: highlight.title,
        totalStories: stories.length,
        firstStory: stories[0],
        currentStory: currentStory,
        currentPhoto: currentPhoto
      });
    }
  }, [highlight, stories, currentStory, currentPhoto]);

  if (!highlight) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-[#050505]/95 backdrop-blur-3xl overflow-hidden"
      >
        {/* Cinematic Particles */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-indigo-500/5 blur-[120px] rounded-full" />
        </div>

        {/* 🎬 Viewer Console */}
        <div className="relative w-full h-full max-w-5xl md:h-[90vh] flex flex-col md:rounded-[3rem] bg-black shadow-2xl border border-white/10 overflow-hidden">

          {/* Progress Indicators */}
          {!isEditing && (
            <div className="absolute top-6 left-10 right-10 z-[100] flex gap-2">
              {stories.map((_, idx) => (
                <div key={idx} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
                  <motion.div
                    className="h-full bg-white"
                    style={{ width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%' }}
                    transition={{ ease: 'linear', duration: 0 }}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Top Control Rail */}
          <div className="absolute top-12 left-10 right-10 z-[100] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/20 relative">
                <Image src={highlight.coverImage || '/placeholder.jpg'} width={48} height={48} alt="Cover" className="object-cover h-full" />
              </div>
              <div className="text-white">
                <h3 className="text-sm font-black uppercase tracking-widest">{highlight.title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-indigo-400 font-bold">
                  <HiSignal className="animate-pulse" />
                  SIGNAL {currentIndex + 1} / {stories.length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Controls */}
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
                  >
                    {isPaused ? <HiPlay className="w-5 h-5" /> : <HiPause className="w-5 h-5" />}
                  </button>

                  {isOwner && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
                        title={t("Edit Highlight")}
                      >
                        <HiCommandLine className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setShowAddMenu(true)}
                        className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-indigo-600 text-white font-black text-[10px] uppercase tracking-widest transition-all"
                      >
                        <HiPlus className="w-4 h-4" /> {t("Inject Data")}
                      </button>

                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="w-10 h-10 rounded-xl bg-white/5 hover:bg-rose-500 text-white flex items-center justify-center transition-all"
                      >
                        <HiTrash className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </>
              )}

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all"
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
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/80 backdrop-blur-xl"
              >
                <div className="w-full max-w-md p-8 bg-[#0A0A0A] border border-white/10 rounded-3xl space-y-6">
                  <h3 className="text-xl font-black text-white uppercase">{t("Edit Frequency")}</h3>

                  <div className="flex flex-col items-center gap-4">
                    <label htmlFor="edit-cover-upload" className="cursor-pointer group relative w-32 h-32 rounded-full overflow-hidden border-2 border-dashed border-gray-600 hover:border-indigo-500 transition-colors">
                      <Image src={editPreview || highlight.coverImage || '/placeholder.jpg'} fill className="object-cover opacity-50 group-hover:opacity-100 transition-opacity" alt={t("Cover")} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <HiPlus className="text-white text-2xl drop-shadow-md" />
                      </div>
                    </label>
                    <input id="edit-cover-upload" type="file" hidden accept="image/*" onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setEditCover(e.target.files[0]);
                        setEditPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }} />
                    <span className="text-xs text-gray-500 font-bold uppercase">{t("Update Cover Art")}</span>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">{t("Designation")}</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-bold outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-bold text-xs uppercase hover:bg-white/10 transition-colors">
                      {t("Cancel")}
                    </button>
                    <button onClick={handleUpdate} className="flex-1 py-3 rounded-xl bg-indigo-600 text-white font-bold text-xs uppercase hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20">
                      {t("Save Changes")}
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.7, ease: "circOut" }}
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

                  {/* Visual Overlays */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black via-transparent to-transparent pointer-events-none" />

                  {currentStory?.text && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      className="absolute bottom-20 left-10 right-10 text-center"
                    >
                      <p className="text-xl md:text-3xl font-black text-white uppercase tracking-tighter leading-tight drop-shadow-2xl">
                        {currentStory.text}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            {/* Navigation Regions - Disable when editing */}
            {!isEditing && (
              <>
                <div className="absolute inset-y-0 left-0 w-1/4 z-10 cursor-pointer" onClick={prev} />
                <div className="absolute inset-y-0 right-0 w-1/4 z-10 cursor-pointer" onClick={next} />

                <div className="hidden md:flex absolute inset-y-0 left-6 items-center z-20 pointer-events-none">
                  <button onClick={prev} className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/viewer:opacity-100 transition-opacity pointer-events-auto hover:bg-white/10">
                    <HiChevronLeft className="w-8 h-8" />
                  </button>
                </div>
                <div className="hidden md:flex absolute inset-y-0 right-6 items-center z-20 pointer-events-none">
                  <button onClick={next} className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 flex items-center justify-center text-white opacity-0 group-hover/viewer:opacity-100 transition-opacity pointer-events-auto hover:bg-white/10">
                    <HiChevronRight className="w-8 h-8" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Data Meta Bar (Footer) */}
          {!isEditing && (
            <div className="hidden md:flex items-center justify-between px-10 py-6 bg-white/[0.02] border-t border-white/10">
              <div className="flex items-center gap-6 overflow-x-auto no-scrollbar py-2">
                {stories.map((s, i) => (
                  <div key={s._id} className="relative group/thumb">
                    <button
                      onClick={() => { setCurrentIndex(i); setProgress(0); }}
                      className={`relative w-24 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-indigo-500 scale-105 shadow-lg' : 'border-transparent opacity-40 hover:opacity-100'}`}
                    >
                      <Image src={getPhoto(s)} fill className="object-cover" alt={t("Thumbnail")} />
                    </button>
                    {/* Delete Story Button - Only for owners */}
                    {isOwner && stories.length > 1 && (
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm(t("Remove this story from highlight?"))) {
                            await removeStoryFromHighlight(highlight._id, s._id);
                            // If we deleted the current story, move to previous or next
                            if (i === currentIndex) {
                              if (i > 0) {
                                setCurrentIndex(i - 1);
                              } else if (stories.length > 1) {
                                setCurrentIndex(0);
                              }
                            }
                          }
                        }}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity shadow-lg hover:bg-rose-600 z-10"
                        title={t("Remove story")}
                      >
                        <HiTrash className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {highlight.description && (
                <div className="flex items-center gap-3 text-gray-400">
                  <HiCommandLine className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{highlight.description}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 🏺 Inject Data Menu (Side Panel) */}
        <AnimatePresence>
          {showAddMenu && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed top-0 right-0 w-full sm:w-96 h-full bg-[#0A0A0A] border-l border-white/10 z-[2000] p-10 space-y-8 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-xl font-black text-white uppercase tracking-widest">{t("Data Injection")}</h3>
                <button onClick={() => setShowAddMenu(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white"><HiXMark /></button>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Filter archive...")}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 outline-none focus:border-indigo-500"
              />

              <div className="space-y-4 overflow-y-auto h-[calc(100%-250px)] pr-2 custom-scrollbar">
                {allStories.filter(s => !stories.some(ex => ex._id === s._id)).map(st => (
                  <div key={st._id} className="group p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center gap-4 hover:border-indigo-500/50 transition-all">
                    <div className="w-14 h-14 rounded-xl overflow-hidden relative">
                      <Image src={getPhoto(st)} fill className="object-cover" alt={t("Story")} />
                    </div>
                    <div className="flex-1">
                      <div className="text-[10px] font-black text-white uppercase mb-1">{st.text || t('SIGNAL')}</div>
                      <div className="text-[8px] text-gray-500 font-bold uppercase">{dayjs(st.createdAt).format('DD MMM')}</div>
                    </div>
                    <button
                      onClick={() => { addStoryToHighlight(highlight._id, st._id); setShowAddMenu(false); }}
                      className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all"
                    >
                      <HiPlus />
                    </button>
                  </div>
                ))}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* 🗑 Delete Protocol */}
        <AnimatePresence>
          {confirmDelete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute inset-0 z-[3000] flex items-center justify-center bg-black/60 backdrop-blur-md"
            >
              <div className="bg-[#0A0A0A] border border-rose-500/30 rounded-[3rem] p-12 max-w-sm text-center space-y-8">
                <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto text-3xl">
                  <HiTrash />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white uppercase tracking-tighter">{t("Purge Protocol")}</h4>
                  <p className="text-gray-400 text-sm font-medium">{t("This will permanently decouple this highlight from the grid.")}</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={() => setConfirmDelete(false)} className="flex-1 py-4 rounded-2xl bg-white/5 text-gray-400 font-black text-[10px] uppercase tracking-widest">{t("Abort")}</button>
                  <button onClick={() => { deleteHighlight(highlight._id); onClose(); }} className="flex-1 py-4 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest">{t("Purge")}</button>
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