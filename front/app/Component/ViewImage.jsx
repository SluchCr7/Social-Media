'use client';

import React, { useEffect, useRef, useState } from 'react';
import { IoClose, IoDownloadOutline } from 'react-icons/io5';
import { motion, AnimatePresence } from 'framer-motion';

const ViewImage = ({ imageView, setImageView }) => {
  const videoRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageView) return;

    // Lock body scroll
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    // Close on Escape key press
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setImageView(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalStyle;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [imageView, setImageView]);

  if (!imageView) return null;

  const isVideo =
    imageView.type === 'video' ||
    (typeof imageView.url === 'string' &&
      (imageView.url.endsWith('.mp4') ||
        imageView.url.endsWith('.webm') ||
        imageView.url.includes('/video/upload/')));

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setImageView(null)}
        className="fixed inset-0 z-[100000] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 select-none"
      >
        {/* Top Floating Control Bar */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 flex items-center gap-3 z-[100001]">
          {imageView.url && (
            <a
              href={imageView.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              onClick={(e) => e.stopPropagation()}
              className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/10 hover:scale-105 shadow-xl"
              title="Download Media"
            >
              <IoDownloadOutline size={22} />
            </a>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setImageView(null);
            }}
            className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white flex items-center justify-center transition-all border border-white/10 hover:scale-105 shadow-xl"
            title="Close Viewer"
          >
            <IoClose size={26} />
          </button>
        </div>

        {/* Media Frame */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 28, stiffness: 320 }}
          onClick={(e) => e.stopPropagation()}
          className="relative max-w-5xl max-h-[88vh] w-full flex items-center justify-center rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/10 bg-black/60"
        >
          {isVideo ? (
            <div className="relative w-full h-full flex items-center justify-center bg-black">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                  <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              )}
              <video
                ref={videoRef}
                src={imageView.url}
                className="max-w-full max-h-[88vh] w-auto h-auto object-contain rounded-2xl outline-none"
                controls
                autoPlay
                playsInline
                onLoadedData={() => setIsLoading(false)}
                onWaiting={() => setIsLoading(true)}
                onPlaying={() => setIsLoading(false)}
              />
            </div>
          ) : (
            <div className="relative w-full h-full flex items-center justify-center bg-black/40 p-2">
              <img
                src={imageView.url}
                alt="Media Preview"
                className="max-w-full max-h-[88vh] w-auto h-auto object-contain rounded-2xl shadow-2xl"
              />
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ViewImage;