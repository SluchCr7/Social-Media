'use client';

import React, { forwardRef, useRef, useEffect, useState } from 'react';
import Link from 'next/link';
import { useReels } from '../Context/ReelsContext';
import { useAuth } from '../Context/AuthContext';
import {
  FaHeart,
  FaRegCommentDots,
  FaShareAlt,
  FaTrash,
  FaVolumeMute,
  FaVolumeUp,
  FaEye,
  FaArrowLeft
} from "react-icons/fa";

const ReelCard = forwardRef(({ reel }, ref) => {
  const videoRef = useRef(null);
  const { user } = useAuth();
  const { deleteReel, likeReel, viewReel } = useReels();
  const [showComments, setShowComments] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showHeart, setShowHeart] = useState(false);
  const [viewed, setViewed] = useState(false); // علشان مايحصلش تكرار للمشاهدة

  // ✅ Auto play / pause + تسجيل مشاهدة
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {});
          if (!viewed && user) {
            viewReel(reel._id);
            setViewed(true);
          }
        } else {
          videoEl.pause();
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(videoEl);
    return () => {
      observer.unobserve(videoEl);
      observer.disconnect();
    };
  }, [reel._id, viewReel, viewed, user]);

  // ✅ Progress bar
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const updateProgress = () => {
      const percent = (videoEl.currentTime / videoEl.duration) * 100;
      setProgress(percent || 0);
    };

    videoEl.addEventListener("timeupdate", updateProgress);
    return () => {
      videoEl.removeEventListener("timeupdate", updateProgress);
    };
  }, []);

  // ✅ Double-tap like
  const handleDoubleClick = () => {
    if (!isLiked) {
      handleLike();
    }
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 800);
  };

  // ✅ Like function
  const handleLike = async () => {
    try {
      await likeReel(reel._id);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      ref={ref}
      className="relative w-full h-screen flex flex-col justify-end bg-black overflow-hidden"
      onDoubleClick={handleDoubleClick}
    >
      {/* Back to home */}
      <Link
        href="/"
        className="absolute top-5 left-5 z-20 flex items-center gap-2 text-white bg-black/40 px-3 py-1 rounded-full hover:bg-black/60 transition"
      >
        <FaArrowLeft /> <span className="hidden sm:inline">Home</span>
      </Link>

      {/* Video */}
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
        playsInline
        preload="metadata"
      />

      {/* Double-tap heart animation */}
      {showHeart && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <FaHeart className="text-white/80 text-6xl animate-ping" />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-black via-transparent to-transparent" />

      {/* Bottom Info */}
      <div className="absolute bottom-5 left-5 text-white max-w-[70%]">
        <div className="flex items-center gap-2">
          <img
            src={reel.owner.profilePhoto.url}
            alt={reel.owner.username}
            className="w-10 h-10 rounded-full border border-white"
          />
          <span className="font-bold text-lg">{reel.owner.username}</span>
        </div>
        <p className="mt-2 text-sm line-clamp-3">{reel.caption}</p>
      </div>

      {/* Right side actions */}
      <div className="absolute right-5 bottom-20 flex flex-col gap-6 text-white items-center">
        {/* Views */}
        <div className="flex flex-col items-center text-gray-300">
          <FaEye size={24} />
          <span className="text-xs">{reel.views?.length || 0}</span>
        </div>

        {/* Like */}
        <button
          onClick={handleLike}
          className={`flex flex-col items-center transition-transform ${isLiked ? "scale-125 text-red-500" : "hover:scale-110"}`}
        >
          <FaHeart size={26} />
          <span className="text-xs">{reel.likes?.length || 0}</span>
        </button>

        {/* Comment */}
        <button onClick={() => setShowComments(true)} className="flex flex-col items-center hover:scale-110 transition-transform">
          <FaRegCommentDots size={26} />
          <span className="text-xs">{reel.comments?.length || 0}</span>
        </button>

        {/* Share */}
        <button className="flex flex-col items-center hover:scale-110 transition-transform">
          <FaShareAlt size={26} />
        </button>

        {/* Delete */}
        {reel.owner._id === user?._id && (
          <button
            className="flex flex-col items-center text-red-500 hover:scale-110 transition-transform"
            onClick={() => deleteReel(reel._id)}
          >
            <FaTrash size={24} />
          </button>
        )}
      </div>

      {/* Mute/Unmute */}
      <button
        className="absolute top-5 right-5 bg-black/40 p-2 rounded-full text-white hover:bg-black/60 transition"
        onClick={() => setIsMuted(prev => !prev)}
      >
        {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-600 w-full">
        <div
          className="h-1 bg-white transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <CommentsPopup
        reelId={reel._id}
        isOpen={showComments}
        onClose={() => setShowComments(false)}
      />
    </div>
  );
});

ReelCard.displayName = "ReelCard";
export default ReelCard;
