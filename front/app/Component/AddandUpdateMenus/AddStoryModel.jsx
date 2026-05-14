'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  X,
  Image as ImageIcon,
  Trash2,
  Camera,
  CheckCircle2,
  Share,
  Palette,
  Sparkles,
  Music,
  Link as LinkIcon,
  Plus,
  Loader2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Select from 'react-select';
import { useStory } from '../../Context/StoryContext';
import { useAuth } from '../../Context/AuthContext';
import { useHighlights } from '@/app/Context/HighlightContext';
import { useGetData } from '@/app/Custome/useGetData';
import { useTranslation } from 'react-i18next';
import Image from 'next/image';
import { Button } from '../ui/Button';

const selectStyles = {
  control: (base, state) => ({
    ...base,
    backgroundColor: 'transparent',
    border: state.isFocused ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(0,0,0,0.05)',
    borderRadius: '1rem',
    padding: '4px',
    boxShadow: 'none',
    '&:hover': { border: '1px solid rgba(0,0,0,0.1)' }
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'white',
    border: '1px solid rgba(0,0,0,0.05)',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
    zIndex: 100
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(0,0,0,0.02)' : 'transparent',
    color: 'black',
    cursor: 'pointer',
    fontSize: '14px'
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: '99px',
  }),
  multiValueLabel: (base) => ({ ...base, color: 'black', fontWeight: 'bold', fontSize: '12px' }),
  placeholder: (base) => ({ ...base, color: 'rgba(0,0,0,0.3)', fontSize: '13px' }),
};

const darkSelectStyles = {
  ...selectStyles,
  control: (base, state) => ({
    ...base,
    backgroundColor: 'rgba(255,255,255,0.02)',
    border: state.isFocused ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(255,255,255,0.05)',
    borderRadius: '1rem',
    padding: '4px',
    boxShadow: 'none',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#111',
    border: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 10px 40px rgba(0,0,0,0.5)',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(255,255,255,0.05)' : 'transparent',
    color: 'white',
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'rgba(255,255,255,0.1)',
  }),
  multiValueLabel: (base) => ({ ...base, color: 'white' }),
};

const AddStoryModel = React.memo(({ setIsStory, isStory }) => {
  const [storyText, setStoryText] = useState('');
  const [storyImage, setStoryImage] = useState(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [collaborators, setCollaborators] = useState([]);
  const [mentions, setMentions] = useState([]);
  const [isCloseFriends, setIsCloseFriends] = useState(false);
  const [music, setMusic] = useState(null);
  const [link, setLink] = useState({ url: '', text: '' });
  const [targetHighlight, setTargetHighlight] = useState(null);

  const { addNewStory } = useStory();
  const { user } = useAuth();
  const { highlights, addStoryToHighlight } = useHighlights();
  const { userData } = useGetData(user?._id);
  const { t } = useTranslation();

  const followerOptions = useMemo(
    () => (userData?.following || []).map((f) => ({
      value: f._id,
      label: `@${f.username}`,
      avatar: f.profilePhoto?.url || '/default-avatar.png',
    })),
    [userData?.following]
  );

  const handleImageChange = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      setError(t('Image size should not exceed 10MB.'));
      return;
    }
    setStoryImage(file);
    setError('');
  }, [t]);

  const clearInput = useCallback(() => {
    setStoryImage(null);
    setStoryText('');
    setError('');
    setCollaborators([]);
    setMentions([]);
    setMusic(null);
    setLink({ url: '', text: '' });
    setIsCloseFriends(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!storyText.trim() && !storyImage) {
      setError(t('Please add content to share your story'));
      return;
    }

    setIsLoading(true);
    setSuccess(false);
    setError('');

    try {
      const newStory = await addNewStory({
        text: storyText.trim(),
        file: storyImage || null,
        collaborators: collaborators.map((c) => c.value),
        mentions: mentions.map((m) => m.value),
        music,
        link: link.url ? link : null,
        isCloseFriends,
      });

      if (newStory && targetHighlight) {
        await addStoryToHighlight(targetHighlight.value, newStory._id);
      }

      setSuccess(true);
      setTimeout(() => {
        setIsStory(false);
        clearInput();
      }, 1500);
    } catch {
      setError(t('Failed to publish story.'));
    } finally {
      setIsLoading(false);
    }
  }, [storyText, storyImage, collaborators, mentions, music, link, isCloseFriends, targetHighlight, addNewStory, addStoryToHighlight, clearInput, t, setIsStory]);

  const previewUrl = useMemo(() => storyImage ? URL.createObjectURL(storyImage) : null, [storyImage]);

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  return (
    <AnimatePresence>
      {isStory && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ y: 20, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            className="w-full max-w-5xl h-[85vh] flex flex-col md:flex-row bg-white dark:bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-threads-border"
          >
            {/* Story Canvas */}
            <div className="w-full md:w-[400px] h-full bg-gray-50 dark:bg-white/[0.02] p-8 flex flex-col items-center justify-center border-r border-gray-100 dark:border-threads-border relative">
              <div className="relative aspect-[9/16] w-full max-w-[300px] bg-black rounded-[2rem] overflow-hidden shadow-2xl border border-gray-100/10 group">
                <AnimatePresence mode="wait">
                  {previewUrl ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0">
                      <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                    </motion.div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-800 dark:text-gray-200">
                      <ImageIcon size={48} className="opacity-20 mb-2" />
                      <p className="text-[10px] font-bold uppercase tracking-widest opacity-30">{t('Canvas')}</p>
                    </div>
                  )}
                </AnimatePresence>

                {/* Canvas Overlay */}
                <div className="absolute inset-0 p-6 flex flex-col pointer-events-none">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/10" />
                    <div className="flex flex-col gap-1">
                       <div className="w-16 h-1.5 bg-white/30 rounded-full" />
                       <div className="w-10 h-1 bg-white/10 rounded-full" />
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center gap-4">
                    {storyText && (
                      <p className="text-white text-lg font-bold text-center drop-shadow-lg leading-tight">
                        {storyText}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-4 md:hidden">
                <button onClick={() => setIsStory(false)} className="p-2 bg-white dark:bg-black rounded-full shadow-lg">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Studio Controls */}
            <div className="flex-1 h-full flex flex-col p-8 md:p-12 overflow-y-auto no-scrollbar space-y-10">
              <header className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">{t('Story Studio')}</h2>
                  <p className="text-sm text-gray-500">{t('Capture and share your moment.')}</p>
                </div>
                <button 
                  onClick={() => setIsStory(false)} 
                  className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-all text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <X size={24} />
                </button>
              </header>

              {/* Upload Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center py-10 rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/5 hover:border-black dark:hover:border-white transition-all cursor-pointer group bg-gray-50 dark:bg-white/5">
                  <Camera size={32} className="text-gray-300 group-hover:text-black dark:group-hover:text-white mb-2 transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('Camera')}</span>
                  <input type="file" accept="image/*" capture="camera" onChange={handleImageChange} className="hidden" />
                </label>
                <label className="flex flex-col items-center justify-center py-10 rounded-3xl border-2 border-dashed border-gray-100 dark:border-white/5 hover:border-black dark:hover:border-white transition-all cursor-pointer group bg-gray-50 dark:bg-white/5">
                  <ImageIcon size={32} className="text-gray-300 group-hover:text-black dark:group-hover:text-white mb-2 transition-colors" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{t('Upload')}</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Input Area */}
              <div className="space-y-4">
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('Caption')}</h3>
                <textarea
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder={t("What's happening?")}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-2xl p-6 text-[15px] focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 h-32 resize-none transition-all outline-none"
                />
              </div>

              {/* Mentions & Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('Mention Friends')}</h3>
                  <Select
                    isMulti
                    options={followerOptions}
                    value={mentions}
                    onChange={setMentions}
                    placeholder={t("Tag someone...")}
                    styles={darkSelectStyles}
                  />
                </div>
                <div className="space-y-4">
                  <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">{t('Add to Highlight')}</h3>
                  <Select
                    options={(highlights || []).map(h => ({ value: h._id, label: h.title }))}
                    value={targetHighlight}
                    onChange={setTargetHighlight}
                    placeholder={t("Choose highlight...")}
                    styles={darkSelectStyles}
                  />
                </div>
              </div>

              {/* Privacy Toggle */}
              <div 
                onClick={() => setIsCloseFriends(!isCloseFriends)}
                className={`p-5 rounded-3xl border transition-all cursor-pointer flex items-center justify-between ${isCloseFriends ? 'bg-green-500/10 border-green-500/20' : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-threads-border'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isCloseFriends ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-white/10 text-gray-400'}`}>
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-[15px]">{isCloseFriends ? t("Close Friends") : t("Public")}</p>
                    <p className="text-[12px] text-gray-500">{t("Who can see this story")}</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full p-1 transition-all ${isCloseFriends ? 'bg-green-500' : 'bg-gray-300 dark:bg-white/10'}`}>
                  <div className={`w-4 h-4 rounded-full bg-white transition-all ${isCloseFriends ? 'translate-x-6' : 'translate-x-0'}`} />
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-auto pt-10 border-t border-gray-100 dark:border-white/5 flex gap-4">
                <Button 
                  variant="outline" 
                  className="rounded-full flex-1" 
                  onClick={clearInput}
                  disabled={isLoading}
                >
                  <Trash2 size={18} className="mr-2" />
                  {t('Clear')}
                </Button>
                <Button 
                  className="rounded-full flex-[2]" 
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  disabled={!storyText.trim() && !storyImage}
                >
                  {success ? <CheckCircle2 size={18} className="mr-2" /> : <Share size={18} className="mr-2" />}
                  {success ? t('Published!') : t('Share Story')}
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

AddStoryModel.displayName = 'AddStoryModel';
export default AddStoryModel;
