'use client';

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiXMark,
  HiPlus,
  HiPhoto,
  HiCheckCircle,
  HiSparkles,
  HiArrowPath
} from 'react-icons/hi2';
import Image from 'next/image';
import { useHighlights } from '@/app/Context/HighlightContext';
import { useAlert } from '@/app/Context/AlertContext';
import { useTranslation } from 'react-i18next';

const StoryCard = memo(({ story, isSelected, onToggle, getStoryPhoto }) => {
  return (
    <motion.div
      layout
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => onToggle(story._id)}
      className="relative aspect-[9/16] cursor-pointer group rounded-2xl overflow-hidden"
    >
      <div className={`relative w-full h-full border-2 transition-all duration-300 rounded-2xl overflow-hidden ${isSelected
          ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.5)]'
          : 'border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600'
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
              <div className="bg-indigo-500 rounded-full p-1.5 shadow-lg">
                <HiCheckCircle className="text-white text-lg" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
          <p className="text-[9px] text-white/80 font-medium truncate">
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

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
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
      return showAlert(t('Please enter a title and select at least one story.'));
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4"
          onClick={(e) => e.target === e.currentTarget && setOpenModal(false)}
        >
          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25 }}
            className="relative w-full max-w-5xl max-h-[90vh] rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                  <HiSparkles className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {t("Create Highlight")}
                  </h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t("Curate your best moments")}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setOpenModal(false)}
                className="w-10 h-10 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              >
                <HiXMark className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
              {/* Left Panel */}
              <div className="w-full md:w-80 p-6 border-r border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50 space-y-6">
                {/* Cover Upload */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 block">
                    {t("Cover Image")}
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-full aspect-square rounded-2xl overflow-hidden cursor-pointer group border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-indigo-500 transition-all"
                  >
                    {preview ? (
                      <Image src={preview} alt="Cover" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-indigo-500 transition-colors">
                        <HiPhoto className="w-12 h-12 mb-2" />
                        <span className="text-xs font-bold">{t("Upload Cover")}</span>
                      </div>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverChange} hidden />
                  </div>
                </div>

                {/* Title Input */}
                <div>
                  <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase mb-3 block">
                    {t("Title")}
                  </label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder={t("Enter highlight name...")}
                    maxLength={50}
                    className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm font-medium text-gray-900 dark:text-white placeholder:text-gray-400 focus:border-indigo-500 focus:outline-none transition-all"
                  />
                  <div className="text-right text-xs text-gray-400 mt-1">
                    {title.length}/50
                  </div>
                </div>

                {/* Selected Count */}
                <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
                      {t("Selected")}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-xs font-bold">
                      {selectedStories.length}
                    </span>
                  </div>
                  {selectedStories.length > 0 && (
                    <div className="flex -space-x-2 mt-3">
                      {selectedStories.slice(0, 5).map((id) => (
                        <div key={id} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden">
                          <Image
                            src={getStoryPhoto(stories.find(s => s._id === id))}
                            alt="selected"
                            width={32}
                            height={32}
                            className="object-cover"
                          />
                        </div>
                      ))}
                      {selectedStories.length > 5 && (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500">
                          +{selectedStories.length - 5}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="space-y-3 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={loading || !title.trim() || selectedStories.length === 0}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
                  >
                    {loading ? (
                      <>
                        <HiArrowPath className="w-4 h-4 animate-spin" />
                        <span>{t("Creating...")}</span>
                      </>
                    ) : (
                      <>
                        <HiPlus className="w-4 h-4" />
                        <span>{t("Create Highlight")}</span>
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={resetForm}
                    className="w-full py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  >
                    {t("Reset")}
                  </button>
                </div>
              </div>

              {/* Right Panel - Stories Grid */}
              <div className="flex-1 flex flex-col p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">
                    {t("Your Stories")} ({stories.length})
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedStories(stories.map(s => s._id))}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
                    >
                      {t("Select All")}
                    </button>
                    <button
                      onClick={() => setSelectedStories([])}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      {t("Clear")}
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-2">
                  {stories.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                      <HiPhoto className="w-16 h-16 opacity-50" />
                      <p className="font-bold text-sm">{t("No stories available")}</p>
                    </div>
                  ) : (
                    <motion.div
                      layout
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-4"
                    >
                      {stories.map((story) => (
                        <StoryCard
                          key={story._id}
                          story={story}
                          isSelected={selectedStories.includes(story._id)}
                          onToggle={handleSelectStory}
                          getStoryPhoto={getStoryPhoto}
                        />
                      ))}
                    </motion.div>
                  )}
                </div>
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
