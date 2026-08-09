'use client';
import React, {
  useMemo,
  useRef,
  useCallback,
} from 'react';
import Image from 'next/image';
import SluchitEntry from './SluchitEntry';
import { usePost } from '../Context/PostContext';
import { useAuth } from '../Context/AuthContext';
import PostSkeleton from '../Skeletons/PostSkeleton';
import { useCommunity } from '../Context/CommunityContext';
import { SuggestionRow } from './SuggestedRow';
import { useUser } from '../Context/UserContext';
import { useGetData } from '../Custome/useGetData';
import { useTranslation } from 'react-i18next';
import { UserPlus, Sparkles } from 'lucide-react';

const Sluchits = ({ activeTab = 'following' }) => {
  const { posts, isLoading, hasMore, setPage } = usePost();
  const { user, users } = useAuth();
  const { setShowAllSuggestedUsers } = useUser();
  const { communities } = useCommunity();
  const { userData } = useGetData(user?._id);
  const { t } = useTranslation();

  // 📝 Comprehensive following IDs normalization (supports raw IDs and populated user objects)
  const followingIds = useMemo(() => {
    const ids = new Set();
    const currentFollowing = userData?.following || user?.following || [];

    if (Array.isArray(currentFollowing)) {
      currentFollowing.forEach((f) => {
        if (!f) return;
        if (typeof f === 'string') ids.add(f);
        else if (f._id) ids.add(f._id.toString());
        else if (f.id) ids.add(f.id.toString());
      });
    }
    return ids;
  }, [userData?.following, user?.following]);

  const currentUserId = (user?._id || userData?._id)?.toString();

  // 🎯 Pro Feed Filtering & Algorithmic Ranking (Twitter / Threads style)
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts) || posts.length === 0) return [];

    // 🟢 FOLLOWING FEED (Strict Twitter standard: ONLY accounts you follow + your own posts)
    if (activeTab === 'following') {
      return posts
        .filter((post) => {
          if (!post || !post.owner) return false;
          const ownerId = post.owner._id?.toString() || post.owner.toString();
          if (!ownerId) return false;

          // Strictly include ONLY followed users or self
          return ownerId === currentUserId || followingIds.has(ownerId);
        })
        .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
    }

    // 🟣 FOR YOU FEED (Algorithmic recommendation engine)
    if (activeTab === 'forYou') {
      const userInterests = Array.isArray(userData?.interests)
        ? userData.interests.map((i) => i?.toLowerCase()).filter(Boolean)
        : [];

      const now = Date.now();

      return posts
        .slice()
        .map((post) => {
          if (!post) return { post, score: 0 };

          const ownerId = post.owner?._id?.toString() || post.owner?.toString();
          const isFollowedOrSelf = ownerId === currentUserId || (ownerId && followingIds.has(ownerId));

          // 1. Base affinity score (boost followed accounts & self)
          let affinityScore = isFollowedOrSelf ? 40 : 10;

          // 2. Interest / Keyword topic matching
          const postText = `
            ${post.text || ''}
            ${Array.isArray(post.Hashtags) ? post.Hashtags.join(' ') : ''}
            ${post.owner?.description || ''}
          `.toLowerCase();

          let interestScore = 0;
          userInterests.forEach((interest) => {
            if (interest && postText.includes(interest)) {
              interestScore += 35;
            }
          });

          // 3. Social engagement score (likes, hahas, comments, shares, views)
          const likesCount = Array.isArray(post.likes) ? post.likes.length : 0;
          const hahasCount = Array.isArray(post.hahas) ? post.hahas.length : 0;
          const commentsCount = Array.isArray(post.comments) ? post.comments.length : 0;
          const sharesCount = post.sharesCount || (post.isShared ? 1 : 0);
          const viewsCount = Array.isArray(post.views) ? post.views.length : 0;

          const engagementScore =
            likesCount * 3 +
            hahasCount * 2 +
            commentsCount * 4 +
            sharesCount * 5 +
            viewsCount * 0.2;

          // 4. Rich media bonus
          const mediaBonus = (post.media?.length > 0 || post.Photos?.length > 0) ? 15 : 0;

          // 5. Exponential recency decay (fresh posts get higher priority)
          const postDate = post.createdAt ? new Date(post.createdAt).getTime() : now;
          const hoursOld = Math.max(0, (now - postDate) / (1000 * 60 * 60));
          const recencyDecay = 1 / Math.pow(1 + hoursOld / 12, 1.2);

          const totalScore = (affinityScore + interestScore + engagementScore + mediaBonus) * recencyDecay;

          return { post, score: totalScore };
        })
        .sort((a, b) => {
          if (Math.abs(b.score - a.score) > 0.001) {
            return b.score - a.score;
          }
          return new Date(b.post?.createdAt || 0) - new Date(a.post?.createdAt || 0);
        })
        .map((item) => item.post);
    }

    // 🟡 Default Chronological Feed
    return posts
      .slice()
      .sort((a, b) => new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0));
  }, [posts, followingIds, activeTab, userData?.interests, currentUserId]);

  // 🔹 Filter suggested users (exclude self & already followed)
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users) || !currentUserId) return [];

    return users.filter((u) => {
      if (!u || !u._id) return false;
      const uId = u._id.toString();
      if (uId === currentUserId) return false;
      return !followingIds.has(uId);
    });
  }, [users, followingIds, currentUserId]);

  // 🔹 Filter suggested communities
  const filteredCommunities = useMemo(() => {
    if (!Array.isArray(communities) || !currentUserId) return [];

    return communities.filter((c) => {
      if (!c) return false;
      if (c?.owner?._id?.toString() === currentUserId) return false;
      return !c.members?.some((member) => {
        const memberId = member?._id?.toString() || member?.toString();
        return memberId === currentUserId;
      });
    });
  }, [communities, currentUserId]);

  // 📦 Dynamic stream batching (injecting user & community recommendations at regular intervals)
  const combinedItems = useMemo(() => {
    if (!Array.isArray(filteredPosts)) return [];

    const items = [];
    let userSuggestions = [...filteredUsers];
    let communitySuggestions = [...filteredCommunities];

    const USER_INTERVAL = 8;
    const COMMUNITY_INTERVAL = 16;

    filteredPosts.forEach((post, index) => {
      if (post) items.push({ type: 'post', data: post });

      if ((index + 1) % USER_INTERVAL === 0 && userSuggestions.length > 0) {
        const suggestionsBatch = userSuggestions.splice(0, 3);
        items.push({ type: 'user', data: suggestionsBatch });
      }

      if ((index + 1) % COMMUNITY_INTERVAL === 0 && communitySuggestions.length > 0) {
        const suggestionsBatch = communitySuggestions.splice(0, 3);
        items.push({ type: 'community', data: suggestionsBatch });
      }
    });

    return items;
  }, [filteredPosts, filteredUsers, filteredCommunities]);

  // 🔁 Infinite Scroll observer
  const observer = useRef();
  const lastItemRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, setPage]
  );

  return (
    <div className="w-full flex flex-col gap-8">
      {/* ⏳ Initial Loading State */}
      {combinedItems.length === 0 && isLoading && (
        Array.from({ length: 4 }).map((_, i) => (
          <PostSkeleton key={i} className="animate-pulse" />
        ))
      )}

      {/* 📜 Content Feed */}
      {combinedItems.length > 0 ? (
        combinedItems.map((item, i) => {
          const isLastItem = i === combinedItems.length - 1;
          if (item.type === 'post') {
            return (
              <SluchitEntry
                ref={isLastItem ? lastItemRef : null}
                key={item?.data?._id}
                post={item?.data}
              />
            );
          }

          // Suggestion Batches
          return (
            <div key={`suggestion-${i}`} className="flex flex-col gap-3 px-1">
              <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
                {item.type === 'user'
                  ? <>✨ <span>{t("People you may like")}</span></>
                  : <>🌐 <span>{t("Explore new communities")}</span></>}
              </h2>
              <SuggestionRow type={item?.type} data={item?.data} />
            </div>
          );
        })
      ) : (
        !isLoading && (
          /* 🚫 Professional Empty States (Tab Specific) */
          <div className="flex flex-col items-center justify-center text-center py-16 px-6 my-6 bg-white/70 dark:bg-white/[0.02] backdrop-blur-3xl border border-gray-100 dark:border-white/5 rounded-[2.5rem] shadow-xl">
            {activeTab === 'following' ? (
              <>
                <div className="w-20 h-20 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                  <UserPlus className="w-9 h-9 text-indigo-500" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {t("No posts from following yet")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6 leading-relaxed">
                  {t("When you follow creators, their latest posts will appear right here. Start connecting with minds across the grid!")}
                </p>
                <button
                  type="button"
                  onClick={() => setShowAllSuggestedUsers(true)}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-widest transition-all shadow-lg shadow-indigo-500/20"
                >
                  <Sparkles size={16} />
                  <span>{t("Discover Creators")}</span>
                </button>
              </>
            ) : (
              <>
                <div className="relative w-64 h-64 mb-6">
                  <Image
                    src="/no_posts.svg"
                    alt="No posts found"
                    fill
                    className="object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
                    priority
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-gray-200 mb-2">
                  {t("No posts yet 💤")}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                  {t("It looks very quiet here! Start following new people or join some communities to fill your feed with exciting content.")}
                </p>
              </>
            )}
          </div>
        )
      )}

      {/* ⚡ Loading Spinner at bottom */}
      {isLoading && hasMore && (
        <div className="flex justify-center py-4">
          <span className="loader border-4 border-gray-300 border-t-blue-500 rounded-full w-6 h-6 animate-spin"></span>
        </div>
      )}
    </div>
  );
};

export default Sluchits;