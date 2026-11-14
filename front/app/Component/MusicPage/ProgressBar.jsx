'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";
import { motion } from 'framer-motion';

const ProgressBar = ({ progress = 0, duration = 0, seek }) => {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);
  const latestLocalProgress = useRef(0);

  const calculateTime = useCallback((clientX) => {
    const bar = barRef.current;
    if (!bar || !duration) return null;

    const { left, width } = bar.getBoundingClientRect();
    if (width <= 0) return null;
    const pct = Math.max(0, Math.min(1, (clientX - left) / width));

    latestLocalProgress.current = pct;
    setLocalProgress(pct);
    return pct * duration;
  }, [duration]);

  const handleSeekStart = useCallback((clientX) => {
    const newTime = calculateTime(clientX);
    setIsDragging(true);
    if (newTime != null && typeof seek === 'function') {
      seek(newTime);
    }
  }, [calculateTime, seek]);

  const handleSeekMove = useCallback((clientX) => {
    if (!isDragging) return;
    calculateTime(clientX);
  }, [isDragging, calculateTime]);

  const handleSeekEnd = useCallback((clientX) => {
    if (!isDragging) return;
    setIsDragging(false);
    const newTime = calculateTime(clientX);
    if (newTime != null && typeof seek === 'function') {
      seek(newTime);
    }
  }, [isDragging, calculateTime, seek]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => handleSeekMove(e.clientX);
    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) handleSeekMove(e.touches[0].clientX);
    };
    const handleMouseUp = (e) => handleSeekEnd(e.clientX);
    const handleTouchEnd = (e) => {
      const clientX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : null;
      if (clientX != null) {
        handleSeekEnd(clientX);
      } else {
        setIsDragging(false);
        if (typeof seek === 'function' && duration) {
          seek(latestLocalProgress.current * duration);
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isDragging, handleSeekMove, handleSeekEnd, seek, duration]);

  const progressPercent = useMemo(() => {
    const pct = isDragging ? localProgress : (progress / (duration || 1));
    return Math.max(0, Math.min(100, pct * 100));
  }, [isDragging, localProgress, progress, duration]);

  const displayCurrentTime = isDragging ? localProgress * (duration || 0) : progress;

  const formatTime = useCallback((time) => {
    if (isNaN(time) || time < 0 || !isFinite(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, []);

  return (
    <div className="w-full select-none space-y-2" dir="ltr">
      <div
        ref={barRef}
        className="relative py-2 -my-2 cursor-pointer group flex items-center"
        onMouseDown={(e) => handleSeekStart(e.clientX)}
        onTouchStart={(e) => {
          if (e.touches && e.touches[0]) handleSeekStart(e.touches[0].clientX);
        }}
      >
        {/* Track Base */}
        <div className="relative w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
          {/* Progress Fill */}
          <motion.div
            initial={false}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: "tween", duration: isDragging ? 0 : 0.1 }}
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full"
          />
        </div>

        {/* Tactile Handle */}
        <motion.div
          initial={false}
          animate={{ left: `${progressPercent}%` }}
          transition={{ type: "tween", duration: isDragging ? 0 : 0.1 }}
          className={`absolute w-3.5 h-3.5 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)] transform -translate-x-1/2 transition-opacity duration-200 ${
            isDragging ? 'opacity-100 scale-125' : 'opacity-0 group-hover:opacity-100'
          }`}
        />
      </div>

      <div className="flex justify-between items-center text-[10px] font-black font-mono text-white/40 tracking-widest">
        <span>{formatTime(displayCurrentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);
