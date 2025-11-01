'use client';
import React, { useRef, useState, useEffect, useCallback, useMemo } from "react";

const ProgressBar = ({ progress, duration, seek }) => {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);

  // 🧠 حساب النسبة والتوقيت الجديد
  const calculateTime = useCallback((clientX) => {
    const bar = barRef.current;
    if (!bar || !duration) return null;

    const { left, width } = bar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - left) / width));

    setLocalProgress(pct);
    return pct * duration;
  }, [duration]);

  // ✅ استخدام useCallback لتثبيت الدوال وتفادي re-renders
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

  // 🎧 إضافة/إزالة الأحداث عند السحب
  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => handleSeekMove(e.clientX);
    const handleTouchMove = (e) => handleSeekMove(e.touches[0].clientX);
    const handleMouseUp = (e) => handleSeekEnd(e.clientX);
    const handleTouchEnd = (e) => setIsDragging(false);

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

  // 🎯 حساب نسبة التقدم بثبات
  const progressPercent = useMemo(() => {
    const pct = isDragging ? localProgress : (progress / (duration || 1));
    return Math.max(0, Math.min(100, pct * 100));
  }, [isDragging, localProgress, progress, duration]);

  // 🕒 تحويل الوقت
  const formatTime = useCallback((time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, []);

  return (
    <div className="w-full select-none">
      <div
        ref={barRef}
        className="relative h-2 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer group"
        onMouseDown={(e) => handleSeekStart(e.clientX)}
        onTouchStart={(e) => handleSeekStart(e.touches[0].clientX)}
      >
        {/* الجزء المملوء */}
        <div
          style={{ width: `${progressPercent}%` }}
          className={`absolute h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-[width] duration-150 ease-linear`}
        />

        {/* النقطة */}
        <div
          style={{ left: `${progressPercent}%` }}
          className={`absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border border-indigo-500 shadow 
            ${isDragging ? 'block' : 'hidden group-hover:block'}`}
        />
      </div>

      {/* الوقت */}
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default React.memo(ProgressBar);
