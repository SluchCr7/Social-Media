'use client';
import React, { memo, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { HiUserPlus, HiUserMinus } from 'react-icons/hi2';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import { useGetData } from '@/app/Custome/useGetData';
import { useRouter } from 'next/navigation';
import MenuSkeleton from '../../Skeletons/MenuSkeleton';
import Link from 'next/link';

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

  const isFriend = following?.includes(user?._id) && followers?.includes(user?._id);

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

  const isFollowing = user?.following?.some((f) => f?._id === _id) || user?.following?.includes(_id);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
      className="group flex items-center justify-between p-3 rounded-[1.75rem] hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
    >
      {/* User Info */}
      <Link href={`/Pages/User/${_id}`} className="flex items-center gap-4 flex-1 min-w-0">
        <div className="relative shrink-0">
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="w-12 h-12 rounded-[1.25rem] overflow-hidden bg-gray-100 dark:bg-gray-800 ring-2 ring-white dark:ring-gray-900 shadow-sm"
          >
            <Image
              src={profilePhoto?.url || '/default-avatar.png'}
              alt={username}
              fill
              className="object-cover"
            />
          </motion.div>
          {isNew && (
            <span className="absolute -top-1 -right-1 bg-emerald-500 border-2 border-white dark:border-[#0B0F1A] rounded-full w-3.5 h-3.5 shadow-sm" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-gray-900 dark:text-gray-100 font-bold text-sm truncate">
            {username}
          </span>
          <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis">
            {statusMessage}
          </span>
        </div>
      </Link>

      {/* Action Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => handleFollow(_id)}
        className={`w-10 h-10 flex items-center justify-center rounded-2xl transition-all duration-300
          ${isFollowing
            ? "bg-rose-50 dark:bg-rose-500/10 text-rose-500"
            : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
          }`}
      >
        {isFollowing ? <HiUserMinus size={20} /> : <HiUserPlus size={20} />}
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
  const { userData } = useGetData(user?._id);

  const hasSuggestions = Array.isArray(users) && users?.length > 0;
  const handleFollow = useCallback((id) => followUser(id), [followUser]);

  return (
    <div className="w-full bg-white/50 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col overflow-hidden">
      {/* 🔮 Header */}
      <div className="px-7 pt-7 pb-4">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-pink-600 dark:bg-pink-500 rounded-full" />
          {t('New Creators')}
        </h2>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div key="skeleton" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <MenuSkeleton />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 p-4 pt-0"
          >
            {hasSuggestions ? (
              <div className="flex flex-col gap-1">
                {users
                  ?.filter((friend) =>
                    friend?._id !== userData?._id &&
                    !userData?.following?.some((f) => f?._id === friend?._id)
                  )
                  .slice(0, 4)
                  .map((userFriend, index) => (
                    <FriendCard
                      key={userFriend?._id}
                      userData={userFriend}
                      index={index}
                      user={userData}
                      userProfile={userProfile}
                      handleFollow={handleFollow}
                      t={t}
                    />
                  ))}

                {/* ✨ Expand Universe Button */}
                {users.length > 4 && (
                  <div className="px-3 py-4 mt-2 border-t border-gray-100 dark:border-white/5">
                    <motion.button
                      whileHover={{ x: 5 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => router.push('/Pages/Friends')}
                      className="text-[12px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all uppercase tracking-wide flex items-center gap-2"
                    >
                      {t('Discover all creators')}
                      <HiUserPlus className="text-sm" />
                    </motion.button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 dark:text-gray-500 text-xs font-bold text-center py-10 uppercase tracking-widest">
                {t('No suggestions for now')}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

MenuFriends.displayName = 'MenuFriends';
export default MenuFriends;
