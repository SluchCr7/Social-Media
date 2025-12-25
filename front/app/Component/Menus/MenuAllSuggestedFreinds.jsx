'use client';
import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import { useAuth } from '../../Context/AuthContext';
import { HiXMark, HiUserPlus, HiCheckBadge } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';

const MenuAllSuggestedFriends = memo(() => {
  const { user, users } = useAuth();
  const { t } = useTranslation();
  const { setShowAllSuggestedUsers, followUser, showAllSuggestedUsers } = useUser();

  const computedSuggestedUsers = useMemo(() => users || [], [users]);

  return (
    <AnimatePresence>
      {showAllSuggestedUsers && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 md:p-6"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAllSuggestedUsers(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xl"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-xl bg-white/80 dark:bg-[#0B0F1A]/80 backdrop-blur-3xl border border-white/20 dark:border-white/5 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[85vh]"
          >
            {/* 💎 Header */}
            <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 dark:border-white/5">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                <span className="w-2.5 h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />
                {t('Discover Minds')}
              </h2>
              <button
                onClick={() => setShowAllSuggestedUsers(false)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-rose-500 transition-all"
              >
                <HiXMark size={24} />
              </button>
            </div>

            {/* Suggested Users List */}
            <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar">
              {computedSuggestedUsers.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {computedSuggestedUsers.map((userData, idx) => {
                    const isFollowing = user?.following?.some((f) => f?._id === userData?._id) || user?.following?.includes(userData?._id);

                    const createdAt = userData?.createdAt ? new Date(userData?.createdAt) : null;
                    const isNew = createdAt && (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24) < 7;

                    return (
                      <motion.div
                        key={userData._id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        className="group flex items-center justify-between p-4 rounded-[2rem] hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
                      >
                        {/* User Info */}
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          <div className="relative shrink-0">
                            <div className="w-14 h-14 rounded-[1.5rem] overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-md transition-transform duration-500 group-hover:scale-110 bg-gray-100 dark:bg-gray-800">
                              <Image
                                src={userData?.profilePhoto?.url || '/default-avatar.png'}
                                alt={userData?.username}
                                fill
                                className="object-cover"
                              />
                            </div>
                            {isNew && (
                              <span className="absolute -top-1 -right-1 bg-emerald-500 border-4 border-white dark:border-[#0B0F1A] rounded-full w-5 h-5 shadow-sm" />
                            )}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-gray-900 dark:text-gray-100 font-bold text-base truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                              {userData?.username}
                            </span>
                            <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5 truncate">
                              {userData?.profileName || `@${userData?.username}`}
                            </span>
                          </div>
                        </div>

                        {/* Action Button */}
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => followUser(userData?._id)}
                          className={`flex items-center gap-2 px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm ${isFollowing
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900'
                            }`}
                        >
                          {isFollowing ? <HiCheckBadge size={16} /> : <HiUserPlus size={16} />}
                          {isFollowing ? t('Following') : t('Connect')}
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="w-20 h-20 rounded-[2.5rem] bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-6">
                    <HiUserPlus className="text-gray-300 dark:text-gray-700 text-4xl" />
                  </div>
                  <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest leading-relaxed">
                    {t('No minds found in this sector.')}
                  </p>
                </div>
              )}
            </div>

            <div className="px-8 py-6 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-white/[0.02] text-center">
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em]">
                Zocial Neural Explorer &bull; {new Date().getFullYear()}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

MenuAllSuggestedFriends.displayName = 'MenuAllSuggestedFriends'
export default MenuAllSuggestedFriends;
