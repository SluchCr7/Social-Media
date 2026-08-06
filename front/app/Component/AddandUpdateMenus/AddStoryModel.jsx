'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  X,
  Image as ImageIcon,
  Trash2,
  Camera,
  CheckCircle2,
  Share,
  Sparkles,
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
    backgroundColor: 'rgba(0,0,0,0.03)',
    borderColor: state.isFocused ? '#6366f1' : 'transparent',
    borderRadius: '0.75rem',
    padding: '2px',
    boxShadow: 'none',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: 'white',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    zIndex: 100
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(99,102,241,0.08)' : 'transparent',
    color: 'black',
    cursor: 'pointer',
    fontSize: '13px'
  }),
};

const darkSelectStyles = {
  ...selectStyles,
  control: (base, state) => ({
    ...base,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderColor: state.isFocused ? '#6366f1' : 'transparent',
    borderRadius: '0.75rem',
    padding: '2px',
    boxShadow: 'none',
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: '#0B0F1A',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '0.75rem',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isFocused ? 'rgba(255,255,255,0.1)' : 'transparent',
    color: 'white',
    fontSize: '13px'
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '0.5rem',
  }),
  multiValueLabel: (base) => ({ ...base, color: 'white', fontSize: '11px' }),
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
      }, 1200);
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
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
          <motion.div
            initial={{ y: 15, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 15, opacity: 0, scale: 0.96 }}
            className="w-full max-w-4xl h-[85vh] flex flex-col md:flex-row bg-white dark:bg-[#0B0F1A] rounded-2xl overflow-hidden shadow-xl border border-slate-200/80 dark:border-white/10"
          >
            {/* Story Preview Canvas */}
            <div className="w-full md:w-[320px] h-full bg-slate-50 dark:bg-black/30 p-5 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200/80 dark:border-white/10 relative shrink-0">
              <div className="relative aspect-[9/16] w-full max-w-[240px] bg-slate-900 rounded-2xl overflow-hidden shadow-lg border border-slate-700/30 flex items-center justify-center">
                {previewUrl ? (
                  <div className="absolute inset-0">
                    <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-black/20" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500">
                    <ImageIcon size={36} className="opacity-40 mb-1" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{t('Preview Canvas')}</span>
                  </div>
                )}

                {storyText && (
                  <div className="absolute inset-x-3 bottom-8 p-2 bg-black/40 backdrop-blur-sm rounded-xl text-center">
                    <p className="text-white text-xs font-bold line-clamp-3">
                      {storyText}
                    </p>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsStory(false)} 
                className="md:hidden absolute top-4 right-4 p-1.5 rounded-lg bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            {/* Story Editor Controls */}
            <div className="flex-1 h-full flex flex-col p-5 sm:p-6 overflow-y-auto space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/80 dark:border-white/10">
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('Create Story')}</h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{t('Share moments with your audience')}</p>
                </div>
                <button 
                  onClick={() => setIsStory(false)} 
                  className="hidden md:flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Upload Action Grid */}
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col items-center justify-center py-5 rounded-xl border border-dashed border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-all cursor-pointer bg-slate-50 dark:bg-white/5 group">
                  <Camera size={22} className="text-slate-400 group-hover:text-indigo-600 mb-1 transition-colors" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('Camera')}</span>
                  <input type="file" accept="image/*" capture="camera" onChange={handleImageChange} className="hidden" />
                </label>
                <label className="flex flex-col items-center justify-center py-5 rounded-xl border border-dashed border-slate-200 dark:border-white/10 hover:border-indigo-500 transition-all cursor-pointer bg-slate-50 dark:bg-white/5 group">
                  <ImageIcon size={22} className="text-slate-400 group-hover:text-indigo-600 mb-1 transition-colors" />
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">{t('Upload Photo')}</span>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>
              </div>

              {/* Caption */}
              <div>
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t('Caption')}</label>
                <textarea
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  placeholder={t("Write a caption...")}
                  className="w-full bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none h-20 resize-none transition-all"
                />
              </div>

              {/* Mentions & Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t('Mention Friends')}</label>
                  <Select
                    isMulti
                    options={followerOptions}
                    value={mentions}
                    onChange={setMentions}
                    placeholder={t("Tag someone...")}
                    styles={darkSelectStyles}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t('Add to Highlight')}</label>
                  <Select
                    options={(highlights || []).map(h => ({ value: h._id, label: h.title }))}
                    value={targetHighlight}
                    onChange={setTargetHighlight}
                    placeholder={t("Choose highlight...")}
                    styles={darkSelectStyles}
                  />
                </div>
              </div>

              {/* Close Friends Toggle */}
              <div 
                onClick={() => setIsCloseFriends(!isCloseFriends)}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isCloseFriends 
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/30' 
                    : 'bg-slate-50 dark:bg-white/5 border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles size={18} className={isCloseFriends ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'} />
                  <div>
                    <p className="text-xs font-bold">{isCloseFriends ? t("Close Friends Only") : t("Public Story")}</p>
                    <p className="text-[11px] text-slate-500">{t("Audience visibility")}</p>
                  </div>
                </div>
                <div className={`w-8 h-4.5 rounded-full p-0.5 transition-all ${isCloseFriends ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-white/20'}`}>
                  <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${isCloseFriends ? 'translate-x-3.5' : 'translate-x-0'}`} />
                </div>
              </div>

              {error && (
                <p className="text-xs font-semibold text-rose-500">{error}</p>
              )}

              {/* Footer Actions */}
              <div className="mt-auto pt-3 border-t border-slate-200/80 dark:border-white/10 flex gap-2">
                <button 
                  type="button"
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-1.5" 
                  onClick={clearInput}
                  disabled={isLoading}
                >
                  <Trash2 size={14} />
                  <span>{t('Clear')}</span>
                </button>
                <Button 
                  className="flex-1 rounded-xl py-2 text-xs font-bold" 
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  disabled={!storyText.trim() && !storyImage}
                >
                  {success ? <CheckCircle2 size={16} className="mr-1.5" /> : <Share size={16} className="mr-1.5" />}
                  {success ? t('Published!') : t('Share Story')}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
});

AddStoryModel.displayName = 'AddStoryModel';
export default AddStoryModel;
