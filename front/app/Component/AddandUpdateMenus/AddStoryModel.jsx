'use client';
import React, { useEffect, useState, useMemo } from 'react';
import {
  IoClose,
  IoImage,
  IoTrash,
  IoCamera,
  IoCheckmarkCircleOutline,
  IoCloudUploadOutline,
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { useStory } from '../../Context/StoryContext';
import { useAuth } from '../../Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useGetData } from '@/app/Custome/useGetData';
import { useTranslation } from 'react-i18next';

// 🎨 ألوان الثيم
const colors = {
  lightMode: {
    bg: '#ffffff',
    fg: '#111827',
    text: '#4f46e5',
    text2: '#374151',
    menu: '#f9fafb',
    accent: '#6366f1',
    accentSoft: '#e0e7ff',
  },
  darkMode: {
    bg: '#0a0a0a',
    fg: '#f9fafb',
    text: '#facc15',
    text2: '#e5e7eb',
    menu: '#111827',
    accent: '#818cf8',
    accentSoft: '#312e81',
  },
};

const AddStoryModel = ({ setIsStory, isStory }) => {
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

  useEffect(() => {
    const saved = localStorage.getItem('storyDraft');
    if (saved) setStoryText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('storyDraft', storyText);
  }, [storyText]);

  const collaboratorOptions = useMemo(
    () =>
      (userData?.following || []).map((f) => ({
        value: f._id,
        label: `@${f.username}`,
        avatar: f.profilePhoto?.url || '/default-avatar.png',
      })),
    [userData?.following]
  );

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

  const simulateUploadProgress = async () => {
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
  };

  const handleSubmit = async () => {
    if (!storyText && !storyImage) {
      setError('Please add text or an image to share your story');
      return;
    }

    setIsLoading(true);
    setSuccess(false);

    if (storyImage) await simulateUploadProgress();

    const storyData = {
      text: storyText || '',
      file: storyImage || null,
      collaborators: collaborators.length ? collaborators.map((c) => c.value) : [],
    };

    await addNewStory(storyData);
    setIsLoading(false);
    setSuccess(true);
    clearInput();
    localStorage.removeItem('storyDraft');
    setTimeout(() => setIsStory(false), 2000);
  };

  const clearInput = () => {
    setStoryImage(null);
    setStoryText('');
    setError('');
    setCollaborators([]);
  };

  // ✅ التدرج الخلفي الديناميكي
  const gradient = storyImage
    ? 'from-lightMode-accentSoft via-lightMode-accent to-lightMode-text dark:from-darkMode-accentSoft dark:via-darkMode-accent dark:to-darkMode-text'
    : 'from-lightMode-menu via-lightMode-accentSoft to-white/60 dark:from-darkMode-menu dark:via-darkMode-accentSoft dark:to-[#1e1e1e]';

  return (
    <AnimatePresence>
      {isStory && (
        <motion.div
          key="storyModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center 
                     bg-black/70 backdrop-blur-md"
          onClick={(e) => e.target === e.currentTarget && setIsStory(false)}
        >
          <motion.div
            key="modalCard"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className={`relative w-[90%] max-w-md rounded-[2rem] p-6
                        bg-gradient-to-br ${gradient}
                        border border-white/10 backdrop-blur-2xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]
                        dark:shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)]
                        flex flex-col gap-5 overflow-hidden`}
          >
            {/* Upload overlay */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 rounded-[2rem]"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="text-lightMode-text dark:text-darkMode-text text-5xl mb-4"
                  >
                    <IoCloudUploadOutline />
                  </motion.div>

                  <p className="text-gray-200 font-medium mb-2">{t('Uploading Story')}</p>

                  <div className="w-3/4 h-1.5 bg-lightMode-menu dark:bg-darkMode-menu rounded-full overflow-hidden mt-2">
                    <motion.div
                      className="h-full bg-lightMode-text dark:bg-darkMode-text rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ ease: 'easeInOut', duration: 0.3 }}
                    />
                  </div>

                  <p className="text-sm text-gray-400 mt-2">{Math.floor(uploadProgress)}%</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsStory(false)}
              className="absolute top-4 right-4 p-2 bg-white/20 dark:bg-black/30 backdrop-blur-md
                         hover:bg-white/30 dark:hover:bg-black/50 transition 
                         text-lightMode-text dark:text-darkMode-text rounded-full shadow-lg"
            >
              <IoClose />
            </motion.button>

            {/* Title */}
            <h2
              className="text-center text-3xl font-extrabold text-transparent 
                         bg-clip-text bg-gradient-to-r from-lightMode-text to-lightMode-accent 
                         dark:from-darkMode-text dark:to-darkMode-accent animate-gradient-x"
            >
              {t('Add Story')}
            </h2>

            {/* Success Animation */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-green-500"
                >
                  <IoCheckmarkCircleOutline className="text-5xl mb-2" />
                  <p className="font-semibold">{t('Story shared successfully!')}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}

            {/* Textarea */}
            <motion.textarea
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              value={storyText}
              onChange={handleTextChange}
              placeholder={t('Share your thoughts or upload an image...')}
              rows={4}
              maxLength={300}
              className="w-full p-4 rounded-2xl bg-lightMode-menu/60 dark:bg-darkMode-menu/40
                         text-lightMode-fg dark:text-darkMode-fg placeholder-gray-400 italic 
                         border border-gray-600/40 focus:outline-none focus:ring-2 
                         focus:ring-lightMode-text dark:focus:ring-darkMode-text 
                         focus:ring-offset-1 resize-none shadow-inner transition"
            />

            {/* Upload Section */}
            <div className="w-full">
              {!storyImage ? (
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer 
                                    bg-lightMode-text dark:bg-darkMode-text 
                                    text-white font-semibold py-2 px-4 rounded-2xl 
                                    hover:opacity-90 transition shadow-md hover:shadow-xl">
                    <IoImage className="text-xl" />
                    <span>{t('Upload Image')}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <label className="flex items-center justify-center gap-2 cursor-pointer 
                                    bg-gradient-to-r from-yellow-400 to-amber-500 
                                    hover:from-yellow-500 hover:to-amber-400 text-black font-semibold 
                                    py-2 px-4 rounded-2xl transition shadow-md hover:shadow-xl">
                    <IoCamera className="text-xl" />
                    <span>{t('Camera')}</span>
                    <input type="file" accept="image/*" capture="camera" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="relative group"
                >
                  <motion.img
                    whileHover={{ scale: 1.02 }}
                    src={URL.createObjectURL(storyImage)}
                    alt="Preview"
                    className="rounded-3xl max-h-64 w-full object-cover border border-gray-700/40 shadow-lg transition duration-300"
                  />
                  <div className="absolute bottom-2 right-2 bg-black/50 text-xs text-white px-2 py-1 rounded-full">
                    {Math.round(storyImage.size / 1024)} KB
                  </div>
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

            {/* Collaborators */}
            {userData?.following?.length > 0 && (
              <div className="w-full">
                <label className="block text-gray-300 text-sm mb-2">
                  {t('Add Collaborators')} ({t('optional')})
                </label>
                <Select
                  isMulti
                  options={collaboratorOptions}
                  value={collaborators}
                  onChange={setCollaborators}
                  placeholder="Select collaborators..."
                  formatOptionLabel={(option) => (
                    <div className="flex items-center gap-2">
                      <img src={option.avatar} alt="" className="w-6 h-6 rounded-full" />
                      <span>{option.label}</span>
                    </div>
                  )}
                  classNamePrefix="select"
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: '#1f2937',
                      borderColor: '#374151',
                      borderRadius: '1rem',
                      color: '#fff',
                      padding: '2px',
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: '#111827',
                      color: '#fff',
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? '#5558f1'
                        : state.isFocused
                        ? '#374151'
                        : '#111827',
                      color: '#fff',
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: '#5558f1',
                      color: '#fff',
                    }),
                  }}
                />
              </div>
            )}

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSubmit}
              disabled={isLoading || isUploading}
              className={`mt-auto flex items-center justify-center gap-2 py-3 rounded-2xl 
                          bg-lightMode-text dark:bg-darkMode-text text-white font-bold text-lg 
                          shadow-[0_10px_25px_rgba(79,70,229,0.4)] dark:shadow-[0_10px_25px_rgba(250,204,21,0.15)] 
                          hover:shadow-[0_10px_40px_rgba(79,70,229,0.6)] 
                          transition-all duration-300 ${(isLoading || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="border-t-2 border-white w-5 h-5 rounded-full"
                  />
                  <span>{t('Posting your story')}...</span>
                </>
              ) : (
                <>
                  <IoImage className="text-xl" /> {t('Share Story')}
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
