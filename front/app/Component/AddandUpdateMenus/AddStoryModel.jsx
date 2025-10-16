
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { IoClose, IoImage, IoTrash, IoCamera, IoCheckmarkCircleOutline, IoCloudUploadOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { useStory } from '../../Context/StoryContext';
import { useAuth } from '../../Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useGetData } from '@/app/Custome/useGetData';
import { useTranslation } from 'react-i18next';

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
  const {userData} = useGetData(user?._id)
  const {t} = useTranslation()
  useEffect(() => {
    const saved = localStorage.getItem('storyDraft');
    if (saved) setStoryText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('storyDraft', storyText);
  }, [storyText]);

  const collaboratorOptions = useMemo(() =>
    (userData?.following || []).map(f => ({
      value: f._id,
      label: `@${f.username}`,
      avatar: f.profilePhoto?.url || '/default-avatar.png',
    }))
  , [userData?.following]);

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

    // محاكاة رفع فعلي (يمكن لاحقًا ربطه بـ Axios progress)
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
      collaborators: collaborators.length ? collaborators.map(c => c.value) : [],
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

  const gradient = storyImage
    ? 'from-purple-500/30 via-indigo-500/30 to-fuchsia-500/30'
    : 'from-emerald-500/30 via-green-500/30 to-lime-500/30';

  return (
    <AnimatePresence>
      {isStory && (
        <motion.div
          key="storyModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center
                     bg-gradient-to-br from-black/70 via-gray-900/70 to-black/70 backdrop-blur-lg"
          onClick={(e) => e.target === e.currentTarget && setIsStory(false)}
        >
          <motion.div
            key="modalCard"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
            className={`relative w-[90%] max-w-md rounded-3xl p-6 shadow-2xl
                       bg-gradient-to-br ${gradient}
                       dark:from-black/40 border border-white/10 backdrop-blur-2xl
                       flex flex-col gap-5 overflow-hidden`}
          >
            {/* Overlay أثناء الرفع */}
            <AnimatePresence>
              {isUploading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/60 backdrop-blur-md rounded-3xl"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1.2 }}
                    className="text-green-400 text-5xl mb-4"
                  >
                    <IoCloudUploadOutline />
                  </motion.div>

                  <p className="text-gray-200 font-medium mb-2">{t("Uploading Story")}</p>

                  <div className="w-3/4 h-2 bg-gray-700 rounded-full overflow-hidden mt-2">
                    <motion.div
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
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
              className="absolute top-4 right-4 p-2 bg-black/40 hover:bg-black/60
                         rounded-full text-white text-xl transition"
            >
              <IoClose />
            </motion.button>

            <h2 className="text-center text-3xl font-extrabold text-transparent 
                           bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
              {t("Add Story")}
            </h2>

            {/* Success Animation */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-green-400"
                >
                  <IoCheckmarkCircleOutline className="text-5xl mb-2" />
                  <p className="font-semibold">{t("Story shared successfully!")}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <textarea
              value={storyText}
              onChange={handleTextChange}
              placeholder={t("Share your thoughts or upload an image...")}
              rows={4}
              maxLength={300}
              className="w-full p-4 rounded-2xl bg-gradient-to-b from-gray-100/10 
                         to-gray-50/5 dark:from-gray-900/40 dark:to-gray-800/40 
                         text-gray-200 placeholder-gray-400 italic border border-gray-600/40 
                         focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-1 
                         resize-none transition-shadow shadow-inner"
            />

            {/* Upload Section */}
            <div className="w-full">
              {!storyImage ? (
                <div className="flex gap-3">
                  <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer 
                                    bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 
                                    hover:from-green-600 hover:to-emerald-700 text-white font-semibold 
                                    py-2 px-4 rounded-2xl transition shadow-md hover:shadow-xl 
                                    transform hover:scale-105">
                    <IoImage className="text-xl" />
                    <span>{t("Upload Image")}</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                  <label className="flex items-center justify-center gap-2 cursor-pointer 
                                    bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 
                                    hover:to-blue-700 text-white font-semibold py-2 px-4 rounded-2xl 
                                    transition shadow-md hover:shadow-xl transform hover:scale-105">
                    <IoCamera className="text-xl" />
                    <span>{t("Camera")}</span>
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
              {/* Collaborators Selector */}
            {userData?.following?.length > 0 && (
              <div className="w-full">
                <label className="block text-gray-300 text-sm mb-2">
                  {t("Add Collaborators")} ({t("optional")})
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
                        ? '#10b981'
                        : state.isFocused
                        ? '#374151'
                        : '#111827',
                      color: '#fff',
                    }),
                    multiValue: (base) => ({
                    ...base,
                    backgroundColor: '#10b981',
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
              className={`mt-auto flex items-center justify-center gap-2 
                          bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 
                          hover:from-green-600 hover:to-emerald-700 w-full py-3 rounded-2xl 
                          text-white font-bold text-lg shadow-xl hover:shadow-2xl 
                          transition-all ${(isLoading || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="border-t-2 border-white w-5 h-5 rounded-full"
                  />
                  <span>{t("Posting your story")}...</span>
                </>
              ) : (
                <>
                  <IoImage className="text-xl" /> {t("Share Story")}
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
