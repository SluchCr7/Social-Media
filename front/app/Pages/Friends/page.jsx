'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUserPlus, FiUserCheck } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useGetData } from '@/app/Custome/useGetData';
import { useTranslation } from 'react-i18next';
import { FaSearch } from 'react-icons/fa';
import MenuSkeleton from '@/app/Skeletons/MenuSkeleton';

const SuggestedFriendsPage = () => {
  const { user, users } = useAuth();
  const { followUser } = useUser();
  const { userData, loading } = useGetData(user?._id);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');

  const handleFollow = useCallback((id) => followUser(id), [followUser]);

  // 🔍 تصفية الأصدقاء حسب الاسم
  const suggestions = useMemo(() => {
    if (!Array.isArray(users)) return [];
    const base = users.filter(
      (friend) =>
        friend?._id !== userData?._id &&
        !userData?.following?.some((f) => f?._id === friend?._id)
    );
    if (!searchTerm.trim()) return base;
    return base.filter((f) =>
      f.username?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, userData, searchTerm]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen w-full px-4 sm:px-6 md:px-12 py-10 
                 bg-gradient-to-b from-lightMode-bg to-lightMode-menu 
                 dark:from-darkMode-bg dark:to-darkMode-menu 
                 text-lightMode-text dark:text-darkMode-text"
    >
      {/* HEADER */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-5">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t('Friends Recommendations')}
          </h1>
          <p className="text-sm opacity-80 mt-1">
            {t('Discover amazing people to follow and expand your community.')}
          </p>
        </div>

        {/* 🔍 Search */}
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder={t('Search for users...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl 
                       bg-white/10 dark:bg-black/30 
                       border border-white/10 
                       focus:ring-2 focus:ring-blue-500 
                       outline-none placeholder:text-sm transition"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <MenuSkeleton />
      ) : (
        <AnimatePresence>
          {suggestions.length > 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {suggestions.map((userFriend, index) => (
                <motion.div
                  key={userFriend._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  whileHover={{
                    y: -4,
                    scale: 1.02,
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
                  }}
                  className="p-5 rounded-2xl 
                             bg-white/60 dark:bg-[#1a1c21]/60 
                             backdrop-blur-lg border border-white/10 
                             hover:border-blue-400/40 transition-all 
                             flex flex-col items-center text-center shadow-md"
                >
                  {/* Profile image */}
                  <div className="relative mb-3">
                    <Image
                      src={userFriend?.profilePhoto?.url || '/default-avatar.png'}
                      alt={userFriend.username}
                      width={80}
                      height={80}
                      className="rounded-full w-20 h-20 object-cover 
                                 border-2 border-white dark:border-gray-700 shadow"
                    />
                  </div>

                  {/* Info */}
                  <Link
                    href={`/Pages/User/${userFriend._id}`}
                    className="text-base font-semibold hover:text-blue-600 transition"
                  >
                    {userFriend.username}
                  </Link>

                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t('Suggested for you')}
                  </p>

                  {/* Follow Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => handleFollow(userFriend._id)}
                    className={`mt-4 px-4 py-2 rounded-full text-sm font-medium text-white shadow transition-all duration-300 ${
                      userData?.following?.some((f) => f?._id === userFriend?._id)
                        ? 'bg-gradient-to-r from-red-500 to-pink-600 hover:from-pink-600 hover:to-red-500'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600'
                    }`}
                  >
                    {userData?.following?.some((f) => f?._id === userFriend?._id) ? (
                      <span className="flex items-center gap-1">
                        <FiUserCheck /> {t('Following')}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <FiUserPlus /> {t('Follow')}
                      </span>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 rounded-3xl 
                         bg-white/5 dark:bg-black/20 backdrop-blur-lg text-center"
            >
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-xl font-semibold">{t('No friend suggestions')}</h3>
              <p className="text-gray-500 text-sm mt-2">
                {t('You are all caught up for now!')}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
};

export default SuggestedFriendsPage;
