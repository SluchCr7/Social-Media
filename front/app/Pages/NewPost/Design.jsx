'use client';
import React from 'react';
import Image from 'next/image';
import { FiX } from 'react-icons/fi';
import { FaUsers } from 'react-icons/fa';
import { IoImage, IoHappyOutline } from 'react-icons/io5';
import EmojiPicker from 'emoji-picker-react';

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

  return (
    <main className="flex items-center justify-center w-full min-h-screen py-10 px-4 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-950 relative overflow-hidden">

      {/* زجاجي الخلفية */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05] pointer-events-none"></div>

      <div className="w-full max-w-5xl mx-auto backdrop-blur-2xl bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-3xl shadow-[0_8px_40px_-10px_rgba(0,0,0,0.4)] overflow-hidden transition-all duration-500">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full p-6 border-b border-white/20 dark:border-gray-700 gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={user?.profilePhoto?.url}
              alt="profile"
              width={56}
              height={56}
              className="rounded-full w-14 h-14 object-cover border-2 border-white/40 shadow-lg"
            />
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white drop-shadow-sm">{user?.username}</h2>
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
                  className="w-full pl-10 pr-4 py-2 bg-white/30 dark:bg-gray-800/40 border border-white/30 dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 backdrop-blur-lg transition"
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

          {/* Mentions Chips */}
          {selectedMentions?.length > 0 && (
            <div className="mb-4 px-1">
              <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin scrollbar-thumb-gray-400/30">
                {selectedMentions.map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center gap-2 bg-white/40 dark:bg-gray-800/60 px-3 py-1 rounded-full shadow-sm backdrop-blur-lg border border-white/20 whitespace-nowrap"
                  >
                    <div className="flex items-center gap-2">
                      <Image
                        src={m?.profilePhoto?.url || '/default.png'}
                        alt={m.username}
                        width={28}
                        height={28}
                        className="rounded-full w-7 h-7 min-w-7 object-cover"
                      />
                      <span className="text-sm text-gray-800 dark:text-gray-100">@{m.username}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveMention(m._id)}
                      aria-label={`Remove mention ${m.username}`}
                      className="p-1 rounded-full hover:bg-red-500/80 hover:text-white transition"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Textarea with Highlight */}
          <div className="relative group">
            <div className="absolute top-0 left-0 w-full h-full p-5 whitespace-pre-wrap break-words rounded-2xl overflow-hidden pointer-events-none font-sans text-base leading-relaxed text-gray-900 dark:text-gray-200">
              {renderHighlightedText(postText)}
            </div>

            <textarea
              ref={textareaRef}
              value={postText}
              onChange={handleTextareaChange}
              rows={5}
              placeholder="What's on your mind? Add #hashtags, @mentions or 😊 emojis..."
              dir={/[\u0600-\u06FF]/.test(postText) ? 'rtl' : 'ltr'}
              className={`relative w-full p-5 text-base font-sans leading-relaxed rounded-2xl resize-none border focus:ring-2 bg-transparent caret-blue-600 z-10 text-transparent selection:bg-blue-200 selection:text-black shadow-inner
                ${errorText
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-white/30 dark:border-gray-700 focus:ring-blue-500'
                }`}
            />
          </div>

          {/* Counter */}
          <div className="flex justify-between items-center mt-1 text-xs">
            <span className={`${errorText ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
              {postText.length}/500
            </span>
            {errorText && <span className="text-red-500">Max 500 characters allowed</span>}
          </div>

          {/* Mentions Dropdown */}
          {showMentionList && filteredMentions.length > 0 && (
            <div className="absolute top-full left-6 mt-2 z-50 bg-white/70 dark:bg-gray-800/80 backdrop-blur-lg shadow-2xl rounded-xl w-72 max-h-60 overflow-auto border border-white/30 dark:border-gray-600">
              {filteredMentions.map((u) => (
                <div
                  key={u._id}
                  className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-blue-50/60 dark:hover:bg-gray-700 transition"
                  onClick={() => selectMention(u)}
                >
                  <Image
                    src={u?.profilePhoto?.url || '/default.png'}
                    alt={u.username}
                    width={32}
                    height={32}
                    className="rounded-full w-8 h-8 min-w-8 object-cover"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">@{u.username}</span>
                    {u.profileName && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">{u.profileName}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Images */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6 pb-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden shadow-lg border border-white/20 backdrop-blur-sm">
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
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex relative items-center justify-between px-6 py-4 border-t border-white/20 dark:border-gray-700">
          <div className="flex items-center gap-3 relative">
            <label className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-white/40 dark:bg-gray-800/40 hover:bg-blue-100/50 dark:hover:bg-blue-900/50 text-gray-700 dark:text-gray-300 shadow-md backdrop-blur-lg transition">
              <IoImage size={22} />
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>

            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="flex items-center justify-center w-12 h-12 rounded-full bg-white/40 dark:bg-gray-800/40 hover:bg-yellow-100/50 dark:hover:bg-yellow-900/50 text-gray-600 dark:text-gray-300 shadow-md backdrop-blur-lg transition"
            >
              <IoHappyOutline size={22} />
            </button>

            {showEmojiPicker && (
              <div className="absolute z-50 top-[-400px] left-6 w-[320px] rounded-2xl shadow-2xl overflow-hidden backdrop-blur-xl border border-white/20 bg-white/30 dark:bg-gray-800/70 transition-transform">
                <div className="flex justify-between items-center bg-white/30 dark:bg-gray-700/50 px-3 py-2">
                  <span className="text-gray-700 dark:text-gray-200 font-semibold">Emojis</span>
                  <button
                    onClick={() => setShowEmojiPicker(false)}
                    className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
                  >
                    <FiX size={18} />
                  </button>
                </div>
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" height={300} />
              </div>
            )}
          </div>

          <button
            onClick={handlePost}
            disabled={(!postText.trim() && images.length === 0) || errorText}
            className={`px-8 py-2 text-sm font-semibold rounded-full shadow-lg transition-all duration-300 ${
              (!postText.trim() && images.length === 0) || errorText
                ? 'bg-gray-300/60 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500/80 to-purple-600/80 hover:from-blue-600 hover:to-purple-700 text-white backdrop-blur-lg'
            }`}
          >
            Post
          </button>
        </div>

        {/* Schedule Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 px-6 pb-6">
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={scheduleEnabled}
              onChange={(e) => setScheduleEnabled(e.target.checked)}
              id="schedule"
              className="cursor-pointer w-4 h-4 accent-blue-600"
            />
            <label htmlFor="schedule" className="text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              Schedule this post
            </label>
          </div>

          {scheduleEnabled && (
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => setScheduleDate(e.target.value)}
              min={new Date().toISOString().slice(0, 16)}
              className="px-3 py-2 border border-white/30 dark:border-gray-600 rounded-lg text-sm bg-white/30 dark:bg-gray-800/40 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 backdrop-blur-lg"
            />
          )}
        </div>
      </div>
    </main>
  );
};

export default DesignPost;
