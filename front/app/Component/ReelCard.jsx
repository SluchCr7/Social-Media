import React, { forwardRef, useRef, useEffect, useState } from 'react';
import { useReels } from '../Context/ReelsContext';
import { useAuth } from '../Context/AuthContext';

const ReelCard = forwardRef(({ reel }, ref) => {
  const videoRef = useRef(null);
  const { user } = useAuth();
  const { deleteReel } = useReels();
  const [isMuted, setIsMuted] = useState(true);

  // autoplay & pause عند ظهور/اختفاء الفيديو
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (videoRef.current) {
          if (entry.isIntersecting) videoRef.current.play();
          else videoRef.current.pause();
        }
      },
      { threshold: 0.6 }
    );
    if (videoRef.current) observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative w-full h-screen flex flex-col justify-end bg-black">
      <video
        ref={videoRef}
        src={reel.videoUrl}
        className="w-full h-full object-cover"
        loop
        muted={isMuted}
      />

      {/* Overlay Info */}
      <div className="absolute bottom-5 left-5 text-white max-w-[70%]">
        <div className="flex items-center gap-2">
          <img
            src={reel.owner.profilePhoto}
            alt={reel.owner.username}
            className="w-10 h-10 rounded-full border border-white"
          />
          <span className="font-bold">{reel.owner.username}</span>
        </div>
        <p className="mt-2 text-sm">{reel.caption}</p>
      </div>

      {/* Right side actions */}
      <div className="absolute right-5 bottom-20 flex flex-col gap-6 text-white">
        <button className="flex flex-col items-center">
          ❤️ {reel.likes?.length || 0}
        </button>
        <button className="flex flex-col items-center">
          💬 {reel.comments?.length || 0}
        </button>
        <button className="flex flex-col items-center">🔗</button>
        {reel.owner._id === user?._id && (
          <button
            className="flex flex-col items-center text-red-500"
            onClick={() => deleteReel(reel._id)}
          >
            🗑️
          </button>
        )}
        <button
          className="flex flex-col items-center"
          onClick={() => setIsMuted(prev => !prev)}
        >
          {isMuted ? '🔇' : '🔊'}
        </button>
      </div>
    </div>
  );
});

export default ReelCard;
