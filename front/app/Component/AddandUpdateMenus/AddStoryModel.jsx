'use client';
import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  IoClose,
  IoImage,
  IoTrash,
  IoCamera,
  IoCheckmarkCircleOutline,
  IoCloudUploadOutline,
  IoShareSocialOutline,
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { useStory } from '../../Context/StoryContext';
import { useAuth } from '../../Context/AuthContext';
import { useGetData } from '@/app/Custome/useGetData';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';

const AddStoryModel = React.memo(({ setIsStory, isStory }) => {
  const [storyText, setStoryText] = useState('');
  const [storyImage, setStoryImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [success, setSuccess] = useState(false);
  const [collaborators, setCollaborators] = useState([]);

  const { addNewStory } = useStory();
  const { user } = useAuth();
  const { userData } = useGetData(user?._id);
  const { t } = useTranslation();

  // 🧠 حفظ المسودة بذكاء (Throttle الكتابة)
  useEffect(() => {
    const saved = localStorage.getItem('storyDraft');
    if (saved) setStoryText(saved);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      localStorage.setItem('storyDraft', storyText);
    }, 400);
    return () => clearTimeout(timeout);
  }, [storyText]);

  // 🧩 Memoized Collaborator Options
  const collaboratorOptions = useMemo(
    () =>
      (userData?.following || []).map((f) => ({
        value: f._id,
        label: `@${f.username}`,
        avatar: f.profilePhoto?.url || '/default-avatar.png',
      })),
    [userData?.following]
  );


  // 📷 Handlers — useCallback لتثبيتها
  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 5 * 1024 * 1024) {
        setError(t('Image size should not exceed 5MB.'));
        return;
      }
      setStoryImage(file);
      setError('');
    },
    [t]
  );

  const handleTextChange = useCallback((e) => {
    setStoryText(e.target.value);
    setError('');
  }, []);

  const clearInput = useCallback(() => {
    setStoryImage(null);
    setStoryText('');
    setError('');
    setCollaborators([]);
  }, []);

  const simulateUploadProgress = useCallback(() => {
    setIsUploading(true);
    setUploadProgress(0);
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress >= 100) {
          clearInterval(interval);
          setUploadProgress(100);
          setTimeout(() => {
            setIsUploading(false);
            resolve();
          }, 500);
        } else {
          setUploadProgress(progress);
        }
      }, 300);
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!storyText.trim() && !storyImage) {
      setError(t('Please add text or an image to share your story'));
      return;
    }

    setIsLoading(true);
    setSuccess(false);
    setError('');

    if (storyImage) await simulateUploadProgress();

    try {
      await addNewStory({
        text: storyText.trim(),
        file: storyImage || null,
        collaborators: collaborators.map((c) => c.value),
      });
      setSuccess(true);
      clearInput();
      localStorage.removeItem('storyDraft');
      setTimeout(() => setIsStory(false), 2000);
    } catch {
      setError(t('Failed to publish story. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, [storyText, storyImage, collaborators, simulateUploadProgress, addNewStory, clearInput, t, setIsStory]);

  // 🧹 تنظيف URL.createObjectURL لمنع التسرب
  useEffect(() => {
    if (!storyImage) return;
    const imgURL = URL.createObjectURL(storyImage);
    return () => URL.revokeObjectURL(imgURL);
  }, [storyImage]);

  return (
    <AnimatePresence>
      {isStory && (
        <motion.div
          key="storyModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
          onClick={(e) => e.target === e.currentTarget && setIsStory(false)}
        >
          <motion.div
            key="modalCard"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            className="relative w-[95%] max-w-lg rounded-3xl p-6 shadow-2xl transition-all 
                       bg-lightMode-fg dark:bg-darkMode-fg border border-lightMode-fg dark:border-darkMode-fg
                       dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_120px_-20px_rgba(76,111,255,0.1)] 
                       flex flex-col"
          >
            {/* Upload overlay */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 rounded-3xl"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="text-lightMode-text dark:text-darkMode-text text-5xl mb-4"
                  >
                    <IoCloudUploadOutline />
                  </motion.div>
                  <p className="text-gray-200 font-medium mb-2">{t('Uploading Story')}</p>
                  <div className="w-3/4 h-1.5 bg-darkMode-border rounded-full overflow-hidden mt-2">
                    <motion.div
                      className="h-full bg-lightMode-bg dark:bg-darkMode-bg rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ ease: 'easeInOut', duration: 0.3 }}
                    />
                  </div>
                  <p className="text-sm text-gray-400 mt-2">{Math.floor(uploadProgress)}%</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex justify-between items-center pb-4 border-b border-lightMode-border dark:border-darkMode-border/50">
              <h2 className="text-2xl font-extrabold text-lightMode-text dark:text-darkMode-text">
                {t('Create Your Story')} 💬
              </h2>
              <motion.button
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsStory(false)}
                className="p-2 bg-lightMode-bg/50 dark:bg-darkMode-bg/50 rounded-full shadow-md text-lightMode-text dark:text-darkMode-text"
              >
                <IoClose className="text-xl" />
              </motion.button>
            </div>

            {/* Image Preview */}
            {storyImage && (
              <motion.div
                key="imagePreview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative my-4 rounded-3xl overflow-hidden shadow-xl"
              >
                <motion.img
                  src={URL.createObjectURL(storyImage)}
                  alt="Story preview"
                  className="w-full h-72 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setStoryImage(null)}
                  className="absolute top-3 right-3 bg-red-600 hover:bg-red-700 text-white p-2 rounded-full shadow-lg transition"
                >
                  <IoTrash />
                </motion.button>
                <div className="absolute bottom-3 left-4 bg-black/60 text-xs px-3 py-1 rounded-full text-gray-200 font-medium">
                  {Math.round(storyImage.size / 1024)} KB
                </div>
              </motion.div>
            )}

            {/* Image Drop Zone */}
            {!storyImage && (
              <label
                className={`w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-colors mt-4
                ${error ? 'border-red-500' : 'border-lightMode-primary/50 dark:border-darkMode-primary/50 hover:border-lightMode-accent dark:hover:border-darkMode-accent'} 
                bg-lightMode-bg dark:bg-darkMode-bg/50`}
              >
                <IoImage className="text-4xl text-lightMode-textSoft dark:text-darkMode-textSoft mb-2" />
                <p className="font-semibold text-lightMode-text dark:text-darkMode-text">
                  {t('Drag and drop an image or click to upload')}
                </p>
                <p className="text-sm text-lightMode-textSoft dark:text-darkMode-textSoft mt-1">
                  JPEG, PNG up to 5MB
                </p>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}

            {/* Text Input */}
            <div className="relative flex flex-col mt-4">
              <motion.textarea
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                value={storyText}
                onChange={handleTextChange}
                placeholder={t('What is the story about? (300 characters max)...')}
                rows={storyImage ? 2 : 4}
                maxLength={300}
                className="w-full p-4 rounded-xl bg-lightMode-bg dark:bg-darkMode-bg/50 text-lightMode-text dark:text-darkMode-text placeholder-lightMode-textSoft dark:placeholder-darkMode-textSoft italic border border-lightMode-border dark:border-darkMode-border focus:outline-none focus:ring-2 focus:ring-lightMode-primary dark:focus:ring-darkMode-primary shadow-inner transition resize-none"
              />
              <div className="flex justify-between items-center pt-2">
                <span className="text-xs text-lightMode-textSoft dark:text-darkMode-textSoft">
                  {storyText.length}/300
                </span>
                <div className="flex gap-2">
                  <label
                    title={t('Take Photo')}
                    className="p-2 bg-lightMode-menu dark:bg-darkMode-menu text-lightMode-text2 dark:text-darkMode-text2 rounded-full cursor-pointer hover:opacity-80 transition"
                  >
                    <IoCamera className="text-xl" />
                    <input
                      type="file"
                      accept="image/*"
                      capture="camera"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                  <label
                    title={t('Upload from Gallery')}
                    className="p-2 bg-lightMode-bg/10 dark:bg-darkMode-bg/20 text-lightMode-fg dark:text-darkMode-fg rounded-full cursor-pointer hover:opacity-80 transition"
                  >
                    <IoImage className="text-xl" />
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            {/* Collaborators */}
            {userData?.following?.length > 0 && (
              <div className="pt-4">
                <label className="block text-lightMode-textSoft dark:text-darkMode-textSoft text-sm mb-2 font-medium">
                  {t('Tag Collaborators')} ({t('optional')})
                </label>
                <Select
                  isMulti
                  options={collaboratorOptions}
                  value={collaborators}
                  onChange={setCollaborators}
                  placeholder={t('Select followers to collaborate with...')}
                  formatOptionLabel={(option) => (
                    <div className="flex items-center gap-2">
                      <Image
                        width={500}
                        height={500}
                        src={option.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span>{option.label}</span>
                    </div>
                  )}
                  classNamePrefix="select"
                />
              </div>
            )}

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-500 text-sm mt-3 font-medium text-center"
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading || isUploading || (!storyText.trim() && !storyImage)}
                className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-extrabold text-lightMode-fg dark:text-darkMode-fg text-lg transition-all duration-300
                bg-lightMode-bg hover:bg-lightMode-bg/90 dark:bg-darkMode-bg dark:hover:bg-darkMode-bg/90 
                  shadow-xl ${
                  isLoading || isUploading || (!storyText.trim() && !storyImage)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:shadow-2xl cursor-pointer'
                }`}
              >
                {isLoading ? (
                  <motion.span
                    className="w-6 h-6 border-3 border-t-transparent border-lightMode-primary dark:border-darkMode-primary rounded-full animate-spin"
                  ></motion.span>
                ) : success ? (
                  <>
                    <IoCheckmarkCircleOutline className="text-2xl text-green-500" />
                    {t('Story Published!')}
                  </>
                ) : (
                  <>
                    <IoShareSocialOutline className="text-2xl text-lightMode-primary dark:text-darkMode-primary" />
                    {t('Share Story')}
                  </>
                )}
              </motion.button>
            </div>

            {/* Clear Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearInput}
              disabled={isLoading || isUploading}
              className="mt-3 w-full py-2 text-sm text-lightMode-textSoft dark:text-darkMode-textSoft hover:text-lightMode-text dark:hover:text-darkMode-text transition font-medium"
            >
              {t('Clear All')}
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AddStoryModel.displayName = 'AddStoryModel'
export default AddStoryModel;
