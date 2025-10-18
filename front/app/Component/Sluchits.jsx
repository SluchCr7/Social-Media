'use client';
import React, { useEffect } from 'react';
import { useFeedData } from '../Custome/useFeedData';
import { usePost } from '../Context/PostContext';
import { useAuth } from '../Context/AuthContext';
import { useUser } from '../Context/UserContext';
import { useCommunity } from '../Context/CommunityContext';
import { useGetData } from '../Custome/useGetData';
import SluchitEntry from './SluchitEntry';
import PostSkeleton from '../Skeletons/PostSkeleton';
import { SuggestionRow } from './SuggestedRow';
import { useTranslation } from 'react-i18next';

const Sluchits = ({ activeTab }) => {
  const { posts, isLoading, fetchPosts, hasMore, setPage, page } = usePost();
  const { user } = useAuth();
  const { suggestedUsers } = useUser();
  const { communities } = useCommunity();
  const { userData } = useGetData(user?._id);
  const { t } = useTranslation();

  const following = Array.isArray(userData?.following)
    ? userData.following
    : [];

  const { combinedItems, lastItemRef } = useFeedData({
    posts,
    following,
    activeTab,
    userData,
    suggestedUsers,
    communities,
    hasMore,
    isLoading,
    setPage,
  });

  // 🔁 جلب الصفحة التالية عند التمرير
  useEffect(() => {
    if (page > 1) fetchPosts(page);
  }, [page]);

  if (isLoading && combinedItems.length === 0)
    return (
      <div className="w-full flex flex-col gap-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <PostSkeleton key={i} className="animate-pulse" />
        ))}
      </div>
    );

  if (!isLoading && combinedItems.length === 0)
    return (
      <div className="text-center py-16 text-gray-400">
        <p className="text-lg font-medium">No posts yet 💤</p>
        <p className="text-sm text-gray-500">
          Start following people or join a community!
        </p>
      </div>
    );

  return (
    <div className="w-full flex flex-col gap-8">
      {combinedItems.map((item, i) => {
        const isLast = i === combinedItems.length - 1;

        if (item.type === 'post') {
          return (
            <SluchitEntry
              ref={isLast ? lastItemRef : null}
              key={item.data._id}
              post={item.data}
            />
          );
        }

        const title =
          item.type === 'user'
            ? t('People you may like')
            : t('Explore new communities');

        return (
          <div key={`suggestion-${i}`} className="flex flex-col gap-3 px-1">
            <h2 className="text-base font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-1">
              {item.type === 'user' ? '✨' : '🌐'} <span>{title}</span>
            </h2>
            <SuggestionRow type={item.type} data={item.data} />
          </div>
        );
      })}

      {isLoading && (
        <div className="flex justify-center py-4">
          <span className="loader border-4 border-gray-300 border-t-blue-500 rounded-full w-6 h-6 animate-spin"></span>
        </div>
      )}
    </div>
  );
};

export default Sluchits;
