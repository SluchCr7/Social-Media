'use client';
import React, { useEffect, useState } from 'react';
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
      setError('');
    }
  };

  const handleTextChange = (e) => {
    setStoryText(e.target.value);
    setError('');
  };

  const handleSubmit = () => {
    if (!storyText && !storyImage) {
      setError('You must add text or image');
      return;
    }

    const storyData = {
      text: storyText || '',
      file: storyImage || null,
    };

    addNewStory(storyData);
    clearInput();
    setIsStory(false);
  };

  const clearInput = () => {
    setStoryImage(null);
    setStoryText('');
    setError('');
  };

  useEffect(() => {
    console.log(storyImage);
  }, [storyImage]);

  return (
    <AnimatePresence>
      {isStory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-lg"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-[90%] max-w-md bg-white dark:bg-[#1c1c1e] rounded-3xl shadow-2xl ring-1 ring-black/10 dark:ring-white/10 p-6 flex flex-col gap-4"
          >
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 text-gray-700 dark:text-gray-300 hover:text-red-500 text-2xl transition"
              onClick={() => setIsStory(false)}
            >
              <IoClose />
            </button>

            {/* Title */}
            <h2 className="text-center text-3xl font-extrabold tracking-wide text-gray-900 dark:text-gray-100">
              Add Story
            </h2>
            <div className="border-b border-gray-300 dark:border-gray-700" />

            {/* Error Message */}
            {error && (
              <p className="text-red-500 text-sm text-center animate-pulse">{error}</p>
            )}

            {/* Textarea */}
            <textarea
              value={storyText}
              onChange={handleTextChange}
              placeholder="Write your story..."
              rows={4}
              className="w-full p-4 rounded-2xl bg-gradient-to-b from-gray-100 to-gray-50 dark:from-gray-900 dark:to-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 italic border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 resize-none transition-shadow shadow-inner shadow-black/20"
            />

            {/* Image Upload */}
            <div>
              {!storyImage && (
                <label className="flex items-center justify-center gap-2 w-full cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-2 px-4 rounded-2xl transition shadow-md hover:shadow-lg transform hover:scale-105">
                  <IoImage className="text-xl" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Image Preview */}
            {storyImage && (
              <div className="relative">
                <img
                  src={URL.createObjectURL(storyImage)}
                  alt="Preview"
                  className="rounded-2xl max-h-64 w-full object-contain border-2 border-gray-200 dark:border-gray-700 shadow-lg"
                />
                <button
                  onClick={() => setStoryImage(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-md transition"
                  title="Remove Image"
                >
                  <IoTrash className="text-sm" />
                </button>
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              className="mt-auto flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 w-full py-3 rounded-2xl text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 active:scale-95"
            >
              <IoImage className="text-xl" /> Share Story
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddStoryModel;
