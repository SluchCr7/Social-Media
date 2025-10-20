'use client';
import React from 'react'
import SluchitEntry from '@/app/Component/SluchitEntry'
import Image from 'next/image'
import Head from 'next/head'
import { FaPlus, FaEdit, FaUsers, FaTrashAlt, FaCrown, FaUser, FaCheck, FaTimes } from 'react-icons/fa'
import Link from 'next/link'
import { FaBook } from 'react-icons/fa' // أيقونة القوانين
import { motion, AnimatePresence } from 'framer-motion'
import EditCommunityMenu from '@/app/Component/AddandUpdateMenus/EditCommunityMenu'
import { useTranslation } from 'react-i18next'

const ActionButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    dark: 'bg-gray-800 hover:bg-gray-900',
    success: 'bg-green-600 hover:bg-green-700',
  }
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm ${styles[variant]} text-white py-1.5 px-4 rounded-md transition shadow-sm ${className}`}
    >
      {children}
    </button>
  )
}

const DasignCommunitySelect = ({
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
  hasPendingRequest,
  handleJoinToggle,
  handleMakeAdmin,
  handleRemoveMember,
  handleApprove,
  handleReject,
  setCommunitySelected,
  postsFiltered,
  filteredMembers,
  isOwner,
  isAdmin,
  posts,
  user
}) => {
  const { t } = useTranslation() // استدعاء دالة الترجمة

  return (
    <div className="w-full text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen pb-12">

      {/* Cover Section */}
      <div className="relative w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
          <Image
            src={CommunitySelected?.Cover?.url || '/default-cover.jpg'}
            alt={t('Cover')}
            width={1200}
            height={300}
            className="w-full h-[220px] sm:h-[260px] object-cover rounded-b-xl shadow"
            priority={false}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent rounded-b-xl" />

          <div className="absolute left-6 -bottom-12">
            <Image
              src={CommunitySelected?.Picture?.url || '/default-avatar.png'}
              alt={t('Avatar')}
              width={100}
              height={100}
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
              loading="lazy"
            />
          </div>

          <div className="absolute right-6 bottom-6 flex items-center gap-3">
            {(isOwner(user?._id) || isAdmin(user?._id)) && (
              <div className="flex gap-2">
                <ActionButton onClick={() => setShowEdit(true)} variant="warning">
                  <FaEdit /> {t('Edit')}
                </ActionButton>
              </div>
            )}
            <ActionButton onClick={() => setShowRules(true)} variant="dark">
              <FaBook /> {t('Rules')}
            </ActionButton>

            {user && !isOwner(user._id) && (
              <>
                {isJoined ? (
                  <ActionButton onClick={handleJoinToggle} variant="danger">
                    {t('Leave')}
                  </ActionButton>
                ) : hasPendingRequest ? (
                  <ActionButton
                    variant="dark"
                    className="opacity-60 cursor-not-allowed"
                    onClick={null} // منع الضغط
                  >
                    {t('Pending...')}
                  </ActionButton>
                ) : (
                  <ActionButton onClick={handleJoinToggle} variant="primary">
                    <FaPlus /> {CommunitySelected.isPrivate ? t('Request Join') : t('Join')}
                  </ActionButton>
                )}
              </>
            )}
          </div>
        </motion.div>
      </div>

      {/* Info Section */}
      <div className="mt-20 px-4 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {CommunitySelected?.Name}
            <span className="text-xs text-lightMode-text dark:text-darkMode-text px-2 py-0.5 rounded">{CommunitySelected?.isPrivate ? t('Private') : t('Public')}</span>
          </h1>
          <div className="text-sm text-gray-500">{t('Created')}: {new Date(CommunitySelected?.createdAt).toLocaleDateString()}</div>
        </div>

        <p className="text-sm text-gray-900 dark:text-gray-200 whitespace-pre-wrap break-words leading-relaxed p-4 rounded-md shadow-sm">
          {CommunitySelected.description}
        </p>

        {/* Members Summary */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaUser /> {CommunitySelected?.members?.length || 0} {t('Members')}
          </p>

          <div className="flex items-center gap-2">
            {(isOwner(user?._id) || isAdmin(user?._id)) && (
              <button
                onClick={() => setShowRequests(true)}
                className="text-sm px-3 py-1 rounded-md bg-yellow-400 hover:bg-yellow-500 text-white"
              >
                {t('Requests')} ({CommunitySelected?.joinRequests?.length || 0})
              </button>
            )}
            <button onClick={() => setShowMembers(true)} className="text-sm px-3 py-1 rounded-md bg-lightMode-bg dark:bg-darkMode-bg hover:bg-lightMode-menu dark:hover:bg-darkMode-menu text-lightMode-text dark:text-darkMode-text">
              {t('See all')}
            </button>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300 mx-4" />

      {/* Posts Section */}
      <div className="px-4 flex flex-col gap-6 pb-10">
        {isJoined || !CommunitySelected.isPrivate ? (
          postsFiltered?.length > 0 ? (
            postsFiltered.map((post) => <SluchitEntry post={post} key={post?._id} />)
          ) : (
            <div className="text-center text-sm py-12 rounded-lg shadow-sm">
              {t('This community has no posts yet.')}
            </div>
          )
        ) : (
          <div className="text-center text-sm py-12 text-gray-500">
            {t('You need to join this private community to view posts.')}
          </div>
        )}
      </div>
      {/* Edit Modal */}
      <AnimatePresence>
        {showEdit && (
          <EditCommunityMenu
            community={CommunitySelected}
            onClose={() => setShowEdit(false)}
          />
        )}
      </AnimatePresence>

      {/* Members Modal */}
      <AnimatePresence>
        {showMembers && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          >
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="bg-white rounded-2xl p-6 w-full max-w-2xl relative shadow-lg">
              <button onClick={() => setShowMembers(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition">&times;</button>

              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Community Members</h3>

              <div className="flex gap-3 justify-center mb-4">
                <button onClick={() => setActiveMemberTab('all')} className={`px-4 py-1 rounded ${activeMemberTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  All
                </button>
                <button onClick={() => setActiveMemberTab('admins')} className={`px-4 py-1 rounded ${activeMemberTab === 'admins' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  Admins
                </button>
                <button onClick={() => setActiveMemberTab('owner')} className={`px-4 py-1 rounded ${activeMemberTab === 'owner' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  Owner
                </button>
              </div>

              <input type="text" placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400" />

              <div className="max-h-[480px] overflow-y-auto space-y-4 pr-2">
                {filteredMembers?.map((member) => {
                  if (!member) return null
                  const currentIsAdmin = isAdmin(member?._id)
                  const currentIsOwner = isOwner(member?._id)

                  return (
                    <div key={member?._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm">
                      <Link href={user?._id === member?._id ? '/Pages/Profile' : `/Pages/User/${member?._id}`} className="flex items-center gap-4">
                        <Image src={member?.profilePhoto?.url || '/default-avatar.png'} alt="Member" width={48} height={48} className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400" loading="lazy" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            {member?.username}
                            {currentIsOwner && <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">Owner</span>}
                            {currentIsAdmin && !currentIsOwner && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Admin</span>}
                          </p>
                          <p className="text-xs text-gray-500">{member?.profileName}</p>
                        </div>
                      </Link>

                      {(isOwner(user?._id) || isAdmin(user?._id)) && !currentIsOwner && (
                        <div className="flex gap-3 items-center">
                          <button onClick={() => handleMakeAdmin(CommunitySelected._id, member?._id)} title={currentIsAdmin ? 'Remove Admin' : 'Make Admin'} className="text-yellow-500 hover:text-yellow-600 transition transform hover:scale-110">
                            <FaCrown size={18} />
                          </button>
                          <button onClick={() => handleRemoveMember(CommunitySelected._id, member?._id)} className="text-red-500 hover:text-red-600 transition transform hover:scale-110" title="Remove Member">
                            <FaTrashAlt size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Requests Modal */}
      <AnimatePresence>
        {showRequests && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
          >
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="bg-white rounded-2xl p-6 w-full max-w-2xl relative shadow-lg">
              <button onClick={() => setShowRequests(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition">&times;</button>

              <h3 className="text-2xl font-bold text-center text-gray-900 mb-6">Join Requests</h3>

              <div className="max-h-[480px] overflow-y-auto space-y-4 pr-2">
                {CommunitySelected?.joinRequests?.length > 0 ? (
                  CommunitySelected.joinRequests.map((req) => (
                    <div key={req?._id} className="flex items-center justify-between p-3 bg-gray-100 rounded-lg shadow-sm">
                      <Link href={`/Pages/User/${req?._id}`} className="flex items-center gap-4">
                        <Image src={req?.profilePhoto?.url || '/default-avatar.png'} alt="Member" width={48} height={48} className="w-12 h-12 rounded-full object-cover ring-2 ring-yellow-400" loading="lazy" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900">{req?.username}</p>
                          <p className="text-xs text-gray-500">{req?.profileName}</p>
                        </div>
                      </Link>
                      <div className="flex gap-3 items-center">
                        <button onClick={() => handleApprove(CommunitySelected._id, req?._id)} className="text-green-500 hover:text-green-600 transition transform hover:scale-110" title="Approve">
                          <FaCheck size={18} />
                        </button>
                        <button onClick={() => handleReject(CommunitySelected._id, req?._id)} className="text-red-500 hover:text-red-600 transition transform hover:scale-110" title="Reject">
                          <FaTimes size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-gray-500 py-12">{t("No pending requests.")}</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showRules && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-xl relative shadow-lg"
            >
              {/* زر الإغلاق */}
              <button
                onClick={() => setShowRules(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition"
              >
                &times;
              </button>

              <h3 className="text-2xl font-bold text-center text-gray-900 dark:text-white mb-6 flex items-center justify-center gap-2">
                <FaBook /> {t("Community Rules")}
              </h3>

              {CommunitySelected?.rules?.length > 0 ? (
                <ul className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {CommunitySelected.rules.map((rule, index) => (
                    <li key={index} className="flex gap-3 items-start bg-gray-100 dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                      <span className="font-bold text-blue-600 dark:text-blue-400">{index + 1}.</span>
                      <p className="text-sm text-gray-900 dark:text-gray-200">{rule}</p>
                    </li>
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
  )
}

export default DasignCommunitySelect