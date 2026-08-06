'use client';
import React, {
  useMemo,
  useRef,
  useCallback,
  useEffect,
  useState
} from 'react';
import Image from 'next/image'; // لاستخدام صورة Next.js بشكل مُحسّن
import SluchitEntry from './SluchitEntry';
import { usePost } from '../Context/PostContext';
import { useAuth } from '../Context/AuthContext';
import PostSkeleton from '../Skeletons/PostSkeleton';
import { useCommunity } from '../Context/CommunityContext';
import { SuggestionRow } from './SuggestedRow';
import { useUser } from '../Context/UserContext';
import { useGetData } from '../Custome/useGetData';
import { useTranslation } from 'react-i18next';

const Sluchits = ({ activeTab }) => {
  const { posts, isLoading, fetchPosts, hasMore, setPage, page, isLoadingPostCreated } = usePost();
  const { user, users } = useAuth();
  const { suggestedUsers } = useUser();
  const { communities } = useCommunity();
  const { userData, loading } = useGetData(user?._id);
  const { t } = useTranslation();

  // 📝 استخلاص قوائم المتابعة والعضوية
  const followingIds = useMemo(() => {
    if (!Array.isArray(userData?.following)) return new Set();
    return new Set(userData.following.map(f => f?.toString()));
  }, [userData?.following]);

  const userId = userData?._id?.toString();

  // 🎯 فلترة وترتيب المنشورات
  const filteredPosts = useMemo(() => {
    if (!Array.isArray(posts)) return [];

    // 🟢 Following feed
    if (activeTab === 'following') {
      return posts
        .slice()
        .sort((a, b) => {
          const isAFollowed = followingIds.has(a?.owner?._id?.toString());
          const isBFollowed = followingIds.has(b?.owner?._id?.toString());
          if (isAFollowed && !isBFollowed) return -1;
          if (!isAFollowed && isBFollowed) return 1;
          return new Date(b?.createdAt) - new Date(a?.createdAt);
        });
    }

    // 🟣 For You feed
    if (activeTab === 'forYou') {
      if (!userData?.interests || userData.interests.length === 0) {
        return posts
          .slice()
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      }

      return posts
        .map(post => {
          const text = `
            ${post?.text || ''}
            ${post?.Hashtags?.join(' ') || ''}
            ${post?.owner?.description || ''}
          `.toLowerCase();

          let score = 0;
          userData.interests.forEach(interest => {
            if (interest && text.includes(interest.toLowerCase())) score += 1;
          });

          return { post, score };
        })
        .sort((a, b) => {
          if (a.score !== b.score) return b.score - a.score;
          return new Date(b.post.createdAt) - new Date(a.post.createdAt);
        })
        .map(item => item.post);
    }

    // 🟡 Default feed
    return posts
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, followingIds, activeTab, userData?.interests]);

  // 🔹 فلترة المستخدمين المقترحين
  const filteredUsers = useMemo(() => {
    if (!Array.isArray(users) || !userId) return [];

    return users.filter(u => {
      if (u?._id?.toString() === userId) return false;
      return !followingIds.has(u?._id?.toString());
    });
  }, [users, followingIds, userId]);

  // 🔹 فلترة المجتمعات المقترحة
  const filteredCommunities = useMemo(() => {
    if (!Array.isArray(communities) || !userId) return [];

    return communities.filter(c => {
      if (c?.owner?._id?.toString() === userId) return false;
      return !c.members?.some(member => {
        const memberId = member?._id?.toString() || member?.toString();
        return memberId === userId;
      });
    });
  }, [communities, userId]);

  // 📦 دمج المنشورات مع الاقتراحات بشكل ديناميكي
  const combinedItems = useMemo(() => {
    if (!Array.isArray(filteredPosts)) return [];

    const items = [];
    let userSuggestions = [...filteredUsers];
    let communitySuggestions = [...filteredCommunities];

    const USER_INTERVAL = 10;
    const COMMUNITY_INTERVAL = 18;

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

  // 🔁 Infinite Scroll محسّن
  const observer = useRef();
  const lastItemRef = useCallback(
    node => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  return (
    <div className="w-full flex flex-col gap-8">
      {/* ⏳ حالة التحميل الأولية */}
      {combinedItems.length === 0 && isLoading && (
        Array.from({ length: 4 }).map((_, i) => (
          <PostSkeleton key={i} className="animate-pulse" />
        ))
      )}

      {/* 📜 عرض المحتوى */}
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

          // عرض الاقتراحات
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
          /* 🚫 حالة الفراغ الاحترافية (Empty State) باستخدام صورة الـ unDraw */
          <div className="flex flex-col items-center justify-center text-center py-16 px-4 my-6 bg-[#121212] border border-gray-800 rounded-2xl shadow-lg">
            <div className="relative w-64 h-64 mb-6">
              <Image
                src="/no_posts.svg" // استبدل هذا المسار باسم ومسار الصورة الفعلية في مجلد public لديك (مثال: /no-posts.svg)
                alt="No posts found"
                fill
                className="object-contain opacity-85 hover:opacity-100 transition-opacity duration-300"
                priority
              />
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-2">
              {t("No posts yet 💤")}
            </h3>
            <p className="text-sm text-gray-400 max-w-sm mb-6">
              {t("It looks very quiet here! Start following new people or join some communities to fill your feed with exciting content.")}
            </p>
          </div>
        )
      )}

      {/* ⚡ مؤشر تحميل في الأسفل */}
      {isLoading && hasMore && (
        <div className="flex justify-center py-4">
          <span className="loader border-4 border-gray-300 border-t-blue-500 rounded-full w-6 h-6 animate-spin"></span>
        </div>
      )}
    </div>
  );
};

export default Sluchits;