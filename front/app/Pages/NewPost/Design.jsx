'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import { IoImage, IoHappyOutline } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';

/**
 * Redesigned DesignPost — Threads/Instagram style
 * All original props are preserved and used exactly as provided.
 */
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
  selectedMentions,
  setSelectedMentions,
  mentionSearch,
  setMentionSearch,
  showMentionList,
  setShowMentionList,
  textareaRef,
  handleTextareaChange,
  errorText,
  filteredMentions,
  selectMention,
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
}) => {
  // local UI state
  const [isPosting, setIsPosting] = useState(false);

  // إزالة منشن: تحدث ال-state وتزيل النص من الـ textarea
  const handleRemoveMention = (id) => {
    const removed = selectedMentions.find(m => m._id === id);
    setSelectedMentions(prev => prev.filter(m => m._id !== id));
    if (removed?.username) {
      setPostText(prev => {
        const re = new RegExp(`@${removed.username}\\b\\s?`, 'g');
        return prev.replace(re, '');
      });
    }
  };

  // wrapper to show local loading while invoking parent's handlePost
  const onPostClick = async () => {
    // quick validation
    if ((!postText.trim() && images.length === 0) || errorText) return;
    try {
      setIsPosting(true);
      await Promise.resolve(handlePost && handlePost()); // if handlePost returns a promise it will await
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <main className="flex items-center justify-center w-full py-10 px-4 bg-gray-50 dark:bg-[#0b1020] transition-colors">
      <div className="w-full max-w-4xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-[0_10px_30px_rgba(2,6,23,0.08)] overflow-hidden transition-all duration-300 border border-transparent dark:border-gray-800">
        {/* Header */}
        <div className="flex items-start md:items-center justify-between gap-4 p-5 md:p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-1 ring-white/60">
              <Image
                src={user?.profilePhoto?.url || '/default.png'}
                alt="profile"
                width={56}
                height={56}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h2 className="text-base md:text-lg font-semibold text-gray-800 dark:text-gray-100">
                {user?.username}
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">{user?.profileName}</span>
            </div>
          </div>

          {/* Community selector */}
          <div className="w-full md:w-64 relative">
            {communities?.filter(com => com?.members?.some(m => m._id === user._id)).length > 0 ? (
              <div className="relative">
                <FaUsers className="absolute left-3 top-3 text-gray-400" />
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl text-sm text-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
                >
                  <option value="">Post to</option>
                  {communities
                    .filter(com => com.members.some(m => m._id === user._id))
                    .map((com) => (
                      <option key={com._id} value={com._id}>{com.Name}</option>
                    ))}
                </select>
              </div>
            ) : (
              <span className="text-sm text-gray-500 dark:text-gray-400">You haven’t joined any communities.</span>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-5 md:p-6 relative">
          {/* Selected mentions chips */}
          {selectedMentions?.length > 0 && (
            <div className="mb-4 px-1">
              <div className="flex items-center gap-2 overflow-x-auto py-1">
                {selectedMentions.map((m) => (
                  <div key={m._id} className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm whitespace-nowrap">
                    <Image
                      src={m?.profilePhoto?.url || '/default.png'}
                      alt={m.username}
                      width={28}
                      height={28}
                      className="rounded-full object-cover w-7 h-7"
                    />
                    <span className="text-sm text-gray-800 dark:text-gray-100">@{m.username}</span>
                    <button onClick={() => handleRemoveMention(m._id)} className="p-1 ml-1 rounded-full hover:bg-red-500 hover:text-white transition">
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* highlight layer + textarea */}
          <div className="relative">
            <div className="absolute inset-0 p-5 whitespace-pre-wrap break-words rounded-xl pointer-events-none font-sans text-base leading-relaxed text-gray-800 dark:text-gray-100/90">
              {renderHighlightedText(postText)}
            </div>

            <textarea
              ref={textareaRef}
              value={postText}
              onChange={handleTextareaChange}
              rows={5}
              placeholder="What's on your mind? Add #hashtags, @mentions or 😊 emojis..."
              dir={/[\u0600-\u06FF]/.test(postText) ? 'rtl' : 'ltr'}
              className={`relative w-full p-5 text-base leading-relaxed rounded-xl resize-none border focus:outline-none z-10
                ${errorText ? 'border-red-400 ring-2 ring-red-200 bg-white/60 dark:bg-gray-900/60' : 'border-transparent bg-transparent'}
                text-transparent selection:bg-indigo-200 selection:text-black`}
              style={{ textAlign: /[\u0600-\u06FF]/.test(postText) ? 'right' : 'left' }}
            />
          </div>

          {/* counter & error */}
          <div className="flex items-center justify-between mt-2 text-xs">
            <div className="flex items-center gap-3">
              <span className={`${errorText ? 'text-red-500 font-semibold' : 'text-gray-500'}`}>{postText.length}/500</span>
              {errorText && <span className="text-red-500">Max 500 characters allowed</span>}
            </div>

            {/* optionally show quick hint */}
            <div className="text-xs text-gray-400">Tip: Use @ to mention people, # for topics</div>
          </div>

          {/* Mentions dropdown (floating card) */}
          {showMentionList && filteredMentions.length > 0 && (
            <div className="absolute left-6 mt-3 z-50 w-80 bg-white dark:bg-gray-800/90 backdrop-blur-sm border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl overflow-hidden divide-y divide-gray-100 dark:divide-gray-700 animate-scale-up">
              {filteredMentions.map((u) => (
                <div
                  key={u._id}
                  onClick={() => selectMention(u)}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-indigo-50 dark:hover:bg-gray-700 transition"
                >
                  <Image
                    src={u?.profilePhoto?.url || '/default.png'}
                    alt={u.username}
                    width={40}
                    height={40}
                    className="rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">@{u.username}</span>
                    </div>
                    {u.profileName && <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{u.profileName}</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images preview */}
        {images.length > 0 && (
          <div className="px-5 md:px-6 pb-4">
            <div className={`grid gap-3 ${images.length === 1 ? 'grid-cols-1' : images.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {images.slice(0, 3).map((img, idx) => (
                <div key={idx} className="relative rounded-xl overflow-hidden shadow-sm">
                  <img src={img.url} alt={`preview-${idx}`} className="w-full h-36 object-cover transform group-hover:scale-105 transition" />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-black/50 backdrop-blur-sm text-white rounded-full hover:bg-red-500 transition"
                  >
                    <FiX size={16} />
                  </button>
                  {idx === 2 && images.length > 3 && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-lg font-semibold">
                      +{images.length - 3}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer tools */}
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <label className="relative cursor-pointer inline-flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition shadow-sm">
              <IoImage size={18} />
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-gray-50 dark:bg-gray-800 hover:bg-yellow-50 dark:hover:bg-yellow-900 transition shadow-sm"
              title="Add emoji"
            >
              <IoHappyOutline size={18} />
            </button>

            {showEmojiPicker && (
              <div className="absolute z-50 bottom-20 left-6 w-[320px] rounded-2xl shadow-2xl overflow-hidden transform animate-scale-up">
                <div className="flex justify-between items-center px-3 py-2 bg-white dark:bg-gray-800">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">Emojis</span>
                  <button onClick={() => setShowEmojiPicker(false)} className="text-gray-600 dark:text-gray-300">
                    <FiX size={18} />
                  </button>
                </div>
                <div className="bg-white dark:bg-gray-900">
                  <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" height={300} />
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* schedule switch */}
            <div className="flex items-center gap-3">
              <div
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className={`w-12 h-6 flex items-center p-1 rounded-full cursor-pointer ${scheduleEnabled ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                title="Schedule"
              >
                <div className={`w-4 h-4 bg-white rounded-full shadow transform transition ${scheduleEnabled ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">Schedule</span>
            </div>

            <button
              onClick={onPostClick}
              disabled={((!postText.trim() && images.length === 0) || errorText) || isPosting}
              className={`relative inline-flex items-center px-6 py-2 rounded-full font-semibold transition
                ${((!postText.trim() && images.length === 0) || errorText) || isPosting ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-indigo-500 to-pink-500 text-white shadow-lg hover:opacity-95'}`}
            >
              {isPosting ? (
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                </svg>
              ) : null}
              {isPosting ? 'Posting...' : 'Post'}
            </button>
          </div>
        </div>

        {/* Schedule Date input */}
        <div className="px-5 md:px-6 pb-6">
          {scheduleEnabled && (
            <div className="mt-3">
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => setScheduleDate(e.target.value)}
                min={new Date().toISOString().slice(0, 16)}
                className="px-3 py-2 border rounded-lg text-sm bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default DesignPost;
