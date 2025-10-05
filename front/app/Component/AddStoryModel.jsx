'use client';
import React, { useEffect, useState } from 'react';
import { IoClose, IoImage, IoTrash, IoCamera } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import { useStory } from '../Context/StoryContext';

const AddStoryModel = ({ setIsStory, isStory }) => {
  const [storyText, setStoryText] = useState('');
  const [storyImage, setStoryImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const handleSubmit = async () => {
    if (!storyText && !storyImage) {
      setError('Please add text or an image to share your story');
      return;
    }

    setIsLoading(true);
    const storyData = { text: storyText || '', file: storyImage || null };
    await addNewStory(storyData);
    setIsLoading(false);
    clearInput();
    setIsStory(false);
  };

  const clearInput = () => {
    setStoryImage(null);
    setStoryText('');
    setError('');
  };

  useEffect(() => {
    if (storyImage) console.log('Image selected:', storyImage.name);
  }, [storyImage]);

  return (
    <AnimatePresence>
      {isStory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center 
                     bg-gradient-to-br from-black/70 via-gray-900/70 to-black/70 backdrop-blur-lg"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: -20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className="relative w-[90%] max-w-md rounded-3xl p-6 shadow-2xl 
                       bg-gradient-to-br from-white/10 via-gray-100/5 to-black/30 
                       dark:from-black/40 border border-white/10 backdrop-blur-xl
                       flex flex-col gap-5"
          >
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsStory(false)}
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60
                         rounded-full text-white text-xl transition"
            >
              <IoClose />
            </motion.button>

            {/* Title */}
            <h2 className="text-center text-3xl font-extrabold text-transparent 
                           bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              Add Story
            </h2>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="text-red-400 text-sm text-center"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            {/* Textarea */}
            <div>
              <textarea
                value={storyText}
                onChange={handleTextChange}
                placeholder="Share your thoughts..."
                rows={4}
                maxLength={300}
                className="w-full p-4 rounded-2xl bg-gradient-to-b from-gray-100/10 
                           to-gray-50/5 dark:from-gray-900/40 dark:to-gray-800/40 
                           text-gray-200 placeholder-gray-400 italic border border-gray-600/40 
                           focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 
                           resize-none transition-shadow shadow-inner"
              />
              <p className="text-xs text-gray-400 text-right mt-1">
                {storyText.length}/300
              </p>
            </div>

            {/* Image Upload or Preview */}
            <div className="w-full">
              {!storyImage ? (
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer 
                                    bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 
                                    hover:from-green-600 hover:to-emerald-700 text-white font-semibold 
                                    py-2 px-4 rounded-2xl transition shadow-md hover:shadow-xl 
                                    transform hover:scale-105">
                    <IoImage className="text-xl" />
                    <span>Upload Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <label className="flex items-center justify-center gap-2 cursor-pointer 
                                    bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 
                                    hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-2xl 
                                    transition shadow-md hover:shadow-xl transform hover:scale-105">
                    <IoCamera className="text-xl" />
                    <span>Camera</span>
                    <input
                      type="file"
                      accept="image/*"
                      capture="camera"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <img
                    src={URL.createObjectURL(storyImage)}
                    alt="Preview"
                    className="rounded-3xl max-h-64 w-full object-cover border border-gray-700/40 shadow-lg group-hover:brightness-75 transition duration-300"
                  />
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setStoryImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 
                               hover:bg-red-600 shadow-md transition"
                    title="Remove Image"
                  >
                    <IoTrash className="text-base" />
                  </motion.button>
                </motion.div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isLoading}
              className={`mt-auto flex items-center justify-center gap-2 
                          bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 
                          hover:from-green-600 hover:to-emerald-700 w-full py-3 rounded-2xl 
                          text-white font-bold text-lg shadow-xl hover:shadow-2xl 
                          transition-all ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                  className="border-t-2 border-white w-5 h-5 rounded-full"
                />
              ) : (
                <>
                  <IoImage className="text-xl" /> Share Story
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddStoryModel;
