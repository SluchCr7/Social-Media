import React, { useRef, useState, useEffect } from "react";

const ProgressBar = ({ progress, duration, seek }) => {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);

  // 🧠 دالة لحساب الوقت الجديد بناءً على موضع المستخدم
  const calculateTime = (clientX) => {
    if (!barRef.current || !duration) return null;
    const rect = barRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const newTime = pct * duration;
    setLocalProgress(pct);
    return newTime;
  };

  // 🖱️ عند الضغط بالماوس
  const handleMouseDown = (e) => {
    const newTime = calculateTime(e.clientX);
    if (newTime !== null) {
      seek(newTime);
      setIsDragging(true);
    }
  };

  // 📱 عند بدء اللمس على الجوال
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const newTime = calculateTime(touch.clientX);
    if (newTime !== null) {
      seek(newTime);
      setIsDragging(true);
    }
  };

  // 🔁 أثناء السحب بالماوس
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newTime = calculateTime(e.clientX);
    if (newTime !== null) seek(newTime);
  };

  // 🔁 أثناء السحب باللمس
  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    const newTime = calculateTime(touch.clientX);
    if (newTime !== null) seek(newTime);
  };

  // 🖱️ عند إفلات الماوس
  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const newTime = calculateTime(e.clientX);
    if (newTime !== null) seek(newTime);
  };

  // 📱 عند انتهاء اللمس
  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
  };

  // 🎧 إضافة/إزالة Listeners أثناء السحب
  useEffect(() => {
    if (!isDragging) return;

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
  }, [isDragging]);

  // ⏱️ نسبة التقدم
  const progressPercent = isDragging
    ? localProgress * 100
    : (progress / (duration || 1)) * 100;

  // 🕒 تحويل الوقت إلى صيغة دقيقة:ثانية
  const formatTime = (time) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="w-full select-none">
      <div
        ref={barRef}
        className="relative h-2 bg-gray-300 dark:bg-gray-700 rounded-full cursor-pointer group"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* الجزء المملوء */}
        <div
          style={{ width: `${progressPercent}%` }}
          className="absolute h-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-500 transition-all"
        />

        {/* النقطة الصغيرة */}
        <div
          style={{ left: `${progressPercent}%` }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white border border-indigo-500 shadow hidden group-hover:block"
        />
      </div>

      {/* الوقت أسفل الشريط */}
      <div className="flex justify-between text-xs text-gray-400 mt-1">
        <span>{formatTime(progress)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
};

export default ProgressBar;
