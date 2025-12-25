'use client'
import React, { useMemo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiXMark,
  HiOutlineCalendarDays,
  HiPhoto,
  HiFaceSmile,
  HiUsers,
  HiLink,
  HiChevronRight,
  HiCheckBadge
} from 'react-icons/hi2'
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

  // Derived state
  const charCount = postText ? postText.length : 0
  const isRTL = useMemo(() => /[\u0600-\u06FF]/.test(postText || ''), [postText])
  const canPost = (postText?.trim() || images.length > 0) && !loading && !errorText

  return (
    <main className="min-h-screen bg-lightMode-bg dark:bg-[#050505] flex items-center justify-center py-12 px-4 sm:px-6 transition-colors duration-500">
      {/* Decorative Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] overflow-hidden"
        >
          {/* Header Section */}
          <div className="px-8 pt-8 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-16 h-16 rounded-[1.5rem] overflow-hidden ring-2 ring-white dark:ring-gray-900 shadow-lg">
                  <Image
                    src={selectedUser?.profilePhoto?.url || '/default-avatar.png'}
                    alt="profile"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                  <span className="w-2 h-6 bg-indigo-600 rounded-full" />
                  {t('New Broadcast')}
                </h2>
                <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mt-1">
                  {selectedUser?.username || 'Zocial Navigator'}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="p-1 gap-1 flex bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <PostPrivacySelector defaultValue={privacy} onChange={(v) => setPrivacy(v)} />

                {communities?.length > 0 &&
                  communities.some((c) => c?.members?.some((m) => m._id === selectedUser?._id)) && (
                    <div className="relative flex items-center">
                      <HiUsers className="absolute left-3 text-gray-400 pointer-events-none" size={16} />
                      <select
                        value={selectedCommunity}
                        onChange={(e) => setSelectedCommunity(e.target.value)}
                        className="pl-9 pr-8 py-2 bg-transparent text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider focus:outline-none appearance-none cursor-pointer"
                      >
                        <option value="" className="bg-white dark:bg-gray-900">{t("Global")}</option>
                        {communities
                          .filter((com) => com.members.some((m) => m._id === selectedUser?._id))
                          .map((com) => (
                            <option key={com._id} value={com._id} className="bg-white dark:bg-gray-900">
                              {com.Name}
                            </option>
                          ))}
                      </select>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="px-8 pb-8 space-y-6">
            {/* Link Pills */}
            <AnimatePresence>
              {links?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {links.map((link, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl group"
                    >
                      <HiLink className="text-indigo-500" size={14} />
                      <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 truncate max-w-[200px]">
                        {link}
                      </span>
                      <button onClick={() => handleRemoveLink(idx)} className="text-gray-400 hover:text-rose-500 transition-colors">
                        <HiXMark size={16} />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>

            {/* Input Utilities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative group">
                <input
                  type="text"
                  placeholder={t("Inject URL context...")}
                  value={linkInput}
                  onChange={(e) => setLinkInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-sm font-medium text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all"
                />
                <HiLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                {linkInput?.trim() && (
                  <button
                    onClick={handleAddLink}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
                  >
                    <HiChevronRight size={16} />
                  </button>
                )}
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                  <HiOutlineCalendarDays className="text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                </div>
                <input
                  type="datetime-local"
                  value={scheduleDate}
                  onChange={(e) => {
                    setScheduleDate(e.target.value)
                    setScheduleEnabled(!!e.target.value)
                  }}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl text-sm font-medium text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40 outline-none transition-all appearance-none"
                />
              </div>
            </div>

            {/* Main Content Area */}
            <div className="relative">
              <textarea
                ref={textareaRef}
                value={postText}
                onChange={handleTextareaChange}
                rows={6}
                placeholder={t("Transcribe your vision... Use #hashtags and @mentions")}
                dir={isRTL ? 'rtl' : 'ltr'}
                className={`w-full p-8 text-xl md:text-2xl font-medium leading-relaxed bg-gray-50 dark:bg-white/5 border rounded-[2rem] resize-none focus:ring-4 transition-all duration-500 outline-none ${errorText
                  ? 'border-rose-500/50 focus:ring-rose-500/10 text-rose-500'
                  : 'border-gray-100 dark:border-white/5 focus:ring-indigo-500/10 dark:text-white/90'
                  }`}
              />

              {/* Character Score */}
              <div className="absolute bottom-6 right-8 flex items-center gap-4">
                <div className={`text-[10px] font-black uppercase tracking-widest ${charCount > 450 ? 'text-rose-500' : 'text-gray-400'}`}>
                  {charCount} / 500
                </div>
                {charCount > 0 && (
                  <div className="w-8 h-8 rounded-full border-2 border-gray-100 dark:border-white/5 flex items-center justify-center relative">
                    <svg className="w-full h-full -rotate-90">
                      <circle
                        cx="16" cy="16" r="14"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-gray-100 dark:text-white/5"
                      />
                      <circle
                        cx="16" cy="16" r="14"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeDasharray={88}
                        strokeDashoffset={88 - (charCount / 500) * 88}
                        className={charCount > 450 ? 'text-rose-500' : 'text-indigo-500'}
                      />
                    </svg>
                  </div>
                )}
              </div>

              {/* Mention List UI */}
              <AnimatePresence>
                {showMentionBox && filteredUsers.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    style={{
                      top: (mentionBoxPos.top || 0) + 40,
                      left: (mentionBoxPos.left || 0)
                    }}
                    className="absolute z-[1000] w-72 bg-white/95 dark:bg-[#0B0F1A]/95 backdrop-blur-2xl rounded-[2rem] border border-gray-100 dark:border-white/10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden"
                  >
                    <div className="p-3 border-b border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/5">
                      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 px-2">{t("Connection Radar")}</span>
                    </div>
                    <div className="max-h-64 overflow-y-auto custom-scrollbar">
                      {filteredUsers.map((u, idx) => (
                        <motion.button
                          key={u._id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.05 }}
                          onClick={() => handleSelectMention(u)}
                          className="w-full flex items-center gap-3 p-3 hover:bg-indigo-500 dark:hover:bg-indigo-600 group transition-all"
                        >
                          <div className="relative w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white dark:ring-gray-800 shadow-sm transition-transform group-hover:scale-110">
                            <Image src={u.profilePhoto?.url || '/default-avatar.png'} alt="user" fill className="object-cover" />
                          </div>
                          <div className="text-left min-w-0">
                            <div className="text-xs font-bold text-gray-900 dark:text-white group-hover:text-white truncate">
                              {u.username}
                            </div>
                            <div className="text-[10px] text-gray-500 dark:text-gray-400 group-hover:text-indigo-100 truncate">
                              @{u.profileName || u.username}
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Media Preview Container */}
            <AnimatePresence>
              {images.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {images.map((img, idx) => (
                    <motion.div
                      key={idx}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative aspect-square rounded-[1.5rem] overflow-hidden group shadow-lg"
                    >
                      <Image src={img.url} alt="preview" fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-3">
                        <button
                          onClick={() => removeImage(idx)}
                          className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
                        >
                          <HiXMark size={20} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Footer */}
          <div className="px-8 py-6 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center justify-center w-12 h-12 rounded-2xl bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-white dark:hover:bg-white/10 shadow-sm border border-gray-100 dark:border-white/5 transition-all cursor-pointer group">
                <HiPhoto size={22} className="group-hover:scale-110 transition-transform" />
                <input type="file" accept="image/*" multiple onChange={handleImageChange} className="hidden" />
              </label>

              <button
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={`flex items-center justify-center w-12 h-12 rounded-2xl shadow-sm border border-gray-100 dark:border-white/5 transition-all group ${showEmojiPicker ? 'bg-indigo-600 text-white' : 'bg-white dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:text-amber-500 hover:bg-white'}`}
              >
                <HiFaceSmile size={22} className="group-hover:scale-110 transition-transform" />
              </button>

              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute left-8 bottom-32 z-[100] shadow-2xl rounded-3xl overflow-hidden border border-white/10"
                  >
                    <EmojiPicker
                      onEmojiClick={handleEmojiClick}
                      theme="dark"
                      width={320}
                      height={400}
                      lazyLoadEmojis={true}
                      skinTonesDisabled
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={handlePost}
              disabled={!canPost}
              className={`relative px-12 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all overflow-hidden ${canPost
                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.02] hover:bg-indigo-700 active:scale-[0.98]'
                : 'bg-gray-200 dark:bg-white/5 text-gray-400 dark:text-gray-600 cursor-not-allowed'
                }`}
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <HiChevronRight size={16} />
                  </motion.div>
                  {t('Broadcasting')}...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>{t('Launch Broadcast')}</span>
                  <HiCheckBadge size={16} className={canPost ? 'text-indigo-200' : ''} />
                </div>
              )}
            </button>
          </div>
        </motion.div>

        {/* Floating Tips / Stats */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="mt-8 flex flex-col items-center gap-2"
        >
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.3em]">
            {t("Secure Neural Transmission • Zocial Network")}
          </p>
          <div className="flex gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" style={{ animationDelay: '0.5s' }} />
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" style={{ animationDelay: '1s' }} />
          </div>
        </motion.div>
      </div>
    </main>
  )
}

export default React.memo(NewPostPresenter)

