'use client';

import React, { forwardRef, useRef, useEffect, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useReels } from '../Context/ReelsContext';
import { useUser } from '../Context/UserContext';
import { useTranslation } from 'react-i18next';
import { useTranslate } from '../Context/TranslateContext';
import CommentsPopup from './CommentReelPopup';
import ReelSkeleton from '../Skeletons/ReelSkeleton';
import { motion, AnimatePresence } from 'framer-motion';

// Icons
import {
  FaHeart,
  FaRegHeart,
  FaCommentDots,
  FaRegCommentDots,
  FaShare,
  FaTrashAlt,
  FaVolumeMute,
  FaVolumeUp,
  FaBookmark,
  FaRegBookmark,
  FaEllipsisH,
  FaPlay,
  FaPause
} from "react-icons/fa";
import { RiShareForwardFill } from "react-icons/ri";
import { IoCopyOutline } from "react-icons/io5";
import { MdVerified } from 'react-icons/md';

const ActionButton = ({ icon: Icon, label, onClick, isActive, colorClass = "text-rose-500", customClass = "" }) => (
  <div className="flex flex-col items-center gap-1 group cursor-pointer" onClick={onClick}>
    <div className={`
            w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-300
            ${isActive
        ? `bg-white/20 ${colorClass} shadow-[0_0_15px_rgba(255,255,255,0.2)] scale-110`
        : 'bg-black/20 text-white hover:bg-black/40 hover:scale-105'}
            ${customClass}
        `}>
      <Icon size={22} className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
    </div>
    {label && <span className="text-[10px] font-bold text-white/90 drop-shadow-md tracking-wide">{label}</span>}
  </div>
);

const ReelCard = forwardRef(({ userData, reel, isActive, isMuted, toggleMute }, ref) => {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const { toggleSaveReel } = useUser();
  const { deleteReel, likeReel, viewReel, shareReel, setShowModelAddReel } = useReels();
  const { t } = useTranslation();
  const { isRTL } = useTranslate();

  const [showComments, setShowComments] = useState(false);
  const [progress, setProgress] = useState(0);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [viewed, setViewed] = useState(false);

  // Derived State
  const isLiked = useMemo(() => reel?.likes?.includes(userData?._id), [reel?.likes, userData?._id]);
  const isSaved = useMemo(() => userData?.savedReels?.some((r) => r?._id === reel?._id), [userData?.savedReels, reel?._id]);
  const isOwner = reel?.owner?._id === userData?._id;

  // 🎬 Video Control Logic
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isActive) {
      // Small delay to ensure smooth transition
      const playPromise = videoEl.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay was prevented
          setIsPlaying(false);
        });
      }
      setIsPlaying(true);

      if (!viewed && userData) {
        viewReel(reel?._id);
        setViewed(true);
      }
    } else {
      videoEl.pause();
      setIsPlaying(false);
      videoEl.currentTime = 0; // Reset for next view
    }
  }, [isActive, reel?._id, viewed, userData, viewReel]);

  // ⏸ Toggle Play/Pause manually
  const togglePlay = useCallback((e) => {
    e.stopPropagation();
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (videoEl.paused) {
      videoEl.play();
      setIsPlaying(true);
    } else {
      videoEl.pause();
      setIsPlaying(false);
    }
  }, []);

  // ⏳ Progress bar
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const updateProgress = () => {
      const percentage = (videoEl.currentTime / videoEl.duration) * 100;
      setProgress(percentage || 0);
    };

    videoEl.addEventListener("timeupdate", updateProgress);
    return () => videoEl.removeEventListener("timeupdate", updateProgress);
  }, [reel?._id]);

  // ❤️ Like Handler
  const handleLike = useCallback(async () => {
    try {
      await likeReel(reel?._id);
    } catch (err) {
      console.error(err);
    }
  }, [likeReel, reel?._id]);

  // Double Click Like
  const handleDoubleClick = useCallback((e) => {
    e.stopPropagation(); // Prevent play toggle
    if (!isLiked) handleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  }, [isLiked, handleLike]);

  const handleCopyLink = useCallback(() => {
    const link = `${window.location.origin}/Pages/Reel/${reel?._id}`;
    navigator.clipboard.writeText(link);
    // You might want a toast here
  }, [reel?._id]);

  return (
    <div
      id={reel?._id}
      ref={ref}
      className="relative w-full h-screen bg-black overflow-hidden select-none"
    >
      {/* Loading State */}
      {!videoLoaded && (
        <div className="absolute inset-0 z-0 bg-gray-900 animate-pulse">
          <ReelSkeleton />
        </div>
      )}

      {/* 🎥 Video Player */}
      {/* Click to Toggle Play, Double Click to Like (handled by wrapper or specific handlers) */}
      <div
        className="absolute inset-0 z-0 cursor-pointer"
        onClick={togglePlay}
        onDoubleClick={handleDoubleClick}
      >
        <video
          ref={videoRef}
          src={reel?.videoUrl}
          className={`w-full h-full object-cover transition-opacity duration-500 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}
          loop
          muted={isMuted}
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
        />
      </div>

      {/* 🎬 Center Play/Pause Indicator (Subtle) */}
      {!isPlaying && isActive && videoLoaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 bg-black/20">
          <div className="w-20 h-20 bg-black/40 backdrop-blur-md rounded-full flex items-center justify-center text-white/80 animate-pulse">
            <FaPlay className="pl-2 text-3xl" />
          </div>
        </div>
      )}

      {/* 💥 Heart Explosion Animation */}
      <AnimatePresence>
        {showHeart && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <motion.div
              initial={{ scale: 0, rotation: 0 }}
              animate={{ scale: [0, 1.5, 1], rotate: [0, -15, 15, 0] }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <FaHeart className="text-red-500 drop-shadow-2xl text-[120px]" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🌑 Cinematic Gradients */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-black/60 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none z-10" />

      {/* 🔊 Top Controls */}
      <div className={`absolute top-6 ${isRTL ? "left-6" : "right-6"} z-30 flex flex-col gap-4`}>
        <button
          onClick={(e) => { e.stopPropagation(); toggleMute(); }}
          className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white/20 transition-all border border-white/10"
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>

      {/* ℹ️ Bottom Content Area */}
      <div className="absolute bottom-0 inset-x-0 pb-6 pt-12 z-20 px-4 md:px-6 flex items-end justify-between">

        {/* Left: User Info & Caption */}
        <div className={`flex flex-col gap-4 max-w-[80%] md:max-w-[70%] ${isRTL ? "text-right items-end" : "text-left items-start"}`}>

          {/* User Profile */}
          <Link href={`/Pages/User/${reel?.originalPost?.owner?._id || reel?.owner?._id}`}
            className="group flex items-center gap-3 bg-black/30 backdrop-blur-md p-2 pr-4 rounded-full border border-white/10 hover:bg-black/50 transition-all w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <Image
                src={reel?.originalPost?.owner?.profilePhoto?.url || reel?.owner?.profilePhoto?.url || '/default-avatar.png'}
                alt="avatar"
                width={44}
                height={44}
                className="w-11 h-11 rounded-full object-cover border-2 border-white/20"
              />
              {/* Reshare Indicator Small Badge */}
              {reel?.originalPost && (
                <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border border-black">
                  <RiShareForwardFill size={8} className="text-black" />
                </div>
              )}
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="font-bold text-white text-sm tracking-wide group-hover:text-blue-400 transition-colors">
                  {reel?.originalPost?.owner?.username || reel?.owner?.username}
                </span>
                {/* Verified Badge Mockup if available in data */}
                <MdVerified className="text-blue-500 text-xs" />
              </div>
              {/* Reshared By Text */}
              {reel?.originalPost && (
                <span className="text-[10px] text-gray-300 font-medium">
                  {t("Original by")} {reel?.originalPost?.owner?.username}
                </span>
              )}
            </div>

            {/* Follow Button (Mockup logic or implementation) */}
            {/* <button className="ml-2 px-3 py-1 rounded-full bg-blue-600 text-[10px] font-bold text-white uppercase hover:bg-blue-500 transition-colors">Follow</button> */}
          </Link>

          {/* Caption */}
          {reel?.caption && (
            <div className="relative">
              <p className={`text-sm text-gray-100 font-medium leading-relaxed drop-shadow-md line-clamp-3 ${isRTL ? "text-right" : "text-left"}`}>
                {reel?.caption}
              </p>
            </div>
          )}

          {/* Audio Track Info (Mockup) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm w-fit">
            <div className="flex gap-[2px] items-end h-3">
              {[1, 2, 3].map(i => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
                  className="w-[2px] bg-white rounded-full"
                />
              ))}
            </div>
            <span className="text-[10px] text-white/90 font-bold uppercase tracking-widest truncate max-w-[150px]">
              Original Audio • {reel?.owner?.username}
            </span>
          </div>
        </div>

        {/* Right: Action Rail */}
        <div className={`flex flex-col gap-6 items-center pb-8 ${isRTL ? "order-first" : ""}`}>

          {/* Like */}
          <ActionButton
            icon={isLiked ? FaHeart : FaRegHeart}
            label={reel?.likes?.length > 0 ? reel.likes.length : "Like"}
            isActive={isLiked}
            onClick={(e) => { e.stopPropagation(); handleLike(); }}
          />

          {/* Comment */}
          <ActionButton
            icon={FaRegCommentDots}
            label={reel?.comments?.length > 0 ? reel.comments.length : "Comment"}
            onClick={(e) => { e.stopPropagation(); setShowComments(true); }}
            customClass="hover:bg-blue-500/20 hover:text-blue-400 group-hover:border-blue-500/50"
          />

          {/* Save */}
          <ActionButton
            icon={isSaved ? FaBookmark : FaRegBookmark}
            isActive={isSaved}
            colorClass="text-yellow-400"
            onClick={(e) => { e.stopPropagation(); toggleSaveReel(reel?._id); }}
          />

          {/* Share */}
          <ActionButton
            icon={RiShareForwardFill}
            label="Share"
            onClick={(e) => {
              e.stopPropagation();
              shareReel(reel?._id, reel?.originalPost ? reel?.originalPost?._id : reel?.owner?._id)
            }}
          />

          {/* Copy Link / More */}
          <div className="relative group">
            <button
              onClick={(e) => { e.stopPropagation(); handleCopyLink(); }}
              className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/10 transition-colors"
            >
              <IoCopyOutline />
            </button>
          </div>

          {/* Delete (Owner Only) */}
          {isOwner && (
            <button
              onClick={(e) => { e.stopPropagation(); deleteReel(reel?._id); }}
              className="w-10 h-10 rounded-full bg-red-500/10 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors mt-2"
            >
              <FaTrashAlt size={14} />
            </button>
          )}

        </div>
      </div>

      {/* 📏 Progress Bar (Pinned to bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-30">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 box-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </div>

      {/* 💬 Comments Modal */}
      <CommentsPopup
        reelId={reel?._id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
});

ReelCard.displayName = "ReelCard";
export default ReelCard;
