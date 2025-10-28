'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { FaUserPlus, FaEnvelope } from 'react-icons/fa';

const StickyProfileBar = ({ user, isOwner, isFollowing, onFollow, onUnfollow }) => {
  const [showBar, setShowBar] = useState(false);

  // 🧠 منطق إظهار الشريط عند اختفاء الهيدر
  useEffect(() => {
    const handleScroll = () => {
      const header = document.getElementById('profile-header');
      if (!header) return;
      const headerBottom = header.getBoundingClientRect().bottom;
      setShowBar(headerBottom < 0); // لو خرج الهيدر من الشاشة
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!showBar || !user) return null;

  return (
    <motion.div
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -80, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full z-[1000]
                 bg-lightMode-bg/90 dark:bg-darkMode-bg/90 
                 backdrop-blur-xl border-b border-white/10 
                 shadow-md flex items-center justify-between px-4 sm:px-8 py-2"
    >
      {/* يسار: الصورة والاسم */}
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-300 dark:border-gray-600">
          <Image
            src={user?.profilePhoto?.url || '/default-avatar.png'}
            alt={user?.username}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="text-sm sm:text-base font-semibold text-lightMode-text dark:text-darkMode-text">
            {user?.username}
          </h3>
          {user?.bio && (
            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
              {user.bio}
            </p>
          )}
        </div>
      </div>

      {/* يمين: الأزرار */}
      {!isOwner && (
        <div className="flex items-center gap-2">
          <button
            onClick={isFollowing ? onUnfollow : onFollow}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all shadow 
              ${isFollowing
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100'
                : 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white hover:opacity-90'}
            `}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default StickyProfileBar;
