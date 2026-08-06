'use client';

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Image as ImageIcon,
  Check,
} from 'lucide-react';
import Image from 'next/image';
import { useHighlights } from '@/app/Context/HighlightContext';
import { useAlert } from '@/app/Context/AlertContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

const StoryCard = memo(({ story, isSelected, onToggle, getStoryPhoto }) => {
  return (
    <div
      onClick={() => onToggle(story._id)}
      className="relative aspect-[9/16] cursor-pointer group rounded-xl overflow-hidden shadow-sm"
    >
      <div className={`relative w-full h-full border-2 transition-all rounded-xl overflow-hidden ${
        isSelected
          ? 'border-indigo-600 shadow-md'
          : 'border-transparent hover:border-slate-300 dark:hover:border-white/20'
      }`}>
        <Image
          src={getStoryPhoto(story)}
          alt="Story"
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        <div className={`absolute inset-0 transition-opacity ${isSelected ? 'bg-indigo-600/20' : 'bg-black/10 group-hover:bg-black/5'}`} />

        {isSelected && (
          <div className="absolute top-2 right-2 z-10 bg-indigo-600 rounded-full p-1 shadow-sm">
            <Check size={12} className="text-white" />
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
          <p className="text-[10px] text-white/90 font-medium truncate">
            {new Date(story.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
});

StoryCard.displayName = 'StoryCard';

const AddHighlightMenu = memo(function AddHighlightMenu({ stories = [] }) {
  const [title, setTitle] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedStories, setSelectedStories] = useState([]);

  const { createHighlight, loading, setOpenModal, openModal } = useHighlights();
  const { showAlert } = useAlert();
  const { t } = useTranslation();

  const fileInputRef = useRef(null);

  const getStoryPhoto = useCallback((story) => {
    if (!story) return '/placeholder.jpg';
    if (story.Photo) {
      if (Array.isArray(story.Photo) && story.Photo.length > 0) return story.Photo[0];
      if (typeof story.Photo === 'string') return story.Photo;
    }
    if (story.photo) {
      if (Array.isArray(story.photo) && story.photo.length > 0) return story.photo[0];
      if (typeof story.photo === 'string') return story.photo;
    }
    return '/placeholder.jpg';
  }, []);

  useEffect(() => {
    return () => { if (preview) URL.revokeObjectURL(preview); };
  }, [preview]);

  const handleSelectStory = useCallback((id) => {
    setSelectedStories((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  }, []);

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setCoverFile(file);
    setPreview(url);
  };

  const resetForm = useCallback(() => {
    setTitle('');
    setCoverFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setSelectedStories([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [preview]);

  const handleCreate = async () => {
    if (!title.trim() || selectedStories.length === 0) {
      return showAlert(t('Please enter a title and select stories.'));
    }
    try {
      await createHighlight({ title: title.trim(), cover: coverFile, storyIds: selectedStories });
      resetForm();
      setOpenModal(false);
    } catch (err) {
      console.error('Highlight creation failed:', err);
    }
  };

  return (
    <AnimatePresence>
      {openModal && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4"
          onClick={(e) => e.target === e.currentTarget && setOpenModal(false)}
        >
          <motion.div
            initial={{ y: 15, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 15, opacity: 0, scale: 0.96 }}
            className="relative w-full max-w-4xl h-[85vh] rounded-2xl bg-white dark:bg-[#0B0F1A] shadow-xl overflow-hidden flex flex-col md:flex-row border border-slate-200/80 dark:border-white/10"
          >
            {/* Left Sidebar Config */}
            <div className="w-full md:w-[320px] bg-slate-50/50 dark:bg-white/[0.02] p-5 sm:p-6 border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-white/10 overflow-y-auto space-y-5 shrink-0">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{t("New Highlight")}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t("Organize your saved stories")}</p>
                </div>
                <button onClick={() => setOpenModal(false)} className="md:hidden p-1 text-slate-400">
                  <X size={18} />
                </button>
              </div>

              {/* Cover Photo */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1.5 block">{t("Cover Image")}</label>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-28 h-28 mx-auto rounded-full overflow-hidden cursor-pointer group border-2 border-dashed border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-all bg-slate-100 dark:bg-white/5 flex items-center justify-center"
                >
                  {preview ? (
                    <Image src={preview} alt="Cover" fill className="object-cover" />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-slate-400">
                      <ImageIcon size={22} className="mb-1" />
                      <span className="text-[10px] font-bold">{t("Upload")}</span>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverChange} hidden />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t("Title")}</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("Highlight name...")}
                  maxLength={30}
                  className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm font-medium outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>

              {/* Counter Pill */}
              <div className="p-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200/60 dark:border-white/10 flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-500 dark:text-slate-400">{t("Selected Stories")}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{selectedStories.length}</span>
              </div>

              {/* Save / Reset */}
              <div className="space-y-2 pt-2">
                <Button
                  onClick={handleCreate}
                  isLoading={loading}
                  disabled={!title.trim() || selectedStories.length === 0}
                  className="w-full rounded-xl py-2.5 text-xs font-bold"
                >
                  <Plus size={16} className="mr-1.5" />
                  {t("Create Highlight")}
                </Button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full text-xs font-semibold text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  {t("Reset")}
                </button>
              </div>
            </div>

            {/* Right Story Selection Grid */}
            <div className="flex-1 flex flex-col p-5 sm:p-6 overflow-hidden">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-white/10 shrink-0">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">{t("Select Stories")}</h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{stories.length} {t("available")}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStories(stories.map(s => s._id))}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 transition-colors"
                  >
                    {t("Select All")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedStories([])}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 transition-colors"
                  >
                    {t("Clear")}
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-4">
                {stories.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-2">
                    <ImageIcon size={40} className="opacity-30" />
                    <p className="text-xs font-semibold">{t("No stories available.")}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {stories.map((story) => (
                      <StoryCard
                        key={story._id}
                        story={story}
                        isSelected={selectedStories.includes(story._id)}
                        onToggle={handleSelectStory}
                        getStoryPhoto={getStoryPhoto}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

AddHighlightMenu.displayName = 'AddHighlightMenu';
export default AddHighlightMenu;
