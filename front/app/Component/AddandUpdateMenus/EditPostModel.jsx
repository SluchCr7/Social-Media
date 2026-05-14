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
  Loader2,
  Users
} from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';
import { useCommunity } from '@/app/Context/CommunityContext';
import { useAuth } from '@/app/Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';

const EditPostModal = memo(({ post, onClose }) => {
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

  const removePhoto = useCallback(
    (public_id) => setExistingPhotos(prev => prev.filter(photo => photo.public_id !== public_id)),
    []
  );

  const handleNewPhotos = useCallback((e) => {
    const files = Array.from(e.target.files || []);
    if (files.length) setNewPhotos(prev => [...prev, ...files]);
  }, []);

  const handleAddLink = useCallback(() => {
    const trimmed = linkInput.trim();
    if (trimmed) {
      setLinks(prev => [...prev, trimmed]);
      setLinkInput('');
      setShowLinkInput(false);
    }
  }, [linkInput]);

  const handleRemoveLink = useCallback((idx) => {
    setLinks(prev => prev.filter((_, i) => i !== idx));
  }, []);

  const handleEmojiClick = useCallback((emojiData) => {
    setText(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  }, []);

  const handleSubmit = useCallback(async () => {
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
  }, [post, text, selectedCommunity, existingPhotos, newPhotos, selectedMentions, links, editPost, onClose]);

  if (!post) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.98, y: 10 }}
        className="w-full max-w-2xl bg-white dark:bg-black border border-gray-100 dark:border-threads-border rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">{t('Edit Post')}</h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 transition-all"
          >
            <X size={22} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-6">

          {/* Community Select */}
          {userCommunities.length > 0 && (
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                <Users size={18} />
              </span>
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-threads-border rounded-2xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-black/5 dark:focus:ring-white/5 transition-all outline-none font-medium text-[15px]"
              >
                <option value="">{t('Post to Community (Optional)')}</option>
                {userCommunities.map((com) => (
                  <option key={com._id} value={com._id}>{com.Name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("What's on your mind?")}
            className="w-full h-48 bg-transparent text-lg placeholder-gray-400 resize-none focus:outline-none leading-relaxed outline-none"
          />

          {/* Links Display */}
          {links.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {links.map((l, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 px-3 py-1.5 rounded-xl border border-transparent dark:border-threads-border">
                  <span className="text-xs font-medium truncate max-w-[200px]">{l}</span>
                  <button onClick={() => handleRemoveLink(idx)} className="text-gray-400 hover:text-red-500"><X size={12} /></button>
                </div>
              ))}
            </div>
          )}

          {/* Media Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* Existing */}
            {existingPhotos.map((photo) => (
              <div key={photo.public_id} className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 dark:border-white/10">
                <Image src={photo.url} alt="post-img" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removePhoto(photo.public_id)} className="bg-red-500 p-2 rounded-full text-white hover:scale-110 transition-transform">
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
            {/* New */}
            {newPhotosPreview.map(({ preview }, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-indigo-500/30 bg-indigo-500/5">
                <Image src={preview} alt="new" fill className="object-cover opacity-80" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="p-2 bg-white/20 backdrop-blur-md rounded-full">
                     <Plus className="text-white" size={20} />
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar & Footer */}
        <div className="p-6 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 space-y-4">

          {/* Link Input Drawer */}
          <AnimatePresence>
            {showLinkInput && (
              <motion.div
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  placeholder={t("Paste link...")}
                  className="flex-1 bg-white dark:bg-black border border-gray-200 dark:border-threads-border rounded-xl px-4 py-2.5 text-[14px] focus:outline-none focus:ring-2 focus:ring-black/5 transition-all"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                />
                <Button size="sm" onClick={handleAddLink} className="px-6">{t('Add')}</Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <label className="p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-500 hover:text-indigo-500 transition-all cursor-pointer">
                <ImageIcon size={22} />
                <input type="file" multiple onChange={handleNewPhotos} className="hidden" />
              </label>
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)} 
                className={`p-3 rounded-xl transition-all relative ${showEmojiPicker ? 'bg-gray-100 dark:bg-white/5 text-yellow-500' : 'text-gray-500 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <Smile size={22} />
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                      animate={{ opacity: 1, scale: 1, y: 0 }} 
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className="absolute bottom-16 left-0 z-50 shadow-2xl"
                    >
                      <EmojiPicker onEmojiClick={handleEmojiClick} theme="auto" width={320} height={400} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <button 
                onClick={() => setShowLinkInput(!showLinkInput)} 
                className={`p-3 rounded-xl transition-all ${showLinkInput ? 'bg-gray-100 dark:bg-white/5 text-blue-500' : 'text-gray-500 hover:text-blue-500 hover:bg-gray-100 dark:hover:bg-white/5'}`}
              >
                <LinkIcon size={22} />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={onClose} 
                className="px-6 py-2 rounded-full text-gray-500 hover:text-gray-900 dark:hover:text-white font-semibold text-sm transition-colors"
              >
                {t('Cancel')}
              </button>
              <Button
                onClick={handleSubmit}
                isLoading={isLoading}
                className="rounded-full px-8"
              >
                {t('Save Changes')}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

EditPostModal.displayName = 'EditPostModal';
export default EditPostModal;
