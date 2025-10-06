'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { IoClose } from 'react-icons/io5';
import { FaPlay, FaMusic } from 'react-icons/fa';

const MusicCard = ({ music }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* 🎵 بطاقة الموسيقى */}
      <motion.div
        onClick={() => setShowModal(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.97 }}
        className="relative flex flex-col items-center bg-gradient-to-br from-indigo-500/10 to-purple-600/10
                   dark:from-gray-800/60 dark:to-gray-900/50 rounded-2xl p-4 cursor-pointer
                   border border-white/10 shadow-md hover:shadow-lg transition-all duration-300"
      >
        {/* غلاف الموسيقى */}
        <div className="relative group">
          <motion.div
            whileHover={{ rotate: 3 }}
            transition={{ duration: 0.3 }}
            className="relative"
          >
            <Image
              src={music?.cover || '/default_music_cover.jpg'}
              alt={music?.name || 'Music Cover'}
              width={140}
              height={140}
              className="rounded-full object-cover aspect-square border border-white/10 shadow-inner"
            />

            {/* زر التشغيل */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm rounded-full
                         transition-opacity"
            >
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
                className="bg-indigo-500/70 rounded-full w-12 h-12 flex items-center justify-center text-white shadow-lg"
              >
                <FaPlay className="text-lg ml-1" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* الاسم */}
        <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-100 truncate w-full text-center">
          {music?.title || 'Unknown Track'}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{music?.artist || 'Unknown Artist'}</p>
      </motion.div>

      {/* 🎧 نافذة التفاصيل */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              className="relative bg-white/10 dark:bg-gray-900/80 backdrop-blur-2xl border border-white/20 
                         rounded-3xl p-6 sm:p-8 w-[90%] sm:w-[420px] shadow-2xl text-center overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {/* خلفية متحركة */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
              />

              {/* زر الإغلاق */}
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-3 right-3 text-gray-300 hover:text-white transition"
              >
                <IoClose size={24} />
              </button>

              {/* غلاف الموسيقى */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Image
                  src={music?.cover || '/default_music_cover.jpg'}
                  alt={music?.name || 'Music Cover'}
                  width={220}
                  height={220}
                  className="rounded-2xl mx-auto object-cover border border-white/20 shadow-xl"
                />
              </motion.div>

              {/* التفاصيل */}
              <div className="mt-6 space-y-1">
                <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
                  <FaMusic className="text-indigo-400" /> {music?.title || 'Unknown Track'}
                </h2>
                <p className="text-sm text-gray-300">{music?.artist || 'Unknown Artist'}</p>
                {music?.album && (
                  <p className="text-xs text-gray-400 italic">Album: {music.album}</p>
                )}
              </div>

              {/* مشغل الصوت */}
              {music?.url ? (
                <audio
                  controls
                  src={music.url}
                  className="mt-6 w-full rounded-lg bg-white/10 border border-white/20"
                  style={{ accentColor: '#6366f1' }}
                />
              ) : (
                <p className="text-sm text-gray-400 mt-6 italic">No audio available</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default MusicCard;
