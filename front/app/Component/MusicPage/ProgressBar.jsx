import React, { useRef, useState } from "react";

const ProgressBar = ({ progress, duration, seek }) => {
  const barRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localProgress, setLocalProgress] = useState(0);

  const handleSeek = (e) => {
    if (!barRef.current || !duration) return;

    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, x / rect.width));
    const newTime = pct * duration;
    setLocalProgress(pct);
    return newTime;
  };

  const handleMouseDown = (e) => {
    const newTime = handleSeek(e);
    if (newTime !== undefined) {
      setIsDragging(true);
      seek(newTime);
    }
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const newTime = handleSeek(e);
    if (newTime !== undefined) seek(newTime);
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    setIsDragging(false);
    const newTime = handleSeek(e);
    if (newTime !== undefined) seek(newTime);
  };

  const progressPercent = isDragging
    ? localProgress * 100
    : (progress / (duration || 1)) * 100;

  return (
    <div
      ref={barRef}
      className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-gray-700 relative cursor-pointer"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={() => setIsDragging(false)}
    >
      <div
        style={{
          width: `${progressPercent}%`,
        }}
        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all shadow-[0_0_10px_rgba(99,102,241,0.45)]"
      />
    </div>
  );
};

export default ProgressBar;
