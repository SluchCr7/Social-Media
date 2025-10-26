'use client';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaPlus, FaImage, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import Image from 'next/image';
import { useHighlights } from '@/app/Context/HighlightContext';

export default function AddHighlightMenu({ stories = [] }) {
  const [title, setTitle] = useState('');
  const [cover, setCover] = useState(null);
  const [selectedStories, setSelectedStories] = useState([]);
  const [preview, setPreview] = useState(null);

  const { createHighlight, loading,setOpenModal, openModal } = useHighlights();

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
    } catch (err) {
      console.error('Highlight creation failed:', err);
    }
  };

  return (
      <AnimatePresence>
        {
            openModal && (  
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
                        rounded-2xl p-6 w-[90%] max-w-md shadow-xl relative
                    "
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 40, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                    {/* Close Button */}
                    <button
                        onClick={() => setOpenModal(false)}
                        className="absolute top-3 right-3 text-lightMode-text dark:text-darkMode-text hover:opacity-80"
                    >
                        <FaTimes size={18} />
                    </button>
            
                    <h2 className="text-xl font-semibold mb-4 text-lightMode-text dark:text-darkMode-text">
                        Create New Highlight
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
                            w-full rounded-lg p-2 
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
                        className="
                            flex items-center justify-center rounded-lg 
                            bg-lightMode-bg dark:bg-darkMode-bg border-2 
                            border-dashed border-gray-300 dark:border-gray-700 
                            h-32 cursor-pointer hover:bg-lightMode-menu dark:hover:bg-darkMode-bg
                            transition-colors
                        "
                        onClick={() => document.getElementById('coverUpload').click()}
                        >
                        {preview ? (
                            <Image
                            src={preview}
                            alt="Cover Preview"
                            width={120}
                            height={120}
                            className="rounded-lg object-cover h-full w-auto"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-1 text-lightMode-text2 dark:text-darkMode-text2">
                            <FaImage size={24} />
                            <span>Click to upload image</span>
                            </div>
                        )}
                        </div>
                        <input
                        id="coverUpload"
                        type="file"
                        accept="image/*"
                        onChange={handleCoverChange}
                        hidden
                        />
                    </div>
            
                    {/* Story Selection */}
                    <div className="mb-5">
                        <label className="block text-sm font-medium mb-2 text-lightMode-text2 dark:text-darkMode-text2">
                        Select Stories to include
                        </label>
                        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
                        {stories.length === 0 && (
                            <p className="text-gray-500 text-sm">No stories available yet.</p>
                        )}
                        {stories.map((story) => (
                            <div
                            key={story._id}
                            onClick={() => handleSelectStory(story._id)}
                            className={`
                                relative w-20 h-28 rounded-lg overflow-hidden cursor-pointer 
                                border-2 
                                ${
                                selectedStories.includes(story._id)
                                    ? 'border-lightMode-text dark:border-darkMode-text'
                                    : 'border-transparent'
                                }
                                transition-all hover:scale-105
                            `}
                            >
                            <Image
                                src={story.Photo || '/placeholder.jpg'}
                                alt="Story"
                                fill
                                className="object-cover"
                            />
                            {selectedStories.includes(story._id) && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <FaCheckCircle className="text-lightMode-text dark:text-darkMode-text" />
                                </div>
                            )}
                            </div>
                        ))}
                        </div>
                    </div>
            
                    {/* Create Button */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCreate}
                        disabled={loading}
                        className={`
                        w-full py-2 rounded-lg 
                        bg-lightMode-text dark:bg-darkMode-text 
                        text-white font-semibold flex items-center justify-center gap-2
                        hover:opacity-90 transition-all relative
                        ${loading ? 'opacity-70 cursor-not-allowed' : ''}
                        `}
                    >
                        {loading ? (
                        <motion.div
                            className="flex items-center gap-2"
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                        >
                            <FaSpinner className="animate-spin" />
                            <span>Creating...</span>
                        </motion.div>
                        ) : (
                        <>
                            <FaPlus /> <span>Create Highlight</span>
                        </>
                        )}
                    </motion.button>
                    </motion.div>
                </motion.div>
            )
        }
    </AnimatePresence>
  );
}
