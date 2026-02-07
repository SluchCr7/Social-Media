'use client'
import React, { useMemo, useState, memo } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion'
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
  HiMusicalNote,
  HiChevronDown
} from 'react-icons/hi2'
import EmojiPicker from 'emoji-picker-react'
import PostPrivacySelector from '@/app/Component/Post/PostPrivacyAdd'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'

dayjs.extend(localizedFormat)

// --- Performance-optimized Sub-components ---

const ControlGroup = memo(({ label, children, className = "" }) => (
  <div className={`space-y-2.5 ${className}`}>
    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-1">
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
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        type="button"
        onClick={onRemove}
        className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-lg"
      >
        <HiTrash size={18} />
      </motion.button>
    </div>
  </motion.div>
))
MediaItem.displayName = 'MediaItem'

const MentionsList = memo(({ users, onSelect, pos, activeIndex, isSearching }) => (
  <AnimatePresence mode="wait">
    {(users.length > 0 || isSearching) && (
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{
          top: (pos.top || 0) + 40,
          left: (pos.left || 0)
        }}
        className="absolute z-[1000] w-72 bg-white/95 dark:bg-[#0D1117]/95 backdrop-blur-3xl rounded-[2rem] border border-gray-200/50 dark:border-white/10 shadow-2xl overflow-hidden p-2"
      >
        <div className="max-h-60 overflow-y-auto aside_scroll p-1">
          {isSearching ? (
            <div className="p-8 flex flex-col items-center justify-center gap-3">
              <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Searching...</span>
            </div>
          ) : users.length > 0 ? (
            users.map((u, idx) => (
              <motion.button
                key={u._id}
                type="button"
                onClick={() => onSelect(u)}
                className={`w-full flex items-center gap-3 p-2.5 rounded-2xl transition-all duration-300 group ${activeIndex === idx
                    ? 'bg-indigo-600 shadow-lg shadow-indigo-600/20 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-white/5 text-gray-900 dark:text-gray-100'
                  }`}
              >
                <div className="relative w-9 h-9 rounded-xl overflow-hidden">
                  <Image src={u.profilePhoto?.url || '/default-avatar.png'} alt={u.username} fill className="object-cover" />
                </div>
                <div className="text-left flex-1 min-w-0">
                  <p className="text-[13px] font-black truncate leading-tight">@{u.username}</p>
                  <p className={`text-[10px] truncate opacity-60 ${activeIndex === idx ? 'text-white' : 'text-gray-500'}`}>
                    {u.profileName}
                  </p>
                </div>
                {u.isVerify && <HiCheckBadge className={activeIndex === idx ? 'text-white' : 'text-indigo-500'} size={14} />}
              </motion.button>
            ))
          ) : null}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
))
MentionsList.displayName = 'MentionsList'

const LivePreview = memo(({ selectedUser, privacy, postText, isRTL, selectedMusic, media, t }) => {
  const highlightText = (text) => {
    if (!text) return text;
    return text.split(/(\s+)/).map((part, i) => {
      if (part.startsWith('#')) return <span key={i} className="text-indigo-500 font-bold">{part}</span>;
      if (part.startsWith('@')) return <span key={i} className="text-indigo-500 font-bold">{part}</span>;
      return part;
    });
  };

  return (
    <div className="bg-white dark:bg-white/5 rounded-3xl p-5 border border-gray-100 dark:border-white/5 shadow-inner">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-indigo-500/10">
          <Image src={selectedUser?.profilePhoto?.url || '/default-avatar.png'} alt="P" width={40} height={40} className="object-cover" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[12px] font-black text-gray-900 dark:text-white truncate">@{selectedUser?.username || 'user'}</p>
            <HiCheckBadge className="text-indigo-500 shrink-0" size={12} />
          </div>
          <p className="text-[8px] text-gray-400 uppercase font-black tracking-widest">{privacy}</p>
        </div>
      </div>

      <div className={`text-[14px] leading-relaxed text-gray-800 dark:text-gray-200 break-words whitespace-pre-wrap ${isRTL ? 'text-right font-arabic' : 'text-left font-medium'}`}>
        {postText ? highlightText(postText) : <span className="text-gray-400 dark:text-gray-600 italic font-normal tracking-wide">{t("Your message will appear here...")}</span>}
      </div>

      {selectedMusic && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-4 p-3 bg-gradient-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 rounded-2xl flex items-center gap-3"
        >
          <div className="w-9 h-9 bg-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <HiMusicalNote size={18} className="animate-pulse" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black text-gray-900 dark:text-white truncate">{selectedMusic.name}</p>
            <p className="text-[9px] text-purple-500/70 font-black tracking-widest uppercase truncate">{selectedMusic.artist || t("Unknown Artist")}</p>
          </div>
        </motion.div>
      )}

      {media.length > 0 && (
        <div className={`mt-4 grid gap-2 ${media.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
          {media.slice(0, 4).map((item, i) => (
            <div key={i} className={`relative rounded-2xl overflow-hidden bg-black shadow-lg ${media.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
              {item.type === 'video' ? (
                <video src={item.url} className="w-full h-full object-cover" muted />
              ) : (
                <Image src={item.url} alt="i" fill className="object-cover" />
              )}
              {i === 3 && media.length > 4 && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center text-xs text-white font-black">+{media.length - 4}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
})
LivePreview.displayName = 'LivePreview'

const NewPostPresenter = (props) => {
  const {
    postText, handleTextareaChange, handlePost, handleSaveDraft, loading, errorText,
    showEmojiPicker, setShowEmojiPicker, handleEmojiClick,
    media = [], handleMediaChange, removeMedia,
    links = [], linkInput, setLinkInput, handleAddLink, handleRemoveLink,
    scheduleEnabled, setScheduleEnabled, scheduleDate, setScheduleDate,
    selectedUser, privacy, setPrivacy, communities = [], selectedCommunity, setSelectedCommunity,
    filteredUsers = [], handleSelectMention, showMentionBox, activeMentionIndex, mentionBoxPos = {}, textareaRef,
    handleKeyDown, selectedMusic, setSelectedMusic, musicList = [], isMusicLoading, isSearchingUsers
  } = props

  const { t } = useTranslation()
  const [viewMode, setViewMode] = useState('edit')
  const [showMusicPicker, setShowMusicPicker] = useState(false)
  const [musicQuery, setMusicQuery] = useState('')

  const charCount = postText?.length || 0
  const isRTL = useMemo(() => /[\u0600-\u06FF]/.test(postText || ''), [postText])
  const canPost = (postText?.trim() || media.length > 0) && !loading && !errorText

  const filteredMusic = useMemo(() => {
    if (!musicList) return [];
    if (!musicQuery) return musicList.slice(0, 10);
    return musicList.filter(m =>
      m.name?.toLowerCase().includes(musicQuery.toLowerCase()) ||
      m.artist?.toLowerCase().includes(musicQuery.toLowerCase())
    ).slice(0, 10);
  }, [musicList, musicQuery]);

  return (
    <main className="min-h-screen w-full bg-[#fafafa] dark:bg-[#080808] flex items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 selection:bg-indigo-500/30 overflow-x-hidden">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-50 dark:opacity-20 transition-opacity duration-1000">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">

          {/* Left Panel: Desktop Visibility & Channel */}
          <motion.aside
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6 hidden lg:block"
          >
            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-7 shadow-xl">
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 mb-8 px-1 flex items-center gap-2">
                <HiSparkles className="text-indigo-500" /> {t("Configuration")}
              </h3>

              <div className="space-y-8">
                <ControlGroup label={t("Visibility")}>
                  <PostPrivacySelector defaultValue={privacy} onChange={(v) => setPrivacy(v)} />
                </ControlGroup>

                <ControlGroup label={t("Transmission Channel")}>
                  <div className="relative group">
                    <HiUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-indigo-500 transition-colors" size={16} />
                    <select
                      value={selectedCommunity}
                      onChange={(e) => setSelectedCommunity(e.target.value)}
                      className="w-full pl-11 pr-10 py-3 bg-transparent border-none text-[13px] font-bold text-gray-700 dark:text-gray-300 outline-none appearance-none cursor-pointer"
                    >
                      <option value="">{t("Global Network")}</option>
                      {communities?.filter(com => com.members.some(m => m._id === selectedUser?._id)).map(com => (
                        <option key={com._id} value={com._id}>{com.Name}</option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                  </div>
                </ControlGroup>

                <div className="pt-6 space-y-3">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handleSaveDraft}
                    className="w-full flex items-center justify-center gap-3 py-3.5 bg-white dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl text-[11px] font-black uppercase tracking-widest text-gray-500 hover:text-indigo-600 transition-all shadow-sm"
                  >
                    <HiInboxArrowDown size={16} /> {t("Drafts")}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={handlePost}
                    disabled={!canPost}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-[1.5rem] shadow-xl shadow-indigo-600/20 transition-all text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        {t("Broadcast")} <HiChevronRight size={16} />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.aside>

          {/* Main Input Area */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-6 space-y-6"
          >
            <div className="bg-white dark:bg-[#0D1117] rounded-[2.5rem] sm:rounded-[3.5rem] border border-gray-100 dark:border-white/5 shadow-2xl shadow-black/5 overflow-hidden">
              {/* Mobile Adaptive Header */}
              <div className="lg:hidden p-5 sm:p-7 border-b border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02] flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-indigo-500/10">
                    <Image src={selectedUser?.profilePhoto?.url || '/default-avatar.png'} alt="U" width={40} height={40} className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-[11px] text-gray-900 dark:text-white uppercase tracking-wider">{t("New Transmission")}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">@{selectedUser?.username}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PostPrivacySelector defaultValue={privacy} onChange={(v) => setPrivacy(v)} />
                  <div className="relative group">
                    <select
                      value={selectedCommunity}
                      onChange={(e) => setSelectedCommunity(e.target.value)}
                      className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider text-gray-700 dark:text-gray-300 outline-none appearance-none pr-8"
                    >
                      <option value="">{t("Network")}</option>
                      {communities?.filter(com => com.members.some(m => m._id === selectedUser?._id)).map(com => (
                        <option key={com._id} value={com._id}>{com.Name}</option>
                      ))}
                    </select>
                    <HiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={10} />
                  </div>
                </div>
              </div>

              {/* Toolbar Toggle (Desktop) */}
              <div className="px-8 pt-10 hidden lg:flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative w-14 h-14 rounded-2xl overflow-hidden ring-4 ring-gray-50 dark:ring-white/5 shadow-lg">
                    <Image src={selectedUser?.profilePhoto?.url || '/default-avatar.png'} alt="P" fill className="object-cover" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-1">{t("Studio Broadcast")}</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">{t("Share your signal with the network")}</p>
                  </div>
                </div>
                <div className="flex bg-gray-100/50 dark:bg-white/[0.03] p-1.5 rounded-2xl border border-gray-200/50 dark:border-white/5">
                  {['edit', 'preview'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setViewMode(m)}
                      className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-[0.15em] rounded-xl transition-all ${viewMode === m
                          ? 'bg-white dark:bg-white/10 text-indigo-600 dark:text-indigo-400 shadow-md ring-1 ring-black/5'
                          : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
                        }`}
                    >
                      {t(m)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Workspace */}
              <div className="p-6 sm:p-10">
                <AnimatePresence mode="wait">
                  {viewMode === 'edit' ? (
                    <motion.div
                      key="edit"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative min-h-[300px]"
                    >
                      <textarea
                        ref={textareaRef}
                        value={postText}
                        onChange={handleTextareaChange}
                        onKeyDown={handleKeyDown}
                        placeholder={t("What's on your mind? Broadcast it to the world...")}
                        dir={isRTL ? 'rtl' : 'ltr'}
                        className={`w-full text-xl sm:text-2xl lg:text-3xl font-semibold leading-[1.6] bg-transparent focus:outline-none resize-none transition-all duration-500 placeholder:text-gray-200 dark:placeholder:text-gray-800 scrollbar-hide min-h-[250px] ${errorText ? 'text-rose-500' : 'text-gray-900 dark:text-white/90'
                          }`}
                      />

                      <MentionsList
                        users={filteredUsers}
                        onSelect={handleSelectMention}
                        pos={mentionBoxPos}
                        activeIndex={activeMentionIndex}
                        isSearching={isSearchingUsers}
                      />

                      <LayoutGroup>
                        <div className="flex flex-wrap gap-2 mt-6">
                          <AnimatePresence>
                            {links.map((link, idx) => (
                              <motion.div
                                layout
                                key={link}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                className="flex items-center gap-2.5 bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl border border-indigo-100 dark:border-indigo-500/20"
                              >
                                <HiLink size={14} className="text-indigo-500" />
                                <span className="text-[11px] font-bold text-indigo-700 dark:text-indigo-300 max-w-[120px] sm:max-w-xs truncate">{link}</span>
                                <button type="button" onClick={() => handleRemoveLink(idx)} className="text-gray-300 hover:text-rose-500 transition-colors">
                                  <HiXMark size={16} />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>

                        {media.length > 0 && (
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                            <AnimatePresence>
                              {media.map((item, idx) => (
                                <MediaItem key={item.url} item={item} onRemove={() => removeMedia(idx)} />
                              ))}
                            </AnimatePresence>
                          </div>
                        )}
                      </LayoutGroup>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="preview"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="py-4"
                    >
                      <LivePreview
                        selectedUser={selectedUser}
                        privacy={privacy}
                        postText={postText}
                        isRTL={isRTL}
                        selectedMusic={selectedMusic}
                        media={media}
                        t={t}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Advanced Utilities Bottom */}
              <div className="px-5 sm:px-10 py-6 sm:py-8 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 w-full sm:w-auto">
                  <label className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-400 hover:text-indigo-600 hover:border-indigo-500/30 transition-all cursor-pointer shadow-sm group">
                    <HiPhoto size={22} className="group-hover:scale-110 transition-transform" />
                    <input type="file" multiple accept="image/*, video/*" onChange={handleMediaChange} className="hidden" />
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all shadow-sm ${showEmojiPicker ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:text-amber-500'
                      }`}
                  >
                    <HiFaceSmile size={22} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowMusicPicker(!showMusicPicker)}
                    className={`w-12 h-12 flex items-center justify-center rounded-2xl border transition-all shadow-sm ${selectedMusic ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-400 hover:text-purple-500'
                      }`}
                  >
                    <HiMusicalNote size={22} />
                  </button>

                  <div className="h-10 w-px bg-gray-200 dark:bg-white/10 mx-2 hidden sm:block" />

                  <div className="relative flex-1 sm:flex-none">
                    <HiLink size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder={t("Paste URL...")}
                      value={linkInput}
                      onChange={(e) => setLinkInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddLink()}
                      className="pl-11 pr-10 py-3 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-[12px] font-bold outline-none ring-offset-2 focus:ring-2 focus:ring-indigo-500/20 w-full sm:w-56 transition-all"
                    />
                    {linkInput && (
                      <button type="button" onClick={handleAddLink} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-500 hover:scale-110 transition-transform">
                        <HiChevronRight size={18} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="shrink-0">
                  <div className="relative flex items-center justify-center w-12 h-12">
                    <svg className="w-full h-full -rotate-90">
                      <circle cx="24" cy="24" r="20" fill="transparent" stroke="currentColor" strokeWidth="3" className="text-gray-100 dark:text-gray-800" />
                      <circle
                        cx="24" cy="24" r="20"
                        fill="transparent"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={125.6}
                        strokeDashoffset={125.6 - (Math.min(charCount, 500) / 500) * 125.6}
                        className={`transition-all duration-500 ${charCount > 450 ? 'text-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.3)]' : 'text-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.3)]'}`}
                      />
                    </svg>
                    <span className={`absolute text-[10px] font-black ${charCount > 450 ? 'text-rose-500' : 'text-gray-500'}`}>{charCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sub-Scheduling Layer */}
            <motion.div
              layout
              className="bg-white/60 dark:bg-white/[0.03] backdrop-blur-3xl rounded-[2rem] border border-gray-100 dark:border-white/5 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 overflow-hidden mt-6"
            >
              <div className="flex items-center gap-5">
                <div className={`p-4 rounded-2xl shadow-lg transition-all ${scheduleEnabled ? 'bg-indigo-600 text-white shadow-indigo-600/20' : 'bg-white dark:bg-white/5 text-gray-400'
                  }`}>
                  <HiClock size={24} />
                </div>
                <div>
                  <h4 className="text-[12px] font-black uppercase tracking-widest text-gray-900 dark:text-white leading-none mb-2">{t("Scheduled Broadcast")}</h4>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{scheduleEnabled ? dayjs(scheduleDate).format('LLL') : t("Stream your post at a specific frequency")}</p>
                </div>
              </div>
              <input
                type="datetime-local"
                value={scheduleDate}
                onChange={(e) => {
                  setScheduleDate(e.target.value)
                  setScheduleEnabled(!!e.target.value)
                }}
                className="w-full sm:w-auto bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6 py-4 rounded-2xl text-xs font-bold text-gray-700 dark:text-white focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all"
              />
            </motion.div>
          </motion.section>

          {/* Right Panel: Analytics & Preview Desktop */}
          <motion.aside
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6 hidden lg:block"
          >
            <div className="bg-white/80 dark:bg-white/[0.03] backdrop-blur-3xl rounded-[2.5rem] border border-gray-200 dark:border-white/5 p-7 shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400 dark:text-gray-500 mb-8 px-1 flex items-center gap-2">
                <HiEye className="text-indigo-500" /> {t("Live Feed Capture")}
              </h3>

              <div className="bg-gray-50/50 dark:bg-white/[0.03] rounded-3xl p-4 border border-gray-100 dark:border-white/5 relative mb-8">
                <LivePreview
                  selectedUser={selectedUser}
                  privacy={privacy}
                  postText={postText}
                  isRTL={isRTL}
                  selectedMusic={selectedMusic}
                  media={media}
                  t={t}
                />
                <div className="mt-4 flex items-center justify-between text-[9px] font-black text-gray-400 uppercase tracking-widest px-2">
                  <span>{t("Signal Strength")}</span>
                  <span className="text-green-500 flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> 100%</span>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  { icon: HiSparkles, label: t("Engagement Potential"), value: "High-Sync", color: "indigo" },
                  { icon: HiCheckBadge, label: t("Integrity Rating"), value: "Verified Broadcast", color: "emerald" }
                ].map((stat, i) => (
                  <div key={i} className={`bg-white dark:bg-white/5 rounded-3xl p-5 flex items-center gap-4 border border-gray-50 dark:border-white/5 group hover:border-${stat.color}-500/30 transition-all`}>
                    <div className={`w-11 h-11 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                      <stat.icon size={20} />
                    </div>
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[0.15em] text-gray-500">{stat.label}</p>
                      <p className="text-[11px] font-bold text-gray-900 dark:text-white">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.aside>

        </div>
      </div>

      {/* Music Selector Portal */}
      <AnimatePresence>
        {showMusicPicker && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowMusicPicker(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 30 }}
              className="relative z-10 w-full max-w-lg bg-white dark:bg-[#0D1117] shadow-[0_30px_100px_rgba(0,0,0,0.5)] rounded-[3rem] overflow-hidden border border-white/10 p-8 sm:p-10"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/10 text-purple-600 rounded-2xl flex items-center justify-center">
                    <HiMusicalNote size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black dark:text-white tracking-tight">{t("Audio Library")}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">{t("Search the frequency")}</p>
                  </div>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  type="button"
                  onClick={() => setShowMusicPicker(false)}
                  className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-gray-500 hover:text-rose-500 transition-colors"
                >
                  <HiXMark size={24} />
                </motion.button>
              </div>

              <div className="relative mb-8 group">
                <input
                  type="text"
                  placeholder={t("Search by title, artist or mood...")}
                  value={musicQuery}
                  onChange={(e) => setMusicQuery(e.target.value)}
                  className="w-full pl-7 pr-7 py-5 bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/10 rounded-3xl text-sm font-black outline-none focus:ring-4 focus:ring-purple-500/10 transition-all placeholder:text-gray-400 leading-none"
                />
              </div>

              <div className="space-y-2.5 max-h-[400px] overflow-y-auto aside_scroll pr-3">
                {isMusicLoading ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-purple-500/20 border-t-purple-600 rounded-full animate-spin" />
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">{t("Calibrating Audio...")}</span>
                  </div>
                ) : filteredMusic.length > 0 ? (
                  filteredMusic.map((m) => (
                    <motion.button
                      layout
                      key={m._id}
                      type="button"
                      onClick={() => {
                        setSelectedMusic(m);
                        setShowMusicPicker(false);
                      }}
                      className={`w-full flex items-center gap-5 p-5 rounded-3xl transition-all border ${selectedMusic?._id === m._id
                          ? 'bg-purple-600 border-purple-600 text-white shadow-xl shadow-purple-600/20'
                          : 'bg-white dark:bg-white/5 border-gray-50 dark:border-white/5 hover:border-purple-500/30'
                        }`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${selectedMusic?._id === m._id ? 'bg-white/20' : 'bg-purple-500/10 text-purple-600'
                        }`}>
                        <HiMusicalNote size={22} />
                      </div>
                      <div className="text-left min-w-0 flex-1">
                        <p className="text-sm font-black truncate mb-1">{m.name}</p>
                        <p className={`text-[10px] uppercase font-black tracking-widest ${selectedMusic?._id === m._id ? 'text-purple-100' : 'text-gray-500'}`}>{m.artist || t("Frequency Node")}</p>
                      </div>
                      {selectedMusic?._id === m._id && <HiCheckBadge size={20} className="text-white" />}
                    </motion.button>
                  ))
                ) : (
                  <div className="py-20 text-center text-gray-400 text-[10px] font-black uppercase tracking-[0.3em]">{t("No Frequencies Detected")}</div>
                )}
              </div>

              {selectedMusic && (
                <button
                  type="button"
                  onClick={() => setSelectedMusic(null)}
                  className="mt-8 w-full py-5 bg-rose-500/5 text-rose-500 text-[11px] font-black uppercase tracking-[0.25em] hover:bg-rose-500 hover:text-white rounded-[1.75rem] transition-all border border-rose-500/10"
                >
                  {t("De-link Soundtrack")}
                </button>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Mobile Control Fab */}
      <div className="lg:hidden fixed bottom-6 sm:bottom-10 right-6 sm:right-10 z-[100]">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          type="button"
          onClick={handlePost}
          disabled={!canPost}
          className="w-16 h-16 sm:w-20 sm:h-20 rounded-[1.75rem] bg-indigo-600 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/40 disabled:opacity-50 relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
          {loading ? (
            <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <HiChevronRight size={32} />
          )}
        </motion.button>
      </div>

      {/* Emoji Portal */}
      <AnimatePresence>
        {showEmojiPicker && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowEmojiPicker(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative z-10 shadow-2xl rounded-[3rem] overflow-hidden border border-white/20"
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="auto"
                width={350}
                height={450}
                lazyLoadEmojis={true}
                skinTonesDisabled
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default memo(NewPostPresenter)
