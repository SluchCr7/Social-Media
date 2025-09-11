'use client';
import React, { useState } from 'react';
import { IoClose, IoImage, IoTrash } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '../Context/StoryContext';

const AddStoryModel = ({ setIsStory, isStory }) => {
  const [storyText, setStoryText] = useState('');
  const [storyImage, setStoryImage] = useState(null);
  const [error, setError] = useState('');
  const { addNewStory } = useStory();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setStoryImage(file);
      setStoryText('');
      setError('');
    }
  };

  const handleTextChange = (e) => {
    setStoryText(e.target.value);
    setStoryImage(null);
    setError('');
  };

  const handleSubmit = () => {
    if (!storyText && !storyImage) {
      setError('You must add text or image');
      return;
    }

    const storyData = storyImage
      ? { type: 'image', file: storyImage }
      : { type: 'text', text: storyText };

    addNewStory(storyData);
    clearInput();
    setIsStory(false);
  };

  const clearInput = () => {
    setStoryImage(null);
    setStoryText('');
    setError('');
  };

  return (
    <AnimatePresence>
      {isStory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-[90%] max-w-md bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl p-6 flex flex-col"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-500 text-2xl transition"
              onClick={() => setIsStory(false)}
            >
              <IoClose />
            </button>

            {/* Title */}
            <h2 className="text-center text-3xl font-extrabold mb-4 text-gray-900 dark:text-gray-100">
              Add Story
            </h2>
            <div className="border-b border-gray-300 dark:border-gray-700 mb-4" />

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center mb-2">{error}</p>
            )}

            {/* Textarea */}
            {!storyImage && (
              <textarea
                value={storyText}
                onChange={handleTextChange}
                placeholder="Write your story..."
                rows={4}
                className="w-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4 rounded-2xl mb-4 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
              />
            )}

            {/* Image Upload */}
            {!storyText && (
              <div className="mb-4">
                <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-2xl transition">
                  <IoImage className="text-xl" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {/* Image Preview */}
            {storyImage && (
              <div className="relative mb-4">
                <img
                  src={URL.createObjectURL(storyImage)}
                  alt="Preview"
                  className="rounded-2xl max-h-64 w-full object-contain border border-gray-200 dark:border-gray-700"
                />
                <button
                  onClick={clearInput}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                  title="Remove Image"
                >
                  <IoTrash className="text-sm" />
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="mt-auto bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 w-full py-3 rounded-2xl text-white font-bold text-lg transition transform hover:scale-105"
            >
              Share Story
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddStoryModel;
