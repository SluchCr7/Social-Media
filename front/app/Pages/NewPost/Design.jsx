'use client'
import React, { useMemo, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  HiXMark,
  HiOutlineCalendarDays,
  HiPhoto,
  HiPlus,
  HiFaceSmile,
  HiUsers,
  HiLink,
  HiChevronRight,
  HiCheckBadge,
  HiSparkles,
  HiEye,
  HiTrash,
  HiInboxArrowDown,
  HiClock,
  HiMusicalNote
} from 'react-icons/hi2'
import EmojiPicker from 'emoji-picker-react'
import PostPrivacySelector from '@/app/Component/Post/PostPrivacyAdd'
import { useTranslation } from 'react-i18next'

// --- Performance-optimized Sub-components ---

const ControlGroup = React.memo(({ label, children }) => (
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

const MediaItem = React.memo(({ item, onRemove }) => (
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

const MentionsList = React.memo(({ users, onSelect, pos }) => (
  <AnimatePresence mode="wait">
    {users.length > 0 && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        style={{
          top: (pos.top || 0) + 40,
          left: (pos.left || 0)
        }}
        className="absolute z-[1000] w-72 bg-white/90 dark:bg-[#0D1117]/90 backdrop-blur-2xl rounded-[2rem] border border-gray-200 dark:border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden p-2"
      >
        <div className="max-h-64 overflow-y-auto custom-scrollbar">
          {users.map((u, idx) => (
            <motion.button
              key={u._id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.03 }}
              onClick={() => onSelect(u)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-indigo-600 group transition-all duration-300 mb-1 last:mb-0"
            >
              <div className="relative w-10 h-10 rounded-xl overflow-hidden border-2 border-white dark:border-gray-800 shadow-md transform group-active:scale-90 transition-transform">
                <Image src={u.profilePhoto?.url || '/default-avatar.png'} alt={u.username} fill className="object-cover" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-[12px] font-black text-gray-900 dark:text-white group-hover:text-white truncate">
                  @{u.username}
                </p>
                <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 group-hover:text-indigo-100 truncate">
                  {u.profileName}
                </p>
              </div>
              <HiPlus size={14} className="text-gray-300 dark:text-gray-600 group-hover:text-white" />
            </motion.button>
          ))}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
))
MentionsList.displayName = 'MentionsList'

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

  const charCount = postText ? postText.length : 0
  const isRTL = useMemo(() => /[\u0600-\u06FF]/.test(postText || ''), [postText])
  const canPost = (postText?.trim() || media.length > 0) && !loading && !errorText

  const filteredMusic = useMemo(() => {
    if (!musicQuery) return musicList.slice(0, 10);
    return musicList.filter(m =>
      m.name?.toLowerCase().includes(musicQuery.toLowerCase()) ||
      m.artist?.toLowerCase().includes(musicQuery.toLowerCase())
    ).slice(0, 10);
  }, [musicList, musicQuery]);

  // Draft handling (Local Feature)
  const saveDraft = () => {
    const draft = { postText, links, privacy, selectedCommunity };
    localStorage.setItem('post_draft', JSON.stringify(draft));
    alert('Draft saved locally!');
  }

  return (
    <main className="min-h-screen w-full bg-[#fafafa] dark:bg-[#080808] flex items-center justify-center p-3 sm:p-4 md:p-8 transition-all duration-700 selection:bg-indigo-500/30">
      {/* Animated Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-[140px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -90, 0],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ duration: 15, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-gradient-to-tr from-rose-500/20 to-orange-500/20 blur-[140px] rounded-full"
        />
      </div>

      <div className="w-full max-w-6xl relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

        {/* Left Panel: Controls & Settings */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-6 hidden lg:block"
        >
          <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-gray-200/50 dark:border-white/5 p-6 shadow-2xl">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 px-2 flex items-center gap-2">
              <HiSparkles className="text-indigo-500" /> {t("Publisher Settings")}
            </h3>

            <div className="space-y-6">
              <ControlGroup label={t("Visibility")}>
                <PostPrivacySelector defaultValue={privacy} onChange={(v) => setPrivacy(v)} />
              </ControlGroup>

              <ControlGroup label={t("Channel")}>
                <div className="relative group">
                  <HiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={16} />
                  <select
                    value={selectedCommunity}
                    onChange={(e) => setSelectedCommunity(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 bg-transparent border-none text-[13px] font-bold text-gray-700 dark:text-gray-300 outline-none appearance-none cursor-pointer"
                  >
                    <option value="">{t("Global Feed")}</option>
                    {communities
                      ?.filter((com) => com.members.some((m) => m._id === selectedUser?._id))
                      .map((com) => (
                        <option key={com._id} value={com._id}>{com.Name}</option>
                      ))}
                  </select>
                </div>
              </ControlGroup>

              <div className="pt-4 space-y-3">
                <button
                  onClick={saveDraft}
                  className="w-full flex items-center justify-center gap-3 py-3 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-100 dark:border-white/10 rounded-2xl transition-all text-[11px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-400"
                >
                  <HiInboxArrowDown size={16} />
                  {t("Save as Draft")}
                </button>
                <button
                  onClick={() => handlePost()}
                  disabled={!canPost}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-[1.25rem] shadow-xl shadow-indigo-500/20 transition-all text-[11px] font-black uppercase tracking-[0.2em]"
                >
                  {loading ? t("Syncing...") : t("Publish Now")}
                  <HiChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600/5 dark:bg-indigo-500/5 backdrop-blur-xl rounded-[2rem] border border-indigo-500/10 p-6">
            <p className="text-[10px] leading-relaxed text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-wider">
              {t("Tip: Use @mentions to tag your friends and #hashtags to categorize your broadcast.")}
            </p>
          </div>
        </motion.div>

        {/* Middle Panel: Core Input */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-6 space-y-6"
        >
          <div className="bg-white dark:bg-[#0D1117] rounded-3xl sm:rounded-[3rem] border border-gray-200/50 dark:border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] overflow-hidden">
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="lg:hidden p-6 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-indigo-500/20">
                  <Image src={selectedUser?.profilePhoto?.url || '/default-avatar.png'} alt="P" width={40} height={40} className="object-cover" />
                </div>
                <span className="font-black text-xs text-gray-900 dark:text-white uppercase tracking-wider">{t("New Post")}</span>
              </div>
              <div className="flex gap-2">
                <PostPrivacySelector defaultValue={privacy} onChange={(v) => setPrivacy(v)} />
              </div>
            </div>

            {/* Input Header Area */}
            <div className="px-8 pt-8 flex items-center gap-4">
              <div className="hidden lg:block relative group">
                <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white dark:ring-gray-900 shadow-xl">
                  <Image
                    src={selectedUser?.profilePhoto?.url || '/default-avatar.png'}
                    alt="profile"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 lg:mb-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">
                    {selectedUser?.username || 'Zocial User'}
                  </span>
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                  {t("Spread the Message")}
                </h2>
              </div>

              <div className="flex bg-gray-100 dark:bg-white/5 p-1 rounded-2xl border border-gray-200/50 dark:border-white/10 overflow-hidden">
                <button
                  onClick={() => setViewMode('edit')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'edit' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t("Edit")}
                </button>
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${viewMode === 'preview' ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t("Preview")}
                </button>
              </div>
            </div>

            {/* Editor Content */}
            <div className="p-8">
              <div className="relative group">
                <textarea
                  ref={textareaRef}
                  value={postText}
                  onChange={handleTextareaChange}
                  rows={8}
                  placeholder={t("What's on your mind? Broadcast it to the world...")}
                  dir={isRTL ? 'rtl' : 'ltr'}
                  className={`w-full text-xl md:text-2xl font-semibold leading-relaxed bg-transparent focus:outline-none resize-none transition-all duration-500 placeholder:text-gray-300 dark:placeholder:text-gray-700 ${errorText ? 'text-rose-500' : 'text-gray-900 dark:text-white/90'}`}
                />

                {/* Mention Popover */}
                {showMentionBox && (
                  <MentionsList
                    users={filteredUsers}
                    onSelect={handleSelectMention}
                    pos={mentionBoxPos}
                  />
                )}
              </div>

              {/* Links Display */}
              <AnimatePresence>
                {links?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {links.map((link, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-xl border border-indigo-500/20"
                      >
                        <HiLink size={12} className="text-indigo-500" />
                        <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 max-w-[150px] truncate">{link}</span>
                        <button onClick={() => handleRemoveLink(idx)} className="text-gray-400 hover:text-rose-500 transition-colors">
                          <HiXMark size={14} />
                        </button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </AnimatePresence>

              {/* Images Grid */}
              <AnimatePresence>
                {media.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-6">
                    {media.map((item, idx) => (
                      <MediaItem key={idx} item={item} onRemove={() => removeMedia(idx)} />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Editor Controls Bottom */}
            <div className="px-8 py-6 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/10 text-gray-500 hover:text-indigo-500 hover:bg-white dark:hover:bg-white/10 transition-all cursor-pointer shadow-sm">
                  <HiPhoto size={22} />
                  <input type="file" multiple accept="image/*, video/*" onChange={handleMediaChange} className="hidden" />
                </label>
                <button
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all shadow-sm ${showEmojiPicker ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-white/5 border-gray-200/50 dark:border-white/10 text-gray-500 hover:text-amber-500'}`}
                >
                  <HiFaceSmile size={22} />
                </button>
                <button
                  onClick={() => setShowMusicPicker(!showMusicPicker)}
                  className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all shadow-sm ${selectedMusic ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white dark:bg-white/5 border-gray-200/50 dark:border-white/10 text-gray-500 hover:text-purple-500'}`}
                >
                  <HiMusicalNote size={22} />
                </button>
                <div className="h-8 w-px bg-gray-200 dark:bg-white/10 mx-2" />
                <div className="relative group">
                  <HiLink size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder={t("Paste URL...")}
                    value={linkInput}
                    onChange={(e) => setLinkInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                    className="pl-10 pr-10 py-3 bg-white dark:bg-white/5 border border-gray-200/50 dark:border-white/10 rounded-2xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/20 w-40 md:w-56 transition-all"
                  />
                  {linkInput && (
                    <button onClick={handleAddLink} className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-500 hover:scale-110 transition-transform"><HiChevronRight size={18} /></button>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="relative flex items-center justify-center w-10 h-10">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="2.5" className="text-gray-100 dark:text-gray-800" />
                    <circle cx="20" cy="20" r="16" fill="transparent" stroke="currentColor" strokeWidth="2.5" strokeDasharray={100} strokeDashoffset={100 - (charCount / 500) * 100} className={charCount > 450 ? 'text-rose-500' : 'text-indigo-500 transition-all duration-300'} />
                  </svg>
                  <span className={`absolute text-[8px] font-black ${charCount > 450 ? 'text-rose-500' : 'text-gray-500'}`}>{charCount}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Scheduling Section */}
          <motion.div
            className="bg-white/50 dark:bg-white/[0.02] backdrop-blur-2xl rounded-[2rem] border border-gray-200/50 dark:border-white/5 p-6 flex flex-col md:flex-row items-center justify-between gap-4"
          >
            <div className="flex items-center gap-4">
              <div className={`p-4 rounded-2xl ${scheduleEnabled ? 'bg-indigo-600 text-white' : 'bg-gray-100 dark:bg-white/5 text-gray-500'} transition-all`}>
                <HiClock size={20} />
              </div>
              <div>
                <h4 className="text-[11px] font-black uppercase tracking-widest text-gray-900 dark:text-white">{t("Schedule Transmission")}</h4>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{scheduleEnabled ? t("Post will be broadcasted later") : t("Set a time for your post")}</p>
              </div>
            </div>
            <input
              type="datetime-local"
              value={scheduleDate}
              onChange={(e) => {
                setScheduleDate(e.target.value)
                setScheduleEnabled(!!e.target.value)
              }}
              className="bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 px-6 py-4 rounded-2xl text-xs font-bold text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </motion.div>
        </motion.div>

        {/* Right Panel: Feature-rich Preview */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-3 space-y-6 hidden lg:block"
        >
          <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-gray-200/50 dark:border-white/5 p-6 shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6 px-2 flex items-center gap-2">
              <HiEye className="text-indigo-500" /> {t("Live Transmission Preview")}
            </h3>

            <div className="bg-gray-50 dark:bg-white/5 rounded-3xl p-5 border border-gray-100 dark:border-white/5 relative">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <Image src={selectedUser?.profilePhoto?.url || '/default-avatar.png'} alt="P" width={32} height={32} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-black text-gray-900 dark:text-white truncate">@{selectedUser?.username || 'user'}</p>
                  <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">{privacy}</p>
                </div>
              </div>

              <div className={`text-[12px] leading-relaxed dark:text-gray-300 break-words ${isRTL ? 'text-right' : 'text-left'}`}>
                {postText || <span className="text-gray-400 dark:text-gray-600 italic">{t("Content signal is empty...")}</span>}
              </div>

              {selectedMusic && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-2xl flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-purple-500 text-white rounded-lg flex items-center justify-center shrink-0">
                    <HiMusicalNote size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black dark:text-white truncate">{selectedMusic.name}</p>
                    <p className="text-[8px] text-gray-500 uppercase font-black tracking-widest">{selectedMusic.artist || t("Unknown Artist")}</p>
                  </div>
                </motion.div>
              )}

              {media.length > 0 && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {media.slice(0, 4).map((item, i) => (
                    <div key={i} className="aspect-square relative rounded-xl overflow-hidden shadow-sm bg-black">
                      {item.type === 'video' ? (
                        <video src={item.url} className="w-full h-full object-cover" muted />
                      ) : (
                        <Image src={item.url} alt="i" fill className="object-cover" />
                      )}

                      {i === 3 && media.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-[10px] text-white font-black">+{media.length - 4}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 flex items-center justify-between opacity-50">
                <div className="flex gap-4">
                  <div className="h-2 w-8 bg-gray-200 dark:bg-white/10 rounded-full" />
                  <div className="h-2 w-8 bg-gray-200 dark:bg-white/10 rounded-full" />
                </div>
                <div className="h-4 w-4 bg-gray-200 dark:bg-white/10 rounded-full" />
              </div>
            </div>

            <div className="mt-6 flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">
              <span>{t("Network Latency")}</span>
              <span className="text-green-500">24ms</span>
            </div>
          </div>

          {/* Quick Stats / Info */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-white/5 rounded-3xl p-4 flex items-center gap-4 border border-gray-100 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform">
                <HiSparkles size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("Reach Potential")}</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">~1.2k impressions</p>
              </div>
            </div>
            <div className="bg-white dark:bg-white/5 rounded-3xl p-4 flex items-center gap-4 border border-gray-100 dark:border-white/5 group hover:border-purple-500/30 transition-all">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                <HiCheckBadge size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{t("Trust Score")}</p>
                <p className="text-xs font-bold text-gray-900 dark:text-white">Verified Stream</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Music Picker Modal */}
      <AnimatePresence>
        {showMusicPicker && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMusicPicker(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 w-full max-w-md bg-white dark:bg-[#0D1117] shadow-2xl rounded-[2.5rem] overflow-hidden border border-white/20 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-black dark:text-white">{t("Select Soundtrack")}</h3>
                <button onClick={() => setShowMusicPicker(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition-colors">
                  <HiXMark size={24} />
                </button>
              </div>

              <div className="relative mb-6">
                <input
                  type="text"
                  placeholder={t("Search music or artists...")}
                  value={musicQuery}
                  onChange={(e) => setMusicQuery(e.target.value)}
                  className="w-full pl-6 pr-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                {isMusicLoading ? (
                  <div className="text-center py-8 text-gray-400 text-xs font-bold uppercase tracking-widest">{t("Tuning frequencies...")}</div>
                ) : filteredMusic.length > 0 ? (
                  filteredMusic.map((m) => (
                    <button
                      key={m._id}
                      onClick={() => {
                        setSelectedMusic(m);
                        setShowMusicPicker(false);
                      }}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all border ${selectedMusic?._id === m._id ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-50 dark:bg-white/5 border-transparent hover:border-purple-500/30'}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedMusic?._id === m._id ? 'bg-white/20' : 'bg-purple-500/10 text-purple-500'}`}>
                        <HiMusicalNote size={20} />
                      </div>
                      <div className="text-left min-w-0">
                        <p className="text-xs font-black truncate">{m.name}</p>
                        <p className={`text-[10px] uppercase tracking-widest font-bold ${selectedMusic?._id === m._id ? 'text-purple-100' : 'text-gray-500'}`}>{m.artist || t("Unknown Artist")}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500 text-xs font-bold uppercase tracking-widest">{t("Silence... Try another search")}</div>
                )}
              </div>

              {selectedMusic && (
                <button
                  onClick={() => setSelectedMusic(null)}
                  className="mt-6 w-full py-4 text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-rose-500/10 rounded-2xl transition-all"
                >
                  {t("Remove Soundtrack")}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Emoji Picker Modal */}
      <AnimatePresence>
        {showEmojiPicker && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEmojiPicker(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 shadow-2xl rounded-[2.5rem] overflow-hidden border border-white/20"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="dark"
                width={350}
                height={450}
                lazyLoadEmojis={true}
                skinTonesDisabled
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Fab */}
      <div className="lg:hidden fixed bottom-8 right-8 z-50">
        <button
          onClick={() => handlePost()}
          disabled={!canPost}
          className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-500/40 disabled:opacity-50 active:scale-95 transition-all"
        >
          {loading ? <HiClock size={24} className="animate-spin" /> : <HiChevronRight size={28} />}
        </button>
      </div>
    </main>
  )
}

export default React.memo(NewPostPresenter)

