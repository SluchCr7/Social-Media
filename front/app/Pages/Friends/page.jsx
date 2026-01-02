'use client';
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUserPlus, FiUserCheck, FiSearch } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/app/Context/AuthContext';
import { useUser } from '@/app/Context/UserContext';
import { useGetData } from '@/app/Custome/useGetData';
import { useTranslation } from 'react-i18next';
import MenuSkeleton from '@/app/Skeletons/MenuSkeleton';
import { Sparkles, Users, Globe } from 'lucide-react';

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
    <div className="min-h-screen w-full relative bg-[#050505] text-white overflow-hidden">
      {/* Background Ambience */}
      <div className="fixed top-0 inset-x-0 h-[400px] bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[600px] h-[600px] bg-purple-900/10 blur-[150px] pointer-events-none rounded-full" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest text-emerald-400">
              <Globe size={10} />
              Global Network
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white">
              Discover <span className="text-white/20">Connections</span>
            </h1>
            <p className="text-sm font-medium text-white/40 max-w-lg">
              Expand your resonance. Connect with creators, innovators, and friends across the decentralized network.
            </p>
          </div>

          {/* Search Bar Premium */}
          <div className="relative w-full md:w-96 group">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg opacity-0 group-focus-within:opacity-100 transition duration-500 rounded-xl" />
            <div className="relative flex items-center bg-white/[0.03] border border-white/10 rounded-2xl px-5 py-4 backdrop-blur-md transition-all group-focus-within:bg-black/80 group-focus-within:border-emerald-500/50">
              <FiSearch className="text-white/30 text-lg mr-3 group-focus-within:text-emerald-400 transition-colors" />
              <input
                type="text"
                placeholder={t("Search username...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/20 font-medium"
              />
            </div>
          </div>
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
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mb-6">
                  <Sparkles className="w-10 h-10 text-white/20" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{t("No vibes found")}</h3>
                <p className="text-white/40 text-sm max-w-xs">{t("We couldn't find anyone matching that search. Try broadening your horizon.")}</p>
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
      className="group relative p-1 rounded-3xl bg-transparent hover:bg-white/[0.02] transition-colors duration-500"
    >
      {/* Card Content */}
      <div className="relative p-6 rounded-[20px] bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col items-center text-center h-full group-hover:border-white/20 transition-colors duration-500">

        {/* Hover Gradient Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Avatar with Glow */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-white/5 group-hover:border-emerald-500/50 transition-colors duration-500 shadow-2xl">
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
          <Link href={`/Pages/User/${user._id}`} className="block">
            <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors duration-300">
              {user.username}
            </h3>
          </Link>
          <p className="text-xs font-medium text-white/30 uppercase tracking-widest mt-1 mb-6">
            {t('Creator')}
          </p>

          {/* Action Button */}
          <button
            onClick={() => handleFollow(user._id)}
            className={`
                            mt-auto w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300
                            flex items-center justify-center gap-2
                            ${isFollowing
                ? 'bg-white/5 text-white/40 hover:bg-red-500/10 hover:text-red-500'
                : 'bg-white text-black hover:bg-emerald-400 hover:text-black hover:scale-105 shadow-lg shadow-white/10'}
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
