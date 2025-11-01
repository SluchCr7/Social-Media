'use client';
import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { useAuth } from '@/app/Context/AuthContext';
import { useCommunity } from '@/app/Context/CommunityContext';
import { usePost } from '@/app/Context/PostContext';
import Loading from '@/app/Component/Loading';
import DasignCommunitySelect from './Dasign';

// ✅ مكون الهيكل العظمي منفصل ومذكّر (memo)
const SkeletonCover = () => (
  <div className="animate-pulse">
    <div className="w-full h-48 bg-gray-200 rounded-b-xl" />
    <div className="-mt-12 ml-6 w-24 h-24 rounded-full bg-gray-200 border-4 border-white shadow-md" />
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
      <div className="flex justify-center items-center min-h-[80vh] text-gray-500 w-full">
        <div className="w-full max-w-5xl mx-auto p-4">
          <SkeletonCover />
          <div className="mt-6">
            <Loading />
          </div>
        </div>
      </div>
    );
  }

  return (
    <DasignCommunitySelect
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
