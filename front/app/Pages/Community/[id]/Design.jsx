'use client';
import React, { memo, useCallback, useMemo, useState } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  FaPlus,
  FaEdit,
  FaUsers,
  FaTrashAlt,
  FaCrown,
  FaUser,
  FaCheck,
  FaTimes,
  FaClipboardList,
  FaFeatherAlt,
  FaBook,
  FaGlobe,
  FaLock,
  FaHashtag,
  FaCog,
  FaShareAlt,
  FaInfoCircle
} from 'react-icons/fa';
import dayjs from 'dayjs';

import SluchitEntry from '@/app/Component/SluchitEntry';
import EditCommunityMenu from '@/app/Component/AddandUpdateMenus/EditCommunityMenu';

// --- ✨ UI Primitives ---

const GlassCard = ({ children, className = '', hover = false }) => (
  <motion.div
    whileHover={hover ? { y: -5, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' } : {}}
    className={`bg-white/[0.03] dark:bg-black/40 backdrop-blur-xl border border-white/10 dark:border-white/5 shadow-2xl rounded-[2rem] overflow-hidden transition-all duration-300 ${className}`}
  >
    {children}
  </motion.div>
);

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-3 px-8 py-4 rounded-2xl text-sm font-black uppercase tracking-widest transition-all duration-500 overflow-hidden group ${active
      ? 'text-white'
      : 'text-gray-500 hover:text-gray-300'
      }`}
  >
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-xl shadow-blue-600/20 z-0"
      />
    )}
    {!active && (
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    )}
    <span className="relative z-10 flex items-center gap-3">
      {Icon && <Icon className={`text-lg transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110'}`} />}
      {children}
    </span>
  </button>
);

const ActionButton = memo(({ children, onClick, variant = 'primary', className = '', Icon, disabled, loading }) => {
  const base = 'relative overflow-hidden flex items-center justify-center gap-3 text-sm font-black uppercase tracking-wider py-4 px-8 rounded-2xl transition-all duration-500 disabled:opacity-40 disabled:cursor-not-allowed group';

  const variants = {
    primary: 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/20 hover:shadow-blue-600/40',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 backdrop-blur-xl',
    danger: 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20',
    outline: 'border-2 border-white/10 hover:border-blue-500/50 text-gray-400 hover:text-white',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${className}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      {Icon && <Icon className="text-xl group-hover:rotate-12 transition-transform duration-500" />}
      {children}
    </motion.button>
  );
});
ActionButton.displayName = 'ActionButton';

// --- 👥 Member Row Component ---

const MemberRow = memo(({ member, currentUserId, handleMakeAdmin, handleRemoveMember, communityId, isAdmin, isOwner }) => {
  const { t } = useTranslation();
  const isMe = member?._id === currentUserId;
  const userIsAdmin = isAdmin(member?._id);
  const userIsOwner = isOwner(member?._id);
  const canManage = (isOwner(currentUserId) || isAdmin(currentUserId)) && !isMe && !userIsOwner;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      layout
      className="group flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-blue-500/30 transition-all duration-500"
    >
      <Link href={isMe ? '/Pages/Profile' : `/Pages/User/${member?._id}`} className="flex items-center gap-5">
        <div className="relative">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-white/5 group-hover:ring-blue-500/30 transition-all duration-500">
            <Image
              src={member?.profilePhoto?.url || '/default-avatar.png'}
              alt={member?.username}
              width={64}
              height={64}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
          </div>
          {userIsOwner && (
            <motion.div
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              className="absolute -top-2 -right-2 bg-gradient-to-tr from-yellow-600 to-amber-400 text-white p-1.5 rounded-xl shadow-xl ring-2 ring-[#050505]"
            >
              <FaCrown size={12} />
            </motion.div>
          )}
        </div>
        <div>
          <h4 className="font-black text-lg text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
            {member?.username}
            {userIsAdmin && !userIsOwner && (
              <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-0.5 rounded-full uppercase tracking-tighter border border-blue-500/20">
                Admin
              </span>
            )}
          </h4>
          <p className="text-sm font-medium text-gray-500 group-hover:text-gray-400 transition-colors">@{member?.profileName}</p>
        </div>
      </Link>

      {canManage && (
        <div className="flex gap-3 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
          <button
            onClick={() => handleMakeAdmin(communityId, member?._id)}
            className={`p-3 rounded-xl transition-all duration-300 ${userIsAdmin ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white' : 'bg-white/5 text-gray-400 hover:bg-blue-600 hover:text-white border border-white/5'}`}
            title={userIsAdmin ? t('Remove Admin') : t('Make Admin')}
          >
            <FaCrown size={16} />
          </button>
          <button
            onClick={() => handleRemoveMember(communityId, member?._id)}
            className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/10 transition-all duration-300"
            title={t('Kick Member')}
          >
            <FaTrashAlt size={16} />
          </button>
        </div>
      )}
    </motion.div>
  );
});
MemberRow.displayName = 'MemberRow';


// --- 🏗️ Main Layout ---

const DesignCommunitySelect = memo(({
  CommunitySelected,
  setShowEdit,
  showMembers,
  setShowMembers,
  showRequests,
  setShowRequests,
  searchTerm,
  setSearchTerm,
  activeMemberTab,
  setActiveMemberTab,
  showRules,
  setShowRules,
  isJoined,
  showEdit,
  hasPendingRequest,
  handleJoinToggle,
  handleMakeAdmin,
  handleRemoveMember,
  handleApprove,
  handleReject,
  postsFiltered,
  filteredMembers,
  isOwner,
  isAdmin,
  posts,
  user
}) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('feed'); // feed, members

  const canEdit = isOwner(user?._id) || isAdmin(user?._id);

  const stats = [
    { label: t('Members'), value: CommunitySelected?.members?.length, icon: FaUsers, color: 'blue' },
    { label: t('Posts'), value: postsFiltered?.length, icon: FaFeatherAlt, color: 'indigo' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#050505] text-white selection:bg-blue-500/30 selection:text-white font-sans overflow-x-hidden">
      <Head>
        <title>{CommunitySelected?.Name} | Community</title>
      </Head>

      {/* 🖼️ Hero Section (Premium) */}
      <section className="relative h-[45vh] lg:h-[60vh] min-h-[400px] w-full group">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-black/40 z-10" />
        <div className="absolute inset-0 bg-blue-600/10 mix-blend-overlay z-[1] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={CommunitySelected?.Cover?.url || '/default-cover.jpg'}
            alt="Cover"
            fill
            className="object-cover opacity-60 grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
            priority
          />
        </motion.div>

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 container mx-auto px-6 flex flex-col justify-end pb-16">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-10">
            {/* Avatar */}
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
              className="relative shrink-0"
            >
              <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-[2.5rem] overflow-hidden border-[6px] border-[#050505] shadow-2xl relative z-10 bg-[#0a0a0a]">
                <Image
                  src={CommunitySelected?.Picture?.url || '/default-avatar.png'}
                  alt="Avatar"
                  fill
                  className="object-cover transition-transform duration-700 hover:scale-110"
                />
              </div>
              {/* Privacy Badge */}
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`absolute -bottom-2 -right-2 z-20 w-12 h-12 rounded-2xl flex items-center justify-center border-4 border-[#050505] shadow-xl ${CommunitySelected?.isPrivate ? 'bg-gradient-to-tr from-red-600 to-rose-400' : 'bg-gradient-to-tr from-emerald-600 to-teal-400'}`}
              >
                {CommunitySelected?.isPrivate ? <FaLock className="text-white text-sm" /> : <FaGlobe className="text-white text-sm" />}
              </motion.div>
            </motion.div>

            {/* Info Section */}
            <div className="flex-1 text-center md:text-left space-y-6">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="flex flex-wrap justify-center md:justify-start items-center gap-3"
                >
                  <span className="px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-black uppercase tracking-widest">
                    {CommunitySelected?.Category || 'General'}
                  </span>
                  {CommunitySelected?.isPrivate && (
                    <span className="px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest">
                      {t('Invitation Only')}
                    </span>
                  )}
                </motion.div>

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-5xl lg:text-7xl font-black uppercase tracking-tighter leading-none"
                >
                  {CommunitySelected?.Name}
                </motion.h1>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="flex flex-wrap justify-center md:justify-start items-center gap-6 text-gray-400 font-bold"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <FaUsers size={14} />
                    </div>
                    {CommunitySelected?.members?.length.toLocaleString()} {t('Members')}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                      <FaFeatherAlt size={14} />
                    </div>
                    {postsFiltered?.length.toLocaleString()} {t('Posts')}
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Actions (Desktop and Tablet) */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="hidden md:flex flex-wrap gap-4 items-center"
            >
              {user && !isOwner(user._id) && (
                isJoined ? (
                  <ActionButton onClick={handleJoinToggle} variant="danger" Icon={FaTimes}>
                    {t('Leave')}
                  </ActionButton>
                ) : hasPendingRequest ? (
                  <ActionButton disabled variant="secondary" Icon={FaCheck}>
                    {t('Pending')}
                  </ActionButton>
                ) : (
                  <ActionButton onClick={handleJoinToggle} variant="primary" Icon={FaPlus}>
                    {CommunitySelected?.isPrivate ? t('Request Access') : t('Join Hub')}
                  </ActionButton>
                )
              )}
              {canEdit && (
                <ActionButton onClick={() => setShowEdit(true)} variant="secondary" Icon={FaCog}>
                  {t('Manage')}
                </ActionButton>
              )}
              <ActionButton variant="outline" className="!px-4" Icon={FaShareAlt} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 📱 Mobile Actions Area */}
      <div className="flex md:hidden container mx-auto px-6 -mt-8 relative z-30 gap-3">
        {user && !isOwner(user._id) && (
          isJoined ? (
            <ActionButton onClick={handleJoinToggle} variant="danger" className="flex-1" Icon={FaTimes}>
              {t('Leave')}
            </ActionButton>
          ) : hasPendingRequest ? (
            <ActionButton disabled variant="secondary" className="flex-1" Icon={FaCheck}>
              {t('Pending')}
            </ActionButton>
          ) : (
            <ActionButton onClick={handleJoinToggle} variant="primary" className="flex-1" Icon={FaPlus}>
              {CommunitySelected?.isPrivate ? t('Request') : t('Join')}
            </ActionButton>
          )
        )}
        {canEdit && (
          <ActionButton onClick={() => setShowEdit(true)} variant="secondary" className="flex-1" Icon={FaCog}>
            {t('Manage')}
          </ActionButton>
        )}
      </div>

      {/* 🧭 Main Interface */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-12">

          {/* Left: Enhanced Sidebar */}
          <aside className="w-full lg:w-[350px] shrink-0 space-y-8">

            {/* About Card */}
            <GlassCard className="p-8" hover={true}>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black uppercase tracking-wider flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                    <FaInfoCircle />
                  </span>
                  {t('About Hub')}
                </h3>
              </div>

              <p className="text-gray-400 text-base leading-relaxed mb-8 font-medium italic">
                {CommunitySelected?.description || t('No description provided.')}
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-black text-gray-500 uppercase tracking-tighter">{t('Curator')}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-white">{CommunitySelected?.owner?.username}</span>
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500/30 overflow-hidden">
                      <Image
                        src={CommunitySelected?.owner?.profilePhoto?.url || '/default-avatar.png'}
                        width={32} height={32} className="object-cover" alt="Owner"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                  <span className="text-sm font-black text-gray-500 uppercase tracking-tighter">{t('Launched')}</span>
                  <span className="text-sm font-bold text-gray-300">{dayjs(CommunitySelected?.createdAt).format('MMMM YYYY')}</span>
                </div>
              </div>

              {CommunitySelected?.tags?.length > 0 && (
                <div className="mt-8 pt-8 border-t border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {CommunitySelected?.tags?.map((tag, i) => (
                      <span key={i} className="text-[10px] font-black uppercase tracking-widest text-blue-400 bg-blue-500/10 px-4 py-2 rounded-xl border border-blue-500/10 hover:bg-blue-500 hover:text-white transition-all cursor-default">#{tag}</span>
                    ))}
                  </div>
                </div>
              )}
            </GlassCard>

            {/* Quick Actions Card */}
            <GlassCard className="p-4 space-y-2">
              <button
                onClick={() => setShowRules(true)}
                className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-blue-600/10 hover:border-blue-500/20 border border-transparent transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:scale-110 transition-transform">
                    <FaBook />
                  </div>
                  <span className="font-black uppercase tracking-widest text-xs">{t('Guidelines')}</span>
                </div>
                <div className="text-gray-500 group-hover:translate-x-1 transition-transform">→</div>
              </button>

              {canEdit && CommunitySelected?.isPrivate && (
                <button
                  onClick={() => setShowRequests(true)}
                  className="w-full flex items-center justify-between p-5 rounded-2xl hover:bg-emerald-600/10 hover:border-emerald-500/20 border border-transparent transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform relative">
                      <FaClipboardList />
                      {CommunitySelected?.joinRequests?.length > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[8px] font-bold text-white border-2 border-[#050505]">
                          {CommunitySelected?.joinRequests?.length}
                        </span>
                      )}
                    </div>
                    <span className="font-black uppercase tracking-widest text-xs">{t('Incoming Base')}</span>
                  </div>
                  <div className="text-gray-500 group-hover:translate-x-1 transition-transform">→</div>
                </button>
              )}
            </GlassCard>

          </aside>

          {/* Right: Dynamic Content Flow */}
          <main className="flex-1 space-y-10">
            {/* Tab Navigation (Glassy) */}
            <div className="flex p-2 bg-white/[0.03] border border-white/10 rounded-[2.5rem] backdrop-blur-3xl overflow-x-auto no-scrollbar">
              <div className="flex gap-2 w-full">
                <TabButton active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={FaFeatherAlt}>{t('Pulse')}</TabButton>
                <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={FaUsers}>{t('Society')}</TabButton>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'feed' && (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="space-y-8"
                >
                  {(isJoined || !CommunitySelected?.isPrivate) ? (
                    postsFiltered?.length > 0 ? (
                      <div className="grid grid-cols-1 gap-8">
                        {postsFiltered.map((post, idx) => (
                          <motion.div
                            key={post._id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <SluchitEntry post={post} />
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <GlassCard className="py-24 text-center border-dashed border-white/10">
                        <div className="relative inline-block mb-6">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-blue-500 rounded-full blur-3xl opacity-20"
                          />
                          <div className="relative w-24 h-24 rounded-full bg-blue-600/10 flex items-center justify-center text-5xl border border-blue-500/20">
                            📭
                          </div>
                        </div>
                        <h3 className="text-2xl font-black uppercase tracking-tighter mb-4">{t('Silence is Gold')}</h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">
                          {t('The feed is empty. Be the spark that ignites this community by sharing your first thought.')}
                        </p>
                        <button className="mt-8 px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-blue-600/20">
                          {t('Create Post')}
                        </button>
                      </GlassCard>
                    )
                  ) : (
                    <GlassCard className="py-32 text-center border-red-500/20 bg-red-500/[0.02]">
                      <div className="w-24 h-24 rounded-full bg-red-500/10 flex items-center justify-center text-4xl text-red-500 mx-auto mb-8 border border-red-500/20">
                        <FaLock />
                      </div>
                      <h3 className="text-3xl font-black uppercase tracking-tighter text-red-500 mb-4">{t('Restricted Hub')}</h3>
                      <p className="text-gray-400 max-w-sm mx-auto font-medium leading-relaxed">
                        {t('This sanctuary is private. Join the community to unlock access to all the discussions and updates.')}
                      </p>
                      {!hasPendingRequest && (
                        <button
                          onClick={handleJoinToggle}
                          className="mt-10 px-10 py-4 bg-red-600 hover:bg-red-500 rounded-2xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-red-600/20"
                        >
                          {t('Request Membership')}
                        </button>
                      )}
                    </GlassCard>
                  )}
                </motion.div>
              )}

              {activeTab === 'members' && (
                <motion.div
                  key="members"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                >
                  <GlassCard className="p-8">
                    {/* Filter & Search Header */}
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 mb-10">
                      <div className="flex p-1.5 bg-black/40 rounded-2xl border border-white/5 w-fit">
                        {['all', 'admins', 'owner'].map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveMemberTab(tab)}
                            className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeMemberTab === tab ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300'}`}
                          >
                            {t(tab)}
                          </button>
                        ))}
                      </div>

                      <div className="relative group w-full xl:w-80">
                        <FaUsers className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
                        <input
                          type="text"
                          placeholder={t('Search the society...')}
                          value={searchTerm}
                          onChange={e => setSearchTerm(e.target.value)}
                          className="w-full bg-black/40 border-2 border-white/5 rounded-2xl pl-12 pr-4 py-4 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-blue-500/50 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-4">
                      <AnimatePresence>
                        {filteredMembers?.map(member => (
                          <MemberRow
                            key={member._id}
                            member={member}
                            currentUserId={user?._id}
                            communityId={CommunitySelected?._id}
                            isAdmin={isAdmin}
                            isOwner={isOwner}
                            handleMakeAdmin={handleMakeAdmin}
                            handleRemoveMember={handleRemoveMember}
                          />
                        ))}
                      </AnimatePresence>
                      {filteredMembers?.length === 0 && (
                        <div className="col-span-full py-20 text-center">
                          <div className="text-5xl mb-6 opacity-30">🔍</div>
                          <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t('No matches found in the registry')}</p>
                        </div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>
      </div>

      {/* 🛠 Enhanced Modals (Glassmorphism Overload) */}
      <AnimatePresence>
        {showEdit && (
          <EditCommunityMenu community={CommunitySelected} onClose={() => setShowEdit(false)} />
        )}

        {showRequests && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowRequests(false)} />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border-2 border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 opacity-50" />

              <button
                onClick={() => setShowRequests(false)}
                className="absolute top-6 right-6 p-3 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all transition-transform hover:rotate-90"
              >
                <FaTimes size={18} />
              </button>

              <div className="flex items-center gap-6 mb-10 pb-6 border-b border-white/5">
                <div className="w-16 h-16 rounded-[1.25rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-2xl">
                  <FaClipboardList />
                </div>
                <div>
                  <h3 className="text-3xl font-black uppercase tracking-tighter">{t('Access Registry')}</h3>
                  <p className="text-gray-500 text-sm font-bold uppercase tracking-widest mt-1">{CommunitySelected?.joinRequests?.length || 0} {t('Pending Applications')}</p>
                </div>
              </div>

              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                {CommunitySelected?.joinRequests?.map(req => (
                  <motion.div
                    layout
                    key={req._id}
                    className="flex items-center justify-between p-5 rounded-[1.5rem] bg-white/[0.03] border border-white/5 group hover:border-blue-500/30 transition-all duration-500"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl overflow-hidden ring-2 ring-white/5 group-hover:ring-blue-500/30 transition-all duration-500">
                        <Image src={req.profilePhoto.url} width={56} height={56} className="w-full h-full object-cover" alt="req" />
                      </div>
                      <div>
                        <div className="font-black text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{req.username}</div>
                        <div className="text-[10px] text-gray-500 font-bold tracking-widest uppercase">@{req.profileName || 'user'}</div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(CommunitySelected._id, req._id)}
                        className="p-3.5 rounded-xl bg-green-500/10 text-green-500 hover:bg-green-600 hover:text-white border border-green-500/10 transition-all duration-300"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleReject(CommunitySelected._id, req._id)}
                        className="p-3.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/10 transition-all duration-300"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  </motion.div>
                ))}
                {(!CommunitySelected?.joinRequests?.length) && (
                  <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                    <div className="text-5xl mb-4 opacity-20">📂</div>
                    <h4 className="text-gray-500 font-black uppercase tracking-widest text-xs">{t('The queue is clear')}</h4>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowRules(false)} />
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="w-full max-w-2xl bg-[#0a0a0a] border-2 border-white/10 rounded-[2.5rem] p-10 shadow-[0_0_100px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-orange-400 via-yellow-500 to-orange-600 opacity-50" />

              <button
                onClick={() => setShowRules(false)}
                className="absolute top-6 right-6 p-3 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-all hover:rotate-90"
              >
                <FaTimes size={18} />
              </button>

              <div className="text-center mb-12">
                <motion.div
                  initial={{ rotate: -10 }} animate={{ rotate: 0 }}
                  className="w-24 h-24 bg-gradient-to-tr from-orange-600/20 to-yellow-500/20 text-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl border border-orange-500/20"
                >
                  <FaBook />
                </motion.div>
                <h3 className="text-4xl font-black uppercase tracking-tighter">{t('Hub Guidelines')}</h3>
                <p className="text-gray-500 text-xs font-black uppercase tracking-[0.3em] mt-3">{t('The Code of Conduct')}</p>
              </div>

              <div className="space-y-4 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                {CommunitySelected?.rules?.length > 0 ? CommunitySelected?.rules.map((rule, i) => (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={i}
                    className="flex gap-6 items-start p-6 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-orange-500/30 transition-all duration-500 group"
                  >
                    <span className="w-12 h-12 shrink-0 rounded-[1rem] bg-orange-500/10 flex items-center justify-center text-orange-500 font-black text-xl border border-orange-500/10 group-hover:scale-110 transition-transform">
                      {i + 1}
                    </span>
                    <div className="space-y-1">
                      <p className="text-white text-base font-bold leading-relaxed">{rule}</p>
                    </div>
                  </motion.div>
                )) : (
                  <div className="text-center py-20 bg-white/[0.02] rounded-3xl border border-dashed border-white/10">
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">{t('Common sense prevails. No specific rules set yet.')}</p>
                  </div>
                )}
              </div>

              <div className="mt-10 text-center">
                <ActionButton onClick={() => setShowRules(false)} variant="secondary" className="w-full">
                  {t('I Understood')}
                </ActionButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
});

DesignCommunitySelect.displayName = 'DesignCommunitySelect';

export default DesignCommunitySelect;
