'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, duration, seek }) => {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);

  const calculateTime = useCallback((clientX) => {
    const bar = barRef.current;
    if (!bar || !duration) return null;

    const { left, width } = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - left) / width));

    setLocalProgress(pct);
    return pct * duration;
  }, [duration]);

  const handleSeekStart = useCallback((clientX) => {
    const newTime = calculateTime(clientX);
    if (newTime != null) {
      seek(newTime);
      setIsDragging(true);
    }
  }, [calculateTime, seek]);

  const handleSeekMove = useCallback((clientX) => {
    if (!isDragging) return;
    const newTime = calculateTime(clientX);
    if (newTime != null) seek(newTime);
  }, [isDragging, calculateTime, seek]);

  const handleSeekEnd = useCallback((clientX) => {
    if (!isDragging) return;
    setIsDragging(false);
    const newTime = calculateTime(clientX);
    if (newTime != null) seek(newTime);
  }, [isDragging, calculateTime, seek]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => handleSeekMove(e.clientX);
    const handleTouchMove = (e) => handleSeekMove(e.touches[0].clientX);
    const handleMouseUp = (e) => handleSeekEnd(e.clientX);
    const handleTouchEnd = () => setIsDragging(false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove);
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleSeekMove, handleSeekEnd]);

  const progressPercent = useMemo(() => {
    const pct = isDragging ? localProgress : (progress / (duration || 1));
    return Math.max(0, Math.min(100, pct * 100));
  }, [isDragging, localProgress, progress, duration]);

  const formatTime = useCallback((time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, []);

  return (
    <div className="w-full select-none space-y-2">
      <div
        ref={barRef}
        className="relative h-1.5 bg-white/5 rounded-full cursor-pointer group flex items-center"
        onMouseDown={(e) => handleSeekStart(e.clientX)}
        onTouchStart={(e) => handleSeekStart(e.touches[0].clientX)}
      >
        {/* Track Base */}
        <div className="absolute inset-0 bg-white/[0.05] rounded-full overflow-hidden">
          {/* Progress Fill */}
          <motion.div
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
          />
        </div>

        {/* Tactile Handle */}
        <motion.div
          initial={false}
          animate={{ left: `${progressPercent}%` }}
          className={`absolute w-4 h-4 rounded-full bg-white shadow-[0_0_15px_rgba(255,255,255,0.5)] transform -translate-x-1/2 transition-opacity duration-300 ${isDragging ? 'opacity-100 scale-110' : 'opacity-0 group-hover:opacity-100'}`}
        />
      </div>

      <div className="flex justify-between">
        <span className="text-[10px] font-black font-mono text-white/30 tracking-widest">{formatTime(progress)}</span>
        <span className="text-[10px] font-black font-mono text-white/30 tracking-widest">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);
