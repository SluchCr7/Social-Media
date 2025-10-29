// 'use client';
// import React, { useEffect, useState, useMemo } from 'react';
// import {
//   IoClose,
//   IoImage,
//   IoTrash,
//   IoCamera,
//   IoCheckmarkCircleOutline,
//   IoCloudUploadOutline,
// } from 'react-icons/io5';
// import { motion, AnimatePresence } from 'framer-motion';
// import Select from 'react-select';
// import { useStory } from '../../Context/StoryContext';
// import { useAuth } from '../../Context/AuthContext';
// import { useUser } from '@/app/Context/UserContext';
// import { useGetData } from '@/app/Custome/useGetData';
// import { useTranslation } from 'react-i18next';

// // 🎨 ألوان الثيم
// const colors = {
//   lightMode: {
//     bg: '#ffffff',
//     fg: '#111827',
//     text: '#4f46e5',
//     text2: '#374151',
//     menu: '#f9fafb',
//     accent: '#6366f1',
//     accentSoft: '#e0e7ff',
//   },
//   darkMode: {
//     bg: '#0a0a0a',
//     fg: '#f9fafb',
//     text: '#facc15',
//     text2: '#e5e7eb',
//     menu: '#111827',
//     accent: '#818cf8',
//     accentSoft: '#312e81',
//   },
// };

// const AddStoryModel = ({ setIsStory, isStory }) => {
//   const [storyText, setStoryText] = useState('');
//   const [storyImage, setStoryImage] = useState(null);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const [uploadProgress, setUploadProgress] = useState(0);
//   const [success, setSuccess] = useState(false);
//   const [collaborators, setCollaborators] = useState([]);
//   const { addNewStory } = useStory();
//   const { user } = useAuth();
//   const { userData } = useGetData(user?._id);
//   const { t } = useTranslation();

//   useEffect(() => {
//     const saved = localStorage.getItem('storyDraft');
//     if (saved) setStoryText(saved);
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('storyDraft', storyText);
//   }, [storyText]);

//   const collaboratorOptions = useMemo(
//     () =>
//       (userData?.following || []).map((f) => ({
//         value: f._id,
//         label: `@${f.username}`,
//         avatar: f.profilePhoto?.url || '/default-avatar.png',
//       })),
//     [userData?.following]
//   );

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setStoryImage(file);
//       setError('');
//     }
//   };

//   const handleTextChange = (e) => {
//     setStoryText(e.target.value);
//     setError('');
//   };

//   const simulateUploadProgress = async () => {
//     setIsUploading(true);
//     setUploadProgress(0);
//     return new Promise((resolve) => {
//       let progress = 0;
//       const interval = setInterval(() => {
//         progress += Math.random() * 15;
//         if (progress >= 100) {
//           clearInterval(interval);
//           setUploadProgress(100);
//           setTimeout(() => {
//             setIsUploading(false);
//             resolve();
//           }, 500);
//         } else {
//           setUploadProgress(progress);
//         }
//       }, 300);
//     });
//   };

//   const handleSubmit = async () => {
//     if (!storyText && !storyImage) {
//       setError('Please add text or an image to share your story');
//       return;
//     }

//     setIsLoading(true);
//     setSuccess(false);

//     if (storyImage) await simulateUploadProgress();

//     const storyData = {
//       text: storyText || '',
//       file: storyImage || null,
//       collaborators: collaborators.length ? collaborators.map((c) => c.value) : [],
//     };

//     await addNewStory(storyData);
//     setIsLoading(false);
//     setSuccess(true);
//     clearInput();
//     localStorage.removeItem('storyDraft');
//     setTimeout(() => setIsStory(false), 2000);
//   };

//   const clearInput = () => {
//     setStoryImage(null);
//     setStoryText('');
//     setError('');
//     setCollaborators([]);
//   };

//   // ✅ التدرج الخلفي الديناميكي
//   const gradient = storyImage
//     ? 'from-lightMode-accentSoft via-lightMode-accent to-lightMode-text dark:from-darkMode-accentSoft dark:via-darkMode-accent dark:to-darkMode-text'
//     : 'from-lightMode-menu via-lightMode-accentSoft to-white/60 dark:from-darkMode-menu dark:via-darkMode-accentSoft dark:to-[#1e1e1e]';

//   return (
//     <AnimatePresence>
//       {isStory && (
//         <motion.div
//           key="storyModal"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           exit={{ opacity: 0 }}
//           className="fixed inset-0 z-50 flex items-center justify-center 
//                      bg-black/70 backdrop-blur-md"
//           onClick={(e) => e.target === e.currentTarget && setIsStory(false)}
//         >
//           <motion.div
//             key="modalCard"
//             initial={{ scale: 0.9, opacity: 0, y: 30 }}
//             animate={{ scale: 1, opacity: 1, y: 0 }}
//             exit={{ scale: 0.9, opacity: 0, y: 20 }}
//             transition={{ duration: 0.3 }}
//             className={`relative w-[90%] max-w-md rounded-[2rem] p-6
//                         bg-gradient-to-br ${gradient}
//                         border border-white/10 backdrop-blur-2xl shadow-[0_0_40px_-10px_rgba(79,70,229,0.3)]
//                         dark:shadow-[0_0_40px_-10px_rgba(250,204,21,0.15)]
//                         flex flex-col gap-5 overflow-hidden`}
//           >
//             {/* Upload overlay */}
//             <AnimatePresence>
//               {isUploading && (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/70 rounded-[2rem]"
//                 >
//                   <motion.div
//                     animate={{ scale: [1, 1.1, 1] }}
//                     transition={{ repeat: Infinity, duration: 1.2 }}
//                     className="text-lightMode-text dark:text-darkMode-text text-5xl mb-4"
//                   >
//                     <IoCloudUploadOutline />
//                   </motion.div>

//                   <p className="text-gray-200 font-medium mb-2">{t('Uploading Story')}</p>

//                   <div className="w-3/4 h-1.5 bg-lightMode-menu dark:bg-darkMode-menu rounded-full overflow-hidden mt-2">
//                     <motion.div
//                       className="h-full bg-lightMode-text dark:bg-darkMode-text rounded-full"
//                       initial={{ width: '0%' }}
//                       animate={{ width: `${uploadProgress}%` }}
//                       transition={{ ease: 'easeInOut', duration: 0.3 }}
//                     />
//                   </div>

//                   <p className="text-sm text-gray-400 mt-2">{Math.floor(uploadProgress)}%</p>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {/* Close Button */}
//             <motion.button
//               whileHover={{ scale: 1.15 }}
//               whileTap={{ scale: 0.9 }}
//               onClick={() => setIsStory(false)}
//               className="absolute top-4 right-4 p-2 bg-white/20 dark:bg-black/30 backdrop-blur-md
//                          hover:bg-white/30 dark:hover:bg-black/50 transition 
//                          text-lightMode-text dark:text-darkMode-text rounded-full shadow-lg"
//             >
//               <IoClose />
//             </motion.button>

//             {/* Title */}
//             <h2
//               className="text-center text-3xl font-extrabold text-transparent 
//                          bg-clip-text bg-gradient-to-r from-lightMode-text to-lightMode-accent 
//                          dark:from-darkMode-text dark:to-darkMode-accent animate-gradient-x"
//             >
//               {t('Add Story')}
//             </h2>

//             {/* Success Animation */}
//             <AnimatePresence>
//               {success && (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.8 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   exit={{ opacity: 0 }}
//                   className="flex flex-col items-center justify-center text-green-500"
//                 >
//                   <IoCheckmarkCircleOutline className="text-5xl mb-2" />
//                   <p className="font-semibold">{t('Story shared successfully!')}</p>
//                 </motion.div>
//               )}
//             </AnimatePresence>

//             {error && <p className="text-red-400 text-sm text-center">{error}</p>}

//             {/* Textarea */}
//             <motion.textarea
//               initial={{ opacity: 0, y: 10 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.4 }}
//               value={storyText}
//               onChange={handleTextChange}
//               placeholder={t('Share your thoughts or upload an image...')}
//               rows={4}
//               maxLength={300}
//               className="w-full p-4 rounded-2xl bg-lightMode-menu/60 dark:bg-darkMode-menu/40
//                          text-lightMode-fg dark:text-darkMode-fg placeholder-gray-400 italic 
//                          border border-gray-600/40 focus:outline-none focus:ring-2 
//                          focus:ring-lightMode-text dark:focus:ring-darkMode-text 
//                          focus:ring-offset-1 resize-none shadow-inner transition"
//             />

//             {/* Upload Section */}
//             <div className="w-full">
//               {!storyImage ? (
//                 <div className="flex gap-3">
//                   <label className="flex-1 flex items-center justify-center gap-2 cursor-pointer 
//                                     bg-lightMode-text dark:bg-darkMode-text 
//                                     text-white font-semibold py-2 px-4 rounded-2xl 
//                                     hover:opacity-90 transition shadow-md hover:shadow-xl">
//                     <IoImage className="text-xl" />
//                     <span>{t('Upload Image')}</span>
//                     <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
//                   </label>
//                   <label className="flex items-center justify-center gap-2 cursor-pointer 
//                                     bg-gradient-to-r from-yellow-400 to-amber-500 
//                                     hover:from-yellow-500 hover:to-amber-400 text-black font-semibold 
//                                     py-2 px-4 rounded-2xl transition shadow-md hover:shadow-xl">
//                     <IoCamera className="text-xl" />
//                     <span>{t('Camera')}</span>
//                     <input type="file" accept="image/*" capture="camera" onChange={handleImageChange} className="hidden" />
//                   </label>
//                 </div>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.95 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="relative group"
//                 >
//                   <motion.img
//                     whileHover={{ scale: 1.02 }}
//                     src={URL.createObjectURL(storyImage)}
//                     alt="Preview"
//                     className="rounded-3xl max-h-64 w-full object-cover border border-gray-700/40 shadow-lg transition duration-300"
//                   />
//                   <div className="absolute bottom-2 right-2 bg-black/50 text-xs text-white px-2 py-1 rounded-full">
//                     {Math.round(storyImage.size / 1024)} KB
//                   </div>
//                   <motion.button
//                     whileHover={{ scale: 1.1 }}
//                     whileTap={{ scale: 0.9 }}
//                     onClick={() => setStoryImage(null)}
//                     className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 
//                                hover:bg-red-600 shadow-md transition"
//                     title="Remove Image"
//                   >
//                     <IoTrash className="text-base" />
//                   </motion.button>
//                 </motion.div>
//               )}
//             </div>

//             {/* Collaborators */}
//             {userData?.following?.length > 0 && (
//               <div className="w-full">
//                 <label className="block text-gray-300 text-sm mb-2">
//                   {t('Add Collaborators')} ({t('optional')})
//                 </label>
//                 <Select
//                   isMulti
//                   options={collaboratorOptions}
//                   value={collaborators}
//                   onChange={setCollaborators}
//                   placeholder="Select collaborators..."
//                   formatOptionLabel={(option) => (
//                     <div className="flex items-center gap-2">
//                       <img src={option.avatar} alt="" className="w-6 h-6 rounded-full" />
//                       <span>{option.label}</span>
//                     </div>
//                   )}
//                   classNamePrefix="select"
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       backgroundColor: '#1f2937',
//                       borderColor: '#374151',
//                       borderRadius: '1rem',
//                       color: '#fff',
//                       padding: '2px',
//                     }),
//                     menu: (base) => ({
//                       ...base,
//                       backgroundColor: '#111827',
//                       color: '#fff',
//                     }),
//                     option: (base, state) => ({
//                       ...base,
//                       backgroundColor: state.isSelected
//                         ? '#5558f1'
//                         : state.isFocused
//                         ? '#374151'
//                         : '#111827',
//                       color: '#fff',
//                     }),
//                     multiValue: (base) => ({
//                       ...base,
//                       backgroundColor: '#5558f1',
//                       color: '#fff',
//                     }),
//                   }}
//                 />
//               </div>
//             )}

//             {/* Submit Button */}
//             <motion.button
//               whileHover={{ scale: 1.05 }}
//               whileTap={{ scale: 0.95 }}
//               onClick={handleSubmit}
//               disabled={isLoading || isUploading}
//               className={`mt-auto flex items-center justify-center gap-2 py-3 rounded-2xl 
//                           bg-lightMode-text dark:bg-darkMode-text text-white font-bold text-lg 
//                           shadow-[0_10px_25px_rgba(79,70,229,0.4)] dark:shadow-[0_10px_25px_rgba(250,204,21,0.15)] 
//                           hover:shadow-[0_10px_40px_rgba(79,70,229,0.6)] 
//                           transition-all duration-300 ${(isLoading || isUploading) ? 'opacity-70 cursor-not-allowed' : ''}`}
//             >
//               {isLoading ? (
//                 <>
//                   <motion.div
//                     animate={{ rotate: 360 }}
//                     transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
//                     className="border-t-2 border-white w-5 h-5 rounded-full"
//                   />
//                   <span>{t('Posting your story')}...</span>
//                 </>
//               ) : (
//                 <>
//                   <IoImage className="text-xl" /> {t('Share Story')}
//                 </>
//               )}
//             </motion.button>
//           </motion.div>
//         </motion.div>
//       )}
//     </AnimatePresence>
//   );
// };

// export default AddStoryModel;
'use client';
import React, { useEffect, useState, useMemo } from 'react';
import {
  IoClose,
  IoImage,
  IoTrash,
  IoCamera,
  IoCheckmarkCircleOutline,
  IoCloudUploadOutline,
  IoShareSocialOutline, // أيقونة جديدة للـ Publish
} from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { useStory } from '../../Context/StoryContext';
import { useAuth } from '../../Context/AuthContext';
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

  // السياقات Hooks
  const { addNewStory } = useStory();
  const { user } = useAuth();
  const { userData } = useGetData(user?._id);
  const { t } = useTranslation();

  // تحميل وحفظ المسودة
  useEffect(() => {
    const saved = localStorage.getItem('storyDraft');
    if (saved) setStoryText(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem('storyDraft', storyText);
  }, [storyText]);

  // خيارات المتعاونين (Collaborators)
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
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError(t('Image size should not exceed 5MB.'));
        return;
      }
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
    if (!storyText.trim() && !storyImage) {
      setError(t('Please add text or an image to share your story'));
      return;
    }

    setIsLoading(true);
    setSuccess(false);
    setError('');

    if (storyImage) await simulateUploadProgress();

    const storyData = {
      text: storyText.trim() || '',
      file: storyImage || null,
      collaborators: collaborators.length ? collaborators.map((c) => c.value) : [],
    };

    // افتراض نجاح الإرسال لغرض العرض
    try {
        await addNewStory(storyData); // استدعاء API الفعلي
        setSuccess(true);
        clearInput();
        localStorage.removeItem('storyDraft');
        setTimeout(() => setIsStory(false), 2000);
    } catch (apiError) {
        setError(t('Failed to publish story. Please try again.'));
        setIsLoading(false);
    } finally {
        setIsLoading(false);
    }
  };

  const clearInput = () => {
    setStoryImage(null);
    setStoryText('');
    setError('');
    setCollaborators([]);
  };

  // تصميم الـ Select component (React-Select) ليتناسب مع Dark/Light Mode
  const customStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: newColors.darkMode.fg,
      borderColor: newColors.darkMode.border,
      borderRadius: '1rem',
      color: newColors.darkMode.text,
      padding: '4px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: newColors.darkMode.primary,
      },
      // Light mode adjustments for control
      '@media (prefers-color-scheme: light)': {
        backgroundColor: newColors.lightMode.bg,
        borderColor: newColors.lightMode.border,
        color: newColors.lightMode.text,
        '&:hover': {
          borderColor: newColors.lightMode.primary,
        },
      },
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: newColors.darkMode.fg,
      borderRadius: '1rem',
      boxShadow: '0 4px 10px rgba(0,0,0,0.5)',
      // Light mode adjustments for menu
      '@media (prefers-color-scheme: light)': {
        backgroundColor: newColors.lightMode.fg,
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
      },
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? newColors.darkMode.primary
        : state.isFocused
        ? newColors.darkMode.border
        : newColors.darkMode.fg,
      color: newColors.darkMode.text,
      // Light mode adjustments for option
      '@media (prefers-color-scheme: light)': {
        backgroundColor: state.isSelected
          ? newColors.lightMode.primary
          : state.isFocused
          ? newColors.lightMode.border
          : newColors.lightMode.fg,
        color: state.isSelected ? '#ffffff' : newColors.lightMode.text,
      },
      cursor: 'pointer',
    }),
    multiValue: (base) => ({
        ...base,
        backgroundColor: newColors.darkMode.primary,
        color: '#ffffff',
        // Light mode adjustments for multiValue
        '@media (prefers-color-scheme: light)': {
            backgroundColor: newColors.lightMode.primary,
        },
    }),
    multiValueLabel: (base) => ({
        ...base,
        color: '#ffffff',
    }),
  };


  return (
    <AnimatePresence>
      {isStory && (
        <motion.div
          key="storyModal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // خلفية معتمة وبلور أقوى
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xl"
          onClick={(e) => e.target === e.currentTarget && setIsStory(false)}
        >
          <motion.div
            key="modalCard"
            initial={{ scale: 0.9, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            // تصميم البطاقة الجديد: Depth & Clarity
            className={`relative w-[95%] max-w-lg rounded-3xl p-6 shadow-2xl transition-all 
                        bg-lightMode-fg dark:bg-darkMode-fg border border-lightMode-fg dark:border-darkMode-fg
                        dark:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8),0_0_120px_-20px_rgba(76,111,255,0.1)] 
                        flex flex-col`}
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
                    className="text-darkMode-primary dark:text-darkMode-primary text-5xl mb-4"
                  >
                    <IoCloudUploadOutline />
                  </motion.div>

                  <p className="text-gray-200 font-medium mb-2">{t('Uploading Story')}</p>
                  <div className="w-3/4 h-1.5 bg-darkMode-border rounded-full overflow-hidden mt-2">
                    <motion.div
                      className="h-full bg-darkMode-primary rounded-full"
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

            {/* Story Image Preview */}
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
                  className="w-full h-72 object-cover" // ارتفاع أكبر
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

            {/* 🌟 New Image Drop Zone - يظهر فقط إذا لم تكن هناك صورة */}
            {!storyImage && (
                <label className={`w-full h-40 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl cursor-pointer transition-colors mt-4
                                  ${error ? 'border-red-500' : 'border-lightMode-primary/50 dark:border-darkMode-primary/50 hover:border-lightMode-accent dark:hover:border-darkMode-accent'} 
                                  bg-lightMode-bg dark:bg-darkMode-bg/50`}>
                    <IoImage className="text-4xl text-lightMode-textSoft dark:text-darkMode-textSoft mb-2" />
                    <p className="font-semibold text-lightMode-text dark:text-darkMode-text">{t('Drag and drop an image or click to upload')}</p>
                    <p className="text-sm text-lightMode-textSoft dark:text-darkMode-textSoft mt-1">JPEG, PNG up to 5MB</p>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
            )}

            {/* Text Input & Collaborators */}
            <div className="relative flex flex-col mt-4">
                <motion.textarea
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    value={storyText}
                    onChange={handleTextChange}
                    placeholder={t('What is the story about? (300 characters max)...')} 
                    rows={storyImage ? 2 : 4} // تقليل الارتفاع عند وجود صورة
                    maxLength={300}
                    // تصميم الـ Textarea الجديد
                    className="w-full p-4 rounded-xl bg-lightMode-bg dark:bg-darkMode-bg/50 text-lightMode-text dark:text-darkMode-text placeholder-lightMode-textSoft dark:placeholder-darkMode-textSoft italic border border-lightMode-border dark:border-darkMode-border focus:outline-none focus:ring-2 focus:ring-lightMode-primary dark:focus:ring-darkMode-primary shadow-inner transition resize-none"
                />
                
                {/* Character Counter & Mini-Toolbar */}
                <div className='flex justify-between items-center pt-2'>
                    <span className="text-xs text-lightMode-textSoft dark:text-darkMode-textSoft">
                        {storyText.length}/300
                    </span>
                    
                    {/* Mini-Toolbar below Text Area - لإضافة الكاميرا والصورة بشكل ثانوي */}
                    <div className="flex gap-2">
                        <label title={t('Take Photo')} className="p-2 bg-lightMode-accent/10 dark:bg-darkMode-accent/20 text-lightMode-accent dark:text-darkMode-accent rounded-full cursor-pointer hover:opacity-80 transition">
                            <IoCamera className="text-xl" />
                            <input type="file" accept="image/*" capture="camera" onChange={handleImageChange} className="hidden" />
                        </label>
                        <label title={t('Upload from Gallery')} className="p-2 bg-lightMode-primary/10 dark:bg-darkMode-primary/20 text-lightMode-primary dark:text-darkMode-primary rounded-full cursor-pointer hover:opacity-80 transition">
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
                      <img src={option.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                      <span>{option.label}</span>
                    </div>
                  )}
                  classNamePrefix="select"
                  styles={customStyles} // استخدام الستايلات المخصصة
                />
              </div>
            )}
            
            {/* Error Message */}
            {error && (
                <motion.p 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text-sm mt-3 font-medium text-center"
                >
                    {error}
                </motion.p>
            )}

            {/* Submit Button */}
            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={isLoading || isUploading || (!storyText.trim() && !storyImage)}
                // تصميم الزر الجديد يركز على لون Primary
                className={`w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl font-extrabold text-white text-lg transition-all duration-300
                          bg-lightMode-primary hover:bg-lightMode-primary/90 dark:bg-darkMode-primary dark:hover:bg-darkMode-primary/90 
                          shadow-xl dark:shadow-darkMode-primary/40 ${
                            (isLoading || isUploading || (!storyText.trim() && !storyImage)) ? 'opacity-50 cursor-not-allowed shadow-none' : ''
                          }`}
              >
                {isLoading || isUploading ? (
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
                    <IoShareSocialOutline className="text-xl" /> {t('Publish Story')}
                  </>
                )}
              </motion.button>
            </div>

            {/* Success Animation */}
            <AnimatePresence>
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-lightMode-fg dark:bg-darkMode-fg/95 flex flex-col items-center justify-center text-green-500 rounded-3xl"
                >
                  <IoCheckmarkCircleOutline className="text-7xl mb-4" />
                  <p className="font-bold text-xl text-lightMode-text dark:text-darkMode-text">{t('Story shared successfully!')}</p>
                  <p className="text-sm text-lightMode-textSoft dark:text-darkMode-textSoft mt-1">{t('Redirecting to feed...')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddStoryModel;


