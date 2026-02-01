'use client'

import React, { useMemo, useState, memo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiXMark,
  HiPhoto,
  HiFaceSmile,
  HiUsers,
  HiLink,
  HiChevronRight,
  HiEye,
  HiTrash,
  HiInboxArrowDown,
  HiClock,
  HiMusicalNote,
  HiSparkles
} from 'react-icons/hi2'
import EmojiPicker from 'emoji-picker-react'
import PostPrivacySelector from '@/app/Component/Post/PostPrivacyAdd'
import { useTranslation } from 'react-i18next'

// --- Sub-components for better performance and organization ---

const ControlGroup = memo(({ label, children }) => (
  <div className="space-y-3">
    <label className="text-[10px] font-black uppercase tracking-[0.15em] text-gray-400 dark:text-gray-500 ml-1">
      {label}
    </label>
    <div className="bg-gray-50/50 dark:bg-white/[0.02] rounded-2xl p-1 border border-gray-100 dark:border-white/5 backdrop-blur-sm">
      {children}
    </div>
  </div>
))
ControlGroup.displayName = 'ControlGroup'

const MediaItem = memo(({ item, onRemove }) => (
  <motion.div
    layout
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    className="relative aspect-square rounded-2xl overflow-hidden group border border-gray-100 dark:border-white/5 bg-black/5"
  >
    {item.type === 'video' ? (
      <video src={item.url} className="w-full h-full object-cover" />
    ) : (
      <Image src={item.url} alt="Post media" fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
    )}
    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center backdrop-blur-[2px]">
      <button
        onClick={onRemove}
        className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      >
        <HiTrash size={18} />
      </button>
    </div>
  </motion.div>
))
MediaItem.displayName = 'MediaItem'

const NewPostPresenter = (props) => {
  const {
    postText, handleTextareaChange, handlePost, loading, errorText,
    showEmojiPicker, setShowEmojiPicker, handleEmojiClick,
    media = [], handleMediaChange, removeMedia,
    links = [], linkInput, setLinkInput, handleAddLink, handleRemoveLink,
    scheduleEnabled, setScheduleEnabled, scheduleDate, setScheduleDate,
    selectedUser, privacy, setPrivacy, communities = [], selectedCommunity, setSelectedCommunity,
    filteredUsers = [], handleSelectMention, showMentionBox, mentionBoxPos = {}, textareaRef,
    selectedMusic, setSelectedMusic, musicList = [], isMusicLoading
  } = props

  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState('edit')
  const [showMusicPicker, setShowMusicPicker] = useState(false)
  const [musicQuery, setMusicQuery] = useState('')

  const charCount = postText?.length || 0
  const isRTL = useMemo(() => /[\u0600-\u06FF]/.test(postText || ''), [postText])
  const canPost = (postText?.trim() || media.length > 0) && !loading && !errorText

  const filteredMusic = useMemo(() => {
    const query = musicQuery.toLowerCase()
    return musicList
      .filter(m => m.name?.toLowerCase().includes(query) || m.artist?.toLowerCase().includes(query))
      .slice(0, 10)
  }, [musicList, musicQuery])

  const saveDraft = () => {
    const draft = { postText, links, privacy, selectedCommunity }
    localStorage.setItem('post_draft', JSON.stringify(draft))
    alert(t('Draft saved locally!'))
  }

  return (
    <main className="min-h-screen w-full bg-[#fafafa] dark:bg-[#050505] flex items-center justify-center p-4 md:p-8 transition-colors duration-500">
      {/* Background Decor */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none opacity-40">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left Side: Settings */}
        <motion.aside
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-4 hidden lg:block"
        >
          <div className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] border border-gray-200/50 dark:border-white/5 p-6 shadow-xl space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <HiSparkles size={14} /> {t("Publisher Settings")}
            </h3>

            <ControlGroup label={t("Visibility")}>
              <PostPrivacySelector defaultValue={privacy} onChange={setPrivacy} />
            </ControlGroup>

            <ControlGroup label={t("Channel")}>
              <div className="relative group">
                <HiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={14} />
                <select
                  value={selectedCommunity}
                  onChange={(e) => setSelectedCommunity(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-transparent border-none text-[12px] font-bold text-gray-700 dark:text-gray-300 outline-none appearance-none cursor-pointer"
                >
                  <option value="">{t("Global Feed")}</option>
                  {communities?.filter(com => com.members.some(m => m._id === selectedUser?._id)).map(com => (
                    <option key={com._id} value={com._id}>{com.Name}</option>
                  ))}
                </select>
              </div>
            </ControlGroup>

            <div className="pt-2 space-y-3">
              <button
                onClick={saveDraft}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400"
              >
                <HiInboxArrowDown size={14} /> {t("Save Draft")}
              </button>
              <button
                onClick={handlePost}
                disabled={!canPost}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-2xl shadow-lg shadow-indigo-500/20 transition-all text-xs font-black uppercase tracking-widest"
              >
                {loading ? t("Posting...") : t("Publish")}
                <HiChevronRight size={14} />
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Main Editor */}
        <section className="lg:col-span-6 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] border border-gray-200/50 dark:border-white/5 shadow-2xl overflow-hidden"
          >
            {/* Context Header */}
            <div className="px-8 pt-8 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-2xl overflow-hidden ring-2 ring-indigo-500/10 shadow-lg">
                  <Image src={selectedUser?.profilePhoto?.url || '/default-avatar.png'} alt="User" fill className="object-cover" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 truncate max-w-[100px]">
                      {selectedUser?.username || 'User'}
                    </span>
                  </div>
                  <h2 className="text-base font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">{t("New Broadcast")}</h2>
                </div>
              </div>

              <div className="flex bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl border border-gray-200/50 dark:border-white/10">
                {['edit', 'preview'].map(mode => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === mode ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                  >
                    {t(mode)}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Area */}
            <div className="p-8">
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={postText}
                  onChange={handleTextareaChange}
                  rows={6}
                  placeholder={t("What's the message for today?")}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={`w-full text-xl md:text-2xl font-bold leading-relaxed bg-transparent focus:outline-none resize-none transition-all placeholder:text-gray-300 dark:placeholder:text-gray-800 ${errorText ? 'text-rose-500' : 'text-gray-900 dark:text-white/90'}`}
                />

                {/* Mention Box placeholder for positioning - we'll handle this purely via the absolute position passed from container */}
                <AnimatePresence>
                  {showMentionBox && filteredUsers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      style={{
                        top: (mentionBoxPos.top || 0) + 30,
                        left: (mentionBoxPos.left || 0)
                      }}
                      className="absolute z-50 w-64 bg-white dark:bg-[#121212] backdrop-blur-3xl rounded-3xl border border-gray-200 dark:border-white/10 shadow-2xl overflow-hidden"
                    >
                      {filteredUsers.map(u => (
                        <button key={u._id} onClick={() => handleSelectMention(u)} className="w-full flex items-center gap-3 p-3 hover:bg-indigo-600 transition-colors group">
                          <div className="w-8 h-8 rounded-full overflow-hidden border border-gray-100 dark:border-gray-800">
                            <Image src={u.profilePhoto?.url || '/default-avatar.png'} alt="U" width={32} height={32} />
                          </div>
                          <div className="text-left">
                            <p className="text-[11px] font-black text-gray-900 dark:text-white group-hover:text-white">@{u.username}</p>
                            <p className="text-[9px] text-gray-500 dark:text-gray-400 group-hover:text-indigo-100">{u.profileName}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Links */}
              <div className="flex flex-wrap gap-2 mt-4">
                <AnimatePresence>
                  {links?.map((link, idx) => (
                    <motion.div
                      key={link}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center gap-2 bg-gray-100 dark:bg-white/5 px-3 py-1.5 rounded-xl border border-gray-200/50 dark:border-white/10"
                    >
                      <HiLink size={12} className="text-indigo-500" />
                      <span className="text-[10px] font-bold text-gray-600 dark:text-gray-400 max-w-[120px] truncate">{link}</span>
                      <button onClick={() => handleRemoveLink(idx)} className="text-gray-400 hover:text-rose-500 transition-colors">
                        <HiXMark size={14} />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Media Grid */}
              {media.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
                  <AnimatePresence>
                    {media.map((item, idx) => (
                      <MediaItem key={item.url} item={item} onRemove={() => removeMedia(idx)} />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Bottom Toolbar */}
            <div className="px-8 py-5 bg-gray-50/30 dark:bg-white/[0.01] border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="w-11 h-11 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-gray-500 hover:text-indigo-500 hover:shadow-md transition-all cursor-pointer">
                  <HiPhoto size={20} />
                  <input type="file" multiple accept="image/*, video/*" onChange={handleMediaChange} className="hidden" />
                </label>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`w-11 h-11 flex items-center justify-center rounded-2xl border transition-all ${showEmojiPicker ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-white/5 border-gray-200/50 dark:border-white/10 text-gray-500 hover:text-amber-500 hover:shadow-md'}`}
                >
                  <HiFaceSmile size={20} />
                </button>
                <button
                  onClick={() => setShowMusicPicker(!showMusicPicker)}
                  className={`w-11 h-11 flex items-center justify-center rounded-2xl border transition-all ${selectedMusic ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white dark:bg-white/5 border-gray-200/50 dark:border-white/10 text-gray-500 hover:text-purple-500 hover:shadow-md'}`}
                >
                  <HiMusicalNote size={20} />
                </button>
                <div className="h-6 w-px bg-gray-200 dark:bg-white/10 mx-1" />
                <div className="relative group flex items-center">
                  <HiLink size={16} className="absolute left-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder={t("Link...")}
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                    className="pl-9 pr-8 py-2.5 bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 w-32 md:w-48 transition-all"
                  />
                  {linkInput && (
                    <button onClick={handleAddLink} className="absolute right-2 text-indigo-500 hover:scale-110"><HiChevronRight size={16} /></button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative w-8 h-8 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="16" cy="16" r="14" fill="transparent" stroke="currentColor" strokeWidth="2" className="text-gray-100 dark:text-gray-800" />
                    <circle cx="16" cy="16" r="14" fill="transparent" stroke="currentColor" strokeWidth="2" strokeDasharray={88} strokeDashoffset={88 - (Math.min(charCount, 500) / 500) * 88} className={charCount > 450 ? 'text-rose-500' : 'text-indigo-500 transition-all duration-300'} />
                  </svg>
                  <span className={`absolute text-[8px] font-black ${charCount > 450 ? 'text-rose-500' : 'text-gray-400'}`}>{charCount}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scheduling Transmission */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 dark:bg-white/[0.02] backdrop-blur-xl rounded-[2rem] border border-gray-200/50 dark:border-white/5 p-5 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3.5 rounded-2xl ${scheduleEnabled ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-gray-100 dark:bg-white/5 text-gray-500'} transition-all`}>
                <HiClock size={18} />
              </div>
              <div>
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white leading-tight">{t("Schedule Publication")}</h4>
                <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{scheduleEnabled ? t("Post scheduled for later") : t("Set time for auto-broadcast")}</p>
              </div>
            </div>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => {
                setScheduleDate(e.target.value)
                setScheduleEnabled(!!e.target.value)
              }}
              className="bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 px-5 py-3 rounded-2xl text-[11px] font-bold text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all w-full md:w-auto"
            />
          </motion.div>
        </section>

        {/* Right Side: Quick Info */}
        <motion.aside
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-4 hidden lg:block"
        >
          <div className="bg-white/70 dark:bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] border border-gray-200/50 dark:border-white/5 p-6 shadow-xl space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
              <HiEye size={14} /> {t("Information")}
            </h3>

            <div className="space-y-4">
              <div className="p-4 rounded-[1.5rem] bg-indigo-500/5 border border-indigo-500/10 group transition-all hover:bg-indigo-500/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-indigo-500 mb-1">{t("Formatting")}</p>
                <p className="text-[11px] font-bold text-indigo-900 dark:text-indigo-100 leading-relaxed">
                  {t("Use @mentions to tag friends and #hashtags to trend.")}
                </p>
              </div>

              <div className="p-4 rounded-[1.5rem] bg-amber-500/5 border border-amber-500/10 group transition-all hover:bg-amber-500/10">
                <p className="text-[9px] font-black uppercase tracking-widest text-amber-500 mb-1">{t("Character Limit")}</p>
                <p className="text-[11px] font-bold text-amber-900 dark:text-amber-100 leading-relaxed">
                  {t("Maintain clear and concise communication within 500 characters.")}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">
                <span>{t("Network Status")}</span>
                <span className="text-green-500 animate-pulse">{t("Live")}</span>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>

      {/* Modals: Music & Emoji */}
      <AnimatePresence>
        {(showMusicPicker || showEmojiPicker) && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => { setShowMusicPicker(false); setShowEmojiPicker(false); }}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />

            {showMusicPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 w-full max-w-md bg-white dark:bg-[#0f0f0f] shadow-2xl rounded-[2.5rem] border border-white/10 p-6"
              >
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-sm font-black dark:text-white uppercase tracking-widest">{t("Select Soundtrack")}</h3>
                  <button onClick={() => setShowMusicPicker(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                    <HiXMark size={20} />
                  </button>
                </div>
                <input
                  type="text"
                  placeholder={t("Search music...")}
                  value={musicQuery}
                  onChange={(e) => setMusicQuery(e.target.value)}
                  className="w-full px-6 py-3.5 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-xs font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 mb-4"
                />
                <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar pr-1">
                  {isMusicLoading ? (
                    <div className="py-10 text-center text-[10px] font-black uppercase text-gray-400 animate-pulse">{t("Syncing...")}</div>
                  ) : filteredMusic.length > 0 ? (
                    filteredMusic.map(m => (
                      <button
                        key={m._id}
                        onClick={() => { setSelectedMusic(m); setShowMusicPicker(false); }}
                        className={`w-full flex items-center gap-4 p-3.5 rounded-2xl transition-all border ${selectedMusic?._id === m._id ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-transparent border-transparent hover:bg-gray-50 dark:hover:bg-white/5'}`}
                      >
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${selectedMusic?._id === m._id ? 'bg-white/20' : 'bg-indigo-500/10 text-indigo-500'}`}>
                          <HiMusicalNote size={18} />
                        </div>
                        <div className="text-left">
                          <p className="text-xs font-black truncate max-w-[200px]">{m.name}</p>
                          <p className={`text-[9px] uppercase font-bold tracking-widest ${selectedMusic?._id === m._id ? 'text-indigo-100' : 'text-gray-500'}`}>{m.artist}</p>
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="py-10 text-center text-[10px] uppercase text-gray-500 font-bold">{t("No matches found")}</div>
                  )}
                </div>
                {selectedMusic && (
                  <button onClick={() => setSelectedMusic(null)} className="mt-4 w-full py-3 text-rose-500 text-[10px] font-black uppercase tracking-widest hover:bg-rose-500/10 rounded-xl">
                    {t("Remove Media")}
                  </button>
                )}
              </motion.div>
            )}

            {showEmojiPicker && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative z-10 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl"
              >
                <EmojiPicker onEmojiClick={handleEmojiClick} theme="dark" width={320} height={400} lazyLoadEmojis skinTonesDisabled />
              </motion.div>
            )}
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Fab */}
      <div className="lg:hidden fixed bottom-6 right-6 z-[100]">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={handlePost}
          disabled={!canPost}
          className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/50 disabled:opacity-50 active:bg-indigo-700 transition-all"
        >
          {loading ? <HiClock size={24} className="animate-spin" /> : <HiChevronRight size={24} />}
        </motion.button>
      </div>
    </main>
  )
}

export default memo(NewPostPresenter)
