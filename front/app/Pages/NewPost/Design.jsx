'use client'
import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiClock } from 'react-icons/fi'
import { IoImage, IoHappyOutline } from 'react-icons/io5'
import { FaUsers } from 'react-icons/fa'
import EmojiPicker from 'emoji-picker-react'
import PostPrivacySelector from '@/app/Component/Post/PostPrivacyAdd'

const NewPostPresenter = (props) => {
  const {
    postText, handleTextareaChange, handlePost, loading, errorText,
    showEmojiPicker, setShowEmojiPicker, handleEmojiClick,
    images, handleImageChange, removeImage,
    links, linkInput, setLinkInput, handleAddLink, handleRemoveLink,
    scheduleEnabled, setScheduleEnabled, scheduleDate, setScheduleDate,
    selectedUser, privacy, setPrivacy, communities, selectedCommunity, setSelectedCommunity,
    filteredUsers, handleSelectMention, showMentionBox, mentionBoxPos, textareaRef
  } = props

  return (
    <main className="flex items-center justify-center w-full py-10 px-4 bg-gray-50 dark:bg-darkMode-bg transition-colors">
      <div className="w-full max-w-5xl mx-auto bg-lightMode-bg dark:bg-darkMode-bg rounded-3xl shadow-xl overflow-hidden transition-all duration-500 relative">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between w-full p-6 border-b border-gray-200 dark:border-gray-700 gap-4">
          <div className="flex items-center gap-4">
            <Image
              src={selectedUser?.profilePhoto?.url || '/default.png'}
              alt="profile"
              width={56}
              height={56}
              className="rounded-full w-14 h-14 object-cover border-2 border-gradient-to-br from-blue-400 to-purple-600"
            />
            <div className="flex flex-col">
              <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                {selectedUser?.username || 'Guest'}
              </h2>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {selectedUser?.profileName || ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2 w-full md:w-auto">
            <PostPrivacySelector defaultValue={privacy} onChange={(v) => setPrivacy(v)} />
            <div className="border-l h-6 dark:border-gray-600 mx-2"></div>

            <div className="relative flex-1 min-w-[160px]">
              <FaUsers className="absolute left-3 top-3 text-gray-400" />
              {communities.filter((com) =>
                com?.members.some((m) => m._id === selectedUser?._id)
              ).length > 0 ? (
                <div className="relative">
                  <FaUsers className="absolute left-3 top-3 text-gray-400" />
                  <select
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-darkMode-bg border dark:border-gray-600 rounded-xl text-sm text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
                  >
                    <option value="">Select a Community</option>
                    {communities
                      .filter((com) =>
                        com.members.some((m) => m._id === selectedUser?._id)
                      )
                      .map((com) => (
                        <option key={com._id} value={com._id}>
                          {com.Name}
                        </option>
                      ))}
                  </select>
                </div>
              ) : (
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  You haven’t joined any communities.
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative p-6 pb-2">
          {/* Links */}
          {links?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {links.map((link, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 truncate max-w-[150px]"
                  >
                    {link}
                  </a>
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
              disabled={!linkInput.trim()}
              className={`px-4 py-2 rounded-lg transition ${
                linkInput.trim()
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Add
            </button>
          </div>

          {/* Text Area */}
          <div className="relative w-full">
            <textarea
              ref={textareaRef}
              value={postText}
              onChange={handleTextareaChange}
              rows={5}
              placeholder="What's on your mind? Add #hashtags, @mentions or 😊 emojis..."
              dir={/[\u0600-\u06FF]/.test(postText) ? 'rtl' : 'ltr'}
              className={`relative w-full p-5 text-base leading-relaxed bg-transparent border rounded-2xl resize-none shadow-inner caret-blue-600 z-10 selection:bg-blue-200 selection:text-black
                ${
                  errorText
                    ? 'border-red-500 focus:ring-red-500'
                    : 'bg-gray-50 dark:bg-darkMode-bg border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                } text-gray-900 dark:text-white`}
            />
          </div>

          {/* Mention Box */}
          <AnimatePresence>
            {showMentionBox && filteredUsers.length > 0 && (
              <motion.ul
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                style={{
                  top: mentionBoxPos.top,
                  left: mentionBoxPos.left,
                }}
                className="absolute bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 z-[9999] w-64 max-h-56 overflow-y-auto"
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

        {/* Images */}
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
                    className="w-full aspect-square object-cover rounded-xl transform group-hover:scale-105 transition-transform duration-300"
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
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
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
                    <span className="text-gray-700 dark:text-gray-200 font-semibold">
                      Emojis
                    </span>
                    <button
                      onClick={() => setShowEmojiPicker(false)}
                      className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
                    >
                      <FiX size={18} />
                    </button>
                  </div>
                  <EmojiPicker
                    onEmojiClick={handleEmojiClick}
                    theme="dark"
                    height={300}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Post Button */}
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
                />
                <span>Posting...</span>
              </>
            ) : (
              <span>Post</span>
            )}
          </button>
        </div>

        {/* Schedule Section */}
        <div className="px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setScheduleEnabled(!scheduleEnabled)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
                scheduleEnabled
                  ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <FiClock size={18} />
              <span className="text-sm font-medium">Schedule Post</span>
            </button>
          </div>

          <AnimatePresence>
            {scheduleEnabled && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-3 shadow-inner transition-all duration-300"
              >
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => setScheduleDate(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {scheduleDate && (
                  <button
                    onClick={() => setScheduleDate('')}
                    className="p-2 rounded-full hover:bg-red-500 hover:text-white transition"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  )
}

export default NewPostPresenter
