'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HiXMark,
  HiHeart,
  HiShare,
  HiPlay,
  HiPause,
  HiTrash,
  HiEllipsisVertical,
  HiEye,
  HiChevronLeft,
  HiChevronRight,
  HiPaperAirplane
} from 'react-icons/hi2';
import Image from 'next/image';
import Link from 'next/link';
import { useSwipeable } from 'react-swipeable';
import { useStory } from '../Context/StoryContext';
import { useAuth } from '../Context/AuthContext';
import { useMessage } from '../Context/MessageContext';
import { useAlert } from '../Context/AlertContext';
import { useTranslation } from 'react-i18next';
import { useTranslate } from '../Context/TranslateContext';
import { formatRelativeTime } from '../utils/FormatDataCreatedAt';

const StoryViewer = ({ stories = [], onClose = () => { }, initialFit = 'contain' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const [comment, setComment] = useState('');
  const [fitMode, setFitMode] = useState(initialFit);
  const [showActionsMenu, setShowActionsMenu] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [showViewers, setShowViewers] = useState(false);
  const [viewersList, setViewersList] = useState([]);
  const [isViewersLoading, setIsViewersLoading] = useState(false);

  const { viewStory, toggleLove, reactToStory, getStoryViewers, shareStory, deleteStory } = useStory();
  const { user } = useAuth();
  const { AddNewMessage, setSelectedUser } = useMessage();
  const { t } = useTranslation();
  const { isRTL } = useTranslate();
  const { showAlert } = useAlert();

  const timerRef = useRef(null);
  const durationRef = useRef(5000);
  const containerRef = useRef(null);
  const textareaRef = useRef(null);

  const story = useMemo(() => stories[currentIndex] || null, [stories, currentIndex]);

  const photoUrl = useMemo(() => {
    if (!story) return null;
    const p = Array.isArray(story?.Photo) ? story.Photo.find(url => url) || null : story?.Photo || null;
    return p;
  }, [story]);

  // Mark story as viewed
  useEffect(() => {
    if (story?._id) {
      viewStory(story._id);
      setSelectedUser(story?.owner);
    }
    setProgress(0);
    setIsImageLoaded(false);
    setShowViewers(false);
  }, [currentIndex, story, viewStory, setSelectedUser]);

  const handleOpenViewers = async () => {
    setIsPaused(true);
    setIsViewersLoading(true);
    const list = await getStoryViewers(story._id);
    setViewersList(list);
    setIsViewersLoading(false);
    setShowViewers(true);
  };

  const handleReaction = (emoji) => {
    reactToStory(story._id, emoji);
    showAlert?.(t("Reacted with ") + emoji);
  };

  const handleStoryReply = async () => {
    if (!comment.trim()) return;
    try {
      await AddNewMessage(`Replying to story: ${comment.trim()}`, null);
      setComment('');
      setIsPaused(false);
      showAlert?.(t("Reply sent as message!"));
    } catch (err) {
      console.error(err);
      showAlert?.(t("Failed to send reply"));
    }
  };

  const handleShare = useCallback(async (e) => {
    e?.stopPropagation();
    if (!story?._id) return;
    await shareStory(story._id);
    showAlert?.(t("Story shared to your profile!"));
  }, [story, shareStory, showAlert, t]);

  // Progress timer
  useEffect(() => {
    if (!story) return;
    let rafId = null;
    let start = null;
    const duration = durationRef.current;

    const step = (timestamp) => {
      if (isPaused) {
        start = null; // Reset start when unpaused to resume correctly
        rafId = requestAnimationFrame(step);
        return;
      }
      if (!start) start = timestamp - (progress / 100) * duration;
      const elapsed = timestamp - start;
      const percent = (elapsed / duration) * 100;

      if (percent >= 100) {
        setProgress(100);
        cancelAnimationFrame(rafId);
        setTimeout(() => {
          if (currentIndex < stories.length - 1) {
            setCurrentIndex(idx => idx + 1);
            setProgress(0);
          } else {
            onClose();
          }
        }, 100);
        return;
      } else {
        setProgress(percent);
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    timerRef.current = rafId;

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [currentIndex, isPaused, story, stories.length, onClose]);

  const handleNext = useCallback(() => {
    setProgress(0);
    if (currentIndex < stories.length - 1) setCurrentIndex(idx => idx + 1);
    else onClose();
  }, [currentIndex, stories.length, onClose]);

  const handlePrev = useCallback(() => {
    setProgress(0);
    if (currentIndex > 0) setCurrentIndex(idx => idx - 1);
  }, [currentIndex]);

  const handleLove = useCallback((e) => {
    e?.stopPropagation();
    if (!story?._id) return;
    toggleLove(story._id);
  }, [story, toggleLove]);

  const handleDelete = useCallback(async (e) => {
    e?.stopPropagation();
    if (!story?._id) return;
    if (!confirm(t('Are you sure you want to delete this story?'))) return;
    await deleteStory(story._id);
    onClose();
  }, [story, deleteStory, onClose, t]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleTap = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    if (clickX < rect.width / 3) handlePrev();
    else if (clickX > (rect.width * 2) / 3) handleNext();
    else setIsPaused(p => !p);
  }, [handleNext, handlePrev]);

  const handlers = useSwipeable({
    onSwipedUp: () => handleClose(),
    onSwipedDown: () => handleClose(),
    onSwipedLeft: isRTL ? handlePrev : handleNext,
    onSwipedRight: isRTL ? handleNext : handlePrev,
    trackMouse: true,
  });

  if (!stories || stories.length === 0) return null;

  const isOwner = user?._id === story?.owner?._id;
  const isLoved = story?.loves?.some(u => (u?._id || u) === user?._id);

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Blur */}
      <AnimatePresence mode="wait">
        <motion.div
          key={photoUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0"
        >
          {photoUrl && <Image src={photoUrl} fill alt="bg" className="object-cover blur-3xl opacity-30" />}
        </motion.div>
      </AnimatePresence>

      {/* Close Area */}
      <div className="absolute inset-0 z-10" onClick={handleClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-20 w-full max-w-[480px] h-[90vh] md:h-[85vh] aspect-[9/16] bg-[#111] rounded-[2.5rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Progress Bars */}
        <div className="absolute top-4 inset-x-4 z-50 flex gap-1.5 px-2">
          {stories.map((_, idx) => (
            <div key={idx} className="flex-1 h-1 rounded-full bg-white/20 overflow-hidden">
              <div
                className="h-full bg-white transition-all ease-linear"
                style={{
                  width: idx < currentIndex ? '100%' : idx === currentIndex ? `${progress}%` : '0%',
                  transitionDuration: idx === currentIndex && !isPaused ? '100ms' : '0ms'
                }}
              />
            </div>
          ))}
        </div>

        {/* Story Header */}
        <div className="absolute top-8 inset-x-6 z-50 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/Pages/User/${story?.owner?._id}`} className="relative w-10 h-10 rounded-2xl overflow-hidden border border-white/20">
              <Image src={story?.owner?.profilePhoto?.url || '/default-profile.png'} fill alt="avatar" className="object-cover" />
            </Link>
            <div className="flex flex-col">
              <span className="text-white text-sm font-bold flex items-center gap-1">
                {story?.owner?.username}
                {story?.collaborators?.length > 0 && <span className="text-[8px] px-1 bg-white/10 rounded uppercase">Collab</span>}
              </span>
              <span className="text-white/40 text-[10px] uppercase font-black tracking-widest">
                {formatRelativeTime(story?.createdAt)}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isOwner && (
              <button onClick={handleDelete} className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 flex items-center justify-center transition-all">
                <HiTrash size={20} />
              </button>
            )}
            <button onClick={handleClose} className="w-10 h-10 rounded-2xl bg-white/5 hover:bg-white/10 text-white/40 hover:text-white flex items-center justify-center transition-all">
              <HiXMark size={24} />
            </button>
          </div>
        </div>

        {/* Interaction zones */}
        <div className="absolute inset-0 z-30 flex cursor-pointer" onClick={handleTap}>
          <div className="w-1/4 h-full" />
          <div className="w-1/2 h-full" onContextMenu={(e) => e.preventDefault()} />
          <div className="w-1/4 h-full" />
        </div>

        {/* Content */}
        <main {...handlers} className="w-full h-full relative flex items-center justify-center bg-black">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full relative"
            >
              {photoUrl ? (
                <div className="w-full h-full">
                  <Image
                    src={photoUrl}
                    fill
                    alt="story"
                    className={`${fitMode === 'cover' ? 'object-cover' : 'object-contain'}`}
                    onLoadingComplete={() => setIsImageLoaded(true)}
                  />

                  {/* Overlays */}
                  <div className="absolute inset-0 z-40 p-10 flex flex-col items-center justify-center pointer-events-none">
                    {story?.isCloseFriends && (
                      <div className="absolute top-2 left-0 right-0 flex justify-center">
                        <span className="bg-green-500 text-[10px] font-black text-white px-2 py-1 rounded-lg uppercase tracking-tighter">Close Friends</span>
                      </div>
                    )}

                    <div className="space-y-6 flex flex-col items-center">
                      {story?.music && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/20 flex items-center gap-3 pointer-events-auto cursor-pointer">
                          <div className="w-10 h-10 rounded-lg overflow-hidden relative">
                            {story.music.cover ? <Image src={story.music.cover} fill alt="art" /> : <HiPlay className="m-auto text-white/40" />}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-white text-[10px] font-bold">{story.music.title}</span>
                            <span className="text-white/40 text-[8px]">{story.music.artist}</span>
                          </div>
                        </motion.div>
                      )}

                      {story?.link?.url && (
                        <motion.a
                          href={story.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-6 py-2 bg-white text-black rounded-full font-black text-xs shadow-2xl flex items-center gap-2 pointer-events-auto"
                        >
                          {story.link.text || t("Visit Link")}
                          <HiShare size={14} />
                        </motion.a>
                      )}

                      {story?.mentions?.length > 0 && (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {story.mentions.map(m => (
                            <Link key={m._id} href={`/Pages/User/${m._id}`} className="px-3 py-1 bg-indigo-500/80 backdrop-blur-sm text-white rounded-full text-[10px] font-bold pointer-events-auto">
                              @{m.username}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {story?.text && (
                    <div className="absolute bottom-32 inset-x-8 text-center bg-black/40 backdrop-blur-md p-4 rounded-3xl border border-white/5">
                      <p className="text-white font-medium text-lg italic">{story.text}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center px-8 text-center" style={{ background: 'linear-gradient(45deg, #111, #222)' }}>
                  <h2 className="text-white text-3xl font-bold leading-tight">{story?.text}</h2>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Bottom Actions */}
        <div className="absolute bottom-8 inset-x-6 z-50 flex flex-col gap-4">
          {!isOwner && (
            <div className="flex gap-2 justify-center mb-2">
              {['🔥', '😂', '😮', '😢', '😍', '👏'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-xl transition-all hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          <div className="flex items-center gap-4">
            {!isOwner && (
              <div className="flex-1 relative group">
                <input
                  type="text"
                  placeholder={t("Reply to story...")}
                  className="w-full h-12 bg-white/5 border border-white/10 rounded-2xl px-5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all font-medium"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  onKeyPress={(e) => e.key === 'Enter' && handleStoryReply()}
                />
                <button
                  onClick={handleStoryReply}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/20 hover:text-white transition-colors"
                >
                  <HiPaperAirplane size={20} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2">
              {!isOwner ? (
                <>
                  <button onClick={handleLove} className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isLoved ? 'bg-rose-500/10 text-rose-500' : 'bg-white/5 text-white/40 hover:text-white'}`}>
                    <HiHeart size={24} className={isLoved ? 'fill-current' : ''} />
                  </button>
                  <button onClick={handleShare} className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-all">
                    <HiShare size={24} />
                  </button>
                </>
              ) : (
                <div
                  onClick={handleOpenViewers}
                  className="flex items-center gap-4 bg-white/5 px-6 h-12 rounded-2xl border border-white/5 backdrop-blur-md cursor-pointer hover:bg-white/10 transition-all hover:scale-105"
                >
                  <div className="flex items-center gap-2 text-white/60">
                    <HiEye size={18} />
                    <span className="text-xs font-black">{story?.views?.length || 0}</span>
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <div className="flex flex-wrap gap-1 max-w-[40px] overflow-hidden">
                    {story?.reactions?.slice(0, 3).map((r, i) => (
                      <span key={i} className="text-[10px]">{r.emoji}</span>
                    ))}
                    {story?.reactions?.length > 3 && <span className="text-[8px] text-white/40">+{story.reactions.length - 3}</span>}
                  </div>
                  <div className="w-px h-4 bg-white/10" />
                  <div className="flex items-center gap-2 text-rose-500/80">
                    <HiHeart size={18} className="fill-current" />
                    <span className="text-xs font-black">{story?.loves?.length || 0}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Viewers Modal */}
        <AnimatePresence>
          {showViewers && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              className="absolute inset-0 z-[60] bg-black/90 backdrop-blur-xl p-8 flex flex-col rounded-[2.5rem]"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-white font-black uppercase tracking-widest text-sm">{t("Viewers")}</h3>
                <button onClick={() => setShowViewers(false)} className="text-white/40 hover:text-white"><HiXMark size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
                {isViewersLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : viewersList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/20">
                    <HiEye size={48} className="mb-4" />
                    <p className="text-sm font-bold">{t("No views yet")}</p>
                  </div>
                ) : (
                  viewersList.map(v => (
                    <div key={v._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-black/50">
                          <Image src={v.profilePhoto?.url || '/default-avatar.png'} fill alt="v" className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-xs font-black">{v.username}</span>
                          <span className="text-white/40 text-[10px] uppercase font-bold tracking-tighter">{v.profileName}</span>
                        </div>
                      </div>
                      <Link href={`/Pages/User/${v._id}`} className="px-4 py-1.5 rounded-xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all">
                        {t("Profile")}
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Side Desktop Controls */}
      <div className="hidden lg:flex fixed right-12 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
        <button onClick={handleNext} className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
          <HiChevronRight size={32} />
        </button>
        <button onClick={handlePrev} className="w-14 h-14 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
          <HiChevronLeft size={32} />
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;
