'use client';
import React, { memo, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { HiUserPlus, HiSparkles } from 'react-icons/hi2';
import { FaUserCheck } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useTranslation } from 'react-i18next';
import { useGetData } from '@/app/Custome/useGetData';
import { useRouter } from 'next/navigation';
import MenuSkeleton from '../../Skeletons/MenuSkeleton';
import Link from 'next/link';

const FriendCard = memo(({ userData, statusMessage, isFollowing, onFollowToggle }) => {
  const { _id, username, profilePhoto, createdAt } = userData;

  const isNew = useMemo(() => {
    if (!createdAt) return false;
    const days = (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24);
    return days < 7;
  }, [createdAt]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, scale: 0.9, x: 20 }}
      transition={{ duration: 0.25 }}
      className="group flex items-center justify-between p-3 rounded-[1.75rem] hover:bg-gray-50 dark:hover:bg-white/5 transition-all duration-300"
    >
      {/* User Info */}
      <Link href={`/Pages/User/${_id}`} className="flex items-center gap-3 flex-1 min-w-0">
        <div className="relative shrink-0">
          <motion.div
            whileHover={{ scale: 1.08 }}
            className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 ring-2 ring-white dark:ring-gray-900 shadow-sm"
          >
            <Image
              src={profilePhoto?.url || '/default-avatar.png'}
              alt={username}
              fill
              className="object-cover rounded-full"
            />
          </motion.div>
          {isNew && (
            <span className="absolute -top-0.5 -right-0.5 bg-emerald-500 border-2 border-white dark:border-[#0B0F1A] rounded-full w-3.5 h-3.5 shadow-sm" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <span className="text-gray-900 dark:text-gray-100 font-bold text-sm truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {username}
          </span>
          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider truncate mt-0.5">
            {statusMessage}
          </span>
        </div>
      </Link>

      {/* Action Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.08 }}
        onClick={() => onFollowToggle(_id)}
        className={`w-9 h-9 flex items-center justify-center rounded-2xl transition-all duration-300 ${
          isFollowing
            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white'
        }`}
      >
        {isFollowing ? <FaUserCheck size={18} /> : <HiUserPlus size={18} />}
      </motion.button>
    </motion.div>
  );
});

FriendCard.displayName = 'FriendCard';

const MenuFriends = memo(() => {
  const { user, users } = useAuth();
  const { followUser } = useUser();
  const { userData, loading } = useGetData(user?._id);
  const { t } = useTranslation();
  const router = useRouter();

  // Optimistic tracking for freshly followed users during this session
  const [sessionFollowedIds, setSessionFollowedIds] = useState([]);

  // Compile a comprehensive set of current user's followed IDs
  const myFollowingSet = useMemo(() => {
    const ids = new Set();
    const currentFollowing = userData?.following || user?.following || [];

    if (Array.isArray(currentFollowing)) {
      currentFollowing.forEach((item) => {
        if (!item) return;
        if (typeof item === 'string') ids.add(item);
        else if (item._id) ids.add(item._id.toString());
        else if (item.id) ids.add(item.id.toString());
      });
    }

    // Add session followed IDs
    sessionFollowedIds.forEach((id) => ids.add(id.toString()));
    return ids;
  }, [userData?.following, user?.following, sessionFollowedIds]);

  const currentUserId = user?._id || userData?._id;

  // Pro Recommendation Engine (filtering ONLY unfollowed users, ranked by relevance score)
  const recommendedUsers = useMemo(() => {
    if (!Array.isArray(users) || users.length === 0) return [];

    return users
      .filter((candidate) => {
        if (!candidate || !candidate._id) return false;
        const candidateId = candidate._id.toString();

        // 1. Exclude logged-in user
        if (candidateId === currentUserId?.toString()) return false;

        // 2. Strictly exclude users ALREADY followed
        if (myFollowingSet.has(candidateId)) return false;

        return true;
      })
      .map((candidate) => {
        // Calculate mutual connections
        let mutualCount = 0;
        const candidateFollowers = candidate.followers || [];
        if (Array.isArray(candidateFollowers)) {
          candidateFollowers.forEach((f) => {
            const fId = typeof f === 'string' ? f : f?._id;
            if (fId && myFollowingSet.has(fId.toString())) {
              mutualCount++;
            }
          });
        }

        // Calculate recommendation score (relevance)
        const followerCount = Array.isArray(candidate.followers) ? candidate.followers.length : 0;
        const postsCount = Array.isArray(candidate.posts) ? candidate.posts.length : 0;

        const daysOld = candidate.createdAt
          ? (Date.now() - new Date(candidate.createdAt).getTime()) / (1000 * 60 * 60 * 24)
          : 999;
        const isNew = daysOld < 7;

        let score = 0;
        score += mutualCount * 25; // Highest priority to mutual connections
        score += Math.min(followerCount * 2, 40); // Popularity bonus
        score += Math.min(postsCount, 20); // Active poster bonus
        if (isNew) score += 15; // New member boost
        if (candidate.isVerify || candidate.isAccountWithPremiumVerify) score += 30; // Verified boost

        // Status message badge
        let statusMessage = t('Suggested for you');
        if (mutualCount > 0) {
          statusMessage = `${mutualCount} ${t('mutual friends')}`;
        } else if (isNew) {
          statusMessage = t('New creator');
        } else if (postsCount > 20) {
          statusMessage = t('Active member');
        } else if (followerCount > 30) {
          statusMessage = t('Popular creator');
        }

        return {
          userData: candidate,
          score,
          statusMessage,
        };
      })
      .sort((a, b) => b.score - a.score);
  }, [users, currentUserId, myFollowingSet, t]);

  const handleFollowToggle = useCallback(
    async (targetId) => {
      setSessionFollowedIds((prev) => [...prev, targetId]);
      try {
        await followUser(targetId);
      } catch (err) {
        console.error('Failed to follow user:', err);
        setSessionFollowedIds((prev) => prev.filter((id) => id !== targetId));
      }
    },
    [followUser]
  );

  const displayedSuggestions = recommendedUsers.slice(0, 4);

  return (
    <div className="w-full bg-white/50 dark:bg-white/[0.02] backdrop-blur-3xl rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-2xl flex flex-col overflow-hidden">
      {/* 🔮 Header */}
      <div className="px-7 pt-7 pb-4 flex items-center justify-between">
        <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
          <span className="w-2 h-6 bg-pink-600 dark:bg-pink-500 rounded-full" />
          {t('Suggested Creators')}
        </h2>
        <HiSparkles className="text-pink-500 text-lg opacity-70" />
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
            {displayedSuggestions.length > 0 ? (
              <div className="flex flex-col gap-1">
                <AnimatePresence mode="popLayout">
                  {displayedSuggestions.map(({ userData: candidateUser, statusMessage }) => (
                    <FriendCard
                      key={candidateUser._id}
                      userData={candidateUser}
                      statusMessage={statusMessage}
                      isFollowing={false}
                      onFollowToggle={handleFollowToggle}
                    />
                  ))}
                </AnimatePresence>

                {/* ✨ Discover All Creators Button */}
                {recommendedUsers.length > 4 && (
                  <div className="px-3 py-4 mt-2 border-t border-gray-100 dark:border-white/5">
                    <motion.button
                      whileHover={{ x: 4 }}
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
              <div className="text-slate-400 dark:text-slate-500 text-xs font-bold text-center py-10 uppercase tracking-widest">
                {t('All caught up! No new suggestions.')}
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
