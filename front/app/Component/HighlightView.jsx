'use client';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
} from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import {
  HiXMark,
  HiPlus,
  HiTrash,
  HiSparkles,
  HiChevronLeft,
  HiChevronRight,
  HiPause,
  HiPlay,
  HiPencil,
  HiPhoto,
  HiArrowPath,
  HiBars3,
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
  const { addStoryToHighlight, deleteHighlight, updateHighlight, removeStoryFromHighlight, reorderStoriesInHighlight, loading } = useHighlights();
  const { user } = useAuth();
  const { t } = useTranslation();

  const originalStories = useMemo(() => highlight?.stories || highlight?.archivedStories || [], [highlight]);
  const [localStories, setLocalStories] = useState(originalStories);
  const [hasReordered, setHasReordered] = useState(false);

  useEffect(() => {
    setLocalStories(originalStories);
    setHasReordered(false);
  }, [originalStories]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit State
  const [editTitle, setEditTitle] = useState(highlight?.title || '');
  const [editDescription, setEditDescription] = useState(highlight?.description || '');
  const [isPublic, setIsPublic] = useState(highlight?.isPublic ?? true);
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
    if (currentIndex < localStories.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, localStories.length, onClose]);

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
    if (hasReordered) {
      await reorderStoriesInHighlight(highlight._id, localStories.map(s => s._id));
    }
    await updateHighlight(highlight._id, {
      title: editTitle,
      description: editDescription,
      isPublic: isPublic,
      image: editCover
    });
    setIsEditing(false);
  };

  const currentStory = localStories[currentIndex];
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
              {localStories.map((_, idx) => (
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
                  {currentIndex + 1} / {localStories.length}
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
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-3xl overflow-y-auto p-4 sm:p-8"
              >
                <div className="w-full max-w-4xl bg-gray-900/80 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[85vh]">

                  {/* Left: Metadata Edit */}
                  <div className="w-full md:w-80 p-8 border-b md:border-b-0 md:border-r border-white/5 space-y-8 overflow-y-auto scrollbar-hide">
                    <h3 className="text-2xl font-black text-white tracking-tight">{t("Manage Highlight")}</h3>

                    {/* Cover Preview & Edit */}
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-1">{t("Cover Image")}</label>
                      <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg group">
                        <Image
                          src={editPreview || highlight.coverImage || '/placeholder.jpg'}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          alt="Cover"
                        />
                        <label htmlFor="edit-cover-input" className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                          <HiPhoto className="text-3xl text-white mb-2" />
                          <span className="text-[10px] font-bold text-white uppercase">{t("Change")}</span>
                        </label>
                        <input
                          id="edit-cover-input"
                          type="file"
                          hidden
                          accept="image/*"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              setEditCover(e.target.files[0]);
                              setEditPreview(URL.createObjectURL(e.target.files[0]));
                            }
                          }}
                        />
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-1">{t("Title")}</label>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-bold outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-sm"
                          placeholder={t("Highlight Name")}
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-indigo-400 uppercase tracking-widest px-1">{t("Description")}</label>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white font-medium outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all text-sm resize-none h-24"
                          placeholder={t("Tell a story about these moments...")}
                        />
                      </div>

                      <div className="flex items-center justify-between p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all cursor-pointer" onClick={() => setIsPublic(!isPublic)}>
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-white block">{t("Public Highlight")}</span>
                          <span className="text-[10px] text-white/40 font-bold uppercase tracking-tighter">{t("Anyone can view")}</span>
                        </div>
                        <div className={`w-12 h-6 rounded-full transition-all duration-300 p-1 ${isPublic ? 'bg-indigo-500' : 'bg-white/10'}`}>
                          <div className={`w-4 h-4 rounded-full bg-white transition-all duration-300 ${isPublic ? 'translate-x-6' : 'translate-x-0'}`} />
                        </div>
                      </div>

                      {/* We can add more metadata here like description, tags if needed */}
                      <div className="p-5 rounded-2xl bg-indigo-500/5 border border-indigo-500/20">
                        <div className="flex items-center justify-between text-indigo-300">
                          <span className="text-xs font-bold">{t("Stories")}</span>
                          <span className="text-sm font-black">{localStories.length}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                      <button
                        onClick={handleUpdate}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {loading && <HiArrowPath className="w-4 h-4 animate-spin" />}
                        {loading ? t("Saving...") : t("Save Changes")}
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-white/5 text-white/60 font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all disabled:opacity-50"
                      >
                        {t("Back to Viewer")}
                      </button>
                    </div>
                  </div>

                  {/* Right: Story Management */}
                  <div className="flex-1 flex flex-col overflow-hidden bg-black/20">
                    <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                      <h4 className="text-sm font-black text-white/50 uppercase tracking-widest">{t("Included Stories")}</h4>
                      <button
                        onClick={() => setShowAddMenu(true)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all"
                      >
                        <HiPlus className="w-3 h-3" />
                        {t("Add More")}
                      </button>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col">
                      <Reorder.Group
                        axis="y"
                        values={localStories}
                        onReorder={(newOrder) => {
                          setLocalStories(newOrder);
                          setHasReordered(true);
                        }}
                        className="flex-1 overflow-y-auto p-8 space-y-3 scrollbar-hide"
                      >
                        {localStories.map((story, idx) => (
                          <Reorder.Item
                            key={story._id}
                            value={story}
                            className="group relative flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-indigo-500/30 transition-all cursor-grab active:cursor-grabbing"
                          >
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="text-white/20 font-black text-xs w-4">#{idx + 1}</div>
                              <div className="relative w-12 h-20 rounded-xl overflow-hidden border border-white/10 flex-shrink-0">
                                <Image src={getPhoto(story)} fill className="object-cover" alt="Story" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-white truncate">{story.text || t("Moment")}</p>
                                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{dayjs(story.createdAt).format('DD MMM YYYY')}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (window.confirm(t("Remove this story?"))) {
                                    removeStoryFromHighlight(highlight._id, story._id);
                                  }
                                }}
                                className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all"
                              >
                                <HiTrash className="w-4 h-4" />
                              </button>
                              <div className="w-10 h-10 rounded-xl bg-white/5 text-white/20 flex items-center justify-center">
                                <HiBars3 className="w-5 h-5" />
                              </div>
                            </div>
                          </Reorder.Item>
                        ))}
                      </Reorder.Group>
                    </div>
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
          {!isEditing && localStories.length > 1 && (
            <div className="hidden md:flex items-center gap-3 px-6 py-4 bg-black/80 backdrop-blur-xl border-t border-white/10 overflow-x-auto">
              {localStories.map((s, i) => (
                <div key={s._id} className="relative group/thumb flex-shrink-0">
                  <button
                    onClick={() => { setCurrentIndex(i); setProgress(0); }}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden border-2 transition-all ${i === currentIndex ? 'border-indigo-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100 hover:scale-105'
                      }`}
                  >
                    <Image src={getPhoto(s)} fill className="object-cover" alt={t("Thumbnail")} />
                  </button>
                  {isOwner && localStories.length > 1 && (
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
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 w-full sm:w-96 h-full bg-gray-950 border-l border-white/10 z-[2000] flex flex-col shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-white tracking-tight uppercase tracking-widest">{t("Add Stories")}</h3>
                  <button onClick={() => setShowAddMenu(false)} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-all">
                    <HiXMark className="w-5 h-5" />
                  </button>
                </div>

                <div className="relative">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("Search by text...")}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-bold placeholder-white/20 outline-none focus:border-indigo-500/50 focus:bg-white/10 transition-all"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide">
                {allStories
                  ?.filter(s => !localStories.some(ex => ex._id === (s._id || s)))
                  .filter(s => !search || s.text?.toLowerCase().includes(search.toLowerCase()))
                  .map((st, i) => (
                    <motion.div
                      key={st._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="group p-4 rounded-[2rem] bg-white/5 border border-white/5 flex items-center gap-4 hover:border-indigo-500/30 hover:bg-white/10 transition-all cursor-pointer"
                    >
                      <div className="w-14 h-20 rounded-2xl overflow-hidden relative flex-shrink-0 border border-white/10 shadow-lg">
                        <Image src={getPhoto(st)} fill className="object-cover transition-transform duration-500 group-hover:scale-110" alt="Story" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{dayjs(st.createdAt).format('DD MMM YYYY')}</div>
                        <div className="text-sm font-bold text-white truncate pr-2">{st.text || t('Moment')}</div>
                      </div>
                      <button
                        onClick={() => { addStoryToHighlight(highlight._id, st._id); }}
                        className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center hover:bg-indigo-500 hover:text-white transition-all flex-shrink-0 shadow-lg"
                      >
                        <HiPlus className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}

                {allStories?.filter(s => !localStories.some(ex => ex._id === (s._id || s))).length === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-white/20 p-8 text-center space-y-4">
                    <HiSparkles className="text-5xl" />
                    <p className="text-xs font-black uppercase tracking-widest leading-loose">
                      {t("All your stories are already in this highlight")}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-8 border-t border-white/5">
                <button
                  onClick={() => setShowAddMenu(false)}
                  className="w-full py-4 rounded-2xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-gray-200 transition-all"
                >
                  {t("Done")}
                </button>
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