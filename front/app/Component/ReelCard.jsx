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

const ReelCard = forwardRef(({ reel, isActive, isMuted, toggleMute }, ref) => {
  const videoRef = useRef(null);
  const { user } = useAuth();
  const { deleteReel, likeReel, viewReel, shareReel, setShowModelAddReel } = useReels();

  const [showComments, setShowComments] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showHeart, setShowHeart] = useState(false);
  const [viewed, setViewed] = useState(false);

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
      <div className="absolute bottom-5 left-4 md:left-6 text-white max-w-[75%] sm:max-w-[70%] md:max-w-[60%]">
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src={reel?.owner?.profilePhoto?.url}
            alt={reel?.owner?.username}
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white object-cover"
          />
          <div className="flex flex-col">
            <Link
              href={`/Pages/User/${reel?.owner?._id}`}
              className="font-semibold text-sm sm:text-base hover:underline"
            >
              {reel?.owner?.username}
            </Link>
            {reel?.originalPost && reel?.originalPost?.owner && (
              <span className="text-[10px] sm:text-xs text-gray-300 flex items-center gap-1">
                🔄 Reposted from{" "}
                <Link
                  href={`/Pages/User/${reel?.originalPost?.owner?._id}`}
                  className="font-medium hover:underline"
                >
                  @{reel?.originalPost?.owner?.username}
                </Link>
              </span>
            )}
          </div>
        </div>

        {reel?.caption && (
          <p className="mt-2 text-xs sm:text-sm line-clamp-3 text-gray-200">
            {reel?.caption}
          </p>
        )}
      </div>

      {/* 🎛️ Right-side actions */}
      <div className="absolute right-3 sm:right-5 bottom-20 flex flex-col gap-5 sm:gap-6 text-white items-center">
        {/* 👁 Views */}
        <div className="flex flex-col items-center text-gray-300">
          <FaEye size={20} className="sm:size-22" />
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
          <FaHeart size={22} className="sm:size-24" />
          <span className="text-[10px] sm:text-xs">{reel?.likes?.length || 0}</span>
        </button>

        {/* 💬 Comments */}
        <button
          onClick={() => setShowComments(true)}
          className="flex flex-col items-center hover:scale-110 transition-transform"
        >
          <FaRegCommentDots size={22} className="sm:size-24" />
          <span className="text-[10px] sm:text-xs">{reel?.comments?.length || 0}</span>
        </button>

        {/* 🔁 Share */}
        <button
          onClick={() => shareReel(reel?._id, reel?.owner?._id)}
          className="flex flex-col items-center hover:scale-110 transition-transform"
        >
          <RiShareForwardLine size={22} className="sm:size-24" />
        </button>

        {/* 🔗 Copy Link */}
        <button
          onClick={handleCopyLink}
          className="flex flex-col items-center hover:scale-110 transition-transform"
        >
          <IoLinkOutline size={22} className="sm:size-24" />
          <span className="text-[10px] sm:text-xs">Copy</span>
        </button>

        {/* 🗑 Delete */}
        {reel?.owner._id === user?._id && (
          <button
            className="flex flex-col items-center text-red-500 hover:scale-110 transition-transform"
            onClick={() => deleteReel(reel?._id)}
          >
            <FaTrash size={20} className="sm:size-22" />
          </button>
        )}
      </div>

      {/* 🔊 Controls (Mute / Add Reel) */}
      <div className="absolute top-4 right-3 sm:right-5 flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleMute}
          className="bg-black/40 p-2 sm:p-3 rounded-full text-white hover:bg-black/60 transition"
        >
          {isMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
        </button>
        <button
          onClick={() => setShowModelAddReel(true)}
          className="bg-black/40 p-2 sm:p-3 rounded-full text-white hover:bg-black/60 transition"
        >
          <FaPlus size={18} />
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
