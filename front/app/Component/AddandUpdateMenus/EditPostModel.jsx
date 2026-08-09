'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import { usePost } from '../../Context/PostContext';
import { 
  X, 
  Image as ImageIcon, 
  Smile, 
  Link as LinkIcon, 
  Plus,
  Users
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useCommunity } from '@/app/Context/CommunityContext';
import { useAuth } from '@/app/Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

const EditPostModal = ({ post, onClose }) => {
  const { editPost, isLoading } = usePost();
  const { communities } = useCommunity();
  const { user } = useAuth();
  const { t } = useTranslation();

  const [text, setText] = useState('');
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [newPhotos, setNewPhotos] = useState([]);
  const [selectedCommunity, setSelectedCommunity] = useState('');
  const [selectedMentions, setSelectedMentions] = useState([]);
  const [links, setLinks] = useState([]);
  const [linkInput, setLinkInput] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);

  const textareaRef = useRef();

  useEffect(() => {
    if (post) {
      setText(post.text || '');
      setExistingPhotos(post.Photos || []);
      setSelectedCommunity(post.community || '');
      setSelectedMentions(post.mentions || []);
      setLinks(post.links || []);
    }
  }, [post]);

  const userCommunities = useMemo(
    () => communities.filter(com => com?.members?.some(m => m._id === user._id)),
    [communities, user._id]
  );

  const newPhotosPreview = useMemo(
    () => newPhotos.map(file => ({ file, preview: URL.createObjectURL(file) })),
    [newPhotos]
  );

  const removePhoto = (public_id) => setExistingPhotos(prev => prev.filter(photo => photo.public_id !== public_id));

  const handleNewPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setNewPhotos(prev => [...prev, ...files]);
  };

  const handleAddLink = () => {
    const trimmed = linkInput.trim();
    if (trimmed) {
      setLinks(prev => [...prev, trimmed]);
      setLinkInput('');
      setShowLinkInput(false);
    }
  };

  const handleRemoveLink = (idx) => {
    setLinks(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEmojiClick = (emojiData) => {
    setText(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };

  const handleSubmit = async () => {
    if (!post) return;
    await editPost(post._id, {
      text,
      community: selectedCommunity,
      existingPhotos,
      newPhotos,
      mentions: selectedMentions,
      links,
    });
    onClose();
  };

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-3 sm:p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="w-full max-w-xl bg-white dark:bg-[#0B0F1A] border border-slate-200/80 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 dark:border-white/10 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('Edit Post')}</h2>
          <button 
            onClick={onClose} 
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">

          {/* Community Selector */}
          {userCommunities.length > 0 && (
            <div>
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1 block">{t('Post Destination')}</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                  <Users size={16} />
                </span>
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl text-xs font-semibold outline-none transition-all cursor-pointer"
                >
                  <option value="">{t('Personal Feed (No Community)')}</option>
                  {userCommunities.map((com) => (
                    <option key={com._id} value={com._id}>{com.Name}</option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Text Editor */}
          <div>
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("Edit post text...")}
              className="w-full h-36 bg-slate-100 dark:bg-white/5 border border-transparent focus:border-indigo-500/50 rounded-xl p-3 text-xs sm:text-sm font-medium outline-none resize-none transition-all"
            />
          </div>

          {/* Links Display */}
          {links.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {links.map((l, idx) => (
                <div key={idx} className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/10 px-3 py-1 rounded-lg text-xs font-medium">
                  <span className="truncate max-w-[200px]">{l}</span>
                  <button onClick={() => handleRemoveLink(idx)} className="text-slate-400 hover:text-rose-500"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Photos Grid */}
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {/* Existing Photos */}
            {existingPhotos.map((photo) => (
              <div key={photo.public_id} className="relative aspect-square rounded-xl overflow-hidden group bg-slate-100 dark:bg-white/5 border border-slate-200/60 dark:border-white/10">
                <Image src={photo.url} alt="post-img" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removePhoto(photo.public_id)} className="bg-rose-600 p-1.5 rounded-full text-white hover:scale-105 transition-transform">
                    <X size={14} />
                  </button>
                </div>
              </div>
            ))}
            {/* New Photos */}
            {newPhotosPreview.map(({ preview }, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-indigo-500/30 bg-indigo-500/5">
                <Image src={preview} alt="new" fill className="object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="p-1 bg-black/50 rounded-full">
                     <Plus className="text-white" size={14} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar & Footer */}
        <div className="p-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-200/80 dark:border-white/10 space-y-3">

          {/* Link Drawer */}
          <AnimatePresence>
            {showLinkInput && (
              <motion.div
                initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder={t("Paste URL...")}
                  className="flex-1 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-3 py-1.5 text-xs font-medium outline-none focus:border-indigo-500/50"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                />
                <Button size="sm" onClick={handleAddLink} className="px-3 py-1.5 text-xs">{t('Add')}</Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <label className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer" title={t("Add Images")}>
                <ImageIcon size={18} />
                <input type="file" multiple onChange={handleNewPhotos} className="hidden" />
              </label>
              <button 
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-amber-500 transition-colors relative"
                title={t("Emoji")}
              >
                <Smile size={18} />
                <AnimatePresence>
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 left-0 z-50 shadow-xl">
                      <EmojiPicker onEmojiClick={handleEmojiClick} theme="auto" width={280} height={360} />
                    </div>
                  )}
                </AnimatePresence>
              </button>
              <button 
                type="button"
                onClick={() => setShowLinkInput(!showLinkInput)} 
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-white/10 text-slate-500 hover:text-indigo-600 transition-colors"
                title={t("Attach Link")}
              >
                <LinkIcon size={18} />
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={onClose} 
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 transition-colors"
              >
                {t('Cancel')}
              </button>
              <Button
                onClick={handleSubmit}
                isLoading={isLoading}
                className="rounded-xl px-5 py-2 text-xs font-bold"
              >
                {t('Save Changes')}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default EditPostModal;
