'use client';
import { useEffect, useState, useRef, useMemo, useCallback, memo } from 'react';
import Image from 'next/image';
import { usePost } from '../../Context/PostContext';
import { FaSpinner, FaTimes } from 'react-icons/fa';
import { IoHappyOutline } from 'react-icons/io5';
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

  const textareaRef = useRef();

  // تحميل بيانات المنشور
  useEffect(() => {
    if (post) {
      setText(post.text || '');
      setExistingPhotos(post.Photos || []);
      setSelectedCommunity(post.community || '');
      setSelectedMentions(post.mentions || []);
      setLinks(post.links || []);
    }
  }, [post]);

  // 🧠 useMemo لتقليل إعادة التصيير
  const userCommunities = useMemo(
    () => communities.filter(com => com?.members?.some(m => m._id === user._id)),
    [communities, user._id]
  );

  const newPhotosPreview = useMemo(
    () => newPhotos.map(file => ({ file, preview: URL.createObjectURL(file) })),
    [newPhotos]
  );

  // 🧩 Callbacks محسّنة
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4 backdrop-blur-sm bg-black/60">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.25 }}
        className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] 
                   overflow-hidden relative border border-gray-200 dark:border-gray-700"
      >
        {/* تحميل أثناء التحديث */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm z-30 flex flex-col items-center justify-center rounded-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                className="text-white text-4xl mb-3"
              >
                <FaSpinner />
              </motion.div>
              <p className="text-white text-sm font-medium tracking-wide">
                {t('Updating post...')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* المحتوى القابل للتمرير */}
        <div
          className="flex flex-col h-full overflow-y-auto px-6 py-4 
                     scrollbar-thin scrollbar-thumb-blue-400/70 scrollbar-track-blue 
                     dark:scrollbar-thumb-blue-600/70 hover:scrollbar-thumb-blue-500 
                     transition-colors duration-300"
        >
          {/* Header */}
          <div className="pb-4 mb-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-10">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white">
              {t('Edit Post')}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-red-600 p-2 rounded-full hover:bg-red-50 transition"
            >
              <FaTimes size={18} />
            </button>
          </div>

          {/* Body */}
          <div className="space-y-4">
            {/* Community */}
            {userCommunities.length > 0 && (
              <div>
                <label className="text-sm text-gray-700 dark:text-gray-300 mb-1 block">
                  {t('Community')}
                </label>
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-darkMode-bg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">{t('Select a Community')}</option>
                  {userCommunities.map((com) => (
                    <option key={com._id} value={com._id}>
                      {com.Name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Text */}
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder={t("What's on your mind?")}
              className="w-full h-32 md:h-40 p-4 text-gray-800 dark:text-white bg-gray-100 dark:bg-gray-800 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />

            {/* Links */}
            {links.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {links.map((l, idx) => (
                  <div key={idx} className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
                    <span className="text-sm text-gray-800 dark:text-gray-100 truncate max-w-xs">{l}</span>
                    <button onClick={() => handleRemoveLink(idx)}><FaTimes size={12} /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                placeholder="Add a link..."
                className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-darkMode-bg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <button onClick={handleAddLink} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                {t('Add')}
              </button>
            </div>

            {/* Existing Photos */}
            {existingPhotos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {existingPhotos.map((photo) => (
                  <div key={photo.public_id} className="relative group rounded-lg overflow-hidden">
                    <Image src={photo.url} alt="post-img" width={500} height={500} className="object-cover w-full h-32 md:h-36 rounded-lg" />
                    <button
                      onClick={() => removePhoto(photo.public_id)}
                      className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 text-xs opacity-0 group-hover:opacity-100 transition"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New Photos */}
            {newPhotosPreview.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                {newPhotosPreview.map(({ preview }, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    <Image width={500} height={500} src={preview} alt="new" className="w-full h-32 md:h-36 object-cover rounded-lg" />
                  </div>
                ))}
              </div>
            )}

            {/* Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t('Add Photos')}
              </label>
              <input
                type="file"
                multiple
                onChange={handleNewPhotos}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 transition"
              />
            </div>

            {/* Emoji Picker */}
            <div className="relative mt-2">
              <button
                onClick={() => setShowEmojiPicker(prev => !prev)}
                className="px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <IoHappyOutline size={22} />
              </button>
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute z-50 mt-2"
                  >
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" height={300} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-6 pb-2 mt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            >
              {t('Cancel')}
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-6 py-2 rounded-full font-medium text-white flex items-center gap-2 transition-transform shadow-lg ${
                isLoading
                  ? 'bg-gradient-to-r from-gray-400 to-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:scale-105'
              }`}
            >
              {isLoading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <FaSpinner />
                  </motion.div>
                  {t('Updating')}...
                </>
              ) : (
                <>{t('Save Changes')}</>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
});

EditPostModal.displayName = 'EditPostModal';
export default EditPostModal;
