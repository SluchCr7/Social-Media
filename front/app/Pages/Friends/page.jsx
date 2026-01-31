'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUserPlus, FiUserCheck, FiSearch } from 'react-icons/fi';
import { HiSparkles, HiUsers, HiMagnifyingGlass } from 'react-icons/hi2';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useGetData } from '@/app/Custome/useGetData';
import { useTranslation } from 'react-i18next';
import MenuSkeleton from '@/app/Skeletons/MenuSkeleton';

const SuggestedFriendsPage = () => {
  const { user, users } = useAuth();
  const { followUser } = useUser();
  const { userData, loading } = useGetData(user?._id);
  const { t } = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');

  const handleFollow = useCallback((id) => followUser(id), [followUser]);

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
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-[#0A0A0A] dark:via-[#0F0F0F] dark:to-[#0A0A0A] transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -40, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] rounded-full"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        {/* Header Section */}
        <div className="mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            {/* Title and Badge */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 dark:bg-indigo-500/10 border border-indigo-500/20 dark:border-indigo-500/10">
                  <HiUsers className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    {t("Discover Network")}
                  </span>
                </div>

                <div>
                  <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
                    <span className="bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 bg-clip-text text-transparent">
                      {t("Suggested")}
                    </span>{' '}
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                      {t("Friends")}
                    </span>
                  </h1>
                  <p className="text-sm md:text-base font-medium text-gray-500 dark:text-gray-400 max-w-2xl">
                    {t("Expand your network. Connect with creators, innovators, and friends across the platform.")}
                  </p>
                </div>
              </div>

              {/* Stats Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 shadow-lg backdrop-blur-xl"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                  <HiSparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="text-2xl font-black bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                    {suggestions.length}
                  </div>
                  <div className="text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    {t("Suggestions")}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="relative max-w-xl"
            >
              <div className="relative flex items-center bg-white dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 backdrop-blur-xl transition-all focus-within:border-indigo-500 dark:focus-within:border-indigo-500/50 focus-within:shadow-lg focus-within:shadow-indigo-500/10 group">
                <HiMagnifyingGlass className="w-5 h-5 text-gray-400 dark:text-gray-500 mr-3 group-focus-within:text-indigo-500 transition-colors" />
                <input
                  type="text"
                  placeholder={t("Search username...")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 font-medium"
                />
                {searchTerm && (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    onClick={() => setSearchTerm('')}
                    className="ml-2 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                  >
                    <span className="text-xs text-gray-400">✕</span>
                  </motion.button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Grid Content */}
        {loading ? (
          <MenuSkeleton />
        ) : (
          <AnimatePresence mode="wait">
            {suggestions.length > 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {suggestions.map((userFriend, index) => (
                  <UserCard
                    key={userFriend._id}
                    user={userFriend}
                    index={index}
                    handleFollow={handleFollow}
                    isFollowing={userData?.following?.some((f) => f?._id === userFriend?._id)}
                    t={t}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center py-32 text-center"
              >
                <div className="relative mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-3xl" />
                  <div className="relative w-24 h-24 rounded-3xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 flex items-center justify-center shadow-xl">
                    <HiSparkles className="w-12 h-12 text-gray-400 dark:text-gray-500" />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                  {t("No users found")}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm max-w-md">
                  {t("We couldn't find anyone matching that search. Try broadening your search.")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};

// ✅ Component: Premium User Card
const UserCard = ({ user, index, handleFollow, isFollowing, t }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group relative"
    >
      {/* Card Content */}
      <div className="relative p-6 rounded-3xl bg-white dark:bg-white/[0.02] border border-gray-200 dark:border-white/10 overflow-hidden flex flex-col items-center text-center h-full hover:border-indigo-500/50 dark:hover:border-indigo-500/30 transition-all duration-500 hover:shadow-xl hover:shadow-indigo-500/10 backdrop-blur-xl">

        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Avatar with Glow */}
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-gray-200 dark:border-white/10 group-hover:border-indigo-500/50 transition-all duration-500 shadow-lg">
            <Image
              src={user?.profilePhoto?.url || '/default-avatar.png'}
              alt={user.username}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
        </div>

        {/* Text Info */}
        <div className="relative z-10 flex-1 flex flex-col items-center w-full">
          <Link href={`/Pages/User/${user._id}`} className="block mb-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
              {user.username}
            </h3>
          </Link>
          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-6">
            {t('Creator')}
          </p>

          {/* Action Button */}
          <button
            onClick={() => handleFollow(user._id)}
            className={`
              mt-auto w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300
              flex items-center justify-center gap-2 shadow-lg
              ${isFollowing
                ? 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-red-50 dark:hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-500 hover:border-red-500/20'
                : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-105 active:scale-95'
              }
            `}
          >
            {isFollowing ? (
              <>
                <FiUserCheck size={14} />
                {t('Following')}
              </>
            ) : (
              <>
                <FiUserPlus size={14} />
                {t('Follow')}
              </>
            )}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default SuggestedFriendsPage;
