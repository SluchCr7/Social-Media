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
import { Maximize2, Minimize2 } from 'lucide-react';
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

  const handleToggleFitMode = useCallback(() => {
    setFitMode((prev) => (prev === 'contain' ? 'cover' : 'contain'));
  }, []);

  const toggleActionsMenu = useCallback((e) => {
    e?.stopPropagation();
    setShowActionsMenu((prev) => !prev);
  }, []);

  const handleCopyLink = useCallback(() => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      showAlert?.(t("Link copied to clipboard"));
    }
    setShowActionsMenu(false);
  }, [showAlert, t]);

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
        start = null;
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
    setShowActionsMenu(false);
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
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/90 backdrop-blur-md select-none" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Background Blur */}
      <AnimatePresence mode="wait">
        <motion.div
          key={photoUrl}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          {photoUrl && <Image src={photoUrl} fill alt="bg" className="object-cover blur-3xl" />}
        </motion.div>
      </AnimatePresence>

      {/* Close Area */}
      <div className="absolute inset-0 z-10" onClick={handleClose} />

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative z-20 w-full max-w-[440px] h-[92vh] md:h-[88vh] bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar: Progress & Header */}
        <div className="relative z-50 pt-4 px-4 bg-gradient-to-b from-black/80 to-transparent pb-2 flex flex-col gap-3">
          {/* Progress Bars */}
          <div className="flex gap-1.5 w-full">
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

          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href={`/Pages/User/${story?.owner?._id}`} className="relative w-9 h-9 rounded-xl overflow-hidden border border-white/20">
                <Image src={story?.owner?.profilePhoto?.url || '/default-profile.png'} fill alt="avatar" className="object-cover" />
              </Link>
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold flex items-center gap-1">
                  {story?.owner?.username}
                  {story?.collaborators?.length > 0 && <span className="text-[8px] px-1 bg-white/10 rounded uppercase">Collab</span>}
                </span>
                <span className="text-white/40 text-[9px] uppercase font-semibold">
                  {formatRelativeTime(story?.createdAt)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={toggleActionsMenu} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all">
                <HiEllipsisVertical size={18} />
              </button>
              {isOwner && (
                <button onClick={handleDelete} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-500 flex items-center justify-center transition-all">
                  <HiTrash size={18} />
                </button>
              )}
              <button onClick={handleClose} className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all">
                <HiXMark size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Actions Dropdown Menu */}
        <AnimatePresence>
          {showActionsMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-20 right-4 z-50 w-48 rounded-2xl border border-white/10 bg-neutral-900/95 backdrop-blur-xl shadow-xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button onClick={handleToggleFitMode} className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-white text-xs font-medium">
                {fitMode === 'contain' ? t('Stretch to fill') : t('Fit to screen')}
              </button>
              {story?.link?.url && (
                <a href={story.link.url} target="_blank" rel="noreferrer" className="block px-4 py-2.5 hover:bg-white/5 text-white text-xs font-medium">
                  {t('Open link')}
                </a>
              )}
              {isOwner && (
                <button onClick={handleOpenViewers} className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-white text-xs font-medium">
                  {isViewersLoading ? t('Loading viewers...') : t('Viewers')}
                </button>
              )}
              <button onClick={handleCopyLink} className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-white text-xs font-medium">
                {t('Copy link')}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Center Image / Media Area (Pure & Clean without clutter) */}
        <main {...handlers} className="flex-1 relative flex items-center justify-center bg-black overflow-hidden my-1">
          {/* Touch / Tap Zones */}
          <div className="absolute inset-0 z-30 flex cursor-pointer" onClick={handleTap}>
            <div className="w-1/4 h-full" />
            <div className="w-1/2 h-full" onContextMenu={(e) => e.preventDefault()} />
            <div className="w-1/4 h-full" />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="w-full h-full relative flex items-center justify-center"
            >
              {photoUrl ? (
                <Image
                  src={photoUrl}
                  fill
                  alt="story"
                  className={`${fitMode === 'cover' ? 'object-cover' : 'object-contain'}`}
                  onLoadingComplete={() => setIsImageLoaded(true)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center px-8 text-center bg-gradient-to-br from-neutral-900 to-black">
                  <h2 className="text-white text-2xl font-bold leading-tight">{story?.text}</h2>
                </div>
              )}

              {/* Badges inside Image (Close Friends tag only) */}
              {story?.isCloseFriends && (
                <div className="absolute top-3 left-0 right-0 flex justify-center z-40 pointer-events-none">
                  <span className="bg-emerald-500/90 backdrop-blur-md text-[9px] font-black text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-lg">
                    Close Friends
                  </span>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Dedicated Clean Bottom Area (Text, Music, Link & Actions outside the image) */}
        <div className="relative z-40 bg-neutral-950 px-4 py-3 flex flex-col gap-2.5 border-t border-white/5">
          {/* Text Description / Caption if available */}
          {story?.text && photoUrl && (
            <div className="text-center px-2">
              <p className="text-white/90 text-xs font-normal line-clamp-2">{story.text}</p>
            </div>
          )}

          {/* Extra Elements (Music / Links / Mentions) */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            {story?.music && (
              <div className="bg-white/5 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <div className="w-6 h-6 rounded-md overflow-hidden relative">
                  {story.music.cover ? <Image src={story.music.cover} fill alt="art" className="object-cover" /> : <HiPlay className="m-auto text-white/40" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-[9px] font-bold leading-tight">{story.music.title}</span>
                  <span className="text-white/40 text-[7px] leading-tight">{story.music.artist}</span>
                </div>
              </div>
            )}

            {story?.link?.url && (
              <a
                href={story.link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 bg-white text-black rounded-xl font-bold text-[10px] flex items-center gap-1.5 shadow-md hover:bg-neutral-200 transition-colors"
              >
                {story.link.text || t("Visit Link")}
                <HiShare size={12} />
              </a>
            )}

            {story?.mentions?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 justify-center">
                {story.mentions.map(m => (
                  <Link key={m._id} href={`/Pages/User/${m._id}`} className="px-2.5 py-1 bg-indigo-600/80 text-white rounded-lg text-[9px] font-bold">
                    @{m.username}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Quick Emojis Reactions (for viewers) */}
          {!isOwner && (
            <div className="flex items-center justify-between gap-1 px-1">
              {['🔥', '😂', '😮', '😢', '😍', '👏'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-base transition-all hover:scale-125"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Reply input & Actions Bar */}
          <div className="flex items-center gap-2">
            {!isOwner ? (
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder={t("Reply to story...")}
                  className="w-full h-10 bg-white/5 border border-white/10 rounded-xl px-4 text-white text-xs placeholder:text-white/30 focus:outline-none focus:border-white/30 transition-all"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  onFocus={() => setIsPaused(true)}
                  onBlur={() => setIsPaused(false)}
                  onKeyPress={(e) => e.key === 'Enter' && handleStoryReply()}
                />
                <button
                  onClick={handleStoryReply}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                >
                  <HiPaperAirplane size={16} />
                </button>
              </div>
            ) : null}

            <div className="flex items-center gap-1.5 ms-auto">
              {photoUrl && (
                <button 
                  onClick={handleToggleFitMode} 
                  className="w-10 h-10 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all flex items-center justify-center"
                  title={fitMode === 'contain' ? t('Cover') : t('Contain')} // إضافة Tooltip توضيحية عند الوقوف على الزر
                >
                  {fitMode === 'contain' ? (
                    <Maximize2 className="w-4 h-4" /> // أيقونة تعبر عن ملء/احتواء الحيز (Cover)
                  ) : (
                    <Minimize2 className="w-4 h-4" /> // أيقونة تعبر عن التصغير داخل الإطار (Contain)
                  )}
                </button>
              )}

              {!isOwner ? (
                <>
                  <button onClick={handleLove} className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isLoved ? 'bg-rose-500/20 text-rose-500' : 'bg-white/5 text-white/60 hover:text-white'}`}>
                    <HiHeart size={20} className={isLoved ? 'fill-current' : ''} />
                  </button>
                  <button onClick={handleShare} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60 hover:text-white transition-all">
                    <HiShare size={20} />
                  </button>
                </>
              ) : (
                <div
                  onClick={handleOpenViewers}
                  className="flex items-center gap-3 bg-white/5 px-4 h-10 rounded-xl border border-white/10 cursor-pointer hover:bg-white/10 transition-all w-full justify-center"
                >
                  <div className="flex items-center gap-1.5 text-white/70">
                    <HiEye size={16} />
                    <span className="text-xs font-bold">{story?.views?.length || 0}</span>
                  </div>
                  <div className="w-px h-3 bg-white/15" />
                  <div className="flex items-center gap-1.5 text-rose-500">
                    <HiHeart size={16} className="fill-current" />
                    <span className="text-xs font-bold">{story?.loves?.length || 0}</span>
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
              className="absolute inset-0 z-[60] bg-neutral-950/95 backdrop-blur-xl p-6 flex flex-col rounded-[2.5rem]"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white font-bold uppercase tracking-wider text-xs">{t("Viewers")}</h3>
                <button onClick={() => setShowViewers(false)} className="text-white/40 hover:text-white"><HiXMark size={20} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {isViewersLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="w-6 h-6 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                ) : viewersList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-white/30">
                    <HiEye size={36} className="mb-2" />
                    <p className="text-xs font-medium">{t("No views yet")}</p>
                  </div>
                ) : (
                  viewersList.map(v => (
                    <div key={v._id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-3">
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden">
                          <Image src={v.profilePhoto?.url || '/default-avatar.png'} fill alt="v" className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white text-xs font-bold">{v.username}</span>
                          <span className="text-white/40 text-[9px] uppercase font-medium">{v.profileName}</span>
                        </div>
                      </div>
                      <Link href={`/Pages/User/${v._id}`} className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-[9px] font-bold uppercase tracking-wider hover:bg-indigo-700 transition-all">
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
      <div className="hidden lg:flex fixed right-8 top-1/2 -translate-y-1/2 flex-col gap-4 z-50">
        <button onClick={handleNext} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
          <HiChevronRight size={24} />
        </button>
        <button onClick={handlePrev} className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
          <HiChevronLeft size={24} />
        </button>
      </div>
    </div>
  );
};

export default StoryViewer;