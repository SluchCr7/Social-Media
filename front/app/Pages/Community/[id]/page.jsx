// 'use client'

// import React, { useEffect, useState } from 'react'
// import Image from 'next/image'
// import { useAuth } from '@/app/Context/AuthContext'
// import { useCommunity } from '@/app/Context/CommunityContext'
// import { usePost } from '@/app/Context/PostContext'
// import SluchitEntry from '@/app/Component/SluchitEntry'
// import EditCommunityMenu from '@/app/Component/EditCommunityMenu'
// import Loading from '@/app/Component/Loading'

// import {
//   FaPlus,
//   FaEdit,
//   FaUsers,
//   FaTrashAlt,
//   FaCrown,
//   FaUser,
// } from 'react-icons/fa'

// const ActionButton = ({ children, onClick, variant = 'primary' }) => {
//   const styles = {
//     primary: 'bg-blue-600 hover:bg-blue-700',
//     danger: 'bg-red-600 hover:bg-red-700',
//     warning: 'bg-yellow-500 hover:bg-yellow-600',
//     dark: 'bg-gray-800 hover:bg-gray-900',
//   }
//   return (
//     <button
//       onClick={onClick}
//       className={`flex items-center gap-2 text-sm ${styles[variant]} text-white py-1.5 px-4 rounded-md transition`}
//     >
//       {children}
//     </button>
//   )
// }

// const Page = ({ params }) => {
//   const id = params?.id
//   const [CommunitySelected, setCommunitySelected] = useState(null)
//   const { communities, joinToCommunity, removeMember, makeAdmin } = useCommunity()
//   const { user } = useAuth()
//   const { posts } = usePost()

//   const [postsFiltered, setPostsFiltered] = useState([])
//   const [showEdit, setShowEdit] = useState(false)
//   const [showMembers, setShowMembers] = useState(false)
//   const [searchTerm, setSearchTerm] = useState('')

//   useEffect(() => {
//     const matched = communities?.find((c) => c?._id === id)
//     if (matched) setCommunitySelected(matched)
//   }, [communities, id])

//   useEffect(() => {
//     const filtered = posts?.filter((post) => post?.community?._id === id)
//     setPostsFiltered(filtered)
//   }, [posts, id])

//   if (!CommunitySelected) {
//     return (
//       <div className="flex justify-center items-center min-h-[100vh] text-gray-500 w-full">
//         <Loading />
//       </div>
//     )
//   }

//   const isOwner = (memberId) => {
//     return CommunitySelected.owner === memberId || CommunitySelected.owner?._id === memberId
//   }

//   const isAdmin = (memberId) =>
//     CommunitySelected?.Admins?.some((a) => a === memberId || a?._id === memberId)

//   const filteredMembers = CommunitySelected?.members?.filter(
//     (m) =>
//       m?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       m?.profileName?.toLowerCase().includes(searchTerm.toLowerCase())
//   )

//   const isJoined = CommunitySelected.members?.some((m) => m?._id === user?._id)

//   return (
//     <div className="w-[100%] md:w-[70%] max-w-5xl mx-auto text-lightMode-text dark:text-darkMode-text bg-lightMode-bg dark:bg-darkMode-bg min-h-screen">
//       {/* Cover Section */}
//       <div className="relative w-full">
//         <Image
//           src={CommunitySelected?.Cover?.url || '/default-cover.jpg'}
//           alt="Cover"
//           width={1200}
//           height={300}
//           className="w-full h-[200px] object-cover rounded-b-xl shadow"
//         />
//         <div className="absolute inset-0 bg-black/30 rounded-b-xl" />

//         <div className="absolute left-6 -bottom-12">
//           <Image
//             src={CommunitySelected?.Picture?.url || '/default-avatar.png'}
//             alt="Avatar"
//             width={100}
//             height={100}
//             className="w-24 h-24 rounded-full border-4 border-white dark:border-darkMode-bg object-cover shadow-md"
//           />
//         </div>
//       </div>

//       {/* Info Section */}
//       <div className="mt-20 px-4 flex flex-col gap-5">
//         <div className=" text-black dark:text-white">
//           <h1 className="text-2xl font-bold">
//             {CommunitySelected?.Name}{' '}
//             <span className="text-xs bg-white/30 px-2 py-0.5 rounded">
//               {CommunitySelected?.isPrivate ? 'Private' : 'Public'}
//             </span>
//           </h1>
//         </div>
//         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//           <div className="flex flex-wrap gap-2">
//             {(isOwner(user?._id) || isAdmin(user?._id)) && (
//               <>
//                 <ActionButton onClick={() => setShowEdit(true)} variant="warning">
//                   <FaEdit /> Edit
//                 </ActionButton>
//                 <ActionButton onClick={() => setShowMembers(true)} variant="dark">
//                   <FaUsers /> Members
//                 </ActionButton>
//               </>
//             )}
//             {!isOwner(user?._id) && (
//               <ActionButton
//                 onClick={() => joinToCommunity(CommunitySelected?._id)}
//                 variant={isJoined ? 'danger' : 'primary'}
//               >
//                 <FaPlus /> {isJoined ? 'Leave' : 'Join'}
//               </ActionButton>
//             )}
//           </div>
//         </div>

//         {/* Description */}
//         {CommunitySelected?.description && (
//           <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed">
//             {CommunitySelected.description}
//           </p>
//         )}

//         {/* Members Summary */}
//         <div className="flex items-center justify-between gap-3">
//           <p className="text-sm text-gray-500 flex items-center gap-2">
//             <FaUser /> {CommunitySelected?.members?.length || 0} Members
//           </p>
//           <div className="flex -space-x-3">
//             {CommunitySelected?.members?.slice(0, 5).map((member) => (
//               <Image
//                 key={member?._id}
//                 src={member?.profilePhoto?.url || '/default-avatar.png'}
//                 alt="Member"
//                 width={30}
//                 height={30}
//                 className="w-9 h-9 rounded-full border-2 border-white dark:border-darkMode-bg object-cover shadow"
//               />
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Divider */}
//       <hr className="my-6 border-lightMode-fg/20 dark:border-darkMode-fg/20 mx-4" />

//       {/* Posts Section */}
//       <div className="px-4 flex flex-col gap-6 pb-10">
//         {postsFiltered?.length > 0 ? (
//           postsFiltered.map((post) => <SluchitEntry post={post} key={post?._id} />)
//         ) : (
//           <div className="text-center text-gray-400 text-sm py-12 bg-gray-100 dark:bg-darkMode-menu rounded-lg">
//             This community has no posts yet.
//           </div>
//         )}
//       </div>

//       {/* Edit Modal */}
//       {showEdit && (
//         <EditCommunityMenu
//           community={CommunitySelected}
//           onClose={() => setShowEdit(false)}
//         />
//       )}

//       {/* Members Modal */}
//       {showMembers && (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center">
//           <div className="bg-white dark:bg-darkMode-menu rounded-2xl p-6 w-full max-w-2xl relative shadow-lg border dark:border-gray-700">
            
//             <button
//               onClick={() => setShowMembers(false)}
//               className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition"
//             >
//               &times;
//             </button>

//             <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
//               Community Members
//             </h3>

//             <input
//               type="text"
//               placeholder="Search members..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-darkMode-bg focus:outline-none focus:ring-2 focus:ring-blue-400"
//             />

//             <div className="max-h-[500px] overflow-y-auto space-y-4 pr-2">
//               {filteredMembers?.map((member) => {
//                 if (!member) return null;
//                 const isMemberAdmin = isAdmin(member?._id);
//                 const isCurrentOwner = isOwner(member?._id);
//                 return (
//                   <div
//                     key={member?._id}
//                     className="flex items-center justify-between p-3 bg-gray-50 dark:bg-darkMode-bg rounded-lg shadow-sm"
//                   >
//                     <div className="flex items-center gap-4">
//                       <Image
//                         src={member?.profilePhoto?.url || '/default-avatar.png'}
//                         alt="Member"
//                         width={48}
//                         height={48}
//                         className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400"
//                       />
//                       <div>
//                         <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
//                           {member?.username}
//                           {isCurrentOwner && (
//                             <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">
//                               Owner
//                             </span>
//                           )}
//                           {isMemberAdmin && !isCurrentOwner && (
//                             <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
//                               Admin
//                             </span>
//                           )}
//                         </p>
//                         <p className="text-xs text-gray-500">{member?.profileName}</p>
//                       </div>
//                     </div>

//                     {(isOwner(user?._id) || isAdmin(user?._id)) && !isCurrentOwner && (
//                       <div className="flex gap-3 items-center">
//                         <button
//                           onClick={() => makeAdmin(CommunitySelected?._id, member?._id)}
//                           title={isMemberAdmin ? 'Remove Admin' : 'Make Admin'}
//                           className="text-yellow-500 hover:text-yellow-600 transition transform hover:scale-110"
//                         >
//                           <FaCrown size={18} />
//                         </button>
//                         <button
//                           onClick={() => removeMember(CommunitySelected?._id, member?._id)}
//                           className="text-red-500 hover:text-red-600 transition transform hover:scale-110"
//                           title="Remove Member"
//                         >
//                           <FaTrashAlt size={16} />
//                         </button>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// export default Page;

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
    <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-b-xl" />
    <div className="-mt-12 ml-6 w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 border-4 border-white dark:border-darkMode-bg shadow-md" />
  </div>
)

const Page = ({ params }) => {
  const id = params?.id
  const { communities, setCommunities, joinToCommunity, removeMember, makeAdmin } = useCommunity()
  const { user } = useAuth()
  const { posts } = usePost()

  const [CommunitySelected, setCommunitySelected] = useState(null)
  const [postsFiltered, setPostsFiltered] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeMemberTab, setActiveMemberTab] = useState('all') // all | admins | owner

  useEffect(() => {
    const matched = communities?.find((c) => c?._id === id)
    if (matched) setCommunitySelected(matched)
  }, [communities, id])

  useEffect(() => {
    const filtered = posts?.filter((post) => post?.community?._id === id)
    setPostsFiltered(filtered)
  }, [posts, id])

  // Derived ids and helpers memoized for performance
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

  // Optimistic UI for join/leave
  const handleJoinToggle = async () => {
    try {
      // immediate local update for perceived snappiness
      setCommunities((prev) =>
        prev.map((c) =>
          c._id === CommunitySelected._id
            ? {
                ...c,
                members: isJoined
                  ? c.members.filter((m) => m?._id !== user._id)
                  : [...(c.members || []), { _id: user._id, username: user.username, profileName: user.profileName, profilePhoto: user.profilePhoto }],
              }
            : c
        )
      )

      // call actual API (joinToCommunity is expected to handle server call)
      await joinToCommunity(CommunitySelected._id)
    } catch (err) {
      console.error(err)
      // could revert local change here if needed
    }
  }

  const handleMakeAdmin = async (communityId, memberId) => {
    // optimistic update
    setCommunities((prev) =>
      prev.map((c) =>
        c._id === communityId
          ? {
              ...c,
              Admins: c.Admins?.includes(memberId)
                ? c.Admins.filter((a) => a !== memberId)
                : [...(c.Admins || []), memberId],
            }
          : c
      )
    )

    try {
      await makeAdmin(communityId, memberId)
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemoveMember = async (communityId, memberId) => {
    // optimistic
    setCommunities((prev) => prev.map((c) => (c._id === communityId ? { ...c, members: c.members.filter((m) => m._id !== memberId) } : c)))
    try {
      await removeMember(communityId, memberId)
    } catch (err) {
      console.error(err)
    }
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
              className="w-24 h-24 rounded-full border-4 border-white dark:border-darkMode-bg object-cover shadow-md"
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
        <div className="text-black dark:text-white flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-3">
            {CommunitySelected?.Name}
            <span className="text-xs bg-white/30 px-2 py-0.5 rounded">{CommunitySelected?.isPrivate ? 'Private' : 'Public'}</span>
          </h1>
          <div className="text-sm text-gray-500">Created: {new Date(CommunitySelected?.createdAt).toLocaleDateString()}</div>
        </div>

        <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words leading-relaxed bg-gray-50 dark:bg-darkMode-menu p-4 rounded-md">
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
                    className="w-9 h-9 rounded-full border-2 border-white dark:border-darkMode-bg object-cover shadow"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>

            <button onClick={() => setShowMembers(true)} className="text-sm px-3 py-1 rounded-md bg-white/10">
              See all
            </button>
          </div>
        </div>
      </div>

      <hr className="my-6 border-lightMode-fg/20 dark:border-darkMode-fg/20 mx-4" />

      {/* Posts Section */}
      <div className="px-4 flex flex-col gap-6 pb-10">
        {postsFiltered?.length > 0 ? (
          postsFiltered.map((post) => <SluchitEntry post={post} key={post?._id} />)
        ) : (
          <div className="text-center text-gray-400 text-sm py-12 bg-gray-100 dark:bg-darkMode-menu rounded-lg">
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
            <motion.div initial={{ y: 20 }} animate={{ y: 0 }} exit={{ y: 20 }} className="bg-white dark:bg-darkMode-menu rounded-2xl p-6 w-full max-w-2xl relative shadow-lg border dark:border-gray-700">
              <button onClick={() => setShowMembers(false)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl transition">&times;</button>

              <h3 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">Community Members</h3>

              <div className="flex gap-3 justify-center mb-4">
                <button onClick={() => setActiveMemberTab('all')} className={`px-4 py-1 rounded ${activeMemberTab === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-darkMode-bg'}`}>
                  All
                </button>
                <button onClick={() => setActiveMemberTab('admins')} className={`px-4 py-1 rounded ${activeMemberTab === 'admins' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-darkMode-bg'}`}>
                  Admins
                </button>
                <button onClick={() => setActiveMemberTab('owner')} className={`px-4 py-1 rounded ${activeMemberTab === 'owner' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-darkMode-bg'}`}>
                  Owner
                </button>
              </div>

              <input type="text" placeholder="Search members..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full mb-6 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-darkMode-bg focus:outline-none focus:ring-2 focus:ring-blue-400" />

              <div className="max-h-[480px] overflow-y-auto space-y-4 pr-2">
                {filteredMembers?.map((member) => {
                  if (!member) return null
                  const currentIsAdmin = isAdmin(member?._id)
                  const currentIsOwner = isOwner(member?._id)

                  return (
                    <div key={member?._id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-darkMode-bg rounded-lg shadow-sm">
                      <div className="flex items-center gap-4">
                        <Image src={member?.profilePhoto?.url || '/default-avatar.png'} alt="Member" width={48} height={48} className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-400" loading="lazy" />
                        <div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                            {member?.username}
                            {currentIsOwner && <span className="text-xs bg-yellow-500 text-white px-2 py-0.5 rounded-full">Owner</span>}
                            {currentIsAdmin && !currentIsOwner && <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">Admin</span>}
                          </p>
                          <p className="text-xs text-gray-500">{member?.profileName}</p>
                        </div>
                      </div>

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
