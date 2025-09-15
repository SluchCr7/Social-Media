'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/app/Context/AuthContext'
import { useCommunity } from '@/app/Context/CommunityContext'
import { usePost } from '@/app/Context/PostContext'
import SluchitEntry from '@/app/Component/SluchitEntry'
import EditCommunityMenu from '@/app/Component/EditCommunityMenu'
import Loading from '@/app/Component/Loading'
import { FaPlus, FaEdit, FaUsers, FaTrashAlt, FaCrown, FaUser } from 'react-icons/fa'
import { HiOutlineDotsVertical } from 'react-icons/hi'
import Link from 'next/link'

// Small reusable action button
const ActionButton = ({ children, onClick, variant = 'primary', className = '' }) => {
  const styles = {
    primary: 'bg-blue-600 hover:bg-blue-700',
    danger: 'bg-red-600 hover:bg-red-700',
    warning: 'bg-yellow-500 hover:bg-yellow-600',
    dark: 'bg-gray-800 hover:bg-gray-900',
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

const SkeletonCover = () => (
  <div className="animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-b-xl" />
    <div className="-mt-12 ml-6 w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md" />
  </div>
)

const Page = ({ params }) => {
  const id = params?.id
  const { communities, joinToCommunity, removeMember, makeAdmin } = useCommunity()
  const { user } = useAuth()
  const { posts } = usePost()

  const [CommunitySelected, setCommunitySelected] = useState(null)
  const [postsFiltered, setPostsFiltered] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeMemberTab, setActiveMemberTab] = useState('all') // all | admins | owner

  // Fetch community
  useEffect(() => {
    const matched = communities?.find((c) => c?._id === id)
    if (matched) setCommunitySelected(matched)
  }, [communities, id])

  // Filter posts by community
  useEffect(() => {
    const filtered = posts?.filter((post) => post?.community?._id === id)
    setPostsFiltered(filtered)
  }, [posts, id])

  // Memoized owner/admin sets
  const ownerId = useMemo(() => CommunitySelected?.owner?._id || CommunitySelected?.owner, [CommunitySelected])
  const adminIdsSet = useMemo(() => new Set((CommunitySelected?.Admins || []).map(a => (a?._id || a).toString())), [CommunitySelected])

  const isOwner = (memberId) => (memberId && ownerId && memberId.toString() === ownerId.toString())
  const isAdmin = (memberId) => memberId && adminIdsSet.has(memberId.toString())

  const filteredMembers = useMemo(() => {
    if (!CommunitySelected?.members) return []

    const base = CommunitySelected.members.filter(Boolean)
    const q = searchTerm.trim().toLowerCase()
    const byQuery = q
      ? base.filter(
          (m) =>
            (m?.username || '').toLowerCase().includes(q) ||
            (m?.profileName || '').toLowerCase().includes(q)
        )
      : base

    if (activeMemberTab === 'admins') return byQuery.filter((m) => isAdmin(m._id))
    if (activeMemberTab === 'owner') return byQuery.filter((m) => isOwner(m._id))
    return byQuery
  }, [CommunitySelected, searchTerm, activeMemberTab])

  const isJoined = CommunitySelected?.members?.some((m) => m?._id === user?._id)

  const handleJoinToggle = () => {
    if (!CommunitySelected || !user) return
    joinToCommunity(CommunitySelected._id)
  }

  const handleMakeAdmin = (communityId, memberId) => {
    makeAdmin(communityId, memberId)
  }

  const handleRemoveMember = (communityId, memberId) => {
    removeMember(communityId, memberId)
  }

  if (!CommunitySelected) {
    return (
      <div className="flex justify-center items-center min-h-[80vh] text-gray-500 w-full">
        <div className="w-full max-w-5xl mx-auto p-4">
          <SkeletonCover />
          <div className="mt-6">
            <Loading />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full md:w-[75%] max-w-5xl mx-auto text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen pb-12">
      <Head>
        <title>{CommunitySelected?.Name} — Community</title>
        <meta name="description" content={CommunitySelected?.description || `${CommunitySelected?.Name} community`} />
      </Head>

      {/* Cover Section */}
      <div className="relative w-full">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative">
          <Image
            src={CommunitySelected?.Cover?.url || '/default-cover.jpg'}
            alt="Cover"
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
              alt="Avatar"
              width={100}
              height={100}
              className="w-24 h-24 rounded-full border-4 border-white object-cover shadow-md"
              loading="lazy"
            />
          </div>

          <div className="absolute right-6 bottom-6 flex items-center gap-3">
            {(isOwner(user?._id) || isAdmin(user?._id)) && (
              <ActionButton onClick={() => setShowEdit(true)} variant="warning">
                <FaEdit /> Edit
              </ActionButton>
            )}

            {!isOwner(user?._id) && (
              <ActionButton onClick={handleJoinToggle} variant={isJoined ? 'danger' : 'primary'}>
                <FaPlus /> {isJoined ? 'Leave' : 'Join'}
              </ActionButton>
            )}

            <div className="bg-white/10 p-2 rounded-md shadow hidden sm:block">
              <button title="More" className="p-2 rounded-md hover:bg-white/5">
                <HiOutlineDotsVertical />
              </button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Info Section */}
      <div className="mt-20 px-4 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {CommunitySelected?.Name}
            <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">{CommunitySelected?.isPrivate ? 'Private' : 'Public'}</span>
          </h1>
          <div className="text-sm text-gray-500">Created: {new Date(CommunitySelected?.createdAt).toLocaleDateString()}</div>
        </div>

        <p className="text-sm text-gray-700 whitespace-pre-wrap break-words leading-relaxed bg-white p-4 rounded-md shadow-sm">
          {CommunitySelected.description}
        </p>

        {/* Members Summary */}
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <FaUser /> {CommunitySelected?.members?.length || 0} Members
          </p>

          <div className="flex items-center gap-2">
            <div className="flex -space-x-3">
              {CommunitySelected?.members?.slice(0, 5).map((member) => (
                <div key={member?._id} className="relative">
                  <Image
                    src={member?.profilePhoto?.url || '/default-avatar.png'}
                    alt={member?.username}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full border-2 border-white object-cover shadow"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <button onClick={() => setShowMembers(true)} className="text-sm px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300">
              See all
            </button>
          </div>
        </div>
      </div>

      <hr className="my-6 border-gray-300 mx-4" />

      {/* Posts Section */}
      <div className="px-4 flex flex-col gap-6 pb-10">
        {postsFiltered?.length > 0 ? (
          postsFiltered.map((post) => <SluchitEntry post={post} key={post?._id} />)
        ) : (
          <div className="text-center text-sm py-12  rounded-lg shadow-sm">
            This community has no posts yet.
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
    </div>
  )
}

export default Page
