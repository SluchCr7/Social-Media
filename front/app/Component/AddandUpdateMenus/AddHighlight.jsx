'use client';

import React, { useState, useRef, useEffect, useCallback, memo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  FaTimes,
  FaPlus,
  FaImage,
  FaCheckCircle,
  FaTrashAlt,
  FaFilm,
  FaMagic,
  FaImages
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import Image from 'next/image';
import { useHighlights } from '@/app/Context/HighlightContext';
import { useAlert } from '@/app/Context/AlertContext';

const StoryCard = memo(({ story, isSelected, onToggle, getStoryPhoto }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-50, 50], [15, -15]);
  const rotateY = useTransform(x, [-50, 50], [-15, 15]);

  function handleMouse(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left - rect.width / 2);
    y.set(event.clientY - rect.top - rect.height / 2);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      layout
      style={{ perspective: 1000 }}
      onMouseMove={handleMouse}
      onMouseLeave={handleMouseLeave}
      className="relative aspect-[9/16] cursor-pointer group"
      onClick={() => onToggle(story._id)}
    >
      <motion.div
        style={{ rotateX, rotateY }}
        className={`w-full h-full rounded-2xl overflow-hidden border-2 transition-all duration-300 ${isSelected
          ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.4)]'
          : 'border-transparent hover:border-white/30 shadow-xl'
          }`}
      >
        <Image
          src={getStoryPhoto(story)}
          alt="Story"
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />

        <div className={`absolute inset-0 transition-opacity duration-300 ${isSelected ? 'bg-indigo-500/20' : 'bg-black/20 group-hover:bg-black/10'
          }`} />

        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-3 right-3 z-10"
            >
              <div className="bg-white dark:bg-indigo-500 rounded-full p-1 shadow-lg border border-white/20">
                <FaCheckCircle className="text-indigo-600 dark:text-white text-xl" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
          <p className="text-[10px] text-white/70 font-medium truncate">
            {new Date(story.createdAt).toLocaleDateString()}
          </p>
        </div>
      </motion.div>
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

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  const getStoryPhoto = useCallback((story) => {
    if (!story) return '/placeholder.jpg';
    if (Array.isArray(story.Photo)) return story.Photo[0] || '/placeholder.jpg';
    return story.Photo || '/placeholder.jpg';
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
      return showAlert('⚠️ Please enter a title and select at least one story.');
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-xl p-4 md:p-8"
          onClick={(e) => e.target === e.currentTarget && setOpenModal(false)}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-7xl h-[90vh] rounded-[2.5rem] bg-white dark:bg-gray-900 border border-white/20 dark:border-gray-800 shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            {/* Ambient Background Glows */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />

            {/* Header Area */}
            <div className="relative z-10 flex items-center justify-between px-8 py-6 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                  <FaFilm className="text-white text-xl" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold dark:text-white flex items-center gap-2">
                    Highlight Studio
                    <span className="text-indigo-500"><HiSparkles /></span>
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Curate your best moments into a cinematic collection</p>
                </div>
              </div>

              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setOpenModal(false)}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 transition-colors"
              >
                <FaTimes />
              </motion.button>
            </div>

            {/* Main Content Area */}
            <div className="relative z-10 flex-1 flex flex-col md:flex-row overflow-hidden">

              {/* Left Panel: Preview & Identity */}
              <div className="w-full md:w-80 p-8 border-r border-gray-100 dark:border-gray-800 flex flex-col gap-8 bg-gray-50/50 dark:bg-gray-900/50">

                <div className="flex flex-col gap-6">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Cover Identity</h3>

                  {/* Cover Upload Circle */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="relative w-48 h-48 mx-auto rounded-full p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 cursor-pointer group shadow-2xl"
                  >
                    <div className="w-full h-full rounded-full bg-white dark:bg-gray-900 overflow-hidden relative border-4 border-transparent">
                      {preview ? (
                        <Image src={preview} alt="Cover" fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400 group-hover:text-indigo-500 transition-colors">
                          <FaImage size={40} className="mb-2" />
                          <span className="text-[10px] font-bold">SET COVER</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                        <FaMagic className="text-white text-2xl" />
                      </div>
                    </div>
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleCoverChange} hidden />
                  </div>

                  <div className="space-y-4">
                    <div className="relative group">
                      <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Name your Highlight..."
                        className="w-full bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-2xl px-4 py-3 text-lg font-bold placeholder:text-gray-300 dark:placeholder:text-gray-600 focus:border-indigo-500 focus:outline-none transition-all"
                      />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600">
                        {title.length}/20
                      </div>
                    </div>

                    <div className="bg-white/50 dark:bg-gray-800/50 rounded-2xl p-4 border border-white/20 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-gray-500">Selected Clips</span>
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-[10px] font-bold">
                          {selectedStories.length}
                        </span>
                      </div>
                      <div className="flex -space-x-2 overflow-hidden py-2">
                        {selectedStories.slice(0, 5).map((id) => (
                          <div key={id} className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 overflow-hidden shadow-md">
                            <Image
                              src={getStoryPhoto(stories.find(s => s._id === id))}
                              alt="selected"
                              width={32}
                              height={32}
                              className="object-cover h-full"
                            />
                          </div>
                        ))}
                        {selectedStories.length > 5 && (
                          <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500">
                            +{selectedStories.length - 5}
                          </div>
                        )}
                        {selectedStories.length === 0 && (
                          <div className="text-[10px] text-gray-400 italic">No stories selected yet...</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={loading}
                    className="w-full py-4 rounded-[1.25rem] bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-xl shadow-indigo-500/20 disabled:opacity-50 flex items-center justify-center gap-3 transition-all"
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <FaPlus />
                        <span>CREATE HIGHLIGHT</span>
                      </>
                    )}
                  </motion.button>

                  <button
                    onClick={resetForm}
                    className="w-full py-3 rounded-[1.25rem] text-sm font-bold text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors"
                  >
                    RESET STUDIO
                  </button>
                </div>
              </div>

              {/* Right Panel: Storyboard Browser */}
              <div className="flex-1 flex flex-col p-8 gap-6 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FaImages className="text-indigo-500" />
                    <h3 className="text-lg font-bold dark:text-white">Your Storyboard</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedStories(stories.map(s => s._id))}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                    >
                      SELECT ALL
                    </button>
                    <button
                      onClick={() => setSelectedStories([])}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-500 hover:bg-gray-200 transition-colors"
                    >
                      CLEAR
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
                  {stories.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 opacity-50">
                      <FaFilm size={60} />
                      <p className="font-bold">YOUR STORYBOARD IS EMPTY</p>
                    </div>
                  ) : (
                    <motion.div
                      layout
                      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pb-8"
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

                <div className="mt-auto px-6 py-4 rounded-3xl bg-gray-50 dark:bg-gray-800/50 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-100 dark:border-gray-700/50">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-2">
                      <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]" />
                      <div className="w-3 h-3 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.6)]" />
                      <div className="w-3 h-3 rounded-full bg-pink-500 shadow-[0_0_8px_rgba(236,72,153,0.6)]" />
                    </div>
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Cinema Engine Active</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                    Total Assets: <span className="font-bold dark:text-white px-2">{stories.length}</span>
                    / Selected: <span className="font-bold text-indigo-500 dark:text-indigo-400 px-2">{selectedStories.length}</span>
                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AddHighlightMenu.displayName = 'AddHighlightMenu'
export default AddHighlightMenu;
