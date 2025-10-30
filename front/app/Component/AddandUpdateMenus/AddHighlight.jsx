'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaImage, FaCheckCircle, FaTrashAlt } from 'react-icons/fa';
import Image from 'next/image';
import { useHighlights } from '@/app/Context/HighlightContext';

// Redesigned AddHighlightMenu — modern, responsive, preserves ALL original functionality
// Exports a single default React component. Uses Tailwind for styling.

export default function AddHighlightMenu({ stories = [] }) {
  const [title, setTitle] = useState('');
  const [coverFile, setCoverFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedStories, setSelectedStories] = useState([]);

  // keep original context API usage intact
  const { createHighlight, loading, setOpenModal, openModal } = useHighlights();

  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Normalize story photo (keeps parity with original behavior)
  const getStoryPhoto = (story) => {
    if (!story) return '/placeholder.jpg';
    if (Array.isArray(story.Photo)) return story.Photo[0] || '/placeholder.jpg';
    return story.Photo || '/placeholder.jpg';
  };

  // cleanup objectURL (same effect as original)
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleSelectStory = (id) => {
    setSelectedStories((prev) => (prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]));
  };

  const handleCoverChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    const url = URL.createObjectURL(file);
    setCoverFile(file);
    setPreview(url);
  };

  const resetForm = () => {
    setTitle('');
    setCoverFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
      setPreview(null);
    }
    setSelectedStories([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCreate = async () => {
    if (!title.trim() || selectedStories.length === 0) {
      return window.alert('Please enter a title and select at least one story.');
    }
    try {
      await createHighlight({ title: title.trim(), cover: coverFile, storyIds: selectedStories });
      resetForm();
      setOpenModal(false);
    } catch (err) {
      console.error('Highlight creation failed:', err);
      window.alert('Failed to create highlight. Try again.');
    }
  };

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setOpenModal(false);
    }
  };

  return (
    <AnimatePresence>
      {openModal && (
        <motion.div
          role="dialog"
          aria-modal="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onMouseDown={handleBackdropClick}
        >
          <motion.div
            ref={modalRef}
            initial={{ y: 20, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 20, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="relative w-[95%] max-w-4xl rounded-3xl bg-white/75 dark:bg-gray-900/85 backdrop-blur-xl border border-white/10 dark:border-gray-700 p-4 shadow-2xl overflow-hidden"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {/* Top bar */}
            <div className="flex items-center justify-between gap-3 px-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-800/60 shadow-sm">
                  <FaImage className="text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500">
                    Create Highlight
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Pick a cover, title and stories to bundle</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Quick reset (keeps original functions intact) */}
                <button
                  onClick={resetForm}
                  className="hidden sm:inline-flex items-center gap-2 text-sm px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 hover:bg-white/70 transition"
                  aria-label="Reset form"
                >
                  <FaTrashAlt /> Reset
                </button>

                <button
                  aria-label="Close"
                  onClick={() => setOpenModal(false)}
                  className="rounded-full p-2 text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition"
                >
                  <FaTimes size={16} />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
              {/* LEFT: Cover + Title + Actions */}
              <div className="md:col-span-1 flex flex-col gap-4">
                {/* Cover upload area */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => (e.key === 'Enter' ? fileInputRef.current?.click() : null)}
                  className="relative h-56 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700 cursor-pointer overflow-hidden flex items-center justify-center group bg-gradient-to-tr from-white/40 to-transparent"
                >
                  {preview ? (
                    <>
                      <Image src={preview} alt="cover preview" fill className="object-cover" />
                      <div className="absolute inset-0 flex items-end justify-between p-3 pointer-events-none">
                        <div className="text-xs text-white bg-black/40 px-2 py-1 rounded-md">Preview</div>
                        <div className="text-xs text-white bg-black/40 px-2 py-1 rounded-md">Tap to change</div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-500 dark:text-gray-400 pointer-events-none">
                      <FaImage size={28} />
                      <div className="text-sm">Upload cover image</div>
                      <div className="text-xs">PNG, JPG — recommended 1080×1920</div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    id="coverUpload"
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    hidden
                  />
                </div>

                {/* Title input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Title</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. My Trips 🌍"
                    className="mt-2 w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                    aria-label="Highlight title"
                  />
                </div>

                {/* Small info + count */}
                <div className="flex items-center gap-3 mt-2">
                  <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700">
                    <Image src={preview || '/placeholder.jpg'} alt="cover small" width={48} height={48} className="object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{title || 'Untitled Highlight'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{selectedStories.length} selected</div>
                  </div>
                </div>

                {/* Actions row */}
                <div className="mt-3 grid grid-cols-2 gap-3">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={handleCreate}
                    disabled={loading}
                    className={`w-full py-2.5 rounded-xl font-semibold text-white ${
                      loading ? 'opacity-70 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-600 to-purple-600'
                    } shadow-lg`}
                    aria-disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm">Saving…</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <FaPlus /> <span>Create</span>
                      </div>
                    )}
                  </motion.button>

                  <button
                    onClick={() => {
                      resetForm();
                      fileInputRef.current?.focus();
                    }}
                    className="w-full py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 font-semibold bg-white/50 dark:bg-gray-800/50"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* RIGHT: Stories grid + helpers */}
              <div className="md:col-span-2 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-200">Select Stories</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Click or tap to include stories into this highlight</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedStories(stories.map((s) => s._id))}
                      className="text-xs px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-700 text-indigo-600 dark:text-indigo-200"
                    >
                      Select all
                    </button>
                    <button
                      onClick={() => setSelectedStories([])}
                      className="text-xs px-3 py-1 rounded-lg bg-white/50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-[420px] overflow-y-auto pr-2">
                  {stories.length === 0 ? (
                    <div className="col-span-full text-center py-6 text-gray-500 dark:text-gray-400">No stories available.</div>
                  ) : (
                    stories.map((story) => {
                      const id = story._id;
                      const selected = selectedStories.includes(id);
                      const src = getStoryPhoto(story);

                      return (
                        <motion.div
                          key={id}
                          layout
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSelectStory(id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => (e.key === 'Enter' ? handleSelectStory(id) : null)}
                          className={`relative rounded-lg overflow-hidden cursor-pointer border ${
                            selected
                              ? 'border-indigo-500 shadow-[0_8px_30px_rgba(99,102,241,0.12)] ring-1 ring-indigo-200'
                              : 'border-transparent'
                          }`}
                        >
                          <div className="aspect-[3/4] relative w-full">
                            <Image src={src} alt={`story-${id}`} fill className="object-cover" />

                            <div
                              className={`absolute inset-0 transition-opacity ${
                                selected ? 'bg-gradient-to-tr from-indigo-500/30 to-purple-500/20' : 'bg-black/0'
                              }`}
                            />

                            {selected && (
                              <div className="absolute top-2 left-2 bg-white/90 dark:bg-black/60 rounded-full p-1">
                                <FaCheckCircle className="text-indigo-600" />
                              </div>
                            )}
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                </div>

                {/* Footer helper */}
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center justify-between">
                  <div>{selectedStories.length} selected</div>
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:inline text-xs text-gray-500">Tip: Use Select all to quickly add many stories.</div>
                    <button
                      onClick={() => {
                        // keep functionality: focus file input to encourage upload
                        fileInputRef.current?.click();
                      }}
                      className="text-xs px-3 py-1 rounded-lg border border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50"
                    >
                      Upload new cover
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

