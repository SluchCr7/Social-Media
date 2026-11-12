'use client';

import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/app/redux/hooks';
import { useExplore } from '@/app/redux/hooks';
import { useSearch } from '@/app/redux/hooks';
import DesignExplore from './DesignExplore';

const ExplorePage = () => {
  const { user } = useAuth();
  const {
    explorePosts,
    suggestedUsers: exploreSuggestedUsers,
    trendingHashtags,
    loading: exploreLoading,
    exploreTab,
    setExploreTab,
    pagination,
    loadMoreExplore,
    error: exploreError,
    refreshExplore,
  } = useExplore();

  const suggestedUsersArr = useMemo(
    () => (Array.isArray(exploreSuggestedUsers) ? exploreSuggestedUsers.slice(0, 12) : []),
    [exploreSuggestedUsers]
  );

  const {
    searchQuery,
    setSearchQuery,
    searchResults,
    loading: searchLoading,
  } = useSearch();

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

  // Format trending hashtags for child components
  const formattedHashtags = useMemo(() => {
    if (!Array.isArray(trendingHashtags)) return [];
    return trendingHashtags.map(h => [h.name, h.count]);
  }, [trendingHashtags]);

  // Handle Search Change
  const handleSearchChange = useCallback((val) => {
    setSearchQuery(val);
  }, [setSearchQuery]);

  return (
    <DesignExplore
      user={user}
      search={searchQuery}
      setSearch={handleSearchChange}
      searchResults={searchResults}
      searchLoading={searchLoading}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      topHashtags={formattedHashtags}
      suggestedUsersArr={suggestedUsersArr}
      posts={explorePosts}
      loading={exploreLoading}
      error={exploreError}
      hasMore={pagination.hasMore}
      loadMore={loadMoreExplore}
      refreshExplore={refreshExplore}
    />
  );
};

export default ExplorePage;
