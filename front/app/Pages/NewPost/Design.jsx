'use client'
import React, { useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiClock } from 'react-icons/fi'
import { IoImage, IoHappyOutline } from 'react-icons/io5'
import { FaUsers } from 'react-icons/fa'
import EmojiPicker from 'emoji-picker-react'
import PostPrivacySelector from '@/app/Component/Post/PostPrivacyAdd'
import { useTranslation } from 'react-i18next'

const NewPostPresenter = (props) => {
  const {
    postText, handleTextareaChange, handlePost, loading, errorText,
    showEmojiPicker, setShowEmojiPicker, handleEmojiClick,
    images = [], handleImageChange, removeImage,
    links = [], linkInput, setLinkInput, handleAddLink, handleRemoveLink,
    scheduleEnabled, setScheduleEnabled, scheduleDate, setScheduleDate,
    selectedUser, privacy, setPrivacy, communities = [], selectedCommunity, setSelectedCommunity,
    filteredUsers = [], handleSelectMention, showMentionBox, mentionBoxPos = {}, textareaRef
  } = props

  const { t } = useTranslation()

  // derived
  const charCount = postText ? postText.length : 0
  const rtl = useMemo(() => /[\u0600-\u06FF]/.test(postText || ''), [postText])

  return (
    <main className="flex items-center justify-center w-full py-8 px-4 bg-lightMode-bg dark:bg-darkMode-bg transition-colors min-h-screen">
      <div className="w-full max-w-3xl mx-auto relative">
        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="bg-lightMode-menu dark:bg-darkMode-menu rounded-3xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-800 transition-all duration-500"
        >
          {/* Header */}
          <div className="p-5 md:p-6 bg-gradient-to-br from-white/60 via-transparent to-white/30 dark:from-gray-900/60 dark:via-transparent dark:to-gray-800/30 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              {/* Profile + title */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="relative flex-shrink-0">
                  <Image
                    src={selectedUser?.profilePhoto?.url || '/default.png'}
                    alt="profile"
                    width={64}
                    height={64}
                    className="rounded-full w-16 h-16 object-cover border-2 border-blue-400 shadow-md"
                  />
                </div>
                <div className="min-w-0">
                  <h2 className="text-lg md:text-xl font-semibold text-gray-800 dark:text-white truncate">
                    {selectedUser?.username || 'Guest'}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {selectedUser?.profileName || ''}
                  </p>
                </div>
              </div>

              {/* Controls: privacy + community (on wide screens inline) */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-2">
                  <div className="min-w-[160px]">
                    <PostPrivacySelector defaultValue={privacy} onChange={(v) => setPrivacy(v)} />
                  </div>

                  <div className="hidden md:block h-8 border-l dark:border-gray-600 mx-1" />

                  <div className="relative min-w-[180px]">
                    {communities?.length > 0 &&
                    communities.some((c) => c?.members?.some((m) => m._id === selectedUser?._id)) ? (
                      <select
                        value={selectedCommunity}
                        onChange={(e) => setSelectedCommunity(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-gray-100 dark:bg-gray-900 border dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">{t("Select Community")}</option>
                        {communities
                          .filter((com) => com.members.some((m) => m._id === selectedUser?._id))
                          .map((com) => (
                            <option key={com._id} value={com._id}>
                              {com.Name}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t("No joined communities.")}
                      </span>
                    )}
                    <FaUsers className="absolute left-2 top-2.5 text-gray-400" />
                  </div>
                </div>

                {/* compact on small screens: move controls below using flex-wrap */}
              </div>
            </div>

            {/* On small screens: put privacy + community as a second row for clarity */}
            <div className="mt-3 md:hidden">
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <PostPrivacySelector defaultValue={privacy} onChange={(v) => setPrivacy(v)} />
                </div>
                <div className="flex-1">
                  {communities?.length > 0 &&
                  communities.some((c) => c?.members?.some((m) => m._id === selectedUser?._id)) ? (
                    <select
                      value={selectedCommunity}
                      onChange={(e) => setSelectedCommunity(e.target.value)}
                      className="w-full pl-3 pr-3 py-2 bg-gray-100 dark:bg-gray-900 border dark:border-gray-700 rounded-xl text-sm text-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">{t("Select Community")}</option>
                      {communities
                        .filter((com) => com.members.some((m) => m._id === selectedUser?._id))
                        .map((com) => (
                          <option key={com._id} value={com._id}>
                            {com.Name}
                          </option>
                        ))}
                    </select>
                  ) : (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {t("No joined communities.")}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-5 md:p-6 space-y-4 relative">
            {/* Links pills */}
            {links?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {links.map((link, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full shadow-sm hover:shadow-md transition"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 truncate max-w-[180px]"
                    >
                      {link}
                    </a>
                    <button
                      onClick={() => handleRemoveLink(idx)}
                      className="p-1 rounded-full hover:bg-red-500 hover:text-white transition"
                      aria-label={t("Remove link")}
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Link */}
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder={`${t("Add a link")}...`}
                value={linkInput}
                onChange={(e) => setLinkInput(e.target.value)}
                className="flex-1 px-4 py-2 border dark:border-gray-600 rounded-lg text-sm bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAddLink}
                disabled={!linkInput?.trim()}
                className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  linkInput?.trim()
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {t("Add")}
              </button>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={postText}
                onChange={handleTextareaChange}
                rows={5}
                placeholder={t("What's on your mind? Add #hashtags, @mentions or 😊 emojis...")}
                dir={rtl ? 'rtl' : 'ltr'}
                className={`w-full p-5 text-base leading-relaxed rounded-2xl resize-none shadow-inner caret-blue-600 border transition-all focus:ring-2 outline-none ${
                  errorText
                    ? 'border-red-500 focus:ring-red-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-white'
                    : 'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:ring-blue-500 text-gray-900 dark:text-white'
                }`}
              />
              {/* small helper row: char count + error */}
              <div className="flex items-center justify-between mt-2 text-xs">
                <div className="text-red-500">{errorText ? errorText : ''}</div>
                <div className="text-gray-500 dark:text-gray-400">{charCount} {t("chars")}</div>
              </div>
            </div>

            {/* Mention Box */}
            <AnimatePresence>
              {showMentionBox && filteredUsers.length > 0 && (
                <motion.ul
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
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
                      className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                    >
                      <Image
                        src={mention.profilePhoto?.url || '/default.png'}
                        alt=""
                        width={28}
                        height={28}
                        className="rounded-full"
                      />
                      <div>
                        <span className="text-sm font-semibold text-gray-700 dark:text-white">
                          {mention.username}
                        </span>
                        <span className="text-xs text-gray-400 block">
                          {mention.profileName || ''}
                        </span>
                      </div>
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>

          {/* Images Grid */}
          <AnimatePresence>
            {images.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="px-5 pb-4"
              >
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
                  {images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ scale: 0.98 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.95, opacity: 0 }}
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
                        aria-label={t("Remove image")}
                      >
                        <FiX size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/60">
            <div className="flex items-center gap-3 relative">
              {/* Image Upload */}
              <label className="cursor-pointer flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-blue-100 dark:hover:bg-blue-800 text-gray-700 dark:text-gray-300 transition shadow-md">
                <IoImage size={22} />
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </label>

              {/* Emoji Button */}
              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-yellow-100 dark:hover:bg-yellow-800 text-gray-600 dark:text-gray-300 transition shadow-md"
                aria-label={t("Open emojis")}
              >
                <IoHappyOutline size={22} />
              </button>

              {/* Emoji Picker Popover */}
              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-0 bottom-[130%] z-50 w-[320px] rounded-2xl shadow-2xl overflow-hidden"
                  >
                    <div className="flex justify-between items-center bg-gray-200 dark:bg-gray-700 px-3 py-2">
                      <span className="text-gray-700 dark:text-gray-200 font-semibold">
                        {t("Emojis")}
                      </span>
                      <button
                        onClick={() => setShowEmojiPicker(false)}
                        className="text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
                        aria-label={t("Close emojis")}
                      >
                        <FiX size={18} />
                      </button>
                    </div>
                    <div className="bg-white dark:bg-gray-900">
                      <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" height={300} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Post Button */}
            <div className="w-full sm:w-auto flex items-center gap-3">
              <button
                onClick={handlePost}
                disabled={loading || (!postText?.trim() && images.length === 0) || !!errorText}
                className={`w-full sm:w-auto px-6 py-2 text-sm font-semibold rounded-full shadow-lg flex items-center justify-center gap-2 transition-all duration-300 ${
                  loading
                    ? 'bg-gray-400 text-white cursor-wait'
                    : (!postText?.trim() && images.length === 0) || errorText
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white'
                }`}
                aria-label={t("Post")}
              >
                {loading ? (
                  <>
                    <motion.span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{t("Posting")}...</span>
                  </>
                ) : (
                  <span>{t("Post")}</span>
                )}
              </button>

              {/* Schedule toggle quick */}
              <button
                onClick={() => setScheduleEnabled(!scheduleEnabled)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-300 ${
                  scheduleEnabled
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 border-blue-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                aria-pressed={scheduleEnabled}
                aria-label={t("Schedule Post")}
              >
                <FiClock size={16} />
                <span className="hidden sm:inline">{t("Schedule")}</span>
              </button>
            </div>
          </div>

          {/* Schedule section */}
          <div className="px-5 py-5 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
            <AnimatePresence>
              {scheduleEnabled && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="flex items-center gap-3 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl p-3 shadow-inner w-full sm:w-auto"
                >
                  <input
                    type="datetime-local"
                    value={scheduleDate}
                    onChange={(e) => setScheduleDate(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-700 text-gray-800 dark:text-gray-100 text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  {scheduleDate && (
                    <button
                      onClick={() => setScheduleDate('')}
                      className="p-2 rounded-full hover:bg-red-500 hover:text-white transition"
                      aria-label={t("Clear schedule")}
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Floating mobile toolbar (sticky at bottom when composing on small screens) */}
        <div className="fixed left-0 right-0 bottom-4 md:hidden flex items-center justify-center z-50">
          <div className="mx-4 bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-xl flex items-center gap-2 px-3 py-2 w-full max-w-3xl">
            <label className="cursor-pointer p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
              <IoImage size={20} />
              <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
            </label>
            <button
              onClick={() => setShowEmojiPicker((s) => !s)}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <IoHappyOutline size={20} />
            </button>
            <div className="flex-1" />
            <button
              onClick={handlePost}
              disabled={loading || (!postText?.trim() && images.length === 0) || !!errorText}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                loading
                  ? 'bg-gray-400 text-white cursor-wait'
                  : (!postText?.trim() && images.length === 0) || errorText
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-700 text-white'
              }`}
            >
              {loading ? t("Posting") : t("Post")}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default React.memo(NewPostPresenter)
