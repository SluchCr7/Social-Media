import React, { useRef, useState, useEffect } from "react";

const ProgressBar = ({ progress, duration, seek }) => {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);

  const handleSeek = (clientX) => {
    if (!barRef.current || !duration) return;

    const rect = barRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const newTime = pct * duration;
    setLocalProgress(pct);
    return newTime;
  };

  const handleMouseDown = (e) => {
    const newTime = handleSeek(e.clientX);
    if (newTime !== undefined) {
      setIsDragging(true);
      seek(newTime);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newTime = handleSeek(e.clientX);
    if (newTime !== undefined) seek(newTime);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const newTime = handleSeek(e.clientX);
    if (newTime !== undefined) seek(newTime);
  };

  // 🔹 إضافة listeners على window أثناء السحب
  useEffect(() => {
    if (!isDragging) return;

    const onMouseMove = (e) => handleMouseMove(e);
    const onMouseUp = (e) => handleMouseUp(e);

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  const progressPercent = isDragging
    ? localProgress * 100
    : (progress / (duration || 1)) * 100;

  return (
    <div
      ref={barRef}
      className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 relative cursor-pointer"
      onMouseDown={handleMouseDown}
    >
      <div
        style={{ width: `${progressPercent}%` }}
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all shadow-[0_0_10px_rgba(99,102,241,0.45)]"
      />
    </div>
  );
};

export default ProgressBar;
