'use client';
import React, { useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/redux/hooks';
import { useCommunity } from '@/app/redux/hooks';
import { useFeedback } from '@/app/redux/hooks';
import Loading from '@/app/Component/Loading';
import DesignCommunitySelect from './Design';
import { useGetCommunityPostsInfiniteQuery } from '@/app/redux/features/posts/postsApi';
import { useGetCommunityByIdQuery } from '@/app/redux/features/communities/communitiesApi';
import Link from 'next/link';
import useDocumentTitle from '@/app/hooks/useDocumentTitle';

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
    joinToCommunity,
    sendJoinRequest,
    approveJoinRequest,
    rejectJoinRequest,
    removeMember,
    makeAdmin,
  } = useCommunity();
  const { user } = useAuth();
  const { showAlert } = useFeedback();
  const { t } = useTranslation();
  const communityQuery = useGetCommunityByIdQuery({
    id,
    viewerId: user?._id || 'anonymous',
  }, { skip: !id });
  const CommunitySelected = communityQuery.currentData || null;
  useDocumentTitle(CommunitySelected?.Name || null);
  const communityLoading = communityQuery.isLoading || communityQuery.isFetching;
  const communityError = communityQuery.error
    ? communityQuery.error.data?.message || 'Could not load this community.'
    : null;
  const [showEdit, setShowEdit] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMemberTab, setActiveMemberTab] = useState('all');

  const isJoined = useMemo(() => {
    const currentUserId = user?._id?.toString();
    return Boolean(currentUserId && (
      CommunitySelected?.isMember ||
      CommunitySelected?.members?.some((member) =>
        (member?._id || member)?.toString() === currentUserId
      )
    ));
  }, [CommunitySelected, user?._id]);

  const communityPostsQuery = useGetCommunityPostsInfiniteQuery({
    communityId: id,
    viewerId: user?._id || 'anonymous',
    limit: 10,
  }, {
    skip: !CommunitySelected || (CommunitySelected.isPrivate && !isJoined),
  });
  const {
    fetchNextPage: fetchNextCommunityPostsPage,
    hasNextPage: hasMoreCommunityPosts,
    refetch: refetchCommunityPosts,
  } = communityPostsQuery;
  const postsFiltered = useMemo(
    () => communityPostsQuery.data?.pages?.flatMap((page) => page?.posts || []) || [],
    [communityPostsQuery.data]
  );
  const lastPostsPage = communityPostsQuery.data?.pages?.[
    communityPostsQuery.data.pages.length - 1
  ];
  const postsTotal = Number(lastPostsPage?.total) || 0;
  const postsLoading = communityPostsQuery.isLoading || communityPostsQuery.isFetchingNextPage;
  const postsError = communityPostsQuery.error?.data?.message
    || (communityPostsQuery.error ? 'Could not load community posts.' : null);
  const loadCommunityPosts = useCallback((pageNum = 1) => {
    if (pageNum === 1) return refetchCommunityPosts();
    if (hasMoreCommunityPosts) return fetchNextCommunityPostsPage();
  }, [
    fetchNextCommunityPostsPage,
    hasMoreCommunityPosts,
    refetchCommunityPosts,
  ]);

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

    return isJoined
      ? joinToCommunity(CommunitySelected._id)
      : CommunitySelected.isPrivate
        ? sendJoinRequest(CommunitySelected._id)
        : joinToCommunity(CommunitySelected._id);
  }, [CommunitySelected, user, isJoined, joinToCommunity, sendJoinRequest]);

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

  const handleShare = useCallback(async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: CommunitySelected.Name,
          text: CommunitySelected.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showAlert(t('Community link copied.'));
      }
    } catch (error) {
      if (error?.name !== 'AbortError') {
        console.error('Could not share community:', error);
        showAlert(t('Could not share this community.'));
      }
    }
  }, [CommunitySelected, showAlert, t]);

  const hasPendingRequest = useMemo(
    () => CommunitySelected?.hasPendingRequest || CommunitySelected?.joinRequests?.some(
      (request) => (request?._id || request)?.toString() === user?._id?.toString()
    ),
    [CommunitySelected, user]
  );

  if (communityLoading || (!CommunitySelected && !communityError)) {
    return (
      <div className="min-h-screen bg-[#050505] text-white">
        <SkeletonCover />
        <div className="container mx-auto px-6 mt-12">
          <Loading />
        </div>
      </div>
    );
  }

  if (communityError || !CommunitySelected) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 bg-gray-50 px-6 text-center dark:bg-[#080808]">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">{t(communityError || 'Community not found')}</h1>
        <Link href="/Pages/CommunityMain" className="rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white">
          {t('Explore communities')}
        </Link>
      </div>
    );
  }

  return (
    <DesignCommunitySelect
      user={user}
      id={id}
      isAdmin={isAdmin}
      isOwner={isOwner}
      CommunitySelected={CommunitySelected}
      postsFiltered={postsFiltered}
      postsLoading={postsLoading}
      postsError={postsError}
      postsTotal={postsTotal}
      hasMorePosts={Boolean(communityPostsQuery.hasNextPage)}
      loadMorePosts={() => loadCommunityPosts((lastPostsPage?.page || 1) + 1)}
      retryPosts={() => loadCommunityPosts(1)}
      onShare={handleShare}
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
