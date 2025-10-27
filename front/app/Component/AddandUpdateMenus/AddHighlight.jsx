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
      setTitle('');
      setCover(null);
      setSelectedStories([]);
    } catch (err) {
      console.error('Highlight creation failed:', err);
    }
  };

  return (
    <AnimatePresence>
      {openModal && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="
              relative w-[95%] max-w-lg rounded-3xl shadow-2xl 
              bg-gradient-to-br from-white/80 to-white/30 
              dark:from-gray-900/90 dark:to-gray-800/70 
              border border-white/20 dark:border-gray-700/40 
              p-6 backdrop-blur-2xl
            "
            initial={{ scale: 0.95, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 30, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-500 transition"
            >
              <FaTimes size={18} />
            </button>

            <h2 className="text-2xl font-semibold mb-6 text-center bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              ✨ Create New Highlight
            </h2>

            {/* Title Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                Title
              </label>
              <input
                type="text"
                placeholder="e.g. My Trips 🌍"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
                  w-full p-2.5 rounded-xl bg-white/40 dark:bg-gray-800/60 
                  border border-gray-300 dark:border-gray-700
                  focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                  outline-none transition
                "
              />
            </div>

            {/* Cover Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                Cover Image
              </label>
              <div
                onClick={() => document.getElementById('coverUpload').click()}
                className="
                  relative h-40 rounded-xl border-2 border-dashed border-gray-400 dark:border-gray-600 
                  bg-white/40 dark:bg-gray-800/60 cursor-pointer 
                  flex items-center justify-center overflow-hidden
                  hover:border-indigo-500 hover:bg-white/50 dark:hover:bg-gray-700/70 transition
                "
              >
                {preview ? (
                  <>
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                      Change
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                    <FaImage size={26} />
                    <span className="text-sm mt-1">Upload cover image</span>
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

            {/* Stories Grid */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-gray-600 dark:text-gray-300">
                Select Stories
              </label>
              <div className="grid grid-cols-3 gap-3 max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400/40 scrollbar-track-transparent">
                {stories.length === 0 ? (
                  <p className="col-span-3 text-center text-gray-500 text-sm">
                    No stories available.
                  </p>
                ) : (
                  stories.map((story) => {
                    const selected = selectedStories.includes(story._id);
                    return (
                      <motion.div
                        key={story._id}
                        whileHover={{ scale: 1.05 }}
                        onClick={() => handleSelectStory(story._id)}
                        className={`
                          relative rounded-xl overflow-hidden border 
                          ${selected
                            ? 'border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]'
                            : 'border-transparent hover:border-gray-400/60'}
                          transition cursor-pointer
                        `}
                      >
                        <Image
                          src={story.Photo[0] || story.Photo || '/placeholder.jpg'}
                          alt="Story"
                          fill
                          className="object-cover"
                        />
                        {selected && (
                          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/50 to-purple-500/50 flex items-center justify-center">
                            <FaCheckCircle className="text-white text-xl drop-shadow-lg" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleCreate}
              disabled={loading}
              className={`
                w-full py-2.5 rounded-xl font-semibold 
                bg-gradient-to-r from-indigo-500 to-purple-500 
                text-white shadow-lg hover:shadow-indigo-400/40 
                transition-all duration-300
                ${loading ? 'opacity-70 cursor-not-allowed' : ''}
              `}
            >
              {loading ? (
                <motion.div
                  className="flex items-center justify-center gap-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                >
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving your memories…</span>
                </motion.div>
              ) : (
                <>
                  <FaPlus /> Create Highlight
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
