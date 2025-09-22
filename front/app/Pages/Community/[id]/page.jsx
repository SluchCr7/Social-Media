'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '@/app/Context/AuthContext'
import { useCommunity } from '@/app/Context/CommunityContext'
import { usePost } from '@/app/Context/PostContext'
import Loading from '@/app/Component/Loading'
import DasignCommunitySelect from './Dasign'



const SkeletonCover = () => (
  <div className="animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-b-xl" />
    <div className="-mt-12 ml-6 w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md" />
  </div>
)

const Page = ({ params }) => {
  const id = params?.id
  const {
    communities,
    joinToCommunity,
    sendJoinRequest,
    approveJoinRequest,
    rejectJoinRequest,
    removeMember,
    makeAdmin,
  } = useCommunity()
  const { user } = useAuth()
  const { posts } = usePost()

  const [CommunitySelected, setCommunitySelected] = useState(null)
  const [postsFiltered, setPostsFiltered] = useState([])
  const [showEdit, setShowEdit] = useState(false)
  const [showMembers, setShowMembers] = useState(false)
  const [showRequests, setShowRequests] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeMemberTab, setActiveMemberTab] = useState('all') // all | admins | owner
  const [showRules, setShowRules] = useState(false); // حالة عرض rules

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
  const hasPendingRequest = CommunitySelected?.joinRequests?.some((r) => r?._id === user?._id)

  const handleJoinToggle = () => {
    if (!CommunitySelected || !user) return;

    if (isJoined) {
      // 🚀 لو هو عضو بالفعل → يخرج
      joinToCommunity(CommunitySelected._id);
    } else {
      // 🚀 لو مش عضو
      if (CommunitySelected.isPrivate) {
        sendJoinRequest(CommunitySelected._id);
      } else {
        joinToCommunity(CommunitySelected._id);
      }
    }
  };


  const handleMakeAdmin = (communityId, memberId) => {
    makeAdmin(communityId, memberId)
  }

  const handleRemoveMember = (communityId, memberId) => {
    removeMember(communityId, memberId)
  }

  const handleApprove = (communityId, memberId) => {
    approveJoinRequest(communityId, memberId)
  }

  const handleReject = (communityId, memberId) => {
    rejectJoinRequest(communityId, memberId)
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
    <DasignCommunitySelect 
        user={user}
        id={id}
        isAdmin={isAdmin}
        isOwner={isOwner}
        posts={posts}
        CommunitySelected={CommunitySelected} setCommunitySelected={setCommunitySelected}
        postsFiltered={postsFiltered} setPostsFiltered={setPostsFiltered}
        showEdit={showEdit} setShowEdit={setShowEdit}
        showMembers={showMembers} setShowMembers={setShowMembers}
        showRequests={showRequests} setShowRequests={setShowRequests}
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        activeMemberTab={activeMemberTab} setActiveMemberTab={setActiveMemberTab}
        showRules={showRules} setShowRules={setShowRules}
        isJoined={isJoined} hasPendingRequest={hasPendingRequest}
        handleJoinToggle={handleJoinToggle}
        handleMakeAdmin={handleMakeAdmin}
        handleRemoveMember={handleRemoveMember}
        handleApprove={handleApprove}
        handleReject={handleReject}filteredMembers={filteredMembers}
    />
  )
}

export default Page