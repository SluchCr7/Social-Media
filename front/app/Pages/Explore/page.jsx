'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNews } from '@/app/Context/NewsContext';
import { useExplore } from '@/app/Context/ExploreContext';
import { useSearch } from '@/app/Context/SearchContext';
import DesignExplore from './DesignExplore';
import { useUser } from '@/app/Context/UserContext';
import { useGetData } from '@/app/Custome/useGetData';
import ExploreSkeleton from '@/app/Skeletons/ExploreSkeleton';

const ExplorePage = () => {
  const { user } = useAuth();
  const { suggestedUsers: defaultSuggestedUsers } = useUser();
  const { news } = useNews();
  const {
    explorePosts,
    suggestedUsers: exploreSuggestedUsers,
    trendingHashtags,
    loading: exploreLoading,
    exploreTab,
    setExploreTab,
    pagination,
    loadMoreExplore
  } = useExplore();

  const { searchQuery, setSearchQuery, searchResults } = useSearch();

  // User data from hook - ensures we have refreshed user data
  const { userData, loading: userLoading } = useGetData(user?._id);

  // Suggested Users
  const suggestedUsersArr = useMemo(() => {
    const activeList = exploreSuggestedUsers?.length > 0 ? exploreSuggestedUsers : defaultSuggestedUsers;
    if (!Array.isArray(activeList)) return [];
    return activeList.slice(0, 12);
  }, [exploreSuggestedUsers, defaultSuggestedUsers]);

  // Create Interest Tabs
  const interestTabs = useMemo(() => {
    if (!news?.length || !userData?.interests?.length) return [];

    const lowerTitles = news.map(item => ({
      ...item,
      lowerTitle: item.title?.toLowerCase() || '',
    }));

    return userData.interests
      .filter(Boolean)
      .slice(0, 3) // Show top 3 interests
      .map((interest) => {
        const interestLower = interest.toLowerCase();
        const relatedNews = lowerTitles.filter(item =>
          item.lowerTitle.includes(interestLower)
        );
        return relatedNews.length > 0 ? { name: interest, news: relatedNews } : null;
      })
      .filter(Boolean);
  }, [news, userData?.interests]);

  // Final Tabs (News + Interests)
  const finalTabs = useMemo(
    () => [
      { name: 'News', news: news || [] },
      ...interestTabs
    ],
    [news, interestTabs]
  );

  // Active Tab State (matches the UI tabs in DesignExplore)
  const [activeTab, setActiveTab] = useState('Trending');

  // Sync activeTab with exploreContext's exploreTab
  useEffect(() => {
    const tabMapping = {
      'Trending': 'trending',
      'Photos': 'photos',
      'Videos': 'videos',
      'Hashtags': 'tags',
      'Creators': 'users'
    };
    const mapped = tabMapping[activeTab];
    if (mapped) {
      setExploreTab(mapped);
    }
  }, [activeTab, setExploreTab]);

  // Fallback check
  useEffect(() => {
    const defaultTabs = ['Trending', 'Hashtags', 'Photos', 'Videos', 'Creators'];
    const currentTabExists = finalTabs.some(tab => tab.name === activeTab) || defaultTabs.includes(activeTab);

    if (!currentTabExists && finalTabs.length > 0) {
      setActiveTab(finalTabs[0].name);
    }
  }, [finalTabs, activeTab]);

  // Format trending hashtags for child components
  const formattedHashtags = useMemo(() => {
    if (!Array.isArray(trendingHashtags)) return [];
    return trendingHashtags.map(h => [h.name, h.count]);
  }, [trendingHashtags]);

  // Handle Search Change
  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val);
  }, [setSearchQuery]);

  // Loading State
  if (userLoading && !userData) {
    return <ExploreSkeleton />;
  }

  return (
    <DesignExplore
      user={userData || user}
      search={searchQuery}
      setSearch={handleSearchChange}
      searchResults={searchResults}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      finalTabs={finalTabs}
      topHashtags={formattedHashtags}
      suggestedUsersArr={suggestedUsersArr}
      posts={explorePosts}
      loading={exploreLoading}
      hasMore={pagination.hasMore}
      loadMore={loadMoreExplore}
    />
  );
};

export default ExplorePage;
