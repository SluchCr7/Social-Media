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
  FaCog
} from 'react-icons/fa';
import dayjs from 'dayjs';

import SluchitEntry from '@/app/Component/SluchitEntry';
import EditCommunityMenu from '@/app/Component/AddandUpdateMenus/EditCommunityMenu';

// --- ✨ UI Primitives ---

const GlassCard = ({ children, className = '' }) => (
  <div className={`bg-white/5 dark:bg-black/20 backdrop-blur-2xl border border-white/10 dark:border-white/5 shadow-2xl rounded-3xl ${className}`}>
    {children}
  </div>
);

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <button
    onClick={onClick}
    className={`relative flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 ${active
        ? 'text-white'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
      }`}
  >
    {active && (
      <motion.div
        layoutId="activeTab"
        className="absolute inset-0 bg-blue-600 shadow-lg shadow-blue-600/30 rounded-2xl z-0"
      />
    )}
    <span className="relative z-10 flex items-center gap-2">
      {Icon && <Icon className={active ? 'text-white' : 'text-current'} />}
      {children}
    </span>
  </button>
);

const ActionButton = memo(({ children, onClick, variant = 'primary', className = '', Icon, disabled }) => {
  const base = 'relative overflow-hidden flex items-center justify-center gap-2 text-sm font-bold py-3 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

  const variants = {
    primary: 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30',
    secondary: 'bg-white/10 hover:bg-white/20 text-white border border-white/10 backdrop-blur-md',
    danger: 'bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20',
    success: 'bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon className="text-lg" />}
      {children}
    </motion.button>
  );
});
ActionButton.displayName = 'ActionButton';

const StatItem = ({ label, value, icon: Icon }) => (
  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
    <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
      <Icon size={24} />
    </div>
    <div>
      <div className="text-2xl font-black text-gray-900 dark:text-white leading-none mb-1">
        {value}
      </div>
      <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
        {label}
      </div>
    </div>
  </div>
);

// --- 👥 Member Row Component ---

const MemberRow = memo(({ member, currentUserId, handleMakeAdmin, handleRemoveMember, communityId, isAdmin, isOwner }) => {
  const { t } = useTranslation();
  const isMe = member?._id === currentUserId;
  const userIsAdmin = isAdmin(member?._id);
  const userIsOwner = isOwner(member?._id);
  const canManage = (isOwner(currentUserId) || isAdmin(currentUserId)) && !isMe && !userIsOwner;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all"
    >
      <Link href={isMe ? '/Pages/Profile' : `/Pages/User/${member?._id}`} className="flex items-center gap-4">
        <div className="relative">
          <Image
            src={member?.profilePhoto?.url || '/default-avatar.png'}
            alt={member?.username}
            width={56}
            height={56}
            className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white/10 group-hover:ring-blue-500/50 transition-all"
          />
          {userIsOwner && (
            <div className="absolute -top-1 -right-1 bg-yellow-500 text-white p-1 rounded-full text-xs shadow-lg">
              <FaCrown />
            </div>
          )}
        </div>
        <div>
          <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
            {member?.username}
            {userIsAdmin && !userIsOwner && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 rounded-full uppercase tracking-wide">Admin</span>}
          </h4>
          <p className="text-sm text-gray-500">@{member?.profileName}</p>
        </div>
      </Link>

      {canManage && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleMakeAdmin(communityId, member?._id)}
            className={`p-2 rounded-lg transition-colors ${userIsAdmin ? 'bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500 hover:text-white' : 'bg-gray-700 text-gray-400 hover:bg-blue-500 hover:text-white'}`}
            title={userIsAdmin ? t('Remove Admin') : t('Make Admin')}
          >
            <FaCrown size={14} />
          </button>
          <button
            onClick={() => handleRemoveMember(communityId, member?._id)}
            className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-colors"
            title={t('Kick Member')}
          >
            <FaTrashAlt size={14} />
          </button>
        </div>
      )}
    </motion.div>
  );
});
MemberRow.displayName = 'MemberRow';


// --- 🏗️ Main Layout ---

const DasignCommunitySelect = memo(({
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
  const [activeTab, setActiveTab] = useState('feed'); // feed, about, members

  // Render Logic
  const canEdit = isOwner(user?._id) || isAdmin(user?._id);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 font-sans">
      <Head>
        <title>{CommunitySelected?.Name} | Community</title>
      </Head>

      {/* 🖼️ Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/60 to-transparent z-10" />
        <Image
          src={CommunitySelected?.Cover?.url || '/default-cover.jpg'}
          alt="Cover"
          fill
          className="object-cover opacity-80"
          priority
        />

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 container mx-auto px-4 flex flex-col justify-end pb-12">
          <div className="flex flex-col md:flex-row items-end gap-8">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative shrink-0"
            >
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-3xl overflow-hidden border-4 border-[#050505] shadow-2xl relative z-10">
                <Image
                  src={CommunitySelected?.Picture?.url || '/default-avatar.png'}
                  alt="Avatar"
                  fill
                  className="object-cover"
                />
              </div>
              {/* Privacy Badge */}
              <div className={`absolute -bottom-3 -right-3 z-20 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#050505] ${CommunitySelected?.isPrivate ? 'bg-red-500' : 'bg-emerald-500'}`}>
                {CommunitySelected?.isPrivate ? <FaLock className="text-white text-xs" /> : <FaGlobe className="text-white text-xs" />}
              </div>
            </motion.div>

            {/* Initial Info */}
            <div className="flex-1 space-y-4 mb-2">
              <div>
                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="text-4xl md:text-6xl font-black uppercase tracking-tight"
                >
                  {CommunitySelected?.Name}
                </motion.h1>
                <div className="flex items-center gap-4 mt-2 text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><FaUsers className="text-blue-500" /> {CommunitySelected?.members?.length} {t('Members')}</span>
                  <span className="w-1 h-1 bg-gray-600 rounded-full" />
                  <span className="uppercase text-xs tracking-wider border border-white/10 px-2 py-1 rounded-lg">{CommunitySelected?.Category}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-2">
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
                    {CommunitySelected?.isPrivate ? t('Request') : t('Join')}
                  </ActionButton>
                )
              )}
              {canEdit && (
                <ActionButton onClick={() => setShowEdit(true)} variant="secondary" Icon={FaCog}>
                  {t('Manage')}
                </ActionButton>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 🧭 Main Interface */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* Left: Sidebar / Info */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            {/* About Card */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <FaBook className="text-blue-500" /> {t('About')}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {CommunitySelected?.description}
              </p>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                  <span className="text-gray-500">{t('Owner')}</span>
                  <span className="font-medium flex items-center gap-2">
                    <Image
                      src={CommunitySelected?.owner?.profilePhoto?.url || '/default-avatar.png'}
                      width={20} height={20} className="rounded-full" alt="Owner"
                    />
                    {CommunitySelected?.owner?.username}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm py-2 border-b border-white/5">
                  <span className="text-gray-500">{t('Created')}</span>
                  <span className="font-medium">{dayjs(CommunitySelected?.createdAt).format('MMM D, YYYY')}</span>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-2">
                {CommunitySelected?.tags?.map((tag, i) => (
                  <span key={i} className="text-xs font-bold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-lg">#{tag}</span>
                ))}
              </div>
            </GlassCard>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-[#090909] border border-white/5 text-center">
                <div className="text-2xl font-black text-white">{CommunitySelected?.members?.length}</div>
                <div className="text-[10px] uppercase text-gray-500">{t('Members')}</div>
              </div>
              <div className="p-4 rounded-2xl bg-[#090909] border border-white/5 text-center">
                <div className="text-2xl font-black text-white">{posts?.length}</div>
                <div className="text-[10px] uppercase text-gray-500">{t('Posts')}</div>
              </div>
            </div>

            {/* Quick Links */}
            <GlassCard className="p-2 space-y-1">
              <button onClick={() => setShowRules(true)} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors text-left">
                <FaBook className="text-gray-500" /> {t('Community Rules')}
              </button>
              {canEdit && CommunitySelected?.isPrivate && (
                <button onClick={() => setShowRequests(true)} className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-white/5 text-sm font-medium transition-colors text-left">
                  <span className="flex items-center gap-3"><FaClipboardList className="text-gray-500" /> {t('Join Requests')}</span>
                  {CommunitySelected?.joinRequests?.length > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{CommunitySelected?.joinRequests?.length}</span>
                  )}
                </button>
              )}
            </GlassCard>

          </aside>

          {/* Right: Content Area */}
          <main className="flex-1">
            {/* Tabs */}
            <div className="flex overflow-x-auto gap-2 mb-8 no-scrollbar pb-2">
              <TabButton active={activeTab === 'feed'} onClick={() => setActiveTab('feed')} icon={FaFeatherAlt}>{t('Feed')}</TabButton>
              <TabButton active={activeTab === 'members'} onClick={() => setActiveTab('members')} icon={FaUsers}>{t('Members')}</TabButton>
            </div>

            <AnimatePresence mode="wait">
              {activeTab === 'feed' && (
                <motion.div
                  key="feed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  {isJoined || !CommunitySelected?.isPrivate ? (
                    postsFiltered?.length > 0 ? (
                      postsFiltered.map(post => <SluchitEntry key={post._id} post={post} />)
                    ) : (
                      <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <div className="inline-flex p-4 rounded-full bg-blue-500/10 text-blue-500 mb-4 text-3xl">📭</div>
                        <h3 className="text-xl font-bold mb-2">{t('No Posts Yet')}</h3>
                        <p className="text-gray-500">{t('Be the first to share something in this community!')}</p>
                      </div>
                    )
                  ) : (
                    <div className="text-center py-20 bg-red-500/5 rounded-3xl border border-red-500/20">
                      <FaLock className="text-4xl text-red-500 mx-auto mb-4 opacity-50" />
                      <h3 className="text-xl font-bold text-red-500 mb-2">{t('Private Community')}</h3>
                      <p className="text-gray-400">{t('You must join to view posts.')}</p>
                    </div>
                  )}
                </motion.div>
              )}

              {activeTab === 'members' && (
                <motion.div
                  key="members"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <GlassCard className="p-6">
                    {/* Filter */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                      <div className="flex gap-2">
                        {['all', 'admins', 'owner'].map(tab => (
                          <button
                            key={tab}
                            onClick={() => setActiveMemberTab(tab)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase transition-colors ${activeMemberTab === tab ? 'bg-blue-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
                          >
                            {t(tab)}
                          </button>
                        ))}
                      </div>
                      <input
                        type="text"
                        placeholder={t('Search members...')}
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 w-full md:w-64"
                      />
                    </div>

                    <div className="space-y-3">
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
                      {filteredMembers?.length === 0 && (
                        <div className="text-center py-10 text-gray-500">{t('No members found matching your search.')}</div>
                      )}
                    </div>
                  </GlassCard>
                </motion.div>
              )}
            </AnimatePresence>

          </main>
        </div>
      </div>

      {/* 🛠 Modals */}
      <AnimatePresence>
        {showEdit && (
          <EditCommunityMenu community={CommunitySelected} onClose={() => setShowEdit(false)} />
        )}

        {showRequests && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 shadow-2xl relative">
              <button onClick={() => setShowRequests(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400">
                <FaTimes />
              </button>
              <h3 className="text-2xl font-black mb-6 border-b border-white/10 pb-4">{t('Join Requests')}</h3>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto">
                {CommunitySelected?.joinRequests?.map(req => (
                  <div key={req._id} className="flex items-center justify-between p-4 rounded-2xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <Image src={req.profilePhoto.url} width={40} height={40} className="rounded-xl" alt="req" />
                      <div className="font-bold">{req.username}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(CommunitySelected._id, req._id)} className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white"><FaCheck /></button>
                      <button onClick={() => handleReject(CommunitySelected._id, req._id)} className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white"><FaTimes /></button>
                    </div>
                  </div>
                ))}
                {(!CommunitySelected?.joinRequests?.length) && (
                  <div className="text-center text-gray-500 py-10">{t('No pending requests')}</div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {showRules && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 shadow-2xl relative">
              <button onClick={() => setShowRules(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/10 text-gray-400">
                <FaTimes />
              </button>
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 text-2xl"><FaBook /></div>
                <h3 className="text-2xl font-black uppercase">{t('Community Rules')}</h3>
              </div>
              <div className="space-y-4">
                {CommunitySelected?.rules?.length > 0 ? CommunitySelected?.rules.map((rule, i) => (
                  <div key={i} className="flex gap-4 items-start p-4 rounded-2xl bg-white/5">
                    <span className="font-black text-blue-500 text-lg">#{i + 1}</span>
                    <p className="text-gray-300 text-sm leading-relaxed">{rule}</p>
                  </div>
                )) : (
                  <div className="text-center text-gray-500">{t('No rules established yet.')}</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
});

DasignCommunitySelect.displayName = 'DasignCommunitySelect';

export default DasignCommunitySelect;
