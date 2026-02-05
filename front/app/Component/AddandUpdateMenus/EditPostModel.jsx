'use client';
import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import { usePost } from '../../Context/PostContext';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { IoHappyOutline, IoImageOutline, IoLinkOutline } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';
import { useCommunity } from '@/app/Context/CommunityContext';
import { useAuth } from '@/app/Context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
          <h2 className="text-xl font-black text-white tracking-tight">{t('Edit Post')}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all">
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">

          {/* Community Select */}
          {userCommunities.length > 0 && (
            <div className="relative group">
              <select
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="w-full p-4 bg-white/5 border border-white/10 rounded-2xl text-white appearance-none cursor-pointer focus:outline-none focus:border-indigo-500/50 transition-all font-medium"
              >
                <option value="" className="bg-[#0A0A0A]">{t('Select Community (Optional)')}</option>
                {userCommunities.map((com) => (
                  <option key={com._id} value={com._id} className="bg-[#0A0A0A]">
                    {com.Name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Text Area */}
          <textarea
            ref={textareaRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("What's updating in your world?")}
            className="w-full h-40 bg-transparent text-lg text-white placeholder-gray-500 resize-none focus:outline-none leading-relaxed"
          />

          {/* Links Display */}
          <div className="flex flex-wrap gap-2">
            {links.map((l, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-full">
                <span className="text-xs text-indigo-300 truncate max-w-[200px]">{l}</span>
                <button onClick={() => handleRemoveLink(idx)} className="text-indigo-400 hover:text-indigo-200"><FaTimes size={10} /></button>
              </div>
            ))}
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {/* Existing */}
            {existingPhotos.map((photo) => (
              <div key={photo.public_id} className="relative aspect-square rounded-xl overflow-hidden group">
                <Image src={photo.url} alt="post-img" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => removePhoto(photo.public_id)} className="bg-red-500 p-2 rounded-full text-white">
                    <FaTimes size={14} />
                  </button>
                </div>
              </div>
            ))}
            {/* New */}
            {newPhotosPreview.map(({ preview }, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-indigo-500/50">
                <Image src={preview} alt="new" fill className="object-cover opacity-80" />
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar & Footer */}
        <div className="p-4 bg-[#111] border-t border-white/5 flex flex-col gap-4">

          {/* Input Tools */}
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
                  placeholder={t("Paste your link here...")}
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                />
                <button onClick={handleAddLink} className="px-4 py-2 bg-indigo-600 rounded-xl text-white text-xs font-bold uppercase tracking-wider">{t('Add')}</button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="p-3 rounded-full hover:bg-white/5 text-indigo-400 transition-colors cursor-pointer">
                <IoImageOutline size={22} />
                <input type="file" multiple onChange={handleNewPhotos} className="hidden" />
              </label>
              <button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="p-3 rounded-full hover:bg-white/5 text-yellow-400 transition-colors relative">
                <IoHappyOutline size={22} />
                <AnimatePresence>
                  {showEmojiPicker && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute bottom-12 left-0 z-50"
                    >
                      <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" width={300} height={400} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
              <button onClick={() => setShowLinkInput(!showLinkInput)} className={`p-3 rounded-full transition-colors ${showLinkInput ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-blue-400'}`}>
                <IoLinkOutline size={22} />
              </button>
            </div>

            <div className="flex gap-3">
              <button onClick={onClose} className="px-6 py-3 rounded-xl text-gray-400 hover:text-white font-medium text-sm transition-colors">
                {t('Cancel')}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-8 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/20 disabled:opacity-50 transition-all"
              >
                {isLoading ? <FaSpinner className="animate-spin relative left-0 right-0 mx-auto" /> : t('Save Changes')}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

EditPostModal.displayName = 'EditPostModal';
export default EditPostModal;
