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
  HiPencil,
  HiPhoto,
  HiArrowPath
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
  const STORY_DURATION_MS = 5000;

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
    if (isEditing || isPaused) return;

    const tick = (now) => {
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
      if (e.key === ' ') {
        e.preventDefault();
        setIsPaused(p => !p);
      }
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
        className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-2xl"
      >
        {/* Main Viewer Container */}
        <div className="relative w-full h-full max-w-6xl md:h-[95vh] flex flex-col md:rounded-3xl bg-black shadow-2xl overflow-hidden">

          {/* Progress Indicators */}
          {!isEditing && (
            <div className="absolute top-4 left-4 right-4 z-50 flex gap-1.5">
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

          {/* Top Control Bar */}
          <div className="absolute top-12 left-4 right-4 z-50 flex items-center justify-between">
            <div className="flex items-center gap-3 backdrop-blur-xl bg-black/40 px-4 py-2.5 rounded-2xl border border-white/10">
              <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/20">
                <Image src={highlight.coverImage || '/placeholder.jpg'} width={40} height={40} alt="Cover" className="object-cover" />
              </div>
              <div className="text-white">
                <h3 className="text-sm font-bold">{highlight.title}</h3>
                <div className="text-[10px] text-white/60 font-medium">
                  {currentIndex + 1} / {stories.length}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing && (
                <>
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white transition-all"
                  >
                    {isPaused ? <HiPlay className="w-4 h-4" /> : <HiPause className="w-4 h-4" />}
                  </button>

                  {isOwner && (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-indigo-500 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white transition-all"
                        title={t("Edit")}
                      >
                        <HiPencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setShowAddMenu(true)}
                        className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-indigo-500 backdrop-blur-xl border border-white/10 text-white font-bold text-xs transition-all"
                      >
                        <HiPlus className="w-3.5 h-3.5" /> {t("Add")}
                      </button>

                      <button
                        onClick={() => setConfirmDelete(true)}
                        className="w-10 h-10 rounded-xl bg-white/10 hover:bg-rose-500 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center transition-all"
                      >
                        <HiTrash className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </>
              )}

              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white transition-all"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Media Display */}
          <div className="flex-1 relative bg-black group">
            {isEditing ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 backdrop-blur-xl"
              >
                <div className="w-full max-w-md p-8 bg-gray-900 border border-white/10 rounded-3xl space-y-6">
                  <h3 className="text-xl font-bold text-white">{t("Edit Highlight")}</h3>

                  <div className="flex flex-col items-center gap-3">
                    <label htmlFor="edit-cover-upload" className="cursor-pointer relative w-32 h-32 rounded-2xl overflow-hidden border-2 border-dashed border-gray-600 hover:border-indigo-500 transition-all">
                      <Image src={editPreview || highlight.coverImage || '/placeholder.jpg'} fill className="object-cover" alt={t("Cover")} />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/40 hover:bg-black/20 transition-all">
                        <HiPhoto className="text-white text-2xl" />
                      </div>
                    </label>
                    <input id="edit-cover-upload" type="file" hidden accept="image/*" onChange={(e) => {
                      if (e.target.files?.[0]) {
                        setEditCover(e.target.files[0]);
                        setEditPreview(URL.createObjectURL(e.target.files[0]));
                      }
                    }} />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-400 uppercase mb-2 block">{t("Title")}</label>
                    <input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-medium outline-none focus:border-indigo-500 transition-all"
                      placeholder={t("Enter title...")}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-bold text-sm hover:bg-white/10 transition-all">
                      {t("Cancel")}
                    </button>
                    <button onClick={handleUpdate} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm hover:shadow-xl transition-all">
                      {t("Save")}
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
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <Image
                    src={currentPhoto || '/placeholder.jpg'}
                    alt={t("Story")}
                    fill
                    className="object-contain"
                    priority
                  />

                  {/* Gradient Overlays */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />
                  <div className="absolute inset-x-0 top-0 h-1/4 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

                  {currentStory?.text && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="absolute bottom-20 left-8 right-8 text-center"
                    >
                      <p className="text-xl md:text-3xl font-bold text-white leading-tight drop-shadow-2xl">
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
                <div className="absolute inset-y-0 left-0 w-1/3 z-10 cursor-pointer" onClick={prev} />
                <div className="absolute inset-y-0 right-0 w-1/3 z-10 cursor-pointer" onClick={next} />

                <div className="hidden md:flex absolute inset-y-0 left-4 items-center z-20 pointer-events-none">
                  <button onClick={prev} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-auto hover:bg-white/20">
                    <HiChevronLeft className="w-6 h-6" />
                  </button>
                </div>
                <div className="hidden md:flex absolute inset-y-0 right-4 items-center z-20 pointer-events-none">
                  <button onClick={next} className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all pointer-events-auto hover:bg-white/20">
                    <HiChevronRight className="w-6 h-6" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Thumbnail Strip */}
          {!isEditing && stories.length > 1 && (
            <div className="hidden md:flex items-center gap-3 px-6 py-4 bg-black/80 backdrop-blur-xl border-t border-white/10 overflow-x-auto">
              {stories.map((s, i) => (
                <div key={s._id} className="relative group/thumb flex-shrink-0">
                  <button
                    onClick={() => { setCurrentIndex(i); setProgress(0); }}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-indigo-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                      }`}
                  >
                    <Image src={getPhoto(s)} fill className="object-cover" alt={t("Thumbnail")} />
                  </button>
                  {isOwner && stories.length > 1 && (
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();
                        if (window.confirm(t("Remove this story?"))) {
                          await removeStoryFromHighlight(highlight._id, s._id);
                          if (i === currentIndex && i > 0) {
                            setCurrentIndex(i - 1);
                          }
                        }
                      }}
                      className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover/thumb:opacity-100 transition-opacity"
                    >
                      <HiTrash className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Story Sidebar */}
        <AnimatePresence>
          {showAddMenu && (
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 w-full sm:w-96 h-full bg-gray-900 border-l border-white/10 z-[2000] p-6 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white">{t("Add Stories")}</h3>
                <button onClick={() => setShowAddMenu(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                  <HiXMark className="w-5 h-5" />
                </button>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t("Search stories...")}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none focus:border-indigo-500 transition-all"
              />

              <div className="space-y-3 overflow-y-auto h-[calc(100%-150px)]">
                {allStories
                  .filter(s => !stories.some(ex => ex._id === s._id))
                  .filter(s => !search || s.text?.toLowerCase().includes(search.toLowerCase()))
                  .map(st => (
                    <div key={st._id} className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 hover:border-indigo-500/50 transition-all">
                      <div className="w-12 h-12 rounded-xl overflow-hidden relative flex-shrink-0">
                        <Image src={getPhoto(st)} fill className="object-cover" alt={t("Story")} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-white truncate">{st.text || t('Story')}</div>
                        <div className="text-[10px] text-gray-400">{dayjs(st.createdAt).format('DD MMM YYYY')}</div>
                      </div>
                      <button
                        onClick={() => { addStoryToHighlight(highlight._id, st._id); setShowAddMenu(false); }}
                        className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all flex-shrink-0"
                      >
                        <HiPlus className="w-4 h-4" />
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
              <div className="bg-gray-900 border border-rose-500/30 rounded-3xl p-8 max-w-sm text-center space-y-6">
                <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 mx-auto text-3xl">
                  <HiTrash />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2">{t("Delete Highlight?")}</h4>
                  <p className="text-gray-400 text-sm">{t("This action cannot be undone.")}</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setConfirmDelete(false)} className="flex-1 py-3 rounded-xl bg-white/5 text-gray-400 font-bold text-sm hover:bg-white/10 transition-all">{t("Cancel")}</button>
                  <button onClick={() => { deleteHighlight(highlight._id); onClose(); }} className="flex-1 py-3 rounded-xl bg-rose-600 text-white font-bold text-sm hover:shadow-xl transition-all">{t("Delete")}</button>
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