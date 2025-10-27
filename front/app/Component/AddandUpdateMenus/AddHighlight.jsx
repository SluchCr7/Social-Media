'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaImage, FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';
import { useHighlights } from '@/app/Context/HighlightContext';

export default function AddHighlightMenu({ stories = [] }) {
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState(null);
  const [preview, setPreview] = useState(null);
  const [selectedStories, setSelectedStories] = useState([]);

  const { createHighlight, loading, setOpenModal, openModal } = useHighlights();

  const handleSelectStory = (id) => {
    setSelectedStories((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleCoverChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCover(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleCreate = async () => {
    if (!title || selectedStories.length === 0)
      return alert('Please enter a title and select at least one story.');

    try {
      await createHighlight({ title, cover, storyIds: selectedStories });
        setOpenModal(false);
        setTitle("")
        setCover(null)
        setSelectedStories([])
    } catch (err) {
      console.error('Highlight creation failed:', err);
    }
  };

  return (
    <AnimatePresence>
      {openModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              bg-lightMode-menu dark:bg-darkMode-menu
              text-lightMode-fg dark:text-darkMode-fg
              rounded-2xl p-6 w-[90%] max-w-md shadow-2xl relative
            "
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 text-lightMode-text dark:text-darkMode-text hover:opacity-80"
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-xl font-semibold mb-5 text-center text-lightMode-text dark:text-darkMode-text">
              ✨ Create New Highlight
            </h2>

            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1 text-lightMode-text2 dark:text-darkMode-text2">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. My Trips 🌍"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
                  w-full rounded-lg p-2.5 
                  bg-lightMode-bg dark:bg-darkMode-bg 
                  border border-gray-200 dark:border-gray-700
                  focus:outline-none focus:ring-2 
                  focus:ring-lightMode-text dark:focus:ring-darkMode-text
                "
              />
            </div>

            {/* Cover Upload */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2 text-lightMode-text2 dark:text-darkMode-text2">
                Cover Image
              </label>
              <div
                onClick={() => document.getElementById('coverUpload').click()}
                className="
                  relative flex items-center justify-center rounded-lg 
                  bg-lightMode-bg dark:bg-darkMode-bg border-2 
                  border-dashed border-gray-300 dark:border-gray-700 
                  h-36 cursor-pointer overflow-hidden
                  hover:bg-lightMode-menu dark:hover:bg-darkMode-bg transition
                "
              >
                {preview ? (
                  <>
                    <Image
                      src={preview}
                      alt="Cover Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-end justify-end p-2">
                      <button className="bg-white/90 dark:bg-black/60 text-xs px-2 py-1 rounded-md">
                        Change
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-lightMode-text2 dark:text-darkMode-text2">
                    <FaImage size={24} />
                    <span>Click to upload image</span>
                  </div>
                )}
                <input
                  id="coverUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleCoverChange}
                  hidden
                />
              </div>
            </div>

            {/* Story Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-lightMode-text2 dark:text-darkMode-text2">
                Select Stories
              </label>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                {stories.length === 0 && (
                  <p className="text-gray-500 text-sm">No stories available.</p>
                )}
                {stories.map((story) => (
                  <motion.div
                    key={story._id}
                    onClick={() => handleSelectStory(story._id)}
                    whileHover={{ scale: 1.05 }}
                    className={`
                      relative w-20 h-28 rounded-xl overflow-hidden cursor-pointer 
                      transition-all border-2
                      ${
                        selectedStories.includes(story._id)
                          ? 'border-lightMode-text dark:border-darkMode-text shadow-md shadow-lightMode-text/30 dark:shadow-darkMode-text/20'
                          : 'border-transparent'
                      }
                    `}
                  >
                    <Image
                      src={story.Photo || story.Photo[0] || '/placeholder.jpg'}
                      alt="Story"
                      fill
                      className="object-cover"
                    />
                    {selectedStories.includes(story._id) && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <FaCheckCircle className="text-lightMode-text dark:text-darkMode-text text-xl" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Create Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleCreate}
              disabled={loading}
              className={`
                w-full py-2.5 rounded-lg 
                bg-gradient-to-r from-lightMode-text to-purple-500 
                dark:from-darkMode-text dark:to-purple-600
                text-white font-semibold flex items-center justify-center gap-2
                shadow-md hover:shadow-lg transition-all
                ${loading ? 'opacity-75 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <motion.div
                  className="flex items-center gap-2"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Saving your memories…</span>
                </motion.div>
              ) : (
                <>
                  <FaPlus /> <span>Create Highlight</span>
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
