'use client';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { useCommunity } from '@/app/Context/CommunityContext';
import { usePost } from '@/app/Context/PostContext';
import Loading from '@/app/Component/Loading';
import DesignCommunitySelect from './Design';

// ✅ مكون الهيكل العظمي منفصل ومذكّر (memo)
// ✅ Premium Skeleton Loader for Community Page
const SkeletonCover = () => (
  <div className="animate-pulse space-y-8">
    <div className="relative h-[45vh] lg:h-[60vh] min-h-[400px] w-full bg-gray-800/20 rounded-b-[3rem] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
      <div className="absolute bottom-16 left-6 lg:left-12 flex flex-col md:flex-row items-center md:items-end gap-10">
        <div className="w-40 h-40 lg:w-48 lg:h-48 rounded-[2.5rem] bg-gray-700/30 border-[6px] border-[#050505]" />
        <div className="flex-1 space-y-4">
          <div className="h-4 w-24 bg-gray-700/30 rounded-full" />
          <div className="h-12 w-64 lg:w-96 bg-gray-700/50 rounded-2xl" />
          <div className="flex gap-4">
            <div className="h-6 w-20 bg-gray-700/30 rounded-full" />
            <div className="h-6 w-20 bg-gray-700/30 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const Page = ({ params }) => {
  const id = params?.id;
  const {
    communities,
    joinToCommunity,
    sendJoinRequest,
    approveJoinRequest,
    rejectJoinRequest,
    removeMember,
    makeAdmin,
  } = useCommunity();
  const { user } = useAuth();
  const { posts } = usePost();

  // 🧠 استخدم useState للحالة المحلية فقط
  const [CommunitySelected, setCommunitySelected] = useState(null);
  const [showEdit, setShowEdit] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMemberTab, setActiveMemberTab] = useState('all');

  // 🧩 تحديد المجتمع المطلوب فقط عند تغيّر id أو القائمة
  useEffect(() => {
    if (communities?.length && id) {
      const matched = communities.find((c) => c?._id === id);
      setCommunitySelected(matched || null);
    }
  }, [communities, id]);

  // 🧩 فلترة المنشورات بالمجتمع المحدد فقط
  const postsFiltered = useMemo(() => {
    if (!posts?.length || !id) return [];
    return posts.filter((post) => post?.community?._id === id);
  }, [posts, id]);

  // 🧩 تثبيت حسابات الـ owner/admins باستخدام useMemo
  const ownerId = useMemo(
    () => CommunitySelected?.owner?._id || CommunitySelected?.owner,
    [CommunitySelected]
  );

  const adminIdsSet = useMemo(() => {
    const admins = CommunitySelected?.Admins || [];
    return new Set(admins.map((a) => (a?._id || a).toString()));
  }, [CommunitySelected]);

  const isOwner = useCallback(
    (memberId) =>
      !!(memberId && ownerId && memberId.toString() === ownerId.toString()),
    [ownerId]
  );

  const isAdmin = useCallback(
    (memberId) => !!(memberId && adminIdsSet.has(memberId.toString())),
    [adminIdsSet]
  );

  // 🧩 فلترة الأعضاء (مكلفة → استخدم useMemo)
  const filteredMembers = useMemo(() => {
    if (!CommunitySelected?.members) return [];
    const base = CommunitySelected.members.filter(Boolean);

    const q = searchTerm.trim().toLowerCase();
    const byQuery = q
      ? base.filter(
        (m) =>
          (m?.username || '').toLowerCase().includes(q) ||
          (m?.profileName || '').toLowerCase().includes(q)
      )
      : base;

    if (activeMemberTab === 'admins') return byQuery.filter((m) => isAdmin(m._id));
    if (activeMemberTab === 'owner') return byQuery.filter((m) => isOwner(m._id));
    return byQuery;
  }, [CommunitySelected, searchTerm, activeMemberTab, isAdmin, isOwner]);

  // 🧠 تحسين دوال الأحداث باستخدام useCallback لتثبيتها
  const handleJoinToggle = useCallback(() => {
    if (!CommunitySelected || !user) return;

    if (CommunitySelected.members?.some((m) => m?._id === user?._id)) {
      joinToCommunity(CommunitySelected._id); // leave
    } else {
      if (CommunitySelected.isPrivate) sendJoinRequest(CommunitySelected._id);
      else joinToCommunity(CommunitySelected._id);
    }
  }, [CommunitySelected, user, joinToCommunity, sendJoinRequest]);

  const handleMakeAdmin = useCallback(
    (communityId, memberId) => makeAdmin(communityId, memberId),
    [makeAdmin]
  );

  const handleRemoveMember = useCallback(
    (communityId, memberId) => removeMember(communityId, memberId),
    [removeMember]
  );

  const handleApprove = useCallback(
    (communityId, memberId) => approveJoinRequest(communityId, memberId),
    [approveJoinRequest]
  );

  const handleReject = useCallback(
    (communityId, memberId) => rejectJoinRequest(communityId, memberId),
    [rejectJoinRequest]
  );

  const isJoined = useMemo(
    () => CommunitySelected?.members?.some((m) => m?._id === user?._id),
    [CommunitySelected, user]
  );

  const hasPendingRequest = useMemo(
    () => CommunitySelected?.joinRequests?.some((r) => r?._id === user?._id),
    [CommunitySelected, user]
  );

  // ✅ أثناء التحميل
  if (!CommunitySelected) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <SkeletonCover />
        <div className="container mx-auto px-6 mt-12">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <DesignCommunitySelect
      user={user}
      id={id}
      isAdmin={isAdmin}
      isOwner={isOwner}
      posts={posts}
      CommunitySelected={CommunitySelected}
      setCommunitySelected={setCommunitySelected}
      postsFiltered={postsFiltered}
      showEdit={showEdit}
      setShowEdit={setShowEdit}
      showMembers={showMembers}
      setShowMembers={setShowMembers}
      showRequests={showRequests}
      setShowRequests={setShowRequests}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      activeMemberTab={activeMemberTab}
      setActiveMemberTab={setActiveMemberTab}
      showRules={showRules}
      setShowRules={setShowRules}
      isJoined={isJoined}
      hasPendingRequest={hasPendingRequest}
      handleJoinToggle={handleJoinToggle}
      handleMakeAdmin={handleMakeAdmin}
      handleRemoveMember={handleRemoveMember}
      handleApprove={handleApprove}
      handleReject={handleReject}
      filteredMembers={filteredMembers}
    />
  );
};

Page.displayName = 'Page';

export default React.memo(Page);
