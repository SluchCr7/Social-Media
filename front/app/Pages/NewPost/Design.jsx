'use client'

import React, { useRef, useState } from 'react'
import Image from 'next/image'
import { FiX, FiClock } from 'react-icons/fi'
import { FaUsers } from 'react-icons/fa'
import { IoImage, IoHappyOutline } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/Context/AuthContext'

const DesignPost = ({
  user,
  communities,
  selectedCommunity,
  setSelectedCommunity,
  renderHighlightedText,
  postText,
  setPostText,
  images,
  setImages,
  textareaRef,
  handleTextareaChange,
  errorText,
  removeImage,
  handleImageChange,
  showEmojiPicker,
  setShowEmojiPicker,
  handleEmojiClick,
  handlePost,
  setScheduleDate,
  scheduleDate,
  scheduleEnabled,
  setScheduleEnabled,
  links,
  setLinks,
  linkInput,
  setLinkInput,
  handleAddLink,
  handleRemoveLink,
  loading,setLoading
}) => {

const textareaRef = useRef();
  const [cursorPosition, setCursorPosition] = useState(0);
  const [mentionQuery, setMentionQuery] = useState('');
  const [showMentionBox, setShowMentionBox] = useState(false);
  const [selectedMentions, setSelectedMentions] = useState([]);
  const {users}= useAuth()
  // ✅ تحديث موضع المؤشر لمعرفة الكلمة الحالية
  const handleChange = (e) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart;
    setPostText(value);
    setCursorPosition(cursorPos);

    // استخرج الكلمة قبل المؤشر
    const lastWord = value.slice(0, cursorPos).split(/\s+/).pop();
    if (lastWord.startsWith('@')) {
      const query = lastWord.slice(1).toLowerCase();
      setMentionQuery(query);
      setShowMentionBox(true);
    } else {
      setShowMentionBox(false);
    }
  };

  // ✅ عند اختيار مستخدم من القائمة
  const handleSelectMention = (mention) => {
    const beforeCursor = postText.slice(0, cursorPosition);
    const afterCursor = postText.slice(cursorPosition);
    const lastWord = beforeCursor.split(/\s+/).pop();
    const insertText =
      beforeCursor.slice(0, beforeCursor.length - lastWord.length) +
      `@${mention.username} `;

    setPostText(insertText + afterCursor);
    setSelectedMentions((prev) => {
      if (!prev.some((m) => m._id === mention._id)) {
        return [...prev, mention];
      }
      return prev;
    });
    setShowMentionBox(false);
    setMentionQuery('');
    setTimeout(() => textareaRef.current.focus(), 0);
  };

  const filteredUsers = users.filter(
    (u) =>
      mentionQuery &&
      u.username.toLowerCase().includes(mentionQuery.toLowerCase()) &&
      u._id !== user._id
  );
  return (
    <main className="flex items-center justify-center w-full py-10 px-4 bg-gray-50 dark:bg-darkMode-bg transition-colors">
      <div className="w-full max-w-5xl mx-auto bg-lightMode-bg dark:bg-darkMode-bg rounded-3xl shadow-xl overflow-hidden transition-all duration-500 relative">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full p-6 border-b border-gray-200 dark:border-gray-700 gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={user?.profilePhoto?.url || '/default.png'}
              alt="profile"
              width={56}
              height={56}
              className="rounded-full w-14 h-14 object-cover border-2 border-gradient-to-br from-blue-400 to-purple-600"
            />
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">{user?.username}</h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">{user?.profileName}</span>
            </div>
          </div>

          {/* Community Selector */}
          <div className="w-full md:w-64 relative">
            {communities.filter(com => com?.members.some(m => m._id === user._id)).length > 0 ? (
              <div className="relative">
                <FaUsers className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-darkMode-bg border dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                >
                  <option value="">Select a Community</option>
                  {communities
                    .filter(com => com.members.some(m => m._id === user._id))
                    .map((com) => (
                      <option key={com._id} value={com._id}>
                        {com.Name}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">You haven’t joined any communities.</span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="relative p-6 pb-2">

          {/* Links */}
          {links?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {links.map((link, idx) => (
                <div key={idx} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm">
                  <a href={link} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-600 truncate max-w-[150px]">{link}</a>
                  <button
                    onClick={() => handleRemoveLink(idx)}
                    className="p-1 rounded-full hover:bg-red-500 hover:text-white transition"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add Link */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add a link..."
              value={linkInput}
              onChange={(e) => setLinkInput(e.target.value)}
              className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-darkMode-bg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddLink}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              Add
            </button>
          </div>

          {/* Text Area */}
          <div className="relative">
            <div className="absolute top-0 left-0 w-full h-full p-5 whitespace-pre-wrap break-words rounded-2xl overflow-hidden pointer-events-none font-sans text-base leading-relaxed">
              {renderHighlightedText(postText)}
            </div>
            <textarea
              ref={textareaRef}
              value={postText}
              onChange={handleTextareaChange}
              rows={5}
              placeholder="What's on your mind? Add #hashtags, @mentions or 😊 emojis..."
              dir={/[\u0600-\u06FF]/.test(postText) ? 'rtl' : 'ltr'}
              className={`relative w-full p-5 text-base leading-relaxed text-transparent rounded-2xl resize-none border shadow-inner bg-transparent caret-blue-600 z-10 selection:bg-blue-200 selection:text-black
                ${errorText
                  ? 'border-red-500 focus:ring-red-500'
                  : 'bg-gray-50 dark:bg-darkMode-bg border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                }`}
              style={{ textAlign: /[\u0600-\u06FF]/.test(postText) ? 'right' : 'left' }}
            />
          </div>
          <AnimatePresence>
          {showMentionBox && filteredUsers.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute left-5 bottom-[110%] bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 z-50 max-h-56 overflow-y-auto w-72"
            >
              {filteredUsers.map((mention) => (
                <li
                  key={mention._id}
                  onClick={() => handleSelectMention(mention)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer transition-all"
                >
                  <Image
                    src={mention.profilePhoto?.url || '/default.png'}
                    alt=""
                    width={28}
                    height={28}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-700 dark:text-white">
                      {mention.username}
                    </span>
                    <span className="text-xs text-gray-400">
                      {mention.profileName || ''}
                    </span>
                  </div>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
        </div>

        {/* Image Preview */}
        <AnimatePresence>
          {images.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6 pb-4"
            >
              {images.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="relative group rounded-xl overflow-hidden shadow-lg"
                >
                  <img
                    src={img.url}
                    alt={`preview-${idx}`}
                    className="w-full h-32 object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow hover:bg-red-600 transition"
                  >
                    <FiX size={16} />
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Footer */}
        <div className="flex relative items-center justify-between px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 relative">
            <label className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-darkMode-bg hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300 transition shadow-md">
              <IoImage size={22} />
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-darkMode-bg hover:bg-yellow-100 dark:hover:bg-yellow-800 text-gray-600 dark:text-gray-300 transition shadow-md"
            >
              <IoHappyOutline size={22} />
            </button>

            {/* Emoji Picker */}
            <AnimatePresence>
              {showEmojiPicker && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute z-50 bottom-[110%] left-0 w-[320px] rounded-2xl shadow-2xl overflow-hidden"
                >
                  <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 px-3 py-2">
                    <span className="text-gray-700 dark:text-gray-200 font-semibold">Emojis</span>
                    <button
                      onClick={() => setShowEmojiPicker(false)}
                      className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                  <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" height={300} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Post Button with Loading */}
          <button
            onClick={handlePost}
            disabled={loading || (!postText.trim() && images.length === 0) || errorText}
            className={`px-8 py-2 text-sm font-semibold rounded-full shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
              loading
                ? 'bg-gray-400 text-white cursor-wait'
                : (!postText.trim() && images.length === 0) || errorText
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            }`}
          >
            {loading ? (
              <>
                <motion.span
                  className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                ></motion.span>
                Posting...
              </>
            ) : (
              'Post'
            )}
          </button>
        </div>

        {/* Schedule Post (Enhanced) */}
        <div className="px-6 pb-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-darkMode-bg/30">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <div
              onClick={() => setScheduleEnabled(!scheduleEnabled)}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div
                className={`flex items-center justify-center w-6 h-6 rounded-full border transition-all duration-300 ${
                  scheduleEnabled
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 border-transparent'
                    : 'border-gray-400 dark:border-gray-600'
                }`}
              >
                {scheduleEnabled && <FiClock className="text-white text-sm" />}
              </div>
              <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition">
                Schedule this post
              </span>
            </div>

            <AnimatePresence>
              {scheduleEnabled && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                  transition={{ duration: 0.25 }}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-xl shadow-inner"
                >
                  <FiClock className="text-blue-500" />
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    min={new Date().toISOString().slice(0, 16)}
                    className="px-3 py-1.5 border-none bg-transparent text-sm text-gray-700 dark:text-gray-200 focus:ring-0"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  )
}

export default DesignPost
