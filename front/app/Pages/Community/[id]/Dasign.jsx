'use client';
import React, { memo, useCallback, useMemo } from 'react';
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
} from 'react-icons/fa';

import SluchitEntry from '@/app/Component/SluchitEntry';
import EditCommunityMenu from '@/app/Component/AddandUpdateMenus/EditCommunityMenu';

// 💠 زر احترافي متعدد الأنماط (مُذكر ومحسّن)
const ActionButton = memo(({ children, onClick, variant = 'primary', className = '', Icon }) => {
  const base =
    'flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-5 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 shadow-md active:scale-95';
  const variants = useMemo(
    () => ({
      primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-blue-500/40',
      danger: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500 shadow-red-500/40',
      warning: 'bg-yellow-500 hover:bg-yellow-600 text-white focus:ring-yellow-400 shadow-yellow-400/40',
      success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500 shadow-green-500/40',
      dark: 'bg-gray-800 hover:bg-gray-700 text-white focus:ring-gray-500',
      light:
        'bg-gray-100 hover:bg-gray-200 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white focus:ring-gray-400',
    }),
    []
  );

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </motion.button>
  );
});
ActionButton.displayName = 'ActionButton';

// 📊 بطاقة إحصائيات أنيقة (مذكرة لتجنب rerenders)
const StatCard = memo(({ icon, label, value }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="flex flex-col items-center p-4 sm:p-5 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-lg transition-all flex-1 min-w-[130px]"
  >
    <div className="text-blue-500 dark:text-blue-400 mb-1">{icon}</div>
    <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{value}</div>
    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-1">{label}</p>
  </motion.div>
));
StatCard.displayName = 'StatCard';

// 🧩 صف العضو (محسّن ومذكر)
const MemberRow = memo(
  ({
    member,
    currentUserId,
    handleMakeAdmin,
    handleRemoveMember,
    CommunitySelected,
    isAdmin,
    isOwner,
  }) => {
    const { t } = useTranslation();
    const currentIsAdmin = isAdmin(member?._id);
    const currentIsOwner = isOwner(member?._id);
    const canManage = isOwner(currentUserId) || isAdmin(currentUserId);
    const isSelf = member?._id === currentUserId;

    const handleMakeAdminClick = useCallback(
      () => handleMakeAdmin(CommunitySelected._id, member?._id),
      [CommunitySelected._id, member?._id, handleMakeAdmin]
    );

    const handleRemoveClick = useCallback(
      () => handleRemoveMember(CommunitySelected._id, member?._id),
      [CommunitySelected._id, member?._id, handleRemoveMember]
    );
    if (!member) return null;
    return (
      <div className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-lg transition">
        <Link
          href={isSelf ? '/Pages/Profile' : `/Pages/User/${member?._id}`}
          className="flex items-center gap-4 group"
        >
          <Image
            src={member?.profilePhoto?.url || '/default-avatar.png'}
            alt="Member"
            width={48}
            height={48}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-500/50 group-hover:ring-blue-500 transition"
            loading="lazy"
          />
          <div>
            <p className="text-md font-semibold text-gray-900 dark:text-white flex items-center gap-2 group-hover:text-blue-600 transition">
              {member?.username}
              {currentIsOwner && (
                <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <FaCrown size={10} /> {t('Owner')}
                </span>
              )}
              {currentIsAdmin && !currentIsOwner && (
                <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">{t('Admin')}</span>
              )}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">@{member?.profileName}</p>
          </div>
        </Link>

        {canManage && !currentIsOwner && !isSelf && (
          <div className="flex gap-3 items-center">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMakeAdminClick}
              title={currentIsAdmin ? t('Remove Admin') : t('Make Admin')}
              className="p-2 rounded-full transition"
            >
              <FaCrown
                size={18}
                className={currentIsAdmin ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}
              />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleRemoveClick}
              className="p-2 text-red-500 hover:text-red-600 transition"
              title={t('Remove Member')}
            >
              <FaTrashAlt size={16} />
            </motion.button>
          </div>
        )}
      </div>
    );
  }
);
MemberRow.displayName = 'MemberRow';

// 🏛️ المكون الرئيسي
const DasignCommunitySelect = memo(
  ({
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
    user,
  }) => {
    const { t } = useTranslation();

    // ✅ تحسين الميمو للعمليات الحسابية
    const membersCount = useMemo(() => CommunitySelected?.members?.length || 0, [CommunitySelected]);
    const adminsCount = useMemo(() => CommunitySelected?.admins?.length || 0, [CommunitySelected]);
    const postsCount = useMemo(() => posts?.length || 0, [posts]);

    return (
      <div className="w-full text-gray-800 dark:text-gray-200 bg-white dark:bg-gray-900 min-h-screen pb-12">
        <Head>
          <title>
            {CommunitySelected?.Name} - {t('Community')}
          </title>
        </Head>

        {/* 🖼️ غلاف المجتمع */}
        <div className="relative w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Image
              src={CommunitySelected?.Cover?.url || '/default-cover.jpg'}
              alt={t('Cover')}
              width={1200}
              height={300}
              className="w-full h-[250px] sm:h-[320px] object-cover rounded-b-3xl shadow-xl"
              priority={false}
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 rounded-b-3xl" />

            {/* الصورة الرمزية */}
            <div className="absolute left-1/2 -translate-x-1/2 -bottom-16">
              <Image
                src={CommunitySelected?.Picture?.url || '/default-avatar.png'}
                alt={t('Avatar')}
                width={128}
                height={128}
                className="w-32 h-32 rounded-3xl object-cover border-4 border-white dark:border-gray-900 shadow-2xl hover:scale-105 transition-transform"
                loading="eager"
              />
            </div>

            {/* زر التعديل */}
            {(isOwner(user?._id) || isAdmin(user?._id)) && (
              <div className="absolute top-6 right-6">
                <ActionButton onClick={() => setShowEdit(true)} variant="warning" Icon={FaEdit}>
                  {t('Edit')}
                </ActionButton>
              </div>
            )}
          </motion.div>
        </div>

      {/* 🧭 معلومات المجتمع */}
      <div className="mt-20 px-4 md:px-8 flex flex-col items-center text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-2">
          {CommunitySelected?.Name}
        </h1>
        <p
          className={`text-sm font-semibold mb-6 px-3 py-1 rounded-full ${
            CommunitySelected?.isPrivate
              ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
              : 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300'
          }`}
        >
          {CommunitySelected?.isPrivate ? t('Private Community') : t('Public Community')}
        </p>

        {/* أزرار التفاعل */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {user && !isOwner(user._id) && (
            <>
              {isJoined ? (
                <ActionButton onClick={handleJoinToggle} variant="danger" Icon={FaTimes}>
                  {t('Leave')}
                </ActionButton>
              ) : hasPendingRequest ? (
                <ActionButton variant="dark" className="opacity-75 cursor-not-allowed" Icon={FaCheck}>
                  {t('Pending...')}
                </ActionButton>
              ) : (
                <ActionButton onClick={handleJoinToggle} variant="primary" Icon={FaPlus}>
                  {CommunitySelected.isPrivate ? t('Request Join') : t('Join')}
                </ActionButton>
              )}
            </>
          )}

          <ActionButton onClick={() => setShowRules(true)} variant="light" Icon={FaBook}>
            {t('Rules')}
          </ActionButton>

          {(isOwner(user?._id) || isAdmin(user?._id)) && CommunitySelected.isPrivate && (
            <ActionButton onClick={() => setShowRequests(true)} variant="warning" Icon={FaClipboardList}>
              {t('Requests')}
              {CommunitySelected?.joinRequests?.length > 0 && (
                <span className="ml-2 bg-red-600 text-white text-xs font-bold rounded-full px-2 py-0.5">
                  {CommunitySelected?.joinRequests?.length}
                </span>
              )}
            </ActionButton>
          )}
        </div>
      </div>

      {/* 📊 قسم الإحصائيات */}
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <StatCard icon={<FaUser size={20} />} label={t('Members')} value={CommunitySelected?.members?.length || 0} />
          <StatCard icon={<FaFeatherAlt size={20} />} label={t('Posts')} value={posts?.length || 0} />
          <StatCard icon={<FaUsers size={20} />} label={t('Admins')} value={CommunitySelected?.admins?.length || 0} />
        </div>

        {/* 📝 وصف المجتمع */}
        <div className="p-5 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner mb-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">
            {t('About the Community')}
          </h3>
          <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
            {CommunitySelected.description}
          </p>
        </div>

        {/* منشورات المجتمع */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold dark:text-white">{t('Community Feed')}</h2>
          <button
            onClick={() => setShowMembers(true)}
            className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition"
          >
            {t('See all members')} &rarr;
          </button>
        </div>

        <hr className="mb-6 border-gray-200 dark:border-gray-700" />

        <div className="flex flex-col gap-6 pb-10">
          {isJoined || !CommunitySelected.isPrivate ? (
            postsFiltered?.length > 0 ? (
              postsFiltered.map((post) => <SluchitEntry post={post} key={post?._id} />)
            ) : (
              <div className="text-center py-20 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-gray-700">
                <p className="font-semibold mb-2">{t('Quiet in here... 😴')}</p>
                <p className="text-sm">{t('Be the first to create a post in this community!')}</p>
              </div>
            )
          ) : (
            <div className="text-center py-20 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-300 dark:border-red-700">
              <p className="font-bold mb-2">{t('Access Restricted 🔒')}</p>
              <p className="text-sm">{t('You need to join this private community to view posts.')}</p>
            </div>
          )}
        </div>
      </div>
      <AnimatePresence>
        {/* Edit Modal */}
        {showEdit && (
          <EditCommunityMenu 
            community={CommunitySelected} 
            onClose={() => setShowEdit(false)} 
          />
        )}

        {/* Members Modal */}
        {showMembers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative shadow-2xl border border-gray-200/30 dark:border-gray-700/50"
            >
              <button
                onClick={() => setShowMembers(false)}
                className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-3xl transition font-light"
              >
                &times;
              </button>

              <h3 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-6">
                {t('Community Members')}
              </h3>

              {/* Tabs */}
              <div className="flex gap-2 md:gap-3 justify-center mb-6 border-b border-gray-200 dark:border-gray-700 pb-3">
                {['all', 'admins', 'owner'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveMemberTab(tab)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 
                      ${activeMemberTab === tab
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                  >
                    {t(tab.charAt(0).toUpperCase() + tab.slice(1))}
                  </button>
                ))}
              </div>

              {/* Search */}
              <input
                type="text"
                placeholder={t("Search members...")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full mb-6 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-400"
              />

              {/* Members List */}
              <div className="max-h-[420px] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-gray-400/30 dark:scrollbar-thumb-gray-600/40">
                {filteredMembers?.length > 0 ? (
                  filteredMembers.map((member) => (
                    <MemberRow
                      key={member?._id}
                      member={member}
                      isOwner={isOwner}
                      isAdmin={isAdmin}
                      currentUserId={user?._id}
                      handleMakeAdmin={handleMakeAdmin}
                      handleRemoveMember={handleRemoveMember}
                      communityId={CommunitySelected._id}
                    />
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    {t("No members found.")}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Requests Modal */}
        {showRequests && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 w-full max-w-2xl relative shadow-2xl border border-gray-200/30 dark:border-gray-700/50"
            >
              <button
                onClick={() => setShowRequests(false)}
                className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-3xl transition font-light"
              >
                &times;
              </button>

              <h3 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
                {t('Join Requests')}
              </h3>

              <div className="max-h-[420px] overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-400/30 dark:scrollbar-thumb-gray-600/40">
                {CommunitySelected?.joinRequests?.length > 0 ? (
                  CommunitySelected.joinRequests.map((req) => (
                    <motion.div
                      key={req?._id}
                      whileHover={{ scale: 1.01 }}
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition"
                    >
                      <Link
                        href={`/Pages/User/${req?._id}`}
                        className="flex items-center gap-4 group"
                      >
                        <Image
                          src={req?.profilePhoto?.url || '/default-avatar.png'}
                          alt="Member"
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-500/50 group-hover:ring-yellow-500 transition"
                          loading="lazy"
                        />
                        <div>
                          <p className="text-md font-semibold text-gray-900 dark:text-white group-hover:text-yellow-600 transition">
                            {req?.username}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">@{req?.profileName}</p>
                        </div>
                      </Link>
                      <div className="flex gap-3 items-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleApprove(CommunitySelected._id, req?._id)}
                          className="p-2 text-green-500 hover:text-green-600 transition"
                          title={t("Approve")}
                        >
                          <FaCheck size={20} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleReject(CommunitySelected._id, req?._id)}
                          className="p-2 text-red-500 hover:text-red-600 transition"
                          title={t("Reject")}
                        >
                          <FaTimes size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400 py-12">
                    {t("No pending requests.")}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Rules Modal */}
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 30, opacity: 0 }}
              className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 w-full max-w-xl relative shadow-2xl border border-gray-200/30 dark:border-gray-700/50"
            >
              <button
                onClick={() => setShowRules(false)}
                className="absolute top-4 right-5 text-gray-400 hover:text-red-500 text-3xl transition font-light"
              >
                &times;
              </button>

              <h3 className="text-2xl md:text-3xl font-extrabold text-center text-gray-900 dark:text-white mb-8 flex items-center justify-center gap-2">
                <FaBook className="text-blue-500" /> {t("Community Rules")}
              </h3>

              {CommunitySelected?.rules?.length > 0 ? (
                <ul className="space-y-4 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400/30 dark:scrollbar-thumb-gray-600/40">
                  {CommunitySelected.rules.map((rule, index) => (
                    <motion.li
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      key={index}
                      className="flex gap-4 items-start bg-blue-50 dark:bg-gray-800 p-4 rounded-xl shadow-sm border-l-4 border-blue-500 dark:border-blue-400"
                    >
                      <span className="font-bold text-lg text-blue-600 dark:text-blue-400">
                        {index + 1}.
                      </span>
                      <p className="text-sm text-gray-900 dark:text-gray-200 leading-relaxed">
                        {rule}
                      </p>
                    </motion.li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-12">
                  {t("No rules have been set for this community yet.")}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});
DasignCommunitySelect.displayName = 'DasignCommunitySelect';

export default DasignCommunitySelect;
