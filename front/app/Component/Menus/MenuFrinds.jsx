'use client';
import React, { memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { FiUserPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import { useGetData } from '@/app/Custome/useGetData';

const MenuFriends = memo(() => {
  const { user } = useAuth();
  const { suggestedUsers, followUser, setShowAllSuggestedUsers } = useUser();
  const { userData: userProfile } = useGetData(user?._id);
  const { t } = useTranslation();

  const hasSuggestions = Array.isArray(suggestedUsers) && suggestedUsers.length > 0;

  const handleFollow = useCallback(
    (id) => followUser(id),
    [followUser]
  );

  const handleShowAll = useCallback(() => {
    setShowAllSuggestedUsers(true);
  }, [setShowAllSuggestedUsers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 18 }}
      className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col max-h-[500px] overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-500 to-indigo-500">
        <h2 className="text-white font-semibold text-lg">{t('Friends Recommendations')}</h2>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-thumb-rounded-full">
        {hasSuggestions ? (
          <>
            {suggestedUsers.slice(0, 3).map((userData, index) => {
              const {
                _id,
                username,
                profilePhoto,
                following = [],
                followers = [],
                posts = [],
                createdAt,
              } = userData;

              const isFriend = following.includes(user?._id) && followers.includes(user?._id);

              const isNew = (() => {
                if (!createdAt) return false;
                const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
                return days < 7;
              })();

              const myFollowing = Array.isArray(userProfile?.following)
                ? userProfile.following
                : [];
              const mutualFriends = myFollowing.filter((id) => following.includes(id));

              const statusMessage = (() => {
                if (isFriend) return t('You are friends');
                if (isNew) return t('New here – welcome!');
                if (mutualFriends.length > 0)
                  return `${mutualFriends.length} ${t('mutual friends')}`;
                if (posts.length > 50) return t('Active member');
                return t('Suggested for you');
              })();


              return (
                <motion.div
                  key={_id}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.08 }}
                  className="flex items-center justify-between px-5 py-3 hover:bg-gray-100 dark:hover:bg-[#1f2124] transition-all rounded-xl group cursor-pointer"
                >
                  {/* User Info */}
                  <div className="flex items-center gap-3">
                    <Image
                      src={profilePhoto?.url || '/default-avatar.png'}
                      alt={username}
                      width={42}
                      height={42}
                      className="rounded-full border border-gray-300 dark:border-gray-600 group-hover:scale-105 transition-transform duration-200 shadow"
                    />
                    <div className="flex flex-col">
                      <span className="text-gray-800 dark:text-gray-100 font-medium text-sm">
                        {username}
                      </span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">
                        {statusMessage}
                      </span>
                    </div>
                  </div>

                  {/* Follow Button */}
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleFollow(_id)}
                    className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow transition"
                    aria-label="Follow"
                  >
                    <FiUserPlus size={18} />
                  </motion.button>
                </motion.div>
              );
            })}

            {suggestedUsers.length > 3 && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleShowAll}
                className="w-[90%] mx-auto my-3 py-2 font-semibold text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg transition-all duration-300 hover:bg-blue-600 hover:text-white"
              >
                {t('Show All Users')}
              </motion.button>
            )}
          </>
        ) : (
          <div className="text-gray-400 text-sm px-5 py-6 text-center">
            {t('No friends to show')}
          </div>
        )}
      </div>
    </motion.div>
  );
});
MenuFriends.displayName = 'MenuFriends'

export default MenuFriends;
