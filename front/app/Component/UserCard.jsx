'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { HiCheckBadge, HiMapPin, HiUserPlus, HiUserMinus } from 'react-icons/hi2';
import { motion } from 'framer-motion';
import { useUser } from '@/app/Context/UserContext';
import { useAuth } from '@/app/Context/AuthContext';

const UserCard = ({ user: targetUser, t, isCompact = false }) => {
    const { followUser, loading } = useUser();
    const { user: currentUser } = useAuth();

    // Local state for real-time updates
    const [localIsFollowing, setLocalIsFollowing] = React.useState(
        currentUser?.following?.some(u =>
            (typeof u === 'string' ? u : u._id) === targetUser._id
        )
    );
    const [localFollowerCount, setLocalFollowerCount] = React.useState(targetUser.followers?.length || 0);

    // Update local state when currentUser changes
    React.useEffect(() => {
        const isFollowing = currentUser?.following?.some(u =>
            (typeof u === 'string' ? u : u._id) === targetUser._id
        );
        setLocalIsFollowing(isFollowing);
    }, [currentUser?.following, targetUser._id]);

    const handleFollow = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Optimistic update
        const wasFollowing = localIsFollowing;
        setLocalIsFollowing(!wasFollowing);
        setLocalFollowerCount(prev => wasFollowing ? prev - 1 : prev + 1);

        const result = await followUser(targetUser._id);

        // If failed, revert
        if (!result?.success) {
            setLocalIsFollowing(wasFollowing);
            setLocalFollowerCount(targetUser.followers?.length || 0);
        }
    };

    if (isCompact) {
        return (
            <motion.div
                whileHover={{ scale: 1.02, x: 5 }}
                className="group p-4 flex items-center justify-between bg-white/50 dark:bg-white/[0.02] backdrop-blur-md rounded-[2rem] border border-gray-100 dark:border-white/5 hover:border-indigo-500/30 transition-all shadow-sm"
            >
                <Link href={`/Pages/Profile/${targetUser._id}`} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="relative w-12 h-12 rounded-2xl overflow-hidden shadow-lg">
                        <Image
                            src={targetUser.profilePhoto?.url || '/default-avatar.png'}
                            alt={targetUser.username}
                            fill
                            className="object-cover"
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <h4 className="font-black text-gray-900 dark:text-white truncate text-sm">
                                {targetUser.profileName || targetUser.username}
                            </h4>
                            {(targetUser.isVerify || targetUser.isAccountWithPremiumVerify) && (
                                <HiCheckBadge className="text-indigo-500 w-4 h-4 flex-shrink-0" />
                            )}
                        </div>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                            @{targetUser.username}
                        </p>
                    </div>
                </Link>

                {currentUser?._id !== targetUser._id && (
                    <button
                        onClick={handleFollow}
                        disabled={loading}
                        className={`ml-4 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${localIsFollowing
                            ? 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-rose-500'
                            : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:scale-105'
                            }`}
                    >
                        {localIsFollowing ? t('Following') : t('Follow')}
                    </button>
                )}
            </motion.div>
        );
    }

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative p-8 bg-white dark:bg-[#0D1117] rounded-[2.5rem] border border-gray-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center overflow-hidden"
        >
            {/* Background Accent */}
            <div className="absolute top-0 inset-x-0 h-24 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 -z-10 group-hover:h-full transition-all duration-700" />

            <Link href={`/Pages/Profile/${targetUser._id}`} className="contents">
                <div className="relative mb-6">
                    <div className="w-24 h-24 rounded-[2rem] overflow-hidden ring-4 ring-white dark:ring-gray-900 shadow-2xl">
                        <Image
                            src={targetUser.profilePhoto?.url || '/default-avatar.png'}
                            alt={targetUser.username}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                    </div>
                    {targetUser.isOnline && (
                        <div className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white dark:border-[#0D1117]" />
                    )}
                </div>

                <div className="space-y-1 mb-4 flex flex-col items-center">
                    <div className="flex items-center gap-1 justify-center">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">
                            {targetUser.profileName || targetUser.username}
                        </h3>
                        {(targetUser.isVerify || targetUser.isAccountWithPremiumVerify) && (
                            <HiCheckBadge className="text-indigo-500 w-5 h-5" />
                        )}
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                        @{targetUser.username}
                    </p>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-6 line-clamp-2 px-4 italic">
                    {targetUser.description || t('Navigating the grid without a signal pulse.')}
                </p>

                <div className="grid grid-cols-2 gap-4 w-full mb-8">
                    <div className="p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <div className="text-lg font-black text-gray-900 dark:text-white leading-none mb-1">
                            {localFollowerCount > 1000 ? `${(localFollowerCount / 1000).toFixed(1)}k` : localFollowerCount}
                        </div>
                        <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{t('Followers')}</div>
                    </div>
                    <div className="p-4 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                        <div className="text-lg font-black text-gray-900 dark:text-white leading-none mb-1">
                            {targetUser.posts?.length || 0}
                        </div>
                        <div className="text-[9px] font-black uppercase text-gray-400 tracking-widest">{t('Signals')}</div>
                    </div>
                </div>
            </Link>

            {currentUser?._id !== targetUser._id && (
                <button
                    onClick={handleFollow}
                    disabled={loading}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 ${localIsFollowing
                        ? 'bg-gray-100 dark:bg-white/5 text-gray-500 hover:bg-rose-500 hover:text-white'
                        : 'bg-indigo-600 text-white shadow-xl shadow-indigo-500/20 hover:scale-[1.02] active:scale-95'
                        }`}
                >
                    {localIsFollowing ? (
                        <>
                            <HiUserMinus size={14} />
                            {t('Unlink Node')}
                        </>
                    ) : (
                        <>
                            <HiUserPlus size={14} />
                            {t('Link Node')}
                        </>
                    )}
                </button>
            )}
        </motion.div>
    );
};

export default UserCard;
