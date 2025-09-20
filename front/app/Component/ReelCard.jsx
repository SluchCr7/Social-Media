'use client';

import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { useReels } from '../Context/ReelsContext';
import { useAuth } from '../Context/AuthContext';
import {
  FaHeart,
  FaRegCommentDots,
  FaShareAlt,
  FaTrash,
  FaVolumeMute,
  FaVolumeUp,
  FaEye
} from "react-icons/fa";

const ReelCard = forwardRef(({ reel }, ref) => {
  const videoRef = useRef(null);
  const { user } = useAuth();
  const { deleteReel } = useReels();
  const [isMuted, setIsMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoEl.play().catch(() => {});
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
  }, []);

  // تحديث progress bar
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

  return (
    <div ref={ref} className="relative w-full h-screen flex flex-col justify-end bg-black overflow-hidden">
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
        <p className="mt-2 text-sm">{reel.caption}</p>
      </div>

      {/* Right side actions */}
      <div className="absolute right-5 bottom-20 flex flex-col gap-6 text-white items-center">
        {/* Views */}
        <div className="flex flex-col items-center text-gray-300">
          <FaEye size={24} />
          <span className="text-xs">{reel.views || 0}</span>
        </div>

        {/* Like */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className={`flex flex-col items-center transition-transform ${isLiked ? "scale-125 text-red-500" : "hover:scale-110"}`}
        >
          <FaHeart size={26} />
          <span className="text-xs">{reel.likes?.length || 0}</span>
        </button>

        {/* Comment */}
        <button className="flex flex-col items-center hover:scale-110 transition-transform">
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

        {/* Mute/Unmute */}
        <button
          className="flex flex-col items-center hover:scale-110 transition-transform"
          onClick={() => setIsMuted(prev => !prev)}
        >
          {isMuted ? <FaVolumeMute size={24} /> : <FaVolumeUp size={24} />}
        </button>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 h-1 bg-gray-600 w-full">
        <div
          className="h-1 bg-white transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
});

ReelCard.displayName = "ReelCard";

export default ReelCard;
