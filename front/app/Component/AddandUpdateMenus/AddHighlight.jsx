'use client';

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  Sparkles,
  Loader2,
  Check
} from 'lucide-react';
import Image from 'next/image';
import { useHighlights } from '@/app/Context/HighlightContext';
import { useAlert } from '@/app/Context/AlertContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

const StoryCard = memo(({ story, isSelected, onToggle, getStoryPhoto }) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onToggle(story._id)}
      className="relative aspect-[9/16] cursor-pointer group rounded-2xl overflow-hidden"
    >
      <div className={`relative w-full h-full border-2 transition-all duration-300 rounded-2xl overflow-hidden ${isSelected
          ? 'border-indigo-500 shadow-lg'
          : 'border-transparent hover:border-indigo-500/30'
        }`}>
        <Image
          src={getStoryPhoto(story)}
          alt="Story"
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />

        <div className={`absolute inset-0 transition-all duration-300 ${isSelected ? 'bg-indigo-500/20' : 'bg-black/10 group-hover:bg-black/5'
          }`} />

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-2 right-2 z-10"
            >
              <div className="bg-indigo-500 rounded-full p-1 shadow-lg">
                <Check size={14} className="text-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-[10px] text-white/80 font-bold truncate">
            {new Date(story.createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </motion.div>
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
          onClick={(e) => e.target === e.currentTarget && setOpenModal(false)}
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            className="relative w-full max-w-5xl h-[85vh] rounded-[2.5rem] bg-white dark:bg-black shadow-2xl overflow-hidden flex flex-col md:flex-row border border-gray-100 dark:border-threads-border"
          >
            {/* Left Panel - Config */}
            <div className="w-full md:w-[350px] bg-gray-50 dark:bg-white/[0.02] p-8 border-r border-gray-100 dark:border-threads-border overflow-y-auto no-scrollbar space-y-10">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-white/5 flex items-center justify-center text-indigo-500">
                  <Sparkles size={24} />
                </div>
                <div>
                   <h2 className="text-xl font-bold tracking-tight">{t("New Highlight")}</h2>
                   <p className="text-xs text-gray-500 font-semibold">{t("Curate your best moments")}</p>
                </div>
              </div>

              {/* Cover Upload */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{t("Cover Image")}</h3>
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative w-full aspect-square rounded-3xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-100 dark:border-white/5 hover:border-indigo-500/30 transition-all bg-white dark:bg-black"
                >
                  {preview ? (
                    <Image src={preview} alt="Cover" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <ImageIcon size={32} className="mb-2 opacity-50" />
                      <span className="text-[10px] font-bold uppercase tracking-widest">{t("Upload")}</span>
                    </div>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverChange} hidden />
                </div>
              </div>

              {/* Title Input */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{t("Highlight Title")}</h3>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={t("Name your highlight...")}
                  maxLength={50}
                  className="w-full bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-2xl p-4 text-[15px] font-medium placeholder-gray-400 focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all outline-none"
                />
              </div>

              {/* Status */}
              <div className="p-5 rounded-3xl border border-gray-100 dark:border-threads-border bg-white dark:bg-black space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-gray-400">{t("Selected")}</span>
                  <span className="text-sm font-bold text-indigo-500">{selectedStories.length}</span>
                </div>
                <div className="flex -space-x-2 pt-2">
                  {selectedStories.slice(0, 5).map((id) => (
                    <div key={id} className="w-8 h-8 rounded-full border-2 border-white dark:border-black overflow-hidden bg-gray-100">
                      <Image
                        src={getStoryPhoto(stories.find(s => s._id === id))}
                        alt="sel"
                        width={32}
                        height={32}
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {selectedStories.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-white/10 border-2 border-white dark:border-black flex items-center justify-center text-[10px] font-bold text-gray-500">
                      +{selectedStories.length - 5}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-6 space-y-4">
                 <Button
                    onClick={handleCreate}
                    isLoading={loading}
                    disabled={!title.trim() || selectedStories.length === 0}
                    className="w-full rounded-full py-4 text-sm font-bold tracking-tight"
                  >
                    <Plus size={18} className="mr-2" />
                    {t("Create")}
                  </Button>
                  <button onClick={resetForm} className="w-full text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-black dark:hover:text-white transition-colors">
                    {t("Reset Form")}
                  </button>
              </div>
            </div>

            {/* Right Panel - Stories Grid */}
            <div className="flex-1 flex flex-col p-8 overflow-hidden">
               <div className="flex items-center justify-between mb-8">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight">{t("Choose Stories")}</h3>
                    <p className="text-xs text-gray-500 font-semibold">{stories.length} {t("Available")}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedStories(stories.map(s => s._id))}
                      className="px-4 py-2 rounded-full text-[11px] font-bold bg-indigo-50 dark:bg-white/5 text-indigo-600 dark:text-indigo-400 transition-all hover:bg-indigo-100"
                    >
                      {t("Select All")}
                    </button>
                    <button
                      onClick={() => setSelectedStories([])}
                      className="px-4 py-2 rounded-full text-[11px] font-bold bg-gray-100 dark:bg-white/5 text-gray-500 transition-all hover:bg-gray-200"
                    >
                      {t("Clear")}
                    </button>
                    <button onClick={() => setOpenModal(false)} className="md:hidden p-2 text-gray-400"><X size={24} /></button>
                  </div>
               </div>

               <div className="flex-1 overflow-y-auto no-scrollbar">
                  {stories.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-300">
                      <ImageIcon size={64} className="opacity-20 mb-4" />
                      <p className="font-bold text-sm tracking-widest uppercase opacity-40">{t("No stories found")}</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pb-10">
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
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AddHighlightMenu.displayName = 'AddHighlightMenu';
export default AddHighlightMenu;
