'use client';
import React, { memo, useMemo } from 'react';
import Image from 'next/image';
import { useAuth } from '../../Context/AuthContext';
import { FiX, FiUserPlus, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';

const MenuAllSuggestedFriends = memo(() => {
  const { user , users } = useAuth();
  const { t } = useTranslation();
  const { setShowAllSuggestedUsers, suggestedUsers, followUser, showAllSuggestedUsers } = useUser();

  // تحسين الأداء — استخدم useMemo لحساب المستخدمين المقترحين فقط عند التغيير
  const computedSuggestedUsers = useMemo(() => users || [], [users]);

  return (
    <AnimatePresence>
      {showAllSuggestedUsers && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999] flex items-start justify-center backdrop-blur-md bg-black/40 p-4 md:p-6"
        >
          {/* Modal Container */}
          <motion.div
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="w-full max-w-2xl bg-white/70 dark:bg-[#101217]/80 backdrop-blur-xl border border-gray-300/30 dark:border-gray-700/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-200/50 dark:border-gray-700/50 px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-600">
              <h2 className="text-lg md:text-xl font-bold text-white tracking-wide drop-shadow-sm">
                {t('Suggested Friends')}
              </h2>
              <button
                onClick={() => setShowAllSuggestedUsers(false)}
                className="text-white/80 hover:text-red-400 transition"
              >
                <FiX size={24} />
              </button>
            </div>

            {/* Suggested Users List */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-thumb-rounded-full px-3 py-2">
              {computedSuggestedUsers.length > 0 ? (
                <AnimatePresence>
                  {computedSuggestedUsers.map((userData) => {
                    const isFriend =
                      userData?.following?.includes(user?._id) &&
                      userData?.followers?.includes(user?._id);

                    const myFollowing = Array.isArray(user?.following) ? user?.following : [];
                    const hisFollowing = Array.isArray(userData?.following) ? userData?.following : [];
                    const mutualFriends = myFollowing.filter((id) => hisFollowing.includes(id));

                    const createdAt = userData?.createdAt ? new Date(userData?.createdAt) : null;
                    const isNew =
                      createdAt &&
                      (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24) < 7;

                    const posts = Array.isArray(userData.posts) ? userData.posts : [];

                    const statusMessage = isFriend
                      ? t('You are friends')
                      : isNew
                      ? t('New here – welcome!')
                      : mutualFriends.length > 0
                      ? `${mutualFriends.length} ${t('mutual friends')}`
                      : posts.length > 50
                      ? t('Active member')
                      : t('Suggested for you');

                    return (
                      <motion.div
                        key={userData._id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/60 dark:bg-[#181a1e]/60 hover:bg-white/90 dark:hover:bg-[#1f2124]/80 transition-all backdrop-blur-md shadow-sm hover:shadow-md cursor-pointer group"
                      >
                        {/* User Info */}
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <Image
                              src={userData?.profilePhoto?.url || '/default-avatar.png'}
                              alt={userData?.username}
                              width={48}
                              height={48}
                              loading="lazy"
                              className="rounded-full border border-gray-200 dark:border-gray-600 object-cover group-hover:scale-105 transition-transform"
                            />
                            {isNew && (
                              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-[#101217]"></span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
                              {userData?.username}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              {statusMessage}
                            </span>
                          </div>
                        </div>

                        {/* Follow Button */}
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => followUser(userData?._id)}
                          className={`flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                            isFriend
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isFriend ? <FiCheck size={16} /> : <FiUserPlus size={16} />}
                          {isFriend ? t('Following') : t('Follow')}
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              ) : (
                <div className="flex flex-col items-center justify-center py-14 text-gray-500 dark:text-gray-400">
                  <Image
                    src="/empty-state.svg"
                    alt="No users"
                    width={120}
                    height={120}
                    className="mb-5 opacity-70"
                  />
                  <p className="text-sm">{t('No suggested users at the moment.')}</p>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
});
MenuAllSuggestedFriends.displayName = 'MenuAllSuggestedFriends'

export default MenuAllSuggestedFriends;
