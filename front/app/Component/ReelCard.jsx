'use client';

import React, { forwardRef, useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useReels } from '../Context/ReelsContext';
import { useAuth } from '../Context/AuthContext';
import {
  FaHeart,
  FaRegCommentDots,
  FaTrash,
  FaVolumeMute,
  FaVolumeUp,
  FaEye,
  FaPlus,
} from "react-icons/fa";
import { RiShareForwardLine } from "react-icons/ri";
import { IoLinkOutline } from "react-icons/io5";
import CommentsPopup from './CommentReelPopup';
import { useTranslation } from 'react-i18next';

const ReelCard = forwardRef(({ reel, isActive, isMuted, toggleMute }, ref) => {
  const videoRef = useRef(null);
  const { user } = useAuth();
  const { deleteReel, likeReel, viewReel, shareReel, setShowModelAddReel } = useReels();
  const {t,language} = useTranslation()
  const [showComments, setShowComments] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [viewed, setViewed] = useState(false);
    const isRTL = ['ar', 'fa', 'he', 'ur'].includes(language); // true لو RTL
  // 🎬 Auto play/pause and view count
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    if (isActive) {
      videoEl.play().catch(() => {});
      if (!viewed && user) {
        viewReel(reel?._id);
        setViewed(true);
      }
    } else {
      videoEl.pause();
    }
  }, [isActive, reel?._id, viewed, user, viewReel]);

  // ⏳ Progress bar
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const updateProgress = () => {
      const percent = (videoEl.currentTime / videoEl.duration) * 100;
      setProgress(percent || 0);
    };
    videoEl.addEventListener("timeupdate", updateProgress);
    return () => videoEl.removeEventListener("timeupdate", updateProgress);
  }, [reel?._id]);

  // ❤️ Double click like
  const handleDoubleClick = () => {
    if (!reel?.likes?.includes(user?._id)) handleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  const handleLike = async () => {
    try {
      await likeReel(reel?._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = () => {
    const link = `${window.location.origin}/Pages/Reel/${reel?._id}`;
    navigator.clipboard.writeText(link);
    alert("✅ Link copied!");
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-screen flex flex-col justify-end bg-black overflow-hidden"
      onDoubleClick={handleDoubleClick}
    >
      {/* 🎥 Video */}
      <video
        ref={videoRef}
        src={reel?.videoUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="auto"
      />

      {/* 💖 Heart Animation */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <FaHeart className="text-white/80 text-6xl animate-ping" />
        </div>
      )}

      {/* 🌈 Gradient Overlay */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* 📄 Bottom Info */}
      <div className="absolute bottom-5 left-4 md:left-6 text-white max-w-[80%] sm:max-w-[65%] md:max-w-[55%]">
        {/* 🔹 صور المالك الأصلي + من أعاد النشر */}
        <div className="relative flex items-center gap-3 sm:gap-4">
          <div className="relative">
            {/* صورة المالك الأصلي */}
            <img
              src={reel?.originalPost?.owner?.profilePhoto?.url || reel?.owner?.profilePhoto?.url}
              alt={reel?.originalPost?.owner?.username || reel?.owner?.username}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-white object-cover shadow-md"
            />

            {/* إذا كان الريل مُعاد نشره */}
            {reel?.originalPost && reel?.originalPost?.owner && (
              <img
                src={reel?.owner?.profilePhoto?.url}
                alt={reel?.owner?.username}
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white object-cover absolute -bottom-1 -right-2 bg-gray-800 shadow-md"
              />
            )}
          </div>

          {/* 🔹 بيانات المستخدم */}
          <div className="flex flex-col leading-tight">
            <Link
              href={`/Pages/User/${reel?.originalPost?.owner?._id || reel?.owner?._id}`}
              className="font-semibold text-sm sm:text-base hover:underline"
            >
              {reel?.originalPost?.owner?.username || reel?.owner?.username}
            </Link>

            {/* إذا كانت هناك إعادة نشر */}
            {reel?.originalPost && reel?.originalPost?.owner && (
              <span className="text-[11px] sm:text-xs text-gray-300 flex items-center gap-1">
                🔁 {t("Reshared by")}{" "}
                <Link
                  href={`/Pages/User/${reel?.owner?._id}`}
                  className="hover:underline font-medium text-gray-200"
                >
                  @{reel?.owner?.username}
                </Link>
              </span>
            )}
          </div>
        </div>

        {/* 🔹 الكابشن */}
        {reel?.caption && (
          <p className="mt-3 text-xs sm:text-sm text-gray-200 leading-snug line-clamp-3">
            {reel?.caption}
          </p>
        )}
      </div>

      {/* 🎛️ Right-side actions */}
      <div className="absolute right-3 sm:right-5 bottom-20 flex flex-col gap-5 sm:gap-6 text-white items-center">
        {/* 👁 Views */}
        <div className="flex flex-col items-center text-gray-300">
          <FaEye />
          <span className="text-[10px] sm:text-xs">{reel?.views?.length || 0}</span>
        </div>

        {/* ❤️ Like */}
        <button
          onClick={handleLike}
          className={`flex flex-col items-center transition-transform ${
            reel?.likes?.includes(user?._id)
              ? "scale-125 text-red-500"
              : "hover:scale-110"
          }`}
        >
          <FaHeart />
          <span className="text-[10px] sm:text-xs">{reel?.likes?.length || 0}</span>
        </button>

        {/* 💬 Comments */}
        <button
          onClick={() => setShowComments(true)}
          className="flex flex-col items-center hover:scale-110 transition-transform"
        >
          <FaRegCommentDots />
          <span className="text-[10px] sm:text-xs">{reel?.comments?.length || 0}</span>
        </button>

        {/* 🔁 Share */}
        <button
          onClick={() => shareReel(reel?._id, reel?.originalPost ? reel?.originalPost?._id : reel?.owner?._id)}
          className="flex flex-col items-center hover:scale-110 transition-transform"
        >
          <RiShareForwardLine  />
        </button>

        {/* 🔗 Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center hover:scale-110 transition-transform"
        >
          <IoLinkOutline  />
          <span className="text-[10px] sm:text-xs">{t("Copy")}</span>
        </button>

        {/* 🗑 Delete */}
        {reel?.owner._id === user?._id && (
          <button
            className="flex flex-col items-center text-red-500 hover:scale-110 transition-transform"
            onClick={() => deleteReel(reel?._id)}
          >
            <FaTrash />
          </button>
        )}
      </div>

      {/* 🔊 Controls (Mute / Add Reel) */}
      <div className="absolute top-4 right-3 sm:right-5 flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleMute}
          className="bg-black/40 p-2 sm:p-3 rounded-full text-white hover:bg-black/60 transition"
        >
          {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
        <button
          onClick={() => setShowModelAddReel(true)}
          className="bg-black/40 p-2 sm:p-3 rounded-full text-white hover:bg-black/60 transition"
        >
          <FaPlus />
        </button>
      </div>

      {/* 📊 Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-600 w-full">
        <div
          className="h-1 bg-white transition-all duration-300 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 💭 Comments Modal */}
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
