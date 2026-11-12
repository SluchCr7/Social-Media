'use client';
import React, { useEffect, useMemo, useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/app/redux/hooks';
import { useCommunity } from '@/app/redux/hooks';
import { useFeedback } from '@/app/redux/hooks';
import Loading from '@/app/Component/Loading';
import DesignCommunitySelect from './Design';
import api from '@/app/utils/api';
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
    communities,
    fetchCommunityById,
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

  const [CommunitySelected, setCommunitySelected] = useState(null);
  useDocumentTitle(CommunitySelected?.Name || null);
  const [communityLoading, setCommunityLoading] = useState(true);
  const [communityError, setCommunityError] = useState(null);
  const [postsFiltered, setPostsFiltered] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [postsPage, setPostsPage] = useState(1);
  const [postsTotalPages, setPostsTotalPages] = useState(1);
  const [postsTotal, setPostsTotal] = useState(0);
  const [showEdit, setShowEdit] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeMemberTab, setActiveMemberTab] = useState('all');
  const postsRequest = useRef(null);

  useEffect(() => {
    let active = true;
    setCommunitySelected(null);
    setCommunityError(null);
    setCommunityLoading(true);
    fetchCommunityById(id)
      .then((community) => {
        if (active) setCommunitySelected(community);
      })
      .catch((error) => {
        console.error('Could not load community:', error);
        if (active) setCommunityError(error?.response?.data?.message || 'Could not load this community.');
      })
      .finally(() => {
        if (active) setCommunityLoading(false);
      });
    return () => {
      active = false;
    };
  }, [fetchCommunityById, id]);

  useEffect(() => {
    const updated = communities.find((community) =>
      community?._id === id && Array.isArray(community.members)
    );
    if (updated) setCommunitySelected(updated);
  }, [communities, id]);

  const communityUpdatedAt = communities.find((community) => community?._id === id)?.updatedAt;
  useEffect(() => {
    if (!CommunitySelected || !communityUpdatedAt || communityUpdatedAt === CommunitySelected.updatedAt) return;
    fetchCommunityById(id)
      .then(setCommunitySelected)
      .catch((error) => console.error('Could not refresh community details:', error));
  }, [CommunitySelected, communityUpdatedAt, fetchCommunityById, id]);

  const isJoined = useMemo(() => {
    const currentUserId = user?._id?.toString();
    return Boolean(currentUserId && (
      CommunitySelected?.isMember ||
      CommunitySelected?.members?.some((member) =>
        (member?._id || member)?.toString() === currentUserId
      )
    ));
  }, [CommunitySelected, user?._id]);

  const loadCommunityPosts = useCallback(async (pageNum = 1) => {
    postsRequest.current?.abort();
    const controller = new AbortController();
    postsRequest.current = controller;
    setPostsLoading(true);
    setPostsError(null);
    try {
      const { data } = await api.get(`/post/community/${id}`, {
        params: { page: pageNum, limit: 10 },
        signal: controller.signal,
      });
      if (postsRequest.current !== controller) return;
      setPostsFiltered((current) => pageNum === 1 ? data.posts || [] : [...current, ...(data.posts || [])]);
      setPostsPage(Number(data.page) || pageNum);
      setPostsTotalPages(Number(data.pages) || 0);
      setPostsTotal(Number(data.total) || 0);
    } catch (error) {
      if (controller.signal.aborted) return;
      console.error('Could not load community posts:', error);
      setPostsError(error?.response?.data?.message || 'Could not load community posts.');
    } finally {
      if (postsRequest.current === controller) {
        postsRequest.current = null;
        setPostsLoading(false);
      }
    }
  }, [id]);

  const hasCommunity = Boolean(CommunitySelected);
  useEffect(() => {
    if (hasCommunity && (!CommunitySelected.isPrivate || isJoined)) {
      loadCommunityPosts(1);
    } else {
      setPostsFiltered([]);
      setPostsTotal(0);
    }
    return () => postsRequest.current?.abort();
  }, [hasCommunity, CommunitySelected?.isPrivate, isJoined, loadCommunityPosts]);

  useEffect(() => () => postsRequest.current?.abort(), []);

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

    const action = isJoined
      ? joinToCommunity(CommunitySelected._id)
      : CommunitySelected.isPrivate
        ? sendJoinRequest(CommunitySelected._id)
        : joinToCommunity(CommunitySelected._id);
    return action
      .then((succeeded) => {
        if (!succeeded) return;
        if (!isJoined && CommunitySelected.isPrivate) {
          setCommunitySelected((current) => ({ ...current, hasPendingRequest: true }));
        } else if (isJoined && CommunitySelected.isPrivate) {
          setCommunitySelected((current) => ({
            ...current,
            isMember: false,
            hasPendingRequest: false,
            members: undefined,
            Admins: undefined,
            joinRequests: undefined,
          }));
        }
      })
      .catch(() => {});
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
      setCommunitySelected={setCommunitySelected}
      postsFiltered={postsFiltered}
      postsLoading={postsLoading}
      postsError={postsError}
      postsTotal={postsTotal}
      hasMorePosts={postsPage < postsTotalPages}
      loadMorePosts={() => loadCommunityPosts(postsPage + 1)}
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
