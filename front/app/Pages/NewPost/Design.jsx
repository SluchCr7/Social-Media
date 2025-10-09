'use client'

import React from 'react'
import Image from 'next/image'
import { FiX } from 'react-icons/fi'
import { FaUsers } from 'react-icons/fa'
import { IoImage, IoHappyOutline } from 'react-icons/io5'
import EmojiPicker from 'emoji-picker-react'

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
  // 🟢 Links
  links,
  setLinks,
  linkInput,
  setLinkInput,
  handleAddLink,
  handleRemoveLink,
  // 🟢 Mentions Input
  MentionInputBox
}) => {
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

          {/* MentionsInput */}
          <div className="relative mb-4">
            {MentionInputBox ? (
              <div className="relative">
                <MentionInputBox />
              </div>
            ) : (
              <p className="text-gray-400 text-sm">MentionInput not loaded</p>
            )}
          </div>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-6 pb-4">
            {images.map((img, idx) => (
              <div key={idx} className="relative group rounded-xl overflow-hidden shadow-lg">
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
            {showEmojiPicker && (
              <div className="absolute z-50 bottom-[110%] left-0 w-[320px] rounded-2xl shadow-2xl overflow-hidden transition-transform duration-300">
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
              </div>
            )}
          </div>

          <button
            onClick={handlePost}
            disabled={(!postText.trim() && images.length === 0) || errorText}
            className={`px-8 py-2 text-sm font-semibold rounded-full shadow-lg transition-all duration-300 ${
              (!postText.trim() && images.length === 0) || errorText
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white'
            }`}
          >
            Post
          </button>
        </div>

        {/* Schedule Post */}
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
              className="px-3 py-2 border dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-darkMode-bg text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
            />
          )}
        </div>
      </div>
    </main>
  )
}

export default DesignPost
