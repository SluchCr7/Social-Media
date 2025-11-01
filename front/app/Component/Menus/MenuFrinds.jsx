'use client';
import React, { memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { FiUserPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import { useGetData } from '@/app/Custome/useGetData';
import { useRouter } from 'next/navigation';

const FriendCard = memo(({ userData, index, user, userProfile, handleFollow, t }) => {
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

  const isNew = useMemo(() => {
    if (!createdAt) return false;
    const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return days < 7;
  }, [createdAt]);

  const myFollowing = useMemo(
    () => (Array.isArray(userProfile?.following) ? userProfile.following : []),
    [userProfile?.following]
  );

  const mutualFriends = useMemo(
    () => myFollowing.filter((id) => following.includes(id)),
    [myFollowing, following]
  );

  const statusMessage = useMemo(() => {
    if (isFriend) return t('You are friends');
    if (isNew) return t('New here – welcome!');
    if (mutualFriends.length > 0) return `${mutualFriends.length} ${t('mutual friends')}`;
    if (posts.length > 50) return t('Active member');
    return t('Suggested for you');
  }, [isFriend, isNew, mutualFriends, posts, t]);

  return (
    <motion.div
      key={_id}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 dark:hover:bg-[#1c1f24] transition-all rounded-xl group cursor-pointer"
    >
      {/* User Info */}
      <div className="flex items-center gap-3">
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <Image
            src={profilePhoto?.url || '/default-avatar.png'}
            alt={username}
            width={46}
            height={46}
            className="rounded-full w-11 h-11 object-cover border border-gray-200 dark:border-gray-600 shadow-sm"
          />
          {isNew && (
            <span className="absolute -bottom-1 -right-1 bg-green-500 border-2 border-white dark:border-[#16181c] rounded-full w-3 h-3" />
          )}
        </motion.div>

        <div className="flex flex-col">
          <span className="text-gray-900 dark:text-gray-100 font-semibold text-sm">
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
        whileHover={{ scale: 1.05 }}
        onClick={() => handleFollow(_id)}
        className="p-2 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-indigo-600 hover:to-blue-600 text-white shadow-md transition-all"
        aria-label="Follow"
      >
        <FiUserPlus size={18} />
      </motion.button>
    </motion.div>
  );
});

FriendCard.displayName = 'FriendCard';

const MenuFriends = memo(() => {
  const { user, users } = useAuth();
  const { followUser } = useUser();
  const { userData: userProfile, loading } = useGetData(user?._id);
  const { t } = useTranslation();
  const router = useRouter();

  const hasSuggestions = Array.isArray(users) && users.length > 0;
  const handleFollow = useCallback((id) => followUser(id), [followUser]);

  // ✅ Skeleton loader
  if (loading) {
    return (
      <div className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-lg p-6 space-y-4 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-11 h-11 bg-gray-300 dark:bg-gray-700 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3" />
              <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 90, damping: 16 }}
      className="w-full max-w-sm bg-white dark:bg-[#16181c] rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col max-h-[520px] overflow-hidden"
    >
      {/* Header */}
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600">
        <h2 className="text-white font-semibold text-lg tracking-wide flex items-center gap-2">
          💫 {t('Friends Recommendations')}
        </h2>
      </div>

      {/* Friends List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-thumb-rounded-full p-1">
        {hasSuggestions ? (
          <>
            {users.slice(0, 3).map((userData, index) => (
              <FriendCard
                key={userData._id}
                userData={userData}
                index={index}
                user={user}
                userProfile={userProfile}
                handleFollow={handleFollow}
                t={t}
              />
            ))}

            {/* Enhanced "Show All" Button */}
            {users.length > 3 && (
              <motion.div
                className="px-5 mt-2 mb-4 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: '0 4px 14px rgba(59,130,246,0.4)',
                  }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => router.push('/Pages/Friends')}
                  className="relative px-5 py-2 font-semibold rounded-full text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-md transition-all duration-300 overflow-hidden group"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative z-10">{t('Show All Users')}</span>
                </motion.button>
              </motion.div>
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

MenuFriends.displayName = 'MenuFriends';
export default MenuFriends;
