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
  IoColorPaletteOutline,
  IoSparklesOutline,
  IoMusicalNotesOutline,
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

  useEffect(() => {
    const saved = localStorage.getItem('storyDraft');
    if (saved) setStoryText(saved);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (storyText) localStorage.setItem('storyDraft', storyText);
    }, 400);
    return () => clearTimeout(timeout);
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

  const handleImageChange = useCallback(
    (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 10 * 1024 * 1024) { // Increased to 10MB
        setError(t('Image size should not exceed 10MB.'));
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
    localStorage.removeItem('storyDraft');
  }, []);

  const simulateUploadProgress = useCallback(() => {
    setIsUploading(true);
    setUploadProgress(0);
    return new Promise((resolve) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 20;
        if (progress >= 100) {
          clearInterval(interval);
          setUploadProgress(100);
          setTimeout(() => {
            setIsUploading(false);
            resolve();
          }, 400);
        } else {
          setUploadProgress(progress);
        }
      }, 200);
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
      localStorage.removeItem('storyDraft');
      setTimeout(() => {
        setIsStory(false);
        clearInput();
      }, 1500);
    } catch {
      setError(t('Failed to publish story. Please try again.'));
    } finally {
      setIsLoading(false);
    }
  }, [storyText, storyImage, collaborators, simulateUploadProgress, addNewStory, clearInput, t, setIsStory]);

  const previewUrl = useMemo(() => {
    if (!storyImage) return null;
    return URL.createObjectURL(storyImage);
  }, [storyImage]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <AnimatePresence>
      {isStory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/95 backdrop-blur-2xl p-4 md:p-8"
          onClick={(e) => e.target === e.currentTarget && setIsStory(false)}
        >
          {/* Close Button Outside */}
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setIsStory(false)}
            className="fixed top-8 right-8 z-[10001] w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
          >
            <IoClose size={28} />
          </motion.button>

          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-6xl h-full max-h-[900px] flex flex-col md:flex-row bg-[#0A0A0A] rounded-[3rem] overflow-hidden border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          >
            {/* LEFT: Live Story Preview (Portrait View) */}
            <div className="w-full md:w-[420px] h-full bg-[#111] relative overflow-hidden flex items-center justify-center p-6 border-r border-white/5">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5" />

              <div className="relative aspect-[9/16] w-full max-w-[340px] rounded-[2rem] overflow-hidden bg-black shadow-2xl border border-white/10 group">
                <AnimatePresence mode="wait">
                  {storyImage ? (
                    <motion.div
                      key="image-preview"
                      initial={{ opacity: 0, scale: 1.1 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0"
                    >
                      <Image
                        src={previewUrl}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="no-image"
                      className="absolute inset-0 flex flex-col items-center justify-center text-white/20 bg-[#151515]"
                    >
                      <IoImage size={80} className="mb-4 opacity-50" />
                      <p className="text-xs font-bold tracking-widest uppercase">Visual Preview</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Overlaid Content Mockup */}
                <div className="absolute inset-0 p-6 flex flex-col pointer-events-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full border border-white/30 bg-white/10" />
                    <div className="w-24 h-2 rounded-full bg-white/20" />
                  </div>

                  <div className="mt-auto">
                    <motion.p
                      animate={{ y: storyText ? 0 : 20, opacity: storyText ? 1 : 0 }}
                      className="text-white text-lg font-medium leading-tight whitespace-pre-wrap drop-shadow-lg"
                    >
                      {storyText}
                    </motion.p>
                  </div>
                </div>

                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center text-white">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                      className="w-16 h-16 rounded-full border-2 border-white/10 border-t-white mb-4"
                    />
                    <h3 className="text-xl font-bold mb-1">Publishing...</h3>
                    <p className="text-sm text-white/50">{Math.floor(uploadProgress)}% uploaded</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT: Control Studio */}
            <div className="flex-1 h-full flex flex-col bg-[#0F0F0F] relative overflow-hidden">
              {/* Top Menu Icons */}
              <div className="p-8 pb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <h2 className="text-white font-bold tracking-tight text-xl">Story Studio</h2>
                </div>
                <div className="flex gap-4">
                  <button className="text-white/40 hover:text-white transition-colors"><IoColorPaletteOutline size={22} /></button>
                  <button className="text-white/40 hover:text-white transition-colors"><IoSparklesOutline size={22} /></button>
                  <button className="text-white/40 hover:text-white transition-colors"><IoMusicalNotesOutline size={22} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 pt-0 space-y-8">
                {/* Visual Asset Section */}
                <section>
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Capture Moment</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="group flex flex-col items-center justify-center aspect-video rounded-3xl bg-white/[0.03] border-2 border-dashed border-white/5 hover:border-indigo-500/50 hover:bg-white/[0.05] transition-all cursor-pointer">
                      <IoCamera size={32} className="text-white/20 group-hover:text-indigo-400 group-hover:scale-110 transition-all mb-2" />
                      <span className="text-[10px] font-bold text-white/40 group-hover:text-white transition-colors uppercase">Camera</span>
                      <input type="file" accept="image/*" capture="camera" onChange={handleImageChange} className="hidden" />
                    </label>
                    <label className="group flex flex-col items-center justify-center aspect-video rounded-3xl bg-white/[0.03] border-2 border-dashed border-white/5 hover:border-purple-500/50 hover:bg-white/[0.05] transition-all cursor-pointer relative overflow-hidden">
                      {storyImage ? (
                        <>
                          <Image src={previewUrl} alt="Preview" fill className="object-cover opacity-30 grayscale" />
                          <div className="relative z-10 flex flex-col items-center">
                            <IoImage size={24} className="text-white mb-2" />
                            <span className="text-[10px] font-bold text-white uppercase">Replace</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <IoImage size={32} className="text-white/20 group-hover:text-purple-400 group-hover:scale-110 transition-all mb-2" />
                          <span className="text-[10px] font-bold text-white/40 group-hover:text-white transition-colors uppercase">Gallery</span>
                        </>
                      )}
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </section>

                {/* Caption Section */}
                <section>
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4">Caption Script</h3>
                  <div className="relative group">
                    <textarea
                      value={storyText}
                      onChange={handleTextChange}
                      placeholder="Start typing your story..."
                      maxLength={300}
                      className="w-full min-h-[140px] bg-white/[0.02] rounded-3xl p-6 text-white placeholder:text-white/10 border border-white/5 focus:border-indigo-500/50 focus:bg-white/[0.04] focus:outline-none transition-all resize-none italic leading-relaxed"
                    />
                    <div className="absolute bottom-6 right-6 flex items-center gap-2">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded bg-black/40 ${storyText.length > 280 ? 'text-red-500' : 'text-white/20'}`}>
                        {storyText.length}/300
                      </span>
                    </div>
                  </div>
                </section>

                {/* Collaborators Section */}
                <section>
                  <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 flex items-center justify-between">
                    Tag Collaborators
                    <span className="text-indigo-400 text-[8px] tracking-normal font-bold">OPTIONAL</span>
                  </h3>
                  {userData?.following?.length > 0 && (
                    <div className="studio-select-wrapper">
                      <Select
                        isMulti
                        options={collaboratorOptions}
                        value={collaborators}
                        onChange={setCollaborators}
                        placeholder="Search followers..."
                        styles={{
                          control: (base) => ({
                            ...base,
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)',
                            borderRadius: '1.5rem',
                            padding: '6px',
                            '&:hover': { border: '1px solid rgba(255,255,255,0.1)' }
                          }),
                          menu: (base) => ({
                            ...base,
                            backgroundColor: '#151515',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '1rem',
                            overflow: 'hidden'
                          }),
                          option: (base, state) => ({
                            ...base,
                            backgroundColor: state.isFocused ? 'rgba(255,255,255,0.05)' : 'transparent',
                            color: 'white',
                            cursor: 'pointer'
                          }),
                          multiValue: (base) => ({
                            ...base,
                            backgroundColor: 'rgba(76,111,255,0.1)',
                            borderRadius: '99px',
                            paddingLeft: '4px'
                          }),
                          multiValueLabel: (base) => ({ ...base, color: '#818cf8', fontWeight: 'bold', fontSize: '10px' }),
                          input: (base) => ({ ...base, color: 'white' })
                        }}
                        formatOptionLabel={(option) => (
                          <div className="flex items-center gap-3">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image src={option.avatar} alt="" fill className="object-cover" />
                            </div>
                            <span className="text-sm font-medium">{option.label}</span>
                          </div>
                        )}
                        classNamePrefix="studio-select"
                      />
                    </div>
                  )}
                </section>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-wider flex items-center gap-3"
                  >
                    <IoClose size={20} className="bg-red-500 text-white rounded-full p-0.5" />
                    {error}
                  </motion.div>
                )}
              </div>

              {/* Bottom Launch Bar */}
              <div className="p-8 bg-[#0D0D0D] border-t border-white/5 flex items-center gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={clearInput}
                  disabled={isLoading}
                  className="w-14 h-14 rounded-2xl bg-white/[0.03] text-white/20 hover:text-white hover:bg-red-500/20 transition-all flex items-center justify-center flex-shrink-0"
                >
                  <IoTrash size={24} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isLoading || (!storyText.trim() && !storyImage)}
                  className={`flex-1 flex items-center justify-center gap-4 py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all duration-500 ${isLoading || (!storyText.trim() && !storyImage)
                      ? 'bg-white/5 text-white/10 cursor-not-allowed'
                      : success
                        ? 'bg-green-500 text-white shadow-green-500/20'
                        : 'bg-white text-black hover:bg-indigo-500 hover:text-white shadow-white/5'
                    }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : success ? (
                    <>
                      <IoCheckmarkCircleOutline size={22} />
                      Studio Live!
                    </>
                  ) : (
                    <>
                      <IoShareSocialOutline size={20} />
                      Launch Story
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AddStoryModel.displayName = 'AddStoryModel'
export default AddStoryModel;
